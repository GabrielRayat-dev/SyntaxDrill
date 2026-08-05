# Signal Themes + Redesign Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the uncommitted Codex "Signal Dark" redesign on `Re-design-v2` into a shippable state: restore the theme system (Signal/Graphite colorways x light/dark, default dark) with the app following the saved theme while landing/sign-in stay dark, finish the signal design across every app surface, rebuild the Progress page around bars, and fix the landing/review defects.

**Architecture:** Refactor the existing theme plumbing in place (`ThemeProvider` / `lib/themes.ts` / `lib/localStore` stay; only the data model + CSS palettes change — no new dependency). Restyle existing components to the signal vocabulary (`signal-cta`, `signal-kicker`, hairline rows, mono numerals) rather than adding new UI. Progress page rebuilt from the same data (`StatRecord` list) into bar-based visualizations inside existing component files.

**Tech Stack:** Next.js (this repo's custom version — read `node_modules/next/dist/docs/` before writing Next code), React 19, Tailwind CSS v4 (`@tailwindcss/postcss`, `@theme inline`), TypeScript, Drizzle, NextAuth, Prism, Lucide.

## Global Constraints

- **No automated test runner exists.** package.json scripts are `dev`, `build`, `start`, `lint` only. The per-task "test cycle" is therefore: `npx tsc --noEmit` → PASS, then `npm run lint` → PASS, then commit. A full `npm run build` gate runs in Task 1 (baseline) and Task 17 (final).
- **Shell is Windows PowerShell 5.1.** No `&&`. Chain with `cmd1; if ($?) { cmd2 }`. Quote paths containing spaces AND parentheses with double quotes. Prefer the provided file tools (Read/Edit/Write) over shell for file changes.
- **`.superpowers/` is an untracked internal ledger — never `git add` it.** Commit only the source files named in each task.
- The Codex redesign (13 modified files, currently uncommitted) MUST be committed as a baseline (Task 1) before any further change, and the gates must pass on it first.
- No new dependencies. Do not remove the theme system. Do not restructure `lib/themes.ts` exports that other modules consume (`COLORWAYS`, `DEFAULT_THEME`, `themeId`, `colorwayOf`, `modeOf`, `isThemeId`, `migrateTheme`, `ColorwayId`, `ThemeId`, `ThemeMode`).
- Landing page and sign-in remain fixed dark `signal`. Only the app workspace (`/app`, `/practice`, `/speed`, `/progress`, `/settings`) is user-themed.
- Snippet content and `content/` are untouched. Runner, DB/schema/API, `src/lib/config.ts` untouched.
- All new motion (bar fills/widths) uses only transform/opacity or width/height transitions; no autoplay or parallax. Respect the existing `prefers-reduced-motion` CSS.
- Light-mode body text must clear WCAG AA (4.5:1). The light accents chosen (`#4658d0` on `#f4f6fa`/`#f2f3f5`) do.
- Work is on branch `Re-design-v2` (currently equal to `origin/main` at `22d254e` plus the uncommitted redesign + committed spec `d6f8e36`). All tasks commit on this branch.

---

### Task 1: Baseline Commit — Commit the Codex Redesign and Confirm Gates

**Files:**
- Modify: all 13 currently-modified files (they are already correct as the redesign baseline)
- Verify: `npx tsc --noEmit`, `npm run lint`, `npm run build`

**Interfaces:**
- Consumes: nothing (working tree already holds the redesign).
- Produces: a committed baseline so later tasks produce reviewable diffs. No signature changes.

- [ ] **Step 1: Verify the redesign baseline compiles**

Run: `npx tsc --noEmit`
Expected: PASS (exit 0, no output).

- [ ] **Step 2: Run the linter on the baseline**

Run: `npm run lint`
Expected: PASS (exit 0).

- [ ] **Step 3: Run a production build**

Run: `npm run build`
Expected: PASS, 11 routes compiled.

- [ ] **Step 4: Confirm the working tree is exactly the 13 redesign files**

Run: `git status --short`
Expected: 13 `M` entries under `src/` (app, layout, practice, progress, settings x2, speed, globals.css, page.tsx, signin x2, AppHeader). No `.superpowers/` entries. The spec commit `d6f8e36` should already exist in the log.

- [ ] **Step 5: Stage only the 13 modified files**

Run: `git add -u`
(Stages modified tracked files; `.superpowers/` is untracked so it is not staged.)

- [ ] **Step 6: Commit the baseline**

Run: `git commit -m "feat(redesign): codex signal dark redesign baseline"`
Expected: commit created. Do NOT include the spec (already committed as `d6f8e36`).

---

### Task 2: Re-model the Theme Data Model (`src/lib/themes.ts`)

**Files:**
- Modify: `src/lib/themes.ts`

**Interfaces:**
- Consumes: nothing external.
- Produces: `ColorwayId = "signal" | "graphite"`; `ThemeId = ColorwayId | ${ColorwayId}-light` (i.e. `signal`, `signal-light`, `graphite`, `graphite-light`); `COLORWAYS: Colorway[]` (Signal + Graphite, each with `descriptions: Record<ThemeMode,string>` and `swatches: Record<ThemeMode,string[]>`); `DEFAULT_THEME: ThemeId = "signal"`; extended `LEGACY_THEMES`. `themeId`, `colorwayOf`, `modeOf`, `isThemeId`, `migrateTheme` are **unchanged** — Task 6 consumes `COLORWAYS` and the `ThemeMode` type; `ThemeProvider.tsx` (unchanged) consumes the rest.

- [ ] **Step 1: Replace the type, colorway, and legacy-map definitions**

Edit `src/lib/themes.ts` so that:
- Line 3 becomes `export type ColorwayId = "signal" | "graphite";`
- The `COLORWAYS` array (lines 15-55) is replaced with:

```ts
export const COLORWAYS: Colorway[] = [
  {
    id: "signal",
    name: "Signal",
    descriptions: {
      dark: "Blue-black surfaces, soft cobalt.",
      light: "Cool paper-white, cobalt ink.",
    },
    swatches: {
      dark: ["#090b10", "#8fa6ff", "#8fd7b1", "#f28d97", "#f1f4f8"],
      light: ["#f4f6fa", "#4658d0", "#1f7a4f", "#c03a48", "#141821"],
    },
  },
  {
    id: "graphite",
    name: "Graphite",
    descriptions: {
      dark: "Neutral graphite, one cobalt accent.",
      light: "Cool neutral paper, graphite ink.",
    },
    swatches: {
      dark: ["#0a0c0f", "#8fa6ff", "#8fd7b1", "#f28d97", "#eef0f3"],
      light: ["#f2f3f5", "#4658d0", "#1f7a4f", "#c03a48", "#16181c"],
    },
  },
];
```

- [ ] **Step 2: Replace `LEGACY_THEMES` (lines 62-71) and `DEFAULT_THEME` (line 73)**

```ts
const LEGACY_THEMES: Record<string, ThemeId> = {
  night: "signal",
  "tokyo-night": "signal",
  "rose-pine": "signal",
  dracula: "signal",
  sunset: "signal",
  paper: "signal",
  pencil: "signal",
  "paper-light": "signal-light",
  "pencil-light": "signal-light",
  "tokyo-night-light": "signal-light",
  "rose-pine-light": "signal-light",
  "dracula-light": "signal-light",
  "sunset-light": "signal-light",
};

export const DEFAULT_THEME: ThemeId = "signal";
```

- [ ] **Step 3: Update the stale doc comment above `LEGACY_THEMES`**

Replace the comment on lines 57-61 with:

```ts
/**
 * Legacy colorway ids from the pre-Drillbook system. Dark variants map to
 * signal (dark); light variants map to signal-light, preserving the user's
 * mode preference.
 */
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS. (`ThemeProvider.tsx` is generic over these types and must still compile unchanged.)

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 6: Commit**

Run: `git add src/lib/themes.ts; git commit -m "feat(themes): signal + graphite colorways, dark/light modes"`
(Note: PowerShell, so use `;`, then confirm the commit.)

---

### Task 3: Update the Inline Theme Script (`src/app/layout.tsx`)

**Files:**
- Modify: `src/app/layout.tsx:40-46`

**Interfaces:**
- Consumes: the new theme ids from Task 2 (`signal`, `signal-light` targets).
- Produces: `themeScript()` that sets a valid `data-theme` before hydration and migrates every legacy stored id. Must match `LEGACY_THEMES` in `themes.ts`.

- [ ] **Step 1: Replace the comment + `LEGACY_THEMES` const**

Replace lines 40-42:

```ts
const LEGACY_THEMES = `{"night":"signal","tokyo-night":"signal","rose-pine":"signal","dracula":"signal","sunset":"signal","paper":"signal","pencil":"signal","paper-light":"signal-light","pencil-light":"signal-light","tokyo-night-light":"signal-light","rose-pine-light":"signal-light","dracula-light":"signal-light","sunset-light":"signal-light"}`;
```

- [ ] **Step 2: Replace the `themeScript()` function (lines 44-46)**

```ts
function themeScript() {
  return `try{var map=${LEGACY_THEMES},t=localStorage.getItem("sd.theme"),s;if(t){s=map[t]||t}else{s="signal"}document.documentElement.dataset.theme=s}catch(e){document.documentElement.dataset.theme="signal"}`;
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 4: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 5: Commit**

Run: `git add src/app/layout.tsx; git commit -m "feat(themes): migrate legacy theme ids to signal in theme script"`

---

### Task 4: Replace CSS Theme Palettes + Tokenize Hardcoded Colors (`src/app/globals.css`)

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: theme ids from Task 2 (`signal`, `signal-light`, `graphite`, `graphite-light`).
- Produces: four full `--sd-*` palettes under `:root` and three `[data-theme]` blocks (plus the new `.signal-input` primitive). The `@theme inline` block (lines 3-19) stays untouched — it already maps colors to `--sd-*` vars, so every Tailwind color class (bg-surface, text-ink, etc.) becomes theme-aware immediately.

- [ ] **Step 1: Replace the theme-preset block (lines 21-127)**

Replace everything from the comment `/*` above `:root,` through the closing brace of `[data-theme="pencil-light"]` (lines 21-127) with:

```css
/*
 * Theme presets — each one swaps these tokens. All UI reads the tokens,
 * never a raw color, so the four themes are real, full-product themes.
 * Default (:root) is Signal, dark.
 */
:root,
[data-theme="signal"] {
  --sd-bg: #090b10;
  --sd-surface: #10141d;
  --sd-raised: #171c27;
  --sd-border: #29303d;
  --sd-text: #f1f4f8;
  --sd-muted: #9aa5b7;
  --sd-accent: #8fa6ff;
  --sd-accent-2: #8fa6ff;
  --sd-correct: #8fd7b1;
  --sd-error: #f28d97;
  --sd-warn: #e7bf78;
  --sd-caret: #8fa6ff;
  --sd-glow: rgba(143, 166, 255, 0.18);
  color-scheme: dark;
}

[data-theme="signal-light"] {
  --sd-bg: #f4f6fa;
  --sd-surface: #ffffff;
  --sd-raised: #eef1f6;
  --sd-border: #d7dce6;
  --sd-text: #141821;
  --sd-muted: #5b6573;
  --sd-accent: #4658d0;
  --sd-accent-2: #4658d0;
  --sd-correct: #1f7a4f;
  --sd-error: #c03a48;
  --sd-warn: #a06c16;
  --sd-caret: #4658d0;
  --sd-glow: rgba(70, 88, 208, 0.16);
  color-scheme: light;
}

[data-theme="graphite"] {
  --sd-bg: #0a0c0f;
  --sd-surface: #101318;
  --sd-raised: #171a20;
  --sd-border: #262a31;
  --sd-text: #eef0f3;
  --sd-muted: #9aa0aa;
  --sd-accent: #8fa6ff;
  --sd-accent-2: #8fa6ff;
  --sd-correct: #8fd7b1;
  --sd-error: #f28d97;
  --sd-warn: #e7bf78;
  --sd-caret: #8fa6ff;
  --sd-glow: rgba(143, 166, 255, 0.18);
  color-scheme: dark;
}

[data-theme="graphite-light"] {
  --sd-bg: #f2f3f5;
  --sd-surface: #ffffff;
  --sd-raised: #eceef1;
  --sd-border: #d4d7dc;
  --sd-text: #16181c;
  --sd-muted: #5c616a;
  --sd-accent: #4658d0;
  --sd-accent-2: #4658d0;
  --sd-correct: #1f7a4f;
  --sd-error: #c03a48;
  --sd-warn: #a06c16;
  --sd-caret: #4658d0;
  --sd-glow: rgba(70, 88, 208, 0.16);
  color-scheme: light;
}
```

- [ ] **Step 2: Make `.signal-cta:hover` text theme-aware (line 152)**

Replace:

```css
.signal-cta:hover { color: #10131d; }
```

with:

```css
.signal-cta:hover { color: var(--sd-bg); }
```

Rationale: on the light themes the hover fill is `#4658d0`, on which `#10131d` fails contrast; `--sd-bg` is near-black on dark (`#090b10`) and near-white on light (`#f4f6fa`) — correct in both.

- [ ] **Step 3: Tokenize `.signal-app-callout` (line 213)**

Replace:

```css
.signal-app-callout { background: radial-gradient(circle at 85% 0%, rgb(122 162 224 / .16), transparent 38%), var(--sd-surface); border-left: 1px solid var(--sd-accent); border-radius: 10px; }
```

with:

```css
.signal-app-callout { background: radial-gradient(circle at 85% 0%, color-mix(in srgb, var(--sd-accent) 16%, transparent), transparent 38%), var(--sd-surface); border-left: 1px solid var(--sd-accent); border-radius: 10px; }
```

- [ ] **Step 4: Add the `.signal-input` primitive and tokenize the auth focus glow (lines 222-223)**

Replace:

```css
.signal-auth-input { background: var(--sd-raised); border: 1px solid var(--sd-border); border-radius: 6px; transition: border-color 180ms ease, background 180ms ease; }
.signal-auth-input:focus { background: color-mix(in srgb, var(--sd-raised) 72%, var(--sd-surface)); border-color: var(--sd-accent); box-shadow: 0 0 0 3px rgb(143 166 255 / .12); }
```

with:

```css
.signal-input,
.signal-auth-input { background: var(--sd-raised); border: 1px solid var(--sd-border); border-radius: 6px; transition: border-color 180ms ease, background 180ms ease; }
.signal-input:focus,
.signal-auth-input:focus { background: color-mix(in srgb, var(--sd-raised) 72%, var(--sd-surface)); border-color: var(--sd-accent); box-shadow: 0 0 0 3px var(--sd-glow); }
```

- [ ] **Step 5: Tokenize the auth submit colors (lines 232-233)**

Replace:

```css
.signal-auth-submit { align-items: center; background: var(--sd-accent); border: 0; clip-path: polygon(0 0, calc(100% - 17px) 0, 100% 17px, 100% 100%, 17px 100%, 0 calc(100% - 17px)); color: #10131d; display: grid; font-size: .86rem; font-weight: 700; grid-template-columns: minmax(0, 1fr) auto auto; min-height: 3.2rem; padding: .75rem 1rem .75rem 1.2rem; text-align: left; transition: background 180ms ease, transform 180ms ease; }
.signal-auth-submit-index { border-left: 1px solid rgb(16 19 29 / .25); font-family: var(--font-jetbrains-mono), monospace; font-size: .65rem; font-weight: 600; margin-left: .9rem; margin-right: .8rem; padding-left: .8rem; }
```

with:

```css
.signal-auth-submit { align-items: center; background: var(--sd-accent); border: 0; clip-path: polygon(0 0, calc(100% - 17px) 0, 100% 17px, 100% 100%, 17px 100%, 0 calc(100% - 17px)); color: var(--sd-bg); display: grid; font-size: .86rem; font-weight: 700; grid-template-columns: minmax(0, 1fr) auto auto; min-height: 3.2rem; padding: .75rem 1rem .75rem 1.2rem; text-align: left; transition: background 180ms ease, transform 180ms ease; }
.signal-auth-submit-index { border-left: 1px solid color-mix(in srgb, var(--sd-bg) 25%, transparent); font-family: var(--font-jetbrains-mono), monospace; font-size: .65rem; font-weight: 600; margin-left: .9rem; margin-right: .8rem; padding-left: .8rem; }
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit` → PASS (CSS does not affect TS; included for discipline).

- [ ] **Step 7: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 8: Commit**

Run: `git add src/app/globals.css; git commit -m "feat(themes): signal/graphite light+dark palettes, tokenize hardcoded colors"`

---

### Task 5: Apply the Theme Bootstrap Across Wrappers

**Files:**
- Modify: `src/app/(app)/layout.tsx:6`, `src/app/page.tsx:36`, `src/app/signin/page.tsx:9`

**Interfaces:**
- Consumes: palette ids from Task 4.
- Produces: app wrapper follows the saved theme (set on `documentElement` by `themeScript`/`ThemeProvider`); landing + sign-in pinned to dark `signal`.

- [ ] **Step 1: Let the app wrapper follow the saved theme**

In `src/app/(app)/layout.tsx`, replace line 6:

```tsx
<div className="signal-app min-h-[100dvh]" data-theme="night">
```

with:

```tsx
<div className="signal-app min-h-[100dvh]">
```

- [ ] **Step 2: Pin the landing page to dark signal**

In `src/app/page.tsx`, replace line 36:

```tsx
<div className="signal-page min-h-[100dvh] overflow-hidden" data-theme="night">
```

with:

```tsx
<div className="signal-page min-h-[100dvh] overflow-hidden" data-theme="signal">
```

- [ ] **Step 3: Pin the sign-in page to dark signal**

In `src/app/signin/page.tsx`, replace line 9:

```tsx
<div className="signal-auth flex min-h-[100dvh] flex-col items-center justify-center px-5 py-12" data-theme="night">
```

with:

```tsx
<div className="signal-auth flex min-h-[100dvh] flex-col items-center justify-center px-5 py-12" data-theme="signal">
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 5: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 6: Commit**

Run: `git add "src/app/(app)/layout.tsx" src/app/page.tsx "src/app/signin/page.tsx"; git commit -m "feat(themes): app follows saved theme, landing/sign-in pinned to dark signal"`
(Quote paths containing parentheses.)

---

### Task 6: Restyle Settings + Restore the Theme Section

**Files:**
- Modify: `src/components/theme/ThemePicker.tsx`
- Modify: `src/components/theme/ModeToggle.tsx`
- Modify: `src/app/(app)/settings/SettingsPanel.tsx`

**Interfaces:**
- Consumes: `COLORWAYS` and `ThemeMode` (Task 2), `.signal-input`/`signal-cta`/`signal-secondary-cta` CSS (Task 4), `useTheme()` from `ThemeProvider` (unchanged — exposes `colorway`, `mode`, `setTheme`, `setMode`).
- Produces: `ThemePicker` (colorway cards) and `ModeToggle` (light/dark segmented control) as reusable components; `SettingsPanel` with hairline sections and a Theme section. Nothing else consumes these — the components become referenced here, fixing the earlier orphan state.

- [ ] **Step 1: Rewrite `ThemePicker.tsx` (colorway cards)**

Replace the entire file body after the imports with:

```tsx
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
```

Keep the existing imports (`"use client"`, `Check` from `lucide-react`, `COLORWAYS` from `@/lib/themes`, `useTheme` from `./ThemeProvider`). Remove the now-unused `themeId`, `ThemeId`, `ThemeMode`, and the `VARIANTS` const.

- [ ] **Step 2: Rewrite `ModeToggle.tsx` (segmented light/dark control)**

Replace the entire file with:

```tsx
"use client";

import { Moon, Sun, type LucideIcon } from "lucide-react";
import type { ThemeMode } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";

const OPTIONS: { id: ThemeMode; label: string; icon: LucideIcon }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
];

export default function ModeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div
      role="group"
      aria-label="Color mode"
      className="inline-flex gap-1 rounded-md border border-edge bg-surface p-1"
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = mode === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setMode(opt.id)}
            aria-pressed={active}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              active ? "bg-raised text-ink" : "text-muted hover:text-ink"
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `SettingsPanel.tsx` (hairline sections + Theme section)**

