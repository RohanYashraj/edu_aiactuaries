import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/* -------------------------------------------------------------------------- */
/*  Shared validators — exported so function args and the admin zod schemas    */
/*  stay in lockstep with the table definitions.                              */
/* -------------------------------------------------------------------------- */

export const roleValidator = v.union(
  v.literal("member"),
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

/* -------------------------------------------------------------------------- */
/*  Unified content model                                                     */
/*                                                                            */
/*  One table for every editorial content type. The hard constraint driving   */
/*  the shape: Convex cannot index a field nested inside a v.union branch, so  */
/*  anything filterable or sortable is top-level and only per-type payload    */
/*  lives in `details`.                                                       */
/* -------------------------------------------------------------------------- */

export const contentTypeValidator = v.union(
  v.literal("event"),
  v.literal("workshop"),
  v.literal("certification"),
  v.literal("program"),
  v.literal("news"),
);

export const contentStatusValidator = v.union(
  v.literal("draft"),
  v.literal("scheduled"),
  v.literal("published"),
  v.literal("archived"),
);

export const lifecycleValidator = v.union(
  v.literal("upcoming"),
  v.literal("ongoing"),
  v.literal("completed"),
);

export const deliveryModeValidator = v.union(
  v.literal("online"),
  v.literal("in_person"),
  v.literal("hybrid"),
);

/** Call-to-action button rendered on cards and detail pages. */
export const ctaValidator = v.object({
  label: v.string(),
  href: v.string(),
  variant: v.optional(v.union(v.literal("primary"), v.literal("secondary"))),
});

/** Partner / knowledge-partner organisation with its logo. */
export const partnerValidator = v.object({
  name: v.string(),
  role: v.optional(v.string()),
  /** Editor-written sentence about the partnership; falls back to a generic one. */
  note: v.optional(v.string()),
  logoStorageId: v.optional(v.id("_storage")),
  /** Legacy asset under /public, e.g. "/ifoa.svg". */
  logoPath: v.optional(v.string()),
  logoAlt: v.optional(v.string()),
  href: v.optional(v.string()),
  invertInDark: v.optional(v.boolean()),
});

/** Icon + label + value tile (the "quick info" grid on detail pages). */
export const factValidator = v.object({
  /** lucide icon name, mapped to a component client-side. */
  icon: v.optional(v.string()),
  label: v.string(),
  value: v.string(),
});

/** Rendered as <details> and emitted as FAQPage structured data. */
export const faqValidator = v.object({
  question: v.string(),
  answer: v.string(),
});

export const personValidator = v.object({
  name: v.string(),
  title: v.optional(v.string()),
  organization: v.optional(v.string()),
  bio: v.optional(v.string()),
  photoStorageId: v.optional(v.id("_storage")),
  profileUrl: v.optional(v.string()),
});

export const seoValidator = v.object({
  metaTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
  /** Only for syndicated content that canonicalises elsewhere. */
  canonicalUrl: v.optional(v.string()),
  ogImageStorageId: v.optional(v.id("_storage")),
  keywords: v.optional(v.array(v.string())),
  noindex: v.optional(v.boolean()),
});

const eventDetails = v.object({
  kind: v.literal("event"),
  lifecycle: lifecycleValidator,
  mode: deliveryModeValidator,
  venue: v.optional(v.string()),
  registrationUrl: v.optional(v.string()),
  registrationDeadline: v.optional(v.number()),
  capacity: v.optional(v.number()),
  isFree: v.optional(v.boolean()),
  priceLabel: v.optional(v.string()),
  agenda: v.optional(
    v.array(
      v.object({
        label: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        speaker: v.optional(v.string()),
      }),
    ),
  ),
  speakers: v.optional(v.array(personValidator)),
});

const workshopDetails = v.object({
  kind: v.literal("workshop"),
  lifecycle: lifecycleValidator,
  mode: deliveryModeValidator,
  venue: v.optional(v.string()),
  durationLabel: v.optional(v.string()),
  level: v.optional(
    v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
    ),
  ),
  prerequisites: v.optional(v.array(v.string())),
  learningOutcomes: v.optional(v.array(v.string())),
  registrationUrl: v.optional(v.string()),
  instructors: v.optional(v.array(personValidator)),
});

