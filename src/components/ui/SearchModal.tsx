"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  Search,
  X,
  ArrowRight,
  BookOpen,
  Newspaper,
  Calculator,
  ShieldCheck,
  Package,
  Clock,
  TrendingUp,
  CornerDownLeft,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { getFormLabel } from "@/lib/labels";
import type { Product } from "@/lib/types";
import { VialPlaceholder } from "@/components/ui/VialPlaceholder";

type SearchProduct = {
  name: string;
  name_bg: string | null;
  slug: string;
  vial_size_mg: number | null;
  price_bgn: number;
  price_eur: number;
  form: string;
  purity_percent: number;
  use_case_tag_bg: string | null;
  use_case_tag_en: string | null;
  images: string[] | null;
};

type SearchPeptide = {
  name: string;
  slug: string;
  full_name_bg: string | null;
  full_name_en: string | null;
  summary_bg: string | null;
  summary_en: string | null;
};

type SearchBlog = {
  slug: string;
  title_bg: string | null;
  title_en: string | null;
  tags: string[] | null;
  published_at: string | null;
};

type Bundle = {
  products: SearchProduct[];
  peptides: SearchPeptide[];
  blog: SearchBlog[];
};

const RECENT_KEY = "peptidlab_recent_searches";
const MAX_RECENT = 5;
const POPULAR_PEPTIDES = ["BPC-157", "Semaglutide", "GHK-Cu", "NAD+", "Tirzepatide"];

