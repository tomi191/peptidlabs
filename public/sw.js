/* PeptidLabs Service Worker — production v1
   Strategy:
   - Precache: app shell (offline page)
   - Static assets (/_next/static, fonts, images): cache-first
   - Pages (HTML): network-first with offline fallback
   - API calls: network-only (never cache stripe/auth)
*/

const VERSION = "v1.0.0";
const CACHE_STATIC = `peptidlabs-static-${VERSION}`;
const CACHE_PAGES = `peptidlabs-pages-${VERSION}`;
const CACHE_IMAGES = `peptidlabs-images-${VERSION}`;
const OFFLINE_URL = "/offline.html";

const PRECACHE = [OFFLINE_URL, "/icon.svg", "/icon-maskable.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_STATIC)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("peptidlabs-") &&
                ![CACHE_STATIC, CACHE_PAGES, CACHE_IMAGES].includes(key),
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/static/") ||
    /\.(css|js|woff2?|ttf|otf|eot)$/i.test(url.pathname)
  );
}

function isImage(url) {
  return /\.(png|jpe?g|gif|webp|avif|svg|ico)$/i.test(url.pathname);
}

function isApiOrAuth(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/account") ||
    url.pathname.includes("/checkout") ||
    url.hostname.includes("stripe.com") ||
    url.hostname.includes("supabase.co") ||
    url.hostname.includes("plausible.io") ||
    url.hostname.includes("sentry.io")
  );
}

function isHTMLRequest(request) {
  return (
    request.mode === "navigate" ||
    (request.method === "GET" &&
      request.headers.get("accept")?.includes("text/html"))
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET; pass everything else through
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Never touch cross-origin or sensitive endpoints
  if (url.origin !== self.location.origin) return;
  if (isApiOrAuth(url)) return;

  // Static assets: cache-first
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, CACHE_STATIC));
    return;
  }

  // Images: cache-first with small cap
  if (isImage(url)) {
    event.respondWith(cacheFirst(request, CACHE_IMAGES));
    return;
  }

  // HTML pages: network-first, fallback to cache, then offline
  if (isHTMLRequest(request)) {
    event.respondWith(networkFirst(request, CACHE_PAGES));
    return;
  }
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type === "basic") {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return cached || Response.error();
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL);
    return offline || Response.error();
  }
}

// Allow page to ask SW to update immediately
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
