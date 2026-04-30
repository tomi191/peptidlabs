import Image from "next/image";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const MARK_URL = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public/product-images/brand/mark.png`
  : null;

type LogoMarkProps = {
  className?: string;
  size?: number;
  /** Pass a hex like "#0f172a" to render a fallback inline SVG (used by ImageResponse / Satori, which cannot fetch remote images). */
  fallbackColor?: string;
};

/**
 * PeptidLabs brand mark. Renders the AI-generated pharma-style logo image
 * from Supabase Storage. Falls back to an inline SVG identity for environments
 * that cannot load remote PNGs (favicon generators, ImageResponse, etc.).
 */
export function LogoMark({ className, size = 32, fallbackColor }: LogoMarkProps) {
  if (!MARK_URL || fallbackColor) {
    return <FallbackMark className={className} size={size} navy={fallbackColor ?? "#0f172a"} />;
  }
  return (
    <Image
      src={MARK_URL}
      alt="PeptidLabs"
      width={size}
      height={size}
      priority
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

/** SVG-only identity — abstract molecular hexagon with a teal center dot.
 *  Used by favicon, ImageResponse, and any context that cannot load remote images. */
export function FallbackMark({
  className,
  size = 32,
  navy = "#0f172a",
  teal = "#14b8a6",
}: {
  className?: string;
  size?: number;
  navy?: string;
  teal?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
    >
      {/* Hexagonal molecular frame */}
      <g
        fill="none"
        stroke={navy}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="32,10 50,21 50,43 32,54 14,43 14,21" />
      </g>
      {/* 4 outlined nodes at hex vertices */}
      <g fill="#fff" stroke={navy} strokeWidth="3">
        <circle cx="32" cy="10" r="4" />
        <circle cx="50" cy="21" r="4" />
        <circle cx="50" cy="43" r="4" />
        <circle cx="14" cy="43" r="4" />
      </g>
      {/* Teal accent center — peptide bond hub */}
      <circle cx="32" cy="32" r="5.5" fill={teal} />
    </svg>
  );
}
