import { api } from "@/convex/_generated/api";
import { fetchQuery } from "@/lib/convex-server";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";
import { CONTENT_TYPE_LABELS, formatContentDate } from "@/lib/content";
import { siteName } from "@/lib/site";

export const alt = siteName;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const ALLOWED = ["internship"] as const;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await fetchQuery(api.content.getBySlug, { slug });

  // The route itself 404s an unknown or wrong-typed slug; the card falls back
  // to the site name so a crawler never gets a broken image.
  if (!doc || !ALLOWED.some((t) => t === doc.type)) {
    return renderOgImage({ title: siteName });
  }

  return renderOgImage({
    eyebrow: doc.badge ?? CONTENT_TYPE_LABELS[doc.type],
    title: doc.title,
    meta:
      [formatContentDate(doc), doc.location].filter(Boolean).join("  ·  ") ||
      undefined,
  });
}
