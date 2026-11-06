/* ===== Labore für das Kapitel Mathematische Grundlagen ===== */
const tf = (v, d) => (isFinite(v) ? v.toFixed(d === undefined ? 3 : d) : '∞').replace('-', '−').replace('.', '{,}');
function simpson(f, a, b, n){ n = n || 2000; if (n % 2) n++; const hh = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * hh); return s * hh / 3; }
function arrowTo(P, x0, y0, x1, y1, col, lw, label){
  const c = P.c; const X0 = P.X(x0), Y0 = P.Y(y0), X1 = P.X(x1), Y1 = P.Y(y1);
  c.strokeStyle = col; c.fillStyle = col; c.lineWidth = lw || 2.4; c.setLineDash([]);
  c.beginPath(); c.moveTo(X0, Y0); c.lineTo(X1, Y1); c.stroke();
  const L = Math.hypot(X1 - X0, Y1 - Y0);
  if (L > 3){ const ux = (X1 - X0) / L, uy = (Y1 - Y0) / L, s = Math.min(10, L / 2.5); c.beginPath(); c.moveTo(X1, Y1); c.lineTo(X1 - s * ux - s * 0.45 * uy, Y1 - s * uy + s * 0.45 * ux); c.lineTo(X1 - s * ux + s * 0.45 * uy, Y1 - s * uy - s * 0.45 * ux); c.closePath(); c.fill(); }
  if (label) P.text(label, X1 + 6, Y1 - 6, col);
}
/* runde Teilstriche */
function niceStep(raw){ const p = Math.pow(10, Math.floor(Math.log10(raw))); for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= raw * (1 - 1e-9)) return m * p; return 10 * p; }
function niceFrame(P, x0, x1, y0, y1, opt){
  const st = niceStep((y1 - y0) / 5);
  const Y0 = Math.floor(y0 / st + 1e-9) * st, Y1 = Math.ceil(y1 / st - 1e-9) * st;
  P.frame(x0, x1, Y0, Y1, Object.assign({}, opt || {}, {ny:Math.max(1, Math.round((Y1 - Y0) / st)), fy:v => fmtTick(Math.round(v / st) * st)}));
}
/* gleich lange Einheiten auf beiden Achsen, Gitter im Abstand step */
function squareFrame(P, xr, step, opt){
  const yr = xr * (P.h - 42) / (P.w - 58);
  P.frame(-xr, xr, -yr, yr, Object.assign({nx:1, ny:1, fx:() => '', fy:() => ''}, opt || {}));
  const c = P.c; c.lineWidth = 1; c.font = '12px "Source Sans 3", sans-serif';
  const n0 = Math.ceil(-xr / step - 1e-9), n1 = Math.floor(xr / step + 1e-9), m0 = Math.ceil(-yr / step - 1e-9), m1 = Math.floor(yr / step + 1e-9);
  for (let i = n0; i <= n1; i++){ const X = P.X(i * step); c.strokeStyle = cssv('--grid'); c.beginPath(); c.moveTo(X, P.pt); c.lineTo(X, P.h - P.pb); c.stroke(); c.fillStyle = cssv('--muted'); c.textAlign = 'center'; c.fillText(fmtTick(i * step), X, P.h - P.pb + 16); }
  for (let j = m0; j <= m1; j++){ const Y = P.Y(j * step); c.strokeStyle = cssv('--grid'); c.beginPath(); c.moveTo(P.pl, Y); c.lineTo(P.w - P.pr, Y); c.stroke(); c.fillStyle = cssv('--muted'); c.textAlign = 'right'; c.fillText(fmtTick(j * step), P.pl - 6, Y + 4); }
  c.strokeStyle = cssv('--axis'); c.lineWidth = 1.2;
  c.beginPath(); c.moveTo(P.pl, P.Y(0)); c.lineTo(P.w - P.pr, P.Y(0)); c.stroke();
  c.beginPath(); c.moveTo(P.X(0), P.pt); c.lineTo(P.X(0), P.h - P.pb); c.stroke();
  return yr;
}
const showIf = (inp, on) => { const l = inp.closest('label'); if (l) l.style.display = on ? '' : 'none'; };

