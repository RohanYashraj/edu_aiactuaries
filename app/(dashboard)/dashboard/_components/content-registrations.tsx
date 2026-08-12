"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** Everyone who registered for one item, with a CSV export. */
export function ContentRegistrations({ contentId }: { contentId: string }) {
  const rows = useQuery(api.registrations.listForContent, {
    contentId: contentId as Id<"content">,
  });

  if (rows === undefined) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        No registrations yet.
      </p>
    );
  }

  function exportCsv() {
    const header = ["Name", "Email", "Institution", "Stage", "Status", "Registered"];
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const lines = [
      header.join(","),
      ...(rows ?? []).map((row) =>
        [
          row.member?.name ?? "",
          row.member?.email ?? "",
          row.member?.institution ?? "",
          row.member?.experienceLevel ?? "",
          row.status,
          new Date(row.createdAt).toISOString().slice(0, 10),
        ]
          .map(escape)
          .join(","),
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const active = rows.filter((row) => row.status !== "cancelled");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {active.length} registered
          {rows.length !== active.length
            ? ` · ${rows.length - active.length} cancelled`
            : ""}
        </p>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-40">Institution</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-28">Registered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row._id}>
                <TableCell className="font-medium">
                  {row.member?.name ?? "Deleted member"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {row.member?.email ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {row.member?.institution ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={row.status === "cancelled" ? "outline" : "secondary"}
                    className="capitalize"
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {new Date(row.createdAt).toLocaleDateString("en-GB")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
