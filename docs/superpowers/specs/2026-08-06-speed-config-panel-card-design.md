# Speed test setup as a panel card

Date: 2026-08-06

## Problem

The Speed test setup screen (`SpeedConfigPanel` in `src/app/(app)/speed/SpeedScreen.tsx`)
renders its content left-aligned in the full-width page container (`max-w-[1440px]`),
so the title and options read as a thin left column while the `Start test` button
(`signal-cta w-full`) stretches across the entire page. The result is a layout
mismatch: tiny left-aligned controls under an oversized button.

## Goal

Present the setup as a single centered panel card that matches the app's existing
card language (the typing card, `rounded-lg border border-edge/70 bg-surface`), so
the controls read as a coherent block and the Start button spans only the card.

## Design

Rework only the `SpeedConfigPanel` component (lines 444-523 of `SpeedScreen.tsx`).
No other screens or styles change.

- Wrap the panel in a centered card:
  `mx-auto w-full max-w-xl rounded-lg border border-edge/70 bg-surface p-6 sm:p-8`.
  The existing vertical centering from the parent (`flex min-h-[calc(100vh-9rem)] flex-col justify-center`) is kept.
- Title block stays left-aligned inside the card: mono `signal-kicker` ("Speed test"),
  `font-display` `h1` ("Speed test"), and the muted description line, unchanged copy.
- Mode and target options become a 2-column grid on `sm+` screens (`grid-cols-1 gap-6 sm:grid-cols-2`),
  stacking on mobile. Each group keeps its existing mono uppercase label
  (`Mode` / `Seconds` or `Word count`) and the existing bordered option buttons —
  no new button styles.
- `Start test` keeps `signal-cta w-full`, but now fills the card width only.

## Out of scope

- The typing phase (`WordStream`, `ConfigBar`, stats ledger) and the result screen.
- Button styles, copy, keyboard shortcuts, or config logic.

## Verification

- `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Manual: config card is centered and card-styled; grid splits on wide screens,
  stacks on narrow; Start button fills the card, not the page.
