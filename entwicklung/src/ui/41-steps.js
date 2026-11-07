/* ===== Erklärteil in kleinen Schritten (Festlegung: didaktik/UMBAU2.md, Abschnitte 1, 2 und 4) =====
   Bausteine: Darstellungstafel (reps), Auffrischung (pre), Zahlenbeispiel (num), Etikett der Übersetzungsfrage (q.tr),
   Kasten lab.map (Schritt 5), Spickzettel Darstellungen (Zusammenfassung), Schritt-Ansicht eines Abschnitts mit steps.
   Speicher (store.topic(id).tc, wie bisher): tc.st[Schritt-id] = {q: Antwort, why: {Zeile: Antwort}, pq: Antwort auf pre.q},
   tc.sv[Abschnitts-id] = Index des letzten sichtbaren Schritts, tc.seg[Abschnitts-id] = true, wenn alle Schritte beantwortet sind.
   Abschnitte ohne steps zeigt weiter segView (40-views.js) im bisherigen Format. */
const REPNAME = {worte:'Worte', dirac:'Dirac', ort:'Ortsdarstellung', impuls:'Impulsdarstellung', matrix:'Matrix', formel:'Formel', graph:'Graph', labor:'Labor', mathe:'Mathe', physik:'Physik'};
const repName = k => REPNAME[k] || String(k || '');
const isStepSeg = sg => !!sg && Array.isArray(sg.steps);
const hasStepSegs = t => !!t && (t.teach || []).some(isStepSeg);
/* Schritt finden: {sg, st, i (Abschnitt), k (Schritt)} */
function findStep(t, id){
  const T = (t && t.teach) || [];
  for (let i = 0; i < T.length; i++) if (isStepSeg(T[i])){ const k = T[i].steps.findIndex(x => x && x.id === id); if (k >= 0) return {sg:T[i], st:T[i].steps[k], i, k}; }
  return null;
}
const texOrMd = s => /\$/.test(String(s || '')) ? inl(String(s)) : texHTML(String(s || ''));

/* ---------- Darstellungstafel ----------
   Kopf mit obj; je Zeile Etikett der Art und Inhalt (text als md, tex abgesetzt, graph statisch);
   zwischen zwei Zeilen die Übersetzungsregeln (Pfeil ↓ bzw. ↑ nach der Richtung der Regel); übrige Regeln darunter. */
