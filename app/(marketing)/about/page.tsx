import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "The Sri Sathya Sai Institute of Actuaries teaches actuarial science alongside data science and AI to students across India, guided by the principle that education should be given freely.",
  path: "/about",
});

/** Logos already in /public, used here as a recognition strip. */
const BODIES = [
  { name: "Institute and Faculty of Actuaries", src: "/ifoa.svg", invert: true },
  { name: "Society of Actuaries", src: "/soa.png" },
  { name: "Casualty Actuarial Society", src: "/cas.png" },
  { name: "Institute of Actuaries of India", src: "/iai.png" },
  { name: "ACTEX Learning", src: "/actex.png" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <JsonLd nodes={[breadcrumbSchema([{ label: "About", href: "/about" }])]} />

      <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
        About the Institute
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-foreground">
        The Sri Sathya Sai Institute of Actuaries teaches actuarial science
        alongside the data science and artificial intelligence the profession
        now runs on, to students across India — and gives that education freely.
      </p>

      <div className="mt-8 space-y-6 leading-relaxed text-muted-foreground">
        <p>
          Actuarial work has always been quantitative, but the tools have
          changed faster than most curricula. Pricing, reserving, claims
          analytics and fraud detection are increasingly done with machine
          learning, and students entering the profession are expected to arrive
          fluent in both the actuarial fundamentals and the computational
          methods built on top of them. The Institute exists to close that gap.
        </p>
        <p>
          Our programs run from foundations — financial mathematics,
          probability, microeconomics, R and Excel — through to applied machine
          learning and AI for insurance. They are delivered by experienced
          faculty and practising actuaries, mostly online so students anywhere
          in India can attend.
        </p>
      </div>

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
        <p className="mt-3 leading-relaxed text-muted-foreground">
          The Institute engages with actuarial bodies in India and abroad
          through conferences, leadership meetings and academic partnerships.
          The Institute and Faculty of Actuaries (IFoA), UK is the Knowledge
          Partner for the 2026 summer course.
        </p>

        <ul className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-6">
          {BODIES.map((body) => (
            <li key={body.name}>
              <Image
                src={body.src}
                alt={body.name}
                width={140}
                height={44}
                className={
                  body.invert
                    ? "h-10 w-28 object-contain opacity-70 dark:invert"
                    : "h-10 w-28 object-contain opacity-70"
                }
              />
            </li>
          ))}
        </ul>
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
