"use client";

import type { ReactNode } from "react";

type ShinyTextProps = {
  children: ReactNode;
  className?: string;
  /** Base text color. Default navy. */
  color?: string;
  /** Shine color. Default soft teal. */
  shine?: string;
  /** Animation duration in seconds. Default 4. */
  speed?: number;
};

/**
 * ShinyText — react-bits-style text with a shimmer highlight sweeping through.
 * The base color is the resting tint; `shine` is the highlight that travels
 * across the text every `speed` seconds.
 */
export function ShinyText({
  children,
  className,
  color = "#0f172a",
  shine = "rgba(20, 184, 166, 0.95)",
  speed = 4,
}: ShinyTextProps) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className ?? ""}`}
      style={{
        backgroundImage: `linear-gradient(110deg, ${color} 0%, ${color} 42%, ${shine} 50%, ${color} 58%, ${color} 100%)`,
        backgroundSize: "250% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: `pl-shimmer ${speed}s linear infinite`,
      }}
    >
      {children}
    </span>
  );
}
