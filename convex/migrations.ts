import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { roleValidator } from "./schema";

/**
 * One-off maintenance mutations. All `internalMutation`, so none of them are
 * reachable from a browser — run them with:
 *
 *   npx convex run migrations:promoteToAdmin '{"email":"you@example.com"}'
 *
 * Every function here must be idempotent; they will be run more than once.
 */

/** Bootstrap the first admin. There is no in-app way to create one. */
export const promoteToAdmin = internalMutation({
  args: { email: v.string(), role: v.optional(roleValidator) },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error(
        `No user with email ${args.email}. Sign in once first so the user is synced into Convex.`,
      );
    }

    const role = args.role ?? "admin";
    if (user.role === role) return { userId: user._id, role, changed: false };

    await ctx.db.patch(user._id, { role, roleUpdatedAt: Date.now() });
    return { userId: user._id, role, changed: true };
  },
});

/**
 * Marks every pre-existing user as onboarded so the new onboarding gate only
 * applies to people who sign up from now on. Run once, before deploying the
 * gate, unless you actually want existing members re-profiled.
 */
export const backfillOnboardingComplete = internalMutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let patched = 0;
    for (const user of users) {
      if (user.onboardingCompletedAt === undefined) {
        await ctx.db.patch(user._id, { onboardingCompletedAt: user._creationTime });
        patched += 1;
      }
    }
    return { total: users.length, patched };
  },
});
