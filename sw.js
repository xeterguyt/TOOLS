const CACHE = 'utm-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(resp => { const c=resp.clone(); caches.open(CACHE).then(ca=>ca.put(e.request,c)); return resp; })
      .catch(() => caches.match(e.request))
  );
});
