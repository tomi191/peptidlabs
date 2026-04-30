"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

type MagnetProps = {
  children: ReactNode;
  className?: string;
  /** How strongly the element is pulled toward the cursor (0..1). Default 0.3. */
  strength?: number;
  /** Pixel radius around the element where the magnet activates. Default 80. */
  radius?: number;
  asChild?: boolean;
};

/**
 * Magnet — react-bits-style hover effect where the element is gently pulled
 * toward the cursor when within `radius` pixels. Uses springs for organic motion.
 * Respects prefers-reduced-motion.
 */
export function Magnet({
  children,
  className,
  strength = 0.3,
  radius = 80,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > radius + Math.max(rect.width, rect.height) / 2) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
