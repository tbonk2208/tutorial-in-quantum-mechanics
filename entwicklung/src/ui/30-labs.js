/* ===== Labor: kleine Simulationen ===== */
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function plotCanvas(host, ar){
  const cv = h('canvas', {role:'img'});
  host.append(cv);
  const P = {cv, ar:ar || 0.5};
  P.fit = () => { const w = Math.max(280, host.clientWidth - 2); const dpr = window.devicePixelRatio || 1; cv.width = w * dpr; cv.height = Math.round(w * P.ar) * dpr; cv.style.height = Math.round(w * P.ar) + 'px'; P.w = w; P.h = Math.round(w * P.ar); P.c = cv.getContext('2d'); P.c.setTransform(dpr, 0, 0, dpr, 0, 0); };
  P.fit();
  P.frame = (x0, x1, y0, y1, opt) => {
    opt = opt || {};
    P.x0 = x0; P.x1 = x1; P.y0 = y0; P.y1 = y1;
    P.pl = 44; P.pr = 14; P.pt = 12; P.pb = 30;
    const c = P.c; c.clearRect(0, 0, P.w, P.h);
    c.fillStyle = cssv('--sheet'); c.fillRect(0, 0, P.w, P.h);
    c.strokeStyle = cssv('--grid'); c.lineWidth = 1;
    const nx = opt.nx || 8, ny = opt.ny || 4;
    for (let i = 0; i <= nx; i++){ const X = P.X(x0 + (x1 - x0) * i / nx); c.beginPath(); c.moveTo(X, P.pt); c.lineTo(X, P.h - P.pb); c.stroke(); }
    for (let i = 0; i <= ny; i++){ const Y = P.Y(y0 + (y1 - y0) * i / ny); c.beginPath(); c.moveTo(P.pl, Y); c.lineTo(P.w - P.pr, Y); c.stroke(); }
    c.strokeStyle = cssv('--axis'); c.lineWidth = 1.2;
    if (y0 <= 0 && y1 >= 0){ c.beginPath(); c.moveTo(P.pl, P.Y(0)); c.lineTo(P.w - P.pr, P.Y(0)); c.stroke(); }
    c.beginPath(); c.moveTo(P.pl, P.pt); c.lineTo(P.pl, P.h - P.pb); c.stroke();
    c.fillStyle = cssv('--muted'); c.font = '12px "Source Sans 3", sans-serif'; c.textAlign = 'center';
    for (let i = 0; i <= nx; i += (opt.lx || 2)){ const v = x0 + (x1 - x0) * i / nx; c.fillText(opt.fx ? opt.fx(v) : fmtTick(v), P.X(v), P.h - P.pb + 16); }
    c.textAlign = 'right';
    for (let i = 0; i <= ny; i++){ const v = y0 + (y1 - y0) * i / ny; c.fillText(opt.fy ? opt.fy(v) : fmtTick(v), P.pl - 6, P.Y(v) + 4); }
    if (opt.xl){ c.textAlign = 'right'; c.fillText(opt.xl, P.w - P.pr, P.h - 4); }
    if (opt.yl){ c.textAlign = 'left'; c.fillText(opt.yl, P.pl + 4, P.pt + 12); }
  };
  P.X = x => P.pl + (x - P.x0) / (P.x1 - P.x0) * (P.w - P.pl - P.pr);
  P.Y = y => P.h - P.pb - (y - P.y0) / (P.y1 - P.y0) * (P.h - P.pt - P.pb);
  P.curve = (f, col, lw, n, dash) => {
    const c = P.c; c.strokeStyle = col; c.lineWidth = lw || 2.2; c.setLineDash(dash || []); c.beginPath();
    n = n || 400; let first = true;
    for (let i = 0; i <= n; i++){ const x = P.x0 + (P.x1 - P.x0) * i / n; const y = f(x); if (!isFinite(y)){ first = true; continue; } const Y = Math.max(-50, Math.min(P.h + 50, P.Y(y))); if (first){ c.moveTo(P.X(x), Y); first = false; } else c.lineTo(P.X(x), Y); }
    c.stroke(); c.setLineDash([]);
  };
  P.fill = (f, a, b, col) => { const c = P.c; c.fillStyle = col; c.beginPath(); c.moveTo(P.X(a), P.Y(0)); const n = 200; for (let i = 0; i <= n; i++){ const x = a + (b - a) * i / n; c.lineTo(P.X(x), P.Y(f(x))); } c.lineTo(P.X(b), P.Y(0)); c.closePath(); c.fill(); };
  P.vline = (x, col, dash, label) => { const c = P.c; c.strokeStyle = col; c.lineWidth = 1.6; c.setLineDash(dash || [5, 4]); c.beginPath(); c.moveTo(P.X(x), P.pt); c.lineTo(P.X(x), P.h - P.pb); c.stroke(); c.setLineDash([]); if (label){ c.fillStyle = col; c.textAlign = 'center'; c.font = '12px "Source Sans 3", sans-serif'; c.fillText(label, P.X(x), P.pt + 12); } };
  P.hline = (y, x0, x1, col, lw, label) => { const c = P.c; c.strokeStyle = col; c.lineWidth = lw || 1.5; c.beginPath(); c.moveTo(P.X(x0), P.Y(y)); c.lineTo(P.X(x1), P.Y(y)); c.stroke(); if (label){ c.fillStyle = col; c.textAlign = 'left'; c.font = '12px "Source Sans 3", sans-serif'; c.fillText(label, P.X(x1) + 4, P.Y(y) + 4); } };
  P.text = (s, x, y, col, align) => { const c = P.c; c.fillStyle = col || cssv('--ink'); c.textAlign = align || 'left'; c.font = '13px "Source Sans 3", sans-serif'; c.fillText(s, x, y); };
  return P;
}
function fmtTick(v){ const r = Math.round(v * 100) / 100; return String(r).replace('.', ','); }
function slider(host, label, min, max, step, value, onInput){
  const out = h('b', {}, '');
  const inp = h('input', {type:'range', min, max, step, value});
  const lab = h('label', {}, h('span', {}, label, ' ', out), inp);
  const upd = () => { out.textContent = String(+(+inp.value).toFixed(3)).replace('.', ','); onInput(+inp.value); };
  inp.addEventListener('input', upd);
  host.append(lab);
  out.textContent = String(value).replace('.', ',');
  return inp;
}
function selectBox(host, label, options, onChange, value){
  const sel = h('select', {style:'font:inherit;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--sheet);color:var(--ink)'});
  for (const [v, t] of options) sel.append(h('option', {value:v}, t));
  if (value !== undefined) sel.value = String(value);
  sel.addEventListener('change', () => onChange(sel.value));
  host.append(h('label', {}, label, sel));
  return sel;
}
function labShell(el, ar, ar2){
  const P = plotCanvas(el, ar);
  const P2 = ar2 ? plotCanvas(el, ar2) : null;
  const ctrl = h('div', {class:'ctrl'}); const ro = h('div', {class:'readout'});
  el.append(ctrl, ro);
  let lastW = -1; const ro2 = new ResizeObserver(() => { const w = Math.max(280, el.clientWidth - 2); if (Math.abs(w - lastW) < 2) return; lastW = w; P.fit(); if (P2) P2.fit(); if (P.redraw) P.redraw(); });
  ro2.observe(el);
  return {P, P2, ctrl, ro};
}
const LABS = {};
LABS.none = el => { el.textContent = ''; };
/* Labor starten. o.display: Anzeige-Modus als Abbildung im Erklärtext (wenige Regler, Rest unter „Mehr Regler“);
   o.init: Startwerte, z. B. {n:2} (je Labor dokumentiert). Alle Labore: LABS[typ](el, spec, o). */
