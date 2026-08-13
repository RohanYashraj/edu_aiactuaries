"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PublicContent } from "@/convex/content";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


export function NewsClient({ items: initialItems }: { items: PublicContent[] }) {
  const liveItems = useQuery(api.content.listByTypeChronological, { type: "news" });
  const items = liveItems ?? initialItems;

  const [activeCategory, setActiveCategory] = useState("All");

  const featuredStory = items.find((item) => item.featured);
  const otherNews = featuredStory ? items.filter((item) => item !== featuredStory) : items;

  const getCategory = (item: PublicContent) => {
    if (item.details?.kind === "news" && "category" in item.details) {
      return (item.details as any).category || "Update";
    }
    return "Update";
  };

  const categories = [
    "All",
    ...Array.from(new Set(items.map(getCategory))),
  ].sort((a, b) => (a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b)));

  const filteredNews =
    activeCategory === "All"
      ? otherNews
      : otherNews.filter((item) => getCategory(item) === activeCategory);

  const getMetric = (item: PublicContent) => {
    if (item.details?.kind === "news" && "metric" in item.details) {
      return (item.details as any).metric;
    }
    return null;
  };



  const getLinkedinUrl = (item: PublicContent) => {
    return item.linkedinUrl || undefined;
  };

  return (
    <div className="w-full bg-[#fdfdfc] text-[#0A192F] min-h-screen selection:bg-[#F26A21] selection:text-white font-sans pb-24">
      {/* HEADER SECTION */}
      <header className="pt-24 pb-16 px-6 md:px-12 lg:px-24 border-b border-[#0A192F]/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#F26A21] text-xs font-bold tracking-widest uppercase mb-4">
            News / Highlights
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#0A192F] tracking-tight mb-6">
            News & Highlights
          </h1>
          <p className="text-lg md:text-xl text-[#0A192F]/70 max-w-2xl font-light">
            What we&apos;ve been building, teaching, publishing, and contributing to
            the actuarial and AI community.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
        {/* FEATURED STORY */}
        {featuredStory && (
          <section className="mb-24">
            <div className="border border-[#0A192F]/20 p-8 md:p-12 bg-white relative group overflow-hidden transition-all duration-500 hover:border-[#0A192F]/40">
              {/* Subtle accent line on top */}
              <div className="absolute top-0 left-0 w-full h-1 bg-[#F26A21] transform origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100" />

              <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                <div className="flex-1">
                  <p className="text-xs font-bold tracking-widest text-[#0A192F]/60 mb-6 uppercase">
                    Featured / {getCategory(featuredStory)}
                  </p>
                  <h2 className="text-5xl md:text-7xl font-serif text-[#0A192F] tracking-tight leading-[0.95] mb-8 uppercase">
                    {featuredStory.title}
                  </h2>

                  <div className="space-y-4 mb-10 text-lg md:text-xl text-[#0A192F]/80 font-light leading-relaxed max-w-xl">
                    <p>{featuredStory.summary}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <Link
                      href={`/news/${featuredStory.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#0A192F] hover:text-[#F26A21] transition-colors uppercase border-b border-[#0A192F]/30 pb-1 hover:border-[#F26A21] w-max"
                    >
                      Read Full Story <ArrowRight className="w-4 h-4" />
                    </Link>
                    {getLinkedinUrl(featuredStory) ? (
                      <a
                        href={getLinkedinUrl(featuredStory)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#0A192F]/60 hover:text-[#0A192F] transition-colors uppercase border-b border-transparent pb-1 w-max"
                      >
                        View on LinkedIn <ArrowUpRight className="w-4 h-4" />
                      </a>
                    ) : null}
                  </div>
                </div>

                {/* Stats Block */}
                {featuredStory.slug === "five-months-of-impact" ? (
                  <div className="lg:w-72 flex flex-col gap-8 justify-center border-t lg:border-t-0 lg:border-l border-[#0A192F]/20 pt-8 lg:pt-0 lg:pl-12">
                    <div>
                      <p className="text-4xl md:text-5xl font-serif text-[#0A192F] mb-1">18</p>
                      <p className="text-xs font-bold tracking-widest text-[#0A192F]/60 uppercase">
                        Initiatives
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl md:text-5xl font-serif text-[#0A192F] mb-1">
                        1,200+
                      </p>
                      <p className="text-xs font-bold tracking-widest text-[#0A192F]/60 uppercase">
                        Community Members
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl md:text-5xl font-serif text-[#0A192F] mb-1">
                        180+
                      </p>
                      <p className="text-xs font-bold tracking-widest text-[#0A192F]/60 uppercase">
                        Institutions
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl md:text-5xl font-serif text-[#0A192F] mb-1">
                        54+
                      </p>
                      <p className="text-xs font-bold tracking-widest text-[#0A192F]/60 uppercase">
                        Student Projects
                      </p>
                    </div>
                  </div>
                ) : (
                  getMetric(featuredStory) && (
                    <div className="lg:w-72 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-[#0A192F]/20 pt-8 lg:pt-0 lg:pl-12">
                      <p className="text-4xl md:text-5xl font-serif text-[#0A192F] mb-1">
                        {getMetric(featuredStory)}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* LATEST NEWS & FILTERING */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <h3 className="text-2xl font-serif text-[#0A192F]">Latest News</h3>

          <div className="flex flex-wrap gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-xs font-bold tracking-widest uppercase pb-1 transition-all ${
                  activeCategory === category
                    ? "text-[#F26A21] border-b-2 border-[#F26A21]"
                    : "text-[#0A192F]/50 border-b-2 border-transparent hover:text-[#0A192F]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* NEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredNews.map((item, idx) => (
            <Link href={`/news/${item.slug}`} key={item._id} className="group block">
              <article className="border border-[#0A192F]/15 bg-white p-6 md:p-8 flex flex-col justify-between hover:border-[#0A192F]/40 transition-all duration-300 relative overflow-hidden min-h-[320px] h-full">
                {/* Subtle hover background effect */}
                <div className="absolute inset-0 bg-[#F26A21]/5 transform translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />

                <div className="relative z-10 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-xs font-bold tracking-widest text-[#0A192F]/40 uppercase">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-xs font-bold tracking-widest text-[#F26A21] uppercase text-right">
                      {getCategory(item)}
                    </span>
                  </div>

                  <h4 className="text-xl md:text-2xl font-serif text-[#0A192F] mb-4 group-hover:text-[#F26A21] transition-colors leading-snug">
                    {item.title}
                  </h4>

                  {getMetric(item) && (
                    <p className="text-xs font-bold text-[#0A192F]/60 uppercase mb-4 tracking-wide border-l-2 border-[#F26A21] pl-3 py-0.5">
                      {getMetric(item)}
                    </p>
                  )}

                  <p className="text-sm text-[#0A192F]/70 leading-relaxed font-light line-clamp-3 mt-auto">
                    {item.summary}
                  </p>
                </div>

                <div className="relative z-10 mt-8 pt-4 border-t border-[#0A192F]/10 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-[#0A192F] uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read Story <ArrowRight className="w-3 h-3 text-[#F26A21]" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="py-24 text-center border border-[#0A192F]/10 bg-white">
            <p className="text-[#0A192F]/50 font-serif text-xl">
              No articles found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
