const bc = new BroadcastChannel('sw')
// @ts-expect-error
// biome-ignore lint/correctness/noUndeclaredVariables: transformed by esbuild
const cacheVersion = DEPLOY_ID
const pathnameRegex = /\.(?:cs|j)s$/

async function compareDeployDetails() {
  const fetchedResponse = await fetch('/api/deploy')
  const fetchedJson = await fetchedResponse.json()

  if (cacheVersion !== fetchedJson.deployId) {
    return 'stale'
  }

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

async function fetchAndCacheAssets() {
  const response = await fetch('/api/assets')
  const json = await response.json()

  for (const asset of json.assets) {
    await handleRequest(new Request(asset))
  }
}

async function handleRequest(req: Request) {
  const cache = await caches.open(cacheVersion)
  const cachedResponse = await cache.match(req)

  if (cachedResponse) {
    return cachedResponse
  }

  const response = await fetch(req.clone())

  if (response.status < 400) {
    await cache.put(req, response.clone())
  }

  bc.postMessage('error')

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

  if (!pathnameRegex.test(url.pathname)) {
    return
  }

  e.respondWith(handleRequest(e.request))
})

addEventListener('install', skipWaiting, {
  once: true
})

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
        await fetchAndCacheAssets()
        bc.postMessage(status)
      }
      break
    default:
    // no-op
  }
})
