import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { requireContentManager } from "./lib/auth";
import { slugify } from "./lib/slug";

/**
 * Partner organisations and their logos.
 *
 * Reads are public — the homepage and about page render the recognition strip
 * from here. Writes require a content manager.
 */

async function withLogoUrl(ctx: QueryCtx, org: Doc<"organizations">) {
  return {
    ...org,
    logoUrl: org.logoStorageId
      ? await ctx.storage.getUrl(org.logoStorageId)
      : (org.logoPath ?? null),
  };
}

export type PublicOrganization = Awaited<ReturnType<typeof withLogoUrl>>;

/** Everything in the library, for the picker in the content editor. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const orgs = await ctx.db.query("organizations").withIndex("by_order").collect();
    return Promise.all(orgs.map((org) => withLogoUrl(ctx, org)));
  },
});

/** Just the ones flagged for the recognition strips. */
export const listFeatured = query({
  args: {},
  handler: async (ctx) => {
    const orgs = await ctx.db
      .query("organizations")
      .withIndex("by_featured_order", (q) => q.eq("featured", true))
      .collect();
    return Promise.all(orgs.map((org) => withLogoUrl(ctx, org)));
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    shortName: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    logoAlt: v.optional(v.string()),
    website: v.optional(v.string()),
    invertInDark: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const actor = await requireContentManager(ctx);

    const name = args.name.trim();
    if (!name) throw new Error("Name is required");

    const base = slugify(name) || "organisation";
    let slug = base;
    for (let suffix = 2; suffix < 100; suffix += 1) {
      const clash = await ctx.db
        .query("organizations")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (!clash) break;
      slug = `${base}-${suffix}`;
    }

    // Appended to the end of the manual order.
    const all = await ctx.db.query("organizations").collect();
    const order = all.reduce((max, org) => Math.max(max, org.order), -1) + 1;

    return await ctx.db.insert("organizations", {
      name,
      slug,
      shortName: args.shortName,
      logoStorageId: args.logoStorageId,
      logoAlt: args.logoAlt ?? `${name} logo`,
      website: args.website,
      invertInDark: args.invertInDark,
      featured: args.featured ?? false,
      order,
      createdBy: actor._id,
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("organizations"),
    name: v.optional(v.string()),
    shortName: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    logoAlt: v.optional(v.string()),
    website: v.optional(v.string()),
    invertInDark: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    order: v.optional(v.number()),
    /** Named fields to clear; Convex strips `undefined` out of arguments. */
    unset: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireContentManager(ctx);
    const { id, unset, ...rest } = args;

    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Organisation not found");

    const patch: Record<string, unknown> = { ...rest, updatedAt: Date.now() };
    for (const field of unset ?? []) {
      if (["shortName", "logoStorageId", "logoAlt", "website"].includes(field)) {
        patch[field] = undefined;
      }
    }

    await ctx.db.patch(id, patch);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("organizations") },
  handler: async (ctx, args) => {
    await requireContentManager(ctx);

    // Content referencing this organisation would lose its logo silently, so
    // say so rather than letting it happen.
    const content = await ctx.db.query("content").collect();
    const used = content.filter((doc) =>
      doc.partners?.some((partner) => partner.organizationId === args.id),
    );

    if (used.length > 0) {
      throw new Error(
        `Used by ${used.length} item${used.length === 1 ? "" : "s"}: ${used
          .map((d) => d.title)
          .slice(0, 3)
          .join(", ")}. Remove it there first.`,
      );
    }

    const org = await ctx.db.get(args.id);
    if (org?.logoStorageId) await ctx.storage.delete(org.logoStorageId);
    await ctx.db.delete(args.id);
  },
});
