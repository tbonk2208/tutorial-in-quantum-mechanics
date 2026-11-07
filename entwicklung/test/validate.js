/* Prüft alle Inhalte: Musterlösungen mit dem Prüfkern, Formeln mit KaTeX, Auswahlfragen */
const fs = require('fs'), path = require('path');
const katex = require('/opt/npm-tools/node_modules/katex');
const ls = d => fs.readdirSync(path.join(__dirname, '..', d)).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(path.join(__dirname, '..', d, f), 'utf8'));
/* --with=<datei>: zusätzliches Skript nach den Inhalten (Testinhalte, die zur Laufzeit Themen ergänzen; nie in src/content) */
const WITH = process.argv.slice(2).filter(a => a.startsWith('--with=')).map(a => fs.readFileSync(a.slice(7), 'utf8'));
const code = ls('src/engine').join('\n;\n') + '\n;\n' + ls('src/content').join('\n;\n') + WITH.map(x => '\n;\n' + x).join('');
const E = new Function(code + '\n;return {TOPICS, LEX, checkTask, parseLine, texLine, makeCtx, SKETCH};')();
const args = process.argv.slice(2); const STRICT = args.includes('--strict'); const only = args.find(a => !a.startsWith('--'));
let nWarn = 0; const warn = (...a) => { nWarn++; if (STRICT) err(...a); else if (args.includes('--warn')) console.log('WARNUNG', ...a); };
let nErr = 0, nGoals = 0, nLines = 0;
const err = (...a) => { nErr++; console.log('FEHLER', ...a); };
const LABTYPES = ['complex','prob','twostate','box','packet','barrier','measure','osc','ylm','hydrogen','spin','perturb','delta','vectors','eigen','expand','fourier','ode','special'];
/* ---- Umbau 2 (didaktik/UMBAU2.md, Abschnitt 5): Abschnitte mit steps ----
   soft(): Hinweis, der nie als Fehler zählt (auch nicht mit --strict), z. B. lab.map-Namen, die sich nicht sicher ermitteln lassen */
let nSoft = 0; const soft = (...a) => { nSoft++; console.log('WARNUNG (nicht gezählt)', ...a); };
const REPK = ['worte', 'dirac', 'ort', 'impuls', 'matrix', 'formel', 'graph', 'labor', 'mathe', 'physik'];
/* Wortzählung
   wordsRaw: wie bisher für die Mindestwortzahl je Thema – durch Leerraum getrennte Stücke, Formeln eingeschlossen.
   wordsNoTex: für die 40–150-Regel je Schritt und ≤ 80 bei pre – erst $$…$$, $…$ und `…` entfernen, [[lex:id|Text]] → Text,
   dann durch Leerraum getrennte Stücke zählen, die mindestens einen Buchstaben oder eine Ziffer enthalten. */
