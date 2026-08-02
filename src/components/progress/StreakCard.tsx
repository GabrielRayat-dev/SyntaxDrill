import type { StatRecord } from "@/types";

function dateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round(
    (new Date(ay, am - 1, ad).getTime() - new Date(by, bm - 1, bd).getTime()) / 86_400_000,
  );
}

function computeStreak(records: StatRecord[]) {
  const keys = [...new Set(records.map((r) => dateKey(r.startedAt)))].sort();
  const today = dateKey(new Date().toISOString());
  const yesterday = addDays(today, -1);

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const k of keys) {
    run = prev === null || daysBetween(k, prev) === 1 ? run + 1 : 1;
    prev = k;
    longest = Math.max(longest, run);
  }

  let current = 0;
  if (keys.length > 0) {
    const last = keys[keys.length - 1];
    if (last === today || last === yesterday) {
      let cursor = last;
      for (let i = keys.length - 1; i >= 0; i--) {
        if (keys[i] === cursor) {
          current += 1;
          cursor = addDays(cursor, -1);
        } else {
          break;
        }
      }
    }
  }

  return { current, longest };
}

export default function StreakCard({ records }: { records: StatRecord[] }) {
  const { current, longest } = computeStreak(records);

  return (
    <div className="sd-rise rounded-lg border border-edge/70 bg-surface p-5">
      <h2 className="mb-3 font-semibold text-ink">Streaks</h2>
      {records.length === 0 ? (
        <p className="text-sm text-muted">
          No sessions yet. Practice or take a speed test to start a streak.
        </p>
      ) : (
        <div className="flex gap-8">
          <div>
            <div className="font-mono text-2xl font-semibold tabular-nums text-accent">
              {current}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-muted">
              Current day{current === 1 ? "" : "s"}
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl font-semibold tabular-nums text-ink">
              {longest}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-muted">
              Longest
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
