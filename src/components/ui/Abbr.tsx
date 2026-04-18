import { getAbbreviation } from "@/lib/abbreviations";

type Props = {
  /** The short form displayed (e.g. "HPLC") */
  term: string;
  /** Override the auto-lookup with an explicit explanation */
  explanation?: string;
  locale?: string;
  className?: string;
};

/**
 * Inline abbreviation with a native browser tooltip.
 * Renders a dotted underline so users know the term is explainable.
 * Works on desktop hover and screen readers; on touch devices a long-press
 * typically surfaces the title attribute.
 */
export function Abbr({ term, explanation, locale = "bg", className = "" }: Props) {
  const text = explanation ?? getAbbreviation(term, locale);
  if (!text) return <>{term}</>;
  return (
    <abbr
      title={text}
      className={`cursor-help underline decoration-dotted decoration-muted/60 underline-offset-[3px] hover:decoration-navy ${className}`}
    >
      {term}
    </abbr>
  );
}
