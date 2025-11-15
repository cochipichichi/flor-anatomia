
const CACHE_NAME = 'flor-xr-lab-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/main.js',
  './manifest.webmanifest',
  './assets/img/flor_hero.png',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  './assets/img/favicon-16.png',
  './assets/img/favicon-32.png',
  './assets/models/anatomia_flor.glb',
  './assets/data/anatomia_flor_partes.csv',
  './viewer3D/flor-3d.html',
  './viewerAR/flor-ar.html',
  './viewerVR/flor-vr.html',
  './dashboard.html',
  './docente.html',
  './comparador.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
