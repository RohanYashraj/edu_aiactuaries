import { z } from "zod";

/**
 * Client-side mirror of the Convex content validators.
 *
 * Convex re-validates everything server-side, so this exists for form UX, not
 * security. Keep the two in step: convex/schema.ts is the source of truth.
 */

/**
 * Empty inputs become `undefined` so blank fields aren't persisted as "".
 *
 * Uses preprocess rather than `.optional().transform(...)`: the latter widens
 * the inferred key to required-but-possibly-undefined, which then refuses
 * partial object literals everywhere the form builds one.
 */
const blankToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalString = z.preprocess(
  blankToUndefined,
  z.string().trim().optional(),
);

const optionalUrl = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .refine((v) => /^https?:\/\//.test(v) || v.startsWith("/"), {
      message: "Must be a URL or a site-relative path",
    })
    .optional(),
);

export const contentTypeEnum = z.enum([
  "event",
  "workshop",
  "certification",
  "program",
  "internship",
  "news",
]);

export const contentStatusEnum = z.enum([
  "draft",
  "scheduled",
  "published",
  "archived",
]);

export const lifecycleEnum = z.enum(["upcoming", "ongoing", "completed"]);
export const modeEnum = z.enum(["online", "in_person", "hybrid"]);

export const factSchema = z.object({
  icon: optionalString,
  label: z.string().trim().min(1, "Label is required"),
  value: z.string().trim().min(1, "Value is required"),
});

export const ctaSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  href: z.string().trim().min(1, "Link is required"),
  variant: z.enum(["primary", "secondary"]).optional(),
});

export const partnerSchema = z.object({
  /** Points at the shared organisation library, which owns the logo. */
  organizationId: optionalString,
  name: z.string().trim().min(1, "Name is required"),
  role: optionalString,
  note: optionalString,
  // Uploaded logos live in Convex storage. Omitting this key silently dropped
  // the logo off every partner that had one.
  logoStorageId: optionalString,
  logoPath: optionalString,
  logoAlt: optionalString,
  href: optionalUrl,
  invertInDark: z.boolean().optional(),
});

export const faqSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
});

export const personSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  title: optionalString,
  organization: optionalString,
  bio: optionalString,
  photoStorageId: optionalString,
  profileUrl: optionalUrl,
});

export const agendaSlotSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: optionalString,
  speaker: optionalString,
});

export const moduleSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: optionalString,
  topics: z.array(z.string()).optional(),
});

export const weekSchema = z.object({
  week: z.coerce.number().int().min(1),
  title: z.string().trim().min(1, "Title is required"),
  focus: z.string().trim().min(1, "Focus is required"),
  topics: z.array(z.string()),
  tools: z.array(z.string()),
  outcomes: z.array(z.string()),
});

/**
 * These must model EVERY field in the corresponding Convex validator in
 * convex/schema.ts. Zod strips unknown keys, and contentAdmin.update replaces
 * `details` wholesale — so any field missing here is silently deleted from the
 * stored document the first time an editor presses Save.
 */
const eventDetails = z.object({
  kind: z.literal("event"),
  lifecycle: lifecycleEnum,
  mode: modeEnum,
  venue: optionalString,
  registrationUrl: optionalUrl,
  registrationDeadline: z.number().optional(),
  capacity: z.number().optional(),
  isFree: z.boolean().optional(),
  priceLabel: optionalString,
  agenda: z.array(agendaSlotSchema).optional(),
  speakers: z.array(personSchema).optional(),
});

const workshopDetails = z.object({
  kind: z.literal("workshop"),
  lifecycle: lifecycleEnum,
  mode: modeEnum,
  venue: optionalString,
  durationLabel: optionalString,
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  prerequisites: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).optional(),
  registrationUrl: optionalUrl,
  instructors: z.array(personSchema).optional(),
});

const certificationDetails = z.object({
  kind: z.literal("certification"),
  enrollmentStatus: z.enum(["open", "closed", "coming_soon"]),
  level: z.enum(["foundation", "professional", "advanced"]).optional(),
  durationLabel: optionalString,
  modules: z.array(moduleSchema).optional(),
  learningOutcomes: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  assessment: optionalString,
  feeLabel: optionalString,
  enrollmentUrl: optionalUrl,
  credentialAwarded: optionalString,
});

const programDetails = z.object({
  kind: z.literal("program"),
  lifecycle: lifecycleEnum,
  mode: modeEnum,
  edition: optionalString,
  commitmentLabel: optionalString,
  feeLabel: optionalString,
  eligibility: z.array(z.string()).optional(),
  coverage: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  registrationUrl: optionalUrl,
  registrationDeadline: z.number().optional(),
  weeklySchedule: z.array(weekSchema).optional(),
});

