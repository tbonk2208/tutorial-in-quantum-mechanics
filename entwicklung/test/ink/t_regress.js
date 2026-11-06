/* Regressionstests zu den Korrekturen nach der Prüfung mit echten CROHME-Ausdrücken (Bericht /home/claude/ink/check/REPORT.md).
   Ohne fremde Daten: Zeichen als einfache Strichformen mit bekannter Klasse (Orakel), dazu Ausgabe-Fälle direkt über genText.
   node test/ink/t_regress.js [--verbose] */
const lib = require('./lib.js');
const E = lib.load({model:'oracle', content:false});
const I = E.INKR._int;
const verbose = process.argv.includes('--verbose');
let nErr = 0, nOk = 0;
const nrm = t => { try { return E.texLine(E.parseLine(t, {})).replace(/\\left|\\right|\\,|\s+/g, ''); } catch(e){ return 'ERR:' + t; } };
const check = (name, got, want) => {
  const ok = Array.isArray(want) ? want.some(w => nrm(got) === nrm(w)) : nrm(got) === nrm(want);
  if (ok) nOk++; else { nErr++; console.log('FEHLER', name, '| erkannt:', JSON.stringify(got), '| erwartet:', JSON.stringify(want)); }
  if (verbose && ok) console.log('ok', name, JSON.stringify(got));
};

/* ---------- einfache Strichformen (y nach unten), Klasse über das Orakel ---------- */
let G = 0;
const tag = (strokes, lab) => { const g = G++; strokes.forEach(s => { s._g = g; s._n = strokes.length; s._lab = lab; }); return strokes; };
const line = (x0, y0, x1, y1, n) => { n = n || 12; const o = []; for (let k = 0; k <= n; k++) o.push({x:x0 + (x1 - x0) * k / n, y:y0 + (y1 - y0) * k / n}); return o; };
const poly = pts => { const o = []; for (let k = 1; k < pts.length; k++){ const s = line(pts[k - 1][0], pts[k - 1][1], pts[k][0], pts[k][1], 8); if (k > 1) s.shift(); o.push(...s); } return o; };
/* Buchstabe/Ziffer als „N“-Zickzack im Kästchen (x, y = links oben) */
const glyph = (lab, x, y, w, h) => tag([poly([[x, y + h], [x + 0.1 * w, y], [x + 0.9 * w, y + h], [x + w, y]])], lab);
const ring = (lab, x, y, w, h) => { const o = []; for (let k = 0; k <= 24; k++){ const a = 2 * Math.PI * k / 24; o.push({x:x + w / 2 + w / 2 * Math.cos(a), y:y + h / 2 + h / 2 * Math.sin(a)}); } return tag([o], lab); };
const minus = (x, y, w) => tag([line(x, y, x + w, y)], '-');
const eq = (x, y, w, gap) => tag([line(x, y, x + w, y), line(x, y + gap, x + w, y + gap)], '=');
const bar = (x, y, w, dy) => line(x, y, x + w, y + (dy || 0), 30);
const T = (x, y, w, h) => tag([line(x, y, x + w, y), line(x + w / 2, y, x + w / 2, y + h)], 'T');
const run = (parts, letters) => { const S = parts.flat(); const rc = E.inkContext(null, letters ? [letters] : []); rc.oracle = pts => { const g = pts[0]._g; if (g === undefined || !pts.every(p => p._g === g) || pts.length !== pts[0]._n) return [['?', 0.01]]; return [[pts[0]._lab, 0.995], ['?', 0.005]]; }; return E.recognizeInk(S, rc).text; };

