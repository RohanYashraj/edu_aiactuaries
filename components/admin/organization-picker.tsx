"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Plus, Upload } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { describeSaving, optimizeImage } from "@/lib/image-optimize";

const NONE = "__none__";

/**
 * Picks a partner from the shared organisation library, or adds a new one
 * without leaving the form.
 *
 * Logos used to be a fixed list of files in /public, so a new partner meant a
 * deploy. The library owns the logo, and content references it — replacing a
 * logo once updates every page that shows it.
 */
export function OrganizationPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (organizationId: string | undefined, name: string) => void;
}) {
  const organizations = useQuery(api.organizations.list, {});
  const [dialogOpen, setDialogOpen] = useState(false);

  const selected = organizations?.find((org) => org._id === value);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-56 flex-1 space-y-2">
          <Label>Organisation</Label>
          <Select
            value={value ?? NONE}
            onValueChange={(next) => {
              if (next === NONE) return onChange(undefined, "");
              const org = organizations?.find((o) => o._id === next);
              onChange(next, org?.name ?? "");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an organisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>None</SelectItem>
              {(organizations ?? []).map((org) => (
                <SelectItem key={org._id} value={org._id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="button" variant="outline" onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" />
          New
        </Button>
      </div>

      {selected?.logoUrl ? (
        <div className="flex items-center gap-3 rounded-md border border-border bg-secondary/30 px-3 py-2">
          <Image
            src={selected.logoUrl}
            alt={selected.logoAlt ?? `${selected.name} logo`}
            width={112}
            height={40}
            className="h-8 w-24 object-contain"
          />
          <span className="text-xs text-muted-foreground">
            Logo comes from the organisation library
          </span>
        </div>
      ) : null}

      <NewOrganizationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={(id, name) => onChange(id, name)}
      />
    </div>
  );
}

/** Create an organisation, with its logo, from inside the content editor. */
export function NewOrganizationDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: string, name: string) => void;
}) {
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const registerMedia = useMutation(api.media.register);
  const create = useMutation(api.organizations.create);
  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [website, setWebsite] = useState("");
  const [invertInDark, setInvertInDark] = useState(false);
  const [featured, setFeatured] = useState(true);
  const [logoStorageId, setLogoStorageId] = useState<Id<"_storage"> | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function reset() {
    setName("");
    setShortName("");
    setWebsite("");
    setInvertInDark(false);
    setFeatured(true);
    setLogoStorageId(undefined);
    setLogoPreview(null);
  }

  async function handleLogo(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    setIsUploading(true);
    try {
      // Logos get the smaller preset — they render in a 112x40 box.
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
        alt: `${name || "Organisation"} logo`,
      });

      setLogoStorageId(storageId);
      setLogoPreview(URL.createObjectURL(optimized.file));
      toast.success(`Logo uploaded · ${describeSaving(optimized)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleCreate() {
    if (!name.trim()) {
      toast.error("Give the organisation a name");
      return;
    }

    setIsSaving(true);
    try {
      const id = await create({
        name: name.trim(),
        shortName: shortName.trim() || undefined,
        website: website.trim() || undefined,
        logoStorageId,
        logoAlt: `${name.trim()} logo`,
        invertInDark,
        featured,
      });
      toast.success(`${name.trim()} added`);
      onCreated?.(id, name.trim());
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add an organisation</DialogTitle>
          <DialogDescription>
            Once added it can be reused on any content, and its logo appears in
            the recognition strip on the homepage.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
            <div className="space-y-2">
              <Label htmlFor="org-name">Name</Label>
              <Input
                id="org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Institute of Actuaries of India"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-short">Short name</Label>
              <Input
                id="org-short"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="IAI"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-website">Website</Label>
            <Input
              id="org-website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://actuariesindia.org"
            />
          </div>

          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex flex-wrap items-center gap-3">
              {logoPreview ? (
                <span className="flex h-12 w-28 items-center justify-center rounded-md border border-border bg-secondary/30 p-1">
                  {/* Blob preview: next/image can't optimise an object URL. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoPreview}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </span>
              ) : null}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogo(file);
                  e.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {logoStorageId ? "Replace logo" : "Upload logo"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Any size — it&apos;s resized and compressed before upload. A
              transparent PNG or SVG works best.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
            <label className="flex items-center gap-3 text-sm">
              <Switch checked={featured} onCheckedChange={setFeatured} />
              Show in the homepage recognition strip
            </label>
            <label className="flex items-center gap-3 text-sm">
              <Switch checked={invertInDark} onCheckedChange={setInvertInDark} />
              Invert the logo in dark mode
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCreate} disabled={isSaving}>
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
            Add organisation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
