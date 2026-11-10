/* ===== Start ===== */
(function init(){
  store.load();
  KI.init();
  applySettings();
  setupPalette();
  window.addEventListener('hashchange', () => { CUR = null; render(); });
  window.addEventListener('popstate', () => { CUR = null; render(); });
  // „Nachlesen“ und Begriffe im Text: als Dialog, damit man an der Stelle bleibt (Strg/⌘-Klick öffnet die Seite)
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[data-lex], a[data-seg]'); if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (a.dataset.seg) segDlg(a.dataset.tid, a.dataset.seg); else lexDlg(a.dataset.lex);
  });
  // interne Links (#/…) ohne Seitenwechsel
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href^="#/"]'); if (!a) return; e.preventDefault(); go(a.getAttribute('href').slice(2)); });
  if (!location.hash && store.data.last && /^#\/(learn|practice|review)/.test(store.data.last)) { /* Startseite zeigt „Weitermachen“ */ }
  render();
  // Startknopf in der Kopfzeile (und alle Knöpfe mit data-go)
  document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
  // Installation als App: Chrome/Edge melden mit „beforeinstallprompt“, dass sie installieren können
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); PWA.deferred = e;
    if (PWA.barShown || $('.pwa-bar')) return; PWA.barShown = true;
    const b = document.createElement('div'); b.className = 'pwa-bar';
    b.innerHTML = '<span>Das Tutorial lässt sich als App installieren und läuft dann auch ohne Internet.</span>';
    const ok = h('button', {class:'btn btn-sm btn-primary', type:'button'}, 'Als App installieren');
    const no = h('button', {class:'btn btn-sm btn-ghost', type:'button'}, 'Später');
    ok.onclick = () => { b.remove(); pwaInstall(); };
    no.onclick = () => b.remove();
    b.append(ok, no); document.body.append(b);
  });
  window.addEventListener('appinstalled', () => { PWA.installed = true; PWA.deferred = null; $$('.pwa-bar').forEach(x => x.remove()); toast('Installiert. Du findest das Tutorial jetzt bei deinen Apps.'); if (route()[0] === 'settings') render(); });
  // Service Worker nur auf GitHub Pages (dort ist die App installierbar). Neue Version: Hinweis mit „Neu laden“.
  try {
    if ('serviceWorker' in navigator && location.protocol === 'https:' && /github\.io$/.test(location.hostname)){
      navigator.serviceWorker.register('sw.js').then(reg => {
        PWA.sw = true;
        const offer = w => {
          if (!w || $('.pwa-bar.upd')) return;
          const b = document.createElement('div'); b.className = 'pwa-bar upd';
          b.innerHTML = '<span>Eine neue Version des Tutorials ist da.</span>';
          const ok = h('button', {class:'btn btn-sm btn-primary', type:'button'}, 'Neu laden');
          ok.onclick = () => { try { if (typeof INKUI !== 'undefined') INKUI.flushAll(); } catch(e){} store.save(); w.postMessage('skip'); };
          const no = h('button', {class:'btn btn-sm btn-ghost', type:'button'}, 'Später');
          no.onclick = () => b.remove();
          b.append(ok, no); document.body.append(b);
        };
        if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
        reg.addEventListener('updatefound', () => { const w = reg.installing; if (w) w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) offer(w); }); });
        let reloaded = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloaded) return; reloaded = true; location.reload(); });
      }).catch(() => {});
    }
  } catch(e){}
})();
