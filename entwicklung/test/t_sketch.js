/* Skizzen-Kern (src/engine/80-sketch.js): Einheitstests je Merkmal, Grenzfälle, Schnittstelle, Physik der Beispiel-Musterfunktionen,
   Selbsttest und Statistik über die Beispielaufgaben in test/sketch_samples.js.
   Aufruf: node test/t_sketch.js [-v] [--quick]   (--quick: weniger Startwerte für die Statistik) */
'use strict';
const fs = require('fs'), path = require('path');
const ls = d => fs.readdirSync(path.join(__dirname, '..', d)).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(path.join(__dirname, '..', d, f), 'utf8'));
const {SKETCH} = new Function(ls('src/engine').join('\n;\n') + '\n;return {SKETCH};')();
const {SAMPLES, PHYS} = require('./sketch_samples.js');
const VERB = process.argv.includes('-v'), QUICK = process.argv.includes('--quick');
let nOk = 0, nBad = 0;
const ok = (cond, name, extra) => { if (cond){ nOk++; if (VERB) console.log('ok    ', name); } else { nBad++; console.log('FEHLER', name, extra !== undefined ? (typeof extra === 'string' ? extra : JSON.stringify(extra)) : ''); } };
const PI = Math.PI;

/* ---------- Hilfen ---------- */
const line = (f, a, b, n) => { n = n || 200; const p = []; for (let i = 0; i <= n; i++){ const x = a + (b - a) * i / n; p.push([x, f(x)]); } return p; };
const spec = (o) => Object.assign({id:'u-' + Math.random().toString(36).slice(2, 8), title:'t', text:'t', kind:'curve', draw:'psi', reveal:'r', plot:{x:[0, 1]}, f:x => Math.sin(PI * x)}, o);
const res = (r, id) => r.results.find(x => x.id === id);
const one = (sp, strokes, id) => { const r = SKETCH.evaluate(sp, strokes); return res(r, id) || {ok:false, got:'(kein Ergebnis: ' + (r.first[0] && r.first[0].id) + ')'}; };
const chk = (type, extra) => Object.assign({id:'c', type, msg:'Rückfrage {got}'}, extra);

