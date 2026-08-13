import gsap from "gsap";

export function animateHeroEntrance(
  container: string | Element,
  targets: {
    badge: string;
    titleLines: string;
    subtitle: string;
    buttons: string;
    booksLabel?: string;
    books?: string;
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

  if (targets.booksLabel && targets.books) {
    tl.from(
      targets.booksLabel,
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
      },
      "-=0.2"
    ).from(
      targets.books,
      {
        x: 60,
        y: 20,
        scale: 0.96,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
      },
      "-=0.4"
    );
  }

  return tl;
}
