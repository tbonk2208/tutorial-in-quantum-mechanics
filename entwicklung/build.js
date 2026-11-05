/* Baut dist/: index.html (alles eingebettet), sw.js, manifest, Schriften, Symbole */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const R = p => fs.readFileSync(path.join(__dirname, p), 'utf8');
const ls = d => fs.readdirSync(path.join(__dirname, d)).filter(f => f.endsWith('.js')).sort().map(f => d + '/' + f);
const KATEX = '/opt/npm-tools/node_modules/katex/dist';
const MATHE = '/home/claude/tbonk2208/mathe-lernhilfe';
const out = path.join(__dirname, 'dist');
fs.mkdirSync(path.join(out, 'fonts'), {recursive:true});
fs.mkdirSync(path.join(out, 'icons'), {recursive:true});
// Schriften
for (const f of fs.readdirSync(path.join(MATHE, 'fonts')).filter(f => !/STIX/.test(f))) fs.copyFileSync(path.join(MATHE, 'fonts', f), path.join(out, 'fonts', f));
const kfonts = fs.readdirSync(path.join(KATEX, 'fonts')).filter(f => f.endsWith('.woff2'));
for (const f of kfonts) fs.copyFileSync(path.join(KATEX, 'fonts', f), path.join(out, 'fonts', f));
fs.writeFileSync(path.join(out, 'fonts', 'LICENSE-KaTeX.txt'), fs.readFileSync(path.join(KATEX, '..', 'LICENSE')));
let kcss = fs.readFileSync(path.join(KATEX, 'katex.min.css'), 'utf8');
// nur woff2 behalten
kcss = kcss.replace(/src:url\(fonts\/([^)]+)\.woff2\) format\("woff2"\)(,url\([^)]+\) format\("woff"\))?(,url\([^)]+\) format\("truetype"\))?/g, 'src:url(fonts/$1.woff2) format("woff2")');
const kjs = fs.readFileSync(path.join(KATEX, 'katex.min.js'), 'utf8');
const engine = ls('src/engine').map(R).join('\n;\n');
const content = ls('src/content').map(R).join('\n;\n');
const ui = ls('src/ui').map(R).join('\n;\n');
const css = R('src/ui/style.css');
const version = crypto.createHash('sha1').update(engine + content + ui + css).digest('hex').slice(0, 12);
const html = R('src/index.template.html')
  .replace('/*KATEX_CSS*/', () => kcss)
  .replace('/*APP_CSS*/', () => css)
  .replace('/*KATEX_JS*/', () => kjs.replace(/<\/script/gi, '<\\/script'))
  .replace('/*APP_JS*/', () => ('const APP_VERSION = "' + version + '";\n' + engine + '\n;\n' + content + '\n;\n' + ui).replace(/<\/script/gi, '<\\/script'));
fs.writeFileSync(path.join(out, 'index.html'), html);
const files = ['./', 'index.html', 'manifest.webmanifest', ...fs.readdirSync(path.join(out, 'fonts')).filter(f => /\.(woff2?|)$/.test(f) && !f.endsWith('.txt')).map(f => 'fonts/' + f), ...fs.readdirSync(path.join(out, 'icons')).map(f => 'icons/' + f)];
fs.writeFileSync(path.join(out, 'sw.js'), `/* Service Worker von Tutorial in Quantum Mechanics: speichert alle Dateien, danach läuft die App ohne Internet. */
const VERSION = 'qm-${version}';
const FILES = ${JSON.stringify(files)};
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, {cache:'reload'}))))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('qm-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate'){ e.respondWith(caches.match('./', {cacheName:VERSION}).then(r => r || fetch(req))); return; }
  e.respondWith(caches.match(req, {cacheName:VERSION, ignoreSearch:true}).then(r => r || fetch(req)));
});
`);
fs.writeFileSync(path.join(out, 'manifest.webmanifest'), JSON.stringify({
  name:'Tutorial in Quantum Mechanics', short_name:'QM Tutorial', id:'./', start_url:'./', scope:'./', display:'standalone',
  background_color:'#eef1f8', theme_color:'#3b3fa8', lang:'de', dir:'ltr', orientation:'any', categories:['education'],
  description:'Tutorial in Quantum Mechanics: Quantenmechanik I und ihre mathematischen Grundlagen für den Physik-Bachelor. Herleitungen Zeile für Zeile prüfen, Lernweg, Labor, Wiederholung und Probeklausur.',
  icons:[{src:'icons/icon-192.png', sizes:'192x192', type:'image/png', purpose:'any'}, {src:'icons/icon-512.png', sizes:'512x512', type:'image/png', purpose:'any'}, {src:'icons/icon-maskable-512.png', sizes:'512x512', type:'image/png', purpose:'maskable'}]
}, null, 1));
fs.writeFileSync(path.join(out, '.nojekyll'), '');
fs.copyFileSync(path.join(MATHE, 'LICENSE'), path.join(out, 'LICENSE'));
console.log('gebaut', version, (html.length / 1024).toFixed(0) + ' KB');
