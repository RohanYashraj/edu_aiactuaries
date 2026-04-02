import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketingListCard } from "@/components/marketing";

const events = [
  {
    title: "Summer Course in Actuarial Data Science – 2026",
    description:
      "A 3-week comprehensive program covering Financial Mathematics, Probability, Economics, and R/Excel basics. Registrations are open.",
    href: "/events/summer-program-2026",
  },
] as const;

export function EventsList() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, i) => (
        <MarketingListCard
          key={event.title}
          title={event.title}
          description={event.description}
          footer={
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-gold/15 text-gold hover:bg-gold/20">Registrations Open</Badge>
              <Button variant="ghost" size="sm" asChild>
                <Link href={event.href}>Details</Link>
              </Button>
            </div>
          }
          delayMs={i * 100}
        />
      ))}
    </div>
  );
}
