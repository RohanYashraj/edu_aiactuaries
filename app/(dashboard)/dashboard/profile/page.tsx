import { currentUser } from "@clerk/nextjs/server";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";
import { getDashboardSession } from "@/lib/dashboard-user";
import { ROLE_LABEL } from "@/lib/dashboard-roles";
import { ProfileForm } from "./_components/profile-form";

export const metadata = buildMetadata({
  title: "Profile",
  path: "/dashboard/profile",
  noindex: true,
});

export default async function ProfilePage() {
  const clerkUser = await currentUser();
  const { user } = await getDashboardSession();

  const initials = [clerkUser?.firstName, clerkUser?.lastName]
    .filter(Boolean)
    .map((part) => part![0])
    .join("")
    .toUpperCase();

  const joined = clerkUser
    ? new Date(clerkUser.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header>
        <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
          Your Profile
        </h1>
        <p className="mt-1 text-muted-foreground">
          Keep this current so we can point the right programs and opportunities
          your way.
        </p>
      </header>

      {/* Identity — read-only, owned by Clerk. Editing email or password happens
          in Clerk's own UI, reachable from the avatar menu in the sidebar. */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 py-6">
          <Avatar className="size-16">
            <AvatarImage src={clerkUser?.imageUrl} alt={clerkUser?.fullName ?? "User"} />
            <AvatarFallback className="text-lg">{initials || "U"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{clerkUser?.fullName || user?.name || "User"}</p>
            <p className="truncate text-sm text-muted-foreground">
              {clerkUser?.primaryEmailAddress?.emailAddress ?? user?.email}
            </p>
            {joined ? (
              <p className="mt-1 text-xs text-muted-foreground">Member since {joined}</p>
            ) : null}
          </div>
          <Badge variant="secondary">{(user && ROLE_LABEL[user.role]) ?? "—"}</Badge>
        </CardContent>
      </Card>

      <ProfileForm />
    </div>
  );
}
