/* Strichzahl je Zeichenklasse aus CROHME-Trainingsausdrücken: P(n | Klasse), n = 1..4 (4 = vier und mehr).
   node test/ink/build_nstrokes.js /home/claude/ink/r-work/crohme_expr.json > nstrokes.json */
const fs = require('fs');
const D = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).train;
const MAP = {'\\alpha':'α', '\\beta':'β', '\\gamma':'γ', '\\theta':'θ', '\\lambda':'λ', '\\mu':'μ', '\\pi':'π', '\\sigma':'σ', '\\phi':'φ', '\\Delta':'Δ',
  '\\sum':'Σ', '\\int':'∫', '\\infty':'∞', '\\sqrt':'sqrt', '\\pm':'pm', '\\lt':'⟨', '\\gt':'⟩', '\\{':'{', '\\}':'}', '\\prime':"'"};
const C = {};
for (const ex of D) for (const s of ex.syms){ const c = MAP[s.lab] || s.lab; const n = Math.min(4, s.strokes.length); (C[c] = C[c] || [0, 0, 0, 0, 0])[n]++; }
const out = {};
for (const [c, a] of Object.entries(C)){ const tot = a[1] + a[2] + a[3] + a[4]; if (tot < 15) continue; out[c] = [1, 2, 3, 4].map(n => +((a[n] + 0.5) / (tot + 2)).toFixed(3)); }
console.log(JSON.stringify(out));
