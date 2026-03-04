"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CalendarDays, MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type WorkshopStatus = "upcoming" | "ongoing" | "completed";

interface WorkshopItem {
  title: string;
  description: string;
  date?: string;
  location?: string;
  status: WorkshopStatus;
}

const fallbackWorkshops: WorkshopItem[] = [
  {
    title: "Introduction to Actuarial Machine Learning",
    description:
      "A hands-on workshop covering supervised and unsupervised learning techniques with real-world actuarial datasets.",
    date: "2026-04-15",
    location: "Online",
    status: "upcoming",
  },
  {
    title: "Python for Actuarial Modelling",
    description:
      "Get started with Python for building actuarial models — from data wrangling to statistical analysis and visualisation.",
    date: "2026-03-20",
    location: "Online",
    status: "upcoming",
  },
  {
    title: "Deep Learning in Risk Assessment",
    description:
      "Explore neural network architectures and their applications in insurance risk modelling and claims prediction.",
    date: "2026-02-10",
    location: "Hybrid — Mumbai & Online",
    status: "completed",
  },
  {
    title: "NLP for Insurance Document Analysis",
    description:
      "Learn how natural language processing is transforming how insurers extract insights from policy documents and claims.",
    date: "2026-05-01",
    location: "Online",
    status: "upcoming",
  },
];

const statusVariant: Record<WorkshopStatus, "default" | "secondary" | "outline"> = {
  upcoming: "default",
  ongoing: "secondary",
  completed: "outline",
};

function WorkshopCard({ workshop }: { workshop: WorkshopItem }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{workshop.title}</CardTitle>
          <Badge
            variant={statusVariant[workshop.status]}
            className="shrink-0 capitalize"
          >
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

function StatusTab({
  workshops,
  emptyMessage,
}: {
  workshops: WorkshopItem[];
  emptyMessage: string;
}) {
  if (workshops.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">{emptyMessage}</p>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {workshops.map((w) => (
        <WorkshopCard key={w.title} workshop={w} />
      ))}
    </div>
  );
}

export function WorkshopsList() {
  const convexData = useQuery(api.workshops.list);

  if (convexData === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const workshops: WorkshopItem[] =
    convexData.length > 0
      ? convexData.map((w) => ({
          title: w.title,
          description: w.description,
          date: w.date ?? undefined,
          location: w.location ?? undefined,
          status: w.status,
        }))
      : fallbackWorkshops;

  const upcoming = workshops.filter((w) => w.status === "upcoming");
  const ongoing = workshops.filter((w) => w.status === "ongoing");
  const completed = workshops.filter((w) => w.status === "completed");

  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="mb-8">
        <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
        <TabsTrigger value="ongoing">Ongoing ({ongoing.length})</TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({completed.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        <StatusTab
          workshops={upcoming}
          emptyMessage="No upcoming workshops at the moment. Check back soon!"
        />
      </TabsContent>
      <TabsContent value="ongoing">
        <StatusTab
          workshops={ongoing}
          emptyMessage="No workshops are currently in progress."
        />
      </TabsContent>
      <TabsContent value="completed">
        <StatusTab
          workshops={completed}
          emptyMessage="No completed workshops yet."
        />
      </TabsContent>
    </Tabs>
  );
}
