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
import { ThemePicker } from "@/components/theme/ThemePicker";
import ModeToggle from "@/components/theme/ModeToggle";

const inputCls =
  "signal-input w-full px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:outline-none";
const labelCls =
  "mb-2 block font-mono text-[10px] font-medium uppercase tracking-widest text-muted";
const sectionTitleCls =
  "mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";
const primaryBtnCls = "signal-cta w-fit";

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
    <div className="flex flex-col">
      <div className="mb-2 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-accent/15 text-lg font-semibold text-accent ring-1 ring-inset ring-edge">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
            initial
          )}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-medium tracking-[-0.03em] text-ink">
            {username ?? name ?? "Account"}
          </h2>
          {email && <p className="text-xs text-muted">{email}</p>}
        </div>
      </div>

      <section className="border-t border-edge/80 py-8">
        <h3 className={sectionTitleCls}>Profile</h3>
        <form action={userAction} className="flex flex-col gap-3">
          <label className={labelCls} htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className={inputCls}
            name="username"
            defaultValue={userState.username}
            required
          />
          <Status error={userState.error} ok={userState.ok} />
          <button type="submit" disabled={userPending} className={primaryBtnCls}>
            {userPending ? "Saving…" : "Save username"}
          </button>
        </form>
      </section>

      <section className="border-t border-edge/80 py-8">
        <h3 className={sectionTitleCls}>Theme</h3>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            Pick a colorway and light or dark mode for the app.
          </p>
          <ModeToggle />
        </div>
        <ThemePicker />
      </section>

      <section className="border-t border-edge/80 py-8">
        <h3 className={sectionTitleCls}>Password</h3>
        {hasPassword ? (
          <div className="space-y-5">
            <form action={changeAction} className="flex flex-col gap-3">
              <label className={labelCls} htmlFor="current-password">
                Current password
              </label>
              <input
                id="current-password"
                className={inputCls}
                name="current"
                type="password"
                placeholder="Current password"
                required
              />
              <label className={labelCls} htmlFor="new-password">
                New password
              </label>
              <input
                id="new-password"
                className={inputCls}
                name="password"
                type="password"
                placeholder="New password (8+ chars)"
                required
              />
              <label className={labelCls} htmlFor="confirm-password">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                className={inputCls}
                name="confirm"
                type="password"
                placeholder="Confirm new password"
                required
              />
              <Status error={changeState?.error} ok={changeState?.ok} />
              <button type="submit" disabled={changePending} className={primaryBtnCls}>
                {changePending ? "Changing…" : "Change password"}
              </button>
            </form>
            <form action={removeAction} className="flex flex-col gap-3">
              <label className={labelCls} htmlFor="remove-password">
                Current password to remove
              </label>
              <input
                id="remove-password"
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
                className="w-fit text-xs font-medium text-bad underline-offset-2 transition-colors hover:underline disabled:opacity-60"
              >
                {removePending ? "Removing…" : "Remove password"}
              </button>
            </form>
          </div>
        ) : (
          <form action={setAction} className="flex flex-col gap-3">
            <p className="text-xs text-muted">
              No password yet. Add one to sign in with email + password.
            </p>
            <label className={labelCls} htmlFor="set-password">
              Password
            </label>
            <input
              id="set-password"
              className={inputCls}
              name="password"
              type="password"
              placeholder="Password (8+ chars)"
              required
            />
            <label className={labelCls} htmlFor="set-confirm">
              Confirm password
            </label>
            <input
              id="set-confirm"
              className={inputCls}
              name="confirm"
              type="password"
              placeholder="Confirm password"
              required
            />
            <Status error={setState?.error} ok={setState?.ok} />
            <button type="submit" disabled={setPending} className={primaryBtnCls}>
              {setPending ? "Saving…" : "Set password"}
            </button>
          </form>
        )}
      </section>

      <section className="border-t border-edge/80 py-8">
        <h3 className={sectionTitleCls}>Connected accounts</h3>
        <div className="flex items-center justify-between gap-3 rounded-md border border-edge bg-surface px-4 py-3">
          <span className="text-sm font-medium text-ink">GitHub</span>
          <button
            type="button"
            onClick={() => signIn("github", { redirectTo: "/settings" })}
            className="signal-secondary-cta"
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

      <div className="border-t border-edge/80 py-8">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-fit rounded-md border border-edge bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-raised"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
