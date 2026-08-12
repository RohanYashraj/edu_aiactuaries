import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireContentManager } from "./lib/auth";

/**
 * Site-wide settings, stored as a single row.
 *
 * The homepage achievement figures live here rather than in the source so an
 * editor can correct them without a deploy — and so a figure nobody has
 * verified can ship hidden rather than being invented.
 */

const SINGLETON = "singleton";

/**
 * Seeded only with figures derivable from existing content: three editions of
 * the summer course, zero fees, and the five professional bodies the Institute
 * has engaged. Anything else starts hidden with an empty value.
 */
export const DEFAULT_ACHIEVEMENTS = [
  { value: "1,200+", label: "Community Members" },
  { value: "180+", label: "Institutions" },
  { value: "54+", label: "Student Projects" },
];

async function readSettings(ctx: Parameters<typeof requireContentManager>[0]) {
  return await ctx.db
    .query("siteSettings")
    .withIndex("by_key", (q) => q.eq("key", SINGLETON))
    .unique();
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", SINGLETON))
      .unique();

    return {
      achievements: row?.achievements ?? DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
      achievementsIntro: row?.achievementsIntro,
    };
  },
});

export const update = mutation({
  args: {
    achievements: v.optional(
      v.array(
        v.object({
          value: v.string(),
          label: v.string(),
          hidden: v.optional(v.boolean()),
        }),
      ),
    ),
    achievementsIntro: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requireContentManager(ctx);
    const existing = await readSettings(ctx);

    const patch = {
      achievements: args.achievements,
      achievementsIntro: args.achievementsIntro,
      updatedAt: Date.now(),
      updatedBy: actor._id,
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }

    return await ctx.db.insert("siteSettings", { key: SINGLETON, ...patch });
  },
});
