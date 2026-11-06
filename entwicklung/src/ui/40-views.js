/* ===== Ansichten und Navigation =====
   Lernweg Version 4 (Gutachten E2): Ziel und Diagnose → Vorhersage → Erklären → Beispiel → Labor → Üben → Abschluss.
   Themen ohne die neuen Inhaltsfelder (teach, phenomenon, diag, concept, finalB, final mit aim) laufen im bisherigen Ablauf (STEPS_OLD). */
const STEPS_OLD = [['Ziel und Check', 'Du siehst, was du am Ende kannst. Vier kurze Fragen zeigen, womit du anfängst.'],
  ['Einstieg', 'Ein vorgerechnetes Beispiel mit Warum-Fragen oder eine Knobelaufgabe vor der Erklärung. Du wählst.'],
  ['Klären', 'Kernidee, worauf es ankommt, typische Fehler.'],
  ['Darstellen', 'Formel und Bild im Labor verbinden, danach dieselbe Frage ohne Bild.'],
  ['Vergleichen', 'Zwei richtige Lösungswege: Wann ist welcher besser?'],
  ['Üben', 'Aufgaben mit zeilenweiser Prüfung, vom Leichten zum Schweren.'],
  ['Abschluss', 'Vier Aufgaben ohne Hilfe. Ab 3 von 4 sitzt das Thema.']];
const STEPS_NEW = [['Ziel und Diagnose', 'Lernziele, wozu du das brauchst und was aus früheren Themen wiederkommt. Kurze Fragen zu den Voraussetzungen und zum Thema zeigen, wo du stehst.'],
  ['Vorhersage', 'Ein Phänomen: Erst begründest du deine Vermutung in einem Satz, dann wählst du. Danach kommt die Auflösung.'],
  ['Erklären', 'Der Stoff in kurzen Abschnitten mit Bild, Herleitung und Fragen. Am Ende die Zusammenfassung.'],
  ['Beispiel', 'Ein vorgerechnetes Beispiel mit Warum-Fragen, danach eine Aufgabe mit Lücken.'],
  ['Labor', 'Erst vorhersagen, dann ausprobieren und erklären. Zum Schluss eine Frage ohne Bild.'],
  ['Üben', 'Rechenaufgaben mit zeilenweiser Prüfung, Konzeptfragen, zwei Lösungswege im Vergleich, Fehler finden.'],
  ['Abschluss', 'Fünf Aufgaben unter Prüfungsbedingungen. Ab 80 % und mit jedem Lernziel ist das Thema vorläufig sicher.']];
const STEPS = STEPS_NEW;
const isV4 = t => !!t && (['teach', 'diag', 'concept', 'finalB'].some(k => Array.isArray(t[k]) && t[k].length > 0) || !!t.phenomenon || (t.final || []).some(x => x && x.aim !== undefined));
const stepsOf = t => isV4(t) ? STEPS_NEW : STEPS_OLD;
const NAV = [['start', 'Start'], ['learn', 'Neues lernen'], ['practice', 'Üben'], ['review', 'Wiederholen'], ['exam', 'Klausur vorbereiten'], null, ['lex', 'Nachschlagen'], ['settings', 'Einstellungen'], ['solutions', 'Lösungen & Fortschritt'], ['sources', 'Quellen']];
const ICONKEY = {start:'start', learn:'learn', practice:'practice', review:'review', exam:'exam', lex:'lex', settings:'settings', solutions:'solutions', sources:'sources'};
let CUR = null, KEEP_SCROLL = false;
function go(path, keep){
  CUR = path; KEEP_SCROLL = !!keep;
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
  const sure = TOPICS.filter(isSure).length;
  $('#topprog').innerHTML = '<span class="bar"><i style="width:' + Math.round(100 * sure / TOPICS.length) + '%"></i></span>' + sure + '/' + TOPICS.length + '<span class="lbl">&nbsp;Themen sicher</span>';
}
function render(){
  if (typeof INKUI !== 'undefined') INKUI.flushAll();   /* Handschrift nicht verlieren */
  $$('.nh-dlg').forEach(d => d.remove());   /* offene Dialoge schließen */
  const r = route();
  const main = $('#main');
  main.innerHTML = '';
  renderNav(r[0]);
  const V = VIEWS[r[0]] || VIEWS.start;
  try { V(main, r.slice(1)); } catch(e){ console.error(e); main.innerHTML = '<h2>Hier ist etwas schiefgegangen</h2><p class="muted">' + escH(e.message) + '</p><p><button class="btn" onclick="location.hash=\'#/start\'">Zur Startseite</button></p>'; }
  if (!KEEP_SCROLL) window.scrollTo(0, 0);
  KEEP_SCROLL = false;
  store.data.last = location.hash; store.save();
}
const VIEWS = {};
/* Kapitel: Mathematische Grundlagen (M1 …) und Quantenmechanik (Thema 1 …) */
const CHAPTERS = [['math', 'Mathematische Grundlagen', 'Mathe-Grundlagen'], ['qm', 'Quantenmechanik', 'Quantenmechanik']];
const chName = ch => (CHAPTERS.find(c => c[0] === ch) || ['', ''])[1];
const chTopics = ch => TOPICS.filter(t => t.ch === ch);
/* Lernstand eines Themas, beim ersten Zugriff auf den neuen Lernweg umgestellt */
function tstate(t){ const s = store.topic(t.id); migrateTopic(t, s); return s; }
const isSure = t => !!(tstate(t).final && tstate(t).final.sure);
const isPrelim = t => { const f = tstate(t).final; return !!(f && f.v4 && f.prelim && !f.sure); };
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
/* Umstellung des Lernstands auf den neuen Lernweg: alte Schrittnummern abbilden, Abschluss-Ergebnis behalten.
   alt: 1 Ziel/Check, 2 Einstieg, 3 Klären, 4 Darstellen, 5 Vergleichen, 6 Üben, 7 Abschluss
   neu: 1 Ziel/Diagnose, 2 Vorhersage, 3 Erklären, 4 Beispiel, 5 Labor, 6 Üben (mit Vergleich), 7 Abschluss */
const OLD2NEW = {1:1, 2:2, 3:3, 4:5, 5:6, 6:6, 7:7};
function migrateTopic(t, s){
  if (!isV4(t) || s.v === 4) return;
  const od = s.done || {};
  const used = (s.step || 1) > 1 || Object.keys(od).length || s.final;
  if (used){
    s.old = {step:s.step, done:od, entry:s.entry, entryChosen:s.entryChosen};
    const nd = {};
    if (od[1]) nd[1] = true;
    if (od[2] && s.entryChosen === 'example') nd[4] = true;   /* Beispiel samt Lückenaufgabe schon bearbeitet */
    if (od[4]) nd[5] = true;
    if (od[6]) nd[6] = true;
    if (od[7]) nd[7] = true;
    s.done = nd;
    s.step = OLD2NEW[s.step] || 1;
    if (s.entryDone && s.entryChosen === 'example') s.exDone = true;
    if (s.final && !s.final.v4) s.final.legacy = true;          /* altes Ergebnis (x von 4) bleibt gültig */
    if (s.fin){ s.finOld = s.fin; delete s.fin; }
  }
  if (s.entry && s.entry !== 'adv' && s.entry !== 'guided') delete s.entry;   /* alte Empfehlung nach dem Voraussetzungscheck */
  s.v = 4;
}
function statusText(t){
  const s = tstate(t), f = s.final;
  if (f && f.sure) return f.legacy && !f.v4 ? 'Sicher (Abschluss alter Form)' : 'Sicher';
  if (f && f.v4 && f.prelim) return 'Vorläufig sicher · Wiederholung ab ' + fmtD(addDays(f.date, 2)) + ' macht es sicher';
  if (f && f.v4) return 'Abschluss: ' + Math.round(100 * f.pct) + ' % · noch nicht bestanden';
  if (f) return 'Abschluss: ' + f.score + ' von 4';
  if (s.step > 1) return 'Begonnen (Schritt ' + s.step + ')';
  return 'Noch nicht angefangen';
}

/* ---------- Start ---------- */
VIEWS.start = main => {
  main.append(h('h1', {}, 'Was möchtest du heute machen?'));
  const cards = h('div', {class:'cards c2'});
  for (const [k, cls, t, s] of [['learn', 'k1', 'Neues lernen', 'Ein Thema Schritt für Schritt'], ['practice', 'k2', 'Üben', 'Herleitungen zu einem Thema rechnen'], ['review', 'k3', 'Wiederholen', 'Gelerntes auffrischen, Fehlerheft'], ['exam', 'k4', 'Klausur vorbereiten', 'Plan und Probeklausur']]){
    const c = h('button', {class:'card ' + cls, type:'button', html:'<span class="cic">' + icon(k) + '</span><h3>' + t + '</h3><span class="muted small">' + s + '</span>'});
    c.onclick = () => go(k); cards.append(c);
  }
  main.append(cards);
  // Für heute
  const td = h('div', {class:'today stack'});
  td.append(h('h3', {}, 'Für heute'));
  const next = nextTopic();
  const lastT = TOPICS.find(t => tstate(t).step > 1 && !tstate(t).final);
  const L = h('ul', {class:'clean'});
  if (lastT) L.append(h('li', {html:'Weitermachen: <a href="#/learn/' + lastT.id + '/' + tstate(lastT).step + '">' + tname(lastT) + ': ' + escH(lastT.title) + '</a>'}));
  else if (next) L.append(h('li', {html:'Als Nächstes: <a href="#/learn/' + next.id + '/1">' + tname(next) + ': ' + escH(next.title) + '</a>'}));
  const due = dueTopics();
  if (due.length) L.append(h('li', {html:'Fällig zum Wiederholen: ' + due.map(t => '<a href="#/review/' + t.id + '">' + escH(t.short || t.title) + '</a>').join(', ')}));
  const nErr = store.data.errbook.filter(e => !e.done && !e.solved).length;
  if (nErr) L.append(h('li', {html:'Im <a href="#/review/heft">Fehlerheft</a> stehen ' + nErr + ' offene Einträge.'}));
  const ex = store.data.exam;
  if (ex.date){ const d = Math.round((new Date(ex.date) - new Date(today())) / 864e5); if (d >= 0) L.append(h('li', {html:'Klausur in <b>' + d + '</b> Tag' + (d === 1 ? '' : 'en') + ' · <a href="#/exam">Plan ansehen</a>'})); }
  if (!L.children.length) L.append(h('li', {}, 'Alles erledigt. Eine Probeklausur hält das Wissen frisch.'));
  td.append(L);
  main.append(td);
  /* Anleitung zum Selbststudium (ersetzt „ersetzt keine Vorlesung …“) */
  const how = h('div', {class:'box box-info selfstudy stack', style:'margin-top:22px'});
  how.innerHTML = '<h3>So lernst du hier im Selbststudium</h3><ul class="clean">'
    + '<li><b>Reihenfolge:</b> Arbeite die Themen der <b>Quantenmechanik</b> der Reihe nach durch, beginnend mit Thema 1. Die <b>Mathematischen Grundlagen</b> (M1–M' + chTopics('math').length + ') nimmst du bei Bedarf: Der Eingangscheck jedes Themas zeigt Lücken und bietet eine kurze Auffrischung an.</li>'
    + '<li><b>Zeitbedarf:</b> Plane je Thema etwa 3 bis 5 Stunden, verteilt auf zwei oder drei Sitzungen (grobe Schätzung). Lieber oft und kurz als selten und lang.</li>'
    + '<li><b>Lernweg:</b> Jedes Thema hat sieben Schritte. Erst sagst du ein Ergebnis vorher, dann liest du die Erklärung in kurzen Abschnitten mit Fragen. Danach folgen ein vorgerechnetes Beispiel, das Labor und die Übungen. Lies gründlich und beantworte die Fragen ehrlich: Falsche Antworten sind beim Lernen nützlich.</li>'
    + '<li><b>Abschluss:</b> fünf Aufgaben ohne Hilfe, einmal abgeben. Ab 80 % und mit jedem Lernziel ist ein Thema <b>vorläufig sicher</b>. <b>Sicher</b> wird es, wenn du frühestens zwei Tage später die Wiederholung bestehst.</li>'
    + '<li><b>Hilfen:</b> Hinweise kommen in Stufen, die Lösung erst nach einem eigenen Versuch. Deine Fehler sammelt das <a href="#/review/heft">Fehlerheft</a>.</li></ul>'
    + '<p class="small muted">Formeln eintippen: <a href="#/lex/schreibweise">Nachschlagen → Schreibweise</a>. Ein Lehrbuch zum Nachlesen ist trotzdem nützlich; die Kapitel stehen bei jedem Thema.</p>';
  main.append(how);
};
function nextTopic(ch){ return chTopics(ch || curCh()).find(t => !isSure(t) && !isPrelim(t)); }
function dueTopics(){ const d = today(); return TOPICS.filter(t => { const r = store.data.review[t.id]; return r && r.due <= d; }); }

