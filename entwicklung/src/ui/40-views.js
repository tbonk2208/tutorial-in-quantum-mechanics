/* ===== Ansichten und Navigation ===== */
const STEPS = [['Ziel und Check', 'Du siehst, was du am Ende kannst. Vier kurze Fragen zeigen, womit du anfängst.'],
  ['Einstieg', 'Ein vorgerechnetes Beispiel mit Warum-Fragen oder eine Knobelaufgabe vor der Erklärung. Du wählst.'],
  ['Klären', 'Kernidee, worauf es ankommt, typische Fehler.'],
  ['Darstellen', 'Formel und Bild im Labor verbinden, danach dieselbe Frage ohne Bild.'],
  ['Vergleichen', 'Zwei richtige Lösungswege: Wann ist welcher besser?'],
  ['Üben', 'Aufgaben mit zeilenweiser Prüfung, vom Leichten zum Schweren.'],
  ['Abschluss', 'Vier Aufgaben ohne Hilfe. Ab 3 von 4 sitzt das Thema.']];
const NAV = [['start', 'Start'], ['learn', 'Neues lernen'], ['practice', 'Üben'], ['review', 'Wiederholen'], ['exam', 'Klausur vorbereiten'], null, ['lex', 'Nachschlagen'], ['settings', 'Einstellungen'], ['solutions', 'Lösungen & Fortschritt'], ['sources', 'Quellen']];
const ICONKEY = {start:'start', learn:'learn', practice:'practice', review:'review', exam:'exam', lex:'lex', settings:'settings', solutions:'solutions', sources:'sources'};
let CUR = null;
function go(path){
  CUR = path;
  try { if (location.hash !== '#/' + path){ history.pushState(null, '', '#/' + path); } } catch(e){}
  render();
}
function route(){
  let h = '';
  try { h = location.hash || ''; } catch(e){}
  const src = CUR !== null ? CUR : h.startsWith('#/') ? h.slice(2) : 'start';
  const p = src.split('/').map(decodeURIComponent); return p[0] ? p : ['start'];
}
function renderNav(active){
  const side = $('#side'); side.innerHTML = '';
  for (const n of NAV){
    if (!n){ side.append(h('hr')); continue; }
    const b = h('button', {type:'button', class:active === n[0] ? 'on' : '', html:icon(ICONKEY[n[0]]) + '<span>' + escH(n[1]) + '</span>'});
    b.onclick = () => go(n[0]); side.append(b);
  }
  const sure = TOPICS.filter(t => store.topic(t.id).final && store.topic(t.id).final.sure).length;
  $('#topprog').innerHTML = '<span class="bar"><i style="width:' + Math.round(100 * sure / TOPICS.length) + '%"></i></span>' + sure + '/' + TOPICS.length + '<span class="lbl">&nbsp;Themen sicher</span>';
}
function render(){
  const r = route();
  const main = $('#main');
  main.innerHTML = '';
  renderNav(r[0]);
  const V = VIEWS[r[0]] || VIEWS.start;
  try { V(main, r.slice(1)); } catch(e){ console.error(e); main.innerHTML = '<h2>Hier ist etwas schiefgegangen</h2><p class="muted">' + escH(e.message) + '</p><p><button class="btn" onclick="location.hash=\'#/start\'">Zur Startseite</button></p>'; }
  if (r[0] !== 'learn' || !r[2]) window.scrollTo(0, 0);
  store.data.last = location.hash; store.save();
}
const VIEWS = {};
/* Kapitel: Mathematische Grundlagen (M1 …) und Quantenmechanik (Thema 1 …) */
const CHAPTERS = [['math', 'Mathematische Grundlagen', 'Mathe-Grundlagen'], ['qm', 'Quantenmechanik', 'Quantenmechanik']];
const chName = ch => (CHAPTERS.find(c => c[0] === ch) || ['', ''])[1];
const chTopics = ch => TOPICS.filter(t => t.ch === ch);
const isSure = t => !!(store.topic(t.id).final && store.topic(t.id).final.sure);
function curCh(){ const c = store.data.ch; return CHAPTERS.some(x => x[0] === c) ? c : 'qm'; }
function tnum(t){ const i = chTopics(t.ch).indexOf(t) + 1; return t.ch === 'math' ? 'M' + i : String(i); }
function tname(t){ return t.ch === 'math' ? tnum(t) : 'Thema ' + tnum(t); }
function chapterTabs(onChange){
  const bar = h('div', {class:'chtabs', role:'tablist', 'aria-label':'Kapitel'});
  for (const [k, name, short] of CHAPTERS){
    const L = chTopics(k);
    const b = h('button', {type:'button', role:'tab', 'aria-selected':String(curCh() === k), class:curCh() === k ? 'on' : '', html:'<span class="bl">' + escH(name) + '</span><span class="bs">' + escH(short) + '</span> <span class="cnt">' + L.filter(isSure).length + '/' + L.length + '</span>'});
    b.onclick = () => { store.data.ch = k; store.save(); onChange(k); };
    bar.append(b);
  }
  return bar;
}

/* ---------- Start ---------- */
VIEWS.start = main => {
  main.append(h('h1', {}, 'Was möchtest du heute machen?'));
  const cards = h('div', {class:'cards c2'});
  for (const [k, cls, t, s] of [['learn', 'k1', 'Neues lernen', 'Ein Thema Schritt für Schritt'], ['practice', 'k2', 'Üben', 'Herleitungen zu einem Thema rechnen'], ['review', 'k3', 'Wiederholen', 'Gelerntes auffrischen'], ['exam', 'k4', 'Klausur vorbereiten', 'Plan und Probeklausur']]){
    const c = h('button', {class:'card ' + cls, type:'button', html:'<span class="cic">' + icon(k) + '</span><h3>' + t + '</h3><span class="muted small">' + s + '</span>'});
    c.onclick = () => go(k); cards.append(c);
  }
  main.append(cards);
  // Für heute
  const td = h('div', {class:'today stack'});
  td.append(h('h3', {}, 'Für heute'));
  const next = nextTopic();
  const lastT = TOPICS.find(t => store.topic(t.id).step > 1 && !(store.topic(t.id).final && store.topic(t.id).final.sure));
  const L = h('ul', {class:'clean'});
  if (lastT) L.append(h('li', {html:'Weitermachen: <a href="#/learn/' + lastT.id + '/' + store.topic(lastT.id).step + '">' + tname(lastT) + ': ' + escH(lastT.title) + '</a>'}));
  else if (next) L.append(h('li', {html:'Als Nächstes: <a href="#/learn/' + next.id + '/1">' + tname(next) + ': ' + escH(next.title) + '</a>'}));
  const due = dueTopics();
  if (due.length) L.append(h('li', {html:'Fällig zum Wiederholen: ' + due.map(t => '<a href="#/review/' + t.id + '">' + escH(t.short || t.title) + '</a>').join(', ')}));
  const ex = store.data.exam;
  if (ex.date){ const d = Math.round((new Date(ex.date) - new Date(today())) / 864e5); if (d >= 0) L.append(h('li', {html:'Klausur in <b>' + d + '</b> Tag' + (d === 1 ? '' : 'en') + ' · <a href="#/exam">Plan ansehen</a>'})); }
  if (!L.children.length) L.append(h('li', {}, 'Alles erledigt. Eine Probeklausur hält das Wissen frisch.'));
  td.append(L);
  td.append(h('p', {class:'small muted', html:'Neu hier? Unter <a href="#/lex/schreibweise">Nachschlagen → Schreibweise</a> steht, wie man Formeln eintippt. Das Tutorial ersetzt keine Vorlesung und kein Lehrbuch; es hilft beim Üben. Das Kapitel <b>Mathematische Grundlagen</b> (M1–M' + chTopics('math').length + ') frischt die Methoden auf, die die Quantenmechanik braucht.'}));
  main.append(td);
};
function nextTopic(ch){ return chTopics(ch || curCh()).find(t => !isSure(t)); }
function dueTopics(){ const d = today(); return TOPICS.filter(t => { const r = store.data.review[t.id]; return r && r.due <= d; }); }

