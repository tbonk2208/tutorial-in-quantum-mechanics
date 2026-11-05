/* Zeichnet Striche als SVG (zum Ansehen): node viz.js "<Zeile>" [seed] > out.svg */
const lib = require('./lib.js'), syn = require('./synth.js');
const E = lib.load({model:'oracle'});
const line = process.argv[2] || 'ψ(x) = sqrt(2/L) sin(nπx/L)', seed = +(process.argv[3] || 1);
const ast = E.parseLine(line, {});
const r = syn.synthLine(ast, seed);
let x1 = 0, y1 = 0; r.strokes.forEach(s => s.forEach(p => { x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }));
console.log(`<svg xmlns="http://www.w3.org/2000/svg" width="${x1 + 20}" height="${y1 + 20}" ><rect width="100%" height="100%" fill="#fff"/>` + r.strokes.map(s => `<polyline fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" points="${s.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ')}"/>`).join('') + '</svg>');
