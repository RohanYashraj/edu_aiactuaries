import type { Metadata } from "next";

import {
  absoluteUrl,
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
  /**
   * Explicit social image. Leave unset on routes that have an
   * opengraph-image file — setting `images` here would override the generated
   * card, which is what shipped the site-wide logo on every page.
   */
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
  image,
  imageAlt,
  canonical,
  noindex = false,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
}: BuildMetadataInput = {}): Metadata {
  const url = canonical ?? (path ? absoluteUrl(path) : undefined);
  const resolvedTitle = title ?? siteBrandTitle;

  // Omitted entirely when no image is given, so Next's file-based
  // opengraph-image convention supplies the generated card.
  const images = image
    ? [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: imageAlt ?? resolvedTitle,
        },
      ]
    : undefined;

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
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}
