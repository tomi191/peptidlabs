"use client";

import { motion, LayoutGroup } from "motion/react";
import type { ReactNode } from "react";

type PillItem = {
  key: string;
  label: ReactNode;
  /** Optional badge — small count or accent shown next to label. */
  badge?: ReactNode;
};

type PillNavProps = {
  items: PillItem[];
  active: string;
  onChange: (key: string) => void;
  /** Unique id for the layout group — required when multiple PillNavs exist on the same page. */
  layoutId?: string;
  className?: string;
};

/**
 * PillNav — react-bits-style segmented control where the active pill background
 * morphs smoothly between options via Framer Motion `layoutId`.
 */
export function PillNav({
  items,
  active,
  onChange,
  layoutId = "pill-nav",
  className,
}: PillNavProps) {
  return (
    <LayoutGroup id={layoutId}>
      <div
        role="tablist"
        className={`relative inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-surface/60 p-1 ${className ?? ""}`}
      >
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(item.key)}
              className="relative isolate inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            >
              {/* Morphing active background */}
              {isActive && (
                <motion.span
                  layoutId={`${layoutId}-pill`}
                  className="absolute inset-0 -z-10 rounded-full bg-navy"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span
                className={`transition-colors ${
                  isActive ? "text-white" : "text-secondary hover:text-navy"
                }`}
              >
                {item.label}
              </span>
              {item.badge != null && (
                <span
                  className={`font-mono text-[10px] transition-colors ${
                    isActive ? "text-white/70" : "text-muted"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
