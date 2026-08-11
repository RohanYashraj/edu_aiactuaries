"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { revalidateContent } from "@/lib/revalidate";

type JobStatus = Doc<"jobs">["status"];

const STATUSES: JobStatus[] = ["draft", "published", "closed"];

export function JobsModeration() {
  const jobs = useQuery(api.jobs.adminList, {});
  const updateStatus = useMutation(api.jobs.updateStatus);

  if (jobs === undefined) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
        No job listings yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="w-44">Company</TableHead>
            <TableHead className="w-32">Type</TableHead>
            <TableHead className="w-36">Status</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job._id}>
              <TableCell>
                <p className="font-medium">{job.title}</p>
                {job.slug ? (
                  <p className="font-mono text-xs text-muted-foreground">
                    /jobs/{job.slug}
                  </p>
                ) : null}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {job.company}
              </TableCell>
              <TableCell className="text-sm capitalize text-muted-foreground">
                {job.type.replace("-", " ")}
              </TableCell>
              <TableCell>
                <Select
                  value={job.status}
                  onValueChange={async (v) => {
                    try {
                      await updateStatus({
                        id: job._id as Id<"jobs">,
                        status: v as JobStatus,
                      });
                      await revalidateContent([
                        "/jobs",
                        job.slug ? `/jobs/${job.slug}` : "/jobs",
                        "/",
                      ]);
                      toast.success(`Moved to ${v}`);
                    } catch (err) {
                      toast.error(
                        err instanceof Error
                          ? err.message
                          : "Could not change status",
                      );
                    }
                  }}
                >
                  <SelectTrigger size="sm" className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {job.status === "published" && job.slug ? (
                  <Button asChild variant="ghost" size="icon-sm">
                    <Link
                      href={`/jobs/${job.slug}`}
                      target="_blank"
                      aria-label="View on site"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
