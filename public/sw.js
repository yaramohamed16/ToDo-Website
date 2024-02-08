let cacheName = "reactCache";
let assets = [
  "http://localhost:3000/static/js/bundle.js",
  "http://localhost:3000/favicon.ico",
  "http://localhost:3000/logo192.png",
  "http://localhost:3000/manifest.json",
  "/",
];

this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

this.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});
