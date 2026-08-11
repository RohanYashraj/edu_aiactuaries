import { api } from "@/convex/_generated/api";
import { EmptyState, SectionHeader } from "@/components/marketing";
import { ContentCard } from "@/components/content/content-card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { fetchQuery } from "@/lib/convex-server";

export const metadata = buildMetadata({
  title: "News",
  description:
    "Updates from the Sri Sathya Sai Institute of Actuaries — partnerships, conferences, webinars, and engagements across the actuarial profession.",
  path: "/news",
});

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

export default async function NewsPage() {
  const items = await fetchQuery(api.content.listByTypeChronological, {
    type: "news",
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <JsonLd nodes={[breadcrumbSchema([{ label: "News", href: "/news" }])]} />
      <SectionHeader
        as="h1"
        title="News & Highlights"
        description="Partnerships, conferences, and engagements across the actuarial profession."
      />

      {items.length === 0 ? (
        <EmptyState
          title="No updates yet"
          description="News and highlights will appear here."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <ContentCard key={item._id} item={item} delayMs={index * 100} />
          ))}
        </div>
      )}
    </section>
  );
}
