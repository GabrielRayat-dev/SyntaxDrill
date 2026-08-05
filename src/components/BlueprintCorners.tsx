export default function BlueprintCorners() {
  return (
    <div className="signal-blueprint" aria-hidden="true">
      {["tl", "tr", "bl", "br"].map((corner) => (
        <svg
          key={corner}
          className={`signal-blueprint-cross signal-blueprint-cross--${corner}`}
          viewBox="0 0 16 16"
          focusable="false"
        >
          <path d="M8 1.5 V14.5 M1.5 8 H14.5" />
        </svg>
      ))}
    </div>
  );
}
