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
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: "/app",
    });
    if (res?.error) {
      setLoginError("Invalid email or password.");
    } else {
      window.location.href = res.url ?? "/app";
    }
  }

  function handleGithub() {
    signIn("github", { redirectTo: "/app" });
  }

  const inputCls =
    "w-full rounded-[2px] border border-edge bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none";
  const tabBtn = (id: "signin" | "register") =>
    `flex-1 rounded-[2px] px-3 py-1.5 text-sm font-medium transition-colors ${
      tab === id ? "bg-raised text-ink shadow-sm" : "text-muted hover:text-ink"
    }`;

  return (
    <div className="w-full max-w-sm rounded-lg border border-edge/70 bg-surface p-6">
      <div className="mb-5 flex items-center gap-1 rounded-[2px] border border-edge/70 bg-page p-0.5">
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
        className="mb-5 w-full rounded-[2px] bg-page px-3.5 py-2.5 text-sm font-semibold text-ink ring-1 ring-inset ring-edge transition-colors hover:bg-raised"
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
            className="mt-1 w-full rounded-[2px] bg-accent px-3.5 py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90"
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
            className="mt-1 w-full rounded-[2px] bg-accent px-3.5 py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
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
