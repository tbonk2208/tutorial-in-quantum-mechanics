/* ===== Komplexe Zahlen und spezielle Funktionen ===== */
class C { constructor(re, im){ this.re = re; this.im = im || 0; } }
const cx = (re, im) => new C(re, im || 0);
const C0 = cx(0, 0), C1 = cx(1, 0), CI = cx(0, 1);
const isC = v => v instanceof C;
const cadd = (a, b) => new C(a.re + b.re, a.im + b.im);
const csub = (a, b) => new C(a.re - b.re, a.im - b.im);
const cmul = (a, b) => new C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const cscale = (a, s) => new C(a.re * s, a.im * s);
const cneg = a => new C(-a.re, -a.im);
const cconj = a => new C(a.re, -a.im);
const cabs = a => Math.hypot(a.re, a.im);
const carg = a => Math.atan2(a.im, a.re);
function cdiv(a, b){
  const d = b.re * b.re + b.im * b.im;
  if (d === 0) return new C(NaN, NaN);
  return new C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
}
function cexp(a){ const e = Math.exp(a.re); return a.im === 0 ? new C(e, 0) : new C(e * Math.cos(a.im), e * Math.sin(a.im)); }
function clog(a){ return new C(Math.log(cabs(a)), carg(a)); }
function csqrt(a){
  if (a.im === 0) return a.re >= 0 ? new C(Math.sqrt(a.re), 0) : new C(0, Math.sqrt(-a.re));
  const r = cabs(a), re = Math.sqrt((r + a.re) / 2), im = Math.sign(a.im) * Math.sqrt((r - a.re) / 2);
  return new C(re, im);
}
function cpowInt(a, n){
  if (n === 0) return C1;
  if (n < 0) return cdiv(C1, cpowInt(a, -n));
  let r = C1, b = a;
  while (n > 0){ if (n & 1) r = cmul(r, b); b = cmul(b, b); n >>= 1; }
  return r;
}
function cpow(a, b){
  if (b.im === 0 && Number.isInteger(b.re) && Math.abs(b.re) <= 64) return cpowInt(a, b.re);
  if (a.im === 0 && b.im === 0 && a.re >= 0) return new C(Math.pow(a.re, b.re), 0);
  if (a.re === 0 && a.im === 0) return (b.re > 0) ? C0 : new C(NaN, NaN);
  return cexp(cmul(b, clog(a)));
}
function csin(a){ return new C(Math.sin(a.re) * Math.cosh(a.im), Math.cos(a.re) * Math.sinh(a.im)); }
function ccos(a){ return new C(Math.cos(a.re) * Math.cosh(a.im), -Math.sin(a.re) * Math.sinh(a.im)); }
function ctan(a){ return cdiv(csin(a), ccos(a)); }
function csinh(a){ return new C(Math.sinh(a.re) * Math.cos(a.im), Math.cosh(a.re) * Math.sin(a.im)); }
function ccosh(a){ return new C(Math.cosh(a.re) * Math.cos(a.im), Math.sinh(a.re) * Math.sin(a.im)); }
function ctanh(a){ return cdiv(csinh(a), ccosh(a)); }
function catan(a){ // atan z = i/2 ln((i+z)/(i-z))
  if (a.im === 0) return new C(Math.atan(a.re), 0);
  return cmul(new C(0, 0.5), clog(cdiv(cadd(CI, a), csub(CI, a))));
}
function casin(a){ if (a.im === 0 && Math.abs(a.re) <= 1) return new C(Math.asin(a.re), 0);
  return cmul(new C(0, -1), clog(cadd(cmul(CI, a), csqrt(csub(C1, cmul(a, a)))))); }
function cacos(a){ if (a.im === 0 && Math.abs(a.re) <= 1) return new C(Math.acos(a.re), 0);
  return csub(new C(Math.PI / 2, 0), casin(a)); }
const near = (a, b, tol) => cabs(csub(a, b)) <= tol;

/* reelle Hilfsfunktionen */
function gammaR(x){
  if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gammaR(1 - x));
  const g = 7, p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  x -= 1; let a = p[0]; const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += p[i] / (x + i);
  return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
}
function factR(n){
  if (Number.isInteger(n) && n >= 0 && n <= 170){ let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
  return gammaR(n + 1);
}
function binomR(n, k){ return factR(n) / (factR(k) * factR(n - k)); }
function erfR(x){
  const ax = Math.abs(x);
  if (ax < 2.5){ // Taylorreihe
    let s = 0, t = x, n = 0;
    while (Math.abs(t) > 1e-17 * Math.abs(s) || n < 3){ s += t / (2 * n + 1); n++; t *= -x * x / n; if (n > 200) break; }
    return 2 / Math.sqrt(Math.PI) * s;
  }
  // Kettenbruch für erfc
  let f = 0; for (let k = 60; k >= 1; k--) f = k / 2 / (ax + f);
  const erfc = Math.exp(-ax * ax) / Math.sqrt(Math.PI) / (ax + f);
  return Math.sign(x) * (1 - erfc);
}
/* Hermite-Polynome (Physiker-Konvention) für komplexes Argument */
function hermiteC(n, z){
  if (n === 0) return C1;
  let h0 = C1, h1 = cscale(z, 2);
  for (let k = 1; k < n; k++){ const h2 = csub(cscale(cmul(z, h1), 2), cscale(h0, 2 * k)); h0 = h1; h1 = h2; }
  return h1;
}
/* zugeordnete Laguerre-Polynome L_n^k */
function laguerreC(n, k, z){
  if (n === 0) return C1;
  let l0 = C1, l1 = csub(cx(1 + k), z);
  for (let m = 1; m < n; m++){
    const l2 = cscale(csub(cmul(csub(cx(2 * m + 1 + k), z), l1), cscale(l0, m + k)), 1 / (m + 1));
    l0 = l1; l1 = l2;
  }
  return l1;
}
/* zugeordnete Legendre-Funktionen P_l^m(x) mit Condon-Shortley-Phase, reelles x in [-1,1] */
function legendreR(l, m, x){
  const am = Math.abs(m);
  if (am > l) return 0;
  let pmm = 1;
  if (am > 0){ const s = Math.sqrt((1 - x) * (1 + x)); let f = 1; for (let i = 1; i <= am; i++){ pmm *= -f * s; f += 2; } }
  let res;
  if (l === am) res = pmm;
  else {
    let pmmp1 = x * (2 * am + 1) * pmm;
    if (l === am + 1) res = pmmp1;
    else { let pll = 0; for (let ll = am + 2; ll <= l; ll++){ pll = (x * (2 * ll - 1) * pmmp1 - (ll + am - 1) * pmm) / (ll - am); pmm = pmmp1; pmmp1 = pll; } res = pll; }
  }
  if (m < 0) res *= Math.pow(-1, am) * factR(l - am) / factR(l + am);
  return res;
}
/* Kugelflächenfunktionen Y_l^m(θ,φ), Konvention wie Griffiths/Sakurai (Condon-Shortley) */
function YlmC(l, m, th, ph){
  if (!Number.isInteger(l) || !Number.isInteger(m) || Math.abs(m) > l || l < 0) return C0;
  const N = Math.sqrt((2 * l + 1) / (4 * Math.PI) * factR(l - m) / factR(l + m));
  const P = legendreR(l, m, Math.cos(th));
  return cscale(cexp(new C(0, m * ph)), N * P);
}

/* deterministischer Zufall */
function rng(seed){
  let a = seed >>> 0;
  return function(){ a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function hashStr(s){ let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
