"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/store/admin";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Eye, RefreshCw } from "lucide-react";
import type { Order } from "@/lib/types";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-teal-50 text-teal-700 border-teal-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const PAYMENT_COLORS: Record<string, string> = {
  stripe: "bg-indigo-50 text-indigo-700 border-indigo-200",
  cod: "bg-stone-100 text-stone-700 border-stone-300",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateId(id: string): string {
  return id.slice(0, 8) + "...";
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin");
      return;
    }
    fetchOrders(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function fetchOrders(status: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // Network error — leave orders empty
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated()) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-navy">Orders</h1>
        <button
          onClick={() => fetchOrders(statusFilter)}
          className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-navy transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Status filter tabs */}
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

      {/* Orders table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-xs uppercase text-muted font-semibold">
              <th className="text-left px-4 py-3">Order ID</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Payment</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Total</th>
              <th className="text-center px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-muted"
                >
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-muted"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border hover:bg-surface/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-navy">
                    {truncateId(order.id)}
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-3 text-navy">{order.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                        PAYMENT_COLORS[order.payment_method] ?? ""
                      }`}
                    >
                      {order.payment_method === "stripe" ? "Card" : "COD"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize border ${
                        STATUS_COLORS[order.status] ?? ""
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-navy">
                    {order.total.toFixed(2)} {order.currency}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 font-medium transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && orders.length > 0 && (
        <p className="text-xs text-muted">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
