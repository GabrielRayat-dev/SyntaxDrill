# Blueprint Nav Scroll Decoration — Design

Date: 2026-08-05
Branch: `main`
Status: Approved design (brainstormed with user)

## Overview

Add a Greptile-style "technical blueprint" scroll decoration to **both** nav bars — the landing nav (`signal-nav`, via `NavGlass`) and the app header (`signal-app-nav`, via `AppHeader`). Decorative corner crosshairs and hairline grid lines along the top and bottom edges of the header expand while at the top of the page, then collapse inward and lock onto the compact 68px sticky bar as the user scrolls.

The animation is **CSS-only** and rides the existing `data-scrolled` boolean attribute that both navs already set from `useScrolled()` (`src/lib/useScrolled.ts`, threshold 8). **No new scroll listener, no new JS state.**

## Constraints (carried over from the existing system)

- Both navs are full-width `<header>` elements (`sticky top-0 z-40`) containing a `h-[68px] max-w-[1440px]` inner bar. The decoration anchors to the **header's full-width corners**, not the inner bar.
- The landing nav already scales its inner content div to `.98` on scroll via `.signal-nav > div` — that selector must be narrowed so the new absolute-positioned decoration is **not** caught by the scale rule.
- No test runner. Gate cycle: `npx tsc --noEmit` → PASS, `npm run lint` → PASS, then `npm run build` → PASS.
- Reduced-motion is respected: under `prefers-reduced-motion: reduce`, decoration stays locked onto the corners (no transforms/opacity transitions), matching the existing nav convention.
- Decoration uses the existing `--sd-accent` token (at low strength when scrolled) so it themes across all 10 colorways. Landing and sign-in remain pinned to signal dark.
- The decoration must not affect layout, hit-testing, or accessibility: `position: absolute; inset: 0; pointer-events: none;` on a single wrapper, all marks `aria-hidden`.

---

## Design

### Component — `src/components/BlueprintCorners.tsx` (new)

A small presentational component with **no client directives and no hooks** — it renders static markup and lets CSS do all the work. It is inserted as the first child of each `<header>` (which is already a positioning context because of `sticky`), so the absolute wrapper anchors to the header box.

```tsx
export default function BlueprintCorners() {
  return (
    <div className="signal-blueprint" aria-hidden="true">
      {["tl", "tr", "bl", "br"].map((corner) => (
        <svg
          key={corner}
          className={`signal-blueprint-cross signal-blueprint-cross--${corner}`}
          viewBox="0 0 16 16"
          focusable="false"
        >
          <path d="M8 1.5 V14.5 M1.5 8 H14.5" />
        </svg>
      ))}
    </div>
  );
}
```

- **Grid lines** are the wrapper's own **CSS dashed borders** (`border-top` + `border-bottom`, `1px dashed var(--sd-accent)`) — the wrapper is `inset: 0` over the header, so its top/bottom edges are exactly the header's. CSS dashes stay 1px with a consistent `3px 6px` pattern at every viewport width. (An SVG grid with `stroke-dasharray` was rejected because `preserveAspectRatio="none"` stretches the dash pattern horizontally — on a 1920px-wide header each dash renders ~57px, not a hairline.)
- **Four 16×16 crosshair `<svg>`s**, each a plain `+` registration cross, absolutely positioned and centered on the 4 header corners via `translate(-50%, -50%)`.

Both the borders and the crosshair strokes use `currentColor` with `color: var(--sd-accent)` so color flows from the theme tokens. `pointer-events` is neutralized on the wrapper.

### Mounting — `src/components/NavGlass.tsx` + `src/components/AppHeader.tsx`

- `NavGlass.tsx`: render `<BlueprintCorners />` as the first child inside the `<header>` (before `{children}`).
- `AppHeader.tsx`: render `<BlueprintCorners />` as the first child inside the `<header>`, after the skip-link fragment.

Both files are client components and simply add the import + one element.

### Animation states — driven by `data-scrolled`

| State | Grid lines (top/bottom dashed border) | 4 corner crosshairs |
|---|---|---|
| **Top** (`data-scrolled="false"`, default) | Dashed accent hairlines on both edges, full `--sd-accent` | Each crosshair sits offset **14px downward** from its corner — reading as a frame taller than the 68px bar |
| **Scrolled** (`data-scrolled="true"`) | Lines fade to `12%` accent (faint hairline), stay on the edges | Crosshairs slide **up onto / lock on the corners** |

Transitions: `transform 220ms ease` on the crosshairs and `border-color 220ms ease` on the grid — matching the existing frost/scale timing (220ms) so the blueprint settle and the glass frost land together.

### CSS — `src/app/globals.css` (new rules, added near the existing nav rules)

