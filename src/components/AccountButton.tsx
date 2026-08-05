"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";

export default function AccountButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return <span className="h-8 w-8 animate-pulse rounded-md bg-raised" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <Link href="/signin" className="signal-nav-signin group">
        Sign in
        <ArrowRight
          className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden
        />
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
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-accent/15 text-sm font-semibold text-accent ring-1 ring-inset ring-edge"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="h-full w-full rounded-md object-cover" />
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
            className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-edge/70 bg-surface p-1.5 shadow-xl"
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
              className="mt-1 block rounded-md px-3 py-2 text-sm text-ink transition-colors hover:bg-raised"
            >
              Progress
            </Link>
            <Link
              href="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-ink transition-colors hover:bg-raised"
            >
              Settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-bad transition-colors hover:bg-raised"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