/* 1  kleiner Index, der kaum tiefer sitzt (CROHME: T_0, S_max): Unterkante nur 0,08 Zeichenhöhen tiefer, halbe Größe */
check('Index kaum tiefer: T_0', run([T(0, 0, 30, 40), ring('0', 34, 26, 14, 17)]), 'T_0');
/* 2  mehrbuchstabiger Index wird geklammert ausgegeben (sonst S_m·a·x) */
check('Index aus mehreren Buchstaben: S_{max}', run([glyph('S', 0, 0, 28, 40), glyph('m', 32, 30, 14, 12), glyph('a', 48, 30, 12, 12), glyph('x', 62, 30, 12, 12)], 'S m a x'), 'S_{max}');
/* 3  Buchstaben eines Funktionsworts bleiben auf der Grundlinie, auch wenn das o (als 0 gelesen) klein ist */
check('Funktionswort: cos x', run([glyph('c', 0, 16, 18, 24), ring('0', 22, 20, 16, 20), glyph('s', 42, 16, 16, 24), glyph('x', 70, 16, 20, 24)], 'x'), 'cos x');
/* 4  Bruch: Hochzahl am Zähler ragt über das Ende des Bruchstrichs (CROHME 106_em_90: v^2/R) */
check('Hochzahl am Zähler hinter dem Strichende', run([glyph('a', 0, 62, 24, 24), eq(32, 68, 24, 10), tag([bar(64, 74, 46)], '-'), glyph('v', 80, 38, 26, 26), glyph('2', 112, 22, 14, 20), glyph('R', 74, 84, 26, 40)], 'a v R'), 'a = v^2/R');
/* 5  Bruch mit leicht ansteigendem langem Strich (Neigung 0,18, Höhenunterschied größer als 0,35 Zeichenhöhen) */
check('schräger Bruchstrich', run([glyph('a', 30, 0, 30, 30), tag([bar(0, 52, 120, -22)], '-'), glyph('b', 40, 56, 30, 40)], 'a b'), 'a/b');
/* 6  Nenner breiter als der Strich (CROHME: a/(sin A)) */
check('Nenner breiter als der Bruchstrich', run([glyph('a', 30, 0, 26, 26), tag([bar(10, 36, 70)], '-'), glyph('s', 0, 50, 18, 26), glyph('i', 22, 46, 6, 30), glyph('n', 32, 50, 18, 26), glyph('A', 58, 42, 30, 36), eq(100, 34, 24, 10), glyph('b', 132, 18, 26, 40)], 'a A b'), 'a/(sin A) = b');
/* 7  Nenner weit unter dem Strich (1,1 Zeichenhöhen) */
check('Nenner weit unter dem Strich', run([glyph('x', 0, 40, 28, 26), eq(36, 44, 24, 10), glyph('1', 82, 0, 12, 40), tag([bar(70, 52, 40)], '-'), glyph('2', 76, 96, 28, 40)], 'x'), 'x = 1/2');
/* 8  Vorzeichen des Zählers links vor dem Strichanfang (CROHME: (-1 + i√3)/2) */
check('Vorzeichen des Zählers vor dem Strich', run([minus(0, 20, 22), glyph('1', 30, 0, 12, 40), tag([line(52, 20, 74, 20), line(63, 9, 63, 31)], '+'), glyph('x', 82, 14, 24, 26), tag([bar(26, 52, 82)], '-'), glyph('2', 52, 60, 28, 40)], 'x'), '(-1 + x)/2');
/* 9  Bruchstrich über einer breiteren Wurzel (CROHME 103_em_8, 117_em_192): Bruch zuerst */
{
  const rad = tag([poly([[0, 74], [8, 70], [18, 112], [30, 52], [170, 50]])], 'sqrt');
  check('Wurzel im Nenner, breiter als der Bruchstrich', run([glyph('1', 70, 0, 12, 40), tag([bar(10, 44, 140)], '-'), rad, glyph('x', 40, 70, 28, 26), tag([line(76, 82, 96, 82), line(86, 72, 86, 92)], '+'), glyph('1', 110, 60, 12, 40)], 'x'), '1/sqrt(x + 1)');
}
/* 10 Wurzel mit schrägem Überstrich: Radikand beginnt am Haken, nicht erst im oberen Viertel (Minus am Anfang bleibt drin) */
{
  const rad = tag([poly([[0, 70], [8, 66], [20, 100], [32, 40], [300, 10]])], 'sqrt');
  check('schräger Überstrich, Minus am Radikandanfang', run([rad, minus(40, 72, 16), glyph('2', 64, 52, 26, 40), glyph('x', 98, 64, 26, 28)], 'x'), 'sqrt(-2x)');
}
/* 11 „=“ gehört nie in einen Index-Lauf (CROHME: γ_{1=}) */
check('= nicht im Index', run([glyph('γ', 0, 10, 26, 40), glyph('1', 30, 40, 8, 18), eq(46, 34, 24, 10), glyph('μ', 90, 0, 22, 26), glyph('3', 114, 18, 10, 14), tag([bar(84, 40, 44)], '-'), glyph('σ', 92, 50, 22, 22), glyph('3', 116, 44, 10, 14)], 'γ μ σ'), 'γ_1 = μ_3/σ^3');
/* 12 „=“ mit großem Abstand der Striche bleibt „=“ (Gruppierung) */
check('weites =', run([glyph('a', 0, 16, 24, 24), tag([line(34, 14, 60, 14), line(34, 34, 60, 34)], '='), glyph('3', 72, 0, 26, 40)], 'a'), 'a = 3');
/* 13 gewölbter oberer Strich eines „=“ ist kein Dach (CROHME HAMEX a = 3 → a ^= 3) */
check('gewölbtes = ist kein Dach', run([glyph('a', 0, 16, 24, 24), tag([poly([[34, 26], [47, 18], [60, 26]]), line(34, 34, 60, 34)], '='), glyph('3', 72, 0, 26, 40)], 'a'), 'a = 3');
/* 14 Index aus i und j: j-Haken ragt nach links, Reihenfolge bleibt i, j */
check('Reihenfolge i, j im Index', run([T(0, 0, 30, 40), tag([line(36, 30, 36, 48), line(36, 24, 36.5, 24.5, 1)], 'i'), tag([poly([[46, 30], [46, 54], [38, 56], [30, 52]]), line(46, 24, 46.5, 24.5, 1)], 'j')], 'T i j'), 'T_{ij}');

