"use client";

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
import { StringListField } from "@/components/admin/string-list-field";
import type { ContentFormValues } from "@/lib/validators/content";

type Details = ContentFormValues["details"];

/**
 * The per-type half of the editor. One component with a switch rather than five
 * files, because the shared shape (lifecycle + mode + a couple of lists) is
 * most of it — splitting would duplicate more than it separates.
 */
export function DetailsFields({
  details,
  onChange,
}: {
  details: Details;
  onChange: (next: Details) => void;
}) {
  const patch = (values: Record<string, unknown>) =>
    onChange({ ...details, ...values } as Details);

  const lifecycleAndMode =
    "lifecycle" in details ? (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lifecycle">Lifecycle</Label>
          <Select
            value={details.lifecycle}
            onValueChange={(v) => patch({ lifecycle: v })}
          >
            <SelectTrigger id="lifecycle" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mode">Delivery mode</Label>
          <Select value={details.mode} onValueChange={(v) => patch({ mode: v })}>
            <SelectTrigger id="mode" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="in_person">In person</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    ) : null;

  switch (details.kind) {
    case "event":
      return (
        <div className="space-y-5">
          {lifecycleAndMode}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={details.venue ?? ""}
                onChange={(e) => patch({ venue: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceLabel">Price</Label>
              <Input
                id="priceLabel"
                value={details.priceLabel ?? ""}
                onChange={(e) => patch({ priceLabel: e.target.value })}
                placeholder="Free of charge"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationUrl">Registration link</Label>
            <Input
              id="registrationUrl"
              value={details.registrationUrl ?? ""}
              onChange={(e) => patch({ registrationUrl: e.target.value })}
            />
          </div>
        </div>
      );

    case "workshop":
      return (
        <div className="space-y-5">
          {lifecycleAndMode}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="durationLabel">Duration</Label>
              <Input
                id="durationLabel"
                value={details.durationLabel ?? ""}
                onChange={(e) => patch({ durationLabel: e.target.value })}
                placeholder="3 hours"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={details.level ?? ""}
                onValueChange={(v) => patch({ level: v })}
              >
                <SelectTrigger id="level" className="w-full">
                  <SelectValue placeholder="Not specified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <StringListField
            label="What you'll learn"
            value={details.learningOutcomes ?? []}
            onChange={(v) => patch({ learningOutcomes: v })}
            placeholder="Add an outcome"
          />
          <StringListField
            label="Prerequisites"
            value={details.prerequisites ?? []}
            onChange={(v) => patch({ prerequisites: v })}
            placeholder="Add a prerequisite"
          />
          <div className="space-y-2">
            <Label htmlFor="registrationUrl">Registration link</Label>
            <Input
              id="registrationUrl"
              value={details.registrationUrl ?? ""}
              onChange={(e) => patch({ registrationUrl: e.target.value })}
            />
          </div>
        </div>
      );

    case "certification":
      return (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="enrollmentStatus">Enrolment status</Label>
              <Select
                value={details.enrollmentStatus}
                onValueChange={(v) => patch({ enrollmentStatus: v })}
              >
                <SelectTrigger id="enrollmentStatus" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="coming_soon">Coming soon</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={details.level ?? ""}
                onValueChange={(v) => patch({ level: v })}
              >
                <SelectTrigger id="level" className="w-full">
                  <SelectValue placeholder="Not specified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="durationLabel">Duration</Label>
              <Input
                id="durationLabel"
                value={details.durationLabel ?? ""}
                onChange={(e) => patch({ durationLabel: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeLabel">Fee</Label>
              <Input
                id="feeLabel"
                value={details.feeLabel ?? ""}
                onChange={(e) => patch({ feeLabel: e.target.value })}
              />
            </div>
          </div>
          <StringListField
            label="What you'll learn"
            value={details.learningOutcomes ?? []}
            onChange={(v) => patch({ learningOutcomes: v })}
            placeholder="Add an outcome"
          />
          <StringListField
            label="Prerequisites"
            value={details.prerequisites ?? []}
            onChange={(v) => patch({ prerequisites: v })}
            placeholder="Add a prerequisite"
          />
          <div className="space-y-2">
            <Label htmlFor="assessment">Assessment</Label>
            <Textarea
              id="assessment"
              rows={2}
              value={details.assessment ?? ""}
              onChange={(e) => patch({ assessment: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="credentialAwarded">Credential awarded</Label>
              <Input
                id="credentialAwarded"
                value={details.credentialAwarded ?? ""}
                onChange={(e) => patch({ credentialAwarded: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentUrl">Enrolment link</Label>
              <Input
                id="enrollmentUrl"
                value={details.enrollmentUrl ?? ""}
                onChange={(e) => patch({ enrollmentUrl: e.target.value })}
              />
            </div>
          </div>
        </div>
      );

    case "program":
      return (
        <div className="space-y-5">
          {lifecycleAndMode}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="edition">Edition</Label>
              <Input
                id="edition"
                value={details.edition ?? ""}
                onChange={(e) => patch({ edition: e.target.value })}
                placeholder="Third edition"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commitmentLabel">Commitment</Label>
              <Input
                id="commitmentLabel"
                value={details.commitmentLabel ?? ""}
                onChange={(e) => patch({ commitmentLabel: e.target.value })}
                placeholder="~2 hours/day"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeLabel">Fee</Label>
              <Input
                id="feeLabel"
                value={details.feeLabel ?? ""}
                onChange={(e) => patch({ feeLabel: e.target.value })}
                placeholder="Free of charge"
              />
            </div>
          </div>
          <StringListField
            label="Program highlights"
            value={details.highlights ?? []}
            onChange={(v) => patch({ highlights: v })}
            placeholder="Add a highlight"
          />
          <StringListField
            label="Course coverage"
            value={details.coverage ?? []}
            onChange={(v) => patch({ coverage: v })}
            placeholder="Add a topic"
          />
          <StringListField
            label="Eligibility"
            value={details.eligibility ?? []}
            onChange={(v) => patch({ eligibility: v })}
            placeholder="Add a criterion"
          />
          <div className="space-y-2">
            <Label htmlFor="registrationUrl">Registration link</Label>
            <Input
              id="registrationUrl"
              value={details.registrationUrl ?? ""}
              onChange={(e) => patch({ registrationUrl: e.target.value })}
            />
          </div>
        </div>
      );

    case "news":
      return (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="authorName">Author</Label>
            <Input
              id="authorName"
              value={details.authorName ?? ""}
              onChange={(e) => patch({ authorName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sourceName">Source name</Label>
            <Input
              id="sourceName"
              value={details.sourceName ?? ""}
              onChange={(e) => patch({ sourceName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sourceUrl">Source link</Label>
            <Input
              id="sourceUrl"
              value={details.sourceUrl ?? ""}
              onChange={(e) => patch({ sourceUrl: e.target.value })}
            />
          </div>
        </div>
      );
  }
}
