const CACHE_NAME = "cache_v3";
const urlsToCache = [];

// Got this code from https://developers.google.com/web/fundamentals/primers/service-workers
self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        try {
          // Do not try to cache items that come from another domain, or from
          // chrome-extension://
          const parts = event.request.referrer.split("://");
          const protocol = parts[0];
          const referrerDomain = `${protocol}://${
            (parts[1] || "").split("/")[0]
          }`;
          const requestUrl = event.request.url;
          if (requestUrl.indexOf(referrerDomain) !== 0) {
            return response;
          }

          if (
            requestUrl.indexOf("_next/static/") > -1 ||
            requestUrl.indexOf("/images/") > -1
          ) {
            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, responseToCache);
            });
          }
        } catch (err) {
          console.error(
            "Caught error trying to cache the request",
            err,
            event.request
          );
        }

        return response;
      });
    })
  );
});

self.addEventListener("activate", function (event) {
  var cacheAllowlist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