const certificationDetails = v.object({
  kind: v.literal("certification"),
  enrollmentStatus: v.union(
    v.literal("open"),
    v.literal("closed"),
    v.literal("coming_soon"),
  ),
  level: v.optional(
    v.union(
      v.literal("foundation"),
      v.literal("professional"),
      v.literal("advanced"),
    ),
  ),
  durationLabel: v.optional(v.string()),
  modules: v.optional(
    v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
        topics: v.optional(v.array(v.string())),
      }),
    ),
  ),
  learningOutcomes: v.optional(v.array(v.string())),
  prerequisites: v.optional(v.array(v.string())),
  assessment: v.optional(v.string()),
  feeLabel: v.optional(v.string()),
  enrollmentUrl: v.optional(v.string()),
  credentialAwarded: v.optional(v.string()),
});

const programDetails = v.object({
  kind: v.literal("program"),
  lifecycle: lifecycleValidator,
  mode: deliveryModeValidator,
  edition: v.optional(v.string()),
  commitmentLabel: v.optional(v.string()),
  feeLabel: v.optional(v.string()),
  eligibility: v.optional(v.array(v.string())),
  coverage: v.optional(v.array(v.string())),
  highlights: v.optional(v.array(v.string())),
  registrationUrl: v.optional(v.string()),
  registrationDeadline: v.optional(v.number()),
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
});

const newsDetails = v.object({
  kind: v.literal("news"),
  authorName: v.optional(v.string()),
  sourceUrl: v.optional(v.string()),
  sourceName: v.optional(v.string()),
});

export const contentDetailsValidator = v.union(
  eventDetails,
  workshopDetails,
  certificationDetails,
  programDetails,
  newsDetails,
);

/** Writable content fields, shared by the create and update mutations. */
export const contentFields = {
  type: contentTypeValidator,
  slug: v.string(),
  status: contentStatusValidator,

  title: v.string(),
  subtitle: v.optional(v.string()),
  /**
   * Answer-first, one-or-two sentence definition of what this is. Required on
   * purpose: it is the meta description fallback, the card description, the
   * lead paragraph, and the llms.txt entry.
   */
  summary: v.string(),
  body: v.optional(v.string()),
  badge: v.optional(v.string()),

  coverImageId: v.optional(v.id("_storage")),
  coverImagePath: v.optional(v.string()),
  coverImageAlt: v.optional(v.string()),
  galleryImageIds: v.optional(v.array(v.id("_storage"))),

  /** Epoch ms so listings can actually sort chronologically. */
  startDate: v.optional(v.number()),
  endDate: v.optional(v.number()),
  /** Display string for ranges that don't parse, e.g. "27 April – 16 May 2026". */
  dateLabel: v.optional(v.string()),
  location: v.optional(v.string()),

  order: v.number(),
  featured: v.boolean(),
  featureRank: v.optional(v.number()),
  tags: v.optional(v.array(v.string())),

  facts: v.optional(v.array(factValidator)),
  ctas: v.optional(v.array(ctaValidator)),
  partners: v.optional(v.array(partnerValidator)),
  faqs: v.optional(v.array(faqValidator)),

  details: contentDetailsValidator,
  seo: v.optional(seoValidator),

  publishedAt: v.optional(v.number()),
  scheduledFor: v.optional(v.number()),
};

/**
 * Same fields, every one optional — the update mutation patches a subset.
 * Written out rather than derived so the generated arg types stay readable.
 */