function repsBox(R, o){
  o = o || {};
  const rows = Array.isArray(R && R.rows) ? R.rows.filter(Boolean) : [], links = Array.isArray(R && R.links) ? R.links.filter(Boolean) : [];
  const fig = h('figure', {class:'reps' + (o.compact ? ' reps-compact' : ''), role:'group', 'aria-label':'Darstellungstafel: ' + plainT(R && R.obj)});
  fig.append(h('figcaption', {class:'reps-h', html:'<span class="reps-tag">Darstellungstafel</span> <span class="reps-obj">' + inl(String((R && R.obj) || '')) + '</span>'}));
  const body = h('div', {class:'reps-rows'});
  const used = new Set();
  const dir = l => '<span class="rep-dir">' + escH(repName(l.from)) + ' → ' + escH(repName(l.to)) + ':</span> ';
  rows.forEach((r, i) => {
    if (i > 0){
      const a = rows[i - 1].k, b = r.k;
      const L = links.filter(l => (l.from === a && l.to === b) || (l.from === b && l.to === a));
      L.forEach(l => used.add(l));
      for (const l of L.length ? L : [null]){
        const el = h('div', {class:'rep-link' + (l ? '' : ' none')});
        el.append(h('div', {class:'rep-arr', 'aria-hidden':'true'}, !l ? '⋮' : l.from === a ? '↓' : '↑'));
        el.append(h('div', {class:'rep-rule', html:l ? dir(l) + inl(String(l.rule || '')) : ''}));
        body.append(el);
      }
    }
    const row = h('div', {class:'rep rep-' + String(r.k).replace(/[^\w-]/g, '')});
    row.append(h('div', {class:'rep-k'}, repName(r.k)));
    const c = h('div', {class:'rep-c'});
    if (r.k === 'graph' && typeof SKUI !== 'undefined' && SKUI.staticGraph) c.append(SKUI.staticGraph(r, {minH:o.compact ? 140 : 170, maxH:o.compact ? 220 : 300}));
    else {
      if (r.tex) c.append(h('div', {class:'dm rep-tex', html:texHTML(String(r.tex), true)}));
      if (r.text) c.append(h('div', {class:'stack rep-t', html:md(String(r.text))}));
      if (r.cap) c.append(h('div', {class:'small muted', html:inl(String(r.cap))}));
    }
    row.append(c); body.append(row);
  });
  fig.append(body);
  const rest = links.filter(l => !used.has(l));
  if (rest.length) fig.append(h('div', {class:'reps-more small', html:'<b>Weitere Übersetzungen</b><ul class="clean">' + rest.map(l => '<li>' + dir(l) + inl(String(l.rule || '')) + '</li>').join('') + '</ul>'}));
  return fig;
}
/* ---------- Kurz aufgefrischt (pre): zu, wenn das Thema pre.from „sicher“ ist, sonst offen ---------- */
function preBox(pre, S0){
  const p = topicById(pre.from), sg = p && pre.seg ? findSeg(p, pre.seg) : null, sure = !!(p && isSure(p));
  const d = h('details', {class:'box box-pre' + (sure ? ' sure' : '')});
  if (!sure) d.open = true;
  const title = pre.title || (sg && sg.title) || (p && p.title) || '';
  d.append(h('summary', {html:'<span class="pre-h">Kurz aufgefrischt:</span> ' + inl(String(title)) + (sure ? ' <span class="tag good">sicher</span>' : '')}));
  const inner = h('div', {class:'stack pre-b'});
  inner.innerHTML = md(pre.text || '');
  const link = !p ? '' : sg ? segLinkHTML(p.id, sg.id, 'Nachlesen: ' + tname(p) + ', ' + sg.title)
    : '<a href="#/learn/' + escH(p.id) + '/' + (isV4(p) ? 3 : 1) + '">Zu ' + escH(tname(p) + ': ' + p.title) + '</a>';
  if (link) inner.append(h('p', {class:'small pre-l', html:link}));
  if (pre.q && Array.isArray(pre.q.opts)) inner.append(mcBox(pre.q, {label:'Kurz geprüft · zählt nicht', saved:S0 ? S0.pq : undefined, onAnswer:(ok, j) => { if (S0){ S0.pq = j; store.save(); } }}));
  d.append(inner);
  return d;
}
/* ---------- Erst ein Beispiel (num) ---------- */
function numBox(num){
  const tt = num.title && !/^(zahlen)?beispiel$/i.test(String(num.title).trim()) ? ': ' + inl(String(num.title)) : '';
  return h('div', {class:'box box-num', html:'<h5>Erst ein Beispiel' + tt + '</h5>' + md(num.text || '')});
}
const trTag = tr => h('span', {class:'trtag'}, 'Übersetzen: ' + repName(tr.from) + ' → ' + repName(tr.to));
/* ---------- Was im Labor wo in der Formel steht (lab.map, Schritt 5) ----------
   auf dem Telefon zu, sonst offen; ein Tipp auf den Namen hebt den Regler im Labor kurz hervor */
