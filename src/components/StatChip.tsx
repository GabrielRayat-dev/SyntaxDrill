interface StatChipProps {
  label: string;
  value: string;
  accent?: boolean;
}

export default function StatChip({ label, value, accent = false }: StatChipProps) {
  return (
    <div className="flex min-w-[92px] flex-col items-center gap-0.5 rounded-xl border border-edge/70 bg-surface px-4 py-3">
      <span
        className={`font-mono text-xl font-semibold tabular-nums ${
          accent ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
    </div>
  );
}
