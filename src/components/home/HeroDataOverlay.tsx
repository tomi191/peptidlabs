"use client";

/* HeroDataOverlay — animated SVG that adds science-y data visualization to hero
   background. Two layers:
   1. HPLC chromatogram peaks drawing themselves on scroll-into-view
   2. Floating peptide chain dots connecting in fluid motion (subtle, decorative) */

import { motion, useReducedMotion } from "motion/react";

export function HeroDataOverlay() {
  const reduced = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 hidden md:block"
      aria-hidden="true"
    >
      {/* HPLC chromatogram — bottom-right */}
      <div className="absolute bottom-8 right-6 w-[340px] opacity-50 lg:w-[400px]">
        <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.25em] text-accent">
          HPLC · BPC-157 · over 99% purity
        </p>
        <svg viewBox="0 0 400 80" className="w-full">
          {/* Baseline grid */}
          <line
            x1="0"
            y1="70"
            x2="400"
            y2="70"
            stroke="#0d9488"
            strokeWidth="0.4"
            strokeDasharray="2 4"
            opacity="0.4"
          />
          {[10, 30, 50].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="400"
              y2={y}
              stroke="#0d9488"
              strokeWidth="0.3"
              strokeDasharray="1 3"
              opacity="0.18"
            />
          ))}
          {/* Tick marks on x-axis */}
          {[50, 100, 150, 200, 250, 300, 350].map((x) => (
            <line
              key={x}
              x1={x}
              y1="68"
              x2={x}
              y2="72"
              stroke="#0d9488"
              strokeWidth="0.5"
              opacity="0.4"
            />
          ))}

          {/* Chromatogram peaks — animated stroke */}
          <motion.path
            d="M0 70 L 30 70 Q 40 70 50 60 L 60 70 L 110 70 Q 130 65 140 25 Q 150 5 160 25 Q 170 65 180 70 L 230 70 Q 245 68 250 50 L 255 70 L 310 70 Q 320 70 330 55 L 340 70 L 400 70"
            fill="none"
            stroke="#0d9488"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.6,
            }}
          />
          {/* Main peak label callout */}
          <motion.g
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.4 }}
          >
            <line
              x1="150"
              y1="22"
              x2="150"
              y2="10"
              stroke="#0d9488"
              strokeWidth="0.5"
              opacity="0.6"
            />
            <text
              x="150"
              y="6"
              textAnchor="middle"
              fontSize="6"
              fill="#0d9488"
              fontFamily="monospace"
              fontWeight="600"
            >
              99.4%
            </text>
          </motion.g>
        </svg>
      </div>

      {/* Floating peptide chain — top-right, subtle */}
      <svg
        viewBox="0 0 200 100"
        className="absolute right-12 top-12 hidden h-20 w-40 opacity-30 lg:block"
        aria-hidden="true"
      >
        {/* Connector lines */}
        <motion.line
          x1="20"
          y1="50"
          x2="60"
          y2="30"
          stroke="#0d9488"
          strokeWidth="0.8"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        />
        <motion.line
          x1="60"
          y1="30"
          x2="100"
          y2="60"
          stroke="#0d9488"
          strokeWidth="0.8"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        />
        <motion.line
          x1="100"
          y1="60"
          x2="140"
          y2="35"
          stroke="#0d9488"
          strokeWidth="0.8"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
        />
        <motion.line
          x1="140"
          y1="35"
          x2="180"
          y2="55"
          stroke="#0d9488"
          strokeWidth="0.8"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        />

        {/* Amino acid nodes */}
        {[
          { cx: 20, cy: 50, label: "G", delay: 1.0 },
          { cx: 60, cy: 30, label: "H", delay: 1.3 },
          { cx: 100, cy: 60, label: "K", delay: 1.5 },
          { cx: 140, cy: 35, label: "L", delay: 1.7 },
          { cx: 180, cy: 55, label: "P", delay: 1.9 },
        ].map((node) => (
          <motion.g
            key={node.label}
            initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: node.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <circle
              cx={node.cx}
              cy={node.cy}
              r="6"
              fill="white"
              stroke="#0d9488"
              strokeWidth="1"
            />
            <text
              x={node.cx}
              y={node.cy + 2.5}
              textAnchor="middle"
              fontSize="6"
              fontFamily="monospace"
              fontWeight="600"
              fill="#0d9488"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* Floating data labels — left side */}
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, x: -20 }}
        animate={{ opacity: 0.45, x: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute left-6 top-32 hidden font-mono text-[10px] uppercase tracking-widest text-accent lg:block"
      >
        <div>m/z 1419.5</div>
        <div className="mt-1 text-muted">retention 8.3 min</div>
      </motion.div>
    </div>
  );
}
