interface StatChipProps {
  label: string;
  value: string;
  accent?: boolean;
}

export default function StatChip({ label, value, accent = false }: StatChipProps) {
  return (
    <div className="flex min-w-[92px] flex-col items-center gap-0.5 px-4 py-3">
      <div
        className={`font-mono text-xl font-semibold tabular-nums ${
          accent ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </div>
    </div>
  );
}