function labMapBox(map, getLab){
  const d = h('details', {class:'box labmap'});
  let narrow = false; try { narrow = matchMedia('(max-width:700px)').matches; } catch(e){}
  if (!narrow) d.open = true;
  d.append(h('summary', {}, h('b', {}, 'Was im Labor wo in der Formel steht')));
  const tbl = h('div', {class:'lm-grid', role:'table', 'aria-label':'Was im Labor wo in der Formel steht'});
  tbl.append(h('div', {class:'lm-row lm-head', role:'row'}, h('span', {role:'columnheader'}, 'In der Formel'), h('span', {role:'columnheader'}, 'Im Labor'), h('span', {role:'columnheader'}, 'Was es bedeutet')));
  for (const m of map || []){
    if (!m) continue;
    const chip = h('button', {class:'lm-chip', type:'button', title:'Im Labor zeigen', 'aria-label':'Im Labor zeigen: ' + (m.ctl || '')}, m.ctl || '');
    chip.onclick = () => {
      const lab = getLab && getLab(); if (!lab) return;
      const name = String(m.ctl || '').trim().toLowerCase();
      const cands = [...lab.querySelectorAll('.ctrl > label, .ctrl button, button, .readout')];
      const el = cands.find(x => (x.tagName === 'LABEL' ? ctlName(x) : x.textContent).trim().toLowerCase().startsWith(name)) || cands.find(x => x.textContent.toLowerCase().includes(name));
      if (!el){ toast('„' + m.ctl + '“ steht in der Grafik des Labors (Achse oder Beschriftung).'); lab.scrollIntoView({block:'nearest', behavior:'smooth'}); return; }
      if (lab.classList.contains('fig') && el.classList.contains('xtra')) lab.classList.add('more');
      el.scrollIntoView({block:'nearest', behavior:'smooth'});
      el.classList.remove('lm-hl'); void el.offsetWidth; el.classList.add('lm-hl'); setTimeout(() => el.classList.remove('lm-hl'), 1800);
    };
    tbl.append(h('div', {class:'lm-row', role:'row'},
      h('span', {class:'lm-sym', role:'cell', html:texOrMd(m.sym)}),
      h('span', {class:'lm-ctl', role:'cell'}, chip),
      h('span', {class:'lm-says', role:'cell', html:inl(String(m.says || ''))})));
  }
  d.append(tbl);
  return d;
}
/* ---------- Spickzettel Darstellungen: alle Tafeln eines Themas (Zusammenfassung, Seitenfeld im Üben) ---------- */
function cheatSheet(t, o){
  o = o || {};
  const L = [];
  for (const sg of t.teach || []) if (isStepSeg(sg)) for (const st of sg.steps) if (st && st.reps) L.push({sg, st});
  if (!L.length) return null;
  const box = h('section', {class:(o.bare ? '' : 'box ') + 'cheat stack', 'aria-label':'Spickzettel Darstellungen'});
  if (!o.bare) box.append(h('h3', {}, 'Spickzettel Darstellungen'));
  box.append(h('p', {class:'small muted'}, L.length + (L.length === 1 ? ' Darstellungstafel' : ' Darstellungstafeln') + ' dieses Themas: dasselbe Objekt in mehreren Darstellungen und die Regeln, wie man übersetzt.'));
  for (const {st} of L){
    const r = repsBox(st.reps, {compact:true});
    r.append(h('p', {class:'small cheat-l', html:'<a href="#/learn/' + escH(t.id) + '/3/' + encodeURIComponent(st.id) + '">Zum Schritt: ' + inl(String(st.title || '')) + '</a>'}));
    box.append(r);
  }
  return box;
}
/* ---------- Abschnitt mit steps im Dialog (Nachlesen, Mini-Auffrischung) ---------- */
function stepsDlgBody(t, sg, fresh){
  const wrap = h('div', {class:'stack'});
  sg.steps.forEach((st, k) => {
    if (!st) return;
    const box = h('section', {class:'stp stp-dlg'});
    box.append(h('h4', {class:'stph', html:'<span class="stpn">Schritt ' + (k + 1) + ' von ' + sg.steps.length + '</span><span class="stpt">' + inl(String(st.title || '')) + '</span>'}));
    if (st.num) box.append(numBox(st.num));
    box.append(h('div', {class:'stack stptext', html:md(st.text || '')}));
    if (st.plot && typeof SKUI !== 'undefined' && SKUI.staticGraph) box.append(SKUI.staticGraph(st.plot));
    if (st.reps) box.append(repsBox(st.reps, {compact:true}));
    if (st.derive && Array.isArray(st.derive.lines)){
      const ctx = ctxOf(st.derive.ctx);
      box.append(h('h5', {html:st.derive.title ? inl(st.derive.title) : 'Herleitung'}));
      box.append(h('ol', {class:'model', html:st.derive.lines.map(L => '<li>' + drlHTML(L.l, ctx) + (L.w ? ' <span class="muted small">' + inl(L.w) + '</span>' : '') + '</li>').join('')}));
    }
    wrap.append(box);
  });
  /* Mini-Auffrischung: die Kontrollfragen der Schritte am Ende, wie bisher unter „Kurz geprüft“ (ohne Speichern) */
  const Q = fresh ? sg.steps.filter(st => st && st.q && Array.isArray(st.q.opts)) : [];
  if (Q.length){
    wrap.append(h('h4', {}, 'Kurz geprüft'));
    Q.forEach((st, j) => { const mb = mcBox(st.q, {label:'Frage ' + (j + 1) + ' · zu Schritt ' + (sg.steps.indexOf(st) + 1)}); if (st.q.tr){ const qh = mb.querySelector('.qh'); if (qh) qh.append(' ', trTag(st.q.tr)); } wrap.append(mb); });
  }
  return wrap;
}

