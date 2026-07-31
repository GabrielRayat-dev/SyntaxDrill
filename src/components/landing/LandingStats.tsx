"use client";

import { useSyncExternalStore } from "react";
import { getRecords, subscribeRecords } from "@/lib/storage/local";
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
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-semibold tabular-nums text-ink">
            {item.value}
          </span>
          <span className="text-xs text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
