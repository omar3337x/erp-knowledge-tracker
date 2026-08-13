/**
 * sw.js — ERP Knowledge Tracker High Performance Service Worker
 *
 * PERF FEATURES:
 *   - Offline-First CacheStorage Strategy for static assets (HTML/CSS/JS/fonts)
 *   - Stale-While-Revalidate background asset refreshing
 *   - Background Sync Event ('sync-pending-writes') handling for offline mutation queues
 *   - Automatic Guard against chrome-extension:// and non-http(s) schemes
 *   - Never intercepts GAS API calls to ensure zero preflight side-effects
 */

const CACHE_NAME    = 'erp-tracker-v4';
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
  './js/sync.js',
  './js/app.js'
];

// PERF: Install & Pre-cache All Static Assets in CacheStorage
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(() => {}))
      );
    })
  );
});

// PERF: Activate & Purge Stale Version Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// PERF: Fetch Handler - Offline-First + Stale-While-Revalidate
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Scheme Guard: never cache chrome-extension:// or unsupported schemes
  if (event.request.url.startsWith('chrome-extension://') ||
      (!event.request.url.startsWith('http://') && !event.request.url.startsWith('https://'))) {
    return;
  }

  // Network-Only for Google Apps Script Web App endpoints
  if (
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('googleusercontent.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('fonts.g')
  ) {
    return;
  }

  // Navigation requests — serve cached index.html as offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Static assets — CacheStorage First, revalidate in background (Stale-While-Revalidate)
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

// PERF: Background Sync API Handler
self.addEventListener('sync', event => {
  if (event.tag === 'sync-pending-writes' || event.tag === 'sync') {
    self.clients.matchAll().then(clients =>
      clients.forEach(client => client.postMessage({ type: 'ONLINE' }))
    );
  }
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
