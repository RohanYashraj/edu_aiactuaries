import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, FeatureCard, SectionHeader } from "@/components/marketing";
import { ContentCard } from "@/components/content/content-card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { fetchQuery } from "@/lib/convex-server";
import { contentHref } from "@/lib/content";

export const metadata = buildMetadata({
  title: "Certifications",
  description:
    "Explore our professional certifications in Actuarial Data Science and AI, featuring the flagship AI Actuaries Certification.",
  path: "/certifications",
});

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

export default async function CertificationsPage() {
  const certifications = await fetchQuery(api.content.listByType, {
    type: "certification",
  });

  const flagship = certifications.find((c) => c.featured);
  const rest = certifications.filter((c) => c !== flagship);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <JsonLd
        nodes={[
          breadcrumbSchema([{ label: "Certifications", href: "/certifications" }]),
        ]}
      />
      <SectionHeader
        as="h1"
        title="Certifications"
        description="Professional certifications designed to bridge Actuarial Science, Data Science, and Artificial Intelligence."
      />

      {certifications.length === 0 ? (
        <EmptyState
          title="No certifications published"
          description="Our certification programs will be listed here shortly."
        />
      ) : (
        <>
          {flagship ? (
            <FeatureCard className="mb-10">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Award className="size-5 text-gold" aria-hidden="true" />
                    <Badge className="bg-gold/15 text-gold hover:bg-gold/20">
                      Flagship Programme
                    </Badge>
                  </div>
                </div>
                <CardTitle className="font-display text-2xl">
                  <Link
                    href={contentHref("certification", flagship.slug)}
                    className="hover:text-gold"
                  >
                    {flagship.title}
                  </Link>
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {flagship.summary}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="gap-2">
                  <Link href={contentHref("certification", flagship.slug)}>
                    Learn More
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </FeatureCard>
          ) : null}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, index) => (
              <ContentCard key={item._id} item={item} delayMs={index * 100} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
