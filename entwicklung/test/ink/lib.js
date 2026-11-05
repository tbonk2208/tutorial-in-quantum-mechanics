/* Lädt Prüfkern, Inhalte und die Handschrifterkennung (src/ui/16-ink-recog.js) in Node.
   Modell: INK_MODEL=qm (sym-qm.json, Standard falls vorhanden) | mathe (Platzhalter aus der Mathe-Lernhilfe) | oracle (keins) | <Pfad> */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const ls = d => fs.readdirSync(path.join(ROOT, d)).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(path.join(ROOT, d, f), 'utf8'));
const QM_MODEL = path.join(ROOT, 'src', 'ui', 'model', 'sym-qm.json');
const MATHE_HTML = '/home/claude/tbonk2208/mathe-lernhilfe/index.html';
function load(opts){
  opts = opts || {};
  const code = ls('src/engine').join('\n;\n') + '\n;\n' + (opts.content === false ? '' : ls('src/content').join('\n;\n')) + '\n;\n' + fs.readFileSync(process.env.INK_RECOG || path.join(ROOT, 'src', 'ui', '16-ink-recog.js'), 'utf8');
  const names = ['TOPICS', 'LEX', 'checkTask', 'parseLine', 'parseExprStr', 'texLine', 'makeCtx', 'lex', 'normalize', 'INKR', 'inkContext', 'recognizeInk', 'inkItemChoices', 'inkApplyChoice', 'inkLoadModel', 'inkRasterize', 'inkClassifySymbol', 'inkModelReady', 'HANDQ', 'SYMQ_CLASSES'];
  const E = new Function(code + '\n;return {' + names.map(n => `${n}: typeof ${n} !== 'undefined' ? ${n} : undefined`).join(',') + '};')();
  const which = opts.model || process.env.INK_MODEL || (fs.existsSync(QM_MODEL) ? 'qm' : 'mathe');
  E.modelName = 'keins';
  if (which === 'qm' && fs.existsSync(QM_MODEL)){ E.inkLoadModel(fs.readFileSync(QM_MODEL, 'utf8')); E.modelName = 'sym-qm.json'; }
  else if (which === 'mathe' || which === 'qm'){
    const html = fs.readFileSync(MATHE_HTML, 'utf8');
    const m = /<script[^>]*id="sym-data"[^>]*>([\s\S]*?)<\/script>/.exec(html);
    E.inkLoadModel(m[1]); E.modelName = 'Mathe-App (Platzhalter, cnn1)';
  } else if (which !== 'oracle' && fs.existsSync(which)){ E.inkLoadModel(fs.readFileSync(which, 'utf8')); E.modelName = which; }
  return E;
}
module.exports = {load, ROOT, QM_MODEL};
