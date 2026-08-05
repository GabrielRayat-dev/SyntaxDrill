import type { ReactNode } from "react";
import AppHeader from "@/components/AppHeader";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="signal-app min-h-[100dvh]">
      <AppHeader />
      <main id="main" className="mx-auto w-full max-w-[1440px] px-5 py-10 lg:px-8 lg:py-14">
        {children}
      </main>
    </div>
  );
}
