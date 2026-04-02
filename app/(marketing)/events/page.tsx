import { EventsList } from "./_components/events-list";
import { SectionHeader } from "@/components/marketing";

export const metadata = {
  title: "Events — Sri Sathya Sai Institute of Actuaries",
  description:
    "Upcoming programs, intensives, and events from the Sri Sathya Sai Institute of Actuaries.",
};

export default function EventsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeader
        as="h1"
        title="Events"
        description="Programs and gatherings at the intersection of actuarial science and AI. More events will be listed here as details are confirmed."
      />
      <EventsList />
    </section>
  );
}
