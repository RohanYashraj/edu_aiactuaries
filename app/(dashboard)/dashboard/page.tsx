import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Briefcase, GraduationCap } from "lucide-react";

export const metadata = {
  title: "Dashboard — SSS CoE Actuarial DS & AI",
};

export default async function DashboardPage() {
  const { userId } = await auth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here is an overview of your activity.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Certifications</CardTitle>
              <CardDescription>Your enrolled programmes</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              You have not enrolled in any certifications yet.
            </p>
            <Link href="/certifications">
              <Button variant="outline" size="sm">
                Browse Certifications
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Workshops</CardTitle>
              <CardDescription>Upcoming sessions</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              No upcoming workshops registered.
            </p>
            <Link href="/workshops">
              <Button variant="outline" size="sm">
                View Workshops
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Job Posts</CardTitle>
              <CardDescription>Employer tools</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="secondary">Employer</Badge>
              <span className="text-sm text-muted-foreground">
                0 active posts
              </span>
            </div>
            <Link href="/jobs/post">
              <Button variant="outline" size="sm">
                Post a Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Clerk User ID:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              {userId}
            </code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