/* δ-Folgen: ∫ δ_ε(x − a) f(x) dx → f(a) */
LABS.delta = (el, L, o) => {
  const I = labInit(o);
  const {P, ctrl, ro} = labShell(el, 0.55);
  const FORMS = {
    gauss:{name:'Gauß', f:(x, e) => Math.exp(-x * x / (2 * e * e)) / (Math.sqrt(2 * Math.PI) * e), tex:'\\delta_\\varepsilon(x) = \\frac{1}{\\sqrt{2\\pi}\\,\\varepsilon}e^{-x^2/(2\\varepsilon^2)}', peak:e => 1 / (Math.sqrt(2 * Math.PI) * e)},
    lorentz:{name:'Lorentz', f:(x, e) => e / (Math.PI * (x * x + e * e)), tex:'\\delta_\\varepsilon(x) = \\frac{\\varepsilon}{\\pi(x^2 + \\varepsilon^2)}', peak:e => 1 / (Math.PI * e)},
    rect:{name:'Rechteck', f:(x, e) => Math.abs(x) < e ? 1 / (2 * e) : 0, tex:'\\delta_\\varepsilon(x) = \\tfrac{1}{2\\varepsilon}\\text{ für }|x| < \\varepsilon,\\ \\text{sonst }0', peak:e => 1 / (2 * e)}
  };
  const FUNCS = {
    cos:{name:'cos x', f:x => Math.cos(x), tex:'\\cos x'},
    gx:{name:'(1 + x)·e^(−x²)', f:x => (1 + x) * Math.exp(-x * x), tex:'(1+x)e^{-x^2}'},
    lo:{name:'1/(1 + x²)', f:x => 1 / (1 + x * x), tex:'\\frac{1}{1+x^2}'}
  };
  let form = I.form in FORMS ? I.form : 'gauss', fn = I.fn in FUNCS ? I.fn : 'cos', eps = I.eps ?? 0.5, a = I.a ?? 0;
  // Integral mit angepasster Substitution, damit auch die langsam abfallende Lorentz-Form genau wird
  const integral = (g) => {
    if (form === 'lorentz' && g === FUNCS.cos.f) return Math.exp(-eps) * Math.cos(a); // exakt; numerisch schwierig wegen der Schwingungen in den langen Ausläufern
    if (form === 'gauss') return simpson(u => Math.exp(-u * u / 2) / Math.sqrt(2 * Math.PI) * g(a + eps * u), -10, 10, 2000);
    if (form === 'rect') return simpson(u => 0.5 * g(a + eps * u), -1, 1, 400);
    return simpson(th => g(a + eps * Math.tan(th)) / Math.PI, -Math.PI / 2 + 1e-9, Math.PI / 2 - 1e-9, 20000);
  };
  const draw = () => {
    const D = FORMS[form], F = FUNCS[fn];
    const pk = D.peak(eps);
    const d = x => D.f(x - a, eps);
    let lo = 0, hi = pk; for (let i = 0; i <= 600; i++){ const x = -3 + 6 * i / 600, fv = F.f(x), pv = d(x) * fv; lo = Math.min(lo, fv, pv); hi = Math.max(hi, fv, pv); }
    niceFrame(P, -3, 3, lo - 0.08 * (hi - lo), hi * 1.08, {nx:12, xl:'x', lx:2});
    P.fill(x => d(x) * F.f(x), -3, 3, 'color-mix(in srgb, ' + cssv('--c2') + ' 22%, transparent)');
    P.curve(F.f, cssv('--c3'), 2, 400);
    P.curve(d, cssv('--c2'), 2.6, 1200);
    P.vline(a, cssv('--c1'), [5, 4], 'a');
    const I = integral(F.f), fa = F.f(a), N1 = integral(() => 1);
    ro.innerHTML = texHTML(D.tex) + ' · ' + texHTML('\\int \\delta_\\varepsilon(x-a)\\,f(x)\\,dx \\approx ' + tf(I, 4) + ',\\quad f(a) = ' + tf(fa, 4) + ',\\quad \\text{Abweichung } ' + tf(Math.abs(I - fa), 4)) + ' · ' + texHTML('\\int\\delta_\\varepsilon\\,dx = ' + tf(N1, 3)) + ' · grün: ' + texHTML('f(x) = ' + F.tex) + ', blaue Fläche: ' + texHTML('\\delta_\\varepsilon(x-a)f(x)');
  };
  P.redraw = draw;
  selectBox(ctrl, 'Form von δ_ε', Object.entries(FORMS).map(([k, v]) => [k, v.name]), v => { form = v; draw(); }, form);
  selectBox(ctrl, 'Testfunktion f', Object.entries(FUNCS).map(([k, v]) => [k, v.name]), v => { fn = v; draw(); }, fn);
  slider(ctrl, 'Breite ε', 0.05, 1, 0.01, eps, v => { eps = v; draw(); });
  slider(ctrl, 'Verschiebung a', -2, 2, 0.01, a, v => { a = v; draw(); });
  draw();
};