/* ---------- Neues lernen ---------- */
VIEWS.learn = (main, args) => {
  if (args[0]){ const t = topicById(args[0]); if (t) return topicView(main, t, +(args[1] || tstate(t).step || 1), args[2]); }
  main.append(h('h1', {}, 'Neues lernen'));
  main.append(h('p', {class:'muted'}, 'Wähle ein Thema. Du lernst es in sieben kleinen Schritten.'));
  const how = h('details', {class:'box', style:'margin-top:14px'});
  how.innerHTML = '<summary><b>Wie läuft ein Thema ab?</b></summary><ol class="clean">' + STEPS_NEW.map(s => '<li><b>' + s[0] + ':</b> ' + s[1] + '</li>').join('') + '</ol><p class="small muted">Themen, deren neuer Erklärteil noch nicht fertig ist, laufen vorerst im bisherigen Ablauf (Ziel und Check, Einstieg, Klären, Darstellen, Vergleichen, Üben, Abschluss).</p><p class="small muted">Die Abfolge folgt der Lernforschung (Vorhersagen vor der Erklärung, Erklären in kurzen Abschnitten, Beispiele mit Selbsterklärung, Abrufübung, verteiltes Wiederholen; siehe <a href="#/sources">Quellen</a>) und der physikdidaktischen Forschung zu Lernschwierigkeiten in der Quantenmechanik.</p>';
  main.append(how);
  main.append(topicList(t => go('learn/' + t.id + '/' + (tstate(t).step || 1)), 'Starten', true));
};
/* Auftakt im Reiter „Quantenmechanik“: Text kommt aus Thema 1 (wozu, phenomenon) */
function whyQM(){
  const t1 = chTopics('qm')[0];
  if (!t1 || !(t1.wozu || t1.phenomenon)) return null;
  const box = h('div', {class:'box box-wozu whyqm stack', style:'margin-top:14px'});
  box.innerHTML = '<h3>Warum Quantenmechanik?</h3>' + (t1.wozu ? md(t1.wozu) : '')
    + '<p class="small">' + (t1.phenomenon ? 'Zum Auftakt ein Experiment: <a href="#/learn/' + t1.id + '/2">' + escH(t1.phenomenon.title || 'Vorhersage') + '</a> (' + tname(t1) + ', Schritt 2).' : '<a href="#/learn/' + t1.id + '/1">Mit ' + tname(t1) + ' beginnen</a>.') + '</p>';
  return box;
}
function topicList(onPick, label, intro){
  const outer = h('div');
  const draw = () => {
    outer.innerHTML = '';
    outer.append(chapterTabs(draw));
    const ch = curCh();
    outer.append(h('p', {class:'small muted chintro', html:ch === 'math' ? 'Methoden der Physik, so weit die Quantenmechanik sie braucht. Du kannst jedes Thema einzeln bearbeiten; die Eingangschecks der QM-Themen verweisen auf das passende Mathe-Thema.' : 'Standardstoff Quantenmechanik I. Fehlt dir Mathematik, zeigt der Eingangscheck, welches Thema aus <b>Mathematische Grundlagen</b> hilft.'}));
    if (intro && ch === 'qm'){ const w = whyQM(); if (w) outer.append(w); }
    outer.append(topicRows(chTopics(ch), onPick, label));
  };
  draw();
  return outer;
}
function topicRows(list, onPick, label){
  const wrap = h('div', {class:'topic-list'});
  const next = nextTopic();
  for (const t of list){
    const sure = isSure(t), pre = isPrelim(t);
    const row = h('div', {class:'topic' + (sure ? ' sure' : pre ? ' prelim' : '')});
    row.innerHTML = '<span class="num">' + tnum(t) + '</span><div><b>' + escH(t.title) + '</b>' + (t === next ? '<span class="tag">als Nächstes</span>' : '') + (sure ? '<span class="tag good">sicher</span>' : pre ? '<span class="tag pre">vorläufig sicher</span>' : '') + '<div class="small muted">' + escH(t.src || '') + '</div><div class="small muted">' + escH(statusText(t)) + '</div></div>';
    const b = h('button', {class:'btn btn-sm', type:'button'}, label); b.onclick = () => onPick(t);
    row.append(b); wrap.append(row);
  }
  return wrap;
}
function topicView(main, t, step, sub){
  const s = tstate(t);
  const V4 = isV4(t), ST = stepsOf(t), SV = V4 ? STEPVIEW : STEPVIEW_OLD;
  step = Math.min(7, Math.max(1, step || 1));
  s.step = step; store.data.ch = t.ch; store.save();
  main.append(h('button', {class:'back', type:'button', onclick:() => go('learn')}, '← Neues lernen'));
  main.append(h('div', {class:'small muted', html:escH(chName(t.ch)) + ' · ' + tname(t) + (t.src ? ' · ' + escH(t.src) : '') + ' · <a href="#/lex">Begriff nachschlagen</a>'}));
  main.append(h('h1', {style:'margin-top:4px', html:inl(t.title)}));
  const pills = h('div', {class:'steps', role:'tablist'});
  ST.forEach((st, i) => {
    const b = h('button', {type:'button', class:(i + 1 === step ? 'on ' : '') + (s.done[i + 1] ? 'done' : ''), html:'<span class="n">' + (s.done[i + 1] ? '✓' : i + 1) + '</span>' + st[0]});
    b.onclick = () => go('learn/' + t.id + '/' + (i + 1)); pills.append(b);
  });
  main.append(pills);
  const body = h('section', {class:'stack'});
  body.append(h('div', {class:'steph', html:'<span class="n">' + step + '</span><h2>' + ST[step - 1][0] + '</h2>'}));
  main.append(body);
  const nextBtn = (label, cond, note) => {
    const wrap = h('div', {class:'row', style:'margin-top:22px'});
    const b = h('button', {class:'btn btn-primary', type:'button'}, label || (step < 7 ? 'Weiter: ' + ST[step][0] : 'Zur Themenübersicht'));
    const nt = h('span', {class:'small muted'});
    const upd = () => { const ok = !cond || cond() || s.done[step]; b.disabled = !ok; nt.textContent = ok ? '' : (note || 'Beantworte zuerst die Frage(n) oben.'); };
    b.onclick = () => { s.done[step] = true; store.save(); go(step < 7 ? 'learn/' + t.id + '/' + (step + 1) : 'learn'); };
    wrap.append(b, nt); upd();
    wrap.upd = upd;
    return wrap;
  };
  SV[step](body, t, s, nextBtn, sub);
}
/* gemeinsame Bausteine */
function goalBox(t){ return h('div', {class:'box box-goal', html:'<h4>Das kannst du danach</h4><ul class="clean">' + t.goals.map(g => '<li>' + inl(g) + '</li>').join('') + '</ul>'}); }
function clarifyHTML(c){
  c = c || {};
  let s = '';
  if (c.core) s += '<div class="box box-key"><h4>Kernidee</h4>' + md(c.core) + '</div>';
  if (c.keys) s += '<div class="box"><h4>Worauf es ankommt</h4><ul class="clean">' + c.keys.map(k => '<li>' + inl(k) + '</li>').join('') + '</ul></div>';
  if (c.errors) s += '<div class="box box-warn"><h4>Typische Fehler</h4><ul class="clean">' + c.errors.map(k => '<li>' + inl(k) + '</li>').join('') + '</ul></div>';
  return s;
}
/* Zusammenfassung als aufklappbares Seitenfeld (Üben) */
function summaryPanel(t){
  const c = t.clarify || {};
  const wrap = h('div', {class:'sumw'});
  const tab = h('button', {class:'sumtab', type:'button', 'aria-expanded':'false'}, 'Zusammenfassung');
  const pan = h('aside', {class:'sumpanel stack', hidden:true, 'aria-label':'Zusammenfassung'});
  pan.innerHTML = '<div class="row sumhead"><h3>Zusammenfassung</h3><span class="grow"></span><button class="btn btn-sm" type="button" data-close>Schließen</button></div>' + clarifyHTML(c)
    + (c.more || []).map(m => '<details class="box"><summary><b>' + escH(m.title) + '</b></summary><div class="stack" style="margin-top:8px">' + md(m.text) + '</div></details>').join('')
    + (isV4(t) && (t.teach || []).length ? '<p class="small">Ausführlich: <a href="#/learn/' + t.id + '/3">Erklärteil (Schritt 3)</a> · ' + t.teach.map(sg => segLinkHTML(t.id, sg.id, sg.title)).join(' · ') + '</p>' : '');
  const set = on => { pan.hidden = !on; tab.setAttribute('aria-expanded', String(on)); tab.classList.toggle('on', on); };
  tab.onclick = () => set(pan.hidden);
  pan.querySelector('[data-close]').onclick = () => set(false);
  wrap.append(tab, pan);
  return wrap;
}
/* Zeilen eines Musterbeispiels oder einer Herleitung nacheinander, mit Warum-Fragen */
function modelLines(ol, lines, ctx, saved, onAllDone, opt){
  let k = 0;
  const step = () => {
    if (k >= lines.length){ if (onAllDone) onAllDone(); return; }
    const L = lines[k];
    const li = h('li', {html:lineHTML(L.l, ctx) + (L.w ? ' <span class="muted small">' + inl(L.w) + '</span>' : '')});
    ol.append(li);
    const i = k; k++;
    if (L.why){
      li.append(mcBox(L.why, {label:'Warum?', saved:saved[i], onAnswer:(ok, j) => { saved[i] = j; store.save(); if (!ok && opt && opt.onWrong) opt.onWrong(L, j, i); step(); }}));
      if (saved[i] !== undefined) step();
    } else step();
  };
  step();
}
/* Vorhersage: erst ein Satz Begründung (nicht bewertet), dann Auswahl, Rückmeldung je Option, dann Auflösung */
function predictBox(ph, st, onDone, opt){
  opt = opt || {};
  const box = h('div', {class:'stack predict'});
  if (ph.title && !opt.noTitle) box.append(h('h3', {html:inl(ph.title)}));
  if (ph.text) box.append(h('div', {class:'stack', html:md(ph.text)}));
  const lab = h('label', {class:'fld'}, h('span', {}, opt.prompt || 'Was vermutest du – und warum? Schreib einen Satz. Er wird nicht bewertet.'));
  const ta = h('textarea', {rows:2, class:'why-ta', 'aria-label':'Deine Begründung in einem Satz'});
  ta.value = st.why || '';
  lab.append(ta);
  const bGo = h('button', {class:'btn btn-sm', type:'button'}, 'Weiter zur Auswahl');
  const goRow = h('div', {class:'row'}, bGo, h('span', {class:'small muted'}, 'Ein kurzer Satz genügt.'));
  const qa = h('div', {class:'stack'}), rev = h('div');
  box.append(lab, goRow, qa, rev);
  const enough = () => ta.value.trim().length >= 8;
  const updGo = () => { bGo.disabled = !enough(); };
  ta.addEventListener('input', () => { st.why = ta.value; store.save(); updGo(); });
  bGo.onclick = () => { st.open = true; store.save(); showQ(); };
  function showQ(){
    if (qa.children.length) return;
    goRow.hidden = true;
    qa.append(mcBox(ph.q, {label:'Deine Vermutung', saved:st.k, onAnswer:(ok, k) => { st.k = k; store.save(); ta.readOnly = true; showRev(); if (onDone) onDone(); }}));
    if (st.k !== undefined){ ta.readOnly = true; showRev(); }
  }
  function showRev(){
    rev.innerHTML = '';
    const R = (Array.isArray(ph.reveals) && ph.reveals[st.k]) || ph.reveal;
    if (R) rev.append(h('div', {class:'box box-key', html:'<h4>Auflösung</h4>' + md(R) + (st.why ? '<p class="small muted" style="margin-top:8px">Deine Begründung war: „' + escH(st.why) + '“. Passt sie zur Auflösung? Was würdest du jetzt anders sagen?</p>' : '')}));
  }
  updGo();
  if (st.k !== undefined || (st.open && enough())) showQ();
  return box;
}
/* Vergleich zweier Lösungswege */
function compareBox(t, s, heading){
  const c = t.compare; const ctx = ctxOf(c.ctx);
  const box = h('div', {class:'stack cmpbox'});
  if (heading) box.append(h('h2', {style:'margin-top:26px'}, heading));
  box.append(h('div', {class:'stack', html:md(c.text)}));
  const grid = h('div', {class:'cmp'});
  for (const side of [c.A, c.B]){
    const b = h('div', {class:'box'});
    b.innerHTML = '<h4>' + inl(side.name) + '</h4>' + (side.text ? md(side.text) : '') + '<ol class="model">' + side.model.map(m => { const ml = typeof m === 'string' ? {l:m} : m; return '<li>' + lineHTML(ml.l, ctx) + (ml.w ? ' <span class="muted small">' + inl(ml.w) + '</span>' : '') + '</li>'; }).join('') + '</ol>';
    grid.append(b);
  }
  box.append(grid);
  s.cmp = s.cmp || {};
  const qs = c.questions || [];
  qs.forEach((q, i) => box.append(mcBox(q, {label:'Vergleich ' + (i + 1), saved:s.cmp[i], onAnswer:(ok, j) => { s.cmp[i] = j; store.save(); if (box.onAns) box.onAns(); }})));
  box.done = () => qs.every((q, i) => s.cmp[i] !== undefined);
  return box;
}
/* Konzeptaufgabe im Lernweg/Üben; falsch beantwortet → Fehlerheft */
function conceptItem(t, c, saved, onSave){
  return conceptBox(c, {topic:t, saved, onAnswer:(ok, a) => {
    if (onSave) onSave(a);
    if (!ok) store.errAdd({k:'concept', t:t.id, ref:c.id, text:c.q || 'Wer hat recht?', ans:c.opts[a.k] != null ? c.opts[a.k] : '', right:c.opts[c.a], why:c.type === 'mc2' && c.reason && a.k2 !== c.reason.a ? c.reason.opts[c.reason.a] : '', seg:c.seg || null, lex:c.lex || null, msg:c.ex || ''});
  }});
}

