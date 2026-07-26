const CACHE = 'pokequiz-images-v1'

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('pokequiz-images-') && key !== CACHE).map((key) => caches.delete(key)))),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET' || !url.hostname.includes('raw.githubusercontent.com')) return
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
