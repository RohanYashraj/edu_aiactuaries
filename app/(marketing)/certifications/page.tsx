import { CertificationsList } from "./_components/certifications-list";
import { SectionHeader } from "@/components/marketing";

export const metadata = {
  title: "Certifications — Sri Sathya Sai Institute of Actuaries",
  description:
    "Explore our professional certifications in Actuarial Data Science and AI, featuring the flagship AI Actuaries Certification.",
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
