/* ===== Auswahlfrage ===== */
function mcBox(q, opts){
  // q: {q, opts:[…], a:index, ex, dk:true(„Weiß ich noch nicht“)}; opts: {label, onAnswer(correct, idx), saved}
  opts = opts || {};
  const box = h('div', {class:'mc'});
  box.innerHTML = (opts.label ? '<div class="qh">' + escH(opts.label) + '</div>' : '') + '<div class="q">' + inl(q.q) + '</div>';
  const order = q.keep ? q.opts.map((_, i) => i) : shuffle(q.opts.map((_, i) => i), rng(hashStr(q.q + (q.opts[0] || ''))));
  const list = order.concat(q.dk ? [-1] : []);
  const fb = h('div', {class:'fb', 'aria-live':'polite'});
  const btns = list.map(i => {
    const b = h('button', {class:'opt', type:'button', html:i === -1 ? 'Weiß ich noch nicht' : inl(q.opts[i])});
    b.addEventListener('click', () => answer(i));
    box.append(b); return b;
  });
  box.append(fb);
  let answered = false;
  function answer(i, silent){
    if (answered) return;
    answered = true; box.classList.add('done');
    btns.forEach((b, k) => { const j = list[k]; b.disabled = true; if (j === q.a) b.classList.add('right'); else if (j === i) b.classList.add('wrongc'); else b.classList.add('dim'); });
    const ok = i === q.a;
    fb.innerHTML = (i === -1 ? '<b>Kein Problem.</b> ' : ok ? '<b>' + escH(q.yes || 'Richtig.') + '</b> ' : '<b>' + escH(q.no || 'Nicht ganz.') + '</b> ') + inl(q.ex || '');
    if (!silent && opts.onAnswer) opts.onAnswer(ok, i);
  }
  if (opts.saved !== undefined && opts.saved !== null) answer(opts.saved, true);
  box.answered = () => answered;
  return box;
}

