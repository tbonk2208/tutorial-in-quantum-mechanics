/* ===== Thema 7: Harmonischer Oszillator ===== */
/* Skizzen (SKIZZE.md): Oszillator-Eigenfunktionen in x/x0 mit x0 = sqrt(ħ/(mω)), aus der Hermite-Rekursion H_{k+1} = 2ξH_k − 2kH_{k−1};
   normiert ψ_n = H_n(ξ) e^{−ξ²/2}/sqrt(2^n n! √π). Kontrolle: ψ_3 hat Knoten bei 0, ±sqrt(3/2); |ψ_5|²: äußere/innere Spitze = 0,316/0,194 ≈ 1,64. */
const OSZ_SK = (() => {
  const herm = (n, x) => { let h0 = 1, h1 = 2 * x; if (n === 0) return h0; for (let k = 1; k < n; k++){ const h2 = 2 * x * h1 - 2 * k * h0; h0 = h1; h1 = h2; } return h1; };
  const fac = n => n <= 1 ? 1 : n * fac(n - 1);
  const psi = n => x => herm(n, x) * Math.exp(-x * x / 2) / Math.sqrt(Math.pow(2, n) * fac(n) * Math.sqrt(Math.PI));
  return {psi, rho:n => x => psi(n)(x) ** 2, xt:n => Math.sqrt(2 * n + 1),
    T:[{x:0, lab:'0'}, {x:0.5, lab:'T/2'}, {x:1, lab:'T'}, {x:1.5, lab:'3T/2'}, {x:2, lab:'2T'}]};
})();
const OSZ_MAT = (extra) => Object.assign({rep:'mat', mat:{preset:'osc'}, coords:['t'], params:{m:'pos', ω:'pos', n:{int:[0, 5]}}, sumFrom:0}, extra || {});
const OSZ_POS = (extra) => Object.assign({coords:['x'], params:{m:'pos', ω:'pos'}, defs:{'ψ_0(x)':'(m ω/(π ħ))^(1/4) e^(-m ω x^2/(2ħ))', 'V(x)':'1/2 m ω^2 x^2'}, normalized:true, state:'ψ_0'}, extra || {});
const OSZ_GROUND = () => ({coords:['x'], params:{m:'pos', ω:'pos'}, defs:{'ψ_0(x)':'A e^(-m ω x^2/(2ħ))', 'V(x)':'1/2 m ω^2 x^2'},
  unknowns:{A:{ref:'(m ω/(π ħ))^(1/4)', alt:['-(m ω/(π ħ))^(1/4)']}, β:{ref:'-m ω/ħ', kind:'real'}}});
