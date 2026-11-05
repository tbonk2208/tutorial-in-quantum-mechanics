/* ===== Parser: Eingabezeile -> Syntaxbaum ===== */
const RELOPS = new Set(['=', '≈', '≠', '≤', '≥', '<', '>', ':=']);
const SEPS = new Set(['⇒', '⇔', ';']);
const DEFAULT_FUNCS = new Set(['ψ', 'φ', 'χ', 'Ψ', 'Φ', 'f', 'g', 'u', 'V', 'R', 'Y', 'δ', 'Θ', 'P', 'H']);
const DIFF_VARS = new Set(['x', 'y', 'z', 'r', 't', 'k', 'p', 'q', 'θ', 'φ', 'ξ', 's', 'u', 'ρ', 'τ', 'E', 'ω', 'ε']);
const MULTISUB = new Set(['δ', 'Y', 'R']);
const SUPLABEL = new Set(['E', 'ψ', 'φ', 'c', 'ε', 'Ψ']);

class ParseError extends Error { constructor(msg, at){ super(msg); this.at = at; } }

function parseLine(src, ctx){
  const toks = lex(src);
  const P = new Parser(toks, ctx || {});
  return P.line();
}
function parseExprStr(src, ctx){
  const toks = lex(src);
  const P = new Parser(toks, ctx || {});
  const e = P.expr();
  if (P.peek().k !== 'eof') throw new ParseError('Unerwartetes Zeichen „' + P.peek().v + '“', P.peek().at);
  return e;
}

class Parser {
  constructor(toks, ctx){
    this.T = toks; this.p = 0; this.ctx = ctx;
    this.intDepth = 0; this.bk = 0; this.absD = 0; this.subMode = 0;
    this.funcs = new Set([...DEFAULT_FUNCS, ...((ctx && ctx.funcs) || [])]);
    this.notFuncs = new Set((ctx && ctx.notFuncs) || []);
    this.dvars = new Set([...DIFF_VARS, ...((ctx && ctx.coords) || [])]);
  }
  peek(o){ return this.T[Math.min(this.p + (o || 0), this.T.length - 1)]; }
  next(){ return this.T[this.p++]; }
  isOp(v, o){ const t = this.peek(o); return t.k === 'op' && t.v === v; }
  eat(v){ if (this.isOp(v)){ this.p++; return true; } return false; }
  expect(v, msg){ if (!this.eat(v)) throw new ParseError(msg || ('„' + v + '“ fehlt'), this.peek().at); }

  /* ---------- Zeile ---------- */
  line(){
    const stmts = [], words = [];
    let joins = [];
    while (this.peek().k !== 'eof'){
      const t = this.peek();
      if (t.k === 'word'){ words.push(t.v); this.p++; joins.push('w'); continue; }
      if (t.k === 'op' && SEPS.has(t.v)){ this.p++; joins.push(t.v); continue; }
      if (t.k === 'op' && t.v === ','){ this.p++; joins.push(','); continue; }
      if (t.k === 'op' && t.v === ':'){ this.p++; continue; }
      const st = this.statement();
      st.join = joins.length ? joins[joins.length - 1] : null; joins = [];
      stmts.push(st);
      const n = this.peek();
      if (n.k === 'eof' || n.k === 'word' || (n.k === 'op' && (SEPS.has(n.v) || n.v === ',' || n.v === ':'))) continue;
      throw new ParseError('Unerwartetes Zeichen „' + n.v + '“', n.at);
    }
    return {stmts, words};
  }
  statement(){
    const rels = [], parts = [];
    let cont = false;
    if (this.peek().k === 'op' && RELOPS.has(this.peek().v) && this.peek().v !== '<'){ cont = true; rels.push(this.next().v); }
    parts.push(this.expr());
    while (this.peek().k === 'op' && RELOPS.has(this.peek().v)){ rels.push(this.next().v); parts.push(this.expr()); }
    return {cont, rels, parts};
  }

