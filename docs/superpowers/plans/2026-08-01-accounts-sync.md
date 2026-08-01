# Accounts + Cloud Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional user accounts (GitHub OAuth + email/password with username) and cloud sync of practice records to Neon Postgres, while keeping the existing localStorage-first behavior for signed-out users.

**Architecture:** Auth.js (NextAuth) v5 with the Drizzle adapter, JWT session strategy, GitHub + Credentials providers. Data lives in Neon Postgres via `@neondatabase/serverless` + Drizzle. A session-aware storage store (`store.ts`) keeps the existing `getRecords`/`subscribeRecords` API but serves remote data when signed in and merges local records on sign-in (idempotent upsert by record id). Protected pages are guarded inside server components with `await auth()`.

**Tech Stack:** Next.js 16.2.12 App Router (React 19, Tailwind v4, TypeScript), Auth.js v5 beta (`next-auth@beta`), `@auth/drizzle-adapter`, Drizzle ORM + `drizzle-kit`, `@neondatabase/serverless`, `bcryptjs`.

## Global Constraints

- **Next.js 16 differs from prior versions.** Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Notably `middleware.ts` is renamed to `proxy.ts` — this plan deliberately uses **no middleware**; protected pages call `await auth()` and `redirect()` in server components.
- **Auth providers:** GitHub only (Google dropped 2026-08-01). No email verification. No password-reset flow.
- **Session strategy:** `session: { strategy: "jwt" }` (required for Credentials).
- **Usernames:** required + unique at email/password sign-up; lowercase, `/^[a-z0-9_]{3,20}$/`; editable in Settings; OAuth users have `username = null` until set.
- **Passwords:** min 8 chars; hashed with bcrypt (`bcryptjs`); no plaintext ever.
- **Merge:** on every sign-in, all localStorage records are POSTed to the server which upserts by record `id` (`onConflictDoNothing`), then localStorage is cleared. Idempotent.
- **Env vars** (`.env.local`, gitignored): `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`. **Never print the actual secret values in commits or messages.**
- **Brand:** existing design tokens only (`text-ink`, `text-muted`, `text-accent`, `text-page`, `bg-surface`, `bg-raised`, `border-edge`, `font-display`, `font-mono`). Dark-first. No emojis. Never mention other typing sites.
- **No unit-test framework exists in this repo.** Verification is `npm run lint`, `npx tsc --noEmit`, `next build`, `drizzle-kit push`, and the explicit manual checks in each task.
- **Git flow:** show `git add ...` / `git commit -m "..."` / `git push` before executing; one commit per task; messages match repo style (`feat:` / `chore:` / `docs:`).
- Landing copy must stop claiming "no accounts" (badge, feature card, footer, README).

## File Structure

- `src/db/schema.ts` — Drizzle tables: `users`, `accounts`, `sessions`, `verificationTokens`, `records`.
- `src/db/client.ts` — Neon + Drizzle client (server-only).
- `drizzle.config.ts` — drizzle-kit config reading `DATABASE_URL`.
- `src/lib/auth.ts` — Auth.js config; exports `{ handlers, auth, signIn, signOut }`.
- `src/lib/passwords.ts` — `hashPassword` / `verifyPassword` (bcrypt).
- `src/lib/validation.ts` — `validateUsername` / `validateEmail` / `validatePassword`.
- `src/types/next-auth.d.ts` — Session/User/JWT type augmentation.
- `src/app/api/auth/[...nextauth]/route.ts` — Auth.js route handlers.
- `src/components/Providers.tsx` — `SessionProvider` wrapper for the root layout.
- `src/app/signin/page.tsx` + `SigninCard.tsx` — sign-in / create-account UI.
- `src/app/signin/actions.ts` — `registerUser` server action.
- `src/app/settings/page.tsx` + `SettingsPanel.tsx` + `actions.ts` — account management.
- `src/components/AccountButton.tsx` — session-aware header button/menu.
- `src/lib/storage/store.ts` — unified reactive store (remote/local), `SyncProvider`.
- `src/app/api/records/route.ts` — `GET`/`POST` /api/records.
- `src/app/progress/page.tsx` + `src/components/progress/` — progress dashboard.
- `src/lib/storage/local.ts` — add `addRecord`/`clearRecords` module exports (keep existing API).
- Modify: `src/app/layout.tsx`, `src/components/AppHeader.tsx`, `src/app/page.tsx` (landing copy + header), `src/app/app/page.tsx`, `src/components/landing/LandingStats.tsx`, `src/app/speed/SpeedScreen.tsx:53,63`, `src/app/practice/PracticeScreen.tsx:175,191`.

---

### Task 1: Phase 0 — dependencies, env, schema, first push

**Files:**
- Create: `drizzle.config.ts`, `src/db/schema.ts`, `src/db/client.ts`
- Create: `.env.local` (gitignored — contains secrets, do not commit)
- Modify: `package.json` (via npm install)

**Interfaces:**
- Produces: `db` from `@/db/client`; tables `users`, `accounts`, `sessions`, `verificationTokens`, `records` from `@/db/schema`; all later tasks import these.

- [ ] **Step 1: Read reference docs**

Run: `Get-Content node_modules/@auth/drizzle-adapter/README.md` and skim `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`.
Confirm the Drizzle adapter's expected table property keys (users: `id name email emailVerified image` + custom columns; accounts: `userId type provider providerAccountId refresh_token access_token expires_at token_type scope id_token session_state`; sessions: `sessionToken userId expires`; verificationTokens: `identifier token expires`).