export const internshipDetails = z.object({
  kind: z.literal("internship"),
  lifecycle: lifecycleEnum,
  mode: modeEnum,
  durationLabel: optionalString,
  stipend: optionalString,
  eligibility: z.array(z.string()).optional(),
  registrationUrl: optionalUrl,
  registrationDeadline: z.number().optional(),
});

const newsDetails = z.object({
  kind: z.literal("news"),
  authorName: optionalString,
  sourceUrl: optionalUrl,
  sourceName: optionalString,
  sourceType: optionalString,
  category: optionalString,
  metric: optionalString,
});

export const contentDetailsSchema = z.discriminatedUnion("kind", [
  eventDetails,
  workshopDetails,
  certificationDetails,
  programDetails,
  internshipDetails,
  newsDetails,
]);

export const contentFormSchema = z
  .object({
    type: contentTypeEnum,
    slug: optionalString,
    status: contentStatusEnum,

    title: z.string().trim().min(1, "Title is required"),
    subtitle: optionalString,
    summary: z
      .string()
      .trim()
      .min(20, "Write at least a full sentence — this becomes the search-result description")
      .max(600, "Keep the summary under 600 characters"),
    body: optionalString,
    badge: optionalString,

    coverImageId: optionalString,
    coverImagePath: optionalString,
    coverImageAlt: optionalString,

    startDate: optionalString,
    endDate: optionalString,
    dateLabel: optionalString,
    location: optionalString,
    scheduledFor: optionalString,

    order: z.coerce.number().int().min(0),
    featured: z.boolean(),
    featureRank: z.coerce.number().int().min(0).optional(),
    tags: z.array(z.string()).optional(),

    facts: z.array(factSchema).optional(),
    ctas: z.array(ctaSchema).optional(),
    partners: z.array(partnerSchema).optional(),
    faqs: z.array(faqSchema).optional(),

    details: contentDetailsSchema,

    linkedinUrl: optionalUrl,
    websiteUrl: optionalUrl,
    websiteLabel: optionalString,

    metaTitle: optionalString,
    metaDescription: optionalString,
    canonicalUrl: optionalUrl,
    keywords: z.array(z.string()).optional(),
    noindex: z.boolean().optional(),
  })
  .refine((data) => data.details.kind === data.type, {
    message: "The type-specific fields don't match the selected type",
    path: ["details"],
  })
  // An uploaded image with no alt text is an accessibility and image-SEO
  // regression that is invisible until someone audits the site.
  .refine((data) => !data.coverImageId || Boolean(data.coverImageAlt), {
    message: "Alt text is required when a cover image is set",
    path: ["coverImageAlt"],
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    { message: "End date must be on or after the start date", path: ["endDate"] },
  )
  // Scheduled publishing is driven by a cron reading this field; without it the
  // document would sit in "scheduled" forever.
  .refine((data) => data.status !== "scheduled" || Boolean(data.scheduledFor), {
    message: "Pick a date and time to publish, or choose a different status",
    path: ["scheduledFor"],
  });

export type ContentFormValues = z.infer<typeof contentFormSchema>;

/** Default `details` payload when the editor switches type. */
export function defaultDetailsFor(
  type: z.infer<typeof contentTypeEnum>,
): ContentFormValues["details"] {
  switch (type) {
    case "event":
      return { kind: "event", lifecycle: "upcoming", mode: "online" };
    case "workshop":
      return { kind: "workshop", lifecycle: "upcoming", mode: "online" };
    case "program":
      return { kind: "program", lifecycle: "upcoming", mode: "online" };
    case "certification":
      return { kind: "certification", enrollmentStatus: "coming_soon" };
    case "internship":
      return { kind: "internship", lifecycle: "upcoming", mode: "online" };
    case "news":
      return { kind: "news" };
  }
}

/** Row types for the repeatable block editors. */
export type FactValue = z.infer<typeof factSchema>;
export type CtaValue = z.infer<typeof ctaSchema>;
export type PartnerValue = z.infer<typeof partnerSchema>;
export type FaqValue = z.infer<typeof faqSchema>;
export type PersonValue = z.infer<typeof personSchema>;
export type AgendaSlotValue = z.infer<typeof agendaSlotSchema>;
export type ModuleValue = z.infer<typeof moduleSchema>;
export type WeekValue = z.infer<typeof weekSchema>;
