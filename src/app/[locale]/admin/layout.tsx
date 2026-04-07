"use client";

import { Link } from "@/i18n/navigation";
import { useAdmin } from "@/lib/store/admin";
import { LogOut, Package, ShoppingCart } from "lucide-react";
import { usePathname } from "@/i18n/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, logout } = useAdmin();
  const pathname = usePathname();

  // If not authenticated, render children (which will be the login page)
  if (!isAuthenticated()) {
    return <>{children}</>;
  }

  const navLinks = [
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: Package },
  ] as const;

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-border px-6 py-3 flex items-center justify-between">
        <Link
          href="/admin"
          className="font-semibold text-navy text-sm tracking-tight"
        >
          PeptideLab Admin
        </Link>

        <div className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  isActive
                    ? "text-navy font-medium"
                    : "text-secondary hover:text-navy"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 text-sm text-secondary hover:text-navy transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
