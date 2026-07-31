"use client";

import { Check, Moon, Sun } from "lucide-react";
import { COLORWAYS, colorwayOf, type ThemeMode } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";

export function ThemePicker({ compact = false }: { compact?: boolean }) {
  const { theme, mode, setTheme, setMode } = useTheme();
  const colorway = colorwayOf(theme);

  if (compact) {
    return (
      <div className="flex items-center gap-1 rounded-full border border-edge bg-raised p-1">
        {COLORWAYS.map((c) => {
          const active = c.id === colorway;
          return (
            <button
              key={c.id}
              type="button"
              title={`${c.name} theme`}
              aria-label={`${c.name} theme`}
              aria-pressed={active}
              onClick={() => setTheme(c.id)}
              className="flex h-6 w-6 items-center justify-center rounded-full transition-transform hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${c.swatches[mode][1]}, ${c.swatches[mode][2]})`,
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
        <span className="mx-0.5 h-4 w-px bg-edge" aria-hidden />
        <button
          type="button"
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={
            mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:text-accent"
        >
          {mode === "dark" ? (
            <Sun className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Moon className="h-3.5 w-3.5" aria-hidden />
          )}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-center">
        <ModeControl mode={mode} onMode={setMode} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {COLORWAYS.map((c) => {
          const active = c.id === colorway;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setTheme(c.id)}
              aria-pressed={active}
              className={`group rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 ${
                active
                  ? "border-accent bg-raised"
                  : "border-edge bg-surface hover:border-muted"
              }`}
            >
              <div className="mb-3 flex gap-1.5" aria-hidden>
                {c.swatches[mode].map((s, i) => (
                  <span
                    key={i}
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ background: s }}
                  />
                ))}
              </div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-ink">{c.name}</span>
                {active && (
                  <Check
                    className="h-3.5 w-3.5 text-accent"
                    strokeWidth={3}
                    aria-hidden
                  />
                )}
              </div>
              <p className="text-xs text-muted">{c.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ModeControl({
  mode,
  onMode,
}: {
  mode: ThemeMode;
  onMode: (mode: ThemeMode) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-edge/70 bg-surface p-1 text-xs font-medium">
      {(["dark", "light"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onMode(m)}
          aria-pressed={mode === m}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
            mode === m
              ? "bg-raised text-ink shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          {m === "dark" ? (
            <Moon className="h-3 w-3" aria-hidden />
          ) : (
            <Sun className="h-3 w-3" aria-hidden />
          )}
          {m === "dark" ? "Dark" : "Light"}
        </button>
      ))}
    </div>
  );
}
