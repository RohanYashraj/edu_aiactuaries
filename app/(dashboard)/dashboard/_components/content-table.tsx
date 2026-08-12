"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { ExternalLink, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CONTENT_TYPE_LABELS, contentHref } from "@/lib/content";
import { revalidateContent } from "@/lib/revalidate";
import type { ContentStatus } from "./status-badge";

type ContentType = Doc<"content">["type"];

const TYPES: ContentType[] = [
  "event",
  "program",
  "workshop",
  "certification",
  "news",
];
const STATUSES: ContentStatus[] = ["draft", "scheduled", "published", "archived"];

const ALL = "all";

export function ContentTable() {
  const [type, setType] = useState<ContentType | typeof ALL>(ALL);
  const [status, setStatus] = useState<ContentStatus | typeof ALL>(ALL);
  const [term, setTerm] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Doc<"content"> | null>(null);

  const listed = useQuery(api.contentAdmin.list, {
    type: type === ALL ? undefined : type,
    status: status === ALL ? undefined : status,
  });
  const searched = useQuery(
    api.contentAdmin.search,
    term.trim() ? { term, type: type === ALL ? undefined : type } : "skip",
  );

  const setStatusMutation = useMutation(api.contentAdmin.setStatus);
  const setFeatured = useMutation(api.contentAdmin.setFeatured);
  const remove = useMutation(api.contentAdmin.remove);

  const rows = term.trim() ? searched : listed;

  async function changeStatus(id: Id<"content">, next: ContentStatus) {
    try {
      const result = await setStatusMutation({ id, status: next });
      // Flush the ISR cache so the change is visible on the site immediately.
      await revalidateContent([
        contentHref(result.type, result.slug),
        result.type === "event" || result.type === "program"
          ? "/events"
          : result.type === "workshop"
            ? "/workshops"
            : result.type === "certification"
              ? "/certifications"
              : "/news",
        "/",
      ]);
      toast.success(`Moved to ${next}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change status");
    }
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
            Content
          </h1>
          <p className="mt-1 text-muted-foreground">
            Events, programs, workshops, certifications and news.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/content/new">
            <Plus className="size-4" />
            New content
          </Link>
        </Button>
      </header>

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search titles..."
          className="max-w-xs"
        />
        <Select
          value={type}
          onValueChange={(v) => setType(v as ContentType | typeof ALL)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {CONTENT_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as ContentStatus | typeof ALL)}
          // Convex search indexes filter on equality; combining a free-text
          // search with a status filter isn't supported here, so disable it.
          disabled={Boolean(term.trim())}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {rows === undefined ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          Nothing matches those filters.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-32">Type</TableHead>
                <TableHead className="w-36">Status</TableHead>
                <TableHead className="w-20 text-center">Featured</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((doc) => (
                <TableRow key={doc._id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/content/${doc._id}`}
                      className="font-medium hover:text-gold"
                    >
                      {doc.title}
                    </Link>
                    <p className="font-mono text-xs text-muted-foreground">
                      /{doc.slug}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {CONTENT_TYPE_LABELS[doc.type]}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={doc.status}
                      onValueChange={(v) =>
                        changeStatus(doc._id, v as ContentStatus)
                      }
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
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={
                        doc.featured ? "Unfeature" : "Feature on the homepage"
                      }
                      aria-pressed={doc.featured}
                      onClick={async () => {
                        await setFeatured({
                          id: doc._id,
                          featured: !doc.featured,
                        });
                        await revalidateContent(["/"]);
                        toast.success(
                          doc.featured ? "Removed from homepage" : "Featured",
                        );
                      }}
                    >
                      <Star
                        className={
                          doc.featured
                            ? "size-4 fill-gold text-gold"
                            : "size-4 text-muted-foreground"
                        }
                      />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {doc.status === "published" ? (
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link
                            href={contentHref(doc.type, doc.slug)}
                            target="_blank"
                            aria-label="View on site"
                          >
                            <ExternalLink className="size-4" />
                          </Link>
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Delete"
                        onClick={() => setPendingDelete(doc)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &ldquo;{pendingDelete?.title}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This removes the content and its revision history permanently. If
              you only want to take it off the site, set the status to archived
              instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!pendingDelete) return;
                try {
                  await remove({ id: pendingDelete._id });
                  await revalidateContent([
                    contentHref(pendingDelete.type, pendingDelete.slug),
                    "/",
                  ]);
                  toast.success("Deleted");
                } catch (err) {
                  toast.error(
                    err instanceof Error ? err.message : "Could not delete",
                  );
                } finally {
                  setPendingDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
