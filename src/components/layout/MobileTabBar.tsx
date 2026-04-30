"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, FlaskConical, Search, ShoppingBag, User } from "lucide-react";
import { motion, LayoutGroup } from "motion/react";
import { useCart } from "@/lib/store/cart";
import { haptic } from "@/lib/hooks/useHaptics";

type Tab = {
  key: "home" | "shop" | "search" | "cart" | "account";
  href?: string;
  action?: "search" | "cart";
  icon: typeof Home;
  matchPaths: RegExp;
};

const TABS: Tab[] = [
  { key: "home", href: "/", icon: Home, matchPaths: /^\/$/ },
  { key: "shop", href: "/shop", icon: FlaskConical, matchPaths: /^\/shop/ },
  { key: "search", action: "search", icon: Search, matchPaths: /^\/search/ },
  { key: "cart", action: "cart", icon: ShoppingBag, matchPaths: /^\/cart/ },
  {
    key: "account",
    href: "/account",
    icon: User,
    matchPaths: /^\/(account|orders)/,
  },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const locale = useLocale();
  const isBg = locale === "bg";
  const totalItems = useCart((s) => s.totalItems);
  const hasHydrated = useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false,
  );

  // Bridge to existing global modals via custom events
  const openSearch = () => {
    haptic("select");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("peptidelab:open-search"));
    }
  };
  const openCart = () => {
    haptic("select");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("peptidelab:open-cart"));
    }
  };

  // Hide tab bar on full-screen flows (checkout, admin)
  if (
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  const cartCount = hasHydrated ? totalItems() : 0;
  const labels: Record<Tab["key"], string> = {
    home: isBg ? "Начало" : "Home",
    shop: isBg ? "Магазин" : "Shop",
    search: isBg ? "Търси" : "Search",
    cart: isBg ? "Кошница" : "Cart",
    account: isBg ? "Профил" : "Account",
  };

  return (
    <nav
      role="navigation"
      aria-label={isBg ? "Долна навигация" : "Bottom navigation"}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="pointer-events-auto mx-auto mb-2 max-w-md px-3">
        <LayoutGroup>
          <div
            className="relative flex items-center justify-around rounded-full border border-border/60 bg-white/85 px-2 py-1.5 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.18)]"
            style={{
              backdropFilter: "saturate(180%) blur(20px)",
              WebkitBackdropFilter: "saturate(180%) blur(20px)",
            }}
          >
            {TABS.map((tab) => {
              const isActive = tab.matchPaths.test(pathname);
              const Icon = tab.icon;
              const label = labels[tab.key];
              const showBadge = tab.key === "cart" && cartCount > 0;

              const inner = (
                <span
                  className={`relative flex h-11 min-w-[56px] items-center justify-center gap-1.5 rounded-full px-3 transition-colors ${
                    isActive ? "text-white" : "text-secondary"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-navy"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.6}
                    aria-hidden
                  />
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, x: -4, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden whitespace-nowrap text-xs font-semibold tracking-tight"
                    >
                      {label}
                    </motion.span>
                  )}
                  {showBadge && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </span>
              );

              const sharedProps = {
                "aria-label": label,
                "aria-current": isActive ? ("page" as const) : undefined,
                onClick: () => haptic("tap"),
                className: "flex-1 flex items-center justify-center",
              };

              if (tab.action === "search") {
                return (
                  <button
                    key={tab.key}
                    type="button"
                    {...sharedProps}
                    onClick={openSearch}
                  >
                    {inner}
                  </button>
                );
              }
              if (tab.action === "cart") {
                return (
                  <button
                    key={tab.key}
                    type="button"
                    {...sharedProps}
                    onClick={openCart}
                  >
                    {inner}
                  </button>
                );
              }
              return (
                <Link key={tab.key} href={tab.href!} {...sharedProps}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </nav>
  );
}
