import { Fragment } from "react";
import { abbreviations } from "@/lib/abbreviations";
import { Abbr } from "./Abbr";

type Props = {
  text: string;
  locale?: string;
};

// Characters that count as a "word boundary" — letters, digits, common Cyrillic.
// We use lookbehind/lookahead so the match is bounded but we don't consume
// the surrounding chars (which would break the split).
const WORD_CHAR = "[\\p{L}\\p{N}_]";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Auto-wraps known abbreviations and scientific terms with <Abbr> tooltips.
 * - Case-insensitive matching (preserves original casing in output).
 * - Honors word boundaries for both Cyrillic and Latin text.
 * - Longest terms match first so "GLP-1" wins over "GLP".
 */
export function TextWithAbbr({ text, locale = "bg" }: Props) {
  const dict = abbreviations[locale === "bg" ? "bg" : "en"];
  // Build a lowercase lookup for case-insensitive matches → original term.
  const lowerToOriginal = new Map<string, string>();
  for (const term of Object.keys(dict)) {
    lowerToOriginal.set(term.toLowerCase(), term);
  }

  const terms = Object.keys(dict)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex);

  // Bounded by non-word chars (or string start/end) on both sides.
  const pattern = new RegExp(
    `(?<!${WORD_CHAR})(${terms.join("|")})(?!${WORD_CHAR})`,
    "giu"
  );

  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const original = lowerToOriginal.get(part?.toLowerCase() ?? "");
        if (original) {
          return (
            <Abbr key={i} term={original} locale={locale}>
              {part}
            </Abbr>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
