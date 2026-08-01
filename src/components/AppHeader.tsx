"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { setRaw } from "@/lib/localStore";
import AccountButton from "@/components/AccountButton";

type AppMode = "practice" | "speed";

const MODES: { id: AppMode; label: string; href: string }[] = [
  { id: "practice", label: "Practice", href: "/app" },
  { id: "speed", label: "Speed", href: "/speed" },
];

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const active: AppMode = pathname.startsWith("/speed") ? "speed" : "practice";

  function choose(mode: AppMode) {
    setRaw("sd.mode", mode);
    router.push(mode === "practice" ? "/app" : "/speed");
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-1.5 focus:text-xs focus:font-semibold focus:text-page"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-edge/70 bg-page/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-mono text-sm font-semibold tracking-tight text-ink"
          >
            <span className="text-accent">&gt;</span>_
            <span className="ml-2 hidden sm:inline">SyntaxDrill</span>
          </Link>
          <nav className="hidden items-center gap-1 rounded-lg border border-edge/70 bg-surface p-0.5 sm:flex">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => choose(m.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  active === m.id
                    ? "bg-raised text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {m.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <AccountButton />
        </div>
      </div>
    </header>
    </>
  );
}
