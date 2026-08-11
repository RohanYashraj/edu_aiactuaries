import Link from "next/link";
import { Briefcase, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  MarketingListCard,
  MetaIconRow,
} from "@/components/marketing";

const typeColors: Record<string, "default" | "secondary" | "outline"> = {
  "full-time": "default",
  "part-time": "secondary",
  contract: "outline",
  internship: "secondary",
};

export type JobSummary = {
  _id: string;
  title: string;
  summary?: string;
  description: string;
  company: string;
  location: string;
  type: string;
  slug?: string;
};

/** Presentational; the route fetches on the server so crawlers see the list. */
export function JobsList({ jobs }: { jobs: JobSummary[] }) {
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
      {jobs.map((job, i) => {
        // Fall back to the id only for legacy rows that predate slugs; the
        // detail route redirects those to the canonical URL.
        const href = `/jobs/${job.slug ?? job._id}`;

        return (
          <MarketingListCard
            key={job._id}
            title={job.title}
            description={job.summary ?? job.description}
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
                    { icon: <Briefcase className="size-4" />, label: job.company },
                    { icon: <MapPin className="size-4" />, label: job.location },
                  ]}
                />
                <Link href={href}>
                  <Button variant="outline" size="sm" className="mt-5">
                    View Details
                  </Button>
                </Link>
              </>
            }
            delayMs={i * 100}
          />
        );
      })}
    </div>
  );
}
