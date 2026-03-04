import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { href: "/certifications", label: "Certifications" },
  { href: "/workshops", label: "Workshops" },
  { href: "/jobs", label: "Jobs" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm font-medium tracking-tight">
            Sri Sathya Sai Center of Excellence
            <span className="block text-muted-foreground sm:inline sm:before:content-['_—_']">
              Actuarial Data Science & AI
            </span>
          </p>
          <nav className="flex items-center gap-4">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="my-6" />
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Sri Sathya Sai Center of Excellence
          in Actuarial Data Science & AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
