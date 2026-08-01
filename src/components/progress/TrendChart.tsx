import type { StatRecord } from "@/types";

export default function TrendChart({ records }: { records: StatRecord[] }) {
  const recent = records.slice(-30);

  if (recent.length === 0) {
    return (
      <div className="mb-6 rounded-xl border border-edge/70 bg-surface p-5">
        <h2 className="mb-3 font-semibold text-ink">Trend</h2>
        <p className="text-sm text-muted">No sessions yet.</p>
      </div>
    );
  }

  const maxWpm = Math.max(1, ...recent.map((r) => r.wpm));
  const n = Math.max(1, recent.length - 1);
  const x = (i: number) => (i / n) * 600;
  const wpmPoints = recent
    .map((r, i) => `${x(i).toFixed(1)},${(160 - (r.wpm / maxWpm) * 140).toFixed(1)}`)
    .join(" ");
  const accPoints = recent
    .map((r, i) => `${x(i).toFixed(1)},${(160 - (r.accuracy / 100) * 140).toFixed(1)}`)
    .join(" ");

  return (
    <div className="mb-6 rounded-xl border border-edge/70 bg-surface p-5">
      <h2 className="mb-3 font-semibold text-ink">Trend</h2>
      <svg
        viewBox="0 0 600 160"
        className="w-full"
        role="img"
        aria-label="WPM and accuracy over the last 30 sessions"
      >
        {[0, 40, 80, 120, 160].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="600"
            y2={y}
            stroke="var(--sd-border)"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
        ))}
        <polyline
          fill="none"
          stroke="var(--sd-accent)"
          strokeWidth="2"
          strokeLinejoin="round"
          points={wpmPoints}
        />
        <polyline
          fill="none"
          stroke="var(--sd-correct)"
          strokeWidth="2"
          strokeLinejoin="round"
          points={accPoints}
        />
      </svg>
      <div className="mt-2 flex items-center gap-4 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1 w-3 rounded bg-accent" />
          WPM
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1 w-3 rounded bg-good" />
          Accuracy
        </span>
      </div>
    </div>
  );
}