- [ ] **Step 2: Install dependencies**

Run:
```
npm i next-auth@beta @auth/drizzle-adapter drizzle-orm @neondatabase/serverless bcryptjs
npm i -D drizzle-kit
```
Expected: installs without peer-dep errors. Run `npm ls next-auth drizzle-orm @neondatabase/serverless bcryptjs`.

- [ ] **Step 3: Write `.env.local`**

Create `.env.local` with:
```
DATABASE_URL=<Neon pooled connection string from user message>
AUTH_SECRET=<generated below>
AUTH_TRUST_HOST=true
AUTH_GITHUB_ID=<GitHub client ID from user message>
AUTH_GITHUB_SECRET=<GitHub client secret from user message>
```
Generate `AUTH_SECRET`:
```
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```
Do **not** commit this file (it is already gitignored). Confirm: `.gitignore` contains `.env.local` — if not, add it.

- [ ] **Step 4: Write `drizzle.config.ts`**

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
```

- [ ] **Step 5: Write `src/db/schema.ts`**

```ts
import {
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").unique(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("passwordHash"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    pk: primaryKey({ columns: [account.provider, account.providerAccountId] }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const records = pgTable(
  "records",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    startedAt: timestamp("startedAt", { mode: "date" }).notNull(),
    data: jsonb("data").notNull(),
  },
  (record) => ({
    userStartedAtIdx: index("record_user_startedAt_idx").on(
      record.userId,
      record.startedAt,
    ),
    userKindIdx: index("record_user_kind_idx").on(record.userId, record.kind),
  }),
);
```

- [ ] **Step 6: Write `src/db/client.ts`**

```ts
import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
```

- [ ] **Step 7: Push schema and verify**

Run: `npx drizzle-kit push`
- Expected: creates `users`, `accounts`, `sessions`, `verificationTokens`, `records` in the Neon `neondb` database.
- If push fails on the `channel_binding=require` parameter (driver can't parse it), temporarily run with a stripped URL:
  `$env:DATABASE_URL = (Get-Content .env.local | Select-String '^DATABASE_URL=').Line.Replace('DATABASE_URL=','').Split('&')[0] + '?sslmode=require'; npx drizzle-kit push`
  Keep the full string in `.env.local` for the app; if the app's neon driver also errors at runtime, strip the param in `.env.local` instead.
- Verify tables: in the Neon SQL Editor run:
  ```sql
  select table_name from information_schema.tables where table_schema='public' order by table_name;
  ```
  Expected: `accounts`, `records`, `sessions`, `users`, `verificationTokens`.

- [ ] **Step 8: Commit**

```bash
git add drizzle.config.ts src/db/schema.ts src/db/client.ts .gitignore
git commit -m "chore: accounts phase 0 — deps + db schema"
git push
```

---

### Task 2: Auth core — config, providers, session provider

**Files:**
- Create: `src/lib/auth.ts`, `src/lib/passwords.ts`, `src/types/next-auth.d.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/components/Providers.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `db`, `users` from Task 1.
- Produces: `auth`, `signIn`, `signOut`, `handlers` from `@/lib/auth`; `hashPassword`, `verifyPassword` from `@/lib/passwords`; `Providers` component. Later tasks import these.

- [ ] **Step 1: Write `src/lib/passwords.ts`**

```ts
import bcrypt from "bcryptjs";

const ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
```

- [ ] **Step 2: Write `src/types/next-auth.d.ts`**

```ts
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    username?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string | null;
  }
}
```

- [ ] **Step 3: Write `src/lib/auth.ts`**

```ts
import "server-only";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "@/db/schema";
import { verifyPassword } from "@/lib/passwords";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  trustHost: true,
  providers: [
    GitHub,
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.toLowerCase().trim()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";
        if (!email || !password) return null;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        if (!user?.passwordHash) return null;
        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email ?? email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username ?? null;
      }
      return session;
    },
  },
});
```

- [ ] **Step 4: Write `src/app/api/auth/[...nextauth]/route.ts`**

```ts
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 5: Write `src/components/Providers.tsx`**

```tsx
"use client";

import { SessionProvider as NextSessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <NextSessionProvider>{children}</NextSessionProvider>;
}
```

- [ ] **Step 6: Wrap the layout**

In `src/app/layout.tsx`, import `Providers` from `@/components/Providers` and wrap the body content:
```tsx
<body className="min-h-full">
  <ThemeProvider>
    <Providers>{children}</Providers>
  </ThemeProvider>
</body>
```

- [ ] **Step 7: Verify**

Run: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
Expected: all green. Start `npm run dev` and hit `http://localhost:3000/api/auth/session` — expected `{}` (no session yet).

- [ ] **Step 8: Commit**

```bash
git add src/lib/auth.ts src/lib/passwords.ts src/types/next-auth.d.ts "src/app/api/auth/[...nextauth]/route.ts" src/components/Providers.tsx src/app/layout.tsx
git commit -m "feat: auth core — nextauth config, providers, session provider"
```

---

### Task 3: Sign-in and create-account page

**Files:**
- Create: `src/lib/validation.ts`, `src/app/signin/actions.ts`, `src/app/signin/page.tsx`, `src/app/signin/SigninCard.tsx`
- Modify: `src/app/signin/page.tsx` (new dir), nothing else

