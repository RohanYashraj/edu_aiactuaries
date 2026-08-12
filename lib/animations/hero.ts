import gsap from "gsap";

export function animateHeroEntrance(
  container: string | Element,
  targets: {
    badge: string;
    titleLines: string;
    subtitle: string;
    buttons: string;
  }
) {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(targets.badge, {
    y: 20,
    opacity: 0,
    duration: 0.6,
  })
    .from(
      targets.titleLines,
      {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      },
      "-=0.4"
    )
    .from(
      targets.subtitle,
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
      },
      "-=0.4"
    )
    .from(
      targets.buttons,
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
      },
      "-=0.4"
    );

  return tl;
}