  /* ---------- Ausdrücke ---------- */
  expr(){
    const terms = [];
    let t = this.peek(), sign = null;
    if (t.k === 'op' && (t.v === '-' || t.v === '+' || t.v === '±' || t.v === '∓')){ this.p++; sign = t.v; }
    let e = this.term();
    terms.push(sign === '-' ? {t:'neg', a:e} : (sign === '±' || sign === '∓') ? {t:'pm', a:e, s:sign} : e);
    for (;;){
      t = this.peek();
      if (t.k === 'op' && (t.v === '+' || t.v === '-' || t.v === '±' || t.v === '∓')){
        if (this.bk && this.isLabelEnd(1)) break; // |+⟩ in Bra-Ket nicht als Rechenzeichen
        this.p++;
        e = this.term();
        terms.push(t.v === '-' ? {t:'neg', a:e} : (t.v === '±' || t.v === '∓') ? {t:'pm', a:e, s:t.v} : e);
      } else break;
    }
    return terms.length === 1 ? terms[0] : {t:'add', a:terms};
  }
  isLabelEnd(o){ const t = this.peek(o); return t.k === 'op' && (t.v === '⟩' || t.v === '>' || t.v === '|' || t.v === ','); }
  atDifferential(){
    if (!this.intDepth) return false;
    const t = this.peek(), u = this.peek(1);
    if (t.k !== 'id' || t.v !== 'd' || t.hat || t.autoSub) return false;
    if (u.k !== 'id' || !this.dvars.has(u.v) || u.hat) return false;
    if (!u.s) return true;
    // mit Leerzeichen nur am Ende des Integranden
    const w = this.peek(2);
    return w.k === 'eof' || (w.k === 'op' && (RELOPS.has(w.v) || [')', ']', '}', '+', '-', ',', '⇒', '⇔', ';', '|', '⟩', "'"].includes(w.v))) || (w.k === 'id' && w.v === 'd');
  }
  startsFactor(t){
    if (t.k === 'num' || t.k === 'hatkw') return true;
    if (t.k === 'id') return true;
    if (t.k !== 'op') return false;
    if (t.v === '|') return !this.bk && !this.absD;
    if (t.v === '<') return this.hasLater('>');
    return ['(', '[', '{', '⟨', '∫', 'Σ', '√', '∂', '∇', 'Δ', '∞', '↑', '↓'].includes(t.v);
  }
  hasLater(v){ for (let i = this.p + 1; i < this.T.length; i++){ const t = this.T[i]; if (t.k === 'op' && t.v === v) return true; if (t.k === 'op' && (t.v === '=' || SEPS.has(t.v))) return false; } return false; }
  term(){
    const fs = [], ex = [];
    fs.push(this.unaryFactor()); ex.push(false);
    for (;;){
      const t = this.peek();
      if (t.k === 'op' && t.v === '*'){ this.p++; fs.push(this.unaryFactor()); ex.push(true); continue; }
      if (t.k === 'op' && t.v === '/'){
        this.p++;
        const den = this.tightGroup();
        // Ein Ableitungsoperator wirkt auf alles rechts von ihm: d/dx 1/(1 + x) = d/dx (1/(1 + x))
        let k = -1; for (let j = fs.length - 2; j >= 0; j--) if (fs[j].t === 'deriv' && !fs[j].a){ k = j; break; }
        if (k >= 0){
          const rest = fs.slice(k + 1), rex = ex.slice(k + 1);
          const num = rest.length === 1 ? rest[0] : {t:'mul', a:rest, ex:rex};
          fs.length = k + 1; ex.length = k + 1; fs.push({t:'div', a:num, b:den}); ex.push(false); continue;
        }
        const num = fs.length === 1 ? fs[0] : {t:'mul', a:fs.slice(), ex:ex.slice()};
        fs.length = 0; ex.length = 0; fs.push({t:'div', a:num, b:den}); ex.push(false); continue;
      }
      if (t.k === 'op' && t.v === '⊗'){ this.p++; const b = this.unaryFactor(); const a = fs.pop(); ex.pop(); fs.push({t:'tensor', a, b}); ex.push(false); continue; }
      if (this.startsFactor(t) && !this.atDifferential()){ fs.push(this.unaryFactor()); ex.push(false); continue; }
      break;
    }
    return fs.length === 1 ? fs[0] : {t:'mul', a:fs, ex};
  }
  tightGroup(){
    if (this.isOp('-')){ this.p++; return {t:'neg', a:this.tightGroup()}; }
    const fs = [this.postfix()];
    while (!this.peek().s && this.startsFactor(this.peek()) && !this.atDifferential() && !(this.peek().k === 'op' && (this.peek().v === '|' || this.peek().v === '(' || this.peek().v === '[' || this.peek().v === '⟨'))) fs.push(this.postfix());
    return fs.length === 1 ? fs[0] : {t:'mul', a:fs, ex:fs.map(() => false)};
  }
  unaryFactor(){
    if (this.isOp('-')){ this.p++; return {t:'neg', a:this.unaryFactor()}; }
    if (this.isOp('+')){ this.p++; return this.unaryFactor(); }
    return this.postfix();
  }
  postfix(){
    let e = this.primary();
    for (;;){
      const t = this.peek();
      if (t.k !== 'op') break;
      if (t.v === "'" ){ let n = 0; while (this.isOp("'")){ this.p++; n++; } e = {t:'prime', a:e, n};
        if (this.isOp('(') && !this.peek().s && (e.a.t === 'sym')){ const args = this.callArgs(); e = {t:'call', fn:e, args}; }
        continue; }
      if (t.v === '†'){ this.p++; e = {t:'dag', a:e}; continue; }
      if (t.v === '^*'){ this.p++; e = {t:'conj', a:e}; continue; }
      if (t.v === '!'){ this.p++; e = {t:'fact', a:e}; continue; }
      if (t.v === '^'){ this.p++; const b = this.exponent(); e = {t:'pow', a:e, b}; continue; }
      break;
    }
    return e;
  }
  exponent(){
    if (this.isOp('{')){ this.p++; const e = this.expr(); this.expect('}'); return e; }
    if (this.isOp('(')){ this.p++; const e = this.expr(); this.expect(')'); return {t:'grp', a:e, br:'('}; }
    if (this.isOp('-') || this.isOp('+')){ const s = this.next().v; const g = this.tightExp(); return s === '-' ? {t:'neg', a:g} : g; }
    if (this.peek().k === 'num'){ const t = this.next(); return {t:'num', v:t.v, txt:t.txt}; }
    return this.tightExp();
  }
  tightExp(){
    const fs = [this.postfixNoPow()];
    while (!this.peek().s && (this.peek().k === 'id' || this.peek().k === 'num' || this.isOp('(') || this.isOp('π')) && !this.atDifferential()) fs.push(this.postfixNoPow());
    return fs.length === 1 ? fs[0] : {t:'mul', a:fs, ex:fs.map(() => false)};
  }
  postfixNoPow(){
    let e = this.primary();
    while (this.isOp('^') && this.peek(1).k === 'num'){ this.p++; const t = this.next(); e = {t:'pow', a:e, b:{t:'num', v:t.v}}; }
    return e;
  }

