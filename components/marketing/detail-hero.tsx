import { Badge } from "@/components/ui/badge";
import { Breadcrumbs, type Crumb } from "@/components/seo/breadcrumbs";

type DetailHeroProps = {
  badge: string;
  title: string;
  description?: string;
  breadcrumbs: Crumb[];
};

export function DetailHero({
  badge,
  title,
  description,
  breadcrumbs,
}: DetailHeroProps) {
  return (
    <div>
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

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
