self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Pass-through for now to ensure online functionality
    // In future, implement caching strategy here
    event.respondWith(fetch(event.request));
});
