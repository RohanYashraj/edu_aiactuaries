import { internalMutation } from "./_generated/server";

/**
 * Jobs the crons call. Internal only — nothing here should be reachable from a
 * browser.
 */

/**
 * Publishes content whose scheduled time has passed.
 *
 * Without this the "scheduled" status was a dead end: an editor could pick it,
 * and the document would never appear on the site.
 */
export const publishScheduled = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const due = await ctx.db
      .query("content")
      .withIndex("by_status_scheduledFor", (q) =>
        q.eq("status", "scheduled").lte("scheduledFor", now),
      )
      .collect();

    for (const doc of due) {
      await ctx.db.patch(doc._id, {
        status: "published",
        publishedAt: doc.publishedAt ?? doc.scheduledFor ?? now,
        updatedAt: now,
      });
    }

    return { published: due.length, slugs: due.map((d) => d.slug) };
  },
});

/**
 * Moves time-bound content through its lifecycle so an event that finished
 * last week stops advertising itself as upcoming.
 *
 * Only touches documents whose dates say the label is wrong, so an editor who
 * sets a lifecycle by hand isn't fought by the cron on the next tick.
 */
export const rollLifecycles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const published = await ctx.db
      .query("content")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .collect();

    let updated = 0;

    for (const doc of published) {
      const details = doc.details;
      if (!("lifecycle" in details)) continue;
      if (doc.startDate === undefined) continue;

      // An item with no end date occupies its start day.
      const end = doc.endDate ?? doc.startDate + 24 * 60 * 60 * 1000;

      const next =
        now > end ? "completed" : now >= doc.startDate ? "ongoing" : "upcoming";

      if (next === details.lifecycle) continue;

      await ctx.db.patch(doc._id, {
        details: { ...details, lifecycle: next },
        updatedAt: now,
      });
      updated += 1;
    }

    return { updated };
  },
});
