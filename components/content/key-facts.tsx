import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Globe,
  IndianRupee,
  MapPin,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * The CMS stores an icon *name* rather than a component, so this is the one
 * place that maps names to components. Unknown names fall back rather than
 * crashing a published page.
 */
const ICONS: Record<string, LucideIcon> = {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Globe,
  IndianRupee,
  MapPin,
  Users,
};

export type Fact = { icon?: string; label: string; value: string };

export function KeyFacts({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null;

  return (
    <dl className="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-8">
      {facts.map((fact, index) => {
        const Icon = (fact.icon && ICONS[fact.icon]) || CheckCircle2;
        return (
          <div key={`${fact.label}-${index}`} className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
              <Icon className="size-6 text-gold" aria-hidden="true" />
            </div>
            <div>
              <dt className="font-semibold text-foreground">{fact.label}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{fact.value}</dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}
