"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Briefcase, MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const typeColors: Record<string, "default" | "secondary" | "outline"> = {
  "full-time": "default",
  "part-time": "secondary",
  contract: "outline",
  internship: "secondary",
};

export function JobsList() {
  const jobs = useQuery(api.jobs.listPublished);

  if (jobs === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center">
        <Briefcase className="mx-auto mb-3 size-10 text-muted-foreground/50" />
        <p className="text-lg font-medium">No job openings right now</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Check back soon — employers are actively posting new opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {jobs.map((job) => (
        <Card key={job._id}>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <CardDescription className="mt-1 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="size-3.5" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {job.location}
                  </span>
                </CardDescription>
              </div>
              <Badge
                variant={typeColors[job.type] ?? "outline"}
                className="shrink-0 capitalize"
              >
                {job.type.replace("-", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {job.description}
            </p>
            <Link href={`/jobs/${job._id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
