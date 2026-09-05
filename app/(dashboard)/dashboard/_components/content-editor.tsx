"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useAction } from "convex/react";
import { ArrowLeft, Eye, Loader2, Save, Wand2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RepeatableField } from "@/components/admin/repeatable-field";
import { OrganizationPicker } from "@/components/admin/organization-picker";
import { StringListField } from "@/components/admin/string-list-field";
import { Markdown } from "@/components/content/markdown";
import { CONTENT_TYPE_LABELS, contentHref } from "@/lib/content";
import { revalidateContent } from "@/lib/revalidate";
import {
  contentFormSchema,
  defaultDetailsFor,
  type ContentFormValues,
  type CtaValue,
  type FactValue,
  type FaqValue,
  type PartnerValue,
} from "@/lib/validators/content";
import { DetailsFields } from "./details-fields";
import { CoverImageField } from "./cover-image-field";
import { ContentRegistrations } from "./content-registrations";

type ContentType = ContentFormValues["type"];
type ContentStatus = ContentFormValues["status"];

const TYPES: ContentType[] = [
  "event",
  "program",
  "workshop",
  "certification",
  "internship",
  "news",
];
const STATUSES: ContentStatus[] = ["draft", "scheduled", "published", "archived"];

/** epoch ms <-> the yyyy-mm-dd a date input wants. */
const toDateInput = (ms?: number) =>
  ms === undefined ? "" : new Date(ms).toISOString().slice(0, 10);
const fromDateInput = (value?: string) =>
  value ? Date.parse(`${value}T00:00:00.000Z`) : undefined;

/** Scheduling needs a time too, so it uses datetime-local (browser timezone). */
const toDateTimeInput = (ms?: number) => {
  if (ms === undefined) return "";
  const d = new Date(ms - new Date(ms).getTimezoneOffset() * 60_000);
  return d.toISOString().slice(0, 16);
};
const fromDateTimeInput = (value?: string) =>
  value ? new Date(value).getTime() : undefined;

function initialValues(doc?: Doc<"content">): ContentFormValues {
  if (!doc) {
    return {
      type: "event",
      status: "draft",
      title: "",
      summary: "",
      order: 0,
      featured: false,
      details: defaultDetailsFor("event"),
    } as ContentFormValues;
  }

  return {
    type: doc.type,
    slug: doc.slug,
    status: doc.status,
    title: doc.title,
    subtitle: doc.subtitle,
    summary: doc.summary,
    body: doc.body,
    badge: doc.badge,
    coverImageId: doc.coverImageId,
    coverImagePath: doc.coverImagePath,
    coverImageAlt: doc.coverImageAlt,
    startDate: toDateInput(doc.startDate),
    endDate: toDateInput(doc.endDate),
    dateLabel: doc.dateLabel,
    location: doc.location,
    scheduledFor: toDateTimeInput(doc.scheduledFor),
    order: doc.order,
    featured: doc.featured,
    featureRank: doc.featureRank,
    tags: doc.tags ?? [],
    facts: doc.facts ?? [],
    ctas: doc.ctas ?? [],
    partners: doc.partners ?? [],
    faqs: doc.faqs ?? [],
    details: doc.details,
    linkedinUrl: doc.linkedinUrl,
    websiteUrl: doc.websiteUrl,
    websiteLabel: doc.websiteLabel,
    metaTitle: doc.seo?.metaTitle,
    metaDescription: doc.seo?.metaDescription,
    canonicalUrl: doc.seo?.canonicalUrl,
    keywords: doc.seo?.keywords ?? [],
    noindex: doc.seo?.noindex,
  } as ContentFormValues;
}

