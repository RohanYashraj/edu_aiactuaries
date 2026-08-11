import { v } from "convex/values";
import { query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { contentTypeValidator } from "./schema";

/**
 * Public, unauthenticated reads. Writes live in contentAdmin.ts so that
 * "what can an anonymous caller reach?" is a one-file review.
 *
 * Every query here filters to status === "published"; drafts and scheduled
 * items are only reachable through the admin functions.
 */

export type ContentDoc = Doc<"content">;

/** Resolves Convex storage ids to served URLs so the client never has to. */
async function withImageUrls(ctx: QueryCtx, doc: ContentDoc) {
  const coverImageUrl = doc.coverImageId
    ? await ctx.storage.getUrl(doc.coverImageId)
    : null;

  const partners = doc.partners
    ? await Promise.all(
        doc.partners.map(async (partner) => ({
          ...partner,
          logoUrl: partner.logoStorageId
            ? await ctx.storage.getUrl(partner.logoStorageId)
            : null,
        })),
      )
    : undefined;

  return { ...doc, coverImageUrl, partners };
}

export type PublicContent = Awaited<ReturnType<typeof withImageUrls>>;

/** Editorially ordered list for a single type — used by /certifications. */
export const listByType = query({
  args: {
    type: contentTypeValidator,
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("content")
      .withIndex("by_type_status_order", (q) =>
        q.eq("type", args.type).eq("status", "published"),
      )
      .take(args.limit ?? 100);

    return Promise.all(docs.map((doc) => withImageUrls(ctx, doc)));
  },
});

/**
 * Chronological list for a single type, newest first. Used by /events,
 * /workshops and /news, where publication or start date beats manual order.
 */
export const listByTypeChronological = query({
  args: {
    type: contentTypeValidator,
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("content")
      .withIndex("by_type_status_startDate", (q) =>
        q.eq("type", args.type).eq("status", "published"),
      )
      .order("desc")
      .take(args.limit ?? 100);

    return Promise.all(docs.map((doc) => withImageUrls(ctx, doc)));
  },
});

/** Events and programs share the /events surface, so they list together. */
export const listEventsAndPrograms = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    const [events, programs] = await Promise.all([
      ctx.db
        .query("content")
        .withIndex("by_type_status_startDate", (q) =>
          q.eq("type", "event").eq("status", "published"),
        )
        .order("desc")
        .take(limit),
      ctx.db
        .query("content")
        .withIndex("by_type_status_startDate", (q) =>
          q.eq("type", "program").eq("status", "published"),
        )
        .order("desc")
        .take(limit),
    ]);

    // Undated items sort last rather than to the epoch.
    const merged = [...events, ...programs]
      .sort((a, b) => (b.startDate ?? -Infinity) - (a.startDate ?? -Infinity))
      .slice(0, limit);

    return Promise.all(merged.map((doc) => withImageUrls(ctx, doc)));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!doc || doc.status !== "published") return null;
    return withImageUrls(ctx, doc);
  },
});

/** Homepage showcase, ordered by the editor-assigned feature rank. */
export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_featured_rank", (q) =>
        q.eq("status", "published").eq("featured", true),
      )
      .take(args.limit ?? 12);

    return Promise.all(docs.map((doc) => withImageUrls(ctx, doc)));
  },
});

/** Everything published, newest first — the /news feed and "latest" strips. */
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .take(args.limit ?? 20);

    return Promise.all(docs.map((doc) => withImageUrls(ctx, doc)));
  },
});

/** Minimal projection for sitemap.ts and llms.txt — avoids shipping bodies. */
export const listForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .collect();

    return docs.map((doc) => ({
      type: doc.type,
      slug: doc.slug,
      title: doc.title,
      summary: doc.summary,
      updatedAt: doc.updatedAt,
      publishedAt: doc.publishedAt,
      noindex: doc.seo?.noindex ?? false,
    }));
  },
});

/** Slugs for generateStaticParams, per type. */
export const listSlugsByType = query({
  args: { type: contentTypeValidator },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("content")
      .withIndex("by_type_status_order", (q) =>
        q.eq("type", args.type).eq("status", "published"),
      )
      .collect();

    return docs.map((doc) => doc.slug);
  },
});
