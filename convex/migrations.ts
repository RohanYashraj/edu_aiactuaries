import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { roleValidator } from "./schema";
import { seedContentDocs } from "./seedData";

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

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Seeds the unified `content` table from what used to be hardcoded in TSX.
 * Idempotent: matches on slug and patches, so re-running never duplicates.
 * Editor-owned curation fields (status, featured, featureRank, order) are only
 * set on insert — re-running must not undo an editor's decisions.
 */
export const seedContent = internalMutation({
  args: { overwrite: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    let inserted = 0;
    let patched = 0;

    for (const doc of seedContentDocs) {
      const existing = await ctx.db
        .query("content")
        .withIndex("by_slug", (q) => q.eq("slug", doc.slug))
        .unique();

      if (existing) {
        if (!args.overwrite) continue;

        // Drop the curation fields: an editor may have changed them, and
        // re-running a seed must never silently revert that.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, featured, featureRank, order, ...editorial } = doc;
        await ctx.db.patch(existing._id, { ...editorial, updatedAt: now });
        patched += 1;
        continue;
      }

      await ctx.db.insert("content", {
        ...doc,
        publishedAt: doc.status === "published" ? now : undefined,
        updatedAt: now,
      });
      inserted += 1;
    }

    return { inserted, patched, skipped: seedContentDocs.length - inserted - patched };
  },
});

/* -------------------------------------------------------------------------- */
/*  Retiring the jobs feature                                                 */
/*                                                                            */
/*  The migrations that cleared the `jobs` table and the `employer` role have  */
/*  been removed: they referenced a table and a role literal that no longer    */
/*  exist in the schema, so they no longer compile.                           */
/*                                                                            */
/*  They cannot simply be kept, either — running a migration on a deployment  */
/*  requires deploying it first, and the deploy is exactly what fails while    */
/*  the old rows are still there. So on any deployment that still holds them   */
/*  (production has not been migrated), do this from the Convex dashboard      */
/*  BEFORE pushing this schema:                                               */
/*                                                                            */
/*    1. Data -> jobs -> Clear table. Convex refuses to drop a non-empty      */
/*       table, so the push fails otherwise.                                   */
/*    2. Data -> users -> delete the `system:ai-actuaries` row (synthetic; it  */
/*       existed only to own job listings) and set any remaining user whose    */
/*       role is "employer" to "member". Convex validates every existing row   */
/*       against the new schema on deploy, and "employer" is no longer a valid */
/*       role.                                                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Retiring the legacy content tables                                        */
/*                                                                            */
/*  `certifications` and `workshops` have been migrated into `content` and     */
/*  dropped from the schema, so clearLegacyTables no longer compiles and has   */
/*  been removed. On a deployment that still has them, run                     */
/*  migrateLegacyTables, then clear both tables from the Convex dashboard      */
/*  (Data -> table -> Clear table) before pushing this schema — Convex refuses */
/*  to drop a non-empty table.                                                 */
/* -------------------------------------------------------------------------- */
