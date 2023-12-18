// The version of the cache.
const VERSION = 'v1';

// The name of the cache
const CACHE_NAME = `period-tracker-${VERSION}`;

// The static resources that the app needs to function
const APP_STATIC_RESOURCES = [
    "/",
    "/stylesheets/style.css",
    "/javascripts/main.js",
    "/javascripts/cycletracker.json",
    "/images/circle.svg",
    "/images/tire.svg",
    "/images/wheel.svg",
    "/images/tree.png",
    "/images/modern.png",
    "/images/icon-mng-strgy-color.svg",
    "/images/icon-mng-strgy-white.svg"
];

// On install, cache the static resources
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(APP_STATIC_RESOURCES);
        })()
    );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log("deleted cache name: ", name);
                        return caches.delete(name);
                    }
                })
            );
            await clients.claim();
        })()
    )
});

self.addEventListener("fetch", (event) => {
    // when seeking an HTML page
    if (event.request.mode === 'navigate') {
        // Return to the index.html page
        event.respondWith(caches.match("/"));
        return;
    }

    // For every other request type
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request.url);
            if (cachedResponse) {
                // Return the cached response if it's available
                return cachedResponse;
            }
            // Respond with a HTTP 404 response status
            return new Response(null, {status: 404});
        })()
    );

});