const wordsRaw = s => String(s || '').split(/\s+/).filter(Boolean).length;
const wordsNoTex = s => String(s || '').replace(/\$\$[\s\S]*?\$\$/g, ' ').replace(/\$[^$]*\$/g, ' ').replace(/`[^`]*`/g, ' ').replace(/\[\[lex:[\w-]+\|([^\]]*)\]\]/g, '$1').split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
/* Laborcode für lab.map: Block LABS.<typ> = … bis zur nächsten Zeile „LABS.<x> =“ */
const LABSRC = ['src/ui/30-labs.js', 'src/ui/31-labs-math.js'].map(f => { try { return fs.readFileSync(path.join(__dirname, '..', f), 'utf8'); } catch(e){ return ''; } }).join('\n');
const labBlock = type => { const m = new RegExp('^LABS\\.' + type + '\\s*=', 'm').exec(LABSRC); if (!m) return null; const rest = LABSRC.slice(m.index + m[0].length); const e = /^LABS\.\w+\s*=/m.exec(rest); return LABSRC.slice(m.index, m.index + m[0].length + (e ? e.index : rest.length)); };
/* ctl im Laborcode: genau als Teilzeichenkette im Block des Labortyps → in Ordnung; nur anderswo in den Labordateien → Hinweis;
   im Block beginnt ctl mit einer Zeichenkette (≥ 3 Zeichen), an die mit + angehängt wird oder die ${…} enthält (zusammengesetzte
   Beschriftung) → Hinweis; Block nicht gefunden → Hinweis, falls ctl in den Labordateien vorkommt; sonst Fehler. */
function ctlCheck(type, ctl, where){
  if (typeof ctl !== 'string' || !ctl.trim()){ rule(false, 'lab.map: ctl fehlt', where); return; }
  const c = ctl.trim(), blk = labBlock(type);
  if (blk && blk.includes(c)) return;
  if (LABSRC.includes(c)){ soft('lab.map: ctl „' + c + '“ steht im Laborcode, aber nicht sicher im Labor ' + type, where); return; }
  if (blk){
    for (const m of blk.matchAll(/'((?:[^'\\\n]|\\.)*)'\s*\+|"((?:[^"\\\n]|\\.)*)"\s*\+|`([^`]*\$\{[^`]*)`/g)){
      const lit = (m[1] || m[2] || (m[3] || '').split('${')[0]).trim();
      if (lit.length >= 3 && c.startsWith(lit)){ soft('lab.map: ctl „' + c + '“ nicht sicher ermittelbar (zusammengesetzte Beschriftung „' + lit + ' …“ im Labor ' + type + ')', where); return; }
    }
  }
  rule(false, 'lab.map: ctl „' + c + '“ kommt im Laborcode' + (blk ? ' von ' + type : '') + ' nicht vor', where);
}
const lexRefs = (s, where) => { for (const m of String(s || '').matchAll(/\[\[lex:([\w-]+)\|/g)) if (!E.LEX.find(x => x.id === m[1])) err('Lexikon-Verweis fehlt', where, m[1]); };
const hasSteps = t => (t.teach || []).some(sg => Array.isArray(sg.steps));
const STEP_IDS = new Map();   /* app-weit: Schritt-id → Ort */
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
/* ---- Skizzenaufgaben (SKIZZE.md): t.sketch, t.lab.sketch, final/finalB-Einträge {aim, sketch} ---- */
const texPure = (s, where) => { if (s === undefined || s === null || s === '') return; try { katex.renderToString(String(s), {throwOnError:true, strict:'ignore'}); } catch(e){ err('KaTeX', where, JSON.stringify(String(s)).slice(0, 80), e.message.slice(0, 100)); } };
const sketchesOf = t => [...(Array.isArray(t.sketch) ? t.sketch.map((sp, i) => ({sp, where:'sketch' + i})) : t.sketch ? [{sp:t.sketch, where:'sketch'}] : []),
  ...(t.lab && t.lab.sketch ? [{sp:t.lab.sketch, where:'lab.sketch'}] : []),
  ...['final', 'finalB'].flatMap(key => (t[key] || []).map((it, i) => it && it.sketch ? {sp:it.sketch, where:key + i, entry:it, key} : null).filter(Boolean))];
let nSketch = 0;
function sketchCheck(t, W){
  if (t.sketch !== undefined && !Array.isArray(t.sketch)) warn('t.sketch muss eine Liste sein', W);
  for (const {sp, where, entry} of sketchesOf(t)){
    nSketch++;
    const SW = W + ' Skizze ' + where + ' ' + (sp && sp.id);
    for (const m of E.SKETCH.validate(sp)) warn('Skizze ungültig:', m, SW);
    if (entry && !(Number.isInteger(entry.aim) && entry.aim >= 0 && entry.aim < (t.goals || []).length)) warn('Abschluss-Skizze ohne gültiges aim (Index in goals)', SW, entry.aim);
    if (!sp || typeof sp !== 'object') continue;
    texCheck(sp.title, SW); texCheck(sp.text, SW); texCheck(sp.reveal, SW); (sp.hints || []).forEach(h => texCheck(h, SW)); texCheck(sp.extra, SW);
    (sp.checks || []).forEach(c => texCheck(c && c.msg, SW + ' ' + (c && c.id)));
    (sp.want || []).forEach((w, i) => { if (!w) return; texCheck(w.msg, SW + ' want' + i); texCheck(w.msgDir, SW); texCheck(w.msgLen, SW); texCheck(w.msgPos, SW); texPure(w.lab, SW + ' want' + i + '.lab'); });
    (sp.given || []).forEach((g, i) => g && texPure(g.lab, SW + ' given' + i + '.lab'));
    const p = sp.plot || {}; texPure(p.xlab, SW + ' xlab'); texPure(p.ylab, SW + ' ylab');
    (p.ticks || []).forEach(q => q && texPure(q.lab, SW + ' ticks')); (p.yticks || []).forEach(q => q && texPure(q.lab, SW + ' yticks'));
    if (E.SKETCH.validate(sp).length) continue;
    // erzeugte Rückfragen (Überdeckung, Stellen mit Tick-Beschriftung) müssen ebenfalls setzbar sein
    const gen = [E.SKETCH.evaluate(sp, [])];
    (sp.wrong || []).forEach(w => gen.push(E.SKETCH.evaluate(sp, E.SKETCH.synth(sp, sp.kind === 'arrows' ? w.arrows : w.f, {seed:1, noise:0.03, strokes:1}))));
    for (const r of gen) for (const x of [...r.first, ...r.results]) if (x && x.msg) texCheck(x.msg, SW + ' erzeugte Rückfrage');
    const st = E.SKETCH.selfTest(sp);
    if (!st.ok) for (const m of st.problems.slice(0, 6)) warn('Skizze Selbsttest:', m, SW);
  }
  // Form A und B parallel: gleiche Lernziele mit Skizze
  const aimsOf = key => (t[key] || []).filter(x => x && x.sketch).map(x => x.aim).sort().join(',');
  if (t.finalB && aimsOf('final') !== aimsOf('finalB')) warn('Skizzen im Abschluss: Form A und B nicht parallel (aim ' + (aimsOf('final') || '–') + ' / ' + (aimsOf('finalB') || '–') + ')', W);
}
/* ---- Umbau 2: Prüfungen für Abschnitte mit steps (Abschnitt 5 von UMBAU2.md; Regeln aus Abschnitt 1–3) ----
   rule(): wie need – Warnung im Normalmodus, Fehler mit --strict */
const rule = (cond, msg, where) => { if (!cond) (STRICT ? err : warn)('Schritte: ' + msg, where); };
const texAuto = (s, where) => { if (s == null || s === '') return; if (/\$/.test(String(s))) texCheck(s, where); else texPure(s, where); };
/* ids aller übrigen Inhalte (app-weit) und alle Schritt-ids (auch bei Prüfung nur eines Themas) */
const OTHER_IDS = new Map(), STEP_LOC = new Map();
for (const t of E.TOPICS){
  const add = (id, what) => { if (id && !OTHER_IDS.has(id)) OTHER_IDS.set(id, t.id + ' (' + what + ')'); };
  add(t.id, 'Thema'); (t.teach || []).forEach(sg => add(sg.id, 'Abschnitt'));
  (t.practice || []).forEach(k => add(k.id, 'Aufgabe')); (t.concept || []).forEach(c => add(c.id, 'Konzeptaufgabe')); (t.errors || []).forEach(e => add(e.id, 'Fehler finden'));
  [...(t.final || []), ...(t.finalB || [])].forEach(x => { if (x && x.task) add(x.task.id, 'Abschlussaufgabe'); });
  if (t.example && t.example.faded) add(t.example.faded.id, 'Lückenaufgabe');
  sketchesOf(t).forEach(({sp}) => sp && add(sp.id, 'Skizze'));
  for (const sg of t.teach || []) for (const st of Array.isArray(sg.steps) ? sg.steps : []) if (st && st.id){ if (!STEP_LOC.has(st.id)) STEP_LOC.set(st.id, []); STEP_LOC.get(st.id).push(t.id + '/' + sg.id); }
}
let nSteps = 0;
/* Graph: reps-Zeile k:'graph' oder Schritt-Feld plot; SKETCH.graph prüft plot, f, f2 */
function graphCheck(g, where){
  if (typeof E.SKETCH.graph !== 'function'){ err('SKETCH.graph fehlt (src/engine/80-sketch.js)', where); return; }
  const G = E.SKETCH.graph(g);
  for (const p of G.problems) rule(false, 'Graph: ' + p, where);
  const p = G.plot || {};
  texPure(p.xlab, where + ' xlab'); texPure(p.ylab, where + ' ylab');
  (p.ticks || []).forEach(q => q && texPure(q.lab, where + ' ticks')); (p.yticks || []).forEach(q => q && texPure(q.lab, where + ' yticks'));
  (p.regions || []).forEach(r => r && texAuto(r.lab, where + ' regions'));
  texCheck(g.cap, where + ' cap'); texAuto(g.lab, where + ' lab'); texAuto(g.lab2, where + ' lab2');
}
function repsCheck(R, where, ST){
  if (!R || typeof R !== 'object' || Array.isArray(R)){ rule(false, 'reps muss ein Objekt {obj, rows, links} sein', where); return; }
  rule(typeof R.obj === 'string' && R.obj.trim(), 'reps.obj (Kopfzeile) fehlt', where); texCheck(R.obj, where);
  const rows = Array.isArray(R.rows) ? R.rows : [];
  rule(rows.length >= 2, 'reps.rows: mindestens 2 Zeilen', where);
  rows.forEach((r, i) => {
    const RW = where + ' Zeile ' + (i + 1);
    if (!r || !REPK.includes(r.k)){ rule(false, 'reps: unbekannte Art k = ' + JSON.stringify(r && r.k) + ' (erlaubt: ' + REPK.join(', ') + ')', RW); return; }
    if (r.k === 'physik') ST.physik++;
    texCheck(r.text, RW); lexRefs(r.text, RW); texPure(r.tex, RW); texCheck(r.cap, RW);
    if (r.k === 'graph') graphCheck(r, RW);
    else rule(!!((typeof r.text === 'string' && r.text.trim()) || (typeof r.tex === 'string' && r.tex.trim())), 'reps-Zeile ohne Inhalt (text oder tex)', RW);
  });
  const L = Array.isArray(R.links) ? R.links : null;
  rule(L && L.length >= 1, 'reps.links (Übersetzungsregeln) fehlen', where);
  const ks = rows.map(r => r && r.k);
  (L || []).forEach((l, i) => {
    const LW = where + ' Regel ' + (i + 1);
    rule(l && ks.includes(l.from) && ks.includes(l.to) && l.from !== l.to, 'reps.links: from/to müssen zwei verschiedene Arten aus den Zeilen sein (' + ks.join(', ') + '), hat ' + JSON.stringify(l && [l.from, l.to]), LW);
    rule(l && typeof l.rule === 'string' && l.rule.trim(), 'reps.links: rule fehlt', LW);
    if (l){ texCheck(l.rule, LW); lexRefs(l.rule, LW); }
  });
  for (let i = 0; i + 1 < rows.length; i++){
    const a = ks[i], b = ks[i + 1]; if (!REPK.includes(a) || !REPK.includes(b)) continue;
    rule((L || []).some(l => l && ((l.from === a && l.to === b) || (l.from === b && l.to === a))), 'reps.links: keine Regel zwischen benachbarten Zeilen ' + (i + 1) + ' (' + a + ') und ' + (i + 2) + ' (' + b + ')', where);
  }
}
/* ein Abschnitt mit steps; Rückgabe: Wörter (wordsRaw) von text, num.text und pre.text für die Mindestwortzahl je Thema */
function stepsCheck(t, sg, SW, ST){
  let words = 0;
  if (!Array.isArray(sg.steps)){ err('steps muss eine Liste sein', SW); return 0; }
  ST.nSeg++;
  const n = sg.steps.length;
  rule(n >= 3 && n <= 7, '3–7 Schritte je Abschnitt (hat ' + n + ')', SW);
  const extra = ['text', 'derive', 'q', 'fig'].filter(k => sg[k] !== undefined);
  rule(!extra.length, 'Abschnitt mit steps hat zusätzlich ' + extra.join(', ') + ' (wird nicht angezeigt; in die Schritte verschieben)', SW);
  sg.steps.forEach((st, j) => {
    nSteps++;
    const SP = SW + ' Schritt ' + (j + 1) + ' ' + (st && st.id);
    if (!st || typeof st !== 'object'){ err('Schritt ist kein Objekt', SP); return; }
    /* id app-weit eindeutig */
    if (!st.id || typeof st.id !== 'string') err('Schritt-id fehlt', SP);
    else {
      const loc = STEP_LOC.get(st.id) || [];
      if (loc.length > 1) err('Schritt-id doppelt', st.id, loc.join(', '));
      if (OTHER_IDS.has(st.id)) err('Schritt-id gleich einer anderen id', st.id, OTHER_IDS.get(st.id));
      if (!/^[\w-]+$/.test(st.id)) err('Schritt-id nur aus Buchstaben, Ziffern, - und _', SP);
    }
    texCheck(st.title, SP);
    rule(typeof st.title === 'string' && st.title.trim(), 'Schritt-Titel fehlt', SP);
    /* Text: ein Gedanke, 40–150 Wörter ohne Formeln */
    texCheck(st.text, SP); lexRefs(st.text, SP);
    const nw = wordsNoTex(st.text);
    rule(nw >= 40 && nw <= 150, 'text 40–150 Wörter ohne Formeln (hat ' + nw + ')', SP);
    words += wordsRaw(st.text);
    /* Kontrollfrage: Pflicht, genau eine */
    const q = st.q;
    const info = {reps:false, tr:false};
    if (!q || typeof q !== 'object' || Array.isArray(q)) rule(false, 'Schritt ohne Kontrollfrage q (genau eine, als Objekt)', SP);
    else if (!Array.isArray(q.opts)) err('MC-Antwort', SP + ' Frage', 'opts fehlt');
    else {
      mcCheck(q, SP + ' Frage');
      rule(q.opts.length >= 3 && q.opts.length <= 4, 'Kontrollfrage mit 3–4 Optionen (hat ' + q.opts.length + ')', SP);
      rule(typeof q.ex === 'string' && q.ex.trim(), 'Kontrollfrage ohne ex', SP);
      rule(Array.isArray(q.fb) && q.fb.length === q.opts.length && q.opts.every((o, i) => i === q.a || (typeof q.fb[i] === 'string' && q.fb[i].trim())), 'Kontrollfrage: fb[] mit Rückmeldung je falscher Option (Länge = opts)', SP);
      (q.fb || []).forEach(x => texCheck(x, SP + ' fb'));
      if (q.tr !== undefined){
        const ok = q.tr && REPK.includes(q.tr.from) && REPK.includes(q.tr.to) && q.tr.from !== q.tr.to;
        rule(ok, 'q.tr = {from, to} mit zwei verschiedenen Arten aus ' + REPK.join(', ') + ', hat ' + JSON.stringify(q.tr), SP);
        if (ok){ ST.tr++; info.tr = true; }
      }
    }
    /* Vorwissen */
    if (st.pre !== undefined){
      const p = st.pre; ST.pre++;
      if (!p || typeof p !== 'object') rule(false, 'pre muss ein Objekt sein', SP);
      else {
        const pt = E.TOPICS.find(x => x.id === p.from);
        rule(!!pt, 'pre.from keine Themen-id: ' + JSON.stringify(p.from), SP);
        if (pt && p.seg !== undefined) rule((pt.teach || []).some(x => x.id === p.seg), 'pre.seg unbekannt in ' + pt.id + ': ' + JSON.stringify(p.seg), SP);
        texCheck(p.title, SP + ' pre'); texCheck(p.text, SP + ' pre'); lexRefs(p.text, SP + ' pre');
        rule(typeof p.text === 'string' && p.text.trim(), 'pre.text fehlt', SP);
        const pw = wordsNoTex(p.text);
        rule(pw <= 80, 'pre höchstens 80 Wörter ohne Formeln (hat ' + pw + ')', SP);
        words += wordsRaw(p.text);
        if (p.q){ if (Array.isArray(p.q.opts)) mcCheck(p.q, SP + ' pre-Frage'); else err('MC-Antwort', SP + ' pre-Frage', 'opts fehlt'); (p.q.fb || []).forEach(x => texCheck(x, SP + ' pre fb')); }
      }
    }
    /* Zahlenbeispiel */
    if (st.num !== undefined){
      const m = st.num;
      rule(m && typeof m.text === 'string' && m.text.trim(), 'num.text fehlt', SP);
      if (m){ texCheck(m.title, SP + ' num'); texCheck(m.text, SP + ' num'); lexRefs(m.text, SP + ' num'); words += wordsRaw(m.text); }
    }
    /* Schritt mit Formel: $$…$$ im text oder eine Herleitung */
    if (/\$\$/.test(String(st.text || '')) || st.derive){ ST.withF++; if (!st.num) ST.withFnoNum++; }
    if (st.fig){ texCheck(st.fig.caption, SP); if (!LABTYPES.includes(st.fig.lab)) err('Abbildung: Labortyp unbekannt', SP, st.fig.lab); }
    if (st.plot !== undefined) graphCheck(st.plot, SP + ' plot');
    if (st.reps !== undefined){ ST.reps++; info.reps = true; repsCheck(st.reps, SP + ' reps', ST); }
    /* Herleitung: Prüfkern wie bisher, höchstens 8 Zeilen, w je Zeile, why mindestens in jeder zweiten Zeile */
    if (st.derive){
      const D = st.derive, Ls = Array.isArray(D.lines) ? D.lines : [];
      if (!Ls.length) err('Herleitung ohne Zeilen', SP);
      rule(Ls.length <= 8, 'Herleitung höchstens 8 Zeilen (hat ' + Ls.length + ')', SP);
      const lines = Ls.map(l => l.l);
      const r = E.checkTask(D.ctx, {type:'free'}, lines, 'drv');
      r.lines.forEach((l, i) => { if (!['ok', 'def', 'info'].includes(l.status)) err('Herleitungszeile', SP, lines[i], l.status, l.msg || '', (l.steps || []).map(s => s.status + (s.msgs || []).join('|')).join(';')); });
      Ls.forEach((l, i) => { texCheck(l.w, SP); rule(typeof l.w === 'string' && l.w.trim(), 'Herleitungszeile ' + (i + 1) + ' ohne w (Name der Umformung)', SP); if (l.why) mcCheck(l.why, SP + ' Warum' + i); });
      const nWhy = Ls.filter(l => l.why).length;
      rule(nWhy >= Math.floor(Ls.length / 2), 'why mindestens in jeder zweiten Herleitungszeile (' + nWhy + ' von ' + Ls.length + ')', SP);
      texCheck(D.title, SP); texCheck(D.text, SP);
    }
    ST.steps.push(Object.assign(info, {where:SP}));
  });
  return words;
}
/* Mengen je Thema (nur Themen mit mindestens einem Abschnitt mit steps) */
function topicStepsCheck(t, W, ST, words){
  const minR = t.id === 'form' ? 6 : 3;
  rule(ST.reps >= minR, 'mindestens ' + minR + ' Darstellungstafeln (reps) je Thema' + (t.id === 'form' ? ' (Thema 6)' : '') + ', hat ' + ST.reps, W);
  rule(ST.tr >= 3, 'mindestens 3 Übersetzungsfragen (q.tr) je Thema, hat ' + ST.tr, W);
  if (t.ch !== 'math') rule(ST.pre >= 3, 'QM-Thema: mindestens 3 Auffrischungen (pre), hat ' + ST.pre, W);
  if (ST.withF && ST.withFnoNum > 0.4 * ST.withF) warn('Schritte: num fehlt bei ' + ST.withFnoNum + ' von ' + ST.withF + ' Schritten mit Formel (mehr als 40 %)', W);
  ST.steps.forEach((s, i) => { if (s.reps) rule(s.tr || (ST.steps[i + 1] && ST.steps[i + 1].tr), 'nach der Darstellungstafel fehlt eine Übersetzungsfrage (q.tr) im selben oder im nächsten Schritt', s.where); });
  if (t.ch === 'math' && ST.physik < 2) soft('Mathe-Thema: weniger als 2 reps-Zeilen „physik“ (' + ST.physik + '); Brücken als eigener Schritt erkennt der Validator nicht', W);
  rule(Array.isArray(t.lab && t.lab.map) && t.lab.map.length >= 1, 'lab.map (Was im Labor wo in der Formel steht) fehlt', W);
  console.log('Schritte ' + W + ': ' + ST.nSeg + ' von ' + (t.teach || []).length + ' Abschnitten mit steps, ' + ST.steps.length + ' Schritte, ' + ST.reps + ' Tafeln, ' + ST.tr + ' Übersetzungsfragen, ' + ST.pre + ' pre, num fehlt in ' + ST.withFnoNum + ' von ' + ST.withF + ' Schritten mit Formel, Erklärtext ' + words + ' Wörter');
}
function labMapCheck(t, W){
  const M = t.lab && t.lab.map; if (M === undefined) return;
  if (!Array.isArray(M)){ err('lab.map muss eine Liste sein', W); return; }
  M.forEach((m, i) => {
    const MW = W + ' lab.map' + i;
    if (!m || typeof m !== 'object'){ err('lab.map-Eintrag ist kein Objekt', MW); return; }
    rule(typeof m.sym === 'string' && m.sym.trim(), 'lab.map: sym fehlt', MW); texAuto(m.sym, MW + ' sym');
    ctlCheck(t.lab.type, m.ctl, MW);
    rule(typeof m.says === 'string' && m.says.trim(), 'lab.map: says fehlt', MW); texCheck(m.says, MW); lexRefs(m.says, MW);
  });
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
  const STEPPED = hasSteps(t);
  need(Array.isArray(t.teach) && t.teach.length >= 4 && t.teach.length <= (STEPPED ? 8 : 7), 'teach (' + (STEPPED ? '4–8' : '4–7') + ' Segmente)');
  { let words = 0; const segIds = new Set(); const ST = {steps:[], reps:0, tr:0, pre:0, withF:0, withFnoNum:0, physik:0, nSeg:0};
    for (const sg of t.teach || []){
      const SW = W + ' Segment ' + sg.id;
      if (!sg.id || segIds.has(sg.id)) err('Segment-id fehlt/doppelt', SW); segIds.add(sg.id);
      if (sg.steps !== undefined){ texCheck(sg.title, SW); words += stepsCheck(t, sg, SW, ST); continue; }
      texCheck(sg.title, SW); texCheck(sg.text, SW); words += String(sg.text || '').split(/\s+/).filter(Boolean).length;
      for (const m of String(sg.text || '').matchAll(/\[\[lex:([\w-]+)\|/g)) if (!E.LEX.find(x => x.id === m[1])) err('Lexikon-Verweis fehlt', SW, m[1]);
      if (sg.fig){ texCheck(sg.fig.caption, SW); if (!LABTYPES.includes(sg.fig.lab)) err('Abbildung: Labortyp unbekannt', SW, sg.fig.lab); }
      if (sg.derive){ const lines = sg.derive.lines.map(l => l.l); const r = E.checkTask(sg.derive.ctx, {type:'free'}, lines, 'drv'); r.lines.forEach((l, i) => { if (!['ok', 'def', 'info'].includes(l.status)) err('Herleitungszeile', SW, lines[i], l.status, l.msg || '', (l.steps || []).map(s => s.status + (s.msgs || []).join('|')).join(';')); }); sg.derive.lines.forEach((l, i) => { texCheck(l.w, SW); if (l.why) mcCheck(l.why, SW + ' Warum' + i); }); }
      need(Array.isArray(sg.q) && sg.q.length >= 1 && sg.q.length <= 2, 'Segmentfragen in ' + sg.id); (sg.q || []).forEach((q, i) => mcCheck(q, SW + ' Frage' + i));
    }
    if (t.teach){ const lo = t.ch === 'math' ? 1200 : 1500; if (words < lo) (STRICT ? err : warn)('Erklärtext zu kurz: ' + words + ' Wörter (mind. ' + lo + ')', W); }
    if (STEPPED) topicStepsCheck(t, W, ST, words);
    t.__segs = segIds;
  }
  labMapCheck(t, W);
  need((t.lab.predict && t.lab.predict.q) || t.lab.sketch, 'lab.predict'); if (t.lab.predict) mcCheck(t.lab.predict, W + ' Labor-Vorhersage');
  need(Array.isArray(t.concept) && t.concept.length >= 4 && t.concept.length <= 6, 'concept (4–6)');
  const conceptCheck = (c, where) => { if (!['mc', 'mc2', 'dialog', undefined].includes(c.type)) err('Konzeptaufgabe: Typ', where, c.type); texCheck(c.text, where); (c.people || []).forEach(p => texCheck(p.says, where)); mcCheck(c, where); if (c.type === 'mc2'){ if (!c.reason) err('mc2 ohne reason', where); else mcCheck(c.reason, where + ' Begründung'); } if (c.type === 'dialog' && !(c.people && c.people.length >= 2)) err('dialog braucht people', where); if (c.seg && t.__segs && !t.__segs.has(c.seg)) err('seg unbekannt', where, c.seg); if (c.lex && !E.LEX.find(x => x.id === c.lex)) err('lex fehlt', where, c.lex); };
  (t.concept || []).forEach((c, i) => conceptCheck(c, W + ' Konzept' + i));
  for (const [key, F0] of [['final', t.final], ['finalB', t.finalB]]){
    if (!F0) { need(false, key); continue; }
    const F = F0.filter(x => !x.sketch);   // Skizzeneinträge {aim, sketch} zählen zusätzlich (SKIZZE.md), Prüfung unten in sketchCheck
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
  if (!t.finalB && !STRICT && t.final.filter(x => !x.sketch).length !== 4) err('Abschluss braucht 4 Aufgaben', W);
  t.final.forEach((it, i) => { if (it.sketch) return; if (it.task) runTask(it.task, W + ' Abschluss' + i); else if (!(it.aim === 'k' || it.type)) mcCheck(it, W + ' Abschluss' + i); });
  for (const e of t.errors || []){
    const r = E.checkTask(e.ctx, e.fix, e.lines, 'err');
    const firstBad = r.lines.findIndex(l => !['ok', 'def', 'info'].includes(l.status));
    if (firstBad !== e.wrong) err('Fehler-finden: erste falsche Zeile laut Prüfkern', firstBad, 'statt', e.wrong, W, e.id, JSON.stringify(r.lines.map(l => l.status)));
    mcCheck(e.why, W + ' ' + e.id);
    runGoal({id:e.id, ctx:e.ctx}, e.fix, W + ' ' + e.id + ' Berichtigung', null);
  }
  sketchCheck(t, W);
}
for (const l of E.LEX) texCheck(l.text, 'Lexikon ' + l.id);
{ const seen = new Set(); for (const l of E.LEX){ if (seen.has(l.id)) err('Lexikon-ID doppelt', l.id); seen.add(l.id); } }
{ const seen = new Set(); for (const t of E.TOPICS){ if (seen.has(t.id)) err('Themen-ID doppelt', t.id); seen.add(t.id);
  const ids = [...t.practice.map(k => k.id), ...t.final.filter(x => x.task).map(x => x.task.id), ...(t.finalB || []).filter(x => x.task).map(x => x.task.id), ...(t.concept || []).map(c => 'c:' + c.id), ...(t.example.faded ? [t.example.faded.id] : []), ...(t.errors || []).map(e => e.id)];
  for (const id of ids){ if (seen.has('task:' + id)) err('Aufgaben-ID doppelt', id); seen.add('task:' + id); } } }
{ const ids = new Set(), sk = new Set();
  for (const t of E.TOPICS){ for (const id of [...t.practice.map(k => k.id), ...t.final.filter(x => x.task).map(x => x.task.id), ...(t.finalB || []).filter(x => x.task).map(x => x.task.id), ...(t.concept || []).map(c => c.id), ...(t.example.faded ? [t.example.faded.id] : []), ...(t.errors || []).map(e => e.id)]) ids.add(id); }
  for (const t of E.TOPICS) for (const {sp, where} of sketchesOf(t)){ const id = sp && sp.id; if (!id) continue; if (sk.has(id)) warn('Skizzen-ID doppelt', id, t.id, where); else if (ids.has(id)) warn('Skizzen-ID gleich einer Aufgaben-ID', id, t.id, where); sk.add(id); } }
for (const t of E.TOPICS){ if (t.ch && !['math', 'qm'].includes(t.ch)) err('Kapitel unbekannt', t.id, t.ch); for (const mid of t.math || []) if (!E.TOPICS.find(x => x.id === mid)) err('Mathe-Verweis fehlt', t.id, mid); }
for (const t of E.TOPICS){ if (!LABTYPES.includes(t.lab.type)) err('Labortyp unbekannt', t.id, t.lab.type); }
/* ---- Formhinweise für Auswahlfragen der Schritte (Item-Writing-Regeln: Haladyna, Downing & Rodriguez 2002) ----
   Geprüft werden Schrittfragen q und Warum-Fragen derive.lines[i].why in Abschnitten mit steps, und zwar auf Muster,
   an denen man die richtige Option ohne Verständnis erkennt. Nur Hinweise für Autoren: nie ein Fehler, auch nicht mit
   --strict, nicht in nWarn/nSoft gezählt und nur mit --warn ausgegeben, als „WARNUNG (nicht gezählt)“.
   Längen wie in lenCheck mit plain() (TeX-Befehle → ein Zeichen); Begründungswörter als ganzes Wort, Groß-/Kleinschreibung egal („Weil …“ am Satzanfang zählt mit).
     LÄNGSTE            richtige Option > 1,25 · längste andere + 2 Zeichen
     NUR-FORMEL         nur die richtige Option enthält eine Formel $…$
     NUR-BEGRÜNDUNG     nur die richtige Option enthält „weil“, „denn“ oder „da“ (ab 3 Optionen)
     EINZIGE-OHNE-BEGR  alle falschen Optionen enthalten eine solche Begründung, die richtige nicht (ab 3 Optionen)
     WÖRTLICH-IM-TEXT   nur q: die richtige Option (ohne Satzzeichen, klein, ≥ 12 Zeichen) steht wörtlich in text oder num.text
                        desselben Schritts, ist also abschreibbar
   Abhilfe: Ablenker in Form und Länge angleichen (gleich viele Formeln und Begründungen, dokumentierte Fehlvorstellungen);
   bei WÖRTLICH den Gedanken anwenden lassen (andere Zahlen, Transfer). Fehlalarme sind möglich, etwa „da“ als Füllwort
   oder eine Formel-Antwort unter gleichwertigen Ablenkern; dann bleibt die Frage, wie sie ist. */
const FORM_WARN = args.includes('--warn');
let nForm = 0; const formHint = (...a) => { nForm++; if (FORM_WARN) console.log('WARNUNG (nicht gezählt)', ...a); };
const normForm = s => plain(s).toLowerCase().replace(/[.,;:!?„“"()]/g, '').trim();
function formCheck(q, body, where){
  if (!q || !Array.isArray(q.opts) || q.opts.length < 2 || !(q.a >= 0 && q.a < q.opts.length) || q.type === 'dialog') return;
  const n = q.opts.length, f = [];
  const L = q.opts.map(o => plain(o).length), other = Math.max(...L.filter((_, i) => i !== q.a));
  if (L[q.a] > 1.25 * other + 2) f.push('LÄNGSTE (' + L.join('/') + ')');
  const tex = q.opts.map(o => /\$/.test(String(o)));
  if (tex[q.a] && tex.filter(Boolean).length === 1) f.push('NUR-FORMEL');
  const why = q.opts.map(o => /\b(weil|denn|da)\b/i.test(String(o))), nWhy = why.filter(Boolean).length;
  if (n > 2 && why[q.a] && nWhy === 1) f.push('NUR-BEGRÜNDUNG');
  if (n > 2 && !why[q.a] && nWhy === n - 1) f.push('EINZIGE-OHNE-BEGR');
  if (body !== null){ const ans = normForm(q.opts[q.a]); if (ans.length >= 12 && normForm(body).includes(ans)) f.push('WÖRTLICH-IM-TEXT'); }
  if (f.length) formHint('Auswahlfrage: ' + f.join(', ') + ' (richtige Option ohne Verständnis erkennbar?)', where, '|', plain(q.opts[q.a]).slice(0, 70));
}
for (const t of E.TOPICS){
  if (only && t.id !== only) continue;
  for (const sg of t.teach || []) (Array.isArray(sg.steps) ? sg.steps : []).forEach((st, j) => {
    if (!st || typeof st !== 'object') return;
    const SP = 'T' + t.nr + ' ' + t.id + ' Segment ' + sg.id + ' Schritt ' + (j + 1) + ' ' + st.id;
    formCheck(st.q, String(st.text || '') + ' ' + String((st.num && st.num.text) || ''), SP + ' Frage');
    (st.derive && Array.isArray(st.derive.lines) ? st.derive.lines : []).forEach((l, i) => { if (l && l.why) formCheck(l.why, null, SP + ' Warum' + i); });
  });
}
if (FORM_WARN) console.log('Formhinweise Auswahlfragen (Schritte, nicht gezählt):', nForm);
if (nSteps || nSoft) console.log('Schritte (Umbau 2):', nSteps, nSoft ? '· Hinweise, nicht als Fehler gezählt: ' + nSoft : '');
console.log('Ziele:', nGoals, 'Zeilen:', nLines, 'Skizzen:', nSketch, 'Fehler:', nErr, nWarn ? '(Warnungen: ' + nWarn + (STRICT ? ', als Fehler gezählt' : '; anzeigen mit --warn') + ')' : '');
process.exit(nErr ? 1 : 0);
