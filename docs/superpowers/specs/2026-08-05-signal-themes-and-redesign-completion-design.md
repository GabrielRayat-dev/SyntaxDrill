# SyntaxDrill Signal Themes + Redesign Completion

**Date:** 2026-08-05
**Status:** Approved design, spec for review

## Design Read

> The Codex "Signal Dark" redesign (uncommitted on branch `Re-design-v2`)
> applied the new dark, technical-editorial language to the app shell, landing,
> and sign-in, but left the interior of Settings and Progress (and parts of
> Practice/Speed) in the old "paper card" vocabulary, and removed the theme
> picker entirely. This change completes the redesign and brings back a
> curated theme system in the same design language: two colorways (Signal,
> Graphite) x two modes (light, dark), with the app workspace following the
> saved theme while the landing and sign-in stay fixed on dark signal.

## Decisions

- **Approach:** Refactor the existing theme plumbing in place
  (`ThemeProvider` / `lib/themes.ts` / `lib/localStore` stay). Only the data
  model and CSS palettes change. No new dependency.
- **Theme set:** `signal` (cobalt blue-black), `graphite` (neutral), each in
  `dark` and `light`. Default is `signal` (dark). Theme ids follow the
  existing convention: base id = dark, `${id}-light` = light. So the four ids
  are `signal`, `signal-light`, `graphite`, `graphite-light`.
- **Scope of theming:** The app workspace (`/app`, `/practice`, `/speed`,
  `/progress`, `/settings`) follows the saved theme. The landing page and
  sign-in stay hardcoded to dark `signal`.
- **Redesign completion:** Full app audit. Every app surface moves into the
  signal vocabulary (hairline rows, mono numerals, `signal-cta` actions,
  `signal-kicker` labels, cut-corner/10px radius only where interactive). No
  new design system; reuse the existing signal CSS classes and tokens.
- **Progress page:** Rebuilt around bars (7-day streak strip, horizontal
  speed bars, vertical trend bars, mastery bars) with hairline section
  hierarchy, per the design-taste audit below.

## Scope

Modified files (planned; exact task breakdown in the implementation plan):

- `src/lib/themes.ts` — colorways, legacy map, default theme.
- `src/app/layout.tsx` — `themeScript` default + legacy map, font loads stay.
- `src/app/globals.css` — replace the five `[data-theme]` blocks with four
  new palettes; add signal input/section/theme-control primitives; remove or
  re-token hardcoded colors that break in light mode.
- `src/app/(app)/layout.tsx` — drop the forced `data-theme="night"`.
- `src/app/page.tsx` (landing), `src/app/signin/page.tsx`,
  `src/app/signin/SigninCard.tsx` — switch hardcoded `night` to `signal`;
  landing fixes (nav CTA, tracks copy, roadmap copy, typing).
- `src/app/(app)/settings/page.tsx`, `src/app/(app)/settings/SettingsPanel.tsx`
  — settings restyle + restored Theme section.
- `src/components/theme/ThemePicker.tsx`, `src/components/theme/ModeToggle.tsx`
  — restyle to signal vocabulary (segmented mode control + colorway cards).
- `src/components/progress/*` (StreakCard, SpeedBests, TrendChart,
  ConceptBars, HistoryList), `src/app/(app)/progress/page.tsx` — progress
  redesign.
- `src/app/(app)/practice/PracticeScreen.tsx`,
  `src/app/(app)/speed/SpeedScreen.tsx` — restyle Config/Summary/Result
  panels; remove dormant `index-hole` markup.
- `src/components/landing/HeroDemo.tsx` — remove dormant `index-hole` /
  `sd-stamp`; `src/components/landing/LandingStats.tsx` — remove `font-display`
  serif leak.
- `src/components/AccountButton.tsx`, `src/components/StatChip.tsx`,
  `src/components/CodeBlock.tsx`, `src/components/AppHeader.tsx` — shared
  component alignment.

Untouched: runner, DB/schema/API, `src/lib/config.ts`, snippet content,
`content/` (all snippet files), landing/sign-in theming behavior (stays dark).

---

## 1. Theme System

### 1.1 Data model (`src/lib/themes.ts`)

- `ColorwayId = "signal" | "graphite"`.
- `ThemeId = ColorwayId | `${ColorwayId}-light`` — i.e. `signal`,
  `signal-light`, `graphite`, `graphite-light`.