function labRun(host, type, spec, o){
  o = o || {};
  host.classList.add('lab'); if (o.display) host.classList.add('fig');
  try { (LABS[type] || LABS.none)(host, spec || {}, o); }
  catch(e){ console.error(e); host.textContent = 'Das Labor lässt sich gerade nicht anzeigen.'; return host; }
  if (o.display){
    const ctrl = host.querySelector('.ctrl'), K = o.keep;
    const items = ctrl ? [...ctrl.children] : [];
    /* sichtbar bleiben: keep = Liste von Reglernamen (Anfang der Beschriftung oder ein Wort daraus, z. B. ['Zeit'], ['ε']), Zahl oder 'all'; sonst die ersten zwei */
    const vis = K === 'all' || K === true ? items
      : Array.isArray(K) ? items.filter(c => { const n = ctlName(c).toLowerCase(), toks = n.split(/[\s,;:()\/]+/); return K.some(k => { k = String(k).toLowerCase(); return n.startsWith(k) || toks.includes(k); }); })
      : items.slice(0, typeof K === 'number' ? K : 2);
    if (ctrl && vis.length < items.length){
      items.forEach(c => { if (!vis.includes(c)) c.classList.add('xtra'); });
      const b = h('button', {class:'btn btn-ghost btn-sm morectl', type:'button', 'aria-expanded':'false'}, 'Mehr Regler');
      b.onclick = () => { const on = !host.classList.contains('more'); host.classList.toggle('more', on); b.textContent = on ? 'Weniger Regler' : 'Mehr Regler'; b.setAttribute('aria-expanded', String(on)); const cv = host.querySelector('canvas'); if (cv && cv.__redraw) cv.__redraw(); };
      ctrl.after(b);
    }
  }
  return host;
}
const labInit = o => (o && o.init) || {};
/* Name eines Reglers: erster Text der Beschriftung (ohne angezeigten Wert) */
function ctlName(c){ for (const n of c.childNodes){ if (n.nodeType === 3 && n.textContent.trim()) return n.textContent.trim(); if (n.nodeType === 1 && n.tagName === 'SPAN'){ const f = n.firstChild; if (f && f.nodeType === 3 && f.textContent.trim()) return f.textContent.trim(); } } return c.textContent.trim(); }

/* komplexe Zahlen */
LABS.complex = (el, L, o) => {
  const {P, ctrl, ro} = labShell(el, 0.62);
  const I = labInit(o); let r = I.r ?? 1.2, ph = I.ph ?? 0.8;
  const draw = () => {
    P.frame(-2, 2, -1.6, 1.6, {nx:8, ny:4, xl:'Re', yl:'Im'});
    const c = P.c;
    c.strokeStyle = cssv('--grid-strong'); c.beginPath(); c.arc(P.X(0), P.Y(0), P.X(1) - P.X(0), 0, 2 * Math.PI); c.stroke();
    const z = [r * Math.cos(ph), r * Math.sin(ph)];
    const arrow = (x, y, col, lab) => { c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 2.4; c.beginPath(); c.moveTo(P.X(0), P.Y(0)); c.lineTo(P.X(x), P.Y(y)); c.stroke(); c.beginPath(); c.arc(P.X(x), P.Y(y), 4, 0, 7); c.fill(); P.text(lab, P.X(x) + 6, P.Y(y) - 6, col); };
    arrow(z[0], z[1], cssv('--c2'), 'z');
    arrow(z[0], -z[1], cssv('--c1'), 'z*');
    ro.innerHTML = texHTML('z = r\\,e^{i\\varphi} = ' + (r * Math.cos(ph)).toFixed(2).replace('.', '{,}') + (z[1] < 0 ? '-' : '+') + Math.abs(z[1]).toFixed(2).replace('.', '{,}') + '\\,i,\\quad |z|^2 = z^*z = ' + (r * r).toFixed(2).replace('.', '{,}') + ',\\quad \\arg z = ' + ph.toFixed(2).replace('.', '{,}'));
  };
  P.redraw = draw;
  slider(ctrl, 'Betrag r', 0, 1.5, 0.01, r, v => { r = v; draw(); });
  slider(ctrl, 'Phase φ', -3.14, 3.14, 0.01, ph, v => { ph = v; draw(); });
  draw();
};

/* Wahrscheinlichkeitsdichte */
LABS.prob = (el, L, o) => {
  const {P, ctrl, ro} = labShell(el, 0.5);
  const I = labInit(o);
  const S2 = Math.SQRT2;
  const F = {
    par:{name:'ψ = A x(L−x)', f:x => Math.sqrt(30) * x * (1 - x)},
    sin:{name:'ψ₁ = √2 sin(πx)', f:x => S2 * Math.sin(Math.PI * x)},
    sup:{name:'(ψ₁ + ψ₂)/√2', f:x => (S2 * Math.sin(Math.PI * x) + S2 * Math.sin(2 * Math.PI * x)) / S2},
    tri:{name:'Dreieck', f:x => Math.sqrt(3) * 2 * (x < 0.5 ? x : 1 - x)},
    gauss:{name:'Gauß (σ = 0,13 L)', f:x => Math.pow(2 * Math.PI * 0.0169, -0.25) * Math.exp(-Math.pow(x - 0.5, 2) / (4 * 0.0169))},
    exp:{name:'Exponentialdichte (a = 0,7 L)', f:x => Math.sqrt(2 / 0.7 / (1 - Math.exp(-2 / 0.7))) * Math.exp(-x / 0.7)}
  };
  let key = F[I.f] ? I.f : F[I.key] ? I.key : 'par', a = I.a ?? 0.2, b = I.b ?? 0.5;
  const integ = (f, lo, hi) => { const n = 600; let s = 0; for (let i = 0; i < n; i++){ const x = lo + (hi - lo) * (i + 0.5) / n; s += f(x); } return s * (hi - lo) / n; };
  const draw = () => {
    const psi = F[key].f, rho = x => psi(x) * psi(x);
    P.frame(0, 1, 0, 3.2, {nx:10, ny:4, xl:'x / L', yl:'|ψ|² · L', lx:2});
    P.fill(rho, Math.min(a, b), Math.max(a, b), 'color-mix(in srgb, ' + cssv('--c2') + ' 28%, transparent)');
    P.curve(rho, cssv('--c2'), 2.6);
    P.curve(psi, cssv('--c5'), 1.4, 300, [4, 4]);
    const ex = integ(x => x * rho(x), 0, 1), ex2 = integ(x => x * x * rho(x), 0, 1), dx = Math.sqrt(Math.max(0, ex2 - ex * ex));
    P.vline(ex, cssv('--c1'), [5, 4], '⟨x⟩');
    P.c.fillStyle = 'color-mix(in srgb, ' + cssv('--c1') + ' 12%, transparent)'; P.c.fillRect(P.X(ex - dx), P.pt, P.X(ex + dx) - P.X(ex - dx), P.h - P.pt - P.pb);
    const pr = integ(rho, Math.min(a, b), Math.max(a, b));
    ro.innerHTML = 'Wahrscheinlichkeit im Intervall: ' + texHTML('P = \\int_a^b |\\psi|^2\\,dx \\approx ' + pr.toFixed(3).replace('.', '{,}')) + ' · ' + texHTML('\\langle x\\rangle \\approx ' + ex.toFixed(3).replace('.', '{,}') + 'L,\\; \\Delta x \\approx ' + dx.toFixed(3).replace('.', '{,}') + 'L') + ' · gestrichelt: ψ selbst';
  };
  P.redraw = draw;
  selectBox(ctrl, 'Wellenfunktion', Object.entries(F).map(([k, v]) => [k, v.name]), v => { key = v; draw(); }, key);
  slider(ctrl, 'untere Grenze a/L', 0, 1, 0.01, a, v => { a = v; draw(); });
  slider(ctrl, 'obere Grenze b/L', 0, 1, 0.01, b, v => { b = v; draw(); });
  draw();
};

