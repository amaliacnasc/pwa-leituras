const CACHE_NAME = 'readMe';
const urlsToCache = [
  '/',
  '/index.html', 
  '/js/app.js', 
  '/css/styles.css', 
  '/css/index.css',
  '/manifest.json',
  '/icons/icon-192.jpg', 
  '/icons/icon-512.png', 
  '/assets/favicon.png', 
];

// Instalando o Service Worker e armazenando em cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptando requisições para servir conteúdo do cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Atualizando o cache quando o Service Worker é ativado
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
