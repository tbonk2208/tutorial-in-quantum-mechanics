/* ===== Eingabe normalisieren und in Zeichen (Tokens) zerlegen ===== */
const GREEK = {alpha:'α', beta:'β', gamma:'γ', Gamma:'Γ', delta:'δ', Delta:'Δ', epsilon:'ε', varepsilon:'ε', zeta:'ζ', eta:'η',
  theta:'θ', vartheta:'θ', Theta:'Θ', iota:'ι', kappa:'κ', lambda:'λ', Lambda:'Λ', mu:'μ', nu:'ν', xi:'ξ', Xi:'Ξ', pi:'π', Pi:'Π',
  rho:'ρ', sigma:'σ', Sigma:'Σ', tau:'τ', upsilon:'υ', phi:'φ', varphi:'φ', Phi:'Φ', chi:'χ', psi:'ψ', Psi:'Ψ', omega:'ω', Omega:'Ω'};
const FUNCS = new Set(['sin','cos','tan','cot','sinh','cosh','tanh','coth','arcsin','arccos','arctan','asin','acos','atan','exp','ln','log',
  'sqrt','conj','Re','Im','abs','sgn','det','tr','Tr','erf','hermite','laguerre','legendre','fact','binom']);
const WORDS = Object.assign({hbar:'ħ', inf:'∞', infty:'∞', infinity:'∞', int:'∫', sum:'Σ', nabla:'∇', partial:'∂', dagger:'†', pm:'±', sqrt:'sqrt'}, GREEK);
const STOP = new Set(['und','oder','mit','für','fur','also','sei','seien','gilt','folgt','weil','wobei','bzw','sowie','wegen','nach','und','dann','somit','damit','hier','wenn','falls','setze','setzen','nun','denn','and','with','for','where','thus','hence','das','die','der','ist','sind']);
const SUP = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁺':'+','⁻':'-','⁼':'=','⁽':'(','⁾':')','ⁿ':'n','ⁱ':'i','ˣ':'x'};
const SUB = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','₊':'+','₋':'-','₌':'=','₍':'(','₎':')',
  'ₐ':'a','ₑ':'e','ₒ':'o','ₓ':'x','ₕ':'h','ₖ':'k','ₗ':'l','ₘ':'m','ₙ':'n','ₚ':'p','ₛ':'s','ₜ':'t'};
const HATS = {'â':'a','Â':'A','ê':'e','Ê':'E','ô':'o','Ô':'O','û':'u','Û':'U','ĉ':'c','Ĉ':'C','ĝ':'g','Ĝ':'G','ĥ':'h','Ĥ':'H','ĵ':'j','Ĵ':'J','ŝ':'s','Ŝ':'S','ŵ':'w','Ŵ':'W','ŷ':'y','Ŷ':'Y','x̂':'x'};
const isLetter = ch => /[A-Za-zα-ωΑ-Ωħ]/.test(ch);
const isTextLetter = ch => /[A-Za-zäöüÄÖÜß]/.test(ch);