/* Kasten: Eigenfunktionen */
LABS.box = (el, L, o) => {
  const {P, ctrl, ro} = labShell(el, 0.62);
  const I = labInit(o); let n = I.n ?? 1, mode = I.mode === 'rho' ? 'rho' : 'psi';
  const draw = () => {
    P.frame(-0.1, 1.1, -0.2, 17.5, {nx:12, ny:7, xl:'x / L', yl:'E / E₁', lx:2, fy:v => String(Math.round(v * 10) / 10).replace('.', ',')});
    const c = P.c;
    c.strokeStyle = cssv('--axis'); c.lineWidth = 3; c.beginPath(); c.moveTo(P.X(0), P.Y(17.5)); c.lineTo(P.X(0), P.Y(0)); c.lineTo(P.X(1), P.Y(0)); c.lineTo(P.X(1), P.Y(17.5)); c.stroke();
    for (let k = 1; k <= 4; k++) P.hline(k * k, 0, 1, k === n ? cssv('--c1') : cssv('--grid-strong'), k === n ? 2 : 1.2, 'n=' + k);
    const E = n * n, sc = 1.4;
    P.curve(x => (x < 0 || x > 1) ? NaN : E + sc * (mode === 'psi' ? Math.SQRT2 * Math.sin(n * Math.PI * x) : 2 * Math.pow(Math.sin(n * Math.PI * x), 2) / 1.4), cssv('--c2'), 2.4);
    ro.innerHTML = texHTML('E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2} = ' + (n * n) + 'E_1') + ' · Knoten im Inneren: ' + (n - 1) + ' · ' + texHTML('\\lambda = 2L/n');
  };
  P.redraw = draw;
  slider(ctrl, 'Quantenzahl n', 1, 4, 1, n, v => { n = v; draw(); });
  selectBox(ctrl, 'Anzeige', [['psi', 'ψₙ(x)'], ['rho', '|ψₙ(x)|²']], v => { mode = v; draw(); }, mode);
  draw();
};

/* Überlagerung zweier Zustände im Kasten, Zeitentwicklung */
LABS.twostate = (el, L, o) => {
  const {P, ctrl, ro} = labShell(el, 0.5);
  const I = labInit(o); let w1 = I.w1 ?? 0.5, t = 0, play = null, n2 = I.n2 === 3 ? 3 : 2;
  const E1 = 1; let E2 = n2 * n2; // in Einheiten von E1, ħ = 1 → Periode T = 2π/(E2-E1)
  const draw = () => {
    const c1 = Math.sqrt(w1), c2 = Math.sqrt(1 - w1);
    const rho = x => { const a = c1 * Math.SQRT2 * Math.sin(Math.PI * x), b = c2 * Math.SQRT2 * Math.sin(n2 * Math.PI * x); return a * a + b * b + 2 * a * b * Math.cos((E2 - E1) * t); };
    P.frame(0, 1, 0, 4, {nx:10, ny:4, xl:'x / L', yl:'|Ψ(x,t)|² · L', lx:2});
    P.curve(rho, cssv('--c2'), 2.6);
    let ex = 0; for (let i = 0; i < 400; i++){ const x = (i + 0.5) / 400; ex += x * rho(x) / 400; }
    P.vline(ex, cssv('--c1'), [5, 4], '⟨x⟩');
    ro.innerHTML = 'Zeit ' + texHTML('t = ' + (t / (2 * Math.PI / (E2 - E1))).toFixed(2).replace('.', '{,}') + '\\,T') + ' mit ' + texHTML('T = \\frac{2\\pi\\hbar}{E_' + n2 + ' - E_1}') + ' · ' + texHTML('|c_1|^2 = ' + w1.toFixed(2).replace('.', '{,}')) + ' · ' + (w1 === 0 || w1 === 1 ? 'stationär: Dichte bleibt gleich' : n2 === 2 ? 'Überlagerung: Dichte schwappt hin und her' : 'Überlagerung: Dichte ändert sich, bleibt aber symmetrisch zur Mitte – ⟨x⟩ bleibt bei L/2');
  };
  P.redraw = draw;
  slider(ctrl, 'Anteil |c₁|²', 0, 1, 0.01, w1, v => { w1 = v; draw(); });
  const ts = slider(ctrl, 'Zeit t (in Perioden T)', 0, 2, 0.01, 0, v => { t = v * 2 * Math.PI / (E2 - E1); draw(); });
  const b = h('button', {class:'btn btn-sm', type:'button'}, 'Abspielen');
  b.onclick = () => { if (play){ cancelAnimationFrame(play); play = null; b.textContent = 'Abspielen'; return; } b.textContent = 'Anhalten'; const step = () => { if (!document.body.contains(el)){ play = null; return; } t += 0.03; ts.value = ((t * (E2 - E1) / (2 * Math.PI)) % 2).toFixed(2); draw(); play = requestAnimationFrame(step); }; play = requestAnimationFrame(step); };
  ctrl.append(h('label', {}, 'Animation', b));
  selectBox(ctrl, 'Zweiter Zustand', [['2', 'ψ₂ (Überlagerung ψ₁ + ψ₂)'], ['3', 'ψ₃ (Überlagerung ψ₁ + ψ₃)']], v => { const f = t * (E2 - E1); n2 = +v; E2 = n2 * n2; t = f / (E2 - E1); draw(); }, String(n2));
  draw();
};

