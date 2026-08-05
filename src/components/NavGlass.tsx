"use client";

import { useScrolled } from "@/lib/useScrolled";
import BlueprintCorners from "@/components/BlueprintCorners";

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
      <BlueprintCorners />
      {children}
    </header>
  );
}
