import type { Doc } from "@/convex/_generated/dataModel";

export type ContentType = Doc<"content">["type"];

/**
 * Where each content type lives in the URL space.
 *
 * Programs share `/events` with events on purpose: the summer program already
 * lives at /events/summer-program-2026 and that URL is in circulation, so
 * giving programs their own tree would buy a redirect and nothing else.
 */
export const CONTENT_ROUTES: Record<ContentType, string> = {
  event: "/events",
  program: "/events",
  workshop: "/workshops",
  certification: "/certifications",
  internship: "/programs",
  news: "/news",
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  event: "Event",
  program: "Program",
  workshop: "Workshop",
  certification: "Certification",
  internship: "Internship",
  news: "News",
};

export function contentHref(type: ContentType, slug: string): string {
  return `${CONTENT_ROUTES[type]}/${slug}`;
}

/** Section index a detail page breadcrumbs back to. */
export function contentSectionLabel(type: ContentType): string {
  return type === "event" || type === "program"
    ? "Events"
    : type === "internship"
      ? "Internships"
      : type === "workshop"
        ? "Workshops"
        : type === "certification"
          ? "Certifications"
          : "News";
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Bare ISO dates carried over from the legacy tables, e.g. "2026-04-20". */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Prefers the editor's display string, because ranges like
 * "27 April – 16 May 2026" don't round-trip through a single timestamp.
 *
 * A label that is just an ISO date is ignored: those came from the legacy
 * `workshops.date` column, and showing "2026-04-20" beside "15 April 2026"
 * on the same page looks like a bug.
 */
export function formatContentDate(doc: {
  dateLabel?: string;
  startDate?: number;
  endDate?: number;
}): string | null {
  if (doc.dateLabel && !ISO_DATE.test(doc.dateLabel)) return doc.dateLabel;
  if (doc.dateLabel && doc.startDate === undefined) return doc.dateLabel;
  if (doc.startDate === undefined) return null;

  const start = dateFormatter.format(new Date(doc.startDate));
  if (doc.endDate === undefined || doc.endDate === doc.startDate) return start;
  return `${start} – ${dateFormatter.format(new Date(doc.endDate))}`;
}

export function toIsoDate(timestamp?: number): string | undefined {
  return timestamp === undefined
    ? undefined
    : new Date(timestamp).toISOString();
}

const MODE_LABELS = {
  online: "Online",
  in_person: "In person",
  hybrid: "Hybrid",
} as const;

export function deliveryModeLabel(mode: keyof typeof MODE_LABELS): string {
  return MODE_LABELS[mode];
}

const LIFECYCLE_LABELS = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
} as const;

export function lifecycleLabel(
  lifecycle: keyof typeof LIFECYCLE_LABELS,
): string {
  return LIFECYCLE_LABELS[lifecycle];
}
