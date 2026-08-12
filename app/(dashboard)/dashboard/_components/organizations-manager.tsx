"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { NewOrganizationDialog } from "@/components/admin/organization-picker";
import { describeSaving, optimizeImage } from "@/lib/image-optimize";
import { revalidateContent } from "@/lib/revalidate";

type Organization = Doc<"organizations"> & { logoUrl: string | null };

export function OrganizationsManager() {
  const organizations = useQuery(api.organizations.list, {});
  const update = useMutation(api.organizations.update);
  const remove = useMutation(api.organizations.remove);

  const [addOpen, setAddOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Organization | null>(null);

  if (organizations === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setAddOpen(true)}>
        <Plus className="size-4" />
        Add organisation
      </Button>

      {organizations.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No organisations yet.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {organizations.map((org) => (
            <OrganizationRow
              key={org._id}
              org={org}
              onToggleFeatured={async (featured) => {
                await update({ id: org._id, featured });
                await revalidateContent(["/", "/about"]);
              }}
              onDelete={() => setPendingDelete(org)}
            />
          ))}
        </ul>
      )}

      <NewOrganizationDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={async () => {
          await revalidateContent(["/", "/about"]);
        }}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {pendingDelete?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              The logo is removed from storage permanently. If any content still
              references this organisation, the delete is refused so you can
              unlink it first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!pendingDelete) return;
                try {
                  await remove({ id: pendingDelete._id });
                  await revalidateContent(["/", "/about"]);
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

function OrganizationRow({
  org,
  onToggleFeatured,
  onDelete,
}: {
  org: Organization;
  onToggleFeatured: (featured: boolean) => Promise<void>;
  onDelete: () => void;
}) {
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const registerMedia = useMutation(api.media.register);
  const update = useMutation(api.organizations.update);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function replaceLogo(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    setIsUploading(true);
    try {
      const optimized = await optimizeImage(file, "logo");

      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": optimized.file.type },
        body: optimized.file,
      });
      if (!response.ok) throw new Error("Upload failed");

      const { storageId } = (await response.json()) as {
        storageId: Id<"_storage">;
      };

      await registerMedia({
        storageId,
        filename: optimized.file.name,
        contentType: optimized.file.type,
        size: optimized.bytes,
        width: optimized.width,
        height: optimized.height,
        alt: `${org.name} logo`,
      });

      await update({ id: org._id, logoStorageId: storageId });
      // The logo is resolved at read time, so every page using it updates.
      await revalidateContent(["/", "/about"]);
      toast.success(`Logo replaced · ${describeSaving(optimized)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <li className="flex flex-wrap items-center gap-4 px-4 py-4">
      <span className="flex h-12 w-28 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/30 p-1">
        {org.logoUrl ? (
          <Image
            src={org.logoUrl}
            alt={org.logoAlt ?? `${org.name} logo`}
            width={112}
            height={40}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-xs text-muted-foreground">No logo</span>
        )}
      </span>

      <div className="min-w-40 flex-1">
        <p className="font-medium">{org.name}</p>
        {org.website ? (
          <a
            href={org.website}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            {org.website.replace(/^https?:\/\//, "")}
          </a>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <Switch
          checked={org.featured}
          onCheckedChange={(checked) => onToggleFeatured(checked)}
        />
        Featured
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) replaceLogo(file);
          e.target.value = "";
        }}
      />
      <Button
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {org.logoUrl ? "Replace" : "Upload"}
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete ${org.name}`}
        onClick={onDelete}
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </li>
  );
}
