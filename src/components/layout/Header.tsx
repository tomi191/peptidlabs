"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Search, ShoppingBag, Menu, Phone, Heart } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import LocaleSwitch from "@/components/ui/LocaleSwitch";
import CartDrawer from "@/components/layout/CartDrawer";
import SearchModal from "@/components/ui/SearchModal";
import { PeptideTicker } from "@/components/layout/PeptideTicker";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { LogoMark } from "@/components/ui/Logo";

/* ── Cart icon with badge (reads Zustand) ── */
function CartIcon({ onClick, label }: { onClick: () => void; label: string }) {
  const totalItems = useCart((s) => s.totalItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? totalItems() : 0;

  return (
    <button
      onClick={onClick}
      className="relative text-navy hover:text-secondary transition-colors duration-150"
      aria-label={label}
    >
      <ShoppingBag size={20} strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center leading-none">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

/* ── Wishlist icon with badge ── */
function WishlistIcon({ label }: { label: string }) {
  const slugs = useWishlist((s) => s.slugs);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? slugs.length : 0;

  return (
    <Link
      href="/wishlist"
      aria-label={label}
      className="relative text-navy hover:text-rose-600 transition-colors duration-150"
    >
      <Heart size={20} strokeWidth={1.5} className={count > 0 ? "fill-rose-500 stroke-rose-500" : ""} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center leading-none">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

/* ── Nav links ── */
const navKeys = ["shop", "encyclopedia", "calculator", "blog", "about"] as const;
const navHrefs: Record<(typeof navKeys)[number], string> = {
  shop: "/shop",
  encyclopedia: "/encyclopedia",
  calculator: "/calculator",
  blog: "/blog",
  about: "/about",
};

/* ── Header ── */
export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("header");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const currencyLabel = "EUR";

  // Ctrl+K / Cmd+K to open search
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, []);

  // Listen for cart/search open requests from toasts and the mobile tab bar
  useEffect(() => {
    function handleOpenCart() {
      setCartOpen(true);
    }
    function handleOpenSearch() {
      setSearchOpen(true);
    }
    window.addEventListener("peptidelab:open-cart", handleOpenCart);
    window.addEventListener("peptidelab:open-search", handleOpenSearch);
    return () => {
      window.removeEventListener("peptidelab:open-cart", handleOpenCart);
      window.removeEventListener("peptidelab:open-search", handleOpenSearch);
    };
  }, []);

  return (
    <>
    <header
      className="sticky top-0 z-30 bg-white/85 supports-[backdrop-filter]:bg-white/70 backdrop-blur-xl border-b border-border/60"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Peptide ticker — website chrome, hidden in installed PWA */}
      <div className="pwa-hide-in-app">
        <PeptideTicker />
      </div>

      {/* Top bar — desktop website chrome, hidden in installed PWA.
          Free-shipping line removed at user request — promo lives in Footer
          + checkout summary instead. */}
      <div className="hidden md:block bg-surface border-b border-border pwa-hide-in-app">
        <div className="flex items-center justify-end text-muted text-xs py-2 px-6">
          <div className="flex items-center gap-3">
            <LocaleSwitch />
            <span className="text-muted text-xs font-mono">{currencyLabel}</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex items-center justify-between py-3 px-4 md:py-4 md:px-6 border-b border-border/60">
        {/* Logo */}
        <Link
          href="/"
          aria-label="PeptidLabs"
          className="inline-flex items-center gap-2.5"
        >
          <LogoMark size={32} />
          <span className="font-semibold tracking-[0.18em] text-navy text-sm">
            PEPTIDLABS
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-8 pwa-hide-when-rail">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={navHrefs[key]}
              className="text-secondary text-sm hover:text-navy transition-colors"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right icons — Search + Cart only */}
        <div className="flex items-center gap-3">
          {/* Desktop: inline pill with placeholder and ⌘K hint */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:border-navy hover:text-navy transition-colors duration-150 min-w-[220px] pwa-hide-when-rail"
            aria-label={tc("searchLabel")}
          >
            <Search size={16} strokeWidth={1.5} />
            <span className="flex-1 text-left">
              {locale === "bg" ? "Търси пептид..." : "Search peptide..."}
            </span>
            <kbd className="hidden lg:inline-flex items-center rounded border border-border bg-white px-1.5 font-mono text-[10px] text-muted">
              ⌘K
            </kbd>
          </button>
          {/* Mobile: icon-only */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden text-navy hover:text-secondary transition-colors duration-150"
            aria-label={tc("searchLabel")}
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          <WishlistIcon label={locale === "bg" ? "Любими" : "Wishlist"} />
          <CartIcon onClick={() => setCartOpen(true)} label={tc("cartLabel")} />

          {/* Hamburger — visible below lg */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-border text-navy hover:border-navy hover:bg-surface transition-colors"
            aria-label={tc("menuLabel")}
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

    </header>

    {/* Drawers/modals must be siblings of <header> — not children — because
        the header has backdrop-filter which creates a containing block for
        position: fixed descendants (collapsing them to header height). */}
    <MobileMenu
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      onOpenSearch={() => setSearchOpen(true)}
      locale={locale}
    />
    <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    <CartDrawer
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      locale={locale}
    />
    </>
  );
}
