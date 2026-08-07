# Practice Config Back Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a back control above the "Drill session" header in the Practice config panel that resumes the in-progress session when reached via "Change", or links to `/app` tracks when no session is active.

**Architecture:** All changes live in `src/app/(app)/practice/PracticeScreen.tsx`. `PracticeScreen` gains a `resumePhase` state holding the phase captured when "Change" is pressed; `ConfigPanel` gains an `onResume` prop and renders a `<button>← Back</button>` when it is set, otherwise a `<Link href="/app">← Tracks</Link>`. Resuming restores the saved phase with zero state reset, so progress is preserved.

**Tech Stack:** Next.js 16.2.12 (App Router), React 19, TypeScript, Tailwind v4. No unit-test framework is configured; verification is via `npx tsc --noEmit`, `npm run lint`, `npm run build`, plus a headless Edge repro script.

## Global Constraints

- Follow existing styling: back control matches the "← Tracks" link classes `text-xs font-medium text-muted transition-colors hover:text-ink`.
- `"use client"` boundary: `PracticeScreen.tsx` is already a client component; no new files or server boundaries.
- Do not modify the session engine, storage, or routes.
- Commit convention: `feat(practice): ...` for the implementation.
- Workflow: implement in a worktree created via `using-git-worktrees`, fast-forward merge to `main`, remove worktree + branch; push only on explicit request.

---

### Task 1: Add resume-aware back control to the config panel

**Files:**
- Modify: `src/app/(app)/practice/PracticeScreen.tsx`

**Interfaces:**
- Consumes: existing `Phase` type (`"config" | "read" | "type" | "result" | "summary"`), existing `PracticeConfig` type, `Link` from `next/link` (already imported at line 4).
- Produces:
  - `PracticeScreen` state `resumePhase: Phase | null` (via `useState<Phase | null>(null)`).
  - `ConfigPanel` prop `onResume: (() => void) | null`.
  - `PracticeScreen` passes `onResume={...}` to `ConfigPanel`.

- [ ] **Step 1: Add `resumePhase` state**

In `PracticeScreen` (after the `phase` state declaration at line 67), add:

```tsx
const [resumePhase, setResumePhase] = useState<Phase | null>(null);
```

- [ ] **Step 2: Reset `resumePhase` in `startSession`**

In `startSession` (line 76), add `setResumePhase(null);` as the first line of the function body, so a brand-new session has nothing to resume:

```tsx
function startSession(cfg: PracticeConfig) {
  savedRef.current = false;
  setResumePhase(null);
  setConfig(cfg);
  ...
```

- [ ] **Step 3: Capture resume point in the "Change" button**

Replace the `onClick={() => setPhase("config")}` at line 227 with:

```tsx
<button
  onClick={() => {
    setResumePhase(phase);
    setPhase("config");
  }}
  className="shrink-0 text-xs font-medium text-muted transition-colors hover:text-ink"
>
  Change
</button>
```

- [ ] **Step 4: Extend `ConfigPanel` props and render the back control**

Change the `ConfigPanel` function signature (line 448) from:

```tsx
function ConfigPanel({ onPick }: { onPick: (config: PracticeConfig) => void }) {
```

to:

```tsx
function ConfigPanel({
  onPick,
  onResume,
}: {
  onPick: (config: PracticeConfig) => void;
  onResume: (() => void) | null;
}) {
```

Inside the header block, above the `<p className="signal-kicker mb-3">Drill session</p>` line (line 459), insert the back control:

```tsx
{onResume ? (
  <button
    onClick={onResume}
    className="mb-4 text-xs font-medium text-muted transition-colors hover:text-ink"
  >
    ← Back
  </button>
) : (
  <Link
    href="/app"
    className="mb-4 inline-block text-xs font-medium text-muted transition-colors hover:text-ink"
  >
    ← Tracks
  </Link>
)}
```