Replace the entire file with:

```tsx
"use client";

import { useActionState } from "react";
import { signIn, signOut } from "next-auth/react";
import {
  changePassword,
  removePassword,
  setPassword,
  unlinkGithub,
  updateUsername,
} from "./actions";
import { ThemePicker } from "@/components/theme/ThemePicker";
import ModeToggle from "@/components/theme/ModeToggle";

const inputCls =
  "signal-input w-full px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:outline-none";
const labelCls =
  "mb-2 block font-mono text-[10px] font-medium uppercase tracking-widest text-muted";
const sectionTitleCls =
  "mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";
const primaryBtnCls = "signal-cta w-fit";

function Status({ error, ok }: { error?: string; ok?: boolean }) {
  if (error) return <p className="text-xs text-bad">{error}</p>;
  if (ok) return <p className="text-xs text-good">Saved.</p>;
  return null;
}

export default function SettingsPanel({
  userId,
  username,
  name,
  email,
  image,
  hasPassword,
}: {
  userId: string;
  username: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  hasPassword: boolean;
}) {
  const [userState, userAction, userPending] = useActionState(
    updateUsername.bind(null, userId),
    { username: username ?? "" },
  );
  const [setState, setAction, setPending] = useActionState(
    setPassword.bind(null, userId),
    null,
  );
  const [changeState, changeAction, changePending] = useActionState(
    changePassword.bind(null, userId),
    null,
  );
  const [removeState, removeAction, removePending] = useActionState(
    removePassword.bind(null, userId),
    null,
  );
  const [unlinkState, unlinkAction, unlinkPending] = useActionState(
    unlinkGithub.bind(null, userId),
    null,
  );

  const initial = (username ?? name ?? "?").slice(0, 1).toUpperCase();

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-accent/15 text-lg font-semibold text-accent ring-1 ring-inset ring-edge">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
            initial
          )}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-medium tracking-[-0.03em] text-ink">
            {username ?? name ?? "Account"}
          </h2>
          {email && <p className="text-xs text-muted">{email}</p>}
        </div>
      </div>

      <section className="border-t border-edge/80 py-8">
        <h3 className={sectionTitleCls}>Profile</h3>
        <form action={userAction} className="flex flex-col gap-3">
          <label className={labelCls} htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className={inputCls}
            name="username"
            defaultValue={userState.username}
            required
          />
          <Status error={userState.error} ok={userState.ok} />
          <button type="submit" disabled={userPending} className={primaryBtnCls}>
            {userPending ? "Saving…" : "Save username"}
          </button>
        </form>
      </section>

      <section className="border-t border-edge/80 py-8">
        <h3 className={sectionTitleCls}>Theme</h3>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            Pick a colorway and light or dark mode for the app.
          </p>
          <ModeToggle />
        </div>
        <ThemePicker />
      </section>

      <section className="border-t border-edge/80 py-8">
        <h3 className={sectionTitleCls}>Password</h3>
        {hasPassword ? (
          <div className="space-y-5">
            <form action={changeAction} className="flex flex-col gap-3">
              <label className={labelCls} htmlFor="current-password">
                Current password
              </label>
              <input
                id="current-password"
                className={inputCls}
                name="current"
                type="password"
                placeholder="Current password"
                required
              />
              <label className={labelCls} htmlFor="new-password">
                New password
              </label>
              <input
                id="new-password"
                className={inputCls}
                name="password"
                type="password"
                placeholder="New password (8+ chars)"
                required
              />
              <label className={labelCls} htmlFor="confirm-password">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                className={inputCls}
                name="confirm"
                type="password"
                placeholder="Confirm new password"
                required
              />
              <Status error={changeState?.error} ok={changeState?.ok} />
              <button type="submit" disabled={changePending} className={primaryBtnCls}>
                {changePending ? "Changing…" : "Change password"}
              </button>
            </form>
            <form action={removeAction} className="flex flex-col gap-3">
              <label className={labelCls} htmlFor="remove-password">
                Current password to remove
              </label>
              <input
                id="remove-password"
                className={inputCls}
                name="current"
                type="password"
                placeholder="Current password to remove"
                required
              />
              <Status error={removeState?.error} ok={removeState?.ok} />
              <button
                type="submit"
                disabled={removePending}
                className="w-fit text-xs font-medium text-bad underline-offset-2 transition-colors hover:underline disabled:opacity-60"
              >
                {removePending ? "Removing…" : "Remove password"}
              </button>
            </form>
          </div>
        ) : (
          <form action={setAction} className="flex flex-col gap-3">
            <p className="text-xs text-muted">
              No password yet. Add one to sign in with email + password.
            </p>
            <label className={labelCls} htmlFor="set-password">
              Password
            </label>
            <input
              id="set-password"
              className={inputCls}
              name="password"
              type="password"
              placeholder="Password (8+ chars)"
              required
            />
            <label className={labelCls} htmlFor="set-confirm">
              Confirm password
            </label>
            <input
              id="set-confirm"
              className={inputCls}
              name="confirm"
              type="password"
              placeholder="Confirm password"
              required
            />
            <Status error={setState?.error} ok={setState?.ok} />
            <button type="submit" disabled={setPending} className={primaryBtnCls}>
              {setPending ? "Saving…" : "Set password"}
            </button>
          </form>
        )}
      </section>

      <section className="border-t border-edge/80 py-8">
        <h3 className={sectionTitleCls}>Connected accounts</h3>
        <div className="flex items-center justify-between gap-3 rounded-md border border-edge bg-surface px-4 py-3">
          <span className="text-sm font-medium text-ink">GitHub</span>
          <button
            type="button"
            onClick={() => signIn("github", { redirectTo: "/settings" })}
            className="signal-secondary-cta"
          >
            Connect
          </button>
        </div>
        <form action={unlinkAction} className="mt-3">
          <Status error={unlinkState?.error} ok={unlinkState?.ok} />
          <button
            type="submit"
            disabled={unlinkPending}
            className="mt-1 text-xs font-medium text-bad underline-offset-2 transition-colors hover:underline disabled:opacity-60"
          >
            Disconnect GitHub
          </button>
        </form>
      </section>

      <div className="border-t border-edge/80 py-8">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-fit rounded-md border border-edge bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-raised"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 5: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 6: Commit**

Run: `git add src/components/theme/ThemePicker.tsx src/components/theme/ModeToggle.tsx "src/app/(app)/settings/SettingsPanel.tsx"; git commit -m "feat(settings): signal restyle with restored theme picker"`

---

### Task 7: Restyle the Practice Screen (`src/app/(app)/practice/PracticeScreen.tsx`)

**Files:**
- Modify: `src/app/(app)/practice/PracticeScreen.tsx`

**Interfaces:**
- Consumes: `signal-cta` (Task 4), unchanged engine/config APIs.
- Produces: signal-vocabulary config/session/result/summary panels. No prop changes.

- [ ] **Step 1: All `rounded-[2px]` → `rounded-md`**

In `PracticeScreen.tsx`, replace every occurrence of `rounded-[2px]` with `rounded-md` (use replace-all in the editor). This covers the header chips (lines 211/214/218), progress segments (247), read-phase button (269), result action buttons (337/348/355), config buttons (475/496/518), and summary buttons (597/603).

- [ ] **Step 2: Config-panel micro-labels → mono**

Replace every occurrence of `mb-2 text-[11px] font-medium uppercase tracking-widest text-muted` (three times: lines 467, 488, 510) with `mb-2 font-mono text-[10px] font-medium uppercase tracking-widest text-muted`.

- [ ] **Step 3: "Start typing" → `signal-cta` (read phase)**

Replace:

```tsx
                  className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