export const contentPatchFields = {
  type: v.optional(contentTypeValidator),
  slug: v.optional(v.string()),
  status: v.optional(contentStatusValidator),

  title: v.optional(v.string()),
  subtitle: v.optional(v.string()),
  summary: v.optional(v.string()),
  body: v.optional(v.string()),
  badge: v.optional(v.string()),

  coverImageId: v.optional(v.id("_storage")),
  coverImagePath: v.optional(v.string()),
  coverImageAlt: v.optional(v.string()),
  galleryImageIds: v.optional(v.array(v.id("_storage"))),

  startDate: v.optional(v.number()),
  endDate: v.optional(v.number()),
  dateLabel: v.optional(v.string()),
  location: v.optional(v.string()),

  order: v.optional(v.number()),
  featured: v.optional(v.boolean()),
  featureRank: v.optional(v.number()),
  tags: v.optional(v.array(v.string())),

  facts: v.optional(v.array(factValidator)),
  ctas: v.optional(v.array(ctaValidator)),
  partners: v.optional(v.array(partnerValidator)),
  faqs: v.optional(v.array(faqValidator)),

  details: v.optional(contentDetailsValidator),
  seo: v.optional(seoValidator),

  publishedAt: v.optional(v.number()),
  scheduledFor: v.optional(v.number()),
};

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

    /* --- audit --- */
    roleUpdatedAt: v.optional(v.number()),
    roleUpdatedBy: v.optional(v.id("users")),
    lastSeenAt: v.optional(v.number()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_role", ["role"])
    .index("by_email", ["email"]),

  content: defineTable({
    ...contentFields,
    createdBy: v.optional(v.id("users")),
    updatedBy: v.optional(v.id("users")),
    updatedAt: v.number(),
  })
    // Detail-page lookup and the slug-uniqueness check. Slugs are globally
    // unique, not per-type, so /events/x and /workshops/x can never diverge.
    .index("by_slug", ["slug"])
    // Curated lists (`/certifications`). The ["type"] and ["type","status"]
    // prefixes also serve the admin filters, so no extra indexes are needed.
    .index("by_type_status_order", ["type", "status", "order"])
    // Chronological listings and "what's next", where date order and editorial
    // order genuinely diverge.
    .index("by_type_status_startDate", ["type", "status", "startDate"])
    // Sitemap, llms.txt and the news feed: all published, any type.
    .index("by_status_publishedAt", ["status", "publishedAt"])
    // Homepage showcase.
    .index("by_status_featured_rank", ["status", "featured", "featureRank"])
    // Admin "recently edited" default sort.
    .index("by_updatedAt", ["updatedAt"])
    // Cron: publish anything whose scheduled time has passed.
    .index("by_status_scheduledFor", ["status", "scheduledFor"])
    .searchIndex("search_content", {
      searchField: "title",
      filterFields: ["type", "status"],
    }),

  /**
   * Members registering for an event or programme.
   *
   * Registrations previously went to a Google Form, so the Institute had no
   * record of who signed up and no way to reach them. Keeping them here is the
   * reason the member dashboard has anything real to show.
   */
  registrations: defineTable({
    contentId: v.id("content"),
    userId: v.id("users"),
    status: v.union(
      v.literal("registered"),
      v.literal("waitlisted"),
      v.literal("cancelled"),
    ),
    /** Free-form answers to any questions the programme asks. */
    answers: v.optional(v.record(v.string(), v.string())),
    createdAt: v.number(),
  })
    // Enforces one registration per member per item at the query level; the
    // mutation checks this index before inserting.
    .index("by_user_content", ["userId", "contentId"])
    .index("by_user_createdAt", ["userId", "createdAt"])
    .index("by_content_createdAt", ["contentId", "createdAt"]),

  /** Bookmarks. Same one-per-pair shape as registrations. */
  savedItems: defineTable({
    userId: v.id("users"),
    contentId: v.id("content"),
    createdAt: v.number(),
  })
    .index("by_user_content", ["userId", "contentId"])
    .index("by_user_createdAt", ["userId", "createdAt"]),

  /**
   * Single-row settings table. Exists so the homepage achievement figures can
   * be corrected by an editor instead of a deploy — and so no unverified
   * number ever has to be hardcoded to ship the design.
   */
  siteSettings: defineTable({
    /** Always "singleton"; the table holds exactly one row. */
    key: v.string(),
    achievements: v.optional(
      v.array(
        v.object({
          value: v.string(),
          label: v.string(),
          /** Hidden until an editor fills the value in. */
          hidden: v.optional(v.boolean()),
        }),
      ),
    ),
    achievementsIntro: v.optional(v.string()),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  }).index("by_key", ["key"]),

  /** Undo for a CMS operated by non-engineers. Capped per document on write. */
  contentRevisions: defineTable({
    contentId: v.id("content"),
    /** Full document snapshot; v.any() so it never blocks a schema change. */
    snapshot: v.any(),
    changedBy: v.optional(v.id("users")),
    changeNote: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_contentId_createdAt", ["contentId", "createdAt"]),

  /**
   * Convex `_storage` records no filename, alt text or uploader, so without
   * this table there is no media library and no way to enforce alt text.
   */
  mediaAssets: defineTable({
    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.optional(v.string()),
    size: v.optional(v.number()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    alt: v.optional(v.string()),
    uploadedBy: v.optional(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_storageId", ["storageId"])
    .index("by_createdAt", ["createdAt"]),


});
