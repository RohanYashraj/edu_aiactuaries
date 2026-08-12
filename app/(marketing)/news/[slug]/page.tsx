import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "@/lib/convex-server";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, contentSchema } from "@/lib/jsonld";
import { absoluteUrl } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { contentStaticParams } from "@/lib/content-page";
import type { ContentType } from "@/lib/content";

const ALLOWED: readonly ContentType[] = ["news"];

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  return contentStaticParams(ALLOWED);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await fetchQuery(api.content.getBySlug, { slug: resolvedParams.slug });

  if (!article) return {};

  return buildMetadata({
    title: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.summary,
    path: `/news/${article.slug}`,
  });
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = await fetchQuery(api.content.getBySlug, { slug: resolvedParams.slug });

  if (!article || article.type !== "news") {
    notFound();
  }

  const category =
    article.details?.kind === "news" && "category" in article.details
      ? (article.details as any).category || "Update"
      : "Update";

  const metric =
    article.details?.kind === "news" && "metric" in article.details
      ? (article.details as any).metric
      : null;

  const linkedinUrl =
    article.details?.kind === "news" && "linkedinUrl" in article.details
      ? (article.details as any).linkedinUrl
      : null;

  const websiteUrl =
    article.details?.kind === "news" && "websiteUrl" in article.details
      ? (article.details as any).websiteUrl
      : null;

  const websiteLabel =
    article.details?.kind === "news" && "websiteLabel" in article.details
      ? (article.details as any).websiteLabel
      : "VISIT OFFICIAL WEBSITE";

  const bodyParagraphs = article.body
    ? article.body.split(/\r?\n+|\\n+/).filter((p) => p.trim() !== "")
    : [];

  return (
    <div className="w-full bg-[#fdfdfc] text-[#0A192F] min-h-screen selection:bg-[#F26A21] selection:text-white font-sans pt-32 pb-24">
      <JsonLd
        nodes={[
          breadcrumbSchema([
            { label: "News", href: "/news" },
            { label: article.title, href: `/news/${article.slug}` },
          ]),
          contentSchema(article as any, absoluteUrl(`/news/${article.slug}`)),
        ]}
      />

      <article className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Header Block */}
        <header className="mb-12">
          <span className="text-xs font-bold tracking-widest text-[#F26A21] uppercase mb-6 block">
            News / {category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0A192F] mb-8 leading-[1.1] tracking-tight">
            {article.title}
          </h1>

          {metric && (
            <p className="text-sm font-bold tracking-widest text-[#0A192F]/80 uppercase border-l-2 border-[#F26A21] pl-4 py-1">
              {metric}
            </p>
          )}
        </header>

        <div className="w-full h-px bg-[#0A192F]/10 my-12" />

        {/* Content Block */}
        <div className="prose prose-lg md:prose-xl prose-slate max-w-none prose-p:font-light prose-p:text-[#0A192F]/80 prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-[#0A192F] prose-li:font-light prose-li:text-[#0A192F]/80">
          {bodyParagraphs.length > 0 ? (
            bodyParagraphs.map((paragraph, idx) => (
              <p key={idx} className="mb-6">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="mb-6 text-xl">{article.summary}</p>
          )}

          {!article.featured && bodyParagraphs.length === 0 && (
            <div className="mt-16 p-8 border border-[#0A192F]/10 bg-white italic text-[#0A192F]/60 text-center font-serif">
              Detailed event report and media gallery will be published shortly.
            </div>
          )}
        </div>

        <div className="w-full h-px bg-[#0A192F]/10 my-16" />

        {/* Source Footer */}
        <footer className="flex flex-col gap-6">
          <span className="text-xs font-bold tracking-widest text-[#0A192F]/50 uppercase block">
            Source
          </span>

          <div className="flex flex-col sm:flex-row gap-4">
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 text-xs font-bold tracking-widest text-white bg-[#F26A21] hover:bg-[#0A192F] px-8 py-5 transition-colors uppercase w-full sm:w-auto text-center"
              >
                {websiteLabel} <ArrowUpRight className="w-4 h-4" />
              </a>
            )}

            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-3 text-xs font-bold tracking-widest px-8 py-5 transition-colors uppercase w-full sm:w-auto text-center ${
                  websiteUrl 
                    ? "text-[#0A192F] bg-transparent border border-[#0A192F]/20 hover:border-[#0A192F]/50" 
                    : "text-white bg-[#0A192F] hover:bg-[#F26A21]"
                }`}
              >
                View Original LinkedIn Post <ArrowUpRight className="w-4 h-4" />
              </a>
            )}

            {!websiteUrl && !linkedinUrl && (
              <p className="text-sm text-[#0A192F]/60 font-serif italic">
                Internal SSSIA Publication
              </p>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
}
