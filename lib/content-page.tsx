import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { api } from "@/convex/_generated/api";
import { ContentDetail } from "@/components/content/content-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { contentSchema, faqSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { fetchQuery } from "@/lib/convex-server";
import { contentHref, toIsoDate, type ContentType } from "@/lib/content";

/**
 * Shared implementation behind /events/[slug], /workshops/[slug],
 * /certifications/[slug] and /news/[slug].
 *
 * The four routes differ only in which types they accept — everything else
 * (metadata, structured data, rendering) is identical by design, so a new
 * content type never needs a bespoke page.
 */

type Params = Promise<{ slug: string }>;

async function loadDoc(slug: string, allowed: readonly ContentType[]) {
  const doc = await fetchQuery(api.content.getBySlug, { slug });
  // A published doc of the wrong type must 404 here rather than render under
  // the wrong URL, which would create two canonical paths for one document.
  if (!doc || !allowed.includes(doc.type)) return null;
  return doc;
}

export async function buildContentMetadata(
  params: Params,
  allowed: readonly ContentType[],
): Promise<Metadata> {
  const { slug } = await params;
  const doc = await loadDoc(slug, allowed);

  if (!doc) {
    return buildMetadata({ title: "Not found", noindex: true });
  }

  return buildMetadata({
    title: doc.seo?.metaTitle ?? doc.title,
    description: doc.seo?.metaDescription ?? doc.summary,
    path: contentHref(doc.type, doc.slug),
    canonical: doc.seo?.canonicalUrl,
    image: doc.coverImageUrl ?? undefined,
    imageAlt: doc.coverImageAlt,
    keywords: doc.seo?.keywords,
    noindex: doc.seo?.noindex,
    type: doc.type === "news" ? "article" : "website",
    publishedTime: toIsoDate(doc.publishedAt),
    modifiedTime: toIsoDate(doc.updatedAt),
  });
}

export async function renderContentPage(
  params: Params,
  allowed: readonly ContentType[],
) {
  const { slug } = await params;
  const [doc, { userId }] = await Promise.all([
    loadDoc(slug, allowed),
    auth(),
  ]);
  if (!doc) notFound();

  const url = absoluteUrl(contentHref(doc.type, doc.slug));

  return (
    <>
      <JsonLd
        // BreadcrumbList is emitted by the Breadcrumbs component inside
        // ContentDetail, from the same array it renders — emitting it here too
        // would duplicate the node.
        nodes={[contentSchema(doc, url), faqSchema(doc.faqs ?? [])]}
      />
      <ContentDetail doc={doc} signedIn={Boolean(userId)} />
    </>
  );
}

/** generateStaticParams source — prerenders detail pages at build time. */
export async function contentStaticParams(types: readonly ContentType[]) {
  const lists = await Promise.all(
    types.map((type) => fetchQuery(api.content.listSlugsByType, { type })),
  );
  return lists.flat().map((slug) => ({ slug }));
}
