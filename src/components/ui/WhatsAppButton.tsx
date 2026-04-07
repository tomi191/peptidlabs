"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/359XXXXXXXXX"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-colors hover:bg-[#20BD5A]"
    >
      <MessageCircle size={24} className="text-white" />
    </a>
  );
}