/* freies Gaußsches Wellenpaket (ħ = m = 1) */
LABS.packet = (el, L, o) => {
  const {P, ctrl, ro} = labShell(el, 0.5);
  const I = labInit(o); let s0 = I.s0 ?? 0.5, k0 = I.k0 ?? 3, t = I.t ?? 0;
  const draw = () => {
    // ψ(x,t) für ψ(x,0) ∝ exp(-x²/(4σ²) + i k0 x)
    const st = s0 * Math.sqrt(1 + Math.pow(t / (2 * s0 * s0), 2));
    const xc = k0 * t;
    const rho = x => Math.exp(-Math.pow(x - xc, 2) / (2 * st * st)) / Math.sqrt(2 * Math.PI * st * st);
    // Realteil: Phase aus exakter Lösung
    const re = x => {
      const a = 1 / (4 * s0 * s0);
      const zr = 1, zi = 2 * a * t; // 1 + 2iat
      const dx = x - k0 * t;
      // exp(-a (x-k0 t)^2/(1+2iat)) * exp(i k0 x - i k0^2 t/2) / sqrt(1+2iat)
      const d2 = zr * zr + zi * zi;
      const er = -a * dx * dx * zr / d2, ei = a * dx * dx * zi / d2;
      const ph = k0 * x - k0 * k0 * t / 2 + ei - 0.5 * Math.atan2(zi, zr);
      const mag = Math.exp(er) / Math.pow(d2, 0.25) / Math.pow(2 * Math.PI * s0 * s0, 0.25);
      return mag * Math.cos(ph);
    };
    P.frame(-4, 12, -0.9, 0.9, {nx:16, ny:6, xl:'x', yl:'Re ψ (dünn), |ψ|² (dick)', lx:4});
    P.curve(re, cssv('--c5'), 1.2, 900);
    P.curve(rho, cssv('--c2'), 2.6, 600);
    ro.innerHTML = texHTML('\\Delta x(t) = \\sigma_0\\sqrt{1 + \\left(\\frac{\\hbar t}{2m\\sigma_0^2}\\right)^2} = ' + st.toFixed(2).replace('.', '{,}')) + ' · ' + texHTML('\\langle x\\rangle = \\frac{\\hbar k_0}{m}t = ' + xc.toFixed(2).replace('.', '{,}')) + ' · ' + texHTML('\\Delta p = \\hbar/(2\\sigma_0) = ' + (1 / (2 * s0)).toFixed(2).replace('.', '{,}')) + ' (Einheiten ħ = m = 1)';
  };
  P.redraw = draw;
  slider(ctrl, 'Anfangsbreite σ₀', 0.2, 1.5, 0.01, s0, v => { s0 = v; draw(); });
  slider(ctrl, 'Wellenzahl k₀', 0, 5, 0.1, k0, v => { k0 = v; draw(); });
  slider(ctrl, 'Zeit t', 0, 2.5, 0.01, t, v => { t = v; draw(); });
  draw();
};

/* Rechteckbarriere: Wellenfunktion über x und Transmission T(E)
   Einheiten: Energie in V₀, Länge in ħ/√(2mV₀) (also ħ²/2m = V₀ = 1): k = √E, im Inneren K = √(E − 1) (für E < V₀ imaginär, K = iκ).
   Exakte stationäre Lösung: links e^{ikx} + r e^{−ikx}, innen C e^{iKx} + D e^{−iKx}, rechts t e^{ikx}; Anschluss von ψ und ψ′ bei x = 0 und x = a.
   o.init: {a, e, view:'both'|'psi'|'T', show:'re'|'rho'|'both'} */
