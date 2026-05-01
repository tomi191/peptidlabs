"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAdmin } from "@/lib/store/admin";
import {
  Bell,
  Mail,
  Download,
  RefreshCw,
  Upload,
  X,
  FileText,
  ClipboardPaste,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

type Subscriber = {
  id: string;
  email: string;
  locale: string;
  interested_peptide_slugs: string[];
  source_page: string | null;
  confirmed: boolean;
  is_test: boolean;
  created_at: string;
};

type ParsedRow = {
  email: string;
  locale?: "bg" | "en";
  interestedPeptides?: string[];
  source?: string;
};

type ImportResult = {
  imported: number;
  skipped: number;
  invalid: number;
  total?: number;
  details?: { invalid?: Array<{ email: string; reason: string }> };
};

type FilterMode = "all" | "real" | "test";

export default function AdminWaitlistPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAdmin();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [importOpen, setImportOpen] = useState(false);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin");
      return;
    }
    fetchSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSubscribers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/waitlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.success) setSubscribers(json.data.subscribers);
      }
    } catch {
      // network error
    } finally {
      setLoading(false);
    }
  }

  async function toggleTest(id: string, next: boolean) {
    // Optimistic
    setSubscribers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_test: next } : s))
    );
    try {
      const res = await fetch("/api/admin/waitlist", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: [id], isTest: next }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error("Грешка при смяна на статус");
        // Rollback
        setSubscribers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, is_test: !next } : s))
        );
      }
    } catch {
      toast.error("Мрежова грешка");
      setSubscribers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_test: !next } : s))
      );
    }
  }

  function downloadCsv() {
    const list = filterSubscribers(subscribers, filter, search);
    const header =
      "email,locale,interested_peptides,source,confirmed,is_test,created_at\n";
    const rows = list
      .map(
        (s) =>
          `"${s.email}","${s.locale}","${(s.interested_peptide_slugs ?? []).join("|")}","${s.source_page ?? ""}",${s.confirmed},${s.is_test},"${s.created_at}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${filter}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!isAuthenticated()) return null;

  const realCount = subscribers.filter((s) => !s.is_test).length;
  const testCount = subscribers.filter((s) => s.is_test).length;

  // Aggregate by source page (real subscribers only — test addresses pollute analytics)
  const realSubs = subscribers.filter((s) => !s.is_test);
  const bySource = realSubs.reduce<Record<string, number>>((acc, s) => {
    const key = s.source_page ?? "(unknown)";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const peptideCounts = realSubs.reduce<Record<string, number>>((acc, s) => {
    for (const slug of s.interested_peptide_slugs ?? []) {
      acc[slug] = (acc[slug] ?? 0) + 1;
    }
    return acc;
  }, {});
  const topPeptides = Object.entries(peptideCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const visible = useMemo(
    () => filterSubscribers(subscribers, filter, search),
    [subscribers, filter, search]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold text-navy flex items-center gap-2">
            <Bell size={20} className="text-accent" />
            Списък за уведомяване
          </h1>
          <p className="text-sm text-muted mt-1">
            {loading
              ? "Зареждане..."
              : `${realCount} реални • ${testCount} тестови`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubscribers}
            className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-navy transition-colors"
          >
            <RefreshCw size={14} />
            Обнови
          </button>
          <button
            onClick={() => setImportOpen(true)}
            className="inline-flex items-center gap-1.5 border border-border bg-white text-navy rounded-lg px-4 py-2 text-sm font-medium hover:bg-surface transition-colors"
          >
            <Upload size={14} />
            Импорт контакти
          </button>
          <button
            onClick={downloadCsv}
            disabled={visible.length === 0}
            className="inline-flex items-center gap-1.5 bg-navy text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Download size={14} />
            CSV ({visible.length})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Реални контакти" value={realCount} accent="navy" />
        <StatCard label="Тестови имейли" value={testCount} accent="amber" icon={<FlaskConical size={14} />} />
        <StatCard
          label="БГ"
          value={realSubs.filter((s) => s.locale === "bg").length}
        />
        <StatCard
          label="EN"
          value={realSubs.filter((s) => s.locale === "en").length}
        />
      </div>

      {/* Insights — based on real subs only */}
      {topPeptides.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm font-semibold text-navy mb-3">
              Топ заявени пептиди{" "}
              <span className="text-xs text-muted font-normal">
                (без тестови)
              </span>
            </p>
            <ol className="space-y-2">
              {topPeptides.map(([slug, count], i) => (
                <li
                  key={slug}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-secondary">
                    {i + 1}. <span className="font-mono">{slug}</span>
                  </span>
                  <span className="font-bold text-navy tabular">{count}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm font-semibold text-navy mb-3">
              Източници{" "}
              <span className="text-xs text-muted font-normal">
                (без тестови)
              </span>
            </p>
            <ol className="space-y-2">
              {Object.entries(bySource)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([source, count]) => (
                  <li
                    key={source}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-secondary truncate font-mono text-xs">
                      {source}
                    </span>
                    <span className="font-bold text-navy tabular">{count}</span>
                  </li>
                ))}
            </ol>
          </div>
        </div>
      )}

      {/* Filter toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-surface p-1 rounded-lg">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
            icon={<Filter size={11} />}
          >
            Всички ({subscribers.length})
          </FilterPill>
          <FilterPill
            active={filter === "real"}
            onClick={() => setFilter("real")}
          >
            Реални ({realCount})
          </FilterPill>
          <FilterPill
            active={filter === "test"}
            onClick={() => setFilter("test")}
            icon={<FlaskConical size={11} />}
          >
            Тестови ({testCount})
          </FilterPill>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Търсене по имейл..."
          className="text-sm rounded-lg border border-border px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {/* Subscribers table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-xs uppercase text-muted font-semibold">
              <th className="text-left px-4 py-3">Имейл</th>
              <th className="text-left px-4 py-3">Език</th>
              <th className="text-left px-4 py-3">Заявени пептиди</th>
              <th className="text-left px-4 py-3">Източник</th>
              <th className="text-left px-4 py-3">Дата</th>
              <th className="text-center px-4 py-3" title="Тестов имейл — изключва се от реални кампании">
                Тест
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  Зареждане...
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  {search
                    ? "Няма съвпадения"
                    : "Все още няма записани в списъка"}
                </td>
              </tr>
            ) : (
              visible.map((s) => (
                <tr
                  key={s.id}
                  className={`border-b border-border transition-colors ${
                    s.is_test
                      ? "bg-amber-50/40 hover:bg-amber-50/70"
                      : "hover:bg-surface/50"
                  }`}
                >
                  <td className="px-4 py-3 text-navy font-medium">
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${s.email}`}
                        className="hover:text-accent inline-flex items-center gap-1"
                      >
                        <Mail size={12} className="text-muted" />
                        {s.email}
                      </a>
                      {s.is_test && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-widest font-bold text-amber-800 bg-amber-100 border border-amber-200 rounded px-1.5 py-0.5">
                          <FlaskConical size={9} />
                          Test
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs uppercase text-secondary">
                    {s.locale}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-secondary">
                    {(s.interested_peptide_slugs ?? []).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {s.source_page ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(s.created_at).toLocaleString("bg-BG")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={s.is_test}
                        onChange={(e) => toggleTest(s.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <span className="relative inline-block w-8 h-4 bg-stone-300 peer-checked:bg-amber-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-4" />
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {importOpen && (
        <ImportModal
          token={token}
          onClose={() => setImportOpen(false)}
          onDone={() => {
            setImportOpen(false);
            fetchSubscribers();
          }}
        />
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function filterSubscribers(
  list: Subscriber[],
  filter: FilterMode,
  search: string
): Subscriber[] {
  const q = search.trim().toLowerCase();
  return list.filter((s) => {
    if (filter === "real" && s.is_test) return false;
    if (filter === "test" && !s.is_test) return false;
    if (q && !s.email.toLowerCase().includes(q)) return false;
    return true;
  });
}

function StatCard({
  label,
  value,
  accent = "navy",
  icon,
}: {
  label: string;
  value: number;
  accent?: "navy" | "amber";
  icon?: React.ReactNode;
}) {
  const valueClass =
    accent === "amber" ? "text-amber-700" : "text-navy";
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <p className="text-xs text-muted uppercase tracking-widest mb-2 inline-flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className={`text-3xl font-bold font-mono tabular ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${
        active
          ? "bg-white text-navy shadow-sm font-medium"
          : "text-muted hover:text-navy"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/*                            IMPORT MODAL                                  */
/* ──────────────────────────────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CLIENT_BATCH = 2000; // rows per request — keeps payload small + responsive

function ImportModal({
  token,
  onClose,
  onDone,
}: {
  token: string | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [tab, setTab] = useState<"paste" | "csv">("paste");
  const [pasteText, setPasteText] = useState("");
  const [csvText, setCsvText] = useState("");
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [defaultLocale, setDefaultLocale] = useState<"bg" | "en">("bg");
  const [defaultSource, setDefaultSource] = useState("admin-import");
  const [confirmed, setConfirmed] = useState(true);
  const [markAsTest, setMarkAsTest] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<{
    sent: number;
    total: number;
  } | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function parsePasteRows(text: string): {
    rows: ParsedRow[];
    invalid: number;
  } {
    const rows: ParsedRow[] = [];
    let invalid = 0;
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line) continue;
      const angle = line.match(/<([^>]+)>/);
      const candidate = angle ? angle[1] : line.split(",")[0].trim();
      if (EMAIL_RE.test(candidate)) {
        rows.push({ email: candidate });
      } else {
        invalid += 1;
      }
    }
    return { rows, invalid };
  }

  function parseCsvRows(text: string): {
    rows: ParsedRow[];
    invalid: number;
  } {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return { rows: [], invalid: 0 };

    const first = splitCsvLine(lines[0]);
    const headerLooksLikeData = first.some((c) => EMAIL_RE.test(c.trim()));
    const headers = headerLooksLikeData
      ? null
      : first.map((h) => h.trim().toLowerCase().replace(/^﻿/, ""));

    const dataLines = headerLooksLikeData ? lines : lines.slice(1);

    const idx = (name: string) => (headers ? headers.indexOf(name) : -1);
    const emailIdx = headers ? idx("email") : 0;
    const localeIdx = idx("locale");
    const peptidesIdx =
      idx("interested_peptides") >= 0
        ? idx("interested_peptides")
        : idx("peptides");
    const sourceIdx = idx("source") >= 0 ? idx("source") : idx("source_page");

    const rows: ParsedRow[] = [];
    let invalid = 0;

    for (const line of dataLines) {
      const cols = splitCsvLine(line);
      const email = (cols[emailIdx] ?? "").trim().replace(/^["']|["']$/g, "");
      if (!EMAIL_RE.test(email)) {
        invalid += 1;
        continue;
      }
      const row: ParsedRow = { email };

      if (localeIdx >= 0) {
        const v = (cols[localeIdx] ?? "").trim().toLowerCase();
        if (v === "bg" || v === "en") row.locale = v;
      }
      if (peptidesIdx >= 0) {
        const v = (cols[peptidesIdx] ?? "")
          .trim()
          .replace(/^["']|["']$/g, "");
        if (v) {
          row.interestedPeptides = v
            .split(/[|,;]/)
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 20);
        }
      }
      if (sourceIdx >= 0) {
        const v = (cols[sourceIdx] ?? "").trim().replace(/^["']|["']$/g, "");
        if (v) row.source = v.slice(0, 200);
      }

      rows.push(row);
    }

    return { rows, invalid };
  }

  function splitCsvLine(line: string): string[] {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          cur += ch;
        }
      } else {
        if (ch === ",") {
          out.push(cur);
          cur = "";
        } else if (ch === '"') {
          inQuotes = true;
        } else {
          cur += ch;
        }
      }
    }
    out.push(cur);
    return out;
  }

  const text = tab === "paste" ? pasteText : csvText;
  const parsed = useMemo(() => {
    if (text.trim().length === 0) return { rows: [] as ParsedRow[], invalid: 0 };
    return tab === "paste" ? parsePasteRows(pasteText) : parseCsvRows(csvText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, tab]);

  // Client-side dedupe preview
  const dedupedRows = useMemo(() => {
    const seen = new Set<string>();
    return parsed.rows.filter((r) => {
      const e = r.email.toLowerCase();
      if (seen.has(e)) return false;
      seen.add(e);
      return true;
    });
  }, [parsed.rows]);
  const localDuplicates = parsed.rows.length - dedupedRows.length;

  async function handleFile(file: File) {
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setCsvText(String(e.target?.result ?? ""));
    reader.readAsText(file);
  }

  async function submit() {
    if (dedupedRows.length === 0) {
      toast.error("Няма валидни имейли за импорт");
      return;
    }
    setSubmitting(true);
    setResult(null);
    setProgress({ sent: 0, total: dedupedRows.length });

    const aggregate: ImportResult = {
      imported: 0,
      skipped: 0,
      invalid: 0,
      total: dedupedRows.length,
      details: { invalid: [] },
    };

    try {
      for (let i = 0; i < dedupedRows.length; i += CLIENT_BATCH) {
        const slice = dedupedRows.slice(i, i + CLIENT_BATCH);
        const res = await fetch("/api/admin/waitlist/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rows: slice,
            defaults: {
              locale: defaultLocale,
              source: defaultSource || "admin-import",
              confirmed,
              isTest: markAsTest,
            },
          }),
        });
        const json = await res.json();
        if (!res.ok || !json?.success) {
          toast.error(
            `Грешка при партида ${Math.floor(i / CLIENT_BATCH) + 1}: ${json?.error ?? "unknown"}`
          );
          setSubmitting(false);
          setResult(aggregate);
          return;
        }
        const r = json.data as ImportResult;
        aggregate.imported += r.imported;
        aggregate.skipped += r.skipped;
        aggregate.invalid += r.invalid;
        if (r.details?.invalid && aggregate.details!.invalid!.length < 50) {
          aggregate.details!.invalid!.push(
            ...r.details.invalid.slice(0, 50 - aggregate.details!.invalid!.length)
          );
        }
        setProgress({ sent: Math.min(i + slice.length, dedupedRows.length), total: dedupedRows.length });
      }

      setResult(aggregate);
      toast.success(
        `Импортирани: ${aggregate.imported} • Прескочени: ${aggregate.skipped} • Невалидни: ${aggregate.invalid}`
      );
    } catch {
      toast.error("Мрежова грешка при импорта");
      setResult(aggregate);
    } finally {
      setSubmitting(false);
    }
  }

  const isLargeImport = dedupedRows.length > CLIENT_BATCH;
  const batchCount = Math.ceil(dedupedRows.length / CLIENT_BATCH);

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-navy flex items-center gap-2">
              <Upload size={16} className="text-accent" />
              Импорт на контакти
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Дубликатите автоматично се откриват и пропускат
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-muted hover:text-navy transition-colors p-1 disabled:opacity-30"
            aria-label="Затвори"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {!result && (
            <>
              {/* Tabs */}
              <div className="flex gap-1 bg-surface p-1 rounded-lg w-fit">
                <button
                  onClick={() => setTab("paste")}
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${
                    tab === "paste"
                      ? "bg-white text-navy shadow-sm font-medium"
                      : "text-muted hover:text-navy"
                  }`}
                >
                  <ClipboardPaste size={12} />
                  Поставяне
                </button>
                <button
                  onClick={() => setTab("csv")}
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${
                    tab === "csv"
                      ? "bg-white text-navy shadow-sm font-medium"
                      : "text-muted hover:text-navy"
                  }`}
                >
                  <FileText size={12} />
                  CSV файл
                </button>
              </div>

              {tab === "paste" ? (
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">
                    По един имейл на ред
                  </label>
                  <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    rows={8}
                    placeholder={`ivan@example.com\nmaria@example.com\nGeorgi <georgi@example.com>`}
                    className="w-full font-mono text-xs rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                  <p className="text-xs text-muted mt-1">
                    Поддържат се формати: <code>email</code> или{" "}
                    <code>Име &lt;email&gt;</code>
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">
                    CSV файл (поддържа до 10 000 реда наведнъж)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,text/csv,text/plain"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                      }}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 border border-border rounded-lg px-3 py-2 text-xs text-navy hover:bg-surface transition-colors"
                    >
                      <Upload size={12} />
                      Избери файл
                    </button>
                    {csvFileName && (
                      <span className="text-xs text-muted truncate font-mono">
                        {csvFileName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-2">
                    Колони (хедър по избор):{" "}
                    <code>email, locale, interested_peptides, source</code>.
                    <br />
                    Пептидите могат да са разделени с <code>|</code>,{" "}
                    <code>,</code> или <code>;</code>.
                  </p>
                </div>
              )}

              {/* Defaults */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-border">
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">
                    Език по подразбиране
                  </label>
                  <select
                    value={defaultLocale}
                    onChange={(e) =>
                      setDefaultLocale(e.target.value as "bg" | "en")
                    }
                    className="w-full text-xs rounded-lg border border-border px-2 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    <option value="bg">Български (bg)</option>
                    <option value="en">English (en)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">
                    Източник (source_page)
                  </label>
                  <input
                    type="text"
                    value={defaultSource}
                    onChange={(e) => setDefaultSource(e.target.value)}
                    placeholder="admin-import"
                    className="w-full text-xs rounded-lg border border-border px-2 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">
                    Статус
                  </label>
                  <label className="flex items-center gap-2 text-xs text-navy bg-surface rounded-lg px-2 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="accent-accent"
                    />
                    Потвърден
                  </label>
                </div>
              </div>

              {/* Test toggle */}
              <label
                className={`flex items-start gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-colors ${
                  markAsTest
                    ? "border-amber-300 bg-amber-50"
                    : "border-border bg-white hover:bg-surface/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={markAsTest}
                  onChange={(e) => setMarkAsTest(e.target.checked)}
                  className="mt-0.5 accent-amber-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-navy flex items-center gap-1.5">
                    <FlaskConical size={14} className="text-amber-600" />
                    Маркирай всички като тестови имейли
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Тестовите имейли се изключват от реалните кампании и
                    статистиките. Можеш да ги използваш за пробни изпращания.
                  </p>
                </div>
              </label>

              {/* Preview */}
              <div className="rounded-lg bg-surface px-4 py-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-secondary">
                    Засечени:{" "}
                    <span className="font-bold text-navy tabular">
                      {dedupedRows.length}
                    </span>{" "}
                    уникални
                    {localDuplicates > 0 && (
                      <>
                        {" • "}
                        <span className="text-amber-700 tabular">
                          {localDuplicates}
                        </span>{" "}
                        дубликата във файла
                      </>
                    )}
                    {parsed.invalid > 0 && (
                      <>
                        {" • "}
                        <span className="text-rose-700 font-bold tabular">
                          {parsed.invalid}
                        </span>{" "}
                        невалидни
                      </>
                    )}
                  </span>
                  {isLargeImport && (
                    <span className="text-muted">
                      Ще бъде изпратено в {batchCount} партиди
                    </span>
                  )}
                </div>
                {dedupedRows.length > 0 && (
                  <div className="text-muted truncate">
                    Първи 3:{" "}
                    <span className="font-mono">
                      {dedupedRows
                        .slice(0, 3)
                        .map((r) => r.email)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar (during submit) */}
              {progress && submitting && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary">
                      Изпращане...{" "}
                      <span className="font-bold text-navy tabular">
                        {progress.sent}
                      </span>{" "}
                      / {progress.total}
                    </span>
                    <span className="text-muted tabular">
                      {Math.round((progress.sent / progress.total) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{
                        width: `${(progress.sent / progress.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {result && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 size={18} />
                <p className="text-sm font-semibold">Импортът завърши</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Импортирани" value={result.imported} tone="ok" />
                <Stat
                  label="Прескочени (вече съществуват)"
                  value={result.skipped}
                  tone="muted"
                />
                <Stat label="Невалидни" value={result.invalid} tone="warn" />
              </div>
              {result.details?.invalid && result.details.invalid.length > 0 && (
                <details className="rounded-lg border border-border bg-surface p-3">
                  <summary className="text-xs font-medium text-navy cursor-pointer flex items-center gap-1.5">
                    <AlertCircle size={12} className="text-amber-600" />
                    Виж невалидни редове ({result.details.invalid.length})
                  </summary>
                  <ul className="mt-2 space-y-1 text-[11px] font-mono text-secondary max-h-40 overflow-auto">
                    {result.details.invalid.map((it, i) => (
                      <li key={i} className="flex justify-between gap-2">
                        <span className="truncate">{it.email}</span>
                        <span className="text-muted shrink-0">{it.reason}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-surface/40 rounded-b-2xl">
          {!result ? (
            <>
              <button
                onClick={onClose}
                disabled={submitting}
                className="text-sm text-secondary hover:text-navy px-3 py-2 transition-colors disabled:opacity-30"
              >
                Отказ
              </button>
              <button
                onClick={submit}
                disabled={submitting || dedupedRows.length === 0}
                className="inline-flex items-center gap-1.5 bg-navy text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Импортиране...
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    Импортирай {dedupedRows.length || ""}
                    {markAsTest ? " като тестови" : ""}
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={onDone}
              className="bg-navy text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Затвори и обнови
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ok" | "muted" | "warn";
}) {
  const toneClass =
    tone === "ok"
      ? "text-emerald-700"
      : tone === "warn"
        ? "text-amber-700"
        : "text-navy";
  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold tabular ${toneClass}`}>{value}</p>
    </div>
  );
}
