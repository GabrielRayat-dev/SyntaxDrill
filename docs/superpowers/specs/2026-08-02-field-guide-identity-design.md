# SyntaxDrill Field Guide Identity

**Date:** 2026-08-02
**Status:** Approved direction, spec to be reviewed

## Design Read

> Reading this as: a dev-education landing + app for learners and early-career
> developers, with a heritage field-guide editorial language, leaning toward
> custom CSS tokens + EB Garamond serif + JetBrains Mono annotations + aged
> paper / ink / vermilion palette, asymmetric editorial layouts.

## Dials

- `DESIGN_VARIANCE: 8` (asymmetric editorial: split hero, offset grids, margin notes)
- `MOTION_INTENSITY: 4` (tactile and calm: stamp clunk, gentle rise, no loops)
- `VISUAL_DENSITY: 4` (spacious, printed-page rhythm)

## Concept

SyntaxDrill presents itself as **a vintage field guide to code**. The learner
is a naturalist in the field, and every snippet is a **specimen**: observed,
labeled, and transcribed from memory into the drillbook. Practice is
transcription from memory. This re-contextualizes the product the way
CSSBattle re-contextualized CSS as a game: it is neither IDE nor terminal.

It is Greptile-confident in typography and Bugster-warm in material. The
physical-book metaphor is pushed hard: paper grain, ruled backgrounds,
index-card drill cards, rubber stamps, margin notes, a table-of-contents nav,
and a colophon footer.

## Type System

| Role | Face | Source | Notes |
|---|---|---|---|
| Display serif | **EB Garamond** | `next/font/google` | Chapter titles, hero, big numerals. Fits the 1960s handbook. Replaces the previously proposed Fraunces (banned as an LLM-default by the governing skill; EB Garamond is from the approved serif pool). |
| Body serif | **Source Serif 4** | `next/font/google` | Prose, section bodies. |
| Mono | **JetBrains Mono** | already loaded | Code, specimen tags, margin notes, tabular numerals. |
| Sans (app chrome only) | **Geist** | already loaded | Dense dashboard UI in Phase B only. |

Emphasis rule: italic/bold of the same serif family for headlines. The only
cross-family exception is genuine code tokens (mono) inside prose or
headlines, which is semantically motivated in a code field guide.

## Color System

Six token sets, same structure as today (`paper`, `night`, `pencil` x
`light`/`dark`), retuned to the identity. Default stays `paper-light`.

### Paper: "Aged stock, ink, vermilion" (the star, default)

**Light**
```
bg #f1ecdf | surface #f8f4ea | raised #e9e2d0 | border #d8cfba
text #23201a | muted #6f6758 | accent #b3401f | accent-2 #8a2f16
correct #3d7a4a | error #a6342c | warn #9a6a1d | caret #b3401f
glow rgba(179,64,31,0.12) | color-scheme light
```

**Dark: "the reading room"** (warm lamplit charcoal, not near-black blue)
```
bg #1c1712 | surface #241e17 | raised #2e261d | border #40382c
text #e7ddc8 | muted #a2957d | accent #e0662e | accent-2 #d97e3a
correct #7fa86f | error #e06a55 | warn #e0b06a | caret #e0662e
glow rgba(224,102,46,0.16) | color-scheme dark
```

### Night: "Night shift, lamp-blue"

**Light** keeps the cool library slate: `bg #ebf0f6 | surface #f6f9fd |
raised #dfe7f0 | border #c9d4e2 | text #1b2433 | muted #5b6a80 |
accent #2a63d4 | accent-2 #5b4fd6 | correct #1e9e6a | error #d9486a |
warn #c07f1e | caret #2a63d4 | glow rgba(42,99,212,0.14) | light`

**Dark** deep blue-charcoal: `bg #0d1322 | surface #131b2e | raised #1c2740 |
border #2b3a56 | text #dbe6f7 | muted #8ba0c0 | accent #6fb4ff |
accent-2 #a5b4fc | correct #5ee0a9 | error #ff7d8a | warn #ffd27a |
caret #6fb4ff | glow rgba(111,180,255,0.16) | dark`

### Pencil: "Graphite, cool paper, slate-teal marks"

**Light** `bg #eef0f2 | surface #f7f8fa | raised #e1e5e8 | border #cbd2d8 |
text #22282e | muted #5c6670 | accent #3f7087 | accent-2 #2f5f78 |
correct #2f8f66 | error #c94f5a | warn #a5742c | caret #3f7087 |
glow rgba(63,112,135,0.14) | light`

**Dark** graphite `bg #121518 | surface #191d21 | raised #22272d |
border #31383f | text #e2e6ea | muted #929aa4 | accent #6fb0c4 |
accent-2 #8cc9d9 | correct #55c98f | error #ff7d8a | warn #e6b350 |
caret #6fb0c4 | glow rgba(111,176,196,0.16) | dark`

Contrast policy: primary CTA is the **ink plate** (text color on page color),
which is near-black on cream and passes AA at any size. Accent is used for
links, code tokens, stamps, margin notes, and small highlights, never as the
full-bleed button fill at 14px. Audit every token pair before shipping.

## Shape System (locked, one rule set)

- Buttons and stamps: squared, `2px` radius.
- Cards and plates: `8px` radius.
- Inputs (Phase B): `6px` radius.
- No rounded-full pills anywhere. ModeToggle, nav CTA, all buttons go squared.

## Material Language (the "never seen before" layer)

