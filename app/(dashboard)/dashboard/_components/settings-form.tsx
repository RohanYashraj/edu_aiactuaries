"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { EyeOff, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { RepeatableField } from "@/components/admin/repeatable-field";
import { revalidateContent } from "@/lib/revalidate";

type Achievement = { value: string; label: string; hidden?: boolean };

export function SettingsForm() {
  const settings = useQuery(api.settings.get, {});
  const update = useMutation(api.settings.update);

  // The draft starts empty and falls back to the stored settings until the
  // editor touches something. Deriving it during render rather than syncing in
  // an effect avoids a redundant render pass and the stale-overwrite bug that
  // comes with it.
  const [draft, setDraft] = useState<{
    achievements: Achievement[];
    intro: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const current =
    draft ??
    (settings
      ? {
          achievements: settings.achievements.map((a) => ({ ...a })),
          intro: settings.achievementsIntro ?? "",
        }
      : null);

  const achievements = current?.achievements ?? null;
  const intro = current?.intro ?? "";
  const setAchievements = (next: Achievement[]) =>
    setDraft({ achievements: next, intro });
  const setIntro = (next: string) =>
    setDraft({ achievements: achievements ?? [], intro: next });

  if (achievements === null) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await update({
        achievements: achievements ?? [],
        achievementsIntro: intro.trim() || undefined,
      });
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
      setIsSaving(false);
      return;
    }

    try {
      await revalidateContent(["/"]);
    } catch {
      toast.info("Saved, but the homepage may take a few minutes to update.");
    }
    setIsSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <RepeatableField<Achievement>
        label="Homepage figures"
        description="Shown above the partner logos. An entry with an empty value is not rendered, so leave a figure blank until you can verify it rather than publishing a guess."
        value={achievements}
        onChange={setAchievements}
        makeEmpty={() => ({ value: "", label: "" })}
        rowLabel={(item) => item.label || "Figure"}
        addLabel="Add figure"
        renderRow={(item, patch) => (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
              <Input
                value={item.value}
                onChange={(e) => patch({ value: e.target.value })}
                placeholder="500+"
              />
              <Input
                value={item.label}
                onChange={(e) => patch({ label: e.target.value })}
                placeholder="Students taught"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={item.hidden ?? false}
                onCheckedChange={(hidden) => patch({ hidden })}
              />
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <EyeOff className="size-3.5" />
                Hide this figure
              </span>
            </div>
          </div>
        )}
      />

      <div className="space-y-2">
        <Label htmlFor="intro">Label above the logo strip</Label>
        <Input
          id="intro"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="Engaged with"
        />
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}
        Save settings
      </Button>
    </form>
  );
}
