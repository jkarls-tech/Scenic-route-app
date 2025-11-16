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
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              if(!event.request.url.startsWith('https://aistudiocdn.com')) {
                 return response;
              }
            }

            // Clone the response because it's also a stream.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // We don't cache CDN resources to avoid issues, only our app files.
                if (urlsToCache.includes(new URL(event.request.url).pathname) || event.request.url.endsWith('/')) {
                   cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
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
