import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { SectionHeader, EmptyState } from "@/components/marketing";
import { ContentCard } from "@/components/content/content-card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { fetchQuery } from "@/lib/convex-server";

export const metadata = buildMetadata({
  title: "Events",
  description:
    "Upcoming and past events and workshops from the Sri Sathya Sai Institute of Actuaries.",
  path: "/events",
});

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

/**
 * Events and workshops, split by time: what a visitor can still attend leads,
 * the record of past sessions follows. Long-form offerings (programs,
 * certifications, internships) live on /programs; the two pages cross-link.
 */
export default async function EventsPage() {
  const items = await fetchQuery(api.content.listEventsAndWorkshops, {});

  const now = Date.now();
  // An item is past only once its whole run is over; undated items stay
  // upcoming — they are announcements whose dates are still being confirmed.
  const isPast = (item: (typeof items)[number]) => {
    const end = item.endDate ?? item.startDate;
    return end !== undefined && end < now;
  };

  const upcoming = items
    .filter((item) => !isPast(item))
    .sort((a, b) => (a.startDate ?? Infinity) - (b.startDate ?? Infinity));
  const past = items.filter(isPast);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <JsonLd
        nodes={[breadcrumbSchema([{ label: "Events", href: "/events" }])]}
      />

      <SectionHeader
        as="h1"
        title="Events & Workshops"
        description="Webinars, hands-on workshops, and gatherings at the intersection of actuarial science and AI."
      />

      <section aria-labelledby="upcoming-heading" className="mb-16">
        <h2
          id="upcoming-heading"
          className="font-display text-2xl tracking-tight sm:text-3xl"
        >
          Upcoming
        </h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
          Sessions you can still register for, soonest first.
        </p>

        {upcoming.length === 0 ? (
          <EmptyState
            title="No events scheduled"
            description="New events and workshops will be listed here as dates are confirmed."
          />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((item, index) => (
              <ContentCard key={item._id} item={item} delayMs={index * 80} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 ? (
        <section aria-labelledby="past-heading" className="mb-16">
          <h2
            id="past-heading"
            className="font-display text-2xl tracking-tight sm:text-3xl"
          >
            Past events
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
            A record of what the Institute has delivered, most recent first.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((item, index) => (
              <ContentCard key={item._id} item={item} delayMs={index * 80} />
            ))}
          </div>
        </section>
      ) : null}

      <aside className="border-t border-border pt-10">
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Looking for something longer-form? Programs, certifications, and
          internships have their own home.
        </p>
        <Button asChild variant="outline" className="mt-4 gap-2">
          <Link href="/programs">
            Browse programs
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </aside>
    </div>
  );
}
