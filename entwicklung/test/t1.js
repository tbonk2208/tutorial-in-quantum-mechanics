const E = require('./load.js');
const spec = {
  coords:['x'], domain:{x:['0','L']}, params:{L:'pos', m:'pos'},
  defs:{'ψ(x)':'A x (L - x)'}, unknowns:{A:{ref:'sqrt(30/L^5)', alt:['-sqrt(30/L^5)']}}, state:'ψ'
};
function show(title, lines, goal){
  const t0 = Date.now();
  const r = E.checkTask(spec, goal, lines);
  console.log('==', title, (Date.now()-t0)+'ms');
  r.lines.forEach((l, i) => console.log(' ', lines[i].padEnd(44), l.status, (l.msg||''), (l.steps||[]).map(s => s.status + (s.msg ? ':' + s.msg : '') + (s.msgs && s.msgs.length ? ':' + s.msgs.join(' | ') : '')).join(' ; ')));
  console.log('  final:', JSON.stringify(r.final));
}
show('Normierung richtig', ['∫_0^L |ψ|^2 dx = 1', '|A|^2 ∫_0^L x^2 (L-x)^2 dx = 1', '|A|^2 L^5/30 = 1', 'A = sqrt(30/L^5)'], {type:'solve', unknown:'A'});
show('Normierung mit Fehler', ['∫_0^L |ψ|^2 dx = 1', '|A|^2 ∫_0^L x^2 (L-x)^2 dx = 1', '|A|^2 L^5/20 = 1', 'A = sqrt(20/L^5)'], {type:'solve', unknown:'A'});
show('Erwartungswert x', ['⟨x⟩ = ∫_0^L x |ψ|^2 dx', '= 30/L^5 ∫_0^L x^3 (L-x)^2 dx', '= 30/L^5 · L^6/60', '= L/2'], {type:'value', target:'L/2'});
show('Erwartungswert p', ['⟨p⟩ = ∫_0^L ψ^* (-iħ) dψ/dx dx', '= -iħ A^2 ∫_0^L x(L-x)(L-2x) dx', '= 0'], {type:'value', target:'0'});
show('Varianz', ['⟨x^2⟩ = 30/L^5 ∫_0^L x^4 (L-x)^2 dx', '= 2L^2/7', 'Δx = sqrt(2L^2/7 - L^2/4)', '= L/sqrt(28)'], {type:'value', target:'L/sqrt(28)'});
show('Fehler Vorzeichen', ['⟨p^2⟩ = ∫_0^L ψ (-ħ^2) ψ\'\' dx', '= 2ħ^2 A^2 ∫_0^L x(L-x) dx', '= 2ħ^2 · 30/L^5 · L^3/6', '= 10 ħ^2/L^2'], {type:'value', target:'10ħ^2/L^2'});
