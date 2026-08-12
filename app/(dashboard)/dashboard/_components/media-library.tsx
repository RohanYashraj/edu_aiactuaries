"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { AlertTriangle, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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

export function MediaLibrary() {
  const assets = useQuery(api.media.list, {});
  const updateAlt = useMutation(api.media.updateAlt);
  const remove = useMutation(api.media.remove);

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<Id<"mediaAssets"> | null>(
    null,
  );

  if (assets === undefined) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full" />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
        No images yet. Upload one from a content item&apos;s cover image field.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => {
          const draft = drafts[asset._id] ?? asset.alt ?? "";
          const dirty = draft !== (asset.alt ?? "");

          return (
            <div
              key={asset._id}
              className="flex flex-col overflow-hidden rounded-lg border border-border"
            >
              {asset.url ? (
                <Image
                  src={asset.url}
                  alt={asset.alt ?? asset.filename}
                  width={400}
                  height={225}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-muted text-sm text-muted-foreground">
                  Unavailable
                </div>
              )}

              <div className="flex flex-1 flex-col gap-3 p-3">
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {asset.filename}
                </p>

                {!asset.alt ? (
                  <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500">
                    <AlertTriangle className="size-3.5" />
                    Missing alt text
                  </p>
                ) : null}

                <div className="mt-auto flex gap-2">
                  <Input
                    value={draft}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [asset._id]: e.target.value }))
                    }
                    placeholder="Alt text"
                    className="h-8 text-sm"
                  />
                  <Button
                    size="icon-sm"
                    variant={dirty ? "default" : "ghost"}
                    disabled={!dirty}
                    aria-label="Save alt text"
                    onClick={async () => {
                      await updateAlt({ id: asset._id, alt: draft });
                      toast.success("Alt text saved");
                    }}
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Delete image"
                    onClick={() => setPendingDelete(asset._id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              The file is removed from storage permanently. Any content still
              referencing it will lose its cover image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!pendingDelete) return;
                try {
                  await remove({ id: pendingDelete });
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
    </>
  );
}
