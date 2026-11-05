/* Zeichen-Bigramme der handgeschriebenen Eingabesprache (Nachbarzeichen auf derselben Ebene).
   Lernzeilen: alle Inhaltszeilen AUSSER den Musterzeilen der Übungsziele (die prüft t_e2e.js), also Beispiele,
   Lückenaufgaben, Vergleiche, Fehler-finden, Abschlussaufgaben.  node test/ink/build_lm.js > lm.json  (Tabelle wird in 16-ink-recog.js als INKLM eingetragen)
   Ebenen-Anfang: '^' Hochzahl, '_' Index, '/' Nenner, '#' Zähler, 'r' Wurzel, 'S' Zeilenanfang. */
const lib = require('./lib.js');
const E = lib.load({model:'oracle'});
const lines = [];
const add = l => { if (typeof l === 'string') lines.push(l); else if (l && l.l) lines.push(l.l); };
for (const t of E.TOPICS){
  (t.example.lines || []).forEach(add);
  if (t.example.faded) t.example.faded.goals.forEach(g => (g.model || []).forEach(add));
  for (const side of [t.compare.A, t.compare.B]) (side.model || []).forEach(add);
  for (const e of t.errors || []){ (e.lines || []).forEach(add); (e.fix.model || []).forEach(add); }
  t.final.forEach(it => { if (it.task) it.task.goals.forEach(g => (g.model || []).forEach(add)); });
}
/* Text → Folgen handgeschriebener Zeichen je Ebene */
function seqs(src){
  const out = [];
  let s = E.normalize(src).replace(/\*\s*(?=[^\s])/g, '·').replace(/sqrt/g, '√');
  /* Funktionswörter bleiben Buchstaben; o in cos → 0 (keine Klasse o) */
  s = s.replace(/cos/g, 'c0s').replace(/cosh/g, 'c0sh');
  const stack = [{mark:'S', seq:[]}];
  const cur = () => stack[stack.length - 1];
  const push = c => cur().seq.push(c);
  for (let i = 0; i < s.length; i++){
    const ch = s[i];
    if (/\s/.test(ch)) continue;
    if (ch === '^' || ch === '_'){
      const m = ch;
      if (s[i + 1] === '(' || s[i + 1] === '{'){ stack.push({mark:m, seq:[], close:s[i + 1] === '(' ? ')' : '}', depth:0}); i++; continue; }
      if (s[i + 1] === '*'){ out.push([m, '*']); i++; continue; }
      /* ein Zeichen (oder Zahl) */
      let j = i + 1, tok = [];
      if (/[0-9]/.test(s[j])) while (/[0-9]/.test(s[j] || '')) tok.push(s[j++]);
      else if (s[j] === '-' || s[j] === '+'){ tok.push(s[j++]); if (s[j]) tok.push(s[j++]); }
      else if (s[j]) tok.push(s[j++]);
      out.push([m].concat(tok)); i = j - 1; continue;
    }
    if (ch === '√' && s[i + 1] === '('){ stack.push({mark:'r', seq:[], close:')', depth:0}); i++; continue; }
    if (ch === '/'){ /* Nenner: nächste Gruppe */ out.push(cur().seq.slice()); cur().seq.length = 0; cur().seq.push('#'); continue; }
    const top = cur();
    if (top.close){ if (ch === '(' || ch === '{') top.depth++; if (ch === top.close){ if (top.depth === 0){ out.push([top.mark].concat(top.seq)); stack.pop(); continue; } top.depth--; } }
    if ('{}'.includes(ch)) continue;
    push(ch === '±' ? 'pm' : ch === '<' ? '⟨' : ch === '>' ? '⟩' : ch);
  }
  while (stack.length){ const t = stack.pop(); out.push([t.mark].concat(t.seq)); }
  return out;
}
const bi = {}, uni = {};
let N = 0;
for (const l of lines){
  for (const q of seqs(l)){
    for (let k = 0; k < q.length; k++){
      const c = q[k]; if (k === 0 && /^[S^_#r]$/.test(c)) continue;
      const p = k ? q[k - 1] : 'S';
      uni[c] = (uni[c] || 0) + 1; N++;
      const key = p + '\u0001' + c; bi[key] = (bi[key] || 0) + 1;
    }
  }
}
/* nur Paare mit mindestens 2 Belegen */
const B = {}; for (const [k, v] of Object.entries(bi)) if (v >= 2) B[k] = v;
const P = {}; for (const [k, v] of Object.entries(bi)){ const p = k.split('\u0001')[0]; P[p] = (P[p] || 0) + v; }
console.error('Lernzeilen', lines.length, 'Zeichen', N, 'Paare', Object.keys(B).length);
console.log(JSON.stringify({n:N, uni, prev:P, bi:B}));
