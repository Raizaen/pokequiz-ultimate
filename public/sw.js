const CACHE = 'pokequiz-images-v2'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('pokequiz-images-') && key !== CACHE).map((key) => caches.delete(key)))),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  const cacheableImageHost = url.hostname === 'raw.githubusercontent.com' || url.hostname === 'cdn.jsdelivr.net'
  if (event.request.method !== 'GET' || !cacheableImageHost) return
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(event.request)
      if (cached) return cached
      const response = await fetch(event.request)
      if (response.ok || response.type === 'opaque') cache.put(event.request, response.clone())
      return response
    }),
  )
})
