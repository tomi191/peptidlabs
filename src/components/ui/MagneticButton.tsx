"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** How far the button tracks the cursor — default 8px max offset */
  strength?: number;
};

/**
 * Button / link with subtle magnetic cursor tracking — Stripe-style.
 * Gracefully disables on touch / small screens.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  strength = 8,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 15, mass: 0.3 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Slightly stronger offset on the inner content for depth
  const innerX = useTransform(springX, (v) => v * 0.5);
  const innerY = useTransform(springY, (v) => v * 0.5);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    // Respect touch devices — skip magnetic effect
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const inner = (
    <motion.span
      style={{ x: innerX, y: innerY, display: "inline-flex" }}
      className="items-center gap-2"
    >
      {children}
    </motion.span>
  );

  const Wrapper = href ? motion.a : motion.button;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, display: "inline-block" }}
    >
      <Wrapper
        href={href}
        onClick={onClick}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={className}
      >
        {inner}
      </Wrapper>
    </motion.div>
  );
}
