import type { StatRecord } from "@/types";
import { getConcept } from "@/lib/concepts";

function dateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  if (total < 60) return `${total}s`;
  return `${Math.floor(total / 60)}m ${String(total % 60).padStart(2, "0")}s`;
}

function label(record: StatRecord): string {
  if (record.kind === "code") {
    const concept = getConcept(record.concept)?.name ?? record.concept;
    return `${record.language} · ${concept}`;
  }
  return record.mode === "time" ? `${record.target}s test` : `${record.target} word test`;
}

export default function HistoryList({ records }: { records: StatRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="sd-rise rounded-lg border border-edge/70 bg-surface p-5">
        <h2 className="mb-3 font-semibold text-ink">History</h2>
        <p className="text-sm text-muted">No sessions yet.</p>
      </div>
    );
  }

  const sorted = [...records].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const grouped = new Map<string, StatRecord[]>();
  for (const r of sorted) {
    const key = dateKey(r.startedAt);
    const list = grouped.get(key) ?? [];
    list.push(r);
    grouped.set(key, list);
  }

  return (
    <div className="sd-rise rounded-lg border border-edge/70 bg-surface p-5">
      <h2 className="mb-3 font-semibold text-ink">History</h2>
      <div className="flex flex-col gap-4">
        {[...grouped.entries()].map(([day, rows]) => (
          <div key={day}>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted">
              {formatDay(day)}
            </div>
            <div className="flex flex-col gap-1">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-raised/60 px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        r.kind === "code" ? "bg-accent/15 text-accent" : "bg-good/15 text-good"
                      }`}
                    >
                      {r.kind}
                    </span>
                    <span className="truncate text-sm text-ink">{label(r)}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 font-mono text-xs tabular-nums text-muted">
                    <span className="text-ink">{Math.round(r.wpm)} wpm</span>
                    <span>{Math.round(r.accuracy * 100)}%</span>
                    <span>{formatDuration(r.durationMs)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
