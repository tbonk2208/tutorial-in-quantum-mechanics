/* ===== Thema 4: Freies Teilchen und Wellenpakete ===== */
(function(){
const R = String.raw;
const GAUSS = '(2πσ^2)^(-1/4) e^(-x^2/(4σ^2)) e^(i k_0 x)';
topic({
  id:'frei', math:['m-fourier', 'm-analysis'], title:'Freies Teilchen und Wellenpakete', short:'Freies Teilchen',
  src:'Griffiths & Schroeter Kap. 2.4 · Nolting 5/1 Kap. 2 · Schwabl Kap. 2',
  goals:[
    'Ich kann für ebene Wellen die Dispersion $\\omega = \\hbar k^2/2m$ angeben und Phasen- und Gruppengeschwindigkeit unterscheiden.',
    'Ich kann die Impulsraum-Wellenfunktion $\\varphi(k)$ eines Wellenpakets berechnen und damit $\\langle p\\rangle$ und $\\Delta p$ bestimmen.',
    'Ich kann zeigen, dass das Gauß-Paket $\\Delta x\\,\\Delta p = \\hbar/2$ erfüllt, und das Zerfließen $\\Delta x(t)$ deuten.'
  ],
  needs:'Fourier-Transformation (Mathe M6) und Gauß-Integrale (Mathe M2) · Schrödingergleichung (Thema 2) · Erwartungswerte (Thema 1)',
  wozu:'Jedes Teilchen, das frei fliegt, ist ein Wellenpaket: Elektronen im Elektronenmikroskop, Neutronen im Interferometer, Atome nach dem Abschalten einer Falle. Bei ultrakalten Atomen misst man die Impulsverteilung genau so: Man lässt die Wolke frei fliegen und fotografiert sie nach einer Flugzeit. Dieselbe Fourier-Beziehung zwischen Breite im Ort und Breite in der Wellenzahl begegnet dir bei kurzen Laserpulsen: Je kürzer der Puls, desto breiter sein Spektrum.',
  bridge:'Aus Thema 2 kommt der Separationsansatz, aus Thema 1 Erwartungswert, Unschärfe und $\\hat p = -i\\hbar\\,\\partial_x$, aus Thema 3 das Rezept „entwickeln, Phasen anhängen, aufsummieren“. Mathematisch brauchst du die Fourier-Transformation (M6) und Gauß-Integrale (M2). Neu: Ohne Randbedingungen ist die Energie nicht quantisiert, und die Eigenfunktionen sind nicht normierbar – Thema 5 benutzt sie als Teilchenstrahlen, Thema 6 macht daraus die δ-Normierung.',
  check:[
    {q:'Wie lautet in diesem Tutorial die Fourier-Transformierte?', opts:['$\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$', '$\\varphi(k) = \\int\\psi(x)e^{ikx}dx$', '$\\varphi(k) = \\frac{1}{2\\pi}\\int\\psi(x)\\cos(kx)\\,dx$'], a:0, ex:'Symmetrische Konvention mit $1/\\sqrt{2\\pi}$ in beiden Richtungen.', lex:'fourier', prev:'m-fourier', seg:'mf-t4'},
    {q:'$\\int_{-\\infty}^\\infty e^{-x^2/(2\\sigma^2)}dx$ ist …', opts:['$\\sqrt{2\\pi}\\,\\sigma$', '$\\sqrt{\\pi}\\,\\sigma$', '$2\\sigma$'], a:0, ex:'$\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1/(2\\sigma^2)$.', lex:'integrale'},
    {q:'Die Welle $\\cos(kx - \\omega t)$ läuft mit welcher Geschwindigkeit?', opts:['$\\omega/k$ in $+x$-Richtung', '$k/\\omega$ in $+x$-Richtung', '$\\omega/k$ in $-x$-Richtung'], a:0, ex:'Konstante Phase $kx - \\omega t$ heißt $x = (\\omega/k)t + $ const.', lex:'ebene-welle'},
    {q:'Was gibt $\\hat p\\,e^{ikx}$ mit $\\hat p = -i\\hbar\\,d/dx$?', opts:['$\\hbar k\\,e^{ikx}$', '$-\\hbar k\\,e^{ikx}$', '$i\\hbar k\\,e^{ikx}$'], a:0, ex:'$-i\\hbar\\cdot ik = \\hbar k$: $e^{ikx}$ ist Eigenfunktion zum Impuls $p = \\hbar k$.', lex:'erwartungswert', prev:'wf'}
  ],
  diag:[
    {q:'Wie beginnst du, um die Wahrscheinlichkeit für Impulse zwischen $p_1$ und $p_2$ im Zustand $\\psi(x)$ zu bestimmen?', opts:['$\\varphi(k)$ berechnen und $|\\varphi|^2$ von $p_1/\\hbar$ bis $p_2/\\hbar$ integrieren', '$\\hat p\\psi$ bilden und den Faktor vor $\\psi$ als Impuls ablesen', '$\\langle p\\rangle$ und $\\Delta p$ berechnen und eine Normalverteilung annehmen'], a:0, dk:true,
      ex:'Die Impulsverteilung steckt in $|\\varphi(k)|^2$ mit $p = \\hbar k$. $\\hat p\\psi/\\psi$ ist nur für Impulseigenfunktionen eine Konstante, und eine Normalverteilung liegt nur beim Gauß-Paket vor.'},
    {q:'Wie beginnst du, um die Geschwindigkeit des Maximums eines freien Wellenpakets mit mittlerer Wellenzahl $k_0$ zu bestimmen?', opts:['$d\\omega/dk$ an der Stelle $k_0$ ausrechnen', '$\\omega/k$ an der Stelle $k_0$ ausrechnen', 'die Zeitableitung von $|\\varphi(k)|^2$ bei $k_0$ bilden'], a:0, dk:true,
      ex:'Die Einhüllende läuft mit der Gruppengeschwindigkeit $d\\omega/dk$. $\\omega/k$ ist die Geschwindigkeit der Wellenberge, und $|\\varphi(k)|^2$ ändert sich beim freien Teilchen gar nicht.'}
  ],
  phenomenon:{
    title:'Wie breit ist ein Elektron nach einer Nanosekunde?',
    text:'Ein Elektron wird so präpariert, dass sein Ort auf $\\Delta x = 0{,}1\\,\\mathrm{nm}$ genau festliegt – etwa der Durchmesser eines Atoms. Danach fliegt es kräftefrei: Nichts zieht oder drückt an ihm.\n\nWie groß ist $\\Delta x$ nach $1\\,\\mathrm{ns}$?',
    q:{q:'Deine Vorhersage:', opts:['etwa $0{,}1\\,\\mathrm{nm}$: ohne Kraft ändert sich nichts', 'etwa $0{,}2\\,\\mathrm{nm}$: es wird etwas breiter', 'etwa $0{,}6\\,\\mathrm{mm}$: millionenfach breiter'], a:2,
      ex:'$\\Delta x(t) \\approx \\Delta v\\,t$ mit $\\Delta v = \\hbar/(2m\\Delta x) \\approx 6\\cdot10^5\\,\\mathrm{m/s}$.',
      fb:[
        'Ohne Kraft bleibt $\\langle p\\rangle$ konstant – aber nicht $\\Delta x$. Ein Ort, der auf $0{,}1\\,\\mathrm{nm}$ genau festliegt, verlangt eine Impulsunschärfe $\\Delta p \\ge \\hbar/(2\\Delta x)$. Die verschiedenen Impulsanteile laufen auseinander.',
        'Die Richtung stimmt, die Größe nicht. Die Geschwindigkeitsunschärfe ist hier etwa $\\hbar/(2m\\Delta x) \\approx 6\\cdot10^5\\,\\mathrm{m/s}$. In $1\\,\\mathrm{ns}$ laufen die Anteile damit um etwa $0{,}6\\,\\mathrm{mm}$ auseinander.',
        'Richtig. Die Geschwindigkeitsunschärfe $\\Delta v = \\hbar/(2m\\Delta x) \\approx 6\\cdot10^5\\,\\mathrm{m/s}$ ist riesig, weil das Elektron leicht und der Ort sehr scharf ist. Nach $1\\,\\mathrm{ns}$ ist $\\Delta x \\approx \\Delta v\\,t \\approx 0{,}6\\,\\mathrm{mm}$.'
      ]},
    reveal:'Die Impulsunschärfe ist mindestens $\\Delta p = \\hbar/(2\\Delta x)$, die Geschwindigkeitsunschärfe also $\\Delta v = \\hbar/(2m\\Delta x) \\approx 6\\cdot10^{5}\\,\\mathrm{m/s}$. Nach der Zeit $t$ ist das Paket etwa $\\Delta v\\,t$ breit, nach $1\\,\\mathrm{ns}$ also rund $0{,}6\\,\\mathrm{mm}$. Das ist das **Zerfließen** des Wellenpakets.\n\nEs heißt nicht, dass das Elektron „größer“ wird. Eine Ortsmessung findet es weiterhin an einer Stelle. Breiter wird die Verteilung der Messergebnisse. Eine Wolke klassischer Teilchen mit derselben Geschwindigkeitsstreuung liefe genauso auseinander. Neu ist in der Quantenmechanik: Die Streuung lässt sich nicht vermeiden, sobald der Ort scharf ist.'
  },
  teach:[
    {id:'frei-t1', title:'Ebene Wellen: Lösungen ohne Potential',
      text:R`Ohne Potential ($V = 0$) wirkt keine Kraft. Klassisch fliegt das Teilchen geradeaus mit konstantem Impuls. Was sagt die Schrödingergleichung?

Wie in Thema 2 trennst du Ort und Zeit: $\Psi(x,t) = \psi(x)\,e^{-iEt/\hbar}$. Für $\psi$ bleibt die [[lex:schroedinger|stationäre Schrödingergleichung]]

$$-\frac{\hbar^2}{2m}\psi'' = E\psi \quad\Longleftrightarrow\quad \psi'' = -k^2\psi,\qquad k = \frac{\sqrt{2mE}}{\hbar}.$$

Für $E > 0$ ist $k$ reell, und die Lösungen sind $e^{ikx}$ und $e^{-ikx}$ (M7). Zusammen mit dem Zeitfaktor entsteht eine [[lex:ebene-welle|ebene Welle]]

$$\Psi_k(x,t) = e^{i(kx - \omega t)},\qquad \omega(k) = \frac{\hbar k^2}{2m}.$$

Die Beziehung $\omega(k)$ heißt [[lex:dispersion|Dispersionsrelation]]. Sie ist hier quadratisch, nicht linear wie bei Licht im Vakuum ($\omega = ck$). Die Folgen siehst du in Abschnitt 5 und 6.

Wende $\hat p = -i\hbar\,\partial_x$ auf $e^{ikx}$ an: Es kommt $\hbar k\,e^{ikx}$ heraus. Die ebene Welle ist also Eigenfunktion des Impulses zum Eigenwert $p = \hbar k$. Das ist die de-Broglie-Beziehung $p = h/\lambda$ mit $\lambda = 2\pi/k$. Das Vorzeichen von $k$ gibt die Richtung: Für $k > 0$ läuft die Welle nach rechts, für $k < 0$ nach links. Die Energie ist $E = p^2/2m$, wie klassisch. Ein Zahlenbeispiel: Ein Elektron mit $E = 1\,\mathrm{eV}$ hat $\lambda = h/\sqrt{2mE} \approx 1{,}2\,\mathrm{nm}$ – einige Atomabstände.

Die allgemeine Lösung zu fester Energie ist $\psi = Ae^{ikx} + Be^{-ikx}$: eine nach rechts und eine nach links laufende Welle. Für $|A| = |B|$ entsteht eine stehende Welle wie im Kasten.

Zwei Dinge sind anders als im Kasten (Thema 3). Erstens schränkt keine Randbedingung $k$ ein. Jede Energie $E \ge 0$ ist erlaubt: Das Spektrum ist **kontinuierlich**. Zweitens gehören zu jeder Energie $E > 0$ zwei Lösungen, $+k$ und $-k$. Die Energie ist zweifach **entartet**. Auch $\cos kx$ und $\sin kx$ lösen die Gleichung zur selben Energie. Sie sind aber keine Impulseigenfunktionen, sondern Überlagerungen von $+\hbar k$ und $-\hbar k$.

Und $E < 0$? Dann wäre $\psi'' = +\kappa^2\psi$, und die Lösungen $e^{\pm\kappa x}$ wachsen auf einer Seite über alle Grenzen. Ein freies Teilchen hat keine Eigenzustände mit negativer Energie.

Die Herleitung zeigt Zeile für Zeile: $\Psi_k$ löst die zeitabhängige Schrödingergleichung genau dann, wenn $\omega = \hbar k^2/2m$ gilt.`,
      derive:{ctx:{coords:['x', 't'], params:{k:'real', m:'pos'}, defs:{'ω':'ħ k^2/(2m)'}}, lines:[
        {l:'iħ ∂/∂t e^(i(k x - ω t)) = ħω e^(i(k x - ω t))', w:'linke Seite der Schrödingergleichung',
          why:{q:'Woher kommt der Faktor $\\hbar\\omega$?', opts:['$\\partial_t$ bringt $-i\\omega$, und $i\\hbar\\cdot(-i\\omega) = \\hbar\\omega$', '$\\partial_t$ bringt $+i\\omega$, und $i\\hbar\\cdot i\\omega = \\hbar\\omega$', 'aus der Normierung der ebenen Welle'], a:0, ex:'$\\partial_t e^{-i\\omega t} = -i\\omega\\,e^{-i\\omega t}$ und $i\\cdot(-i) = 1$. Mit $+i\\omega$ käme $-\\hbar\\omega$ heraus.'}},
        {l:'-ħ^2/(2m) ∂^2/∂x^2 e^(i(k x - ω t)) = ħ^2 k^2/(2m) e^(i(k x - ω t))', w:'rechte Seite: zweimal ∂ₓ bringt (ik)²',
          why:{q:'Warum ist das Ergebnis positiv?', opts:['$(ik)^2 = -k^2$, und das Minus vor $\\hbar^2/2m$ hebt es auf', 'weil $k^2$ positiv ist und kein $i$ vorkommt', 'weil die Energie per Definition positiv ist'], a:0, ex:'Zweimal Ableiten bringt $(ik)^2 = -k^2$. Zusammen mit $-\\hbar^2/2m$ entsteht $+\\hbar^2k^2/2m$.'}},
        {l:'ħω = ħ^2 k^2/(2m)', w:'beide Seiten gleichsetzen',
          why:{q:'Was folgt aus dieser Zeile?', opts:['Die ebene Welle löst die Gleichung nur mit $\\omega = \\hbar k^2/2m$.', 'Jede Kombination von $k$ und $\\omega$ löst die Gleichung.', 'Die Frequenz hängt nur von der Masse ab.'], a:0, ex:'Das ist die Dispersionsrelation: $E = \\hbar\\omega = p^2/2m$ mit $p = \\hbar k$.'}},
        {l:'-iħ ∂/∂x e^(i(k x - ω t)) = ħ k e^(i(k x - ω t))', w:'Impulseigenwert ħk',
          why:{q:'Was zeigt die letzte Zeile?', opts:['$e^{i(kx - \\omega t)}$ ist Impulseigenfunktion zum Eigenwert $\\hbar k$.', 'Der Impuls ist $-\\hbar k$, weil ein $-i$ davorsteht.', 'Der Impuls hängt von der Zeit ab.'], a:0, ex:'$-i\\hbar\\cdot ik = \\hbar k$. Der Zeitfaktor ändert daran nichts.'}}
      ]},
      q:[
        {q:'Ist $\\psi(x) = \\cos(kx)$ eine Eigenfunktion von $\\hat p$?', opts:['Nein: $\\hat p\\cos kx = i\\hbar k\\sin kx$ ist kein Vielfaches von $\\cos kx$.', 'Ja, zum Eigenwert $\\hbar k$, weil $\\cos kx$ die Wellenzahl $k$ hat.', 'Ja, zum Eigenwert $0$, weil $\\cos kx$ eine reelle Funktion ist.'], a:0,
          ex:'$\\cos kx = \\tfrac12(e^{ikx} + e^{-ikx})$ enthält $+\\hbar k$ und $-\\hbar k$; eine Impulsmessung liefert jeden Wert mit Wahrscheinlichkeit $1/2$. Eigenfunktion von $\\hat H$ ist $\\cos kx$ trotzdem, zur Energie $\\hbar^2k^2/2m$.'}
      ]},
    {id:'frei-t2', title:'Nicht normierbar – und trotzdem nützlich',
      text:R`Versuch, die ebene Welle zu [[lex:normierung|normieren]]. Es ist $|e^{ikx}|^2 = 1$ für alle $x$, also

$$\int_{-\infty}^{\infty}|e^{ikx}|^2\,dx = \int_{-\infty}^{\infty}1\,dx = \infty.$$

Kein Vorfaktor $A$ hilft: $|A|^2\cdot\infty$ ist entweder $0$ oder $\infty$. Eine ebene Welle ist deshalb **kein physikalischer Zustand**. Sie beschreibt ein Teilchen mit scharfem Impuls, das überall gleich wahrscheinlich ist – auch am anderen Ende des Universums. So etwas lässt sich nicht präparieren. Das passt zur [[lex:unschaerfe|Unschärfe]] aus Thema 1: $\Delta p = 0$ verlangt $\Delta x = \infty$. Eine ebene Welle ist der Grenzfall eines sehr langen Wellenzugs.

Man kann sich diesen Grenzfall auch so vorstellen: Sperre das Teilchen in einen sehr großen Ring der Länge $L$, also mit $\psi(x + L) = \psi(x)$. Dann ist $e^{ikx}/\sqrt L$ normiert, und $k = 2\pi n/L$ ist quantisiert. Die erlaubten $k$ liegen im Abstand $2\pi/L$. Für $L \to \infty$ rücken sie beliebig dicht zusammen, und aus dem diskreten Spektrum wird ein kontinuierliches. In der Festkörperphysik rechnet man oft genau so.

Trotzdem sind ebene Wellen unverzichtbar, aus zwei Gründen.

1. **Als Bausteine.** Die Schrödingergleichung ist linear, also löst jede Überlagerung ebener Wellen sie ebenfalls. Geeignete Überlagerungen sind normierbar: die Wellenpakete im nächsten Abschnitt. Die ebenen Wellen spielen dabei die Rolle, die im Kasten die $\psi_n$ spielen – mit einem Integral über $k$ statt einer Summe über $n$.
2. **Als Modell für einen Strahl.** In der Streuung (Thema 5) beschreibt $A\,e^{ikx}$ einen gleichmäßigen Strom vieler Teilchen. Dann ist $|A|^2$ eine Teilchendichte und die [[lex:stromdichte|Stromdichte]] $j = \frac{\hbar k}{m}|A|^2$ die Zahl der Teilchen pro Zeit.

Statt $\langle\psi|\psi\rangle = 1$ benutzt man für ebene Wellen eine Normierung auf eine δ-Funktion:

$$\int_{-\infty}^{\infty}e^{-ik'x}\,e^{ikx}\,dx = 2\pi\,\delta(k - k').$$

Das ist die Fourier-Darstellung der [[lex:delta-distribution|δ-Distribution]] (M6). Ebene Wellen zu verschiedenen $k$ sind in diesem Sinn „orthogonal“; zu gleichem $k$ ist das Skalarprodukt unendlich. Thema 6 macht daraus die δ-Normierung kontinuierlicher Spektren.

**Typische Fehlvorstellung:** „Wenn $e^{ikx}$ die Schrödingergleichung löst, ist es ein möglicher Zustand.“ Ein Zustand muss außerdem normierbar sein (Thema 1). Das freie Teilchen hat deshalb keinen einzigen normierbaren Eigenzustand von $\hat H$. Jeder physikalische Zustand ist eine Überlagerung verschiedener Energien und ändert sich mit der Zeit: Er zerfließt, und für $\langle p\rangle \ne 0$ läuft er.`,
      q:[
        {q:'Warum ist $\\psi(x) = A\\,e^{ikx}$ für kein $A \\ne 0$ normierbar?', opts:['$|\\psi|^2 = |A|^2$ ist überall gleich; das Integral über alle $x$ divergiert.', '$e^{ikx}$ ist komplex, und komplexe Funktionen lassen sich nicht normieren.', '$\\int e^{ikx}dx = 0$; die Norm ist also null und nicht eins.'], a:0,
          ex:'Normiert wird $|\\psi|^2$, nicht $\\psi$. Komplexe Funktionen wie $e^{-x^2}e^{ikx}$ sind problemlos normierbar.'},
        {q:'Ein Elektronenstrahl wird durch $A\\,e^{ikx}$ beschrieben. Wofür steht $\\frac{\\hbar k}{m}|A|^2$?', opts:['für die Zahl der Teilchen pro Zeit (Stromdichte)', 'für die Wahrscheinlichkeit, ein Elektron bei $x$ zu finden', 'für die kinetische Energie eines Elektrons'], a:0,
          ex:'$|A|^2$ ist eine Dichte, $\\hbar k/m$ eine Geschwindigkeit; ihr Produkt ist ein Strom. Thema 5 rechnet damit Reflexion und Transmission aus.'}
      ]},
    {id:'frei-t3', title:'Wellenpakete: überlagern mit der Fourier-Transformation',
      text:R`Ein Teilchen, das sich irgendwo befindet, braucht eine normierbare Wellenfunktion. Du baust sie aus ebenen Wellen: Jede Welle bekommt ein Gewicht $\varphi(k)$, und du summierst – kontinuierlich, also mit einem Integral:

$$\Psi(x,t) = \frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}\varphi(k)\,e^{i(kx - \omega(k)t)}\,dk.$$

Das ist ein [[lex:wellenpaket|Wellenpaket]]. Es löst die Schrödingergleichung, weil jeder Summand sie löst und die Gleichung linear ist. Der Faktor $1/\sqrt{2\pi}$ ist Konvention; er macht die Formeln symmetrisch.

**Wie findet man $\varphi(k)$?** Setze $t = 0$. Dann steht da eine inverse [[lex:fourier|Fourier-Transformation]] (M6). Umgekehrt gilt

$$\varphi(k) = \frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}\Psi(x,0)\,e^{-ikx}\,dx.$$

Das Rezept für jedes freie Anfangswertproblem lautet also: (1) $\varphi(k)$ aus $\Psi(x,0)$ berechnen, (2) jede Komponente mit ihrem Phasenfaktor $e^{-i\omega(k)t}$ versehen, (3) zurücktransformieren. Es ist dasselbe Rezept wie im Kasten (Thema 3): entwickeln, Phasen anhängen, aufsummieren.

$\varphi(k)$ darf komplex sein, und seine Phase trägt Information. Verschiebst du das Paket im Ort, $\psi(x) \to \psi(x - x_0)$, so wird $\varphi(k) \to e^{-ikx_0}\varphi(k)$: $|\varphi|^2$ bleibt gleich, nur die Phase ändert sich. Wo das Paket sitzt, steckt also in der Phase von $\varphi$; welche Impulse es enthält, steckt in $|\varphi|^2$.

**Normierung.** Nach dem Satz von [[lex:parseval|Parseval und Plancherel]] gilt $\int|\Psi(x,0)|^2dx = \int|\varphi(k)|^2dk$. Ist $\Psi$ normiert, dann auch $\varphi$. Weil $|e^{-i\omega t}| = 1$ ist, bleibt $|\varphi(k)|^2$ für alle Zeiten gleich.

**Breite in $x$, Breite in $k$.** Die Herleitung transformiert ein Rechteckpaket: $\psi = 1/\sqrt a$ für $|x| < a/2$, sonst null. Das Ergebnis $\varphi(k) \propto \sin(ka/2)/k$ hat seine erste Nullstelle bei $k = 2\pi/a$. Je schmaler das Paket im Ort, desto breiter die Verteilung der Wellenzahlen. Das ist keine Eigenheit des Rechtecks, sondern gilt für jede Fourier-Transformation. Für das Gauß-Paket rechnest du es im Beispiel nach: Breite $\sigma$ in $x$, Breite $1/(2\sigma)$ in $k$. Allgemein gilt für jedes Fourier-Paar $\Delta x\,\Delta k \ge 1/2$, mit Gleichheit nur für Gauß-Funktionen. Mit $p = \hbar k$ ist das die Unschärferelation $\Delta x\,\Delta p \ge \hbar/2$ – hier noch als Eigenschaft der Fourier-Transformation, in Thema 6 als Folge von $[\hat x, \hat p] = i\hbar$.

Beim Rechteck fällt $|\varphi|^2$ nur wie $1/k^2$ ab, und $\int k^2|\varphi|^2dk$ divergiert: Wegen der Sprünge an den Kanten ist $\langle p^2\rangle = \infty$. Physikalisch sinnvolle Pakete haben glatte Kanten.`,
      derive:{ctx:{coords:['x', 'k'], params:{a:'pos'}}, lines:[
        {l:'1/sqrt(2π) ∫_(-a/2)^(a/2) 1/sqrt(a) e^(-ikx) dx = 1/sqrt(2π a) [e^(-ikx)/(-ik)]_(-a/2)^(a/2)', w:'ψ = 1/√a nur für |x| < a/2',
          why:{q:'Warum laufen die Grenzen nur von $-a/2$ bis $a/2$?', opts:['Außerhalb ist $\\psi = 0$, der Integrand verschwindet dort.', 'Weil das Integral über alle $x$ divergieren würde.', 'Weil $e^{-ikx}$ außerhalb null ist.'], a:0, ex:'Das Integral läuft formal über alle $x$, aber nur das Intervall mit $\\psi \\ne 0$ trägt bei.'}},
        {l:'= 1/sqrt(2π a) · (e^(ika/2) - e^(-ika/2))/(ik)', w:'Grenzen eingesetzt'},
        {l:'= sqrt(2/(π a)) sin(k a/2)/k', w:'eⁱᵘ − e⁻ⁱᵘ = 2i sin u',
          why:{q:'Wo liegt die erste Nullstelle von $\\varphi(k)$ für $k > 0$?', opts:['bei $k = 2\\pi/a$', 'bei $k = \\pi/a$', 'bei $k = a/2$'], a:0, ex:'$\\sin(ka/2) = 0$ für $ka/2 = \\pi$. Je kleiner $a$, desto weiter außen: schmal im Ort heißt breit in $k$.'}}
      ]},
      q:[
        {q:'Ein Paket wird im Ort halb so breit. Was passiert mit der Breite von $|\\varphi(k)|^2$?', opts:['Sie verdoppelt sich ungefähr.', 'Sie halbiert sich ebenfalls.', 'Sie bleibt gleich; nur die Höhe ändert sich.'], a:0,
          ex:'Die Breiten in $x$ und $k$ verhalten sich umgekehrt: Beim Rechteck liegt die erste Nullstelle bei $2\\pi/a$, beim Gauß-Paket ist $\\Delta k = 1/(2\\Delta x)$.'}
      ]},
    {id:'frei-t4', title:'Der Impulsraum: dieselbe Information, anders geschrieben',
      text:R`Du kennst $|\psi(x)|^2$ als Wahrscheinlichkeitsdichte für den Ort. Die Funktion $\varphi(k)$ spielt dieselbe Rolle für den Impuls $p = \hbar k$:

$$P(k_1 \le k \le k_2) = \int_{k_1}^{k_2}|\varphi(k)|^2\,dk.$$

Deshalb heißt $\varphi$ [[lex:impulsraum|Impulsraum-Wellenfunktion]]. Diese Deutung kommt als Annahme zur Bornschen Regel (Thema 1) hinzu; Thema 6 zeigt, dass beides Spezialfälle des Messpostulats sind. Mit ihr berechnest du Impulsmittelwerte wie Ortsmittelwerte:

$$\langle p\rangle = \int\hbar k\,|\varphi(k)|^2\,dk,\qquad \langle p^2\rangle = \int\hbar^2k^2\,|\varphi(k)|^2\,dk.$$

Dasselbe liefert $\langle p\rangle = \int\psi^*(-i\hbar\,\partial_x)\psi\,dx$ im Ortsraum. Das ist kein Zufall. Leite $\psi(x) = \frac{1}{\sqrt{2\pi}}\int\varphi(k)e^{ikx}dk$ nach $x$ ab: Unter dem Integral entsteht der Faktor $ik$. Zu $-i\hbar\psi'$ gehört also die Impulsfunktion $\hbar k\,\varphi(k)$. Unter der Fourier-Transformation wird die Ableitung zur Multiplikation.

Für das Gauß-Paket mit $e^{ik_0x}$ ist $|\varphi|^2$ eine Gauß-Kurve um $k_0$ mit Varianz $1/(4\sigma^2)$. Daraus liest du ab: $\langle p\rangle = \hbar k_0$ und $\langle p^2\rangle = \hbar^2\left(k_0^2 + \frac{1}{4\sigma^2}\right)$, also $\Delta p = \hbar/(2\sigma)$ unabhängig von $k_0$. Die mittlere kinetische Energie ist $\langle p^2\rangle/2m$: Bewegung ($k_0$) und Lokalisierung ($\sigma$) tragen beide bei.

**Faustregel:** Rechne eine Größe dort aus, wo ihr Operator eine Multiplikation ist: $x$ und $V(x)$ im Ortsraum, $p$ und $p^2/2m$ im Impulsraum.

**Ein Faktor $e^{ik_0x}$ verschiebt den Impuls.** Multipliziere $\psi(x)$ mit $e^{ik_0x}$. Die Ortsdichte bleibt gleich, denn $|e^{ik_0x}| = 1$. Im Fourier-Integral wird aber $e^{-ikx}$ zu $e^{-i(k - k_0)x}$: Aus $\varphi(k)$ wird $\varphi(k - k_0)$. Die ganze Impulsverteilung rückt um $\hbar k_0$ nach oben. Die Herleitung zeigt das am Gauß-Paket. Eine ortsabhängige Phase trägt also Impuls. Ohne Bedeutung ist nur ein *konstanter* Faktor $e^{i\alpha}$.

Umgekehrt gilt: Ist $\psi(x)$ reell, dann ist $\varphi(-k) = \varphi(k)^*$, die Verteilung $|\varphi|^2$ ist symmetrisch, und $\langle p\rangle = 0$.

**Mini-Beispiel.** Für $\psi(x) = \frac{1}{\sqrt a}e^{-|x|/a}$ ist $\varphi(k) = \sqrt{2a/\pi}\,/(1 + a^2k^2)$ (Übungsaufgabe 5). Die Wahrscheinlichkeit für $|p| < \hbar/a$ ist dann $\int_{-1/a}^{1/a}|\varphi|^2dk$ – ein Integral über $k$, nicht über $x$. Dass $\varphi$ normiert ist, prüfst du mit Parseval.

**Häufige Verwechslung:** „$\psi(x)$ und $\varphi(k)$ sind zwei verschiedene Zustände.“ Es ist derselbe Zustand in zwei Darstellungen – wie ein Vektor in zwei Basen. Thema 6 schreibt beides als Komponenten desselben Kets.`,
      derive:{ctx:{coords:['x', 'k'], params:{σ:'pos', 'k_0':'real'}}, lines:[
        {l:'1/sqrt(2π) ∫_-∞^∞ (2πσ^2)^(-1/4) e^(-x^2/(4σ^2)) e^(i k_0 x) e^(-ikx) dx = 1/sqrt(2π) ∫_-∞^∞ (2πσ^2)^(-1/4) e^(-x^2/(4σ^2)) e^(-i(k - k_0)x) dx', w:'Exponenten zusammengefasst',
          why:{q:'Was bewirkt der Faktor $e^{ik_0x}$ im Fourier-Integral?', opts:['Er ersetzt $k$ durch $k - k_0$.', 'Er ersetzt $x$ durch $x - k_0$.', 'Er multipliziert das Ergebnis mit $k_0$.'], a:0, ex:'$e^{ik_0x}e^{-ikx} = e^{-i(k - k_0)x}$. Das Integral ist dasselbe wie für $k_0 = 0$, nur an der Stelle $k - k_0$.'}},
        {l:'= (2σ^2/π)^(1/4) e^(-σ^2 (k - k_0)^2)', w:'Ergebnis aus dem Beispiel, an der Stelle k − k₀'},
        {l:'∫_-∞^∞ ħ k sqrt(2σ^2/π) e^(-2σ^2 (k - k_0)^2) dk = ħ k_0', w:'⟨p⟩ im Impulsraum',
          why:{q:'Warum kommt ohne lange Rechnung $\\hbar k_0$ heraus?', opts:['$|\\varphi|^2$ ist normiert und symmetrisch um $k_0$.', 'Weil $\\hbar k$ eine Konstante ist.', 'Weil $\\varphi(k)$ eine reelle Funktion ist.'], a:0, ex:'Der Mittelwert einer symmetrischen, normierten Verteilung liegt im Symmetriepunkt.'}}
      ]},
      q:[
        {q:'$\\psi_1(x) = f(x)$ und $\\psi_2(x) = f(x)\\,e^{ik_0x}$ mit reellem $f$. Welche Aussage stimmt?', opts:['gleiche Ortsverteilung, Impulsverteilung um $\\hbar k_0$ verschoben', 'gleiche Ortsverteilung und auch gleiche Impulsverteilung', 'Ortsverteilung um $k_0$ verschoben, Impulsverteilung gleich'], a:0,
          ex:'$|e^{ik_0x}| = 1$ lässt $|\\psi|^2$ unverändert, verschiebt aber $\\varphi(k)$ zu $\\varphi(k - k_0)$.'},
        {q:'$\\psi(x)$ ist reell und normiert. Was ist $\\langle p\\rangle$?', opts:['$0$, denn $|\\varphi(k)|^2$ ist symmetrisch um $k = 0$', 'positiv, wenn $\\psi$ nach rechts hin abfällt', 'Das hängt von der genauen Form von $\\psi$ ab.'], a:0,
          ex:'Für reelles $\\psi$ ist $\\varphi(-k) = \\varphi(k)^*$, also $|\\varphi(-k)|^2 = |\\varphi(k)|^2$. Impuls braucht eine ortsabhängige Phase.'}
      ]},
    {id:'frei-t5', title:'Phasen- und Gruppengeschwindigkeit',
      text:R`Wie schnell bewegt sich ein Wellenpaket? Bei einer einzelnen ebenen Welle wandern die Wellenberge mit der [[lex:gruppengeschwindigkeit|Phasengeschwindigkeit]]

$$v_\mathrm{ph} = \frac{\omega}{k} = \frac{\hbar k}{2m},$$

denn konstante Phase $kx - \omega t$ heißt $x = (\omega/k)\,t + \text{const}$. Das ist nur die **Hälfte** der klassischen Geschwindigkeit $v = p/m = \hbar k/m$. Ein Widerspruch? Nein. Bei einer ebenen Welle ist $|\Psi|^2$ überall gleich; da bewegt sich nichts Messbares.

Messbar ist, wo sich das Paket befindet, also die Lage der **Einhüllenden**. Die Herleitung zeigt das an zwei Wellen mit $k_1$ und $k_2$. Ihre Summe ist das Produkt aus einer schnell schwingenden Trägerwelle mit der mittleren Wellenzahl $k_m$ und einer langsamen Einhüllenden $\cos(qx - \Omega t)$, mit $q = (k_2 - k_1)/2$ und $\Omega = (\omega_2 - \omega_1)/2$. Die Einhüllende läuft mit $\Omega/q = \Delta\omega/\Delta k$. Bei vielen Wellen nahe $k_0$ wird daraus die **Gruppengeschwindigkeit**

$$v_\mathrm{g} = \frac{d\omega}{dk}\bigg|_{k_0} = \frac{\hbar k_0}{m} = \frac{p_0}{m}.$$

Das ist die klassische Geschwindigkeit. Allgemein begründet man das mit einer [[lex:taylor|Taylor-Entwicklung]] (M2): $\omega(k) \approx \omega(k_0) + v_\mathrm{g}\,(k - k_0)$. Setzt du das ins Wellenpaket ein, so erhältst du

$$\Psi(x,t) \approx e^{i(k_0x - \omega_0t)}\,\frac{1}{\sqrt{2\pi}}\int\varphi(k)\,e^{i(k - k_0)(x - v_\mathrm{g}t)}\,dk = e^{i(k_0x - \omega_0t)}\,F(x - v_\mathrm{g}t).$$

Die Einhüllende $F$ hängt nur von $x - v_\mathrm{g}t$ ab: Sie läuft starr mit $v_\mathrm{g}$. Erst der nächste Term der Taylor-Reihe, $\frac12\omega''(k - k_0)^2$, verformt sie – das ist das Zerfließen in Abschnitt 6.

Im Bild läuft das Maximum von $|\psi|^2$ mit $v_\mathrm{g}$. Die Wellenberge von $\mathrm{Re}\,\psi$ laufen halb so schnell: Sie tauchen vorn im Paket auf, wandern relativ zur Einhüllenden nach hinten und verschwinden dort.

**Kontrolle mit Ehrenfest:** Für $V = 0$ gilt $\frac{d}{dt}\langle x\rangle = \langle p\rangle/m$ (Thema 6), und $\langle p\rangle$ ist konstant. Der Ortsmittelwert bewegt sich also mit $\langle p\rangle/m$ – exakt und für jedes Paket.

**Typische Fehlvorstellung:** „Das Teilchen bewegt sich mit der Phasengeschwindigkeit $\omega/k$.“ Die Phasengeschwindigkeit hat hier keine physikalische Bedeutung. Sie hängt sogar vom willkürlichen Energienullpunkt ab: Verschiebst du die Energie um $V_0$, ändert sich $\omega$ um $V_0/\hbar$ und damit $v_\mathrm{ph}$, aber nicht $v_\mathrm{g}$.`,
      fig:{lab:'packet', init:{s0:0.5, k0:3, t:1}, caption:'Mit $k_0 = 3$ ist das Paket bis $t = 1$ um $\\hbar k_0t/m = 3$ gewandert ($\\hbar = m = 1$). Den Zeitregler findest du unter „Mehr Regler“: Das Maximum von $|\\psi|^2$ (dick) läuft mit $v_\\mathrm{g}$, die Wellenberge von $\\mathrm{Re}\\,\\psi$ (dünn) halb so schnell.'},
      derive:{ctx:{coords:['x', 't'], params:{'k_1':'real', 'k_2':'real', m:'pos'}, defs:{'ω_1':'ħ k_1^2/(2m)', 'ω_2':'ħ k_2^2/(2m)', 'k_m':'(k_1 + k_2)/2', 'ω_m':'(ω_1 + ω_2)/2', q:'(k_2 - k_1)/2', 'Ω':'(ω_2 - ω_1)/2'}}, lines:[
        {l:'e^(i(k_1 x - ω_1 t)) + e^(i(k_2 x - ω_2 t)) = e^(i(k_m x - ω_m t)) (e^(-i(q x - Ω t)) + e^(i(q x - Ω t)))', w:'mittlere Phase ausgeklammert',
          why:{q:'Warum darf man $e^{i(k_mx - \\omega_mt)}$ ausklammern?', opts:['Weil $k_1 = k_m - q$, $k_2 = k_m + q$ und ebenso für $\\omega$ gilt.', 'Weil $k_1$ und $k_2$ fast gleich sind; es ist eine Näherung.', 'Weil die Schrödingergleichung linear ist.'], a:0, ex:'Die Zeile ist exakt, keine Näherung: $k_mx - qx = k_1x$ und $k_mx + qx = k_2x$.'}},
        {l:'= 2 e^(i(k_m x - ω_m t)) cos(q x - Ω t)', w:'e^{iu} + e^{−iu} = 2 cos u'},
        {l:'Ω/q = ħ (k_2^2 - k_1^2)/(2m (k_2 - k_1))', w:'Geschwindigkeit der Einhüllenden',
          why:{q:'Warum läuft die Einhüllende mit $\\Omega/q$?', opts:['$\\cos(qx - \\Omega t)$ ist konstant, wenn $x = (\\Omega/q)\\,t$ + const.', 'Weil $\\Omega$ die größere der beiden Frequenzen ist.', 'Weil $q$ die mittlere Wellenzahl ist.'], a:0, ex:'Dieselbe Überlegung wie bei der Phasengeschwindigkeit, angewandt auf den Kosinus.'}},
        {l:'= ħ (k_1 + k_2)/(2m)', w:'k₂² − k₁² = (k₂ − k₁)(k₂ + k₁)'},
        {l:'= ħ k_m/m', w:'klassische Geschwindigkeit bei k_m',
          why:{q:'Wie schnell laufen dagegen die Wellenberge der Trägerwelle?', opts:['mit $\\omega_m/k_m$, für $k_1 \\approx k_2$ etwa $\\hbar k_m/2m$', 'ebenfalls mit $\\hbar k_m/m$', 'mit $\\Omega/q$, wie die Einhüllende'], a:0, ex:'$\\omega_m/k_m = \\hbar(k_1^2 + k_2^2)/(2m(k_1 + k_2))$; für $k_1 \\to k_2$ wird das $\\hbar k_m/2m = v_\\mathrm{ph}$.'}}
      ]},
      q:[
        {q:'Für Licht im Vakuum ist $\\omega = ck$. Was folgt für ein Lichtpaket?', opts:['$v_\\mathrm{g} = v_\\mathrm{ph} = c$; die Form bleibt erhalten.', '$v_\\mathrm{g} = 2v_\\mathrm{ph}$, wie beim Elektron.', '$v_\\mathrm{g} = c/2$, weil die Einhüllende nachhinkt.'], a:0,
          ex:'Bei linearer Dispersion laufen alle Anteile gleich schnell; das Paket zerfließt nicht. Beim Elektron ist $\\omega \\propto k^2$.'}
      ]},
    {id:'frei-t6', title:'Unschärfe und Zerfließen',
      text:R`Das [[lex:gauss-paket|Gauß-Paket]] $\psi(x,0) = (2\pi\sigma^2)^{-1/4}e^{-x^2/4\sigma^2}e^{ik_0x}$ ist das wichtigste Beispiel. Es hat $\Delta x = \sigma$ und, wie du im Beispiel nachrechnest, $\Delta p = \hbar/(2\sigma)$. Das Produkt $\Delta x\,\Delta p = \hbar/2$ ist das kleinste, das die [[lex:robertson|Unschärferelation]] erlaubt (Thema 6). Das Gauß-Paket ist ein Zustand minimaler Unschärfe.

**Was passiert mit der Zeit?** Die Impulsverteilung $|\varphi(k)|^2$ ändert sich nicht; $\langle p\rangle$ und $\Delta p$ bleiben konstant. Für die Ortsverteilung setzt du $\varphi(k)$ ins Wellenpaket ein. Das Integral ist wieder ein Gauß-Integral, jetzt mit komplexem $\alpha = \sigma^2 + i\hbar t/2m$. Die Herleitung führt es für $k_0 = 0$ aus. Ergebnis: $|\Psi(x,t)|^2$ ist eine Gauß-Kurve mit der Breite

$$\Delta x(t) = \sigma\sqrt{1 + \left(\frac{\hbar t}{2m\sigma^2}\right)^2}.$$

Das Paket **zerfließt**. Quadriert heißt das $\Delta x(t)^2 = \sigma^2 + (\Delta p\,t/m)^2$: Zur Anfangsbreite kommt die Strecke, um die die Impulsanteile in der Zeit $t$ auseinanderlaufen. Für große $t$ wächst $\Delta x \approx \Delta p\,t/m$ linear. Ein anfangs schmales Paket zerfließt schneller, weil es mehr verschiedene Impulse enthält. Die Zeitskala ist $t_0 = 2m\sigma^2/\hbar$: Für $t \ll t_0$ ändert sich $\Delta x$ kaum (nur quadratisch in $t$), für $t \gg t_0$ wächst es linear. Bei $t = t_0$ ist $\Delta x = \sqrt2\,\sigma$.

**Deutung.** Eine Wolke klassischer Teilchen mit derselben Orts- und Geschwindigkeitsstreuung liefe genauso auseinander. Quantenmechanisch neu ist, dass die Streuung $\Delta p \ge \hbar/(2\Delta x)$ unvermeidlich ist. Nach langer Zeit ist der Ort fast nur noch durch den Impuls bestimmt, $x \approx p\,t/m$. Dann bildet $|\Psi(x,t)|^2$ die Impulsverteilung ab – das nutzt die Flugzeitmessung aus dem Kasten „Wozu?“.

**Typische Fehlvorstellungen.** „Das Elektron wird größer“: $|\Psi|^2$ ist eine Verteilung von Messergebnissen; jede Ortsmessung findet das Elektron an einer Stelle (Thema 1). „Zerfließen verletzt die Normierung“: Die Fläche unter $|\Psi|^2$ bleibt $1$; die Kurve wird breiter und niedriger.

**Größenordnungen.** Ein Elektron mit $\sigma = 0{,}1\,\mathrm{nm}$ ist nach etwa $3\cdot10^{-16}\,\mathrm{s}$ doppelt so breit. Ein Staubkorn ($10^{-15}\,\mathrm{kg}$, $\sigma = 1\,\mu\mathrm m$) bräuchte dafür rund ein Jahr. Deshalb sieht man das Zerfließen im Alltag nicht.`,
      fig:{lab:'packet', init:{s0:0.3, k0:0, t:2.5}, caption:'Das Paket startete mit $\\sigma_0 = 0{,}3$ und ist bei $t = 2{,}5$ schon über zehnmal so breit. Stelle $\\sigma_0 = 1{,}0$ ein: Das anfangs breitere Paket ist jetzt schmaler. Die Fläche unter $|\\psi|^2$ bleibt $1$.'},
      derive:{ctx:{coords:['x', 't'], params:{σ:'pos', m:'pos'}, defs:{'φ(k)':'(2σ^2/π)^(1/4) e^(-σ^2 k^2)', 'α':'σ^2 + iħ t/(2m)', s:'σ sqrt(1 + (ħ t/(2m σ^2))^2)'}}, lines:[
        {l:'Ψ = 1/sqrt(2π) ∫_-∞^∞ φ(k) e^(i k x - iħ k^2 t/(2m)) dk', w:'Wellenpaket mit ω = ħk²/2m, φ aus dem Beispiel'},
        {l:'= 1/sqrt(2π) (2σ^2/π)^(1/4) ∫_-∞^∞ e^(-α k^2 + i x k) dk', w:'Exponenten zusammengefasst, α = σ² + iħt/2m',
          why:{q:'Woher kommt der Imaginärteil von $\\alpha$?', opts:['aus dem Zeitfaktor $e^{-i\\hbar k^2t/2m}$', 'aus dem Ortsfaktor $e^{ikx}$ im Integranden', 'aus dem Vorfaktor $(2\\sigma^2/\\pi)^{1/4}$ von $\\varphi$'], a:0, ex:'$-\\sigma^2k^2 - i\\hbar k^2t/2m = -\\alpha k^2$. Wäre $\\omega$ linear in $k$, käme kein Imaginärteil dazu – und kein Zerfließen.'}},
        {l:'= 1/sqrt(2π) (2σ^2/π)^(1/4) sqrt(π/α) e^(-x^2/(4α))', w:'Gauß-Integral mit b = ix, gilt auch für komplexes α mit Re α > 0'},
        {l:'|Ψ|^2 = 1/(sqrt(2π) s) e^(-x^2/(2 s^2))', w:'Betragsquadrat: |α| = σ s',
          why:{q:'Was ist $s$ in dieser Zeile?', opts:['die Breite $\\Delta x(t)$ der Gauß-Kurve', 'die Lage des Maximums zur Zeit $t$', 'die mittlere Wellenzahl des Pakets'], a:0, ex:'Eine Dichte $\\frac{1}{\\sqrt{2\\pi}s}e^{-x^2/2s^2}$ hat die Standardabweichung $s$. Hier ist $s = \\Delta x(t)$.'}},
        {l:'s^2 = σ^2 + (ħ/(2σ))^2 t^2/m^2', w:'Δx(t)² = σ² + (Δp t/m)²',
          why:{q:'Wie deutest du die Summe $\\sigma^2 + (\\Delta p\\,t/m)^2$?', opts:['Anfangsbreite plus Auseinanderlaufen der Impulsanteile', 'Breite in $x$ plus Breite in $k$', 'eine Näherung, die nur für kleine $t$ gilt'], a:0, ex:'Die Formel ist exakt. Der zweite Term ist die Strecke, um die sich Anteile mit Geschwindigkeitsunterschied $\\Delta p/m$ in der Zeit $t$ trennen.'}}
      ]},
      q:[
        {q:'Ein Gauß-Paket zerfließt. Was gilt für die Fläche unter $|\\Psi(x,t)|^2$ und die Höhe des Maximums?', opts:['Fläche bleibt $1$, Maximum sinkt wie $1/\\Delta x(t)$', 'Fläche wächst wie $\\Delta x(t)$, Maximum bleibt', 'beide bleiben gleich, nur die Form ändert sich'], a:0,
          ex:'Die Normierung bleibt erhalten (Thema 2). Eine breitere Gauß-Kurve mit Fläche $1$ muss niedriger sein: Maximum $1/(\\sqrt{2\\pi}\\,\\Delta x)$.'},
        {q:'Warum ist das Zerfließen bei einem Staubkorn praktisch unsichtbar?', opts:['Die große Masse macht $\\Delta p/m$ winzig.', 'Für schwere Körper gilt die Schrödingergleichung nicht.', 'Staubkörner haben keine Impulsunschärfe.'], a:0,
          ex:'$\\Delta x$ wächst wie $\\hbar t/(2m\\sigma)$. Bei $m = 10^{-15}\\,\\mathrm{kg}$ dauert die Verdopplung etwa ein Jahr.'}
      ]}
  ],
  example:{
    title:'Impulsraum-Wellenfunktion des Gauß-Pakets',
    text:'Das Gauß-Paket $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}$ hat $\\Delta x = \\sigma$. Berechne $\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$ mit der Formel $\\int e^{-\\alpha x^2 + bx}dx = \\sqrt{\\pi/\\alpha}\\,e^{b^2/(4\\alpha)}$.',
    ctx:{coords:['k'], params:{σ:'pos'}, defs:{'ψ(x)':'(2πσ^2)^(-1/4) e^(-x^2/(4σ^2))', 'φ(k)':'1/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-i k x) dx'}},
    lines:[
      {l:'φ(k) = 1/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-ikx) dx', why:{q:'Was ist $\\varphi(k)$?', opts:['die Wellenfunktion im Impulsraum ($p = \\hbar k$)', 'die Ableitung von $\\psi$ nach $x$', 'die Wahrscheinlichkeit für den Ort $x = k$'], a:0, ex:'$|\\varphi(k)|^2dk$ ist die Wahrscheinlichkeit für Wellenzahlen in $[k, k + dk]$.'}},
      {l:'= (2πσ^2)^(-1/4)/sqrt(2π) ∫_-∞^∞ e^(-x^2/(4σ^2) - ikx) dx', why:{q:'Was wurde gemacht?', opts:['$\\psi$ eingesetzt, Exponenten zusammengefasst', 'partiell integriert, Randterm weggelassen', 'nach $k$ abgeleitet und $x = 0$ gesetzt'], a:0, ex:'$e^ae^b = e^{a+b}$; der Vorfaktor von $\\psi$ steht vor dem Integral.'}},
      {l:'= (2πσ^2)^(-1/4)/sqrt(2π) · sqrt(4πσ^2) e^(-σ^2 k^2)', why:{q:'Welche Werte haben $\\alpha$ und $b$?', opts:['$\\alpha = 1/(4\\sigma^2)$, $b = -ik$', '$\\alpha = \\sigma^2$, $b = k$', '$\\alpha = 4\\sigma^2$, $b = ik$'], a:0, ex:'$b^2/(4\\alpha) = (-ik)^2\\sigma^2 = -k^2\\sigma^2$ und $\\sqrt{\\pi/\\alpha} = \\sqrt{4\\pi\\sigma^2}$.'}},
      {l:'= (2σ^2/π)^(1/4) e^(-σ^2 k^2)', why:{q:'Was sieht man am Ergebnis?', opts:['wieder eine Gauß-Kurve, umso schmaler, je breiter $\\psi$ ist', 'wieder eine Gauß-Kurve, umso breiter, je breiter $\\psi$ ist', 'eine Gauß-Kurve, deren Breite nicht von $\\sigma$ abhängt'], a:0, ex:'Breite in $x$: $\\sigma$; in $k$: $\\propto 1/\\sigma$. Das ist die Unschärfe in Formeln.'}}
    ],
    faded:{id:'frei-fade', title:'Jetzt du: Impulsunschärfe aus φ(k)',
      text:'Mit $\\varphi(k) = (2\\sigma^2/\\pi)^{1/4}e^{-\\sigma^2k^2}$ ist $\\langle k\\rangle = 0$. Berechne $\\Delta p = \\hbar\\sqrt{\\langle k^2\\rangle}$. Nützlich: $\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$.',
      ctx:{coords:['k'], space:['k'], params:{σ:'pos'}, defs:{'φ(k)':'(2σ^2/π)^(1/4) e^(-σ^2 k^2)'}, state:'φ', normalized:true},
      given:['⟨k^2⟩ = ∫_-∞^∞ k^2 |φ(k)|^2 dk', '= sqrt(2σ^2/π) ∫_-∞^∞ k^2 e^(-2σ^2 k^2) dk'],
      goals:[{id:'a', prompt:'Bestimme $\\langle k^2\\rangle$ und dann $\\Delta p$.', type:'value', target:'ħ/(2σ)', points:3,
        hints:['Das Integral hat die Form $\\int k^2e^{-\\alpha k^2}dk$ – benutze die angegebene Formel.', 'Hier ist $\\alpha = 2\\sigma^2$.', 'Es kommt $\\langle k^2\\rangle = 1/(4\\sigma^2)$ heraus; dann $\\Delta p = \\hbar\\sqrt{\\langle k^2\\rangle}$.'],
        model:['⟨k^2⟩ = ∫_-∞^∞ k^2 |φ(k)|^2 dk', '= sqrt(2σ^2/π) ∫_-∞^∞ k^2 e^(-2σ^2 k^2) dk', {l:'= sqrt(2σ^2/π) · 1/(4σ^2) sqrt(π/(2σ^2))', gap:'= sqrt(2σ^2/π) · ▢'}, '= 1/(4σ^2)', 'ħ sqrt(⟨k^2⟩) = ħ/(2σ)'],
        note:'Mit $\\Delta x = \\sigma$ folgt $\\Delta x\\,\\Delta p = \\hbar/2$ – das Minimum der Unschärferelation.'}]}
  },
  puzzle:{
    title:'Ein Paket, das erst schmaler wird',
    text:'Ein freies Teilchen ($V = 0$) startet im Zustand\n\n$$\\psi(x,0) = (2\\pi\\sigma^2)^{-1/4}\\,e^{-x^2/(4\\sigma^2)}\\,e^{-i\\beta x^2}\\qquad(\\beta > 0).$$\n\nDie Ortsdichte $|\\psi(x,0)|^2$ ist dieselbe wie beim gewöhnlichen Gauß-Paket, also $\\Delta x(0) = \\sigma$. Nur die Phase hängt jetzt quadratisch von $x$ ab.\n\nWie verhält sich $\\Delta x(t)$ für $t > 0$? Tipp: Welche lokale Wellenzahl $k(x) = \\frac{d}{dx}(\\text{Phase})$ hat das Paket links und rechts der Mitte?',
    q:{q:'Deine Vermutung:', opts:['$\\Delta x$ wächst sofort, wie bei jedem freien Gauß-Paket', '$\\Delta x$ nimmt erst ab und wächst dann', '$\\Delta x$ bleibt $\\sigma$, weil $|\\psi(x,0)|^2$ dasselbe ist', '$\\Delta x$ nimmt für immer ab'], a:1, ex:'Die Phase $-\\beta x^2$ gibt rechts der Mitte Impulse nach links und links der Mitte Impulse nach rechts: Das Paket läuft zunächst zusammen.'},
    reveal:'Die lokale Wellenzahl ist $k(x) = \\frac{d}{dx}(-\\beta x^2) = -2\\beta x$: Rechts der Mitte zeigen die Impulse nach links, links der Mitte nach rechts. Das Paket läuft zusammen, ähnlich wie Licht hinter einer Sammellinse.\n\nDie Rechnung geht wie im Abschnitt zum Zerfließen. Schreibt man $\\psi(x,0) \\propto e^{-x^2/(4\\alpha_0)}$ mit komplexem $\\alpha_0$, dann ist $\\psi(x,t) \\propto e^{-x^2/(4\\alpha(t))}$ mit $\\alpha(t) = \\alpha_0 + \\frac{i\\hbar t}{2m}$ und $\\Delta x(t)^2 = |\\alpha(t)|^2/\\mathrm{Re}\\,\\alpha_0$. Hier ist $\\frac{1}{\\alpha_0} = \\frac{1}{\\sigma^2} + 4i\\beta$. Ergebnis:\n\n- Am schmalsten ist das Paket zur Zeit $t^* = \\frac{8m\\beta\\sigma^4}{\\hbar(1 + 16\\beta^2\\sigma^4)}$, mit $\\Delta x_{\\min} = \\frac{\\sigma}{\\sqrt{1 + 16\\beta^2\\sigma^4}} < \\sigma$.\n- Danach zerfließt es wie gewohnt.\n- Die Impulsverteilung bleibt konstant, mit $\\Delta p = \\hbar\\sqrt{\\frac{1}{4\\sigma^2} + 4\\beta^2\\sigma^2} > \\frac{\\hbar}{2\\sigma}$. Am Anfang ist also $\\Delta x\\,\\Delta p > \\hbar/2$; an der schmalsten Stelle gilt $\\Delta x_{\\min}\\,\\Delta p = \\hbar/2$.\n\nLehre: $|\\psi|^2$ allein legt die Zukunft nicht fest; die Phase gehört zum Zustand. Ein gewöhnliches Gauß-Paket bekommt beim Zerfließen selbst eine Phase $\\propto +x^2$: Seine Anteile laufen nach außen. Ein Paket mit $e^{-i\\beta x^2}$ ist gewissermaßen der rückwärts laufende Film davon.'
  },
  clarify:{
    core:'Für $V = 0$ lösen ebene Wellen $e^{i(kx - \\omega t)}$ mit $\\omega = \\hbar k^2/(2m)$ die Schrödingergleichung. Sie sind Impulseigenfunktionen ($p = \\hbar k$), aber **nicht normierbar**, also keine physikalischen Zustände.\n\nPhysikalisch sind Wellenpakete:\n\n$$\\Psi(x,t) = \\frac{1}{\\sqrt{2\\pi}}\\int\\varphi(k)\\,e^{i(kx - \\hbar k^2t/2m)}\\,dk,\\qquad \\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\Psi(x,0)e^{-ikx}dx.$$\n\n$|\\varphi(k)|^2$ ist die Verteilung der Wellenzahlen; beim freien Teilchen ändert sie sich nicht. Das Maximum des Pakets bewegt sich mit $v_\\mathrm{g} = d\\omega/dk = \\hbar k_0/m$. Das Gauß-Paket mit $\\Delta x(0) = \\sigma$ hat $\\Delta p = \\hbar/(2\\sigma)$ (minimale Unschärfe). Es zerfließt wie $\\Delta x(t) = \\sigma\\sqrt{1 + \\left(\\frac{\\hbar t}{2m\\sigma^2}\\right)^2}$.',
    keys:[
      '$v_\\mathrm{g} = 2v_\\mathrm{ph}$ für ein freies nichtrelativistisches Teilchen.',
      'Ein Faktor $e^{ik_0x}$ verschiebt $\\varphi(k)$ um $k_0$: Er gibt dem Paket den mittleren Impuls $\\hbar k_0$, ändert aber $|\\psi(x)|^2$ nicht.',
      '$\\Delta p$ bleibt beim freien Teilchen konstant; nur $\\Delta x$ wächst.',
      'Je schmaler das Paket anfangs ist, desto schneller zerfließt es: für große $t$ ist $\\Delta x \\approx \\Delta p\\,t/m = \\frac{\\hbar t}{2m\\sigma}$.',
      'Parseval: $\\int|\\varphi|^2dk = \\int|\\psi|^2dx$. Ist $\\psi$ normiert, dann auch $\\varphi$.'
    ],
    errors:[
      'Die Phasengeschwindigkeit $\\omega/k$ für die Geschwindigkeit des Teilchens halten.',
      'Beim Fourier-Integral das Vorzeichen in $(-ik)^2 = -k^2$ falsch nehmen.',
      'Eine ebene Welle wie ein normiertes $\\psi$ behandeln und $\\int|e^{ikx}|^2dx = 1$ ansetzen.',
      'Glauben, das Zerfließen verletze die Normierung: Die Fläche unter $|\\psi|^2$ bleibt $1$.'
    ],
    checks:[
      {q:'Was ändert der Faktor $e^{ik_0x}$ an $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/4\\sigma^2}$?', opts:['$\\langle p\\rangle$ wird $\\hbar k_0$, $|\\psi|^2$ bleibt gleich.', '$|\\psi|^2$ wird um $k_0$ verschoben, $\\langle p\\rangle$ bleibt.', 'Nichts Messbares, es ist nur eine Phase.'], a:0, ex:'$|e^{ik_0x}| = 1$, aber $\\varphi(k)$ wird um $k_0$ verschoben. Ohne Bedeutung ist nur eine konstante Phase.'},
      {q:'Zwei Gauß-Pakete starten mit $\\sigma_A = 1\\,\\mathrm{nm}$ und $\\sigma_B = 2\\,\\mathrm{nm}$ (gleiche Masse). Welches ist nach langer Zeit breiter?', opts:['A', 'B', 'beide gleich'], a:0, ex:'Für große $t$ ist $\\Delta x \\approx \\hbar t/(2m\\sigma)$: das anfangs schmalere Paket hat das größere $\\Delta p$.'}
    ]
  },
  lab:{type:'packet', title:'Freies Gauß-Paket',
    text:'Dicke Kurve: $|\\psi(x,t)|^2$, dünne Kurve: $\\operatorname{Re}\\psi$. Einheiten mit $\\hbar = m = 1$.',
    predict:{q:'Bevor du den Zeitregler bewegst: Stell $k_0 = 3$ ein. Wie bewegen sich die Wellenberge von $\\mathrm{Re}\\,\\psi$ im Vergleich zum Maximum von $|\\psi|^2$?', opts:['langsamer: Sie wandern im Paket nach hinten', 'gleich schnell: Das Muster läuft starr mit', 'schneller: Sie wandern im Paket nach vorn'], a:0,
      ex:'$v_\\mathrm{ph} = \\hbar k_0/2m$ ist halb so groß wie $v_\\mathrm{g} = \\hbar k_0/m$. Relativ zur Einhüllenden laufen die Wellenberge deshalb nach hinten.'},
    questions:[
      {q:'Stelle $\\sigma_0 = 0{,}3$ ein und ziehe $t$ auf $2{,}5$. Dann dasselbe mit $\\sigma_0 = 1{,}0$. Welches Paket ist am Ende breiter?', opts:['das mit $\\sigma_0 = 0{,}3$', 'das mit $\\sigma_0 = 1{,}0$', 'beide gleich'], a:0, ex:'Schmaler Anfang heißt großes $\\Delta p = \\hbar/(2\\sigma_0)$ und damit schnelles Zerfließen.'},
      {q:'Was bewegt sich mit der Geschwindigkeit $\\hbar k_0/m$?', opts:['das Maximum von $|\\psi|^2$', 'die Wellenberge von $\\operatorname{Re}\\psi$', 'die Nullstellen von $\\operatorname{Re}\\psi$'], a:0, ex:'Die Einhüllende läuft mit $v_\\mathrm{g} = \\hbar k_0/m$; die Wellenberge und Nullstellen laufen mit $v_\\mathrm{ph} = v_\\mathrm{g}/2$ durch das Paket.'}
    ],
    noPic:{q:'Ohne Bild: Wie ändert sich $\\Delta p$ eines freien Wellenpakets mit der Zeit?', opts:['gar nicht', 'es wächst wie $\\Delta x$', 'es nimmt ab'], a:0, ex:'$\\hat H = \\hat p^2/2m$ enthält nur $\\hat p$: Jede Impulskomponente bekommt nur einen Phasenfaktor $e^{-i\\omega(k)t}$, und $|\\varphi(k)|^2$ ändert sich nicht.'}},
  compare:{
    text:'Gesucht ist $\\langle p\\rangle$ für $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}e^{ik_0x}$. Die Impulsraum-Wellenfunktion ist $\\varphi(k) = (2\\sigma^2/\\pi)^{1/4}e^{-\\sigma^2(k - k_0)^2}$. Zwei richtige Wege:',
    ctx:{coords:['x'], params:{σ:'pos', 'k_0':'real'}, defs:{'ψ(x)':GAUSS, 'φ(k)':'(2σ^2/π)^(1/4) e^(-σ^2 (k - k_0)^2)'}, state:'ψ', normalized:true},
    A:{name:'Im Ortsraum', model:['⟨p⟩ = ∫_-∞^∞ ψ^* (-iħ) ψ\' dx', {l:'= ∫_-∞^∞ |ψ|^2 (ħ k_0 + iħ x/(2σ^2)) dx', w:'ψ′ = (ik₀ − x/(2σ²)) ψ'}, {l:'= ħ k_0', w:'ungerader Anteil verschwindet'}]},
    B:{name:'Im Impulsraum', model:['⟨p⟩ = ∫_-∞^∞ ħ k |φ(k)|^2 dk', {l:'= ħ k_0', w:'symmetrisch um k₀'}]},
    questions:[
      {q:'Warum ist Weg B hier fast ohne Rechnung möglich?', opts:['$|\\varphi(k)|^2$ ist symmetrisch um $k_0$ und normiert.', 'Weil $\\hbar k$ unter dem Integral konstant ist.', 'Weil $\\varphi(k)$ hier eine reelle Funktion ist.'], a:0, ex:'Ein Mittelwert einer symmetrischen Verteilung liegt im Symmetriepunkt.'},
      {q:'Wofür ist der Ortsraum besser geeignet?', opts:['für $\\langle x\\rangle$, $\\langle x^2\\rangle$, $\\langle V(x)\\rangle$', 'für $\\langle p^2\\rangle$ und $\\langle p\\rangle$', 'für $\\langle p^2/2m\\rangle$ allein'], a:0, ex:'Jede Größe ist dort einfach, wo sie ein Multiplikationsoperator ist: $x$ im Ortsraum, $p = \\hbar k$ im Impulsraum.'}
    ]
  },
  practice:[
    {id:'frei-p1', title:'Phasen- und Gruppengeschwindigkeit',
      text:'Für ein freies Teilchen gilt $\\omega(k) = \\hbar k^2/(2m)$. Schreibe $v_p$ für die Phasen- und $v_g$ für die Gruppengeschwindigkeit.',
      ctx:{coords:['x'], params:{k:'pos', m:'pos'}, defs:{'ω':'ħ k^2/(2m)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $v_p = \\omega/k$.', type:'value', target:'ħ k/(2m)', points:1, ph:'v_p = ω/k',
          hints:['Gesucht ist die Geschwindigkeit der Wellenberge: Die Phase $kx - \\omega t$ bleibt konstant.', 'Teile $\\omega(k) = \\hbar k^2/2m$ durch $k$.'],
          model:['v_p = ω/k', '= ħ k/(2m)']},
        {id:'b', prompt:'b) Berechne $v_g = d\\omega/dk$.', type:'value', target:'ħ k/m', points:2, ph:'v_g = dω/dk',
          hints:['Gesucht ist die Geschwindigkeit der Einhüllenden. Sie hängt davon ab, wie sich $\\omega$ mit $k$ ändert.', '$v_g = d\\omega/dk$, und $\\frac{d}{dk}k^2 = 2k$.', 'Schreib `v_g = d/dk (ħ k^2/(2m))` und leite ab.'],
          model:['v_g = dω/dk', '= d/dk (ħ k^2/(2m))', '= ħ k/m'], mistakes:[{expr:'ħ k/(2m)', msg:'Das ist die Phasengeschwindigkeit. Für $v_g$ wird abgeleitet, nicht geteilt.'}]}
      ]},
    {id:'frei-p2', title:'Ebene Welle als Eigenfunktion',
      text:'$\\psi(x) = e^{ikx}$ mit reellem $k$, freies Teilchen ($V = 0$).',
      ctx:{coords:['x'], params:{k:'real', m:'pos'}, defs:{'ψ(x)':'e^(i k x)'}},
      goals:[
        {id:'a', prompt:'a) Zeige: $\\hat p\\psi = \\hbar k\\,\\psi$.', type:'show', from:'p̂ ψ', to:'ħ k ψ', points:2,
          hints:['Zeigen heißt: links $\\hat p\\psi$ ausschreiben und umformen, bis $\\hbar k\\,\\psi$ dasteht.', 'Setze $\\hat p = -i\\hbar\\,d/dx$ ein; $\\frac{d}{dx}e^{ikx} = ik\\,e^{ikx}$.', 'Es bleibt $-i\\hbar\\cdot ik = \\hbar k$.'],
          model:['p̂ ψ = -iħ d/dx e^(ikx)', '= -iħ · ik e^(ikx)', '= ħ k ψ']},
        {id:'b', prompt:'b) Zeige: $\\hat H\\psi = \\frac{\\hbar^2k^2}{2m}\\psi$.', type:'show', from:'Ĥ ψ', to:'ħ^2 k^2/(2m) ψ', points:2,
          hints:['Wie bei a): $\\hat H\\psi$ ausschreiben und vereinfachen.', '$\\hat H = -\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2}$; zweimal ableiten bringt $(ik)^2 = -k^2$.'],
          model:['Ĥ ψ = -ħ^2/(2m) d^2/dx^2 e^(ikx)', '= -ħ^2/(2m) (ik)^2 e^(ikx)', '= ħ^2 k^2/(2m) ψ']}
      ]},
    {id:'frei-p3', title:'Normierung und Ortsunschärfe des Gauß-Pakets',
      text:'$\\psi(x) = A\\,e^{-x^2/(4\\sigma^2)}e^{ik_0x}$ mit $\\sigma > 0$ und reellem $k_0$.',
      ctx:{coords:['x'], params:{σ:'pos', 'k_0':'real', m:'pos'}, defs:{'ψ(x)':'A e^(-x^2/(4σ^2)) e^(i k_0 x)'}, unknowns:{A:{ref:'(2πσ^2)^(-1/4)', alt:['-(2πσ^2)^(-1/4)']}}, state:'ψ'},
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2,
          hints:['Normierung: $\\int|\\psi|^2dx = 1$ ansetzen und nach $A$ auflösen.', '$|e^{ik_0x}|^2 = 1$; es bleibt $|A|^2\\int e^{-x^2/(2\\sigma^2)}dx$, ein Gauß-Integral.', '$\\int e^{-x^2/(2\\sigma^2)}dx = \\sqrt{2\\pi\\sigma^2}$.'],
          model:['∫_-∞^∞ |ψ|^2 dx = 1', '|A|^2 ∫_-∞^∞ e^(-x^2/(2σ^2)) dx = 1', '|A|^2 sqrt(2πσ^2) = 1', 'A = (2πσ^2)^(-1/4)']},
        {id:'b', prompt:'b) Berechne $\\langle x^2\\rangle$ (es ist $\\langle x\\rangle = 0$, also $\\Delta x = \\sqrt{\\langle x^2\\rangle}$).', type:'value', target:'σ^2', points:2,
          hints:['$\\langle x^2\\rangle = \\int x^2|\\psi|^2dx$ mit dem $A$ aus a).', '$\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1/(2\\sigma^2)$.'],
          model:['⟨x^2⟩ = (2πσ^2)^(-1/2) ∫_-∞^∞ x^2 e^(-x^2/(2σ^2)) dx', '= (2πσ^2)^(-1/2) · σ^2 sqrt(2πσ^2)', '= σ^2']}
      ]},
    {id:'frei-p4', title:'Wann ist das Paket doppelt so breit?',
      text:'Ein freies Gauß-Paket hat $\\Delta x(t) = \\sigma\\sqrt{1 + \\left(\\frac{\\hbar t}{2m\\sigma^2}\\right)^2}$. Nenne die gesuchte Zeit $\\tau$.',
      ctx:{coords:['x'], params:{σ:'pos', m:'pos'}, unknowns:{τ:{ref:'2 sqrt(3) m σ^2/ħ'}}},
      goals:[
        {id:'a', prompt:'Bestimme $\\tau$ mit $\\Delta x(\\tau) = 2\\sigma$.', type:'solve', unknown:'τ', points:3, ph:'σ sqrt(1 + (ħτ/(2mσ^2))^2) = 2σ',
          hints:['Setze $\\Delta x(\\tau) = 2\\sigma$ an und löse nach $\\tau$ auf.', 'Durch $\\sigma$ teilen und quadrieren.', 'Es bleibt $(\\hbar\\tau/(2m\\sigma^2))^2 = 3$.'],
          model:['σ sqrt(1 + (ħτ/(2mσ^2))^2) = 2σ', '1 + (ħτ/(2mσ^2))^2 = 4', 'ħτ/(2mσ^2) = sqrt(3)', 'τ = 2 sqrt(3) m σ^2/ħ'],
          note:'Beispiel: Elektron mit $\\sigma = 1\\,\\text{Å}$: $\\tau \\approx 3\\cdot10^{-16}\\,\\mathrm{s}$. Ein Staubkorn ($10^{-15}\\,\\mathrm{kg}$, $\\sigma = 1\\,\\mu\\mathrm{m}$) bräuchte etwa $3\\cdot10^7\\,\\mathrm s$ – rund ein Jahr.'}
      ]},
    {id:'frei-p5', title:'Impulsverteilung einer abfallenden Exponentialfunktion',
      text:'$\\psi(x) = \\frac{1}{\\sqrt a}e^{-|x|/a}$ (normiert, Thema 1). Teile das Fourier-Integral in $x < 0$ und $x > 0$ auf.',
      ctx:{coords:['k'], params:{a:'pos'}, defs:{'φ(k)':'sqrt(2a/π)/(1 + a^2 k^2)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\varphi(k)$.', type:'value', target:'sqrt(2a/π)/(1 + a^2 k^2)', points:3, ph:'φ(k) = 1/sqrt(2π a) ∫_-∞^∞ e^(-|x|/a) e^(-ikx) dx',
          hints:['Teile das Integral bei $x = 0$: Für $x > 0$ ist $|x| = x$, für $x < 0$ ist $|x| = -x$.', 'Für $x < 0$ substituiere $x \\to -x$: Es entsteht $\\int_0^\\infty e^{-x/a + ikx}dx$.', '$\\int_0^\\infty e^{-cx}dx = 1/c$ gilt auch für komplexes $c$ mit $\\operatorname{Re}c > 0$.'],
          model:['φ(k) = 1/sqrt(2π a) ∫_-∞^∞ e^(-|x|/a) e^(-ikx) dx', '= 1/sqrt(2π a) (∫_0^∞ e^(-x/a - ikx) dx + ∫_0^∞ e^(-x/a + ikx) dx)', '= 1/sqrt(2π a) (1/(1/a + ik) + 1/(1/a - ik))', '= sqrt(2a/π)/(1 + a^2 k^2)']},
        {id:'b', prompt:'b) Prüfe die Normierung: $\\int|\\varphi(k)|^2dk$. Nützlich: $\\int_{-\\infty}^\\infty\\frac{dk}{(1 + a^2k^2)^2} = \\frac{\\pi}{2a}$.', type:'value', target:'1', points:2,
          hints:['Setze $\\varphi(k)$ aus a) ein; $\\varphi$ ist reell, also $|\\varphi|^2 = \\varphi^2$.', 'Der Vorfaktor ist $2a/\\pi$; das Integral steht in der Aufgabe.'],
          model:['∫_-∞^∞ |φ(k)|^2 dk = 2a/π ∫_-∞^∞ 1/(1 + a^2 k^2)^2 dk', '= 2a/π · π/(2a)', '= 1'], note:'Parseval bestätigt: $\\psi$ und $\\varphi$ sind beide normiert.'}
      ]}
  ],
  concept:[
    {id:'frei-k1', type:'mc2', seg:'frei-t6', lex:'gauss-paket',
      q:'Das Gauß-Paket $\\psi(x,0) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/4\\sigma^2}e^{ik_0x}$ bewegt sich frei ($V = 0$). Ist es ein stationärer Zustand?', opts:['Nein', 'Ja', 'Nur für $k_0 = 0$'], a:0,
      ex:'Auch für $k_0 = 0$ zerfließt das Paket; $|\\psi(x,t)|^2$ hängt von $t$ ab.',
      reason:{q:'Warum?', opts:['Es überlagert verschiedene $k$, also verschiedene Energien; $|\\psi|^2$ wandert und zerfließt.', 'Ohne Kraft ändert sich am Zustand nichts; auch $\\langle p\\rangle$ bleibt ja konstant.', '$|\\varphi(k)|^2$ ist zeitlich konstant, also ändert sich auch der Zustand nicht.'], a:0,
        ex:'Stationär ist nur ein Zustand mit einer einzigen Energie. Dass $|\\varphi(k)|^2$ konstant ist, betrifft die Impulsverteilung, nicht die Ortsverteilung. Die Vorstellung „jeder Zustand ist stationär“ ist eine bekannte Lernschwierigkeit (Styer 1996).'}},
    {id:'frei-k2', type:'dialog', seg:'frei-t6', keep:true,
      text:'Ein Elektron startet als Gauß-Paket mit $\\Delta x = 0{,}1\\,\\mathrm{nm}$. Nach einer Nanosekunde ist $\\Delta x \\approx 0{,}6\\,\\mathrm{mm}$.',
      people:[{name:'Lena', says:'Eine Ortsmessung findet es an einer Stelle. Erst viele Messungen an gleich präparierten Elektronen zeigen die Streuung von $0{,}6\\,\\mathrm{mm}$.'}, {name:'Jonas', says:'Dann ist das Elektron jetzt über einen halben Millimeter ausgedehnt. Eine Ortsmessung findet es über diesen Bereich verschmiert.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'$|\\Psi|^2$ ist eine Wahrscheinlichkeitsdichte, keine Materieverteilung. Jede Messung liefert einen Ort; die Breite zeigt sich in der Statistik vieler Messungen. $\\psi$ als physikalisch ausgedehnte Materiewelle zu lesen, ist eine verbreitete Fehlvorstellung.'},
    {id:'frei-k3', type:'mc', seg:'frei-t4', lex:'impulsraum',
      q:'Ein Wellenpaket hat $\\langle p\\rangle = \\hbar k_0$ und $\\Delta p = \\hbar/(2\\sigma)$. Du misst den Impuls eines einzelnen Teilchens. Was kommt heraus?', opts:['ein Wert $\\hbar k$, zufällig verteilt nach $|\\varphi(k)|^2$', 'genau $\\hbar k_0$, denn das ist der Impuls des Pakets', 'das Intervall $\\hbar k_0 \\pm \\hbar/(2\\sigma)$ als Ergebnis'], a:0,
      ex:'Eine Einzelmessung liefert einen Wert. $\\langle p\\rangle$ ist der Mittelwert vieler Messungen, $\\Delta p$ ihre Streuung. Den Erwartungswert als Einzelergebnis zu lesen, ist ein häufiger Fehler.'},
    {id:'frei-k4', type:'mc2', seg:'frei-t5', lex:'gruppengeschwindigkeit',
      q:'Bei einem Elektronen-Wellenpaket mit mittlerer Wellenzahl $k_0$ laufen die Wellenberge mit $\\hbar k_0/2m$. Wie schnell bewegt sich der Ortsmittelwert $\\langle x\\rangle$?', opts:['mit $\\hbar k_0/m$', 'mit $\\hbar k_0/2m$', 'gar nicht, $\\langle x\\rangle$ bleibt'], a:0,
      ex:'$\\frac{d}{dt}\\langle x\\rangle = \\langle p\\rangle/m = \\hbar k_0/m$.',
      reason:{q:'Warum?', opts:['Die Einhüllende läuft mit $d\\omega/dk$, und das ist $\\hbar k_0/m$.', 'Ort und Wellenberge bewegen sich immer gleich schnell.', 'Ohne Kraft bewegt sich der Mittelwert des Orts nicht.'], a:0,
        ex:'Die Wellenberge haben keine Messbedeutung. Messbar ist $|\\Psi|^2$; ihr Schwerpunkt läuft mit $\\langle p\\rangle/m$.'}},
    {id:'frei-k5', type:'mc', seg:'frei-t1',
      q:'Ist $\\psi(x) = \\cos(kx)$ für das freie Teilchen ein Eigenzustand von $\\hat H$? Und von $\\hat p$?', opts:['von $\\hat H$ ja, von $\\hat p$ nein', 'von beiden, weil $\\hat H$ nur $\\hat p$ enthält', 'von keinem, weil $\\cos kx$ reell ist'], a:0,
      ex:'$\\hat H\\cos kx = \\frac{\\hbar^2k^2}{2m}\\cos kx$, aber $\\hat p\\cos kx = i\\hbar k\\sin kx$. $\\hat H = \\hat p^2/2m$ enthält nur $\\hat p$, und doch ist nicht jede Eigenfunktion von $\\hat H$ eine von $\\hat p$: Zur Energie $\\hbar^2k^2/2m$ gehören die beiden Impulse $\\pm\\hbar k$ (Entartung), und $\\cos kx$ überlagert beide. Wie man gemeinsame Eigenfunktionen allgemein findet, zeigt Thema 6.'}
  ],
  final:[
    {aim:0, task:{id:'frei-fa1', title:'Phasen- und Gruppengeschwindigkeit im konstanten Potential',
      text:'In einem Bereich mit konstantem Potential $V_0$ gilt für ein Elektron $\\hbar\\omega = \\frac{\\hbar^2k^2}{2m} + V_0$. Schreibe $v_p$ und $v_g$.',
      ctx:{coords:['x'], params:{k:'pos', m:'pos', V_0:'real'}, defs:{'ω':'ħ k^2/(2m) + V_0/ħ'}},
      goals:[
        {id:'a', prompt:'a) Berechne die Phasengeschwindigkeit $v_p$.', type:'value', target:'ħ k/(2m) + V_0/(ħ k)', points:1, model:['v_p = ω/k', '= ħ k/(2m) + V_0/(ħ k)']},
        {id:'b', prompt:'b) Berechne die Gruppengeschwindigkeit $v_g$.', type:'value', target:'ħ k/m', points:2, model:['v_g = dω/dk', '= d/dk (ħ k^2/(2m) + V_0/ħ)', '= ħ k/m'],
          note:'$V_0$ ändert $v_p$, aber nicht $v_g$: Nur die Gruppengeschwindigkeit ist physikalisch.'}
      ]}},
    {aim:1, task:{id:'frei-fa2', title:'Impulsraum-Wellenfunktion eines Rechteckpakets',
      text:'$\\psi(x) = 1/\\sqrt a$ für $0 < x < a$, sonst $\\psi = 0$.',
      ctx:{coords:['x', 'k'], params:{a:'pos'}, defs:{'φ(k)':'(1 - e^(-i k a))/(i k sqrt(2π a))'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\varphi(k)$.', type:'value', target:'(1 - e^(-i k a))/(i k sqrt(2π a))', points:3,
          model:['φ(k) = 1/sqrt(2π) ∫_0^a 1/sqrt(a) e^(-ikx) dx', '= 1/sqrt(2π a) [e^(-ikx)/(-ik)]_0^a', '= (1 - e^(-ika))/(ik sqrt(2π a))']},
        {id:'b', prompt:'b) Berechne $|\\varphi(k)|^2$ und vereinfache mit $1 - \\cos u = 2\\sin^2(u/2)$.', type:'value', target:'2 sin(k a/2)^2/(π a k^2)', points:2,
          model:['|φ(k)|^2 = (1 - e^(-ika))(1 - e^(ika))/(2π a k^2)', '= (2 - 2cos(k a))/(2π a k^2)', '= 2 sin(k a/2)^2/(π a k^2)']}
      ]}},
    {aim:2, task:{id:'frei-fa3', title:'Impulsunschärfe des Gauß-Pakets',
      text:'$\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}e^{ik_0x}$ mit $\\sigma > 0$ und reellem $k_0$. Es ist $\\Delta x = \\sigma$.',
      ctx:{coords:['x'], params:{σ:'pos', 'k_0':'real'}, defs:{'ψ(x)':GAUSS}, state:'ψ', normalized:true},
      goals:[
        {id:'a', prompt:'a) Berechne $\\Delta p$.', type:'value', target:'ħ/(2σ)', points:3,
          model:['φ(k) = (2σ^2/π)^(1/4) e^(-σ^2 (k - k_0)^2)', '⟨p⟩ = ħ k_0', '⟨p^2⟩ = ħ^2 ∫_-∞^∞ k^2 |φ(k)|^2 dk', '= ħ^2 (k_0^2 + 1/(4σ^2))', 'Δp = sqrt(⟨p^2⟩ - ⟨p⟩^2)', '= ħ/(2σ)']},
        {id:'b', prompt:'b) Berechne $\\Delta x\\,\\Delta p$.', type:'value', target:'ħ/2', points:1, model:['Δx Δp = σ · ħ/(2σ)', '= ħ/2']}
      ]}},
    {aim:'k', type:'mc2', id:'frei-fk1',
      q:'Zwei freie Gauß-Pakete gleicher Masse: A mit $\\sigma_A = 1\\,\\mathrm{nm}$, B mit $\\sigma_B = 3\\,\\mathrm{nm}$. Welches ist nach sehr langer Zeit breiter?', opts:['A', 'B', 'beide gleich'], a:0,
      ex:'Für große $t$ ist $\\Delta x \\approx \\hbar t/(2m\\sigma)$; A ist dann dreimal so breit wie B.',
      reason:{q:'Warum?', opts:['A hat das größere $\\Delta p$; für große $t$ ist $\\Delta x \\approx \\Delta p\\,t/m$.', 'B ist anfangs breiter, und die Breite wächst proportional zur Anfangsbreite.', 'Ohne Kraft zerfließen alle Pakete gleich schnell.'], a:0,
        ex:'Schmal im Ort heißt breit im Impuls: $\\Delta p = \\hbar/(2\\sigma)$.'}},
    {aim:'k', type:'dialog', id:'frei-fk2', keep:true,
      text:'Ein langsames Neutron hat die de-Broglie-Wellenlänge $\\lambda = 0{,}4\\,\\mathrm{nm}$ und soll eine Flugstrecke von $1\\,\\mathrm{m}$ zurücklegen. Die Wellenberge seines Wellenpakets laufen mit $\\omega/k = h/(2m\\lambda) \\approx 500\\,\\mathrm{m/s}$.',
      people:[{name:'Lena', says:'Dann braucht das Neutron für den Meter etwa $2\\,\\mathrm{ms}$, denn es fliegt mit der Geschwindigkeit seiner Wellenberge.'}, {name:'Jonas', says:'Ein Detektor am Ende spricht im Mittel schon nach etwa $1\\,\\mathrm{ms}$ an, denn das Paket läuft mit $d\\omega/dk = h/(m\\lambda) \\approx 1000\\,\\mathrm{m/s}$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Messbar ist, wo $|\\Psi|^2$ groß ist. Das Maximum läuft mit der Gruppengeschwindigkeit $v_\\mathrm{g} = \\hbar k/m = h/(m\\lambda) \\approx 990\\,\\mathrm{m/s}$, der klassischen Geschwindigkeit $p/m$. Die Phasengeschwindigkeit ist halb so groß und hat keine Messbedeutung; sie hängt sogar vom Energienullpunkt ab.'}
  ],
  finalB:[
    {aim:0, task:{id:'frei-fb1', title:'Phasen- und Gruppengeschwindigkeit eines Leitungselektrons',
      text:'Ein Elektron im Leitungsband eines Halbleiters verhält sich näherungsweise wie ein freies Teilchen mit der effektiven Masse $M$ (oft $m^*$ geschrieben), oberhalb der Bandkante $E_c$: $\\hbar\\omega = E_c + \\frac{\\hbar^2k^2}{2M}$. Schreibe $v_p$ und $v_g$.',
      ctx:{coords:['x'], params:{k:'pos', M:'pos', 'E_c':'real'}, defs:{'ω':'E_c/ħ + ħ k^2/(2M)'}},
      goals:[
        {id:'a', prompt:'a) Berechne die Phasengeschwindigkeit $v_p$.', type:'value', target:'E_c/(ħ k) + ħ k/(2M)', points:1, model:['v_p = ω/k', '= E_c/(ħ k) + ħ k/(2M)']},
        {id:'b', prompt:'b) Berechne die Gruppengeschwindigkeit $v_g$.', type:'value', target:'ħ k/M', points:2, model:['v_g = dω/dk', '= d/dk (E_c/ħ + ħ k^2/(2M))', '= ħ k/M'],
          note:'$E_c$ ändert $v_p$, aber nicht $v_g$. Das Elektron bewegt sich mit $v_g = \\hbar k/M$, wie ein freies Teilchen der Masse $M$.'}
      ]}},
    {aim:1, task:{id:'frei-fb2', title:'Impulsraum-Wellenfunktion einer einseitigen Exponentialfunktion',
      text:'$\\psi(x) = \\sqrt{2\\kappa}\\,e^{-\\kappa x}$ für $x > 0$, sonst $\\psi = 0$ (normiert, $\\kappa > 0$).',
      ctx:{coords:['x', 'k'], params:{κ:'pos'}, defs:{'φ(k)':'sqrt(κ/π)/(κ + i k)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\varphi(k)$.', type:'value', target:'sqrt(κ/π)/(κ + i k)', points:3,
          model:['φ(k) = 1/sqrt(2π) ∫_0^∞ sqrt(2κ) e^(-κ x) e^(-ikx) dx', '= sqrt(κ/π) ∫_0^∞ e^(-(κ + ik) x) dx', '= sqrt(κ/π)/(κ + ik)']},
        {id:'b', prompt:'b) Berechne $|\\varphi(k)|^2$.', type:'value', target:'κ/(π (κ^2 + k^2))', points:2,
          model:['|φ(k)|^2 = κ/π · 1/((κ + ik)(κ - ik))', '= κ/(π (κ^2 + k^2))']}
      ]}},
    {aim:2, task:{id:'frei-fb3', title:'Impulsunschärfe eines anders geschriebenen Gauß-Pakets',
      text:'$\\psi(x) = (\\pi b^2)^{-1/4}e^{-x^2/(2b^2)}e^{ik_0x}$ mit $b > 0$ und reellem $k_0$. Es ist $\\Delta x = b/\\sqrt2$.',
      ctx:{coords:['x'], params:{b:'pos', 'k_0':'real'}, defs:{'ψ(x)':'(π b^2)^(-1/4) e^(-x^2/(2b^2)) e^(i k_0 x)'}, state:'ψ', normalized:true},
      goals:[
        {id:'a', prompt:'a) Berechne $\\Delta p$.', type:'value', target:'ħ/(sqrt(2) b)', points:3,
          model:['⟨p⟩ = ħ k_0', '⟨p^2⟩ = ħ^2 (k_0^2 + 1/(2b^2))', 'Δp = sqrt(⟨p^2⟩ - ⟨p⟩^2)', '= ħ/(sqrt(2) b)']},
        {id:'b', prompt:'b) Berechne $\\Delta x\\,\\Delta p$.', type:'value', target:'ħ/2', points:1, model:['Δx Δp = b/sqrt(2) · ħ/(sqrt(2) b)', '= ħ/2']}
      ]}},
    {aim:'k', type:'mc2', id:'frei-gk1',
      q:'Ein freies Elektronen-Wellenpaket soll nach einer festen Flugzeit $t$ möglichst schmal sein. Wie wählst du die Anfangsbreite $\\sigma$?', opts:['nicht beliebig klein: Für ein bestimmtes $\\sigma$ ist $\\Delta x(t)$ am kleinsten', 'so klein wie möglich, denn ein schmaler Start bleibt am schmalsten', 'so groß wie möglich, denn breite Pakete zerfließen am langsamsten'], a:0,
      ex:'$\\Delta x(t)^2 = \\sigma^2 + \\left(\\frac{\\hbar t}{2m\\sigma}\\right)^2$ ist am kleinsten für $\\sigma^2 = \\hbar t/(2m)$; dann ist $\\Delta x(t) = \\sqrt{\\hbar t/m}$.',
      reason:{q:'Warum?', opts:['Kleines $\\sigma$ heißt großes $\\Delta p$ und schnelles Zerfließen.', 'Ohne Kraft bleibt die Breite eines freien Pakets immer erhalten.', 'Die spätere Breite wächst proportional zur Anfangsbreite.'], a:0,
        ex:'Zwei Beiträge konkurrieren: die Anfangsbreite $\\sigma$ und das Auseinanderlaufen der Impulsanteile, $\\Delta p\\,t/m$ mit $\\Delta p = \\hbar/(2\\sigma)$. Ein sehr schmaler Start zerfließt schnell, ein breiter Start ist schon am Anfang breit.'}},
    {aim:'k', type:'dialog', id:'frei-gk2', keep:true,
      text:'Für ein freies Elektron ist $\\omega = \\hbar k^2/2m$. Verschiebt man den Energienullpunkt um $V_0$, wird $\\omega = \\hbar k^2/2m + V_0/\\hbar$.',
      people:[{name:'Lena', says:'Dann bewegt sich das Elektron nach der Verschiebung anders, denn die Wellenberge laufen jetzt mit einer anderen Geschwindigkeit.'}, {name:'Jonas', says:'Durch die Verschiebung ändert sich gar nichts – weder die Bewegung des Elektrons noch die Geschwindigkeit der Wellenberge.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:3,
      ex:'Die Wellenberge laufen tatsächlich anders: $v_\\mathrm{ph} = \\omega/k$ ändert sich um $V_0/(\\hbar k)$. Die Bewegung des Elektrons ändert sich aber nicht: Alle Komponenten bekommen denselben Phasenfaktor $e^{-iV_0t/\\hbar}$, also bleiben $|\\Psi|^2$ und $v_\\mathrm{g} = d\\omega/dk$ gleich.'}
  ],
  errors:[
    {id:'frei-e1', title:'Gruppengeschwindigkeit',
      text:'Für $\\omega(k) = \\hbar k^2/(2m)$ wird die Gruppengeschwindigkeit berechnet:',
      ctx:{coords:['x'], params:{k:'pos', m:'pos'}, defs:{'ω':'ħ k^2/(2m)'}},
      lines:['v_g = dω/dk', '= d/dk (ħ k^2/(2m))', '= ħ k/(2m)', '= ω/k'],
      wrong:2,
      why:{q:'Was ist in Zeile 3 falsch?', opts:['$\\frac{d}{dk}k^2 = 2k$; der Faktor 2 fehlt.', 'Man muss nach $x$ ableiten, nicht nach $k$.', 'Nichts – $v_g = \\omega/k$ stimmt hier.'], a:0, ex:'Richtig ist $v_g = \\hbar k/m = 2v_\\mathrm{ph}$. Gleichheit $v_g = \\omega/k$ gilt nur für $\\omega \\propto k$ (etwa Licht im Vakuum).'},
      fix:{id:'a', prompt:'Berichtige und gib $v_g$ an.', type:'value', target:'ħ k/m', model:['v_g = dω/dk', '= ħ k/m']}}
  ]
});
})();
lexe('ebene-welle', 'Ebene Welle', '$\\Psi(x,t) = Ae^{i(kx - \\omega t)}$ mit $\\omega = \\hbar k^2/2m$ (freies Teilchen). Eigenfunktion von $\\hat p$ zum Eigenwert $\\hbar k$ und von $\\hat H$ zu $\\hbar^2k^2/2m$. Nicht normierbar; Stromdichte $j = |A|^2\\hbar k/m$.', {topic:'frei'});
lexe('gruppengeschwindigkeit', 'Phasen- und Gruppengeschwindigkeit', '$v_\\mathrm{ph} = \\omega/k$ (Wellenberge), $v_g = d\\omega/dk$ (Einhüllende eines Pakets, Energietransport). Freies Teilchen: $v_g = \\hbar k/m = p/m$, $v_\\mathrm{ph} = v_g/2$.', {topic:'frei'});
lexe('wellenpaket', 'Wellenpaket', 'Normierbare Überlagerung ebener Wellen: $\\Psi(x,t) = \\frac{1}{\\sqrt{2\\pi}}\\int\\varphi(k)e^{i(kx - \\omega(k)t)}dk$. $\\varphi(k)$ folgt aus $\\Psi(x,0)$ durch Fourier-Transformation. Je schärfer $\\varphi$, desto breiter $\\Psi$.', {topic:'frei'});
lexe('impulsraum', 'Impulsraum-Wellenfunktion', '$\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$, oder mit $p = \\hbar k$: $\\tilde\\psi(p) = \\frac{1}{\\sqrt{2\\pi\\hbar}}\\int\\psi(x)e^{-ipx/\\hbar}dx$. $|\\tilde\\psi(p)|^2dp$ ist die Wahrscheinlichkeit für Impulse in $[p, p+dp]$; $\\langle p\\rangle = \\int p|\\tilde\\psi|^2dp$.', {topic:'frei'});
lexe('gauss-paket', 'Gauß-Paket und Zerfließen', '$\\psi(x,0) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/4\\sigma^2}e^{ik_0x}$: $\\Delta x = \\sigma$, $\\Delta p = \\hbar/2\\sigma$, also $\\Delta x\\Delta p = \\hbar/2$ (minimal). Frei: $\\Delta x(t) = \\sigma\\sqrt{1 + (\\hbar t/2m\\sigma^2)^2}$, das Maximum läuft mit $\\hbar k_0/m$.', {topic:'frei'});
lexe('dispersion', 'Dispersionsrelation', 'Zusammenhang $\\omega(k)$ zwischen Frequenz und Wellenzahl. Freies nichtrelativistisches Teilchen: $\\omega = \\hbar k^2/2m$ (quadratisch, daher Zerfließen von Wellenpaketen); Licht im Vakuum: $\\omega = ck$ (linear, kein Zerfließen). Phasengeschwindigkeit $\\omega/k$, Gruppengeschwindigkeit $d\\omega/dk$.', {topic:'frei'});
