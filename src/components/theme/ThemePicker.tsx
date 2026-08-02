"use client";

import { Check } from "lucide-react";
import {
  COLORWAYS,
  themeId,
  type ThemeId,
  type ThemeMode,
} from "@/lib/themes";
import { useTheme } from "./ThemeProvider";

const VARIANTS: ThemeMode[] = ["light", "dark"];

export function ThemePicker() {
  const { theme, setVariant } = useTheme();

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {COLORWAYS.flatMap((c) =>
        VARIANTS.map((mode) => {
          const id: ThemeId = themeId(c.id, mode);
          const active = theme === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setVariant(id)}
              aria-pressed={active}
              className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                active
                  ? "border-accent bg-raised"
                  : "border-edge bg-surface hover:border-muted"
              }`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">
                  {c.name}, {mode}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {c.descriptions[mode]}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="flex gap-1" aria-hidden>
                  {c.swatches[mode].slice(0, 3).map((s, i) => (
                    <span
                      key={i}
                      className="h-3.5 w-3.5 rounded-[2px] border border-edge/60"
                      style={{ background: s }}
                    />
                  ))}
                </span>
                {active && (
                  <Check
                    className="h-4 w-4 text-accent"
                    strokeWidth={3}
                    aria-hidden
                  />
                )}
              </span>
            </button>
          );
        }),
      )}
    </div>
  );
}
