import { api } from "@/convex/_generated/api";
import { SectionHeader, EmptyState } from "@/components/marketing";
import { ContentCard } from "@/components/content/content-card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { fetchQuery } from "@/lib/convex-server";

export const metadata = buildMetadata({
  title: "Events",
  description:
    "Upcoming programs, intensives, and events from the Sri Sathya Sai Institute of Actuaries.",
  path: "/events",
});

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

export default async function EventsPage() {
  // Server-side so the listing is in the initial HTML, not fetched after
  // hydration. Workshops list alongside events — they share this URL space.
  const items = await fetchQuery(api.content.listEventsAndWorkshops, {});

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <JsonLd
        nodes={[breadcrumbSchema([{ label: "Events", href: "/events" }])]}
      />
      <SectionHeader
        as="h1"
        title="Events"
        description="Programs and gatherings at the intersection of actuarial science and AI."
      />

      {items.length === 0 ? (
        <EmptyState
          title="No events scheduled"
          description="New programs and events will be listed here as details are confirmed."
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