/* ===================== Lernweg (neu) ===================== */
const STEPVIEW = {};
/* Rückblick vom letzten Thema (Reflexionsfragen aus dem Abschluss) */
function reflBox(t){
  const R = store.data.refl || {};
  const last = Object.entries(R).filter(([id, r]) => id !== t.id && r && (r.hard || r.next)).sort((a, b) => String(b[1].d || '').localeCompare(String(a[1].d || '')))[0];
  if (!last) return null;
  const pt = topicById(last[0]);
  return h('div', {class:'box box-refl', html:'<h4>Dein Rückblick' + (pt ? ' auf ' + escH(tname(pt) + ': ' + pt.title) : '') + '</h4>' + (last[1].hard ? '<p><b>Was war schwer?</b> ' + escH(last[1].hard) + '</p>' : '') + (last[1].next ? '<p><b>Das wolltest du beim nächsten Thema anders machen:</b> ' + escH(last[1].next) + '</p>' : '') + '<p class="small muted">Denk beim neuen Thema daran.</p>'});
}
/* Mini-Auffrischung zu einer falsch beantworteten Voraussetzungsfrage: Lexikon-Eintrag bzw. ein Erklär-Abschnitt als Dialog */
function refreshBox(q){
  const p = q.prev && topicById(q.prev);
  const sg = p && q.seg && findSeg(p, q.seg);
  const e = q.lex && LEX.find(x => x.id === q.lex);
  if (!sg && !e && !p) return null;
  const box = h('div', {class:'refresh row'});
  box.append(h('span', {class:'small'}, h('b', {}, 'Kurz auffrischen:')));
  if (sg){ const b = h('button', {class:'btn btn-sm', type:'button', html:escH(tname(p)) + ': ' + inl(sg.title)}); b.onclick = () => segDlg(p, sg.id, {fresh:true}); box.append(b); }
  if (e){ const b = h('button', {class:'btn btn-sm', type:'button'}, 'Lexikon: ' + e.title); b.onclick = () => lexDlg(e.id); box.append(b); }
  if (p && !sg) box.append(h('a', {class:'small', href:'#/learn/' + p.id + '/' + (isV4(p) ? 3 : 1)}, 'oder das ganze ' + (p.ch === 'math' ? 'Mathe-Thema ' : '') + tname(p) + ' ansehen'));
  return box;
}
STEPVIEW[1] = (body, t, s, nextBtn) => {
  body.append(goalBox(t));
  if (t.wozu) body.append(h('div', {class:'box box-wozu', html:'<h4>Wozu?</h4>' + md(t.wozu)}));
  if (t.bridge) body.append(h('div', {class:'box box-info', html:'<h4>Brücke: Was aus früheren Themen wiederkommt</h4>' + md(t.bridge)}));
  const rb = reflBox(t); if (rb) body.append(rb);
  if (t.needs) body.append(h('p', {class:'small', html:'<b>Das brauchst du schon:</b> ' + inl(t.needs)}));
  const mref = (t.math || []).map(topicById).filter(Boolean);
  if (mref.length) body.append(h('p', {class:'small', html:'<b>Mathe dazu:</b> ' + mref.map(m => '<a href="#/learn/' + m.id + '/' + (tstate(m).step || 1) + '">' + tname(m) + ' ' + escH(m.title) + '</a>' + (isSure(m) ? ' ✓' : '')).join(' · ')}));
  const D = t.diag || [];
  s.check = s.check || {}; s.diag = s.diag || {};
  const nb = nextBtn(null, () => t.check.every((q, i) => s.check[i] !== undefined) && D.every((q, i) => s.diag[i] !== undefined));
  body.append(h('h3', {}, 'Eingangscheck: Voraussetzungen'));
  body.append(h('p', {class:'small muted'}, t.check.length + ' kurze Fragen zu dem, was du mitbringen solltest. Sie zählen nicht. Bei einer Lücke bekommst du gleich eine kurze Auffrischung. Wenn du etwas nicht weißt, tippe auf „Weiß ich noch nicht“.'));
  t.check.forEach((q, i) => {
    const ref = h('div');
    const show = () => { ref.innerHTML = ''; if (s.check[i] === undefined || s.check[i] === q.a) return; const b = refreshBox(q); if (b) ref.append(b); };
    body.append(mcBox(Object.assign({dk:true}, q), {label:'Voraussetzung ' + (i + 1) + ' von ' + t.check.length, saved:s.check[i], onAnswer:(ok, k) => { s.check[i] = k; store.save(); show(); nb.upd(); }}), ref);
    show();
  });
  const res = h('div');
  if (D.length){
    body.append(h('h3', {}, 'Diagnose: Wie gut kennst du das Thema schon?'));
    body.append(h('p', {class:'small muted'}, 'Zwei Fragen zum Thema selbst. Sie bestimmen, wie viel Anleitung du bekommst. Raten hilft dir nicht – „Weiß ich noch nicht“ ist eine gute Antwort.'));
    D.forEach((q, i) => body.append(mcBox(Object.assign({dk:true}, q), {label:'Diagnose ' + (i + 1) + ' von ' + D.length, saved:s.diag[i], onAnswer:(ok, k) => { s.diag[i] = k; store.save(); showRes(); nb.upd(); }})));
  }
  body.append(res);
  function showRes(){
    res.innerHTML = '';
    if (!D.length || !D.every((q, i) => s.diag[i] !== undefined)) return;
    const right = D.filter((q, i) => s.diag[i] === q.a).length;
    s.entry = right === D.length ? 'adv' : 'guided'; store.save();
    const box = h('div', {class:'box box-key'});
    box.innerHTML = '<h4>Diagnose: ' + right + ' von ' + D.length + '</h4><p>' + (s.entry === 'adv'
      ? 'Du weißt schon, wie man hier anfängt. Geh trotzdem den Lernweg; im Schritt <b>Beispiel</b> kannst du zusätzlich die Knobelaufgabe für Fortgeschrittene wählen. Wenn du das Thema schon gut kennst, kannst du auch direkt üben.'
      : 'Folge dem Lernweg Schritt für Schritt: Vorhersage, Erklären, Beispiel. Die Erklärung baut das Thema von Grund auf auf.') + '</p>';
    if (s.entry === 'adv'){ const b = h('button', {class:'btn btn-sm', type:'button'}, 'Direkt üben (Schritt 6)'); b.onclick = () => { s.done[1] = true; store.save(); go('learn/' + t.id + '/6'); }; box.append(h('div', {class:'row', style:'margin-top:8px'}, b, h('span', {class:'small muted'}, 'Erklären, Beispiel und Labor kannst du später jederzeit öffnen.'))); }
    res.append(box);
  }
  showRes();
  body.append(nb);
  const skip = h('button', {class:'btn btn-ghost btn-sm', type:'button'}, 'Ohne Fragen weiter');
  skip.onclick = () => { s.done[1] = true; store.save(); go('learn/' + t.id + '/2'); };
  body.append(skip);
};
STEPVIEW[2] = (body, t, s, nextBtn) => {
  const ph = t.phenomenon || (t.puzzle ? {title:t.puzzle.title, text:t.puzzle.text, q:t.puzzle.q, reveal:t.puzzle.reveal, reveals:t.puzzle.reveals} : null);
  if (!ph){ body.append(h('p', {class:'muted'}, 'Zu diesem Thema gibt es keine Vorhersage.')); body.append(nextBtn()); return; }
  body.append(h('p', {class:'muted'}, 'Bevor du die Erklärung liest: Was vermutest du? Falsche Vermutungen sind ausdrücklich erlaubt – sie machen die Erklärung danach wirksamer.'));
  s.pred = s.pred || {};
  const nb = nextBtn(null, () => s.pred.k !== undefined, 'Schreib zuerst deine Begründung und wähle eine Antwort.');
  body.append(predictBox(ph, s.pred, () => nb.upd()));
  body.append(nb);
};
STEPVIEW[3] = (body, t, s, nextBtn, sub) => {
  const T = t.teach || [];
  s.cl = s.cl || {};
  if (!T.length){
    /* noch kein Erklärteil: bisherige Klären-Seite */
    body.append(h('div', {class:'stack', html:clarifyHTML(t.clarify)}));
    for (const m of (t.clarify || {}).more || []){ const d = h('details', {class:'box'}); d.innerHTML = '<summary><b>' + escH(m.title) + '</b></summary><div class="stack" style="margin-top:8px">' + md(m.text) + '</div>'; body.append(d); }
    const qs = (t.clarify || {}).checks || [];
    const nb = nextBtn(null, () => qs.every((q, i) => s.cl[i] !== undefined));
    if (qs.length) body.append(h('h3', {}, 'Kurz geprüft'));
    qs.forEach((q, i) => body.append(mcBox(q, {label:'Frage ' + (i + 1), saved:s.cl[i], onAnswer:(ok, j) => { s.cl[i] = j; store.save(); nb.upd(); }})));
    body.append(nb);
    return;
  }
  s.tc = s.tc || {}; const tc = s.tc; tc.seg = tc.seg || {}; tc.q = tc.q || {}; tc.why = tc.why || {};
  const N = T.length;
  const segDone = sg => !!tc.seg[sg.id];
  const reach = () => { let i = 0; while (i < N && segDone(T[i])) i++; return i; };   /* bis hier frei (inkl. Zusammenfassung bei i = N) */
  let cur = sub ? (sub === 'zusammenfassung' ? N : T.findIndex(x => x.id === sub)) : (tc.cur != null ? Math.min(tc.cur, reach()) : 0);
  if (cur < 0) cur = 0;
  body.append(h('p', {class:'small muted'}, 'Lies jeden Abschnitt in Ruhe. Die Fragen am Ende eines Abschnitts helfen beim Behalten; weiter geht es, wenn du sie beantwortet hast.'));
  const nav = h('div', {class:'segnav', role:'tablist', 'aria-label':'Abschnitte'});
  const area = h('div', {class:'stack segarea'});
  body.append(nav, area);
  const drawNav = () => {
    nav.innerHTML = '';
    const R = reach();
    T.concat([{id:'zusammenfassung', title:'Zusammenfassung'}]).forEach((sg, i) => {
      const done = i < N ? segDone(sg) : !!s.done[3];
      const b = h('button', {type:'button', role:'tab', class:(i === cur ? 'on ' : '') + (done ? 'done' : ''), 'aria-selected':String(i === cur), title:plainT(sg.title), disabled:i > Math.max(R, cur) ? true : null, html:'<span class="n">' + (done ? '✓' : i < N ? i + 1 : 'Σ') + '</span><span class="tl">' + inl(sg.title) + '</span>'});
      b.onclick = () => { cur = i; tc.cur = i; store.save(); draw(true); };
      nav.append(b);
    });
  };
  const draw = scroll => {
    area.innerHTML = ''; drawNav();
    if (cur < N) segView(area, t, T[cur], cur);
    else summaryView(area);
    if (scroll) nav.scrollIntoView({block:'start', behavior:'smooth'});
  };
  function segView(area, t, sg, i){
    area.append(h('div', {class:'seghead small muted'}, 'Abschnitt ' + (i + 1) + ' von ' + N));
    area.append(h('h3', {class:'segtitle', html:inl(sg.title)}));
    const grid = h('div', {class:'segbody' + (sg.fig ? ' withfig' : '')});
    grid.append(h('div', {class:'stack segtext', html:md(sg.text)}));
    if (sg.fig){
      const fig = h('figure', {class:'segfig'}); const lab = h('div'); fig.append(lab);
      labRun(lab, sg.fig.lab, sg.fig, {display:true, init:sg.fig.init, keep:sg.fig.keep});
      if (sg.fig.caption) fig.append(h('figcaption', {class:'small muted', html:inl(sg.fig.caption)}));
      grid.append(fig);
    }
    area.append(grid);
    const qwrap = h('div', {class:'stack segq'});
    const foot = h('div', {class:'row', style:'margin-top:18px'});
    const qs = sg.q || [];
    tc.q[sg.id] = tc.q[sg.id] || {};
    const qDone = () => qs.every((q, j) => tc.q[sg.id][j] !== undefined);
    const bNext = h('button', {class:'btn btn-primary', type:'button'}, i + 1 < N ? 'Weiter: Abschnitt ' + (i + 2) : 'Weiter: Zusammenfassung');
    const nt = h('span', {class:'small muted'});
    bNext.onclick = () => { tc.seg[sg.id] = true; cur = i + 1; tc.cur = cur; store.save(); draw(true); };
    foot.append(bNext, nt);
    let drvDone = !(sg.derive && sg.derive.lines && sg.derive.lines.length);
    const upd = () => { const ok = drvDone && qDone(); bNext.disabled = !ok; nt.textContent = ok ? '' : drvDone ? 'Beantworte zuerst die Frage(n) zum Abschnitt.' : 'Geh zuerst die Herleitung durch.'; if (ok && !tc.seg[sg.id]){ tc.seg[sg.id] = true; store.save(); drawNav(); } };
    const showQs = () => {
      if (qwrap.dataset.on) return; qwrap.dataset.on = '1';
      if (qs.length) qwrap.append(h('h4', {}, 'Kurz geprüft'));
      qs.forEach((q, j) => qwrap.append(mcBox(q, {label:'Frage ' + (j + 1) + ' zum Abschnitt', saved:tc.q[sg.id][j], onAnswer:(ok, k) => {
        tc.q[sg.id][j] = k; store.save();
        if (!ok) store.errAdd({k:'seg', t:t.id, ref:sg.id, pos:'q' + j, text:q.q, ans:q.opts[k] != null ? q.opts[k] : '', right:q.opts[q.a], seg:sg.id, msg:q.ex || ''});
        upd();
      }})));
      upd();
    };
    if (!drvDone){
      area.append(h('h4', {class:'drvh', html:sg.derive.title ? inl(sg.derive.title) : 'Herleitung Schritt für Schritt'}));
      if (sg.derive.text) area.append(h('div', {class:'stack', html:md(sg.derive.text)}));
      const ol = h('ol', {class:'model stack'}); area.append(ol);
      tc.why[sg.id] = tc.why[sg.id] || {};
      area.append(qwrap, foot);
      modelLines(ol, sg.derive.lines, ctxOf(sg.derive.ctx), tc.why[sg.id], () => { drvDone = true; showQs(); }, {onWrong:(L, j) => store.errAdd({k:'seg', t:t.id, ref:sg.id, pos:'w' + sg.derive.lines.indexOf(L), text:L.why.q, ans:L.why.opts[j] != null ? L.why.opts[j] : '', right:L.why.opts[L.why.a], seg:sg.id, msg:L.why.ex || ''})});
    } else area.append(qwrap, foot);
    if (drvDone) showQs(); else upd();
  }
  function summaryView(area){
    area.append(h('h3', {class:'segtitle'}, 'Zusammenfassung'));
    area.append(h('div', {class:'stack', html:clarifyHTML(t.clarify)}));
    for (const m of (t.clarify || {}).more || []){ const d = h('details', {class:'box'}); d.innerHTML = '<summary><b>' + escH(m.title) + '</b></summary><div class="stack" style="margin-top:8px">' + md(m.text) + '</div>'; area.append(d); }
    const qs = (t.clarify || {}).checks || [];
    const missing = T.filter(x => !segDone(x));
    const nb = nextBtn(null, () => !missing.length && qs.every((q, i) => s.cl[i] !== undefined), missing.length ? 'Bearbeite zuerst alle Abschnitte (' + missing.map(x => T.indexOf(x) + 1).join(', ') + ').' : 'Beantworte zuerst die Frage(n) oben.');
    if (qs.length) area.append(h('h3', {}, 'Kurz geprüft'));
    qs.forEach((q, i) => area.append(mcBox(q, {label:'Frage ' + (i + 1), saved:s.cl[i], onAnswer:(ok, j) => { s.cl[i] = j; store.save(); nb.upd(); }})));
    area.append(nb);
  }
  draw(false);
};
STEPVIEW[4] = (body, t, s, nextBtn) => {
  const area = h('div', {class:'stack'});
  body.append(area);
  const nb = nextBtn(null, () => s.exDone, 'Geh zuerst das Beispiel durch und löse die Lückenaufgabe.');
  exampleView(area, t, s, () => { if (!s.exDone){ s.exDone = true; store.save(); } nb.upd(); }, {v4:true});
  /* Knobelaufgabe: Zusatz für Fortgeschrittene, nur nach guter Diagnose (war sie schon die Vorhersage, entfällt sie) */
  if (t.puzzle && t.phenomenon){
    if (s.entry === 'adv'){
      const d = h('details', {class:'box adv'});
      d.innerHTML = '<summary><b>Für Fortgeschrittene: Knobelaufgabe „' + escH(t.puzzle.title) + '“</b> <span class="small muted">(freiwillig)</span></summary>';
      const inner = h('div', {class:'stack', style:'margin-top:10px'}); d.append(inner);
      const fill = () => { if (!inner.children.length) puzzleView(inner, t, s, () => {}, {v4:true}); };
      d.addEventListener('toggle', () => { if (d.open) fill(); });
      if (s.puz2 && s.puz2.k !== undefined){ d.open = true; fill(); }
      body.append(d);
    } else if (s.entry === 'guided') body.append(h('p', {class:'small muted'}, 'Wenn du in Schritt 1 die Diagnose sicher löst, gibt es hier zusätzlich eine Knobelaufgabe für Fortgeschrittene.'));
  }
  body.append(nb);
};
STEPVIEW[5] = (body, t, s, nextBtn) => {
  const L = t.lab;
  body.append(h('h3', {}, 'Labor: ' + L.title));
  s.lab = s.lab || {};
  const qs = L.questions || [];
  const nb = nextBtn(null, () => (!L.predict || s.lab.pr !== undefined) && qs.every((q, i) => s.lab[i] !== undefined) && (!L.noPic || s.lab.np !== undefined));
  let pred = null;
  if (L.predict){
    body.append(h('p', {class:'muted small'}, 'Erst vorhersagen, dann beobachten, dann erklären. Was erwartest du, bevor du die Regler bewegst?'));
    pred = mcBox(L.predict, {hold:true, label:'Vorhersage', saved:s.lab.pr, onAnswer:(ok, k) => { s.lab.pr = k; store.save(); showLab(); nb.upd(); }});
    body.append(pred);
  }
  const labWrap = h('div', {class:'stack'});
  body.append(labWrap);
  function showLab(){
    if (labWrap.children.length) return;
    labWrap.append(h('div', {class:'stack', html:md(L.text)}));
    const lab = h('div'); labWrap.append(lab);
    labRun(lab, L.type, L, {});
    const bR = h('button', {class:'btn btn-sm', type:'button'}, 'Mit dem Labor verglichen? Vorhersage auflösen');
    const rv = () => { if (!pred) return; pred.reveal(s.lab.pr); s.lab.prShown = true; store.save(); bR.remove(); };
    if (pred){ bR.onclick = rv; labWrap.append(bR); if (s.lab.prShown) rv(); }
    qs.forEach((q, i) => labWrap.append(mcBox(q, {label:'Mit Bild ' + (i + 1), saved:s.lab[i], onAnswer:(ok, j) => { s.lab[i] = j; store.save(); nb.upd(); showNp(); }})));
    const np = h('div', {class:'stack'}); labWrap.append(np);
    function showNp(){
      if (!L.noPic || np.children.length || !qs.every((q, i) => s.lab[i] !== undefined)) return;
      if (pred && !s.lab.prShown) rv();
      np.append(h('h3', {}, 'Jetzt ohne Bild'));
      np.append(mcBox(L.noPic, {label:'Ohne Bild', saved:s.lab.np, onAnswer:(ok, j) => { s.lab.np = j; store.save(); nb.upd(); }}));
    }
    showNp();
  }
  if (!L.predict || s.lab.pr !== undefined) showLab();
  body.append(nb);
};
STEPVIEW[6] = (body, t, s, nextBtn) => {
  body.append(summaryPanel(t));
  body.append(h('p', {class:'muted', html:'Rechne Zeile für Zeile. Mit <b>Enter</b> wird die Zeile geprüft und eine neue angelegt. ✓ richtig, ↪ folgerichtig (Fehler weiter oben), ✗ falsch, i nicht bewertbar. Hinweise kommen in Stufen; die Lösung gibt es nach einem eigenen Versuch. Die <b>Zusammenfassung</b> klappst du rechts auf.'}));
  const P = t.practice || [], Cc = t.concept || [];
  s.cc = s.cc || {};
  let ci = 0;
  const cItem = c => conceptItem(t, c, s.cc[c.id], a => { s.cc[c.id] = a; store.save(); });
  P.forEach((task, i) => {
    body.append(taskBox(task, {}));
    if (i === 1 && t.compare) body.append(compareBox(t, s, 'Zwei Wege vergleichen'));
    if (ci < Cc.length) body.append(cItem(Cc[ci++]));
  });
  if (P.length < 2 && t.compare) body.append(compareBox(t, s, 'Zwei Wege vergleichen'));
  while (ci < Cc.length) body.append(cItem(Cc[ci++]));
  if (t.errors && t.errors.length){ body.append(h('h2', {style:'margin-top:26px'}, 'Fehler finden')); for (const e of t.errors) body.append(errorBox(t, e)); }
  body.append(nextBtn());
};
STEPVIEW[7] = (body, t, s, nextBtn) => finalView(body, t, s, nextBtn);

