import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { EmptyState, SectionHeader } from "@/components/marketing";
import { ContentCard } from "@/components/content/content-card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { fetchQuery } from "@/lib/convex-server";
import { contentHref, lifecycleLabel } from "@/lib/content";
import type { Doc } from "@/convex/_generated/dataModel";

export const metadata = buildMetadata({
  title: "Programs",
  description:
    "Programs, certifications, and internships from the Sri Sathya Sai Institute of Actuaries, spanning actuarial data science, machine learning, and risk analytics.",
  path: "/programs",
});

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

/** Falls back to the lifecycle (Upcoming / Ongoing / Completed) when the
 * editor hasn't set an explicit badge, so time-bound offerings always say
 * where they stand. */
function withLifecycleBadge(item: Doc<"content">) {
  return {
    ...item,
    badge:
      item.badge ??
      ("lifecycle" in item.details
        ? lifecycleLabel(item.details.lifecycle)
        : undefined),
  };
}

function OfferingSection({
  id,
  title,
  description,
  items,
  emptyTitle,
  emptyDescription,
}: {
  id: string;
  title: string;
  description: string;
  items: Doc<"content">[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="mb-16">
      <h2
        id={`${id}-heading`}
        className="font-display text-2xl tracking-tight sm:text-3xl"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
        {description}
      </p>

      {items.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <ContentCard
              key={item._id}
              item={withLifecycleBadge(item)}
              delayMs={index * 80}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * All long-form offerings in one place: programs, certifications, and
 * internships. One-off events and workshops live on /events; the two pages
 * cross-link. Detail pages keep their own per-type URLs.
 */
export default async function ProgramsPage() {
  const [certifications, programs, internships] = await Promise.all([
    fetchQuery(api.content.listByType, { type: "certification" }),
    fetchQuery(api.content.listByTypeChronological, { type: "program" }),
    fetchQuery(api.content.listByTypeChronological, { type: "internship" }),
  ]);

  const flagship = certifications.find((c) => c.featured);
  const otherCertifications = certifications.filter((c) => c !== flagship);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <JsonLd
        nodes={[breadcrumbSchema([{ label: "Programs", href: "/programs" }])]}
      />

      <SectionHeader
        as="h1"
        title="Programs"
        description="Long-form learning that blends actuarial science and AI — structured programs, credential-bearing certifications, and hands-on internships."
      />

      <OfferingSection
        id="programs"
        title="Programs"
        description="Comprehensive, long-form courses blending actuarial science and AI."
        items={programs}
        emptyTitle="No programs published"
        emptyDescription="Upcoming programs will be listed here as dates are confirmed."
      />

      {flagship ? (
        <section className="mb-16 border-y border-border py-10">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
            Flagship certification
          </p>
          <h2 className="mt-3 font-display text-2xl leading-snug tracking-tight sm:text-3xl">
            <Link
              href={contentHref("certification", flagship.slug)}
              className="transition-colors hover:text-gold"
            >
              {flagship.title}
            </Link>
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            {flagship.summary}
          </p>
          <Button asChild className="mt-6 gap-2">
            <Link href={contentHref("certification", flagship.slug)}>
              Learn more
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>
      ) : null}

      <OfferingSection
        id="certifications"
        title="Certifications"
        description="Structured programs that build toward a credential."
        items={otherCertifications}
        emptyTitle="No certifications published"
        emptyDescription="Certification programs will be listed here shortly."
      />

      <OfferingSection
        id="internships"
        title="Internships"
        description="Practical experience and real-world application of actuarial science."
        items={internships}
        emptyTitle="No internships published"
        emptyDescription="Upcoming internship opportunities will be listed here."
      />

      <aside className="border-t border-border pt-10">
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Looking for a single session instead? Webinars, workshops, and
          gatherings are listed on the events page.
        </p>
        <Button asChild variant="outline" className="mt-4 gap-2">
          <Link href="/events">
            Browse events
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </aside>
    </div>
  );
}
