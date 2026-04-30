"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAdmin } from "@/lib/store/admin";
import { Bell, Mail, Download, RefreshCw } from "lucide-react";

type Subscriber = {
  id: string;
  email: string;
  locale: string;
  interested_peptide_slugs: string[];
  source_page: string | null;
  confirmed: boolean;
  created_at: string;
};

export default function AdminWaitlistPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAdmin();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

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
    </div>
  );
}