/* LaTeX-Teilmenge in die Eingabesprache übersetzen */
function fromLatex(s){
  if (s.indexOf('\\') < 0) return s;
  const grp = (str, i) => { // liest {...} ab Position i (str[i]==='{'), gibt [inhalt, ende]
    let d = 0, j = i;
    for (; j < str.length; j++){ if (str[j] === '{') d++; else if (str[j] === '}'){ d--; if (d === 0) break; } }
    return [str.slice(i + 1, j), j + 1];
  };
  const arg = (str, i) => { while (str[i] === ' ') i++; if (str[i] === '{') return grp(str, i); if (str[i] === '\\'){ const m = /^\\[A-Za-z]+/.exec(str.slice(i)); if (m) return [m[0], i + m[0].length]; } return [str[i] || '', i + 1]; };
  let out = '', i = 0;
  while (i < s.length){
    const ch = s[i];
    if (ch !== '\\'){ out += ch; i++; continue; }
    const m = /^\\([A-Za-z]+|.)/.exec(s.slice(i)); const cmd = m[1]; i += m[0].length;
    if (cmd === 'frac' || cmd === 'dfrac' || cmd === 'tfrac'){ const [a, j] = arg(s, i); const [b, k] = arg(s, j); out += '((' + fromLatex(a) + ')/(' + fromLatex(b) + '))'; i = k; }
    else if (cmd === 'sqrt'){ const [a, j] = arg(s, i); out += '√(' + fromLatex(a) + ')'; i = j; }
    else if (cmd === 'hat' || cmd === 'widehat'){ const [a, j] = arg(s, i); const t = fromLatex(a); out += t.slice(0, 1) + '̂' + t.slice(1); i = j; }
    else if (cmd === 'mathrm' || cmd === 'mathit' || cmd === 'text' || cmd === 'operatorname' || cmd === 'mathbf' || cmd === 'boldsymbol'){ const [a, j] = arg(s, i); out += fromLatex(a); i = j; }
    else if (cmd === 'left' || cmd === 'right' || cmd === 'big' || cmd === 'Big' || cmd === 'bigg' || cmd === 'Bigg' || cmd === 'displaystyle' || cmd === 'limits'){ if (s[i] === '.') i++; }
    else if (cmd === 'langle') out += '⟨'; else if (cmd === 'rangle') out += '⟩';
    else if (cmd === 'vert' || cmd === 'lvert' || cmd === 'rvert' || cmd === 'mid' || cmd === '|') out += '|';
    else if (cmd === 'cdot' || cmd === 'times') out += '*';
    else if (cmd === 'dagger') out += '†'; else if (cmd === 'hbar') out += 'ħ'; else if (cmd === 'infty') out += '∞';
    else if (cmd === 'partial') out += '∂'; else if (cmd === 'int') out += '∫'; else if (cmd === 'sum') out += 'Σ'; else if (cmd === 'nabla') out += '∇';
    else if (cmd === 'pm') out += '±'; else if (cmd === 'mp') out += '∓'; else if (cmd === 'approx') out += '≈';
    else if (cmd === 'Rightarrow' || cmd === 'implies') out += '⇒'; else if (cmd === 'Leftrightarrow' || cmd === 'iff') out += '⇔';
    else if (cmd === 'leq' || cmd === 'le') out += '≤'; else if (cmd === 'geq' || cmd === 'ge') out += '≥'; else if (cmd === 'neq' || cmd === 'ne') out += '≠';
    else if (cmd === 'uparrow') out += '↑'; else if (cmd === 'downarrow') out += '↓'; else if (cmd === 'otimes') out += '⊗';
    else if (cmd === '{') out += '{'; else if (cmd === '}') out += '}';
    else if (cmd === ',' || cmd === ';' || cmd === '!' || cmd === ':' || cmd === 'quad' || cmd === 'qquad' || cmd === ' ') out += ' ';
    else if (GREEK[cmd]) out += GREEK[cmd];
    else if (FUNCS.has(cmd)) out += ' ' + cmd + ' ';
    else if (cmd === 'ell') out += 'l';
    else out += cmd;
  }
  return out;
}

function normalize(src){
  let s = fromLatex(String(src));
  s = s.replace(/[−–‒]/g, '-').replace(/[·⋅×∙]/g, '*').replace(/÷/g, '/').replace(/ℏ/g, 'ħ')
       .replace(/ϕ/g, 'φ').replace(/ϑ/g, 'θ').replace(/ϵ/g, 'ε').replace(/∆/g, 'Δ').replace(/〈/g, '⟨').replace(/〉/g, '⟩')
       .replace(/<=>|⟺|↔/g, '⇔').replace(/=>|⟹/g, '⇒').replace(/<=/g, '≤').replace(/>=/g, '≥').replace(/!=/g, '≠').replace(/~=/g, '≈')
       .replace(/\^\s*dagger/g, '†').replace(/\^\s*†/g, '†').replace(/≡/g, '=').replace(/′/g, "'").replace(/″/g, "''")
       .replace(/∑/g, 'Σ').replace(/ℓ/g, 'l').replace(/√\s*/g, '√');
  // Hochgestellte und tiefgestellte Zeichen
  let out = '';
  for (let i = 0; i < s.length; ){
    const ch = s[i];
    if (SUP[ch] !== undefined){
      let j = i, t = ''; while (j < s.length && SUP[s[j]] !== undefined){ t += SUP[s[j]]; j++; }
      if (t === '+' && i > 0 && /[A-Za-zα-ωΑ-Ω)̂]/.test(s[i - 1])) out += '†'; else out += '^{' + t + '}';
      i = j; continue;
    }
    if (SUB[ch] !== undefined){
      let j = i, t = ''; while (j < s.length && SUB[s[j]] !== undefined){ t += SUB[s[j]]; j++; }
      out += '_{' + t + '}'; i = j; continue;
    }
    out += ch; i++;
  }
  return out;
}