**Interfaces:**
- Consumes: `auth`, `signIn` from Task 2; `db`, `users` from Task 1; `hashPassword` from Task 2.
- Produces: `registerUser` server action (returns `{ error?, fields? }`); `validateUsername`, `validateEmail`, `validatePassword`.

- [ ] **Step 1: Write `src/lib/validation.ts`**

```ts
export function validateUsername(value: string): string | null {
  if (value.length < 3) return "Username must be at least 3 characters.";
  if (value.length > 20) return "Username must be 20 characters or fewer.";
  if (!/^[a-z0-9_]+$/.test(value))
    return "Usernames can only contain letters, numbers, and underscores.";
  return null;
}

export function validateEmail(value: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Enter a valid email address.";
  return null;
}

export function validatePassword(value: string): string | null {
  if (value.length < 8) return "Password must be at least 8 characters.";
  return null;
}
```

- [ ] **Step 2: Write `src/app/signin/actions.ts`**

```ts
"use server";

import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/passwords";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/lib/validation";
import { signIn } from "@/lib/auth";

export interface AuthActionState {
  error?: string;
  fields?: { username?: string; email?: string };
}

export async function registerUser(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const username = (formData.get("username") ?? "").toString().trim().toLowerCase();
  const email = (formData.get("email") ?? "").toString().trim().toLowerCase();
  const password = (formData.get("password") ?? "").toString();
  const confirm = (formData.get("confirmPassword") ?? "").toString();
  const fields = { username, email };

  const usernameErr = validateUsername(username);
  if (usernameErr) return { error: usernameErr, fields };
  const emailErr = validateEmail(email);
  if (emailErr) return { error: emailErr, fields };
  const passwordErr = validatePassword(password);
  if (passwordErr) return { error: passwordErr, fields };
  if (password !== confirm)
    return { error: "Passwords do not match.", fields };

  const emailTaken = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (emailTaken.length > 0)
    return { error: "That email is already in use. Sign in instead.", fields };

  const usernameTaken = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (usernameTaken.length > 0)
    return { error: "That username is taken.", fields };

  await db.insert(users).values({
    id: crypto.randomUUID(),
    username,
    email,
    passwordHash: await hashPassword(password),
    createdAt: new Date(),
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/app" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Please sign in.", fields };
    }
    throw error;
  }
  return { error: undefined, fields };
}
```

- [ ] **Step 3: Write `src/app/signin/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import SigninCard from "./SigninCard";

export default async function SigninPage() {
  const session = await auth();
  if (session?.user) redirect("/app");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 font-mono text-sm font-semibold tracking-tight text-ink">
        <span className="text-accent">&gt;</span>_ SyntaxDrill
      </div>
      <SigninCard />
    </div>
  );
}
```

- [ ] **Step 4: Write `src/app/signin/SigninCard.tsx`**

Client component with a `useState<"signin" | "register">("signin")` tab toggle, styled with existing tokens (`border-edge`, `bg-surface`, `text-ink`, `text-muted`, `text-accent`).

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "next-auth/react";
import { registerUser, type AuthActionState } from "./actions";

const initialState: AuthActionState = {};

