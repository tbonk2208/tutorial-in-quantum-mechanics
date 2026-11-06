/* ===== Syntaxbaum -> LaTeX (für die Formelvorschau) ===== */
const TEXSYM = {'α':'\\alpha','β':'\\beta','γ':'\\gamma','Γ':'\\Gamma','δ':'\\delta','Δ':'\\Delta','ε':'\\varepsilon','ζ':'\\zeta','η':'\\eta',
  'θ':'\\theta','Θ':'\\Theta','ι':'\\iota','κ':'\\kappa','λ':'\\lambda','Λ':'\\Lambda','μ':'\\mu','ν':'\\nu','ξ':'\\xi','Ξ':'\\Xi','π':'\\pi','Π':'\\Pi',
  'ρ':'\\rho','σ':'\\sigma','Σ':'\\Sigma','τ':'\\tau','υ':'\\upsilon','φ':'\\varphi','Φ':'\\Phi','χ':'\\chi','ψ':'\\psi','Ψ':'\\Psi','ω':'\\omega','Ω':'\\Omega','ħ':'\\hbar'};
const TEXFN = {sin:'\\sin',cos:'\\cos',tan:'\\tan',cot:'\\cot',sinh:'\\sinh',cosh:'\\cosh',tanh:'\\tanh',coth:'\\coth',arcsin:'\\arcsin',arccos:'\\arccos',arctan:'\\arctan',
  asin:'\\arcsin',acos:'\\arccos',atan:'\\arctan',exp:'\\exp',ln:'\\ln',log:'\\log',det:'\\det',tr:'\\operatorname{tr}',Tr:'\\operatorname{Tr}',Re:'\\operatorname{Re}',Im:'\\operatorname{Im}',
  erf:'\\operatorname{erf}',sgn:'\\operatorname{sgn}',hermite:'H',laguerre:'L',legendre:'P',fact:'\\operatorname{fact}',Gamma:'\\Gamma',binom:'\\binom'};
const RELTEX = {'=':'=', '≈':'\\approx', '≠':'\\neq', '≤':'\\le', '≥':'\\ge', '<':'<', '>':'>', ':=':':='};

