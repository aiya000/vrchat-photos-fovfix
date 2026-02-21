const CACHE_NAME = 'vrchat-fovfix-v1'

const PRECACHE_URLS = ['', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'].map(
  (relativePath) => new URL(relativePath, self.registration.scope).href,
)

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('vrchat-fovfix-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached !== undefined) {
        return cached
      }
      return fetch(event.request).then((response) => {
        if (!response.ok) return response
        const cloned = response.clone()
        event.waitUntil(
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, cloned))
            .catch((err) => console.warn('Cache write failed:', err)),
        )
        return response
      })
    }),
  )
})
