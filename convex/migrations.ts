import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { roleValidator } from "./schema";
import { seedContentDocs } from "./seedData";
import { slugify } from "./lib/slug";

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

/* -------------------------------------------------------------------------- */
/*  Organisations                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Seeds the partner library from the logos that used to be a hardcoded array
 * in the homepage and about page.
 *
 * These keep `logoPath` pointing at /public rather than being uploaded, since
 * the files are already there. An editor replacing one uploads a file and the
 * storage id takes over.
 */
export const seedOrganizations = internalMutation({
  args: {},
  handler: async (ctx) => {
    const seeds = [
      {
        name: "Institute and Faculty of Actuaries",
        shortName: "IFoA",
        logoPath: "/ifoa.svg",
        website: "https://actuaries.org.uk",
        invertInDark: true,
      },
      {
        name: "Society of Actuaries",
        shortName: "SOA",
        logoPath: "/soa.png",
        website: "https://soa.org",
      },
      {
        name: "Casualty Actuarial Society",
        shortName: "CAS",
        logoPath: "/cas.png",
        website: "https://casact.org",
      },
      {
        name: "Institute of Actuaries of India",
        shortName: "IAI",
        logoPath: "/iai.png",
        website: "https://actuariesindia.org",
      },
      {
        name: "ACTEX Learning",
        shortName: "ACTEX",
        logoPath: "/actex.png",
        website: "https://actexlearning.com",
      },
      {
        name: "AI Actuaries",
        shortName: "AI Actuaries",
        logoPath: "/aiactuaries.png",
        website: "https://aiactuaries.org",
        featured: false,
      },
    ];

    let inserted = 0;
    for (const [index, seed] of seeds.entries()) {
      const slug = slugify(seed.name);
      const existing = await ctx.db
        .query("organizations")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (existing) continue;

      await ctx.db.insert("organizations", {
        name: seed.name,
        slug,
        shortName: seed.shortName,
        logoPath: seed.logoPath,
        logoAlt: `${seed.name} logo`,
        website: seed.website,
        invertInDark: seed.invertInDark,
        featured: seed.featured ?? true,
        order: index,
        updatedAt: Date.now(),
      });
      inserted += 1;
    }

    return { inserted, skipped: seeds.length - inserted };
  },
});

/** Links existing content partners to the library, matched on name. */
export const linkPartnersToOrganizations = internalMutation({
  args: {},
  handler: async (ctx) => {
    const orgs = await ctx.db.query("organizations").collect();
    const byName = new Map(orgs.map((org) => [org.name.toLowerCase(), org._id]));
    const byShort = new Map(
      orgs.filter((o) => o.shortName).map((o) => [o.shortName!.toLowerCase(), o._id]),
    );

    let linked = 0;
    for (const doc of await ctx.db.query("content").collect()) {
      if (!doc.partners?.length) continue;

      let changed = false;
      const partners = doc.partners.map((partner) => {
        if (partner.organizationId) return partner;
        const key = partner.name.toLowerCase();
        // Seeded partner names sometimes carry a suffix, e.g. "…(IFoA), UK".
        const match =
          byName.get(key) ??
          byShort.get(key) ??
          [...byName.entries()].find(([name]) => key.includes(name))?.[1];
        if (!match) return partner;
        changed = true;
        linked += 1;
        return { ...partner, organizationId: match };
      });

      if (changed) await ctx.db.patch(doc._id, { partners });
    }

    return { linked };
  },
});
