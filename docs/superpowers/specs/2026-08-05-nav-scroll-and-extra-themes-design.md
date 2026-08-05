# Nav Sign-in Redesign + Nav Scroll Animation + Extra Themes — Design

Date: 2026-08-05
Branch: `main`
Status: Approved design (brainstormed with user)

## Overview

Two independent pieces of work, both additive to the existing signal design system:

1. **Nav** — redesign the "Sign in" nav button (mono eyebrow link with a live underline and slide-in arrow), and give both the landing nav (`signal-nav`) and the app header nav (`signal-app-nav`) a Greptile-style glass-bar scroll animation driven by a JS scroll listener.
2. **Themes** — add three new colorways (`ember`, `fern`, `orchid`) to the existing 4-theme system (Signal/Graphite × dark/light), producing **5 colorways × 2 modes = 10 themes**, each with a full token palette and its own accent hue in both modes.

## Constraints (carried over from the existing system)

- Landing (`/`) and sign-in (`/signin`) stay **pinned to signal dark**. New colorways are app themes only, chosen in `/settings` → Theme, exactly like Graphite today.
- `ThemeProvider.tsx`, the inline bootstrap script in `src/app/layout.tsx`, and the 13-legacy-id migration map are **unchanged** — `isThemeId`/`migrateTheme` validate against `COLORWAYS`, and the bootstrap passes stored theme ids straight through (`map[t] || t`). Verified.
- No test runner. Gate cycle: `npx tsc --noEmit` → PASS, `npm run lint` → PASS, then `npm run build` → PASS.
- Reduced-motion is respected: scroll transforms/underlines are disabled under `prefers-reduced-motion: reduce`; frosted backgrounds are not motion and remain applied.

---

## Section 1 — Nav

### 1a. Sign-in button redesign

**File:** `src/components/AccountButton.tsx` (signed-out state, used by both the landing nav and the app header).

Replace the signed-out `<Link>` (currently `rounded-md border border-edge bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-raised`) with a mono eyebrow link:

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

Add `ArrowRight` to the existing `lucide-react` import in the same file.

**CSS (`src/app/globals.css`), new rules:**