```

with:

```tsx
                  className="signal-cta w-full"
```

- [ ] **Step 4: Convert the result panel card to a hairline section**

Replace:

```tsx
                <div className="rounded-lg border border-edge/70 bg-surface p-5">
                  <div className="mb-4 flex items-center justify-between">
```

with:

```tsx
                <div className="border-t border-edge/80 pt-5">
                  <div className="mb-4 flex items-center justify-between">
```

- [ ] **Step 5: "Next snippet" → `signal-cta`**

Replace:

```tsx
                    className="flex-1 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90"
```

with:

```tsx
                    className="signal-cta flex-1"
```

- [ ] **Step 6: Python loading note → plain text**

Replace:

```tsx
                      <div className="rounded-lg border border-edge/70 bg-surface px-4 py-3 text-xs text-muted">
                        Loading the Python interpreter… first run may take a
                        moment.
                      </div>
```

with:

```tsx
                      <div className="text-xs text-muted">
                        Loading the Python interpreter… first run may take a
                        moment.
                      </div>
```

- [ ] **Step 7: Config "pool count" note → plain text**

Replace:

```tsx
      <div className="rounded-lg border border-edge/70 bg-surface px-4 py-3 text-xs text-muted">
        {canStart
          ? `${poolCount} snippet${poolCount === 1 ? "" : "s"} available · session of ${SESSION_SIZE}`
          : "No snippets for this combination yet."}
      </div>
