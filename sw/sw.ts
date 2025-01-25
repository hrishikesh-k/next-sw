const bc = new BroadcastChannel('sw')
const cacheVersion = crypto.getRandomValues(new Uint32Array(1)).toString()

async function compareDeployDetails() {
  const cache = await caches.open(cacheVersion)
  const cachedResponse = await cache.match('deploy')
  const fetchedResponse = await fetch('/deploy')
  const fetchedJson = await fetchedResponse.json()

  if (cachedResponse) {
    const cachedJson = await cachedResponse.json()
    if (
      cachedJson.deployId === '' ||
      cachedJson.deployId !== fetchedJson.deployId
    ) {
      return 'stale'
    }
  }

  await cache.put(
    'deploy',
    Response.json({
      deployId: fetchedJson.deployId,
      lastFetched: Date.now()
    })
  )

  return 'fresh'
}

async function deleteUnusedCache(all = false) {
  const cacheKeys = await caches.keys()

  for (const key of cacheKeys) {
    if (all) {
      await caches.delete(key)
    } else if (!key.includes(cacheVersion)) {
      await caches.delete(key)
    }
  }
}

async function handleRequest(e: FetchEvent) {
  const cache = await caches.open(cacheVersion)
  const cachedResponse = await cache.match(e.request)

  if (cachedResponse) {
    return cachedResponse
  }

  const response = await fetch(e.request.clone())

  if (response.status < 400) {
    await cache.put(e.request, response.clone())
  }

  return response
}

addEventListener(
  'activate',
  (e) => {
    e.waitUntil(deleteUnusedCache())
  },
  {
    once: true
  }
)

addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  if (!url.pathname.endsWith('.js')) {
    return
  }
  e.respondWith(handleRequest(e))
})

addEventListener('install', skipWaiting)

bc.addEventListener('message', async (e) => {
  switch (e.data) {
    case 'delete':
      {
        await deleteUnusedCache(true)
        bc.postMessage('deleted')
      }
      break
    case 'load':
      {
        const status = await compareDeployDetails()
        bc.postMessage(status)
      }
      break
    default:
    // no-op
  }
})