```css
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

Behavior: label renders uppercase mono `SIGN IN` in `text-muted`; hover shifts text to `text-ink` and animates an accent underline `scaleX(0 → 1)`; an arrow icon slides in from the left on hover. Real link text stays "Sign in" (accessibility); the global `:focus-visible` accent ring applies.

### 1b. Nav scroll animation (JS scroll listener, both navs)

Greptile-style effect: nav sits more transparent over the hero/content at the top, then frosts over on scroll — stronger blur, accent-tinted bottom border, soft shadow, and (landing only) a subtle inner-bar shrink.

**New hook — `src/lib/useScrolled.ts`:**

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

**New component — `src/components/NavGlass.tsx`** (renders the landing header; server-passed children keep `page.tsx` structure):

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

**`src/app/page.tsx`:** replace the opening `<header className="signal-nav sticky top-0 z-40">` and its closing `</header>` with `<NavGlass className="signal-nav sticky top-0 z-40">` / `</NavGlass>`. The `<div className="mx-auto flex h-[68px] ...">` inner content and the skip-link `<a>` (before the header) stay unchanged. Import `NavGlass` from `@/components/NavGlass`.

**`src/components/AppHeader.tsx`** (already a client component): add `const scrolled = useScrolled();` and change the header line to `<header className="signal-app-nav sticky top-0 z-40" data-scrolled={scrolled}>`. Import `useScrolled` from `@/lib/useScrolled`.

**CSS changes (`src/app/globals.css`):**

- Make the at-top state more transparent so the scroll transition is visible:
  - `.signal-nav`: `background: color-mix(in srgb, var(--sd-bg) 82%, transparent)` → `color-mix(in srgb, var(--sd-bg) 55%, transparent)`; `backdrop-filter: blur(20px)` → `blur(12px)`.
  - `.signal-app-nav`: `background: color-mix(in srgb, var(--sd-bg) 86%, transparent)` → `color-mix(in srgb, var(--sd-bg) 64%, transparent)`.
- Add scrolled states and transitions:

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

- Remove the old scroll-driven CSS: the `@supports (animation-timeline: scroll())` block (currently lines 158-160) and the now-unused `@keyframes signal-nav-settle` / `signal-nav-inner` (lines 159-160), since the JS path replaces them per the approved approach.

---

## Section 2 — Themes

### 2a. Model & data — `src/lib/themes.ts`

Append three entries to `COLORWAYS` (order: after `graphite`):

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

`ColorwayId` is a hand-written union `"signal" | "graphite"` and must be extended to `"signal" | "graphite" | "ember" | "fern" | "orchid"`. `ThemeId` derives from it (`ColorwayId | ${ColorwayId}-light`). No other type changes.

### 2b. Palettes — `src/app/globals.css`

Six new `[data-theme=...]` blocks appended after `[data-theme="graphite-light"]` (full token sets, same shape as existing blocks):

| Token | ember | ember-light | fern | fern-light | orchid | orchid-light |
|---|---|---|---|---|---|---|
| `--sd-bg` | `#120c08` | `#faf5ec` | `#0a0f0c` | `#f2f7f2` | `#0d0a12` | `#f6f4fa` |
| `--sd-surface` | `#1a120a` | `#ffffff` | `#0f1612` | `#ffffff` | `#141019` | `#ffffff` |
| `--sd-raised` | `#241811` | `#f1e9db` | `#162019` | `#e7efe7` | `#1c1722` | `#ece7f4` |
| `--sd-border` | `#3a2c1d` | `#e0d3bd` | `#263529` | `#d3ded3` | `#2e2738` | `#ddd6e6` |
| `--sd-text` | `#f7f1e8` | `#241a10` | `#eef4ef` | `#142019` | `#f2eff7` | `#1b1624` |
| `--sd-muted` | `#b0a188` | `#7d6f5c` | `#93a69a` | `#5c6b5f` | `#a398b0` | `#6b6278` |
| `--sd-accent` | `#f2a33c` | `#a8540e` | `#5fce8a` | `#1e7a4a` | `#c4a6ff` | `#6d4fd0` |
| `--sd-accent-2` | `#f2a33c` | `#a8540e` | `#5fce8a` | `#1e7a4a` | `#c4a6ff` | `#6d4fd0` |
| `--sd-correct` | `#a3d977` | `#2f7d4f` | `#7ee0a0` | `#3f8f60` | `#8fd7b1` | `#2f7a56` |
| `--sd-error` | `#f07a6b` | `#b3372b` | `#f77f8a` | `#c0392b` | `#f28d97` | `#b63d5e` |
| `--sd-warn` | `#e7bf78` | `#8a6a12` | `#e7c56b` | `#9a7a1a` | `#e7bf78` | `#8a6a12` |
| `--sd-caret` | = accent | = accent | = accent | = accent | = accent | = accent |
| `--sd-glow` | `rgba(242,163,60,.18)` | `rgba(168,84,14,.16)` | `rgba(95,206,138,.16)` | `rgba(30,122,74,.15)` | `rgba(196,166,255,.16)` | `rgba(109,79,208,.15)` |
| `color-scheme` | `dark` | `light` | `dark` | `light` | `dark` | `light` |

Signal and Graphite blocks are unchanged.

### 2c. Picker layout — `src/components/theme/ThemePicker.tsx`

Change the grid container `className` from `grid gap-2 sm:grid-cols-2` to `grid gap-2 sm:grid-cols-2 lg:grid-cols-3` so 5 cards form 3+2 on large screens. Cards are already data-driven (name, descriptions, swatches) and need no other change.

---

## Files

| File | Change |
|---|---|
| `src/lib/useScrolled.ts` | **New** — scroll hook |
| `src/components/NavGlass.tsx` | **New** — landing header client wrapper |
| `src/components/AccountButton.tsx` | Sign-in link → mono eyebrow + arrow |
| `src/app/page.tsx` | `header` → `NavGlass` |
| `src/components/AppHeader.tsx` | `useScrolled` + `data-scrolled` |
| `src/app/globals.css` | Nav base/scrolled states; remove scroll-timeline block + keyframes; sign-in button; 6 palettes |
| `src/lib/themes.ts` | `ColorwayId` + 3 `COLORWAYS` entries |
| `src/components/theme/ThemePicker.tsx` | grid `sm:grid-cols-2 lg:grid-cols-3` |

## Verification

1. `npx tsc --noEmit` → PASS
2. `npm run lint` → PASS
3. `npm run build` → PASS, 11 routes
4. Manual (dev server):
   - Landing + signed-out app header: `SIGN IN` mono eyebrow with animated underline + arrow on hover.
   - Both navs: transparent at top, frost + accent border + shadow after scrolling ~8px (landing inner bar shrinks).
   - `/settings` → Theme shows 5 colorways (3+2 layout); each colorway + dark/light applies live across the app.
   - New theme swatch colors match the palettes; `signal-cta`, `text-accent`, Prism tokens legible in each of the 6 new themes.
   - Landing + sign-in remain signal dark regardless of app theme.
5. Reduced-motion (`prefers-reduced-motion: reduce`): no scale/underline animation; nav frost still applies.
