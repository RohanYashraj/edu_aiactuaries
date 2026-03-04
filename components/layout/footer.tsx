import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { href: "/certifications", label: "Certifications" },
  { href: "/workshops", label: "Workshops" },
  { href: "/jobs", label: "Jobs" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-lg">
              Sri Sathya Sai Center of Excellence
            </p>
            <p className="mt-0.5 text-sm text-primary-foreground/70">
              Actuarial Data Science & AI
            </p>
          </div>
          <nav className="flex items-center gap-5">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-primary-foreground/70 transition-colors hover:text-gold"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="my-6 bg-primary-foreground/10" />
        <p className="text-center text-xs text-primary-foreground/50">
          &copy; {new Date().getFullYear()} Sri Sathya Sai Center of Excellence
          in Actuarial Data Science & AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
