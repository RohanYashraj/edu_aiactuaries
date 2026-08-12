import {
  absoluteUrl,
  defaultOgImage,
  siteDescription,
  siteName,
  siteShortName,
  siteUrl,
  socialLinks,
} from "@/lib/site";

/** Loose JSON-LD node type — schema.org shapes are too varied to type strictly. */
export type JsonLdNode = Record<string, unknown> & {
  "@type": string | string[];
};

const ORGANIZATION_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

export function organizationSchema(): JsonLdNode {
  return {
    "@type": "EducationalOrganization",
    "@id": ORGANIZATION_ID,
    name: siteName,
    alternateName: siteShortName,
    url: siteUrl,
    logo: absoluteUrl(defaultOgImage),
    description: siteDescription,
    sameAs: [...socialLinks],
  };
}

export function webSiteSchema(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteUrl,
    name: siteName,
    description: siteDescription,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function breadcrumbSchema(
  items: { label: string; href?: string }[],
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  if (faqs.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } satisfies JsonLdNode;
}

/** Wraps one or more nodes in a single `@graph` document. */
export function jsonLdDocument(nodes: (JsonLdNode | null | undefined)[]) {
  const graph = nodes.filter((node): node is JsonLdNode => Boolean(node));
  return { "@context": "https://schema.org", "@graph": graph };
}

/* -------------------------------------------------------------------------- */
/*  Content entities                                                          */
/* -------------------------------------------------------------------------- */

type ContentLike = {
  type: "event" | "workshop" | "certification" | "program" | "internship" | "news";
  slug: string;
  title: string;
  summary: string;
  startDate?: number;
  endDate?: number;
  location?: string;
  publishedAt?: number;
  updatedAt?: number;
  coverImageUrl?: string | null;
  details: { kind: string; mode?: string; venue?: string } & Record<string, unknown>;
};

const iso = (ms?: number) =>
  ms === undefined ? undefined : new Date(ms).toISOString();

/**
 * Maps a content document onto the schema.org type search engines actually
 * reward: Course for certifications, Event for events/programs/workshops/internships,
 * Article for news.
 */
export function contentSchema(doc: ContentLike, url: string): JsonLdNode {
  const image = doc.coverImageUrl ? [doc.coverImageUrl] : [absoluteUrl(defaultOgImage)];

  if (doc.type === "certification") {
    return {
      "@type": "Course",
      "@id": `${url}#course`,
      name: doc.title,
      description: doc.summary,
      url,
      image,
      provider: { "@id": ORGANIZATION_ID },
      // Google requires at least one instance to show course rich results.
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: doc.details.mode === "in_person" ? "onsite" : "online",
        courseWorkload: (doc.details.durationLabel as string) ?? undefined,
      },
    };
  }

  if (doc.type === "news") {
    return {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: doc.title,
      description: doc.summary,
      url,
      image,
      datePublished: iso(doc.publishedAt),
      dateModified: iso(doc.updatedAt ?? doc.publishedAt),
      publisher: { "@id": ORGANIZATION_ID },
      author: { "@id": ORGANIZATION_ID },
    };
  }

  const isOnline = doc.details.mode === "online";
  return {
    "@type": doc.type === "workshop" ? "EducationEvent" : "Event",
    "@id": `${url}#event`,
    name: doc.title,
    description: doc.summary,
    url,
    image,
    startDate: iso(doc.startDate),
    endDate: iso(doc.endDate ?? doc.startDate),
    eventAttendanceMode: isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : doc.details.mode === "hybrid"
        ? "https://schema.org/MixedEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    location: isOnline
      ? { "@type": "VirtualLocation", url }
      : {
          "@type": "Place",
          name: doc.details.venue ?? doc.location ?? siteName,
          address: doc.location ?? "",
        },
    organizer: { "@id": ORGANIZATION_ID },
  };
}
