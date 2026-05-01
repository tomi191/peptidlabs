import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  Mail,
  Package,
  Sparkles,
  TrendingUp,
  Info,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  Award,
} from "lucide-react";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { verifyAccountToken } from "@/lib/account/token";
import {
  REDEEM_POINTS,
  REDEEM_VALUE_EUR,
  pointsToNextTier,
  type RewardTier,
  type UserRewards,
} from "@/lib/account/rewards";
import type { Order, OrderItem, Product } from "@/lib/types";
import RequestLinkForm from "@/components/account/RequestLinkForm";
import ReorderButton, {
  type ReorderLine,
} from "@/components/account/ReorderButton";
import LogoutButton from "@/components/account/LogoutButton";
import SessionEmailCache from "@/components/account/SessionEmailCache";

export const dynamic = "force-dynamic";

type OrderWithItems = Order & {
  items: OrderItem[];
};

type AccountPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: AccountPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return {
    title: t("title"),
    description: t("subtitle"),
    robots: { index: false, follow: false },
  };
}

const TIER_STYLES: Record<
  RewardTier,
  { label: string; ring: string; bg: string; text: string; dot: string }
> = {
  bronze: {
    label: "tierBronze",
    ring: "ring-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-800",
    dot: "bg-amber-500",
  },
  silver: {
    label: "tierSilver",
    ring: "ring-slate-300",
    bg: "bg-slate-50",
    text: "text-slate-800",
    dot: "bg-slate-400",
  },
  gold: {
    label: "tierGold",
    ring: "ring-yellow-300",
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    dot: "bg-yellow-500",
  },
};

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-teal-100 text-teal-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatCurrency(amount: number): string {
  // Dual-currency per BG transition law (1.95583 fixed rate)
  const bgn = (Math.round(amount * 195583) / 100000).toFixed(2);
  return `€${amount.toFixed(2)} · ${bgn} лв`;
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === "bg" ? "bg-BG" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function shortOrderId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

export default async function AccountPage({
  params,
  searchParams,
}: AccountPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { token } = await searchParams;
  const tokenStr = Array.isArray(token) ? token[0] : token;

  const t = await getTranslations({ locale, namespace: "account" });
  const tOrders = await getTranslations({ locale, namespace: "orders" });
  const isBg = locale === "bg";

  // ---------- Guest view: no token ----------
  if (!tokenStr) {
    return <GuestView locale={locale} />;
  }

  // ---------- Verify token ----------
  const verified = await verifyAccountToken(tokenStr);
  if (!verified.valid) {
    const reason = verified.reason;
    return (
      <InvalidTokenView
        locale={locale}
        reason={reason === "expired" ? "expired" : "invalid"}
      />
    );
  }

  const email = verified.email;

  // ---------- Fetch orders + rewards ----------
  const supabase = createAdminSupabase();

  // Sanitize for ilike — escape % and _ wildcards even though email comes
  // from a signed JWT token, defensive against future input source changes.
  const safeEmail = email.replace(/[%_]/g, "\\$&");

  const [ordersResult, rewardsResult] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .ilike("email", safeEmail)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("user_rewards")
      .select("*")
      .eq("email", email)
      .maybeSingle(),
  ]);

  const orders: OrderWithItems[] = [];
  if (ordersResult.data && ordersResult.data.length > 0) {
    const orderIds = ordersResult.data.map((o) => o.id);
    const { data: itemRows } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    const itemsByOrder = new Map<string, OrderItem[]>();
    (itemRows ?? []).forEach((row) => {
      const list = itemsByOrder.get(row.order_id) ?? [];
      list.push(row);
      itemsByOrder.set(row.order_id, list);
    });

    for (const o of ordersResult.data) {
      orders.push({ ...o, items: itemsByOrder.get(o.id) ?? [] });
    }
  }

  // Rewards: synthesize a zero-state record if the user has never earned any.
  const rewards: UserRewards = rewardsResult.data ?? {
    email,
    points: 0,
    total_spent: 0,
    tier: "bronze",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Fetch current product data for reorder (only for published items that
  // appear in any of the orders).
  const productIds = Array.from(
    new Set(orders.flatMap((o) => o.items.map((i) => i.product_id)))
  );

  const productsById = new Map<string, Product>();
  if (productIds.length > 0) {
    const { data: productRows } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds)
      .eq("status", "published");
    (productRows ?? []).forEach((p) => productsById.set(p.id, p));
  }

  // Derived metrics
  const payingOrders = orders.filter(
    (o) => o.status !== "cancelled" && o.status !== "pending"
  );
  const lifetimeSpend = payingOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const orderCount = payingOrders.length;
  const tierStyle = TIER_STYLES[rewards.tier];
  const next = pointsToNextTier(rewards.points);

  const euroUntilRedeem = Math.max(0, REDEEM_POINTS - rewards.points);

  return (
    <main className="flex-1 bg-white">
      <SessionEmailCache email={email} />
      <div className="mx-auto max-w-[1280px] px-6 pt-10 pb-20">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-6">
          <Link href="/" className="hover:text-teal-600">
            {isBg ? "Начало" : "Home"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{t("title")}</span>
        </nav>

        <div className="flex items-start justify-between flex-wrap gap-6 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-navy tracking-[-0.03em]">
              {t("welcomeBack")}
            </h1>
            <p className="mt-2 font-mono text-sm text-muted">{email}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Summary grid */}
        <section className="grid gap-4 sm:grid-cols-3 mb-12">
          {/* Total spent */}
          <div className="rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 text-muted">
              <TrendingUp className="h-4 w-4" strokeWidth={1.5} />
              <p className="font-mono text-[10px] uppercase tracking-widest">
                {t("totalSpent")}
              </p>
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-navy tabular-nums">
              {formatCurrency(lifetimeSpend)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {t("orderCount", { count: orderCount })}
            </p>
          </div>

          {/* Loyalty points */}
          <div
            className={`rounded-xl border border-border p-5 ring-1 ${tierStyle.ring} ${tierStyle.bg}`}
          >
            <div className="flex items-center gap-2 text-muted">
              <Sparkles className="h-4 w-4" strokeWidth={1.5} />
              <p className="font-mono text-[10px] uppercase tracking-widest">
                {t("loyaltyPoints")}
              </p>
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-navy tabular-nums">
              {rewards.points}
              <span className="ml-1 text-sm font-medium text-muted">
                {t("pointsUnit")}
              </span>
            </p>
            <p className={`mt-1 text-xs ${tierStyle.text}`}>
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${tierStyle.dot}`}
              />
              {t(tierStyle.label)}
            </p>
          </div>

          {/* Redeem */}
          <div className="rounded-xl border border-dashed border-border bg-surface p-5">
            <div className="flex items-center gap-2 text-muted">
              <Award className="h-4 w-4" strokeWidth={1.5} />
              <p className="font-mono text-[10px] uppercase tracking-widest">
                {t("redeemTitle")}
              </p>
            </div>
            <p className="mt-3 text-sm text-navy font-semibold leading-snug">
              {t("redeemInfo", {
                points: REDEEM_POINTS,
                amount: REDEEM_VALUE_EUR,
              })}
            </p>
            {euroUntilRedeem > 0 ? (
              <p className="mt-1 text-xs text-muted">
                {t("redeemRemaining", { points: euroUntilRedeem })}
              </p>
            ) : (
              <p className="mt-1 text-xs text-teal-700 font-medium">
                {t("redeemReady")}
              </p>
            )}
          </div>
        </section>

        {/* Tier progress (only if below gold) */}
        {next.nextTier && (
          <section className="mb-12 rounded-xl border border-border p-5 max-w-2xl">
            <p className="text-xs text-muted font-mono uppercase tracking-widest">
              {t("tierProgress")}
            </p>
            <p className="mt-2 text-sm text-secondary">
              {t("tierProgressText", {
                points: next.pointsRemaining,
                nextTier: t(
                  next.nextTier === "silver" ? "tierSilver" : "tierGold"
                ),
              })}
            </p>
            <div
              className="mt-3 h-2 rounded-full bg-border overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    next.nextTier === "silver"
                      ? (rewards.points / 50) * 100
                      : ((rewards.points - 50) / 150) * 100
                  )}%`,
                }}
              />
            </div>
          </section>
        )}

        {/* Order history */}
        <section>
          <h2 className="font-display text-xl font-bold text-navy tracking-[-0.02em] mb-5">
            {t("orderHistory")}
          </h2>

          {orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
              <Package
                className="h-10 w-10 text-muted mx-auto"
                strokeWidth={1.5}
              />
              <p className="mt-4 text-sm text-secondary">{t("noOrders")}</p>
              <Link
                href="/shop"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                {t("browseShop")}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => {
                const orderLines: ReorderLine[] = [];
                let skipped = 0;
                for (const it of order.items) {
                  const product = productsById.get(it.product_id);
                  if (product) {
                    orderLines.push({ product, quantity: it.quantity });
                  } else {
                    skipped += 1;
                  }
                }

                return (
                  <li
                    key={order.id}
                    className="rounded-xl border border-border bg-white p-5 hover:border-accent/40 transition-colors"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Link
                            href={`/orders/${order.id}`}
                            className="font-mono text-sm font-semibold text-navy hover:text-teal-700"
                          >
                            {shortOrderId(order.id)}
                          </Link>
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}
                          >
                            {tOrders(order.status)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          {formatDate(order.created_at, locale)} ·{" "}
                          {order.items.length}{" "}
                          {t("itemsCount", { count: order.items.length })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-base font-semibold text-navy tabular-nums">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>

                    {/* Items preview */}
                    <ul className="mt-4 space-y-1">
                      {order.items.slice(0, 3).map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start justify-between gap-3 text-sm"
                        >
                          <span className="text-secondary truncate">
                            {item.quantity} × {item.product_name}
                          </span>
                          <span className="text-muted tabular-nums shrink-0">
                            {formatCurrency(item.unit_price * item.quantity)}
                          </span>
                        </li>
                      ))}
                      {order.items.length > 3 && (
                        <li className="text-xs text-muted">
                          {t("moreItems", { count: order.items.length - 3 })}
                        </li>
                      )}
                    </ul>

                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3 flex-wrap">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-navy hover:text-teal-700 transition-colors"
                      >
                        {t("viewOrder")}
                        <ArrowRight
                          className="h-3.5 w-3.5"
                          strokeWidth={1.5}
                        />
                      </Link>
                      <ReorderButton
                        lines={orderLines}
                        orderId={order.id}
                        skippedCount={skipped}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* How it works */}
        <section className="mt-16 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="flex items-start gap-3 mb-4">
            <Info
              className="h-5 w-5 text-teal-700 shrink-0 mt-0.5"
              strokeWidth={1.5}
            />
            <div>
              <h2 className="font-display text-lg font-bold text-navy">
                {t("howItWorks")}
              </h2>
              <p className="mt-1 text-sm text-secondary leading-relaxed max-w-2xl">
                {t("pointsExplainer", {
                  points: REDEEM_POINTS,
                  amount: REDEEM_VALUE_EUR,
                })}
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <Step
              n={1}
              title={t("hwStep1Title")}
              text={t("hwStep1Text")}
            />
            <Step
              n={2}
              title={t("hwStep2Title")}
              text={t("hwStep2Text")}
            />
            <Step
              n={3}
              title={t("hwStep3Title")}
              text={t("hwStep3Text")}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function Step({
  n,
  title,
  text,
}: {
  n: number;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
        STEP {n.toString().padStart(2, "0")}
      </p>
      <p className="mt-2 text-sm font-semibold text-navy">{title}</p>
      <p className="mt-1 text-xs text-secondary leading-relaxed">{text}</p>
    </div>
  );
}

// ------------------------------------------------------------------
// Guest (no token) view
// ------------------------------------------------------------------

async function GuestView({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "account" });
  const isBg = locale === "bg";

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 pt-10 pb-20">
        <nav className="text-xs text-muted mb-6">
          <Link href="/" className="hover:text-teal-600">
            {isBg ? "Начало" : "Home"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{t("title")}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-navy tracking-[-0.03em]">
              {t("title")}
            </h1>
            <p className="mt-4 text-secondary leading-relaxed max-w-xl">
              {t("subtitle")}
            </p>

            <div className="mt-8">
              <RequestLinkForm />
            </div>

            {/* How it works */}
            <section className="mt-12">
              <h2 className="font-display text-lg font-bold text-navy mb-4">
                {t("howItWorks")}
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Step
                  n={1}
                  title={t("hwStep1Title")}
                  text={t("hwStep1Text")}
                />
                <Step
                  n={2}
                  title={t("hwStep2Title")}
                  text={t("hwStep2Text")}
                />
                <Step
                  n={3}
                  title={t("hwStep3Title")}
                  text={t("hwStep3Text")}
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-xl border border-border p-5">
              <Sparkles
                size={18}
                className="text-teal-600 mb-3"
                strokeWidth={1.5}
              />
              <h3 className="text-sm font-semibold text-navy mb-2">
                {t("sidebarRewardsTitle")}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {t("sidebarRewardsText", {
                  points: REDEEM_POINTS,
                  amount: REDEEM_VALUE_EUR,
                })}
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-surface p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
                {isBg ? "Полезно" : "Helpful"}
              </p>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <Link
                    href="/orders"
                    className="text-navy hover:text-teal-600"
                  >
                    {isBg ? "Проследи поръчка →" : "Track an order →"}
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-navy hover:text-teal-600">
                    {isBg ? "Често задавани въпроси →" : "FAQ →"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-navy hover:text-teal-600"
                  >
                    {isBg ? "Свържете се с нас →" : "Contact support →"}
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// ------------------------------------------------------------------
// Invalid / expired token view
// ------------------------------------------------------------------

async function InvalidTokenView({
  locale,
  reason,
}: {
  locale: string;
  reason: "expired" | "invalid";
}) {
  const t = await getTranslations({ locale, namespace: "account" });
  const isBg = locale === "bg";

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 pt-10 pb-20">
        <nav className="text-xs text-muted mb-6">
          <Link href="/" className="hover:text-teal-600">
            {isBg ? "Начало" : "Home"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{t("title")}</span>
        </nav>

        <div className="max-w-xl">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="h-6 w-6 text-amber-600 shrink-0 mt-1"
              strokeWidth={1.5}
            />
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-navy tracking-[-0.02em]">
                {reason === "expired" ? t("expired") : t("invalidToken")}
              </h1>
              <p className="mt-2 text-secondary leading-relaxed">
                {reason === "expired"
                  ? t("expiredDetail")
                  : t("invalidTokenDetail")}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-border p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-muted mb-3">
              <Mail
                className="inline h-3.5 w-3.5 mr-1 align-middle"
                strokeWidth={1.5}
              />
              {t("requestNewLink")}
            </p>
            <RequestLinkForm />
          </div>
        </div>
      </div>
    </main>
  );
}
