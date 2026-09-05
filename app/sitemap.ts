import type { MetadataRoute } from "next";

import { api } from "@/convex/_generated/api";
import { fetchQuery } from "@/lib/convex-server";
import { absoluteUrl } from "@/lib/site";
import { contentHref } from "@/lib/content";

/** Regenerated hourly; publishing also flushes it via revalidateContent. */
export const revalidate = 3600;

const staticRoutes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/programs", changeFrequency: "weekly", priority: 0.9 },
  { path: "/events", changeFrequency: "weekly", priority: 0.9 },
  { path: "/news", changeFrequency: "weekly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map(
    ({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  // Every published document, so detail pages are discoverable without a
  // crawler having to walk the index pages to find them.
  const published = await fetchQuery(api.content.listForSitemap, {});

  for (const doc of published) {
    // An editor marking something noindex shouldn't then have it advertised.
    if (doc.noindex) continue;

    entries.push({
      url: absoluteUrl(contentHref(doc.type, doc.slug)),
      lastModified: new Date(doc.updatedAt ?? doc.publishedAt ?? Date.now()),
      changeFrequency: doc.type === "news" ? "yearly" : "monthly",
      priority: doc.type === "certification" ? 0.8 : 0.6,
    });
  }

  return entries;
}
