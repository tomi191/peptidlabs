"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

type TiltedCardProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. Default 8. */
  intensity?: number;
  /** Lift Z translation on hover (px). Default 0 (none). */
  lift?: number;
  /** Add a subtle gloss highlight that follows the cursor. Default false. */
  gloss?: boolean;
};

/**
 * TiltedCard — react-bits-style 3D tilt-on-hover wrapper.
 * Tracks mouse position over the card and rotates around X/Y in 3D space.
 * Respects prefers-reduced-motion.
 */
export function TiltedCard({
  children,
  className,
  intensity = 8,
  lift = 0,
  gloss = false,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotX = useSpring(useTransform(mouseY, (v) => -v * intensity), {
    stiffness: 220,
    damping: 22,
  });
  const rotY = useSpring(useTransform(mouseX, (v) => v * intensity), {
    stiffness: 220,
    damping: 22,
  });
  const z = useSpring(useTransform(mouseX, (v) => (v === 0 ? 0 : lift)), {
    stiffness: 220,
    damping: 22,
  });

  // Gloss highlight position (0..100%)
  const glossX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glossY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Normalize -0.5..0.5 from card center
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX: rotX,
          rotateY: rotY,
          translateZ: z,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full"
      >
        {children}
        {gloss && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
            style={{
              background: "radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,0.35), transparent 40%)",
              ["--gx" as string]: glossX,
              ["--gy" as string]: glossY,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
