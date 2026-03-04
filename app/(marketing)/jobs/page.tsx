import { JobsList } from "./_components/jobs-list";

export const metadata = {
  title: "Jobs — SSS CoE Actuarial DS & AI",
  description:
    "Explore job opportunities in actuarial data science and AI posted by leading employers.",
};

export default function JobsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Job Opportunities
        </h1>
        <p className="mt-3 text-muted-foreground">
          Find roles at the forefront of Actuarial Science, Data Science, and
          AI.
        </p>
      </div>
      <JobsList />
    </section>
  );
}
