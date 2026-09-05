"use client";

import { useRef } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { animateHeroEntrance } from "@/lib/animations/hero";
import { animateScrollReveal } from "@/lib/animations/scrollReveal";
import { animateCounters } from "@/lib/animations/counters";
import { ScrambleStory } from "./scramble-story";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PublicationStack } from "./publication-stack";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { contentHref } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HomeClientProps {
  news: any[];
  settings?: any;
  carouselItems?: any[];
}

export function HomeClient({ news: initialNews, settings: initialSettings, carouselItems: initialCarouselItems }: HomeClientProps) {
  // Resolved client-side because the page is statically generated and the
  // server cannot know the visitor. Undefined while Clerk loads, which renders
  // the signed-out hero — the same thing the static HTML shows.
  const { isSignedIn } = useAuth();
  const liveNews = useQuery(api.content.listByTypeChronological, { type: "news", limit: 5 });
  const news = liveNews ?? initialNews;

  const liveSettings = useQuery(api.settings.get);
  const settings = liveSettings ?? initialSettings;

  // We fetch programs, events, and internships for the carousel.
  // Convex doesn't have an "or" query for listByType, so we rely on the pre-fetched items from page.tsx for SSR
  // and we can optionally fetch them on the client, or just use the passed items.
  const carouselItems = initialCarouselItems ?? [];

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Hero Entrance
    animateHeroEntrance(containerRef.current!, {
      badge: ".hero-badge",
      titleLines: ".hero-title-line",
      subtitle: ".hero-subtitle",
      buttons: ".hero-btn",
      booksLabel: ".hero-books-label",
      books: ".hero-book, .hero-book-mobile-titles",
    });

    // 2. Statistics Counters
    const counters = gsap.utils.toArray(".stat-counter") as Element[];
    if (counters.length > 0) animateCounters(counters);

    // 3. Scroll Reveals
    const revealElements = gsap.utils.toArray(".scroll-reveal") as Element[];
    revealElements.forEach((el) => {
      animateScrollReveal(el);
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#FCFCFA] text-[#0A192F] font-sans selection:bg-[#F26A21] selection:text-white">
      {/* ================= HERO SECTION ================= */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 py-24 sm:py-32 overflow-hidden border-b border-[#0A192F]/10">
        {/* Subtle Technical Grid */}
        <div className="absolute inset-0 hero-grid-bg opacity-40 mix-blend-multiply pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center lg:items-end gap-16 lg:gap-12">
          
          <div className="w-full lg:w-[55%]">
            <div className="hero-badge inline-flex items-center gap-2 mb-8 text-xs font-bold tracking-widest uppercase text-[#F26A21]">
              <span className="w-2 h-2 bg-[#F26A21] rounded-full" />
              Powered by aiactuaries.org
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[85px] leading-[0.95] tracking-tight uppercase text-[#0A192F]">
              <div className="overflow-hidden pb-2"><div className="hero-title-line">Sri Sathya Sai</div></div>
              <div className="overflow-hidden pb-2"><div className="hero-title-line">Institute of</div></div>
              <div className="overflow-hidden pb-2"><div className="hero-title-line">Actuaries</div></div>
            </h1>

            <p className="hero-subtitle mt-8 max-w-xl lg:text-[20px] md:text-xl font-light leading-relaxed text-[#F26A21]">
              Building the next generation of actuarial professionals through data science, AI, research and applied learning.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-6">
              {isSignedIn ? (
                <Button asChild size="lg" className="hero-btn group bg-[#0A192F] text-white hover:bg-[#F26A21] rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold transition-colors">
                  <Link href="/programs">
                    Explore Programs
                    <ArrowRight className="ml-3 size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="hero-btn group bg-[#0A192F] text-white hover:bg-[#F26A21] rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold transition-colors">
                    <Link href="/sign-up">
                      Become a Member
                      <ArrowRight className="ml-3 size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="hero-btn group border-[#0A192F]/20 text-[#0A192F] hover:bg-[#0A192F]/5 rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold transition-colors">
                    <Link href="/programs">
                      Explore Programs
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[45%] flex justify-end lg:-translate-y-16">
            <PublicationStack />
          </div>
        </div>
      </section>


      {/* ================= PROGRAMS SECTION ================= */}
      <section className="py-16 md:py-32 overflow-hidden border-t border-[#0A192F]/10">
        <div className="scroll-reveal mb-8 md:mb-12 px-6 md:px-12 max-w-7xl mx-auto flex items-end justify-between">
          <h2 className="font-display text-4xl md:text-6xl text-[#0A192F] uppercase tracking-tight">Our Programs</h2>
        </div>

        {carouselItems.length === 0 ? (
          <div className="px-6 md:px-12 max-w-7xl mx-auto text-[#0A192F]/60">
            No programs, events, or internships are currently published.
          </div>
        ) : (
          <div className="px-6 md:px-12 max-w-7xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full relative"
            >
              <CarouselContent className="-ml-4">
                {carouselItems.map((item, i) => (
                  <CarouselItem key={`${item._id}-${i}`} className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                    <Link 
                      href={contentHref(item.type, item.slug)} 
                      className="group flex flex-col justify-between p-6 md:p-8 border border-[#0A192F]/10 hover:border-[#F26A21] hover:bg-white transition-colors h-[200px] md:h-[250px] w-full"
                    >
                      <div>
                        <div className="text-[10px] md:text-xs font-bold text-[#F26A21] tracking-widest mb-3 md:mb-4 uppercase">0{i + 1}</div>
                        <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-[#0A192F] uppercase leading-tight line-clamp-3">{item.title}</h3>
                      </div>
                      <div className="flex items-center justify-between mt-4 md:mt-6">
                        <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#0A192F]/50 uppercase">{item.type}</span>
                        <ArrowRight className="size-4 md:size-5 text-[#0A192F]/30 group-hover:text-[#F26A21] transition-colors" />
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-start md:justify-end gap-3 mt-8">
                <CarouselPrevious className="static transform-none h-12 w-12 rounded-none border-[#0A192F]/20 hover:bg-[#F26A21] hover:text-white hover:border-[#F26A21]" />
                <CarouselNext className="static transform-none h-12 w-12 rounded-none border-[#0A192F]/20 hover:bg-[#F26A21] hover:text-white hover:border-[#F26A21]" />
              </div>
            </Carousel>
          </div>
        )}
      </section>

      <ScrambleStory />


      {/* ================= NEWS PREVIEW ================= */}
      <section className="py-16 md:py-32 px-6 md:px-12 border-t border-[#0A192F]/10">
        <div className="max-w-5xl mx-auto">
          <div className="scroll-reveal flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#F26A21] uppercase mb-4 block">Latest / News</span>
              <h2 className="font-display text-4xl md:text-6xl text-[#0A192F] uppercase tracking-tight">Updates</h2>
            </div>
            <Link href="/news" className="group inline-flex items-center gap-3 text-xs font-bold tracking-widest text-[#0A192F] uppercase hover:text-[#F26A21] transition-colors border-b border-[#0A192F]/20 pb-2 hover:border-[#F26A21]">
              View All News <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex flex-col">
            {news.map((item, idx) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="scroll-reveal group flex flex-row items-center justify-between border-b border-[#0A192F]/10 py-6 md:py-8 transition-colors hover:bg-white/50 relative overflow-hidden">
                <div className="absolute left-0 bottom-0 h-[1px] w-full bg-[#F26A21] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                
                <div className="flex flex-row items-center gap-4 md:gap-16 pr-4">
                  <span className="text-xs font-bold text-[#0A192F]/30 tracking-widest group-hover:text-[#F26A21] group-hover:-translate-y-1 transition-all">0{idx + 1}</span>
                  <h3 className="font-display text-xl md:text-3xl text-[#0A192F] group-hover:translate-x-2 transition-transform duration-300 line-clamp-2 md:line-clamp-none">{item.title}</h3>
                </div>
                
                <div className="flex-shrink-0">
                  <ArrowRight className="size-5 text-[#0A192F]/30 group-hover:text-[#F26A21] group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= IMPACT ================= */}
      <section className="py-16 md:py-24 bg-white border-t border-[#0A192F]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="text-xs font-bold tracking-widest text-[#F26A21] uppercase mb-12 md:mb-16 block">Impact at Scale</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {(settings?.achievements?.filter((a: any) => !a.hidden) || [
              { value: "1,200+", label: "Community Members" },
              { value: "180+", label: "Institutions" },
              { value: "54+", label: "Student Projects" }
            ]).map((stat: any, i: number) => {
              // Extract just the numbers for GSAP target, keeping any + or text outside
              const numMatch = stat.value.match(/[\d,.]+/);
              const targetNum = numMatch ? numMatch[0].replace(/,/g, "") : "0";
              const suffix = stat.value.replace(/[\d,.]+/g, "");

              return (
                <div key={i} className="scroll-reveal flex flex-col items-center">
                  <span className="text-5xl md:text-6xl font-display text-[#0A192F] mb-4">
                    <span className="stat-counter" data-target={targetNum}>0</span>
                    {suffix}
                  </span>
                  <span className="text-xs font-bold tracking-widest text-[#0A192F]/50 uppercase">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-[#0A192F] text-white py-24 md:py-32 px-6 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F26A21]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="scroll-reveal max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight mb-8">
            Build What<br/>The Profession<br/>Needs Next.
          </h2>
          <p className="text-lg md:text-xl text-white/70 font-light mb-12">
            Learn actuarial science. Build with AI. Research what comes next.
          </p>
          
          <Button asChild size="lg" className="group bg-[#F26A21] text-white hover:bg-white hover:text-[#0A192F] rounded-none px-10 py-7 uppercase tracking-widest text-sm font-bold transition-colors">
            <Link href="/sign-up">
              Become a Member
              <ArrowRight className="ml-3 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
