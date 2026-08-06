import Link from "next/link";
import { Skeleton } from "@/components/Skeleton";

export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-2xl" role="status" aria-label="Loading settings">
      <Link
        href="/app"
        className="mb-4 inline-block text-xs font-medium text-muted transition-colors hover:text-ink"
      >
        ← Tracks
      </Link>
      <p className="signal-kicker mb-3">Your account</p>
      <h1 className="mb-8 text-4xl font-medium tracking-[-0.05em] text-ink">
        Settings
      </h1>
      <div className="flex flex-col">
        <div className="mb-2 flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-md" />
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-56" />
          </div>
        </div>
        <section className="border-t border-edge/80 py-8">
          <Skeleton className="mb-4 h-4 w-16" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mt-3 h-9 w-32" />
        </section>
        <section className="border-t border-edge/80 py-8">
          <Skeleton className="mb-4 h-4 w-16" />
          <Skeleton className="h-6 w-full max-w-sm" />
        </section>
        <section className="border-t border-edge/80 py-8">
          <Skeleton className="mb-4 h-4 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mt-3 h-9 w-32" />
        </section>
        <section className="border-t border-edge/80 py-8">
          <Skeleton className="mb-4 h-4 w-36" />
          <Skeleton className="h-11 w-full" />
        </section>
        <div className="border-t border-edge/80 py-8">
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}
