import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { JobDetail } from "./_components/job-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema, jobPostingSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { fetchQuery } from "@/lib/convex-server";

/**
 * Canonical job URL is the slug. Raw Convex document ids (the old
 * /jobs/jn714k9... links, which are unshareable and unindexable) are detected
 * and permanently redirected.
 *
 * `[id]` and `[slug]` can't coexist as sibling dynamic segments in Next, so
 * both behaviours live in this one route.
 *
 * No generateStaticParams: listings expire on employer timelines, so
 * on-demand ISR fits better than build-time prerendering.
 */
// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

/** Convex document ids are 32 chars of lowercase base32. */
const CONVEX_ID = /^[0-9a-z]{32}$/;

async function resolve(slugOrId: string) {
  if (CONVEX_ID.test(slugOrId)) {
    const byId = await fetchQuery(api.jobs.getById, {
      id: slugOrId as Id<"jobs">,
    });
    return { job: byId, wasId: true as const };
  }

  const job = await fetchQuery(api.jobs.getBySlugPublished, { slug: slugOrId });
  return { job, wasId: false as const };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { job } = await resolve(slug);

  if (!job) {
    return buildMetadata({ title: "Job not found", noindex: true });
  }

  return buildMetadata({
    title: job.seo?.metaTitle ?? job.title,
    description:
      job.seo?.metaDescription ?? job.summary ?? job.description.slice(0, 200),
    path: `/jobs/${job.slug ?? slug}`,
    canonical: job.seo?.canonicalUrl,
    keywords: job.seo?.keywords,
    noindex: job.seo?.noindex,
  });
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { job, wasId } = await resolve(slug);

  if (!job || job.status !== "published") notFound();

  // Old id-based links keep working, but land on the canonical URL.
  if (wasId && job.slug) permanentRedirect(`/jobs/${job.slug}`);

  const url = absoluteUrl(`/jobs/${job.slug ?? slug}`);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd
        nodes={[
          jobPostingSchema(job, url),
          faqSchema(job.faqs ?? []),
          breadcrumbSchema([
            { label: "Jobs", href: "/jobs" },
            { label: job.title, href: `/jobs/${job.slug ?? slug}` },
          ]),
        ]}
      />
      <JobDetail job={job} />
    </section>
  );
}
