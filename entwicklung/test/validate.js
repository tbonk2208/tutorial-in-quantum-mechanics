/* Prüft alle Inhalte: Musterlösungen mit dem Prüfkern, Formeln mit KaTeX, Auswahlfragen */
const fs = require('fs'), path = require('path');
const katex = require('/opt/npm-tools/node_modules/katex');
const ls = d => fs.readdirSync(path.join(__dirname, '..', d)).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(path.join(__dirname, '..', d, f), 'utf8'));
const code = ls('src/engine').join('\n;\n') + '\n;\n' + ls('src/content').join('\n;\n');
const E = new Function(code + '\n;return {TOPICS, LEX, checkTask, parseLine, texLine, makeCtx};')();
const args = process.argv.slice(2); const STRICT = args.includes('--strict'); const only = args.find(a => !a.startsWith('--'));
let nWarn = 0; const warn = (...a) => { nWarn++; if (STRICT) err(...a); else if (args.includes('--warn')) console.log('WARNUNG', ...a); };
let nErr = 0, nGoals = 0, nLines = 0;
const err = (...a) => { nErr++; console.log('FEHLER', ...a); };
const LABTYPES = ['complex','prob','twostate','box','packet','barrier','measure','osc','ylm','hydrogen','spin','perturb','delta','vectors','eigen','expand','fourier','ode','special'];
const texCheck = (s, where) => {
  if (!s) return;
  const parts = [...String(s).matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)];
  for (const m of parts){ const t = m[1] || m[2]; try { katex.renderToString(t, {throwOnError:true, strict:'ignore'}); } catch(e){ err('KaTeX', where, JSON.stringify(t).slice(0, 80), e.message.slice(0, 100)); } }
};
const plain = s => String(s || '').replace(/\$[^$]*\$/g, m => m.slice(1, -1).replace(/\\[a-zA-Z]+/g, 'x').replace(/[{}^_ ]/g, '')).replace(/\s+/g, ' ').trim();
const lenCheck = (q, where) => { if (!q || !q.opts || q.opts.length < 2 || !(q.a >= 0) || q.type === 'dialog') return; const L = q.opts.map(o => plain(o).length); const other = Math.max(...L.filter((_, i) => i !== q.a)); if (L[q.a] > 1.3 * other + 3) warn('MC: richtige Option deutlich am längsten', where, L.join('/')); };
const mcCheck = (q, where) => { if (!q) return; lenCheck(q, where); texCheck(q.q, where); (q.opts || []).forEach(o => texCheck(o, where)); texCheck(q.ex, where); if (!(q.a >= 0 && q.a < q.opts.length)) err('MC-Antwort', where); };
function runGoal(task, g, where, given){
  nGoals++;
  const lines = (g.model || []).map(m => typeof m === 'string' ? m : m.l);
  if (!lines.length){ err('keine Musterlösung', where); return; }
  let r;
  const t0 = Date.now();
  try { r = E.checkTask(task.ctx, g, lines, task.id + ':' + g.id); } catch(e){ err('Ausnahme', where, e.stack.split('\n').slice(0, 3).join(' | ')); return; }
  const dt = Date.now() - t0;
  r.lines.forEach((l, i) => { nLines++; if (!['ok', 'def', 'info'].includes(l.status)) err('Zeile', where, '#' + (i + 1), JSON.stringify(lines[i]), l.status, l.msg || '', (l.steps || []).map(s => s.status + ':' + (s.msg || (s.msgs || []).join('|'))).join(';')); });
  if (!r.final || r.final.state !== 'solved') err('Ziel', where, JSON.stringify(r.final));
  if (dt > 1500) console.log('langsam', where, dt + 'ms');
  for (const m of g.model || []) if (m.gap){ try { E.parseLine(m.gap.replace(/▢/g, 'Q'), {}); } catch(e){ err('Lücke', where, m.gap); } }
  texCheck(g.prompt, where); (g.hints || []).forEach(x => texCheck(x, where)); texCheck(g.note, where);
  (g.mistakes || []).forEach(m => texCheck(m.msg, where));
  // Lückenaufgabe: gegebene Zeilen müssen stimmen
  if (given){ const rr = E.checkTask(task.ctx, g, given, 'x'); rr.lines.forEach((l, i) => { if (!['ok', 'def', 'info'].includes(l.status)) err('gegebene Zeile', where, given[i], l.status); }); }
}
function runTask(task, where){
  texCheck(task.title, where); texCheck(task.text, where);
  for (const g of task.goals) runGoal(task, g, where + '/' + task.id + ':' + g.id, task.given);
}
for (const t of E.TOPICS){
  if (only && t.id !== only) continue;
  const W = 'T' + t.nr + ' ' + t.id;
  t.goals.forEach(x => texCheck(x, W + ' Ziele')); texCheck(t.needs, W);
  if (t.check.length !== 4) err('Eingangscheck braucht 4 Fragen', W);
  t.check.forEach((q, i) => { mcCheck(q, W + ' Check' + i); if (q.prev && !E.TOPICS.find(x => x.id === q.prev)) err('prev fehlt', W, q.prev); if (q.lex && !E.LEX.find(x => x.id === q.lex)) err('lex fehlt', W, q.lex); });
  const ex = t.example;
  texCheck(ex.text, W);
  // Musterbeispiel: alle Zeilen prüfen
  { const lines = ex.lines.map(l => l.l); const r = E.checkTask(ex.ctx, {type:'free'}, lines, 'ex'); r.lines.forEach((l, i) => { if (!['ok', 'def', 'info'].includes(l.status)) err('Beispielzeile', W, lines[i], l.status, l.msg || '', (l.steps || []).map(s => s.status + ':' + (s.msg || (s.msgs || []).join('|'))).join(';')); }); ex.lines.forEach((l, i) => mcCheck(l.why, W + ' Beispiel' + i)); }
  if (ex.faded) runTask(ex.faded, W + ' Lückenaufgabe');
  mcCheck(t.puzzle.q, W + ' Knobeln'); texCheck(t.puzzle.text, W); texCheck(t.puzzle.reveal, W);
  texCheck(t.clarify.core, W); (t.clarify.keys || []).forEach(x => texCheck(x, W)); (t.clarify.errors || []).forEach(x => texCheck(x, W)); (t.clarify.more || []).forEach(x => texCheck(x.text, W)); (t.clarify.checks || []).forEach((q, i) => mcCheck(q, W + ' Klären' + i));
  texCheck(t.lab.text, W); (t.lab.questions || []).forEach((q, i) => mcCheck(q, W + ' Labor' + i)); mcCheck(t.lab.noPic, W + ' Labor ohne Bild');
  { const c = t.compare; texCheck(c.text, W); for (const side of [c.A, c.B]){ texCheck(side.text, W); const lines = side.model.map(m => typeof m === 'string' ? m : m.l); const r = E.checkTask(c.ctx, {type:'free'}, lines, 'cmp'); r.lines.forEach((l, i) => { if (!['ok', 'def', 'info'].includes(l.status)) err('Vergleich', W, side.name, lines[i], l.status, l.msg || '', (l.steps || []).map(s => s.status + ':' + (s.msg || (s.msgs || []).join('|'))).join(';')); }); } (c.questions || []).forEach((q, i) => mcCheck(q, W + ' Vergleich' + i)); }
  for (const task of t.practice) runTask(task, W);
  // ---- neue Felder (Version 4) ----
  const need = (cond, msg) => { if (!cond) (STRICT ? err : warn)('fehlt/ungültig: ' + msg, W); };
  need(typeof t.wozu === 'string' && t.wozu.length > 40, 'wozu'); texCheck(t.wozu, W); texCheck(t.bridge, W);
  need(Array.isArray(t.diag) && t.diag.length === 2, 'diag (2 Fragen)'); (t.diag || []).forEach((q, i) => mcCheck(q, W + ' Diagnose' + i));
  need(t.phenomenon && t.phenomenon.q && Array.isArray(t.phenomenon.q.fb) && t.phenomenon.q.fb.length === t.phenomenon.q.opts.length, 'phenomenon mit fb je Option');
  if (t.phenomenon){ texCheck(t.phenomenon.title, W); texCheck(t.phenomenon.text, W); texCheck(t.phenomenon.reveal, W); mcCheck(t.phenomenon.q, W + ' Vorhersage'); (t.phenomenon.q.fb || []).forEach(x => texCheck(x, W)); }
  need(Array.isArray(t.teach) && t.teach.length >= 4 && t.teach.length <= 7, 'teach (4–7 Segmente)');
  { let words = 0; const segIds = new Set();
    for (const sg of t.teach || []){
      const SW = W + ' Segment ' + sg.id;
      if (!sg.id || segIds.has(sg.id)) err('Segment-id fehlt/doppelt', SW); segIds.add(sg.id);
      texCheck(sg.title, SW); texCheck(sg.text, SW); words += String(sg.text || '').split(/\s+/).filter(Boolean).length;
      for (const m of String(sg.text || '').matchAll(/\[\[lex:([\w-]+)\|/g)) if (!E.LEX.find(x => x.id === m[1])) err('Lexikon-Verweis fehlt', SW, m[1]);
      if (sg.fig){ texCheck(sg.fig.caption, SW); if (!LABTYPES.includes(sg.fig.lab)) err('Abbildung: Labortyp unbekannt', SW, sg.fig.lab); }
      if (sg.derive){ const lines = sg.derive.lines.map(l => l.l); const r = E.checkTask(sg.derive.ctx, {type:'free'}, lines, 'drv'); r.lines.forEach((l, i) => { if (!['ok', 'def', 'info'].includes(l.status)) err('Herleitungszeile', SW, lines[i], l.status, l.msg || '', (l.steps || []).map(s => s.status + (s.msgs || []).join('|')).join(';')); }); sg.derive.lines.forEach((l, i) => { texCheck(l.w, SW); if (l.why) mcCheck(l.why, SW + ' Warum' + i); }); }
      need(Array.isArray(sg.q) && sg.q.length >= 1 && sg.q.length <= 2, 'Segmentfragen in ' + sg.id); (sg.q || []).forEach((q, i) => mcCheck(q, SW + ' Frage' + i));
    }
    if (t.teach){ const lo = t.ch === 'math' ? 1200 : 1500; if (words < lo) (STRICT ? err : warn)('Erklärtext zu kurz: ' + words + ' Wörter (mind. ' + lo + ')', W); }
    t.__segs = segIds;
  }
  need(t.lab.predict && t.lab.predict.q, 'lab.predict'); if (t.lab.predict) mcCheck(t.lab.predict, W + ' Labor-Vorhersage');
  need(Array.isArray(t.concept) && t.concept.length >= 4 && t.concept.length <= 6, 'concept (4–6)');
  const conceptCheck = (c, where) => { if (!['mc', 'mc2', 'dialog', undefined].includes(c.type)) err('Konzeptaufgabe: Typ', where, c.type); texCheck(c.text, where); (c.people || []).forEach(p => texCheck(p.says, where)); mcCheck(c, where); if (c.type === 'mc2'){ if (!c.reason) err('mc2 ohne reason', where); else mcCheck(c.reason, where + ' Begründung'); } if (c.type === 'dialog' && !(c.people && c.people.length >= 2)) err('dialog braucht people', where); if (c.seg && t.__segs && !t.__segs.has(c.seg)) err('seg unbekannt', where, c.seg); if (c.lex && !E.LEX.find(x => x.id === c.lex)) err('lex fehlt', where, c.lex); };
  (t.concept || []).forEach((c, i) => conceptCheck(c, W + ' Konzept' + i));
  for (const [key, F] of [['final', t.final], ['finalB', t.finalB]]){
    if (!F) { need(false, key); continue; }
    if (STRICT || t.finalB){
      if (F.length !== 5) err(key + ' braucht 5 Einträge', W);
      const aims = F.map(x => x.aim); for (const a of [0, 1, 2]) if (!aims.includes(a)) err(key + ': Lernziel ' + a + ' nicht abgedeckt', W);
      if (aims.filter(a => a === 'k').length !== 2) err(key + ': zwei Konzeptaufgaben (aim:\'k\') nötig', W);
      if (!F.some(x => x.task)) err(key + ': mindestens eine Rechenaufgabe', W);
    }
    F.forEach((it, i) => { if (it.task) { if (key === 'finalB') runTask(it.task, W + ' AbschlussB' + i); } else if (it.aim === 'k' || it.type) conceptCheck(it, W + ' ' + key + i); else if (key === 'finalB') mcCheck(it, W + ' AbschlussB' + i); });
  }
  for (const k of t.practice) for (const g of k.goals) if (!(g.hints && g.hints.length >= 2)) warn('Ziel ohne 2 Hinweisstufen', W, k.id + ':' + g.id);
  t.check.forEach((q, i) => { if (q.seg){ const p = E.TOPICS.find(x => x.id === q.prev); if (!p || !(p.teach || []).some(sg => sg.id === q.seg)) (STRICT ? err : warn)('check.seg unbekannt', W, q.prev, q.seg); } });
  if (!t.finalB && !STRICT && t.final.length !== 4) err('Abschluss braucht 4 Aufgaben', W);
  t.final.forEach((it, i) => { if (it.task) runTask(it.task, W + ' Abschluss' + i); else if (!(it.aim === 'k' || it.type)) mcCheck(it, W + ' Abschluss' + i); });
  for (const e of t.errors || []){
    const r = E.checkTask(e.ctx, e.fix, e.lines, 'err');
    const firstBad = r.lines.findIndex(l => !['ok', 'def', 'info'].includes(l.status));
    if (firstBad !== e.wrong) err('Fehler-finden: erste falsche Zeile laut Prüfkern', firstBad, 'statt', e.wrong, W, e.id, JSON.stringify(r.lines.map(l => l.status)));
    mcCheck(e.why, W + ' ' + e.id);
    runGoal({id:e.id, ctx:e.ctx}, e.fix, W + ' ' + e.id + ' Berichtigung', null);
  }
}
for (const l of E.LEX) texCheck(l.text, 'Lexikon ' + l.id);
{ const seen = new Set(); for (const l of E.LEX){ if (seen.has(l.id)) err('Lexikon-ID doppelt', l.id); seen.add(l.id); } }
{ const seen = new Set(); for (const t of E.TOPICS){ if (seen.has(t.id)) err('Themen-ID doppelt', t.id); seen.add(t.id);
  const ids = [...t.practice.map(k => k.id), ...t.final.filter(x => x.task).map(x => x.task.id), ...(t.finalB || []).filter(x => x.task).map(x => x.task.id), ...(t.concept || []).map(c => 'c:' + c.id), ...(t.example.faded ? [t.example.faded.id] : []), ...(t.errors || []).map(e => e.id)];
  for (const id of ids){ if (seen.has('task:' + id)) err('Aufgaben-ID doppelt', id); seen.add('task:' + id); } } }
for (const t of E.TOPICS){ if (t.ch && !['math', 'qm'].includes(t.ch)) err('Kapitel unbekannt', t.id, t.ch); for (const mid of t.math || []) if (!E.TOPICS.find(x => x.id === mid)) err('Mathe-Verweis fehlt', t.id, mid); }
for (const t of E.TOPICS){ if (!LABTYPES.includes(t.lab.type)) err('Labortyp unbekannt', t.id, t.lab.type); }
console.log('Ziele:', nGoals, 'Zeilen:', nLines, 'Fehler:', nErr, nWarn ? '(Warnungen: ' + nWarn + (STRICT ? ', als Fehler gezählt' : '; anzeigen mit --warn') + ')' : '');
process.exit(nErr ? 1 : 0);
