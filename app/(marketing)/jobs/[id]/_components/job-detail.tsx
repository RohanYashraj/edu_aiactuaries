"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ArrowLeft, Briefcase, MapPin, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function JobDetail({ jobId }: { jobId: string }) {
  const job = useQuery(api.jobs.getById, {
    id: jobId as Id<"jobs">,
  });

  if (job === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (job === null) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-lg font-medium">Job not found</p>
        <p className="text-sm text-muted-foreground">
          This listing may have been removed or the link is incorrect.
        </p>
        <Link href="/jobs">
          <Button variant="outline" className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back to Jobs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link href="/jobs">
        <Button variant="ghost" size="sm" className="mb-6 gap-1.5">
          <ArrowLeft className="size-4" />
          Back to Jobs
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3">
            <Badge variant="outline" className="w-fit capitalize">
              {job.type.replace("-", " ")}
            </Badge>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Briefcase className="size-4" />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {job.type.replace("-", " ")}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold">Description</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {job.description}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-semibold">How to Apply</h2>
            <p className="text-sm text-muted-foreground">
              Contact the employer directly for application details. Make sure
              your profile is complete and up to date.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
