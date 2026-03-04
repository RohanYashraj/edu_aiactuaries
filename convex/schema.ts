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
  }).index("by_slug", ["slug"]),

  jobs: defineTable({
    title: v.string(),
    description: v.string(),
    employerId: v.id("users"),
    company: v.string(),
    location: v.string(),
    type: v.union(
      v.literal("full-time"),
      v.literal("part-time"),
      v.literal("contract"),
      v.literal("internship"),
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("closed"),
    ),
  })
    .index("by_employerId", ["employerId"])
    .index("by_status", ["status"]),
});
