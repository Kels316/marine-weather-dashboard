// Marine Weather Dashboard — Service Worker
// Strategy: cache-first for shell, network-first for API calls

const CACHE_NAME = 'mwd-v1';
const SHELL_ASSETS = [
  './',
  './index.html',
  './tide-db.js',
];

const API_ORIGINS = [
  'https://api.open-meteo.com',
  'https://marine-api.open-meteo.com',
  'https://api.weather.bom.gov.au',
  'https://api.weather.gov.au',
  'https://nominatim.openstreetmap.org',
];

// ── Install: cache app shell ──────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache what we can; ignore failures (tide-db may 404 depending on deploy)
      return Promise.allSettled(SHELL_ASSETS.map(url => cache.add(url)));
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ───────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls: network-first, fall back to cache
  if (API_ORIGINS.some(o => event.request.url.startsWith(o))) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Leaflet tiles and CDN assets: network-first (stale ok)
  if (url.hostname.includes('tile.') || url.hostname.includes('cdnjs') ||
      url.hostname.includes('unpkg') || url.hostname.includes('jsdelivr')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // App shell: cache-first
  event.respondWith(cacheFirst(event.request));
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
