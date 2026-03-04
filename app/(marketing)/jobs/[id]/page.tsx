import { JobDetail } from "./_components/job-detail";

export const metadata = {
  title: "Job Details — SSS CoE Actuarial DS & AI",
};

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
