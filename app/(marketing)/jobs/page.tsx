import { api } from "@/convex/_generated/api";
import { JobsList } from "./_components/jobs-list";
import { SectionHeader } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { fetchQuery } from "@/lib/convex-server";

export const metadata = buildMetadata({
  title: "Jobs",
  description:
    "Explore job opportunities in actuarial data science and AI posted by leading employers.",
  path: "/jobs",
});

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

export default async function JobsPage() {
  const jobs = await fetchQuery(api.jobs.listPublishedSummary, {});

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <JsonLd nodes={[breadcrumbSchema([{ label: "Jobs", href: "/jobs" }])]} />
      <SectionHeader
        as="h1"
        title="Job Opportunities"
        description="Find roles at the forefront of Actuarial Science, Data Science, and AI."
      />
      <JobsList jobs={jobs} />
    </section>
  );
}
