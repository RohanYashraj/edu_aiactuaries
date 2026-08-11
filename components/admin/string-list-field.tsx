"use client";

import { useState } from "react";
import { GripVertical, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Editor for a plain string array — highlights, eligibility, course coverage,
 * learning outcomes, tags, keywords. These appear on nearly every content type,
 * which is why it's a primitive rather than inline markup.
 */
export function StringListField({
  label,
  description,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  placeholder?: string;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}

      {value.length > 0 ? (
        <ul className="space-y-2">
          {value.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2"
            >
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                className="text-muted-foreground disabled:opacity-30"
                aria-label={`Move "${item}" up`}
              >
                <GripVertical className="size-4" />
              </button>
              <span className="flex-1 text-sm">{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                aria-label={`Remove "${item}"`}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            // Enter would otherwise submit the whole content form.
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>
    </div>
  );
}
