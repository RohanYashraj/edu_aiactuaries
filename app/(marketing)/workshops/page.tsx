import { WorkshopsList } from "./_components/workshops-list";

export const metadata = {
  title: "Workshops — SSS CoE Actuarial DS & AI",
  description:
    "Hands-on workshops in actuarial data science, AI, and risk analytics.",
};

export default function WorkshopsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-14 text-center">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Workshops
        </h1>
        <p className="mt-3 text-muted-foreground">
          Practical, hands-on workshops at the intersection of Actuarial Science
          and AI.
        </p>
      </div>
      <WorkshopsList />
    </section>
  );
}
