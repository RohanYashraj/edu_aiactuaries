import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import {
  contentFields,
  contentPatchFields,
  contentStatusValidator,
  contentTypeValidator,
} from "./schema";
import { requireContentManager } from "./lib/auth";
import { ensureUniqueSlug } from "./lib/slug";

/**
 * Every function in this file is gated by `requireContentManager`. Keeping
 * writes out of content.ts makes the public API surface auditable at a glance.
 */

const MAX_REVISIONS = 20;

/**
 * The `details.kind` discriminator must agree with the top-level `type`.
 * Without this a "certification" could carry event details and every renderer
 * downstream would have to defend against it.
 */
function assertDetailsMatchType(
  type: Doc<"content">["type"],
  details: Doc<"content">["details"],
) {
  if (details.kind !== type) {
    throw new Error(
      `Content type "${type}" requires details.kind "${type}", got "${details.kind}"`,
    );
  }
}

/** Snapshots the document before it changes, keeping only the newest N. */
async function recordRevision(
  ctx: MutationCtx,
  doc: Doc<"content">,
  changedBy: Id<"users">,
  changeNote?: string,
) {
  await ctx.db.insert("contentRevisions", {
    contentId: doc._id,
    snapshot: doc,
    changedBy,
    changeNote,
    createdAt: Date.now(),
  });

  const revisions = await ctx.db
    .query("contentRevisions")
    .withIndex("by_contentId_createdAt", (q) => q.eq("contentId", doc._id))
    .order("desc")
    .collect();

  for (const stale of revisions.slice(MAX_REVISIONS)) {
    await ctx.db.delete(stale._id);
  }
}

async function withImageUrls(ctx: QueryCtx, doc: Doc<"content">) {
  return {
    ...doc,
    coverImageUrl: doc.coverImageId
      ? await ctx.storage.getUrl(doc.coverImageId)
      : null,
  };
}

/* -------------------------------------------------------------------------- */
/*  Reads (admin sees every status)                                           */
/* -------------------------------------------------------------------------- */

export const list = query({
  args: {
    type: v.optional(contentTypeValidator),
    status: v.optional(contentStatusValidator),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireContentManager(ctx);
    const limit = args.limit ?? 200;

    // by_type_status_order's ["type"] and ["type","status"] prefixes cover
    // both filtered shapes, so no extra index is needed.
    if (args.type) {
      const q = ctx.db
        .query("content")
        .withIndex("by_type_status_order", (idx) =>
          args.status
            ? idx.eq("type", args.type!).eq("status", args.status)
            : idx.eq("type", args.type!),
        );
      return await q.take(limit);
    }

    if (args.status) {
      return await ctx.db
        .query("content")
        .withIndex("by_status_publishedAt", (idx) => idx.eq("status", args.status!))
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("content")
      .withIndex("by_updatedAt")
      .order("desc")
      .take(limit);
  },
});

export const getById = query({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    await requireContentManager(ctx);
    const doc = await ctx.db.get(args.id);
    return doc ? withImageUrls(ctx, doc) : null;
  },
});

export const search = query({
  args: {
    term: v.string(),
    type: v.optional(contentTypeValidator),
    status: v.optional(contentStatusValidator),
  },
  handler: async (ctx, args) => {
    await requireContentManager(ctx);
    if (!args.term.trim()) return [];

    return await ctx.db
      .query("content")
      .withSearchIndex("search_content", (q) => {
        let builder = q.search("title", args.term);
        if (args.type) builder = builder.eq("type", args.type);
        if (args.status) builder = builder.eq("status", args.status);
        return builder;
      })
      .take(25);
  },
});

export const listRevisions = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    await requireContentManager(ctx);
    return await ctx.db
      .query("contentRevisions")
      .withIndex("by_contentId_createdAt", (q) => q.eq("contentId", args.contentId))
      .order("desc")
      .take(MAX_REVISIONS);
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    await requireContentManager(ctx);
    const docs = await ctx.db.query("content").collect();
    return {
      total: docs.length,
      published: docs.filter((d) => d.status === "published").length,
      draft: docs.filter((d) => d.status === "draft").length,
      scheduled: docs.filter((d) => d.status === "scheduled").length,
      archived: docs.filter((d) => d.status === "archived").length,
      featured: docs.filter((d) => d.featured && d.status === "published").length,
    };
  },
});

/* -------------------------------------------------------------------------- */
/*  Writes                                                                    */
/* -------------------------------------------------------------------------- */

