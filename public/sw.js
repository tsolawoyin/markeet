const CACHE_NAME = "markeet-v1";
const urlsToCache = [
  "/",
  "/browse",
  "/login",
  "/sign-up",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.warn("Failed to cache some URLs:", error);
        // Don't fail the install if some URLs can't be cached
        return Promise.resolve();
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip caching for API requests and other special URLs
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200) {
            return response;
          }

          // Don't cache if it's not a successful response
          if (response.type === "error") {
            return response;
          }

          // Clone the response and cache it
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch((err) => {
              console.warn("Failed to cache:", event.request.url, err);
            });
          });

          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(event.request);
        });
    })
  );
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || "New notification from Markeet",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: "markeet-notification",
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(data.title || "Markeet", options));
});
