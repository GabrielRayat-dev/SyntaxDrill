# Phase B: App Chrome Workbook Interior Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the logged-in product (app chrome) to the approved workbook-interior design so every surface reads as the field guide's interior pages.

**Architecture:** Presentational only. Add a few shared CSS primitives to `globals.css`, restyle shared components (`StatChip`, `VerdictBanner`, `CodeBlock`, `CodeEditor`, `AccountButton`, `AppHeader`, `ThemePicker`), move the five logged-in pages under a new `(app)` route group with one shared layout, then restyle each surface (tracks, practice, speed, settings, progress, scenes, sign-in). Token values, theme storage, and DB/API logic are untouched.

**Tech Stack:** Next.js 16.2.12 (App Router, Tailwind v4, TS strict), React 19, lucide-react. No unit test runner exists; verification is `npx tsc --noEmit`, `npm run lint`, `npm run build`, plus grep sweeps.

## Global Constraints

These apply to every task. Copy them verbatim into task briefs as needed.

- Repo root: `C:\Users\gabri\OneDrive\ドキュメント\Opencode Projects\SyntaxDrill`. Shell is Windows PowerShell 5.1 (no `&&`; use `cmd1; if ($?) { cmd2 }`). Quote paths containing `(` or spaces with single quotes, e.g. `git mv 'src/app/app' 'src/app/(app)/app'`.
- Spec of record: `docs/superpowers/specs/2026-08-02-app-chrome-design.md`.
- Verification gates, in order, after every task: `npx tsc --noEmit` then `npm run lint` then `npm run build`. All three must pass (build must list the 11 routes: `/`, `/signin`, `/app`, `/practice`, `/speed`, `/settings`, `/progress`).
- Shape rules: buttons and controls `rounded-[2px]`; cards and panels `rounded-lg`; no `rounded-full` anywhere in chrome except the account avatar photo circles. No `rounded-xl` or `rounded-2xl` in chrome after Task 4.
- Copy rules: zero em-dashes and en-dashes (`—`, `–`) in any chrome copy. `·` is allowed. Arrows only as `→` (forward) and `←` (back). No emoji in chrome copy.
- Token usage: all colors via Tailwind token classes (`page`, `surface`, `raised`, `edge`, `ink`, `muted`, `accent`, `accent-2`, `good`, `bad`, `warn`). No raw hexes and no inline `var(--sd-*)` styles in components. Hardcoded legacy hexes must be removed where this plan names them.
- Fonts: headings and ledger numerals `font-display`; labels and numerals `font-mono`; body is Source Serif 4 by default. `.sd-eyebrow` (mono uppercase micro-label) goes above every `font-display` page heading.
- Do not modify the landing (`src/app/page.tsx`, `src/components/landing/HeroDemo.tsx`, `src/components/landing/LandingStats.tsx`), `src/components/scenes/FinishLineScene.tsx`, `src/components/progress/TrendChart.tsx`, theme token *values* in `globals.css`, or any DB/API logic.
- Do not push. Commit per task. If a fix is needed during a task, add a new commit; do not amend.

---

### Task 1: Route-group layout refactor

**Files:**
- Create: `src/app/(app)/layout.tsx`
- Move: `src/app/app` to `src/app/(app)/app`
- Move: `src/app/practice` to `src/app/(app)/practice`
- Move: `src/app/speed` to `src/app/(app)/speed`
- Move: `src/app/settings` to `src/app/(app)/settings`
- Move: `src/app/progress` to `src/app/(app)/progress`
- Modify: `src/app/(app)/app/page.tsx`, `src/app/(app)/practice/PracticeScreen.tsx`, `src/app/(app)/speed/SpeedScreen.tsx`, `src/app/(app)/settings/page.tsx`, `src/app/(app)/progress/page.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: a shared layout at `(app)/layout.tsx` that all later tasks rely on for the header and `<main id="main">`. All paths below this task in the plan refer to files at their new `(app)/` locations.

- [ ] **Step 1: Move the five page folders**

Run these (quoted, PowerShell-safe):

```bash
git mv 'src/app/app' 'src/app/(app)/app'
git mv 'src/app/practice' 'src/app/(app)/practice'
git mv 'src/app/speed' 'src/app/(app)/speed'
git mv 'src/app/settings' 'src/app/(app)/settings'
git mv 'src/app/progress' 'src/app/(app)/progress'
```

`src/app/signin/` stays where it is. Verify with `git status` that only renames appear.

- [ ] **Step 2: Create the shared layout**

Create `src/app/(app)/layout.tsx`:

```tsx
import type { ReactNode } from "react";
import AppHeader from "@/components/AppHeader";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main id="main" className="mx-auto w-full max-w-5xl px-4 py-10">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Strip scaffolding from `(app)/app/page.tsx`**

