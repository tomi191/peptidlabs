"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useAdmin } from "@/lib/store/admin";
import { LogOut, Package, ShoppingCart, LayoutDashboard, Bell } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdmin();
  const pathname = usePathname();

  // Hydration guard: zustand-persist reads localStorage only after mount.
  // Server renders unauthenticated; client must match on first paint.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{children}</>;

  if (!isAuthenticated()) return <>{children}</>;

  const nav = [
    { href: "/admin/waitlist", label: "Списък (waitlist)", icon: Bell },
    { href: "/admin/orders", label: "Поръчки", icon: ShoppingCart },
    { href: "/admin/products", label: "Продукти", icon: Package },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-navy min-h-screen flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-white/60" />
            <span className="text-white font-semibold text-sm tracking-tight">
              PeptidLabs CMS
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => logout()}
            className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Изход
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-border px-8 py-4 flex items-center justify-between">
          <div className="text-sm text-muted">Административен панел</div>
          <a
            href="/bg/shop"
            target="_blank"
            className="text-xs text-accent hover:underline"
          >
            Виж магазина →
          </a>
        </header>
        <main className="flex-1 px-8 py-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
