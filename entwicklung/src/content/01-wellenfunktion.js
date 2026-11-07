/* ===== Thema 1: Wellenfunktion und Wahrscheinlichkeit ===== */
(function(){
const R = String.raw;
const DYN = (extra) => Object.assign({coords:['x', 't'], params:{m:'pos'}, abstract:{ψ:{args:['x', 't']}, V:{args:['x'], real:true}}, dyn:{fn:'ψ'}}, extra || {});
/* ---- Skizzenaufgaben (didaktik/SKIZZE.md): Musterfunktionen aus den exakten Lösungen, dimensionslos ---- */
const SK = (() => {
  const PI = Math.PI;
  /* wf-s1: |ψ|² für ψ = A (x + ia) e^{-x²/(2a²)}, a = 1: |ψ|² ∝ (x² + a²) e^{-x²/a²} (keine Nullstelle, gerade, oben flach: 1 − u⁴/2 + …) */
  const s1 = {
    id:'wf-sk1', title:'Dichte einer komplexen Wellenfunktion', kind:'curve', draw:'abs2',
    text:'Gegeben ist $\\psi(x) = A\\,(x + ia)\\,e^{-x^2/(2a^2)}$ mit $a > 0$ – die Funktion, die die Herleitung im Abschnitt „Wahrscheinlichkeitsdichte und Normierung“ normiert. Skizziere die Wahrscheinlichkeitsdichte $|\\psi(x)|^2$ von $-3a$ bis $3a$. Die Höhe ist frei, es kommt auf die Form an.',
    plot:{x:[-3, 3], xlab:'x', ylab:'|\\psi(x)|^2', ticks:[{x:-2, lab:'-2a'}, {x:-1, lab:'-a'}, {x:0, lab:'0'}, {x:1, lab:'a'}, {x:2, lab:'2a'}]},
    f:x => (x * x + 1) * Math.exp(-x * x),
    checks:[
      {id:'pos', type:'nonneg', msg:'Deine Kurve wird negativ (Minimum {got}). Was ergibt $\\psi^*\\psi$ für eine komplexe Zahl $\\psi = u + iv$?'},
      {id:'knoten', type:'nodes', n:0, msg:'Deine Dichte hat {got} Nullstelle(n). An welcher Stelle wären Real- **und** Imaginärteil von $x + ia$ gleichzeitig null?'},
      {id:'sym', type:'parity', p:'even', about:0, msg:'Was passiert mit $|x + ia|^2$, wenn du $x$ durch $-x$ ersetzt? Deine Skizze ist {got}.'}
    ],
    reveal:'$|\\psi|^2 = \\psi^*\\psi = |A|^2(x - ia)(x + ia)\\,e^{-x^2/a^2} = |A|^2(x^2 + a^2)\\,e^{-x^2/a^2}$. Der Faktor $x^2 + a^2$ ist nie null, denn Real- und Imaginärteil von $x + ia$ verschwinden nicht gleichzeitig. Deshalb hat die Dichte keine Nullstelle, obwohl $\\mathrm{Re}\\,\\psi$ bei $x = 0$ eine hat. Sie ist gerade und oben sehr flach, weil der Anstieg von $x^2 + a^2$ den Abfall der Gauß-Funktion bei kleinen $|x|$ fast ausgleicht.',
    hints:['Schreibe $|\\psi|^2 = \\psi^*\\psi$ aus und vereinfache $(x - ia)(x + ia)$.', 'Für eine komplexe Zahl ist $|z|^2 = (\\mathrm{Re}\\,z)^2 + (\\mathrm{Im}\\,z)^2$. Null ist das nur, wenn beide Teile null sind.'],
    wrong:[
      {f:x => x * x * Math.exp(-x * x), fails:['knoten'], why:'nur den Realteil quadriert: (Re ψ)² hat bei x = 0 einen Knoten, |ψ|² nicht'},
      {f:x => (x * x - 1) * Math.exp(-x * x), fails:['pos'], why:'ψ² statt ψ*ψ: Realteil von (x + ia)² = x² − a² + 2iax, in der Mitte negativ'},
      {f:x => x * Math.exp(-x * x / 2), fails:['pos', 'sym'], why:'ψ (Realteil) statt |ψ|² gezeichnet'}
    ]
  };
  /* wf-lab: |ψ|² für ψ = (ψ1 + ψ2)/√2 im Kasten, L = 1, ψn = √2 sin(nπx): |ψ|² = (sin πx + sin 2πx)²
     Maximum bei x ≈ 0,298 (|ψ|² ≈ 3,10), Nullstelle bei x = 2/3, rechter Buckel ≈ 0,135 (4 % des Maximums), ⟨x⟩ = 1/2 − 16/(9π²) ≈ 0,320 */
  const lab = {
    id:'wf-sk-lab', title:'Dichte einer Überlagerung im Kasten', kind:'curve', draw:'abs2',
    text:'Im Kasten $0 < x < L$ ist $\\psi = (\\psi_1 + \\psi_2)/\\sqrt2$ mit $\\psi_n = \\sqrt{2/L}\\,\\sin(n\\pi x/L)$. Skizziere $|\\psi(x)|^2$. Stell danach im Labor „(ψ₁ + ψ₂)/√2“ ein und vergleiche mit der dicken Kurve.',
    plot:{x:[-0.1, 1.1], dom:[0, 1], walls:[0, 1], xlab:'x', ylab:'|\\psi(x)|^2', ticks:[{x:0, lab:'0'}, {x:0.5, lab:'L/2'}, {x:1, lab:'L'}]},
    f:x => (Math.sin(PI * x) + Math.sin(2 * PI * x)) ** 2,
    checks:[
      {id:'pos', type:'nonneg', msg:'Deine Kurve wird negativ (Minimum {got}). Kann eine Wahrscheinlichkeitsdichte negativ sein?'},
      {id:'rand', name:'Null an den Wänden', type:'zero', at:[0, 1], msg:'Welchen Wert haben $\\psi_1$ und $\\psi_2$ an den Wänden – und damit $|\\psi|^2$?'},
      {id:'links', name:'links und rechts der Mitte', type:'amp', a:[0, 0.5], b:[0.5, 1], cmp:'>', msg:'Vergleiche $\\psi_1 + \\psi_2$ links und rechts der Mitte. Wo verstärken sich die beiden Anteile, wo schwächen sie sich ab? (Abschnitt ‚Einzelne Elektronen am Doppelspalt‘)'}
    ],
    reveal:'$|\\psi|^2 = \\tfrac12(\\psi_1^2 + \\psi_2^2) + \\psi_1\\psi_2$. Der Mischterm $\\psi_1\\psi_2$ ist links positiv, weil dort beide Funktionen positiv sind, und rechts negativ, weil $\\psi_2 < 0$ ist. Deshalb liegt fast die ganze Wahrscheinlichkeit links, $\\langle x\\rangle \\approx 0{,}32L$. Bei $x = 2L/3$ ist $\\psi_1 + \\psi_2 = 0$; dahinter bleibt nur ein winziger Buckel. Addierte man die Dichten statt der Amplituden, wäre die Kurve symmetrisch zur Mitte.',
    hints:['Werte $\\psi_1 + \\psi_2$ an einigen Stellen aus, etwa bei $L/4$, $L/2$ und $3L/4$, und quadriere.', 'Im Betragsquadrat einer Summe steckt der Mischterm $2\\psi_1\\psi_2$. Wo ist er positiv, wo negativ?'],
    wrong:[
      {f:x => Math.sin(PI * x) ** 2 + Math.sin(2 * PI * x) ** 2, fails:['links'], why:'Dichten addiert statt Amplituden: ohne Mischterm, wie klassische Kugeln am Doppelspalt'},
      {f:x => Math.sin(PI * x) + Math.sin(2 * PI * x), fails:['pos'], why:'ψ statt |ψ|²: rechts von 2L/3 negativ'},
      {f:x => (Math.sin(PI * x) - Math.sin(2 * PI * x)) ** 2, fails:['links'], why:'Vorzeichen des Mischterms vertauscht: Dichte rechts statt links'}
    ]
  };
  return {s1, lab};
})();
topic({
  id:'wf', math:['m-komplex', 'm-analysis', 'm-stat'], title:'Wellenfunktion und Wahrscheinlichkeit', short:'Wellenfunktion',
  src:'Griffiths & Schroeter Kap. 1 · Nolting 5/1 Kap. 2 · Schwabl Kap. 2 · Tonomura et al. 1989 (Einzelelektronen-Interferenz)',
  wozu:'**Warum Quantenmechanik?** Die klassische Physik erklärt nicht, warum Licht Elektronen nur oberhalb einer Grenzfrequenz aus Metall löst, warum Atome scharfe Spektrallinien aussenden und warum einzelne Elektronen hinter einem Doppelspalt ein Interferenzmuster aufbauen. Die Quantenmechanik beschreibt all das mit einem Objekt, der Wellenfunktion. Ihre Regeln – Wahrscheinlichkeit, Erwartungswert, Unschärfe – brauchst du in jedem weiteren Thema, vom Elektronenmikroskop, dessen Auflösung die de-Broglie-Wellenlänge begrenzt, bis zu Halbleiter-Bauelementen.',
  bridge:'Dies ist das erste Thema der Quantenmechanik. Aus der Mathematik brauchst du komplexe Zahlen (M1: $|z|^2 = z^*z$), Integrale (M2) sowie Dichte, Mittelwert und Varianz einer Verteilung (M9). Die Schrödingergleichung kommt hier nur als Vorgriff vor; Thema 2 begründet sie.',
  goals:[
    'Ich kann eine Wellenfunktion normieren, auch wenn sie komplex ist.',
    'Ich kann Wahrscheinlichkeiten für Intervalle und Erwartungswerte $\\langle x\\rangle$, $\\langle x^2\\rangle$ berechnen.',
    'Ich kann die Unschärfe $\\Delta x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$ bestimmen und deuten.'
  ],
  needs:'komplexe Zahlen ($z^*z = |z|^2$) · Integrale mit Polynomen, $e^{-ax}$ und $\\sin^2$ · Dichte und Mittelwert einer Verteilung',
  check:[
    {q:'Für $z = 3 + 4i$ ist $|z|^2 = z^*z$ gleich …', opts:['$25$', '$-7 + 24i$', '$7$'], a:0, ex:'$z^*z = (3-4i)(3+4i) = 9 + 16 = 25$. Dagegen ist $z^2 = -7 + 24i$ – nicht dasselbe.', lex:'komplexe-zahlen', prev:'m-komplex', seg:'mk-t1'},
    {q:'$\\int_0^L \\sin^2(\\pi x/L)\\,dx$ ist …', opts:['$L/2$', '$L$', '$\\pi/2$'], a:0, ex:'Mit $\\sin^2 u = \\tfrac12(1 - \\cos 2u)$ bleibt nur der konstante Teil: $L/2$.', lex:'integrale', prev:'m-komplex', seg:'mk-t3'},
    {q:'Eine Zufallsgröße hat die Dichte $\\rho(x)$. Ihr Mittelwert ist …', opts:['$\\int x\\,\\rho(x)\\,dx$', '$\\int \\rho(x)\\,dx$', 'der Ort des Maximums von $\\rho$'], a:0, ex:'Mittelwert = mit $\\rho$ gewichtetes Integral über $x$. Das Maximum ist der wahrscheinlichste Wert, im Allgemeinen nicht der Mittelwert.', lex:'erwartungswert', prev:'m-stat', seg:'st-t3'},
    {q:'Eine Zufallsgröße hat den Mittelwert $\\mu = 2$ und den Mittelwert der Quadrate $\\langle x^2\\rangle = 13$. Wie groß ist die Standardabweichung $\\sigma$?', opts:['$3$', '$\\sqrt{13}$', '$9$'], a:0, ex:'$\\sigma^2 = \\langle x^2\\rangle - \\mu^2 = 13 - 4 = 9$, also $\\sigma = 3$. $\\sqrt{\\langle x^2\\rangle}$ vergisst den Mittelwert, und $9$ ist die Varianz, nicht ihre Wurzel.', lex:'stat-varianz', prev:'m-stat', seg:'st-t4'}
  ],
  diag:[
    {q:'Wie beginnst du, um die Konstante $A$ in $\\psi(x) = A\\,(1 + i x/a)\\,e^{-x^2/a^2}$ zu bestimmen?', opts:['Ich setze $\\int|\\psi|^2dx = 1$ an und ziehe $|A|^2$ vor das Integral.', 'Ich fordere $\\psi(0) = 1$, also $A = 1$.', 'Ich setze $\\int\\psi\\,dx = 1$ an und löse nach $A$ auf.', 'Das weiß ich noch nicht.'], a:0, ex:'Normierung heißt $\\int|\\psi|^2dx = 1$, mit $|\\psi|^2 = \\psi^*\\psi$. Der Wert an einer Stelle oder das Integral über $\\psi$ selbst haben keine Bedeutung.'},
    {q:'Wie beginnst du, um $\\langle x\\rangle$ für ein normiertes $\\psi$ zu berechnen?', opts:['Ich integriere $x\\,|\\psi(x)|^2$ über den ganzen Bereich.', 'Ich suche den Ort, an dem $|\\psi|^2$ maximal ist.', 'Ich integriere $x\\,\\psi(x)$ über den ganzen Bereich.', 'Das weiß ich noch nicht.'], a:0, ex:'$\\langle x\\rangle = \\int x\\,|\\psi|^2dx$: ein mit der Dichte $|\\psi|^2$ gewichteter Mittelwert. Das Maximum ist der wahrscheinlichste Ort, nicht der Mittelwert.'}
  ],
  phenomenon:{
    title:'Einzelne Elektronen am Doppelspalt',
    text:'Warum braucht man überhaupt eine neue Mechanik? Ein Versuch zeigt es besonders deutlich.\n\nElektronen fliegen auf eine Wand mit zwei schmalen Spalten (oder auf eine gleichwertige Anordnung, die den Strahl in zwei Wege teilt). Dahinter steht ein Schirm, der jedes ankommende Elektron als Punkt anzeigt. Der Strahl ist so schwach, dass sich immer höchstens ein Elektron in der Apparatur befindet. Man wartet, bis einige tausend Elektronen angekommen sind.\n\nWas zeigt der Schirm?',
    q:{q:'Deine Vorhersage:', opts:['zwei helle Streifen hinter den beiden Spalten, wie bei Kugeln', 'erst zufällige Punkte, nach vielen Elektronen helle und dunkle Streifen', 'von Anfang an ein schwaches, gleichmäßig verschmiertes Streifenmuster', 'zufällig verstreute Punkte ohne Muster, weil nichts interferieren kann'], a:1,
      ex:'Jedes Elektron erscheint als Punkt; das Streifenmuster entsteht erst aus vielen Punkten.',
      fb:['So verhielten sich klassische Teilchen. Tatsächlich entstehen viele Streifen, auch in der Mitte zwischen den Spalten, und dunkle Stellen, an denen mit nur einem offenen Spalt Elektronen ankämen.',
        'Genau das zeigt der Versuch: Jedes Elektron wird als einzelner Punkt nachgewiesen, und erst die Verteilung vieler Punkte bildet das Interferenzmuster.',
        'Ein einzelnes Elektron wird nie verschmiert nachgewiesen, sondern immer ganz an einem Ort. Ein Muster entsteht erst aus vielen Punkten.',
        'Naheliegend, weil die Elektronen einzeln fliegen. Trotzdem entstehen Streifen: Die Interferenz findet nicht zwischen verschiedenen Elektronen statt.']},
    reveal:'Tonomura und Mitarbeiter haben einen gleichwertigen Versuch (Elektronen-Biprisma statt Spalte) 1989 gefilmt: Einzelne Punkte, scheinbar zufällig verteilt, ordnen sich nach einigen tausend Elektronen zu Interferenzstreifen.\n\nZwei Schlüsse:\n\n- Wo ein einzelnes Elektron landet, ist nicht vorhersagbar – wohl aber die Verteilung vieler Ergebnisse.\n- Was die Verteilung bestimmt, verhält sich wie eine Welle, die durch beide Spalte läuft und interferiert.\n\nDiese Welle ist die **Wellenfunktion** $\\psi$; $|\\psi|^2$ ist die Wahrscheinlichkeitsdichte für den Ort, an dem das Elektron nachgewiesen wird. Wie man damit rechnet und welche weiteren Befunde die Quantenmechanik nötig machen, erklärt dieses Thema.'
  },
  teach:[
    /* ===== Abschnitt 1: vier Befunde ===== */
    {id:'wf-t1', title:'Warum Quantenmechanik? Vier Befunde', steps:[
      {id:'wf-t1a', title:'Photoeffekt: Licht gibt Energie in Portionen ab',
        num:{title:'Natrium unter violettem und rotem Licht', text:R`Violettes Licht mit $\lambda = 400\,\mathrm{nm}$ trägt Portionen von $hf = hc/\lambda \approx 3{,}10\,\mathrm{eV}$. Natrium hat die Austrittsarbeit $W \approx 2{,}3\,\mathrm{eV}$. Die schnellsten Elektronen haben also

$$E_{\text{kin,max}} = 3{,}10\,\mathrm{eV} - 2{,}3\,\mathrm{eV} \approx 0{,}8\,\mathrm{eV}.$$

Rotes Licht mit $700\,\mathrm{nm}$ trägt nur $1{,}77\,\mathrm{eV} < W$. Dann tritt kein Elektron aus, wie hell das Licht auch ist.`},
        text:R`Um 1900 passten mehrere Messungen nicht zur klassischen Physik. Der erste Befund ist der [[lex:photoeffekt|Photoeffekt]]: Licht löst Elektronen aus einer Metallfläche. Klassisch sollte helleres Licht schnellere Elektronen liefern. Gemessen wird anderes. Die größte kinetische Energie der Elektronen hängt nur von der Frequenz ab. Mehr Intensität bedeutet nur mehr Elektronen.

Einstein erklärte das 1905: Licht gibt Energie in Portionen $E = hf = \hbar\omega$ ab. Dabei ist $h$ die Planck-Konstante und $\hbar = h/2\pi$, gelesen „h quer“. Ein Elektron nimmt eine Portion auf und verliert beim Austritt die Austrittsarbeit $W$:

$$E_{\text{kin,max}} = \hbar\omega - W.$$`,
        q:{q:R`Beim Photoeffekt verdoppelt man die Intensität des Lichts bei gleicher Frequenz. Was ändert sich?`,
          opts:[R`Die größte kinetische Energie der Elektronen verdoppelt sich etwa.`, R`Es treten etwa doppelt so viele Elektronen aus, mit derselben größten Energie.`, R`Es treten gleich viele Elektronen aus, aber jedes trägt mehr Energie.`], a:1,
          ex:R`Jedes Elektron nimmt eine Portion $\hbar\omega$ auf. Mehr Intensität heißt mehr Portionen, also mehr Elektronen, aber nicht mehr Energie pro Elektron.`,
          fb:[R`Die Energie eines Elektrons stammt aus einer einzigen Portion $\hbar\omega$. Die Intensität ändert nur die Zahl der Portionen.`,
            '',
            R`Mehr Intensität heißt mehr Portionen gleicher Größe. Jede Portion löst höchstens ein Elektron, mit derselben Energie.`]}},
      {id:'wf-t1b', title:'Linienspektren: Atome haben nur bestimmte Energien',
        num:{title:'Die rote Wasserstofflinie', text:R`Angeregter Wasserstoff leuchtet unter anderem bei $\lambda = 656\,\mathrm{nm}$. Ein Photon dieser Linie trägt

$$\hbar\omega = \frac{hc}{\lambda} = \frac{1240\,\mathrm{eV\,nm}}{656\,\mathrm{nm}} \approx 1{,}89\,\mathrm{eV}.$$

Das ist genau der Abstand zweier Energien des Elektrons im Atom, $-1{,}51\,\mathrm{eV}$ und $-3{,}40\,\mathrm{eV}$.`},
        text:R`Angeregter Wasserstoff, etwa in einer Gasentladung, sendet nur Licht bestimmter Wellenlängen aus. Ein klassisch kreisendes Elektron könnte jede Energie haben. Es müsste sogar ständig strahlen und in den Kern stürzen.

Die scharfen Linien zeigen etwas anderes: Gebundene Elektronen haben nur bestimmte Energien $E_n$. Springt das Elektron von $E_n$ nach $E_m$, trägt das Licht die Differenz:

$$\hbar\omega = E_n - E_m.$$

Diese **Quantisierung** leitest du später aus einer Gleichung her, im Kasten (Thema 3) und beim Wasserstoffatom (Thema 9).`,
        q:{q:R`Ein Atom hat die Energien $-3{,}40\,\mathrm{eV}$ und $-0{,}85\,\mathrm{eV}$. Welche Photonenenergie gehört zum Sprung vom oberen zum unteren Niveau?`,
          opts:[R`$4{,}25\,\mathrm{eV}$`, R`$2{,}55\,\mathrm{eV}$`, R`$-2{,}55\,\mathrm{eV}$`, R`$0{,}85\,\mathrm{eV}$`], a:1,
          ex:R`Das Photon trägt die Differenz: $-0{,}85\,\mathrm{eV} - (-3{,}40\,\mathrm{eV}) = 2{,}55\,\mathrm{eV}$. Das ist die blaugrüne Wasserstofflinie bei $486\,\mathrm{nm}$.`,
          fb:[R`Das ist die Summe der Beträge. Das Licht trägt die *Differenz* der beiden Energien.`,
            '',
            R`Die Photonenenergie ist positiv. Beim Sprung nach unten verliert das Atom Energie, und das Photon nimmt sie mit.`,
            R`$0{,}85\,\mathrm{eV}$ ist nur der Betrag des oberen Niveaus. Es kommt auf den Abstand der beiden Niveaus an.`]}},
      {id:'wf-t1c', title:'Stern-Gerlach: zwei Flecken statt eines Streifens',
        text:R`Stern und Gerlach schickten 1922 Silberatome durch ein inhomogenes Magnetfeld ([[lex:stern-gerlach|Stern-Gerlach-Versuch]]). Jedes Atom trägt ein kleines magnetisches Moment. Das Feld lenkt es je nach dessen Ausrichtung nach oben oder unten ab.

Klassisch erwartet man einen verschmierten Streifen. Die Momente sollten beliebig ausgerichtet sein, also wäre jede Ablenkung zwischen ganz oben und ganz unten möglich. Auf der Platte entstanden aber zwei getrennte Flecken. Eine Komponente des Drehimpulses kann also nur zwei Werte annehmen. Auch der Drehimpuls ist quantisiert. Mehr dazu in Thema 10.`,
        q:{q:R`Was hätte die klassische Physik beim Stern-Gerlach-Versuch auf der Platte erwartet?`,
          opts:[R`zwei getrennte Flecken, je einen für jede Ausrichtung`, R`einen durchgehenden Streifen von oben bis unten`, R`gar keine Ablenkung, weil Silberatome neutral sind`], a:1,
          ex:R`Klassisch kann das magnetische Moment in jede Richtung zeigen. Die Ablenkungen wären stetig verteilt, also ein Streifen.`,
          fb:[R`Das ist das Messergebnis, gerade nicht die klassische Erwartung. Klassisch wären alle Ausrichtungen und damit alle Ablenkungen möglich.`,
            '',
            R`Die Atome sind neutral, haben aber ein magnetisches Moment. Ein inhomogenes Feld übt darauf eine Kraft aus.`]}},
      {id:'wf-t1d', title:'Elektronen werden gebeugt wie Licht',
        num:{title:R`Davisson und Germer, $54\,\mathrm{eV}$`, text:R`Ein Elektron mit $E = 54\,\mathrm{eV}$ hat den Impuls $p = \sqrt{2m_eE}$. Nach de Broglie gehört dazu

$$\lambda = \frac{h}{p} = \frac{h}{\sqrt{2m_eE}} \approx 0{,}167\,\mathrm{nm}.$$

An der Nickeloberfläche haben die Atomreihen den Abstand $d = 0{,}215\,\mathrm{nm}$. Das erste Beugungsmaximum liegt bei $d\sin\theta = \lambda$, also bei $\theta \approx 51°$. Gemessen wurden $50°$.`},
        text:R`Davisson und Germer fanden 1927, dass Elektronen an einem Nickelkristall gebeugt werden wie Röntgenlicht. Die Wellenlänge passt zu de Broglies Vorschlag ([[lex:de-broglie|de-Broglie-Beziehung]]), gelesen „Lambda gleich h durch p“:

$$\lambda = \frac{h}{p}.$$

Alle vier Befunde enthalten die Planck-Konstante $h \approx 6{,}63\cdot10^{-34}\,\mathrm{J\,s}$. Sie ist so klein, dass Quanteneffekte im Alltag nicht auffallen: Eine Kugel von $1\,\mathrm{g}$ mit $1\,\mathrm{m/s}$ hat $\lambda \approx 7\cdot10^{-31}\,\mathrm{m}$. Gesucht ist also eine Theorie, in der Energien quantisiert sein können und in der Teilchen interferieren. Den Kern zeigt der Versuch mit einzelnen Elektronen am Doppelspalt.`,
        q:{q:R`Ein Elektron hat doppelt so viel Impuls wie im Beispiel. Was gilt für seine de-Broglie-Wellenlänge?`,
          opts:[R`Sie verdoppelt sich auf etwa $0{,}33\,\mathrm{nm}$.`, R`Sie bleibt gleich, weil $h$ konstant ist.`, R`Sie halbiert sich auf etwa $0{,}083\,\mathrm{nm}$.`], a:2,
          ex:R`$\lambda = h/p$ ist umgekehrt proportional zu $p$: $0{,}167\,\mathrm{nm}/2 \approx 0{,}083\,\mathrm{nm}$.`,
          fb:[R`Mehr Impuls gibt eine kürzere Wellenlänge, nicht eine längere: $p$ steht im Nenner.`,
            R`$h$ ist konstant, aber $p$ steht im Nenner. Doppeltes $p$ heißt halbe Wellenlänge.`,
            '']}}
    ]},

    /* ===== Abschnitt 2: Doppelspalt, Amplituden, Interferenzterm ===== */
    {id:'wf-t2', title:'Einzelne Elektronen am Doppelspalt', steps:[
      {id:'wf-t2a', title:'Einzelne Punkte, die Streifen bilden',
        text:R`Tonomura und Mitarbeiter schickten 1989 Elektronen durch ein Elektronen-Biprisma, das wie ein Doppelspalt wirkt ([[lex:doppelspalt|Einzelelektronen-Doppelspalt]]). Der Strahl war so schwach, dass sich praktisch nie zwei Elektronen gleichzeitig in der Apparatur befanden. Drei Beobachtungen:

- Jedes Elektron kommt **ganz** an **einem** Ort an, nie als Fleck.
- Wo das nächste Elektron landet, lässt sich nicht vorhersagen.
- Nach einigen tausend Elektronen ordnen sich die Punkte zu hellen und dunklen Streifen.

Bei einem echten Doppelspalt kommt hinzu: Schließt man einen Spalt, verschwinden die Streifen. An manchen vorher dunklen Stellen kommen nun Elektronen an. Für jedes einzelne Elektron zählen also beide Wege.`,
        q:{q:R`Die Elektronen fliegen einzeln durch die Apparatur. Was folgt daraus für die Streifen?`,
          opts:[R`Sie entstehen durch Stöße der Elektronen untereinander.`, R`Sie entstehen für jedes einzelne Elektron aus beiden Wegen.`, R`Sie sind ein Messfehler des Schirms bei schwachem Strahl.`], a:1,
          ex:R`Weil die Elektronen einzeln fliegen, kann das Muster nicht aus ihrem Zusammenspiel kommen. Es baut sich aus vielen Einzelereignissen auf, und für jedes zählen beide Wege.`,
          fb:[R`Es ist praktisch nie mehr als ein Elektron in der Apparatur. Mit wem sollte es stoßen?`,
            '',
            R`Mit nur einem offenen Spalt verschwinden die Streifen. Ein Fehler des Schirms hinge nicht davon ab, wie viele Spalte offen sind.`]}},
      {id:'wf-t2b', title:'Amplituden addieren sich, nicht Wahrscheinlichkeiten',
        pre:{from:'m-komplex', seg:'mk-t5', title:'Betragsquadrat einer Summe', text:R`Für komplexe Zahlen gilt $|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2 + 2\operatorname{Re}(z_1^*z_2)$. Der letzte Summand ist der Interferenzterm. Er hängt nur von der relativen Phase ab. Mini-Beispiel: $z_1 = 1$, $z_2 = -1$ gibt $1 + 1 - 2 = 0$.`},
        num:{title:'Drei Paare von Amplituden', text:R`Nimm $z_1 = 0{,}5$ und drei Möglichkeiten für $z_2$, alle mit $|z_2|^2 = 0{,}25$:

$$|0{,}5 + 0{,}5|^2 = 1,\qquad |0{,}5 + 0{,}5i|^2 = 0{,}5,\qquad |0{,}5 - 0{,}5|^2 = 0.$$

Die Summe der Einzelquadrate ist jedes Mal $0{,}5$. Erst die relative Phase entscheidet, ob es doppelt so hell, gleich hell oder dunkel wird.`},
        text:R`Die Quantenmechanik beschreibt den Versuch so: Zum Elektron gehört eine komplexe **Wellenfunktion** $\psi$, gelesen „psi“. Durch jeden Spalt läuft ein Anteil, $\psi_1$ und $\psi_2$. Auf dem Schirm addieren sich die Anteile zu $\psi = \psi_1 + \psi_2$. Die Wahrscheinlichkeit, das Elektron bei $x$ nachzuweisen, ist proportional zu $|\psi(x)|^2$.

Im Betragsquadrat einer Summe steckt ein Mischterm, der [[lex:interferenzterm|Interferenzterm]] $2\operatorname{Re}(\psi_1^*\psi_2)$. Er kann positiv oder negativ sein. Deshalb gibt es Stellen, an denen mit beiden Spalten weniger ankommt als mit einem. Es addieren sich **Amplituden**, nicht Wahrscheinlichkeiten.`,
        q:{q:R`An einer Stelle des Schirms ist $\psi_2 = -\psi_1$. Was beobachtet man dort mit beiden offenen Spalten?`,
          opts:[R`Dort kommen doppelt so viele Elektronen an wie mit nur einem offenen Spalt.`, R`Dort kommt kein Elektron an, obwohl jeder Spalt allein Elektronen dorthin schickt.`, R`Dort kommen genauso viele Elektronen an wie mit nur einem offenen Spalt.`], a:1,
          ex:R`$|\psi_1 + \psi_2|^2 = |\psi_1 - \psi_1|^2 = 0$: destruktive Interferenz. Mit nur einem Spalt wäre $|\psi_1|^2 > 0$.`,
          fb:[R`So wäre es, wenn sich Wahrscheinlichkeiten addierten. Hier heben sich die Amplituden auf.`,
            '',
            R`Der zweite Spalt ändert sehr wohl etwas: Sein Anteil löscht den ersten aus.`]}},
      {id:'wf-t2c', title:'Das Streifenmuster ausgerechnet',
        num:{title:'Drei Stellen am Schirm', text:R`Sei $\psi_1 = A\,e^{iqx/2}$ und $\psi_2 = A\,e^{-iqx/2}$ mit reellem $A$. In der Mitte, bei $x = 0$, ist $\psi_1 = \psi_2 = A$, also $|\psi|^2 = |2A|^2 = 4A^2$. Bei $qx = \pi$ ist $\psi_1 = A\,e^{i\pi/2} = iA$ und $\psi_2 = -iA$, also $|\psi|^2 = 0$. Dazwischen, bei $qx = \pi/2$, ist $|\psi|^2 = 2A^2$.`},
        text:R`Am fernen Schirm haben beide Anteile gleiche Beträge. Ihre Phasendifferenz wächst linear mit dem Ort $x$ auf dem Schirm:

$$\psi_1 = A\,e^{iqx/2},\qquad \psi_2 = A\,e^{-iqx/2},\qquad q = \frac{kd}{D}.$$

Dabei ist $k = 2\pi/\lambda$, $d$ der Spaltabstand und $D$ der Abstand zum Schirm. Die Herleitung rechnet $|\psi_1 + \psi_2|^2$ in drei Zeilen aus. Das Ergebnis $4A^2\cos^2(qx/2)$ passt zu den drei Stellen im Beispiel. Die Einhüllende durch die endliche Breite der Spalte lassen wir weg.`,
        derive:{ctx:{coords:['x'], params:{A:'pos', q:'pos'}, defs:{'ψ_1(x)':'A e^(i q x/2)', 'ψ_2(x)':'A e^(-i q x/2)'}},
          lines:[
            {l:'|ψ_1 + ψ_2|^2 = |ψ_1|^2 + |ψ_2|^2 + 2 Re(ψ_1^* ψ_2)', w:'Betragsquadrat einer Summe', why:{q:'Woher kommt der dritte Term?', opts:['Aus $\\psi_1^*\\psi_2 + \\psi_2^*\\psi_1 = 2\\,\\mathrm{Re}(\\psi_1^*\\psi_2)$', 'Aus der Normierung der beiden Anteile', 'Aus $|\\psi_1 + \\psi_2| = |\\psi_1| + |\\psi_2|$'], a:0, ex:'$|\\psi_1 + \\psi_2|^2 = (\\psi_1 + \\psi_2)^*(\\psi_1 + \\psi_2)$. Die gemischten Produkte sind zueinander komplex konjugiert, ihre Summe ist zweimal der Realteil.'}},
            {l:'= 2A^2 + 2A^2 cos(q x)', w:'ψ_1^* ψ_2 = A^2 e^(-iqx)', why:{q:'Warum ergibt $2\\,\\mathrm{Re}(\\psi_1^*\\psi_2)$ hier $2A^2\\cos(qx)$?', opts:['$\\psi_1^*\\psi_2 = A^2e^{-iqx}$, und $\\mathrm{Re}\\,e^{-iqx} = \\cos(qx)$', '$\\psi_1^*\\psi_2 = A^2e^{iqx}$, und $\\mathrm{Re}\\,e^{iqx} = \\sin(qx)$', 'Weil $\\psi_1$ und $\\psi_2$ beide reell sind'], a:0, ex:'Beim Konjugieren kehrt sich das Vorzeichen der Phase um: $(e^{iqx/2})^*e^{-iqx/2} = e^{-iqx}$.'}},
            {l:'= 4A^2 cos(q x/2)^2', w:'1 + cos 2u = 2 cos² u'}
          ]},
        q:{q:R`Wo liegt neben der Mitte die erste Stelle, an der kein Elektron ankommt?`,
          opts:[R`bei $x = \pi/q$`, R`bei $x = 2\pi/q$`, R`bei $x = \pi/(2q)$`], a:0,
          ex:R`$\cos^2(qx/2) = 0$ verlangt $qx/2 = \pi/2$, also $x = \pi/q$. Das passt zum Beispiel: Bei $qx = \pi$ ist $|\psi|^2 = 0$.`,
          fb:['',
            R`Dort ist $\cos^2(\pi) = 1$: Das ist das nächste helle Maximum.`,
            R`Dort ist $\cos^2(\pi/4) = \tfrac12$: halbe Höhe, nicht dunkel.`]}},
      {id:'wf-t2d', title:'Vom Mischterm zum Bild auf dem Schirm',
        num:{title:R`Elektronen mit $600\,\mathrm{eV}$`, text:R`Elektronen mit etwa $600\,\mathrm{eV}$ haben $\lambda \approx 0{,}05\,\mathrm{nm}$. Mit dem Spaltabstand $d = 1\,\mu\mathrm{m}$ und dem Schirmabstand $D = 1\,\mathrm{m}$ liegen die Streifen im Abstand

$$\frac{2\pi}{q} = \frac{\lambda D}{d} = \frac{0{,}05\cdot10^{-9}\,\mathrm{m}\cdot 1\,\mathrm{m}}{10^{-6}\,\mathrm{m}} = 50\,\mu\mathrm{m}.$$`},
        text:R`Die Tafel stellt das Ergebnis in vier Gestalten nebeneinander. Die Formel $4A^2\cos^2(qx/2)$ wird zur Kurve über dem Schirmort $x$. Ihre Maxima sind die hellen Streifen, ihre Nullstellen die dunklen. Aus dem Abstand der Maxima liest du $2\pi/q$ ab und damit $\lambda D/d$.

Die gestrichelte Gerade ist das, was ohne Mischterm herauskäme: $|\psi_1|^2 + |\psi_2|^2 = 2A^2$, überall gleich hell. Der Mischterm verschiebt Wahrscheinlichkeit von den dunklen zu den hellen Stellen. Im Mittel über einen Streifen bleibt sie gleich, denn der Mittelwert von $\cos^2$ ist $\tfrac12$.`,
        reps:{obj:'Interferenz zweier Anteile am Schirm',
          rows:[
            {k:'worte', text:R`Zwei gleich starke Anteile, deren Phasendifferenz $qx$ mit dem Ort auf dem Schirm wächst.`},
            {k:'formel', tex:R`|\psi_1 + \psi_2|^2 = |\psi_1|^2 + |\psi_2|^2 + 2\operatorname{Re}(\psi_1^*\psi_2) = 4A^2\cos^2\frac{qx}{2}`},
            {k:'graph', plot:{x:[-2, 2], y:[0, 4.4], xlab:R`qx/2\pi`, ylab:R`|\psi|^2/A^2`, ticks:[{x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}], yticks:[{y:2, lab:'2'}, {y:4, lab:'4'}]}, f:u => 4 * Math.cos(Math.PI * u) ** 2, lab:R`4\cos^2(qx/2)`, f2:u => 2, lab2:R`|\psi_1|^2 + |\psi_2|^2`,
              cap:R`Maxima bei $qx = 0, \pm2\pi, \dots$, Nullstellen dazwischen. Gestrichelt: Wahrscheinlichkeiten addiert, ohne Mischterm.`},
            {k:'physik', text:R`Helle und dunkle Streifen im Abstand $\lambda D/d$. Jedes Elektron landet an einem Punkt; die Kurve beschreibt, wie dicht viele Punkte liegen.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Jeden Weg als Amplitude schreiben, die Amplituden addieren und dann das Betragsquadrat bilden.`},
            {from:'formel', to:'graph', rule:R`Die Formel über dem Schirmort auftragen. Wo $\cos^2 = 1$ ist, ist es hell, wo $\cos^2 = 0$ ist, dunkel.`},
            {from:'graph', to:'physik', rule:R`Den Abstand zweier Maxima ablesen; er ist $2\pi/q = \lambda D/d$. Die Höhe der Kurve sagt, wie dicht die Punkte dort liegen.`}
          ]},
        q:{q:R`Du verdoppelst den Spaltabstand $d$. Was geschieht mit der Kurve im Graphen, über $x$ aufgetragen?`, tr:{from:'physik', to:'graph'},
          opts:[R`Die Maxima rücken doppelt so weit auseinander.`, R`Die Maxima rücken halb so weit auseinander.`, R`Die Maxima werden doppelt so hoch.`, R`Nichts, der Spaltabstand steckt nur in $A$.`], a:1,
          ex:R`$q = kd/D$ verdoppelt sich, also halbiert sich der Abstand $2\pi/q$ der Maxima.`,
          fb:[R`Der Abstand ist $\lambda D/d$, mit $d$ im Nenner. Größeres $d$ gibt engere Streifen.`,
            '',
            R`Die Höhe $4A^2$ hängt nicht von $d$ ab, nur die Lage der Streifen.`,
            R`$d$ steckt in $q = kd/D$ und damit in der Phase, nicht im Betrag $A$.`]}},
      {id:'wf-t2e', title:'Typischer Fehler: Wahrscheinlichkeiten addieren',
        num:{title:'Mit und ohne Welcher-Weg-Messung', text:R`Bei $qx = \pi$ ist ohne Welcher-Weg-Messung $|\psi_1 + \psi_2|^2 = 0$: dunkel. Stellt ein Detektor fest, durch welchen Spalt jedes Elektron fliegt, bleibt für jedes Elektron nur ein Anteil. Dann ist die Verteilung proportional zu

$$|\psi_1|^2 + |\psi_2|^2 = A^2 + A^2 = 2A^2,$$

an dieser Stelle genauso wie in der Mitte. Die Streifen sind weg.`},
        text:R`Der häufigste Fehler am Doppelspalt: die Wahrscheinlichkeiten der beiden Wege zu addieren, $|\psi_1|^2 + |\psi_2|^2$. So verhalten sich klassische Kugeln. Es gäbe keine dunklen Streifen, und mit beiden Spalten käme überall mindestens so viel an wie mit einem.

Richtig ist: Solange der Weg nicht festgestellt wird, addieren sich die Amplituden, und der Mischterm bleibt. Bestimmt man den Weg, verschwindet das Muster. Für jedes Elektron ist nach dieser Messung nur noch ein Anteil da, und der Mischterm fehlt. Ob Amplituden oder Wahrscheinlichkeiten zu addieren sind, entscheidet also, ob gemessen wird.`,
        q:{q:R`Jemand sagt: „Bei $qx = \pi$ schickt jeder Spalt allein $A^2$ dorthin, mit beiden Spalten also $2A^2$.“ Wann stimmt das?`,
          opts:[R`immer, denn die beiden Wege beeinflussen sich nicht`, R`nur mit einer Welcher-Weg-Messung an den Spalten`, R`nie, an dieser Stelle ist es in jedem Fall dunkel`], a:1,
          ex:R`Wahrscheinlichkeiten addieren sich nur, wenn der Weg festgestellt wird. Dann fehlt für jedes Elektron der zweite Anteil und mit ihm der Mischterm.`,
          fb:[R`Ohne Messung beeinflussen sich die Wege über den Mischterm. Hier ist $|\psi_1 + \psi_2|^2 = 0$.`,
            '',
            R`Mit Welcher-Weg-Messung fehlt der Mischterm, und die Stelle ist so hell wie jede andere.`]}}
    ]},

    /* ===== Abschnitt 3: Bornsche Deutung, Ensemble, Kollaps ===== */
    {id:'wf-t3', title:'Was ψ ist – und was nicht', steps:[
      {id:'wf-t3a', title:'Die Bornsche Deutung',
        num:{title:'Ein Wert von $\\psi$', text:R`An einer Stelle $x_0$ sei $\psi(x_0) = (0{,}3 + 0{,}4i)\,\mathrm{nm}^{-1/2}$. Dann ist

$$\begin{aligned}|\psi(x_0)|^2 &= \psi^*\psi\\ &= (0{,}3 - 0{,}4i)(0{,}3 + 0{,}4i)\\ &= 0{,}09 + 0{,}16 = 0{,}25\,\mathrm{nm}^{-1}.\end{aligned}$$

Im Intervall der Breite $dx = 0{,}01\,\mathrm{nm}$ um $x_0$ findest du das Teilchen also mit der Wahrscheinlichkeit $0{,}25\cdot0{,}01 = 0{,}0025$.`},
        text:R`Die Wellenfunktion $\psi(x,t)$ ordnet jedem Ort und jeder Zeit eine komplexe Zahl zu. Max Born schlug 1926 vor, wie man sie liest ([[lex:born|Bornsche Deutung]]):

$$\begin{gathered}|\psi(x,t)|^2\,dx = \text{Wahrscheinlichkeit,}\\ \text{das Teilchen zur Zeit } t\\ \text{zwischen } x \text{ und } x + dx \text{ zu finden}.\end{gathered}$$

Gelesen: „Betragsquadrat von psi mal dx“. Gemessen wird also nicht $\psi$ selbst. Es kommt auf $|\psi|^2 = \psi^*\psi$ an, eine reelle Zahl, die nie negativ ist. Die Aussagen sind statistisch. $\psi$ sagt nicht, wo das Teilchen gerade ist, sondern mit welcher Wahrscheinlichkeit eine Ortsmessung welches Ergebnis liefert.`,
        q:{q:R`An einer Stelle ist $\psi = (0{,}6 - 0{,}8i)\,\mathrm{nm}^{-1/2}$. Wie groß ist dort die Wahrscheinlichkeitsdichte?`,
          opts:[R`$-0{,}28\,\mathrm{nm}^{-1}$`, R`$1\,\mathrm{nm}^{-1}$`, R`$1{,}4\,\mathrm{nm}^{-1}$`, R`$0{,}04\,\mathrm{nm}^{-1}$`], a:1,
          ex:R`$|\psi|^2 = 0{,}6^2 + 0{,}8^2 = 0{,}36 + 0{,}64 = 1\,\mathrm{nm}^{-1}$.`,
          fb:[R`Das ist der Realteil von $\psi^2$. Ohne Konjugation wird die „Dichte“ sogar negativ.`,
            '',
            R`Das ist $0{,}6 + 0{,}8$. Betragsquadrat heißt: Real- und Imaginärteil einzeln quadrieren und addieren.`,
            R`Das ist $(0{,}6 - 0{,}8)^2$. Real- und Imaginärteil werden einzeln quadriert, nicht erst verrechnet.`]}},
      {id:'wf-t3b', title:'Was ψ nicht ist',
        num:{title:'Eine Phase vor dem ganzen $\\psi$', text:R`Multipliziere $\psi(x_0) = 0{,}3 + 0{,}4i$ mit $i = e^{i\pi/2}$. Das ergibt $-0{,}4 + 0{,}3i$, eine andere komplexe Zahl. Das Betragsquadrat bleibt:

$$|-0{,}4 + 0{,}3i|^2 = 0{,}16 + 0{,}09 = 0{,}25.$$

Gilt das an jeder Stelle $x$, ändert sich keine Wahrscheinlichkeit.`},
        text:R`Drei Missverständnisse liegen nahe.

- **ψ ist keine Ladungs- oder Materiewolke.** Ein Elektron wird immer ganz an einem Ort nachgewiesen. Außerdem ist $\psi$ komplex, und für zwei Teilchen hängt $\psi(x_1, x_2, t)$ von zwei Orten ab.
- **ψ ist nicht der Ort des Teilchens.** Es legt nur die Wahrscheinlichkeiten der Messergebnisse fest.
- **ψ selbst ist nicht messbar.** Ein Faktor $e^{i\alpha}$ vor dem ganzen $\psi$ ändert keine Wahrscheinlichkeit ([[lex:globale-phase|globale Phase]]). Messbar ist dagegen eine *relative* Phase zwischen zwei Anteilen. Am Doppelspalt verschiebt sie die Streifen.`,
        q:{q:R`Welche Änderung von $\psi = \psi_1 + \psi_2$ verschiebt das Streifenmuster am Doppelspalt?`,
          opts:[R`$\psi \to i\,(\psi_1 + \psi_2)$`, R`$\psi \to -(\psi_1 + \psi_2)$`, R`$\psi \to \psi_1 + i\,\psi_2$`], a:2,
          ex:R`Nur der zweite Anteil bekommt die Phase $i$. Diese relative Phase ändert den Mischterm, und die Streifen verschieben sich um ein Viertel ihres Abstands.`,
          fb:[R`Das ist eine globale Phase $e^{i\pi/2}$ vor dem ganzen $\psi$. Sie fällt im Betragsquadrat weg.`,
            R`Auch $-1 = e^{i\pi}$ vor dem ganzen $\psi$ ist eine globale Phase. Die Dichte bleibt gleich.`,
            '']}},
      {id:'wf-t3c', title:'Wahrscheinlichkeit zeigt sich als Häufigkeit',
        pre:{from:'m-stat', seg:'st-t1', title:'Wahrscheinlichkeit und relative Häufigkeit', text:R`Wiederholst du ein Zufallsexperiment $N$-mal und tritt der Wert $x_n$ dabei $N_n$-mal auf, dann nähert sich die relative Häufigkeit der Wahrscheinlichkeit: $N_n/N \to P_n$ für $N \to \infty$. Mini-Beispiel: Bei $600$ Würfen eines fairen Würfels erwartest du etwa $100$ Sechsen, selten genau $100$.`},
        num:{title:'Drei mögliche Werte, 100 Messungen', text:R`Eine Größe kann die Werte $1$, $2$ und $3$ haben, mit den Wahrscheinlichkeiten $0{,}5$, $0{,}3$ und $0{,}2$. Bei $100$ Messungen an gleich präparierten Systemen erwartest du etwa $50$, $30$ und $20$ Treffer. Eine einzelne Messreihe liefert dann zum Beispiel $46$, $33$ und $21$. Die relativen Häufigkeiten $0{,}46$, $0{,}33$ und $0{,}21$ schwanken um die Wahrscheinlichkeiten.`},
        text:R`Was „Wahrscheinlichkeit“ heißt, zeigen viele gleich präparierte Systeme, ein [[lex:ensemble|Ensemble]]. Du präparierst tausendmal denselben Zustand und misst jedes Mal. Eine einzelne Messung liefert nur einen Wert. Erst das Histogramm aller Ergebnisse zeigt die Verteilung.

Die Abbildung zeigt das für eine Größe mit den drei Werten aus dem Beispiel. Die blauen Balken sind die Wahrscheinlichkeiten, die der Zustand festlegt. Die roten Balken sind die gemessenen relativen Häufigkeiten. Drück mehrmals auf „100× messen“: Die roten Balken nähern sich den blauen, ohne sie genau zu treffen. Beim Ort ist es genauso, nur mit einer Dichte statt einzelner Balken. Achsentitel und Anzeigezeile benutzen schon Schreibweisen aus Thema 6, etwa „Eigenwerte“ und $|c_n|^2$. Hier zählen nur die Balken.`,
        fig:{lab:'measure', keep:['Viele'], caption:R`Blau: Wahrscheinlichkeiten der Werte 1, 2, 3. Rot: relative Häufigkeiten der bisherigen Messungen. Je mehr Messungen, desto näher kommen sich Rot und Blau.`},
        reps:{obj:'Wahrscheinlichkeit und Häufigkeit',
          rows:[
            {k:'worte', text:R`Wie oft kommt ein Wert vor, wenn du am gleichen Zustand sehr oft misst?`},
            {k:'formel', tex:R`P_n = \lim_{N\to\infty}\frac{N_n}{N},\qquad \sum_n P_n = 1`},
            {k:'labor', text:R`Blaue Balken: $P_n$, vom Zustand festgelegt. Rote Balken: $N_n/N$ nach den bisherigen Messungen. „100× messen“ erhöht $N$ um $100$.`},
            {k:'physik', text:R`Ein Detektor zählt Treffer. Aus den Zählraten vieler Messungen liest du die Wahrscheinlichkeiten ab, aus einer einzelnen Messung nicht.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Die Frage „wie oft“ als Bruch $N_n/N$ schreiben; für sehr viele Messungen wird er zur Wahrscheinlichkeit $P_n$.`},
            {from:'formel', to:'labor', rule:R`Jedes $P_n$ als blauen Balken über dem Wert $n$ zeichnen, jedes gemessene $N_n/N$ als roten Balken daneben.`},
            {from:'labor', to:'physik', rule:R`Die roten Balken sind die Zählraten des Detektors, geteilt durch die Zahl der Messungen.`}
          ]},
        q:{q:R`Nach $1000$ Messungen zeigen die roten Balken $0{,}21$, $0{,}48$ und $0{,}31$. Was schließt du über die Wahrscheinlichkeiten?`, tr:{from:'labor', to:'formel'},
          opts:[R`Sie sind genau $0{,}21$, $0{,}48$ und $0{,}31$.`, R`Sie liegen nahe bei $0{,}2$, $0{,}5$ und $0{,}3$, aber nicht genau fest.`, R`Nichts, denn jede einzelne Messung liefert ein zufälliges Ergebnis.`], a:1,
          ex:R`Relative Häufigkeiten schätzen die Wahrscheinlichkeiten. Mit mehr Messungen werden die Schätzungen genauer, aber nie exakt.`,
          fb:[R`Häufigkeiten schwanken von Messreihe zu Messreihe. Eine zweite Reihe gäbe etwas andere Zahlen.`,
            '',
            R`Einzelne Ergebnisse sind zufällig, ihre Häufigkeiten aber nicht beliebig. Bei $1000$ Messungen schwanken sie nur wenig.`]}},
      {id:'wf-t3d', title:'Messung und Kollaps',
        num:{title:'Zwei Ortsmessungen kurz hintereinander', text:R`Ein Teilchen sei zwischen zwei Wänden im Abstand $L$ eingesperrt, in einem Zustand mit breit verteilter Ortsdichte. Ins linke Viertel fällt eine Messung nur mit etwa $9\,\%$ Wahrscheinlichkeit; im nächsten Abschnitt rechnest du das für genau diesen Zustand nach. Eine Messung ergibt $x_0 = 0{,}2L$. Misst du sofort noch einmal, findest du das Teilchen wieder bei $0{,}2L$, also fast sicher im linken Viertel.`},
        text:R`Misst man den Ort und findet $x_0$, dann liefert eine **sofort** folgende zweite Messung wieder (fast genau) $x_0$. Unmittelbar nach der Messung ist $\psi$ also scharf um $x_0$ konzentriert, anders als vorher. Diesen Sprung nennt man **Kollaps** oder Zustandsreduktion ([[lex:kollaps|Kollaps]]).

Danach entwickelt sich $\psi$ wieder nach der Schrödingergleichung, die Thema 2 begründet. Der Gipfel läuft auseinander. Wartet man, liefert eine zweite Messung wieder Werte in einem breiteren Bereich. In den alten Zustand kehrt das Teilchen aber nicht zurück. Mehr dazu in Thema 3 und Thema 6.`,
        q:{q:R`Eine Ortsmessung ergibt $x_0$. Unmittelbar danach misst du noch einmal. Was gilt für das zweite Ergebnis?`,
          opts:[R`Es ist wieder nach dem alten $|\psi|^2$ verteilt.`, R`Es liegt (fast genau) wieder bei $x_0$.`, R`Es ist im Mittel gleich $\langle x\rangle$ des alten Zustands.`], a:1,
          ex:R`Eine Messung präpariert einen neuen Zustand, schmal um $x_0$. Eine sofortige Wiederholung bestätigt das Ergebnis.`,
          fb:[R`Die erste Messung hat den Zustand verändert. Das alte $|\psi|^2$ gilt danach nicht mehr.`,
            '',
            R`Der Mittelwert des alten Zustands spielt nach der Messung keine Rolle mehr. Der neue Zustand ist schmal um $x_0$.`]}},
      {id:'wf-t3e', title:'Deutungen: Wo war das Teilchen vorher?',
        text:R`Wo war das Teilchen kurz vor der Messung ([[lex:deutungen|Deutungen]])? Realisten wie Einstein hielten die Quantenmechanik für unvollständig: Das Teilchen war schon bei $x_0$. Die Kopenhagener Deutung (Bohr, Heisenberg) sagt: Vorher hatte es keinen bestimmten Ort.

Bell zeigte 1964, dass keine *lokale* Theorie verborgener Variablen alle Vorhersagen der Quantenmechanik für verschränkte Teilchenpaare reproduziert. Experimente bestätigen die Quantenmechanik, seit 2015 auch ohne die beiden Hauptschlupflöcher. Ausgeschlossen ist damit nur die Verbindung von Realismus und Lokalität. Die Bohmsche Mechanik ist realistisch, aber nichtlokal. Sie und die Viele-Welten-Deutung sagen dieselben Messergebnisse voraus wie die Kopenhagener Deutung. Gerechnet wird überall mit Borns Regel.`,
        q:{q:R`Worin unterscheiden sich die gängigen Deutungen der Quantenmechanik?`,
          opts:[R`in den vorhergesagten Wahrscheinlichkeiten`, R`darin, ob die Schrödingergleichung gilt`, R`in der Antwort, was vor der Messung „wirklich“ war`], a:2,
          ex:R`Kopenhagen, Bohmsche Mechanik und Viele-Welten sagen dieselben Messergebnisse voraus. Nur Theorien mit *lokalen* verborgenen Variablen weichen ab; Bell-Experimente sprechen gegen sie.`,
          fb:[R`Alle drei Deutungen sagen dieselben Wahrscheinlichkeiten voraus. Experimente können zwischen ihnen nicht entscheiden.`,
            R`Alle drei Deutungen rechnen mit der Schrödingergleichung.`,
            '']}}
    ]},

    /* ===== Abschnitt 4: Dichte, Fläche, Histogramm, Normierung, Re/Im ===== */
    {id:'wf-t4', title:'Wahrscheinlichkeitsdichte und Normierung', steps:[
      {id:'wf-t4a', title:'Dichte: Wahrscheinlichkeit pro Länge',
        pre:{from:'m-stat', seg:'st-t2', title:'Wahrscheinlichkeitsdichte', text:R`Für eine kontinuierliche Zufallsgröße gibt es Wahrscheinlichkeiten nur für Intervalle: $P(a \le x \le b) = \int_a^b\rho(x)\,dx$. Für ein kurzes Intervall gilt $P \approx \rho(x_0)\,dx$. Deshalb hat $\rho$ die Einheit $1/\text{Länge}$ und darf größer als 1 sein.`},
        num:{title:R`Kasten mit $L = 1\,\mathrm{nm}$`, text:R`Im Zustand niedrigster Energie, dem **Grundzustand**, ist ein Teilchen im Kasten $0 < x < L$ durch $\psi_1(x) = \sqrt{2/L}\,\sin(\pi x/L)$ beschrieben; Thema 3 leitet diese Funktion her. In der Mitte ist

$$|\psi_1(L/2)|^2 = \frac{2}{L} = 2\,\mathrm{nm}^{-1}.$$

Im Intervall der Breite $0{,}01\,\mathrm{nm}$ um die Mitte ist $P \approx 2\,\mathrm{nm}^{-1}\cdot0{,}01\,\mathrm{nm} = 0{,}02$. Für den Punkt $x = L/2$ allein ist $P = 0$.`},
        text:R`Bei einem Würfel gibt man Wahrscheinlichkeiten $P_j$ an, mit $\sum_jP_j = 1$. Der Ort ist dagegen kontinuierlich. Dann ist $\rho(x) = |\psi(x,t)|^2$ eine [[lex:stat-dichte|Wahrscheinlichkeitsdichte]]. Wahrscheinlichkeiten gibt es nur für Intervalle ([[lex:born|Bornsche Deutung]]):

$$P(a < x < b) = \int_a^b |\psi(x,t)|^2\,dx.$$

Für einen einzelnen Punkt ist die Wahrscheinlichkeit null, auch am Maximum. Für ein kleines Intervall der Breite $\Delta x$ gilt $P \approx |\psi(x_0)|^2\,\Delta x$. In einer Dimension hat $|\psi|^2$ die Einheit $1/\text{Länge}$. Werte über 1 sind deshalb erlaubt, wie im Beispiel.`,
        q:{q:R`$\psi_1 = \sqrt{2/L}\sin(\pi x/L)$ hat bei $x = L/2$ das Maximum $|\psi_1|^2 = 2/L$. Wie groß ist die Wahrscheinlichkeit, das Teilchen **exakt** bei $x = L/2$ zu finden?`,
          opts:[R`$2/L$`, R`$0$`, R`$1/2$`, R`$1$`], a:1,
          ex:R`Ein Punkt hat die Breite null, also $P = 0$. $2/L$ ist eine Dichte mit der Einheit $1/\text{Länge}$; erst mal einer Intervallbreite ergibt sie eine Wahrscheinlichkeit.`,
          fb:[R`$2/L$ ist die Dichte, keine Wahrscheinlichkeit. Erst mal einer Intervallbreite ergibt sie eine.`,
            '',
            R`Die Hälfte der Wahrscheinlichkeit liegt links von $L/2$, aber nicht *auf* $L/2$.`,
            R`Sicher ist nur, dass das Teilchen *irgendwo* im Kasten ist, nicht an einem bestimmten Punkt.`]}},
      {id:'wf-t4b', title:'Wahrscheinlichkeit als Fläche unter der Kurve',
        pre:{from:'m-komplex', seg:'mk-t3', title:'Das Integral über $\\sin^2$', text:R`Aus der Euler-Formel folgt $\sin^2u = \tfrac12(1 - \cos 2u)$. Über ganze Perioden mittelt sich der Kosinus weg. Mini-Beispiel: $\int_0^L\sin^2(\pi x/L)\,dx = \tfrac L2$.`},
        num:{title:'Das linke Viertel', text:R`Für $\psi_1$ im Kasten ist die Wahrscheinlichkeit im linken Viertel

$$P\left(0 < x < \tfrac L4\right) = \frac2L\int_0^{L/4}\sin^2\frac{\pi x}{L}\,dx = \frac14 - \frac{1}{2\pi} \approx 0{,}091.$$

Das ist weniger als ein Viertel, weil die Dichte an der Wand null ist und erst zur Mitte hin wächst.`},
        text:R`Die Abbildung zeigt $P(a < x < b)$ als Fläche. Die dicke Kurve ist $|\psi|^2$, mal $L$ genommen. Die beiden Regler sind die Grenzen $a$ und $b$ des Integrals. Die getönte Fläche zwischen ihnen ist das Integral, also die Wahrscheinlichkeit; die Anzeige darunter nennt ihren Wert. Die gestrichelte Kurve ist $\psi$ selbst. Sie darf negativ sein, ihr Quadrat nicht.

Wähle $\psi_1$ und stell $a = 0$ und $b = 0{,}25$ ein. Die Anzeige zeigt $0{,}091$, wie im Beispiel. Schiebe dann das Intervall in die Mitte: gleich breit, aber mehr Fläche, denn dort ist die Dichte am größten.`,
        fig:{lab:'prob', init:{f:'sin', a:0, b:0.25}, keep:'all', caption:R`Dicke Kurve: $|\psi|^2$. Getönte Fläche zwischen den Grenzen: $P(a < x < b)$. Gestrichelt: $\psi$ selbst. Rote Linie und heller Streifen: $\langle x\rangle$ und $\langle x\rangle \pm \Delta x$ (Abschnitt 6 und 7).`},
        q:{q:R`Im Grundzustand vergleichst du die Intervalle $[0;\ 0{,}1L]$ und $[0{,}45L;\ 0{,}55L]$. Was gilt für die Wahrscheinlichkeiten?`,
          opts:[R`Beide sind gleich, weil die Intervalle gleich breit sind.`, R`Die mittlere ist größer, weil dort mehr Fläche unter $|\psi|^2$ liegt.`, R`Die linke ist größer, weil $\psi$ dort am steilsten ansteigt.`], a:1,
          ex:R`Die Wahrscheinlichkeit ist die Fläche unter $|\psi|^2$. In der Mitte ist die Dichte nahe $2/L$, an der Wand nahe null.`,
          fb:[R`Gleiche Breite heißt nicht gleiche Fläche. Die Höhe der Dichte zählt mit.`,
            '',
            R`Die Steigung von $\psi$ zählt nicht. Es kommt auf die Höhe von $|\psi|^2$ an, und die ist an der Wand fast null.`]}},
      {id:'wf-t4c', title:'Dieselbe Wahrscheinlichkeit in vier Gestalten',
        num:{title:'Tausend Messungen', text:R`Präparierst du $1000$-mal den Grundzustand und misst den Ort, landen im Mittel $1000\cdot0{,}091 \approx 91$ Ergebnisse im linken Viertel. Im mittleren Bereich $L/4 < x < 3L/4$ sind es

$$1000\cdot\left(\tfrac12 + \tfrac1\pi\right) \approx 818.$$

Die restlichen etwa $91$ fallen ins rechte Viertel, spiegelbildlich zum linken.`},
        text:R`Die Tafel verbindet vier Gestalten derselben Zahl. Die Formel sagt, was zu rechnen ist. Der Graph zeigt die Fläche, das Labor dieselbe Fläche mit verstellbaren Grenzen. Eine Messreihe zählt, wie oft die Ergebnisse in ein Intervall fallen.

Lies die Tafel in beide Richtungen. Von der Formel zum Experiment: Fläche ausrechnen, mal der Zahl der Messungen. Vom Experiment zurück: Zahl der Treffer im Intervall durch die Zahl aller Messungen teilen, das schätzt die Fläche. Teilst du zusätzlich durch die Breite des Intervalls, schätzt die Balkenhöhe eines Histogramms die Dichte $|\psi|^2$ selbst. So entsteht aus vielen Punkten die Kurve.`,
        reps:{obj:'Ortsmessungen im Grundzustand des Kastens',
          rows:[
            {k:'worte', text:R`Wie oft landet ein Ortsmesswert im linken Viertel des Kastens?`},
            {k:'formel', tex:R`P\left(0 < x < \tfrac L4\right) = \int_0^{L/4}|\psi_1|^2\,dx = \tfrac14 - \tfrac{1}{2\pi} \approx 0{,}091`},
            {k:'graph', plot:{x:[0, 1], y:[0, 2.3], xlab:'x/L', ylab:R`|\psi|^2\cdot L`, ticks:[{x:0, lab:'0'}, {x:0.25, lab:'0{,}25'}, {x:0.5, lab:'0{,}5'}, {x:0.75, lab:'0{,}75'}, {x:1, lab:'1'}], yticks:[{y:1, lab:'1'}, {y:2, lab:'2'}]}, f:x => 2 * Math.sin(Math.PI * x) ** 2, lab:R`|\psi_1|^2`,
              f2:x => { const w = 0.125, a = Math.min(7, Math.floor(x / w)) * w; return (w - (Math.sin(2 * Math.PI * (a + w)) - Math.sin(2 * Math.PI * a)) / (2 * Math.PI)) / w; }, lab2:'\\text{Histogramm}',
              cap:R`Durchgezogen: die Dichte. Gestrichelt: das Histogramm sehr vieler Messungen mit Balken der Breite $L/8$, Höhe = Anteil der Treffer durch Balkenbreite. Die Fläche links von $L/4$ ist bei beiden $0{,}091$.`},
            {k:'labor', text:R`Labor „Dichte, Intervall und Erwartungswert“ mit $\psi_1 = \sqrt2\sin(\pi x)$: untere Grenze $a/L = 0$, obere Grenze $b/L = 0{,}25$. Die Anzeige „Wahrscheinlichkeit im Intervall“ zeigt $0{,}091$.`},
            {k:'physik', text:R`Von $1000$ Ortsmessungen am gleich präparierten Zustand landen etwa $91$ im linken Viertel; eine echte Messreihe schwankt um diesen Wert.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Das Intervall wird zu den Grenzen des Integrals, der Zustand zu $|\psi_1|^2$ im Integranden.`},
            {from:'formel', to:'graph', rule:R`Den Integranden über $x$ zeichnen. Das Integral ist die Fläche zwischen den Grenzen.`},
            {from:'graph', to:'labor', rule:R`Im Labor dieselbe Wellenfunktion wählen und die beiden Regler auf die Ränder der Fläche setzen.`},
            {from:'labor', to:'physik', rule:R`Den angezeigten Wert mit der Zahl der Messungen multiplizieren. Das ist die erwartete Zahl der Treffer.`}
          ]},
        q:{q:R`Im Graphen ist der Histogrammbalken über $[0{,}375L;\ 0{,}5L]$ etwa $1{,}9/L$ hoch. Wie viele von $1000$ Messungen fallen in diesen Balken?`, tr:{from:'graph', to:'physik'},
          opts:[R`etwa $1900$`, R`etwa $125$`, R`etwa $238$`], a:2,
          ex:R`Fläche des Balkens: Höhe mal Breite, $1{,}9/L\cdot0{,}125L \approx 0{,}238$. Mal $1000$ Messungen ergibt etwa $238$ Treffer.`,
          fb:[R`Die Höhe ist eine Dichte. Erst Höhe mal Breite ergibt eine Wahrscheinlichkeit, und die ist kleiner als 1.`,
            R`$125$ wären es bei gleichmäßiger Verteilung über den Kasten. In der Mitte ist die Dichte aber fast doppelt so hoch wie im Mittel.`,
            '']}},
      {id:'wf-t4d', title:'Normierung: Irgendwo ist das Teilchen sicher',
        num:{title:'Den Vorfaktor im Kasten bestimmen', text:R`Ansatz $\psi(x) = A\sin(\pi x/L)$ im Kasten, außen $\psi = 0$. Mit $\int_0^L\sin^2(\pi x/L)\,dx = L/2$ folgt

$$\int_0^L|\psi|^2\,dx = |A|^2\,\frac L2 = 1\quad\Longrightarrow\quad |A| = \sqrt{\frac2L}.$$

Für $L = 1\,\mathrm{nm}$ ist $A \approx 1{,}41\,\mathrm{nm}^{-1/2}$. Das ist der Vorfaktor von $\psi_1$.`},
        text:R`Irgendwo ist das Teilchen sicher. Das ist die [[lex:normierung|Normierung]]:

$$\int_{-\infty}^{\infty}|\psi(x,t)|^2\,dx = 1.$$

Multiplizierst du eine Lösung der Schrödingergleichung mit einer Konstanten $A$, bleibt sie eine Lösung. Man wählt $|A|$ so, dass die Normierung gilt. Das geht nur, wenn $\int|\psi|^2dx$ endlich ist: $\psi$ muss [[lex:quadratintegrabel|quadratintegrabel]] sein. Eine Konstante oder $e^{ikx}$ auf der ganzen Achse lässt sich nicht normieren (Thema 4).

**Rezept.** Vorfaktor $A$ ansetzen, $|A|^2$ vor das Integral ziehen, integrieren, nach $|A|$ auflösen. Die Phase von $A$ bleibt frei; üblich ist $A > 0$.`,
        q:{q:R`Welche Einheit hat $\psi$ für ein Teilchen auf einer Linie?`,
          opts:[R`$1/\text{Länge}$`, R`keine, $\psi$ ist eine reine Zahl`, R`$1/\sqrt{\text{Länge}}$`], a:2,
          ex:R`$\int|\psi|^2dx = 1$ ist eine reine Zahl, $dx$ eine Länge. Also hat $|\psi|^2$ die Einheit $1/\text{Länge}$ und $\psi$ die Einheit $1/\sqrt{\text{Länge}}$, wie $\sqrt{2/L}$.`,
          fb:[R`Das ist die Einheit von $|\psi|^2$, der Dichte. $\psi$ selbst hat die Wurzel davon.`,
            R`Dann hätte $\int|\psi|^2dx$ die Einheit einer Länge und könnte nicht gleich der reinen Zahl 1 sein.`,
            '']}},
      {id:'wf-t4e', title:'Eine komplexe Funktion normieren',
        pre:{from:'m-analysis', seg:'ma-t3', title:'Gauß-Integrale', text:R`Für $\alpha > 0$ gilt $\int_{-\infty}^\infty e^{-\alpha x^2}dx = \sqrt{\pi/\alpha}$ und $\int_{-\infty}^\infty x^2e^{-\alpha x^2}dx = \frac{1}{2\alpha}\sqrt{\pi/\alpha}$. Mini-Beispiel mit $\alpha = 1/a^2$: $\int e^{-x^2/a^2}dx = a\sqrt\pi$ und $\int x^2e^{-x^2/a^2}dx = \tfrac{a^3}{2}\sqrt\pi$.`},
        num:{title:'Erst mit $a = 1$', text:R`Für $\psi(x) = A\,(x + i)\,e^{-x^2/2}$ ist $|x + i|^2 = (x - i)(x + i) = x^2 + 1$, also

$$|A|^2\int_{-\infty}^{\infty}(x^2 + 1)\,e^{-x^2}dx = |A|^2\left(\tfrac{\sqrt\pi}{2} + \sqrt\pi\right) = 1.$$

Daraus folgt $A = \sqrt{2/(3\sqrt\pi)} \approx 0{,}613$.`},
        text:R`Jetzt allgemein für $\psi(x) = A\,(x + ia)\,e^{-x^2/(2a^2)}$ mit $a > 0$. Die Herleitung geht das Rezept Zeile für Zeile durch. Entscheidend ist die zweite Zeile: $|x + ia|^2 = (x - ia)(x + ia) = x^2 + a^2$. Für die Integrale brauchst du die beiden [[lex:gauss-integral|Gauß-Integrale]] aus der Auffrischung.

Prüfe das Ergebnis mit dem Beispiel: Für $a = 1$ wird $\sqrt{2/(3\sqrt\pi\,a^3)}$ zu $0{,}613$. Prüfe auch die Einheit. $A$ hat die Einheit $\text{Länge}^{-3/2}$, und $x + ia$ bringt eine Länge dazu. Zusammen ergibt das $1/\sqrt{\text{Länge}}$, wie es für $\psi$ sein muss.`,
        derive:{ctx:CTX.line({params:{a:'pos', m:'pos'}, defs:{'ψ(x)':'A (x + i a) e^(-x^2/(2a^2))'}, unknowns:{A:{ref:'sqrt(2/(3 sqrt(π) a^3))'}}}),
          lines:[
            {l:'∫_-∞^∞ |ψ|^2 dx = 1', w:'Normierung'},
            {l:'|A|^2 ∫_-∞^∞ (x^2 + a^2) e^(-x^2/a^2) dx = 1', w:'|x + ia|² = x² + a²', why:{q:'Warum steht hier $x^2 + a^2$ und nicht $x^2 - a^2$?', opts:['$|x + ia|^2 = (x - ia)(x + ia) = x^2 + a^2$', '$(x + ia)^2 = x^2 + a^2$, weil $i^2 = 1$ ist', 'Man darf den Imaginärteil beim Normieren weglassen.'], a:0, ex:'Das Betragsquadrat braucht die komplex konjugierte Zahl. Dann fällt der Mischterm weg, und $-i\\cdot i = +1$.'}},
            {l:'|A|^2 (a^3 sqrt(π)/2 + a^3 sqrt(π)) = 1', w:'zwei Gauß-Integrale'},
            {l:'|A|^2 · 3a^3 sqrt(π)/2 = 1', w:'Klammer zusammengefasst'},
            {l:'A = sqrt(2/(3 sqrt(π) a^3))', w:'Phase frei: A > 0 gewählt', why:{q:'Warum legt die Normierung nur $|A|$ fest?', opts:['Weil $A$ und $e^{i\\alpha}A$ dasselbe $|\\psi|^2$ liefern.', 'Weil die Wurzel immer positiv ist.', 'Weil $A$ eine Länge ist und Längen positiv sind.'], a:0, ex:'Ein globaler Phasenfaktor ändert keine Wahrscheinlichkeit. Deshalb wählt man meist $A > 0$.'}}
          ]},
        q:{q:R`Für $a = 2$: Welchen Wert hat das Normierungsintegral $\int_{-\infty}^\infty(x^2 + a^2)\,e^{-x^2/a^2}dx$?`,
          opts:[R`$-4\sqrt\pi$`, R`$8\sqrt\pi$`, R`$12\sqrt\pi$`], a:2,
          ex:R`$\tfrac{a^3}{2}\sqrt\pi + a^2\cdot a\sqrt\pi = \tfrac32a^3\sqrt\pi = 12\sqrt\pi$ für $a = 2$.`,
          fb:[R`So käme es mit $(x + ia)^2$ statt $|x + ia|^2$ heraus. Ein Normierungsintegral kann nie negativ sein.`,
            R`Das ist nur der Teil mit $a^2$, also $a^2\cdot a\sqrt\pi$. Der Teil mit $x^2$ fehlt.`,
            '']}},
      {id:'wf-t4f', title:'Real- und Imaginärteil im Bild',
        pre:{from:'m-komplex', seg:'mk-t4', title:'Komplexe Funktionen', text:R`Eine komplexe Funktion ist $f(x) = u(x) + i\,v(x)$ mit reellen $u$ und $v$. Ihr Betragsquadrat ist $|f|^2 = f^*f = u^2 + v^2$. Mini-Beispiel: $e^{ikx} = \cos kx + i\sin kx$ hat $|e^{ikx}|^2 = \cos^2kx + \sin^2kx = 1$.`},
        num:{title:'Ein Paket mit $k = 4$', text:R`Sei $\psi(x) = \pi^{-1/4}\,e^{ikx}\,e^{-x^2/2}$ mit $k = 4$. Bei $x = 0$ ist $\psi = \pi^{-1/4} \approx 0{,}75$, rein reell. Bei $x = \pi/8$ ist $kx = \pi/2$ und $\psi = i\,\pi^{-1/4}e^{-\pi^2/128} \approx 0{,}70\,i$, rein imaginär. Das Betragsquadrat ist überall

$$|\psi|^2 = \pi^{-1/2}\,e^{-x^2},$$

ohne $k$. In der Mitte ist es $0{,}56$.`},
        text:R`Eine komplexe Wellenfunktion kann man nicht als eine einzige Kurve zeichnen. Man zeichnet zwei: Realteil $\operatorname{Re}\psi$ und Imaginärteil $\operatorname{Im}\psi$. Das Beispiel ist ein **Wellenpaket**, eine Welle in einem Buckel. Bei ihm schwingen beide unter derselben Gauß-Hülle, gegeneinander um eine Viertelwelle verschoben. Die Phase $kx$ dreht sich mit dem Ort.

Die Dichte $|\psi|^2 = (\operatorname{Re}\psi)^2 + (\operatorname{Im}\psi)^2$ sieht davon nichts. Wo der Realteil null ist, ist der Imaginärteil groß, und umgekehrt. Übrig bleibt die glatte Hülle. Die Wellenzahl $k$ steckt nur in der Phase. Trotzdem ist sie messbar: Abschnitt 6 zeigt, dass sie den mittleren Impuls bestimmt.`,
        reps:{obj:R`Ein Wellenpaket: Formel, Real- und Imaginärteil, Dichte`,
          rows:[
            {k:'worte', text:R`Ein Buckel um $x = 0$, in dem eine Welle mit der Wellenlänge $2\pi/k$ steckt.`},
            {k:'formel', tex:R`\psi(x) = \pi^{-1/4}e^{-x^2/2}\left(\cos kx + i\sin kx\right),\qquad k = 4`},
            {k:'graph', plot:{x:[-3.5, 3.5], y:[-0.85, 0.85], xlab:'x', ylab:R`\psi`, ticks:[{x:-3, lab:'-3'}, {x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}, {x:3, lab:'3'}], yticks:[{y:-0.75, lab:'-0{,}75'}, {y:0.75, lab:'0{,}75'}]}, f:x => Math.PI ** -0.25 * Math.exp(-x * x / 2) * Math.cos(4 * x), lab:R`\operatorname{Re}\psi`, f2:x => Math.PI ** -0.25 * Math.exp(-x * x / 2) * Math.sin(4 * x), lab2:R`\operatorname{Im}\psi`,
              cap:R`Real- und Imaginärteil schwingen unter derselben Hülle $\pm\pi^{-1/4}e^{-x^2/2}$, um eine Viertelwelle gegeneinander verschoben.`},
            {k:'mathe', tex:R`|\psi|^2 = (\operatorname{Re}\psi)^2 + (\operatorname{Im}\psi)^2 = \pi^{-1/2}e^{-x^2}\left(\cos^2kx + \sin^2kx\right) = \pi^{-1/2}e^{-x^2}`},
            {k:'physik', text:R`Die Ortsverteilung $\pi^{-1/2}e^{-x^2}$ hängt nicht von $k$ ab. $k$ steckt in der Phase und bestimmt den mittleren Impuls (Abschnitt 6).`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Den Buckel als Gauß-Funktion schreiben, mit der Welle $e^{ikx}$ multiplizieren und $e^{ikx}$ mit der Euler-Formel zerlegen.`},
            {from:'formel', to:'graph', rule:R`Den Teil ohne $i$ als erste Kurve zeichnen, den Faktor vor $i$ als zweite.`},
            {from:'graph', to:'mathe', rule:R`Beide Kurven an jeder Stelle quadrieren und die Quadrate addieren.`},
            {from:'mathe', to:'physik', rule:R`Wegen $\cos^2 + \sin^2 = 1$ bleibt nur die Hülle. Sie ist die Ortsverteilung der Messwerte.`}
          ]},
        plot:{plot:{x:[-3.5, 3.5], y:[0, 0.65], xlab:'x', ylab:R`|\psi|^2`, ticks:[{x:-3, lab:'-3'}, {x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}, {x:3, lab:'3'}], yticks:[{y:0.56, lab:'0{,}56'}]}, f:x => Math.exp(-x * x) / Math.sqrt(Math.PI), lab:R`|\psi|^2`,
          cap:R`Die Dichte desselben Pakets: eine glatte Gauß-Kurve, für jedes $k$ dieselbe.`},
        q:{q:R`Im Graphen nimmst du $k = 8$ statt $k = 4$: Real- und Imaginärteil schwingen doppelt so schnell. Was geschieht mit $|\psi|^2$?`, tr:{from:'graph', to:'physik'},
          opts:[R`Es bekommt doppelt so viele Buckel.`, R`Es wird halb so breit.`, R`Es bleibt genau gleich.`], a:2,
          ex:R`$|\psi|^2 = \pi^{-1/2}e^{-x^2}$ enthält $k$ nicht. $k$ ändert nur die Phase.`,
          fb:[R`Die Buckel von $\operatorname{Re}\psi$ und $\operatorname{Im}\psi$ füllen sich gegenseitig auf. In $|\psi|^2$ bleibt keine Schwingung übrig.`,
            R`Die Breite steckt in der Hülle $e^{-x^2/2}$, nicht in $k$.`,
            '']}},
      {id:'wf-t4g', title:'Typischer Fehler: ψ² statt |ψ|²',
        num:{title:'Ein Wert, zwei Rechnungen', text:R`An einer Stelle ist $\psi = (1 + i)\,\mathrm{nm}^{-1/2}$. Falsch ist $\psi^2 = 1 + 2i + i^2 = 2i\,\mathrm{nm}^{-1}$, eine imaginäre „Dichte“. Richtig ist

$$|\psi|^2 = \psi^*\psi = (1 - i)(1 + i) = 1 + 1 = 2\,\mathrm{nm}^{-1}.$$`},
        text:R`Der häufigste Rechenfehler mit Wellenfunktionen ist, $\psi^2$ statt $|\psi|^2 = \psi^*\psi$ zu schreiben. Für reelle $\psi$, etwa im Kasten, merkt man nichts. Bei komplexen $\psi$ wird die „Dichte“ komplex oder negativ.

Bei $\psi = A\,(x + ia)\,e^{-x^2/(2a^2)}$ ergibt $(x + ia)^2 = x^2 - a^2 + 2iax$. In der Mitte wäre die „Dichte“ dann negativ. Beim Wellenpaket bliebe $e^{2ikx}$ stehen, und das Normierungsintegral hinge fälschlich von $k$ ab. Ein schneller Test: Ist eine berechnete Dichte irgendwo negativ oder komplex, fehlt ein Stern.`,
        q:{q:R`Für welche Wellenfunktion liefern $\int\psi^2dx$ und $\int|\psi|^2dx$ dasselbe? Der Vorfaktor $A$ sei jeweils positiv.`,
          opts:[R`für $\psi = A\,(x + ia)\,e^{-x^2/(2a^2)}$`, R`für $\psi = A\,x\,e^{-x^2}$`, R`für $\psi = A\,e^{ikx}e^{-x^2/2}$ mit kleinem $k$`], a:1,
          ex:R`$A\,x\,e^{-x^2}$ ist reell. Für reelles $\psi$ ist $\psi^* = \psi$, also $\psi^2 = |\psi|^2$. Sobald $\psi$ komplex ist, muss der Stern dabei sein.`,
          fb:[R`Diese Funktion ist komplex. $\psi^2$ enthält $-a^2$ und einen imaginären Mischterm.`,
            '',
            R`Auch für kleines $k$ bleibt $e^{2ikx}$ in $\psi^2$ stehen. Gleich sind die Integrale nur für $k = 0$.`]}}
    ]},

    /* ===== Abschnitt 5: Erhaltung der Normierung ===== */
    {id:'wf-t5', title:'Die Normierung bleibt erhalten', steps:[
      {id:'wf-t5a', title:'Warum die Normierung erhalten bleiben muss',
        num:{title:'Ein Paket wird breiter', text:R`Eine Gauß-Dichte mit der Breite $\sigma = 1\,\mathrm{nm}$ hat in der Mitte die Höhe $1/(\sqrt{2\pi}\,\sigma) \approx 0{,}40\,\mathrm{nm}^{-1}$. Zerfließt das Paket auf $\sigma = 2\,\mathrm{nm}$, fällt die Höhe auf $0{,}20\,\mathrm{nm}^{-1}$. Doppelt so breit, halb so hoch: Die Fläche bleibt $1$.`},
        text:R`Borns Deutung funktioniert nur, wenn ein normiertes $\psi$ normiert bleibt. Sonst wäre das Teilchen später mit Wahrscheinlichkeit $0{,}8$ oder $1{,}3$ „irgendwo“. Wie sich $\psi$ zeitlich ändert, bestimmt die [[lex:schroedinger|Schrödingergleichung]]. Thema 2 begründet sie; hier nimmst du sie als gegeben:

$$i\hbar\frac{\partial\psi}{\partial t} = -\frac{\hbar^2}{2m}\frac{\partial^2\psi}{\partial x^2} + V(x)\,\psi.$$

Links steht die zeitliche Änderung von $\psi$, rechts die zweite Ortsableitung und das Potential $V$. Die nächsten Schritte zeigen, dass daraus $\frac{d}{dt}\int|\psi|^2dx = 0$ folgt. Ein freies Paket zerfließt zwar (Thema 4), aber so, dass die Fläche gleich bleibt.`,
        q:{q:R`Ein Paket ist bei $t = 0$ normiert. Später ist es dreimal so breit und hat dieselbe Form. Was gilt für seine Dichte in der Mitte?`,
          opts:[R`Sie ist dreimal so hoch.`, R`Sie ist ein Drittel so hoch.`, R`Sie ist gleich hoch, denn die Normierung bleibt.`], a:1,
          ex:R`Die Fläche, Höhe mal Breite, bleibt $1$. Dreifache Breite verlangt ein Drittel der Höhe.`,
          fb:[R`Breiter und höher hieße mehr Fläche als 1. Die Normierung bliebe nicht erhalten.`,
            '',
            R`Gleich hoch und dreimal so breit hieße die Fläche $3$. Erhalten bleibt die Fläche, nicht die Höhe.`]}},
      {id:'wf-t5b', title:'Die Gleichung für ψ und für ψ*',
        pre:{from:'m-komplex', seg:'mk-t1', title:'Konjugieren', text:R`Konjugieren ersetzt überall $i$ durch $-i$. Es verträgt sich mit Summen und Produkten: $(z_1 + z_2)^* = z_1^* + z_2^*$ und $(z_1z_2)^* = z_1^*z_2^*$. Reelle Zahlen bleiben, wie sie sind. Mini-Beispiel: $(-3i\,z)^* = 3i\,z^*$.`},
        num:{title:'Ein Phasenfaktor', text:R`Für $\psi = f(x)\,e^{-i\omega t}$ mit reellem $f$ ist $\partial_t\psi = -i\omega\,\psi$. Konjugiert: $\psi^* = f\,e^{+i\omega t}$ und $\partial_t\psi^* = +i\omega\,\psi^*$. Dann ist

$$\partial_t|\psi|^2 = \psi^*(-i\omega\psi) + \psi\,(i\omega\psi^*) = 0.$$

Die beiden Terme heben sich auf, weil $i$ beim Konjugieren das Vorzeichen wechselt.`},
        text:R`Für den Beweis brauchst du die Zeitableitungen von $\psi$ und von $\psi^*$. Löse die Schrödingergleichung nach $\partial_t\psi$ auf und konjugiere sie dann. Für reelles $V$ erhältst du

$$\frac{\partial\psi}{\partial t} = \frac{i\hbar}{2m}\psi'' - \frac{i}{\hbar}V\psi,\qquad \frac{\partial\psi^*}{\partial t} = -\frac{i\hbar}{2m}\psi^{*\prime\prime} + \frac{i}{\hbar}V\psi^*.$$

Dabei ist $\psi'' = \partial^2\psi/\partial x^2$. In der zweiten Gleichung hat jedes $i$ sein Vorzeichen gewechselt, sonst nichts. Genau das macht später die Terme mit $V$ entgegengesetzt gleich. Das Beispiel zeigt denselben Mechanismus im Kleinen.`,
        q:{q:R`Welche Gleichung gilt für $\partial\psi^*/\partial t$, wenn $V$ reell ist?`,
          opts:[R`$\frac{i\hbar}{2m}\psi^{*\prime\prime} - \frac{i}{\hbar}V\psi^*$`, R`$-\frac{i\hbar}{2m}\psi^{*\prime\prime} + \frac{i}{\hbar}V\psi^*$`, R`$-\frac{i\hbar}{2m}\psi^{*\prime\prime} - \frac{i}{\hbar}V\psi^*$`], a:1,
          ex:R`Jeder Faktor wird konjugiert: $i \to -i$, $\psi \to \psi^*$, $V \to V^* = V$.`,
          fb:[R`Hier ist nur $\psi$ durch $\psi^*$ ersetzt. Beim Konjugieren wechselt auch jedes $i$ sein Vorzeichen.`,
            '',
            R`Auch das $i$ im $V$-Term muss sein Vorzeichen wechseln. $V$ selbst bleibt, weil es reell ist.`]}},
      {id:'wf-t5c', title:'Der Beweis in vier Zeilen',
        num:{title:'Reelles und komplexes Potential', text:R`Beim Einsetzen treffen sich die Potentialterme $\psi^*\left(-\tfrac{i}{\hbar}V\psi\right)$ und $\psi\left(\tfrac{i}{\hbar}V^*\psi^*\right)$. Mit $\hbar = 1$ und $|\psi|^2 = 1$ an einer Stelle:

$$\begin{aligned}V = 3&:\quad -3i + 3i = 0,\\ V = 3 - i&:\quad -i(3 - i) + i(3 + i)\\ &\phantom{:\quad} = -2.\end{aligned}$$

Ein reelles $V$ fällt heraus. Ein $V$ mit negativem Imaginärteil lässt $|\psi|^2$ abnehmen.`},
        text:R`Die Herleitung zeigt $\frac{d}{dt}\int|\psi|^2dx = 0$. Die Produktregel liefert zwei Terme. Beim Einsetzen der Gleichungen aus dem letzten Schritt heben sich die $V$-Terme weg, **weil $V$ reell ist**. Der Rest ist eine Ableitung nach $x$:

$$\psi^*\psi'' - \psi\psi^{*\prime\prime} = \frac{\partial}{\partial x}\left(\psi^*\psi' - \psi\psi^{*\prime}\right),$$

denn die Produkte $\psi^{*\prime}\psi'$ heben sich weg. Das Integral über eine Ableitung ist ein Randterm. Er verschwindet, weil physikalisch sinnvolle $\psi$ samt Ableitung im Unendlichen gegen null gehen. Streng mathematisch folgt das aus der Normierbarkeit allein nicht; die Gegenbeispiele kommen in der Physik aber nicht vor.`,
        derive:{ctx:DYN(),
          lines:[
            {l:'d/dt ∫_-∞^∞ |ψ|^2 dx = ∫_-∞^∞ (ψ^* ∂ψ/∂t + ψ ∂ψ^*/∂t) dx', w:'Produktregel unter dem Integral', why:{q:'Warum zwei Terme?', opts:['Weil $|\\psi|^2 = \\psi^*\\psi$ ist und beide Faktoren von $t$ abhängen.', 'Weil $\\psi$ einen Real- und einen Imaginärteil hat.', 'Weil die Schrödingergleichung zwei Seiten hat.'], a:0, ex:'Produktregel: $\\partial_t(\\psi^*\\psi) = \\psi^*\\partial_t\\psi + \\psi\\,\\partial_t\\psi^*$.'}},
            {l:'= iħ/(2m) ∫_-∞^∞ (ψ^* ∂^2ψ/∂x^2 - ψ ∂^2ψ^*/∂x^2) dx', w:'Schrödingergleichung eingesetzt; V-Terme heben sich weg', why:{q:'Warum fallen die Terme mit $V$ heraus?', opts:['weil $V^* = V$: $-\\frac{i}{\\hbar}V|\\psi|^2 + \\frac{i}{\\hbar}V|\\psi|^2 = 0$', 'weil $V$ im Unendlichen null ist', 'weil $V$ nicht von der Zeit abhängt'], a:0, ex:'Für reelles $V$ sind die beiden $V$-Terme entgegengesetzt gleich. Bei komplexem $V$ bliebe $\\frac{2}{\\hbar}\\,\\mathrm{Im}(V)|\\psi|^2$ übrig.'}},
            {l:'= iħ/(2m) [ψ^* ∂ψ/∂x - ψ ∂ψ^*/∂x]_-∞^∞', w:'Integrand ist eine Ableitung nach x'},
            {l:'= 0', w:'ψ → 0 für |x| → ∞', why:{q:'Warum verschwindet der Randterm?', opts:['Weil sinnvolle $\\psi$ samt $\\psi\'$ im Unendlichen gegen null gehen.', 'Weil $\\psi^*\\psi\'$ und $\\psi\\psi^{*\\prime}$ immer gleich sind.', 'Weil man Randterme in der Physik grundsätzlich weglässt.'], a:0, ex:'Für physikalisch sinnvolle $\\psi$ gehen $\\psi$ und $\\psi\'$ im Unendlichen gegen null. Mathematisch folgt das aus der Normierbarkeit allein nicht, die Gegenbeispiele kommen in der Physik aber nicht vor. Randterme verschwinden nie „grundsätzlich“; man muss sie jedes Mal begründen.'}}
          ]},
        q:{q:R`Welche Voraussetzung braucht der Schritt, in dem sich die Terme mit $V$ wegheben?`,
          opts:[R`$V$ ist zeitunabhängig.`, R`$\psi$ ist reell.`, R`$V$ ist reell.`, R`$V$ ist überall null.`], a:2,
          ex:R`Für reelles $V$ ist der $V$-Term in $\psi\,\partial_t\psi^*$ genau das Negative des $V$-Terms in $\psi^*\partial_t\psi$. Auch ein zeitabhängiges reelles $V$ erhält die Normierung.`,
          fb:[R`Auch ein zeitabhängiges, reelles $V$ erhält die Normierung. Die Rechnung braucht nur $V^* = V$.`,
            R`Gerade für komplexe $\psi$ ist der Satz wichtig. Die Rechnung gilt für jedes $\psi$.`,
            '',
            R`Es genügt, dass $V$ reell ist. Sein Wert spielt keine Rolle.`]}},
      {id:'wf-t5d', title:'Folgerungen: einmal normieren genügt',
        num:{title:'Ohne $i$: Wärmeleitung', text:R`In der Wärmeleitungsgleichung $\partial_tu = D\,\partial_x^2u$ fehlt das $i$. Ihre Lösung $u = e^{-Dk^2t}\sin kx$ klingt ab. Nach der Zeit $t = 1/(Dk^2)$ ist $u$ auf $e^{-1}$ gefallen, $\int u^2dx$ also auf $e^{-2} \approx 0{,}14$ seines Anfangswerts.`},
        text:R`Drei Folgerungen.

- Man muss nur einmal normieren, etwa bei $t = 0$. Die Rechnung braucht nur ein reelles $V$; es darf sogar von der Zeit abhängen.
- Das $i$ in der Gleichung ist wesentlich. Ohne $i$ entsteht die Wärmeleitungsgleichung, und $\int u^2dx$ nimmt ab, wie im Beispiel (mehr in Thema 2).
- Ein Potential mit negativem Imaginärteil ließe die Normierung abnehmen. Genau so modelliert man Teilchen, die absorbiert werden oder zerfallen (Knobelaufgabe in Thema 2).

Der Randterm $\frac{i\hbar}{2m}\left(\psi^*\psi' - \psi\psi^{*\prime}\right)$ ist bis auf das Vorzeichen der Wahrscheinlichkeitsstrom. Mit ihm beschreibt Thema 2, wie Wahrscheinlichkeit von Ort zu Ort fließt.`,
        q:{q:R`Welche Gleichung erhält $\int|\psi|^2dx$ für jedes normierbare $\psi$?`,
          opts:[R`$\partial_t\psi = D\,\partial_x^2\psi$ mit $D > 0$`, R`$i\hbar\,\partial_t\psi = -\frac{\hbar^2}{2m}\psi'' + V\psi$ mit $V = V_0 - iW$ und $W > 0$`, R`$i\hbar\,\partial_t\psi = -\frac{\hbar^2}{2m}\psi'' + V\psi$ mit reellem $V(x, t)$`], a:2,
          ex:R`Nur das $i$ zusammen mit einem reellen $V$ erhält die Normierung. Eine Zeitabhängigkeit von $V$ schadet nicht.`,
          fb:[R`Ohne $i$ zerfließt die Lösung wie Wärme, und das Integral nimmt ab.`,
            R`Ein negativer Imaginärteil im Potential lässt die Normierung abnehmen: Teilchen werden „verschluckt“.`,
            '']}}
    ]},

    /* ===== Abschnitt 6: Erwartungswerte, Impulsoperator ===== */
    {id:'wf-t6', title:'Erwartungswerte und der Impulsoperator', steps:[
      {id:'wf-t6a', title:'Der Erwartungswert: Mittelwert vieler Messungen',
        pre:{from:'m-stat', seg:'st-t3', title:'Erwartungswert einer Dichte', text:R`Für eine Dichte $\rho$ ist der Erwartungswert $\langle x\rangle = \int x\,\rho(x)\,dx$: jeder Wert, gewichtet mit seiner Wahrscheinlichkeit. Er ist der Schwerpunkt der Verteilung und muss kein möglicher Wert sein. Mini-Beispiel: Beim Würfel ist $\langle x\rangle = 3{,}5$.`},
        num:{title:'Grundzustand im Kasten', text:R`Für $\psi_1$ im Kasten mit $L = 1\,\mathrm{nm}$ ist $|\psi_1|^2$ spiegelsymmetrisch um die Mitte, also $\langle x\rangle = 0{,}5\,\mathrm{nm}$. Ausgerechnet ist

$$\langle x^2\rangle = \int_0^L x^2\,|\psi_1|^2\,dx = L^2\left(\frac13 - \frac{1}{2\pi^2}\right) \approx 0{,}283\,\mathrm{nm}^2.$$

Beachte: $0{,}283\,\mathrm{nm}^2$ ist mehr als $\langle x\rangle^2 = 0{,}25\,\mathrm{nm}^2$.`},
        text:R`Misst man an vielen gleich präparierten Systemen den Ort, nähert sich der Mittelwert der Ergebnisse dem [[lex:erwartungswert|Erwartungswert]]

$$\langle x\rangle = \int x\,|\psi(x,t)|^2\,dx,$$

gelesen „Erwartungswert von x“. Das ist der Mittelwert einer Zufallsgröße mit der Dichte $|\psi|^2$ (M9). Ebenso gilt $\langle f(x)\rangle = \int f(x)\,|\psi|^2dx$, etwa für $\langle x^2\rangle$ oder die mittlere potentielle Energie $\langle V\rangle$. Symmetrie spart Arbeit: Ist $|\psi|^2$ spiegelsymmetrisch um $x_0$, dann ist $\langle x\rangle = x_0$. Im Allgemeinen ist $\langle x^2\rangle \ne \langle x\rangle^2$.`,
        q:{q:R`$|\psi|^2$ ist spiegelsymmetrisch um $x_0 = 2\,\mathrm{nm}$. Was gilt sicher?`,
          opts:[R`$\langle x\rangle = 2\,\mathrm{nm}$`, R`$\langle x^2\rangle = 4\,\mathrm{nm}^2$`, R`Das Maximum von $|\psi|^2$ liegt bei $2\,\mathrm{nm}$.`], a:0,
          ex:R`Bei symmetrischer Dichte heben sich die Beiträge links und rechts von $x_0$ auf: $\langle x - x_0\rangle = 0$.`,
          fb:['',
            R`$\langle x^2\rangle$ ist größer als $\langle x\rangle^2 = 4\,\mathrm{nm}^2$, außer die Verteilung hat die Breite null.`,
            R`Eine symmetrische Dichte kann bei $x_0$ ein Minimum haben, etwa mit zwei Buckeln links und rechts.`]}},
      {id:'wf-t6b', title:'Typischer Fehler: Erwartungswert als Messwert oder Maximum',
        num:{title:'Zwei Gegenbeispiele', text:R`Für $\psi = A\,x\,e^{-x/a}$ ($x > 0$) liegt das Maximum von $|\psi|^2$ bei $x = a$. Mit $|A|^2 = 4/a^3$ ist aber

$$\langle x\rangle = \frac{4}{a^3}\int_0^\infty x^3e^{-2x/a}\,dx = \frac{4}{a^3}\cdot\frac{3!}{(2/a)^4} = \frac{3a}{2}.$$

Und für $\psi_2 = \sqrt{2/L}\,\sin(2\pi x/L)$ im Kasten, den nächsthöheren Zustand nach $\psi_1$ (Thema 3), ist $\langle x\rangle = L/2$. Das ist genau die Nullstelle von $\psi_2$, wo man das Teilchen nie findet.`},
        text:R`Zwei Fehlvorstellungen über $\langle x\rangle$ sind besonders verbreitet.

- $\langle x\rangle$ ist **nicht das Ergebnis einer einzelnen Messung.** Hat $|\psi|^2$ zwei getrennte Buckel, kann $\langle x\rangle$ sogar dort liegen, wo man das Teilchen nie findet.
- $\langle x\rangle$ ist **nicht der wahrscheinlichste Ort.** Fällt die Dichte nach einer Seite langsamer ab, zieht der lange Ausläufer den Mittelwert dorthin.

Die Tafel zeigt das erste Beispiel in fünf Gestalten. Merke: Das Maximum findest du mit der Ableitung, den Mittelwert mit einem Integral.`,
        reps:{obj:'Maximum und Mittelwert einer Dichte',
          rows:[
            {k:'worte', text:R`Am häufigsten findet man das Teilchen bei $x = a$, im Mittel aber weiter rechts.`},
            {k:'formel', tex:R`|\psi|^2 = \frac{4}{a^3}\,x^2e^{-2x/a},\qquad x_{\max} = a,\qquad \langle x\rangle = \int_0^\infty x\,|\psi|^2\,dx = \frac{3a}{2}`},
            {k:'graph', plot:{x:[0, 5], y:[0, 0.75], xlab:'x/a', ylab:R`a\,|\psi|^2`, ticks:[{x:1, lab:'1'}, {x:1.5, lab:'1{,}5'}, {x:2, lab:'2'}, {x:3, lab:'3'}, {x:4, lab:'4'}]}, f:x => 4 * x * x * Math.exp(-2 * x), lab:R`|\psi|^2`, f2:x => 4 * x ** 3 * Math.exp(-2 * x), lab2:R`x\,|\psi|^2`,
              cap:R`Durchgezogen: die Dichte mit dem Maximum bei $x = a$. Gestrichelt: der Integrand von $\langle x\rangle$; seine Fläche ist $\tfrac32a$.`},
            {k:'mathe', text:R`$\langle x\rangle$ ist der Schwerpunkt der Verteilung (M9). Der lange Ausläufer rechts hat einen großen Hebelarm $x$ und zieht den Schwerpunkt nach rechts.`},
            {k:'physik', text:R`Von vielen Ortsmessungen liegen etwa $58\,\%$ unter $\tfrac32a$. Ihr Mittelwert nähert sich trotzdem $\tfrac32a$, nicht $a$.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Das Maximum aus $d|\psi|^2/dx = 0$ bestimmen, den Mittelwert als Integral über $x\,|\psi|^2$.`},
            {from:'formel', to:'graph', rule:R`$|\psi|^2$ und den Integranden $x\,|\psi|^2$ über $x$ zeichnen. $\langle x\rangle$ ist die Fläche unter dem Integranden.`},
            {from:'graph', to:'mathe', rule:R`Die Dichte als Masse auf einem Stab lesen. $\langle x\rangle$ ist der Punkt, an dem der Stab im Gleichgewicht ist.`},
            {from:'mathe', to:'physik', rule:R`Der Schwerpunkt ist der Mittelwert sehr vieler Messwerte, nicht der häufigste einzelne Wert.`}
          ]},
        q:{q:R`Du siehst den Graphen von $|\psi_2|^2$ im Kasten: zwei gleich hohe Buckel bei $L/4$ und $3L/4$, eine Nullstelle bei $L/2$. Wo liegt $\langle x\rangle$?`, tr:{from:'graph', to:'formel'},
          opts:[R`bei $L/4$ oder $3L/4$, an einem der Maxima`, R`bei $L/2$, obwohl die Dichte dort null ist`, R`nirgends, $\langle x\rangle$ ist hier nicht definiert`], a:1,
          ex:R`Die Dichte ist symmetrisch um $L/2$. Der Schwerpunkt liegt in der Mitte, auch wenn dort nie ein Messwert liegt.`,
          fb:[R`Ein Mittelwert über zwei gleich große Buckel kann nicht an einem der beiden liegen.`,
            '',
            R`Das Integral $\int x\,|\psi_2|^2dx$ ist endlich, also ist $\langle x\rangle$ definiert.`]}},
      {id:'wf-t6c', title:'Wie man auf den Impuls kommt',
        num:{title:'Ein Mittelwert, der wandert', text:R`Angenommen, bei vielen gleich präparierten Elektronen wandert $\langle x\rangle$ in $1\,\mathrm{fs}$ um $3\,\mathrm{nm}$. Klassisch ordnest du dem die Geschwindigkeit $3\cdot10^{6}\,\mathrm{m/s}$ zu und den Impuls

$$m_e\frac{d\langle x\rangle}{dt} = 9{,}11\cdot10^{-31}\,\mathrm{kg}\cdot3\cdot10^{6}\,\mathrm{m/s} \approx 2{,}7\cdot10^{-24}\,\mathrm{kg\,m/s}.$$`},
        text:R`$|\psi|^2$ sagt etwas über den Ort, nicht direkt über den Impuls. Klassisch ist $p = m\,dx/dt$. Für Mittelwerte verlangt man dasselbe:

$$\langle p\rangle = m\,\frac{d\langle x\rangle}{dt}.$$

Die rechte Seite lässt sich mit der Schrödingergleichung ausrechnen. Die Herleitung beginnt wie bei der Normierung, nur steht unter dem Integral zusätzlich der Faktor $x$. Er hängt nicht von $t$ ab. Nach drei Zeilen steht unter dem Integral $x$ mal eine Ableitung nach $x$. Der nächste Schritt wälzt diese Ableitung mit partieller Integration ab.`,
        derive:{ctx:DYN({normalized:true}),
          lines:[
            {l:'d/dt ⟨x⟩ = ∫_-∞^∞ x ∂/∂t |ψ|^2 dx', w:'⟨x⟩ = ∫ x |ψ|² dx; x hängt nicht von t ab', why:{q:R`Warum darf die Zeitableitung unter das Integral, ohne dass $x$ abgeleitet wird?`, opts:['Weil $x$ die Integrationsvariable ist und nicht von $t$ abhängt.', 'Weil $\\langle x\\rangle$ selbst eine zeitlich konstante Zahl ist.', 'Weil $|\\psi|^2$ normiert ist und das Integral deshalb gleich bleibt.'], a:0, ex:R`Nur $|\psi|^2$ hängt von $t$ ab. Für $\partial_t$ ist der Faktor $x$ eine Konstante.`}},
            {l:'= iħ/(2m) ∫_-∞^∞ x (ψ^* ∂^2ψ/∂x^2 - ψ ∂^2ψ^*/∂x^2) dx', w:'wie bei der Normierung'},
            {l:'= iħ/(2m) ∫_-∞^∞ x ∂/∂x (ψ^* ∂ψ/∂x - ψ ∂ψ^*/∂x) dx', w:'Integrand als Ableitung geschrieben'}
          ]},
        q:{q:R`In einem Zustand bleibt $\langle x\rangle$ für alle Zeiten bei $L/2$. Was folgt für $\langle p\rangle$?`,
          opts:[R`$\langle p\rangle = 0$`, R`$\langle p\rangle = mL/2$`, R`Nichts, $\langle p\rangle$ hängt nicht mit $\langle x\rangle$ zusammen.`], a:0,
          ex:R`Konstantes $\langle x\rangle$ heißt $d\langle x\rangle/dt = 0$, also $\langle p\rangle = 0$. Das gilt zum Beispiel für $\psi_1$ im Kasten.`,
          fb:['',
            R`Das wäre $m\langle x\rangle$. Der Impuls gehört zur *Änderung* von $\langle x\rangle$.`,
            R`Genau diesen Zusammenhang fordert man: $\langle p\rangle = m\,d\langle x\rangle/dt$.`]}},
      {id:'wf-t6d', title:'Partiell integriert: der Impulsoperator',
        pre:{from:'m-analysis', seg:'ma-t4', title:'Partielle Integration und Randterme', text:R`$\int_a^bf\,g'\,dx = [fg]_a^b - \int_a^bf'g\,dx$. Gehen die Funktionen im Unendlichen gegen null, fällt der Randterm weg. Mini-Beispiel: $\int_{-\infty}^\infty x\,\frac{d}{dx}e^{-x^2}dx = \left[x\,e^{-x^2}\right]_{-\infty}^{\infty} - \int_{-\infty}^\infty e^{-x^2}dx = -\sqrt\pi$.`},
        num:{title:'Das Paket aus Abschnitt 4', text:R`Für $\psi = \pi^{-1/4}e^{ikx}e^{-x^2/2}$ ist $\psi' = (ik - x)\,\psi$. Damit wird

$$\int\psi^*\left(-i\hbar\,\psi'\right)dx = \int(\hbar k + i\hbar x)\,|\psi|^2\,dx = \hbar k + i\hbar\langle x\rangle = \hbar k,$$

denn $\langle x\rangle = 0$. Die Wellenzahl $k$, die in der Dichte nicht zu sehen war, gibt den mittleren Impuls.`},
        text:R`Die Herleitung wälzt zuerst die Ableitung vom Klammerausdruck auf den Faktor $x$ ab; $x' = 1$, und der Randterm ist null. Eine zweite partielle Integration macht aus der Differenz das Doppelte des ersten Terms ([[lex:partielle-integration|partielle Integration]]). Übrig bleibt

$$\langle p\rangle = \int\psi^*\left(-i\hbar\frac{\partial}{\partial x}\right)\psi\,dx.$$

Das hat dieselbe Form wie $\langle x\rangle = \int\psi^*\,x\,\psi\,dx$: erst $\psi^*$, dann etwas, das auf $\psi$ wirkt, dann integrieren. Man nennt $\hat p = -i\hbar\,\partial/\partial x$ den [[lex:impulsoperator|Impulsoperator]], gelesen „p Dach“. Er steht zwischen $\psi^*$ und $\psi$ und wirkt nach rechts.`,
        derive:{ctx:DYN({normalized:true}),
          lines:[
            {l:'d/dt ⟨x⟩ = -iħ/(2m) ∫_-∞^∞ (ψ^* ∂ψ/∂x - ψ ∂ψ^*/∂x) dx', w:'partiell integriert, Randterm null', why:{q:'Was passiert bei diesem Schritt?', opts:['Partielle Integration: $\\int x\\,g\'\\,dx = [x\\,g] - \\int g\\,dx$', 'Der Faktor $x$ wird durch seinen Mittelwert ersetzt.', 'Man leitet beide Seiten noch einmal nach $x$ ab.'], a:0, ex:'Die Ableitung wandert von $g = \\psi^*\\psi\' - \\psi\\psi^{*\\prime}$ auf $x$, und $x\' = 1$. Der Randterm $[x\\,g]$ verschwindet, weil $\\psi$ im Unendlichen schnell abfällt.'}},
            {l:'= -iħ/m ∫_-∞^∞ ψ^* ∂ψ/∂x dx', w:'zweiter Term partiell integriert', why:{q:'Warum wird aus der Differenz das Doppelte des ersten Terms?', opts:['Weil nach partieller Integration $-\\int\\psi\\,\\psi^{*\\prime}dx = +\\int\\psi^*\\psi\'\\,dx$ ist', 'Weil $\\psi$ und $\\psi^*$ unter dem Integral vertauschbar sind', 'Weil der zweite Term wegen der Symmetrie null ist'], a:0, ex:'$\\int\\psi\\,\\psi^{*\\prime}dx = [\\psi\\psi^*] - \\int\\psi^*\\psi\'\\,dx = -\\int\\psi^*\\psi\'\\,dx$. Also $\\int(\\psi^*\\psi\' - \\psi\\psi^{*\\prime})dx = 2\\int\\psi^*\\psi\'dx$.'}},
            {l:'m d/dt ⟨x⟩ = ∫_-∞^∞ ψ^* (-iħ ∂/∂x) ψ dx', w:'mit m multipliziert'},
            {l:'m d/dt ⟨x⟩ = ⟨p̂⟩', w:'Definition des Impulsoperators'}
          ]},
        q:{q:R`Welche Rechnung liefert $\langle p\rangle$?`,
          opts:[R`$-i\hbar\int\psi\,\psi^{*\prime}\,dx$`, R`$-i\hbar\int\psi^*\psi'\,dx$`, R`$-i\hbar\int\left(|\psi|^2\right)'dx$`], a:1,
          ex:R`$\hat p$ steht zwischen $\psi^*$ und $\psi$ und wirkt nach rechts, also auf $\psi$.`,
          fb:[R`Hier wirkt die Ableitung auf $\psi^*$. Das ergibt $-\langle p\rangle$: Der Operator muss auf $\psi$ rechts von ihm wirken.`,
            '',
            R`Das Integral einer Ableitung ist ein Randterm und damit immer null. Es misst keinen Impuls.`]}},
      {id:'wf-t6e', title:'Typischer Fehler: den Impuls aus der Dichte ablesen',
        num:{title:'Eine reelle Funktion im Kasten', text:R`Für $\psi_1 = \sqrt{2/L}\sin(\pi x/L)$ ist $\psi_1\psi_1' = \tfrac12(\psi_1^2)'$. Also

$$\langle p\rangle = -i\hbar\int_0^L\psi_1\psi_1'\,dx = -\frac{i\hbar}{2}\left[\psi_1^2\right]_0^L = 0,$$

weil $\psi_1$ an beiden Wänden null ist.`},
        text:R`Aus der Dichte $|\psi|^2$ allein kannst du den Impuls nicht ablesen. Das Paket aus Abschnitt 4 hat für jedes $k$ dieselbe Dichte, aber den mittleren Impuls $\hbar k$. Der Impuls steckt in der Phase.

Umgekehrt gilt: Ist $\psi$ reell, dann ist $\langle p\rangle = 0$, wie das Beispiel zeigt. Ein mittlerer Impuls braucht eine ortsabhängige Phase. $\langle p^2\rangle = \int\psi^*(-\hbar^2\partial_x^2)\psi\,dx$ ist dagegen auch für reelle $\psi$ nicht null.

Der Weg über $\langle p\rangle = m\,d\langle x\rangle/dt$ ist eine Plausibilitätsbegründung, kein Beweis. Er besteht aber zwei Proben: Eine Welle $e^{ikx}$ hat den scharfen Impuls $\hbar k$ (nächster Abschnitt), und es gilt das [[lex:ehrenfest|Ehrenfest-Theorem]] (Thema 6).`,
        q:{q:R`$\psi(x)$ ist reell und normierbar. Was folgt für $\langle p\rangle$?`,
          opts:[R`$\langle p\rangle$ ist rein imaginär.`, R`$\langle p\rangle = 0$`, R`$\langle p\rangle$ hängt von der Form von $\psi$ ab.`], a:1,
          ex:R`$\int\psi\psi'\,dx = \tfrac12[\psi^2]_{-\infty}^{\infty} = 0$. Ein Erwartungswert einer Messgröße ist immer reell.`,
          fb:[R`Ein Erwartungswert einer Messgröße ist reell. Hier ist das Integral sogar null.`,
            '',
            R`Für jedes reelle, normierbare $\psi$ ist das Integral der Randterm $\tfrac12[\psi^2]$ und damit null.`]}}
    ]},

    /* ===== Abschnitt 7: Unschärfe, de Broglie, Heisenberg ===== */
    {id:'wf-t7', title:'Unschärfe und de-Broglie-Wellenlänge', steps:[
      {id:'wf-t7a', title:'Die Unschärfe: wie stark Messwerte streuen',
        pre:{from:'m-stat', seg:'st-t4', title:'Varianz und Standardabweichung', text:R`Die Varianz ist die mittlere quadratische Abweichung vom Erwartungswert, $(\Delta x)^2 = \langle(x - \langle x\rangle)^2\rangle$. Bequemer ist $(\Delta x)^2 = \langle x^2\rangle - \langle x\rangle^2$. Mini-Beispiel Würfel: $\tfrac{91}{6} - 3{,}5^2 = \tfrac{35}{12}$, also $\Delta x \approx 1{,}71$.`},
        num:{title:'Grundzustand im Kasten', text:R`Mit den Werten aus Abschnitt 6 für $\psi_1$ und $L = 1\,\mathrm{nm}$ ist

$$\Delta x = \sqrt{\langle x^2\rangle - \langle x\rangle^2} = \sqrt{0{,}283 - 0{,}25}\,\mathrm{nm} \approx 0{,}18\,\mathrm{nm}.$$

Ortsmessungen streuen also typisch um $0{,}18\,\mathrm{nm}$ um die Mitte.`},
        text:R`Der Erwartungswert sagt, wo die Messwerte im Mittel liegen. Wie stark sie streuen, misst die [[lex:unschaerfe|Unschärfe]], die Standardabweichung (Wurzel der [[lex:stat-varianz|Varianz]]):

$$\Delta x = \sqrt{\langle(x - \langle x\rangle)^2\rangle} = \sqrt{\langle x^2\rangle - \langle x\rangle^2}.$$

Gelesen „Delta x“. Warum Quadrate? Die mittlere Abweichung $\langle x - \langle x\rangle\rangle$ ist immer null. Die mittlere Betragsabweichung rechnet sich schlecht. Quadrate kann man ausmultiplizieren; die Herleitung zeigt, wie daraus die zweite Form wird. Wegen $(\Delta x)^2 \ge 0$ gilt immer $\langle x^2\rangle \ge \langle x\rangle^2$. Für den Impuls gilt ebenso $\Delta p = \sqrt{\langle p^2\rangle - \langle p\rangle^2}$.`,
        derive:{ctx:{coords:['x'], params:{b:'real', m:'pos'}, defs:{'ψ(x)':'π^(-1/4) e^(-(x - b)^2/2)'}, normalized:true},
          lines:[
            {l:'(Δx)^2 = ∫_-∞^∞ (x - ⟨x⟩)^2 |ψ|^2 dx', w:'Definition: mittlere quadratische Abweichung'},
            {l:'= ∫_-∞^∞ x^2 |ψ|^2 dx - 2⟨x⟩ ∫_-∞^∞ x |ψ|^2 dx + ⟨x⟩^2 ∫_-∞^∞ |ψ|^2 dx', w:'ausmultipliziert; ⟨x⟩ ist eine Zahl', why:{q:'Warum darf man $\\langle x\\rangle$ vor das Integral ziehen?', opts:['Weil $\\langle x\\rangle$ eine feste Zahl ist.', 'Weil hier immer $\\langle x\\rangle = 0$ ist.', 'Weil $x$ und $\\langle x\\rangle$ dieselbe Einheit haben.'], a:0, ex:'Nach dem Integrieren hängt $\\langle x\\rangle$ nicht mehr von $x$ ab; es ist ein konstanter Faktor.'}},
            {l:'= ⟨x^2⟩ - 2⟨x⟩^2 + ⟨x⟩^2', w:'Normierung: ∫ |ψ|² dx = 1', why:{q:'Woher kommt der letzte Summand $\\langle x\\rangle^2$?', opts:['$\\langle x\\rangle^2\\int|\\psi|^2dx$ mit $\\int|\\psi|^2dx = 1$', 'Aus $\\langle x^2\\rangle = \\langle x\\rangle^2$', 'Aus der Symmetrie von $|\\psi|^2$'], a:0, ex:'Das dritte Integral ist die Normierung. Das zweite ist $\\langle x\\rangle$ selbst, daher $-2\\langle x\\rangle^2$.'}},
            {l:'= ⟨x^2⟩ - ⟨x⟩^2', w:'zusammengefasst'}
          ]},
        q:{q:R`Ein Zustand hat $\langle x\rangle = 1\,\mathrm{nm}$ und $\langle x^2\rangle = 1{,}09\,\mathrm{nm}^2$. Wie groß ist $\Delta x$?`,
          opts:[R`$0{,}09\,\mathrm{nm}$`, R`$0{,}3\,\mathrm{nm}$`, R`$\sqrt{1{,}09}\,\mathrm{nm} \approx 1{,}04\,\mathrm{nm}$`], a:1,
          ex:R`$(\Delta x)^2 = 1{,}09\,\mathrm{nm}^2 - 1\,\mathrm{nm}^2 = 0{,}09\,\mathrm{nm}^2$, also $\Delta x = 0{,}3\,\mathrm{nm}$.`,
          fb:[R`Das ist die Varianz $(\Delta x)^2$, noch dazu mit der falschen Einheit. Die Unschärfe ist ihre Wurzel.`,
            '',
            R`Das ist $\sqrt{\langle x^2\rangle}$; das $-\langle x\rangle^2$ fehlt.`]}},
      {id:'wf-t7b', title:'Typischer Fehler: Unschärfe als Messfehler',
        num:{title:'Ein perfekter Detektor', text:R`Ein Detektor bestimmt den Ort auf $0{,}001\,\mathrm{nm}$ genau. Du misst an vielen Teilchen, alle im Grundzustand des Kastens mit $L = 1\,\mathrm{nm}$. Die Einzelwerte streuen trotzdem mit $\Delta x \approx 0{,}18\,\mathrm{nm}$, also $180$-mal stärker, als der Detektor auflöst.`},
        text:R`$\Delta x$ ist **keine Messungenauigkeit**. Auch mit einem perfekten Messgerät streuen die Ergebnisse an gleich präparierten Systemen. Die Streuung gehört zum Zustand $\psi$, nicht zum Gerät. Mehr Messungen bestimmen $\Delta x$ genauer, verkleinern es aber nicht (M9).

$\Delta x = 0$ hieße, dass jede Messung denselben Wert liefert. Das schafft keine normierbare Wellenfunktion. Die Tafel zeigt die Unschärfe des Grundzustands in fünf Gestalten: in Worten, als Formel, als Strecke unter der Kurve, als hellen Streifen im Labor und als Streuung einer Messreihe.`,
        reps:{obj:'Die Unschärfe des Grundzustands im Kasten',
          rows:[
            {k:'worte', text:R`Wie weit liegen die Ortsmesswerte typisch vom Mittelwert entfernt?`},
            {k:'formel', tex:R`\Delta x = \sqrt{\langle x^2\rangle - \langle x\rangle^2} = L\sqrt{\frac{1}{12} - \frac{1}{2\pi^2}} \approx 0{,}18\,L`},
            {k:'graph', plot:{x:[0, 1], y:[0, 2.3], xlab:'x/L', ylab:R`|\psi|^2\cdot L`, ticks:[{x:0, lab:'0'}, {x:0.32, lab:'0{,}32'}, {x:0.5, lab:'0{,}5'}, {x:0.68, lab:'0{,}68'}, {x:1, lab:'1'}]}, f:x => 2 * Math.sin(Math.PI * x) ** 2, lab:R`|\psi_1|^2`, f2:x => (Math.abs(x - 0.5) <= 0.1808 ? 0.3 : NaN), lab2:R`\langle x\rangle \pm \Delta x`,
              cap:R`Die gestrichelte Strecke reicht von $\langle x\rangle - \Delta x \approx 0{,}32L$ bis $\langle x\rangle + \Delta x \approx 0{,}68L$.`},
            {k:'labor', text:R`Labor „Dichte, Intervall und Erwartungswert“ mit $\psi_1$: Die rote Linie steht bei $\langle x\rangle = 0{,}5L$, der helle Streifen reicht von etwa $0{,}32L$ bis $0{,}68L$. Die Anzeige nennt $\Delta x \approx 0{,}181L$.`},
            {k:'physik', text:R`Eine lange Messreihe hat eine empirische Standardabweichung nahe $0{,}18L$, auch mit einem perfekten Detektor. Etwa $65\,\%$ der Werte liegen im Streifen.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Den typischen Abstand als Wurzel der mittleren quadratischen Abweichung schreiben und mit $\langle x\rangle$ und $\langle x^2\rangle$ ausrechnen.`},
            {from:'formel', to:'graph', rule:R`Von $\langle x\rangle$ aus die Strecke $\Delta x$ nach links und nach rechts abtragen.`},
            {from:'graph', to:'labor', rule:R`Im Labor ist diese Strecke der helle Streifen um die rote Linie.`},
            {from:'labor', to:'physik', rule:R`Im Streifen liegen die meisten Werte einer langen Messreihe; ihre Streuung schätzt $\Delta x$.`}
          ]},
        q:{q:R`Im Labor reicht der helle Streifen für eine Wellenfunktion von $0{,}36L$ bis $0{,}64L$. Wie groß ist $\Delta x$?`, tr:{from:'labor', to:'formel'},
          opts:[R`$0{,}28L$`, R`$0{,}14L$`, R`$0{,}64L$`, R`$0{,}5L$`], a:1,
          ex:R`Der Streifen ist $\langle x\rangle \pm \Delta x$. Seine halbe Breite ist $\Delta x = 0{,}14L$.`,
          fb:[R`$0{,}28L$ ist die ganze Breite des Streifens, also $2\Delta x$.`,
            '',
            R`$0{,}64L$ ist der rechte Rand $\langle x\rangle + \Delta x$.`,
            R`$0{,}5L$ ist die Mitte des Streifens, also $\langle x\rangle$.`]}},
      {id:'wf-t7c', title:'Der Impuls einer Welle: de Broglie',
        num:{title:R`Ein Elektron mit $100\,\mathrm{eV}$`, text:R`Für ein Elektron mit $E = 100\,\mathrm{eV}$ ist

$$\lambda = \frac{h}{\sqrt{2m_eE}} \approx 0{,}12\,\mathrm{nm},$$

etwa der Abstand der Atome in einem Kristall. Deshalb beugen Kristalle Elektronen. Ein langsames Neutron mit $0{,}025\,\mathrm{eV}$ hat $\lambda \approx 0{,}18\,\mathrm{nm}$ und wird ebenfalls gebeugt.`},
        text:R`Wende $\hat p$ auf eine Welle mit fester Wellenlänge an, $e^{ikx}$ mit $k = 2\pi/\lambda$:

$$\hat p\,e^{ikx} = -i\hbar\,(ik)\,e^{ikx} = \hbar k\,e^{ikx}.$$

Der Operator gibt die Welle zurück, nur mit dem Faktor $\hbar k$. Die Welle hat also den scharfen Impuls

$$p = \hbar k = \frac{h}{\lambda}.$$

Das ist de Broglies Beziehung ([[lex:de-broglie|de-Broglie-Beziehung]]) aus Abschnitt 1. Kurze Wellenlänge heißt großer Impuls. Für ein freies Teilchen mit $E = p^2/2m$ ist $\lambda = h/\sqrt{2mE}$.`,
        q:{q:R`Ein Elektron hat bei $100\,\mathrm{eV}$ die Wellenlänge $0{,}12\,\mathrm{nm}$. Welche Wellenlänge hat es bei $400\,\mathrm{eV}$?`,
          opts:[R`$0{,}03\,\mathrm{nm}$`, R`$0{,}06\,\mathrm{nm}$`, R`$0{,}24\,\mathrm{nm}$`], a:1,
          ex:R`$p = \sqrt{2mE}$ verdoppelt sich bei vierfacher Energie, also halbiert sich $\lambda = h/p$.`,
          fb:[R`$\lambda$ fällt wie $1/\sqrt E$, nicht wie $1/E$. Vierfache Energie heißt doppelter Impuls.`,
            '',
            R`Mehr Energie heißt mehr Impuls und damit eine kürzere Wellenlänge.`]}},
      {id:'wf-t7d', title:'Wellenpakete: schmal im Ort, breit im Impuls',
        pre:{from:'m-fourier', seg:'mf-t6', title:'Breiten im Ort und in $k$', text:R`Eine Funktion und ihre Fourier-Transformierte verhalten sich gegenläufig. Für jedes normierte $\psi$ gilt $\Delta x\,\Delta k \ge \tfrac12$, mit Gleichheit beim Gauß-Paket. Mini-Beispiel: $\Delta x = 0{,}5$ erzwingt $\Delta k \ge 1$.`},
        num:{title:'Ein Gauß-Paket im Labor', text:R`Im Labor ist $\hbar = m = 1$. Mit der Anfangsbreite $\sigma_0 = 0{,}5$ ist $\Delta x = 0{,}5$, und die Anzeige nennt $\Delta p = \hbar/(2\sigma_0) = 1$. Das Produkt ist

$$\Delta x\,\Delta p = 0{,}5\cdot1 = \tfrac12 = \frac{\hbar}{2}.$$

Mit $\sigma_0 = 0{,}25$ wäre $\Delta p = 2$: halbe Breite, doppelte Impulsunschärfe.`},
        text:R`$e^{ikx}$ hat $\Delta p = 0$, ist aber über die ganze Achse verteilt. Ein lokalisiertes [[lex:wellenpaket|Wellenpaket]] entsteht erst aus vielen überlagerten Wellenlängen, und dann streut der Impuls. Je schmaler das Paket, desto breiter die Verteilung der Wellenzahlen (M6). Mit $p = \hbar k$ wird daraus

$$\Delta x\,\Delta p \ge \frac{\hbar}{2},$$

bewiesen in Thema 6. Im Bild ist die dicke Kurve $|\psi|^2$; ihre Breite ist $\Delta x$. Die dünne Kurve ist $\operatorname{Re}\psi$; ihre Wellenlänge gehört zu $\hbar k_0$. Der Regler $\sigma_0$ ist die Anfangsbreite, die Anzeige nennt $\Delta p$. Mach $\sigma_0$ kleiner: Das Paket wird schmaler und zerfließt schneller.`,
        fig:{lab:'packet', caption:R`Gauß-Paket: $|\psi|^2$ (dick) und $\mathrm{Re}\,\psi$ (dünn). Ein schmaleres Paket (kleines $\sigma_0$) hat ein größeres $\Delta p$ und zerfließt schneller.`},
        q:{q:R`Ein Teilchen wird doppelt so eng eingesperrt; $\Delta x$ halbiert sich. Was folgt aus $\Delta x\,\Delta p \ge \hbar/2$?`,
          opts:[R`Die untere Schranke für $\Delta p$ halbiert sich.`, R`$\Delta p$ bleibt gleich, nur die Messung wird genauer.`, R`Die untere Schranke für $\Delta p$ verdoppelt sich.`], a:2,
          ex:R`$\Delta p \ge \hbar/(2\Delta x)$. Halbes $\Delta x$ heißt doppelte Schranke. Was das für die Energie eines eingesperrten Teilchens bedeutet, zeigt der nächste Schritt.`,
          fb:[R`$\Delta x$ steht im Nenner der Schranke $\hbar/(2\Delta x)$. Kleineres $\Delta x$ heißt größere Schranke.`,
            R`$\Delta p$ gehört zum Zustand, nicht zum Gerät. Ein engerer Zustand hat eine breitere Impulsverteilung.`,
            '']}},
      {id:'wf-t7e', title:'Einsperren kostet Energie',
        num:{title:R`Ein Elektron in $1\,\mathrm{nm}$`, text:R`Ein Elektron ist in einem Kasten der Breite $L = 1\,\mathrm{nm}$. Dann ist $\Delta x < L/2 = 0{,}5\,\mathrm{nm}$ und

$$\Delta p > \frac{\hbar}{2\Delta x} > \frac{\hbar}{L} \approx 1{,}05\cdot10^{-25}\,\mathrm{kg\,m/s}.$$

Die mittlere kinetische Energie ist mindestens $(\Delta p)^2/2m_e$, also mehr als $0{,}038\,\mathrm{eV}$. Die exakte Rechnung in Thema 3 ergibt $0{,}38\,\mathrm{eV}$.`},
        text:R`Die Unschärferelation hat eine direkte Folge. Wer ein Teilchen auf eine Strecke $L$ einsperrt, erzwingt $\Delta x < L/2$; mehr Streuung ist auf einer Strecke $L$ nicht möglich. Dann ist $\Delta p > \hbar/L$, und wegen $\langle p^2\rangle \ge (\Delta p)^2$ ist die mittlere kinetische Energie größer als null. Ein eingesperrtes Teilchen kann nicht ruhen. Das ist die Nullpunktsenergie in Thema 3.

Die Tafel übersetzt die Aussage zwischen Mathematik und Physik. Die Schranke ist grob, aber sie zeigt die Richtung: Je enger der Einschluss, desto größer die Energie. Deshalb leuchten kleinere Quantenpunkte, Nanokristalle aus Halbleitern, blauer (Thema 3).`,
        reps:{obj:'Einschluss und Impulsunschärfe',
          rows:[
            {k:'worte', text:R`Je enger der Ort festgelegt ist, desto weniger ist der Impuls festgelegt.`},
            {k:'mathe', text:R`Für jedes normierte $\psi$ gilt $\Delta x\,\Delta k \ge \tfrac12$ (M6), mit Gleichheit beim Gauß-Paket.`},
            {k:'formel', tex:R`p = \hbar k\quad\Longrightarrow\quad \Delta x\,\Delta p \ge \frac{\hbar}{2}`},
            {k:'physik', text:R`Eingesperrt auf die Breite $L$: $\Delta p > \hbar/L$ und kinetische Energie größer als $\hbar^2/(2mL^2)$. Halbe Breite, vierfache Schranke.`}
          ],
          links:[
            {from:'worte', to:'mathe', rule:R`Die Breiten als Standardabweichungen messen: $\Delta x$ aus $|\psi(x)|^2$, $\Delta k$ aus $|\varphi(k)|^2$, dem Betragsquadrat der Fourier-Transformierten $\varphi(k)$ (M6).`},
            {from:'mathe', to:'formel', rule:R`Jede Wellenzahl mit $\hbar$ multiplizieren: $\Delta p = \hbar\,\Delta k$.`},
            {from:'formel', to:'physik', rule:R`Für $\Delta x$ die größte mögliche Streuung $L/2$ einsetzen und $\Delta p$ in die kinetische Energie $p^2/2m$ stecken.`}
          ]},
        q:{q:R`Ein Elektron ist auf $\Delta x = 0{,}1\,\mathrm{nm}$ lokalisiert. Wie groß ist $\Delta p$ mindestens?`, tr:{from:'mathe', to:'physik'},
          opts:[R`$2{,}6\cdot10^{-25}\,\mathrm{kg\,m/s}$`, R`$5{,}3\cdot10^{-25}\,\mathrm{kg\,m/s}$`, R`$1{,}1\cdot10^{-24}\,\mathrm{kg\,m/s}$`, R`$6{,}6\cdot10^{-24}\,\mathrm{kg\,m/s}$`], a:1,
          ex:R`$\Delta p \ge \hbar/(2\Delta x) = 1{,}05\cdot10^{-34}\,\mathrm{J\,s}/(2\cdot10^{-10}\,\mathrm{m}) \approx 5{,}3\cdot10^{-25}\,\mathrm{kg\,m/s}$.`,
          fb:[R`Das ist $\hbar/(4\Delta x)$, die Hälfte der Schranke.`,
            '',
            R`Das ist $\hbar/\Delta x$, ohne den Faktor $\tfrac12$.`,
            R`Das ist $h/\Delta x$. In der Schranke steht $\hbar = h/2\pi$, dazu der Faktor $\tfrac12$.`]}}
    ]}
  ],
  example:{
    title:'Normierung einer Exponentialfunktion',
    text:'Ein Teilchen auf der ganzen $x$-Achse hat die Wellenfunktion $\\psi(x) = A\\,e^{-|x|/a}$ mit $a > 0$. Bestimme $A > 0$ so, dass $\\psi$ normiert ist.',
    ctx:CTX.line({params:{a:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(-|x|/a)'}, unknowns:{A:{ref:'1/sqrt(a)'}}}),
    lines:[
      {l:'∫_-∞^∞ |ψ|^2 dx = 1', why:{q:'Warum beginnt man so?', opts:['Das Teilchen ist mit Sicherheit irgendwo auf der Achse.', 'Der Mittelwert $\\langle x\\rangle$ muss 1 sein.', 'Die Wellenfunktion muss bei $x = 0$ den Wert 1 haben.'], a:0, ex:'Die Gesamtwahrscheinlichkeit ist 1: $\\int|\\psi|^2dx = 1$.'}},
      {l:'|A|^2 ∫_-∞^∞ e^(-2|x|/a) dx = 1', why:{q:'Woher kommt die 2 im Exponenten?', opts:['$|e^{-|x|/a}|^2 = e^{-2|x|/a}$', 'Aus der Kettenregel beim Ableiten', 'Aus $|A|^2 = 2A$'], a:0, ex:'Quadrieren verdoppelt den Exponenten: $(e^{u})^2 = e^{2u}$.'}},
      {l:'2|A|^2 ∫_0^∞ e^(-2x/a) dx = 1', why:{q:'Warum darf man nur über $x > 0$ integrieren und mal 2 nehmen?', opts:['Der Integrand ist gerade: $f(-x) = f(x)$.', 'Weil $\\psi$ für $x < 0$ null ist.', 'Weil Integrale immer positiv sind.'], a:0, ex:'Für gerade Integranden gilt $\\int_{-\\infty}^\\infty = 2\\int_0^\\infty$.'}},
      {l:'2|A|^2 · a/2 = 1', why:{q:'Welche Regel steckt hier?', opts:['$\\int_0^\\infty e^{-kx}dx = 1/k$ mit $k = 2/a$', '$\\int_0^\\infty e^{-kx}dx = k$ mit $k = 2/a$', '$\\int_0^\\infty e^{-kx}dx = 1/k$ mit $k = a/2$'], a:0, ex:'$\\int_0^\\infty e^{-kx}\\,dx = [-e^{-kx}/k]_0^\\infty = 1/k$, und hier ist $k = 2/a$.'}},
      {l:'A = 1/sqrt(a)', w:'Phase frei: wähle A reell, positiv', why:{q:'Warum darf man $A > 0$ wählen?', opts:['Ein globaler Phasenfaktor $e^{i\\alpha}$ ändert keine Messgröße.', 'Weil $|A|^2 = 1/a$ nur eine Lösung hat.', 'Weil negative Wahrscheinlichkeiten verboten sind.'], a:0, ex:'$\\psi$ und $e^{i\\alpha}\\psi$ beschreiben denselben Zustand. Deshalb legt die Normierung nur $|A|$ fest.'}}
    ],
    faded:{id:'wf-fade', title:'Jetzt du: $\\psi(x) = A\\,x\\,e^{-x/a}$ für $x > 0$', text:'Für $x < 0$ ist $\\psi = 0$. Bestimme $A > 0$. Nützlich: $\\int_0^\\infty x^n e^{-kx}\\,dx = n!/k^{n+1}$.',
      ctx:CTX.line({params:{a:'pos', m:'pos'}, domain:{x:['0', '∞']}, defs:{'ψ(x)':'A x e^(-x/a)'}, unknowns:{A:{ref:'2/a^(3/2)'}}}),
      given:['∫_0^∞ |ψ|^2 dx = 1', '|A|^2 ∫_0^∞ x^2 e^(-2x/a) dx = 1'],
      goals:[{id:'a', prompt:'Bestimme $A$.', type:'solve', unknown:'A', hints:['Das Integral hat die Form $\\int_0^\\infty x^ne^{-kx}dx$. Welche Werte haben $n$ und $k$?', '$n = 2$ und $k = 2/a$, also $2!/(2/a)^3$.', '$2!/(2/a)^3 = a^3/4$; löse $|A|^2a^3/4 = 1$ nach $A$ auf.'],
        model:['∫_0^∞ |ψ|^2 dx = 1', '|A|^2 ∫_0^∞ x^2 e^(-2x/a) dx = 1', {l:'|A|^2 · 2!/(2/a)^3 = 1', gap:'|A|^2 · ▢ = 1'}, '|A|^2 a^3/4 = 1', 'A = 2/a^(3/2)']}]}
  },
  puzzle:{
    title:'Normiert, aber unendlich unscharf?',
    text:'Auf der ganzen Achse ist $\\psi(x) = \\sqrt{a/\\pi}\\,\\big/\\sqrt{x^2 + a^2}$ mit $a > 0$. Prüfe, ob $\\psi$ normiert ist, und bestimme $\\Delta x$. Nützlich: $\\int_{-\\infty}^{\\infty}\\frac{dx}{x^2 + a^2} = \\frac{\\pi}{a}$.',
    q:{q:'Was gilt für dieses $\\psi$?', opts:['normiert, aber $\\Delta x = \\infty$', 'normiert, mit $\\Delta x \\approx a$, wie man am Bild abliest', 'nicht normierbar, weil $\\psi$ nur wie $1/|x|$ abfällt', 'normiert, mit $\\Delta x = 0$, weil $\\langle x\\rangle = 0$ ist'], a:0, ex:'$\\int|\\psi|^2dx = \\frac a\\pi\\cdot\\frac\\pi a = 1$, aber $\\int x^2|\\psi|^2dx$ divergiert.'},
    reveal:'**Normierung.** $\\int|\\psi|^2dx = \\frac{a}{\\pi}\\int\\frac{dx}{x^2 + a^2} = 1$. Dass $\\psi$ selbst nur wie $1/|x|$ abfällt, schadet nicht: Entscheidend ist $|\\psi|^2 \\sim 1/x^2$, und das ist integrierbar.\n\n**Unschärfe.** Die Dichte ist symmetrisch um $x = 0$. (Streng genommen existiert $\\langle x\\rangle$ hier nur als symmetrischer Grenzwert, weil $x|\\psi|^2$ wie $1/x$ abfällt.) Für $\\langle x^2\\rangle$ ist der Integrand $x^2|\\psi|^2 = \\frac{a}{\\pi}\\frac{x^2}{x^2 + a^2} \\to \\frac a\\pi$ für $|x| \\to \\infty$. Er geht nicht gegen null, das Integral divergiert, und $\\Delta x = \\infty$. Dabei liegt die Hälfte der Wahrscheinlichkeit im Bereich $|x| < a$.\n\n**Lehre.** $\\Delta x$ reagiert stark auf weit entfernte Ausläufer. Für Dichten mit solchen „schweren Ausläufern“ beschreibt die Standardabweichung die Breite schlecht; die Halbwertsbreite (hier $2a$) passt besser zum Bild. Solche Dichten kommen in der Physik vor, etwa als Lorentz-Profil einer Spektrallinie. Die Unschärferelation $\\Delta x\\,\\Delta p \\ge \\hbar/2$ ist hier trivial erfüllt.'
  },
  clarify:{
    core:'Der Zustand eines Teilchens steckt in der komplexen Wellenfunktion $\\psi(x,t)$. Nach Born ist $|\\psi(x,t)|^2 = \\psi^*\\psi$ die **Wahrscheinlichkeitsdichte** für den Ort:\n\n$$P(a<x<b) = \\int_a^b |\\psi(x,t)|^2\\,dx,\\qquad \\int_{-\\infty}^{\\infty}|\\psi|^2\\,dx = 1.$$\n\nDie Normierung bleibt erhalten, weil die Schrödingergleichung ein $i$ enthält und $V$ reell ist. Erwartungswerte sind Mittelwerte über viele gleich präparierte Systeme: $\\langle x\\rangle = \\int x|\\psi|^2dx$, $\\langle p\\rangle = \\int\\psi^*(-i\\hbar\\,\\partial_x)\\psi\\,dx$. Die Unschärfe ist $\\Delta x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$, und es gilt $\\Delta x\\,\\Delta p \\ge \\hbar/2$. Eine Welle $e^{ikx}$ hat den Impuls $p = \\hbar k = h/\\lambda$.',
    keys:[
      'Immer $|\\psi|^2 = \\psi^*\\psi$ verwenden, nie $\\psi^2$ – bei komplexem $\\psi$ ist das ein Unterschied.',
      'Normierung legt nur $|A|$ fest; die globale Phase ist frei. Üblich: $A$ reell und positiv.',
      'In einer Dimension hat $\\psi$ die Einheit $1/\\sqrt{\\text{Länge}}$. Eine Einheitenkontrolle findet viele Fehler.',
      'Symmetrie spart Arbeit: Ist $|\\psi|^2$ symmetrisch um $x_0$, dann ist $\\langle x\\rangle = x_0$.',
      '$\\langle x\\rangle$ ist ein Mittelwert über viele Messungen, nicht der Ausgang einer einzelnen Messung und nicht unbedingt der wahrscheinlichste Ort.',
      'Nach einer Ortsmessung mit Ergebnis $x_0$ ist $\\psi$ scharf um $x_0$ konzentriert (Kollaps); danach läuft es wieder auseinander.'
    ],
    errors:[
      '$\\int \\psi^2 dx = 1$ statt $\\int|\\psi|^2dx = 1$. Bei $\\psi \\propto (x + ia)\\,e^{-x^2/(2a^2)}$ wird $\\int\\psi^2dx$ sogar negativ, bei $\\psi \\propto e^{ikx}e^{-x^2}$ hängt es fälschlich von $k$ ab.',
      '$\\langle x^2\\rangle$ mit $\\langle x\\rangle^2$ verwechseln. Ihre Differenz ist gerade $(\\Delta x)^2 \\ge 0$.',
      'Grenzen vergessen: Außerhalb des Kastens ist $\\psi = 0$, dort wird nicht integriert.',
      'Das Ergebnis „$P = 1{,}2$“ nicht bemerken: Wahrscheinlichkeiten liegen zwischen 0 und 1.',
      '$\\Delta x$ als Messungenauigkeit oder $\\psi$ als Ladungswolke deuten.'
    ],
    more:[{title:'Warum bleibt die Normierung zeitlich erhalten?', text:'Aus der Schrödingergleichung folgt $\\frac{d}{dt}\\int|\\psi|^2dx = 0$, wenn $V$ reell ist und $\\psi$ im Unendlichen schnell genug abfällt (Abschnitt „Die Normierung bleibt erhalten“; Thema 2: Kontinuitätsgleichung). Man muss also nur einmal normieren.'}],
    checks:[
      {q:'$\\psi(x) = A\\,e^{ikx}e^{-x^2/2}$. Was ergibt $|\\psi|^2$?', opts:['$|A|^2e^{-x^2}$', '$A^2e^{2ikx}e^{-x^2}$', '$|A|^2e^{-x^2/2}$'], a:0, ex:'$|e^{ikx}|^2 = 1$, und $(e^{-x^2/2})^2 = e^{-x^2}$.'},
      {q:'Ein Zustand hat $\\langle x\\rangle = 0$ und $\\langle x^2\\rangle = 4\\,\\mathrm{nm}^2$. Wie groß ist $\\Delta x$?', opts:['$2\\,\\mathrm{nm}$', '$4\\,\\mathrm{nm}$', '$16\\,\\mathrm{nm}$'], a:0, ex:'$\\Delta x = \\sqrt{4 - 0}\\,\\mathrm{nm} = 2\\,\\mathrm{nm}$.'}
    ]
  },
  lab:{type:'prob', sketch:SK.lab, title:'Dichte, Intervall und Erwartungswert',
    text:'Wähle eine Wellenfunktion im Kasten ($L = 1$). Die Fläche unter $|\\psi|^2$ zwischen den Grenzen ist die Wahrscheinlichkeit. Die rote Linie ist $\\langle x\\rangle$, der helle Streifen $\\langle x\\rangle \\pm \\Delta x$.',
    map:[
      {sym:R`\psi(x)`, ctl:'Wellenfunktion', says:R`Auswahl der Wellenfunktion im Kasten $0 < x < L$, schon normiert. Sie ist gestrichelt gezeichnet („gestrichelt: ψ selbst“) und darf negativ sein.`},
      {sym:R`|\psi(x)|^2`, ctl:'|ψ|² · L', says:R`Die dicke Kurve ist die Dichte $|\psi|^2$, mal $L$ genommen, damit die Achse ohne Einheit auskommt. Für $\psi_1$ ist ihr Maximum $2$, also $|\psi_1(L/2)|^2 = 2/L$.`},
      {sym:R`x/L`, ctl:'x / L', says:R`Der Ort in Einheiten der Kastenbreite; $0$ und $1$ sind die Wände.`},
      {sym:'a', ctl:'untere Grenze a/L', says:R`Untere Grenze des Integrals $\int_a^b|\psi|^2dx$. Schiebst du sie nach links, wächst die getönte Fläche.`},
      {sym:'b', ctl:'obere Grenze b/L', says:R`Obere Grenze des Integrals. Mit $a = 0$ und $b = 1$ ist die Fläche $1$: die Normierung.`},
      {sym:R`P(a < x < b) = \int_a^b|\psi|^2\,dx`, ctl:'Wahrscheinlichkeit im Intervall', says:R`Die getönte Fläche zwischen den Grenzen. Die Anzeige nennt ihren Wert, für $\psi_1$ und das Intervall $[0;\ 0{,}25L]$ etwa $0{,}091$.`},
      {sym:R`\langle x\rangle,\ \Delta x`, ctl:'⟨x⟩', says:R`Rote Linie: $\langle x\rangle = \int x\,|\psi|^2dx$. Heller Streifen: $\langle x\rangle \pm \Delta x$. Beide hängen nur von der Wellenfunktion ab, nicht von den Grenzen.`}
    ],
    predict:{q:'Vorhersage: Im Grundzustand $\\psi_1$ ist die Wahrscheinlichkeit, das Teilchen im linken Viertel $0 < x < L/4$ zu finden, …', opts:['kleiner als $1/4$', 'genau $1/4$', 'größer als $1/4$'], a:0, ex:'Die Dichte $|\\psi_1|^2 \\propto \\sin^2(\\pi x/L)$ ist an der Wand null und in der Mitte am größten. Das linke Viertel bekommt deshalb weniger als ein Viertel.'},
    questions:[
      {q:'Stelle „(ψ₁ + ψ₂)/√2“ ein. Wo liegt $\\langle x\\rangle$?', opts:['links der Mitte, bei etwa $0{,}32L$', 'genau in der Mitte bei $L/2$', 'rechts der Mitte, bei etwa $0{,}68L$'], a:0, ex:'Der Mischterm $2\\psi_1\\psi_2$ ist links positiv und rechts negativ. Die Dichte kippt nach links: $\\langle x\\rangle = L/2 - 16L/(9\\pi^2) \\approx 0{,}32L$.'},
      {q:'Grundzustand ψ₁: Stelle die Grenzen auf $0$ und $0{,}25$. Wie groß ist die Wahrscheinlichkeit?', opts:['etwa $0{,}09$', 'genau $0{,}25$', 'etwa $0{,}18$'], a:0, ex:'$\\int_0^{L/4}\\tfrac2L\\sin^2(\\pi x/L)dx = \\tfrac14 - \\tfrac{1}{2\\pi} \\approx 0{,}091$ – weniger als ein Viertel, weil die Dichte am Rand klein ist.'},
      {q:'Vergleiche alle vier Wellenfunktionen. Welche hat die kleinste Unschärfe $\\Delta x$?', opts:['(ψ₁ + ψ₂)/√2', 'Dreieck', 'ψ₁', 'Parabel'], a:0, ex:'Abgelesen: $(\\psi_1+\\psi_2)/\\sqrt2$ etwa $0{,}14L$, Dreieck $0{,}16L$, $\\psi_1$ $0{,}18L$, Parabel $0{,}19L$. Die Überlagerung ist auf die linke Hälfte konzentriert und deshalb schmaler – obwohl sie aus zwei „breiten“ Zuständen besteht.'}
    ],
    noPic:{q:'Ohne Bild: $\\psi(x) = A\\,x(L-x)$ im Kasten. Wie groß ist $P(0 < x < L/2)$?', opts:['$1/2$', '$1/4$', 'ohne Integral nicht zu sagen'], a:0, ex:'$|\\psi|^2$ ist symmetrisch um $L/2$, also liegt genau die Hälfte der Wahrscheinlichkeit links.'}},
  compare:{
    text:'Gesucht ist $\\langle x\\rangle$ für $\\psi(x) = A\\,x(L-x)$ mit $A = \\sqrt{30/L^5}$. Zwei richtige Wege:',
    ctx:CTX.box({defs:{'ψ(x)':'sqrt(30/L^5) x (L - x)'}, normalized:true}),
    A:{name:'Ausrechnen', model:['⟨x⟩ = ∫_0^L x |ψ|^2 dx', '= 30/L^5 ∫_0^L x^3 (L - x)^2 dx', '= 30/L^5 · L^6/60', '= L/2']},
    B:{name:'Symmetrie', text:'Mit $u = L - x$ gilt $|\\psi(L - u)|^2 = |\\psi(u)|^2$: Die Dichte ist spiegelsymmetrisch um $L/2$.', model:['⟨x - L/2⟩ = ∫_0^L (x - L/2) |ψ|^2 dx', '= 0', {l:'⟨x⟩ = L/2', w:'ungerader Integrand um L/2'}]},
    questions:[
      {q:'Wann darf man Weg B benutzen?', opts:['wenn $|\\psi|^2$ symmetrisch um einen Punkt $x_0$ ist', 'wenn $\\psi$ selbst reell und positiv ist', 'immer, denn $\\langle x\\rangle$ liegt in der Mitte'], a:0, ex:'Entscheidend ist die Symmetrie der Dichte, nicht die von $\\psi$ selbst. Für $\\psi_1 + \\psi_2$ im Kasten klappt es zum Beispiel nicht.'},
      {q:'Bei $\\langle x^2\\rangle$ hilft die Symmetrie …', opts:['nicht direkt: man muss integrieren', 'genauso: $\\langle x^2\\rangle = L^2/4$', 'ebenso: $\\langle (x - L/2)^2\\rangle = 0$ wegen der Symmetrie'], a:0, ex:'$\\langle x^2\\rangle \\ne \\langle x\\rangle^2$. Und $(x - L/2)^2$ ist um $L/2$ gerade, nicht ungerade; sein Mittelwert ist $(\\Delta x)^2 > 0$. Hier ist $\\langle x^2\\rangle = 2L^2/7$, größer als $L^2/4$.'}
    ]
  },
  concept:[
    {id:'wf-k1', type:'dialog', seg:'wf-t3', text:'Beim Doppelspalt-Versuch mit einzelnen Elektronen entsteht nach vielen Elektronen ein Interferenzmuster.',
      people:[{name:'Lena', says:'Jedes Elektron teilt sich auf: Ein Teil seiner Ladung geht durch jeden Spalt, und die beiden Teile überlagern sich dahinter.'}, {name:'Jonas', says:'Nachgewiesen wird jedes Elektron ganz an einem Punkt. Durch beide Spalte läuft die Wellenfunktion, und sie bestimmt die Wahrscheinlichkeit für den Auftreffort.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Stellt man an beide Spalte Detektoren, spricht für jedes Elektron immer genau einer an, mit der vollen Ladung $e$ – nie beide mit $e/2$. $\\psi$ ist keine Ladungswolke, sondern bestimmt Wahrscheinlichkeiten für Messergebnisse. Die Vorstellung von $\\psi$ als Materie- oder Ladungswelle ist eine verbreitete Fehlvorstellung.'},
    {id:'wf-k2', type:'mc2', seg:'wf-t6', q:'Für $\\psi_1$ im Kasten ist $\\langle x\\rangle = L/2$. Was liefert eine einzelne Ortsmessung?', opts:['einen nicht vorhersagbaren Wert zwischen $0$ und $L$', 'genau $L/2$, bis auf die Messgenauigkeit', 'sicher einen Wert im Bereich $L/2 \\pm \\Delta x$'], a:0, ex:'Jeder Wert mit $|\\psi_1|^2 > 0$ ist möglich, also jeder Ort im Inneren.',
      reason:{q:'Warum?', opts:['$\\langle x\\rangle$ ist der Mittelwert vieler Messungen an gleich präparierten Systemen.', 'Das Teilchen pendelt hin und her und ist im Mittel bei $L/2$.', 'Nur der Bereich $\\langle x\\rangle \\pm \\Delta x$ hat eine Wahrscheinlichkeit größer als null.'], a:0, ex:'Ein Erwartungswert beschreibt ein Ensemble, keinen Einzelwert. Auch außerhalb von $\\langle x\\rangle \\pm \\Delta x$ findet man das Teilchen, nur seltener. Das Bild eines pendelnden Teilchens mit bestimmter Bahn gibt es in der Quantenmechanik nicht.'}},
    {id:'wf-k3', type:'mc', seg:'wf-t4', q:'$|\\psi_1(L/2)|^2 = 2/L$ ist für $L = 0{,}5\\,\\mathrm{nm}$ gleich $4\\cdot10^9\\,\\mathrm{m}^{-1}$. Was bedeutet diese Zahl?', opts:['eine Dichte: mal einer kleinen Intervallbreite ergibt sie eine Wahrscheinlichkeit', 'eine Wahrscheinlichkeit, die hier ausnahmsweise größer als 1 sein darf', 'einen Rechenfehler, weil $|\\psi|^2$ höchstens den Wert 1 haben darf'], a:0, ex:'$|\\psi|^2$ hat die Einheit 1/Länge. Für $\\Delta x = 0{,}01\\,\\mathrm{nm}$ um $L/2$ ist $P \\approx 4\\cdot10^9\\,\\mathrm{m}^{-1}\\cdot 10^{-11}\\,\\mathrm{m} = 0{,}04$.'},
    {id:'wf-k4', type:'mc2', seg:'wf-t3', q:'Eine Ortsmessung ergibt $x_0$. Man wartet eine Weile und misst noch einmal. Was gilt für das zweite Ergebnis?', opts:['Es kann deutlich von $x_0$ abweichen.', 'Es ist sicher wieder genau $x_0$.', 'Es ist sicher wieder nach der alten Dichte $|\\psi|^2$ verteilt.'], a:0, ex:'Nur eine **sofort** folgende Messung ergibt wieder $x_0$.',
      reason:{q:'Warum?', opts:['Nach dem Kollaps entwickelt sich $\\psi$ wieder nach der Schrödingergleichung.', 'Ein kollabierter Zustand bleibt für immer unverändert scharf um den Ort $x_0$.', 'Nach der Messung kehrt das System mit der Zeit in seinen alten Zustand zurück.'], a:0, ex:'Der scharfe Gipfel bei $x_0$ bleibt nicht scharf; er zerfließt. In den alten Zustand kehrt das System aber nicht zurück. Die Erwartung, dass es das doch tut, ist in Studien dokumentiert (Singh & Marshman 2015).'}},
    {id:'wf-k5', type:'dialog', seg:'wf-t6', text:'Für $\\psi(x) = A\\,x\\,e^{-x/a}$ ($x > 0$) hat $|\\psi|^2$ sein Maximum bei $x = a$.',
      people:[{name:'Lena', says:'Dann ist $\\langle x\\rangle = a$, denn der Erwartungswert ist der Ort, an dem man das Teilchen am häufigsten findet.'}, {name:'Jonas', says:'Die Dichte fällt nach rechts langsamer ab als nach links. Deshalb liegt $\\langle x\\rangle$ rechts vom Maximum.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Mit $|A|^2 = 4/a^3$ ist $\\langle x\\rangle = \\frac{4}{a^3}\\int_0^\\infty x^3e^{-2x/a}dx = \\frac{4}{a^3}\\cdot\\frac{3!}{(2/a)^4} = \\frac{3a}{2}$. Der wahrscheinlichste Ort und der Mittelwert fallen im Allgemeinen nicht zusammen. Nur bei einer symmetrischen Dichte mit *einem* Gipfel liegen beide sicher in der Mitte.'},
    {id:'wf-k6', type:'mc2', seg:'wf-t7', q:'Ein Zustand hat $\\Delta x = 0{,}3\\,\\mathrm{nm}$. Was bedeutet das?', opts:['Ortsmessungen an gleich präparierten Systemen streuen um etwa $0{,}3\\,\\mathrm{nm}$.', 'Das Messgerät bestimmt den Ort des Teilchens nur auf $0{,}3\\,\\mathrm{nm}$ genau.', 'Das Teilchen ist ein Kügelchen mit etwa $0{,}3\\,\\mathrm{nm}$ Durchmesser.'], a:0, ex:'$\\Delta x$ ist die Standardabweichung der Messwerte im Zustand $\\psi$.',
      reason:{q:'Warum?', opts:['Die Streuung steckt im Zustand $\\psi$ und bleibt auch mit einem perfekten Messgerät.', 'Jede Messung stößt das Teilchen genau um die Strecke $\\Delta x$ weg.', 'Kleine Teilchen sind grundsätzlich verschwommen wie ein unscharfes Foto.'], a:0, ex:'Unschärfe ist keine Eigenschaft des Messgeräts. Ein perfektes Gerät misst jeden Einzelwert scharf – nur sind die Einzelwerte verschieden.'}}
  ],
  practice:[
    {id:'wf-p1', title:'Parabel im Kasten',
      text:'Im Kasten $0 < x < L$ ist $\\psi(x) = A\\,x(L-x)$, außerhalb $\\psi = 0$.',
      ctx:CTX.box({defs:{'ψ(x)':'A x (L - x)'}, unknowns:{A:{ref:'sqrt(30/L^5)', alt:['-sqrt(30/L^5)']}}}),
      goals:[
        {id:'a', prompt:'a) Normiere: Bestimme $A > 0$.', type:'solve', unknown:'A', points:3, ph:'∫_0^L |ψ|^2 dx = 1',
          hints:['Gesucht ist $|A|$. Setze die Normierungsbedingung an; außerhalb des Kastens ist $\\psi = 0$.', 'Ziehe $|A|^2$ vor das Integral und multipliziere $x^2(L-x)^2 = L^2x^2 - 2Lx^3 + x^4$ aus.', 'Gliedweise integriert: $L^5/3 - L^5/2 + L^5/5$. Fasse zusammen und löse nach $A$ auf.'],
          model:[{l:'∫_0^L |ψ|^2 dx = 1', w:'Normierung'}, '|A|^2 ∫_0^L x^2 (L - x)^2 dx = 1', {l:'|A|^2 ∫_0^L (L^2 x^2 - 2L x^3 + x^4) dx = 1', w:'ausmultiplizieren'}, {l:'|A|^2 (L^5/3 - L^5/2 + L^5/5) = 1', gap:'|A|^2 (▢) = 1'}, '|A|^2 L^5/30 = 1', 'A = sqrt(30/L^5)'],
          mistakes:[{expr:'sqrt(30/L^4)', msg:'Prüfe die Potenz von $L$: $\\psi$ muss die Einheit $1/\\sqrt{\\text{Länge}}$ haben, also $A$ die Einheit $L^{-5/2}$.'}]},
        {id:'b', prompt:'b) Berechne $\\langle x\\rangle$.', type:'value', target:'L/2', points:2, ph:'⟨x⟩ = ∫_0^L x |ψ|^2 dx',
          hints:['Gesucht ist ein Mittelwert über die Dichte $|\\psi|^2$. Prüfe zuerst, ob eine Symmetrie hilft.', '$\\langle x\\rangle = \\int_0^L x\\,|\\psi|^2\\,dx$ mit $|A|^2 = 30/L^5$. Ist $|\\psi|^2$ symmetrisch um $x_0$, dann ist $\\langle x\\rangle = x_0$.', 'Ausgerechnet: $\\int_0^L x^3(L-x)^2dx = L^6/60$.'],
          model:['⟨x⟩ = ∫_0^L x |ψ|^2 dx', '= 30/L^5 ∫_0^L x^3 (L - x)^2 dx', '= 30/L^5 · L^6/60', '= L/2']},
        {id:'c', prompt:'c) Berechne $\\langle x^2\\rangle$ und $\\Delta x$.', type:'value', target:'L/sqrt(28)', points:3, ph:'⟨x^2⟩ = ∫_0^L x^2 |ψ|^2 dx',
          hints:['Erst $\\langle x^2\\rangle$ als Integral, dann die Unschärfe aus $\\langle x^2\\rangle$ und $\\langle x\\rangle$.', '$\\Delta x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$ mit $\\langle x\\rangle = L/2$ aus b); am Ende steht $\\Delta x = \\dots$', '$\\int_0^L x^4(L-x)^2dx = L^7/105$, also $\\langle x^2\\rangle = 2L^2/7$.'],
          model:['⟨x^2⟩ = 30/L^5 ∫_0^L x^4 (L - x)^2 dx', '= 30/L^5 · L^7/105', '= 2L^2/7', 'Δx = sqrt(2L^2/7 - L^2/4)', '= sqrt(L^2/28)', '= L/sqrt(28)'],
          mistakes:[{expr:'sqrt(2L^2/7)', msg:'Das ist $\\sqrt{\\langle x^2\\rangle}$. Für $\\Delta x$ fehlt noch $-\\langle x\\rangle^2$.'}]}
      ]},
    {id:'wf-p2', title:'Wahrscheinlichkeit im linken Viertel',
      text:'Wie Aufgabe 1: $\\psi(x) = \\sqrt{30/L^5}\\,x(L-x)$ im Kasten. Wie groß ist die Wahrscheinlichkeit, das Teilchen zwischen $0$ und $L/4$ zu finden?',
      ctx:CTX.box({defs:{'ψ(x)':'sqrt(30/L^5) x (L - x)'}}),
      goals:[{id:'a', prompt:'Berechne $P(0 < x < L/4)$ als Bruch.', type:'value', target:'53/512', points:3, ph:'P = ∫_0^{L/4} |ψ|^2 dx',
        hints:['Wahrscheinlichkeit für ein Intervall: Integral der Dichte über genau dieses Intervall.', 'Stammfunktion von $x^2(L-x)^2$: $\\frac{L^2x^3}{3} - \\frac{Lx^4}{2} + \\frac{x^5}{5}$.', 'Bei $x = L/4$: $L^5\\left(\\frac{1}{192} - \\frac{1}{512} + \\frac{1}{5120}\\right)$; noch mit $30/L^5$ multiplizieren.'],
        model:['P = ∫_0^{L/4} |ψ|^2 dx', '= 30/L^5 ∫_0^{L/4} x^2 (L - x)^2 dx', '= 30/L^5 [L^2 x^3/3 - L x^4/2 + x^5/5]_0^{L/4}', '= 30 (1/192 - 1/512 + 1/5120)', '= 53/512'],
        note:'Zum Vergleich: $53/512 \\approx 0{,}10$. Gleichverteilt wären es $0{,}25$.'}]},
    {id:'wf-p3', title:'Exponentiell abfallende Wellenfunktion',
      text:'$\\psi(x) = A\\,e^{-|x|/a}$ auf der ganzen Achse, $a > 0$.',
      ctx:CTX.line({params:{a:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(-|x|/a)'}, unknowns:{A:{ref:'1/sqrt(a)', alt:['-1/sqrt(a)']}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2,
          hints:['Normierungsbedingung über die ganze Achse ansetzen.', 'Der Integrand $e^{-2|x|/a}$ ist gerade: $\\int_{-\\infty}^\\infty = 2\\int_0^\\infty$; außerdem $\\int_0^\\infty e^{-kx}dx = 1/k$.', 'Es bleibt $2|A|^2\\cdot a/2 = 1$.'],
          model:['∫_-∞^∞ |ψ|^2 dx = 1', '2|A|^2 ∫_0^∞ e^(-2x/a) dx = 1', '|A|^2 a = 1', 'A = 1/sqrt(a)']},
        {id:'b', prompt:'b) Berechne $\\langle x^2\\rangle$ (mit dem normierten $\\psi$).', type:'value', target:'a^2/2', points:2, ph:'⟨x^2⟩ = 2/a ∫_0^∞ x^2 e^(-2x/a) dx',
          hints:['$\\langle x^2\\rangle$ ist ein mit $|\\psi|^2$ gewichtetes Integral; nutze wieder, dass der Integrand gerade ist.', '$\\int_0^\\infty x^2e^{-kx}dx = 2/k^3$ mit $k = 2/a$.', '$\\langle x^2\\rangle = \\frac{2}{a}\\cdot\\frac{2}{(2/a)^3}$.'],
          model:['⟨x^2⟩ = 1/a ∫_-∞^∞ x^2 e^(-2|x|/a) dx', '= 2/a ∫_0^∞ x^2 e^(-2x/a) dx', '= 2/a · 2/(2/a)^3', '= a^2/2']},
        {id:'c', prompt:'c) Wie groß ist die Wahrscheinlichkeit, das Teilchen im Bereich $|x| > \\Delta x$ zu finden? (Es gilt $\\langle x\\rangle = 0$.)', type:'value', target:'e^(-sqrt(2))', points:2,
          hints:['Erst $\\Delta x$ bestimmen, dann die Wahrscheinlichkeit außerhalb von $\\pm\\Delta x$ als Integral.', '$\\Delta x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2} = a/\\sqrt 2$.', '$P = 2\\int_{\\Delta x}^\\infty |\\psi|^2dx = \\frac{2}{a}\\int_{a/\\sqrt2}^\\infty e^{-2x/a}dx$.'],
          model:['P = 2/a ∫_{a/sqrt(2)}^∞ e^(-2x/a) dx', '= 2/a · a/2 · e^(-sqrt(2))', '= e^(-sqrt(2))'], note:'$e^{-\\sqrt2}\\approx 0{,}24$: Etwa ein Viertel liegt außerhalb von $\\pm\\Delta x$.'}
      ]},
    {id:'wf-p4', title:'Impulsunschärfe und Unschärferelation',
      text:'Für $\\psi(x) = \\sqrt{30/L^5}\\,x(L-x)$ im Kasten gilt $\\Delta x = L/\\sqrt{28}$ (Aufgabe 1). Im Ortsraum wirkt $\\hat p = -i\\hbar\\,d/dx$ (hergeleitet im Lerntext aus $\\langle p\\rangle = m\\,d\\langle x\\rangle/dt$).',
      ctx:CTX.box({defs:{'ψ(x)':'sqrt(30/L^5) x (L - x)'}, normalized:true}),
      goals:[
        {id:'a', prompt:'a) Zeige $\\langle p\\rangle = 0$.', type:'value', target:'0', points:2, ph:'⟨p⟩ = ∫_0^L ψ^* (-iħ) dψ/dx dx',
          hints:['Erwartungswert mit Operator: $\\psi^*$, dann $\\hat p\\psi$, dann integrieren.', '$\\langle p\\rangle = \\int\\psi^*(-i\\hbar\\psi\')dx$. Für reelles $\\psi$ ist $\\psi\\psi\' = \\tfrac12(\\psi^2)\'$.', 'Das Integral wird zu $-\\frac{i\\hbar}{2}[\\psi^2]_0^L$. Welchen Wert hat $\\psi$ an den Wänden?'],
          model:['⟨p⟩ = ∫_0^L ψ^* (-iħ) dψ/dx dx', '= -iħ/2 [ψ^2]_0^L', '= 0']},
        {id:'b', prompt:'b) Berechne $\\langle p^2\\rangle$.', type:'value', target:'10ħ^2/L^2', points:3, ph:'⟨p^2⟩ = ∫_0^L ψ (-ħ^2) ψ\'\' dx',
          hints:['$\\hat p^2 = -\\hbar^2\\,d^2/dx^2$ zwischen $\\psi$ und $\\psi$ stellen.', '$\\psi\'\' = -2\\sqrt{30/L^5}$ ist konstant.', '$\\int_0^Lx(L-x)\\,dx = L^3/6$.'],
          model:['⟨p^2⟩ = ∫_0^L ψ (-ħ^2) ψ\'\' dx', '= 2ħ^2 · 30/L^5 ∫_0^L x (L - x) dx', '= 60 ħ^2/L^5 · L^3/6', '= 10 ħ^2/L^2']},
        {id:'c', prompt:'c) Berechne $\\Delta x\\,\\Delta p$ und vergleiche mit $\\hbar/2$.', type:'value', target:'ħ sqrt(10/28)', points:2,
          hints:['Erst $\\Delta p$ aus $\\langle p\\rangle$ und $\\langle p^2\\rangle$, dann mit $\\Delta x$ multiplizieren.', '$\\Delta p = \\sqrt{\\langle p^2\\rangle - \\langle p\\rangle^2} = \\sqrt{\\langle p^2\\rangle}$, weil $\\langle p\\rangle = 0$.', '$\\Delta x\\,\\Delta p = \\frac{L}{\\sqrt{28}}\\cdot\\frac{\\sqrt{10}\\,\\hbar}{L}$.'],
          model:['Δx Δp = L/sqrt(28) · sqrt(10) ħ/L', '= ħ sqrt(10/28) ≥ ħ/2'], note:'$\\sqrt{10/28}\\approx 0{,}598 > 0{,}5$: Die Unschärferelation ist erfüllt, aber nicht minimal (minimal nur für Gauß-Funktionen).'}
      ]},
    {id:'wf-p5', title:'Gaußsche Wellenfunktion',
      text:'$\\psi(x) = A\\,e^{-\\lambda x^2}$ mit $\\lambda > 0$. Nützlich: $\\int_{-\\infty}^\\infty e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$ und $\\int_{-\\infty}^\\infty x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$.',
      ctx:CTX.line({params:{λ:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(-λ x^2)'}, unknowns:{A:{ref:'(2λ/π)^(1/4)', alt:['-(2λ/π)^(1/4)']}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2,
          hints:['Normierung über die ganze Achse; der Exponent von $|\\psi|^2$ verdoppelt sich.', '$|\\psi|^2 = |A|^2e^{-2\\lambda x^2}$, also $\\alpha = 2\\lambda$ in $\\int e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$.', '$|A|^2\\sqrt{\\pi/(2\\lambda)} = 1$.'],
          model:['∫_-∞^∞ |ψ|^2 dx = 1', '|A|^2 ∫_-∞^∞ e^(-2λ x^2) dx = 1', '|A|^2 sqrt(π/(2λ)) = 1', 'A = (2λ/π)^(1/4)']},
        {id:'b', prompt:'b) Berechne $\\Delta x$. (Es gilt $\\langle x\\rangle = 0$.)', type:'value', target:'1/(2 sqrt(λ))', points:2,
          hints:['Wegen $\\langle x\\rangle = 0$ reicht $\\langle x^2\\rangle$.', '$\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 2\\lambda$ und $|A|^2 = \\sqrt{2\\lambda/\\pi}$.', '$\\langle x^2\\rangle = |A|^2\\cdot\\frac{1}{4\\lambda}\\sqrt{\\pi/(2\\lambda)} = \\frac{1}{4\\lambda}$.'],
          model:['⟨x^2⟩ = sqrt(2λ/π) ∫_-∞^∞ x^2 e^(-2λ x^2) dx', '= sqrt(2λ/π) · 1/(4λ) sqrt(π/(2λ))', '= 1/(4λ)', 'Δx = 1/(2 sqrt(λ))']}
      ]}
  ],
  sketch:[SK.s1],
  final:[
    {aim:0, task:{id:'wf-f1', title:'Normieren', text:'Im Kasten $0<x<L$ ist $\\psi(x) = A\\,\\sin^2(\\pi x/L)$, außerhalb ist $\\psi = 0$.',
      ctx:CTX.box({defs:{'ψ(x)':'A sin(π x/L)^2'}, unknowns:{A:{ref:'sqrt(8/(3L))', alt:['-sqrt(8/(3L))']}}}),
      goals:[{id:'a', prompt:'Bestimme $A > 0$.', type:'solve', unknown:'A', points:3, model:['∫_0^L |ψ|^2 dx = 1', '|A|^2 ∫_0^L sin(πx/L)^4 dx = 1', '|A|^2 ∫_0^L (3/8 - 1/2 cos(2πx/L) + 1/8 cos(4πx/L)) dx = 1', '|A|^2 · 3L/8 = 1', 'A = sqrt(8/(3L))']}]}},
    {aim:1, task:{id:'wf-f2', title:'Wahrscheinlichkeit im linken Drittel', text:'$\\psi(x) = \\sqrt{2/L}\\,\\sin(\\pi x/L)$ im Kasten $0 < x < L$.',
      ctx:CTX.box({defs:{'ψ(x)':'sqrt(2/L) sin(π x/L)'}}),
      goals:[{id:'a', prompt:'Berechne $P(0 < x < L/3)$ exakt.', type:'value', target:'1/3 - sqrt(3)/(4π)', points:3, model:['P = 2/L ∫_0^{L/3} sin(πx/L)^2 dx', '= 1/L ∫_0^{L/3} (1 - cos(2πx/L)) dx', '= 1/L [x - L/(2π) sin(2πx/L)]_0^{L/3}', '= 1/3 - sqrt(3)/(4π)']}]}},
    {aim:2, task:{id:'wf-f3', title:'Unschärfe', text:'Für $x > 0$ ist $\\psi(x) = \\frac{2}{\\sqrt{3a^5}}\\,x^2e^{-x/a}$ (normiert), für $x < 0$ ist $\\psi = 0$. Nützlich: $\\int_0^\\infty x^ne^{-kx}dx = n!/k^{n+1}$.',
      ctx:CTX.line({params:{a:'pos', m:'pos'}, domain:{x:['0', '∞']}, defs:{'ψ(x)':'2/sqrt(3a^5) x^2 e^(-x/a)'}, normalized:true}),
      goals:[{id:'a', prompt:'Berechne $\\Delta x$.', type:'value', target:'sqrt(5) a/2', points:3, model:['⟨x⟩ = 4/(3a^5) ∫_0^∞ x^5 e^(-2x/a) dx', '= 4/(3a^5) · 5!/(2/a)^6', '= 5a/2', '⟨x^2⟩ = 4/(3a^5) ∫_0^∞ x^6 e^(-2x/a) dx', '= 4/(3a^5) · 6!/(2/a)^7', '= 15a^2/2', 'Δx = sqrt(15a^2/2 - 25a^2/4)', '= sqrt(5) a/2']}]}},
    {aim:'k', id:'wf-fk1', type:'mc2', q:'Bei einem Doppelspalt-Versuch mit einzelnen Elektronen stellt ein Detektor an den Spalten fest, durch welchen Spalt jedes Elektron fliegt. Was zeigt der Schirm nach vielen Elektronen?', opts:['nur die Summe der beiden Einzelspalt-Bilder', 'dasselbe Interferenzmuster wie ohne Detektor', 'Interferenzstreifen mit doppeltem Abstand'], a:0, ex:'Das Interferenzmuster verschwindet.',
      reason:{q:'Warum?', opts:['Nach der Messung ist nur ein Anteil $\\psi_1$ oder $\\psi_2$ übrig; der Mischterm fehlt.', 'Der Detektor bremst die Elektronen, deshalb ändert sich ihre Wellenlänge.', 'Elektronen interferieren nur, wenn mehrere gleichzeitig unterwegs sind.'], a:0, ex:'Die Welcher-Weg-Messung lässt $\\psi$ auf einen Anteil kollabieren. Ohne den Mischterm $2\\,\\mathrm{Re}(\\psi_1^*\\psi_2)$ addieren sich nur die Wahrscheinlichkeiten. Dass Elektronen einzeln interferieren, zeigt der Versuch ohne Detektor.'}},
    {aim:'k', id:'wf-fk2', type:'dialog', text:'Ein Teilchen ist im Grundzustand $\\psi_1$ eines Kastens. Eine Ortsmessung ergibt $x_0 = 0{,}3L$. Unmittelbar danach misst man ein zweites Mal.',
      people:[{name:'Lena', says:'Die zweite Messung ergibt irgendeinen Wert nach der Verteilung $|\\psi_1|^2$, denn das Teilchen ist ja im Zustand $\\psi_1$.'}, {name:'Jonas', says:'Die zweite Messung ergibt wieder (fast genau) $0{,}3L$, denn die erste Messung hat den Zustand verändert.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Nach der ersten Messung ist $\\psi$ scharf um $x_0$ konzentriert (Kollaps). Eine sofort folgende Messung bestätigt $x_0$. Erst mit der Zeit läuft $\\psi$ wieder auseinander.'}
  ],
  finalB:[
    {aim:0, task:{id:'wf-fB1', title:'Normieren', text:'Im Kasten $0<x<L$ ist $\\psi(x) = A\\,x^2(L - x)$, außerhalb ist $\\psi = 0$.',
      ctx:CTX.box({defs:{'ψ(x)':'A x^2 (L - x)'}, unknowns:{A:{ref:'sqrt(105/L^7)', alt:['-sqrt(105/L^7)']}}}),
      goals:[{id:'a', prompt:'Bestimme $A > 0$.', type:'solve', unknown:'A', points:3, model:['∫_0^L |ψ|^2 dx = 1', '|A|^2 ∫_0^L x^4 (L - x)^2 dx = 1', '|A|^2 ∫_0^L (L^2 x^4 - 2L x^5 + x^6) dx = 1', '|A|^2 (L^7/5 - L^7/3 + L^7/7) = 1', '|A|^2 L^7/105 = 1', 'A = sqrt(105/L^7)']}]}},
    {aim:1, task:{id:'wf-fB2', title:'Wahrscheinlichkeit in der Mitte', text:'$\\psi(x) = \\sqrt{2/L}\\,\\sin(\\pi x/L)$ im Kasten $0 < x < L$.',
      ctx:CTX.box({defs:{'ψ(x)':'sqrt(2/L) sin(π x/L)'}}),
      goals:[{id:'a', prompt:'Berechne $P(L/4 < x < 3L/4)$ exakt.', type:'value', target:'1/2 + 1/π', points:3, model:['P = 2/L ∫_{L/4}^{3L/4} sin(πx/L)^2 dx', '= 1/L ∫_{L/4}^{3L/4} (1 - cos(2πx/L)) dx', '= 1/L [x - L/(2π) sin(2πx/L)]_{L/4}^{3L/4}', '= 1/2 + 1/π']}]}},
    {aim:2, task:{id:'wf-fB3', title:'Unschärfe', text:'Für $x > 0$ ist $\\psi(x) = \\frac{1}{\\sqrt{2a^3}}\\,x\\,e^{-x/(2a)}$ (normiert), für $x < 0$ ist $\\psi = 0$. Nützlich: $\\int_0^\\infty x^ne^{-kx}dx = n!/k^{n+1}$.',
      ctx:CTX.line({params:{a:'pos', m:'pos'}, domain:{x:['0', '∞']}, defs:{'ψ(x)':'1/sqrt(2a^3) x e^(-x/(2a))'}, normalized:true}),
      goals:[{id:'a', prompt:'Berechne $\\Delta x$.', type:'value', target:'sqrt(3) a', points:3, model:['⟨x⟩ = 1/(2a^3) ∫_0^∞ x^3 e^(-x/a) dx', '= 1/(2a^3) · 3! a^4', '= 3a', '⟨x^2⟩ = 1/(2a^3) ∫_0^∞ x^4 e^(-x/a) dx', '= 1/(2a^3) · 4! a^5', '= 12a^2', 'Δx = sqrt(12a^2 - 9a^2)', '= sqrt(3) a']}]}},
    {aim:'k', id:'wf-fBk1', type:'mc2', q:'Beim Doppelspalt mit einzelnen Elektronen steht nur an Spalt 1 ein Detektor. Er spricht sicher an, wenn ein Elektron durch Spalt 1 fliegt; an Spalt 2 steht nichts. Was zeigt der Schirm nach vielen Elektronen, wenn man alle mitzählt?', opts:['keine Interferenzstreifen, nur die Summe der Einzelspalt-Bilder', 'das volle Interferenzmuster, weil Spalt 2 ungestört bleibt', 'Streifen nur von den Elektronen, bei denen der Detektor schweigt'], a:0, ex:'Das Interferenzmuster verschwindet ganz.',
      reason:{q:'Warum?', opts:['Auch ein Schweigen des Detektors verrät den Weg: Für jedes Elektron bleibt nur $\\psi_1$ oder $\\psi_2$.', 'Der Detektor gibt jedem Elektron einen Stoß, der die Streifen verwischt.', 'Mit nur einem Detektor kommen zu wenige Elektronen am Schirm an.'], a:0, ex:'Schweigt der Detektor, ist das Elektron durch Spalt 2 geflogen, ohne berührt worden zu sein. Trotzdem ist für jedes Elektron der Weg bekannt, und der Mischterm $2\\,\\mathrm{Re}(\\psi_1^*\\psi_2)$ fehlt. Ein Stoß ist also nicht die eigentliche Ursache.'}},
    {aim:'k', id:'wf-fBk2', type:'mc2', q:'Ein Teilchen ist im Zustand $\\psi_2 = \\sqrt{2/L}\\sin(2\\pi x/L)$ eines Kastens; $|\\psi_2|^2$ hat zwei gleich große Buckel links und rechts der Mitte. Eine Ortsmessung findet es bei $x_0 = 0{,}25L$. Unmittelbar danach misst man noch einmal. Wie wahrscheinlich liegt das zweite Ergebnis im rechten Buckel ($x > L/2$)?', opts:['praktisch null', 'genau $1/2$, wie für $|\\psi_2|^2$', 'klein, aber deutlich größer als null, weil $\\psi$ sofort zerfließt'], a:0, ex:'Die zweite Messung findet das Teilchen wieder (fast genau) bei $0{,}25L$.',
      reason:{q:'Warum?', opts:['Die erste Messung hat den Zustand verändert: $\\psi$ ist jetzt schmal um $0{,}25L$.', '$\\psi_2$ ändert sich zeitlich nicht, also auch nicht durch eine Messung.', 'Der Messwert liegt am Maximum von $|\\psi_2|^2$, also bleibt alles beim Alten.'], a:0, ex:'Nach der Messung gilt nicht mehr $|\\psi_2|^2$, sondern ein schmaler Gipfel um $x_0$ (Kollaps). Eine Messung ändert den Zustand, auch wenn er sich ohne Messung nicht ändern würde. Erst mit der Zeit läuft der Gipfel auseinander.'}}
  ],
  errors:[
    {id:'wf-e1', title:'Normierung einer ebenen Welle mit Gauß-Hülle',
      text:'Gesucht ist $A > 0$ für $\\psi(x) = A\\,e^{ikx}e^{-x^2/(2\\sigma^2)}$. Ein Kommilitone rechnet:',
      ctx:CTX.line({params:{k:'pos', σ:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(i k x) e^(-x^2/(2σ^2))'}, unknowns:{A:{ref:'1/(π^(1/4) sqrt(σ))'}}}),
      lines:['∫_-∞^∞ |ψ|^2 dx = 1', '∫_-∞^∞ A^2 e^(2ikx) e^(-x^2/σ^2) dx = 1', 'A^2 e^(-k^2 σ^2) σ sqrt(π) = 1', 'A = e^(k^2 σ^2/2)/(π^(1/4) sqrt(σ))'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Es wurde $\\psi^2$ statt $|\\psi|^2 = \\psi^*\\psi$ eingesetzt.', 'Die Grenzen müssen $0$ bis $\\infty$ sein.', 'Der Exponent der Gauß-Funktion stimmt nicht.'], a:0, ex:'$|e^{ikx}|^2 = 1$. Mit $\\psi^2$ bleibt fälschlich $e^{2ikx}$ stehen; das Ergebnis hängt dann sogar von $k$ ab.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $A$.', type:'solve', unknown:'A', model:['∫_-∞^∞ |ψ|^2 dx = 1', '|A|^2 ∫_-∞^∞ e^(-x^2/σ^2) dx = 1', '|A|^2 σ sqrt(π) = 1', 'A = 1/(π^(1/4) sqrt(σ))']}}
  ]
});
})();
lexe('born', 'Bornsche Wahrscheinlichkeitsdeutung', '$|\\psi(x,t)|^2\\,dx$ ist die Wahrscheinlichkeit, das Teilchen zur Zeit $t$ im Intervall $[x, x+dx]$ zu finden. Für endliche Intervalle: $P(a<x<b) = \\int_a^b|\\psi|^2dx$. Dafür muss $\\psi$ normiert sein. $|\\psi|^2$ ist eine Dichte (Einheit 1/Länge), keine Wahrscheinlichkeit.', {topic:'wf'});
lexe('normierung', 'Normierung', '$\\int_{-\\infty}^\\infty|\\psi(x,t)|^2dx = 1$. Vorgehen: unbekannten Vorfaktor $A$ ansetzen, $|A|^2$ vor das Integral ziehen, Integral ausrechnen, nach $|A|$ auflösen. Die Phase von $A$ ist frei wählbar (meist $A > 0$). Die Normierung bleibt unter der Schrödingergleichung erhalten (reelles $V$). In 3D: $\\int|\\psi|^2d^3r = 1$, in Kugelkoordinaten mit $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$.', {topic:'wf'});
lexe('erwartungswert', 'Erwartungswert', 'Mittelwert vieler Messungen an gleich präparierten Systemen: $\\langle x\\rangle = \\int x|\\psi|^2dx$, allgemein $\\langle A\\rangle = \\langle\\psi|\\hat A|\\psi\\rangle = \\int\\psi^*\\hat A\\psi\\,dx$. Der Operator steht zwischen $\\psi^*$ und $\\psi$ und wirkt nach rechts. Weder das Ergebnis einer Einzelmessung noch unbedingt der wahrscheinlichste Wert.', {topic:'wf'});
lexe('unschaerfe', 'Unschärfe (Standardabweichung)', '$\\Delta A = \\sqrt{\\langle A^2\\rangle - \\langle A\\rangle^2}$. Sie misst die Streuung der Messwerte an gleich präparierten Systemen – keine Messungenauigkeit. Heisenberg: $\\Delta x\\,\\Delta p \\ge \\hbar/2$; allgemein Robertson: $\\Delta A\\,\\Delta B \\ge \\tfrac12|\\langle[\\hat A,\\hat B]\\rangle|$.', {topic:'wf'});
lexe('integrale', 'Nützliche Integrale', '- $\\int_0^L\\sin^2(n\\pi x/L)dx = L/2$, $\\int_0^L\\sin(n\\pi x/L)\\sin(m\\pi x/L)dx = 0$ für $n\\neq m$\n- $\\int_0^\\infty x^ne^{-kx}dx = n!/k^{n+1}$\n- $\\int_{-\\infty}^\\infty e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$, $\\int_{-\\infty}^\\infty x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$\n- $\\int_{-\\infty}^\\infty e^{-\\alpha x^2 + \\beta x}dx = \\sqrt{\\pi/\\alpha}\\,e^{\\beta^2/(4\\alpha)}$ (auch für komplexes $\\beta$)\n- $\\sin^2u = \\tfrac12(1-\\cos 2u)$, $\\sin a\\sin b = \\tfrac12[\\cos(a-b) - \\cos(a+b)]$', {topic:'m-analysis'});
lexe('komplexe-zahlen', 'Komplexe Zahlen', '$z = a + ib = re^{i\\varphi}$, $z^* = a - ib$, $|z|^2 = z^*z = a^2 + b^2$. Euler: $e^{i\\varphi} = \\cos\\varphi + i\\sin\\varphi$, $|e^{i\\varphi}| = 1$. Achtung: $z^2 \\ne |z|^2$ für komplexes $z$.', {topic:'m-komplex'});
lexe('photoeffekt', 'Photoeffekt', 'Licht löst Elektronen aus einer Metalloberfläche. Die größte kinetische Energie hängt nur von der Frequenz ab: $E_{\\text{kin,max}} = \\hbar\\omega - W$ mit der Austrittsarbeit $W$; unterhalb der Grenzfrequenz $\\omega = W/\\hbar$ tritt kein Elektron aus. Die Intensität bestimmt nur die Zahl der Elektronen. Einstein (1905): Licht gibt Energie in Portionen $E = \\hbar\\omega = hf$ ab.', {topic:'wf'});
lexe('doppelspalt', 'Einzelelektronen-Doppelspalt', 'Elektronen, die einzeln durch einen Doppelspalt (bei Tonomura et al. 1989: ein Elektronen-Biprisma) fliegen, werden als einzelne Punkte nachgewiesen. Erst viele Punkte ergeben ein Interferenzmuster. Deutung: Die Amplituden der beiden Wege addieren sich, $\\psi = \\psi_1 + \\psi_2$, und $|\\psi|^2$ enthält den Interferenzterm $2\\,\\mathrm{Re}(\\psi_1^*\\psi_2)$. Eine Welcher-Weg-Messung zerstört das Muster.', {topic:'wf'});
lexe('de-broglie', 'de-Broglie-Beziehung', 'Einem Teilchen mit Impuls $p$ entspricht die Wellenlänge $\\lambda = h/p$, also $p = \\hbar k$ mit $k = 2\\pi/\\lambda$. Zusammen mit $E = \\hbar\\omega$ (Planck–Einstein) Grundlage der Schrödingergleichung. In der Quantenmechanik: $\\hat p\\,e^{ikx} = \\hbar k\\,e^{ikx}$. Beispiel: Elektron mit $100\\,\\mathrm{eV}$, $\\lambda \\approx 0{,}12\\,\\mathrm{nm}$.', {topic:'wf'});
lexe('ensemble', 'Ensemble', 'Gedachte oder reale Gesamtheit vieler gleich präparierter Systeme. Wahrscheinlichkeiten und Erwartungswerte der Quantenmechanik sind Aussagen über Häufigkeiten und Mittelwerte in einem Ensemble; eine Einzelmessung liefert einen einzelnen Wert.', {topic:'wf'});
lexe('kollaps', 'Kollaps (Zustandsreduktion)', 'Nach einer Messung mit Ergebnis $a$ ist das System in einem Zustand, in dem eine sofort wiederholte Messung sicher wieder $a$ ergibt: nach einer Ortsmessung scharf um $x_0$ konzentriert, nach einer Energiemessung im Eigenzustand $\\psi_n$. Danach entwickelt sich der Zustand wieder nach der Schrödingergleichung; er kehrt nicht von selbst in den Zustand vor der Messung zurück.', {topic:'wf'});
lexe('deutungen', 'Deutungen der Quantenmechanik', 'Sie unterscheiden sich darin, was vor einer Messung „wirklich“ ist. Realistisch: Das Ergebnis lag schon fest, die Quantenmechanik beschreibt nicht alles (Einstein). Theorien mit *lokalen* verborgenen Variablen können nicht alle Vorhersagen der Quantenmechanik reproduzieren (Bell 1964); Bell-Experimente sprechen gegen sie. Realistisch, aber nichtlokal ist die Bohmsche Mechanik: Dort hat das Teilchen immer einen Ort. Kopenhagen: Die Messung erzeugt das Ergebnis. Bohmsche Mechanik und Viele-Welten-Deutung sagen dieselben Messergebnisse voraus wie die Standard-Quantenmechanik. Gerechnet wird in allen mit der Bornschen Regel.', {topic:'wf'});
lexe('impulsoperator', 'Impulsoperator', 'In Ortsdarstellung $\\hat p = -i\\hbar\\,\\partial/\\partial x$. Plausibel gemacht über $\\langle p\\rangle = m\\,\\frac{d}{dt}\\langle x\\rangle = \\int\\psi^*(-i\\hbar\\,\\partial_x)\\psi\\,dx$. Eigenfunktionen: $e^{ikx}$ mit Eigenwert $\\hbar k$. Für reelles normierbares $\\psi$ ist $\\langle p\\rangle = 0$.', {topic:'wf'});
lexe('globale-phase', 'Globale Phase', '$\\psi$ und $e^{i\\alpha}\\psi$ (mit konstantem reellem $\\alpha$) beschreiben denselben physikalischen Zustand: Alle Wahrscheinlichkeiten und Erwartungswerte sind gleich. Deshalb legt die Normierung nur $|A|$ fest. Eine *relative* Phase zwischen Anteilen einer Überlagerung ist dagegen messbar.', {topic:'wf'});
