import type { Metadata } from "next";

import {
  buildContentMetadata,
  contentStaticParams,
  renderContentPage,
} from "@/lib/content-page";
import type { ContentType } from "@/lib/content";

const ALLOWED: readonly ContentType[] = ["internship"];

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
