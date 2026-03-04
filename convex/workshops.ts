import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("workshops")
      .order("asc")
      .collect();
  },
});

export const listByStatus = query({
  args: {
    status: v.union(
      v.literal("upcoming"),
      v.literal("ongoing"),
      v.literal("completed"),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workshops")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("asc")
      .collect();
  },
});
