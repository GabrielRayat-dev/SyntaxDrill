# Accounts + Cloud Sync — Design

**Date:** 2026-08-01
**Status:** Approved
**App:** SyntaxDrill (Next.js 16.2.12 App Router, React 19, Tailwind v4, TypeScript)

## Summary

Add optional user accounts to SyntaxDrill: sign-in with GitHub or email +
password (with username), plus cloud sync of practice/speed records to Neon
Postgres. Signed-out users keep the existing localStorage-first behavior
unchanged. The app stays free with no ads.

## Goals / Non-goals

**Goals**
- Sign up / sign in via GitHub OAuth or email + password.
- One account = one history, accessible across devices after sync.
- Local-first experience preserved for signed-out users.
- Landing-page copy updated (no more "no accounts, ever" claims).

**Non-goals (deferred)**
- Email verification (no verification on sign-up; email addresses are unverified).
- Password reset / forgot-password email flow (needs an email provider, later).
- Magic links.
- Paywall / `free:false` gating.
- Leaderboards / social.
- Vercel deployment.

## Decisions (locked)

- **Auth library:** Auth.js (NextAuth) v5 beta + `@auth/drizzle-adapter`.
- **Session strategy:** JWT (required for Credentials provider; no server-side revocation needed).
- **Database:** Neon serverless Postgres via `@neondatabase/serverless`; Drizzle ORM + `drizzle-kit`.
- **Passwords:** bcrypt via `bcryptjs`.
- **Merge:** idempotent merge on every sign-in — all local records are POSTed,
  server upserts by record id (`onConflict` id, no-op on duplicates), then local
  store is cleared. No "first-sign-in" flag (avoids losing records created while
  signed out after an earlier sync).
- **Usernames:** required and unique at email/password sign-up (inline "taken"
  check). OAuth sign-up creates no username; the user is prompted to set one in
  Settings. Username is editable in Settings anytime.
- **OAuth providers:** GitHub only (Google dropped by user decision on 2026-08-01).
- **Verification:** none for email at sign-up.

## Data model (`src/db/schema.ts`, pushed to Neon)

Table names follow the Drizzle DrizzleAdapter conventions.

**`users`**
- `id` text uuid pk
- `username` text nullable, unique
- `name` text nullable
- `email` text nullable, unique
- `emailVerified` timestamp nullable
- `image` text nullable
- `passwordHash` text nullable
- `createdAt` timestamp default now

**`accounts`** (Auth.js adapter)
- `userId` fk → users
- `type`, `provider`, `providerAccountId`
- `refresh_token`, `access_token`, `expires_at`, `token_type`, `scope`,
  `id_token`, `session_state`
- pk (`provider`, `providerAccountId`)

**`sessions`** (Auth.js adapter; unused under JWT but required by adapter)
- `sessionToken` text pk
- `userId` fk → users
- `expires` timestamp

**`verificationTokens`** (Auth.js adapter)
- `identifier` text pk
- `token` text
- `expires` timestamp

**`records`**
- `id` text pk (client-generated UUID; matches existing `StatRecord.id`)
- `userId` fk → users
- `kind` text (`code` | `speed`) — denormalized for filtering
- `startedAt` timestamp — denormalized for sorting
- `data` jsonb — the full `StatRecord`
- Indexes: `(userId, startedAt)` and `(userId, kind)`

Aggregates (WPM, accuracy, streaks, mastered counts) are computed in TS from
`data`; `kind`/`startedAt` columns exist only for cheap filtering/sorting.

## Auth wiring

- `src/lib/auth.ts` — `NextAuth({ adapter, providers: [GitHub, Credentials], session: { strategy: "jwt" }, pages: { signIn: "/signin" }, callbacks })`.
  - `jwt`/`session` callbacks expose `user.id` and `user.username`.
  - Export `{ auth, signIn, signOut, handlers }` (Auth.js v5 style).
  - `trustHost: true` for dev.
- `src/app/api/auth/[...nextauth]/route.ts` — exports `handlers.GET` / `handlers.POST`.
- **SessionProvider** added to the root layout so client components can use `useSession`.
- Server components guard protected pages with `await auth()` and `redirect()`.
- **Sign-up action** (`registerUser`): validate inputs → check username + email
  uniqueness → bcrypt hash → insert `users` → `signIn("credentials")` to log in.
