"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentCard, type ContentCardItem } from "@/components/content/content-card";

export type WorkshopItem = ContentCardItem & {
  lifecycle: "upcoming" | "ongoing" | "completed";
};

function Grid({
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
      {workshops.map((workshop, index) => (
        <ContentCard key={workshop._id} item={workshop} delayMs={index * 100} />
      ))}
    </div>
  );
}

/**
 * Only the tab switching is client-side. The workshops themselves are fetched
 * on the server and passed in, so all three tabs' content is present in the
 * initial HTML — a crawler sees completed workshops too, not just the default
 * tab.
 */
export function WorkshopsTabs({ workshops }: { workshops: WorkshopItem[] }) {
  const upcoming = workshops.filter((w) => w.lifecycle === "upcoming");
  const ongoing = workshops.filter((w) => w.lifecycle === "ongoing");
  const completed = workshops.filter((w) => w.lifecycle === "completed");

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
        <Grid
          workshops={upcoming}
          emptyMessage="No upcoming workshops at the moment. Check back soon."
        />
      </TabsContent>
      <TabsContent value="ongoing">
        <Grid
          workshops={ongoing}
          emptyMessage="No workshops are currently in progress."
        />
      </TabsContent>
      <TabsContent value="completed">
        <Grid
          workshops={completed}
          emptyMessage="No completed workshops to show yet."
        />
      </TabsContent>
    </Tabs>
  );
}
