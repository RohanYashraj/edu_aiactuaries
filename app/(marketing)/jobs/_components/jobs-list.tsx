"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Briefcase, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  EmptyState,
  LoadingState,
  MarketingListCard,
  MetaIconRow,
} from "@/components/marketing";

const typeColors: Record<string, "default" | "secondary" | "outline"> = {
  "full-time": "default",
  "part-time": "secondary",
  contract: "outline",
  internship: "secondary",
};

export function JobsList() {
  const jobs = useQuery(api.jobs.listPublishedSummary);

  if (jobs === undefined) {
    return <LoadingState />;
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase className="size-10 text-muted-foreground/40" />}
        title="No job openings right now"
        description="Check back soon — employers are actively posting new opportunities."
      />
    );
  }

  return (
    <div className="grid gap-6">
      {jobs.map((job, i) => (
        <MarketingListCard
          key={job._id}
          title={job.title}
          description={job.description}
          descriptionClassName="line-clamp-2"
          badge={
            <Badge
              variant={typeColors[job.type] ?? "outline"}
              className="shrink-0 capitalize"
            >
              {job.type.replace("-", " ")}
            </Badge>
          }
          footer={
            <>
              <MetaIconRow
                items={[
                  {
                    icon: <Briefcase className="size-4" />,
                    label: job.company,
                  },
                  {
                    icon: <MapPin className="size-4" />,
                    label: job.location,
                  },
                ]}
              />
              <Link href={`/jobs/${job._id}`}>
                <Button variant="outline" size="sm" className="mt-5">
                  View Details
                </Button>
              </Link>
            </>
          }
          delayMs={i * 100}
        />
      ))}
    </div>
  );
}
