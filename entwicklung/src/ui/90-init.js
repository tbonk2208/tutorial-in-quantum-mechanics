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
  // Installation als App (Chrome/Edge)
  let deferred = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; const b = document.createElement('div'); b.className = 'pwa-bar'; b.innerHTML = '<span>Das Tutorial lässt sich als App installieren und läuft dann auch ohne Internet.</span>'; const ok = h('button', {class:'btn btn-sm btn-primary', type:'button'}, 'Als App installieren'); const no = h('button', {class:'btn btn-sm btn-ghost', type:'button'}, 'Später'); ok.onclick = async () => { b.remove(); try { deferred.prompt(); await deferred.userChoice; } catch(err){} deferred = null; }; no.onclick = () => b.remove(); b.append(ok, no); document.body.append(b); });
  document.addEventListener('click', e => { const a = e.target.closest('a.lexlink'); if (a){ /* normaler Link */ } });
  try { if ('serviceWorker' in navigator && location.protocol === 'https:' && /github\.io$/.test(location.hostname)) navigator.serviceWorker.register('sw.js').catch(() => {}); } catch(e){}
})();
