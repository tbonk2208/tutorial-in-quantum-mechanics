/* Regressionstests an echten, zusammenhängend geschriebenen CROHME-Ausdrücken (Schreiber nicht im Training bzw. Abstimmsatz).
   Die InkML-Dateien werden nur per Pfad gelesen (Lizenz CC BY-NC-SA, nicht im Projekt abgelegt); fehlen sie, wird übersprungen.
   Je Fall: Zeichenhöhe 40 px wie auf der Schreibfläche, Buchstaben der Formel als Aufgabenzusammenhang, Vergleich über den Parser.
   node test/ink/t_crohme_real.js [--verbose]   (Messaufbau und Ergebnisse: /home/claude/ink/check/REPORT.md) */
const fs = require('fs'), path = require('path');
const lib = require('./lib.js');
const BASE = '/home/claude/dl/crohme_data/CROHME_full_v2/CROHME2013_data';
if (!fs.existsSync(BASE)){ console.log('CROHME-Daten fehlen – übersprungen'); process.exit(0); }
const E = lib.load({content:false});
if (!E.inkModelReady()){ console.log('kein Modell – übersprungen'); process.exit(0); }
const verbose = process.argv.includes('--verbose');

/* InkML: Striche in Schreibreihenfolge (trace-id), Zeichengruppen mit Klasse */
function readInkml(file){
  const s = fs.readFileSync(file, 'utf8');
  const tr = {};
  for (const m of s.matchAll(/<trace id="(\d+)"[^>]*>([^<]*)<\/trace>/g)) tr[m[1]] = m[2].split(',').map(p => p.trim().split(/\s+/).map(Number)).filter(p => p.length >= 2 && isFinite(p[0]) && isFinite(p[1])).map(p => [p[0], p[1]]);
  const ids = Object.keys(tr).filter(k => tr[k].length).map(Number).sort((a, b) => a - b);
  const pos = {}; ids.forEach((k, i) => { pos[k] = i; });
  const groups = [];
  for (const part of s.split('<traceGroup').slice(1)){
    const lab = (/<annotation type="truth">([^<]*)<\/annotation>/.exec(part) || [])[1];
    const refs = [...part.split(/<\/traceGroup>|<traceGroup/)[0].matchAll(/traceDataRef="(\d+)"/g)].map(m => pos[+m[1]]).filter(x => x !== undefined);
    if (lab && lab !== 'Segmentation' && refs.length) groups.push({lab, traces:refs});
  }
  return {traces:ids.map(k => tr[k]), groups};
}
/* Zeichenhöhe (Median der Ziffern/Großbuchstaben/Oberlängen) auf 40 px, Punkte wie die Oberfläche ausdünnen */
function toCanvas(d, H){
  const bb = pts => { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); return {x0:Math.min(...xs), y0:Math.min(...ys), h:Math.max(...ys) - Math.min(...ys), w:Math.max(...xs) - Math.min(...xs)}; };
  const med = a => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
  let hs = d.groups.filter(g => /^([0-9A-Zbdhklt])$/.test(g.lab)).map(g => bb(g.traces.flatMap(t => d.traces[t])).h);
  if (!hs.length) hs = d.groups.filter(g => /^[acemnrsuvwxz]$/.test(g.lab)).map(g => bb(g.traces.flatMap(t => d.traces[t])).h / 0.6);
  if (!hs.length) hs = d.groups.map(g => { const b = bb(g.traces.flatMap(t => d.traces[t])); return Math.max(b.w, b.h); });
  const k = H / med(hs), all = bb(d.traces.flat());
  return d.traces.map(t => { const o = []; for (const [x, y] of t){ const p = {x:(x - all.x0) * k + 20, y:(y - all.y0) * k + 20}; const q = o[o.length - 1]; if (!q || Math.hypot(p.x - q.x, p.y - q.y) >= 0.8) o.push(p); } return o; });
}
const nrm = t => { try { return E.texLine(E.parseLine(t, {})).replace(/\\left|\\right|\\,|\\cdot|\s+/g, ''); } catch(e){ return 'ERR:' + t; } };
/* [Datei, erwartete Lesart(en) in der Eingabesprache, behobene Ursache] */
const CASES = [
  ['TestINKMLGT/103_em_11.inkml', 'T = T_0 + ΔT', 'kleiner Index kaum tiefer'],
  ['TestINKMLGT/104_em_39.inkml', 'S_{max} = P α/(1 - α)', 'Index aus mehreren Buchstaben, Klammern in der Ausgabe'],
  ['TestINKMLGT/117_em_192.inkml', 'a = 8R/sqrt(3)', 'Wurzel im Nenner breiter als der Bruchstrich'],
  ['TestINKMLGT/rit_4270_2.inkml', 'a/b', 'schräger Bruchstrich'],
  ['TestINKMLGT/118_em_227.inkml', 'L_v = 3335 - 2,91T', 'Dezimalkomma'],
  ['TestINKMLGT/122_em_348.inkml', 'T_{ij} = P a^2 γ_{ij}', 'Reihenfolge i, j'],
  ['TrainINKML/HAMEX/formulaire029-equation031.inkml', 'a = 3', 'gewölbtes = ist kein Dach'],
  ['TrainINKML/expressmatch/94_jorge.inkml', ['a/(sin A) = b/(sin B) = c/(sin C)', 'a/(sin A) = b/(sin B) = c/(sin c)'], 'Nenner breiter als der Strich (C/c ist eine Verwechslung des Netzes)'],
  ['TrainINKML/expressmatch/116_alfonso.inkml', 'x = (-b ± sqrt(b^2 - 4a c))/(2a)', 'Nenner weit unter dem Strich'],
  ['TrainINKML/HAMEX/formulaire032-equation066.inkml', '(-1 + i sqrt(3))/2', 'Vorzeichen des Zählers vor dem Strich'],
  ['TrainINKML/MathBrush/200926-1617-228.inkml', '33.5', 'Dezimalpunkt auf Achsenhöhe zwischen Ziffern'],
];
let ok = 0, bad = 0, skip = 0;
for (const [f, want, why] of CASES){
  const file = path.join(BASE, f);
  if (!fs.existsSync(file)){ skip++; continue; }
  const d = readInkml(file);
  const W = Array.isArray(want) ? want : [want];
  const res = E.recognizeInk(toCanvas(d, 40), E.inkContext(null, [W[0]]));
  const good = W.some(w => nrm(res.text) === nrm(w));
  if (good) ok++; else bad++;
  if (!good || verbose) console.log((good ? 'ok     ' : 'FEHLER ') + f + ' (' + why + ') | erkannt: ' + JSON.stringify(res.text) + (good ? '' : ' | erwartet: ' + JSON.stringify(want)));
}
console.log('CROHME-Regression (echte Ausdrücke):', ok, '/', ok + bad, skip ? '(' + skip + ' Dateien fehlen)' : '', bad ? 'FEHLER' : 'ok');
process.exit(bad ? 1 : 0);
