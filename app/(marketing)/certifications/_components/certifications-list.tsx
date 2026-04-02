"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeatureCard, LoadingState, MarketingListCard } from "@/components/marketing";

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
    return <LoadingState />;
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
        <FeatureCard className="mb-14">
          <div>
            <CardHeader className="p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-gold text-gold-foreground shadow-md shadow-gold/20">
                  <Award className="size-6" />
                </div>
                <div>
                  <Badge className="mb-1 bg-gold/15 text-gold hover:bg-gold/20">
                    Flagship Programme
                  </Badge>
                  <CardTitle className="font-display text-2xl">
                    {highlighted.title}
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="mt-4 text-base leading-relaxed">
                {highlighted.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Enrolling</Badge>
                <Button className="shadow-sm shadow-primary/15">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </div>
        </FeatureCard>
      )}

      {others.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((cert, i) => (
            <MarketingListCard
              key={cert.title}
              title={cert.title}
              description={cert.description}
              footer={
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Coming Soon</Badge>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              }
              delayMs={i * 100}
            />
          ))}
        </div>
      )}
    </>
  );
}
