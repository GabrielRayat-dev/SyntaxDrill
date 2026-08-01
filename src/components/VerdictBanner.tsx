interface VerdictBannerProps {
  good: boolean;
  title: string;
  subtitle: string;
}

export default function VerdictBanner({
  good,
  title,
  subtitle,
}: VerdictBannerProps) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        good ? "border-good/50 bg-good/10" : "border-warn/50 bg-warn/10"
      }`}
    >
      <p className={`text-sm font-semibold ${good ? "text-good" : "text-warn"}`}>
        {good ? "✓ " : "✗ "}
        {title}
      </p>
      <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
    </div>
  );
}
