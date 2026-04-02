import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FeatureCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("gradient-border border-0 bg-card p-[2px]", className)}>
      <div className="rounded-[inherit] bg-card">{children}</div>
    </Card>
  );
}
