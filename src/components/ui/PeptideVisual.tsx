"use client";

/**
 * PeptideVisual — deterministic molecular "fingerprint" generated from a slug.
 * Each peptide gets a unique abstract SVG: 4-6 nodes connected by bonds, with
 * one teal "active site" node. Same slug always produces the same image.
 *
 * No AI / no remote assets — pure SVG math, sub-millisecond render.
 */

type Props = {
  slug: string;
  /** Display label inside the visual (peptide initials). */
  label?: string;
  size?: number;
  className?: string;
};

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Pseudo-random in [0, 1) seeded from a 32-bit integer. Mulberry32. */
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function PeptideVisual({
  slug,
  label,
  size = 96,
  className,
}: Props) {
  const seed = hash(slug);
  const rand = mulberry32(seed);

  // 4-6 nodes arranged on a soft circular orbit, jittered for organic feel
  const nodeCount = 4 + Math.floor(rand() * 3); // 4..6
  const cx = 50;
  const cy = 50;
  const orbit = 26;
  const nodes: Array<{ x: number; y: number }> = [];
  const startAngle = rand() * Math.PI * 2;

  for (let i = 0; i < nodeCount; i++) {
    const a = startAngle + (i * Math.PI * 2) / nodeCount;
    const r = orbit + (rand() - 0.5) * 8; // slight orbit jitter
    nodes.push({
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r,
    });
  }

  // Active site index — the teal node
  const activeIdx = Math.floor(rand() * nodeCount);

  // Hue tint for the gradient backdrop (subtle warm/cool variation per peptide)
  const hue = Math.floor(rand() * 360);

  // Build edges — sequential ring + 1-2 random cross bonds for variety
  const edges: Array<[number, number]> = [];
  for (let i = 0; i < nodeCount; i++) {
    edges.push([i, (i + 1) % nodeCount]);
  }
  // 1 cross bond
  if (nodeCount >= 5) {
    const a = Math.floor(rand() * nodeCount);
    const b = (a + 2 + Math.floor(rand() * (nodeCount - 3))) % nodeCount;
    edges.push([a, b]);
  }

  const initials = (label ?? slug.split("-")[0])
    .toUpperCase()
    .slice(0, 4);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl ring-1 ring-border ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, hsl(${hue} 35% 96%), #fafaf9 70%)`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bonds */}
        <g stroke="#0f172a" strokeWidth="1.4" strokeLinecap="round" opacity="0.55">
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
            />
          ))}
        </g>
        {/* Nodes */}
        <g>
          {nodes.map((n, i) => (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={i === activeIdx ? 4.5 : 3}
              fill={i === activeIdx ? "#14b8a6" : "#fff"}
              stroke="#0f172a"
              strokeWidth={i === activeIdx ? 0 : 1.6}
            />
          ))}
        </g>
      </svg>
      {/* Initials overlay */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="rounded-md bg-white/85 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-navy backdrop-blur-sm ring-1 ring-border">
          {initials}
        </span>
      </span>
    </div>
  );
}
