type Variant = "map" | "chart" | "certificate" | "diagram" | "avatar" | "grid";

type Props = {
  /** Visual style — choose one that fits the page context */
  variant: Variant;
  /** Label text baked into the placeholder (e.g. "Карта на доставките") */
  label?: string;
  /** Aspect / sizing — Tailwind class override */
  className?: string;
};

/**
 * Decorative lab-style placeholder used where a real asset
 * (photo, chart, map, illustration) will go later.
 * Deterministic SVG — renders on the server.
 */
export function PlaceholderVisual({ variant, label, className = "" }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface via-white to-surface ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Frame ticks */}
        <g stroke="#a8a29e" strokeWidth="1">
          <line x1="0" y1="0" x2="10" y2="0" />
          <line x1="0" y1="0" x2="0" y2="10" />
          <line x1="400" y1="0" x2="390" y2="0" />
          <line x1="400" y1="0" x2="400" y2="10" />
          <line x1="0" y1="300" x2="10" y2="300" />
          <line x1="0" y1="300" x2="0" y2="290" />
          <line x1="400" y1="300" x2="390" y2="300" />
          <line x1="400" y1="300" x2="400" y2="290" />
        </g>

        {/* Variant shapes */}
        {variant === "map" && (
          <g fill="none" stroke="#0d9488" strokeWidth="1" strokeOpacity="0.5">
            <path d="M40 180 Q 80 120 140 150 T 260 130 T 360 160" />
            <circle cx="80" cy="150" r="4" fill="#0d9488" />
            <circle cx="180" cy="140" r="6" fill="#0d9488" />
            <circle cx="260" cy="130" r="4" fill="#0d9488" />
            <circle cx="320" cy="155" r="5" fill="#0d9488" />
            <g stroke="#e7e5e4" strokeWidth="0.5">
              <line x1="0" y1="100" x2="400" y2="100" />
              <line x1="0" y1="200" x2="400" y2="200" />
              <line x1="100" y1="0" x2="100" y2="300" />
              <line x1="200" y1="0" x2="200" y2="300" />
              <line x1="300" y1="0" x2="300" y2="300" />
            </g>
          </g>
        )}

        {variant === "chart" && (
          <g>
            {/* HPLC-style peaks */}
            <g fill="none" stroke="#0d9488" strokeWidth="1.5">
              <path d="M20 250 L 80 250 L 120 80 L 140 250 L 200 250 L 230 200 L 250 250 L 380 250" />
            </g>
            <g stroke="#e7e5e4" strokeWidth="0.5">
              {[50, 100, 150, 200, 250].map((y) => (
                <line key={y} x1="20" y1={y} x2="380" y2={y} />
              ))}
            </g>
            <g fill="#78716c" fontFamily="monospace" fontSize="8">
              <text x="24" y="46">mAU</text>
              <text x="364" y="275">min</text>
            </g>
          </g>
        )}

        {variant === "certificate" && (
          <g>
            <rect
              x="80"
              y="50"
              width="240"
              height="200"
              fill="white"
              stroke="#e7e5e4"
              strokeWidth="1"
            />
            <rect x="100" y="70" width="120" height="8" fill="#0f172a" />
            <rect x="100" y="90" width="200" height="2" fill="#e7e5e4" />
            {[110, 125, 140, 155, 170, 185].map((y, i) => (
              <g key={i}>
                <rect
                  x="100"
                  y={y}
                  width="80"
                  height="3"
                  fill="#a8a29e"
                  opacity="0.5"
                />
                <rect
                  x="220"
                  y={y}
                  width="60"
                  height="3"
                  fill="#0d9488"
                  opacity="0.5"
                />
              </g>
            ))}
            <circle
              cx="290"
              cy="225"
              r="18"
              fill="none"
              stroke="#0d9488"
              strokeWidth="1.5"
            />
            <text
              x="290"
              y="229"
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="7"
              fill="#0d9488"
              fontWeight="bold"
            >
              COA
            </text>
          </g>
        )}

        {variant === "diagram" && (
          <g>
            <g stroke="#e7e5e4" strokeWidth="0.5">
              {Array.from({ length: 7 }, (_, i) => (
                <line
                  key={i}
                  x1={(i * 400) / 6}
                  y1="0"
                  x2={(i * 400) / 6}
                  y2="300"
                />
              ))}
              {Array.from({ length: 5 }, (_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={(i * 300) / 4}
                  x2="400"
                  y2={(i * 300) / 4}
                />
              ))}
            </g>
            <g stroke="#0d9488" strokeWidth="1.5" fill="none" strokeDasharray="3 3">
              <path d="M80 220 L 160 140 L 240 180 L 320 90" />
            </g>
            <g fill="#0f172a">
              <circle cx="80" cy="220" r="4" />
              <circle cx="160" cy="140" r="4" />
              <circle cx="240" cy="180" r="4" />
              <circle cx="320" cy="90" r="4" />
            </g>
          </g>
        )}

        {variant === "avatar" && (
          <g>
            <circle
              cx="200"
              cy="140"
              r="60"
              fill="#e7e5e4"
              stroke="#0d9488"
              strokeWidth="2"
            />
            <circle cx="200" cy="120" r="22" fill="#a8a29e" />
            <path
              d="M150 200 Q 200 160 250 200 L 250 230 L 150 230 Z"
              fill="#a8a29e"
            />
          </g>
        )}

        {variant === "grid" && (
          <g>
            {Array.from({ length: 4 }, (_, row) =>
              Array.from({ length: 6 }, (_, col) => {
                const x = 30 + col * 60;
                const y = 40 + row * 60;
                const seed = (row * 6 + col + 1) % 7;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={x}
                    y={y}
                    width="40"
                    height="40"
                    rx="4"
                    fill="white"
                    stroke="#e7e5e4"
                    strokeWidth="1"
                    opacity={seed < 3 ? 1 : 0.6}
                  />
                );
              }),
            )}
          </g>
        )}
      </svg>

      {/* Label */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {label || "Placeholder"}
        </span>
      </div>
      <div className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest text-muted">
        PEPTIDLABS · VISUAL
      </div>
    </div>
  );
}