```css
.signal-blueprint {
  border-bottom: 1px dashed var(--sd-accent);
  border-top: 1px dashed var(--sd-accent);
  color: var(--sd-accent);
  inset: 0;
  pointer-events: none;
  position: absolute;
  transition: border-color 220ms ease;
}
.signal-blueprint-cross {
  height: 16px;
  opacity: .5;
  position: absolute;
  transition: transform 220ms ease, opacity 220ms ease;
  width: 16px;
}
.signal-blueprint-cross path {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
}
.signal-blueprint-cross--tl { left: 0; top: 0; transform: translate(-50%, -50%) translate(0, 14px); }
.signal-blueprint-cross--tr { left: 100%; top: 0; transform: translate(-50%, -50%) translate(0, 14px); }
.signal-blueprint-cross--bl { left: 0; top: 100%; transform: translate(-50%, -50%) translate(0, 14px); }
.signal-blueprint-cross--br { left: 100%; top: 100%; transform: translate(-50%, -50%) translate(0, 14px); }

.signal-nav[data-scrolled="true"] .signal-blueprint,
.signal-app-nav[data-scrolled="true"] .signal-blueprint {
  border-bottom-color: color-mix(in srgb, var(--sd-accent) 12%, transparent);
  border-top-color: color-mix(in srgb, var(--sd-accent) 12%, transparent);
}
.signal-nav[data-scrolled="true"] .signal-blueprint-cross,
.signal-app-nav[data-scrolled="true"] .signal-blueprint-cross {
  transform: translate(-50%, -50%);
}
@media (prefers-reduced-motion: reduce) {
  .signal-blueprint,
  .signal-blueprint-cross {
    transition: none;
  }
  .signal-blueprint-cross {
    transform: translate(-50%, -50%);
  }
}
```

Notes:
- Crosshair motion: at top-of-page **all four** sit 14px **below** their corner (top pair inside the header, bottom pair below the bottom edge, against the hero). On scroll they slide **up** to sit centered exactly on the corners. Offset direction is downward — not outward — because the header is full-width and `sticky top-0`, so upward/horizontal offsets would push the top pair off-screen at `scrollY=0`. This is the same "frame condenses and locks onto the compact bar" intent, and the marks stay visible in both states.
- Grid-line dimming uses `border-color` → `color-mix(... 12%, transparent)` rather than `opacity`, because opacity on the wrapper would also fade the crosshair children. The scrolled grid reads as a faint hairline.
- The wrapper is `inset: 0` on the header, so its dashed `border-top`/`border-bottom` sit on the header's top/bottom edges. The landing header already has its own solid frost `border-bottom`; the dashed overlay draws just inside it, so the bottom edge may read as a **double hairline** (1px solid + 1px dashed). That reads as intentional blueprint drafting — flagged for visual sign-off in manual QA; if it looks noisy, drop the frost rule's solid border when `data-scrolled="true"`.
- The wrapper carries no `z-index` and is first-child, so it paints before the inner content; on the landing page the content transform layer is `.signal-nav > .signal-nav-inner` (below), so the decoration is not caught by the `.98` scale and stays full-size. Crosshairs poke below the header box (visible against the hero, no clipping because no ancestor sets `overflow: hidden` on the header).

### Selector narrowing — `src/app/globals.css` (existing rules)

The landing scale rule currently targets **any** direct child div:

```css
.signal-nav > div { transition: transform 220ms ease; }
.signal-nav[data-scrolled="true"] > div { transform: scale(.98); }
```

`BlueprintCorners` is a div (`signal-blueprint`) that is now a direct child, so it would wrongly inherit the `.98` scale. Narrow the selector to the actual content bar. The content bar in `src/app/page.tsx` is `<div className="mx-auto flex h-[68px] max-w-[1440px] ...">` — add a `signal-nav-inner` class to it and update the rules:

```css
.signal-nav > .signal-nav-inner { transition: transform 220ms ease; }
.signal-nav[data-scrolled="true"] > .signal-nav-inner { transform: scale(.98); }
```

And in the reduced-motion block, the `.signal-nav > div` entry becomes `.signal-nav > .signal-nav-inner`.

`AppHeader.tsx` has no `> div` scale rule, so no change there beyond mounting the component.

---

## Files

| File | Change |
|---|---|
| `src/components/BlueprintCorners.tsx` | **New** — blueprint grid + 4 corner crosshairs |
| `src/components/NavGlass.tsx` | Mount `<BlueprintCorners />` as first child of header |
| `src/components/AppHeader.tsx` | Mount `<BlueprintCorners />` as first child of header |
| `src/app/page.tsx` | Add `signal-nav-inner` class to the landing nav content bar |
| `src/app/globals.css` | New `.signal-blueprint*` rules + scrolled states + reduced-motion; narrow `.signal-nav > div` → `.signal-nav > .signal-nav-inner` |

## Verification

1. `npx tsc --noEmit` → PASS
2. `npm run lint` → PASS
3. `npm run build` → PASS
4. Manual (dev server):
   - Landing + app header: dashed accent grid hairlines on top/bottom edges; 4 `+` crosshairs at the header corners.
   - At top of page: crosshairs sit 14px below each corner; after scrolling ~8px they slide up and lock exactly on the 4 corners, grid lines fade to a faint `12%` accent hairline, landing inner bar still scales to `.98` (decoration does NOT scale).
   - Decoration appears in all 10 colorways (accent-tinted); landing + sign-in stay signal dark.
   - Crosshairs sit on the **header** corners, not the 1440px inner-bar corners (full-width blueprint frame).
   - Landing bottom edge: confirm the solid frost border + dashed blueprint border read as a clean double hairline (not noise) in both scroll states.
5. Reduced-motion (`prefers-reduced-motion: reduce`): no crosshair motion; decoration stays locked on the corners; grid lines static.
6. No layout shift: decoration is absolute + `pointer-events: none`; content and hit-testing unaffected.
