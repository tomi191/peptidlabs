"use client";

import { useRef, type ReactNode } from "react";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Spotlight color (CSS color). Default teal. */
  color?: string;
  /** Spotlight radius in px. Default 180. */
  radius?: number;
  /** Spotlight opacity (0..1). Default 0.18. */
  opacity?: number;
};

/**
 * SpotlightCard — react-bits-style radial cursor highlight overlay.
 * Tracks pointer position relative to the card and renders a soft radial
 * gradient that follows it. Compose around any card content.
 */
export function SpotlightCard({
  children,
  className,
  color = "rgba(13, 148, 136, 1)",
  radius = 180,
  opacity = 0.18,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--sy", `${e.clientY - rect.top}px`);
    el.style.setProperty("--so", String(opacity));
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--so", "0");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`group/spotlight relative isolate ${className ?? ""}`}
      style={
        {
          ["--so" as string]: "0",
        } as React.CSSProperties
      }
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(${radius}px circle at var(--sx, 50%) var(--sy, 50%), ${color}, transparent 60%)`,
          opacity: "var(--so)",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
