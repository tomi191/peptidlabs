import { ShieldCheck } from "lucide-react";

type Props = {
  variant?: "inline" | "overlay";
  className?: string;
};

/**
 * COA (Certificate of Analysis) badge.
 * - `overlay`: stamped-certificate treatment for product image areas.
 * - `inline`:  compact variant for tight rows.
 */
export function COABadge({ variant = "inline", className = "" }: Props) {
  if (variant === "overlay") {
    return (
      <div
        className={`flex items-center gap-1.5 rounded-full border border-accent-border bg-accent-tint px-2.5 py-1 ${className}`}
      >
        <div className="relative">
          <ShieldCheck size={12} className="text-accent" />
          <span className="absolute -top-0.5 -right-0.5 block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        </div>
        <span className="font-mono text-[10px] font-semibold tracking-wider text-accent">
          COA VERIFIED
        </span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[10px] font-semibold tracking-wider text-accent ${className}`}
    >
      <ShieldCheck size={10} />
      COA
    </span>
  );
}
