const E = require('./load.js');
function show(spec, title, lines, goal){
  let r;
  try { r = E.checkTask(spec, goal, lines); } catch(e){ console.log('==', title, 'EXCEPTION', e.stack.split('\n').slice(0,5).join(' | ')); return; }
  console.log('==', title);
  r.lines.forEach((l, i) => console.log(' ', lines[i].padEnd(48), l.status, (l.msg||''), (l.steps||[]).map(s => s.status + (s.msg ? ':' + s.msg : '') + (s.msgs && s.msgs.length ? ':' + s.msgs.join(' | ') : '')).join(' ; ')));
  if (goal) console.log('  final:', JSON.stringify(r.final));
}
const box = {coords:['x'], domain:{x:['0','L']}, params:{L:'pos', m:'pos'}, defs:{'ψ(x)':'A x (L - x)'}, unknowns:{A:{ref:'sqrt(30/L^5)', alt:['-sqrt(30/L^5)']}}};
const G = {type:'solve', unknown:'A'};
show(box, 'Stammfunktion', ['|A|^2 [L^2 x^3/3 - L x^4/2 + x^5/5]_0^L = 1', 'A^2 L^5/30 = 1', 'A = (30/L^5)^(1/2)'], G);
show(box, '±', ['A^2 L^5/30 = 1', 'A = ±sqrt(30/L^5)'], G);
show(box, 'A statt A²', ['∫_0^L |ψ|^2 dx = 1', 'A ∫_0^L x^2 (L-x)^2 dx = 1', 'A L^5/30 = 1', 'A = 30/L^5'], G);
show(box, 'ohne Betrag Quadrat vergessen', ['∫_0^L ψ dx = 1'], G);
show(box, 'Integral falsch', ['|A|^2 ∫_0^L x^2 (L-x)^2 dx = 1', '|A|^2 (L^5/3 - L^5/2 + L^5/4) = 1'], G);
show(box, 'Grenzen falsch', ['|A|^2 ∫_-L^L x^2 (L-x)^2 dx = 1'], G);
show(box, 'Latex', ['\\int_0^L |\\psi|^2 \\, dx = 1', '|A|^2 \\frac{L^5}{30} = 1', 'A = \\sqrt{\\frac{30}{L^5}}'], G);
const g2 = {coords:['x'], params:{λ:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(-λ x^2)'}, unknowns:{A:{ref:'(2λ/π)^(1/4)', alt:['-(2λ/π)^(1/4)']}}};
show(g2, 'Gauß falsch Faktor', ['|A|^2 ∫_-∞^∞ e^(-2λ x^2) dx = 1', '|A|^2 sqrt(π/λ) = 1', 'A = (λ/π)^(1/4)'], G);
show(g2, 'Unbekanntes Symbol', ['|A|^2 β = 1', 'β = sqrt(π/(2λ))'], G);
show(g2, 'Abkürzung', ['α = 2λ', '|A|^2 sqrt(π/α) = 1', 'A = (α/π)^(1/4)'], G);