/* ---------- Schritt-Ansicht (Lernweg, Schritt 3 „Erklären“) ----------
   X = {tc, N, drawNav(), next(), focus: Schritt-id oder null, initial: erster Aufbau der Seite (Fortsetzen nach Neuladen)}
   Sichtbar sind Schritt 1 … vis; nach der Antwort auf q des letzten sichtbaren Schritts erscheint „Weiter: Schritt k+1“.
   Ein Schritt mit derive zeigt q erst nach der letzten Herleitungszeile. Falsche Antworten blockieren nicht. */
function stepSegView(area, t, sg, i, X){
  const tc = X.tc, S = sg.steps.filter(Boolean), n = S.length;
  tc.st = tc.st || {}; tc.sv = tc.sv || {};
  const sst = st => tc.st[st.id] || (tc.st[st.id] = {});
  const hasDrv = st => !!(st.derive && Array.isArray(st.derive.lines) && st.derive.lines.length);
  const drvDone = st => !hasDrv(st) || st.derive.lines.every((L, j) => !L.why || (tc.st[st.id] && tc.st[st.id].why && tc.st[st.id].why[j] !== undefined));
  const qDone = st => !(st.q && Array.isArray(st.q.opts)) || !!(tc.st[st.id] && tc.st[st.id].q !== undefined);
  const done = st => drvDone(st) && qDone(st);
  if (!n){ area.append(h('p', {class:'muted'}, 'Dieser Abschnitt hat noch keine Schritte.')); return; }
  const fi = X.focus ? S.findIndex(x => x.id === X.focus) : -1;
  let vis = Math.max(0, Math.min(n - 1, Math.max(tc.sv[sg.id] || 0, fi)));
  if (vis !== (tc.sv[sg.id] || 0)){ tc.sv[sg.id] = vis; store.save(); }
  const head = h('div', {class:'seghead small muted'});
  const prog = h('span', {class:'stpprog'}), dots = h('span', {class:'stpdots', 'aria-hidden':'true'});
  head.append('Abschnitt ' + (i + 1) + ' von ' + X.N + ' · ', prog, dots);
  area.append(head, h('h3', {class:'segtitle', html:inl(sg.title)}));
  const list = h('div', {class:'stplist'});
  const foot = h('div', {class:'row stpfoot'});
  const live = h('p', {class:'sr-only', 'aria-live':'polite'});
  area.append(list, foot, live);
  const where = (st, k) => plainT(sg.title) + ' · Schritt ' + (k + 1) + ': ' + plainT(st.title || '');
  const bStep = h('button', {class:'btn btn-primary', type:'button', 'data-stp':'next'});
  const bSeg = h('button', {class:'btn btn-primary', type:'button', 'data-stp':'seg'}, i + 1 < X.N ? 'Weiter: Abschnitt ' + (i + 2) : 'Weiter: Zusammenfassung');
  const note = h('span', {class:'small muted stpnote'});
  foot.append(bStep, bSeg, note);
  const updHead = () => {
    prog.textContent = 'Schritt ' + (vis + 1) + ' von ' + n;
    dots.innerHTML = S.map((st, k) => '<i class="' + (done(st) ? 'd' : '') + (k === vis ? ' c' : '') + '"></i>').join('');
  };
  const updFoot = () => {
    const st = S[vis], d = done(st), last = vis === n - 1;
    bStep.hidden = !(d && !last); bStep.textContent = 'Weiter: Schritt ' + (vis + 2) + ' von ' + n;
    bSeg.hidden = !(d && last);
    note.textContent = d ? '' : hasDrv(st) && !drvDone(st) ? 'Geh zuerst die Herleitung durch, dann kommt die Kontrollfrage.' : 'Beantworte die Kontrollfrage, dann geht es weiter.';
    if (S.every(done) && !tc.seg[sg.id]){ tc.seg[sg.id] = true; store.save(); X.drawNav(); }
    updHead();
  };
  function stepEl(st, k){
    const S0 = sst(st); S0.why = S0.why || {};
    const box = h('section', {class:'stp', id:'stp-' + st.id, 'data-step':st.id, 'aria-labelledby':'stph-' + st.id});
    box.append(h('h4', {class:'stph', id:'stph-' + st.id, tabindex:'-1', html:'<span class="stpn">Schritt ' + (k + 1) + ' von ' + n + '</span><span class="stpt">' + inl(String(st.title || '')) + '</span>'}));
    if (st.pre) box.append(preBox(st.pre, S0));
    if (st.num) box.append(numBox(st.num));
    const grid = h('div', {class:'segbody' + (st.fig ? ' withfig' : '')});
    grid.append(h('div', {class:'stack segtext stptext', html:md(st.text || '')}));
    if (st.fig){
      const fig = h('figure', {class:'segfig'}); const lab = h('div'); fig.append(lab);
      labRun(lab, st.fig.lab, st.fig, {display:true, init:st.fig.init, keep:st.fig.keep, topic:t.id});
      if (st.fig.caption) fig.append(h('figcaption', {class:'small muted', html:inl(st.fig.caption)}));
      grid.append(fig);
    }
    box.append(grid);
    if (st.plot && typeof SKUI !== 'undefined' && SKUI.staticGraph) box.append(SKUI.staticGraph(st.plot, {cls:'stpplot'}));
    if (st.reps) box.append(repsBox(st.reps));
    const qw = h('div', {class:'stack stpq'});
    const after = fresh => {
      if (k === vis) updFoot(); else updHead();
      if (fresh && S.every(done)) live.textContent = 'Abschnitt erledigt.';
    };
    const showQ = () => {
      if (qw.dataset.on) return; qw.dataset.on = '1';
      const q = st.q;
      if (!(q && Array.isArray(q.opts))){ after(true); return; }
      const mb = mcBox(q, {label:'Kontrollfrage', saved:S0.q, onAnswer:(ok, j) => {
        S0.q = j; store.save();
        if (!ok) store.errAdd({k:'seg', t:t.id, ref:sg.id, pos:'s' + st.id, step:st.id, seg:sg.id, where:where(st, k), text:q.q, ans:q.opts[j] != null ? q.opts[j] : '', right:q.opts[q.a], msg:q.ex || ''});
        after(true);
      }});
      if (q.tr && q.tr.from && q.tr.to){ mb.classList.add('mc-tr'); const qh = mb.querySelector('.qh'); if (qh) qh.append(' ', trTag(q.tr)); }
      qw.append(mb);
      if (S0.q !== undefined) after(false);
    };
    if (hasDrv(st)){
      box.append(h('h5', {class:'drvh', html:st.derive.title ? inl(st.derive.title) : 'Herleitung Schritt für Schritt'}));
      if (st.derive.text) box.append(h('div', {class:'stack drvt', html:md(st.derive.text)}));
      const ol = h('ol', {class:'model stack'}); box.append(ol, qw);
      modelLines(ol, st.derive.lines, ctxOf(st.derive.ctx), S0.why, () => showQ(), {onWrong:(L, j, li) => store.errAdd({k:'seg', t:t.id, ref:sg.id, pos:'s' + st.id + ':w' + li, step:st.id, seg:sg.id, where:where(st, k), text:L.why.q, ans:L.why.opts[j] != null ? L.why.opts[j] : '', right:L.why.opts[L.why.a], msg:L.why.ex || ''})});
      if (k === vis && !qw.dataset.on) updFoot();
    } else { box.append(qw); showQ(); }
    return box;
  }
  const els = [];
  for (let k = 0; k <= vis; k++){ const el = stepEl(S[k], k); els.push(el); list.append(el); }
  updFoot();
  const goStep = (el, smooth, focus) => {
    try { el.scrollIntoView({block:'start', behavior:smooth ? 'smooth' : 'auto'}); } catch(e){ el.scrollIntoView(); }
    if (focus){ const hd = el.querySelector('.stph'); try { hd.focus({preventScroll:true}); } catch(e){} }
  };
  bStep.onclick = () => {
    if (vis >= n - 1 || !done(S[vis])) return;
    vis++; tc.sv[sg.id] = vis; store.save();
    const el = stepEl(S[vis], vis); els.push(el); list.append(el);
    updFoot();
    live.textContent = 'Schritt ' + (vis + 1) + ' von ' + n + ': ' + plainT(S[vis].title || '');
    goStep(el, true, true);
  };
  bSeg.onclick = () => X.next();
  /* angesprungener Schritt (Fehlerheft, Spickzettel) bzw. Fortsetzen nach Neuladen: nach dem Aufbau der Seite anscrollen */
  const target = fi >= 0 ? els[fi] : X.initial && vis > 0 ? els[vis] : null;
  if (target) setTimeout(() => { goStep(target, false, fi >= 0); if (fi >= 0){ target.classList.add('flash'); setTimeout(() => target.classList.remove('flash'), 2200); } }, 30);
}
