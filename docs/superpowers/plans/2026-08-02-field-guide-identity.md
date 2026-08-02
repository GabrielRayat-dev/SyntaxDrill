# Field Guide Landing Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the SyntaxDrill landing page and theme system into a vintage field guide: EB Garamond display type, Source Serif 4 body, warm aged-paper ink-and-vermilion tokens, index-card specimen demo, ledger stats, catalog tracks, and a colophon footer. (Phase A of the approved spec; app chrome is Phase B, out of scope.)

**Architecture:** Retune the existing 6 theme token sets in `globals.css` (CSS-variable swap only, zero structural change), swap landing fonts in `layout.tsx`, add paper-grain/ruled-line/stamp CSS layers, restyle the two landing components (`HeroDemo`, `LandingStats`) plus the squared control primitives (`ModeToggle`, `CodeEditor` bare mode, `AccountButton` radius), and rewrite `src/app/page.tsx` to compose the 9-section landing. All existing routes, anchors, metadata, and the `DEFAULT_THEME = "paper-light"` fix are preserved.

**Tech Stack:** Next.js 16.2.12 (App Router, `src/`), React 19, Tailwind v4, `next/font/google`, lucide-react icons, TypeScript strict. No test framework is configured in this repo (`package.json` has only `dev`, `build`, `start`, `lint`), so every task's verification gate is: `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Global Constraints

> The spec's project-wide requirements, verbatim. Every task implicitly includes this section.

- **Routes & anchors preserved:** `/`, `/app`, `/speed`, `/practice`, `/progress`, `/settings`, `/signin` unchanged. Keep anchor ids `#tracks` and `#features` in the landing. Keep the `#roadmap` id too (nav links to it).
- **Metadata unchanged:** title `SyntaxDrill | Learn syntax by typing it`, template `%s · SyntaxDrill`, description string as currently in `layout.tsx`. Do not edit.
- **Copy rules (no em-dashes, no en-dashes):** zero `—` and zero `–` anywhere in user-visible copy. Middle dot `·` is allowed (it is not a dash). Use plain hyphens for compounds.
- **Hero subtext is exactly 16 words:** "Real JavaScript and Python snippets as drills. Read the pattern, type it from memory, run it."
- **CTA intents:** "Start practicing" is the single primary intent (nav, hero, free plate). "Try a speed test" appears only in the hero as the secondary button. No other CTA copy.
- **No fake numbers:** no version strings, no fabricated stats, no logo walls. Catalog tags (`DR-004`, `SP-01`, `Plate 01`) and the `field guide` wordmark tag are thematic and allowed; roadmap phase notes are allowed.
- **Eyebrow budget (mono `//` lead-ins):** max 3 total on the page. Hero uses `// field catalogue: js + python`, roadmap uses `// what next`. Do not add others.
- **Shape lock:** squared 2px buttons/stamps (`rounded-[2px]`), 8px cards (`rounded-lg`), no `rounded-full` pills anywhere except the signed-in avatar circle in `AccountButton` (intentional, photographic) and tiny status dots in app scenes (Phase B). `ThemePicker.tsx`, `ConceptBars.tsx` and the scenes are Phase B; leave them.
- **Theme token sets:** exactly 6 (`paper-light`, `paper`, `night-light`, `night`, `pencil-light`, `pencil`) in `globals.css`, selected by `[data-theme="..."]`. All UI reads `--sd-*` vars only, never a raw hex. `DEFAULT_THEME = "paper-light"` in `themes.ts` and the inline `themeScript()` default stay as they are.
- **Fonts (Phase A):** EB Garamond = `--font-display`, Source Serif 4 = `--font-serif` (body), JetBrains Mono = `--font-mono` (code/tags/margin notes), Geist = `--font-sans` (app chrome only, untouched this phase). New fonts load via `next/font/google`; no other font dependencies.
- **Verification commands:** `npx tsc --noEmit` then `npm run lint` then `npm run build`, in that order, at the end of every task that changes `.ts/.tsx/.css`. Fix any failure before committing.
- **Git discipline:** commit after every task with a conventional message. Do NOT push unless the user explicitly asks. `git push` requires user confirmation.
- **Secrets:** none involved. Never print or commit credentials. `.env.local` is gitignored.
- **Reduced motion:** any new animation (stamp) must be disabled under `@media (prefers-reduced-motion: reduce)`.

---

### Task 1: Baseline commit (pending Paper-default theme fix)

The working tree already contains a verified, unstaged fix from earlier work: Paper now loads `paper-light` for everyone, the OS-follow effect is gone from `ThemeProvider`, and the old Drillbook spec carries a corrected-default note. Commit it as-is so later task diffs stay clean. Do not revert anything.

**Files:**
- Commit: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/theme/ThemeProvider.tsx`, `src/lib/themes.ts`, `docs/superpowers/specs/2026-08-01-drillbook-identity-design.md`
- Test: none (documentation/housekeeping)

- [ ] **Step 1: Confirm the working tree matches expectations**

Run: `git status --short`
Expected: exactly these five modified files, nothing else. If `docs/superpowers/specs/2026-08-02-field-guide-identity-design.md` shows modified, it must NOT be staged here (it was already committed as `db638fa`).

- [ ] **Step 2: Commit the pending fix**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/theme/ThemeProvider.tsx src/lib/themes.ts docs/superpowers/specs/2026-08-01-drillbook-identity-design.md
git commit -m "fix: load paper-light theme by default for all visitors"
```