const OSZ_XI = () => ({coords:['ξ'], params:{}, abstract:{h:{args:['ξ']}}});
const OSZ_PSI1 = () => ({coords:['x'], params:{m:'pos', ω:'pos'}, defs:{'ψ_1(x)':'(4/π)^(1/4) (m ω/ħ)^(3/4) x e^(-m ω x^2/(2ħ))', 'V(x)':'1/2 m ω^2 x^2'}, normalized:true, state:'ψ_1'});
topic({
  id:'osz', math:['m-spezial', 'm-analysis'], title:'Harmonischer Oszillator', short:'Oszillator',
  src:'Griffiths & Schroeter Kap. 2 · Nolting 5/1 Kap. 4 · Schwabl Kap. 3',
  goals:[
    'Ich kann mit den Leiteroperatoren $\\hat a$, $\\hat a^\\dagger$ rechnen und daraus das Spektrum $E_n = \\hbar\\omega(n + \\tfrac12)$ begründen.',
    'Ich kann den Grundzustand aus $\\hat a\\psi_0 = 0$ bestimmen und Erwartungswerte wie $\\langle x^2\\rangle$, $\\langle T\\rangle$, $\\langle V\\rangle$ berechnen.',
    'Ich kann Matrixelemente $\\langle m|\\hat x|n\\rangle$ ausrechnen und die Zeitentwicklung von $\\langle x\\rangle$ angeben.'
  ],
  needs:'Kommutatoren, besonders $[\\hat x,\\hat p] = i\\hbar$ · Gauß-Integrale · Dirac-Notation',
  wozu:'Fast jedes System nahe einer stabilen Gleichgewichtslage ist ein harmonischer Oszillator: die Schwingung zweier Atome in einem Molekül, die Gitterschwingungen eines Kristalls, jede Mode des elektromagnetischen Feldes. Die Infrarotspektroskopie misst die Schwingungsquanten $\\hbar\\omega$ von Molekülen und erkennt daran Bindungen – bei Chlorwasserstoff etwa bei $\\lambda \\approx 3{,}5\\,\\mu\\mathrm m$. Die Rechenmethode mit Leiteroperatoren kehrt beim Drehimpuls und in der Quantenfeldtheorie wieder.',
  bridge:'Aus Thema 6 brauchst du Dirac-Schreibweise, Kommutatoren, hermitesche Operatoren und $[\\hat x,\\hat p] = i\\hbar$, aus Thema 2 stationäre Zustände und ihre Zeitentwicklung. Knoten und das Abklingen im klassisch verbotenen Bereich kennst du aus Thema 3 und 5. Neu ist, ein Spektrum rein algebraisch herzuleiten.',
  diag:[
    {q:'Wie beginnst du, um $\\langle n|\\hat x^2|n\\rangle$ zu berechnen?', opts:['$\\hat x$ durch $\\hat a$ und $\\hat a^\\dagger$ ausdrücken und ausmultiplizieren', '$\\psi_n(x)$ als Potenzreihe ansetzen und die Gleichung lösen', '$\\langle n|\\hat x|n\\rangle$ berechnen und das Ergebnis quadrieren'], a:0,
      ex:'Mit $\\hat x = \\sqrt{\\hbar/(2m\\omega)}\\,(\\hat a + \\hat a^\\dagger)$ zählt man nur die Wege auf der Leiter, die zu $|n\\rangle$ zurückführen. $\\langle x\\rangle^2$ ist nicht $\\langle x^2\\rangle$; hier ist $\\langle x\\rangle = 0$, aber $\\langle x^2\\rangle > 0$. (Wer $E_n$ kennt, kommt auch mit dem Virialsatz zum Ziel.)'},
    {q:'Ein Oszillator startet im Zustand $(|0\\rangle + |1\\rangle)/\\sqrt2$. Wie beginnst du, um $\\langle x\\rangle(t)$ zu bestimmen?', opts:['Jeden Anteil mit seinem Phasenfaktor $e^{-iE_nt/\\hbar}$ versehen', 'Die klassische Lösung $x(t) = A\\cos(\\omega t)$ einsetzen', '$\\langle x\\rangle$ bei $t = 0$ berechnen; der Wert bleibt konstant'], a:0,
      ex:'Jeder Eigenzustand bekommt seine eigene Phase (Thema 2). Weil die Phasen verschieden sind, entsteht im Mischterm $e^{\\pm i\\omega t}$, und $\\langle x\\rangle$ schwingt. Konstant wäre $\\langle x\\rangle$ nur in einem stationären Zustand.'}
  ],
  phenomenon:{
    title:'Wasserstoff und Deuterium',
    text:'Ein H₂-Molekül und ein D₂-Molekül (Deuterium: Kern aus Proton und Neutron) haben dieselben Elektronen. Deshalb ist ihre Potentialkurve $V(R)$ als Funktion des Kernabstands $R$ in sehr guter Näherung dieselbe: gleich tiefe Mulde, gleiche Krümmung. D₂ ist aber etwa doppelt so schwer.\n\nBeide Gase werden so weit wie möglich abgekühlt. Dann misst man, wie viel Energie man zuführen muss, um ein Molekül in zwei Atome zu zerlegen (Dissoziationsenergie).',
    q:{q:'Welches Molekül braucht mehr Energie zur Dissoziation?', opts:['Beide gleich viel – die Mulde ist ja gleich tief.', 'D₂ – es sitzt tiefer in der Mulde.', 'H₂ – leichtere Kerne sind fester gebunden.'], a:1,
      ex:'D₂ braucht mehr, weil seine Nullpunktsenergie kleiner ist.',
      fb:['So wäre es klassisch: Ein abgekühltes Molekül ruhte im Minimum, und beide bräuchten genau die Muldentiefe. Quantenmechanisch bleibt aber eine Nullpunktsenergie – und die hängt von der Masse ab.',
        'Richtig. Das schwerere D₂ schwingt langsamer, denn $\\omega = \\sqrt{k/\\mu}$. Seine Nullpunktsenergie ist kleiner, es liegt tiefer unter der Dissoziationsgrenze.',
        'Die Bindung selbst – die Mulde – ist für beide gleich. Der Unterschied liegt in der Nullpunktsenergie, und die ist beim leichteren H₂ größer, nicht kleiner.']},
    reveal:'Gemessen werden etwa $4{,}48\\,\\mathrm{eV}$ für H₂ und $4{,}56\\,\\mathrm{eV}$ für D₂. Der Unterschied von rund $0{,}08\\,\\mathrm{eV}$ ist in harmonischer Näherung die Differenz der Nullpunktsenergien $\\tfrac12\\hbar\\omega$. Mit gleichem $k$ und doppelter reduzierter Masse ist $\\omega_{\\mathrm{D_2}} \\approx \\omega_{\\mathrm{H_2}}/\\sqrt2$. Für H₂ ist $\\tfrac12\\hbar\\omega \\approx 0{,}27\\,\\mathrm{eV}$, für D₂ etwa $0{,}19\\,\\mathrm{eV}$.\n\nEin Molekül kann also auch bei $T \\to 0$ nicht ruhen. In diesem Thema leitest du her, warum die tiefste Energie eines Oszillators $\\tfrac12\\hbar\\omega$ ist und nicht null.'
  },
  teach:(() => { const R = String.raw; return [
    /* ===== Abschnitt 1: Parabel, klassischer Oszillator, Hamilton-Operator, Einheiten ===== */
    {id:'osz-t1', title:'Warum gerade die Parabel?', steps:[
      {id:'osz-t1a', title:'Jedes Minimum ist nahe bei sich eine Parabel',
        pre:{from:'m-analysis', seg:'ma-t1', title:'Taylor-Entwicklung', text:R`Nahe $x_0$ ist $f(x) \approx f(x_0) + f'(x_0)(x - x_0) + \tfrac12f''(x_0)(x - x_0)^2$. Mini-Beispiel: $\cos x \approx 1 - x^2/2$ bei $x_0 = 0$; für $x = 0{,}3$ gibt das $0{,}955$ statt exakt $0{,}9553$.`},
        num:{title:'Ein periodisches Potential', text:R`$V(x) = -V_0\cos(x/b)$ beschreibt, bis auf eine Konstante, ein Atom in einem Lichtgitter, also in einer stehenden Lichtwelle. Bei $x = 0$ ist $V' = 0$ und $V'' = V_0/b^2$. Also

$$V(x) \approx -V_0 + \tfrac12\,\frac{V_0}{b^2}\,x^2.$$

Mit $V_0 = 1$, $b = 1$ und $x = 0{,}3$: exakt $-0{,}9553$, genähert $-1 + 0{,}045 = -0{,}955$.`},
        text:R`Fast jedes System, das um eine stabile Gleichgewichtslage schwingt, ist bei kleinen Auslenkungen ein harmonischer Oszillator. Der Grund ist die [[lex:taylor|Taylor-Entwicklung]]. Hat $V(x)$ bei $x_{\min}$ ein Minimum, so ist dort $V'(x_{\min}) = 0$, und es bleibt

$$V(x) \approx V(x_{\min}) + \tfrac12V''(x_{\min})\,(x - x_{\min})^2.$$

Die Konstante verschiebt nur den Energienullpunkt. Mit der Federkonstanten $k = V''(x_{\min}) > 0$ und $\omega = \sqrt{k/m}$ wird daraus $V = \tfrac12m\omega^2x^2$, wenn man $x$ ab dem Minimum misst. So beschreibt man Molekülschwingungen, Gitterschwingungen in Kristallen und jede Mode des Lichtfelds in einem Hohlraum.`,
        q:{q:R`Ein Potential hat bei $x_{\min}$ ein Minimum mit $V''(x_{\min}) = k$. Welche Kreisfrequenz hat die kleine Schwingung eines Teilchens der Masse $m$?`,
          opts:[R`$k/m$`, R`$\sqrt{k/m}$`, R`$\sqrt{km}$`], a:1,
          ex:R`$V \approx \tfrac12k(x - x_{\min})^2$ ist eine Feder mit Federkonstante $k$, also $\omega = \sqrt{k/m}$.`,
          fb:[R`$k/m$ hat die Einheit $1/\mathrm s^2$. Die Kreisfrequenz ist die Wurzel daraus.`, '',
            R`$\sqrt{km}$ hat die Einheit $\mathrm{kg/s}$, keine Frequenz.`]}},
      {id:'osz-t1b', title:'Klassisch: Schwingung und Aufenthaltsdichte',
        num:{title:'Amplitude 1', text:R`Mit $A = 1$ ist $\rho_\text{kl}(0) = 1/\pi \approx 0{,}32$ und $\rho_\text{kl}(0{,}9) = 1/(\pi\sqrt{0{,}19}) \approx 0{,}73$. Nahe dem Umkehrpunkt ist die Dichte mehr als doppelt so groß wie in der Mitte, denn dort ist das Teilchen langsam.`},
        text:R`**Klassisch** schwingt das Teilchen als $x(t) = A\cos(\omega t)$ mit der Energie $E = \tfrac12m\omega^2A^2$. Jede Energie $E \ge 0$ ist möglich, auch $E = 0$: Das Teilchen ruht im Minimum. Zwischen den Umkehrpunkten $\pm A$ hält es sich dort am längsten auf, wo es langsam ist, also am Rand. Die klassische Aufenthaltsdichte ist

$$\rho_\text{kl}(x) = \frac{1}{\pi\sqrt{A^2 - x^2}},\qquad |x| < A.$$

Sie wird an den Umkehrpunkten unendlich, ist aber normiert. Im Labor ist sie gestrichelt eingezeichnet. Das Bild zeigt sie für $A = 1$.`,
        plot:{x:[-1.2, 1.2], y:[0, 2.5], xlab:'x/A', ylab:R`\rho_\text{kl}`, f:x => Math.abs(x) < 0.995 ? 1 / (Math.PI * Math.sqrt(1 - x * x)) : NaN, lab:R`\rho_\text{kl}`,
          cap:R`Klassische Aufenthaltsdichte: am kleinsten in der Mitte, unendlich an den Umkehrpunkten $\pm A$, null außerhalb.`},
        q:{q:R`Wo hält sich ein klassischer Oszillator am längsten auf?`,
          opts:[R`bei $x = 0$, wo die Kraft null ist`, R`nahe den Umkehrpunkten`, R`überall gleich lange`], a:1,
          ex:R`Die Aufenthaltsdauer in einem Stück $dx$ ist $dx/|v|$. Nahe den Umkehrpunkten ist $v$ klein.`,
          fb:[R`Bei $x = 0$ ist das Teilchen am schnellsten und hält sich dort am kürzesten auf.`, '',
            R`Die Geschwindigkeit hängt vom Ort ab; deshalb ist die Dichte ungleichmäßig.`]}},
      {id:'osz-t1c', title:'Quantenmechanisch: der Hamilton-Operator',
        pre:{from:'sg', seg:'sg-t3', title:'Stationäre Zustände', text:R`Ein stationärer Zustand erfüllt $\hat H\psi = E\psi$ und ändert sich mit der Zeit nur um den Faktor $e^{-iEt/\hbar}$. Seine Dichte $|\psi|^2$ bleibt fest. Mini-Beispiel: der Grundzustand $\psi_1$ im Kasten mit der Energie $E_1$.`},
        num:{title:'Eine Gauß-Funktion zum Ausprobieren', text:R`Mit $\hbar = m = \omega = 1$ ist $\hat H = -\frac12\frac{d^2}{dx^2} + \frac12x^2$. Für $\psi = e^{-x^2/2}$ ist $\psi'' = (x^2 - 1)\,e^{-x^2/2}$, also

$$\hat H\psi = -\tfrac12(x^2 - 1)\,e^{-x^2/2} + \tfrac12x^2\,e^{-x^2/2} = \tfrac12\,\psi.$$

Die Gauß-Funktion ist Eigenfunktion zur Energie $\tfrac12$, also $\tfrac12\hbar\omega$.`},
        text:R`**Quantenmechanisch** lautet der [[lex:hamilton|Hamilton-Operator]]

$$\hat H = \frac{\hat p^2}{2m} + \frac12m\omega^2\hat x^2.$$

Gesucht sind die stationären Zustände, also die Lösungen von $\hat H\psi = E\psi$ (Thema 2). Das Beispiel hat eine davon erraten. Ob es noch tiefere gibt und welche höheren es gibt, sagt es nicht. Man kann die Differentialgleichung direkt lösen; Abschnitt 5 skizziert das. Eleganter ist eine algebraische Methode, die nur $[\hat x,\hat p] = i\hbar$ benutzt. Ihr gehören die Abschnitte 2 bis 4.`,
        q:{q:R`Was folgt aus dem Beispiel mit der Gauß-Funktion?`,
          opts:[R`Alle Eigenwerte sind ganzzahlige Vielfache von $\tfrac12\hbar\omega$.`, R`Es gibt einen Eigenzustand mit $E = \tfrac12\hbar\omega$.`, R`Der Grundzustand hat $E = 0$; die Gauß-Funktion ist angeregt.`], a:1,
          ex:R`Ein erratener Eigenzustand zeigt nur, dass diese Energie vorkommt. Das ganze Spektrum liefert erst die algebraische Methode der nächsten Abschnitte.`,
          fb:[R`Aus einem einzigen Beispiel folgt nichts über alle Eigenwerte.`, '',
            R`Dass es keinen Zustand unter $\tfrac12\hbar\omega$ gibt, zeigt Abschnitt 3. Das Beispiel allein sagt dazu nichts – und $E = 0$ ist sogar ausgeschlossen.`]}},
      {id:'osz-t1d', title:'Natürliche Einheiten als Probe',
        num:{title:'Ein Elektron mit ħω = 1 eV', text:R`Für ein Elektron mit $\hbar\omega = 1\,\mathrm{eV}$ ist die Oszillatorlänge

$$\begin{aligned}x_0 &= \sqrt{\frac{\hbar}{m\omega}} = \frac{\hbar}{\sqrt{m\,\hbar\omega}}\\ &= \frac{1{,}055\cdot10^{-34}\,\mathrm{J\,s}}{\sqrt{9{,}11\cdot10^{-31}\,\mathrm{kg}\cdot1{,}60\cdot10^{-19}\,\mathrm J}}\\ &\approx 0{,}28\,\mathrm{nm}.\end{aligned}$$`},
        text:R`**Natürliche Einheiten.** Aus $m$, $\omega$ und $\hbar$ lassen sich genau eine Länge und eine Energie bilden:

$$x_0 = \sqrt{\frac{\hbar}{m\omega}}\quad\text{(Oszillatorlänge)},\qquad \hbar\omega\quad\text{(Energiequant)}.$$

Jedes Ergebnis muss sich in diesen Einheiten schreiben lassen. Das ist eine gute Probe: $\langle x^2\rangle$ muss ein Vielfaches von $\hbar/(m\omega)$ sein. Ein Ergebnis wie $\hbar/(m\omega^2)$ hat die falsche Einheit und kann nicht stimmen. Im Labor sind die Achsen genau in diesen Einheiten geteilt: $x$ in $x_0$, $E$ in $\hbar\omega$.`,
        q:{q:R`Welcher Ausdruck hat die Einheit einer Länge?`,
          opts:[R`$\hbar/(m\omega)$`, R`$\sqrt{\hbar m/\omega}$`, R`$\sqrt{\hbar/(m\omega)}$`], a:2,
          ex:R`$\hbar/(m\omega)$ hat die Einheit $\mathrm{J\,s}/(\mathrm{kg\,s^{-1}}) = \mathrm m^2$, die Wurzel also Meter.`,
          fb:[R`Das ist eine Länge zum Quadrat. Erst die Wurzel ist eine Länge.`,
            R`$\hbar m/\omega$ hat die Einheit $\mathrm{kg^2\,m^2}$; die Wurzel hat die Einheit $\mathrm{kg\,m}$, Masse mal Länge, keine Länge.`, '']}}
    ]},

    /* ===== Abschnitt 2: Leiteroperatoren ===== */
    {id:'osz-t2', title:'Faktorisieren: vom Kommutator zu den Leiteroperatoren', steps:[
      {id:'osz-t2a', title:'Die Idee: eine Summe von Quadraten zerlegen',
        pre:{from:'m-komplex', seg:'mk-t1', title:'Konjugiertes Produkt', text:R`Für reelle $a$ und $b$ ist $(a - ib)(a + ib) = a^2 + b^2$, denn $-i^2b^2 = +b^2$. Mini-Beispiel: $(3 - 4i)(3 + 4i) = 9 + 16 = 25$.`},
        num:{title:'Mit Zahlen statt Operatoren', text:R`Mit $\hbar = m = \omega = 1$ ist die klassische Energie $E = \tfrac12(p^2 + x^2)$. Für $x = 1$ und $p = 2$ ist $E = \tfrac52$. Zerlegt:

$$\tfrac12(x - ip)(x + ip) = \tfrac12(1 - 2i)(1 + 2i) = \tfrac12\cdot5 = \tfrac52.$$

Für Zahlen geht die Zerlegung ohne Rest auf.`},
        text:R`Für Zahlen gilt $u^2 + v^2 = (u - iv)(u + iv)$. Diracs Idee: Man zerlegt $\hat H = \frac{1}{2m}\left[\hat p^2 + (m\omega\hat x)^2\right]$ genauso in zwei Faktoren. Dazu definiert man die [[lex:leiteroperatoren|Leiteroperatoren]]

$$\hat a = \sqrt{\frac{m\omega}{2\hbar}}\left(\hat x + \frac{i}{m\omega}\hat p\right),\qquad \hat a^\dagger = \sqrt{\frac{m\omega}{2\hbar}}\left(\hat x - \frac{i}{m\omega}\hat p\right),$$

gelesen „a“ und „a dagger“. Der Vorfaktor macht beide dimensionslos. Mit $\hbar = m = \omega = 1$ ist einfach $\hat a = (\hat x + i\hat p)/\sqrt2$. Das Beispiel zeigt die Idee mit Zahlen. Ob sie auch für Operatoren aufgeht, prüfst du in zwei Schritten: Dort vertauschen $\hat x$ und $\hat p$ nicht, und genau das hinterlässt einen Rest.`,
        q:{q:R`Was ist $\hat a^\dagger$ in Einheiten mit $\hbar = m = \omega = 1$?`,
          opts:[R`$(\hat x + i\hat p)/\sqrt2$`, R`$(\hat x - i\hat p)/\sqrt2$`, R`$(\hat x - \hat p)/\sqrt2$`], a:1,
          ex:R`$\sqrt{m\omega/2\hbar} = 1/\sqrt2$ und $i/(m\omega) = i$. In $\hat a^\dagger$ steht das Minus vor $i\hat p$.`,
          fb:[R`Das ist $\hat a$. Der Dagger kehrt das Vorzeichen vor $i\hat p$ um.`, '',
            R`Das $i$ gehört dazu. Ohne es fiele der Kommutator später weg.`]}},
      {id:'osz-t2b', title:'Der Dagger: die adjungierte Form',
        pre:{from:'form', seg:'form-t2', title:'Adjungierter Operator', text:R`Der adjungierte Operator erfüllt $\langle\phi|\hat A\psi\rangle = \langle\hat A^\dagger\phi|\psi\rangle$. Zahlenfaktoren werden konjugiert: $(c\hat A)^\dagger = c^*\hat A^\dagger$. Hermitesch heißt $\hat A^\dagger = \hat A$, so wie bei $\hat x$ und $\hat p$. Mini-Beispiel: $(2i\,\hat x)^\dagger = -2i\,\hat x$.`},
        num:{title:'Adjungieren Term für Term', text:R`$(\hat x + 2i\hat p)^\dagger = \hat x^\dagger + (2i)^*\hat p^\dagger = \hat x - 2i\hat p$, weil $\hat x$ und $\hat p$ hermitesch sind. Ebenso wird aus $(\hat x + i\hat p)/\sqrt2$ der Operator $(\hat x - i\hat p)/\sqrt2$: aus $\hat a$ wird $\hat a^\dagger$.`},
        text:R`Weil $\hat x$ und $\hat p$ [[lex:hermitescher-operator|hermitesch]] sind, ist $\hat a^\dagger$ wirklich die Adjungierte von $\hat a$. Beim Adjungieren bleiben $\hat x$ und $\hat p$ stehen, und nur der Zahlenfaktor $i$ wird zu $-i$. Daraus folgt sofort: $\hat a$ selbst ist nicht hermitesch, denn $\hat a^\dagger \ne \hat a$. Diese Unterscheidung wird wichtig. In der Rechnung zur Leiter ziehst du $\hat a^\dagger$ aus dem Ket in den Bra und machst dort wieder $\hat a$ daraus.`,
        q:{q:R`Welche Aussage über $\hat a$ stimmt?`,
          opts:[R`$\hat a = \hat a^\dagger$, weil $\hat x$ und $\hat p$ hermitesch sind`, R`$\hat a^\dagger = -\hat a$, wie bei $i\hat x$`, R`$\hat a^\dagger$ ist $\hat a$ mit $i \to -i$, also $\hat a^\dagger \ne \hat a$`], a:2,
          ex:R`Adjungieren konjugiert den Faktor $i$ vor $\hat p$. Der Summand $\hat x$ bleibt, deshalb ist $\hat a^\dagger$ weder $\hat a$ noch $-\hat a$.`,
          fb:[R`Hermitesch sind die Bausteine, nicht ihre Kombination mit dem Faktor $i$.`,
            R`$\hat x$ wechselt beim Adjungieren sein Vorzeichen nicht. Nur der Term mit $i$ tut es.`, '']}},
      {id:'osz-t2c', title:'Ausmultiplizieren: Der Kommutator bleibt übrig',
        pre:{from:'form', seg:'form-t6', title:'Kommutator', text:R`Der Kommutator $[\hat A, \hat B] = \hat A\hat B - \hat B\hat A$ misst, wie sehr die Reihenfolge zählt. Für Ort und Impuls gilt $[\hat x, \hat p] = i\hbar$. Mini-Beispiel: $[\hat x, \hat p]f = x(-i\hbar f') - (-i\hbar)(xf)' = i\hbar f$.`},
        num:{title:'Mit Operatoren, ħ = m = ω = 1', text:R`$\hat a^\dagger\hat a = \tfrac12(\hat x - i\hat p)(\hat x + i\hat p) = \tfrac12\left(\hat x^2 + \hat p^2 + i\hat x\hat p - i\hat p\hat x\right) = \tfrac12(\hat x^2 + \hat p^2) + \tfrac i2[\hat x, \hat p].$

Mit $[\hat x, \hat p] = i$ ist $\tfrac i2\cdot i = -\tfrac12$. Also $\hat a^\dagger\hat a = \hat H - \tfrac12$, nicht $\hat H$.`},
        text:R`Beim Ausmultiplizieren von $\hat a^\dagger\hat a$ darfst du die Reihenfolge nicht vertauschen. Es bleiben zwei Mischterme $\hat x\hat p$ und $\hat p\hat x$ übrig. Bei Zahlen höben sie sich weg. Bei Operatoren ergeben sie den [[lex:kommutator|Kommutator]] $[\hat x,\hat p] = i\hbar$. Die Herleitung zeigt das Zeile für Zeile; im Rechenblatt schreibst du die Operatoren ohne Dach. Ergebnis:

$$\hat a^\dagger\hat a = \frac{\hat H}{\hbar\omega} - \frac12.$$

Das $-\tfrac12$ ist der einzige Unterschied zur Rechnung mit Zahlen. Es stammt genau aus dem Kommutator.`,
        derive:{ctx:OSZ_MAT(), lines:[
          {l:'a† a = mω/(2ħ) (x - i/(mω) p)(x + i/(mω) p)', w:'Definitionen eingesetzt',
            why:{q:'Warum steht $\\hat a^\\dagger$ links?', opts:['So ist $\\hat a^\\dagger\\hat a$ definiert; die Reihenfolge zählt.', 'Die Reihenfolge ist egal, es sind Faktoren.', 'Weil $\\hat a^\\dagger$ hermitesch ist und vorn steht.'], a:0, ex:'Operatoren vertauschen im Allgemeinen nicht. $\\hat a\\hat a^\\dagger$ ist ein anderer Operator, nämlich $\\hat a^\\dagger\\hat a + 1$.'}},
          {l:'= mω/(2ħ) (x^2 + p^2/(m^2 ω^2) + i/(mω) (x p - p x))', w:'ausmultipliziert, Reihenfolge beibehalten',
            why:{q:'Woher kommen die beiden Mischterme?', opts:['Aus $\\frac{i}{m\\omega}\\hat x\\hat p$ und $-\\frac{i}{m\\omega}\\hat p\\hat x$', 'Aus der Normierung von $\\hat a$', 'Aus $\\hat x^2 + \\hat p^2$ durch Umstellen'], a:0, ex:'$(\\hat x - i\\hat p/m\\omega)(\\hat x + i\\hat p/m\\omega)$ hat vier Terme. Die beiden gemischten behalten ihre Reihenfolge.'}},
          {l:'= mω/(2ħ) (x^2 + p^2/(m^2 ω^2) + i/(mω) [x, p])', w:'Mischterme als Kommutator geschrieben',
            why:{q:'Was steht in der letzten Klammer?', opts:['der Kommutator $[\\hat x,\\hat p] = i\\hbar$', 'null, weil $\\hat x\\hat p = \\hat p\\hat x$', 'der Antikommutator $\\hat x\\hat p + \\hat p\\hat x$'], a:0, ex:'$\\hat x\\hat p - \\hat p\\hat x = [\\hat x,\\hat p] = i\\hbar$ – das ist der einzige quantenmechanische Eingriff in die Rechnung.'}},
          {l:'= mω/(2ħ) x^2 + p^2/(2m ħ ω) - 1/2', w:'[x̂, p̂] = iħ eingesetzt',
            why:{q:'Woher kommt $-\\tfrac12$?', opts:['$\\frac{m\\omega}{2\\hbar}\\cdot\\frac{i}{m\\omega}\\cdot i\\hbar = -\\frac12$', '$\\frac{m\\omega}{2\\hbar}\\cdot\\frac{1}{m\\omega}\\cdot\\hbar = \\frac12$, Vorzeichen frei', 'aus der Nullpunktsenergie, die man einsetzt'], a:0, ex:'$i\\cdot i = -1$. Das Vorzeichen ist wichtig: Es führt zu $+\\tfrac12$ in $\\hat H$.'}}
        ]},
        q:{q:R`Was wäre $\hat a^\dagger\hat a$, wenn $\hat x$ und $\hat p$ vertauschten?`,
          opts:[R`$\hat H/(\hbar\omega) - \tfrac12$, wie vorher`, R`$\hat H/(\hbar\omega) + \tfrac12$, mit anderem Vorzeichen`, R`$\hat H/(\hbar\omega)$, ohne den Term $-\tfrac12$`], a:2,
          ex:R`Das $-\tfrac12$ kommt allein aus $[\hat x,\hat p] = i\hbar$. Ohne Kommutator gäbe es keine Nullpunktsenergie – wie klassisch.`,
          fb:[R`Der Term $-\tfrac12$ entsteht nur aus dem Kommutator. Ist er null, fällt der Term weg.`,
            R`Ein Vorzeichenwechsel ergäbe sich auch nicht. Ohne Kommutator bleibt gar kein Zusatzterm.`, '']}},
      {id:'osz-t2d', title:'Der Hamilton-Operator mit Leiteroperatoren',
        num:{title:'Probe an der Gauß-Funktion', text:R`Mit $\hbar = m = \omega = 1$ ist $\hat a = \frac{1}{\sqrt2}\left(x + \frac{d}{dx}\right)$. Für $\psi = e^{-x^2/2}$ ist $x\psi + \psi' = x\psi - x\psi = 0$. Also $\hat a\psi = 0$, $\hat a^\dagger\hat a\psi = 0$ und

$$\hat H\psi = \hbar\omega\left(0 + \tfrac12\right)\psi = \tfrac12\psi,$$

dieselbe Energie wie in Abschnitt 1.`},
        text:R`Nach $\hat H$ aufgelöst heißt das Ergebnis

$$\hat H = \hbar\omega\left(\hat a^\dagger\hat a + \tfrac12\right).$$

Das $\tfrac12$ ist kein Rechentrick, sondern stammt aus dem Kommutator. Wären $\hat x$ und $\hat p$ vertauschbar wie klassische Zahlen, fehlte es. Darin steckt schon die [[lex:nullpunktsenergie|Nullpunktsenergie]]. Genauso rechnest du den Kommutator der Leiteroperatoren aus; nur die gemischten Terme tragen bei:

$$[\hat a,\hat a^\dagger] = 1,\qquad\text{also}\qquad \hat a\hat a^\dagger = \hat a^\dagger\hat a + 1.$$

Diese Regel brauchst du in jeder weiteren Rechnung.`,
        derive:{ctx:OSZ_MAT(), lines:[
          {l:'a† a = mω/(2ħ) x^2 + p^2/(2m ħ ω) - 1/2', w:'Ergebnis des letzten Schritts'},
          {l:'= H/(ħω) - 1/2', w:'½mω²x̂² und p̂²/2m durch ħω geteilt',
            why:{q:'Warum sind die beiden ersten Terme $\\hat H/(\\hbar\\omega)$?', opts:['Weil sie $\\tfrac12m\\omega^2\\hat x^2$ und $\\hat p^2/2m$ sind, je geteilt durch $\\hbar\\omega$.', 'Weil $\\hat H$ schon als $\\hat a^\\dagger\\hat a$ definiert worden ist.', 'Weil $\\hat x^2 = \\hat p^2$ in natürlichen Einheiten immer gilt.'], a:0, ex:'$\\frac{m\\omega}{2\\hbar}\\hat x^2 = \\frac{1}{\\hbar\\omega}\\cdot\\frac12m\\omega^2\\hat x^2$ und $\\frac{\\hat p^2}{2m\\hbar\\omega} = \\frac{1}{\\hbar\\omega}\\cdot\\frac{\\hat p^2}{2m}$.'}},
          {l:'H = ħω (a† a + 1/2)', w:'nach Ĥ aufgelöst'},
          {l:'[a, a†] = mω/(2ħ) [x + i/(mω) p, x - i/(mω) p]', w:'Definitionen von â und â† eingesetzt, Vorfaktor herausgezogen'},
          {l:'= mω/(2ħ) (-i/(mω) [x, p] + i/(mω) [p, x])', w:'nur die gemischten Terme bleiben, denn [x̂, x̂] = [p̂, p̂] = 0',
            why:{q:'Warum fallen $[\\hat x, \\hat x]$ und $[\\hat p, \\hat p]$ weg?', opts:['Weil jeder Operator mit sich selbst vertauscht.', 'Weil $\\hat x$ und $\\hat p$ hermitesch sind.', 'Weil sie sich gegen den Vorfaktor wegheben.'], a:0, ex:'$[\\hat A, \\hat A] = \\hat A\\hat A - \\hat A\\hat A = 0$. Übrig bleiben die Kommutatoren von $\\hat x$ mit $\\hat p$.'}},
          {l:'= mω/(2ħ) (2ħ/(mω))', w:'[x̂, p̂] = iħ und [p̂, x̂] = −iħ eingesetzt',
            why:{q:'Warum addieren sich die beiden Terme, statt sich aufzuheben?', opts:['Weil beide Terme gleich $+\\tfrac{\\hbar}{m\\omega}$ sind.', 'Weil $[\\hat p, \\hat x] = [\\hat x, \\hat p]$ für alle Operatoren gilt.', 'Weil $i\\cdot i = +1$ ist und das Vorzeichen kippt.'], a:0, ex:'$-\\tfrac{i}{m\\omega}\\cdot i\\hbar = \\tfrac{\\hbar}{m\\omega}$ und $\\tfrac{i}{m\\omega}\\cdot(-i\\hbar) = \\tfrac{\\hbar}{m\\omega}$: $[\\hat p, \\hat x] = -[\\hat x, \\hat p]$, und auch das Vorzeichen davor ist umgekehrt. Zwei Minuszeichen geben Plus.'}},
          {l:'= 1', w:'gekürzt',
            why:{q:'Was folgt daraus für $\\hat a\\hat a^\\dagger$?', opts:['$\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a + 1$', '$\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a$', '$\\hat a\\hat a^\\dagger = 1$'], a:0, ex:'$[\\hat a,\\hat a^\\dagger] = \\hat a\\hat a^\\dagger - \\hat a^\\dagger\\hat a = 1$. Diese Regel braucht man ständig.'}}
        ]},
        q:{q:R`Was ist $\hat a\hat a^\dagger$, ausgedrückt durch $\hat H$?`,
          opts:[R`$\hat H/(\hbar\omega) - \tfrac12$`, R`$\hat H/(\hbar\omega)$, genau wie $\hat a^\dagger\hat a$`, R`$\hat H/(\hbar\omega) + \tfrac12$`], a:2,
          ex:R`$\hat a\hat a^\dagger = \hat a^\dagger\hat a + 1 = \hat H/(\hbar\omega) - \tfrac12 + 1$.`,
          fb:[R`Das ist $\hat a^\dagger\hat a$. Die andere Reihenfolge gibt $1$ mehr.`,
            R`Die Reihenfolge zählt: $\hat a\hat a^\dagger$ und $\hat a^\dagger\hat a$ unterscheiden sich um $1$.`, '']}},
      {id:'osz-t2e', title:R`Der Besetzungszahloperator $\hat N$`,
        num:{title:'Vom Eigenwert von N̂ zur Energie', text:R`Hat $\hat N = \hat a^\dagger\hat a$ den Eigenwert $\nu = 3$, so ist

$$\hat H|\nu\rangle = \hbar\omega\left(3 + \tfrac12\right)|\nu\rangle = \tfrac72\hbar\omega\,|\nu\rangle.$$

Zu $\nu = 0$ gehört $\tfrac12\hbar\omega$, zu $\nu = 1$ gehört $\tfrac32\hbar\omega$.`},
        text:R`Den Operator $\hat N = \hat a^\dagger\hat a$ nennt man Besetzungszahloperator. Er ist hermitesch, denn $(\hat a^\dagger\hat a)^\dagger = \hat a^\dagger\hat a^{\dagger\dagger} = \hat a^\dagger\hat a$. Das Eigenwertproblem von $\hat H$ ist damit auf das von $\hat N$ zurückgeführt. Hat $\hat N$ einen Eigenvektor $|\nu\rangle$ mit Eigenwert $\nu$, gelesen „Ket nü“, so ist derselbe Vektor Eigenvektor von $\hat H$ zur Energie $\hbar\omega(\nu + \tfrac12)$. Welche Werte $\nu$ annehmen kann, ist noch offen. Das klärt der nächste Abschnitt.`,
        q:{q:R`Ein Zustand hat $\hat N|\psi\rangle = 4|\psi\rangle$. Welche Energie hat er?`, tr:{from:'dirac', to:'formel'},
          opts:[R`$4\hbar\omega$`, R`$\tfrac92\hbar\omega$`, R`$\tfrac72\hbar\omega$`], a:1,
          ex:R`$\hat H = \hbar\omega(\hat N + \tfrac12)$, also $E = \hbar\omega(4 + \tfrac12)$.`,
          fb:[R`Die Nullpunktsenergie $\tfrac12\hbar\omega$ fehlt.`, '',
            R`$\tfrac12$ wird addiert, nicht abgezogen.`]}},
      {id:'osz-t2f', title:R`Typischer Fehler: $\hat a$ als Messgröße lesen`,
        num:{title:'Eine komplexe Größe', text:R`Mit Zahlen statt Operatoren wäre $a = (x + ip)/\sqrt2$ für $x = 1$ und $p = 2$ die komplexe Zahl $(1 + 2i)/\sqrt2$. Messwerte sind reell. Ebenso ist $\langle\psi|\hat a|\psi\rangle$ im Allgemeinen komplex und kein möglicher Mittelwert einer Messung.`},
        text:R`**Achtung:** $\hat a$ selbst ist *nicht* hermitesch, denn $\hat a^\dagger \ne \hat a$. Es ist keine Observable. Seine Erwartungswerte sind im Allgemeinen komplex, und $\hat a\psi$ beschreibt weder eine Messung noch einen physikalischen Vorgang. $\hat a$ ist ein Rechenwerkzeug, das Eigenzustände ineinander überführt – wie, zeigt der nächste Abschnitt. Messbar sind hermitesche Kombinationen: $\hat N = \hat a^\dagger\hat a$, $\hat x \propto \hat a + \hat a^\dagger$ und $\hat p \propto i(\hat a^\dagger - \hat a)$.`,
        q:{q:R`Ist $\hat a$ eine Observable?`,
          opts:[R`Ja, sie misst die Zahl der Schwingungsquanten.`, R`Nein, denn $\hat a^\dagger \ne \hat a$.`, R`Ja, weil $\hat x$ und $\hat p$ Observablen sind.`], a:1,
          ex:R`Observablen sind hermitesch. $\hat a$ ist es nicht. Die Zahl der Quanten misst $\hat N = \hat a^\dagger\hat a$.`,
          fb:[R`Die Zahl der Quanten misst $\hat N = \hat a^\dagger\hat a$, nicht $\hat a$.`, '',
            R`Eine Kombination hermitescher Operatoren mit dem Faktor $i$ ist im Allgemeinen nicht hermitesch.`]}}
    ]},

    /* ===== Abschnitt 3: die Leiter ===== */
    {id:'osz-t3', title:'Die Leiter: absteigen, aufsteigen – und wo sie endet', steps:[
      {id:'osz-t3a', title:R`Der Kommutator $[\hat H, \hat a]$`,
        num:{title:'Erst mit N̂', text:R`Wegen $\hat H = \hbar\omega(\hat N + \tfrac12)$ genügt $[\hat N, \hat a]$. Aus $\hat a\hat a^\dagger = \hat N + 1$ folgt

$$\hat N\hat a = \hat a^\dagger\hat a\,\hat a = (\hat a\hat a^\dagger - 1)\,\hat a = \hat a\hat N - \hat a.$$

Also $[\hat N, \hat a] = -\hat a$, und mit dem Faktor $\hbar\omega$ wird daraus $[\hat H, \hat a] = -\hbar\omega\,\hat a$.`},
        text:R`Angenommen, $\psi$ ist ein Eigenzustand von $\hat H$ mit der Energie $E$. Was ist dann $\hat a\psi$? Der Schlüssel ist der Kommutator

$$[\hat H, \hat a] = -\hbar\omega\,\hat a,\qquad [\hat H,\hat a^\dagger] = +\hbar\omega\,\hat a^\dagger.$$

Die Herleitung braucht nur $\hat H = \hbar\omega(\hat a^\dagger\hat a + \tfrac12)$ und $[\hat a,\hat a^\dagger] = 1$. Lies den Kommutator so: Schiebst du $\hat H$ an $\hat a$ vorbei nach rechts, kostet das genau $\hbar\omega$ mal $\hat a$. Für $\hat a^\dagger$ bringt es $\hbar\omega$ ein. Im nächsten Schritt wird daraus die Leiter der Energien.`,
        derive:{ctx:OSZ_MAT({params:{m:'pos', ω:'pos', n:{int:[0, 5]}, ν:{int:[0, 5]}}}), lines:[
          {l:'[H, a] = ħω [a† a, a]', w:'Ĥ eingesetzt, die Konstante ½ħω vertauscht',
            why:{q:'Wohin ist der Summand $\\tfrac12$ aus $\\hat H$ verschwunden?', opts:['Eine Zahl vertauscht mit jedem Operator.', 'Er hebt sich gegen $[\\hat a,\\hat a^\\dagger] = 1$ weg.', 'Er wird erst am Ende addiert.'], a:0, ex:'$[\\tfrac12\\hbar\\omega, \\hat a] = 0$. Nur $\\hbar\\omega\\,\\hat a^\\dagger\\hat a$ trägt bei.'}},
          {l:'= ħω (a† a a - a a† a)', w:'Kommutator ausgeschrieben'},
          {l:'= ħω [a†, a] a', w:'â rechts ausgeklammert',
            why:{q:'Warum darf man $\\hat a$ rechts ausklammern?', opts:['Weil beide Terme auf $\\hat a$ enden; die Reihenfolge bleibt.', 'Weil $\\hat a$ mit $\\hat a^\\dagger$ vertauscht und man umordnen darf.', 'Weil $\\hat a\\hat a = 0$ ist und dieser Term entfällt.'], a:0, ex:'$\\hat a^\\dagger\\hat a\\hat a - \\hat a\\hat a^\\dagger\\hat a = (\\hat a^\\dagger\\hat a - \\hat a\\hat a^\\dagger)\\hat a = [\\hat a^\\dagger,\\hat a]\\,\\hat a$.'}},
          {l:'= -ħω a', w:'[â†, â] = −1 eingesetzt',
            why:{q:'Welcher Kommutator wurde eingesetzt?', opts:['$[\\hat a^\\dagger,\\hat a] = -1$', '$[\\hat a^\\dagger,\\hat a] = +1$', '$[\\hat a^\\dagger,\\hat a] = i\\hbar$'], a:0, ex:'Vertauscht man die Argumente in $[\\hat a,\\hat a^\\dagger] = 1$, dreht sich das Vorzeichen.'}}
        ]},
        q:{q:R`Was ist $[\hat H, \hat a^2]$, also der Preis, $\hat H$ an zwei Absteigern vorbeizuschieben?`,
          opts:[R`$-\hbar\omega\,\hat a^2$, wie bei einem einzelnen $\hat a$`, R`$\hbar^2\omega^2\,\hat a^2$, das Quadrat von $-\hbar\omega$`, R`$-2\hbar\omega\,\hat a^2$`], a:2,
          ex:R`Produktregel: $[\hat H, \hat a\hat a] = [\hat H, \hat a]\,\hat a + \hat a\,[\hat H, \hat a] = -2\hbar\omega\,\hat a^2$. Jeder Absteiger kostet $\hbar\omega$.`,
          fb:[R`Es sind zwei Absteiger. Jeder kostet beim Vorbeischieben $\hbar\omega$; die Produktregel zählt beide.`,
            R`Kommutatoren werden nicht quadriert. Die Produktregel $[\hat A, \hat B\hat C] = [\hat A, \hat B]\hat C + \hat B[\hat A, \hat C]$ addiert die Beiträge.`, '']}},
      {id:'osz-t3b', title:'Eine Sprosse tiefer',
        num:{title:'Ein Zustand bei 7/2 ħω', text:R`Ist $\hat H\psi = \tfrac72\hbar\omega\,\psi$, dann ist

$$\hat H(\hat a\psi) = \left(\tfrac72 - 1\right)\hbar\omega\,\hat a\psi = \tfrac52\hbar\omega\,\hat a\psi,\qquad \hat H(\hat a^\dagger\psi) = \tfrac92\hbar\omega\,\hat a^\dagger\psi.$$`},
        text:R`Schreibt man $\hat H\hat a = \hat a\hat H + [\hat H,\hat a]$, folgt

$$\hat H(\hat a\psi) = \hat a\hat H\psi - \hbar\omega\,\hat a\psi = (E - \hbar\omega)\,(\hat a\psi).$$

Also ist $\hat a\psi$ wieder ein Eigenzustand, mit einer um $\hbar\omega$ kleineren Energie – oder der Nullvektor. Ebenso hebt $\hat a^\dagger$ die Energie um $\hbar\omega$. Daher die Namen Absteiger und Aufsteiger. Von einem einzigen Eigenzustand aus erreichst du eine ganze Leiter von Energien im Abstand $\hbar\omega$. Die Herleitung schreibt das für einen Eigenzustand $|\nu\rangle$ von $\hat N$.`,
        derive:{ctx:OSZ_MAT({params:{m:'pos', ω:'pos', n:{int:[0, 5]}, ν:{int:[0, 5]}}}), lines:[
          {l:'H a|ν⟩ = a H|ν⟩ - ħω a|ν⟩', w:'Ĥâ = âĤ + [Ĥ, â]',
            why:{q:'Woher kommt diese Zeile?', opts:['Aus $\\hat H\\hat a = \\hat a\\hat H + [\\hat H,\\hat a]$', 'Aus $\\hat H\\hat a = \\hat a\\hat H$', 'Aus der Schrödingergleichung mit Zeitableitung'], a:0, ex:'Mit $[\\hat H,\\hat a] = -\\hbar\\omega\\hat a$ wird $\\hat H\\hat a = \\hat a\\hat H - \\hbar\\omega\\hat a$. Hier ist $|\\nu\\rangle$ ein Eigenzustand von $\\hat N$ mit der Energie $E = \\hbar\\omega(\\nu + \\tfrac12)$.'}},
          {l:'H a|ν⟩ = (ν - 1/2) ħω a|ν⟩', w:'Ĥ|ν⟩ = ħω(ν + ½)|ν⟩ eingesetzt',
            why:{q:'Was bedeutet diese Zeile?', opts:['$\\hat a|\\nu\\rangle$ hat die Energie $E - \\hbar\\omega$ (oder ist null).', '$\\hat a|\\nu\\rangle$ hat dieselbe Energie wie $|\\nu\\rangle$.', 'Die Energie von $|\\nu\\rangle$ ist $(\\nu - \\tfrac12)\\hbar\\omega$.'], a:0, ex:'$(\\nu + \\tfrac12)\\hbar\\omega - \\hbar\\omega = (\\nu - \\tfrac12)\\hbar\\omega$: eine Sprosse tiefer.'}}
        ]},
        q:{q:R`$\psi$ ist Eigenzustand mit $E = \tfrac72\hbar\omega$. Was ist $\hat a\psi$?`,
          opts:[R`ein Eigenzustand zu $\tfrac92\hbar\omega$`, R`ein Eigenzustand zu $\tfrac52\hbar\omega$`, R`wieder ein Eigenzustand zu $\tfrac72\hbar\omega$`], a:1,
          ex:R`$\hat a$ senkt um $\hbar\omega$. Normiert ist $\hat a\psi$ allerdings nicht (Abschnitt 4).`,
          fb:[R`Das wäre $\hat a^\dagger\psi$, der Aufsteiger.`, '',
            R`$\hat a$ vertauscht nicht mit $\hat H$; deshalb ändert sich die Energie.`]}},
      {id:'osz-t3c', title:'Die Leiter muss unten enden',
        pre:{from:'form', seg:'form-t2', title:'Einen Operator in den Bra ziehen', text:R`$\langle\phi|\hat A\psi\rangle = \langle\hat A^\dagger\phi|\psi\rangle$. Mini-Beispiel: Für $\hat A = 2i$ ist $\langle\phi|2i\,\psi\rangle = 2i\,\langle\phi|\psi\rangle = \langle -2i\,\phi|\psi\rangle$, denn ein Faktor im Bra wird konjugiert: $(-2i)^* = 2i$.`},
        num:{title:'Ein Eigenwert 2,5?', text:R`Hätte $\hat N$ den Eigenwert $2{,}5$, gäbe Absteigen $1{,}5$, dann $0{,}5$, dann $-0{,}5$. Bei $\nu = 0{,}5$ ist aber $\|\hat a|\nu\rangle\|^2 = 0{,}5 > 0$: $\hat a|\nu\rangle$ ist kein Nullvektor, also müsste es den Eigenwert $-0{,}5$ geben. Das ist unmöglich, denn kein Eigenwert von $\hat N$ ist negativ.`},
        text:R`**Die Leiter muss unten enden.** Für jeden Zustand $\psi$ gilt

$$\langle\psi|\hat a^\dagger\hat a|\psi\rangle = \langle\hat a\psi|\hat a\psi\rangle = \|\hat a\psi\|^2 \ge 0.$$

Im ersten Schritt wird $\hat a^\dagger$ als Adjungierte in den Bra gezogen; dort wird es zu $\hat a$. Ist $\psi$ ein normierter Eigenzustand von $\hat N$ mit Eigenwert $\nu$, steht links $\nu$. Alle Eigenwerte von $\hat N$ sind also nichtnegativ. Absteigen senkt $\nu$ jedes Mal um $1$. Die Kette muss deshalb abbrechen, bevor $\nu$ negativ wird. Abbrechen heißt $\hat a\psi = 0$, und das geht nur bei $\nu = 0$. Darum ist jedes $\nu$ ganzzahlig.`,
        q:{q:R`Warum kann $\hat N$ nicht den Eigenwert $\nu = 0{,}3$ haben?`,
          opts:['Weil $\\hat N$ nur gerade ganzzahlige Eigenwerte hat.', 'Weil Absteigen einen Zustand mit $\\nu = -0{,}7$ ergäbe.', 'Weil $0{,}8\\,\\hbar\\omega$ dann unter der Energie $\\tfrac12\\hbar\\omega$ liegt.'], a:1,
          ex:R`$\|\hat a\psi\|^2 = 0{,}3 > 0$, also ist $\hat a\psi \ne 0$ ein Eigenvektor mit $\nu = -0{,}7 < 0$ – verboten.`,
          fb:[R`$\hat N$ hat alle Werte $0, 1, 2, \dots$, nicht nur gerade.`, '',
            R`$\hbar\omega(0{,}3 + \tfrac12) = 0{,}8\,\hbar\omega$ liegt über $\tfrac12\hbar\omega$. Der Widerspruch entsteht erst beim Absteigen.`]}},
      {id:'osz-t3d', title:'Grundzustand und Spektrum',
        num:{title:'Chlorwasserstoff', text:R`Die Schwingung von HCl hat $\hbar\omega \approx 0{,}36\,\mathrm{eV}$. Die ersten Niveaus:

$$E_0 \approx 0{,}18\,\mathrm{eV},\qquad E_1 \approx 0{,}54\,\mathrm{eV},\qquad E_2 \approx 0{,}90\,\mathrm{eV}.$$

Im harmonischen Modell ist der Abstand benachbarter Niveaus immer $0{,}36\,\mathrm{eV}$. Wie gut das Modell für HCl passt, zeigt Abschnitt 6.`},
        text:R`Es gibt also einen Zustand $\psi_0$ mit $\hat a\psi_0 = 0$. Für ihn ist $\hat N\psi_0 = \hat a^\dagger(\hat a\psi_0) = 0$, also $\nu = 0$ und $E_0 = \tfrac12\hbar\omega$. Steigst du von $\psi_0$ mit $\hat a^\dagger$ auf, bricht die Leiter nie ab, denn $\|\hat a^\dagger\psi\|^2 = \nu + 1 > 0$. Das ganze [[lex:oszillator-spektrum|Spektrum]] ist

$$E_n = \hbar\omega\left(n + \tfrac12\right),\qquad n = 0, 1, 2, \dots$$

Es ist äquidistant und beginnt bei der Nullpunktsenergie. In einer Dimension ist es nicht entartet: $\hat a\psi_0 = 0$ hat bis auf einen Faktor nur eine Lösung (Abschnitt 5), und jeder höhere Zustand entsteht eindeutig daraus.`,
        q:{q:R`Wie groß ist $E_3 - E_1$ bei HCl?`,
          opts:[R`$1{,}08\,\mathrm{eV}$, also $3\hbar\omega$`, R`$0{,}72\,\mathrm{eV}$`, R`$0{,}36\,\mathrm{eV}$, der Abstand benachbarter Niveaus`], a:1,
          ex:R`$E_3 - E_1 = \hbar\omega(3 - 1) = 2\hbar\omega \approx 0{,}72\,\mathrm{eV}$.`,
          fb:[R`$3\hbar\omega$ wäre $E_3 - E_0$. Hier liegen zwei Sprossen dazwischen.`, '',
            R`Zwischen $n = 1$ und $n = 3$ liegen zwei Abstände, nicht einer.`]}},
      {id:'osz-t3e', title:'Die Energieleiter in fünf Darstellungen',
        num:{title:'Eine Sprosse hinauf', text:R`Ein Molekül im Zustand $|1\rangle$ absorbiert ein Photon der Energie $\hbar\omega$. Danach ist es in $|2\rangle$, denn $E_2 - E_1 = \hbar\omega\left(\tfrac52 - \tfrac32\right) = \hbar\omega$. Im Labor stellst du dazu den Regler „Quantenzahl n“ von $1$ auf $2$: Die hervorgehobene Energielinie steigt von $1{,}5$ auf $2{,}5$.`},
        text:R`Die Tafel übersetzt die Leiter aus der Dirac-Schreibweise in Energien, ins Labor und in eine Messung. Lies die Kets als Sprossen: $|n\rangle$ ist die Sprosse mit $n$ Quanten über dem Grundzustand. $\hat a^\dagger$ und $\hat a$ sind die Schritte nach oben und unten. Die Formel $E_n = \hbar\omega(n + \tfrac12)$ gibt jeder Sprosse ihre Höhe. Im Labor ist die Leiter wörtlich zu sehen: waagerechte Linien im Abstand $1$ auf der Achse „E / ħω“, die unterste bei $\tfrac12$.`,
        reps:{obj:'Die Energieleiter des Oszillators',
          rows:[
            {k:'worte', text:R`Eine Leiter mit gleichen Abständen $\hbar\omega$ zwischen den Sprossen, die unterste bei $\tfrac12\hbar\omega$. $\hat a$ steigt eine Sprosse ab, $\hat a^\dagger$ eine auf.`},
            {k:'dirac', tex:R`\hat H|n\rangle = E_n|n\rangle,\qquad \hat a|n\rangle \propto |n-1\rangle,\qquad \hat a^\dagger|n\rangle \propto |n+1\rangle,\qquad \hat a|0\rangle = 0`},
            {k:'formel', tex:R`E_n = \hbar\omega\left(n + \tfrac12\right),\qquad E_{n+1} - E_n = \hbar\omega`},
            {k:'labor', text:R`Labor „Eigenfunktionen im Parabelpotential“: Die waagerechten Linien sind die $E_n$ auf der Achse „E / ħω“. Die Linie zum Regler „Quantenzahl n“ ist hervorgehoben; die Anzeige nennt $E_n = \hbar\omega(n + \tfrac12)$.`},
            {k:'physik', text:R`Infrarotabsorption: Übergänge $n \to n + 1$ mit der Photonenenergie $\hbar\omega$. Auch bei $T \to 0$ bleibt $E_0 = \tfrac12\hbar\omega$.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Eine Sprosse ab“ heißt $\hat a$ auf den Ket anwenden; „unterste Sprosse“ heißt $\hat a|0\rangle = 0$.`},
            {from:'dirac', to:'formel', rule:R`Jedes $\hat a^\dagger$ erhöht den Eigenwert von $\hat N$ um $1$ und die Energie um $\hbar\omega$. Von $E_0 = \tfrac12\hbar\omega$ aus aufsummieren.`},
            {from:'formel', to:'labor', rule:R`Im Labor $n$ einstellen und die hervorgehobene Linie bei $E_n/\hbar\omega = n + \tfrac12$ ablesen.`},
            {from:'labor', to:'physik', rule:R`Der Abstand benachbarter Linien ist die Energie des Photons, das einen Übergang auslöst.`}
          ]},
        q:{q:R`Auf $|0\rangle$ wirkt dreimal $\hat a^\dagger$ und danach einmal $\hat a$. Welche Energie hat der entstandene Zustand?`, tr:{from:'dirac', to:'formel'},
          opts:[R`$\tfrac72\hbar\omega$, gezählt werden nur die Aufsteiger`, R`$\tfrac52\hbar\omega$`, R`$\tfrac92\hbar\omega$, denn es wirken vier Operatoren`], a:1,
          ex:R`Drei Sprossen hinauf, eine hinab: $n = 2$, also $E = \tfrac52\hbar\omega$. Der Zustand ist $\propto|2\rangle$.`,
          fb:[R`Auch der Absteiger zählt: Er nimmt eine Sprosse wieder weg.`, '',
            R`Jeder Operator verschiebt um eine Sprosse, aber $\hat a$ nach unten.`]}},
      {id:'osz-t3f', title:'Typischer Fehler: Im Grundzustand ruht das Teilchen',
        num:{title:'Unschärfe im Grundzustand', text:R`Mit $\hbar = m = \omega = 1$ hat $\psi_0 = \pi^{-1/4}e^{-x^2/2}$ die Breiten $\Delta x = \Delta p = 1/\sqrt2$. Dann ist $\langle T\rangle = \langle p^2\rangle/2 = \tfrac14$ und $\langle V\rangle = \langle x^2\rangle/2 = \tfrac14$, zusammen $\tfrac12 = E_0$.`},
        text:R`**Typische Fehlvorstellung:** „Im Grundzustand ruht das Teilchen, also ist $E_0 = 0$.“ Die Rechnung zeigt das Gegenteil. $\hat a\psi_0 = 0$ heißt nicht $E = 0$, sondern $\hat N\psi_0 = 0$; die Energie $\tfrac12\hbar\omega$ bleibt. Dasselbe folgt aus der [[lex:robertson|Unschärferelation]]: Ruhe im Minimum hieße $\Delta x = 0$ und $\Delta p = 0$ zugleich. Im Grundzustand teilt sich die Energie gleichmäßig auf kinetische und potentielle Energie auf, wie das Beispiel zeigt.`,
        q:{q:R`Warum kann der Grundzustand nicht die Energie $0$ haben?`,
          opts:[R`Weil dann $\Delta x = 0$ und $\Delta p = 0$ zugleich gelten müssten.`, R`Weil $\hat a\psi_0 = 0$ gerade $E = 0$ bedeutet.`, R`Weil das Potential bei $x = 0$ nicht null ist.`], a:0,
          ex:R`$E = 0$ verlangte $\langle p^2\rangle = 0$ und $\langle x^2\rangle = 0$. Das verbietet $\Delta x\,\Delta p \ge \hbar/2$.`,
          fb:['', R`$\hat a\psi_0 = 0$ heißt $\hat N\psi_0 = 0$. Die Energie ist $\hbar\omega(0 + \tfrac12)$.`,
            R`$V(0) = 0$ ist richtig. Gerade deshalb muss die Energie aus der Unschärfe kommen.`]}}
    ]},

    /* ===== Abschnitt 4: Normierung, Matrizen, Ort und Impuls ===== */
    {id:'osz-t4', title:'Normierte Leiterzustände und Matrixelemente', steps:[
      {id:'osz-t4a', title:R`Die Faktoren $\sqrt n$ und $\sqrt{n+1}$`,
        num:{title:'n = 3', text:R`$\|\hat a|3\rangle\|^2 = \langle 3|\hat a^\dagger\hat a|3\rangle = 3$, also $\hat a|3\rangle = \sqrt3\,|2\rangle$. Und $\|\hat a^\dagger|3\rangle\|^2 = \langle 3|\hat a\hat a^\dagger|3\rangle = 3 + 1 = 4$, also $\hat a^\dagger|3\rangle = 2\,|4\rangle$.`},
        text:R`Für Rechnungen braucht man die Zahlenfaktoren. Wir schreiben $|n\rangle$ für den normierten Eigenzustand mit $\hat N|n\rangle = n|n\rangle$ ([[lex:dirac-notation|Dirac-Schreibweise]], Thema 6). Weil $\hat a|n\rangle$ proportional zu $|n-1\rangle$ ist, setzt man $\hat a|n\rangle = c_n|n-1\rangle$. Die Norm liefert $|c_n|^2 = \langle n|\hat a^\dagger\hat a|n\rangle = n$. Die Phase ist frei; man wählt $c_n = \sqrt n$. Für den Aufsteiger braucht man $\hat a\hat a^\dagger = \hat N + 1$. Zusammen:

$$\hat a|n\rangle = \sqrt n\,|n-1\rangle,\qquad \hat a^\dagger|n\rangle = \sqrt{n+1}\,|n+1\rangle,\qquad |n\rangle = \frac{(\hat a^\dagger)^n}{\sqrt{n!}}\,|0\rangle.$$

Merkhilfe: Unter der Wurzel steht immer die größere der beiden Zahlen.`,
        q:{q:R`Was ist $\hat a\,\hat a^\dagger|3\rangle$? Zuerst wirkt $\hat a^\dagger$.`,
          opts:[R`$3\,|3\rangle$`, R`$2\sqrt3\,|3\rangle$`, R`$4\,|3\rangle$`, R`$2\,|4\rangle$`], a:2,
          ex:R`$\hat a^\dagger|3\rangle = \sqrt4\,|4\rangle$, dann $\hat a|4\rangle = \sqrt4\,|3\rangle$. Zusammen $4|3\rangle$, passend zu $\hat a\hat a^\dagger = \hat N + 1$.`,
          fb:[R`Das ist $\hat a^\dagger\hat a|3\rangle = \hat N|3\rangle$. In der Reihenfolge $\hat a\hat a^\dagger$ steigst du erst auf $|4\rangle$, dann wieder ab.`,
            R`Nach dem Aufsteigen steht $|4\rangle$ da. $\hat a$ bringt dann $\sqrt4$, nicht $\sqrt3$: Unter der Wurzel steht die größere der beiden Zahlen.`,
            '',
            R`Das ist nur $\hat a^\dagger|3\rangle$. Danach wirkt noch $\hat a$ und führt zurück zu $|3\rangle$.`]}},
      {id:'osz-t4b', title:'Der Absteiger als Matrix',
        pre:{from:'m-eigen', seg:'me-t1', title:'Spalten sind Bilder', text:R`Die $j$-te Spalte einer Matrix ist das Bild des $j$-ten Basisvektors. Mini-Beispiel: $\begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}\begin{pmatrix}1\\ 0\end{pmatrix} = \begin{pmatrix}0\\ 1\end{pmatrix}$, die erste Spalte.`},
        num:{title:'Spalte für Spalte', text:R`In der Basis $|0\rangle, |1\rangle, |2\rangle, |3\rangle$ ist $\hat a|0\rangle = 0$, $\hat a|1\rangle = |0\rangle$, $\hat a|2\rangle = \sqrt2\,|1\rangle$, $\hat a|3\rangle = \sqrt3\,|2\rangle$. Die Bilder werden die Spalten:

$$\hat a \doteq \begin{pmatrix}0 & 1 & 0 & 0\\ 0 & 0 & \sqrt2 & 0\\ 0 & 0 & 0 & \sqrt3\\ 0 & 0 & 0 & 0\end{pmatrix}.$$

In der Zeile von $\langle 1|$ und der Spalte von $|2\rangle$ steht $\langle 1|\hat a|2\rangle = \sqrt2$.`},
        text:R`In der Energiebasis wird jeder Operator zur Matrix mit den Einträgen $\langle m|\hat A|n\rangle$: Der Bra wählt die Zeile, der Ket die Spalte. Für $\hat a$ stehen nur direkt über der Hauptdiagonale Einträge, nämlich $\sqrt1, \sqrt2, \sqrt3, \dots$ Die Matrix ist unendlich groß; das Beispiel zeigt die linke obere Ecke. Zeilen und Spalten zählen hier ab $n = 0$. $\hat a^\dagger$ ist die konjugiert transponierte Matrix. Weil alle Einträge reell sind, wird einfach gespiegelt: Die Einträge wandern unter die Diagonale.`,
        reps:{obj:R`Der Absteiger $\hat a$ in der Energiebasis`,
          rows:[
            {k:'worte', text:R`Nimmt jedem Zustand eine Sprosse und multipliziert mit der Wurzel der alten Quantenzahl.`},
            {k:'dirac', tex:R`\hat a|n\rangle = \sqrt n\,|n-1\rangle,\qquad \langle m|\hat a|n\rangle = \sqrt n\,\delta_{m,n-1}`},
            {k:'matrix', tex:R`\hat a \doteq \begin{pmatrix}0 & 1 & 0 & 0 & \cdots\\ 0 & 0 & \sqrt2 & 0 & \cdots\\ 0 & 0 & 0 & \sqrt3 & \cdots\\ 0 & 0 & 0 & 0 & \ddots\\ \vdots & & & & \end{pmatrix}`},
            {k:'mathe', text:R`Eine Matrix, die nur auf der ersten Nebendiagonale über der Hauptdiagonale besetzt ist. Sie ist nicht hermitesch: Ihre Adjungierte $\hat a^\dagger$ ist an der Diagonale gespiegelt.`},
            {k:'ort', tex:R`\hat a = \sqrt{\frac{m\omega}{2\hbar}}\left(x + \frac{\hbar}{m\omega}\frac{d}{dx}\right),\qquad \hat a\,\psi_n(x) = \sqrt n\,\psi_{n-1}(x)`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Eine Sprosse weg“ ist $|n\rangle \to |n-1\rangle$; der Faktor ist $\sqrt n$ aus der Norm.`},
            {from:'dirac', to:'matrix', rule:R`Spalte $n$ ist das Bild von $|n\rangle$: in Zeile $n - 1$ den Eintrag $\sqrt n$ eintragen, sonst $0$. Zeilen und Spalten ab $0$ zählen.`},
            {from:'matrix', to:'mathe', rule:R`Diagonale und Symmetrie prüfen: Steht ein Eintrag nur oberhalb der Diagonale, ist die Matrix nicht hermitesch. Spiegeln und konjugieren gibt $\hat a^\dagger$.`},
            {from:'mathe', to:'ort', rule:R`Den Basisvektor $|n\rangle$ durch die Funktion $\psi_n(x)$ ersetzen. Dieselbe Wirkung hat dann ein Differentialoperator; adjungiert wird aus $+\frac{d}{dx}$ ein $-\frac{d}{dx}$.`}
          ]},
        q:{q:R`Wo steht in der Matrix von $\hat a^\dagger$ der Eintrag $\sqrt3$?`, tr:{from:'dirac', to:'matrix'},
          opts:[R`in der Zeile von $\langle 2|$ und der Spalte von $|3\rangle$`, R`in der Zeile von $\langle 3|$ und der Spalte von $|2\rangle$`, R`auf der Diagonale, bei $\langle 3|\hat a^\dagger|3\rangle$`], a:1,
          ex:R`$\hat a^\dagger|2\rangle = \sqrt3\,|3\rangle$, also $\langle 3|\hat a^\dagger|2\rangle = \sqrt3$: Zeile $3$, Spalte $2$, unter der Diagonale.`,
          fb:[R`Das ist der Platz von $\sqrt3$ in der Matrix von $\hat a$. Beim Adjungieren wird gespiegelt.`, '',
            R`$\hat a^\dagger$ ändert $n$ um $+1$; auf der Diagonale stünde ein Eintrag, der $n$ gleich lässt.`]}},
      {id:'osz-t4c', title:'Ort und Impuls auf der Leiter',
        num:{title:R`$\hat x$ auf $|1\rangle$`, text:R`Mit $x_0 = \sqrt{\hbar/(m\omega)}$ ist $\hat x = \frac{x_0}{\sqrt2}(\hat a + \hat a^\dagger)$ und

$$\hat x|1\rangle = \frac{x_0}{\sqrt2}\left(\hat a|1\rangle + \hat a^\dagger|1\rangle\right) = \frac{x_0}{\sqrt2}\left(|0\rangle + \sqrt2\,|2\rangle\right).$$

Im Ergebnis stehen nur die Nachbarn von $|1\rangle$.`},
        text:R`Addiert und subtrahiert man die Definitionen von $\hat a$ und $\hat a^\dagger$, erhält man [[lex:osz-orts-impuls|Ort und Impuls]]:

$$\hat x = \sqrt{\frac{\hbar}{2m\omega}}\,(\hat a + \hat a^\dagger),\qquad \hat p = i\sqrt{\frac{m\omega\hbar}{2}}\,(\hat a^\dagger - \hat a).$$

Damit werden Matrixelemente zu Abzählaufgaben. $\hat x$ ändert $n$ um genau $\pm1$. Darum ist $\langle m|\hat x|n\rangle$ nur für $m = n\pm1$ von null verschieden, etwa $\langle n+1|\hat x|n\rangle = \sqrt{\hbar/(2m\omega)}\,\sqrt{n+1}$. Insbesondere ist $\langle n|\hat x|n\rangle = \langle n|\hat p|n\rangle = 0$: In keinem Eigenzustand ist der Ortsmittelwert verschoben. Die Herleitung rechnet das Beispiel nach.`,
        derive:{ctx:OSZ_MAT(), lines:[
          {l:'x|1⟩ = sqrt(ħ/(2mω)) (a + a†)|1⟩', w:'x̂ durch Leiteroperatoren ausgedrückt',
            why:{q:'Warum steht hier $\\hat a + \\hat a^\\dagger$ und kein $i$?', opts:['Weil sich die $i\\hat p$-Anteile von $\\hat a$ und $\\hat a^\\dagger$ aufheben.', 'Weil $\\hat x$ als Observable kein $i$ enthalten darf.', 'Weil $\\hat a$ und $\\hat a^\\dagger$ vertauschen und sich das $i$ kürzt.'], a:0, ex:'$\\hat a + \\hat a^\\dagger = 2\\sqrt{m\\omega/2\\hbar}\\,\\hat x$. Für $\\hat p$ braucht man die Differenz.'}},
          {l:'= sqrt(ħ/(2mω)) (a|1⟩ + a†|1⟩)', w:'auf beide Summanden verteilt'},
          {l:'= sqrt(ħ/(2mω)) (|0⟩ + sqrt(2) |2⟩)', w:'â|1⟩ = |0⟩ und â†|1⟩ = √2 |2⟩',
            why:{q:'Woher kommt der Faktor $\\sqrt2$ vor $|2\\rangle$?', opts:['$\\hat a^\\dagger|1\\rangle = \\sqrt{1 + 1}\\,|2\\rangle$', '$\\hat a|1\\rangle = \\sqrt2\\,|0\\rangle$', 'aus dem Vorfaktor $\\sqrt{\\hbar/(2m\\omega)}$'], a:0, ex:'Unter der Wurzel steht die größere der Zahlen $1$ und $2$.'}},
          {l:'⟨2|x|1⟩ = sqrt(ħ/(2mω)) sqrt(2)', w:'Komponente entlang |2⟩ abgelesen'}
        ]},
        q:{q:R`Welche Matrixelemente $\langle m|\hat x|2\rangle$ sind ungleich null?`,
          opts:['nur $m = 2$, denn $\\hat x$ misst den Ort von $|2\\rangle$', '$m = 1$ und $m = 3$, weil $\\hat x$ den Index um $\\pm1$ ändert', 'alle $m$, weil $\\psi_2$ überall von null verschieden ist'], a:1,
          ex:R`$\hat x \propto \hat a + \hat a^\dagger$ ändert $n$ um genau $\pm1$.`,
          fb:[R`$\langle 2|\hat x|2\rangle = 0$: Der Ortsmittelwert jedes Eigenzustands ist null.`, '',
            R`Dass zwei Funktionen überlappen, reicht nicht. Die Integrale $\int\psi_m\,x\,\psi_2\,dx$ verschwinden für alle anderen $m$.`]}},
      {id:'osz-t4d', title:'Der Ortsoperator als Matrix und als Integral',
        num:{title:'Ein Matrixelement als Fläche', text:R`In Einheiten $x_0 = 1$ ist $\psi_0 = \pi^{-1/4}e^{-x^2/2}$ und $\psi_1 = \sqrt2\,\pi^{-1/4}x\,e^{-x^2/2}$. Dann

$$\begin{aligned}\langle 0|\hat x|1\rangle &= \int\psi_0\,x\,\psi_1\,dx\\ &= \frac{\sqrt2}{\sqrt\pi}\int x^2e^{-x^2}dx\\ &= \frac{\sqrt2}{\sqrt\pi}\cdot\frac{\sqrt\pi}{2} = \frac{1}{\sqrt2} \approx 0{,}71.\end{aligned}$$

Dagegen ist $\langle 0|\hat x|2\rangle = 0$: Der Integrand $\psi_0\,x\,\psi_2$ ist ungerade.`},
        text:R`Die Tafel zeigt dasselbe Matrixelement in mehreren Gestalten. In der Dirac-Schreibweise ist es ein Sandwich, in der Matrix ein Eintrag, in der Ortsdarstellung ein Integral und im Bild eine Fläche mit Vorzeichen. Alle vier Wege geben dieselbe Zahl. Die Abzählregel „nur Nachbarn“ siehst du im Bild als Symmetrie: Bei $m$ und $n$ mit gleicher Parität ist der Integrand ungerade, die Fläche null. Dass auch $\langle 1|\hat x|4\rangle$ verschwindet, verrät erst die Leiter.`,
        reps:{obj:R`Der Ortsoperator $\hat x$ in der Energiebasis ($x_0 = \sqrt{\hbar/m\omega}$)`,
          rows:[
            {k:'worte', text:R`$\hat x$ verbindet jede Sprosse nur mit ihren beiden Nachbarn.`},
            {k:'dirac', tex:R`\langle m|\hat x|n\rangle = \frac{x_0}{\sqrt2}\left(\sqrt n\,\delta_{m,n-1} + \sqrt{n+1}\,\delta_{m,n+1}\right)`},
            {k:'matrix', tex:R`\hat x \doteq \frac{x_0}{\sqrt2}\begin{pmatrix}0 & 1 & 0 & 0 & \cdots\\ 1 & 0 & \sqrt2 & 0 & \cdots\\ 0 & \sqrt2 & 0 & \sqrt3 & \cdots\\ 0 & 0 & \sqrt3 & 0 & \ddots\\ \vdots & & & \ddots & \end{pmatrix}`},
            {k:'ort', tex:R`\langle m|\hat x|n\rangle = \int_{-\infty}^{\infty}\psi_m(x)\,x\,\psi_n(x)\,dx`},
            {k:'graph', plot:{x:[-3.5, 3.5], xlab:R`x/x_0`, ylab:R`\psi_0\,x\,\psi_n`}, f:x => OSZ_SK.psi(0)(x) * x * OSZ_SK.psi(1)(x), lab:R`\psi_0\,x\,\psi_1`, f2:x => OSZ_SK.psi(0)(x) * x * OSZ_SK.psi(2)(x), lab2:R`\psi_0\,x\,\psi_2`,
              cap:R`Durchgezogen $\psi_0\,x\,\psi_1$: überall $\ge 0$, Fläche $1/\sqrt2$. Gestrichelt $\psi_0\,x\,\psi_2$: ungerade, Fläche $0$.`},
            {k:'physik', text:R`Auswahlregel $\Delta n = \pm1$: Licht, das an die Auslenkung $x$ koppelt, verbindet nur benachbarte Niveaus.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Nur Nachbarn“ heißt: ungleich null nur für $m = n \pm 1$. Die Faktoren kommen aus $\hat a$ und $\hat a^\dagger$.`},
            {from:'dirac', to:'matrix', rule:R`Für jedes Paar $(m, n)$ den Wert in Zeile $m$, Spalte $n$ eintragen. Besetzt sind nur die beiden Nebendiagonalen; die Matrix ist symmetrisch.`},
            {from:'matrix', to:'ort', rule:R`Den Eintrag als Integral über $\psi_m\,x\,\psi_n$ schreiben. Die $\psi_n$ sind reell, deshalb ist keine Konjugation zu sehen.`},
            {from:'ort', to:'graph', rule:R`Den Integranden $\psi_m\,x\,\psi_n$ zeichnen. Das Matrixelement ist die Fläche darunter, mit Vorzeichen.`},
            {from:'graph', to:'physik', rule:R`Fläche null heißt: Der Übergang $n \to m$ ist verboten. Nur Nachbarn haben eine Fläche ungleich null.`}
          ]},
        q:{q:R`Du siehst den Integranden $\psi_1\,x\,\psi_4$; er ist eine gerade Funktion. Welchen Wert hat der Matrixeintrag $\langle 1|\hat x|4\rangle$?`, tr:{from:'graph', to:'matrix'},
          opts:[R`$\frac{x_0}{\sqrt2}\sqrt4$, wie $\langle 3|\hat x|4\rangle$`, R`$0$, denn $1$ und $4$ sind keine Nachbarn`, R`etwas Positives, weil der Integrand gerade ist`], a:1,
          ex:R`$\hat x|4\rangle$ enthält nur $|3\rangle$ und $|5\rangle$. Die Symmetrie allein entscheidet hier nichts; im Bild heben sich die positiven und negativen Teile von $\psi_1\,x\,\psi_4$ trotzdem genau auf.`,
          fb:[R`Das ist der Eintrag des Nachbarn $|3\rangle$. Von $|4\rangle$ führt kein einzelner Schritt zu $|1\rangle$.`, '',
            R`Ein gerader Integrand kann positive und negative Teile haben, die sich aufheben. Die Leiter zeigt: Hier ist die Fläche null.`]}},
      {id:'osz-t4e', title:R`$\langle x^2\rangle$ durch Abzählen`,
        num:{title:'n = 2', text:R`Mit der Formel unten ist $\langle 2|\hat x^2|2\rangle = \frac{x_0^2}{2}(2\cdot2 + 1) = \tfrac52x_0^2$. Über die Matrix: $\langle 2|\hat x^2|2\rangle = \sum_m x_{2m}x_{m2} = x_{21}^2 + x_{23}^2 = \frac{x_0^2}{2}(2 + 3) = \tfrac52x_0^2$.`},
        text:R`In $\hat x^2$ tragen zu $\langle n|\hat x^2|n\rangle$ nur die Terme bei, die gleich oft auf- und absteigen, also $\hat a\hat a^\dagger$ und $\hat a^\dagger\hat a$. Die Herleitung zeigt das. Ergebnis:

$$\langle n|\hat x^2|n\rangle = \frac{\hbar}{2m\omega}(2n+1),\qquad \langle n|\hat p^2|n\rangle = \frac{m\omega\hbar}{2}(2n+1).$$

Daraus folgen $\langle V\rangle = \langle T\rangle = \tfrac12E_n$ ([[lex:virialsatz|Virialsatz]]) und $\Delta x\,\Delta p = (n + \tfrac12)\hbar$. Der Grundzustand erreicht die Grenze $\hbar/2$ der Unschärferelation genau. Integrale über Hermite-Funktionen brauchst du dafür nicht; es genügt, Wege auf der Leiter zu zählen.`,
        derive:{ctx:OSZ_MAT(), lines:[
          {l:'⟨n|x^2|n⟩ = ħ/(2mω) ⟨n|(a + a†)^2|n⟩', w:'x̂ = √(ħ/2mω)(â + â†) eingesetzt',
            why:{q:'Woher kommt der Vorfaktor $\\frac{\\hbar}{2m\\omega}$?', opts:['Er ist das Quadrat von $\\sqrt{\\hbar/(2m\\omega)}$.', 'Er ist die Nullpunktsenergie geteilt durch $m$.', 'Er stammt aus der Normierung von $|n\\rangle$.'], a:0, ex:'$\\hat x^2 = \\frac{\\hbar}{2m\\omega}(\\hat a + \\hat a^\\dagger)^2$.'}},
          {l:'= ħ/(2mω) ⟨n|(a a + a a† + a† a + a† a†)|n⟩', w:'ausmultipliziert, Reihenfolge beibehalten',
            why:{q:'Warum vier Terme statt $\\hat a^2 + 2\\hat a^\\dagger\\hat a + \\hat a^{\\dagger2}$?', opts:['$\\hat a\\hat a^\\dagger$ und $\\hat a^\\dagger\\hat a$ sind verschieden.', 'Weil $\\hat a^2 = 0$ ist.', 'Die binomische Formel gilt nur für drei Terme.'], a:0, ex:'Die binomische Formel setzt $\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a$ voraus – falsch für Operatoren.'}},
          {l:'= ħ/(2mω) ⟨n|(a a† + a† a)|n⟩', w:'Terme mit n ± 2 sind orthogonal zu |n⟩',
            why:{q:'Warum fallen $\\hat a\\hat a$ und $\\hat a^\\dagger\\hat a^\\dagger$ weg?', opts:['Sie ändern $n$ um $\\pm2$, und $\\langle n|n\\pm2\\rangle = 0$.', 'Sie sind null, weil $\\hat a$ nilpotent ist.', 'Sie heben sich gegenseitig auf.'], a:0, ex:'$\\hat a^2|n\\rangle \\propto |n-2\\rangle$ ist orthogonal zu $|n\\rangle$.'}},
          {l:'= ħ/(2mω) (n + 1 + n)', w:'ââ† = N̂ + 1 und â†â = N̂',
            why:{q:'Was ist $\\langle n|\\hat a\\hat a^\\dagger|n\\rangle$?', opts:['$n + 1$', '$n$', '$\\sqrt{n(n+1)}$'], a:0, ex:'$\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a + 1$. Probe $n = 0$: $\\langle x^2\\rangle$ darf nicht null sein.'}},
          {l:'= ħ/(2mω) (2n + 1)', w:'zusammengefasst'}
        ]},
        q:{q:R`Welche Matrixelemente $\langle m|\hat x^2|3\rangle$ sind ungleich null?`,
          opts:[R`nur $m = 3$, wie bei einer Diagonalmatrix`, R`$m = 2$ und $m = 4$, wie bei $\hat x$`, R`$m = 1, 3, 5$`], a:2,
          ex:R`$\hat x^2 \propto (\hat a + \hat a^\dagger)^2$ ändert $n$ um $-2$, $0$ oder $+2$.`,
          fb:[R`$\hat a^\dagger\hat a^\dagger$ und $\hat a\hat a$ führen von $|3\rangle$ nach $|5\rangle$ und $|1\rangle$.`,
            R`Zwei Schritte von je $\pm1$ ergeben $\pm2$ oder $0$, nie $\pm1$.`, '']}},
      {id:'osz-t4f', title:'Typischer Fehler: die Faktoren als Wahrscheinlichkeit lesen',
        num:{title:R`$\hat a|2\rangle$ ist nicht normiert`, text:R`$\hat a|2\rangle = \sqrt2\,|1\rangle$ hat das Normquadrat $2\,\langle 1|1\rangle = 2$. Ein Zustand muss die Norm $1$ haben. Normiert man, steht wieder $|1\rangle$ da; der Faktor $\sqrt2$ trägt keine Wahrscheinlichkeit.`},
        text:R`**Ein häufiger Fehler** ist, die Faktoren als Wahrscheinlichkeiten oder als Vorgang zu lesen: „$\hat a|2\rangle = \sqrt2|1\rangle$, also ist das System danach im Zustand $\sqrt2|1\rangle$.“ Das ist kein Zustand nach einem Vorgang, sondern ein nicht normierter Vektor. $\hat a$ ist keine Messung und kein Prozess, sondern eine Rechenoperation. Wahrscheinlichkeiten entstehen nur aus normierten Zuständen, als $|\langle n|\psi\rangle|^2$ ([[lex:messpostulat|Messpostulat]]).`,
        q:{q:R`Jemand schreibt: „$\hat a|2\rangle = \sqrt2\,|1\rangle$, also ist das System mit Wahrscheinlichkeit $2$ im Zustand $|1\rangle$.“ Was ist falsch?`,
          opts:[R`Nichts; Wahrscheinlichkeiten über $1$ bedeuten Sicherheit.`, R`Es müsste $\sqrt2\,|3\rangle$ heißen, weil $\hat a$ aufsteigt.`, R`$\hat a$ ist kein Vorgang; $\sqrt2\,|1\rangle$ ist nicht normiert.`], a:2,
          ex:R`Wahrscheinlichkeiten liegen zwischen $0$ und $1$ und gehören zu normierten Zuständen und Messungen, nicht zu $\hat a$.`,
          fb:[R`Eine Wahrscheinlichkeit über $1$ gibt es nicht.`,
            R`$\hat a$ steigt ab: $\hat a|2\rangle \propto |1\rangle$ stimmt. Falsch ist die Deutung.`, '']}}
    ]},

    /* ===== Abschnitt 5: Ortsdarstellung ===== */
    {id:'osz-t5', title:'Eigenfunktionen in Ortsdarstellung', steps:[
      {id:'osz-t5a', title:R`Der Grundzustand aus $\hat a\psi_0 = 0$`,
        pre:{from:'m-analysis', seg:'ma-t3', title:'Gauß-Integral', text:R`$\int_{-\infty}^{\infty}e^{-\alpha x^2}dx = \sqrt{\pi/\alpha}$. Mini-Beispiel: $\alpha = 1$ gibt $\sqrt\pi \approx 1{,}77$.`},
        num:{title:R`In Einheiten $x_0 = 1$`, text:R`$\hat a\psi_0 = 0$ heißt $\left(x + \frac{d}{dx}\right)\psi_0 = 0$, also $\psi_0' = -x\psi_0$ und $\psi_0 = A\,e^{-x^2/2}$. Normierung:

$$|A|^2\int e^{-x^2}dx = |A|^2\sqrt\pi = 1,\qquad A = \pi^{-1/4} \approx 0{,}75.$$`},
        text:R`Bisher kam keine Wellenfunktion vor. Um sie zu bekommen, schreibst du $\hat a\psi_0 = 0$ in Ortsdarstellung mit $\hat p = -i\hbar\,d/dx$:

$$\sqrt{\frac{m\omega}{2\hbar}}\left(x + \frac{\hbar}{m\omega}\frac{d}{dx}\right)\psi_0 = 0 \quad\Longrightarrow\quad \psi_0' = -\frac{m\omega}{\hbar}\,x\,\psi_0.$$

Das ist eine Differentialgleichung erster Ordnung. Ihre Lösung ist bis auf einen Faktor eindeutig; deshalb ist der Grundzustand nicht entartet. Mit dem [[lex:gauss-integral|Gauß-Integral]] normiert:

$$\psi_0(x) = \left(\frac{m\omega}{\pi\hbar}\right)^{1/4}e^{-m\omega x^2/(2\hbar)}.$$

Das vorgerechnete Beispiel im nächsten Lernschritt geht diese Rechnung Zeile für Zeile durch.`,
        q:{q:R`Warum ist der Grundzustand des Oszillators nicht entartet?`,
          opts:['Weil das Parabelpotential spiegelsymmetrisch ist.', 'Weil $\\hat a\\psi_0 = 0$ eine DGL erster Ordnung ist.', 'Weil $\\psi_0$ als einzige Funktion keine Knoten hat.'], a:1,
          ex:R`Eine lineare DGL erster Ordnung hat eine Integrationskonstante, und die legt nur die Normierung fest.`,
          fb:[R`Symmetrie allein verhindert Entartung nicht. Entscheidend ist, dass $\hat a\psi_0 = 0$ nur eine Lösung hat.`, '',
            R`Knotenfreiheit ist eine Folge, nicht der Grund.`]}},
      {id:'osz-t5b', title:'Aufsteigen in Ortsdarstellung: Hermite-Polynome',
        pre:{from:'m-spezial', seg:'ms-t4', title:'Hermite-Polynome', text:R`Die Hermite-Polynome $H_0 = 1$, $H_1 = 2\xi$, $H_2 = 4\xi^2 - 2$, $H_3 = 8\xi^3 - 12\xi$ sind orthogonal mit dem Gewicht $e^{-\xi^2}$: $\int H_mH_n\,e^{-\xi^2}d\xi = 0$ für $m \ne n$. Mini-Beispiel: $\int H_0H_1e^{-\xi^2}d\xi = \int 2\xi\,e^{-\xi^2}d\xi = 0$.`},
        num:{title:R`$\psi_1$ und $\psi_2$`, text:R`In $\xi = x/x_0$ ist $\hat a^\dagger = \frac{1}{\sqrt2}\left(\xi - \frac{d}{d\xi}\right)$. Auf $\psi_0 = \pi^{-1/4}e^{-\xi^2/2}$ angewandt: $\hat a^\dagger\psi_0 = \sqrt2\,\xi\,\psi_0 = \psi_1$. Noch einmal und durch $\sqrt2$ geteilt:

$$\psi_2 = \frac{\hat a^\dagger\psi_1}{\sqrt2} = \pi^{-1/4}\,\frac{2\xi^2 - 1}{\sqrt2}\,e^{-\xi^2/2}.$$`},
        text:R`Die angeregten Zustände erhältst du durch Anwenden von $\hat a^\dagger = \sqrt{\frac{m\omega}{2\hbar}}\left(x - \frac{\hbar}{m\omega}\frac{d}{dx}\right)$. Jedes Anwenden macht aus dem Polynom vor $e^{-\xi^2/2}$ ein Polynom, das einen Grad höher ist. Mit der dimensionslosen Koordinate $\xi = x\sqrt{m\omega/\hbar}$ entstehen die [[lex:hermite-funktionen|Eigenfunktionen]]

$$\psi_n(x) = \frac{1}{\sqrt{2^n n!}}\left(\frac{m\omega}{\pi\hbar}\right)^{1/4}H_n(\xi)\,e^{-\xi^2/2}$$

mit den [[lex:hermite-polynome|Hermite-Polynomen]] $H_n$ aus M8. Der Vorfaktor sorgt für die Normierung.`,
        q:{q:R`Wie viele Nullstellen hat $\psi_2$, und wo liegen sie?`,
          opts:[R`eine, bei $\xi = 0$`, R`zwei, bei $\xi = \pm1/\sqrt2$`, R`keine, wie $\psi_0$`], a:1,
          ex:R`$2\xi^2 - 1 = 0$ für $\xi = \pm1/\sqrt2 \approx \pm0{,}71$. Der Faktor $e^{-\xi^2/2}$ ist nie null.`,
          fb:[R`Bei $\xi = 0$ ist $2\xi^2 - 1 = -1 \ne 0$. Eine Nullstelle in der Mitte hat $\psi_1$.`, '',
            R`$\psi_2$ ist der zweite angeregte Zustand; er hat zwei Knoten.`]}},
      {id:'osz-t5c', title:R`Der Zustand $|1\rangle$ in sechs Darstellungen`,
        num:{title:R`Zwei Wege zu $\psi_1$`, text:R`Aus der Spalte $(0;\ 1;\ 0;\ \dots)$ folgt $\psi(x) = \sum_n c_n\psi_n(x) = \psi_1(x)$. Aus der Ortsdarstellung, in $x_0 = 1$: $\psi_1(x) = \sqrt2\,\pi^{-1/4}x\,e^{-x^2/2}$, mit dem Maximum bei $x = 1$ und dem Wert $\approx 0{,}64$.`},
        text:R`Die Tafel übersetzt den ersten angeregten Zustand zwischen allen Darstellungen dieses Themas. Achte auf zwei Übergänge. Von der Matrix zur Funktion: Jeder Eintrag der Spalte wird mit seiner Basisfunktion $\psi_n(x)$ multipliziert, und alles wird addiert. Vom Bild zur Messung: $|\psi_1|^2$ ist in der Mitte null. Eine Ortsmessung findet das Teilchen also nie genau bei $x = 0$, am häufigsten bei $x \approx \pm x_0$. Die Schreibweise $\psi_1(x) = \langle x|1\rangle$ kennst du aus Thema 6.`,
        reps:{obj:R`Der erste angeregte Zustand $|1\rangle$ ($x_0 = 1$)`,
          rows:[
            {k:'worte', text:R`Eine Sprosse über dem Grundzustand. Ein Knoten in der Mitte, ungerade.`},
            {k:'dirac', tex:R`|1\rangle = \hat a^\dagger|0\rangle,\qquad \hat H|1\rangle = \tfrac32\hbar\omega\,|1\rangle`},
            {k:'matrix', tex:R`|1\rangle \doteq \begin{pmatrix}0\\ 1\\ 0\\ \vdots\end{pmatrix}`},
            {k:'ort', tex:R`\psi_1(x) = \langle x|1\rangle = \sqrt2\,\pi^{-1/4}\,x\,e^{-x^2/2}`},
            {k:'graph', plot:{x:[-4, 4], y:[-0.8, 0.9], xlab:R`x/x_0`, ylab:R`\psi`}, f:OSZ_SK.psi(1), lab:R`\psi_1`, f2:OSZ_SK.psi(0), lab2:R`\psi_0`,
              cap:R`Durchgezogen $\psi_1$: Nullstelle bei $0$, Extrema bei $\pm1$. Gestrichelt zum Vergleich $\psi_0$ ohne Knoten.`},
            {k:'physik', text:R`Energiemessung: sicher $\tfrac32\hbar\omega$. Ortsmessung: nie genau bei $x = 0$, am häufigsten bei $x \approx \pm x_0$.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Eine Sprosse über dem Grundzustand“ heißt einmal $\hat a^\dagger$ auf $|0\rangle$; die Energie ist $\hbar\omega(1 + \tfrac12)$.`},
            {from:'dirac', to:'matrix', rule:R`In der Energiebasis ist $|1\rangle$ die Spalte mit einer $1$ an der Stelle $n = 1$, also im zweiten Eintrag, weil ab $0$ gezählt wird.`},
            {from:'matrix', to:'ort', rule:R`Jeden Eintrag $c_n$ mit $\psi_n(x)$ multiplizieren und addieren; hier bleibt nur $\psi_1(x)$ übrig.`},
            {from:'ort', to:'graph', rule:R`Die Funktion zeichnen: Nullstelle bei $0$, Extrema bei $\pm x_0$, Abfall wie $e^{-x^2/2}$.`},
            {from:'graph', to:'physik', rule:R`$|\psi_1|^2$ ablesen: null in der Mitte, am größten bei $\pm x_0$. Die Zahl der Knoten verrät die Energie.`}
          ]},
        q:{q:R`Ein Zustand hat in der Energiebasis die Spalte $\tfrac{1}{\sqrt2}(1;\ 0;\ 1;\ 0;\ \dots)$. Welche Wellenfunktion gehört dazu?`, tr:{from:'matrix', to:'ort'},
          opts:[R`$\tfrac{1}{\sqrt2}\left(\psi_0(x) + \psi_1(x)\right)$`, R`$\tfrac{1}{\sqrt2}\left(\psi_0(x) + \psi_2(x)\right)$`, R`$\tfrac{1}{\sqrt2}\left(\psi_1(x) + \psi_3(x)\right)$, Zählung ab $1$`], a:1,
          ex:R`Der erste Eintrag gehört zu $\psi_0$, der dritte zu $\psi_2$.`,
          fb:[R`Die Einsen stehen im ersten und dritten Eintrag, nicht im ersten und zweiten.`, '',
            R`Beim Oszillator beginnt die Zählung bei $n = 0$: Der erste Eintrag ist $c_0$.`]}},
      {id:'osz-t5d', title:'Die analytische Methode',
        num:{title:'K für n = 2', text:R`Für $E_2 = \tfrac52\hbar\omega$ ist $K = 2E/\hbar\omega = 5$, also $K - 1 = 4$. Probe mit $H_2 = 4\xi^2 - 2$:

$$H_2'' - 2\xi H_2' + 4H_2 = 8 - 16\xi^2 + 16\xi^2 - 8 = 0.$$`},
        text:R`Die analytische Methode kommt ohne Leiteroperatoren aus und zeigt, woher die Quantisierung kommt. In $\xi$ lautet $\hat H\psi = E\psi$ einfach $-\psi'' + \xi^2\psi = K\psi$ mit $K = 2E/(\hbar\omega)$. Für große $|\xi|$ dominiert $\xi^2$; das legt den Ansatz $\psi = h(\xi)\,e^{-\xi^2/2}$ nahe. Einsetzen ergibt in der Herleitung die Hermite-Gleichung

$$h'' - 2\xi h' + (K - 1)\,h = 0.$$

Der Faktor $e^{-\xi^2/2}$ ist genau so gewählt, dass sich der störende Term $\xi^2h$ weghebt.`,
        derive:{ctx:OSZ_XI(), lines:[
          {l:"d/dξ (h(ξ) e^(-ξ^2/2)) = (h'(ξ) - ξ h(ξ)) e^(-ξ^2/2)", w:'Produktregel, einmal abgeleitet',
            why:{q:'Welche Regel steckt in dieser Zeile?', opts:['Produktregel; $\\frac{d}{d\\xi}e^{-\\xi^2/2} = -\\xi e^{-\\xi^2/2}$', 'Quotientenregel mit $e^{\\xi^2/2}$ im Nenner', 'partielle Integration ohne Randterm'], a:0, ex:'Die innere Ableitung von $-\\xi^2/2$ ist $-\\xi$.'}},
          {l:"d^2/dξ^2 (h(ξ) e^(-ξ^2/2)) = (h''(ξ) - 2ξ h'(ξ) + (ξ^2 - 1) h(ξ)) e^(-ξ^2/2)", w:'noch einmal abgeleitet',
            why:{q:'Warum steht $-2\\xi h\'$ da und nicht $-\\xi h\'$?', opts:['Weil $-\\xi h\'$ zweimal entsteht.', 'Weil man mit 2 multipliziert hat.', 'Weil $h\'\' = 2h\'$ ist.'], a:0, ex:'Einmal aus der Ableitung von $-\\xi h$, einmal aus $h\'\\cdot(-\\xi)$. Dazu kommen $-h$ und $\\xi^2h$.'}},
          {l:"-d^2/dξ^2 (h(ξ) e^(-ξ^2/2)) + ξ^2 h(ξ) e^(-ξ^2/2) = (-h''(ξ) + 2ξ h'(ξ) + h(ξ)) e^(-ξ^2/2)", w:'in −ψ″ + ξ²ψ eingesetzt',
            why:{q:'Was ist mit dem Term $\\xi^2h$ passiert?', opts:['Er hebt sich gegen $\\xi^2h$ aus $\\psi\'\'$ weg.', 'Er wurde vernachlässigt, weil $\\xi$ klein ist.', 'Er steckt jetzt in $h\'\'$.'], a:0, ex:'Genau dafür ist der Faktor $e^{-\\xi^2/2}$ da. Setzt man das gleich $K\\,h\\,e^{-\\xi^2/2}$, folgt $h\'\' - 2\\xi h\' + (K-1)h = 0$.'}},
          {l:"d^2/dξ^2 H_2(ξ) - 2ξ d/dξ H_2(ξ) + 4 H_2(ξ) = 0", w:'Probe mit H₂, K = 5',
            why:{q:'Welche Energie gehört zu $H_2$?', opts:['$K - 1 = 4$, also $E = \\tfrac52\\hbar\\omega$', '$K = 4$, also $E = 2\\hbar\\omega$', '$K - 1 = 2$, also $E = \\tfrac32\\hbar\\omega$'], a:0, ex:'$K = 2n + 1 = 5$ und $E = K\\hbar\\omega/2$.'}}
        ]},
        q:{q:R`Welche Gleichung erfüllt $h(\xi)$ für die Energie $E = \tfrac72\hbar\omega$?`,
          opts:[R`$h'' - 2\xi h' + 7h = 0$`, R`$h'' - 2\xi h' + 6h = 0$`, R`$h'' - 2\xi h' + 3h = 0$`], a:1,
          ex:R`$K = 2E/\hbar\omega = 7$, also $K - 1 = 6$. Das passt zu $H_3$.`,
          fb:[R`In der Gleichung steht $K - 1$, nicht $K$.`, '',
            R`$3$ ist die Quantenzahl $n$. In der Gleichung steht $K - 1 = 2n$.`]}},
      {id:'osz-t5e', title:'Abbruch der Reihe: die Quantisierung',
        num:{title:'K = 5 und K = 4', text:R`Rekursion $c_{j+2} = \frac{2j + 1 - K}{(j+1)(j+2)}\,c_j$. Für $K = 5$ und $c_0 = 1$: $c_2 = \frac{1 - 5}{2} = -2$, $c_4 = \frac{5 - 5}{12}\,c_2 = 0$. Also $h = 1 - 2\xi^2 \propto H_2$. Für $K = 4$: $c_2 = -\tfrac32$, $c_4 = \tfrac{1}{12}\cdot\left(-\tfrac32\right) = -\tfrac18$, und kein weiterer Koeffizient wird null.`},
        text:R`Mit der Potenzreihe $h = \sum_j c_j\xi^j$ folgt durch Koeffizientenvergleich die Rekursion

$$c_{j+2} = \frac{2j + 1 - K}{(j+1)(j+2)}\,c_j.$$

Für große $j$ ist $c_{j+2} \approx \frac{2}{j}\,c_j$. So wachsen die Koeffizienten von $e^{\xi^2}$; dann wüchse $\psi$ wie $e^{+\xi^2/2}$ und wäre nicht normierbar. Eine normierbare Lösung gibt es nur, wenn die Reihe abbricht: $K = 2n + 1$ für ein ganzes $n \ge 0$. Die jeweils andere Teilreihe wird null gesetzt. Daraus folgt wieder $E_n = \hbar\omega(n + \tfrac12)$. Die Quantisierung entsteht hier aus der Normierbarkeit. **Ausblick:** Beim Wasserstoffatom (Thema 9) ist es genauso.`,
        q:{q:R`Warum muss die Potenzreihe für $h(\xi)$ abbrechen?`,
          opts:[R`Sonst wäre $\psi$ bei $\xi = 0$ unstetig.`, R`Sonst wüchse $\psi$ wie $e^{+\xi^2/2}$.`, R`Sonst wäre die Energie negativ.`], a:1,
          ex:R`Eine nicht abbrechende Reihe wächst wie $e^{\xi^2}$; $\psi$ wäre nicht normierbar.`,
          fb:[R`Eine Potenzreihe ist bei $\xi = 0$ glatt. Das Problem liegt bei großen $|\xi|$.`, '',
            R`Mit der Energie hat der Abbruch nur indirekt zu tun: Er legt $K$ fest, und alle erlaubten $E$ sind positiv.`]}},
      {id:'osz-t5f', title:'Knoten, Parität und der verbotene Bereich im Labor',
        num:{title:R`$\psi_3$ und $\psi_0$`, text:R`$H_3 = 8\xi^3 - 12\xi = 4\xi(2\xi^2 - 3)$ hat die Nullstellen $0$ und $\pm\sqrt{3/2} \approx \pm1{,}22$: drei Knoten. Im Grundzustand liegt das Teilchen mit der Wahrscheinlichkeit $\operatorname{erfc}(1) \approx 0{,}16$ außerhalb der Umkehrpunkte $\pm x_0$.`},
        text:R`Ohne Rechnung siehst du: $\psi_n$ hat $n$ Knoten und die Parität $(-1)^n$. Die $\psi_n$ sind [[lex:orthonormal|orthonormal]], weil $\hat H$ hermitesch ist und die Eigenwerte verschieden sind. Und sie reichen über die klassischen Umkehrpunkte $\pm\sqrt{2n+1}\,x_0$ hinaus; dort fallen sie ab wie in Thema 5. Im Labor ist die Parabel das Potential, die waagerechten Linien sind die $E_n$. Auf der Linie zu $E_n$ liegt $|\psi_n|^2$, nach oben aufgetragen. Die Anzeige nennt den Anteil jenseits der Umkehrpunkte.`,
        fig:{lab:'osc', init:{n:3}, caption:'Parabelpotential, die Niveaus $E_n$ und darauf $|\\psi_n|^2$. Stelle $n$ ein, zähle die Knoten und achte auf die Ausläufer jenseits der Umkehrpunkte.'},
        q:{q:R`Bei $n = 0$ zeigt die Anzeige im Labor „Aufenthalt außerhalb der klassischen Umkehrpunkte: 15,7 %“. Welches Integral steckt dahinter?`, tr:{from:'labor', to:'formel'},
          opts:[R`$\int_{-x_0}^{x_0}|\psi_0(x)|^2\,dx$`, R`$2\int_{x_0}^{\infty}|\psi_0(x)|^2\,dx$`, R`$|\psi_0(x_0)|^2$`], a:1,
          ex:R`Der Umkehrpunkt für $n = 0$ liegt bei $\pm x_0$. Gezählt wird beidseitig außerhalb: $2\int_{x_0}^\infty|\psi_0|^2dx = \operatorname{erfc}(1) \approx 0{,}157$.`,
          fb:[R`Das ist der Anteil innerhalb der Umkehrpunkte, etwa $84\,\%$.`, '',
            R`Ein Funktionswert ist keine Wahrscheinlichkeit; es braucht eine Fläche.`]}}
    ]},

    /* ===== Abschnitt 6: Zeitentwicklung, klassische Grenze, Moleküle ===== */
    {id:'osz-t6', title:'Zeitentwicklung, klassische Grenze und Molekülschwingungen', steps:[
      {id:'osz-t6a', title:'Eigenzustände schwingen nicht',
        pre:{from:'sg', seg:'sg-t5', title:'Zeitentwicklung einer Überlagerung', text:R`Jeder Energieanteil bekommt seinen eigenen Faktor: $\Psi(t) = \sum_n c_n\,e^{-iE_nt/\hbar}\psi_n$. Mini-Beispiel: Bei einem einzigen Anteil ist $|\Psi|^2 = |\psi_n|^2$ zeitunabhängig.`},
        num:{title:R`Der Zustand $|3\rangle$`, text:R`$|3\rangle$ entwickelt sich zu $e^{-7i\omega t/2}|3\rangle$. Dann ist

$$\langle x\rangle(t) = e^{+7i\omega t/2}\,e^{-7i\omega t/2}\,\langle 3|\hat x|3\rangle = 0$$

für alle $t$: Der Phasenfaktor aus dem Bra hebt den aus dem Ket auf.`},
        text:R`**Stationär oder nicht?** Ein Eigenzustand entwickelt sich nur mit einer Phase: $|n\rangle \to e^{-iE_nt/\hbar}|n\rangle$ ([[lex:zeitentwicklung|Zeitentwicklung]], Thema 2). Alle Erwartungswerte bleiben dann konstant, insbesondere $\langle x\rangle = 0$. **Typische Fehlvorstellung:** „Ein Eigenzustand des Oszillators schwingt.“ Er gehört zwar zum Oszillator, aber in ihm bewegt sich nichts Messbares. Bewegung entsteht erst durch Überlagerung verschiedener Energien. Dann haben die Anteile verschiedene Phasenfaktoren, und deren Differenz hängt von der Zeit ab.`,
        q:{q:R`Ein Oszillator ist im Zustand $|3\rangle$. Wie hängt $\langle x\rangle$ von der Zeit ab?`,
          opts:[R`Es schwingt mit $\omega$.`, R`Es schwingt mit $3\omega$.`, R`Es ist konstant null.`], a:2,
          ex:R`$|3\rangle$ ist stationär; die Phase fällt im Erwartungswert heraus, und $\langle 3|\hat x|3\rangle = 0$.`,
          fb:[R`Zum Schwingen braucht es zwei Anteile mit verschiedenen Energien.`,
            R`$\tfrac72\omega$ ist die Frequenz der Phase; sie fällt im Erwartungswert heraus.`, '']}},
      {id:'osz-t6b', title:R`Überlagerung von $|0\rangle$ und $|1\rangle$`,
        num:{title:'Gleiche Anteile', text:R`$|\psi(t)\rangle = \frac{1}{\sqrt2}\left(e^{-i\omega t/2}|0\rangle + e^{-3i\omega t/2}|1\rangle\right)$. Nur die Mischterme tragen bei, mit $\langle 0|\hat x|1\rangle = x_0/\sqrt2$:

$$\langle x\rangle = \tfrac12\left(e^{i\omega t} + e^{-i\omega t}\right)\frac{x_0}{\sqrt2} = \frac{x_0}{\sqrt2}\cos\omega t.$$`},
        text:R`Für $|\psi(0)\rangle = c_0|0\rangle + c_1|1\rangle$ folgt allgemein

$$\langle x\rangle(t) = \sqrt{\frac{2\hbar}{m\omega}}\;|c_0c_1|\cos(\omega t - \delta),$$

wobei $\delta$ die Phase von $c_0^*c_1$ ist. Der Erwartungswert schwingt mit genau der klassischen Frequenz. Das verlangt das [[lex:ehrenfest|Ehrenfest-Theorem]]: Für $V = \frac12m\omega^2x^2$ ist $\frac{d}{dt}\langle p\rangle = -m\omega^2\langle x\rangle$ exakt die klassische Gleichung. In Überlagerungen, deren $n$ sich um 2 unterscheiden, ist dagegen $\langle x\rangle = 0$ für alle Zeiten, denn $\hat x$ verbindet nur Nachbarn. Dort schwingt nur die Breite $\langle x^2\rangle$, mit $2\omega$.`,
        q:{q:R`Ein Oszillator ist im Zustand $\frac{1}{\sqrt2}(|0\rangle + |2\rangle)$. Was macht $\langle x\rangle(t)$?`,
          opts:[R`Es schwingt mit $2\omega$.`, R`Es bleibt null.`, R`Es schwingt mit $\omega$.`], a:1,
          ex:R`$\langle 0|\hat x|2\rangle = 0$: $\hat x$ verbindet nur Nachbarn. Mit $2\omega$ schwingt hier nur $\langle x^2\rangle$.`,
          fb:[R`Mit $2\omega$ schwingt die Breite $\langle x^2\rangle$, nicht der Schwerpunkt.`, '',
            R`Für eine Schwingung mit $\omega$ müssten Nachbarn wie $|0\rangle$ und $|1\rangle$ beteiligt sein.`]}},
      {id:'osz-t6c', title:'Der schwingende Erwartungswert in sechs Darstellungen',
        num:{title:'Mit einer Phase i', text:R`Für $\frac{1}{\sqrt2}(|0\rangle + i|1\rangle)$ ist $c_0^*c_1 = \tfrac i2$ mit der Phase $\delta = \pi/2$. Dann ist

$$\langle x\rangle(t) = \frac{x_0}{\sqrt2}\cos\left(\omega t - \tfrac\pi2\right) = \frac{x_0}{\sqrt2}\sin\omega t.$$

Das Paket startet in der Mitte und läuft zuerst nach rechts.`},
        text:R`Die Tafel verbindet Ket, Spalte, Formel, Bild und Messung für die Überlagerung aus dem letzten Schritt. Lies besonders den Übergang von der Spalte zur Formel. Ein gemeinsamer Phasenfaktor vor der ganzen Spalte zählt nicht. Wichtig ist nur die **relative** Phase $e^{-i\omega t}$ zwischen den beiden Einträgen. Sie erzeugt im Erwartungswert den Kosinus. Das Beispiel zeigt: Eine andere Anfangsphase verschiebt nur den Zeitpunkt, an dem die Schwingung ihr Maximum hat.`,
        reps:{obj:R`Der Zustand $\frac{1}{\sqrt2}(|0\rangle + |1\rangle)$ im Lauf der Zeit`,
          rows:[
            {k:'worte', text:R`Halb Grundzustand, halb erster angeregter Zustand. Der Schwerpunkt pendelt mit der klassischen Frequenz $\omega$.`},
            {k:'dirac', tex:R`|\psi(t)\rangle = \tfrac{1}{\sqrt2}\left(e^{-i\omega t/2}|0\rangle + e^{-3i\omega t/2}|1\rangle\right)`},
            {k:'matrix', tex:R`|\psi(t)\rangle \doteq \frac{e^{-i\omega t/2}}{\sqrt2}\begin{pmatrix}1\\ e^{-i\omega t}\\ 0\\ \vdots\end{pmatrix}`},
            {k:'formel', tex:R`\langle x\rangle(t) = \langle\psi(t)|\hat x|\psi(t)\rangle = \frac{x_0}{\sqrt2}\cos\omega t`},
            {k:'graph', plot:{x:[0, 2], y:[-0.9, 0.9], xlab:'t', ylab:R`\langle x\rangle/x_0`, ticks:OSZ_SK.T}, f:t => Math.cos(2 * Math.PI * t) / Math.SQRT2, lab:R`|0\rangle + |1\rangle`, f2:() => 0, lab2:R`|0\rangle + |2\rangle`,
              cap:R`Durchgezogen der Schwerpunkt für $|0\rangle + |1\rangle$: Kosinus mit Amplitude $x_0/\sqrt2 \approx 0{,}71\,x_0$ und Periode $T = 2\pi/\omega$. Gestrichelt $|0\rangle + |2\rangle$: immer null.`},
            {k:'physik', text:R`Ehrenfest: $\frac{d}{dt}\langle x\rangle = \langle p\rangle/m$ und $\frac{d}{dt}\langle p\rangle = -m\omega^2\langle x\rangle$. Messbar ist die Schwingung als pendelnder Mittelwert vieler Ortsmessungen zur selben Zeit $t$.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`Jeder Anteil bekommt seinen Phasenfaktor $e^{-iE_nt/\hbar}$ mit $E_n = \hbar\omega(n + \tfrac12)$.`},
            {from:'dirac', to:'matrix', rule:R`Die Faktoren vor $|0\rangle, |1\rangle, \dots$ untereinander schreiben. Die gemeinsame Phase $e^{-i\omega t/2}$ darf man vorziehen.`},
            {from:'matrix', to:'formel', rule:R`Zeile mal Matrix von $\hat x$ mal Spalte. Nur die Einträge $x_{01} = x_{10} = x_0/\sqrt2$ tragen bei; die relative Phase $e^{-i\omega t}$ gibt $\cos\omega t$.`},
            {from:'formel', to:'graph', rule:R`$\langle x\rangle$ über $t$ zeichnen: Kosinus mit der Amplitude $x_0/\sqrt2$ und der Periode $T = 2\pi/\omega$.`},
            {from:'graph', to:'physik', rule:R`Die Periode im Bild ist die klassische Schwingungsdauer; das verlangt Ehrenfest.`}
          ]},
        q:{q:R`Wie lautet $\langle x\rangle(t)$ für $\frac{1}{\sqrt2}(|0\rangle - |1\rangle)$?`, tr:{from:'dirac', to:'formel'},
          opts:['$\\frac{x_0}{\\sqrt2}\\cos\\omega t$, denn das Vorzeichen ist eine bedeutungslose Phase', '$-\\frac{x_0}{\\sqrt2}\\cos\\omega t$, denn $c_0^*c_1 = -\\tfrac12$ hat die Phase $\\pi$', '$0$, weil sich die Anteile aufheben'], a:1,
          ex:R`$c_0^*c_1 = -\tfrac12$ hat die Phase $\delta = \pi$, und $\cos(\omega t - \pi) = -\cos\omega t$. Das Paket startet links.`,
          fb:[R`Das Minus ist eine *relative* Phase zwischen den Anteilen. Sie ändert den Zustand und damit $\langle x\rangle$.`, '',
            R`$|c_0c_1| = \tfrac12$ ist nicht null. Das Minus verschiebt die Schwingung, es löscht sie nicht.`]}},
      {id:'osz-t6d', title:'Die klassische Grenze im Labor',
        num:{title:'n = 5', text:R`Die Umkehrpunkte liegen bei $\pm\sqrt{11}\,x_0 \approx \pm3{,}3\,x_0$. $|\psi_5|^2$ hat fünf Nullstellen und sechs Buckel. Die äußeren Buckel sind etwa $1{,}6$-mal so hoch wie die inneren, wie bei der klassischen Dichte, die zum Rand hin wächst.`},
        text:R`Für große $n$ ähnelt $|\psi_n|^2$ im Mittel der klassischen Dichte: klein in der Mitte, groß an den Umkehrpunkten. Die $n$ Knoten bleiben, liegen aber immer dichter. Jedes Messgerät mit endlicher Auflösung mittelt sie weg. Das ist das [[lex:osz-korrespondenz|Korrespondenzprinzip]]. Im Labor siehst du es bei $n = 5$ schon deutlich: Die gestrichelte Kurve ist $\rho_\text{kl}$ zur selben Energie. Ein klassisch schwingendes Teilchen entspricht aber nicht einem einzelnen $|n\rangle$, denn das ist stationär. Erst eine Überlagerung vieler benachbarter Zustände bildet ein Paket, das hin- und herläuft.`,
        fig:{lab:'osc', init:{n:5}, caption:'Klassische Grenze: Stelle $n = 5$ ein und vergleiche $|\\psi_5|^2$ mit der gestrichelten klassischen Dichte bei derselben Energie.'},
        q:{q:R`Warum entspricht ein klassisch pendelndes Teilchen nicht einem einzelnen Zustand $|n\rangle$, auch nicht bei großem $n$?`,
          opts:[R`Weil $|n\rangle$ stationär ist: $\langle x\rangle = 0$ für alle Zeiten.`, R`Weil $|\psi_n|^2$ für große $n$ keine Knoten mehr hat.`, R`Weil es Zustände $|n\rangle$ nur bis $n = 5$ gibt.`], a:0,
          ex:R`$|\psi_n|^2$ ähnelt der klassischen Dichte, also einem zeitlichen Mittel. Das Pendeln selbst braucht eine Überlagerung.`,
          fb:['', R`Die Knoten bleiben; sie liegen nur dichter.`,
            R`Das Labor zeigt nur $n \le 5$. Die Leiter hat unendlich viele Sprossen.`]}},
      {id:'osz-t6e', title:'Molekülschwingungen und die Auswahlregel',
        num:{title:'Chlorwasserstoff', text:R`HCl absorbiert bei der Wellenzahl $\tilde\nu = 2886\,\mathrm{cm^{-1}}$, also $\lambda = 1/\tilde\nu \approx 3{,}5\,\mu\mathrm m$ und $\hbar\omega = hc\tilde\nu \approx 0{,}36\,\mathrm{eV}$. Mit $\mu \approx 0{,}98\,\mathrm u$ folgt die Federkonstante

$$k = \mu\omega^2 \approx 480\,\mathrm{N/m}.$$`},
        text:R`Zwei Atome einer Bindung schwingen gegeneinander. Mit der reduzierten Masse $\mu = m_1m_2/(m_1 + m_2)$ ist das ein Oszillator mit $\omega = \sqrt{k/\mu}$. Infrarotlicht wird absorbiert, wenn seine Photonenenergie zu $E_{n+1} - E_n$ passt. Das Licht koppelt an das Dipolmoment, das in erster Näherung proportional zur Auslenkung $x$ ist. Darum zählt $\langle m|\hat x|n\rangle$, und das ist nur für $m = n\pm1$ ungleich null: die **Auswahlregel** $\Delta n = \pm1$. Im harmonischen Modell erwartet man eine einzige Linie bei $\hbar\omega$. Lehrbücher nennen für HCl oft $516\,\mathrm{N/m}$; dabei ist die Anharmonizität herausgerechnet ([[lex:osz-molekuel|Molekülschwingungen]]).`,
        q:{q:R`Warum sieht man im harmonischen Modell nur eine IR-Linie?`,
          opts:['Nur Moleküle im Grundzustand $n = 0$ können Licht absorbieren.', 'Nur $\\Delta n = \\pm1$ ist erlaubt, und alle Abstände sind $\\hbar\\omega$.', 'Die höheren Niveaus $E_n$ fallen zu einem einzigen zusammen.'], a:1,
          ex:R`Jeder erlaubte Übergang $n \to n+1$ hat dieselbe Energie $\hbar\omega$.`,
          fb:[R`Auch angeregte Moleküle können absorbieren. Ihre Linie liegt nur an derselben Stelle.`, '',
            R`Die Niveaus bleiben getrennt; gleich sind nur ihre Abstände.`]}},
      {id:'osz-t6f', title:'Besetzung und Obertöne',
        num:{title:'Schwingungsquant und thermische Energie', text:R`Bei Zimmertemperatur ist $k_BT \approx 0{,}026\,\mathrm{eV}$. Für HCl ist $\hbar\omega/k_BT \approx 0{,}36/0{,}026 \approx 14$: Ein Schwingungsquant ist viel größer als die typische thermische Energie.`},
        text:R`Weil $\hbar\omega$ viel größer als $k_BT$ ist, sitzen bei Zimmertemperatur fast alle Moleküle im Grundzustand. Man sieht außerdem schwache Obertöne bei knapp $2\hbar\omega$. Sie zeigen: Weder ist das Dipolmoment exakt linear in $x$, noch ist die Bindung exakt harmonisch. Dass sie knapp *unter* $2\hbar\omega$ liegen, zeigt die Anharmonizität: Die Sprossen rücken nach oben hin zusammen. **Ausblick:** Solche Abweichungen behandelt man mit Störungstheorie (Thema 11). Im Gas kommt eine Rotationsstruktur hinzu (Thema 8).`,
        q:{q:R`Was zeigen die schwachen Obertöne bei knapp $2\hbar\omega$?`,
          opts:[R`dass die Auswahlregel $\Delta n = \pm1$ exakt gilt`, R`Abweichungen vom harmonischen Modell`, R`dass viele Moleküle schon in $n = 1$ sitzen`], a:1,
          ex:R`Ein Übergang $0 \to 2$ wäre im harmonischen Modell verboten. Dass man ihn sieht und dass er unter $2\hbar\omega$ liegt, zeigt die Anharmonizität.`,
          fb:[R`Gälte die Regel exakt, gäbe es keine Linie bei $2\hbar\omega$.`, '',
            R`Bei $\hbar\omega/k_BT \approx 14$ sitzen fast alle Moleküle in $n = 0$.`]}},
      {id:'osz-t6g', title:'Die Nullpunktsenergie ist messbar',
        num:{title:'H₂ und D₂', text:R`Für H₂ ist $\hbar\omega \approx 0{,}55\,\mathrm{eV}$, also $E_0 \approx 0{,}27\,\mathrm{eV}$. D₂ hat die doppelte reduzierte Masse, also $\omega/\sqrt2$ und $E_0 \approx 0{,}19\,\mathrm{eV}$. Der Unterschied von $0{,}08\,\mathrm{eV}$ passt zu den gemessenen Dissoziationsenergien $4{,}48$ und $4{,}56\,\mathrm{eV}$.`},
        text:R`H₂ und D₂ haben dieselbe Potentialkurve, aber verschiedene reduzierte Massen. Die Mulde ist gleich tief. Wegen $E_0 = \tfrac12\hbar\omega \propto 1/\sqrt\mu$ sitzt D₂ aber tiefer in ihr. Zur Dissoziation braucht es deshalb mehr Energie – die Vorhersage vom Anfang des Themas. Die Nullpunktsenergie ist also kein Rechenartefakt, sondern messbar. Klassisch läge jedes abgekühlte Molekül ruhig im Minimum, und beide Isotope bräuchten genau die Muldentiefe.`,
        q:{q:R`T₂ (Tritium) hat ungefähr die dreifache reduzierte Masse von H₂, bei gleicher Potentialkurve. Wie groß ist seine Nullpunktsenergie ungefähr?`,
          opts:[R`$0{,}27\,\mathrm{eV}/3 \approx 0{,}09\,\mathrm{eV}$`, R`$0{,}27\,\mathrm{eV}$, weil die Mulde gleich ist`, R`$0{,}27\,\mathrm{eV}/\sqrt3 \approx 0{,}16\,\mathrm{eV}$`], a:2,
          ex:R`$\omega = \sqrt{k/\mu}$: dreifache Masse heißt $\omega/\sqrt3$ und damit $E_0/\sqrt3$.`,
          fb:[R`$E_0$ hängt von $1/\sqrt\mu$ ab, nicht von $1/\mu$.`,
            R`Gleich ist die Mulde, nicht die Schwingungsfrequenz.`, '']}}
    ]}
  ]; })(),
  check:[
    {q:'Welche potentielle Energie hat ein klassischer Oszillator der Masse $m$ und Kreisfrequenz $\\omega$?', opts:['$\\tfrac12 m\\omega^2x^2$', '$\\tfrac12 m\\omega x^2$', '$m\\omega^2x$'], a:0, ex:'Federkonstante $k = m\\omega^2$, also $V = \\tfrac12kx^2$.', lex:'oszillator-spektrum'},
    {q:'$\\int_{-\\infty}^\\infty e^{-\\alpha x^2}dx = $', opts:['$\\sqrt{\\pi/\\alpha}$', '$\\pi/\\alpha$', '$1/(2\\alpha)$'], a:0, ex:'Das Gauß-Integral. Mit $x^2$ im Integranden kommt der Faktor $\\frac{1}{2\\alpha}$ dazu.', lex:'integrale', prev:'wf'},
    {q:'$[\\hat x, \\hat p] = $', opts:['$i\\hbar$', '$0$', '$-i\\hbar\\,\\hat x\\hat p$'], a:0, ex:'Der kanonische Kommutator. Alles Weitere zum Oszillator folgt daraus.', lex:'kommutator', prev:'form'},
    {q:'Ein Operator $\\hat N$ hat $\\hat N|n\\rangle = n|n\\rangle$. Was ist $\\langle n|\\hat N^2|n\\rangle$ für normiertes $|n\\rangle$?', opts:['$n^2$', '$n$', '$2n$'], a:0, ex:'$\\hat N^2|n\\rangle = n^2|n\\rangle$, also $\\langle n|\\hat N^2|n\\rangle = n^2$.', lex:'dirac-notation', prev:'form'}
  ],
  example:{
    title:'Grundzustand aus $\\hat a\\psi_0 = 0$',
    text:'Der Vernichter in Ortsdarstellung ist $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x + \\frac{\\hbar}{m\\omega}\\frac{d}{dx}\\right)$. Für den Grundzustand gilt $\\hat a\\psi_0 = 0$. Bestimme $\\psi_0$ und normiere es. Im Tutorial schreibst du $\\hat a$ als `â` und $\\hat a^\\dagger$ als `â†`.',
    ctx:OSZ_GROUND(),
    lines:[
      {l:'â ψ_0 = sqrt(mω/(2ħ)) (x ψ_0 + ħ/(mω) dψ_0/dx)', why:{q:'Was steht hier?', opts:['$\\hat a$ in Ortsdarstellung, angewendet auf $\\psi_0$', 'die zeitunabhängige Schrödingergleichung für $\\psi_0$', 'die Normierungsbedingung für $\\psi_0$'], a:0, ex:'$\\hat x$ multipliziert mit $x$, $\\hat p$ wird zu $-i\\hbar\\,d/dx$.'}},
      {l:'x ψ_0 + ħ/(mω) dψ_0/dx = 0', why:{q:'Warum gilt das?', opts:['Unter $\\psi_0$ gibt es keinen Zustand: $\\hat a\\psi_0 = 0$.', 'Der Grundzustand hat die Energie null, also $\\hat a\\psi_0 = 0$.', 'Im Minimum ist $x = 0$, also verschwindet die Klammer.'], a:0, ex:'Sonst wäre $\\hat a\\psi_0$ ein Zustand mit der noch tieferen Energie $E_0 - \\hbar\\omega$, und $\\psi_0$ wäre nicht der Grundzustand. Endete die Leiter nie, käme man sogar zu negativen Energien – im Widerspruch zu $\\langle H\\rangle \\ge \\tfrac12\\hbar\\omega$. Die Energie von $\\psi_0$ ist $\\tfrac12\\hbar\\omega$, nicht null.'}},
      {l:'dψ_0/dx = -mω/ħ x ψ_0', why:{q:'Was für eine Gleichung ist das?', opts:['lineare DGL 1. Ordnung, Trennung der Variablen', 'Eigenwertgleichung für $\\hat H$ mit $E = 0$', 'DGL 2. Ordnung wie die Schrödingergleichung'], a:0, ex:'$\\frac{d\\psi_0}{\\psi_0} = -\\frac{m\\omega}{\\hbar}x\\,dx$, also $\\ln\\psi_0 = -\\frac{m\\omega}{2\\hbar}x^2 + \\text{const}$.'}},
      {l:'ψ_0(x) = A e^(-mω x^2/(2ħ))', why:{q:'Wie viele Lösungen hat die Gleichung?', opts:['bis auf den Faktor $A$ genau eine', 'zwei, eine gerade und eine ungerade', 'keine, die normierbar ist'], a:0, ex:'Eine DGL erster Ordnung hat eine Integrationskonstante; die legt die Normierung fest. Deshalb ist der Grundzustand nicht entartet.'}},
      {l:'|A|^2 sqrt(πħ/(mω)) = 1', w:'Gauß-Integral mit α = mω/ħ', why:{q:'Welches Integral wurde benutzt?', opts:['$\\int e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$, $\\alpha = m\\omega/\\hbar$', '$\\int e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$, $\\alpha = m\\omega/(2\\hbar)$', '$\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$, $\\alpha = m\\omega/\\hbar$'], a:0, ex:'$|\\psi_0|^2 = |A|^2e^{-m\\omega x^2/\\hbar}$: Der Exponent verdoppelt sich beim Quadrieren.'}},
      {l:'A = (mω/(πħ))^(1/4)', why:{q:'Welche Einheit hat $A$?', opts:['$1/\\sqrt{\\text{Länge}}$', 'keine', '$1/\\text{Länge}$'], a:0, ex:'$m\\omega/\\hbar$ hat die Einheit $1/\\text{Länge}^2$; die vierte Wurzel davon ist $1/\\sqrt{\\text{Länge}}$, wie es für eine Wellenfunktion in 1D sein muss.'}}
    ],
    faded:{id:'osz-fade', title:'Jetzt du: erster angeregter Zustand $\\psi_1 \\propto \\hat a^\\dagger\\psi_0$', text:'Mit $\\hat a^\\dagger = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x - \\frac{\\hbar}{m\\omega}\\frac{d}{dx}\\right)$. Zeige $\\hat a^\\dagger\\psi_0 = \\sqrt{\\frac{2m\\omega}{\\hbar}}\\,x\\,\\psi_0$.',
      ctx:OSZ_GROUND(),
      given:['ψ_1 = â† ψ_0', '= sqrt(mω/(2ħ)) (x ψ_0 - ħ/(mω) dψ_0/dx)'],
      goals:[{id:'a', prompt:'Rechne zu Ende.', type:'show', from:'â† ψ_0', to:'sqrt(2mω/ħ) x ψ_0', hints:['Strategie: Ersetze die Ableitung durch das, was du über $\\psi_0$ schon weißt.', 'Aus $\\hat a\\psi_0 = 0$ folgt $\\psi_0\' = -\\frac{m\\omega}{\\hbar}x\\psi_0$.', 'Eingesetzt: $x\\psi_0 + x\\psi_0 = 2x\\psi_0$; dann den Vorfaktor zusammenfassen.'],
        model:['ψ_1 = â† ψ_0', '= sqrt(mω/(2ħ)) (x ψ_0 - ħ/(mω) dψ_0/dx)', {l:'= sqrt(mω/(2ħ)) · 2x ψ_0', gap:'= sqrt(mω/(2ħ)) · ▢'}, '= sqrt(2mω/ħ) x ψ_0']}]}
  },
  puzzle:{
    title:'Nullpunktsenergie ohne Parabel',
    text:'Für die Parabel liefert die Unschärferelation genau $\\tfrac12\\hbar\\omega$. Nun sei das Potential rein quartisch, $V(x) = \\lambda x^4$ mit $\\lambda > 0$. Es hat kein $x^2$-Glied, also auch kein $\\omega$, und die Leiteroperatoren helfen nicht.\n\nSchätze mit derselben Idee wie für die Parabel ab: Wie hängt die Grundzustandsenergie von $\\lambda$ ab (bei festem $m$ und $\\hbar$)?',
    q:{q:'Deine Vermutung:', opts:['$E_0 \\propto \\lambda^{1/3}$', '$E_0 \\propto \\lambda^{1/2}$', '$E_0 \\propto \\lambda$', '$E_0 = 0$, weil das Minimum ganz flach ist'], a:0, ex:'Die Abschätzung ergibt $E_0 \\propto (\\hbar^4\\lambda/m^2)^{1/3}$.'},
    reveal:'Mit $\\langle x\\rangle = \\langle p\\rangle = 0$, $\\Delta p \\approx \\hbar/(2\\Delta x)$ und grob $\\langle x^4\\rangle \\approx (\\Delta x)^4$ ist\n\n$$E(\\Delta x) \\approx \\frac{\\hbar^2}{8m(\\Delta x)^2} + \\lambda(\\Delta x)^4.$$\n\nDer erste Term bestraft eine kleine Breite, der zweite eine große. Aus $dE/d(\\Delta x) = 0$ folgt $(\\Delta x)^6 = \\frac{\\hbar^2}{16m\\lambda}$, und beide Terme sind dann von der Ordnung $(\\hbar^4\\lambda/m^2)^{1/3}$. Also $E_0 \\propto \\lambda^{1/3}$. Eine Einheitenbetrachtung bestätigt das: Aus $\\hbar$, $m$ und $\\lambda$ (Einheit $\\mathrm{J/m^4}$) lässt sich genau eine Energie bilden, $(\\hbar^4\\lambda/m^2)^{1/3}$. Den Zahlenfaktor trifft die grobe Abschätzung nur ungefähr; genauer wird er mit dem Variationsprinzip (Thema 11) oder numerisch.\n\nAuch ohne Parabel bleibt also eine Nullpunktsenergie – sie folgt allein aus der Unschärferelation.'
  },
  clarify:{
    core:'Mit $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x + \\frac{i}{m\\omega}\\hat p\\right)$ und $\\hat a^\\dagger$ gilt $[\\hat a, \\hat a^\\dagger] = 1$ und\n\n$$\\hat H = \\hbar\\omega\\left(\\hat a^\\dagger\\hat a + \\tfrac12\\right),\\qquad \\hat a|n\\rangle = \\sqrt n\\,|n-1\\rangle,\\qquad \\hat a^\\dagger|n\\rangle = \\sqrt{n+1}\\,|n+1\\rangle.$$\n\nWeil $\\|\\hat a\\psi\\|^2 \\ge 0$, endet die Leiter unten bei $\\hat a|0\\rangle = 0$. Daraus folgt $E_n = \\hbar\\omega(n + \\tfrac12)$, $n = 0, 1, 2, \\dots$ Umgekehrt ist $\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$ und $\\hat p = i\\sqrt{\\frac{m\\omega\\hbar}{2}}(\\hat a^\\dagger - \\hat a)$. Matrixelemente rechnet man damit ohne Integrale.',
    keys:[
      'Energieniveaus haben den festen Abstand $\\hbar\\omega$; der Grundzustand hat die Nullpunktsenergie $\\tfrac12\\hbar\\omega$.',
      '$\\psi_n(x) = \\frac{1}{\\sqrt{2^nn!}}\\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}H_n(\\xi)\\,e^{-\\xi^2/2}$ mit $\\xi = \\sqrt{m\\omega/\\hbar}\\,x$; $\\psi_n$ hat $n$ Knoten und die Parität $(-1)^n$.',
      '$\\hat x$ und $\\hat p$ verbinden nur Nachbarn: $\\langle m|\\hat x|n\\rangle \\ne 0$ nur für $m = n \\pm 1$. Daraus folgt die IR-Auswahlregel $\\Delta n = \\pm1$.',
      'In jedem Eigenzustand gilt $\\langle T\\rangle = \\langle V\\rangle = \\tfrac12E_n$ (Virialsatz).',
      'Zeitentwicklung: $|n\\rangle \\to e^{-iE_nt/\\hbar}|n\\rangle$. Eigenzustände sind stationär; erst Überlagerungen benachbarter Zustände lassen $\\langle x\\rangle$ mit $\\omega$ schwingen.'
    ],
    errors:[
      '$\\hat a^\\dagger|n\\rangle = \\sqrt n\\,|n+1\\rangle$ statt $\\sqrt{n+1}$: Teste mit $n = 0$ – $\\hat a^\\dagger|0\\rangle$ darf nicht null sein.',
      '$\\hat a\\hat a^\\dagger$ und $\\hat a^\\dagger\\hat a$ verwechseln: $\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a + 1$.',
      'Den Vorfaktor $\\frac{\\hbar}{2m\\omega}$ in $\\hat x^2$ vergessen.',
      'Mit $\\hat a$ wie mit einer Observablen rechnen: $\\hat a$ ist nicht hermitesch, $\\langle n|\\hat a|n\\rangle = 0$ hat keine Messbedeutung, und $\\hat a|n\\rangle$ ist kein Zustand „nach einem Vorgang“.',
      'Glauben, das Teilchen könne nicht außerhalb der klassischen Umkehrpunkte gefunden werden.'
    ],
    more:[{title:'Warum endet die Leiter unten?', text:'Für jeden Zustand ist $\\langle\\psi|\\hat a^\\dagger\\hat a|\\psi\\rangle = \\|\\hat a\\psi\\|^2 \\ge 0$, also sind alle Eigenwerte von $\\hat N = \\hat a^\\dagger\\hat a$ nichtnegativ. Weil $\\hat a$ den Eigenwert um 1 senkt, muss es einen Zustand mit $\\hat a|0\\rangle = 0$ geben – sonst käme man zu negativen Werten.'}],
    checks:[
      {q:'Was ist $\\hat a^\\dagger\\hat a^\\dagger|1\\rangle$?', opts:['$\\sqrt6\\,|3\\rangle$', '$2|3\\rangle$', '$\\sqrt2\\,|3\\rangle$'], a:0, ex:'$\\hat a^\\dagger|1\\rangle = \\sqrt2|2\\rangle$, dann $\\hat a^\\dagger|2\\rangle = \\sqrt3|3\\rangle$, zusammen $\\sqrt6|3\\rangle$.'},
      {q:'Welche Matrixelemente $\\langle m|\\hat x|2\\rangle$ sind ungleich null?', opts:['$m = 1$ und $m = 3$', 'nur $m = 2$', 'alle $m$'], a:0, ex:'$\\hat x \\propto \\hat a + \\hat a^\\dagger$ ändert $n$ um genau $\\pm1$.'}
    ]
  },
  lab:{type:'osc', title:'Eigenfunktionen im Parabelpotential',
    map:(() => { const R = String.raw; return [
      {sym:R`n`, ctl:'Quantenzahl n', says:R`Wählt den Eigenzustand $|n\rangle$ mit $E_n = \hbar\omega(n + \tfrac12)$. Hervorgehoben wird die Linie $E_n$; auf ihr liegt $|\psi_n|^2$ mit $n$ Knoten und der Parität $(-1)^n$.`},
      {sym:R`V(x) = \tfrac12m\omega^2x^2`, ctl:'x / √(ħ/mω)', says:R`Die Parabel ist das Potential. Die waagerechte Achse ist in der Oszillatorlänge $x_0 = \sqrt{\hbar/(m\omega)}$ geteilt, die Umkehrpunkte zu $E_n$ liegen bei $\pm\sqrt{2n+1}\,x_0$.`},
      {sym:R`E_n = \hbar\omega\left(n + \tfrac12\right)`, ctl:'E / ħω', says:R`Die Hochachse in Einheiten von $\hbar\omega$. Die waagerechten Linien bei $n + \tfrac12$ sind die Sprossen der Leiter: Abstand $1$, die unterste bei $\tfrac12$ (Nullpunktsenergie).`},
      {sym:R`2\int_{x_n}^{\infty}|\psi_n|^2\,dx`, ctl:'Aufenthalt außerhalb der klassischen Umkehrpunkte', says:R`Die Anzeige integriert $|\psi_n|^2$ über den klassisch verbotenen Bereich $|x| > x_n = \sqrt{2n+1}\,x_0$. Für $n = 0$ sind es $\operatorname{erfc}(1) \approx 15{,}7\,\%$.`},
      {sym:R`\rho_\text{kl}(x) = \frac{1}{\pi\sqrt{A^2 - x^2}}`, ctl:'Klassischer Vergleich', says:R`Blendet die gestrichelte klassische Aufenthaltsdichte zur selben Energie ein, mit $A = x_n$. Sie wird an den Umkehrpunkten unendlich. Für große $n$ schwingt $|\psi_n|^2$ um sie herum (Korrespondenzprinzip).`}
    ]; })(),
    text:'Die Parabel ist das Potential, die waagerechten Linien sind die Energien $E_n$, darauf liegt $|\\psi_n|^2$. Gestrichelt: die klassische Aufenthaltsdichte bei derselben Energie, die an den Umkehrpunkten unendlich wird.',
    sketch:{id:'osz-lab-s', title:'$|\\psi_5|^2$ vorhersagen', kind:'curve', draw:'abs2',
      text:'Skizziere vor dem Labor die Aufenthaltsdichte $|\\psi_5(x)|^2$. Die klassischen Umkehrpunkte liegen bei $\\pm\\sqrt{11}\\,x_0 \\approx \\pm3{,}3\\,x_0$. Die Höhe ist frei. Halte die Vorhersage fest, stell dann im Labor $n = 5$ ein und vergleiche mit der Kurve und mit der gestrichelten klassischen Dichte.',
      plot:{x:[-5, 5], xlab:'x/x_0', ylab:'|\\psi_5(x)|^2', ticks:[{x:-OSZ_SK.xt(5), lab:'-\\sqrt{11}'}, {x:0, lab:'0'}, {x:OSZ_SK.xt(5), lab:'\\sqrt{11}'}], V:x => x * x / 2, Vr:[0, 7], E:5.5},
      f:OSZ_SK.rho(5),
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann eine Aufenthaltsdichte negativ werden?'},
        {id:'knoten', type:'nodes', n:5, msg:'Wie viele Nullstellen hat $|\\psi_5|^2$? Deine Skizze hat {got}.'},
        {id:'rand', name:'Höhe der Buckel', type:'amp', a:[2, 3.4], b:[-1.1, 1.1], cmp:'>', msg:'Wo ist ein klassisches Teilchen langsam und hält sich lange auf? Wo sollten die Buckel von $|\\psi_5|^2$ also höher sein? (Abschnitt ‚Zeitentwicklung, klassische Grenze und Molekülschwingungen‘)'},
        {id:'aussen', name:'jenseits des Umkehrpunkts', type:'decay', toward:'right', range:[OSZ_SK.xt(5), 5], msg:'Was macht $|\\psi_5|^2$ jenseits des Umkehrpunkts, wo $E < V$ ist?'}
      ],
      reveal:'$|\\psi_5|^2$ hat fünf Nullstellen und sechs Buckel. Die äußeren Buckel sind etwa 1,6-mal so hoch wie die inneren und etwas breiter. Nahe den Umkehrpunkten ist $E - V$ klein: Das Teilchen ist dort langsam, die lokale Wellenlänge ist groß und die Amplitude auch. Im Mittel folgt $|\\psi_5|^2$ so der klassischen Dichte, die zu den Umkehrpunkten hin anwächst. Jenseits der Umkehrpunkte fällt die Dichte rasch ab, ist aber nicht null.',
      wrong:[
        {f:x => Math.sin(3 * Math.PI * x / OSZ_SK.xt(5)) ** 2 * Math.exp(-x * x / 5) * (Math.abs(x) < OSZ_SK.xt(5) ? 1 : Math.exp(-3 * (Math.abs(x) - OSZ_SK.xt(5)))), fails:['rand'], why:'Buckel zur Mitte hin höher, wie beim Grundzustand'},
        {f:x => Math.abs(x) < OSZ_SK.xt(5) ? Math.sin(3 * Math.PI * (x + OSZ_SK.xt(5)) / OSZ_SK.xt(5)) ** 2 : 0, fails:['rand', 'aussen'], why:'wie im Kasten: alle Buckel gleich hoch, $|\\psi|^2 = 0$ jenseits der Umkehrpunkte'},
        {f:x => { const X = OSZ_SK.xt(5), c = X - 0.15; return Math.abs(x) < c ? 1 / Math.sqrt(X * X - x * x) : Math.exp(-3 * (Math.abs(x) - c)) / Math.sqrt(X * X - c * c); }, fails:['knoten'], why:'klassische Dichte ohne Knoten'}
      ]},
    predict:{q:'Bevor du den Regler bewegst: Wo ist $|\\psi_5|^2$ am größten?', opts:['nahe den klassischen Umkehrpunkten', 'in der Mitte bei $x = 0$', 'überall gleich groß zwischen den Umkehrpunkten'], a:0, ex:'Wie klassisch: Wo das Teilchen langsam ist, also $E - V$ klein, ist die Amplitude groß. Bei $x = 0$ hat $\\psi_5$ sogar einen Knoten, denn $\\psi_5$ ist ungerade.'},
    questions:[
      {q:'Grundzustand $n = 0$: Wie groß ist die Wahrscheinlichkeit, das Teilchen außerhalb der klassischen Umkehrpunkte zu finden?', opts:['etwa 16 %', 'genau 0 %', 'etwa 50 %'], a:0, ex:'$P = \\operatorname{erfc}(1) \\approx 0{,}157$. Klassisch wäre der Bereich verboten.'},
      {q:'Stelle $n = 5$ ein. Wie sieht $|\\psi_5|^2$ im Vergleich zur klassischen Dichte aus?', opts:['Es schwingt um die klassische Kurve und ist an den Rändern am größten.', 'Es ist in der Mitte am größten wie beim Grundzustand.', 'Es stimmt exakt mit der klassischen Kurve überein.'], a:0, ex:'Für große $n$ nähert sich das Mittel von $|\\psi_n|^2$ der klassischen Dichte – das Korrespondenzprinzip. Die Knoten bleiben.'}
    ],
    noPic:{q:'Ohne Bild: Wie viele Nullstellen hat $\\psi_4(x)$?', opts:['4', '5', '2'], a:0, ex:'$\\psi_n$ hat genau $n$ Knoten (Hermite-Polynom vom Grad $n$).'}},
  compare:{
    text:'Gesucht ist $\\langle x^2\\rangle$ im Grundzustand $\\psi_0 = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}e^{-m\\omega x^2/(2\\hbar)}$. Zwei richtige Wege:',
    ctx:OSZ_POS(),
    A:{name:'Gauß-Integral', model:['⟨x^2⟩ = sqrt(mω/(πħ)) ∫_-∞^∞ x^2 e^(-mω x^2/ħ) dx', {l:'= sqrt(mω/(πħ)) · ħ/(2mω) sqrt(πħ/(mω))', w:'∫x²e^{−αx²}dx = √(π/α)/(2α)'}, '= ħ/(2mω)']},
    B:{name:'Leiteroperatoren', text:'Mit $\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$ und $\\hat a\\psi_0 = 0$:', model:['⟨x^2⟩ = ħ/(2mω) ⟨ψ_0|(â + â†)^2|ψ_0⟩', {l:'= ħ/(2mω) ⟨ψ_0|â â†|ψ_0⟩', w:'nur ââ† überlebt'}, '= ħ/(2mω)']},
    questions:[
      {q:'Welcher Weg ist für $\\langle x^4\\rangle$ im Zustand $\\psi_3$ deutlich bequemer?', opts:['die Leiteroperatoren', 'das Gauß-Integral mit $H_3$', 'beide gleich aufwendig'], a:0, ex:'Mit $\\hat a$, $\\hat a^\\dagger$ zählt man nur Wege auf der Leiter; das Integral bräuchte $H_3^2\\,x^4\\,e^{-\\xi^2}$.'},
      {q:'Warum bleibt in Weg B nur $\\langle\\psi_0|\\hat a\\hat a^\\dagger|\\psi_0\\rangle$ übrig?', opts:['$\\hat a\\psi_0 = 0$, und $\\hat a^{\\dagger2}\\psi_0 \\perp \\psi_0$', 'weil $\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a$ gilt', 'weil ungerade Terme symmetrisch wegfallen'], a:0, ex:'$\\hat a\\psi_0 = 0$ tötet $\\hat a^\\dagger\\hat a$ und $\\hat a^2$; $\\hat a^{\\dagger2}\\psi_0 \\propto \\psi_2$ ist orthogonal zu $\\psi_0$. Und $\\hat a\\hat a^\\dagger\\psi_0 = (\\hat a^\\dagger\\hat a + 1)\\psi_0 = \\psi_0$.'}
    ]
  },
  concept:[
    {id:'osz-k1', type:'mc2', seg:'osz-t3', lex:'nullpunktsenergie',
      q:'Ein Oszillator wird beliebig weit abgekühlt. Kann seine Energie null werden?', opts:['Nein, sie bleibt mindestens $\\tfrac12\\hbar\\omega$.', 'Ja, bei $T = 0$ ruht er im Minimum.', 'Ja, im Zustand $\\hat a|0\\rangle$.'], a:0,
      ex:'Die tiefste Energie ist $E_0 = \\tfrac12\\hbar\\omega$. $\\hat a|0\\rangle$ ist der Nullvektor, kein Zustand mit Energie null.',
      reason:{q:'Warum?', opts:['$\\langle\\hat N\\rangle = \\|\\hat a\\psi\\|^2 \\ge 0$ und $\\hat H = \\hbar\\omega(\\hat N + \\tfrac12)$', 'Weil die Temperatur nie ganz null werden kann', 'Weil der Grundzustand zweifach entartet ist'], a:0,
        ex:'Für jeden Zustand ist $\\langle H\\rangle = \\hbar\\omega(\\|\\hat a\\psi\\|^2 + \\tfrac12) \\ge \\tfrac12\\hbar\\omega$. Das gilt auch bei $T = 0$; der Grundzustand ist nicht entartet.'}},
    {id:'osz-k2', type:'dialog', seg:'osz-t5',
      text:'Ein Oszillator ist im Grundzustand $\\psi_0$. Die klassischen Umkehrpunkte liegen bei $\\pm\\sqrt{\\hbar/(m\\omega)}$.',
      people:[
        {name:'Lena', says:'Außerhalb der Umkehrpunkte wäre die kinetische Energie negativ. Dort kann man das Teilchen nie finden.'},
        {name:'Jonas', says:'Eine Ortsmessung findet es dort in etwa 16 % der Fälle. Eine negative kinetische Energie misst man dabei trotzdem nicht.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:1,
      ex:'$\\psi_0$ ist außerhalb nicht null; $P = \\operatorname{erfc}(1) \\approx 0{,}16$. Lenas Argument setzt voraus, dass Ort und kinetische Energie zugleich scharf sind. $\\hat x$ und $\\hat T$ vertauschen aber nicht; „kinetische Energie $E - V(x)$ am Ort $x$“ ist keine Messgröße.'},
    {id:'osz-k3', type:'mc2', seg:'osz-t6', lex:'stationaer',
      q:'Ein Oszillator ist im Zustand $\\frac{1}{\\sqrt2}(|0\\rangle + |2\\rangle)$. Schwingt $\\langle x\\rangle$?', opts:['Nein, $\\langle x\\rangle = 0$ für alle $t$.', 'Ja, mit der Frequenz $\\omega$.', 'Ja, mit der Frequenz $2\\omega$.'], a:0,
      ex:'Der Zustand ist nicht stationär – aber $\\langle x\\rangle$ bleibt null. Schwingen tut $\\langle x^2\\rangle$, mit $2\\omega$.',
      reason:{q:'Warum?', opts:['$\\hat x$ verbindet nur $n$ und $n\\pm1$; $|0\\rangle$ und $|2\\rangle$ sind keine Nachbarn.', 'Überlagerungen von Eigenzuständen sind immer stationär.', 'Weil $E_2 - E_0 = 2\\hbar\\omega$ die Frequenz festlegt.'], a:0,
        ex:'Der Mischterm in $\\langle x\\rangle$ enthält $\\langle 0|\\hat x|2\\rangle = 0$. In $\\langle x^2\\rangle$ dagegen ist $\\langle 0|\\hat x^2|2\\rangle \\ne 0$; dieser Term schwingt mit $(E_2 - E_0)/\\hbar = 2\\omega$.'}},
    {id:'osz-k4', type:'mc', seg:'osz-t5',
      q:'Wie sieht $\\psi_{10}(x)$ qualitativ aus?', opts:['Amplitude am Rand größer, Knoten in der Mitte dichter', 'Amplitude überall gleich, Knoten gleichmäßig verteilt', 'Amplitude in der Mitte größer, Knoten am Rand dichter'], a:0,
      ex:'In der Mitte ist $E - V$ am größten: großer Impuls, kurze Wellenlänge, also dichte Knoten und kleine Amplitude. Nahe den Umkehrpunkten ist das Teilchen langsam, die Wellenlänge lang und die Amplitude groß – wie die klassische Dichte.'},
    {id:'osz-k5', type:'dialog', seg:'osz-t4',
      text:'Es gilt $\\hat a|2\\rangle = \\sqrt2\\,|1\\rangle$.',
      people:[
        {name:'Lena', says:'Wendet man $\\hat a$ an, misst man gewissermaßen ein Quant heraus. Danach ist das System im Zustand $\\sqrt2\\,|1\\rangle$.'},
        {name:'Jonas', says:'$\\hat a$ ist keine Observable und beschreibt keine Messung. $\\sqrt2\\,|1\\rangle$ ist nicht einmal normiert. Wichtig ist nur, dass $\\hat a|2\\rangle$ proportional zu $|1\\rangle$ ist.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:1,
      ex:'Einen Operator anwenden ist keine Messung. Nach einer Messung ist der Zustand normiert und ein Eigenzustand der gemessenen Observablen. $\\hat a$ ist nicht hermitesch, und der Faktor $\\sqrt2$ ist kein Wahrscheinlichkeitsgewicht.'}
  ],
  practice:[
    {id:'osz-p1', title:'Rechnen mit Leiteroperatoren',
      text:'Besetzungszahlbasis $|n\\rangle$. Hier schreibst du `a` und `a†` ohne Dach; `H` ist $\\hbar\\omega(a^\\dagger a + \\tfrac12)$, `x` und `p` sind die Orts- und Impulsoperatoren.',
      ctx:OSZ_MAT(),
      goals:[
        {id:'a', prompt:'a) Zeige $[H, a] = -\\hbar\\omega\\,a$.', type:'show', from:'[H, a]', to:'-ħω a', points:3,
          hints:['Gesucht ist ein Kommutator. Setze $H = \\hbar\\omega(a^\\dagger a + \\tfrac12)$ ein; die Zahl $\\tfrac12$ vertauscht mit allem.', 'Regel: $[AB, C] = A[B, C] + [A, C]B$, dazu $[a, a^\\dagger] = 1$.', 'Nächster Schritt: $[a^\\dagger a, a] = [a^\\dagger, a]\\,a$, denn $[a, a] = 0$.'],
          model:['[H, a] = ħω [a† a, a]', '= ħω (a† a a - a a† a)', '= ħω [a†, a] a', '= -ħω a'],
          note:'Damit senkt $a$ die Energie um $\\hbar\\omega$: $H(a|n\\rangle) = (E_n - \\hbar\\omega)\\,a|n\\rangle$.'},
        {id:'b', prompt:'b) Berechne $\\langle n|x^2|n\\rangle$.', type:'value', target:'ħ/(2mω) (2n + 1)', points:3,
          hints:['Drücke $x$ durch die Leiteroperatoren aus; dann ist $\\langle n|x^2|n\\rangle$ eine Abzählaufgabe.', 'Regel: $x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(a + a^\\dagger)$; nur Terme mit gleich vielen $a$ und $a^\\dagger$ führen zu $|n\\rangle$ zurück.', 'Nächster Schritt: $\\langle n|a a^\\dagger|n\\rangle = n + 1$ und $\\langle n|a^\\dagger a|n\\rangle = n$.'],
          model:['⟨n|x^2|n⟩ = ħ/(2mω) ⟨n|(a + a†)^2|n⟩', '= ħ/(2mω) ⟨n|(a a† + a† a)|n⟩', '= ħ/(2mω)(2n + 1)']},
        {id:'c', prompt:'c) Berechne $\\langle n|p^2|n\\rangle$.', type:'value', target:'m ħ ω/2 (2n + 1)', points:3,
          hints:['Gleiche Strategie wie in b): $p$ durch $a$ und $a^\\dagger$ ausdrücken.', 'Regel: $p = i\\sqrt{\\frac{m\\omega\\hbar}{2}}(a^\\dagger - a)$, also $p^2 = -\\frac{m\\omega\\hbar}{2}(a^\\dagger - a)^2$.', 'Nächster Schritt: Von $(a^\\dagger - a)^2$ tragen nur $-a^\\dagger a - a a^\\dagger$ bei; dieses Minus hebt das Minus im Vorfaktor auf.'],
          model:['⟨n|p^2|n⟩ = -mħω/2 ⟨n|(a† - a)^2|n⟩', '= mħω/2 ⟨n|(a† a + a a†)|n⟩', '= mħω/2 (2n + 1)'], note:'Damit $\\langle T\\rangle = \\langle p^2\\rangle/2m = \\tfrac12E_n = \\langle V\\rangle$.'}
      ]},
    {id:'osz-p2', title:'Grundzustand: kinetische und potentielle Energie',
      text:'$\\psi_0$ ist der normierte Grundzustand; es gilt $\\langle x^2\\rangle = \\frac{\\hbar}{2m\\omega}$ und $\\langle H\\rangle = \\tfrac12\\hbar\\omega$. Im Tutorial sind `V` das Potential und `T` die kinetische Energie.',
      ctx:OSZ_POS(),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle V\\rangle$.', type:'value', target:'ħω/4', points:2,
          hints:['$V$ hängt nur von $x$ ab. Welche Größe aus dem Aufgabentext kannst du verwenden?', 'Regel: $\\langle V\\rangle = \\tfrac12m\\omega^2\\langle x^2\\rangle$.', 'Setze $\\langle x^2\\rangle = \\frac{\\hbar}{2m\\omega}$ ein und kürze.'],
          model:['⟨V⟩ = 1/2 m ω^2 ⟨x^2⟩', '= 1/2 m ω^2 · ħ/(2mω)', '= ħω/4']},
        {id:'b', prompt:'b) Berechne $\\langle T\\rangle$.', type:'value', target:'ħω/4', points:2,
          hints:['Du musst nicht ableiten: Die Gesamtenergie ist bekannt.', 'Regel: $\\langle H\\rangle = \\langle T\\rangle + \\langle V\\rangle$, weil der Erwartungswert linear ist.', 'Nächster Schritt: $\\langle T\\rangle = \\tfrac12\\hbar\\omega - \\langle V\\rangle$.'],
          model:['⟨T⟩ = ⟨H⟩ - ⟨V⟩', '= ħω/2 - ħω/4', '= ħω/4']},
        {id:'c', prompt:'c) Berechne $\\Delta x\\,\\Delta p$. (Es gilt $\\langle x\\rangle = \\langle p\\rangle = 0$ und $\\langle p^2\\rangle = 2m\\langle T\\rangle$.)', type:'value', target:'ħ/2', points:2,
          hints:['Unschärfe heißt Standardabweichung. Bestimme $\\Delta x$ und $\\Delta p$ einzeln.', 'Regel: $\\Delta x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$, ebenso für $p$.', 'Nächster Schritt: $\\Delta x = \\sqrt{\\hbar/(2m\\omega)}$ und $\\langle p^2\\rangle = 2m\\cdot\\frac{\\hbar\\omega}{4}$.'],
          model:['Δx = sqrt(ħ/(2mω))', 'Δp = sqrt(mħω/2)', 'Δx Δp = ħ/2'], note:'Der Grundzustand erreicht die Unschärfegrenze exakt.'}
      ]},
    {id:'osz-p3', title:'Der erste angeregte Zustand in Ortsdarstellung',
      text:'$\\psi_1(x) = A\\,x\\,e^{-m\\omega x^2/(2\\hbar)}$ und $\\hat H = -\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2} + \\frac12m\\omega^2x^2$.',
      ctx:{coords:['x'], params:{m:'pos', ω:'pos'}, defs:{'ψ_1(x)':'A x e^(-m ω x^2/(2ħ))', 'V(x)':'1/2 m ω^2 x^2'}, unknowns:{A:{ref:'(4/π)^(1/4) (m ω/ħ)^(3/4)', alt:['-(4/π)^(1/4) (m ω/ħ)^(3/4)']}, E:{ref:'3/2 ħ ω'}}},
      goals:[
        {id:'a', prompt:'a) Zeige, dass $\\psi_1$ Eigenfunktion von $\\hat H$ ist, und bestimme $E$.', type:'solve', unknown:'E', points:3,
          hints:['Rechne $\\hat H\\psi_1$ aus und prüfe, ob ein Vielfaches von $\\psi_1$ herauskommt.', 'Zweimal Produktregel: $\\psi_1\'\' = \\left(\\frac{m^2\\omega^2x^2}{\\hbar^2} - \\frac{3m\\omega}{\\hbar}\\right)\\psi_1$.', 'Die $x^2$-Terme heben sich mit dem Potential weg; was übrig bleibt, ist $E$.'],
          model:['ψ_1\'\' = (m^2 ω^2 x^2/ħ^2 - 3mω/ħ) ψ_1', 'Ĥ ψ_1 = -ħ^2/(2m) (m^2 ω^2 x^2/ħ^2 - 3mω/ħ) ψ_1 + 1/2 m ω^2 x^2 ψ_1', '= 3/2 ħω ψ_1', 'E = 3/2 ħω']},
        {id:'b', prompt:'b) Normiere: Bestimme $A > 0$.', type:'solve', unknown:'A', points:2,
          hints:['Normieren heißt $\\int|\\psi_1|^2dx = 1$; es bleibt ein Gauß-Moment.', 'Regel: $\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\alpha = m\\omega/\\hbar$.', 'Nächster Schritt: $|A|^2\\frac{\\hbar}{2m\\omega}\\sqrt{\\frac{\\pi\\hbar}{m\\omega}} = 1$ nach $A$ auflösen.'],
          model:['|A|^2 ∫_-∞^∞ x^2 e^(-mω x^2/ħ) dx = 1', '|A|^2 ħ/(2mω) sqrt(πħ/(mω)) = 1', 'A = (4/π)^(1/4) (mω/ħ)^(3/4)']}
      ]},
    {id:'osz-p4', title:'Schwingender Erwartungswert',
      text:'Zur Zeit $t$ ist $|\\psi(t)\\rangle = \\frac{1}{\\sqrt2}\\left(e^{-i\\omega t/2}|0\\rangle + e^{-3i\\omega t/2}|1\\rangle\\right)$. Mit `⟨x⟩` ist der Erwartungswert in diesem Zustand gemeint.',
      ctx:OSZ_MAT({states:{ψ:'(e^(-iωt/2)|0⟩ + e^(-3iωt/2)|1⟩)/sqrt(2)'}, state:'ψ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle x\\rangle(t)$.', type:'value', target:'sqrt(ħ/(2mω)) cos(ωt)', points:3,
          hints:['Bilde $\\langle\\psi(t)|x|\\psi(t)\\rangle$ mit den gegebenen Phasen; nur Mischterme können beitragen.', 'Regel: $x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(a + a^\\dagger)$; nur $\\langle 0|a|1\\rangle = 1$ und $\\langle 1|a^\\dagger|0\\rangle = 1$ tragen bei.', 'Nächster Schritt: Die Phasen ergeben $\\tfrac12(e^{-i\\omega t} + e^{i\\omega t}) = \\cos(\\omega t)$.'],
          model:['⟨x⟩ = sqrt(ħ/(2mω)) ⟨ψ|(a + a†)|ψ⟩', '= sqrt(ħ/(2mω)) · 1/2 (e^(-iωt) + e^(iωt))', '= sqrt(ħ/(2mω)) cos(ωt)']},
        {id:'b', prompt:'b) Berechne $\\langle p\\rangle(t)$ mit Ehrenfest: $\\langle p\\rangle = m\\,\\frac{d}{dt}\\langle x\\rangle$.', type:'value', target:'-sqrt(m ħ ω/2) sin(ωt)', points:2,
          hints:['Du brauchst nur das Ergebnis aus a) und eine Zeitableitung.', 'Regel: $\\frac{d}{dt}\\cos(\\omega t) = -\\omega\\sin(\\omega t)$.', 'Nächster Schritt: $m\\omega\\sqrt{\\frac{\\hbar}{2m\\omega}} = \\sqrt{\\frac{m\\hbar\\omega}{2}}$.'],
          model:['⟨p⟩ = m d/dt ⟨x⟩', '= -m ω sqrt(ħ/(2mω)) sin(ωt)', '= -sqrt(mħω/2) sin(ωt)']}
      ]},
    {id:'osz-p5', title:'Normierung der Leiterzustände',
      text:'Es gilt $a^\\dagger|n\\rangle = c\\,|n+1\\rangle$ mit einer Konstanten $c > 0$. Bestimme $c$ aus der Norm.',
      ctx:OSZ_MAT({unknowns:{c:{ref:'sqrt(n + 1)'}}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle n|a\\,a^\\dagger|n\\rangle = \\|a^\\dagger|n\\rangle\\|^2$.', type:'value', target:'n + 1', points:2,
          hints:['Bringe $a\\,a^\\dagger$ in eine Form, deren Wirkung auf $|n\\rangle$ du kennst.', 'Regel: $a a^\\dagger = a^\\dagger a + 1$.', 'Nächster Schritt: $\\langle n|a^\\dagger a|n\\rangle = n$ und $\\langle n|n\\rangle = 1$.'],
          model:['⟨n|a a†|n⟩ = ⟨n|(a† a + 1)|n⟩', '= n + 1']},
        {id:'b', prompt:'b) Bestimme $c$.', type:'solve', unknown:'c', points:2,
          hints:['Vergleiche die Norm beider Seiten von $a^\\dagger|n\\rangle = c\\,|n+1\\rangle$.', 'Rechts steht $|c|^2\\langle n+1|n+1\\rangle = c^2$, links das Ergebnis aus a).', 'Nächster Schritt: $c^2 = n + 1$ mit $c > 0$.'],
          model:['a†|n⟩ = c |n+1⟩', 'c^2 = n + 1', 'c = sqrt(n + 1)']}
      ]},
    {id:'osz-p6', synth:true, title:'Synthese: ein präparierter Oszillator',
      text:'Diese Aufgabe verbindet Normieren (Thema 1), Zeitentwicklung (Thema 2), Messung (Thema 6) und Leiteroperatoren. Ein Oszillator wird bei $t = 0$ im Zustand $|\\psi(0)\\rangle = A\\left(|0\\rangle + \\sqrt2\\,|1\\rangle\\right)$ mit $A > 0$ präpariert. Im Tutorial ist `ψ` schon der normierte, zeitentwickelte Zustand $|\\psi(t)\\rangle$; `H` und `x` sind wie in den anderen Aufgaben definiert.',
      ctx:OSZ_MAT({states:{ψ:'(e^(-iωt/2)|0⟩ + sqrt(2) e^(-3iωt/2)|1⟩)/sqrt(3)'}, state:'ψ', unknowns:{A:{ref:'1/sqrt(3)'}}}),
      goals:[
        {id:'a', prompt:'a) Normiere: Bestimme $A$.', type:'solve', unknown:'A', points:2,
          hints:['Normieren heißt $\\langle\\psi|\\psi\\rangle = 1$.', 'Regel: Für orthonormale $|n\\rangle$ ist $\\langle\\psi|\\psi\\rangle = \\sum_n|c_n|^2$.', 'Nächster Schritt: $|A|^2(1 + 2) = 1$.'],
          model:['|A|^2 (1^2 + sqrt(2)^2) = 1', '3 A^2 = 1', 'A = 1/sqrt(3)']},
        {id:'b', prompt:'b) Berechne den Erwartungswert der Energie $\\langle H\\rangle$.', type:'value', target:'7/6 ħ ω', points:2,
          hints:['Entwickle nach Eigenzuständen; jede Energie zählt mit ihrem Gewicht $|c_n|^2$.', 'Regel: $\\langle H\\rangle = \\sum_n|c_n|^2E_n$ mit $E_n = \\hbar\\omega(n + \\tfrac12)$.', 'Nächster Schritt: $\\tfrac13\\cdot\\tfrac12\\hbar\\omega + \\tfrac23\\cdot\\tfrac32\\hbar\\omega$.'],
          model:['⟨H⟩ = 1/3 · 1/2 ħω + 2/3 · 3/2 ħω', '= 7/6 ħω'], note:'$\\langle H\\rangle$ hängt nicht von $t$ ab: Die Gewichte $|c_n|^2$ ändern sich bei der Zeitentwicklung nicht.'},
        {id:'c', prompt:'c) Berechne $\\langle x\\rangle(t)$.', type:'value', target:'2/3 sqrt(ħ/(mω)) cos(ωt)', points:3,
          hints:['Jeder Anteil bekommt seine Phase $e^{-iE_nt/\\hbar}$; dann $x$ durch $a$, $a^\\dagger$ ausdrücken.', 'Regel: $\\langle x\\rangle = \\sqrt{\\frac{\\hbar}{2m\\omega}}\\cdot 2\\,\\mathrm{Re}(c_0^*c_1)$ für einen Zustand aus $|0\\rangle$ und $|1\\rangle$.', 'Nächster Schritt: $c_0^*c_1 = \\frac{\\sqrt2}{3}e^{-i\\omega t}$.'],
          model:['⟨x⟩ = sqrt(ħ/(2mω)) ⟨ψ|(a + a†)|ψ⟩', '= sqrt(ħ/(2mω)) · 2 sqrt(2)/3 cos(ωt)', '= 2/3 sqrt(ħ/(mω)) cos(ωt)']},
        {id:'d', prompt:'d) Bestimme die Energieunschärfe $\\Delta H = \\sqrt{\\langle H^2\\rangle - \\langle H\\rangle^2}$.', type:'value', target:'sqrt(2)/3 ħ ω', points:2,
          hints:['Berechne zuerst $\\langle H^2\\rangle$ auf dieselbe Weise wie $\\langle H\\rangle$.', 'Regel: $\\langle H^2\\rangle = \\sum_n|c_n|^2E_n^2$.', 'Nächster Schritt: $\\langle H^2\\rangle = \\tfrac13\\left(\\tfrac{\\hbar\\omega}{2}\\right)^2 + \\tfrac23\\left(\\tfrac{3\\hbar\\omega}{2}\\right)^2 = \\tfrac{19}{12}\\hbar^2\\omega^2$.'],
          model:['⟨H^2⟩ = 1/3 (ħω/2)^2 + 2/3 (3ħω/2)^2', '= 19/12 ħ^2 ω^2', 'ΔH = sqrt(⟨H^2⟩ - ⟨H⟩^2)', '= sqrt(19/12 - 49/36) ħω', '= sqrt(2)/3 ħω']},
        {id:'e', prompt:'e) Zur Zeit $t$ wird die Energie gemessen. Mit welcher Wahrscheinlichkeit erhält man $\\tfrac32\\hbar\\omega$?', type:'value', target:'2/3', points:1,
          hints:['Welcher Eigenzustand gehört zu $\\tfrac32\\hbar\\omega$?', 'Regel (Messpostulat): $P(E_n) = |\\langle n|\\psi\\rangle|^2$.', 'Nächster Schritt: Die Phase hat den Betrag 1; es bleibt $|\\sqrt2/\\sqrt3|^2$.'],
          model:['|⟨1|ψ⟩|^2 = 2/3']},
        {id:'f', prompt:'f) Die Messung hat $\\tfrac32\\hbar\\omega$ ergeben. Berechne danach die Ortsunschärfe $\\Delta x$.', type:'value', target:'sqrt(3ħ/(2mω))', points:2,
          hints:['Nach der Messung ist das System im zugehörigen Eigenzustand – welcher ist das?', 'Regel: $\\Delta x = \\sqrt{\\langle 1|x^2|1\\rangle - \\langle 1|x|1\\rangle^2}$ mit $\\langle n|x^2|n\\rangle = \\frac{\\hbar}{2m\\omega}(2n+1)$.', 'Nächster Schritt: $\\langle 1|x|1\\rangle = 0$ und $\\langle 1|x^2|1\\rangle = \\frac{3\\hbar}{2m\\omega}$.'],
          model:['⟨1|x^2|1⟩ = 3ħ/(2mω)', '⟨1|x|1⟩ = 0', 'sqrt(⟨1|x^2|1⟩ - ⟨1|x|1⟩^2) = sqrt(3ħ/(2mω))'],
          note:'Nach der Messung ist der Zustand $|1\\rangle$ stationär: $\\langle x\\rangle$ schwingt nicht mehr, und eine zweite Energiemessung liefert sicher wieder $\\tfrac32\\hbar\\omega$.'}
      ]}
  ],
  sketch:[
    {id:'osz-s1', title:'$\\psi_3$ im Parabelpotential', kind:'curve', draw:'psi',
      text:'Skizziere die Eigenfunktion $\\psi_3(x)$ des harmonischen Oszillators. Gegeben sind das Potential (grau), die Energie $E_3 = \\tfrac72\\hbar\\omega$ (gestrichelt) und die klassischen Umkehrpunkte $\\pm\\sqrt7\\,x_0$ mit $x_0 = \\sqrt{\\hbar/(m\\omega)}$. Die Höhe ist frei.',
      plot:{x:[-4.5, 4.5], xlab:'x/x_0', ylab:'\\psi_3(x)', ticks:[{x:-OSZ_SK.xt(3), lab:'-\\sqrt7'}, {x:0, lab:'0'}, {x:OSZ_SK.xt(3), lab:'\\sqrt7'}], V:x => x * x / 2, Vr:[0, 6], E:3.5},
      f:OSZ_SK.psi(3),
      checks:[
        {id:'knoten', type:'nodes', n:3, msg:'Wie viele Nullstellen hat $\\psi_3$? Deine Skizze hat {got}. (Abschnitt ‚Eigenfunktionen in Ortsdarstellung‘)'},
        {id:'sym', type:'parity', p:'odd', about:0, msg:'Das Potential ist gerade. Welche Parität hat dann $\\psi_3$? Deine Skizze ist {got}.'},
        {id:'links', name:'Abklingen links', type:'decay', toward:'left', range:[-4.5, -OSZ_SK.xt(3)], msg:'Ist der Bereich links vom Umkehrpunkt erlaubt oder verboten? Was macht $\\psi_3$ dort?'},
        {id:'rechts', name:'Abklingen rechts', type:'decay', toward:'right', range:[OSZ_SK.xt(3), 4.5], msg:'Was macht $\\psi_3$ jenseits des rechten Umkehrpunkts, wo $E < V$ ist?'}
      ],
      reveal:'$\\psi_3 \\propto (8\\xi^3 - 12\\xi)\\,e^{-\\xi^2/2}$ mit $\\xi = x/x_0$: drei Knoten bei $0$ und $\\pm\\sqrt{3/2}\\,x_0$, ungerade wie $(-1)^3$. Zwischen den Umkehrpunkten ist $E > V$; dort krümmt sich $\\psi$ zur Achse hin und schwingt. Jenseits davon ist $E < V$: $\\psi$ krümmt sich von der Achse weg und fällt rasch ab, ist aber nicht null.',
      hints:['Kläre zuerst Knotenzahl und Parität. Überlege dann getrennt, was innerhalb und außerhalb der Umkehrpunkte passiert.', '$\\psi_n$ hat $n$ Knoten und die Parität $(-1)^n$. Wo $E < V$ ist, hat $\\psi\'\'$ dasselbe Vorzeichen wie $\\psi$: Die Funktion klingt ab, statt zu schwingen.'],
      wrong:[
        {f:OSZ_SK.psi(4), fails:['knoten', 'sym'], why:'einen Knoten zu viel ($n + 1$ Knoten, mit der Zahl der Buckel verwechselt)'},
        {f:OSZ_SK.psi(2), fails:['knoten', 'sym'], why:'einen Knoten zu wenig: Zählung wie im Kasten, wo $\\psi_n$ nur $n - 1$ Knoten hat'},
        {f:x => Math.abs(x) < OSZ_SK.xt(3) ? Math.sin(2 * Math.PI * x / OSZ_SK.xt(3)) : 0, fails:['links', 'rechts'], why:'harte Wand am Umkehrpunkt: $\\psi = 0$ im klassisch verbotenen Bereich'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'osz-f3', title:'Der Aufsteiger hebt die Energie', text:'Besetzungszahlbasis; `H` ist $\\hbar\\omega(a^\\dagger a + \\tfrac12)$, `a` und `a†` sind die Leiteroperatoren.',
      ctx:OSZ_MAT(),
      goals:[{id:'a', prompt:'Zeige $[H, a^\\dagger] = \\hbar\\omega\\,a^\\dagger$.', type:'show', from:'[H, a†]', to:'ħω a†', points:3, model:['[H, a†] = ħω [a† a, a†]', '= ħω a† [a, a†]', '= ħω a†']}]}},
    {aim:1, task:{id:'osz-f4', title:'Grundzustand im Impulsraum', text:'In der Impulsdarstellung ist der Grundzustand eine Funktion $\\varphi_0(p)$. Dort multipliziert $\\hat p$ mit $p$, und es gilt $\\hat x = i\\hbar\\,d/dp$. Auch hier erfüllt der Grundzustand $\\hat a\\varphi_0 = 0$ mit $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x + \\frac{i}{m\\omega}\\hat p\\right)$. Im Tutorial heißt die Funktion `φ_0`.',
      ctx:{coords:['p'], params:{m:'pos', ω:'pos'}, defs:{'φ_0(p)':'B e^(-p^2/(2 m ω ħ))'}, unknowns:{B:{ref:'(π m ω ħ)^(-1/4)', alt:['-(π m ω ħ)^(-1/4)']}, γ:{ref:'-1/(m ω ħ)', kind:'real'}}, state:'φ_0'},
      goals:[
        {id:'a', prompt:'a) Schreibe $\\hat a\\varphi_0 = 0$ als Differentialgleichung der Form $\\varphi_0\' = \\gamma\\,p\\,\\varphi_0$. Bestimme $\\gamma$.', type:'solve', unknown:'γ', points:2,
          model:['iħ dφ_0/dp + i p/(mω) φ_0 = 0', 'dφ_0/dp = γ p φ_0', 'γ = -1/(mωħ)']},
        {id:'b', prompt:'b) Die Lösung ist $\\varphi_0 = B\\,e^{\\gamma p^2/2}$. Normiere sie ($B > 0$) und berechne $\\langle p^2\\rangle$.', type:'value', target:'m ħ ω/2', points:3,
          model:['|B|^2 ∫_-∞^∞ e^(-p^2/(mωħ)) dp = 1', '|B|^2 = 1/sqrt(π m ω ħ)', '⟨p^2⟩ = |B|^2 ∫_-∞^∞ p^2 e^(-p^2/(mωħ)) dp', '= 1/sqrt(π m ω ħ) · mωħ/2 · sqrt(π m ω ħ)', '= mħω/2']}
      ]}},
    {aim:2, task:{id:'osz-f1', title:'Matrixelement und schwingender Erwartungswert', text:'Besetzungszahlbasis; `x` ist der Ortsoperator, `a` und `a†` die Leiteroperatoren. In b) ist `ψ` der zeitentwickelte Zustand $|\\psi(t)\\rangle$, und `⟨x⟩` ist der Erwartungswert darin.',
      ctx:OSZ_MAT({states:{ψ:'(e^(-5iωt/2)|2⟩ + e^(-7iωt/2)|3⟩)/sqrt(2)'}, state:'ψ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle 2|x^2|0\\rangle$.', type:'value', target:'ħ/(2mω) sqrt(2)', points:2, model:['⟨2|x^2|0⟩ = ħ/(2mω) ⟨2|(a + a†)^2|0⟩', '= ħ/(2mω) ⟨2|a† a†|0⟩', '= ħ/(2mω) sqrt(2)']},
        {id:'b', prompt:'b) Bei $t = 0$ ist der Oszillator im Zustand $\\frac{1}{\\sqrt2}(|2\\rangle + |3\\rangle)$. Berechne $\\langle x\\rangle(t)$.', type:'value', target:'sqrt(3ħ/(2mω)) cos(ωt)', points:3,
          model:['|ψ(t)⟩ = (e^(-5iωt/2)|2⟩ + e^(-7iωt/2)|3⟩)/sqrt(2)', '⟨x⟩ = sqrt(ħ/(2mω)) ⟨ψ|(a + a†)|ψ⟩', '= sqrt(ħ/(2mω)) · 1/2 · sqrt(3) (e^(-iωt) + e^(iωt))', '= sqrt(3ħ/(2mω)) cos(ωt)']}
      ]}},
    {aim:'k', id:'osz-fk1', type:'mc2',
      q:'Ein Oszillator ist im Zustand $\\frac{1}{\\sqrt2}(|1\\rangle + |2\\rangle)$. Man misst die Energie. Welche Ergebnisse sind möglich?', opts:['$\\tfrac32\\hbar\\omega$ oder $\\tfrac52\\hbar\\omega$', 'nur der Mittelwert $2\\hbar\\omega$', 'jeder Wert zwischen $\\tfrac32\\hbar\\omega$ und $\\tfrac52\\hbar\\omega$'], a:0,
      ex:'Jedes Ergebnis ist ein Eigenwert, hier je mit Wahrscheinlichkeit $\\tfrac12$. Der Erwartungswert $2\\hbar\\omega$ ist der Mittelwert vieler Messungen, kein mögliches Einzelergebnis.',
      reason:{q:'Warum?', opts:['Eine Messung liefert stets einen Eigenwert von $\\hat H$.', 'Eine Messung liefert stets den Erwartungswert.', 'In Überlagerungen ist die Energie kontinuierlich verteilt.'], a:0, ex:'Messpostulat: mögliche Ergebnisse sind die Eigenwerte $E_n$, mit Wahrscheinlichkeit $|\\langle n|\\psi\\rangle|^2$.'}},
    {aim:'k', id:'osz-fk2', type:'dialog',
      text:'Ein Oszillator ist im Grundzustand $\\psi_0$.',
      people:[
        {name:'Lena', says:'Im Grundzustand ist $\\langle x\\rangle = 0$ und $\\langle p\\rangle = 0$. Das Teilchen ruht also im Minimum, und seine kinetische Energie ist null.'},
        {name:'Jonas', says:'Aus $\\langle p\\rangle = 0$ folgt nicht $\\langle p^2\\rangle = 0$. Die mittlere kinetische Energie ist $\\tfrac14\\hbar\\omega$.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:1,
      ex:'$\\langle T\\rangle = \\langle p^2\\rangle/(2m) = \\tfrac14\\hbar\\omega$ – die Hälfte der Nullpunktsenergie. $\\langle p\\rangle = 0$ heißt nur, dass positive und negative Impulse gleich wahrscheinlich sind.'},
    {aim:2, sketch:{id:'osz-fs1', title:'$\\langle x\\rangle(t)$ für $(|0\\rangle + i|1\\rangle)/\\sqrt2$', kind:'curve', draw:'f',
      text:'Ein Oszillator ist bei $t = 0$ im Zustand $\\frac{1}{\\sqrt2}\\big(|0\\rangle + i|1\\rangle\\big)$. Skizziere $\\langle x\\rangle(t)$ für $0 \\le t \\le 2T$ mit $T = 2\\pi/\\omega$. Die Höhe ist frei; es zählen Vorzeichen, Nullstellen und Periode.',
      plot:{x:[0, 2], xlab:'t', ylab:'\\langle x\\rangle', ticks:OSZ_SK.T},
      // <x>(t) = sqrt(ħ/(2mω)) · 2 Re(c0* c1 e^{−iωt}) mit c0* c1 = i/2: = sqrt(ħ/(2mω)) sin ωt (t in Einheiten von T)
      f:t => Math.sin(2 * Math.PI * t),
      checks:[
        {id:'start', name:'Startwert', type:'zero', at:[0], msg:'Wie groß ist $\\langle x\\rangle$ bei $t = 0$? Rechne $\\langle\\psi(0)|\\hat a + \\hat a^\\dagger|\\psi(0)\\rangle$ mit den Koeffizienten aus.'},
        {id:'richtung', name:'Startrichtung', type:'sign', s:1, range:[0.06, 0.44], msg:'In welche Richtung läuft $\\langle x\\rangle$ zuerst? Achte auf die Phase des Mischterms $c_0^*c_1$.'},
        {id:'periode', name:'Periode', type:'nodes', n:3, range:[0.1, 1.9], msg:'Mit welcher Kreisfrequenz schwingt $\\langle x\\rangle$? Zwischen $T/10$ und $19T/10$ hat deine Skizze {got} Nulldurchgänge.'}
      ],
      reveal:'Der Mischterm ist $c_0^*c_1 = \\tfrac{i}{2}$, also $\\delta = \\pi/2$ und $\\langle x\\rangle = \\sqrt{\\tfrac{\\hbar}{2m\\omega}}\\cos(\\omega t - \\tfrac\\pi2) = \\sqrt{\\tfrac{\\hbar}{2m\\omega}}\\sin\\omega t$. $\\langle x\\rangle$ startet bei null, läuft zuerst ins Positive und schwingt mit $\\omega$, der Frequenz zum Abstand $\\hbar\\omega$ benachbarter Niveaus. In $2T$ passen zwei volle Schwingungen.',
      wrong:[
        {f:t => Math.cos(2 * Math.PI * t), fails:['start', 'periode'], why:'Phase $i$ übersehen: Start im Maximum wie bei reellen Koeffizienten'},
        {f:t => -Math.sin(2 * Math.PI * t), fails:['richtung'], why:'Vorzeichen der Phase vertauscht, z. B. $c_1^*c_0$ statt $c_0^*c_1$'},
        {f:t => Math.sin(4 * Math.PI * t), fails:['periode'], why:'Frequenz $2\\omega$, mit der Schwingung von $\\langle x^2\\rangle$ verwechselt'}
      ], points:3}}
  ],
  finalB:[
    {aim:0, task:{id:'osz-f5', title:'Besetzungszahl und Aufsteiger', text:'Besetzungszahlbasis; `N` ist $a^\\dagger a$, `a` und `a†` sind die Leiteroperatoren.',
      ctx:OSZ_MAT(),
      goals:[{id:'a', prompt:'Zeige $[N, a^\\dagger] = a^\\dagger$.', type:'show', from:'[N, a†]', to:'a†', points:3, model:['[N, a†] = [a† a, a†]', '= a† [a, a†]', '= a†']}]}},
    {aim:1, task:{id:'osz-f6', title:'Oszillator mit verschobener Ruhelage', text:'Das Potential ist $V(x) = \\tfrac12m\\omega^2(x - x_0)^2$ mit einer festen Verschiebung $x_0$. Der Absteiger ist dann $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x - x_0 + \\frac{i}{m\\omega}\\hat p\\right)$, und der Grundzustand erfüllt $\\hat a\\psi_0 = 0$. Rechne in Ortsdarstellung mit $\\hat p = -i\\hbar\\,d/dx$.',
      ctx:{coords:['x'], params:{m:'pos', ω:'pos', x_0:'real'}, defs:{'ψ_0(x)':'A e^(-m ω (x - x_0)^2/(2ħ))'}, unknowns:{A:{ref:'(m ω/(π ħ))^(1/4)', alt:['-(m ω/(π ħ))^(1/4)']}, β:{ref:'-m ω/ħ', kind:'real'}}, state:'ψ_0'},
      goals:[
        {id:'a', prompt:'a) Schreibe $\\hat a\\psi_0 = 0$ als Differentialgleichung der Form $\\psi_0\' = \\beta\\,(x - x_0)\\,\\psi_0$. Bestimme $\\beta$.', type:'solve', unknown:'β', points:2,
          model:['(x - x_0) ψ_0 + ħ/(mω) dψ_0/dx = 0', 'dψ_0/dx = β (x - x_0) ψ_0', 'β = -mω/ħ']},
        {id:'b', prompt:'b) Die Lösung ist $\\psi_0 = A\\,e^{\\beta(x - x_0)^2/2}$. Normiere sie ($A > 0$) und berechne $\\langle x^2\\rangle$.', type:'value', target:'x_0^2 + ħ/(2mω)', points:3,
          model:['|A|^2 ∫_-∞^∞ e^(-mω (x - x_0)^2/ħ) dx = 1', '|A|^2 = sqrt(mω/(πħ))', '⟨x^2⟩ = |A|^2 ∫_-∞^∞ x^2 e^(-mω (x - x_0)^2/ħ) dx', '= sqrt(mω/(πħ)) ∫_-∞^∞ (u + x_0)^2 e^(-mω u^2/ħ) du', '= sqrt(mω/(πħ)) (ħ/(2mω) sqrt(πħ/(mω)) + x_0^2 sqrt(πħ/(mω)))', '= x_0^2 + ħ/(2mω)']}
      ]}},
    {aim:2, task:{id:'osz-f7', title:'Impuls-Matrixelement und schwingender Erwartungswert', text:'Besetzungszahlbasis; `p` ist der Impulsoperator, `x` der Ortsoperator, `a` und `a†` die Leiteroperatoren. In b) ist `ψ` der zeitentwickelte Zustand $|\\psi(t)\\rangle$, und `⟨x⟩` ist der Erwartungswert darin.',
      ctx:OSZ_MAT({states:{ψ:'(e^(-7iωt/2)|3⟩ + e^(-9iωt/2)|4⟩)/sqrt(2)'}, state:'ψ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle 3|p^2|1\\rangle$.', type:'value', target:'-mħω/2 sqrt(6)', points:2, model:['⟨3|p^2|1⟩ = -mħω/2 ⟨3|(a† - a)^2|1⟩', '= -mħω/2 ⟨3|a† a†|1⟩', '= -mħω/2 sqrt(6)']},
        {id:'b', prompt:'b) Bei $t = 0$ ist der Oszillator im Zustand $\\frac{1}{\\sqrt2}(|3\\rangle + |4\\rangle)$. Berechne $\\langle x\\rangle(t)$.', type:'value', target:'sqrt(2ħ/(mω)) cos(ωt)', points:3,
          model:['|ψ(t)⟩ = (e^(-7iωt/2)|3⟩ + e^(-9iωt/2)|4⟩)/sqrt(2)', '⟨x⟩ = sqrt(ħ/(2mω)) ⟨ψ|(a + a†)|ψ⟩', '= sqrt(ħ/(2mω)) · 1/2 · 2 (e^(-iωt) + e^(iωt))', '= sqrt(2ħ/(mω)) cos(ωt)']}
      ]}},
    {aim:'k', id:'osz-fk3', type:'mc2',
      q:'Viele Oszillatoren werden gleich präpariert, im Zustand $\\frac{1}{\\sqrt2}(|0\\rangle + |3\\rangle)$. An jedem misst man einmal die Energie. Welche Einzelergebnisse treten auf?', opts:['nur $\\tfrac12\\hbar\\omega$ und $\\tfrac72\\hbar\\omega$', 'bei jedem Oszillator $2\\hbar\\omega$', 'Werte zwischen $\\tfrac12\\hbar\\omega$ und $\\tfrac72\\hbar\\omega$, gehäuft um $2\\hbar\\omega$'], a:0,
      ex:'Jede Einzelmessung liefert einen Eigenwert, hier jeden in etwa der Hälfte der Fälle. Der Mittelwert $2\\hbar\\omega$ ist kein Eigenwert und tritt bei keiner Einzelmessung auf.',
      reason:{q:'Warum?', opts:['Messergebnisse sind Eigenwerte von $\\hat H$.', 'Jeder einzelne Oszillator hat die mittlere Energie.', 'Überlagerungen haben ein kontinuierliches Spektrum.'], a:0, ex:'Messpostulat: Mögliche Ergebnisse sind die Eigenwerte $E_n = \\hbar\\omega(n + \\tfrac12)$, mit Wahrscheinlichkeit $|\\langle n|\\psi\\rangle|^2$. Das Spektrum von $\\hat H$ bleibt diskret, gleich welcher Zustand präpariert ist.'}},
    {aim:'k', id:'osz-fk4', type:'dialog',
      text:'Ein Oszillator ist im ersten angeregten Zustand $\\psi_1$.',
      people:[
        {name:'Lena', says:'In $\\psi_1$ ist $\\langle x\\rangle = 0$. Das Teilchen ist also im Mittel im Minimum, und die mittlere potentielle Energie $\\langle V\\rangle$ ist null.'},
        {name:'Jonas', says:'Aus $\\langle x\\rangle = 0$ folgt nicht $\\langle x^2\\rangle = 0$. Die mittlere potentielle Energie ist $\\tfrac34\\hbar\\omega$.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:1,
      ex:'$\\langle V\\rangle = \\tfrac12m\\omega^2\\langle x^2\\rangle = \\tfrac12m\\omega^2\\cdot\\frac{3\\hbar}{2m\\omega} = \\tfrac34\\hbar\\omega$ – die Hälfte von $E_1 = \\tfrac32\\hbar\\omega$. $\\langle x\\rangle = 0$ heißt nur, dass Auslenkungen nach links und rechts gleich wahrscheinlich sind.'},
    {aim:2, sketch:{id:'osz-fs2', title:'$\\langle x\\rangle(t)$ für $(|1\\rangle - i|2\\rangle)/\\sqrt2$', kind:'curve', draw:'f',
      text:'Ein Oszillator ist bei $t = 0$ im Zustand $\\frac{1}{\\sqrt2}\\big(|1\\rangle - i|2\\rangle\\big)$. Skizziere $\\langle x\\rangle(t)$ für $0 \\le t \\le 2T$ mit $T = 2\\pi/\\omega$. Die Höhe ist frei; es zählen Vorzeichen, Nullstellen und Periode.',
      plot:{x:[0, 2], xlab:'t', ylab:'\\langle x\\rangle', ticks:OSZ_SK.T},
      // <x>(t) = sqrt(ħ/(2mω)) · 2 Re(c1* c2 √2 e^{−iωt}) mit c1* c2 = −i/2: = −sqrt(ħ/(mω)) sin ωt (t in Einheiten von T)
      f:t => -Math.sin(2 * Math.PI * t),
      checks:[
        {id:'start', name:'Startwert', type:'zero', at:[0], msg:'Wie groß ist $\\langle x\\rangle$ bei $t = 0$? Rechne $\\langle\\psi(0)|\\hat a + \\hat a^\\dagger|\\psi(0)\\rangle$ mit den Koeffizienten aus.'},
        {id:'richtung', name:'Startrichtung', type:'sign', s:-1, range:[0.06, 0.44], msg:'In welche Richtung läuft $\\langle x\\rangle$ zuerst? Achte auf die Phase des Mischterms $c_1^*c_2$.'},
        {id:'periode', name:'Periode', type:'nodes', n:3, range:[0.1, 1.9], msg:'Mit welcher Kreisfrequenz schwingt $\\langle x\\rangle$? Zwischen $T/10$ und $19T/10$ hat deine Skizze {got} Nulldurchgänge.'}
      ],
      reveal:'Der Mischterm ist $c_1^*c_2 = -\\tfrac{i}{2}$, und $\\hat x$ verbindet $|1\\rangle$ und $|2\\rangle$ mit dem Faktor $\\sqrt2\\,\\sqrt{\\hbar/(2m\\omega)}$. Es folgt $\\langle x\\rangle = -\\sqrt{\\tfrac{\\hbar}{m\\omega}}\\sin\\omega t$. $\\langle x\\rangle$ startet bei null, läuft zuerst ins Negative und schwingt mit $\\omega$, der Frequenz zum Abstand $\\hbar\\omega$ benachbarter Niveaus. In $2T$ passen zwei volle Schwingungen.',
      wrong:[
        {f:t => -Math.cos(2 * Math.PI * t), fails:['start', 'periode'], why:'Phase $-i$ übersehen: Start im Extremum wie bei reellen Koeffizienten'},
        {f:t => Math.sin(2 * Math.PI * t), fails:['richtung'], why:'Vorzeichen der Phase vertauscht, z. B. $c_2^*c_1$ statt $c_1^*c_2$'},
        {f:t => -Math.sin(4 * Math.PI * t), fails:['periode'], why:'Frequenz $2\\omega$, mit der Schwingung von $\\langle x^2\\rangle$ verwechselt'}
      ], points:3}}
  ],
  errors:[
    {id:'osz-e1', title:'Ein vergessenes „+1“',
      text:'Gesucht ist $\\langle n|x^2|n\\rangle$:',
      ctx:OSZ_MAT(),
      lines:['⟨n|x^2|n⟩ = ħ/(2mω) ⟨n|(a + a†)^2|n⟩', '= ħ/(2mω) ⟨n|(a a† + a† a)|n⟩', '= ħ/(2mω) (n + n)', '= ħ n/(mω)'],
      wrong:2,
      why:{q:'Was ist in Zeile 3 falsch?', opts:['$\\langle n|a a^\\dagger|n\\rangle = n + 1$, nicht $n$.', '$\\langle n|a^\\dagger a|n\\rangle = n + 1$, nicht $n$.', 'Der Vorfaktor müsste quadriert werden.'], a:0, ex:'$a a^\\dagger = a^\\dagger a + 1$. Test: Für $n = 0$ käme $\\langle x^2\\rangle = 0$ heraus – unmöglich bei einer Gauß-Funktion.'},
      fix:{id:'a', prompt:'Berichtige und rechne zu Ende.', type:'value', target:'ħ/(2mω) (2n + 1)', model:['⟨n|x^2|n⟩ = ħ/(2mω) ⟨n|(a a† + a† a)|n⟩', '= ħ/(2mω) (n + 1 + n)', '= ħ/(2mω) (2n + 1)']}},
    {id:'osz-e2', title:'Ein Vorzeichen in der Grundzustandsgleichung',
      text:'Aus $\\hat a\\psi_0 = 0$ wird $\\psi_0$ bestimmt. Gesucht ist die Zahl $\\beta$ in $\\psi_0\' = \\beta\\,x\\,\\psi_0$:',
      ctx:OSZ_GROUND(),
      lines:['x ψ_0 + ħ/(mω) dψ_0/dx = 0', 'dψ_0/dx = mω/ħ x ψ_0', 'ψ_0(x) = A e^(mω x^2/(2ħ))'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Das Minuszeichen ging beim Auflösen verloren.', 'Der Faktor $m\\omega/\\hbar$ gehört in den Nenner.', 'Man darf nicht durch $\\hbar/(m\\omega)$ teilen.'], a:0, ex:'Richtig ist $\\psi_0\' = -\\frac{m\\omega}{\\hbar}x\\psi_0$. Mit dem falschen Vorzeichen wüchse $\\psi_0$ wie $e^{+x^2}$ – nicht normierbar. Das ist ein guter Plausibilitätstest.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $\\beta$.', type:'solve', unknown:'β', model:['x ψ_0 + ħ/(mω) dψ_0/dx = 0', 'dψ_0/dx = β x ψ_0', 'β = -mω/ħ']}}
  ]
});
lexe('leiteroperatoren', 'Leiteroperatoren (Oszillator)', '$\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x + \\frac{i}{m\\omega}\\hat p\\right)$, $\\hat a^\\dagger = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x - \\frac{i}{m\\omega}\\hat p\\right)$, $[\\hat a,\\hat a^\\dagger] = 1$. Wirkung: $\\hat a|n\\rangle = \\sqrt n|n-1\\rangle$, $\\hat a^\\dagger|n\\rangle = \\sqrt{n+1}|n+1\\rangle$, $\\hat a^\\dagger\\hat a|n\\rangle = n|n\\rangle$. Ortsdarstellung: $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(x + \\frac{\\hbar}{m\\omega}\\frac{d}{dx}\\right)$. $\\hat a$ ist nicht hermitesch und keine Observable.', {topic:'osz'});
lexe('oszillator-spektrum', 'Harmonischer Oszillator: Spektrum', '$V = \\tfrac12m\\omega^2x^2$, $\\hat H = \\hbar\\omega(\\hat a^\\dagger\\hat a + \\tfrac12)$, $E_n = \\hbar\\omega(n + \\tfrac12)$, $n = 0, 1, 2, \\dots$ Nullpunktsenergie $\\tfrac12\\hbar\\omega$, äquidistante Niveaus, keine Entartung in 1D.', {topic:'osz'});
lexe('hermite-funktionen', 'Eigenfunktionen des Oszillators', '$\\psi_n(x) = \\frac{1}{\\sqrt{2^nn!}}\\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}H_n(\\xi)e^{-\\xi^2/2}$, $\\xi = \\sqrt{m\\omega/\\hbar}\\,x$. Hermite-Polynome: $H_0 = 1$, $H_1 = 2\\xi$, $H_2 = 4\\xi^2 - 2$, $H_3 = 8\\xi^3 - 12\\xi$. Im Tutorial: `H_n(ξ)` oder `hermite(n, ξ)`.', {topic:'osz'});
lexe('osz-orts-impuls', 'Ort und Impuls durch Leiteroperatoren', '$\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$, $\\hat p = i\\sqrt{\\frac{m\\omega\\hbar}{2}}(\\hat a^\\dagger - \\hat a)$. Damit: $\\langle n|\\hat x^2|n\\rangle = \\frac{\\hbar}{2m\\omega}(2n+1)$, $\\langle n|\\hat p^2|n\\rangle = \\frac{m\\omega\\hbar}{2}(2n+1)$, $\\langle n\\pm1|\\hat x|n\\rangle = \\sqrt{\\frac{\\hbar}{2m\\omega}}\\sqrt{n + \\tfrac12 \\pm \\tfrac12}$.', {topic:'osz'});
lexe('osz-korrespondenz', 'Korrespondenzprinzip (Oszillator)', 'Für große Quantenzahlen nähern sich quantenmechanische Ergebnisse den klassischen: Das räumliche Mittel von $|\\psi_n|^2$ nähert sich der klassischen Aufenthaltsdichte $\\rho_{\\text{kl}} = 1/(\\pi\\sqrt{A^2 - x^2})$, die Knoten werden immer feiner. $\\langle x\\rangle$ und $\\langle p\\rangle$ folgen in jedem Zustand exakt der klassischen Bewegung mit $\\omega$ (Ehrenfest). $\\langle x^2\\rangle$ kann dagegen mit $2\\omega$ schwingen, etwa in $|0\\rangle + |2\\rangle$.', {topic:'osz'});
lexe('osz-molekuel', 'Molekülschwingungen und IR-Spektren', 'Eine Bindung nahe ihrem Gleichgewichtsabstand ist ein Oszillator mit $\\omega = \\sqrt{k/\\mu}$, $\\mu = m_1m_2/(m_1+m_2)$. Dipolübergänge haben im harmonischen Modell die Auswahlregel $\\Delta n = \\pm1$ und die Energie $\\hbar\\omega$. Beispiel HCl: Wellenzahl $2886\\,\\mathrm{cm^{-1}}$, $\\hbar\\omega \\approx 0{,}36\\,\\mathrm{eV}$, $k \\approx 480\\,\\mathrm{N/m}$ (aus der beobachteten Grundschwingung; mit der harmonischen Konstante $\\omega_e \\approx 2991\\,\\mathrm{cm^{-1}}$ ergeben sich etwa $516\\,\\mathrm{N/m}$). Schwache Obertöne bei knapp $2\\hbar\\omega$ zeigen: Weder das Dipolmoment ist exakt linear noch die Bindung exakt harmonisch. Dass sie knapp unter $2\\hbar\\omega$ liegen, zeigt die Anharmonizität der Bindung.', {topic:'osz'});
