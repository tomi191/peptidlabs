"use client";

import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useAdmin } from "@/lib/store/admin";
import { createClient } from "@/lib/supabase/client";
import {
  Sparkles,
  ExternalLink,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  slug: string;
  title_bg: string | null;
  title_en: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tags: string[] | null;
}

export default function AdminBlogListPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAdmin();
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated()) {
      router.push("/admin");
      return;
    }
    void loadPosts();
  }, [mounted, isAuthenticated, router]);

  async function loadPosts() {
    setLoading(true);
    try {
      const sb = createClient();
      const { data, error } = await sb
        .from("blog_posts")
        .select(
          "id, slug, title_bg, title_en, status, published_at, created_at, updated_at, tags",
        )
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setPosts((data ?? []) as BlogPost[]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Грешка при зареждане");
    } finally {
      setLoading(false);
    }
  }

  async function actOnPost(id: string, action: "publish" | "unpublish") {
    setActingId(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error ?? "Грешка");
      toast.success(action === "publish" ? "Публикувано" : "Скрито");
      await loadPosts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Грешка");
    } finally {
      setActingId(null);
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Сигурен ли си? Това е необратимо.")) return;
    setActingId(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error ?? "Грешка");
      toast.success("Изтрито");
      await loadPosts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Грешка");
    } finally {
      setActingId(null);
    }
  }

  if (!mounted || !isAuthenticated()) return null;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Блог</h1>
          <p className="text-sm text-muted mt-1">
            Генериране, редактиране и публикуване на статии
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy/90 transition-colors"
        >
          <Sparkles size={16} />
          Нова статия (AI)
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center text-sm text-muted">
          <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
          Зареждане...
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <p className="text-sm text-muted">
            Няма статии. Кликни &quot;Нова статия (AI)&quot; за да генерираш.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full">
            <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Заглавие</th>
                <th className="px-4 py-3 w-24">Статус</th>
                <th className="px-4 py-3 w-32">Обновено</th>
                <th className="px-4 py-3 w-48 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-navy text-sm">
                      {p.title_bg || p.title_en || "(no title)"}
                    </p>
                    <p className="font-mono text-[11px] text-muted mt-0.5">
                      /blog/{p.slug}
                    </p>
                    {p.tags && p.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {p.tags.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-mono text-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        p.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.status === "published" ? "Публикувано" : "Чернова"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted tabular">
                    {new Date(p.updated_at).toLocaleDateString("bg-BG", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/bg/blog/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded p-1.5 text-muted hover:bg-surface hover:text-navy"
                        title="Виж страницата"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() =>
                          actOnPost(
                            p.id,
                            p.status === "published" ? "unpublish" : "publish",
                          )
                        }
                        disabled={actingId === p.id}
                        className="rounded p-1.5 text-muted hover:bg-surface hover:text-navy disabled:opacity-50"
                        title={
                          p.status === "published" ? "Скрий" : "Публикувай"
                        }
                      >
                        {actingId === p.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : p.status === "published" ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => deletePost(p.id)}
                        disabled={actingId === p.id}
                        className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        title="Изтрий"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