function texNum(v, txt){
  if (v === Infinity) return '\\infty';
  if (txt) return txt.replace('.', '{,}');
  let s = String(v);
  if (Math.abs(v) >= 1e6 || (Math.abs(v) < 1e-4 && v !== 0)) s = v.toExponential(3).replace(/e([+-]\d+)/, (m, e) => '\\cdot 10^{' + (+e) + '}');
  return s.replace('.', '{,}');
}
function texName(n){
  let s = TEXSYM[n] || (n.length > 1 ? '\\mathrm{' + n + '}' : n);
  return s;
}
function texSym(node){
  let s = texName(node.name);
  if (node.hat) s = (node.name === 'ħ' ? s : '\\hat{' + s + '}');
  if (node.sub) s += '_{' + tex(node.sub, 0) + '}';
  if (node.sup) s += '^{(' + node.sup + ')}';
  if (node.supE) s += '^{' + tex(node.supE, 0) + '}';
  return s;
}
const PREC = {add:1, pm:1, neg:2, mul:3, div:3, tensor:3, pow:5};
function precOf(n){
  if (n.t === 'add') return 1;
  if (n.t === 'neg' || n.t === 'pm') return 2;
  if (n.t === 'mul' || n.t === 'tensor') return 3;
  if (n.t === 'div') return 4; // \frac braucht keine Klammern
  if (n.t === 'pow') return 5;
  if (n.t === 'num' && n.v < 0) return 2;
  if (n.t === 'int' || n.t === 'sum') return 2.5;
  if (n.t === 'deriv' && !n.a) return 3;
  return 9;
}
function wrap(s){ return '\\left(' + s + '\\right)'; }
function tex(n, ctxPrec){
  ctxPrec = ctxPrec || 0;
  const p = precOf(n);
  const s = tex0(n);
  return p < ctxPrec ? wrap(s) : s;
}
function texLab(labs){
  return labs.map(l => l.t === 'spec' ? l.v.replace(/↑/g, '\\uparrow ').replace(/↓/g, '\\downarrow ').replace(/^-/, '-').replace(/^±/, '\\pm') : tex(l, 0)).join(',');
}
function tex0(n){
  switch (n.t){
    case 'num': return texNum(n.v, n.txt);
    case 'sym': return texSym(n);
    case 'spec': return n.v.replace(/↑/g, '\\uparrow ').replace(/↓/g, '\\downarrow ');
    case 'list': return n.a.map(x => tex(x, 0)).join(n.tight ? '' : ',');
    case 'grp': {
      const inner = tex(n.a, 0);
      if (n.br === '[') return '\\left[' + inner + '\\right]';
      if (n.br === '{') return '\\left\\{' + inner + '\\right\\}';
      if (n.a.t === 'div' || n.a.t === 'call' && n.a.fn === 'sqrt') return inner;
      return '\\left(' + inner + '\\right)';
    }
    case 'add': return n.a.map((t, i) => {
      if (t.t === 'neg') return '-' + tex(t.a, 3);
      if (t.t === 'pm') return (t.s === '∓' ? '\\mp ' : '\\pm ') + tex(t.a, 3);
      return (i ? '+' : '') + tex(t, 1.5);
    }).join('');
    case 'neg': return '-' + tex(n.a, 3);
    case 'pm': return (n.s === '∓' ? '\\mp ' : '\\pm ') + tex(n.a, 3);
    case 'mul': {
      let out = '';
      n.a.forEach((f, i) => {
        let s = tex(f, f.t === 'neg' ? 9 : 3);
        if (f.t === 'neg' && i > 0) s = wrap(tex0(f));
        if (i){
          const prev = n.a[i - 1];
          const numNext = f.t === 'num' || (f.t === 'pow' && f.a.t === 'num') || (f.t === 'div' && false);
          if (n.ex && n.ex[i]) out += '\\cdot ';
          else if (numNext && prev.t !== 'deriv') out += '\\cdot ';
          else out += '\\,';
        }
        out += s;
      });
      return out;
    }
    case 'div': return '\\frac{' + tex(stripGrp(n.a), 0) + '}{' + tex(stripGrp(n.b), 0) + '}';
    case 'pow': {
      if (n.fnpow && n.a.t === 'call'){ // sin^2(x)
        const f = n.a; const head = TEXFN[f.fn] || f.fn;
        return head + '^{' + tex(stripGrp(n.b), 0) + '}' + texArgs(f.args);
      }
      let base = n.a;
      let bs = tex(base, 6);
      if (base.t === 'sym' && base.sub) bs = '{' + bs + '}';
      if (base.t === 'call' || base.t === 'conj' || base.t === 'dag') bs = (base.t === 'call' && !TEXFN[base.fn] && base.fn !== 'sqrt') ? wrap(bs) : bs;
      if (base.t === 'grp' && base.br === '(') bs = wrap(tex(base.a, 0));
      else if (base.t === 'abs' || base.t === 'norm' || base.t === 'grp' || base.t === 'expect' || base.t === 'braket') bs = '{' + bs + '}';
      return bs + '^{' + tex(stripGrp(n.b), 0) + '}';
    }
    case 'conj': return (n.a.t === 'sym' || n.a.t === 'call' || n.a.t === 'grp' || n.a.t === 'abs' || n.a.t === 'braket') ? '{' + tex(n.a, 9) + '}^{*}' : wrap(tex0(n.a)) + '^{*}';
    case 'dag': return (n.a.t === 'sym' || n.a.t === 'grp' || n.a.t === 'ket' || n.a.t === 'bra') ? '{' + tex(n.a, 9) + '}^{\\dagger}' : wrap(tex0(n.a)) + '^{\\dagger}';
    case 'fact': return (n.a.t === 'sym' || (n.a.t === 'num' && n.a.v >= 0) ? tex(n.a, 9) : '\\left(' + tex(stripGrp(n.a), 0) + '\\right)') + '!';
    case 'prime': return '{' + tex(n.a, 9) + '}^{' + '\\prime'.repeat(n.n) + '}';
    case 'norm': return '\\left\\lVert ' + tex(n.a, 0) + '\\right\\rVert ';
    case 'abs': return '\\left|' + tex(n.a, 0) + '\\right|';
    case 'call': {
      if (n.fn === 'sqrt') return '\\sqrt{' + tex(stripGrp(n.args[0]), 0) + '}';
      if (typeof n.fn === 'object'){ // ψ(x), f'(x)
        let head = texSym(n.fn); if (n.primes) head += '^{' + '\\prime'.repeat(n.primes) + '}';
        if (n.fn.t === 'prime') head = tex(n.fn, 9);
        return head + texArgs(n.args);
      }
      if (n.fn === 'hermite') return 'H_{' + tex(n.args[0], 0) + '}\\left(' + n.args.slice(1).map(a => tex(a, 0)).join(',') + '\\right)';
      if (n.fn === 'fact' && n.args.length === 1){ const a = n.args[0]; return (a.t === 'sym' || (a.t === 'num' && a.v >= 0) ? tex(a, 9) : '\\left(' + tex(stripGrp(a), 0) + '\\right)') + '!'; }
      if (n.fn === 'binom') return '\\binom{' + tex(n.args[0], 0) + '}{' + tex(n.args[1] || {t:'num', v:0}, 0) + '}';
      const head = TEXFN[n.fn] || '\\operatorname{' + n.fn + '}';
      if (n.args.noParen && n.args.length === 1 && (n.args[0].t === 'sym' || n.args[0].t === 'num')) return head + ' ' + tex(n.args[0], 9);
      return head + texArgs(n.args);
    }
    case 'deriv': {
      const d = n.partial ? '\\partial' : '\\mathrm{d}';
      const ord = n.n > 1 ? '^{' + n.n + '}' : '';
      const v = texName(n.v.replace("'", '')) + (n.v.endsWith("'") ? "'" : '');
      if (n.leibniz) return '\\frac{' + d + ord + ' ' + tex(n.a, 9) + '}{' + d + ' ' + v + ord + '}';
      const op = '\\frac{' + d + ord + '}{' + d + ' ' + v + ord + '}';
      if (n.a) return op + '\\left[' + tex(stripGrp(n.a), 0) + '\\right]';
      return op;
    }
    case 'lap': return n.grad ? '\\nabla' : '\\nabla^{2}';
    case 'int': {
      const b = (n.lo ? '_{' + tex(n.lo, 0) + '}' : '') + (n.hi ? '^{' + tex(n.hi, 0) + '}' : '');
      const v = texName(n.v.replace("'", '')) + (n.v.endsWith("'") ? "'" : '');
      if (n.dfirst) return '\\int' + b + '\\mathrm{d}' + v + '\\,' + tex(n.a, 3);
      return '\\int' + b + ' ' + tex(n.a, 1) + '\\,\\mathrm{d}' + v;
    }
    case 'evalbr': return '\\Big[' + tex(n.a, 0) + '\\Big]_{' + (n.v ? texName(n.v) + '=' : '') + tex(n.lo, 0) + '}^{' + tex(n.hi, 0) + '}';
    case 'sum': {
      let b = '';
      if (n.v) b = '_{' + texName(n.v) + (n.lo ? '=' + tex(n.lo, 0) : '') + '}';
      if (n.hi) b += '^{' + tex(n.hi, 0) + '}';
      return '\\sum' + b + ' ' + tex(n.a, 3);
    }
    case 'comm': return n.anti ? '\\left\\{' + tex(n.a, 0) + ',' + tex(n.b, 0) + '\\right\\}' : '\\left[' + tex(n.a, 0) + ',' + tex(n.b, 0) + '\\right]';
    case 'ket': return '\\left|' + texLab(n.lab) + '\\right\\rangle';
    case 'bra': return '\\left\\langle ' + texLab(n.lab) + '\\right|';
    case 'braket': return n.op ? '\\left\\langle ' + texLab(n.bra) + '\\middle|' + tex(n.op, 0) + '\\middle|' + texLab(n.ket) + '\\right\\rangle'
                               : '\\left\\langle ' + texLab(n.bra) + '\\middle|' + texLab(n.ket) + '\\right\\rangle';
    case 'expect': return '\\left\\langle ' + tex(n.a, 0) + '\\right\\rangle';
    case 'mat': return '\\begin{pmatrix}' + n.rows.map(r => r.map(e => tex(e, 0)).join('&')).join('\\\\') + '\\end{pmatrix}';
    case 'unc': return '\\Delta ' + tex(n.a, 9);
    case 'tensor': return tex(n.a, 3) + '\\otimes ' + tex(n.b, 3);
  }
  return '?';
}
function stripGrp(n){ return (n && n.t === 'grp' && n.br === '(') ? n.a : n; }
function texArgs(args){ return '\\left(' + args.map(a => tex(a, 0)).join(',') + '\\right)'; }
function texStmt(st){
  let s = '';
  if (st.cont) s += RELTEX[st.rels[0]] + ' ';
  st.parts.forEach((p, i) => { if (i) s += ' ' + RELTEX[st.rels[st.cont ? i : i - 1]] + ' '; s += tex(p, 0); });
  return s;
}
function texLine(line){
  const J = {'⇒':'\\;\\Rightarrow\\;', '⇔':'\\;\\Leftrightarrow\\;', ';':';\\quad ', ',':',\\quad ', 'w':'\\quad '};
  let s = '';
  line.stmts.forEach((st, i) => { if (i) s += J[st.join] || '\\quad '; s += texStmt(st); });
  return s;
}