/* ===== Symbolleiste ===== */
const PALETTE = [
  ['ħ'], ['ψ'], ['φ'], ['χ'], ['π'], ['∞'], ['θ'], ['ω'], ['κ'], ['α'], ['λ'], ['|sep'],
  ['∫', '∫_0^L  dx', 'Integral mit Grenzen und dx'], ['d/dx', 'd/dx ', 'Ableitung'], ['∂/∂t', '∂/∂t ', 'partielle Ableitung'], ['√', 'sqrt()', 'Wurzel', -1], ['x²', '^2', 'Quadrat'], ['ψ*', '^*', 'komplex konjugiert'], ['†'], ['ˆ', '\u0302', 'Dach auf den letzten Buchstaben'],
  ['|sep'], ['⟨'], ['|'], ['⟩'], ['[ , ]', '[, ]', 'Kommutator', -3], ['Σ', 'Σ_{n=1}^∞ ', 'Summe'], ['Δ'], ['∇²'], ['±'], ['⇒'], ['↑'], ['↓'], ['(  ;  )', '(1, 0; 0, 1)', 'Matrix'], ['?', null, 'Schreibweise']
];
let palTarget = null;
function setupPalette(){
  const pal = $('#palette');
  pal.innerHTML = '';
  for (const [lab, ins, title, back] of PALETTE){
    if (lab === '|sep'){ pal.append(h('span', {class:'sep'})); continue; }
    const b = h('button', {type:'button', class:lab.length > 2 ? 'w' : '', title:title || lab, 'aria-label':title || lab}, lab);
    b.addEventListener('pointerdown', e => e.preventDefault());
    b.addEventListener('click', () => {
      if (ins === null){ showNotationHelp(); return; }
      if (!palTarget) return;
      insertAt(palTarget, ins === undefined ? lab : ins, back || 0);
    });
    pal.append(b);
  }
  document.addEventListener('focusin', e => { if (e.target.matches && e.target.matches('input.math')){ palTarget = e.target; pal.hidden = false; setTimeout(() => { const r = e.target.getBoundingClientRect(); const ph = pal.getBoundingClientRect().height; if (r.bottom > window.innerHeight - ph - 10 || r.top < 70) e.target.scrollIntoView({block:'center', behavior:'smooth'}); }, 60); } });
  document.addEventListener('focusout', e => { if (e.target.matches && e.target.matches('input.math')) setTimeout(() => { if (!document.activeElement || !document.activeElement.matches('input.math')) pal.hidden = true; }, 150); });
}
function insertAt(inp, text, back){
  const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? s;
  inp.value = inp.value.slice(0, s) + text + inp.value.slice(e);
  const pos = s + text.length + (back || 0);
  inp.focus(); inp.setSelectionRange(pos, pos);
  inp.dispatchEvent(new Event('input', {bubbles:true}));
}
function showNotationHelp(){
  $$('.nh-dlg').forEach(x => x.remove());
  const d = h('div', {class:'box box-info nh-dlg', role:'dialog', 'aria-label':'So schreibst du Formeln', style:'position:fixed;left:50%;top:12%;transform:translateX(-50%);z-index:70;width:min(92vw,680px);max-height:76vh;overflow:auto;background:var(--sheet);box-shadow:0 10px 40px rgba(0,0,0,.25)'});
  d.innerHTML = '<h3>So schreibst du Formeln</h3>' + md(NOTATION_HELP) + '<div class="row" style="margin-top:10px"><button class="btn btn-primary" type="button">Schließen</button></div>';
  const esc = e => { if (e.key === 'Escape') close(); };
  const close = () => { d.remove(); document.removeEventListener('keydown', esc); };
  d.querySelector('button').onclick = close;
  document.addEventListener('keydown', esc);
  document.body.append(d);
}
const NOTATION_HELP = `Tippe so, wie du auf Papier schreiben würdest. Unter jeder Zeile siehst du sofort, wie das Tutorial sie liest.

- Multiplikation: Leerzeichen oder nichts (\`2m\`, \`k x\`) oder \`*\`. Brüche: \`ħ^2/2m\` heißt $\\frac{\\hbar^2}{2m}$, \`1/2 m ω^2 x^2\` (mit Leerzeichen) heißt $\\frac12 m\\omega^2x^2$.
- Potenzen und Indizes: \`x^2\`, \`e^(-x^2/2)\`, \`ψ_n\`, \`E_n\`, \`V_0\`, \`a0\` (wird zu $a_0$).
- Fakultät und Gammafunktion: \`n!\`, \`x^n/n!\`, \`Γ(1/2)\`. Dezimalzahlen: \`0.1\` oder \`0,1\` – in Klammern nur \`(0.1)\`, denn \`(0,1)\` ist ein Vektor.
- Wurzel: \`sqrt(2/L)\` oder \`√(2/L)\`. Komplex konjugiert: \`ψ^*\` oder \`ψ*\` direkt am Buchstaben. Betrag: \`|ψ|^2\`.
- Ableitungen: \`d/dx ψ\`, \`d^2/dx^2 ψ\`, \`dψ/dx\`, \`ψ''\`, \`∂ψ/∂t\`, \`∂/∂t (…)\`. Ein Operator wirkt auf alles rechts von ihm.
- Integrale: \`∫_0^L |ψ|^2 dx\`, \`∫_-∞^∞ … dx\`. Auswerten: \`[x^2/2]_0^L\`. Summen: \`Σ_{n=1}^∞ |c_n|^2\`.
- Operatoren: \`p̂\`, \`x̂\`, \`Ĥ\` (Taste ˆ setzt ein Dach auf den letzten Buchstaben), \`a†\`, Kommutator \`[x̂, p̂]\`.
- Dirac: \`|n⟩\`, \`⟨m|n⟩\`, \`⟨n|x̂|m⟩\`, Erwartungswert \`⟨x^2⟩\`, Unschärfe \`Δx\`. Spin: \`|↑⟩\`, \`|+x⟩\`, \`S_z\`, \`σ_x\`. Matrizen: \`(1, 0; 0, -1)\`.
- Mehrere Schritte in einer Zeile: \`A = B = C\`. Eine Zeile, die mit \`=\` beginnt, setzt die vorige fort.
- Neue Abkürzungen: \`κ = sqrt(2m(V_0 - E))/ħ\` – danach kannst du \`κ\` benutzen.
- LaTeX geht auch: \`\\frac{\\hbar^2}{2m}\`, \`\\int_0^L\`, \`\\langle x \\rangle\`.

**Mit dem Stift schreiben.** Tippe vorn in der Zeile auf ✎ (zurück zum Tippen: ⌨). Schreib wie auf Papier. Nach einer kurzen Pause steht im Feld darunter, wie das Tutorial die Zeile liest, und die Vorschau zeigt die Formel. Stimmt etwas nicht, tippst du eine andere Lesart an, korrigierst im Feld per Tastatur oder radierst (Radierer oder Radiererende des Stifts). „↵ Fertig“ wirkt wie Enter.

- Brüche als echten Bruch: Zähler über, Nenner unter einen waagerechten Strich. Ableitungen genauso: $\\frac{d}{dx}$, $\\frac{\\partial\\psi}{\\partial t}$.
- Integrale und Summen: Grenzen unten und oben direkt ans ∫ bzw. Σ, beim Integral am Ende \`dx\` mit etwas Abstand.
- Matrizen und Spaltenvektoren: große Klammern über alle Zeilen, die Einträge sauber in Spalten.
- Hochzahlen und Indizes deutlich kleiner und höher bzw. tiefer. Komplex konjugiert: ein kleines Sternchen oben rechts (\`ψ*\` oder \`ψ^*\`), adjungiert ein kleines † oder +.
- Operatoren: das Dach ^ direkt über den Buchstaben (p̂, Ĥ). Dirac-Klammern ⟨ ⟩ spitz und so hoch wie der Inhalt, den Strich | lang.
- Der Finger schreibt nicht (Schutz vor dem Handballen). Für Geräte ohne Stift lässt sich das in den Einstellungen einschalten. Dort kannst du auch seltene Zeichen wie ψ, ħ, ∂ anlernen.`;