- [ ] **Step 3: Verify clean tree**

Run: `git status --short`
Expected: empty output (the 2026-08-02 spec is already committed).

---

### Task 2: Retune the six theme token sets + theme picker swatches

Swap all raw hex values inside the six `[data-theme="..."]` blocks of `globals.css` and mirror them in `themes.ts` so the settings picker swatches stay truthful. Structure and variable names are untouched; only values change. Verify with a grep that no old hex survives.

**Files:**
- Modify: `src/app/globals.css` (the 6 token blocks, lines ~25-126)
- Modify: `src/lib/themes.ts` (COLORWAYS `description` + `swatches`, lines ~15-43)

**Interfaces:**
- Consumes: existing `--sd-*` variable names and the `@theme inline` mapping (unchanged).
- Produces: new token values consumed by every component via `bg-page`, `text-ink`, `text-accent`, `border-edge`, `text-good`, `text-bad`, `bg-raised`, `text-muted`, `bg-surface`, `text-accent-2`, `text-warn`.

- [ ] **Step 1: Replace the `paper-light` token block**

In `globals.css`, replace the values inside `:root, [data-theme="paper-light"] { ... }` so the block reads:

```css
:root,
[data-theme="paper-light"] {
  --sd-bg: #f1ecdf;
  --sd-surface: #f8f4e9;
  --sd-raised: #e7e0cd;
  --sd-border: #d9d0ba;
  --sd-text: #23201a;
  --sd-muted: #6f6757;
  --sd-accent: #b3401f;
  --sd-accent-2: #8a4a2e;
  --sd-correct: #49783f;
  --sd-error: #a6352f;
  --sd-warn: #9a6b1f;
  --sd-caret: #b3401f;
  --sd-glow: rgba(179, 64, 31, 0.14);
  color-scheme: light;
}
```

- [ ] **Step 2: Replace the `paper` (dark) token block**

```css
[data-theme="paper"] {
  --sd-bg: #1c1712;
  --sd-surface: #241e16;
  --sd-raised: #2e261b;
  --sd-border: #3d3222;
  --sd-text: #ede5d2;
  --sd-muted: #a2967d;
  --sd-accent: #e0662e;
  --sd-accent-2: #d19a5b;
  --sd-correct: #7fb069;
  --sd-error: #e06c5a;
  --sd-warn: #d9a441;
  --sd-caret: #e0662e;
  --sd-glow: rgba(224, 102, 46, 0.18);
  color-scheme: dark;
}
```

- [ ] **Step 3: Replace the `night` (dark) token block**

```css
[data-theme="night"] {
  --sd-bg: #12161f;
  --sd-surface: #181e2a;
  --sd-raised: #222a3a;
  --sd-border: #303a4c;
  --sd-text: #d8dee9;
  --sd-muted: #93a0b4;
  --sd-accent: #7aa2e0;
  --sd-accent-2: #9b8cff;
  --sd-correct: #5bbf9a;
  --sd-error: #e26d7e;
  --sd-warn: #dfae54;
  --sd-caret: #7aa2e0;
  --sd-glow: rgba(122, 162, 224, 0.18);
  color-scheme: dark;
}
```

- [ ] **Step 4: Replace the `night-light` token block**

```css
[data-theme="night-light"] {
  --sd-bg: #e9ecf2;
  --sd-surface: #f5f6f9;
  --sd-raised: #dde2ea;
  --sd-border: #c8cfda;
  --sd-text: #1d2531;
  --sd-muted: #5d6a7c;
  --sd-accent: #3a63c8;
  --sd-accent-2: #6658d6;
  --sd-correct: #2e8a67;
  --sd-error: #c94a5e;
  --sd-warn: #a47422;
  --sd-caret: #3a63c8;
  --sd-glow: rgba(58, 99, 200, 0.14);
  color-scheme: light;
}
```

- [ ] **Step 5: Replace the `pencil` (dark) token block**

```css
[data-theme="pencil"] {
  --sd-bg: #10151a;
  --sd-surface: #161c22;
  --sd-raised: #1f262d;
  --sd-border: #2c353e;
  --sd-text: #d9dfe4;
  --sd-muted: #87929c;
  --sd-accent: #4f9aa8;
  --sd-accent-2: #7fc2cf;
  --sd-correct: #52b589;
  --sd-error: #e4707c;
  --sd-warn: #c9a04e;
  --sd-caret: #4f9aa8;
  --sd-glow: rgba(79, 154, 168, 0.16);
  color-scheme: dark;
}
```

- [ ] **Step 6: Replace the `pencil-light` token block**

```css
[data-theme="pencil-light"] {
  --sd-bg: #eaedef;
  --sd-surface: #f6f7f8;
  --sd-raised: #dde1e5;
  --sd-border: #c9d0d5;
  --sd-text: #232a31;
  --sd-muted: #5b656f;
  --sd-accent: #3b7f8c;
  --sd-accent-2: #4f8da0;
  --sd-correct: #2f8a63;
  --sd-error: #c24753;
  --sd-warn: #97702b;
  --sd-caret: #3b7f8c;
  --sd-glow: rgba(59, 127, 140, 0.14);
  color-scheme: light;
}
```

- [ ] **Step 7: Update `themes.ts` descriptions and swatches**

In `src/lib/themes.ts`, edit the `COLORWAYS` array so it reads exactly:

