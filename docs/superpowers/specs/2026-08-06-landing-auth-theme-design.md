# Landing follows the selected theme when logged in

Date: 2026-08-06

## Problem

The landing page always renders in the default Signal theme because its wrapper
pins `data-theme="signal"` (`src/app/page.tsx:59`), overriding the theme the
user selected in Settings for everything inside the page. A logged-in user who
picks a different colorway or light mode sees the landing ignore that choice,
while the app pages (which inherit the `<html data-theme>` set from
localStorage) re-theme correctly.

## Goal

- Logged in: the landing page follows the theme selected on this device.
- Logged out: the landing page always uses the default theme (Signal).

Theme selection stays device-local (localStorage `sd.theme`). No database or
schema changes.

## Design

### 1. Theme gating — `src/app/page.tsx`

Make `LandingPage` an async server component that reads the session with
`auth()` (next-auth v5 JWT, same call used by `signin/page.tsx` and
`settings/page.tsx`). The wrapper's pin becomes conditional:

```tsx
const session = await auth();

<div className="signal-page min-h-[100dvh] overflow-clip"
     data-theme={session?.user ? undefined : "signal"}>
```

- Logged in: no pin, so the landing inherits the `<html data-theme>` set
  pre-paint from localStorage (`src/app/layout.tsx:42-44`). A fresh device with
  no stored theme falls back to the default Signal.
- Logged out: pin to `signal`, unchanged from today — the default theme even if
  localStorage holds an older selection.

Because the attribute is decided server-side before first paint, there is no
theme flash and no hydration mismatch.

### 2. Theme-aware sections — `src/app/globals.css`

Four hardcoded landing colors are converted to theme variables so the whole
page re-themes. In the default Signal theme the resulting colors are
near-identical to today.

| Selector | Before | After |
| --- | --- | --- |
| `.signal-tracks` (line 253) | `background: #0d1017` | `var(--sd-surface)` |
| `.signal-final-cta` (line 256) | gradient `rgb(143 166 255 / 0.15)` + `#10141d` | `color-mix(in srgb, var(--sd-accent) 15%, transparent)` + `var(--sd-surface)` |
| `.signal-hero` (line 227) | `rgb(64 85 146 / 0.20)` | `color-mix(in srgb, var(--sd-accent) 20%, transparent)` |
| `.signal-orbit` (line 228) | `rgb(143 166 255 / 0.16)` | `color-mix(in srgb, var(--sd-accent) 16%, transparent)` |

## Out of scope

- The sign-in page stays pinned to Signal — it is only visible to logged-out
  users, who should see the default theme.
- App pages already follow the `<html>` theme; no change.
- ThemeProvider, localStorage key, and the pre-paint script are unchanged.
- No per-account (database) theme persistence.

## Verification

- `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Manual: logged in with a non-default or light theme → landing is re-themed;
  logged out → landing is Signal even when a theme is stored on the device.
