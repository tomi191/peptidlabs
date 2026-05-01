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
  Plus,
  CheckSquare,
  Square,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type Stats = {
  total: number;
  real: number;
  test: number;
  realByLocale: { bg: number; en: number };
  topSources: Array<[string, number]>;
  topPeptides: Array<[string, number]>;
};

const PAGE_SIZE_OPTIONS = [50, 100, 250, 500];

export default function AdminWaitlistPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAdmin();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 100,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Debounce search input → search query
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin");
      return;
    }
    fetchPage(1, pagination.pageSize, filter, search);
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch page when filter/search/pageSize change → reset to page 1
  useEffect(() => {
    if (!isAuthenticated()) return;
    fetchPage(1, pagination.pageSize, filter, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search, pagination.pageSize]);

  async function fetchPage(
    page: number,
    pageSize: number,
    filter: FilterMode,
    search: string
  ) {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        filter,
      });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/waitlist?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.success) {
          setSubscribers(json.data.subscribers);
          setPagination(json.data.pagination);
          // Clear selection when navigating to a new page set
          setSelected(new Set());
        }
      }
    } catch {
      // network error
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/waitlist/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.success) setStats(json.data);
      }
    } catch {
      // ignore
    }
  }

  async function refreshAll() {
    await Promise.all([
      fetchPage(pagination.page, pagination.pageSize, filter, search),
      fetchStats(),
    ]);
  }

  async function bulkSetTest(ids: string[], next: boolean) {
    if (ids.length === 0) return;
    setSubscribers((prev) =>
      prev.map((s) => (ids.includes(s.id) ? { ...s, is_test: next } : s))
    );
    try {
      const res = await fetch("/api/admin/waitlist", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids, isTest: next }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.error ?? "Грешка при операцията");
        await refreshAll();
        return;
      }
      toast.success(
        `${json.data.updated} ${next ? "маркирани като тестови" : "размаркирани"}`
      );
      setSelected(new Set());
      fetchStats();
    } catch {
      toast.error("Мрежова грешка");
      await refreshAll();
    }
  }

  async function bulkDelete(ids: string[]) {
    if (ids.length === 0) return;
    if (
      !confirm(
        `Сигурен ли си, че искаш да изтриеш ${ids.length} контакта? Това действие е необратимо.`
      )
    )
      return;
    try {
      const res = await fetch("/api/admin/waitlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.error ?? "Грешка при изтриване");
        return;
      }
      toast.success(`${json.data.deleted} контакта изтрити`);
      setSelected(new Set());
      await refreshAll();
    } catch {
      toast.error("Мрежова грешка");
    }
  }

  async function toggleTest(id: string, next: boolean) {
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
        setSubscribers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, is_test: !next } : s))
        );
        return;
      }
      fetchStats();
    } catch {
      toast.error("Мрежова грешка");
      setSubscribers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_test: !next } : s))
      );
    }
  }

  async function downloadCsv() {
    setExporting(true);
    const accumulator: Subscriber[] = [];
    const EXPORT_PAGE = 500;
    try {
      let page = 1;
      // Loop server-side pages until we drain the matching set (capped at 50K)
      while (true) {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(EXPORT_PAGE),
          filter,
        });
        if (search) params.set("search", search);
        const res = await fetch(`/api/admin/waitlist?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          toast.error("Експортът се провали");
          return;
        }
        const json = await res.json();
        if (!json?.success) {
          toast.error("Експортът се провали");
          return;
        }
        const rows = json.data.subscribers as Subscriber[];
        accumulator.push(...rows);
        if (rows.length < EXPORT_PAGE || accumulator.length >= 50000) break;
        page++;
      }

      const header =
        "email,locale,interested_peptides,source,confirmed,is_test,created_at\n";
      const csv = accumulator
        .map(
          (s) =>
            `"${s.email}","${s.locale}","${(s.interested_peptide_slugs ?? []).join("|")}","${s.source_page ?? ""}",${s.confirmed},${s.is_test},"${s.created_at}"`
        )
        .join("\n");
      const blob = new Blob([header + csv], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `waitlist-${filter}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Експортирани ${accumulator.length} контакта`);
    } catch {
      toast.error("Мрежова грешка при експорт");
    } finally {
      setExporting(false);
    }
  }

  if (!isAuthenticated()) return null;

  const visible = subscribers;
  const realCount = stats?.real ?? 0;
  const testCount = stats?.test ?? 0;
  const totalCount = stats?.total ?? 0;

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
              : `${totalCount.toLocaleString("bg-BG")} общо • ${realCount.toLocaleString("bg-BG")} реални • ${testCount.toLocaleString("bg-BG")} тестови`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshAll}
            className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-navy transition-colors"
          >
            <RefreshCw size={14} />
            Обнови
          </button>
          <button
            onClick={() => setQuickAddOpen(true)}
            className="inline-flex items-center gap-1.5 border border-amber-300 bg-amber-50 text-amber-900 rounded-lg px-4 py-2 text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            <FlaskConical size={14} />
            Добави тестов
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
            disabled={exporting || pagination.total === 0}
            className="inline-flex items-center gap-1.5 bg-navy text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {exporting ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            CSV ({pagination.total.toLocaleString("bg-BG")})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Реални контакти" value={realCount} accent="navy" />
        <StatCard
          label="Тестови имейли"
          value={testCount}
          accent="amber"
          icon={<FlaskConical size={14} />}
        />
        <StatCard label="БГ" value={stats?.realByLocale.bg ?? 0} />
        <StatCard label="EN" value={stats?.realByLocale.en ?? 0} />
      </div>

      {/* Insights — based on real subs only */}
      {stats && (stats.topPeptides.length > 0 || stats.topSources.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {stats.topPeptides.length > 0 && (
            <div className="rounded-xl border border-border bg-white p-5">
              <p className="text-sm font-semibold text-navy mb-3">
                Топ заявени пептиди{" "}
                <span className="text-xs text-muted font-normal">
                  (без тестови)
                </span>
              </p>
              <ol className="space-y-2">
                {stats.topPeptides.map(([slug, count], i) => (
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
          )}
          {stats.topSources.length > 0 && (
            <div className="rounded-xl border border-border bg-white p-5">
              <p className="text-sm font-semibold text-navy mb-3">
                Източници{" "}
                <span className="text-xs text-muted font-normal">
                  (без тестови)
                </span>
              </p>
              <ol className="space-y-2">
                {stats.topSources.map(([source, count]) => (
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
          )}
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
            Всички ({totalCount.toLocaleString("bg-BG")})
          </FilterPill>
          <FilterPill
            active={filter === "real"}
            onClick={() => setFilter("real")}
          >
            Реални ({realCount.toLocaleString("bg-BG")})
          </FilterPill>
          <FilterPill
            active={filter === "test"}
            onClick={() => setFilter("test")}
            icon={<FlaskConical size={11} />}
          >
            Тестови ({testCount.toLocaleString("bg-BG")})
          </FilterPill>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Търсене по имейл..."
            className="text-sm rounded-lg border border-border px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
          <select
            value={pagination.pageSize}
            onChange={(e) =>
              setPagination((p) => ({
                ...p,
                pageSize: parseInt(e.target.value, 10),
              }))
            }
            className="text-sm rounded-lg border border-border px-2 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
            title="Брой редове на страница"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} / стр
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="sticky top-2 z-30 flex items-center justify-between gap-3 rounded-lg bg-navy text-white shadow-lg px-4 py-2.5 text-sm">
          <span className="font-medium">
            Избрани: <span className="tabular">{selected.size}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => bulkSetTest(Array.from(selected), true)}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-white rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <FlaskConical size={12} />
              Маркирай като тест
            </button>
            <button
              onClick={() => bulkSetTest(Array.from(selected), false)}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
            >
              Размаркирай
            </button>
            <button
              onClick={() => bulkDelete(Array.from(selected))}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <Trash2 size={12} />
              Изтрий
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-white/60 hover:text-white text-xs px-2 transition-colors"
            >
              Откажи
            </button>
          </div>
        </div>
      )}

      {/* Subscribers table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-xs uppercase text-muted font-semibold">
              <th className="px-3 py-3 w-10">
                <button
                  onClick={() => {
                    const allSelected = visible.every((s) => selected.has(s.id));
                    if (allSelected) {
                      setSelected((prev) => {
                        const next = new Set(prev);
                        for (const s of visible) next.delete(s.id);
                        return next;
                      });
                    } else {
                      setSelected((prev) => {
                        const next = new Set(prev);
                        for (const s of visible) next.add(s.id);
                        return next;
                      });
                    }
                  }}
                  className="text-muted hover:text-navy transition-colors inline-flex"
                  title="Избери всички видими"
                >
                  {visible.length > 0 && visible.every((s) => selected.has(s.id)) ? (
                    <CheckSquare size={15} className="text-accent" />
                  ) : (
                    <Square size={15} />
                  )}
                </button>
              </th>
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
                <td colSpan={7} className="px-4 py-12 text-center text-muted">
                  Зареждане...
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted">
                  {search
                    ? "Няма съвпадения"
                    : "Все още няма записани в списъка"}
                </td>
              </tr>
            ) : (
              visible.map((s) => {
                const isSelected = selected.has(s.id);
                return (
                  <tr
                    key={s.id}
                    className={`border-b border-border transition-colors ${
                      isSelected
                        ? "bg-accent/5"
                        : s.is_test
                          ? "bg-amber-50/40 hover:bg-amber-50/70"
                          : "hover:bg-surface/50"
                    }`}
                  >
                    <td className="px-3 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          setSelected((prev) => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(s.id);
                            else next.delete(s.id);
                            return next;
                          });
                        }}
                        className="accent-accent"
                      />
                    </td>
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between gap-3 flex-wrap text-sm">
          <p className="text-muted">
            Показва{" "}
            <span className="font-mono tabular text-navy">
              {(pagination.page - 1) * pagination.pageSize + 1}
            </span>
            –
            <span className="font-mono tabular text-navy">
              {Math.min(
                pagination.page * pagination.pageSize,
                pagination.total
              )}
            </span>{" "}
            от{" "}
            <span className="font-mono tabular text-navy">
              {pagination.total.toLocaleString("bg-BG")}
            </span>
          </p>
          <div className="flex items-center gap-1">
            <PagerButton
              disabled={pagination.page <= 1}
              onClick={() =>
                fetchPage(1, pagination.pageSize, filter, search)
              }
              title="Първа страница"
            >
              <ChevronsLeft size={14} />
            </PagerButton>
            <PagerButton
              disabled={pagination.page <= 1}
              onClick={() =>
                fetchPage(
                  pagination.page - 1,
                  pagination.pageSize,
                  filter,
                  search
                )
              }
              title="Предишна"
            >
              <ChevronLeft size={14} />
            </PagerButton>
            <span className="px-3 text-sm text-secondary tabular">
              Стр.{" "}
              <span className="font-bold text-navy">{pagination.page}</span>
              <span className="text-muted"> / {pagination.totalPages}</span>
            </span>
            <PagerButton
              disabled={pagination.page >= pagination.totalPages}
              onClick={() =>
                fetchPage(
                  pagination.page + 1,
                  pagination.pageSize,
                  filter,
                  search
                )
              }
              title="Следваща"
            >
              <ChevronRight size={14} />
            </PagerButton>
            <PagerButton
              disabled={pagination.page >= pagination.totalPages}
              onClick={() =>
                fetchPage(
                  pagination.totalPages,
                  pagination.pageSize,
                  filter,
                  search
                )
              }
              title="Последна страница"
            >
              <ChevronsRight size={14} />
            </PagerButton>
          </div>
        </div>
      )}

      {importOpen && (
        <ImportModal
          token={token}
          onClose={() => setImportOpen(false)}
          onDone={() => {
            setImportOpen(false);
            refreshAll();
          }}
        />
      )}

      {quickAddOpen && (
        <QuickAddModal
          token={token}
          onClose={() => setQuickAddOpen(false)}
          onDone={() => {
            setQuickAddOpen(false);
            refreshAll();
          }}
        />
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function PagerButton({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="inline-flex items-center justify-center min-w-[32px] h-8 rounded-md border border-border bg-white text-secondary hover:text-navy hover:bg-surface transition-colors disabled:opacity-30 disabled:hover:bg-white"
    >
      {children}
    </button>
  );
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

/* ──────────────────────────────────────────────────────────────────────── */
/*                          QUICK ADD TEST MODAL                            */
/* ──────────────────────────────────────────────────────────────────────── */

function QuickAddModal({
  token,
  onClose,
  onDone,
}: {
  token: string | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [emails, setEmails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const parsed = useMemo(() => {
    const seen = new Set<string>();
    const valid: string[] = [];
    let invalid = 0;
    for (const raw of emails.split(/[\s,;]+/)) {
      const e = raw.trim().toLowerCase();
      if (!e) continue;
      const angle = e.match(/<([^>]+)>/);
      const candidate = angle ? angle[1] : e;
      if (!EMAIL_RE.test(candidate)) {
        invalid++;
        continue;
      }
      if (seen.has(candidate)) continue;
      seen.add(candidate);
      valid.push(candidate);
    }
    return { valid, invalid };
  }, [emails]);

  async function submit() {
    if (parsed.valid.length === 0) {
      toast.error("Няма валидни имейли");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/waitlist/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rows: parsed.valid.map((email) => ({ email })),
          defaults: {
            locale: "bg",
            source: "test-group",
            confirmed: true,
            isTest: true,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.error ?? "Грешка");
        return;
      }
      const r = json.data;
      toast.success(
        `Добавени: ${r.imported} тестови • Прескочени: ${r.skipped} (вече съществуват)`
      );
      // If skipped > 0, those emails already exist as non-test — flip them via PATCH
      if (r.skipped > 0) {
        const patchRes = await fetch("/api/admin/waitlist", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ emails: parsed.valid, isTest: true }),
        });
        const patchJson = await patchRes.json();
        if (patchRes.ok && patchJson?.success) {
          toast.success(`Маркирани като тестови: ${patchJson.data.updated}`);
        }
      }
      onDone();
    } catch {
      toast.error("Мрежова грешка");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-navy flex items-center gap-2">
              <FlaskConical size={16} className="text-amber-600" />
              Добави тестови имейли
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Ще се запишат с <code>is_test=true</code> и източник{" "}
              <code>test-group</code>
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

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-secondary mb-1.5">
              Имейли (по един на ред или разделени със запетаи)
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              rows={6}
              autoFocus
              placeholder={`my@email.com\nteam-member@email.com\nqa@email.com`}
              className="w-full font-mono text-xs rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">
                {parsed.valid.length} валидни
                {parsed.invalid > 0 && ` • ${parsed.invalid} невалидни`}
              </span>
              {parsed.valid.length > 0 && (
                <FlaskConical size={12} className="text-amber-600" />
              )}
            </div>
            <p className="text-amber-700">
              Ако имейлът вече съществува като реален контакт, ще бъде
              автоматично маркиран като тестов.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-surface/40 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-sm text-secondary hover:text-navy px-3 py-2 transition-colors disabled:opacity-30"
          >
            Отказ
          </button>
          <button
            onClick={submit}
            disabled={submitting || parsed.valid.length === 0}
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40"
          >
            {submitting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Добавяне...
              </>
            ) : (
              <>
                <Plus size={14} />
                Добави {parsed.valid.length || ""} тестови
              </>
            )}
          </button>
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