/* ---------- Neues lernen ---------- */
VIEWS.learn = (main, args) => {
  if (args[0]){ const t = topicById(args[0]); if (t) return topicView(main, t, +(args[1] || store.topic(t.id).step || 1)); }
  main.append(h('h1', {}, 'Neues lernen'));
  main.append(h('p', {class:'muted'}, 'Wähle ein Thema. Du lernst es in sieben kleinen Schritten.'));
  const how = h('details', {class:'box', style:'margin-top:14px'});
  how.innerHTML = '<summary><b>Wie läuft ein Thema ab?</b></summary><ol class="clean">' + STEPS.map(s => '<li><b>' + s[0] + ':</b> ' + s[1] + '</li>').join('') + '</ol><p class="small muted">Die Abfolge folgt der Lernforschung (Beispiele mit Selbsterklärung, produktives Scheitern, Abrufübung, verteiltes Wiederholen; siehe <a href="#/sources">Quellen</a>) und der physikdidaktischen Forschung zu Lernschwierigkeiten in der Quantenmechanik.</p>';
  main.append(how);
  main.append(topicList(t => go('learn/' + t.id + '/' + (store.topic(t.id).step || 1)), 'Starten'));
};
function topicList(onPick, label){
  const outer = h('div');
  const draw = () => {
    outer.innerHTML = '';
    outer.append(chapterTabs(draw));
    const ch = curCh();
    outer.append(h('p', {class:'small muted chintro', html:ch === 'math' ? 'Methoden der Physik, so weit die Quantenmechanik sie braucht. Du kannst jedes Thema einzeln bearbeiten; die Eingangschecks der QM-Themen verweisen auf das passende Mathe-Thema.' : 'Standardstoff Quantenmechanik I. Fehlt dir Mathematik, zeigt der Eingangscheck, welches Thema aus <b>Mathematische Grundlagen</b> hilft.'}));
    outer.append(topicRows(chTopics(ch), onPick, label));
  };
  draw();
  return outer;
}
function topicRows(list, onPick, label){
  const wrap = h('div', {class:'topic-list'});
  const next = nextTopic();
  for (const t of list){
    const s = store.topic(t.id);
    const sure = s.final && s.final.sure;
    const stat = sure ? 'Sicher' : s.final ? 'Abschluss: ' + s.final.score + ' von 4' : s.step > 1 ? 'Begonnen (Schritt ' + s.step + ')' : 'Noch nicht angefangen';
    const row = h('div', {class:'topic' + (sure ? ' sure' : '')});
    row.innerHTML = '<span class="num">' + tnum(t) + '</span><div><b>' + escH(t.title) + '</b>' + (t === next ? '<span class="tag">als Nächstes</span>' : '') + (sure ? '<span class="tag good">sicher</span>' : '') + '<div class="small muted">' + escH(t.src || '') + '</div><div class="small muted">' + stat + '</div></div>';
    const b = h('button', {class:'btn btn-sm', type:'button'}, label); b.onclick = () => onPick(t);
    row.append(b); wrap.append(row);
  }
  return wrap;
}
function topicView(main, t, step){
  const s = store.topic(t.id);
  s.step = step; store.data.ch = t.ch; store.save();
  main.append(h('button', {class:'back', type:'button', onclick:() => go('learn')}, '← Neues lernen'));
  main.append(h('div', {class:'small muted', html:escH(chName(t.ch)) + ' · ' + tname(t) + (t.src ? ' · ' + escH(t.src) : '') + ' · <a href="#/lex">Begriff nachschlagen</a>'}));
  main.append(h('h1', {style:'margin-top:4px'}, t.title));
  const pills = h('div', {class:'steps', role:'tablist'});
  STEPS.forEach((st, i) => {
    const b = h('button', {type:'button', class:(i + 1 === step ? 'on ' : '') + (s.done[i + 1] ? 'done' : ''), html:'<span class="n">' + (s.done[i + 1] ? '✓' : i + 1) + '</span>' + st[0]});
    b.onclick = () => go('learn/' + t.id + '/' + (i + 1)); pills.append(b);
  });
  main.append(pills);
  const body = h('section', {class:'stack'});
  body.append(h('div', {class:'steph', html:'<span class="n">' + step + '</span><h2>' + STEPS[step - 1][0] + '</h2>'}));
  main.append(body);
  const nextBtn = (label, cond) => {
    const wrap = h('div', {class:'row', style:'margin-top:22px'});
    const b = h('button', {class:'btn btn-primary', type:'button'}, label || (step < 7 ? 'Weiter: ' + STEPS[step][0] : 'Zur Themenübersicht'));
    const note = h('span', {class:'small muted'});
    const upd = () => { const ok = !cond || cond() || s.done[step]; b.disabled = !ok; note.textContent = ok ? '' : 'Beantworte zuerst die Frage(n) oben.'; };
    b.onclick = () => { s.done[step] = true; store.save(); go(step < 7 ? 'learn/' + t.id + '/' + (step + 1) : 'learn'); };
    wrap.append(b, note); upd();
    wrap.upd = upd;
    return wrap;
  };
  STEPVIEW[step](body, t, s, nextBtn);
}
const STEPVIEW = {};
STEPVIEW[1] = (body, t, s, nextBtn) => {
  body.append(h('div', {class:'box box-goal', html:'<h4>Das kannst du danach</h4><ul class="clean">' + t.goals.map(g => '<li>' + inl(g) + '</li>').join('') + '</ul>'}));
  if (t.needs) body.append(h('p', {class:'small', html:'<b>Das brauchst du schon:</b> ' + inl(t.needs)}));
  const mref = (t.math || []).map(topicById).filter(Boolean);
  if (mref.length) body.append(h('p', {class:'small', html:'<b>Mathe dazu:</b> ' + mref.map(m => '<a href="#/learn/' + m.id + '/' + (store.topic(m.id).step || 1) + '">' + tname(m) + ' ' + escH(m.title) + '</a>' + (isSure(m) ? ' ✓' : '')).join(' · ')}));
  body.append(h('h3', {}, 'Eingangscheck'));
  body.append(h('p', {class:'small muted'}, t.check.length + ' kurze Fragen. Sie zählen nicht. Sie zeigen nur, womit du am besten anfängst. Wenn du etwas nicht weißt, tippe auf „Weiß ich noch nicht“.'));
  s.check = s.check || {};
  const res = h('div');
  const nb = nextBtn(null, () => t.check.every((q, i) => s.check[i] !== undefined));
  t.check.forEach((q, i) => {
    body.append(mcBox(Object.assign({dk:true}, q), {label:'Frage ' + (i + 1) + ' von ' + t.check.length, saved:s.check[i], onAnswer:(ok, k) => { s.check[i] = k; store.save(); showRes(); nb.upd(); }}));
  });
  body.append(res);
  function showRes(){
    if (!t.check.every((q, i) => s.check[i] !== undefined)){ res.innerHTML = ''; return; }
    const right = t.check.filter((q, i) => s.check[i] === q.a).length;
    const miss = t.check.filter((q, i) => s.check[i] !== q.a && (q.lex || q.prev));
    s.entry = right >= 3 ? 'puzzle' : 'example'; store.save();
    res.innerHTML = '';
    const box = h('div', {class:'box box-key'});
    box.innerHTML = '<h4>Ergebnis: ' + right + ' von ' + t.check.length + '</h4><p>' + (right >= 3 ? 'Gute Grundlage. Empfehlung: Starte mit der <b>Knobelaufgabe</b> – erst selbst probieren, dann die Erklärung.' : 'Empfehlung: Starte mit dem <b>vorgerechneten Beispiel</b>. Die Warum-Fragen helfen, die Schritte zu verstehen.') + '</p>';
    if (miss.length){
      box.insertAdjacentHTML('beforeend', '<p style="margin-top:8px"><b>Das frischst du am besten zuerst auf:</b></p>');
      const ul = h('ul', {class:'clean'});
      for (const q of miss){
        if (q.lex){ const e = LEX.find(x => x.id === q.lex); if (e){ const d = h('details'); d.innerHTML = '<summary>' + escH(e.title) + '</summary><div class="stack small">' + md(e.text) + '</div>'; ul.append(h('li', {}, d)); } }
        if (q.prev){ const p = topicById(q.prev); if (p){ const b = h('button', {class:'btn btn-sm', type:'button'}, 'Zu ' + tname(p) + ': ' + p.title); b.onclick = () => go('learn/' + p.id + '/1'); ul.append(h('li', {}, b)); } }
      }
      box.append(ul);
    }
    res.append(box);
  }
  showRes();
  body.append(nb);
  const skip = h('button', {class:'btn btn-ghost btn-sm', type:'button'}, 'Ohne Check selbst wählen');
  skip.onclick = () => { s.done[1] = true; store.save(); go('learn/' + t.id + '/2'); };
  body.append(skip);
};
STEPVIEW[2] = (body, t, s, nextBtn) => {
  const rec = s.entry || 'example';
  body.append(h('p', {}, 'Wie möchtest du einsteigen?'));
  const cards = h('div', {class:'cards', style:'margin-top:6px'});
  const area = h('div', {class:'stack'});
  const opts = [['example', 'k1', 'Vorgerechnetes Beispiel', 'Schritt für Schritt mit Warum-Fragen, danach eine ähnliche Aufgabe mit Lücken'],
    ['puzzle', 'k3', 'Knobelaufgabe', 'Erst selbst probieren, dann klären'], ['direct', 'k2', 'Direkt üben', 'Wenn du das Thema schon kennst']];
  for (const [k, cls, title, sub] of opts){
    const c = h('button', {class:'card ' + cls, type:'button', html:'<h3>' + title + (k === rec ? '<span class="tag">empfohlen</span>' : '') + '</h3><span class="small muted">' + sub + '</span>'});
    c.onclick = () => { s.entryChosen = k; store.save(); show(k); };
    cards.append(c);
  }
  body.append(cards, area);
  const nb = nextBtn(null, () => s.entryDone);
  body.append(nb);
  function show(k){
    area.innerHTML = '';
    if (k === 'direct'){ s.entryDone = true; store.save(); go('learn/' + t.id + '/6'); return; }
    if (k === 'example') exampleView(area, t, s, () => { s.entryDone = true; store.save(); nb.upd(); });
    else puzzleView(area, t, s, () => { s.entryDone = true; store.save(); nb.upd(); });
    area.scrollIntoView({behavior:'smooth', block:'start'});
  }
  if (s.entryChosen && s.entryChosen !== 'direct') show(s.entryChosen);
};
function exampleView(area, t, s, done){
  const ex = t.example; const ctx = ctxOf(ex.ctx);
  area.append(h('h3', {}, 'Beispiel: ' + ex.title));
  area.append(h('div', {class:'stack', html:md(ex.text)}));
  const ol = h('ol', {class:'model stack'});
  area.append(ol);
  s.ex = s.ex || {};
  let k = 0;
  const step = () => {
    if (k >= ex.lines.length){ faded(); return; }
    const L = ex.lines[k];
    const li = h('li', {html:lineHTML(L.l, ctx) + (L.w ? ' <span class="muted small">' + inl(L.w) + '</span>' : '')});
    ol.append(li);
    const i = k; k++;
    if (L.why){
      const q = mcBox(L.why, {label:'Warum?', saved:s.ex[i], onAnswer:(ok, j) => { s.ex[i] = j; store.save(); step(); }});
      li.append(q);
      if (s.ex[i] !== undefined) step();
    } else step();
  };
  step();
  function faded(){
    if (area.querySelector('.faded')) return;
    if (!ex.faded){ done(); return; }
    const f = h('div', {class:'faded stack'});
    f.append(h('h3', {style:'margin-top:16px'}, 'Jetzt du: ähnliche Aufgabe mit Lücken'));
    f.append(h('p', {class:'small muted'}, 'Die ersten Zeilen stehen schon da. Ergänze die fehlenden Schritte und prüfe.'));
    const tb = taskBox(ex.faded, {prefill:ex.faded.given, onResult:(task, g, r) => { if (r.state === 'solved' || r.state === 'solvedWithErrors') done(); }});
    f.append(tb);
    const skip = h('button', {class:'btn btn-ghost btn-sm', type:'button'}, 'Überspringen');
    skip.onclick = () => done();
    f.append(skip);
    area.append(f);
  }
}
function puzzleView(area, t, s, done){
  const p = t.puzzle;
  area.append(h('h3', {}, 'Knobelaufgabe: ' + p.title));
  area.append(h('div', {class:'stack', html:md(p.text)}));
  const rev = h('div', {class:'box box-key', hidden:true, html:'<h4>Auflösung</h4>' + md(p.reveal)});
  const q = mcBox(p.q, {label:'Deine Vermutung', saved:s.puz, onAnswer:(ok, j) => { s.puz = j; store.save(); rev.hidden = false; done(); }});
  area.append(q, rev);
  if (s.puz !== undefined){ rev.hidden = false; }
  area.append(h('p', {class:'small muted'}, 'Erst überlegen, dann antworten: Falsche Vermutungen sind hier ausdrücklich erlaubt – sie machen die Erklärung danach wirksamer.'));
}
STEPVIEW[3] = (body, t, s, nextBtn) => {
  const c = t.clarify;
  body.append(h('div', {class:'box box-key', html:'<h4>Kernidee</h4>' + md(c.core)}));
  if (c.keys) body.append(h('div', {class:'box', html:'<h4>Worauf es ankommt</h4><ul class="clean">' + c.keys.map(k => '<li>' + inl(k) + '</li>').join('') + '</ul>'}));
  if (c.errors) body.append(h('div', {class:'box box-warn', html:'<h4>Typische Fehler</h4><ul class="clean">' + c.errors.map(k => '<li>' + inl(k) + '</li>').join('') + '</ul>'}));
  for (const m of c.more || []){ const d = h('details', {class:'box'}); d.innerHTML = '<summary><b>' + escH(m.title) + '</b></summary><div class="stack" style="margin-top:8px">' + md(m.text) + '</div>'; body.append(d); }
  s.cl = s.cl || {};
  const qs = c.checks || [];
  const nb = nextBtn(null, () => qs.every((q, i) => s.cl[i] !== undefined));
  if (qs.length) body.append(h('h3', {}, 'Kurz geprüft'));
  qs.forEach((q, i) => body.append(mcBox(q, {label:'Frage ' + (i + 1), saved:s.cl[i], onAnswer:(ok, j) => { s.cl[i] = j; store.save(); nb.upd(); }})));
  body.append(nb);
};
STEPVIEW[4] = (body, t, s, nextBtn) => {
  const L = t.lab;
  body.append(h('h3', {}, 'Labor: ' + L.title));
  body.append(h('div', {class:'stack', html:md(L.text)}));
  const lab = h('div', {class:'lab'});
  body.append(lab);
  try { (LABS[L.type] || LABS.none)(lab, L); } catch(e){ console.error(e); lab.textContent = 'Das Labor lässt sich gerade nicht anzeigen.'; }
  s.lab = s.lab || {};
  const qs = L.questions || [];
  const nb = nextBtn(null, () => qs.every((q, i) => s.lab[i] !== undefined) && (!L.noPic || s.lab.np !== undefined));
  qs.forEach((q, i) => body.append(mcBox(q, {label:'Mit Bild ' + (i + 1), saved:s.lab[i], onAnswer:(ok, j) => { s.lab[i] = j; store.save(); nb.upd(); showNp(); }})));
  const np = h('div', {class:'stack'});
  body.append(np);
  function showNp(){
    if (!L.noPic || np.children.length || !qs.every((q, i) => s.lab[i] !== undefined)) return;
    np.append(h('h3', {}, 'Jetzt ohne Bild'));
    np.append(mcBox(L.noPic, {label:'Ohne Bild', saved:s.lab.np, onAnswer:(ok, j) => { s.lab.np = j; store.save(); nb.upd(); }}));
  }
  showNp();
  body.append(nb);
};
STEPVIEW[5] = (body, t, s, nextBtn) => {
  const c = t.compare; const ctx = ctxOf(c.ctx);
  body.append(h('div', {class:'stack', html:md(c.text)}));
  const grid = h('div', {class:'cmp'});
  for (const side of [c.A, c.B]){
    const b = h('div', {class:'box'});
    b.innerHTML = '<h4>' + escH(side.name) + '</h4>' + (side.text ? md(side.text) : '') + '<ol class="model">' + side.model.map(m => { const ml = typeof m === 'string' ? {l:m} : m; return '<li>' + lineHTML(ml.l, ctx) + (ml.w ? ' <span class="muted small">' + inl(ml.w) + '</span>' : '') + '</li>'; }).join('') + '</ol>';
    grid.append(b);
  }
  body.append(grid);
  s.cmp = s.cmp || {};
  const qs = c.questions || [];
  const nb = nextBtn(null, () => qs.every((q, i) => s.cmp[i] !== undefined));
  qs.forEach((q, i) => body.append(mcBox(q, {label:'Vergleich ' + (i + 1), saved:s.cmp[i], onAnswer:(ok, j) => { s.cmp[i] = j; store.save(); nb.upd(); }})));
  body.append(nb);
};
STEPVIEW[6] = (body, t, s, nextBtn) => {
  body.append(h('p', {class:'muted', html:'Rechne Zeile für Zeile. Mit <b>Enter</b> wird die Zeile geprüft und eine neue angelegt. ✓ richtig, ↪ folgerichtig (Fehler weiter oben), ✗ falsch, i nicht bewertbar. Hinweise sind gestuft; die Lösung gibt es nach einem eigenen Versuch.'}));
  for (const task of t.practice) body.append(taskBox(task, {}));
  body.append(nextBtn());
};
STEPVIEW[7] = (body, t, s, nextBtn) => {
  body.append(h('p', {class:'muted'}, 'Vier Aufgaben ohne Hinweise und ohne Lösung. „Sicher“ heißt: mindestens 3 von 4 richtig. Was nicht geklappt hat, kommt beim Wiederholen bald wieder.'));
  s.fin = s.fin || {};
  const res = h('div');
  const items = t.final;
  items.forEach((it, i) => {
    if (it.q) body.append(mcBox(it, {label:'Aufgabe ' + (i + 1) + ' von ' + items.length, saved:s.fin[i] ? s.fin[i].k : undefined, onAnswer:(ok, k) => { s.fin[i] = {ok, k}; store.save(); judge(); }}));
    else {
      const w = h('div', {class:'stack'});
      w.append(h('div', {class:'small muted', style:'margin-top:16px;font-weight:700;letter-spacing:.05em;text-transform:uppercase'}, 'Aufgabe ' + (i + 1) + ' von ' + items.length));
      w.append(taskBox(it.task, {final:true, slot:'#fin', onResult:(task, g, r, all) => {
        const okAll = task.goals.every(gg => all[gg.id] && (all[gg.id].state === 'solved'));
        if (task.goals.every(gg => all[gg.id])){ s.fin[i] = {ok:okAll}; store.save(); judge(); }
      }}));
      body.append(w);
    }
  });
  body.append(res);
  function judge(){
    const answered = items.filter((_, i) => s.fin[i]).length;
    if (answered < items.length){ res.innerHTML = '<p class="small muted" style="margin-top:14px">Noch ' + (items.length - answered) + ' offen.</p>'; return; }
    const score = items.filter((_, i) => s.fin[i].ok).length;
    const sure = score >= 3;
    s.final = {score, sure, date:today()}; s.done[7] = true;
    const rv = store.data.review[t.id] || {box:0};
    rv.box = sure ? Math.max(rv.box, 1) : 0; rv.due = addDays(today(), sure ? 3 : 1); rv.weak = items.map((it, i) => s.fin[i].ok ? null : i).filter(x => x !== null);
    store.data.review[t.id] = rv; store.save();
    res.innerHTML = '';
    const box = h('div', {class:'box ' + (sure ? 'box-goal' : 'box-warn')});
    box.innerHTML = '<h4>' + (sure ? 'Sicher: ' : 'Noch nicht ganz sicher: ') + score + ' von ' + items.length + '</h4><p>' + (sure ? 'Das Thema sitzt. Es kommt in ' + (rv.due === addDays(today(), 3) ? 'drei Tagen' : 'einigen Tagen') + ' zum Wiederholen.' : 'Schau dir die Aufgaben noch einmal an. Morgen kommt das Thema zum Wiederholen; unter „Üben“ kannst du gleich weiterrechnen.') + '</p>';
    if (!sure){ const b = h('button', {class:'btn btn-sm', type:'button'}, 'Gezielt üben'); b.onclick = () => go('learn/' + t.id + '/6'); box.append(b); }
    res.append(box);
    renderNav('learn');
  }
  judge();
  body.append(nextBtn('Zur Themenübersicht'));
};

