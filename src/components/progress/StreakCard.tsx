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

const WEEK_DAYS = 7;

function weekDays(): string[] {
  const today = dateKey(new Date().toISOString());
  const keys: string[] = [];
  for (let i = WEEK_DAYS - 1; i >= 0; i--) keys.push(addDays(today, -i));
  return keys;
}

function weekdayLabel(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "narrow",
  });
}

export default function StreakCard({ records }: { records: StatRecord[] }) {
  const { current, longest } = computeStreak(records);
  const practiced = new Set(records.map((r) => dateKey(r.startedAt)));
  const days = weekDays();
  const today = days[days.length - 1];

  return (
    <section>
      <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
        Streaks
      </h2>
      {records.length === 0 ? (
        <p className="mb-6 text-sm text-muted">
          No sessions yet. Practice or take a speed test to start a streak.
        </p>
      ) : (
        <div className="mb-6 flex gap-10">
          <div>
            <div className="font-mono text-3xl font-semibold tabular-nums text-accent">
              {current}
            </div>
            <div className="mt-1 font-mono text-[10px] font-medium uppercase tracking-widest text-muted">
              Current day{current === 1 ? "" : "s"}
            </div>
          </div>
          <div>
            <div className="font-mono text-3xl font-semibold tabular-nums text-ink">
              {longest}
            </div>
            <div className="mt-1 font-mono text-[10px] font-medium uppercase tracking-widest text-muted">
              Longest
            </div>
          </div>
        </div>
      )}
      <div
        className="signal-app-metrics px-4 pb-4 pt-5"
        role="img"
        aria-label="Practice activity over the last 7 days"
      >
        <div className="flex items-end justify-between gap-2">
          {days.map((day) => {
            const active = practiced.has(day);
            const isToday = day === today;
            return (
              <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-14 w-full items-end justify-center">
                  <div
                    className={`w-full max-w-[16px] ${active ? "bg-accent" : "bg-raised"} ${
                      isToday ? "ring-1 ring-inset ring-accent/70" : ""
                    }`}
                    style={{ height: active ? "100%" : "36%" }}
                  />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted">
                  {weekdayLabel(day)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