```ts
export const COLORWAYS: Colorway[] = [
  {
    id: "paper",
    name: "Paper",
    description: "Aged paper, ink, vermilion.",
    swatches: {
      dark: ["#1c1712", "#e0662e", "#d19a5b", "#7fb069", "#e06c5a"],
      light: ["#f1ecdf", "#b3401f", "#8a4a2e", "#49783f", "#a6352f"],
    },
  },
  {
    id: "night",
    name: "Night",
    description: "Slate and lamp-blue.",
    swatches: {
      dark: ["#12161f", "#7aa2e0", "#9b8cff", "#5bbf9a", "#e26d7e"],
      light: ["#e9ecf2", "#3a63c8", "#6658d6", "#2e8a67", "#c94a5e"],
    },
  },
  {
    id: "pencil",
    name: "Pencil",
    description: "Cool graphite and slate-teal.",
    swatches: {
      dark: ["#10151a", "#4f9aa8", "#7fc2cf", "#52b589", "#e4707c"],
      light: ["#eaedef", "#3b7f8c", "#4f8da0", "#2f8a63", "#c24753"],
    },
  },
];
```

- [ ] **Step 8: Verify no old hexes survive and everything builds**

Run: `rg -n "#f2f4f8|#0f1620|#0b1220|#e9eef5|#0e1114|#eceef1|#2563c9|#4f46c9|#1f9d55|#dc3d5a" src`
Expected: no matches (all stale Drillbook blues/greys are gone).

Run: `npx tsc --noEmit`
Expected: exits 0.

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: successful production build.

- [ ] **Step 9: Commit**

```bash
git add src/app/globals.css src/lib/themes.ts
git commit -m "style: field-guide palettes - aged paper, ink, vermilion across six themes"
```

---

### Task 3: Fonts (EB Garamond + Source Serif 4), serif body, paper-grain overlay

Swap the display font from Space Grotesk to EB Garamond, add Source Serif 4 as the body font, wire both into Tailwind tokens, set the body font-family, and add the fixed paper-grain noise overlay plus its CSS layer.

**Files:**
- Modify: `src/app/layout.tsx` (imports lines 2, 8-21, html className line 49, body lines 58-64)
- Modify: `src/app/globals.css` (the `@theme inline` block lines 3-18, `body` block lines 128-133)

**Interfaces:**
- Consumes: `next/font/google` `EB_Garamond` and `Source_Serif_4` (both support the `variable` option).
- Produces: CSS vars `--font-eb-garamond`, `--font-source-serif-4` on `<html>`; Tailwind tokens `font-display` (EB Garamond), `font-serif` (Source Serif 4), `font-sans` (Geist, unchanged), `font-mono` (JetBrains Mono, unchanged); `.paper-grain` fixed overlay element in `<body>`.

- [ ] **Step 1: Swap the font imports**

In `src/app/layout.tsx`, replace line 2:

```tsx
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
```

with:

```tsx
import { EB_Garamond, Geist, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
```

- [ ] **Step 2: Replace the Space Grotesk registration**

Replace the `spaceGrotesk` const (lines 18-21):

```tsx
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});
```

with two consts:

```tsx
const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
});
```

- [ ] **Step 3: Update the `<html>` className**

Replace line 49:

```tsx
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
```

with:

```tsx
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${ebGaramond.variable} ${sourceSerif4.variable} h-full antialiased`}
```

- [ ] **Step 4: Add the grain overlay element to `<body>`**

Replace the body block (lines 58-64):

```tsx
      <body className="min-h-full">
        <ThemeProvider>
```

with:

```tsx
      <body className="min-h-full">
        <div aria-hidden className="paper-grain" />
        <ThemeProvider>
```

(`aria-hidden` on a purely decorative fixed overlay; the rest of the body structure is unchanged.)

- [ ] **Step 5: Update the Tailwind font tokens**

In `globals.css`, replace the three font lines inside `@theme inline` (lines 15-17):

```css
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-space-grotesk), var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, "Cascadia Code", Menlo, monospace;
```

with:

```css
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-source-serif-4), Georgia, "Times New Roman", serif;
  --font-display: var(--font-eb-garamond), var(--font-source-serif-4), Georgia, serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, "Cascadia Code", Menlo, monospace;