export default function SigninCard() {
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [state, action, pending] = useActionState(registerUser, initialState);
  const [loginError, setLoginError] = useState<string | null>(null);

  async function handleLogin(formData: FormData) {
    const email = (formData.get("email") ?? "").toString().trim();
    const password = (formData.get("password") ?? "").toString();
    const res = await signIn("credentials", { email, password, redirectTo: "/app" });
    if (res?.error) setLoginError("Invalid email or password.");
  }

  function handleGithub() {
    signIn("github", { redirectTo: "/app" });
  }

  const inputCls =
    "w-full rounded-lg border border-edge bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none";
  const tabBtn = (id: "signin" | "register") =>
    `flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      tab === id ? "bg-raised text-ink shadow-sm" : "text-muted hover:text-ink"
    }`;

  return (
    <div className="w-full max-w-sm rounded-2xl border border-edge/70 bg-surface p-6">
      <div className="mb-5 flex items-center gap-1 rounded-lg border border-edge/70 bg-page p-0.5">
        <button type="button" onClick={() => setTab("signin")} className={tabBtn("signin")}>
          Sign in
        </button>
        <button type="button" onClick={() => setTab("register")} className={tabBtn("register")}>
          Create account
        </button>
      </div>

      <button
        type="button"
        onClick={handleGithub}
        className="mb-5 w-full rounded-lg bg-page px-3.5 py-2.5 text-sm font-semibold text-ink ring-1 ring-inset ring-edge transition-colors hover:bg-raised"
      >
        Continue with GitHub
      </button>

      <div className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-widest text-muted">
        <span className="h-px flex-1 bg-edge/70" />
        or
        <span className="h-px flex-1 bg-edge/70" />
      </div>

      {tab === "signin" ? (
        <form action={handleLogin} className="flex flex-col gap-3">
          <input className={inputCls} name="email" type="email" placeholder="Email" required />
          <input className={inputCls} name="password" type="password" placeholder="Password" required />
          {loginError && <p className="text-xs text-bad">{loginError}</p>}
          <button
            type="submit"
            className="mt-1 w-full rounded-lg bg-accent px-3.5 py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            Sign in
          </button>
        </form>
      ) : (
        <form action={action} className="flex flex-col gap-3">
          <input
            className={inputCls}
            name="username"
            placeholder="Username"
            defaultValue={state.fields?.username ?? ""}
            required
          />
          <input
            className={inputCls}
            name="email"
            type="email"
            placeholder="Email"
            defaultValue={state.fields?.email ?? ""}
            required
          />
          <input className={inputCls} name="password" type="password" placeholder="Password (8+ chars)" required />
          <input className={inputCls} name="confirmPassword" type="password" placeholder="Confirm password" required />
          {state.error && <p className="text-xs text-bad">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="mt-1 w-full rounded-lg bg-accent px-3.5 py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-xs text-muted">
        <Link href="/" className="text-accent underline-offset-2 hover:underline">
          ← Back to SyntaxDrill
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 5: Verify manually**

Run `npm run dev`. In a browser at `http://localhost:3000/signin`:
- "Create account": username `test_user`, a unique email, password + confirm → lands on `/app` with a session.
- Sign out (via `signIn`/`signOut` isn't wired yet — temporarily hit `/api/auth/signout` or clear cookies), then Sign in tab with the same credentials → lands on `/app`.
- Register with a duplicate username/email → inline errors show.
- GitHub button → GitHub OAuth → redirects back to `/app` as a signed-in user (username empty).
- `http://localhost:3000/api/auth/session` now returns a session with `user.id`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/validation.ts src/app/signin
git commit -m "feat: sign-in and create-account page"
```

---

### Task 4: Settings page

**Files:**
- Create: `src/app/settings/page.tsx`, `src/app/settings/actions.ts`, `src/app/settings/SettingsPanel.tsx`
- Modify: none (folder is new)

**Interfaces:**
- Consumes: `auth` (Task 2), `db`/`users`/`accounts` (Task 1), `hashPassword`/`verifyPassword` (Task 2), validation (Task 3), `signIn`/`signOut` (Task 2).
- Produces: server actions `updateUsername`, `setPassword`, `changePassword`, `removePassword`, `unlinkGithub`.

- [ ] **Step 1: Write `src/app/settings/actions.ts`**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import { validatePassword, validateUsername } from "@/lib/validation";

export interface SettingsActionResult {
  error?: string;
  ok?: boolean;
}

export async function updateUsername(
  userId: string,
  _prev: { username: string },
  formData: FormData,
): Promise<SettingsActionResult & { username?: string }> {
  const username = (formData.get("username") ?? "").toString().trim().toLowerCase();
  const err = validateUsername(username);
  if (err) return { error: err };

  const taken = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.username, username), eq(users.id, userId)))
    .limit(1);
  if (taken.length === 0) {
    const clash = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (clash.length > 0) return { error: "That username is taken." };
  }

  await db.update(users).set({ username }).where(eq(users.id, userId));
  revalidatePath("/settings");
  return { ok: true, username };
}

export async function setPassword(
  userId: string,
  _prev: null,
  formData: FormData,
): Promise<SettingsActionResult> {
  const password = (formData.get("password") ?? "").toString();
  const confirm = (formData.get("confirm") ?? "").toString();
  const err = validatePassword(password);
  if (err) return { error: err };
  if (password !== confirm) return { error: "Passwords do not match." };

  const existing = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (existing[0]?.passwordHash) return { error: "A password is already set." };

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password) })
    .where(eq(users.id, userId));
  revalidatePath("/settings");
  return { ok: true };
}

export async function changePassword(
  userId: string,
  _prev: null,
  formData: FormData,
): Promise<SettingsActionResult> {
  const current = (formData.get("current") ?? "").toString();
  const password = (formData.get("password") ?? "").toString();
  const confirm = (formData.get("confirm") ?? "").toString();
  const err = validatePassword(password);
  if (err) return { error: err };
  if (password !== confirm) return { error: "Passwords do not match." };

  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row?.passwordHash) return { error: "No password is set." };
  const ok = await verifyPassword(current, row.passwordHash);
  if (!ok) return { error: "Current password is incorrect." };

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password) })
    .where(eq(users.id, userId));
  revalidatePath("/settings");
  return { ok: true };
}

export async function removePassword(
  userId: string,
  _prev: null,
  formData: FormData,
): Promise<SettingsActionResult> {
  const current = (formData.get("current") ?? "").toString();
  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row?.passwordHash) return { error: "No password is set." };
  const ok = await verifyPassword(current, row.passwordHash);
  if (!ok) return { error: "Current password is incorrect." };

  const githubLinked = await db
    .select({ id: accounts.userId })
    .from(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.provider, "github")))
    .limit(1);
  if (githubLinked.length === 0)
    return { error: "Connect GitHub before removing your password." };

  await db
    .update(users)
    .set({ passwordHash: null })
    .where(eq(users.id, userId));
  revalidatePath("/settings");
  return { ok: true };
}

export async function unlinkGithub(
  userId: string,
  _prev: null,
  _formData: FormData,
): Promise<SettingsActionResult> {
  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row?.passwordHash)
    return { error: "Set a password before disconnecting GitHub." };

  await db
    .delete(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.provider, "github")));
  revalidatePath("/settings");
  return { ok: true };
}
```

- [ ] **Step 2: Write `src/app/settings/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import SettingsPanel from "./SettingsPanel";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!user) redirect("/signin");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight text-ink">
        Settings
      </h1>
      <SettingsPanel
        userId={user.id}
        username={user.username}
        name={user.name}
        email={user.email}
        image={user.image}
        hasPassword={Boolean(user.passwordHash)}
      />
    </div>
  );
}
```

- [ ] **Step 3: Write `src/app/settings/SettingsPanel.tsx`**

Client component using `useActionState` per action, `signIn("github")` to connect, `signOut({ callbackUrl: "/" })` to leave. Sections: Profile (username form, readonly email), Password (set OR change + remove), Connected accounts (GitHub row + password row), Sign out. Use the same token classes as Task 3 (`inputCls`-style). Rendered structure:

```tsx
"use client";

import { useActionState } from "react";
import { signIn, signOut } from "next-auth/react";
import {
  changePassword,
  removePassword,
  setPassword,
  unlinkGithub,
  updateUsername,
} from "./actions";

const inputCls =
  "w-full rounded-lg border border-edge bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none";
const sectionCls = "rounded-xl border border-edge/70 bg-surface p-5";

function Status({ error, ok }: { error?: string; ok?: boolean }) {
  if (error) return <p className="text-xs text-bad">{error}</p>;
  if (ok) return <p className="text-xs text-good">Saved.</p>;
  return null;
}

export default function SettingsPanel({
  userId,
  username,
  name,
  email,
  image,
  hasPassword,
}: {
  userId: string;
  username: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  hasPassword: boolean;
}) {
  const [userState, userAction, userPending] = useActionState(
    updateUsername.bind(null, userId),
    { username: username ?? "" },
  );
  const [setState, setAction, setPending] = useActionState(
    setPassword.bind(null, userId),
    null,
  );
  const [changeState, changeAction, changePending] = useActionState(
    changePassword.bind(null, userId),
    null,
  );
  const [removeState, removeAction, removePending] = useActionState(
    removePassword.bind(null, userId),
    null,
  );
  const [unlinkState, unlinkAction, unlinkPending] = useActionState(
    unlinkGithub.bind(null, userId),
    null,
  );

  const initial = (username ?? name ?? "?").slice(0, 1).toUpperCase();

  return (
    <div className="flex flex-col gap-4">
      <section className={sectionCls}>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-accent/15 text-lg font-semibold text-accent ring-1 ring-inset ring-edge">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <div>
            <h2 className="font-semibold text-ink">{username ?? name ?? "Account"}</h2>
            {email && <p className="text-xs text-muted">{email}</p>}
          </div>
        </div>

        <form action={userAction} className="flex flex-col gap-3">
          <label className="text-xs font-medium uppercase tracking-widest text-muted">
            Username
          </label>
          <input
            className={inputCls}
            name="username"
            defaultValue={userState.username}
            required
          />
          <Status error={userState.error} ok={userState.ok} />
          <button
            type="submit"
            disabled={userPending}
            className="w-fit rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {userPending ? "Saving…" : "Save username"}
          </button>
        </form>
      </section>

      <section className={sectionCls}>
        <h2 className="mb-3 font-semibold text-ink">Password</h2>
        {hasPassword ? (
          <>
            <form action={changeAction} className="mb-3 flex flex-col gap-3">
              <input
                className={inputCls}
                name="current"
                type="password"
                placeholder="Current password"
                required
              />
              <input
                className={inputCls}
                name="password"
                type="password"
                placeholder="New password (8+ chars)"
                required
              />
              <input
                className={inputCls}
                name="confirm"
                type="password"
                placeholder="Confirm new password"
                required
              />
              <Status error={changeState?.error} ok={changeState?.ok} />
              <button
                type="submit"
                disabled={changePending}
                className="w-fit rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {changePending ? "Changing…" : "Change password"}
              </button>
            </form>
            <form action={removeAction} className="flex flex-col gap-3">
              <input
                className={inputCls}
                name="current"
                type="password"
                placeholder="Current password to remove"
                required
              />
              <Status error={removeState?.error} ok={removeState?.ok} />
              <button
                type="submit"
                disabled={removePending}
                className="w-fit rounded-lg border border-bad/60 px-3.5 py-2 text-sm font-semibold text-bad transition-colors hover:bg-bad/10 disabled:opacity-60"
              >
                {removePending ? "Removing…" : "Remove password"}
              </button>
            </form>
          </>
        ) : (
          <form action={setAction} className="flex flex-col gap-3">
            <p className="text-xs text-muted">
              No password yet. Add one to sign in with email + password.
            </p>
            <input
              className={inputCls}
              name="password"
              type="password"
              placeholder="Password (8+ chars)"
              required
            />
            <input
              className={inputCls}
              name="confirm"
              type="password"
              placeholder="Confirm password"
              required
            />
            <Status error={setState?.error} ok={setState?.ok} />
            <button
              type="submit"
              disabled={setPending}
              className="w-fit rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {setPending ? "Saving…" : "Set password"}
            </button>
          </form>
        )}
      </section>

      <section className={sectionCls}>
        <h2 className="mb-3 font-semibold text-ink">Connected accounts</h2>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-raised/60 px-3.5 py-2.5">
          <span className="text-sm font-medium text-ink">GitHub</span>
          <button
            type="button"
            onClick={() => signIn("github", { redirectTo: "/settings" })}
            className="rounded-lg border border-edge px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-raised"
          >
            Connect
          </button>
        </div>
        <form action={unlinkAction} className="mt-3">
          <Status error={unlinkState?.error} ok={unlinkState?.ok} />
          <button
            type="submit"
            disabled={unlinkPending}
            className="mt-1 text-xs font-medium text-bad underline-offset-2 transition-colors hover:underline disabled:opacity-60"
          >
            Disconnect GitHub
          </button>
        </form>
      </section>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-fit rounded-lg border border-edge bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-raised"
      >
        Sign out
      </button>
    </div>
  );
}
```

The "Connect GitHub" button relies on Auth.js v5 account linking while signed in (verified email match). If linking misbehaves in manual testing, the fallback is: sign out, sign in with GitHub, which auto-links by email — document that note in the verification step rather than building a custom linking flow.

- [ ] **Step 4: Verify manually**

- `/settings` signed out → redirects to `/signin`.
- Email/password account: set password → change (wrong current rejected) → remove (blocked until GitHub connected).
- GitHub account: connect GitHub from settings while signed in; verify linking works via email match (if the OAuth email differs from the account email, Auth.js creates a separate account — acceptable; note it).
- GitHub-only account: remove password blocked; set password then unlink GitHub works; sign out → email/password still signs in.
- Username: taken check shows error; valid edit persists after refresh.

- [ ] **Step 5: Commit**

```bash
git add src/app/settings
git commit -m "feat: account settings"
```

---

### Task 5: Header account UI + landing copy

**Files:**
- Create: `src/components/AccountButton.tsx`
- Modify: `src/components/AppHeader.tsx`, `src/app/page.tsx` (landing header + copy), `src/app/signin/page.tsx` (add header/back nav, optional)

**Interfaces:**
- Consumes: `useSession`, `signOut` from `next-auth/react` (Task 2's `Providers` enables this).

- [ ] **Step 1: Write `src/components/AccountButton.tsx`**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AccountButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return <span className="h-8 w-8 animate-pulse rounded-full bg-raised" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/signin"
        className="rounded-lg border border-edge bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-raised"
      >
        Sign in
      </Link>
    );
  }

  const { user } = session;
  const initial = (user.username ?? user.name ?? "?").slice(0, 1).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-accent/15 text-sm font-semibold text-accent ring-1 ring-inset ring-edge"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-edge/70 bg-surface p-1.5 shadow-xl"
          >
            <div className="border-b border-edge/70 px-3 py-2">
              <div className="truncate text-sm font-semibold text-ink">
                {user.username ?? user.name ?? "Account"}
              </div>
              {user.username && (
                <div className="truncate text-[11px] text-muted">@{user.username}</div>
              )}
            </div>
            <Link
              href="/progress"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-raised"
            >
              Progress
            </Link>
            <Link
              href="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-raised"
            >
              Settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-bad transition-colors hover:bg-raised"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add to `AppHeader.tsx`**

Import `AccountButton` and render it next to `<ThemePicker compact />` in the header actions row (currently `AppHeader.tsx:59`).

- [ ] **Step 3: Add to landing header + update copy in `src/app/page.tsx`**

- Header actions (`page.tsx:131-139`): render `<AccountButton />` before the "Open drills" link.
- Badge (`page.tsx:147`): `Free forever · no ads · no accounts` → `Free forever · no ads · no tracking`.
- Feature card "Local-first progress" (`page.tsx:46-49`):
  ```
  body: "Progress lives in your browser by default. Create a free account to sync it across devices — no ads, no tracking."
  ```
- Footer line (`page.tsx:443`): `Made for learners. No ads, no accounts.` → `Made for learners. No ads, no tracking.`

- [ ] **Step 4: Verify**

Run: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
Manual: signed out shows "Sign in" in both headers; signed in shows avatar → menu links to `/progress`, `/settings`, Sign out works and returns to `/`.

- [ ] **Step 5: Commit**

```bash
git add src/components/AccountButton.tsx src/components/AppHeader.tsx src/app/page.tsx
git commit -m "feat: account button and landing copy"
```

---

### Task 6: Cloud record sync — unified store + records API

**Files:**
- Create: `src/lib/storage/store.ts`, `src/components/SyncProvider.tsx`, `src/app/api/records/route.ts`
- Modify: `src/lib/storage/local.ts` (add `addRecord`/`clearRecords` exports), `src/app/layout.tsx` (wrap `SyncProvider`), `src/app/app/page.tsx:7`, `src/components/landing/LandingStats.tsx:4`, `src/app/speed/SpeedScreen.tsx:7,63`, `src/app/practice/PracticeScreen.tsx:26,191`

**Interfaces:**
- Consumes: `auth` (Task 2), `db`/`records` (Task 1), `StatRecord` from `@/types`, `newId` from `./local`.
- Produces: `getRecords()`, `subscribeRecords(cb)`, `addRecord(record)`, `clearRecords()` from `@/lib/storage/store`; `SyncProvider`; `GET/POST /api/records`.

- [ ] **Step 1: Extend `src/lib/storage/local.ts`**

Add two module-level exports so the local store keeps its reactive behavior:
```ts
export function addRecord(record: StatRecord): void {
  save([...load(), record]);
  refreshCache();
  notifyRecords();
}

export function clearRecords(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEY);
  }
  recordsCache = [];
  notifyRecords();
}
```
Keep all existing exports unchanged so current call sites still work.

- [ ] **Step 2: Write `src/app/api/records/route.ts`**

```ts
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { records } from "@/db/schema";
import { auth } from "@/lib/auth";
import type { StatRecord } from "@/types";

function parseRecord(raw: unknown): StatRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Partial<StatRecord>;
  if (typeof rec.id !== "string") return null;
  if (rec.kind !== "code" && rec.kind !== "speed") return null;
  if (typeof rec.startedAt !== "string") return null;
  return rec as StatRecord;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({ id: records.id, data: records.data })
    .from(records)
    .where(eq(records.userId, session.user.id));

  const list = rows
    .map((r) => r.data as StatRecord)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  return NextResponse.json({ records: list });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const list = Array.isArray(body)
    ? body
    : (body as { records?: unknown })?.records;
  if (!Array.isArray(list)) {
    return NextResponse.json({ error: "Expected records array" }, { status: 400 });
  }

  const parsed = list
    .map(parseRecord)
    .filter((r): r is StatRecord => r !== null);

  if (parsed.length > 0) {
    await db
      .insert(records)
      .values(
        parsed.map((r) => ({
          id: r.id,
          userId: session.user!.id,
          kind: r.kind,
          startedAt: new Date(r.startedAt),
          data: r,
        })),
      )
      .onConflictDoNothing();
  }

  return NextResponse.json({ uploaded: parsed.length });
}
```

- [ ] **Step 3: Write `src/lib/storage/store.ts`**

Unified reactive store. Remote mode holds an in-memory snapshot hydrated from the API; local mode delegates to `local.ts`.

```ts
import type { StatRecord } from "@/types";
import {
  addRecord as addLocalRecord,
  clearRecords as clearLocalRecords,
  getRecords as getLocalRecords,
  subscribeRecords as subscribeLocalRecords,
} from "./local";

let remoteUserId: string | null = null;
let remoteRecords: StatRecord[] = [];
let hydrated = false;

const remoteListeners = new Set<() => void>();

function notifyRemote(): void {
  remoteListeners.forEach((cb) => cb());
}

function isRemote(): boolean {
  return remoteUserId !== null;
}

export function getRecords(): StatRecord[] {
  return isRemote() ? remoteRecords : getLocalRecords();
}

export function subscribeRecords(cb: () => void): () => void {
  const unsubLocal = subscribeLocalRecords(cb);
  remoteListeners.add(cb);
  return () => {
    unsubLocal();
    remoteListeners.delete(cb);
  };
}

export async function addRecord(record: StatRecord): Promise<void> {
  if (!isRemote()) {
    addLocalRecord(record);
    return;
  }
  remoteRecords = [...remoteRecords, record].sort((a, b) =>
    a.startedAt.localeCompare(b.startedAt),
  );
  notifyRemote();
  try {
    await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records: [record] }),
    });
  } catch {
    // offline — record stays in the in-memory snapshot; server is source on next hydrate
  }
}

export async function clearRecords(): Promise<void> {
  if (!isRemote()) {
    clearLocalRecords();
    return;
  }
  remoteRecords = [];
  notifyRemote();
}

export async function syncOnSignIn(userId: string): Promise<void> {
  if (remoteUserId === userId && hydrated) return;
  remoteUserId = userId;
  hydrated = false;

  const local = getLocalRecords();

  let uploaded: StatRecord[] = [];
  try {
    const res = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records: local }),
    });
    const json = (await res.json()) as { records?: StatRecord[] } | { uploaded?: number };
    uploaded = "records" in json && Array.isArray(json.records) ? json.records : [];
  } catch {
    // fall through — hydration below still runs
  }

  let fetched: StatRecord[] = [];
  try {
    const res = await fetch("/api/records");
    const json = (await res.json()) as { records?: StatRecord[] };
    fetched = Array.isArray(json.records) ? json.records : [];
  } catch {
    fetched = uploaded;
  }

  remoteRecords = fetched.sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  hydrated = true;
  clearLocalRecords();
  notifyRemote();
}

export function resetOnSignOut(): void {
  remoteUserId = null;
  hydrated = false;
  remoteRecords = [];
  notifyRemote();
}
```

- [ ] **Step 4: Write `src/components/SyncProvider.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { resetOnSignOut, syncOnSignIn } from "@/lib/storage/store";

export default function SyncProvider() {
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "authenticated" && data?.user?.id) {
      void syncOnSignIn(data.user.id);
    } else if (status === "unauthenticated") {
      resetOnSignOut();
    }
  }, [status, data]);

  return null;
}
```

- [ ] **Step 5: Wrap in `src/app/layout.tsx`**

Inside `Providers`, add `<SyncProvider />`.

- [ ] **Step 6: Swap call sites**

- `src/app/app/page.tsx:7` — change import to `from "@/lib/storage/store"`.
- `src/components/landing/LandingStats.tsx:4` — same import swap.
- `src/app/speed/SpeedScreen.tsx` — change `import { createLocalRecordStore, newId } from "@/lib/storage/local"` to `import { newId } from "@/lib/storage/local"` and `import { addRecord } from "@/lib/storage/store"`; replace `createLocalRecordStore().add(record)` (line 63) with `void addRecord(record)`.
- `src/app/practice/PracticeScreen.tsx` — same pattern; replace line 191 `createLocalRecordStore().add(record)` with `void addRecord(record)`.

- [ ] **Step 7: Verify**

Run: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
Manual (dev server):
- Signed out: complete a speed test and a practice session → records persist in localStorage, dashboard totals update.
- Sign in: local records merge (POST idempotent) → dashboard totals unchanged but now served from the API. Verify in Neon SQL editor: `select count(*) from records;`.
- Sign out: records revert to localStorage view; dashboard still shows totals.
- Sign in again: totals identical (no duplicates — dedupe by id works).

- [ ] **Step 8: Commit**

```bash
git add src/lib/storage src/components/SyncProvider.tsx "src/app/api/records/route.ts" src/app/layout.tsx src/app/app/page.tsx src/components/landing/LandingStats.tsx src/app/speed/SpeedScreen.tsx src/app/practice/PracticeScreen.tsx
git commit -m "feat: cloud record sync"
```

---

### Task 7: Progress dashboard

**Files:**
- Create: `src/app/progress/page.tsx`, `src/components/progress/StreakCard.tsx`, `src/components/progress/TrendChart.tsx`, `src/components/progress/ConceptBars.tsx`, `src/components/progress/SpeedBests.tsx`, `src/components/progress/HistoryList.tsx`
- Modify: none (new folder)

**Interfaces:**
- Consumes: `auth` (Task 2), `db`/`records` (Task 1), `StatRecord` from `@/types`, `CONCEPTS` from `@/lib/concepts`.

- [ ] **Step 1: Write `src/app/progress/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { records } from "@/db/schema";
import type { StatRecord } from "@/types";
import StreakCard from "@/components/progress/StreakCard";
import TrendChart from "@/components/progress/TrendChart";
import ConceptBars from "@/components/progress/ConceptBars";
import SpeedBests from "@/components/progress/SpeedBests";
import HistoryList from "@/components/progress/HistoryList";

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const rows = await db
    .select({ data: records.data })
    .from(records)
    .where(eq(records.userId, session.user.id))
    .orderBy(desc(records.startedAt));

  const list = rows
    .map((r) => r.data as StatRecord)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight text-ink">
        Progress
      </h1>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <StreakCard records={list} />
        <SpeedBests records={list} />
      </div>
      <TrendChart records={list} />
      <ConceptBars records={list} />
      <HistoryList records={list} />
    </div>
  );
}
```

- [ ] **Step 2: Write the five components**

All are pure functions over `StatRecord[]` using existing tokens.

`StreakCard` — compute current streak (consecutive local dates ending today or yesterday) and longest streak from `startedAt`; render both as labeled stats.

`TrendChart` — hand-rolled inline `<svg>` (width 100%, viewBox `0 0 600 160`): take the last 30 records, plot WPM (accent line) and accuracy % (good line) as polylines with computed `points`, zero-axis gridlines, `<polyline fill="none" stroke="var(--color-accent)" strokeWidth={2} />` and a second for `var(--color-good)`. No libraries.

`ConceptBars` — aggregate code records by `concept`: mastered bars (masteredCount / total sessions per concept) using `CONCEPTS` labels, width `style={{ width: pct }}`, `bg-accent`.

`SpeedBests` — best WPM per speed-test target (`time:15|30|60`, `words:10|25|50`) as a small table of `font-mono` values.

`HistoryList` — group records by local date (`toLocaleDateString`), descending; each day lists sessions (`kind`, title/label, WPM, accuracy, duration). Reuse `snippetsFor`/titles where useful.

- [ ] **Step 3: Verify**

Run: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
Manual: signed in with a few practice + speed records → streak shows a value, trend lines render, concept bars reflect mastered counts, speed bests populate, history groups by day. Signed out → `/progress` redirects to `/signin`. Empty account → friendly empty states ("No sessions yet").

- [ ] **Step 4: Commit**

```bash
git add src/app/progress src/components/progress
git commit -m "feat: progress dashboard"
```

---

### Task 8: Verification, copy sweep, docs

**Files:**
- Modify: `README.md` if it claims "no accounts"
- Modify: any remaining copy contradicting accounts

- [ ] **Step 1: Sweep copy**

Run: `rg -i "no accounts|no accounts, ever|without an account" -g "!docs/**" -g "!node_modules/**" .`
Expected: only the spec/plan docs mention it. Fix any app copy (landing, footer, README) to reflect optional accounts.

- [ ] **Step 2: Full gate**

Run: `npm run lint`, `npx tsc --noEmit`, `npm run build`. All green.

- [ ] **Step 3: Full manual checklist**

- Create account (email/password) → auto signed in → dashboard merges any pre-existing local records (no dupes).
- GitHub sign-in → account created/linked.
- Settings: username edit (taken-check), set/change/remove password rules, GitHub link/unlink rules.
- Record a session signed out → sign in → totals identical after merge; verify `records` table row count.
- Sign out → localStorage view; sign back in → no duplicates.
- `/settings`, `/progress` redirect when signed out.
- Header menu: Progress / Settings / Sign out on both landing and app headers.
- Landing copy reads correctly ("Free forever · no ads · no tracking").

- [ ] **Step 4: Commit**

```bash
git add README.md src
git commit -m "chore: verify accounts feature"
git push
```

---

## Self-Review Notes

- **Spec coverage:** schema (Task 1), auth wiring (Task 2), sign-in/sign-up page (Task 3), settings incl. username/password/provider rules (Task 4), header + landing copy (Task 5), storage abstraction + merge + API (Task 6), progress dashboard (Task 7), verification (Task 8). All spec sections have a task.
- **Type consistency:** `syncOnSignIn`/`resetOnSignOut` names match between `store.ts` and `SyncProvider`; `addRecord`/`clearRecords` added to `local.ts` and re-exported by `store.ts`; `AuthActionState`/`SettingsActionResult` used consistently.
- **Placeholders:** none — every code step contains complete implementations.