- `COLORWAYS` redefined with descriptions + swatches for the picker:
  - **signal** — dark: "Blue-black surfaces, soft cobalt." light: "Cool
    paper-white, cobalt ink."
  - **graphite** — dark: "Neutral graphite, one cobalt accent." light: "Cool
    neutral paper, graphite ink."
- `themeId` / `colorwayOf` / `modeOf` / `isThemeId` / `migrateTheme` logic is
  unchanged (it is convention-driven).
- `DEFAULT_THEME = "signal"`.

### 1.2 Legacy migration

Extend `LEGACY_THEMES` so every previously-stored id resolves to the new set,
preserving the user's light/dark mode:

- Dark → `signal`: `night`, `paper`, `pencil`, `tokyo-night`, `rose-pine`,
  `dracula`, `sunset`.
- Light → `signal-light`: `paper-light`, `pencil-light`, `tokyo-night-light`,
  `rose-pine-light`, `dracula-light`, `sunset-light`.

Graphite is new; no legacy id maps to it.

### 1.3 CSS palettes (`src/app/globals.css`)

Replace the five existing `[data-theme]` blocks (`night`, `paper-light`,
`paper`, `pencil`, `pencil-light`) with four:

- `[data-theme="signal"]` — current deepened night tokens, unchanged:
  bg `#090b10`, surface `#10141d`, raised `#171c27`, border `#29303d`,
  text `#f1f4f8`, muted `#9aa5b7`, accent `#8fa6ff`, accent-2 `#8fa6ff`,
  correct `#8fd7b1`, error `#f28d97`, warn `#e7bf78`, caret `#8fa6ff`,
  glow `rgba(143,166,255,0.18)`; `color-scheme: dark`.
- `[data-theme="signal-light"]` — new:
  bg `#f4f6fa`, surface `#ffffff`, raised `#eef1f6`, border `#d7dce6`,
  text `#141821`, muted `#5b6573`, accent `#4658d0`, accent-2 `#4658d0`,
  correct `#1f7a4f`, error `#c03a48`, warn `#a06c16`, caret `#4658d0`,
  glow `rgba(70,88,208,0.16)`; `color-scheme: light`.
- `[data-theme="graphite"]` — new (neutral grays, cobalt accent):
  bg `#0a0c0f`, surface `#101318`, raised `#171a20`, border `#262a31`,
  text `#eef0f3`, muted `#9aa0aa`, accent `#8fa6ff`, accent-2 `#8fa6ff`,
  correct `#8fd7b1`, error `#f28d97`, warn `#e7bf78`, caret `#8fa6ff`,
  glow `rgba(143,166,255,0.18)`; `color-scheme: dark`.
- `[data-theme="graphite-light"]` — new:
  bg `#f2f3f5`, surface `#ffffff`, raised `#eceef1`, border `#d4d7dc`,
  text `#16181c`, muted `#5c616a`, accent `#4658d0`, accent-2 `#4658d0`,
  correct `#1f7a4f`, error `#c03a48`, warn `#a06c16`, caret `#4658d0`,
  glow `rgba(70,88,208,0.16)`; `color-scheme: light`.

The `@theme inline` block (color tokens mapped to `--sd-*`) stays as-is; the
four palettes drive it. Prism `.token` rules already consume `--sd-*` vars and
work under every palette.

### 1.4 Wrapper and bootstrap theme

- `src/app/(app)/layout.tsx`: the app wrapper becomes
  `<div className="signal-app min-h-[100dvh]">` (no `data-theme`), so the app
  inherits the theme set on `documentElement` by `themeScript` /
  `ThemeProvider`.
- Landing (`src/app/page.tsx`) and sign-in (`src/app/signin/page.tsx`)
  wrappers change `data-theme="night"` to `data-theme="signal"` so those pages
  stay dark regardless of the saved theme.
- `src/app/layout.tsx` `themeScript`: default `s="signal"`, and the inline
  legacy map updated to match 1.2. (The `LEGACY_THEMES` const and the script
  must stay in sync.)

### 1.5 Settings theme section

A new "Theme" section in `SettingsPanel`, between Password and Connected
accounts. Composed from the restyled `ThemePicker` + `ModeToggle` logic:

