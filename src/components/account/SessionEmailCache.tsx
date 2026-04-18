"use client";

import { useEffect } from "react";

/**
 * Caches the signed-in email into sessionStorage so other client components
 * (e.g. product-page loyalty hints) can surface a personalised message
 * without round-tripping through a token. Cleared by LogoutButton.
 */
export default function SessionEmailCache({ email }: { email: string }) {
  useEffect(() => {
    if (!email) return;
    try {
      window.sessionStorage.setItem("peptidlabs_account_email", email);
    } catch {
      /* storage may be disabled — silently ignore */
    }
  }, [email]);

  return null;
}
