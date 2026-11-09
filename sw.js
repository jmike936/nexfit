const CACHE_NAME = 'nexfit-app-shell-v3';
const APP_FILES = [
  './',
  './index.html',
  './manifest.json',
  './musculacao.js?v=20261109.47',
  './workout-history.js?v=20261109.47',
  './exercise-evolution.js?v=20261109.47',
  './version.json',
  './favicon.ico',
  './assets/nexfit-pwa.svg',
  './assets/nexfit-apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all([cache.addAll(APP_FILES), cache.add('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2').catch(() => null)]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('nexfit-app-shell-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin && request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
        return response;
      }).catch(async () => (await caches.match(request)) || (await caches.match('./index.html')))
    );
    return;
  }

  const isSupabaseSdk = url.hostname === 'cdn.jsdelivr.net' && url.pathname.startsWith('/npm/@supabase/supabase-js@2');
  const isAppAsset = url.origin === self.location.origin && /\.(?:js|json|svg|png|ico|css)$/i.test(url.pathname);
  if (!isSupabaseSdk && !isAppAsset) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        fetch(request).then(response => {
          if (response && (response.ok || response.type === 'opaque')) {
            caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(request).then(response => {
        if (response && (response.ok || response.type === 'opaque')) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