Remove `import AppHeader from "@/components/AppHeader";` (line 15). Change line 14 from `"../../../content/snippets"` to `"../../../../content/snippets"`. Replace the outer wrapper (currently `<div className="min-h-screen"><AppHeader /><main id="main" className="mx-auto max-w-5xl px-4 py-10">...</main></div>`) so the component returns only the inner content wrapped in a fragment `<>...</>`. The content between the old `<main>` tags stays byte-identical.

- [ ] **Step 4: Strip scaffolding from `(app)/practice/PracticeScreen.tsx`**

Remove `import AppHeader from "@/components/AppHeader";` (line 34). Change line 25 from `"../../../content/snippets"` to `"../../../../content/snippets"`. Replace the outer wrapper (currently `<div className="min-h-screen"><AppHeader /><main id="main" className="mx-auto max-w-3xl px-4 py-8">...</main></div>`) so the component returns `<div className="mx-auto max-w-3xl">...</div>` wrapping the same children (the phase conditionals). The file must still be `"use client"` and still export `PracticeScreen` as default.

- [ ] **Step 5: Strip scaffolding from `(app)/speed/SpeedScreen.tsx`**

Remove `import AppHeader from "@/components/AppHeader";` (line 22). Replace the outer wrapper (currently `<div className="min-h-screen"><AppHeader /><main id="main" className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-5xl flex-col justify-center px-4 py-8">...</main></div>`) so the component returns `<div className="flex min-h-[calc(100vh-3.5rem)] flex-col justify-center">...</div>` wrapping the same children. Keep `export const TIME_BUFFER = 200;` unchanged.

- [ ] **Step 6: Strip scaffolding from `(app)/settings/page.tsx`**

Remove `import AppHeader from "@/components/AppHeader";` (line 7). Replace the outer wrapper (currently `<div className="min-h-screen"><AppHeader /><main id="main" className="mx-auto max-w-2xl px-4 py-10">...</main></div>`) so the server component returns `<div className="mx-auto max-w-2xl">...</div>` wrapping the same back link, `h1`, and `<SettingsPanel />`.

- [ ] **Step 7: Strip scaffolding from `(app)/progress/page.tsx`**

Remove `import AppHeader from "@/components/AppHeader";` (line 8). Replace the outer wrapper (currently `<div className="min-h-screen"><AppHeader /><main id="main" className="mx-auto max-w-4xl px-4 py-10">...</main></div>`) so the server component returns `<div className="mx-auto max-w-4xl">...</div>` wrapping the same content.

- [ ] **Step 8: Verify**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`. Expected: all pass; the build's route list still shows `/app`, `/practice`, `/speed`, `/settings`, `/progress`. Then grep `src/app` for `AppHeader` must match only `src/app/(app)/layout.tsx` and the component definition file `src/components/AppHeader.tsx`. Grep for `from "\.\.\./content/snippets"` in `src/app/(app)` must find no matches (both fixed).

- [ ] **Step 9: Commit**

```bash
git add 'src/app/(app)'
git commit -m "refactor: mount app chrome once via (app) route-group layout"
```

---

### Task 2: Shared primitives and AppHeader restyle

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/AppHeader.tsx`
- Modify: `src/components/AccountButton.tsx`

**Interfaces:**
- Consumes: Task 1 layout.
- Produces: CSS utilities `.sd-eyebrow`, `.sd-ledger`, `.sd-ledger-row`, `.sd-field`, `.sd-nav-link`, `.sd-nav-link-active`; the new `AppHeader` with a 4-item nav; a squared `AccountButton` avatar trigger. Later tasks use these classes.

- [ ] **Step 1: Add the primitives to `globals.css`**

Append to `src/app/globals.css` (after the existing `.sd-stamp-accent` block, before the `@media (prefers-reduced-motion)` block):

