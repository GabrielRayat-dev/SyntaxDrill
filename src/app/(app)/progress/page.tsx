import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { records } from "@/db/schema";
import type { StatRecord } from "@/types";
import StreakCard from "@/components/progress/StreakCard";
import TrendChart from "@/components/progress/TrendChart";
import ConceptBars from "@/components/progress/ConceptBars";
import SpeedBests from "@/components/progress/SpeedBests";
import HistoryList from "@/components/progress/HistoryList";

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const rows = await db
    .select({ data: records.data })
    .from(records)
    .where(eq(records.userId, session.user.id))
    .orderBy(desc(records.startedAt));

  const list = rows
    .map((r) => r.data as StatRecord)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));

  return (
    <div className="mx-auto max-w-4xl">
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
        <div className="border-t border-edge/80 py-8">
          <StreakCard records={list} />
        </div>
        <div className="border-t border-edge/80 py-8">
          <SpeedBests records={list} />
        </div>
        <div className="border-t border-edge/80 py-8">
          <TrendChart records={list} />
        </div>
        <div className="border-t border-edge/80 py-8">
          <ConceptBars records={list} />
        </div>
        <div className="border-t border-edge/80 py-8">
          <HistoryList records={list} />
        </div>
      </div>
    </div>
  );
}
