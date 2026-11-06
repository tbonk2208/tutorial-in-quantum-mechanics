/* ===== Stifteingabe: Schreibflächen, Handballen-Schutz, Zeilenmodus Stift/Tastatur, Korrektur, Anlernen =====
   Die Erkennung kommt aus 16-ink-recog.js (recognizeInk, inkContext, inkItemChoices, HANDQ, SYMQ_CLASSES).
   Fehlt dieses Modul (oder wirft es), liefert der Platzhalter unten eine leere Lesart: Die Oberfläche bleibt
   benutzbar, man kann tippen oder die KI lesen lassen. Alles liegt in INKUI, damit keine Namen mit der Erkennung kollidieren. */
const INKUI = (() => {
  /* ---------- Platzhalter / Schutz für fehlende Module (erst zur Laufzeit prüfen, nie beim Laden) ---------- */
  const recogReady = () => typeof recognizeInk === 'function';
  /* Erkennung da und Modell geladen (inkModelReady von 16-ink-recog.js, falls vorhanden) */
  const modelReady = () => { if (!recogReady()) return false; try { return typeof inkModelReady !== 'function' || !!inkModelReady(); } catch(e){ return false; } };
  const RCTX = new WeakMap();
  function rctxFor(taskCtx, extra){
    if (typeof inkContext !== 'function') return taskCtx || null;
    if (extra && extra.length) return inkContext(taskCtx || null, extra);   /* mit den Zeilen darüber als Zusammenhang */
    if (!taskCtx || typeof taskCtx !== 'object') return inkContext(taskCtx || null);
    let r = RCTX.get(taskCtx);
    if (!r){ r = inkContext(taskCtx); RCTX.set(taskCtx, r); }
    return r;
  }
  function recognize(strokes, taskCtx, extra){
    if (!recogReady()) return {text:'', alts:[], items:[], conf:0, missing:true};
    const r = recognizeInk(strokes, rctxFor(taskCtx, extra));
    if (r && typeof r === 'object') return r;
    return {text:String(r || ''), alts:[], items:[], conf:0};
  }
  const hand = () => (typeof HANDQ !== 'undefined' && HANDQ && typeof HANDQ.add === 'function') ? HANDQ : null;
  const classes = () => (typeof SYMQ_CLASSES !== 'undefined' && Array.isArray(SYMQ_CLASSES)) ? SYMQ_CLASSES : null;

  /* ---------- globaler Stiftzustand ----------
     penT  letzte Stiftaktivität irgendwo (auch Schweben) · inkT letzte Stiftaktivität über einer Schreibfläche
     contact Stift berührt eine Schreibfläche · down Flächen mit laufendem Strich · upT Ende des letzten Strichs */
  const PEN = {seen:false, penT:-1e9, inkT:-1e9, upT:-1e9, contact:false, down:new Set(), downT:0, col:null, guard:false, cvs:new Set(), lines:new Set(), palmT:-1e9, fingerHint:false};
  const now = () => performance.now();
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const inkCol = () => PEN.col || (PEN.col = css('--ink') || '#151a2d');
  const busy = () => PEN.contact || now() - PEN.inkT < 900;
  const writing = () => PEN.down.size > 0 && now() - PEN.downT < 20000;
  const S = () => (store.data && store.data.settings) || {};
  const pref = () => { const m = S().input; return m === 'kbd' || m === 'pen' ? m : 'auto'; };
  const defaultMode = () => { const p = pref(); return p === 'pen' || (p === 'auto' && (PEN.seen || S().penSeen)) ? 'pen' : 'kbd'; };
  const finger = () => !!S().inkFinger;
  function themeChanged(){ PEN.col = null; for (const c of [...PEN.cvs]){ if (!c.cv.isConnected) continue; c.redraw(); } }
  try {
    new MutationObserver(themeChanged).observe(document.documentElement, {attributes:true, attributeFilter:['data-theme', 'data-size']});
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeChanged);
  } catch(e){}

  /* Handballen-Schutz wie in der Mathe-Lernhilfe: aktiv, sobald ein Stift benutzt wurde */
  function installPalmGuard(){
    if (PEN.guard) return; PEN.guard = true;
    /* Handballen darf die Seite nicht scrollen oder zoomen, solange der Stift schreibt oder schwebt */
    const stop = e => { if (busy() && e.cancelable) e.preventDefault(); };
    document.addEventListener('touchstart', stop, {passive:false, capture:true});
    document.addEventListener('touchmove', stop, {passive:false, capture:true});
    /* Handballen darf keine Knöpfe auslösen (z. B. „Zeile löschen“ neben der Schreibfläche) */
    document.addEventListener('pointerdown', e => { if (e.pointerType === 'touch' && busy()){ PEN.palmT = now(); e.preventDefault(); } }, true);
    document.addEventListener('click', e => {
      if (e.pointerType === 'touch' && (busy() || now() - PEN.palmT < 600)){ e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);
  }
  /* Stift entdeckt: Schutz einschalten, merken, bei „automatisch“ leere Zeilen auf Stift stellen */
  function penSeen(){
    if (PEN.seen) return; PEN.seen = true; installPalmGuard();
    try { const s = S(); if (!s.penSeen){ s.penSeen = true; store.save(); } } catch(e){}
    if (pref() !== 'auto') return;
    for (const L of [...PEN.lines]){
      if (!L.R.row.isConnected && now() - L.born > 3000){ L.destroy(); continue; }
      if (!L.manual && L.mode !== 'pen' && !L.R.inp.value.trim()) L.setMode('pen', false);
    }
  }
  ['pointerdown', 'pointermove', 'pointerup'].forEach(t => document.addEventListener(t, e => {
    if (e.pointerType === 'pen'){ PEN.penT = now(); if (!PEN.seen) penSeen(); }
  }, {capture:true, passive:true}));

  /* ---------- Schreibfläche ---------- */
  class InkCanvas {
    constructor(cv, opt){
      opt = opt || {};
      this.cv = cv; this.opt = opt; this.strokes = []; this.cur = null; this.eraser = false; this.frozen = false; this.trash = null; this.pid = null;
      this.g = cv.getContext('2d');
      cv.style.touchAction = 'none';
      cv.classList.add('ink-zone');
      cv.addEventListener('pointerdown', e => this.down(e));
      cv.addEventListener('pointermove', e => this.move(e));
      cv.addEventListener('pointerup', e => this.up(e, false));
      cv.addEventListener('pointercancel', e => this.up(e, true));
      cv.addEventListener('lostpointercapture', e => { if (e.pointerId === this.pid) this.up(e, true); });
      cv.addEventListener('contextmenu', e => e.preventDefault());   /* Windows: Gedrückthalten = Rechtsklick */
      cv.addEventListener('selectstart', e => e.preventDefault());
      cv.addEventListener('dragstart', e => e.preventDefault());
      /* abgelöste Flächen früherer Ansichten vergessen (nur solche, die schon einmal sichtbar waren) */
      for (const c of [...PEN.cvs]) if (c.w && !c.cv.isConnected) c.destroy();
      PEN.cvs.add(this);
      this.fit();
      try { this.ro = new ResizeObserver(() => this.fit()); this.ro.observe(cv); } catch(e){}
    }
    /* Größe an die Fläche anpassen; Striche bleiben erhalten (ragen sie nach dem Verkleinern hinaus, werden sie gleichmäßig verkleinert) */
    fit(){
      const r = this.cv.getBoundingClientRect(); if (!r.width || !r.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      if (this.w === r.width && this.h === r.height && this.dpr === dpr) return;
      if (this.strokes.length && this.w){
        let x1 = 1, y1 = 1;
        for (const s of this.strokes) for (const q of s){ if (q.x > x1) x1 = q.x; if (q.y > y1) y1 = q.y; }
        const k = Math.min(1, (r.width - 4) / x1, (r.height - 4) / y1);
        if (k < 0.999 && k > 0) for (const s of this.strokes) for (const q of s){ q.x *= k; q.y *= k; }
      }
      this.w = r.width; this.h = r.height; this.dpr = dpr;
      this.cv.width = Math.round(r.width * dpr); this.cv.height = Math.round(r.height * dpr);
      this.redraw();
    }
    pos(e){
      const r = this.rect, q = {x:Math.round((e.clientX - r.left) * 10) / 10, y:Math.round((e.clientY - r.top) * 10) / 10, t:Math.round(e.timeStamp || now()), p:Math.round((e.pressure || .5) * 100) / 100};
      /* Aufzeichnung (Schreibprobe): echter Druck und Neigung des Stifts */
      if (this.opt.rec){ q.p = Math.round((e.pressure || 0) * 1000) / 1000; if (e.pointerType === 'pen'){ q.tiltX = Math.round(e.tiltX || 0); q.tiltY = Math.round(e.tiltY || 0); } }
      return q;
    }
    down(e){
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.pointerType === 'touch'){
        /* Finger und Handballen schreiben nicht – außer „Mit dem Finger schreiben“ ist an und in der letzten Minute kam kein Stift */
        if (!finger() || PEN.contact || (PEN.seen && now() - PEN.penT < 60000)){
          e.preventDefault();
          if (!finger() && !PEN.seen && this.opt.onTouchIgnored) this.opt.onTouchIgnored();
          return;
        }
      }
      if (this.frozen){ e.preventDefault(); return; }
      if (this.pid != null && this.pid !== e.pointerId){
        if (this.ptype === 'touch' && e.pointerType === 'pen'){ this.cur = null; this.erasing = false; this.redraw(); }   /* Stift schlägt Finger */
        else return;
      }
      e.preventDefault();
      try { this.cv.setPointerCapture(e.pointerId); } catch(_){}
      this.pid = e.pointerId; this.ptype = e.pointerType; PEN.down.add(this); PEN.downT = now();
      if (e.pointerType === 'pen'){ PEN.contact = true; PEN.inkT = now(); }
      if (!this.w) this.fit();
      this.rect = this.cv.getBoundingClientRect();
      this.opt.onStart && this.opt.onStart();
      /* Radiererende (button 5 / buttons 32) oder Seitentaste (buttons 2) des Stifts radieren */
      const penErase = e.pointerType === 'pen' && (e.button === 5 || (e.buttons & 32) || (e.buttons & 2));
      if (this.eraser || penErase){ this.erasing = true; this.erased = false; this.lastEr = null; this.eraseAt(this.pos(e)); return; }
      const p = this.pos(e);
      /* kurzes Abheben des Stifts (Aussetzer < 70 ms, < 6 px) setzt den vorigen Strich fort */
      const last = this.strokes[this.strokes.length - 1];
      if (last && this.lastUpType === e.pointerType && now() - this.lastUpT < 70){
        const q = last[last.length - 1];
        if (Math.hypot(p.x - q.x, p.y - q.y) < 6){ this.strokes.pop(); this.cur = last.slice(); this.cur.pt = last.pt; this.cur.push(p); this.seg(q, p); return; }
      }
      this.cur = [p]; this.cur.pt = e.pointerType;
      this.dot(p);
    }
    move(e){
      if (e.pointerType === 'pen') PEN.inkT = now();
      if (e.pointerId !== this.pid) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
      const list = evs && evs.length ? evs : [e];
      if (this.erasing){ for (const ce of list) this.eraseAt(this.pos(ce)); return; }
      if (!this.cur) return;
      const c = this.g; c.save(); c.scale(this.dpr, this.dpr);
      c.strokeStyle = inkCol(); c.lineCap = 'round'; c.lineJoin = 'round';
      for (const ce of list){
        const p = this.pos(ce), last = this.cur[this.cur.length - 1];
        if (Math.hypot(p.x - last.x, p.y - last.y) < 0.8) continue;
        this.cur.push(p);
        c.lineWidth = this.lw(p.p); c.beginPath(); c.moveTo(last.x, last.y); c.lineTo(p.x, p.y); c.stroke();
      }
      c.restore();
    }
    up(e, cancelled){
      if (e.pointerId !== this.pid) return;
      this.pid = null; PEN.down.delete(this); PEN.upT = now();
      if (e.pointerType === 'pen'){ PEN.contact = false; PEN.inkT = now(); }
      try { this.cv.releasePointerCapture(e.pointerId); } catch(_){}
      if (this.erasing){ this.erasing = false; if (this.erased) this.opt.onChange && this.opt.onChange(); return; }
      if (!this.cur) return;
      if (!cancelled && e.type === 'pointerup' && this.rect){
        const p = this.pos(e), l = this.cur[this.cur.length - 1], d = Math.hypot(p.x - l.x, p.y - l.y);
        if (d >= 0.8 && d < 40){ this.cur.push(p); this.seg(l, p); }
      }
      this.strokes.push(this.cur); this.cur = null; this.trash = null;
      this.lastUpT = now(); this.lastUpType = e.pointerType;
      this.opt.onChange && this.opt.onChange();
    }
    lw(p){ return (this.opt.lw || 2.6) * (0.75 + 0.5 * (p == null ? .5 : p)); }
    seg(a, b){
      const c = this.g; c.save(); c.scale(this.dpr, this.dpr);
      c.strokeStyle = inkCol(); c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = this.lw(b.p);
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); c.restore();
    }
    dot(p){ const c = this.g; c.save(); c.scale(this.dpr, this.dpr); c.fillStyle = inkCol(); c.beginPath(); c.arc(p.x, p.y, this.lw(p.p) / 2, 0, 7); c.fill(); c.restore(); }
    redraw(){
      if (!this.w) return;
      const c = this.g; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, this.cv.width, this.cv.height);
      c.save(); c.scale(this.dpr, this.dpr);
      this.opt.bg && this.opt.bg(c, this.w, this.h);
      c.strokeStyle = inkCol(); c.fillStyle = inkCol(); c.lineCap = 'round'; c.lineJoin = 'round';
      const all = this.cur ? this.strokes.concat([this.cur]) : this.strokes;
      for (const s of all){
        if (s.length === 1){ c.beginPath(); c.arc(s[0].x, s[0].y, this.lw(s[0].p) / 2, 0, 7); c.fill(); continue; }
        for (let i = 1; i < s.length; i++){ c.lineWidth = this.lw(s[i].p); c.beginPath(); c.moveTo(s[i - 1].x, s[i - 1].y); c.lineTo(s[i].x, s[i].y); c.stroke(); }
      }
      c.restore();
    }
    /* Radieren entlang der Bewegung (auch bei schnellen Wischern, die zwischen zwei Ereignissen über einen Strich gehen) */
    eraseAt(p){
      const a = this.erasing && this.lastEr ? this.lastEr : p; this.lastEr = p;
      const dx = p.x - a.x, dy = p.y - a.y, L2 = dx * dx + dy * dy;
      const near = q => { const t = L2 ? Math.max(0, Math.min(1, ((q.x - a.x) * dx + (q.y - a.y) * dy) / L2)) : 0; return Math.hypot(q.x - a.x - t * dx, q.y - a.y - t * dy) < 12; };
      const n = this.strokes.length;
      this.strokes = this.strokes.filter(s => !s.some(near));
      if (this.strokes.length !== n){ this.erased = true; this.nErase = (this.nErase || 0) + 1; this.trash = null; this.redraw(); }
    }
    /* Rückgängig: letzter Strich; nach „Löschen“ holt es die gelöschten Striche zurück */
    undo(){
      if (!this.strokes.length && this.trash){ this.strokes = this.trash; this.trash = null; }
      else if (this.strokes.length) this.strokes.pop();
      else return;
      this.redraw(); this.opt.onChange && this.opt.onChange();
    }
    clear(keep){
      if (!this.strokes.length && !this.cur) return;
      this.trash = keep !== false && this.strokes.length ? this.strokes : null; this.strokes = []; this.cur = null; this.redraw(); this.opt.onChange && this.opt.onChange();
    }
    destroy(){ try { this.ro && this.ro.disconnect(); } catch(e){} PEN.cvs.delete(this); PEN.down.delete(this); }
  }

  /* Linierung: Grundlinie (gestrichelt) und eine blasse Hilfslinie darüber; Platz für Brüche, Grenzen und Matrizen */
  function lineBg(c, w, h){
    c.save(); c.lineWidth = 1; c.strokeStyle = css('--grid-strong') || '#cbd1e1';
    const base = Math.round(h * 0.6) + .5, top = Math.round(h * 0.3) + .5;
    c.setLineDash([6, 5]); c.beginPath(); c.moveTo(10, base); c.lineTo(w - 10, base); c.stroke();
    c.setLineDash([]); c.globalAlpha = .5; c.beginPath(); c.moveTo(10, top); c.lineTo(w - 10, top); c.stroke();
    c.restore();
  }
  function charBg(c, w, h){
    c.save(); c.lineWidth = 1; c.strokeStyle = css('--grid-strong') || '#cbd1e1'; c.setLineDash([5, 5]);
    const b = Math.round(h * 0.78) + .5; c.beginPath(); c.moveTo(12, b); c.lineTo(w - 12, b); c.stroke(); c.restore();
  }
  /* Striche als PNG (schwarz auf weiß, zugeschnitten) für das Lesen durch die KI */
  function strokesPNG(strokes){
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const s of strokes) for (const p of s){ if (p.x < x0) x0 = p.x; if (p.y < y0) y0 = p.y; if (p.x > x1) x1 = p.x; if (p.y > y1) y1 = p.y; }
    if (!isFinite(x0)) return '';
    const pad = 16, W = x1 - x0 + 2 * pad, H = y1 - y0 + 2 * pad;
    const k = Math.min(2.5, 320 / Math.max(H, 40), 2000 / Math.max(W, 1));
    const c = document.createElement('canvas'); c.width = Math.ceil(W * k); c.height = Math.ceil(H * k);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = '#000'; g.fillStyle = '#000'; g.lineWidth = 2.8 * k; g.lineCap = 'round'; g.lineJoin = 'round';
    for (const s of strokes){
      if (s.length === 1){ g.beginPath(); g.arc((s[0].x - x0 + pad) * k, (s[0].y - y0 + pad) * k, 1.6 * k, 0, 7); g.fill(); continue; }
      g.beginPath(); s.forEach((p, i) => { const X = (p.x - x0 + pad) * k, Y = (p.y - y0 + pad) * k; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }); g.stroke();
    }
    return c.toDataURL('image/png');
  }
  /* Namen, die in der Aufgabe vorkommen (für die KI) */
  function taskInfo(ctx, task){
    const names = new Set();
    if (ctx){
      (ctx.coords || []).forEach(n => names.add(n));
      Object.keys(ctx.params || {}).forEach(n => names.add(n));
      Object.keys(ctx.defs || {}).forEach(n => names.add(n));
      Object.keys(ctx.fam || {}).forEach(n => names.add(n + '_n'));
      if (ctx.funcs) [...ctx.funcs].forEach(n => names.add(n));
      Object.keys(ctx.unknowns || {}).forEach(n => names.add(n));
      Object.keys(ctx.abstract || {}).forEach(n => names.add(n));
      Object.keys((ctx.spec && ctx.spec.ops) || {}).forEach(n => names.add(n));
      if (ctx.state) names.add(ctx.state);
    }
    return {id:task && task.id || '', title:task && task.title || '', names:[...names].filter(Boolean).slice(0, 60), rep:ctx && ctx.rep || ''};
  }

  /* ---------- „Gemeint war“-Menü ---------- */
  let POP = null;
  function pop(){
    if (POP) return POP;
    POP = h('div', {class:'inkpop', role:'dialog', 'aria-label':'Gemeint war', hidden:true});
    document.body.append(POP);
    document.addEventListener('pointerdown', e => { if (!POP.hidden && !POP.contains(e.target) && !e.target.closest('.chipc')) POP.hidden = true; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !POP.hidden) POP.hidden = true; });
    return POP;
  }
  const labelOf = it => {
    if (it == null) return '?';
    if (typeof it === 'string') return it;
    const a0 = Array.isArray(it.alts) && it.alts.length ? it.alts[0] : null;
    const v = it.label ?? it.show ?? it.c ?? it.cls ?? it.sym ?? it.text ?? (a0 ? (Array.isArray(a0) ? a0[0] : a0.label ?? a0.show ?? a0.c ?? a0.cls) : null);
    return v == null ? '?' : String(v);
  };
  /* Zeichen der Lesart in Lesereihenfolge: result.syms, sonst die Blätter von result.items (Tiefensuche) */
  function symsOf(r){
    if (!r) return [];
    if (Array.isArray(r.syms)) return r.syms;
    const out = [];
    const walk = v => {
      if (Array.isArray(v)){ v.forEach(walk); return; }
      if (!v || typeof v !== 'object') return;
      const kids = Object.entries(v).filter(([k, x]) => k !== 'alts' && k !== 'strokes' && k !== 'box' && Array.isArray(x) && x.some(y => y && typeof y === 'object' && !Array.isArray(y)));
      if (kids.length && v.k !== 'sym') kids.forEach(([, x]) => walk(x)); else out.push(v);
    };
    walk(r.items || []);
    return out;
  }
  function normChoice(o){
    if (o == null) return null;
    if (typeof o === 'string') return {label:o, cls:o, text:null};
    if (Array.isArray(o)) return {label:String(o[0]), cls:o[0], text:null};
    const label = o.label ?? o.show ?? o.c ?? o.cls ?? o.sym ?? null;
    return {label:String(label ?? o.text ?? '?'), cls:o.cls ?? o.c ?? o.sym ?? label, text:o.line ?? (label != null ? o.text : null) ?? null, res:o.res || null, ok:o.ok !== false, p:o.p};
  }

  /* Lesart prüfen (Gutachten E11.1): Unter dieser Sicherheit (oder ok === false) wird die Zeile nicht automatisch geprüft.
     Messung an 600 synthetischen Musterzeilen fremder Schreiber: Schwelle 0,35 fängt 52 % der Fehllesungen ab
     und markiert 4,7 % der richtig gelesenen Zeilen (Agent L, 5. 11. 2026). */
  const CONF_MIN = 0.35;
  /* ---------- Rechenzeile mit Stift (eine je Zeile des Blatts) ----------
     R = {row, inp, why, pv, fbk}; o = {mode, task, ctx(), extra() (Zeilen darüber), onText(text, src), onEnter()} */
  class InkLine {
    constructor(R, o){
      this.R = R; this.o = o; this.mode = 'kbd'; this.manual = false; this.res = null; this.src = ''; this.lastText = null; this.prev = ''; this.kbEdit = false; this.t = 0; this.pending = false; this.ink = null; this.panel = null;
      this.seg = h('span', {class:'ink-seg', role:'group', 'aria-label':'Eingabe dieser Zeile'});
      this.bPen = h('button', {type:'button', class:'ink-m', 'data-m':'pen', title:'Mit dem Stift schreiben', 'aria-label':'Mit dem Stift schreiben', 'aria-pressed':'false'}, '✎');
      this.bKbd = h('button', {type:'button', class:'ink-m', 'data-m':'kbd', title:'Tippen', 'aria-label':'Tippen', 'aria-pressed':'true'}, '⌨');
      this.seg.append(this.bPen, this.bKbd);
      this.bPen.addEventListener('click', () => this.setMode('pen', true));
      this.bKbd.addEventListener('click', () => { this.setMode('kbd', true); R.inp.focus(); });
      R.inp.parentElement.prepend(this.seg);
      R.row.inkLine = this;   /* für Tests und Fehlersuche */
      this.alts = h('div', {class:'ink-alts', hidden:true, 'aria-live':'polite'});
      R.pv.after(this.alts);
      this.alts.addEventListener('click', e => this.altClick(e));
      R.inp.addEventListener('input', () => { this.kbEdit = true; if (this.unsure){ this.unsure = false; this.msg(''); } });
      this.born = now();
      for (const L of [...PEN.lines]) if (!L.R.row.isConnected && now() - L.born > 3000) L.destroy();
      PEN.lines.add(this);
      this.setMode(o.mode || defaultMode(), false);
    }
    build(){
      const ki = typeof KI !== 'undefined' && KI.ready();
      const p = this.panel = h('div', {class:'inkp' + (S().inkTall ? ' tall' : '')});
      p.innerHTML = `<div class="ink-tools">
        <button type="button" class="btn btn-sm" data-a="undo" title="Letzten Strich entfernen (nach „Löschen“: alles zurückholen)" aria-label="Rückgängig">↶<span class="lbl">Rückgängig</span></button>
        <button type="button" class="btn btn-sm" data-a="clear" title="Alle Striche dieser Zeile löschen" aria-label="Löschen">✕<span class="lbl">Löschen</span></button>
        <button type="button" class="btn btn-sm ink-er" data-a="eraser" aria-pressed="false" title="Radierer: Striche wegwischen. Das Radiererende des Stifts radiert immer." aria-label="Radierer">⌫<span class="lbl">Radierer</span></button>
        <button type="button" class="btn btn-sm ink-tall" data-a="tall" aria-pressed="${S().inkTall ? 'true' : 'false'}" title="Schreibfläche größer oder kleiner" aria-label="Schreibfläche größer">⤢<span class="lbl">Größer</span></button>
        <span class="grow"></span>
        ${ki ? '<button type="button" class="btn btn-sm" data-a="ki" title="Ein Bild der Zeile geht an Anthropic; die KI schreibt die Zeile ab" aria-label="Von der KI lesen lassen"><span class="lbl">Von der KI lesen lassen</span><span class="lbs">KI lesen</span></button>' : ''}
        <button type="button" class="btn btn-sm btn-primary" data-a="enter" title="Zeile fertig – wie Enter: prüft bei „Zeile für Zeile“ und geht zur nächsten Zeile" aria-label="Zeile fertig">↵<span class="lbl">Fertig</span></button>
      </div>
      <canvas class="ink-cv" aria-label="Schreibfläche: Schreib diese Zeile mit dem Stift"></canvas>
      <div class="ink-msg small" aria-live="polite" hidden></div>`;
      this.R.inp.parentElement.before(p);
      this.msgEl = p.querySelector('.ink-msg');
      this.ink = new InkCanvas(p.querySelector('canvas'), {lw:2.6, bg:lineBg,
        onStart:() => { clearTimeout(this.t); if (POP) POP.hidden = true; },
        onChange:() => this.changed(),
        onTouchIgnored:() => { if (PEN.fingerHint) return; PEN.fingerHint = true; toast('Der Finger schreibt hier nicht (Schutz vor dem Handballen). Nimm Stift oder Maus – oder schalte es in den Einstellungen ein.'); }});
      p.addEventListener('click', e => {
        const b = e.target.closest('button[data-a]'); if (!b) return;
        const a = b.dataset.a;
        if (a === 'undo') this.ink.undo();
        else if (a === 'clear') this.ink.clear(true);
        else if (a === 'eraser') this.setEraser(!this.ink.eraser);
        else if (a === 'tall'){ const on = !p.classList.contains('tall'); p.classList.toggle('tall', on); b.setAttribute('aria-pressed', on); const s = S(); s.inkTall = on; store.save(); }
        else if (a === 'ki') this.askKI(b);
        else if (a === 'enter'){ this.flush(); this.o.onEnter && this.o.onEnter(); }
        else if (a === 'okread') this.confirm();
      });
    }
    setMode(m, manual){
      if (manual) this.manual = true;
      this.mode = m === 'pen' ? 'pen' : 'kbd';
      this.bPen.setAttribute('aria-pressed', this.mode === 'pen'); this.bKbd.setAttribute('aria-pressed', this.mode === 'kbd');
      if (this.mode === 'pen'){
        if (!this.panel) this.build();
        this.panel.hidden = false;
        requestAnimationFrame(() => this.ink && this.ink.fit());
      } else if (this.panel){ this.flush(); this.setEraser(false); this.panel.hidden = true; }
      this.renderAlts();
    }
    setEraser(on){
      if (!this.ink) return;
      this.ink.eraser = on;
      const b = this.panel.querySelector('.ink-er'); b.setAttribute('aria-pressed', on);
      this.panel.classList.toggle('erasing', on);
    }
    msg(t, bad){ if (!this.msgEl) return; this.msgEl.innerHTML = t || ''; this.msgEl.hidden = !t; this.msgEl.classList.toggle('bad', !!bad && bad !== 'warn'); this.msgEl.classList.toggle('warn', bad === 'warn'); }
    /* unsicher gelesen und noch nicht bestätigt oder geändert → nicht automatisch prüfen */
    needsConfirm(){ const v = this.R.inp.value.trim(); return !!(this.unsure && !this.confirmed && v && v === String(this.lastText || '').trim()); }
    confirm(){ this.confirmed = true; this.unsure = false; this.msg(''); if (this.o.onConfirm) this.o.onConfirm(); }
    changed(){ this.res = null; this.sched(); }
    /* Lesen erst nach einer Schreibpause: kein Strich läuft, Stift ~0,7 s nicht mehr geschrieben oder geschwebt (höchstens 3 s warten) */
    sched(){
      clearTimeout(this.t); this.pending = true;
      const t0 = now();
      const tick = () => {
        if (!this.pending) return;
        const quiet = now() - Math.max(PEN.upT, PEN.inkT);
        if (writing() || (quiet < 700 && now() - t0 < 3000)){ this.t = setTimeout(tick, 150); return; }
        this.read();
      };
      this.t = setTimeout(tick, 700);
    }
    flush(){ if (this.pending) this.read(); }
    read(){
      clearTimeout(this.t); this.pending = false;
      const strokes = this.ink ? this.ink.strokes : [];
      if (!strokes.length){ this.res = null; this.msg(''); this.apply('', ''); return; }
      let r;
      try { r = recognize(strokes.map(s => s.map(p => ({x:p.x, y:p.y, t:p.t}))), this.o.ctx ? this.o.ctx() : null, this.o.extra ? this.o.extra() : null); }
      catch(e){ console.error(e); this.msg('Die Zeile konnte nicht gelesen werden (' + escH(String(e.message || e).slice(0, 100)) + '). Tipp sie ein' + (KI.ready() ? ' oder lass sie von der KI lesen.' : '.'), true); return; }
      if (r.missing || (r.err && !String(r.text || '').trim())){ this.msg('Die Handschrifterkennung ist noch nicht geladen' + (r.err ? ' (' + escH(String(r.err).slice(0, 80)) + ')' : '') + '. Tipp die Zeile ein' + (KI.ready() ? ' oder lass sie von der KI lesen.' : '.'), true); return; }
      this.res = r;
      let text = String(r.text || '').trim();
      /* Auch wenn keine Lesart für den Prüfkern lesbar ist (ok === false): die beste Lesart ins Feld, damit man sie korrigieren kann */
      if (!text && Array.isArray(r.items) && r.items.length) text = r.items.map(labelOf).join('').trim();
      const low = typeof r.conf === 'number' && isFinite(r.conf) && r.conf < CONF_MIN;
      this.unsure = !!text && (r.ok === false || low); this.confirmed = false;
      const okBtn = ' <button type="button" class="btn btn-sm" data-a="okread">Stimmt so</button>';
      this.msg(!text ? 'Nichts lesbar. Schreib etwas größer und deutlicher – oder tipp die Zeile.'
        : r.ok === false ? 'Unsicher gelesen: So versteht das Tutorial die Zeile noch nicht. Korrigiere sie im Feld oder tippe unten ein Zeichen an.' + okBtn
        : this.unsure ? 'Unsicher gelesen: Prüf die Vorschau. Stimmt sie nicht, korrigiere im Feld oder tippe unten ein Zeichen an.' + okBtn : '', !text ? true : this.unsure ? 'warn' : false);
      this.apply(text, 'ink');
    }
    /* gelesenen Text ins Eingabefeld; vorher Getipptes bleibt als Vorschlag erhalten */
    apply(text, src){
      const inp = this.R.inp, before = inp.value;
      if (before.trim() && before !== this.lastText && before.trim() !== text) this.prev = before.trim();
      this.kbEdit = false; this.lastText = text; this.src = src;
      if (before !== text){ inp.value = text; this.o.onText && this.o.onText(text, src); }
      this.renderAlts();
    }
    renderAlts(){
      const box = this.alts;
      if (this.mode !== 'pen'){ box.hidden = true; box.innerHTML = ''; return; }
      const cur = this.R.inp.value.trim(), r = this.res, ctx = this.o.ctx ? this.o.ctx() : null;
      const seen = new Set([cur]), alts = [];
      const add = (t, lab) => { t = String(t || '').trim(); if (!t || seen.has(t)) return; seen.add(t); alts.push([t, lab]); };
      if (r){
        if (this.src !== 'ink') add(r.text, 'Lesart im Gerät');
        for (const a of Array.isArray(r.alts) ? r.alts : []){ if (alts.length >= 4) break; add(typeof a === 'string' ? a : a && a.text); }
      }
      if (this.prev) add(this.prev, 'vorher');
      let html = '';
      if (alts.length) html += '<span class="ink-lab">Oder gemeint:</span>' + alts.map(([t, lab], i) => `<button type="button" class="ink-alt" data-alt="${i}" title="${escH(t)}">${lab ? '<span class="tiny muted">' + escH(lab) + ':</span> ' : ''}${lineHTML(t, ctx)}</button>`).join('');
      const syms = r && typeof inkItemChoices === 'function' && this.src === 'ink' ? symsOf(r) : [];
      if (syms.length) html += '<span class="ink-lab">Zeichen antippen:</span><span class="ink-syms">' + syms.map((it, k) => `<button type="button" class="chipc" data-k="${k}" title="Gemeint war …">${escH(labelOf(it))}</button>`).join('') + '</span>';
      if (this.src === 'ki') html = '<span class="ink-lab">Gelesen von der KI (Claude) – prüf die Vorschau.</span>' + html;
      this._alts = alts; this._syms = syms;
      box.innerHTML = html; box.hidden = !html;
    }
    altClick(e){
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.alt != null){ const a = this._alts && this._alts[+b.dataset.alt]; if (a){ const dev = this.res && String(this.res.text || '').trim(); this.apply(a[0], a[0] === dev ? 'ink' : 'alt'); this.chosen(); } return; }
      if (b.dataset.k != null) this.popFor(+b.dataset.k, b);
    }
    /* Lesart selbst gewählt (Chip oder „Gemeint war“): gilt als geprüft */
    chosen(){ if (this.unsure){ this.unsure = false; this.confirmed = true; this.msg(''); } }
    popFor(k, el){
      const P = pop();
      let L;
      try { L = (inkItemChoices(this.res, k) || []).map(normChoice).filter(Boolean); } catch(e){ console.error(e); return; }
      if (!L.length){ P.hidden = true; return; }
      P.innerHTML = '<div class="pop-t">Gemeint war:</div><div class="pop-g">' + L.map((c, i) => `<button type="button" data-i="${i}" class="${c.ok ? '' : 'nok'}" title="${escH((c.text || c.label) + (c.ok ? '' : ' (so nicht lesbar)'))}">${escH(c.label)}</button>`).join('') + '</div>';
      const r = el.getBoundingClientRect();
      P.style.left = Math.max(8, Math.min(window.innerWidth - 290, r.left + window.scrollX - 20)) + 'px';
      P.style.top = (r.bottom + window.scrollY + 6) + 'px';
      P.hidden = false;
      P.onclick = ev => {
        const b = ev.target.closest('button[data-i]'); if (!b) return;
        const c = L[+b.dataset.i]; P.hidden = true;
        let text = c.text, res = c.res || null;
        /* bevorzugt inkApplyChoice: neue Lesart mit dieser Wahl (weitere Korrekturen bauen darauf auf) */
        if (!res && typeof inkApplyChoice === 'function'){
          try { const x = inkApplyChoice(this.res, k, c.cls); if (x && typeof x === 'object' && x.text != null) res = x; else if (typeof x === 'string') text = x; } catch(err){ console.error(err); }
        }
        if (res){ this.res = res; text = res.text; }
        /* eigene Handschrift: die Korrektur als Beispiel merken */
        const it = this._syms && this._syms[k], H = hand();
        if (H && it && Array.isArray(it.strokes) && it.strokes.length && c.cls && c.cls !== (it.c ?? labelOf(it))) { try { H.add(it.strokes, c.cls, 'fix'); } catch(err){} }
        if (text != null){ const keep = this.res; this.apply(String(text).trim(), 'ink'); this.res = keep; this.renderAlts(); this.chosen(); }
        else this.msg('Diese Korrektur kann die Erkennung noch nicht übernehmen. Ändere das Zeichen im Feld darunter.', true);
      };
    }
    async askKI(btn){
      if (!this.ink || !this.ink.strokes.length){ this.msg('Schreib zuerst die Zeile.'); return; }
      if (!KI.ready()){ this.msg('Die KI ist nicht eingerichtet (Einstellungen).', true); return; }
      if (!KI.cfg.inkOk){
        this.msg('<b>Hinweis:</b> Ein Bild dieser Zeile und die Namen aus der Aufgabe gehen an Anthropic (USA). Das zählt wie eine KI-Frage. <button type="button" class="btn btn-sm btn-primary" data-ok="1">Senden</button> <button type="button" class="btn btn-sm" data-ok="0">Abbrechen</button>');
        this.msgEl.onclick = e => { const b = e.target.closest('button[data-ok]'); if (!b) return; this.msgEl.onclick = null; if (b.dataset.ok === '1'){ KI.cfg.inkOk = true; KI.save(); this.askKI(btn); } else this.msg(''); };
        return;
      }
      const png = strokesPNG(this.ink.strokes); if (!png) return;
      const ctx = this.o.ctx ? this.o.ctx() : null;
      btn.disabled = true; this.msg('Die KI liest die Zeile …');
      try {
        const line = await kiReadInk(png, taskInfo(ctx, this.o.task));
        if (!line) throw new Error('Die KI konnte nichts lesen.');
        this.msg('');
        const keep = this.res;
        this.apply(line, 'ki');
        if (keep){ this.res = keep; this.renderAlts(); }
      } catch(e){ this.msg('Die KI konnte die Zeile nicht lesen: ' + escH(String(e.message || e).slice(0, 160)), true); }
      finally { btn.disabled = false; }
    }
    /* Zeile leeren ohne neues Lesen (Knopf × der Zeile) */
    clear(){ if (this.ink){ this.ink.clear(true); clearTimeout(this.t); this.pending = false; } this.res = null; this.lastText = ''; this.prev = ''; this.msg(''); this.renderAlts(); }
    focusPen(){ if (this.mode !== 'pen' || !this.panel) return; try { if (document.activeElement && document.activeElement.blur && document.activeElement.matches('input')) document.activeElement.blur(); this.panel.scrollIntoView({block:'nearest', behavior:'smooth'}); } catch(e){} }
    destroy(){ clearTimeout(this.t); this.pending = false; if (this.ink) this.ink.destroy(); PEN.lines.delete(this); }
  }

  /* ---------- Handschrift anlernen ---------- */
  const TRAIN = ['ψ', 'ħ', '∂', '⟨', '⟩', 'ω', 'φ', 'θ', 'λ', '∫', 'Σ', '∞', '∇', '↑', '↓'];
  const TRAIN_NAME = {'ψ':'psi', 'ħ':'h quer', '∂':'partielles d', '⟨':'spitze Klammer auf (Bra)', '⟩':'spitze Klammer zu (Ket)', 'ω':'omega', 'φ':'phi', 'θ':'theta', 'λ':'lambda', '∫':'Integralzeichen', 'Σ':'Summenzeichen (großes Sigma)', '∞':'unendlich', '∇':'Nabla', '↑':'Pfeil nach oben (Spin auf)', '↓':'Pfeil nach unten (Spin ab)'};
  class HandTrainer {
    constructor(root){
      this.root = root; this.seq = TRAIN.concat(TRAIN); this.i = 0; this.t = 0;
      root.innerHTML = `<div class="hand-row">
          <div class="hand-target" aria-live="polite"><span class="ht-k small muted"></span><span class="ht-sym"></span><span class="ht-name small muted"></span></div>
          <canvas class="hand-cv" aria-label="Feld für ein einzelnes Zeichen"></canvas>
        </div>
        <div class="row hand-btns"><button type="button" class="btn btn-primary" data-h="next">Weiter</button><button type="button" class="btn" data-h="redo">Neu schreiben</button><button type="button" class="btn" data-h="skip">Überspringen</button><span class="grow"></span><button type="button" class="btn" data-h="reset">Eigene Beispiele löschen</button></div>
        <p class="small hand-fb" aria-live="polite"></p><p class="small muted hand-stat"></p>`;
      this.fb = root.querySelector('.hand-fb'); this.stat = root.querySelector('.hand-stat');
      this.ink = new InkCanvas(root.querySelector('.hand-cv'), {lw:3, bg:charBg, onStart:() => clearTimeout(this.t), onChange:() => this.sched()});
      root.addEventListener('click', e => {
        const b = e.target.closest('button[data-h]'); if (!b) return;
        const a = b.dataset.h;
        if (a === 'next') this.take();
        else if (a === 'redo'){ this.ink.clear(false); this.fb.textContent = ''; }
        else if (a === 'skip'){ this.ink.clear(false); this.fb.textContent = ''; this.step(); }
        else if (a === 'reset'){
          const H = hand();
          if (!H){ this.fb.textContent = 'Die Erkennung ist noch nicht geladen.'; return; }
          if (b.dataset.sure){ try { H.clear(); } catch(err){ console.error(err); } delete b.dataset.sure; b.textContent = 'Eigene Beispiele löschen'; this.i = 0; this.show(); this.fb.textContent = 'Alle eigenen Beispiele sind gelöscht.'; }
          else { b.dataset.sure = '1'; b.textContent = 'Wirklich löschen? Noch einmal tippen'; setTimeout(() => { if (b.dataset.sure){ delete b.dataset.sure; b.textContent = 'Eigene Beispiele löschen'; } }, 4000); }
        }
      });
      this.show();
      if (!hand() || !modelReady()) this.fb.textContent = 'Die Handschrifterkennung ist in dieser Fassung noch nicht enthalten. Du kannst schreiben, gespeichert wird aber noch nichts.';
    }
    /* automatisch übernehmen, wenn der Stift gut eine Sekunde nicht mehr schreibt oder schwebt */
    sched(){
      clearTimeout(this.t);
      if (!this.ink.strokes.length) return;
      const tick = () => {
        const quiet = now() - Math.max(PEN.upT, PEN.inkT);
        if (writing() || quiet < 1100){ this.t = setTimeout(tick, 200); return; }
        this.take();
      };
      this.t = setTimeout(tick, 1100);
    }
    take(){
      clearTimeout(this.t);
      const strokes = this.ink.strokes.slice();
      if (!strokes.length){ this.fb.textContent = 'Schreib zuerst das Zeichen.'; return; }
      const target = this.seq[this.i], H = hand();
      if (!H || !modelReady()){ this.fb.textContent = 'Nicht gespeichert: Die Handschrifterkennung ist noch nicht geladen.'; this.ink.clear(false); this.step(); return; }
      let before = '';
      try { const r = recognize(strokes, null); before = String(r && r.text || '').trim(); } catch(e){ before = ''; }
      let n;
      try { n = H.add(strokes, target, 'cal'); }
      catch(e){ console.error(e); this.fb.textContent = 'Speichern ging nicht: ' + (e.message || e); return; }
      if (n === 0){ this.fb.textContent = 'Nicht gespeichert: Das Zeichen ' + target + ' kennt das Modell noch nicht.'; this.ink.clear(false); this.step(); return; }
      this.fb.innerHTML = before && before !== target && before.length <= 4 ? `✓ ${escH(target)} gespeichert (ohne Anlernen gelesen als ${escH(before)}).` : `✓ ${escH(target)} gespeichert.`;
      this.ink.clear(false); this.step();
    }
    step(){ this.i = (this.i + 1) % this.seq.length; this.show(); }
    show(){
      const s = this.seq[this.i];
      this.root.querySelector('.ht-k').textContent = 'Zeichen ' + (this.i + 1) + ' von ' + this.seq.length;
      this.root.querySelector('.ht-sym').textContent = s;
      this.root.querySelector('.ht-name').textContent = TRAIN_NAME[s] || '';
      this.showStat();
    }
    showStat(){
      const H = hand();
      if (!H || typeof H.count !== 'function'){ this.stat.textContent = ''; return; }
      let n = 0; const parts = [];
      for (const c of TRAIN){ let k = 0; try { k = +H.count(c) || 0; } catch(e){} n += k; if (k) parts.push(c + ' ' + k); }
      this.stat.textContent = n ? 'Gespeichert: ' + n + ' eigene Beispiele (' + parts.join(', ') + '). Sie bleiben nur in diesem Browser.' : 'Noch keine eigenen Beispiele gespeichert.';
    }
  }
  function trainerView(main){
    main.append(h('button', {class:'back', type:'button', onclick:() => go('settings')}, '← Einstellungen'));
    main.append(h('h1', {}, 'Handschrift anlernen'));
    main.append(h('p', {class:'muted', style:'margin-top:8px'}, 'Einige Zeichen der Quantenmechanik kennt die Erkennung nur aus wenigen fremden Beispielen. Schreib jedes Zeichen zweimal, einzeln und so wie in einer Rechnung. Nach einer kurzen Pause wird es übernommen. Die Beispiele bleiben nur auf diesem Gerät.'));
    const box = h('div', {class:'box hand', style:'margin-top:14px'});
    main.append(box);
    new HandTrainer(box);
  }
  /* ---------- Schreibprobe: echte Handschrift aufzeichnen, damit die Erkennung ausgewertet werden kann ----------
     Speichert nur auf diesem Gerät (localStorage 'qm-probe-1'), sendet nichts, lernt NICHT an (kein HANDQ.add). */
  const PROBE_KEY = 'qm-probe-1';
  /* Zusammenhang wie bei einer typischen Aufgabe (nicht die Zielzeile selbst, damit die Messung ehrlich bleibt) */
  const PROBE_SPEC = {coords:['x', 't'], params:{m:'pos', k:'pos', L:'pos', a:'pos', ω:'pos', A:'pos', V:'real', E_1:'pos', n:{int:[1, 5]}}, funcs:['Y_1^0']};
  const PROBE_LINES = [
    ['E = ħ^2 k^2/(2m)', 'Bruch als echten Bruch mit Strich'],
    ['∫_0^L |ψ|^2 dx = 1', 'Grenzen unten und oben ans Integral'],
    ['∫_-∞^∞ e^(-a x^2) dx = sqrt(π/a)', 'Hochzahl klein und hoch'],
    ['d/dx sin(k x) = k cos(k x)', ''],
    ['i ħ ∂ψ/∂t = Ĥ ψ', 'Dach direkt über das H'],
    ['∂^2/∂x^2 e^(i k x) = -k^2 e^(i k x)', ''],
    ["ψ'' = -k^2 ψ", 'zwei Striche oben rechts'],
    ['Σ_{n=1}^∞ |c_n|^2 = 1', 'Grenzen unter und über das Summenzeichen'],
    ['⟨ψ|φ⟩ = ⟨φ|ψ⟩^*', 'Sternchen klein oben rechts'],
    ['⟨n|x̂|m⟩', ''],
    ['|ψ⟩ = 1/sqrt(2) (|↑⟩ + |↓⟩)', ''],
    ['[x̂, p̂] = i ħ', ''],
    ['a† |n⟩ = sqrt(n+1) |n+1⟩', '† klein oben rechts'],
    ['σ_x = (0, 1; 1, 0)', 'große Klammern über beide Zeilen'],
    ['χ = 1/sqrt(2) (1; i)', 'Spaltenvektor in großen Klammern'],
    ['ψ^* ψ = |ψ|^2', ''],
    ['Δx Δp ≥ ħ/2', ''],
    ['E_n = -E_1/n^2', 'Index klein und tief'],
    ['λ = 2π/k', ''],
    ['ψ(t) = A cos(ω t + φ)', ''],
    ['ψ(x) = sqrt(2/L) sin(n π x/L)', 'Bruch unter der Wurzel'],
    ['p̂ = -i ħ d/dx', ''],
    ['Y_1^0(θ, φ) = sqrt(3/(4π)) cos(θ)', 'Index unten, Hochzahl oben am Y']
  ];
  let PCTX = null;
  const probeCtx = () => PCTX || (PCTX = makeCtx(JSON.parse(JSON.stringify(PROBE_SPEC))));
  /* normierte KaTeX-Ausgabe: gleich geschrieben ⇔ gleiche Formel (Leerzeichen, \left/\right, Abstände egal) */
  function texNorm(src){
    try { return texLine(parseLine(String(src || ''), probeCtx().pctx)).replace(/\\(?:left|right|middle|bigg?|Bigg?)(?![a-zA-Z])/g, '').replace(/\\[,;:!]/g, ' ').replace(/\s+/g, ' ').replace(/ ?([^a-zA-Z ]) ?/g, '$1').trim(); }
    catch(e){ return null; }
  }
  /* im Browser-Speicher kompakt (Punkte als Zahlenreihen, etwa halb so groß), in Datei und Zwischenablage als Objekte {x, y, t, p, tiltX, tiltY} */
  const packPts = pts => pts.map(p => p.tiltX != null ? [p.x, p.y, p.t, p.p, p.tiltX, p.tiltY] : [p.x, p.y, p.t, p.p]);
  const unpackPts = a => a.map(q => { const p = {x:q[0], y:q[1], t:q[2], p:q[3]}; if (q.length > 4){ p.tiltX = q[4]; p.tiltY = q[5]; } return p; });
  const probePack = d => Object.assign({}, d, {packed:1, lines:d.lines.map(l => l.strokes ? Object.assign({}, l, {strokes:l.strokes.map(s => ({pointerType:s.pointerType, a:packPts(s.points)}))}) : l)});
  const probeUnpack = d => { if (!d.packed) return d; const o = Object.assign({}, d, {lines:d.lines.map(l => l.strokes ? Object.assign({}, l, {strokes:l.strokes.map(s => ({pointerType:s.pointerType, points:s.points || unpackPts(s.a || [])}))}) : l)}); delete o.packed; return o; };
  const probeLoad = () => { try { const d = JSON.parse(localStorage.getItem(PROBE_KEY) || 'null'); return d && d.app === 'qm-schreibprobe' && Array.isArray(d.lines) ? probeUnpack(d) : null; } catch(e){ return null; } };
  function probeSave(d){
    d.updated = new Date().toISOString(); d.summary = probeSum(d);
    try { localStorage.setItem(PROBE_KEY, JSON.stringify(probePack(d))); return true; }
    catch(e){ toast('Der Speicher im Browser ist voll. Sichere die Probe jetzt als Datei.'); return false; }
  }
  function deviceInfo(){
    const n = navigator, mm = q => { try { return matchMedia(q).matches; } catch(e){ return null; } };
    return {userAgent:n.userAgent, platform:(n.userAgentData && n.userAgentData.platform) || n.platform || '', lang:n.language || '', dpr:window.devicePixelRatio || 1,
      screen:{w:screen.width, h:screen.height}, viewport:{w:innerWidth, h:innerHeight}, maxTouchPoints:n.maxTouchPoints || 0, pointerFine:mm('(pointer: fine)'), anyHover:mm('(any-hover: hover)')};
  }
  function recogInfo(){
    let m = null;
    try { if (typeof INKR !== 'undefined' && INKR.model){ const M = INKR.model(); if (M) m = {arch:M.arch, classes:M.N, F:M.F, sig:String(M.sig || '').slice(0, 400)}; } } catch(e){}
    let hs = null; try { const H = hand(); if (H && H.count) hs = H.count(); } catch(e){}
    return {ready:modelReady(), classes:classes() ? classes().length : null, model:m, handSamples:hs};
  }
  function probeNew(){
    const iso = new Date().toISOString();
    return {app:'qm-schreibprobe', v:1, id:Math.random().toString(36).slice(2, 10), started:iso, updated:iso, finished:null,
      appVersion:typeof APP_VERSION !== 'undefined' ? APP_VERSION : '', device:deviceInfo(), recognizer:recogInfo(),
      context:{name:'probe-1', spec:JSON.parse(JSON.stringify(PROBE_SPEC))},
      lines:PROBE_LINES.map(([target], i) => ({i:i + 1, target, done:false}))};
  }
  /* Lesarten in Rangfolge (beste zuerst, ohne Doppelte) und Rang der Zielzeile (0 = sofort richtig, -1 = nicht dabei) */
  function rankOf(read, target){
    const tn = texNorm(target), list = [];
    for (const t of [read.text].concat((read.alts || []).map(a => a.text))){ const x = String(t || '').trim(); if (x && !list.includes(x)) list.push(x); }
    return {list, rank:tn == null ? -1 : list.findIndex(t => texNorm(t) === tn)};
  }
  function probeSum(d){
    const w = d.lines.filter(l => l.done && !l.skipped && l.read);
    return {lines:d.lines.length, written:w.length, skipped:d.lines.filter(l => l.skipped).length, top1:w.filter(l => l.rank === 0).length, top3:w.filter(l => l.rank >= 0 && l.rank < 3).length};
  }
  function probeView(main){
    main.append(h('button', {class:'back', type:'button', onclick:() => go('settings')}, '← Einstellungen'));
    main.append(h('h1', {}, 'Schreibprobe'));
    const box = h('div', {class:'probe'});
    main.append(box);
    let d = probeLoad(), cur = -1, ink = null;
    const firstOpen = () => d ? d.lines.findIndex(l => !l.done) : 0;
    function intro(){
      const k = d ? firstOpen() : 0, part = d && d.lines.some(l => l.done);
      box.innerHTML = `<div class="stack">
        <p>Mit der Schreibprobe prüfen wir, wie gut das Tutorial deine Handschrift liest. Du schreibst ${PROBE_LINES.length} vorgegebene Zeilen mit dem Stift. Das dauert etwa 10 Minuten.</p>
        <ul class="clean small">
          <li>Schreib jede Zeile genau so, wie sie dasteht, in deiner normalen Schrift – nicht schöner als sonst.</li>
          <li>Gespeichert werden nur die Striche (Punkte, Zeit, Druck, Neigung des Stifts), die Lesart und Gerätedaten (Bildschirmgröße, Browser). Nichts wird gesendet.</li>
          <li>Am Ende sicherst du alles als Datei und gibst sie Claude, zum Beispiel als Anhang im Chat.</li>
          <li>Die Probe lernt deine Handschrift nicht an. Das geht getrennt unter „Handschrift anlernen“.</li>
          <li>Eine Zeile passt nicht? Dann überspring sie einfach.</li>
        </ul>
        ${modelReady() ? '' : '<p class="small ink-msg bad">Die Handschrifterkennung ist nicht geladen. Die Striche werden trotzdem aufgezeichnet.</p>'}
        <div class="row"><button type="button" class="btn btn-primary" data-p="go">${part ? 'Weiter bei Zeile ' + (k + 1) : 'Schreibprobe starten'}</button>${part ? '<button type="button" class="btn" data-p="sum">Zwischenstand</button><button type="button" class="btn" data-p="del">Probe löschen</button>' : ''}</div></div>`;
      box.onclick = e => {
        const b = e.target.closest('button[data-p]'); if (!b) return;
        if (b.dataset.p === 'go'){ if (!d){ d = probeNew(); probeSave(d); } line(firstOpen()); }
        else if (b.dataset.p === 'sum') summary();
        else if (b.dataset.p === 'del') del(b, intro);
      };
    }
    function del(b, after){
      if (!b.dataset.sure){ b.dataset.sure = '1'; b.textContent = 'Wirklich löschen? Noch einmal tippen'; setTimeout(() => { if (b.isConnected && b.dataset.sure){ delete b.dataset.sure; b.textContent = 'Probe löschen'; } }, 4000); return; }
      try { localStorage.removeItem(PROBE_KEY); } catch(e){}
      d = null; toast('Probe gelöscht.'); after();
    }
    function line(k){
      if (k < 0 || k >= d.lines.length){ summary(); return; }
      cur = k;
      const L = d.lines[k], [target, tip] = PROBE_LINES[k];
      const prev = k > 0 ? d.lines[k - 1] : null;
      const fb = prev && prev.done ? (prev.skipped ? 'Zeile ' + k + ' übersprungen.' : prev.rank === 0 ? 'Zeile ' + k + ': richtig gelesen ✓' : 'Zeile ' + k + ': gelesen als ' + lineHTML(prev.read && prev.read.text || '–', probeCtx())) : '';
      box.innerHTML = `<div class="probe-head"><span class="small">Zeile ${k + 1} von ${d.lines.length}</span><span class="bar"><i style="width:${Math.round(100 * k / d.lines.length)}%"></i></span></div>
        <div class="probe-target"><span class="small muted">Schreib genau das:</span><div class="probe-tex">${texHTML(texLine(parseLine(target, probeCtx().pctx)), true)}</div>${tip ? '<span class="small muted">' + escH(tip) + '</span>' : ''}</div>
        <div class="inkp${S().inkTall ? ' tall' : ''}"><div class="ink-tools">
          <button type="button" class="btn btn-sm" data-a="undo" aria-label="Rückgängig">↶<span class="lbl">Rückgängig</span></button>
          <button type="button" class="btn btn-sm" data-a="clear" aria-label="Löschen">✕<span class="lbl">Löschen</span></button>
          <button type="button" class="btn btn-sm ink-er" data-a="eraser" aria-pressed="false" aria-label="Radierer">⌫<span class="lbl">Radierer</span></button>
          <button type="button" class="btn btn-sm ink-tall" data-a="tall" aria-pressed="${S().inkTall ? 'true' : 'false'}" aria-label="Schreibfläche größer">⤢<span class="lbl">Größer</span></button>
        </div><canvas class="ink-cv" aria-label="Schreibfläche für Zeile ${k + 1}"></canvas><div class="ink-msg small" hidden></div></div>
        <div class="row probe-btns"><button type="button" class="btn btn-primary" data-p="next">Weiter</button><button type="button" class="btn" data-p="skip">Überspringen</button>${k > 0 ? '<button type="button" class="btn btn-ghost" data-p="back">← Zurück</button>' : ''}<span class="grow"></span><button type="button" class="btn btn-ghost" data-p="pause">Pause</button></div>
        <p class="small muted probe-fb" aria-live="polite">${fb}</p>`;
      if (ink) ink.destroy();
      const panel = box.querySelector('.inkp'), msg = box.querySelector('.ink-msg');
      ink = new InkCanvas(box.querySelector('canvas'), {lw:2.6, bg:lineBg, rec:true,
        onTouchIgnored:() => { if (PEN.fingerHint) return; PEN.fingerHint = true; toast('Der Finger schreibt hier nicht. Nimm den Stift.'); }});
      const cnt = {undo:0, clear:0};
      /* „Zurück“: gespeicherte Striche dieser Zeile wieder zeigen */
      if (L.done && L.strokes && L.strokes.length){
        const t0 = 0;
        ink.strokes = L.strokes.map(s => { const a = s.points.map(p => Object.assign({}, p, {t:t0 + p.t})); a.pt = s.pointerType; return a; });
        requestAnimationFrame(() => { ink.fit(); ink.redraw(); });
      }
      box.onclick = e => {
        const b = e.target.closest('button'); if (!b) return;
        const a = b.dataset.a, p = b.dataset.p;
        if (a === 'undo'){ cnt.undo++; ink.undo(); }
        else if (a === 'clear'){ cnt.clear++; ink.clear(true); }
        else if (a === 'eraser'){ const on = !ink.eraser; ink.eraser = on; b.setAttribute('aria-pressed', on); panel.classList.toggle('erasing', on); }
        else if (a === 'tall'){ const on = !panel.classList.contains('tall'); panel.classList.toggle('tall', on); b.setAttribute('aria-pressed', on); const st = S(); st.inkTall = on; store.save(); }
        else if (p === 'next'){
          if (!ink.strokes.length){ msg.textContent = 'Schreib zuerst die Zeile – oder tippe auf „Überspringen“.'; msg.hidden = false; return; }
          record(L, cnt); probeSave(d); line(k + 1);
        }
        else if (p === 'skip'){ Object.assign(L, {done:true, skipped:true, strokes:[], read:null, rank:-1, at:new Date().toISOString()}); probeSave(d); line(k + 1); }
        else if (p === 'back') line(k - 1);
        else if (p === 'pause'){ probeSave(d); intro(); }
      };
      box.querySelector('.probe-target').scrollIntoView({block:'nearest'});
    }
    /* eine Zeile aufzeichnen und lesen (ohne Anlernen) */
    function record(L, cnt){
      const S0 = ink.strokes;
      let t0 = Infinity; for (const s of S0) for (const p of s) if (p.t < t0) t0 = p.t;
      if (!isFinite(t0)) t0 = 0;
      const strokes = S0.map(s => ({pointerType:s.pt || '', points:s.map(p => { const q = {x:p.x, y:p.y, t:Math.round(p.t - t0), p:p.p}; if (p.tiltX != null){ q.tiltX = p.tiltX; q.tiltY = p.tiltY; } return q; })}));
      let read = null;
      const t1 = performance.now();
      try {
        const r = recognize(S0.map(s => s.map(p => ({x:p.x, y:p.y, t:p.t}))), probeCtx());
        read = {text:String(r.text || ''), alts:(r.alts || []).slice(0, 5).map(a => ({text:String(a && a.text || a || ''), score:a && a.score != null ? Math.round(a.score * 1e4) / 1e4 : null})), conf:r.conf != null ? r.conf : null, ok:r.ok != null ? r.ok : null, ms:r.ms != null ? r.ms : Math.round(performance.now() - t1)};
        if (r.missing) read.err = 'Erkennung nicht geladen'; else if (r.err) read.err = String(r.err);
      } catch(e){ console.error(e); read = {text:'', alts:[], conf:null, ok:false, ms:Math.round(performance.now() - t1), err:String(e.message || e)}; }
      const rk = rankOf(read, L.target);
      Object.assign(L, {done:true, skipped:false, at:new Date().toISOString(), strokes, nStrokes:strokes.length, box:{w:Math.round(ink.w), h:Math.round(ink.h)}, dpr:window.devicePixelRatio || 1,
        tall:box.querySelector('.inkp').classList.contains('tall'), durMs:Math.max(0, ...strokes.flatMap(s => s.points.map(p => p.t))), edits:{undo:cnt.undo, clear:cnt.clear, erase:ink.nErase || 0},
        read, readings:rk.list.slice(0, 5), rank:rk.rank, same:rk.rank === 0, targetTex:texNorm(L.target)});
    }
    function summary(){
      if (ink){ ink.destroy(); ink = null; }
      if (!d){ intro(); return; }
      const all = d.lines.every(l => l.done);
      if (all && !d.finished){ d.finished = new Date().toISOString(); probeSave(d); }
      const s = probeSum(d);
      const name = 'qm-schreibprobe-' + today() + '.json';
      box.innerHTML = `<div class="stack">
        <h2>${all ? 'Fertig – danke!' : 'Zwischenstand'}</h2>
        <p class="probe-score"><b>${s.top1} von ${s.written}</b> geschriebenen Zeilen sofort richtig gelesen, <b>${s.top3}</b> unter den ersten drei Lesarten${s.skipped ? ' (' + s.skipped + ' übersprungen)' : ''}.</p>
        <div class="row"><button type="button" class="btn btn-primary" data-p="file">Als Datei sichern</button><button type="button" class="btn" data-p="clip">In die Zwischenablage</button>${all ? '' : '<button type="button" class="btn" data-p="go">Weiter schreiben</button>'}<span class="grow"></span><button type="button" class="btn" data-p="again">Noch einmal schreiben</button><button type="button" class="btn" data-p="del">Probe löschen</button></div>
        <p class="small">Gib die Datei <code>${escH(name)}</code> an Claude, zum Beispiel als Anhang im Chat. Sie enthält nur deine Striche, die Lesarten und Gerätedaten.</p>
        <div class="probe-tbw"><table class="tb probe-tb"><tr><th>#</th><th>Zielzeile</th><th>gelesen</th><th></th></tr>${d.lines.map(l => `<tr class="${l.skipped ? 'skip' : !l.done ? 'open' : l.rank === 0 ? 'ok' : l.rank > 0 && l.rank < 3 ? 'near' : 'bad'}"><td>${l.i}</td><td>${lineHTML(l.target, probeCtx())}</td><td>${l.skipped ? '<span class="muted">übersprungen</span>' : !l.done ? '<span class="muted">offen</span>' : l.read && l.read.text ? lineHTML(l.read.text, probeCtx()) : '<span class="muted">nichts gelesen</span>'}</td><td>${l.skipped || !l.done ? '' : l.rank === 0 ? '✓' : l.rank > 0 ? 'Platz ' + (l.rank + 1) : '✗'}</td></tr>`).join('')}</table></div></div>`;
      box.onclick = e => {
        const b = e.target.closest('button[data-p]'); if (!b) return;
        const p = b.dataset.p;
        if (p === 'file') download(name, JSON.stringify(d), 'application/json');
        else if (p === 'clip'){ try { navigator.clipboard.writeText(JSON.stringify(d)).then(() => toast('Kopiert. Im Chat einfügen oder in eine Datei speichern.'), () => toast('Kopieren nicht möglich. Nimm „Als Datei sichern“.')); } catch(err){ toast('Kopieren nicht möglich. Nimm „Als Datei sichern“.'); } }
        else if (p === 'go') line(firstOpen());
        else if (p === 'again'){ if (!b.dataset.sure){ b.dataset.sure = '1'; b.textContent = 'Alte Probe ersetzen? Noch einmal tippen'; return; } d = probeNew(); probeSave(d); line(0); }
        else if (p === 'del') del(b, intro);
      };
    }
    if (d && d.lines.every(l => l.done)) summary(); else intro();
  }

  /* noch nicht gelesene Handschrift sofort lesen (vor Seitenwechsel, Abgeben, Schließen) */
  function flushAll(){ for (const L of [...PEN.lines]){ if (!L.pending) continue; try { L.flush(); } catch(e){ console.error(e); } } }
  window.addEventListener('pagehide', flushAll);
  /* Zustand für die Einstellungen */
  function status(){
    if (!modelReady()) return 'Die Handschrifterkennung ist in dieser Fassung noch nicht enthalten. Mit eigenem KI-Schlüssel kann die KI eine Zeile lesen.';
    const C = classes();
    return 'Die Handschrift wird im Gerät gelesen (ohne Internet' + (C ? ', ' + C.length + ' Zeichen' : '') + ').';
  }
  return {InkCanvas, InkLine, defaultMode, pref, trainerView, probeView, PROBE_LINES, probeTexNorm:texNorm, probeLoad, status, recogReady, modelReady, strokesPNG, taskInfo, flushAll, PEN, installPalmGuard};
})();
