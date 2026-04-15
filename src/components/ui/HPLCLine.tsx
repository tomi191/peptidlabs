import type { CSSProperties } from "react";

type Props = {
  variant?: "full" | "short";
  className?: string;
};

export function HPLCLine({ variant = "full", className = "" }: Props) {
  const ticks = variant === "full" ? 12 : 5;
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <div
        className="flex items-end gap-[calc((100%-1px)/var(--ticks,12))]"
        style={{ ["--ticks" as string]: ticks } as CSSProperties}
      >
        {Array.from({ length: ticks }).map((_, i) => (
          <div
            key={i}
            className="w-px bg-navy/30"
            style={{
              height: i % 3 === 0 ? "12px" : i % 2 === 0 ? "8px" : "4px",
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-navy/20" />
    </div>
  );
}
