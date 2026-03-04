import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const upsertFromClerk = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("member"), v.literal("employer")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        username: args.username,
        name: args.name,
        imageUrl: args.imageUrl,
        role: args.role,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      ...args,
      approvedAt: Date.now(),
    });
  },
});

export const deleteByClerkId = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (user) {
      await ctx.db.delete(user._id);
    }
    return null;
  },
});

export const getByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});

/**
 * Client-side sync fallback: reads identity from the verified JWT,
 * so it works in local dev without needing a webhook tunnel.
 * The webhook handler remains the primary sync for production.
 */
export const syncCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const clerkId = identity.subject;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    const userData = {
      clerkId,
      email: identity.email ?? "",
      username: identity.nickname ?? undefined,
      name: identity.name ?? "User",
      imageUrl: identity.pictureUrl ?? undefined,
      role: "member" as const,
    };

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: userData.email,
        username: userData.username,
        name: userData.name,
        imageUrl: userData.imageUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      ...userData,
      approvedAt: Date.now(),
    });
  },
});
