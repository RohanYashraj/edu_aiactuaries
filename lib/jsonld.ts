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
