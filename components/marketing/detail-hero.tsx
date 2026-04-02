import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type DetailHeroProps = {
  badge: string;
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
};

export function DetailHero({
  badge,
  title,
  description,
  breadcrumbs,
}: DetailHeroProps) {
  return (
    <div>
      <p className="mb-6 text-sm font-medium text-muted-foreground">
        {breadcrumbs.map((item, index) => (
          <span key={`${item.label}-${index}`}>
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
            {index < breadcrumbs.length - 1 ? (
              <span aria-hidden="true" className="mx-2">
                /
              </span>
            ) : null}
          </span>
        ))}
      </p>
      <div className="space-y-4">
        <Badge className="bg-gold/15 text-gold hover:bg-gold/20">{badge}</Badge>
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description ? <p className="text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  );
}
