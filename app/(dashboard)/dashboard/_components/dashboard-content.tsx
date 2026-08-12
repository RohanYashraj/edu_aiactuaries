"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Bookmark, CalendarCheck, Loader2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { contentHref, formatContentDate } from "@/lib/content";

/** Fields onboarding collects; how many are filled drives the nudge below. */
const PROFILE_FIELDS = [
  "headline",
  "institution",
  "actuarialBody",
  "experienceLevel",
  "country",
  "interests",
] as const;

export function DashboardContent() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const registrations = useQuery(api.registrations.listMine);
  const saved = useQuery(api.registrations.listSaved);

  if (currentUser === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Brief window right after sign-up, before the Clerk webhook (or the
  // client-side sync fallback) has created the Convex row.
  if (currentUser === null) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">
          Setting up your account. Reload in a few seconds.
        </p>
      </div>
    );
  }

  const initials =
    currentUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const filled = PROFILE_FIELDS.filter((field) => {
    const value = currentUser[field];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  }).length;
  const profileComplete = Math.round((filled / PROFILE_FIELDS.length) * 100);

  // Past registrations stay in the record but don't need dashboard space.
  // `isPast` is computed server-side; see registrations.listMine.
  const upcoming = (registrations ?? []).filter((row) => !row.isPast);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center gap-4">
        <Avatar className="size-14">
          {currentUser.imageUrl ? (
            <AvatarImage src={currentUser.imageUrl} alt="" />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
            Welcome back, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {currentUser.email}
          </p>
        </div>
        {currentUser.role !== "member" ? (
          <Badge className="bg-gold/15 capitalize text-gold hover:bg-gold/20">
            {currentUser.role.replace("_", " ")}
          </Badge>
        ) : null}
      </header>

      {profileComplete < 100 ? (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div>
              <p className="font-medium">
                Your profile is {profileComplete}% complete
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                A fuller profile helps us point the right programs your way.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/profile">Complete profile</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 font-display text-xl tracking-tight">
            <CalendarCheck className="size-5 text-gold" aria-hidden="true" />
            Your registrations
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/events">Browse events</Link>
          </Button>
        </div>

        {registrations === undefined ? (
          <Card>
            <CardContent className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : upcoming.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">
                You haven&apos;t registered for anything yet.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link href="/events">See what&apos;s coming up</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border">
            {upcoming.map((row) => (
              <li
                key={row._id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <Link
                    href={contentHref(row.content!.type, row.content!.slug)}
                    className="font-medium hover:text-gold"
                  >
                    {row.content!.title}
                  </Link>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {formatContentDate(row.content!) ?? "Date to be confirmed"}
                    {row.content!.location ? ` · ${row.content!.location}` : ""}
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {row.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl tracking-tight">
          <Bookmark className="size-5 text-muted-foreground" aria-hidden="true" />
          Saved
        </h2>

        {saved === undefined ? (
          <Card>
            <CardContent className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : saved.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Nothing saved yet. Use Save on any program to keep it here.
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {saved.map((row) => (
              <li key={row._id}>
                <Card className="h-full">
                  <CardContent className="py-5">
                    <Link
                      href={contentHref(row.content!.type, row.content!.slug)}
                      className="font-medium hover:text-gold"
                    >
                      {row.content!.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {row.content!.summary}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
