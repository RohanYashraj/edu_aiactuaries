import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("member"), v.literal("employer")),
    approvedAt: v.optional(v.number()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_role", ["role"]),

  certifications: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    highlight: v.boolean(),
    order: v.number(),
    imageUrl: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  workshops: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    date: v.optional(v.string()),
    location: v.optional(v.string()),
    status: v.union(
      v.literal("upcoming"),
      v.literal("ongoing"),
      v.literal("completed"),
    ),
    order: v.number(),
    imageUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  jobs: defineTable({
    title: v.string(),
    description: v.string(),
    employerId: v.id("users"),
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
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("closed"),
    ),
  })
    .index("by_employerId", ["employerId"])
    .index("by_status", ["status"])
    .index("by_slug", ["slug"]),
});
