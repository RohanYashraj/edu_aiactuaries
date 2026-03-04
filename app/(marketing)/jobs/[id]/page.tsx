import { ArrowLeft, Briefcase, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Job Details — SSS CoE Actuarial DS & AI",
};

const placeholderJobs: Record<
  string,
  {
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    contactEmail: string;
  }
> = {
  "1": {
    title: "Data Scientist — Actuarial Pricing",
    company: "InsureTech Corp",
    location: "Mumbai, India",
    type: "full-time",
    description:
      "Develop and deploy machine learning models for insurance pricing and risk selection. You will work closely with the actuarial team to integrate AI-driven insights into the underwriting pipeline, improving accuracy and efficiency across all lines of business.",
    requirements: [
      "Strong background in actuarial science or statistics",
      "Experience with Python, R, or similar data science tools",
      "Familiarity with machine learning frameworks (scikit-learn, XGBoost, etc.)",
      "Excellent communication and collaboration skills",
    ],
    contactEmail: "careers@insuretechcorp.example.com",
  },
  "2": {
    title: "Actuarial Analyst — AI Team",
    company: "Global Re",
    location: "Remote",
    type: "full-time",
    description:
      "Join our AI-driven actuarial team to build next-generation reserving and capital models using advanced analytics. You will contribute to research and development of novel techniques that combine traditional actuarial methods with modern data science.",
    requirements: [
      "Actuarial qualification or near-qualification",
      "Experience with reserving, pricing, or capital modelling",
      "Knowledge of statistical or machine learning methods",
      "Ability to work independently in a remote-first environment",
    ],
    contactEmail: "careers@globalre.example.com",
  },
  "3": {
    title: "ML Engineering Intern — Insurance",
    company: "DataRisk Labs",
    location: "Bangalore, India",
    type: "internship",
    description:
      "Summer internship focused on applying machine learning to claims automation and fraud detection in insurance. You will gain hands-on experience building end-to-end ML pipelines under the mentorship of senior engineers.",
    requirements: [
      "Currently pursuing a degree in CS, Statistics, or related field",
      "Basic knowledge of Python and machine learning",
      "Interest in the insurance or financial services industry",
      "Strong problem-solving skills",
    ],
    contactEmail: "internships@datarisklabs.example.com",
  },
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = placeholderJobs[id];

  if (!job) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
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
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Briefcase className="size-4" />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {job.type.replace("-", " ")}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold">Description</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {job.description}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-semibold">Requirements</h2>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {job.requirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-semibold">Apply</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Interested? Send your CV and a brief cover letter to:
            </p>
            <Button asChild>
              <a href={`mailto:${job.contactEmail}`}>
                {job.contactEmail}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
