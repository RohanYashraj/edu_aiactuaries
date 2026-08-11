import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireContentManager } from "./lib/auth";

/**
 * Media library on top of Convex file storage. `_storage` records no filename,
 * alt text or uploader, so every upload is also registered in `mediaAssets` —
 * that is what makes alt text enforceable and the library browsable.
 */

/** Step 1: the client POSTs the file directly to this short-lived URL. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireContentManager(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/** Step 2: register the returned storageId with its metadata. */
export const register = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.optional(v.string()),
    size: v.optional(v.number()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requireContentManager(ctx);

    const existing = await ctx.db
      .query("mediaAssets")
      .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args });
      return existing._id;
    }

    return await ctx.db.insert("mediaAssets", {
      ...args,
      uploadedBy: actor._id,
      createdAt: Date.now(),
    });
  },
});

export const updateAlt = mutation({
  args: { id: v.id("mediaAssets"), alt: v.string() },
  handler: async (ctx, args) => {
    await requireContentManager(ctx);
    await ctx.db.patch(args.id, { alt: args.alt });
  },
});

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireContentManager(ctx);

    const assets = await ctx.db
      .query("mediaAssets")
      .withIndex("by_createdAt")
      .order("desc")
      .take(args.limit ?? 60);

    return Promise.all(
      assets.map(async (asset) => ({
        ...asset,
        url: await ctx.storage.getUrl(asset.storageId),
      })),
    );
  },
});

export const remove = mutation({
  args: { id: v.id("mediaAssets") },
  handler: async (ctx, args) => {
    await requireContentManager(ctx);
    const asset = await ctx.db.get(args.id);
    if (!asset) return;

    // Delete the blob first; the row is the only pointer to it.
    await ctx.storage.delete(asset.storageId);
    await ctx.db.delete(args.id);
  },
});
