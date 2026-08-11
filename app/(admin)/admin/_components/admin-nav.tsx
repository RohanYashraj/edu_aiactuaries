"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Image as ImageIcon,
  LayoutDashboard,
  Newspaper,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, adminOnly: false },
  { href: "/admin/content", label: "Content", icon: Newspaper, adminOnly: false },
  { href: "/admin/media", label: "Media", icon: ImageIcon, adminOnly: false },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase, adminOnly: false },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
] as const;

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="hidden w-52 shrink-0 md:block">
      <ul className="sticky top-24 space-y-1">
        {LINKS.filter((link) => isAdmin || !link.adminOnly).map(
          ({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          },
        )}
      </ul>
    </nav>
  );
}
