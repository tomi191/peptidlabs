import Script from "next/script";

/**
 * Plausible Analytics — privacy-first, no cookies, GDPR-compliant.
 * Only renders when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set.
 *
 * Self-hosted or plausible.io — configure via env:
 *  - NEXT_PUBLIC_PLAUSIBLE_DOMAIN   (e.g. "peptidlabs.eu")
 *  - NEXT_PUBLIC_PLAUSIBLE_SRC      (optional override, default https://plausible.io/js/script.js)
 */
export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  const src =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ??
    "https://plausible.io/js/script.js";
  return (
    <Script
      defer
      data-domain={domain}
      src={src}
      strategy="afterInteractive"
    />
  );
}
