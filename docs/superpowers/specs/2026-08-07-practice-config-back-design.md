# Back button on the Practice config panel

Date: 2026-08-07

## Problem

The Practice configuration panel (`ConfigPanel` in
`src/app/(app)/practice/PracticeScreen.tsx`) is the screen shown at the top of a
Practice session where the user picks a language, concept, and difficulty before
starting a 10-snippet drill. It renders when the user lands on `/practice`
without difficulty params, and again when the user clicks the "Change" button
during an active session.

There is currently no way back out of this panel. If a user reaches it via
"Change" mid-session, the only path onward is to re-pick a config and press
"Start session", which builds a brand-new session and discards the in-progress
one.

## Goal

Add a back control above the "Drill session" header in the config panel whose
behavior depends on how the panel was reached:

- **Arrived via "Change" during an active session** — back resumes that session
  at the exact phase it left (read / type / result), preserving all progress.
- **Arrived at `/practice` directly with no session** — back links to `/app`
  (the tracks page).

## Behavior

1. **Track the resume point.** Add component state `resumePhase: Phase | null`.
   The "Change" button sets it before switching to the config phase:

   ```tsx
   onClick={() => { setResumePhase(phase); setPhase("config"); }}
   ```

   `startSession` resets `resumePhase` to `null` (a new session has nothing to
   resume).

2. **ConfigPanel props.** Add `onResume: (() => void) | null`. In the header
   block, above the "Drill session" kicker, render the back control using the
   same visual style as the existing "← Tracks" link
   (`text-xs font-medium text-muted hover:text-ink`):

   - `onResume` is set → `<button onClick={onResume}>← Back</button>`
   - `onResume` is `null` → `<Link href="/app">← Tracks</Link>`

3. **PracticeScreen wiring.** Pass:

   ```tsx
   onResume={
     config && resumePhase && resumePhase !== "config"
       ? () => { setPhase(resumePhase); setResumePhase(null); }
       : null
   }
   ```

## Verification

- Headless browser pass: tracks → difficulty → session → "Change" → "← Back"
  resumes the same snippet and phase with no progress loss.
- Direct `/practice` load shows the "← Tracks" link variant and navigates to
  `/app`.
- Existing gates pass: `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Out of scope

- The Summary screen already has its own "Back to tracks" button; no changes
  there.
- No changes to the session engine, storage, or routes.