```

with:

```tsx
      <p className="text-xs text-muted">
        {canStart
          ? `${poolCount} snippet${poolCount === 1 ? "" : "s"} available · session of ${SESSION_SIZE}`
          : "No snippets for this combination yet."}
      </p>
```

- [ ] **Step 8: "Start session" → `signal-cta`**

Replace:

```tsx
        className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
```

with:

```tsx
        className="signal-cta w-full disabled:cursor-not-allowed disabled:opacity-40"
```

- [ ] **Step 9: Convert the summary recap box to a hairline section**

Replace:

```tsx
      <div className="rounded-lg border border-edge/70 bg-surface p-4 text-xs text-muted">
```

with:

```tsx
      <div className="border-t border-edge/80 pt-4 text-xs text-muted">
```

- [ ] **Step 10: "Practice again" → `signal-cta`**

Replace:

```tsx
          className="flex-1 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
```

with:

```tsx
          className="signal-cta flex-1"
```

- [ ] **Step 11: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 12: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 13: Commit**

Run: `git add "src/app/(app)/practice/PracticeScreen.tsx"; git commit -m "feat(practice): signal restyle of config/session/result panels"`

---

### Task 8: Restyle the Speed Screen (`src/app/(app)/speed/SpeedScreen.tsx`)

**Files:**
- Modify: `src/app/(app)/speed/SpeedScreen.tsx`

**Interfaces:**
- Consumes: `signal-cta` (Task 4).
- Produces: signal-vocabulary config/type/result panels; dormant `index-hole` markup removed. No prop changes.

- [ ] **Step 1: All `rounded-[2px]` → `rounded-md`**

Replace every occurrence of `rounded-[2px]` with `rounded-md` (replace-all). Covers restart button (181), ConfigBar (249/257/272), mode/target buttons (484/505), and result buttons (431/437).

- [ ] **Step 2: Config-panel micro-labels → mono**

Replace every occurrence of `mb-2 text-[11px] font-medium uppercase tracking-widest text-muted` (lines 476, 497) with `mb-2 font-mono text-[10px] font-medium uppercase tracking-widest text-muted`.

- [ ] **Step 3: Convert the result card to a hairline section and remove the index holes**

Replace:

```tsx
    <div className="sd-rise relative rounded-lg border border-edge/70 bg-surface p-8 text-center sm:p-10">
      <span className="index-hole left-10" aria-hidden />
      <span className="index-hole left-16" aria-hidden />
