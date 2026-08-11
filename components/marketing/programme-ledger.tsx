import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PartnerLogo, type Partner } from "@/components/content/partner-callout";
import { contentHref, formatContentDate, type ContentType } from "@/lib/content";

export type LedgerProgramme = {
  type: ContentType;
  slug: string;
  title: string;
  badge?: string;
  dateLabel?: string;
  startDate?: number;
  endDate?: number;
  location?: string;
  facts?: { label: string; value: string }[];
  ctas?: { label: string; href: string; variant?: "primary" | "secondary" }[];
  partners?: Partner[];
};

/**
 * The hero's signature element: the next programme rendered as a ledger.
 *
 * A table of figures under hairline rules is the actuarial profession's own
 * artifact, so the form is borrowed rather than invented — and it earns its
 * place by carrying the facts a prospective student actually decides on
 * (dates, commitment, fee) instead of decorating the headline.
 *
 * This is also the only place Geist Mono appears at size; it was loaded in the
 * root layout but never used.
 */
export function ProgrammeLedger({
  programme,
}: {
  programme: LedgerProgramme;
}) {
  const href = contentHref(programme.type, programme.slug);
  const date = formatContentDate(programme);
  const cta = programme.ctas?.find((c) => c.variant !== "secondary");
  const partner = programme.partners?.find((p) => p.role);

  // The ledger reads best at four rows; drop the rest rather than let it sprawl.
  const rows = [
    ...(date ? [{ label: "Dates", value: date }] : []),
    ...(programme.facts ?? [])
      .filter((fact) => !/date/i.test(fact.label))
      .map((fact) => ({ label: fact.label, value: fact.value })),
  ].slice(0, 4);

  return (
    <aside className="relative rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          Next programme
        </p>
        {programme.badge ? (
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-gold">
            {programme.badge}
          </span>
        ) : null}
      </div>

      <h2 className="mt-4 font-display text-2xl leading-tight tracking-tight">
        <Link href={href} className="hover:text-gold">
          {programme.title}
        </Link>
      </h2>

      {rows.length > 0 ? (
        <dl className="mt-6 border-t border-border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-4 border-b border-border py-2.5"
            >
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                {row.label}
              </dt>
              <dd className="text-right font-mono text-sm tabular-nums text-foreground">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-4">
        {cta ? (
          <a
            href={cta.href}
            {...(cta.href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="group inline-flex items-center gap-1.5 border-b-2 border-gold pb-0.5 font-medium text-foreground transition-colors hover:text-gold"
          >
            {cta.label}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        ) : null}
        <Link
          href={href}
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Full details
        </Link>
      </div>

      {partner ? (
        <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
            {partner.role}
          </span>
          <PartnerLogo partner={partner} className="h-7" />
        </div>
      ) : null}
    </aside>
  );
}