const BZ = {
  mul:(a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]],
  div:(a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; },
  add:(a, b) => [a[0] + b[0], a[1] + b[1]], sub:(a, b) => [a[0] - b[0], a[1] - b[1]], sc:(a, x) => [a[0] * x, a[1] * x],
  exp:a => { const r = Math.exp(a[0]); return [r * Math.cos(a[1]), r * Math.sin(a[1])]; },
  ab2:a => a[0] * a[0] + a[1] * a[1]
};
function barrierSolution(E, a){
  if (Math.abs(E - 1) < 1e-7) E += 2e-7;
  const k = Math.sqrt(E), K = E >= 1 ? [Math.sqrt(E - 1), 0] : [0, Math.sqrt(1 - E)];
  const iK = [-K[1], K[0]];                                   // i·K
  const eKa = BZ.exp(BZ.sc(iK, a)), emKa = BZ.exp(BZ.sc(iK, -a)), eika = [Math.cos(k * a), Math.sin(k * a)];
  const kK = BZ.div([k, 0], K), Kk = BZ.div(K, [k, 0]);
  const Cp = BZ.mul(BZ.mul(eika, emKa), BZ.sc(BZ.add([1, 0], kK), 0.5));   // C/t
  const Dp = BZ.mul(BZ.mul(eika, eKa), BZ.sc(BZ.sub([1, 0], kK), 0.5));    // D/t
  const t = BZ.div([2, 0], BZ.add(BZ.add(Cp, Dp), BZ.mul(Kk, BZ.sub(Cp, Dp))));
  const C = BZ.mul(t, Cp), D = BZ.mul(t, Dp), r = BZ.sub(BZ.add(C, D), [1, 0]);
  const psi = x => x < 0 ? BZ.add([Math.cos(k * x), Math.sin(k * x)], BZ.mul(r, [Math.cos(k * x), -Math.sin(k * x)]))
    : x <= a ? BZ.add(BZ.mul(C, BZ.exp(BZ.sc(iK, x))), BZ.mul(D, BZ.exp(BZ.sc(iK, -x))))
    : BZ.mul(t, [Math.cos(k * x), Math.sin(k * x)]);
  return {k, K, t, r, C, D, T:BZ.ab2(t), R:BZ.ab2(r), psi};
}
LABS.barrier = (el, L, o) => {
  o = o || {}; const I = labInit(o);
  const {P, P2, ctrl, ro} = labShell(el, 0.46, 0.42);
  let a = I.a ?? 3, e = I.e ?? 0.5, view = I.view || (o.display ? 'psi' : 'both'), show = I.show || 'both', ph = 0, play = null;
  const T = E => {
    if (E <= 0) return 0;
    if (Math.abs(E - 1) < 1e-9) E += 1e-9;
    if (E < 1){ const k = Math.sqrt(1 - E); const s = Math.sinh(k * a); return 1 / (1 + s * s / (4 * E * (1 - E))); }
    const q = Math.sqrt(E - 1); const s = Math.sin(q * a); return 1 / (1 + s * s / (4 * E * (E - 1)));
  };
  P.cv.setAttribute('aria-label', 'Potential V(x), Energie E und Wellenfunktion über x');
  P2.cv.setAttribute('aria-label', 'Transmission T in Abhängigkeit von der Energie');
  const drawPsi = S => {
    const lam = 2 * Math.PI / S.k, X = Math.max(9, Math.min(20, 1.4 * lam)), st = 5;
    const x0 = -Math.ceil(X / st) * st, x1 = Math.ceil((a + X) / st) * st, nx = Math.round((x1 - x0) / st);
    const y0 = Math.floor(Math.min(-0.25, e - 0.75) * 2) / 2, y1 = Math.ceil(Math.max(1.5, e + 0.8) * 2) / 2;
    P.frame(x0, x1, y0, y1, {nx, ny:Math.round((y1 - y0) / 0.5), xl:'x · √(2mV₀)/ħ', yl:'E / V₀', lx:nx > 8 ? 2 : 1});
    const X0 = x0, X1 = x1;
    const c = P.c;
    c.fillStyle = 'color-mix(in srgb, ' + cssv('--c4') + ' 14%, transparent)'; c.fillRect(P.X(0), P.Y(1), P.X(a) - P.X(0), P.Y(0) - P.Y(1));
    c.strokeStyle = cssv('--axis'); c.lineWidth = 2.6; c.beginPath(); c.moveTo(P.X(X0), P.Y(0)); c.lineTo(P.X(0), P.Y(0)); c.lineTo(P.X(0), P.Y(1)); c.lineTo(P.X(a), P.Y(1)); c.lineTo(P.X(a), P.Y(0)); c.lineTo(P.X(X1), P.Y(0)); c.stroke();
    P.text('V(x)', P.X(a) + 6, P.Y(1) - 6, cssv('--axis'));
    P.curve(() => e, cssv('--c4'), 1.4, 2, [6, 4]);
    P.text('E', P.X(X0) + 4, P.Y(e) - 6, cssv('--c4'));
    const rot = [Math.cos(-ph), Math.sin(-ph)];   // Zeitfaktor e^{−iEt/ħ}
    if (show !== 'rho') P.curve(x => e + 0.28 * BZ.mul(S.psi(x), rot)[0], cssv('--c5'), 1.5, 900);
    if (show !== 're') P.curve(x => e + 0.14 * BZ.ab2(S.psi(x)), cssv('--c2'), 2.6, 900);
  };
  const drawT = () => {
    P2.frame(0, 3, 0, 1.05, {nx:12, ny:4, xl:'E / V₀', yl:'Transmission T', lx:2});
    P2.vline(1, cssv('--grid-strong'), [3, 3], 'E = V₀');
    P2.curve(T, cssv('--c2'), 2.6, 600);
    P2.c.fillStyle = cssv('--c1'); P2.c.beginPath(); P2.c.arc(P2.X(e), P2.Y(T(e)), 5, 0, 7); P2.c.fill();
  };
  const draw = () => {
    const S = barrierSolution(e, a);
    P.cv.hidden = view === 'T'; P2.cv.hidden = view === 'psi';
    if (view !== 'T') drawPsi(S);
    if (view !== 'psi') drawT();
    const lam = 2 * Math.PI / S.k;
    ro.innerHTML = texHTML('E/V_0 = ' + e.toFixed(2).replace('.', '{,}') + ':\\; T = |t|^2 = ' + S.T.toFixed(4).replace('.', '{,}') + ',\\; R = |r|^2 = ' + S.R.toFixed(4).replace('.', '{,}'))
      + ' · Wellenlänge links und rechts gleich: ' + texHTML('\\lambda = 2\\pi/k = ' + lam.toFixed(2).replace('.', '{,}')) + ' (gleiche Energie, nur kleinere Amplitude ' + texHTML('|t| = ' + Math.sqrt(S.T).toFixed(3).replace('.', '{,}')) + ')'
      + (e < 1 ? ' · in der Barriere exponentieller Abfall, Abklinglänge ' + texHTML('1/\\kappa = ' + (1 / Math.sqrt(1 - e)).toFixed(2).replace('.', '{,}')) + ' · ' + texHTML('T \\approx 16\\frac{E}{V_0}\\left(1-\\frac{E}{V_0}\\right)e^{-2\\kappa a}') + ' für breite Barrieren'
        : ' · über der Barriere: Resonanzen bei ' + texHTML('qa = n\\pi'))
      + (view !== 'T' ? ' · ψ ist auf der Energielinie aufgetragen (' + (show === 're' ? 'Re ψ' : show === 'rho' ? '|ψ|²' : 'dünn: Re ψ, dick: |ψ|²') + ', Einheit willkürlich)' : '');
    if (o.display && !el.classList.contains('more')) ro.innerHTML = texHTML('T = ' + S.T.toFixed(3).replace('.', '{,}') + ',\\; R = ' + S.R.toFixed(3).replace('.', '{,}')) + ' · gleiche Wellenlänge links und rechts' + (e < 1 ? ', innen exponentieller Abfall' : '') + ' · dünn: Re ψ, dick: |ψ|²';
  };
  P.redraw = draw; P.cv.__redraw = draw;
  slider(ctrl, 'Energie E/V₀', 0.02, 3, 0.01, e, v => { e = v; draw(); });
  slider(ctrl, 'Breite a·√(2mV₀)/ħ', 0.5, 9, 0.05, a, v => { a = v; draw(); });
  selectBox(ctrl, 'Ansicht', [['both', 'ψ(x) und T(E)'], ['psi', 'nur ψ(x)'], ['T', 'nur T(E)']], v => { view = v; draw(); }, view);
  selectBox(ctrl, 'Wellenfunktion', [['both', 'Re ψ und |ψ|²'], ['re', 'nur Re ψ'], ['rho', 'nur |ψ|²']], v => { show = v; draw(); }, show);
  const bp = h('button', {class:'btn btn-sm', type:'button'}, 'Zeit laufen lassen');
  bp.onclick = () => { if (play){ cancelAnimationFrame(play); play = null; bp.textContent = 'Zeit laufen lassen'; return; } bp.textContent = 'Anhalten'; const step = () => { if (!document.body.contains(el)){ play = null; return; } ph += 0.05 * Math.max(0.3, e); draw(); play = requestAnimationFrame(step); }; play = requestAnimationFrame(step); };
  ctrl.append(h('label', {}, 'Re ψ · e^(−iEt/ħ)', bp));
  draw();
};

