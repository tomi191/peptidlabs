"use client";

import { useEffect, useState, use } from "react";
import { useAdmin } from "@/lib/store/admin";
import { useRouter, Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  Truck,
  ChevronDown,
  Package,
  Save,
  CheckCircle,
} from "lucide-react";
import type { Order, OrderItem } from "@/lib/types";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-teal-50 text-teal-700 border-teal-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const COURIER_OPTIONS = [
  { value: "", label: "Select courier" },
  { value: "econt", label: "Econt" },
  { value: "speedy", label: "Speedy" },
  { value: "international", label: "International" },
] as const;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type OrderWithItems = Order & { items: OrderItem[] };

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { token, isAuthenticated } = useAdmin();

  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  // Status update
  const [newStatus, setNewStatus] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);

  // Tracking update
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courier, setCourier] = useState("");
  const [trackingSaving, setTrackingSaving] = useState(false);
  const [trackingSaved, setTrackingSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin");
      return;
    }
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchOrder() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.success) {
          setOrder(json.data);
          setNewStatus(json.data.status);
          setTrackingNumber(json.data.tracking_number ?? "");
        }
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate() {
    if (!newStatus || newStatus === order?.status) return;
    setStatusSaving(true);
    setStatusSaved(false);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.success) {
          setOrder((prev) => (prev ? { ...prev, ...json.data } : prev));
          setStatusSaved(true);
          setTimeout(() => setStatusSaved(false), 2000);
        }
      }
    } catch {
      // Error silently
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleTrackingUpdate() {
    if (!trackingNumber.trim()) return;
    setTrackingSaving(true);
    setTrackingSaved(false);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trackingNumber: trackingNumber.trim(),
          courier: courier || undefined,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.success) {
          setOrder((prev) => (prev ? { ...prev, ...json.data } : prev));
          setTrackingSaved(true);
          setTimeout(() => setTrackingSaved(false), 2000);
        }
      }
    } catch {
      // Error silently
    } finally {
      setTrackingSaving(false);
    }
  }

  if (!isAuthenticated()) return null;

  if (loading) {
    return (
      <div className="py-12 text-center text-muted text-sm">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-muted text-sm">Order not found</p>
        <Link
          href="/admin/orders"
          className="text-sm text-accent hover:text-accent/80"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="text-secondary hover:text-navy transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-navy flex items-center gap-3">
            Order
            <span className="font-mono text-sm font-normal text-secondary">
              {order.id}
            </span>
          </h1>
          <p className="text-sm text-muted mt-0.5">
            {formatDate(order.created_at)}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded text-sm font-medium capitalize border ${
            STATUS_COLORS[order.status] ?? ""
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — order items + shipping */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <section className="border border-border rounded-lg overflow-hidden">
            <div className="bg-surface px-4 py-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-muted" />
              <h2 className="text-xs font-semibold uppercase text-muted">
                Items
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted border-b border-border">
                  <th className="text-left px-4 py-2">Product</th>
                  <th className="text-center px-4 py-2">Qty</th>
                  <th className="text-right px-4 py-2">Unit Price</th>
                  <th className="text-right px-4 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 text-navy">
                      {item.product_name}
                    </td>
                    <td className="px-4 py-3 text-center text-secondary">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-secondary">
                      {item.unit_price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-navy">
                      {(item.unit_price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-border px-4 py-3 space-y-1">
              <div className="flex justify-between text-sm text-secondary">
                <span>Subtotal</span>
                <span>{order.subtotal.toFixed(2)} {order.currency}</span>
              </div>
              <div className="flex justify-between text-sm text-secondary">
                <span>Shipping</span>
                <span>{order.shipping_cost.toFixed(2)} {order.currency}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-navy pt-1 border-t border-border">
                <span>Total</span>
                <span>{order.total.toFixed(2)} {order.currency}</span>
              </div>
            </div>
          </section>

          {/* Shipping address */}
          <section className="border border-border rounded-lg overflow-hidden">
            <div className="bg-surface px-4 py-3">
              <h2 className="text-xs font-semibold uppercase text-muted">
                Shipping Address
              </h2>
            </div>
            <div className="px-4 py-4 text-sm text-navy space-y-1">
              <p className="font-medium">{order.shipping_name}</p>
              <p className="text-secondary">{order.shipping_address}</p>
              {order.shipping_address_line2 && (
                <p className="text-secondary">
                  {order.shipping_address_line2}
                </p>
              )}
              <p className="text-secondary">
                {order.shipping_city}, {order.shipping_postal_code}
              </p>
              <p className="text-secondary">{order.shipping_country}</p>
            </div>
          </section>
        </div>

        {/* Right column — actions */}
        <div className="space-y-6">
          {/* Contact info */}
          <section className="border border-border rounded-lg overflow-hidden">
            <div className="bg-surface px-4 py-3">
              <h2 className="text-xs font-semibold uppercase text-muted">
                Contact
              </h2>
            </div>
            <div className="px-4 py-4 text-sm space-y-2">
              <div>
                <span className="text-muted text-xs uppercase">Email</span>
                <p className="text-navy">{order.email}</p>
              </div>
              <div>
                <span className="text-muted text-xs uppercase">Phone</span>
                <p className="text-navy">{order.phone}</p>
              </div>
              <div>
                <span className="text-muted text-xs uppercase">Payment</span>
                <p className="text-navy capitalize">
                  {order.payment_method === "stripe"
                    ? "Card (Stripe)"
                    : "Cash on Delivery"}
                </p>
              </div>
            </div>
          </section>

          {/* Update status */}
          <section className="border border-border rounded-lg overflow-hidden">
            <div className="bg-surface px-4 py-3">
              <h2 className="text-xs font-semibold uppercase text-muted">
                Update Status
              </h2>
            </div>
            <div className="px-4 py-4 space-y-3">
              <div className="relative">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full appearance-none rounded-md border border-border bg-white px-3 py-2 pr-8 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent capitalize"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              </div>
              <button
                onClick={handleStatusUpdate}
                disabled={
                  statusSaving || newStatus === order.status
                }
                className="w-full inline-flex items-center justify-center gap-2 bg-navy text-white rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {statusSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {statusSaving ? "Saving..." : "Update Status"}
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Tracking */}
          <section className="border border-border rounded-lg overflow-hidden">
            <div className="bg-surface px-4 py-3 flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted" />
              <h2 className="text-xs font-semibold uppercase text-muted">
                Tracking
              </h2>
            </div>
            <div className="px-4 py-4 space-y-3">
              <div className="relative">
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full appearance-none rounded-md border border-border bg-white px-3 py-2 pr-8 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                >
                  {COURIER_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              </div>

              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Tracking number"
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm font-mono text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />

              {order.tracking_number && (
                <p className="text-xs text-muted">
                  Current:{" "}
                  <span className="font-mono text-secondary">
                    {order.tracking_number}
                  </span>
                </p>
              )}

              <button
                onClick={handleTrackingUpdate}
                disabled={trackingSaving || !trackingNumber.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-navy text-white rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {trackingSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4" />
                    {trackingSaving ? "Saving..." : "Save Tracking"}
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
