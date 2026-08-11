import { JobDetail } from "./_components/job-detail";

import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

const internshipJobId = "jn714k9hspp01s5vh153z52ra5840te4";

const internshipTitle = "AI Actuarial Internship Program (AI-AIP)";
const internshipDescription =
  "8-week hands-on internship for actuarial students to build practical AI skills across pricing, reserving, claims analytics, and fraud detection in P&C insurance.";

export async function generateMetadata({
  params,
}: {
  // Next 16 passes params as a Promise. Typing it as a plain object made
  // `params.id` undefined at runtime, so every job page emitted
  // canonical=/jobs/undefined.
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  if (id === internshipJobId) {
    return buildMetadata({
      title: internshipTitle,
      description: internshipDescription,
      path: `/jobs/${id}`,
    });
  }

  return buildMetadata({
    title: "Job Details",
    description:
      "Explore job opportunities in actuarial data science and AI posted by leading employers.",
    path: `/jobs/${id}`,
  });
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JobDetail jobId={id} />
    </section>
  );
}
