import { CertificationsList } from "./_components/certifications-list";

export const metadata = {
  title: "Certifications — SSS CoE Actuarial DS & AI",
  description:
    "Explore our professional certifications in Actuarial Data Science and AI, featuring the flagship AI Actuaries Certification.",
};

export default function CertificationsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-14 text-center">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Certifications
        </h1>
        <p className="mt-3 text-muted-foreground">
          Professional certifications designed to bridge Actuarial Science, Data
          Science, and Artificial Intelligence.
        </p>
      </div>
      <CertificationsList />
    </section>
  );
}
