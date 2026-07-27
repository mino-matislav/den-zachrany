/* ============================================
   DEŇ ZÁCHRANY - Service Worker
   ============================================ */

const CACHE_NAME = 'den-zachrany-v6';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/kapitoly.html',
    '/kapitola.html',
    '/piesne.html',
    '/piesen.html',
    '/css/style.css',
    '/js/app.js',
    '/js/player.js',
    '/js/data.js',
    '/js/data-songs.js',
    '/manifest.json',
    '/assets/icon-192.png',
    '/assets/icon-512.png',
    '/assets/audio/uvod.mp3'
];

// Inštalácia — cache statických súborov
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(STATIC_ASSETS);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

// Aktivácia — vyčistiť staré cache
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(name) {
                    return name !== CACHE_NAME;
                }).map(function(name) {
                    return caches.delete(name);
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// Fetch — cache-first stratégia
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Vrátiť z cache ak existuje
                if (response) {
                    return response;
                }

                // Inak fetch zo siete
                return fetch(event.request)
                    .then(function(networkResponse) {
                        // Cache-ovať nové požiadavky (nie API)
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        var responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });

                        return networkResponse;
                    })
                    .catch(function() {
                        // Offline fallback
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});
