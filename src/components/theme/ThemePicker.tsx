"use client";

import { Check } from "lucide-react";
import { COLORWAYS } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";

export function ThemePicker() {
  const { colorway, setTheme } = useTheme();

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {COLORWAYS.map((c) => {
        const active = colorway === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => setTheme(c.id)}
            aria-pressed={active}
            className={`flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-left transition-colors ${
              active
                ? "border-accent bg-raised"
                : "border-edge bg-surface hover:border-muted"
            }`}
          >
            <span className="min-w-0">
              <span className="block text-sm font-medium text-ink">{c.name}</span>
              <span className="mt-0.5 block text-xs text-muted">
                {c.descriptions.dark}
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                {c.descriptions.light}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="flex flex-col gap-1" aria-hidden>
                {(["dark", "light"] as const).map((mode) => (
                  <span key={mode} className="flex gap-1">
                    {c.swatches[mode].slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="h-3 w-3 rounded-[2px] border border-edge/60"
                        style={{ background: s }}
                      />
                    ))}
                  </span>
                ))}
              </span>
              {active && (
                <Check className="h-4 w-4 text-accent" strokeWidth={3} aria-hidden />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
