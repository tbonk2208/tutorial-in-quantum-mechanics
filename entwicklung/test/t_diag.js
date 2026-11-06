/* Fehlerbibliothek (Gutachten E5): je Fehltyp mindestens ein Fall mit erwarteter Meldung + Gegenfälle ohne Meldung.
   Außerdem: Folgefehler mit schon bestimmter Unbekannter (E5.2) und Ket-Label „| + x⟩“.
   Aufruf: node test/t_diag.js [-v] */
const fs = require('fs'), path = require('path');
const ls = d => fs.readdirSync(path.join(__dirname, '..', d)).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(path.join(__dirname, '..', d, f), 'utf8'));
const E = new Function(ls('src/engine').join('\n;\n') + '\n;\n' + ls('src/content').join('\n;\n') + '\n;return {TOPICS, LEX, checkTask, parseLine, texLine, DG_MSG:typeof DG_MSG !== "undefined" ? DG_MSG : {}};')();
const VERB = process.argv.includes('-v');
let nOk = 0, nBad = 0;
const lexHas = id => E.LEX.some(e => e.id === id);
const fail = (name, why, r) => { nBad++; console.log('FEHLER', name, '–', why); if (r) r.lines.forEach((l, i) => console.log('    #' + (i + 1), l.status, l.lex || '', msgsOf(l).join(' | ').slice(0, 220))); };
const msgsOf = l => [l.msg, ...(l.steps || []).flatMap(s => [s.msg, ...(s.msgs || [])]), ...(l.msgs || [])].filter(Boolean);
const pass = (name, r) => { nOk++; if (VERB){ console.log('ok    ', name); r && r.lines.forEach((l, i) => console.log('    #' + (i + 1), l.status, l.lex || '', msgsOf(l).join(' | ').slice(0, 200))); } };

/* Zeile `at` (Standard: letzte) muss falsch sein und eine Meldung mit `re` tragen; lex wie erwartet (falls die id im Lexikon existiert) */
function expectMsg(name, ctx, goal, lines, re, lex, at){
  let r; try { r = E.checkTask(ctx, goal || {type:'free'}, lines, 't_diag'); } catch(e){ return fail(name, 'Ausnahme ' + e.message); }
  const i = at === undefined ? lines.length - 1 : at;
  const L = r.lines[i];
  if (!L || L.status !== 'wrong') return fail(name, 'Zeile ' + (i + 1) + ' nicht als falsch erkannt', r);
  const m = msgsOf(L).join(' | ');
  if (!re.test(m)) return fail(name, 'Meldung passt nicht zu ' + re, r);
  const want = lex && lexHas(lex) ? lex : undefined;
  if (L.lex !== want) return fail(name, 'lex = ' + L.lex + ', erwartet ' + want, r);
  pass(name, r);
}
/* Ergebnis (final) falsch mit Meldung */
function expectFinal(name, ctx, goal, lines, re, lex){
  let r; try { r = E.checkTask(ctx, goal, lines, 't_diag'); } catch(e){ return fail(name, 'Ausnahme ' + e.message); }
  if (!r.final || r.final.state !== 'wrong' || !re.test(r.final.msg || '')) return fail(name, 'final = ' + JSON.stringify(r.final), r);
  const want = lex && lexHas(lex) ? lex : undefined;
  if (r.final.lex !== want) return fail(name, 'final.lex = ' + r.final.lex + ', erwartet ' + want, r);
  pass(name, r);
}
/* alle Zeilen richtig, keine Meldung, kein lex */
function expectClean(name, ctx, goal, lines){
  let r; try { r = E.checkTask(ctx, goal || {type:'free'}, lines, 't_diag'); } catch(e){ return fail(name, 'Ausnahme ' + e.message); }
  const bad = r.lines.findIndex(l => !['ok', 'def', 'info'].includes(l.status) || l.lex || (l.steps || []).some(s => (s.msgs || []).length));
  if (bad >= 0) return fail(name, 'Zeile ' + (bad + 1) + ' nicht sauber', r);
  pass(name, r);
}
/* Zeile `at` muss falsch sein und darf NICHT die Meldung `re` tragen (Schutz gegen Fehldiagnosen) */
function expectNot(name, ctx, goal, lines, re, at){
  let r; try { r = E.checkTask(ctx, goal || {type:'free'}, lines, 't_diag'); } catch(e){ return fail(name, 'Ausnahme ' + e.message); }
  const i = at === undefined ? lines.length - 1 : at;
  const L = r.lines[i];
  if (!L || L.status !== 'wrong') return fail(name, 'Zeile ' + (i + 1) + ' nicht als falsch erkannt', r);
  if (re.test(msgsOf(L).join(' | '))) return fail(name, 'unerwartete Meldung ' + re, r);
  pass(name, r);
}

