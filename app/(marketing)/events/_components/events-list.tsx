import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        <Card
          key={event.title}
          className="animate-fade-in-up flex flex-col"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <CardHeader>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <CardDescription className="leading-relaxed">
              {event.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-gold/15 text-gold hover:bg-gold/20">Registrations Open</Badge>
              <Button variant="ghost" size="sm" asChild>
                <Link href={event.href}>Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