```

with:

```tsx
    <div className="sd-rise border-t border-edge/80 pt-10 text-center sm:pt-12">
```

- [ ] **Step 4: "Go again" → `signal-cta`**

Replace:

```tsx
          className="flex-1 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
```

with:

```tsx
          className="signal-cta flex-1"
```

- [ ] **Step 5: "Start test" → `signal-cta`**

Replace:

```tsx
        className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
```

with:

```tsx
        className="signal-cta w-full"
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 7: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 8: Commit**

Run: `git add "src/app/(app)/speed/SpeedScreen.tsx"; git commit -m "feat(speed): signal restyle, remove dormant index holes"`

---

### Task 9: Shared Components + Dormant Hero Markup

**Files:**
- Modify: `src/components/AccountButton.tsx`
- Modify: `src/components/StatChip.tsx`
- Modify: `src/components/AppHeader.tsx`
- Modify: `src/components/landing/HeroDemo.tsx`
- Verify: `src/components/CodeBlock.tsx` (radius already consistent — no change required)

**Interfaces:**
- Consumes: nothing new.
- Produces: rounded tile/avatar and menu rows (AccountButton), mono numerals (StatChip), clean hero demo. `AccountButton` is used by both `AppHeader` (app) and the landing nav; `StatChip` is used across Practice/Speed.

- [ ] **Step 1: `AccountButton.tsx` — rounded-md everywhere**

Replace every occurrence of `rounded-[2px]` with `rounded-md` (lines 12, 19, 36, 70, 78, 86). Then replace the avatar image rounding:

```tsx
          <img src={user.image} alt="" className="h-full w-full rounded-full object-cover" />
```

with:

```tsx
          <img src={user.image} alt="" className="h-full w-full rounded-md object-cover" />
```

- [ ] **Step 2: `StatChip.tsx` — mono numerals**

Replace:

```tsx
      <div
        className={`font-display text-xl font-semibold tabular-nums ${
          accent ? "text-accent" : "text-ink"
        }`}
      >
```

with:

```tsx
      <div
        className={`font-mono text-xl font-semibold tabular-nums ${
          accent ? "text-accent" : "text-ink"
        }`}
      >
```

- [ ] **Step 3: `AppHeader.tsx` — skip-link radius**

Replace:

```tsx
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[2px] focus:bg-accent focus:px-3 focus:py-1.5 focus:text-xs focus:font-semibold focus:text-page"
```

with:

```tsx
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-1.5 focus:text-xs focus:font-semibold focus:text-page"
```

- [ ] **Step 4: `HeroDemo.tsx` — remove the dormant index holes**

Delete these two lines:

```tsx
      <span className="index-hole left-10" aria-hidden />
      <span className="index-hole left-16" aria-hidden />
```

- [ ] **Step 5: `HeroDemo.tsx` — replace the hidden paper stamp with a signal badge**

Replace:

```tsx
            <span className="sd-stamp">Clean run</span>
```

with:

```tsx
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-good">
              Clean run
            </span>
```

(`.signal-page .sd-stamp` was `display: none`, so the hero never showed "Clean run"; the mono badge renders it in the signal language.)

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 7: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 8: Commit**

Run: `git add src/components/AccountButton.tsx src/components/StatChip.tsx src/components/AppHeader.tsx "src/components/landing/HeroDemo.tsx"; git commit -m "feat(ui): shared component alignment + hero demo cleanup"`

---

### Task 10: Landing + Sign-In Review Fixes

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/signin/SigninCard.tsx`
- Modify: `src/components/landing/LandingStats.tsx`

**Interfaces:**
- Consumes: `signal-cta` (Task 4), existing `signal-auth-submit` CSS.
- Produces: correct nav CTA responsive behavior, accurate language/roadmap copy, typed step array, register submit parity, sans-serif stats.

- [ ] **Step 1: `src/app/page.tsx` — fix the nav CTA cascade**

Replace:

```tsx
            <Link href="/app" className="signal-cta hidden sm:inline-flex">
              Start drilling <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
```

with:

```tsx
            <span className="hidden sm:block">
              <Link href="/app" className="signal-cta">
                Start drilling <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </span>
