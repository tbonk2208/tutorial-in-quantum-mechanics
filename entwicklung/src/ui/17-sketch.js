/* ===== Skizzenaufgaben und Schmierzettel (Festlegung: didaktik/SKIZZE.md, Abschnitt 4) =====
   Rechnen, Abtasten und Auswerten macht der Kern SKETCH (src/engine/80-sketch.js): map, evaluate, model.
   Hier: Zeichenfläche mit Rahmen, Werkzeuge, Speichern, Rückmeldung, Musterskizze, Hinweise, Schmierzettel.
   Beide Flächen bauen auf INKUI.InkCanvas (15-ink.js) auf: Handballen-Schutz, Radierer, Stift-Seitentaste, pointer capture.
   Skizzenstriche liegen in Weltkoordinaten (Größenänderungen verschieben nichts), Schmierzettel in ganzen px.
   Speicher: localStorage 'qm-sketch-1' = {v:1, z:{[spec.id + Kontext]: {s:[[[x, y], …], …], u, n, ok, h, nh, bk}}}
             localStorage 'qm-scratch-1' = {v:1, g, z:{[task.id + slot]: {s:[[x0, y0, x1, y1, …], …], h, g, o, u}}}
   Nichts davon geht an die KI oder ins Internet. */
const SKUI = (() => {
  const ready = () => typeof SKETCH !== 'undefined' && !!SKETCH && typeof SKETCH.map === 'function' && typeof SKETCH.evaluate === 'function';
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const ST = () => (store.data && store.data.settings) || {};
  const PEN = () => INKUI.PEN;
  /* Finger: nach der Einstellung – oder solange auf diesem Gerät nie ein Stift gesehen wurde (Telefon) */
  const fingerOK = () => !!ST().inkFinger || (!PEN().seen && !ST().penSeen);
  const touchIgnored = () => { const P = PEN(); if (P.fingerHint) return; P.fingerHint = true; toast('Der Finger zeichnet hier nicht, weil ein Stift benutzt wurde (Schutz vor dem Handballen). In den Einstellungen kannst du den Finger einschalten.'); };

  /* ---------- Speicher mit Verdrängung (am längsten unbenutzt zuerst) ---------- */
  function mkStore(key, max){
    let D = null, raw = null;
    const load = () => {
      let r = null; try { r = localStorage.getItem(key); } catch(e){}
      if (D && r === raw) return D;
      raw = r; try { D = JSON.parse(r || 'null'); } catch(e){ D = null; }
      if (!D || typeof D !== 'object' || !D.z || typeof D.z !== 'object') D = {v:1, z:{}};
      return D;
    };
    const oldest = (d, keep) => { let k0 = null, u0 = Infinity; for (const k of Object.keys(d.z)) if (k !== keep && (d.z[k].u || 0) < u0){ u0 = d.z[k].u || 0; k0 = k; } return k0; };
    const write = keep => {
      const d = load();
      let s = JSON.stringify(d);
      while (s.length > max){ const k = oldest(d, keep); if (!k) break; delete d.z[k]; s = JSON.stringify(d); }
      for (let i = 0; i < 400; i++){
        try { localStorage.setItem(key, s); raw = s; return true; }
        catch(e){ const k = oldest(d, keep); if (!k) return false; delete d.z[k]; s = JSON.stringify(d); }
      }
      return false;
    };
    return {
      get:k => load().z[k] || null,
      put(k, v){ const d = load(); v.u = Date.now(); d.z[k] = v; return write(k); },
      meta(){ return load(); },
      del(k){ const d = load(); if (d.z[k]){ delete d.z[k]; write(null); } },
      dropSuffix(suf){ const d = load(); let ch = false; for (const k of Object.keys(d.z)) if (k.endsWith(suf)){ delete d.z[k]; ch = true; } if (ch) write(null); },
      reset(){ D = null; raw = null; try { localStorage.removeItem(key); } catch(e){} },
      size:() => JSON.stringify(load()).length, max
    };
  }
  const SK = mkStore('qm-sketch-1', 1000000), SCR = mkStore('qm-scratch-1', 1500000);

  /* ---------- Aufgaben finden ---------- */
  function eachSpec(fn){
    for (const t of typeof TOPICS !== 'undefined' ? TOPICS : []){
      for (const sp of t.sketch || []) fn(sp, t, 'practice');
      if (t.lab && t.lab.sketch) fn(t.lab.sketch, t, 'lab');
      for (const it of (t.final || []).concat(t.finalB || [])) if (it && it.sketch) fn(it.sketch, t, 'final');
    }
  }
  function byId(id){ let r = null; eachSpec((sp, t, where) => { if (!r && sp.id === id) r = {spec:sp, topic:t, where}; }); return r; }
  const topicOf = id => { const r = byId(id); return r ? r.topic : null; };

  /* ---------- Plot vervollständigen, Höhe der Fläche ---------- */
  function plotOf(spec){
    const p = Object.assign({}, spec.plot || {});
    if (!p.x) p.x = [0, 1];
    /* Vorgabe für y aus dem Kern (abs2: [−0,25, 1], Achse y = 0 über dem unteren Rand; sonst [−1, 1]) */
    if (!p.y) p.y = spec.kind === 'arrows' ? [-2, 2] : ready() && SKETCH.plotOf ? SKETCH.plotOf(spec).y.slice() : spec.draw === 'abs2' ? [-0.25, 1] : [-1, 1];
    return p;
  }
  const isArrows = spec => spec.kind === 'arrows';
  /* Pfeile: gleicher Maßstab in x und y (Winkel und Einheitskreis unverzerrt); Kurven: etwa 2 : 1, mindestens 220 px hoch */
  function heightFor(spec, plot, W){
    if (isArrows(spec)){ const k = (plot.y[1] - plot.y[0]) / (plot.x[1] - plot.x[0]); return Math.max(160, Math.round((W - 60) * k + 48)); }
    return Math.max(220, Math.min(440, Math.round(W / 2)));
  }
  function maxWidthFor(spec, plot){ if (!isArrows(spec)) return null; const k = (plot.x[1] - plot.x[0]) / (plot.y[1] - plot.y[0]); return Math.round((430 - 48) * k + 60); }

  /* ---------- Zeichenfläche in Weltkoordinaten ----------
     opt.plot (vollständig), opt.spec, opt.W = {s:[Weltstriche]}, opt.over(c, cv) (Überlagerung), opt.onFit(cv) */
  const q4 = v => Math.round(v * 1e4) / 1e4;
  class SketchCanvas extends INKUI.InkCanvas {
    fit(){
      const cv = this.cv, o = this.opt;
      if (!ready()) return;
      const r = cv.getBoundingClientRect(); if (!r.width) return;
      const H = heightFor(o.spec, o.plot, r.width);
      if (Math.abs(r.height - H) > 1){ cv.style.height = H + 'px'; return; }   /* der ResizeObserver ruft fit() mit der neuen Höhe */
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      if (this.w === r.width && this.h === r.height && this.dpr === dpr) return;
      this.w = r.width; this.h = r.height; this.dpr = dpr;
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      /* Art und Zeichenmodus mitgeben (der Kern bildet Pfeile isotrop ab, abs2 hat die y-Vorgabe [−0,25, 1]) */
      this.M = SKETCH.map({kind:o.spec.kind || 'curve', draw:o.spec.draw, plot:o.plot}, this.w, this.h);
      this.reproject();
      this.redraw();
      if (o.onFit) o.onFit(this);
    }
    /* Weltstriche → Pixelstriche (nach Größenänderung und beim Laden); die Zuordnung bleibt über die Identität der Arrays */
    reproject(){
      if (!this.M) return;
      const C = this.wc || (this.wc = new WeakMap());
      const px = ws => { const a = ws.map(p => { const P = this.M.px(p[0], p[1]); return {x:P[0], y:P[1], t:0, p:.5}; }); C.set(a, ws); return a; };
      this.strokes = (this.opt.W.s || []).map(px);
      if (this.trash) this.trash = this.trash.map(s => { const w = C.get(s); return w ? px(w) : s; });
    }
    /* Pixelstriche → Weltstriche (nach jeder Änderung) */
    sync(){
      if (!this.M) return;
      const C = this.wc || (this.wc = new WeakMap());
      this.opt.W.s = this.strokes.map(s => { let w = C.get(s); if (!w){ w = s.map(p => { const P = this.M.world(p.x, p.y); return [q4(P[0]), q4(P[1])]; }); C.set(s, w); } return w; });
    }
    setWorld(ws){ this.opt.W.s = ws || []; this.trash = null; this.reproject(); this.redraw(); }
    redraw(){
      /* Rahmen als Hintergrund (läuft schon im Konstruktor von InkCanvas, daher hier und nicht über eine Variable) */
      if (!this.bgSet){ this.bgSet = true; this.opt.bg = c => drawFrame(c, this); }
      super.redraw();
      if (!this.w || !this.opt.over) return;
      const c = this.g; c.save(); c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      try { this.opt.over(c, this); } catch(e){ console.error(e); }
      c.restore();
    }
  }

  /* ---------- Rahmen: Achsen, Ticks, Wände, Potential, Energie, Bereiche, Gitter, Einheitskreis, gegebene Pfeile ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function axesPos(M, plot){
    return {X:M.px(clamp(0, plot.x[0], plot.x[1]), plot.y[0])[0], Y:M.px(plot.x[0], clamp(0, plot.y[0], plot.y[1]))[1]};
  }
  function vRange(plot){
    if (Array.isArray(plot.Vr) && plot.Vr[1] > plot.Vr[0]) return plot.Vr;
    let a = Infinity, b = -Infinity;
    for (let i = 0; i <= 200; i++){ const v = +plot.V(plot.x[0] + (plot.x[1] - plot.x[0]) * i / 200); if (isFinite(v)){ a = Math.min(a, v); b = Math.max(b, v); } }
    if (plot.E != null && isFinite(plot.E)) b = Math.max(b, plot.E);
    if (!isFinite(a)) return [0, 1];
    if (b - a < 1e-9) b = a + 1;
    return [a - 0.05 * (b - a), b + 0.25 * (b - a)];
  }
  function hatch(c, x0, x1, y0, y1){
    if (x1 - x0 < 1) return;
    c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip();
    c.beginPath();
    for (let x = x0 - (y1 - y0); x < x1 + 8; x += 7){ c.moveTo(x, y1); c.lineTo(x + (y1 - y0), y0); }
    c.stroke(); c.restore();
  }
  function arrowPath(c, A, B, head){
    const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy); if (L < 1) return;
    const ux = dx / L, uy = dy / L, hh = Math.min(head, L * 0.45);
    c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0] - ux * hh * 0.6, B[1] - uy * hh * 0.6); c.stroke();
    c.beginPath(); c.moveTo(B[0], B[1]); c.lineTo(B[0] - ux * hh - uy * hh * 0.45, B[1] - uy * hh + ux * hh * 0.45); c.lineTo(B[0] - ux * hh + uy * hh * 0.45, B[1] - uy * hh - ux * hh * 0.45); c.closePath(); c.fill();
  }
  const gridVals = (a, b, g) => { const out = []; if (!(g > 0)) return out; for (let k = Math.ceil(a / g - 1e-9); k * g <= b + 1e-9 && out.length < 60; k++) out.push(Math.round(k * g * 1e9) / 1e9); return out; };
  function drawFrame(c, cv){
    const M = cv.M; if (!M) return;
    const spec = cv.opt.spec, plot = cv.opt.plot, I = M.inner, R = I.l + I.w, B = I.t + I.h;
    const C = {grid:css('--grid') || '#e5e8f1', gs:css('--grid-strong') || '#cbd1e1', axis:css('--axis') || '#3a4258', muted:css('--muted') || '#57607a', c4:css('--c4') || '#d7811a', c1:css('--c1') || '#cf2f4c', c2:css('--c2') || '#1f6db0'};
    c.save();
    c.lineCap = 'butt';
    /* Bereiche */
    for (const rg of plot.regions || []){
      if (!rg || !Array.isArray(rg.x)) continue;
      const a = clamp(M.px(rg.x[0], 0)[0], I.l, R), b = clamp(M.px(rg.x[1], 0)[0], I.l, R);
      c.globalAlpha = 0.11; c.fillStyle = C.c4; c.fillRect(Math.min(a, b), I.t, Math.abs(b - a), I.h); c.globalAlpha = 1;
    }
    /* Gitter */
    if (plot.grid > 0){
      c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
      for (const x of gridVals(plot.x[0], plot.x[1], plot.grid)){ const X = Math.round(M.px(x, 0)[0]) + .5; c.moveTo(X, I.t); c.lineTo(X, B); }
      for (const y of gridVals(plot.y[0], plot.y[1], plot.grid)){ const Y = Math.round(M.px(0, y)[1]) + .5; c.moveTo(I.l, Y); c.lineTo(R, Y); }
      c.stroke();
    }
    /* Hilfslinien zu den Ticks */
    c.strokeStyle = C.grid; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath();
    for (const tk of plot.ticks || []){ const X = Math.round(M.px(tk.x, 0)[0]) + .5; if (X > I.l + 1 && X < R - 1){ c.moveTo(X, I.t); c.lineTo(X, B); } }
    for (const tk of plot.yticks || []){ const Y = Math.round(M.px(0, tk.y)[1]) + .5; if (Y > I.t + 1 && Y < B - 1){ c.moveTo(I.l, Y); c.lineTo(R, Y); } }
    c.stroke(); c.setLineDash([]);
    /* Potential (hellgrau) und Energie (gestrichelt). Untergrenze von Vr: unterer Rand – bei Kurven ≥ 0 (abs2, nonneg)
       mit Platz unter null aber die Achse y = 0, damit V = 0 und E wie gewohnt über der Achse liegen und der Streifen
       unter null frei bleibt */
    const VB = (spec.draw === 'abs2' || (spec.checks || []).some(q => q && q.type === 'nonneg')) && plot.y[0] < 0 && plot.y[1] > 0 ? M.px(plot.x[0], 0)[1] : B;
    if (typeof plot.V === 'function'){
      const Vr = vRange(plot), mapV = v => VB - (VB - I.t) * (v - Vr[0]) / (Vr[1] - Vr[0]);
      const pts = [];
      for (let X = I.l; X <= R + 0.01; X += 1){ let v; try { v = +plot.V(M.world(X, 0)[0]); } catch(e){ v = NaN; } pts.push([X, isNaN(v) ? VB : v === Infinity ? I.t : v === -Infinity ? B : clamp(mapV(v), I.t, B)]); }
      c.beginPath(); c.moveTo(I.l, VB); for (const p of pts) c.lineTo(p[0], p[1]); c.lineTo(R, VB); c.closePath();
      c.globalAlpha = 0.13; c.fillStyle = C.muted; c.fill(); c.globalAlpha = 0.7;
      c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.stroke(); c.globalAlpha = 1;
      if (plot.E != null && isFinite(plot.E)){ const Y = Math.round(clamp(mapV(plot.E), I.t, B)) + .5; c.strokeStyle = C.c1; c.lineWidth = 1.5; c.setLineDash([7, 5]); c.beginPath(); c.moveTo(I.l, Y); c.lineTo(R, Y); c.stroke(); c.setLineDash([]); cv.eY = Y; }
    } else if (plot.E != null && isFinite(plot.E) && Array.isArray(plot.Vr)){
      const Y = Math.round(clamp(VB - (VB - I.t) * (plot.E - plot.Vr[0]) / (plot.Vr[1] - plot.Vr[0]), I.t, B)) + .5; c.strokeStyle = C.c1; c.lineWidth = 1.5; c.setLineDash([7, 5]); c.beginPath(); c.moveTo(I.l, Y); c.lineTo(R, Y); c.stroke(); c.setLineDash([]); cv.eY = Y;
    }
    /* Wände (unendlich hoch): außerhalb [a, b] schraffiert */
    if (Array.isArray(plot.walls) && plot.walls.length === 2){
      const Xa = M.px(plot.walls[0], 0)[0], Xb = M.px(plot.walls[1], 0)[0];
      c.strokeStyle = C.axis; c.globalAlpha = 0.45; c.lineWidth = 1;
      if (Xa - I.l > 6) hatch(c, I.l, Xa, I.t, B); else hatch(c, Xa - 11, Xa, I.t, B);
      if (R - Xb > 6) hatch(c, Xb, R, I.t, B); else hatch(c, Xb, Xb + 11, I.t, B);
      c.globalAlpha = 1; c.lineWidth = 3; c.beginPath(); c.moveTo(Xa, I.t); c.lineTo(Xa, B); c.moveTo(Xb, I.t); c.lineTo(Xb, B); c.stroke();
    }
    /* Rahmen der Innenfläche */
    c.strokeStyle = C.gs; c.lineWidth = 1; c.strokeRect(I.l + .5, I.t + .5, I.w - 1, I.h - 1);
    /* Achsen mit Pfeilspitze */
    const ax = axesPos(M, plot);
    c.strokeStyle = C.axis; c.fillStyle = C.axis; c.lineWidth = 1.3;
    arrowPath(c, [I.l, Math.round(ax.Y) + .5], [R + 8, Math.round(ax.Y) + .5], 8);
    arrowPath(c, [Math.round(ax.X) + .5, B], [Math.round(ax.X) + .5, I.t - 8], 8);
    /* Tick-Striche */
    c.lineWidth = 1.2; c.beginPath();
    const xt = (plot.ticks && plot.ticks.length) ? plot.ticks.map(t => t.x) : isArrows(spec) && plot.grid > 0 ? gridVals(plot.x[0], plot.x[1], plot.grid) : [];
    const yt = (plot.yticks && plot.yticks.length) ? plot.yticks.map(t => t.y) : isArrows(spec) && plot.grid > 0 ? gridVals(plot.y[0], plot.y[1], plot.grid) : [];
    for (const x of xt){ const X = Math.round(M.px(x, 0)[0]) + .5; c.moveTo(X, ax.Y - 4); c.lineTo(X, ax.Y + 4); if (Math.abs(ax.Y - B) > 2){ c.moveTo(X, B); c.lineTo(X, B + 4); } }
    for (const y of yt){ const Y = Math.round(M.px(0, y)[1]) + .5; c.moveTo(ax.X - 4, Y); c.lineTo(ax.X + 4, Y); if (Math.abs(ax.X - I.l) > 2){ c.moveTo(I.l - 4, Y); c.lineTo(I.l, Y); } }
    c.stroke();
    /* Einheitskreis */
    if (plot.unit){
      const O = M.px(0, 0), Px = M.px(1, 0), Py = M.px(0, 1);
      c.strokeStyle = C.c2; c.globalAlpha = 0.55; c.lineWidth = 1.4; c.setLineDash([5, 4]);
      c.beginPath(); c.ellipse(O[0], O[1], Math.abs(Px[0] - O[0]), Math.abs(Py[1] - O[1]), 0, 0, 2 * Math.PI); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
    }
    /* vorgegebene Pfeile (grau) */
    if (isArrows(spec)) for (const g of spec.given || []){ c.strokeStyle = C.muted; c.fillStyle = C.muted; c.lineWidth = 2.4; c.lineCap = 'round'; arrowPath(c, M.px(g.from[0], g.from[1]), M.px(g.to[0], g.to[1]), 11); }
    c.restore();
  }
  /* Musterskizze über der Zeichnung */
  function drawModel(c, cv){
    const M = cv.M, spec = cv.opt.spec; if (!M) return;
    let m; try { m = SKETCH.model(spec, cv.opt.W.s && cv.opt.W.s.length ? cv.opt.W.s : null, 300); } catch(e){ console.error(e); return; }
    if (!Array.isArray(m) || !m.length) return;
    const I = M.inner, col = css('--c2') || '#1f6db0';
    c.save(); c.beginPath(); c.rect(I.l - 2, I.t - 2, I.w + 4, I.h + 4); c.clip();
    c.strokeStyle = col; c.fillStyle = col; c.globalAlpha = 0.85; c.lineWidth = 3.2; c.lineCap = 'round'; c.lineJoin = 'round';
    if (m[0] && m[0].from){ for (const a of m) arrowPath(c, M.px(a.from[0], a.from[1]), M.px(a.to[0], a.to[1]), 12); }
    else {
      c.beginPath(); let pen = false;
      for (const p of m){ if (!p || !isFinite(p[0]) || !isFinite(p[1])){ pen = false; continue; } const P = M.px(p[0], p[1]); if (pen) c.lineTo(P[0], P[1]); else { c.moveTo(P[0], P[1]); pen = true; } }
      c.stroke();
    }
    c.restore();
    cv.modelArrows = m[0] && m[0].from ? m : null;
  }
  /* Beschriftungen als HTML (KaTeX) über der Fläche */
  const texLab = s => /\$/.test(String(s)) ? inl(String(s)) : texHTML(String(s));
  const txtLab = s => { s = String(s); return /\$/.test(s) ? inl(s) : /[\\^_{}]/.test(s) ? texHTML(s) : escH(s); };
  const fmtN = v => String(Math.round(v * 1000) / 1000).replace('-', '−').replace('.', ',');
  /* Pfeilbeschriftungen ohne Überlappung, auch bei gemeinsamer Spitze oder gemeinsamem Anfang (z. B. v und v − P_av):
     je Beschriftung Kandidatenlagen hinter der Spitze, schräg und seitlich daneben, an der Schaftmitte und weiter draußen.
     Gewählt wird die Lage mit der kleinsten Strafe: Überdeckung mit schon gesetzten Beschriftungen (Achsen, Ticks, frühere
     Pfeile), Kreuzung eines Pfeils, Achsenlinie, Lage außerhalb der Fläche; bei Gleichstand die frühere, natürlichere Lage.
     Vorgegebene Pfeile weichen nur einander aus (sie springen nicht, wenn das Muster eingeblendet wird);
     Musterpfeile weichen allem aus. */
  const ANCH = {n:[-.5, 0], s:[-.5, -1], e:[-1, -.5], w:[0, -.5], ne:[-1, 0], nw:[0, 0], se:[-1, -1], sw:[0, -1], c:[-.5, -.5]};
  function segHitsBox(P, Q, b){   /* Liang–Barsky: schneidet die Strecke PQ das Rechteck b? */
    let t0 = 0, t1 = 1; const dx = Q[0] - P[0], dy = Q[1] - P[1];
    const clip = (p, q) => { if (Math.abs(p) < 1e-12) return q >= 0; const r = q / p; if (p < 0){ if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; } return true; };
    return clip(-dx, P[0] - b.l) && clip(dx, b.r - P[0]) && clip(-dy, P[1] - b.t) && clip(dy, b.b - P[1]);
  }
  function placeArrowLabels(el, L, segs, W, H, soft){
    const S = [...el.children];
    const over = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
    const placed = [];
    L.forEach((o, i) => { if (o.arrow || !S[i]) return; const w = S[i].offsetWidth, h = S[i].offsetHeight, a = ANCH[o.anchor] || ANCH.c; placed.push({l:o.x + a[0] * w, r:o.x + (a[0] + 1) * w, t:o.y + a[1] * h, b:o.y + (a[1] + 1) * h}); });
    L.forEach((o, i) => {
      if (!o.arrow || !S[i]) return;
      const w = S[i].offsetWidth, h = S[i].offsetHeight, A = o.arrow[0], B = o.arrow[1];
      const dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy) || 1, u = [dx / len, dy / len], n = [-u[1], u[0]], m = [-n[0], -n[1]];
      /* Mittelpunkt im Abstand gap (Rand der Beschriftung) von P in Richtung d */
      const at = (P, d, gap) => { const q = Math.hypot(d[0], d[1]) || 1, e = (Math.abs(d[0]) * w / 2 + Math.abs(d[1]) * h / 2) / q + gap; return [P[0] + d[0] / q * e, P[1] + d[1] / q * e]; };
      const back = k => [B[0] - u[0] * k, B[1] - u[1] * k];
      const C = [at(B, u, 5), at(B, [u[0] + n[0], u[1] + n[1]], 5), at(B, [u[0] + m[0], u[1] + m[1]], 5), at(back(8), n, 7), at(back(8), m, 7),
        at(back(0.45 * len), n, 6), at(back(0.45 * len), m, 6), at(B, u, 9 + h), at(back(0.25 * len), n, 7), at(back(0.25 * len), m, 7)];
      const obst = o.cls === 'gv' ? segs.filter(s => s.cls === 'gv') : segs;
      let best = null;
      C.forEach((c, k) => {
        const b = {l:c[0] - w / 2, r:c[0] + w / 2, t:c[1] - h / 2, b:c[1] + h / 2}, bi = {l:b.l - 2, r:b.r + 2, t:b.t - 2, b:b.b + 2}, bl = {l:b.l - 5, r:b.r + 5, t:b.t - 3, b:b.b + 3};
        let pen = 0.5 * k;
        for (const q of placed) pen += 10 * over(bl, q);   /* Abstand zu anderen Beschriftungen ≥ 5 px waagerecht, 3 px senkrecht */
        for (const s of obst) if (segHitsBox(s.P, s.Q, bi)) pen += 300;
        for (const s of soft || []) if (segHitsBox(s.P, s.Q, b)) pen += 20;
        pen += 10 * (w * h - over(b, {l:0, r:W, t:0, b:H}));
        if (!best || pen < best.pen) best = {pen, c, b};
      });
      placed.push(best.b);
      S[i].style.left = best.c[0].toFixed(1) + 'px'; S[i].style.top = best.c[1].toFixed(1) + 'px';
    });
  }
  function layoutLabels(cv, el, modelOn){
    const M = cv.M; if (!M) { el.innerHTML = ''; return; }
    const spec = cv.opt.spec, plot = cv.opt.plot, I = M.inner, R = I.l + I.w, B = I.t + I.h, ax = axesPos(M, plot);
    const L = [];
    const put = (html, x, y, anchor, cls) => L.push({html, x, y, anchor, cls});
    if (plot.xlab) put(texLab(plot.xlab), R - (Array.isArray(plot.walls) ? 9 : 3), ax.Y - 5, 'se', 'ax');
    if (plot.ylab) put(texLab(plot.ylab), ax.X + 7, I.t + 2, 'nw', 'ax');
    const xt = plot.ticks && plot.ticks.length ? plot.ticks.map(t => [t.x, texLab(t.lab != null ? t.lab : fmtN(t.x))]) : isArrows(spec) && plot.grid > 0 ? gridVals(plot.x[0], plot.x[1], plot.grid).filter(v => Math.abs(v) > 1e-9).map(v => [v, escH(fmtN(v))]) : [];
    const yt = plot.yticks && plot.yticks.length ? plot.yticks.map(t => [t.y, texLab(t.lab != null ? t.lab : fmtN(t.y))]) : isArrows(spec) && plot.grid > 0 ? gridVals(plot.y[0], plot.y[1], plot.grid).filter(v => Math.abs(v) > 1e-9).map(v => [v, escH(fmtN(v))]) : [];
    const thin = (arr, span) => arr.length > 1 && span / arr.length < 26 ? arr.filter((_, i) => i % 2 === 0) : arr;
    for (const [x, hh] of thin(xt, I.w)) put(hh, M.px(x, 0)[0], B + 5, 'n', 'tk');
    for (const [y, hh] of thin(yt, I.h)) put(hh, I.l - 6, M.px(0, y)[1], 'e', 'tk');
    for (const rg of plot.regions || []) if (rg && rg.lab && Array.isArray(rg.x)){ const a = clamp(M.px(rg.x[0], 0)[0], I.l, R), b = clamp(M.px(rg.x[1], 0)[0], I.l, R); put(txtLab(rg.lab), (a + b) / 2, I.t + 3, 'n', 'rg'); }
    if (cv.eY != null && plot.E != null) put(texHTML('E'), R - 4, cv.eY - 3, 'se', 'en');
    /* Pfeile in Bildschirmkoordinaten: vorgegebene und (bei eingeblendetem Muster) Musterpfeile in der Orientierung,
       die SKETCH.model zur Zeichnung wählt (axis:true: wie der Nutzerpfeil) */
    const segs = [];
    const tipLab = (a, cls) => { const A = M.px(a.from[0], a.from[1]), Bp = M.px(a.to[0], a.to[1]); segs.push({P:A, Q:Bp, cls}); if (!a.lab) return; const dx = Bp[0] - A[0], dy = Bp[1] - A[1], l = Math.hypot(dx, dy) || 1; put(texLab(a.lab), Bp[0] + dx / l * 13, Bp[1] + dy / l * 13, 'c', cls); L[L.length - 1].arrow = [A, Bp]; };
    if (isArrows(spec)) for (const g of spec.given || []) tipLab(g, 'gv');
    if (modelOn && isArrows(spec)){
      let mA = null; try { mA = SKETCH.model(spec, cv.opt.W.s && cv.opt.W.s.length ? cv.opt.W.s : null); } catch(e){ console.error(e); }
      for (const w of Array.isArray(mA) && mA.length && mA[0].from ? mA : spec.want || []) tipLab(w, 'ml');
    }
    const TR = {n:'-50%,0', s:'-50%,-100%', e:'-100%,-50%', w:'0,-50%', ne:'-100%,0', nw:'0,0', se:'-100%,-100%', sw:'0,-100%', c:'-50%,-50%'};
    el.innerHTML = L.map(o => '<span class="' + o.cls + '" style="left:' + o.x.toFixed(1) + 'px;top:' + o.y.toFixed(1) + 'px;transform:translate(' + TR[o.anchor] + ')">' + o.html + '</span>').join('');
    if (!el.isConnected) return;
    if (segs.length) placeArrowLabels(el, L, segs, cv.w, cv.h, [{P:[I.l, ax.Y], Q:[R, ax.Y]}, {P:[ax.X, I.t], Q:[ax.X, B]}]);
    /* Überlappung: Bereichs- und Energiebeschriftungen weichen nach unten aus (Achsen und Ticks bleiben) */
    const S = [...el.children], R0 = S.map(x => x.getBoundingClientRect());
    const hit = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
    S.forEach((sp, i) => {
      if (!/\b(rg|en)\b/.test(sp.className)) return;
      for (let k = 0; k < 4 && R0.some((r, j) => j !== i && (j < i || !/\b(rg|en)\b/.test(S[j].className)) && hit(R0[i], r)); k++){
        const d = R0[i].height + 3;
        sp.style.top = (parseFloat(sp.style.top) + d) + 'px';
        R0[i] = {left:R0[i].left, right:R0[i].right, top:R0[i].top + d, bottom:R0[i].bottom + d, height:R0[i].height};
      }
    });
  }

  /* ---------- Werkzeugleiste (Stift, Radierer, Rückgängig, Leeren mit zweistufiger Bestätigung) ---------- */
  function toolbar(getInk, wrapEl, extra){
    const bar = h('div', {class:'sk-tools', role:'toolbar', 'aria-label':'Werkzeuge'});
    const seg = h('span', {class:'sk-seg', role:'group', 'aria-label':'Stift oder Radierer'});
    const bPen = h('button', {type:'button', class:'btn btn-sm', 'data-sk':'pen', 'aria-pressed':'true', title:'Stift: zeichnen', 'aria-label':'Stift'}, '✎', h('span', {class:'lbl'}, 'Stift'));
    const bEr = h('button', {type:'button', class:'btn btn-sm sk-er', 'data-sk':'eraser', 'aria-pressed':'false', title:'Radierer: ganze Striche wegwischen. Das Radiererende des Stifts radiert immer.', 'aria-label':'Radierer'}, '⌫', h('span', {class:'lbl'}, 'Radierer'));
    seg.append(bPen, bEr);
    const bUndo = h('button', {type:'button', class:'btn btn-sm', 'data-sk':'undo', title:'Letzten Strich entfernen (nach „Leeren“: alles zurückholen)', 'aria-label':'Rückgängig'}, '↶', h('span', {class:'lbl'}, 'Rückgängig'));
    const bClr = h('button', {type:'button', class:'btn btn-sm', 'data-sk':'clear', title:'Alle Striche löschen', 'aria-label':'Leeren'}, '✕', h('span', {class:'lbl'}, 'Leeren'));
    bar.append(seg, bUndo, bClr);
    if (extra) for (const x of extra) bar.append(x);
    const setEr = on => { const ink = getInk(); if (ink) ink.eraser = on; bPen.setAttribute('aria-pressed', String(!on)); bEr.setAttribute('aria-pressed', String(on)); wrapEl.classList.toggle('erasing', on); };
    let tm = 0;
    const resetClr = () => { clearTimeout(tm); delete bClr.dataset.sure; bClr.classList.remove('sure'); bClr.setAttribute('aria-label', 'Leeren'); bClr.lastChild.textContent = 'Leeren'; };
    bPen.onclick = () => setEr(false);
    bEr.onclick = () => setEr(!(getInk() && getInk().eraser));
    bUndo.onclick = () => { resetClr(); const ink = getInk(); if (ink) ink.undo(); };
    bClr.onclick = () => {
      const ink = getInk(); if (!ink) return;
      if (!bClr.dataset.sure){
        if (!ink.strokes.length) return;
        bClr.dataset.sure = '1'; bClr.classList.add('sure'); bClr.setAttribute('aria-label', 'Wirklich leeren? Noch einmal tippen'); bClr.lastChild.textContent = 'Wirklich leeren?';
        tm = setTimeout(resetClr, 4000); return;
      }
      resetClr(); ink.clear(true);
    };
    bar.setEraser = setEr;
    return bar;
  }

  /* ---------- Rückmeldung ---------- */
  const NAMES = {nodes:'Knotenzahl', zero:'Nullstellen', parity:'Symmetrie', decay:'Abklingen', noosc:'kein Schwingen', osc:'Schwingen', wavelength:'Wellenlänge',
    amp:'Amplitude', nonneg:'nicht negativ', sign:'Vorzeichen', extrema:'Buckel', maxat:'Lage des Maximums', center:'Schwerpunkt', fwhm:'Breite', smooth:'glatter Übergang',
    kink:'Knick', cont:'stetig', level:'Höhe', area:'Fläche', cover:'ganzer Bereich'};
  function resName(spec, r, i){
    if (r.label) return inl(String(r.label));
    if (r.name) return escH(r.name);
    if (isArrows(spec)){ const k = r.i != null ? r.i : r.idx != null ? r.idx : /^\D*(\d+)$/.test(String(r.id)) ? +String(r.id).replace(/\D/g, '') : i; const w = (spec.want || [])[k]; return 'Pfeil' + (w && w.lab ? ' ' + texLab(w.lab) : ' ' + (k + 1)); }
    const c = (spec.checks || []).find(x => x.id === r.id);
    return escH((c && c.name) || NAMES[r.type] || NAMES[c && c.type] || r.id || 'Merkmal');
  }
  function resMsg(spec, r){
    if (r.msg) return String(r.msg);
    const c = (spec.checks || []).find(x => x.id === r.id);
    const w = isArrows(spec) ? (spec.want || [])[r.i != null ? r.i : -1] : null;
    const m = (c && c.msg) || (w && w.msg) || '';
    return m.replace(/\{got\}/g, r.got != null ? r.got : '?').replace(/\{want\}/g, r.want != null ? r.want : '?');
  }
  function firstMsg(spec, ev){
    if (!ev) return '';
    if (ev.empty) return 'Nicht gezeichnet.';
    const f = (ev.first && ev.first[0]) || (ev.results || []).find(r => !r.ok && !r.skipped);
    return f ? resMsg(spec, f) : '';
  }
  function extraCount(ev){ if (!ev || !Array.isArray(ev.arrows)) return 0; const m = (ev.match || []).filter(i => i != null && i >= 0).length; return Math.max(0, ev.arrows.length - m); }
  /* all = true: alle nicht erfüllten Merkmale mit Rückfrage (Auswertung nach dem Abgeben bzw. Auflösen) */
  function fbHTML(spec, ev, all){
    if (!ev) return '';
    const li = (cls, ic, body) => '<li class="' + cls + '"><span class="i" aria-hidden="true">' + ic + '</span><span>' + body + '</span></li>';
    /* leer, zu wenig überdeckt, zu flach: nur diese eine Rückfrage (die Merkmale sind dann nicht geprüft) */
    const gate = !ev.ok && ev.first && ev.first[0] && ev.first[0].type === 'cover';
    if (ev.empty || gate) return li('ask', '?', ev.first && ev.first[0] && ev.first[0].msg ? inl(String(ev.first[0].msg)) : 'Die Fläche ist noch leer. Zeichne zuerst deine Skizze.');
    const R = (ev.results || []).filter(r => !r.skipped), bad = R.filter(r => !r.ok);
    const first = (ev.first && ev.first.length ? ev.first : bad.slice(0, 2));
    const asked = new Set(first.map(r => r.id));
    let html = '';
    if (ev.ok) html += li('all', '✓', '<b>Alle Merkmale stimmen.</b> ' + (all ? '' : 'Vergleiche trotzdem mit der Musterskizze.'));
    if (!R.length && first.length) html += first.map(r => li('ask', '?', inl(resMsg(spec, r)))).join('');
    R.forEach((r, i) => {
      if (r.ok) html += li('ok', '✓', resName(spec, r, i));
      else if (all || asked.has(r.id)) html += li('ask', '?', inl(resMsg(spec, r)));
    });
    const rest = all ? 0 : bad.filter(r => !asked.has(r.id)).length;
    if (rest) html += li('more', '…', rest === 1 ? 'Ein weiteres Merkmal passt noch nicht. Erst die Fragen oben.' : rest + ' weitere Merkmale passen noch nicht. Erst die Fragen oben.');
    const ex = ev.extra ? (typeof ev.extra === 'string' ? ev.extra : spec.extra) : extraCount(ev) && spec.extra ? spec.extra : '';
    if (ex) html += li('info', 'i', inl(ex));
    return html;
  }
  function evaluate(spec, strokes){
    try { return SKETCH.evaluate(spec, strokes || []); }
    catch(e){ console.error(e); return null; }
  }
  /* Punkte im Abschluss: points × gewichteter Anteil erfüllter Merkmale, gerundet; gelöst nur, wenn alles erfüllt
     (nicht gelöst höchstens points − 1, wie bei den Rechenaufgaben) */
  function score(spec, ctx){
    const P = spec.points || 3;
    const E = SK.get(spec.id + (ctx || ''));
    if (!ready()) return {ok:false, pts:0, max:P, ev:null};
    const ev = evaluate(spec, E && E.s || []);
    if (!ev || ev.empty) return {ok:false, pts:0, max:P, ev};
    const sc = Math.max(0, Math.min(1, +ev.score || 0));
    return {ok:!!ev.ok, pts:ev.ok ? P : Math.min(P - 1, Math.round(P * sc)), max:P, ev};
  }
  const hasInk = (spec, ctx) => { const E = SK.get(spec.id + (ctx || '')); return !!(E && E.s && E.s.length); };
  /* nicht gelöste Skizze im Fehlerheft als gelöst markieren */
  function errSolved(id){ let ch = false; for (const x of store.data.errbook) if (x.k === 'sketch' && x.ref === id && !x.solved){ x.solved = true; ch = true; } if (ch) store.save(); }

  /* ---------- Skizzenaufgabe ----------
     o.mode: 'practice' (Prüfen, Rückfragen, Hinweise, Muster) | 'predict' (Labor: festhalten, später auflösen)
             'exam' (Abschluss: nur zeichnen) | 'review' (nach dem Abgeben: Auswertung, Muster)
     o.ctx (Speicher-Kontext), o.topic, o.label, o.held/o.skipped (predict), o.onHold, o.onSkip, o.onSolved, o.onChange */
  let UID = 0;
  function sketchBox(spec, o){
    o = o || {};
    const mode = o.mode || 'practice', key = spec.id + (o.ctx || ''), T = o.topic || topicOf(spec.id);
    const box = h('div', {class:'sketch sk-' + mode, 'data-sketch':spec.id});
    if (mode === 'practice' && !o.ctx) box.dataset.task = 's:' + spec.id;
    const label = o.label || (mode === 'predict' ? 'Vorhersage als Skizze' : 'Skizze');
    box.innerHTML = '<div class="qh">' + escH(label) + '</div>' + (spec.title ? '<h3>' + inl(spec.title) + '</h3>' : '') + (spec.text ? '<div class="stack sk-text">' + md(spec.text) + '</div>' : '');
    if (!ready() || typeof INKUI === 'undefined'){ box.append(h('p', {class:'small muted'}, 'Die Skizzenauswertung ist in dieser Fassung noch nicht enthalten.')); return box; }
    const plot = plotOf(spec);
    const E = Object.assign({s:[]}, SK.get(key) || {});
    const W = {s:Array.isArray(E.s) ? E.s : []};
    const save = () => { E.s = W.s; SK.put(key, E); };
    let modelOn = false, frozen = mode === 'review' || (mode === 'predict' && (o.held || o.skipped)), ev = null;
    const uid = 'sk' + (++UID);
    const wrap = h('div', {class:'sk-wrap'});
    const mw = maxWidthFor(spec, plot); if (mw) wrap.style.maxWidth = mw + 'px';
    const cvEl = h('canvas', {class:'sk-cv', 'aria-label':'Zeichenfläche für deine Skizze' + (spec.title ? ': ' + plainT(spec.title) : '') + '. Zeichne mit Stift, Maus oder Finger.'});
    const labEl = h('div', {class:'sk-lab', 'aria-hidden':'true'});
    wrap.append(cvEl, labEl);
    const legend = h('div', {class:'sk-legend', hidden:true}, h('span', {class:'lg lg-m'}, 'Muster'), h('span', {class:'lg lg-o'}, 'deine Skizze'));
    const tools = toolbar(() => ink, wrap);
    const act = h('div', {class:'row sk-act'});
    const note = h('p', {class:'small muted sk-note', 'aria-live':'polite'});
    const fb = h('ul', {class:'sk-fb', 'aria-live':'polite', 'aria-label':'Rückmeldung zur Skizze'});
    const hints = h('div', {class:'sk-hints'});
    const rev = h('div', {class:'sk-rev'});
    const guide = h('p', {class:'small muted sk-guide'}, spec.kind === 'arrows' ? 'Zeichne jeden Pfeil in einem Zug vom Anfang zur Spitze, ohne Beschriftung.' : 'Zeichne nur die Kurve, ohne Beschriftung. Zum Verbessern einfach darüberzeichnen: Der letzte Strich zählt.');
    box.append(tools, wrap, guide, legend, act, note, fb, hints, rev);
    let skipped = !!o.skipped;
    const ink = new SketchCanvas(cvEl, {lw:2.4, spec, plot, W, finger:fingerOK, onTouchIgnored:touchIgnored,
      over:(c, cv) => { if (modelOn) drawModel(c, cv); },
      onFit:cv => layoutLabels(cv, labEl, modelOn),
      onChange:() => { ink.sync(); save(); if (mode === 'practice' && fb.innerHTML) fb.classList.add('stale'); if (o.onChange) o.onChange(W.s.length > 0); ink.redraw(); if (modelOn && isArrows(spec)) layoutLabels(ink, labEl, modelOn); }});
    ink.redraw();
    const setFrozen = on => { frozen = on; ink.frozen = on; tools.hidden = on; guide.hidden = on; wrap.classList.toggle('frozen', on); if (on) tools.setEraser(false); };
    setFrozen(frozen);
    const showModel = on => {
      modelOn = on; legend.hidden = !on;
      if (bModel){ bModel.textContent = on ? 'Musterskizze ausblenden' : 'Musterskizze zeigen'; bModel.setAttribute('aria-pressed', String(on)); }
      rev.innerHTML = on && spec.reveal ? '<div class="box box-key"><h4>Musterskizze</h4>' + md(spec.reveal) + '</div>' : '';
      ink.redraw(); layoutLabels(ink, labEl, modelOn);
    };
    const showFb = (e, all) => { ev = e; fb.classList.remove('stale'); fb.innerHTML = fbHTML(spec, e, all); };
    let bModel = null;
    if (mode === 'practice'){
      const bCheck = h('button', {type:'button', class:'btn btn-sm btn-primary', 'data-sk':'check'}, 'Prüfen');
      bModel = h('button', {type:'button', class:'btn btn-sm', 'data-sk':'model', 'aria-pressed':'false', hidden:!E.n}, 'Musterskizze zeigen');
      const H = Array.isArray(spec.hints) ? spec.hints : [];
      const bHint = h('button', {type:'button', class:'btn btn-sm', 'data-sk':'hint', hidden:!H.length}, 'Hinweis');
      act.append(bCheck, bHint, bModel);
      const drawHints = () => {
        hints.innerHTML = H.slice(0, E.h || 0).map((x, i) => '<div class="hintbox"><b>Hinweis ' + (i + 1) + ' von ' + H.length + ':</b> ' + inl(x) + '</div>').join('');
        bHint.textContent = (E.h || 0) >= H.length ? 'Hinweis' : (E.h || 0) ? 'Weiterer Hinweis' : 'Hinweis';
      };
      drawHints();
      bHint.onclick = () => {
        const k = E.h || 0;
        if (k >= H.length){ toast(E.n ? 'Keine weiteren Hinweise. Vergleiche mit der Musterskizze.' : 'Keine weiteren Hinweise. Prüf deine Skizze, dann gibt es die Musterskizze.'); return; }
        /* letzte Stufe erst, wenn seit dem vorigen Hinweis geprüft wurde (wie bei den Rechenaufgaben) */
        if (k >= 1 && k === H.length - 1 && (E.n || 0) <= (E.nh || 0)){
          if (!hints.querySelector('.hint-wait')) hints.append(h('div', {class:'hintbox hint-wait', html:'<b>Erst du:</b> Verbessere deine Skizze nach dem letzten Hinweis und prüfe sie. Dann gibt es die letzte Stufe.'}));
          return;
        }
        E.h = k + 1; E.nh = E.n || 0; save(); drawHints();
      };
      bCheck.onclick = () => {
        const e = evaluate(spec, W.s);
        if (!e){ note.textContent = 'Die Skizze konnte nicht ausgewertet werden.'; return; }
        note.textContent = '';
        showFb(e, false);
        if (e.empty){ return; }
        E.n = (E.n || 0) + 1; E.ok = !!e.ok;
        /* Fehlerheft: nicht gelöst beim ersten Prüfen */
        if (!E.bk && o.book !== false){
          E.bk = 1;
          if (!e.ok) store.errAdd({k:'sketch', t:T ? T.id : '', ref:spec.id, text:spec.title || 'Skizze', msg:firstMsg(spec, e)});
        }
        save();
        bModel.hidden = false;
        if (e.ok){ errSolved(spec.id); if (o.onSolved) o.onSolved(); }
        if (o.onCheck) o.onCheck(e);
      };
      bModel.onclick = () => showModel(!modelOn);
    } else if (mode === 'predict'){
      const bHold = h('button', {type:'button', class:'btn btn-sm btn-primary', 'data-sk':'hold'}, 'Vorhersage festhalten');
      const bSkip = h('button', {type:'button', class:'btn btn-sm btn-ghost', 'data-sk':'skip'}, 'Überspringen (ohne Zeichnen)');
      act.append(bHold, bSkip);
      const done = how => { act.hidden = true; setFrozen(true); skipped = how === 'skip'; note.textContent = how === 'skip' ? 'Ohne Skizze weiter. Beim Auflösen siehst du die Musterskizze.' : 'Festgehalten. Jetzt das Labor: Vergleiche dort mit deiner Skizze.'; };
      bHold.onclick = () => { if (!W.s.length){ note.textContent = 'Zeichne zuerst deine Vorhersage – oder überspring sie bewusst.'; return; } done('held'); if (o.onHold) o.onHold(); };
      bSkip.onclick = () => { done('skip'); if (o.onSkip) o.onSkip(); };
      if (o.held || o.skipped) done(o.held ? 'held' : 'skip');
      bModel = null;
    } else if (mode === 'exam'){
      note.textContent = 'Wird erst nach dem Abgeben ausgewertet.';
    } else if (mode === 'review'){
      bModel = h('button', {type:'button', class:'btn btn-sm', 'data-sk':'model', 'aria-pressed':'false'}, 'Musterskizze zeigen');
      act.append(bModel);
      bModel.onclick = () => showModel(!modelOn);
      if (W.s.length) showFb(evaluate(spec, W.s), true); else note.textContent = 'Nicht gezeichnet.';
      showModel(true);
    }
    /* Auflösen der Vorhersage (Labor) */
    box.reveal = () => {
      if (box.dataset.revealed) return; box.dataset.revealed = '1';
      setFrozen(true); act.hidden = true;
      if (W.s.length && !skipped){ const e = evaluate(spec, W.s); if (e) showFb(e, true); }
      note.textContent = W.s.length && !skipped ? 'Deine Vorhersage im Vergleich mit der Musterskizze:' : 'Die Musterskizze:';
      if (!bModel){ bModel = h('button', {type:'button', class:'btn btn-sm', 'data-sk':'model', 'aria-pressed':'false'}, 'Musterskizze zeigen'); bModel.onclick = () => showModel(!modelOn); act.innerHTML = ''; act.append(bModel); act.hidden = false; }
      showModel(true);
    };
    box.strokes = () => W.s;
    box.result = () => ev;
    box.ink = ink;
    box.setStrokes = ws => { ink.setWorld(ws); save(); if (modelOn && isArrows(spec)) layoutLabels(ink, labEl, modelOn); if (o.onChange) o.onChange(W.s.length > 0); };
    box.id = uid;
    return box;
  }

  /* ---------- Schmierzettel je Aufgabe ---------- */
  const SCR_H0 = 280, SCR_STEP = 200, SCR_HMAX = 1400;
  function gridBg(c, w, hh){
    c.save(); c.strokeStyle = css('--grid') || '#e5e8f1'; c.lineWidth = 1; c.beginPath();
    for (let x = 20; x < w; x += 20){ c.moveTo(Math.round(x) + .5, 0); c.lineTo(Math.round(x) + .5, hh); }
    for (let y = 20; y < hh; y += 20){ c.moveTo(0, Math.round(y) + .5); c.lineTo(w, Math.round(y) + .5); }
    c.stroke(); c.restore();
  }
  function scratchBox(task, slot){
    const key = (task && task.id || 'x') + (slot || '');
    let E = SCR.get(key);
    const wrap = h('div', {class:'scr'});
    const pid = 'scr' + (++UID);
    const used = () => !!(E && E.s && E.s.length);
    const tog = h('button', {type:'button', class:'btn btn-sm btn-ghost scr-tog', 'aria-expanded':'false', 'aria-controls':pid, title:'Freie Fläche für Nebenrechnungen und Skizzen. Wird nicht ausgewertet.'}, '✎ Schmierzettel');
    const badge = h('span', {class:'scr-used small muted', hidden:!used()}, 'beschrieben');
    const panel = h('div', {class:'scr-p', id:pid, hidden:true, role:'region', 'aria-label':'Schmierzettel'});
    wrap.append(h('div', {class:'row scr-head'}, tog, badge), panel);
    let ink = null;
    const toE = () => { if (!E) E = {s:[], h:SCR_H0, g:!!SCR.meta().g}; return E; };
    const save = () => {
      const e = toE();
      e.s = ink ? ink.strokes.map(s => { const a = []; for (const p of s) a.push(Math.round(p.x), Math.round(p.y)); return a; }) : e.s;
      if (!SCR.put(key, e)) toast('Der Speicher im Browser ist voll. Der Schmierzettel bleibt nur bis zum Neuladen.');
      badge.hidden = !used();
    };
    function build(){
      const e = toE();
      const cvWrap = h('div', {class:'scr-cw'});
      const cvEl = h('canvas', {class:'scr-cv', 'aria-label':'Schmierzettel: freie Fläche für Nebenrechnungen. Wird nicht ausgewertet.'});
      cvEl.style.height = clamp(e.h || SCR_H0, SCR_H0, SCR_HMAX) + 'px';
      cvWrap.append(cvEl);
      const bGrid = h('button', {type:'button', class:'btn btn-sm', 'data-sk':'grid', 'aria-pressed':String(!!e.g), title:'Kästchen ein- oder ausblenden', 'aria-label':'Kästchen'}, '#', h('span', {class:'lbl'}, 'Kästchen'));
      const bMore = h('button', {type:'button', class:'btn btn-sm', 'data-sk':'more', title:'Fläche um 200 px verlängern', 'aria-label':'Mehr Platz'}, '↧', h('span', {class:'lbl'}, 'Mehr Platz'));
      const tools = toolbar(() => ink, cvWrap, [h('span', {class:'grow'}), bGrid, bMore]);
      const updMore = () => { bMore.disabled = (e.h || SCR_H0) >= SCR_HMAX; };
      updMore();
      panel.append(tools, cvWrap, h('p', {class:'small muted scr-note'}, 'Nur für dich: wird nicht ausgewertet und nicht gesendet.'));
      ink = new INKUI.InkCanvas(cvEl, {lw:2.2, finger:fingerOK, onTouchIgnored:touchIgnored, bg:(c, w, hh) => { if (e.g) gridBg(c, w, hh); }, onChange:save});
      ink.strokes = (e.s || []).map(a => { const s = []; for (let i = 0; i + 1 < a.length; i += 2) s.push({x:a[i], y:a[i + 1], t:0, p:.5}); return s; });
      const showAll = () => {
        /* breiter beschrieben als die Fläche jetzt ist (anderes Gerät): gleichmäßig verkleinert anzeigen */
        ink.fit(); if (!ink.w) return;
        let x1 = 1, y1 = 1; for (const s of ink.strokes) for (const p of s){ if (p.x > x1) x1 = p.x; if (p.y > y1) y1 = p.y; }
        const k = Math.min(1, (ink.w - 4) / x1, (ink.h - 4) / y1);
        if (k < 0.999 && k > 0) for (const s of ink.strokes) for (const p of s){ p.x *= k; p.y *= k; }
        ink.redraw();
      };
      requestAnimationFrame(showAll);
      bGrid.onclick = () => { e.g = !e.g; SCR.meta().g = e.g; bGrid.setAttribute('aria-pressed', String(e.g)); ink.redraw(); save(); };
      bMore.onclick = () => { e.h = Math.min(SCR_HMAX, (e.h || SCR_H0) + SCR_STEP); cvEl.style.height = e.h + 'px'; updMore(); save(); };
    }
    const setOpen = (on, keep) => {
      panel.hidden = !on; tog.setAttribute('aria-expanded', String(on)); tog.classList.toggle('on', on);
      if (on && !ink) build();
      if (on && ink) requestAnimationFrame(() => ink.fit());
      if (!keep && (E || on)){ toE().o = on; SCR.put(key, E); }
    };
    tog.onclick = () => setOpen(panel.hidden, false);
    if (E && E.o) setOpen(true, true);
    return wrap;
  }

  /* ---------- Statischer Graph (Darstellungstafel k:'graph', Schritt-Feld plot; didaktik/UMBAU2.md, Abschnitt 2) ----------
     g wie SKETCH.graph: {plot, f, f2?, lab?, lab2?, cap?}. Rahmen und Beschriftungen wie bei Skizzen (drawFrame, layoutLabels),
     f durchgezogen (--c2), f2 gestrichelt (--c1). Keine Eingabe: Wischen über den Graphen scrollt die Seite. */
  const STATIC = new Set();
  function staticGraph(g, o){
    o = o || {};
    const fig = h('figure', {class:'sk-static' + (o.cls ? ' ' + o.cls : '')});
    if (!ready() || typeof SKETCH.graph !== 'function'){ fig.append(h('p', {class:'small muted'}, 'Der Graph lässt sich in dieser Fassung nicht zeichnen.')); return fig; }
    const G = SKETCH.graph(g || {});
    const plot = G.plot, spec = {kind:'curve', draw:'f', plot};
    const tx = s => plainT('$' + String(s || '') + '$');
    const alt = 'Graph' + (plot.ylab ? ' von ' + tx(plot.ylab) : '') + (plot.xlab ? ' über ' + tx(plot.xlab) : '') + (G.curves.length > 1 ? ', zwei Kurven' : '') + (g && g.cap ? ': ' + plainT(g.cap) : '');
    const wrap = h('div', {class:'sk-wrap sk-static-w'});
    const cvEl = h('canvas', {class:'sk-cv sk-static-cv', role:'img', 'aria-label':alt});
    const labEl = h('div', {class:'sk-lab', 'aria-hidden':'true'});
    wrap.append(cvEl, labEl); fig.append(wrap);
    if (G.curves.length > 1 || G.curves.some(c => c.lab)){
      const lg = h('div', {class:'sk-legend sk-static-lg'});
      for (const c of G.curves) lg.append(h('span', {class:'lg ' + (c.key === 'f' ? 'lg-m' : 'lg-2'), html:c.lab ? txtLab(c.lab) : c.key === 'f' ? 'erste Kurve' : 'zweite Kurve'}));
      fig.append(lg);
    }
    if (g && g.cap) fig.append(h('figcaption', {class:'small muted', html:inl(g.cap)}));
    const cv = {opt:{spec, plot}, M:null, w:0, h:0, eY:null};
    let lastW = -1, lastH = -1;
    const draw = force => {
      const W = wrap.clientWidth; if (!W) return;
      const H = Math.max(o.minH || 170, Math.min(o.maxH || 300, Math.round(W / 2)));
      if (!force && Math.abs(W - lastW) < 1 && H === lastH) return;
      lastW = W; lastH = H;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      cvEl.style.height = H + 'px';
      cvEl.width = Math.round(W * dpr); cvEl.height = Math.round(H * dpr);
      const c = cvEl.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, W, H); c.fillStyle = css('--sheet') || '#fff'; c.fillRect(0, 0, W, H);
      cv.w = W; cv.h = H; cv.eY = null; cv.M = SKETCH.map(spec, W, H);
      drawFrame(c, cv);
      const M = cv.M, I = M.inner;
      c.save(); c.beginPath(); c.rect(I.l - 1, I.t - 1, I.w + 2, I.h + 2); c.clip();
      c.lineCap = 'round'; c.lineJoin = 'round';
      for (const cu of G.curves){
        c.strokeStyle = cu.key === 'f' ? (css('--c2') || '#1f6db0') : (css('--c1') || '#cf2f4c');
        c.lineWidth = cu.key === 'f' ? 2.6 : 2.2; c.setLineDash(cu.key === 'f' ? [] : [7, 5]);
        c.beginPath(); let pen = false;
        for (const p of cu.pts){ if (!isFinite(p[1])){ pen = false; continue; } const P = M.px(p[0], Math.max(plot.y[0] - plot.y[1], Math.min(2 * plot.y[1] - plot.y[0], p[1]))); if (pen) c.lineTo(P[0], P[1]); else { c.moveTo(P[0], P[1]); pen = true; } }
        c.stroke();
      }
      c.setLineDash([]); c.restore();
      layoutLabels(cv, labEl, false);
    };
    fig.redraw = () => draw(true);
    try { const ro = new ResizeObserver(() => { if (!fig.isConnected){ return; } draw(false); }); ro.observe(wrap); fig.__ro = ro; } catch(e){}
    STATIC.add(fig);
    requestAnimationFrame(() => draw(false));
    return fig;
  }
  /* hell/dunkel umgeschaltet: statische Graphen neu zeichnen (Farben kommen aus den CSS-Variablen) */
  const redrawStatic = () => { for (const f of [...STATIC]){ if (!f.isConnected){ if (f.__ro) f.__ro.disconnect(); STATIC.delete(f); continue; } f.redraw(); } };
  try { new MutationObserver(redrawStatic).observe(document.documentElement, {attributes:true, attributeFilter:['data-theme', 'data-size']}); } catch(e){}
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redrawStatic); } catch(e){}

  /* ---------- Verwaltung ---------- */
  function dropCtx(suf){ SK.dropSuffix(suf); SCR.dropSuffix(suf); }
  function resetAll(){ SK.reset(); SCR.reset(); }
  return {ready, sketchBox, scratchBox, staticGraph, redrawStatic, score, hasInk, firstMsg:(spec, ev) => firstMsg(spec, ev), byId, eachSpec, errSolved, dropCtx, resetAll, SketchCanvas, plotOf, _sk:SK, _scr:SCR};
})();
