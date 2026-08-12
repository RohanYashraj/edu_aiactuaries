import type { Doc } from "@/convex/_generated/dataModel";

export type ContentStatus = Doc<"content">["status"];

/** Shared so the badge for a given status looks the same everywhere in admin. */
export const STATUS_VARIANTS: Record<
  ContentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  published: "default",
  draft: "secondary",
  scheduled: "outline",
  archived: "destructive",
};