export function ContentEditor({
  doc,
  coverImageUrl,
}: {
  doc?: Doc<"content">;
  coverImageUrl?: string | null;
}) {
  const router = useRouter();
  const create = useMutation(api.contentAdmin.create);
  const update = useMutation(api.contentAdmin.update);

  const [values, setValues] = useState<ContentFormValues>(() =>
    initialValues(doc),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const generateAI = useAction(api.ai.generateContentDetails);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const handleAiGenerate = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    try {
      const result = await generateAI({ input: aiInput }) as any;
      if (result) {
        setValues((current) => ({
          ...current,
          title: result.title || current.title,
          subtitle: result.subtitle || current.subtitle,
          summary: result.summary || current.summary,
          type: (result.type as ContentType) || current.type,
          body: result.body || current.body,
          badge: result.badge || current.badge,
          startDate: result.startDate || current.startDate,
          endDate: result.endDate || current.endDate,
          dateLabel: result.dateLabel || current.dateLabel,
          location: result.location || current.location,
          slug: result.slug || current.slug,
          tags: result.tags || current.tags,
          metaTitle: result.metaTitle || current.metaTitle,
          metaDescription: result.metaDescription || current.metaDescription,
          linkedinUrl: result.linkedinUrl || current.linkedinUrl,
          websiteUrl: result.websiteUrl || current.websiteUrl,
          websiteLabel: result.websiteLabel || current.websiteLabel,
          featured: result.featured !== undefined ? result.featured : current.featured,
          details: {
             ...current.details,
             kind: (result.type as ContentType) || current.type,
          } as any
        }));
        toast.success("Form updated with AI!");
        setIsAiDialogOpen(false);
        setAiInput("");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to generate content via AI");
    } finally {
      setIsAiLoading(false);
    }
  };

  const set = <K extends keyof ContentFormValues>(
    key: K,
    value: ContentFormValues[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});

    const parsed = contentFormSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".") || "form";
        fieldErrors[path] ??= issue.message;
      }
      setErrors(fieldErrors);
      toast.error(Object.values(fieldErrors)[0] ?? "Please fix the errors");
      return;
    }

    const data = parsed.data;
    setIsSaving(true);

    const seo =
      data.metaTitle ||
      data.metaDescription ||
      data.canonicalUrl ||
      data.keywords?.length ||
      data.noindex
        ? {
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            canonicalUrl: data.canonicalUrl,
            keywords: data.keywords ?? [],
            noindex: data.noindex,
          }
        : undefined;

    const payload = {
      type: data.type,
      slug: data.slug,
      status: data.status,
      title: data.title,
      subtitle: data.subtitle,
      summary: data.summary,
      body: data.body,
      badge: data.badge,
      coverImageId: data.coverImageId as Id<"_storage"> | undefined,
      coverImagePath: data.coverImagePath,
      coverImageAlt: data.coverImageAlt,
      startDate: fromDateInput(data.startDate),
      endDate: fromDateInput(data.endDate),
      dateLabel: data.dateLabel,
      location: data.location,
      scheduledFor: fromDateTimeInput(data.scheduledFor),
      order: data.order,
      featured: data.featured,
      featureRank: data.featured ? (data.featureRank ?? 0) : undefined,
      // Empty arrays are sent as [] rather than undefined: undefined is
      // stripped from mutation args, so deleting the last FAQ or tag used to
      // leave the old list in place.
      linkedinUrl: data.linkedinUrl,
      websiteUrl: data.websiteUrl,
      websiteLabel: data.websiteLabel,
      tags: data.tags ?? [],
      facts: data.facts ?? [],
      ctas: data.ctas ?? [],
      // Storage ids round-trip through the form as plain strings.
      partners: (data.partners ?? []) as {
        organizationId?: Id<"organizations">;
        name: string;
        role?: string;
        note?: string;
        logoStorageId?: Id<"_storage">;
        logoPath?: string;
        logoAlt?: string;
        href?: string;
        invertInDark?: boolean;
      }[],
      faqs: data.faqs ?? [],
      // Merge over what's stored so a field this form doesn't model can never
      // be dropped, even if the zod union drifts from the Convex one again.
      // Cast: storage ids round-trip through the form as plain strings, but
      // the values genuinely are storage ids at runtime.
      details: (doc
        ? { ...doc.details, ...data.details }
        : data.details) as Doc<"content">["details"],
      seo,
    };

    // Scalars the editor has emptied. These have to be named explicitly —
    // sending undefined would just omit the key and keep the old value.
    const unset: string[] = [];
    if (doc) {
      const cleared = <K extends keyof typeof payload>(key: K) =>
        payload[key] === undefined;
      for (const field of [
        "subtitle",
        "body",
        "badge",
        "coverImageId",
        "coverImagePath",
        "coverImageAlt",
        "startDate",
        "endDate",
        "dateLabel",
        "location",
        "featureRank",
        "scheduledFor",
        "seo",
        "linkedinUrl",
        "websiteUrl",
        "websiteLabel",
      ] as const) {
        if (cleared(field)) unset.push(field);
      }
    }

    let saved: Id<"content"> | undefined;
    try {
      saved = doc
        ? await update({ id: doc._id, patch: payload, unset })
        : await create(payload);
      toast.success(doc ? "Saved" : "Created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
      setIsSaving(false);
      return;
    }

    // Deliberately after the success toast and outside the save try/catch: a
    // revalidation failure used to surface as "could not save" on content that
    // had in fact been created, so editors retried and produced duplicates.
    try {
      await revalidateContent([
        ...(doc ? [contentHref(doc.type, doc.slug)] : []),
        ...(data.slug ? [contentHref(data.type, data.slug)] : []),
        "/events",
        "/workshops",
        "/certifications",
        "/programs",
        "/news",
        "/",
      ]);
    } catch {
      toast.info("Saved, but the public page may take a few minutes to update.");
    }

    setIsSaving(false);
    if (!doc) router.push(`/dashboard/content/${saved}`);
    else router.refresh();
  }

  // Registrations only exist once the item is saved and can be signed up for.
  const registrable =
    Boolean(doc) &&
    (values.type === "event" ||
      values.type === "program" ||
      values.type === "workshop");

  const error = (key: string) =>
    errors[key] ? (
      <p className="text-xs text-destructive">{errors[key]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit}>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/dashboard/content" aria-label="Back to content">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl tracking-tight">
              {doc ? "Edit content" : "New content"}
            </h1>
            {doc ? (
              <p className="font-mono text-xs text-muted-foreground">
                /{doc.slug}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {doc?.status === "published" ? (
            <Button asChild variant="outline" size="sm">
              <Link href={contentHref(doc.type, doc.slug)} target="_blank">
                <Eye className="size-4" />
                View
              </Link>
            </Button>
          ) : null}
          <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" type="button">
                <Wand2 className="size-4 mr-2" />
                Auto-fill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Auto-fill with AI</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Paste a LinkedIn post URL or raw text here. Gemini will analyze it and automatically populate the content fields.
                </p>
                <Textarea
                  placeholder="Paste URL or raw text..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="resize-none overflow-y-auto bg-background"
                  style={{ height: "200px", minHeight: "200px", maxHeight: "200px", fieldSizing: "fixed" } as any}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAiDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAiGenerate} disabled={isAiLoading}>
                  {isAiLoading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Wand2 className="size-4 mr-2" />}
                  Generate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {doc ? "Save changes" : "Create"}
          </Button>
        </div>
      </header>

      <Tabs defaultValue="content">
        <TabsList className="mb-6">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="details">
            {CONTENT_TYPE_LABELS[values.type]} fields
          </TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          {registrable ? (
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
          ) : null}
        </TabsList>

        {/* ---------------------------------------------------------------- */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={values.type}
                onValueChange={(v) => {
                  const type = v as ContentType;
                  // Switching type invalidates the details payload, so reset it
                  // to that type's defaults rather than leaving a mismatch the
                  // server would reject.
                  setValues((c) => ({
                    ...c,
                    type,
                    details: defaultDetailsFor(type),
                  }));
                }}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {CONTENT_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={values.status}
                onValueChange={(v) => set("status", v as ContentStatus)}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={values.order}
                onChange={(e) =>
                  set("order", e.target.value === "" ? 0 : Number(e.target.value))
                }
              />
              {error("order")}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
            />
            {error("title")}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={values.slug ?? ""}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="Generated from the title if left blank"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Input
                id="badge"
                value={values.badge ?? ""}
                onChange={(e) => set("badge", e.target.value)}
                placeholder="Registrations Open"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              rows={3}
              value={values.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              One or two sentences that answer &ldquo;what is this?&rdquo;
              outright. Used as the lead paragraph, the search-result
              description, the card text, and the llms.txt entry — so write it
              to stand alone.
            </p>
            {error("summary")}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={values.subtitle ?? ""}
              onChange={(e) => set("subtitle", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                type="date"
                value={values.startDate ?? ""}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>
              <Input
                id="endDate"
                type="date"
                value={values.endDate ?? ""}
                onChange={(e) => set("endDate", e.target.value)}
              />
              {error("endDate")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={values.location ?? ""}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
          </div>

          {values.status === "scheduled" ? (
            <div className="space-y-2 rounded-lg border border-gold/30 bg-gold/5 p-4">
              <Label htmlFor="scheduledFor">Publish at</Label>
              <Input
                id="scheduledFor"
                type="datetime-local"
                className="max-w-xs"
                value={values.scheduledFor ?? ""}
                onChange={(e) => set("scheduledFor", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Goes live automatically within 15 minutes of this time. Uses
                your local timezone.
              </p>
              {error("scheduledFor")}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="dateLabel">Date label</Label>
            <Input
              id="dateLabel"
              value={values.dateLabel ?? ""}
              onChange={(e) => set("dateLabel", e.target.value)}
              placeholder="27 April 2026 – 16 May 2026"
            />
            <p className="text-xs text-muted-foreground">
              Overrides the formatted dates on the page. Use it for ranges that
              don&apos;t read well automatically.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                value={values.linkedinUrl ?? ""}
                onChange={(e) => set("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/posts/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Custom Website URL</Label>
              <Input
                id="websiteUrl"
                value={values.websiteUrl ?? ""}
                onChange={(e) => set("websiteUrl", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteLabel">Website Button Label</Label>
              <Input
                id="websiteLabel"
                value={values.websiteLabel ?? ""}
                onChange={(e) => set("websiteLabel", e.target.value)}
                placeholder="e.g. Read Report"
              />
            </div>
          </div>

          <CoverImageField
            storageId={values.coverImageId}
            path={values.coverImagePath}
            alt={values.coverImageAlt}
            existingUrl={coverImageUrl}
            onChange={(next) =>
              setValues((c) => ({
                ...c,
                coverImageId: next.storageId,
                coverImageAlt: next.alt ?? c.coverImageAlt,
              }))
            }
            onAltChange={(alt) => set("coverImageAlt", alt)}
            error={errors["coverImageAlt"]}
          />

          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write">
                <Textarea
                  id="body"
                  rows={14}
                  value={values.body ?? ""}
                  onChange={(e) => set("body", e.target.value)}
                  className="font-mono text-sm"
                  placeholder="Markdown. **bold**, ## headings, - lists, [links](https://...)"
                />
              </TabsContent>
              <TabsContent value="preview">
                <div className="min-h-40 rounded-md border border-border p-4">
                  {values.body ? (
                    <Markdown>{values.body}</Markdown>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nothing to preview yet.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Switch
                id="featured"
                checked={values.featured}
                onCheckedChange={(checked) => set("featured", checked)}
              />
              <Label htmlFor="featured">Feature on the homepage</Label>
            </div>
            {values.featured ? (
              <div className="flex items-center gap-2">
                <Label htmlFor="featureRank" className="text-sm">
                  Rank
                </Label>
                <Input
                  id="featureRank"
                  type="number"
                  min={0}
                  className="w-20"
                  value={values.featureRank ?? 0}
                  onChange={(e) =>
                    set(
                      "featureRank",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                />
                {error("featureRank")}
              </div>
            ) : null}
          </div>

          <StringListField
            label="Tags"
            value={values.tags ?? []}
            onChange={(v) => set("tags", v)}
            placeholder="Add a tag"
          />
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        <TabsContent value="details">
          <DetailsFields
            details={values.details}
            onChange={(details) => set("details", details)}
          />
          {error("details")}
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        <TabsContent value="blocks" className="space-y-8">
          <RepeatableField<FactValue>
            label="Key facts"
            description="The icon tiles shown near the top of the page."
            value={values.facts ?? []}
            onChange={(v) => set("facts", v)}
            makeEmpty={() => ({ label: "", value: "" })}
            rowLabel={(fact) => fact.label || "Fact"}
            addLabel="Add fact"
            renderRow={(fact, update) => (
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  value={fact.icon ?? ""}
                  onChange={(e) => update({ icon: e.target.value })}
                  placeholder="Icon (Calendar, Clock, Users...)"
                />
                <Input
                  value={fact.label}
                  onChange={(e) => update({ label: e.target.value })}
                  placeholder="Label"
                />
                <Input
                  value={fact.value}
                  onChange={(e) => update({ value: e.target.value })}
                  placeholder="Value"
                />
              </div>
            )}
          />

          <RepeatableField<CtaValue>
            label="Call-to-action buttons"
            value={values.ctas ?? []}
            onChange={(v) => set("ctas", v)}
            makeEmpty={() => ({ label: "", href: "" })}
            rowLabel={(cta) => cta.label || "Button"}
            addLabel="Add button"
            renderRow={(cta, update) => (
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  value={cta.label}
                  onChange={(e) => update({ label: e.target.value })}
                  placeholder="Register Now"
                />
                <Input
                  value={cta.href}
                  onChange={(e) => update({ href: e.target.value })}
                  placeholder="https://..."
                />
                <Select
                  value={cta.variant ?? "primary"}
                  onValueChange={(v) =>
                    update({ variant: v as "primary" | "secondary" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <RepeatableField<PartnerValue>
            label="Partners"
            description="Pick from the shared organisation library, or add a new one. The logo lives with the organisation, so replacing it updates every page."
            value={values.partners ?? []}
            onChange={(v) => set("partners", v)}
            makeEmpty={() => ({ name: "" })}
            rowLabel={(partner) => partner.name || "Partner"}
            addLabel="Add partner"
            renderRow={(partner, update) => (
              <div className="space-y-3">
                <OrganizationPicker
                  value={partner.organizationId}
                  onChange={(organizationId, name) =>
                    // The name is denormalised so a row still reads sensibly
                    // if the organisation is later removed.
                    update({ organizationId, name: name || partner.name })
                  }
                />
                <div className="space-y-2">
                  <Label>Role on this page</Label>
                  <Input
                    value={partner.role ?? ""}
                    onChange={(e) => update({ role: e.target.value })}
                    placeholder="Knowledge Partner"
                  />
                </div>
                <Textarea
                  rows={2}
                  value={partner.note ?? ""}
                  onChange={(e) => update({ note: e.target.value })}
                  placeholder="Sentence describing the partnership (optional)"
                />
              </div>
            )}
          />

          <RepeatableField<FaqValue>
            label="FAQs"
            description="Rendered on the page and emitted as FAQPage structured data — this is what gets quoted by AI answer engines, so answer plainly and completely."
            value={values.faqs ?? []}
            onChange={(v) => set("faqs", v)}
            makeEmpty={() => ({ question: "", answer: "" })}
            rowLabel={(faq) => faq.question || "Question"}
            addLabel="Add FAQ"
            renderRow={(faq, update) => (
              <div className="space-y-3">
                <Input
                  value={faq.question}
                  onChange={(e) => update({ question: e.target.value })}
                  placeholder="Who can join?"
                />
                <Textarea
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => update({ answer: e.target.value })}
                  placeholder="A complete answer that makes sense on its own."
                />
              </div>
            )}
          />
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        <TabsContent value="seo" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta title</Label>
            <Input
              id="metaTitle"
              value={values.metaTitle ?? ""}
              onChange={(e) => set("metaTitle", e.target.value)}
              placeholder={values.title || "Defaults to the title"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta description</Label>
            <Textarea
              id="metaDescription"
              rows={2}
              value={values.metaDescription ?? ""}
              onChange={(e) => set("metaDescription", e.target.value)}
              placeholder="Defaults to the summary"
            />
          </div>
          <StringListField
            label="Keywords"
            value={values.keywords ?? []}
            onChange={(v) => set("keywords", v)}
            placeholder="Add a keyword"
          />
          <div className="space-y-2">
            <Label htmlFor="canonicalUrl">Canonical URL override</Label>
            <Input
              id="canonicalUrl"
              value={values.canonicalUrl ?? ""}
              onChange={(e) => set("canonicalUrl", e.target.value)}
              placeholder="Only for syndicated content published elsewhere first"
            />
            {error("canonicalUrl")}
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            <Switch
              id="noindex"
              checked={values.noindex ?? false}
              onCheckedChange={(checked) => set("noindex", checked)}
            />
            <div>
              <Label htmlFor="noindex">Hide from search engines</Label>
              <p className="text-xs text-muted-foreground">
                Excludes the page from the sitemap and adds a noindex tag.
              </p>
            </div>
          </div>
        </TabsContent>
        {registrable ? (
          <TabsContent value="registrations">
            <ContentRegistrations contentId={doc!._id} />
          </TabsContent>
        ) : null}
      </Tabs>
    </form>
  );
}
