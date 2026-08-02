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
      <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight text-ink">
        Progress
      </h1>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <StreakCard records={list} />
        <SpeedBests records={list} />
      </div>
      <TrendChart records={list} />
      <ConceptBars records={list} />
      <HistoryList records={list} />
    </div>
  );
}
