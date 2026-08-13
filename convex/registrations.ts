import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { requireContentManager, requireUser } from "./lib/auth";

/**
 * Member registrations for events and programmes, and bookmarks.
 *
 * Every write is scoped to the calling user — a member can only ever register
 * or unregister themselves. Reads of other people's registrations require a
 * content manager.
 */

/** Only time-bound content can be registered for. */
const REGISTRABLE = ["event", "program", "workshop", "internship"] as const;

async function contentSummary(ctx: QueryCtx, contentId: Doc<"content">["_id"]) {
  const doc = await ctx.db.get(contentId);
  if (!doc) return null;
  return {
    _id: doc._id,
    type: doc.type,
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    startDate: doc.startDate,
    endDate: doc.endDate,
    dateLabel: doc.dateLabel,
    location: doc.location,
    status: doc.status,
  };
}

/* -------------------------------------------------------------------------- */
/*  Member-facing                                                             */
/* -------------------------------------------------------------------------- */

export const register = mutation({
  args: {
    contentId: v.id("content"),
    answers: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    const content = await ctx.db.get(args.contentId);
    if (!content) throw new Error("That programme no longer exists");
    if (content.status !== "published") {
      throw new Error("That programme isn't open for registration");
    }
    if (!REGISTRABLE.includes(content.type as (typeof REGISTRABLE)[number])) {
      throw new Error("This kind of content can't be registered for");
    }

    const existing = await ctx.db
      .query("registrations")
      .withIndex("by_user_content", (q) =>
        q.eq("userId", user._id).eq("contentId", args.contentId),
      )
      .unique();

    // Re-registering after cancelling reuses the row rather than creating a
    // second one, so the unique-per-pair invariant holds.
    if (existing) {
      if (existing.status === "registered") return existing._id;
      await ctx.db.patch(existing._id, {
        status: "registered",
        answers: args.answers ?? existing.answers,
      });
      return existing._id;
    }

    return await ctx.db.insert("registrations", {
      contentId: args.contentId,
      userId: user._id,
      status: "registered",
      answers: args.answers,
      createdAt: Date.now(),
    });
  },
});

export const cancel = mutation({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    const existing = await ctx.db
      .query("registrations")
      .withIndex("by_user_content", (q) =>
        q.eq("userId", user._id).eq("contentId", args.contentId),
      )
      .unique();

    if (!existing) return null;
    // Kept rather than deleted: the Institute needs to know someone withdrew,
    // not just that they were never there.
    await ctx.db.patch(existing._id, { status: "cancelled" });
    return existing._id;
  },
});

/** Whether the signed-in member is registered for one item. */
export const statusFor = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { signedIn: false, registered: false, saved: false };

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return { signedIn: true, registered: false, saved: false };

    const [registration, saved] = await Promise.all([
      ctx.db
        .query("registrations")
        .withIndex("by_user_content", (q) =>
          q.eq("userId", user._id).eq("contentId", args.contentId),
        )
        .unique(),
      ctx.db
        .query("savedItems")
        .withIndex("by_user_content", (q) =>
          q.eq("userId", user._id).eq("contentId", args.contentId),
        )
        .unique(),
    ]);

    return {
      signedIn: true,
      registered: registration?.status === "registered",
      saved: Boolean(saved),
    };
  },
});

/** The signed-in member's own registrations, newest first. */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);

    const rows = await ctx.db
      .query("registrations")
      .withIndex("by_user_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);

    const now = Date.now();
    const withContent = await Promise.all(
      rows
        .filter((row) => row.status !== "cancelled")
        .map(async (row) => {
          const content = await contentSummary(ctx, row.contentId);
          return {
            _id: row._id,
            status: row.status,
            createdAt: row.createdAt,
            // Decided here rather than at render time: reading the clock while
            // rendering is impure and risks a hydration mismatch.
            isPast:
              content?.startDate !== undefined && content.startDate < now,
            content,
          };
        }),
    );

    return withContent.filter((row) => row.content !== null);
  },
});

/* -------------------------------------------------------------------------- */
/*  Saved items                                                               */
/* -------------------------------------------------------------------------- */

export const toggleSaved = mutation({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    const existing = await ctx.db
      .query("savedItems")
      .withIndex("by_user_content", (q) =>
        q.eq("userId", user._id).eq("contentId", args.contentId),
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { saved: false };
    }

    await ctx.db.insert("savedItems", {
      userId: user._id,
      contentId: args.contentId,
      createdAt: Date.now(),
    });
    return { saved: true };
  },
});

export const listSaved = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);

    const rows = await ctx.db
      .query("savedItems")
      .withIndex("by_user_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);

    const withContent = await Promise.all(
      rows.map(async (row) => ({
        _id: row._id,
        content: await contentSummary(ctx, row.contentId),
      })),
    );

    return withContent.filter((row) => row.content !== null);
  },
});

/* -------------------------------------------------------------------------- */
/*  Admin                                                                     */
/* -------------------------------------------------------------------------- */

/** Everyone registered for one item, for the admin content view. */
export const listForContent = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    await requireContentManager(ctx);

    const rows = await ctx.db
      .query("registrations")
      .withIndex("by_content_createdAt", (q) => q.eq("contentId", args.contentId))
      .order("desc")
      .collect();

    return await Promise.all(
      rows.map(async (row) => {
        const user = await ctx.db.get(row.userId);
        return {
          _id: row._id,
          status: row.status,
          createdAt: row.createdAt,
          answers: row.answers,
          member: user
            ? {
                name: user.name,
                email: user.email,
                institution: user.institution,
                experienceLevel: user.experienceLevel,
              }
            : null,
        };
      }),
    );
  },
});

/** Registration counts per item, for the admin content table. */
export const countsByContent = query({
  args: {},
  handler: async (ctx) => {
    await requireContentManager(ctx);

    const rows = await ctx.db.query("registrations").collect();
    const counts: Record<string, number> = {};
    for (const row of rows) {
      if (row.status === "cancelled") continue;
      counts[row.contentId] = (counts[row.contentId] ?? 0) + 1;
    }
    return counts;
  },
});
