interface SceneProps {
  progress: number;
  className?: string;
}

const CLAMP = (p: number) => Math.max(0, Math.min(1, p));

const STAGES = [
  { name: "Resolving host", at: 0 },
  { name: "Opening socket", at: 0.22 },
  { name: "TLS handshake", at: 0.44 },
  { name: "Authenticating", at: 0.66 },
  { name: "Streaming rows", at: 0.88 },
] as const;

type StageStatus = "waiting" | "active" | "done";

function stageStatus(progress: number, at: number): StageStatus {
  if (progress >= at + 0.22) return "done";
  if (progress >= at) return "active";
  return "waiting";
}

export default function ServerConnectScene({ progress, className = "" }: SceneProps) {
  const p = CLAMP(progress);
  const connected = p >= 1;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-edge/70 bg-[#0e1116] px-5 py-4 font-mono text-[13px] leading-relaxed ${className}`}
      style={{ background: "var(--sd-surface)" }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-bad/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-good/70" />
        <span className="ml-2 text-[11px] text-muted">syntaxdrill → postgres:5432</span>
      </div>

      <div className="flex flex-col gap-1">
        {STAGES.map((stage, i) => {
          const status = stageStatus(p, stage.at);
          return (
            <div key={stage.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {status === "done" && <span className="text-good">✓</span>}
                {status === "active" && (
                  <span className="text-accent">
                    <span className="sd-dot">·</span>
                    <span className="sd-dot">·</span>
                    <span className="sd-dot">·</span>
                  </span>
                )}
                {status === "waiting" && <span className="text-muted/60">○</span>}
                <span
                  className={
                    status === "done"
                      ? "text-good"
                      : status === "active"
                        ? "text-accent"
                        : "text-muted/70"
                  }
                >
                  {stage.name}
                </span>
              </span>
              <span className="text-[11px] text-muted/60 tabular-nums">
                {status === "done" ? `${i + 1}ms` : status === "active" ? "connecting" : "—"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-raised">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-150 ease-out"
          style={{ width: `${p * 100}%` }}
        />
      </div>

      {connected && (
        <div className="mt-3 text-good">
          ✓ Connected — ready for queries
        </div>
      )}
    </div>
  );
}
