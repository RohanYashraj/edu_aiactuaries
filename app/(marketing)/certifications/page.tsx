import { CertificationsList } from "./_components/certifications-list";
import { SectionHeader } from "@/components/marketing";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Certifications",
  description:
    "Explore our professional certifications in Actuarial Data Science and AI, featuring the flagship AI Actuaries Certification.",
  path: "/certifications",
});

export default function CertificationsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeader
        as="h1"
        title="Certifications"
        description="Professional certifications designed to bridge Actuarial Science, Data Science, and Artificial Intelligence."
      />
      <CertificationsList />
    </section>
  );
}