```css
/* Mono uppercase micro-label above font-display headings */
.sd-eyebrow {
  font-family: var(--font-jetbrains-mono), ui-monospace, Menlo, monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--sd-muted);
}

/* Ledger strip: rule top and bottom, dotted leaders between rows */
.sd-ledger {
  border-top: 1px solid color-mix(in srgb, var(--sd-border) 70%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--sd-border) 70%, transparent);
}

/* Squared input field */
.sd-field {
  border-radius: 2px;
  border: 1px solid var(--sd-border);
  background: var(--sd-raised);
  color: var(--sd-text);
}

/* Header nav link with a dotted underline */
.sd-nav-link {
  font-family: var(--font-jetbrains-mono), ui-monospace, Menlo, monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sd-muted);
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: transparent;
  text-underline-offset: 4px;
  transition: color 150ms ease, text-decoration-color 150ms ease;
}
.sd-nav-link:hover {
  color: var(--sd-text);
}
.sd-nav-link-active,
.sd-nav-link[aria-current="page"] {
  color: var(--sd-accent);
  text-decoration-color: var(--sd-accent);
}
```

Note: `.sd-ledger-row` is intentionally not defined here; Task 3 demonstrates the row pattern with Tailwind (`border-b border-dotted border-edge/60`).

- [ ] **Step 2: Rewrite `AppHeader.tsx`**

Replace the whole file with:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountButton from "@/components/AccountButton";
import ModeToggle from "@/components/theme/ModeToggle";

