# Blueprint Nav Scroll Decoration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Greptile-style technical-blueprint scroll decoration (dashed grid edges + 4 corner crosshairs) to both the landing nav (`signal-nav`) and app header (`signal-app-nav`), expanding at the top of the page and locking onto the compact 68px bar on scroll.

**Architecture:** One small presentational component (`BlueprintCorners.tsx`) renders a `.signal-blueprint` wrapper (no JS, no hooks) whose CSS dashed borders form the grid lines and whose four absolutely-positioned `<svg>` `+` crosses form the corner marks. Both navs already set `data-scrolled` from `useScrolled()`, so the whole animation is CSS selectors against that attribute — no new listener, no new state. The landing nav's existing `.signal-nav > div` scale rule is narrowed to `.signal-nav > .signal-nav-inner` so the new decoration isn't caught by the `.98` scale.

**Tech Stack:** Next.js 16 (App Router, React 19), Tailwind CSS v4, inline SVG. Windows PowerShell 5.1 (no `&&`).

## Global Constraints

- **No automated test runner exists.** `package.json` scripts are `dev`, `build`, `start`, `lint` only. Gate cycle per task: `npx tsc --noEmit` → PASS, then `npm run lint` → PASS, then commit. A full `npm run build` (10 routes) runs in the final task.
- **Windows PowerShell 5.1.** There is NO `&&`. Chain with `;` and `if ($?) { ... }`. Always quote paths containing spaces, e.g. `git add "src/components/BlueprintCorners.tsx"`.
- **Decoration is CSS-only** and rides the existing `data-scrolled` attribute both navs already set from `useScrolled()` (`src/lib/useScrolled.ts`, threshold 8). Do **not** add scroll listeners or state.
- **Must not affect layout, hit-testing, or accessibility:** wrapper is `position: absolute; inset: 0; pointer-events: none;`, all marks `aria-hidden` / `focusable="false"`.
- **Themes:** decoration uses only `var(--sd-accent)` so it themes across all 10 colorways. Landing + sign-in remain pinned to signal dark (no change).
- **`prefers-reduced-motion: reduce`:** no crosshair motion; decoration stays locked on the corners; transitions disabled.
- Each task changes ONLY the files listed in its **Files** block.

---

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `src/components/BlueprintCorners.tsx` | **New** — blueprint wrapper + 4 corner crosshairs | 1 |
| `src/app/globals.css` | New `.signal-blueprint*` rules + scrolled states + reduced-motion | 1 |
| `src/app/globals.css` | Narrow `.signal-nav > div` → `.signal-nav > .signal-nav-inner` (4 lines) | 2 |
| `src/app/page.tsx` | Add `signal-nav-inner` class to the landing content bar | 2 |
| `src/components/NavGlass.tsx` | Mount `<BlueprintCorners />` as first child of header | 2 |
| `src/components/AppHeader.tsx` | Mount `<BlueprintCorners />` as first child of header | 2 |

---

### Task 1: BlueprintCorners component + CSS

**Files:**
- Create: `src/components/BlueprintCorners.tsx`
- Modify: `src/app/globals.css` (insert new rules between the existing nav `@media (prefers-reduced-motion: reduce)` block ending at line 279 and the `@media (max-width: 767px)` rule at line 280)

**Interfaces:**
- Consumes: nothing from other tasks. Reads `var(--sd-accent)` from the active `[data-theme]` palette (existing).
- Produces: `BlueprintCorners` default-exported from `@/components/BlueprintCorners`; CSS classes `.signal-blueprint`, `.signal-blueprint-cross`, `.signal-blueprint-cross--{tl,tr,bl,br}`, plus `[data-scrolled="true"]` and reduced-motion states. Task 2 imports the component.

- [ ] **Step 1: Create the component**

Create `src/components/BlueprintCorners.tsx`:

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

No `"use client"` directive and no hooks — this is a purely presentational component. Importing it from a client component is valid; it renders as part of that client component tree.

- [ ] **Step 2: Add the blueprint CSS**

In `src/app/globals.css`, insert the following block immediately **after** the closing `}` of the existing `@media (prefers-reduced-motion: reduce)` rule (the one at line 279 whose last entry is `.signal-nav[data-scrolled="true"] > div { transform: none; }`) and **before** the `@media (max-width: 767px) { ... }` rule at line 280:

```css
/* Blueprint scroll decoration: dashed grid edges + corner crosshairs */
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

Why this design (from the spec):
- Grid lines are the wrapper's own CSS dashed `border-top`/`border-bottom`, so dashes stay a crisp `3px 6px` at any viewport width. (An SVG grid was rejected: `preserveAspectRatio="none"` + `stroke-dasharray` stretches each dash to ~57px on a 1920px-wide header.)
- Crosshairs start **14px below** each corner (reading as a taller frame) and slide **up** to lock exactly on the corners when `data-scrolled="true"`. Direction is downward because the header is full-width `sticky top-0` — outward offsets would push the top pair off-screen at `scrollY=0`.
- Grid dimming uses `border-color` → `color-mix(... 12%, transparent)` instead of `opacity`, because opacity on the wrapper would also fade the crosshair children.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 4: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/BlueprintCorners.tsx src/app/globals.css
git commit -m "feat(nav): blueprint corner crosshairs + grid-edge component"
```

