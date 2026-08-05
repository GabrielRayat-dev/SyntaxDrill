"use client";

import { useSyncExternalStore } from "react";
import { getRecords, subscribeRecords } from "@/lib/storage/store";
import { totals } from "@/lib/storage/aggregates";

export default function LandingStats() {
  const records = useSyncExternalStore(subscribeRecords, getRecords, getRecords);
  const t = totals(records);
  const hasData = records.length > 0;

  if (!hasData) return null;

  const items = [
    { label: "Sessions", value: String(t.sessions) },
    { label: "Snippets typed", value: String(t.snippetsTyped) },
    { label: "Mastered", value: String(t.snippetsMastered) },
    { label: "Avg accuracy", value: `${Math.round(t.avgAccuracy * 100)}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-edge/60">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-1 px-4 text-center sm:items-start sm:text-left"
        >
          <span className="font-sans text-3xl font-medium tabular-nums tracking-[-0.03em] text-ink">
            {item.value}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
