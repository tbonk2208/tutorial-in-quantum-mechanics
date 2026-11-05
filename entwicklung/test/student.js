const fs = require('fs'), path = require('path');
const ls = d => fs.readdirSync(path.join(__dirname, '..', d)).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(path.join(__dirname, '..', d, f), 'utf8'));
const E = new Function(ls('src/engine').join('\n;\n') + '\n;\n' + ls('src/content').join('\n;\n') + '\n;return {TOPICS, checkTask};')();
const find = (tid, gid) => { for (const t of E.TOPICS) for (const k of [...t.practice, ...t.final.filter(x => x.task).map(x => x.task)]) if (k.id === tid) return [k, k.goals.find(g => g.id === gid)]; };
if (process.argv[2] === 'list'){ for (const t of E.TOPICS) for (const k of t.practice) for (const g of k.goals) console.log(k.id + ':' + g.id, '|', (g.prompt || '').slice(0, 70), '|', (g.model || []).map(m => typeof m === 'string' ? m : m.l).slice(0, 3).join('  ‖  ').slice(0, 150)); process.exit(0); }
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const [id, lines, note] of cases){
  const [tid, gid] = id.split(':'); const [task, goal] = find(tid, gid);
  const r = E.checkTask(task.ctx, goal, lines, 'stud');
  console.log('==', id, note || '');
  r.lines.forEach((l, i) => console.log('  ', (lines[i] || '').padEnd(46), l.status.padEnd(6), [l.msg, ...(l.steps || []).flatMap(s => [s.msg, ...(s.msgs || [])])].filter(Boolean).join(' | ').slice(0, 230)));
  console.log('   →', r.final && r.final.state, (r.final && r.final.msg || '').slice(0, 200));
}
