/**
 * sw.js — ERP Knowledge Tracker Service Worker
 * Strategy:
 *   - Static assets (HTML/CSS/JS/fonts): Cache-First with background revalidation
 *   - API calls (script.google.com): Network-Only (never cache — always fresh data)
 *   - Offline fallback: serve cached index.html for navigation requests
 */

const CACHE_NAME    = 'erp-tracker-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './config.js',
  './css/style.css',
  './js/i18n.js',
  './js/api.js',
  './js/auth.js',
  './js/dashboard.js',
  './js/modules.js',
  './js/categories.js',
  './js/topics.js',
  './js/knowledge.js',
  './js/reviews.js',
  './js/analytics.js',
  './js/profile.js',
  './js/notes.js',
  './js/app.js'
];

// ── Install: pre-cache all static assets ─────────────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(() => { /* ignore individual failures */ })
        )
      );
    })
  );
});

// ── Activate: remove stale caches ────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: serve strategy based on request type ──────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Never intercept API / OAuth calls — always go to network
  if (
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('googleusercontent.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('fonts.g')
  ) {
    return; // Let browser handle it
  }

  // Navigation requests — serve cached index.html as offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('./index.html')
      )
    );
    return;
  }

  // Static assets — Cache-First, revalidate in background (Stale-While-Revalidate)
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        const networkFetch = fetch(event.request).then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => null);

        return cached || networkFetch;
      })
    )
  );
});

// ── Background Sync: retry failed writes when back online ────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-pending-writes') {
    // Clients handle their own pending write queue via IndexedDB
    // We just notify them that connectivity is restored
    self.clients.matchAll().then(clients =>
      clients.forEach(client => client.postMessage({ type: 'ONLINE' }))
    );
  }
});

// ── Push message relay to clients ────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
