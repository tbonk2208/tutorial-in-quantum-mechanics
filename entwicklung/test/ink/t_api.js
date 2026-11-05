/* Schnittstelle für Agent U: recognizeInk, inkContext, inkItemChoices, inkApplyChoice, inkClassifySymbol, HANDQ, SYMQ_CLASSES */
const lib = require('./lib.js'), syn = require('./synth.js');
const E = lib.load({});
let nErr = 0;
const ok = (c, msg) => { if (!c){ nErr++; console.log('FEHLER', msg); } };
ok(E.inkModelReady(), 'Modell nicht geladen');
ok(Array.isArray(E.SYMQ_CLASSES) && E.SYMQ_CLASSES.length > 30, 'SYMQ_CLASSES leer');
/* leere Eingabe */
const r0 = E.recognizeInk([], E.inkContext(null));
ok(r0.text === '' && Array.isArray(r0.alts) && Array.isArray(r0.items) && r0.conf === 0, 'leere Eingabe');
/* Zusammenhang aus einer Aufgabe + Zeilen darüber */
const t = E.TOPICS.find(x => x.id === 'kasten'), task = t.practice[0];
const rc = E.inkContext(E.makeCtx(task.ctx), ['ψ(x) = A sin(k x)']);
ok(rc.letters.has('a') && rc.letters.has('k') && rc.letters.has('A'), 'Buchstaben der Aufgabe fehlen');
/* Zeile erkennen */
const sl = syn.synthLine(E.parseLine('k a = π/2', {}), 3);
const res = E.recognizeInk(sl.strokes, rc);
ok(typeof res.text === 'string' && res.items.length >= 4 && res.conf >= 0 && res.conf <= 1, 'Ergebnis unvollständig');
ok(res.items.every(it => Array.isArray(it.strokes) && it.strokes.length && it.show !== undefined && Array.isArray(it.alts)), 'items ohne strokes/show/alts');
console.log('erkannt:', JSON.stringify(res.text), 'conf', res.conf, 'ms', res.ms, '| Alternativen:', res.alts.map(a => a.text + ' (' + a.score.toFixed(2) + ')').join(' · '));
/* Korrekturmenü und Übernahme */
const ch = E.inkItemChoices(res, 0);
ok(Array.isArray(ch) && ch.length && ch.every(c => 'c' in c && 'text' in c && 'ok' in c), 'inkItemChoices');
const other = ch.find(c => c.c !== res.items[0].c);
if (other){ const r2 = E.inkApplyChoice(res, 0, other.c); ok(r2.text === other.text && r2.items[0].c === other.c, 'inkApplyChoice'); console.log('Zeichen 1 als', other.show, '→', JSON.stringify(r2.text)); }
/* Einzelzeichen */
const one = E.inkClassifySymbol(res.items[0].strokes);
ok(Array.isArray(one) && one.length && Array.isArray(one[0]) && typeof one[0][1] === 'number', 'inkClassifySymbol');
/* eigene Handschrift (in Node im Speicher) */
E.HANDQ.clear();
ok(E.HANDQ.count() === 0, 'HANDQ.clear');
ok(E.HANDQ.add(res.items[0].strokes, res.items[0].c, 'cal') === 1, 'HANDQ.add');
ok(E.HANDQ.add(res.items[0].strokes, 'kein-zeichen', 'cal') === 0, 'HANDQ.add unbekannte Klasse');
ok(E.HANDQ.count(res.items[0].c) === 1, 'HANDQ.count');
for (let k = 0; k < 10; k++) E.HANDQ.add(res.items[0].strokes, res.items[0].c, 'fix');
ok(E.HANDQ.count(res.items[0].c) === 8, 'HANDQ höchstens 8 je Zeichen');
/* Anlernen wirkt: ein angelerntes Zeichen wird sicherer erkannt */
const before = E.inkClassifySymbol(res.items[1].strokes)[0];
for (let k = 0; k < 3; k++) E.HANDQ.add(res.items[1].strokes, 'ω', 'cal');
const after = E.inkClassifySymbol(res.items[1].strokes)[0];
ok(after[0] === 'ω', 'eigene Handschrift ohne Wirkung');
console.log('eigene Handschrift: vorher', before[0], before[1].toFixed(2), '→ nachher', after[0], after[1].toFixed(2));
E.HANDQ.clear();
console.log(nErr ? 'FEHLER: ' + nErr : 'Schnittstelle ok');
process.exit(nErr ? 1 : 0);