/* harmonischer Oszillator (ħ = m = ω = 1) */
LABS.osc = (el, L, o) => {
  const {P, ctrl, ro} = labShell(el, 0.62);
  const I = labInit(o); let n = I.n ?? 0, cls = I.cls !== false;
  const psi = (k, x) => { let h0 = 1, h1 = 2 * x; let H = k === 0 ? 1 : h1; for (let j = 1; j < k; j++){ const h2 = 2 * x * h1 - 2 * j * h0; h0 = h1; h1 = h2; H = h1; } return H * Math.exp(-x * x / 2) / Math.sqrt(Math.pow(2, k) * factR(k) * Math.sqrt(Math.PI)); };
  const draw = () => {
    P.frame(-5, 5, 0, 7, {nx:10, ny:7, xl:'x / √(ħ/mω)', yl:'E / ħω', lx:2});
    P.curve(x => x * x / 2, cssv('--axis'), 1.6);
    for (let k = 0; k <= 5; k++) P.hline(k + 0.5, -Math.sqrt(2 * k + 1), Math.sqrt(2 * k + 1), k === n ? cssv('--c1') : cssv('--grid-strong'), k === n ? 2 : 1.1, 'n=' + k);
    const E = n + 0.5, sc = 1.6;
    P.curve(x => E + sc * psi(n, x) * psi(n, x), cssv('--c2'), 2.4, 600);
    const xt = Math.sqrt(2 * n + 1);
    if (cls) P.curve(x => Math.abs(x) < xt * 0.999 ? E + sc / (Math.PI * Math.sqrt(xt * xt - x * x)) : NaN, cssv('--c4'), 1.4, 600, [5, 4]);
    let out = 0; for (let i = 0; i < 4000; i++){ const x = -8 + 16 * (i + 0.5) / 4000; if (Math.abs(x) > xt) out += psi(n, x) * psi(n, x) * 16 / 4000; }
    ro.innerHTML = texHTML('E_n = \\hbar\\omega\\left(n+\\tfrac12\\right) = ' + E.toString().replace('.', '{,}') + '\\,\\hbar\\omega') + ' · Aufenthalt außerhalb der klassischen Umkehrpunkte: ' + (100 * out).toFixed(1).replace('.', ',') + ' %' + (cls ? ' · gestrichelt: klassische Aufenthaltsdichte' : '');
  };
  P.redraw = draw;
  slider(ctrl, 'Quantenzahl n', 0, 5, 1, n, v => { n = v; draw(); });
  selectBox(ctrl, 'Klassischer Vergleich', [['1', 'anzeigen'], ['0', 'ausblenden']], v => { cls = v === '1'; draw(); }, cls ? '1' : '0');
  draw();
};

/* Messung an einem Dreiniveausystem: viele gleich präparierte Systeme (Häufigkeiten) und
   eine Messfolge an einem einzelnen System mit zwei nicht vertauschenden Observablen A und B.
   A hat die Eigenbasis |a₁⟩, |a₂⟩, |a₃⟩; B die Eigenbasis b₁ = (1,1,1)/√3, b₂ = (1,0,−1)/√2, b₃ = (1,−2,1)/√6 (in der A-Basis).
   o.init: {w:[w1,w2,w3], seq:false} */
LABS.measure = (el, L, o) => {
  o = o || {}; const I = labInit(o);
  const {P, ctrl, ro} = labShell(el, 0.45);
  let w = Array.isArray(I.w) && I.w.length === 3 ? I.w.slice() : [0.5, 0.3, 0.2]; const counts = [0, 0, 0];
  const R = rng(12345);
  const norm = () => { const s = w[0] + w[1] + w[2] || 1; return w.map(x => x / s); };
  const draw = () => {
    const p = norm(); const N = counts.reduce((a, b) => a + b, 0);
    P.frame(0.5, 3.5, 0, 1, {nx:6, ny:4, xl:'Messwert a (Eigenwerte 1, 2, 3)', yl:'Anteil', lx:1, fx:v => (Math.abs(v - Math.round(v)) < 0.01 && v >= 1 && v <= 3) ? String(Math.round(v)) : ''});
    const c = P.c;
    for (let k = 0; k < 3; k++){
      const x = k + 1;
      c.fillStyle = 'color-mix(in srgb, ' + cssv('--c2') + ' 30%, transparent)'; c.fillRect(P.X(x - 0.3), P.Y(p[k]), P.X(x) - P.X(x - 0.3), P.Y(0) - P.Y(p[k]));
      c.fillStyle = cssv('--c1'); const f = N ? counts[k] / N : 0; c.fillRect(P.X(x), P.Y(f), P.X(x + 0.3) - P.X(x), P.Y(0) - P.Y(f));
    }
    const ex = p[0] + 2 * p[1] + 3 * p[2], mean = N ? (counts[0] + 2 * counts[1] + 3 * counts[2]) / N : NaN;
    const dA = Math.sqrt(Math.max(0, p[0] + 4 * p[1] + 9 * p[2] - ex * ex));
    ro.innerHTML = 'blau: ' + texHTML('|c_n|^2') + ', rot: gemessene Häufigkeit nach ' + N + ' Messungen · ' + texHTML('\\langle A\\rangle = \\sum_n a_n|c_n|^2 = ' + ex.toFixed(3).replace('.', '{,}') + ',\\; \\Delta A = ' + dA.toFixed(3).replace('.', '{,}')) + (N ? ' · Mittelwert der Messungen: ' + mean.toFixed(3).replace('.', ',') + ' · erwartete Streuung des Mittelwerts ' + texHTML('\\Delta A/\\sqrt N = ' + (dA / Math.sqrt(N)).toFixed(3).replace('.', '{,}')) : '');
  };
  P.redraw = draw;
  ['|c₁|² (Gewicht)', '|c₂|² (Gewicht)', '|c₃|² (Gewicht)'].forEach((lab, k) => slider(ctrl, lab, 0, 1, 0.01, w[k], v => { w[k] = v; counts.fill(0); draw(); prep(); }));
  const meas = n => { const p = norm(); for (let i = 0; i < n; i++){ const u = R(); counts[u < p[0] ? 0 : u < p[0] + p[1] ? 1 : 2]++; } draw(); };
  const b1 = h('button', {class:'btn btn-sm', type:'button'}, '1× messen'); b1.onclick = () => meas(1);
  const b2 = h('button', {class:'btn btn-sm', type:'button'}, '100× messen'); b2.onclick = () => meas(100);
  const b3 = h('button', {class:'btn btn-sm', type:'button'}, 'Zurücksetzen'); b3.onclick = () => { counts.fill(0); draw(); };
  ctrl.append(h('label', {}, 'Viele gleich präparierte Systeme', h('div', {class:'row'}, b1, b2, b3)));
  /* Messfolge an einem System */
  const U = [[1 / Math.sqrt(3), 1 / Math.sqrt(2), 1 / Math.sqrt(6)], [1 / Math.sqrt(3), 0, -2 / Math.sqrt(6)], [1 / Math.sqrt(3), -1 / Math.sqrt(2), 1 / Math.sqrt(6)]];   // U[n][j] = ⟨a_n|b_j⟩
  let psi = [0, 0, 0], log = [];
  const prep = () => { const p = norm(); psi = p.map(Math.sqrt); log = []; drawSeq(); };
  const pA = () => psi.map(x => x * x);
  const pB = () => [0, 1, 2].map(j => { const s = psi[0] * U[0][j] + psi[1] * U[1][j] + psi[2] * U[2][j]; return s * s; });
  const draw3 = u => { const r = R(); return r < u[0] ? 0 : r < u[0] + u[1] ? 1 : 2; };
  const seq = h('div', {class:'mseq'});
  const bars = (lab, p) => '<div class="mbars"><span class="ml">' + lab + '</span>' + p.map((x, i) => '<span class="mb"><i style="height:' + Math.round(100 * x) + '%"></i><em>' + (i + 1) + '</em><small>' + x.toFixed(2).replace('.', ',') + '</small></span>').join('') + '</div>';
  const drawSeq = () => {
    $('.mseq-p', seq).innerHTML = bars('P(A = …)', pA()) + bars('P(B = …)', pB());
    $('.mseq-log', seq).innerHTML = log.length ? 'Messfolge: ' + log.map(x => '<b>' + x + '</b>').join(' → ') : 'Noch keine Messung an diesem System.';
  };
  let lastObs = null;
  const mA = () => { const k = draw3(pA()); psi = [0, 0, 0]; psi[k] = 1; log.push('A = ' + (k + 1)); lastObs = mA; drawSeq(); };
  const mB = () => { const j = draw3(pB()); psi = [U[0][j], U[1][j], U[2][j]]; log.push('B = ' + (j + 1)); lastObs = mB; drawSeq(); };
  seq.innerHTML = '<p class="small"><b>Messfolge an einem einzelnen System.</b> A und B vertauschen nicht. Nach jeder Messung ist das System im Eigenzustand zum gemessenen Wert. Vergleiche A → A mit A → B → A.</p><div class="mseq-p"></div><p class="small mseq-log"></p>';
  const ba = h('button', {class:'btn btn-sm', type:'button'}, 'A messen'); ba.onclick = mA;
  const bb = h('button', {class:'btn btn-sm', type:'button'}, 'B messen'); bb.onclick = mB;
  const br = h('button', {class:'btn btn-sm', type:'button'}, 'Erneut messen'); br.onclick = () => { if (lastObs) lastObs(); };
  const bn = h('button', {class:'btn btn-sm', type:'button'}, 'Neu präparieren'); bn.onclick = () => { lastObs = null; prep(); };
  seq.append(h('div', {class:'row'}, ba, bb, br, bn));
  if (!o.display || I.seq) el.append(seq);
  prep();
  draw();
};