- A light/dark segmented control (two options, signal styling, cobalt active
  indicator) driving `setMode`.
- Two colorway cards (Signal / Graphite) with mini swatches and description
  driving `setVariant`, active state marked.

Restyle both existing components to the signal vocabulary (replace
`rounded-[2px]`/`rounded-lg border bg-surface` cards with the signal input /
card primitives; keep `aria-pressed` and `useTheme` logic intact).

### 1.6 Hardcoded-color audit

Sweep app components for fixed colors that break in light mode and tokenize
them: `CodeEditor.tsx`, overlays, and the landing-only hardcoded surfaces
(`.signal-tracks` `#0d1017`, `.signal-final-cta` `#10141d`, `.signal-auth-card`
shadows) — landing-only ones may stay (landing is always dark) but should be
checked; app ones (e.g. `.signal-app-callout` radial `rgb(122 162 224 / .16)`)
must use `--sd-*` tokens. Buttons that keep dark text on the accent
(`.signal-cta:hover` color `#10131d`, `.signal-auth-submit` color `#10131d`)
work in both modes and stay.

---

## 2. Redesign Completion (Full App Audit)

Every remaining "paper card" surface moves to the signal vocabulary. The
recurring replacements:

- Boxed cards `sd-rise rounded-lg border border-edge/70 bg-surface p-5` →
  hairline-separated rows on the page background (`border-t`, `divide-y`,
  `signal-app-track`-style rows), or the `signal-app-metrics` band for metric
  clusters.
- `rounded-[2px]` buttons/inputs → `signal-cta` (cut-corner primary), quiet
  secondary text actions, and a new `signal-input` primitive styled like
  `signal-auth-input`.
- `font-display` (serif) → Geist/sans display styling; `font-mono` for every
  number and micro-label.
- `text-[10px] font-medium uppercase tracking-widest` micro-labels →
  `signal-kicker` (mono, tracking, uppercase) where a label is needed, per the
  eyebrow-restraint rule (no more than ~1 eyebrow per 3 sections).

### 2.1 Settings

- `SettingsPanel`: inputs → `signal-input`; submit actions → `signal-cta`;
  destructive "Remove password" → quiet secondary/bad-text action; avatar →
  cut-corner tile (rounded-md, not circle); labels → mono micro-labels;
  sections become hairline groups with `signal-kicker`-style headers; add the
  Theme section (1.5).

### 2.2 Practice + Speed

- `PracticeScreen` ConfigPanel / Session / Summary and `SpeedScreen`
  ConfigPanel / results: convert remaining boxed cards to the signal row
  language, `signal-cta` for primary actions, styled selects, mono numerals
  for stats, `signal-kicker` headers (already present). Remove dormant
  `index-hole` spans in `SpeedScreen`.

### 2.3 Shared components

- `AccountButton`: squircle/rounded-md avatar tile (app header), menu restyle
  to signal rows.
- `StatChip`: `font-display` → `font-mono` numerals.
- `CodeBlock`: confirm radius/token consistency (fine; keep).
- `AppHeader`: menu/rows alignment under the new nav.

### 2.4 Dormant paper markup + serif leak

- Remove `index-hole` spans (`SpeedScreen`, `HeroDemo`) and `sd-stamp`
  (`HeroDemo`) now hidden by `.signal-*` CSS.
- `LandingStats` (landing) currently renders `font-display` (serif) with no
  `.signal-page` override — replace with the signal sans treatment so the
  landing stats band matches the Geist hero. Audit remaining `font-display`
  usages; none may visibly render serif on signal surfaces.

---

## 3. Progress Page Redesign

**Design read:** personal metrics for a developer, signal dark-technical
language. Dials: Variance 5 / Motion 3 / Density 6. Bars + mono numerals +
hairline hierarchy + one accent; no floating cards.

Page structure (in `progress/page.tsx`): keep back link, `signal-kicker`
"Your history", and `text-4xl` heading. Sections stack with `border-t`
hairlines and `text-xl font-medium tracking-[-0.035em]` headers. Replace the
`grid gap-3 sm:grid-cols-2` + `mb-6` card stack.

### 3.1 Streaks → metrics band + 7-day bars (`StreakCard`)