/* ===== Rechenblatt für ein Ziel ===== */
function sheetGoal(task, goal, opts){
  opts = opts || {};
  const ctx = ctxOf(task.ctx);
  const st = store.goal(task.id + (opts.slot || ''), goal.id);
  if (opts.fresh){ st.lines = [{m:'', w:''}]; st.state = null; st.points = 0; st.help = 0; st.seen = false; }
  if (opts.prefill && (!st.lines.length || (st.lines.length === 1 && !st.lines[0].m))) st.lines = opts.prefill.map(m => ({m, w:''}));
  const root = h('div', {class:'goal'});
  root.innerHTML = '<div class="gp">' + inl(goal.prompt || '') + (goal.points ? ' <span class="muted small">(' + goal.points + ' P.)</span>' : '') + '</div>';
  const sheet = h('div', {class:'sheet'});
  const tools = h('div', {class:'sheet-tools'});
  const gstate = h('div', {class:'gstate', hidden:true});
  const hints = h('div');
  root.append(sheet, tools, gstate, hints);
  const rows = [];
  let lastRes = null;
  function addRow(m, w, focus, mode){
    const row = h('div', {class:'ln'});
    const stEl = h('div', {class:'st', 'aria-hidden':'true'}, '·');
    const inp = h('input', {class:'math', type:'text', autocomplete:'off', autocapitalize:'off', spellcheck:'false', 'aria-label':'Rechenzeile ' + (rows.length + 1), placeholder:rows.length ? 'nächster Schritt' : firstPh(goal)});
    inp.value = m || '';
    const why = h('input', {class:'why', type:'text', placeholder:'Begründung', 'aria-label':'Begründung (freiwillig)'});
    why.value = w || '';
    const x = h('button', {class:'x', type:'button', title:'Zeile löschen', 'aria-label':'Zeile löschen'}, '×');
    const pv = h('div', {class:'pv'}), fbk = h('div', {class:'fbk', hidden:true});
    const body = h('div', {class:'lnb'}, h('div', {class:'inp'}, inp, why, x), pv, fbk);
    row.append(stEl, body);
    sheet.append(row);
    const R = {row, inp, why, pv, fbk, stEl};
    rows.push(R);
    /* Stift oder Tastatur je Zeile (15-ink.js); gelesener Text landet im Eingabefeld und läuft wie getippt */
    if (typeof INKUI !== 'undefined') R.ink = new INKUI.InkLine(R, {mode:mode || INKUI.defaultMode(), task, ctx:() => ctx,
      extra:() => rows.slice(0, Math.max(0, rows.indexOf(R))).map(r => r.inp.value.trim()).filter(Boolean),
      onText:() => {
        clearTimeout(tm); preview(R); markStale(R); save();
        /* auf dem Blatt immer eine freie Stiftzeile unter der letzten beschriebenen */
        if (R.inp.value.trim() && rows[rows.length - 1] === R && R.ink.mode === 'pen') addRow('', '', false, 'pen');
      },
      onEnter:() => enterRow(R, 'pen')});
    let tm = 0;
    inp.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { preview(R); save(); }, 90); markStale(R); });
    why.addEventListener('input', save);
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter'){ e.preventDefault(); enterRow(R, 'key'); }
      if (e.key === 'Backspace' && !inp.value && rows.length > 1){ e.preventDefault(); const i = rows.indexOf(R); removeRow(R); rows[Math.max(0, i - 1)].inp.focus(); }
    });
    x.addEventListener('click', () => { if (rows.length > 1) removeRow(R); else { inp.value = ''; if (R.ink) R.ink.clear(); preview(R); markStale(R); } save(); });
    preview(R);
    if (focus){ if (R.ink && R.ink.mode === 'pen') R.ink.focusPen(); else inp.focus(); }
    return R;
  }
  /* Enter (Tastatur) bzw. „↵ Fertig“ (Stift): bei „Zeile für Zeile“ prüfen, dann zur nächsten Zeile */
  function enterRow(R, how){
    const i = rows.indexOf(R);
    if (i < 0) return;
    if (R.ink) R.ink.flush();
    if ((store.data.settings.mode || 'line') === 'line' && !opts.exam) runCheck(i);
    const N = i === rows.length - 1 ? addRow('', '', false, R.ink ? R.ink.mode : null) : rows[i + 1];
    if (how === 'pen' && N.ink && N.ink.mode === 'pen') N.ink.focusPen(); else N.inp.focus();
  }
  function removeRow(R){ if (R.ink) R.ink.destroy(); R.row.remove(); rows.splice(rows.indexOf(R), 1); save(); markStale(rows[0]); }
  function markStale(R){
    const i = rows.indexOf(R);
    rows.forEach((r, k) => { if (k >= i){ r.row.className = 'ln'; r.stEl.textContent = '·'; r.fbk.hidden = true; } });
    gstate.hidden = true;
  }
  function preview(R){
    const v = R.inp.value.trim();
    if (!v){ R.pv.innerHTML = ''; R.pv.classList.remove('err'); return; }
    try { const ln = parseLine(v, ctx.pctx); R.pv.innerHTML = texHTML(texLine(ln)); R.pv.classList.remove('err'); }
    catch(e){ R.pv.textContent = e.message || 'Nicht lesbar'; R.pv.classList.add('err'); }
  }
  function save(){ st.lines = rows.map(r => ({m:r.inp.value, w:r.why.value})); store.save(); }
  /* gespeicherte Zeilen mit Text kompakt (Tastatur), leere nach der Voreinstellung */
  for (const l of (st.lines.length ? st.lines : [{m:'', w:''}])) addRow(l.m, l.w, false, l.m && String(l.m).trim() ? 'kbd' : null);
  // Werkzeuge
  const bAdd = h('button', {class:'btn btn-sm', type:'button'}, '+ Zeile');
  bAdd.onclick = () => addRow('', '', true);
  const bCheck = h('button', {class:'btn btn-sm btn-primary', type:'button'}, opts.exam ? 'Gespeichert' : 'Prüfen');
  bCheck.onclick = () => runCheck(rows.length - 1, true);
  const bHint = h('button', {class:'btn btn-sm', type:'button'}, 'Hinweis');
  const bSol = h('button', {class:'btn btn-sm', type:'button', hidden:!st.tries}, 'Lösung ansehen');
  const bAsk = h('button', {class:'btn btn-sm btn-ghost', type:'button'}, '? Frage');
  const pts = h('span', {class:'pts small'});
  if (opts.exam) tools.append(bAdd);
  else if (opts.final) tools.append(bAdd, bCheck, pts);
  else tools.append(bAdd, bCheck, bHint, bSol, bAsk, pts);
  let hintLevel = 0;
  bHint.onclick = () => {
    const H = goal.hints || [];
    const levels = H.concat(goal.model && goal.model.length ? ['__step'] : []);
    if (hintLevel >= levels.length){ toast('Keine weiteren Hinweise. Schau dir die Lösung an.'); return; }
    const k = levels[hintLevel++];
    let html;
    if (k === '__step'){
      const done = lastRes ? lastRes.lines.filter(l => l.status === 'ok' || l.status === 'def').length : 0;
      const m = goal.model[Math.min(done, goal.model.length - 1)];
      const ml = typeof m === 'string' ? {l:m} : m;
      html = '<b>Nächster Schritt mit Lücke:</b> ' + gapHTML(ml, ctx);
    } else html = '<b>' + (hintLevel === 1 ? 'Denkanstoß' : 'Regel') + ':</b> ' + inl(k);
    hints.append(h('div', {class:'hintbox', html}));
    st.help = (st.help || 0) + 1; store.save();
  };
  bSol.onclick = () => {
    if (hints.querySelector('.solution')) return;
    hints.append(modelBox(goal, ctx));
    st.help = (st.help || 0) + 1; st.seen = true; store.save();
  };
  bAsk.onclick = () => askPanel(hints, task, goal, () => rows.map(r => r.inp.value).filter(Boolean));
  function runCheck(upto, all){
    rows.slice().forEach(r => r.ink && r.ink.flush());   /* noch nicht gelesene Handschrift zuerst lesen */
    const lines = rows.map(r => r.inp.value);
    const take = all ? lines : lines.slice(0, upto + 1);
    let res;
    try { res = checkTask(task.ctx, goal, take, task.id + ':' + goal.id); }
    catch(e){ console.error(e); toast('Beim Prüfen ist ein Fehler passiert: ' + e.message); return; }
    lastRes = res;
    st.tries = (st.tries || 0) + 1; bSol.hidden = false;
    res.lines.forEach((r, i) => showLine(rows[i], r));
    if (all || upto === rows.length - 1 || res.final && res.final.state === 'solved'){
      showFinal(res.final);
    }
    save();
    return res;
  }
  function showLine(R, r){
    if (!R) return;
    const ic = {ok:'✓', folge:'↪', wrong:'✗', na:'i', info:'i', parse:'?', def:'=', empty:'·'}[r.status] || '·';
    R.row.className = 'ln ' + r.status; R.stEl.textContent = ic;
    const msgs = [];
    if (r.msg) msgs.push(r.msg);
    for (const s of r.steps || []){ if (s.msg) msgs.push(s.msg); if (s.msgs) msgs.push(...s.msgs); }
    if (r.msgs) msgs.push(...r.msgs);
    if (r.status === 'wrong' && !msgs.length) msgs.push('Dieser Schritt stimmt nicht. Vergleiche mit der Zeile davor.');
    if (r.status === 'ok' && r.steps && r.steps.some(s => s.ref)) {/* Gleichung stimmt für die gesuchte Größe */}
    const uniq = [...new Set(msgs)];
    if (uniq.length && !(opts.final && r.status === 'wrong')){ R.fbk.innerHTML = uniq.map(m => inl(m)).join('<br>'); R.fbk.hidden = false; }
    else if (opts.final && r.status === 'wrong'){ R.fbk.textContent = 'Diese Zeile stimmt nicht.'; R.fbk.hidden = false; }
    else R.fbk.hidden = true;
  }
  function showFinal(f){
    if (!f) return;
    const P = goal.points || (goal.type === 'show' ? 3 : 2);
    const okLines = lastRes.lines.filter(l => l.status === 'ok' || l.status === 'folge' || l.status === 'def').length;
    let p;
    if (f.state === 'solved') p = P; else if (f.state === 'solvedWithErrors' || f.state === 'folge') p = Math.max(P - 1, 0); else p = Math.min(okLines, P - 1);
    st.state = f.state; st.points = Math.max(st.points && st.state === 'solved' ? st.points : 0, p); st.lastPoints = p;
    gstate.className = 'gstate ' + f.state; gstate.hidden = false;
    gstate.innerHTML = inl(f.msg || '') + (opts.exam ? '' : ' <span class="pts">' + p + ' von ' + P + ' Punkten</span>') + (st.help && f.state === 'solved' && !opts.final ? ' <span class="muted small">(mit Hilfe)</span>' : '');
    pts.textContent = '';
    store.save();
    if (opts.onResult) opts.onResult({state:f.state, points:p, max:P, help:st.help || 0});
  }
  root.check = () => runCheck(rows.length - 1, true);
  root.result = () => lastRes;
  return root;
}
function firstPh(goal){
  let ph = goal.ph;
  const m0 = goal.model && goal.model[0] ? (typeof goal.model[0] === 'string' ? goal.model[0] : goal.model[0].l) : '';
  if (!ph && m0) ph = m0;
  if (ph && ph === m0 && ph.includes('=')){ const i = ph.indexOf('='); ph = ph.slice(0, i).trim() + ' = …'; }
  return ph ? 'erster Schritt, z. B. ' + ph : 'erster Schritt';
}
function gapHTML(ml, ctx){
  if (ml.gap) return lineHTML(ml.gap, ctx) ;
  const l = ml.l;
  const i = l.indexOf('=');
  if (i > 0 && i < l.length - 1){ return lineHTML(l.slice(0, i).trim(), ctx) + ' $= \\;\\square$'.replace('$= \\;\\square$', texHTML('= \\;\\square')); }
  return texHTML('\\square');
}
function modelBox(goal, ctx){
  const box = h('div', {class:'solution'});
  box.innerHTML = '<b>Musterlösung</b><ol class="model">' + (goal.model || []).map(m => { const ml = typeof m === 'string' ? {l:m} : m; return '<li>' + lineHTML(ml.l, ctx) + (ml.w ? '<span class="why">' + inl(ml.w) + '</span>' : '') + '</li>'; }).join('') + '</ol>' + (goal.note ? '<p class="small">' + inl(goal.note) + '</p>' : '');
  return box;
}
/* Aufgabe mit allen Zielen */
function taskBox(task, opts){
  opts = opts || {};
  const box = h('div', {class:'task'});
  box.innerHTML = '<h3>' + inl(task.title) + (task.src ? ' <span class="muted small">' + escH(task.src) + '</span>' : '') + '</h3><div class="stack">' + md(task.text) + '</div>';
  const results = {};
  for (const g of task.goals){
    const el = sheetGoal(task, g, Object.assign({}, opts, {onResult:r => { results[g.id] = r; if (opts.onResult) opts.onResult(task, g, r, results); }}));
    box.append(el);
  }
  box.results = results;
  return box;
}