function lex(src){
  const s = normalize(src);
  const T = [];
  let i = 0, depth = 0;
  const push = (k, v, extra) => { const t = Object.assign({k, v, s:sp, at:i}, extra || {}); T.push(t); sp = false; return t; };
  let sp = false;
  while (i < s.length){
    const ch = s[i];
    if (/\s/.test(ch)){ sp = true; i++; continue; }
    // Zahl
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(s[i + 1] || ''))){
      let j = i; while (j < s.length && /[0-9]/.test(s[j])) j++;
      const prevCh = s.slice(0, i).replace(/\s+$/, '').slice(-1);
      if ((s[j] === '.' || (s[j] === ',' && depth === 0 && !'|⟨<,'.includes(prevCh || '#'))) && /[0-9]/.test(s[j + 1] || '')){
        let k2 = j + 1; while (k2 < s.length && /[0-9]/.test(s[k2])) k2++;
        if (!(s[j] === ',' && /^\s*[⟩>|]/.test(s.slice(k2)))){ j = k2; }
      }
      const txt = s.slice(i, j).replace(',', '.'); push('num', parseFloat(txt), {txt}); i = j; continue;
    }
    if (ch === 'Σ' || ch === 'Δ'){ push('op', ch); i++; continue; }
    // Buchstaben
    if (isLetter(ch) || HATS[ch] || /[äöüÄÖÜß]/.test(ch)){
      let j = i; while (j < s.length && s[j] !== 'Σ' && s[j] !== 'Δ' && (isLetter(s[j]) || HATS[s[j]] || s[j] === '̂' || /[äöüÄÖÜß]/.test(s[j]))) j++;
      const run = s.slice(i, j); const start = i; i = j;
      const plain = run.replace(/̂/g, '');
      if (/[äöüÄÖÜß]/.test(run) || STOP.has(plain.toLowerCase()) && run.length >= 2 && !WORDS[plain]){ push('word', run); continue; }
      // in einzelne Bezeichner zerlegen
      const parts = []; let k = 0;
      while (k < run.length){
        let c = run[k];
        if (HATS[c]){ parts.push({v:HATS[c], hat:true}); k++; continue; }
        // längstes bekanntes Wort ab k
        let best = '';
        for (let L = Math.min(12, run.length - k); L >= 2; L--){ const w = run.slice(k, k + L); if (w.indexOf('̂') < 0 && (WORDS[w] || FUNCS.has(w) || w === 'hat') && !((w === 'Re' || w === 'Im') && (run !== w || s[i] !== '('))){ best = w; break; } }
        if (best){ parts.push({v:best, word:true}); k += best.length; continue; }
        const hat = run[k + 1] === '̂';
        parts.push({v:c, hat}); k += hat ? 2 : 1;
      }
      if (run.length >= 4 && /^[a-zäöü]+$/.test(run) && parts.filter(p => !p.word).length >= 4){ push('word', run); continue; }
      for (const p of parts){
        if (p.word){
          const w = p.v;
          if (w === 'hat'){ push('hatkw', 'hat'); continue; }
          if (WORDS[w] && WORDS[w].length === 1 && (!isLetter(WORDS[w]) || WORDS[w] === 'Σ' || WORDS[w] === 'Δ')){ push('op', WORDS[w]); continue; }
          if (w === 'Gamma' && p === parts[parts.length - 1] && s[i] === '('){ push('id', 'Gamma', {fn:true, hat:false}); continue; }
          if (WORDS[w] && WORDS[w] !== 'sqrt'){ push('id', WORDS[w], {hat:false}); continue; }
          push('id', w, {fn:true, hat:false}); continue;
        }
        if (p.v === 'Γ' && p === parts[parts.length - 1] && s[i] === '('){ push('id', 'Gamma', {fn:true, hat:false}); continue; }
        push('id', p.v, {hat:!!p.hat});
      }
      // Ziffern direkt hinter einem Buchstaben: Index (x0 -> x_0)
      if (/[0-9]/.test(s[i] || '') && T.length && T[T.length - 1].k === 'id' && !T[T.length - 1].fn){
        let j2 = i; while (j2 < s.length && /[0-9]/.test(s[j2])) j2++;
        T[T.length - 1].autoSub = s.slice(i, j2); i = j2;
      }
      continue;
    }
    // Operatoren und Zeichen
    if (ch === ':' && s[i + 1] === '='){ push('op', ':='); i += 2; continue; }
    if (ch === '^' && s[i + 1] === '*'){ push('op', '^*'); i += 2; continue; }
    if (ch === '^' && s[i + 1] === '+' && !/[0-9A-Za-zα-ωΑ-Ω(ħπ{]/.test(s[i + 2] || '')){ push('op', '†'); i += 2; continue; }
    if (ch === '*'){
      const prev = T[T.length - 1], nx = s[i + 1] || '';
      const attached = !sp && prev && (prev.k === 'id' || (prev.k === 'op' && (prev.v === ')' || prev.v === '⟩')));
      if (attached && (nx === '' || /[\s)\]|⟩=+\-,;}⇒⇔]/.test(nx))){ push('op', '^*'); i++; continue; }
      push('op', '*'); i++; continue;
    }
    if ('([{⟨'.includes(ch)) depth++;
    if (')]}⟩'.includes(ch)) depth = Math.max(0, depth - 1);
    if ("+-/^_()[]{},;|⟨⟩<>=!'≈≠≤≥⇒⇔∫Σ√∂∇Δ∞↑↓→←⊗†±∓∈:&.~?".includes(ch)){
      if (ch === '&' || ch === '~'){ i++; sp = true; continue; }
      if (ch === '.'){ i++; continue; }
      push('op', ch); i++; continue;
    }
    push('bad', ch); i++;
  }
  push('eof', '');
  return T;
}
