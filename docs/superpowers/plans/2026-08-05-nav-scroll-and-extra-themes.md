# Nav Sign-in Redesign + Nav Scroll Animation + Extra Themes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the nav "Sign in" button as a mono eyebrow link with a live underline, give both navs a Greptile-style glass-bar scroll animation, and add three new colorways (Ember, Fern, Orchid) for a 10-theme system.

**Architecture:** Two independent additive workstreams on `main`. Nav: a shared `useScrolled` scroll hook plus a `NavGlass` client wrapper for the landing header, CSS scrolled-states on `.signal-nav`/`.signal-app-nav` replacing the old scroll-driven CSS. Themes: extend the `ColorwayId` union, add three `COLORWAYS` entries (data-driven — `ThemeProvider`/layout script/migration untouched), append six full `--sd-*` palette blocks to `globals.css`, and widen the picker grid.

**Tech Stack:** Next.js 16 (App Router, React 19), Tailwind CSS v4, lucide-react, next-auth. Windows PowerShell 5.1 (no `&&`).

## Global Constraints

- **No automated test runner exists.** `package.json` scripts are `dev`, `build`, `start`, `lint` only. Per-task gate cycle: `npx tsc --noEmit` → PASS, then `npm run lint` → PASS, then commit. A full `npm run build` (11 routes) runs in Task 1 and Task 5 (final).
- **Windows PowerShell 5.1.** There is NO `&&`. Chain with `;` and `if ($?) { ... }`. Always quote paths containing spaces or parentheses, e.g. `git add "src/app/(app)/progress/page.tsx"`.
- **Landing (`/`) and sign-in (`/signin`) stay pinned to signal dark.** New colorways are app themes only, chosen in `/settings` → Theme.
- **Do NOT touch** `src/components/theme/ThemeProvider.tsx`, `src/lib/localStore.ts`, or the inline script/legacy map in `src/app/layout.tsx` — they are already generic.
- **`prefers-reduced-motion: reduce`:** scroll/underline transforms and the arrow icon are disabled; frosted backgrounds are not motion and remain.
- Each task changes ONLY the files listed in its **Files** block.

---

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `src/lib/useScrolled.ts` | **New** — `useScrolled` scroll-listener hook | 1 |
| `src/components/NavGlass.tsx` | **New** — client wrapper rendering the landing `<header>` with `data-scrolled` | 1 |
| `src/components/AccountButton.tsx` | Signed-out state → mono eyebrow Sign-in link | 2 |
| `src/app/globals.css` | `.signal-nav-signin` rules; nav base/scrolled states; remove scroll-timeline block + keyframes; six new `[data-theme=...]` palettes | 2, 3, 4 |
| `src/app/page.tsx` | Landing `<header>` → `<NavGlass>`; import | 3 |
| `src/components/AppHeader.tsx` | `useScrolled` + `data-scrolled` on app header | 3 |
| `src/lib/themes.ts` | `ColorwayId` union + three `COLORWAYS` entries | 4 |
| `src/components/theme/ThemePicker.tsx` | Grid `sm:grid-cols-2 lg:grid-cols-3` | 5 |

---

### Task 1: Scroll hook + Nav glass wrapper

**Files:**
- Create: `src/lib/useScrolled.ts`
- Create: `src/components/NavGlass.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `useScrolled(threshold?: number): boolean` exported from `@/lib/useScrolled`; `NavGlass({ className, children }: { className: string; children: React.ReactNode })` default-exported from `@/components/NavGlass`. Task 3 imports both.

- [ ] **Step 1: Create the hook**

Create `src/lib/useScrolled.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
```

- [ ] **Step 2: Create the Nav glass wrapper**

Create `src/components/NavGlass.tsx`:

```tsx
"use client";

import { useScrolled } from "@/lib/useScrolled";

