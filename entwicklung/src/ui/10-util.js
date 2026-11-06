/* ===== Hilfsfunktionen der Oberfläche ===== */
const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
const escH = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
function h(tag, attrs, ...kids){
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})){
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v; else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k !== null && k !== undefined && k !== false) el.append(k.nodeType ? k : document.createTextNode(String(k)));
  return el;
}
/* Formeln */
function texHTML(t, display){
  try { return katex.renderToString(t, {throwOnError:false, displayMode:!!display, strict:'ignore', trust:false, output:'htmlAndMathml'}); }
  catch(e){ return '<code>' + escH(t) + '</code>'; }
}
/* kleine Auszeichnungssprache: Absätze, Listen, **fett**, *kursiv*, $…$, $$…$$, [[lex:id|Text]] */
function md(text){
  if (!text) return '';
  const blocks = String(text).trim().split(/\n\s*\n/);
  return blocks.map(b => {
    const lines = b.split('\n');
    if (lines.every(l => /^\s*[-•]\s+/.test(l))) return '<ul class="clean">' + lines.map(l => '<li>' + inl(l.replace(/^\s*[-•]\s+/, '')) + '</li>').join('') + '</ul>';
    if (lines.every(l => /^\s*\d+\.\s+/.test(l))) return '<ol class="clean">' + lines.map(l => '<li>' + inl(l.replace(/^\s*\d+\.\s+/, '')) + '</li>').join('') + '</ol>';
    if (/^\$\$[\s\S]*\$\$$/.test(b.trim())) return '<div class="dm">' + texHTML(b.trim().slice(2, -2), true) + '</div>';
    return '<p>' + inl(b) + '</p>';
  }).join('');
}
function inl(s){
  const parts = []; let i = 0;
  // Formeln zuerst herauslösen
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (m, t) => { parts.push(texHTML(t, true)); return '\u0000' + (parts.length - 1) + '\u0000'; });
  s = s.replace(/\$([^$]+?)\$/g, (m, t) => { parts.push(texHTML(t, false)); return '\u0000' + (parts.length - 1) + '\u0000'; });
  s = s.replace(/`([^`]+)`/g, (m, t) => { parts.push('<code class="inp-ex">' + escH(t) + '</code>'); return '\u0000' + (parts.length - 1) + '\u0000'; });
  s = escH(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, '$1<i>$2</i>')
    .replace(/\[\[lex:([\w-]+)\|([^\]]+)\]\]/g, '<a href="#/lex/$1" class="lexlink" data-lex="$1">$2</a>')
    .replace(/(^|[\s(])(https?:\/\/[^\s<]*[^\s<.,;:)])/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')
    .replace(/\n/g, '<br>');
  return s.replace(/\u0000(\d+)\u0000/g, (m, k) => parts[+k]);
}
/* Zeile der Eingabesprache als Formel */
function lineHTML(src, ctx){
  try { return texHTML(texLine(parseLine(src, ctx && ctx.pctx ? ctx.pctx : ctx || {}))); }
  catch(e){ return '<code>' + escH(src) + '</code>'; }
}
function ctxOf(spec){ if (!spec) return null; if (!spec.__ctx) spec.__ctx = makeCtx(spec); return spec.__ctx; }

/* Speicher (nur auf diesem Gerät) */
const store = {
  key:'qm-lernhilfe-1',
  data:null,
  /* load(): aus localStorage; load(daten): übernimmt eingelesene bzw. leere Daten (Einlesen, Zurücksetzen) */
  load(given){
    if (given !== undefined) this.data = given;
    else { try { this.data = JSON.parse(localStorage.getItem(this.key) || 'null'); } catch(e){ this.data = null; } }
    if (!this.data || typeof this.data !== 'object') this.data = {};
    const d = this.data;
    d.topics = d.topics || {}; d.tasks = d.tasks || {}; d.review = d.review || {}; d.settings = d.settings || {}; d.exam = d.exam || {}; d.log = d.log || []; d.errs = d.errs || {};
    d.errbook = Array.isArray(d.errbook) ? d.errbook : []; d.calib = Array.isArray(d.calib) ? d.calib : []; d.refl = d.refl || {};
    return d;
  },
  save(){ try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch(e){ /* privater Modus: nur im Speicher */ } },
  topic(id){ const t = this.data.topics; return t[id] || (t[id] = {done:{}, step:1}); },
  task(id){ const t = this.data.tasks; return t[id] || (t[id] = {goals:{}}); },
  goal(tid, gid){ const t = this.task(tid); return t.goals[gid] || (t.goals[gid] = {lines:[{m:'', w:''}], state:null, points:0, help:0, tries:0}); },
  event(e){ this.data.log.push({d:new Date().toISOString(), e}); if (this.data.log.length > 400) this.data.log.splice(0, 100); },
  /* Fehlerheft: e = {k:'line'|'concept'|'seg'|'final', t:Themen-id, ref, goal?, pos?, text, msg?, ans?, right?, lex?, seg?} */
  errAdd(e){
    const B = this.data.errbook;
    const key = e.key || [e.k, e.t || '', e.ref || '', e.goal || '', e.pos != null ? e.pos : (e.text || '')].join('|');
    const old = B.find(x => x.key === key);
    const d = new Date().toISOString();
    if (old){ Object.assign(old, e, {key, n:(old.n || 1) + 1, d, done:false, solved:false}); }
    else { B.push(Object.assign({key, n:1, d}, e)); if (B.length > 300) B.splice(0, B.length - 300); }
    this.save();
  },
  /* Ziel gelöst: zugehörige Einträge als „später gelöst“ markieren */
  errSolved(ref, goal){ let ch = false; for (const x of this.data.errbook) if (x.k === 'line' && x.ref === ref && x.goal === goal && !x.solved){ x.solved = true; ch = true; } if (ch) this.save(); },
  /* Sicherheitsurteil: c = 0 (geraten) … 3 (sicher), ok = richtig gelöst */
  calibAdd(c, ok, t, src){ if (c == null) return; this.data.calib.push({d:today(), c, ok:!!ok, t, src}); if (this.data.calib.length > 600) this.data.calib.splice(0, 100); }
};
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, 2600); }
const ICONS = {
  start:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  learn:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.3V16h6v-.2c0-.9.4-1.7 1-2.3A6 6 0 0 0 12 3z"/>',
  practice:'<path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3"/>',
  review:'<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4"/>',
  exam:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M8 14h5"/>',
  lex:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4zM5 17a3 3 0 0 1 3-3h11"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  solutions:'<path d="M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
  sources:'<path d="M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM14 3v5h5M8 13h8M8 17h5"/>'
};
const icon = k => '<svg viewBox="0 0 24 24" class="ic" aria-hidden="true">' + (ICONS[k] || '') + '</svg>';
const shuffle = (arr, R) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor((R ? R() : Math.random()) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
/* Datum für die Anzeige: 2026-11-07 → 7. 11. 2026 */
const fmtD = d => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? (+m[3]) + '. ' + (+m[2]) + '. ' + m[1] : String(d || ''); };
