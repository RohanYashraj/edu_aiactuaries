import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { fetchQuery } from "@/lib/convex-server";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "The Sri Sathya Sai Institute of Actuaries teaches actuarial science alongside data science and AI to students across India, guided by the principle that education should be given freely.",
  path: "/about",
});

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

const partnerships = [
  {
    name: "Institute of Actuaries of India (IAI)",
    description:
      "Seminars, conferences, webinars, educational materials, climate-risk initiatives, and the Indian Actuaries Climate Index.",
  },
  {
    name: "Institute and Faculty of Actuaries (IFoA, UK)",
    description:
      "Industry workshops on Agentic AI for Actuaries, actuarial summer programs, and outreach initiatives with universities and educational institutions.",
  },
  {
    name: "Casualty Actuarial Society (CAS, International)",
    description:
      "Agentic AI funded research projects, global actuarial case studies, and workshops at the CAS Teaching Summit.",
  },
  {
    name: "ACTEX (USA)",
    description:
      "Actuarial book publications, development of educational materials, Agentic AI workshops, and Faculty Development Programs.",
  },
];

export default async function AboutPage() {
  const organizations = await fetchQuery(api.organizations.listFeatured, {});

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <JsonLd nodes={[breadcrumbSchema([{ label: "About", href: "/about" }])]} />

      <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
        About the Institute
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-foreground">
        Sri Sathya Sai Institute of Actuaries (SSSIA) is a non-profit Institution involved in actuarial education, research
        and professional-development initiative. It prepares emerging actuarial professionals through the integration of
        actuarial science, data science, artificial intelligence, research and applied learning.
      </p>

      <section className="mt-12 rounded-xl border border-gold/20 bg-linear-to-br from-gold/5 via-transparent to-transparent p-6">
        <h2 className="font-display text-xl tracking-tight">
          Education, given freely
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          The Summer Course in Actuarial Data Science is offered entirely free of
          charge, in line with the guiding principle of providing education
          freely, inspired by Bhagawan Sri Sathya Sai Baba. It is the principle
          the Institute is built around, not a promotion.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">
          Working with the profession
        </h2>

        <div className="mt-4 space-y-3">
          {partnerships.map((partner) => (
            <p key={partner.name} className="leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground">
                {partner.name}:
              </strong>{" "}
              {partner.description}
            </p>
          ))}
        </div>

        {organizations.length > 0 && (
          <ul className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-6">
            {organizations.map((org) =>
              org.logoUrl ? (
                <li key={org._id}>
                  <Image
                    src={org.logoUrl}
                    alt={org.logoAlt ?? org.name}
                    width={140}
                    height={44}
                    className={
                      org.invertInDark
                        ? "h-10 w-28 object-contain opacity-70 dark:invert"
                        : "h-10 w-28 object-contain opacity-70"
                    }
                  />
                </li>
              ) : null,
            )}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">Our board</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          The Institute is powered by AI Actuaries. Board members and their
          backgrounds are listed on the AI Actuaries site.
        </p>
        <a
          href="https://aiactuaries.org/our-board"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-4 inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:text-gold hover:underline"
        >
          View the board
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </section>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-2xl tracking-tight">
          Join the Institute
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Membership is free and takes about a minute.
        </p>
        <Button asChild size="lg" className="mt-6 gap-2">
          <Link href="/sign-up">
            Become a member
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
