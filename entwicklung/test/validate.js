/* Prüft alle Inhalte: Musterlösungen mit dem Prüfkern, Formeln mit KaTeX, Auswahlfragen */
const fs = require('fs'), path = require('path');
const katex = require('/opt/npm-tools/node_modules/katex');
const ls = d => fs.readdirSync(path.join(__dirname, '..', d)).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(path.join(__dirname, '..', d, f), 'utf8'));
const code = ls('src/engine').join('\n;\n') + '\n;\n' + ls('src/content').join('\n;\n');
const E = new Function(code + '\n;return {TOPICS, LEX, checkTask, parseLine, texLine, makeCtx};')();
const only = process.argv[2];
let nErr = 0, nGoals = 0, nLines = 0;
const err = (...a) => { nErr++; console.log('FEHLER', ...a); };
const texCheck = (s, where) => {
  if (!s) return;
  const parts = [...String(s).matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)];
  for (const m of parts){ const t = m[1] || m[2]; try { katex.renderToString(t, {throwOnError:true, strict:'ignore'}); } catch(e){ err('KaTeX', where, JSON.stringify(t).slice(0, 80), e.message.slice(0, 100)); } }
};
const mcCheck = (q, where) => { if (!q) return; texCheck(q.q, where); (q.opts || []).forEach(o => texCheck(o, where)); texCheck(q.ex, where); if (!(q.a >= 0 && q.a < q.opts.length)) err('MC-Antwort', where); };
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
  if (t.final.length !== 4) err('Abschluss braucht 4 Aufgaben', W);
  t.final.forEach((it, i) => { if (it.q) mcCheck(it, W + ' Abschluss' + i); else runTask(it.task, W + ' Abschluss' + i); });
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
  const ids = [...t.practice.map(k => k.id), ...t.final.filter(x => x.task).map(x => x.task.id), ...(t.example.faded ? [t.example.faded.id] : []), ...(t.errors || []).map(e => e.id)];
  for (const id of ids){ if (seen.has('task:' + id)) err('Aufgaben-ID doppelt', id); seen.add('task:' + id); } } }
for (const t of E.TOPICS){ if (t.ch && !['math', 'qm'].includes(t.ch)) err('Kapitel unbekannt', t.id, t.ch); for (const mid of t.math || []) if (!E.TOPICS.find(x => x.id === mid)) err('Mathe-Verweis fehlt', t.id, mid); }
for (const t of E.TOPICS){ if (!['complex','prob','twostate','box','packet','barrier','measure','osc','ylm','hydrogen','spin','perturb','delta','vectors','eigen','expand','fourier','ode','special'].includes(t.lab.type)) err('Labortyp unbekannt', t.id, t.lab.type); }
console.log('Ziele:', nGoals, 'Zeilen:', nLines, 'Fehler:', nErr);
process.exit(nErr ? 1 : 0);
