const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'src', 'engine');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort();
const code = files.map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n;\n');
const names = ['lex','parseLine','parseExprStr','tex','texLine','normalize','cx','C','cabs','makeCtx','makeScope','elab','compile','envFor','Checker','checkTask','makeSamples','evalPart','evalM','diff','keyOf','integrate'];
const fn = new Function(code + '\n;return {' + names.map(n => `${n}: typeof ${n} !== 'undefined' ? ${n} : undefined`).join(',') + '};');
module.exports = fn();
