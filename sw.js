/* Service Worker von Tutorial in Quantum Mechanics: speichert alle Dateien, danach läuft die App ohne Internet. */
const VERSION = 'qm-aadca5460d7f';
const FILES = ["./","index.html","manifest.webmanifest","fonts/BricolageGrotesque.woff","fonts/KaTeX_AMS-Regular.woff2","fonts/KaTeX_Caligraphic-Bold.woff2","fonts/KaTeX_Caligraphic-Regular.woff2","fonts/KaTeX_Fraktur-Bold.woff2","fonts/KaTeX_Fraktur-Regular.woff2","fonts/KaTeX_Main-Bold.woff2","fonts/KaTeX_Main-BoldItalic.woff2","fonts/KaTeX_Main-Italic.woff2","fonts/KaTeX_Main-Regular.woff2","fonts/KaTeX_Math-BoldItalic.woff2","fonts/KaTeX_Math-Italic.woff2","fonts/KaTeX_SansSerif-Bold.woff2","fonts/KaTeX_SansSerif-Italic.woff2","fonts/KaTeX_SansSerif-Regular.woff2","fonts/KaTeX_Script-Regular.woff2","fonts/KaTeX_Size1-Regular.woff2","fonts/KaTeX_Size2-Regular.woff2","fonts/KaTeX_Size3-Regular.woff2","fonts/KaTeX_Size4-Regular.woff2","fonts/KaTeX_Typewriter-Regular.woff2","fonts/SourceSans3-Italic.woff","fonts/SourceSans3.woff","icons/apple-touch-icon.png","icons/favicon-32.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, {cache:'reload'}))))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('qm-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate'){ e.respondWith(caches.match('./', {cacheName:VERSION}).then(r => r || fetch(req))); return; }
  e.respondWith(caches.match(req, {cacheName:VERSION, ignoreSearch:true}).then(r => r || fetch(req)));
});
