const CACHE_NAME = 'bks-v3';
const ASSETS = [
  '/-bu-kalp-senden/',
  '/-bu-kalp-senden/index.html',
  '/-bu-kalp-senden/manifest.json',
  '/-bu-kalp-senden/css/style.css',
  '/-bu-kalp-senden/js/config.js',
  '/-bu-kalp-senden/js/app.js',
  '/-bu-kalp-senden/js/firebase-init.js',
  '/-bu-kalp-senden/js/blockblast.js',
  '/-bu-kalp-senden/js/widgets/login.js',
  '/-bu-kalp-senden/js/widgets/counter.js',
  '/-bu-kalp-senden/js/widgets/kalbim.js',
  '/-bu-kalp-senden/js/widgets/music.js',
  '/-bu-kalp-senden/js/widgets/mascot.js',
  '/-bu-kalp-senden/js/widgets/locket.js',
  '/-bu-kalp-senden/js/widgets/anilar.js',
  '/-bu-kalp-senden/js/widgets/profil.js',
  '/-bu-kalp-senden/data/kalbim.json',
  '/-bu-kalp-senden/data/memories.json'
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
  const url = e.notification.data?.url || '/-bu-kalp-senden/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('/-bu-kalp-senden/') && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});