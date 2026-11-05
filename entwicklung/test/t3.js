const E = require('./load.js');
function show(spec, title, lines, goal){
  const t0 = Date.now();
  let r;
  try { r = E.checkTask(spec, goal, lines); } catch(e){ console.log('==', title, 'EXCEPTION', e.stack.split('\n').slice(0,5).join(' | ')); return; }
  console.log('==', title, (Date.now()-t0)+'ms');
  r.lines.forEach((l, i) => console.log(' ', lines[i].padEnd(50), l.status, (l.msg||''), (l.steps||[]).map(s => s.status + (s.msg ? ':' + s.msg : '') + (s.msgs && s.msgs.length ? ':' + s.msgs.join(' | ') : '')).join(' ; '), (l.msgs||[]).join(' ')));
  if (goal) console.log('  final:', JSON.stringify(r.final));
}
const spin = {rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}, states:{'χ':'1/sqrt(2)(|↑⟩ + i|↓⟩)'}, state:'χ'};
show(spin, 'Spin Kommutator', ['[S_x, S_y] = iħ S_z', '[σ_x, σ_y] = 2i σ_z', 'σ_x^2 = 1', 'S_x S_y = iħ/2 S_z', 'S_+ |↓⟩ = ħ|↑⟩', 'S_z = ħ/2 (1, 0; 0, -1)', '[S_x, S_y] = ħ S_z']);
show(spin, 'Spin Messung', ['⟨S_y⟩ = ⟨χ|S_y|χ⟩', '= ħ/2', '|⟨+x|χ⟩|^2 = 1/2', '|⟨+y|χ⟩|^2 = 1', 'ΔS_x = ħ/2'], null);
const prec = {rep:'mat', mat:{preset:'spin', mats:{H:'ω S_z'}}, coords:['t'], params:{ω:'pos'}, states:{'χ':'1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)'}, state:'χ'};
show(prec, 'Präzession', ['iħ d/dt |χ⟩ = H|χ⟩', '⟨S_x⟩ = ħ/2 cos(ωt)', '⟨S_y⟩ = ħ/2 sin(ωt)', '|χ⟩ = e^(-iHt/ħ) 1/sqrt(2)(|↑⟩ + |↓⟩)'], null);
const osc = {rep:'mat', mat:{preset:'osc'}, coords:['t'], params:{m:'pos', ω:'pos', n:{int:[0,5]}}, states:{}, sumFrom:0};
show(osc, 'Oszillator', ['[a, a†] = 1', 'a†|n⟩ = sqrt(n+1)|n+1⟩', 'a|n⟩ = sqrt(n)|n-1⟩', 'H|n⟩ = ħω(n + 1/2)|n⟩', '⟨n|x^2|n⟩ = ħ/(2mω) ⟨n|(a + a†)^2|n⟩', '= ħ/(2mω)(2n+1)', '⟨n|x|n⟩ = 0', 'x = sqrt(ħ/(2mω))(a + a†)', '[x, p] = iħ', '[H, a] = -ħω a'], null);
const jm = {rep:'mat', mat:{preset:'jm'}, coords:['t'], params:{l:{int:[0,3]}, m:{int:[-3,3], range:['-l','l']}}};
show(jm, 'Drehimpuls', ['L_+|l,m⟩ = ħ sqrt(l(l+1) - m(m+1)) |l,m+1⟩', 'L^2|l,m⟩ = ħ^2 l(l+1)|l,m⟩', '[L_x, L_y] = iħ L_z', '[L^2, L_z] = 0', 'L_z|l,m⟩ = ħ m|l,m⟩', '[L_z, L_+] = ħ L_+', 'L_+ L_- = L^2 - L_z^2 + ħ L_z'], null);
const sph = {coords:['r','θ','φ'], params:{}, abstract:{f:{args:['r','θ','φ']}}};
show(sph, 'Kugelkoordinaten', ['L_z Y_1^1(θ,φ) = ħ Y_1^1(θ,φ)', 'L̂^2 Y_2^1(θ,φ) = 6ħ^2 Y_2^1(θ,φ)', '[L̂_x, L̂_y] f = iħ L̂_z f', '[L̂^2, L̂_z] f = 0', 'L̂_+ Y_1^0(θ,φ) = ħ sqrt(2) Y_1^1(θ,φ)', 'Y_1^0(θ,φ) = sqrt(3/(4π)) cos(θ)', '∫_0^π ∫_0^{2π} |Y_1^1(θ,φ)|^2 sin(θ) dφ dθ = 1'], null);
const hyd = {coords:['r'], space:['r'], radial:true, params:{a_0:'pos', m:'pos'}, defs:{'R(r)':'2 a_0^(-3/2) e^(-r/a_0)', 'ψ(r)':'R(r)'}, state:'ψ'};
show(hyd, 'Wasserstoff', ['∫_0^∞ |R(r)|^2 r^2 dr = 1', '⟨r⟩ = 4/a_0^3 ∫_0^∞ r^3 e^(-2r/a_0) dr', '= 4/a_0^3 · 3!/(2/a_0)^4', '= 3/2 a_0', '⟨1/r⟩ = 1/a_0'], null);
