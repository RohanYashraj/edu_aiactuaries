import { currentUser } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Account — Sri Sathya Sai Institute of Actuaries",
  openGraph: {
    images: [
      {
        url: "/sssia.png",
        width: 1200,
        height: 630,
        alt: "Sri Sathya Sai Institute of Actuaries",
      },
    ],
  },
  twitter: {
    images: ["/sssia.png"],
  },
};

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((n) => n![0])
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your profile and account settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
          <CardDescription>
            Your account details from Clerk. To update, use the profile button in
            the header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={user.imageUrl} alt={user.fullName ?? "User"} />
              <AvatarFallback className="text-lg">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.fullName || "User"}</p>
              <p className="text-sm text-muted-foreground">
                {user.primaryEmailAddress?.emailAddress}
              </p>
              {user.username && (
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID</span>
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                {user.id}
              </code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role</span>
              <Badge variant="secondary">
                {(user.publicMetadata?.role as string) || "member"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Joined</span>
              <span>
                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
