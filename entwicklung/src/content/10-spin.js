/* ===== Thema 10: Spin ½ ===== */
(function(){
const R = String.raw;
/* Skizzen (SKIZZE.md): Zeitachse t ∈ [0, 4π/ω], in der Skizze x = ωt/(4π) ∈ [0, 1].
   Start |+x⟩, Ĥ = ωŜ_z: P(+x) = cos²(ωt/2); ⟨S_x⟩ = (ħ/2)cos ωt, ⟨S_y⟩ = (ħ/2)sin ωt (Drehung gegen den Uhrzeigersinn um z).
   Start |±y⟩: ⟨S_x⟩ = ∓(ħ/2) sin ωt. */
const SPIN_SK = {T:[{x:0, lab:'0'}, {x:0.25, lab:'\\pi/\\omega'}, {x:0.5, lab:'2\\pi/\\omega'}, {x:0.75, lab:'3\\pi/\\omega'}, {x:1, lab:'4\\pi/\\omega'}]};
const SPIN = extra => Object.assign({rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}}, extra || {});
topic({
  id:'spin', math:['m-eigen', 'm-komplex'], title:'Spin ½', short:'Spin',
  src:'Griffiths & Schroeter Kap. 4.4 · Sakurai & Napolitano Kap. 1 · Nolting 5/2',
  goals:[
    'Ich kann mit Spinoren und den Matrizen $\\hat S_i = \\frac\\hbar2\\sigma_i$ rechnen und Eigenzustände von $\\hat S_x$, $\\hat S_y$, $\\hat S_z$ angeben.',
    'Ich kann Messwahrscheinlichkeiten $|\\langle\\pm|\\chi\\rangle|^2$ und Erwartungswerte berechnen, auch für Folgen von Stern-Gerlach-Messungen.',
    'Ich kann die Zeitentwicklung im Magnetfeld (Larmor-Präzession) mit $e^{-i\\hat Ht/\\hbar}$ berechnen.'
  ],
  needs:'Matrizen multiplizieren, Eigenwerte von $2\\times2$-Matrizen · Dirac-Notation $\\langle\\varphi|\\psi\\rangle$ · Messpostulat',
  wozu:'Auf dem Spin beruhen Kernspinresonanz (NMR) und Magnetresonanztomographie: Protonen präzedieren im Magnetfeld mit der Larmor-Frequenz, etwa 42,6 MHz pro Tesla, und genau diese Frequenz misst das Gerät. Dass jedes Orbital im Atom zwei Elektronen aufnimmt (Aufbau des Periodensystems), liegt am Pauli-Prinzip zusammen mit den zwei Spineinstellungen. Und ein Spin ½ ist das einfachste Quantensystem überhaupt – das Qubit der Quanteninformation.',
  bridge:'Aus Thema 8 kommen die Drehimpuls-Vertauschungsrelationen und die Leiteroperatoren zurück: Der Spin erfüllt dieselbe Algebra, nur mit $s = \\tfrac12$. Aus Thema 6 brauchst du Dirac-Schreibweise, Messpostulat und Zustandsreduktion, aus M4 Eigenwerte von $2\\times2$-Matrizen und aus Thema 2 die Zeitentwicklung mit Phasenfaktoren. Neu ist: Der Zustandsraum ist zweidimensional, eine Wellenfunktion im Ort kommt nicht vor.',
  check:[
    {q:'Welche Eigenwerte hat die Matrix $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$?', opts:['$+1$ und $-1$', '$0$ und $1$', '$1$ (doppelt)'], a:0, ex:'$\\det\\begin{pmatrix}-\\lambda&1\\\\1&-\\lambda\\end{pmatrix} = \\lambda^2 - 1 = 0$.', prev:'m-eigen', seg:'me-t3'},
    {q:'Für $|\\psi\\rangle = \\binom{a}{b}$ und $|\\varphi\\rangle = \\binom{c}{d}$ ist $\\langle\\varphi|\\psi\\rangle = $', opts:['$c^*a + d^*b$', '$ca + db$', '$a^*c + b^*d$'], a:0, ex:'Das Bra enthält die konjugierten Komponenten des Kets: $\\langle\\varphi| = (c^*, d^*)$.', prev:'form'},
    {q:'Ein Zustand ist $|\\chi\\rangle = \\sum_n c_n|a_n\\rangle$ (normiert, $|a_n\\rangle$ Eigenzustände von $\\hat A$). Mit welcher Wahrscheinlichkeit misst man $a_2$?', opts:['$|c_2|^2$', '$c_2$', '$|c_2|$'], a:0, ex:'Bornsche Regel: $P(a_n) = |\\langle a_n|\\chi\\rangle|^2 = |c_n|^2$.', prev:'form'},
    {q:'Welche Vertauschungsrelation gilt für Drehimpulse?', opts:['$[\\hat L_x, \\hat L_y] = i\\hbar\\hat L_z$', '$[\\hat L_x, \\hat L_y] = 0$', '$[\\hat L_x, \\hat L_y] = \\hbar\\hat L_z$'], a:0, ex:'Und zyklisch. Der Spin erfüllt dieselben Relationen.', prev:'dreh'}
  ],
  diag:[
    {q:'Wie beginnst du, um die Wahrscheinlichkeit für $S_x = +\\hbar/2$ im Zustand $|\\chi\\rangle = \\binom ab$ zu berechnen?', opts:['den Eigenzustand $|{+x}\\rangle$ aufschreiben und $|\\langle{+x}|\\chi\\rangle|^2$ bilden', '$\\langle\\chi|\\hat S_x|\\chi\\rangle$ ausrechnen und durch $\\hbar/2$ teilen', '$|a|^2$ nehmen, weil die obere Komponente zu „plus“ gehört', 'weiß ich noch nicht'], a:0, ex:'Bornsche Regel: Man projiziert auf den Eigenzustand zum Messwert. $\\langle S_x\\rangle/(\\hbar/2)$ ist $P(+) - P(-)$, nicht $P(+)$; und $|a|^2$ ist die Wahrscheinlichkeit für $S_z = +\\hbar/2$.'},
    {q:'Wie beginnst du, um den Spinzustand zur Zeit $t$ im Feld $B\\hat z$ zu finden ($\\hat H = \\omega\\hat S_z$, Start $a|\\uparrow\\rangle + b|\\downarrow\\rangle$)?', opts:['nach Eigenzuständen von $\\hat H$ zerlegen und jedem Anteil $e^{-iE_nt/\\hbar}$ geben', 'den ganzen Zustand mit einem gemeinsamen Faktor $e^{-i\\omega t}$ multiplizieren', 'die Schrödingergleichung für eine Wellenfunktion $\\psi(x, t)$ im Ort lösen', 'weiß ich noch nicht'], a:0, ex:'$|\\uparrow\\rangle$ und $|\\downarrow\\rangle$ sind Eigenzustände von $\\hat H$ mit $E = \\pm\\hbar\\omega/2$. Ein gemeinsamer Faktor wäre nur eine globale Phase und änderte nichts. Eine Ortswellenfunktion kommt beim reinen Spin nicht vor.'}
  ],
  phenomenon:{
    title:'Ein Strich oder zwei Flecken?',
    text:'Otto Stern und Walther Gerlach schickten 1922 einen Strahl von Silberatomen durch ein stark inhomogenes Magnetfeld. Jedes Atom trägt ein kleines magnetisches Moment $\\boldsymbol\\mu$. Im inhomogenen Feld wirkt darauf die Kraft $F_z = \\mu_z\\,\\partial B_z/\\partial z$. Sie lenkt jedes Atom je nach seinem $\\mu_z$ nach oben oder unten ab.\n\nDie Atome kommen aus einem heißen Ofen; ihre Momente sind zufällig orientiert. Hinter dem Magneten fängt eine Glasplatte die Atome auf.',
    q:{q:'Was erwartest du auf der Platte?', opts:['einen durchgehenden Strich, weil $\\mu_z$ jeden Wert annehmen kann', 'genau zwei getrennte Flecken', 'einen Fleck in der Mitte, weil sich die Ablenkungen aufheben', 'drei Flecken, wie bei einem Drehimpuls mit $l = 1$'], a:1,
      ex:'Beobachtet werden zwei Flecken: $\\mu_z$ hat nur zwei mögliche Werte.',
      fb:['Das ist die klassische Erwartung: zufällig orientierte Momente, also jeder Wert zwischen $-|\\boldsymbol\\mu|$ und $+|\\boldsymbol\\mu|$. Beobachtet wird aber etwas anderes.',
        'Richtig – und das ist überraschend. Egal wie die Momente im Ofen orientiert waren: $\\mu_z$ nimmt nur zwei Werte an.',
        'Ein Mittelwert entstünde nur, wenn alle Atome gleich abgelenkt würden. Jedes einzelne Atom wird aber nach seinem eigenen $\\mu_z$ abgelenkt.',
        'Gut, eine Quantisierung zu erwarten. Ein Bahndrehimpuls hat aber $2l + 1$ Einstellungen, also eine ungerade Zahl von Flecken. Beobachtet werden zwei.']},
    reveal:'Auf der Platte liegen **zwei** Flecken. Die $z$-Komponente des Moments ist quantisiert und hat nur zwei Werte. Ein Drehimpuls mit Quantenzahl $j$ hat $2j + 1$ Einstellungen; zwei Einstellungen verlangen $j = \\tfrac12$. Das kann kein Bahndrehimpuls sein (der hat ganzzahliges $l$). Beim Silberatom ist der Bahndrehimpuls aller Elektronen zusammen null; das Moment stammt vom Eigendrehimpuls, dem **Spin**, des äußeren Elektrons.\n\nDreht man den Magneten in $x$-Richtung, findet man wieder genau zwei Flecken. Wie man das mit Zuständen und Operatoren beschreibt, zeigt der Lerntext.'
  },
  teach:[
    /* ===== Abschnitt 1: Stern-Gerlach ===== */
    {id:'spin-t1', title:'Stern-Gerlach: zwei Flecken statt eines Strichs', steps:[
      {id:'spin-t1a', title:'Ein Moment im inhomogenen Feld',
        num:{title:'Wie stark wird ein Silberatom abgelenkt?', text:R`Ein Silberatom trägt etwa das Bohrsche Magneton aus Thema 8, $\mu_z = \mu_B = 9{,}27\cdot10^{-24}\,\mathrm{J/T}$. In einem Feldgradienten von $10\,\mathrm{T/cm} = 10^3\,\mathrm{T/m}$ erfährt es die Kraft

$$F_z = \mu_z\,\frac{\partial B_z}{\partial z} = 9{,}27\cdot10^{-21}\,\mathrm N.$$

Mit der Masse $1{,}79\cdot10^{-25}\,\mathrm{kg}$ ist $a = F_z/m \approx 5{,}2\cdot10^4\,\mathrm{m/s^2}$. Bei $500\,\mathrm{m/s}$ dauert der Flug durch $5\,\mathrm{cm}$ Magnet $t = 10^{-4}\,\mathrm s$, die Ablenkung ist $\tfrac12at^2 \approx 0{,}26\,\mathrm{mm}$ nach oben oder unten. Die Flecken lägen also gut $0{,}5\,\mathrm{mm}$ auseinander. Im Originalversuch (Magnet nur $3{,}5\,\mathrm{cm}$ lang) waren es $0{,}2\,\mathrm{mm}$.`},
        text:R`Ein Elektron hat nicht nur Ort und Impuls. Es trägt auch ein eigenes [[lex:spin-moment|magnetisches Moment]] $\boldsymbol\mu$. Im Rückblick zeigte das schon 1922 der [[lex:stern-gerlach|Stern-Gerlach-Versuch]]: Ein Strahl von Silberatomen fliegt durch ein stark inhomogenes Magnetfeld und trifft dann auf eine Glasplatte. Ein Moment hat im Feld die Energie $U = -\boldsymbol\mu\cdot\mathbf B$. Ist das Feld inhomogen, wirkt die Kraft $F_z = \mu_z\,\partial B_z/\partial z$. Die Ablenkung ist also proportional zu $\mu_z$. Klassisch zeigen die Momente aus dem Ofen in zufällige Richtungen, und $\mu_z$ nimmt jeden Wert zwischen $-|\boldsymbol\mu|$ und $+|\boldsymbol\mu|$ an. Auf der Platte sollte ein durchgehender Strich entstehen.`,
        q:{q:R`Klassisch betrachtet: Ein Atom hat sein Moment unter $60°$ zur $z$-Achse. Wie groß ist seine Ablenkung im Vergleich zu einem Atom mit Moment genau entlang $z$?`,
          opts:[R`halb so groß`, R`gleich groß, nur der Betrag zählt`, R`null, weil es nicht entlang $z$ zeigt`], a:0,
          ex:R`Die Ablenkung ist proportional zu $\mu_z = |\boldsymbol\mu|\cos60° = \tfrac12|\boldsymbol\mu|$.`,
          fb:['', R`Die Kraft hängt nur von der $z$-Komponente ab, nicht vom Betrag allein.`,
            R`Null wäre es nur bei $90°$. Bei $60°$ bleibt $\mu_z = \tfrac12|\boldsymbol\mu|$.`]}},
      {id:'spin-t1b', title:'Beobachtet: zwei Flecken',
        pre:{from:'dreh', seg:'dreh-t3', title:'Wie viele Werte hat ein Drehimpuls?', text:R`Ein Drehimpuls mit der Quantenzahl $j$ hat $2j + 1$ Werte $m\hbar$ seiner $z$-Komponente, $m = -j, \dots, j$. Die Algebra erlaubt ganz- und halbzahlige $j$; ein Bahndrehimpuls hat nur ganzzahlige. Mini-Beispiel: $j = \tfrac32$ gibt vier Werte.`},
        num:{title:'Fleckenzahl und Quantenzahl', text:R`$2j + 1$ Werte geben $2j + 1$ Flecken:

$$j = 0:\ 1,\qquad j = \tfrac12:\ 2,\qquad j = 1:\ 3,\qquad j = 2:\ 5.$$

Zwei Flecken verlangen $j = \tfrac12$. Mit ganzzahligem $l$ gibt es immer eine ungerade Zahl.`},
        text:R`Auf der Platte liegen zwei getrennte Flecken. $\mu_z$ nimmt nur zwei Werte an. Dreht man den Magneten, so dass er in $x$-Richtung ablenkt, findet man wieder genau zwei Flecken, jetzt für $\mu_x$. Jede Komponente ist quantisiert, gleich in welche Richtung man misst. Ein magnetisches Moment gehört zu einem Drehimpuls: $\boldsymbol\mu = \gamma\mathbf S$ mit dem gyromagnetischen Verhältnis $\gamma$. Zwei Werte verlangen $2s + 1 = 2$, also $s = \tfrac12$. Beim Silberatom ist der Bahndrehimpuls aller Elektronen zusammen null. Das Moment stammt vom Eigendrehimpuls, dem **Spin**, des äußeren Elektrons.`,
        q:{q:R`Ein Strahl von Teilchen mit Drehimpuls $j = 1$ und $\boldsymbol\mu \propto \mathbf J$ geht durch einen Stern-Gerlach-Magneten. Wie viele Flecken erwartest du?`,
          opts:[R`zwei, wie beim Silber`, R`einen durchgehenden Strich`, R`drei`], a:2,
          ex:R`$2j + 1 = 3$ Werte $m = -1, 0, +1$, also drei Flecken.`,
          fb:[R`Zwei Flecken gehören zu $j = \tfrac12$. Für $j = 1$ gibt es $2j + 1 = 3$ Werte.`,
            R`Auch für $j = 1$ ist $J_z$ quantisiert. Ein Strich wäre die klassische Erwartung.`, '']}},
      {id:'spin-t1c', title:'Ein innerer Drehimpuls, kein Kreisel',
        num:{title:'Ein Elektron als rotierende Kugel?', text:R`Eine grobe Abschätzung: Die ganze Masse $m_e$ laufe auf einem Ring vom klassischen Elektronenradius $r_e = 2{,}8\cdot10^{-15}\,\mathrm m$ um. Für $L = m_er_ev = \hbar/2$ bräuchte sie

$$v = \frac{\hbar/2}{m_er_e} \approx 2\cdot10^{10}\,\mathrm{m/s} \approx 70\,c.$$

Eine gleichmäßig gefüllte Kugel bräuchte sogar etwa $170\,c$. Und $r_e$ ist keine gemessene Größe: Streuversuche zeigen keine Ausdehnung des Elektrons, auch weit unterhalb von $r_e$. Ein kleinerer Radius machte $v$ noch größer.`},
        text:R`Der Spin hat kein klassisches Gegenstück. Als geladene Kugel vom klassischen Elektronenradius müsste das Elektron für den Drehimpuls $\hbar/2$ viel schneller als das Licht rotieren; schon die grobe Abschätzung zeigt das. Der Spin ist eine innere Eigenschaft wie Masse oder Ladung, mit $s = \tfrac12$ für Elektron, Proton und Neutron. Für das Elektron ist $\gamma = -g\,e/(2m_e)$ mit $g \approx 2{,}002$, also $\gamma \approx -e/m_e$. Historisch war das erst später klar. Den Elektronenspin führten Uhlenbeck und Goudsmit 1925 ein, um Spektren zu erklären. Dass der Stern-Gerlach-Versuch ihn zeigt, erkannte man erst danach.`,
        q:{q:R`Warum kann der Spin des Elektrons keine echte Rotation einer kleinen geladenen Kugel sein?`,
          opts:[R`Die Oberfläche müsste schneller als das Licht laufen.`, R`Eine rotierende Ladung erzeugt kein magnetisches Moment.`, R`Weil das Elektron keine Masse hat.`], a:0,
          ex:R`Schon die grobe Abschätzung mit dem klassischen Radius gibt mehr als $70\,c$, jedes genauere Modell noch mehr. Der Spin ist deshalb eine innere Eigenschaft ohne klassisches Bild.`,
          fb:['', R`Eine rotierende Ladung erzeugt sehr wohl ein Moment. Das Problem ist die nötige Geschwindigkeit.`,
            R`Das Elektron hat die Masse $m_e = 9{,}11\cdot10^{-31}\,\mathrm{kg}$.`]}},
      {id:'spin-t1d', title:'Typischer Fehler: Die Platte zeige einen Mittelwert',
        num:{title:'1000 Atome', text:R`Von 1000 Atomen aus dem Ofen landen etwa 500 im oberen und 500 im unteren Fleck, keines dazwischen. Der Mittelwert ist

$$\overline{\mu_z} \approx \frac{500\cdot\mu_B + 500\cdot(-\mu_B)}{1000} = 0,$$

aber kein einziges Atom hat $\mu_z = 0$.`},
        text:R`Eine verbreitete Fehlvorstellung lautet: „Die Platte zeigt einen Mittelwert; die Ablenkungen heben sich teilweise auf.“ Das ist falsch. Jedes einzelne Atom landet in einem der beiden Flecken. Ein Mittelwert entsteht erst, wenn man über viele Atome mittelt, und er ist kein Wert, den ein einzelnes Atom zeigt. Das kennst du aus Thema 6: Messwerte sind Eigenwerte, der Erwartungswert ist ein Mittel über viele Messungen. Beim Spin wird das besonders anschaulich, weil es nur zwei mögliche Ergebnisse gibt.`,
        q:{q:R`Was zeigt ein einzelnes Silberatom auf der Platte?`,
          opts:[R`einen Punkt in einem der beiden Flecken`, R`einen Punkt in der Mitte zwischen den Flecken`, R`einen kurzen Strich zwischen den Flecken`], a:0,
          ex:R`Jedes Atom liefert einen der beiden möglichen Messwerte. Erst viele Atome zusammen ergeben zwei Flecken.`,
          fb:['', R`In der Mitte landet kein Atom. Der Mittelwert vieler Atome ist kein Einzelergebnis.`,
            R`Ein Strich wäre die klassische Erwartung mit beliebigen Werten von $\mu_z$.`]}}
    ]},

    /* ===== Abschnitt 2: Zustandsraum, Spinor, Bloch-Kugel ===== */
    {id:'spin-t2', title:'Der Zustandsraum: zwei komplexe Dimensionen', steps:[
      {id:'spin-t2a', title:'Zwei Basiszustände, ein Spinor',
        pre:{from:'form', seg:'form-t1', title:'Der Ket als Spalte', text:R`In einer Basis $|1\rangle, |2\rangle$ wird ein Ket zur Spalte seiner Vorfaktoren: $c_1|1\rangle + c_2|2\rangle \doteq (c_1;\ c_2)$. Normiert heißt $|c_1|^2 + |c_2|^2 = 1$. Mini-Beispiel: $\tfrac35|1\rangle + \tfrac{4i}{5}|2\rangle \doteq (\tfrac35;\ \tfrac{4i}{5})$.`},
        num:{title:R`Der Zustand $\chi$`, text:R`Ein Spin sei im Zustand $|\chi\rangle = \tfrac{1}{\sqrt5}\left(|\uparrow\rangle + 2i\,|\downarrow\rangle\right)$. Als Spalte:

$$|\chi\rangle \doteq \frac{1}{\sqrt5}\begin{pmatrix}1\\ 2i\end{pmatrix},\qquad |a|^2 + |b|^2 = \tfrac15 + \tfrac45 = 1.$$

Dieser Zustand begleitet dich durch das ganze Thema.`},
        text:R`Für den Spin allein brauchst du keine Wellenfunktion $\psi(x)$. Eine Messung von $S_z$ hat nur zwei Ergebnisse, $+\hbar/2$ und $-\hbar/2$. Zu jedem gehört ein Eigenzustand, $|\uparrow\rangle$ und $|\downarrow\rangle$, gelesen „Spin auf“ und „Spin ab“. Sie sind orthonormal und bilden eine Basis eines zweidimensionalen [[lex:hilbertraum|Hilbertraums]] $\mathbb C^2$:

$$|\uparrow\rangle \doteq \binom10,\qquad |\downarrow\rangle \doteq \binom01.$$

Jeder Spinzustand ist eine Überlagerung $a|\uparrow\rangle + b|\downarrow\rangle \doteq \binom ab$ mit $|a|^2 + |b|^2 = 1$, ein [[lex:spinor|Spinor]].`,
        q:{q:R`Welche Spalte gehört zu $\tfrac{1}{\sqrt2}\left(|\uparrow\rangle - i\,|\downarrow\rangle\right)$?`, tr:{from:'dirac', to:'matrix'},
          opts:[R`$\tfrac{1}{\sqrt2}\binom{-i}{1}$`, R`$\tfrac{1}{\sqrt2}\binom{1}{-i}$`, R`$\tfrac{1}{\sqrt2}\binom{1}{i}$`], a:1,
          ex:R`Der Vorfaktor von $|\uparrow\rangle$ kommt nach oben, der von $|\downarrow\rangle$ nach unten, ohne Konjugation.`,
          fb:[R`Die Reihenfolge folgt der Basis: oben $|\uparrow\rangle$, unten $|\downarrow\rangle$.`, '',
            R`Im Ket wird nicht konjugiert. Das $-i$ bleibt, wie es dasteht.`]}},
      {id:'spin-t2b', title:R`Wahrscheinlichkeiten für $S_z$`,
        pre:{from:'form', seg:'form-t3', title:'Born-Regel', text:R`Die Messung liefert den Eigenwert $a_n$ mit der Wahrscheinlichkeit $|\langle a_n|\psi\rangle|^2$. Der Bra ist die konjugierte Zeile. Mini-Beispiel: $\langle 1|\psi\rangle$ ist die erste Komponente, $|\langle 1|\psi\rangle|^2$ ihr Betragsquadrat.`},
        num:{title:R`Im Zustand $\chi$`, text:R`$\langle\uparrow|\chi\rangle = \tfrac{1}{\sqrt5}$ und $\langle\downarrow|\chi\rangle = \tfrac{2i}{\sqrt5}$:

$$P(\uparrow) = \tfrac15,\qquad P(\downarrow) = \left|\tfrac{2i}{\sqrt5}\right|^2 = \tfrac45,\qquad \langle S_z\rangle = \tfrac\hbar2\left(\tfrac15 - \tfrac45\right) = -\tfrac{3\hbar}{10}.$$`},
        text:R`Das [[lex:messpostulat|Messpostulat]] aus Thema 6 gilt hier in seiner einfachsten Form: $P(S_z = +\hbar/2) = |\langle\uparrow|\chi\rangle|^2 = |a|^2$ und $P(S_z = -\hbar/2) = |b|^2$. Der Bra ist $\langle\chi| = (a^*, b^*)$; im [[lex:skalarprodukt|Skalarprodukt]] werden die Komponenten des linken Vektors konjugiert. Der Erwartungswert ist

$$\langle S_z\rangle = \frac\hbar2\left(|a|^2 - |b|^2\right).$$

Die Phase von $b$ spielt für $S_z$ keine Rolle; es zählt nur ihr Betrag. Für andere Richtungen ändert sich das, wie Abschnitt 4 zeigt.`,
        derive:{ctx:SPIN({states:{χ:'(1; 2i)/sqrt(5)'}, state:'χ'}), lines:[
          {l:'⟨χ|χ⟩ = 1', w:'Bra mit konjugierten Komponenten: normiert'},
          {l:'|⟨↑|χ⟩|^2 = 1/5', w:'Born-Regel für S_z = +ħ/2',
            why:{q:'Warum ist das $\\tfrac15$ und nicht $\\tfrac{1}{\\sqrt5}$?', opts:['weil $P$ das Betragsquadrat der Amplitude ist', 'weil die Phase $i$ beim Quadrieren herausfällt', 'weil $\\tfrac{1}{\\sqrt5}$ allein nicht normiert ist'], a:0, ex:'$\\langle\\uparrow|\\chi\\rangle = 1/\\sqrt5$ ist die Amplitude, ihr Quadrat $1/5$ die Wahrscheinlichkeit.'}},
          {l:'|⟨↓|χ⟩|^2 = 4/5', w:'Born-Regel für S_z = −ħ/2'},
          {l:'ħ/2 · 1/5 - ħ/2 · 4/5 = -3ħ/10', w:'Mittelwert der beiden Messwerte',
            why:{q:'Kann eine einzelne Messung $-\\tfrac{3\\hbar}{10}$ ergeben?', opts:['Nein, nur $+\\hbar/2$ oder $-\\hbar/2$.', 'Ja, $-\\tfrac{3\\hbar}{10}$ ist der häufigste Wert.', 'Ja, aber seltener als $\\pm\\hbar/2$.'], a:0, ex:'Das ist der Erwartungswert, ein Mittel über viele Messungen.'}}
        ]},
        q:{q:R`Was ist $\langle S_z\rangle$ im Zustand $\tfrac{1}{\sqrt5}\left(2|\uparrow\rangle - i\,|\downarrow\rangle\right)$?`,
          opts:[R`$-\tfrac{3\hbar}{10}$`, R`$+\tfrac{3\hbar}{10}$`, R`$\tfrac\hbar2\cdot\tfrac{2 - 1}{\sqrt5}$`], a:1,
          ex:R`$P(\uparrow) = \tfrac45$, $P(\downarrow) = \tfrac15$, also $\langle S_z\rangle = \tfrac\hbar2\left(\tfrac45 - \tfrac15\right) = +\tfrac{3\hbar}{10}$.`,
          fb:[R`Hier hat $|\uparrow\rangle$ das größere Gewicht $\tfrac45$. Das Vorzeichen ist positiv.`, '',
            R`Gewichtet wird mit den Betragsquadraten $|a|^2, |b|^2$, nicht mit den Amplituden.`]}},
      {id:'spin-t2c', title:'Globale und relative Phase',
        pre:{from:'m-komplex', seg:'mk-t2', title:'Polarform', text:R`Jede komplexe Zahl ist $z = |z|\,e^{i\varphi}$, und $|e^{i\varphi}| = 1$. Ein Faktor $e^{i\alpha}$ dreht nur die Phase und lässt den Betrag fest. Mini-Beispiel: $2i = 2\,e^{i\pi/2}$, also $|2i| = 2$.`},
        num:{title:'Zwei Zustände mit gleichem $S_z$-Verhalten', text:R`$-|\chi\rangle$ und $i|\chi\rangle$ geben dieselben Wahrscheinlichkeiten wie $|\chi\rangle$. Dagegen haben $\tfrac{1}{\sqrt2}(|\uparrow\rangle + |\downarrow\rangle)$ und $\tfrac{1}{\sqrt2}(|\uparrow\rangle - |\downarrow\rangle)$ zwar beide $P(\uparrow) = \tfrac12$, aber

$$\tfrac12\,(1, 1)\binom{1}{-1} = 0:$$

Sie sind orthogonal, also verschiedene Zustände.`},
        text:R`Wie viele Zahlen beschreiben einen Spin? Zwei komplexe Zahlen sind vier reelle. Die Normierung nimmt eine weg. Eine weitere ist ohne Bedeutung: Ein gemeinsamer Faktor $e^{i\alpha}$ ändert keine Wahrscheinlichkeit $|\langle\varphi|\chi\rangle|^2$. Man nennt ihn [[lex:globale-phase|globale Phase]]. Es bleiben zwei reelle Zahlen. Die Phase *zwischen* $a$ und $b$, die relative Phase, ist dagegen messbar. Sie entscheidet, wie sich die beiden Anteile überlagern. Eine Messung in $x$-Richtung (Abschnitt 4) unterscheidet die Zustände aus dem Beispiel sicher.`,
        q:{q:R`Welche beiden Zustände sind physikalisch gleich?`,
          opts:[R`$|\uparrow\rangle + |\downarrow\rangle$ und $|\uparrow\rangle - |\downarrow\rangle$, je normiert`, R`$|\uparrow\rangle$ und $|\downarrow\rangle$`, R`$|\chi\rangle$ und $-|\chi\rangle$`], a:2,
          ex:R`$-1 = e^{i\pi}$ ist eine globale Phase. $|\uparrow\rangle \pm |\downarrow\rangle$ unterscheiden sich in der relativen Phase; sie sind orthogonal.`,
          fb:[R`Die beiden haben gleiche $S_z$-Wahrscheinlichkeiten, sind aber orthogonal. Die relative Phase zählt.`,
            R`$|\uparrow\rangle$ und $|\downarrow\rangle$ geben bei einer $S_z$-Messung sicher verschiedene Ergebnisse.`, '']}},
      {id:'spin-t2d', title:'Zwei Winkel: die Bloch-Kugel',
        num:{title:R`Die Winkel von $\chi$`, text:R`Aus $|\chi\rangle = \tfrac{1}{\sqrt5}|\uparrow\rangle + \tfrac{2i}{\sqrt5}|\downarrow\rangle$ liest du ab:

$$\cos\tfrac\theta2 = \tfrac{1}{\sqrt5}\ \Rightarrow\ \theta \approx 126{,}9°,\qquad e^{i\varphi}\sin\tfrac\theta2 = \tfrac{2i}{\sqrt5}\ \Rightarrow\ \varphi = 90°.$$

Probe: $\sin\tfrac\theta2 = \tfrac{2}{\sqrt5}$, und $e^{i\pi/2} = i$.`},
        text:R`Wählt man $a$ reell und $\ge 0$, lässt sich jeder Spinzustand schreiben als

$$|\chi\rangle = \cos\tfrac\theta2\,|\uparrow\rangle + e^{i\varphi}\sin\tfrac\theta2\,|\downarrow\rangle,\qquad 0\le\theta\le\pi,\quad 0\le\varphi<2\pi.$$

$(\theta, \varphi)$ sind Polar- und Azimutwinkel eines Punktes auf einer Kugel, der [[lex:bloch-kugel|Bloch-Kugel]]. $|\uparrow\rangle$ liegt am Nordpol, $|\downarrow\rangle$ am Südpol. Abschnitt 4 zeigt: Der Punkt ist genau die Richtung $\hat n$, für die $|\chi\rangle$ „Spin $+\hbar/2$ längs $\hat n$“ bedeutet. Die Herleitung prüft Normierung und $\langle S_z\rangle = \frac\hbar2\cos\theta$.`,
        derive:{ctx:SPIN({params:{θ:'pos', φ:'pos', α:'pos'}, states:{χ:'cos(θ/2)|↑⟩ + e^(iφ) sin(θ/2)|↓⟩'}, state:'χ'}), lines:[
          {l:'⟨χ|χ⟩ = cos(θ/2)^2 + |e^(iφ)|^2 sin(θ/2)^2', w:'Bra mit konjugierten Komponenten',
            why:{q:'Warum steht hier $|e^{i\\varphi}|^2$ und nicht $e^{2i\\varphi}$?', opts:['Das Bra enthält $(e^{i\\varphi})^*$, und das Produkt ist $1$.', 'Phasen darf man beim Quadrieren immer weglassen.', 'Weil $\\varphi$ auf der Kugel nur bis $2\\pi$ läuft.'], a:0, ex:'$\\langle\\chi| = (\\cos\\frac\\theta2,\\ e^{-i\\varphi}\\sin\\frac\\theta2)$. Ohne Konjugation stünde $e^{2i\\varphi}$ da, und die Norm wäre keine reelle Zahl.'}},
          {l:'= 1', w:'$\\cos^2 + \\sin^2 = 1$'},
          {l:'⟨S_z⟩ = ħ/2 (cos(θ/2)^2 - sin(θ/2)^2)', w:'$\\frac\\hbar2(|a|^2 - |b|^2)$'},
          {l:'= ħ/2 cos(θ)', w:'Doppelwinkelformel',
            why:{q:'Welche Formel steckt in diesem Schritt?', opts:['$\\cos^2\\frac\\theta2 - \\sin^2\\frac\\theta2 = \\cos\\theta$', '$\\cos^2\\frac\\theta2 + \\sin^2\\frac\\theta2 = 1$', '$2\\sin\\frac\\theta2\\cos\\frac\\theta2 = \\sin\\theta$'], a:0, ex:'Doppelwinkelformel für den Kosinus. Für $\\theta = 0$ (Nordpol) ist $\\langle S_z\\rangle = +\\hbar/2$, für $\\theta = \\pi$ (Südpol) $-\\hbar/2$.'}},
          {l:'|⟨↑|e^(iα) χ⟩|^2 = |⟨↑|χ⟩|^2', w:'globale Phase ändert nichts',
            why:{q:'Was zeigt diese Zeile?', opts:['Ein gemeinsamer Phasenfaktor ändert keine Wahrscheinlichkeit.', 'Die relative Phase zwischen $a$ und $b$ ist unwichtig.', 'Der Zustand $e^{i\\alpha}|\\chi\\rangle$ ist nicht normiert.'], a:0, ex:'$|e^{i\\alpha}z|^2 = |z|^2$. Das gilt nur für einen *gemeinsamen* Faktor. Eine Phase zwischen den Komponenten ändert dagegen die Wahrscheinlichkeiten für $S_x$ und $S_y$.'}}
        ]},
        q:{q:R`Welche Winkel gehören zu $\tfrac{1}{\sqrt2}\left(|\uparrow\rangle + i\,|\downarrow\rangle\right)$?`,
          opts:[R`$\theta = \pi/4$, $\varphi = \pi/2$`, R`$\theta = \pi/2$, $\varphi = \pi/2$`, R`$\theta = \pi/2$, $\varphi = \pi$`], a:1,
          ex:R`$\cos\tfrac\theta2 = \tfrac{1}{\sqrt2}$ gibt $\theta = \pi/2$, und $e^{i\varphi} = i$ gibt $\varphi = \pi/2$.`,
          fb:[R`In der Formel steht der halbe Winkel: $\cos\tfrac\theta2 = \tfrac{1}{\sqrt2}$ heißt $\tfrac\theta2 = \tfrac\pi4$.`, '',
            R`$e^{i\pi} = -1$. Der Faktor $i$ ist $e^{i\pi/2}$.`]}},
      {id:'spin-t2e', title:'Ein Spinzustand in fünf Gestalten',
        num:{title:'Labor für $\\chi$', text:R`Für $\chi$ stellst du im Labor $\theta \approx 2{,}21$ und $\varphi \approx 1{,}57$ ein, im Bogenmaß. Der erste Balken zeigt dann

$$P(\uparrow z) = \cos^2\tfrac\theta2 = \tfrac15 = 0{,}20,$$

die Anzeige $\langle S_z\rangle = \tfrac\hbar2\cos\theta = -0{,}300\,\hbar$.`},
        text:R`Jetzt verbindest du alle Gestalten eines Spinzustands. Der Ket legt sich auf keine Darstellung fest. In der Basis $|\uparrow\rangle, |\downarrow\rangle$ ist er eine Spalte. Die beiden Winkel $\theta, \varphi$ machen aus ihm einen Punkt auf der Bloch-Kugel, und genau diese Winkel stellst du im Labor mit den Reglern ein. Die Messwahrscheinlichkeiten für $S_z$ hängen nur von $\theta$ ab. Die Tafel geht den Weg für $\chi$ und gibt zu jedem Schritt die Rechenregel an.`,
        reps:{obj:R`Der Spinzustand $\chi$`,
          rows:[
            {k:'worte', text:R`Ein Spin, der eher nach unten als nach oben weist: $S_z = -\hbar/2$ in vier von fünf Messungen, mit einer relativen Phase $i$.`},
            {k:'dirac', tex:R`|\chi\rangle = \tfrac{1}{\sqrt5}\left(|\uparrow\rangle + 2i\,|\downarrow\rangle\right)`},
            {k:'matrix', tex:R`|\chi\rangle \doteq \frac{1}{\sqrt5}\begin{pmatrix}1\\ 2i\end{pmatrix} = \begin{pmatrix}\cos\frac\theta2\\ e^{i\varphi}\sin\frac\theta2\end{pmatrix}\quad\text{mit } \theta \approx 126{,}9°,\ \varphi = 90°`},
            {k:'labor', text:R`Regler Polarwinkel $\theta \approx 2{,}21$, Azimut $\varphi \approx 1{,}57$. Der Pfeil zeigt unter die Äquatorebene und nach rechts; dort liegt im Bild die $+y$-Richtung.`},
            {k:'physik', text:R`$P(S_z = +\hbar/2) = 0{,}20$, $P(S_z = -\hbar/2) = 0{,}80$, $\langle S_z\rangle = -0{,}3\,\hbar$. Bei 100 Teilchen im $z$-Magneten etwa 20 oben, 80 unten.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Vier von fünf unten“ heißt $|b|^2 = \tfrac45$; die relative Phase $i$ kommt als Faktor vor $|\downarrow\rangle$.`},
            {from:'dirac', to:'matrix', rule:R`Vorfaktor von $|\uparrow\rangle$ nach oben, von $|\downarrow\rangle$ nach unten. Dann oben $\cos\tfrac\theta2$, unten $e^{i\varphi}\sin\tfrac\theta2$ ablesen.`},
            {from:'matrix', to:'labor', rule:R`$\theta = 2\arccos|a|$ und $\varphi$ = Phase von $b$ relativ zu $a$ berechnen und in die Regler eintragen (Bogenmaß).`},
            {from:'labor', to:'physik', rule:R`Den Balken $P(\uparrow z)$ ablesen; er ist $\cos^2(\theta/2)$ und hängt nicht von $\varphi$ ab.`}
          ]},
        q:{q:R`Im Labor stehen die Regler auf $\theta = \pi/3$ und $\varphi = 0$. Welchen Wert zeigt der Balken $P(\uparrow z)$?`, tr:{from:'labor', to:'physik'},
          opts:[R`$0{,}50$`, R`$0{,}75$`, R`$0{,}87$`], a:1,
          ex:R`$P(\uparrow z) = \cos^2\tfrac\theta2 = \cos^2 30° = \tfrac34$.`,
          fb:[R`$0{,}50$ gehört zu $\theta = \pi/2$, dem Äquator.`, '',
            R`$0{,}87 \approx \cos30°$ ist die Amplitude. Der Balken zeigt ihr Quadrat.`]}},
      {id:'spin-t2f', title:'Typischer Fehler: orthogonal im Hilbertraum, entgegengesetzt im Raum',
        num:{title:'Nordpol und Südpol', text:R`Im $\mathbb C^2$ ist

$$\langle\uparrow|\downarrow\rangle = (1, 0)\binom01 = 0:$$

ein rechter Winkel zwischen den Zustandsvektoren. Auf der Bloch-Kugel liegen $|\uparrow\rangle$ und $|\downarrow\rangle$ aber an Nord- und Südpol, $180°$ auseinander, und im Raum gehören sie zu $+z$ und $-z$.`},
        text:R`Der Hilbertraum ist nicht der Raum, in dem der Spin „zeigt“. $|\uparrow\rangle$ und $|\downarrow\rangle$ stehen im $\mathbb C^2$ senkrecht aufeinander. Im Ortsraum gehören sie aber zu *entgegengesetzten* Richtungen. Daher steht $\theta/2$ in den Komponenten: Zum Winkel $\theta$ zwischen zwei Raumrichtungen gehört der halbe Winkel $\theta/2$ zwischen den Zustandsvektoren, $|\langle\chi_1|\chi_2\rangle| = \cos\frac\theta2$. Entgegengesetzte Richtungen ($180°$) geben orthogonale Zustände ($90°$). Wer beide Räume verwechselt, sagt falsche Wahrscheinlichkeiten voraus.`,
        q:{q:R`Zwei Spinzustände sind zueinander orthogonal. Was gilt für ihre Richtungen auf der Bloch-Kugel?`,
          opts:[R`Sie stehen senkrecht aufeinander.`, R`Sie zeigen in entgegengesetzte Richtungen.`, R`Sie zeigen in dieselbe Richtung.`], a:1,
          ex:R`$|\langle\chi_1|\chi_2\rangle| = \cos\tfrac\theta2 = 0$ verlangt $\theta = 180°$.`,
          fb:[R`Senkrecht auf der Kugel heißt $\theta = 90°$ und $|\langle\chi_1|\chi_2\rangle| = \cos45° \ne 0$.`, '',
            R`Dieselbe Richtung heißt derselbe Zustand, mit Überlapp $1$.`]}}
    ]},

    /* ===== Abschnitt 3: Spinoperatoren, Pauli-Matrizen ===== */
    {id:'spin-t3', title:'Die Spinoperatoren und die Pauli-Matrizen', steps:[
      {id:'spin-t3a', title:R`$\hat S_z$ ist diagonal`,
        pre:{from:'m-eigen', seg:'me-t5', title:'Diagonal in der Eigenbasis', text:R`In der Basis ihrer Eigenvektoren ist eine Matrix diagonal, mit den Eigenwerten auf der Diagonale. Die Reihenfolge der Eigenwerte folgt der Reihenfolge der Basis. Mini-Beispiel: Eigenvektoren $e_1, e_2$ zu $3$ und $-1$ geben $\mathrm{diag}(3, -1)$.`},
        num:{title:R`$\hat S_z$ an $\chi$`, text:R`$\hat S_z\chi = \frac\hbar2\begin{pmatrix}1&0\\0&-1\end{pmatrix}\frac{1}{\sqrt5}\binom{1}{2i} = \frac{\hbar}{2\sqrt5}\binom{1}{-2i}$. Mit dem Bra $\tfrac{1}{\sqrt5}(1,\ -2i)$:

$$\langle\chi|\hat S_z|\chi\rangle = \frac{\hbar}{2}\cdot\frac{1 + (-2i)(-2i)}{5} = \frac\hbar2\cdot\frac{1 - 4}{5} = -\frac{3\hbar}{10}.$$

Dasselbe wie mit den Wahrscheinlichkeiten in Abschnitt 2.`},
        text:R`Zu jeder Spinkomponente gehört ein [[lex:hermitescher-operator|hermitescher Operator]], im $\mathbb C^2$ also eine hermitesche $2\times2$-Matrix. Drei Forderungen legen sie fest. Erstens hat $\hat S_z$ die Eigenzustände $|\uparrow\rangle, |\downarrow\rangle$ zu $\pm\hbar/2$. Zweitens gilt dieselbe [[lex:drehimpuls-algebra|Drehimpuls-Algebra]] wie in Thema 8: $[\hat S_x, \hat S_y] = i\hbar\hat S_z$ und zyklisch. Drittens ist $\hat S^2 = \tfrac34\hbar^2$ für jeden Zustand, weil $s(s+1) = \tfrac34$. Aus der ersten Forderung folgt sofort

$$\hat S_z \doteq \frac\hbar2\begin{pmatrix}1&0\\0&-1\end{pmatrix}.$$`,
        q:{q:R`Welche Matrix hat $\hat S_z$, wenn du die Basis umgekehrt ordnest, also $|\downarrow\rangle$ zuerst?`, tr:{from:'dirac', to:'matrix'},
          opts:[R`$\tfrac\hbar2\begin{pmatrix}1&0\\0&-1\end{pmatrix}$, wie vorher`, R`$\tfrac\hbar2\begin{pmatrix}-1&0\\0&1\end{pmatrix}$`, R`$\tfrac\hbar2\begin{pmatrix}0&1\\1&0\end{pmatrix}$`], a:1,
          ex:R`Der erste Basisket ist jetzt $|\downarrow\rangle$ mit dem Eigenwert $-\hbar/2$. Er steht oben links.`,
          fb:[R`Die Matrix hängt von der Basis ab. Mit $|\downarrow\rangle$ zuerst wandert $-\hbar/2$ nach oben links.`, '',
            R`Umsortieren der Eigenbasis macht keine Nebendiagonale; die Matrix bleibt diagonal.`]}},
      {id:'spin-t3b', title:R`$\hat S_x$ und $\hat S_y$ aus der Leiter`,
        pre:{from:'dreh', seg:'dreh-t4', title:'Leiterfaktoren', text:R`$\hat J_+|j,m\rangle = \hbar\sqrt{j(j+1) - m(m+1)}\,|j,m+1\rangle$, und $\hat J_+$ ergibt null auf der obersten Sprosse. Mini-Beispiel: $\hat L_+|1,0\rangle = \sqrt2\,\hbar\,|1,1\rangle$.`},
        num:{title:R`$s = \tfrac12$, $m = -\tfrac12$`, text:R`Der Leiterfaktor ist

$$\hbar\sqrt{\tfrac12\cdot\tfrac32 - \left(-\tfrac12\right)\cdot\tfrac12} = \hbar\sqrt{\tfrac34 + \tfrac14} = \hbar.$$

Also $\hat S_+|\downarrow\rangle = \hbar|\uparrow\rangle$ und $\hat S_+|\uparrow\rangle = 0$, denn höher geht es nicht.`},
        text:R`Aus Thema 8 kennst du die [[lex:drehimpuls-leiter|Leiteroperatoren]] $\hat S_\pm = \hat S_x \pm i\hat S_y$. Ihre Matrizen folgen aus den Bildern der Basisvektoren: Die Spalten einer Matrix sind die Bilder der Basiskets. Daraus erhältst du $\hat S_x = \frac12(\hat S_+ + \hat S_-)$ und $\hat S_y = \frac{1}{2i}(\hat S_+ - \hat S_-)$. Die Herleitung geht Zeile für Zeile durch und prüft am Ende die Forderungen 2 und 3. Weil $\hat S^2$ ein Vielfaches der Einheitsmatrix ist, hat jeder Spinor $s = \tfrac12$.`,
        derive:{ctx:SPIN(), lines:[
          {l:'S_+ = ħ (0, 1; 0, 0)', w:R`$\hat S_+|\downarrow\rangle = \hbar|\uparrow\rangle$, $\hat S_+|\uparrow\rangle = 0$`,
            why:{q:'Warum steht das $\\hbar$ rechts oben?', opts:['Die 2. Spalte ist das Bild von $|\\downarrow\\rangle$, also $\\hbar|\\uparrow\\rangle$.', 'Die 1. Spalte ist das Bild von $|\\uparrow\\rangle$, also $\\hbar|\\downarrow\\rangle$.', 'Weil $\\hat S_+$ hermitesch und damit symmetrisch ist.'], a:0, ex:'Spalte $j$ einer Matrix ist das Bild des $j$-ten Basisvektors. $\\hat S_+$ ist nicht hermitesch: $\\hat S_+^\\dagger = \\hat S_-$.'}},
          {l:'S_- = ħ (0, 0; 1, 0)', w:R`$\hat S_- = \hat S_+^\dagger$`},
          {l:'S_x = 1/2 (S_+ + S_-)', w:R`aus $\hat S_\pm = \hat S_x \pm i\hat S_y$`,
            why:{q:'Warum ist $\\hat S_x$ die halbe Summe?', opts:['Weil $\\hat S_+ + \\hat S_- = 2\\hat S_x$ ist; die $i\\hat S_y$ heben sich weg.', 'Weil $\\hat S_x$ der Mittelwert von $\\hat S_+$ und $\\hat S_-$ als Messwert ist.', 'Weil $\\hat S_+$ und $\\hat S_-$ hermitesch sind.'], a:0, ex:'$(\\hat S_x + i\\hat S_y) + (\\hat S_x - i\\hat S_y) = 2\\hat S_x$.'}},
          {l:'= ħ/2 (0, 1; 1, 0)', w:'Matrizen addiert'},
          {l:'S_y = 1/(2i) (S_+ - S_-)', w:'Differenz der Leiteroperatoren'},
          {l:'= ħ/2 (0, -i; i, 0)', w:R`$\frac{1}{i} = -i$`,
            why:{q:'Woher kommt das $-i$ rechts oben?', opts:['Aus $\\frac{\\hbar}{2i} = -\\frac{i\\hbar}{2}$.', 'Aus der Konjugation im Bra.', 'Aus $\\sigma_y = \\sigma_z\\sigma_x$.'], a:0, ex:'$\\hat S_+ - \\hat S_- = \\hbar\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$, geteilt durch $2i$ gibt $\\frac\\hbar2\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$. (Es gilt $\\sigma_z\\sigma_x = i\\sigma_y$, nicht $\\sigma_y$.)'}},
          {l:'[S_x, S_y] = iħ S_z', w:'Forderung 2'},
          {l:'S_x^2 + S_y^2 + S_z^2 = 3/4 ħ^2 I', w:'Forderung 3',
            why:{q:'Was bedeutet diese Zeile?', opts:['Jeder Spinzustand ist Eigenzustand von $\\hat S^2$ mit $s = \\frac12$.', 'Der Spin hat in jeder Richtung den Wert $\\frac{\\sqrt3}2\\hbar$.', 'Nur $|\\uparrow\\rangle$ und $|\\downarrow\\rangle$ haben $s = \\frac12$.'], a:0, ex:'$\\hat S^2$ ist ein Vielfaches der Einheitsmatrix, also hat jeder Spinor $s(s+1)\\hbar^2 = \\frac34\\hbar^2$. Eine einzelne Komponente liefert trotzdem nur $\\pm\\hbar/2$.'}}
        ]},
        q:{q:R`Was ist $\hat S_x|\uparrow\rangle$?`,
          opts:[R`$\frac\hbar2|\uparrow\rangle$`, R`$\frac\hbar2|\downarrow\rangle$`, R`$0$`], a:1,
          ex:R`$\sigma_x$ vertauscht die Komponenten. $|\uparrow\rangle$ ist also kein Eigenzustand von $\hat S_x$.`,
          fb:[R`Das gälte, wenn $|\uparrow\rangle$ Eigenzustand von $\hat S_x$ wäre. $\hat S_x$ ist aber nicht diagonal.`, '',
            R`Null ergibt $\hat S_+|\uparrow\rangle$. $\hat S_x$ enthält auch $\hat S_-$, und $\hat S_-|\uparrow\rangle = \hbar|\downarrow\rangle$.`]}},
      {id:'spin-t3c', title:'Die Pauli-Matrizen',
        num:{title:R`$\sigma_x\sigma_y$ ausgerechnet`, text:R`Zeile mal Spalte:

$$\begin{pmatrix}0&1\\1&0\end{pmatrix}\begin{pmatrix}0&-i\\i&0\end{pmatrix} = \begin{pmatrix}i&0\\0&-i\end{pmatrix} = i\,\sigma_z.$$

In umgekehrter Reihenfolge kommt $-i\,\sigma_z$ heraus.`},
        text:R`Man schreibt $\hat S_i = \frac\hbar2\sigma_i$ mit den [[lex:pauli|Pauli-Matrizen]]

$$\sigma_x = \begin{pmatrix}0&1\\1&0\end{pmatrix},\quad \sigma_y = \begin{pmatrix}0&-i\\i&0\end{pmatrix},\quad \sigma_z = \begin{pmatrix}1&0\\0&-1\end{pmatrix}.$$

Sie sind hermitesch, haben die Spur $0$ und die Eigenwerte $\pm1$. Ihre Rechenregeln sind kurz: $\sigma_i^2 = \mathbb 1$ und $\sigma_x\sigma_y = i\sigma_z = -\sigma_y\sigma_x$, zyklisch. Daraus folgt sofort $[\hat S_x, \hat S_y] = \frac{\hbar^2}{4}\cdot 2i\sigma_z = i\hbar\hat S_z$. Mit diesen Regeln rechnest du fast alles im Kopf. Weil $\hat S_x$ nicht diagonal ist, hat ein Zustand mit festem $S_z$ kein festes $S_x$; nach der [[lex:robertson|Robertson-Relation]] ist $\Delta S_x\,\Delta S_y \ge \frac\hbar2|\langle S_z\rangle|$.`,
        q:{q:R`Was ist $\sigma_y\sigma_x$?`,
          opts:[R`$i\sigma_z$`, R`$\mathbb 1$`, R`$-i\sigma_z$`], a:2,
          ex:R`Pauli-Matrizen antivertauschen: $\sigma_y\sigma_x = -\sigma_x\sigma_y = -i\sigma_z$.`,
          fb:[R`Das ist $\sigma_x\sigma_y$. Vertauschte Reihenfolge dreht das Vorzeichen.`,
            R`$\mathbb 1$ ergibt nur das Quadrat einer Pauli-Matrix, etwa $\sigma_x\sigma_x$.`, '']}},
      {id:'spin-t3d', title:R`Der Operator $\hat S_x$ in vier Gestalten`,
        num:{title:R`$\hat S_x$ an $\chi$`, text:R`$\hat S_x\chi = \frac\hbar2\begin{pmatrix}0&1\\1&0\end{pmatrix}\frac{1}{\sqrt5}\binom{1}{2i} = \frac{\hbar}{2\sqrt5}\binom{2i}{1}$. Mit dem Bra:

$$\langle\chi|\hat S_x|\chi\rangle = \frac{\hbar}{2}\cdot\frac{1\cdot2i + (-2i)\cdot1}{5} = 0.$$

$\chi$ hat also $\langle S_x\rangle = 0$, obwohl $\langle S_z\rangle \ne 0$ ist.`},
        text:R`Ein Operator hat wie ein Zustand mehrere Gestalten. In Dirac-Form sagst du, was er mit den Basiskets macht. Als Matrix schreibst du diese Bilder als Spalten. Für einen Erwartungswert bildest du Zeile mal Matrix mal Spalte. Für die Messung brauchst du die Eigenwerte und Eigenvektoren der Matrix. Die Tafel zeigt den Weg für $\hat S_x$ und eine Formel, mit der du $\langle S_x\rangle$ ohne Matrizen sofort ausrechnest.`,
        reps:{obj:R`Der Operator $\hat S_x$`,
          rows:[
            {k:'worte', text:R`$\hat S_x$ vertauscht die beiden Komponenten und multipliziert mit $\hbar/2$.`},
            {k:'dirac', tex:R`\hat S_x|\uparrow\rangle = \tfrac\hbar2|\downarrow\rangle,\qquad \hat S_x|\downarrow\rangle = \tfrac\hbar2|\uparrow\rangle`},
            {k:'matrix', tex:R`\hat S_x \doteq \frac\hbar2\,\sigma_x = \frac\hbar2\begin{pmatrix}0&1\\ 1&0\end{pmatrix}`},
            {k:'formel', tex:R`\langle S_x\rangle = (a^*,\ b^*)\,\frac\hbar2\begin{pmatrix}0&1\\ 1&0\end{pmatrix}\binom ab = \frac\hbar2\left(a^*b + b^*a\right) = \hbar\,\mathrm{Re}(a^*b)`},
            {k:'physik', text:R`Messwerte $\pm\hbar/2$; $\langle S_x\rangle$ hängt von der relativen Phase zwischen $a$ und $b$ ab, anders als $\langle S_z\rangle$.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Vertauscht die Komponenten“ heißt: aus $|\uparrow\rangle$ wird $|\downarrow\rangle$ und umgekehrt, je mal $\hbar/2$.`},
            {from:'dirac', to:'matrix', rule:R`Das Bild von $|\uparrow\rangle$ als erste Spalte, das von $|\downarrow\rangle$ als zweite Spalte eintragen.`},
            {from:'matrix', to:'formel', rule:R`Bra als konjugierte Zeile links, Ket als Spalte rechts, dann ausmultiplizieren.`},
            {from:'formel', to:'physik', rule:R`$a^*b$ enthält die relative Phase. Bei gleichem $|a|, |b|$ entscheidet sie über $\langle S_x\rangle$: reell und positiv gibt $+\hbar|a||b|$, rein imaginär gibt $0$.`}
          ]},
        q:{q:R`Was ist $\hat S_y|\downarrow\rangle$?`, tr:{from:'matrix', to:'dirac'},
          opts:[R`$\tfrac{i\hbar}{2}|\uparrow\rangle$`, R`$-\tfrac{i\hbar}{2}|\uparrow\rangle$`, R`$-\tfrac{i\hbar}{2}|\downarrow\rangle$`], a:1,
          ex:R`Die zweite Spalte von $\tfrac\hbar2\sigma_y$ ist $\tfrac\hbar2(-i;\ 0)$, also $-\tfrac{i\hbar}{2}|\uparrow\rangle$.`,
          fb:[R`$+i$ steht in der ersten Spalte: Das ist $\hat S_y|\uparrow\rangle = \tfrac{i\hbar}{2}|\downarrow\rangle$.`, '',
            R`Die zweite Spalte hat ihren Eintrag oben, also bei $|\uparrow\rangle$. $\hat S_y$ ist nicht diagonal.`]}},
      {id:'spin-t3e', title:'Typischer Fehler: Operator anwenden heißt nicht messen',
        num:{title:R`$\hat S_x$ an $|\uparrow\rangle$`, text:R`$\hat S_x|\uparrow\rangle = \tfrac\hbar2|\downarrow\rangle$. Wäre das der Zustand nach einer $S_x$-Messung, fände eine folgende $S_z$-Messung immer $-\hbar/2$. Tatsächlich ergibt die $S_x$-Messung $\pm\hbar/2$, je mit Wahrscheinlichkeit

$$\tfrac12,$$

und danach ist der Spin in einem Eigenzustand von $\hat S_x$ (Abschnitt 4), nicht in $|\downarrow\rangle$.`},
        text:R`Eine gut belegte Verwechslung lautet: „Messen heißt, den Operator anzuwenden“ (Singh & Marshman 2015). $\hat S_x|\uparrow\rangle$ ist ein Rechenschritt, kein Zustand nach einer Messung. Es ist nicht einmal normiert. Die Messung wählt zufällig einen Eigenwert und präpariert den zugehörigen Eigenzustand (Thema 6). Ein zweiter Fehler ist das Bild eines Pfeils der Länge $\frac{\sqrt3}{2}\hbar$, der schräg zur $z$-Achse steht. Dann hätte auch $S_x$ einen festen Wert. In $|\uparrow\rangle$ ist aber nur $\langle S_x\rangle = 0$ fest; jede einzelne Messung ergibt $\pm\hbar/2$.`,
        q:{q:R`Der Spin ist in $|\uparrow\rangle$. Du misst $S_x$. In welchem Zustand ist er danach?`,
          opts:[R`in $\tfrac\hbar2|\downarrow\rangle$, dem Ergebnis von $\hat S_x|\uparrow\rangle$`, R`unverändert in $|\uparrow\rangle$, weil die Messung nur abliest`, R`zufällig in einem der beiden Eigenzustände von $\hat S_x$`], a:2,
          ex:R`Die Messung liefert $+\hbar/2$ oder $-\hbar/2$, je mit $\tfrac12$, und präpariert den zugehörigen Eigenzustand von $\hat S_x$.`,
          fb:[R`Einen Operator anzuwenden ist keine Messung. $\tfrac\hbar2|\downarrow\rangle$ ist nicht einmal normiert.`,
            R`Eine Messung ändert den Zustand. Eine sofortige zweite $S_x$-Messung bestätigt dann das erste Ergebnis.`, '']}}
    ]},

    /* ===== Abschnitt 4: Messen in beliebiger Richtung ===== */
    {id:'spin-t4', title:'Messen in beliebiger Richtung', steps:[
      {id:'spin-t4a', title:R`Eigenzustände von $\hat S_x$ und $\hat S_y$`,
        pre:{from:'m-eigen', seg:'me-t3', title:'Eigenwerte und Eigenvektoren', text:R`Eigenwerte sind die Nullstellen von $\det(A - \lambda\mathbb 1)$. Einen Eigenvektor findest du, indem du $\lambda$ einsetzt und $(A - \lambda\mathbb 1)v = 0$ löst. Mini-Beispiel: $\begin{pmatrix}2&0\\0&5\end{pmatrix}$ hat $\lambda = 2$ und $5$.`},
        num:{title:R`$\sigma_x$`, text:R`$\det\begin{pmatrix}-\lambda&1\\1&-\lambda\end{pmatrix} = \lambda^2 - 1 = 0$ gibt $\lambda = \pm1$. Für $\lambda = +1$ verlangt $\sigma_x\binom ab = \binom ab$, also $b = a$:

$$|{+x}\rangle = \frac{1}{\sqrt2}\binom11.$$

Für $\lambda = -1$ folgt $b = -a$.`},
        text:R`Gesucht sind Messwerte und Zustände für einen Magneten in $x$-Richtung. Das [[lex:eigenwertproblem|Eigenwertproblem]] von $\sigma_x$ gibt die Messwerte $\pm\hbar/2$, wieder dieselben wie für $S_z$. Normiert, und für $\hat S_y$ genauso, erhältst du die [[lex:spin-eigenzustaende|Eigenzustände der Spinkomponenten]]

$$|{\pm x}\rangle = \tfrac{1}{\sqrt2}\big(|\uparrow\rangle \pm |\downarrow\rangle\big),\qquad |{\pm y}\rangle = \tfrac{1}{\sqrt2}\big(|\uparrow\rangle \pm i|\downarrow\rangle\big).$$

Gelesen „plus x“, „minus x“ und so weiter. Auf der Bloch-Kugel liegen sie am Äquator, bei $\varphi = 0, \pi$ und $\varphi = \pi/2, 3\pi/2$.`,
        derive:{ctx:SPIN(), lines:[
          {l:'det(σ_x - I) = 0', w:R`$+1$ ist Eigenwert von $\sigma_x$`},
          {l:'S_x |+x⟩ = ħ/2 |+x⟩', w:R`$|{+x}\rangle$ ist Eigenzustand zu $+\hbar/2$`,
            why:{q:'Warum gehört zu $\\sigma_x$ der Eigenvektor mit $b = a$?', opts:['Weil $\\sigma_x$ die Komponenten tauscht, was $(a;\\ a)$ nicht ändert.', 'Weil $\\sigma_x$ reell und symmetrisch ist und deshalb passt.', 'Weil jeder normierte Vektor ein Eigenvektor ist.'], a:0, ex:'$\\sigma_x\\binom aa = \\binom aa$. Bei $b = -a$ kehrt sich das Vorzeichen um: Eigenwert $-1$.'}},
          {l:'S_y |+y⟩ = ħ/2 |+y⟩', w:R`ebenso für $\hat S_y$`}
        ]},
        q:{q:R`Welcher Ket ist Eigenvektor von $\sigma_y$ zum Eigenwert $-1$?`, tr:{from:'matrix', to:'dirac'},
          opts:[R`$\tfrac{1}{\sqrt2}\left(|\uparrow\rangle - |\downarrow\rangle\right)$`, R`$\tfrac{1}{\sqrt2}\left(|\uparrow\rangle + i|\downarrow\rangle\right)$`, R`$\tfrac{1}{\sqrt2}\left(|\uparrow\rangle - i|\downarrow\rangle\right)$`], a:2,
          ex:R`$\sigma_y\binom{1}{-i} = \binom{-i\cdot(-i)}{i\cdot1} = \binom{-1}{i} = -\binom{1}{-i}$. Das ist $|{-y}\rangle$.`,
          fb:[R`Das ist $|{-x}\rangle$, Eigenvektor von $\sigma_x$.`,
            R`Das ist $|{+y}\rangle$ zum Eigenwert $+1$.`, '']}},
      {id:'spin-t4b', title:'Spin längs einer beliebigen Richtung',
        num:{title:R`$\hat n = \hat x$`, text:R`Für $\theta = \pi/2$, $\varphi = 0$ ist $\hat n = (1, 0, 0)$. Die Matrix unten wird

$$\hat S_{\hat n} = \frac\hbar2\begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix} = \hat S_x,$$

und der Bloch-Zustand $\cos\frac\pi4|\uparrow\rangle + \sin\frac\pi4|\downarrow\rangle$ ist genau $|{+x}\rangle$.`},
        text:R`Für einen Einheitsvektor $\hat n = (\sin\theta\cos\varphi, \sin\theta\sin\varphi, \cos\theta)$ ist die Spinkomponente längs $\hat n$

$$\hat S_{\hat n} = \hat n\cdot\hat{\mathbf S} = \frac\hbar2\begin{pmatrix}\cos\theta & \sin\theta\,e^{-i\varphi}\\ \sin\theta\,e^{i\varphi} & -\cos\theta\end{pmatrix}.$$

Ihre Eigenwerte sind für jede Richtung $\pm\hbar/2$: Spur $0$, Determinante $-\hbar^2/4$. Der Eigenzustand zu $+\hbar/2$ ist genau der Bloch-Zustand mit denselben Winkeln; die Herleitung prüft das. Damit ist die [[lex:bloch-kugel|Bloch-Kugel]] erklärt: **Jeder Spinzustand ist „Spin $+\hbar/2$“ längs irgendeiner Richtung.**`,
        derive:{ctx:SPIN({params:{θ:'pos', φ:'pos'}, mat:{preset:'spin', mats:{S_n:'ħ/2 (cos(θ), sin(θ) e^(-iφ); sin(θ) e^(iφ), -cos(θ))'}}, states:{χ:'cos(θ/2)|↑⟩ + e^(iφ) sin(θ/2)|↓⟩'}}), lines:[
          {l:'S_n = sin(θ) cos(φ) S_x + sin(θ) sin(φ) S_y + cos(θ) S_z', w:R`$\hat S_{\hat n} = \hat n\cdot\hat{\mathbf S}$`,
            why:{q:'Woher kommen die Vorfaktoren?', opts:['Es sind die Komponenten $n_x, n_y, n_z$ des Einheitsvektors.', 'Es sind die Wahrscheinlichkeiten für $x$, $y$, $z$.', 'Es sind die Eigenwerte der drei Matrizen.'], a:0, ex:'$\\hat n\\cdot\\hat{\\mathbf S} = n_x\\hat S_x + n_y\\hat S_y + n_z\\hat S_z$ mit den Kugelkoordinaten von $\\hat n$.'}},
          {l:'det(S_n - ħ/2 I) = 0', w:R`$+\hbar/2$ ist Eigenwert`,
            why:{q:'Was zeigt diese Zeile?', opts:['$+\\hbar/2$ ist für jede Richtung ein Eigenwert von $\\hat S_{\\hat n}$.', 'Der Bloch-Zustand $\\chi$ ist für jede Richtung normiert.', 'Die Matrix $\\hat S_{\\hat n}$ hat die Determinante null.'], a:0, ex:'Eigenwerte sind Nullstellen von $\\det(\\hat S_{\\hat n} - \\lambda\\mathbb 1)$. Die Gleichung gilt für alle $\\theta, \\varphi$. Ebenso ist $-\\hbar/2$ Eigenwert.'}},
          {l:'S_n χ = ħ/2 χ', w:'Bloch-Zustand ist Eigenzustand'},
          {l:'|⟨↑|χ⟩|^2 = cos(θ/2)^2', w:'Messung in z'},
          {l:'= (1 + cos(θ))/2', w:'Doppelwinkelformel',
            why:{q:'Was folgt daraus für $\\theta = \\pi/2$?', opts:['$P = \\frac12$: Senkrechte Richtungen sind nicht orthogonal.', '$P = 0$: Senkrechte Richtungen sind orthogonal.', '$P = 1$: Der Spin zeigt sicher nach oben.'], a:0, ex:'$\\frac12(1 + \\cos 90^\\circ) = \\frac12$. Null wird $P$ erst bei $\\theta = \\pi$, also für die Gegenrichtung.'}},
          {l:'⟨↑|+x⟩ = 1/sqrt(2)', w:R`$\theta = \pi/2$, $\varphi = 0$`}
        ]},
        q:{q:R`Welcher Zustand ist „Spin $+\hbar/2$ längs $-\hat z$“, also für $\theta = \pi$?`,
          opts:[R`$|\uparrow\rangle$, mit negativem Vorzeichen`, R`$\tfrac{1}{\sqrt2}\left(|\uparrow\rangle + |\downarrow\rangle\right)$`, R`$|\downarrow\rangle$`], a:2,
          ex:R`$\cos\tfrac\pi2 = 0$ und $\sin\tfrac\pi2 = 1$: Der Bloch-Zustand ist $e^{i\varphi}|\downarrow\rangle$, bis auf die Phase $|\downarrow\rangle$.`,
          fb:[R`$-|\uparrow\rangle$ ist derselbe Zustand wie $|\uparrow\rangle$, mit $S_z = +\hbar/2$. Längs $-\hat z$ heißt $S_z = -\hbar/2$.`,
            R`Das ist $|{+x}\rangle$ am Äquator, $\theta = \pi/2$.`, '']}},
      {id:'spin-t4c', title:'Die Bloch-Kugel: Richtung, Zustand, Wahrscheinlichkeit',
        num:{title:R`Die Richtung von $\chi$`, text:R`Mit $\theta \approx 126{,}9°$ und $\varphi = 90°$ ist $\hat n = (0;\ 0{,}8;\ -0{,}6)$. Die Wahrscheinlichkeit für $+\hbar/2$ längs einer Achse ist $\frac12(1 + n_{\text{Achse}})$:

$$\begin{aligned}P(\uparrow z) &= \tfrac12(1 - 0{,}6) = 0{,}2,\\ P(+x) &= \tfrac12(1 + 0) = 0{,}5,\\ P(+y) &= \tfrac12(1 + 0{,}8) = 0{,}9.\end{aligned}$$`},
        text:R`Die Bloch-Kugel übersetzt einen Spinzustand in eine Richtung, und die Richtung sofort in Wahrscheinlichkeiten. Misst du längs einer Achse, ist $P(+\hbar/2)$ gleich $\frac12(1 + n_{\text{Achse}})$, mit der Komponente von $\hat n$ längs dieser Achse. Zeigt $\hat n$ genau entlang der Achse, ist $P = 1$; zeigt es genau entgegen, ist $P = 0$. Im Labor siehst du genau diese drei Werte als Balken. Die Tafel verbindet Ket, Spalte, Richtung, Labor und Messung für $\chi$.`,
        reps:{obj:R`Der Zustand $\chi$ auf der Bloch-Kugel`,
          rows:[
            {k:'dirac', tex:R`|\chi\rangle = \tfrac{1}{\sqrt5}\left(|\uparrow\rangle + 2i\,|\downarrow\rangle\right)`},
            {k:'matrix', tex:R`|\chi\rangle \doteq \frac{1}{\sqrt5}\binom{1}{2i},\qquad \hat S_{\hat n}\,\chi = +\tfrac\hbar2\,\chi\ \text{ für } \hat n = (0;\ 0{,}8;\ -0{,}6)`},
            {k:'worte', text:R`Spin $+\hbar/2$ längs einer Richtung in der $y$-$z$-Ebene, mit der Komponente $0{,}8$ in $+y$ und $0{,}6$ in $-z$.`},
            {k:'labor', text:R`Regler $\theta \approx 2{,}21$, $\varphi \approx 1{,}57$. Balken: $P(\uparrow z) = 0{,}20$, $P(+x) = 0{,}50$, $P(+y) = 0{,}90$.`},
            {k:'physik', text:R`100 Teilchen im $z$-Magneten: etwa 20 oben. Im $x$-Magneten: etwa 50 bei $+$. Erwartungswerte $\langle\mathbf S\rangle = \tfrac\hbar2\,\hat n = (0;\ 0{,}4\hbar;\ -0{,}3\hbar)$.`}
          ],
          links:[
            {from:'dirac', to:'matrix', rule:R`Vorfaktoren als Spalte schreiben; die Richtung findest du als die, für deren $\hat S_{\hat n}$ diese Spalte Eigenvektor zu $+\hbar/2$ ist.`},
            {from:'matrix', to:'worte', rule:R`Aus der Spalte $\theta$ und $\varphi$ ablesen und $\hat n = (\sin\theta\cos\varphi;\ \sin\theta\sin\varphi;\ \cos\theta)$ ausrechnen.`},
            {from:'worte', to:'labor', rule:R`Die Richtung mit den Reglern Polarwinkel und Azimut einstellen; der Pfeil zeigt $\hat n$.`},
            {from:'labor', to:'physik', rule:R`Jeder Balken ist $\tfrac12(1 + n_{\text{Achse}})$, die erwartete Trefferquote bei vielen Teilchen. Die gezählten Treffer schwanken darum.`}
          ]},
        q:{q:R`Im Labor zeigt der Pfeil genau in $-x$-Richtung: $\theta = \pi/2$, $\varphi = \pi$. Welcher Zustand ist das, und was zeigt der Balken $P(+x)$?`, tr:{from:'labor', to:'dirac'},
          opts:[R`$|{-x}\rangle$, Balken $P(+x) = 0$`, R`$|\downarrow\rangle$, Balken $P(+x) = 0{,}5$`, R`$|{-x}\rangle$, Balken $P(+x) = 0{,}5$`], a:0,
          ex:R`$\cos\tfrac\pi4|\uparrow\rangle + e^{i\pi}\sin\tfrac\pi4|\downarrow\rangle = |{-x}\rangle$. Längs $+x$ ist $n_x = -1$, also $P(+x) = 0$.`,
          fb:['', R`$|\downarrow\rangle$ liegt am Südpol, $\theta = \pi$. Hier ist $\theta = \pi/2$, der Äquator.`,
            R`Der Zustand stimmt. Aber $P(+x) = \tfrac12(1 + n_x) = 0$, weil der Pfeil genau entgegen $+x$ zeigt.`]}},
      {id:'spin-t4d', title:'Wahrscheinlichkeit zwischen zwei Richtungen',
        num:{title:R`$|{+x}\rangle$ in $y$ gemessen`, text:R`Mit $\langle{+y}| = \frac{1}{\sqrt2}(1, -i)$ ist

$$\langle{+y}|{+x}\rangle = \tfrac12(1 - i),\qquad |\langle{+y}|{+x}\rangle|^2 = \tfrac14\cdot2 = \tfrac12.$$

Die Richtungen $x$ und $y$ schließen $90°$ ein, und $\cos^2 45° = \tfrac12$.`},
        text:R`Allgemein gilt für zwei Richtungen mit dem Winkel $\alpha$ dazwischen

$$|\langle{+\hat m}|{+\hat n}\rangle|^2 = \cos^2\tfrac\alpha2 = \tfrac12(1 + \cos\alpha).$$

Präparierst du Spin $+\hbar/2$ längs $\hat n$ und misst längs $\hat m$, hängt das Ergebnis also nur vom Winkel zwischen beiden Richtungen ab. Für $\alpha = 0$ ist es sicher, für $\alpha = 180°$ unmöglich. Dazwischen nimmt die Wahrscheinlichkeit stetig ab. Die Messung in $z$ aus dem letzten Schritt ist der Sonderfall $\hat m = \hat z$.`,
        derive:{ctx:SPIN(), lines:[
          {l:'⟨+y|+x⟩ = (1 - i)/2', w:'Bra konjugiert, Zeile mal Spalte'},
          {l:'|⟨+y|+x⟩|^2 = 1/2', w:'Betragsquadrat',
            why:{q:'Warum ist $|\\tfrac12(1 - i)|^2 = \\tfrac12$?', opts:['$|1 - i|^2 = 1 + 1 = 2$, mal $\\tfrac14$', '$(1 - i)^2 = 1 - 1 = 0$, plus $\\tfrac12$', '$|1 - i| = 1 - 1 = 0$ wird ignoriert'], a:0, ex:'Das Betragsquadrat ist $(1 - i)(1 + i) = 2$; mit $\\tfrac14$ gibt das $\\tfrac12$.'}}
        ]},
        q:{q:R`Der Spin ist $|{+x}\rangle$. Gemessen wird längs $\hat n$ in der $x$-$z$-Ebene, $60°$ von der $x$-Achse entfernt. Wie groß ist $P(+\hbar/2)$?`,
          opts:[R`$1/4$`, R`$1/2$`, R`$3/4$`], a:2,
          ex:R`$\cos^2\frac{60°}{2} = \cos^2 30° = \frac34$.`,
          fb:[R`$\tfrac14 = \sin^230°$ ist die Wahrscheinlichkeit für $-\hbar/2$.`,
            R`$\tfrac12$ gilt nur für $\alpha = 90°$.`, '']}},
      {id:'spin-t4e', title:'Typischer Fehler: senkrecht im Raum heißt nicht orthogonal',
        num:{title:R`$z$ und $x$`, text:R`Die Richtungen $z$ und $x$ stehen senkrecht. Trotzdem ist

$$\langle\uparrow|{+x}\rangle = \tfrac{1}{\sqrt2} \ne 0,\qquad P = \tfrac12.$$

Orthogonal zu $|\uparrow\rangle$ ist allein $|\downarrow\rangle$, bis auf eine Phase.`},
        text:R`Viele schließen: „$z$ und $x$ stehen senkrecht, also ist $\langle\uparrow|{+x}\rangle = 0$.“ Diese Verwechslung von Hilbertraum und Ortsraum ist gut dokumentiert (Zhu & Singh 2011; Singh & Marshman 2015). Orthogonal mit $P = 0$ sind zwei Spinzustände nur für $\alpha = 180°$, also für entgegengesetzte Richtungen. Prüfe es im Labor: Stelle $\theta = \pi/2$ und $\varphi = 0$ ein. Der Pfeil zeigt in $x$-Richtung, der Balken $P(+x)$ steht auf $1$ und der Balken $P(\uparrow z)$ auf $0{,}5$, nicht auf $0$.`,
        fig:{lab:'spin', init:{th:1.5708, ph:0}, caption:R`Der Pfeil ist die Richtung $\hat n(\theta, \varphi)$ des Zustands, die Balken zeigen $P(+\hbar/2)$ für Magnete in $z$, $x$ und $y$. Bei $\theta = \pi/2$, $\varphi = 0$ zeigt der Pfeil in $x$-Richtung, und $P(\uparrow z) = \frac12$ – nicht $0$.`},
        q:{q:R`Welcher Zustand ist orthogonal zu $|{+y}\rangle$?`,
          opts:['$|{+x}\\rangle$, denn die $x$-Achse steht senkrecht auf $y$', '$|{-y}\\rangle$, denn $-y$ ist die Gegenrichtung zu $+y$', '$|\\uparrow\\rangle$, denn die $z$-Achse steht senkrecht auf $y$'], a:1,
          ex:R`$\langle{-y}|{+y}\rangle = \frac12(1 + i\cdot i) = 0$. $|{+x}\rangle$ und $|\uparrow\rangle$ gehören zu Richtungen senkrecht zu $y$; ihr Überlapp mit $|{+y}\rangle$ hat den Betrag $1/\sqrt2$.`,
          fb:[R`Senkrecht im Raum gibt $|\langle{+x}|{+y}\rangle|^2 = \tfrac12$, nicht $0$.`, '',
            R`Auch hier: $|\langle\uparrow|{+y}\rangle|^2 = \tfrac12$. Orthogonal ist nur die Gegenrichtung $-y$.`]}}
    ]},

    /* ===== Abschnitt 5: Messfolgen ===== */
    {id:'spin-t5', title:'Messfolgen: Stern-Gerlach-Magnete hintereinander', steps:[
      {id:'spin-t5a', title:'Ein Magnet mit Blende präpariert',
        pre:{from:'form', seg:'form-t4', title:'Der Zustand nach der Messung', text:R`Nach einer Messung mit dem Ergebnis $a$ ist das System im Eigenzustand zu $a$. Eine sofortige Wiederholung derselben Messung liefert deshalb sicher wieder $a$. Mini-Beispiel: Zweimal hintereinander die Energie messen gibt zweimal denselben Wert.`},
        num:{title:'1000 Atome', text:R`Von 1000 Atomen aus dem Ofen kommen etwa 500 durch einen $z$-Filter, der den unteren Teilstrahl ausblendet. Ein zweiter $z$-Magnet dahinter schickt alle

$$500 \cdot |\langle\uparrow|\uparrow\rangle|^2 = 500$$

nach oben. Kein einziges kommt unten heraus.`},
        text:R`Blendet man hinter einem $z$-Magneten den unteren Teilstrahl aus, sind alle durchgelassenen Teilchen im Zustand $|\uparrow\rangle$. Das ist die [[lex:zustandsreduktion|Zustandsreduktion]] aus dem Messpostulat (Thema 6): Nach einer Messung mit dem Ergebnis $a$ ist das System im Eigenzustand zu $a$. Ein Magnet mit Blende ist also ein Filter: eine Messung mit anschließender Präparation. Ein zweiter $z$-Magnet bestätigt das: Alle Teilchen kommen oben heraus.`,
        q:{q:R`Aus dem Ofen kommen 1000 Atome. Sie laufen durch zwei $z$-Filter hintereinander, die beide nur $\uparrow$ durchlassen. Wie viele kommen durch beide?`,
          opts:[R`etwa 250, weil jeder Filter halbiert`, R`etwa 500`, R`alle 1000`], a:1,
          ex:R`Der erste Filter lässt etwa die Hälfte durch und präpariert $|\uparrow\rangle$. Der zweite lässt davon alle durch, denn $|\langle\uparrow|\uparrow\rangle|^2 = 1$.`,
          fb:[R`Der zweite Filter halbiert nicht: Hinter dem ersten sind alle Atome in $|\uparrow\rangle$.`, '',
            R`Der erste Filter blendet die Atome mit $\downarrow$ aus, etwa die Hälfte.`]}},
      {id:'spin-t5b', title:'Die Regel für Folgen und das z-x-z-Rätsel',
        num:{title:R`$z$-Filter, $x$-Filter, $z$-Magnet`, text:R`Hinter dem $z$-Filter: $|\uparrow\rangle$. Der $x$-Filter lässt $|\langle{+x}|\uparrow\rangle|^2 = \tfrac12$ durch und präpariert $|{+x}\rangle$. Der letzte Magnet schickt davon $|\langle\downarrow|{+x}\rangle|^2 = \tfrac12$ nach unten:

$$P = \tfrac12\cdot\tfrac12 = \tfrac14.$$`},
        text:R`Für eine Folge von Filtern multiplizieren sich die Wahrscheinlichkeiten:

$$P(\text{Folge}) = |\langle a_1|\chi\rangle|^2\cdot|\langle a_2|a_1\rangle|^2\cdot|\langle a_3|a_2\rangle|^2\cdots$$

Jeder Faktor ist eine [[lex:born|Bornsche Wahrscheinlichkeit]] für den Zustand, den der vorige Filter hergestellt hat. Klassisch „haben“ die Teilchen nach $z$- und $x$-Filter $S_z = +\hbar/2$ und dazu $S_x = +\hbar/2$; am Ende kämen alle oben heraus. Tatsächlich ist die $z$-Information gelöscht, und ein Viertel kommt unten heraus. Der Grund ist $[\hat S_x, \hat S_z] \ne 0$.`,
        derive:{ctx:SPIN(), lines:[
          {l:'P = |⟨+x|↑⟩|^2 |⟨↓|+x⟩|^2', w:R`Filter $+x$, danach Kanal $\downarrow$`,
            why:{q:'Warum steht im zweiten Faktor $|{+x}\\rangle$ und nicht $|\\uparrow\\rangle$?', opts:['Weil der $x$-Filter den Zustand $|{+x}\\rangle$ präpariert hat.', 'Weil $|\\uparrow\\rangle$ und $|{+x}\\rangle$ dasselbe bedeuten.', 'Weil die Reihenfolge der Faktoren beliebig ist.'], a:0, ex:'Jeder Faktor gehört zum zuletzt präparierten Zustand. Hinter dem $x$-Filter ist das $|{+x}\\rangle$, nicht mehr $|\\uparrow\\rangle$.'}},
          {l:'= 1/2 · 1/2', w:R`$|\langle{+x}|\uparrow\rangle| = |\langle\downarrow|{+x}\rangle| = 1/\sqrt2$`},
          {l:'= 1/4', w:'ausmultipliziert'},
          {l:'|⟨↓|↑⟩|^2 = 0', w:R`ohne $x$-Filter`,
            why:{q:'Was zeigt der Vergleich mit dieser Zeile?', opts:['Erst der $x$-Filter macht $\\downarrow$ wieder möglich.', 'Der $x$-Filter halbiert nur die Zahl der Teilchen.', 'Der $z$-Filter lässt immer einige $\\downarrow$ durch.'], a:0, ex:'Ohne $x$-Filter kommt hinter dem $z$-Filter nie $\\downarrow$ heraus. Mit $x$-Filter ein Viertel – obwohl ein Filter nur Teilchen entfernt.'}}
        ]},
        q:{q:R`Hinter einem $z$-Filter ($\uparrow$) steht ein $y$-Filter ($+y$), dann ein $x$-Magnet. Welcher Anteil der Teilchen *hinter dem $y$-Filter* landet bei $+x$?`,
          opts:[R`$1/4$`, R`$1$`, R`$1/2$`], a:2,
          ex:R`Der $y$-Filter präpariert $|{+y}\rangle$. Dann ist $P(+x) = |\langle{+x}|{+y}\rangle|^2 = \frac12$. Die frühere $z$-Information spielt keine Rolle.`,
          fb:[R`$\tfrac14$ wäre der Anteil bezogen auf die Teilchen hinter dem $z$-Filter. Gefragt ist nach denen hinter dem $y$-Filter.`,
            R`Die Richtungen $x$ und $y$ stehen senkrecht, also $\cos^245° = \tfrac12$, nicht $1$.`, '']}},
      {id:'spin-t5c', title:'Die Messfolge in fünf Gestalten',
        num:{title:'Mit 100 Teilchen im Labor', text:R`Stelle im Labor $|{+x}\rangle$ ein ($\theta = \pi/2$, $\varphi = 0$) und klicke „100 Teilchen, Magnet in z“. Erwartet sind

$$100\cdot\tfrac12 = 50\ \text{bei}\ \uparrow\ \text{und}\ 50\ \text{bei}\ \downarrow,$$

gezählt werden zum Beispiel $46$ und $54$. Die Abweichung ist Zufall, typisch etwa $\pm5$.`},
        text:R`Eine Messfolge lässt sich in Worten, als Kette von Kets, als Produkt von Betragsquadraten und als Zählung beschreiben. Die Übersetzung zwischen den Gestalten folgt einer einzigen Regel: Jeder Filter ersetzt den Zustand durch den Eigenzustand zu seinem Ergebnis. Das Labor zeigt den letzten Schritt jeder Folge, die Messung am zuletzt präparierten Zustand. Mit wenigen Teilchen siehst du außerdem, dass Häufigkeiten um die Wahrscheinlichkeiten schwanken.`,
        reps:{obj:R`Die Folge $z$-Filter $\uparrow$, $x$-Filter $+$, $z$-Magnet`,
          rows:[
            {k:'worte', text:R`Erst nur „oben“ durchlassen, dann nur „$+x$“, dann in $z$ zählen. Unten kommt ein Viertel der Teilchen an, die den ersten Filter passiert haben.`},
            {k:'dirac', tex:R`|\uparrow\rangle\ \xrightarrow{\ x\text{-Filter}\ }\ |{+x}\rangle\ \xrightarrow{\ z\text{-Magnet}\ }\ |\uparrow\rangle\ \text{oder}\ |\downarrow\rangle`},
            {k:'formel', tex:R`P(\downarrow) = |\langle{+x}|\uparrow\rangle|^2\cdot|\langle\downarrow|{+x}\rangle|^2 = \tfrac12\cdot\tfrac12 = \tfrac14`},
            {k:'labor', text:R`Den letzten Schritt nachstellen: $\theta = \pi/2$, $\varphi = 0$, dann „100 Teilchen, Magnet in z“. Die Zählung zeigt etwa 50 $\uparrow$ und 50 $\downarrow$.`},
            {k:'physik', text:R`Von 1000 Teilchen hinter dem $z$-Filter kommen etwa 500 durch den $x$-Filter und davon etwa 250 unten an.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`Jeden Filter als Pfeil schreiben, hinter dem der Eigenzustand zu seinem Durchlass-Ergebnis steht.`},
            {from:'dirac', to:'formel', rule:R`Für jeden Pfeil das Betragsquadrat $|\langle\text{neu}|\text{alt}\rangle|^2$ bilden und alle multiplizieren.`},
            {from:'formel', to:'labor', rule:R`Der letzte Faktor ist das, was das Labor zählt: den zuletzt präparierten Zustand einstellen und den passenden Magneten wählen.`},
            {from:'labor', to:'physik', rule:R`Die Zählung durch 100 teilen und mit den Faktoren davor multiplizieren, um den Anteil am ursprünglichen Strahl zu erhalten.`}
          ]},
        q:{q:R`Im Labor stellst du $|{+y}\rangle$ ein und klickst „100 Teilchen, Magnet in x“. Was erwartest du, und wofür steht das in einer Messfolge?`, tr:{from:'labor', to:'formel'},
          opts:[R`etwa 50 × $+$: der Faktor $|\langle{+x}|{+y}\rangle|^2 = \tfrac12$`, R`etwa 100 × $+$: der Faktor $|\langle{+x}|{+y}\rangle| = 1$`, R`genau 50 × $+$: der Faktor $\tfrac12$ ist exakt`], a:0,
          ex:R`$|\langle{+x}|{+y}\rangle|^2 = \tfrac12$ ist der Faktor für den Schritt $y$-Filter $\to$ $x$-Magnet. Die Zählung schwankt um 50.`,
          fb:['', R`$|\langle{+x}|{+y}\rangle| = \tfrac{1}{\sqrt2}$, nicht $1$. Senkrechte Richtungen geben $\tfrac12$.`,
            R`Die Wahrscheinlichkeit ist exakt $\tfrac12$, die Zählung nicht: Bei 100 Teilchen schwankt sie typisch um $\pm5$.`]}},
      {id:'spin-t5d', title:'Ohne Blende: Wege und Information',
        num:{title:'Beide Teilstrahlen weiter', text:R`Hinter dem $x$-Magneten laufen beide Teilstrahlen weiter, jeder in einen eigenen $z$-Magneten. Unten landen insgesamt

$$\tfrac12\cdot\tfrac12 + \tfrac12\cdot\tfrac12 = \tfrac12$$

aller Teilchen, die aus dem $z$-Filter kamen.`},
        text:R`Lässt man hinter dem $x$-Magneten beide Teilstrahlen getrennt weiterlaufen, wirken die getrennten Wege wie eine Messung von $S_x$, auch ohne Detektor. Jeder Weg trägt seinen eigenen Zustand $|{+x}\rangle$ oder $|{-x}\rangle$, und jeder gibt am $z$-Magneten halb und halb. Erst wenn man die beiden Teilstrahlen so zusammenführt, dass die Wege prinzipiell nicht mehr unterscheidbar sind, entsteht wieder $|\uparrow\rangle$, und $\downarrow$ kommt nicht mehr vor. Das ist ein Gedankenexperiment und technisch sehr schwierig; $S_x$ ist dann eben nicht gemessen worden.`,
        q:{q:R`Die beiden Teilstrahlen hinter dem $x$-Magneten werden so zusammengeführt, dass man den Weg prinzipiell nicht mehr erkennt. Was zeigt der $z$-Magnet dahinter?`,
          opts:[R`alle Teilchen bei $\uparrow$`, R`die Hälfte bei $\downarrow$`, R`ein Viertel bei $\downarrow$`], a:0,
          ex:R`Ohne Weginformation ist $S_x$ nicht gemessen. Der Zustand bleibt $\tfrac{1}{\sqrt2}(|{+x}\rangle + |{-x}\rangle) = |\uparrow\rangle$.`,
          fb:['', R`Die Hälfte gälte, wenn die Wege unterscheidbar blieben. Zusammengeführt überlagern sich beide Anteile wieder zu $|\uparrow\rangle$.`,
            R`Ein Viertel gilt für einen $x$-Filter mit Blende, nicht für zwei wieder vereinte Wege.`]}},
      {id:'spin-t5e', title:'Typische Fehlvorstellungen bei Messfolgen',
        num:{title:R`Ein Zustand mit $\uparrow$ und $+x$?`, text:R`Eigenvektoren von $\sigma_z$ sind $\binom10$ und $\binom01$, die von $\sigma_x$ sind $\tfrac{1}{\sqrt2}\binom11$ und $\tfrac{1}{\sqrt2}\binom{1}{-1}$. Kein Vektor kommt in beiden Listen vor, auch nicht bis auf eine Phase. Es gibt keinen Zustand mit festem $S_z$ und festem $S_x$, passend zu

$$[\hat S_x, \hat S_z] = -i\hbar\hat S_y \ne 0.$$`},
        text:R`Drei Fehlvorstellungen sind häufig. Erstens: „Nach dem $x$-Filter ist der Spin $\uparrow$ und $+x$ zugleich.“ Einen solchen Zustand gibt es nicht. Zweitens: „Ein Magnet in $x$-Richtung ändert $S_z$ nicht, weil er nur in $x$ ablenkt.“ Er ändert den Zustand und damit die Verteilung der Messwerte von $S_z$. Drittens: „Was am Ende herauskommt, hängt nur vom Anfangszustand ab.“ Die Verteilung hinter dem letzten Filter hängt nur vom zuletzt präparierten Zustand ab. Der Anteil am ursprünglichen Strahl ist dagegen das Produkt aller Faktoren.`,
        q:{q:R`Warum gibt es nach einem $z$-Filter und einem $x$-Filter wieder Teilchen mit $S_z = -\hbar/2$?`,
          opts:[R`Der $x$-Magnet dreht die Spins mechanisch um.`, R`Der $x$-Filter präpariert $|{+x}\rangle$, darin ist $P(\downarrow) = \frac12$.`, R`Der $z$-Filter lässt immer einige falsche Teilchen durch.`], a:1,
          ex:R`Ein Filter präpariert einen neuen Zustand. $|{+x}\rangle$ enthält $|\downarrow\rangle$ mit der Amplitude $1/\sqrt2$.`,
          fb:[R`Es gibt keine mechanische Drehung. Der Filter ersetzt den Zustand durch einen Eigenzustand von $\hat S_x$.`, '',
            R`Ein idealer $z$-Filter lässt nur $\uparrow$ durch; ein zweiter $z$-Magnet direkt dahinter findet nie $\downarrow$.`]}}
    ]},

    /* ===== Abschnitt 6: Spin im Magnetfeld ===== */
    {id:'spin-t6', title:'Spin im Magnetfeld: Larmor-Präzession und Drehung um 2π', steps:[
      {id:'spin-t6a', title:'Der Hamilton-Operator im Feld',
        num:{title:R`Elektron in $B = 1\,\mathrm T$`, text:R`Für das Elektron ist $|\gamma| = 1{,}76\cdot10^{11}\,\mathrm{s^{-1}T^{-1}}$. Bei $1\,\mathrm T$ ist

$$\begin{gathered}\omega = |\gamma|B = 1{,}76\cdot10^{11}\,\mathrm s^{-1},\\ \frac{\omega}{2\pi} \approx 28\,\mathrm{GHz},\\ \hbar\omega \approx 1{,}16\cdot10^{-4}\,\mathrm{eV}.\end{gathered}$$

So weit liegen $|\uparrow\rangle$ und $|\downarrow\rangle$ energetisch auseinander.`},
        text:R`Ein Moment im homogenen Feld $\mathbf B = B\hat z$ hat die Energie $-\boldsymbol\mu\cdot\mathbf B$. Mit $\hat{\boldsymbol\mu} = \gamma\hat{\mathbf S}$ ist

$$\hat H = -\gamma B\,\hat S_z = \omega\,\hat S_z,\qquad \omega = -\gamma B.$$

Die Eigenzustände sind $|\uparrow\rangle$ und $|\downarrow\rangle$ mit den Energien $\pm\hbar\omega/2$. Für das Elektron ist $\gamma < 0$, also $\omega > 0$, und $|\uparrow\rangle$ ist der energetisch höhere Zustand. Das Moment zeigt beim Elektron entgegen dem Spin, deshalb liegt „Spin entlang des Feldes“ oben.`,
        q:{q:R`Welche Energie hat $|\downarrow\rangle$ im Feld $B\hat z$ mit $\hat H = \omega\hat S_z$?`,
          opts:[R`$+\hbar\omega/2$`, R`$0$`, R`$-\hbar\omega/2$`], a:2,
          ex:R`$\hat S_z|\downarrow\rangle = -\tfrac\hbar2|\downarrow\rangle$, also $\hat H|\downarrow\rangle = -\tfrac{\hbar\omega}{2}|\downarrow\rangle$.`,
          fb:[R`$+\hbar\omega/2$ gehört zu $|\uparrow\rangle$.`,
            R`Null ist kein Eigenwert von $\omega\hat S_z$; die Eigenwerte sind $\pm\hbar\omega/2$.`, '']}},
      {id:'spin-t6b', title:'Zeitentwicklung: jeder Anteil seine Phase',
        pre:{from:'sg', seg:'sg-t5', title:'Überlagerung und Zeitentwicklung', text:R`Eine Überlagerung von Energieeigenzuständen entwickelt sich, indem jeder Anteil seinen eigenen Phasenfaktor bekommt: $\sum_nc_n\psi_ne^{-iE_nt/\hbar}$. Die Beträge $|c_n|$ bleiben fest. Mini-Beispiel: Ein einzelner Eigenzustand bekommt nur eine globale Phase.`},
        num:{title:R`Start $|{+x}\rangle$, nach $\omega t = \pi$`, text:R`Mit den Energien $\pm\hbar\omega/2$:

$$\begin{gathered}|\chi(t)\rangle = \tfrac{1}{\sqrt2}\left(e^{-i\omega t/2}|\uparrow\rangle + e^{i\omega t/2}|\downarrow\rangle\right)\\ \xrightarrow{\ \omega t = \pi\ } \tfrac{1}{\sqrt2}\left(-i|\uparrow\rangle + i|\downarrow\rangle\right) = -i\,|{-x}\rangle.\end{gathered}$$

Bis auf die globale Phase $-i$ zeigt der Spin jetzt in $-x$-Richtung.`},
        text:R`Wie in Thema 2 bekommt jeder Energieanteil seinen eigenen Phasenfaktor ([[lex:zeitentwicklung|Zeitentwicklung]]). Mit $|\chi(0)\rangle = a|\uparrow\rangle + b|\downarrow\rangle$ ist

$$|\chi(t)\rangle = e^{-i\hat Ht/\hbar}|\chi(0)\rangle = a\,e^{-i\omega t/2}|\uparrow\rangle + b\,e^{i\omega t/2}|\downarrow\rangle.$$

$|a|^2$ und $|b|^2$ bleiben fest, also auch $\langle S_z\rangle$. Es ändert sich die relative Phase: Klammert man $e^{-i\omega t/2}$ aus, wird aus $e^{i\varphi}$ der Faktor $e^{i(\varphi + \omega t)}$. Auf der Bloch-Kugel wächst $\varphi$ gleichmäßig, $\theta$ bleibt. Die Herleitung rechnet das für den Start in $|{+x}\rangle$ durch und bestimmt die Erwartungswerte aller drei Komponenten.`,
        derive:{ctx:SPIN({params:{ω:'pos'}, mat:{preset:'spin', mats:{H:'ω S_z'}}, states:{χ:'1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)'}, state:'χ'}), lines:[
          {l:'e^(-iHt/ħ) |+x⟩ = 1/sqrt(2) (e^(-iHt/ħ)|↑⟩ + e^(-iHt/ħ)|↓⟩)', w:R`$e^{-i\hat Ht/\hbar}$ ist linear`},
          {l:'= 1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)', w:R`$E = \pm\hbar\omega/2$`,
            why:{q:'Warum bekommt $|\\downarrow\\rangle$ den Faktor $e^{+i\\omega t/2}$?', opts:['Weil seine Energie $-\\hbar\\omega/2$ ist und $e^{-iEt/\\hbar}$ so $e^{+i\\omega t/2}$ wird.', 'Weil $|\\downarrow\\rangle$ nach unten zeigt und rückwärts läuft.', 'Weil im Bra $\\langle\\downarrow|$ konjugiert wird.'], a:0, ex:'Auf einen Eigenzustand wirkt $e^{-i\\hat Ht/\\hbar}$ als Zahl $e^{-iEt/\\hbar}$. Mit $E = -\\hbar\\omega/2$ ist das $e^{+i\\omega t/2}$.'}},
          {l:'⟨S_x⟩ = ħ/2 cos(ωt)', w:R`$\frac\hbar2(a^*b + b^*a)$`},
          {l:'⟨S_y⟩ = ħ/2 sin(ωt)', w:R`$\frac\hbar2(-ia^*b + ib^*a)$`},
          {l:'⟨S_z⟩ = 0', w:R`$|a|^2 = |b|^2$ bleibt`,
            why:{q:'Warum ändert sich $\\langle S_z\\rangle$ nicht?', opts:['Weil die Beträge $|a|$ und $|b|$ fest bleiben.', 'Weil das Feld in $z$-Richtung keine Kraft ausübt.', 'Weil $\\langle S_z\\rangle$ für Spin ½ immer null ist.'], a:0, ex:'$\\hat S_z$ vertauscht mit $\\hat H = \\omega\\hat S_z$; die Wahrscheinlichkeiten $|a|^2, |b|^2$ sind zeitlich konstant.'}}
        ]},
        q:{q:R`Start $|{+x}\rangle$, $\hat H = \omega\hat S_z$. Wann ist der Spin zum ersten Mal in $|{-x}\rangle$, bis auf eine Phase?`,
          opts:[R`bei $t = 2\pi/\omega$`, R`bei $t = \pi/\omega$`, R`bei $t = \pi/(2\omega)$`], a:1,
          ex:R`$\langle S_x\rangle = \frac\hbar2\cos\omega t = -\frac\hbar2$ bei $\omega t = \pi$: Der Pfeil hat sich um $180°$ gedreht.`,
          fb:[R`Nach $2\pi/\omega$ ist der Pfeil einmal herum und zeigt wieder nach $+x$.`, '',
            R`Bei $\omega t = \pi/2$ zeigt der Pfeil nach $+y$, eine Vierteldrehung.`]}},
      {id:'spin-t6c', title:'Larmor-Präzession: Spinor, Kugel, Kurve',
        num:{title:R`Nach einer Vierteldrehung`, text:R`Bei $\omega t = \pi/2$ ist $\langle S_x\rangle = \tfrac\hbar2\cos\tfrac\pi2 = 0$ und

$$\langle S_y\rangle = \tfrac\hbar2\sin\tfrac\pi2 = \tfrac\hbar2.$$

Der Pfeil zeigt nach $+y$: Der Zustand ist $|{+y}\rangle$ bis auf eine Phase, mit $\varphi = \pi/2$.`},
        text:R`Der Pfeil auf der Bloch-Kugel läuft mit der Winkelgeschwindigkeit $\omega$ um die Feldrichtung: die [[lex:larmor|Larmor-Präzession]]. Im Spinor zeigt sie sich nur als wachsende relative Phase. In den Erwartungswerten zeigt sie sich als Kosinus und Sinus. Im Labor entspricht sie dem Regler Azimut, den du gleichmäßig weiterdrehst, während der Polarwinkel fest bleibt. Die Tafel verbindet diese Gestalten für den Start in $|{+x}\rangle$. Der Graph läuft über zwei volle Umläufe, bis $\omega t = 4\pi$.`,
        reps:{obj:R`Larmor-Präzession, Start in $|{+x}\rangle$`,
          rows:[
            {k:'worte', text:R`Der Spin dreht sich gleichmäßig um die Feldrichtung $z$, gegen den Uhrzeigersinn von oben gesehen. Seine $z$-Komponente bleibt.`},
            {k:'matrix', tex:R`|\chi(t)\rangle \doteq \frac{1}{\sqrt2}\begin{pmatrix}e^{-i\omega t/2}\\ e^{i\omega t/2}\end{pmatrix} = \frac{e^{-i\omega t/2}}{\sqrt2}\begin{pmatrix}1\\ e^{i\omega t}\end{pmatrix}`},
            {k:'labor', text:R`Regler Polarwinkel fest bei $\theta = \pi/2$, Azimut $\varphi = \omega t$ gleichmäßig weiterdrehen. Die Balken $P(+x)$ und $P(+y)$ schwanken um eine Vierteldrehung versetzt, $P(\uparrow z)$ bleibt bei $0{,}5$.`},
            {k:'graph', plot:{x:[0, 1], y:[-1.15, 1.15], abs:true, yticks:[{y:-1, lab:'-1'}, {y:1, lab:'1'}], xlab:R`\omega t/(4\pi)`, ylab:R`\langle S\rangle/(\hbar/2)`, ticks:SPIN_SK.T}, f:x => Math.cos(4 * Math.PI * x), lab:R`\langle S_x\rangle`, f2:x => Math.sin(4 * Math.PI * x), lab2:R`\langle S_y\rangle`,
              cap:R`$\langle S_x\rangle$ durchgezogen, $\langle S_y\rangle$ gestrichelt, über zwei Umläufe. Die Achsenmarken sind die Zeiten $\pi/\omega, 2\pi/\omega, \dots$`},
            {k:'physik', text:R`Die präzedierende Magnetisierung vieler Spins induziert in einer Spule eine Wechselspannung der Frequenz $\omega/2\pi$. Das ist das Signal der Kernspinresonanz.`}
          ],
          links:[
            {from:'worte', to:'matrix', rule:R`„Dreht um $z$“ heißt: Nur die relative Phase der Komponenten ändert sich, ihr Betrag nicht. Die globale Phase $e^{-i\omega t/2}$ ausklammern.`},
            {from:'matrix', to:'labor', rule:R`Die relative Phase $e^{i\omega t}$ als Azimut $\varphi = \omega t$ lesen; $\theta$ aus $|a| = |b|$ ist $\pi/2$.`},
            {from:'labor', to:'graph', rule:R`Für jede Zeit $\langle S_x\rangle = \tfrac\hbar2\sin\theta\cos\varphi$ und $\langle S_y\rangle = \tfrac\hbar2\sin\theta\sin\varphi$ auftragen.`},
            {from:'graph', to:'physik', rule:R`Die Periode der Kurven, $2\pi/\omega$, ist die Periode des Spulensignals; ihr Kehrwert ist die gemessene Frequenz.`}
          ]},
        q:{q:R`Bei welcher Reglerstellung im Labor siehst du den Zustand zur Zeit $\omega t = \pi$?`, tr:{from:'matrix', to:'labor'},
          opts:[R`$\theta = \pi/2$, $\varphi = \pi$`, R`$\theta = \pi$, $\varphi = 0$`, R`$\theta = \pi/2$, $\varphi = \pi/2$`], a:0,
          ex:R`Die relative Phase ist $e^{i\pi}$, also $\varphi = \pi$; $\theta$ bleibt $\pi/2$. Der Pfeil zeigt nach $-x$.`,
          fb:['', R`$\theta = \pi$ wäre $|\downarrow\rangle$. Die Präzession um $z$ ändert $\theta$ nicht.`,
            R`$\varphi = \pi/2$ gehört zu $\omega t = \pi/2$, der Vierteldrehung.`]}},
      {id:'spin-t6d', title:'Anwendung: Kernspinresonanz',
        num:{title:'Ein Tomograph mit 1,5 und 3 Tesla', text:R`Protonen haben $\gamma/2\pi = 42{,}58\,\mathrm{MHz/T}$. Damit ist

$$f(1{,}5\,\mathrm T) = 63{,}9\,\mathrm{MHz},\qquad f(3\,\mathrm T) = 127{,}7\,\mathrm{MHz}.$$

Das sind Radiofrequenzen, ähnlich wie beim UKW-Rundfunk.`},
        text:R`Protonen haben ebenfalls Spin ½. Ihre Larmor-Frequenz $\omega/2\pi$ ist etwa $42{,}6\,\mathrm{MHz}$ pro Tesla. Ein Radiofrequenzpuls mit genau dieser Frequenz kippt die Spins aus der Feldrichtung, also $\theta$ von $0$ weg. Die präzedierende Magnetisierung induziert dann in einer Spule ein messbares Signal. Darauf beruhen NMR-Spektroskopie und Magnetresonanztomographie. Weil die Frequenz proportional zum Feld ist, kann ein Feldgradient jedem Ort eine eigene Frequenz geben. So entsteht das Bild.`,
        q:{q:R`Bei welcher Frequenz präzedieren Protonen in einem $7$-Tesla-Forschungstomographen?`,
          opts:[R`$42{,}6\,\mathrm{MHz}$`, R`$298\,\mathrm{MHz}$`, R`$6{,}1\,\mathrm{MHz}$`], a:1,
          ex:R`$7\,\mathrm T\cdot42{,}58\,\mathrm{MHz/T} \approx 298\,\mathrm{MHz}$. Die Frequenz wächst proportional zum Feld.`,
          fb:[R`$42{,}6\,\mathrm{MHz}$ gilt für $1\,\mathrm T$.`, '',
            R`Die Frequenz ist proportional zu $B$; du hast durch $7$ geteilt statt multipliziert.`]}},
      {id:'spin-t6e', title:R`Drehung um $2\pi$`,
        num:{title:R`$\alpha = 2\pi$ eingesetzt`, text:R`$e^{-i\alpha\hat S_z/\hbar}$ ist diagonal mit $e^{\mp i\alpha/2}$. Für $\alpha = 2\pi$:

$$e^{-i2\pi\hat S_z/\hbar} \doteq \begin{pmatrix}e^{-i\pi}&0\\0&e^{i\pi}\end{pmatrix} = -\mathbb 1.$$

Erst bei $\alpha = 4\pi$ steht $+\mathbb 1$ da.`},
        text:R`Der Operator $e^{-i\alpha\hat S_z/\hbar}$ dreht den Spin um den Winkel $\alpha$ um die $z$-Achse ([[lex:spin-drehung|Drehoperator]]); die Larmor-Präzession ist genau diese Drehung mit $\alpha = \omega t$. Für $\alpha = 2\pi$ erwartet man klassisch: alles wie vorher. Tatsächlich bekommt jeder Spinor den Faktor $-1$. Für ein einzelnes Teilchen ist das eine globale Phase und ändert keine Wahrscheinlichkeit. Sichtbar wird das Vorzeichen, wenn man nur einen Teil einer Welle dreht und mit dem ungedrehten Teil überlagert. Das zeigten Neutronen-Interferometer 1975 (Rauch et al.; Werner et al.): Die Intensität schwankte mit der Periode $4\pi$.`,
        derive:{ctx:SPIN(), lines:[
          {l:'e^(-i 2π S_z/ħ) = (e^(-iπ), 0; 0, e^(iπ))', w:'Drehung um 2π, diagonal ausgewertet'},
          {l:'= -I', w:R`$e^{\pm i\pi} = -1$`,
            why:{q:'Ändert der Faktor $-1$ eine Messwahrscheinlichkeit am einzelnen Spin?', opts:['Nein, er ist eine globale Phase; nur Interferenz zeigt ihn.', 'Ja, nach $2\\pi$ zeigt der Spin in die Gegenrichtung.', 'Ja, $\\langle S_z\\rangle$ wechselt das Vorzeichen.'], a:0, ex:'$|\\langle\\varphi|(-\\chi)\\rangle|^2 = |\\langle\\varphi|\\chi\\rangle|^2$. Das Vorzeichen zeigt sich nur relativ zu einem ungedrehten Teil.'}}
        ]},
        q:{q:R`Ein Spin wird um $2\pi$ gedreht. Was ändert sich an einer anschließenden $S_x$-Messung am selben Teilchen?`,
          opts:[R`Die Wahrscheinlichkeiten kehren sich um.`, R`Nichts; der Faktor $-1$ ist eine globale Phase.`, R`$\langle S_x\rangle$ wechselt das Vorzeichen.`], a:1,
          ex:R`$-\chi$ und $\chi$ geben dieselben Betragsquadrate. Erst eine Überlagerung mit einem ungedrehten Teil macht das Vorzeichen sichtbar.`,
          fb:[R`Die Wahrscheinlichkeiten sind Betragsquadrate; ein gemeinsamer Faktor $-1$ fällt heraus.`, '',
            R`Auch $\langle S_x\rangle = \langle\chi|\hat S_x|\chi\rangle$ ändert sich nicht: Das Vorzeichen kommt zweimal vor.`]}},
      {id:'spin-t6f', title:R`Typischer Fehler: Auch $|\uparrow\rangle$ präzediere`,
        num:{title:R`$|\uparrow\rangle$ im Feld`, text:R`$|\uparrow\rangle$ ist Eigenzustand von $\hat H$:

$$|\chi(t)\rangle = e^{-i\omega t/2}\,|\uparrow\rangle.$$

Das ist nur eine globale Phase. $\langle\mathbf S\rangle = (0;\ 0;\ \hbar/2)$ bleibt für alle Zeiten fest.`},
        text:R`Eine verbreitete Fehlvorstellung lautet: „Im Feld $B\hat z$ präzediert jeder Spin, auch $|\uparrow\rangle$.“ Nein. $|\uparrow\rangle$ und $|\downarrow\rangle$ sind Eigenzustände von $\hat H$, also stationär. Nur eine globale Phase ändert sich. Präzession gibt es nur für Überlagerungen von $|\uparrow\rangle$ und $|\downarrow\rangle$, also für Zustände, deren Pfeil nicht genau entlang des Feldes zeigt. Das klassische Bild eines Kreisels, der unter einem Drehmoment präzediert, trifft für den Erwartungswert zu, aber nicht für einen Pfeil auf der Feldachse.`,
        derive:{ctx:SPIN({params:{ω:'pos'}, mat:{preset:'spin', mats:{H:'ω S_z'}}}), lines:[
          {l:'H |↑⟩ = ħω/2 |↑⟩', w:R`$|\uparrow\rangle$ ist Eigenzustand von $\hat H$`},
          {l:'e^(-iHt/ħ) |↑⟩ = e^(-iωt/2) |↑⟩', w:'Zeitentwicklung: nur eine Phase',
            why:{q:'Warum ändert sich hier keine Messgröße?', opts:['Weil eine gemeinsame Phase aus allen Betragsquadraten fällt.', 'Weil das Feld für eine sichtbare Drehung zu schwach ist.', 'Weil $\\omega$ für den Zustand $|\\uparrow\\rangle$ gleich null ist.'], a:0, ex:'Alle Wahrscheinlichkeiten und Erwartungswerte bleiben gleich. Der Zustand ist stationär.'}}
        ]},
        q:{q:R`Der Spin ist $|\downarrow\rangle$ im Feld $B\hat z$. Was passiert mit $\langle\mathbf S\rangle$?`,
          opts:[R`präzediert mit $\omega$ um $z$`, R`bleibt $(0;\ 0;\ -\hbar/2)$`, R`klappt langsam nach oben`], a:1,
          ex:R`$|\downarrow\rangle$ ist Eigenzustand von $\hat H$ und damit stationär.`,
          fb:[R`Präzession gibt es nur für Überlagerungen. $|\downarrow\rangle$ liegt auf der Feldachse.`, '',
            R`$\hat H = \omega\hat S_z$ ändert $|a|^2$ und $|b|^2$ nicht. Ein Umklappen bräuchte ein Feld quer zu $z$.`]}}
    ]}
  ],
  example:{
    title:'Wahrscheinlichkeit für $S_y = +\\hbar/2$',
    text:'Der Spin ist im Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt3}\\left(|\\uparrow\\rangle + \\sqrt2\\,i\\,|\\downarrow\\rangle\\right)$. Mit welcher Wahrscheinlichkeit ergibt eine Messung von $S_y$ den Wert $+\\hbar/2$? Es gilt $|{+y}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{i}$.',
    ctx:SPIN({states:{χ:'1/sqrt(3)(|↑⟩ + sqrt(2) i|↓⟩)'}, state:'χ'}),
    lines:[
      {l:'P = |⟨+y|χ⟩|^2', why:{q:'Warum diese Formel?', opts:['Bornsche Regel: Betragsquadrat der Projektion', 'Weil der Erwartungswert $\\langle S_y\\rangle$ gleich $P$ ist', 'Weil $|{+y}\\rangle$ auf $1$ normiert ist'], a:0, ex:'Bornsche Regel: $P(+\\hbar/2) = |\\langle{+y}|\\chi\\rangle|^2$.'}},
      {l:'= |1/sqrt(2) (1, -i) · 1/sqrt(3) (1; sqrt(2) i)|^2', why:{q:'Warum steht im Bra $(1, -i)$ und nicht $(1, i)$?', opts:['Das Bra enthält die konjugierten Komponenten des Kets.', 'Das ist eine Konvention von Stern und Gerlach.', 'Weil $\\sigma_y$ oben rechts ein Minuszeichen hat.'], a:0, ex:'$\\langle{+y}| = (|{+y}\\rangle)^\\dagger = \\frac{1}{\\sqrt2}(1, -i)$.'}},
      {l:'= |(1 + sqrt(2))/sqrt(6)|^2', why:{q:'Woher kommt $1 + \\sqrt2$?', opts:['aus $1\\cdot 1 + (-i)\\cdot\\sqrt2\\,i$', 'aus $1\\cdot 1 + i\\cdot\\sqrt2\\,i$, als Betrag', 'aus $|i| = 1$, man lässt $i$ weg'], a:0, ex:'$(-i)\\cdot i = -i^2 = 1$, also $1 + \\sqrt2$. Mit $i\\cdot i = -1$ (ohne Konjugation) käme $1 - \\sqrt2$ heraus.'}},
      {l:'= (3 + 2 sqrt(2))/6', why:{q:'Ist das Ergebnis plausibel?', opts:['Ja, es liegt zwischen 0 und 1 (etwa 0,97).', 'Nein, für Spin ist jede Wahrscheinlichkeit 1/2.', 'Nein, eine Wahrscheinlichkeit kann nicht irrational sein.'], a:0, ex:'$(1+\\sqrt2)^2 = 3 + 2\\sqrt2$; geteilt durch 6 ergibt $\\approx 0{,}971$. Der Zustand liegt nahe bei $|{+y}\\rangle$.'}}
    ],
    faded:{id:'spin-fade', title:'Jetzt du: Wahrscheinlichkeit für $S_x = +\\hbar/2$', text:'Gleicher Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt3}(|\\uparrow\\rangle + \\sqrt2\\,i|\\downarrow\\rangle)$, jetzt mit $|{+x}\\rangle = \\frac{1}{\\sqrt2}\\binom11$.',
      ctx:SPIN({states:{χ:'1/sqrt(3)(|↑⟩ + sqrt(2) i|↓⟩)'}, state:'χ'}),
      given:['P = |⟨+x|χ⟩|^2', '= |1/sqrt(2) (1, 1) · 1/sqrt(3) (1; sqrt(2) i)|^2'],
      goals:[{id:'a', prompt:'Berechne $P(S_x = +\\hbar/2)$.', type:'value', target:'1/2', hints:['Bilde das Skalarprodukt Zeile mal Spalte; hier gibt es nichts zu konjugieren, weil $\\langle{+x}|$ reell ist.', 'Das Skalarprodukt ist $(1 + \\sqrt2\\,i)/\\sqrt6$.', '$|1 + \\sqrt2\\,i|^2 = 1 + 2$.'],
        model:['P = |⟨+x|χ⟩|^2', '= |1/sqrt(2) (1, 1) · 1/sqrt(3) (1; sqrt(2) i)|^2', {l:'= |1 + sqrt(2) i|^2/6', gap:'= |▢|^2/6'}, '= 1/2']}]}
  },
  puzzle:{
    title:'Viele Filter drehen den Spin um',
    text:'Ein $z$-Filter lässt nur $\\uparrow$ durch. Ganz am Ende steht ein Filter, der nur $\\downarrow$ durchlässt. Ohne etwas dazwischen kommt kein Teilchen durch; mit einem $x$-Filter dazwischen ist es ein Viertel.\n\nJetzt stellst du $N - 1$ Filter dazwischen. Ihre Richtungen liegen in der $x$-$z$-Ebene und drehen sich in gleichen Schritten von $+z$ nach $-z$, jeder um $180^\\circ/N$ gegen den vorigen.',
    q:{q:'Welcher Anteil der Teilchen hinter dem ersten Filter kommt für sehr großes $N$ durch den letzten?', opts:['fast alle', 'keiner, $\\uparrow$ und $\\downarrow$ sind orthogonal', 'ein Viertel, wie mit einem Zwischenfilter', 'die Hälfte'], a:0, ex:'$P_N = \\cos^{2N}\\left(\\frac{\\pi}{2N}\\right) \\to 1$.'},
    reveal:'Benachbarte Filterrichtungen bilden den Winkel $\\alpha = 180^\\circ/N$. Ein Filter lässt den Zustand des vorigen mit $|\\langle\\hat n_{k+1}|\\hat n_k\\rangle|^2 = \\cos^2(\\alpha/2)$ durch (halber Winkel im Hilbertraum, Abschnitt 4). Für $N$ Schritte ist\n\n$$P_N = \\cos^{2N}\\left(\\frac{\\pi}{2N}\\right):\\qquad P_1 = 0,\\quad P_2 = \\tfrac14,\\quad P_3 = \\left(\\tfrac34\\right)^3 \\approx 0{,}42,\\quad P_{10} \\approx 0{,}78.$$\n\nFür große $N$ ist $\\ln P_N \\approx -2N\\cdot\\frac12\\left(\\frac{\\pi}{2N}\\right)^2 = -\\frac{\\pi^2}{4N} \\to 0$, also $P_N \\to 1$. Viele kleine Schritte führen den Spin von $\\uparrow$ nach $\\downarrow$, fast ohne Verlust. Jeder Filter ist eine Messung, die neu präpariert – kein passives Ablesen eines Wertes, den der Spin schon hatte.'
  },
  clarify:{
    core:'Der Spin eines Elektrons lebt in einem zweidimensionalen Hilbertraum mit Basis $|\\uparrow\\rangle = \\binom10$, $|\\downarrow\\rangle = \\binom01$. Die Operatoren sind $\\hat S_i = \\frac\\hbar2\\sigma_i$ mit den Pauli-Matrizen\n\n$$\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix},\\quad \\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix},\\quad \\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}.$$\n\nJede Komponente hat die Messwerte $\\pm\\hbar/2$; $\\hat S^2 = \\frac34\\hbar^2$. Ein allgemeiner Zustand ist $|\\chi\\rangle = \\cos\\frac\\theta2|\\uparrow\\rangle + e^{i\\varphi}\\sin\\frac\\theta2|\\downarrow\\rangle$ – ein Punkt auf der Bloch-Kugel und zugleich der Eigenzustand von $\\hat S_{\\hat n}$ zu $+\\hbar/2$ für die Richtung $\\hat n(\\theta, \\varphi)$.',
    keys:[
      'Eigenzustände: $|{\\pm x}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle \\pm |\\downarrow\\rangle)$, $|{\\pm y}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle \\pm i|\\downarrow\\rangle)$.',
      'Wahrscheinlichkeit: $P(\\pm\\hbar/2) = |\\langle\\pm n|\\chi\\rangle|^2$; im Bra stehen die konjugierten Komponenten.',
      'Zwei Richtungen mit Winkel $\\alpha$: $|\\langle{+\\hat m}|{+\\hat n}\\rangle|^2 = \\cos^2\\frac\\alpha2$. Orthogonal sind nur Zustände zu entgegengesetzten Richtungen.',
      '$[\\hat S_x, \\hat S_y] = i\\hbar\\hat S_z$ (zyklisch) und $\\sigma_i^2 = \\mathbb 1$, $\\sigma_x\\sigma_y = i\\sigma_z$.',
      'Messfolgen: Jeder Filter präpariert einen neuen Zustand; die Wahrscheinlichkeiten multiplizieren sich.',
      'Nur relative Phasen zählen: $e^{i\\alpha}|\\chi\\rangle$ ist derselbe Zustand, $|\\uparrow\\rangle + |\\downarrow\\rangle$ und $|\\uparrow\\rangle - |\\downarrow\\rangle$ sind verschieden.',
      'Im Feld $B\\hat z$: $\\hat H = \\omega\\hat S_z$; der Spin präzediert mit $\\omega$ um die $z$-Achse: $\\langle S_x\\rangle = \\frac\\hbar2\\cos\\omega t$ für den Start $|{+x}\\rangle$. Eine Drehung um $2\\pi$ gibt den Faktor $-1$.'
    ],
    errors:[
      'Im Bra die Komponenten nicht konjugieren – bei $|{\\pm y}\\rangle$ ergibt das falsche Wahrscheinlichkeiten.',
      'Senkrechte Raumrichtungen für orthogonale Zustände halten: $\\langle\\uparrow|{+x}\\rangle = 1/\\sqrt2$, nicht $0$.',
      '$\\langle S_x\\rangle$ für einen Messwert halten: Gemessen wird immer $\\pm\\hbar/2$, der Mittelwert liegt dazwischen.',
      '$\\sigma_i$ und $\\hat S_i$ verwechseln: Der Faktor $\\hbar/2$ fehlt dann in jedem Ergebnis.',
      'Glauben, nach einer $x$-Messung sei die frühere $z$-Information noch vorhanden.',
      '$\\hat S_x|\\chi\\rangle$ für den Zustand nach einer Messung von $S_x$ halten.'
    ],
    more:[{title:'Spin im Magnetfeld', text:'Das magnetische Moment ist $\\hat{\\boldsymbol\\mu} = \\gamma\\hat{\\mathbf S}$ (für das Elektron $\\gamma \\approx -e/m_e$). Im Feld $B\\hat z$ ist $\\hat H = -\\gamma B\\hat S_z = \\omega\\hat S_z$ mit $\\omega = -\\gamma B$. Ein inhomogenes Feld lenkt die beiden Spinzustände verschieden ab – das ist der Stern-Gerlach-Versuch.'}],
    checks:[
      {q:'Welchen Wert hat $\\langle S_z\\rangle$ im Zustand $|{+x}\\rangle$?', opts:['$0$', '$+\\hbar/2$', '$\\hbar/\\sqrt2$'], a:0, ex:'$P(\\uparrow) = P(\\downarrow) = \\tfrac12$, also $\\langle S_z\\rangle = \\frac\\hbar2\\cdot\\frac12 - \\frac\\hbar2\\cdot\\frac12 = 0$.'},
      {q:'Was ist $\\sigma_y^2$?', opts:['$\\mathbb 1$', '$-\\mathbb 1$', '$0$'], a:0, ex:'Für jede Pauli-Matrix gilt $\\sigma_i^2 = \\mathbb 1$ – passend zu den Eigenwerten $\\pm1$.'}
    ]
  },
  lab:{type:'spin', title:'Bloch-Kugel und Stern-Gerlach',
    text:'Der Zustand $\\cos\\frac\\theta2|\\uparrow\\rangle + e^{i\\varphi}\\sin\\frac\\theta2|\\downarrow\\rangle$ ist ein Pfeil auf der Kugel. Die Balken zeigen die Wahrscheinlichkeiten für die Messwerte $+\\hbar/2$ in $z$, $x$ und $y$. Mit den Knöpfen schickst du 100 Teilchen durch einen Magneten.',
    map:[
      {sym:R`\theta`, ctl:'Polarwinkel θ', says:R`Polarwinkel des Pfeils, im Bogenmaß von $0$ bis $\pi$. In der Formel steht er halbiert: $|\chi\rangle = \cos\tfrac\theta2|\uparrow\rangle + e^{i\varphi}\sin\tfrac\theta2|\downarrow\rangle$. Er allein bestimmt $P(\uparrow z)$ und $\langle S_z\rangle = \tfrac\hbar2\cos\theta$.`},
      {sym:R`\varphi`, ctl:'Azimut φ', says:R`Azimut des Pfeils, die relative Phase $e^{i\varphi}$ zwischen den Komponenten. Er ändert $P(\uparrow z)$ nicht, wohl aber $P(+x)$ und $P(+y)$. Die Larmor-Präzession dreht genau diesen Regler: $\varphi \to \varphi + \omega t$.`},
      {sym:R`\hat n = (\sin\theta\cos\varphi;\ \sin\theta\sin\varphi;\ \cos\theta)`, ctl:'+x', says:R`Die Kugel im Schrägbild mit gestrichelten Achsen: $z$ nach oben, $+y$ nach rechts, $+x$ schräg nach vorn, im Bild nach links unten. Der Pfeil ist $\hat n$. Bei $\theta = \pi/2$ zeigt er für $\varphi = 0$ auf $+x$, für $\varphi = \pi/2$ auf $+y$; $-x$ und $-y$ liegen gegenüber.`},
      {sym:R`|\langle\uparrow|\chi\rangle|^2 = \cos^2\tfrac\theta2`, ctl:'P(↑z)', says:R`Erster Balken: die Wahrscheinlichkeit für $S_z = +\hbar/2$. Er ist $\tfrac12(1 + n_z)$ mit der $z$-Komponente des Pfeils.`},
      {sym:R`|\langle{+x}|\chi\rangle|^2 = \tfrac12(1 + \sin\theta\cos\varphi)`, ctl:'P(+x)', says:R`Zweiter Balken: die Wahrscheinlichkeit für $S_x = +\hbar/2$, also $\tfrac12(1 + n_x)$. Bei $\theta = \pi/2$, $\varphi = 0$ steht er auf $1$.`},
      {sym:R`|\langle{+y}|\chi\rangle|^2 = \tfrac12(1 + \sin\theta\sin\varphi)`, ctl:'P(+y)', says:R`Dritter Balken: die Wahrscheinlichkeit für $S_y = +\hbar/2$, also $\tfrac12(1 + n_y)$. Er hängt von der relativen Phase ab.`},
      {sym:R`N = 100`, ctl:'100 Teilchen, Magnet in z', says:R`Schickt 100 gleich präparierte Teilchen durch einen $z$-Magneten und zählt $\uparrow$ und $\downarrow$. Die Zahlen schwanken zufällig um $100\cdot P(\uparrow z)$.`},
      {sym:R`N = 100`, ctl:'100 Teilchen, Magnet in x', says:R`Dasselbe mit einem $x$-Magneten: Die Zählung schwankt um $100\cdot P(+x)$. Jeder Klick ist eine neue Messreihe am frisch präparierten Zustand.`}
    ],
    predict:{q:'Gleich stellst du $\\theta = \\pi/2$ ein: Der Pfeil liegt in der waagerechten Ebene. Was zeigt der Magnet in $z$-Richtung nach 100 Teilchen?', opts:['ungefähr 50 × ↑ und 50 × ↓, mit Schwankungen', 'genau 50 × ↑ und 50 × ↓, jedes Mal', 'alle in der Mitte, weil $S_z = 0$ ist'], a:0, ex:'$P(\\uparrow) = \\cos^2\\frac\\pi4 = \\frac12$. Jedes Teilchen landet bei $\\uparrow$ oder $\\downarrow$, nie in der Mitte; erst der Mittelwert ist $\\langle S_z\\rangle = 0$. Die Zählung schwankt zufällig um 50.'},
    questions:[
      {q:'Stelle $\\theta = \\pi/2$ (≈ 1,57), $\\varphi = 0$ ein. Welcher Zustand ist das?', opts:['$|{+x}\\rangle$', '$|\\uparrow\\rangle$', '$|{+y}\\rangle$'], a:0, ex:'$\\cos\\frac\\pi4|\\uparrow\\rangle + \\sin\\frac\\pi4|\\downarrow\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle + |\\downarrow\\rangle)$. Dann ist $P(+x) = 1$ und $P(\\uparrow z) = \\tfrac12$.'},
      {q:'Jetzt $\\theta = \\pi/2$, $\\varphi = \\pi/2$. Was zeigt der Magnet in $x$-Richtung nach 100 Teilchen ungefähr?', opts:['etwa 50 × + und 50 × −', 'fast alle 100 × +', 'etwa 75 × + und 25 × −'], a:0, ex:'Das ist $|{+y}\\rangle$ mit $P(+x) = \\tfrac12$. Die genauen Zahlen schwanken zufällig um 50.'}
    ],
    noPic:{q:'Ohne Bild: Der Spin ist im Zustand $|{-y}\\rangle$. Mit welcher Wahrscheinlichkeit misst man $S_z = +\\hbar/2$?', opts:['$1/2$', '$0$', '$1$'], a:0, ex:'$|\\langle\\uparrow|{-y}\\rangle|^2 = |1/\\sqrt2|^2 = 1/2$.'}},
  compare:{
    text:'Gesucht ist $\\langle S_x\\rangle$ für $|\\chi\\rangle = \\frac{1}{\\sqrt5}(2|\\uparrow\\rangle + |\\downarrow\\rangle)$. Zwei richtige Wege:',
    ctx:SPIN({states:{χ:'1/sqrt(5)(2|↑⟩ + |↓⟩)'}, state:'χ'}),
    A:{name:'Über die Wahrscheinlichkeiten', text:'$|\\langle{\\pm x}|\\chi\\rangle|^2 = |2 \\pm 1|^2/10$.', model:['⟨S_x⟩ = ħ/2 |⟨+x|χ⟩|^2 - ħ/2 |⟨-x|χ⟩|^2', '= ħ/2 · 9/10 - ħ/2 · 1/10', '= 2ħ/5']},
    B:{name:'Mit der Matrix', model:['⟨S_x⟩ = ⟨χ|S_x|χ⟩', '= ħ/2 · 1/5 (2, 1)(0, 1; 1, 0)(2; 1)', '= ħ/2 · 4/5', '= 2ħ/5']},
    questions:[
      {q:'Wann ist Weg A bequemer?', opts:['wenn man die Verteilung der Messwerte ohnehin braucht', 'immer, denn er kommt ganz ohne Matrizen aus', 'nur wenn der Zustand Eigenzustand von $\\hat S_x$ ist'], a:0, ex:'Weg A liefert nebenbei die Wahrscheinlichkeiten. Er braucht aber die Eigenzustände. Weg B braucht keine Eigenzustände und funktioniert für jeden Operator.'},
      {q:'Für welchen Operator wäre Weg B deutlich einfacher als Weg A?', opts:['für $\\hat S_{\\hat n}$ in schräger Richtung', 'für $\\hat S_z$, mit Eigenzuständen $|\\uparrow\\rangle, |\\downarrow\\rangle$', 'für keinen, beide sind gleich aufwendig'], a:0, ex:'Für eine schräge Richtung müsste man bei Weg A erst die Eigenzustände ausrechnen. $\\langle\\chi|\\hat S_{\\hat n}|\\chi\\rangle$ braucht nur eine Matrixmultiplikation.'}
    ]
  },
  practice:[
    {id:'spin-p1', title:'Eigenzustände von $\\hat S_x$',
      text:'$\\hat S_x = \\frac\\hbar2\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $|{\\pm x}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{\\pm1}$.',
      ctx:SPIN(),
      goals:[
        {id:'a', prompt:'a) Zeige $\\hat S_x|{+x}\\rangle = \\frac\\hbar2|{+x}\\rangle$.', type:'show', from:'S_x |+x⟩', to:'ħ/2 |+x⟩', points:2, ph:'S_x |+x⟩ = ħ/2 (0, 1; 1, 0) · 1/sqrt(2) (1; 1)',
          hints:['Zu zeigen ist: $\\hat S_x$ angewendet auf die Spalte $|{+x}\\rangle$ ergibt ein Vielfaches derselben Spalte.', 'Schreib $\\hat S_x$ als Matrix und $|{+x}\\rangle$ als Spalte. Matrix mal Spalte: $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}\\binom ab = \\binom ba$.', 'Erste Zeile: `S_x |+x⟩ = ħ/2 (0, 1; 1, 0) · 1/sqrt(2) (1; 1)`. Was ergibt das Produkt?'],
          model:['S_x |+x⟩ = ħ/2 (0, 1; 1, 0) · 1/sqrt(2) (1; 1)', '= ħ/2 · 1/sqrt(2) (1; 1)', '= ħ/2 |+x⟩']},
        {id:'b', prompt:'b) Zeige $\\hat S_x|{-x}\\rangle = -\\frac\\hbar2|{-x}\\rangle$.', type:'show', from:'S_x |-x⟩', to:'-ħ/2 |-x⟩', points:2,
          hints:['Wie in a), jetzt mit $|{-x}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{-1}$.', '$\\sigma_x$ vertauscht die beiden Komponenten.', 'Nach dem Vertauschen steht $\\frac{1}{\\sqrt2}\\binom{-1}{1}$ da – klammere $-1$ aus.'],
          model:['S_x |-x⟩ = ħ/2 (0, 1; 1, 0) · 1/sqrt(2) (1; -1)', '= ħ/2 · 1/sqrt(2) (-1; 1)', '= -ħ/2 |-x⟩']}
      ]},
    {id:'spin-p2', title:'Normieren, messen, mitteln',
      text:'Der Spin ist im Zustand $|\\chi\\rangle = A\\,(2|\\uparrow\\rangle + |\\downarrow\\rangle)$.',
      ctx:SPIN({states:{χ:'A(2|↑⟩ + |↓⟩)'}, unknowns:{A:{ref:'1/sqrt(5)', alt:['-1/sqrt(5)']}}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, ph:'⟨χ|χ⟩ = 1',
          hints:['Normierung heißt $\\langle\\chi|\\chi\\rangle = 1$.', 'Für $|\\chi\\rangle = \\binom ab$ ist $\\langle\\chi|\\chi\\rangle = |a|^2 + |b|^2$.', 'Es folgt $|A|^2(4 + 1) = 1$ – jetzt nach $A$ auflösen.'],
          model:['⟨χ|χ⟩ = 1', '|A|^2 (4 + 1) = 1', 'A = 1/sqrt(5)']},
        {id:'b', prompt:'b) Mit welcher Wahrscheinlichkeit misst man $S_x = +\\hbar/2$?', type:'value', target:'9/10', points:2, ph:'P = |⟨+x|χ⟩|^2',
          hints:['Bornsche Regel: Projiziere auf den Eigenzustand von $\\hat S_x$ zum Messwert $+\\hbar/2$.', '$\\langle{+x}| = \\frac{1}{\\sqrt2}(1, 1)$.', 'Das Skalarprodukt ist $\\frac{1}{\\sqrt{10}}(2 + 1)$; jetzt quadrieren.'],
          model:['P = |⟨+x|χ⟩|^2', '= |1/sqrt(2) (1, 1) · 1/sqrt(5) (2; 1)|^2', '= 9/10']},
        {id:'c', prompt:'c) Berechne $\\langle S_x\\rangle$.', type:'value', target:'2ħ/5', points:2,
          hints:['Erwartungswert = Summe aus Messwert mal Wahrscheinlichkeit.', '$P(-x) = 1 - P(+x)$.', '$\\langle S_x\\rangle = \\frac\\hbar2\\cdot\\frac{9}{10} - \\frac\\hbar2\\cdot\\frac{1}{10}$.'],
          model:['⟨S_x⟩ = ħ/2 · 9/10 - ħ/2 · 1/10', '= 2ħ/5'],
          mistakes:[{expr:'9ħ/20', msg:'Das ist nur der Beitrag von $+\\hbar/2$. Der Messwert $-\\hbar/2$ mit Wahrscheinlichkeit $1/10$ fehlt.'}]}
      ]},
    {id:'spin-p3', title:'Stern-Gerlach-Folge',
      text:'Ein Strahl im Zustand $|\\uparrow\\rangle$ geht durch einen Magneten in $x$-Richtung; nur $+x$ geht weiter in einen Magneten in $z$-Richtung.',
      ctx:SPIN(),
      goals:[
        {id:'a', prompt:'a) Welcher Anteil des ursprünglichen Strahls kommt am Ende im Kanal $\\downarrow$ an?', type:'value', target:'1/4', points:2, ph:'P = |⟨+x|↑⟩|^2 |⟨+x|↓⟩|^2',
          hints:['Jeder Magnet mit Ausblenden ist eine Messung, die einen neuen Zustand präpariert; die Wahrscheinlichkeiten multiplizieren sich.', 'Erst die Wahrscheinlichkeit für $+x$, dann für $\\downarrow$ im neu präparierten Zustand $|{+x}\\rangle$.', '$|\\langle\\downarrow|{+x}\\rangle|^2 = |\\langle{+x}|\\downarrow\\rangle|^2$; beide Faktoren sind $\\frac12$.'],
          model:['P = |⟨+x|↑⟩|^2 |⟨+x|↓⟩|^2', '= 1/2 · 1/2', '= 1/4']},
        {id:'b', prompt:'b) Und wenn der $x$-Magnet entfernt wird?', type:'value', target:'0', points:1,
          hints:['Ohne $x$-Magnet trifft $|\\uparrow\\rangle$ direkt auf den $z$-Magneten.', 'Gesucht ist $|\\langle\\downarrow|\\uparrow\\rangle|^2$.'],
          model:['|⟨↓|↑⟩|^2 = 0'], note:'Erst die Messung in $x$-Richtung macht $\\downarrow$ wieder möglich.'}
      ]},
    {id:'spin-p4', title:'Larmor-Präzession',
      text:'Im Magnetfeld $B\\hat z$ ist $\\hat H = \\omega\\hat S_z$. Zur Zeit $0$ ist der Spin im Zustand $|{+x}\\rangle$. Es gilt $\\hat H|\\uparrow\\rangle = \\frac{\\hbar\\omega}{2}|\\uparrow\\rangle$, $\\hat H|\\downarrow\\rangle = -\\frac{\\hbar\\omega}{2}|\\downarrow\\rangle$.',
      ctx:SPIN({params:{ω:'pos'}, mat:{preset:'spin', mats:{H:'ω S_z'}}, states:{χ:'1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Zeige $e^{-i\\hat Ht/\\hbar}|{+x}\\rangle = \\frac{1}{\\sqrt2}\\left(e^{-i\\omega t/2}|\\uparrow\\rangle + e^{i\\omega t/2}|\\downarrow\\rangle\\right)$.', type:'show', from:'e^(-iHt/ħ) |+x⟩', to:'1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)', points:2,
          hints:['Zerlege $|{+x}\\rangle$ in Eigenzustände von $\\hat H$.', 'Auf einen Eigenzustand wirkt $e^{-i\\hat Ht/\\hbar}$ als Zahl $e^{-iEt/\\hbar}$.', '$E_\\uparrow = +\\hbar\\omega/2$ gibt $e^{-i\\omega t/2}$, $E_\\downarrow = -\\hbar\\omega/2$ gibt $e^{+i\\omega t/2}$.'],
          model:[{l:'e^(-iHt/ħ) |+x⟩ = 1/sqrt(2) (e^(-iHt/ħ)|↑⟩ + e^(-iHt/ħ)|↓⟩)', w:'linear'}, {l:'= 1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)', w:'E = ±ħω/2'}]},
        {id:'b', prompt:'b) Berechne $\\langle S_x\\rangle(t)$ im Zustand $|\\chi(t)\\rangle$ aus a).', type:'value', target:'ħ/2 cos(ωt)', points:2, ph:'⟨S_x⟩ = ⟨χ|S_x|χ⟩',
          hints:['$\\langle S_x\\rangle = \\langle\\chi|\\hat S_x|\\chi\\rangle$ mit dem Zustand aus a).', 'Mit $|\\chi\\rangle = \\binom ab$ ist $\\langle\\chi|\\sigma_x|\\chi\\rangle = a^*b + b^*a$.', 'Hier ist $a^*b = \\frac12e^{i\\omega t}$; dazu kommt das komplex Konjugierte.'],
          model:['⟨S_x⟩ = ⟨χ|S_x|χ⟩', '= ħ/2 · 1/2 (e^(-iωt) + e^(iωt))', '= ħ/2 cos(ωt)']},
        {id:'c', prompt:'c) Berechne $\\langle S_y\\rangle(t)$.', type:'value', target:'ħ/2 sin(ωt)', points:2,
          hints:['Wie b), jetzt mit $\\sigma_y$.', '$\\langle\\chi|\\sigma_y|\\chi\\rangle = -ia^*b + ib^*a$.', 'Es ergibt sich $-\\frac i2(e^{i\\omega t} - e^{-i\\omega t})$ – Euler-Formel für den Sinus.'],
          model:['⟨S_y⟩ = ħ/2 · i/2 (e^(-iωt) - e^(iωt))', '= ħ/2 sin(ωt)'], note:'Der Erwartungswert des Spins dreht sich mit $\\omega$ um die $z$-Achse; $\\langle S_z\\rangle = 0$ bleibt.'}
      ]},
    {id:'spin-p5', title:'Pauli-Algebra',
      text:'$\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$, $\\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$, $\\hat S_i = \\frac\\hbar2\\sigma_i$.',
      ctx:SPIN(),
      goals:[
        {id:'a', prompt:'a) Zeige $\\sigma_x\\sigma_y = i\\sigma_z$.', type:'show', from:'σ_x σ_y', to:'i σ_z', points:2,
          hints:['Matrizen multiplizieren: Eintrag $(j, k)$ ist Zeile $j$ mal Spalte $k$.', 'Das Produkt ist diagonal; vergleiche es mit $i\\sigma_z = \\begin{pmatrix}i&0\\\\0&-i\\end{pmatrix}$.', 'Erste Zeile: `σ_x σ_y = (0, 1; 1, 0)(0, -i; i, 0)`.'],
          model:['σ_x σ_y = (0, 1; 1, 0)(0, -i; i, 0)', '= (i, 0; 0, -i)', '= i σ_z']},
        {id:'b', prompt:'b) Zeige damit $[\\hat S_x, \\hat S_y] = i\\hbar\\hat S_z$. (Es gilt $\\sigma_y\\sigma_x = -i\\sigma_z$.)', type:'show', from:'[S_x, S_y]', to:'iħ S_z', points:3,
          hints:['Setze $\\hat S_i = \\frac\\hbar2\\sigma_i$ in den Kommutator ein.', '$[\\hat S_x, \\hat S_y] = \\frac{\\hbar^2}{4}(\\sigma_x\\sigma_y - \\sigma_y\\sigma_x)$.', '$\\sigma_x\\sigma_y - \\sigma_y\\sigma_x = i\\sigma_z - (-i\\sigma_z) = 2i\\sigma_z$.'],
          model:['[S_x, S_y] = ħ^2/4 (σ_x σ_y - σ_y σ_x)', '= ħ^2/4 (i σ_z + i σ_z)', '= iħ S_z']}
      ]},
    {id:'spin-p6', title:'Spin in schräger Richtung',
      text:'Für die Richtung $\\hat n = (\\sin\\theta, 0, \\cos\\theta)$ ist $\\hat S_{\\hat n} = \\frac\\hbar2\\begin{pmatrix}\\cos\\theta & \\sin\\theta\\\\ \\sin\\theta & -\\cos\\theta\\end{pmatrix}$. In der Eingabe heißt die Matrix `S_n`, die Einheitsmatrix `I`.',
      ctx:SPIN({params:{θ:'pos'}, mat:{preset:'spin', mats:{S_n:'ħ/2 (cos(θ), sin(θ); sin(θ), -cos(θ))'}}, unknowns:{λ:{ref:'ħ/2', alt:['-ħ/2'], kind:'real'}}}),
      goals:[{id:'a', prompt:'Bestimme die Eigenwerte $\\lambda$ von $\\hat S_{\\hat n}$ (am Ende den positiven: $\\lambda = \\dots$).', type:'solve', unknown:'λ', points:3, ph:'det(S_n - λ I) = 0',
        hints:['Charakteristisches Polynom: $\\det(\\hat S_{\\hat n} - \\lambda\\mathbb 1) = 0$.', '$\\cos^2\\theta + \\sin^2\\theta = 1$.', 'Ausmultipliziert: $(\\frac\\hbar2\\cos\\theta - \\lambda)(-\\frac\\hbar2\\cos\\theta - \\lambda) - \\frac{\\hbar^2}{4}\\sin^2\\theta = \\lambda^2 - \\frac{\\hbar^2}{4}$.'],
        model:['det(S_n - λ I) = 0', 'det((ħ/2 cos(θ) - λ, ħ/2 sin(θ); ħ/2 sin(θ), -ħ/2 cos(θ) - λ)) = 0', 'λ^2 - ħ^2/4 = 0', 'λ = ħ/2'],
        note:'Der zweite Eigenwert ist $-\\hbar/2$: Jede Spinkomponente hat die Messwerte $\\pm\\hbar/2$, egal in welche Richtung.'}]}
  ],
  concept:[
    {id:'spin-c1', type:'mc2', seg:'spin-t4', lex:'spin-eigenzustaende',
      q:'Die Achsen $z$ und $x$ stehen im Raum senkrecht aufeinander. Was gilt für die Zustände $|{\\uparrow_z}\\rangle = |\\uparrow\\rangle$ und $|{\\uparrow_x}\\rangle = |{+x}\\rangle$?',
      opts:['$\\langle\\uparrow|{+x}\\rangle = 1/\\sqrt2$, sie sind nicht orthogonal', '$\\langle\\uparrow|{+x}\\rangle = 0$, sie sind orthogonal', '$\\langle\\uparrow|{+x}\\rangle = 1$, sie sind gleich'], a:0,
      ex:'$\\langle\\uparrow|{+x}\\rangle = (1, 0)\\cdot\\frac{1}{\\sqrt2}\\binom11 = \\frac{1}{\\sqrt2}$. Eine Messung von $S_z$ an $|{+x}\\rangle$ gibt $\\uparrow$ mit Wahrscheinlichkeit $\\frac12$, nicht $0$.',
      reason:{q:'Warum?', opts:['Orthogonal sind Spinzustände nur zu entgegengesetzten Richtungen.', 'Senkrechte Raumrichtungen geben immer orthogonale Zustände.', 'Zwei verschiedene Spinzustände sind nie orthogonal.'], a:0, ex:'$|\\langle{+\\hat m}|{+\\hat n}\\rangle|^2 = \\cos^2\\frac\\alpha2$: null erst für $\\alpha = 180^\\circ$. Der Hilbertraum $\\mathbb C^2$ ist nicht der Ortsraum; $|\\uparrow\\rangle$ und $|\\downarrow\\rangle$ sind orthogonal.'}},
    {id:'spin-c2', type:'dialog', seg:'spin-t2',
      text:'Gesucht ist ein Zustand, der zu $|\\uparrow\\rangle$ orthogonal ist, und die Raumrichtung, zu der er gehört.',
      people:[{name:'Lena', says:'Orthogonal heißt senkrecht. Also gehört dazu jede Richtung in der $x$-$y$-Ebene, zum Beispiel $|{+x}\\rangle$.'},
        {name:'Jonas', says:'Orthogonal zu $|\\uparrow\\rangle$ ist nur $|\\downarrow\\rangle$, bis auf eine Phase. Dazu gehört die Richtung $-z$, also die Gegenrichtung.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Jonas. $\\langle\\uparrow|{+x}\\rangle = 1/\\sqrt2 \\ne 0$. Im $\\mathbb C^2$ gibt es zu $|\\uparrow\\rangle$ nur eine orthogonale Richtung, $|\\downarrow\\rangle$; auf der Bloch-Kugel ist das der Südpol. Lena überträgt „senkrecht im Raum“ auf den Hilbertraum.'},
    {id:'spin-c3', type:'mc', seg:'spin-t5', lex:'stern-gerlach',
      q:'Ein Strahl im Zustand $|\\uparrow\\rangle$ geht durch einen $x$-Magneten. **Beide** Teilstrahlen laufen weiter, jeder in einen eigenen $z$-Magneten. Welcher Anteil aller Teilchen landet insgesamt im Kanal $\\downarrow$?',
      opts:['$1/2$', '$0$', '$1/4$', '$1$'], a:0,
      ex:'Hinter dem $x$-Magneten sind die Wege getrennt: Je die Hälfte ist in $|{+x}\\rangle$ bzw. $|{-x}\\rangle$. In jedem $z$-Magneten landet die Hälfte bei $\\downarrow$: $\\frac12\\cdot\\frac12 + \\frac12\\cdot\\frac12 = \\frac12$. „$0$“ würde gelten, wenn der $x$-Magnet nichts gemessen hätte; „$1/4$“ ist das Ergebnis mit nur einem Teilstrahl.'},
    {id:'spin-c4', type:'mc2', seg:'spin-t2',
      q:'Unterscheiden sich $\\frac{1}{\\sqrt2}(|\\uparrow\\rangle + |\\downarrow\\rangle)$ und $\\frac{1}{\\sqrt2}(|\\uparrow\\rangle - |\\downarrow\\rangle)$ physikalisch?',
      opts:['ja, eine Messung von $S_x$ unterscheidet sie sicher', 'nein, sie haben gleiche Wahrscheinlichkeiten für $S_z$', 'nein, sie unterscheiden sich nur um eine Phase'], a:0,
      ex:'Es sind $|{+x}\\rangle$ und $|{-x}\\rangle$. Sie sind orthogonal; eine Messung von $S_x$ ergibt für den einen sicher $+\\hbar/2$, für den anderen sicher $-\\hbar/2$.',
      reason:{q:'Warum?', opts:['Die relative Phase zwischen den Komponenten ist messbar.', 'Auch ein gemeinsamer Faktor $e^{i\\alpha}$ ist messbar.', 'Gleiche $|a|^2$ und $|b|^2$ heißen gleicher Zustand.'], a:0, ex:'Eine globale Phase ist unbeobachtbar, eine relative nicht: Sie bestimmt die Wahrscheinlichkeiten für $S_x$ und $S_y$.'}},
    {id:'spin-c5', type:'dialog', seg:'spin-t6',
      text:'Ein Spin wird mit $e^{-i2\\pi\\hat S_z/\\hbar}$ um $2\\pi$ um die $z$-Achse gedreht. Danach ist er im Zustand $-|\\chi\\rangle$.',
      people:[{name:'Lena', says:'Dann ist er in einem anderen Zustand als vorher. Mit genug Messungen an gleich präparierten Spins sollte man das Vorzeichen sehen.'},
        {name:'Jonas', says:'Alle Wahrscheinlichkeiten sind gleich geblieben. Das Vorzeichen zeigt sich nur, wenn der gedrehte Teil mit einem ungedrehten interferiert.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Jonas. $-1$ ist eine globale Phase: $|\\langle\\varphi|(-\\chi)\\rangle|^2 = |\\langle\\varphi|\\chi\\rangle|^2$ für jedes $\\varphi$. Im Neutronen-Interferometer wird nur der Teilstrahl auf einem Weg gedreht; dann ist $-1$ eine *relative* Phase und kehrt die Interferenz um.'},
    {id:'spin-c6', type:'mc', seg:'spin-t3', lex:'messpostulat',
      q:'Der Spin ist $|\\uparrow\\rangle$. Jemand rechnet $\\hat S_x|\\uparrow\\rangle = \\frac\\hbar2|\\downarrow\\rangle$ und folgert: „Nach einer Messung von $S_x$ ist der Spin in $|\\downarrow\\rangle$.“ Was stimmt?',
      opts:['danach $|{+x}\\rangle$ oder $|{-x}\\rangle$, je mit $P = \\frac12$', 'danach $|\\downarrow\\rangle$, wie die Rechnung zeigt', 'danach $|\\uparrow\\rangle$, $S_x$ ändert $S_z$ nicht'], a:0,
      ex:'Einen Operator anwenden ist keine Messung. Nach der Messung ist der Spin im Eigenzustand zum gefundenen Messwert, also $|{+x}\\rangle$ oder $|{-x}\\rangle$. $\\hat S_x|\\uparrow\\rangle$ ist nicht einmal normiert.'}
  ],
  sketch:[
    {id:'spin-s1', title:'$P(+x)$ während der Larmor-Präzession', kind:'curve', draw:'f',
      text:'Ein Spin startet bei $t = 0$ im Zustand $|{+x}\\rangle$ und präzediert im Feld $B\\hat z$ mit $\\hat H = \\omega\\hat S_z$. Skizziere die Wahrscheinlichkeit $P(+x)$, bei einer Messung von $S_x$ zur Zeit $t$ den Wert $+\\hbar/2$ zu erhalten, für $0 \\le t \\le 4\\pi/\\omega$.',
      plot:{x:[0, 1], y:[0, 1.15], abs:true, xlab:'t', ylab:'P(+x)', ticks:SPIN_SK.T, yticks:[{y:0.5, lab:'1/2'}, {y:1, lab:'1'}]},
      f:x => Math.cos(2 * Math.PI * x) ** 2,
      checks:[
        {id:'null', name:'Nullstellen', type:'zero', at:[0.25, 0.75], tol:0.03, msg:'Wohin zeigt der Bloch-Pfeil bei $t = \\pi/\\omega$? Wie groß ist dann $P(+x)$?'},
        {id:'periode', name:'Periode', type:'extrema', n:3, msg:'Nach welcher Zeit ist der Spin zum ersten Mal wieder in $|{+x}\\rangle$? Deine Kurve hat {got} Umkehrpunkte zwischen $0$ und $4\\pi/\\omega$. (Abschnitt ‚Spin im Magnetfeld‘)'},
        {id:'mittel', name:'Mittelwert', type:'level', v:0.5, tol:0.12, msg:'Wie oft misst man im Mittel über viele Umläufe $+\\hbar/2$? Der Mittelwert deiner Kurve ist {got}.'}
      ],
      reveal:'Der Bloch-Pfeil läuft in der $x$-$y$-Ebene mit $\\omega$ um die $z$-Achse. Mit dem Winkel $\\alpha = \\omega t$ zwischen Pfeil und $x$-Achse ist $P(+x) = \\cos^2\\frac{\\omega t}{2} = \\tfrac12(1 + \\cos\\omega t)$. Bei $t = \\pi/\\omega$ zeigt der Pfeil nach $-x$, und $P(+x) = 0$. Nach $2\\pi/\\omega$ ist der Spin bis auf den Faktor $-1$ wieder $|{+x}\\rangle$; dieser globale Faktor ändert keine Wahrscheinlichkeit. Die Periode von $P$ ist also $2\\pi/\\omega$, nicht $4\\pi/\\omega$.',
      hints:['Wohin zeigt der Bloch-Pfeil zur Zeit $t$? Nutze dann $P = \\cos^2\\frac\\alpha2$ für den Winkel $\\alpha$ zwischen Zustand und Messrichtung (Abschnitt ‚Messen in beliebiger Richtung‘).', 'Larmor-Präzession: Der Pfeil dreht sich mit $\\omega$ um die Feldrichtung $z$. Der Winkel zur $x$-Achse ist $\\alpha = \\omega t$.'],
      wrong:[
        {f:x => 1, fails:['null', 'periode', 'mittel'], why:'keine Präzession: das Feld in $z$-Richtung wirke nur auf $S_z$'},
        {f:x => Math.cos(Math.PI * x) ** 2, fails:['null', 'periode'], why:'Periode $4\\pi/\\omega$: Vorzeichen $-1$ nach $2\\pi$ für eine messbare Änderung gehalten'},
        {f:x => Math.cos(4 * Math.PI * x) ** 2, fails:['null', 'periode'], why:'Frequenz verdoppelt: Pfeil laufe mit $2\\omega$ um'}
      ]},
    {id:'spin-s2', title:'Bloch-Pfeil nach einer Viertel- und einer halben Larmor-Periode', kind:'arrows',
      text:'Ein Spin startet in $|{+x}\\rangle$ im Feld $B\\hat z$ mit $\\hat H = \\omega\\hat S_z$, $\\omega > 0$. Gegeben ist $\\langle\\mathbf S\\rangle$ bei $t = 0$ in der $x$-$y$-Ebene; der Einheitskreis hat den Radius $\\hbar/2$. Zeichne $\\langle\\mathbf S\\rangle$ zu den Zeiten $t_1 = \\pi/(2\\omega)$ und $t_2 = \\pi/\\omega$, jeden Pfeil in einem Zug vom Ursprung zur Spitze.',
      plot:{x:[-1.5, 1.5], y:[-1.5, 1.5], abs:true, xlab:'\\langle S_x\\rangle', ylab:'\\langle S_y\\rangle', unit:true, grid:0.5},
      given:[{from:[0, 0], to:[1, 0], lab:'t = 0'}],
      want:[
        {from:[0, 0], to:[0, 1], lab:'t_1', msg:'In welche Richtung dreht sich der Pfeil für $\\omega > 0$, und um welchen Winkel bis $t_1 = \\pi/(2\\omega)$? Schau auf $\\langle S_x\\rangle(t)$ und $\\langle S_y\\rangle(t)$ in der Herleitung.'},
        {from:[0, 0], to:[-1, 0], lab:'t_2', msg:'Um welchen Winkel hat sich der Pfeil bis $t_2 = \\pi/\\omega$ gedreht? Ändert sich seine Länge?'}
      ],
      reveal:'$\\langle S_x\\rangle = \\frac\\hbar2\\cos\\omega t$, $\\langle S_y\\rangle = \\frac\\hbar2\\sin\\omega t$: Der Pfeil dreht sich um den Winkel $\\omega t$ gegen den Uhrzeigersinn um die $z$-Achse, seine Länge bleibt $\\hbar/2$. Bei $t_1$ zeigt er nach $+y$ ($90°$), bei $t_2$ nach $-x$ ($180°$). Der Drehwinkel des Pfeils ist $\\omega t$, nicht $\\omega t/2$; die halben Winkel stehen nur in den Phasenfaktoren $e^{\\mp i\\omega t/2}$ der Amplituden.',
      hints:['Bestimme $\\langle S_x\\rangle$ und $\\langle S_y\\rangle$ zu beiden Zeiten. Das sind die Koordinaten der Pfeilspitzen.', 'Aus der Herleitung im Abschnitt ‚Spin im Magnetfeld‘: $\\langle S_x\\rangle = \\frac\\hbar2\\cos\\omega t$, $\\langle S_y\\rangle = \\frac\\hbar2\\sin\\omega t$.'],
      wrong:[
        {arrows:[{from:[0, 0], to:[0, -1]}, {from:[0, 0], to:[-1, 0]}], fails:[0], why:'Drehsinn vertauscht (im Uhrzeigersinn)'},
        {arrows:[{from:[0, 0], to:[0.7071, 0.7071]}, {from:[0, 0], to:[0, 1]}], fails:[1], why:'halber Winkel $\\omega t/2$ aus den Phasenfaktoren $e^{\\mp i\\omega t/2}$ übernommen'},
        {arrows:[{from:[0, 0], to:[1, 0]}, {from:[0, 0], to:[1, 0]}], fails:[0, 1], why:'keine Präzession: das Feld in $z$ ändere die $x$-Komponente nicht'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'spin-f1', title:'Normieren und Eigenzustand prüfen', text:'$|\\chi\\rangle = A\\,(|\\uparrow\\rangle + 2i|\\downarrow\\rangle)$ und $|{-y}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{-i}$.',
      ctx:SPIN({states:{χ:'A(|↑⟩ + 2i|↓⟩)'}, unknowns:{A:{ref:'1/sqrt(5)', alt:['-1/sqrt(5)']}}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, model:['⟨χ|χ⟩ = 1', '|A|^2 (1 + 4) = 1', 'A = 1/sqrt(5)']},
        {id:'b', prompt:'b) Zeige $\\hat S_y|{-y}\\rangle = -\\frac\\hbar2|{-y}\\rangle$.', type:'show', from:'S_y |-y⟩', to:'-ħ/2 |-y⟩', points:2,
          model:['S_y |-y⟩ = ħ/2 (0, -i; i, 0) · 1/sqrt(2) (1; -i)', '= ħ/2 · 1/sqrt(2) (-1; i)', '= -ħ/2 |-y⟩']}
      ]}},
    {aim:1, task:{id:'spin-f2', title:'Erwartungswert und Messfolge', text:'Der Spin ist im Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt5}(2|\\uparrow\\rangle + |\\downarrow\\rangle)$.',
      ctx:SPIN({states:{χ:'1/sqrt(5)(2|↑⟩ + |↓⟩)'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle S_z\\rangle$.', type:'value', target:'3ħ/10', points:2, model:['⟨S_z⟩ = ħ/2 · 4/5 - ħ/2 · 1/5', '= 3ħ/10']},
        {id:'b', prompt:'b) Ein Strahl in diesem Zustand geht durch einen $x$-Magneten; nur $+x$ geht weiter in einen $z$-Magneten. Welcher Anteil des ursprünglichen Strahls landet am Ende bei $\\uparrow$?', type:'value', target:'9/20', points:2,
          model:['P = |⟨+x|χ⟩|^2 |⟨↑|+x⟩|^2', '= 9/10 · 1/2', '= 9/20']}
      ]}},
    {aim:2, task:{id:'spin-f3', title:'Präzession aus $|{+y}\\rangle$', text:'Im Feld $B\\hat z$ ist $\\hat H = \\omega\\hat S_z$. Zur Zeit $0$ ist der Spin im Zustand $|{+y}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{i}$.',
      ctx:SPIN({params:{ω:'pos'}, mat:{preset:'spin', mats:{H:'ω S_z'}}, states:{χ:'1/sqrt(2)(e^(-iωt/2)|↑⟩ + i e^(iωt/2)|↓⟩)'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'Berechne $\\langle S_y\\rangle(t)$.', type:'value', target:'ħ/2 cos(ωt)', points:3,
          model:['|χ(t)⟩ = e^(-iHt/ħ) |+y⟩', '= 1/sqrt(2)(e^(-iωt/2)|↑⟩ + i e^(iωt/2)|↓⟩)', '⟨S_y⟩ = ⟨χ|S_y|χ⟩', '= ħ/2 · 1/2 (e^(iωt) + e^(-iωt))', '= ħ/2 cos(ωt)']}
      ]}},
    {aim:'k', id:'spin-fk1', type:'mc2',
      q:'Der Spin ist im Zustand $|\\uparrow\\rangle$, das Feld ist $B\\hat z$. Ändert sich $\\langle\\mathbf S\\rangle$ mit der Zeit?',
      opts:['nein, $\\langle\\mathbf S\\rangle = (0, 0, \\hbar/2)$ bleibt', 'ja, er präzediert mit $\\omega$ um $z$', 'ja, er klappt langsam nach unten'], a:0,
      ex:'$|\\uparrow\\rangle$ ist Eigenzustand von $\\hat H = \\omega\\hat S_z$. Es entsteht nur der Faktor $e^{-i\\omega t/2}$.',
      reason:{q:'Warum?', opts:['Ein Eigenzustand von $\\hat H$ ändert nur seine globale Phase.', 'Ein Feld in $z$-Richtung wirkt nicht auf den Spin.', 'Präzession gibt es nur in inhomogenen Feldern.'], a:0, ex:'Präzession entsteht durch die sich ändernde *relative* Phase zwischen $|\\uparrow\\rangle$ und $|\\downarrow\\rangle$. Im Zustand $|\\uparrow\\rangle$ gibt es keinen $|\\downarrow\\rangle$-Anteil.'}},
    {aim:'k', id:'spin-fk2', type:'dialog',
      text:'Gefragt ist, ob $|{+x}\\rangle$ und $|{+y}\\rangle$ orthogonal sind.',
      people:[{name:'Lena', says:'Die $x$- und die $y$-Achse stehen senkrecht. Also ist $\\langle{+x}|{+y}\\rangle = 0$.'},
        {name:'Jonas', says:'$\\langle{+x}|{+y}\\rangle = \\frac12(1 + i) \\ne 0$. Orthogonal zu $|{+x}\\rangle$ ist nur $|{-x}\\rangle$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Jonas. $|\\langle{+x}|{+y}\\rangle|^2 = \\frac12 = \\cos^2 45^\\circ$. Senkrecht im Raum heißt nicht orthogonal im Hilbertraum.'},
    {aim:2, sketch:{id:'spin-fs1', title:'$\\langle S_x\\rangle(t)$ für den Start in $|{+y}\\rangle$', kind:'curve', draw:'f',
      text:'Ein Spin ist bei $t = 0$ im Zustand $|{+y}\\rangle$ und präzediert im Feld $B\\hat z$ mit $\\hat H = \\omega\\hat S_z$, $\\omega > 0$. Skizziere $\\langle S_x\\rangle(t)$ für $0 \\le t \\le 4\\pi/\\omega$. Die Höhe ist frei; es zählen Vorzeichen, Nullstellen und Periode.',
      plot:{x:[0, 1], xlab:'t', ylab:'\\langle S_x\\rangle', ticks:SPIN_SK.T},
      f:x => -Math.sin(4 * Math.PI * x),
      checks:[
        {id:'start', name:'Startwert', type:'zero', at:[0], msg:'Wie groß ist $\\langle S_x\\rangle$ im Zustand $|{+y}\\rangle$?'},
        {id:'richtung', name:'Startrichtung', type:'sign', s:-1, range:[0.02, 0.23], msg:'In welche Richtung dreht sich der Bloch-Pfeil für $\\omega > 0$? Wird $\\langle S_x\\rangle$ dann zuerst positiv oder negativ?'},
        {id:'periode', name:'Periode', type:'nodes', n:3, range:[0.03, 0.97], msg:'Wie lange dauert ein voller Umlauf des Bloch-Pfeils? Zwischen $0$ und $4\\pi/\\omega$ hat deine Skizze {got} Nulldurchgänge.'}
      ],
      reveal:'Der Bloch-Pfeil startet bei $+y$ und dreht sich mit $\\omega$ gegen den Uhrzeigersinn um die $z$-Achse. Nach einer Viertelperiode zeigt er nach $-x$, daher $\\langle S_x\\rangle = -\\frac\\hbar2\\sin\\omega t$. Dasselbe folgt aus $|\\chi(t)\\rangle = \\frac{1}{\\sqrt2}\\big(e^{-i\\omega t/2}|\\uparrow\\rangle + i\\,e^{i\\omega t/2}|\\downarrow\\rangle\\big)$ mit $\\langle S_x\\rangle = \\hbar\\,\\mathrm{Re}(a^*b)$. Die Periode ist $2\\pi/\\omega$; der Faktor $-1$ nach einem Umlauf ist eine globale Phase.',
      wrong:[
        {f:x => Math.sin(4 * Math.PI * x), fails:['richtung'], why:'Drehsinn der Präzession vertauscht'},
        {f:x => Math.cos(4 * Math.PI * x), fails:['start'], why:'Startrichtung nicht beachtet: Start wie bei $|{+x}\\rangle$'},
        {f:x => -Math.sin(2 * Math.PI * x), fails:['periode'], why:'Periode $4\\pi/\\omega$: Vorzeichen $-1$ nach $2\\pi$ für eine messbare Änderung gehalten'}
      ], points:3}}
  ],
  finalB:[
    {aim:0, task:{id:'spin-g1', title:'Normieren und Eigenzustand prüfen', text:'$|\\chi\\rangle = A\\,(2|\\uparrow\\rangle - i|\\downarrow\\rangle)$ und $|{+y}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{i}$.',
      ctx:SPIN({states:{χ:'A(2|↑⟩ - i|↓⟩)'}, unknowns:{A:{ref:'1/sqrt(5)', alt:['-1/sqrt(5)']}}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, model:['⟨χ|χ⟩ = 1', '|A|^2 (4 + 1) = 1', 'A = 1/sqrt(5)']},
        {id:'b', prompt:'b) Zeige $\\hat S_y|{+y}\\rangle = \\frac\\hbar2|{+y}\\rangle$.', type:'show', from:'S_y |+y⟩', to:'ħ/2 |+y⟩', points:2,
          model:['S_y |+y⟩ = ħ/2 (0, -i; i, 0) · 1/sqrt(2) (1; i)', '= ħ/2 · 1/sqrt(2) (1; i)', '= ħ/2 |+y⟩']}
      ]}},
    {aim:1, task:{id:'spin-g2', title:'Erwartungswert und Messfolge', text:'Der Spin ist im Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt5}(|\\uparrow\\rangle + 2|\\downarrow\\rangle)$.',
      ctx:SPIN({states:{χ:'1/sqrt(5)(|↑⟩ + 2|↓⟩)'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle S_z\\rangle$.', type:'value', target:'-3ħ/10', points:2, model:['⟨S_z⟩ = ħ/2 · 1/5 - ħ/2 · 4/5', '= -3ħ/10']},
        {id:'b', prompt:'b) Ein Strahl in diesem Zustand geht durch einen $x$-Magneten; nur $+x$ geht weiter in einen $z$-Magneten. Welcher Anteil des ursprünglichen Strahls landet am Ende bei $\\downarrow$?', type:'value', target:'9/20', points:2,
          model:['P = |⟨+x|χ⟩|^2 |⟨↓|+x⟩|^2', '= 9/10 · 1/2', '= 9/20']}
      ]}},
    {aim:2, task:{id:'spin-g3', title:'Präzession aus $|{-y}\\rangle$', text:'Im Feld $B\\hat z$ ist $\\hat H = \\omega\\hat S_z$. Zur Zeit $0$ ist der Spin im Zustand $|{-y}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{-i}$.',
      ctx:SPIN({params:{ω:'pos'}, mat:{preset:'spin', mats:{H:'ω S_z'}}, states:{χ:'1/sqrt(2)(e^(-iωt/2)|↑⟩ - i e^(iωt/2)|↓⟩)'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'Berechne $\\langle S_x\\rangle(t)$.', type:'value', target:'ħ/2 sin(ωt)', points:3,
          model:['|χ(t)⟩ = e^(-iHt/ħ) |-y⟩', '= 1/sqrt(2)(e^(-iωt/2)|↑⟩ - i e^(iωt/2)|↓⟩)', '⟨S_x⟩ = ⟨χ|S_x|χ⟩', '= ħ/2 · i/2 (e^(-iωt) - e^(iωt))', '= ħ/2 sin(ωt)']}
      ]}},
    {aim:'k', id:'spin-fk3', type:'mc2',
      q:'Der Spin ist im Zustand $|{+x}\\rangle$, das Feld ist $B\\hat z$. Ist das ein stationärer Zustand?',
      opts:['nein, $\\langle\\mathbf S\\rangle$ präzediert mit $\\omega$ um $z$', 'ja, nur die globale Phase ändert sich', 'ja, denn $\\langle S_z\\rangle = 0$ bleibt konstant'], a:0,
      ex:'$|{+x}\\rangle$ ist eine Überlagerung von $|\\uparrow\\rangle$ und $|\\downarrow\\rangle$ mit verschiedenen Energien. $\\langle S_z\\rangle$ bleibt zwar null, aber $\\langle S_x\\rangle = \\frac\\hbar2\\cos\\omega t$ ändert sich.',
      reason:{q:'Warum?', opts:['$|{+x}\\rangle$ ist kein Eigenzustand von $\\hat H = \\omega\\hat S_z$.', 'Jeder normierte Zustand ist stationär.', 'Ein konstantes $\\langle S_z\\rangle$ heißt stationär.'], a:0, ex:'Stationär sind nur Eigenzustände von $\\hat H$. Dass *ein* Erwartungswert konstant ist, reicht nicht.'}},
    {aim:'k', id:'spin-fk4', type:'dialog',
      text:'Gefragt ist, welche Spinzustände zu $|{+y}\\rangle$ orthogonal sind.',
      people:[{name:'Lena', says:'$|{+x}\\rangle$ und $|\\uparrow\\rangle$, denn die $x$- und die $z$-Achse stehen beide senkrecht auf der $y$-Achse.'},
        {name:'Jonas', says:'Nur $|{-y}\\rangle$, bis auf eine Phase. $|{+x}\\rangle$ und $|\\uparrow\\rangle$ haben mit $|{+y}\\rangle$ den Überlapp-Betrag $1/\\sqrt2$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Jonas. In $\\mathbb C^2$ gibt es zu jedem Zustand genau eine orthogonale Richtung; sie gehört zur Gegenrichtung im Raum.'},
    {aim:2, sketch:{id:'spin-fs2', title:'$\\langle S_x\\rangle(t)$ für den Start in $|{-y}\\rangle$', kind:'curve', draw:'f',
      text:'Ein Spin ist bei $t = 0$ im Zustand $|{-y}\\rangle$ und präzediert im Feld $B\\hat z$ mit $\\hat H = \\omega\\hat S_z$, $\\omega > 0$. Skizziere $\\langle S_x\\rangle(t)$ für $0 \\le t \\le 4\\pi/\\omega$. Die Höhe ist frei; es zählen Vorzeichen, Nullstellen und Periode.',
      plot:{x:[0, 1], xlab:'t', ylab:'\\langle S_x\\rangle', ticks:SPIN_SK.T},
      f:x => Math.sin(4 * Math.PI * x),
      checks:[
        {id:'start', name:'Startwert', type:'zero', at:[0], msg:'Wie groß ist $\\langle S_x\\rangle$ im Zustand $|{-y}\\rangle$?'},
        {id:'richtung', name:'Startrichtung', type:'sign', s:1, range:[0.02, 0.23], msg:'In welche Richtung dreht sich der Bloch-Pfeil für $\\omega > 0$? Wird $\\langle S_x\\rangle$ dann zuerst positiv oder negativ?'},
        {id:'periode', name:'Periode', type:'nodes', n:3, range:[0.03, 0.97], msg:'Wie lange dauert ein voller Umlauf des Bloch-Pfeils? Zwischen $0$ und $4\\pi/\\omega$ hat deine Skizze {got} Nulldurchgänge.'}
      ],
      reveal:'Der Bloch-Pfeil startet bei $-y$ und dreht sich mit $\\omega$ gegen den Uhrzeigersinn um die $z$-Achse. Nach einer Viertelperiode zeigt er nach $+x$, daher $\\langle S_x\\rangle = \\frac\\hbar2\\sin\\omega t$. Dasselbe folgt aus $|\\chi(t)\\rangle = \\frac{1}{\\sqrt2}\\big(e^{-i\\omega t/2}|\\uparrow\\rangle - i\\,e^{i\\omega t/2}|\\downarrow\\rangle\\big)$ mit $\\langle S_x\\rangle = \\hbar\\,\\mathrm{Re}(a^*b)$. Die Periode ist $2\\pi/\\omega$; der Faktor $-1$ nach einem Umlauf ist eine globale Phase.',
      wrong:[
        {f:x => -Math.sin(4 * Math.PI * x), fails:['richtung'], why:'Drehsinn der Präzession vertauscht'},
        {f:x => Math.cos(4 * Math.PI * x), fails:['start'], why:'Startrichtung nicht beachtet: Start wie bei $|{+x}\\rangle$'},
        {f:x => Math.sin(2 * Math.PI * x), fails:['periode'], why:'Periode $4\\pi/\\omega$: Vorzeichen $-1$ nach $2\\pi$ für eine messbare Änderung gehalten'}
      ], points:3}}
  ],
  errors:[
    {id:'spin-e1', title:'Ein Zustand, der nie $+y$ ergibt?',
      text:'Der Spin ist im Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle + i|\\downarrow\\rangle)$. Gesucht ist $P(S_y = +\\hbar/2)$. Eine Rechnung ergibt 0:',
      ctx:SPIN({states:{χ:'1/sqrt(2)(|↑⟩ + i|↓⟩)'}, state:'χ'}),
      lines:['P = |⟨+y|χ⟩|^2', '= |1/sqrt(2) (1, i) · 1/sqrt(2) (1; i)|^2', '= |1/2 (1 + i^2)|^2', '= 0'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Im Bra $\\langle{+y}|$ fehlt die Konjugation: $(1, -i)$.', 'Der Faktor $1/\\sqrt2$ darf nur einmal vorkommen.', 'Zwischen Bra und Ket gehört die Matrix $\\sigma_y$.'], a:0, ex:'Tatsächlich ist $|\\chi\\rangle = |{+y}\\rangle$, also $P = 1$. Ohne Konjugation wird aus $\\langle{+y}|{+y}\\rangle$ fälschlich $0$.'},
      fix:{id:'a', prompt:'Berichtige und berechne $P$.', type:'value', target:'1', model:['P = |⟨+y|χ⟩|^2', '= |1/sqrt(2) (1, -i) · 1/sqrt(2) (1; i)|^2', '= |1/2 (1 - i^2)|^2', '= 1']}}
  ]
});
lexe('pauli', 'Pauli-Matrizen', '$\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$, $\\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$. Eigenschaften: $\\sigma_i^2 = \\mathbb 1$, $\\sigma_x\\sigma_y = i\\sigma_z$ (zyklisch), $\\sigma_i\\sigma_j = \\delta_{ij}\\mathbb 1 + i\\varepsilon_{ijk}\\sigma_k$, Spur 0, Eigenwerte $\\pm1$. Spin: $\\hat S_i = \\frac\\hbar2\\sigma_i$. Eingabe: `σ_x`, `S_x`, `S_+`.', {topic:'spin'});
lexe('spinor', 'Spinor', 'Zustand eines Spin-½-Teilchens: $|\\chi\\rangle = a|\\uparrow\\rangle + b|\\downarrow\\rangle = \\binom ab$ mit $|a|^2 + |b|^2 = 1$. Das Bra ist $\\langle\\chi| = (a^*, b^*)$. Bis auf eine globale Phase: $|\\chi\\rangle = \\cos\\frac\\theta2|\\uparrow\\rangle + e^{i\\varphi}\\sin\\frac\\theta2|\\downarrow\\rangle$ (Bloch-Kugel). Eingabe: `|↑⟩`, `(a; b)` als Spalte, `(a, b)` als Zeile (Bra).', {topic:'spin'});
lexe('spin-eigenzustaende', 'Eigenzustände der Spinkomponenten', '$S_z$: $|\\uparrow\\rangle$, $|\\downarrow\\rangle$. $S_x$: $|{\\pm x}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle\\pm|\\downarrow\\rangle)$. $S_y$: $|{\\pm y}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle\\pm i|\\downarrow\\rangle)$. Messwerte immer $\\pm\\hbar/2$. Zwei Richtungen mit Winkel $\\alpha$: $|\\langle{+\\hat m}|{+\\hat n}\\rangle|^2 = \\cos^2\\frac\\alpha2$ – orthogonal sind nur Zustände zu entgegengesetzten Richtungen. Eingabe: `|+x⟩`, `|-y⟩`.', {topic:'spin'});
lexe('stern-gerlach', 'Stern-Gerlach-Versuch', 'Ein inhomogenes Magnetfeld in Richtung $\\hat n$ spaltet einen Strahl von Spin-½-Teilchen in zwei Teilstrahlen ($S_{\\hat n} = \\pm\\hbar/2$). Ein ausgeblendeter Teilstrahl ist im entsprechenden Eigenzustand präpariert. Bei Folgen von Magneten in verschiedenen Richtungen multiplizieren sich die Wahrscheinlichkeiten $|\\langle\\cdot|\\cdot\\rangle|^2$; eine Messung in $x$ löscht die $z$-Information.', {topic:'spin'});
lexe('larmor', 'Larmor-Präzession', 'Im Feld $B\\hat z$: $\\hat H = \\omega\\hat S_z$ ($\\omega = -\\gamma B$). Zeitentwicklung $|\\chi(t)\\rangle = e^{-i\\hat Ht/\\hbar}|\\chi(0)\\rangle$, also $a\\,e^{-i\\omega t/2}|\\uparrow\\rangle + b\\,e^{i\\omega t/2}|\\downarrow\\rangle$. Der Erwartungswert $\\langle\\mathbf S\\rangle$ dreht sich mit $\\omega$ um die Feldrichtung; $\\langle S_z\\rangle$ bleibt konstant. Protonen: $\\omega/2\\pi \\approx 42{,}6$ MHz pro Tesla.', {topic:'spin'});
lexe('bloch-kugel', 'Bloch-Kugel', 'Jeder Spin-½-Zustand ist bis auf eine globale Phase $|\\chi\\rangle = \\cos\\frac\\theta2|\\uparrow\\rangle + e^{i\\varphi}\\sin\\frac\\theta2|\\downarrow\\rangle$ und entspricht dem Punkt $\\hat n = (\\sin\\theta\\cos\\varphi, \\sin\\theta\\sin\\varphi, \\cos\\theta)$ auf der Einheitskugel. $|\\chi\\rangle$ ist Eigenzustand von $\\hat S_{\\hat n}$ zu $+\\hbar/2$, und $\\langle\\hat{\\mathbf S}\\rangle = \\frac\\hbar2\\hat n$. Orthogonale Zustände liegen sich gegenüber (Nord- und Südpol für $|\\uparrow\\rangle$, $|\\downarrow\\rangle$).', {topic:'spin'});
lexe('spin-moment', 'Magnetisches Moment des Spins', '$\\hat{\\boldsymbol\\mu} = \\gamma\\hat{\\mathbf S}$ mit dem gyromagnetischen Verhältnis $\\gamma$. Elektron: $\\gamma = -g\\,e/(2m_e)$ mit $g \\approx 2{,}002$, also $\\gamma \\approx -e/m_e$. Energie im Feld: $\\hat H = -\\hat{\\boldsymbol\\mu}\\cdot\\mathbf B$. Im inhomogenen Feld wirkt die Kraft $F_z = \\mu_z\\,\\partial B_z/\\partial z$ (Stern-Gerlach).', {topic:'spin'});
lexe('spin-drehung', 'Drehoperator für Spin ½', '$\\hat R_{\\hat n}(\\alpha) = e^{-i\\alpha\\,\\hat n\\cdot\\hat{\\mathbf S}/\\hbar}$ dreht einen Spinzustand um den Winkel $\\alpha$ um die Achse $\\hat n$. Um die $z$-Achse: $e^{-i\\alpha\\hat S_z/\\hbar} = \\mathrm{diag}(e^{-i\\alpha/2}, e^{i\\alpha/2})$. Für $\\alpha = 2\\pi$ ergibt sich $-\\mathbb 1$: Ein Spinor wechselt bei einer vollen Drehung das Vorzeichen, erst nach $4\\pi$ ist er wieder gleich. Nachgewiesen mit Neutronen-Interferometern (1975). Eingabe: `e^(-iα S_z/ħ)`.', {topic:'spin'});
})();
