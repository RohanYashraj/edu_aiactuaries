import { WorkshopsList } from "./_components/workshops-list";
import { SectionHeader } from "@/components/marketing";

export const metadata = {
  title: "Workshops — Sri Sathya Sai Institute of Actuaries",
  description:
    "Hands-on workshops in actuarial data science, AI, and risk analytics.",
};

export default function WorkshopsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeader
        as="h1"
        title="Workshops"
        description="Practical, hands-on workshops at the intersection of Actuarial Science and AI."
      />
      <WorkshopsList />
    </section>
  );
}
