/* Struktur-/Ausgabetests mit Orakel-Klassifikator (Zeichen bekannt): geprüft werden nur Gruppierung, Lage und Ausgabe.
   Jede Zeile wird aus ihrem Syntaxbaum gesetzt (synth.js), mit eigener Strichschrift (3 Startwerte) und – falls vorhanden –
   mit Zeichenformen fremder Schreiber (2 Startwerte) geschrieben, erkannt und mit der Erwartung verglichen
   (gleicher Text ohne Leerzeichen oder gleicher Syntaxbaum).  node test/ink/t_struct.js [--verbose] */
const fs = require('fs');
const lib = require('./lib.js'), syn = require('./synth.js');
const E = lib.load({model:'oracle', content:false});
const verbose = process.argv.includes('--verbose');
const BANKF = '/home/claude/ink/testdata/strokes_test.json';
let bank = null;
if (fs.existsSync(BANKF)){ bank = JSON.parse(fs.readFileSync(BANKF, 'utf8')); const MF = BANKF.replace('.json', '_meta.json'); if (fs.existsSync(MF)) Object.defineProperty(bank, '__meta', {value:JSON.parse(fs.readFileSync(MF, 'utf8')).samples}); }
const CASES = {
  'Bruch':          ['1/2', '(a + b)/(c - d)', 'ħ^2/(2m)', 'x = 3/4', '(1 - i)/2', '16L/(9π^2)'],
  'd/dx':           ['d/dx ψ', 'd/dx (x^2)', 'd/dt f(t) = 0', 'd/dk (ħ k^2/(2m))', '-iħ d/dx e^(ikx)'],
  'dψ/dx':          ['dψ/dx', 'dψ/dx = ik ψ', 'df/dt', 'dω/dk = v_g', 'dy/dx + y = 0'],
  '∂²/∂x²':         ['∂^2/∂x^2 ψ', '∂^2ψ/∂x^2', '∂/∂t Ψ', '∂ψ/∂t = 0', '-ħ^2/(2m) ∂^2ψ/∂x^2'],
  'Potenz':         ['x^2', 'e^(-x^2)', 'e^(ikx)', '(1 + x)^n', 'a^(n+1)', '2^10'],
  'Index':          ['ψ_n', 'E_n = n^2 E_1', 'a_0', 'V_0 - E', 'x_1 + x_2', 'c_n'],
  'ψ^*':            ['ψ^*', 'ψ^* ψ', 'c_n^* c_n', 'f^* g', 'z^* z'],
  'a†':             ['a†', 'a† a', '[a, a†] = 1', 'Â†', 'a† |n⟩'],
  "ψ''":            ["ψ''", "f'(0)", "y'' = -k^2 y", "ψ' = 0", "u''(r)"],
  'Wurzel':         ['sqrt(2)', 'sqrt(2/L)', '1/sqrt(2)', 'sqrt(x^2 + 1)', 'ħ sqrt(2)'],
  '∫_0^L … dx':     ['∫_0^L x dx', '∫_0^L |ψ|^2 dx = 1', '∫_0^a sin(x) dx', '∫_0^∞ e^(-x) dx', '∫_1^2 x^2 dx'],
  '∫_-∞^∞':         ['∫_-∞^∞ e^(-x^2) dx', '∫_-∞^∞ |ψ|^2 dx = 1', '∫_-∞^∞ x |ψ|^2 dx', '∫_-∞^∞ δ(x) dx = 1', '∫_-1^1 x dx'],
  'Σ_{n=1}^∞':      ['Σ_{n=1}^∞ |c_n|^2 = 1', 'Σ_{n=0}^∞ x^n', 'Σ_{n=1}^N n', 'Σ_{k=0}^∞ a_k', 'Σ_{n=1}^∞ 1/n^2'],
  '(a, b; c, d)':   ['(a, b; c, d)', '(1, 0; 0, -1)', '(0, 1; 1, 0)', '(2, i; -i, 3)', '(0, -i; i, 0)'],
  '(a; b)':         ['(a; b)', '(1; i)', '(1; -1)/sqrt(2)', '(3; 4)', '(1; 0; 0)'],
  '⟨a|b⟩':          ['⟨a|b⟩', '⟨m|n⟩ = 0', '⟨ψ|ψ⟩ = 1', '⟨f|g⟩', '⟨x^2⟩'],
  '|ψ⟩':            ['|ψ⟩', '|n⟩', '|+x⟩', 'Ĥ |ψ⟩ = E |ψ⟩', '|↑⟩'],
  '⟨n|Â|m⟩':        ['⟨n|Â|m⟩', '⟨n|x̂|m⟩', '⟨ψ|Ĥ|ψ⟩', '⟨n|a†|m⟩', '⟨m|p̂|n⟩'],
  '[x̂, p̂]':         ['[x̂, p̂]', '[x̂, p̂] = iħ', '[a, a†]', '[L_x, L_y] = iħ L_z', '[Ĥ, x̂]']
};
/* Syntaxbaum ohne Gruppierungsklammern und Schreibdetails */
function norm(n){
  if (Array.isArray(n)) return n.map(norm);
  if (!n || typeof n !== 'object') return n;
  if (n.t === 'grp' && n.br === '(') return norm(n.a);
  const o = {};
  for (const k of Object.keys(n).sort()) if (!['txt', 'ex', 'at', 's', 'noParen', 'join'].includes(k)) o[k] = norm(n[k]);
  return o;
}
const same = (a, b) => { if (a.replace(/\s+/g, '') === b.replace(/\s+/g, '')) return true; try { return JSON.stringify(norm(E.parseLine(a, {}))) === JSON.stringify(norm(E.parseLine(b, {}))); } catch(e){ return false; } };
const runs = [{shapes:'Strichschrift', bank:null, seeds:[1, 2, 3]}].concat(bank ? [{shapes:'fremde Schreiber', bank, seeds:[11, 12]}] : []);
let tot = 0, ok = 0, fails = [];
const rows = [];
for (const [type, lines] of Object.entries(CASES)){
  const r = {type, n:0, ok:0};
  for (const line of lines){
    const ast = E.parseLine(line, {});
    for (const run of runs) for (const seed of run.seeds){
      const sl = syn.synthLine(ast, seed * 97 + line.length, {bank:run.bank});
      const rc = E.inkContext(null); rc.oracle = syn.oracle;
      const res = E.recognizeInk(sl.strokes, rc);
      const good = same(res.text, line);
      r.n++; tot++; if (good){ r.ok++; ok++; } else fails.push(`[${type}, ${run.shapes} ${seed}] ${line}  →  ${res.text}`);
    }
  }
  rows.push(r);
}
console.log('Struktur-Tests (Orakel):', ok, '/', tot, (100 * ok / tot).toFixed(1) + ' %', '| Formen:', runs.map(r => r.shapes + ' ×' + r.seeds.length).join(', '));
for (const r of rows) console.log('  ' + r.type.padEnd(16), String(r.ok).padStart(3) + '/' + String(r.n).padEnd(3), (100 * r.ok / r.n).toFixed(0).padStart(4) + ' %', '(' + CASES[r.type].length + ' Fälle)');
if (verbose || fails.length <= 25) fails.forEach(f => console.log('  FEHLER', f));
else console.log('  (' + fails.length + ' Fehler, --verbose zeigt alle)');
process.exit(0);