```

- [ ] **Step 6: Set the body font to serif and add the grain CSS**

In `globals.css`, replace the `body` block (lines 128-133):

```css
body {
  background: var(--sd-bg);
  color: var(--sd-text);
  font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

with:

```css
body {
  background: var(--sd-bg);
  color: var(--sd-text);
  font-family: var(--font-source-serif-4), Georgia, "Times New Roman", serif;
  -webkit-font-smoothing: antialiased;
}
```

Then append the grain layer at the end of the file (after the `.sd-rise` rule, before the `@media (prefers-reduced-motion: reduce)` block):

```css
/* Paper-grain overlay, fixed above page content but below nav and menus */
.paper-grain {
  position: fixed;
  inset: 0;
  z-index: 30;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.05;
  mix-blend-mode: overlay;
}
```

- [ ] **Step 7: Verify**

Run: `rg -n "space-grotesk|Space_Grotesk" src`
Expected: no matches.

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`.
Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: EB Garamond and Source Serif 4, serif body, paper-grain overlay"
```

---

### Task 4: Squared controls (ModeToggle, AccountButton radius, CodeEditor bare mode)

Make the shared interactive primitives match the field-guide shape lock and give `CodeEditor` a borderless "bare" mode so it can sit flush inside the specimen card. This task does not change any copy.

**Files:**
- Modify: `src/components/theme/ModeToggle.tsx` (className line 15)
- Modify: `src/components/AccountButton.tsx` (lines 12, 19, 36, 56, 70, 78, 86)
- Modify: `src/components/CodeEditor.tsx` (interface lines 7-15, destructure lines 17-25, className template lines 101-103)

**Interfaces:**
- Consumes: existing `ModeToggle` props (none), existing `AccountButton` props (none), existing `CodeEditor` props.
- Produces: `CodeEditor` gains optional prop `bare?: boolean` (default `false`). When `bare` is true the `<pre>` renders with `px-0 py-0` and no border/bg/ring; when false the current framed look is unchanged. Later tasks use `bare` on the hero specimen card only.

- [ ] **Step 1: Square the ModeToggle**

In `ModeToggle.tsx`, replace the button className (line 15):

```tsx
      className="group flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-edge bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent"
```

with:

```tsx
      className="group flex h-8 w-8 items-center justify-center overflow-hidden rounded-[2px] border border-edge bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent"
```

- [ ] **Step 2: Square the AccountButton controls**

In `AccountButton.tsx` make these exact substitutions:

1. Line 12 (loading skeleton): replace `rounded-full` with `rounded-[2px]`.
2. Line 19 (Sign in link): replace `rounded-lg` with `rounded-[2px]`.
3. Line 36 (avatar button): keep `rounded-full` — this is the one intentional circle (a photo avatar). Do not change it.
4. Line 56 (menu panel): replace `rounded-xl` with `rounded-lg`.
5. Lines 70, 78, 86 (menu items): replace `rounded-lg` with `rounded-[2px]`.

- [ ] **Step 3: Add the `bare` prop to CodeEditor**

In `CodeEditor.tsx`, extend the props interface:

```tsx
interface CodeEditorProps {
  target: string;
  state: EditorState;
  onType: (text: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
  bare?: boolean;
}
```

Update the destructure so `bare = false` is the last parameter:

```tsx
export default function CodeEditor({
  target,
  state,
  onType,
  onBackspace,
  disabled = false,
  className = "",
  autoFocus = true,
  bare = false,
}: CodeEditorProps) {
```

- [ ] **Step 4: Branch the container classes on `bare`**

Replace the className template (lines 101-103):

```tsx
      className={`code-layer relative cursor-text select-none overflow-x-auto rounded-xl border bg-surface px-5 py-4 outline-none transition-colors ${
        focused ? "border-edge ring-1 ring-accent/30" : "border-edge/70"
      } ${className}`}
```

with:

```tsx
      className={`code-layer relative cursor-text select-none overflow-x-auto outline-none transition-colors ${
        bare
          ? "px-0 py-0"
          : `rounded-xl border bg-surface px-5 py-4 ${
              focused ? "border-edge ring-1 ring-accent/30" : "border-edge/70"
            }`
      } ${className}`}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`.
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/theme/ModeToggle.tsx src/components/AccountButton.tsx src/components/CodeEditor.tsx
git commit -m "style: squared controls and CodeEditor bare mode for field-guide cards"
```

---

### Task 5: HeroDemo specimen card + stamp/ruled/hole CSS utilities

Restyle the interactive demo as an index card: punched holes over the top edge, a specimen tag header (`DR-004 · loops · JS`), borderless editor, square ruled ticks for the progress trace, and a margin-note hint that becomes a green "Clean run" rubber stamp on finish. Adds the `.ruled`, `.index-hole`, `.sd-stamp`, `.sd-stamp-accent` utilities to `globals.css`. No copy change other than the strings specified.

**Files:**
- Modify: `src/components/landing/HeroDemo.tsx` (whole render, lines 68-135)
- Modify: `src/app/globals.css` (append utilities + reduced-motion entry)

**Interfaces:**
- Consumes: `CodeEditor` `bare` prop from Task 4; `--sd-*` tokens from Task 2; engine helpers `wpm`, `accuracy`, `charStatuses` (existing).
- Produces: hero specimen card markup consumed by `page.tsx` Task 7 as `<HeroDemo />`. CSS classes `.ruled`, `.index-hole`, `.sd-stamp`, `.sd-stamp-accent` used by Tasks 5 and 7.

- [ ] **Step 1: Append the CSS utilities to globals.css**

Insert after the `.sd-rise` rule (line 288) and before the `@media (prefers-reduced-motion: reduce)` block:

```css
/* Ruled manuscript lines behind the hero field sheet */
.ruled {
  background-image: repeating-linear-gradient(
    to bottom,
    color-mix(in srgb, var(--sd-border) 55%, transparent) 0,
    color-mix(in srgb, var(--sd-border) 55%, transparent) 1px,
    transparent 1px,
    transparent 1.75rem
  );
}

/* Punched index-card holes revealing the page beneath */
.index-hole {
  position: absolute;
  top: -6px;
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  background: var(--sd-bg);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.18), 0 0 0 1px var(--sd-border);
}