const NAV: { id: string; label: string; href: string }[] = [
  { id: "practice", label: "Practice", href: "/app" },
  { id: "speed", label: "Speed", href: "/speed" },
  { id: "settings", label: "Settings", href: "/settings" },
  { id: "progress", label: "Progress", href: "/progress" },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[2px] focus:bg-accent focus:px-3 focus:py-1.5 focus:text-xs focus:font-semibold focus:text-page"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-edge/70 bg-page/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-display text-lg font-semibold tracking-tight text-ink">
                SyntaxDrill
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:inline">
                workbook
              </span>
            </Link>
            <nav className="flex items-center gap-5">
              {NAV.map((item) => {
                const active =
                  item.id === "practice"
                    ? pathname === "/app" || pathname.startsWith("/practice")
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`sd-nav-link ${active ? "sd-nav-link-active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <AccountButton />
          </div>
        </div>
      </header>
    </>
  );
}
```

This drops the old `setRaw("sd.mode", ...)` write and the `useRouter`/`setRaw` imports: `sd.mode` is written nowhere else and read nowhere in `src/`, so the write is dead behavior. `Modes`-style segmented control and the old rounded styles are gone.

- [ ] **Step 3: Square the `AccountButton` avatar trigger**

In `src/components/AccountButton.tsx`, change the trigger button className (line 36) from `... rounded-full bg-accent/15 ...` to `... rounded-[2px] bg-accent/15 ...`. In the `<img>` at line 40 add `rounded-full` to its className so a photo stays a circle inside the square tile: `className="h-full w-full rounded-full object-cover"`. Leave the dropdown panel `rounded-lg`, menu items, sign-in CTA, and skeleton as they are.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`. Expected: all pass. Grep `src/components/AppHeader.tsx` for `sd.mode` must find nothing.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/components/AppHeader.tsx src/components/AccountButton.tsx
git commit -m "feat: workbook primitives and dotted-leader app header"
```

---

### Task 3: Tracks dashboard restyle

**Files:**
- Modify: `src/app/(app)/app/page.tsx`

**Interfaces:**
- Consumes: Task 2 primitives (`.sd-eyebrow`, `.sd-ledger`), Task 1 location.
- Produces: the `/app` tracks dashboard in workbook form. Nothing later depends on its internals.

- [ ] **Step 1: Add the eyebrow and square the language buttons**

Above the `h1` "Practice tracks", add:

```tsx
<p className="sd-eyebrow mb-1">// drill catalogue</p>
```

Change the two language `<button>` classNames (line 43) from `rounded-lg border px-4 py-2 ...` to `rounded-[2px] border px-4 py-2 ...`.

- [ ] **Step 2: Convert the totals row to a ledger strip**

Replace the totals block (lines 55-63) with:

```tsx
{records.length > 0 && (
  <div className="sd-ledger mb-8 grid grid-cols-2 gap-y-3 sm:grid-cols-5 sm:divide-x sm:divide-edge/60">
    <Totals label="Sessions" value={String(t.sessions)} />
    <Totals label="Snippets" value={String(t.snippetsTyped)} />
    <Totals label="Mastered" value={String(t.snippetsMastered)} />
    <Totals label="Avg acc" value={`${Math.round(t.avgAccuracy * 100)}%`} />
    <Totals label="Speed tests" value={String(t.speedTests)} />
  </div>
)}
```

Replace the `Totals` component (lines 147-158) with:

```tsx
function Totals({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2.5 text-center">
      <div className="font-display text-2xl font-semibold tabular-nums text-ink">
        {value}
      </div>
      <div className="text-[10px] font-medium uppercase tracking-widest text-muted">
        {label}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Concept cards become index-card tiles**

For each concept card (currently `className="flex flex-col rounded-xl border border-edge/70 bg-surface p-4"`, line 77), change to `className="sd-rise relative flex flex-col rounded-lg border border-edge/70 bg-surface p-4 pt-7"` and add two punched holes as the first children:

```tsx
<span className="index-hole left-5" aria-hidden />
<span className="index-hole left-11" aria-hidden />
```

Change `TrackStat` (lines 160-171) root className from `rounded-lg bg-raised/60 px-2 py-1.5 text-center` to `rounded-[2px] bg-raised/60 px-2 py-1.5 text-center`. Change the difficulty `Link` classNames (line 116) from `rounded-md border ...` to `rounded-[2px] border ...`.

- [ ] **Step 4: Speed CTA row becomes a plate**

In the speed CTA panel (lines 128-141): change the panel className `rounded-xl` to `rounded-lg`; above the `h2` "Raw speed test" add:

```tsx
<span className="sd-stamp sd-stamp-accent mb-2 inline-flex">Speed test</span>
```

Change the CTA `Link` className (line 137) from `rounded-xl bg-accent ...` to `rounded-[2px] bg-accent ...`.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`. Expected: all pass. Grep `src/app/(app)/app/page.tsx` for `rounded-xl|rounded-md` must find nothing.

- [ ] **Step 6: Commit**

```bash
git add 'src/app/(app)/app/page.tsx'
git commit -m "feat: ledger and index-card treatment for the tracks dashboard"
```

---

### Task 4: Practice screen restyle and difficulty tokens

**Files:**
- Modify: `src/lib/concepts.ts`
- Modify: `src/app/(app)/practice/PracticeScreen.tsx`

**Interfaces:**
- Consumes: Task 2 primitives (`.sd-eyebrow`, `.sd-ledger`, `.sd-stamp`), Task 4's own `StatChip` restyle (done in Task 5; for this task keep using the current `StatChip`), the `DIFFICULTIES` change below.
- Produces: `DIFFICULTIES` entries with a `tone` field and no `color` field; `LANGUAGES` meta without a `color` field; the practice flow in workbook form.

- [ ] **Step 1: Make difficulty and language colors token-driven**

In `src/lib/concepts.ts`:

- In the `DIFFICULTIES` array (lines 85-89) replace `color: "#9ece6a"` with `tone: "good"`, `color: "#e0af68"` with `tone: "warn"`, `color: "#f7768e"` with `tone: "bad"`. Keep `id` and `name` exactly.
- In the `LanguageMeta` interface (lines 57-62) remove the `color: string;` field, and remove the `color` line from each of the three `LANGUAGES` entries. Keep `name`, `short`, `prism`.

Add below the imports a tone-to-class map and export it:

```ts
export const DIFFICULTY_TEXT: Record<string, string> = {
  beginner: "text-good",
  intermediate: "text-warn",
  advanced: "text-bad",
};
```

- [ ] **Step 2: Fix the difficulty chip in `PracticeScreen.tsx`**

Replace the difficulty `<span>` (lines 218-227), which currently uses an inline `style` with `DIFFICULTIES.find(...)?.color`, with:

```tsx
<span
  className={`rounded-[2px] border border-edge bg-surface px-2 py-1 font-medium ${
    DIFFICULTY_TEXT[snippet.difficulty] ?? "text-accent"
  }`}
>
  {snippet.difficulty}
</span>
```

Add `DIFFICULTY_TEXT` to the existing `import { CONCEPTS, DIFFICULTIES, LANGUAGES } from "@/lib/concepts"` at the top of the file.

Also change the language short and concept chips (lines 212 and 215) from `rounded-md` to `rounded-[2px]`.

- [ ] **Step 3: Add the eyebrow and square the config phase**

In `ConfigPanel`: above the `h1` "Practice" (line 464) add `<p className="sd-eyebrow mb-1">// drill session</p>`. Change the language and difficulty `<button>` classNames from `rounded-lg` to `rounded-[2px]`; the concept `<button>` className from `rounded-xl` to `rounded-[2px]`; the info box (line 534) from `rounded-xl` to `rounded-lg`; the "Start session" button (line 543) from `rounded-xl` to `rounded-[2px]`.

- [ ] **Step 4: Square the progress segments and read-phase CTA**

In the progress segment div (line 251) change `rounded-full` to `rounded-[2px]`. The "Start typing" button (line 273) from `rounded-xl` to `rounded-[2px]`.

- [ ] **Step 5: Mastered milestone becomes a rubber stamp**

In the result card (line 324), replace:

```tsx
<span className="rounded-full bg-good/15 px-2.5 py-1 text-xs font-semibold text-good">✓ Mastered</span>
```

with:

```tsx
<span className="sd-stamp">✓ Mastered</span>
```

`prefers-reduced-motion` already disables the stamp animation via the existing `@media` block. The result card itself (line 316) changes from `rounded-xl` to `rounded-lg`.

- [ ] **Step 6: Square result and summary controls and info boxes**

In the result phase: the Retry and Run buttons (lines 343, 352) from `rounded-xl` to `rounded-[2px]`; the primary Next/Finish button (line 359) from `rounded-xl` to `rounded-[2px]`; the Python-loading note (line 392) from `rounded-xl` to `rounded-lg`; the output box (line 412) from `rounded-xl` to `rounded-lg` (its inner header and body are unchanged).

In `Summary`: above the `h1` "Session complete" (line 574) add `<p className="sd-eyebrow mb-1">// drill session</p>`. Replace the mastered pill (lines 575-577) with:

```tsx
<span className="sd-stamp">
  {mastered}/{results.length} mastered
</span>
```

The info box (line 587) from `rounded-xl` to `rounded-lg`; the two buttons/links (lines 598, 604) from `rounded-xl` to `rounded-[2px]`.

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`. Expected: all pass. Grep `src/app/(app)/practice/PracticeScreen.tsx` for `rounded-full|rounded-xl|rounded-md` and `\.color` must find nothing. Grep `src/lib/concepts.ts` for `#9ece6a|#e0af68|#f7768e|#7aa2f7` must find nothing.

- [ ] **Step 8: Commit**

```bash
git add src/lib/concepts.ts 'src/app/(app)/practice/PracticeScreen.tsx'
git commit -m "feat: token-driven difficulty colors and workbook practice screens"
```

---

### Task 5: Shared components and speed test restyle

**Files:**
- Modify: `src/components/StatChip.tsx`
- Modify: `src/components/VerdictBanner.tsx`
- Modify: `src/components/CodeBlock.tsx`
- Modify: `src/components/CodeEditor.tsx`
- Modify: `src/app/(app)/speed/SpeedScreen.tsx`

**Interfaces:**
- Consumes: Task 2 primitives (`.sd-ledger`).
- Produces: the ledger-cell `StatChip` (same `label`/`value`/`accent` props) that Task 6's summary grid will also use.

- [ ] **Step 1: Make `StatChip` a ledger cell**

In `src/components/StatChip.tsx`, change the root div to remove its border, background, and radius:

```tsx
<div className="flex min-w-[92px] flex-col items-center gap-0.5 px-4 py-3">
  <div className={`font-display text-xl font-semibold tabular-nums ${accent ? "text-accent" : "text-ink"}`}>
    {value}
  </div>
  <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
    {label}
  </div>
</div>
```

The props and their types are unchanged.

- [ ] **Step 2: Square `VerdictBanner`, `CodeBlock`, and framed `CodeEditor`**

- `src/components/VerdictBanner.tsx`: root className `rounded-xl border ...` to `rounded-lg border ...`.
- `src/components/CodeBlock.tsx`: root className `... rounded-xl border ...` to `... rounded-lg border ...`.
- `src/components/CodeEditor.tsx`: in the non-`bare` branch, change `rounded-xl border bg-surface px-5 py-4` to `rounded-lg border bg-surface px-5 py-4`. Leave the `bare` branch and the focus ring untouched.

- [ ] **Step 3: Fix the speed test mojibake**

In `src/app/(app)/speed/SpeedScreen.tsx` line 474, the string currently reads `Plain words, no code â€” measure raw typing speed and accuracy.` Replace the whole line with:

```tsx
        <p className="mt-1 text-sm text-muted">
          Plain words, no code. Measure raw typing speed and accuracy.
        </p>
```

- [ ] **Step 4: Square the speed config phase**

In `SpeedConfigPanel`: above the `h1` "Speed test" (line 470) add `<p className="sd-eyebrow mb-1">// speed test</p>`. The mode and target `<button>` classNames (lines 487, 508) from `rounded-lg` to `rounded-[2px]`; the "Start test" button (line 522) from `rounded-xl` to `rounded-[2px]`.

- [ ] **Step 5: Square the typing card and ConfigBar**

The typing card (line 191) from `rounded-2xl` to `rounded-lg`. The `ConfigBar` container (line 255) from `rounded-lg` to `rounded-[2px]` and its inner buttons (lines 263, 278) from `rounded-md` to `rounded-[2px]`; the restart button (line 184) from `rounded-lg` to `rounded-[2px]`. Wrap the type-phase StatChip row (lines 193-216) in `<div className="sd-ledger grid grid-cols-3 divide-x divide-edge/60 px-4 pt-4 sm:px-5">...</div>` (the StatChips themselves stay; the container adds the ledger rules). Keep the footer strip and `WordStream` as-is.

- [ ] **Step 6: Result plate with ledger stats**

In `SpeedResult`: the result container (line 419) from `rounded-2xl` to `rounded-lg`, add `relative` to its className, and add two punched holes as its first children:

```tsx
<span className="index-hole left-10" aria-hidden />
<span className="index-hole left-16" aria-hidden />
```

The giant WPM numeral and "words per minute" label stay. Wrap the StatChip grid (lines 426-431) in `className="sd-ledger mx-auto mt-8 grid max-w-md grid-cols-2 gap-y-3 sm:grid-cols-4 sm:divide-x sm:divide-edge/60"` (drop the old `gap-2`). The "Go again" and "Change test" buttons (lines 435, 441) from `rounded-xl` to `rounded-[2px]`.

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`. Expected: all pass. Grep `src/app/(app)/speed/SpeedScreen.tsx` for `rounded-2xl|rounded-md|â€”` must find nothing.

- [ ] **Step 8: Commit**

```bash
git add src/components/StatChip.tsx src/components/VerdictBanner.tsx src/components/CodeBlock.tsx src/components/CodeEditor.tsx 'src/app/(app)/speed/SpeedScreen.tsx'
git commit -m "feat: ledger stat cells and workbook speed test"
```

---

### Task 6: ThemePicker as six ledger rows

**Files:**
- Modify: `src/lib/themes.ts`
- Modify: `src/components/theme/ThemeProvider.tsx`
- Modify: `src/components/theme/ThemePicker.tsx`
- Modify: `src/app/(app)/settings/SettingsPanel.tsx`

**Interfaces:**
- Consumes: Task 1 location, existing `useTheme` context.
- Produces: `COLORWAYS` entries with `descriptions: Record<ThemeMode, string>` (the old single `description` is gone); a new `setVariant(next: ThemeId)` method on the theme context. The picker is used by `SettingsPanel` as `<ThemePicker />` with no props.

- [ ] **Step 1: Per-mode descriptions in `themes.ts`**

In `src/lib/themes.ts`:
- In the `Colorway` interface (lines 7-13) replace `description: string;` with `descriptions: Record<ThemeMode, string>;`.
- In each of the three `COLORWAYS` entries, replace the `description` line with `descriptions:` using exactly:

```ts
// paper
descriptions: {
  light: "Cream stock, ink, vermilion. The classic field guide.",
  dark: "The reading room. Warm lamplit charcoal.",
},
// night
descriptions: {
  light: "Library slate and lamp-blue ink.",
  dark: "Night shift. Deep blue-charcoal.",
},
// pencil
descriptions: {
  light: "Graphite, cool paper, slate-teal marks.",
  dark: "Field notebook graphite, heavy shadow.",
},
```

Keep `id`, `name`, and `swatches` unchanged. `ThemeMode` is already exported from this file.

- [ ] **Step 2: Add `setVariant` to the theme context**

In `src/components/theme/ThemeProvider.tsx`:
- Add `setVariant: (theme: ThemeId) => void;` to the `ThemeContextValue` interface.
- Add the callback:

```tsx
const setVariant = useCallback((next: ThemeId) => {
  applyTheme(next);
}, [applyTheme]);
```

- Include `setVariant` in the `value` object and its `useMemo` dependency array (lines 83-86).

- [ ] **Step 3: Rewrite `ThemePicker.tsx`**

Replace the whole file with:

```tsx
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
```

The `compact` prop, the `ModeControl` component, the `rounded-full` dots, the `border-black/10` hardcoded color, and the `colorwayOf`/`mode`/`setTheme`/`setMode` usage are all gone. Verify with grep that nothing else in `src/` imports `ModeControl` or uses `<ThemePicker compact` (only `SettingsPanel.tsx` uses `<ThemePicker />`).

- [ ] **Step 4: Square `SettingsPanel` inputs and buttons**

In `src/app/(app)/settings/SettingsPanel.tsx`: find the shared input className (called `inputCls`) and change `rounded-lg` to `rounded-[2px]`; change every primary/destructive button `rounded-lg` to `rounded-[2px]`; change every section container `rounded-xl` to `rounded-lg`; the GitHub row `rounded-lg bg-raised/60` to `rounded-[2px] bg-raised/60`. Leave the `h-12 w-12 rounded-full` account avatar as-is.

- [ ] **Step 5: Eyebrow on the settings page**

In `src/app/(app)/settings/page.tsx`, above the `h1` "Settings" (line 31) add `<p className="sd-eyebrow mb-1">// account</p>`.

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`. Expected: all pass. Grep `src/components/theme/ThemePicker.tsx` for `rounded-full|border-black|ModeControl|compact` must find nothing. Grep `src/lib/themes.ts` for `description` (singular field access, i.e. `\.description\b`) must find nothing.

- [ ] **Step 7: Commit**

```bash
git add src/lib/themes.ts src/components/theme/ThemeProvider.tsx src/components/theme/ThemePicker.tsx 'src/app/(app)/settings/SettingsPanel.tsx' 'src/app/(app)/settings/page.tsx'
git commit -m "feat: six-variant theme ledger picker"
```

---

### Task 7: Progress restyle

**Files:**
- Modify: `src/app/(app)/progress/page.tsx`
- Modify: `src/components/progress/StreakCard.tsx`
- Modify: `src/components/progress/SpeedBests.tsx`
- Modify: `src/components/progress/ConceptBars.tsx`
- Modify: `src/components/progress/HistoryList.tsx`

**Interfaces:**
- Consumes: Task 2 primitives (`.sd-eyebrow`), Task 1 location.
- Produces: workbook-form progress pages. `TrendChart.tsx` stays untouched.

- [ ] **Step 1: Eyebrow and reveals on the page**

In `src/app/(app)/progress/page.tsx`, above the `h1` "Progress" (line 39) add `<p className="sd-eyebrow mb-1">// field record</p>`. The heading and layout are otherwise unchanged.

- [ ] **Step 2: Square corners and add reveals to the cards**

- `StreakCard.tsx`: change the root card `rounded-xl` to `rounded-lg`, add `sd-rise` to its className.
- `SpeedBests.tsx`: change the root card `rounded-xl` to `rounded-lg`, add `sd-rise`; change each `BestTable` row `rounded-lg bg-raised/60` to `rounded-[2px] bg-raised/60`.
- `ConceptBars.tsx`: change the bar track div `h-2 overflow-hidden rounded-full bg-raised` to `h-2 overflow-hidden rounded-[2px] bg-raised` and the fill div `h-full rounded-full bg-accent transition-[width]` to `h-full rounded-[2px] bg-accent transition-[width]`; change the root card `rounded-xl` to `rounded-lg`, add `sd-rise`.
- `HistoryList.tsx`: change the root card `rounded-xl` to `rounded-lg`, add `sd-rise`. Leave the day headers, kind chips, and rows as they are.

Do not touch `TrendChart.tsx`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`. Expected: all pass. Grep `src/components/progress/` for `rounded-full` must find nothing. Grep `src/app/(app)/progress/` and `src/components/progress/` for `rounded-xl` must find nothing (except `TrendChart.tsx` if present).

- [ ] **Step 4: Commit**

```bash
git add 'src/app/(app)/progress/page.tsx' src/components/progress/StreakCard.tsx src/components/progress/SpeedBests.tsx src/components/progress/ConceptBars.tsx src/components/progress/HistoryList.tsx
git commit -m "feat: workbook progress pages"
```

---

### Task 8: Scenes, sign-in, and shared framing

**Files:**
- Modify: `src/components/scenes/ServerConnectScene.tsx`
- Modify: `src/app/signin/SigninCard.tsx`

**Interfaces:**
- Consumes: Task 1 (sign-in stays outside the group).
- Produces: consistent scene and auth surfaces. Nothing else depends on these.

- [ ] **Step 1: ServerConnectScene**

In `src/components/scenes/ServerConnectScene.tsx`:
- Change the three status dot spans (lines 35, 37-38, 40) from `rounded-full` to `rounded-[2px]`.
- The middle dot (lines 37-38) currently uses `style={{ background: "var(--sd-warn)" }}`: remove the inline style and add `bg-warn` to its className instead.
- Replace the emoji characters in the final verdict line: `✅` to `✓` and `❌` to `✗` (the surrounding `text-good`/`text-bad` classes stay).
- The terminal frame `rounded-xl` to `rounded-lg`.

- [ ] **Step 2: SigninCard**

In `src/app/signin/SigninCard.tsx`:
- The card root `rounded-2xl` to `rounded-lg`.
- The tab switch container `rounded-lg border ... p-0.5` to `rounded-[2px] border ... p-0.5`, and its inner buttons `rounded-md` to `rounded-[2px]`.
- The GitHub CTA `rounded-lg bg-page ...` to `rounded-[2px] bg-page ...`.
- The inputs `rounded-lg bg-raised` to `rounded-[2px] bg-raised`.
- The submit button `rounded-lg bg-accent` to `rounded-[2px] bg-accent`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`. Expected: all pass. Grep `src/components/scenes/ServerConnectScene.tsx` for `rounded-full|✅|❌|var(--sd-` must find nothing.

- [ ] **Step 4: Commit**

```bash
git add src/components/scenes/ServerConnectScene.tsx src/app/signin/SigninCard.tsx
git commit -m "feat: workbook scenes and sign-in"
```

---

### Task 9: Final sweep and verification

**Files:**
- Verify only; make no code changes unless a check fails, then fix and add a commit.

**Interfaces:**
- Consumes: everything above.
- Produces: the final reviewed state and a clean working tree.

- [ ] **Step 1: Run the gates**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`. All must pass; the build must list all 11 routes including `/app`, `/practice`, `/speed`, `/settings`, `/progress`.

- [ ] **Step 2: Sweep greps**

Run each of these (via the grep tool or `Select-String`) and confirm the expected result:

1. `rounded-full` in `src/components/`, `src/app/(app)/`, `src/app/signin/` — allowed matches only: `AccountButton.tsx` (the `rounded-full` on the avatar `<img>` and nothing else), `SettingsPanel.tsx` (the `h-12 w-12 rounded-full` avatar). No `rounded-full` pills or bars anywhere else.
2. `—` or `–` in chrome copy (`src/components/`, `src/app/(app)/`, `src/app/signin/`) — zero. Comments are exempt but the mojibake and all copy dashes must be gone.
3. `#9ece6a|#e0af68|#f7768e|#7aa2f7` in `src/` — zero.
4. `rounded-2xl` and `rounded-xl` in `src/app/(app)/` — zero.
5. `style={{ background` in `src/components/`, `src/app/(app)/`, `src/app/signin/` — zero.
6. `â€` in `src/` — zero.

- [ ] **Step 3: Route sanity**

If `npm run dev` is practical, spot-check `/app`, `/practice`, `/speed`, `/settings`, `/progress`, `/signin` render without layout errors (header present, skip link targets `#main`). If not practical, rely on the build output and a code read of the `(app)/layout.tsx`.

- [ ] **Step 4: If any check failed**

Fix the smallest code change needed, re-run the gates, and commit as `fix: phase b sweep fixes`. If everything passed, skip this step (no commit for this task).

- [ ] **Step 5: Report**

Report: gates PASS/FAIL, each sweep count, route sanity result, and the final `git log --oneline` for this phase.

---

## Self-Review Notes

- **Spec coverage:** header + nav (T2), route-group layout (T1), tracks (T3), practice incl. stamp + difficulty tokens (T4), speed incl. mojibake (T5), ThemePicker 6 rows + settings (T6), progress (T7), scenes + sign-in + shared radii (T8), non-token leaks (T4/T5/T6/T8), copy rules (T5/T8, sweep T9), verification (T9). TrendChart, FinishLineScene, landing, token values, and logic are explicitly excluded per spec.
- **Consistency:** `setVariant` is defined and exposed in T6 and consumed only by the new `ThemePicker`. `DIFFICULTY_TEXT` is defined in `concepts.ts` (T4) and used in `PracticeScreen.tsx` (T4). `themeId`/`ThemeId`/`ThemeMode` are already exported by `themes.ts` and reused in T6. `StatChip` props are unchanged across its restyle (T5) and its consumers (T4/T5).
- **Placeholders:** none; every step carries exact code or exact file/line instructions.