export default function NavGlass({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const scrolled = useScrolled();
  return (
    <header className={className} data-scrolled={scrolled}>
      {children}
    </header>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 4: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 5: Production build**

Run: `npm run build` → PASS, 11 routes.

- [ ] **Step 6: Commit**

```bash
git add src/lib/useScrolled.ts src/components/NavGlass.tsx
git commit -m "feat(nav): scrolled scroll hook + nav glass wrapper"
```

---

### Task 2: Sign-in button redesign

**Files:**
- Modify: `src/components/AccountButton.tsx` (import line 5 area; signed-out block lines 15-24)
- Modify: `src/app/globals.css` (append rules at end of file)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: the signed-out `AccountButton` renders a `.signal-nav-signin` link (used by both navs via existing renders). CSS class `.signal-nav-signin` now exists.

- [ ] **Step 1: Add the ArrowRight import**

In `src/components/AccountButton.tsx`, after the existing line `import { signOut, useSession } from "next-auth/react";` add:

```ts
import { ArrowRight } from "lucide-react";
```

- [ ] **Step 2: Replace the signed-out link**

In `src/components/AccountButton.tsx`, replace this exact block:

```tsx
  if (!session?.user) {
    return (
      <Link
        href="/signin"
        className="rounded-md border border-edge bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-raised"
      >
        Sign in
      </Link>
    );
  }
```

with:

```tsx
  if (!session?.user) {
    return (
      <Link href="/signin" className="signal-nav-signin group">
        Sign in
        <ArrowRight
          className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden
        />
      </Link>
    );
  }
```

- [ ] **Step 3: Add the sign-in button CSS**

Append to the end of `src/app/globals.css`:

```css
/* Nav sign-in: mono eyebrow link with a live underline */
.signal-nav-signin {
  align-items: center;
  color: var(--sd-muted);
  display: inline-flex;
  font-family: var(--font-jetbrains-mono), ui-monospace, Menlo, monospace;
  font-size: 0.6875rem;
  font-weight: 600;
  gap: 0.3rem;
  letter-spacing: 0.16em;
  padding-bottom: 2px;
  position: relative;
  text-transform: uppercase;
  transition: color 180ms ease;
}
.signal-nav-signin::after {
  background: var(--sd-accent);
  bottom: -2px;
  content: "";
  height: 1.5px;
  left: 0;
  position: absolute;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 220ms cubic-bezier(.2, .9, .2, 1);
  width: 100%;
}
.signal-nav-signin:hover { color: var(--sd-text); }
.signal-nav-signin:hover::after { transform: scaleX(1); }
@media (prefers-reduced-motion: reduce) {
  .signal-nav-signin::after { transition: none; }
  .signal-nav-signin .lucide-arrow-right { display: none; }
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 5: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/AccountButton.tsx src/app/globals.css
git commit -m "feat(nav): sign-in button as mono eyebrow link"
```

---

### Task 3: Nav scroll animation wiring

**Files:**
- Modify: `src/app/page.tsx` (imports; `<header ...>` line 65; `</header>` line 86)
- Modify: `src/components/AppHeader.tsx` (imports; component body; header line 25)
- Modify: `src/app/globals.css` (line 109 `.signal-nav`; lines 158-160 scroll-timeline block + keyframes; line 167 `.signal-app-nav`)

**Interfaces:**
- Consumes: `useScrolled` from `@/lib/useScrolled`, `NavGlass` from `@/components/NavGlass` (Task 1).
- Produces: both navs render `data-scrolled="true"` after `window.scrollY > 8`. CSS states `.signal-nav[data-scrolled="true"]` / `.signal-app-nav[data-scrolled="true"]`.

- [ ] **Step 1: Wire the landing header to NavGlass**

In `src/app/page.tsx`:

1. After the line `import AccountButton from "@/components/AccountButton";` add:

```tsx
import NavGlass from "@/components/NavGlass";
```

2. Replace `<header className="signal-nav sticky top-0 z-40">` with:

```tsx
<NavGlass className="signal-nav sticky top-0 z-40">
```

3. Replace the matching `</header>` (the one closing the nav, just after the inner `<div className="mx-auto flex h-[68px] ...">` block) with:

```tsx
</NavGlass>
```

The skip-link `<a>` (lines 59-64) and all header children stay unchanged.

- [ ] **Step 2: Wire the app header**

In `src/components/AppHeader.tsx`:

1. After `import AccountButton from "@/components/AccountButton";` add:

```tsx
import { useScrolled } from "@/lib/useScrolled";
```

2. After the line `const pathname = usePathname();` add:

```tsx
  const scrolled = useScrolled();
```

3. Replace the header opening tag:

```tsx
      <header className="signal-app-nav sticky top-0 z-40">
```

with:

```tsx
      <header className="signal-app-nav sticky top-0 z-40" data-scrolled={scrolled}>
```

- [ ] **Step 3: Make the at-top nav state more transparent**

In `src/app/globals.css` line 109, replace the `.signal-nav` rule:

```css
.signal-nav { border-bottom: 1px solid color-mix(in srgb, var(--sd-border) 70%, transparent); background: color-mix(in srgb, var(--sd-bg) 82%, transparent); backdrop-filter: blur(20px); }
```

with:

```css
.signal-nav { border-bottom: 1px solid color-mix(in srgb, var(--sd-border) 70%, transparent); background: color-mix(in srgb, var(--sd-bg) 55%, transparent); backdrop-filter: blur(12px); }
```

In `src/app/globals.css` line 167, replace the `.signal-app-nav` rule:

```css
.signal-app-nav { border-bottom: 1px solid color-mix(in srgb, var(--sd-border) 75%, transparent); background: color-mix(in srgb, var(--sd-bg) 86%, transparent); backdrop-filter: blur(20px); }
```

with:

```css
.signal-app-nav { border-bottom: 1px solid color-mix(in srgb, var(--sd-border) 75%, transparent); background: color-mix(in srgb, var(--sd-bg) 64%, transparent); backdrop-filter: blur(20px); }
```

- [ ] **Step 4: Replace the scroll-driven CSS with scrolled states**

In `src/app/globals.css`, replace the entire `@supports` block plus the two keyframes (currently one line each at lines 158-160):

```css
@supports (animation-timeline: scroll()) { @media (prefers-reduced-motion: no-preference) { .signal-nav { animation: signal-nav-settle linear both; animation-range: 0 180px; animation-timeline: scroll(root); } .signal-nav > div { animation: signal-nav-inner linear both; animation-range: 0 180px; animation-timeline: scroll(root); } } }
@keyframes signal-nav-settle { to { border-color: color-mix(in srgb, var(--sd-accent) 42%, var(--sd-border)); box-shadow: 0 10px 38px rgb(0 0 0 / .22); } }
@keyframes signal-nav-inner { to { transform: scale(.95); } }
```

with:

```css
.signal-nav,
.signal-app-nav {
  transition: background 220ms ease, border-bottom-color 220ms ease, box-shadow 220ms ease;
}
.signal-nav[data-scrolled="true"] {
  background: color-mix(in srgb, var(--sd-bg) 88%, transparent);
  border-bottom-color: color-mix(in srgb, var(--sd-accent) 42%, var(--sd-border));
  box-shadow: 0 10px 38px rgb(0 0 0 / .22);
}
.signal-nav > div { transition: transform 220ms ease; }
.signal-nav[data-scrolled="true"] > div { transform: scale(.98); }
.signal-app-nav[data-scrolled="true"] {
  background: color-mix(in srgb, var(--sd-bg) 90%, transparent);
  border-bottom-color: color-mix(in srgb, var(--sd-accent) 38%, var(--sd-border));
  box-shadow: 0 10px 38px rgb(0 0 0 / .22);
}
@media (prefers-reduced-motion: reduce) {
  .signal-nav, .signal-app-nav, .signal-nav > div { transition: none; }
  .signal-nav[data-scrolled="true"] > div { transform: none; }
}
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 6: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 7: Commit**

```bash
git add "src/app/page.tsx" src/components/AppHeader.tsx src/app/globals.css
git commit -m "feat(nav): glass-bar scroll animation on landing and app navs"
```

---

### Task 4: Extra themes — data + palettes

**Files:**
- Modify: `src/lib/themes.ts` (line 3 `ColorwayId`; append three entries to `COLORWAYS` after the `graphite` entry)
- Modify: `src/app/globals.css` (append six `[data-theme=...]` blocks after the `graphite-light` block)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `ColorwayId` becomes `"signal" | "graphite" | "ember" | "fern" | "orchid"`; `COLORWAYS` has 5 entries; `isThemeId`/`migrateTheme`/`ThemeProvider.cycle`/`setTheme` accept the new ids with no further code. Six new `[data-theme=...]` blocks exist.

- [ ] **Step 1: Extend the ColorwayId union**

In `src/lib/themes.ts` line 3, replace:

```ts
export type ColorwayId = "signal" | "graphite";
```

with:

```ts
export type ColorwayId = "signal" | "graphite" | "ember" | "fern" | "orchid";
```

- [ ] **Step 2: Add the three colorway entries**

In `src/lib/themes.ts`, after the closing `},` of the `graphite` entry (the object ending with the `light` swatches array `["#f2f3f5", "#4658d0", "#1f7a4f", "#c03a48", "#16181c"]`) and before the `];` that closes `COLORWAYS`, insert:

```ts
  {
    id: "ember",
    name: "Ember",
    descriptions: {
      dark: "Warm near-black, amber glow.",
      light: "Warm paper, burnt amber ink.",
    },
    swatches: {
      dark: ["#120c08", "#f2a33c", "#a3d977", "#f07a6b", "#f7f1e8"],
      light: ["#faf5ec", "#a8540e", "#2f7d4f", "#b3372b", "#241a10"],
    },
  },
  {
    id: "fern",
    name: "Fern",
    descriptions: {
      dark: "Deep green, terminal green.",
      light: "Pale green-white, forest ink.",
    },
    swatches: {
      dark: ["#0a0f0c", "#5fce8a", "#7ee0a0", "#f77f8a", "#eef4ef"],
      light: ["#f2f7f2", "#1e7a4a", "#3f8f60", "#c0392b", "#142019"],
    },
  },
  {
    id: "orchid",
    name: "Orchid",
    descriptions: {
      dark: "Near-black violet, lavender glow.",
      light: "Pale lavender-white, violet ink.",
    },
    swatches: {
      dark: ["#0d0a12", "#c4a6ff", "#8fd7b1", "#f28d97", "#f2eff7"],
      light: ["#f6f4fa", "#6d4fd0", "#2f7a56", "#b63d5e", "#1b1624"],
    },
  },
```

- [ ] **Step 3: Add the six palette blocks**

In `src/app/globals.css`, after the closing `}` of the `[data-theme="graphite-light"]` block (the block ending with `color-scheme: light;` and `}` at line 93) and before the `body {` rule, insert:

```css
[data-theme="ember"] {
  --sd-bg: #120c08;
  --sd-surface: #1a120a;
  --sd-raised: #241811;
  --sd-border: #3a2c1d;
  --sd-text: #f7f1e8;
  --sd-muted: #b0a188;
  --sd-accent: #f2a33c;
  --sd-accent-2: #f2a33c;
  --sd-correct: #a3d977;
  --sd-error: #f07a6b;
  --sd-warn: #e7bf78;
  --sd-caret: #f2a33c;
  --sd-glow: rgba(242, 163, 60, 0.18);
  color-scheme: dark;
}

[data-theme="ember-light"] {
  --sd-bg: #faf5ec;
  --sd-surface: #ffffff;
  --sd-raised: #f1e9db;
  --sd-border: #e0d3bd;
  --sd-text: #241a10;
  --sd-muted: #7d6f5c;
  --sd-accent: #a8540e;
  --sd-accent-2: #a8540e;
  --sd-correct: #2f7d4f;
  --sd-error: #b3372b;
  --sd-warn: #8a6a12;
  --sd-caret: #a8540e;
  --sd-glow: rgba(168, 84, 14, 0.16);
  color-scheme: light;
}

[data-theme="fern"] {
  --sd-bg: #0a0f0c;
  --sd-surface: #0f1612;
  --sd-raised: #162019;
  --sd-border: #263529;
  --sd-text: #eef4ef;
  --sd-muted: #93a69a;
  --sd-accent: #5fce8a;
  --sd-accent-2: #5fce8a;
  --sd-correct: #7ee0a0;
  --sd-error: #f77f8a;
  --sd-warn: #e7c56b;
  --sd-caret: #5fce8a;
  --sd-glow: rgba(95, 206, 138, 0.16);
  color-scheme: dark;
}

[data-theme="fern-light"] {
  --sd-bg: #f2f7f2;
  --sd-surface: #ffffff;
  --sd-raised: #e7efe7;
  --sd-border: #d3ded3;
  --sd-text: #142019;
  --sd-muted: #5c6b5f;
  --sd-accent: #1e7a4a;
  --sd-accent-2: #1e7a4a;
  --sd-correct: #3f8f60;
  --sd-error: #c0392b;
  --sd-warn: #9a7a1a;
  --sd-caret: #1e7a4a;
  --sd-glow: rgba(30, 122, 74, 0.15);
  color-scheme: light;
}

[data-theme="orchid"] {
  --sd-bg: #0d0a12;
  --sd-surface: #141019;
  --sd-raised: #1c1722;
  --sd-border: #2e2738;
  --sd-text: #f2eff7;
  --sd-muted: #a398b0;
  --sd-accent: #c4a6ff;
  --sd-accent-2: #c4a6ff;
  --sd-correct: #8fd7b1;
  --sd-error: #f28d97;
  --sd-warn: #e7bf78;
  --sd-caret: #c4a6ff;
  --sd-glow: rgba(196, 166, 255, 0.16);
  color-scheme: dark;
}

[data-theme="orchid-light"] {
  --sd-bg: #f6f4fa;
  --sd-surface: #ffffff;
  --sd-raised: #ece7f4;
  --sd-border: #ddd6e6;
  --sd-text: #1b1624;
  --sd-muted: #6b6278;
  --sd-accent: #6d4fd0;
  --sd-accent-2: #6d4fd0;
  --sd-correct: #2f7a56;
  --sd-error: #b63d5e;
  --sd-warn: #8a6a12;
  --sd-caret: #6d4fd0;
  --sd-glow: rgba(109, 79, 208, 0.15);
  color-scheme: light;
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 5: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/themes.ts src/app/globals.css
git commit -m "feat(themes): ember, fern, orchid colorways"
```

---

### Task 5: Theme picker grid + final verification

**Files:**
- Modify: `src/components/theme/ThemePicker.tsx` (grid container line 11)

**Interfaces:**
- Consumes: `COLORWAYS` with 5 entries (Task 4).
- Produces: nothing consumed downstream; final gate for the whole change set.

- [ ] **Step 1: Widen the picker grid**

In `src/components/theme/ThemePicker.tsx`, replace the grid container line:

```tsx
    <div className="grid gap-2 sm:grid-cols-2">
```

with:

```tsx
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 3: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 4: Production build**

Run: `npm run build` → PASS, 11 routes.

- [ ] **Step 5: Manual verification (dev server)**

Start `npm run dev` and verify:

1. Landing + signed-out app header: `SIGN IN` mono eyebrow with animated accent underline and slide-in arrow on hover; no boxed border.
2. Both navs: transparent at top; after scrolling ~8px the nav frosts (blur, accent-tinted bottom border, soft shadow) — landing inner bar shrinks to 0.98.
3. `/settings` → Theme shows 5 colorways in a 3+2 grid on large screens; selecting Ember/Fern/Orchid + dark/light applies live across the app.
4. New theme swatches match the palettes; `signal-cta`, `text-accent`, and Prism token colors legible in each of the six new themes.
5. Landing + sign-in remain signal dark regardless of app theme.
6. DevTools `emulate prefers-reduced-motion: reduce`: no scale/underline animation; frost still applies.

- [ ] **Step 6: Commit**

```bash
git add src/components/theme/ThemePicker.tsx
git commit -m "feat(settings): theme picker grid for five colorways"
```
