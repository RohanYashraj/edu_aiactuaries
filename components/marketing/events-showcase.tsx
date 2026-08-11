import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PartnerLogo, type Partner } from "@/components/content/partner-callout";
import { contentHref, formatContentDate, type ContentType } from "@/lib/content";

export type ShowcaseItem = {
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
 * Homepage events showcase, driven by the `featured` flag in the CMS.
 *
 * Replaces a 32-second CSS marquee that auto-scrolled two hardcoded cards: it
 * moved on its own timing rather than the reader's, and nothing in it could be
 * changed without a deploy.
 *
 * The structural marker is the date, set in the mono face — events are ordered
 * in time, so the date is the true index. Invented 01/02/03 numbering would
 * encode nothing.
 */
export function EventsShowcase({
  upcoming,
  recent,
}: {
  upcoming: ShowcaseItem[];
  recent: ShowcaseItem[];
}) {
  if (upcoming.length === 0 && recent.length === 0) return null;

  return (
    <section className="border-t border-border bg-muted/40 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Upcoming — the things a reader can still act on. */}
          <div className="lg:col-span-7">
            <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              Coming up
            </h2>

            {upcoming.length === 0 ? (
              <p className="mt-6 text-muted-foreground">
                Nothing scheduled at the moment. New programs are announced here
                first.
              </p>
            ) : (
              <ul className="mt-6 space-y-8">
                {upcoming.map((item) => {
                  const date = formatContentDate(item);
                  return (
                    <li
                      key={item._id}
                      className="group border-t border-border pt-6"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        {date ? (
                          <time className="font-mono text-xs tabular-nums text-gold">
                            {date}
                          </time>
                        ) : null}
                        {item.location ? (
                          <span className="font-mono text-xs text-muted-foreground">
                            {item.location}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-2 font-display text-xl leading-snug tracking-tight sm:text-2xl">
                        <Link
                          href={contentHref(item.type, item.slug)}
                          className="transition-colors hover:text-gold"
                        >
                          {item.title}
                        </Link>
                      </h3>

                      <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">
                        {item.summary}
                      </p>

                      <Link
                        href={contentHref(item.type, item.slug)}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:text-gold hover:underline"
                      >
                        Details
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Recent — proof of activity, deliberately quieter. */}
          {recent.length > 0 ? (
            <div className="lg:col-span-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Recently
                </h2>
                <Link
                  href="/news"
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  All news
                </Link>
              </div>

              <ul className="mt-6 divide-y divide-border border-t border-border">
                {recent.map((item) => (
                  <li key={item._id} className="py-4">
                    <Link
                      href={contentHref(item.type, item.slug)}
                      className="flex items-start gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-snug transition-colors hover:text-gold">
                          {item.title}
                        </p>
                        {item.location ? (
                          <p className="mt-1 font-mono text-xs text-muted-foreground">
                            {item.location}
                          </p>
                        ) : null}
                      </div>
                      {item.partners?.[0] ? (
                        <PartnerLogo
                          partner={item.partners[0]}
                          className="h-6 shrink-0 opacity-60"
                        />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
