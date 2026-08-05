import type { StatRecord } from "@/types";

const W = 600;
const H = 160;

export default function TrendChart({ records }: { records: StatRecord[] }) {
  const recent = records.slice(-30);

  if (recent.length === 0) {
    return (
      <section>
        <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
          Trend
        </h2>
        <p className="text-sm text-muted">No sessions yet.</p>
      </section>
    );
  }

  const maxWpm = Math.max(1, ...recent.map((r) => r.wpm));
  const n = recent.length;
  const slot = W / n;
  const barW = Math.max(3, slot * 0.6);

  return (
    <section>
      <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
        Trend
      </h2>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="WPM and accuracy over the last 30 sessions"
      >
        {[0, 40, 80, 120, 160].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2={W}
            y2={y}
            stroke="var(--sd-border)"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
        ))}
        {recent.map((r, i) => {
          const h = Math.max(2, (r.wpm / maxWpm) * 130);
          const x = i * slot + (slot - barW) / 2;
          const y = H - h;
          const accY = H - r.accuracy * 130;
          return (
            <g key={r.id}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="1"
                fill="var(--sd-accent)"
                opacity="0.85"
              />
              <line
                x1={x}
                y1={accY}
                x2={x + barW}
                y2={accY}
                stroke="var(--sd-correct)"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center gap-4 font-mono text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1 w-3 bg-accent" /> WPM
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1 w-3 bg-good" /> Accuracy
        </span>
      </div>
    </section>
  );
}