/* ---------- Kontexte ---------- */
const BOX_A = () => ({coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'}, defs:{'ψ(x)':'A x (L - x)'}, unknowns:{A:{ref:'sqrt(30/L^5)', alt:['-sqrt(30/L^5)']}}});
const BOX_N = () => ({coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'}, defs:{'ψ(x)':'sqrt(30/L^5) x (L - x)'}, normalized:true});
const BOX_C = () => ({coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', k:'pos'}, defs:{'ψ(x)':'e^(i k x) x (L - x)'}});
const RADC = () => ({coords:['r'], space:['r'], radial:true, params:{a_0:'pos', m:'pos'}, defs:{'R(r)':'2 a_0^(-3/2) e^(-r/a_0)'}, state:'R'});
const SPH3 = () => ({coords:['r', 'θ', 'φ'], params:{a_0:'pos', m:'pos'}, defs:{'ψ(r)':'A e^(-r/a_0)'}, unknowns:{A:{ref:'1/sqrt(π a_0^3)', alt:['-1/sqrt(π a_0^3)']}}});
const ANG = () => ({coords:['θ', 'φ'], space:['θ', 'φ'], measure:'sin(θ)', params:{}, defs:{'Y(θ,φ)':'sqrt(3/(4π)) cos(θ)'}});
const FREE = () => ({coords:['x'], params:{k:'pos', m:'pos'}, defs:{'ψ(x)':'e^(i k x)'}});
const TIME = () => ({coords:['x', 't'], params:{ω:'pos', k:'pos'}});
const STEP = () => ({coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['1.3 V_0', '3 V_0']}}, defs:{k:'sqrt(2m E)/ħ', q:'sqrt(2m (E - V_0))/ħ'}, unknowns:{B:{ref:'(k - q)/(k + q)', kind:'real'}, C:{ref:'2k/(k + q)', kind:'real'}}});
const COEF = () => ({coords:['x'], params:{c_1:'complex'}});
const SPIN = () => ({rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}, states:{χ:'(3/5; 4/5)'}, state:'χ'});
const solveA = {type:'solve', unknown:'A'};
const knownA = {type:'free', known:['A']};

/* ---------- 1. |ψ|² → ψ ---------- */
expectMsg('ψ statt |ψ|² im Erwartungswert (Gutachten-Fall)', BOX_A(), knownA, ['⟨x⟩ = ∫_0^L x ψ dx'], /Erwartungswert wird mit \$\|\\psi\|\^2\$ gewichtet/, 'erwartungswert');
expectMsg('ψ statt |ψ|² im Erwartungswert (normiert)', BOX_N(), null, ['⟨x⟩ = ∫_0^L x ψ(x) dx'], /Erwartungswert wird mit/, 'erwartungswert');
expectMsg('ψ statt |ψ|² beim Normieren', BOX_A(), solveA, ['∫_0^L ψ dx = 1'], /Normiert wird \$\|\\psi\|\^2\$/, 'normierung');
expectMsg('ψ statt |ψ|² bei einer Wahrscheinlichkeit', BOX_N(), null, ['∫_0^{L/4} ψ dx = 53/512'], /Wahrscheinlichkeiten kommen aus/, 'born');
expectMsg('ψ statt |ψ|² radial', RADC(), null, ['⟨r⟩ = ∫_0^∞ r R(r) r^2 dr'], /Erwartungswert wird mit/, 'erwartungswert');
/* ψ² statt |ψ|² */
expectMsg('ψ² statt |ψ|² (komplexes ψ)', BOX_C(), null, ['∫_0^L ψ^2 dx = L^5/30'], /\\psi\^2\$ ist hier nicht/, 'komplexe-zahlen');
/* ---------- 2. fehlende Konjugation ---------- */
expectMsg('ψ statt ψ* im Erwartungswert', BOX_C(), null, ['⟨x⟩ = 30/L^5 ∫_0^L ψ x ψ dx'], /fehlt die komplexe Konjugation/, 'komplexe-zahlen');
expectMsg('Vorzeichen im Exponenten (Ort)', FREE(), null, ['d/dx e^(i k x) = i k e^(-i k x)'], /Vorzeichen im Exponenten/, 'komplexe-zahlen');
expectMsg('Vorzeichen im Exponenten (Zeit)', TIME(), null, ['d/dt e^(-i ω t) = -i ω e^(i ω t)'], /Zeitentwicklung ist/, 'zeitentwicklung');
expectMsg('Konjugation in der Stromdichte (ψ und ψ\')', {coords:['x'], params:{A:'pos', B:'pos', k:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(i k x) + B e^(-i k x)'}}, null, ['ħ k (A^2 - B^2)/m = ħ/(2m i) (ψ ψ\' - ψ ψ\')'], /Stromdichte/, 'komplexe-zahlen');
/* rein imaginär und negiert: keine Behauptung „Vorzeichen im Exponenten“ (es ist ein Vorzeichenfehler) */
expectNot('−e^{iπ/2}: nicht „Exponent“', {coords:['x'], params:{}}, null, ['i = -e^(iπ/2)'], /Exponenten/);
expectNot('−(Fourier-Integral, reell und ungerade): nicht „Exponent“', {coords:['x'], params:{n:{int:[1, 3]}}}, null, ['∫_-π^π x e^(-i n x) dx = -∫_-π^π x e^(-i n x) dx'], /Exponenten/);
/* ---------- 3. |c_n|² → |c_n| ---------- */
expectFinal('|c_n| statt |c_n|²', COEF(), {type:'value', target:'|c_1|^2'}, ['|c_1|'], /Betragsquadrat: \$P_n = \|c_n\|\^2\$/, 'messpostulat');
expectFinal('c_n statt |c_n|²', COEF(), {type:'value', target:'|c_1|^2'}, ['c_1'], /nicht die Amplitude \$c_n\$/, 'messpostulat');
expectMsg('|⟨a|ψ⟩| statt |⟨a|ψ⟩|² (Spin)', SPIN(), null, ['|⟨↑|χ⟩| = 9/25'], /\\langle a\|\\psi\\rangle\|\^2\$, nicht/, 'messpostulat');
/* ---------- 4. Volumenelement ---------- */
expectMsg('r² fehlt (Normierung radial)', RADC(), null, ['∫_0^∞ |R(r)|^2 dr = 1'], /fehlt \$r\^2\$/, 'kugelkoordinaten');
expectMsg('r² fehlt (Erwartungswert)', RADC(), null, ['⟨r⟩ = ∫_0^∞ r |R(r)|^2 dr'], /fehlt \$r\^2\$/, 'kugelkoordinaten');
expectMsg('sin θ fehlt', ANG(), null, ['∫_0^{2π} ∫_0^π |Y|^2 dθ dφ = 1'], /fehlt \$\\sin\\theta\$/, 'kugelkoordinaten');
expectMsg('r² und sin θ fehlen', SPH3(), solveA, ['∫_0^∞ ∫_0^π ∫_0^{2π} |ψ(r)|^2 dφ dθ dr = 1'], /fehlen \$r\^2\$ und \$\\sin\\theta\$/, 'kugelkoordinaten');
/* ---------- 5. Winkelintegral 4π, 2π ---------- */
expectMsg('Faktor 4π fehlt', SPH3(), solveA, ['|A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1'], /Winkelanteil \$4\\pi\$/, 'kugelkoordinaten');
expectMsg('Faktor 2π fehlt', ANG(), null, ['∫_0^π |Y|^2 sin(θ) dθ = 1'], /Faktor \$2\\pi\$ aus/, 'kugelkoordinaten');
/* ---------- 6. Vorzeichen, Faktor 2, i ---------- */
expectMsg('Vorzeichenfehler', TIME(), null, ['d/dx cos(k x) = k sin(k x)'], /Vorzeichenfehler/, null);
expectMsg('Faktor 2', TIME(), null, ['d/dx sin(k x)^2 = k sin(k x) cos(k x)'], /Faktor 2/, null);
expectMsg('Faktor 1/2', TIME(), null, ['∫_0^1 x dx = 1'], /Faktor 2/, null);
expectMsg('Faktor i fehlt', FREE(), null, ['d/dx e^(i k x) = k e^(i k x)'], /Faktor i/, 'komplexe-zahlen');
/* ---------- 7. ħ ---------- */
expectMsg('ħ fehlt', FREE(), null, ['p̂ ψ = k ψ'], /Faktor \$\\hbar\$/, null);
expectMsg('−iħ fehlt', FREE(), null, ['p̂ ψ = d/dx ψ'], /Faktor \$-i\\hbar\$/, null);
expectMsg('ħ-Potenz falsch', FREE(), null, ['Ĥ ψ = k^2/(2m) ψ'], /Potenz von \$\\hbar\$/, null);
/* ---------- 8. Transmission ohne q/k ---------- */
expectMsg('T ohne q/k', STEP(), null, ['|C|^2 = 4k q/(k + q)^2'], /fehlt der Faktor \$q\/k\$/, 'reflexion-transmission');
/* ---------- 9. vertauschte Grenzen ---------- */
expectMsg('Grenzen vertauscht (Integral)', BOX_N(), null, ['∫_L^0 |ψ|^2 dx = 1'], /Integrationsgrenzen sind vertauscht/, null);
expectMsg('Grenzen vertauscht (Auswertungsklammer)', BOX_N(), null, ['∫_0^L x dx = [x^2/2]_L^0'], /Auswertungsklammer sind vertauscht/, null);
/* Schutz: Vorzeichenfehler bei richtig herum geschriebenen Grenzen ist kein Grenzen-Fehler */
expectNot('Vorzeichen im Integranden ≠ Grenzen', BOX_N(), null, ['⟨p^2⟩ = ∫_0^L ψ ħ^2 ψ\'\' dx'], /Grenzen/);

/* ---------- Gegenfälle: richtige Zeilen ohne Meldung ---------- */
expectClean('richtig: Erwartungswert mit |ψ|²', BOX_A(), knownA, ['⟨x⟩ = ∫_0^L x |ψ|^2 dx', '= |A|^2 ∫_0^L x^3 (L - x)^2 dx']);
expectClean('richtig: ∫ x ψ dx ausgerechnet', BOX_A(), knownA, ['∫_0^L x ψ dx = A L^4/12']);
expectClean('richtig: Normierung', BOX_A(), solveA, ['∫_0^L |ψ|^2 dx = 1', '|A|^2 L^5/30 = 1', 'A = sqrt(30/L^5)']);
expectClean('richtig: komplexes ψ', BOX_C(), null, ['∫_0^L |ψ|^2 dx = L^5/30', '∫_0^L ψ^* ψ dx = L^5/30']);
expectClean('richtig: radial mit r²', RADC(), null, ['∫_0^∞ |R(r)|^2 r^2 dr = 1', '⟨r⟩ = ∫_0^∞ r |R(r)|^2 r^2 dr', '= 3a_0/2']);
expectClean('richtig: Kugel', SPH3(), solveA, ['∫_0^∞ ∫_0^π ∫_0^{2π} |ψ(r)|^2 r^2 sin(θ) dφ dθ dr = 1', '4π |A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1', '4π |A|^2 a_0^3/4 = 1', 'A = 1/sqrt(π a_0^3)']);
expectClean('richtig: Impuls', FREE(), null, ['p̂ ψ = ħ k ψ', 'Ĥ ψ = ħ^2 k^2/(2m) ψ', 'd/dx e^(i k x) = i k e^(i k x)']);
expectClean('richtig: Transmission', STEP(), null, ['q/k |C|^2 = 4k q/(k + q)^2']);
expectClean('richtig: Grenzen', BOX_N(), null, ['∫_0^L |ψ|^2 dx = 1', '∫_L^0 |ψ|^2 dx = -1']);
expectClean('richtig: Spin', SPIN(), null, ['|⟨↑|χ⟩|^2 = 9/25']);

/* ---------- Folgefehler mit schon bestimmter Unbekannter (E5.2) ---------- */
{
  const ctx = BOX_A();
  const gB = {type:'value', target:'L/2', known:['A']};
  const r = E.checkTask(ctx, gB, ['⟨x⟩ = ∫_0^L x ψ dx', '= L/2'], 't_diag');
  if (r.lines[1].status === 'folge') fail('Folge: „= L/2“ bei bekanntem A', 'als folgerichtig markiert', r); else if (r.lines[1].status !== 'wrong') fail('Folge: „= L/2“ bei bekanntem A', 'Status ' + r.lines[1].status, r); else pass('Folge: „= L/2“ bei bekanntem A ist falsch', r);
  const r2 = E.checkTask(ctx, gB, ['⟨x⟩ = ∫_0^L x ψ dx', '∫_0^L x ψ dx = L/2'], 't_diag');
  if (r2.lines[1].status !== 'wrong') fail('Folge: neue Zeile „∫xψ = L/2“ bei bekanntem A', 'Status ' + r2.lines[1].status, r2); else pass('Folge: neue Zeile „∫xψ = L/2“ bei bekanntem A ist falsch', r2);
  // A unbekannt (Teil a): echte Folgefehler bleiben folgerichtig
  const r3 = E.checkTask(ctx, solveA, ['∫_0^L ψ dx = 1', 'A L^3/6 = 1', 'A = 6/L^3'], 't_diag');
  if (r3.lines[1].status !== 'folge' || r3.lines[2].status !== 'folge') fail('Folge: A noch unbekannt', 'nicht folgerichtig', r3); else pass('Folge: bei unbekanntem A bleibt der Folgefehler folgerichtig', r3);
  // Ergebnis aus der falschen Zeile umgeschrieben (A bekannt): weiterhin folgerichtig
  const r4 = E.checkTask(ctx, gB, ['∫_0^L x |ψ|^2 dx = |A|^2 L^6/50', '⟨x⟩ = |A|^2 L^6/50'], 't_diag');
  if (r4.lines[1].status !== 'folge') fail('Folge: Umschreiben des falschen Ergebnisses', 'Status ' + r4.lines[1].status, r4); else pass('Folge: Umschreiben des falschen Ergebnisses bleibt folgerichtig', r4);
  // aus den Inhalten: wf-p1 b) (A in Teil a bestimmt) – automatisch erkannt
  const t = E.TOPICS.find(x => x.id === 'wf'); const task = t && t.practice.find(k => k.id === 'wf-p1'); const g = task && task.goals.find(x => x.id === 'b');
  if (!g) console.log('(wf-p1 b nicht gefunden – Inhaltsfall übersprungen)');
  else {
    const r5 = E.checkTask(task.ctx, g, ['⟨x⟩ = ∫_0^L x ψ dx', '= L/2'], 'wf-p1:b');
    if (r5.lines[1].status !== 'wrong' || !/Erwartungswert wird mit/.test(msgsOf(r5.lines[0]).join('|'))) fail('Inhalt wf-p1 b', 'nicht wie erwartet', r5); else pass('Inhalt wf-p1 b: Meldung |ψ|², „= L/2“ nicht folgerichtig', r5);
  }
}

/* ---------- Ket-Label mit Leerzeichen ---------- */
{
  const S = s => E.texLine(E.parseLine(s, {}));
  const same = [['| + x⟩', '|+x⟩'], ['|+ x⟩', '|+x⟩'], ['| - y⟩', '|-y⟩'], ['⟨ + x|χ⟩', '⟨+x|χ⟩'], ['⟨+x| + x⟩', '⟨+x|+x⟩'], ['⟨-y|S_z| + y⟩', '⟨-y|S_z|+y⟩']];
  for (const [a, b] of same){ let ta, tb; try { ta = S(a); tb = S(b); } catch(e){ fail('Parser ' + a, e.message); continue; } if (ta !== tb) fail('Parser ' + a, ta + ' ≠ ' + tb); else pass('Parser ' + a + ' = ' + b); }
  const abs = [['| - x|', '|-x|'], ['|-x|', '|-x|']];
  for (const [a] of abs){ try { const ln = E.parseLine(a, {}); if (ln.stmts[0].parts[0].t !== 'abs') fail('Parser ' + a, 'kein Betrag'); else pass('Parser ' + a + ' ist ein Betrag'); } catch(e){ fail('Parser ' + a, e.message); } }
  const r = E.checkTask(SPIN(), {type:'free'}, ['⟨+x| + x⟩ = 1', '| - x⟩ = (|↑⟩ - |↓⟩)/sqrt(2)'], 't_diag');
  if (r.lines.some(l => l.status !== 'ok')) fail('Spin mit Leerzeichen', 'nicht richtig', r); else pass('Spin mit Leerzeichen wird richtig ausgewertet', r);
}

/* ---------- Zusatzwünsche der Inhalts-Agenten (Notation) ---------- */
{
  const SPINH = () => ({rep:'mat', mat:{preset:'spin', mats:{"H'":'(0, 1; 1, 0)'}}, coords:['t'], params:{}, states:{χ:'(3; 4i)'}});
  // (a) Summe von Projektoren mit nacktem Ket nach „+“
  expectClean('(a) 3|+x⟩⟨+x| + |-x⟩⟨-x|', SPINH(), null, ['3 |+x⟩⟨+x| + |-x⟩⟨-x| = 2 + σ_x', '|+x⟩⟨+x| - |-x⟩⟨-x| = σ_x', '⟨+x| + x⟩ = 1']);
  expectNot('(a) falscher Projektor erkannt', SPINH(), null, ['|+x⟩⟨+x| + |-x⟩⟨-x| = σ_x'], /§§§/);
  // (b) gestrichener Matrixname
  expectClean("(b) H' als Matrix", SPINH(), null, ["H' |↑⟩ = |↓⟩", "⟨↑|H'|↓⟩ = 1", "H'^2 = 1"]);
  { let r; try { r = E.checkTask(SPINH(), {type:'free'}, ["G' = 1"], 't_diag'); } catch(e){ r = null; } if (!r || r.lines[0].status === 'ok') fail("(b) unbekanntes G' nicht als Matrix", 'Status ' + (r && r.lines[0].status)); else pass("(b) unbekanntes G' bleibt unbekannt"); }
  // (c) E^(1), E^(2) als eigene Namen
  const PT = () => ({coords:['x'], params:{λ:'pos', m:'pos'}});
  expectClean('(c) E^(1) und E^(2) getrennt', PT(), null, ['E^(1) = 3λ', 'E^(2) = -λ^2', 'E^(1) + E^(2) = 3λ - λ^2', 'E^{(1)} = 3λ']);
  expectMsg('(c) E^(2) ist nicht E^(1)', PT(), null, ['E^(1) = 3λ', 'E^(2) = -λ^2', 'E^(2) = 3λ'], /./, null);
  // (d) Norm
  const NB = () => ({coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'}, defs:{'ψ(x)':'sqrt(30/L^5) x (L - x)', 'f(x)':'x'}});
  expectClean('(d) Norm einer Funktion', NB(), null, ['‖ψ‖ = 1', '‖ψ‖^2 = ⟨ψ|ψ⟩', '‖f‖ = sqrt(L^3/3)', '‖|ψ⟩‖ = 1', '‖3 - 4i‖ = 5', '\\|f\\| = sqrt(L^3/3)', '∥f∥ = sqrt(L^3/3)']);
  expectMsg('(d) falsche Norm erkannt', NB(), null, ['‖f‖ = L^3/3'], /Betragsquadrat/, 'born');
  expectClean('(d) Norm eines Spinors', SPINH(), null, ['‖χ‖ = 5', '‖|+x⟩‖ = 1', '‖(1; i)‖ = sqrt(2)', '‖χ‖^2 = ⟨χ|χ⟩']);
  { let ok = false; try { E.parseLine('‖f', {}); } catch(e){ ok = /Normstrich/.test(e.message); } if (ok) pass('(d) fehlender Normstrich: Lesefehler'); else fail('(d) fehlender Normstrich', 'kein Lesefehler'); }
}

/* ---------- alle Meldungen der Bibliothek lassen sich mit KaTeX setzen ---------- */
{
  let katex = null; try { katex = require('/opt/npm-tools/node_modules/katex'); } catch(e){}
  if (katex){
    let bad = 0;
    for (const [k, m] of Object.entries(E.DG_MSG)) for (const x of String(m).matchAll(/\$([^$]+)\$/g)){ try { katex.renderToString(x[1], {throwOnError:true, strict:'ignore'}); } catch(e){ bad++; fail('KaTeX ' + k, e.message.slice(0, 80)); } }
    if (!bad) pass('KaTeX: ' + Object.keys(E.DG_MSG).length + ' Meldungen');
  }
}
/* ---------- lex-ids der Bibliothek existieren ---------- */
{
  const ids = ['erwartungswert', 'normierung', 'born', 'komplexe-zahlen', 'zeitentwicklung', 'messpostulat', 'kugelkoordinaten', 'reflexion-transmission'];
  const miss = ids.filter(id => !lexHas(id));
  if (miss.length) console.log('Hinweis: Lexikon-Einträge fehlen (lex bleibt dann leer):', miss.join(', '));
}
console.log('t_diag:', nOk, 'bestanden,', nBad, 'fehlgeschlagen');
process.exit(nBad ? 1 : 0);