  /* ---------- Grundbausteine ---------- */
  primary(){
    const t = this.peek();
    if (t.k === 'num'){ this.p++; return {t:'num', v:t.v, txt:t.txt}; }
    if (t.k === 'hatkw'){ this.p++; const id = this.peek(); if (this.isOp('(')){ this.p++; const s = this.next(); this.expect(')'); s.hat = true; return this.symFrom(s); } if (id.k !== 'id') throw new ParseError('Nach „hat“ fehlt ein Buchstabe', id.at); this.p++; id.hat = true; return this.symFrom(id); }
    if (t.k === 'id'){
      if (t.v === 'd' && !t.hat && !t.autoSub){ const d = this.tryDeriv(false); if (d) return d; }
      this.p++;
      if (t.fn) return this.func(t);
      return this.symFrom(t);
    }
    if (t.k === 'word') throw new ParseError('Wort „' + t.v + '“ an dieser Stelle', t.at);
    if (t.k !== 'op') throw new ParseError(t.k === 'eof' ? 'Ausdruck unvollständig' : 'Unbekanntes Zeichen „' + t.v + '“', t.at);
    switch (t.v){
      case '(': return this.paren();
      case '[': return this.bracket();
      case '{': return this.brace();
      case '|': return this.barOpen();
      case '⟨': case '<': return this.braOpen();
      case '∫': return this.integral();
      case 'Σ': return this.sum();
      case '√': { this.p++; let a; if (this.isOp('(') || this.isOp('{')){ const br = this.next().v; a = this.expr(); this.expect(br === '(' ? ')' : '}'); } else a = this.postfixNoPow(); return {t:'call', fn:'sqrt', args:[a]}; }
      case '∂': { const d = this.tryDeriv(true); if (d) return d; throw new ParseError('„∂“ unklar: schreibe ∂/∂x oder ∂ψ/∂x', t.at); }
      case '∇': { this.p++; if (this.isOp('^')){ this.p++; const n = this.next(); if (n.k !== 'num' || n.v !== 2) throw new ParseError('Nur ∇² wird unterstützt', n.at); return {t:'lap'}; } return {t:'lap', grad:true}; }
      case 'Δ': { this.p++; if (this.peek().k === 'id' && !this.peek().s){ const a = this.postfixNoPow(); return {t:'unc', a}; } return {t:'sym', name:'Δ', hat:false, sub:null}; }
      case '∞': this.p++; return {t:'num', v:Infinity};
      case '↑': case '↓': { let v = ''; while (this.isOp('↑') || this.isOp('↓')) v += this.next().v; return {t:'spec', v}; }
      case '-': { this.p++; return {t:'neg', a:this.postfix()}; }
    }
    throw new ParseError(t.v === ')' ? 'Klammer „)“ ohne „(“' : 'Unerwartetes Zeichen „' + t.v + '“', t.at);
  }
  symFrom(t){
    const node = {t:'sym', name:t.v, hat:!!t.hat, sub:null};
    if (t.autoSub) node.sub = {t:'num', v:+t.autoSub, txt:t.autoSub};
    if (this.isOp('_') ){ this.p++; node.sub = this.subscript(node.name); }
    // Kennzeichnung wie E^(1), ψ^{(2)} oder Y_l^m
    if (this.isOp('^')){
      const a = this.peek(1), b = this.peek(2), c = this.peek(3), d = this.peek(4);
      if (SUPLABEL.has(node.name) && a.k === 'op' && a.v === '(' && b.k === 'num' && c.k === 'op' && c.v === ')'){ this.p += 4; node.sup = String(b.v); }
      else if (SUPLABEL.has(node.name) && a.k === 'op' && a.v === '{' && b.k === 'op' && b.v === '(' && c.k === 'num' && d.k === 'op' && d.v === ')' && this.peek(5).k === 'op' && this.peek(5).v === '}'){ this.p += 6; node.sup = String(c.v); }
      else if ((node.name === 'Y' || node.name === 'P') && node.sub){ this.p++; node.supE = this.subscriptAtom(); }
    }
    if (this.ctx.ops && !node.hat && this.ctx.autoHat && this.ctx.autoHat.has(node.name)) node.hat = true;
    // Ableitungsstriche vor Argumenten
    let primes = 0; while (this.isOp("'")){ this.p++; primes++; }
    const isF = (this.funcs.has(node.name) || (this.ctx.funcs && this.ctx.funcs.has && this.ctx.funcs.has(this.symKey(node)))) && !this.notFuncs.has(node.name);
    let e = node;
    if (this.isOp('(') && !this.peek().s && isF && !node.hat && !(node.name === 'H' && !node.sub) && !(node.name === 'P' && !node.sub)){
      const args = this.callArgs();
      e = {t:'call', fn:node, args, primes};
    } else if (primes) e = {t:'prime', a:node, n:primes};
    return e;
  }
  symKey(n){ return n.name + (n.sub ? '_' + (n.sub.t === 'num' ? n.sub.v : n.sub.t === 'sym' ? n.sub.name : '?') : ''); }
  subscript(base){
    if (this.isOp('{')){ this.p++; this.subMode++; const items = [this.expr()]; while (this.eat(',')) items.push(this.expr()); this.subMode--; this.expect('}'); return items.length === 1 ? items[0] : {t:'list', a:items}; }
    if (this.isOp('+') || this.isOp('-')){ const v = this.next().v; return {t:'spec', v}; }
    if (this.isOp('(')){ this.p++; const e = this.expr(); this.expect(')'); return e; }
    const first = this.subscriptAtom();
    // S_1x, σ_2z (Teilchen + Richtung), ψ_II (römische Ziffern)
    if (first.t === 'num' && this.peek().k === 'id' && 'xyz'.includes(this.peek().v) && !this.peek().s && Number.isInteger(first.v) && first.v < 10){ const d = this.next(); return {t:'list', a:[first, {t:'sym', name:d.v, hat:false, sub:null}], tight:true}; }
    if (first.t === 'sym' && first.name === 'I' && this.peek().k === 'id' && (this.peek().v === 'I' || this.peek().v === 'V') && !this.peek().s){ let nm = 'I'; while (this.peek().k === 'id' && (this.peek().v === 'I' || this.peek().v === 'V') && !this.peek().s) nm += this.next().v; return {t:'sym', name:nm, hat:false, sub:null}; }
    const allowMulti = MULTISUB.has(base) || ((base === 'ψ' || base === 'φ' || base === 'c' || base === 'χ') && first.t === 'sym' && 'nlm'.includes(first.name));
    if (allowMulti){
      const items = [first];
      while (!this.peek().s && (this.peek().k === 'id' && this.peek().v.length === 1 && !this.peek().hat || this.peek().k === 'num') && !this.isOp('(')){
        const nt = this.peek(); if (nt.k === 'id' && !MULTISUB.has(base) && !'nlm'.includes(nt.v)) break;
        if (nt.k === 'num' && String(nt.txt || nt.v).length > 1 && MULTISUB.has(base)){ this.p++; for (const ch of String(nt.txt || nt.v)) items.push({t:'num', v:+ch}); continue; }
        items.push(this.subscriptAtom());
      }
      if (first.t === 'num' && String(first.txt || first.v).length > 1 && (MULTISUB.has(base) || base === 'ψ')){ const digs = String(first.txt || first.v).split('').map(ch => ({t:'num', v:+ch})); items.splice(0, 1, ...digs); }
      return items.length === 1 ? items[0] : {t:'list', a:items};
    }
    return first;
  }
  subscriptAtom(){
    const t = this.next();
    if (t.k === 'num') return {t:'num', v:t.v, txt:t.txt};
    if (t.k === 'id') return {t:'sym', name:t.v, hat:!!t.hat, sub:null};
    if (t.k === 'op' && t.v === '{'){ const e = this.expr(); this.expect('}'); return e; }
    if (t.k === 'op' && (t.v === '-' || t.v === '+')){ const u = this.subscriptAtom(); return t.v === '-' ? {t:'neg', a:u} : u; }
    throw new ParseError('Index unklar', t.at);
  }
  callArgs(){
    this.expect('(');
    const save = this.bk; this.bk = 0; const sa = this.absD; this.absD = 0;
    const args = [this.expr()];
    while (this.eat(',')) args.push(this.expr());
    this.bk = save; this.absD = sa;
    this.expect(')', 'Klammer „)“ fehlt');
    return args;
  }
  func(t){
    const name = t.v;
    let fpow = null;
    if (this.isOp('^') && name !== 'sqrt'){ this.p++; fpow = this.exponent(); }
    let args;
    if (this.isOp('(')) args = this.callArgs();
    else {
      // Argument ohne Klammern: sin kx
      const fs = [this.postfixNoPow()];
      while (this.startsFactor(this.peek()) && !(this.peek().k === 'id' && this.peek().fn) && !this.atDifferential() && this.peek().k !== 'op') fs.push(this.postfixNoPow());
      args = [fs.length === 1 ? fs[0] : {t:'mul', a:fs, ex:fs.map(() => false)}];
      if (name !== 'sqrt') args.noParen = true;
    }
    let e;
    if (name === 'sqrt') e = {t:'call', fn:'sqrt', args};
    else if (name === 'abs') e = {t:'abs', a:args[0]};
    else if (name === 'conj') e = {t:'conj', a:args[0], fn:true};
    else e = {t:'call', fn:name, args};
    if (fpow) e = {t:'pow', a:e, b:fpow, fnpow:true};
    return e;
  }
  paren(){
    this.p++;
    const save = this.bk, sa = this.absD; this.bk = 0; this.absD = 0;
    const first = this.expr();
    if (this.isOp(')')){ this.p++; this.bk = save; this.absD = sa; return {t:'grp', a:first, br:'('}; }
    const rows = [[first]];
    while (this.isOp(',') || this.isOp(';')){
      const s = this.next().v;
      if (s === ';') rows.push([this.expr()]); else rows[rows.length - 1].push(this.expr());
    }
    this.expect(')', 'Klammer „)“ fehlt');
    this.bk = save; this.absD = sa;
    const w = rows[0].length;
    if (rows.some(r => r.length !== w)) throw new ParseError('Matrix: alle Zeilen brauchen gleich viele Einträge', this.peek().at);
    return {t:'mat', rows};
  }
  bracket(){
    this.p++;
    const save = this.bk, sa = this.absD; this.bk = 0; this.absD = 0;
    const a = this.expr();
    if (this.eat(',')){ const b = this.expr(); this.expect(']', 'Klammer „]“ fehlt'); this.bk = save; this.absD = sa; return {t:'comm', a, b, anti:false}; }
    this.expect(']', 'Klammer „]“ fehlt');
    this.bk = save; this.absD = sa;
    if (this.isOp('_') || (this.isOp('^') && !this.peek().s)){
      let lo = null, hi = null, v = null;
      if (this.eat('_')){ const r = this.boundWithVar(); lo = r.e; v = r.v; }
      if (this.eat('^')) hi = this.bound();
      if (lo && hi) return {t:'evalbr', a, v, lo, hi};
      if (lo || hi) throw new ParseError('Auswertungsklammer braucht untere und obere Grenze', this.peek().at);
    }
    return {t:'grp', a, br:'['};
  }
  brace(){
    this.p++;
    const save = this.bk; this.bk = 0;
    const a = this.expr();
    if (this.eat(',')){ const b = this.expr(); this.expect('}'); this.bk = save; return {t:'comm', a, b, anti:true}; }
    this.expect('}', 'Klammer „}“ fehlt'); this.bk = save;
    return {t:'grp', a, br:'{'};
  }
  bound(){
    if (this.isOp('{')){ this.p++; const e = this.expr(); this.expect('}'); return e; }
    if (this.isOp('(')){ this.p++; const e = this.expr(); this.expect(')'); return e; }
    if (this.isOp('-')){ this.p++; return {t:'neg', a:this.bound()}; }
    if (this.isOp('+')){ this.p++; return this.bound(); }
    if (this.isOp('∞')){ this.p++; return {t:'num', v:Infinity}; }
    const t = this.next();
    if (t.k === 'num') return {t:'num', v:t.v, txt:t.txt};
    if (t.k === 'id'){ const n = {t:'sym', name:t.v, hat:false, sub:null}; if (t.autoSub) n.sub = {t:'num', v:+t.autoSub}; if (this.isOp('_')){ this.p++; n.sub = this.subscriptAtom(); } return n; }
    throw new ParseError('Grenze unklar', t.at);
  }
  boundWithVar(){
    if (this.isOp('{') && this.peek(1).k === 'id' && this.isOp('=', 2)){ this.p++; const v = this.next().v; this.p++; const e = this.expr(); this.expect('}'); return {v, e}; }
    return {v:null, e:this.bound()};
  }
  differential(){
    const t = this.peek(), u = this.peek(1);
    if (t.k === 'id' && t.v === 'd' && u.k === 'id'){
      this.p += 2; let v = u.v; if (this.isOp("'")){ this.p++; v += "'"; } return v;
    }
    return null;
  }
  integral(){
    this.p++;
    let lo = null, hi = null;
    for (let k = 0; k < 2; k++){
      if (this.eat('_')) lo = this.bound(); else if (this.eat('^')) hi = this.bound();
    }
    // Differential zuerst: ∫ dx f(x)
    const t = this.peek(), u = this.peek(1);
    if (t.k === 'id' && t.v === 'd' && u.k === 'id' && !u.s && this.dvars.has(u.v)){
      const v = this.differential();
      this.intDepth++; const a = this.term(); this.intDepth--;
      return {t:'int', v, lo, hi, a, dfirst:true};
    }
    this.intDepth++;
    const save = this.bk; this.bk = 0;
    const a = this.expr();
    this.bk = save;
    this.intDepth--;
    const v = this.differential();
    if (!v) throw new ParseError('Integral: „dx“ (oder dr, dt …) am Ende fehlt', this.peek().at);
    return {t:'int', v, lo, hi, a};
  }
  sum(){
    this.p++;
    let v = null, lo = null, hi = null;
    if (this.eat('_')){
      if (this.isOp('{')){ this.p++; const id = this.next(); v = id.v; if (this.eat('=')) lo = this.expr(); this.expect('}'); }
      else { const id = this.next(); if (id.k !== 'id') throw new ParseError('Summe: Index fehlt', id.at); v = id.v; if (this.eat('=')) lo = this.bound(); }
    }
    if (this.eat('^')) hi = this.bound();
    const a = this.term();
    return {t:'sum', v, lo, hi, a};
  }
  labelList(){
    const labs = [];
    for (;;){
      const t = this.peek(), n = this.peek(1);
      if (t.k === 'op' && ['+', '-', '±'].includes(t.v) && (n.k === 'op' && ['⟩', '>', '|', ','].includes(n.v) || (n.k === 'id' && 'xyz'.includes(n.v) && !n.s && this.isLabelEnd(2)))){
        this.p++; let v = t.v; if (n.k === 'id'){ this.p++; v += n.v; } labs.push({t:'spec', v});
      } else if (t.k === 'op' && (t.v === '↑' || t.v === '↓')){
        let v = ''; while (this.isOp('↑') || this.isOp('↓')) v += this.next().v; labs.push({t:'spec', v});
      } else {
        this.bk++; labs.push(this.expr()); this.bk--;
      }
      if (!this.eat(',')) break;
    }
    return labs;
  }
  barOpen(){
    const at = this.peek().at; this.p++;
    // Betrag oder Ket?
    const save = this.p;
    if (this.isOp('⟨')){ // |⟨a|b⟩|
      this.absD++; const a = this.expr(); this.absD--;
      this.expect('|', 'Betragsstrich „|“ fehlt'); return {t:'abs', a};
    }
    const labs = this.labelList();
    if (this.isOp('⟩') || this.isOp('>')){ this.p++; return {t:'ket', lab:labs}; }
    if (this.isOp('|')){
      if (labs.length !== 1 || labs[0].t === 'spec') throw new ParseError('Betrag unklar', at);
      this.p++; return {t:'abs', a:labs[0]};
    }
    // zweiter Versuch: Betrag eines längeren Ausdrucks
    this.p = save; this.absD++; const a = this.expr(); this.absD--;
    if (this.eat('|')) return {t:'abs', a};
    if (this.isOp('⟩') || this.isOp('>')){ this.p++; return {t:'ket', lab:[a]}; }
    throw new ParseError('Zu „|“ fehlt der passende Strich oder „⟩“', at);
  }
  braOpen(){
    const at = this.peek().at; this.p++;
    const first = this.labelList();
    if (this.isOp('⟩') || this.isOp('>')){
      this.p++;
      if (first.length !== 1 || first[0].t === 'spec') throw new ParseError('Erwartungswert unklar', at);
      return {t:'expect', a:first[0]};
    }
    this.expect('|', '„|“ oder „⟩“ fehlt');
    const t = this.peek();
    const specNext = t.k === 'op' && (t.v === '+' || t.v === '-') && (this.isLabelEnd(1) || (this.peek(1).k === 'id' && 'xyz'.includes(this.peek(1).v) && !this.peek(1).s && this.isLabelEnd(2)));
    if (!specNext && (t.k === 'eof' || (t.k === 'op' && ([')', ']', '}', '=', '+', '-', ',', ';', '⇒', '⇔', '*'].includes(t.v) || RELOPS.has(t.v))))) return {t:'bra', lab:first};
    const save = this.p;
    try {
      const second = this.labelList();
      if (this.isOp('⟩') || this.isOp('>')){ this.p++; return {t:'braket', bra:first, op:null, ket:second}; }
      if (this.isOp('|')){
        this.p++;
        const third = this.labelList();
        if (this.isOp('⟩') || this.isOp('>')){ this.p++; if (second.length !== 1) throw new ParseError('Operator unklar', at); return {t:'braket', bra:first, op:second[0], ket:third}; }
      }
    } catch(e){ /* zurück */ }
    this.p = save;
    return {t:'bra', lab:first};
  }
  /* Ableitungen: d/dx, d²/dx², dψ/dx, ∂/∂t, ∂_x */
  tryDeriv(partial){
    const save = this.p;
    const D = partial ? (t => t.k === 'op' && t.v === '∂') : (t => t.k === 'id' && t.v === 'd' && !t.hat && !t.autoSub);
    if (!D(this.peek())) return null;
    this.p++;
    // ∂_x
    if (partial && this.isOp('_')){
      this.p++; const v = this.next(); if (v.k !== 'id'){ this.p = save; return null; }
      let n = 1; if (this.isOp('^') && this.peek(1).k === 'num'){ this.p++; n = this.next().v; }
      return this.derivTail({t:'deriv', v:v.v, n, partial:true, a:null});
    }
    let n = 1;
    const readOrder = () => { if (this.isOp('^') && (this.peek(1).k === 'num' || (this.peek(1).k === 'op' && this.peek(1).v === '{'))){ this.p++; if (this.eat('{')){ const t = this.next(); this.expect('}'); return t.v; } return this.next().v; } return 1; };
    n = readOrder();
    if (this.isOp('/')){
      this.p++;
      if (!D(this.peek())){ this.p = save; return null; }
      this.p++;
      const v = this.peek(); if (v.k !== 'id'){ this.p = save; return null; }
      this.p++; let vn = v.v; if (this.isOp("'")){ this.p++; vn += "'"; }
      const n2 = readOrder();
      if (n2 !== n && !(n2 === 1 && n === 1)){ if (n2 !== n){ this.p = save; return null; } }
      return this.derivTail({t:'deriv', v:vn, n, partial, a:null});
    }
    // Leibniz-Form: dψ/dx
    try {
      const t = this.peek();
      if (!(t.k === 'id' || (t.k === 'op' && t.v === '('))) { this.p = save; return null; }
      let a;
      if (t.k === 'op'){ a = this.paren(); }
      else { this.p++; a = {t:'sym', name:t.v, hat:!!t.hat, sub:null}; if (t.autoSub) a.sub = {t:'num', v:+t.autoSub}; if (this.isOp('_')){ this.p++; a.sub = this.subscript(a.name); } if (this.isOp('(') && !this.peek().s){ a = {t:'call', fn:a, args:this.callArgs()}; } }
      if (this.isOp('^*')){ this.p++; a = {t:'conj', a}; }
      if (!this.isOp('/')){ this.p = save; return null; }
      this.p++;
      if (!D(this.peek())){ this.p = save; return null; }
      this.p++;
      const v = this.next(); if (v.k !== 'id'){ this.p = save; return null; }
      let vn = v.v; if (this.isOp("'")){ this.p++; vn += "'"; }
      const n2 = readOrder();
      if (n2 !== n){ this.p = save; return null; }
      return {t:'deriv', v:vn, n, partial, a, leibniz:true};
    } catch(e){ this.p = save; return null; }
  }
  derivTail(d){
    // direkt folgende Klammer gehört zur Ableitung: d/dx(xψ)
    if (this.isOp('(') && !this.peek().s){ const g = this.paren(); d.a = g; d.bound = true; }
    return d;
  }
}
