import type { SpeedTestRecord, StatRecord } from "@/types";

const TIME_TARGETS = [15, 30, 60] as const;
const WORD_TARGETS = [10, 25, 50] as const;

function bestWpm(
  records: SpeedTestRecord[],
  mode: SpeedTestRecord["mode"],
  target: number,
): number | null {
  const matches = records.filter((r) => r.mode === mode && r.target === target);
  if (matches.length === 0) return null;
  return Math.round(Math.max(...matches.map((r) => r.wpm)));
}

function BarRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number | null;
  max: number;
}) {
  const pct = value === null ? 0 : Math.max(6, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-11 shrink-0 font-mono text-xs text-muted">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden bg-raised">
        {value !== null && (
          <div
            className="h-full bg-accent transition-[width]"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      <span
        className={`w-12 shrink-0 text-right font-mono text-sm font-semibold tabular-nums ${
          value === null ? "text-muted" : "text-ink"
        }`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

function Group({
  title,
  rows,
  max,
}: {
  title: string;
  rows: { label: string; value: number | null }[];
  max: number;
}) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-widest text-muted">
        {title}
      </div>
      <div>
        {rows.map((row) => (
          <BarRow key={row.label} label={row.label} value={row.value} max={max} />
        ))}
      </div>
    </div>
  );
}

export default function SpeedBests({ records }: { records: StatRecord[] }) {
  const speed = records.filter((r): r is SpeedTestRecord => r.kind === "speed");
  const values = [
    ...TIME_TARGETS.map((t) => bestWpm(speed, "time", t)),
    ...WORD_TARGETS.map((w) => bestWpm(speed, "words", w)),
  ].filter((v): v is number => v !== null);
  const max = values.length > 0 ? Math.max(...values) : 1;

  return (
    <section>
      <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
        Speed bests
      </h2>
      {speed.length === 0 ? (
        <p className="text-sm text-muted">
          No speed tests yet. Run a timed or word-count test to see your bests.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          <Group
            title="Time"
            rows={TIME_TARGETS.map((t) => ({
              label: `${t}s`,
              value: bestWpm(speed, "time", t),
            }))}
            max={max}
          />
          <Group
            title="Words"
            rows={WORD_TARGETS.map((w) => ({
              label: `${w}w`,
              value: bestWpm(speed, "words", w),
            }))}
            max={max}
          />
        </div>
      )}
    </section>
  );
}
