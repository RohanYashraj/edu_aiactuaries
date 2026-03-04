import { Briefcase, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Jobs — SSS CoE Actuarial DS & AI",
  description:
    "Explore job opportunities in actuarial data science and AI posted by leading employers.",
};

const placeholderJobs = [
  {
    id: "1",
    title: "Data Scientist — Actuarial Pricing",
    company: "InsureTech Corp",
    location: "Mumbai, India",
    type: "full-time" as const,
    description:
      "Develop and deploy machine learning models for insurance pricing and risk selection. Strong actuarial and statistical background required.",
  },
  {
    id: "2",
    title: "Actuarial Analyst — AI Team",
    company: "Global Re",
    location: "Remote",
    type: "full-time" as const,
    description:
      "Join our AI-driven actuarial team to build next-generation reserving and capital models using advanced analytics.",
  },
  {
    id: "3",
    title: "ML Engineering Intern — Insurance",
    company: "DataRisk Labs",
    location: "Bangalore, India",
    type: "internship" as const,
    description:
      "Summer internship focused on applying machine learning to claims automation and fraud detection in insurance.",
  },
];

const typeColors: Record<string, "default" | "secondary" | "outline"> = {
  "full-time": "default",
  "part-time": "secondary",
  contract: "outline",
  internship: "secondary",
};

export default function JobsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Job Opportunities
        </h1>
        <p className="mt-3 text-muted-foreground">
          Find roles at the forefront of Actuarial Science, Data Science, and
          AI.
        </p>
      </div>

      <div className="grid gap-6">
        {placeholderJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="size-3.5" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {job.location}
                    </span>
                  </CardDescription>
                </div>
                <Badge
                  variant={typeColors[job.type]}
                  className="shrink-0 capitalize"
                >
                  {job.type.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                {job.description}
              </p>
              <Link href={`/jobs/${job.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {placeholderJobs.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No job openings at the moment. Check back soon!
        </p>
      )}
    </section>
  );
}
