const E = require('./load.js');
function show(spec, title, lines, goal){
  const t0 = Date.now();
  let r;
  try { r = E.checkTask(spec, goal, lines); } catch(e){ console.log('==', title, 'EXCEPTION', e.stack.split('\n').slice(0,4).join(' | ')); return; }
  console.log('==', title, (Date.now()-t0)+'ms');
  r.lines.forEach((l, i) => console.log(' ', lines[i].padEnd(50), l.status, (l.msg||''), (l.steps||[]).map(s => s.status + (s.msg ? ':' + s.msg : '') + (s.msgs && s.msgs.length ? ':' + s.msgs.join(' | ') : '')).join(' ; '), (l.msgs||[]).join(' ')));
  console.log('  final:', JSON.stringify(r.final));
}
const free = {coords:['x'], params:{m:'pos'}, abstract:{f:{args:['x']}}};
show(free, 'Kommutator [x,p]', ['[x̂, p̂] f = x̂ p̂ f - p̂ x̂ f', '= x(-iħ f\') - (-iħ)(x f)\'', '= -iħ x f\' + iħ (f + x f\')', '= iħ f'], {type:'show', from:'[x̂,p̂]f', to:'iħ f'});
show(free, 'Kommutator falsch', ['[x̂, p̂] f = x(-iħ f\') - (-iħ)(x f)\'', '= -iħ x f\' + iħ x f\'', '= 0'], {type:'show', from:'[x̂,p̂]f', to:'iħ f'});
show(free, 'Kommutator zu kurz', ['[x̂, p̂] f = iħ f'], {type:'show', from:'[x̂,p̂]f', to:'iħ f'});
show(free, 'Operatorgleichung', ['[x̂, p̂] = iħ', '[x̂, p̂^2] = 2iħ p̂', '[x̂, p̂^2] = 2 ħ^2 d/dx'], null);
const well = {coords:['x'], domain:{x:['0','L']}, params:{L:'pos', m:'pos', n:{int:[1,5]}}, defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)', 'V(x)':'0'}, unknowns:{E:{ref:'n^2 π^2 ħ^2/(2m L^2)'}}};
show(well, 'Eigenwert Topf', ['Ĥψ_n = -ħ^2/(2m) d^2/dx^2 ψ_n', '= -ħ^2/(2m) · (-(nπ/L)^2) ψ_n', '= n^2π^2ħ^2/(2mL^2) ψ_n', 'E = n^2π^2ħ^2/(2mL^2)'], {type:'solve', unknown:'E'});
show(well, 'Orthonormal', ['⟨ψ_n|ψ_n⟩ = 2/L ∫_0^L sin^2(nπx/L) dx', '= 2/L · L/2', '= 1'], {type:'value', target:'1'});
const well2 = {coords:['x'], domain:{x:['0','L']}, params:{L:'pos', m:'pos', n:{int:[1,4]}, k:{int:[1,4], ne:'n'}}, defs:{'ψ_j(x)':'sqrt(2/L) sin(jπx/L)'}, basis:{fam:'ψ'}};
show(well2, 'Orthogonal', ['⟨ψ_n|ψ_k⟩ = 2/L ∫_0^L sin(nπx/L) sin(kπx/L) dx', '= 1/L ∫_0^L (cos((n-k)πx/L) - cos((n+k)πx/L)) dx', '= 0'], {type:'value', target:'0'});
show(well2, 'Ket mit Index', ['⟨n|k⟩ = 0', '⟨n|n⟩ = 1', '⟨n|x̂|n⟩ = L/2'], null);
const dyn = {coords:['x','t'], params:{m:'pos'}, abstract:{ψ:{args:['x','t']}, V:{args:['x'], real:true}}, dyn:{fn:'ψ'}};
show(dyn, 'Kontinuitätsgleichung', ['∂/∂t |ψ|^2 = ψ^* ∂ψ/∂t + ψ ∂ψ^*/∂t', '= ψ^* (iħ/(2m) ∂^2ψ/∂x^2 - i/ħ V ψ) + ψ (-iħ/(2m) ∂^2ψ^*/∂x^2 + i/ħ V ψ^*)', '= iħ/(2m) (ψ^* ∂^2ψ/∂x^2 - ψ ∂^2ψ^*/∂x^2)', '= -∂/∂x (ħ/(2mi) (ψ^* ∂ψ/∂x - ψ ∂ψ^*/∂x))'], {type:'show', from:'∂/∂t |ψ|^2', to:'-∂/∂x (ħ/(2mi) (ψ^* ∂ψ/∂x - ψ ∂ψ^*/∂x))'});
show(dyn, 'SG ohne V falsch', ['∂ψ/∂t = iħ/(2m) ∂^2ψ/∂x^2'], null);
