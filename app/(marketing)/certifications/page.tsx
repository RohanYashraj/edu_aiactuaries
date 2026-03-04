import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Certifications — SSS CoE Actuarial DS & AI",
  description:
    "Explore our professional certifications in Actuarial Data Science and AI, featuring the flagship AI Actuaries Certification.",
};

const certifications = [
  {
    title: "AI Actuaries Certification",
    description:
      "Our flagship programme blending actuarial science with cutting-edge AI and machine learning. Designed for professionals who want to lead the transformation of the insurance and risk industry.",
    highlight: true,
    status: "Enrolling",
  },
  {
    title: "Data Science for Actuaries",
    description:
      "Build a strong foundation in data science techniques tailored for actuarial applications — from statistical modelling to predictive analytics.",
    highlight: false,
    status: "Coming Soon",
  },
  {
    title: "Advanced Risk Analytics",
    description:
      "Deep-dive into modern risk quantification methods, stochastic modelling, and scenario analysis powered by computational techniques.",
    highlight: false,
    status: "Coming Soon",
  },
  {
    title: "Machine Learning in Insurance",
    description:
      "Practical applications of machine learning in pricing, reserving, fraud detection, and customer analytics for the insurance sector.",
    highlight: false,
    status: "Coming Soon",
  },
];

export default function CertificationsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Certifications
        </h1>
        <p className="mt-3 text-muted-foreground">
          Professional certifications designed to bridge Actuarial Science, Data
          Science, and Artificial Intelligence.
        </p>
      </div>

      {/* AI Actuaries highlight card */}
      <Card className="mb-12 border-2 border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Award className="size-5" />
            </div>
            <div>
              <Badge variant="default" className="mb-1">
                Flagship Programme
              </Badge>
              <CardTitle className="text-2xl">
                {certifications[0].title}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="mt-3 text-base">
            {certifications[0].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{certifications[0].status}</Badge>
            <Button>Learn More</Button>
          </div>
        </CardContent>
      </Card>

      {/* Other certifications grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.slice(1).map((cert) => (
          <Card key={cert.title} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{cert.title}</CardTitle>
              <CardDescription>{cert.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{cert.status}</Badge>
                <Button variant="ghost" size="sm">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