Note: `Link` is already imported at line 4 of `PracticeScreen.tsx`.

- [ ] **Step 5: Wire `onResume` in the `ConfigPanel` usage**

Replace line 198 `{phase === "config" && <ConfigPanel onPick={startSession} />}` with:

```tsx
{phase === "config" && (
  <ConfigPanel
    onPick={startSession}
    onResume={
      config && resumePhase && resumePhase !== "config"
        ? () => {
            setPhase(resumePhase);
            setResumePhase(null);
          }
        : null
    }
  />
)}
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

- [ ] **Step 7: Lint**

Run: `npm run lint`
Expected: ESLint exits clean with no errors.

- [ ] **Step 8: Production build**

Run: `npm run build`
Expected: compiles successfully; the only warning is the known non-blocking `turbopack.root` multiple-lockfile warning. `f/practice` route remains dynamic.

- [ ] **Step 9: Headless behavioral verification**

Start the dev server (`npm run dev`), then run this repro script (save as `repro-back.js` in `C:\Users\gabri\AppData\Local\Temp\opencode` where `playwright-core` is installed — `npm i --no-save playwright-core` once there if missing):

```js
const { chromium } = require("playwright-core");
const EXE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`CONSOLE: ${m.text().slice(0, 300)}`); });
  page.on("response", (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`); });

  // Scenario A: tracks -> difficulty -> session -> Change -> Back resumes
  await page.goto("http://localhost:3000/app", { waitUntil: "networkidle" });
  await page.locator("a[href*='/practice?']").first().click();
  await page.waitForTimeout(3000);
  const beforeTitle = await page.locator("h1").innerText();
  const beforeProgress = await page.getByText(/SNIPPET \d+ \//).first().innerText().catch(() => "none");
  await page.getByRole("button", { name: "Change" }).click();
  await page.waitForTimeout(800);
  const backButton = page.getByRole("button", { name: "← Back" });
  const backCount = await backButton.count();
  await backButton.click();
  await page.waitForTimeout(1500);
  const afterTitle = await page.locator("h1").innerText();
  console.log("A: back button present:", backCount === 1);
  console.log("A: resumed title matches:", beforeTitle === afterTitle);
  console.log("A: resumed progress:", await page.getByText(/SNIPPET \d+ \//).first().innerText().catch(() => "none"), "before:", beforeProgress);

  // Scenario B: direct /practice (no session) -> shows tracks link
  await page.goto("http://localhost:3000/practice", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const tracksLink = page.getByRole("link", { name: "← Tracks" });
  console.log("B: tracks link present:", await tracksLink.count() === 1);
  await tracksLink.click();
  await page.waitForTimeout(1500);
  console.log("B: lands on /app:", page.url().endsWith("/app"));

  console.log("errors:", JSON.stringify(errors));
  await browser.close();
})();
```

Run: `node repro-back.js` (from `C:\Users\gabri\AppData\Local\Temp\opencode`)
Expected: `A: back button present: true`, `A: resumed title matches: true`, `A: resumed progress` equals `before:` value, `B: tracks link present: true`, `B: lands on /app: true`, `errors: []`.

- [ ] **Step 10: Commit**

```bash
git add src/app/(app)/practice/PracticeScreen.tsx
git commit -m "feat(practice): add back control to config panel that resumes the session"
```

---

## Self-Review Notes

- **Spec coverage:** resume-on-Change (Task 1 Steps 1, 3, 5, 9), tracks link on direct load (Steps 4, 5, 9), `startSession` reset (Step 2), out-of-scope Summary untouched (no edits there). All spec behaviors mapped.
- **Placeholder scan:** every step contains concrete code or an exact command; no TBD/TODO.
- **Type consistency:** `resumePhase: Phase | null` used identically in state declaration, `startSession`, the Change handler, and the `onResume` guard. `onResume: (() => void) | null` used identically in `ConfigPanel` props and the usage site.