1. **Paper grain:** fixed full-viewport SVG noise overlay (`pointer-events-none`,
   low opacity), plus faint ruled notebook lines behind the hero only.
2. **Index cards:** drill cards are physical index cards: two punched holes at
   the top, a hairline border, a specimen tag row, ruled baseline.
3. **Rubber stamps:** on clean runs and the "Free. Forever." plate, a rotated,
   bordered, uppercase spaced stamp that "clunks" in via keyframe (feedback).
4. **Margin notes:** italic mono annotations in the hero and tracks sections,
   connected by a short hairline leader. Genuine field-guide marginalia.
5. **TOC nav:** sticky hairline-ruled bar, serif chapter names, no floating
   pill. The nav is the book's contents page.
6. **Fold separators:** between major chapters, a hairline with a soft warm
   shadow suggesting a page gutter. Used sparingly, not on every section.
7. **Colophon footer:** "Set in EB Garamond and JetBrains Mono. Printed on
   recycled field paper." No version strings, no fake numbers.
8. **Numbers:** big serif numerals (`font-display`) with mono unit labels.

## Landing Structure (9 sections, layout families)

1. **TOC nav** (hairline bar): wordmark `SyntaxDrill` serif + mono `DR-001`
   tag; center chapter links with dotted leaders; right ModeToggle + Start
   practicing (ink plate) + AccountButton. One line, under 72px.
2. **Hero** (asymmetric split, 4 text elements): mono eyebrow
   `// field catalogue: js + python`; serif headline
   "Learn to type the code you will really write." (2 lines, `write` in
   EB Garamond italic); subtext under 20 words; 2 CTAs. Right: the specimen
   card (restyled HeroDemo). Eyebrow count budget: this is 1 of 3 allowed.
3. **Field record** (printed ledger strip, no cards): LandingStats as a
   hairline-ruled table of real aggregates, big serif numerals + mono labels.
4. **Two ways to drill** (2 index cards, asymmetric heights): practice mode
   and speed test as specimen plates with punched holes, mono tags, ink
   plate CTA, arrow.
5. **The tracks** (catalog-card grid, offset: 2-col + dashed wildcard tile):
   concept cards styled as collection cards with mono specimen ids.
6. **What a drill teaches you** (grouped chunks, divide-y, no cards): the
   Learn / Feedback / Runs-anywhere clusters in a single ledger column with
   margin annotations.
7. **Field observations** (roadmap as expedition log): Now / Next / Later as
   dated observations, hairline ruled, second eyebrow `WHAT NEXT` allowed.
8. **Free. Forever.** (centered editorial plate): serif manifesto + ink-plate
   CTA + a small stamp.
9. **Colophon footer** (hairline rule): wordmark, links, colophon line,
   "Made for learners. No ads, no tracking."

Layout families used: hairline bar, asymmetric split, ledger strip, 2 index
cards, catalog grid, grouped ledger column, expedition log, centered plate,
colophon footer. Nine sections, at least five distinct families, no two
adjacent sections share a family.

## Copy

- Zero em-dashes everywhere visible. Use hyphens, commas, colons.
- Hero subtext (16 words): "Real JavaScript and Python snippets as drills.
  Read the pattern, type it from memory, run it. Free forever."
- One CTA intent ("Start practicing") used in nav, hero, and CTA plate.
  Secondary intent ("Try a speed test") only in the hero.
- HeroDemo status copy stays em-dash-free and gains field-guide voice:
  hint reads "Type the specimen from memory", clean run stamps "CLEAN RUN".
- No fake-precise numbers. Stats come from real aggregates.
- No scroll cues, no locale strips, no version strings, no "trusted by"
  logo wall (no customers), no section-number eyebrows.

## Motion (MOTION_INTENSITY 4)

- Existing `sd-rise` retained for gentle reveals (storytelling/hierarchy).
- Stamp keyframe on clean run and on the Free plate (feedback): scale in
  with a settle wobble. `prefers-reduced-motion` disables all animation.
- Hover: ink plates lift 1px; active state presses down 1px.
- No infinite loops, no marquees, no scroll hijack.

## SEO and Preservation

- Route slugs unchanged: `/`, `/app`, `/speed`, `/practice`, `/progress`,
  `/settings`, `/signin`.
- Anchor ids `#tracks` and `#features` preserved so old links keep working.
- Metadata title and description unchanged.

## Scope

- **Phase A (this implementation):** retune 6 theme token sets in
  `globals.css`, swap fonts in `layout.tsx` (EB Garamond + Source Serif 4,
  keep Geist + JetBrains Mono), rewrite `src/app/page.tsx` as the field-guide
  landing, restyle `HeroDemo.tsx` as the specimen card, restyle
  `LandingStats.tsx` as the field record, squared `ModeToggle`/buttons,
  paper grain overlay in layout, stamp/margin-note/rule utilities in CSS.
- **Phase B (later):** restyle app chrome: `AppHeader`, practice/speed
  screens, settings `ThemePicker` copy, progress pages, scene panels to the
  same language. Tokens already apply automatically.

## Anti-Patterns Honored

No AI-purple, no centered hero, no three equal feature cards, no glassmorphism,
no pills, no em-dashes, no fake screenshots (the hero is a real interactive
component), no decorative dots, no Inter as default, no premium-consumer
beige+brass default (this is a dev tool; the cream is the field-guide stock,
justified by the vintage-manuscript identity).