export const create = mutation({
  args: { ...contentFields, slug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const actor = await requireContentManager(ctx);
    assertDetailsMatchType(args.type, args.details);

    const slug = await ensureUniqueSlug(ctx, args.slug || args.title);
    const now = Date.now();

    return await ctx.db.insert("content", {
      ...args,
      slug,
      publishedAt:
        args.status === "published" ? (args.publishedAt ?? now) : args.publishedAt,
      createdBy: actor._id,
      updatedBy: actor._id,
      updatedAt: now,
    });
  },
});

/**
 * Fields the editor is allowed to clear. Convex strips `undefined` out of
 * mutation arguments before they reach the handler, so "set this back to
 * empty" cannot be expressed by sending `undefined` — the key simply vanishes
 * and `db.patch` leaves the old value in place. Clearing has to be an explicit
 * instruction, which is what `unset` is.
 */
const UNSETTABLE_FIELDS = [
  "subtitle",
  "body",
  "badge",
  "coverImageId",
  "coverImagePath",
  "coverImageAlt",
  "startDate",
  "endDate",
  "dateLabel",
  "location",
  "featureRank",
  "scheduledFor",
  "seo",
  "linkedinUrl",
  "websiteUrl",
  "websiteLabel",
] as const;

type UnsettableField = (typeof UNSETTABLE_FIELDS)[number];

export const update = mutation({
  args: {
    id: v.id("content"),
    changeNote: v.optional(v.string()),
    patch: v.object(contentPatchFields),
    /** Names of fields to clear. See UNSETTABLE_FIELDS above. */
    unset: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const actor = await requireContentManager(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Content not found");

    const patch = args.patch as Partial<Doc<"content">>;

    // Reject unknown names rather than silently ignoring them, so a typo in
    // the editor surfaces instead of quietly failing to clear a field.
    for (const field of args.unset ?? []) {
      if (!UNSETTABLE_FIELDS.includes(field as UnsettableField)) {
        throw new Error(`Field "${field}" cannot be cleared`);
      }
      (patch as Record<string, undefined>)[field] = undefined;
    }

    const nextType = patch.type ?? existing.type;
    const nextDetails = patch.details ?? existing.details;
    assertDetailsMatchType(nextType, nextDetails);

    await recordRevision(ctx, existing, actor._id, args.changeNote);

    const slug =
      patch.slug && patch.slug !== existing.slug
        ? await ensureUniqueSlug(ctx, patch.slug, existing._id)
        : existing.slug;

    const nextStatus = patch.status ?? existing.status;
    const publishedAt =
      nextStatus === "published"
        ? (patch.publishedAt ?? existing.publishedAt ?? Date.now())
        : (patch.publishedAt ?? existing.publishedAt);

    await ctx.db.patch(args.id, {
      ...patch,
      slug,
      publishedAt,
      updatedBy: actor._id,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const setStatus = mutation({
  args: { id: v.id("content"), status: contentStatusValidator },
  handler: async (ctx, args) => {
    const actor = await requireContentManager(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Content not found");

    await recordRevision(ctx, existing, actor._id, `status → ${args.status}`);

    await ctx.db.patch(args.id, {
      status: args.status,
      publishedAt:
        args.status === "published"
          ? (existing.publishedAt ?? Date.now())
          : existing.publishedAt,
      updatedBy: actor._id,
      updatedAt: Date.now(),
    });

    return { slug: existing.slug, type: existing.type, status: args.status };
  },
});

export const setFeatured = mutation({
  args: {
    id: v.id("content"),
    featured: v.boolean(),
    featureRank: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const actor = await requireContentManager(ctx);
    await ctx.db.patch(args.id, {
      featured: args.featured,
      featureRank: args.featured ? (args.featureRank ?? 0) : undefined,
      updatedBy: actor._id,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    await requireContentManager(ctx);

    // Revisions are meaningless once the document is gone.
    const revisions = await ctx.db
      .query("contentRevisions")
      .withIndex("by_contentId_createdAt", (q) => q.eq("contentId", args.id))
      .collect();
    for (const revision of revisions) await ctx.db.delete(revision._id);

    await ctx.db.delete(args.id);
  },
});

export const restoreRevision = mutation({
  args: { revisionId: v.id("contentRevisions") },
  handler: async (ctx, args) => {
    const actor = await requireContentManager(ctx);
    const revision = await ctx.db.get(args.revisionId);
    if (!revision) throw new Error("Revision not found");

    const current = await ctx.db.get(revision.contentId);
    if (!current) throw new Error("Content no longer exists");

    await recordRevision(ctx, current, actor._id, "before restore");

    const snapshot = revision.snapshot as Doc<"content">;
    // System fields can't be patched back onto a document.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, _creationTime, ...restorable } = snapshot;

    await ctx.db.patch(revision.contentId, {
      ...restorable,
      updatedBy: actor._id,
      updatedAt: Date.now(),
    });

    return revision.contentId;
  },
});
