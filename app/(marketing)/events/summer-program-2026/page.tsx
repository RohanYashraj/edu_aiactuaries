import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DetailHero } from "@/components/marketing";

export const metadata = {
  title: "Summer Course in Actuarial Data Science 2026 — Events — Sri Sathya Sai Institute of Actuaries",
  description:
    "Join the third edition of the Summer Course in Actuarial Data Science, organized by the Sri Sathya Sai Institute of Actuaries.",
};

export default function SummerProgram2026Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <DetailHero
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: "Summer Program 2026" },
        ]}
        badge="Registrations Open"
        title="Summer Course in Actuarial Data Science - 2026"
      />

      {/* Intro */}
      <div className="mt-8 space-y-6 leading-relaxed text-muted-foreground">
        <p>
          We are pleased to present the{" "}
          <strong className="font-semibold text-foreground">
            third edition
          </strong>{" "}
          of the Summer Course in Actuarial Data Science, organized by the{" "}
          <strong className="font-semibold text-foreground">
            Sri Sathya Sai Institute of Actuaries
          </strong>{" "}
          and powered by{" "}
          <strong className="font-semibold text-foreground">
            AI Actuaries
          </strong>
          .
        </p>
        <p>
          Over the past two editions, the program has seen strong participation,
          with many students going on to pursue actuarial science as a serious
          academic and career pathway. This continued interest reflects the
          growing relevance of actuarial skills in a data-driven world.
        </p>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-xl border border-gold/20 bg-linear-to-br from-gold/5 via-transparent to-transparent p-6 text-base text-card-foreground shadow-sm">
          <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gold/50" />
          <div className="flex-1 pl-2">
            <p>
              We are honored to have the{" "}
              <strong className="font-semibold">
                Institute and Faculty of Actuaries (IFoA), UK
              </strong>{" "}
              as our Knowledge Partner this year, supporting and promoting the
              program among students aspiring to enter the actuarial profession.
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-center gap-2 shrink-0 sm:border-l sm:border-border sm:pl-6">
            <span className="font-semibold uppercase tracking-wider text-muted-foreground">
              Knowledge Partner
            </span>
            <div className="flex h-16 w-40 items-center justify-start sm:justify-center bg-transparent p-0">
              <Image src="/ifoa.svg" alt="IFoA Logo" width={150} height={34} className="h-full w-auto object-contain dark:invert" />
            </div>
          </div>
        </div>
      </div>
      {/* Quick Info Grid */}
      <div className="mt-12 grid gap-6 sm:gap-8 sm:grid-cols-2">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
            <Calendar className="size-6 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Program Dates</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              27 April 2026 – 16 May 2026
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
            <Clock className="size-6 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Commitment</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ~2 hours/day for online sessions
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
            <Users className="size-6 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Eligibility</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Open to students from schools and colleges
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
            <GraduationCap className="size-6 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Program Fee</h3>
            <p className="mt-1 text-sm text-muted-foreground">Free of charge</p>
          </div>
        </div>
      </div>

      {/* Fee Note */}
      <div className="mt-6 rounded-lg bg-secondary/50 p-5 text-sm sm:text-base leading-relaxed text-muted-foreground">
        This program is offered{" "}
        <strong className="font-semibold text-foreground">
          free of charge
        </strong>
        , in line with the guiding principle of providing education freely,
        inspired by Bhagawan Sri Sathya Sai Baba.
      </div>

      {/* Lists */}
      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-display mb-6 text-2xl">Program Highlights</h2>
          <ul className="space-y-4">
            {[
              "Duration: 3 weeks",
              "Delivered by experienced faculty and industry practitioners",
              "Guest sessions by industry leaders on emerging trends in technology and the actuarial domain",
              "A participation and completion certificate will be awarded to students who successfully meet the program requirements",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground">
                <CheckCircle2 className="size-5 shrink-0 text-gold" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display mb-6 text-2xl">Course Coverage</h2>
          <ul className="space-y-4">
            {[
              "Financial Mathematics",
              "Probability",
              "Microeconomics",
              "R – Basics",
              "MS Excel – Basics",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-muted-foreground">
                <BookOpen className="size-5 shrink-0 text-primary/70" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Footer / CTA */}
      <div className="mt-8 border-t border-border py-6">
        <p className="mb-8 text-muted-foreground">
          We look forward to welcoming motivated students who are keen to
          explore and build a foundation in actuarial data science.
        </p>
        <Button
          asChild
          size="lg"
          className="w-full sm:w-auto bg-gold text-gold-foreground shadow-sm hover:bg-gold/90"
        >
          <a
            href="https://lnkd.in/gsewFfW7"
            target="_blank"
            rel="noopener noreferrer"
          >
            Register Now
            <ArrowRight className="ml-2 size-4" />
          </a>
        </Button>
      </div>
    </article>
  );
}
