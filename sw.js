// Service worker : met toute l'application en cache pour un usage hors connexion.
// Pensez à incrémenter VERSION à chaque déploiement.

const VERSION = "v1";
const CACHE = `fallout-companion-${VERSION}`;

const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/app.css",
  "js/app.js",
  "js/store.js",
  "js/ui.js",
  "js/views.js",
  "js/tools.js",
  "js/game-icons.js",
  "js/icons-ui.js",
  "js/data/actions.js",
  "js/data/topics.js",
  "js/data/glossary.js",
  "js/data/setup.js",
  "fonts/oswald.woff2",
  "fonts/share-tech-mono.woff2",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "img/hero.jpg",
  "img/photo-cartes.jpg",
  "img/photo-special.jpg",
  "img/photo-tuiles.jpg",
  "img/photo-ennemis.jpg",
  "img/photo-des.jpg",
  "img/coop-agenda.jpg",
  "img/trait-bien-repose.png",
  "img/trait-accro.png",
  "img/trait-idolatre.png",
  "img/trait-vilipende.png",
  "img/trait-synthe.png",
  "img/trait-super-mutant.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Cache d'abord, mise à jour en arrière-plan (stale-while-revalidate).
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => { if (res.ok) cache.put(req, res.clone()); return res; })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
