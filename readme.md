skew protection in Next.js using service worker

- service worker is stored in `./sw/sw.ts` along with its specific `tsconfig.json` in the same folder.
- during the build, `esbuild` transforms the `sw.ts` file into `./public/sw.js` file. in the process, it injects the `DEPLOY_ID` variable from Netlify build to be used as the cache version name.
- `webpack-assets-manifest` module generates a list of assets exported by Next.js and stores it in `./.next/assets-manifest.json`; this file is also iincluded in `outputFileTracingIncludes`.

the service worker does the following:

- is able to make a request to `/api/deploy` which is a Next.js API endpoint and returns the current deploy id.
- can also fetch `/api/assets` which returns all the static assets by reading the assets-manifest.json file from above, and caches all the assets returned from that list
- after everything is cached, the service worker tries to respond to all the fetch requests (for JS files) from its cache and tries to fetch it (as well as cache it) if not found in cache

the frontend uses `BroadcastChannel API` to communicate with the service worker:

- once the initial page loads, it sends a `load` message to the sw which triggers the sw to check the deploy id and fetch all assets
- the sw then returns a reply with status as `fresh` or `stale`, the frontend shows a button if `stale`
- once the button is clicked, the fe sends another message to `sw` as `delete` which triggers the sw to delete all the cached data
- the sw then responds with `deleted` and then the page reloads