```

(The bug: `.signal-cta` is unlayered author CSS with `display: inline-flex`, which overrode Tailwind's layered `hidden` utility, so the nav CTA showed on mobile. Wrapping in a `hidden sm:block` span moves the responsive toggle to the wrapper.)

- [ ] **Step 2: `src/app/page.tsx` — accurate track languages**

Replace the `TRACK_LANGUAGES` object (lines 20-26):

```ts
const TRACK_LANGUAGES: Record<string, string> = {
  variables: "JavaScript + Python + PHP + C",
  conditionals: "JavaScript + Python + PHP + C",
  loops: "JavaScript + Python + PHP + C",
  functions: "JavaScript + Python + PHP + C",
  database: "JavaScript + Python + PHP + C + SQL",
};
```

- [ ] **Step 3: `src/app/page.tsx` — fix the roadmap statuses**

Replace the `ROADMAP` array (lines 28-32):

```ts
const ROADMAP = [
  ["In progress", "Go and Rust tracks", "Two more languages for deliberate practice."],
  ["Next up", "Recall drills", "Practice syntax away from the keyboard, too."],
  ["On deck", "Difficulty tiers", "A clearer path from first patterns to fluency."],
];
```

(Difficulty tiers already ship; demote them so nothing on the page is stale.)

- [ ] **Step 4: `src/app/page.tsx` — typed steps array**

Add `type LucideIcon` to the `lucide-react` import (line 2-8):

```tsx
import {
  ArrowRight,
  Braces,
  CircleCheck,
  Gauge,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
```

Add this const after the `ROADMAP` array (line 32):

```ts
const STEPS: { number: string; title: string; copy: string; icon: LucideIcon }[] = [
  {
    number: "01",
    title: "See the pattern",
    copy: "Start with a short explanation, so you know what the syntax is doing before your hands touch the keys.",
    icon: Braces,
  },
  {
    number: "02",
    title: "Recall it",
    copy: "Type the pattern from memory. The gap between seeing and writing is where recognition becomes knowledge.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Earn the clean run",
    copy: "Character-level feedback gives you a precise read on accuracy, pace, and the next pattern to master.",
    icon: CircleCheck,
  },
];
```

Then replace the steps map (lines 116-132):

```tsx
            <div className="space-y-0 border-t border-edge/70">
              {[
                ["01", "See the pattern", "Start with a short explanation, so you know what the syntax is doing before your hands touch the keys.", Braces],
                ["02", "Recall it", "Type the pattern from memory. The gap between seeing and writing is where recognition becomes knowledge.", Sparkles],
                ["03", "Earn the clean run", "Character-level feedback gives you a precise read on accuracy, pace, and the next pattern to master.", CircleCheck],
              ].map(([number, title, copy, Icon]) => {
                const StepIcon = Icon as typeof Braces;
                return <article key={number as string} className="signal-step">
                  <span className="signal-step-number">{number as string}</span>
                  <StepIcon className="mt-1 h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden />
                  <div>
                    <h3 className="text-2xl font-medium tracking-[-0.04em] text-ink">{title as string}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{copy as string}</p>
                  </div>
                </article>;
              })}
            </div>
```

with:

```tsx
            <div className="space-y-0 border-t border-edge/70">
              {STEPS.map((step) => (
                <article key={step.number} className="signal-step">
                  <span className="signal-step-number">{step.number}</span>
                  <step.icon className="mt-1 h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden />
                  <div>
                    <h3 className="text-2xl font-medium tracking-[-0.04em] text-ink">{step.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{step.copy}</p>
                  </div>
                </article>
              ))}
            </div>
```

- [ ] **Step 5: `src/app/signin/SigninCard.tsx` — register submit parity**

Replace:

```tsx
          <button
            type="submit"
            disabled={pending}
            className="signal-auth-submit mt-1 w-full disabled:opacity-60"
          >
            {pending ? "Creating account…" : "Create account"}
          </button>
```

with:

```tsx
          <button
            type="submit"
            disabled={pending}
            className="signal-auth-submit mt-1 w-full disabled:opacity-60"
          >
            {pending ? "Creating account…" : "Create account"}
            <span className="signal-auth-submit-index" aria-hidden>02</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </button>
```

(`ArrowRight` is already imported in this file.)

- [ ] **Step 6: `src/components/landing/LandingStats.tsx` — kill the serif leak**

Replace:

```tsx
          <span className="font-display text-3xl font-medium tabular-nums text-ink">
```

with:

```tsx
          <span className="font-sans text-3xl font-medium tabular-nums tracking-[-0.03em] text-ink">
```

(The `.signal-app .font-display` Geist override is scoped to the app, so `font-display` on the landing renders EB Garamond serif. Geist matches the hero.)

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 8: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 9: Commit**

Run: `git add src/app/page.tsx "src/app/signin/SigninCard.tsx" "src/components/landing/LandingStats.tsx"; git commit -m "fix(landing): nav cta cascade, copy accuracy, typed steps, register button"`

---

### Task 11: Progress — Streaks (Metrics Band + 7-Day Bars) (`src/components/progress/StreakCard.tsx`)

**Files:**
- Modify: `src/components/progress/StreakCard.tsx`

**Interfaces:**
- Consumes: `StatRecord` from `@/types`; `signal-app-metrics` CSS (already defined).
- Produces: `StreakCard({ records }: { records: StatRecord[] })` rendering a `<section>` with an `<h2>`, a two-value metrics readout (Current/Longest, mono numerals), and a `signal-app-metrics` band containing one vertical bar per calendar day of the last 7 days (accent when practiced, `bg-raised` when idle, current day outlined with an accent ring). Task 16 places it in the page.

- [ ] **Step 1: Replace the file with the new implementation**

Replace the entire file with:

```tsx
import type { StatRecord } from "@/types";

function dateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round(
    (new Date(ay, am - 1, ad).getTime() - new Date(by, bm - 1, bd).getTime()) / 86_400_000,
  );
}

function computeStreak(records: StatRecord[]) {
  const keys = [...new Set(records.map((r) => dateKey(r.startedAt)))].sort();
  const today = dateKey(new Date().toISOString());
  const yesterday = addDays(today, -1);

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const k of keys) {
    run = prev === null || daysBetween(k, prev) === 1 ? run + 1 : 1;
    prev = k;
    longest = Math.max(longest, run);
  }

  let current = 0;
  if (keys.length > 0) {
    const last = keys[keys.length - 1];
    if (last === today || last === yesterday) {
      let cursor = last;
      for (let i = keys.length - 1; i >= 0; i--) {
        if (keys[i] === cursor) {
          current += 1;
          cursor = addDays(cursor, -1);
        } else {
          break;
        }
      }
    }
  }

  return { current, longest };
}

const WEEK_DAYS = 7;

function weekDays(): string[] {
  const today = dateKey(new Date().toISOString());
  const keys: string[] = [];
  for (let i = WEEK_DAYS - 1; i >= 0; i--) keys.push(addDays(today, -i));
  return keys;
}

function weekdayLabel(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "narrow",
  });
}

