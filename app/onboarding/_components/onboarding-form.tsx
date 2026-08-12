"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { AlertCircle, Loader2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { markOnboardingComplete } from "@/lib/clerk-metadata";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ACTUARIAL_BODIES = [
  { value: "IAI", label: "Institute of Actuaries of India (IAI)" },
  { value: "IFoA", label: "Institute and Faculty of Actuaries (IFoA)" },
  { value: "SOA", label: "Society of Actuaries (SOA)" },
  { value: "CAS", label: "Casualty Actuarial Society (CAS)" },
  { value: "other", label: "Other" },
  { value: "none", label: "Not affiliated yet" },
] as const;

const EXPERIENCE_LEVELS = [
  { value: "student", label: "Student" },
  { value: "graduate", label: "Recent graduate" },
  { value: "working_professional", label: "Working professional" },
  { value: "academic", label: "Academic / faculty" },
  { value: "other", label: "Other" },
] as const;

const INTERESTS = [
  "Pricing",
  "Reserving",
  "Claims Analytics",
  "Fraud Detection",
  "Machine Learning",
  "Generative AI",
  "Risk Management",
  "Health Insurance",
  "Life Insurance",
  "General Insurance",
  "Data Engineering",
  "Research",
] as const;

type ActuarialBody = (typeof ACTUARIAL_BODIES)[number]["value"];
type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]["value"];

export function OnboardingForm() {
  const router = useRouter();
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | "">("");
  const [actuarialBody, setActuarialBody] = useState<ActuarialBody | "">("");
  const [interests, setInterests] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleInterest(interest: string) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!experienceLevel) {
      setError("Please tell us where you are in your career.");
      return;
    }

    setIsPending(true);
    const form = new FormData(event.currentTarget);
    const text = (key: string) => {
      const value = (form.get(key) as string | null)?.trim();
      return value ? value : undefined;
    };

    const examsCleared = (form.get("examsCleared") as string | null)
      ?.split(",")
      .map((exam) => exam.trim())
      .filter(Boolean);

    try {
      await completeOnboarding({
        headline: text("headline"),
        institution: text("institution"),
        actuarialBody: actuarialBody || undefined,
        actuarialBodyOther:
          actuarialBody === "other" ? text("actuarialBodyOther") : undefined,
        examsCleared: examsCleared?.length ? examsCleared : undefined,
        interests: interests.length ? interests : undefined,
        experienceLevel,
        country: text("country"),
        linkedinUrl: text("linkedinUrl"),
      });

      // Mirror into Clerk publicMetadata so the middleware stops redirecting
      // back here on the next navigation.
      await markOnboardingComplete();

      // Do NOT add router.refresh() here. push() and refresh() each wrap their
      // dispatch in startTransition, so calling both in the same tick batches
      // them and the refresh replaces the push's cache node — the navigation
      // fetches /dashboard but never commits, stranding the user on this page
      // with the button stuck on "Saving". push() already fetches the
      // destination fresh, so the refresh bought nothing.
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save your profile.",
      );
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <fieldset className="space-y-5" disabled={isPending}>
        <legend className="sr-only">About you</legend>

        <div className="space-y-2">
          <Label htmlFor="headline">
            Headline <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="headline"
            name="headline"
            placeholder="e.g. Actuarial student exploring machine learning in pricing"
            maxLength={140}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Where are you right now?</Label>
            <Select
              value={experienceLevel}
              onValueChange={(value) => setExperienceLevel(value as ExperienceLevel)}
            >
              <SelectTrigger id="experienceLevel" className="w-full">
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">
              Institution / employer{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="institution"
              name="institution"
              placeholder="e.g. Christ University"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="actuarialBody">
              Actuarial body{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Select
              value={actuarialBody}
              onValueChange={(value) => setActuarialBody(value as ActuarialBody)}
            >
              <SelectTrigger id="actuarialBody" className="w-full">
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
              <SelectContent>
                {ACTUARIAL_BODIES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {actuarialBody === "other" ? (
            <div className="space-y-2">
              <Label htmlFor="actuarialBodyOther">Which body?</Label>
              <Input id="actuarialBodyOther" name="actuarialBodyOther" />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input id="country" name="country" placeholder="e.g. India" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="examsCleared">
            Exams cleared{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="examsCleared"
            name="examsCleared"
            placeholder="e.g. CS1, CS2, CM1"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated. Leave blank if none yet.
          </p>
        </div>
      </fieldset>

      <fieldset className="space-y-3" disabled={isPending}>
        <legend className="text-sm font-medium">
          What are you interested in?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const selected = interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleInterest(interest)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  selected
                    ? "border-gold bg-gold/15 font-medium text-foreground"
                    : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground",
                )}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-2" disabled={isPending}>
        <Label htmlFor="linkedinUrl">
          LinkedIn <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="linkedinUrl"
          name="linkedinUrl"
          type="url"
          placeholder="https://linkedin.com/in/..."
        />
      </fieldset>

      {error ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending} size="lg">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving
            </>
          ) : (
            "Finish and continue"
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          You can change any of this later from your dashboard.
        </p>
      </div>
    </form>
  );
}
