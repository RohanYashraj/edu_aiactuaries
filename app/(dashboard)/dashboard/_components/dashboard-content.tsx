"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Loader2,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function DashboardContent() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const myJobs = useQuery(api.jobs.listByEmployer);

  if (currentUser === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isEmployer = currentUser?.role === "employer";
  const publishedJobCount =
    myJobs?.filter((j) => j.status === "published").length ?? 0;
  const draftJobCount =
    myJobs?.filter((j) => j.status === "draft").length ?? 0;

  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center gap-4">
        {currentUser && (
          <Avatar className="size-12">
            <AvatarImage
              src={currentUser.imageUrl}
              alt={currentUser.name}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back{currentUser ? `, ${currentUser.name}` : ""}!
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {currentUser?.role ?? "member"}
            </Badge>
            {currentUser?.email && (
              <span className="text-sm text-muted-foreground">
                {currentUser.email}
              </span>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Quick stats cards */}
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
              Enrollment tracking coming soon.
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
              Workshop registration coming soon.
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
            {isEmployer ? (
              <>
                <div className="mb-3 flex flex-wrap gap-2 text-sm">
                  <span className="text-muted-foreground">
                    {publishedJobCount} published
                  </span>
                  <span className="text-muted-foreground">&middot;</span>
                  <span className="text-muted-foreground">
                    {draftJobCount} draft
                  </span>
                </div>
                <Link href="/jobs/post">
                  <Button variant="outline" size="sm">
                    Post a Job
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p className="mb-3 text-sm text-muted-foreground">
                  Upgrade to an employer account to post jobs.
                </p>
                <Link href="/jobs">
                  <Button variant="outline" size="sm">
                    Browse Jobs
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Employer's recent jobs */}
      {isEmployer && myJobs && myJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Recent Job Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myJobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between rounded-md border border-border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.company} &middot; {job.location}
                    </p>
                  </div>
                  <Badge
                    variant={
                      job.status === "published"
                        ? "default"
                        : job.status === "draft"
                          ? "secondary"
                          : "outline"
                    }
                    className="capitalize"
                  >
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account info */}
      {currentUser && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <User className="size-5 text-muted-foreground" />
            <CardTitle className="text-base">Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span>{currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{currentUser.email}</span>
              </div>
              {currentUser.username && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Username</span>
                  <span>@{currentUser.username}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="secondary" className="capitalize">
                  {currentUser.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
