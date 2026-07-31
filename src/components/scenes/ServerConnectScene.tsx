interface SceneProps {
  progress: number;
  done?: boolean;
  correct?: boolean;
  className?: string;
}

const CLAMP = (p: number) => Math.max(0, Math.min(1, p));

const LINES = [
  "$ nodemon app.js",
  "[nodemon] starting due to changes...",
  "server running at http://localhost:3000",
  "listening on postgres:5432...",
] as const;

export default function ServerConnectScene({
  progress,
  done = false,
  correct = false,
  className = "",
}: SceneProps) {
  const p = CLAMP(progress);
  const connected = done && correct;
  const visibleCount = done
    ? LINES.length
    : Math.min(LINES.length, 1 + Math.floor(p / 0.25));
  const bootDelay = LINES.length * 0.1;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-edge/70 bg-surface px-5 py-4 font-mono text-[13px] leading-relaxed ${className}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-bad/70" />
        <span
          className="h-2.5 w-2.5 rounded-full opacity-70"
          style={{ background: "var(--sd-warn)" }}
        />
        <span className="h-2.5 w-2.5 rounded-full bg-good/70" />
        <span className="ml-2 text-[11px] text-muted">
          syntaxdrill → postgres:5432
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        {LINES.slice(0, visibleCount).map((line, i) => (
          <div
            key={line}
            className={`whitespace-pre-wrap text-muted ${
              done ? "sd-rise" : ""
            }`}
            style={done ? { animationDelay: `${i * 0.1}s` } : undefined}
          >
            {line}
            {!done && i === visibleCount - 1 && (
              <span className="caret-bar ml-0.5" aria-hidden />
            )}
          </div>
        ))}
        {done && (
          <div
            className={`sd-rise flex items-center gap-2 ${
              connected ? "text-good" : "text-bad"
            }`}
            style={{ animationDelay: `${bootDelay}s` }}
          >
            <span aria-hidden>{connected ? "✅" : "❌"}</span>
            <span className="font-semibold">
              {connected
                ? "connected to database"
                : "connection refused · postgres:5432"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
