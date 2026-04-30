type Props = {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  xs: { w: 22, h: 58 },
  sm: { w: 36, h: 96 },
  md: { w: 56, h: 140 },
  lg: { w: 80, h: 200 },
} as const;

/**
 * Stylized vial illustration for product placeholders.
 * Used until real product photography is available.
 * Pure Server Component — deterministic SVG output.
 */
export function VialPlaceholder({ name, size = "md", className = "" }: Props) {
  const { w, h } = SIZES[size];
  const labelText = name.length > 10 ? name.slice(0, 10) : name;
  const gradientId = `vial-glass-${size}`;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      {/* Background watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.035]">
        <span className="rotate-[-18deg] whitespace-nowrap font-mono text-6xl font-bold uppercase tracking-tight text-navy">
          {name}
        </span>
      </div>

      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#f0fdfa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Vial cap (navy crimped top) */}
        <rect
          x={w * 0.22}
          y={0}
          width={w * 0.56}
          height={h * 0.085}
          rx="1.5"
          fill="#0f172a"
        />
        {/* Cap ridge detail */}
        <line
          x1={w * 0.22}
          y1={h * 0.045}
          x2={w * 0.78}
          y2={h * 0.045}
          stroke="#1e293b"
          strokeWidth="0.6"
        />

        {/* Neck */}
        <rect
          x={w * 0.3}
          y={h * 0.085}
          width={w * 0.4}
          height={h * 0.06}
          fill="#475569"
        />
        <rect
          x={w * 0.28}
          y={h * 0.145}
          width={w * 0.44}
          height={h * 0.025}
          fill="#64748b"
        />

        {/* Body */}
        <rect
          x={w * 0.12}
          y={h * 0.17}
          width={w * 0.76}
          height={h * 0.8}
          rx={w * 0.06}
          fill={`url(#${gradientId})`}
          stroke="#e7e5e4"
          strokeWidth="0.8"
        />

        {/* Label background */}
        <rect
          x={w * 0.16}
          y={h * 0.36}
          width={w * 0.68}
          height={h * 0.26}
          fill="white"
          opacity="0.85"
          stroke="#f5f5f4"
          strokeWidth="0.4"
        />

        {/* Label decorative line */}
        <line
          x1={w * 0.2}
          y1={h * 0.42}
          x2={w * 0.8}
          y2={h * 0.42}
          stroke="#0d9488"
          strokeWidth="0.5"
          strokeOpacity="0.6"
        />

        {/* Peptide name on label */}
        <text
          x={w / 2}
          y={h * 0.5}
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize={Math.max(6, w * 0.1)}
          fontWeight="700"
          textAnchor="middle"
          fill="#0f172a"
          letterSpacing="-0.02em"
        >
          {labelText}
        </text>

        {/* HPLC tick line on label */}
        <text
          x={w / 2}
          y={h * 0.58}
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize={Math.max(4, w * 0.06)}
          fontWeight="500"
          textAnchor="middle"
          fill="#0d9488"
          letterSpacing="0.1em"
        >
          над 98% HPLC
        </text>

        {/* Lyophilized powder at bottom */}
        <rect
          x={w * 0.18}
          y={h * 0.78}
          width={w * 0.64}
          height={h * 0.16}
          rx={w * 0.04}
          fill="#fafaf9"
          stroke="#e7e5e4"
          strokeWidth="0.4"
        />

        {/* Subtle highlight on vial edge */}
        <rect
          x={w * 0.15}
          y={h * 0.2}
          width={w * 0.04}
          height={h * 0.75}
          rx="1"
          fill="white"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