/* ---------- Ausgabe (genText) direkt ---------- */
const R0 = {E:40, H:30, pctx:{}, funcs:new Set(), dvars:new Set(['x']), rctx:{letters:new Set()}};
const sym = (c, x0, x1, ix) => ({it:{k:'sym', x0, x1, y0:0, y1:30, alts:[[c, 1]]}, ix});
/* 15 Bruch mit Hochzahl wird geklammert: (v/R)^2, nicht v/R^2 */
{
  const nodes = [{it:{k:'frac', x0:0, x1:40, num:[sym('v', 10, 30, 0)], den:[sym('R', 10, 30, 1)]}, sup:[sym('2', 44, 54, 2)]}];
  check('Bruch mit Hochzahl', I.genText(nodes, ['v', 'R', '2'], R0, 'top'), '(v/R)^2');
}
/* 16 Dezimalkomma zwischen eng stehenden Ziffern; weit gesetztes Komma bleibt Aufzählung */
{
  const P = (g) => [sym('2', 0, 20, 0), sym(',', 22, 26, 1), sym('9', 26 + g, 46 + g, 2), sym('1', 50 + g, 60 + g, 3)];
  check('Dezimalkomma 2,91', I.genText(P(4), ['2', ',', '9', '1'], R0, 'top'), '2,91');
  const t = I.genText(P(30), ['2', ',', '9', '1'], R0, 'top');
  if (!/, 91/.test(t)){ nErr++; console.log('FEHLER Aufzählung mit weitem Komma:', JSON.stringify(t)); } else nOk++;
}
console.log('Regressionstests (Orakel/Ausgabe):', nOk, '/', nOk + nErr, nErr ? 'FEHLER' : 'ok');
process.exit(nErr ? 1 : 0);
