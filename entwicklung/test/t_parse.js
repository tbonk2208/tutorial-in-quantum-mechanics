const E = require('./load.js');
const katex = require('/opt/npm-tools/node_modules/katex');
const L = process.argv.slice(2).length ? process.argv.slice(2) : [
 "ψ(x) = A x (L - x)",
 "∫_0^L |ψ|^2 dx = 1",
 "|A|^2 ∫_0^L x^2(L-x)^2 dx = 1",
 "= |A|^2 L^5/30",
 "A = sqrt(30/L^5)",
 "⟨x⟩ = ∫_0^L x |ψ(x)|^2 dx",
 "[x̂, p̂]f = x(-iħ f') - (-iħ)(x f)'",
 "= -iħ x f' + iħ f + iħ x f'",
 "-ħ^2/2m d^2/dx^2 ψ = E ψ",
 "-ħ^2/(2m) ψ'' + V ψ = Eψ",
 "⟨n|â†â|n⟩ = n",
 "â†|n⟩ = sqrt(n+1)|n+1⟩",
 "[S_x, S_y] = iħ S_z",
 "|χ⟩ = 1/sqrt2 (|↑⟩ + |↓⟩)",
 "|⟨+x|χ⟩|^2 = 1/2",
 "e^(-iEt/ħ) ψ(x)",
 "∂ψ/∂t = iħ/2m ∂^2ψ/∂x^2",
 "∫_-∞^∞ e^(-a x^2) dx = sqrt(π/a)",
 "[x^2/2 - L sin(2πx/L)/(4π)]_0^L",
 "Σ_{n=1}^∞ |c_n|^2 = 1",
 "S_z = ħ/2 (1, 0; 0, -1)",
 "Δx Δp ≥ ħ/2",
 "k = sqrt(2mE)/ħ",
 "E_n = n^2 π^2 ħ^2/(2 m L^2)",
 "ψ^* ψ",
 "ψ*ψ",
 "ψ* ψ",
 "\\frac{\\hbar^2}{2m}\\int_0^L \\psi^* \\psi\\, dx",
 "E^(1) = ⟨ψ_n|H'|ψ_n⟩",
 "Y_1^0(θ,φ) = sqrt(3/(4π)) cos θ",
 "d/dx(xψ) = ψ + x dψ/dx",
 "δ_nm",
 "R_10(r) = 2 a0^(-3/2) e^(-r/a0)",
 "1/2 m ω^2 x^2",
 "sin kx cos kx",
 "e^ikx",
 "L_+|l,m⟩",
 "0,5 x",
 "∫_0^∞ ∫_0^π ∫_0^{2π} |ψ|^2 r^2 sin θ dφ dθ dr = 1",
];
let bad = 0;
for (const s of L){
  try {
    const ln = E.parseLine(s, {});
    const t = E.texLine(ln);
    katex.renderToString(t, {throwOnError:true});
    console.log('OK  ', s, '\n     ', t);
  } catch(e){ bad++; console.log('ERR ', s, '\n     ', e.message); }
}
console.log('fehler:', bad);
