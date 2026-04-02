import { JobsList } from "./_components/jobs-list";
import { SectionHeader } from "@/components/marketing";

export const metadata = {
  title: "Jobs — SSS CoE Actuarial DS & AI",
  description:
    "Explore job opportunities in actuarial data science and AI posted by leading employers.",
};

export default function JobsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeader
        as="h1"
        title="Job Opportunities"
        description="Find roles at the forefront of Actuarial Science, Data Science, and AI."
      />
      <JobsList />
    </section>
  );
}
