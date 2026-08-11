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

export const metadata = buildMetadata({
  title: "Programs",
  description:
    "Certifications and workshops from the Sri Sathya Sai Institute of Actuaries, spanning actuarial data science, machine learning, and risk analytics.",
  path: "/programs",
});

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

/**
 * Certifications and workshops in one place. Detail pages keep their own
 * URLs (/certifications/[slug], /workshops/[slug]) — only the two index pages
 * are consolidated here, so nothing already indexed moves.
 */
export default async function ProgramsPage() {
  const [certifications, workshops] = await Promise.all([
    fetchQuery(api.content.listByType, { type: "certification" }),
    fetchQuery(api.content.listByTypeChronological, { type: "workshop" }),
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
        description="Certifications and workshops bridging actuarial science, data science, and artificial intelligence."
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

      <section aria-labelledby="certifications-heading" className="mb-16">
        <h2
          id="certifications-heading"
          className="font-display text-2xl tracking-tight sm:text-3xl"
        >
          Certifications
        </h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
          Structured programs that build toward a credential.
        </p>

        {otherCertifications.length === 0 ? (
          <EmptyState
            title="No certifications published"
            description="Certification programs will be listed here shortly."
          />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherCertifications.map((item, index) => (
              <ContentCard key={item._id} item={item} delayMs={index * 80} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="workshops-heading">
        <h2
          id="workshops-heading"
          className="font-display text-2xl tracking-tight sm:text-3xl"
        >
          Workshops
        </h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
          Short, hands-on sessions on a single technique or tool.
        </p>

        {workshops.length === 0 ? (
          <EmptyState
            title="No workshops published"
            description="Upcoming workshops will be listed here as dates are confirmed."
          />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workshops.map((item, index) => (
              <ContentCard
                key={item._id}
                // Without the old status tabs, a finished workshop would be
                // indistinguishable from an upcoming one.
                item={{
                  ...item,
                  badge:
                    item.badge ??
                    (item.details.kind === "workshop"
                      ? lifecycleLabel(item.details.lifecycle)
                      : undefined),
                }}
                delayMs={index * 80}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
