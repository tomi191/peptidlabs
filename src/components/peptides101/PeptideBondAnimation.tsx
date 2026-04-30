"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function PeptideBondAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-white p-6 md:p-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
        Как се образува пептидната връзка
      </p>
      <h3 className="font-display text-xl font-bold text-navy mb-6 tracking-[-0.02em]">
        Две аминокиселини се свързват, отделя се вода
      </h3>

      <svg viewBox="0 0 600 200" className="w-full h-auto" aria-hidden="true">
        <defs>
          <linearGradient id="aa1-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <linearGradient id="aa2-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
          <linearGradient id="water-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Amino acid 1 - left side */}
        <motion.g
          initial={{ x: 0 }}
          animate={inView ? { x: 90 } : {}}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <circle cx="80" cy="100" r="38" fill="url(#aa1-grad)" opacity="0.85" />
          <text
            x="80"
            y="106"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="white"
            fontFamily="system-ui"
          >
            АК 1
          </text>
          <text x="80" y="160" textAnchor="middle" fontSize="10" fill="#64748b">
            Глицин
          </text>
          {/* COOH group */}
          <text
            x="138"
            y="92"
            textAnchor="start"
            fontSize="12"
            fontFamily="monospace"
            fill="#0f766e"
            fontWeight="600"
          >
            COOH
          </text>
        </motion.g>

        {/* Amino acid 2 - right side */}
        <motion.g
          initial={{ x: 0 }}
          animate={inView ? { x: -90 } : {}}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <circle cx="520" cy="100" r="38" fill="url(#aa2-grad)" opacity="0.85" />
          <text
            x="520"
            y="106"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="white"
            fontFamily="system-ui"
          >
            АК 2
          </text>
          <text x="520" y="160" textAnchor="middle" fontSize="10" fill="#64748b">
            Аланин
          </text>
          {/* NH2 group */}
          <text
            x="462"
            y="92"
            textAnchor="end"
            fontSize="12"
            fontFamily="monospace"
            fill="#1e40af"
            fontWeight="600"
          >
            H2N
          </text>
        </motion.g>

        {/* Peptide bond - appears after merge */}
        <motion.line
          x1="208"
          y1="100"
          x2="392"
          y2="100"
          stroke="#0f172a"
          strokeWidth="2.5"
          strokeDasharray="5 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 2.2 }}
        />
        <motion.text
          x="300"
          y="80"
          textAnchor="middle"
          fontSize="11"
          fontFamily="monospace"
          fill="#0f172a"
          fontWeight="700"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 2.5 }}
        >
          C-N връзка
        </motion.text>

        {/* Water molecule - released */}
        <motion.g
          initial={{ y: 100, opacity: 0 }}
          animate={inView ? { y: 0, opacity: [0, 1, 1, 0] } : {}}
          transition={{ duration: 2, delay: 2.5, times: [0, 0.2, 0.7, 1] }}
        >
          <circle cx="300" cy="50" r="22" fill="url(#water-grad)" opacity="0.7" />
          <text
            x="300"
            y="56"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="white"
            fontFamily="monospace"
          >
            H2O
          </text>
        </motion.g>
      </svg>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
        <div className="rounded-lg bg-surface p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
            Стъпка 1
          </p>
          <p className="text-navy font-medium">
            Две аминокиселини се приближават
          </p>
        </div>
        <div className="rounded-lg bg-surface p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
            Стъпка 2
          </p>
          <p className="text-navy font-medium">
            COOH на едната среща NH2 на другата
          </p>
        </div>
        <div className="rounded-lg bg-surface p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
            Стъпка 3
          </p>
          <p className="text-navy font-medium">
            Образува се връзка, отделя се молекула вода
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm text-secondary leading-relaxed">
        Това се нарича <strong className="text-navy">кондензационна реакция</strong>.
        Точно тази единствена пептидна връзка е градивният елемент на всички
        пептиди и протеини в природата. Един пептид с 10 аминокиселини има 9 такива
        връзки, а един протеин с 300 аминокиселини има 299.
      </p>
    </div>
  );
}