/* ---------- Abschluss unter Prüfungsbedingungen ---------- */
const finItems = (t, form) => form === 'B' && Array.isArray(t.finalB) && t.finalB.length ? t.finalB : t.final;
const finKind = it => it.task ? 'task' : (it.aim === 'k' || it.type) ? 'concept' : 'mc';
const finSlot = fa => '#fin' + fa.form + (fa.id || fa.n);
function finAnswered(it, a, slot){
  const k = finKind(it);
  if (k === 'task') return it.task.goals.some(g => (store.goal(it.task.id + slot, g.id).lines || []).some(l => l.m && String(l.m).trim()));
  if (!a) return false;
  return a.k !== undefined && a.k !== null && (k !== 'concept' || it.type !== 'mc2' || (a.k2 !== undefined && a.k2 !== null));
}
function finalView(body, t, s, nextBtn){
  if (s.final && s.final.legacy && !s.final.v4) body.append(h('div', {class:'box box-info', html:'<b>Früherer Abschluss (alte Form):</b> ' + s.final.score + ' von 4' + (s.final.sure ? ', sicher' : '') + ' am ' + fmtD(s.final.date) + '. Das Ergebnis bleibt gültig. Den neuen Abschluss kannst du trotzdem machen.'}));
  let fa = s.fa;
  if (!fa){ fa = s.fa = {n:(s.finHist || []).length + 1, form:'A', id:Date.now().toString(36), ans:{}, conf:{}}; store.save(); }
  fa.ans = fa.ans || {}; fa.conf = fa.conf || {};
  const F = finItems(t, fa.form), slot = finSlot(fa);
  body.append(h('p', {class:'small muted'}, 'Form ' + fa.form + (fa.n > 1 ? ' · Versuch ' + fa.n : '') + ' · ' + F.length + ' Aufgaben'));
  if (!fa.done) body.append(h('div', {class:'box box-warn', html:'<h4>Prüfungsbedingungen</h4><ul class="clean"><li>Keine Rückmeldung je Zeile, keine Hinweise, keine Lösung vor dem Abgeben.</li><li>Du gibst <b>einmal</b> für den ganzen Abschluss ab. Bis dahin kannst du alles ändern.</li><li>Gib bei jeder Aufgabe an, wie sicher du bist. Das hilft dir, dich selbst besser einzuschätzen.</li><li><b>Vorläufig sicher</b> ab 80 % der Punkte, wenn jedes Lernziel gelöst ist. <b>Sicher</b> nach bestandener Wiederholung frühestens zwei Tage später.</li></ul>'}));
  const bar = h('div', {class:'row submitbar'});
  const bSub = h('button', {class:'btn btn-primary', type:'button'}, 'Abgeben');
  const note = h('span', {class:'small muted'});
  const upd = () => {
    if (fa.done) return;
    const noConf = F.filter((_, i) => fa.conf[i] === undefined).length;
    const open = F.filter((it, i) => !finAnswered(it, fa.ans[i], slot)).length;
    bSub.disabled = noConf > 0;
    note.textContent = noConf ? 'Noch ' + noConf + ' Aufgabe' + (noConf === 1 ? '' : 'n') + ' ohne Sicherheitsurteil.' : open ? open + ' Aufgabe' + (open === 1 ? ' ist' : 'n sind') + ' noch nicht beantwortet. Abgeben geht trotzdem.' : 'Alles beantwortet. Nach dem Abgeben kannst du nichts mehr ändern.';
  };
  F.forEach((it, i) => {
    const kind = finKind(it);
    const w = h('div', {class:'fitem stack'});
    const aimTxt = it.aim === 'k' ? 'Konzeptfrage' : typeof it.aim === 'number' && t.goals[it.aim] ? 'Lernziel ' + (it.aim + 1) : '';
    w.append(h('div', {class:'fhead'}, 'Aufgabe ' + (i + 1) + ' von ' + F.length + (aimTxt ? ' · ' + aimTxt : '')));
    if (!fa.done){
      if (kind === 'task'){ const tb = taskBox(it.task, {exam:true, slot}); ['input', 'focusout', 'pointerup'].forEach(ev => tb.addEventListener(ev, () => setTimeout(upd, 150))); w.append(tb); }
      else if (kind === 'concept') w.append(conceptBox(it, {exam:true, topic:t, saved:fa.ans[i], onSelect:a => { fa.ans[i] = a; store.save(); upd(); }}));
      else w.append(mcBox(it, {exam:true, saved:fa.ans[i] ? fa.ans[i].k : undefined, onSelect:k => { fa.ans[i] = {k}; store.save(); upd(); }}));
      w.append(confBox(fa.conf[i], c => { fa.conf[i] = c; store.save(); upd(); }));
    } else {
      const r = (fa.res && fa.res.items[i]) || {};
      if (kind === 'task') w.append(taskBox(it.task, {locked:true, solution:true, slot}));
      else if (kind === 'concept'){ const cb = conceptBox(it, {exam:true, topic:t, saved:fa.ans[i]}); cb.reveal(); w.append(cb); }
      else { const mb = mcBox(it, {exam:true, saved:fa.ans[i] ? fa.ans[i].k : undefined}); mb.reveal(fa.ans[i] ? fa.ans[i].k : null); w.append(mb); }
      w.append(h('p', {class:'small fres ' + (r.ok ? 'good' : 'bad'), html:(r.ok ? '✓ gelöst' : '✗ nicht gelöst') + ' · ' + (r.pts || 0) + ' von ' + (r.max || 0) + ' Punkten' + (r.conf != null ? ' · dein Urteil: <b>' + escH(CONF_LEVELS[r.conf]) + '</b>' + (r.conf >= 2 && !r.ok ? ' – hier hast du dich überschätzt.' : r.conf <= 1 && r.ok ? ' – du kannst mehr, als du dachtest.' : '') : '')}));
    }
    body.append(w);
  });
  if (!fa.done){
    bSub.onclick = () => {
      if (bSub.disabled) return;
      const open = F.filter((it, i) => !finAnswered(it, fa.ans[i], slot)).length;
      if (open && !bSub.dataset.sure){ bSub.dataset.sure = '1'; bSub.textContent = 'Wirklich abgeben? Noch einmal tippen'; setTimeout(() => { if (bSub.isConnected){ delete bSub.dataset.sure; bSub.textContent = 'Abgeben'; } }, 5000); return; }
      submitFinal(t, s);
      go('learn/' + t.id + '/7');
    };
    bar.append(bSub, note); body.append(bar); upd();
    body.append(backBtn());
    return;
  }
  /* Auswertung */
  const head = body.querySelector('.steph');
  if (head) head.after(finalSummary(t, s)); else body.prepend(finalSummary(t, s));
  body.append(reflForm(t, s));
  body.append(backBtn());
  function backBtn(){ const b = h('button', {class:'btn', type:'button', style:'margin-top:22px'}, 'Zur Themenübersicht'); b.onclick = () => go('learn'); return b; }
}
function submitFinal(t, s){
  if (typeof INKUI !== 'undefined') INKUI.flushAll();
  const fa = s.fa, F = finItems(t, fa.form), slot = finSlot(fa);
  let got = 0, max = 0; const items = [];
  F.forEach((it, i) => {
    const kind = finKind(it); let r;
    if (kind === 'task'){
      let p = 0, P = 0, ok = true;
      for (const g of it.task.goals){ const st = store.goal(it.task.id + slot, g.id); const sc = scoreGoal(it.task, g, (st.lines || []).map(l => l.m)); p += sc.p; P += sc.P; if (!sc.solved) ok = false; st.state = sc.state; st.lastPoints = sc.p; }
      r = {ok, pts:p, max:P};
    } else if (kind === 'concept') r = conceptScore(it, fa.ans[i]);
    else { const k = fa.ans[i] ? fa.ans[i].k : undefined; r = {ok:k === it.a, pts:k === it.a ? 2 : 0, max:2}; }
    r.conf = fa.conf[i]; r.aim = it.aim;
    got += r.pts; max += r.max; items.push(r);
    store.calibAdd(r.conf, r.ok, t.id, 'final');
    if (!r.ok) store.errAdd({k:'final', t:t.id, ref:'final' + fa.form + ':' + i, text:kind === 'task' ? it.task.title : (it.q || 'Wer hat recht?'), msg:kind === 'task' ? 'Abschluss, Form ' + fa.form + ': Rechenaufgabe nicht gelöst.' : (it.ex || ''), right:kind === 'task' ? '' : (it.opts || [])[it.a], seg:it.seg || null, lex:it.lex || null});
  });
  const pct = max ? got / max : 0;
  const aims = [0, 1, 2].filter(a => F.some(it => it.aim === a));
  const aimOk = {}; aims.forEach(a => { aimOk[a] = F.every((it, i) => it.aim !== a || items[i].ok); });
  const pass = pct >= 0.8 - 1e-9 && aims.every(a => aimOk[a]);
  fa.done = true; fa.res = {got, max, pct, items, aimOk, pass, date:today()};
  const legacySure = !!(s.final && s.final.legacy && s.final.sure);
  s.finHist = (s.finHist || []).concat([{form:fa.form, n:fa.n, got, max, pass, date:today()}]);
  s.final = {v4:true, form:fa.form, n:fa.n, got, max, pct, pass, prelim:pass, sure:legacySure, legacy:legacySure || undefined, date:today(), aimOk};
  if (pass) s.done[7] = true;
  const rv = store.data.review[t.id] || {box:0};
  if (pass){ rv.box = Math.max(rv.box || 0, 1); rv.due = addDays(today(), 2); rv.prelim = today(); }
  else { rv.box = 0; rv.due = addDays(today(), 1); }
  rv.weak = items.map((r, i) => r.ok ? null : i).filter(x => x !== null);
  store.data.review[t.id] = rv;
  store.save();
}
function finalSummary(t, s){
  const fa = s.fa, R = fa.res, F = finItems(t, fa.form);
  const box = h('div', {class:'box ' + (R.pass ? 'box-goal' : 'box-warn') + ' stack finsum'});
  const pc = Math.round(100 * R.pct);
  let html = '<h3>' + (R.pass ? 'Vorläufig sicher' : 'Noch nicht bestanden') + ': ' + R.got + ' von ' + R.max + ' Punkten (' + pc + ' %)</h3>';
  const aims = Object.keys(R.aimOk || {}).map(Number);
  if (aims.length) html += '<ul class="clean">' + aims.map(a => '<li>' + (R.aimOk[a] ? '✓ ' : '✗ ') + inl(t.goals[a] || 'Lernziel ' + (a + 1)) + '</li>').join('') + '</ul>';
  if (R.pass) html += '<p>Gut gemacht. <b>Sicher</b> wird das Thema mit einer bestandenen Wiederholung ab dem <b>' + fmtD(addDays(R.date, 2)) + '</b> (unter „Wiederholen“). Bis dahin hilft es, kurz etwas anderes zu lernen.</p>';
  else {
    html += '<p>Nötig sind 80 % der Punkte und jedes Lernziel. ' + (pc < 80 ? 'Es fehlen ' + (80 - pc) + ' Prozentpunkte. ' : '') + 'Das wiederholst du am besten:</p><ul class="clean">';
    aims.filter(a => !R.aimOk[a]).forEach(a => { html += '<li>' + inl(t.goals[a] || '') + ' – <a href="#/learn/' + t.id + '/6">Übungen (Schritt 6)</a>' + ((t.teach || []).length ? ', <a href="#/learn/' + t.id + '/3">Erklärteil (Schritt 3)</a>' : '') + '</li>'; });
    F.forEach((it, i) => { if (finKind(it) === 'concept' && !R.items[i].ok) html += '<li>Konzeptfrage ' + (i + 1) + (it.seg ? ': ' + segLinkHTML(t.id, it.seg) : it.lex ? ': ' + refLinkHTML(it.lex) : ' – <a href="#/learn/' + t.id + '/6">Konzeptfragen in Schritt 6</a>') + '</li>'; });
    html += '</ul><p class="small muted">Die falschen Aufgaben stehen auch im <a href="#/review/heft">Fehlerheft</a>.</p>';
  }
  box.innerHTML = html;
  if (!R.pass){
    const nextForm = fa.form === 'A' && Array.isArray(t.finalB) && t.finalB.length ? 'B' : fa.form === 'B' ? 'A' : 'A';
    const b = h('button', {class:'btn btn-primary btn-sm', type:'button'}, 'Neuer Versuch mit Form ' + nextForm);
    b.onclick = () => { s.fa = {n:fa.n + 1, form:nextForm, id:Date.now().toString(36), ans:{}, conf:{}}; store.save(); go('learn/' + t.id + '/7'); };
    box.append(h('div', {class:'row'}, b, h('span', {class:'small muted'}, nextForm !== fa.form ? 'Form ' + nextForm + ' prüft dieselben Lernziele mit anderen Aufgaben. Übe vorher gezielt.' : 'Übe vorher gezielt; dann löst du dieselbe Form noch einmal.')));
  }
  return box;
}
/* zwei Reflexionsfragen; sie erscheinen beim nächsten Thema in Schritt 1 */
function reflForm(t, s){
  const R = store.data.refl[t.id] || {};
  const box = h('div', {class:'box box-refl stack'});
  box.append(h('h4', {}, 'Rückblick'));
  box.append(h('p', {class:'small muted'}, 'Zwei kurze Fragen. Deine Antworten siehst du beim nächsten Thema wieder.'));
  const mk = (key, label) => { const ta = h('textarea', {rows:2, class:'why-ta', 'aria-label':label}); ta.value = R[key] || ''; ta.addEventListener('input', () => { const r = store.data.refl[t.id] || (store.data.refl[t.id] = {}); r[key] = ta.value; r.d = new Date().toISOString(); store.save(); }); return h('label', {class:'fld'}, h('span', {}, label), ta); };
  box.append(mk('hard', 'Was war bei diesem Thema schwer?'), mk('next', 'Was machst du beim nächsten Thema anders?'));
  return box;
}

