"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { describeSaving, optimizeImage } from "@/lib/image-optimize";

/** Checked before optimisation; the stored file is far smaller. */
const MAX_BYTES = 20 * 1024 * 1024;

/**
 * Convex upload flow: ask for a short-lived upload URL, POST the file straight
 * to it, then register the returned storageId with its metadata so the media
 * library has a filename and alt text to show.
 */
export function CoverImageField({
  storageId,
  path,
  alt,
  existingUrl,
  onChange,
  onAltChange,
  error,
}: {
  storageId?: string;
  path?: string;
  alt?: string;
  existingUrl?: string | null;
  onChange: (next: { storageId?: string; alt?: string }) => void;
  onAltChange: (alt: string) => void;
  error?: string;
}) {
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const register = useMutation(api.media.register);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const shownUrl = previewUrl ?? existingUrl ?? path ?? null;

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Images must be under 20 MB");
      return;
    }

    setIsUploading(true);
    try {
      // Resized and re-encoded before upload, so the original never crosses
      // the network and storage holds the small version.
      const optimized = await optimizeImage(file, "cover");

      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": optimized.file.type },
        body: optimized.file,
      });
      if (!response.ok) throw new Error("Upload failed");

      const { storageId: newId } = (await response.json()) as {
        storageId: Id<"_storage">;
      };

      await register({
        storageId: newId,
        filename: optimized.file.name,
        contentType: optimized.file.type,
        size: optimized.bytes,
        width: optimized.width,
        height: optimized.height,
        alt,
      });

      setPreviewUrl(URL.createObjectURL(optimized.file));
      onChange({ storageId: newId });
      toast.success(`Image uploaded · ${describeSaving(optimized)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Label>Cover image</Label>

      {shownUrl ? (
        <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-border">
          <Image
            src={shownUrl}
            alt={alt ?? "Cover image preview"}
            width={800}
            height={420}
            className="h-auto w-full object-cover"
            unoptimized={shownUrl.startsWith("blob:")}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="absolute right-2 top-2"
            aria-label="Remove cover image"
            onClick={() => {
              setPreviewUrl(null);
              onChange({ storageId: undefined });
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
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
          {shownUrl ? "Replace image" : "Upload image"}
        </Button>
        {storageId ? (
          <span className="text-xs text-muted-foreground">
            Stored in Convex
          </span>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImageAlt">Alt text</Label>
        <Input
          id="coverImageAlt"
          value={alt ?? ""}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Describe the image for screen readers and search engines"
        />
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