/* ---------- Üben ---------- */
VIEWS.practice = (main, args) => {
  if (args[0]){
    const t = topicById(args[0]);
    if (t){
      main.append(h('button', {class:'back', type:'button', onclick:() => go('practice')}, '← Üben'));
      main.append(h('h1', {}, 'Üben: ' + t.title));
      main.append(h('p', {class:'muted small'}, 'Alle Übungsaufgaben des Themas. Erklärungen findest du im Lernweg unter „Klären“.'));
      for (const task of t.practice) main.append(taskBox(task, {}));
      if (t.errors && t.errors.length){ main.append(h('h2', {style:'margin-top:26px'}, 'Fehler finden')); for (const e of t.errors) main.append(errorBox(t, e)); }
      return;
    }
  }
  main.append(h('h1', {}, 'Üben'));
  main.append(h('p', {class:'muted'}, 'Wähle ein Thema – oder eine gemischte Runde mit Aufgaben aus Themen, die du schon begonnen hast.'));
  const mix = h('button', {class:'btn btn-primary', type:'button', style:'margin-top:12px'}, 'Gemischte Runde (3 Aufgaben)');
  mix.onclick = () => go('mixed');
  main.append(mix);
  main.append(topicList(t => go('practice/' + t.id), 'Aufgaben'));
};
VIEWS.mixed = main => {
  main.append(h('button', {class:'back', type:'button', onclick:() => go('practice')}, '← Üben'));
  main.append(h('h1', {}, 'Gemischte Runde'));
  const started = TOPICS.filter(t => store.topic(t.id).step > 1 || store.topic(t.id).final);
  const pool = (started.length ? started : chTopics(curCh()).slice(0, 3)).flatMap(t => t.practice.map(task => [t, task]));
  const pick = shuffle(pool).slice(0, 3);
  main.append(h('p', {class:'muted small'}, 'Vermischtes Üben: Du musst erst erkennen, welches Verfahren passt. Das ist anstrengender, bleibt aber länger hängen.'));
  for (const [t, task] of pick){ main.append(h('p', {class:'small muted', style:'margin-top:16px'}, 'Aus ' + tname(t) + ': ' + t.title)); main.append(taskBox(task, {slot:'#mix', fresh:true})); }
};
function errorBox(t, e){
  const ctx = ctxOf(e.ctx);
  const box = h('div', {class:'task'});
  box.innerHTML = '<h3>' + inl(e.title) + '</h3>' + md(e.text) + '<p class="small muted">Tippe auf die erste falsche Zeile.</p>';
  const st = store.data.errs[e.id] || (store.data.errs[e.id] = {});
  const lines = e.lines.map((l, i) => {
    const d = h('div', {class:'err-line', html:(i + 1) + '. ' + lineHTML(l, ctx)});
    d.onclick = () => pickLine(i); box.append(d); return d;
  });
  const fb = h('div', {class:'stack'}); box.append(fb);
  function pickLine(i){
    if (st.found) return;
    lines.forEach(d => d.classList.remove('sel'));
    if (i === e.wrong){ lines[i].classList.add('right'); st.found = true; store.save(); explain(); }
    else { lines[i].classList.add('sel'); fb.innerHTML = '<p class="small">Diese Zeile folgt korrekt aus der vorigen. Such weiter.</p>'; }
  }
  function explain(){
    fb.innerHTML = '';
    fb.append(mcBox(e.why, {label:'Was ist falsch?', saved:st.why, onAnswer:(ok, k) => { st.why = k; store.save(); fix(); }}));
    if (st.why !== undefined) fix();
  }
  function fix(){
    if (fb.querySelector('.task') || !e.fix) return;
    fb.append(h('p', {class:'small'}, 'Berichtige die Zeile und rechne zu Ende:'));
    fb.append(taskBox({id:e.id + '-fix', title:'Berichtigung', text:'', ctx:e.ctx, goals:[e.fix]}, {prefill:e.lines.slice(0, e.wrong)}));
  }
  if (st.found){ lines[e.wrong].classList.add('right'); explain(); }
  return box;
}

