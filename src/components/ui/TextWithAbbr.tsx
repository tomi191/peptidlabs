import { Fragment } from "react";
import { abbreviations } from "@/lib/abbreviations";
import { Abbr } from "./Abbr";

type Props = {
  text: string;
  locale?: string;
};

/**
 * Auto-wraps known abbreviations inside a string with `<Abbr>` tooltip
 * components. Use for translated strings where you don't want to split
 * them into prefix/abbr/suffix pieces manually.
 *
 * Example: "HPLC чистота" → <Abbr term="HPLC">HPLC</Abbr> + " чистота"
 */
export function TextWithAbbr({ text, locale = "bg" }: Props) {
  // Build regex once per render from the known abbreviation keys.
  const dict = abbreviations[locale === "bg" ? "bg" : "en"];
  const terms = Object.keys(dict)
    .sort((a, b) => b.length - a.length) // longest first so "NAD+" wins over "NAD"
    .map((t) => t.replace(/[-+]/g, (c) => `\\${c}`));
  const pattern = new RegExp(`(${terms.join("|")})`, "g");

  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        if (part in dict) {
          return <Abbr key={i} term={part} locale={locale} />;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
