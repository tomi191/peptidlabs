"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Search,
  Package,
  BookOpen,
  Calculator,
  PenLine,
  Info,
  Truck,
  HelpCircle,
  MessageCircle,
  Mail,
  ShieldCheck,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import LocaleSwitch from "@/components/ui/LocaleSwitch";

type NavGroup = {
  label: string;
  items: {
    key: string;
    href: string;
    icon: LucideIcon;
    description?: string;
  }[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  locale: string;
};

export function MobileMenu({ open, onClose, onOpenSearch, locale }: Props) {
  const t = useTranslations("nav");
  const tc = useTranslations("header");
  const isBg = locale === "bg";

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Esc
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [open, onClose]);

  const groups: NavGroup[] = [
    {
      label: isBg ? "Магазин" : "Shop",
      items: [
        {
          key: "shop",
          href: "/shop",
          icon: Package,
          description: isBg ? "Изследователски пептиди" : "Research peptides",
        },
        {
          key: "encyclopedia",
          href: "/encyclopedia",
          icon: BookOpen,
          description: isBg ? "Научна база знания" : "Scientific knowledge base",
        },
        {
          key: "whatArePeptides",
          href: "/what-are-peptides",
          icon: HelpCircle,
          description: isBg ? "Ръководство за начинаещи" : "Beginners guide",
        },
        {
          key: "calculator",
          href: "/calculator",
          icon: Calculator,
          description: isBg ? "Доза & реконституция" : "Dose & reconstitution",
        },
      ],
    },
    {
      label: isBg ? "За нас" : "About",
      items: [
        {
          key: "about",
          href: "/about",
          icon: Info,
          description: isBg ? "Мисия и екип" : "Mission and team",
        },
        {
          key: "blog",
          href: "/blog",
          icon: PenLine,
          description: isBg ? "Статии и проучвания" : "Articles and research",
        },
        {
          key: "coaVault",
          href: "/coa-vault",
          icon: FileCheck,
          description: isBg ? "Сертификати за анализ" : "Certificates of analysis",
        },
      ],
    },
    {
      label: isBg ? "Помощ" : "Help",
      items: [
        {
          key: "delivery",
          href: "/delivery",
          icon: Truck,
          description: isBg ? "Срокове и плащане" : "Shipping and payment",
        },
        {
          key: "faq",
          href: "/faq",
          icon: HelpCircle,
          description: isBg ? "Често задавани въпроси" : "Frequently asked",
        },
        {
          key: "contact",
          href: "/contact",
          icon: MessageCircle,
          description: isBg ? "Свържете се с нас" : "Contact us",
        },
        {
          key: "orders",
          href: "/orders",
          icon: Mail,
          description: isBg ? "Проследи поръчка" : "Track order",
        },
      ],
    },
  ];

  const navLabels: Record<string, string> = {
    shop: t("shop"),
    encyclopedia: t("encyclopedia"),
    whatArePeptides: isBg ? "Какво са пептидите?" : "What are peptides?",
    calculator: t("calculator"),
    about: t("about"),
    blog: t("blog"),
    coaVault: isBg ? "COA Vault" : "COA Vault",
    delivery: isBg ? "Доставка и плащане" : "Delivery & payment",
    faq: isBg ? "Често задавани въпроси" : "FAQ",
    contact: isBg ? "Свържете се с нас" : "Contact",
    orders: isBg ? "Проследи поръчка" : "Track order",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-navy/30 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={isBg ? "Главно меню" : "Main menu"}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-sm flex-col overflow-hidden bg-white shadow-2xl lg:hidden"
          >
            {/* Top aurora tint */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-60 opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse at top right, rgba(13,148,136,0.25) 0%, transparent 70%)",
              }}
            />

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-navy">
                  <span className="text-sm font-semibold leading-none text-white">
                    P
                  </span>
                </div>
                <span className="font-mono text-sm font-semibold tracking-widest text-navy">
                  PEPTIDLABS
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                aria-label={tc("closeMenuLabel")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-navy hover:bg-surface transition-colors"
              >
                <X size={18} strokeWidth={1.5} />
              </motion.button>
            </div>

            {/* Search trigger */}
            <div className="relative px-5 pt-4">
              <button
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted hover:border-navy hover:text-navy transition-colors"
              >
                <Search size={16} strokeWidth={1.5} />
                <span className="flex-1 text-left">
                  {isBg ? "Търси пептид..." : "Search peptide..."}
                </span>
              </button>
            </div>

            {/* Scrollable nav body */}
            <div className="relative flex-1 overflow-y-auto px-5 pb-28 pt-5 scroll-hidden">
              {groups.map((group, gi) => (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.05 + gi * 0.06,
                    type: "spring",
                    stiffness: 220,
                    damping: 28,
                  }}
                  className="mb-6"
                >
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {group.items.map(({ key, href, icon: Icon, description }) => (
                      <Link
                        key={key}
                        href={href}
                        onClick={onClose}
                        className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 hover:border-border hover:bg-surface transition-colors"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-navy group-hover:bg-white group-hover:text-teal-600 transition-colors">
                          <Icon size={18} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-navy text-sm leading-tight">
                            {navLabels[key] ?? key}
                          </p>
                          {description && (
                            <p className="mt-0.5 text-[11px] text-muted leading-tight">
                              {description}
                            </p>
                          )}
                        </div>
                        <ArrowRight
                          size={14}
                          className="text-muted group-hover:text-navy group-hover:translate-x-0.5 transition-all shrink-0"
                        />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Trust strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 rounded-xl border border-teal-200 bg-teal-50/50 p-4"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-teal-700 shrink-0" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-teal-700">
                    {isBg ? "HPLC верифицирано" : "HPLC verified"}
                  </p>
                </div>
                <p className="mt-1.5 text-xs text-secondary leading-relaxed">
                  {isBg
                    ? "Чистота над 98% · Сертификат за анализ с всяка поръчка · Изпращаме от ЕС склад."
                    : "Purity above 98% · COA with every order · Shipped from EU warehouse."}
                </p>
              </motion.div>
            </div>

            {/* Sticky footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-white/95 backdrop-blur-md">
              <div className="flex items-center justify-between px-5 py-3.5">
                <LocaleSwitch />
                <a
                  href="https://wa.me/359XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy/90 transition-colors"
                >
                  <MessageCircle size={12} strokeWidth={2} />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
