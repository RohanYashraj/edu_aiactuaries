import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

import type { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailHero } from "@/components/marketing";
import { Markdown } from "@/components/content/markdown";
import { KeyFacts } from "@/components/content/key-facts";
import { FaqSection } from "@/components/content/faq-section";
import {
  PartnerCallout,
  type Partner,
} from "@/components/content/partner-callout";
import { RegisterActions } from "@/components/content/register-actions";
import {
  CONTENT_ROUTES,
  contentSectionLabel,
  deliveryModeLabel,
  formatContentDate,
  lifecycleLabel,
} from "@/lib/content";

export type ContentDetailDoc = Doc<"content"> & {
  coverImageUrl?: string | null;
  partners?: Partner[];
};

/** Bulleted list with an icon marker — the recurring "highlights" shape. */
function IconList({
  title,
  items,
  variant = "gold",
}: {
  title: string;
  items: string[];
  variant?: "gold" | "primary";
}) {
  if (items.length === 0) return null;
  const Icon = variant === "gold" ? CheckCircle2 : BookOpen;

  return (
    <div>
      <h2 className="font-display mb-6 text-2xl tracking-tight">{title}</h2>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3 text-muted-foreground">
            <Icon
              className={
                variant === "gold"
                  ? "size-5 shrink-0 text-gold"
                  : "size-5 shrink-0 text-primary/70"
              }
              aria-hidden="true"
            />
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Renders any content document. Every type flows through this one component,
 * which is what keeps a new event looking like every other event without
 * anyone hand-building a page.
 */
export function ContentDetail({
  doc,
  signedIn,
}: {
  doc: ContentDetailDoc;
  signedIn: boolean;
}) {
  const sectionLabel = contentSectionLabel(doc.type);
  const sectionHref = CONTENT_ROUTES[doc.type];
  const date = formatContentDate(doc);
  const details = doc.details;

  // Suppress the mode badge when the location already says the same thing —
  // an "Online" event in an "Online" location rendered "Online Online".
  const rawModeLabel = "mode" in details ? deliveryModeLabel(details.mode) : null;
  const modeLabel =
    rawModeLabel &&
    doc.location?.toLowerCase().includes(rawModeLabel.toLowerCase())
      ? null
      : rawModeLabel;

  // Events, programmes and workshops can be registered for in-app;
  // certifications and news keep plain call-to-action links.
  const isRegistrable =
    doc.type === "event" || doc.type === "program" || doc.type === "workshop" || doc.type === "internship";
  const registrationUrl =
    "registrationUrl" in details ? details.registrationUrl : undefined;

  const knowledgePartner = doc.partners?.find((p) => p.role);
  const primaryCta = doc.ctas?.find((cta) => cta.variant !== "secondary");
  const secondaryCtas = doc.ctas?.filter((cta) => cta !== primaryCta) ?? [];

  // Per-type list blocks, normalised to a common shape up front so the JSX
  // below doesn't branch five ways.
  const lists: { title: string; items: string[]; variant?: "gold" | "primary" }[] =
    [];
  if (details.kind === "program") {
    if (details.highlights?.length)
      lists.push({ title: "Program Highlights", items: details.highlights });
    if (details.coverage?.length)
      lists.push({
        title: "Course Coverage",
        items: details.coverage,
        variant: "primary",
      });
    if (details.eligibility?.length)
      lists.push({ title: "Eligibility", items: details.eligibility });
  }
  if (details.kind === "workshop" || details.kind === "certification") {
    if (details.learningOutcomes?.length)
      lists.push({ title: "What you'll learn", items: details.learningOutcomes });
    if (details.prerequisites?.length)
      lists.push({
        title: "Prerequisites",
        items: details.prerequisites,
        variant: "primary",
      });
  }

  const statusBadge =
    doc.badge ??
    ("lifecycle" in details
      ? lifecycleLabel(details.lifecycle)
      : details.kind === "certification"
        ? details.enrollmentStatus === "open"
          ? "Enrolment Open"
          : details.enrollmentStatus === "coming_soon"
            ? "Coming Soon"
            : "Enrolment Closed"
        : sectionLabel);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <DetailHero
        breadcrumbs={[
          { label: sectionLabel, href: sectionHref },
          { label: doc.title },
        ]}
        badge={statusBadge}
        title={doc.title}
      />

      {/*
        Answer-first summary. Present on every document and rendered before
        anything else, so both readers and retrieval crawlers get the
        definition in the first paragraph.
      */}
      <p className="mt-8 text-lg leading-relaxed text-foreground">
        {doc.summary}
      </p>

      {doc.subtitle ? (
        <p className="mt-3 text-muted-foreground">{doc.subtitle}</p>
      ) : null}

      {(date || doc.location || modeLabel) && (
        <div className="mt-6 flex flex-wrap gap-2">
          {date ? <Badge variant="secondary">{date}</Badge> : null}
          {doc.location ? (
            <Badge variant="secondary">{doc.location}</Badge>
          ) : null}
          {modeLabel ? <Badge variant="outline">{modeLabel}</Badge> : null}
        </div>
      )}

      {doc.coverImageUrl ? (
        <Image
          src={doc.coverImageUrl}
          alt={doc.coverImageAlt ?? doc.title}
          width={1200}
          height={630}
          className="mt-8 w-full rounded-xl border border-border object-cover"
          priority
        />
      ) : null}

      {knowledgePartner ? (
        <div className="mt-8">
          <PartnerCallout partner={knowledgePartner} />
        </div>
      ) : null}

      {doc.body ? <Markdown className="mt-8">{doc.body}</Markdown> : null}

      {doc.facts?.length ? <KeyFacts facts={doc.facts} /> : null}

      {lists.length > 0 ? (
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {lists.map((list) => (
            <IconList key={list.title} {...list} />
          ))}
        </div>
      ) : null}

      {details.kind === "program" && details.weeklySchedule?.length ? (
        <section className="mt-12">
          <h2 className="font-display mb-6 text-2xl tracking-tight">
            Week by week
          </h2>
          <ol className="space-y-6">
            {details.weeklySchedule.map((week) => (
              <li
                key={week.week}
                className="rounded-xl border border-border p-5"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-gold">
                  Week {week.week}
                </p>
                <h3 className="mt-1 font-semibold text-foreground">
                  {week.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{week.focus}</p>
                {week.topics.length > 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Topics: </span>
                    {week.topics.join(", ")}
                  </p>
                ) : null}
                {week.tools.length > 0 ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Tools: </span>
                    {week.tools.join(", ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {details.kind === "event" && details.agenda?.length ? (
        <section className="mt-12">
          <h2 className="font-display mb-6 text-2xl tracking-tight">Agenda</h2>
          <ol className="space-y-4">
            {details.agenda.map((slot, index) => (
              <li key={index} className="flex gap-4 border-b border-border pb-4">
                <span className="w-24 shrink-0 text-sm font-medium text-gold">
                  {slot.label}
                </span>
                <div>
                  <p className="font-medium text-foreground">{slot.title}</p>
                  {slot.speaker ? (
                    <p className="text-sm text-muted-foreground">
                      {slot.speaker}
                    </p>
                  ) : null}
                  {slot.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {slot.description}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {details.kind === "certification" && details.modules?.length ? (
        <section className="mt-12">
          <h2 className="font-display mb-6 text-2xl tracking-tight">Modules</h2>
          <ol className="space-y-4">
            {details.modules.map((module, index) => (
              <li key={index} className="rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground">{module.title}</h3>
                {module.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {module.description}
                  </p>
                ) : null}
                {module.topics?.length ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {module.topics.join(" · ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {doc.faqs?.length ? (
        <FaqSection faqs={doc.faqs} className="mt-16" />
      ) : null}

      {isRegistrable ? (
        <div className="mt-12 border-t border-border pt-8">
          <RegisterActions
            contentId={doc._id}
            externalUrl={registrationUrl}
            externalLabel={primaryCta?.label ?? "Register externally"}
            signedIn={signedIn}
          />
          {secondaryCtas.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {secondaryCtas.map((cta) => (
                <Button key={cta.href} asChild variant="outline" size="lg">
                  <a
                    href={cta.href}
                    {...(cta.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {cta.label}
                  </a>
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      ) : primaryCta || secondaryCtas.length > 0 ? (
        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8">
          {primaryCta ? (
            <Button
              asChild
              size="lg"
              className="bg-gold text-gold-foreground shadow-sm hover:bg-gold/90"
            >
              <a
                href={primaryCta.href}
                {...(primaryCta.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {primaryCta.label}
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          ) : null}
          {secondaryCtas.map((cta) => (
            <Button key={cta.href} asChild variant="outline" size="lg">
              <a
                href={cta.href}
                {...(cta.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {cta.label}
              </a>
            </Button>
          ))}
        </div>
      ) : null}

      {(doc.websiteUrl || doc.linkedinUrl) && (
        <div className="mt-16 border-t border-border pt-12">
          <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase block mb-6">
            Source
          </span>
          <div className="flex flex-col sm:flex-row gap-4">
            {doc.websiteUrl && (
              <a
                href={doc.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 text-xs font-bold tracking-widest text-white bg-[#F26A21] hover:bg-[#0A192F] px-8 py-5 transition-colors uppercase w-full sm:w-auto text-center"
              >
                {doc.websiteLabel || "VISIT OFFICIAL WEBSITE"} <ArrowRight className="w-4 h-4 -rotate-45" />
              </a>
            )}
            {doc.linkedinUrl && (
              <a
                href={doc.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-3 text-xs font-bold tracking-widest px-8 py-5 transition-colors uppercase w-full sm:w-auto text-center ${
                  doc.websiteUrl 
                    ? "text-[#0A192F] bg-transparent border border-[#0A192F]/20 hover:border-[#0A192F]/50" 
                    : "text-white bg-[#0A192F] hover:bg-[#F26A21]"
                }`}
              >
                View Original LinkedIn Post <ArrowRight className="w-4 h-4 -rotate-45" />
              </a>
            )}
          </div>
        </div>
      )}

      <p className="mt-10 text-sm text-muted-foreground">
        <Link href={sectionHref} className="hover:text-foreground">
          ← All {sectionLabel.toLowerCase()}
        </Link>
      </p>
    </article>
  );
}
