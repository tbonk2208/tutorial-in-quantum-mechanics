/* Alle Tests der Handschrifterkennung: node test/ink/run_all.js [--e2e]  (--e2e: zusätzlich Ende-zu-Ende mit Modell, ~3 min) */
const {execFileSync} = require('child_process'), path = require('path');
const T = ['t_raster.js', 't_cnn.js', 't_api.js', 't_struct.js', 't_speed.js', 't_group_crohme.js', 't_regress.js', 't_crohme_real.js'];
if (process.argv.includes('--e2e')) T.push('t_e2e.js');
let bad = 0;
for (const t of T){
  try { const out = execFileSync(process.execPath, [path.join(__dirname, t)], {encoding:'utf8', timeout:1800000}); console.log('── ' + t + '\n' + out.split('\n').filter(l => l.trim()).slice(0, t === 't_struct.js' ? 1 : 6).join('\n')); }
  catch(e){ bad++; console.log('── ' + t + ' FEHLGESCHLAGEN\n' + String(e.stdout || e.message).split('\n').slice(0, 8).join('\n')); }
}
console.log(bad ? bad + ' Test(s) fehlgeschlagen' : 'alle Tests ok');
process.exit(bad ? 1 : 0);
