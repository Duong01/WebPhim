const CACHE_NAME = 'phim360-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/Logo.png',
  '/favicon.ico'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.log('Cache addAll error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});


// Fetch event
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // ❗ Chỉ xử lý GET
  if (request.method !== 'GET') return;

  // ❗ BỎ QUA request không phải http/https
  if (!request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) return response;

      return fetch(request)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});
