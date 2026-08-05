"use client";

import { useState } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";
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
    "signal-auth-input w-full px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:outline-none";
  const tabBtn = (id: "signin" | "register") =>
    `signal-auth-tab flex-1 px-3 py-2 text-sm font-medium ${
      tab === id ? "signal-auth-tab-active text-ink" : "text-muted hover:text-ink"
    }`;

  return (
    <div className="signal-auth-card w-full max-w-sm p-6 sm:p-7">
      <p className="signal-kicker mb-3">Enter the practice space</p>
      <h1 className="mb-6 text-3xl font-medium tracking-[-0.055em] text-ink">Make the next run count.</h1>
      <div className="mb-5 flex gap-1 border-b border-edge/70">
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
        className="signal-auth-github mb-5 w-full"
      >
        <span className="signal-auth-github-mark" aria-hidden>GH</span>
        <span className="signal-auth-github-copy">
          Continue with GitHub
          <small>Sync your progress across devices</small>
        </span>
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
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
            className="signal-auth-submit mt-1 w-full"
          >
            <span>Sign in</span>
            <span className="signal-auth-submit-index" aria-hidden>01</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
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
            className="signal-auth-submit mt-1 w-full disabled:opacity-60"
          >
            {pending ? "Creating account…" : "Create account"}
            <span className="signal-auth-submit-index" aria-hidden>02</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
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
