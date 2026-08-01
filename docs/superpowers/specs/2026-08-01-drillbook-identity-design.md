# Drillbook Identity - Design Specification

**Date:** 2026-08-01
**Status:** Approved (question: "Approve and proceed") + explicit go signal to run `design-taste-frontend`
**Owner:** opencode

## 1. Design Read

> Reading this as: a developer-learning product (typing-practice app) for learners who write real code, with a premium editorial-manual language, leaning toward native CSS tokens + Geist + Space Grotesk (display) + JetBrains Mono, disciplined monochrome, real interactive product visuals.

- **Page kind:** landing + product app (practice / speed / settings / progress). The skill governs the marketing surfaces; the app restyles to match the same token system.
- **Audience:** dev learners; trust-first about honesty ("free forever", local-first).
- **Vibe words (user):** "premium", "impressed me", unique navigation, unique buttons, light/dark toggle, hero. Explicitly judged the earlier warm sample as "good but premium lacking".
- **Existing brand assets:** `>_` prompt logo, Geist + JetBrains Mono + Space Grotesk, graded-pen semantics (blue = what you write, red = errors, green = correct), "Free forever" positioning.

### 1.1 Dials (approved)

- `DESIGN_VARIANCE: 6` - asymmetric but disciplined; hero split-screen, offset features, no equal 3-column slop.
- `MOTION_INTENSITY: 3` - existing `sd-rise` + caret blink only; honor reduced-motion; no GSAP, no scroll-jack.
- `VISUAL_DENSITY: 4` - airy editorial; generous section padding; cards only where elevation earns it.

## 2. Non-Negotiables (skill rules)

- **ZERO em-dashes (`—`) and en-dashes (`–`) product-wide.** Use hyphens, periods, colons. Every `—` placeholder in app copy gets replaced.
- Middle-dot (`·`) max 1 per line; never the default separator.
- NO section-number eyebrows, NO decorative status dots, NO floating corner labels, NO scroll cues, NO "version" badges in hero, NO scroll cue strips.
- Hero = max 4 text elements (eyebrow / headline / subtext / CTAs). NO trust micro-strip, tagline below CTAs, or avatar rows inside hero.
- NO 3-column equal feature cards. Feature section uses grouped chunks (see 4.2).
- NO div-based fake screenshots. Hero visual is the **real, interactive** `HeroDemo` drill sheet.
- One accent color per page (locked); one radius system (locked); one font family set (locked).
- NO pure `#000000` / `#ffffff`; off-black / off-white.
- Saturation < 80% on accents.

## 3. Palette System (replaces the 4 editor colorways)

Three variants, each with light + dark token sets. New cool family (previous warm sepia "Pencil" was banned; Pencil is now cool graphite).

### Paper (default, light) - "cool paper + blue ink"

| Token | light | dark |
|---|---|---|
| bg | `#f2f4f8` | `#0f1620` |
| surface | `#fafbfd` | `#141d2a` |
| raised | `#e9edf4` | `#1d2838` |
| border | `#d8dde8` | `#2a3a4d` |
| text | `#1c2433` | `#d5dce8` |
| muted | `#647084` | `#8a97ab` |
| accent | `#2563c9` | `#6ea8ff` |
| accent-2 | `#4f46c9` | `#a5b4fc` |
| correct | `#1f9d55` | `#4ade80` |
| error | `#dc3d5a` | `#fb7185` |
| warn | `#b07c1f` | `#fbbf24` |
| caret | `#2563c9` | `#6ea8ff` |
| glow | `rgba(37,99,201,0.14)` | `rgba(110,168,255,0.16)` |

### Night - "slate + lamp-blue"

| Token | light | dark |
|---|---|---|
| bg | `#e9eef5` | `#0b1220` |
| surface | `#f6f9fd` | `#101a2c` |
| raised | `#dce6f2` | `#182741` |
| border | `#c9d6e6` | `#243a52` |
| text | `#16213a` | `#d7e3f8` |
| muted | `#5b6b85` | `#8ba0c0` |
| accent | `#2a63d4` | `#7ab0ff` |
| accent-2 | `#6b5de7` | `#a5c1ff` |
| correct | `#1e9e6a` | `#5ee0a9` |
| error | `#e05263` | `#ff8fa3` |
| warn | `#c07f1e` | `#ffcf5c` |
| caret | `#2a63d4` | `#7ab0ff` |
| glow | `rgba(42,99,212,0.14)` | `rgba(122,176,255,0.16)` |

### Pencil - "cool graphite, lead-dark ink, one slate-teal accent"