/* Beispiel mit Warum-Fragen, danach Lückenaufgabe. opt.v4: Überspringen der Lückenaufgabe nur, wenn alle Warum-Fragen richtig waren */
function exampleView(area, t, s, done, opt){
  opt = opt || {};
  const ex = t.example; const ctx = ctxOf(ex.ctx);
  area.append(h('h3', {html:'Beispiel: ' + inl(ex.title)}));
  area.append(h('div', {class:'stack', html:md(ex.text)}));
  const ol = h('ol', {class:'model stack'});
  area.append(ol);
  s.ex = s.ex || {};
  modelLines(ol, ex.lines, ctx, s.ex, faded, opt.v4 ? {onWrong:(L, j, i) => store.errAdd({k:'seg', t:t.id, ref:'beispiel', pos:i, text:L.why.q, ans:L.why.opts[j] != null ? L.why.opts[j] : '', right:L.why.opts[L.why.a], msg:L.why.ex || ''})} : null);
  function faded(){
    if (area.querySelector('.faded')) return;
    if (!ex.faded){ done(); return; }
    const allRight = ex.lines.every((L, i) => !L.why || s.ex[i] === L.why.a);
    const f = h('div', {class:'faded stack'});
    f.append(h('h3', {style:'margin-top:16px'}, 'Jetzt du: ähnliche Aufgabe mit Lücken'));
    f.append(h('p', {class:'small muted'}, 'Die ersten Zeilen stehen schon da. Ergänze die fehlenden Schritte und prüfe.'));
    const tb = taskBox(ex.faded, {prefill:ex.faded.given, onResult:(task, g, r) => { if (r.state === 'solved' || r.state === 'solvedWithErrors') done(); }});
    f.append(tb);
    if (!opt.v4 || allRight){
      const skip = h('button', {class:'btn btn-ghost btn-sm', type:'button'}, opt.v4 ? 'Überspringen (alle Warum-Fragen richtig)' : 'Überspringen');
      skip.onclick = () => done();
      f.append(skip);
    } else f.append(h('p', {class:'small muted'}, 'Nicht alle Warum-Fragen waren richtig. Darum lohnt sich die Lückenaufgabe: Erst wenn sie gelöst ist, geht es weiter.'));
    area.append(f);
  }
}
/* Knobelaufgabe. opt.v4: Zusatz für Fortgeschrittene, vor der Auflösung ein Satz Begründung */
function puzzleView(area, t, s, done, opt){
  const p = t.puzzle;
  if (opt && opt.v4){
    s.puz2 = s.puz2 || {};
    area.append(predictBox({title:p.title, text:p.text, q:p.q, reveal:p.reveal, reveals:p.reveals}, s.puz2, done, {noTitle:true, prompt:'Wie gehst du vor, und was erwartest du? Schreib einen Satz Begründung, bevor du wählst. Er wird nicht bewertet.'}));
    return;
  }
  area.append(h('h3', {}, 'Knobelaufgabe: ' + p.title));
  area.append(h('div', {class:'stack', html:md(p.text)}));
  const rev = h('div', {class:'box box-key', hidden:true, html:'<h4>Auflösung</h4>' + md(p.reveal)});
  const q = mcBox(p.q, {label:'Deine Vermutung', saved:s.puz, onAnswer:(ok, j) => { s.puz = j; store.save(); rev.hidden = false; done(); }});
  area.append(q, rev);
  if (s.puz !== undefined){ rev.hidden = false; }
  area.append(h('p', {class:'small muted'}, 'Erst überlegen, dann antworten: Falsche Vermutungen sind hier ausdrücklich erlaubt – sie machen die Erklärung danach wirksamer.'));
}

