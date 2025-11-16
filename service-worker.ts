const CACHE_NAME = 'scenic-route-finder-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/services/geminiService.ts',
  '/hooks/useLibrary.ts',
  '/components/Header.tsx',
  '/components/WelcomeScreen.tsx',
  '/components/LoadingSpinner.tsx',
  '/components/ErrorDisplay.tsx',
  '/components/ResultDisplay.tsx',
  '/components/SourceLinks.tsx',
  '/components/DestinationInput.tsx',
  '/components/LibraryScreen.tsx',
  '/manifest.json',
  '/metadata.json'
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event: any) => {
  const requestUrl = new URL(event.request.url);

  // We only want to apply caching logic to our own app files, from our own origin.
  const isAppFile = requestUrl.origin === self.location.origin &&
                    (urlsToCache.includes(requestUrl.pathname) || requestUrl.pathname === '/');

  if (isAppFile) {
    // For our app files, use a "cache, then network" (cache-first) strategy.
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Return from cache if available.
          if (cachedResponse) {
            return cachedResponse;
          }
          // Otherwise, fetch from the network.
          return fetch(event.request).then((networkResponse) => {
            // And cache the new version for next time.
            // Check for a valid response before caching.
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          });
        })
    );
  } else {
    // For all other requests (CDNs, APIs, platform scripts),
    // let the browser handle it by not calling event.respondWith().
    // This ensures we don't interfere with them.
    return;
  }
});


self.addEventListener('activate', (event: any) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
