import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

/**
 * AI answer engines are explicitly allowed: being cited by them is the point
 * of the AEO work (llms.txt, FAQPage schema, answer-first summaries).
 * Authenticated surfaces are disallowed everywhere.
 */
const disallow = ["/dashboard", "/admin", "/onboarding", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: "GPTBot", allow: "/", disallow },
      { userAgent: "OAI-SearchBot", allow: "/", disallow },
      { userAgent: "ChatGPT-User", allow: "/", disallow },
      { userAgent: "ClaudeBot", allow: "/", disallow },
      { userAgent: "Claude-Web", allow: "/", disallow },
      { userAgent: "PerplexityBot", allow: "/", disallow },
      { userAgent: "Google-Extended", allow: "/", disallow },
      { userAgent: "Applebot-Extended", allow: "/", disallow },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