/* Vektor in einer gedrehten Orthonormalbasis */
LABS.vectors = (el, L, o) => {
  const I = labInit(o);
  const {P, ctrl, ro} = labShell(el, 0.62);
  let v1 = I.v1 ?? 1.6, v2 = I.v2 ?? 0.6, phi = I.phi ?? 55;
  const draw = () => {
    squareFrame(P, 2.6, 0.5, {xl:'1', yl:'2'});
    const f = phi * Math.PI / 180, c = Math.cos(f), s = Math.sin(f);
    const e1 = [c, s], e2 = [-s, c];
    const c1 = e1[0] * v1 + e1[1] * v2, c2 = e2[0] * v1 + e2[1] * v2;
    const k = P.c;
    // Achsen der neuen Basis (dünn)
    k.strokeStyle = cssv('--grid-strong'); k.lineWidth = 1; k.setLineDash([2, 4]);
    for (const e of [e1, e2]){ k.beginPath(); k.moveTo(P.X(-4 * e[0]), P.Y(-4 * e[1])); k.lineTo(P.X(4 * e[0]), P.Y(4 * e[1])); k.stroke(); }
    // Projektionen
    k.strokeStyle = cssv('--muted'); k.setLineDash([5, 4]); k.lineWidth = 1.2;
    for (const [cc, e] of [[c1, e1], [c2, e2]]){ k.beginPath(); k.moveTo(P.X(v1), P.Y(v2)); k.lineTo(P.X(cc * e[0]), P.Y(cc * e[1])); k.stroke(); }
    k.setLineDash([]);
    arrowTo(P, 0, 0, c1 * e1[0], c1 * e1[1], 'color-mix(in srgb, ' + cssv('--c3') + ' 55%, transparent)', 5);
    arrowTo(P, 0, 0, c2 * e2[0], c2 * e2[1], 'color-mix(in srgb, ' + cssv('--c4') + ' 55%, transparent)', 5);
    arrowTo(P, 0, 0, e1[0], e1[1], cssv('--c3'), 2.4, "e'₁");
    arrowTo(P, 0, 0, e2[0], e2[1], cssv('--c4'), 2.4, "e'₂");
    arrowTo(P, 0, 0, v1, v2, cssv('--c2'), 2.8, 'v');
    ro.innerHTML = texHTML("c_1 = \\langle e'_1|v\\rangle = " + tf(c1, 3) + ",\\quad c_2 = \\langle e'_2|v\\rangle = " + tf(c2, 3)) + ' · ' + texHTML('c_1^2 + c_2^2 = ' + tf(c1 * c1 + c2 * c2, 3) + ' = |v|^2 = v_1^2 + v_2^2 = ' + tf(v1 * v1 + v2 * v2, 3)) + ' · ' + texHTML("v = c_1e'_1 + c_2e'_2");
  };
  P.redraw = draw;
  slider(ctrl, 'Komponente v₁', -2, 2, 0.01, v1, v => { v1 = v; draw(); });
  slider(ctrl, 'Komponente v₂', -2, 2, 0.01, v2, v => { v2 = v; draw(); });
  slider(ctrl, 'Drehwinkel φ der Basis (Grad)', 0, 180, 1, phi, v => { phi = v; draw(); });
  draw();
};

