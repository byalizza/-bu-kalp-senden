const CACHE_NAME = 'bks-v1';
const ASSETS = [
  '/-bu-ask-bitmez/',
  '/-bu-ask-bitmez/index.html',
  '/-bu-ask-bitmez/manifest.json',
  '/-bu-ask-bitmez/css/style.css',
  '/-bu-ask-bitmez/js/config.js',
  '/-bu-ask-bitmez/js/firebase-init.js',
  '/-bu-ask-bitmez/js/app.js',
  '/-bu-ask-bitmez/js/widgets/login.js',
  '/-bu-ask-bitmez/js/widgets/counter.js',
  '/-bu-ask-bitmez/js/widgets/music.js',
  '/-bu-ask-bitmez/js/widgets/mascot.js',
  '/-bu-ask-bitmez/js/widgets/memories.js',
  '/-bu-ask-bitmez/js/widgets/locket.js'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/-bu-ask-bitmez/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('/-bu-ask-bitmez/') && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});