
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('flor-xr-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './css/styles.css',
        './js/controls.js',
        './assets/img/diagrama_flor.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
