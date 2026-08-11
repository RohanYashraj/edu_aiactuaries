import Image from "next/image";

import { cn } from "@/lib/utils";

export type Partner = {
  name: string;
  role?: string;
  note?: string;
  logoPath?: string;
  logoUrl?: string | null;
  logoAlt?: string;
  href?: string;
  invertInDark?: boolean;
};

/** CMS uploads win; `logoPath` is the legacy /public asset. */
function logoSrc(partner: Partner) {
  return partner.logoUrl ?? partner.logoPath ?? null;
}

/** Prominent single-partner block, e.g. the IFoA knowledge-partner callout. */
export function PartnerCallout({ partner }: { partner: Partner }) {
  const src = logoSrc(partner);

  return (
    <div className="relative flex flex-col items-start gap-6 rounded-xl border border-gold/20 bg-linear-to-br from-gold/5 via-transparent to-transparent p-6 shadow-sm sm:flex-row sm:items-center">
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gold/50" />
      <p className="flex-1 pl-2 leading-relaxed text-card-foreground">
        {partner.note ? (
          partner.note
        ) : (
          <>
            We are honoured to have{" "}
            <strong className="font-semibold">{partner.name}</strong>
            {partner.role ? ` as our ${partner.role}` : ""} for this programme.
          </>
        )}
      </p>
      {src ? (
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-center sm:border-l sm:border-border sm:pl-6">
          {partner.role ? (
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {partner.role}
            </span>
          ) : null}
          <div className="flex h-16 w-40 items-center justify-start sm:justify-center">
            <Image
              src={src}
              alt={partner.logoAlt ?? `${partner.name} logo`}
              width={160}
              height={64}
              className={cn(
                "h-full w-auto object-contain",
                partner.invertInDark && "dark:invert",
              )}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Compact inline logo, used on cards. */
export function PartnerLogo({
  partner,
  className,
}: {
  partner: Partner;
  className?: string;
}) {
  const src = logoSrc(partner);
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={partner.logoAlt ?? `${partner.name} logo`}
      width={120}
      height={40}
      className={cn(
        "h-8 w-auto object-contain",
        partner.invertInDark && "dark:invert",
        className,
      )}
    />
  );
}
