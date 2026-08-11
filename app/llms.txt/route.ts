import { api } from "@/convex/_generated/api";
import { fetchQuery } from "@/lib/convex-server";
import { absoluteUrl, siteDescription, siteName, siteUrl } from "@/lib/site";
import { contentHref, CONTENT_TYPE_LABELS, type ContentType } from "@/lib/content";
import { SITE_FAQS } from "@/lib/site-faqs";

/**
 * A plain-text digest of the site for answer engines.
 *
 * The summary field earns its keep here: every content document already
 * carries a self-contained, answer-first sentence, so this file is generated
 * rather than written and can never drift from the site.
 *
 * Regenerated hourly.
 */
export const revalidate = 3600;

const SECTION_ORDER: ContentType[] = [
  "program",
  "certification",
  "workshop",
  "event",
  "news",
];

export async function GET() {
  const docs = await fetchQuery(api.content.listForSitemap, {});
  const listed = docs.filter((doc) => !doc.noindex);

  const lines: string[] = [
    `# ${siteName}`,
    "",
    `> ${siteDescription}`,
    "",
    `Site: ${siteUrl}`,
    "",
    "The Institute teaches actuarial science alongside data science and AI to",
    "students across India. Membership is free, and the annual Summer Course in",
    "Actuarial Data Science is offered free of charge.",
    "",
  ];

  for (const type of SECTION_ORDER) {
    const items = listed.filter((doc) => doc.type === type);
    if (items.length === 0) continue;

    lines.push(`## ${CONTENT_TYPE_LABELS[type]}s`, "");
    for (const item of items) {
      lines.push(`- [${item.title}](${absoluteUrl(contentHref(type, item.slug))})`);
      lines.push(`  ${item.summary}`);
    }
    lines.push("");
  }

  lines.push("## Frequently asked questions", "");
  for (const faq of SITE_FAQS) {
    lines.push(`### ${faq.question}`, faq.answer, "");
  }

  lines.push(
    "## Key pages",
    "",
    `- [Programs](${absoluteUrl("/programs")}): certifications and workshops`,
    `- [Events](${absoluteUrl("/events")}): upcoming programmes and events`,
    `- [News](${absoluteUrl("/news")}): partnerships and engagements`,
    `- [About](${absoluteUrl("/about")}): the Institute and the bodies it works with`,
    `- [FAQ](${absoluteUrl("/faq")})`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