/* Kugelflächenfunktionen: Polardiagramm |Y_lm(θ)|² in der x-z-Ebene */
LABS.ylm = (el, L, o) => {
  const {P, ctrl, ro} = labShell(el, 0.75);
  const I = labInit(o); let l = I.l ?? 1, m = I.m ?? 0;
  const draw = () => {
    if (Math.abs(m) > l) m = Math.sign(m) * l;
    P.frame(-1, 1, -0.75, 0.75, {nx:8, ny:6, xl:'x', yl:'z'});
    const f = th => { const Y = YlmC(l, m, th, 0); return Y.re * Y.re + Y.im * Y.im; };
    let mx = 0; for (let i = 0; i <= 400; i++) mx = Math.max(mx, f(Math.PI * i / 400));
    const c = P.c; c.strokeStyle = cssv('--c2'); c.fillStyle = 'color-mix(in srgb, ' + cssv('--c2') + ' 20%, transparent)'; c.lineWidth = 2.4; c.beginPath();
    for (let i = 0; i <= 720; i++){ const th = 2 * Math.PI * i / 720; const r = 0.7 * f(th % (2 * Math.PI) > Math.PI ? 2 * Math.PI - th : th) / mx; const x = r * Math.sin(th), z = r * Math.cos(th); if (i === 0) c.moveTo(P.X(x), P.Y(z)); else c.lineTo(P.X(x), P.Y(z)); }
    c.closePath(); c.fill(); c.stroke();
    ro.innerHTML = texHTML('|Y_{' + l + '}^{' + m + '}(\\theta,\\varphi)|^2') + ' hängt nicht von φ ab (rotationssymmetrisch um z) · ' + texHTML('L^2 = \\hbar^2 l(l+1) = ' + (l * (l + 1)) + '\\hbar^2,\\; L_z = ' + m + '\\hbar') + ' · Knotenflächen in θ (Kegel, bei ungeradem l − |m| auch die Ebene θ = π/2): ' + (l - Math.abs(m));
  };
  P.redraw = draw;
  const sm = {v:null};
  slider(ctrl, 'l', 0, 4, 1, l, v => { l = v; if (sm.v){ sm.v.max = l; sm.v.min = -l; } draw(); });
  sm.v = slider(ctrl, 'm', -l, l, 1, m, v => { m = v; draw(); });
  draw();
};

/* Wasserstoff: radiale Aufenthaltswahrscheinlichkeit */
LABS.hydrogen = (el, L, o) => {
  const {P, ctrl, ro} = labShell(el, 0.5);
  const I = labInit(o); let n = I.n ?? 1, l = Math.min(I.l ?? 0, (I.n ?? 1) - 1);
  const R = (r) => { // R_nl in Einheiten a0 = 1
    const rho = 2 * r / n;
    const L = laguerreC(n - l - 1, 2 * l + 1, cx(rho)).re;
    const N = Math.sqrt(Math.pow(2 / n, 3) * factR(n - l - 1) / (2 * n * factR(n + l)));
    return N * Math.exp(-rho / 2) * Math.pow(rho, l) * L;
  };
  const draw = () => {
    if (l > n - 1) l = n - 1;
    const rmax = Math.max(8, 3 * n * n + 6);
    const Pr = r => r * r * R(r) * R(r);
    let mx = 0; for (let i = 1; i <= 600; i++) mx = Math.max(mx, Pr(rmax * i / 600));
    P.frame(0, rmax, 0, mx * 1.15, {nx:10, ny:4, xl:'r / a₀', yl:'r²|R_nl|²', lx:2, fy:v => v.toFixed(2).replace('.', ',')});
    P.curve(Pr, cssv('--c2'), 2.6, 800);
    const ex = (3 * n * n - l * (l + 1)) / 2;
    P.vline(ex, cssv('--c1'), [5, 4], '⟨r⟩');
    ro.innerHTML = '(unendlich schwerer Kern) ' + texHTML('E_n = -\\frac{13{,}6\\,\\mathrm{eV}}{n^2} = ' + (-13.6057 / (n * n)).toFixed(3).replace('.', '{,}') + '\\,\\mathrm{eV}') + ' · ' + texHTML('\\langle r\\rangle = \\frac{a_0}{2}\\left[3n^2 - l(l+1)\\right] = ' + ex.toString().replace('.', '{,}') + 'a_0') + ' · radiale Knoten: ' + (n - l - 1);
  };
  P.redraw = draw;
  const sl = {v:null};
  slider(ctrl, 'n', 1, 4, 1, n, v => { n = v; if (sl.v){ sl.v.max = n - 1; if (+sl.v.value > n - 1){ sl.v.value = n - 1; l = n - 1; } } draw(); });
  sl.v = slider(ctrl, 'l', 0, n - 1, 1, l, v => { l = v; draw(); });
  draw();
};

