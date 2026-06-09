// Marine Weather Dashboard — Service Worker
// index.html  → network-first (always fresh when online)
// tide-db.js  → cache-first  (12 MB, changes annually)
// API calls   → network-first with offline fallback
// tiles/CDN   → network-first

const CACHE_NAME = 'mwd-v1';

const API_ORIGINS = [
  'https://api.open-meteo.com',
  'https://marine-api.open-meteo.com',
  'https://api.weather.bom.gov.au',
  'https://api.weather.gov.au',
  'https://nominatim.openstreetmap.org',
];

// ── Install: pre-cache tide-db (big static file) ──────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.add('./tide-db.js').catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ───────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const path = url.pathname;

  // tide-db.js: cache-first (large, rarely changes)
  if (path.endsWith('tide-db.js')) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Everything else: network-first
  // (index.html, API calls, tiles, CDN, icons — always try network)
  event.respondWith(networkFirst(event.request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline — resource not cached', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: true, reason: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
