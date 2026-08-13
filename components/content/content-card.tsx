import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PartnerLogo, type Partner } from "@/components/content/partner-callout";
import {
  CONTENT_TYPE_LABELS,
  contentHref,
  formatContentDate,
  type ContentType,
} from "@/lib/content";
import { cn } from "@/lib/utils";

export type ContentCardItem = {
  _id: string;
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  badge?: string;
  dateLabel?: string;
  startDate?: number;
  endDate?: number;
  location?: string;
  partners?: Partner[];
};

/**
 * One card for every content type. Standardising this is the point of the
 * unified table: events, workshops, certifications and news all highlight the
 * same way, so a new type never needs a bespoke card.
 */
export function ContentCard({
  item,
  delayMs = 0,
  className,
}: {
  item: ContentCardItem;
  delayMs?: number;
  className?: string;
}) {
  const href = contentHref(item.type, item.slug);
  const date = formatContentDate(item);
  const partner = item.partners?.[0];

  return (
    <Card
      className={cn("animate-fade-in-up flex flex-col", className)}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <CardHeader>
        {/* Listings mix types (events + workshops, programs + internships), so
            the card itself says what kind of thing it links to. */}
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gold">
          {CONTENT_TYPE_LABELS[item.type]}
        </span>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-snug">
            <Link href={href} className="hover:text-gold">
              {item.title}
            </Link>
          </CardTitle>
          {item.badge ? (
            <Badge className="shrink-0 bg-gold/15 text-gold hover:bg-gold/20">
              {item.badge}
            </Badge>
          ) : null}
        </div>

        {date || item.location ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {date ? (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" aria-hidden="true" />
                {date}
              </span>
            ) : null}
            {item.location ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden="true" />
                {item.location}
              </span>
            ) : null}
          </div>
        ) : null}

        <CardDescription className="leading-relaxed">
          {item.summary}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto flex items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5">
          <Link href={href}>
            Details
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
        {partner ? (
          <PartnerLogo partner={partner} className="h-6 opacity-70" />
        ) : null}
      </CardContent>
    </Card>
  );
}
