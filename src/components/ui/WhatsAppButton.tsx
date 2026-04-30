"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "@/i18n/navigation";

export default function WhatsAppButton() {
  const pathname = usePathname();
  // Don't show on full-screen flows where it would clash
  if (pathname.startsWith("/checkout") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href="https://wa.me/359XXXXXXXXX"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_24px_-6px_rgba(37,211,102,0.55)] transition-transform hover:scale-105 active:scale-95"
      style={{
        bottom:
          "calc(env(safe-area-inset-bottom) + var(--mobile-tab-offset, 1.5rem))",
      }}
    >
      <MessageCircle size={22} className="text-white" strokeWidth={2} />
    </a>
  );
}
