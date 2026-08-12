import { api } from "@/convex/_generated/api";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { fetchQuery } from "@/lib/convex-server";
import { NewsClient } from "./news-client";

export const metadata = buildMetadata({
  title: "News & Highlights",
  description:
    "What we've been building, teaching, publishing, and contributing to the actuarial and AI community.",
  path: "/news",
});

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

export default async function NewsPage() {
  const items = await fetchQuery(api.content.listByTypeChronological, {
    type: "news",
  });

  return (
    <>
      <JsonLd nodes={[breadcrumbSchema([{ label: "News", href: "/news" }])]} />
      <NewsClient items={items} />
    </>
  );
}
