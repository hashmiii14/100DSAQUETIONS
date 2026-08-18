// Service Worker for DSA Problems (dsaproblems.site)
const CACHE_NAME = 'dsaproblems-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/ads.txt',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/llms-full.txt',
  '/ai.txt',
  '/.well-known/ai-plugin.json',
  '/.well-known/agentic.json',
  '/images/og-image.png',
  '/images/upi-qr.png',
  '/data/questions.js',
  '/data/questions.min.js',
  '/data/questions.json',
  '/data/guide_data.js',
  '/data/patterns.js',
  '/data/ds_algo_library.js',
  '/data/tracks.js',
  '/js/state.js',
  '/js/recommendation.js',
  '/js/duplicate_prevention.js'
];

// Install Event: Cache essential core static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Cleanup stale old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Stale-While-Revalidate Caching Strategy for superfast loads
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests or Google AdSense / external API calls
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
