import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function animateScrollReveal(
  targets: string | Element | Element[],
  options?: {
    y?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    scrub?: boolean;
    start?: string;
  }
) {
  const { y = 30, duration = 0.8, stagger = 0, delay = 0, scrub = false, start = "top 85%" } = options || {};

  gsap.fromTo(
    targets,
    {
      y,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: Array.isArray(targets) ? targets[0] : targets,
        start,
        scrub,
        toggleActions: "play none none none",
      },
    }
  );
}

export function animateHorizontalScroll(
  container: Element,
  sections: Element[]
) {
  if (sections.length < 2) return;
  
  // Calculate the total horizontal scroll width needed
  // We want to scroll horizontally by an amount equivalent to the total width of all sections minus the container width
  
  return gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      // end: "+=3000", // Will be configured via component based on content length
      snap: 1 / (sections.length - 1),
      end: () => `+=${container.scrollWidth - window.innerWidth}`,
    },
  });
}
