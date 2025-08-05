const CACHE_NAME = 'plano-viagem-v6';
const urlsToCache = [
  '/',
  '/app-manifest.json',
  '/assets/icons/bear-family.png',
  '/favicon.ico'
];

// Install event
self.addEventListener('install', event => {
  console.log('SW: Instalando nova versão');
  // Força a ativação imediata da nova versão
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - Melhorado para Safari e Firebase
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Log para debug (remover depois)
  if (url.includes('googleapis.com')) {
    console.log('SW: Ignorando requisição Firebase:', url);
  }
  
  // Skip non-GET requests, chrome-extension requests, and Firebase requests
  if (event.request.method !== 'GET' || 
      url.startsWith('chrome-extension://') ||
      url.includes('googleapis.com') ||
      url.includes('firebase.com') ||
      url.includes('firebaseapp.com')) {
    // Não interceptar - deixar passar direto
    return;
  }
  
  // Só interceptar requisições locais da aplicação
  if (!url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('SW: Servindo do cache:', url);
          return response;
        }
        
        console.log('SW: Buscando da rede:', url);
        return fetch(event.request).catch(() => {
          // Fallback for offline
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