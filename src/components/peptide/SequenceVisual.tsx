"use client";
import { useMemo } from "react";

type Props = {
  /** Amino acid sequence, chemical formula, or any string used as seed */
  sequence: string | null;
  size?: number;
  className?: string;
};

/**
 * Generates a stylized visualization from a peptide sequence or formula.
 * Not a real molecular structure — an aesthetic signature, deterministic
 * per input so every peptide gets a unique visual identity.
 */
export function SequenceVisual({ sequence, size = 240, className = "" }: Props) {
  const path = useMemo(() => {
    if (!sequence) return null;
    // Strip everything except letters; fall back to alphanumerics if empty.
    let chars = sequence.replace(/[^A-Za-z]/g, "").toUpperCase().split("");
    if (chars.length === 0) {
      chars = sequence.replace(/[^A-Za-z0-9]/g, "").toUpperCase().split("");
    }
    if (chars.length === 0) return null;

    // Cap at 20 nodes so longer sequences still look clean.
    const capped = chars.slice(0, 20);

    const nodes = capped.map((ch, i) => {
      const code = ch.charCodeAt(0);
      const angle = (i / capped.length) * Math.PI * 2 - Math.PI / 2;
      const radiusBase = size * 0.32;
      const variance = ((code % 7) / 7) * size * 0.1;
      const radius = radiusBase + variance;
      return {
        x: size / 2 + Math.cos(angle) * radius,
        y: size / 2 + Math.sin(angle) * radius,
        char: ch,
        size: 5 + (code % 3),
      };
    });

    const pathD =
      nodes
        .map(
          (n, i) =>
            `${i === 0 ? "M" : "L"} ${n.x.toFixed(1)} ${n.y.toFixed(1)}`
        )
        .join(" ") + " Z";

    return { nodes, pathD };
  }, [sequence, size]);

  if (!path) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
    >
      {/* Outer frame — lab-card aesthetic */}
      <rect
        x={0.5}
        y={0.5}
        width={size - 1}
        height={size - 1}
        fill="none"
        stroke="#f5f5f4"
        strokeWidth="1"
      />
      {/* Corner ticks */}
      {[
        [0, 0, 8, 0, 0, 8],
        [size, 0, -8, 0, 0, 8],
        [0, size, 8, 0, 0, -8],
        [size, size, -8, 0, 0, -8],
      ].map(([x, y, dx1, dy1, dx2, dy2], i) => (
        <g key={i} stroke="#a8a29e" strokeWidth="1">
          <line x1={x} y1={y} x2={x + dx1} y2={y + dy1} />
          <line x1={x} y1={y} x2={x + dx2} y2={y + dy2} />
        </g>
      ))}
      {/* Center crosshair */}
      <g stroke="#f5f5f4" strokeWidth="1">
        <line x1={size / 2} y1={size * 0.3} x2={size / 2} y2={size * 0.7} />
        <line x1={size * 0.3} y1={size / 2} x2={size * 0.7} y2={size / 2} />
      </g>

      {/* Connecting path */}
      <path
        d={path.pathD}
        fill="none"
        stroke="#0d9488"
        strokeWidth="1"
        strokeOpacity="0.4"
        strokeDasharray="2 2"
      />

      {/* Nodes */}
      {path.nodes.map((node, i) => (
        <g key={i}>
          <circle
            cx={node.x}
            cy={node.y}
            r={node.size}
            fill="#0f172a"
            stroke="#0d9488"
            strokeWidth="1.5"
          />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="6"
            fontFamily="var(--font-mono)"
            fill="white"
            style={{ userSelect: "none" }}
          >
            {node.char}
          </text>
        </g>
      ))}
    </svg>
  );
}
