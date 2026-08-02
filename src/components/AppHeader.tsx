"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountButton from "@/components/AccountButton";
import ModeToggle from "@/components/theme/ModeToggle";

const NAV: { id: string; label: string; href: string }[] = [
  { id: "practice", label: "Practice", href: "/app" },
  { id: "speed", label: "Speed", href: "/speed" },
  { id: "settings", label: "Settings", href: "/settings" },
  { id: "progress", label: "Progress", href: "/progress" },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[2px] focus:bg-accent focus:px-3 focus:py-1.5 focus:text-xs focus:font-semibold focus:text-page"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-edge/70 bg-page/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-display text-lg font-semibold tracking-tight text-ink">
                SyntaxDrill
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:inline">
                workbook
              </span>
            </Link>
            <nav className="flex items-center gap-5">
              {NAV.map((item) => {
                const active =
                  item.id === "practice"
                    ? pathname === "/app" || pathname.startsWith("/practice")
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`sd-nav-link ${active ? "sd-nav-link-active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <AccountButton />
          </div>
        </div>
      </header>
    </>
  );
}
