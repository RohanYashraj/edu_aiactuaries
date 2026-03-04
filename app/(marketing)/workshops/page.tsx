import { CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Workshops — SSS CoE Actuarial DS & AI",
  description:
    "Hands-on workshops in actuarial data science, AI, and risk analytics.",
};

const workshops = [
  {
    title: "Introduction to Actuarial Machine Learning",
    description:
      "A hands-on workshop covering supervised and unsupervised learning techniques with real-world actuarial datasets.",
    date: "2026-04-15",
    location: "Online",
    status: "upcoming" as const,
  },
  {
    title: "Python for Actuarial Modelling",
    description:
      "Get started with Python for building actuarial models — from data wrangling to statistical analysis and visualisation.",
    date: "2026-03-20",
    location: "Online",
    status: "upcoming" as const,
  },
  {
    title: "Deep Learning in Risk Assessment",
    description:
      "Explore neural network architectures and their applications in insurance risk modelling and claims prediction.",
    date: "2026-02-10",
    location: "Hybrid — Mumbai & Online",
    status: "completed" as const,
  },
  {
    title: "NLP for Insurance Document Analysis",
    description:
      "Learn how natural language processing is transforming how insurers extract insights from policy documents and claims.",
    date: "2026-05-01",
    location: "Online",
    status: "upcoming" as const,
  },
];

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  upcoming: "default",
  ongoing: "secondary",
  completed: "outline",
};

function WorkshopCard({
  workshop,
}: {
  workshop: (typeof workshops)[number];
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{workshop.title}</CardTitle>
          <Badge variant={statusVariant[workshop.status]} className="shrink-0 capitalize">
            {workshop.status}
          </Badge>
        </div>
        <CardDescription>{workshop.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {workshop.date && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {new Date(workshop.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          {workshop.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {workshop.location}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function WorkshopsPage() {
  const upcoming = workshops.filter((w) => w.status === "upcoming");
  const ongoing = workshops.filter((w) => w.status === "ongoing");
  const completed = workshops.filter((w) => w.status === "completed");

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Workshops
        </h1>
        <p className="mt-3 text-muted-foreground">
          Practical, hands-on workshops at the intersection of Actuarial Science
          and AI.
        </p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-8">
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="ongoing">
            Ongoing ({ongoing.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {upcoming.map((w) => (
                <WorkshopCard key={w.title} workshop={w} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-muted-foreground">
              No upcoming workshops at the moment. Check back soon!
            </p>
          )}
        </TabsContent>

        <TabsContent value="ongoing">
          {ongoing.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {ongoing.map((w) => (
                <WorkshopCard key={w.title} workshop={w} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-muted-foreground">
              No workshops are currently in progress.
            </p>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completed.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {completed.map((w) => (
                <WorkshopCard key={w.title} workshop={w} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-muted-foreground">
              No completed workshops yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
