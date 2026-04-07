"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import LocaleSwitch from "@/components/ui/LocaleSwitch";

/* ── Cart icon with badge (reads Zustand) ── */
function CartIcon() {
  const totalItems = useCart((s) => s.totalItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? totalItems() : 0;

  return (
    <button className="relative text-navy hover:text-secondary transition-colors">
      <ShoppingBag size={20} strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center leading-none">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

/* ── Nav links ── */
const navKeys = ["shop", "encyclopedia", "blog", "about"] as const;
const navHrefs: Record<(typeof navKeys)[number], string> = {
  shop: "/shop",
  encyclopedia: "/encyclopedia",
  blog: "/blog",
  about: "/about",
};

/* ── Header ── */
export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("header");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header>
      {/* Top bar — hidden on mobile */}
      <div className="hidden md:block bg-surface border-b border-border">
        <div className="flex items-center justify-between text-muted text-xs py-2 px-6">
          <span>{tc("freeShipping")}</span>
          <div className="flex items-center gap-3">
            <LocaleSwitch />
            <span className="text-muted text-xs font-mono">EUR</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex items-center justify-between py-4 px-6 border-b border-border bg-white">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-navy rounded-md flex items-center justify-center">
            <span className="text-white text-sm font-semibold leading-none">
              P
            </span>
          </div>
          <span className="font-semibold tracking-widest text-navy text-sm">
            PEPTIDELAB
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-8">
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

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button className="text-navy hover:text-secondary transition-colors hidden sm:block">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button className="text-navy hover:text-secondary transition-colors hidden sm:block">
            <Heart size={20} strokeWidth={1.5} />
          </button>
          <button className="text-navy hover:text-secondary transition-colors hidden sm:block">
            <User size={20} strokeWidth={1.5} />
          </button>
          <CartIcon />

          {/* Hamburger — visible below lg */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden text-navy hover:text-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={22} strokeWidth={1.5} />
            ) : (
              <Menu size={22} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="lg:hidden bg-white border-b border-border py-4 px-6 flex flex-col gap-4">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={navHrefs[key]}
              onClick={() => setMobileOpen(false)}
              className="text-secondary text-sm hover:text-navy transition-colors"
            >
              {t(key)}
            </Link>
          ))}

          {/* Mobile-only icon row */}
          <div className="flex items-center gap-4 pt-2 border-t border-border sm:hidden">
            <button className="text-navy hover:text-secondary transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button className="text-navy hover:text-secondary transition-colors">
              <Heart size={20} strokeWidth={1.5} />
            </button>
            <button className="text-navy hover:text-secondary transition-colors">
              <User size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile locale switch */}
          <div className="pt-2 border-t border-border md:hidden">
            <LocaleSwitch />
          </div>
        </nav>
      )}
    </header>
  );
}
