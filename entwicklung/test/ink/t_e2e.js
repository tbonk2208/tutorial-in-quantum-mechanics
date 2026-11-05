/* Ende-zu-Ende: Musterzeilen aller Übungsziele → synthetische Handschrift → Erkennung → Prüfkern.
   Aufruf:  node test/ink/t_e2e.js [--model=oracle|qm|mathe|<pfad.json>] [--shapes=bank|font] [--seeds=1,2] [--topic=id] [--limit=N] [--show=N] [--json=datei]
   --model=oracle   Zeichenklassen bekannt (nur Lage/Gruppierung/Ausgabe werden geprüft)
   --model=qm       src/ui/model/sym-qm.json (Standard, sobald vorhanden)
   --shapes=bank    Zeichenformen fremder Schreiber aus /home/claude/ink/testdata/strokes_test.json (Standard), font = eigene Strichschrift
   Bewertung: „textgleich“ = gleicher Text ohne Leerzeichen; „gleichwertig“ = checkTask(Musterzeilen bis hier + erkannte Zeile) gibt für die erkannte Zeile ok. */
const fs = require('fs'), path = require('path');
const lib = require('./lib.js'), syn = require('./synth.js');
const arg = k => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : null; };
const modelSel = arg('model') || (fs.existsSync(lib.QM_MODEL) ? 'qm' : 'oracle');
const shapes = arg('shapes') || 'bank';
const seeds = (arg('seeds') || '1').split(',').map(Number);
const onlyTopic = arg('topic'), limit = +(arg('limit') || 0), show = +(arg('show') || 0);
/* --half=tune: Themen mit geradem Index (zum Abstimmen), --half=test: ungerade (zurückgehalten) */
const half = arg('half');
const E = lib.load({model:modelSel});
const BANKF = '/home/claude/ink/testdata/strokes_test.json';
const bank = shapes === 'bank' && fs.existsSync(BANKF) ? JSON.parse(fs.readFileSync(BANKF, 'utf8')) : null;
/* Herkunft je Probe (HASY-Skelette werden zu zusammenhängenden Strichen verbunden; --rawhasy lässt sie zerstückelt) */
if (bank){ const MF = BANKF.replace('.json', '_meta.json'); if (fs.existsSync(MF)) Object.defineProperty(bank, '__meta', {value:JSON.parse(fs.readFileSync(MF, 'utf8')).samples}); if (process.argv.includes('--rawhasy')) Object.defineProperty(bank, '__raw', {value:true}); }
const useOracle = modelSel === 'oracle';
/* --writer: Szenario „ein Schreiber“ – Zeichen einer Zeile aus den CROHME-Testausdrücken eines Schreibers (crohme_expr.json, sonst übersprungen) */
let WRITERS = null;
if (process.argv.includes('--writer') && bank){
  const WF = '/home/claude/ink/r-work/crohme_expr.json';
  if (fs.existsSync(WF)){
    const MAP = {'\\alpha':'α', '\\beta':'β', '\\gamma':'γ', '\\theta':'θ', '\\lambda':'λ', '\\mu':'μ', '\\pi':'π', '\\sigma':'σ', '\\phi':'φ', '\\Delta':'Δ', '\\sum':'Σ', '\\int':'∫', '\\infty':'∞', '\\sqrt':'sqrt', '\\pm':'pm', '\\lt':'⟨', '\\gt':'⟩', '\\{':'{', '\\}':'}', '\\prime':"'", 'X':'x', 'o':'0'};
    const by = {};
    for (const ex of JSON.parse(fs.readFileSync(WF, 'utf8')).test){ const w = by[ex.writer] || (by[ex.writer] = {}); for (const sy of ex.syms){ const c = MAP[sy.lab] || sy.lab; (w[c] = w[c] || []).push(sy.strokes); } }
    WRITERS = Object.values(by).filter(w => Object.keys(w).length >= 12);
    console.log('Szenario ein Schreiber:', WRITERS.length, 'CROHME-Testschreiber mit ≥ 12 Zeichenarten');
  } else console.log('crohme_expr.json fehlt – Szenario ein Schreiber übersprungen');
}
const good = st => ['ok', 'def', 'info'].includes(st);
const pc = (a, b) => b ? (100 * a / b).toFixed(1) + ' %' : '–';
const nospace = s => String(s).normalize('NFC').replace(/\s+/g, '');
const stats = {n:0, eq:0, same:0, skip:0, ms:[], byType:{}, byTopic:{}, errs:{}, fails:[]};
const bump = (o, k, f) => { const x = o[k] || (o[k] = {n:0, eq:0, same:0}); x.n++; if (f.eq) x.eq++; if (f.same) x.same++; };
function lev(a, b){ const m = a.length, n = b.length; let prev = Array.from({length:n + 1}, (_, j) => j); for (let i = 1; i <= m; i++){ const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; } return prev[n]; }
/* kleinster unterschiedlicher Abschnitt zweier Texte (für die Fehlerliste) */
function diff(a, b){
  a = [...nospace(a)]; b = [...nospace(b)];
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  let j = 0; while (j < a.length - i && j < b.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j++;
  return a.slice(i, a.length - j).join('') + ' → ' + b.slice(i, b.length - j).join('');
}
let count = 0;
const t0 = Date.now();
outer:
for (const [ti, t] of E.TOPICS.entries()){
  if (onlyTopic && t.id !== onlyTopic) continue;
  if (half === 'tune' && ti % 2) continue;
  if (half === 'test' && !(ti % 2)) continue;
  for (const task of t.practice){
    const ctx = task.ctx.__ctx || (task.ctx.__ctx = E.makeCtx(task.ctx));
    for (const g of task.goals){
      const lines = (g.model || []).map(m => typeof m === 'string' ? m : m.l);
      for (let i = 0; i < lines.length; i++){
        const line = lines[i];
        let ast;
        try { ast = E.parseLine(line, ctx.pctx); } catch(e){ stats.skip++; continue; }
        if (ast.words && ast.words.length){ stats.skip++; continue; }
        const types = [...syn.structTypes(ast)];
        for (const seed of seeds){
          if (WRITERS){
            /* Schreiber mit der besten Abdeckung der Zeichen dieser Zeile (bei Gleichstand reihum) */
            const need = new Set(syn.synthLine(ast, 1).glyphs.map(g => g.cls));
            let best = null, bs = -1; WRITERS.forEach((w, q) => { const sc = [...need].filter(c => w[c]).length + ((q + count) % WRITERS.length === 0 ? 0.5 : 0); if (sc > bs){ bs = sc; best = w; } });
            Object.defineProperty(bank, '__wb', {value:best, configurable:true, writable:true});
          }
          const sl = syn.synthLine(ast, seed * 1000 + count, {bank});
          if (sl.missing.length){ stats.skip++; (stats.missing = stats.missing || {}), sl.missing.forEach(c => { stats.missing[c] = (stats.missing[c] || 0) + 1; }); continue; }
          const rctx = E.inkContext(ctx, lines.slice(0, i));
          if (useOracle) rctx.oracle = syn.oracle;
          const t1 = Date.now();
          const ro = {}; if (arg('lm') !== null) ro.lmW = +arg('lm'); if (arg('pos') !== null) ro.posW = +arg('pos'); if (arg('wn') !== null) ro.wN = +arg('wn'); if (arg('fnb') !== null) ro.fnB = +arg('fnb');
          if (arg('wother') !== null) rctx.wOther = +arg('wother'); if (arg('wfn') !== null) rctx.wFn = +arg('wfn');
          const res = E.recognizeInk(sl.strokes, rctx, ro);
          { const a = [...nospace(line)], b = [...nospace(res.text)]; stats.ced = (stats.ced || 0) + lev(a, b); stats.cn = (stats.cn || 0) + a.length; }
          stats.ms.push({ms:Date.now() - t1, n:sl.glyphs.length});
          const same = nospace(res.text) === nospace(line);
          const equiv = txt => { if (!txt) return false; if (nospace(txt) === nospace(line)) return true; try { const r = E.checkTask(task.ctx, g, lines.slice(0, i + 1).concat([txt]), 'ink'); return good(r.lines[r.lines.length - 1].status); } catch(e){ return false; } };
          const eq = same || equiv(res.text);
          /* richtige Zeile unter den ersten 3 bzw. 5 Lesarten (Chips der Oberfläche) */
          let rank = eq ? 1 : 0;
          if (!rank){ const A = res.alts.map(a => a.text); for (let q = 0; q < Math.min(5, A.length); q++){ if (A[q] === res.text) continue; if (equiv(A[q])){ rank = q + 1; break; } } }
          stats.top3 = (stats.top3 || 0) + (rank && rank <= 3 ? 1 : 0); stats.top5 = (stats.top5 || 0) + (rank && rank <= 5 ? 1 : 0);
          const f = {eq, same};
          stats.n++; if (eq) stats.eq++; if (same) stats.same++;
          bump(stats.byTopic, t.id, f);
          types.forEach(k => bump(stats.byType, k, f));
          if (!types.length) bump(stats.byType, '(einfach)', f);
          if (!eq){ const d = diff(line, res.text); stats.errs[d] = (stats.errs[d] || 0) + 1; stats.fails.push({topic:t.id, line, got:res.text, seed:seed * 1000 + count}); }
          count++;
          if (limit && count >= limit) break outer;
        }
      }
    }
  }
}
console.log('Modell:', E.modelName, '| Zeichenformen:', bank ? 'fremde Schreiber (strokes_test.json)' : 'eigene Strichschrift', '| Startwerte:', seeds.join(','));
console.log('Zeichenfehlerrate (Levenshtein auf dem Text ohne Leerzeichen):', (100 * stats.ced / stats.cn).toFixed(1) + ' %', '| Themen:', half || 'alle');
console.log('Top-1', pc(stats.eq, stats.n), '| Top-3', pc(stats.top3, stats.n), '| Top-5', pc(stats.top5, stats.n));
console.log('Zeilen:', stats.n, '| gleichwertig:', stats.eq, pc(stats.eq, stats.n), '| textgleich:', stats.same, pc(stats.same, stats.n), '| nicht darstellbar:', stats.skip, stats.missing ? JSON.stringify(stats.missing) : '');
const ms = stats.ms.map(x => x.ms).sort((a, b) => a - b), typ = stats.ms.filter(x => x.n >= 15 && x.n <= 25).map(x => x.ms).sort((a, b) => a - b);
if (WRITERS) console.log('Anteil Zeichen vom selben Schreiber:', pc(bank.__wbHits || 0, (bank.__wbHits || 0) + (bank.__wbMiss || 0)));
console.log('Zeit je Zeile: Median', ms[Math.floor(ms.length / 2)], 'ms, 95 %', ms[Math.floor(ms.length * 0.95)], 'ms; Zeilen mit 15–25 Zeichen: Median', typ[Math.floor(typ.length / 2)], 'ms, max', typ[typ.length - 1], 'ms');
console.log('\nnach Strukturtyp (gleichwertig / textgleich):');
for (const [k, v] of Object.entries(stats.byType).sort((a, b) => b[1].n - a[1].n)) console.log('  ' + k.padEnd(16), String(v.n).padStart(4), pc(v.eq, v.n).padStart(8), pc(v.same, v.n).padStart(8));
console.log('\nnach Thema:');
for (const [k, v] of Object.entries(stats.byTopic)) console.log('  ' + k.padEnd(12), String(v.n).padStart(4), pc(v.eq, v.n).padStart(8), pc(v.same, v.n).padStart(8));
console.log('\nhäufigste Fehler (Muster → erkannt):');
Object.entries(stats.errs).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([k, v]) => console.log('  ' + String(v).padStart(3) + '×  ' + k));
if (show) { console.log('\nBeispiele:'); stats.fails.slice(0, show).forEach(f => console.log('  [' + f.topic + ' #' + f.seed + '] ' + f.line + '\n      → ' + f.got)); }
const J = arg('json'); if (J) fs.writeFileSync(J, JSON.stringify(stats, null, 1));
console.log('\nDauer', ((Date.now() - t0) / 1000).toFixed(0), 's');
