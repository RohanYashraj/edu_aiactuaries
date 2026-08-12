import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function animateCounters(
  targets: Element[]
) {
  targets.forEach((target) => {
    // Extract the numerical value assuming it's data-target or innerText
    const targetValueStr = target.getAttribute("data-target") || target.textContent || "0";
    // Strip non-numeric characters except maybe comma, but simpler is just parse integer
    const targetValue = parseInt(targetValueStr.replace(/[^0-9]/g, ""), 10);
    
    if (isNaN(targetValue)) return;
    
    // Store original text to restore suffix/prefix if any, but doing it robustly:
    // Better to have the target just be the number, and suffix in a separate span.
    
    const obj = { val: 0 };
    
    gsap.to(obj, {
      val: targetValue,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: target,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        // Format with commas if large
        target.innerHTML = Math.floor(obj.val).toLocaleString("en-US");
      },
    });
  });
}
