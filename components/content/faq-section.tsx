import { ChevronDown } from "lucide-react";

export type Faq = { question: string; answer: string };

/**
 * Native <details> rather than a JS accordion: the answers are then present in
 * the raw HTML, which is what retrieval crawlers read. The same array is also
 * emitted as FAQPage JSON-LD by the caller.
 */
export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  className,
}: {
  faqs: Faq[];
  title?: string;
  className?: string;
}) {
  if (faqs.length === 0) return null;

  return (
    <section className={className} aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="font-display text-2xl tracking-tight sm:text-3xl"
      >
        {title}
      </h2>
      <div className="mt-6 divide-y divide-border border-y border-border">
        {faqs.map((faq, index) => (
          <details key={`${faq.question}-${index}`} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground marker:content-none">
              {faq.question}
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
