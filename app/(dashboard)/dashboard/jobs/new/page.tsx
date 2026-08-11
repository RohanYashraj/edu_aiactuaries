"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PostJobPage() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);
  const createJob = useMutation(api.jobs.create);

  const [isPending, setIsPending] = useState(false);
  const [jobType, setJobType] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isEmployer = currentUser?.role === "employer";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const form = new FormData(e.currentTarget);
    const title = form.get("title") as string;
    const company = form.get("company") as string;
    const location = form.get("location") as string;
    const description = form.get("description") as string;

    if (!jobType) {
      setError("Please select a job type.");
      setIsPending(false);
      return;
    }

    try {
      await createJob({
        title,
        company,
        location,
        description,
        type: jobType as "full-time" | "part-time" | "contract" | "internship",
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create job posting.",
      );
    } finally {
      setIsPending(false);
    }
  }

  if (currentUser === undefined) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!isEmployer) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <AlertCircle className="size-10 text-muted-foreground" />
            <div className="text-center">
              <p className="text-lg font-medium">Employer Access Required</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Only employer accounts can post jobs. Contact an administrator to
                upgrade your account role.
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <CheckCircle2 className="size-10 text-green-600" />
            <div className="text-center">
              <p className="text-lg font-medium">Job Posted Successfully</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your listing has been created as a draft. Redirecting to
                dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Post a Job</h1>
        <p className="mt-1 text-muted-foreground">
          Fill in the details below to create a new job listing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Job Details</CardTitle>
          <CardDescription>
            Your listing will be created as a draft. You can publish it from your
            dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Data Scientist — Actuarial Pricing"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                placeholder="e.g. InsureTech Corp"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Mumbai, India"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the role, responsibilities, and requirements..."
                rows={6}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "Submitting..." : "Submit Job Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