- **Credentials sign-in:** bcrypt verify against `users.passwordHash`.
- **OAuth:** `signIn("github", { redirectTo })`. Adapter auto-links by
  verified email.

## Pages & UI

Existing brand conventions: dark-first, code-green accent, `text-ink`/`text-muted`
tokens, `font-display`/`font-mono` where used.

- **`/signin`** — client page, two tabs: **Sign in** / **Create account**.
  - Create account: `username`, `email`, `password`, `confirm password`
    (min 8 chars, client match check, server-side validation, inline
    "username taken" / "email in use" errors).
  - Sign in: email/password form + "Continue with GitHub".
- **`/settings`** (protected) — profile (avatar, name, editable username with
  taken-check), password section (set / change / remove), connected providers
  (link/unlink GitHub; block unlinking the last sign-in method when no
  password is set), sign out.
- **`/progress`** (protected, Phase 3) — current/longest streak, hand-rolled SVG
  WPM/accuracy trend, per-concept mastered bars, speed-test bests, filterable
  history grouped by day.
- **`AppHeader.tsx`** — signed out: "Sign in" button → `/signin`. Signed in:
  avatar + username menu with Settings / Progress / Sign out.
- **Landing copy** (`src/app/page.tsx`) — update the "no accounts, no tracking,
  no ads — ever" badge and footer "No ads, no accounts." to reflect optional
  accounts (e.g. "Free forever · no ads", "Optional accounts sync your progress").

## Storage abstraction (Phase 2)

Replace direct `src/lib/storage/local.ts` usage with `src/lib/storage/store.ts`
keeping the same public API:

- `getRecords()`, `subscribeRecords()`, `addRecord(record)`, `clearRecords()`.
- Signed out → delegate to the existing localStorage implementation.
- Signed in → hydrate an in-memory snapshot from `GET /api/records`; `addRecord`
  → `POST /api/records` then update the snapshot; notify subscribers.
- On sign-in: read local records → `POST /api/records` (server upserts, dedup by
  id) → clear local store. Idempotent; nothing lost.

### API routes

- `GET /api/records` — returns the signed-in user's records.
- `POST /api/records` — accepts one record or a batch; upserts by id; guards on
  `session.user.id`.

## Env & setup

`.env.local`:
- `DATABASE_URL` — Neon **pooled** connection string (`-pooler` host).
- `AUTH_SECRET` — generated value.
- `AUTH_TRUST_HOST=true`
- `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`

User-supplied: Neon project + connection string; GitHub OAuth app (callback
`http://localhost:3000/api/auth/callback/github`).

## Risks

- **Next.js 16 compatibility** — this Next version has breaking changes (route
  handler signatures, possible middleware/proxy rename, async params). Read
  `node_modules/next/dist/docs/` before writing auth code; verify Auth.js v5 beta
  works with Next 16 early in Phase 0 before building on it.
- **Credentials + adapter** — Auth.js does not persist Credentials sessions to the
  DB; JWT strategy is mandatory. Confirmed acceptable.
- **OAuth without email** — GitHub/Google can return no verified email; `email`
  stays nullable and account linking by email won't apply.

## Verification

- Per phase: `npm run lint`, `npx tsc --noEmit`, `next build`.
- Manual: email/password sign-up, GitHub sign-in, username taken-check, password
  set/change/remove, record sync + merge on sign-in, sign-out reverts to
  localStorage, dashboard reads from remote when signed in.
- `drizzle-kit push` then inspect tables in Neon SQL editor.

## Build order & git

1. **Phase 0 — deps + DB:** install packages, `drizzle.config.ts`, schema, client,
   `.env.local`, `drizzle-kit push`, verify tables. Commit `chore: accounts phase 0 — deps + db schema`.
2. **Phase 1 — auth:** `src/lib/auth.ts`, nextauth route, SessionProvider,
   `/signin` (OAuth + email/password + create account), `/settings`, header
   account UI, landing copy. Commit `feat: account sign-in, sign-up and settings`.
3. **Phase 2 — sync:** `store.ts`, `/api/records`, merge on sign-in, swap call
   sites. Commit `feat: cloud record sync`.
4. **Phase 3 — progress:** `/progress` dashboard. Commit `feat: progress dashboard`.
5. **Phase 4 — verify:** tsc/lint/build green, sweep all "no accounts"/"no
   tracking" copy across landing + app pages so none contradict the feature.
   Commit `chore: verify accounts feature`.

Each phase is a separate commit; push after each.
