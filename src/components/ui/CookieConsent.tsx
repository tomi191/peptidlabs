"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-navy text-white px-6 py-4">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/90">
          We use cookies to improve your experience. By continuing, you agree to
          our cookie policy.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-white/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