export default function StreakCard({ records }: { records: StatRecord[] }) {
  const { current, longest } = computeStreak(records);
  const practiced = new Set(records.map((r) => dateKey(r.startedAt)));
  const days = weekDays();
  const today = days[days.length - 1];

  return (
    <section>
      <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
        Streaks
      </h2>
      {records.length === 0 ? (
        <p className="mb-6 text-sm text-muted">
          No sessions yet. Practice or take a speed test to start a streak.
        </p>
      ) : (
        <div className="mb-6 flex gap-10">
          <div>
            <div className="font-mono text-3xl font-semibold tabular-nums text-accent">
              {current}
            </div>
            <div className="mt-1 font-mono text-[10px] font-medium uppercase tracking-widest text-muted">
              Current day{current === 1 ? "" : "s"}
            </div>
          </div>
          <div>
            <div className="font-mono text-3xl font-semibold tabular-nums text-ink">
              {longest}
            </div>
            <div className="mt-1 font-mono text-[10px] font-medium uppercase tracking-widest text-muted">
              Longest
            </div>
          </div>
        </div>
      )}
      <div
        className="signal-app-metrics px-4 pb-4 pt-5"
        role="img"
        aria-label="Practice activity over the last 7 days"
      >
        <div className="flex items-end justify-between gap-2">
          {days.map((day) => {
            const active = practiced.has(day);
            const isToday = day === today;
            return (
              <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-14 w-full items-end justify-center">
                  <div
                    className={`w-full max-w-[16px] ${active ? "bg-accent" : "bg-raised"} ${
                      isToday ? "ring-1 ring-inset ring-accent/70" : ""
                    }`}
                    style={{ height: active ? "100%" : "36%" }}
                  />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted">
                  {weekdayLabel(day)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 3: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 4: Commit**

Run: `git add "src/components/progress/StreakCard.tsx"; git commit -m "feat(progress): streaks as metrics band + 7-day activity bars"`

---

### Task 12: Progress — Speed Bests (Horizontal Bar Rows) (`src/components/progress/SpeedBests.tsx`)

**Files:**
- Modify: `src/components/progress/SpeedBests.tsx`

**Interfaces:**
- Consumes: `SpeedTestRecord`, `StatRecord` from `@/types`.
- Produces: `SpeedBests({ records }: { records: StatRecord[] })` rendering a `<section>` with an `<h2>`, TIME and WORDS groups of horizontal bar rows (fill scaled to the group best WPM; unattempted targets render an empty track + muted `—`).

- [ ] **Step 1: Replace the file**

Replace the entire file with:

```tsx
import type { SpeedTestRecord, StatRecord } from "@/types";

const TIME_TARGETS = [15, 30, 60] as const;
const WORD_TARGETS = [10, 25, 50] as const;

function bestWpm(
  records: SpeedTestRecord[],
  mode: SpeedTestRecord["mode"],
  target: number,
): number | null {
  const matches = records.filter((r) => r.mode === mode && r.target === target);
  if (matches.length === 0) return null;
  return Math.round(Math.max(...matches.map((r) => r.wpm)));
}

function BarRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number | null;
  max: number;
}) {
  const pct = value === null ? 0 : Math.max(6, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-11 shrink-0 font-mono text-xs text-muted">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden bg-raised">
        {value !== null && (
          <div
            className="h-full bg-accent transition-[width]"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      <span
        className={`w-12 shrink-0 text-right font-mono text-sm font-semibold tabular-nums ${
          value === null ? "text-muted" : "text-ink"
        }`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

function Group({
  title,
  rows,
  max,
}: {
  title: string;
  rows: { label: string; value: number | null }[];
  max: number;
}) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-widest text-muted">
        {title}
      </div>
      <div>
        {rows.map((row) => (
          <BarRow key={row.label} label={row.label} value={row.value} max={max} />
        ))}
      </div>
    </div>
  );
}

export default function SpeedBests({ records }: { records: StatRecord[] }) {
  const speed = records.filter((r): r is SpeedTestRecord => r.kind === "speed");
  const values = [
    ...TIME_TARGETS.map((t) => bestWpm(speed, "time", t)),
    ...WORD_TARGETS.map((w) => bestWpm(speed, "words", w)),
  ].filter((v): v is number => v !== null);
  const max = values.length > 0 ? Math.max(...values) : 1;

  return (
    <section>
      <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
        Speed bests
      </h2>
      {speed.length === 0 ? (
        <p className="text-sm text-muted">
          No speed tests yet. Run a timed or word-count test to see your bests.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          <Group
            title="Time"
            rows={TIME_TARGETS.map((t) => ({
              label: `${t}s`,
              value: bestWpm(speed, "time", t),
            }))}
            max={max}
          />
          <Group
            title="Words"
            rows={WORD_TARGETS.map((w) => ({
              label: `${w}w`,
              value: bestWpm(speed, "words", w),
            }))}
            max={max}
          />
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 3: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 4: Commit**

Run: `git add "src/components/progress/SpeedBests.tsx"; git commit -m "feat(progress): speed bests as horizontal bar rows"`

---

### Task 13: Progress — Trend (Vertical Bars) (`src/components/progress/TrendChart.tsx`)

**Files:**
- Modify: `src/components/progress/TrendChart.tsx`

**Interfaces:**
- Consumes: `StatRecord` from `@/types`.
- Produces: `TrendChart({ records }: { records: StatRecord[] })` rendering a `<section>` with an `<h2>` and an SVG of one accent bar per recent session (scaled to WPM) with an accuracy hairline in `--sd-correct` and faint `--sd-border` gridlines. Keeps `role="img"` + `aria-label`.

- [ ] **Step 1: Replace the file**

Replace the entire file with:

```tsx
import type { StatRecord } from "@/types";

const W = 600;
const H = 160;

export default function TrendChart({ records }: { records: StatRecord[] }) {
  const recent = records.slice(-30);

  if (recent.length === 0) {
    return (
      <section>
        <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
          Trend
        </h2>
        <p className="text-sm text-muted">No sessions yet.</p>
      </section>
    );
  }

  const maxWpm = Math.max(1, ...recent.map((r) => r.wpm));
  const n = recent.length;
  const slot = W / n;
  const barW = Math.max(3, slot * 0.6);

  return (
    <section>
      <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
        Trend
      </h2>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="WPM and accuracy over the last 30 sessions"
      >
        {[0, 40, 80, 120, 160].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2={W}
            y2={y}
            stroke="var(--sd-border)"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
        ))}
        {recent.map((r, i) => {
          const h = Math.max(2, (r.wpm / maxWpm) * 130);
          const x = i * slot + (slot - barW) / 2;
          const y = H - h;
          const accY = H - (r.accuracy / 100) * 130;
          return (
            <g key={r.id}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="1"
                fill="var(--sd-accent)"
                opacity="0.85"
              />
              <line
                x1={x}
                y1={accY}
                x2={x + barW}
                y2={accY}
                stroke="var(--sd-correct)"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center gap-4 font-mono text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1 w-3 bg-accent" /> WPM
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1 w-3 bg-good" /> Accuracy
        </span>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 3: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 4: Commit**

Run: `git add "src/components/progress/TrendChart.tsx"; git commit -m "feat(progress): trend as vertical bars with accuracy hairline"`

---

### Task 14: Progress — Concepts (Mastery Bar Rows) (`src/components/progress/ConceptBars.tsx`)

**Files:**
- Modify: `src/components/progress/ConceptBars.tsx`

**Interfaces:**
- Consumes: `StatRecord` from `@/types`, `CONCEPTS` from `@/lib/concepts`.
- Produces: `ConceptBars({ records }: { records: StatRecord[] })` rendering a `<section>` with an `<h2>` and `divide-y` rows: concept name, `bg-raised` track with accent fill scaled to mastered/total, and a mono `n/n mastered` count.

- [ ] **Step 1: Replace the file**

Replace the entire file with:

```tsx
import type { StatRecord } from "@/types";
import { CONCEPTS } from "@/lib/concepts";

export default function ConceptBars({ records }: { records: StatRecord[] }) {
  const code = records.filter(
    (r): r is Extract<StatRecord, { kind: "code" }> => r.kind === "code",
  );

  if (code.length === 0) {
    return (
      <section>
        <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
          Concepts
        </h2>
        <p className="text-sm text-muted">No practice sessions yet.</p>
      </section>
    );
  }

  const byConcept = new Map<string, { total: number; mastered: number }>();
  for (const r of code) {
    const agg = byConcept.get(r.concept) ?? { total: 0, mastered: 0 };
    agg.total += r.snippetIds.length;
    agg.mastered += r.masteredCount;
    byConcept.set(r.concept, agg);
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
        Concepts
      </h2>
      <div className="divide-y divide-edge/80">
        {CONCEPTS.map((concept) => {
          const agg = byConcept.get(concept.id);
          if (!agg) return null;
          const pct =
            agg.total > 0 ? Math.min(100, (agg.mastered / agg.total) * 100) : 0;
          return (
            <div key={concept.id} className="flex items-center gap-4 py-4">
              <span className="w-36 shrink-0 truncate text-sm font-medium text-ink sm:w-44">
                {concept.name}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden bg-raised">
                <div
                  className="h-full bg-accent transition-[width]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-24 shrink-0 text-right font-mono text-xs tabular-nums text-muted">
                {agg.mastered}/{agg.total} mastered
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 3: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 4: Commit**

Run: `git add "src/components/progress/ConceptBars.tsx"; git commit -m "feat(progress): concepts as mastery bar rows"`

---

### Task 15: Progress — History (Divide-y Rows) (`src/components/progress/HistoryList.tsx`)

**Files:**
- Modify: `src/components/progress/HistoryList.tsx`

**Interfaces:**
- Consumes: `StatRecord` from `@/types`, `getConcept` from `@/lib/concepts`.
- Produces: `HistoryList({ records }: { records: StatRecord[] })` rendering a `<section>` with an `<h2>`, grouped by day under mono date headers, with `divide-y` rows: kind pill (CODE/SPEED), truncated label, and right-aligned mono `wpm · % · duration`.

- [ ] **Step 1: Replace the file**

Replace the entire file with:

```tsx
import type { StatRecord } from "@/types";
import { getConcept } from "@/lib/concepts";

function dateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  if (total < 60) return `${total}s`;
  return `${Math.floor(total / 60)}m ${String(total % 60).padStart(2, "0")}s`;
}

function label(record: StatRecord): string {
  if (record.kind === "code") {
    const concept = getConcept(record.concept)?.name ?? record.concept;
    return `${record.language} · ${concept}`;
  }
  return record.mode === "time" ? `${record.target}s test` : `${record.target} word test`;
}

export default function HistoryList({ records }: { records: StatRecord[] }) {
  if (records.length === 0) {
    return (
      <section>
        <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
          History
        </h2>
        <p className="text-sm text-muted">No sessions yet.</p>
      </section>
    );
  }

  const sorted = [...records].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const grouped = new Map<string, StatRecord[]>();
  for (const r of sorted) {
    const key = dateKey(r.startedAt);
    const list = grouped.get(key) ?? [];
    list.push(r);
    grouped.set(key, list);
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
        History
      </h2>
      <div className="flex flex-col gap-5">
        {[...grouped.entries()].map(([day, rows]) => (
          <div key={day}>
            <div className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
              {formatDay(day)}
            </div>
            <div className="divide-y divide-edge/80">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`rounded-[2px] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                        r.kind === "code"
                          ? "bg-accent/15 text-accent"
                          : "bg-good/15 text-good"
                      }`}
                    >
                      {r.kind}
                    </span>
                    <span className="truncate text-sm text-ink">{label(r)}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 font-mono text-xs tabular-nums text-muted">
                    <span className="text-ink">{Math.round(r.wpm)} wpm</span>
                    <span>{Math.round(r.accuracy * 100)}%</span>
                    <span>{formatDuration(r.durationMs)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 3: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 4: Commit**

Run: `git add "src/components/progress/HistoryList.tsx"; git commit -m "feat(progress): history as divide-y rows with kind pills"`

---

### Task 16: Progress Page Section Hierarchy (`src/app/(app)/progress/page.tsx`)

**Files:**
- Modify: `src/app/(app)/progress/page.tsx`

**Interfaces:**
- Consumes: the five redesigned components (Tasks 11-15), each rendering its own `<section>` with an `<h2>`.
- Produces: a page that stacks the sections with `border-t` hairlines instead of the old `grid`/card layout. Data loading unchanged.

- [ ] **Step 1: Restructure the page body**

Replace the return block (lines 28-48):

```tsx
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/app"
        className="mb-4 inline-block text-xs font-medium text-muted transition-colors hover:text-ink"
      >
        ← Tracks
      </Link>
      <p className="signal-kicker mb-3">Your history</p>
      <h1 className="mb-8 text-4xl font-medium tracking-[-0.05em] text-ink">
        Progress
      </h1>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <StreakCard records={list} />
        <SpeedBests records={list} />
      </div>
      <TrendChart records={list} />
      <ConceptBars records={list} />
      <HistoryList records={list} />
    </div>
  );
```

with:

```tsx
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/app"
        className="mb-4 inline-block text-xs font-medium text-muted transition-colors hover:text-ink"
      >
        ← Tracks
      </Link>
      <p className="signal-kicker mb-3">Your history</p>
      <h1 className="mb-4 text-4xl font-medium tracking-[-0.05em] text-ink">
        Progress
      </h1>
      <div className="flex flex-col">
        <div className="border-t border-edge/80 py-8">
          <StreakCard records={list} />
        </div>
        <div className="border-t border-edge/80 py-8">
          <SpeedBests records={list} />
        </div>
        <div className="border-t border-edge/80 py-8">
          <TrendChart records={list} />
        </div>
        <div className="border-t border-edge/80 py-8">
          <ConceptBars records={list} />
        </div>
        <div className="border-t border-edge/80 py-8">
          <HistoryList records={list} />
        </div>
      </div>
    </div>
  );
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 3: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 4: Commit**

Run: `git add "src/app/(app)/progress/page.tsx"; git commit -m "feat(progress): hairline section stack"`

---

### Task 17: Final Verification

**Files:**
- Verify: whole branch

**Interfaces:**
- Consumes: all prior tasks.
- Produces: evidence the redesign is shippable and themes work in all four modes.

- [ ] **Step 1: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 2: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 3: Production build**

Run: `npm run build` → PASS, 11 routes.

- [ ] **Step 4: Confirm the commit history is clean and complete**

Run: `git log --oneline -20` and `git status --short`.
Expected: one commit per task (baseline + 16), working tree clean, `.superpowers/` untracked and unstaged.

- [ ] **Step 5: Manual visual pass — all four themes**

Start the dev server (`npm run dev`) and verify in **signal dark, signal light, graphite dark, graphite light** (toggle in `/settings` → Theme; also check legacy-migration by setting `localStorage["sd.theme"]` to `"night"` and `"paper-light"` and reloading — each should resolve to signal / signal-light):

1. `/` landing and `/signin` stay dark `signal` in every case; no serif (`font-display`) text anywhere on the landing; nav "Start drilling" CTA hidden on a narrow (<640px) viewport.
2. `/app` tracks: metrics band, hairline track rows, "Open speed test" CTA, callout — no boxed `bg-surface p-5` cards remain.
3. `/practice` config + a session + result + summary: `signal-cta` buttons, mono labels, no boxed cards.
4. `/speed` config + a run + result: no index holes, no boxed result card.
5. `/settings`: cut-corner avatar, hairline sections, Theme section works (switching colorway + mode updates the whole app live).
6. `/progress`: metrics band + 7-day strip; horizontal speed bars; vertical trend bars; concept mastery rows; history rows with kind pills — all on hairline sections, no floating cards.
7. Body text contrast in the light themes (ink on bg) reads comfortably; accent-on-white buttons (`signal-cta` hover, `text-accent`) remain legible.

- [ ] **Step 6: Report any failures**

If any step in 1-4 fails or anything in step 5 looks broken in any theme, fix it in a follow-up commit before considering the plan complete.

---

## Self-Review

**Spec coverage:**
- Theme data model, migration, four palettes, wrappers, Settings Theme section, hardcoded-color audit → Tasks 2-6.
- Full app audit (Settings, Practice, Speed, shared components, dormant markup, serif leak) → Tasks 6-9 + Task 10 step 6.
- Progress redesign (streaks/band, speed bars, trend bars, concepts rows, history rows, hairline hierarchy) → Tasks 11-16.
- Landing + review fixes (baseline, nav CTA, tracks copy, roadmap copy, register button, typed steps) → Task 1 + Task 10.
- Verification (gates + manual visual pass in dark and light) → Task 17.

**Placeholder scan:** every task contains the full replacement code or exact old→new strings; no TBD/TODO/placeholders.

**Type consistency:** all progress components keep the `({ records }: { records: StatRecord[] })` signature the page already passes; `ThemeProvider` exposes `colorway`/`mode`/`setTheme`/`setMode` (unchanged); `ThemePicker`/`ModeToggle` keep their existing export names so the SettingsPanel imports resolve; the `lucide-react` `type LucideIcon` import is added in Task 10 and consumed in the same task.
