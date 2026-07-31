"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemePicker } from "@/components/theme/ThemePicker";
import { setRaw } from "@/lib/localStore";

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
        <ThemePicker compact />
      </div>
    </header>
  );
}