| Token | light | dark |
|---|---|---|
| bg | `#eceef1` | `#0e1114` |
| surface | `#f7f8fa` | `#14181c` |
| raised | `#dfe3e8` | `#1c2228` |
| border | `#ccd2d9` | `#2a313a` |
| text | `#22272e` | `#dde1e6` |
| muted | `#5c6470` | `#8a929e` |
| accent | `#3f7087` | `#5aa0b8` |
| accent-2 | `#4b7fa0` | `#7cc0d8` |
| correct | `#2f8f66` | `#55c98f` |
| error | `#c94f5a` | `#ff7d8a` |
| warn | `#a5742c` | `#e6b350` |
| caret | `#3f7087` | `#5aa0b8` |
| glow | `rgba(63,112,135,0.14)` | `rgba(90,160,184,0.16)` |

> Note: corrected typo values during implementation (`border`, `raised`, `accent-2` in night). Final hexes live in `globals.css`.

- **Default:** `paper` light. `DEFAULT_COLORWAY = "paper"`, `DEFAULT_THEME = "paper"`.
- **Legacy migration:** stored `sd.theme` ids from the old system (`tokyo-night`, `rose-pine`, `dracula`, `sunset`, plus `-light`) map: dark variants → `night`, light variants → `paper`. The `layout.tsx` inline script performs this migration before paint; `ThemeProvider` mirrors it via `migrateTheme`.

## 4. Landing Layout (Section 11 redesign + Section 4.7 layout discipline)

8 sections, ≥ 4 distinct layout families, each family at most once.

| # | Section | Layout family | Content |
|---|---|---|---|
| 1 | Nav | Floating pill nav (unique) | `>_` logo, links (Practice, Speed), ModeToggle (light/dark), AccountButton. NOT edge-to-edge: floating rounded container, max-w, mt-3. |
| 2 | Hero | Asymmetric split (text left / live drill sheet right) | Eyebrow `//`, 2-line headline (with `write it();` accent line), ≤20-word subtext, 2 CTAs. Right = real interactive `HeroDemo`. |
| 3 | Data strip | Real-data inline strip | `LandingStats` (real aggregates; only when data exists). |
| 4 | Two ways | 2-card split | Practice mode card + Speed test card. |
| 5 | Tracks | Card-per-track grid | One card per concept; "More on the roadmap" tile. |
| 6 | Features | Grouped chunks (no 3-column equal cards) | 3 clusters (Learn / Feedback / Runs anywhere), each cluster = heading + 2 rows with sparse dividers. |
| 7 | Roadmap | Grouped timeline | Now / Next / Later, no filled-bar tracks (banned). |
| 8 | CTA | Centered | "Free. Forever." + primary CTA. |
| 9 | Footer | Hairline footer | Brand, links, privacy line. |

### 4.1 Nav (unique, user-requested)

- Floating rounded pill: `max-w-5xl mx-auto mt-3 sticky top-3 z-40 rounded-full border border-edge bg-page/80 backdrop-blur`, height ≤ 80px (target 56px).
- Left: `>_` prompt mark + wordmark. Center/right: links. Right: ModeToggle + AccountButton (app routes).
- One line at desktop; condense below `md`.

### 4.2 Features - grouped chunks

3 clusters, 2 features each, rows separated by one hairline per cluster (no `border-b` on every row):
- **Learn** - Real code, real syntax; Explain-then-type.
- **Feedback** - Instant char-by-char state; Scenes that react.
- **Runs anywhere** - In-browser (sandboxed eval / Pyodide); Local-first progress + account sync.

### 4.3 Roadmap

Grouped timeline, no bars: Now (accent dot, real) / Next (good dot) / Later (muted dot) columns. Dots only as semantic state (allowed: roadmap status).

## 5. Copy Audit (em-dash sweep)

- `src/app/layout.tsx` metadata title: `SyntaxDrill — Learn syntax by typing it` → `SyntaxDrill | Learn syntax by typing it`.
- `src/app/page.tsx`: rewrite all copy; no em-dashes; hero subtext ≤ 20 words; "everything below is already in the app" stays but reworded per skill (no micro-meta under eyebrows).
- `HeroDemo.tsx` line 118: `— that's a clean run.` → `that is a clean run.`
- `src/app/app/page.tsx`, `SpeedScreen.tsx`, `PracticeScreen.tsx`, `SpeedBests.tsx`: replace `—` no-value placeholders (use `–`? NO - use `·`? max 1/line - use a plain `0` or a blank dash rule; decide in Phase 3).

## 6. Phases (each committed + pushed)

1. **Theme rework** - `themes.ts`, `globals.css`, `ThemeProvider` migration, `layout.tsx` inline script, `ThemePicker` 3 cards, `ModeToggle` premium.
2. **Landing redesign** - new nav, hero, sections; remove `#themes` section + ThemePicker + Palette import + "Themes" nav link; HeroDemo + LandingStats polish; copy audit.
3. **App restyle** - practice / speed / settings / progress / scenes to the paper identity + shape lock.
4. **Pre-flight + verify** - `tsc`, `lint`, `next build`, visual pass both modes; full skill pre-flight checklist.

## 7. Verification

- `npx tsc --noEmit`
- `npm run lint`
- `next build`
- Manual: both light/dark, all 3 variants, landing + settings + app.
