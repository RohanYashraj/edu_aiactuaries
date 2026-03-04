"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Award, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fallbackCertifications = [
  {
    title: "AI Actuaries Certification",
    description:
      "Our flagship programme blending actuarial science with cutting-edge AI and machine learning. Designed for professionals who want to lead the transformation of the insurance and risk industry.",
    highlight: true,
    order: 0,
  },
  {
    title: "Data Science for Actuaries",
    description:
      "Build a strong foundation in data science techniques tailored for actuarial applications — from statistical modelling to predictive analytics.",
    highlight: false,
    order: 1,
  },
  {
    title: "Advanced Risk Analytics",
    description:
      "Deep-dive into modern risk quantification methods, stochastic modelling, and scenario analysis powered by computational techniques.",
    highlight: false,
    order: 2,
  },
  {
    title: "Machine Learning in Insurance",
    description:
      "Practical applications of machine learning in pricing, reserving, fraud detection, and customer analytics for the insurance sector.",
    highlight: false,
    order: 3,
  },
];

export function CertificationsList() {
  const convexData = useQuery(api.certifications.list);

  if (convexData === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const certifications =
    convexData.length > 0
      ? convexData.map((c) => ({
          title: c.title,
          description: c.description,
          highlight: c.highlight,
          order: c.order,
          slug: c.slug,
        }))
      : fallbackCertifications;

  const highlighted = certifications.find((c) => c.highlight);
  const others = certifications.filter((c) => !c.highlight);

  return (
    <>
      {highlighted && (
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
                <CardTitle className="text-2xl">{highlighted.title}</CardTitle>
              </div>
            </div>
            <CardDescription className="mt-3 text-base">
              {highlighted.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Enrolling</Badge>
              <Button>Learn More</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {others.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((cert) => (
            <Card key={cert.title} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{cert.title}</CardTitle>
                <CardDescription>{cert.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Coming Soon</Badge>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
