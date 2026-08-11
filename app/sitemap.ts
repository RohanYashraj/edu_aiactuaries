import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

/**
 * Static routes only for now. Phase 6 extends this with published `content`
 * documents and jobs pulled from Convex.
 */
const staticRoutes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/certifications", changeFrequency: "weekly", priority: 0.9 },
  { path: "/events", changeFrequency: "weekly", priority: 0.9 },
  { path: "/workshops", changeFrequency: "weekly", priority: 0.8 },
  { path: "/jobs", changeFrequency: "daily", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
