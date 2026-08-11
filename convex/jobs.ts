import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { requireRole, requireUser } from "./lib/auth";
import { slugify } from "./lib/slug";

/** Roles allowed to post and manage job listings. */
const POSTING_ROLES = ["employer", "admin"] as const;

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();
  },
});

export const listPublishedSummary = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .take(50);

    return jobs.map((job) => ({
      _id: job._id,
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      type: job.type,
      status: job.status,
      slug: job.slug,
    }));
  },
});

export const listPublishedPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getById = query({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

/** Slug lookup that refuses to serve drafts to the public detail page. */
export const getBySlugPublished = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const job = await ctx.db
      .query("jobs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    return job && job.status === "published" ? job : null;
  },
});

/** Homepage strip. Falls back to the newest published jobs if none are flagged. */
export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;
    const published = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .take(50);

    const featured = published.filter((job) => job.featured);
    return (featured.length > 0 ? featured : published).slice(0, limit);
  },
});

/** Slug + timestamps for the sitemap; avoids shipping full descriptions. */
export const listForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    return jobs
      .filter((job) => job.slug)
      .map((job) => ({
        slug: job.slug!,
        title: job.title,
        summary: job.summary ?? job.description.slice(0, 200),
        updatedAt: job.updatedAt ?? job._creationTime,
      }));
  },
});

export const listByEmployer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return [];

    return await ctx.db
      .query("jobs")
      .withIndex("by_employerId", (q) => q.eq("employerId", user._id))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    company: v.string(),
    location: v.string(),
    slug: v.optional(v.string()),
    type: v.union(
      v.literal("full-time"),
      v.literal("part-time"),
      v.literal("contract"),
      v.literal("internship"),
    ),
    periodStart: v.optional(v.string()),
    periodEnd: v.optional(v.string()),
    applicationDeadline: v.optional(v.string()),
    selectionCriteria: v.optional(v.string()),
    applicationUrl: v.optional(v.string()),
    commitmentHoursPerDay: v.optional(v.string()),
    eligibilityCriteria: v.optional(v.array(v.string())),
    weeklySchedule: v.optional(
      v.array(
        v.object({
          week: v.number(),
          title: v.string(),
          focus: v.string(),
          topics: v.array(v.string()),
          tools: v.array(v.string()),
          outcomes: v.array(v.string()),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    if (!POSTING_ROLES.includes(user.role as (typeof POSTING_ROLES)[number])) {
      throw new Error("Only employers can post jobs");
    }

    // Listings without a slug are only reachable by raw document id, which is
    // unshareable and unindexable. Derive one and keep it unique.
    const base = slugify(args.slug || `${args.title}-${args.company}`);
    let slug = base;
    for (let suffix = 2; suffix < 100; suffix += 1) {
      const clash = await ctx.db
        .query("jobs")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (!clash) break;
      slug = `${base}-${suffix}`;
    }

    return await ctx.db.insert("jobs", {
      ...args,
      slug,
      employerId: user._id,
      status: "draft",
      updatedAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("jobs"),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("closed"),
    ),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    const job = await ctx.db.get(args.id);
    if (!job) throw new Error("Job not found");

    // The owning employer, or an admin moderating the board.
    if (job.employerId !== user._id && user.role !== "admin") {
      throw new Error("Not authorised to modify this job");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      publishedAt:
        args.status === "published"
          ? (job.publishedAt ?? Date.now())
          : job.publishedAt,
      updatedAt: Date.now(),
    });
  },
});

/** Every listing regardless of status — the admin moderation view. */
export const adminList = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["admin", "content_manager"]);
    return await ctx.db.query("jobs").order("desc").take(200);
  },
});