/* ================= (a) Einheitstests je Merkmal ================= */
{
  // nodes (psi) und Hysterese
  const sp = spec({checks:[chk('nodes', {n:2})]});
  ok(one(sp, [line(x => 0.8 * Math.sin(3 * PI * x), 0, 1)], 'c').ok, 'nodes: sin(3πx) hat 2 Knoten');
  ok(!one(sp, [line(x => 0.8 * Math.sin(2 * PI * x), 0, 1)], 'c').ok, 'nodes: sin(2πx) hat nicht 2 Knoten');
  ok(one(sp, [line(x => 0.8 * Math.sin(2 * PI * x), 0, 1)], 'c').got === 1, 'nodes: got = 1');
  ok(one(sp, [line(x => 0.8 * Math.sin(3 * PI * x) + (x < 0.03 ? -0.05 : 0), 0, 1)], 'c').ok, 'nodes: kleiner Zitterbogen an der Wand zählt nicht');
  const sp2 = spec({draw:'abs2', checks:[chk('nodes', {n:1})]});
  ok(one(sp2, [line(x => 0.8 * Math.sin(2 * PI * x) ** 2, 0, 1)], 'c').ok, 'nodes abs2: sin²(2πx) hat einen inneren Einbruch');
  ok(!one(sp2, [line(x => 0.8 * Math.sin(PI * x) ** 2, 0, 1)], 'c').ok, 'nodes abs2: sin²(πx) hat keinen');
  ok(!one(sp2, [line(x => 0.8 * (0.6 + 0.4 * Math.cos(4 * PI * x)), 0, 1)], 'c').ok, 'nodes abs2: Einbruch nicht nahe null zählt nicht');
}
{
  const sp = spec({plot:{x:[-0.2, 1.2], dom:[0, 1]}, checks:[chk('zero', {at:[0, 1]})]});
  ok(one(sp, [line(x => 0.8 * Math.sin(PI * x), 0, 1)], 'c').ok, 'zero: sin(πx) verschwindet an den Wänden');
  const r = one(sp, [line(x => 0.8 * Math.cos(0.8 * PI * (x - 0.5)), 0, 1)], 'c');
  ok(!r.ok && /x|0/.test(r.got), 'zero: cos-Form an der Wand nicht null', r);
  ok(one(sp, [line(x => 0.8 * Math.sin(PI * x), 0.012, 0.99)], 'c').ok, 'zero: Strich beginnt 1 % neben der Wand (Fenster ±tol, sonst ±2·tol)');
  // Rand der Zeichnung an der Wand: steiler Anstieg, Stift setzt knapp neben der Wand an (Gerade durch die ersten Abtastwerte bis zur Wand)
  const sw = (n, xr) => spec({plot:{x:xr || [0, 1], dom:[0, 1]}, f:x => Math.sin(n * PI * x), checks:[chk('zero', {at:[0, 1]})]});
  for (const n of [4, 6, 8]) for (const d of [0.005, 0.01, 0.015])
    ok(one(sw(n), [line(x => 0.8 * Math.sin(n * PI * x), d, 1 - d, 300)], 'c').ok, 'zero am Rand: steiler Start ψ' + n + ', Abstand ' + d + ' zu beiden Wänden');
  ok(one(sw(6), [line(x => 0.8 * Math.sin(6 * PI * x), 0, 0.99, 300)], 'c').ok, 'zero am Rand: nur rechts mit Abstand');
  ok(one(sw(6), [line(x => -0.8 * Math.sin(6 * PI * x), 0.012, 0.6, 200), line(x => -0.8 * Math.sin(6 * PI * x), 0.58, 0.99, 200)], 'c').ok, 'zero am Rand: zwei Striche, negativ gezeichnet');
  ok(one(sw(1), [line(x => 0.8 * Math.sin(PI * x), 0.015, 0.985)], 'c').ok, 'zero am Rand: flacher Start mit kleinem Abstand');
  ok(one(sw(6, [-0.2, 1.2]), [line(x => 0.8 * Math.sin(6 * PI * x), 0.01, 0.99, 300)], 'c').ok, 'zero am Rand: Wand im Inneren von plot.x, außen nichts gezeichnet');
  ok(!one(sw(6), [line(x => 0.8 * Math.sin(6 * PI * x), 0.035, 0.965, 300)], 'c').ok, 'zero am Rand: Start weiter als tol neben der Wand wird nicht verlängert');
  ok(!one(sw(6, [-0.2, 1.2]), [line(x => 0.5, -0.2, -0.005, 50), line(x => 0.8 * Math.sin(6 * PI * x), 0.012, 0.99, 300)], 'c').ok, 'zero am Rand: links neben der Wand gezeichnet (Wert 0,5) → keine Verlängerung');
  for (const d of [0, 0.01, 0.02]){
    ok(!one(sw(4), [line(x => 0.8 * Math.cos(3.4 * PI * (x - 0.5)), d, 1 - d, 300)], 'c').ok, 'zero am Rand: Fehlskizze mit deutlichem Randwert, Abstand ' + d);
    ok(!one(sw(6), [line(x => 0.8 * (0.25 + 0.75 * Math.sin(6 * PI * x)), d, 1 - d, 300)], 'c').ok, 'zero am Rand: steiler Anstieg mit Randwert 0,25·A fällt durch, Abstand ' + d);
  }
}
{
  const sp = spec({checks:[chk('parity', {p:'even', about:0.5})]});
  ok(one(sp, [line(x => 0.8 * Math.sin(PI * x), 0, 1)], 'c').ok, 'parity: sin(πx) gerade zu 1/2');
  const r = one(sp, [line(x => 0.8 * Math.sin(2 * PI * x), 0, 1)], 'c');
  ok(!r.ok && r.got === 'antisymmetrisch', 'parity: sin(2πx) ist antisymmetrisch', r);
  const sp2 = spec({checks:[chk('parity', {p:'odd', about:0.5})]});
  ok(one(sp2, [line(x => -0.8 * Math.sin(2 * PI * x), 0, 1)], 'c').ok, 'parity odd: Vorzeichen egal');
  ok(!one(sp2, [line(x => 0.8 * Math.sin(2 * PI * Math.pow(x, 1.6)), 0, 1)], 'c').ok, 'parity: verschobener Knoten ist nicht antisymmetrisch');
}
{
  const sp = spec({plot:{x:[0, 2]}, checks:[chk('decay', {toward:'right'})]});
  ok(one(sp, [line(x => 0.8 * Math.exp(-2 * x), 0, 2)], 'c').ok, 'decay: e^{-2x} klingt ab');
  ok(!one(sp, [line(x => 0.8 * Math.exp(2 * (x - 2)), 0, 2)], 'c').ok, 'decay: wachsend');
  ok(!one(sp, [line(x => 0.8 * Math.exp(-x) * Math.cos(6 * x), 0, 2)], 'c').ok, 'decay: abklingende Schwingung (Vorzeichenwechsel)');
  ok(!one(sp, [line(x => 0.8 * Math.exp(-3 * x) + 0.4 * Math.exp(-((x - 1.4) ** 2) / 0.02), 0, 2)], 'c').ok, 'decay: Wiederanstieg (Buckel)');
  const spL = spec({plot:{x:[-2, 2]}, checks:[chk('decay', {toward:'left', range:[-2, -0.5]})]});
  ok(one(spL, [line(x => 0.8 * Math.exp(-2 * Math.abs(x)), -2, 2)], 'c').ok, 'decay toward left');
  ok(!one(spL, [line(x => Math.abs(x) < 0.5 ? 0.8 * Math.cos(PI * x) : 0, -2, 2)], 'c').ok, 'decay: ψ = 0 im verbotenen Bereich zählt nicht als Abklingen');
  const spR = spec({plot:{x:[0, 2]}, checks:[chk('decay', {toward:'right', ratio:0.7})]});
  ok(one(spR, [line(x => 0.8 * Math.exp(-0.4 * x), 0, 2)], 'c').ok, 'decay mit ratio 0,7 (schwaches Abklingen)');
}
{
  const sp = spec({plot:{x:[-1, 1]}, checks:[chk('noosc')]});
  ok(one(sp, [line(x => 0.3 * Math.cosh(1.5 * x), -1, 1)], 'c').ok, 'noosc: cosh');
  ok(!one(sp, [line(x => 0.8 * Math.cos(8 * x), -1, 1)], 'c').ok, 'noosc: cos(8x) schwingt');
  ok(!one(sp, [line(x => 0.5 + 0.3 * Math.cos(12 * x), -1, 1)], 'c').ok, 'noosc: Wellen ohne Nulldurchgang (mehrere Extrema)');
  const so = spec({plot:{x:[-1, 1]}, checks:[chk('osc', {min:3})]});
  ok(one(so, [line(x => 0.8 * Math.cos(8 * x), -1, 1)], 'c').ok, 'osc: cos(8x) hat ≥ 3 Nulldurchgänge');
  ok(!one(so, [line(x => 0.8 * Math.exp(-x), -1, 1)], 'c').ok, 'osc: e^{-x} schwingt nicht');
  ok(one(spec({plot:{x:[0, 2]}, checks:[chk('osc', {min:2, range:[1, 2]})]}), [line(x => x < 1 ? Math.cos(10 * x) : 0.2 * Math.cos(10 * x), 0, 2)], 'c').ok, 'osc: kleine Welle (20 %) zählt mit lokaler Hysterese');
}
{
  const f = x => x < 1 ? 0.8 * Math.cos(4 * PI * x) : 0.8 * Math.cos(2 * PI * (x - 1) + 0);
  const mk = cmp => spec({plot:{x:[0, 2]}, checks:[chk('wavelength', {a:[0, 1], b:[1, 2], cmp})]});
  ok(one(mk('<'), [line(f, 0, 2, 400)], 'c').ok, "wavelength '<': λ links = λ rechts / 2");
  ok(!one(mk('>'), [line(f, 0, 2, 400)], 'c').ok, "wavelength '>' verfehlt");
  ok(!one(mk('='), [line(f, 0, 2, 400)], 'c').ok, "wavelength '=' verfehlt");
  ok(one(mk('='), [line(x => 0.8 * Math.cos(4 * PI * x), 0, 2, 400)], 'c').ok, "wavelength '=': gleiche Wellenlänge");
  const sa = cmp => spec({plot:{x:[0, 2]}, checks:[chk('amp', {a:[0, 1], b:[1, 2], cmp})]});
  const g = x => x < 1 ? 0.8 * Math.cos(6 * x) : 0.3 * Math.cos(6 * x);
  ok(one(sa('>'), [line(g, 0, 2)], 'c').ok && !one(sa('<'), [line(g, 0, 2)], 'c').ok && !one(sa('='), [line(g, 0, 2)], 'c').ok, "amp: '>' ja, '<' und '=' nein");
}
{
  const sp = spec({draw:'abs2', plot:{x:[-1, 1]}, checks:[chk('nonneg')]});
  ok(one(sp, [line(x => 0.8 * x * x, -1, 1)], 'c').ok, 'nonneg: x²');
  ok(!one(sp, [line(x => 0.8 * (x * x - 0.3), -1, 1)], 'c').ok, 'nonneg: x² − 0,3');
  const ss = spec({plot:{x:[-1, 1]}, f:x => Math.exp(-x * x), checks:[chk('sign')]});
  ok(one(ss, [line(x => -0.7 * Math.exp(-x * x), -1, 1)], 'c').ok, 'sign (psi): Gesamtvorzeichen frei');
  ok(!one(ss, [line(x => 0.7 * x * Math.exp(-x * x) * 3, -1, 1)], 'c').ok, 'sign (psi): Knoten → beide Vorzeichen');
  const sf = spec({draw:'f', plot:{x:[-1, 1]}, f:x => Math.exp(-x * x), checks:[chk('sign', {s:1})]});
  ok(!one(sf, [line(x => -0.7 * Math.exp(-x * x), -1, 1)], 'c').ok, "sign (f): negativ gezeichnet verfehlt s = 1");
}
{
  const sp = spec({f:x => Math.sin(3 * PI * x), checks:[chk('extrema', {n:3}), Object.assign(chk('extrema', {n:2, kind:'max'}), {id:'m'}), Object.assign(chk('extrema', {n:1, kind:'min'}), {id:'n'})]});
  const r = SKETCH.evaluate(sp, [line(x => -0.8 * Math.sin(3 * PI * x), 0, 1)]);
  ok(res(r, 'c').ok && res(r, 'm').ok && res(r, 'n').ok, 'extrema: 3 Buckel; max/min nach Ausrichtung am Muster (psi negativ gezeichnet)', r.results);
  const ga = (x0, s) => x => Math.exp(-((x - x0) ** 2) / (2 * s * s));
  const sm = spec({draw:'abs2', plot:{x:[0, 1]}, f:ga(0.3, 0.08), checks:[chk('maxat', {x:0.3, tol:0.05})]});
  ok(one(sm, [line(x => 0.8 * ga(0.3, 0.08)(x), 0, 1)], 'c').ok && !one(sm, [line(x => 0.8 * ga(0.7, 0.08)(x), 0, 1)], 'c').ok, 'maxat: richtig/falsch');
  const sc = spec({draw:'abs2', plot:{x:[-3, 9]}, f:ga(4, 1), checks:[chk('center', {x:4, tol:0.4})]});
  ok(one(sc, [line(x => 0.8 * ga(4, 1)(x), -3, 9)], 'c').ok && !one(sc, [line(x => 0.8 * ga(2.5, 1)(x), -3, 9)], 'c').ok, 'center: richtig/falsch');
  const sw = spec({draw:'abs2', plot:{x:[-3, 9]}, f:ga(4, 1), checks:[chk('fwhm', {v:2.355})]});
  const rw = one(sw, [line(x => 0.8 * ga(4, 1)(x), -3, 9)], 'c');
  ok(rw.ok && /^2,3/.test(rw.got), 'fwhm: Halbwertsbreite 2,355 gemessen', rw);
  ok(!one(sw, [line(x => 0.8 * ga(4, 2)(x), -3, 9)], 'c').ok, 'fwhm: doppelte Breite verfehlt');
  ok(!one(sw, [line(x => 0.8 * ga(8.5, 1)(x), -3, 9)], 'c').ok, 'fwhm: Kurve fällt rechts nicht auf die Hälfte → nicht messbar');
}
{
  // smooth und kink
  const W = PHYS.WELL;
  const sp = spec({plot:{x:[-1.6, 1.6]}, f:W.f, checks:[chk('smooth', {at:[-0.5, 0.5]})]});
  ok(one(sp, [line(x => 0.8 * W.f(x), -1.6, 1.6, 400)], 'c').ok, 'smooth: Grundzustand endlicher Topf ist glatt an den Stufen');
  ok(!one(sp, [line(x => Math.abs(x) < 0.5 ? 0.8 * Math.cos(PI * x) : 0, -1.6, 1.6, 400)], 'c').ok, 'smooth: Kasten-Form hat Knicke');
  const sk = spec({plot:{x:[-3, 3]}, f:x => Math.exp(-Math.abs(x)), checks:[chk('kink', {at:0})]});
  ok(one(sk, [line(x => 0.8 * Math.exp(-Math.abs(x)), -3, 3, 400)], 'c').ok, 'kink: e^{-|x|}');
  ok(one(sk, [line(x => -0.8 * Math.exp(-Math.abs(x)), -3, 3, 400)], 'c').ok, 'kink: auch nach unten (Vorzeichen frei)');
  ok(!one(sk, [line(x => 0.8 * Math.exp(-x * x / 2), -3, 3, 400)], 'c').ok, 'kink: glatte Kuppe ist kein Knick');
  const sj = spec({plot:{x:[-3, 3]}, checks:[chk('kink', {at:0, minJump:0.5})]}), ramp = x => x < 0 ? 0.5 + 0.1 * x : x < 0.6 ? 0.5 + x : 1.1;
  ok(one(sj, [line(ramp, -3, 3, 600)], 'c').ok, 'kink mit minJump: Steigungssprung gleichen Vorzeichens');
  ok(!one(sk, [line(ramp, -3, 3, 600)], 'c').ok, 'kink ohne minJump verlangt Spitze (Steigungen mit entgegengesetztem Vorzeichen)');
  // zwei Striche, die sich an der Stufe treffen (Stift abgesetzt)
  ok(one(sp, [line(x => 0.8 * W.f(x), -1.6, 0.5, 300), line(x => 0.8 * W.f(x) + 0.01, 0.49, 1.6, 200)], 'c').ok, 'smooth: Strichgrenze genau an der Stufe');
}
{
  const sp = spec({plot:{x:[0, 2]}, checks:[chk('cont')]});
  ok(one(sp, [line(x => 0.8 * Math.sin(3 * x), 0, 2)], 'c').ok, 'cont: stetig');
  ok(!one(sp, [line(x => x < 1 ? 0.3 : 0.8, 0, 2, 400)], 'c').ok, 'cont: Sprung in einem Strich (senkrechtes Stück)');
  ok(!one(sp, [line(x => 0.3, 0, 1.0), line(x => 0.8, 1.02, 2)], 'c').ok, 'cont: Sprung zwischen zwei Strichen (kleine Lücke)');
  ok(!one(sp, [line(x => 0.3, 0, 0.9), line(x => 0.3, 1.1, 2)], 'c').ok, 'cont: Lücke > 6 % bleibt offen');
  ok(one(sp, [line(x => 0.8 * Math.sin(3 * x), 0, 0.98), line(x => 0.8 * Math.sin(3 * x), 1.02, 2)], 'c').ok, 'cont: kleine Lücke ohne Sprung wird überbrückt');
  ok(one(sp, [line(x => 0.8 * Math.sin(12 * x), 0, 2, 600)], 'c').ok, 'cont: steile kurze Welle ist kein Sprung');
}
{
  const sp = spec({draw:'f', plot:{x:[-0.5, 2.5], y:[0, 1.2], abs:true, dom:[0, 2]}, f:x => 0.5, checks:[chk('level', {v:0.5, tol:0.08}), Object.assign(chk('area', {v:1, tol:0.15}), {id:'a'})]});
  const r = SKETCH.evaluate(sp, [line(x => 0.5, 0, 2)]);
  ok(res(r, 'c').ok && res(r, 'a').ok && res(r, 'a').got === '1', 'level/area: Höhe 1/2 auf [0, 2]', r.results);
  const r2 = SKETCH.evaluate(sp, [line(x => 1, 0, 2)]);
  ok(!res(r2, 'c').ok && !res(r2, 'a').ok, 'level/area: Höhe 1 verfehlt');
}
/* ---------- Pfeile ---------- */
{
  const sp = {id:'u-arr', title:'t', text:'t', kind:'arrows', reveal:'r', plot:{x:[-2, 2], y:[-2, 2], abs:true, unit:true},
    want:[{from:[0, 0], to:[-0.5, 1.5], msg:'Winkel?', msgLen:'Betrag?'}], extra:'zu viele'};
  const arrow = (a, b, n) => line(t => 0, 0, 1, n || 30).map(([t]) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  ok(SKETCH.evaluate(sp, [arrow([0, 0], [-0.5, 1.5])]).ok, 'arrow: exakt');
  ok(SKETCH.evaluate(sp, [arrow([0.05, -0.05], [-0.45, 1.6])]).ok, 'arrow: kleine Abweichungen');
  const rd = SKETCH.evaluate(sp, [arrow([0, 0], [0.5, 1.5])]);
  ok(!rd.ok && rd.first[0].msg === 'Winkel?', 'arrow: falsche Richtung → msg', rd.first);
  const rl = SKETCH.evaluate(sp, [arrow([0, 0], [-1, 3])]);
  ok(!rl.ok && rl.first[0].msg === 'Betrag?', 'arrow: falsche Länge → msgLen', rl.first);
  ok(!SKETCH.evaluate(sp, [arrow([0.5, 0], [0, 1.5])]).ok, 'arrow: falscher Anfang');
  // Pfeilspitze als Zusatzstriche und im selben Strich
  const shaft = arrow([0, 0], [-0.5, 1.5]);
  const tip = [-0.5, 1.5], barb = (s) => [tip[0] + 0.25 * (0.32 + s * 0.95) * 0.9, tip[1] - 0.25 * (0.95 - s * 0.32) * 0.9];
  const rh = SKETCH.evaluate(sp, [shaft, [barb(1), tip, barb(-1)]]);
  ok(rh.ok && rh.arrows.length === 1 && !rh.extra, 'arrow: Pfeilspitze als eigener Strich wird ignoriert', rh.arrows);
  ok(SKETCH.evaluate(sp, [shaft.concat([barb(1), tip, barb(-1)])]).ok, 'arrow: Pfeilspitze im selben Strich');
  const rx = SKETCH.evaluate(sp, [shaft, arrow([0, 0], [1.5, 0.5])]);
  ok(rx.ok && rx.extra === 'zu viele', 'arrow: überzähliger Pfeil → nur Hinweis extra', rx.extra);
  // rückwärts gezeichnet: Anfang = erster Punkt → Rückfrage zur Zeichenrichtung
  const rb = SKETCH.evaluate(sp, [arrow([-0.5, 1.5], [0, 0])]);
  ok(!rb.ok && rb.results[0].reversed === true && /von der Spitze zum Anfang/.test(rb.first[0].msg), 'arrow: rückwärts gezeichnet → reversed + Rückfrage', rb.first);
  // axis / len:false (Eigenvektoren)
  const se = {id:'u-eig', title:'t', text:'t', kind:'arrows', reveal:'r', plot:{x:[-2, 2], y:[-2, 2], abs:true},
    want:[{from:[0, 0], to:[1, 1], axis:true, len:false, msg:'a'}, {from:[0, 0], to:[1, -1], axis:true, len:false, msg:'b'}]};
  ok(SKETCH.evaluate(se, [arrow([0, 0], [-1.4, -1.4]), arrow([0, 0], [-0.6, 0.6])]).ok, 'arrow axis/len:false: Gegenrichtung und andere Länge zählen');
  ok(!SKETCH.evaluate(se, [arrow([0, 0], [2, 1]), arrow([0, 0], [1, 2])]).ok, 'arrow axis: Matrixspalten sind keine Eigenvektoren');
  const re = SKETCH.evaluate(se, []);
  ok(re.empty && re.first[0].id === '_empty', 'arrow: leer');
  ok(SKETCH.evaluate(se, [[[0, 0], [0.05, 0.05]]]).first[0].msg.includes('zu kurz'), 'arrow: nur kurze Striche → Hinweis');
}

/* ================= (c) Grenzfälle ================= */
{
  const sp = spec({plot:{x:[-0.15, 1.15], dom:[0, 1], ticks:[{x:0, lab:'0'}, {x:1, lab:'L'}], xlab:'x'}, f:x => Math.sin(3 * PI * x),
    checks:[chk('zero', {at:[0, 1]}), Object.assign(chk('nodes', {n:2}), {id:'k'})]});
  const good = line(x => 0.8 * Math.sin(3 * PI * x), 0, 1);
  const e1 = SKETCH.evaluate(sp, []);
  ok(e1.empty && !e1.ok && e1.score === 0 && e1.first[0].id === '_empty' && /von \$x = 0\$ bis \$x = L\$/.test(e1.first[0].msg), 'leer: empty, Rückfrage mit Tick-Beschriftung', e1.first);
  ok(SKETCH.evaluate(sp, null).empty, 'leer: null');
  const e2 = SKETCH.evaluate(sp, [[[0.5, 0.2]]]);
  ok(e2.empty && /Senkrechte und sehr kurze Striche/.test(e2.first[0].msg), 'nur ein Punkt → zählt nicht, eigene Rückfrage');
  const e3 = SKETCH.evaluate(sp, [[[0, 0], [0.002, 0.4], [0.004, 0.8]]]);
  ok(e3.empty, 'nur senkrechter Wandstrich → zählt nicht');
  ok(SKETCH.evaluate(sp, [[[0, 0], [0.002, 0.8]], good, [[1, 0], [1.003, 0.8]]]).ok, 'Wandstriche neben der Kurve stören nicht');
  const e4 = SKETCH.evaluate(sp, [line(x => 0.8 * Math.sin(3 * PI * x), 0, 0.5)]);
  ok(!e4.ok && e4.first[0].id === '_cover' && /rechte Teil/.test(e4.first[0].msg) && e4.results.every(r => r.skipped), 'halbe Zeichnung → nur Überdeckungsfrage', e4.first);
  const spn = spec({plot:{x:[-0.15, 1.15], dom:[0, 1]}, f:x => Math.sin(3 * PI * x), checks:[chk('nodes', {n:2})]});
  const e4b = SKETCH.evaluate(spn, [line(x => 0.8 * Math.sin(3 * PI * x), 0, 0.88)]);
  ok(e4b.ok && e4b.cover > 0.85 && e4b.cover < 0.9, '88 % gezeichnet reicht für die Auswertung', e4b.cover);
  const e5 = SKETCH.evaluate(sp, [line(x => 0.001 * Math.sin(3 * PI * x), 0, 1)]);
  ok(e5.first[0].id === '_flat', 'flache Linie → Rückfrage „größer zeichnen“');
  // Drüberzeichnen: letzter Strich gewinnt
  const wrong = line(x => 0.8 * Math.sin(2 * PI * x), 0, 1);
  ok(SKETCH.evaluate(sp, [wrong, good]).ok, 'Drüberzeichnen: richtige Kurve über falscher gewinnt');
  ok(!res(SKETCH.evaluate(sp, [good, wrong]), 'k').ok, 'Drüberzeichnen: falsche Kurve über richtiger gewinnt');
  const fix = line(x => 0.8 * Math.sin(3 * PI * x), 0.3, 0.75);
  ok(SKETCH.evaluate(sp, [line(x => x < 0.33 || x > 0.67 ? 0.8 * Math.sin(3 * PI * x) : 0.3 * Math.sin(3 * PI * x) + 0.4, 0, 1), fix]).ok, 'Drüberzeichnen: nur den falschen Mittelteil verbessert');
  // Zeichenrichtung, Punktformate, Punkte außerhalb
  ok(SKETCH.evaluate(sp, [good.slice().reverse()]).ok, 'von rechts nach links gezeichnet');
  ok(SKETCH.evaluate(sp, [good.map(([x, y]) => ({x, y}))]).ok, 'Punkte als {x, y}');
  ok(SKETCH.evaluate(sp, [{pts:good}]).ok, 'Strich als {pts}');
  ok(SKETCH.evaluate(sp, [good.concat([[1.5, 0.9], [2, 0.9]])]).ok, 'Punkte außerhalb von plot.x werden nicht abgetastet');
  ok(SKETCH.evaluate(sp, [good.concat([[NaN, 1], [0.5, Infinity]])]).ok, 'ungültige Punkte werden übergangen');
  // Haken am Strichende und Zittern in x (kleine Rückwärtsschritte)
  const hook = good.concat([[0.995, 0.03], [0.99, 0.06]]);
  ok(SKETCH.evaluate(sp, [hook]).ok, 'Haken am Strichende');
  ok(SKETCH.evaluate(sp, [good.map(([x, y], i) => [x + (i % 2 ? 0.004 : -0.004), y])]).ok, 'x-Zittern mit Rückwärtsschritten');
  // abs2 + negative Zeichnung
  const spa = spec({draw:'abs2', checks:[chk('nonneg')]});
  ok(!SKETCH.evaluate(spa, [line(x => -0.8 * Math.sin(PI * x) ** 2, 0, 1)]).ok, 'abs2 negativ gezeichnet verfehlt nonneg');
  // Ausnahme in einem Merkmal bricht nicht ab
  const spx = spec({checks:[chk('nodes', {n:0}), {id:'kaputt', type:'wavelength', a:null, b:null, cmp:'=', msg:'m'}]});
  const rx = SKETCH.evaluate(spx, [good]);
  ok(Array.isArray(rx.results) && rx.results.length === 2 && rx.results[1].ok === false, 'fehlerhaftes Merkmal → ok:false statt Ausnahme');
}

/* ================= Schnittstelle: map, model, synth, validate, selfTest ================= */
{
  const m = SKETCH.map({x:[0, 2], y:[-1, 1]}, 700, 350);
  ok(m.inner.l === 46 && m.inner.t === 14 && m.inner.w === 640 && m.inner.h === 302, 'map: Ränder l 46, r 14, t 14, b 34', m.inner);
  const [X, Y] = m.px(0, 1); ok(X === 46 && Y === 14, 'map: (x0, y1) → linke obere Ecke');
  const [X2, Y2] = m.px(2, -1); ok(Math.abs(X2 - 686) < 1e-9 && Math.abs(Y2 - 316) < 1e-9, 'map: (x1, y0) → rechte untere Ecke');
  ok(m.px(1, 0.5)[1] < m.px(1, 0)[1], 'map: y-Achse nach oben');
  const w = m.world(...m.px(1.234, -0.321)); ok(Math.abs(w[0] - 1.234) < 1e-12 && Math.abs(w[1] + 0.321) < 1e-12, 'map: world ∘ px = id');
  const sa = {kind:'arrows', plot:{x:[-2, 2], y:[-2, 2], abs:true}, want:[]};
  const ma = SKETCH.map(sa, 700, 350);
  ok(Math.abs(ma.inner.w - ma.inner.h) < 1e-9 && ma.iso, 'map(spec) für Pfeile: gleicher Maßstab in x und y', ma.inner);
  ok(SKETCH.map({x:[-2, 2], y:[-2, 2], unit:true}, 700, 350).iso, 'map(plot) mit unit:true: isotrop');
  const s2 = {kind:'curve', draw:'abs2', plot:{x:[0, 1]}};
  SKETCH.dom(s2);   // registriert plot → draw
  ok(SKETCH.map(s2.plot, 600, 300).y[1] === 1 && SKETCH.map(s2.plot, 600, 300).y[0] === -0.25, 'map(spec.plot) kennt nach Registrierung die Vorgabe y = [−0,25, 1] für abs2');
  ok(SKETCH.map(s2, 600, 300).y[0] === -0.25 && JSON.stringify(SKETCH.plotOf(s2).y) === '[-0.25,1]', 'map(spec), plotOf für abs2: y = [−0,25, 1] (Platz für negative Werte, nonneg zeichenbar)');
  { const M = SKETCH.map(s2, 600, 300), Y0 = M.px(0, 0)[1], Bt = M.inner.t + M.inner.h; ok(Bt - Y0 > 0.15 * M.inner.h && Bt - Y0 < 0.25 * M.inner.h, 'abs2: Achse y = 0 sichtbar über dem unteren Rand (15–25 % der Höhe)', Bt - Y0); }
  { const neg = {id:'u-neg', title:'t', text:'t', kind:'curve', draw:'abs2', reveal:'r', plot:{x:[0, 1]}, f:x => Math.sin(PI * x) ** 2, checks:[chk('nonneg')]};
    const yl = SKETCH.plotOf(neg).y[0];   // ψ statt |ψ|²: negative Hälfte am unteren Rand abgeschnitten, so wie es die Fläche zulässt
    ok(!one(neg, [line(x => Math.max(yl, 0.9 * Math.sin(2 * PI * x)), 0, 1)], 'c').ok, 'abs2: ψ statt |ψ|² im Standardrahmen (bis zum unteren Rand) verfehlt nonneg'); }
  { const sp0 = {id:'u-f0', title:'t', text:'t', kind:'curve', draw:'f', reveal:'r', plot:{x:[0, 1]}, f:x => x, checks:[chk('nonneg')]}; ok(JSON.stringify(SKETCH.plotOf(sp0).y) === '[-1,1]', 'f/psi: Vorgabe y = [−1, 1] unverändert'); }
  ok(JSON.stringify(SKETCH.dom({plot:{x:[-1, 2], dom:[0, 1]}})) === '[0,1]' && JSON.stringify(SKETCH.dom({plot:{x:[-1, 2]}})) === '[-1,2]', 'dom: Vorgabe plot.x');
}
{
  const sp = spec({f:x => Math.sin(2 * PI * x), checks:[chk('nodes', {n:1})]});
  const m0 = SKETCH.model(sp, null);
  ok(m0.length === 300 && Math.abs(Math.max(...m0.map(p => Math.abs(p[1]))) - 0.8) < 0.01, 'model ohne Zeichnung: 300 Punkte, max 0,8 des Rahmens');
  const drawn = [line(x => -0.5 * Math.sin(2 * PI * x), 0, 1)];
  const m1 = SKETCH.model(sp, drawn, 101);
  ok(m1.length === 101 && Math.abs(Math.max(...m1.map(p => Math.abs(p[1]))) - 0.5) < 0.02 && m1[25][1] < 0, 'model: auf A der Zeichnung skaliert, Vorzeichen passend (psi)', m1[25]);
  const sf = spec({draw:'f', f:x => Math.sin(2 * PI * x), checks:[chk('nodes', {n:1})]});
  ok(SKETCH.model(sf, drawn, 101)[25][1] > 0, 'model (f): Vorzeichen bleibt');
  const sabs = spec({draw:'f', plot:{x:[0, 2], abs:true, y:[0, 1]}, f:x => 0.5, checks:[chk('nonneg')]});
  ok(SKETCH.model(sabs, [line(x => 0.9, 0, 2)]).every(p => p[1] === 0.5), 'model (abs): unskaliert');
  const sa = {kind:'arrows', plot:{x:[-2, 2], y:[-2, 2]}, want:[{from:[0, 0], to:[1, 1], lab:'v', msg:'m'}]};
  ok(JSON.stringify(SKETCH.model(sa)) === JSON.stringify([{from:[0, 0], to:[1, 1], lab:'v'}]), 'model (arrows): want-Pfeile');
  // axis:true: Muster in der Orientierung des zugeordneten Nutzerpfeils (Gegenpfeil ist richtig)
  const sx = {id:'u-ax', title:'t', text:'t', kind:'arrows', reveal:'r', plot:{x:[-2, 2], y:[-2, 2], abs:true}, want:[{from:[0, 0], to:[1.2, 0.6], axis:true, lab:'e', msg:'m'}, {from:[0, 0], to:[-0.5, 1], lab:'w', msg:'m'}]};
  const seg = (a, b) => { const p = []; for (let i = 0; i <= 20; i++) p.push([a[0] + (b[0] - a[0]) * i / 20, a[1] + (b[1] - a[1]) * i / 20]); return p; };
  ok(SKETCH.model(sx, null)[0].to[0] === 1.2, 'model (axis) ohne Zeichnung: gespeicherte Richtung');
  ok(SKETCH.model(sx, [seg([0, 0], [1.2, 0.6])])[0].to[0] === 1.2, 'model (axis): Nutzerpfeil in gespeicherter Richtung → Muster unverändert');
  const mg = SKETCH.model(sx, [seg([0, 0], [-1.2, -0.6]), seg([0, 0], [-0.5, 1])]);
  ok(SKETCH.evaluate(sx, [seg([0, 0], [-1.2, -0.6]), seg([0, 0], [-0.5, 1])]).ok && mg[0].to[0] === -1.2 && mg[0].to[1] === -0.6 && mg[0].flip && mg[1].to[0] === -0.5, 'model (axis): Gegenpfeil richtig, Muster umgedreht; Pfeil ohne axis bleibt', mg);
  ok(SKETCH.model(sx, [seg([-1.2, -0.6], [0, 0])])[0].to[0] === -1.2, 'model (axis): rückwärts gezeichneter Gegenpfeil → Muster nach seiner Lage');
  ok(SKETCH.model({kind:'arrows', plot:{x:[-2, 2], y:[-2, 2]}, want:[{from:[0, 0], to:[1, 1], msg:'m'}]}, [seg([0, 0], [-1, -1])])[0].to[0] === 1, 'model (ohne axis): Muster bleibt trotz Gegenpfeil');
  const a = SKETCH.synth(SAMPLES[2], SAMPLES[2].f, {seed:7, noise:0.06, strokes:3}), b = SKETCH.synth(SAMPLES[2], SAMPLES[2].f, {seed:7, noise:0.06, strokes:3});
  ok(JSON.stringify(a) === JSON.stringify(b) && a.length >= 3, 'synth: deterministisch, 3 Striche (+ evtl. Teilung)');
  ok(JSON.stringify(a) !== JSON.stringify(SKETCH.synth(SAMPLES[2], SAMPLES[2].f, {seed:8, noise:0.06, strokes:3})), 'synth: anderer Startwert → andere Striche');
  ok(JSON.stringify(SKETCH.synth(SAMPLES[2], SAMPLES[2].f, {seed:7, noise:0.06, strokes:3, early:0})) === JSON.stringify(a), 'synth: early:0 = ohne Option (selfTest unverändert)');
  { // early: erstes Extremum an steilem Anfang zu früh (ψ₄ im Kasten: erstes Maximum bei L/8)
    const se = {id:'u-early', title:'t', text:'t', kind:'curve', draw:'f', reveal:'r', plot:{x:[0, 1]}, f:x => Math.sin(4 * PI * x), checks:[chk('nodes', {n:3})]};
    const peak = st => { const S = SKETCH.sample(se, st); let im = -1; for (let i = 0; i < S.xs.length && S.xs[i] < 0.25; i++) if (Number.isFinite(S.ys[i]) && (im < 0 || S.ys[i] > S.ys[im])) im = i; return S.xs[im]; };
    const p0 = peak(SKETCH.synth(se, se.f, {seed:5, noise:0.03, strokes:1})), p1 = peak(SKETCH.synth(se, se.f, {seed:5, noise:0.03, strokes:1, early:0.4}));
    ok(p1 < p0 - 0.03 && Math.abs(p1 - 0.075) < 0.02, 'synth early 0,4: erstes Maximum von ψ₄ früher (bei ≈ 0,6·L/8)', [p0, p1]);
    const sd = Object.assign({}, se, {id:'u-early2', f:x => Math.exp(-3 * x)});
    ok(JSON.stringify(SKETCH.synth(sd, sd.f, {seed:5, noise:0.03, early:0.4})) === JSON.stringify(SKETCH.synth(sd, sd.f, {seed:5, noise:0.03})), 'synth early: kein steiler Anstieg aus null (Abklingen vom Rand) → unverändert');
  }
  const ar = SKETCH.synth(SAMPLES.find(s => s.kind === 'arrows'), null, {seed:3, noise:0.03});
  ok(ar.length >= 1 && ar.every(s => s.length >= 2), 'synth (arrows): Striche mit Pfeilspitzen');
}
{
  const V = s => SKETCH.validate(s);
  const base = () => spec({id:'v1', checks:[chk('nodes', {n:0})]});
  ok(V(base()).length === 0, 'validate: gültige Aufgabe');
  ok(V(Object.assign(base(), {checks:[chk('knoten', {n:0})]})).some(e => /type unbekannt/.test(e)), 'validate: unbekannter type');
  ok(V(Object.assign(base(), {checks:[{id:'a', type:'nodes', n:0}]})).some(e => /msg fehlt/.test(e)), 'validate: msg fehlt');
  ok(V(Object.assign(base(), {checks:[chk('nodes', {n:0, range:[0, 3]})]})).some(e => /range/.test(e)), 'validate: range außerhalb plot.x');
  ok(V(Object.assign(base(), {checks:[chk('nodes', {n:0}), chk('nodes', {n:1})]})).some(e => /doppelt/.test(e)), 'validate: doppelte id');
  ok(V(Object.assign(base(), {checks:[chk('nodes', {n:0, tolerance:1})]})).some(e => /unbekanntes Feld tolerance/.test(e)), 'validate: Tippfehler im Feldnamen');
  ok(V(Object.assign(base(), {checks:[chk('level', {v:0.5, tol:0.1})]})).some(e => /abs:true/.test(e)), 'validate: level ohne abs');
  ok(V(Object.assign(base(), {f:'sin'})).some(e => /Funktion/.test(e)), 'validate: f keine Funktion');
  ok(V(Object.assign(base(), {draw:'x'})).some(e => /draw/.test(e)), 'validate: draw unbekannt');
  ok(V(Object.assign(base(), {wrong:[{f:x => x, fails:['gibtsnicht'], why:'w'}]})).some(e => /unbekanntes Merkmal/.test(e)), 'validate: wrong.fails mit unbekannter id');
  ok(V({id:'a1', title:'t', text:'t', kind:'arrows', reveal:'r', plot:{x:[-2, 2], y:[-2, 2]}, want:[{from:[0, 0], to:[0.2, 0.1], msg:'m'}]}).some(e => /zu kurz/.test(e)), 'validate: Pfeil zu kurz für die Erkennung');
  ok(V({id:'a2', title:'t', text:'t', kind:'arrows', reveal:'r', plot:{x:[-2, 2], y:[-2, 2]}, want:[{from:[0, 0], to:[1, 1], msg:'m'}], wrong:[{arrows:[{from:[0, 0], to:[1, 0]}], fails:[3], why:'w'}]}).some(e => /Indizes/.test(e)), 'validate: wrong.fails außerhalb von want');
  const st1 = SKETCH.selfTest(Object.assign(base(), {checks:[chk('nodes', {n:1})]}));
  ok(!st1.ok && st1.problems.some(p => /ohne Zittern/.test(p)), 'selfTest: Muster erfüllt eigenes Merkmal nicht → gemeldet');
  const st2 = SKETCH.selfTest(Object.assign(base(), {wrong:[{f:x => Math.sin(PI * x) * 0.9, fails:['c'], why:'fast gleich'}]}));
  ok(!st2.ok && st2.problems.some(p => /erfüllt 'c'/.test(p)), 'selfTest: Fehlskizze, die nicht durchfällt → gemeldet');
  const st3 = SKETCH.selfTest(Object.assign(base(), {wrong:[{f:x => x < 0.4 ? 0.5 : NaN, fails:['c'], why:'halb'}]}));
  ok(!st3.ok && st3.problems.some(p => /Überdeckung/.test(p)), 'selfTest: Fehlskizze scheitert nur an der Überdeckung → gemeldet');
}
{
  const src = fs.readFileSync(path.join(__dirname, '..', 'src/engine/80-sketch.js'), 'utf8');
  ok(!/\brequire\s*\(|\bmodule\.exports|\bimport\s|\bexport\s|\bdocument\.|\bwindow\./.test(src), 'Kern ohne require/Module/DOM');
  ok(/^const SKETCH = \(function\(\)\{/m.test(src), 'globales const SKETCH');
  for (const k of ['map', 'dom', 'sample', 'evaluate', 'model', 'arrows', 'synth', 'validate', 'selfTest']) ok(typeof SKETCH[k] === 'function', 'Schnittstelle: SKETCH.' + k);
}

/* ================= (d) Physik der Beispiel-Musterfunktionen ================= */
{
  const C1 = (f, x, tag) => { const h = 1e-6, H = 1e-4; const jv = Math.abs(f(x + h) - f(x - h)); const dl = (f(x - h) - f(x - H)) / (H - h), dr = (f(x + H) - f(x + h)) / (H - h); const sc = Math.max(1e-9, Math.abs(dl) + Math.abs(dr) + 1);
    ok(jv < 1e-4 && Math.abs(dl - dr) / sc < 3e-3, 'Physik: ' + tag + ' stetig und stetig differenzierbar bei x = ' + x, {jv, dl, dr}); };
  const B = PHYS.BAR;
  C1(B.f, 0, 'Barriere Re ψ'); C1(B.f, B.d, 'Barriere Re ψ');
  ok(Math.abs(B.S.R + B.S.T - 1) < 1e-10, 'Physik: Barriere R + T = 1', {R:B.S.R, T:B.S.T});
  const tA = PHYS.cabs(B.S.t);
  ok([0.1, 0.3, 0.5].every(x => Math.abs(B.f(x) - tA * Math.cosh(B.kap * (x - B.d))) < 1e-9), 'Physik: Re ψ in der Barriere = |t|·cosh(κ(x − d)) (Phase reell an x = d)');
  const kT = B.k, Texact = 1 / (1 + (B.V0 ** 2) * Math.sinh(B.kap * B.d) ** 2 / (4 * B.E * (B.V0 - B.E)));
  ok(Math.abs(B.S.T - Texact) < 1e-10, 'Physik: Transfermatrix-T = geschlossene Formel', {T:B.S.T, Texact});
  for (const [S, tag] of [[PHYS.STEP, 'Stufe'], [PHYS.STEPL, 'Stufe lang']]){
    C1(S.f, 0, tag); ok(Math.abs(S.S.R + S.S.T - 1) < 1e-10, 'Physik: ' + tag + ' R + T = 1');
    const r = (S.k - S.q) / (S.k + S.q); ok(Math.abs(PHYS.cabs(S.S.r) - Math.abs(r)) < 1e-10 && Math.abs(PHYS.cabs(S.S.t) - 2 * S.k / (S.k + S.q)) < 1e-10, 'Physik: ' + tag + ' r = (k − q)/(k + q), t = 2k/(k + q)');
    ok(Math.abs(S.k / S.q - 1.7) < 1e-12, 'Physik: ' + tag + ' λ rechts / λ links = k/q = 1,7');
  }
  for (const [W, tag, par] of [[PHYS.WELL, 'Topf Grundzustand', 1], [PHYS.WELL2, 'Topf 1. angeregt', -1]]){
    C1(W.f, -0.5, tag); C1(W.f, 0.5, tag);
    ok(W.E < 8 && W.E > 0, 'Physik: ' + tag + ' gebunden (0 < E < V0)', W.E);
    ok([0.2, 0.7, 1.3].every(x => Math.abs(W.f(-x) - par * W.f(x)) < 1e-12), 'Physik: ' + tag + ' Parität');
    // Schrödinger-Gleichung innen und außen: −ψ''/2 + Vψ = Eψ
    const h = 1e-4, se = x => { const d2 = (W.f(x + h) - 2 * W.f(x) + W.f(x - h)) / (h * h); return -d2 / 2 + (Math.abs(x) < 0.5 ? 0 : 8) * W.f(x) - W.E * W.f(x); };
    ok([0.1, 0.3, 0.8, 1.2].every(x => Math.abs(se(x)) < 1e-3), 'Physik: ' + tag + ' erfüllt die Schrödinger-Gleichung');
  }
  ok(Math.abs(PHYS.hermite(2, 1.3) - (4 * 1.69 - 2)) < 1e-12 && Math.abs(PHYS.hermite(3, 0.7) - (8 * 0.343 - 12 * 0.7)) < 1e-12, 'Physik: Hermite H2, H3');
  { let n = 0, p = PHYS.hermite(10, -6); for (let x = -6; x <= 6; x += 0.001){ const v = PHYS.hermite(10, x); if (v * p < 0) n++; p = v; } ok(n === 10, 'Physik: ψ10 hat 10 Knoten', n); }
  { const P = PHYS.P20; let I = 0; for (let r = 0; r < 60; r += 0.001) I += P(r + 0.0005) * 0.001; ok(Math.abs(I - 8) < 1e-6, 'Physik: ∫ r²(2 − r)²e^{−r} dr = 8 (Normierung 1/8)', I);
    const r1 = 3 - Math.sqrt(5), r2 = 3 + Math.sqrt(5); ok(P(r1) < P(r2) && Math.abs(P(r1) / P(r2) - 0.2725) < 0.002, 'Physik: 2s-Maxima bei 3 ∓ √5, inneres kleiner', P(r1) / P(r2)); }
  { const g = SAMPLES.find(s => s.id === 'smp-gaussdichte').f; let I = 0; for (let x = -10; x < 10; x += 0.001) I += g(x + 0.0005) * 0.001; ok(Math.abs(I - 1) < 1e-9, 'Physik: Normalverteilung hat Fläche 1'); }
  ok(Math.abs(0.5 * Math.sqrt(1 + 3) - 1) < 1e-12, 'Physik: Gauß-Paket σ(√3 τ) = 2σ0 = 1');
}

/* ================= (b) Beispielaufgaben: Schema, Selbsttest, Statistik ================= */
{
  const seen = new Set();
  for (const sp of SAMPLES){
    ok(!seen.has(sp.id), 'Beispiel-id eindeutig ' + sp.id); seen.add(sp.id);
    const v = SKETCH.validate(sp); ok(v.length === 0, 'validate ' + sp.id, v);
    const t0 = Date.now(); const st = SKETCH.selfTest(sp); const dt = Date.now() - t0;
    ok(st.ok, 'selfTest ' + sp.id, st.problems.slice(0, 4)); ok(dt < 2000, 'selfTest-Dauer ' + sp.id + ' (' + dt + ' ms)');
  }
  ok(SAMPLES.length >= 12, 'mindestens 12 Beispielaufgaben (' + SAMPLES.length + ')');
  const NS = QUICK ? 15 : 60, STR = [1, 2, 3];
  const tot = {}, totW = {};
  const rows = [];
  for (const sp of SAMPLES){
    const src = sp.kind === 'arrows' ? sp.want : sp.f, row = {id:sp.id};
    for (const nz of [0.03, 0.06, 0.09]){
      let pass = 0, n = 0;
      for (let s = 1; s <= NS; s++) for (const k of STR){ const r = SKETCH.evaluate(sp, SKETCH.synth(sp, src, {seed:100003 * s + 7919 * k + 17, noise:nz, strokes:k})); n++; if (r.ok) pass++; }
      row[nz] = pass / n; (tot[nz] = tot[nz] || [0, 0])[0] += pass; tot[nz][1] += n;
    }
    for (const nz of [0.03, 0.06]){
      let det = 0, n = 0;
      (sp.wrong || []).forEach((w, wi) => { for (let s = 1; s <= NS; s++) for (const k of STR){
        const r = SKETCH.evaluate(sp, SKETCH.synth(sp, sp.kind === 'arrows' ? w.arrows : w.f, {seed:100019 * s + 104729 * (wi + 1) + 31 * k, noise:nz, strokes:k}));
        n++; if (w.fails.every(q => { const x = sp.kind === 'arrows' ? r.results[q] : r.results.find(y => y.id === q); return !x || !x.ok; })) det++; } });
      row['W' + nz] = n ? det / n : 1; (totW[nz] = totW[nz] || [0, 0])[0] += det; totW[nz][1] += n;
    }
    rows.push(row);
    ok(row[0.03] >= 0.995 && row[0.06] >= 0.995, 'Statistik ' + sp.id + ': Muster besteht bei noise 0,03/0,06', row);
    ok(row[0.09] >= 0.95, 'Statistik ' + sp.id + ': Muster besteht bei noise 0,09 zu ≥ 95 %', row);
    ok(row['W0.03'] >= 0.995, 'Statistik ' + sp.id + ': Fehlskizzen fallen bei noise 0,03 durch', row);
  }
  const pct = v => (100 * v).toFixed(2).replace('.', ',') + ' %';
  console.log('Beispielaufgaben:', SAMPLES.length, '· je Rauschstufe', NS, 'Startwerte × 1–3 Striche');
  if (VERB) for (const r of rows) console.log('  ' + r.id.padEnd(18), [0.03, 0.06, 0.09].map(z => pct(r[z])).join(' / '), ' falsch erkannt:', pct(r['W0.03']), '/', pct(r['W0.06']));
  console.log('Muster bestanden: noise 0,03', pct(tot[0.03][0] / tot[0.03][1]), '(' + tot[0.03][0] + '/' + tot[0.03][1] + ') · 0,06', pct(tot[0.06][0] / tot[0.06][1]), '(' + tot[0.06][0] + '/' + tot[0.06][1] + ') · 0,09', pct(tot[0.09][0] / tot[0.09][1]), '(' + tot[0.09][0] + '/' + tot[0.09][1] + ')');
  console.log('Fehlskizzen erkannt (alle genannten Merkmale verfehlt): noise 0,03', pct(totW[0.03][0] / totW[0.03][1]), '(' + totW[0.03][0] + '/' + totW[0.03][1] + ') · 0,06', pct(totW[0.06][0] / totW[0.06][1]), '(' + totW[0.06][0] + '/' + totW[0.06][1] + ')');
}

/* ================= (e) Zweites, unabhängig gebautes Handmodell (nicht zum Einstellen der Schwellen benutzt) =================
   Fehler je Bogen: jeder Knoten einzeln verschoben (bis 0,6·noise des Nachbarabstands), eigene Amplitude je Buckel (±1,5·noise),
   gleichmäßige x-Punkte (120–240 je Kurve), weißes Zittern, 1–2 Striche mit Überlappung, keine Rundung. */
function prng2(seed){ let a = seed >>> 0 || 1; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function hand2(sp, f, seed, lev){
  const R = prng2(seed), P = SKETCH.plotOf(sp), d0 = P.dom[0], d1 = P.dom[1], W = d1 - d0, M = 3000;
  const us = Array.from({length:M}, (_, i) => d0 + W * i / (M - 1)), fu = us.map(u => { const v = f(u); return isFinite(v) ? v : NaN; });
  const zs = []; for (let i = 0; i + 1 < M; i++) if (fu[i] * fu[i + 1] < 0) zs.push(us[i] - fu[i] * (us[i + 1] - us[i]) / (fu[i + 1] - fu[i]));
  // jeder Knoten einzeln verschoben (bis lev·0,6 des Abstands zum Nachbarn), stückweise linear dazwischen
  const knots = [d0, ...zs, d1], moved = knots.map((z, j) => { if (j === 0 || j === knots.length - 1) return z; const gap = Math.min(z - knots[j - 1], knots[j + 1] - z); return z + (2 * R() - 1) * lev * 0.6 * gap; });
  const xOfU = u => { let j = 0; while (j + 1 < knots.length - 1 && u > knots[j + 1]) j++; const t = (u - knots[j]) / (knots[j + 1] - knots[j] || 1); return moved[j] + t * (moved[j + 1] - moved[j]); };
  const amp = knots.map(() => 1 + (2 * R() - 1) * 1.5 * lev);
  const ampOfU = u => { let j = 0; while (j + 1 < knots.length - 1 && u > knots[j + 1]) j++; return amp[j]; };
  let mf = 0; for (const v of fu) if (isFinite(v)) mf = Math.max(mf, Math.abs(v));
  let sc = 1; if (!P.abs){ sc = Math.max(Math.abs(P.y[0]), Math.abs(P.y[1])) * (0.6 + 0.3 * R()) / mf; if (P.draw === 'psi' && R() < 0.5) sc = -sc; }
  const A = Math.abs(sc) * mf, npt = 120 + Math.floor(120 * R());
  const pts = []; for (let i = 0; i < npt; i++){ const u = d0 + W * (i + (i && i < npt - 1 ? (R() - 0.5) * 0.6 : 0)) / (npt - 1); const v = f(u); if (!isFinite(v)) continue; pts.push([xOfU(u), sc * v * ampOfU(u) + (R() - 0.5) * 0.5 * lev * A * 0.4]); }
  const k = 1 + Math.floor(R() * 2); if (k === 1) return [pts];
  const c = Math.floor(pts.length * (0.3 + 0.4 * R())); return [pts.slice(0, c + 2), pts.slice(c - 1)];
}
{
  const NS = QUICK ? 30 : 100, tot = {}, totW = [0, 0];
  for (const sp of SAMPLES.filter(s => s.kind !== 'arrows')){
    for (const lev of [0.03, 0.06, 0.09]){ let p = 0; for (let s = 1; s <= NS; s++) if (SKETCH.evaluate(sp, hand2(sp, sp.f, s * 31 + 7, lev)).ok) p++; (tot[lev] = tot[lev] || [0, 0])[0] += p; tot[lev][1] += NS; ok(p / NS >= 0.95, 'Handmodell 2: ' + sp.id + ' besteht bei noise ' + lev, p + '/' + NS); }
    (sp.wrong || []).forEach((w, wi) => { let d = 0; for (let s = 1; s <= NS; s++){ const r = SKETCH.evaluate(sp, hand2(sp, w.f, s * 37 + wi * 1009, 0.03)); if (w.fails.every(q => !r.results.find(y => y.id === q).ok)) d++; } totW[0] += d; totW[1] += NS; ok(d / NS >= 0.95, 'Handmodell 2: Fehlskizze ' + sp.id + '/' + wi + ' fällt durch', d + '/' + NS); });
  }
  const pct = v => (100 * v).toFixed(2).replace('.', ',') + ' %';
  console.log('Handmodell 2 (Kurven): Muster bestanden 0,03', pct(tot[0.03][0] / tot[0.03][1]), '· 0,06', pct(tot[0.06][0] / tot[0.06][1]), '· 0,09', pct(tot[0.09][0] / tot[0.09][1]), '· Fehlskizzen erkannt', pct(totW[0] / totW[1]), '(' + totW[0] + '/' + totW[1] + ')');
}

console.log('Skizzen-Kern:', nOk, 'ok,', nBad, 'Fehler');
process.exit(nBad ? 1 : 0);
