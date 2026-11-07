/* ===== Thema 11: Stationäre Störungstheorie ===== */
(function(){
const R = String.raw;
/* Skizzen (SKIZZE.md), L = 1, E_m = m²E_1.
   (1) Punktförmige Störung α δ(x − a): E_n^(1)(a) = α|ψ_n(a)|² (Kasten: 2 sin²(nπa); Oszillator: |ψ_n(a)|² mit Hermite-Rekursion, a in x0).
   (2) Stufe V0 auf 0 < x < 1/2: ψ_1^(1) = Σ_{m≠1} V_m1/(E_1 − E_m) ψ_m mit V_m1/V0 = 2∫_0^{1/2} sin(mπx) sin(πx) dx = sin((m−1)π/2)/((m−1)π) − sin((m+1)π/2)/((m+1)π);
       c_2 = −0,1415 V0/E1, c_3 = 0, c_4 = +0,0113 V0/E1, abgebrochen bei m = 80 (c_m ~ 1/m³). Nur gerade m tragen bei: ψ_1^(1) ist antisymmetrisch zu L/2.
       Probe: (Ĥ0 − E1)ψ_1^(1) = (E_1^(1) − Ĥ')ψ_1 numerisch auf etwa 2 % erfüllt. */
const STOER_SK = (() => {
  const P = Math.PI;
  const Vm1 = m => { const g = k => Math.sin(k * P / 2) / (k * P); return g(m - 1) - g(m + 1); };
  const c = []; for (let m = 2; m <= 80; m++) c[m] = Vm1(m) / (1 - m * m);
  const psi1c = x => { let s = 0; for (let m = 2; m <= 80; m++) if (c[m]) s += c[m] * Math.SQRT2 * Math.sin(m * P * x); return s; };
  const herm = (n, x) => { let h0 = 1, h1 = 2 * x; if (n === 0) return h0; for (let k = 1; k < n; k++){ const h2 = 2 * x * h1 - 2 * k * h0; h0 = h1; h1 = h2; } return h1; };
  const fac = n => n <= 1 ? 1 : n * fac(n - 1);
  const osc = n => x => herm(n, x) * Math.exp(-x * x / 2) / Math.sqrt(Math.pow(2, n) * fac(n) * Math.sqrt(P));
  const xt = n => Math.sqrt(2 * n + 1);
  const mkF = (id, n) => ({id, title:'Punktförmige Störung im Oszillator, Zustand $n = ' + n + '$', kind:'curve', draw:'abs2',
    text:'Ein harmonischer Oszillator im Zustand $|' + n + '\\rangle$ bekommt die Störung $\\hat H\' = \\alpha\\,\\delta(x - a)$ mit $\\alpha > 0$. Skizziere die Energiekorrektur erster Ordnung $E_' + n + '^{(1)}$ als Funktion der Lage $a$ der Störung. Die klassischen Umkehrpunkte des Zustands liegen bei $\\pm\\sqrt{' + (2 * n + 1) + '}\\,x_0$. Die Höhe ist frei.',
    plot:{x:[-4.5, 4.5], xlab:'a/x_0', ylab:'E_' + n + '^{(1)}(a)', ticks:[{x:-xt(n), lab:'-\\sqrt{' + (2 * n + 1) + '}'}, {x:0, lab:'0'}, {x:xt(n), lab:'\\sqrt{' + (2 * n + 1) + '}'}], V:x => x * x / 2, Vr:[0, 8], E:n + 0.5},
    f:x => osc(n)(x) ** 2,
    checks:[
      {id:'pos', type:'nonneg', msg:'Kann die Korrektur für $\\alpha > 0$ negativ werden?'},
      {id:'knoten', type:'nodes', n, msg:'An wie vielen Stellen $a$ spürt der Zustand die Störung in erster Ordnung gar nicht? Deine Skizze hat {got}.'},
      n === 1 ? {id:'lage', name:'Lage der Nullstellen', type:'zero', at:[0], tol:0.2, msg:'Spürt der Zustand $|1\\rangle$ eine Störung im Minimum des Potentials?'}
        : {id:'lage', name:'Lage der Nullstellen', type:'zero', at:[-Math.SQRT1_2, Math.SQRT1_2], tol:0.2, msg:'Wo hat $\\psi_2 \\propto (4\\xi^2 - 2)\\,e^{-\\xi^2/2}$ seine Nullstellen?'},
      {id:'aussen', name:'jenseits des Umkehrpunkts', type:'decay', toward:'right', range:[xt(n) + 0.15, 4.5], msg:'Spürt der Zustand eine Störung jenseits des Umkehrpunkts? Was macht $\\psi_' + n + '$ dort?'}
    ],
    reveal:'$E_' + n + '^{(1)}(a) = \\langle ' + n + '|\\alpha\\,\\delta(x - a)|' + n + '\\rangle = \\alpha|\\psi_' + n + '(a)|^2$: Die Korrektur erster Ordnung ist der Erwartungswert der Störung im ungestörten Zustand. '
      + (n === 1 ? 'Sie ist null im Knoten von $\\psi_1$ bei $a = 0$ und am größten bei $a = \\pm x_0$.' : 'Sie ist null in den Knoten von $\\psi_2$ bei $a = \\pm x_0/\\sqrt2$; dazwischen und außen liegen drei Buckel, die äußeren etwas höher als der mittlere.')
      + ' Jenseits der Umkehrpunkte fällt sie rasch ab, ist aber nicht null: Das Teilchen hält sich mit kleiner Wahrscheinlichkeit auch im klassisch verbotenen Bereich auf.',
    wrong:[
      {f:osc(n), fails:['pos'], why:'$\\psi_' + n + '(a)$ statt $|\\psi_' + n + '(a)|^2$'},
      {f:x => osc(0)(x) ** 2, fails:['knoten', 'lage'], why:'wie im Grundzustand: Eine Störung im Minimum wirke immer am stärksten'},
      {f:x => osc(n)(x) ** 2 * Math.max(0, 1 - (x / xt(n)) ** 6), fails:['aussen'], why:'jenseits der Umkehrpunkte spüre das Teilchen nichts ($\\psi = 0$ im verbotenen Bereich)'}
    ], points:3});
  return {psi1c, box2:a => 2 * Math.sin(2 * P * a) ** 2, mkF};
})();
const STBOX = ops => CTX.box({params:{L:'pos', m:'pos', n:{int:[1, 5]}, V_0:'pos', λ:'real'}, defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)'}, ops});
const STOSC = () => ({rep:'mat', mat:{preset:'osc'}, coords:['t'], params:{m:'pos', ω:'pos', λ:'real', n:{int:[0, 5]}}, sumFrom:0});
const STMAT = (mats, params, extra) => Object.assign({rep:'mat', mat:{preset:'spin', mats}, coords:['t'], params}, extra || {});
topic({
  id:'stoer', math:['m-eigen', 'm-hilbert'], title:'Stationäre Störungstheorie', short:'Störungstheorie',
  src:'Griffiths & Schroeter Kap. 7 · Nolting 5/2 · Schwabl Kap. 11',
  goals:[
    'Ich kann Energiekorrekturen erster Ordnung $E_n^{(1)} = \\langle n|\\hat H\'|n\\rangle$ berechnen und mit Symmetrie abschätzen.',
    'Ich kann die zweite Ordnung $E_n^{(2)} = \\sum_{m\\ne n}\\frac{|\\langle m|\\hat H\'|n\\rangle|^2}{E_n^{(0)} - E_m^{(0)}}$ mit Leiteroperatoren auswerten.',
    'Ich kann bei Entartung die Störung im entarteten Unterraum diagonalisieren und mit dem Variationsverfahren eine obere Schranke für die Grundzustandsenergie finden.'
  ],
  needs:'Eigenzustände und Energien von Kasten und Oszillator · Matrixelemente $\\langle m|\\hat x|n\\rangle$ mit $\\hat a, \\hat a^\\dagger$ · Eigenwerte von $2\\times2$-Matrizen',
  wozu:'Fast kein realistisches Problem ist exakt lösbar: ein Atom im elektrischen Feld (Stark-Effekt), ein Molekül mit nicht ganz harmonischer Bindung, die Feinstruktur des Wasserstoffs. Störungstheorie liefert Korrekturen zu einem gelösten Modell und erklärt damit, wie sich Spektrallinien verschieben und aufspalten. Das Variationsprinzip ist die Grundlage vieler Rechenverfahren der Quantenchemie.',
  bridge:'Die gelösten Modelle aus Thema 3 (Kasten), Thema 7 (Oszillator mit $\\hat a$, $\\hat a^\\dagger$) und Thema 9 (Wasserstoff) sind hier die ungestörten Probleme. Aus Thema 6 brauchst du Entwicklung nach einer Orthonormalbasis und Matrixelemente, aus M4 die Diagonalisierung kleiner Matrizen, aus M2 die Taylor-Reihe. Neu ist: Man rechnet nicht mehr exakt, sondern ordnet nach Potenzen einer kleinen Größe.',
  check:[
    {q:'$|n\\rangle$ ist Eigenzustand von $\\hat H_0$ mit $\\hat H_0|n\\rangle = E_n|n\\rangle$. Was ist $\\langle n|\\hat H_0|n\\rangle$?', opts:['$E_n$', '$0$', '$E_n^2$'], a:0, ex:'$\\langle n|\\hat H_0|n\\rangle = E_n\\langle n|n\\rangle = E_n$.', prev:'form'},
    {q:'Die Energien im unendlich hohen Kasten der Breite $L$ sind …', opts:['$E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2}$', '$E_n = \\hbar\\omega(n+\\frac12)$', '$E_n = \\frac{n\\pi\\hbar}{L}$'], a:0, ex:'Aus $k_n = n\\pi/L$ und $E = \\hbar^2k^2/(2m)$.', prev:'kasten'},
    {q:'Was ist $\\langle n|\\hat x|n\\rangle$ im harmonischen Oszillator?', opts:['$0$', '$\\sqrt{\\hbar/(2m\\omega)}$', '$n\\,\\hbar/(m\\omega)$'], a:0, ex:'$\\hat x\\propto\\hat a + \\hat a^\\dagger$ ändert $n$ um $\\pm1$; außerdem ist $|\\psi_n|^2$ gerade.', prev:'osz'},
    {q:'$\\int_0^{L/2}\\sin^2(n\\pi x/L)\\,dx$ ist für ganzzahliges $n \\ge 1$ …', opts:['$L/4$', '$L/2$', 'von $n$ abhängig'], a:0, ex:'$\\sin^2u = \\frac12(1 - \\cos2u)$; der Kosinus-Anteil gibt bei $x = L/2$ den Wert $\\sin(n\\pi) = 0$.', lex:'integrale'}
  ],
  diag:[
    {q:'Wie beginnst du, um die Energiekorrektur erster Ordnung für $\\hat H\' = \\lambda x$ im Grundzustand des Kastens zu berechnen?', opts:['$\\langle\\psi_1|\\lambda x|\\psi_1\\rangle$ mit der ungestörten Funktion $\\psi_1$ bilden', 'die Schrödingergleichung mit dem Potential $\\lambda x$ neu lösen', '$\\lambda x$ an der Stelle $x = L/2$ auswerten, wo das Teilchen ist', 'weiß ich noch nicht'], a:0, ex:'Erste Ordnung = Erwartungswert der Störung im ungestörten Zustand. Exakt neu zu lösen ist gerade das, was man vermeiden will. $\\lambda L/2$ ist hier richtig, weil die Störung linear ist und $\\langle x\\rangle = L/2$ gilt. Ein allgemeines Verfahren ist das nicht.'},
    {q:'Wie beginnst du, wenn zwei ungestörte Zustände dieselbe Energie haben und $\\langle 1|\\hat H\'|2\\rangle \\ne 0$ ist?', opts:['die $2\\times2$-Matrix von $\\hat H\'$ im entarteten Unterraum aufstellen und diagonalisieren', 'die Formel zweiter Ordnung mit der Summe über $m \\ne n$ ansetzen', 'für beide Zustände einzeln $\\langle n|\\hat H\'|n\\rangle$ berechnen', 'weiß ich noch nicht'], a:0, ex:'Bei Entartung wird ein Nenner $E_n^{(0)} - E_m^{(0)}$ null. Die Diagonalelemente allein übersehen die Kopplung $\\langle 1|\\hat H\'|2\\rangle$. Die Eigenwerte der $2\\times2$-Matrix sind die Korrekturen.'}
  ],
  phenomenon:{
    title:'Ein Atom im elektrischen Feld',
    text:'Ein Wasserstoffatom im Grundzustand wird in ein schwaches, homogenes elektrisches Feld $\\boldsymbol{\\mathcal E} = \\mathcal E\\hat z$ gebracht. Ein elektrischer Dipol $\\mathbf d$ hat in einem solchen Feld die Energie $-\\mathbf d\\cdot\\boldsymbol{\\mathcal E}$. Die Energieniveaus und damit die Spektrallinien verschieben sich; Johannes Stark hat das 1913 beobachtet.',
    q:{q:'Wie hängt die Verschiebung der Grundzustandsenergie für kleine Feldstärke $\\mathcal E$ davon ab?', opts:['linear in $\\mathcal E$, wie bei einem festen Dipol', 'quadratisch in $\\mathcal E$', 'gar nicht, denn das Atom ist neutral'], a:1,
      ex:'Die Verschiebung beginnt mit $\\mathcal E^2$.',
      fb:['Das gälte, wenn das Atom ein festes Dipolmoment hätte. Im Grundzustand ist die Ladungsverteilung des Elektrons aber kugelsymmetrisch: $\\langle z\\rangle = 0$.',
        'Richtig. Erst das Feld verschiebt die Elektronenwolke ein wenig und erzeugt einen Dipol proportional zu $\\mathcal E$. Die Energie ist dann proportional zu $\\mathcal E^2$.',
        'Neutral heißt nicht unempfindlich: Das Feld zieht Kern und Elektron in entgegengesetzte Richtungen und verformt das Atom.']},
    reveal:'Die Verschiebung ist **quadratisch** in $\\mathcal E$. Die Störung ist $\\hat H\' = e\\mathcal E\\hat z$ (Elektronenladung $-e$). In erster Ordnung bräuchte man $\\langle z\\rangle$ im Grundzustand, und das ist null, weil $|\\psi_{100}|^2$ kugelsymmetrisch ist. Erst in zweiter Ordnung verformt das Feld den Zustand: $E^{(2)} = -\\frac12\\alpha\\mathcal E^2$ mit der Polarisierbarkeit $\\alpha$.\n\nGanz anders beim Niveau $n = 2$: Dort sind $2s$ und $2p$ entartet, und die Verschiebung ist *linear* in $\\mathcal E$. Wie Störungstheorie beide Fälle erklärt, zeigt der Lerntext.'
  },
  teach:[
    /* ===== Abschnitt 1: Idee, Ansatz, Ordnungen ===== */
    {id:'stoer-t1', title:'Die Idee: ein gelöstes Problem plus eine kleine Störung', steps:[
      {id:'stoer-t1a', title:'Warum nähern?',
        num:{title:'Ein Zweiniveausystem', text:R`Durch das ganze Thema begleitet dich dieses Beispiel, Energien in eV:

$$\hat H_0 \doteq \begin{pmatrix}1 & 0\\ 0 & 3\end{pmatrix},\qquad \hat H' \doteq \begin{pmatrix}0{,}1 & 0{,}2\\ 0{,}2 & -0{,}1\end{pmatrix}.$$

$\hat H_0$ ist gelöst: Niveaus bei $1$ und $3\,\mathrm{eV}$. Die exakte tiefere Energie von $\hat H_0 + \hat H'$ ist $2 - \sqrt{0{,}85} \approx 1{,}0780\,\mathrm{eV}$. Wie nah kommt man ihr, ohne zu diagonalisieren?`},
        text:R`Exakt lösen kann man nur wenige Modelle: Kasten, Oszillator, Wasserstoff. Reale Systeme weichen davon ab. Ein Molekül schwingt nicht exakt harmonisch, ein Atom sitzt in einem äußeren Feld. Oft ist die Abweichung aber klein. Dann zerlegst du

$$\hat H = \hat H_0 + \lambda\hat H'$$

in ein gelöstes Problem $\hat H_0|n^{(0)}\rangle = E_n^{(0)}|n^{(0)}\rangle$ und eine **Störung** $\lambda\hat H'$. Gelesen: „n null“ für den ungestörten Zustand. Der Parameter $\lambda$ zählt nur die Ordnung mit; am Ende setzt man $\lambda = 1$. Bis Abschnitt 3 sei das betrachtete Niveau nicht entartet.`,
        q:{q:R`Ein Molekül hat das Potential $V = \tfrac12m\omega^2x^2 + \kappa x^3$ mit kleinem $\kappa$. Wie zerlegst du $\hat H$?`,
          opts:[R`$\hat H_0 = \frac{\hat p^2}{2m}$, $\hat H' = \tfrac12m\omega^2\hat x^2 + \kappa\hat x^3$`, R`$\hat H_0 = \frac{\hat p^2}{2m} + \tfrac12m\omega^2\hat x^2$, $\hat H' = \kappa\hat x^3$`, R`$\hat H_0 = \kappa\hat x^3$, $\hat H' = \frac{\hat p^2}{2m} + \tfrac12m\omega^2\hat x^2$`], a:1,
          ex:R`$\hat H_0$ ist der gelöste Oszillator aus Thema 7, die kleine Abweichung $\kappa\hat x^3$ ist die Störung.`,
          fb:[R`Das freie Teilchen ist zwar gelöst, aber das Potential $\tfrac12m\omega^2x^2$ ist keine kleine Störung.`, '',
            R`Vertauscht: Die Störung soll der kleine, ungelöste Teil sein, nicht der große, gelöste.`]}},
      {id:'stoer-t1b', title:R`Der Ansatz: Potenzreihen in $\lambda$`,
        num:{title:R`Das Beispiel mit $\lambda$`, text:R`Mit $\lambda$ vor der ganzen Störung ist $\hat H \doteq \begin{pmatrix}1 + 0{,}1\lambda & 0{,}2\lambda\\ 0{,}2\lambda & 3 - 0{,}1\lambda\end{pmatrix}$. Die exakte tiefere Energie, nach $\lambda$ entwickelt, ist

$$\begin{aligned}E(\lambda) &= 2 - \sqrt{1 - 0{,}2\lambda + 0{,}05\lambda^2}\\ &= 1 + 0{,}1\,\lambda - 0{,}02\,\lambda^2\\ &\quad - 0{,}002\,\lambda^3 + \dots\end{aligned}$$

Die Potenzen von $\lambda$ ordnen die Beiträge: Ordnung $0$ ist $1$, Ordnung $1$ ist $0{,}1$, Ordnung $2$ ist $-0{,}02$.`},
        text:R`Du nimmst an, dass Energie und Zustand glatt von $\lambda$ abhängen, und entwickelst nach Potenzen:

$$\begin{aligned}E_n &= E_n^{(0)} + \lambda E_n^{(1)} + \lambda^2E_n^{(2)} + \dots,\\ |n\rangle &= |n^{(0)}\rangle + \lambda|n^{(1)}\rangle + \lambda^2|n^{(2)}\rangle + \dots\end{aligned}$$

$E_n^{(1)}$, gelesen „E n eins“, ist die Korrektur erster Ordnung, $|n^{(1)}\rangle$ die Korrektur des Zustands. Die Reihe ist nur brauchbar, wenn jeder Beitrag deutlich kleiner ist als der vorige. Im Beispiel trifft das zu: $1$, dann $0{,}1$, dann $0{,}02$, dann $0{,}002$. Bei $\lambda = 1$ geben die ersten drei Glieder $1{,}08$, exakt sind es $1{,}0780$.`,
        q:{q:R`Wozu dient der Parameter $\lambda$ in $\hat H = \hat H_0 + \lambda\hat H'$?`,
          opts:['Er ist eine Naturkonstante, die die Stärke der Störung misst.', 'Er zählt die Ordnung mit und wird am Ende $1$ gesetzt.', 'Er macht die Störung $\\hat H\'$ hermitesch.'], a:1,
          ex:R`$\lambda$ ist ein Hilfsparameter: Jeder Faktor $\hat H'$ bringt ein $\lambda$ mit. Die physikalische Stärke steckt in $\hat H'$ selbst.`,
          fb:[R`Die Stärke steckt schon in $\hat H'$, etwa im Feld $\mathcal E$ oder in $\kappa$. $\lambda$ zählt nur mit.`, '',
            R`Hermitesch ist $\hat H'$ von selbst; ein reeller Faktor ändert daran nichts.`]}},
      {id:'stoer-t1c', title:'Ordnen nach Potenzen: eine Gleichung je Ordnung',
        pre:{from:'m-analysis', seg:'ma-t1', title:'Taylor-Reihen', text:R`Eine glatte Funktion lässt sich um einen Punkt als Potenzreihe schreiben: $f(\lambda) = f(0) + f'(0)\,\lambda + \tfrac12f''(0)\,\lambda^2 + \dots$ Zwei Reihen sind genau dann gleich, wenn alle Koeffizienten gleich sind. Mini-Beispiel: $\sqrt{1 + u} \approx 1 + \tfrac12u - \tfrac18u^2$.`},
        num:{title:'Ein Polynom, das überall null ist', text:R`Gilt $a_0 + a_1\lambda + a_2\lambda^2 = 0$ für $\lambda = 0$, $0{,}1$ und $0{,}2$, dann folgt aus $\lambda = 0$ sofort $a_0 = 0$. Die beiden anderen Werte geben

$$0{,}1\,a_1 + 0{,}01\,a_2 = 0,\qquad 0{,}2\,a_1 + 0{,}04\,a_2 = 0\quad\Rightarrow\quad a_1 = a_2 = 0.$$`},
        text:R`Setze beide Reihen in $\hat H|n\rangle = E_n|n\rangle$ ein:

$$\begin{aligned}&(\hat H_0 + \lambda\hat H')\big(|n^{(0)}\rangle + \lambda|n^{(1)}\rangle + \dots\big)\\ &= \big(E_n^{(0)} + \lambda E_n^{(1)} + \dots\big)\\ &\qquad\cdot\big(|n^{(0)}\rangle + \lambda|n^{(1)}\rangle + \dots\big).\end{aligned}$$

Multipliziere aus und sammle auf jeder Seite die Terme mit gleicher Potenz von $\lambda$. Ein Produkt trägt zu $\lambda^k$ bei, wenn die Ordnungen seiner beiden Faktoren zusammen $k$ ergeben. Jede Ordnung muss einzeln stimmen, weil die Gleichung für jedes kleine $\lambda$ gilt (Koeffizientenvergleich):

$$\lambda^0:\quad \hat H_0|n^{(0)}\rangle = E_n^{(0)}|n^{(0)}\rangle$$

$$\lambda^1:\quad \hat H_0|n^{(1)}\rangle + \hat H'|n^{(0)}\rangle = E_n^{(0)}|n^{(1)}\rangle + E_n^{(1)}|n^{(0)}\rangle$$

$$\lambda^2:\quad \hat H_0|n^{(2)}\rangle + \hat H'|n^{(1)}\rangle = E_n^{(0)}|n^{(2)}\rangle + E_n^{(1)}|n^{(1)}\rangle + E_n^{(2)}|n^{(0)}\rangle$$

Die nullte Ordnung ist das gelöste Problem. Die beiden anderen werten die nächsten Abschnitte aus.`,
        q:{q:R`Welcher Term gehört in die Gleichung zur Ordnung $\lambda^2$?`,
          opts:[R`$\hat H'|n^{(2)}\rangle$, denn er enthält $|n^{(2)}\rangle$`, R`$E_n^{(1)}|n^{(1)}\rangle$`, R`$E_n^{(2)}|n^{(2)}\rangle$`], a:1,
          ex:R`$\lambda E_n^{(1)}$ mal $\lambda|n^{(1)}\rangle$ gibt $\lambda^2$: Die Ordnungen $1 + 1$ ergeben $2$. Jede Ordnung muss einzeln stimmen, weil die Gleichung für jedes kleine $\lambda$ gilt.`,
          fb:[R`$\lambda\hat H'$ mal $\lambda^2|n^{(2)}\rangle$ gibt $\lambda^3$. Es zählt die Summe der Ordnungen beider Faktoren.`, '',
            R`$\lambda^2E_n^{(2)}$ mal $\lambda^2|n^{(2)}\rangle$ gibt $\lambda^4$.`]}},
      {id:'stoer-t1d', title:'Eine Wahl, die Arbeit spart',
        num:{title:'Ein Anteil längs des alten Zustands', text:R`Angenommen, $|n^{(1)}\rangle$ enthielte $0{,}3\,|n^{(0)}\rangle$. Dann wäre bis zur ersten Ordnung

$$|n\rangle = (1 + 0{,}3\lambda)\,|n^{(0)}\rangle + \dots$$

Das ist nur ein anderer Vorfaktor vor $|n^{(0)}\rangle$, also eine andere Normierung. Man darf ihn weglassen.`},
        text:R`Der Zustand ist nur bis auf Normierung und Phase festgelegt. Du darfst deshalb verlangen, dass die Korrekturen keinen Anteil längs $|n^{(0)}\rangle$ haben:

$$\langle n^{(0)}|n^{(1)}\rangle = 0,\qquad \langle n^{(0)}|n^{(2)}\rangle = 0.$$

Einen solchen Anteil könnte man in die Normierung stecken. Mit dieser Wahl ist $\langle n|n\rangle = 1 + O(\lambda^2)$, der Zustand also bis zur ersten Ordnung normiert. Die Korrektur $|n^{(1)}\rangle$ besteht dann nur aus den **anderen** Basiszuständen $|m^{(0)}\rangle$ mit $m \ne n$.`,
        q:{q:R`Warum darf man $\langle n^{(0)}|n^{(1)}\rangle = 0$ verlangen?`,
          opts:['Weil die Störung den Zustand $|n^{(0)}\\rangle$ nie verändert.', 'Weil ein Anteil längs $|n^{(0)}\\rangle$ nur Normierung und Phase ändert.', 'Weil $\\hat H\'$ keine Diagonalelemente hat.'], a:1,
          ex:R`$(1 + c\lambda)|n^{(0)}\rangle$ beschreibt denselben Zustand wie $|n^{(0)}\rangle$. Den Faktor kann man am Ende wegnormieren.`,
          fb:[R`Die Störung ändert den Zustand sehr wohl – aber durch Beimischung *anderer* Zustände.`, '',
            R`$\hat H'$ darf Diagonalelemente haben; im Beispiel ist $\langle 1|\hat H'|1\rangle = 0{,}1$.`]}},
      {id:'stoer-t1e', title:'Typischer Fehler: klein heißt kleiner Vorfaktor',
        num:{title:'Dieselbe Kopplung, zwei Abstände', text:R`Eine Kopplung von $0{,}5\,\mathrm{eV}$ zu einem Nachbarn im Abstand $10\,\mathrm{eV}$ gibt das Verhältnis

$$\frac{0{,}5}{10} = 0{,}05\qquad\text{gegen}\qquad \frac{0{,}5}{1} = 0{,}5$$

bei einem Nachbarn im Abstand $1\,\mathrm{eV}$. Nur im ersten Fall ist die Störung klein.`},
        text:R`„Klein heißt: $\hat H'$ hat einen kleinen Vorfaktor.“ Das ist ein verbreiteter Fehlschluss. Ob eine Störung klein ist, entscheidet der Vergleich mit den Niveauabständen, nicht die Größe einer Zahl allein. Die Matrixelemente $\langle m^{(0)}|\hat H'|n^{(0)}\rangle$ müssen klein gegen $|E_n^{(0)} - E_m^{(0)}|$ sein. Dieselbe Feldstärke kann für den Grundzustand des Wasserstoffs klein und für hoch angeregte, eng liegende Niveaus groß sein. Bei entarteten Niveaus ist der Abstand null; das braucht ein eigenes Verfahren (Abschnitt 4).`,
        q:{q:R`Störung A koppelt mit $1\,\mathrm{eV}$ an einen Nachbarn $50\,\mathrm{eV}$ entfernt. Störung B koppelt mit $0{,}02\,\mathrm{eV}$ an einen Nachbarn $0{,}01\,\mathrm{eV}$ entfernt. Wo ist Störungstheorie verlässlich?`,
          opts:[R`nur bei B, ihre Kopplung ist viel kleiner`, R`bei beiden, beide Kopplungen sind klein gegen $13{,}6\,\mathrm{eV}$`, R`nur bei A, das Verhältnis ist dort $0{,}02$`], a:2,
          ex:R`Maßstab ist $|\langle m|\hat H'|n\rangle|/|E_n^{(0)} - E_m^{(0)}|$: bei A $1/50 = 0{,}02$, bei B $0{,}02/0{,}01 = 2$. B ist trotz der kleinen Zahl eine starke Störung.`,
          fb:[R`Die Kopplung allein sagt nichts. Bei B ist sie doppelt so groß wie der Abstand zum Nachbarn.`,
            R`Der Maßstab ist der Abstand zum gekoppelten Nachbarn, nicht eine typische Atomenergie.`, '']}}
    ]},

    /* ===== Abschnitt 2: erste Ordnung ===== */
    {id:'stoer-t2', title:'Erste Ordnung: Energie und Zustand', steps:[
      {id:'stoer-t2a', title:'Die Energie erster Ordnung',
        pre:{from:'form', seg:'form-t2', title:'Hermitesch wirkt auch nach links', text:R`Ist $\hat A$ hermitesch, gilt $\langle\phi|\hat A\psi\rangle = \langle\hat A\phi|\psi\rangle$. Für einen Eigenzustand mit $\hat A|n\rangle = a|n\rangle$ und reellem $a$ folgt $\langle n|\hat A = a\,\langle n|$. Mini-Beispiel: $\langle n|\hat H_0|m\rangle = E_n\langle n|m\rangle$.`},
        num:{title:'Im Zweiniveausystem', text:R`Die Diagonalelemente von $\hat H'$ sind die Korrekturen erster Ordnung:

$$E_1^{(1)} = \langle 1|\hat H'|1\rangle = (1,\ 0)\begin{pmatrix}0{,}1 & 0{,}2\\ 0{,}2 & -0{,}1\end{pmatrix}\binom10 = 0{,}1.$$

Erste Ordnung: $E_1 \approx 1 + 0{,}1 = 1{,}1\,\mathrm{eV}$, exakt $1{,}078\,\mathrm{eV}$.`},
        text:R`Multipliziere die Gleichung erster Ordnung von links mit $\langle n^{(0)}|$:

$$\langle n^{(0)}|\hat H_0|n^{(1)}\rangle + \langle n^{(0)}|\hat H'|n^{(0)}\rangle = E_n^{(0)}\langle n^{(0)}|n^{(1)}\rangle + E_n^{(1)}\langle n^{(0)}|n^{(0)}\rangle.$$

Weil $\hat H_0$ [[lex:hermitescher-operator|hermitesch]] ist, wirkt es auch nach links: $\langle n^{(0)}|\hat H_0 = E_n^{(0)}\langle n^{(0)}|$. Der erste Term links ist deshalb gleich dem ersten Term rechts, beide fallen weg. Rechts ist $\langle n^{(0)}|n^{(0)}\rangle = 1$. Es bleibt

$$E_n^{(1)} = \langle n^{(0)}|\hat H'|n^{(0)}\rangle.$$

Die [[lex:stoerung-1|Korrektur erster Ordnung]] ist der Erwartungswert der Störung im *ungestörten* Zustand. Das Teilchen spürt die Störung dort, wo es sich aufhält. In einer Basis ist das ein Diagonalelement der Matrix von $\hat H'$.`,
        q:{q:R`Wie groß ist $E_2^{(1)}$ im Zweiniveausystem?`, tr:{from:'matrix', to:'formel'},
          opts:[R`$+0{,}2\,\mathrm{eV}$`, R`$-0{,}1\,\mathrm{eV}$`, R`$+0{,}1\,\mathrm{eV}$`], a:1,
          ex:R`$E_2^{(1)} = \langle 2|\hat H'|2\rangle$ ist der Eintrag unten rechts, $-0{,}1\,\mathrm{eV}$.`,
          fb:[R`$0{,}2$ ist das Nebendiagonalelement. Es koppelt die Zustände, wirkt aber erst in zweiter Ordnung auf die Energie.`, '',
            R`$+0{,}1$ gehört zu $\langle 1|\hat H'|1\rangle$, oben links.`]}},
      {id:'stoer-t2b', title:'Beispiel: eine Stufe in der Kastenmitte',
        num:{title:R`$n = 2$`, text:R`Im Kasten $0 < x < L$ sitzt $\hat H' = V_0$ auf $L/4 < x < 3L/4$. Für $n = 2$ wiederholt sich $|\psi_2|^2 = \tfrac2L\sin^2(2\pi x/L)$ nach jeweils $L/2$. Der Kasten enthält zwei solche Perioden, die Mitte von $L/4$ bis $3L/4$ genau eine. Also liegt genau die Hälfte der Wahrscheinlichkeit in der Mitte:

$$E_2^{(1)} = V_0\cdot\tfrac12 = \tfrac12V_0.$$`},
        text:R`Für eine Stufe ist $E_n^{(1)} = V_0\cdot P_n(\text{Mitte})$, die Höhe der Stufe mal die Wahrscheinlichkeit, das Teilchen im ungestörten Zustand dort zu finden. Für den Grundzustand ergibt die Herleitung $V_0\left(\frac12 + \frac1\pi\right) \approx 0{,}82\,V_0$. Er hat seinen Bauch in der Mitte und spürt deshalb mehr als die halbe Stufe. Für $n = 3$ sind es nur $V_0\left(\frac12 - \frac{1}{3\pi}\right) \approx 0{,}39\,V_0$. Für große $n$ verteilt sich $|\psi_n|^2$ immer gleichmäßiger, und $E_n^{(1)}$ geht gegen $V_0/2$.`,
        derive:{ctx:CTX.box({params:{L:'pos', m:'pos', V_0:'pos'}, defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)'}, ops:{"H'":'V_0 Θ(x - L/4) Θ(3L/4 - x)'}}), lines:[
          {l:"E^(1) = ⟨ψ_1|H'|ψ_1⟩", w:'Erwartungswert der Störung im ungestörten Grundzustand'},
          {l:'= 2V_0/L ∫_{L/4}^{3L/4} sin(πx/L)^2 dx', w:'Störung nur in der Mitte',
            why:{q:'Warum laufen die Grenzen nur von $L/4$ bis $3L/4$?', opts:['Außerhalb dieses Bereichs ist die Störung null.', 'Außerhalb dieses Bereichs ist $\\psi_1$ null.', 'Wegen der Symmetrie des Sinus um $L/2$.'], a:0, ex:'Der Integrand $\\psi_1^*\\hat H\'\\psi_1$ verschwindet, wo $\\hat H\' = 0$ ist. $\\psi_1$ selbst ist im ganzen Kasten ungleich null.'}},
          {l:'= V_0/L ∫_{L/4}^{3L/4} (1 - cos(2πx/L)) dx', w:'$\\sin^2u = \\frac12(1 - \\cos2u)$'},
          {l:'= V_0/L [x - L/(2π) sin(2πx/L)]_{L/4}^{3L/4}', w:'Stammfunktion'},
          {l:'= V_0/L (L/2 + L/π)', w:'$\\sin\\frac{3\\pi}{2} - \\sin\\frac\\pi2 = -2$',
            why:{q:'Woher kommt der Beitrag $L/\\pi$?', opts:['Aus $-\\frac{L}{2\\pi}(\\sin\\frac{3\\pi}{2} - \\sin\\frac\\pi2) = \\frac{L}{\\pi}$', 'Aus der Normierung $2/L$ der Kastenfunktion', 'Aus dem Integral über $x$ von $L/4$ bis $3L/4$'], a:0, ex:'Der Kosinus-Anteil verschwindet hier nicht, weil die Grenzen keine Vielfachen von $L/2$ sind. Das Integral über $1$ gibt $L/2$.'}},
          {l:'= V_0 (1/2 + 1/π)', w:'ausgeklammert',
            why:{q:'Ist das plausibel?', opts:['Ja: Mehr als die Hälfte von $|\\psi_1|^2$ liegt in der Mitte.', 'Nein: Die Mitte ist halb so breit wie der Kasten, also $V_0/2$.', 'Nein: Die Korrektur muss kleiner als $V_0/2$ sein.'], a:0, ex:'$E_1^{(1)} = V_0\\,P(L/4 < x < 3L/4) \\approx 0{,}82\\,V_0$. Der Bauch von $\\psi_1$ liegt in der Mitte; „halbe Breite, also halbe Stufe“ gilt nur für eine gleichmäßige Dichte.'}}
        ]},
        q:{q:R`Die Störung $V_0$ sitzt auf $L/4 < x < 3L/4$. Welcher Zustand spürt sie in erster Ordnung am stärksten?`,
          opts:[R`$n = 2$, er hat dort seinen Knoten`, R`$n = 1$, er hat seinen Bauch in der Mitte`, R`alle gleich stark, je mit $V_0/2$`], a:1,
          ex:R`$n = 1$: $V_0(\frac12 + \frac1\pi) \approx 0{,}82\,V_0$; $n = 2$: $V_0/2$; $n = 3$: $\approx 0{,}39\,V_0$.`,
          fb:[R`Ein Knoten in der Mitte verringert die Wahrscheinlichkeit dort. $n = 2$ bekommt genau $V_0/2$.`, '',
            R`„Halbe Breite, halbe Stufe“ gilt nur bei gleichmäßiger Dichte. $|\psi_1|^2$ ist in der Mitte groß.`]}},
      {id:'stoer-t2c', title:'Das Matrixelement in fünf Gestalten',
        num:{title:'Ein Nebendiagonalelement', text:R`Für dieselbe Stufe ist

$$\langle\psi_3|\hat H'|\psi_1\rangle = \frac{2V_0}{L}\int_{L/4}^{3L/4}\sin\frac{3\pi x}{L}\,\sin\frac{\pi x}{L}\,dx = -\frac{V_0}{\pi} \approx -0{,}32\,V_0,$$

während $\langle\psi_2|\hat H'|\psi_1\rangle = 0$ ist: $\psi_1\psi_2$ ist antisymmetrisch um $L/2$, die Stufe symmetrisch.`},
        text:R`Ein Matrixelement $\langle m|\hat H'|n\rangle$, gelesen „m, H Strich, n“, hat mehrere Gestalten. In der Ortsdarstellung ist es ein Integral über $\psi_m^*\,\hat H'\,\psi_n$. Als Bild ist es die Fläche unter diesem Produkt, aber nur dort, wo die Störung wirkt. Als Matrix steht es in Zeile $m$, Spalte $n$. Die Diagonalelemente verschieben die Niveaus in erster Ordnung. Die Nebendiagonalelemente mischen Zustände und wirken erst in zweiter Ordnung auf die Energie.`,
        reps:{obj:R`Die Stufe $V_0$ in der Kastenmitte`,
          rows:[
            {k:'worte', text:R`Wie stark spürt der Zustand $n$ die Stufe, und wie stark koppelt sie ihn an den Zustand $m$?`},
            {k:'dirac', tex:R`V_{mn} = \langle\psi_m|\hat H'|\psi_n\rangle`},
            {k:'ort', tex:R`V_{mn} = \frac{2V_0}{L}\int_{L/4}^{3L/4}\sin\frac{m\pi x}{L}\,\sin\frac{n\pi x}{L}\,dx`},
            {k:'graph', plot:{x:[0, 1], y:[-0.1, 2.1], xlab:'x/L', ylab:R`|\psi_1|^2\,L`, regions:[{x:[0.25, 0.75], lab:'Stufe'}]}, f:x => 2 * Math.sin(Math.PI * x) ** 2, lab:R`|\psi_1|^2`, f2:x => 2 * Math.sin(2 * Math.PI * x) ** 2, lab2:R`|\psi_2|^2`,
              cap:R`Getönt der Bereich der Stufe. Die Fläche von $|\psi_1|^2$ darin ist $0{,}82$, die von $|\psi_2|^2$ genau $0{,}5$: das sind $V_{11}/V_0$ und $V_{22}/V_0$.`},
            {k:'matrix', tex:R`\frac{V}{V_0} \doteq \begin{pmatrix}0{,}818 & 0 & -0{,}318\\ 0 & 0{,}5 & 0\\ -0{,}318 & 0 & 0{,}394\end{pmatrix}\quad(\text{Ausschnitt } m, n = 1, 2, 3)`},
            {k:'physik', text:R`Die Diagonale verschiebt die Niveaus in erster Ordnung: $n = 1$ um $0{,}82\,V_0$, $n = 2$ um $0{,}5\,V_0$, $n = 3$ um $0{,}39\,V_0$. Die Nullen zeigen: Die Stufe mischt keine Zustände verschiedener Parität.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Wie stark spürt $n$ die Stufe“ ist das Diagonalelement $m = n$; „Kopplung an $m$“ ist das Element mit $m \ne n$.`},
            {from:'dirac', to:'ort', rule:R`Bra und Ket durch die Kastenfunktionen ersetzen, $\hat H'$ durch $V_0$ im Stufenbereich; das Skalarprodukt wird ein Integral nur über diesen Bereich.`},
            {from:'ort', to:'graph', rule:R`Den Integranden $\psi_m\psi_n$ zeichnen, im Graphen für $m = n$ also $|\psi_n|^2$, und nur die Fläche im getönten Bereich zählen, mit Vorzeichen.`},
            {from:'graph', to:'matrix', rule:R`Für jedes Paar $(m, n)$ diese Fläche mal $V_0$ in Zeile $m$, Spalte $n$ eintragen.`},
            {from:'matrix', to:'physik', rule:R`Die Diagonale als Verschiebung im Niveauschema lesen; Nebendiagonalelemente gehen quadriert in die zweite Ordnung ein.`}
          ]},
        q:{q:R`Wie lautet $\langle\psi_2|\hat H'|\psi_4\rangle$ für diese Stufe als Integral?`, tr:{from:'dirac', to:'ort'},
          opts:[R`$\frac{2V_0}{L}\int_0^L\sin\frac{2\pi x}{L}\sin\frac{4\pi x}{L}\,dx$`, R`$\frac{2V_0}{L}\int_{L/4}^{3L/4}\sin\frac{2\pi x}{L}\sin\frac{4\pi x}{L}\,dx$`, R`$V_0\int_{L/4}^{3L/4}\sin\frac{2\pi x}{L}\sin\frac{4\pi x}{L}\,dx$`], a:1,
          ex:R`Integriert wird nur über den Bereich der Stufe, mit dem Normierungsfaktor $2/L$ der Kastenfunktionen. Der Wert ist $-0{,}42\,V_0$.`,
          fb:[R`Über den ganzen Kasten wäre das Integral null: Die Kastenfunktionen sind orthogonal. Die Störung wirkt nur in der Mitte.`, '',
            R`Der Faktor $2/L$ aus der Normierung $\psi_n = \sqrt{2/L}\sin(n\pi x/L)$ fehlt.`]}},
      {id:'stoer-t2d', title:'Der Zustand in erster Ordnung',
        num:{title:'Im Zweiniveausystem', text:R`Die Beimischung von $|2\rangle$ zu $|1\rangle$ ist

$$\frac{\langle 2|\hat H'|1\rangle}{E_1^{(0)} - E_2^{(0)}} = \frac{0{,}2}{1 - 3} = -0{,}1.$$

Also $|1\rangle + |1^{(1)}\rangle \doteq (1;\ -0{,}1)$. Der exakte Eigenvektor ist $(1;\ -0{,}110)$.`},
        text:R`Projiziere die Gleichung erster Ordnung auf $\langle m^{(0)}|$ mit $m \ne n$. Wegen $\langle m^{(0)}|n^{(0)}\rangle = 0$ folgt $(E_m^{(0)} - E_n^{(0)})\langle m^{(0)}|n^{(1)}\rangle + \langle m^{(0)}|\hat H'|n^{(0)}\rangle = 0$. Mit der Wahl $\langle n^{(0)}|n^{(1)}\rangle = 0$ und der [[lex:vollstaendigkeit|Vollständigkeit]] der Basis ist

$$|n^{(1)}\rangle = \sum_{m\ne n}\frac{\langle m^{(0)}|\hat H'|n^{(0)}\rangle}{E_n^{(0)} - E_m^{(0)}}\,|m^{(0)}\rangle.$$

Die Störung mischt andere Zustände bei, umso stärker, je näher sie energetisch liegen. Bei $E_m^{(0)} = E_n^{(0)}$ wäre der Nenner null; das ist das Problem der Entartung.`,
        q:{q:R`Im Kasten mit der Stufe in der Mitte: Welche Zustände mischt die Störung in erster Ordnung dem Grundzustand bei?`, tr:{from:'matrix', to:'dirac'},
          opts:[R`nur $n = 2$, den nächsten Nachbarn`, R`alle $n \ge 2$ gleich stark`, R`nur ungerade $n = 3, 5, \dots$`], a:2,
          ex:R`Beigemischt wird $|m\rangle$ nur, wenn $\langle\psi_m|\hat H'|\psi_1\rangle \ne 0$. In der Matrix ist die Spalte $1$ bei $m = 2$ null, bei $m = 3$ dagegen $-0{,}318$.`,
          fb:[R`Der nächste Nachbar trägt hier gar nicht bei: $\langle\psi_2|\hat H'|\psi_1\rangle = 0$ aus Symmetriegründen.`,
            R`Der Nenner $E_1 - E_m$ wächst mit $m$, und manche Zähler sind null. Gleich stark ist keiner.`, '']}},
      {id:'stoer-t2e', title:'Symmetrie spart Arbeit',
        pre:{from:'osz', seg:'osz-t4', title:'Matrixelemente mit Leiteroperatoren', text:R`Mit $\hat x = \sqrt{\hbar/(2m\omega)}\,(\hat a + \hat a^\dagger)$, $\hat a|n\rangle = \sqrt n|n-1\rangle$ und $\hat a^\dagger|n\rangle = \sqrt{n+1}|n+1\rangle$ ändert $\hat x$ die Quantenzahl um $\pm1$. Mini-Beispiel: $\langle 1|\hat x|0\rangle = \sqrt{\hbar/(2m\omega)}$, aber $\langle 0|\hat x|0\rangle = 0$.`},
        num:{title:R`$\lambda x$ im Oszillator`, text:R`$|\psi_0|^2 \propto e^{-m\omega x^2/\hbar}$ ist gerade, $x$ ist ungerade. Die Beiträge bei $+x$ und $-x$ heben sich auf:

$$E_0^{(1)} = \lambda\int x\,|\psi_0|^2\,dx = 0.$$

Dasselbe sagen die Leiteroperatoren: $\langle 0|\hat a + \hat a^\dagger|0\rangle = 0$.`},
        text:R`Ist $\hat H_0$ symmetrisch unter $x \to -x$, so haben die Eigenfunktionen eine feste [[lex:paritaet-auswahlregel|Parität]], und $|\psi_n|^2$ ist gerade. Für eine ungerade Störung wie $\lambda x$ ist dann $E_n^{(1)} = 0$ für alle $n$, ohne Rechnung. Allgemein verschwindet ein Matrixelement $\langle m|\hat H'|n\rangle$, wenn der Integrand $\psi_m^*\hat H'\psi_n$ ungerade ist. So erkennst du viele Nullen in der Matrix von $\hat H'$, bevor du ein Integral ausrechnest. Im Kasten spielt die Spiegelung an $x = L/2$ dieselbe Rolle.`,
        q:{q:'Welches Matrixelement von $\\hat H\' = \\lambda x^2$ im harmonischen Oszillator ist ohne Rechnung null?',
          opts:['$\\langle 0|\\hat H\'|0\\rangle$', '$\\langle 1|\\hat H\'|0\\rangle$', '$\\langle 2|\\hat H\'|0\\rangle$'], a:1,
          ex:'$\\psi_1$ ist ungerade, $\\psi_0$ und $x^2$ sind gerade: Der Integrand $\\psi_1^*x^2\\psi_0$ ist ungerade, das Integral null. Mit Leiteroperatoren: $\\hat x^2$ ändert die Quantenzahl um $0$ oder $\\pm2$, nie um $1$.',
          fb:['Hier ist der Integrand $x^2|\\psi_0|^2$ gerade und nirgends negativ; das Integral ist positiv.', '', '$\\psi_2$, $\\psi_0$ und $x^2$ sind alle gerade. Der Integrand ist gerade, und das Integral verschwindet nicht: Es ist $\\sqrt2\\,\\lambda\\hbar/(2m\\omega)$.']}},
      {id:'stoer-t2f', title:'Das Labor: erste Ordnung gegen exakt',
        num:{title:R`Stufe auf der linken Hälfte, $V_0 = 2E_1$`, text:R`Für eine Stufe auf $0 < x < L/2$ liegt bei jedem $n$ genau die Hälfte von $|\psi_n|^2$ links. Also

$$E_n^{(1)} = \tfrac12V_0,\qquad E_1 \approx E_1 + E_1 = 2E_1.$$

Das Labor diagonalisiert exakt und zeigt $1{,}766\,E_1$: Die erste Ordnung liegt um $0{,}23\,E_1$ zu hoch.`},
        text:R`Das Labor zeigt eine verwandte Störung, die Stufe $V_0$ auf der linken Kastenhälfte. Drei Spalten von Strichen stehen nebeneinander. Grau sind die ungestörten Niveaus $n^2E_1$, also $E_n^{(0)}$. Orange ist die erste Ordnung $E_n^{(0)} + V_0/2$, das Diagonalelement $\langle n|\hat H'|n\rangle$ dazu addiert. Blau ist die exakte Lösung, numerisch diagonalisiert mit allen Nebendiagonalelementen. Der Abstand zwischen Orange und Blau ist alles, was die zweite und höhere Ordnungen beitragen. Er wächst mit $V_0$, für kleine $V_0$ etwa wie $V_0^2$.`,
        fig:{lab:'perturb', init:{v0:2}, caption:R`Stufe $V_0$ auf der linken Kastenhälfte: grau ungestört, orange erste Ordnung $E_n^{(0)} + V_0/2$, blau exakt. Bei $V_0 = 2E_1$ liegt der blaue Grundzustand bei $1{,}766\,E_1$, der orange bei $2\,E_1$.`},
        q:{q:R`Du stellst im Labor $V_0 = 0{,}5\,E_1$ ein. Wo liegt der orange Strich für $n = 2$?`, tr:{from:'labor', to:'formel'},
          opts:[R`bei $4{,}25\,E_1$`, R`bei $4{,}5\,E_1$`, R`bei $2{,}25\,E_1$`], a:0,
          ex:R`$E_2^{(0)} + V_0/2 = 4E_1 + 0{,}25\,E_1 = 4{,}25\,E_1$.`,
          fb:['', R`Das wäre $E_2^{(0)} + V_0$. In erster Ordnung zählt nur die Hälfte, weil die Hälfte von $|\psi_2|^2$ links liegt.`,
            R`$E_2^{(0)} = 2^2E_1 = 4E_1$, nicht $2E_1$.`]}},
      {id:'stoer-t2g', title:'Typischer Fehler: Für die erste Ordnung brauche man den gestörten Zustand',
        num:{title:'Nur der ungestörte Zustand', text:R`Im Zweiniveausystem genügt $|1^{(0)}\rangle \doteq (1;\ 0)$:

$$E_1^{(1)} = \langle 1^{(0)}|\hat H'|1^{(0)}\rangle = 0{,}1.$$

Die Beimischung $-0{,}1\,|2\rangle$ aus dem Schritt „Der Zustand in erster Ordnung“ geht erst in die Energie zweiter Ordnung ein.`},
        text:R`„Für die erste Ordnung muss man erst die gestörte Wellenfunktion kennen.“ Das ist ein häufiges Missverständnis. Für $E_n^{(1)}$ genügt der ungestörte Zustand. Die Änderung des Zustands wirkt sich erst in der Energie zweiter Ordnung aus. Ein zweiter Fehler ist, $E_n^{(1)}$ als Wert der Störung an einer Stelle zu nehmen, etwa $V(\langle x\rangle)$. Richtig ist der Mittelwert über die ganze Verteilung, $\langle n^{(0)}|\hat H'|n^{(0)}\rangle$. Beides stimmt nur zufällig überein, etwa für eine linear wachsende Störung.`,
        q:{q:R`Im Kasten wirkt $\hat H' = \lambda\,(x - L/2)^2$ mit $\lambda > 0$. Was gilt für $E_1^{(1)}$?`,
          opts:[R`$E_1^{(1)} = 0$, denn am Maximum von $|\psi_1|^2$ ist die Störung null`, R`$E_1^{(1)} = \lambda\langle(x - L/2)^2\rangle > 0$ im ungestörten $\psi_1$`, R`Man muss erst den gestörten Zustand berechnen.`], a:1,
          ex:R`Erste Ordnung ist der Mittelwert über die ganze Verteilung: $\lambda\,(\Delta x)^2 = \lambda L^2\left(\tfrac{1}{12} - \tfrac{1}{2\pi^2}\right) \approx 0{,}033\,\lambda L^2$. Der Wert an einer Stelle, hier $0$ bei $x = L/2$, ist kein Erwartungswert.`,
          fb:[R`Das ist der Wert der Störung an einer einzigen Stelle. Überall sonst ist sie positiv, und $|\psi_1|^2$ reicht über den ganzen Kasten.`, '',
            R`Für die erste Ordnung genügt der ungestörte Zustand. Seine Änderung wirkt erst in der zweiten Ordnung.`]}}
    ]},

    /* ===== Abschnitt 3: zweite Ordnung ===== */
    {id:'stoer-t3', title:'Zweite Ordnung: Niveaus stoßen sich ab', steps:[
      {id:'stoer-t3a', title:'Die Formel zweiter Ordnung',
        num:{title:'Im Zweiniveausystem', text:R`Nur ein Zwischenzustand, $m = 2$:

$$E_1^{(2)} = \frac{|\langle 2|\hat H'|1\rangle|^2}{E_1^{(0)} - E_2^{(0)}} = \frac{0{,}04}{1 - 3} = -0{,}02.$$

Bis zur zweiten Ordnung $E_1 \approx 1 + 0{,}1 - 0{,}02 = 1{,}08\,\mathrm{eV}$, exakt $1{,}0780\,\mathrm{eV}$.`},
        text:R`Projiziere die Gleichung zweiter Ordnung auf $\langle n^{(0)}|$. Wie in erster Ordnung heben sich die Terme mit $\hat H_0$ und $E_n^{(0)}$ weg. Wegen $\langle n^{(0)}|n^{(1)}\rangle = 0$ fällt auch der Term mit $E_n^{(1)}$ weg. Es bleibt $E_n^{(2)} = \langle n^{(0)}|\hat H'|n^{(1)}\rangle$. Setzt du $|n^{(1)}\rangle$ ein und benutzt $\langle n|\hat H'|m\rangle = \langle m|\hat H'|n\rangle^*$, folgt die [[lex:stoerung-2|zweite Ordnung]]

$$E_n^{(2)} = \sum_{m\ne n}\frac{|\langle m^{(0)}|\hat H'|n^{(0)}\rangle|^2}{E_n^{(0)} - E_m^{(0)}}.$$

Jeder Zwischenzustand $m$ trägt mit seiner Kopplung zum Quadrat bei, geteilt durch den Energieabstand.`,
        derive:{ctx:STMAT({H_0:'(1, 0; 0, 3)', H_1:'(1/10, 1/5; 1/5, -1/10)', H:'(11/10, 1/5; 1/5, 29/10)'}, {}), lines:[
          {l:'(1, 0) H_1 (1; 0) = 1/10', w:R`$E_1^{(1)}$: Diagonalelement`},
          {l:'|(0, 1) H_1 (1; 0)|^2/(1 - 3) = -1/50', w:R`$E_1^{(2)}$: ein Zwischenzustand`,
            why:{q:'Warum ist dieser Beitrag negativ?', opts:['Weil der Zwischenzustand höher liegt: $1 - 3 < 0$.', 'Weil $\\hat H\'$ das negative Element $-0{,}1$ enthält.', 'Weil die erste Ordnung $+0{,}1$ positiv ist.'], a:0, ex:'Der Zähler $0{,}04$ ist ein Betragsquadrat und positiv. Das Vorzeichen kommt allein vom Nenner.'}},
          {l:'1 + 1/10 - 1/50 = 27/25', w:'bis zur zweiten Ordnung zusammengezählt'},
          {l:'det(H - (2 - sqrt(85)/10) I) = 0', w:R`exakter Eigenwert $2 - \sqrt{0{,}85} \approx 1{,}0780$`,
            why:{q:'Wie groß ist der Rest zwischen $1{,}08$ und dem exakten Wert?', opts:['etwa $0{,}002$, der Beitrag höherer Ordnungen', 'etwa $0{,}02$, so groß wie die zweite Ordnung', 'null, die zweite Ordnung ist exakt'], a:0, ex:'$1{,}08 - 1{,}0780 = 0{,}0020$. Jede Ordnung ist hier etwa zehnmal kleiner als die vorige.'}}
        ]},
        q:{q:R`Wie groß ist $E_2^{(2)}$, die zweite Ordnung für das obere Niveau des Zweiniveausystems?`,
          opts:[R`$-0{,}02\,\mathrm{eV}$`, R`$+0{,}02\,\mathrm{eV}$`, R`$+0{,}04\,\mathrm{eV}$`], a:1,
          ex:R`$\frac{|\langle 1|\hat H'|2\rangle|^2}{E_2^{(0)} - E_1^{(0)}} = \frac{0{,}04}{3 - 1} = +0{,}02$. Das obere Niveau steigt um denselben Betrag, um den das untere sinkt.`,
          fb:[R`Für das obere Niveau liegt der Zwischenzustand darunter: Der Nenner $3 - 1$ ist positiv.`, '',
            R`Der Nenner $E_2^{(0)} - E_1^{(0)} = 2$ fehlt.`]}},
      {id:'stoer-t3b', title:'Deutung: Niveaus stoßen sich ab',
        num:{title:'Ein Nachbar darunter, einer darüber', text:R`Ein Niveau hat einen Nachbarn $0{,}5\,\mathrm{eV}$ darunter und einen $2\,\mathrm{eV}$ darüber, beide mit der Kopplung $0{,}1\,\mathrm{eV}$:

$$E^{(2)} = \frac{0{,}01}{+0{,}5} + \frac{0{,}01}{-2} = 0{,}020 - 0{,}005 = +0{,}015\,\mathrm{eV}.$$

Der nahe Nachbar darunter gewinnt und schiebt das Niveau nach oben.`},
        text:R`Jeder Zähler ist $\ge 0$. Das Vorzeichen eines Beitrags bestimmt der Nenner. Ein Niveau $m$ *oberhalb* von $n$ drückt $E_n$ nach unten, ein Niveau *unterhalb* drückt es nach oben: Die Niveaus „stoßen sich ab“. Nahe Nachbarn tragen am meisten bei, weil ihr Nenner klein ist. Für den Grundzustand liegen alle anderen Niveaus darüber. Also gilt immer $E_0^{(2)} \le 0$: Die zweite Ordnung senkt den Grundzustand. Im Niveauschema siehst du das als Auseinanderrücken gekoppelter Niveaus.`,
        q:{q:R`Ein angeregtes Niveau hat je einen Nachbarn $1\,\mathrm{eV}$ darunter und $1\,\mathrm{eV}$ darüber. Zum unteren koppelt es mit $0{,}1\,\mathrm{eV}$, zum oberen mit $0{,}2\,\mathrm{eV}$. Was ergibt die zweite Ordnung?`,
          opts:[R`$+0{,}03\,\mathrm{eV}$, das Niveau steigt`, R`$0$, gleiche Abstände heben sich auf`, R`$-0{,}03\,\mathrm{eV}$, das Niveau sinkt`], a:2,
          ex:R`$\frac{0{,}01}{+1} + \frac{0{,}04}{-1} = -0{,}03\,\mathrm{eV}$. Bei gleichen Abständen entscheidet die stärkere Kopplung, hier die nach oben: Das obere Niveau drückt nach unten.`,
          fb:[R`Das Vorzeichen ist vertauscht. Ein Nachbar *oberhalb* hat den negativen Nenner $E_n - E_m = -1\,\mathrm{eV}$ und drückt nach unten.`,
            R`Die Nenner sind gleich groß, aber die Zähler nicht: $0{,}04 \ne 0{,}01$.`, '']}},
      {id:'stoer-t3c', title:'Prüfstein: das Zweiniveausystem exakt',
        pre:{from:'m-eigen', seg:'me-t3', title:R`Eigenwerte einer $2\times2$-Matrix`, text:R`Für $\begin{pmatrix}a & v\\ v & d\end{pmatrix}$ ist $\det(A - \varepsilon\mathbb 1) = (a - \varepsilon)(d - \varepsilon) - v^2 = 0$, also $\varepsilon = \tfrac{a + d}{2} \pm \sqrt{\tfrac{(d - a)^2}{4} + v^2}$. Mini-Beispiel: $a = d = 0$, $v = 1$ gibt $\varepsilon = \pm1$.`},
        num:{title:R`Nur Kopplung, $v = 0{,}2$`, text:R`Ohne Diagonalanteil der Störung, $E_1 = 1$, $E_2 = 3$:

$$\begin{gathered}\varepsilon_- = 2 - \sqrt{1 + 0{,}04} \approx 0{,}98020,\\ E_1 + \frac{v^2}{E_1 - E_2} = 1 - 0{,}02 = 0{,}98.\end{gathered}$$

Die zweite Ordnung trifft auf $2\cdot10^{-4}$ genau.`},
        text:R`Für $\hat H = \begin{pmatrix}E_1 & v\\ v & E_2\end{pmatrix}$ mit $E_1 < E_2$ und reellem $v$ kennst du die exakten Eigenwerte

$$\varepsilon_\mp = \frac{E_1 + E_2}{2} \mp \sqrt{\frac{(E_2 - E_1)^2}{4} + v^2}.$$

Für $|v| \ll E_2 - E_1$ gibt die [[lex:taylor|Taylor-Entwicklung]] $\sqrt{a^2 + v^2} \approx a + \frac{v^2}{2a}$ mit $a = (E_2 - E_1)/2$ genau $\varepsilon_- \approx E_1 - \frac{v^2}{E_2 - E_1}$ und $\varepsilon_+ \approx E_2 + \frac{v^2}{E_2 - E_1}$. Genau das liefert auch die Störungstheorie mit $\hat H_0 = \mathrm{diag}(E_1, E_2)$ und der Kopplung als Störung: $E_1^{(1)} = 0$ und $E_1^{(2)} = v^2/(E_1 - E_2)$. Das untere Niveau sinkt, das obere steigt um denselben Betrag. Die Herleitung prüft die exakte Lösung und beide Ordnungen.`,
        derive:{ctx:STMAT({H:'(E_1, v; v, E_2)', H_1:'(0, v; v, 0)'}, {E_1:'pos', E_2:{range:['E_1 + 1', 'E_1 + 3']}, v:'real'}), lines:[
          {l:'ε = (E_1 + E_2)/2 - sqrt((E_2 - E_1)^2/4 + v^2)', w:'exakter unterer Eigenwert'},
          {l:'det(H - ε I) = 0', w:'Probe',
            why:{q:'Warum genügt diese Zeile als Probe?', opts:['Weil Eigenwerte genau die Nullstellen von $\\det(H - \\varepsilon\\mathbb 1)$ sind.', 'Weil $H$ hermitesch ist, ist jede reelle Zahl Eigenwert.', 'Weil $\\det H = E_1E_2 - v^2$ für jedes $v$ gilt.'], a:0, ex:'$\\det(H - \\varepsilon\\mathbb 1) = 0$ heißt: $H - \\varepsilon\\mathbb 1$ ist nicht invertierbar, es gibt einen Eigenvektor.'}},
          {l:'(1, 0) H_1 (1; 0) = 0', w:R`$E_1^{(1)} = 0$: Störung nur auf der Nebendiagonale`},
          {l:'|(0, 1) H_1 (1; 0)|^2/(E_1 - E_2) = -v^2/(E_2 - E_1)', w:R`$E_1^{(2)}$, nur ein Zwischenzustand`,
            why:{q:'Warum ist dieser Beitrag negativ?', opts:['Weil der einzige Zwischenzustand höher liegt.', 'Weil die Kopplung $v$ negativ sein kann.', 'Weil die erste Ordnung hier null ist.'], a:0, ex:'Der Zähler $v^2$ ist positiv, der Nenner negativ. Das obere Niveau drückt das untere nach unten.'}},
          {l:'ε ≈ E_1 - v^2/(E_2 - E_1)', w:R`Taylor für $|v| \ll E_2 - E_1$: wird nicht als Gleichheit geprüft`}
        ]},
        q:{q:R`Für $E_1 = 1$, $E_2 = 3$ und $v = 0{,}5$: Wie groß ist die zweite Ordnung $E_1^{(2)}$?`,
          opts:[R`$-0{,}25$`, R`$-0{,}125$`, R`$-0{,}5$`], a:1,
          ex:R`$-v^2/(E_2 - E_1) = -0{,}25/2 = -0{,}125$. Exakt ist $\varepsilon_- - E_1 = 1 - \sqrt{1{,}25} \approx -0{,}118$; bei so großem $v$ ist die Näherung schon spürbar ungenau.`,
          fb:[R`Der Nenner $E_2 - E_1 = 2$ fehlt.`, '',
            R`Die Kopplung geht quadriert ein: $v^2 = 0{,}25$, nicht $v$.`]}},
      {id:'stoer-t3d', title:'Matrix, Formel, Niveauschema',
        num:{title:R`$v = 1$`, text:R`Bei großer Kopplung versagt die Reihe. Für $E_1 = 1$, $E_2 = 3$:

$$\varepsilon_- = 2 - \sqrt2 \approx 0{,}586,\qquad 1 - \frac{1^2}{2} = 0{,}5.$$

Die Abweichung ist $0{,}086$, rund ein Fünftel der exakten Verschiebung $-0{,}414$.`},
        text:R`Das Zweiniveausystem lässt sich in vier Gestalten lesen. Die Matrix enthält ungestörte Energien und Kopplung. Die Formel gibt die exakten Eigenwerte und ihre Näherung. Der Graph zeigt beide über der Kopplung $v$: Für kleine $v$ liegen die Kurven aufeinander, für große laufen sie auseinander. Im Niveauschema siehst du dasselbe als zwei Niveaus, die sich abstoßen, wenn man die Kopplung einschaltet. Die Tafel verbindet diese Gestalten und sagt, wie du von einer zur nächsten kommst.`,
        reps:{obj:R`Das Zweiniveausystem mit $E_1 = 1$, $E_2 = 3$ und Kopplung $v$`,
          rows:[
            {k:'matrix', tex:R`\hat H \doteq \begin{pmatrix}1 & v\\ v & 3\end{pmatrix} = \underbrace{\begin{pmatrix}1 & 0\\ 0 & 3\end{pmatrix}}_{\hat H_0} + \underbrace{\begin{pmatrix}0 & v\\ v & 0\end{pmatrix}}_{\hat H'}`},
            {k:'formel', tex:R`\varepsilon_- = 2 - \sqrt{1 + v^2}\ \approx\ 1 - \frac{v^2}{2}\qquad(|v| \ll 2)`},
            {k:'graph', plot:{x:[0, 1.5], y:[-0.2, 1.05], abs:true, yticks:[{y:0.5, lab:'0{,}5'}, {y:1, lab:'1'}], xlab:'v', ylab:R`\varepsilon_-`}, f:v => 2 - Math.sqrt(1 + v * v), lab:R`\text{exakt}`, f2:v => 1 - v * v / 2, lab2:R`\text{2. Ordnung}`,
              cap:R`Tieferer Eigenwert über der Kopplung $v$: durchgezogen exakt, gestrichelt zweite Ordnung. Bis $v \approx 0{,}3$ fallen beide Kurven zusammen, bei $v = 1$ liegen sie $0{,}09$ auseinander.`},
            {k:'physik', text:R`Eingeschaltete Kopplung schiebt die Niveaus auseinander: das untere nach unten, das obere um denselben Betrag nach oben. Je größer der Abstand $E_2 - E_1$, desto kleiner die Verschiebung.`}
          ],
          links:[
            {from:'matrix', to:'formel', rule:R`Diagonale als $E_n^{(0)}$, Nebendiagonale als Kopplung lesen. Exakt: $\det(\hat H - \varepsilon\mathbb 1) = 0$ lösen. Genähert: $v^2$ durch den Abstand teilen.`},
            {from:'formel', to:'graph', rule:R`Beide Ausdrücke über $v$ auftragen. Wo die Kurven sich trennen, endet der Gültigkeitsbereich der Näherung.`},
            {from:'graph', to:'physik', rule:R`Den Abstand der Kurve von der Linie $\varepsilon = 1$ als Verschiebung des unteren Niveaus im Niveauschema lesen.`}
          ]},
        q:{q:R`Im Graphen fallen exakte Kurve und zweite Ordnung für kleine $v$ zusammen und trennen sich für große $v$. Was ist der Grund?`, tr:{from:'graph', to:'formel'},
          opts:[R`Die Taylor-Entwicklung der Wurzel gilt nur für $v^2 \ll 1$.`, R`Für große $v$ wird die Matrix nicht mehr hermitesch.`, R`Für große $v$ liefert die exakte Formel komplexe Werte.`], a:0,
          ex:R`$\sqrt{1 + v^2} \approx 1 + v^2/2$ gilt nur für kleine $v^2$, hier also für $|v|$ klein gegen den halben Abstand $1$.`,
          fb:['', R`Die Matrix ist für jedes reelle $v$ symmetrisch und damit hermitesch.`,
            R`$\sqrt{1 + v^2}$ ist für jedes reelle $v$ reell. Die exakten Eigenwerte sind immer reell.`]}},
      {id:'stoer-t3e', title:'Typischer Fehler: Vorzeichen des Nenners und der Term m = n',
        num:{title:'Mit vertauschtem Nenner', text:R`Wer im Zweiniveausystem $E_m^{(0)} - E_n^{(0)}$ statt $E_n^{(0)} - E_m^{(0)}$ schreibt, erhält

$$\frac{0{,}04}{3 - 1} = +0{,}02$$

für den Grundzustand, das untere Niveau. Er stiege also. Das widerspricht der Regel, dass die zweite Ordnung den Grundzustand immer senkt.`},
        text:R`Zwei Fehler sind häufig. Erstens: das Vorzeichen des Nenners vertauschen. Kontrolle: Der Grundzustand muss in zweiter Ordnung sinken. Zweitens: in der Summe auch $m = n$ mitnehmen. Dieser Anteil ist durch die Wahl $\langle n^{(0)}|n^{(1)}\rangle = 0$ ausgeschlossen, und er stünde ohnehin mit Nenner null da. Ein dritter Fehler ist, in den Zähler das Matrixelement selbst statt seines Betragsquadrats zu schreiben. Dann könnte ein negatives Matrixelement das Vorzeichen umdrehen, was nicht sein darf.`,
        q:{q:R`Jemand berechnet für einen Grundzustand $E_0^{(2)} = +0{,}03\,\mathrm{eV}$. Was ist sicher falsch?`,
          opts:[R`Das Vorzeichen: Für den Grundzustand ist $E_0^{(2)} \le 0$.`, R`Der Betrag: Die zweite Ordnung ist immer kleiner als $0{,}01\,\mathrm{eV}$.`, R`Nichts; das Vorzeichen hängt von der Störung ab.`], a:0,
          ex:R`Alle Nenner $E_0^{(0)} - E_m^{(0)}$ sind negativ, alle Zähler $\ge 0$. Ein positives Ergebnis zeigt einen Vorzeichenfehler.`,
          fb:['', R`Eine allgemeine Grenze für den Betrag gibt es nicht. Sicher ist nur das Vorzeichen.`,
            R`Das Vorzeichen der Störung geht quadriert ein. Für den Grundzustand bestimmt allein der negative Nenner das Vorzeichen.`]}}
    ]},

    /* ===== Abschnitt 4: entartete Störungstheorie ===== */
    {id:'stoer-t4', title:'Entartete Störungstheorie', steps:[
      {id:'stoer-t4a', title:'Das Problem: ein Nenner null',
        num:{title:'Zwei gleiche Niveaus', text:R`Mit $\hat H_0 \doteq \mathrm{diag}(1, 1)$ und der Kopplung $0{,}2$ gäbe die Formel zweiter Ordnung

$$\frac{0{,}04}{1 - 1} = \frac{0{,}04}{0}.$$

Exakt hat $\begin{pmatrix}1 & 0{,}2\\ 0{,}2 & 1\end{pmatrix}$ aber die harmlosen Eigenwerte $1 \pm 0{,}2$.`},
        text:R`Haben zwei oder mehr Zustände dieselbe ungestörte Energie, versagen die bisherigen Formeln: In $|n^{(1)}\rangle$ und $E_n^{(2)}$ stünde $E_n^{(0)} - E_m^{(0)} = 0$ im Nenner. Der tiefere Grund: Im entarteten Unterraum ist *jede* Linearkombination ein Eigenzustand von $\hat H_0$. Welche davon beim Einschalten der Störung stetig weiterlebt, legt erst die Störung fest. Du musst diese **richtigen Zustände nullter Ordnung** zuerst finden. Im Beispiel sind es $\tfrac{1}{\sqrt2}(1;\ \pm1)$, nicht die Basisvektoren.`,
        q:{q:R`Warum versagt die Formel zweiter Ordnung bei Entartung?`,
          opts:['Weil $\\langle m|\\hat H\'|n\\rangle$ dann besonders groß ist.', 'Weil ein Nenner $E_n^{(0)} - E_m^{(0)}$ null wird.', 'Weil entartete Zustände nicht orthogonal sind, $\\langle m|n\\rangle \\ne 0$.'], a:1,
          ex:R`Bei $E_m^{(0)} = E_n^{(0)}$ und $\langle m|\hat H'|n\rangle \ne 0$ divergiert der Beitrag. Die richtigen Zustände nullter Ordnung beseitigen das Problem.`,
          fb:[R`Die Störung kann beliebig klein sein; der Nenner ist trotzdem null.`, '',
            R`Man kann entartete Zustände immer orthonormal wählen. Das Problem ist der Nenner.`]}},
      {id:'stoer-t4b', title:R`Die Matrix $W$ im entarteten Unterraum`,
        pre:{from:'m-eigen', seg:'me-t3', title:'Eigenwerte und Eigenvektoren', text:R`Eigenwerte sind die Nullstellen von $\det(A - \lambda\mathbb 1)$; Eigenvektoren lösen $(A - \lambda\mathbb 1)v = 0$. Mini-Beispiel: $\begin{pmatrix}0&1\\1&0\end{pmatrix}$ hat $\lambda = \pm1$ mit $v = \tfrac{1}{\sqrt2}(1;\ \pm1)$.`},
        num:{title:'Das Beispiel diagonalisiert', text:R`$W \doteq \begin{pmatrix}0 & 0{,}2\\ 0{,}2 & 0\end{pmatrix}$ hat

$$E^{(1)} = \pm0{,}2,\qquad |\phi_\pm\rangle = \tfrac{1}{\sqrt2}(|1\rangle \pm |2\rangle).$$

Das Niveau bei $1$ spaltet in $0{,}8$ und $1{,}2$ auf, hier sogar exakt.`},
        text:R`Das Niveau $E^{(0)}$ sei $g$-fach entartet, mit orthonormaler Basis $|1\rangle, \dots, |g\rangle$ des Unterraums. Ansatz: $|\phi^{(0)}\rangle = \sum_jc_j|j\rangle$. Projiziere die Gleichung erster Ordnung auf ein $\langle i|$ aus dem Unterraum. Der Term mit $\hat H_0 - E^{(0)}$ fällt weg, und es bleibt

$$\sum_{j=1}^gW_{ij}c_j = E^{(1)}c_i,\qquad W_{ij} = \langle i|\hat H'|j\rangle.$$

Das ist ein [[lex:eigenwertproblem|Eigenwertproblem]] für die $g\times g$-Matrix $W$ ([[lex:entartete-stoerung|entartete Störungstheorie]]). Ihre Eigenwerte sind die Korrekturen erster Ordnung, ihre Eigenvektoren die richtigen Zustände nullter Ordnung.`,
        derive:{ctx:STMAT({W:'(0, w; w, 0)'}, {w:'pos'}), lines:[
          {l:'det(W - w I) = 0', w:R`$+w$ ist Eigenwert`},
          {l:'det(W + w I) = 0', w:R`$-w$ ist Eigenwert`},
          {l:'W (1; 1)/sqrt(2) = w (1; 1)/sqrt(2)', w:R`richtiger Zustand zu $+w$`,
            why:{q:'Was ist $\\frac{1}{\\sqrt2}\\binom11$ physikalisch?', opts:['eine Mischung beider Basiszustände mit gleichem Gewicht', 'der unveränderte erste Basiszustand', 'ein Zustand außerhalb des entarteten Unterraums'], a:0, ex:'Die Komponenten beziehen sich auf die Basis des Unterraums. Die Störung wählt die Mischungen, nicht die ursprünglichen Basiszustände.'}},
          {l:'W (1; -1)/sqrt(2) = -w (1; -1)/sqrt(2)', w:R`richtiger Zustand zu $-w$`},
          {l:'tr(W) = 0', w:'Summe der Korrekturen',
            why:{q:'Was sagt $\\mathrm{tr}\\,W = 0$ über die Aufspaltung?', opts:['Die Summe der Korrekturen ist null.', 'Jede der beiden Korrekturen ist null.', 'Das Niveau spaltet gar nicht auf.'], a:0, ex:'Die Spur ist die Summe der Eigenwerte: $+w + (-w) = 0$. Die Aufspaltung ist symmetrisch um $E^{(0)}$.'}}
        ]},
        q:{q:R`Im Unterraum ist $W = \begin{pmatrix}\beta&0\\0&\beta\end{pmatrix}$. Was folgt?`,
          opts:[R`Aufspaltung in $E^{(0)} \pm \beta$`, R`erst die Basis wechseln, dann rechnen`, R`beide um $\beta$ verschoben, keine Aufspaltung`], a:2,
          ex:R`$W = \beta\mathbb 1$ ist in jeder Basis diagonal; beide Zustände bekommen $\beta$. Die Entartung bleibt in erster Ordnung bestehen.`,
          fb:[R`$\pm\beta$ wären die Eigenwerte von $\begin{pmatrix}0&\beta\\ \beta&0\end{pmatrix}$. Hier sind beide Eigenwerte $\beta$.`,
            R`$\beta\mathbb 1$ ist in jeder Basis gleich; ein Basiswechsel ändert nichts.`, '']}},
      {id:'stoer-t4c', title:'Abkürzung über Symmetrie',
        num:{title:R`Wasserstoff $n = 2$ im Feld $\mathcal E\hat z$`, text:R`Die vier Zustände $|2s\rangle$, $|2p_0\rangle$, $|2p_{+1}\rangle$, $|2p_{-1}\rangle$ geben eine $4\times4$-Matrix $W$ mit 16 Einträgen. Weil $\hat z$ mit $\hat L_z$ vertauscht, koppeln nur gleiche $m$. Weil $\hat z$ die Parität umkehrt, sind alle Diagonalelemente null. Übrig bleiben

$$W_{2s,\,2p_0} = W_{2p_0,\,2s},$$

zwei von 16 Einträgen.`},
        text:R`Vertauscht ein hermitescher Operator $\hat A$ mit $\hat H_0$ und mit $\hat H'$, und hat er im Unterraum verschiedene Eigenwerte, dann ist $W$ in der Eigenbasis von $\hat A$ schon diagonal oder zerfällt in kleine Blöcke. Beim Wasserstoff im Feld $\mathcal E\hat z$ ist das $\hat L_z$: Nur Zustände mit gleichem $m$ koppeln. Die Parität streicht zusätzlich alle Diagonalelemente. So wird aus einer $4\times4$-Matrix ein $2\times2$-Block. Die Symmetrie sagt dir also, welche Integrale du gar nicht erst ausrechnen musst.`,
        q:{q:R`Welche Matrixelemente $\langle 2,l',m'|\hat z|2,l,m\rangle$ können im Niveau $n = 2$ von null verschieden sein?`,
          opts:[R`nur solche mit $m' = m$ und $l' \ne l$`, R`alle mit $l' = l$`, R`nur die Diagonalelemente`], a:0,
          ex:R`$\hat z$ vertauscht mit $\hat L_z$, also $m' = m$. Es ist ungerade, also müssen die Paritäten $(-1)^l$ verschieden sein: $l' \ne l$.`,
          fb:['', R`Gleiches $l$ heißt gleiche Parität; dann ist der Integrand von $\langle\dots|\hat z|\dots\rangle$ ungerade und das Integral null.`,
            R`Gerade die Diagonalelemente verschwinden alle wegen der Parität.`]}},
      {id:'stoer-t4d', title:'Der lineare Stark-Effekt in fünf Gestalten',
        num:{title:R`Ein starkes Laborfeld`, text:R`Mit $|\langle 2s|\hat z|2p_0\rangle| = 3a_0$ und $\mathcal E = 10^7\,\mathrm{V/m}$ ist

$$w = 3e\mathcal Ea_0 = 3\cdot10^7\,\mathrm{V/m}\cdot0{,}529\cdot10^{-10}\,\mathrm m\cdot e \approx 1{,}6\cdot10^{-3}\,\mathrm{eV}.$$

Das Niveau $E_2 = -3{,}40\,\mathrm{eV}$ spaltet in $E_2 \pm 1{,}6\,\mathrm{meV}$ und das unverschobene $E_2$ auf.`},
        text:R`Das Niveau $n = 2$ des Wasserstoffs ist ohne Spin vierfach entartet. Mit $\hat H' = e\mathcal E\hat z$ koppelt nur $\langle 2s|\hat z|2p_0\rangle$. Im Unterraum $\{|2s\rangle, |2p_0\rangle\}$ ist $W$ bis auf ein Vorzeichen, das von der Phasenwahl abhängt, eine Matrix mit $w$ außerhalb der Diagonale. Die Zustände $2p_{\pm1}$ bleiben in erster Ordnung unverschoben. Die Verschiebung $\pm w$ ist *linear* in $\mathcal E$, weil die Mischungen $|\phi_\pm\rangle$ ein festes Dipolmoment haben. Die Tafel verbindet Matrix, Zustände, Niveauschema und Spektrum.`,
        reps:{obj:R`Wasserstoff $n = 2$ im Feld $\mathcal E\hat z$`,
          rows:[
            {k:'worte', text:R`Das Feld mischt $2s$ und $2p_0$ zu zwei Zuständen, deren Ladungswolken nach oben bzw. unten verschoben sind. $2p_{\pm1}$ bleiben unberührt.`},
            {k:'matrix', tex:R`\begin{gathered}W \doteq \begin{pmatrix}0 & w & 0 & 0\\ w & 0 & 0 & 0\\ 0 & 0 & 0 & 0\\ 0 & 0 & 0 & 0\end{pmatrix}\\ \text{in der Basis } |2s\rangle, |2p_0\rangle, |2p_{+1}\rangle, |2p_{-1}\rangle,\\ w = 3e\mathcal Ea_0\end{gathered}`},
            {k:'dirac', tex:R`|\phi_\pm\rangle = \tfrac{1}{\sqrt2}\left(|2s\rangle \pm |2p_0\rangle\right):\ E^{(1)} = \pm w;\qquad |2p_{\pm1}\rangle:\ E^{(1)} = 0`},
            {k:'graph', plot:{x:[0, 1], y:[-3.4, 3.4], abs:true, yticks:[{y:-3.18, lab:'-3{,}2'}, {y:3.18, lab:'3{,}2'}], xlab:R`\mathcal E/\mathcal E_{\max}`, ylab:R`(E - E_2)/\text{meV}`}, f:x => 1.59 * x * 2, lab:R`|\phi_+\rangle`, f2:x => -1.59 * x * 2, lab2:R`|\phi_-\rangle`,
              cap:R`Niveauschema über der Feldstärke bis $\mathcal E_{\max} = 2\cdot10^7\,\mathrm{V/m}$: zwei Geraden $\pm w$; die beiden $2p_{\pm1}$ bleiben auf der waagerechten Achse $E = E_2$. Der Fächer öffnet sich linear.`},
            {k:'physik', text:R`Die Linie Lyman-α ($n = 2 \to 1$) spaltet im Feld in drei Komponenten auf, um $\pm w$ verschoben und unverschoben; ihr Abstand wächst proportional zu $\mathcal E$.`}
          ],
          links:[
            {from:'worte', to:'matrix', rule:R`„Nur $2s$ und $2p_0$ koppeln“ heißt: in Zeile $2s$, Spalte $2p_0$ und gespiegelt $w$ eintragen, sonst überall $0$.`},
            {from:'matrix', to:'dirac', rule:R`Die Matrix diagonalisieren: Der $2\times2$-Block gibt $\pm w$ mit $\tfrac{1}{\sqrt2}(1;\ \pm1)$, der Rest ist schon diagonal mit $0$.`},
            {from:'dirac', to:'graph', rule:R`Jeden Eigenwert als Linie über der Feldstärke zeichnen; $w \propto \mathcal E$ gibt Geraden durch den Ursprung.`},
            {from:'graph', to:'physik', rule:R`Bei festem $\mathcal E$ senkrecht schneiden: Die Schnittpunkte sind die Niveaus, ihre Abstände zum Niveau $n = 1$ die Linien im Spektrum.`}
          ]},
        q:{q:R`Wie viele verschiedene Energien hat das Niveau $n = 2$ im Feld in erster Ordnung, und wie oft kommt jede vor?`, tr:{from:'matrix', to:'physik'},
          opts:[R`vier verschiedene, je einmal`, R`zwei: $E_2 + w$ und $E_2 - w$, je doppelt`, R`drei: $E_2 + w$, $E_2 - w$ einfach, $E_2$ doppelt`], a:2,
          ex:R`Die Eigenwerte von $W$ sind $+w$, $-w$, $0$, $0$. Die Entartung ist nur teilweise aufgehoben.`,
          fb:[R`Zwei der vier Eigenwerte sind gleich: $2p_{+1}$ und $2p_{-1}$ bleiben beide bei $E_2$.`,
            R`$\pm w$ gehören nur zum $2\times2$-Block. Die $2p_{\pm1}$-Zustände haben den Eigenwert $0$.`, '']}},
      {id:'stoer-t4e', title:'Typischer Fehler: nur die Diagonalelemente nehmen',
        num:{title:'Was die Diagonale allein liefert', text:R`$\langle 2s|e\mathcal E\hat z|2s\rangle = 0$ und $\langle 2p_0|e\mathcal E\hat z|2p_0\rangle = 0$, beide aus Paritätsgründen. Wer nur sie nimmt, findet

$$E^{(1)} = 0$$

für alle vier Zustände, also keine Aufspaltung. Gemessen wird eine Aufspaltung um $\pm w$.`},
        text:R`„Man nimmt einfach $\langle 2s|\hat H'|2s\rangle$ und $\langle 2p_0|\hat H'|2p_0\rangle$, wie im nicht entarteten Fall.“ Das ist der typische Fehler bei Entartung. Beide Diagonalelemente sind null, und man fände fälschlich gar keine Verschiebung. Entscheidend ist die Nebendiagonale von $W$. Die Diagonalelemente geben die richtigen Korrekturen nur, wenn $W$ in der gewählten Basis schon diagonal ist. Ob das so ist, siehst du erst, wenn du alle Einträge von $W$ im entarteten Unterraum aufgestellt hast.`,
        q:{q:'Für welches $W$ im entarteten Unterraum darfst du die Diagonalelemente direkt als Korrekturen $E^{(1)}$ nehmen?',
          opts:['$W = \\begin{pmatrix}0 & w\\\\ w & 0\\end{pmatrix}$', '$W = \\begin{pmatrix}0{,}3 & 0\\\\ 0 & -0{,}1\\end{pmatrix}$', '$W = \\begin{pmatrix}0{,}2 & 0{,}1\\\\ 0{,}1 & 0{,}2\\end{pmatrix}$'], a:1,
          ex:'Nur bei einem diagonalen $W$ sind die Diagonalelemente schon die Eigenwerte: $E^{(1)} = 0{,}3$ und $-0{,}1$. Sonst mischt die Nebendiagonale die Basiszustände, und man muss $W$ diagonalisieren.',
          fb:['Die Diagonale ist null, die Nebendiagonale nicht. Die richtigen Korrekturen sind die Eigenwerte $\\pm w$, wie im Beispiel.', '', 'Auch eine kleine Nebendiagonale mischt entartete Zustände vollständig. Die Eigenwerte sind $0{,}3$ und $0{,}1$, nicht zweimal $0{,}2$.']}}
    ]},

    /* ===== Abschnitt 5: Variationsprinzip ===== */
    {id:'stoer-t5', title:'Das Variationsprinzip', steps:[
      {id:'stoer-t5a', title:'Eine obere Schranke für jeden Versuch',
        num:{title:'Zwei Versuche im Zweiniveausystem', text:R`$\hat H \doteq \begin{pmatrix}1{,}1 & 0{,}2\\ 0{,}2 & 2{,}9\end{pmatrix}$, exakt $E_0 = 1{,}0780$. Der Versuch $(1;\ 0)$ gibt $\langle H\rangle = 1{,}1$. Der Versuch $(1;\ -0{,}1)$, normiert, gibt

$$\langle H\rangle = \frac{1{,}1 - 0{,}04 + 0{,}029}{1{,}01} \approx 1{,}0782.$$

Beide liegen über $E_0$, der zweite nur um $0{,}0002$.`},
        text:R`Für jeden normierten Zustand $|\psi\rangle$ gilt

$$\langle\psi|\hat H|\psi\rangle \ge E_0,$$

mit der exakten Grundzustandsenergie $E_0$. Der Erwartungswert der Energie in einem beliebigen Versuchszustand ist also eine **obere Schranke** für $E_0$ ([[lex:variationsprinzip|Variationsprinzip]]). Das gilt, ohne dass du $E_0$ oder die exakten Eigenzustände kennst. Je besser der Versuch, desto näher liegt die Schranke an $E_0$. Ein tieferer Wert ist also immer der bessere.`,
        derive:{ctx:STMAT({H:'(11/10, 1/5; 1/5, 29/10)'}, {}), lines:[
          {l:'(1, -1/10) H (1; -1/10) = 1089/1000', w:'Zeile mal Matrix mal Spalte, noch nicht normiert'},
          {l:'(1, -1/10) (1; -1/10) = 101/100', w:'Normquadrat des Versuchs',
            why:{q:'Wozu braucht man diese Zeile?', opts:['Weil $\\langle H\\rangle = \\langle\\psi|\\hat H|\\psi\\rangle/\\langle\\psi|\\psi\\rangle$ für einen nicht normierten Versuch gilt.', 'Weil der Versuch orthogonal zum Grundzustand sein muss, $\\langle 0|\\psi\\rangle = 0$.', 'Weil das Normquadrat $\\langle\\psi|\\psi\\rangle$ die Energie zweiter Ordnung ist.'], a:0, ex:'$1{,}089/1{,}01 \\approx 1{,}0782$. Ohne Division käme $1{,}089$ heraus, eine zu hohe Schranke.'}},
          {l:'det(H - (2 - sqrt(85)/10) I) = 0', w:'exakte Grundzustandsenergie zum Vergleich'}
        ]},
        q:{q:R`Zwei Ansätze für ein Atom liefern $\langle H\rangle = -12{,}9\,\mathrm{eV}$ und $-13{,}4\,\mathrm{eV}$. Welcher liegt näher an der exakten Grundzustandsenergie?`,
          opts:[R`$-12{,}9\,\mathrm{eV}$, weil Schranken von oben kommen`, R`ohne $E_0$ lässt sich das nicht sagen`, R`$-13{,}4\,\mathrm{eV}$, weil beide über $E_0$ liegen`], a:2,
          ex:R`Beide sind obere Schranken: $E_0 \le -13{,}4\,\mathrm{eV}$. Der tiefere Wert ist also näher dran.`,
          fb:[R`Gerade weil beide von oben kommen, ist der tiefere näher am exakten Wert.`,
            R`Man braucht $E_0$ nicht: Beide liegen darüber, also ist der tiefere sicher näher.`, '']}},
      {id:'stoer-t5b', title:'Der Beweis in zwei Zeilen',
        pre:{from:'form', seg:'form-t3', title:'Erwartungswert in der Eigenbasis', text:R`Entwickelst du $|\psi\rangle = \sum_nc_n|a_n\rangle$ nach der Eigenbasis von $\hat A$, ist $\langle A\rangle = \sum_na_n|c_n|^2$ mit $\sum_n|c_n|^2 = 1$. Mini-Beispiel: Gewichte $0{,}9$ und $0{,}1$ bei den Werten $1$ und $4$ geben $\langle A\rangle = 1{,}3$.`},
        num:{title:'Gewichte und Energien', text:R`Ein Versuchszustand bestehe zu $90\,\%$ aus dem Grundzustand ($E_0 = 1$) und zu $10\,\%$ aus dem ersten angeregten ($E_1 = 4$):

$$\langle H\rangle = 0{,}9\cdot1 + 0{,}1\cdot4 = 1{,}3 \ge 1 = E_0.$$

Jedes Gewicht bei einem höheren Niveau hebt den Mittelwert an.`},
        text:R`Entwickle $|\psi\rangle$ nach den unbekannten exakten Eigenzuständen: $|\psi\rangle = \sum_nc_n|n\rangle$ mit $\sum_n|c_n|^2 = 1$ (Thema 6, [[lex:entwicklung|Entwicklung nach Eigenfunktionen]]). Dann ist

$$\langle\psi|\hat H|\psi\rangle = \sum_n|c_n|^2E_n \ge \sum_n|c_n|^2E_0 = E_0.$$

Im Schritt „$\ge$“ steht nur $E_n \ge E_0$ für alle $n$. Gleichheit gilt genau dann, wenn $|\psi\rangle$ nur aus Grundzuständen besteht. Du brauchst die $E_n$ und $c_n$ also nie auszurechnen; es genügt, dass es sie gibt.`,
        q:{q:'Für welches Spektrum $E_1, E_2, E_3, \\dots$ ließe sich der Beweis **nicht** führen?',
          opts:['$E_n = -13{,}6\\,\\mathrm{eV}/n^2$', '$E_n = n^2E_1$ mit $E_1 > 0$', '$E_n = -n\\cdot 1\\,\\mathrm{eV}$'], a:2,
          ex:'Der Schritt „$\\ge$“ braucht einen tiefsten Wert $E_0$ mit $E_n \\ge E_0$ für alle $n$. Bei $E_n = -n\\cdot 1\\,\\mathrm{eV}$ gibt es keinen: Unter jedem Niveau liegt noch ein tieferes. Negative Energien wie $-13{,}6\\,\\mathrm{eV}/n^2$ stören nicht, solange es ein tiefstes Niveau gibt, hier $-13{,}6\\,\\mathrm{eV}$.',
          fb:['Negative Energien sind kein Problem: Das tiefste Niveau ist $E_1 = -13{,}6\\,\\mathrm{eV}$, und alle anderen liegen darüber.', 'Hier ist $E_1$ das tiefste Niveau; der Beweis geht genauso.', '']}},
      {id:'stoer-t5c', title:'Das Verfahren: eine Familie und ihr Minimum',
        num:{title:'Gauß-Ansatz für Wasserstoff', text:R`Ein Versuch $\psi \propto e^{-\alpha r^2}$ mit dem Parameter $\alpha$ hat nicht die richtige Form am Kern. Minimiert über $\alpha$ ergibt sich

$$\langle H\rangle_{\min} = -\frac{8}{3\pi}\cdot13{,}6\,\mathrm{eV} \approx -11{,}5\,\mathrm{eV},$$

eine obere Schranke für den exakten Wert $-13{,}6\,\mathrm{eV}$, $15\,\%$ zu hoch.`},
        text:R`Man wählt eine Familie von Versuchsfunktionen $\psi_b$ mit einem oder mehreren Parametern $b$. Sie soll zu den bekannten Eigenschaften passen: Randbedingungen, Symmetrie, keine Knoten im Grundzustand. Dann berechnet man $\langle H\rangle(b)$ und minimiert, also $\frac{d}{db}\langle H\rangle = 0$. Das Minimum ist die beste Schranke innerhalb der Familie. Eine gute Familie trifft die Form des Grundzustands gut; der Gauß-Ansatz für Wasserstoff verfehlt die Spitze am Kern und liegt deshalb deutlich daneben.`,
        q:{q:R`Ein Ansatz $\psi_b$ gibt $\langle H\rangle(b) = 2b + 8/b$ in eV, für $b > 0$. Welche Schranke liefert er?`,
          opts:[R`$8\,\mathrm{eV}$ bei $b = 2$`, R`$10\,\mathrm{eV}$ bei $b = 1$`, R`$0$, weil $8/b$ gegen null geht`], a:0,
          ex:R`$\frac{d}{db}(2b + 8/b) = 2 - 8/b^2 = 0$ gibt $b = 2$ und $\langle H\rangle = 4 + 4 = 8\,\mathrm{eV}$.`,
          fb:['', R`$b = 1$ ist nicht das Minimum: $\langle H\rangle(2) = 8$ ist kleiner.`,
            R`Für großes $b$ wächst $2b$; das Minimum liegt dazwischen.`]}},
      {id:'stoer-t5d', title:'Beispiel: Kasten mit einer Parabel',
        num:{title:'Die Parabel normiert', text:R`$\psi = N\,x(L - x)$ verschwindet an beiden Wänden. Mit $\int_0^Lx^2(L - x)^2dx = L^5/30$ ist

$$N = \sqrt{30/L^5}.$$

Die Herleitung gibt $\langle H\rangle = 5\,\hbar^2/(mL^2)$; exakt ist $E_1 = \pi^2\hbar^2/(2mL^2) \approx 4{,}935\,\hbar^2/(mL^2)$.`},
        text:R`Im Kasten $0 < x < L$ ist $\psi(x) = \sqrt{30/L^5}\,x(L - x)$ ein guter Versuch: Er verschwindet an beiden Wänden, ist normiert und knotenfrei. Weil im Kasten $V = 0$ ist, bleibt nur die kinetische Energie. Die Herleitung rechnet sie aus. Die Schranke liegt nur $1{,}3\,\%$ über $E_1$, obwohl die Parabel kein Sinus ist. Im Kasten heißt die Grundzustandsenergie $E_1$, weil die Zählung dort bei $n = 1$ beginnt.`,
        derive:{ctx:CTX.box({defs:{'ψ(x)':'sqrt(30/L^5) x (L - x)'}}), lines:[
          {l:"⟨H⟩ = -ħ^2/(2m) ∫_0^L ψ ψ'' dx", w:'im Kasten ist $V = 0$'},
          {l:"ψ'' = -2 sqrt(30/L^5)", w:'zweimal abgeleitet',
            why:{q:'Warum ist $\\psi\'\'$ konstant?', opts:['Weil $\\psi$ ein Polynom zweiten Grades in $x$ ist.', 'Weil $\\psi$ eine Eigenfunktion von $\\hat H$ ist.', 'Weil $\\psi$ an den Wänden verschwindet.'], a:0, ex:'$x(L - x) = Lx - x^2$ hat die zweite Ableitung $-2$. Wäre $\\psi$ Eigenfunktion, müsste $\\psi\'\' \\propto \\psi$ sein – das ist hier nicht so.'}},
          {l:'⟨H⟩ = ħ^2/m sqrt(30/L^5) ∫_0^L ψ dx', w:'Konstante vor das Integral',
            why:{q:'Woher kommt das Pluszeichen?', opts:['$-\\frac{\\hbar^2}{2m}\\cdot(-2) = +\\frac{\\hbar^2}{m}$', 'aus der Normierung von $\\psi$', 'weil die kinetische Energie im Kasten negativ ist'], a:0, ex:'Die Konstante $\\psi\'\' = -2\\sqrt{30/L^5}$ wird vor das Integral gezogen; zusammen mit $-\\hbar^2/(2m)$ gibt das $+\\frac{\\hbar^2}{m}\\sqrt{30/L^5}$.'}},
          {l:'= ħ^2/m · 30/L^5 ∫_0^L x (L - x) dx', w:'ψ eingesetzt'},
          {l:'= ħ^2/m · 30/L^5 · L^3/6', w:'$\\int_0^L x(L-x)dx = \\frac{L^3}{2} - \\frac{L^3}{3}$'},
          {l:'= 5ħ^2/(m L^2)', w:'vereinfacht',
            why:{q:'Was folgt aus dem Vergleich mit $E_1 = \\pi^2\\hbar^2/(2mL^2) \\approx 4{,}93\\,\\hbar^2/(mL^2)$?', opts:['Die Schranke liegt wie erwartet knapp über $E_1$.', 'Die Rechnung ist falsch, das Ergebnis muss unter $E_1$ liegen.', 'Die Parabel ist der exakte Grundzustand.'], a:0, ex:'$5 > \\pi^2/2$: eine obere Schranke, 1,3 % zu hoch. Ein Ergebnis unter $E_1$ würde einen Rechenfehler anzeigen.'}}
        ]},
        q:{q:R`Jemand erhält mit einem Ansatz im Kasten $\langle H\rangle = 4{,}8\,\hbar^2/(mL^2)$. Was schließt du?`,
          opts:['ein besserer Ansatz, denn $4{,}8 < 5$ liegt tiefer als die Parabel', 'ein Rechenfehler, denn das liegt unter $E_1$', 'ein Ansatz mit Knoten, denn der senkt $\\langle H\\rangle$ unter $E_1$'], a:1,
          ex:R`$E_1 \approx 4{,}935\,\hbar^2/(mL^2)$. Kein normierter Zustand kann darunter liegen.`,
          fb:[R`Besser heißt näher von oben. $4{,}8$ liegt unter dem exakten Wert, das ist unmöglich.`, '',
            R`Ein Knoten würde $\langle H\rangle$ erhöhen, nicht unter $E_1$ drücken.`]}},
      {id:'stoer-t5e', title:'Warum die Energie so genau ist',
        num:{title:R`Ein Fehler $\varepsilon$ im Zustand`, text:R`Der Versuch $(1;\ -0{,}1)$ weicht vom exakten Eigenvektor $(1;\ -0{,}110)$ um $\varepsilon \approx 0{,}01$ ab. Die Energie liegt aber nur

$$1{,}0782 - 1{,}0780 = 0{,}0002 \approx 2\varepsilon^2$$

zu hoch, von der Ordnung $\varepsilon^2$. Der Versuch $(1;\ 0)$ mit $\varepsilon \approx 0{,}11$ liegt $0{,}022$ zu hoch.`},
        text:R`Weicht der Versuchszustand um einen Anteil der Größe $\varepsilon$ vom Grundzustand ab, so ist $|c_n|^2$ von der Ordnung $\varepsilon^2$ für $n \ne 0$. Der Fehler der Energie ist also nur von der Ordnung $\varepsilon^2$. Andere Erwartungswerte wie $\langle x^2\rangle$ haben meist schon einen Fehler der Ordnung $\varepsilon$. Die Energie ist gut, die Wellenfunktion oft schlechter. Nimmt man den ungestörten Grundzustand als Versuch, ist $\langle 0^{(0)}|\hat H|0^{(0)}\rangle = E_0^{(0)} + E_0^{(1)}$. Die erste Ordnung ist also immer eine obere Schranke, passend zu $E_0^{(2)} \le 0$.`,
        q:{q:R`Warum ist $E_0^{(0)} + E_0^{(1)}$ immer eine obere Schranke für den Grundzustand?`,
          opts:['Weil die erste Ordnung $E_0^{(1)}$ immer positiv ist.', 'Weil sie $\\langle H\\rangle$ im Versuch $|0^{(0)}\\rangle$ ist.', 'Weil die Störung $\\hat H\'$ den Grundzustand immer anhebt.'], a:1,
          ex:R`$\langle 0^{(0)}|\hat H_0 + \hat H'|0^{(0)}\rangle = E_0^{(0)} + E_0^{(1)}$. Nach dem Variationsprinzip ist das $\ge E_0$.`,
          fb:[R`$E_0^{(1)}$ kann negativ sein. Die Schranke folgt aus dem Variationsprinzip, nicht aus einem Vorzeichen.`, '',
            R`Eine Störung kann den Grundzustand auch senken. Trotzdem liegt die erste Ordnung nie darunter.`]}},
      {id:'stoer-t5f', title:'Typischer Fehler: Das Minimum sei die exakte Energie',
        num:{title:'Zwei Familien', text:R`Für den Oszillator enthält die Gauß-Familie $e^{-bx^2}$ den exakten Grundzustand: Das Minimum ist exakt $\hbar\omega/2$. Für Wasserstoff enthält sie ihn nicht:

$$-11{,}5\,\mathrm{eV} > -13{,}6\,\mathrm{eV}.$$

Dasselbe Verfahren, einmal exakt, einmal $15\,\%$ daneben.`},
        text:R`„Das Minimum über $b$ ist die exakte Grundzustandsenergie.“ Das gilt nur, wenn die Familie den exakten Grundzustand enthält, wie der Gauß-Ansatz beim Oszillator. Sonst ist es eine Schranke, und wie weit sie danebenliegt, sagt das Verfahren allein nicht. Ein zweiter Fehler ist, das Variationsprinzip auf angeregte Zustände anzuwenden. Für sie gilt die Schranke nur, wenn der Versuch orthogonal zu allen tieferen Zuständen ist, etwa durch Symmetrie.`,
        q:{q:R`Der Gauß-Ansatz $e^{-bx^2}$ liefert beim harmonischen Oszillator genau $\hbar\omega/2$. Warum?`,
          opts:[R`Das Variationsprinzip liefert immer den exakten Wert.`, R`Gauß-Funktionen sind Eigenfunktionen jedes $\hat H$.`, R`Die Familie enthält den exakten Grundzustand.`], a:2,
          ex:R`Für $b = m\omega/(2\hbar)$ ist $e^{-bx^2}$ genau $\psi_0$. Bei anderen Potentialen gibt derselbe Ansatz nur eine Schranke.`,
          fb:[R`Im Wasserstoff liefert derselbe Ansatz $-11{,}5\,\mathrm{eV}$ statt $-13{,}6\,\mathrm{eV}$.`,
            R`Gauß-Funktionen sind nur für das Parabelpotential Eigenfunktionen.`, '']}}
    ]},

    /* ===== Abschnitt 6: Anwendungen ===== */
    {id:'stoer-t6', title:'Anwendungen: anharmonischer Oszillator und Stark-Effekt', steps:[
      {id:'stoer-t6a', title:'Quartischer Term in erster Ordnung',
        pre:{from:'osz', seg:'osz-t4', title:'Leiteroperatoren', text:R`$\hat x = \sqrt{\hbar/(2m\omega)}\,(\hat a + \hat a^\dagger)$ mit $\hat a|n\rangle = \sqrt n|n-1\rangle$ und $\hat a^\dagger|n\rangle = \sqrt{n+1}|n+1\rangle$. Mini-Beispiel: $(\hat a + \hat a^\dagger)|0\rangle = |1\rangle$ und $(\hat a + \hat a^\dagger)^2|0\rangle = |0\rangle + \sqrt2|2\rangle$.`},
        num:{title:R`$n = 0$ und $n = 1$`, text:R`Abgezählt mit Leiteroperatoren ist $\langle n|(\hat a + \hat a^\dagger)^4|n\rangle = 6n^2 + 6n + 3$:

$$n = 0:\ 3,\qquad n = 1:\ 15.$$

Also $E_0^{(1)} = 3\lambda\left(\frac{\hbar}{2m\omega}\right)^2$ und $E_1^{(1)} = 15\lambda\left(\frac{\hbar}{2m\omega}\right)^2$: Das höhere Niveau steigt fünfmal so stark.`},
        text:R`Ein Molekülpotential ist nur nahe dem Minimum eine Parabel. Die nächsten Glieder der [[lex:taylor|Taylor-Reihe]] sind $\kappa x^3$ und $\lambda x^4$. Mit den [[lex:leiteroperatoren|Leiteroperatoren]] werden die Matrixelemente zu reinem Abzählen. $(\hat a + \hat a^\dagger)^4$ besteht aus Produkten von vier Faktoren. Zum Diagonalelement tragen nur die sechs Anordnungen mit zwei $\hat a$ und zwei $\hat a^\dagger$ bei. Ergebnis:

$$E_n^{(1)} = \lambda\Big(\frac{\hbar}{2m\omega}\Big)^2(6n^2 + 6n + 3).$$

Für $\lambda > 0$ wird die Feder bei großen Auslenkungen steifer, und die Abstände wachsen mit $n$.`,
        derive:{ctx:STOSC(), lines:[
          {l:'⟨n|x^4|n⟩ = (ħ/(2mω))^2 ⟨n|(a + a†)^4|n⟩', w:R`$\hat x = \sqrt{\hbar/(2m\omega)}\,(\hat a + \hat a^\dagger)$`},
          {l:'⟨n|(a + a†)^4|n⟩ = 6n^2 + 6n + 3', w:R`sechs Anordnungen mit zwei $\hat a$ und zwei $\hat a^\dagger$`,
            why:{q:'Welche Anordnung trägt zum Diagonalelement bei?', opts:['$\\hat a\\hat a\\hat a^\\dagger\\hat a^\\dagger$: zweimal hoch, zweimal runter', '$\\hat a^\\dagger\\hat a^\\dagger\\hat a^\\dagger\\hat a$: dreimal hoch, einmal runter', '$\\hat a\\hat a\\hat a\\hat a$: viermal hinunter'], a:0, ex:'Nur wenn $n$ am Ende wieder $n$ ist, bleibt $\\langle n|\\dots|n\\rangle \\ne 0$. Das verlangt gleich viele $\\hat a$ wie $\\hat a^\\dagger$.'}},
          {l:'⟨0|x^4|0⟩ = 3 (ħ/(2mω))^2', w:R`$n = 0$ eingesetzt`}
        ]},
        q:{q:R`Um wie viel wächst der Abstand $E_1 - E_0$ durch $\lambda\hat x^4$ in erster Ordnung?`,
          opts:[R`um $3\lambda\left(\tfrac{\hbar}{2m\omega}\right)^2$`, R`um $12\lambda\left(\tfrac{\hbar}{2m\omega}\right)^2$`, R`gar nicht, beide Niveaus steigen gleich`], a:1,
          ex:R`$E_1^{(1)} - E_0^{(1)} = (15 - 3)\,\lambda\left(\tfrac{\hbar}{2m\omega}\right)^2 = 12\lambda\left(\tfrac{\hbar}{2m\omega}\right)^2$.`,
          fb:[R`$3$ ist $E_0^{(1)}$ allein. Gefragt ist die Differenz $15 - 3$.`, '',
            R`Die Korrektur hängt über $6n^2 + 6n + 3$ von $n$ ab; höhere Niveaus steigen stärker.`]}},
      {id:'stoer-t6b', title:'Kubischer Term: erst die zweite Ordnung',
        num:{title:R`$\hat x^3|0\rangle$`, text:R`Dreimal $\hat a + \hat a^\dagger$ auf $|0\rangle$ angewandt:

$$(\hat a + \hat a^\dagger)^3|0\rangle = \sqrt6\,|3\rangle + 3\,|1\rangle.$$

Nur $|1\rangle$ und $|3\rangle$ kommen vor. Kein $|0\rangle$, also $E_0^{(1)} = 0$, und in der zweiten Ordnung nur zwei Summanden.`},
        text:R`$\hat x^3$ ist ungerade, also ist $E_n^{(1)} = 0$ ([[lex:paritaet-auswahlregel|Parität]]). Erst die zweite Ordnung trägt bei. Für den Grundzustand folgt mit den beiden Zwischenzuständen

$$E_0^{(2)} = -\frac{11\,\kappa^2}{\hbar\omega}\Big(\frac{\hbar}{2m\omega}\Big)^3.$$

Allgemein ist $E_n^{(2)} = -\frac{\kappa^2}{\hbar\omega}\left(\frac{\hbar}{2m\omega}\right)^3(30n^2 + 30n + 11)$. Alle Niveaus sinken, höhere stärker; die Abstände werden mit $n$ kleiner. Das Vorzeichen von $\kappa$ spielt keine Rolle, weil es quadriert eingeht.`,
        derive:{ctx:STOSC(), lines:[
          {l:'⟨n|x^3|n⟩ = 0', w:'Parität',
            why:{q:'Warum verschwindet das?', opts:['Weil $\\hat x^3$ den Wert $n$ nur um $\\pm1$ oder $\\pm3$ ändert.', 'Weil $\\hat x^3$ kein hermitescher Operator ist.', 'Weil $\\langle n|\\hat x|n\\rangle^3 = 0$ ist.'], a:0, ex:'Eine ungerade Zahl von Leiteroperatoren kann nicht zu $n$ zurückführen. $\\hat x^3$ ist hermitesch; und $\\langle x^3\\rangle$ ist nicht dasselbe wie $\\langle x\\rangle^3$.'}},
          {l:'|⟨1|x^3|0⟩|^2 = 9 (ħ/(2mω))^3', w:R`Koeffizient $3$ von $|1\rangle$, quadriert`},
          {l:'|⟨3|x^3|0⟩|^2 = 6 (ħ/(2mω))^3', w:R`Koeffizient $\sqrt6$ von $|3\rangle$, quadriert`},
          {l:'Σ_{k=1}^{3} |⟨k|x^3|0⟩|^2/(0 - k ħω) = -11/(ħω) (ħ/(2mω))^3', w:R`$E_0^{(2)}/\kappa^2$ mit $E_0^{(0)} - E_k^{(0)} = -k\hbar\omega$`,
            why:{q:'Warum genügen $k = 1, 2, 3$?', opts:['$\\hat x^3|0\\rangle$ enthält nur $|1\\rangle$ und $|3\\rangle$.', 'Höhere $k$ sind wegen des großen Nenners klein.', 'Die Summe bricht nach drei Gliedern immer ab.'], a:0, ex:'Alle anderen Matrixelemente sind exakt null, auch $k = 2$. Die Summe ist damit exakt: $9/(-1) + 6/(-3) = -11$ in Einheiten von $(\\hbar/2m\\omega)^3/(\\hbar\\omega)$.'}}
        ]},
        q:{q:R`Für $\hat H' = \kappa\hat x^3$ im Oszillator ist $E_n^{(1)}$ …`,
          opts:[R`positiv für $\kappa > 0$, wächst mit $n$`, R`null für alle $n$, wegen der Parität`, R`proportional zu $(2n + 1)$, wie bei $x^2$`], a:1,
          ex:R`$\langle n|\hat x^3|n\rangle = 0$. Der kubische Term wirkt erst in zweiter Ordnung, und dort senkt er alle Niveaus.`,
          fb:[R`Bei $\kappa > 0$ ist $\kappa x^3$ für $x > 0$ positiv, für $x < 0$ negativ; im symmetrischen $|\psi_n|^2$ heben sich beide Seiten auf.`, '',
            R`$2n + 1$ gehört zu $\langle x^2\rangle$. $x^3$ ist ungerade.`]}},
      {id:'stoer-t6c', title:'Molekülschwingungen: der Oberton',
        num:{title:'Chlorwasserstoff', text:R`Die Grundschwingung von HCl liegt bei $2886\,\mathrm{cm^{-1}}$, der erste Oberton bei $5668\,\mathrm{cm^{-1}}$. Harmonisch erwartet man

$$2\cdot2886\,\mathrm{cm^{-1}} = 5772\,\mathrm{cm^{-1}}.$$

Der Oberton liegt $104\,\mathrm{cm^{-1}}$ tiefer: Die Niveaus rücken nach oben zusammen.`},
        text:R`Bei realen Molekülpotentialen überwiegt meist der Effekt des kubischen Terms. Das Potential ist auf der Seite großer Abstände flacher, weil die Bindung dort aufreißt. Die höheren Schwingungsniveaus sinken stärker als die tieferen, die Abstände werden mit $n$ kleiner. Man sieht das in Schwingungsspektren zweiatomiger Moleküle: Der erste Oberton, der Übergang $0 \to 2$, liegt etwas unter dem Doppelten der Grundschwingung ([[lex:anharmonischer-oszillator|anharmonischer Oszillator]]). Aus der Abweichung bestimmt man die Anharmonizität der Bindung.`,
        q:{q:R`Aus den HCl-Werten $2886\,\mathrm{cm^{-1}}$ ($0 \to 1$) und $5668\,\mathrm{cm^{-1}}$ ($0 \to 2$): Wie weit liegen die Niveaus $n = 1$ und $n = 2$ auseinander?`, tr:{from:'physik', to:'formel'},
          opts:[R`$2886\,\mathrm{cm^{-1}}$, wie die Grundschwingung`, R`$2834\,\mathrm{cm^{-1}}$, die Hälfte des Obertons`, R`$2782\,\mathrm{cm^{-1}}$`], a:2,
          ex:R`$E_2 - E_1 = (E_2 - E_0) - (E_1 - E_0) = 5668 - 2886 = 2782\,\mathrm{cm^{-1}}$. Der obere Abstand ist um $104\,\mathrm{cm^{-1}}$ kleiner als der untere: Die Niveaus rücken zusammen.`,
          fb:[R`Gleiche Abstände gälten nur harmonisch. Der Oberton zeigt gerade, dass sie verschieden sind.`,
            R`Die Hälfte des Obertons ist der *mittlere* Abstand der Niveaus $0$, $1$, $2$, nicht der obere.`, '']}},
      {id:'stoer-t6d', title:'Der quadratische Stark-Effekt',
        num:{title:R`Wasserstoff in $10^7\,\mathrm{V/m}$`, text:R`Mit der Polarisierbarkeit $\alpha = 4\pi\varepsilon_0\cdot\tfrac92a_0^3 \approx 7{,}4\cdot10^{-41}\,\mathrm{C\,m^2/V}$ ist

$$E^{(2)} = -\tfrac12\alpha\mathcal E^2 \approx -2{,}3\cdot10^{-8}\,\mathrm{eV}.$$

Das ist rund $70\,000$-mal kleiner als die lineare Aufspaltung $w \approx 1{,}6\cdot10^{-3}\,\mathrm{eV}$ bei $n = 2$ im selben Feld.`},
        text:R`Ein Atom im Feld $\mathcal E\hat z$ hat die Störung $\hat H' = e\mathcal E\hat z$, mit der Elektronenladung $-e$. Der Grundzustand des Wasserstoffs ist nicht entartet und hat gerade Parität. Also ist $E^{(1)} = e\mathcal E\langle z\rangle = 0$: Das Atom hat kein festes Dipolmoment. Die zweite Ordnung ist negativ und quadratisch in $\mathcal E$, geschrieben $E^{(2)} = -\frac12\alpha\mathcal E^2$. Das Feld *induziert* ein Dipolmoment $\alpha\mathcal E$; $\alpha$ heißt Polarisierbarkeit. Das ist der **quadratische** [[lex:stark-effekt|Stark-Effekt]].`,
        reps:{obj:R`Wasserstoff im Feld: Grundzustand gegen $n = 2$`,
          rows:[
            {k:'worte', text:R`Der Grundzustand wird erst durch das Feld verformt und dann verschoben. Die Zustände $\phi_\pm$ bei $n = 2$ haben schon ohne Feld ein Dipolmoment.`},
            {k:'formel', tex:R`1s:\ E^{(1)} = 0,\ E^{(2)} = -\tfrac12\alpha\mathcal E^2\qquad n = 2:\ E^{(1)} = \pm3e\mathcal Ea_0`},
            {k:'graph', plot:{x:[0, 1], y:[-1.1, 1.1], xlab:R`\mathcal E/\mathcal E_0`, ylab:R`\Delta E\ \text{(schematisch)}`}, f:x => -x * x, lab:R`1s`, f2:x => x, lab2:R`n = 2,\ \phi_+`,
              cap:R`Schema, nicht maßstäblich: Der Grundzustand sinkt wie eine Parabel, der Zustand $\phi_+$ steigt wie eine Gerade. Für kleine Felder ist die Gerade viel steiler.`},
            {k:'physik', text:R`Bei $\mathcal E = 10^7\,\mathrm{V/m}$ sinkt $1s$ um $2{,}3\cdot10^{-8}\,\mathrm{eV}$, die $n = 2$-Komponenten verschieben sich um $\pm1{,}6\cdot10^{-3}\,\mathrm{eV}$. Doppeltes Feld: vierfache bzw. doppelte Verschiebung.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Erst verformt“ heißt: Die erste Ordnung ist null, erst die zweite trägt bei, mit $\mathcal E^2$. „Schon ein Dipol“ heißt: erste Ordnung, linear in $\mathcal E$.`},
            {from:'formel', to:'graph', rule:R`$E^{(2)} \propto -\mathcal E^2$ als nach unten offene Parabel, $E^{(1)} \propto \mathcal E$ als Gerade durch den Ursprung zeichnen.`},
            {from:'graph', to:'physik', rule:R`An der Krümmung bzw. Steigung ablesen, wie die Verschiebung mit dem Feld wächst; die Zahlenwerte aus der Formel einsetzen.`}
          ]},
        q:{q:R`Bei $10^7\,\mathrm{V/m}$ sinkt der Grundzustand um $2{,}3\cdot10^{-8}\,\mathrm{eV}$. Um wie viel sinkt er bei $3\cdot10^7\,\mathrm{V/m}$?`, tr:{from:'formel', to:'physik'},
          opts:[R`um $6{,}9\cdot10^{-8}\,\mathrm{eV}$`, R`um $2{,}1\cdot10^{-7}\,\mathrm{eV}$`, R`um $4{,}0\cdot10^{-8}\,\mathrm{eV}$`], a:1,
          ex:R`$E^{(2)} = -\frac12\alpha\mathcal E^2$ wächst quadratisch: dreifaches Feld, neunfache Verschiebung, $9\cdot2{,}3\cdot10^{-8}\,\mathrm{eV} \approx 2{,}1\cdot10^{-7}\,\mathrm{eV}$.`,
          fb:[R`Das ist das Dreifache. Linear wächst nur die Verschiebung bei Entartung wie bei $n = 2$; der Grundzustand verschiebt sich quadratisch.`, '',
            R`Das ist der Faktor $\sqrt3$, ein Wachstum mit $\sqrt{\mathcal E}$. Das kommt hier nicht vor.`]}},
      {id:'stoer-t6e', title:'Typischer Fehler: Jedes Atom verschiebe sich linear im Feld',
        num:{title:R`Zwei Felder für $1s$`, text:R`Bei $\mathcal E = 10^7\,\mathrm{V/m}$ ist $E^{(2)} \approx -2{,}3\cdot10^{-8}\,\mathrm{eV}$, bei $2\cdot10^7\,\mathrm{V/m}$

$$E^{(2)} \approx -9{,}3\cdot10^{-8}\,\mathrm{eV},$$

das Vierfache, nicht das Doppelte. Ein festes Dipolmoment gäbe dagegen eine lineare Verschiebung.`},
        text:R`„Die Energie eines Atoms im Feld ändert sich wie die eines Dipols, also linear in $\mathcal E$.“ Das gilt nur bei Entartung zwischen Zuständen verschiedener Parität, wie $2s$ und $2p$. Ein nicht entarteter Zustand fester Parität hat kein permanentes Dipolmoment; der Effekt beginnt quadratisch. Ein zweiter Fehler lautet: „Weil $\langle z\rangle = 0$ ist, ist die Störung null.“ $\hat H' = e\mathcal E\hat z$ ist nicht null; nur sein Erwartungswert im ungestörten Zustand verschwindet. Die Nebendiagonalelemente zu $2p$, $3p$, … bleiben und geben die zweite Ordnung.`,
        q:{q:R`Warum zeigt der Grundzustand des Wasserstoffs keinen linearen Stark-Effekt?`,
          opts:[R`Das Feld wirkt nur auf angeregte Zustände des Atoms.`, R`Er ist kugelsymmetrisch, also ist $\hat H' = 0$.`, R`Er ist nicht entartet und hat gerade Parität: $\langle z\rangle = 0$.`], a:2,
          ex:R`$\hat H' = e\mathcal E\hat z$ ist nicht null; nur sein Erwartungswert verschwindet. Die zweite Ordnung bleibt.`,
          fb:[R`Das Feld wirkt auf jeden Zustand. Im Grundzustand beginnt die Verschiebung nur erst bei $\mathcal E^2$.`,
            R`Die Störung $e\mathcal E\hat z$ ist ein Operator ungleich null. Null ist nur $\langle 1s|\hat z|1s\rangle$.`, '']}}
    ]}
  ],
  example:{
    title:'Stufe auf der linken Hälfte des Kastens',
    text:'Ein Kasten $0 < x < L$ bekommt auf der linken Hälfte die Störung $\\hat H\' = V_0$ für $x < L/2$ (rechts $0$). Bestimme die Energiekorrektur erster Ordnung für den Zustand $\\psi_n = \\sqrt{2/L}\\sin(n\\pi x/L)$.',
    ctx:STBOX({"H'":'V_0 Θ(L/2 - x)'}),
    lines:[
      {l:"E^(1) = ⟨ψ_n|H'|ψ_n⟩", why:{q:'Warum ist das die Korrektur erster Ordnung?', opts:['Sie ist der Mittelwert der Störung im ungestörten Zustand.', 'Weil $\\hat H\'$ hermitesch ist und reelle Werte hat.', 'Sie ist die Energie des gestörten Zustands $|n\\rangle$.'], a:0, ex:'$E_n \\approx E_n^{(0)} + \\langle n|\\hat H\'|n\\rangle$: Für die Energiekorrektur erster Ordnung genügt der ungestörte Zustand. Der Zustand selbst ändert sich schon in erster Ordnung ($|n^{(1)}\\rangle$); das wirkt sich erst in der zweiten Ordnung der Energie aus.'}},
      {l:'= 2/L V_0 ∫_0^{L/2} sin(nπx/L)^2 dx', why:{q:'Warum geht das Integral nur bis $L/2$?', opts:['Rechts von $L/2$ ist die Störung null.', 'Weil $\\psi_n$ rechts verschwindet.', 'Wegen der Symmetrie des Sinus.'], a:0, ex:'Der Integrand $\\psi_n^*\\hat H\'\\psi_n$ ist für $x > L/2$ null.'}},
      {l:'= 2/L V_0 · L/4', why:{q:'Woher kommt $L/4$?', opts:['aus $\\int_0^{L/2}\\sin^2(n\\pi x/L)\\,dx = L/4$ für jedes $n$', 'aus derselben Rechnung, die aber nur für $n = 1$ gilt', 'aus dem Mittelwert $1/4$ von $\\sin^2$ über den Kasten'], a:0, ex:'Mit $\\sin^2u = \\frac12(1-\\cos2u)$ verschwindet der Kosinus-Anteil an beiden Grenzen. Der Mittelwert von $\\sin^2$ ist $\\frac12$, nicht $\\frac14$.'}},
      {l:'= V_0/2', why:{q:'Ist das plausibel?', opts:['Ja: Mit $P = 1/2$ ist das Teilchen links und spürt dort $V_0$.', 'Nein: Die Korrektur müsste mit $n$ wachsen, wie $E_n^{(0)}$.', 'Nein: Eine Stufe nach oben müsste die Energie senken.'], a:0, ex:'$E_n^{(1)} = V_0\\,P(x < L/2) = V_0/2$, weil $|\\psi_n|^2$ symmetrisch um $L/2$ ist.'}}
    ],
    faded:{id:'stoer-fade', title:'Jetzt du: schräger Boden $\\hat H\' = \\lambda x$', text:'Gleicher Kasten, jetzt mit der Störung $\\hat H\' = \\lambda x$. Nützlich: $\\int_0^Lx\\sin^2(n\\pi x/L)dx = L^2/4$.',
      ctx:STBOX({"H'":'λ x'}),
      given:["E^(1) = ⟨ψ_n|H'|ψ_n⟩", '= 2λ/L ∫_0^L x sin(nπx/L)^2 dx'],
      goals:[{id:'a', prompt:'Bestimme $E_n^{(1)}$.', type:'value', target:'λ L/2', hints:['Setze das angegebene Integral ein.', 'Es ist $\\lambda\\langle x\\rangle$ mit $\\langle x\\rangle = L/2$.'],
        model:["E^(1) = ⟨ψ_n|H'|ψ_n⟩", '= 2λ/L ∫_0^L x sin(nπx/L)^2 dx', {l:'= 2λ/L · L^2/4', gap:'= 2λ/L · ▢'}, '= λ L/2']}]}
  },
  puzzle:{
    title:'Eine Stufe am Rand',
    text:'Hebt man im Kasten $0 < x < L$ die linke Hälfte um $V_0$ an, verschiebt sich in erster Ordnung jedes Niveau um genau $V_0/2$. Jetzt wird nur das linke Viertel angehoben: $V = V_0$ für $0 < x < L/4$, sonst null ($V_0$ klein).',
    q:{q:'Welches der Niveaus $n = 1, 2, 3$ verschiebt sich in erster Ordnung am stärksten?', opts:['$n = 3$', '$n = 1$', '$n = 2$', 'alle gleich, um $V_0/4$'], a:0, ex:'$E_n^{(1)} = V_0\\left(\\frac14 - \\frac{\\sin(n\\pi/2)}{2n\\pi}\\right)$.'},
    reveal:'Es ist $E_n^{(1)} = V_0\\int_0^{L/4}\\frac2L\\sin^2\\frac{n\\pi x}{L}\\,dx = V_0\\left(\\frac14 - \\frac{\\sin(n\\pi/2)}{2n\\pi}\\right)$.\n\n- $n = 1$: $\\approx 0{,}09\\,V_0$. Der Grundzustand ist nahe der Wand klein.\n- $n = 2$: genau $V_0/4$.\n- $n = 3$: $\\approx 0{,}30\\,V_0$. Sein erster Bauch liegt bei $x = L/6$, mitten in der Stufe.\n\nFür große $n$ geht $E_n^{(1)}$ gegen $V_0/4$, den Anteil der Stufe an der Kastenlänge: Die Dichte $|\\psi_n|^2$ mittelt sich dann fast gleichmäßig über den Kasten. Erste Ordnung heißt also: Es zählt, wie viel Wahrscheinlichkeit im gestörten Bereich liegt – und das hängt hier vom Ort der Bäuche ab.'
  },
  clarify:{
    core:'Man zerlegt $\\hat H = \\hat H_0 + \\hat H\'$ mit bekannten Lösungen $\\hat H_0|n\\rangle = E_n^{(0)}|n\\rangle$ und kleiner Störung $\\hat H\'$. Ohne Entartung gilt\n\n$$E_n = E_n^{(0)} + \\langle n|\\hat H\'|n\\rangle + \\sum_{m\\ne n}\\frac{|\\langle m|\\hat H\'|n\\rangle|^2}{E_n^{(0)} - E_m^{(0)}} + \\dots$$\n\nDie Reihe ist brauchbar, wenn $|\\langle m|\\hat H\'|n\\rangle| \\ll |E_n^{(0)} - E_m^{(0)}|$. Bei Entartung diagonalisiert man $\\hat H\'$ im entarteten Unterraum; die Eigenwerte dieser Matrix sind die Korrekturen erster Ordnung. Das Variationsprinzip $\\langle\\psi|\\hat H|\\psi\\rangle \\ge E_0$ liefert obere Schranken für den Grundzustand.',
    keys:[
      'Erste Ordnung = Mittelwert der Störung im ungestörten Zustand. Symmetrie (Parität) macht viele Matrixelemente null.',
      'Zustand erster Ordnung: $|n^{(1)}\\rangle = \\sum_{m\\ne n}\\frac{\\langle m|\\hat H\'|n\\rangle}{E_n^{(0)} - E_m^{(0)}}|m\\rangle$ – nahe Niveaus mischen am stärksten.',
      'Zweite Ordnung: Niveaus stoßen sich ab. Für den Grundzustand ist sie immer $\\le 0$, weil alle Nenner $E_0^{(0)} - E_m^{(0)}$ negativ sind.',
      'Im Oszillator koppelt $\\hat x$ nur $n\\to n\\pm1$, $\\hat x^2$ nur $n\\to n, n\\pm2$ – die Summe hat wenige Glieder.',
      'Bei entarteten Niveaus erst die „richtigen“ Zustände nullter Ordnung bestimmen (Eigenvektoren von $\\hat H\'$ im Unterraum), sonst teilt man durch null.',
      'Variationsprinzip: Für jeden normierten Versuchszustand ist $\\langle\\psi|\\hat H|\\psi\\rangle \\ge E_0$. Minimieren über Parameter gibt die beste Schranke.',
      'Stark-Effekt: Grundzustand quadratisch in $\\mathcal E$ (keine erste Ordnung), $n = 2$ des Wasserstoffs linear (Entartung $2s$/$2p$).'
    ],
    errors:[
      'Die Normierung $2/L$ der Kastenfunktionen im Matrixelement vergessen.',
      'In der zweiten Ordnung $m = n$ mitsummieren oder das Vorzeichen des Nenners vertauschen.',
      'Die nicht entartete Formel bei Entartung benutzen – der Nenner $E_n^{(0)} - E_m^{(0)}$ wird null.',
      'Bei Entartung nur die Diagonalelemente $\\langle i|\\hat H\'|i\\rangle$ nehmen und die Kopplung übersehen.',
      'Das Variationsergebnis für die exakte Energie halten: Es ist eine obere Schranke, exakt nur, wenn der Ansatz die Lösung enthält.'
    ],
    more:[{title:'Exakter Vergleich: Oszillator mit $\\lambda x$', text:'Mit quadratischer Ergänzung ist $\\frac12m\\omega^2x^2 + \\lambda x = \\frac12m\\omega^2\\left(x + \\frac{\\lambda}{m\\omega^2}\\right)^2 - \\frac{\\lambda^2}{2m\\omega^2}$. Alle Niveaus sinken exakt um $\\frac{\\lambda^2}{2m\\omega^2}$ – genau das Ergebnis der zweiten Ordnung; die erste Ordnung ist null.'}],
    checks:[
      {q:'Für den Grundzustand ist die Korrektur zweiter Ordnung …', opts:['immer $\\le 0$', 'immer $\\ge 0$', 'immer $0$'], a:0, ex:'Alle Nenner $E_0^{(0)} - E_m^{(0)} < 0$, alle Zähler $\\ge 0$.'},
      {q:'Warum versagt die Formel zweiter Ordnung bei Entartung?', opts:['Ein Nenner $E_n^{(0)} - E_m^{(0)}$ wird null.', 'Weil $\\hat H\'$ dann nicht hermitesch ist.', 'Weil die erste Ordnung dann immer null ist.'], a:0, ex:'Man muss zuerst im entarteten Unterraum diagonalisieren; dann verschwinden die gefährlichen Matrixelemente.'}
    ]
  },
  lab:{type:'perturb', title:'Erste Ordnung gegen exakte Lösung',
    text:'Kasten mit Stufe $V_0$ auf der linken Hälfte. Grau: ungestörte Niveaus $n^2E_1$, orange: erste Ordnung $n^2E_1 + V_0/2$, blau: exakt (numerisch diagonalisiert). Verändere $V_0$.',
    map:[
      {sym:R`V_0`, ctl:'Stärke V₀ / E₁', says:R`Höhe der Stufe auf der linken Hälfte, in Einheiten von $E_1$. In der Formel ist $\hat H' = V_0$ für $0 < x < L/2$. Mit $V_0$ wächst die erste Ordnung linear, der Abstand zur exakten Lösung etwa wie $V_0^2$.`},
      {sym:R`E_n^{(0)} = n^2E_1`, ctl:'ungestört', says:R`Graue Striche: die Niveaus des leeren Kastens, $1$, $4$ und $9\,E_1$. Sie hängen nicht von $V_0$ ab.`},
      {sym:R`E_n^{(0)} + \langle n|\hat H'|n\rangle = n^2E_1 + \tfrac12V_0`, ctl:'1. Ordnung', says:R`Orange Striche: ungestörte Energie plus Diagonalelement der Störung. Weil bei jedem $n$ die Hälfte von $|\psi_n|^2$ links liegt, rücken alle drei um dasselbe $V_0/2$ nach oben.`},
      {sym:R`E_n`, ctl:'exakt', says:R`Blaue Striche: die Eigenwerte der vollen Matrix $n^2E_1\,\delta_{mn} + V_{mn}$ mit 40 Basiszuständen, numerisch diagonalisiert. Der Abstand zu Orange ist die Summe aller höheren Ordnungen.`},
      {sym:R`E/E_1`, ctl:'E / E₁', says:R`Senkrechte Achse: Energie in Einheiten der ungestörten Grundzustandsenergie $E_1 = \pi^2\hbar^2/(2mL^2)$.`},
      {sym:R`E_{\text{exakt}} \approx E_1 + \tfrac12V_0 - \tfrac{V_0^2}{16E_1}`, ctl:'Grundzustand exakt', says:R`Die Anzeige vergleicht den exakten Grundzustand mit der ersten Ordnung. Die zweite Ordnung ist hier genau $-V_0^2/(16E_1)$: Nur gerade $m$ koppeln an $n = 1$, und die Summe $\sum_m|V_{m1}|^2/(E_1 - m^2E_1)$ lässt sich geschlossen ausrechnen. Bei $V_0 = 0{,}5\,E_1$ gibt das $1{,}2344\,E_1$, wie die Anzeige; bei $V_0 = 2E_1$ nur noch $1{,}75$ statt $1{,}766\,E_1$.`}
    ],
    predict:{q:'Gleich erhöhst du die Stufe von $V_0 = 0$ bis $8E_1$. Wo liegt die exakte Grundzustandsenergie (blau) im Vergleich zur ersten Ordnung $E_1 + V_0/2$ (orange)?', opts:['immer darunter, mit wachsendem Abstand', 'genau darauf, für jedes $V_0$', 'erst darunter, für großes $V_0$ darüber'], a:0, ex:'$E_1 + V_0/2 = \\langle\\psi_1|\\hat H|\\psi_1\\rangle$ ist nach dem Variationsprinzip eine obere Schranke für jedes $V_0$. Die zweite Ordnung ist negativ und wächst wie $V_0^2$.'},
    questions:[
      {q:'Stelle $V_0 = 2E_1$ ein. Wo liegt die exakte Grundzustandsenergie?', opts:['etwas unter der ersten Ordnung', 'genau auf der ersten Ordnung', 'darüber'], a:0, ex:'$E_1 + V_0/2 = \\langle\\psi_1|\\hat H|\\psi_1\\rangle$ ist nach dem Variationsprinzip eine obere Schranke. Die zweite Ordnung ist negativ.'},
      {q:'Jetzt $V_0 = 5E_1$. Für welches der drei Niveaus weicht die erste Ordnung am stärksten ab?', opts:['$n = 1$', '$n = 2$', '$n = 3$'], a:0, ex:'Der Grundzustand hat nur Nachbarn darüber; alle Beiträge zweiter Ordnung drücken ihn nach unten. Bei $n = 3$ heben sich Beiträge von oben und unten teilweise auf. $n = 2$ wird dagegen vor allem vom nahen Nachbarn $n = 1$ darunter nach oben geschoben.'}
    ],
    noPic:{q:'Ohne Bild: Hängt die Korrektur erster Ordnung $E_n^{(1)}$ für diese Stufe von $n$ ab?', opts:['nein, sie ist für alle $n$ gleich $V_0/2$', 'ja, sie wächst wie $E_n^{(0)}$ mit $n^2$', 'ja, sie fällt mit $1/n$ gegen null ab'], a:0, ex:'Jede Dichte $|\\psi_n|^2$ ist symmetrisch um $L/2$; links liegt immer die Hälfte.'}},
  compare:{
    text:'Gesucht ist $E_n^{(1)}$ für die Stufe $V_0$ auf der linken Hälfte des Kastens. Zwei richtige Wege:',
    ctx:STBOX({"H'":'V_0 Θ(L/2 - x)'}),
    A:{name:'Integral ausrechnen', model:["⟨ψ_n|H'|ψ_n⟩ = 2/L V_0 ∫_0^{L/2} sin(nπx/L)^2 dx", '= 2/L V_0 · L/4', '= V_0/2']},
    B:{name:'Symmetrie der Dichte', text:'$|\\psi_n(L-x)|^2 = |\\psi_n(x)|^2$, also liegt die halbe Wahrscheinlichkeit links.', model:["⟨ψ_n|H'|ψ_n⟩ = V_0 ∫_0^{L/2} |ψ_n(x)|^2 dx", '= V_0/2 ∫_0^L |ψ_n(x)|^2 dx', '= V_0/2']},
    questions:[
      {q:'Für welche Störung hilft Weg B nicht mehr?', opts:['$\\hat H\' = V_0$ nur für $0 < x < L/4$', '$\\hat H\' = V_0$ nur für $L/2 < x < L$', '$\\hat H\' = V_0$ im ganzen Kasten'], a:0, ex:'Ein Viertel ist kein symmetrischer Anteil; dann hängt $E_n^{(1)}$ von $n$ ab und man muss integrieren.'},
      {q:'Was zeigt Weg B allgemein?', opts:['$E_n^{(1)} = V_0\\cdot P(\\text{im Störbereich})$ bei konstanter Stufe', 'dass die zweite Ordnung für diese Stufe null ist', 'dass sich $\\psi_n$ durch die Stufe nicht verändert'], a:0, ex:'Für $\\hat H\' = V_0$ auf einem Bereich $B$ ist $\\langle n|\\hat H\'|n\\rangle = V_0\\int_B|\\psi_n|^2dx$.'}
    ]
  },
  practice:[
    {id:'stoer-p1', title:'Buckel im Kasten',
      text:'Ein Kasten $0<x<L$ bekommt die Störung $\\hat H\' = V_0\\sin(\\pi x/L)$. Gesucht ist die Korrektur erster Ordnung für den Grundzustand $\\psi_1 = \\sqrt{2/L}\\sin(\\pi x/L)$. Nützlich: $\\int_0^\\pi\\sin^3u\\,du = 4/3$.',
      ctx:CTX.box({params:{L:'pos', m:'pos', V_0:'pos'}, defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)'}, ops:{"H'":'V_0 sin(πx/L)'}}),
      goals:[{id:'a', prompt:'Berechne $E_1^{(1)}$.', type:'value', target:'8V_0/(3π)', points:3, ph:"E^(1) = ⟨ψ_1|H'|ψ_1⟩",
        hints:['Erste Ordnung = Erwartungswert der Störung im ungestörten Grundzustand.', 'Im Integranden steht $\\frac2L V_0\\sin^3(\\pi x/L)$.', 'Mit $u = \\pi x/L$: $\\int_0^L\\sin^3(\\pi x/L)dx = \\frac{L}{\\pi}\\cdot\\frac43$.'],
        model:["E^(1) = ⟨ψ_1|H'|ψ_1⟩", '= 2V_0/L ∫_0^L sin(πx/L)^3 dx', '= 2V_0/L · 4L/(3π)', '= 8V_0/(3π)'],
        mistakes:[{expr:'4V_0/(3π)', msg:'Prüfe die Normierung: $|\\psi_1|^2$ enthält den Faktor $2/L$.'}]}]},
    {id:'stoer-p2', title:'Oszillator im homogenen Feld',
      text:'Harmonischer Oszillator mit $\\hat H\' = \\lambda\\hat x$, $\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$. In der Eingabe sind `x`, `a`, `a†` und die Kets `|n⟩` bekannt.',
      ctx:STOSC(),
      goals:[
        {id:'a', prompt:'a) Zeige, dass die erste Ordnung verschwindet.', type:'value', target:'0', points:1, ph:'⟨n|λ x|n⟩ = …',
          hints:['Erste Ordnung = Diagonalelement $\\langle n|\\hat H\'|n\\rangle$.', 'Drücke $\\hat x$ durch $\\hat a + \\hat a^\\dagger$ aus: Beide ändern $n$ um $\\pm1$.'],
          model:['⟨n|λ x|n⟩ = λ sqrt(ħ/(2mω)) ⟨n|a + a†|n⟩', '= 0']},
        {id:'b', prompt:'b) Berechne die Korrektur zweiter Ordnung $E^{(2)}$. Nur $m = n\\pm1$ tragen bei; $E_n^{(0)} - E_{n\\pm1}^{(0)} = \\mp\\hbar\\omega$.', type:'value', target:'-λ^2/(2 m ω^2)', points:3,
          hints:['Gesucht ist die zweite Ordnung. Du brauchst die Matrixelemente der Störung zu den beiden Nachbarn $n\\pm1$ und die Energienenner.', 'Regel: $E_n^{(2)} = \\sum_{m\\ne n}|\\langle m|\\hat H\'|n\\rangle|^2/(E_n^{(0)} - E_m^{(0)})$ mit $|\\langle n+1|\\hat x|n\\rangle|^2 = \\frac{\\hbar}{2m\\omega}(n+1)$ und $|\\langle n-1|\\hat x|n\\rangle|^2 = \\frac{\\hbar}{2m\\omega}n$.', '$E^{(2)} = \\lambda^2\\left(\\frac{|\\langle n-1|x|n\\rangle|^2}{\\hbar\\omega} - \\frac{|\\langle n+1|x|n\\rangle|^2}{\\hbar\\omega}\\right)$'],
          model:['|⟨n+1|x|n⟩|^2 = ħ/(2mω)(n+1)', '|⟨n-1|x|n⟩|^2 = ħ/(2mω) n', 'E^(2) = λ^2 (ħ/(2mω) n/(ħω) - ħ/(2mω)(n+1)/(ħω))', '= -λ^2/(2mω^2)'],
          mistakes:[{expr:'λ^2/(2 m ω^2)', msg:'Vorzeichen der Nenner prüfen: $E_n^{(0)} - E_{n+1}^{(0)} = -\\hbar\\omega$.'}],
          note:'Das ist exakt: $\\frac12m\\omega^2x^2 + \\lambda x$ ist ein verschobener Oszillator, der um $\\lambda^2/(2m\\omega^2)$ tiefer liegt. Unabhängig von $n$.'}
      ]},
    {id:'stoer-p3', title:'Oszillator mit steiferer Feder',
      text:'Harmonischer Oszillator mit $\\hat H\' = \\lambda\\hat x^2$.',
      ctx:STOSC(),
      goals:[
        {id:'a', prompt:'a) Zeige $\\langle n|(\\hat a + \\hat a^\\dagger)^2|n\\rangle = 2n + 1$.', type:'show', from:'⟨n|(a + a†)^2|n⟩', to:'2n + 1', points:2,
          hints:['Multipliziere $(\\hat a + \\hat a^\\dagger)^2$ aus und überlege, welche Terme $n$ unverändert lassen.', 'Beim Ausmultiplizieren tragen nur $\\hat a\\hat a^\\dagger$ und $\\hat a^\\dagger\\hat a$ bei.', '$\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a + 1$, und $\\hat a^\\dagger\\hat a|n\\rangle = n|n\\rangle$.'],
          model:['⟨n|(a + a†)^2|n⟩ = ⟨n|a a† + a† a|n⟩', '= (n + 1) + n', '= 2n + 1']},
        {id:'b', prompt:'b) Berechne $E_n^{(1)}$.', type:'value', target:'λ ħ (2n + 1)/(2 m ω)', points:2,
          hints:['Erste Ordnung heißt: Erwartungswert der Störung im ungestörten Zustand. Welchen Teil davon hast du in a) schon berechnet?', 'Regel: $E_n^{(1)} = \\lambda\\langle n|\\hat x^2|n\\rangle$ mit $\\hat x^2 = \\frac{\\hbar}{2m\\omega}(\\hat a + \\hat a^\\dagger)^2$; setze das Ergebnis aus a) ein.'],
          model:['⟨n|λ x^2|n⟩ = λ ħ/(2mω) ⟨n|(a + a†)^2|n⟩', '= λ ħ/(2mω)(2n + 1)'],
          note:'Exakt ist $\\omega\' = \\omega\\sqrt{1 + 2\\lambda/(m\\omega^2)}$; die Entwicklung bis zur ersten Ordnung in $\\lambda$ gibt genau dieses Ergebnis.'}
      ]},
    {id:'stoer-p4', title:'Entartetes Niveau',
      text:'Zwei Zustände $|1\\rangle, |2\\rangle$ haben dieselbe Energie $E^{(0)}$. Im Unterraum hat die Störung die Matrix $W = \\begin{pmatrix}0&\\beta\\\\\\beta&0\\end{pmatrix}$ mit $\\beta > 0$. In der Eingabe heißt sie `W`, die Einheitsmatrix `I`.',
      ctx:{rep:'mat', mat:{preset:'spin', mats:{W:'(0, β; β, 0)'}}, coords:['t'], params:{β:'pos'}, unknowns:{ε:{ref:'β', alt:['-β'], kind:'real'}}},
      goals:[
        {id:'a', prompt:'a) Bestimme die Energiekorrekturen $\\varepsilon$ erster Ordnung (am Ende die positive: $\\varepsilon = \\dots$).', type:'solve', unknown:'ε', points:3, ph:'det(W - ε I) = 0',
          hints:['Bei Entartung sind die Korrekturen erster Ordnung die Eigenwerte von $W$.', '$\\det\\begin{pmatrix}-\\varepsilon&\\beta\\\\\\beta&-\\varepsilon\\end{pmatrix} = \\varepsilon^2 - \\beta^2$.', 'Löse $\\varepsilon^2 - \\beta^2 = 0$ und nimm die positive Wurzel.'],
          model:['det(W - ε I) = 0', 'det((-ε, β; β, -ε)) = 0', 'ε^2 - β^2 = 0', 'ε = β'], note:'Die zweite Korrektur ist $-\\beta$: Das Niveau spaltet in $E^{(0)}\\pm\\beta$ auf.'},
        {id:'b', prompt:'b) Zeige, dass $\\frac{1}{\\sqrt2}\\binom11$ der richtige Zustand nullter Ordnung zu $+\\beta$ ist.', type:'show', from:'W (1; 1)/sqrt(2)', to:'β (1; 1)/sqrt(2)', points:2,
          hints:['Zu zeigen ist eine Eigenwertgleichung: $W$ mal Vektor gleich $\\beta$ mal Vektor.', 'Matrix mal Spalte: $\\begin{pmatrix}0&\\beta\\\\\\beta&0\\end{pmatrix}\\binom11 = \\binom\\beta\\beta$.'],
          model:['W (1; 1)/sqrt(2) = (0, β; β, 0)(1; 1)/sqrt(2)', '= (β; β)/sqrt(2)', '= β (1; 1)/sqrt(2)']}
      ]},
    {id:'stoer-p5', title:'Variationsverfahren mit Gauß-Ansatz',
      text:'Für $\\hat H = \\frac{\\hat p^2}{2m} + \\frac12m\\omega^2\\hat x^2$ probieren wir $\\psi_b(x) = (2b/\\pi)^{1/4}e^{-bx^2}$ (normiert, $b > 0$). Es gilt $\\langle x^2\\rangle = 1/(4b)$.',
      ctx:{coords:['x'], params:{m:'pos', ω:'pos', b:'pos'}, defs:{'ψ(x)':'(2b/π)^(1/4) e^(-b x^2)', 'V(x)':'1/2 m ω^2 x^2'}, state:'ψ', normalized:true, unknowns:{b_0:{ref:'m ω/(2ħ)'}}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle V\\rangle$.', type:'value', target:'m ω^2/(8b)', points:1,
          hints:['Mittelwert der potentiellen Energie im Versuchszustand.', '$\\langle V\\rangle = \\frac12m\\omega^2\\langle x^2\\rangle$ mit dem gegebenen $\\langle x^2\\rangle$.'],
          model:['⟨V⟩ = 1/2 m ω^2 ⟨x^2⟩', '= 1/2 m ω^2 · 1/(4b)', '= m ω^2/(8b)']},
        {id:'b', prompt:'b) Berechne $\\langle T\\rangle$.', type:'value', target:'ħ^2 b/(2m)', points:2, ph:"⟨T⟩ = -ħ^2/(2m) ∫_-∞^∞ ψ ψ'' dx",
          hints:['Kinetische Energie über $\\langle T\\rangle = -\\frac{\\hbar^2}{2m}\\int\\psi\\,\\psi\'\'\\,dx$; dafür brauchst du $\\psi\'\'$.', '$\\psi\'\' = (4b^2x^2 - 2b)\\psi$.', '$\\langle T\\rangle = -\\frac{\\hbar^2}{2m}(4b^2\\langle x^2\\rangle - 2b)$.'],
          model:["⟨T⟩ = -ħ^2/(2m) ∫_-∞^∞ ψ ψ'' dx", '= -ħ^2/(2m) (4b^2 · 1/(4b) - 2b)', '= ħ^2 b/(2m)']},
        {id:'c', prompt:'c) Minimiere $\\langle H\\rangle(b) = \\frac{\\hbar^2b}{2m} + \\frac{m\\omega^2}{8b}$: Bestimme das optimale $b_0$.', type:'solve', unknown:'b_0', points:2, ph:'d/db (ħ^2 b/(2m) + m ω^2/(8b)) = …',
          hints:['Minimum: Ableitung nach $b$ null setzen.', '$\\frac{d}{db}\\left(\\frac{\\hbar^2b}{2m} + \\frac{m\\omega^2}{8b}\\right) = \\frac{\\hbar^2}{2m} - \\frac{m\\omega^2}{8b^2}$.', 'Aus $b_0^2 = \\frac{m^2\\omega^2}{4\\hbar^2}$ die positive Wurzel ziehen.'],
          model:['d/db (ħ^2 b/(2m) + m ω^2/(8b)) = ħ^2/(2m) - m ω^2/(8b^2)', 'ħ^2/(2m) - m ω^2/(8 b_0^2) = 0', 'b_0 = m ω/(2ħ)']},
        {id:'d', prompt:'d) Welche Energie liefert der beste Ansatz?', type:'value', target:'ħ ω/2', points:1,
          hints:['Setze $b_0$ in $\\langle H\\rangle(b)$ ein.', 'Beide Terme geben je $\\hbar\\omega/4$.'],
          model:['E = ħ^2/(2m) · mω/(2ħ) + mω^2/8 · 2ħ/(mω)', '= ħω/2'], note:'Das ist exakt $E_0$, weil der Gauß-Ansatz den wahren Grundzustand enthält. Sonst erhält man nur eine obere Schranke.'}
      ]},
    {id:'stoer-p6', synth:true, title:'Synthese: Spin im schrägen Magnetfeld',
      text:'Ein Spin ½ (Thema 10) sitzt in einem starken Feld in $z$-Richtung und einem schwachen in $x$-Richtung: $\\hat H = \\omega_0\\hat S_z + \\omega_1\\hat S_x$ mit $0 < \\omega_1 \\ll \\omega_0$. Ungestört ist $\\hat H_0 = \\omega_0\\hat S_z$ mit $E_\\uparrow = +\\hbar\\omega_0/2$ und $E_\\downarrow = -\\hbar\\omega_0/2$; die Störung ist $\\hat H_1 = \\omega_1\\hat S_x$. Du verbindest Eigenwerte (M4), Spinmatrizen (Thema 10), Störungstheorie und das Messpostulat (Thema 6). In der Eingabe heißen die Matrizen `H`, `H_0`, `H_1`, die Einheitsmatrix `I`.',
      ctx:STMAT({H_0:'ω_0 S_z', H_1:'ω_1 S_x', H:'ω_0 S_z + ω_1 S_x'}, {ω_0:'pos', ω_1:'pos'}, {unknowns:{ε:{ref:'ħ/2 sqrt(ω_0^2 + ω_1^2)', alt:['-ħ/2 sqrt(ω_0^2 + ω_1^2)'], kind:'real'}}}),
      goals:[
        {id:'a', prompt:'a) Exakt: Bestimme die Eigenwerte $\\varepsilon$ von $\\hat H$ (am Ende den positiven: $\\varepsilon = \\dots$).', type:'solve', unknown:'ε', points:2, ph:'det(H - ε I) = 0',
          hints:['Eigenwerte sind die Nullstellen des charakteristischen Polynoms $\\det(\\hat H - \\varepsilon\\mathbb 1)$.', 'Als Matrix ist $\\hat H = \\frac\\hbar2\\begin{pmatrix}\\omega_0&\\omega_1\\\\\\omega_1&-\\omega_0\\end{pmatrix}$.', 'Ausmultipliziert: $\\varepsilon^2 - \\frac{\\hbar^2}{4}(\\omega_0^2 + \\omega_1^2) = 0$.'],
          model:['det(H - ε I) = 0', 'det((ħω_0/2 - ε, ħω_1/2; ħω_1/2, -ħω_0/2 - ε)) = 0', 'ε^2 - ħ^2/4 (ω_0^2 + ω_1^2) = 0', 'ε = ħ/2 sqrt(ω_0^2 + ω_1^2)']},
        {id:'b', prompt:'b) Erste Ordnung: Berechne $E_\\uparrow^{(1)} = \\langle\\uparrow|\\hat H_1|\\uparrow\\rangle$.', type:'value', target:'0', points:1, ph:'⟨↑|H_1|↑⟩ = …',
          hints:['Erwartungswert der Störung im ungestörten Zustand $|\\uparrow\\rangle$.', '$\\sigma_x$ hat keine Diagonalelemente.'],
          model:['⟨↑|H_1|↑⟩ = ω_1 ħ/2 (1, 0)(0, 1; 1, 0)(1; 0)', '= 0']},
        {id:'c', prompt:'c) Zweite Ordnung: Berechne $E_\\uparrow^{(2)}$.', type:'value', target:'ħ ω_1^2/(4 ω_0)', points:2,
          hints:['Es gibt nur einen Zwischenzustand, $|\\downarrow\\rangle$.', '$E_\\uparrow^{(2)} = |\\langle\\downarrow|\\hat H_1|\\uparrow\\rangle|^2/(E_\\uparrow - E_\\downarrow)$ mit $\\langle\\downarrow|\\hat H_1|\\uparrow\\rangle = \\hbar\\omega_1/2$.', 'Der Nenner ist $+\\hbar\\omega_0$: $|\\uparrow\\rangle$ ist das obere Niveau und wird nach oben gedrückt.'],
          model:['E^(2) = |⟨↓|H_1|↑⟩|^2/(ħω_0/2 + ħω_0/2)', '= (ħω_1/2)^2/(ħω_0)', '= ħ ω_1^2/(4 ω_0)'],
          mistakes:[{expr:'-ħ ω_1^2/(4 ω_0)', msg:'Vorzeichen des Nenners: $E_\\uparrow - E_\\downarrow = +\\hbar\\omega_0$. Das obere Niveau wird nach oben gedrückt.'}],
          note:'Vergleich mit a): $\\frac\\hbar2\\sqrt{\\omega_0^2 + \\omega_1^2} \\approx \\frac{\\hbar\\omega_0}{2} + \\frac{\\hbar\\omega_1^2}{4\\omega_0}$ (Taylor, M2) – genau die zweite Ordnung.'},
        {id:'d', prompt:'d) Messung: In erster Ordnung ist der gestörte Grundzustand $|\\downarrow\\rangle + c\\,|\\uparrow\\rangle$. Bestimme $c$ und daraus die Wahrscheinlichkeit, $S_z = +\\hbar/2$ zu messen (bis zur Ordnung $\\omega_1^2$).', type:'value', target:'ω_1^2/(4 ω_0^2)', points:2, ph:'c = ⟨↑|H_1|↓⟩/(…)',
          hints:['Gesucht ist zuerst die Beimischung $c$ von $|\\uparrow\\rangle$ zum Grundzustand $|\\downarrow\\rangle$; ihr Betragsquadrat ist dann die Wahrscheinlichkeit.', 'Regel (Zustandskorrektur erster Ordnung): $c = \\langle\\uparrow|\\hat H_1|\\downarrow\\rangle/(E_\\downarrow - E_\\uparrow)$; das Matrixelement ist $\\hbar\\omega_1/2$, der Nenner $-\\hbar\\omega_0$.', 'Bornsche Regel: $P = |c|^2$; die Normierung ändert erst höhere Ordnungen.'],
          model:['c = ⟨↑|H_1|↓⟩/(-ħω_0/2 - ħω_0/2)', '= -ω_1/(2ω_0)', 'P = |c|^2', '= ω_1^2/(4ω_0^2)'],
          note:'Exakt ist der Grundzustand der Eigenzustand von $\\hat S_{\\hat n}$ zu $-\\hbar/2$ mit $\\tan\\theta = \\omega_1/\\omega_0$. Dann ist $P = \\sin^2\\frac\\theta2 \\approx \\frac{\\theta^2}{4} \\approx \\frac{\\omega_1^2}{4\\omega_0^2}$.'}
      ]}
  ],
  concept:[
    {id:'stoer-c1', type:'mc2', seg:'stoer-t4', lex:'entartete-stoerung',
      q:'Ein Niveau ist zweifach entartet; im Unterraum ist $W = \\begin{pmatrix}0&\\beta\\\\\\beta&0\\end{pmatrix}$. Jemand rechnet $\\langle 1|\\hat H\'|1\\rangle = 0$ und $\\langle 2|\\hat H\'|2\\rangle = 0$ und folgert: „keine Aufspaltung“. Stimmt das?',
      opts:['nein, die Korrekturen sind $\\pm\\beta$', 'ja, beide Diagonalelemente sind null', 'nein, die Korrekturen sind $\\pm\\beta^2$'], a:0,
      ex:'Die Korrekturen sind die Eigenwerte von $W$: $\\pm\\beta$. Das Niveau spaltet in $E^{(0)}\\pm\\beta$ auf.',
      reason:{q:'Warum?', opts:['$|1\\rangle, |2\\rangle$ sind nicht die richtigen Zustände nullter Ordnung.', 'Bei Entartung ist die erste Ordnung immer null.', 'Die zweite Ordnung liefert hier $\\pm\\beta$.'], a:0, ex:'Die richtigen Zustände sind die Eigenvektoren $\\frac{1}{\\sqrt2}(|1\\rangle \\pm |2\\rangle)$. Nur in dieser Basis darf man die Diagonalelemente nehmen.'}},
    {id:'stoer-c2', type:'dialog', seg:'stoer-t2',
      text:'Gesucht ist die Energiekorrektur erster Ordnung $E_n^{(1)}$ für eine Störung $\\hat H\'$.',
      people:[{name:'Lena', says:'Dafür brauche ich nur den ungestörten Zustand: $E_n^{(1)} = \\langle n^{(0)}|\\hat H\'|n^{(0)}\\rangle$.'},
        {name:'Jonas', says:'Die Störung verändert den Zustand. Ich muss erst den gestörten Zustand $|n\\rangle$ bestimmen und dann $\\langle n|\\hat H\'|n\\rangle$ bilden.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'Lena. Projektion der Gleichung erster Ordnung auf $\\langle n^{(0)}|$ zeigt: In $E_n^{(1)}$ kommt $|n^{(1)}\\rangle$ nicht vor. Die Änderung des Zustands wirkt sich erst in $E_n^{(2)}$ aus. Mit dem gestörten Zustand erhielte man $E_n^{(1)}$ plus Beiträge höherer Ordnung – und man bräuchte gerade den Zustand, den man nicht kennt.'},
    {id:'stoer-c3', type:'mc', seg:'stoer-t3', lex:'stoerung-2',
      q:'Zwei Niveaus $E_1 < E_2$ werden durch eine Störung gekoppelt, die nur Nichtdiagonalelemente hat. Was passiert in zweiter Ordnung?',
      opts:['$E_1$ sinkt, $E_2$ steigt um denselben Betrag', 'beide sinken um denselben Betrag', 'beide steigen um denselben Betrag', '$E_1$ steigt, $E_2$ sinkt: Sie nähern sich an'], a:0,
      ex:'$E_1^{(2)} = |v|^2/(E_1 - E_2) < 0$ und $E_2^{(2)} = |v|^2/(E_2 - E_1) > 0$: Die Niveaus stoßen sich ab. Die Summe der Korrekturen ist null.'},
    {id:'stoer-c4', type:'mc2', seg:'stoer-t5', lex:'variationsprinzip',
      q:'Ein korrekt berechneter, normierter Versuchszustand ergibt $\\langle H\\rangle = -3{,}2\\,$eV. Kann die exakte Grundzustandsenergie $-3{,}0\\,$eV sein?',
      opts:['nein, für jeden Zustand ist $E_0 \\le \\langle H\\rangle$', 'ja, Variationswerte liegen oft etwas zu tief', 'ja, wenn der Ansatz schlecht gewählt ist'], a:0,
      ex:'$E_0 \\le -3{,}2\\,$eV. Ein Ergebnis unter dem bekannten $E_0$ zeigt einen Fehler, etwa fehlende Normierung.',
      reason:{q:'Warum?', opts:['$\\langle H\\rangle = \\sum|c_n|^2E_n$ mittelt nur Werte $\\ge E_0$.', 'Weil das Minimum über $b$ immer exakt ist.', 'Weil die erste Ordnung der Störungstheorie positiv ist.'], a:0, ex:'Ein gewichtetes Mittel mit Gewichten $|c_n|^2 \\ge 0$, $\\sum|c_n|^2 = 1$, kann nicht unter dem kleinsten Wert liegen.'}},
    {id:'stoer-c5', type:'dialog', seg:'stoer-t6', lex:'stark-effekt',
      text:'Ein Wasserstoffatom im Grundzustand befindet sich in einem schwachen Feld $\\mathcal E\\hat z$.',
      people:[{name:'Lena', says:'Das Elektron bildet mit dem Kern einen Dipol. Also ändert sich die Energie linear mit $\\mathcal E$.'},
        {name:'Jonas', says:'Im Grundzustand ist $\\langle z\\rangle = 0$. Erst das Feld verformt den Zustand, deshalb beginnt die Verschiebung mit $\\mathcal E^2$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Jonas. $E^{(1)} = e\\mathcal E\\langle 100|\\hat z|100\\rangle = 0$ wegen der Parität. Die zweite Ordnung gibt $-\\frac12\\alpha\\mathcal E^2$. Lenas Bild passt zum Niveau $n = 2$, wo die Entartung von $2s$ und $2p$ ein festes Dipolmoment erlaubt.'}
  ],
  sketch:[
    {id:'stoer-s1', title:'Wo spürt $\\psi_2$ eine punktförmige Störung?', kind:'curve', draw:'abs2',
      text:'Im unendlich tiefen Kasten $0 < x < L$ sitzt eine schmale Störung $\\hat H\' = \\alpha\\,\\delta(x - a)$ mit $\\alpha > 0$ an der Stelle $a$. Skizziere die Energiekorrektur erster Ordnung $E_2^{(1)}$ des Zustands $n = 2$ als Funktion der Lage $a$. Die Höhe ist frei.',
      plot:{x:[0, 1], xlab:'a', ylab:'E_2^{(1)}(a)', ticks:[{x:0, lab:'0'}, {x:0.25, lab:'L/4'}, {x:0.5, lab:'L/2'}, {x:0.75, lab:'3L/4'}, {x:1, lab:'L'}]},
      f:STOER_SK.box2,
      checks:[
        {id:'pos', type:'nonneg', msg:'Deine Kurve wird negativ (Minimum {got}). Kann die Korrektur für $\\alpha > 0$ negativ werden?'},
        {id:'wand', name:'Wände', type:'zero', at:[0, 1], msg:'Wie groß ist die Korrektur, wenn die Störung direkt an einer Wand sitzt? Was weißt du dort über $\\psi_2$?'},
        {id:'mitte', name:'Kastenmitte', type:'zero', at:[0.5], tol:0.04, msg:'Spürt der Zustand $n = 2$ eine Störung in der Kastenmitte? (Abschnitt ‚Erste Ordnung: Energie und Zustand‘)'},
        {id:'sym', type:'parity', p:'even', about:0.5, msg:'Ändert sich die Korrektur, wenn du die Störung an der Kastenmitte spiegelst ($a \\to L - a$)? Deine Skizze ist {got}.'}
      ],
      reveal:'$E_2^{(1)}(a) = \\langle\\psi_2|\\alpha\\,\\delta(x - a)|\\psi_2\\rangle = \\alpha|\\psi_2(a)|^2 = \\frac{2\\alpha}{L}\\sin^2\\frac{2\\pi a}{L}$. Die Korrektur erster Ordnung ist der Erwartungswert der Störung im ungestörten Zustand: Sie ist groß, wo sich das Teilchen oft aufhält, und null an den Wänden und im Knoten bei $L/2$. Negativ wird sie nie, weil $|\\psi_2|^2 \\ge 0$ und $\\alpha > 0$ ist.',
      hints:['Schreibe $E_2^{(1)} = \\langle\\psi_2|\\hat H\'|\\psi_2\\rangle$ als Integral und nutze die Eigenschaft der δ-Funktion.', '$\\int\\psi^*(x)\\,\\alpha\\,\\delta(x - a)\\,\\psi(x)\\,dx = \\alpha|\\psi(a)|^2$. Skizziere also $|\\psi_2|^2$ als Funktion von $a$.'],
      wrong:[
        {f:a => 1, fails:['wand', 'mitte'], why:'Korrektur unabhängig vom Ort der Störung'},
        {f:a => Math.sin(Math.PI * a) ** 2, fails:['mitte'], why:'mit dem Grundzustand verwechselt: Eine Störung in der Mitte wirke am stärksten'},
        {f:a => Math.sin(2 * Math.PI * a), fails:['pos', 'sym'], why:'$\\psi_2(a)$ statt $|\\psi_2(a)|^2$: negative Korrektur rechts der Mitte'}
      ]},
    {id:'stoer-s2', title:'Zustandskorrektur erster Ordnung für die Stufe', kind:'curve', draw:'f',
      text:'Kasten $0 < x < L$ mit der Störung $\\hat H\' = V_0 > 0$ auf der linken Hälfte $0 < x < L/2$, wie im Labor. Der ungestörte Grundzustand ist $\\psi_1 = \\sqrt{2/L}\\,\\sin(\\pi x/L)$, also positiv. Skizziere die Korrektur erster Ordnung $\\psi_1^{(1)}(x)$ des Zustands, also $|1^{(1)}\\rangle$ in Ortsdarstellung. Das Vorzeichen zählt, die Höhe ist frei.',
      plot:{x:[-0.08, 1.08], dom:[0, 1], walls:[0, 1], xlab:'x', ylab:'\\psi_1^{(1)}(x)', ticks:[{x:0, lab:'0'}, {x:0.5, lab:'L/2'}, {x:1, lab:'L'}], V:x => x > 0 && x < 0.5 ? 1 : 0, Vr:[0, 4], regions:[{x:[0, 0.5], lab:'V_0'}]},
      f:STOER_SK.psi1c,
      checks:[
        {id:'wand', name:'Wände', type:'zero', at:[0, 1], msg:'Jeder Summand der Korrektur ist ein Vielfaches eines $\\psi_m$ des Kastens. Was gilt für alle $\\psi_m$ an den Wänden?'},
        {id:'knoten', type:'nodes', n:1, msg:'Welcher Zustand $\\psi_m$ trägt am meisten bei, und wie viele Knoten hat er? Deine Skizze hat {got}.'},
        {id:'vz', name:'Vorzeichen', type:'sign', s:-1, range:[0.06, 0.42], msg:'Welches Vorzeichen hat der Koeffizient $\\langle\\psi_2|\\hat H\'|\\psi_1\\rangle/(E_1 - E_2)$? Wo wird $\\psi_1$ also verkleinert? (Abschnitt ‚Erste Ordnung: Energie und Zustand‘)'}
      ],
      reveal:'$\\psi_1^{(1)} = \\sum_{m\\ne1}\\frac{\\langle\\psi_m|\\hat H\'|\\psi_1\\rangle}{E_1 - E_m}\\psi_m$. Den Hauptteil gibt $m = 2$: Der Zähler $\\langle\\psi_2|\\hat H\'|\\psi_1\\rangle = \\frac{4V_0}{3\\pi}$ ist positiv, der Nenner $E_1 - E_2 = -3E_1$ negativ. Also ist $\\psi_1^{(1)} \\approx -0{,}14\\,\\frac{V_0}{E_1}\\,\\psi_2$: negativ unter der Stufe, positiv rechts davon. Der gestörte Zustand $\\psi_1 + \\psi_1^{(1)}$ weicht der Stufe aus. Die Beiträge $m = 3, 5, \\dots$ verschwinden, und $\\psi_1^{(1)}$ ist exakt antisymmetrisch zu $L/2$, mit einem Knoten in der Mitte.',
      hints:['Welcher Term der Summe für $|1^{(1)}\\rangle$ ist am größten? Achte auf den kleinsten Nenner und darauf, welche Matrixelemente null sind.', 'Bestimme die Vorzeichen von $\\langle\\psi_2|\\hat H\'|\\psi_1\\rangle = V_0\\,\\frac2L\\int_0^{L/2}\\sin\\frac{2\\pi x}{L}\\sin\\frac{\\pi x}{L}\\,dx$ und von $E_1 - E_2$.'],
      wrong:[
        {f:x => -STOER_SK.psi1c(x), fails:['vz'], why:'Vorzeichen des Nenners vertauscht ($E_m - E_n$ statt $E_n - E_m$)'},
        {f:x => -Math.sin(Math.PI * x), fails:['knoten'], why:'Anteil längs $\\psi_1$ mitgenommen: Korrektur als Vielfaches von $\\psi_1$'},
        {f:x => x < 0.5 ? -Math.sin(2 * Math.PI * x) : 0, fails:['knoten'], why:'Korrektur nur dort, wo die Störung sitzt'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'stoer-f1', title:'Stufe im rechten Viertel', text:'Kasten $0<x<L$ mit $\\hat H\' = V_0$ für $3L/4 < x < L$ (sonst $0$). Grundzustand $\\psi_1 = \\sqrt{2/L}\\sin(\\pi x/L)$.',
      ctx:CTX.box({params:{L:'pos', m:'pos', V_0:'pos'}, defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)'}, ops:{"H'":'V_0 Θ(x - 3L/4)'}}),
      goals:[{id:'a', prompt:'Berechne $E_1^{(1)}$.', type:'value', target:'V_0 (1/4 - 1/(2π))', points:3, model:["E^(1) = ⟨ψ_1|H'|ψ_1⟩", '= 2V_0/L ∫_{3L/4}^L sin(πx/L)^2 dx', '= V_0/L [x - L/(2π) sin(2πx/L)]_{3L/4}^L', '= V_0/L (L/4 - L/(2π))', '= V_0 (1/4 - 1/(2π))']}]}},
    {aim:1, task:{id:'stoer-f2', title:'Grundzustand mit $\\lambda x^2$: zweite Ordnung', text:'Oszillator mit $\\hat H\' = \\lambda\\hat x^2$, Grundzustand $|0\\rangle$, $\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$.',
      ctx:STOSC(),
      goals:[{id:'a', prompt:'Berechne $E_0^{(2)}$.', type:'value', target:'-λ^2 ħ/(4 m^2 ω^3)', points:3, model:['⟨2|x^2|0⟩ = ħ/(2mω) sqrt(2)', 'E^(2) = λ^2 |⟨2|x^2|0⟩|^2/(ħω/2 - 5ħω/2)', '= λ^2 (ħ/(2mω))^2 · 2/(-2ħω)', '= -λ^2 ħ/(4 m^2 ω^3)']}]}},
    {aim:2, task:{id:'stoer-f3', title:'Entartetes Niveau mit Diagonalanteil', text:'Zwei Zustände haben dieselbe Energie $E^{(0)}$. Im Unterraum hat die Störung die Matrix $W = \\begin{pmatrix}\\alpha&\\beta\\\\\\beta&\\alpha\\end{pmatrix}$ mit $\\alpha, \\beta > 0$. In der Eingabe heißt sie `W`, die Einheitsmatrix `I`.',
      ctx:STMAT({W:'(α, β; β, α)'}, {α:'pos', β:'pos'}, {unknowns:{ε:{ref:'α + β', alt:['α - β'], kind:'real'}}}),
      goals:[{id:'a', prompt:'Bestimme die Energiekorrekturen $\\varepsilon$ erster Ordnung (am Ende die größere: $\\varepsilon = \\dots$).', type:'solve', unknown:'ε', points:3, model:['det(W - ε I) = 0', 'det((α - ε, β; β, α - ε)) = 0', '(α - ε)^2 - β^2 = 0', 'ε = α + β']}]}},
    {aim:'k', id:'stoer-fk1', type:'dialog',
      text:'Ein Variationsansatz für den Grundzustand liefert $\\langle H\\rangle = 0{,}95\\,E_0$ mit dem bekannten exakten $E_0 > 0$ – also einen Wert unter $E_0$.',
      people:[{name:'Lena', says:'Ein sehr guter Ansatz: Er kommt sogar unter die exakte Energie.'},
        {name:'Jonas', says:'Das kann nicht sein, $\\langle H\\rangle \\ge E_0$ für jeden normierten Zustand. Irgendwo steckt ein Fehler, zum Beispiel eine fehlende Normierung.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Jonas. $\\langle H\\rangle = \\sum|c_n|^2E_n \\ge E_0$. Ein Wert unter $E_0$ zeigt einen Rechenfehler.'},
    {aim:'k', id:'stoer-fk2', type:'mc2',
      q:'Oszillator mit $\\hat H\' = \\lambda\\hat x$: Welche Zustände mischt die Störung in erster Ordnung dem Grundzustand $|0\\rangle$ bei?',
      opts:['nur $|1\\rangle$', '$|1\\rangle$ und $|2\\rangle$', 'alle $|m\\rangle$ mit $m \\ge 1$'], a:0,
      ex:'$|0^{(1)}\\rangle = \\sum_{m\\ne0}\\frac{\\langle m|\\hat H\'|0\\rangle}{E_0 - E_m}|m\\rangle$, und nur $\\langle 1|\\hat x|0\\rangle \\ne 0$.',
      reason:{q:'Warum?', opts:['$\\hat x \\propto \\hat a + \\hat a^\\dagger$ ändert $n$ nur um $\\pm1$.', 'Nur der nächste Nachbar hat einen kleinen Nenner.', 'Höhere Zustände haben zu viel Energie.'], a:0, ex:'Entscheidend sind die Matrixelemente, nicht die Größe der Nenner: Alle $\\langle m|\\hat x|0\\rangle$ mit $m \\ne 1$ sind exakt null.'}},
    {aim:0, sketch:STOER_SK.mkF('stoer-fs1', 1)}
  ],
  finalB:[
    {aim:0, task:{id:'stoer-g1', title:'Stufe im linken Drittel', text:'Kasten $0<x<L$ mit $\\hat H\' = V_0$ für $0 < x < L/3$ (sonst $0$). Grundzustand $\\psi_1 = \\sqrt{2/L}\\sin(\\pi x/L)$.',
      ctx:CTX.box({params:{L:'pos', m:'pos', V_0:'pos'}, defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)'}, ops:{"H'":'V_0 Θ(L/3 - x)'}}),
      goals:[{id:'a', prompt:'Berechne $E_1^{(1)}$.', type:'value', target:'V_0 (1/3 - sqrt(3)/(4π))', points:3, model:["E^(1) = ⟨ψ_1|H'|ψ_1⟩", '= 2V_0/L ∫_0^{L/3} sin(πx/L)^2 dx', '= V_0/L [x - L/(2π) sin(2πx/L)]_0^{L/3}', '= V_0/L (L/3 - L/(2π) sin(2π/3))', '= V_0 (1/3 - sqrt(3)/(4π))']}]}},
    {aim:1, task:{id:'stoer-g2', title:'Erster angeregter Zustand mit $\\lambda x^2$: zweite Ordnung', text:'Oszillator mit $\\hat H\' = \\lambda\\hat x^2$, Zustand $|1\\rangle$, $\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$.',
      ctx:STOSC(),
      goals:[{id:'a', prompt:'Berechne $E_1^{(2)}$.', type:'value', target:'-3 λ^2 ħ/(4 m^2 ω^3)', points:3, model:['⟨3|x^2|1⟩ = ħ/(2mω) sqrt(6)', 'E^(2) = λ^2 |⟨3|x^2|1⟩|^2/(3ħω/2 - 7ħω/2)', '= λ^2 (ħ/(2mω))^2 · 6/(-2ħω)', '= -3 λ^2 ħ/(4 m^2 ω^3)']}]}},
    {aim:2, task:{id:'stoer-g3', title:'Entartetes Niveau mit Diagonalanteil', text:'Zwei Zustände haben dieselbe Energie $E^{(0)}$. Im Unterraum hat die Störung die Matrix $W = \\begin{pmatrix}\\beta&\\beta\\\\\\beta&-\\beta\\end{pmatrix}$ mit $\\beta > 0$. In der Eingabe heißt sie `W`, die Einheitsmatrix `I`.',
      ctx:STMAT({W:'(β, β; β, -β)'}, {β:'pos'}, {unknowns:{ε:{ref:'sqrt(2) β', alt:['-sqrt(2) β'], kind:'real'}}}),
      goals:[{id:'a', prompt:'Bestimme die Energiekorrekturen $\\varepsilon$ erster Ordnung (am Ende die positive: $\\varepsilon = \\dots$).', type:'solve', unknown:'ε', points:3, model:['det(W - ε I) = 0', 'det((β - ε, β; β, -β - ε)) = 0', 'ε^2 - 2β^2 = 0', 'ε = sqrt(2) β']}]}},
    {aim:'k', id:'stoer-fk3', type:'dialog',
      text:'Zwei Studierende verbessern einen Variationsansatz, indem sie einen zweiten Parameter hinzufügen.',
      people:[{name:'Lena', says:'Mit zwei Parametern kann $\\langle H\\rangle$ bei geschickter Wahl auch unter $E_0$ sinken.'},
        {name:'Jonas', says:'Egal wie viele Parameter: $\\langle H\\rangle \\ge E_0$ bleibt. Mehr Parameter können die Schranke nur näher an $E_0$ bringen.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Jonas. Das Variationsprinzip gilt für jeden normierten Zustand, also auch für jede Familie mit beliebig vielen Parametern.'},
    {aim:'k', id:'stoer-fk4', type:'mc2',
      q:'Oszillator mit $\\hat H\' = \\lambda\\hat x^2$: Welche Zustände mischt die Störung in erster Ordnung dem Grundzustand $|0\\rangle$ bei?',
      opts:['nur $|2\\rangle$', '$|1\\rangle$ und $|2\\rangle$', 'alle $|m\\rangle$ mit geradem $m$'], a:0,
      ex:'$\\hat x^2|0\\rangle \\propto (\\hat a + \\hat a^\\dagger)^2|0\\rangle = |0\\rangle + \\sqrt2|2\\rangle$. Der Anteil $|0\\rangle$ zählt nicht ($m \\ne n$); es bleibt nur $|2\\rangle$.',
      reason:{q:'Warum?', opts:['$(\\hat a + \\hat a^\\dagger)^2$ ändert $n$ nur um $0$ oder $\\pm2$.', 'Nur gerade Zustände haben einen kleinen Nenner.', 'Ungerade Zustände haben zu viel Energie.'], a:0, ex:'Entscheidend sind die Matrixelemente: $\\langle m|\\hat x^2|0\\rangle = 0$ für alle $m \\ne 0, 2$.'}},
    {aim:0, sketch:STOER_SK.mkF('stoer-fs2', 2)}
  ],
  errors:[
    {id:'stoer-e1', title:'Eine Stufe, die nur ein Viertel bringt?',
      text:'Für die Stufe $V_0$ auf der linken Hälfte des Kastens rechnet jemand:',
      ctx:STBOX({"H'":'V_0 Θ(L/2 - x)'}),
      lines:["E^(1) = ⟨ψ_n|H'|ψ_n⟩", '= V_0 ∫_0^{L/2} sin(nπx/L)^2 dx', '= V_0 L/4'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Die Normierung $2/L$ von $|\\psi_n|^2$ fehlt.', 'Das Integral muss bis $L$ gehen.', 'Es fehlt ein komplex konjugiertes $\\psi$.'], a:0, ex:'Ein Warnsignal ist die Einheit: $V_0L/4$ ist keine Energie, sondern Energie mal Länge.'},
      fix:{id:'a', prompt:'Berichtige und berechne $E_n^{(1)}$.', type:'value', target:'V_0/2', model:["E^(1) = ⟨ψ_n|H'|ψ_n⟩", '= 2/L V_0 ∫_0^{L/2} sin(nπx/L)^2 dx', '= 2/L V_0 · L/4', '= V_0/2']}}
  ]
});
lexe('stoerung-1', 'Störungstheorie: erste Ordnung', '$\\hat H = \\hat H_0 + \\hat H\'$, $\\hat H_0|n\\rangle = E_n^{(0)}|n\\rangle$ (nicht entartet). Energie: $E_n^{(1)} = \\langle n|\\hat H\'|n\\rangle$. Zustand: $|n^{(1)}\\rangle = \\sum_{m\\ne n}\\frac{\\langle m|\\hat H\'|n\\rangle}{E_n^{(0)} - E_m^{(0)}}|m\\rangle$. Eingabe: Störoperator `H\'`, z. B. `⟨ψ_n|H\'|ψ_n⟩`.', {topic:'stoer'});
lexe('stoerung-2', 'Störungstheorie: zweite Ordnung', '$E_n^{(2)} = \\sum_{m\\ne n}\\frac{|\\langle m|\\hat H\'|n\\rangle|^2}{E_n^{(0)} - E_m^{(0)}}$. Für den Grundzustand immer $\\le 0$ („Niveaus stoßen sich ab“). Gültig, solange $|\\langle m|\\hat H\'|n\\rangle| \\ll |E_n^{(0)} - E_m^{(0)}|$.', {topic:'stoer'});
lexe('entartete-stoerung', 'Entartete Störungstheorie', 'Ist $E^{(0)}$ $g$-fach entartet, bildet man die $g\\times g$-Matrix $W_{ij} = \\langle i|\\hat H\'|j\\rangle$ im entarteten Unterraum. Ihre Eigenwerte sind die Korrekturen erster Ordnung, ihre Eigenvektoren die „richtigen“ Zustände nullter Ordnung. Eingabe zum Beispiel `det(W - ε I) = 0`.', {topic:'stoer'});
lexe('variationsprinzip', 'Variationsprinzip', 'Für jeden normierten Zustand gilt $E_0 \\le \\langle\\psi|\\hat H|\\psi\\rangle$. Verfahren: Ansatz $\\psi_b$ mit Parameter(n) $b$, $\\langle H\\rangle(b)$ berechnen, $\\frac{d}{db}\\langle H\\rangle = 0$ lösen. Das Minimum ist eine obere Schranke für $E_0$, exakt nur, wenn der Ansatz den Grundzustand enthält.', {topic:'stoer'});
lexe('stark-effekt', 'Stark-Effekt', 'Verschiebung von Energieniveaus im elektrischen Feld $\\mathcal E\\hat z$, Störung $\\hat H\' = e\\mathcal E\\hat z$ (Elektron). Nicht entarteter Zustand fester Parität: $E^{(1)} = 0$, quadratischer Effekt $E^{(2)} = -\\frac12\\alpha\\mathcal E^2$ (Polarisierbarkeit $\\alpha$; Wasserstoff-Grundzustand $\\alpha = 4\\pi\\varepsilon_0\\cdot\\frac92a_0^3$). Entartung verschiedener Parität (Wasserstoff $n = 2$: $2s$, $2p_0$): linearer Effekt $\\pm3e\\mathcal Ea_0$.', {topic:'stoer'});
lexe('anharmonischer-oszillator', 'Anharmonischer Oszillator', '$V = \\frac12m\\omega^2x^2 + \\kappa x^3 + \\lambda x^4$. Mit $\\hat x = \\sqrt{\\hbar/(2m\\omega)}(\\hat a + \\hat a^\\dagger)$: $E_n^{(1)} = \\lambda\\left(\\frac{\\hbar}{2m\\omega}\\right)^2(6n^2 + 6n + 3)$ für den quartischen Term; der kubische Term gibt $E_n^{(1)} = 0$ und $E_n^{(2)} = -\\frac{\\kappa^2}{\\hbar\\omega}\\left(\\frac{\\hbar}{2m\\omega}\\right)^3(30n^2 + 30n + 11)$. Folge: Die Niveauabstände hängen von $n$ ab (Obertöne in Molekülspektren).', {topic:'stoer'});
lexe('paritaet-auswahlregel', 'Parität und verschwindende Matrixelemente', 'Ist $V(-x) = V(x)$, so sind die nicht entarteten Eigenfunktionen gerade oder ungerade. Dann gilt $\\langle m|\\hat O|n\\rangle = 0$, wenn der Integrand $\\psi_m^*\\,\\hat O\\,\\psi_n$ insgesamt ungerade ist. Beispiele: $\\langle n|\\hat x|n\\rangle = 0$, $\\langle n|\\hat x^3|n\\rangle = 0$; $\\hat x$ verbindet nur Zustände verschiedener Parität. Im Kasten $0 < x < L$ gilt das Gleiche bezogen auf die Mitte $x = L/2$.', {topic:'stoer'});
})();