/* ===================== Lernweg (bisheriger Ablauf, Rückfall für Themen ohne neue Felder) ===================== */
const STEPVIEW_OLD = {};
STEPVIEW_OLD[1] = (body, t, s, nextBtn) => {
  body.append(goalBox(t));
  if (t.wozu) body.append(h('div', {class:'box box-wozu', html:'<h4>Wozu?</h4>' + md(t.wozu)}));
  if (t.bridge) body.append(h('div', {class:'box box-info', html:'<h4>Brücke: Was aus früheren Themen wiederkommt</h4>' + md(t.bridge)}));
  if (t.needs) body.append(h('p', {class:'small', html:'<b>Das brauchst du schon:</b> ' + inl(t.needs)}));
  const mref = (t.math || []).map(topicById).filter(Boolean);
  if (mref.length) body.append(h('p', {class:'small', html:'<b>Mathe dazu:</b> ' + mref.map(m => '<a href="#/learn/' + m.id + '/' + (tstate(m).step || 1) + '">' + tname(m) + ' ' + escH(m.title) + '</a>' + (isSure(m) ? ' ✓' : '')).join(' · ')}));
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
        if (q.prev){ const p = topicById(q.prev); if (p){ const sg = q.seg && findSeg(p, q.seg); const b = h('button', {class:'btn btn-sm', type:'button'}, sg ? 'Kurz auffrischen: ' + sg.title : 'Zu ' + tname(p) + ': ' + p.title); b.onclick = () => sg ? segDlg(p, sg.id, {fresh:true}) : go('learn/' + p.id + '/1'); ul.append(h('li', {}, b)); } }
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
STEPVIEW_OLD[2] = (body, t, s, nextBtn) => {
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
STEPVIEW_OLD[3] = (body, t, s, nextBtn) => {
  const c = t.clarify;
  body.append(h('div', {class:'stack', html:clarifyHTML(c)}));
  for (const m of c.more || []){ const d = h('details', {class:'box'}); d.innerHTML = '<summary><b>' + escH(m.title) + '</b></summary><div class="stack" style="margin-top:8px">' + md(m.text) + '</div>'; body.append(d); }
  s.cl = s.cl || {};
  const qs = c.checks || [];
  const nb = nextBtn(null, () => qs.every((q, i) => s.cl[i] !== undefined));
  if (qs.length) body.append(h('h3', {}, 'Kurz geprüft'));
  qs.forEach((q, i) => body.append(mcBox(q, {label:'Frage ' + (i + 1), saved:s.cl[i], onAnswer:(ok, j) => { s.cl[i] = j; store.save(); nb.upd(); }})));
  body.append(nb);
};
STEPVIEW_OLD[4] = (body, t, s, nextBtn) => {
  const L = t.lab;
  body.append(h('h3', {}, 'Labor: ' + L.title));
  body.append(h('div', {class:'stack', html:md(L.text)}));
  const lab = h('div');
  body.append(lab);
  labRun(lab, L.type, L, {});
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
STEPVIEW_OLD[5] = (body, t, s, nextBtn) => {
  const cb = compareBox(t, s);
  body.append(cb);
  const nb = nextBtn(null, () => cb.done());
  cb.onAns = () => nb.upd();
  body.append(nb);
};
STEPVIEW_OLD[6] = (body, t, s, nextBtn) => {
  body.append(summaryPanel(t));
  body.append(h('p', {class:'muted', html:'Rechne Zeile für Zeile. Mit <b>Enter</b> wird die Zeile geprüft und eine neue angelegt. ✓ richtig, ↪ folgerichtig (Fehler weiter oben), ✗ falsch, i nicht bewertbar. Hinweise sind gestuft; die Lösung gibt es nach einem eigenen Versuch.'}));
  for (const task of t.practice) body.append(taskBox(task, {}));
  body.append(nextBtn());
};
STEPVIEW_OLD[7] = (body, t, s, nextBtn) => {
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
      const s = tstate(t);
      main.append(h('button', {class:'back', type:'button', onclick:() => go('practice')}, '← Üben'));
      main.append(h('h1', {}, 'Üben: ' + t.title));
      main.append(summaryPanel(t));
      main.append(h('p', {class:'muted small', html:'Alle Übungsaufgaben des Themas. Die <b>Zusammenfassung</b> klappst du rechts auf' + ((t.teach || []).length ? '; den ganzen Erklärteil findest du im <a href="#/learn/' + t.id + '/3">Lernweg, Schritt 3</a>.' : '; mehr steht im Lernweg unter „Klären“.')}));
      for (const task of t.practice) main.append(taskBox(task, {}));
      if (t.concept && t.concept.length){
        s.cc = s.cc || {};
        main.append(h('h2', {style:'margin-top:26px'}, 'Konzeptfragen'));
        for (const c of t.concept){ const el = conceptItem(t, c, s.cc[c.id], a => { s.cc[c.id] = a; store.save(); }); el.dataset.task = 'c:' + c.id; main.append(el); }
      }
      if (t.errors && t.errors.length){ main.append(h('h2', {style:'margin-top:26px'}, 'Fehler finden')); for (const e of t.errors) main.append(errorBox(t, e)); }
      if (args[1]) setTimeout(() => { const el = $$('[data-task]', main).find(x => x.dataset.task === args[1]); if (el){ el.scrollIntoView({block:'start'}); el.classList.add('flash'); } }, 80);
      return;
    }
  }
  main.append(h('h1', {}, 'Üben'));
  main.append(h('p', {class:'muted'}, 'Wähle ein Thema – oder eine gemischte Runde mit Aufgaben aus Themen, die du schon begonnen hast.'));
  const mix = h('button', {class:'btn btn-primary', type:'button', style:'margin-top:12px'}, 'Gemischte Runde');
  mix.onclick = () => go('mixed');
  main.append(h('div', {class:'row'}, mix, h('span', {class:'small muted'}, 'Drei Rechenaufgaben und zwei Konzeptfragen, bevorzugt aus deinen schwachen Themen.')));
  main.append(topicList(t => go('practice/' + t.id), 'Aufgaben'));
};
/* Gewicht eines Themas für die gemischte Runde: schwache Themen häufiger */
function weakness(t){
  const s = tstate(t), f = s.final, rv = store.data.review[t.id];
  let w = 1;
  if (!isSure(t)) w += 1;
  if (f && ((f.v4 && !f.pass) || (!f.v4 && !f.sure))) w += 2;
  if (rv && (rv.box || 0) <= 1) w += 1;
  w += Math.min(3, store.data.errbook.filter(e => e.t === t.id && !e.done && !e.solved).length);
  return w;
}
function pickWeighted(arr, n){
  const a = arr.slice(), out = [];
  while (out.length < n && a.length){
    const S = a.reduce((x, y) => x + y.w, 0); let u = Math.random() * S, j = 0;
    for (; j < a.length - 1; j++){ u -= a[j].w; if (u <= 0) break; }
    out.push(a.splice(j, 1)[0]);
  }
  return out;
}
function newMix(){
  const started = TOPICS.filter(t => { const s = tstate(t); return s.step > 1 || s.final; });
  const base = started.length ? started : chTopics(curCh()).slice(0, 3);
  const T = base.flatMap(t => t.practice.map(k => ({t:t.id, k:'task', id:k.id, w:weakness(t) / Math.max(1, t.practice.length)})));
  const Cc = base.flatMap(t => (t.concept || []).map(c => ({t:t.id, k:'concept', id:c.id, w:weakness(t) / t.concept.length})));
  const a = pickWeighted(T, 3), b = pickWeighted(Cc, 2), items = [];
  while (a.length || b.length){ if (a.length) items.push(a.shift()); if (b.length) items.push(b.shift()); }
  return {id:Date.now().toString(36), date:today(), items:items.map(({t, k, id}) => ({t, k, id}))};
}
VIEWS.mixed = (main, args) => {
  main.append(h('button', {class:'back', type:'button', onclick:() => go('practice')}, '← Üben'));
  main.append(h('h1', {}, 'Gemischte Runde'));
  let run = store.data.mix;
  if (!run || !Array.isArray(run.items) || args[0] === 'neu'){
    if (run && run.id) for (const k of Object.keys(store.data.tasks)) if (k.endsWith('#mix' + run.id)) delete store.data.tasks[k];
    run = store.data.mix = newMix(); store.save();
  }
  main.append(h('p', {class:'muted small'}, 'Vermischtes Üben: Du musst erst erkennen, welches Verfahren passt. Das ist anstrengender, bleibt aber länger hängen. Aus welchem Thema eine Aufgabe stammt, siehst du erst nach dem Lösen.'));
  run.items.forEach((it, i) => {
    const t = topicById(it.t); if (!t) return;
    const lab = h('p', {class:'small muted mixlab'});
    const show = () => { lab.innerHTML = 'Aufgabe ' + (i + 1) + ' · aus ' + escH(tname(t) + ': ' + t.title); if (!it.shown){ it.shown = true; store.save(); } };
    const hide = () => { lab.innerHTML = 'Aufgabe ' + (i + 1) + ' · Thema verdeckt '; const b = h('button', {class:'btn btn-ghost btn-sm', type:'button'}, 'Thema zeigen'); b.onclick = show; lab.append(b); };
    if (it.k === 'concept'){
      const c = (t.concept || []).find(x => x.id === it.id); if (!c) return;
      main.append(lab, conceptItem(t, c, it.ans, a => { it.ans = a; store.save(); show(); }));
    } else {
      const task = t.practice.find(k => k.id === it.id); if (!task) return;
      main.append(lab, taskBox(task, {slot:'#mix' + run.id, onResult:(tk, g, r, all) => { if (tk.goals.every(gg => all[gg.id] && all[gg.id].state === 'solved')) show(); }}));
    }
    if (it.shown) show(); else hide();
  });
  if (!run.items.length) main.append(h('p', {}, 'Noch keine Aufgaben. Beginne zuerst ein Thema.'));
  const nb = h('button', {class:'btn btn-primary', type:'button', style:'margin-top:20px'}, 'Neue gemischte Runde');
  nb.onclick = () => go('mixed/neu');
  main.append(nb);
};
function errorBox(t, e){
  const ctx = ctxOf(e.ctx);
  const box = h('div', {class:'task', 'data-task':e.id});
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
  if (args[0] === 'heft') return errbookView(main);
  if (args[0]){ const t = topicById(args[0]); if (t) return reviewTopic(main, t); }
  main.append(h('h1', {}, 'Wiederholen'));
  main.append(h('p', {class:'muted'}, 'Verteiltes Wiederholen: Ein Thema kommt nach 2, 3, 7, 14 und 30 Tagen wieder – früher, wenn etwas nicht geklappt hat. Eine bestandene Wiederholung frühestens zwei Tage nach dem Abschluss macht ein Thema „sicher“.'));
  const open = store.data.errbook.filter(e => !e.done && !e.solved);
  const eb = h('div', {class:'box stack', style:'margin-top:16px'});
  eb.innerHTML = '<h3>Fehlerheft</h3><p class="small">' + (store.data.errbook.length ? open.length + ' offene Einträge, ' + store.data.errbook.length + ' insgesamt. Falsche Rechenzeilen und falsch beantwortete Fragen werden automatisch gesammelt.' : 'Noch leer. Falsche Rechenzeilen und falsch beantwortete Fragen landen hier automatisch.') + '</p>';
  const bh = h('button', {class:'btn btn-sm', type:'button'}, 'Fehlerheft öffnen'); bh.onclick = () => go('review/heft');
  eb.append(bh); main.append(eb);
  const due = dueTopics();
  const learned = TOPICS.filter(t => store.data.review[t.id]);
  if (!learned.length){ main.append(h('p', {style:'margin-top:16px'}, 'Noch nichts zu wiederholen. Schließe zuerst ein Thema unter „Neues lernen“ ab.')); return; }
  main.append(h('h3', {style:'margin-top:18px'}, due.length ? 'Heute fällig' : 'Heute ist nichts fällig'));
  const wrap = h('div', {class:'topic-list'});
  for (const t of (due.length ? due : learned)){
    const r = store.data.review[t.id];
    const row = h('div', {class:'topic' + (isSure(t) ? ' sure' : isPrelim(t) ? ' prelim' : '')});
    row.innerHTML = '<span class="num">' + tnum(t) + '</span><div><b>' + escH(t.title) + '</b><div class="small muted">fällig am ' + fmtD(r.due) + ' · Stufe ' + (r.box || 0) + (isPrelim(t) ? ' · vorläufig sicher' : isSure(t) ? ' · sicher' : '') + '</div></div>';
    const b = h('button', {class:'btn btn-sm', type:'button'}, 'Wiederholen'); b.onclick = () => go('review/' + t.id);
    row.append(b); wrap.append(row);
  }
  main.append(wrap);
  const errs = TOPICS.filter(t => isSure(t) && t.errors && t.errors.length);
  if (errs.length){ main.append(h('h3', {style:'margin-top:22px'}, 'Fehler finden')); for (const t of errs) for (const e of t.errors) main.append(errorBox(t, e)); }
};
/* Konzeptaufgabe fürs Wiederholen; ohne concept: Fragen zum Thema selbst (nicht der Voraussetzungscheck, nie der Abschluss) */
function reviewPool(t){
  if (Array.isArray(t.concept) && t.concept.length) return t.concept;
  const qs = ((t.clarify || {}).checks || []).concat(t.lab && t.lab.noPic ? [t.lab.noPic] : []);
  return qs.map((q, i) => Object.assign({type:'mc', id:'rq' + i}, q));
}
function reviewTopic(main, t){
  main.append(h('button', {class:'back', type:'button', onclick:() => go('review')}, '← Wiederholen'));
  main.append(h('h1', {}, 'Wiederholen: ' + t.title));
  const s = tstate(t);
  const rv = store.data.review[t.id] || (store.data.review[t.id] = {box:0, due:today()});
  if (!rv.cur || (rv.cur.done && rv.cur.date !== today())) rv.cur = {id:Date.now().toString(36), date:today(), done:false, counts:true};
  const cur = rv.cur; store.save();
  const R = rng(hashStr(t.id + cur.id));
  const tasks = shuffle(t.practice, R).slice(0, 2);
  const pool = reviewPool(t);
  const c = pool.length ? shuffle(pool, R)[0] : null;
  const slot = '#rev' + cur.id;
  const f = s.final;
  const sureFrom = f && f.v4 && f.prelim && !f.sure ? addDays(f.date, 2) : null;
  main.append(h('p', {class:'muted small'}, 'Zwei Aufgaben und eine Konzeptfrage – aus dem Gedächtnis. Beim ersten Versuch gibt es keine Hinweise; nur er zählt für die Stufe. Kommst du nicht weiter, schalte die Hinweise frei.'));
  if (sureFrom) main.append(h('div', {class:'box box-info small', html:today() >= sureFrom ? 'Diese Wiederholung kann das Thema <b>sicher</b> machen: Löse beide Aufgaben im ersten Versuch und die Konzeptfrage.' : 'Das Thema ist vorläufig sicher. Für <b>sicher</b> zählt erst eine Wiederholung ab dem <b>' + fmtD(sureFrom) + '</b>. Üben kannst du schon heute.'}));
  if (!cur.counts) main.append(h('p', {class:'small muted'}, 'Zusatzrunde: Sie zählt nicht für die Stufe.'));
  const out = h('div');
  const judge = force => {
    if (cur.done) return;
    const firstOk = task => task.goals.every(g => { const st = store.goal(task.id + slot, g.id); return st.first && st.first.state === 'solved'; });
    const firstSet = task => task.goals.every(g => store.goal(task.id + slot, g.id).first);
    if (!force && !(tasks.every(firstSet) && (!c || cur.c))) return;
    const okT = tasks.filter(firstOk).length, okC = c ? !!cur.cok : true;
    const nItems = tasks.length + (c ? 1 : 0), nOk = okT + (c && okC ? 1 : 0);
    const good = nOk >= Math.max(1, nItems - 1);   /* höchstens eine der drei Aufgaben daneben */
    cur.done = true; cur.good = good; cur.okT = okT; cur.okC = okC;
    let msg = '';
    if (cur.counts){
      rv.box = good ? Math.min((rv.box || 0) + 1, 5) : Math.max((rv.box || 0) - 1, 0);
      rv.due = addDays(today(), [1, 3, 7, 14, 30, 60][rv.box]);
      if (good && f && f.v4 && f.prelim && !f.sure && today() >= addDays(f.date, 2)){ f.sure = true; f.sureDate = today(); msg = ' Das Thema ist jetzt <b>sicher</b>.'; renderNav('review'); }
    }
    store.save();
    out.innerHTML = '';
    out.append(h('div', {class:'box ' + (good ? 'box-goal' : 'box-warn'), html:'<b>' + (good ? 'Gut gemacht.' : 'Noch etwas wackelig.') + '</b> Im ersten Versuch gelöst: ' + okT + ' von ' + tasks.length + ' Aufgaben' + (c ? ', Konzeptfrage ' + (okC ? 'richtig' : 'falsch') : '') + '.' + msg + (cur.counts ? ' Nächste Wiederholung am ' + fmtD(rv.due) + '.' : '')}));
    const again = h('button', {class:'btn btn-sm', type:'button', style:'margin-top:10px'}, 'Noch eine Runde (zählt nicht)');
    again.onclick = () => { rv.cur = {id:Date.now().toString(36), date:today(), done:false, counts:false}; store.save(); go('review/' + t.id); };
    out.append(again);
  };
  if (c) main.append(conceptBox(c, {topic:t, label:'Konzeptfrage', saved:cur.c, onAnswer:(ok, a) => { cur.c = a; cur.cok = ok; store.save(); if (!ok && pool === t.concept) store.errAdd({k:'concept', t:t.id, ref:c.id, text:c.q || 'Wer hat recht?', ans:c.opts[a.k] != null ? c.opts[a.k] : '', right:c.opts[c.a], seg:c.seg || null, lex:c.lex || null, msg:c.ex || ''}); judge(); }}));
  for (const task of tasks) main.append(taskBox(task, {slot, firstTry:!cur.done, onResult:() => judge(), onUnlock:() => judge()}));
  const bJ = h('button', {class:'btn btn-primary', type:'button', style:'margin-top:18px'}, 'Auswerten');
  bJ.onclick = () => judge(true);
  if (!cur.done) main.append(h('div', {class:'row'}, bJ, h('span', {class:'small muted'}, 'Was du im ersten Versuch nicht gelöst hast, zählt als nicht gelöst.')));
  main.append(out);
  if (cur.done){ cur.done = false; const keep = cur.counts; cur.counts = false; judge(true); cur.counts = keep; }
  const rd = h('details', {class:'box', style:'margin-top:18px'});
  rd.innerHTML = '<summary><b>Nachlesen: Zusammenfassung</b></summary><div class="stack" style="margin-top:8px">' + clarifyHTML(t.clarify) + '</div>';
  main.append(rd);
}
/* Fehlerheft: falsche Zeilen, falsch beantwortete Konzept- und Abschnittsfragen */
function errbookView(main){
  main.append(h('button', {class:'back', type:'button', onclick:() => go('review')}, '← Wiederholen'));
  main.append(h('h1', {}, 'Fehlerheft'));
  main.append(h('p', {class:'muted small'}, 'Hier sammelt das Tutorial automatisch deine falschen Rechenzeilen und falsch beantworteten Fragen. Sieh dir die Einträge an, lies nach und rechne die Aufgabe noch einmal. Gelöste Ziele werden als „später gelöst“ markiert.'));
  const flt = store.data.settings.ebAll ? 'all' : 'open';
  const sel = h('select', {'aria-label':'Einträge filtern'}, h('option', {value:'open'}, 'nur offene'), h('option', {value:'all'}, 'alle'));
  sel.value = flt;
  sel.onchange = () => { store.data.settings.ebAll = sel.value === 'all'; store.save(); go('review/heft', true); };
  main.append(h('label', {class:'fld'}, 'Anzeigen', sel));
  const B = store.data.errbook.slice().reverse().filter(e => flt === 'all' || (!e.done && !e.solved));
  if (!B.length){ main.append(h('p', {style:'margin-top:16px'}, flt === 'all' ? 'Das Fehlerheft ist leer.' : 'Keine offenen Einträge.')); return; }
  const KIND = {line:'Rechenzeile', concept:'Konzeptfrage', seg:'Frage im Erklärteil', final:'Abschluss'};
  const list = h('div', {class:'eblist'});
  for (const e of B){
    const t = topicById(e.t);
    const it = h('div', {class:'eb-item' + (e.done || e.solved ? ' done' : '')});
    const tk = e.k === 'line' ? (t && t.practice.find(k => k.id === e.ref)) : null;
    const ctx = tk ? ctxOf(tk.ctx) : null;
    let html = '<div class="small muted">' + fmtD(e.d) + ' · ' + escH(KIND[e.k] || e.k) + (t ? ' · ' + escH(tname(t) + ': ' + (t.short || t.title)) : '') + (e.n > 1 ? ' · ' + e.n + '×' : '') + (e.solved ? ' · <b class="okc">später gelöst</b>' : '') + '</div>';
    if (e.k === 'line'){
      html += '<div class="small">' + inl(e.title || '') + (e.prompt ? ' – ' + inl(e.prompt) : '') + '</div><div class="ebline">' + lineHTML(e.text, ctx) + '</div>' + (e.msg ? '<div class="small ebmsg">' + inl(e.msg) + '</div>' : '');
    } else {
      html += '<div>' + inl(e.text || '') + '</div>' + (e.ans ? '<div class="small">Deine Antwort: ' + inl(String(e.ans)) + '</div>' : '') + (e.right ? '<div class="small">Richtig: ' + inl(String(e.right)) + '</div>' : '') + (e.why ? '<div class="small">Richtige Begründung: ' + inl(String(e.why)) + '</div>' : '') + (e.msg ? '<div class="small ebmsg">' + inl(e.msg) + '</div>' : '');
    }
    const links = [];
    if (t && e.k === 'line' && tk) links.push('<a href="#/practice/' + t.id + '/' + encodeURIComponent(e.ref) + '">Zur Aufgabe</a>');
    else if (t && e.k === 'line') links.push('<a href="#/learn/' + t.id + '/4">Zum Beispiel</a>');
    if (t && e.k === 'concept') links.push('<a href="#/practice/' + t.id + '/' + encodeURIComponent('c:' + e.ref) + '">Zur Frage</a>');
    if (t && e.k === 'seg' && e.seg) links.push('<a href="#/learn/' + t.id + '/3/' + encodeURIComponent(e.seg) + '">Zum Abschnitt</a>');
    if (t && e.k === 'seg' && !e.seg) links.push('<a href="#/learn/' + t.id + '/4">Zum Beispiel</a>');
    if (t && e.k === 'final') links.push('<a href="#/learn/' + t.id + '/6">Üben</a>');
    if (t && e.seg && e.k !== 'seg') links.push(segLinkHTML(t.id, e.seg));
    if (e.lex) links.push(refLinkHTML(e.lex));
    html += '<div class="row small eblinks">' + links.filter(Boolean).join(' · ') + '</div>';
    it.innerHTML = html;
    if (!e.done){ const b = h('button', {class:'btn btn-ghost btn-sm', type:'button'}, 'Erledigt'); b.onclick = () => { e.done = true; store.save(); go('review/heft', true); }; $('.eblinks', it).append(b); }
    list.append(it);
  }
  main.append(list);
  const bc = h('button', {class:'btn btn-sm', type:'button', style:'margin-top:16px'}, 'Erledigte und gelöste Einträge löschen');
  bc.onclick = () => { store.data.errbook = store.data.errbook.filter(e => !e.done && !e.solved); store.save(); go('review/heft', true); };
  main.append(bc);
}

/* ---------- Klausur vorbereiten ---------- */
/* Probeklausur: [Rechenaufgaben, Konzeptfragen (20–30 %), Minuten] */
const EXAM_SIZES = [[3, 1, 30], [4, 1, 50], [5, 2, 75], [8, 3, 120], [11, 4, 180]];
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
    const open = tps.filter(t => !isSure(t));
    const sure = tps.filter(t => isSure(t));
    const rows = [];
    const per = Math.max(1, Math.ceil(open.length / Math.max(1, days - 2)));
    let d = 0;
    for (let i = 0; i < open.length; i += per){ rows.push([addDays(today(), d), 'Neu lernen: ' + open.slice(i, i + per).map(t => t.short || t.title).join(', ')]); d++; }
    for (let i = 0; d < days - 1 && i < 30; i++){ const t = sure.concat(open)[i % Math.max(1, tps.length)]; if (!t) break; rows.push([addDays(today(), d), 'Wiederholen: ' + (t.short || t.title) + ' · gemischte Runde']); d++; }
    rows.push([addDays(ex.date, -1), 'Probeklausur unter Zeitdruck, danach Schwachstellen üben']);
    plan.append(h('div', {class:'box', style:'margin-top:16px', html:'<h3>Tagesplan bis zum ' + escH(fmtD(ex.date)) + ' (' + ex.minutes + ' min/Tag)</h3><table class="tb"><tr><th>Tag</th><th>Was</th></tr>' + rows.map(r => '<tr><td>' + fmtD(r[0]) + '</td><td>' + escH(r[1]) + '</td></tr>').join('') + '</table>'}));
  }
  drawPlan();
  const pk = h('div', {class:'box stack', style:'margin-top:18px'});
  pk.innerHTML = '<h3>Probeklausur</h3><p class="small muted">Ohne Hinweise und ohne Prüfen. Etwa ein Viertel sind Konzeptfragen. Am Ende gibt es Punkte, alle Lösungen und die Themen, die du noch üben solltest. Abschlussaufgaben kommen hier nie vor.</p><label class="fld">Umfang <select class="pk-n">' + EXAM_SIZES.map((z, i) => '<option value="' + i + '"' + (i === 1 ? ' selected' : '') + '>' + (z[0] + z[1]) + ' Aufgaben (' + z[1] + ' Konzeptfrage' + (z[1] === 1 ? '' : 'n') + ') · ' + z[2] + ' Minuten</option>').join('') + '</select></label>';
  const bp = h('button', {class:'btn btn-primary', type:'button'}, 'Probeklausur starten');
  bp.onclick = () => {
    const [nT, nC, min] = EXAM_SIZES[+$('.pk-n', pk).value] || EXAM_SIZES[1];
    const tps = TOPICS.filter(t => ex.topics ? ex.topics.includes(t.id) : t.ch === 'qm');
    const poolT = shuffle(tps.flatMap(t => t.practice.filter(k => !k.noExam).map(k => [t.id, k.id])));
    const poolC = shuffle(tps.flatMap(t => (t.concept || []).map(c => [t.id, 'c:' + c.id])));
    let C = poolC.slice(0, nC); const T = poolT.slice(0, nT + (nC - C.length));
    if (T.length < nT && T.length) C = C.slice(0, Math.max(1, Math.floor(0.3 * T.length / 0.7)));   /* Konzeptanteil höchstens 30 % */
    store.data.examRun = {start:Date.now(), min, tasks:shuffle(T.concat(C)), ans:{}, done:false}; store.save(); go('exam/run');
  };
  pk.append(bp); main.append(pk);
};
function examRun(main){
  const run = store.data.examRun;
  if (!run){ go('exam'); return; }
  run.ans = run.ans || {};
  main.append(h('button', {class:'back', type:'button', onclick:() => go('exam')}, '← Klausur vorbereiten'));
  main.append(h('h1', {}, 'Probeklausur'));
  const timer = h('p', {class:'timer'});
  main.append(timer);
  const slot = '#exam' + run.start;
  const items = [];
  run.tasks.forEach(([tid, kid], idx) => {
    const t = topicById(tid); if (!t) return;
    if (String(kid).startsWith('c:')){
      const c = (t.concept || []).find(x => x.id === kid.slice(2)); if (!c) return;
      const cb = conceptBox(c, {exam:true, topic:t, saved:run.ans[idx], onSelect:a => { run.ans[idx] = a; store.save(); }});
      if (run.done) cb.reveal();
      items.push({t, c, idx}); main.append(cb);
    } else {
      const task = t.practice.find(k => k.id === kid); if (!task) return;
      const b = taskBox(task, run.done ? {locked:true, solution:true, slot} : {exam:true, slot});
      items.push({t, task, idx}); main.append(b);
    }
  });
  const fin = h('button', {class:'btn btn-primary', type:'button', style:'margin-top:20px'}, run.done ? 'Neue Probeklausur' : 'Abgeben');
  const out = h('div');
  main.append(fin, out);
  const tick = () => { if (run.done) { timer.textContent = 'Abgegeben.'; return; } const left = run.min * 60 - Math.round((Date.now() - run.start) / 1000); timer.textContent = left > 0 ? 'Noch ' + Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0') + ' min' : 'Zeit abgelaufen – gib ab.'; };
  tick(); const iv = setInterval(() => { if (!document.body.contains(timer)) clearInterval(iv); else tick(); }, 1000);
  fin.onclick = () => {
    if (run.done){ store.data.examRun = null; store.save(); go('exam'); return; }
    if (typeof INKUI !== 'undefined') INKUI.flushAll();
    run.done = true; store.save();
    go('exam/run');
  };
  if (run.done){
    let got = 0, max = 0; const weak = new Set();
    for (const it of items){
      if (it.c){ const r = conceptScore(it.c, run.ans[it.idx]); got += r.pts; max += r.max; if (!r.ok) weak.add(it.t); continue; }
      for (const g of it.task.goals){ const st = store.goal(it.task.id + slot, g.id); const sc = scoreGoal(it.task, g, (st.lines || []).map(l => l.m)); max += sc.P; got += sc.p; if (!sc.solved) weak.add(it.t); }
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
  const all = [{id:'schreibweise', title:'Schreibweise: Formeln eintippen und mit dem Stift schreiben', text:NOTATION_HELP}].concat(LEX.slice().sort((a, b) => a.title.localeCompare(b.title, 'de')));
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
VIEWS.settings = (main, args) => {
  if (args && args[0] === 'hand' && typeof INKUI !== 'undefined') return INKUI.trainerView(main);
  if (args && args[0] === 'probe' && typeof INKUI !== 'undefined') return INKUI.probeView(main);
  const S = store.data.settings;
  main.append(h('h1', {}, 'Einstellungen'));
  const f = h('div', {class:'stack'});
  f.innerHTML = `<label class="fld">Darstellung <select class="s-theme"><option value="">wie das Gerät</option><option value="light">hell</option><option value="dark">dunkel</option></select></label>
  <label class="fld">Schriftgröße <select class="s-size"><option value="">normal</option><option value="l">groß</option></select></label>
  <label class="fld">Prüfen <select class="s-mode"><option value="line">Zeile für Zeile (mit Enter)</option><option value="all">Erst den ganzen Lösungsweg (mit „Prüfen“)</option></select></label>`;
  main.append(f);
  $('.s-theme', f).value = S.theme || ''; $('.s-size', f).value = S.size || ''; $('.s-mode', f).value = S.mode || 'line';
  f.addEventListener('change', () => { S.theme = $('.s-theme', f).value; S.size = $('.s-size', f).value; S.mode = $('.s-mode', f).value; store.save(); applySettings(); toast('Gespeichert.'); });
  /* Stift und Handschrift */
  if (typeof INKUI !== 'undefined'){
    const pen = h('div', {class:'box stack', style:'margin-top:18px'});
    pen.innerHTML = `<h3>Stift und Handschrift</h3>
    <label class="fld">Eingabe in den Rechenzeilen <select class="s-input"><option value="kbd">Tastatur</option><option value="pen">Stift</option><option value="auto">automatisch (Stift, sobald ein Stift benutzt wurde)</option></select></label>
    <label class="ckm"><input type="checkbox" class="s-finger"> <span>Mit dem Finger schreiben (für Geräte ohne Stift). Aus: Finger und Handballen schreiben nicht.</span></label>
    <p class="small muted">In jeder Zeile kannst du vorn mit ✎ (Stift) und ⌨ (Tastatur) wechseln. ${escH(INKUI.status())}</p>`;
    $('.s-input', pen).value = INKUI.pref(); $('.s-finger', pen).checked = !!S.inkFinger;
    pen.addEventListener('change', () => { S.input = $('.s-input', pen).value; S.inkFinger = $('.s-finger', pen).checked; store.save(); toast('Gespeichert.'); });
    const bh = h('button', {class:'btn btn-sm', type:'button'}, 'Handschrift anlernen');
    bh.onclick = () => go('settings/hand');
    pen.append(h('div', {class:'row'}, bh, h('span', {class:'small muted'}, 'Seltene Zeichen wie ψ, ħ, ∂, ⟨ ⟩ je zweimal schreiben.')));
    const bp = h('button', {class:'btn btn-sm', type:'button'}, 'Schreibprobe');
    bp.onclick = () => go('settings/probe');
    pen.append(h('div', {class:'row'}, bp, h('span', {class:'small muted'}, '23 Testzeilen mit dem Stift schreiben (etwa 10 Minuten), damit die Erkennung mit deiner Schrift ausgewertet werden kann. Nichts wird gesendet.')));
    main.append(pen);
  }
  const data = h('div', {class:'box stack', style:'margin-top:18px'});
  data.innerHTML = '<h3>Lernstand</h3><p class="small muted">Der Lernstand liegt nur auf diesem Gerät. Du kannst ihn als Datei sichern und auf einem anderen Gerät wieder einlesen.</p>';
  const bx = h('button', {class:'btn btn-sm', type:'button'}, 'Als Datei sichern');
  bx.onclick = () => download('qm-lernstand-' + today() + '.json', JSON.stringify(store.data, null, 1), 'application/json');
  const fi = h('input', {type:'file', accept:'application/json', 'aria-label':'Lernstand einlesen', style:'max-width:260px'});
  fi.onchange = () => { const r = new FileReader(); r.onload = () => { try { const d = JSON.parse(r.result); if (!d || typeof d !== 'object' || !d.topics) throw new Error('keine Lernstand-Datei'); store.load(d); store.save(); toast('Lernstand eingelesen.'); render(); } catch(e){ toast('Datei passt nicht: ' + e.message); } }; r.readAsText(fi.files[0]); };
  const bd = h('button', {class:'btn btn-sm', type:'button'}, 'Alles zurücksetzen');
  bd.onclick = () => { if (!bd.dataset.sure){ bd.dataset.sure = '1'; bd.textContent = 'Wirklich alles löschen? Noch einmal tippen'; setTimeout(() => { delete bd.dataset.sure; bd.textContent = 'Alles zurücksetzen'; }, 5000); return; } store.load({}); store.save(); render(); };
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
/* Kalibrierung aus den Sicherheitsurteilen (Abschluss) */
function calibBox(){
  const C = store.data.calib || [];
  const box = h('div', {class:'box stack calib', style:'margin-top:22px'});
  box.append(h('h2', {}, 'Wie gut schätzt du dich ein?'));
  if (C.length < 5){ box.append(h('p', {class:'small muted'}, 'Noch zu wenige Sicherheitsurteile (' + C.length + '). Sie entstehen im Abschluss jedes Themas: Vor dem Abgeben gibst du an, wie sicher du bist.')); return box; }
  const rows = CONF_LEVELS.map((name, c) => { const L = C.filter(x => x.c === c); const ok = L.filter(x => x.ok).length; return {name, n:L.length, ok, p:L.length ? ok / L.length : null}; });
  box.append(h('p', {class:'small muted'}, 'Gut eingeschätzt heißt: Wo du „sicher“ warst, ist fast alles richtig; wo du „geraten“ hast, eher wenig. ' + C.length + ' Urteile aus deinen Abschlüssen.'));
  const tb = h('div', {class:'calrows'});
  for (const r of rows) tb.append(h('div', {class:'calrow', html:'<span class="cl">' + escH(r.name) + '</span><span class="cbar"><i style="width:' + (r.p == null ? 0 : Math.round(100 * r.p)) + '%"></i></span><span class="cv">' + (r.n ? r.ok + ' von ' + r.n + ' richtig (' + Math.round(100 * r.p) + ' %)' : '–') + '</span>'}));
  box.append(tb);
  const sure = rows[3], hi = rows[2], lo = rows[0];
  let tip = '';
  if (sure.n >= 3 && sure.p < 0.8) tip = 'Bei „sicher“ sind nur ' + Math.round(100 * sure.p) + ' % richtig: Du überschätzt dich. Prüf dein Ergebnis vor dem Abgeben mit Einheiten, Grenzfällen und Plausibilität.';
  else if (lo.n >= 3 && lo.p > 0.6) tip = 'Auch beim Raten liegst du oft richtig: Du kannst mehr, als du denkst.';
  else if (sure.n >= 3 && hi.n >= 3 && sure.p >= 0.8) tip = 'Deine Einschätzung passt gut zu deinen Ergebnissen.';
  if (tip) box.append(h('p', {class:'small'}, tip));
  return box;
}
VIEWS.solutions = main => {
  main.append(h('h1', {}, 'Lösungen & Fortschritt'));
  main.append(h('p', {class:'muted small'}, 'Für dich, deine Tutorin oder deinen Tutor: Lernstand, Selbsteinschätzung und – in der Tutor-Ansicht – alle Musterlösungen.'));
  const tb = h('table', {class:'tb'});
  const aimCell = s => { const f = s.final; if (!f || !f.v4 || !f.aimOk) return '–'; return Object.keys(f.aimOk).map(a => (+a + 1) + (f.aimOk[a] ? ' ✓' : ' ✗')).join(' · '); };
  const finCell = s => { const f = s.final; if (!f) return '–'; if (f.v4) return Math.round(100 * f.pct) + ' %, Form ' + f.form + ' (' + fmtD(f.date) + ')'; return f.score + '/4 (' + fmtD(f.date) + ')'; };
  tb.innerHTML = '<tr><th>Thema</th><th>Stand</th><th>Abschluss</th><th>Lernziele</th><th>Gelöste Ziele</th></tr>' + CHAPTERS.slice().reverse().map(([ch, name]) => '<tr><th colspan="5">' + escH(name) + '</th></tr>' + chTopics(ch).map(t => { const s = tstate(t); const goals = t.practice.flatMap(k => k.goals.map(g => store.data.tasks[k.id] && store.data.tasks[k.id].goals[g.id])); const solved = goals.filter(g => g && g.state === 'solved').length; return '<tr><td>' + tnum(t) + ' ' + escH(t.title) + '</td><td>' + (isSure(t) ? 'sicher' : isPrelim(t) ? 'vorläufig sicher' : s.step > 1 ? 'Schritt ' + s.step : '–') + '</td><td>' + finCell(s) + '</td><td>' + aimCell(s) + '</td><td>' + solved + ' / ' + goals.length + '</td></tr>'; }).join('')).join('');
  main.append(h('div', {class:'tbw'}, tb));
  const bx = h('button', {class:'btn btn-sm', type:'button', style:'margin-top:12px'}, 'Bericht als Datei');
  bx.onclick = () => download('qm-bericht-' + today() + '.html', '<!DOCTYPE html><meta charset="utf-8"><title>Bericht Tutorial in Quantum Mechanics</title><h1>Bericht Tutorial in Quantum Mechanics, ' + today() + '</h1>' + tb.outerHTML, 'text/html');
  main.append(bx);
  main.append(calibBox());
  const nOpen = store.data.errbook.filter(e => !e.done && !e.solved).length;
  main.append(h('p', {class:'small', style:'margin-top:14px', html:'Fehlerheft: ' + nOpen + ' offene Einträge · <a href="#/review/heft">öffnen</a>'}));
  /* Musterlösungen nur in der Tutor-Ansicht */
  const S = store.data.settings;
  const sw = h('label', {class:'ckm tutor-sw', style:'margin-top:26px'}, h('input', {type:'checkbox', class:'s-tutor'}), h('span', {html:'<b>Tutor-Ansicht:</b> alle Musterlösungen zeigen'}));
  main.append(sw);
  const cb = $('.s-tutor', sw); cb.checked = !!S.tutor;
  const sol = h('div');
  main.append(sol);
  const drawSol = () => {
    sol.innerHTML = '';
    if (!S.tutor){ sol.append(h('p', {class:'small muted'}, 'Im Selbststudium wirkt es besser, erst selbst zu rechnen. Beim Lernen gibt es die Lösung nach einem eigenen Versuch. Für Tutorinnen und Tutoren lassen sich hier alle Musterlösungen einblenden.')); return; }
    sol.append(h('h2', {style:'margin-top:16px'}, 'Alle Musterlösungen'));
    for (const t of CHAPTERS.slice().reverse().flatMap(([ch]) => chTopics(ch))){
      const d = h('details', {class:'box', style:'margin-top:8px'});
      d.innerHTML = '<summary><b>' + tnum(t) + ' ' + escH(t.title) + '</b></summary>';
      d.addEventListener('toggle', () => {
        if (!d.open || d.querySelector('.solution')) return;
        for (const task of t.practice){ d.append(h('h4', {style:'margin-top:12px', html:inl(task.title)})); d.append(h('div', {class:'small', html:md(task.text)})); for (const g of task.goals){ d.append(h('p', {class:'small', html:'<b>' + inl(g.prompt || '') + '</b>'})); d.append(modelBox(g, ctxOf(task.ctx))); } }
      });
      sol.append(d);
    }
  };
  cb.onchange = () => { S.tutor = cb.checked; store.save(); drawSol(); };
  drawSol();
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
