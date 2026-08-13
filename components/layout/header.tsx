"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, ArrowRight } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: "/programs", label: "Programs", external: false },
  { href: "/events", label: "Events", external: false },
  { href: "/news", label: "News", external: false },
  { href: "/about", label: "About", external: false },
] as const;

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(headerRef.current, {
      yPercent: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, { scope: headerRef });

  /** External links are absolute URLs and can never match a pathname. */
  const isActive = (href: string, external: boolean) =>
    !external && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-primary-foreground/10 bg-primary text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo (links to home) */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/sssia-logo.jpeg" alt="SSSIA Logo" className="h-12 w-auto rounded-md" />
          </Link>
        </div>

        {/* Right-aligned navigation + auth */}
        <div className="flex items-center gap-3">
          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label, external }) => {
              const active = isActive(href, external);

              return (
                <Link
                  key={href}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      active
                        ? "bg-transparent font-semibold text-primary-foreground relative after:absolute after:bottom-1.5 after:left-2 after:h-[2px] after:w-[calc(100%-16px)] after:bg-gold"
                        : "bg-transparent text-primary-foreground/80 hover:bg-transparent hover:text-primary-foreground relative after:absolute after:bottom-1.5 after:left-2 after:h-[2px] after:w-[calc(100%-16px)] after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100"
                    }
                  >
                    {label}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <SignedIn>
            <Link href="/dashboard" className="hidden md:inline-flex">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Dashboard
              </Button>
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: "size-8" },
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <span
                className="hidden sm:inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium h-8 px-3 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
              >
                Sign In
              </span>
            </SignInButton>
            <Link href="/sign-up">
              <Button
                size="sm"
                className="group relative overflow-hidden bg-gold text-gold-foreground shadow-sm hover:bg-gold/90 transition-all duration-300 gap-1.5 pr-3"
              >
                Become a Member
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </SignedOut>

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Menu className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="font-display">Navigation</SheetTitle>
              </SheetHeader>
              <Separator />
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map(({ href, label, external }) => {
                  const active = isActive(href, external);

                  return (
                    <SheetClose asChild key={href}>
                      <Link
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                      >
                        <Button
                          variant={active ? "secondary" : "ghost"}
                          className="w-full justify-start"
                        >
                          {label}
                        </Button>
                      </Link>
                    </SheetClose>
                  );
                })}
                <Separator className="my-2" />
                <SignedIn>
                  <SheetClose asChild>
                    <Link href="/dashboard">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  </SheetClose>
                </SignedIn>
                <SignedOut>
                  <SheetClose asChild>
                    <Link href="/sign-up">
                      <Button className="w-full justify-start bg-gold text-gold-foreground hover:bg-gold/90">
                        Become a Member
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/sign-in">
                      <Button variant="outline" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                  </SheetClose>
                </SignedOut>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
