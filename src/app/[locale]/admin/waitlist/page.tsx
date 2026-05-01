"use client";

import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

type Subscriber = {
  id: string;
  email: string;
  locale: string;
  interested_peptide_slugs: string[];
  source_page: string | null;
  confirmed: boolean;
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

export default function AdminWaitlistPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAdmin();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [importOpen, setImportOpen] = useState(false);

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

  function downloadCsv() {
    const header = "email,locale,interested_peptides,source,confirmed,created_at\n";
    const rows = subscribers
      .map(
        (s) =>
          `"${s.email}","${s.locale}","${(s.interested_peptide_slugs ?? []).join("|")}","${s.source_page ?? ""}",${s.confirmed},"${s.created_at}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!isAuthenticated()) return null;

  // Aggregate by source page for quick insights
  const bySource = subscribers.reduce<Record<string, number>>((acc, s) => {
    const key = s.source_page ?? "(unknown)";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  // Top requested peptides
  const peptideCounts = subscribers.reduce<Record<string, number>>((acc, s) => {
    for (const slug of s.interested_peptide_slugs ?? []) {
      acc[slug] = (acc[slug] ?? 0) + 1;
    }
    return acc;
  }, {});
  const topPeptides = Object.entries(peptideCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

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
              : `${subscribers.length} записани имейла`}
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
            disabled={subscribers.length === 0}
            className="inline-flex items-center gap-1.5 bg-navy text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Download size={14} />
            CSV export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-2">
            Общо записани
          </p>
          <p className="text-3xl font-bold text-navy font-mono tabular">
            {subscribers.length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-2">
            БГ потребители
          </p>
          <p className="text-3xl font-bold text-navy font-mono tabular">
            {subscribers.filter((s) => s.locale === "bg").length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-2">
            EN потребители
          </p>
          <p className="text-3xl font-bold text-navy font-mono tabular">
            {subscribers.filter((s) => s.locale === "en").length}
          </p>
        </div>
      </div>

      {/* Insights */}
      {topPeptides.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm font-semibold text-navy mb-3">
              Топ заявени пептиди
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
              Източници (откъде се записват)
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
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted">
                  Зареждане...
                </td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted">
                  Все още няма записани в списъка
                </td>
              </tr>
            ) : (
              subscribers.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border hover:bg-surface/50 transition-colors"
                >
                  <td className="px-4 py-3 text-navy font-medium">
                    <a
                      href={`mailto:${s.email}`}
                      className="hover:text-accent inline-flex items-center gap-1"
                    >
                      <Mail size={12} className="text-muted" />
                      {s.email}
                    </a>
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
/*                            IMPORT MODAL                                  */
/* ──────────────────────────────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [submitting, setSubmitting] = useState(false);
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
      // Allow lines like "email" OR "Name <email>" OR "email,locale"
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

    // Header detection — accept "email" header or any first line that looks like a header
    const first = splitCsvLine(lines[0]);
    const headerLooksLikeData = first.some((c) => EMAIL_RE.test(c.trim()));
    const headers = headerLooksLikeData
      ? null
      : first.map((h) => h.trim().toLowerCase().replace(/^﻿/, ""));

    const dataLines = headerLooksLikeData ? lines : lines.slice(1);

    const idx = (name: string) =>
      headers ? headers.indexOf(name) : -1;
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
  const parsed =
    text.trim().length === 0
      ? { rows: [], invalid: 0 }
      : tab === "paste"
        ? parsePasteRows(pasteText)
        : parseCsvRows(csvText);

  async function handleFile(file: File) {
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setCsvText(String(e.target?.result ?? ""));
    reader.readAsText(file);
  }

  async function submit() {
    if (parsed.rows.length === 0) {
      toast.error("Няма валидни имейли за импорт");
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/waitlist/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rows: parsed.rows,
          defaults: {
            locale: defaultLocale,
            source: defaultSource || "admin-import",
            confirmed,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.error ?? "Импортът се провали");
        return;
      }
      const r = json.data as ImportResult;
      setResult(r);
      toast.success(
        `Импортирани: ${r.imported} • Прескочени: ${r.skipped} • Невалидни: ${r.invalid}`
      );
    } catch {
      toast.error("Мрежова грешка при импорта");
    } finally {
      setSubmitting(false);
    }
  }

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
              Поставяне на списък или качване на CSV файл
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-navy transition-colors p-1"
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
                    CSV файл
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
                  {csvText && (
                    <details className="mt-3">
                      <summary className="text-xs text-secondary cursor-pointer hover:text-navy">
                        Преглед на съдържанието
                      </summary>
                      <pre className="mt-2 max-h-40 overflow-auto bg-surface rounded-lg p-3 text-[10px] font-mono text-secondary">
                        {csvText.slice(0, 2000)}
                        {csvText.length > 2000 ? "\n…" : ""}
                      </pre>
                    </details>
                  )}
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
                    Потвърден (confirmed)
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-lg bg-surface px-4 py-3 flex items-center justify-between text-xs">
                <span className="text-secondary">
                  Засечени:{" "}
                  <span className="font-bold text-navy tabular">
                    {parsed.rows.length}
                  </span>{" "}
                  валидни
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
                {parsed.rows.length > 0 && (
                  <span className="text-muted">
                    Първи 3:{" "}
                    <span className="font-mono">
                      {parsed.rows
                        .slice(0, 3)
                        .map((r) => r.email)
                        .join(", ")}
                    </span>
                  </span>
                )}
              </div>
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
                <Stat label="Прескочени (вече съществуват)" value={result.skipped} tone="muted" />
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
                        <span className="text-muted shrink-0">
                          {it.reason}
                        </span>
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
                className="text-sm text-secondary hover:text-navy px-3 py-2 transition-colors"
              >
                Отказ
              </button>
              <button
                onClick={submit}
                disabled={submitting || parsed.rows.length === 0}
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
                    Импортирай {parsed.rows.length || ""}
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
