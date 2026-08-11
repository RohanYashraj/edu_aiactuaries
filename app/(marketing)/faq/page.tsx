import { FaqSection } from "@/components/content/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { SITE_FAQS } from "@/lib/site-faqs";

export const metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about membership, program fees, eligibility, delivery, and the professional bodies the Sri Sathya Sai Institute of Actuaries works with.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <JsonLd
        nodes={[
          faqSchema([...SITE_FAQS]),
          breadcrumbSchema([{ label: "FAQ", href: "/faq" }]),
        ]}
      />
      <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        About membership, fees, eligibility, and how our programs run. If
        something isn&apos;t covered here, each program page carries its own
        details.
      </p>
      <FaqSection faqs={[...SITE_FAQS]} title="General" className="mt-12" />
    </section>
  );
}
