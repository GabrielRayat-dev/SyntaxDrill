# SyntaxDrill App Chrome: Workbook Interior

**Date:** 2026-08-02
**Status:** Approved design, spec for review

## Design Read

> Reading this as: the landing page is the field guide's cover. Phase B
> restyles the logged-in product to read as the field guide's interior
> workbook, the pages where the learner actually does the drills. Same
> aged-paper tokens, EB Garamond display, JetBrains Mono annotations, ruled
> and ledger surfaces, rubber stamps, and squared shapes. Calmer than the
> cover: a uniform ledger rhythm instead of the landing's editorial asymmetry.

## Relationship to the Identity Spec

- Complements `2026-08-02-field-guide-identity-design.md`. Phase A shipped the
  landing plus the six theme token sets; Phase B ships the app chrome.
- Tokens, fonts, paper grain, and the `.sd-stamp`, `.sd-rise`, `.index-hole`,
  `.ruled` utilities already exist. Phase B adds a few shared primitives and
  applies the language surface by surface.

## Dials

- `DESIGN_VARIANCE: 6` (workbook interior: uniform ledger rhythm)
- `MOTION_INTENSITY: 4` (same as landing: stamp, gentle rise, no loops)
- `VISUAL_DENSITY: 4` (printed-page rhythm)

## System Additions (globals.css)

New utilities in the existing style:

- `.sd-eyebrow` — mono uppercase micro label, `letter-spacing: 0.18em`,
  `color: var(--sd-muted)`. Used above every `font-display` page heading and
  section; the chrome echo of the landing's `// field catalogue: js + python`.
- `.sd-ledger` / `.sd-ledger-row` — ledger strip. `.sd-ledger` is the
  container with `border-y` rules; `.sd-ledger-row` is one row with a dotted
  leader between label and value (`border-b border-dotted`, flex
  justify-between). Labels mono uppercase, values `font-mono tabular-nums`.
- `.sd-field` — input treatment: `border-radius: 2px`, border
  `var(--sd-edge)`, background `var(--sd-raised)`.
- `.sd-nav-link` — dotted-underline text link for header nav: base muted,
  hover ink, active accent with underline.
- Reuse `.sd-stamp`, `.sd-stamp-accent`, `.index-hole`, `.ruled`, `.sd-rise`,
  `.paper-grain` as-is.

## Shape Rules (chrome)

- Buttons and controls: `2px` radius.
- Panels and cards: `8px` (`rounded-lg`).
- No `rounded-full` anywhere in chrome except the account avatar photo
  circles. Progress bars, segments, and theme swatches that are pills today
  become squared.
- Remove legacy soft radii from chrome: `rounded-xl`, `rounded-2xl`,
  `rounded-full` pills.

## Header and Shared Layout

### AppHeader (restyle)

- Wordmark: `font-display` "SyntaxDrill" with a small mono tag (e.g.
  `workbook`) beside it, linking to `/`. Keep the skip link.
- Nav: Practice, Speed, Settings, Progress as `.sd-nav-link` mono uppercase
  text links, active state from current route via `usePathname`. Settings and
  Progress gain header entries for the first time.
- Right cluster: ModeToggle (already squared) + AccountButton. Avatar trigger
  squared `rounded-[2px]` ring; the photo stays a circle inside.
- Bar: `sticky top-0 z-40 border-b border-edge/70 bg-page/80 backdrop-blur`,
  `h-16` to match the landing.
- Mobile: keep all four nav entries reachable (compact row or wrap).

### Route-group layout (refactor)

- Move the logged-in pages under `src/app/(app)/`: `app/`, `practice/`,
  `speed/`, `settings/`, `progress/`.
- Add `src/app/(app)/layout.tsx` rendering `<AppHeader />` plus
  `<main id="main" className="mx-auto w-full max-w-5xl px-4">` around
  `{children}`.
- Delete the per-page `<AppHeader />` + `<main>` scaffolding and repeated
  `max-w-*` wrappers from the five pages.
- Fix relative import depths in moved files; verify all routes still resolve.
- Sign-in stays outside the group with its own centered shell.

## Per-Surface Treatments

### Tracks dashboard (`/app`)

- `.sd-eyebrow` above the `font-display` "Practice tracks" heading.
- Language toggle buttons: squared `2px`.
- Totals row: `.sd-ledger` strip, `font-display` numerals, mono uppercase
  labels, `divide-edge/60`.
- Concept cards: index-card tiles, squared corners, mono tags, difficulty in
  token colors, `sd-rise` on mount.
- Speed CTA row: plate with `sd-stamp-accent` accent; primary CTA squared.

### Practice (`PracticeScreen.tsx`)

- Config: `.sd-eyebrow` + `font-display` heading; choice buttons squared;
  info box as a `rounded-lg` ledger panel with `·` separators.
- Read: difficulty chips token-colored (`good` / `warn` / `bad`); progress
  segments squared; specimen `CodeBlock` framed as a `rounded-lg` panel with a
  mono uppercase header strip.
- Type: `CodeEditor` framed panel `rounded-lg` (keep the mono `code-layer`
  and accent focus ring); StatChip row becomes a ledger strip.
