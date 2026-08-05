"use client";

import { useScrolled } from "@/lib/useScrolled";

export default function NavGlass({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const scrolled = useScrolled();
  return (
    <header className={className} data-scrolled={scrolled}>
      {children}
    </header>
  );
}
