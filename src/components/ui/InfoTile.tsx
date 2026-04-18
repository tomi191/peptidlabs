import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  icon?: LucideIcon;
  /** Optional 2-digit label shown in top-right (e.g. "01") */
  index?: string;
  title: string;
  body: ReactNode;
  accent?: boolean;
};

/**
 * Consistent info card used in feature grids across the site.
 * Used on: about, delivery, faq, guides, calculator tips, etc.
 */
export function InfoTile({ icon: Icon, index, title, body, accent }: Props) {
  return (
    <div
      className={`relative rounded-xl border p-5 transition-colors ${
        accent
          ? "border-teal-200 bg-teal-50/50"
          : "border-border bg-white hover:border-navy/30"
      }`}
    >
      {index && (
        <p className="absolute top-4 right-4 font-mono text-[10px] text-muted tabular">
          {index}
        </p>
      )}
      {Icon && (
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
            accent ? "bg-white text-teal-700" : "bg-surface text-navy"
          }`}
        >
          <Icon size={18} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="font-semibold text-navy text-sm">{title}</h3>
      <div className="mt-2 text-xs text-secondary leading-relaxed">{body}</div>
    </div>
  );
}
