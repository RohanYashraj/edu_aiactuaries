import { EventsList } from "./_components/events-list";

export const metadata = {
  title: "Events — SSS CoE Actuarial DS & AI",
  description:
    "Upcoming programs, intensives, and events from the Sri Sathya Sai Institute of Actuaries.",
};

export default function EventsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-14 text-center">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Events
        </h1>
        <p className="mt-3 text-muted-foreground">
          Programs and gatherings at the intersection of actuarial science and
          AI. More events will be listed here as details are confirmed.
        </p>
      </div>
      <EventsList />
    </section>
  );
}