- Top band styled like `signal-app-metrics`: two mono numerals — Current
  (accent) and Longest — with mono micro-labels.
- Below: a 7-day activity strip: one thin vertical bar per calendar day of the
  last week; filled with accent on practiced days, muted when idle, current
  day outlined. `aria-label` on the strip.
- Empty state: composed copy + the strip with empty bars.

### 3.2 Speed bests → horizontal bars (`SpeedBests`)

- Replace the two `BestTable` columns with one list under mono group labels
  (`TIME`, `WORDS`).
- Each target (`15s 30s 60s 10w 25w 50w`) is a row: label left, horizontal
  track bar scaled to the group's best WPM, mono value right-aligned.
- Unattempted targets render an empty track + muted `—`.
- Empty state: composed copy, no card.

### 3.3 Trend → vertical bars (`TrendChart`)

- Keep SVG-based chart; replace the two polylines with one accent bar per
  recent session (height scaled to WPM) + an accuracy hairline in
  `--sd-correct` overlaid; faint `--sd-border` gridlines; mono legend (WPM /
  Accuracy chips); `role="img"` + descriptive `aria-label` retained.
- Empty state as now.

### 3.4 Concepts → mastery bar rows (`ConceptBars`)

- Open `border-b` rows (no card): mono concept name, `n/n mastered` mono
  count, track `bg-raised`, accent fill with a width transition.
- Empty state: composed copy.

### 3.5 History → divide-y rows (`HistoryList`)

- Open `divide-y` rows: signal pill kind badge (CODE / SPEED), truncated
  label, right-aligned mono stats (`wpm · % · duration`); grouped under mono
  date headers.
- Empty state: composed copy.

Motion is limited to bar fill / width transitions (transform/opacity only)
and respects `prefers-reduced-motion` (the existing signal CSS already gates
ambient motion).

---

## 4. Landing + Review Fixes

- **Baseline:** commit the Codex redesign on `Re-design-v2` as-is, then run
  `tsc` / `lint` / `build` before any further change.
- **Nav CTA cascade bug:** `.signal-cta { display: inline-flex }` is unlayered
  author CSS and overrides Tailwind's layered `hidden` utility, so the landing
  nav "Start drilling" shows on mobile. Wrap the nav CTA in a
  `hidden sm:block` container (or equivalent) so the responsive hide works.
- **Landing tracks copy:** `TRACK_LANGUAGES` in `src/app/page.tsx` now lists
  all practice languages: the four concepts read "JavaScript + Python + PHP +
  C", `database` reads "JavaScript + Python + PHP + C + SQL".
- **Roadmap copy:** "Difficulty tiers — Next up" is stale (tiers ship);
  reword to current content (e.g. a genuinely upcoming item).
- **Register submit:** add the `02` index marker + arrow to the register
  submit button to match the sign-in execution bar.
- **Type cleanup:** replace `Icon as typeof Braces` in `src/app/page.tsx`
  with a properly typed steps array.

---

## Verification

No automated test framework exists (no test script); verification is:

1. `npx tsc --noEmit` — pass.
2. `npm run lint` — pass.
3. `npm run build` — pass (11 routes unchanged).
4. Manual visual pass in **all four themes** (signal/graphite x dark/light)
   across `/app`, `/practice`, `/speed`, `/progress`, `/settings`, plus the
   landing and sign-in (must stay dark signal). Check: contrast (WCAG AA on
   body text), no serif leakage, no hardcoded-color leftovers, no boxed-card
   stragglers, nav CTA hidden on mobile, register button consistent.
5. Legacy-theme migration check: set `sd.theme` to an old id (e.g. `night`,
   `paper-light`) and confirm it resolves to `signal` / `signal-light`.

## Global Constraints

- No new dependencies (Approach A explicitly rejects adding `next-themes`).
- Snippet content and `content/` untouched. Runner, DB/schema/API,
  `src/lib/config.ts` untouched.
- Landing + sign-in remain fixed dark `signal`; only the app workspace is
  user-themed.
- Existing `ThemeProvider` / `lib/localStore` plumbing is kept; do not remove
  the theme system.
- Keep the existing signal CSS classes and tokens; add primitives only where
  a missing pattern is reused across surfaces (e.g. `signal-input`).
- `prefers-reduced-motion` respected for all new motion.
