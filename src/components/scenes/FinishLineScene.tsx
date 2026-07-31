interface SceneProps {
  progress: number;
  className?: string;
}

const CLAMP = (p: number) => Math.max(0, Math.min(1, p));

export default function FinishLineScene({ progress, className = "" }: SceneProps) {
  const p = CLAMP(progress);
  const done = p >= 1;
  const runnerX = 28 + p * 322;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-edge/70 bg-surface px-5 py-4 ${className}`}
    >
      <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        <span>Finish line</span>
        <span className="tabular-nums">{Math.round(p * 100)}%</span>
      </div>
      <svg viewBox="0 0 400 90" className="w-full" role="img" aria-label="Runner approaching finish line">
        <line x1="0" y1="28" x2="400" y2="28" stroke="var(--sd-border)" strokeDasharray="3 7" />
        <line x1="0" y1="62" x2="400" y2="62" stroke="var(--sd-border)" strokeDasharray="3 7" />
        <g>
          <rect x="356" y="8" width="5" height="62" fill="var(--sd-muted)" />
          <rect x="361" y="8" width="22" height="14" fill={done ? "var(--sd-good)" : "var(--sd-border)"} />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={361 + (i % 4) * 5.5}
              y={8 + Math.floor(i / 2) * 7}
              width="5.5"
              height="7"
              fill={done ? (i % 2 === 0 ? "var(--sd-bg)" : "var(--sd-good)") : i % 2 === 0 ? "var(--sd-raised)" : "var(--sd-border)"}
            />
          ))}
          <text x="350" y="90" textAnchor="end" fontSize="11" fill="var(--sd-muted)" style={{ letterSpacing: "0.2em" }}>
            FINISH
          </text>
        </g>
        <g transform={`translate(${runnerX} 58)`}>
          <circle r="16" fill="var(--sd-glow)" />
          <circle r="6.5" fill="var(--sd-accent)" />
        </g>
      </svg>
    </div>
  );
}
