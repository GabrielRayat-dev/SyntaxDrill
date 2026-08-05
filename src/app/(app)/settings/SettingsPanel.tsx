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
  "w-full rounded-[2px] border border-edge bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none";
const sectionCls = "rounded-lg border border-edge/70 bg-surface p-5";

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
            className="w-fit rounded-[2px] bg-accent px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
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
                className="w-fit rounded-[2px] bg-accent px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
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
                className="w-fit rounded-[2px] border border-bad/60 px-3.5 py-2 text-sm font-semibold text-bad transition-colors hover:bg-bad/10 disabled:opacity-60"
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
              className="w-fit rounded-[2px] bg-accent px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {setPending ? "Saving…" : "Set password"}
            </button>
          </form>
        )}
      </section>

      <section className={sectionCls}>
        <h2 className="mb-3 font-semibold text-ink">Connected accounts</h2>
        <div className="flex items-center justify-between gap-3 rounded-[2px] bg-raised/60 px-3.5 py-2.5">
          <span className="text-sm font-medium text-ink">GitHub</span>
          <button
            type="button"
            onClick={() => signIn("github", { redirectTo: "/settings" })}
            className="rounded-[2px] border border-edge px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-raised"
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
        className="w-fit rounded-[2px] border border-edge bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-raised"
      >
        Sign out
      </button>
    </div>
  );
}
