/**
 * PeptidLabs brand mark.
 *
 * Two parts:
 *   - <LogoMark> — the standalone monogram (favicon, app icon, social avatar)
 *   - <Logo>     — full lockup: mark + "PEPTIDLABS" wordmark for header use
 *
 * Pure SVG. Crisp at any size. No raster dependency.
 */

type LogoMarkProps = {
  className?: string;
  size?: number;
  /** Render with explicit theme tokens for environments without CSS vars (e.g. ImageResponse). */
  hardcoded?: boolean;
};

export function LogoMark({ className, size = 32, hardcoded }: LogoMarkProps) {
  const navy = hardcoded ? "#0f172a" : "var(--color-navy, #0f172a)";
  const teal = hardcoded ? "#14b8a6" : "var(--color-accent, #14b8a6)";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
    >
      {/* Rounded navy plate */}
      <rect width="64" height="64" rx="14" fill={navy} />
      {/* Geometric P — letter + peptide-bond styling */}
      <path
        d="M 22 16 V 48 M 22 16 H 35 a 9 9 0 0 1 0 18 H 22"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Teal molecular accent — connected via subtle bond hint */}
      <line
        x1="36"
        y1="42"
        x2="44"
        y2="46"
        stroke={teal}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="46" cy="46" r="4" fill={teal} />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  /** Mark size in px. Wordmark scales with surrounding font. */
  markSize?: number;
};

export function Logo({ className, markSize = 32 }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark size={markSize} />
      <span className="font-semibold tracking-[0.18em] text-navy text-sm">
        PEPTIDLABS
      </span>
    </span>
  );
}
