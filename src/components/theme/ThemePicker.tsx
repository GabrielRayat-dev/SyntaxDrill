"use client";

import { THEMES } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";
import { Check } from "lucide-react";

export function ThemePicker({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    return (
      <div className="flex items-center gap-1 rounded-full border border-edge bg-raised p-1">
        {THEMES.map((t) => {
          const active = t.id === theme;
          return (
            <button
              key={t.id}
              type="button"
              title={`${t.name} theme`}
              aria-label={`${t.name} theme`}
              aria-pressed={active}
              onClick={() => setTheme(t.id)}
              className="flex h-6 w-6 items-center justify-center rounded-full transition-transform hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${t.swatches[1]}, ${t.swatches[2]})`,
                boxShadow: active
                  ? `0 0 0 2px var(--sd-bg), 0 0 0 4px var(--sd-accent)`
                  : undefined,
              }}
            >
              {active && (
                <Check
                  className="h-3 w-3 text-page"
                  strokeWidth={3}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {THEMES.map((t) => {
        const active = t.id === theme;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            aria-pressed={active}
            className={`group rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 ${
              active
                ? "border-accent bg-raised"
                : "border-edge bg-surface hover:border-muted"
            }`}
          >
            <div className="mb-3 flex gap-1.5" aria-hidden>
              {t.swatches.map((s, i) => (
                <span
                  key={i}
                  className="h-4 w-4 rounded-full border border-white/10"
                  style={{ background: s }}
                />
              ))}
            </div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-ink">{t.name}</span>
              {active && (
                <Check
                  className="h-3.5 w-3.5 text-accent"
                  strokeWidth={3}
                  aria-hidden
                />
              )}
            </div>
            <p className="text-xs text-muted">{t.description}</p>
          </button>
        );
      })}
    </div>
  );
}
