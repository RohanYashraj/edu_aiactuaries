import { JobsList } from "./_components/jobs-list";
import { SectionHeader } from "@/components/marketing";

export const metadata = {
  title: "Jobs — Sri Sathya Sai Institute of Actuaries",
  description:
    "Explore job opportunities in actuarial data science and AI posted by leading employers.",
  openGraph: {
    images: [
      {
        url: "/sssia.png",
        width: 1200,
        height: 630,
        alt: "Sri Sathya Sai Institute of Actuaries",
      },
    ],
  },
  twitter: {
    images: ["/sssia.png"],
  },
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
