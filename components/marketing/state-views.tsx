import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex justify-center py-16" role="status" aria-live="polite">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading content</span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border py-16 text-center">
      <div className="mx-auto mb-3">{icon}</div>
      <p className="font-display text-lg">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
