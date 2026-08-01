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

function BestTable({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: number | null }[];
}) {
  return (
    <div className="flex-1">
      <div className="mb-1.5 text-[10px] font-medium uppercase tracking-widest text-muted">
        {title}
      </div>
      <div className="flex flex-col gap-1">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-lg bg-raised/60 px-3 py-1.5"
          >
            <span className="text-xs text-muted">{row.label}</span>
            <span className="font-mono text-sm font-semibold tabular-nums text-ink">
              {row.value ?? "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SpeedBests({ records }: { records: StatRecord[] }) {
  const speed = records.filter((r): r is SpeedTestRecord => r.kind === "speed");

  if (speed.length === 0) {
    return (
      <div className="rounded-xl border border-edge/70 bg-surface p-5">
        <h2 className="mb-3 font-semibold text-ink">Speed bests</h2>
        <p className="text-sm text-muted">
          No speed tests yet. Run a timed or word-count test to see your bests.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-edge/70 bg-surface p-5">
      <h2 className="mb-3 font-semibold text-ink">Speed bests</h2>
      <div className="flex gap-6">
        <BestTable
          title="Time"
          rows={TIME_TARGETS.map((t) => ({
            label: `${t}s`,
            value: bestWpm(speed, "time", t),
          }))}
        />
        <BestTable
          title="Words"
          rows={WORD_TARGETS.map((w) => ({
            label: `${w} words`,
            value: bestWpm(speed, "words", w),
          }))}
        />
      </div>
    </div>
  );
}
