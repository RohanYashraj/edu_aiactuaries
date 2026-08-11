import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/* -------------------------------------------------------------------------- */
/*  Shared validators — exported so function args and the admin zod schemas    */
/*  stay in lockstep with the table definitions.                              */
/* -------------------------------------------------------------------------- */

export const roleValidator = v.union(
  v.literal("member"),
  v.literal("employer"),
  v.literal("content_manager"),
  v.literal("admin"),
);

export const actuarialBodyValidator = v.union(
  v.literal("IAI"),
  v.literal("IFoA"),
  v.literal("SOA"),
  v.literal("CAS"),
  v.literal("other"),
  v.literal("none"),
);

export const experienceLevelValidator = v.union(
  v.literal("student"),
  v.literal("graduate"),
  v.literal("working_professional"),
  v.literal("academic"),
  v.literal("other"),
);

export default defineSchema({
  users: defineTable({
    /* --- identity --- */
    clerkId: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: roleValidator,
    approvedAt: v.optional(v.number()),

    /* --- membership profile (all optional: pre-existing rows have none) --- */
    onboardingCompletedAt: v.optional(v.number()),
    headline: v.optional(v.string()),
    institution: v.optional(v.string()),
    actuarialBody: v.optional(actuarialBodyValidator),
    actuarialBodyOther: v.optional(v.string()),
    examsCleared: v.optional(v.array(v.string())),
    examsClearedCount: v.optional(v.number()),
    interests: v.optional(v.array(v.string())),
    experienceLevel: v.optional(experienceLevelValidator),
    country: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),

    /* --- employer-only --- */
    companyName: v.optional(v.string()),
    companyWebsite: v.optional(v.string()),

    /* --- audit --- */
    roleUpdatedAt: v.optional(v.number()),
    roleUpdatedBy: v.optional(v.id("users")),
    lastSeenAt: v.optional(v.number()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_role", ["role"])
    .index("by_email", ["email"]),

  certifications: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    highlight: v.boolean(),
    order: v.number(),
    imageUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),

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
    .index("by_status", ["status"])
    .index("by_order", ["order"])
    .index("by_status_and_order", ["status", "order"]),

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
