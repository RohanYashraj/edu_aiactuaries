"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { FileText, Plus } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CONTENT_TYPE_LABELS, contentHref } from "@/lib/content";
import { STATUS_VARIANTS } from "./status-badge";

export function AdminOverview() {
  const stats = useQuery(api.contentAdmin.stats);
  const recent = useQuery(api.contentAdmin.list, { limit: 8 });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            ["Published", stats?.published],
            ["Drafts", stats?.draft],
            ["Scheduled", stats?.scheduled],
            ["Featured", stats?.featured],
          ] as const
        ).map(([label, count]) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {count === undefined ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="font-display text-3xl">{count}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/content/new">
            <Plus className="size-4" />
            New content
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/content">
            <FileText className="size-4" />
            All content
          </Link>
        </Button>
      </div>

      <section>
        <h2 className="mb-4 font-display text-xl tracking-tight">
          Recently edited
        </h2>
        {recent === undefined ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            No content yet. Create the first item to get started.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {recent.map((doc) => (
              <li
                key={doc._id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/content/${doc._id}`}
                    className="font-medium hover:text-gold"
                  >
                    {doc.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {CONTENT_TYPE_LABELS[doc.type]} ·{" "}
                    {new Date(doc.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_VARIANTS[doc.status]}>
                    {doc.status}
                  </Badge>
                  {doc.status === "published" ? (
                    <Button asChild variant="ghost" size="sm">
                      <Link
                        href={contentHref(doc.type, doc.slug)}
                        target="_blank"
                      >
                        View
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
