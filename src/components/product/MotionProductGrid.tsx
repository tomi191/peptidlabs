"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function MotionProductGrid({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.04 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionProductItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 120, damping: 18 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
