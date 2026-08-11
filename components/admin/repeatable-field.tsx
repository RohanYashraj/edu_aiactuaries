"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/**
 * Editor for an array of objects — facts, CTAs, partners, FAQs, agenda slots,
 * modules. The caller renders one row's fields; this owns add/remove/reorder.
 *
 * Every per-type sub-form is built out of this and StringListField, which is
 * why they're the first thing in the admin build.
 */
export function RepeatableField<T>({
  label,
  description,
  value,
  onChange,
  makeEmpty,
  renderRow,
  rowLabel,
  addLabel = "Add",
}: {
  label: string;
  description?: string;
  value: T[];
  onChange: (next: T[]) => void;
  makeEmpty: () => T;
  renderRow: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  rowLabel?: (item: T, index: number) => string;
  addLabel?: string;
}) {
  function update(index: number, patch: Partial<T>) {
    onChange(
      value.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>{label}</Label>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {value.map((item, index) => (
        <div
          key={index}
          className="space-y-3 rounded-lg border border-border p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {rowLabel?.(item, index) ?? `${label} ${index + 1}`}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                aria-label="Move up"
              >
                <ChevronUp className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => move(index, index + 1)}
                disabled={index === value.length - 1}
                aria-label="Move down"
              >
                <ChevronDown className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                aria-label="Remove"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>
          {renderRow(item, (patch) => update(index, patch), index)}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, makeEmpty()])}
      >
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  );
}