/* ---------- Wiederholen ---------- */
VIEWS.review = (main, args) => {
  if (args[0]){ const t = topicById(args[0]); if (t) return reviewTopic(main, t); }
  main.append(h('h1', {}, 'Wiederholen'));
  main.append(h('p', {class:'muted'}, 'Verteiltes Wiederholen: Ein Thema kommt nach 1, 3, 7, 14 und 30 Tagen wieder – früher, wenn etwas nicht geklappt hat.'));
  const due = dueTopics();
  const learned = TOPICS.filter(t => store.data.review[t.id]);
  if (!learned.length){ main.append(h('p', {style:'margin-top:16px'}, 'Noch nichts zu wiederholen. Schließe zuerst ein Thema unter „Neues lernen“ ab.')); return; }
  main.append(h('h3', {style:'margin-top:18px'}, due.length ? 'Heute fällig' : 'Heute ist nichts fällig'));
  const wrap = h('div', {class:'topic-list'});
  for (const t of (due.length ? due : learned)){
    const r = store.data.review[t.id];
    const row = h('div', {class:'topic'});
    row.innerHTML = '<span class="num">' + tnum(t) + '</span><div><b>' + escH(t.title) + '</b><div class="small muted">fällig am ' + r.due + ' · Stufe ' + (r.box || 0) + '</div></div>';
    const b = h('button', {class:'btn btn-sm', type:'button'}, 'Wiederholen'); b.onclick = () => go('review/' + t.id);
    row.append(b); wrap.append(row);
  }
  main.append(wrap);
  const errs = TOPICS.filter(t => (store.topic(t.id).final || {}).sure && t.errors && t.errors.length);
  if (errs.length){ main.append(h('h3', {style:'margin-top:22px'}, 'Fehler finden')); for (const t of errs) for (const e of t.errors) main.append(errorBox(t, e)); }
};
function reviewTopic(main, t){
  main.append(h('button', {class:'back', type:'button', onclick:() => go('review')}, '← Wiederholen'));
  main.append(h('h1', {}, 'Wiederholen: ' + t.title));
  const rv = store.data.review[t.id] || (store.data.review[t.id] = {box:0, due:today()});
  const R = rng(hashStr(t.id + today()));
  const tasks = shuffle(t.practice, R).slice(0, 2);
  const mc = shuffle(t.check.concat(t.final.filter(x => x.q)), R)[0];
  main.append(h('p', {class:'muted small'}, 'Zwei Aufgaben und eine Frage – aus dem Gedächtnis, erst danach nachschlagen.'));
  const res = {};
  const judge = () => {
    if (Object.keys(res).length < tasks.length + 1) return;
    const ok = Object.values(res).filter(Boolean).length;
    const good = ok >= tasks.length;
    rv.box = good ? Math.min((rv.box || 0) + 1, 5) : Math.max((rv.box || 0) - 1, 0);
    rv.due = addDays(today(), [1, 3, 7, 14, 30, 60][rv.box]);
    store.save();
    main.append(h('div', {class:'box ' + (good ? 'box-goal' : 'box-warn'), html:'<b>' + (good ? 'Gut gemacht.' : 'Noch etwas wackelig.') + '</b> Nächste Wiederholung am ' + rv.due + '.'}));
  };
  if (mc) main.append(mcBox(mc, {label:'Frage', onAnswer:ok => { res.mc = ok; judge(); }}));
  for (const task of tasks) main.append(taskBox(task, {slot:'#rev' + today(), fresh:true, onResult:(tk, g, r, all) => { if (tk.goals.every(gg => all[gg.id])){ res[tk.id] = tk.goals.every(gg => all[gg.id].state === 'solved'); judge(); } }}));
  const rd = h('details', {class:'box', style:'margin-top:18px'});
  rd.innerHTML = '<summary><b>Nachlesen: Kernidee</b></summary>' + md(t.clarify.core);
  main.append(rd);
}

