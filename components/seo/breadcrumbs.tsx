import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/**
 * Visible breadcrumbs and their BreadcrumbList structured data, from one list.
 *
 * Previously the trail was rendered by DetailHero while the schema was built
 * separately at each call site, so the two could disagree about a page's
 * position. Passing one array to both removes that possibility.
 */
export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <>
      <JsonLd nodes={[breadcrumbSchema(items)]} />
      <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="text-foreground"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
