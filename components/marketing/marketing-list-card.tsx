import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MarketingListCardProps = {
  title: string;
  description: string;
  badge?: ReactNode;
  footer?: ReactNode;
  delayMs?: number;
  className?: string;
  descriptionClassName?: string;
};

export function MarketingListCard({
  title,
  description,
  badge,
  footer,
  delayMs = 0,
  className,
  descriptionClassName,
}: MarketingListCardProps) {
  return (
    <Card
      className={cn("animate-fade-in-up flex flex-col", className)}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          {badge}
        </div>
        <CardDescription className={cn("leading-relaxed", descriptionClassName)}>
          {description}
        </CardDescription>
      </CardHeader>
      {footer ? <CardContent className="mt-auto">{footer}</CardContent> : null}
    </Card>
  );
}
