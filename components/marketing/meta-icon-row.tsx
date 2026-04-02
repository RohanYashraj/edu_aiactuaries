import type { ReactNode } from "react";

type MetaIconItem = {
  icon: ReactNode;
  label: string;
};

export function MetaIconRow({ items }: { items: MetaIconItem[] }) {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {item.icon}
          {item.label}
        </span>
      ))}
    </div>
  );
}
