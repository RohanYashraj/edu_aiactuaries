import { JobDetail } from "./_components/job-detail";

import type { Metadata } from "next";

const siteName = "Sri Sathya Sai Institute of Actuaries";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sssia.org";

const internshipJobId = "jn714k9hspp01s5vh153z52ra5840te4";

const internshipTitle = "AI Actuarial Internship Program (AI-AIP)";
const internshipDescription =
  "8-week hands-on internship for actuarial students to build practical AI skills across pricing, reserving, claims analytics, and fraud detection in P&C insurance.";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;
  const pageUrl = `${siteUrl}/jobs/${id}`;

  if (id === internshipJobId) {
    const ogImageUrl = `${siteUrl}/sssia.png`;
    return {
      title: `${internshipTitle} — Powered by aiactuaries.org`,
      description: internshipDescription,
      alternates: { canonical: pageUrl },
      openGraph: {
        type: "website",
        siteName,
        title: internshipTitle,
        description: internshipDescription,
        url: pageUrl,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: internshipTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: internshipTitle,
        description: internshipDescription,
        images: [ogImageUrl],
      },
    };
  }

  return {
    title: `Job Details — Powered by aiactuaries.org`,
    description:
      "Explore job opportunities in actuarial data science and AI posted by leading employers.",
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "website",
      siteName,
      title: "Job Details",
      description:
        "Explore job opportunities in actuarial data science and AI posted by leading employers.",
      url: pageUrl,
    },
  };
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