/* symmetrische 2×2-Matrix: Einheitskreis → Ellipse, Eigenvektoren */
LABS.eigen = (el, L, o) => {
  const I = labInit(o);
  const {P, ctrl, ro} = labShell(el, 0.62);
  let a = I.a ?? 1.5, b = I.b ?? 0.6, d = I.d ?? 0.5;
  const draw = () => {
    squareFrame(P, 4.4, 1, {xl:'1', yl:'2'});
    const k = P.c;
    const A = (x, y) => [a * x + b * y, b * x + d * y];
    k.strokeStyle = cssv('--grid-strong'); k.lineWidth = 1.6; k.beginPath(); k.arc(P.X(0), P.Y(0), P.X(1) - P.X(0), 0, 2 * Math.PI); k.stroke();
    // Bild des Einheitskreises
    k.strokeStyle = cssv('--c2'); k.lineWidth = 2.4; k.beginPath();
    for (let i = 0; i <= 200; i++){ const t = 2 * Math.PI * i / 200; const [X, Y] = A(Math.cos(t), Math.sin(t)); if (i) k.lineTo(P.X(X), P.Y(Y)); else k.moveTo(P.X(X), P.Y(Y)); }
    k.stroke();
    // einige Vektoren u und ihre Bilder Au
    for (let i = 0; i < 16; i++){
      const t = 2 * Math.PI * i / 16, ux = Math.cos(t), uy = Math.sin(t); const [X, Y] = A(ux, uy);
      k.strokeStyle = cssv('--grid-strong'); k.lineWidth = 1; k.beginPath(); k.moveTo(P.X(ux), P.Y(uy)); k.lineTo(P.X(X), P.Y(Y)); k.stroke();
      k.fillStyle = cssv('--c2'); k.beginPath(); k.arc(P.X(X), P.Y(Y), 2.6, 0, 7); k.fill();
    }
    const m = (a + d) / 2, r = Math.sqrt(((a - d) / 2) ** 2 + b * b), lp = m + r, lm = m - r;
    const th = 0.5 * Math.atan2(2 * b, a - d);
    const ep = [Math.cos(th), Math.sin(th)], em = [-Math.sin(th), Math.cos(th)];
    k.setLineDash([3, 4]); k.lineWidth = 1.2;
    for (const [e, col] of [[ep, cssv('--c1')], [em, cssv('--c3')]]){ k.strokeStyle = col; k.beginPath(); k.moveTo(P.X(-6 * e[0]), P.Y(-6 * e[1])); k.lineTo(P.X(6 * e[0]), P.Y(6 * e[1])); k.stroke(); }
    k.setLineDash([]);
    arrowTo(P, 0, 0, lp * ep[0], lp * ep[1], cssv('--c1'), 2.8, 'λ₊e₊');
    arrowTo(P, 0, 0, lm * em[0], lm * em[1], cssv('--c3'), 2.8, 'λ₋e₋');
    const degen = r < 1e-9;
    ro.innerHTML = texHTML('A = \\begin{pmatrix}' + tf(a, 2) + ' & ' + tf(b, 2) + '\\\\ ' + tf(b, 2) + ' & ' + tf(d, 2) + '\\end{pmatrix}') + ' · ' + texHTML('\\lambda_\\pm = \\frac{a+d}{2} \\pm \\sqrt{\\left(\\frac{a-d}{2}\\right)^2 + b^2}:\\ \\lambda_+ = ' + tf(lp, 3) + ',\\ \\lambda_- = ' + tf(lm, 3)) + ' · ' + texHTML('\\operatorname{tr}A = ' + tf(a + d, 3) + ' = \\lambda_+ + \\lambda_-,\\quad \\det A = ' + tf(a * d - b * b, 3) + ' = \\lambda_+\\lambda_-') + ' · ' + (degen ? '<b>entartet:</b> jeder Vektor ist Eigenvektor' : 'Eigenvektoren senkrecht: ' + texHTML('\\langle e_+|e_-\\rangle = 0') + ', Winkel von e₊ zur 1-Achse ' + Math.round(th * 180 / Math.PI) + '°');
  };
  P.redraw = draw;
  slider(ctrl, 'a (oben links)', -2, 2, 0.01, a, v => { a = v; draw(); });
  slider(ctrl, 'b (Nebendiagonale)', -2, 2, 0.01, b, v => { b = v; draw(); });
  slider(ctrl, 'd (unten rechts)', -2, 2, 0.01, d, v => { d = v; draw(); });
  draw();
};

