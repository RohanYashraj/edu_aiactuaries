"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { DetailHero, LoadingState, MetaIconRow } from "@/components/marketing";

export function JobDetail({ jobId }: { jobId: string }) {
  const job = useQuery(api.jobs.getById, {
    id: jobId as Id<"jobs">,
  });

  if (job === undefined) {
    return <LoadingState />;
  }

  if (job === null) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-lg font-medium">Job not found</p>
        <p className="text-sm text-muted-foreground">
          This listing may have been removed or the link is incorrect.
        </p>
        <Link href="/jobs">
          <Button variant="outline" className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back to Jobs
          </Button>
        </Link>
      </div>
    );
  }

  const hasInternshipMetadata =
    job.type === "internship" &&
    job.periodStart &&
    job.periodEnd &&
    job.applicationDeadline &&
    job.selectionCriteria &&
    job.commitmentHoursPerDay &&
    job.eligibilityCriteria &&
    job.eligibilityCriteria.length > 0;

  if (hasInternshipMetadata) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <DetailHero
          breadcrumbs={[
            { label: "Jobs", href: "/jobs" },
            { label: "Internship" },
          ]}
          badge="Applications Open"
          title={job.title}
          description={job.description}
        />

        <div className="mt-12 grid gap-6 sm:gap-8 sm:grid-cols-2">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
              <Calendar className="size-6 text-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Internship Period</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {job.periodStart} - {job.periodEnd}
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
                {job.commitmentHoursPerDay}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
              <Users className="size-6 text-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Selection Criteria</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {job.selectionCriteria}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
              <Calendar className="size-6 text-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Last Date for Application
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {job.applicationDeadline}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-display mb-6 text-2xl">Eligibility Criteria</h2>
          <ul className="space-y-4">
            {job.eligibilityCriteria?.map((item, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground">
                <CheckCircle2 className="size-5 shrink-0 text-gold" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {job.weeklySchedule && job.weeklySchedule.length > 0 && (
          <div className="mt-12 space-y-6">
            <h2 className="font-display text-2xl">8-Week Program Roadmap</h2>
            <div className="grid gap-4">
              {job.weeklySchedule.map((week) => (
                <Card key={week.week} className="flex flex-col">
                  <CardHeader>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Week {week.week}
                    </p>
                    <CardTitle className="text-lg">{week.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{week.focus}</p>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Topics:</span>{" "}
                      {week.topics.join(" | ")}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Tools:</span>{" "}
                      {week.tools.join(" | ")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-border py-6">
          <p className="mb-8 text-muted-foreground">
            Build a portfolio-ready actuarial AI project aligned with real
            industry use cases.
          </p>
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-gold text-gold-foreground shadow-sm hover:bg-gold/90"
          >
            <a
              href={job.applicationUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </article>
    );
  }

  return (
    <>
      <Link href="/jobs">
        <Button variant="ghost" size="sm" className="mb-6 gap-1.5">
          <ArrowLeft className="size-4" />
          Back to Jobs
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3">
            <Badge variant="outline" className="w-fit capitalize">
              {job.type.replace("-", " ")}
            </Badge>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <MetaIconRow
              items={[
                {
                  icon: <Briefcase className="size-4" />,
                  label: job.company,
                },
                {
                  icon: <MapPin className="size-4" />,
                  label: job.location,
                },
                {
                  icon: <Clock className="size-4" />,
                  label: job.type.replace("-", " "),
                },
              ]}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold">Description</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {job.description}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-semibold">How to Apply</h2>
            <p className="text-sm text-muted-foreground">
              Contact the employer directly for application details. Make sure
              your profile is complete and up to date.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