/* ---------- Klausur vorbereiten ---------- */
VIEWS.exam = (main, args) => {
  if (args[0] === 'run') return examRun(main);
  const ex = store.data.exam;
  main.append(h('h1', {}, 'Klausur vorbereiten'));
  const f = h('div', {class:'box stack'});
  f.innerHTML = '<h3>Plan</h3><label class="fld">Klausurtermin <input type="date" class="ex-date" value="' + escH(ex.date || '') + '"></label><label class="fld">Lernzeit pro Tag <select class="ex-min">' + [30, 45, 60, 90, 120].map(m => '<option value="' + m + '"' + ((ex.minutes || 60) === m ? ' selected' : '') + '>' + m + ' Minuten</option>').join('') + '</select></label><p class="small muted" style="margin-top:8px">Klausurthemen:</p>';
  const tl = h('div', {class:'stack small'});
  for (const [ch, name] of CHAPTERS.slice().reverse()){
    tl.append(h('p', {class:'small', style:'margin-top:6px'}, h('b', {}, name)));
    for (const t of chTopics(ch)){ const id = 'ext-' + t.id; tl.append(h('label', {class:'ckm', html:'<input type="checkbox" id="' + id + '"' + ((ex.topics ? ex.topics.includes(t.id) : t.ch === 'qm') ? ' checked' : '') + '> <span>' + tnum(t) + ' ' + escH(t.title) + '</span>'})); }
  }
  f.append(tl);
  const bs = h('button', {class:'btn btn-primary', type:'button'}, 'Plan erstellen');
  f.append(bs);
  const plan = h('div');
  bs.onclick = () => { ex.date = $('.ex-date', f).value; ex.minutes = +$('.ex-min', f).value; ex.topics = TOPICS.filter(t => $('#ext-' + t.id).checked).map(t => t.id); store.save(); drawPlan(); };
  main.append(f, plan);
  function drawPlan(){
    plan.innerHTML = '';
    if (!ex.date){ return; }
    const days = Math.max(1, Math.round((new Date(ex.date) - new Date(today())) / 864e5));
    const tps = TOPICS.filter(t => (ex.topics || []).includes(t.id));
    const open = tps.filter(t => !(store.topic(t.id).final && store.topic(t.id).final.sure));
    const sure = tps.filter(t => store.topic(t.id).final && store.topic(t.id).final.sure);
    const rows = [];
    const per = Math.max(1, Math.ceil(open.length / Math.max(1, days - 2)));
    let d = 0;
    for (let i = 0; i < open.length; i += per){ rows.push([addDays(today(), d), 'Neu lernen: ' + open.slice(i, i + per).map(t => t.short || t.title).join(', ')]); d++; }
    for (let i = 0; d < days - 1 && i < 30; i++){ const t = sure.concat(open)[i % Math.max(1, tps.length)]; if (!t) break; rows.push([addDays(today(), d), 'Wiederholen: ' + (t.short || t.title) + ' · gemischte Runde']); d++; }
    rows.push([addDays(ex.date, -1), 'Probeklausur unter Zeitdruck, danach Schwachstellen üben']);
    plan.append(h('div', {class:'box', style:'margin-top:16px', html:'<h3>Tagesplan bis zum ' + escH(ex.date) + ' (' + ex.minutes + ' min/Tag)</h3><table class="tb"><tr><th>Tag</th><th>Was</th></tr>' + rows.map(r => '<tr><td>' + r[0] + '</td><td>' + escH(r[1]) + '</td></tr>').join('') + '</table>'}));
  }
  drawPlan();
  const pk = h('div', {class:'box stack', style:'margin-top:18px'});
  pk.innerHTML = '<h3>Probeklausur</h3><p class="small muted">Ohne Hinweise und ohne Prüfen. Am Ende gibt es Punkte, alle Lösungen und die Themen, die du noch üben solltest.</p><label class="fld">Umfang <select class="pk-n"><option value="3">3 Aufgaben · 30 Minuten</option><option value="5" selected>5 Aufgaben · 50 Minuten</option><option value="7">7 Aufgaben · 75 Minuten</option></select></label>';
  const bp = h('button', {class:'btn btn-primary', type:'button'}, 'Probeklausur starten');
  bp.onclick = () => { const n = +$('.pk-n', pk).value; const tps = TOPICS.filter(t => ex.topics ? ex.topics.includes(t.id) : t.ch === 'qm'); const pool = tps.flatMap(t => t.practice.filter(k => !k.noExam).map(k => [t.id, k.id])); store.data.examRun = {start:Date.now(), min:{3:30, 5:50, 7:75}[n], tasks:shuffle(pool).slice(0, n), done:false}; store.save(); go('exam/run'); };
  pk.append(bp); main.append(pk);
};
function examRun(main){
  const run = store.data.examRun;
  if (!run){ go('exam'); return; }
  main.append(h('button', {class:'back', type:'button', onclick:() => go('exam')}, '← Klausur vorbereiten'));
  main.append(h('h1', {}, 'Probeklausur'));
  const timer = h('p', {class:'timer'});
  main.append(timer);
  const boxes = [];
  for (const [tid, kid] of run.tasks){
    const t = topicById(tid), task = t && t.practice.find(k => k.id === kid);
    if (!task) continue;
    const b = taskBox(task, {exam:!run.done, slot:'#exam' + run.start});
    boxes.push([t, task, b]); main.append(b);
  }
  const fin = h('button', {class:'btn btn-primary', type:'button', style:'margin-top:20px'}, run.done ? 'Neue Probeklausur' : 'Abgeben');
  const out = h('div');
  main.append(fin, out);
  const tick = () => { if (run.done) { timer.textContent = 'Abgegeben.'; return; } const left = run.min * 60 - Math.round((Date.now() - run.start) / 1000); timer.textContent = left > 0 ? 'Noch ' + Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0') + ' min' : 'Zeit abgelaufen – gib ab.'; };
  tick(); const iv = setInterval(() => { if (!document.body.contains(timer)) clearInterval(iv); else tick(); }, 1000);
  fin.onclick = () => {
    if (run.done){ store.data.examRun = null; store.save(); go('exam'); return; }
    run.done = true; store.save();
    main.innerHTML = ''; examRun(main);
  };
  if (run.done){
    let got = 0, max = 0; const weak = new Set();
    for (const [t, task, b] of boxes){
      for (const gEl of $$('.goal', b)){ const r = gEl.check ? gEl.check() : null; }
      for (const g of task.goals){ const st = store.goal(task.id + '#exam' + run.start, g.id); const P = g.points || (g.type === 'show' ? 3 : 2); max += P; got += st.lastPoints || 0; if (st.state !== 'solved') weak.add(t); }
      for (const g of task.goals) b.append(modelBox(g, ctxOf(task.ctx)));
    }
    out.append(h('div', {class:'box box-key', style:'margin-top:16px', html:'<h3>' + got + ' von ' + max + ' Punkten (' + Math.round(100 * got / Math.max(1, max)) + ' %)</h3>' + (weak.size ? '<p>Noch üben: ' + [...weak].map(t => '<a href="#/practice/' + t.id + '">' + escH(t.title) + '</a>').join(', ') + '</p>' : '<p>Alles gelöst.</p>')}));
  }
}

/* ---------- Nachschlagen ---------- */
VIEWS.lex = (main, args) => {
  main.append(h('h1', {}, 'Nachschlagen'));
  const wrap = h('div', {class:'lex stack'});
  const q = h('input', {type:'search', placeholder:'Begriff suchen, z. B. Kommutator, Normierung, Tunneleffekt', 'aria-label':'Begriff suchen'});
  const list = h('div');
  wrap.append(q, list); main.append(wrap);
  const all = [{id:'schreibweise', title:'Schreibweise: Formeln eintippen', text:NOTATION_HELP}].concat(LEX.slice().sort((a, b) => a.title.localeCompare(b.title, 'de')));
  const draw = () => {
    const s = q.value.trim().toLowerCase();
    list.innerHTML = '';
    for (const e of all){
      if (s && !(e.title.toLowerCase().includes(s) || (e.text || '').toLowerCase().includes(s) || (e.tags || '').includes(s))) continue;
      const d = h('details', {id:'lex-' + e.id});
      d.innerHTML = '<summary>' + escH(e.title) + '</summary><div class="stack" style="margin-top:8px">' + md(e.text) + (e.topic && topicById(e.topic) ? '<p class="small"><a href="#/learn/' + e.topic + '/3">Zu ' + escH(tname(topicById(e.topic)) + ': ' + topicById(e.topic).title) + '</a></p>' : '') + '</div>';
      if (args[0] === e.id) d.open = true;
      list.append(d);
    }
  };
  q.addEventListener('input', draw);
  draw();
  if (args[0]) setTimeout(() => { const el = document.getElementById('lex-' + args[0]); if (el) el.scrollIntoView({block:'start'}); }, 50);
};

/* ---------- Einstellungen ---------- */
VIEWS.settings = main => {
  const S = store.data.settings;
  main.append(h('h1', {}, 'Einstellungen'));
  const f = h('div', {class:'stack'});
  f.innerHTML = `<label class="fld">Darstellung <select class="s-theme"><option value="">wie das Gerät</option><option value="light">hell</option><option value="dark">dunkel</option></select></label>
  <label class="fld">Schriftgröße <select class="s-size"><option value="">normal</option><option value="l">groß</option></select></label>
  <label class="fld">Prüfen <select class="s-mode"><option value="line">Zeile für Zeile (mit Enter)</option><option value="all">Erst den ganzen Lösungsweg (mit „Prüfen“)</option></select></label>`;
  main.append(f);
  $('.s-theme', f).value = S.theme || ''; $('.s-size', f).value = S.size || ''; $('.s-mode', f).value = S.mode || 'line';
  f.addEventListener('change', () => { S.theme = $('.s-theme', f).value; S.size = $('.s-size', f).value; S.mode = $('.s-mode', f).value; store.save(); applySettings(); toast('Gespeichert.'); });
  const data = h('div', {class:'box stack', style:'margin-top:18px'});
  data.innerHTML = '<h3>Lernstand</h3><p class="small muted">Der Lernstand liegt nur auf diesem Gerät. Du kannst ihn als Datei sichern und auf einem anderen Gerät wieder einlesen.</p>';
  const bx = h('button', {class:'btn btn-sm', type:'button'}, 'Als Datei sichern');
  bx.onclick = () => download('qm-lernstand-' + today() + '.json', JSON.stringify(store.data, null, 1), 'application/json');
  const fi = h('input', {type:'file', accept:'application/json', 'aria-label':'Lernstand einlesen', style:'max-width:260px'});
  fi.onchange = () => { const r = new FileReader(); r.onload = () => { try { const d = JSON.parse(r.result); if (!d || typeof d !== 'object' || !d.topics) throw new Error('keine Lernstand-Datei'); store.data = d; store.load(); store.save(); toast('Lernstand eingelesen.'); render(); } catch(e){ toast('Datei passt nicht: ' + e.message); } }; r.readAsText(fi.files[0]); };
  const bd = h('button', {class:'btn btn-sm', type:'button'}, 'Alles zurücksetzen');
  bd.onclick = () => { if (!bd.dataset.sure){ bd.dataset.sure = '1'; bd.textContent = 'Wirklich alles löschen? Noch einmal tippen'; setTimeout(() => { delete bd.dataset.sure; bd.textContent = 'Alles zurücksetzen'; }, 5000); return; } store.data = {}; store.load(); store.save(); render(); };
  const bc = h('button', {class:'btn btn-sm', type:'button'}, 'In die Zwischenablage');
  bc.onclick = () => { try { navigator.clipboard.writeText(JSON.stringify(store.data)).then(() => toast('Kopiert. In eine Textdatei einfügen und sichern.'), () => toast('Kopieren nicht möglich.')); } catch(e){ toast('Kopieren nicht möglich.'); } };
  data.append(h('div', {class:'row'}, bx, bc, fi, bd));
  main.append(data);
  const ki = h('div', {class:'box stack', style:'margin-top:18px'});
  ki.append(h('h3', {}, 'KI-Antworten auf freie Fragen (optional)'));
  kiSetup(ki);
  main.append(ki);
};
function confirmBox(msg){ try { return window.confirm(msg); } catch(e){ return true; } }
function download(name, text, type){
  const b = new Blob([text], {type:type || 'text/plain'});
  const a = h('a', {href:URL.createObjectURL(b), download:name}); document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function applySettings(){
  const S = store.data.settings;
  if (S.theme) document.documentElement.dataset.theme = S.theme; else delete document.documentElement.dataset.theme;
  if (S.size) document.documentElement.dataset.size = S.size; else delete document.documentElement.dataset.size;
}

/* ---------- Lösungen & Fortschritt ---------- */
VIEWS.solutions = main => {
  main.append(h('h1', {}, 'Lösungen & Fortschritt'));
  main.append(h('p', {class:'muted small'}, 'Für dich, deine Tutorin oder deinen Tutor: Lernstand und alle Musterlösungen. Beim Lernen selbst gibt es die Lösung erst nach einem eigenen Versuch – das wirkt besser.'));
  const tb = h('table', {class:'tb'});
  tb.innerHTML = '<tr><th>Thema</th><th>Stand</th><th>Abschluss</th><th>Gelöste Ziele</th></tr>' + CHAPTERS.slice().reverse().map(([ch, name]) => '<tr><th colspan="4">' + escH(name) + '</th></tr>' + chTopics(ch).map(t => { const s = store.topic(t.id); const goals = t.practice.flatMap(k => k.goals.map(g => store.data.tasks[k.id] && store.data.tasks[k.id].goals[g.id])); const solved = goals.filter(g => g && g.state === 'solved').length; return '<tr><td>' + tnum(t) + ' ' + escH(t.title) + '</td><td>' + (s.final && s.final.sure ? 'sicher' : s.step > 1 ? 'Schritt ' + s.step : '–') + '</td><td>' + (s.final ? s.final.score + '/4 (' + s.final.date + ')' : '–') + '</td><td>' + solved + ' / ' + goals.length + '</td></tr>'; }).join('')).join('');
  main.append(tb);
  const bx = h('button', {class:'btn btn-sm', type:'button', style:'margin-top:12px'}, 'Bericht als Datei');
  bx.onclick = () => download('qm-bericht-' + today() + '.html', '<!DOCTYPE html><meta charset="utf-8"><title>Bericht Tutorial in Quantum Mechanics</title><h1>Bericht Tutorial in Quantum Mechanics, ' + today() + '</h1>' + tb.outerHTML, 'text/html');
  main.append(bx);
  main.append(h('h2', {style:'margin-top:26px'}, 'Alle Musterlösungen'));
  for (const t of CHAPTERS.slice().reverse().flatMap(([ch]) => chTopics(ch))){
    const d = h('details', {class:'box', style:'margin-top:8px'});
    d.innerHTML = '<summary><b>' + tnum(t) + ' ' + escH(t.title) + '</b></summary>';
    d.addEventListener('toggle', () => {
      if (!d.open || d.querySelector('.solution')) return;
      for (const task of t.practice){ d.append(h('h4', {style:'margin-top:12px', html:inl(task.title)})); d.append(h('div', {class:'small', html:md(task.text)})); for (const g of task.goals){ d.append(h('p', {class:'small', html:'<b>' + inl(g.prompt || '') + '</b>'})); d.append(modelBox(g, ctxOf(task.ctx))); } }
    });
    main.append(d);
  }
};

/* ---------- Quellen ---------- */
VIEWS.sources = main => {
  main.append(h('h1', {}, 'Quellen'));
  main.append(h('div', {class:'stack', html:md(SOURCES_TEXT)}));
};

/* ---------- Frage stellen ---------- */
function askPanel(container, task, goal, getLines){
  if (container.querySelector('.askp')) return;
  const p = h('div', {class:'hintbox askp stack'});
  p.innerHTML = '<b>Frage stellen</b><p class="small">Schreibweise unklar? <a href="#" class="nh">So tippst du Formeln</a>. Ein Begriff unklar? Such ihn hier:</p>';
  $('.nh', p).onclick = e => { e.preventDefault(); showNotationHelp(); };
  const q = h('input', {type:'search', placeholder:'Begriff oder Frage', style:'width:100%;font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--sheet);color:var(--ink)'});
  const out = h('div', {class:'small stack'});
  q.addEventListener('input', () => {
    const s = q.value.trim().toLowerCase(); out.innerHTML = '';
    if (s.length < 3) return;
    const hits = LEX.filter(e => e.title.toLowerCase().includes(s) || s.split(/\s+/).some(w => w.length > 3 && e.title.toLowerCase().includes(w))).slice(0, 4);
    for (const e of hits){ const d = h('details'); d.innerHTML = '<summary>' + escH(e.title) + '</summary>' + md(e.text); out.append(d); }
  });
  p.append(q, out);
  if (KI.ready()){
    const b = h('button', {class:'btn btn-sm', type:'button'}, 'KI fragen');
    const ko = h('div', {class:'small'});
    b.onclick = () => kiAsk(task, goal, q.value, getLines(), ko, b);
    p.append(b, ko);
  }
  container.append(p);
  q.focus();
}
