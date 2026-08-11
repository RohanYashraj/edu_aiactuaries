import type { Metadata } from "next";

import {
  absoluteUrl,
  defaultOgImage,
  siteDescription,
  siteName,
  siteBrandTitle,
} from "@/lib/site";

export type BuildMetadataInput = {
  /** Page title without the site suffix — the root layout template appends it. */
  title?: string;
  description?: string;
  /** Site-relative path, e.g. "/events/summer-program-2026". Used for the canonical. */
  path?: string;
  /** Absolute or site-relative image URL. Defaults to the site social card. */
  image?: string;
  imageAlt?: string;
  /** Override the canonical entirely (syndicated content). */
  canonical?: string;
  noindex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

/**
 * Builds a complete, consistent Metadata object so pages don't hand-roll
 * (and drift on) openGraph/twitter/canonical blocks.
 */
export function buildMetadata({
  title,
  description = siteDescription,
  path,
  image = defaultOgImage,
  imageAlt,
  canonical,
  noindex = false,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
}: BuildMetadataInput = {}): Metadata {
  const url = canonical ?? (path ? absoluteUrl(path) : undefined);
  const imageUrl = absoluteUrl(image);
  const resolvedTitle = title ?? siteBrandTitle;

  return {
    title,
    description,
    keywords,
    ...(url ? { alternates: { canonical: url } } : {}),
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type,
      siteName,
      title: resolvedTitle,
      description,
      ...(url ? { url } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt ?? resolvedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
  };
}
