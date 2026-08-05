"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountButton from "@/components/AccountButton";

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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-1.5 focus:text-xs focus:font-semibold focus:text-page"
      >
        Skip to content
      </a>
      <header className="signal-app-nav sticky top-0 z-40">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-5 sm:gap-9">
            <Link href="/" className="signal-wordmark shrink-0" aria-label="SyntaxDrill home">
              syntax<span>drill</span>
            </Link>
            <nav className="flex min-w-0 items-center gap-4 sm:gap-6" aria-label="Application navigation">
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
                    className={`signal-app-link ${active ? "signal-app-link-active" : ""} ${item.id === "settings" ? "hidden sm:inline" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <AccountButton />
        </div>
      </header>
    </>
  );
}