/* Spin ½: Zustand auf der Bloch-Kugel, Messwahrscheinlichkeiten */
LABS.spin = (el, L, o) => {
  const {P, ctrl, ro} = labShell(el, 0.55);
  const I = labInit(o); let th = I.th ?? 1.0, ph = I.ph ?? 0.6; const cnt = {z:[0, 0], x:[0, 0]}; const R = rng(777);
  const draw = () => {
    P.frame(-1.6, 1.6, -0.88, 0.88, {nx:8, ny:4});
    const c = P.c, X0 = P.X(-0.8), Y0 = P.Y(0), rad = P.X(0) - P.X(-0.7);
    c.strokeStyle = cssv('--grid-strong'); c.lineWidth = 1.2; c.beginPath(); c.arc(X0, Y0, rad, 0, 7); c.stroke();
    c.beginPath(); c.ellipse(X0, Y0, rad, rad * 0.3, 0, 0, 7); c.stroke();
    const vx = Math.sin(th) * Math.cos(ph), vy = Math.sin(th) * Math.sin(ph), vz = Math.cos(th);
    const px = X0 + rad * (vy * 0.95 - vx * 0.35), py = Y0 - rad * (vz - vx * 0.25);
    c.strokeStyle = cssv('--c1'); c.lineWidth = 2.6; c.beginPath(); c.moveTo(X0, Y0); c.lineTo(px, py); c.stroke(); c.fillStyle = cssv('--c1'); c.beginPath(); c.arc(px, py, 4, 0, 7); c.fill();
    P.text('z ↑', X0 - 8, Y0 - rad - 4, cssv('--muted')); P.text('↓', X0 - 4, Y0 + rad + 14, cssv('--muted'));
    const pz = Math.cos(th / 2) ** 2, pxp = (1 + Math.sin(th) * Math.cos(ph)) / 2, pyp = (1 + Math.sin(th) * Math.sin(ph)) / 2;
    const bars = [['P(↑z)', pz], ['P(+x)', pxp], ['P(+y)', pyp]];
    bars.forEach(([lab, p], k) => { const x = P.X(0.3 + 0.42 * k); c.fillStyle = 'color-mix(in srgb, ' + cssv('--c2') + ' 35%, transparent)'; c.fillRect(x, P.Y(-0.7 + 1.4 * p), 30, P.Y(-0.7) - P.Y(-0.7 + 1.4 * p)); P.text(lab, x - 4, P.Y(-0.7) + 16, cssv('--muted')); P.text(p.toFixed(2).replace('.', ','), x, P.Y(-0.7 + 1.4 * p) - 4, cssv('--ink')); });
    ro.innerHTML = texHTML('|\\chi\\rangle = \\cos\\tfrac{\\theta}{2}|\\uparrow\\rangle + e^{i\\varphi}\\sin\\tfrac{\\theta}{2}|\\downarrow\\rangle') + ' · ' + texHTML('\\langle S_z\\rangle = \\tfrac{\\hbar}{2}\\cos\\theta = ' + (Math.cos(th) / 2).toFixed(3).replace('.', '{,}') + '\\hbar') + (cnt.z[0] + cnt.z[1] + cnt.x[0] + cnt.x[1] ? ' · Stern-Gerlach z: ' + cnt.z[0] + '× ↑, ' + cnt.z[1] + '× ↓; x: ' + cnt.x[0] + '× +, ' + cnt.x[1] + '× −' : '');
  };
  P.redraw = draw;
  slider(ctrl, 'Polarwinkel θ', 0, 3.1416, 0.01, th, v => { th = v; cnt.z = [0, 0]; cnt.x = [0, 0]; draw(); });
  slider(ctrl, 'Azimut φ', 0, 6.2832, 0.01, ph, v => { ph = v; cnt.z = [0, 0]; cnt.x = [0, 0]; draw(); });
  const sg = ax => { const p = ax === 'z' ? Math.cos(th / 2) ** 2 : (1 + Math.sin(th) * Math.cos(ph)) / 2; for (let i = 0; i < 100; i++) cnt[ax][R() < p ? 0 : 1]++; draw(); };
  const b1 = h('button', {class:'btn btn-sm', type:'button'}, '100 Teilchen, Magnet in z'); b1.onclick = () => sg('z');
  const b2 = h('button', {class:'btn btn-sm', type:'button'}, '100 Teilchen, Magnet in x'); b2.onclick = () => sg('x');
  ctrl.append(h('label', {}, 'Stern-Gerlach-Versuch', h('div', {class:'row'}, b1, b2)));
  draw();
};

/* Störungstheorie: Kasten mit Stufe V0 auf der linken Hälfte */
LABS.perturb = (el, L, o) => {
  const {P, ctrl, ro} = labShell(el, 0.55);
  let v0 = labInit(o).v0 ?? 2; // in Einheiten von E1
  const NB = 40;
  // Matrixelemente V_nm = V0 * 2/L ∫_0^{L/2} sin(nπx/L) sin(mπx/L) dx
  const Vnm = (n, m) => { if (n === m) return 0.5; const a = (n - m), b = (n + m); const f = k => Math.sin(k * Math.PI / 2) / (k * Math.PI); return f(a) - f(b); };
  const eig = () => {
    const A = []; for (let i = 0; i < NB; i++){ A.push([]); for (let j = 0; j < NB; j++) A[i].push((i === j ? (i + 1) * (i + 1) : 0) + v0 * Vnm(i + 1, j + 1)); }
    // Jacobi-Verfahren
    const n = NB; for (let sweep = 0; sweep < 60; sweep++){ let off = 0; for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q]; if (off < 1e-20) break;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++){ if (Math.abs(A[p][q]) < 1e-14) continue; const th = (A[q][q] - A[p][p]) / (2 * A[p][q]); const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)); const c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < n; k++){ const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
        for (let k = 0; k < n; k++){ const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; } } }
    return A.map((r, i) => r[i]).sort((a, b) => a - b);
  };
  const draw = () => {
    const ex = eig();
    const ymax = Math.max(12, Math.ceil(Math.max(ex[2], 9 + v0 / 2) * 1.12));
    P.frame(0, 3.5, 0, ymax, {nx:7, ny:6, xl:'', yl:'E / E₁', fx:() => '', fy:v => String(Math.round(v * 10) / 10).replace('.', ',')});
    for (let k = 1; k <= 3; k++){
      const e0 = k * k, e1 = e0 + v0 / 2;
      P.hline(e0, 0.2, 1.0, cssv('--grid-strong'), 1.4, k === 1 ? 'ungestört' : '');
      P.hline(e1, 1.3, 2.1, cssv('--c4'), 2, k === 1 ? '1. Ordnung' : '');
      P.hline(ex[k - 1], 2.4, 3.2, cssv('--c2'), 2.4, k === 1 ? 'exakt' : '');
    }
    ro.innerHTML = 'Störung ' + texHTML('V(x) = V_0') + ' für ' + texHTML('0 < x < L/2') + ', ' + texHTML('V_0 = ' + v0.toFixed(1).replace('.', '{,}') + 'E_1') + ' · 1. Ordnung: ' + texHTML('E_n^{(1)} = \\langle n|V|n\\rangle = V_0/2') + ' · Grundzustand exakt ' + ex[0].toFixed(3).replace('.', ',') + ' E₁, 1. Ordnung ' + (1 + v0 / 2).toFixed(3).replace('.', ',') + ' E₁';
  };
  P.redraw = draw;
  slider(ctrl, 'Stärke V₀ / E₁', 0, 8, 0.1, v0, v => { v0 = v; draw(); });
  draw();
};
