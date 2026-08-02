import type { ReactNode } from "react";
import AppHeader from "@/components/AppHeader";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main id="main" className="mx-auto w-full max-w-5xl px-4 py-10">
        {children}
      </main>
    </div>
  );
}
