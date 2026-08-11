"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export function ProfileForm() {
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);

  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | "">("");
  const [actuarialBody, setActuarialBody] = useState<ActuarialBody | "">("");
  const [interests, setInterests] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Seed the controlled fields once the user document arrives.
  useEffect(() => {
    if (!user) return;
    setExperienceLevel(user.experienceLevel ?? "");
    setActuarialBody(user.actuarialBody ?? "");
    setInterests(user.interests ? [...user.interests] : []);
  }, [user]);

  if (user === undefined) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Loading your profile
        </CardContent>
      </Card>
    );
  }

  if (user === null) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          We couldn&apos;t find your membership record. Try reloading the page.
        </CardContent>
      </Card>
    );
  }

  function toggleInterest(interest: string) {
    setSaved(false);
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
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
      await updateProfile({
        headline: text("headline"),
        institution: text("institution"),
        actuarialBody: actuarialBody || undefined,
        actuarialBodyOther:
          actuarialBody === "other" ? text("actuarialBodyOther") : undefined,
        examsCleared: examsCleared ?? [],
        interests,
        experienceLevel: experienceLevel || undefined,
        country: text("country"),
        linkedinUrl: text("linkedinUrl"),
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="space-y-5" disabled={isPending}>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                name="headline"
                defaultValue={user.headline ?? ""}
                maxLength={140}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Career stage</Label>
                <Select
                  value={experienceLevel}
                  onValueChange={(v) => setExperienceLevel(v as ExperienceLevel)}
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
                <Label htmlFor="institution">Institution / employer</Label>
                <Input
                  id="institution"
                  name="institution"
                  defaultValue={user.institution ?? ""}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="actuarialBody">Actuarial body</Label>
                <Select
                  value={actuarialBody}
                  onValueChange={(v) => setActuarialBody(v as ActuarialBody)}
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

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue={user.country ?? ""}
                />
              </div>
            </div>

            {actuarialBody === "other" ? (
              <div className="space-y-2">
                <Label htmlFor="actuarialBodyOther">Which body?</Label>
                <Input
                  id="actuarialBodyOther"
                  name="actuarialBodyOther"
                  defaultValue={user.actuarialBodyOther ?? ""}
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="examsCleared">Exams cleared</Label>
              <Input
                id="examsCleared"
                name="examsCleared"
                defaultValue={(user.examsCleared ?? []).join(", ")}
                placeholder="e.g. CS1, CS2, CM1"
              />
              <p className="text-xs text-muted-foreground">Comma-separated.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                defaultValue={user.linkedinUrl ?? ""}
              />
            </div>

          </fieldset>

          <fieldset className="space-y-3" disabled={isPending}>
            <legend className="text-sm font-medium">Interests</legend>
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

          {error ? (
            <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving
                </>
              ) : (
                "Save changes"
              )}
            </Button>
            {saved ? (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-gold" />
                Saved
              </span>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
