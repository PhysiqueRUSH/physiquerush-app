// NOM DU CACHE
const CACHE_NAME = 'physiquerush-v1.04';

// Liste de tous les fichiers à mettre en cache pour le mode hors ligne
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './physiquerush.png', // La bannière d'accueil
    './icon-512.png',     // La nouvelle icône carrée pour l'app
    './MIAH.png',
    './record.png',
    './fury.png',
    // Images Personnages
    './evo1.png', './evo2.png', './evo3.png', './evo4.png', './evo5.png', './evo6.png',
    './evo7.png', './evo8.png', './evo9.png', './evo10.png', './evo11.png', './evo12.png',
    // Images Boss Entraînement
    './btb1.png', './btb2.png', './btb3.png', './btb4.png',
    // Images Boss Trophées
    './boss1.png', './boss2.png', './boss3.png', './boss4.png',
    // Librairie externe (graphique)
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Installation du Service Worker (mise en cache initiale)
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force l'activation immédiate du nouveau SW
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching assets V2');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activation (nettoyage des vieux caches v1)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        }).then(() => self.clients.claim()) // Prend le contrôle immédiat des pages
    );
});

// Interception des requêtes réseau (sert le cache si disponible)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si c'est dans le cache, on le sert, sinon on va sur le réseau
                return response || fetch(event.request);
            })
    );
});
