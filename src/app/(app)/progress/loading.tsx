import Link from "next/link";
import { Skeleton } from "@/components/Skeleton";

export default function ProgressLoading() {
  return (
    <div className="mx-auto max-w-4xl" role="status" aria-label="Loading progress">
      <Link
        href="/app"
        className="mb-4 inline-block text-xs font-medium text-muted transition-colors hover:text-ink"
      >
        ← Tracks
      </Link>
      <p className="signal-kicker mb-3">Your history</p>
      <h1 className="mb-4 text-4xl font-medium tracking-[-0.05em] text-ink">
        Progress
      </h1>
      <div className="flex flex-col">
        <section className="border-t border-edge/80 py-8">
          <Skeleton className="mb-4 h-7 w-24" />
          <div className="mb-6 flex gap-10">
            <Skeleton className="h-9 w-12" />
            <Skeleton className="h-9 w-12" />
          </div>
          <Skeleton className="h-24 w-full" />
        </section>
        <section className="border-t border-edge/80 py-8">
          <Skeleton className="mb-4 h-7 w-32" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-40" />
          </div>
        </section>
        <section className="border-t border-edge/80 py-8">
          <Skeleton className="mb-4 h-7 w-20" />
          <Skeleton className="h-40 w-full" />
        </section>
        <section className="border-t border-edge/80 py-8">
          <Skeleton className="mb-4 h-7 w-28" />
          <div className="space-y-3">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </section>
        <section className="border-t border-edge/80 py-8">
          <Skeleton className="mb-4 h-7 w-24" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </section>
      </div>
    </div>
  );
}
