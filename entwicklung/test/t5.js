const E = require('./load.js');
function show(spec, title, lines, goal){
  let r;
  try { r = E.checkTask(spec, goal, lines); } catch(e){ console.log('==', title, 'EXCEPTION', e.stack.split('\n').slice(0,5).join(' | ')); return; }
  console.log('==', title);
  r.lines.forEach((l, i) => console.log(' ', lines[i].padEnd(44), l.status, (l.msg||''), (l.steps||[]).map(s => s.status + (s.msg ? ':' + s.msg : '') + (s.msgs && s.msgs.length ? ':' + s.msgs.join(' | ') : '')).join(' ; '), l.tex || ''));
  if (goal) console.log('  final:', JSON.stringify(r.final));
}
const spin = {rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}};
show(spin, 'bra +x', ['|⟨↓|+x⟩|^2 = 1/2', '⟨-x|+x⟩ = 0']);
const s2 = {rep:'mat', mat:{preset:'spin2'}, coords:['t'], params:{}};
show(s2, 'spin2', ['S_1z |↑↓⟩ = ħ/2 |↑↓⟩', 'S_{2z} |↑↓⟩ = -ħ/2 |↑↓⟩', 'S^2 |0, 0⟩ = 0', 'S^2|1,0⟩ = 2ħ^2 |1,0⟩', 'S_z |1,1⟩ = ħ|1,1⟩']);
const jm = {rep:'mat', mat:{preset:'jm'}, coords:['t'], params:{}};
show(jm, 'ket 1,0', ['L_+|1,0⟩ = sqrt(2) ħ |1,1⟩', 'x = 0,5']);
const free = {coords:['x'], params:{m:'pos', α:'pos'}};
show(free, 'd/dα', ['d/dα (α^2) = 2α']);
const g = {coords:['x'], params:{m:'pos'}, abstract:{f:{args:['x']}}};
show(g, 'Randterm ∞', ['∫_-∞^∞ f^* f\' dx = [|f|^2]_-∞^∞ - ∫_-∞^∞ f'+"'"+'^* f dx']);
show({coords:['x'], params:{m:'pos', k:'pos', q:'pos'}, unknowns:{T:{ref:'2k/(k+q)'}}}, 'T als Abkürzung & Kette', ['T = 2k/(k + q)']);
show({coords:['x'], params:{m:'pos', k:'pos', q:'pos'}, unknowns:{R:{ref:'(k-q)/(k+q)'}}}, 'Kette solve', ['R = (k - q)/(k + q) · 1', '= (k - q)/(k + q)'], {type:'solve', unknown:'R'});
show({coords:['x'], params:{m:'pos'}}, 'kinetisch T abk', ['T = 5', 'T + 1 = 6']);
show({rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{β:'pos'}, unknowns:{ε:{ref:'β', alt:['-β']}}}, '± beide', ['ε^2 = β^2', 'ε = ±β'], {type:'solve', unknown:'ε', both:true});