- Result: "Mastered" renders as `.sd-stamp` (or `sd-stamp-accent`), animation
  disabled under `prefers-reduced-motion`; VerdictBanner and output box
  `rounded-lg`; buttons squared; primary CTA the ink plate.
- Summary: "X/Y mastered" as a stamp or ledger line; the 4-up stats become a
  ledger strip.

### Speed test (`SpeedScreen.tsx`)

- Fix the mojibake at `SpeedScreen.tsx:474`. The source holds the UTF-8 bytes
  of an em-dash rendered as `â€”`. Rewrite without a dash: "Plain words, no
  code. Measure raw typing speed and accuracy."
- Typing card and result plate: `rounded-2xl` to `rounded-lg`.
- ConfigBar segmented control: squared `2px`.
- Result plate: keep the giant `font-display` WPM numeral; frame as a field
  record plate with `index-hole`s; "words per minute" mono label; "Go again"
  primary squared, "Change test" squared.

### Settings and ThemePicker

- SettingsPanel: `.sd-field` inputs, squared buttons, `rounded-lg` sections,
  avatar circle kept.
- ThemePicker full variant (used in SettingsPanel): 6 ledger rows, one per
  variant, built from `COLORWAYS` x light/dark.
  - Each row: variant name, short field-guide description, squared swatch
    tiles built from tokens (remove the hardcoded `border-black/10`), active
    state as accent border plus a check.
  - Copy, no dashes:
    - Paper, light: "Cream stock, ink, vermilion. The classic field guide."
    - Paper, dark: "The reading room. Warm lamplit charcoal."
    - Night, light: "Library slate and lamp-blue ink."
    - Night, dark: "Night shift. Deep blue-charcoal."
    - Pencil, light: "Graphite, cool paper, slate-teal marks."
    - Pencil, dark: "Field notebook graphite, heavy shadow."
  - Remove the Dark/Light ModeControl toggle and the unused compact variant
    (dead code). Theme switching flows through the existing ThemeProvider
    unchanged; selecting a row sets the full variant id.

### Progress

- Eyebrows on page headings.
- ConceptBars: tracks squared, keep token colors.
- HistoryList, SpeedBests, StreakCard: already ledger-like; square any
  remaining soft corners, add `sd-rise` reveals, keep `·` labels.
- TrendChart: untouched, it is a fully token-driven SVG.

### Scenes and sign-in

- ServerConnectScene: status dots `rounded-full` to squared; the `✅` / `❌`
  emoji to `✓` / `✗` glyphs matching VerdictBanner; keep the terminal frame,
  mono copy, and the `·` in "connection refused · postgres:5432"; the inline
  `var(--sd-warn)` dot becomes a token class.
- FinishLineScene: untouched, it is a token-driven SVG.
- SigninCard: `rounded-2xl` to `rounded-lg`; inputs `.sd-field`; buttons
  squared.

## Non-Token Leaks to Fix

- `lib/concepts.ts` difficulty hexes (`#9ece6a` / `#e0af68` / `#f7768e`,
  legacy palette) to token classes: beginner `good`, intermediate `warn`,
  advanced `bad`. Applied at `PracticeScreen.tsx:220-227` and concept cards.
- `ThemePicker.tsx:86` `border-black/10` to a token (`border-edge`).
- `ServerConnectScene.tsx:38` inline `var(--sd-warn)` to `bg-warn`.
- `SpeedScreen.tsx:474` mojibake dash (above).

## Copy Rules (chrome)

- Zero `—` and `–` in chrome copy. `·` allowed. Fix the one mojibake.
- Arrows: `→` for forward actions, `←` for back links.
- Mono uppercase `.sd-eyebrow` above every `font-display` page heading.
- `sd-rise` on phase transitions (already partly present).

## Scope

- In: header, route-group layout, tracks dashboard, practice, speed, settings
  plus ThemePicker, progress, scenes, sign-in, primitives, non-token leaks,
  copy.
- Out: the landing (`page.tsx`, HeroDemo, LandingStats), theme token values,
  ThemeProvider logic, DB/API logic, FinishLineScene, TrendChart.
- Phase B is presentational only. No session, account, or record logic
  changes.

## Preservation

- Routes `/`, `/app`, `/practice`, `/speed`, `/settings`, `/progress`,
  `/signin` all unchanged after the `(app)` group move.
- Behaviors: practice and speed session flow, auth, sync, theme switching
  across all six variants, skip link, focus states, `prefers-reduced-motion`
  (stamps and reveals disabled).
- Theme script and paper grain already global.

## Verification

- `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass.
- Grep sweeps: no `rounded-full` in chrome except sanctioned avatar circles;
  no `—` / `–` in chrome copy; no inline legacy difficulty hexes.
- Manual pass: every surface in all six themes (paper-light default included),
  light and dark.
- Subagent-driven development with per-task reviews and a whole-branch review,
  then push only after user confirmation.

## Anti-Patterns Honored

No AI-purple, no glassmorphism, no pills, no em-dashes, no `rounded-2xl` or
larger cards, no fake screenshots, no infinite animation loops.
