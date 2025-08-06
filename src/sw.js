const CACHE_NAME = 'plano-viagem-v7';
const urlsToCache = [
  '/',
  '/app-manifest.json',
  '/assets/icons/bear-family.png',
  '/favicon.ico'
];

// Detectar Safari
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Install event
self.addEventListener('install', event => {
  console.log('SW: Instalando nova versão');
  // Força a ativação imediata da nova versão
  self.skipWaiting();

  // No Safari, ser mais conservador com o cache
  if (!isSafari) {
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
  }
});

// Fetch event - Melhorado para Safari e Firebase
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // No Safari, ser mais conservador - não interceptar muitas requisições
  if (isSafari) {
    // No Safari, só interceptar requisições muito específicas
    if (event.request.method !== 'GET' ||
      !url.startsWith(self.location.origin) ||
      url.includes('googleapis.com') ||
      url.includes('firebase.com') ||
      url.includes('firebaseapp.com') ||
      url.includes('chrome-extension://')) {
      return;
    }

    // No Safari, preferir sempre a rede
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Só cachear se a resposta for ok
          if (response.ok && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              })
              .catch(error => {
                console.log('SW: Erro ao cachear no Safari:', error);
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback para cache apenas se a rede falhar
          return caches.match(event.request);
        })
    );
    return;
  }

  // Comportamento normal para outros browsers
  // Skip non-GET requests, chrome-extension requests, and Firebase requests
  if (event.request.method !== 'GET' ||
    url.startsWith('chrome-extension://') ||
    url.includes('googleapis.com') ||
    url.includes('firebase.com') ||
    url.includes('firebaseapp.com')) {
    return;
  }

  // Só interceptar requisições locais da aplicação
  if (!url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('SW: Servindo do cache:', url);
          return response;
        }

        console.log('SW: Buscando da rede:', url);
        return fetch(event.request).catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('SW: Ativando nova versão');
  // Toma controle imediato de todas as abas
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