import type { Metadata } from "next";

import {
  buildContentMetadata,
  contentStaticParams,
  renderContentPage,
} from "@/lib/content-page";
import type { ContentType } from "@/lib/content";

/**
 * Certification detail pages are the highest-value SEO surface on the site:
 * each one is a schema.org Course entity, and until now the flagship programs
 * had no indexable page at all.
 */
const ALLOWED: readonly ContentType[] = ["certification"];

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  return contentStaticParams(ALLOWED);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return buildContentMetadata(params, ALLOWED);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return renderContentPage(params, ALLOWED);
}