/* Entwicklung nach φ_n = √(2/L) sin(nπx/L) auf [0, L] (L = 1) */
LABS.expand = (el, L, o) => {
  const I = labInit(o);
  const {P, ctrl, ro} = labShell(el, 0.5);
  const Q = plotCanvas(el, 0.22); el.insertBefore(Q.cv, ctrl);
  const pi = Math.PI, S2 = Math.SQRT2;
  const F = {
    par:{name:'Parabel x(L − x)', f:x => x * (1 - x), c:n => S2 * 2 * (1 - (n % 2 ? -1 : 1)) / Math.pow(n * pi, 3), norm:1 / 30, tex:'f = x(L-x)'},
    tent:{name:'Zelt (Dreieck)', f:x => x < 0.5 ? x : 1 - x, c:n => S2 * 2 * Math.sin(n * pi / 2) / Math.pow(n * pi, 2), norm:1 / 12, tex:'f = \\text{Zelt mit Spitze } L/2'},
    step:{name:'Stufe (1 für x < L/2)', f:x => x < 0.5 ? 1 : 0, c:n => S2 * (1 - Math.cos(n * pi / 2)) / (n * pi), norm:0.5, tex:'f = 1 \\text{ für } x < L/2,\\ \\text{sonst } 0'},
    one:{name:'Konstante 1', f:() => 1, c:n => S2 * (1 - (n % 2 ? -1 : 1)) / (n * pi), norm:1, tex:'f = 1'}
  };
  let key = I.key in F ? I.key : 'par', N = I.N ?? 3;
  const draw = () => {
    const G = F[key];
    const cs = []; for (let n = 1; n <= 30; n++) cs.push(G.c(n));
    const SN = x => { let s = 0; for (let n = 1; n <= N; n++) s += cs[n - 1] * S2 * Math.sin(n * pi * x); return s; };
    const fmax = key === 'par' ? 0.25 : key === 'tent' ? 0.5 : 1;
    niceFrame(P, 0, 1, -0.25 * fmax, fmax * 1.3, {nx:10, xl:'x / L', lx:2});
    P.curve(G.f, cssv('--c3'), 2.2, 800, [6, 4]);
    P.curve(SN, cssv('--c2'), 2.6, 1200);
    // Balken |c_n|²
    Q.fit();
    const w2 = cs.map(c => c * c), wm = Math.max(...w2);
    // logarithmische Skala über 8 Zehnerpotenzen, damit auch kleine Beiträge sichtbar sind
    const lg = v => v > 0 ? Math.max(0, Math.log10(v / wm) + 8) : 0;
    const sup = e => String(e).replace('-', '⁻').replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
    Q.frame(0.5, 30.5, 0, 8, {nx:30, ny:4, lx:31, fx:() => '', fy:v => Math.round(v) === 8 ? '1' : '10' + sup(Math.round(v - 8))});
    for (const n of [1, 5, 10, 15, 20, 25, 30]) Q.text(String(n), Q.X(n), Q.h - Q.pb + 16, cssv('--muted'), 'center');
    for (let n = 1; n <= 30; n++){ const X0 = Q.X(n - 0.38), X1 = Q.X(n + 0.38); Q.c.fillStyle = n <= N ? cssv('--c2') : cssv('--grid-strong'); Q.c.fillRect(X0, Q.Y(lg(w2[n - 1])), X1 - X0, Q.Y(0) - Q.Y(lg(w2[n - 1]))); }
    const sum = w2.slice(0, N).reduce((s, v) => s + v, 0);
    ro.innerHTML = texHTML(G.tex) + ' (grün, gestrichelt) · blau: ' + texHTML('S_N = \\sum_{n=1}^{N} c_n\\varphi_n,\\ \\varphi_n = \\sqrt{2/L}\\sin(n\\pi x/L),\\ c_n = \\langle\\varphi_n|f\\rangle') + ' · ' + texHTML('\\sum_{n=1}^{' + N + '}|c_n|^2 = ' + tf(sum, 5)) + ' von ' + texHTML('\\int_0^L|f|^2dx = ' + tf(G.norm, 5)) + ' → ' + (100 * sum / G.norm).toFixed(2).replace('.', ',') + ' % (Einheiten mit L = 1) · Balken: ' + texHTML('|c_n|^2') + ' relativ zum größten, logarithmisch (blau: in der Summe enthalten)';
  };
  P.redraw = draw;
  selectBox(ctrl, 'Funktion f', Object.entries(F).map(([k, v]) => [k, v.name]), v => { key = v; draw(); }, key);
  slider(ctrl, 'Zahl der Terme N', 1, 30, 1, N, v => { N = v; draw(); });
  draw();
};

