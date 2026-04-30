"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Home,
  FlaskConical,
  Calculator,
  BookOpen,
  Package,
  PenLine,
  ShieldCheck,
  Search,
  ShoppingBag,
  User,
  Settings,
} from "lucide-react";
import { motion, LayoutGroup } from "motion/react";
import { useCart } from "@/lib/store/cart";
import { haptic } from "@/lib/hooks/useHaptics";

type RailItem = {
  key: string;
  href?: string;
  action?: "search" | "cart";
  icon: typeof Home;
  label: { bg: string; en: string };
  matchPaths?: RegExp;
};

const PRIMARY: RailItem[] = [
  {
    key: "home",
    href: "/",
    icon: Home,
    label: { bg: "Начало", en: "Home" },
    matchPaths: /^\/$/,
  },
  {
    key: "shop",
    href: "/shop",
    icon: FlaskConical,
    label: { bg: "Магазин", en: "Shop" },
    matchPaths: /^\/shop/,
  },
  {
    key: "calc",
    href: "/calculator",
    icon: Calculator,
    label: { bg: "Калкулатор", en: "Calculator" },
    matchPaths: /^\/calculator/,
  },
  {
    key: "encyclopedia",
    href: "/encyclopedia",
    icon: BookOpen,
    label: { bg: "Енциклопедия", en: "Encyclopedia" },
    matchPaths: /^\/encyclopedia/,
  },
  {
    key: "coa",
    href: "/coa-vault",
    icon: ShieldCheck,
    label: { bg: "COA Vault", en: "COA Vault" },
    matchPaths: /^\/coa-vault/,
  },
  {
    key: "blog",
    href: "/blog",
    icon: PenLine,
    label: { bg: "Блог", en: "Blog" },
    matchPaths: /^\/blog/,
  },
];

const SECONDARY: RailItem[] = [
  {
    key: "search",
    action: "search",
    icon: Search,
    label: { bg: "Търси", en: "Search" },
  },
  {
    key: "cart",
    action: "cart",
    icon: ShoppingBag,
    label: { bg: "Кошница", en: "Cart" },
  },
  {
    key: "orders",
    href: "/orders",
    icon: Package,
    label: { bg: "Поръчки", en: "Orders" },
    matchPaths: /^\/orders/,
  },
  {
    key: "account",
    href: "/account",
    icon: User,
    label: { bg: "Профил", en: "Account" },
    matchPaths: /^\/account/,
  },
];

export function DesktopAppRail() {
  const pathname = usePathname();
  const locale = useLocale();
  const isBg = locale === "bg";
  const totalItems = useCart((s) => s.totalItems);
  const hasHydrated = useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
  const cartCount = hasHydrated ? totalItems() : 0;

  const openSearch = () => {
    haptic("select");
    window.dispatchEvent(new CustomEvent("peptidelab:open-search"));
  };
  const openCart = () => {
    haptic("select");
    window.dispatchEvent(new CustomEvent("peptidelab:open-cart"));
  };

  if (
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  function Item({ item }: { item: RailItem }) {
    const isActive = item.matchPaths?.test(pathname) ?? false;
    const Icon = item.icon;
    const label = isBg ? item.label.bg : item.label.en;
    const showBadge = item.key === "cart" && cartCount > 0;

    const inner = (
      <span
        className={`group/item relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
          isActive
            ? "text-white"
            : "text-secondary hover:text-navy hover:bg-surface"
        }`}
      >
        {isActive && (
          <motion.span
            layoutId="rail-pill"
            className="absolute inset-0 -z-10 rounded-xl bg-navy"
            transition={{ type: "spring", stiffness: 480, damping: 36 }}
          />
        )}
        <Icon size={20} strokeWidth={isActive ? 2 : 1.6} aria-hidden />
        {showBadge && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
        {/* Tooltip */}
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-navy px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/item:opacity-100"
        >
          {label}
        </span>
      </span>
    );

    const sharedProps = {
      "aria-label": label,
      "aria-current": isActive ? ("page" as const) : undefined,
      onClick: () => haptic("tap"),
    };

    if (item.action === "search") {
      return (
        <button type="button" {...sharedProps} onClick={openSearch}>
          {inner}
        </button>
      );
    }
    if (item.action === "cart") {
      return (
        <button type="button" {...sharedProps} onClick={openCart}>
          {inner}
        </button>
      );
    }
    return (
      <Link href={item.href!} {...sharedProps}>
        {inner}
      </Link>
    );
  }

  return (
    <aside
      role="navigation"
      aria-label={isBg ? "Странична навигация" : "Side navigation"}
      className="pwa-side-rail fixed left-0 top-0 bottom-0 z-30 w-16 flex-col items-center bg-white/90 backdrop-blur-xl border-r border-border/70"
      style={{
        paddingTop: "calc(env(titlebar-area-height, env(safe-area-inset-top, 0px)) + 12px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
      }}
    >
      <Link
        href="/"
        aria-label="PeptidLabs home"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #0d9488 100%)",
        }}
      >
        <span className="text-sm font-bold">P</span>
      </Link>

      <LayoutGroup>
        <nav className="mt-6 flex flex-col items-center gap-1">
          {PRIMARY.map((item) => (
            <Item key={item.key} item={item} />
          ))}
        </nav>

        <div className="my-4 h-px w-8 bg-border" />

        <nav className="flex flex-col items-center gap-1">
          {SECONDARY.map((item) => (
            <Item key={item.key} item={item} />
          ))}
        </nav>
      </LayoutGroup>

      <div className="mt-auto flex flex-col items-center gap-1">
        <button
          type="button"
          aria-label={isBg ? "Настройки" : "Settings"}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-muted hover:text-navy hover:bg-surface transition-colors"
          onClick={() => haptic("tap")}
        >
          <Settings size={18} strokeWidth={1.6} />
        </button>
      </div>
    </aside>
  );
}
