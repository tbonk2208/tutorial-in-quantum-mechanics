/* Rasterung gegen die Prüfbeispiele von Agent T (/home/claude/ink/train/raster_check.json), Abweichung ≤ 1e-4 */
const fs = require('fs');
const lib = require('./lib.js');
const E = lib.load({model:'oracle', content:false});
const F = process.argv[2] || '/home/claude/ink/train/raster_check.json';
if (!fs.existsSync(F)){ console.log('raster_check.json fehlt – übersprungen'); process.exit(0); }
const d = JSON.parse(fs.readFileSync(F, 'utf8'));
let worst = 0, bad = 0;
for (const c of d.cases){
  const a = E.inkRasterize(c.strokes);
  let m = 0; for (let i = 0; i < 784; i++) m = Math.max(m, Math.abs(a[i] - c.expected[i]));
  worst = Math.max(worst, m);
  if (m > 1e-4){ bad++; console.log('ABWEICHUNG', c.name, c.cls || '', m.toExponential(2)); }
}
console.log('Rasterung:', d.cases.length, 'Fälle, größte Abweichung', worst.toExponential(2), bad ? 'FEHLER ' + bad : 'ok');
process.exit(bad ? 1 : 0);
