"use client";

import { useState, useRef, useEffect } from "react";
import { getAbbreviation } from "@/lib/abbreviations";

type Props = {
  /** The short form displayed (e.g. "HPLC"). Used for tooltip lookup. */
  term: string;
  /** Override the auto-lookup with an explicit explanation */
  explanation?: string;
  /** Display text — defaults to `term`. Allows case-insensitive matches to keep original casing. */
  children?: React.ReactNode;
  locale?: string;
  className?: string;
};

/**
 * Inline abbreviation with a touch-friendly popover tooltip.
 * - Desktop: hover shows popover
 * - Touch: tap toggles popover; tap outside closes
 * - Keyboard: focus shows popover, Escape closes
 * - Visible cue: dotted underline tells users the term is explainable
 */
export function Abbr({
  term,
  explanation,
  children,
  locale = "bg",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const text = explanation ?? getAbbreviation(term, locale);
  const display = children ?? term;

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!text) return <>{display}</>;

  return (
    <span
      ref={wrapRef}
      className={`relative inline-block ${className}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label={`${term}: ${text}`}
        aria-expanded={open}
        className="inline cursor-help underline decoration-dotted decoration-accent/70 decoration-from-font underline-offset-[3px] hover:decoration-navy hover:decoration-solid focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:rounded-sm"
        style={{ textDecorationThickness: "1.5px" }}
      >
        {display}
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-border bg-navy px-3 py-2 text-left text-xs leading-relaxed text-white shadow-xl"
          style={{ pointerEvents: "none" }}
        >
          <span className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan-300">
            {term}
          </span>
          <span className="mt-1 block">{text}</span>
          {/* Arrow */}
          <span
            className="absolute left-1/2 top-full -ml-1.5 h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-navy"
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  );
}
