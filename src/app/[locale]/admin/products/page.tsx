"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/store/admin";
import { useRouter, Link } from "@/i18n/navigation";
import { Plus, Pencil, RefreshCw } from "lucide-react";
import type { Product } from "@/lib/types";

const STATUS_OPTIONS = [
  { value: "all", label: "Всички" },
  { value: "draft", label: "Чернова" },
  { value: "published", label: "Публикуван" },
  { value: "out_of_stock", label: "Изчерпан" },
  { value: "archived", label: "Архивиран" },
] as const;

const STATUS_LABELS: Record<string, string> = {
  draft: "Чернова",
  published: "Публикуван",
  out_of_stock: "Изчерпан",
  archived: "Архивиран",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-stone-100 text-stone-700 border-stone-300",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  out_of_stock: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminProductsPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin");
      return;
    }
    fetchProducts(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function fetchProducts(status: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);

      const res = await fetch(`/api/admin/products?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.success) {
          setProducts(json.data);
        }
      }
    } catch {
      // мрежова грешка
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated()) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-navy">Продукти</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => fetchProducts(statusFilter)}
            className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-navy transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Обнови
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 bg-navy text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Нов продукт
          </Link>
        </div>
      </div>

      {/* Табове за статус */}
      <div className="flex gap-1 border-b border-border">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              statusFilter === opt.value
                ? "border-navy text-navy"
                : "border-transparent text-secondary hover:text-navy"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Таблица с продукти */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-xs uppercase text-muted font-semibold">
              <th className="text-left px-4 py-3">Продукт</th>
              <th className="text-left px-4 py-3">SKU</th>
              <th className="text-right px-4 py-3">Цена EUR</th>
              <th className="text-right px-4 py-3">Наличност</th>
              <th className="text-left px-4 py-3">Статус</th>
              <th className="text-center px-4 py-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  Зареждане...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  Няма намерени продукти
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border hover:bg-surface/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                  <td className="px-4 py-3 text-navy font-medium">
                    {product.name}
                    {product.is_bestseller && (
                      <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-teal-50 text-teal-700 border border-teal-200">
                        Топ
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-secondary">
                    {product.sku}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-navy">
                    €{product.price_eur.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-navy">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                        STATUS_COLORS[product.status] ?? ""
                      }`}
                    >
                      {STATUS_LABELS[product.status] ?? product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/admin/products/${product.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 font-medium transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Редактирай
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && products.length > 0 && (
        <p className="text-xs text-muted">{products.length} продукта</p>
      )}
    </div>
  );
}
