"use client";

import React, { useState, useEffect } from "react";
import { ScrambleText } from "@/components/ui/scramble-text";

const PANELS = [
  { title: "ACTUARIAL SCIENCE", desc: "The foundation of risk modeling and financial security." },
  { title: "DATA SCIENCE", desc: "Expanding capabilities through robust engineering and analytics." },
  { title: "GENERATIVE AI", desc: "Transforming workflows with LLMs and prompt engineering." },
  { title: "AGENTIC AI", desc: "Autonomous multi-agent systems for production-scale tasks." },
  { title: "RESEARCH", desc: "Pioneering the future of the actuarial profession." },
];

export function ScrambleStory() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PANELS.length);
    }, 4000); // 4 seconds per panel

    return () => clearInterval(interval);
  }, []);

  const panel = PANELS[activeIndex];

  return (
    <section className="bg-[#0A192F] text-white overflow-hidden py-32 h-[80vh] flex flex-col justify-center px-6 md:px-24">
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-center">
        <span className="text-[#F26A21] text-xs font-bold tracking-widest mb-6 uppercase transition-all duration-300">
          0{activeIndex + 1} / 05
        </span>
        
        <div className="relative overflow-hidden max-w-4xl w-full">
          {/* Invisible placeholder sets the exact container height dynamically */}
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[110px] uppercase leading-[0.95] tracking-tight opacity-0 pointer-events-none select-none">
            {PANELS[activeIndex].title}
          </h2>

          {PANELS.map((p, i) => (
            <h2 
              key={i}
              className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-[110px] uppercase leading-[0.95] tracking-tight absolute top-0 left-0 w-full transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                i === activeIndex 
                  ? 'translate-y-0 opacity-100' 
                  : i < activeIndex 
                    ? '-translate-y-[120%] opacity-0' 
                    : 'translate-y-[120%] opacity-0'
              }`}
            >
              {p.title}
            </h2>
          ))}
        </div>
        
        <p className="mt-8 max-w-md text-lg text-white/60 font-light leading-relaxed min-h-[4em]">
          <ScrambleText text={panel.desc} duration={1000} as="span" />
        </p>

        {/* Progress indicators */}
        <div className="flex gap-3 mt-16">
          {PANELS.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 max-w-[40px] bg-white/10 overflow-hidden">
              <div 
                className={`h-full bg-[#F26A21] transition-transform duration-1000 ease-linear ${idx === activeIndex ? 'translate-x-0' : idx < activeIndex ? 'translate-x-0' : '-translate-x-full'}`}
                style={{
                  transitionDuration: idx === activeIndex ? '4000ms' : '300ms',
                  transform: idx === activeIndex ? 'translateX(0%)' : idx < activeIndex ? 'translateX(0%)' : 'translateX(-100%)'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
