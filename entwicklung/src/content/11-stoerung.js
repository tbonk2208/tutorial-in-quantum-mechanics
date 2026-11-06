/* ===== Thema 11: Stationäre Störungstheorie ===== */
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
    {id:'stoer-t1', title:'Die Idee: ein gelöstes Problem plus eine kleine Störung',
      text:'**Warum nähern?** Exakt lösen kann man nur wenige Modelle: Kasten, Oszillator, Wasserstoff. Reale Systeme weichen davon ab. Ein Molekül schwingt nicht exakt harmonisch, ein Atom sitzt in einem äußeren Feld. Oft ist die Abweichung aber klein. Dann zerlegt man\n\n$$\\hat H = \\hat H_0 + \\lambda\\hat H\'$$\n\nin ein gelöstes Problem $\\hat H_0|n^{(0)}\\rangle = E_n^{(0)}|n^{(0)}\\rangle$ und eine **Störung** $\\lambda\\hat H\'$. Der Parameter $\\lambda$ zählt nur die Ordnung mit; am Ende setzt man $\\lambda = 1$. Die Zustände $|n^{(0)}\\rangle$ bilden eine [[lex:orthonormalbasis|Orthonormalbasis]]. In diesem und den nächsten beiden Abschnitten sei das betrachtete Niveau $E_n^{(0)}$ **nicht entartet**.\n\n**Ansatz.** Man nimmt an, dass Energie und Zustand glatt von $\\lambda$ abhängen, und entwickelt nach Potenzen:\n\n$$E_n = E_n^{(0)} + \\lambda E_n^{(1)} + \\lambda^2E_n^{(2)} + \\dots,\\qquad |n\\rangle = |n^{(0)}\\rangle + \\lambda|n^{(1)}\\rangle + \\lambda^2|n^{(2)}\\rangle + \\dots$$\n\nEinsetzen in $\\hat H|n\\rangle = E_n|n\\rangle$ und Ordnen nach Potenzen von $\\lambda$ gibt eine Gleichung je Ordnung. Jede muss einzeln gelten, weil die Gleichung für jedes kleine $\\lambda$ stimmen soll (Koeffizientenvergleich):\n\n$$\\lambda^0:\\quad \\hat H_0|n^{(0)}\\rangle = E_n^{(0)}|n^{(0)}\\rangle$$\n\n$$\\lambda^1:\\quad \\hat H_0|n^{(1)}\\rangle + \\hat H\'|n^{(0)}\\rangle = E_n^{(0)}|n^{(1)}\\rangle + E_n^{(1)}|n^{(0)}\\rangle$$\n\n$$\\lambda^2:\\quad \\hat H_0|n^{(2)}\\rangle + \\hat H\'|n^{(1)}\\rangle = E_n^{(0)}|n^{(2)}\\rangle + E_n^{(1)}|n^{(1)}\\rangle + E_n^{(2)}|n^{(0)}\\rangle$$\n\nDie nullte Ordnung ist das gelöste Problem. Die beiden anderen Gleichungen werten die nächsten Abschnitte aus.\n\n**Eine Wahl, die Arbeit spart.** Der Zustand ist nur bis auf Normierung und Phase festgelegt. Man darf deshalb verlangen, dass die Korrekturen keinen Anteil längs $|n^{(0)}\\rangle$ haben: $\\langle n^{(0)}|n^{(1)}\\rangle = 0$, ebenso für $|n^{(2)}\\rangle$. Einen solchen Anteil könnte man in die Normierung stecken. Mit dieser Wahl ist $\\langle n|n\\rangle = 1 + O(\\lambda^2)$, der Zustand also bis zur ersten Ordnung normiert.\n\n**Wann ist das sinnvoll?** Die Reihe ist nur brauchbar, wenn die Störung die Zustände wenig mischt. Der übernächste Abschnitt zeigt, was „klein“ genau heißt: Die Matrixelemente $\\langle m^{(0)}|\\hat H\'|n^{(0)}\\rangle$ müssen klein gegen die Abstände $|E_n^{(0)} - E_m^{(0)}|$ sein.\n\n**Typische Fehlvorstellung.** „Klein heißt: $\\hat H\'$ hat einen kleinen Vorfaktor.“ Ob eine Störung klein ist, entscheidet der Vergleich mit den Niveauabständen, nicht die Größe einer Zahl allein. Dieselbe Feldstärke kann für den Grundzustand des Wasserstoffs klein und für hoch angeregte, eng liegende Niveaus groß sein.',
      q:[
        {q:'Warum muss die Gleichung für jede Potenz von $\\lambda$ einzeln stimmen?', opts:['Sie soll für jedes kleine $\\lambda$ gelten (Koeffizientenvergleich).', 'Weil am Ende $\\lambda = 1$ ist und alle Ordnungen gleich groß sind.', 'Weil $\\hat H\'$ hermitesch ist und reelle Eigenwerte hat.'], a:0, ex:'Ein Polynom in $\\lambda$, das für alle kleinen $\\lambda$ null ist, hat nur verschwindende Koeffizienten.'},
        {q:'Ein Niveauabstand beträgt $1\\,$eV, das Matrixelement der Störung zu diesem Nachbarn $0{,}5\\,$eV. Ist Störungstheorie hier verlässlich?', opts:['eher nicht, das Matrixelement ist nicht klein gegen den Abstand', 'ja, $0{,}5\\,$eV ist für ein Atom eine kleine Energie', 'ja, solange die erste Ordnung null ist'], a:0, ex:'Maßstab ist das Verhältnis $|\\langle m|\\hat H\'|n\\rangle|/|E_n^{(0)} - E_m^{(0)}| = 0{,}5$ – zu groß für eine schnell konvergierende Reihe.'}
      ]},
    {id:'stoer-t2', title:'Erste Ordnung: Energie und Zustand',
      text:'**Energie.** Multipliziere die Gleichung erster Ordnung von links mit $\\langle n^{(0)}|$:\n\n$$\\langle n^{(0)}|\\hat H_0|n^{(1)}\\rangle + \\langle n^{(0)}|\\hat H\'|n^{(0)}\\rangle = E_n^{(0)}\\langle n^{(0)}|n^{(1)}\\rangle + E_n^{(1)}.$$\n\nWeil $\\hat H_0$ [[lex:hermitescher-operator|hermitesch]] ist, wirkt es auch nach links: $\\langle n^{(0)}|\\hat H_0 = E_n^{(0)}\\langle n^{(0)}|$. Der erste Term links ist also $E_n^{(0)}\\langle n^{(0)}|n^{(1)}\\rangle$ und hebt sich gegen den ersten rechts. Es bleibt\n\n$$E_n^{(1)} = \\langle n^{(0)}|\\hat H\'|n^{(0)}\\rangle.$$\n\n**Deutung.** Die [[lex:stoerung-1|Korrektur erster Ordnung]] ist der Erwartungswert der Störung im *ungestörten* Zustand. Das Teilchen spürt die Störung dort, wo es sich aufhält.\n\n**Zustand.** Projiziere dieselbe Gleichung auf $\\langle m^{(0)}|$ mit $m \\ne n$. Wegen $\\langle m^{(0)}|n^{(0)}\\rangle = 0$ folgt $(E_m^{(0)} - E_n^{(0)})\\langle m^{(0)}|n^{(1)}\\rangle + \\langle m^{(0)}|\\hat H\'|n^{(0)}\\rangle = 0$. Mit der Wahl $\\langle n^{(0)}|n^{(1)}\\rangle = 0$ und der [[lex:vollstaendigkeit|Vollständigkeit]] der Basis ist\n\n$$|n^{(1)}\\rangle = \\sum_{m\\ne n}\\frac{\\langle m^{(0)}|\\hat H\'|n^{(0)}\\rangle}{E_n^{(0)} - E_m^{(0)}}\\,|m^{(0)}\\rangle.$$\n\nDie Störung mischt andere Zustände bei, umso stärker, je näher sie energetisch liegen. Hier sieht man auch, warum Entartung Probleme macht: Bei $E_m^{(0)} = E_n^{(0)}$ wäre der Nenner null.\n\n**Symmetrie spart Arbeit.** Ist $\\hat H_0$ symmetrisch unter $x \\to -x$, so haben die Eigenfunktionen eine feste [[lex:paritaet-auswahlregel|Parität]], und $|\\psi_n|^2$ ist gerade. Für eine ungerade Störung wie $\\lambda x$ im Oszillator ist dann $E_n^{(1)} = \\lambda\\int x|\\psi_n|^2dx = 0$.\n\n**Beispiel: Stufe in der Kastenmitte.** Im Kasten $0 < x < L$ sei $\\hat H\' = V_0$ für $L/4 < x < 3L/4$, sonst $0$. Dann ist $E_n^{(1)} = V_0\\cdot P_n(\\text{Mitte})$. Für $n = 1$ ergibt die Herleitung unten $V_0\\left(\\frac12 + \\frac1\\pi\\right) \\approx 0{,}82\\,V_0$: Der Grundzustand hat seinen Bauch in der Mitte und spürt mehr als die halbe Stufe. Für $n = 2$ sind es genau $V_0/2$. Das Labor daneben zeigt eine verwandte Störung, die Stufe auf der linken Hälfte; dort bekommt jedes $n$ genau $V_0/2$.\n\n**Typische Fehlvorstellung.** „Für die erste Ordnung muss man erst die gestörte Wellenfunktion kennen.“ Nein: Für $E_n^{(1)}$ genügt die ungestörte. Die Änderung des Zustands wirkt sich erst in der Energie zweiter Ordnung aus.',
      fig:{lab:'perturb', caption:'Stufe $V_0$ auf der linken Kastenhälfte: grau ungestört, orange erste Ordnung $E_n^{(0)} + V_0/2$, blau exakt. Für kleines $V_0$ liegen Orange und Blau fast aufeinander. Mit wachsendem $V_0$ liegt die exakte Grundzustandsenergie sichtbar darunter.'},
      derive:{ctx:CTX.box({params:{L:'pos', m:'pos', V_0:'pos'}, defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)'}, ops:{"H'":'V_0 Θ(x - L/4) Θ(3L/4 - x)'}}),
        lines:[
          {l:"E^(1) = ⟨ψ_1|H'|ψ_1⟩", w:'Erwartungswert der Störung im ungestörten Grundzustand'},
          {l:'= 2V_0/L ∫_{L/4}^{3L/4} sin(πx/L)^2 dx', w:'Störung nur in der Mitte',
            why:{q:'Warum laufen die Grenzen nur von $L/4$ bis $3L/4$?', opts:['Außerhalb dieses Bereichs ist die Störung null.', 'Außerhalb dieses Bereichs ist $\\psi_1$ null.', 'Wegen der Symmetrie des Sinus um $L/2$.'], a:0, ex:'Der Integrand $\\psi_1^*\\hat H\'\\psi_1$ verschwindet, wo $\\hat H\' = 0$ ist. $\\psi_1$ selbst ist im ganzen Kasten ungleich null.'}},
          {l:'= V_0/L ∫_{L/4}^{3L/4} (1 - cos(2πx/L)) dx', w:'$\\sin^2u = \\frac12(1 - \\cos2u)$'},
          {l:'= V_0/L [x - L/(2π) sin(2πx/L)]_{L/4}^{3L/4}', w:'Stammfunktion'},
          {l:'= V_0/L (L/2 + L/π)', w:'$\\sin\\frac{3\\pi}{2} - \\sin\\frac\\pi2 = -2$',
            why:{q:'Woher kommt der Beitrag $L/\\pi$?', opts:['Aus $-\\frac{L}{2\\pi}(\\sin\\frac{3\\pi}{2} - \\sin\\frac\\pi2) = \\frac{L}{\\pi}$', 'Aus der Normierung $2/L$ der Kastenfunktion', 'Aus dem Integral über $x$ von $L/4$ bis $3L/4$'], a:0, ex:'Der Kosinus-Anteil verschwindet hier nicht, weil die Grenzen keine Vielfachen von $L/2$ sind. Das Integral über $1$ gibt $L/2$.'}},
          {l:'= V_0 (1/2 + 1/π)',
            why:{q:'Ist das plausibel?', opts:['Ja: Mehr als die Hälfte von $|\\psi_1|^2$ liegt in der Mitte.', 'Nein: Die Mitte ist halb so breit wie der Kasten, also $V_0/2$.', 'Nein: Die Korrektur muss kleiner als $V_0/2$ sein.'], a:0, ex:'$E_1^{(1)} = V_0\\,P(L/4 < x < 3L/4) \\approx 0{,}82\\,V_0$. Der Bauch von $\\psi_1$ liegt in der Mitte; „halbe Breite, also halbe Stufe“ gilt nur für eine gleichmäßige Dichte.'}}
        ]},
      q:[
        {q:'Für $\\hat H\' = \\lambda x$ im harmonischen Oszillator ist $E_n^{(1)} = $', opts:['$0$ für alle $n$', '$\\lambda\\sqrt{\\hbar/(2m\\omega)}$', '$\\lambda\\frac{\\hbar}{2m\\omega}(2n+1)$'], a:0, ex:'$|\\psi_n|^2$ ist gerade, $x$ ungerade; das Integral verschwindet. Mit Leiteroperatoren: $\\langle n|\\hat a + \\hat a^\\dagger|n\\rangle = 0$.'},
        {q:'Die Störung $V_0$ sitzt auf $L/4 < x < 3L/4$. Welcher Zustand spürt sie in erster Ordnung am stärksten?', opts:['$n = 1$, er hat seinen Bauch in der Mitte', '$n = 2$, er hat dort seinen Knoten', 'alle gleich stark, je mit $V_0/2$'], a:0, ex:'$n = 1$: $V_0(\\frac12 + \\frac1\\pi) \\approx 0{,}82\\,V_0$; $n = 2$: $V_0/2$; $n = 3$: $V_0(\\frac12 - \\frac{1}{3\\pi}) \\approx 0{,}39\\,V_0$. Für großes $n$ geht der Wert gegen $V_0/2$.'}
      ]},
    {id:'stoer-t3', title:'Zweite Ordnung: Niveaus stoßen sich ab',
      text:'**Herleitung.** Projiziere die Gleichung zweiter Ordnung auf $\\langle n^{(0)}|$. Wie in erster Ordnung heben sich die Terme mit $\\hat H_0$ und $E_n^{(0)}$ weg. Wegen $\\langle n^{(0)}|n^{(1)}\\rangle = 0$ fällt auch der Term mit $E_n^{(1)}$ weg. Übrig bleibt $E_n^{(2)} = \\langle n^{(0)}|\\hat H\'|n^{(1)}\\rangle$. Setzt man $|n^{(1)}\\rangle$ aus dem vorigen Abschnitt ein, erhält man die [[lex:stoerung-2|zweite Ordnung]]:\n\n$$E_n^{(2)} = \\sum_{m\\ne n}\\frac{\\langle n^{(0)}|\\hat H\'|m^{(0)}\\rangle\\langle m^{(0)}|\\hat H\'|n^{(0)}\\rangle}{E_n^{(0)} - E_m^{(0)}} = \\sum_{m\\ne n}\\frac{|\\langle m^{(0)}|\\hat H\'|n^{(0)}\\rangle|^2}{E_n^{(0)} - E_m^{(0)}}.$$\n\nIm letzten Schritt steht die Hermitezität von $\\hat H\'$: $\\langle n|\\hat H\'|m\\rangle = \\langle m|\\hat H\'|n\\rangle^*$.\n\n**Deutung.** Jeder Zähler ist $\\ge 0$. Das Vorzeichen eines Beitrags bestimmt der Nenner. Ein Niveau $m$ *oberhalb* von $n$ drückt $E_n$ nach unten, ein Niveau *unterhalb* drückt es nach oben: Die Niveaus „stoßen sich ab“. Für den Grundzustand liegen alle anderen Niveaus darüber, also gilt immer $E_0^{(2)} \\le 0$. Nahe Nachbarn tragen am meisten bei, weil ihr Nenner klein ist.\n\n**Gültigkeit.** Die Entwicklung ist sinnvoll, solange $|\\langle m^{(0)}|\\hat H\'|n^{(0)}\\rangle| \\ll |E_n^{(0)} - E_m^{(0)}|$ für alle $m$, die stark beitragen. Dann ist auch die Beimischung $|n^{(1)}\\rangle$ klein.\n\n**Prüfstein: das Zweiniveausystem.** Für $\\hat H = \\begin{pmatrix}E_1 & v\\\\ v & E_2\\end{pmatrix}$ mit $E_1 < E_2$ und reellem $v$ kennt man die exakten Eigenwerte:\n\n$$\\varepsilon_\\mp = \\frac{E_1 + E_2}{2} \\mp \\sqrt{\\frac{(E_2 - E_1)^2}{4} + v^2}.$$\n\nFür $|v| \\ll E_2 - E_1$ gibt die [[lex:taylor|Taylor-Entwicklung]] $\\sqrt{a^2 + v^2} \\approx a + \\frac{v^2}{2a}$ mit $a = (E_2 - E_1)/2$:\n\n$$\\varepsilon_- \\approx E_1 - \\frac{v^2}{E_2 - E_1},\\qquad \\varepsilon_+ \\approx E_2 + \\frac{v^2}{E_2 - E_1}.$$\n\nGenau das liefert die Störungstheorie mit $\\hat H_0 = \\mathrm{diag}(E_1, E_2)$ und $\\hat H\'$ = Nebendiagonale: $E_1^{(1)} = 0$ und $E_1^{(2)} = v^2/(E_1 - E_2)$. Das untere Niveau sinkt, das obere steigt um denselben Betrag. Die Herleitung unten prüft die exakte Lösung und beide Ordnungen nach.\n\n**Typische Fehlvorstellungen.** (1) „In der Summe muss man auch $m = n$ mitnehmen.“ Nein: Dieser Anteil ist durch die Wahl $\\langle n^{(0)}|n^{(1)}\\rangle = 0$ ausgeschlossen; er stünde ohnehin mit Nenner null da. (2) Das Vorzeichen des Nenners vertauschen. Kontrolle: Der Grundzustand muss sinken.',
      derive:{ctx:STMAT({H:'(E_1, v; v, E_2)', H_1:'(0, v; v, 0)'}, {E_1:'pos', E_2:{range:['E_1 + 1', 'E_1 + 3']}, v:'real'}),
        lines:[
          {l:'ε = (E_1 + E_2)/2 - sqrt((E_2 - E_1)^2/4 + v^2)', w:'exakter unterer Eigenwert'},
          {l:'det(H - ε I) = 0', w:'Probe',
            why:{q:'Warum genügt diese Zeile als Probe?', opts:['Eigenwerte sind genau die Nullstellen von $\\det(H - \\varepsilon\\mathbb 1)$.', 'Weil $H$ hermitesch ist, ist jede reelle Zahl Eigenwert.', 'Weil $\\det H = E_1E_2 - v^2$ für jedes $v$ gilt.'], a:0, ex:'$\\det(H - \\varepsilon\\mathbb 1) = 0$ heißt: $H - \\varepsilon\\mathbb 1$ ist nicht invertierbar, es gibt einen Eigenvektor.'}},
          {l:'(1, 0) H_1 (1; 0) = 0', w:'$E_1^{(1)} = 0$: Störung nur auf der Nebendiagonale'},
          {l:'|(0, 1) H_1 (1; 0)|^2/(E_1 - E_2) = -v^2/(E_2 - E_1)', w:'$E_1^{(2)}$, nur ein Zwischenzustand',
            why:{q:'Warum ist dieser Beitrag negativ?', opts:['Der einzige Zwischenzustand liegt höher.', 'Weil die Kopplung $v$ negativ sein kann.', 'Weil die erste Ordnung hier null ist.'], a:0, ex:'Der Zähler $v^2$ ist positiv, der Nenner negativ. Das obere Niveau drückt das untere nach unten.'}},
          {l:'ε ≈ E_1 - v^2/(E_2 - E_1)', w:'Taylor für $|v| \\ll E_2 - E_1$: wird nicht als Gleichheit geprüft'}
        ]},
      q:[
        {q:'Ein angeregtes Niveau hat einen Nachbarn knapp darunter und einen weit darüber; beide koppeln gleich stark. Wohin verschiebt die zweite Ordnung das Niveau?', opts:['nach oben, der nahe Nachbar darunter überwiegt', 'nach unten, die zweite Ordnung ist immer negativ', 'gar nicht, die Beiträge heben sich auf'], a:0, ex:'Gleiche Zähler, aber der kleine positive Nenner (Nachbar darunter) gibt den größeren, positiven Beitrag. Nur für den Grundzustand ist $E^{(2)} \\le 0$ garantiert.'},
        {q:'Warum ist $E_0^{(2)} \\le 0$ für jeden Grundzustand?', opts:['Alle Nenner $E_0^{(0)} - E_m^{(0)}$ sind negativ, alle Zähler $\\ge 0$.', 'Weil die erste Ordnung im Grundzustand immer null ist.', 'Weil jede Störung die Energie grundsätzlich senkt.'], a:0, ex:'Im Grundzustand liegen alle anderen Niveaus höher. Die erste Ordnung kann dagegen beliebiges Vorzeichen haben.'}
      ]},
    {id:'stoer-t4', title:'Entartete Störungstheorie',
      text:'**Das Problem.** Haben zwei oder mehr Zustände dieselbe ungestörte Energie, versagen die Formeln: In $|n^{(1)}\\rangle$ und $E_n^{(2)}$ stünde $E_n^{(0)} - E_m^{(0)} = 0$ im Nenner. Der tiefere Grund: Im entarteten Unterraum ist *jede* Linearkombination ein Eigenzustand von $\\hat H_0$. Welche davon beim Einschalten der Störung stetig weiterlebt, legt erst die Störung fest. Man muss diese **richtigen Zustände nullter Ordnung** zuerst finden.\n\n**Herleitung.** Das Niveau $E^{(0)}$ sei $g$-fach entartet, mit orthonormaler Basis $|1\\rangle, \\dots, |g\\rangle$ des Unterraums. Ansatz für den Zustand nullter Ordnung: $|\\phi^{(0)}\\rangle = \\sum_{j=1}^g c_j|j\\rangle$. Die Gleichung erster Ordnung lautet wie vorher, nur umgestellt:\n\n$$(\\hat H_0 - E^{(0)})|\\phi^{(1)}\\rangle = (E^{(1)} - \\hat H\')|\\phi^{(0)}\\rangle.$$\n\nProjiziere auf ein $\\langle i|$ aus dem Unterraum. Links steht $\\langle i|(\\hat H_0 - E^{(0)}) = 0$, weil $|i\\rangle$ zu $E^{(0)}$ gehört und $\\hat H_0$ hermitesch ist. Also muss auch rechts null herauskommen:\n\n$$\\sum_{j=1}^g W_{ij}c_j = E^{(1)}c_i,\\qquad W_{ij} = \\langle i|\\hat H\'|j\\rangle.$$\n\nDas ist ein [[lex:eigenwertproblem|Eigenwertproblem]] für die $g\\times g$-Matrix $W$.\n\n**Ergebnis.** Die Eigenwerte von $W$ sind die Korrekturen erster Ordnung, die Eigenvektoren die richtigen Zustände nullter Ordnung ([[lex:entartete-stoerung|entartete Störungstheorie]]). Sind die Eigenwerte verschieden, spaltet das Niveau auf: Die Störung hebt die Entartung ganz oder teilweise auf. In der Eigenbasis ist $W$ diagonal. Dann verschwinden die gefährlichen Matrixelemente zwischen entarteten Zuständen, und die nicht entarteten Formeln für höhere Ordnungen sind wieder anwendbar.\n\n**Abkürzung über Symmetrie.** Vertauscht ein hermitescher Operator $\\hat A$ mit $\\hat H_0$ und mit $\\hat H\'$ und hat er im Unterraum verschiedene Eigenwerte, dann ist $W$ in der Eigenbasis von $\\hat A$ schon diagonal. Beim Wasserstoff im Feld $\\mathcal E\\hat z$ ist das $\\hat L_z$: Nur Zustände mit gleichem $m$ koppeln.\n\n**Beispiel: linearer [[lex:stark-effekt|Stark-Effekt]].** Das Niveau $n = 2$ des Wasserstoffs ist ohne Spin vierfach entartet ($2s$ und $2p$ mit $m = 0, \\pm1$). Mit $\\hat H\' = e\\mathcal E\\hat z$ koppelt nur $\\langle 2s|\\hat z|2p_0\\rangle$; sein Betrag ist $3a_0$. Mit $w = 3e\\mathcal Ea_0$ ist im Unterraum $\\{|2s\\rangle, |2p_0\\rangle\\}$, bis auf ein Vorzeichen, das von der Phasenwahl abhängt,\n\n$$W = \\begin{pmatrix}0 & w\\\\ w & 0\\end{pmatrix}\\ \\Rightarrow\\ E^{(1)} = \\pm w,\\qquad |\\phi_\\pm\\rangle = \\tfrac{1}{\\sqrt2}\\big(|2s\\rangle \\pm |2p_0\\rangle\\big).$$\n\nDie Zustände $2p_{\\pm1}$ bleiben in erster Ordnung unverschoben. Die Verschiebung ist *linear* in $\\mathcal E$, weil die Mischungen $|\\phi_\\pm\\rangle$ ein festes Dipolmoment haben.\n\n**Typische Fehlvorstellung.** „Man nimmt einfach $\\langle 2s|\\hat H\'|2s\\rangle$ und $\\langle 2p_0|\\hat H\'|2p_0\\rangle$.“ Beide sind aus Paritätsgründen null. Man fände fälschlich gar keine Verschiebung – entscheidend ist die Nebendiagonale von $W$.',
      derive:{ctx:STMAT({W:'(0, w; w, 0)'}, {w:'pos'}),
        lines:[
          {l:'det(W - w I) = 0', w:'$+w$ ist Eigenwert'},
          {l:'det(W + w I) = 0', w:'$-w$ ist Eigenwert'},
          {l:'W (1; 1)/sqrt(2) = w (1; 1)/sqrt(2)', w:'richtiger Zustand zu $+w$',
            why:{q:'Was ist $\\frac{1}{\\sqrt2}\\binom11$ physikalisch?', opts:['die Mischung $\\frac{1}{\\sqrt2}(|2s\\rangle + |2p_0\\rangle)$', 'der unveränderte Zustand $|2s\\rangle$', 'der Zustand $|2p_{+1}\\rangle$'], a:0, ex:'Die Komponenten beziehen sich auf die Basis $|2s\\rangle, |2p_0\\rangle$. Die Störung wählt die Mischungen, nicht die ursprünglichen Basiszustände.'}},
          {l:'W (1; -1)/sqrt(2) = -w (1; -1)/sqrt(2)', w:'richtiger Zustand zu $-w$'},
          {l:'tr(W) = 0', w:'Summe der Korrekturen',
            why:{q:'Was sagt $\\mathrm{tr}\\,W = 0$ über die Aufspaltung?', opts:['Die Summe der Korrekturen ist null.', 'Jede der beiden Korrekturen ist null.', 'Das Niveau spaltet gar nicht auf.'], a:0, ex:'Die Spur ist die Summe der Eigenwerte: $+w + (-w) = 0$. Die Aufspaltung ist symmetrisch um $E^{(0)}$.'}}
        ]},
      q:[
        {q:'Ein Niveau ist dreifach entartet. Wie viele Korrekturen erster Ordnung gibt es, mit Vielfachheit gezählt?', opts:['drei, die Eigenwerte einer $3\\times3$-Matrix', 'eine, den Mittelwert von $\\hat H\'$', 'keine, die Formel versagt hier'], a:0, ex:'$W$ ist $3\\times3$ und hat drei Eigenwerte. Manche können zusammenfallen; dann bleibt eine Restentartung.'},
        {q:'Im Unterraum ist $W = \\begin{pmatrix}\\beta&0\\\\0&\\beta\\end{pmatrix}$. Was folgt?', opts:['beide um $\\beta$ verschoben, keine Aufspaltung', 'Aufspaltung in $E^{(0)} \\pm \\beta$', 'erst die Basis wechseln, dann rechnen'], a:0, ex:'$W = \\beta\\mathbb 1$ ist in jeder Basis diagonal; beide Zustände bekommen $\\beta$. Die Entartung bleibt in erster Ordnung bestehen.'}
      ]},
    {id:'stoer-t5', title:'Das Variationsprinzip',
      text:'**Aussage.** Für jeden normierten Zustand $|\\psi\\rangle$ gilt\n\n$$\\langle\\psi|\\hat H|\\psi\\rangle \\ge E_0,$$\n\nmit der exakten Grundzustandsenergie $E_0$. Der Erwartungswert der Energie in einem beliebigen Versuchszustand ist also eine **obere Schranke** für $E_0$ ([[lex:variationsprinzip|Variationsprinzip]]).\n\n**Beweis.** Entwickle $|\\psi\\rangle$ nach den unbekannten exakten Eigenzuständen: $|\\psi\\rangle = \\sum_n c_n|n\\rangle$ mit $\\sum_n|c_n|^2 = 1$ (Thema 6, [[lex:entwicklung|Entwicklung nach Eigenfunktionen]]). Dann ist\n\n$$\\langle\\psi|\\hat H|\\psi\\rangle = \\sum_n|c_n|^2E_n \\ge \\sum_n|c_n|^2E_0 = E_0.$$\n\nIm Schritt „$\\ge$“ steht nur $E_n \\ge E_0$ für alle $n$. Gleichheit gilt genau dann, wenn $|\\psi\\rangle$ nur aus Grundzuständen besteht.\n\n**Verfahren.** Man wählt eine Familie von Versuchsfunktionen $\\psi_b$ mit einem oder mehreren Parametern $b$. Sie soll zu den bekannten Eigenschaften passen: Randbedingungen, Symmetrie, keine Knoten im Grundzustand. Dann berechnet man $\\langle H\\rangle(b)$ und minimiert: $\\frac{d}{db}\\langle H\\rangle = 0$. Das Minimum ist die beste Schranke innerhalb der Familie.\n\n**Beispiel: Kasten mit Parabel.** Im Kasten $0 < x < L$ verschwindet $\\psi(x) = \\sqrt{30/L^5}\\,x(L - x)$ an beiden Wänden, ist normiert und knotenfrei. Die Herleitung unten gibt $\\langle H\\rangle = 5\\hbar^2/(mL^2)$. Exakt ist die Grundzustandsenergie (im Kasten heißt sie $E_1$, weil die Zählung dort bei $n = 1$ beginnt) $E_1 = \\pi^2\\hbar^2/(2mL^2) \\approx 4{,}935\\,\\hbar^2/(mL^2)$. Die Schranke liegt nur 1,3 % zu hoch, obwohl die Parabel kein Sinus ist.\n\n**Warum die Energie so gut ist.** Weicht der Versuchszustand um einen Anteil der Größe $\\varepsilon$ vom Grundzustand ab, so ist $|c_n|^2$ von der Ordnung $\\varepsilon^2$ für $n \\ne 0$. Der Fehler der Energie ist also nur von der Ordnung $\\varepsilon^2$. Andere Erwartungswerte wie $\\langle x^2\\rangle$ haben meist schon einen Fehler der Ordnung $\\varepsilon$. Die Energie ist gut, die Wellenfunktion oft schlechter.\n\n**Zusammenhang mit der Störungstheorie.** Nimmt man den ungestörten Grundzustand als Versuchszustand, so ist $\\langle 0^{(0)}|\\hat H|0^{(0)}\\rangle = E_0^{(0)} + E_0^{(1)}$. Die erste Ordnung ist also immer eine obere Schranke für den Grundzustand – passend zu $E_0^{(2)} \\le 0$.\n\n**Typische Fehlvorstellung.** „Das Minimum über $b$ ist die exakte Grundzustandsenergie.“ Nur wenn die Familie den exakten Grundzustand enthält, wie der Gauß-Ansatz beim Oszillator. Sonst ist es eine Schranke, und wie weit sie danebenliegt, sagt das Verfahren allein nicht.',
      derive:{ctx:CTX.box({defs:{'ψ(x)':'sqrt(30/L^5) x (L - x)'}}),
        lines:[
          {l:"⟨H⟩ = -ħ^2/(2m) ∫_0^L ψ ψ'' dx", w:'im Kasten ist $V = 0$'},
          {l:"ψ'' = -2 sqrt(30/L^5)", w:'zweimal ableiten',
            why:{q:'Warum ist $\\psi\'\'$ konstant?', opts:['$\\psi$ ist ein Polynom zweiten Grades in $x$.', 'Weil $\\psi$ eine Eigenfunktion von $\\hat H$ ist.', 'Weil $\\psi$ an den Wänden verschwindet.'], a:0, ex:'$x(L - x) = Lx - x^2$ hat die zweite Ableitung $-2$. Wäre $\\psi$ Eigenfunktion, müsste $\\psi\'\' \\propto \\psi$ sein – das ist hier nicht so.'}},
          {l:'⟨H⟩ = ħ^2/m sqrt(30/L^5) ∫_0^L ψ dx', w:'Konstante vor das Integral'},
          {l:'= ħ^2/m · 30/L^5 ∫_0^L x (L - x) dx'},
          {l:'= ħ^2/m · 30/L^5 · L^3/6', w:'$\\int_0^L x(L-x)dx = \\frac{L^3}{2} - \\frac{L^3}{3}$'},
          {l:'= 5ħ^2/(m L^2)',
            why:{q:'Was folgt aus dem Vergleich mit $E_1 = \\pi^2\\hbar^2/(2mL^2) \\approx 4{,}93\\,\\hbar^2/(mL^2)$?', opts:['Die Schranke liegt wie erwartet knapp über $E_1$.', 'Die Rechnung ist falsch, das Ergebnis muss unter $E_1$ liegen.', 'Die Parabel ist der exakte Grundzustand.'], a:0, ex:'$5 > \\pi^2/2$: eine obere Schranke, 1,3 % zu hoch. Ein Ergebnis unter $E_1$ würde einen Rechenfehler anzeigen.'}}
        ]},
      q:[
        {q:'Zwei Ansätze liefern $\\langle H\\rangle = -12{,}9\\,$eV und $-13{,}4\\,$eV. Welcher liegt näher an der exakten Grundzustandsenergie?', opts:['$-13{,}4\\,$eV, weil beide über $E_0$ liegen', '$-12{,}9\\,$eV, weil Schranken von oben kommen', 'ohne $E_0$ lässt sich das nicht sagen'], a:0, ex:'Beide sind obere Schranken: $E_0 \\le -13{,}4\\,$eV. Der tiefere Wert ist also näher dran.'},
        {q:'Der Gauß-Ansatz $e^{-bx^2}$ liefert beim harmonischen Oszillator genau $\\hbar\\omega/2$. Warum?', opts:['Die Familie enthält den exakten Grundzustand.', 'Das Variationsprinzip liefert immer den exakten Wert.', 'Gauß-Funktionen sind Eigenfunktionen jedes $\\hat H$.'], a:0, ex:'Für $b = m\\omega/(2\\hbar)$ ist $e^{-bx^2}$ genau $\\psi_0$. Bei anderen Potentialen gibt derselbe Ansatz nur eine Schranke.'}
      ]},
    {id:'stoer-t6', title:'Anwendungen: anharmonischer Oszillator und Stark-Effekt',
      text:'**Anharmonischer Oszillator.** Ein Molekülpotential ist nur nahe dem Minimum eine Parabel. Die nächsten Glieder der [[lex:taylor|Taylor-Reihe]] sind $\\kappa x^3$ und $\\lambda x^4$. Mit $\\hat x = \\sqrt{\\hbar/(2m\\omega)}\\,(\\hat a + \\hat a^\\dagger)$ ([[lex:leiteroperatoren|Leiteroperatoren]], Thema 7) werden die Matrixelemente zu reinem Abzählen.\n\n*Quartischer Term, erste Ordnung.* $(\\hat a + \\hat a^\\dagger)^4$ besteht aus Produkten von vier Faktoren. Zum Diagonalelement $\\langle n|\\dots|n\\rangle$ tragen nur die sechs Anordnungen mit zwei $\\hat a$ und zwei $\\hat a^\\dagger$ bei. Ergebnis (Herleitung unten):\n\n$$E_n^{(1)} = \\lambda\\Big(\\frac{\\hbar}{2m\\omega}\\Big)^2(6n^2 + 6n + 3).$$\n\nFür $\\lambda > 0$ wird die Feder bei großen Auslenkungen steifer. Höhere Niveaus steigen stärker, die Abstände wachsen mit $n$.\n\n*Kubischer Term.* $\\hat x^3$ ist ungerade, also ist $E_n^{(1)} = 0$ ([[lex:paritaet-auswahlregel|Parität]]). Erst die zweite Ordnung trägt bei. $\\hat x^3|0\\rangle$ enthält nur $|1\\rangle$ und $|3\\rangle$; für den Grundzustand folgt\n\n$$E_0^{(2)} = -\\frac{11\\,\\kappa^2}{\\hbar\\omega}\\Big(\\frac{\\hbar}{2m\\omega}\\Big)^3.$$\n\nAllgemein ist $E_n^{(2)} = -\\frac{\\kappa^2}{\\hbar\\omega}\\left(\\frac{\\hbar}{2m\\omega}\\right)^3(30n^2 + 30n + 11)$. Höhere Niveaus sinken stärker, die Abstände werden mit $n$ kleiner. Bei realen Molekülpotentialen überwiegt meist dieser Effekt. Man sieht ihn in Schwingungsspektren zweiatomiger Moleküle: Der erste Oberton liegt etwas unter dem Doppelten der Grundschwingung ([[lex:anharmonischer-oszillator|anharmonischer Oszillator]]).\n\n**Stark-Effekt, qualitativ.** Ein Atom im homogenen Feld $\\mathcal E\\hat z$ hat die Störung $\\hat H\' = e\\mathcal E\\hat z$ (Elektronenladung $-e$). Der Grundzustand des Wasserstoffs hat gerade Parität. Also ist $E^{(1)} = e\\mathcal E\\langle z\\rangle = 0$: Das Atom hat kein festes Dipolmoment. Die zweite Ordnung ist negativ und quadratisch in $\\mathcal E$. Man schreibt sie als $E^{(2)} = -\\frac12\\alpha\\mathcal E^2$. Das Feld *induziert* ein Dipolmoment $\\alpha\\mathcal E$; $\\alpha$ heißt Polarisierbarkeit, für Wasserstoff exakt $\\alpha = 4\\pi\\varepsilon_0\\cdot\\frac92a_0^3$. Das ist der **quadratische** [[lex:stark-effekt|Stark-Effekt]]. Niveaus mit Entartung zwischen Zuständen verschiedener Parität, wie $2s$ und $2p$, zeigen dagegen den **linearen** Stark-Effekt aus dem Abschnitt zur Entartung.\n\n**Typische Fehlvorstellung.** „Die Energie eines Atoms im Feld ändert sich wie die eines Dipols, also linear in $\\mathcal E$.“ Das gilt nur bei Entartung zwischen Zuständen verschiedener Parität. Ein nicht entarteter Zustand fester Parität hat kein permanentes Dipolmoment; der Effekt beginnt quadratisch.',
      derive:{ctx:STOSC(),
        lines:[
          {l:'⟨n|x^4|n⟩ = (ħ/(2mω))^2 ⟨n|(a + a†)^4|n⟩', w:'$\\hat x = \\sqrt{\\hbar/(2m\\omega)}\\,(\\hat a + \\hat a^\\dagger)$'},
          {l:'⟨n|(a + a†)^4|n⟩ = 6n^2 + 6n + 3', w:'sechs Anordnungen mit zwei $\\hat a$ und zwei $\\hat a^\\dagger$',
            why:{q:'Welche Anordnung trägt zum Diagonalelement bei?', opts:['$\\hat a\\hat a\\hat a^\\dagger\\hat a^\\dagger$: zweimal hoch, zweimal runter', '$\\hat a^\\dagger\\hat a^\\dagger\\hat a^\\dagger\\hat a$: dreimal hoch, einmal runter', '$\\hat a\\hat a\\hat a\\hat a$: viermal hinunter'], a:0, ex:'Nur wenn $n$ am Ende wieder $n$ ist, bleibt $\\langle n|\\dots|n\\rangle \\ne 0$. Das verlangt gleich viele $\\hat a$ wie $\\hat a^\\dagger$.'}},
          {l:'⟨0|x^4|0⟩ = 3 (ħ/(2mω))^2', w:'$n = 0$'},
          {l:'⟨n|x^3|n⟩ = 0', w:'Parität',
            why:{q:'Warum verschwindet das?', opts:['$\\hat x^3$ ändert $n$ um $\\pm1$ oder $\\pm3$, nie um $0$.', 'Weil $\\hat x^3$ kein hermitescher Operator ist.', 'Weil $\\langle n|\\hat x|n\\rangle^3 = 0$ ist.'], a:0, ex:'Eine ungerade Zahl von Leiteroperatoren kann nicht zu $n$ zurückführen. $\\hat x^3$ ist hermitesch; und $\\langle x^3\\rangle$ ist nicht dasselbe wie $\\langle x\\rangle^3$.'}},
          {l:'|⟨1|x^3|0⟩|^2 = 9 (ħ/(2mω))^3', w:'$(\\hat a + \\hat a^\\dagger)^3|0\\rangle = \\sqrt6|3\\rangle + 3|1\\rangle$'},
          {l:'|⟨3|x^3|0⟩|^2 = 6 (ħ/(2mω))^3'},
          {l:'Σ_{k=1}^{3} |⟨k|x^3|0⟩|^2/(0 - k ħω) = -11/(ħω) (ħ/(2mω))^3', w:'$E_0^{(2)}/\\kappa^2$ mit $E_0^{(0)} - E_k^{(0)} = -k\\hbar\\omega$',
            why:{q:'Warum genügen $k = 1, 2, 3$?', opts:['$\\hat x^3|0\\rangle$ enthält nur $|1\\rangle$ und $|3\\rangle$.', 'Höhere $k$ sind wegen des großen Nenners klein.', 'Die Summe bricht nach drei Gliedern immer ab.'], a:0, ex:'Alle anderen Matrixelemente sind exakt null, auch $k = 2$. Die Summe ist damit exakt: $9/(-1) + 6/(-3) = -11$ in Einheiten von $(\\hbar/2m\\omega)^3/(\\hbar\\omega)$.'}}
        ]},
      q:[
        {q:'Für $\\hat H\' = \\kappa\\hat x^3$ im Oszillator ist $E_n^{(1)}$ …', opts:['null für alle $n$, wegen der Parität', 'positiv für $\\kappa > 0$, steigt mit $n$', 'proportional zu $(2n + 1)$, wie bei $x^2$'], a:0, ex:'$\\langle n|\\hat x^3|n\\rangle = 0$. Der kubische Term wirkt erst in zweiter Ordnung, und dort senkt er alle Niveaus.'},
        {q:'Warum zeigt der Grundzustand des Wasserstoffs keinen linearen Stark-Effekt?', opts:['Er ist nicht entartet und hat gerade Parität: $\\langle z\\rangle = 0$.', 'Das Feld wirkt nur auf angeregte Zustände des Atoms.', 'Er ist kugelsymmetrisch, also ist $\\hat H\' = 0$.'], a:0, ex:'$\\hat H\' = e\\mathcal E\\hat z$ ist nicht null; nur sein Erwartungswert verschwindet. Die zweite Ordnung bleibt.'}
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
