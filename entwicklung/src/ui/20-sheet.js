/* ===== Auswahlfrage =====
   q: {q, opts:[…], a, ex, fb?:[Rückmeldung je Option], dk?:true („Weiß ich noch nicht“), keep?:true (Reihenfolge behalten)}
   opts: {label, saved, onAnswer(correct, idx)}            – Standard: Antippen löst sofort auf
         {exam:true, onSelect(idx)}                         – Prüfung: Auswahl änderbar, keine Rückmeldung, später box.reveal()
         {hold:true, onAnswer}                              – Antwort festlegen ohne Rückmeldung (z. B. erste Stufe einer zweistufigen Frage) */
function mcBox(q, opts){
  opts = opts || {};
  const box = h('div', {class:'mc' + (opts.exam ? ' exam' : '')});
  box.innerHTML = (opts.label ? '<div class="qh">' + escH(opts.label) + '</div>' : '') + '<div class="q">' + inl(q.q || '') + '</div>';
  /* „Weiß ich (noch) nicht“ steht immer zuletzt, auch wenn es als eigene Option im Inhalt steht */
  const DK = /^\s*wei(ß|ss) ich (noch )?nicht/i;
  const idx = q.opts.map((_, i) => i), last = idx.filter(i => DK.test(String(q.opts[i]))), rest = idx.filter(i => !last.includes(i));
  const order = (q.keep ? rest : shuffle(rest, rng(hashStr(q.q + (q.opts[0] || ''))))).concat(last);
  const list = order.concat(q.dk && !opts.exam && !last.length ? [-1] : []);
  const fb = h('div', {class:'fb', 'aria-live':'polite'});
  let locked = false, sel = null;
  const btns = list.map(i => {
    /* Inhalt in .optx: breite Formeln scrollen in der Option, nicht die Seite */
    const b = h('button', {class:'opt' + (i === -1 || last.includes(i) ? ' dk' : ''), type:'button', 'data-i':String(i), html:'<span class="optx">' + (i === -1 ? 'Weiß ich noch nicht' : last.includes(i) ? inl(String(q.opts[i]).replace(/^\s*w/, 'W')) : inl(q.opts[i])) + '</span>'});
    if (opts.exam || opts.hold) b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => pick(i));
    box.append(b); return b;
  });
  box.append(fb);
  function mark(i){ sel = i; btns.forEach((b, k) => { const on = list[k] === i; b.classList.toggle('sel', on); if (b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', String(on)); }); }
  function pick(i){
    if (locked) return;
    if (opts.exam){ mark(i); if (opts.onSelect) opts.onSelect(i); return; }
    if (opts.hold){ hold(i); if (opts.onAnswer) opts.onAnswer(i === q.a, i); return; }
    reveal(i);
    if (opts.onAnswer) opts.onAnswer(i === q.a, i);
  }
  function hold(i){ locked = true; mark(i); box.classList.add('held'); btns.forEach(b => { b.disabled = true; }); }
  function reveal(i){
    if (i === undefined) i = sel;
    locked = true; box.classList.add('done'); box.classList.remove('held');
    btns.forEach((b, k) => { const j = list[k]; b.disabled = true; b.classList.remove('sel'); if (j === q.a) b.classList.add('right'); else if (j === i) b.classList.add('wrongc'); else b.classList.add('dim'); });
    const ok = i === q.a;
    const own = i != null && i >= 0 && Array.isArray(q.fb) && q.fb[i] ? q.fb[i] : '';
    const head = i == null ? '<b>Nicht beantwortet.</b> ' : (i === -1 || (last.includes(i) && i !== q.a)) ? '<b>Kein Problem.</b> ' : ok ? '<b>' + escH(q.yes || 'Richtig.') + '</b> ' : '<b>' + escH(q.no || 'Nicht ganz.') + '</b> ';
    fb.innerHTML = head + (own ? inl(own) + (q.ex && q.ex !== own ? '<span class="fbx"> ' + inl(q.ex) + '</span>' : '') : inl(q.ex || ''));
  }
  if (opts.saved !== undefined && opts.saved !== null){ if (opts.exam) mark(opts.saved); else if (opts.hold) hold(opts.saved); else reveal(opts.saved); }
  box.answered = () => locked;
  box.sel = () => sel;
  box.reveal = reveal;
  return box;
}

/* ===== Sicherheitsurteil ===== */
const CONF_LEVELS = ['geraten', 'unsicher', 'ziemlich sicher', 'sicher'];
function confBox(saved, onPick){
  const el = h('div', {class:'conf', role:'group', 'aria-label':'Wie sicher bist du bei dieser Aufgabe?'});
  el.append(h('span', {class:'small muted'}, 'Wie sicher bist du?'));
  let val = saved;
  const bs = CONF_LEVELS.map((t, i) => {
    const b = h('button', {type:'button', class:'cf' + (i === saved ? ' on' : ''), 'aria-pressed':String(i === saved)}, t);
    b.onclick = () => { val = i; bs.forEach((x, k) => { x.classList.toggle('on', k === i); x.setAttribute('aria-pressed', String(k === i)); }); if (onPick) onPick(i); };
    el.append(b); return b;
  });
  el.val = () => val;
  return el;
}

/* ===== Dialoge: Lexikon, Erklär-Abschnitt (Nachlesen, Mini-Auffrischung) ===== */
function showDlg(title, body, opt){
  opt = opt || {};
  $$('.nh-dlg').forEach(x => x.remove());
  const back = h('div', {class:'dlg-back nh-dlg'});
  const d = h('div', {class:'box dlg nh-dlg' + (opt.cls ? ' ' + opt.cls : ''), role:'dialog', 'aria-modal':'true', 'aria-label':plainT(title)});
  const bx = h('button', {class:'btn btn-sm dlg-x', type:'button', 'aria-label':'Schließen'}, '×');
  d.append(h('div', {class:'dlg-h'}, h('h3', {html:inl(title)}), bx));
  const inner = h('div', {class:'stack dlg-b'});
  if (typeof body === 'string') inner.innerHTML = body; else if (body) inner.append(body);
  d.append(inner);
  const bc = h('button', {class:'btn btn-primary', type:'button'}, 'Schließen');
  d.append(h('div', {class:'row', style:'margin-top:12px'}, bc));
  const esc = e => { if (e.key === 'Escape') close(); };
  const close = () => { d.remove(); back.remove(); document.removeEventListener('keydown', esc); };
  bx.onclick = close; bc.onclick = close; back.onclick = close;
  document.addEventListener('keydown', esc);
  document.body.append(back, d);
  try { bc.focus({preventScroll:true}); } catch(e){}
  return d;
}
function lexDlg(id){
  const e = LEX.find(x => x.id === id);
  if (!e){ go('lex/' + id); return; }
  const t = e.topic && topicById(e.topic);
  showDlg(e.title, md(e.text) + (t ? '<p class="small"><a href="#/learn/' + t.id + '/3">Zu ' + escH(tname(t) + ': ' + t.title) + '</a></p>' : '') + '<p class="small"><a href="#/lex/' + escH(e.id) + '">Im Nachschlagen öffnen</a></p>');
}
/* Titel ohne Formel-Auszeichnung (für title- und aria-Attribute) */
const plainT = s => String(s || '').replace(/\$([^$]*)\$/g, (m, x) => x.replace(/\\([a-zA-Z]+)/g, '$1').replace(/[{}^_]/g, ''));
function findSeg(t, id){ return t && (t.teach || []).find(x => x.id === id); }
/* Abschnitt als Dialog; opt.fresh: Fragen beantworten ohne Speichern (Mini-Auffrischung) */
function segDlg(t, segId, opt){
  if (typeof t === 'string') t = topicById(t);
  const sg = findSeg(t, segId);
  if (!sg){ if (t) go('learn/' + t.id + '/3'); return; }
  const wrap = h('div', {class:'stack'});
  wrap.append(h('div', {class:'small muted'}, tname(t) + ': ' + t.title));
  /* Abschnitt mit steps (UMBAU2.md): alle Schritte untereinander, bei opt.fresh mit den Kontrollfragen (ohne Speichern) */
  if (Array.isArray(sg.steps)){
    wrap.append(stepsDlgBody(t, sg, !!(opt && opt.fresh)));
    wrap.append(h('p', {class:'small', html:'<a href="#/learn/' + t.id + '/3/' + encodeURIComponent(sg.id) + '">Im Lernweg öffnen</a>'}));
    showDlg((opt && opt.fresh ? 'Kurz auffrischen: ' : '') + sg.title, wrap, {cls:'dlg-wide'});
    return;
  }
  const body = h('div', {class:'stack', html:md(sg.text)});
  wrap.append(body);
  if (sg.fig){ const fig = h('figure', {class:'segfig'}); const lab = h('div'); fig.append(lab); labRun(lab, sg.fig.lab, sg.fig, {display:true, init:sg.fig.init, keep:sg.fig.keep, topic:t.id}); if (sg.fig.caption) fig.append(h('figcaption', {class:'small muted', html:inl(sg.fig.caption)})); wrap.append(fig); }
  if (sg.derive && sg.derive.lines){
    const ctx = ctxOf(sg.derive.ctx);
    wrap.append(h('h4', {html:sg.derive.title ? inl(sg.derive.title) : 'Herleitung'}));
    wrap.append(h('ol', {class:'model', html:sg.derive.lines.map(L => '<li>' + drlHTML(L.l, ctx) + (L.w ? ' <span class="muted small">' + inl(L.w) + '</span>' : '') + '</li>').join('')}));
  }
  if (opt && opt.fresh && sg.q && sg.q.length){
    wrap.append(h('h4', {}, 'Kurz geprüft'));
    sg.q.forEach((q, i) => wrap.append(mcBox(q, {label:'Frage ' + (i + 1)})));
  }
  wrap.append(h('p', {class:'small', html:'<a href="#/learn/' + t.id + '/3/' + encodeURIComponent(sg.id) + '">Im Lernweg öffnen</a>'}));
  showDlg((opt && opt.fresh ? 'Kurz auffrischen: ' : '') + sg.title, wrap, {cls:'dlg-wide'});
}
/* Link „Nachlesen“: ref = Lexikon-id | 'thema#abschnitt' | {lex} | {topic, seg} */
function refLinkHTML(ref, label){
  if (!ref) return '';
  if (typeof ref === 'object'){
    if (ref.seg && ref.topic) return segLinkHTML(ref.topic, ref.seg, label);
    ref = ref.lex || ref.id; if (!ref) return '';
  }
  ref = String(ref);
  const m = /^([\w-]+)[#/:]([\w-]+)$/.exec(ref);
  if (m && topicById(m[1])) return segLinkHTML(m[1], m[2], label);
  const e = LEX.find(x => x.id === ref);
  if (!e) return '';
  return '<a href="#/lex/' + escH(e.id) + '" class="nachlesen" data-lex="' + escH(e.id) + '">' + escH(label || 'Nachlesen: ' + e.title) + '</a>';
}
function segLinkHTML(tid, segId, label){
  const t = topicById(tid), sg = findSeg(t, segId);
  if (!sg) return '';
  return '<a href="#/learn/' + escH(tid) + '/3/' + encodeURIComponent(segId) + '" class="nachlesen" data-seg="' + escH(segId) + '" data-tid="' + escH(tid) + '">' + inl(label || 'Nachlesen: ' + sg.title) + '</a>';
}

/* ===== Konzeptaufgaben: mc, mc2 (Antwort + Begründung), dialog (zwei Personen, wer hat recht?) =====
   opts: {label, topic, saved:{k, k2}, exam, onSelect(ans), onAnswer(ok, ans)}; box.result() → {ok, pts, max} */
function conceptBox(c, opts){
  opts = opts || {};
  const t = opts.topic;
  const two = c.type === 'mc2' && !!c.reason;
  const box = h('div', {class:'concept' + (c.type === 'dialog' ? ' cdialog' : '')});
  const lab = opts.label || (c.type === 'dialog' ? 'Wer hat recht?' : two ? 'Konzeptfrage mit Begründung' : 'Konzeptfrage');
  let html = '<div class="qh">' + escH(lab) + '</div>';
  if (c.text) html += '<div class="stack csit">' + md(c.text) + '</div>';
  if (c.type === 'dialog' && Array.isArray(c.people)) html += '<div class="talk">' + c.people.map((p, i) => '<div class="say s' + (i % 2) + '"><span class="who">' + escH(p.name) + '</span><div class="said">' + inl(p.says || '') + '</div></div>').join('') + '</div>';
  box.innerHTML = html;
  const sv = opts.saved || {};
  const ans = {k:sv.k, k2:sv.k2};
  const q1spec = {q:c.q || (c.type === 'dialog' ? 'Wer hat recht?' : ''), opts:c.opts, a:c.a, ex:c.ex, fb:c.fb, keep:c.type === 'dialog' || c.keep};
  const q2spec = two ? Object.assign({}, c.reason, {q:c.reason.q || 'Warum?'}) : null;
  const nach = h('div', {class:'small cnach'});
  let q1, q2;
  const sel = () => { if (opts.onSelect) opts.onSelect({k:ans.k, k2:ans.k2}); };
  if (opts.exam){
    q1 = mcBox(q1spec, {exam:true, label:two ? 'Antwort' : null, saved:ans.k, onSelect:k => { ans.k = k; sel(); }});
    box.append(q1);
    if (two){ q2 = mcBox(q2spec, {exam:true, label:'Begründung', saved:ans.k2, onSelect:k => { ans.k2 = k; sel(); }}); box.append(q2); }
    box.append(nach);
  } else if (two){
    q1 = mcBox(q1spec, {hold:true, label:'Antwort', saved:ans.k, onAnswer:(ok, k) => { ans.k = k; showReason(false); }});
    box.append(q1);
    const showReason = silent => {
      if (q2) return;
      box.append(h('p', {class:'small muted'}, 'Jetzt die Begründung. Danach siehst du, ob beides stimmt.'));
      q2 = mcBox(q2spec, {label:'Begründung', saved:ans.k2, onAnswer:(ok, k) => { ans.k2 = k; finish(false); }});
      box.append(q2, nach);
      if (ans.k2 !== undefined && ans.k2 !== null) finish(true);
    };
    if (ans.k !== undefined && ans.k !== null) showReason(true);
  } else {
    q1 = mcBox(q1spec, {saved:ans.k, onAnswer:(ok, k) => { ans.k = k; finish(false); }});
    box.append(q1, nach);
    if (ans.k !== undefined && ans.k !== null) finish(true);
  }
  function links(){
    const L = [];
    if (c.seg && t) L.push(segLinkHTML(t.id, c.seg));
    if (c.lex) L.push(refLinkHTML(c.lex));
    nach.innerHTML = L.filter(Boolean).join(' · ');
  }
  function finish(silent){
    if (two) q1.reveal(ans.k);
    links();
    if (!silent && opts.onAnswer){ const r = result(); opts.onAnswer(r.ok, {k:ans.k, k2:ans.k2}); }
  }
  function result(){ return conceptScore(c, ans); }
  box.result = result;
  box.reveal = () => { q1.reveal(ans.k); if (q2) q2.reveal(ans.k2); links(); };
  return box;
}
/* Punkte: mc/dialog 2 P., mc2 je 1 P. für Antwort und Begründung; „gelöst“ nur, wenn alles stimmt */
function conceptScore(c, a){
  a = a || {};
  const two = c.type === 'mc2' && !!c.reason;
  const r1 = a.k === c.a, r2 = two ? a.k2 === c.reason.a : true;
  return {ok:r1 && r2, pts:two ? (r1 ? 1 : 0) + (r2 ? 1 : 0) : (r1 ? 2 : 0), max:2};
}
/* zu welchem Thema gehört eine Aufgabe? */
let TASK2TOPIC = null;
function topicOfTask(id){
  if (!TASK2TOPIC){
    TASK2TOPIC = {};
    for (const t of TOPICS){
      const add = k => { if (k && k.id) TASK2TOPIC[k.id] = t; };
      (t.practice || []).forEach(add); (t.final || []).forEach(x => add(x && x.task)); (t.finalB || []).forEach(x => add(x && x.task));
      if (t.example && t.example.faded) add(t.example.faded);
      (t.errors || []).forEach(e => { TASK2TOPIC[e.id + '-fix'] = t; TASK2TOPIC[e.id] = t; });
    }
  }
  return TASK2TOPIC[id] || null;
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
function showNotationHelp(){ showDlg('So schreibst du Formeln', md(NOTATION_HELP), {cls:'dlg-wide'}); }
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
- Der Finger schreibt nicht (Schutz vor dem Handballen). Für Geräte ohne Stift lässt sich das in den Einstellungen einschalten. Dort kannst du auch seltene Zeichen wie ψ, ħ, ∂ anlernen.

**Skizzen und Schmierzettel.** Skizzen zeichnest du mit Stift, Maus oder – auf Geräten ohne Stift – mit dem Finger; „Prüfen“ fragt nach, wenn ein Merkmal wie Knotenzahl oder Symmetrie nicht passt. Unter jeder Rechenaufgabe klappt „✎ Schmierzettel“ eine freie Fläche für Nebenrechnungen auf. Sie wird gespeichert, aber nicht ausgewertet und nie gesendet.`;

/* ===== Rechenblatt für ein Ziel =====
   opts: slot, fresh, prefill, onResult(r)
         exam    – Prüfung: keine Prüfung je Zeile, keine Hilfen (Probeklausur, Abschluss neuer Form)
         final   – Abschluss alter Form (Rückfall): Prüfen ohne Meldungstext
         locked  – Auswertung: nur lesen, Zeilen werden geprüft angezeigt; solution: Musterlösung darunter
         firstTry – Wiederholen: erst ohne Hinweise; „Hinweise freischalten“ zählt als Hilfe */
const LINE_MSG_DEFAULT = 'Dieser Schritt stimmt nicht. Vergleiche mit der Zeile davor.';
function goalPoints(goal, res){
  const P = goal.points || (goal.type === 'show' ? 3 : 2);
  if (!res || !res.final) return {p:0, P, state:null};
  const f = res.final;
  const okLines = res.lines.filter(l => l.status === 'ok' || l.status === 'folge' || l.status === 'def').length;
  let p;
  if (f.state === 'solved') p = P; else if (f.state === 'solvedWithErrors' || f.state === 'folge') p = Math.max(P - 1, 0); else p = Math.min(okLines, P - 1);
  return {p, P, state:f.state};
}
/* Punkte aus gespeicherten Zeilen, ohne Oberfläche (Abschluss, Probeklausur) */
function scoreGoal(task, goal, lines){
  const L = (lines || []).map(x => String(x == null ? '' : x));
  const P = goal.points || (goal.type === 'show' ? 3 : 2);
  if (!L.some(x => x.trim())) return {p:0, P, state:'empty', solved:false};
  let res;
  try { res = checkTask(task.ctx, goal, L, task.id + ':' + goal.id); } catch(e){ console.error(e); return {p:0, P, state:'error', solved:false}; }
  const g = goalPoints(goal, res);
  return {p:g.p, P, state:g.state, solved:g.state === 'solved'};
}
function sheetGoal(task, goal, opts){
  opts = opts || {};
  const ctx = ctxOf(task.ctx);
  const st = store.goal(task.id + (opts.slot || ''), goal.id);
  if (opts.fresh){ st.lines = [{m:'', w:''}]; st.state = null; st.points = 0; st.help = 0; st.seen = false; st.att = 0; st.first = null; st.unlocked = false; }
  if (opts.prefill && (!st.lines.length || (st.lines.length === 1 && !st.lines[0].m))) st.lines = opts.prefill.map(m => ({m, w:''}));
  const root = h('div', {class:'goal'});
  root.innerHTML = '<div class="gp">' + inl(goal.prompt || '') + (goal.points ? ' <span class="muted small">(' + goal.points + ' P.)</span>' : '') + '</div>';
  const sheet = h('div', {class:'sheet'});
  const tools = h('div', {class:'sheet-tools'});
  const gstate = h('div', {class:'gstate', hidden:true});
  const hints = h('div');
  root.append(sheet, tools, gstate, hints);
  const rows = [];
  let lastRes = null, lastArgs = null;
  const book = !opts.exam && !opts.locked && !opts.final && !opts.noBook;
  function addRow(m, w, focus, mode){
    const row = h('div', {class:'ln'});
    const stEl = h('div', {class:'st', 'aria-hidden':'true'}, '·');
    const inp = h('input', {class:'math', type:'text', autocomplete:'off', autocapitalize:'off', spellcheck:'false', 'aria-label':'Rechenzeile ' + (rows.length + 1), placeholder:rows.length ? 'nächster Schritt' : firstPh(goal)});
    inp.value = m || '';
    const why = h('input', {class:'why', type:'text', placeholder:'Notiz (wird nicht geprüft)', 'aria-label':'Notiz zur Zeile (freiwillig, wird nicht geprüft)', title:'Freiwillige Notiz, zum Beispiel eine Begründung. Sie wird nicht geprüft.'});
    why.value = w || '';
    const x = h('button', {class:'x', type:'button', title:'Zeile löschen', 'aria-label':'Zeile löschen'}, '×');
    const pv = h('div', {class:'pv'}), fbk = h('div', {class:'fbk', hidden:true});
    const body = h('div', {class:'lnb'}, h('div', {class:'inp'}, inp, why, x), pv, fbk);
    row.append(stEl, body);
    sheet.append(row);
    const R = {row, inp, why, pv, fbk, stEl};
    rows.push(R);
    if (opts.locked){ inp.readOnly = true; why.readOnly = true; x.hidden = true; if (!why.value) why.hidden = true; preview(R); return R; }
    /* Stift oder Tastatur je Zeile (15-ink.js); gelesener Text landet im Eingabefeld und läuft wie getippt */
    if (typeof INKUI !== 'undefined') R.ink = new INKUI.InkLine(R, {mode:mode || INKUI.defaultMode(), task, ctx:() => ctx,
      extra:() => rows.slice(0, Math.max(0, rows.indexOf(R))).map(r => r.inp.value.trim()).filter(Boolean),
      onText:() => {
        clearTimeout(tm); preview(R); markStale(R); save();
        /* auf dem Blatt immer eine freie Stiftzeile unter der letzten beschriebenen */
        if (R.inp.value.trim() && rows[rows.length - 1] === R && R.ink.mode === 'pen') addRow('', '', false, 'pen');
      },
      onEnter:() => enterRow(R, 'pen'),
      onConfirm:() => { if (R.row.classList.contains('unsure')){ if (opts.exam || !lastArgs){ markStale(R); } else runCheck(lastArgs[0], lastArgs[1]); } }});
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
    if (opts.exam){ if (R.ink && R.ink.needsConfirm && R.ink.needsConfirm()) showUnsure(R, true); }
    else if ((store.data.settings.mode || 'line') === 'line') runCheck(i);
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
  const saved = st.lines.length ? st.lines : [{m:'', w:''}];
  for (const l of (opts.locked ? saved.filter((l, i) => (l.m && String(l.m).trim()) || i === 0) : saved)) addRow(l.m, l.w, false, l.m && String(l.m).trim() ? 'kbd' : null);
  // Werkzeuge
  const bAdd = h('button', {class:'btn btn-sm', type:'button'}, '+ Zeile');
  bAdd.onclick = () => addRow('', '', true);
  const bCheck = h('button', {class:'btn btn-sm btn-primary', type:'button'}, opts.exam ? 'Gespeichert' : 'Prüfen');
  bCheck.onclick = () => runCheck(rows.length - 1, true);
  const bHint = h('button', {class:'btn btn-sm', type:'button'}, 'Hinweis');
  /* „Lösung ansehen“ erst nach einem Prüfversuch mit mindestens einer nicht leeren Zeile */
  const bSol = h('button', {class:'btn btn-sm', type:'button', hidden:!st.att}, 'Lösung ansehen');
  const bAsk = h('button', {class:'btn btn-sm btn-ghost', type:'button'}, '? Frage');
  const bUnlock = h('button', {class:'btn btn-sm btn-ghost', type:'button'}, 'Ich komme nicht weiter: Hinweise freischalten');
  const pts = h('span', {class:'pts small'});
  if (opts.locked){ /* keine Werkzeuge */ }
  else if (opts.exam) tools.append(bAdd);
  else if (opts.final) tools.append(bAdd, bCheck, pts);
  else if (opts.firstTry && !st.unlocked && !st.first){ tools.append(bAdd, bCheck, bUnlock, pts); }
  else tools.append(bAdd, bCheck, bHint, bSol, bAsk, pts);
  bUnlock.onclick = () => {
    st.unlocked = true; if (!st.first) st.first = {state:'help'}; store.save();
    bUnlock.remove(); pts.before(bHint, bSol, bAsk);
    if (opts.onUnlock) opts.onUnlock();
  };
  /* Hinweise in Stufen: 1 Strategie, 2 Regel, 3 nächster Schritt. Die letzte Stufe gibt es erst,
     wenn seit dem vorigen Hinweis eine eigene, nicht leere Zeile geprüft wurde. */
  let hintLevel = 0, chk = 0, chkAtHint = -1;
  const HINT_NAMES = ['Strategie', 'Regel', 'Nächster Schritt'];
  bHint.onclick = () => {
    const H = goal.hints || [];
    const levels = H.concat(goal.model && goal.model.length && H.length < 3 ? ['__step'] : []);
    if (hintLevel >= levels.length){ toast(bSol.hidden ? 'Keine weiteren Hinweise. Prüf eine eigene Zeile, dann gibt es die Lösung.' : 'Keine weiteren Hinweise. Schau dir die Lösung an.'); return; }
    const last = hintLevel >= 1 && hintLevel === levels.length - 1;
    if (last && chk <= chkAtHint){
      if (!hints.querySelector('.hint-wait')) hints.append(h('div', {class:'hintbox hint-wait', html:'<b>Erst du:</b> Schreib nach dem letzten Hinweis selbst eine Zeile und prüfe sie. Dann gibt es die letzte Stufe.'}));
      return;
    }
    $$('.hint-wait', hints).forEach(x => x.remove());
    const k = levels[hintLevel++];
    const lab = 'Hinweis ' + hintLevel + ' von ' + levels.length + (k === '__step' ? ' – nächster Schritt mit Lücke' : HINT_NAMES[hintLevel - 1] ? ' – ' + HINT_NAMES[hintLevel - 1] : '');
    let html;
    if (k === '__step'){
      const done = lastRes ? lastRes.lines.filter(l => l.status === 'ok' || l.status === 'def').length : 0;
      const m = goal.model[Math.min(done, goal.model.length - 1)];
      const ml = typeof m === 'string' ? {l:m} : m;
      html = '<b>' + escH(lab) + ':</b> ' + gapHTML(ml, ctx);
    } else html = '<b>' + escH(lab) + ':</b> ' + inl(k);
    hints.append(h('div', {class:'hintbox', html}));
    bHint.textContent = hintLevel < levels.length ? 'Weiterer Hinweis' : 'Hinweis';
    chkAtHint = chk;
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
    lastArgs = [upto, all];
    const lines = rows.map(r => r.inp.value);
    let take = all ? lines : lines.slice(0, upto + 1);
    /* Lesart prüfen: Eine unsicher gelesene Zeile wird nicht geprüft; die Prüfung endet davor */
    const uIdx = opts.locked ? -1 : rows.findIndex((r, i) => i < take.length && r.ink && r.ink.needsConfirm && r.ink.needsConfirm());
    if (uIdx >= 0) take = take.slice(0, uIdx);
    let res = null;
    if (take.length){
      try { res = checkTask(task.ctx, goal, take, task.id + ':' + goal.id); }
      catch(e){ console.error(e); toast('Beim Prüfen ist ein Fehler passiert: ' + e.message); return; }
      lastRes = res;
      res.lines.forEach((r, i) => showLine(rows[i], r));
    }
    if (uIdx >= 0){ showUnsure(rows[uIdx], false); rows.forEach((r, k) => { if (k > uIdx){ r.row.className = 'ln'; r.stEl.textContent = '·'; r.fbk.hidden = true; } }); gstate.hidden = true; }
    if (take.some(x => String(x || '').trim())){
      st.att = (st.att || 0) + 1; st.tries = (st.tries || 0) + 1; chk++;
      if (!(opts.firstTry && !st.unlocked && !st.first)) bSol.hidden = false;
    }
    if (res && book){
      const T = topicOfTask(task.id);
      res.lines.forEach((lr, i) => { if (lr.status === 'wrong' && String(take[i] || '').trim()){ const M = lineMsgs(lr); store.errAdd({k:'line', t:T ? T.id : '', ref:task.id, goal:goal.id, pos:i, text:take[i], msg:M.msgs[0] || LINE_MSG_DEFAULT, lex:M.lex[0] || null, title:task.title, prompt:goal.prompt || ''}); } });
      if (res.final && res.final.state === 'solved') store.errSolved(task.id, goal.id);
    }
    if (res && uIdx < 0 && (all || upto === rows.length - 1 || res.final && res.final.state === 'solved')) showFinal(res.final);
    save();
    return res;
  }
  /* Meldungen einer Zeile; Meldungen können Text oder {msg, lex} sein, Zeile/Schritte können lex tragen */
  function lineMsgs(r){
    const msgs = [], lex = [];
    const addLex = v => { if (v) [].concat(v).forEach(x => x && lex.push(x)); };
    const add = m => { if (!m) return; if (typeof m === 'object'){ addLex(m.lex); m = m.msg || m.text || ''; } if (m) msgs.push(String(m)); };
    add(r.msg); addLex(r.lex);
    for (const s of r.steps || []){ add(s.msg); (s.msgs || []).forEach(add); addLex(s.lex); }
    (r.msgs || []).forEach(add);
    return {msgs:[...new Set(msgs)], lex:[...new Set(lex.map(x => typeof x === 'object' ? JSON.stringify(x) : x))].map(x => x[0] === '{' ? JSON.parse(x) : x)};
  }
  function showLine(R, r){
    if (!R) return;
    const ic = {ok:'✓', folge:'↪', wrong:'✗', na:'i', info:'i', parse:'?', def:'=', empty:'·'}[r.status] || '·';
    R.row.className = 'ln ' + r.status; R.stEl.textContent = ic;
    const M = lineMsgs(r);
    if (r.status === 'wrong' && !M.msgs.length) M.msgs.push(LINE_MSG_DEFAULT);
    const links = M.lex.map(x => refLinkHTML(x)).filter(Boolean);
    if (M.msgs.length && !(opts.final && r.status === 'wrong')){ R.fbk.innerHTML = M.msgs.map(m => inl(m)).join('<br>') + (links.length ? '<div class="nachl">' + links.join(' · ') + '</div>' : ''); R.fbk.hidden = false; }
    else if (opts.final && r.status === 'wrong'){ R.fbk.textContent = 'Diese Zeile stimmt nicht.'; R.fbk.hidden = false; }
    else R.fbk.hidden = true;
  }
  /* gelb: „Lesart prüfen“ statt ✓/✗ (Handschrift unsicher gelesen) */
  function showUnsure(R, examMode){
    R.row.className = 'ln unsure'; R.stEl.textContent = '?';
    R.fbk.innerHTML = '<b>Lesart prüfen:</b> Die Handschrift ist unsicher gelesen. Stimmt die Vorschau? Sonst korrigiere die Zeile. ';
    const b = h('button', {class:'btn btn-sm', type:'button'}, examMode ? 'Stimmt so' : 'Stimmt so – prüfen');
    b.onclick = () => { if (R.ink) R.ink.confirm(); if (examMode){ R.row.className = 'ln'; R.stEl.textContent = '·'; R.fbk.hidden = true; } };
    R.fbk.append(b); R.fbk.hidden = false;
  }
  function showFinal(f){
    if (!f) return;
    const G = goalPoints(goal, lastRes);
    const P = G.P, p = G.p;
    st.state = f.state; st.points = Math.max(st.points && st.state === 'solved' ? st.points : 0, p); st.lastPoints = p;
    if (opts.firstTry && !st.first && !st.unlocked && f.state === 'solved') st.first = {state:'solved', points:p};
    gstate.className = 'gstate ' + f.state; gstate.hidden = false;
    gstate.innerHTML = inl(f.msg || '') + (opts.exam ? '' : ' <span class="pts">' + p + ' von ' + P + ' Punkten</span>') + (st.help && f.state === 'solved' && !opts.final && !opts.locked ? ' <span class="muted small">(mit Hilfe)</span>' : '');
    pts.textContent = '';
    store.save();
    if (opts.onResult) opts.onResult({state:f.state, points:p, max:P, help:st.help || 0, first:st.first || null});
  }
  root.check = () => runCheck(rows.length - 1, true);
  root.result = () => lastRes;
  if (opts.locked){
    if (rows.some(r => r.inp.value.trim())) runCheck(rows.length - 1, true);
    else { gstate.className = 'gstate open'; gstate.hidden = false; gstate.innerHTML = 'Nicht bearbeitet. <span class="pts">0 von ' + goalPoints(goal, null).P + ' Punkten</span>'; }
    if (opts.solution) hints.append(modelBox(goal, ctx));
  }
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
  box.innerHTML = '<b>Musterlösung</b><ol class="model">' + (goal.model || []).map(m => { const ml = typeof m === 'string' ? {l:m} : m; return '<li>' + drlHTML(ml.l, ctx) + (ml.w ? '<span class="why">' + inl(ml.w) + '</span>' : '') + '</li>'; }).join('') + '</ol>' + (goal.note ? '<p class="small">' + inl(goal.note) + '</p>' : '');
  return box;
}
/* Aufgabe mit allen Zielen */
function taskBox(task, opts){
  opts = opts || {};
  const box = h('div', {class:'task', 'data-task':task.id});
  box.innerHTML = (task.synth ? '<div class="tag synth">Synthese: verbindet mehrere Themen</div>' : '') + '<h3>' + inl(task.title) + (task.src ? ' <span class="muted small">' + escH(task.src) + '</span>' : '') + '</h3><div class="stack">' + md(task.text) + '</div>';
  const results = {};
  for (const g of task.goals){
    const el = sheetGoal(task, g, Object.assign({}, opts, {onResult:r => { results[g.id] = r; if (opts.onResult) opts.onResult(task, g, r, results); }}));
    box.append(el);
  }
  /* Schmierzettel je Aufgabe und Kontext (17-sketch.js): ohne Erkennung, nie an die KI */
  if (typeof SKUI !== 'undefined' && !opts.noScratch) box.append(SKUI.scratchBox(task, opts.slot || ''));
  box.results = results;
  return box;
}
