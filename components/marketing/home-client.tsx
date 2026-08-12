"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { animateHeroEntrance } from "@/lib/animations/hero";
import { animateScrollReveal } from "@/lib/animations/scrollReveal";
import { animateCounters } from "@/lib/animations/counters";
import { animateHorizontalScroll } from "@/lib/animations/scrollReveal";
import { Button } from "@/components/ui/button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HomeClientProps {
  userId: string | null;
  news: any[];
}

export function HomeClient({ userId, news }: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Hero Entrance
    animateHeroEntrance(containerRef.current!, {
      badge: ".hero-badge",
      titleLines: ".hero-title-line",
      subtitle: ".hero-subtitle",
      buttons: ".hero-btn",
    });

    // 2. Statistics Counters
    const counters = gsap.utils.toArray(".stat-counter") as Element[];
    animateCounters(counters);

    // 3. Scroll Reveals
    const revealElements = gsap.utils.toArray(".scroll-reveal") as Element[];
    revealElements.forEach((el) => {
      animateScrollReveal(el);
    });

    // 4. Horizontal Scroll Section
    // Disable horizontal scroll on mobile (e.g. < 768px)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const sections = gsap.utils.toArray(".horizontal-panel") as Element[];
      if (horizontalRef.current && sections.length > 0) {
        animateHorizontalScroll(horizontalRef.current, sections);
      }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#FCFCFA] text-[#0A192F] font-sans selection:bg-[#F26A21] selection:text-white">
      {/* ================= HERO SECTION ================= */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 py-24 sm:py-32 overflow-hidden border-b border-[#0A192F]/10">
        {/* Subtle Technical Grid */}
        <div className="absolute inset-0 hero-grid-bg opacity-40 mix-blend-multiply pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
          
          <div className="flex-1">
            <div className="hero-badge inline-flex items-center gap-2 mb-8 text-xs font-bold tracking-widest uppercase text-[#F26A21]">
              <span className="w-2 h-2 bg-[#F26A21] rounded-full" />
              Powered by aiactuaries.org
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[85px] leading-[0.95] tracking-tight uppercase text-[#0A192F]">
              <div className="overflow-hidden pb-2"><div className="hero-title-line">The Institute for</div></div>
              <div className="overflow-hidden pb-2"><div className="hero-title-line">Actuarial</div></div>
              <div className="overflow-hidden pb-2"><div className="hero-title-line">Science</div></div>
              <div className="overflow-hidden pb-2"><div className="hero-title-line text-[#F26A21]">× AI</div></div>
            </h1>

            <p className="hero-subtitle mt-8 max-w-xl text-lg md:text-xl font-light leading-relaxed text-[#0A192F]/80">
              Building the next generation of actuarial professionals through data science, AI, research and applied learning.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-6">
              {userId ? (
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

          <div className="hidden md:flex flex-col items-end gap-2 text-xs font-bold tracking-widest uppercase text-[#0A192F]/40 hero-subtitle">
            <p>2026</p>
            <p>01 / 04</p>
          </div>
        </div>
      </section>

      {/* ================= STATISTICS SECTION ================= */}
      <section className="border-b border-[#0A192F]/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#0A192F]/10">
            
            <div className="scroll-reveal flex flex-col pt-8 md:pt-0 md:px-8">
              <span className="text-5xl md:text-7xl font-display text-[#0A192F] stat-counter" data-target="3">0</span>
              <span className="mt-4 text-xs font-bold tracking-widest text-[#0A192F]/60 uppercase leading-relaxed max-w-[150px]">
                Editions of the Summer Program
              </span>
            </div>
            
            <div className="scroll-reveal flex flex-col pt-8 md:pt-0 md:px-8">
              <span className="text-5xl md:text-7xl font-display text-[#0A192F]">
                ₹<span className="stat-counter inline-block" data-target="0">0</span>
              </span>
              <span className="mt-4 text-xs font-bold tracking-widest text-[#0A192F]/60 uppercase leading-relaxed max-w-[150px]">
                Cost to Students
              </span>
            </div>
            
            <div className="scroll-reveal flex flex-col pt-8 md:pt-0 md:px-8">
              <span className="text-5xl md:text-7xl font-display text-[#0A192F] stat-counter" data-target="5">0</span>
              <span className="mt-4 text-xs font-bold tracking-widest text-[#0A192F]/60 uppercase leading-relaxed max-w-[150px]">
                Professional Bodies Engaged
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ================= PROGRAMS SECTION ================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="scroll-reveal mb-16 md:mb-24">
          <h2 className="font-display text-4xl md:text-6xl text-[#0A192F] uppercase tracking-tight">Our Programs</h2>
          <span className="text-xs font-bold tracking-widest text-[#F26A21] uppercase mt-4 block">Core Pillars</span>
        </div>

        <div className="flex flex-col border-t border-[#0A192F]/10">
          {[
            { id: "01", title: "Actuarial Data Science", desc: "Foundations → Applied Learning", href: "/programs" },
            { id: "02", title: "Artificial Intelligence", desc: "ML → Generative AI → Agents", href: "/programs" },
            { id: "03", title: "Professional Development", desc: "Workshops → Certifications", href: "/certifications" },
            { id: "04", title: "Research", desc: "Research → Publications → SUTRA", href: "https://sutra.sssia.org" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="group flex flex-col md:flex-row md:items-center border-b border-[#0A192F]/10 py-10 transition-all hover:bg-white/50 relative overflow-hidden">
              <div className="absolute left-0 bottom-0 h-[2px] w-full bg-[#F26A21] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
              
              <div className="text-xs font-bold text-[#0A192F]/40 tracking-widest mb-4 md:mb-0 md:w-24 group-hover:text-[#F26A21] transition-colors">{item.id}</div>
              
              <div className="flex-1 md:pr-12">
                <h3 className="font-display text-2xl md:text-4xl text-[#0A192F] group-hover:translate-x-2 transition-transform duration-300 uppercase">{item.title}</h3>
                <p className="mt-2 text-sm text-[#0A192F]/60 font-light tracking-wide uppercase group-hover:translate-x-2 transition-transform duration-300 delay-75">{item.desc}</p>
              </div>
              
              <div className="hidden md:flex items-center justify-end w-16">
                <ArrowRight className="size-6 text-[#0A192F]/30 group-hover:text-[#F26A21] group-hover:translate-x-2 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= HORIZONTAL SCROLL STORYTELLING ================= */}
      <section className="bg-[#0A192F] text-white hidden md:block overflow-hidden" ref={horizontalRef}>
        <div className="flex w-[500vw] h-screen">
          {[
            { title: "ACTUARIAL SCIENCE", desc: "The foundation of risk modeling and financial security." },
            { title: "DATA SCIENCE", desc: "Expanding capabilities through robust engineering and analytics." },
            { title: "GENERATIVE AI", desc: "Transforming workflows with LLMs and prompt engineering." },
            { title: "AGENTIC AI", desc: "Autonomous multi-agent systems for production-scale tasks." },
            { title: "RESEARCH", desc: "Pioneering the future of the actuarial profession." },
          ].map((panel, idx) => (
            <div key={idx} className="horizontal-panel w-screen h-screen flex flex-col justify-center px-12 md:px-24 border-r border-white/10">
              <span className="text-[#F26A21] text-xs font-bold tracking-widest mb-6 uppercase">0{idx + 1} / 05</span>
              <h2 className="font-display text-6xl md:text-8xl lg:text-[120px] uppercase leading-[0.9] tracking-tight">{panel.title}</h2>
              <p className="mt-8 max-w-md text-lg text-white/60 font-light leading-relaxed">{panel.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Mobile fallback for horizontal section */}
      <section className="bg-[#0A192F] text-white md:hidden py-24 px-6 flex flex-col gap-16">
        {[
          { title: "ACTUARIAL SCIENCE", desc: "The foundation of risk modeling and financial security." },
          { title: "DATA SCIENCE", desc: "Expanding capabilities through robust engineering and analytics." },
          { title: "GENERATIVE AI", desc: "Transforming workflows with LLMs and prompt engineering." },
          { title: "AGENTIC AI", desc: "Autonomous multi-agent systems for production-scale tasks." },
          { title: "RESEARCH", desc: "Pioneering the future of the actuarial profession." },
        ].map((panel, idx) => (
          <div key={idx} className="scroll-reveal flex flex-col">
            <span className="text-[#F26A21] text-xs font-bold tracking-widest mb-4 uppercase">0{idx + 1} / 05</span>
            <h2 className="font-display text-4xl uppercase leading-tight tracking-tight">{panel.title}</h2>
            <p className="mt-4 text-sm text-white/60 font-light leading-relaxed">{panel.desc}</p>
          </div>
        ))}
      </section>

      {/* ================= RESEARCH / SUTRA / FULL STACK ================= */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          {/* Research Intro */}
          <div className="scroll-reveal flex flex-col justify-center">
            <span className="text-xs font-bold tracking-widest text-[#F26A21] uppercase mb-8">Research / 01</span>
            <h2 className="font-display text-5xl md:text-6xl text-[#0A192F] uppercase leading-[1.1] tracking-tight mb-8">
              Where Actuarial<br/>Science Meets<br/>New Computation
            </h2>
            <p className="text-lg text-[#0A192F]/70 font-light max-w-md mb-10 leading-relaxed">
              Research, publications and applied work shaping the future of the profession.
            </p>
            <Link href="https://sutra.sssia.org" className="group inline-flex items-center gap-3 text-xs font-bold tracking-widest text-[#0A192F] uppercase hover:text-[#F26A21] transition-colors w-max pb-2 border-b border-[#0A192F]/20 hover:border-[#F26A21]">
              Explore Research <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          {/* Featured Publications */}
          <div className="flex flex-col gap-12 border-t md:border-t-0 md:border-l border-[#0A192F]/10 pt-12 md:pt-0 md:pl-12">
            
            <div className="scroll-reveal group">
              <p className="text-xs font-bold tracking-widest text-[#0A192F]/40 uppercase mb-4">Platform</p>
              <h3 className="font-display text-3xl text-[#0A192F] mb-4 group-hover:text-[#F26A21] transition-colors">SUTRA</h3>
              <p className="text-sm text-[#0A192F]/70 mb-6 max-w-sm leading-relaxed">The official research and publication hub of Sri Sathya Sai Institute of Actuaries.</p>
              <a href="https://sutra.sssia.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-[#0A192F] uppercase group-hover:text-[#F26A21] transition-colors">
                Explore SUTRA <ArrowUpRight className="size-3" />
              </a>
            </div>

            <div className="w-full h-px bg-[#0A192F]/10" />

            <div className="scroll-reveal group">
              <p className="text-xs font-bold tracking-widest text-[#0A192F]/40 uppercase mb-4">Publication</p>
              <h3 className="font-display text-3xl text-[#0A192F] mb-4 group-hover:text-[#F26A21] transition-colors">The Full Stack Actuary</h3>
              <p className="text-sm text-[#0A192F]/70 mb-6 max-w-sm leading-relaxed">A comprehensive guide for modern actuaries to expand their skillsets across data engineering and ML.</p>
              <a href="https://fullstackactuary.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-[#0A192F] uppercase group-hover:text-[#F26A21] transition-colors">
                Explore The Full Stack Actuary <ArrowUpRight className="size-3" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ================= NEWS PREVIEW ================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 border-t border-[#0A192F]/10">
        <div className="max-w-5xl mx-auto">
          <div className="scroll-reveal flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
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
              <Link key={item.slug} href={`/news/${item.slug}`} className="scroll-reveal group flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0A192F]/10 py-8 transition-colors hover:bg-white/50 relative overflow-hidden">
                <div className="absolute left-0 bottom-0 h-[1px] w-full bg-[#F26A21] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                
                <div className="flex items-center gap-8 md:gap-16">
                  <span className="text-xs font-bold text-[#0A192F]/30 tracking-widest group-hover:text-[#F26A21] group-hover:-translate-y-1 transition-all">0{idx + 1}</span>
                  <h3 className="font-display text-2xl md:text-3xl text-[#0A192F] group-hover:translate-x-2 transition-transform duration-300">{item.title}</h3>
                </div>
                
                <div className="mt-4 sm:mt-0 sm:pl-8 text-right">
                  <ArrowRight className="size-5 text-[#0A192F]/30 group-hover:text-[#F26A21] group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= IMPACT ================= */}
      <section className="py-24 bg-white border-t border-[#0A192F]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="text-xs font-bold tracking-widest text-[#F26A21] uppercase mb-16 block">Impact at Scale</span>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            {[
              { num: "1,200", suffix: "+", label: "Community Members" },
              { num: "180", suffix: "+", label: "Institutions" },
              { num: "54", suffix: "+", label: "Student Projects" },
              { num: "100", suffix: "+", label: "Actuarial Students" },
            ].map((stat, i) => (
              <div key={i} className="scroll-reveal flex flex-col items-center">
                <span className="text-5xl md:text-6xl font-display text-[#0A192F] mb-4">
                  <span className="stat-counter" data-target={stat.num.replace(/,/g, "")}>0</span>
                  {stat.suffix}
                </span>
                <span className="text-xs font-bold tracking-widest text-[#0A192F]/50 uppercase">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-[#0A192F] text-white py-32 px-6 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F26A21]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="scroll-reveal max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight mb-8">
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
