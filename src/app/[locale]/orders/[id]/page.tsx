"use client";

import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Clock,
  CircleCheck,
  Truck,
  Package,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import type { Order } from "@/lib/types";

type OrderStatus = Order["status"];
type StepStatus = Exclude<OrderStatus, "cancelled">;

const STEPS: StepStatus[] = ["pending", "confirmed", "shipped", "delivered"];

const STEP_ICONS: Record<StepStatus, typeof Clock> = {
  pending: Clock,
  confirmed: CircleCheck,
  shipped: Truck,
  delivered: Package,
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-teal-100 text-teal-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number, _currency?: string) {
  return `€${amount.toFixed(2)}`;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("orders");
  const ct = useTranslations("checkout");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          if (!cancelled) setError(true);
          return;
        }
        const json = await res.json();
        if (!json?.success) {
          if (!cancelled) setError(true);
          return;
        }
        if (!cancelled) setOrder(json.data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <Package className="h-10 w-10 text-muted mx-auto" strokeWidth={1.5} />
          <h1 className="text-xl font-semibold text-navy">
            {t("orderNotFound")}
          </h1>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-navy transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("trackTitle")}
          </Link>
        </div>
      </main>
    );
  }

  const activeIndex = order.status === "cancelled" ? -1 : STEPS.indexOf(order.status);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      {/* Back link */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-navy transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("trackTitle")}
      </Link>

      {/* Status Timeline */}
      {order.status !== "cancelled" && (
        <StatusTimeline activeIndex={activeIndex} t={t} />
      )}

      {/* Order Info */}
      <section className="rounded-lg border border-border bg-surface p-6 space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted uppercase tracking-wider">
              {t("orderId")}
            </p>
            <p className="text-sm font-mono font-medium text-navy">
              {order.id}
            </p>
          </div>
          <span
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}
          >
            {t(order.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted">{t("datePlaced")}</p>
            <p className="text-navy font-medium">{formatDate(order.created_at)}</p>
          </div>
          <div>
            <p className="text-muted">{t("paymentMethod")}</p>
            <p className="text-navy font-medium">
              {order.payment_method === "cod" ? ct("cod") : ct("cardPayment")}
            </p>
          </div>
        </div>
      </section>

      {/* Items */}
      {order.items && order.items.length > 0 && (
        <section className="rounded-lg border border-border bg-surface overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-navy">{t("items")}</h2>
          </div>

          {/* Header row (desktop) */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 text-xs text-muted uppercase tracking-wider border-b border-border">
            <span>{t("product")}</span>
            <span className="w-16 text-right">{t("qty")}</span>
            <span className="w-24 text-right">{t("price")}</span>
            <span className="w-24 text-right">{t("lineTotal")}</span>
          </div>

          {order.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-1 sm:gap-4 px-6 py-4 border-b border-border last:border-b-0 text-sm"
            >
              <span className="text-navy font-medium">{item.product_name}</span>
              <span className="w-16 text-right text-secondary">
                <span className="sm:hidden text-muted">{t("qty")}: </span>
                {item.quantity}
              </span>
              <span className="w-24 text-right text-secondary">
                <span className="sm:hidden text-muted">{t("price")}: </span>
                {formatCurrency(item.unit_price, order.currency)}
              </span>
              <span className="w-24 text-right text-navy font-medium">
                <span className="sm:hidden text-muted">{t("lineTotal")}: </span>
                {formatCurrency(item.unit_price * item.quantity, order.currency)}
              </span>
            </div>
          ))}

          {/* Totals */}
          <div className="px-6 py-4 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">{ct("subtotal")}</span>
              <span className="text-navy">{formatCurrency(order.subtotal, order.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">{ct("shippingCost")}</span>
              <span className="text-navy">
                {order.shipping_cost === 0
                  ? ct("freeShipping")
                  : formatCurrency(order.shipping_cost, order.currency)}
              </span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border">
              <span className="text-navy">{ct("total")}</span>
              <span className="text-navy">{formatCurrency(order.total, order.currency)}</span>
            </div>
          </div>
        </section>
      )}

      {/* Shipping Address */}
      <section className="rounded-lg border border-border bg-surface p-6 space-y-2">
        <h2 className="text-sm font-semibold text-navy">{t("shippingAddress")}</h2>
        <div className="text-sm text-secondary space-y-0.5">
          <p>{order.shipping_name}</p>
          <p>{order.shipping_address}</p>
          {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
          <p>
            {order.shipping_city}, {order.shipping_postal_code}
          </p>
          <p>{order.shipping_country}</p>
        </div>
      </section>

      {/* Tracking Number */}
      <section className="rounded-lg border border-border bg-surface p-6 space-y-2">
        <h2 className="text-sm font-semibold text-navy">{t("trackingNumber")}</h2>
        {order.tracking_number ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-navy">
              {order.tracking_number}
            </span>
            {order.tracking_url && (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
              >
                {t("track")}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-secondary">{t("trackingPending")}</p>
        )}
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Status Timeline                                                    */
/* ------------------------------------------------------------------ */

function StatusTimeline({
  activeIndex,
  t,
}: {
  activeIndex: number;
  t: ReturnType<typeof useTranslations<"orders">>;
}) {
  return (
    <>
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-start justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-accent transition-all"
          style={{
            width:
              activeIndex <= 0
                ? "0%"
                : `${(activeIndex / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((step, i) => {
          const Icon = STEP_ICONS[step];
          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;
          const isFuture = i > activeIndex;

          return (
            <div key={step} className="relative flex flex-col items-center z-10" style={{ width: `${100 / STEPS.length}%` }}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted
                    ? "bg-accent text-white"
                    : isActive
                      ? "bg-navy text-white"
                      : "bg-white border-2 border-border text-muted"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCompleted
                    ? "text-accent"
                    : isActive
                      ? "text-navy"
                      : isFuture
                        ? "text-muted"
                        : "text-muted"
                }`}
              >
                {t(step)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="flex sm:hidden flex-col gap-0">
        {STEPS.map((step, i) => {
          const Icon = STEP_ICONS[step];
          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={step} className="flex items-start gap-3">
              {/* Circle + line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? "bg-accent text-white"
                      : isActive
                        ? "bg-navy text-white"
                        : "bg-white border-2 border-border text-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-8 ${
                      isCompleted ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-sm font-medium pt-1.5 ${
                  isCompleted
                    ? "text-accent"
                    : isActive
                      ? "text-navy"
                      : "text-muted"
                }`}
              >
                {t(step)}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