/* Fourier-Reihe (Teilsummen, Gibbs) und Fourier-Transformation einer Gauß-Funktion */
LABS.fourier = (el, L, o) => {
  const I = labInit(o);
  const {P, ctrl, ro} = labShell(el, 0.5);
  const pi = Math.PI;
  const R = {
    rect:{name:'Rechteck', f:x => { const y = ((x % (2 * pi)) + 3 * pi) % (2 * pi) - pi; return y > 0 ? 1 : y < 0 ? -1 : 0; }, S:(x, N) => { let s = 0; for (let n = 1; n <= N; n += 2) s += 4 / (pi * n) * Math.sin(n * x); return s; }, y:[-1.6, 1.6], tex:'f(x) = \\operatorname{sgn} x:\\ \\ S_N = \\frac{4}{\\pi}\\sum_{n\\ \\text{ungerade}}^{N}\\frac{\\sin nx}{n}', jump:2, at:0},
    saw:{name:'Sägezahn', f:x => ((x % (2 * pi)) + 3 * pi) % (2 * pi) - pi, S:(x, N) => { let s = 0; for (let n = 1; n <= N; n++) s += 2 * (n % 2 ? 1 : -1) / n * Math.sin(n * x); return s; }, y:[-4.4, 4.4], tex:'f(x) = x:\\ \\ S_N = \\sum_{n=1}^{N}\\frac{2(-1)^{n+1}}{n}\\sin nx', jump:2 * pi, at:pi},
    tri:{name:'Dreieck', f:x => Math.abs(((x % (2 * pi)) + 3 * pi) % (2 * pi) - pi), S:(x, N) => { let s = pi / 2; for (let n = 1; n <= N; n += 2) s -= 4 / (pi * n * n) * Math.cos(n * x); return s; }, y:[-0.6, 3.9], tex:'f(x) = |x|:\\ \\ S_N = \\frac{\\pi}{2} - \\frac{4}{\\pi}\\sum_{n\\ \\text{ungerade}}^{N}\\frac{\\cos nx}{n^2}', jump:0}
  };
  let mode = I.mode === 'trafo' ? 'trafo' : 'reihe', key = I.key in R ? I.key : 'rect', N = I.N ?? 5, sg = I.sg ?? 1;
  const piTick = v => { const r = Math.round(v / pi * 2) / 2; return r === 0 ? '0' : (r === 1 ? '' : r === -1 ? '−' : String(r).replace('.', ',').replace('-', '−')) + 'π'; };
  const draw = () => {
    if (mode === 'reihe'){
      const G = R[key];
      P.frame(-2 * pi, 2 * pi, G.y[0], G.y[1], {nx:8, ny:4, xl:'x', lx:2, fx:piTick});
      P.curve(G.f, cssv('--c3'), 2, 1200, [6, 4]);
      P.curve(x => G.S(x, N), cssv('--c2'), 2.4, 2400);
      let txt = '';
      if (G.jump){
        // Maximum der Teilsumme kurz vor/nach der Sprungstelle
        let mx = -1e9; const lo = key === 'rect' ? 0 : pi / 2, hi = key === 'rect' ? pi / 2 : pi;
        for (let i = 1; i < 4000; i++){ const x = lo + (hi - lo) * i / 4000; mx = Math.max(mx, G.S(x, N)); }
        const top = key === 'rect' ? 1 : pi;
        const ov = 100 * (mx - top) / G.jump;
        txt = ov > 0 ? 'Überschwingen an der Sprungstelle: ' + texHTML('\\frac{\\max S_N - ' + (key === 'rect' ? '1' : '\\pi') + '}{\\text{Sprunghöhe}} \\approx ' + tf(ov, 1) + '\\,\\%') + ' (Grenzwert für N → ∞: ≈ 9 %' + (key === 'saw' ? '; der Sägezahn nähert sich ihm langsamer' : '') + ')' : 'Das Maximum der Teilsumme liegt noch unter ' + (key === 'rect' ? '1' : 'π') + ' – für größeres N schwingt sie über (Grenzwert ≈ 9 % der Sprunghöhe).';
      } else {
        let md = 0; for (let i = 0; i <= 2000; i++){ const x = -pi + 2 * pi * i / 2000; md = Math.max(md, Math.abs(G.S(x, N) - G.f(x))); }
        txt = 'größte Abweichung ' + texHTML('\\max|S_N - f| \\approx ' + tf(md, 4)) + ' (stetige Funktion: kein Überschwingen)';
      }
      ro.innerHTML = texHTML(G.tex) + ' · höchste Ordnung N = ' + N + (key !== 'saw' ? ' (nur ungerade n tragen bei)' : '') + ' · ' + txt + ' · grün gestrichelt: f, periodisch fortgesetzt';
    } else {
      const psi2 = x => Math.exp(-x * x / (2 * sg * sg)) / Math.sqrt(2 * pi * sg * sg);
      const phi2 = k => Math.sqrt(2 / pi) * sg * Math.exp(-2 * sg * sg * k * k);
      const y1 = Math.max(1 / Math.sqrt(2 * pi * sg * sg), Math.sqrt(2 / pi) * sg) * 1.15;
      P.frame(-6, 6, 0, y1, {nx:12, ny:4, xl:'x bzw. k', lx:2});
      const dk = 1 / (2 * sg);
      P.c.fillStyle = 'color-mix(in srgb, ' + cssv('--c2') + ' 12%, transparent)'; P.c.fillRect(P.X(-sg), P.pt, P.X(sg) - P.X(-sg), P.h - P.pt - P.pb);
      P.c.fillStyle = 'color-mix(in srgb, ' + cssv('--c1') + ' 12%, transparent)'; P.c.fillRect(P.X(-dk), P.pt, P.X(dk) - P.X(-dk), P.h - P.pt - P.pb);
      P.curve(psi2, cssv('--c2'), 2.6, 800);
      P.curve(phi2, cssv('--c1'), 2.6, 800);
      ro.innerHTML = 'blau: ' + texHTML('|\\psi(x)|^2,\\ \\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}') + ' · rot: ' + texHTML('|\\varphi(k)|^2,\\ \\varphi(k) = \\tfrac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx = \\left(\\tfrac{2\\sigma^2}{\\pi}\\right)^{1/4}e^{-\\sigma^2k^2}') + ' · ' + texHTML('\\Delta x = \\sigma = ' + tf(sg, 2) + ',\\quad \\Delta k = \\frac{1}{2\\sigma} = ' + tf(dk, 3) + ',\\quad \\Delta x\\,\\Delta k = ' + tf(sg * dk, 3));
    }
  };
  P.redraw = draw;
  const mSel = selectBox(ctrl, 'Modus', [['reihe', 'Fourier-Reihe'], ['trafo', 'Fourier-Transformation (Gauß)']], v => { mode = v; upd(); draw(); }, mode);
  const fSel = selectBox(ctrl, 'Funktion', Object.entries(R).map(([k, v]) => [k, v.name]), v => { key = v; draw(); }, key);
  const nIn = slider(ctrl, 'höchste Ordnung N', 1, 40, 1, N, v => { N = v; draw(); });
  const sIn = slider(ctrl, 'Breite σ', 0.3, 3, 0.01, sg, v => { sg = v; draw(); });
  const upd = () => { showIf(fSel, mode === 'reihe'); showIf(nIn, mode === 'reihe'); showIf(sIn, mode === 'trafo'); };
  void mSel; upd();
  draw();
};

