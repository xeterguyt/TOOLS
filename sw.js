const CACHE = 'titledata-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  // Clear ALL old caches on activate
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  // Network-first: always try GitHub first, fall back to cache only if offline
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        // Clone and cache fresh response
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
