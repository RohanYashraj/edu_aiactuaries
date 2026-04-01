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
      <div className="rounded-xl border border-dashed border-border py-16 text-center">
        <Briefcase className="mx-auto mb-3 size-10 text-muted-foreground/40" />
        <p className="font-display text-lg">No job openings right now</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Check back soon — employers are actively posting new opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {jobs.map((job, i) => (
        <Card
          key={job._id}
          className="animate-fade-in-up flex flex-col"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <Badge
                variant={typeColors[job.type] ?? "outline"}
                className="shrink-0 capitalize"
              >
                {job.type.replace("-", " ")}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2 leading-relaxed">
              {job.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Briefcase className="size-4" />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {job.location}
              </span>
            </div>
            <Link href={`/jobs/${job._id}`}>
              <Button variant="outline" size="sm" className="mt-5">
                View Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
