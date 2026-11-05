/* Mutationstest: veränderte Musterzeilen müssen als falsch erkannt werden */
const fs = require('fs'), path = require('path');
const ls = d => fs.readdirSync(path.join(__dirname, '..', d)).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(path.join(__dirname, '..', d, f), 'utf8'));
const E = new Function(ls('src/engine').join('\n;\n') + '\n;\n' + ls('src/content').join('\n;\n') + '\n;return {TOPICS, checkTask};')();
let total = 0, missed = [];
const muts = [l => l + ' · 11/10', l => l.replace(/=([^=]*)$/, '= -($1)'), l => l.replace(/2/, '3')];
for (const t of E.TOPICS){
  const tasks = [...t.practice, ...t.final.filter(x => x.task).map(x => x.task)];
  for (const task of tasks) for (const g of task.goals){
    const lines = (g.model || []).map(m => typeof m === 'string' ? m : m.l);
    for (let i = 0; i < lines.length; i++){
      if (!lines[i].includes('=')) continue;
      for (const [mi, M] of muts.entries()){
        const ml = M(lines[i]); if (ml === lines[i]) continue;
        const L2 = lines.slice(0, i).concat([ml]);
        let r; try { r = E.checkTask(task.ctx, g, L2, 'mut'); } catch(e){ continue; }
        const st = r.lines[i].status;
        if (st === 'parse' || st === 'empty') continue;
        total++;
        if (st === 'ok' || st === 'def') missed.push([t.id, task.id + ':' + g.id, '#' + (i + 1), 'M' + mi, ml, st]);
      }
    }
  }
}
console.log('Mutationen:', total, 'nicht erkannt:', missed.length);
for (const m of missed.slice(+(process.argv[2]||0), +(process.argv[2]||0) + 90)) console.log(m.join(' | '));
