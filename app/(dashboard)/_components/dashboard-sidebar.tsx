"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Building2,
  ImageIcon,
  LayoutDashboard,
  Menu,
  Newspaper,
  Settings,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Access = "all" | "staff" | "admin";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  access: Access;
};

const LINKS: NavLink[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, access: "all" },
  { href: "/dashboard/profile", label: "Profile", icon: User, access: "all" },
  { href: "/dashboard/content", label: "Content", icon: Newspaper, access: "staff" },
  { href: "/dashboard/media", label: "Media", icon: ImageIcon, access: "staff" },
  { href: "/dashboard/organisations", label: "Organisations", icon: Building2, access: "staff" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, access: "staff" },
  { href: "/dashboard/users", label: "Users", icon: Users, access: "admin" },
];

const ROLE_LABEL: Record<string, string> = {
  member: "Member",
  content_manager: "Content manager",
  admin: "Administrator",
};

export type DashboardSidebarProps = {
  staff: boolean;
  admin: boolean;
  name: string;
  role: string;
};

function visibleLinks(staff: boolean, admin: boolean): NavLink[] {
  return LINKS.filter((link) =>
    link.access === "all"
      ? true
      : link.access === "staff"
        ? staff
        : admin,
  );
}

function NavList({
  staff,
  admin,
  onNavigate,
}: {
  staff: boolean;
  admin: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {visibleLinks(staff, admin).map(({ href, label, icon: Icon }) => {
        // Exact match for the index route so it isn't active on every child.
        const active =
          href === "/dashboard" ? pathname === href : pathname.startsWith(href);

        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
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
      })}
    </ul>
  );
}

function BrandMark() {
  // Links to the public site — this replaces the old "Back to Site" button.
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-gold text-xs font-bold text-gold-foreground shadow-sm">
        edu.
      </span>
      <span className="text-sm font-semibold tracking-tight">SSSIA</span>
    </Link>
  );
}

function UserBlock({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-3 border-t border-border px-3 py-4">
      <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "size-8" } }} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {ROLE_LABEL[role] ?? "Member"}
        </p>
      </div>
    </div>
  );
}

export function DashboardSidebar({ staff, admin, name, role }: DashboardSidebarProps) {
  return (
    <>
      {/* Desktop: fixed rail */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-background md:flex md:flex-col">
        <div className="px-3 py-4">
          <BrandMark />
        </div>
        <nav className="flex-1 px-3">
          <NavList staff={staff} admin={admin} />
        </nav>
        <UserBlock name={name} role={role} />
      </aside>

      {/* Mobile: top bar with a sheet */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
        <BrandMark />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="px-3 py-4">
                <BrandMark />
              </div>
              <nav className="flex-1 px-3">
                <NavList staff={staff} admin={admin} />
              </nav>
              <UserBlock name={name} role={role} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