/* Anfangswertproblem y'' = ∓k²y, y(0) = 0, y'(0) = 1: wann gilt y(1) = 0? */
LABS.ode = (el, L, o) => {
  const I = labInit(o);
  const {P, ctrl, ro} = labShell(el, 0.5);
  let eq = I.eq === 'exp' ? 'exp' : 'osc', k = I.k ?? 2;
  const y = x => eq === 'osc' ? (k < 1e-9 ? x : Math.sin(k * x) / k) : (k < 1e-9 ? x : Math.sinh(k * x) / k);
  const draw = () => {
    let ym = 0; for (let i = 0; i <= 200; i++) ym = Math.max(ym, Math.abs(y(i / 200)));
    ym = Math.max(0.1, ym * 1.15);
    niceFrame(P, 0, 1, -ym, ym, {nx:10, xl:'x', lx:2});
    P.curve(y, cssv('--c2'), 2.6, 800);
    const y1 = y(1);
    const hit = eq === 'osc' && k > 0.5 && Math.abs(Math.sin(k)) < 0.01;
    P.c.fillStyle = hit ? cssv('--good') : cssv('--c1'); P.c.beginPath(); P.c.arc(P.X(1), P.Y(y1), 5, 0, 7); P.c.fill();
    const n = Math.round(k / Math.PI);
    const sol = eq === 'osc' ? 'y(x) = \\frac{\\sin kx}{k}' : 'y(x) = \\frac{\\sinh kx}{k}';
    ro.innerHTML = texHTML((eq === 'osc' ? "y'' = -k^2y" : "y'' = +k^2y") + ',\\ y(0) = 0,\\ y\'(0) = 1:\\ \\ ' + sol) + ' · ' + texHTML('y(1) = ' + tf(y1, 4)) + ' · ' + (eq === 'osc' ? (hit ? '<b>Randbedingung y(1) = 0 erfüllt</b>: ' + texHTML('k \\approx ' + n + '\\pi = ' + tf(n * Math.PI, 3)) : 'Randbedingung y(1) = 0 nicht erfüllt. Eigenwerte: ' + texHTML('k = n\\pi \\approx 3{,}14;\\ 6{,}28;\\ 9{,}42')) : 'Hier ist y(1) > 0 für jedes k: keine Lösung außer y = 0 erfüllt y(0) = y(1) = 0.');
  };
  P.redraw = draw;
  selectBox(ctrl, 'Gleichung', [['osc', "y'' = −k²y"], ['exp', "y'' = +k²y"]], v => { eq = v; draw(); }, eq);
  slider(ctrl, 'k', 0, 12, 0.01, k, v => { k = v; draw(); });
  draw();
};

