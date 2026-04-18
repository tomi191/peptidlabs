"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const t = useTranslations("account");
  const router = useRouter();

  function handleLogout() {
    // Clear any cached email from sessionStorage (used for cross-page rewards hints).
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem("peptidlabs_account_email");
      } catch {
        /* noop */
      }
    }
    // Strip the token — navigate back to /account without any query params.
    router.replace("/account");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-navy transition-colors"
    >
      <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
      {t("logout")}
    </button>
  );
}
