import Image from "next/image";

export type Achievement = {
  value: string;
  label: string;
  hidden?: boolean;
};

/** Bodies the Institute has engaged with. Logos already live in /public. */
const BODIES = [
  { name: "Institute and Faculty of Actuaries", src: "/ifoa.svg", invert: true },
  { name: "Society of Actuaries", src: "/soa.png" },
  { name: "Casualty Actuarial Society", src: "/cas.png" },
  { name: "Institute of Actuaries of India", src: "/iai.png" },
  { name: "ACTEX Learning", src: "/actex.png" },
];

/**
 * Achievements, as figures over a recognition strip.
 *
 * Figures come from the CMS, and any entry without a value is dropped rather
 * than rendered as a placeholder — a number nobody has verified should not
 * appear on a public page just to fill the layout.
 */
export function AchievementsBand({
  achievements,
  intro,
}: {
  achievements: Achievement[];
  intro?: string;
}) {
  const shown = achievements.filter((a) => !a.hidden && a.value.trim() !== "");

  return (
    <section
      aria-labelledby="achievements-heading"
      className="border-b border-border bg-muted/40 px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 id="achievements-heading" className="sr-only">
          What the Institute has done
        </h2>

        {shown.length > 0 ? (
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-3">
            {shown.map((item) => (
              <div key={item.label}>
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <span className="block font-display text-4xl leading-none tracking-tight sm:text-5xl">
                    {item.value}
                  </span>
                  <span className="mt-3 block max-w-[14rem] font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className={shown.length > 0 ? "mt-14 border-t border-border pt-10" : ""}>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
            {intro ?? "Engaged with"}
          </p>
          <ul className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6">
            {BODIES.map((body) => (
              <li key={body.name}>
                <Image
                  src={body.src}
                  alt={body.name}
                  width={140}
                  height={44}
                  className={
                    body.invert
                      ? "h-10 w-28 object-contain opacity-60 transition-opacity hover:opacity-100 dark:invert"
                      : "h-10 w-28 object-contain opacity-60 transition-opacity hover:opacity-100"
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