type Result =
  | { type: "product"; href: string; data: SearchProduct }
  | { type: "peptide"; href: string; data: SearchPeptide }
  | { type: "blog"; href: string; data: SearchBlog }
  | { type: "action"; href: string; label: string; icon: typeof BookOpen };

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const locale = useLocale();
  const isBg = locale === "bg";

  // Load bundle on first open
  useEffect(() => {
    if (open && !loaded) {
      fetch("/api/search")
        .then((res) => res.json())
        .then((data: Bundle) => {
          setBundle(data);
          setLoaded(true);
        })
        .catch(() => {
          setBundle({ products: [], peptides: [], blog: [] });
          setLoaded(true);
        });
    }
  }, [open, loaded]);

  // Load recent searches
  useEffect(() => {
    if (open) {
      try {
        const raw = localStorage.getItem(RECENT_KEY);
        if (raw) setRecent(JSON.parse(raw));
      } catch {
        setRecent([]);
      }
    }
  }, [open]);

  // Focus input on open + reset state on close
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  // Quick actions (always visible when query empty)
  const quickActions: Result[] = useMemo(
    () => [
      {
        type: "action",
        href: "/encyclopedia",
        label: isBg ? "Енциклопедия — 49+ пептида" : "Encyclopedia — 49+ peptides",
        icon: BookOpen,
      },
      {
        type: "action",
        href: "/encyclopedia/azbuka",
        label: isBg ? "Азбучен указател (А–Я)" : "A–Z Index",
        icon: BookOpen,
      },
      {
        type: "action",
        href: "/calculator",
        label: isBg ? "Калкулатор за реконституция" : "Reconstitution calculator",
        icon: Calculator,
      },
      {
        type: "action",
        href: "/coa-vault",
        label: isBg ? "COA Vault — сертификати" : "COA Vault",
        icon: ShieldCheck,
      },
      {
        type: "action",
        href: "/shop",
        label: isBg ? "Каталог — всички продукти" : "Shop — all products",
        icon: Package,
      },
    ],
    [isBg],
  );

  // Compute filtered results
  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!bundle) return [];

    if (!q) {
      // Empty state — show quick actions + popular peptides
      const popular: Result[] = bundle.peptides
        .filter((p) => POPULAR_PEPTIDES.includes(p.name))
        .map((p) => ({
          type: "peptide" as const,
          href: `/encyclopedia/${p.slug}`,
          data: p,
        }));
      return [
        { label: isBg ? "Бързи действия" : "Quick actions", items: quickActions },
        { label: isBg ? "Популярни пептиди" : "Popular peptides", items: popular },
      ];
    }

    const products: Result[] = bundle.products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.name_bg ?? "").toLowerCase().includes(q),
      )
      .slice(0, 5)
      .map((p) => ({ type: "product" as const, href: `/products/${p.slug}`, data: p }));

    const peptides: Result[] = bundle.peptides
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.full_name_bg ?? "").toLowerCase().includes(q) ||
          (p.full_name_en ?? "").toLowerCase().includes(q),
      )
      .slice(0, 5)
      .map((p) => ({ type: "peptide" as const, href: `/encyclopedia/${p.slug}`, data: p }));

    const blog: Result[] = bundle.blog
      .filter(
        (b) =>
          (b.title_bg ?? "").toLowerCase().includes(q) ||
          (b.title_en ?? "").toLowerCase().includes(q) ||
          (b.tags ?? []).some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 3)
      .map((b) => ({ type: "blog" as const, href: `/blog/${b.slug}`, data: b }));

    const result = [];
    if (products.length > 0)
      result.push({ label: isBg ? "Продукти" : "Products", items: products });
    if (peptides.length > 0)
      result.push({
        label: isBg ? "Енциклопедия" : "Encyclopedia",
        items: peptides,
      });
    if (blog.length > 0)
      result.push({ label: isBg ? "Блог" : "Blog", items: blog });
    return result;
  }, [bundle, query, quickActions, isBg]);

  // Flat list of all visible results — used for keyboard nav
  const flatResults = useMemo(
    () => sections.flatMap((s) => s.items),
    [sections],
  );

  // Reset activeIndex when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query, sections.length]);

  function persistRecent(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(
      0,
      MAX_RECENT,
    );
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  const handleSelect = useCallback(
    (r: Result) => {
      if (query.trim()) persistRecent(query);
      onClose();
      router.push(r.href);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, onClose, router],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (flatResults.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % flatResults.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(
          (i) => (i - 1 + flatResults.length) % flatResults.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const r = flatResults[activeIndex];
        if (r) handleSelect(r);
      }
    },
    [open, onClose, flatResults, activeIndex, handleSelect],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  let runningIndex = 0;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto mt-24 p-0 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search size={18} className="text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isBg
                ? "Търси продукт, пептид, статия..."
                : "Search products, peptides, articles..."
            }
            className="text-base w-full text-navy placeholder:text-muted focus:outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-surface px-1.5 font-mono text-[10px] text-muted">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="text-muted hover:text-navy transition-colors shrink-0 sm:hidden"
            aria-label={isBg ? "Затвори" : "Close"}
          >
            <X size={18} />
          </button>
        </div>

        {/* Recent (only when query empty + has recent) */}
        {!query.trim() && recent.length > 0 && (
          <div className="border-b border-border px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
              {isBg ? "Скорошни търсения" : "Recent searches"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {recent.map((r) => (
                <button
                  key={r}
                  onClick={() => setQuery(r)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-secondary hover:border-navy/30 hover:text-navy"
                >
                  <Clock size={11} />
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!loaded ? (
            <div className="px-5 py-8 text-center text-sm text-muted">
              {isBg ? "Зареждане..." : "Loading..."}
            </div>
          ) : sections.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-muted">
                {isBg
                  ? "Няма резултати за този термин."
                  : "No results for this query."}
              </p>
              <p className="mt-2 text-xs text-muted">
                {isBg
                  ? "Опитай с името на пептида или част от заглавие."
                  : "Try the peptide name or part of a title."}
              </p>
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.label} className="border-b border-border last:border-0">
                <div className="px-5 pt-3 pb-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted flex items-center gap-1.5">
                    {section.label === (isBg ? "Популярни пептиди" : "Popular peptides") && (
                      <TrendingUp size={11} />
                    )}
                    {section.label}
                  </p>
                </div>
                <ul>
                  {section.items.map((item) => {
                    const idx = runningIndex++;
                    const isActive = idx === activeIndex;
                    return (
                      <ResultRow
                        key={`${item.type}-${idx}`}
                        result={item}
                        active={isActive}
                        onClick={() => handleSelect(item)}
                        isBg={isBg}
                      />
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="hidden sm:flex items-center justify-between border-t border-border px-5 py-2 text-[10px] text-muted">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="inline-flex items-center rounded border border-border bg-white px-1 font-mono">↑↓</kbd>
              {isBg ? "навигация" : "navigate"}
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="inline-flex items-center rounded border border-border bg-white px-1 font-mono"><CornerDownLeft size={9} /></kbd>
              {isBg ? "избери" : "select"}
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="inline-flex items-center rounded border border-border bg-white px-1 font-mono">ESC</kbd>
              {isBg ? "затвори" : "close"}
            </span>
          </div>
          <span className="font-mono">{loaded && bundle
            ? `${bundle.products.length}+${bundle.peptides.length}+${bundle.blog.length}`
            : ""}</span>
        </div>
      </div>
    </div>
  );
}

function ResultRow({
  result,
  active,
  onClick,
  isBg,
}: {
  result: Result;
  active: boolean;
  onClick: () => void;
  isBg: boolean;
}) {
  const baseCls = `w-full text-left px-5 py-2.5 flex items-center justify-between gap-3 transition-colors ${
    active ? "bg-accent-tint/60" : "hover:bg-surface"
  }`;

  let icon: ReactNode = null;
  let title = "";
  let subtitle: string | null = null;
  let trailing: ReactNode = null;

  if (result.type === "product") {
    const p = result.data;
    icon =
      p.images && p.images.length > 0 ? (
        <div className="relative h-9 w-7 shrink-0 overflow-hidden rounded bg-surface">
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            sizes="32px"
            className="object-contain p-0.5"
          />
        </div>
      ) : (
        <div className="h-9 w-7 shrink-0 flex items-center justify-center rounded bg-surface">
          <VialPlaceholder name={p.name} size="xs" />
        </div>
      );
    title =
      isBg && p.name_bg ? p.name_bg : p.name;
    subtitle = `${p.vial_size_mg ? `${p.vial_size_mg}mg · ` : ""}${getFormLabel(
      p.form as Product["form"],
      isBg ? "bg" : "en",
    )} · ${p.purity_percent}% HPLC`;
    trailing = (
      <span className="flex shrink-0 flex-col items-end leading-tight">
        <span className="text-sm font-bold text-navy tabular">
          €{p.price_eur.toFixed(2)}
        </span>
        <span className="font-mono text-[10px] text-muted tabular">
          ≈ {(p.price_eur * 1.95583).toFixed(2)} лв
        </span>
      </span>
    );
  } else if (result.type === "peptide") {
    const p = result.data;
    icon = (
      <div className="h-9 w-7 shrink-0 flex items-center justify-center rounded bg-accent-tint">
        <BookOpen size={14} className="text-accent" strokeWidth={1.75} />
      </div>
    );
    title = p.name;
    subtitle =
      (isBg ? p.full_name_bg ?? p.full_name_en : p.full_name_en ?? p.full_name_bg) ??
      null;
    trailing = (
      <ArrowRight size={14} className="text-muted shrink-0" />
    );
  } else if (result.type === "blog") {
    const b = result.data;
    icon = (
      <div className="h-9 w-7 shrink-0 flex items-center justify-center rounded bg-surface">
        <Newspaper size={14} className="text-secondary" strokeWidth={1.75} />
      </div>
    );
    title = (isBg ? b.title_bg : b.title_en) ?? b.slug;
    subtitle = (b.tags ?? []).slice(0, 3).join(" · ") || null;
    trailing = <ArrowRight size={14} className="text-muted shrink-0" />;
  } else {
    const Icon = result.icon;
    icon = (
      <div className="h-9 w-7 shrink-0 flex items-center justify-center rounded bg-navy/5">
        <Icon size={14} className="text-navy" strokeWidth={1.75} />
      </div>
    );
    title = result.label;
    subtitle = null;
    trailing = <ArrowRight size={14} className="text-muted shrink-0" />;
  }

  return (
    <li>
      <button onClick={onClick} className={baseCls}>
        <div className="flex min-w-0 items-center gap-3">
          {icon}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy truncate">{title}</p>
            {subtitle && (
              <p className="text-[11px] font-mono text-muted truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {trailing}
      </button>
    </li>
  );
}
