import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Google Analytics 4 with Consent Mode v2 (GDPR-compliant).
 *
 * - GA loads on every page (needed to fire consent + page_view events).
 * - All consent flags DEFAULT to "denied" — no personal data is processed
 *   until the user accepts cookies via <CookieConsent />.
 * - When the user accepts, the consent banner dispatches a window event
 *   ("peptidlab:analytics-consent-granted") that this script listens for
 *   and calls gtag('consent', 'update', { analytics_storage: 'granted', ... }).
 * - When the user declines, GA still runs but in cookieless / non-personalized
 *   mode — Google's recommended pattern, gives aggregate traffic numbers
 *   without violating ePrivacy / GDPR.
 *
 * Env: set NEXT_PUBLIC_GA_ID=G-NHY8648JFX in .env / Vercel.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        id="ga4-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            // Consent Mode v2 — default all denied, EU region treated explicitly.
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'denied',
              personalization_storage: 'denied',
              security_storage: 'granted',
              wait_for_update: 500,
              region: ['EU', 'EEA', 'BG']
            });

            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });

            // Replay any stored consent decision (set by CookieConsent on accept)
            try {
              var stored = localStorage.getItem('peptidelab_consent');
              if (stored === 'accepted') {
                gtag('consent', 'update', {
                  ad_storage: 'granted',
                  ad_user_data: 'granted',
                  ad_personalization: 'granted',
                  analytics_storage: 'granted',
                  functionality_storage: 'granted',
                  personalization_storage: 'granted'
                });
              }
            } catch (e) {}

            // Listen for live consent grants (banner click during this session)
            window.addEventListener('peptidlab:analytics-consent-granted', function() {
              gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted',
                functionality_storage: 'granted',
                personalization_storage: 'granted'
              });
            });

            window.addEventListener('peptidlab:analytics-consent-denied', function() {
              gtag('consent', 'update', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                functionality_storage: 'denied',
                personalization_storage: 'denied'
              });
            });
          `,
        }}
      />
    </>
  );
}
