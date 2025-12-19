const CACHE_NAME = 'plano-viagem-v8';
const urlsToCache = [
  '/',
  '/app-manifest.json',
  '/assets/icons/bear-family.png',
  '/favicon.ico'
];

// Install event
self.addEventListener('install', event => {
  console.log('SW: Instalando nova versão');
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('SW: Erro ao abrir cache:', error);
      })
  );
});

// Fetch event - Network First strategy
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Skip non-GET requests and external requests
  if (event.request.method !== 'GET' ||
    url.startsWith('chrome-extension://') ||
    url.includes('googleapis.com') ||
    url.includes('firebase') ||
    url.includes('firestore')) {
    return;
  }

  // Só interceptar requisições locais
  if (!url.startsWith(self.location.origin)) {
    return;
  }

  // Network First - sempre tenta a rede primeiro
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a resposta for válida, cacheia
        if (response.ok && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Se a rede falhar, tenta o cache
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            // Fallback para a página principal
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Activate event - limpa caches antigos
self.addEventListener('activate', event => {
  console.log('SW: Ativando nova versão');
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('SW: Deletando cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});