/* Rubber-stamp finish for the clean-run and free-forever marks */
.sd-stamp {
  display: inline-flex;
  align-items: center;
  border: 2px solid var(--sd-correct);
  border-radius: 2px;
  color: var(--sd-correct);
  font-family: var(--font-jetbrains-mono), ui-monospace, Menlo, monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  line-height: 1;
  padding: 6px 10px;
  text-transform: uppercase;
  animation: sd-stamp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.sd-stamp-accent {
  border-color: var(--sd-accent);
  color: var(--sd-accent);
}

@keyframes sd-stamp {
  from {
    opacity: 0;
    transform: scale(1.6) rotate(-6deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(-3deg);
  }
}
```

- [ ] **Step 2: Disable the stamp animation under reduced motion**

In the existing `@media (prefers-reduced-motion: reduce)` block (which already contains `.caret-bar` and `.sd-rise`), add:

```css
  .sd-stamp {
    animation: none;
  }
```

- [ ] **Step 3: Replace the HeroDemo render**

In `HeroDemo.tsx`, replace the whole `return (...)` block (lines 68-135) with:

```tsx
  return (
    <div className="sd-rise relative rounded-lg border border-edge bg-surface shadow-[0_18px_40px_-20px_var(--sd-glow)]">
      <span className="index-hole left-10" aria-hidden />
      <span className="index-hole left-16" aria-hidden />
      <div className="flex items-center gap-3 border-b border-edge/70 px-4 pb-3 pt-6 sm:px-5">
        <span className="font-mono text-xs text-muted">
          DR-004 <span className="text-accent">loops</span> · JS
        </span>
        <span className="ml-auto font-mono text-xs tabular-nums text-accent">
          {wpm(editor).toFixed(0)} wpm
        </span>
      </div>
      <div className="px-4 pt-4 sm:px-5">
        <CodeEditor
          target={DEMO_CODE}
          state={editor}
          onType={handleType}
          onBackspace={handleBackspace}
          autoFocus={false}
          bare
        />
      </div>
      <div
        className="flex h-10 items-end gap-[3px] border-t border-dotted border-edge/60 px-4 pb-2 pt-2 sm:px-5"
        aria-hidden
      >
        {bars.map((bar, i) => (
          <div
            key={i}
            className="min-w-0 flex-1 rounded-none transition-colors duration-75"
            style={{
              height: bar.hasError
                ? "38%"
                : bar.fill === 0
                  ? "22%"
                  : `${30 + bar.fill * 70}%`,
              background: bar.hasError
                ? "var(--sd-error)"
                : "var(--sd-accent)",
              opacity: bar.hasError
                ? 0.85
                : bar.fill === 0
                  ? 0.14
                  : 0.3 + bar.fill * 0.7,
            }}
          />
        ))}
      </div>
      <div className="flex min-h-9 items-center gap-4 border-t border-edge/70 px-4 py-2.5 sm:px-5">
        {done ? (
          <>
            <span className="sd-stamp">Clean run</span>
            <span className="mr-auto font-mono text-xs tabular-nums text-muted">
              {Math.round(accuracy(editor) * 100)}% accurate
            </span>
            <button
              onClick={reset}
              className="font-mono text-xs text-muted transition-colors hover:text-ink"
            >
              Reset
            </button>
          </>
        ) : (
          <span className="flex items-center gap-2 text-xs text-muted">
            <span className="h-px w-8 bg-edge" aria-hidden />
            Type the specimen from memory
          </span>
        )}
      </div>
    </div>
  );
```

Note the only behavioral change: the progress bars keep the same heights/colors/opacity logic but become `rounded-none` (square ruled ticks) and sit on a dotted baseline instead of inside a solid footer.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`.
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/HeroDemo.tsx src/app/globals.css
git commit -m "feat: specimen index-card demo with clean-run rubber stamp"
```

---

### Task 6: LandingStats ledger strip

Restyle the real-data stats strip as a printed field ledger: big serif numerals with mono uppercase labels in a 4-column ruled grid. Logic (real `totals`, `hasData` guard) is untouched.

**Files:**
- Modify: `src/components/landing/LandingStats.tsx` (return block, lines 21-32)

**Interfaces:**
- Consumes: `totals()` and `useSyncExternalStore` wiring (unchanged).
- Produces: ledger strip markup consumed by `page.tsx` Task 7 as `<LandingStats />`.

- [ ] **Step 1: Replace the render**

In `LandingStats.tsx`, replace the return block (lines 21-32):

```tsx
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-semibold tabular-nums text-ink">
            {item.value}
          </span>
          <span className="text-xs text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
```

with:

```tsx
  return (
    <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-edge/60">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-1 px-4 text-center sm:items-start sm:text-left"
        >
          <span className="font-display text-3xl font-medium tabular-nums text-ink">
            {item.value}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`.
Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/LandingStats.tsx
git commit -m "style: ledger strip for field-record stats"
```

---

### Task 7: Rewrite the landing page (9-section field guide)

Rewrite `src/app/page.tsx` to compose the full 9-section landing. This is a single coherent deliverable; replace the entire file. Anchors `#tracks`, `#features`, `#roadmap`, routes, and the `min-h-screen` shell are preserved. Data arrays (`FEATURE_GROUPS`, `TRACK_LANGUAGES`, `ROADMAP`) keep their content; `ROADMAP` drops the now-unused `dot` key.

**Files:**
- Replace: `src/app/page.tsx` (whole file, 424 lines)

**Interfaces:**
- Consumes: `CONCEPTS` (fields `id`, `name`, `blurb`), `HeroDemo`, `LandingStats`, `AccountButton`, `ModeToggle`, `.sd-rise`/`.ruled`/`.index-hole`/`.sd-stamp`/`.sd-stamp-accent` CSS, and the `--color-*` utilities (`bg-page`, `bg-ink`, `text-page`, `text-ink`, `text-muted`, `text-accent`, `border-edge`, `bg-surface`, `bg-raised`, `bg-good`).
- Produces: the landing page. No later task consumes anything from it.

- [ ] **Step 1: Write the new page.tsx**

Replace the entire contents of `src/app/page.tsx` with:

```tsx
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Code2,
  Gauge,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import { CONCEPTS } from "@/lib/concepts";
import HeroDemo from "@/components/landing/HeroDemo";
import LandingStats from "@/components/landing/LandingStats";
import AccountButton from "@/components/AccountButton";
import ModeToggle from "@/components/theme/ModeToggle";

const FEATURE_GROUPS = [
  {
    title: "Learn",
    items: [
      {
        icon: Code2,
        title: "Real code, real syntax",
        body: "Snippets are the exact patterns you'll write on the job: variables, loops, functions, queries. Not lorem ipsum.",
      },
      {
        icon: Brain,
        title: "Explain-then-type",
        body: "Every snippet teaches first. Read why it works, then type it from memory. That's how syntax sticks.",
      },
    ],
  },
  {
    title: "Feedback",
    items: [
      {
        icon: Gauge,
        title: "Instant char-by-char state",
        body: "Live WPM and accuracy, and a mastered badge for clean, zero-error runs.",
      },
      {
        icon: Zap,
        title: "Scenes that react",
        body: "A finish line sprints as you type. Database snippets show the server handshake live.",
      },
    ],
  },
  {
    title: "Runs anywhere",
    items: [
      {
        icon: Terminal,
        title: "In your browser",
        body: "Execute what you type with a sandboxed eval, or a full Python interpreter via Pyodide.",
      },
      {
        icon: ShieldCheck,
        title: "Local-first progress",
        body: "Progress lives in your browser. Create a free account to sync it across devices, no ads, no tracking.",
      },
    ],
  },
];

const TRACK_LANGUAGES: Record<string, string> = {
  variables: "JS · Python",
  conditionals: "JS · Python",
  loops: "JS · Python",
  functions: "JS · Python",
  database: "JS + Python + SQL",
};

const ROADMAP = [
  {
    phase: "now",
    label: "Now",
    note: "building",
    rows: [
      { tag: "go + rust", text: "Two more languages join the drill set" },
      { tag: "arrays + objects", text: "New concept tracks for the fundamentals" },
      { tag: "quiz mode", text: "Recall drills that don't need a keyboard" },
    ],
  },
  {
    phase: "next",
    label: "Next",
    note: "short horizon",
    rows: [
      { tag: "difficulty", text: "Beginner to advanced tiers for every track" },
      { tag: "password reset", text: "Email recovery for account sign-ins" },
      { tag: "leaderboards", text: "Opt-in pace comparisons across accounts" },
    ],
  },
  {
    phase: "later",
    label: "Later",
    note: "further out",
    rows: [
      { tag: "community", text: "Share and remix your own drills" },
      { tag: "mobile", text: "Touch-friendly layouts for phones" },
      { tag: "api", text: "A free developer API for the word and snippet sets" },
    ],
  },
];

const NAV_LINKS = [
  { href: "#tracks", label: "The tracks" },
  { href: "#features", label: "What a drill teaches" },
  { href: "#roadmap", label: "Field observations" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[2px] focus:bg-accent focus:px-3 focus:py-1.5 focus:text-xs focus:font-semibold focus:text-page"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-edge/70 bg-page/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-lg font-medium tracking-tight text-ink">
              SyntaxDrill
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:inline">
              field guide
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="border-b border-dotted border-transparent text-xs text-muted transition-colors hover:border-muted hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link
              href="/app"
              className="hidden items-center rounded-[2px] bg-ink px-4 py-2 text-xs font-semibold text-page transition-opacity hover:opacity-90 sm:inline-flex"
            >
              Start practicing
            </Link>
            <AccountButton />
          </div>
        </div>
      </header>

      <main id="main">
        <section className="ruled overflow-hidden">
          <div className="mx-auto grid max-w-5xl gap-12 px-4 pb-20 pt-16 sm:pt-20 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:pt-24">
            <div>
              <p
                className="sd-rise mb-6 font-mono text-xs text-muted"
                aria-hidden
              >
                <span className="text-accent">{"//"}</span> field catalogue: js +
                python
              </p>
              <h1 className="sd-rise max-w-xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Learn to type the code{" "}
                <em className="italic text-accent">you will really write.</em>
              </h1>
              <p className="sd-rise mt-6 max-w-md text-base leading-relaxed text-muted">
                Real JavaScript and Python snippets as drills. Read the pattern,
                type it from memory, run it.
              </p>
              <div className="sd-rise mt-8 flex flex-col items-start gap-3 sm:flex-row">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 rounded-[2px] bg-ink px-5 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
                >
                  Start practicing
                </Link>
                <Link
                  href="/speed"
                  className="inline-flex items-center gap-2 rounded-[2px] border border-edge bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-raised"
                >
                  Try a speed test
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
            <div className="sd-rise">
              <HeroDemo />
            </div>
          </div>
        </section>

        <section className="border-y border-edge/70 bg-surface/40">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <LandingStats />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-20">
          <div className="mb-10 max-w-xl">
            <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
              Two ways to drill
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Build real skill with code, or sharpen raw speed on plain words.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-5">
            <Link
              href="/app"
              className="group relative rounded-lg border border-edge bg-surface p-7 transition-colors hover:border-accent lg:col-span-3"
            >
              <span className="index-hole left-8" aria-hidden />
              <span className="index-hole left-14" aria-hidden />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Plate 01 · Practice
              </p>
              <h3 className="mt-3 font-display text-xl font-medium text-ink">
                Practice mode
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Ten-snippet sessions per concept and difficulty. Read the
                explanation, type it from memory, then run it.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                Open tracks
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
            <Link
              href="/speed"
              className="group relative rounded-lg border border-edge bg-surface p-7 transition-colors hover:border-accent lg:col-span-2"
            >
              <span className="index-hole left-8" aria-hidden />
              <span className="index-hole left-14" aria-hidden />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Plate 02 · Speed
              </p>
              <h3 className="mt-3 font-display text-xl font-medium text-ink">
                Speed test
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Timed or word-count runs on common English words. A clean,
                distraction-free WPM and accuracy readout.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                Open speed test
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          </div>
        </section>

        <section id="tracks" className="border-t border-edge/70 bg-surface/40 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-10 max-w-xl">
              <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
                The tracks
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Learn the building blocks in two languages, then the database
                starter set.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {CONCEPTS.map((concept, index) => (
                <div
                  key={concept.id}
                  className={`rounded-lg border border-edge bg-surface p-6 transition-colors hover:border-muted ${
                    index === 0 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg font-medium text-ink">
                      {concept.name}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      SP-0{index + 1}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {concept.blurb}
                  </p>
                  <span className="mt-4 inline-block font-mono text-[11px] tracking-wide text-accent">
                    {TRACK_LANGUAGES[concept.id]}
                  </span>
                </div>
              ))}
              <div className="flex flex-col justify-center rounded-lg border border-dashed border-edge bg-surface/50 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Wildcard
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  More languages and quiz modes are on the field plan.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-edge/70 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
                  What a drill teaches you
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                  Every feature below is live today.
                </p>
                <div className="mt-10 divide-y divide-edge/60">
                  {FEATURE_GROUPS.map((group) => (
                    <div key={group.title} className="py-8 first:pt-0 last:pb-0">
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                        {group.title}
                      </h3>
                      <div className="mt-5 space-y-6">
                        {group.items.map((feature) => (
                          <div key={feature.title} className="flex gap-4">
                            <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border border-edge bg-surface text-accent">
                              <feature.icon className="h-4 w-4" aria-hidden />
                            </div>
                            <div>
                              <h4 className="font-display text-base font-medium text-ink">
                                {feature.title}
                              </h4>
                              <p className="mt-1 text-sm leading-relaxed text-muted">
                                {feature.body}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <aside className="hidden lg:block">
                <div className="sticky top-24 border-l border-edge/70 pl-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    Margin notes
                  </p>
                  <p className="mt-3 font-mono text-xs italic leading-relaxed text-muted">
                    Read it. Cover it. Type it. That order is the whole method.
                  </p>
                  <div className="mt-6 h-px w-10 bg-edge" />
                  <p className="mt-6 font-mono text-xs italic leading-relaxed text-muted">
                    A clean run earns the stamp. Stamps stack into mastery.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="roadmap" className="mx-auto max-w-5xl px-4 py-20">
          <p className="font-mono text-xs text-muted" aria-hidden>
            <span className="text-accent">{"//"}</span> what next
          </p>
          <div className="mb-10 mt-4 max-w-xl">
            <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
              Field observations
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              An honest roadmap, built in the open.
            </p>
          </div>
          <div className="divide-y divide-edge/60 border-y border-edge/70">
            {ROADMAP.map((phase) => (
              <div
                key={phase.phase}
                className="grid gap-2 py-7 sm:grid-cols-[140px_1fr] sm:gap-8"
              >
                <div>
                  <h3 className="font-display text-lg font-medium text-ink">
                    {phase.label}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    {phase.note}
                  </p>
                </div>
                <ul className="divide-y divide-edge/50">
                  {phase.rows.map((row) => (
                    <li
                      key={row.tag}
                      className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-4"
                    >
                      <span className="w-40 shrink-0 font-mono text-[11px] font-medium text-accent">
                        {row.tag}
                      </span>
                      <span className="text-sm text-muted">{row.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted">
            Have an idea?{" "}
            <a
              href="https://github.com/GabrielRayat-dev/SyntaxDrill"
              target="_blank"
              rel="noreferrer"
              className="text-accent underline-offset-2 transition-colors hover:underline"
            >
              Open an issue on GitHub
            </a>
          </p>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          <span aria-hidden className="sd-stamp sd-stamp-accent mx-auto">
            Free forever
          </span>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink">
            Free. Forever.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            Core learning will never be gated behind a paywall. Future plans
            only unlock depth and convenience, never the drills.
          </p>
          <Link
            href="/app"
            className="mt-10 inline-flex items-center gap-2 rounded-[2px] bg-ink px-6 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            Start practicing
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </main>

      <footer className="border-t border-edge/70">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-lg font-medium text-ink">
                SyntaxDrill
              </p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">
                A field guide to typing real code. Set in EB Garamond and
                JetBrains Mono, printed on recycled field paper.
              </p>
            </div>
            <nav className="flex items-center gap-6 text-xs text-muted">
              <Link
                href="/app"
                className="border-b border-dotted border-transparent transition-colors hover:border-muted hover:text-ink"
              >
                Practice
              </Link>
              <Link
                href="/speed"
                className="border-b border-dotted border-transparent transition-colors hover:border-muted hover:text-ink"
              >
                Speed test
              </Link>
              <Link
                href="/"
                className="border-b border-dotted border-transparent transition-colors hover:border-muted hover:text-ink"
              >
                Top
              </Link>
            </nav>
          </div>
          <p className="mt-8 border-t border-edge/40 pt-4 text-xs text-muted">
            Made for learners. No ads, no tracking.
          </p>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify structure invariants**

Run: `rg -n "id=\"(tracks|features|roadmap)\"|href=\"/app\"|href=\"/speed\"|href=\"/signin\"" src/app/page.tsx`
Expected: `#tracks`, `#features`, `#roadmap` all present; `/app`, `/speed` links present (signin link lives in `AccountButton`, not here).

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`.
Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: field-guide landing - toc, ruled hero, ledger, catalog, observations, colophon"
```

---

### Task 8: Final sweep and verification

Run the copy/quality gates across every Phase A file, fix anything that fails, and leave the tree ready for the user to review before push. Do not push.

**Files:**
- Verify: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/components/landing/HeroDemo.tsx`, `src/components/landing/LandingStats.tsx`, `src/components/theme/ModeToggle.tsx`, `src/components/AccountButton.tsx`, `src/components/CodeEditor.tsx`, `src/lib/themes.ts`

- [ ] **Step 1: No em-dashes or en-dashes in changed files**

Run: `rg -n "—|–" src/app/page.tsx src/components/landing src/components/theme/ModeToggle.tsx src/lib/themes.ts`
Expected: no matches (only `·` and plain hyphens allowed).

- [ ] **Step 2: No rounded-full pills in the landing surface**

Run: `rg -n "rounded-full" src/app/page.tsx src/components/landing src/components/theme/ModeToggle.tsx`
Expected: no matches. (The `AccountButton` avatar circle and app-chrome files like `ThemePicker`, `ConceptBars`, and the scenes are Phase B and intentionally excluded.)

- [ ] **Step 3: Exactly the approved hero subtext**

Run: `rg -n "Real JavaScript and Python" src/app/page.tsx`
Expected: exactly one match, whose sentence is "Real JavaScript and Python snippets as drills. Read the pattern, type it from memory, run it." (16 words, no "Free forever" trailing).

- [ ] **Step 4: No leftover stale font references**

Run: `rg -n "space-grotesk|Space_Grotesk" src`
Expected: no matches.

- [ ] **Step 5: Full build gate**

Run: `npx tsc --noEmit` then `npm run lint` then `npm run build`.
Expected: all pass. If anything fails, fix it in a follow-up commit, then re-run until clean.

- [ ] **Step 6: Optional visual check**

Run `npm run dev` and visit `http://localhost:3000`. Confirm: cream paper default, EB Garamond headline with italic vermilion phrase, ruled hero lines, grain texture, squared buttons/stamps, punched-hole index cards, ledger stats, catalog tracks with `SP-0x` tags, features ledger with margin notes, `// what next` observations, "Free. Forever." stamp plate, and the colophon footer. Toggle ModeToggle and confirm the lamplit paper-dark variant. Then stop the dev server (`Ctrl+C`).

- [ ] **Step 7: Review and confirm, do not push**

Run: `git status --short` and `git log --oneline -8`.
Expected: a clean working tree with the six Phase A commits from Tasks 1-7 on top of `db638fa`. Show the user the log and ask whether to push to `origin` before doing anything further.

---

## Self-Review (run after writing)

**Spec coverage vs approved spec (`docs/superpowers/specs/2026-08-02-field-guide-identity-design.md`):**
- 6 token sets retuned to aged paper/ink/vermilion, lamplit paper dark, cool library night, graphite pencil: Task 2.
- EB Garamond display + Source Serif 4 body + JetBrains Mono code/tags, Geist app-chrome only: Task 3.
- Paper grain overlay, ruled hero lines, punched-hole index cards, rubber stamps, margin notes, dotted-leader TOC nav, page-gutter fold separators (border-y ledger rows), colophon footer: Tasks 3, 5, 7.
- Shape lock (2px/8px, no pills): Task 4.
- 9 sections, 5+ layout families, no two adjacent sharing a family: Task 7 (hairline nav / ruled hero / ledger strip / asymmetric cards / 2-col catalog / ledger+marginalia / bordered observation list / centered plate / colophon).
- Copy rules (no dashes, 16-word hero subtext, two CTA intents, eyebrow budget 2/3, no fake numbers): Task 7 + Task 8 gates.
- Routes/anchors/metadata preserved: Task 7 Step 2 + Global Constraints.
- `DEFAULT_THEME = "paper-light"` untouched: Task 1 (already committed) + Global Constraints.
- Theme picker swatches stay truthful: Task 2 Step 7.

**Placeholder scan:** all steps carry concrete code; no "TBD", no "handle edge cases", no "similar to Task N" references. The only prose instructions are for substitutions whose exact old/new strings are given.

**Type consistency:** `bare?: boolean` defined in Task 4 and consumed in Task 5; `.sd-stamp`/`.sd-stamp-accent`/`.index-hole`/`.ruled` defined in Task 5, consumed in Task 7; `font-display`/`font-serif` tokens defined in Task 3, consumed in Tasks 6-7; `COLORWAYS` swatch values in Task 2 match the `globals.css` hexes in Tasks 2. `ROADMAP` `dot` key dropped everywhere it was used (the old render is fully replaced in Task 7). No stale names.