/* Hermite, Legendre, Laguerre: Bild, Nullstellen, Orthogonalität */
LABS.special = (el, L, o) => {
  const I = labInit(o);
  const {P, ctrl, ro} = labShell(el, 0.55);
  const fact = n => n < 2 ? 1 : n * fact(n - 1);
  const rec = {
    hermite:(n, x) => { let p0 = 1, p1 = 2 * x; if (n === 0) return 1; for (let k = 1; k < n; k++){ const p2 = 2 * x * p1 - 2 * k * p0; p0 = p1; p1 = p2; } return p1; },
    legendre:(n, x) => { let p0 = 1, p1 = x; if (n === 0) return 1; for (let k = 1; k < n; k++){ const p2 = ((2 * k + 1) * x * p1 - k * p0) / (k + 1); p0 = p1; p1 = p2; } return p1; },
    laguerre:(n, x) => { let p0 = 1, p1 = 1 - x; if (n === 0) return 1; for (let k = 1; k < n; k++){ const p2 = ((2 * k + 1 - x) * p1 - k * p0) / (k + 1); p0 = p1; p1 = p2; } return p1; }
  };
  const TEX = {
    hermite:['1', '2x', '4x^2 - 2', '8x^3 - 12x', '16x^4 - 48x^2 + 12', '32x^5 - 160x^3 + 120x'],
    legendre:['1', 'x', '\\tfrac12(3x^2 - 1)', '\\tfrac12(5x^3 - 3x)', '\\tfrac18(35x^4 - 30x^2 + 3)', '\\tfrac18(63x^5 - 70x^3 + 15x)'],
    laguerre:['1', '1 - x', '\\tfrac12(x^2 - 4x + 2)', '\\tfrac16(-x^3 + 9x^2 - 18x + 6)', '\\tfrac1{24}(x^4 - 16x^3 + 72x^2 - 96x + 24)', '\\tfrac1{120}(-x^5 + 25x^4 - 200x^3 + 600x^2 - 600x + 120)']
  };
  const FAM = {
    hermite:{name:'Hermite-Funktionen', sym:'H', x:[-5, 5], y:[-0.9, 0.9], ny:6, plot:(n, x) => rec.hermite(n, x) * Math.exp(-x * x / 2) / Math.sqrt(Math.sqrt(Math.PI) * Math.pow(2, n) * fact(n)), plotTex:n => 'u_{' + n + '}(x) = \\frac{H_{' + n + '}(x)\\,e^{-x^2/2}}{\\sqrt{\\sqrt\\pi\\,2^{' + n + '}\\,' + n + '!}}', w:x => Math.exp(-x * x), I:[-10, 10], wTex:(n, m) => '\\int_{-\\infty}^{\\infty} H_{' + n + '}H_{' + m + '}\\,e^{-x^2}dx', norm:n => Math.sqrt(Math.PI) * Math.pow(2, n) * fact(n), normTex:'\\sqrt\\pi\\,2^n n!'},
    legendre:{name:'Legendre-Polynome', sym:'P', x:[-1, 1], y:[-1.2, 1.2], ny:6, plot:(n, x) => rec.legendre(n, x), plotTex:n => 'P_{' + n + '}(x)', w:() => 1, I:[-1, 1], wTex:(n, m) => '\\int_{-1}^{1} P_{' + n + '}P_{' + m + '}\\,dx', norm:n => 2 / (2 * n + 1), normTex:'\\frac{2}{2n+1}'},
    laguerre:{name:'Laguerre-Polynome', sym:'L', x:[0, 25], y:[-1.2, 1.2], ny:6, plot:(n, x) => rec.laguerre(n, x) * Math.exp(-x / 2), plotTex:n => 'L_{' + n + '}(x)\\,e^{-x/2}', w:x => Math.exp(-x), I:[0, 90], wTex:(n, m) => '\\int_0^{\\infty} L_{' + n + '}L_{' + m + '}\\,e^{-x}dx', norm:() => 1, normTex:'1'}
  };
  let fam = I.fam in FAM ? I.fam : 'hermite', n = I.n ?? 2, m = I.m ?? 3;
  const draw = () => {
    const F = FAM[fam];
    P.frame(F.x[0], F.x[1], F.y[0], F.y[1], {nx:10, ny:F.ny, xl:'x', lx:2});
    if (m !== n) P.curve(x => F.plot(m, x), cssv('--c1'), 1.6, 800, [5, 4]);
    P.curve(x => F.plot(n, x), cssv('--c2'), 2.6, 800);
    // Nullstellen von f_n zählen und markieren
    let zeros = 0, prev = F.plot(n, F.x[0] + 1e-9);
    for (let i = 1; i <= 4000; i++){ const x = F.x[0] + (F.x[1] - F.x[0]) * i / 4000; const v = F.plot(n, x); if (v * prev < 0){ zeros++; P.c.fillStyle = cssv('--c2'); P.c.beginPath(); P.c.arc(P.X(x), P.Y(0), 4, 0, 7); P.c.fill(); } if (v !== 0) prev = v; }
    const I = simpson(x => rec[fam](n, x) * rec[fam](m, x) * F.w(x), F.I[0], F.I[1], 8000);
    const exp = n === m ? F.norm(n) : 0;
    ro.innerHTML = 'blau: ' + texHTML(F.plotTex(n)) + ' mit ' + texHTML(F.sym + '_' + n + '(x) = ' + TEX[fam][n]) + ' · Nullstellen: <b>' + zeros + '</b> (= Grad ' + n + ')' + (m !== n ? ' · rot gestrichelt: m = ' + m : '') + ' · ' + texHTML(F.wTex(n, m) + ' \\approx ' + tf(Math.abs(I) < 5e-7 ? 0 : I, 4)) + (n === m ? ' (erwartet ' + texHTML(F.normTex + ' = ' + tf(exp, 4)) + ')' : ' (erwartet 0: orthogonal)');
  };
  P.redraw = draw;
  selectBox(ctrl, 'Familie', Object.entries(FAM).map(([k, v]) => [k, v.name]), v => { fam = v; draw(); }, fam);
  slider(ctrl, 'Grad n', 0, 5, 1, n, v => { n = v; draw(); });
  slider(ctrl, 'Vergleich m', 0, 5, 1, m, v => { m = v; draw(); });
  draw();
};