---

### Task 2: Mount on both navs + selector narrowing + final verification

**Files:**
- Modify: `src/components/NavGlass.tsx` (import; add element as first child of header)
- Modify: `src/components/AppHeader.tsx` (import; add element as first child of header)
- Modify: `src/app/page.tsx` (add `signal-nav-inner` class to the landing content bar div)
- Modify: `src/app/globals.css` (narrow `.signal-nav > div` → `.signal-nav > .signal-nav-inner` on lines 269, 270, 277, 278)

**Interfaces:**
- Consumes: `BlueprintCorners` from `@/components/BlueprintCorners` (Task 1). Both navs already render `data-scrolled` (existing code).
- Produces: decoration mounted on both navs; the landing scale rule now targets only the content bar. Nothing consumed downstream.

- [ ] **Step 1: Mount on the landing nav**

In `src/components/NavGlass.tsx`, add an import after the existing `import { useScrolled } from "@/lib/useScrolled";`:

```tsx
import BlueprintCorners from "@/components/BlueprintCorners";
```

Then change the return so `<BlueprintCorners />` is the first child of the `<header>`:

```tsx
  return (
    <header className={className} data-scrolled={scrolled}>
      <BlueprintCorners />
      {children}
    </header>
  );
```

- [ ] **Step 2: Mount on the app header**

In `src/components/AppHeader.tsx`, add an import after the existing `import { useScrolled } from "@/lib/useScrolled";`:

```tsx
import BlueprintCorners from "@/components/BlueprintCorners";
```

Then change the `<header>` opening tag block so `<BlueprintCorners />` is the first child inside the header, before the inner bar div:

```tsx
      <header className="signal-app-nav sticky top-0 z-40" data-scrolled={scrolled}>
        <BlueprintCorners />
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-8">
```

- [ ] **Step 3: Tag the landing content bar**

In `src/app/page.tsx`, line 67, change the content bar div className from:

```tsx
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-8">
```

to:

```tsx
        <div className="signal-nav-inner mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-8">
```

This class is required so Task 2's selector narrowing keeps the `.98` scale working on the content bar only. `AppHeader.tsx`'s inner bar needs no class — there is no `> div` scale rule for `.signal-app-nav`.

- [ ] **Step 4: Narrow the landing scale selector**

In `src/app/globals.css`, the current rules are:

```css
.signal-nav > div { transition: transform 220ms ease; }
.signal-nav[data-scrolled="true"] > div { transform: scale(.98); }
```

Replace with:

```css
.signal-nav > .signal-nav-inner { transition: transform 220ms ease; }
.signal-nav[data-scrolled="true"] > .signal-nav-inner { transform: scale(.98); }
```

In the existing `@media (prefers-reduced-motion: reduce)` block, change:

```css
  .signal-nav, .signal-app-nav, .signal-nav > div { transition: none; }
  .signal-nav[data-scrolled="true"] > div { transform: none; }
```

to:

```css
  .signal-nav, .signal-app-nav, .signal-nav > .signal-nav-inner { transition: none; }
  .signal-nav[data-scrolled="true"] > .signal-nav-inner { transform: none; }
```

Without this narrowing, `BlueprintCorners` (a div) would wrongly inherit the `.98` scale on the landing page.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 6: Lint**

Run: `npm run lint` → PASS.

- [ ] **Step 7: Production build**

Run: `npm run build` → PASS, 10 routes.

- [ ] **Step 8: Manual verification (dev server)**

Start `npm run dev` and verify:

1. Landing + app header: dashed accent grid hairlines on the top/bottom edges; 4 `+` crosshairs at the header corners.
2. At top of page: crosshairs sit 14px below each corner; after scrolling ~8px they slide up and lock exactly on the 4 corners, grid lines fade to a faint `12%` accent hairline, landing inner bar still scales to `.98` (decoration does NOT scale).
3. Decoration appears in all 10 colorways (accent-tinted); landing + sign-in stay signal dark.
4. Crosshairs sit on the **header** corners, not the 1440px inner-bar corners (full-width blueprint frame).
5. Landing bottom edge: confirm the solid frost border + dashed blueprint border read as a clean double hairline (not noise) in both scroll states. If noisy, the follow-up is to drop the frost rule's solid `border-bottom` when `data-scrolled="true"`.
6. DevTools `emulate prefers-reduced-motion: reduce`: no crosshair motion; decoration stays locked on the corners; grid lines static.
7. No layout shift: content and click targets are unaffected (wrapper is `pointer-events: none`).

- [ ] **Step 9: Commit**

```bash
git add src/components/NavGlass.tsx src/components/AppHeader.tsx "src/app/page.tsx" src/app/globals.css
git commit -m "feat(nav): blueprint scroll decoration on landing and app navs"
```
