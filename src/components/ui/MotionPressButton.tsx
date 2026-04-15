"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";

/**
 * Primary button with spring-physics press feedback.
 * Semantic meaning: confirms the click landed before any async work.
 */
export const MotionPressButton = forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button">
>(function MotionPressButton(props, ref) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      {...props}
    />
  );
});
