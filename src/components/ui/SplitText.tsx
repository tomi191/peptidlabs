"use client";

import { motion, useReducedMotion } from "motion/react";

type SplitTextProps = {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
};

const wordVariants = {
  hidden: { opacity: 0, y: "0.5em" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 220, damping: 24 },
  },
};

/**
 * SplitText — react-bits-style word-by-word reveal with blur-in.
 * Preserves \n line breaks. Respects prefers-reduced-motion.
 */
export function SplitText({
  text,
  className,
  stagger = 0.06,
  delay = 0.1,
}: SplitTextProps) {
  const reduced = useReducedMotion();

  if (reduced) return <span className={className}>{text}</span>;

  const lines = text.split("\n");

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {lines.map((line, lineIdx) => {
        const words = line.split(/\s+/).filter(Boolean);
        return (
          <span key={lineIdx} className="block">
            {words.map((word, wIdx) => (
              <motion.span
                key={`${lineIdx}-${wIdx}`}
                variants={wordVariants}
                className="inline-block will-change-transform"
                style={{ marginRight: "0.25em" }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        );
      })}
    </motion.span>
  );
}
