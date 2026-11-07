/* ===== Thema 9: Wasserstoffatom ===== */
(function(){
const R = String.raw;
/* Skizzen (SKIZZE.md): radiale Aufenthaltsdichten P(r) = r²|R_nl|² mit a0 = 1, aus den normierten Radialfunktionen
   R10 = 2e^{−r}, R20 = (1/√2)(1 − r/2)e^{−r/2}, R21 = (1/√24) r e^{−r/2}, R30 = 2/(81√3)(27 − 18r + 2r²)e^{−r/3}, R31 = 4/(81√6) r(6 − r)e^{−r/3}.
   Numerisch geprüft: ∫P dr = 1. Maxima: 1s bei 1; 2s bei 3 ∓ √5 (Höhen 0,27 : 1); 2p bei 4; 3s bei 0,74 / 4,19 / 13,07 (0,15 : 0,38 : 1); 3p bei 3 und 12 (0,39 : 1).
   maxat in den Abschlüssen und im Labor: Fenster über den ganzen äußeren Buckel (hinter dem letzten Knoten). Geprüft wird „das äußere Maximum ist das höchste“,
   nicht seine genaue Lage (die Hand legt es oft bei n²a0 ab). */
const H_SK = {
  P10:r => 4 * r * r * Math.exp(-2 * r),
  P20:r => r * r * (1 - r / 2) ** 2 * Math.exp(-r) / 2,
  P21:r => r ** 4 * Math.exp(-r) / 24,
  P30:r => r * r * (2 / (81 * Math.sqrt(3)) * (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3)) ** 2,
  P31:r => r * r * (4 / (81 * Math.sqrt(6)) * r * (6 - r) * Math.exp(-r / 3)) ** 2,
  ticks:(step, max) => { const t = []; for (let x = 0; x <= max + 1e-9; x += step) t.push({x, lab:String(x)}); return t; }
};
const HRAD = extra => Object.assign({coords:['r'], space:['r'], radial:true, params:{a_0:'pos', m:'pos'}}, extra || {});
const HDEFS = {'V(r)':'-ħ^2/(m a_0 r)', 'R_10(r)':'2 a_0^(-3/2) e^(-r/a_0)', 'R_20(r)':'1/sqrt(2) a_0^(-3/2) (1 - r/(2a_0)) e^(-r/(2a_0))', 'R_21(r)':'1/sqrt(24) a_0^(-3/2) (r/a_0) e^(-r/(2a_0))', 'E_n':'-ħ^2/(2 m a_0^2 n^2)'};
topic({
  id:'h', math:['m-spezial', 'm-dgl'], title:'Wasserstoffatom', short:'Wasserstoff',
  src:'Griffiths & Schroeter Kap. 4 · Nolting 5/2 · Schwabl Kap. 6',
  goals:[
    'Ich kann radiale Wellenfunktionen mit dem Maß $r^2\\,dr$ normieren und Erwartungswerte wie $\\langle r\\rangle$ und $\\langle 1/r\\rangle$ berechnen.',
    'Ich kann mit der Radialgleichung für $u = rR$ prüfen, ob eine Funktion ein Eigenzustand ist, und die Energie bestimmen.',
    'Ich kenne $E_n = -\\frac{\\hbar^2}{2ma_0^2n^2}$, die Quantenzahlen $n, l, m$ und die Entartung $n^2$.'
  ],
  needs:'Kugelkoordinaten und $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$ · Drehimpuls $L^2Y_l^m = \\hbar^2l(l+1)Y_l^m$ · Integrale $\\int_0^\\infty r^ne^{-kr}dr = n!/k^{n+1}$',
  wozu:'Das Wasserstoffatom ist das einzige Atom, dessen Schrödingergleichung sich exakt lösen lässt (zusammen mit wasserstoffähnlichen Ionen wie He⁺). Seine Energieniveaus erklären die Spektrallinien des Wasserstoffs, etwa die rote $H_\\alpha$-Linie bei $656\\,\\mathrm{nm}$, mit der Astronomen leuchtende Gaswolken kartieren. Die Quantenzahlen $n, l, m$ und die Orbitale s, p, d sind die Grundlage für das Periodensystem und die Chemie.',
  bridge:'Aus Thema 8 kommen $\\hat L^2$, die Kugelflächenfunktionen $Y_l^m$ und der Eigenwert $\\hbar^2l(l+1)$. Die Radialgleichung ist ein eindimensionales Problem wie in Thema 3 und 5, und die Quantisierung durch den Abbruch einer Potenzreihe kennst du vom Oszillator (Thema 7). Mathematisch brauchst du Kugelkoordinaten und den Laplace-Operator (M8).',
  diag:[
    {q:'Wie beginnst du, um $\\langle r\\rangle$ im Zustand mit der Radialfunktion $R_{21}$ zu berechnen?', opts:['$\\int_0^\\infty r\\,|R_{21}|^2\\,r^2\\,dr$ aufstellen', '$\\int_0^\\infty r\\,|R_{21}|^2\\,dr$ aufstellen', '$\\langle r\\rangle = n^2a_0$ aus dem Bohrschen Modell nehmen'], a:0,
      ex:'Das Maß in Kugelkoordinaten enthält $r^2$; der Winkelteil ist mit $\\int|Y|^2d\\Omega = 1$ erledigt. Der Bohrsche Radius $n^2a_0$ ist der wahrscheinlichste Abstand für $l = n-1$, nicht der Mittelwert ($\\langle r\\rangle = 5a_0$ für $2p$).'},
    {q:'Wie beginnst du, um zu prüfen, ob $u(r) = r^2e^{-r/(2a_0)}$ zu einem Eigenzustand mit $l = 1$ gehört?', opts:['In die Radialgleichung mit dem Glied $\\frac{\\hbar^2l(l+1)}{2mr^2}$ einsetzen', 'In die Radialgleichung ohne Zentrifugalglied einsetzen', 'Prüfen, ob $u$ auf $\\int_0^\\infty|u|^2dr = 1$ normiert ist'], a:0,
      ex:'Ob eine Funktion Eigenzustand ist, zeigt nur die Eigenwertgleichung, und für $l = 1$ gehört das Zentrifugalglied $\\hbar^2/(mr^2)$ dazu. Die Normierung ändert daran nichts.'}
  ],
  phenomenon:{
    title:'Vier Linien und eine Grenze',
    text:'Schickt man Strom durch Wasserstoffgas, leuchtet es rötlich. Ein Gitter zerlegt das Licht in einzelne scharfe Linien. Im Sichtbaren sieht man vier: bei $656$, $486$, $434$ und $410\\,\\mathrm{nm}$. Ein Spektrometer, das auch ins nahe Ultraviolett reicht, findet weitere Linien derselben Serie.',
    q:{q:'Wie liegen die weiteren Linien?', opts:['in gleichen Energieabständen, ohne Ende', 'immer dichter, bis zu einer Grenze bei etwa $365\\,\\mathrm{nm}$', 'Es gibt keine weiteren; vier Linien gehören zu vier Niveaus.'], a:1,
      ex:'Sie rücken immer dichter zusammen und häufen sich an einer Seriengrenze.',
      fb:['Gleiche Abstände der Photonenenergien gäbe es bei gleich weit entfernten Niveaus, wie beim Oszillator (Thema 7). Hier liegen die Niveaus wie $-1/n^2$ – nach oben immer dichter. Deshalb rücken auch die Linien zusammen.',
        'Richtig. Die Linien gehören zu Übergängen $n \\to 2$ mit $n = 3, 4, 5, \\dots$ Für $n\\to\\infty$ rücken die Niveaus zusammen; die Linien häufen sich bei der Seriengrenze nahe $365\\,\\mathrm{nm}$.',
        'Eine Linie gehört nicht zu einem Niveau, sondern zu einem **Paar** von Niveaus. Und es gibt unendlich viele gebundene Niveaus.']},
    reveal:'Die Wellenlängen folgen der Balmer-Formel\n\n$$\\frac1\\lambda = R_H\\left(\\frac14 - \\frac1{n^2}\\right),\\qquad n = 3, 4, 5, \\dots$$\n\nmit der Rydberg-Konstanten $R_H \\approx 1{,}097\\cdot10^7\\,\\mathrm m^{-1}$. Für $n \\to \\infty$ folgt $\\lambda \\to 4/R_H \\approx 365\\,\\mathrm{nm}$. Die Formel war 1885 empirisch bekannt. In diesem Thema leitest du sie aus der Schrödingergleichung her: $E_n = -13{,}6\\,\\mathrm{eV}/n^2$, und jede Linie ist die Energiedifferenz zweier Niveaus.'
  },
  teach:[
    /* ===== Abschnitt 1: Modell, Symmetrie, Einheiten ===== */
    {id:'h-t1', title:'Ein Elektron im Coulombfeld', steps:[
      {id:'h-t1a', title:'Zwei Teilchen, ein Abstand',
        num:{title:R`Wie viel leichter ist $\mu$?`, text:R`Mit $m_p = 1836{,}15\,m_e$ ist

$$\mu = \frac{m_em_p}{m_e + m_p} = \frac{m_e}{1 + m_e/m_p} = \frac{m_e}{1 + 1/1836{,}15} \approx 0{,}99946\,m_e.$$

Die reduzierte Masse ist nur um $0{,}054\,\%$ kleiner als die Elektronenmasse.`},
        text:R`Das Wasserstoffatom besteht aus einem Proton und einem Elektron. Sie ziehen sich mit dem Coulombpotential an:

$$V(r) = -\frac{e^2}{4\pi\varepsilon_0\,r}.$$

Hier ist $r$ der Abstand der beiden Teilchen. Wie in der klassischen Mechanik trennst du die Bewegung des Schwerpunkts ab. Übrig bleibt ein einziges Teilchen mit der reduzierten Masse $\mu$ im festen Potential $V(r)$. Weil das Proton so viel schwerer ist, liegt $\mu$ fast bei $m_e$. Im Folgenden steht $m$ für diese Masse.`,
        q:{q:R`Im Positronium kreisen ein Elektron und ein Positron gleicher Masse $m_e$ umeinander. Wie groß ist die reduzierte Masse?`,
          opts:[R`$m_e$, wie beim Wasserstoff`, R`$m_e/2$`, R`$2m_e$, die Summe beider Massen`], a:1,
          ex:R`$\mu = m_e\cdot m_e/(2m_e) = m_e/2$. Deshalb liegen alle Niveaus des Positroniums nur halb so tief wie beim Wasserstoff.`,
          fb:[R`$\mu \approx m_e$ gilt nur, wenn der Partner viel schwerer ist. Hier sind beide gleich schwer.`, '',
            R`Die reduzierte Masse ist immer kleiner als die kleinere der beiden Massen. $2m_e$ ist die Gesamtmasse des Schwerpunkts.`]}},
      {id:'h-t1b', title:'Kugelsymmetrie: drei Quantenzahlen',
        pre:{from:'dreh', seg:'dreh-t2', title:'Gemeinsame Eigenzustände', text:R`$\hat L^2$ und $\hat L_z$ vertauschen und haben die gemeinsamen Eigenzustände $|l,m\rangle$ mit $\hat L^2|l,m\rangle = \hbar^2l(l+1)|l,m\rangle$ und $\hat L_z|l,m\rangle = \hbar m|l,m\rangle$. Mini-Beispiel: $|1,0\rangle$ hat $L^2 = 2\hbar^2$ und $L_z = 0$.`},
        num:{title:'Gleicher Abstand, gleiches Potential', text:R`Die Punkte $(a_0, 0, 0)$, $(0, a_0, 0)$ und $(0, 0, -a_0)$ haben alle den Abstand $r = a_0$ vom Kern und deshalb dasselbe Potential $V(a_0)$. Eine Drehung um den Kern bringt jeden von ihnen in jeden anderen. $V$ ändert sich dabei nicht, also auch der Hamilton-Operator nicht.`},
        text:R`Die zeitunabhängige [[lex:schroedinger|Schrödingergleichung]] ist jetzt dreidimensional:

$$-\frac{\hbar^2}{2m}\nabla^2\psi + V(r)\,\psi = E\,\psi.$$

Das Potential hängt nur vom Abstand ab, nicht von der Richtung. So ein [[lex:h-zentralpotential|Zentralpotential]] ist kugelsymmetrisch. Daraus folgt: $\hat H$ vertauscht mit allen Komponenten des Drehimpulses und mit $\hat L^2$. Du kannst also Energie, $L^2$ und $L_z$ gleichzeitig scharf wählen (Thema 8). Die Eigenzustände tragen deshalb drei Quantenzahlen $n, l, m$.`,
        q:{q:R`Warum kann man $\hat H$, $\hat L^2$ und $\hat L_z$ gleichzeitig scharf wählen?`,
          opts:['Weil das Elektron auf einer festen Kreisbahn mit Radius $a_0$ läuft.', 'Weil $\\hat H$, $\\hat L^2$ und $\\hat L_z$ dieselben Eigenwerte haben.', 'Weil $V$ nur von $r$ abhängt, also kugelsymmetrisch ist.'], a:2,
          ex:R`Ein kugelsymmetrisches $\hat H$ vertauscht mit allen Drehungen, also mit $\hat L^2$ und $\hat L_z$. Diese vertauschen untereinander (Thema 8).`,
          fb:[R`Eine feste Bahn gibt es in der Quantenmechanik nicht. Der Grund ist die Symmetrie des Potentials.`,
            R`Die Eigenwerte sind ganz verschieden: Energien in eV, $L^2$ in $\hbar^2$. Gemeinsam haben sie die Eigenzustände.`, '']}},
      {id:'h-t1c', title:'Der Bohrsche Radius und die Energieskala',
        num:{title:'Zahlen eingesetzt', text:R`Mit den Naturkonstanten ist

$$a_0 = \frac{4\pi\varepsilon_0\hbar^2}{me^2} \approx 0{,}529\cdot10^{-10}\,\mathrm m,\qquad \frac{\hbar^2}{2ma_0^2} \approx 13{,}6\,\mathrm{eV}.$$

Dann ist $V(a_0) = -\hbar^2/(ma_0^2) \approx -27{,}2\,\mathrm{eV}$ und $V(2a_0) \approx -13{,}6\,\mathrm{eV}$.`},
        text:R`Aus $\hbar$, $m$ und $e^2/(4\pi\varepsilon_0)$ lässt sich genau eine Länge bilden, der [[lex:bohrradius|Bohrsche Radius]] $a_0$. Damit ist $e^2/(4\pi\varepsilon_0) = \hbar^2/(ma_0)$, und das Potential lautet

$$V(r) = -\frac{\hbar^2}{m a_0\,r}.$$

So schreibt das Tutorial das Potential. Die zugehörige Energieskala ist $\frac{\hbar^2}{2ma_0^2} \approx 13{,}6\,\mathrm{eV}$. Das ist, wie sich zeigen wird, die Ionisierungsenergie aus dem Grundzustand. Längen misst du ab jetzt in $a_0$, Energien in Vielfachen von $13{,}6\,\mathrm{eV}$.`,
        q:{q:R`Welche Länge entsteht aus $\hbar$, $m$ und $e^2/(4\pi\varepsilon_0)$?`,
          opts:[R`$\frac{4\pi\varepsilon_0\hbar}{me^2}$`, R`$\frac{4\pi\varepsilon_0\hbar^2}{me^2}$`, R`$\frac{me^2}{4\pi\varepsilon_0\hbar^2}$`], a:1,
          ex:R`$e^2/(4\pi\varepsilon_0)$ hat die Einheit Energie mal Länge, $\hbar^2/m$ die Einheit Energie mal Länge². Der Quotient ist eine Länge: $a_0$.`,
          fb:[R`Mit $\hbar$ statt $\hbar^2$ stimmt die Einheit nicht: $\mathrm{J\,s}$ geteilt durch $\mathrm{kg}\cdot\mathrm{J\,m}$ gibt $\mathrm{s/(kg\,m)}$, keine Länge.`, '',
            R`Das ist der Kehrwert $1/a_0$, eine inverse Länge.`]}},
      {id:'h-t1d', title:'Typischer Fehler: Bohrs Kreisbahnen',
        num:{title:'Der Drehimpuls im Grundzustand', text:R`Bohr: Auf der innersten Kreisbahn ist $L = 1\cdot\hbar$. Quantenmechanik: Der Grundzustand hat $l = 0$, also

$$|\vec L| = \hbar\sqrt{0\cdot1} = 0.$$

Die Energie ist in beiden Bildern dieselbe, $-13{,}6\,\mathrm{eV}$.`},
        text:R`Bohr ließ 1913 das Elektron auf Kreisbahnen mit dem Drehimpuls $L = n\hbar$ laufen und erhielt die richtigen Energien. Die Quantenmechanik bestätigt die Energien, aber nicht das Bild. Es gibt keine Bahnen, und im Grundzustand ist der Bahndrehimpuls nicht $\hbar$, sondern null. Wer sich das Atom als kleines Planetensystem vorstellt, sagt deshalb falsche Drehimpulse voraus. Außerdem erklärt erst die Quantenmechanik, warum zu einem $n$ mehrere Zustände gehören und wie sich das Elektron um den Kern verteilt.`,
        q:{q:R`Was stimmt im Bohrschen Modell für den Grundzustand mit der Quantenmechanik überein?`,
          opts:[R`die Energie $-13{,}6\,\mathrm{eV}$`, R`der Drehimpuls $L = \hbar$`, R`die feste Kreisbahn mit dem Radius $a_0$`], a:0,
          ex:R`Nur die Energie stimmt. Der Drehimpuls ist in Wirklichkeit null, und eine Bahn gibt es nicht.`,
          fb:['', R`Der Grundzustand hat $l = 0$ und damit $|\vec L| = 0$, nicht $\hbar$.`,
            R`Es gibt keine Bahn. $a_0$ ist im Grundzustand der wahrscheinlichste Abstand, kein fester Radius.`]}}
    ]},

    /* ===== Abschnitt 2: Separation, Radialgleichung, Normierung ===== */
    {id:'h-t2', title:'Separation in Kugelkoordinaten', steps:[
      {id:'h-t2a', title:'Der Laplace-Operator: radial und Winkel',
        pre:{from:'m-spezial', seg:'ms-t3', title:'Laplace-Operator für radiale Funktionen', text:R`Für eine Funktion $f(r)$ des Abstands allein ist $\nabla^2f = f'' + \frac2r\,f'$. Der Term $\frac2rf'$ kommt daher, dass die Kugelflächen nach außen wachsen. Mini-Beispiel: Für $f = r^2$ ist $\nabla^2f = 2 + \frac2r\cdot2r = 6$.`},
        num:{title:R`$\nabla^2$ an $e^{-r/a_0}$`, text:R`Mit $f' = -f/a_0$ und $f'' = f/a_0^2$ ist

$$\nabla^2e^{-r/a_0} = \left(\frac{1}{a_0^2} - \frac{2}{a_0r}\right)e^{-r/a_0}.$$

Der zweite Term, $-\frac{2}{a_0r}$, kommt in einer Dimension nicht vor.`},
        text:R`In [[lex:kugelkoordinaten|Kugelkoordinaten]] zerfällt der [[lex:laplace-operator|Laplace-Operator]] in einen radialen Teil und einen Winkelteil. Der Winkelteil ist genau $-\hat L^2/(\hbar^2r^2)$ aus Thema 8:

$$\nabla^2 = \frac{1}{r^2}\frac{\partial}{\partial r}\left(r^2\frac{\partial}{\partial r}\right) - \frac{\hat L^2}{\hbar^2r^2}.$$

In der Schrödingergleichung wird aus $-\frac{\hbar^2}{2m}\nabla^2$ deshalb die radiale kinetische Energie plus $\hat L^2/(2mr^2)$. Dieser Term ist die Rotationsenergie, wie klassisch $L^2/(2mr^2)$ für einen Massenpunkt im Abstand $r$. Der radiale Teil wirkt nur auf $r$, der Winkelteil nur auf $\theta$ und $\varphi$. Diese Trennung nutzt der nächste Schritt aus.`,
        q:{q:R`Wie groß ist der Term $\hat L^2/(2mr^2)$ für einen Zustand mit $l = 1$?`,
          opts:[R`$\hbar^2/(mr^2)$`, R`$\hbar^2/(2mr^2)$`, R`$2\hbar^2/(mr^2)$`], a:0,
          ex:R`$\hat L^2$ gibt $\hbar^2\cdot1\cdot2 = 2\hbar^2$, geteilt durch $2mr^2$ bleibt $\hbar^2/(mr^2)$.`,
          fb:['', R`Das wäre $\hat L^2 = \hbar^2$. Der Eigenwert ist aber $\hbar^2l(l+1) = 2\hbar^2$.`,
            R`Der Faktor $\tfrac12$ aus $2mr^2$ fehlt.`]}},
      {id:'h-t2b', title:R`Separationsansatz: $\psi = R(r)\,Y_l^m(\theta,\varphi)$`,
        pre:{from:'m-dgl', seg:'md-t5', title:'Separationsansatz', text:R`Hängt eine Gleichung von zwei Gruppen von Variablen getrennt ab, setzt man ein Produkt an. Jeder Faktor erfüllt dann eine eigene gewöhnliche Gleichung, verbunden über eine gemeinsame Konstante. Mini-Beispiel: $\Psi(x, t) = \varphi(x)\,e^{-iEt/\hbar}$ mit der Konstanten $E$.`},
        num:{title:R`Der Winkelteil wird zur Zahl`, text:R`Für $\psi = R(r)\,Y_1^0(\theta,\varphi)$ ist

$$\frac{\hat L^2}{2mr^2}\,\psi = \frac{2\hbar^2}{2mr^2}\,R\,Y_1^0 = \frac{\hbar^2}{mr^2}\,\psi.$$

Aus dem Operator $\hat L^2$ ist die Zahl $2\hbar^2$ geworden, und $Y_1^0$ steht in jedem Term als Faktor.`},
        text:R`Weil $\hat L^2$ nur auf die Winkel wirkt, versuchst du ([[lex:separation|Separation]])

$$\psi(r,\theta,\varphi) = R(r)\,Y_l^m(\theta,\varphi).$$

Mit $\hat L^2Y_l^m = \hbar^2l(l+1)Y_l^m$ steht $Y_l^m$ in jedem Term und fällt heraus. Übrig bleibt eine gewöhnliche Differentialgleichung für $R(r)$:

$$-\frac{\hbar^2}{2m}\frac{1}{r^2}\frac{d}{dr}\left(r^2\frac{dR}{dr}\right) + \left[V(r) + \frac{\hbar^2l(l+1)}{2mr^2}\right]R = ER.$$

Der Winkelteil ist für **jedes** Zentralpotential derselbe; nur diese Gleichung hängt von $V$ ab. Die Quantenzahl $m$ kommt in ihr nicht vor. Deshalb ist in jedem Zentralpotential jedes Niveau mit Drehimpuls $l$ mindestens $(2l+1)$-fach entartet.`,
        q:{q:R`Warum kommt $m$ in der Gleichung für $R$ nicht vor?`,
          opts:['Weil $m$ bei gebundenen Zuständen immer null ist.', 'Weil sie nur $\\hat L^2$ enthält, dessen Eigenwert nur von $l$ abhängt.', 'Weil $\\hat L_z$ nicht mit $\\hat H$ vertauscht und herausfällt.'], a:1,
          ex:R`Der Winkelteil von $\nabla^2$ ist $\hat L^2$. $\hat L_z$ kommt im Hamilton-Operator gar nicht vor, obwohl es mit ihm vertauscht.`,
          fb:[R`Auch gebundene Zustände haben $m = -l, \dots, l$; zum Beispiel gibt es drei $2p$-Zustände.`, '',
            R`$\hat L_z$ vertauscht sehr wohl mit $\hat H$. Es kommt im Hamilton-Operator nur nicht vor.`]}},
      {id:'h-t2c', title:R`Die Substitution $u = rR$`,
        num:{title:'Der Grundzustand', text:R`Aus $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$ wird

$$u_{10}(r) = r\,R_{10}(r) = 2a_0^{-3/2}\,r\,e^{-r/a_0}.$$

Am Kern ist $u_{10}(0) = 0$, obwohl $R_{10}(0) = 2a_0^{-3/2}$ nicht null ist.`},
        text:R`Der Ausdruck $\frac{1}{r^2}(r^2R')'$ ist unhandlich. Mit $u(r) = r\,R(r)$ wird er zu $u''/r$; die Herleitung zeigt das. Nach Multiplikation mit $r$ entsteht die [[lex:radialgleichung|Radialgleichung]]

$$-\frac{\hbar^2}{2m}u'' + V_{\text{eff}}(r)\,u = E\,u,\qquad V_{\text{eff}} = V(r) + \frac{\hbar^2l(l+1)}{2mr^2}.$$

Sie sieht aus wie eine eindimensionale Schrödingergleichung auf der Halbachse $r > 0$, mit dem effektiven Potential $V_{\text{eff}}$. Alles, was du in Thema 3 und 5 über Krümmung und Abklingen gelernt hast, gilt für $u$.`,
        derive:{ctx:HRAD({abstract:{u:{args:['r']}}, defs:{'R(r)':'u(r)/r'}}), lines:[
          {l:"d/dr R(r) = u'(r)/r - u(r)/r^2", w:'Quotientenregel',
            why:{q:'Welche Regel wurde benutzt?', opts:['Quotientenregel (oder Produktregel mit $1/r$)', 'Kettenregel mit innerer Funktion $r^2$', 'partielle Integration ohne Randterm'], a:0, ex:'$\\frac{d}{dr}\\frac{u}{r} = \\frac{u\'}{r} - \\frac{u}{r^2}$.'}},
          {l:"r^2 d/dr R(r) = r u'(r) - u(r)", w:'mit r² multipliziert'},
          {l:"d/dr (r^2 d/dr R(r)) = r u''(r)", w:'noch einmal abgeleitet',
            why:{q:'Wohin sind die Terme mit $u\'$ verschwunden?', opts:['Sie heben sich weg, weil $(ru\')\' = u\' + ru\'\'$ ist.', 'Sie sind null, weil $u(0) = 0$ ist.', 'Sie wurden vernachlässigt, weil $r$ groß ist.'], a:0, ex:'Produktregel für $ru\'$ gibt $u\' + ru\'\'$, die Ableitung von $-u$ gibt $-u\'$.'}},
          {l:"1/r^2 d/dr (r^2 d/dr R(r)) = u''(r)/r", w:'durch r² geteilt',
            why:{q:'Was gewinnt man damit?', opts:['Mit $r$ multipliziert, sieht sie aus wie in 1D.', 'Man spart sich das Maß $r^2dr$ in allen Erwartungswerten.', 'Das Zentrifugalglied fällt dabei vollständig weg.'], a:0, ex:'Jeder Term der Gleichung für $R$ enthält dann den Faktor $1/r$; multipliziert man mit $r$, steht $u$ allein da. Das Zentrifugalglied bleibt.'}}
        ]},
        q:{q:R`Wie lautet $V_{\text{eff}}$ für einen Zustand mit $l = 2$?`,
          opts:[R`$V(r) + \frac{3\hbar^2}{mr^2}$`, R`$V(r) + \frac{\hbar^2}{mr^2}$`, R`$V(r) + \frac{6\hbar^2}{mr^2}$`], a:0,
          ex:R`$\frac{\hbar^2l(l+1)}{2mr^2} = \frac{6\hbar^2}{2mr^2} = \frac{3\hbar^2}{mr^2}$.`,
          fb:['', R`Das ist das Zentrifugalglied für $l = 1$. Für $l = 2$ ist $l(l+1) = 6$.`,
            R`Der Faktor $\tfrac12$ aus $2mr^2$ fehlt.`]}},
      {id:'h-t2d', title:R`Normierung mit dem Maß $r^2dr$`,
        pre:{from:'m-spezial', seg:'ms-t2', title:'Kugelschalen', text:R`Eine Kugelschale mit Radius $r$ und Dicke $dr$ hat das Volumen $4\pi r^2\,dr$. Für eine Funktion des Abstands allein ist deshalb $\int f\,d^3r = 4\pi\int_0^\infty f(r)\,r^2\,dr$. Mini-Beispiel: Eine Kugel mit Radius $1$ hat das Volumen $4\pi\int_0^1r^2\,dr = \tfrac{4\pi}{3}$.`},
        num:{title:R`$R_{10}$ normiert?`, text:R`Mit $\int_0^\infty r^2e^{-2r/a_0}dr = 2!\,(a_0/2)^3 = a_0^3/4$ ist

$$\int_0^\infty|R_{10}|^2\,r^2\,dr = \frac{4}{a_0^3}\cdot\frac{a_0^3}{4} = 1.$$

Der Winkelteil liefert separat $\int|Y_0^0|^2d\Omega = 1$.`},
        text:R`Auch die Normierung zerfällt in einen radialen Teil und einen Winkelteil. Mit $d^3r = r^2\,dr\,d\Omega$ ist

$$\int|\psi|^2d^3r = \int_0^\infty|R|^2r^2\,dr\cdot\int|Y_l^m|^2\,d\Omega = \int_0^\infty|u|^2\,dr = 1.$$

Die Kugelflächenfunktionen sind schon auf der Kugel normiert. Für $R$ bleibt die Bedingung $\int_0^\infty|R|^2r^2\,dr = 1$. Das Maß $r^2dr$ ist kein Zusatz, sondern das Volumen der Kugelschale. Wer es vergisst, normiert falsch. Für $u$ sieht die Normierung wieder eindimensional aus.`,
        derive:{ctx:HRAD({defs:HDEFS}), lines:[
          {l:'∫_0^∞ |R_10(r)|^2 r^2 dr = ∫_0^∞ 4/a_0^3 r^2 e^(-2r/a_0) dr', w:R`$|R_{10}|^2$ eingesetzt`},
          {l:'= 1', w:'Fakultätsintegral',
            why:{q:'Welche Formel steckt hier?', opts:['$\\int_0^\\infty r^ke^{-\\alpha r}dr = k!/\\alpha^{k+1}$ mit $k = 2$, $\\alpha = 2/a_0$', '$\\int_0^\\infty e^{-\\alpha r}dr = 1/\\alpha$ ohne den Faktor $r^2$', '$\\int_0^\\infty r^2e^{-\\alpha r}dr = \\alpha^3/2$'], a:0, ex:'$2!/(2/a_0)^3 = a_0^3/4$, mal $4/a_0^3$ gibt $1$.'}}
        ]},
        q:{q:R`Wie lautet die Normierung, ausgedrückt durch $u = rR$?`,
          opts:[R`$\int_0^\infty|u|^2r^2\,dr = 1$`, R`$4\pi\int_0^\infty|u|^2\,dr = 1$`, R`$\int_0^\infty|u|^2\,dr = 1$`], a:2,
          ex:R`$|R|^2r^2 = |u|^2$. Der Faktor $4\pi$ steckt schon in $\int|Y|^2d\Omega = 1$.`,
          fb:[R`$r^2$ ist in $u = rR$ schon enthalten. Mit einem weiteren $r^2$ zählst du das Maß doppelt.`,
            R`$4\pi$ kommt nur bei kugelsymmetrischem $\psi$ ohne $Y$ vor. Hier ist der Winkelteil mit $\int|Y|^2d\Omega = 1$ erledigt.`, '']}},
      {id:'h-t2e', title:'Der Grundzustand: vom Ket zur radialen Dichte',
        num:{title:R`$\psi_{100}$ am Kern`, text:R`Mit $Y_0^0 = 1/\sqrt{4\pi}$ ist

$$\psi_{100}(0) = R_{10}(0)\,Y_0^0 = \frac{2}{a_0^{3/2}}\cdot\frac{1}{\sqrt{4\pi}} = \frac{1}{\sqrt{\pi a_0^3}}.$$

Die Dichte am Kern ist $|\psi_{100}(0)|^2 = 1/(\pi a_0^3) \approx 0{,}318/a_0^3$.`},
        text:R`Ein Eigenzustand trägt drei Quantenzahlen, als Ket $|n,l,m\rangle$, gelesen „Ket n, l, m“. In der Ortsdarstellung ist er das Produkt $\psi_{nlm} = R_{nl}(r)\,Y_l^m(\theta,\varphi)$. Für die Rechnung mit der Radialgleichung nimmst du $u = rR$. Für ein Bild nimmst du die radiale Dichte $P(r) = r^2|R|^2 = |u|^2$. Sie sagt, wie wahrscheinlich ein Abstand ist. Die Tafel geht diesen Weg für den Grundzustand, vom Satz bis zum Labor.`,
        reps:{obj:R`Der Grundzustand $1s$`,
          rows:[
            {k:'worte', text:R`Der tiefste Zustand: kein Drehimpuls, kugelsymmetrisch, Energie $-13{,}6\,\mathrm{eV}$.`},
            {k:'dirac', tex:R`|1,0,0\rangle:\qquad \hat H|1,0,0\rangle = E_1|1,0,0\rangle,\quad \hat L^2|1,0,0\rangle = 0`},
            {k:'ort', tex:R`\psi_{100}(r,\theta,\varphi) = R_{10}(r)\,Y_0^0 = \frac{1}{\sqrt{\pi a_0^3}}\,e^{-r/a_0}`},
            {k:'formel', tex:R`u_{10} = r\,R_{10} = \frac{2r}{a_0^{3/2}}\,e^{-r/a_0},\qquad -\frac{\hbar^2}{2m}u_{10}'' + V\,u_{10} = E_1\,u_{10}`},
            {k:'graph', plot:{x:[0, 8], y:[0, 0.6], xlab:'r/a_0', ylab:R`r^2|R_{10}|^2\,a_0`, ticks:H_SK.ticks(1, 8)}, f:H_SK.P10,
              cap:R`$P(r) = r^2|R_{10}|^2 = \tfrac{4r^2}{a_0^3}e^{-2r/a_0}$: null am Kern, Maximum $4e^{-2} \approx 0{,}54$ bei $r = a_0$, langer Ausläufer nach außen.`},
            {k:'labor', text:R`Regler $n = 1$, $l = 0$: eine Kurve ohne Knoten mit dem Maximum bei $1\,a_0$; die rote Linie $\langle r\rangle$ steht bei $1{,}5\,a_0$.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Tiefster Zustand“ heißt $n = 1$, „kein Drehimpuls“ heißt $l = 0$ und damit $m = 0$.`},
            {from:'dirac', to:'ort', rule:R`Den Ket als Produkt schreiben: $\psi_{nlm} = R_{nl}(r)\,Y_l^m(\theta,\varphi)$; für $l = 0$ ist $Y_0^0 = 1/\sqrt{4\pi}$ eine Konstante.`},
            {from:'ort', to:'formel', rule:R`Den Winkelteil abtrennen und $R$ mit $r$ multiplizieren: $u = rR$. Diese Funktion erfüllt die Radialgleichung.`},
            {from:'formel', to:'graph', rule:R`$|u|^2 = r^2|R|^2 = P(r)$ über $r$ auftragen; die Fläche darunter ist $1$.`},
            {from:'graph', to:'labor', rule:R`Das Labor zeichnet genau $P(r)$, mit $r$ in Einheiten von $a_0$, und markiert $\langle r\rangle$ als rote Linie.`}
          ]},
        q:{q:R`Welche Wellenfunktion gehört zum Ket $|2,1,0\rangle$?`, tr:{from:'dirac', to:'ort'},
          opts:[R`$R_{21}(r)\,Y_0^0$`, R`$R_{21}(r)\,Y_1^0(\theta,\varphi)$`, R`$R_{10}(r)\,Y_1^0(\theta,\varphi)$`], a:1,
          ex:R`$n = 2$ und $l = 1$ wählen die Radialfunktion $R_{21}$, $l = 1$ und $m = 0$ die Kugelflächenfunktion $Y_1^0$.`,
          fb:[R`Die Kugelflächenfunktion braucht dasselbe $l$ wie die Radialfunktion: $l = 1$, also $Y_1^m$.`, '',
            R`Die Radialfunktion trägt die Indizes $n$ und $l$: zu $|2,1,0\rangle$ gehört $R_{21}$.`]}},
      {id:'h-t2f', title:R`Typischer Fehler: $R$ und $\psi$ verwechseln`,
        num:{title:'Faktor am Kern', text:R`$R_{10}(0) = 2a_0^{-3/2}$, aber $\psi_{100}(0) = 1/\sqrt{\pi a_0^3}$. Das Verhältnis ist

$$\frac{R_{10}(0)}{\psi_{100}(0)} = 2\sqrt\pi = \sqrt{4\pi} \approx 3{,}54.$$

Wer $R_{10}$ als Wellenfunktion nimmt, bekommt $\int|R_{10}|^2d^3r = 4\pi$ statt $1$.`},
        text:R`Ein häufiger Fehler ist, die Radialfunktion $R$ und die Wellenfunktion $\psi$ zu verwechseln. $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$ ist auf $\int_0^\infty|R|^2r^2dr = 1$ normiert. Die Wellenfunktion $\psi_{100} = R_{10}Y_0^0$ ist auf $\int|\psi|^2d^3r = 1$ normiert. Beide unterscheiden sich um den Faktor $1/\sqrt{4\pi}$. Für Dichten am Ort, etwa $|\psi(0)|^2$, brauchst du $\psi$. Für Abstände und radiale Erwartungswerte genügt $R$ mit dem Maß $r^2dr$.`,
        q:{q:R`Was ergibt $\int|R_{10}|^2\,d^3r$ über den ganzen Raum?`,
          opts:[R`$1$, denn $R_{10}$ ist normiert`, R`$\tfrac{1}{4\pi}$`, R`$4\pi$`], a:2,
          ex:R`$\int|R_{10}|^2d^3r = \int_0^\infty|R_{10}|^2r^2dr\cdot\int d\Omega = 1\cdot4\pi$. Erst mit $Y_0^0 = 1/\sqrt{4\pi}$ wird daraus $1$.`,
          fb:[R`$R_{10}$ ist radial normiert, mit $r^2dr$. Über den Raum kommt noch $\int d\Omega = 4\pi$ dazu.`,
            R`$\tfrac{1}{4\pi}$ ist $|Y_0^0|^2$. Das Raumintegral über $|R_{10}|^2$ ist um diesen Faktor zu groß, nicht zu klein.`, '']}}
    ]},

    /* ===== Abschnitt 3: Verhalten am Rand ===== */
    {id:'h-t3', title:'Die Radialgleichung: Verhalten am Rand', steps:[
      {id:'h-t3a', title:'Das effektive Potential',
        num:{title:R`$l = 1$ in natürlichen Einheiten`, text:R`Mit $\rho = r/a_0$ und Energien in $13{,}6\,\mathrm{eV}$ ist $V_{\text{eff}} = -\frac{2}{\rho} + \frac{l(l+1)}{\rho^2}$. Für $l = 1$:

$$V_{\text{eff}} = -\frac{2}{\rho} + \frac{2}{\rho^2},\qquad V_{\text{eff}}(1) = 0,\qquad V_{\text{eff}}(2) = -\tfrac12.$$

Das Minimum liegt bei $r = 2a_0$ mit $-6{,}8\,\mathrm{eV}$.`},
        text:R`Bevor du die Radialgleichung löst, lohnt ein Blick auf $V_{\text{eff}}$. Für $l > 0$ ist es die Summe aus dem anziehenden Coulombterm und der abstoßenden Zentrifugalbarriere $\hbar^2l(l+1)/(2mr^2)$. Nahe $r = 0$ gewinnt die Barriere, denn $1/r^2$ wächst schneller als $1/r$. Sie hält Elektronen mit Drehimpuls vom Kern fern. Nur für $l = 0$ fehlt sie; dann bleibt das reine Coulombpotential. Der Graph zeigt beide Fälle.`,
        plot:{x:[0.25, 8], y:[-4, 3], abs:true, yticks:[{y:-3, lab:'-3'}, {y:-2, lab:'-2'}, {y:-1, lab:'-1'}, {y:1, lab:'1'}, {y:2, lab:'2'}], xlab:'r/a_0', ylab:R`V_{\text{eff}}/(13{,}6\,\text{eV})`, ticks:H_SK.ticks(1, 8), f:r => -2 / r + 2 / (r * r), lab:'l = 1', f2:r => -2 / r, lab2:'l = 0',
          cap:R`Effektives Potential in Einheiten von $13{,}6\,\mathrm{eV}$ über $r/a_0$. Durchgezogen $l = 1$: Barriere am Kern, Minimum $-\tfrac12$ bei $2a_0$. Gestrichelt $l = 0$: reines Coulombpotential $-2a_0/r$.`},
        q:{q:R`Im Graphen steigt die Kurve für $l = 1$ nahe $r = 0$ steil an, die für $l = 0$ fällt. Woran liegt das?`, tr:{from:'graph', to:'formel'},
          opts:[R`Das Coulombpotential wird nahe am Kern abstoßend.`, R`$+2/\rho^2$ wächst für kleine $\rho$ schneller als $-2/\rho$ fällt.`, R`Für $l = 1$ ist die Energie positiv.`], a:1,
          ex:R`Für $\rho \to 0$ überwiegt der Term mit der höheren Potenz von $1/\rho$. Bei $l = 0$ fehlt er, und $-2/\rho$ fällt ungebremst.`,
          fb:[R`Das Coulombpotential ist überall anziehend. Der Anstieg kommt vom Zentrifugalglied.`, '',
            R`Gezeichnet ist das Potential, keine Energie eines Zustands. Gebundene Zustände haben auch für $l = 1$ negative Energie.`]}},
      {id:'h-t3b', title:R`Kleine Abstände: $u \propto r^{l+1}$`,
        pre:{from:'sg', seg:'sg-t4', title:'Zulässige Lösungen', text:R`Eine Lösung der Schrödingergleichung ist nur zulässig, wenn sie normierbar ist und die Gleichung überall erfüllt, auch an besonderen Punkten. Mini-Beispiel: $e^{+\kappa x}$ für $x\to\infty$ ist nicht normierbar und fällt deshalb weg.`},
        num:{title:R`$l = 1$`, text:R`Ansatz $u \propto r^s$ nahe $r = 0$: Aus $s(s-1) = l(l+1) = 2$ folgt

$$s = 2\quad\text{oder}\quad s = -1.$$

$u \propto r^{-1}$ gibt $\int_0|u|^2dr = \int_0 r^{-2}dr = \infty$. Es bleibt $u \propto r^2$, also $R = u/r \propto r$.`},
        text:R`Nahe $r = 0$ dominieren $u''$ und das Zentrifugalglied; Coulomb- und Energieterm sind dort kleiner. Der Ansatz $u \propto r^s$ ergibt $s(s-1) = l(l+1)$, also $s = l + 1$ oder $s = -l$. Die zweite Lösung ist unbrauchbar. Für $l \ge 1$ ist sie nicht normierbar. Für $l = 0$ wäre $R \propto 1/r$; das löst die Schrödingergleichung am Ursprung nicht, weil $\nabla^2(1/r)$ dort eine δ-Funktion erzeugt. Also

$$u(r) \propto r^{l+1},\qquad R(r) \propto r^l\qquad (r\to0),\qquad u(0) = 0.$$`,
        derive:{ctx:HRAD({params:{a_0:'pos', m:'pos', l:{int:[0, 3]}, κ:'pos'}}), lines:[
          {l:'d^2/dr^2 r^(l+1) = l(l+1) r^(l-1)', w:'zweimal abgeleitet',
            why:{q:'Was wurde benutzt?', opts:['zweimal die Potenzregel: $(l+1)\\,l\\,r^{l-1}$', 'die Produktregel mit $r^l$ und $r$', 'die Kettenregel mit innerer Funktion $l + 1$'], a:0, ex:'$\\frac{d}{dr}r^{l+1} = (l+1)r^l$, noch einmal: $(l+1)l\\,r^{l-1}$.'}},
          {l:'-d^2/dr^2 r^(l+1) + l(l+1)/r^2 r^(l+1) = 0', w:'in den Grenzfall der Radialgleichung eingesetzt',
            why:{q:'Was zeigt diese Zeile?', opts:['Nahe $r = 0$ gleichen sich $u\'\'$ und Zentrifugalglied aus.', 'Die Energie ist null für $l > 0$.', 'Das Coulombpotential ist bei kleinem $r$ unwichtig, weil es klein ist.'], a:0, ex:'Coulomb- und Energieterm sind bei kleinem $r$ um Potenzen von $r$ kleiner als diese beiden Terme. Das Coulombpotential ist dort zwar groß, aber nicht so groß wie $1/r^2$.'}}
        ]},
        q:{q:R`Wie verhält sich $R_{nl}(r)$ für $r \to 0$ bei $l = 2$?`,
          opts:[R`$\propto r^3$`, R`$\propto r^2$`, R`endlich, aber nicht null`], a:1,
          ex:R`$u \propto r^{l+1} = r^3$, also $R = u/r \propto r^2$.`,
          fb:[R`$r^3$ ist das Verhalten von $u$. Für $R = u/r$ fällt eine Potenz weg.`, '',
            R`Endlich und ungleich null ist $R$ nur für $l = 0$.`]}},
      {id:'h-t3c', title:'Große Abstände: exponentieller Abfall',
        pre:{from:'m-dgl', seg:'md-t3', title:'Schwingen oder Abklingen', text:R`$y'' = +\kappa^2y$ hat die Lösungen $Ce^{\kappa x} + De^{-\kappa x}$; die Kurve biegt sich von der Achse weg. $y'' = -k^2y$ hat Schwingungen. Mini-Beispiel: Mit $\kappa = 2$ fällt $e^{-2x}$ auf der Länge $\tfrac12$ um den Faktor $e$.`},
        num:{title:R`$\kappa$ aus der Energie`, text:R`Mit $E = -\hbar^2\kappa^2/(2m)$ und $\hbar^2/(2ma_0^2) = 13{,}6\,\mathrm{eV}$:

$$E = -13{,}6\,\mathrm{eV}\ \Rightarrow\ \kappa = \frac{1}{a_0},\qquad E = -3{,}4\,\mathrm{eV}\ \Rightarrow\ \kappa = \frac{1}{2a_0}.$$

Ein schwächer gebundener Zustand reicht weiter hinaus.`},
        text:R`Für große $r$ fallen beide Potentialterme weg, und es bleibt

$$u'' = \kappa^2u,\qquad \kappa = \frac{\sqrt{-2mE}}{\hbar}.$$

Für gebundene Zustände ist $E < 0$, also $\kappa$ reell. Die normierbare Lösung fällt ab: $u \propto e^{-\kappa r}$. Die andere Lösung $e^{+\kappa r}$ ist verboten. Für $E > 0$ gäbe es statt des Abfalls Wellen, die ins Unendliche laufen. Das sind die ungebundenen Streuzustände: das ionisierte Atom. Ihre Energien sind nicht quantisiert.`,
        derive:{ctx:HRAD({params:{a_0:'pos', m:'pos', l:{int:[0, 3]}, κ:'pos'}}), lines:[
          {l:'d^2/dr^2 e^(-κ r) = κ^2 e^(-κ r)', w:'zweimal abgeleitet',
            why:{q:'Welche Gleichung erfüllt $e^{-\\kappa r}$?', opts:['$u\'\' = \\kappa^2u$, die Gleichung für große $r$', 'die volle Radialgleichung für alle $r$', '$u\'\' = -\\kappa^2u$ wie eine Schwingung'], a:0, ex:'Für große $r$ bleibt $-\\frac{\\hbar^2}{2m}u\'\' = Eu$ mit $E < 0$, also $u\'\' = \\kappa^2u$.'}}
        ]},
        q:{q:R`Warum muss für gebundene Zustände $E < 0$ sein?`,
          opts:['Weil die kinetische Energie negativ ist.', 'Weil $V_{\\text{eff}}$ überall negativ ist.', 'Weil $u$ sonst für große $r$ nicht abklingt.'], a:2,
          ex:R`Für $E > 0$ ist $\kappa$ imaginär: $u$ schwingt bis ins Unendliche und ist nicht normierbar.`,
          fb:[R`Der Erwartungswert der kinetischen Energie ist immer positiv. Entscheidend ist das Verhalten weit draußen.`,
            R`$V_{\text{eff}}$ ist für $l > 0$ nahe dem Kern positiv. Entscheidend ist, dass weit draußen $V \to 0$ geht.`, '']}},
      {id:'h-t3d', title:'Der Lösungsansatz und ein erstes Beispiel',
        num:{title:R`$u = r\,e^{-r/a_0}$ mit $l = 0$`, text:R`Diese Funktion hat an beiden Rändern die richtige Form: $u \propto r$ am Kern, Abfall $e^{-\kappa r}$ mit $\kappa = 1/a_0$ außen. Eingesetzt (Herleitung) bleibt

$$-\frac{\hbar^2}{2m}u'' + V\,u = -\frac{\hbar^2}{2ma_0^2}\,u,$$

also $E = -13{,}6\,\mathrm{eV}$: der Grundzustand.`},
        text:R`Aus beiden Grenzfällen folgt die Idee der Lösung: der Ansatz $u = r^{l+1}\,e^{-\kappa r}\,v(r)$ mit einer Funktion $v$, die zwischen beiden Grenzen vermittelt. Wie beim Oszillator (Thema 7) wird sich zeigen: Nur wenn $v$ ein Polynom ist, bleibt $u$ normierbar. Das legt die erlaubten $\kappa$ und damit die Energien fest. Im einfachsten Fall ist $v$ konstant. Im Beispiel heben sich die Terme mit $1/r$ genau dann weg, wenn der Exponent $r/a_0$ ist. Eine Übungsaufgabe rechnet das ebenfalls nach.`,
        derive:{ctx:HRAD({defs:{'u(r)':'r e^(-r/a_0)', 'V(r)':'-ħ^2/(m a_0 r)'}}), lines:[
          {l:"u'(r) = (1 - r/a_0) e^(-r/a_0)", w:'Produktregel'},
          {l:"u''(r) = (r/a_0^2 - 2/a_0) e^(-r/a_0)", w:'noch einmal abgeleitet',
            why:{q:'Woher kommt $-2/a_0$?', opts:['zweimal $-\\frac{1}{a_0}e^{-r/a_0}$ aus der Produktregel', 'aus dem Coulombpotential, das hier eingesetzt wurde', 'aus der Normierung der Funktion $u$'], a:0, ex:'$\\frac{d}{dr}\\left[(1 - r/a_0)e^{-r/a_0}\\right] = -\\frac{1}{a_0}e^{-r/a_0} - \\frac{1}{a_0}(1 - r/a_0)e^{-r/a_0}$.'}},
          {l:"-ħ^2/(2m) u''(r) + V(r) u(r) = -ħ^2/(2m a_0^2) u(r)", w:'in die Radialgleichung mit l = 0 eingesetzt',
            why:{q:'Was ist mit dem Term $\\frac{\\hbar^2}{ma_0}e^{-r/a_0}$ geschehen?', opts:['Er hebt sich gegen $V\\,u = -\\frac{\\hbar^2}{ma_0}e^{-r/a_0}$ weg.', 'Er wurde für große $r$ vernachlässigt.', 'Er steckt jetzt in der Energie rechts.'], a:0, ex:'$V\\,u = -\\frac{\\hbar^2}{ma_0r}\\cdot r\\,e^{-r/a_0}$. Übrig bleibt nur der Term proportional zu $u$, die Energie.'}}
        ]},
        q:{q:R`Welche Energie gehört zu $u = r\,e^{-r/a_0}$?`,
          opts:[R`$-27{,}2\,\mathrm{eV}$`, R`$-13{,}6\,\mathrm{eV}$`, R`$-3{,}4\,\mathrm{eV}$`], a:1,
          ex:R`$E = -\hbar^2/(2ma_0^2) = -13{,}6\,\mathrm{eV}$, die Grundzustandsenergie.`,
          fb:[R`$-27{,}2\,\mathrm{eV}$ ist $V(a_0)$, ein Wert des Potentials, keine Energie eines Zustands.`, '',
            R`$-3{,}4\,\mathrm{eV}$ gehört zu $\kappa = 1/(2a_0)$, also zu $e^{-r/(2a_0)}$.`]}},
      {id:'h-t3e', title:R`Typischer Fehler: $u(0) = 0$ heißt nicht $\psi(0) = 0$`,
        num:{title:'Der Grundzustand am Kern', text:R`$u_{10}(0) = 0$, aber $R_{10}(0) = 2a_0^{-3/2}$ und

$$|\psi_{100}(0)|^2 = \frac{1}{\pi a_0^3} \ne 0.$$

Dagegen ist für $2p$ schon $R_{21} \propto r$, also $\psi_{21m}(0) = 0$.`},
        text:R`Die Randbedingung $u(0) = 0$ gilt für $u = rR$, nicht für $R$ oder $\psi$. Ein häufiger Schluss lautet: „Weil $u(0) = 0$ ist, hat jedes Elektron am Kern die Dichte null.“ Für $l = 0$ ist aber $R(0)$ endlich und von null verschieden; nur der Faktor $r$ in $u$ verschwindet. Für $l \ge 1$ geht dagegen auch $R \propto r^l$ gegen null. Nur s-Zustände haben am Kern eine von null verschiedene Dichte. Das zeigt sich messbar, etwa wenn die Größe des Kerns die Energie verschiebt.`,
        q:{q:R`Welche Zustände haben am Kern eine von null verschiedene Dichte $|\psi(0)|^2$?`,
          opts:[R`keine, denn $u(0) = 0$`, R`nur s-Zustände, also $l = 0$`, R`alle Zustände mit $n = 1$ und $n = 2$`], a:1,
          ex:R`$R \propto r^l$ nahe am Kern. Nur für $l = 0$ bleibt $R(0)$ endlich und ungleich null.`,
          fb:[R`$u(0) = 0$ folgt aus dem Faktor $r$ in $u = rR$. Für $l = 0$ ist $R(0)$ trotzdem nicht null.`, '',
            R`Entscheidend ist $l$, nicht $n$. Der $2p$-Zustand hat am Kern die Dichte null, $2s$ nicht.`]}}
    ]},

    /* ===== Abschnitt 4: Energien, Quantenzahlen, Entartung ===== */
    {id:'h-t4', title:'Energieniveaus und Entartung', steps:[
      {id:'h-t4a', title:R`Ein einfacher Fall: $l = n - 1$`,
        num:{title:R`$n = 2$, $l = 1$`, text:R`Probiere $u = r^2e^{-r/(2a_0)}$. Die Herleitung unten mit $n = 2$ zeigt: Das ist eine Lösung, mit

$$E_2 = -\frac{\hbar^2}{2ma_0^2}\cdot\frac14 \approx -3{,}40\,\mathrm{eV}.$$

Der Zustand hat keinen radialen Knoten, denn $r^2e^{-r/(2a_0)}$ ist für $r > 0$ überall positiv.`},
        text:R`Für $l = n - 1$ ist $v$ eine Konstante. Probiere also

$$u(r) = r^n e^{-r/(na_0)},\qquad l = n - 1.$$

Die Herleitung zeigt: Das ist eine Lösung der Radialgleichung, und zwar mit der Energie

$$E_n = -\frac{\hbar^2}{2ma_0^2}\,\frac{1}{n^2} \approx -\frac{13{,}6\,\mathrm{eV}}{n^2}.$$

Die Terme mit $1/r^2$ heben sich mit der Zentrifugalbarriere weg, die mit $1/r$ mit dem Coulombpotential. Übrig bleibt eine Konstante mal $u$, und diese Konstante ist die Energie.`,
        derive:{ctx:HRAD({params:{a_0:'pos', m:'pos', n:{int:[1, 4]}}, defs:{'u(r)':'r^n e^(-r/(n a_0))', 'V(r)':'-ħ^2/(m a_0 r)'}}), lines:[
          {l:"u'(r) = (n/r - 1/(n a_0)) u(r)", w:'Produktregel, u ausgeklammert',
            why:{q:'Was wurde gemacht?', opts:['Produktregel; danach $u$ ausgeklammert', 'Quotientenregel mit $e^{r/(na_0)}$', 'logarithmisch integriert'], a:0, ex:'$(r^n)\' = \\frac nr r^n$ und $(e^{-r/(na_0)})\' = -\\frac{1}{na_0}e^{-r/(na_0)}$.'}},
          {l:"u''(r) = (n(n-1)/r^2 - 2/(a_0 r) + 1/(n^2 a_0^2)) u(r)", w:'noch einmal abgeleitet',
            why:{q:'Woher kommt $-2/(a_0r)$?', opts:['aus $2\\cdot\\frac nr\\cdot\\left(-\\frac{1}{na_0}\\right)$; das $n$ kürzt sich', 'aus dem Coulombpotential, eingesetzt', 'aus der Ableitung von $1/(n^2a_0^2)$'], a:0, ex:'$u\'\' = \\left[-\\frac{n}{r^2} + \\left(\\frac nr - \\frac{1}{na_0}\\right)^2\\right]u$; der Mischterm des Quadrats ist $-\\frac{2}{a_0r}$.'}},
          {l:"-ħ^2/(2m) u''(r) + (V(r) + ħ^2 n(n-1)/(2m r^2)) u(r) = -ħ^2/(2m n^2 a_0^2) u(r)", w:'in die Radialgleichung mit l(l+1) = n(n−1) eingesetzt',
            why:{q:'Was ist mit den Termen in $1/r$ und $1/r^2$ geschehen?', opts:['Sie heben sich gegen Coulombterm und Zentrifugalglied weg.', 'Sie wurden für große Abstände $r$ einfach vernachlässigt.', 'Sie sind jetzt in der Energie auf der rechten Seite enthalten.'], a:0, ex:'$l = n - 1$ gibt $l(l+1) = n(n-1)$. Es bleibt nur der konstante Term – die Energie $E_n$.'}}
        ]},
        q:{q:R`Zu welcher Energie gehört $u = r^3e^{-r/(3a_0)}$ mit $l = 2$?`,
          opts:[R`$-4{,}53\,\mathrm{eV}$`, R`$-0{,}85\,\mathrm{eV}$`, R`$-1{,}51\,\mathrm{eV}$`], a:2,
          ex:R`Das ist der Fall $n = 3$: $E_3 = -13{,}6\,\mathrm{eV}/9 \approx -1{,}51\,\mathrm{eV}$.`,
          fb:[R`$13{,}6/3$ wäre ein Abfall wie $1/n$. Die Energie geht wie $1/n^2$.`,
            R`$-0{,}85\,\mathrm{eV}$ ist $E_4$. Der Exponent $r/(3a_0)$ und die Potenz $r^3$ gehören zu $n = 3$.`, '']}},
      {id:'h-t4b', title:'Allgemein: Potenzreihe und Rekursion',
        pre:{from:'m-spezial', seg:'ms-t4', title:'Abbrechende Potenzreihen', text:R`Bei Differentialgleichungen mit nicht konstanten Koeffizienten setzt man eine Potenzreihe an. Brauchbare Lösungen gibt es nur, wenn die Reihe abbricht; dann ist die Lösung ein Polynom. Die Abbruchbedingung liefert diskrete Eigenwerte. Mini-Beispiel: beim Oszillator $E_n = \hbar\omega(n + \tfrac12)$.`},
        num:{title:R`$l = 0$ und $\rho_0 = 4$`, text:R`Die Rekursion unten gibt mit $l = 0$:

$$c_1 = \frac{2 - 4}{1\cdot2}\,c_0 = -c_0,\qquad c_2 = \frac{4 - 4}{2\cdot3}\,c_1 = 0.$$

Alle weiteren $c_j$ sind dann auch null: $v = c_0(1 - \rho)$ mit $\rho = \kappa r = r/(2a_0)$. Das ist der Faktor $1 - r/(2a_0)$ in $R_{20}$.`},
        text:R`Allgemein setzt du mit der dimensionslosen Variablen $\rho = \kappa r$ an:

$$u = \rho^{l+1}e^{-\rho}\,v(\rho),\qquad v = \sum_jc_j\rho^j.$$

Die Faktoren $\rho^{l+1}$ und $e^{-\rho}$ sorgen für das richtige Verhalten am Kern und weit draußen. Setzt du das in die Radialgleichung ein und vergleichst die Koeffizienten jeder Potenz $\rho^j$, folgt die Rekursion

$$c_{j+1} = \frac{2(j + l + 1) - \rho_0}{(j+1)(j + 2l + 2)}\,c_j,\qquad \rho_0 = \frac{2}{\kappa a_0}.$$

Gelesen: Aus $c_0$ folgt $c_1$, daraus $c_2$ und so weiter. Die Energie steckt in $\rho_0$, denn $\kappa = \sqrt{-2mE}/\hbar$. Den Koeffizientenvergleich selbst rechnen Griffiths & Schroeter in Kap. 4.2 vor.`,
        q:{q:R`Mit $l = 1$ und $\rho_0 = 6$: Wie groß ist $c_1/c_0$?`,
          opts:[R`$-\tfrac12$`, R`$-2$`, R`$+\tfrac12$`], a:0,
          ex:R`$c_1 = \frac{2(0 + 1 + 1) - 6}{1\cdot(0 + 2 + 2)}\,c_0 = \frac{-2}{4}\,c_0$. Danach ist $c_2 = \frac{6 - 6}{2\cdot5}\,c_1 = 0$: $v = 1 - \rho/2$ mit $\rho = r/(3a_0)$, also der Faktor $6 - r/a_0$ in $R_{31}$.`,
          fb:['', R`Das wäre die Rekursion mit $l = 0$. Für $l = 1$ steht im Zähler $2(0 + 1 + 1) = 4$ und im Nenner $1\cdot4$.`,
            R`Der Zähler ist $4 - 6 = -2$, also negativ.`]}},
      {id:'h-t4b2', title:'Warum die Reihe abbrechen muss',
        num:{title:'Die Koeffizienten weit hinten', text:R`Bricht die Reihe nicht ab, etwa für $l = 0$ und $\rho_0 = 3$, gibt die Rekursion bei $j = 50$

$$\frac{c_{51}}{c_{50}} = \frac{102 - 3}{51\cdot52} \approx 0{,}037.$$

Bei $e^{2\rho} = \sum_j\frac{(2\rho)^j}{j!}$ ist dasselbe Verhältnis $\frac{2}{51} \approx 0{,}039$. Die Reihe wächst also wie $e^{2\rho}$.`},
        text:R`Bricht die Reihe nicht ab, ist für große $j$ der Quotient $c_{j+1}/c_j \approx 2/j$, wie bei den Koeffizienten von $e^{2\rho}$. Dann wüchse

$$u \approx \rho^{l+1}e^{-\rho}e^{2\rho} = \rho^{l+1}e^{+\rho},$$

und $u$ wäre nicht normierbar. Also muss die Reihe abbrechen: Bei einem $j = N$ wird der Zähler null, $2(N + l + 1) = \rho_0$. Mit $\rho_0 = 2/(\kappa a_0)$ folgt $\kappa = 1/(na_0)$ mit der **Hauptquantenzahl** $n = N + l + 1$. Eingesetzt in $E = -\hbar^2\kappa^2/(2m)$ ergibt das genau $E_n$. $N$ ist der Grad des Polynoms $v$ und die Zahl der radialen Knoten; die Polynome sind [[lex:laguerre-polynome|Laguerre-Polynome]].`,
        q:{q:R`Ein Zustand hat $l = 1$ und einen radialen Knoten, also $N = 1$. Welche Hauptquantenzahl hat er?`,
          opts:[R`$n = 2$`, R`$n = 3$`, R`$n = 1$`], a:1,
          ex:R`$n = N + l + 1 = 1 + 1 + 1 = 3$. Es ist ein $3p$-Zustand.`,
          fb:[R`$n = N + l$ vergisst die $1$. Mit $n = 2$ und $l = 1$ gäbe es keinen Knoten.`, '',
            R`Für $n = 1$ gibt es nur $l = 0$ und keinen Knoten.`]}},
      {id:'h-t4c', title:'Das Termschema',
        num:{title:'Die ersten vier Niveaus', text:R`$E_n = -13{,}6\,\mathrm{eV}/n^2$ gibt

$$E_1 = -13{,}6,\quad E_2 = -3{,}40,\quad E_3 = -1{,}51,\quad E_4 = -0{,}85\quad(\mathrm{eV}).$$

Der Abstand $E_2 - E_1$ ist $10{,}2\,\mathrm{eV}$, der Abstand $E_4 - E_3$ nur noch $0{,}66\,\mathrm{eV}$.`},
        text:R`Die [[lex:wasserstoff-energie|Energieniveaus]] hängen nur von $n$ ab. Nach oben rücken sie immer dichter zusammen und häufen sich bei $E = 0$. Dort beginnt das Kontinuum: Das Elektron ist frei, das Atom ionisiert. Zeichnet man die Niveaus als waagerechte Striche übereinander, entsteht das **Termschema**. Eine Spektrallinie ist ein Pfeil zwischen zwei Strichen, eine Ionisierung ein Pfeil von einem Strich bis zur Linie $E = 0$. Die Tafel übersetzt zwischen Worten, Formel, Graph und Messung.`,
        reps:{obj:'Die Energieniveaus des Wasserstoffs',
          rows:[
            {k:'worte', text:R`Unendlich viele gebundene Niveaus. Nach oben rücken sie immer dichter zusammen, bis $E = 0$, wo das Elektron frei wird.`},
            {k:'formel', tex:R`E_n = -\frac{\hbar^2}{2ma_0^2}\,\frac{1}{n^2} \approx -\frac{13{,}6\,\mathrm{eV}}{n^2},\qquad n = 1, 2, 3, \dots`},
            {k:'graph', plot:{x:[1, 8], y:[-14.5, 1], abs:true, yticks:[{y:-13.6, lab:'-13{,}6'}, {y:-3.4, lab:'-3{,}4'}, {y:-1.51, lab:'-1{,}5'}], xlab:'n', ylab:R`E_n/\text{eV}`, ticks:H_SK.ticks(1, 8)}, f:n => -13.6 / (n * n),
              cap:R`$E_n$ über $n$. Nur ganze $n$ sind erlaubt; dazwischen hat die Kurve keine Bedeutung. Die Werte nähern sich $0$ von unten.`},
            {k:'physik', text:R`Ionisierung aus $1s$ kostet $13{,}6\,\mathrm{eV}$, aus $n = 2$ nur $3{,}40\,\mathrm{eV}$. Ein Photon aus dem Übergang $3 \to 2$ trägt $1{,}89\,\mathrm{eV}$.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Immer dichter“ als Gesetz schreiben: $E_n \propto -1/n^2$. Der Abstand benachbarter Niveaus ist für große $n$ etwa $27{,}2\,\mathrm{eV}/n^3$.`},
            {from:'formel', to:'graph', rule:R`$E_n$ für $n = 1, 2, 3, \dots$ ausrechnen und über $n$ auftragen; Werte bei nicht ganzen $n$ nicht lesen.`},
            {from:'graph', to:'physik', rule:R`Den Abstand zweier Punkte auf der Energieachse als Photonenenergie lesen, den Abstand eines Punkts zur Linie $E = 0$ als Ionisierungsenergie.`}
          ]},
        q:{q:R`Wie viel Energie braucht man mindestens, um ein Elektron aus dem Niveau $n = 3$ zu ionisieren?`, tr:{from:'formel', to:'physik'},
          opts:[R`$12{,}1\,\mathrm{eV}$`, R`$1{,}51\,\mathrm{eV}$`, R`$4{,}53\,\mathrm{eV}$`], a:1,
          ex:R`Ionisieren heißt: von $E_3 = -1{,}51\,\mathrm{eV}$ auf $E = 0$. Das kostet $1{,}51\,\mathrm{eV}$.`,
          fb:[R`$12{,}1\,\mathrm{eV}$ ist $E_3 - E_1$, die Anregung aus dem Grundzustand nach $n = 3$.`, '',
            R`Die Energie geht wie $1/n^2$, nicht wie $1/n$: $13{,}6/9$, nicht $13{,}6/3$.`]}},
      {id:'h-t4d', title:R`Quantenzahlen und Entartung $n^2$`,
        num:{title:R`$n = 2$ und $n = 3$`, text:R`Zu $n = 2$ gehören $l = 0$ mit $m = 0$ und $l = 1$ mit $m = -1, 0, 1$:

$$1 + 3 = 4 = 2^2.$$

Zu $n = 3$ kommen $l = 2$ mit fünf Werten von $m$ dazu: $1 + 3 + 5 = 9 = 3^2$.`},
        text:R`Zu festem $n$ ist $l = 0, 1, \dots, n - 1$ möglich, denn $N = n - l - 1 \ge 0$. Zu jedem $l$ gibt es $2l + 1$ Werte von $m$. Die Energie hängt aber nur von $n$ ab. Also gehören zu $E_n$ insgesamt

$$\sum_{l=0}^{n-1}(2l+1) = n^2$$

Zustände: $E_n$ ist $n^2$-fach [[lex:h-entartung|entartet]]. **Ausblick:** Mit dem Spin aus Thema 10 sind es $2n^2$. Die Tafel zeigt das Niveau $n = 2$ in vier Gestalten.`,
        reps:{obj:R`Das Niveau $n = 2$`,
          rows:[
            {k:'worte', text:R`Vier Zustände gleicher Energie: ein $2s$ ohne Drehimpuls und drei $2p$ mit $l = 1$.`},
            {k:'dirac', tex:R`|2,0,0\rangle,\quad |2,1,1\rangle,\quad |2,1,0\rangle,\quad |2,1,-1\rangle`},
            {k:'ort', tex:R`R_{20}(r)\,Y_0^0,\qquad R_{21}(r)\,Y_1^m(\theta,\varphi),\quad m = 1, 0, -1`},
            {k:'physik', text:R`Eine Energiemessung ergibt in jeder Überlagerung dieser vier sicher $E_2 = -3{,}40\,\mathrm{eV}$. Erst $L^2$ oder $L_z$ unterscheiden sie.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`Für jedes erlaubte $l = 0, \dots, n - 1$ alle $m = -l, \dots, l$ aufschreiben und als $|n,l,m\rangle$ notieren.`},
            {from:'dirac', to:'ort', rule:R`Jeden Ket als $R_{nl}(r)\,Y_l^m(\theta,\varphi)$ schreiben; $n$ und $l$ wählen die Radialfunktion, $l$ und $m$ die Kugelflächenfunktion.`},
            {from:'ort', to:'physik', rule:R`Alle vier Funktionen lösen die Schrödingergleichung mit demselben $E_2$. Also ist auch jede Überlagerung Eigenzustand von $\hat H$ zu $E_2$.`}
          ]},
        q:{q:R`Ein Atom ist im Zustand $\tfrac{1}{\sqrt2}\left(|2,0,0\rangle + |2,1,0\rangle\right)$. Du misst die Energie. Was kommt heraus?`, tr:{from:'dirac', to:'physik'},
          opts:[R`sicher $E_2 = -3{,}40\,\mathrm{eV}$`, R`$E_2$ oder $E_1$, je mit $\tfrac12$`, R`je mit $\tfrac12$ die Energie von $2s$ oder von $2p$, zwei verschiedene Werte`], a:0,
          ex:R`Beide Anteile gehören zu $n = 2$ und damit zur selben Energie. Die Überlagerung ist Eigenzustand von $\hat H$. Scharf ist $L^2$ hier dagegen nicht.`,
          fb:['', R`Kein Anteil gehört zu $n = 1$. Beide Kets haben $n = 2$.`,
            R`Im Wasserstoff haben $2s$ und $2p$ dieselbe Energie. Verschieden sind sie erst in Atomen mit mehreren Elektronen.`]}},
      {id:'h-t4e', title:R`Warum die Entartung in $l$ besonders ist`,
        num:{title:'Natrium', text:R`Im Natrium liegt $3p$ höher als $3s$. Der Übergang $3p \to 3s$ ist die gelbe D-Linie bei $589\,\mathrm{nm}$:

$$\Delta E = \frac{1240\,\mathrm{eV\,nm}}{589\,\mathrm{nm}} \approx 2{,}10\,\mathrm{eV}.$$

Im Wasserstoff haben $3s$ und $3p$ dieselbe Energie, $-1{,}51\,\mathrm{eV}$.`},
        text:R`Die Entartung in $m$ hat jedes Zentralpotential, denn sie folgt aus der Drehsymmetrie. Die Entartung in $l$ ist eine Besonderheit des $1/r$-Potentials. Sie hängt mit einer zusätzlichen Erhaltungsgröße zusammen, dem Lenz-Runge-Vektor, der auch klassisch die Keplerellipsen festhält. In Atomen mit mehreren Elektronen fehlt sie. Dort schirmen die inneren Elektronen den Kern ab, und das Potential ist nicht mehr $\propto 1/r$. Ein $s$-Elektron kommt dem Kern näher als ein $p$-Elektron und ist deshalb stärker gebunden.`,
        q:{q:R`Im Natriumatom liegt $3s$ tiefer als $3p$. Warum widerspricht das nicht der Entartung beim Wasserstoff?`,
          opts:[R`Bei Natrium hängt die Energie zusätzlich von $m$ ab.`, R`Bei Natrium hat $3p$ eine größere Hauptquantenzahl.`, R`Die $l$-Entartung gibt es nur im reinen $1/r$-Potential.`], a:2,
          ex:R`Die inneren Elektronen schirmen den Kern ab; das Potential ist dann nicht mehr $\propto 1/r$. Die $m$-Entartung bleibt in jedem Zentralpotential.`,
          fb:[R`Die $m$-Entartung bleibt in jedem Zentralpotential erhalten. Aufgehoben ist die Entartung in $l$.`,
            R`$3s$ und $3p$ haben beide $n = 3$. Verschieden ist $l$.`, '']}},
      {id:'h-t4f', title:R`Typischer Fehler: $l = n$ zulassen`,
        num:{title:'Die ersten Schalen', text:R`$n = 1$: nur $1s$. $n = 2$: $2s$ und $2p$. $n = 3$: $3s$, $3p$, $3d$. Einen Zustand $1p$ oder $2d$ gibt es nicht; dafür wäre

$$N = n - l - 1 = 1 - 1 - 1 = -1\quad\text{bzw.}\quad 2 - 2 - 1 = -1.$$`},
        text:R`Man schreibt $n$ als Zahl und $l$ als Buchstaben: s, p, d, f für $l = 0, 1, 2, 3$. Der Grundzustand ist $1s$. Zum ersten angeregten Niveau gehören $2s$ und drei $2p$-Zustände. Ein typischer Fehler ist, $l = n$ zuzulassen, etwa einen Zustand $1p$. Die Bedingung lautet aber $l \le n - 1$, weil die Zahl der radialen Knoten $N = n - l - 1$ nicht negativ sein kann. Ein zweiter Fehler ist, $m$ bis $n$ laufen zu lassen; $m$ ist durch $l$ begrenzt.`,
        q:{q:R`Welchen Zustand gibt es im Wasserstoffatom?`,
          opts:[R`$2d$`, R`$3d$`, R`$1p$`], a:1,
          ex:R`$3d$ hat $n = 3$, $l = 2 \le n - 1$. $2d$ und $1p$ verletzen $l \le n - 1$.`,
          fb:[R`$d$ heißt $l = 2$, und das verlangt $n \ge 3$.`, '',
            R`Zu $n = 1$ gehört nur $l = 0$, also nur $1s$.`]}}
    ]},

    /* ===== Abschnitt 5: Radialfunktionen, P(r), Erwartungswerte, Labor ===== */
    {id:'h-t5', title:'Radialfunktionen und wo das Elektron ist', steps:[
      {id:'h-t5a', title:'Die ersten Radialfunktionen',
        num:{title:R`Der Knoten von $R_{20}$`, text:R`$R_{20} \propto (1 - r/(2a_0))$ wird null bei

$$r = 2a_0.$$

$R_{21} \propto r\,e^{-r/(2a_0)}$ hat für $r > 0$ keine Nullstelle. Das passt zur Knotenzahl $n - l - 1$: eins für $2s$, null für $2p$.`},
        text:R`Die ersten [[lex:radialfunktionen|Radialfunktionen]] sind

$$\begin{aligned}R_{10} &= \frac{2}{a_0^{3/2}}e^{-r/a_0},\\ R_{20} &= \frac{1}{\sqrt2\,a_0^{3/2}}\left(1 - \frac{r}{2a_0}\right)e^{-r/(2a_0)},\\ R_{21} &= \frac{1}{\sqrt{24}\,a_0^{3/2}}\,\frac{r}{a_0}\,e^{-r/(2a_0)}.\end{aligned}$$

Mit $Y_0^0 = 1/\sqrt{4\pi}$ ist der Grundzustand $\psi_{100} = e^{-r/a_0}/\sqrt{\pi a_0^3}$. Die Zahl der radialen Knoten ist $n - l - 1$. Alle drei Funktionen fallen außen exponentiell ab, und zwar umso langsamer, je größer $n$ ist. Radialfunktionen zum selben $l$ sind mit dem Maß $r^2dr$ zueinander orthogonal. Die Herleitung prüft den Knoten von $R_{20}$ und die Orthogonalität von $R_{10}$ und $R_{20}$.`,
        derive:{ctx:HRAD({defs:HDEFS}), lines:[
          {l:'R_20(2a_0) = 0', w:'Knoten von R₂₀'},
          {l:'∫_0^∞ R_10(r) R_20(r) r^2 dr = 0', w:'orthogonal mit dem Maß r²',
            why:{q:'Warum steht $r^2$ im Integral?', opts:['Weil im Volumenelement $d^3r = r^2dr\\,d\\Omega$ steckt.', 'Weil beide Funktionen nur von $r$ abhängen.', 'Weil $R_{20}$ bei $r = 2a_0$ einen Knoten hat.'], a:0, ex:'Das Skalarprodukt im Raum ist $\\int\\psi^*\\phi\\,d^3r$ mit $d^3r = r^2dr\\,d\\Omega$. Ohne $r^2$ wären $R_{10}$ und $R_{20}$ nicht orthogonal.'}}
        ]},
        q:{q:R`Wie viele radiale Knoten hat $R_{31}$?`,
          opts:[R`$2$`, R`$0$`, R`$1$`], a:2,
          ex:R`$n - l - 1 = 3 - 1 - 1 = 1$.`,
          fb:[R`$n - 1 = 2$ zählt nur für $l = 0$. Bei $l = 1$ ist es einer weniger.`,
            R`Keinen Knoten haben nur die Zustände mit $l = n - 1$, hier $3d$.`, '']}},
      {id:'h-t5b', title:'Dichte pro Volumen oder pro Abstand?',
        pre:{from:'m-spezial', seg:'ms-t2', title:'Radiale Wahrscheinlichkeitsdichte', text:R`Für kugelsymmetrisches $\psi$ ist $P(r) = 4\pi r^2|\psi|^2$ die Wahrscheinlichkeitsdichte pro Abstand, normiert mit $\int_0^\infty P\,dr = 1$. Mini-Beispiel Grundzustand mit Bohrradius $a$: $|\psi|^2$ ist am Kern am größten, $P(r)$ hat sein Maximum bei $r = a$.`},
        num:{title:R`$1s$ am Kern und bei $a_0$`, text:R`$|\psi_{100}|^2 \propto e^{-2r/a_0}$ hat bei $r = 0$ den Wert $1$ und bei $r = a_0$ nur noch $e^{-2} \approx 0{,}135$. Dagegen ist

$$P(r) \propto r^2e^{-2r/a_0}:\qquad P(0) = 0,\qquad P(a_0) \propto a_0^2\cdot0{,}135.$$

Am Kern ist die Dichte groß, aber das Volumen klein.`},
        text:R`$|\psi_{100}|^2$ ist am Kern am größten. Trotzdem ist $r = 0$ nicht der wahrscheinlichste Abstand. Die Wahrscheinlichkeit, das Elektron in einer Kugelschale zwischen $r$ und $r + dr$ zu finden, enthält das Schalenvolumen. Nach dem Winkelintegral bleibt

$$P(r)\,dr = r^2|R_{nl}(r)|^2\,dr.$$

Für $1s$ drückt der Faktor $r^2$ die Dichte $P$ am Kern auf null, die Exponentialfunktion drückt sie weit draußen. Das Maximum liegt bei $r = a_0$. Beide Aussagen sind richtig: Ein kleines Volumen am Kern enthält das Elektron mit größerer Wahrscheinlichkeit als ein gleich großes bei $a_0$, aber bei $a_0$ gibt es viel mehr Volumen.`,
        q:{q:'Ein kugelsymmetrischer Zustand hat $\\psi \\propto e^{-2r/a_0}$. Wo ist die Wahrscheinlichkeit pro Volumen am größten, wo die pro Abstandsintervall $dr$?',
          opts:['beide bei $r = a_0/2$', 'am Kern bzw. bei $r = a_0/2$', 'beide am Kern', 'am Kern bzw. bei $r = a_0$'], a:1,
          ex:'$|\\psi|^2 \\propto e^{-4r/a_0}$ ist am Kern maximal. $P(r) \\propto r^2e^{-4r/a_0}$ hat $P\' \\propto (2r - 4r^2/a_0)\\,e^{-4r/a_0}$, also das Maximum bei $r = a_0/2$.',
          fb:['$|\\psi|^2 \\propto e^{-4r/a_0}$ fällt vom Kern an monoton ab. Bei $a_0/2$ liegt nur das Maximum von $P(r)$.', '', '$P(r)$ enthält den Faktor $r^2$ und ist am Kern null.', '$r = a_0$ gilt für $\\psi \\propto e^{-r/a_0}$. Hier fällt $\\psi$ doppelt so schnell ab: $P\' = 0$ bei $2r = 4r^2/a_0$, also $r = a_0/2$.']}},
      {id:'h-t5c', title:R`Der Zustand $2s$ in sechs Gestalten`,
        num:{title:R`$P(r)$ für $2s$`, text:R`$P_{20}(r) = \frac{r^2}{2a_0^3}\left(1 - \frac{r}{2a_0}\right)^2e^{-r/a_0}$ ist null bei $r = 0$ und bei $r = 2a_0$. Die beiden Maxima liegen bei

$$r = (3 \mp \sqrt5)\,a_0 \approx 0{,}76\,a_0\quad\text{und}\quad 5{,}24\,a_0,$$

das innere ist nur $0{,}27$-mal so hoch wie das äußere.`},
        text:R`Jetzt übersetzt du einen Zustand mit Knoten durch alle Gestalten. Aus den Quantenzahlen folgt, welche Radialgleichung gilt: Das $l$ bestimmt das Zentrifugalglied, das $n$ die Energie. Ihre Lösung $u$ gibt die Radialfunktion $R = u/r$, und $P(r) = |u|^2$ ist das Bild, das das Labor zeichnet. Rückwärts liest du aus dem Bild die Zahl der Knoten und damit $n - l - 1$ ab. Die Lage des äußeren Maximums verrät, wie groß der Zustand ist.`,
        reps:{obj:R`Der Zustand $2s$`,
          rows:[
            {k:'worte', text:R`Erstes angeregtes Niveau ohne Drehimpuls: eine innere und eine äußere Kugelschale, getrennt durch eine Knotenfläche bei $2a_0$.`},
            {k:'dirac', tex:R`\begin{gathered}|2,0,0\rangle:\qquad \hat H|2,0,0\rangle = E_2|2,0,0\rangle,\\ E_2 = -3{,}40\,\mathrm{eV},\quad \hat L^2|2,0,0\rangle = 0\end{gathered}`},
            {k:'formel', tex:R`-\frac{\hbar^2}{2m}u_{20}'' - \frac{\hbar^2}{ma_0r}\,u_{20} = E_2\,u_{20}\qquad(l = 0:\ \text{kein Zentrifugalglied})`},
            {k:'ort', tex:R`R_{20}(r) = \frac{u_{20}}{r} = \frac{1}{\sqrt2\,a_0^{3/2}}\left(1 - \frac{r}{2a_0}\right)e^{-r/(2a_0)}`},
            {k:'graph', plot:{x:[0, 15], y:[0, 0.21], xlab:'r/a_0', ylab:R`r^2|R_{20}|^2\,a_0`, ticks:H_SK.ticks(2, 14)}, f:H_SK.P20,
              cap:R`$P(r) = r^2|R_{20}|^2$: kleiner Buckel innen, Nullstelle bei $2a_0$, großer Buckel außen mit dem Maximum bei $5{,}24\,a_0$.`},
            {k:'labor', text:R`Regler $n = 2$, $l = 0$: zwei Buckel, die Kurve berührt bei $2\,a_0$ die Achse; die rote Linie $\langle r\rangle$ steht bei $6\,a_0$; die Anzeige meldet einen radialen Knoten.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Erstes angeregtes Niveau“ heißt $n = 2$, „ohne Drehimpuls“ heißt $l = m = 0$.`},
            {from:'dirac', to:'formel', rule:R`Mit $l$ das Zentrifugalglied $\hbar^2l(l+1)/(2mr^2)$ bilden, hier null; mit $n$ die Energie $E_n$ einsetzen.`},
            {from:'formel', to:'ort', rule:R`Die Lösung $u$ durch $r$ teilen und mit $\int_0^\infty|R|^2r^2dr = 1$ normieren.`},
            {from:'ort', to:'graph', rule:R`$R$ quadrieren und mit $r^2$ multiplizieren. Der Faktor $(1 - r/2a_0)^2$ macht aus der Nullstelle von $R$ einen Berührpunkt von $P$.`},
            {from:'graph', to:'labor', rule:R`Das Labor zeichnet dieselbe Kurve, $r$ in Einheiten von $a_0$, und setzt $\langle r\rangle$ als rote Linie dazu.`}
          ]},
        q:{q:R`Ein Graph von $P(r)$ hat für $r > 0$ zwei Nullstellen und das größte Maximum ganz außen, bei etwa $13\,a_0$. Welcher Zustand ist das?`, tr:{from:'graph', to:'dirac'},
          opts:[R`$3s$, also $|3,0,0\rangle$`, R`$3p$, also $|3,1,0\rangle$`, R`$2s$, also $|2,0,0\rangle$`], a:0,
          ex:R`Zwei Knoten heißt $n - l - 1 = 2$. Ein Maximum so weit außen passt zu $n = 3$; dann ist $l = 0$.`,
          fb:['', R`$3p$ hat nur $n - l - 1 = 1$ Knoten.`,
            R`$2s$ hat einen Knoten und sein äußeres Maximum bei etwa $5\,a_0$.`]}},
      {id:'h-t5d', title:R`Mittelwerte mit dem Maß $r^2dr$`,
        pre:{from:'m-analysis', seg:'ma-t4', title:'Fakultätsintegrale', text:R`Für ganze $k \ge 0$ und $a > 0$ gilt $\int_0^\infty r^k\,e^{-r/a}\,dr = k!\,a^{k+1}$. Mini-Beispiel: $\int_0^\infty r^2e^{-r}\,dr = 2! = 2$.`},
        num:{title:R`$\langle r\rangle$ für $1s$`, text:R`Mit $|R_{10}|^2 = \frac{4}{a_0^3}e^{-2r/a_0}$ und $k = 3$, $a = a_0/2$:

$$\langle r\rangle = \frac{4}{a_0^3}\int_0^\infty r\cdot r^2\,e^{-2r/a_0}\,dr = \frac{4}{a_0^3}\cdot3!\left(\frac{a_0}{2}\right)^4 = \frac32\,a_0.$$

Der Mittelwert liegt weiter außen als das Maximum bei $a_0$.`},
        text:R`Mit dem Maß $r^2dr$ rechnest du [[lex:erwartungswert|Erwartungswerte]] wie in Thema 1, nur mit dem zusätzlichen Faktor $r^2$. Der Mittelwert liegt weiter außen als das Maximum, weil die Verteilung nach außen einen langen Ausläufer hat. Die Herleitung rechnet $\langle r\rangle$ für $2s$ vor. Allgemein gilt

$$\langle r\rangle = \frac{a_0}{2}\left[3n^2 - l(l+1)\right],\qquad \left\langle\frac1r\right\rangle = \frac{1}{n^2a_0}.$$

Aus $\langle 1/r\rangle$ folgt $\langle V\rangle = -\frac{\hbar^2}{ma_0}\left\langle\frac1r\right\rangle = 2E_n$, und mit $E_n = \langle T\rangle + \langle V\rangle$ ist $\langle T\rangle = -E_n$. Das ist der [[lex:virialsatz|Virialsatz]] für das $1/r$-Potential.`,
        derive:{ctx:HRAD({defs:HDEFS, state:'R_20'}), lines:[
          {l:'⟨r⟩ = ∫_0^∞ r |R_20(r)|^2 r^2 dr', w:'Erwartungswert mit dem Maß r²dr',
            why:{q:'Warum stehen zwei Faktoren $r$ im Integral?', opts:['Einer ist die Messgröße, $r^2$ kommt vom Maß.', 'Beide stammen aus dem Volumenelement $r^2dr$.', 'Einer stammt aus der Substitution $u = rR$.'], a:0, ex:'$\\langle r\\rangle = \\int r\\,|\\psi|^2d^3r$; der Winkelteil gibt 1, übrig bleibt $\\int r\\cdot|R|^2\\cdot r^2dr$.'}},
          {l:'= 1/(2a_0^3) ∫_0^∞ r^3 (1 - r/(2a_0))^2 e^(-r/a_0) dr', w:'|R₂₀|² eingesetzt'},
          {l:'= 1/(2a_0^3) ∫_0^∞ (r^3 - r^4/a_0 + r^5/(4a_0^2)) e^(-r/a_0) dr', w:'ausmultipliziert'},
          {l:'= 1/(2a_0^3) (3! a_0^4 - 4! a_0^4 + 5! a_0^4/4)', w:'Fakultätsintegrale',
            why:{q:'Welche Formel steckt hier?', opts:['$\\int_0^\\infty r^ke^{-r/a_0}dr = k!\\,a_0^{k+1}$', '$\\int_0^\\infty r^ke^{-r/a_0}dr = a_0^{k+1}/k!$', '$\\int_0^\\infty r^ke^{-r/a_0}dr = k\\,a_0^{k}$'], a:0, ex:'Das ist $n!/\\alpha^{n+1}$ mit $\\alpha = 1/a_0$.'}},
          {l:'= 6 a_0', w:'zusammengefasst: (6 − 24 + 30)/2',
            why:{q:'Passt das zur allgemeinen Formel?', opts:['Ja: $\\frac{a_0}{2}(3\\cdot4 - 0) = 6a_0$.', 'Nein, $2s$ müsste $4a_0$ haben.', 'Nein, $2s$ müsste $5a_0$ haben.'], a:0, ex:'$4a_0$ ist der wahrscheinlichste Abstand für $2p$, $5a_0$ der Mittelwert für $2p$.'}}
        ]},
        q:{q:R`Wie groß ist $\langle r\rangle$ im Zustand $2p$?`,
          opts:[R`$4\,a_0$`, R`$5\,a_0$`, R`$6\,a_0$`], a:1,
          ex:R`$\frac{a_0}{2}\left[3\cdot4 - 1\cdot2\right] = 5\,a_0$.`,
          fb:[R`$4\,a_0$ ist der wahrscheinlichste Abstand, das Maximum von $P(r)$. Der Mittelwert liegt weiter außen.`, '',
            R`$6\,a_0$ gilt für $2s$. Bei $2p$ zieht der Term $-l(l+1)$ den Mittelwert nach innen.`]}},
      {id:'h-t5e', title:'Das Labor lesen',
        num:{title:R`$2p$`, text:R`$P_{21} \propto r^4e^{-r/a_0}$. Aus $\frac{d}{dr}\left(r^4e^{-r/a_0}\right) = \left(4r^3 - \frac{r^4}{a_0}\right)e^{-r/a_0} = 0$ folgt das Maximum bei

$$r = 4\,a_0,$$

der Mittelwert liegt bei $\langle r\rangle = 5\,a_0$. Die rote Linie steht also rechts vom Gipfel.`},
        text:R`Im Labor siehst du $P(r)$ für $n \le 4$. Die waagerechte Achse ist $r$ in Einheiten von $a_0$, die senkrechte $r^2|R_{nl}|^2$. Die blaue Kurve ist $P(r)$, die rote gestrichelte Linie $\langle r\rangle$ aus der Formel. Die Anzeige darunter nennt $E_n$, $\langle r\rangle$ und die Zahl der radialen Knoten. Achte darauf, wie die Verteilung mit $n$ nach außen wandert: Die Größe des Atoms wächst wie $n^2$. Für $l = n - 1$ gibt es genau einen Buckel, mit dem Maximum bei $n^2a_0$.`,
        fig:{lab:'hydrogen', init:{n:2, l:1}, caption:R`Radiale Aufenthaltswahrscheinlichkeit $P(r) = r^2|R_{nl}|^2$, Längen in $a_0$; die rote Linie ist $\langle r\rangle$. Für $2p$ liegt das Maximum bei $4\,a_0$, $\langle r\rangle$ bei $5\,a_0$. Vergleiche mit $1s$ und $2s$.`},
        q:{q:R`Du stellst im Labor $n = 3$, $l = 2$ ein. Wo liegt das Maximum der Kurve?`, tr:{from:'labor', to:'formel'},
          opts:[R`bei $10{,}5\,a_0$, wo die rote Linie steht`, R`bei $3\,a_0$`, R`bei $9\,a_0$`], a:2,
          ex:R`Für $l = n - 1$ ist $P \propto r^{2n}e^{-2r/(na_0)}$ mit dem Maximum bei $n^2a_0 = 9\,a_0$. Die rote Linie $\langle r\rangle = 10{,}5\,a_0$ liegt rechts davon.`,
          fb:[R`$10{,}5\,a_0$ ist der Mittelwert $\langle r\rangle$. Wegen des Ausläufers nach außen liegt er rechts vom Maximum.`,
            R`Die Größe wächst wie $n^2$, nicht wie $n$.`, '']}},
      {id:'h-t5f', title:'Typischer Fehler: Bahnen statt Verteilungen',
        num:{title:R`$3d$ und das Bohrsche Modell`, text:R`Für $l = n - 1 = 2$ liegt das Maximum von $P(r)$ bei $n^2a_0 = 9\,a_0$, genau an Bohrs Radius für $n = 3$. Der Drehimpuls passt nicht:

$$\text{Bohr: } 3\hbar,\qquad \text{Quantenmechanik: } \hbar\sqrt{2\cdot3} = \sqrt6\,\hbar \approx 2{,}45\,\hbar.$$`},
        text:R`Das Elektron läuft nicht auf einer Bahn. In einem stationären Zustand ist $|\psi|^2$ zeitlich konstant; es gibt keine Bewegung, die man verfolgen könnte. $P(r)$ sagt nur, wie oft bei vielen Ortsmessungen welcher Abstand vorkommt. Für $l = n - 1$ liegt das Maximum von $P(r)$ an Bohrs Radius $n^2a_0$. Für die Lage stimmt das alte Modell also, für den Drehimpuls nicht. Und für $l < n - 1$ gibt es mehrere Buckel, die das Bohrsche Modell gar nicht kennt.`,
        q:{q:R`Was stimmt für den Zustand $3d$?`,
          opts:[R`Das Elektron läuft auf einem Kreis mit dem Radius $9\,a_0$.`, R`Der wahrscheinlichste Abstand ist $9\,a_0$, und $|\vec L| = \sqrt6\,\hbar$.`, R`Der wahrscheinlichste Abstand ist $\langle r\rangle = 10{,}5\,a_0$.`], a:1,
          ex:R`$P(r)$ hat sein Maximum bei $9\,a_0$. Der Drehimpuls ist $\hbar\sqrt{l(l+1)} = \sqrt6\,\hbar$, nicht Bohrs $3\hbar$.`,
          fb:[R`Es gibt keine Bahn, nur eine zeitlich konstante Verteilung der Abstände.`, '',
            R`$\langle r\rangle$ ist der Mittelwert. Wahrscheinlichster Abstand und Mittelwert sind verschieden.`]}}
    ]},

    /* ===== Abschnitt 6: Spektrallinien ===== */
    {id:'h-t6', title:'Spektrallinien', steps:[
      {id:'h-t6a', title:'Eine Linie gehört zu zwei Niveaus',
        num:{title:R`$H_\alpha$`, text:R`Übergang $n = 3 \to 2$:

$$E_3 - E_2 = 13{,}6\,\mathrm{eV}\left(\frac14 - \frac19\right) = 13{,}6\,\mathrm{eV}\cdot\frac{5}{36} \approx 1{,}89\,\mathrm{eV}.$$

Mit $\lambda = hc/\Delta E$ und $hc \approx 1240\,\mathrm{eV\,nm}$ folgt $\lambda \approx 656\,\mathrm{nm}$: die rote Linie.`},
        text:R`Ein Atom kann von einem Niveau $E_{n_o}$ in ein tieferes $E_{n_u}$ übergehen und dabei ein Photon aussenden. Wegen der Energieerhaltung gilt

$$h\nu = E_{n_o} - E_{n_u} = \frac{\hbar^2}{2ma_0^2}\left(\frac{1}{n_u^2} - \frac{1}{n_o^2}\right).$$

Die Frequenz gehört also zu einem **Paar** von Niveaus, nicht zu einem Niveau. Mit $\lambda = c/\nu$ erhältst du die Rydberg-Formel $1/\lambda = R\,(1/n_u^2 - 1/n_o^2)$. Mit der Elektronenmasse ist $R_\infty \approx 1{,}0974\cdot10^7\,\mathrm m^{-1}$; mit der reduzierten Masse ist $R_H$ um $0{,}05\,\%$ kleiner.`,
        q:{q:R`Welcher Übergang liefert die Linie $H_\alpha$?`,
          opts:[R`$n = 2 \to n = 1$`, R`$n = 3 \to n = 2$`, R`$n = 3 \to n = 1$`], a:1,
          ex:R`$H_\alpha$ ist die erste Linie der Balmer-Serie, die bei $n_u = 2$ endet; sie kommt von $n_o = 3$.`,
          fb:[R`$2 \to 1$ ist Lyman-α mit $10{,}2\,\mathrm{eV}$, im Ultravioletten.`, '',
            R`$3 \to 1$ hat $12{,}1\,\mathrm{eV}$ und liegt bei $103\,\mathrm{nm}$, weit im Ultravioletten.`]}},
      {id:'h-t6b', title:'Serien',
        num:{title:'Lyman-α und Paschen-α', text:R`Lyman-α ($2 \to 1$): $13{,}6\,\mathrm{eV}\cdot\tfrac34 = 10{,}2\,\mathrm{eV}$, also $122\,\mathrm{nm}$. Paschen-α ($4 \to 3$):

$$13{,}6\,\mathrm{eV}\left(\frac19 - \frac{1}{16}\right) \approx 0{,}661\,\mathrm{eV},\qquad \lambda \approx 1875\,\mathrm{nm}.$$`},
        text:R`Alle Linien mit demselben unteren Niveau bilden eine [[lex:h-spektralserien|Serie]]:

- Lyman ($n_u = 1$): ultraviolett, ab $122\,\mathrm{nm}$,
- Balmer ($n_u = 2$): sichtbar, $H_\alpha = 656\,\mathrm{nm}$ (rot), $H_\beta = 486\,\mathrm{nm}$, $H_\gamma = 434\,\mathrm{nm}$, …
- Paschen ($n_u = 3$): infrarot, ab $1875\,\mathrm{nm}$.

Innerhalb jeder Serie rücken die Linien zur Seriengrenze $1/\lambda = R/n_u^2$ zusammen, weil die Niveaus nach oben immer dichter liegen. Das ist die Auflösung der Vorhersage vom Anfang. Photonen oberhalb der Grenze können das Atom ionisieren; dann ist das Spektrum kontinuierlich.`,
        derive:{ctx:HRAD({defs:HDEFS}), lines:[
          {l:'E_4 - E_2 = -ħ^2/(2m a_0^2) (1/16 - 1/4)', w:'Energie des Übergangs 4 → 2',
            why:{q:'Warum ist diese Differenz positiv?', opts:['Weil $E_4$ näher an null liegt, also höher.', 'Weil $|E_4| > |E_2|$ ist, der Betrag also größer.', 'Weil alle Energien im Atom positiv sind.'], a:0, ex:'Beide sind negativ; $-\\frac{1}{16}$ ist größer als $-\\frac14$. Das Photon trägt die Differenz.'}},
          {l:'= 3/16 · ħ^2/(2m a_0^2)', w:'Klammer ausgerechnet',
            why:{q:'Welche Linie ist das?', opts:['$\\tfrac{3}{16}\\cdot13{,}6\\,\\mathrm{eV} \\approx 2{,}55\\,\\mathrm{eV}$: $H_\\beta$ bei $486\\,\\mathrm{nm}$', '$\\tfrac{3}{16}\\cdot13{,}6\\,\\mathrm{eV} \\approx 1{,}89\\,\\mathrm{eV}$: $H_\\alpha$ bei $656\\,\\mathrm{nm}$', '$\\tfrac{3}{16}\\cdot13{,}6\\,\\mathrm{eV} \\approx 10{,}2\\,\\mathrm{eV}$: Lyman-α bei $122\\,\\mathrm{nm}$'], a:0, ex:'$\\lambda = hc/E \\approx 1240\\,\\mathrm{eV\\,nm}/2{,}55\\,\\mathrm{eV} \\approx 486\\,\\mathrm{nm}$.'}},
          {l:'0 - E_2 = 1/4 · ħ^2/(2m a_0^2)', w:'Übergang von der Ionisierungsgrenze',
            why:{q:'Was bedeutet diese Energie?', opts:['die Seriengrenze der Balmer-Serie, $3{,}4\\,\\mathrm{eV}$', 'die Energie $E_2$ des Zustands $n = 2$ selbst', 'die Photonenenergie der roten Linie $H_\\alpha$'], a:0, ex:'Übergang von $E = 0$ (Ionisierungsgrenze) nach $n = 2$: $\\lambda \\approx 365\\,\\mathrm{nm}$.'}}
        ]},
        q:{q:R`Wo liegt die Seriengrenze der Lyman-Serie?`,
          opts:[R`bei $122\,\mathrm{nm}$`, R`bei $365\,\mathrm{nm}$`, R`bei $91{,}2\,\mathrm{nm}$`], a:2,
          ex:R`Grenze heißt $n_o \to \infty$: $\Delta E = 13{,}6\,\mathrm{eV}$, also $\lambda \approx 1240/13{,}6\,\mathrm{nm} \approx 91{,}2\,\mathrm{nm}$.`,
          fb:[R`$122\,\mathrm{nm}$ ist die erste Lyman-Linie, $2 \to 1$. Die Grenze liegt bei kürzeren Wellenlängen.`,
            R`$365\,\mathrm{nm}$ ist die Grenze der Balmer-Serie mit $n_u = 2$.`, '']}},
      {id:'h-t6c', title:'Die Balmer-Serie: Formel, Graph, Spektrum',
        num:{title:R`$H_\beta$`, text:R`Übergang $4 \to 2$:

$$13{,}6\,\mathrm{eV}\left(\frac14 - \frac{1}{16}\right) = 2{,}55\,\mathrm{eV},\qquad \lambda \approx \frac{1240\,\mathrm{eV\,nm}}{2{,}55\,\mathrm{eV}} \approx 486\,\mathrm{nm}.$$

Das ist die blaugrüne Linie.`},
        text:R`Die Balmer-Serie ist die einzige Serie mit Linien im Sichtbaren. An ihr übersetzt du zwischen Formel, Graph und Spektrometer. Die Formel liefert für jedes obere Niveau eine Wellenlänge. Der Graph zeigt, wie diese Wellenlängen mit $n_o$ kleiner werden und sich an der Grenze häufen. Im Spektrometer siehst du dieselben Werte als einzelne, immer dichter stehende Linien. Kennst du eine gemessene Wellenlänge, kannst du rückwärts das obere Niveau bestimmen.`,
        reps:{obj:'Die Balmer-Serie',
          rows:[
            {k:'worte', text:R`Alle Linien, die im Niveau $n = 2$ enden; vier davon sichtbar, der Rest im nahen Ultraviolett.`},
            {k:'formel', tex:R`\frac{1}{\lambda} = R_H\left(\frac14 - \frac{1}{n_o^2}\right),\qquad n_o = 3, 4, 5, \dots,\qquad R_H \approx 1{,}0968\cdot10^7\,\mathrm m^{-1}`},
            {k:'graph', plot:{x:[3, 12], y:[340, 680], abs:true, yticks:[{y:365, lab:'365'}, {y:410, lab:'410'}, {y:486, lab:'486'}, {y:656, lab:'656'}], xlab:'n_o', ylab:R`\lambda/\text{nm}`, ticks:H_SK.ticks(1, 12)}, f:n => 1e9 / (1.09678e7 * (0.25 - 1 / (n * n))), lab:R`\lambda(n_o)`, f2:n => 364.6, lab2:R`\text{Grenze}`,
              cap:R`Wellenlänge über dem oberen Niveau $n_o$. Nur ganze $n_o$ geben Linien. Die Werte fallen von $656\,\mathrm{nm}$ und nähern sich der Grenze $365\,\mathrm{nm}$ (gestrichelt).`},
            {k:'physik', text:R`Im Spektrometer: $656$, $486$, $434$, $410\,\mathrm{nm}$ im Sichtbaren, dann immer dichter bis zur Kante bei $365\,\mathrm{nm}$.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Endet in $n = 2$“ heißt $n_u = 2$ einsetzen; das obere Niveau $n_o$ läuft über alle ganzen Zahlen ab $3$.`},
            {from:'formel', to:'graph', rule:R`$\lambda$ für jedes ganze $n_o$ ausrechnen und auftragen; für $n_o \to \infty$ strebt $\lambda$ gegen $4/R_H$.`},
            {from:'graph', to:'physik', rule:R`Jeder Punkt bei ganzem $n_o$ ist eine Linie im Spektrometer. Wo die Punkte zusammenrücken, häufen sich die Linien vor der Grenze.`}
          ]},
        q:{q:R`Welche Wellenlänge hat die Balmer-Linie mit $n_o = 6$?`, tr:{from:'formel', to:'physik'},
          opts:[R`$434\,\mathrm{nm}$`, R`$410\,\mathrm{nm}$`, R`$397\,\mathrm{nm}$`], a:1,
          ex:R`$1/\lambda = R_H\left(\tfrac14 - \tfrac{1}{36}\right) = R_H\cdot\tfrac29$, also $\lambda = \tfrac{9}{2R_H} \approx 410\,\mathrm{nm}$.`,
          fb:[R`$434\,\mathrm{nm}$ gehört zu $n_o = 5$.`, '',
            R`$397\,\mathrm{nm}$ gehört zu $n_o = 7$.`]}},
      {id:'h-t6d', title:R`Auswahlregel: $\Delta l = \pm1$`,
        num:{title:'Erlaubt oder verboten?', text:R`$2p \to 1s$: $\Delta l = -1$, erlaubt; das ist Lyman-α. $2s \to 1s$: $\Delta l = 0$, verboten. $3d \to 2p$ ist erlaubt, $3d \to 2s$ mit

$$\Delta l = -2$$

verboten. $H_\alpha$ setzt sich aus $3s \to 2p$, $3p \to 2s$ und $3d \to 2p$ zusammen, alle mit $1{,}89\,\mathrm{eV}$.`},
        text:R`Nicht jedes Paar von Zuständen liefert eine Linie. Das Licht koppelt an das Dipolmoment $-e\vec r$. Ein Übergang braucht deshalb ein von null verschiedenes Matrixelement $\langle n'l'm'|\vec r|nlm\rangle$. Weil $\vec r$ die Parität umkehrt und sich unter Drehungen wie ein Drehimpuls 1 verhält, muss $\Delta l = \pm1$ sein, und $\Delta m = 0, \pm1$. Ein $2s$-Zustand kann deshalb nicht durch Dipolstrahlung in $1s$ übergehen und lebt vergleichsweise lange. Für die Lage der Linien spielt die Regel beim Wasserstoff keine Rolle, weil $E$ nur von $n$ abhängt.`,
        q:{q:R`Warum geht $2s$ nicht durch Dipolstrahlung in $1s$ über, obwohl $E_2 > E_1$ ist?`,
          opts:[R`Die Energiedifferenz ist dafür zu klein.`, R`$2s$ und $1s$ haben dieselbe Energie.`, R`Die Auswahlregel verlangt $\Delta l = \pm1$.`], a:2,
          ex:R`Beide haben $l = 0$. Das Dipolmatrixelement $\langle 1,0,0|\vec r|2,0,0\rangle$ ist null.`,
          fb:[R`$10{,}2\,\mathrm{eV}$ ist genug; $2p \to 1s$ mit derselben Energie ist erlaubt.`,
            R`$E_2 = -3{,}40\,\mathrm{eV}$ und $E_1 = -13{,}6\,\mathrm{eV}$ sind verschieden. Es liegt am Drehimpuls.`, '']}},
      {id:'h-t6e', title:'Was das Modell auslässt',
        num:{title:R`Feinstruktur bei $n = 2$`, text:R`Bei sehr genauer Messung spaltet das Niveau $n = 2$ in zwei Niveaus auf, die etwa $4{,}5\cdot10^{-5}\,\mathrm{eV}$ auseinanderliegen. Gegen den Abstand

$$E_2 - E_1 = 10{,}2\,\mathrm{eV}$$

ist das ein Anteil von etwa $4\cdot10^{-6}$. Sichtbar wird es nur mit sehr guten Spektrometern.`},
        text:R`Genaue Messungen zeigen, dass jede Linie aus mehreren dicht benachbarten Komponenten besteht. Ursachen sind relativistische Korrekturen und ein eigenes magnetisches Moment des Elektrons (Feinstruktur), das magnetische Moment des Kerns (Hyperfeinstruktur) und die Lamb-Verschiebung. Sie sind um Größenordnungen kleiner als die Abstände der $E_n$. Die Hyperfeinstruktur des Grundzustands ist die $21$-cm-Linie der Radioastronomie. **Ausblick:** Das Moment des Elektrons gehört zu seinem Spin (Thema 10). Feinstruktur und Hyperfeinstruktur berechnet man als kleine Korrekturen zu $E_n$; das Werkzeug dafür, die Störungstheorie, folgt in Thema 11. Die Lamb-Verschiebung erklärt erst die Quantenelektrodynamik.`,
        q:{q:R`Warum darf man die Feinstruktur als kleine Korrektur zu den Niveaus $E_n$ behandeln?`,
          opts:[R`Sie ist für s-Zustände genau null.`, R`Sie ist um viele Größenordnungen kleiner als die Abstände der $E_n$.`, R`Sie hängt nicht von $n$ ab und verschiebt alle Niveaus gleich.`], a:1,
          ex:R`$4{,}5\cdot10^{-5}\,\mathrm{eV}$ gegen $10{,}2\,\mathrm{eV}$: Die Struktur der Niveaus bleibt erhalten, sie wird nur fein aufgespalten.`,
          fb:[R`Auch s-Zustände sind relativistisch verschoben. Entscheidend ist die Größe, nicht ein Verschwinden.`, '',
            R`Sie hängt von $n$ und vom Drehimpuls ab und spaltet Niveaus auf. Klein ist sie trotzdem.`]}}
    ]}
  ],
  check:[
    {q:'In Kugelkoordinaten ist das Volumenelement $d^3r$ gleich …', opts:['$r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$', '$dr\\,d\\theta\\,d\\varphi$', '$r\\,dr\\,d\\theta\\,d\\varphi$'], a:0, ex:'Die Kugelschale hat die Fläche $4\\pi r^2$; deshalb steckt $r^2$ im Maß, $\\sin\\theta$ kommt von den Breitenkreisen.', lex:'kugelkoordinaten'},
    {q:'Für die Kugelflächenfunktionen gilt $\\hat L^2Y_l^m = \\dots$', opts:['$\\hbar^2l(l+1)\\,Y_l^m$', '$\\hbar l\\,Y_l^m$', '$\\hbar^2l^2\\,Y_l^m$'], a:0, ex:'Eigenwert $\\hbar^2l(l+1)$, und $\\hat L_zY_l^m = \\hbar m\\,Y_l^m$.', prev:'dreh'},
    {q:'$\\int_0^\\infty r^2e^{-2r/a}\\,dr$ ist …', opts:['$a^3/4$', '$a^2/2$', '$2a^3$'], a:0, ex:'$n!/k^{n+1}$ mit $n = 2$, $k = 2/a$: $2/(8/a^3) = a^3/4$.', lex:'integrale'},
    {q:'Ein normierter Zustand $\\psi(r)$ hängt nur von $r$ ab. Die Wahrscheinlichkeit für einen Abstand zwischen $r$ und $r + dr$ ist …', opts:['$4\\pi r^2|\\psi(r)|^2\\,dr$', '$|\\psi(r)|^2\\,dr$', '$4\\pi|\\psi(r)|^2\\,dr$'], a:0, ex:'Man integriert $|\\psi|^2$ über die Kugelschale mit Volumen $4\\pi r^2dr$.', prev:'wf'}
  ],
  example:{
    title:'Radialfunktion des Grundzustands normieren',
    text:'Für $n = 1$, $l = 0$ ist $R(r) = A\\,e^{-r/a_0}$. Bestimme $A > 0$ so, dass $\\int_0^\\infty|R|^2r^2dr = 1$ (die Kugelflächenfunktion ist für sich normiert).',
    ctx:HRAD({defs:{'R(r)':'A e^(-r/a_0)'}, unknowns:{A:{ref:'2/a_0^(3/2)'}}}),
    lines:[
      {l:'∫_0^∞ |R(r)|^2 r^2 dr = 1', why:{q:'Warum steht $r^2$ im Integral?', opts:['Es kommt aus dem Volumenelement $d^3r = r^2dr\\,d\\Omega$.', 'Es kommt aus $|R|^2$, weil $R \\propto 1/r$ ist.', 'Es ist der Zentrifugalterm $l(l+1)/r^2$, umgestellt.'], a:0, ex:'$\\int|\\psi|^2d^3r = \\int_0^\\infty|R|^2r^2dr\\cdot\\int|Y_l^m|^2d\\Omega$, und der Winkelteil ist für sich schon 1.'}},
      {l:'|A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1', why:{q:'Woher kommt $e^{-2r/a_0}$?', opts:['$|e^{-r/a_0}|^2 = e^{-2r/a_0}$', 'Aus der Ableitung von $R$.', 'Aus dem Maß $r^2$.'], a:0, ex:'Beim Quadrieren verdoppelt sich der Exponent.'}},
      {l:'|A|^2 · 2!/(2/a_0)^3 = 1', why:{q:'Welche Formel steckt hier?', opts:['$\\int_0^\\infty r^ne^{-kr}dr = n!/k^{n+1}$ mit $n = 2$, $k = 2/a_0$', 'partielle Integration ohne Randterm', '$\\int_0^\\infty e^{-kr}dr = k$'], a:0, ex:'Die Formel folgt aus der Gammafunktion $\\Gamma(n+1) = n!$.'}},
      {l:'|A|^2 a_0^3/4 = 1', why:{q:'Stimmt die Vereinfachung?', opts:['Ja: $2/(8/a_0^3) = a_0^3/4$.', 'Nein, es müsste $a_0^3/8$ heißen.', 'Nein, es müsste $a_0^2/4$ heißen.'], a:0, ex:'$(2/a_0)^3 = 8/a_0^3$, und $2 : 8/a_0^3 = a_0^3/4$.'}},
      {l:'A = 2/a_0^(3/2)', w:'Phase frei: A > 0', why:{q:'Welche Einheit hat $A$, und passt das?', opts:['$\\text{Länge}^{-3/2}$, passend zu $1/\\text{Volumen}$', 'dimensionslos, weil $R$ normiert ist', '$\\text{Länge}^{-1/2}$ wie in einer Dimension'], a:0, ex:'$R^2r^2dr$ ist dimensionslos, also hat $R$ die Einheit $\\text{Länge}^{-3/2}$; in 3D hat $|\\psi|^2$ die Einheit $1/\\text{Volumen}$.'}}
    ],
    faded:{id:'h-fade', title:'Jetzt du: $R(r) = A\\,r\\,e^{-r/(2a_0)}$ (Zustand 2p)', text:'Bestimme $A > 0$ mit $\\int_0^\\infty|R|^2r^2dr = 1$.',
      ctx:HRAD({defs:{'R(r)':'A r e^(-r/(2a_0))'}, unknowns:{A:{ref:'1/sqrt(24 a_0^5)'}}}),
      given:['∫_0^∞ |R(r)|^2 r^2 dr = 1', '|A|^2 ∫_0^∞ r^4 e^(-r/a_0) dr = 1'],
      goals:[{id:'a', prompt:'Bestimme $A$.', type:'solve', unknown:'A', hints:['Strategie: Das Integral ist von der Form $\\int_0^\\infty r^ne^{-kr}dr$ – welche $n$ und $k$?', '$n = 4$, $k = 1/a_0$ in $n!/k^{n+1}$.', '$4!\\,a_0^5 = 24a_0^5$; dann nach $A$ auflösen.'],
        model:['∫_0^∞ |R(r)|^2 r^2 dr = 1', '|A|^2 ∫_0^∞ r^4 e^(-r/a_0) dr = 1', {l:'|A|^2 · 4! a_0^5 = 1', gap:'|A|^2 · ▢ = 1'}, 'A = 1/sqrt(24 a_0^5)']}]}
  },
  puzzle:{
    title:'Wie oft ist das Elektron im verbotenen Bereich?',
    text:'Klassisch könnte sich ein Elektron mit der Energie $E_1 = -\\frac{\\hbar^2}{2ma_0^2}$ nur dort aufhalten, wo $V(r) \\le E_1$ ist, also innerhalb eines Umkehrradius $r_{\\text{kl}}$. Beim Oszillator lag im Grundzustand etwa 16 % der Wahrscheinlichkeit jenseits der Umkehrpunkte (Thema 7).\n\nBestimme $r_{\\text{kl}}$ und schätze ab, welcher Anteil im Grundzustand des Wasserstoffs weiter draußen liegt.',
    q:{q:'Deine Vermutung:', opts:['etwa 24 %', 'genau 0 %', 'etwa 50 %', 'etwa 2 %'], a:0, ex:'Es sind $13e^{-4} \\approx 0{,}24$.'},
    reveal:'Aus $-\\frac{\\hbar^2}{ma_0r} = -\\frac{\\hbar^2}{2ma_0^2}$ folgt $r_{\\text{kl}} = 2a_0$. Mit $P(r) = \\frac{4}{a_0^3}r^2e^{-2r/a_0}$ und $x = 2r/a_0$ ist\n\n$$P(r > 2a_0) = \\frac12\\int_4^\\infty x^2e^{-x}\\,dx = \\frac12e^{-4}(16 + 8 + 2) = 13e^{-4} \\approx 0{,}24.$$\n\nFast ein Viertel der Wahrscheinlichkeit liegt im klassisch verbotenen Bereich – mehr als beim Oszillator, weil das Coulombpotential nach außen nur langsam ansteigt. Wie dort ist das kein Widerspruch: Ort und kinetische Energie sind nicht zugleich scharf, und eine Ortsmessung findet nie eine negative kinetische Energie.'
  },
  clarify:{
    core:'Im Coulombpotential $V(r) = -\\frac{e^2}{4\\pi\\varepsilon_0 r} = -\\frac{\\hbar^2}{ma_0r}$ trennt man $\\psi_{nlm} = R_{nl}(r)\\,Y_l^m(\\theta,\\varphi)$. Mit $u(r) = rR(r)$ wird die Radialgleichung eindimensional:\n\n$$-\\frac{\\hbar^2}{2m}u\'\' + \\left[V(r) + \\frac{\\hbar^2l(l+1)}{2mr^2}\\right]u = Eu,\\qquad u(0) = 0.$$\n\nGebundene Lösungen gibt es nur für $E_n = -\\frac{\\hbar^2}{2ma_0^2n^2} \\approx -\\frac{13{,}6\\,\\mathrm{eV}}{n^2}$ mit $n = 1, 2, \\dots$, $l = 0, \\dots, n-1$, $m = -l, \\dots, l$. Die Energie hängt nur von $n$ ab: $n^2$ Zustände (ohne Spin). Spektrallinien gehören zu Energiedifferenzen $E_{n_o} - E_{n_u}$.',
    keys:[
      'Normierung und Erwartungswerte radial immer mit $r^2\\,dr$: $\\int_0^\\infty|R_{nl}|^2r^2dr = 1$.',
      'Das Zentrifugalglied $\\hbar^2l(l+1)/(2mr^2)$ hält Zustände mit $l > 0$ vom Kern fern: $R_{nl}\\propto r^l$ für kleine $r$.',
      'Radiale Knoten: $n - l - 1$. Der Zustand mit $l = n-1$ hat keinen.',
      'Bohrscher Radius $a_0 = \\frac{4\\pi\\varepsilon_0\\hbar^2}{me^2} \\approx 0{,}529\\,\\text{Å}$; Grundzustand: $\\langle r\\rangle = \\tfrac32a_0$, wahrscheinlichster Abstand $a_0$.',
      'Virialsatz für $V\\propto 1/r$: $\\langle V\\rangle = 2E_n$ und $\\langle T\\rangle = -E_n$.',
      'Rydberg-Formel $1/\\lambda = R(1/n_u^2 - 1/n_o^2)$; Dipolübergänge nur mit $\\Delta l = \\pm1$.'
    ],
    errors:[
      '$r^2$ im Maß vergessen – dann ist schon die Normierung falsch.',
      'Den Ort größter Dichte ($r = 0$) mit dem wahrscheinlichsten Abstand ($r = a_0$) verwechseln.',
      '$l = n$ zulassen: Für $n = 1$ gibt es nur $l = 0$.',
      'Vorzeichen der Energie: Gebundene Zustände haben $E_n < 0$, höhere $n$ liegen näher an $0$.',
      'Das Elektron auf einer Bohrschen Bahn mit $L = n\\hbar$ denken: Im Grundzustand ist $L = 0$.'
    ],
    more:[{title:'Mitbewegter Kern', text:'Mit der reduzierten Masse $\\mu = m_em_p/(m_e+m_p)$ statt $m_e$ verschieben sich alle Energien um etwa $0{,}05\\,\\%$: $13{,}598\\,\\mathrm{eV}$ statt $13{,}606\\,\\mathrm{eV}$. In diesem Tutorial steht $m$ für die Masse in der Radialgleichung.'}],
    checks:[
      {q:'Wie viele Zustände (ohne Spin) gehören zu $n = 2$?', opts:['$4$', '$2$', '$3$'], a:0, ex:'$l = 0$ (ein Zustand) und $l = 1$ (drei Zustände): $n^2 = 4$.'},
      {q:'Für welchen Zustand ist $R_{nl}(0) \\ne 0$?', opts:['nur für $l = 0$', 'für alle $l$', 'nur für $l = n-1$'], a:0, ex:'$R_{nl}\\propto r^l$ nahe $r = 0$. Nur s-Zustände haben eine endliche Dichte am Kern.'}
    ]
  },
  lab:{type:'hydrogen', title:'Radiale Aufenthaltswahrscheinlichkeit',
    text:'Das Bild zeigt $P(r) = r^2|R_{nl}(r)|^2$ (Längen in $a_0$). Die rote Linie ist $\\langle r\\rangle$. Wähle $n$ und $l$.',
    map:[
      {sym:'n', ctl:'n', says:R`Hauptquantenzahl $n = 1, \dots, 4$. Sie legt die Energie $E_n = -13{,}6\,\mathrm{eV}/n^2$ fest und die Größe: Das äußere Maximum liegt in der Größenordnung von $n^2a_0$.`},
      {sym:'l', ctl:'l', says:R`Drehimpulsquantenzahl $l = 0, \dots, n-1$. Sie bestimmt das Zentrifugalglied in der Radialgleichung, das Verhalten $P \propto r^{2l+2}$ am Kern und mit $n$ die Knotenzahl $n - l - 1$.`},
      {sym:'r/a_0', ctl:'r / a₀', says:R`Waagerechte Achse: der Abstand vom Kern in Bohrschen Radien. Eine Eins auf der Achse sind $0{,}529\cdot10^{-10}\,\mathrm m$.`},
      {sym:R`P(r) = r^2|R_{nl}(r)|^2`, ctl:'r²|R_nl|²', says:R`Senkrechte Achse und blaue Kurve: die radiale Dichte. Die Fläche unter der Kurve ist $1$; sie ist am Kern immer null, auch für $s$-Zustände.`},
      {sym:R`\langle r\rangle = \tfrac{a_0}{2}\left[3n^2 - l(l+1)\right]`, ctl:'⟨r⟩', says:R`Rote gestrichelte Linie: der Mittelwert des Abstands aus der Formel. Er liegt rechts vom höchsten Maximum, weil die Verteilung nach außen ausläuft.`},
      {sym:R`n - l - 1`, ctl:'radiale Knoten', says:R`Zahl der Nullstellen von $P(r)$ für $r > 0$, also die Zahl der Knotenkugeln. Sie ist der Grad des Polynoms $v$ aus der abbrechenden Reihe.`},
      {sym:R`E_n`, ctl:'(unendlich schwerer Kern)', says:R`Die Anzeige rechnet $E_n = -13{,}6\,\mathrm{eV}/n^2$ mit der Elektronenmasse, also ohne die Korrektur der reduzierten Masse um $0{,}05\,\%$.`}
    ],
    sketch:{id:'h-lab-s', title:'$P(r)$ für $n = 3$, $l = 1$ vorhersagen', kind:'curve', draw:'abs2',
      text:'Skizziere vor dem Labor die radiale Aufenthaltsdichte $P(r) = r^2|R_{31}|^2$ des Zustands $n = 3$, $l = 1$ (ein $3p$-Zustand). Überlege: Wie viele radiale Knoten gibt es, was passiert bei $r = 0$, und wie weit reicht die Verteilung? Die Höhe ist frei. Halte die Vorhersage fest, stell dann im Labor $n = 3$, $l = 1$ ein und vergleiche.',
      plot:{x:[0, 33], xlab:'r/a_0', ylab:'r^2|R_{31}|^2', ticks:H_SK.ticks(5, 30)},
      f:H_SK.P31,
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann eine Aufenthaltsdichte negativ sein? Welches Vorzeichen haben $r^2$ und $|R|^2$?'},
        {id:'null', name:'Wert am Kern', type:'zero', at:[0], msg:'Welchen Wert hat $P(r)$ am Kern?'},
        {id:'knoten', type:'nodes', n:1, msg:'Wie viele radiale Knoten hat der Zustand $n = 3$, $l = 1$? Deine Skizze hat {got}.'},
        {id:'max', name:'größtes Maximum außen', type:'maxat', x:12, tol:4.5, msg:'Liegt das größte Maximum innen oder außen? Wie wächst die Größe des Atoms mit $n$?'},
        {id:'aussen', name:'große Abstände', type:'decay', toward:'right', range:[18, 33], msg:'Was macht $P(r)$ weit draußen?'}
      ],
      reveal:'$R_{31} \\propto r\\,(6 - r/a_0)\\,e^{-r/(3a_0)}$ hat einen radialen Knoten ($n - l - 1 = 1$) bei $r = 6a_0$. Davor liegt ein kleines Maximum bei $3a_0$, dahinter das große bei $12a_0$, etwa 2,5-mal so hoch. Die Verteilung reicht bis etwa $25a_0$, denn die Größe des Atoms wächst wie $n^2$. Am Kern ist $P \\propto r^4$ null, wie bei jedem Zustand mit $l = 1$.',
      wrong:[
        {f:r => r ** 6 * Math.exp(-2 * r / 3), fails:['knoten'], why:'kein Knoten: Knotenzahl nicht mit $n - l - 1$ bestimmt (Form wie bei $3d$)'},
        {f:r => r * r * (6 - r) ** 2 * Math.exp(-2 * r / 3) * (r < 6 ? 30 : 1), fails:['max'], why:'inneres Maximum höher („das Elektron ist meist nahe am Kern“)'}
      ]},
    predict:{q:'Bevor du die Regler bewegst: Wo liegt das Maximum von $P(r)$ für $n = 3$, $l = 2$ ungefähr?', opts:['bei $9a_0$', 'bei $3a_0$', 'bei $r = 0$'], a:0, ex:'Für $l = n - 1$ ist $P \\propto r^{2n}e^{-2r/(na_0)}$ mit dem Maximum bei $n^2a_0$ – dem Bohrschen Radius. Bei $r = 0$ ist $P$ immer null.'},
    questions:[
      {q:'Stelle $n = 2$, $l = 1$ ein. Wo hat $P(r)$ sein Maximum?', opts:['bei $4a_0$', 'bei $2a_0$', 'bei $5a_0$'], a:0, ex:'$P\\propto r^4e^{-r/a_0}$ ist bei $r = 4a_0$ maximal. $\\langle r\\rangle = 5a_0$ liegt weiter außen.'},
      {q:'$n = 3$, $l = 0$: Wie viele Nullstellen hat $P(r)$ für $r > 0$?', opts:['$2$', '$3$', '$0$'], a:0, ex:'Radiale Knoten: $n - l - 1 = 2$.'}
    ],
    noPic:{q:'Ohne Bild: Wie viele radiale Knoten hat der Zustand $n = 4$, $l = 3$?', opts:['$0$', '$1$', '$3$'], a:0, ex:'$n - l - 1 = 0$. Zustände mit $l = n-1$ haben eine einzige Schale, wie im Bohrschen Modell.'}},
  compare:{
    text:'Gesucht ist $\\langle V\\rangle$ im Grundzustand $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$ mit $V(r) = -\\hbar^2/(ma_0r)$. Zwei richtige Wege:',
    ctx:HRAD({defs:HDEFS, state:'R_10'}),
    A:{name:'Integral ausrechnen', model:['⟨V⟩ = ∫_0^∞ V(r) |R_10(r)|^2 r^2 dr', '= -ħ^2/(m a_0) · 4/a_0^3 ∫_0^∞ r e^(-2r/a_0) dr', '= -ħ^2/(m a_0) · 4/a_0^3 · a_0^2/4', '= -ħ^2/(m a_0^2)']},
    B:{name:'Virialsatz', text:'Für $V\\propto 1/r$ gilt in stationären Zuständen $2\\langle T\\rangle = -\\langle V\\rangle$, also $E = \\langle T\\rangle + \\langle V\\rangle = \\tfrac12\\langle V\\rangle$.', model:['⟨V⟩ = 2 E_1', '= 2 · (-ħ^2/(2m a_0^2))', '= -ħ^2/(m a_0^2)']},
    questions:[
      {q:'Was braucht Weg B, was Weg A nicht braucht?', opts:['die Energie $E_1$ und den Virialsatz', 'die normierte Wellenfunktion', 'eine Ableitung von $R$'], a:0, ex:'Weg B kommt ohne Integral aus, setzt aber $E_1$ voraus. Weg A braucht nur $R_{10}$.'},
      {q:'Für welche Zustände liefert Weg B ebenso schnell $\\langle V\\rangle$?', opts:['für jeden Eigenzustand $\\psi_{nlm}$', 'nur für den Grundzustand', 'für jede Überlagerung'], a:0, ex:'Der Virialsatz gilt für jeden Eigenzustand von $\\hat H$: $\\langle V\\rangle = 2E_n$. Für Überlagerungen verschiedener $n$ kommen zeitabhängige Mischterme hinzu; dann gilt $\\langle V\\rangle = 2\\langle H\\rangle$ nur noch im Zeitmittel.'}
    ]
  },
  concept:[
    {id:'h-k1', type:'dialog', seg:'h-t5',
      text:'Ein Elektron ist im Grundzustand $\\psi_{100} = e^{-r/a_0}/\\sqrt{\\pi a_0^3}$.',
      people:[
        {name:'Lena', says:'Ein kleiner Würfel am Kern enthält das Elektron mit größerer Wahrscheinlichkeit als ein gleich großer Würfel im Abstand $a_0$.'},
        {name:'Jonas', says:'Der wahrscheinlichste Abstand vom Kern ist trotzdem $a_0$ und nicht null.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:2,
      ex:'Lena spricht über die Dichte $|\\psi|^2$ pro Volumen; sie ist am Kern maximal. Jonas spricht über $P(r) = 4\\pi r^2|\\psi|^2$, die Wahrscheinlichkeit pro Abstandsintervall; sie ist bei $a_0$ maximal, weil es dort viel mehr Volumen gibt.'},
    {id:'h-k2', type:'mc', seg:'h-t1',
      q:'Welchen Betrag des Bahndrehimpulses hat das Elektron im Grundzustand $1s$?', opts:['$0$', '$\\hbar$', '$\\sqrt2\\,\\hbar$', '$\\tfrac12\\hbar$'], a:0,
      ex:'$l = 0$, also $L^2 = \\hbar^2l(l+1) = 0$. Das Bohrsche Modell gab $L = \\hbar$; eine kreisende Bewegung gibt es im $1s$-Zustand nicht. (Die Zahl $\\tfrac12$ gehört zum Spin des Elektrons, Thema 10 – mit dem Bahndrehimpuls hat sie nichts zu tun.)'},
    {id:'h-k3', type:'mc2', seg:'h-t4', lex:'stationaer',
      q:'Ist $\\psi = \\frac{1}{\\sqrt2}(\\psi_{200} + \\psi_{211})$ ein stationärer Zustand?', opts:['Ja', 'Nein', 'nur für $t = 0$'], a:0,
      ex:'Ja: Beide Anteile gehören zu $E_2$. Die Summe ist Eigenfunktion von $\\hat H$, und $|\\psi(t)|^2$ ist zeitlich konstant. Anders bei $\\psi_{100} + \\psi_{210}$: Dort schwingt $|\\psi|^2$.',
      reason:{q:'Warum?', opts:['Beide Anteile haben dieselbe Energie; die Summe ist Eigenfunktion von $\\hat H$.', 'Eine Überlagerung verschiedener Orbitale ist nie stationär.', 'Verschiedene $l$ bedeuten verschiedene Energien.'], a:0,
        ex:'Wegen der Entartung bekommen beide Anteile denselben Phasenfaktor $e^{-iE_2t/\\hbar}$; er fällt aus $|\\psi|^2$ heraus.'}},
    {id:'h-k4', type:'mc', seg:'h-t4',
      q:'Zustand $\\frac{1}{\\sqrt2}(\\psi_{100} + \\psi_{210})$. Welche Ergebnisse kann eine Energiemessung liefern?', opts:['$E_1$ oder $E_2$, je mit $\\tfrac12$', 'immer den Mittelwert $\\tfrac12(E_1 + E_2)$', 'jeden Wert zwischen $E_1$ und $E_2$'], a:0,
      ex:'Messergebnisse sind Eigenwerte von $\\hat H$. Der Erwartungswert $\\tfrac12(E_1 + E_2) = \\tfrac58E_1$ ist ein Mittelwert über viele Messungen, kein mögliches Einzelergebnis.'},
    {id:'h-k5', type:'mc2', seg:'h-t6', lex:'h-spektralserien',
      q:'Ein Atom ist im Niveau $n = 3$ und sendet ein Photon aus. Welche Photonenenergien sind möglich?', opts:['$E_3 - E_2$ oder $E_3 - E_1$', 'nur $|E_3|$', 'jede Energie unter $|E_3|$'], a:0,
      ex:'Das Photon trägt die Differenz zwischen Anfangs- und Endniveau. Von $n = 3$ aus gibt es zwei tiefere Niveaus (je nach $l$ nicht von jedem Zustand aus beide).',
      reason:{q:'Warum?', opts:['Ein Photon trägt die Differenz zweier Niveaus.', 'Das Photon trägt die Energie des verlassenen Niveaus.', 'Die Energie wird kontinuierlich abgegeben.'], a:0,
        ex:'$|E_3|$ wäre die Ionisierungsenergie aus $n = 3$, nicht die Energie eines ausgesandten Photons. Welche Übergänge vorkommen, regelt zusätzlich $\\Delta l = \\pm1$: $3s$ und $3d$ gehen nur nach $2p$, $3p$ nach $2s$ oder $1s$.'}}
  ],
  practice:[
    {id:'h-p1', title:'Grundzustand in drei Dimensionen normieren',
      text:'$\\psi(r) = A\\,e^{-r/a_0}$ hängt nicht von $\\theta, \\varphi$ ab. Normiere mit $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$.',
      ctx:{coords:['r', 'θ', 'φ'], params:{a_0:'pos', m:'pos'}, defs:{'ψ(r)':'A e^(-r/a_0)'}, unknowns:{A:{ref:'1/sqrt(π a_0^3)', alt:['-1/sqrt(π a_0^3)']}}},
      goals:[{id:'a', prompt:'Bestimme $A > 0$.', type:'solve', unknown:'A', points:3, ph:'4π |A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1',
        hints:['Normieren heißt $\\int|\\psi|^2d^3r = 1$. Weil $\\psi$ nicht von den Winkeln abhängt, kannst du die Winkelintegrale sofort ausführen.', 'Regel: $\\int_0^\\pi\\sin\\theta\\,d\\theta\\int_0^{2\\pi}d\\varphi = 4\\pi$.', 'Nächster Schritt: $\\int_0^\\infty r^2e^{-2r/a_0}dr = a_0^3/4$.'],
        model:['∫_0^∞ ∫_0^π ∫_0^{2π} |ψ(r)|^2 r^2 sin(θ) dφ dθ dr = 1', {l:'4π |A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1', w:'Winkelintegral = 4π'}, '4π |A|^2 · a_0^3/4 = 1', 'A = 1/sqrt(π a_0^3)'],
        mistakes:[{expr:'2/a_0^(3/2)', msg:'Das ist die Normierung der Radialfunktion $R_{10}$ allein. Für $\\psi$ selbst fehlt der Winkelanteil $4\\pi$.'}]}]},
    {id:'h-p2', title:'Mittlerer Abstand und mittleres $1/r$',
      text:'Grundzustand: $R_{10}(r) = 2a_0^{-3/2}e^{-r/a_0}$.',
      ctx:HRAD({defs:HDEFS, state:'R_10'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle r\\rangle$.', type:'value', target:'3 a_0/2', points:2, ph:'⟨r⟩ = ∫_0^∞ r |R_10(r)|^2 r^2 dr',
          hints:['Erwartungswert mit dem Maß $r^2dr$: $\\langle r\\rangle = \\int_0^\\infty r\\,|R_{10}|^2r^2dr$.', 'Regel: $\\int_0^\\infty r^3e^{-kr}dr = 3!/k^4$.', 'Nächster Schritt: Der Integrand ist $\\frac{4}{a_0^3}r^3e^{-2r/a_0}$, also $k = 2/a_0$.'],
          model:['⟨r⟩ = ∫_0^∞ r |R_10(r)|^2 r^2 dr', '= 4/a_0^3 ∫_0^∞ r^3 e^(-2r/a_0) dr', '= 4/a_0^3 · 3!/(2/a_0)^4', '= 3/2 a_0'],
          mistakes:[{expr:'3/4 a_0', msg:'Prüfe den Vorfaktor: $|R_{10}|^2 = 4a_0^{-3}e^{-2r/a_0}$, und $3!/(2/a_0)^4 = 6a_0^4/16$.'}]},
        {id:'b', prompt:'b) Berechne $\\langle 1/r\\rangle$.', type:'value', target:'1/a_0', points:2, ph:'⟨1/r⟩ = ∫_0^∞ 1/r |R_10(r)|^2 r^2 dr',
          hints:['Wie in a), nur mit $1/r$ statt $r$ als Messgröße.', 'Regel: Vom Maß bleibt ein Faktor $r$; $\\int_0^\\infty re^{-2r/a_0}dr = a_0^2/4$.', 'Nächster Schritt: $\\frac{4}{a_0^3}\\cdot\\frac{a_0^2}{4}$.'],
          model:['⟨1/r⟩ = ∫_0^∞ 1/r |R_10(r)|^2 r^2 dr', '= 4/a_0^3 ∫_0^∞ r e^(-2r/a_0) dr', '= 4/a_0^3 · a_0^2/4', '= 1/a_0'], note:'Allgemein gilt $\\langle 1/r\\rangle = 1/(n^2a_0)$. Beachte $\\langle 1/r\\rangle \\ne 1/\\langle r\\rangle$.'}
      ]},
    {id:'h-p3', title:'Wahrscheinlichster Abstand',
      text:'Die radiale Aufenthaltswahrscheinlichkeit ist $P(r) = r^2|R_{nl}(r)|^2$. Für $1s$ ist $P \\propto r^2e^{-2r/a_0}$, für $2p$ ist $P\\propto r^4e^{-r/a_0}$. Nenne den gesuchten Abstand $r_m$ bzw. $r_p$.',
      ctx:HRAD({unknowns:{r_m:{ref:'a_0'}, r_p:{ref:'4 a_0'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme den wahrscheinlichsten Abstand $r_m$ im Zustand $1s$.', type:'solve', unknown:'r_m', points:2, ph:'d/dr (r^2 e^(-2r/a_0)) = …',
          hints:['Der wahrscheinlichste Abstand ist das Maximum von $P(r)$: Ableitung null setzen.', 'Regel: Produktregel für $r^2e^{-2r/a_0}$.', 'Nächster Schritt: Der Faktor $e^{-2r/a_0}$ ist nie null, und $r = 0$ ist ein Minimum.'],
          model:['d/dr (r^2 e^(-2r/a_0)) = (2r - 2r^2/a_0) e^(-2r/a_0)', '2 r_m - 2 r_m^2/a_0 = 0', 'r_m = a_0']},
        {id:'b', prompt:'b) Dasselbe für $2p$: Bestimme $r_p$.', type:'solve', unknown:'r_p', points:2, ph:'d/dr (r^4 e^(-r/a_0)) = …',
          hints:['Gleiches Vorgehen wie in a), jetzt mit $P\\propto r^4e^{-r/a_0}$.', 'Regel: $\\frac{d}{dr}(r^4e^{-r/a_0}) = (4r^3 - r^4/a_0)e^{-r/a_0}$.', 'Nächster Schritt: Teile durch $r_p^3e^{-r_p/a_0} \\ne 0$.'],
          model:['d/dr (r^4 e^(-r/a_0)) = (4r^3 - r^4/a_0) e^(-r/a_0)', '4 r_p^3 - r_p^4/a_0 = 0', 'r_p = 4 a_0'], note:'Das ist der Bohrsche Radius $n^2a_0$ für $n = 2$ – für $l = n-1$ stimmt das Bohrsche Modell hier überein.'}
      ]},
    {id:'h-p4', title:'Energie des Grundzustands aus der Radialgleichung',
      text:'Für $l = 0$ lautet die Radialgleichung $-\\frac{\\hbar^2}{2m}u\'\' + V(r)u = Eu$ mit $V(r) = -\\frac{\\hbar^2}{ma_0r}$. Probiere $u(r) = r\\,e^{-r/a_0}$.',
      ctx:HRAD({defs:{'V(r)':'-ħ^2/(m a_0 r)', 'u(r)':'r e^(-r/a_0)'}, unknowns:{E:{ref:'-ħ^2/(2 m a_0^2)', kind:'real'}}}),
      goals:[{id:'a', prompt:'Setze $u$ ein und bestimme $E$.', type:'solve', unknown:'E', points:3, ph:"-ħ^2/(2m) u'' + V(r) u = E u",
        hints:['Setze ein und prüfe, ob links eine Konstante mal $u$ herauskommt; diese Konstante ist $E$.', 'Regel: $u\' = (1 - r/a_0)e^{-r/a_0}$, $u\'\' = (r/a_0^2 - 2/a_0)e^{-r/a_0}$.', 'Nächster Schritt: Die Terme mit $1/r$ heben sich weg – genau dafür muss der Exponent $r/a_0$ sein.'],
        model:["-ħ^2/(2m) u'' + V(r) u = E u", '-ħ^2/(2m) (r/a_0^2 - 2/a_0) e^(-r/a_0) - ħ^2/(m a_0 r) · r e^(-r/a_0) = E r e^(-r/a_0)', '-ħ^2/(2m a_0^2) r e^(-r/a_0) = E r e^(-r/a_0)', 'E = -ħ^2/(2m a_0^2)'],
        mistakes:[{expr:'ħ^2/(2m a_0^2)', msg:'Vorzeichen prüfen: Ein gebundener Zustand hat $E < 0$.'}]}]},
    {id:'h-p5', title:'Ein Zustand mit $l = 1$',
      text:'Für $l = 1$ kommt das Zentrifugalglied $\\frac{\\hbar^2l(l+1)}{2mr^2} = \\frac{\\hbar^2}{mr^2}$ hinzu. Probiere $u(r) = r^2e^{-r/(2a_0)}$.',
      ctx:HRAD({defs:{'V(r)':'-ħ^2/(m a_0 r)', 'u(r)':'r^2 e^(-r/(2a_0))'}, unknowns:{E:{ref:'-ħ^2/(8 m a_0^2)', kind:'real'}}}),
      goals:[{id:'a', prompt:'Setze $u$ ein und bestimme $E$. Welches $n$ gehört dazu?', type:'solve', unknown:'E', points:3, ph:"-ħ^2/(2m) u'' + (V(r) + ħ^2/(m r^2)) u = E u",
        hints:['Gleiche Strategie wie beim Grundzustand, jetzt mit Zentrifugalglied.', 'Regel: $u\'\' = \\left(2 - \\frac{2r}{a_0} + \\frac{r^2}{4a_0^2}\\right)e^{-r/(2a_0)}$.', 'Nächster Schritt: Die Glieder mit $r^0$ und $r^1$ heben sich weg; es bleibt ein Vielfaches von $r^2e^{-r/(2a_0)}$.'],
        model:["-ħ^2/(2m) u'' + (V(r) + ħ^2/(m r^2)) u = E u", '-ħ^2/(2m) (2 - 2r/a_0 + r^2/(4a_0^2)) e^(-r/(2a_0)) + (-ħ^2/(m a_0 r) + ħ^2/(m r^2)) r^2 e^(-r/(2a_0)) = E r^2 e^(-r/(2a_0))', '-ħ^2/(8m a_0^2) r^2 e^(-r/(2a_0)) = E r^2 e^(-r/(2a_0))', 'E = -ħ^2/(8m a_0^2)'],
        note:'$E = E_1/4 = E_2$: Das ist der Zustand $2p$ ($n = 2$, $l = 1$), entartet mit $2s$.'}]},
    {id:'h-p6', title:'Virialsatz und Spektrallinie',
      text:'Grundzustand $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$, $V(r) = -\\hbar^2/(ma_0r)$, $E_n = -\\frac{\\hbar^2}{2ma_0^2n^2}$.',
      ctx:HRAD({defs:HDEFS, state:'R_10', ops:{T:'-ħ^2/(2m) (1/r^2) d/dr r^2 d/dr'}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle V\\rangle$ im Grundzustand.', type:'value', target:'-ħ^2/(m a_0^2)', points:2, ph:'⟨V⟩ = ∫_0^∞ V(r) |R_10(r)|^2 r^2 dr',
          hints:['Erwartungswert von $V(r)$ mit dem Maß $r^2dr$.', 'Regel: Vom Maß $r^2$ und $1/r$ bleibt $r$: $\\int_0^\\infty re^{-2r/a_0}dr = a_0^2/4$.', 'Nächster Schritt: Vorfaktor $-\\frac{\\hbar^2}{ma_0}\\cdot\\frac{4}{a_0^3}$.'],
          model:['⟨V⟩ = ∫_0^∞ V(r) |R_10(r)|^2 r^2 dr', '= -ħ^2/(m a_0) · 4/a_0^3 · a_0^2/4', '= -ħ^2/(m a_0^2)']},
        {id:'b', prompt:'b) Bestimme $\\langle T\\rangle$ aus $E_1$ und $\\langle V\\rangle$.', type:'value', target:'ħ^2/(2m a_0^2)', points:2,
          hints:['Im Eigenzustand ist $E_1 = \\langle T\\rangle + \\langle V\\rangle$.', 'Regel: $E_1 = -\\frac{\\hbar^2}{2ma_0^2}$.', 'Nächster Schritt: $\\langle T\\rangle = E_1 - \\langle V\\rangle$.'],
          model:['⟨T⟩ = E_1 - ⟨V⟩', '= -ħ^2/(2m a_0^2) + ħ^2/(m a_0^2)', '= ħ^2/(2m a_0^2)'], note:'Also $\\langle T\\rangle = -E_1$ und $\\langle V\\rangle = 2E_1$ (Virialsatz).'},
        {id:'c', prompt:'c) Welche Energie hat das Photon beim Übergang $n = 3 \\to n = 2$ (Balmer-$H_\\alpha$)?', type:'value', target:'5ħ^2/(72 m a_0^2)', points:2, ph:'E_3 - E_2 = …',
          hints:['Ein Photon trägt die Energiedifferenz zweier Niveaus.', 'Regel: $E_3 - E_2 = -\\frac{\\hbar^2}{2ma_0^2}\\left(\\frac19 - \\frac14\\right)$.', 'Nächster Schritt: $\\frac19 - \\frac14 = -\\frac{5}{36}$.'],
          model:['E_3 - E_2 = -ħ^2/(2m a_0^2) (1/9 - 1/4)', '= 5ħ^2/(72 m a_0^2)'], note:'Mit $\\hbar^2/(2ma_0^2) \\approx 13{,}6\\,\\mathrm{eV}$: $\\approx 1{,}89\\,\\mathrm{eV}$, also $\\lambda \\approx 656\\,\\mathrm{nm}$ (rot).'}
      ]}
  ],
  sketch:[
    {id:'h-s1', title:'Radiale Aufenthaltsdichte im Grundzustand', kind:'curve', draw:'abs2',
      text:'Skizziere die radiale Aufenthaltsdichte $P(r) = r^2|R_{10}(r)|^2$ des Wasserstoff-Grundzustands mit $R_{10} = \\frac{2}{a_0^{3/2}}e^{-r/a_0}$. Die Höhe ist frei.',
      plot:{x:[0, 6], xlab:'r/a_0', ylab:'P(r)', ticks:H_SK.ticks(1, 6)},
      f:H_SK.P10,
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann eine Aufenthaltsdichte negativ sein? Welches Vorzeichen haben $r^2$ und $|R|^2$?'},
        {id:'null', name:'Wert am Kern', type:'zero', at:[0], msg:'Welchen Wert hat $P(r)$ bei $r = 0$? Denk an das Volumen einer dünnen Kugelschale um den Kern. (Abschnitt ‚Radialfunktionen und wo das Elektron ist‘)'},
        {id:'max', type:'maxat', x:1, tol:0.3, msg:'Bei welchem $r$ ist $P(r)$ am größten? Setze die Ableitung von $r^2e^{-2r/a_0}$ gleich null.'},
        {id:'knoten', type:'nodes', n:0, msg:'Hat der Grundzustand einen radialen Knoten? Deine Skizze hat {got}.'},
        {id:'aussen', name:'große Abstände', type:'decay', toward:'right', range:[2, 6], msg:'Was macht $P(r)$ weit draußen?'}
      ],
      reveal:'$P(r) = \\frac{4}{a_0^3}r^2e^{-2r/a_0}$. Der Faktor $r^2$ kommt vom Volumen $4\\pi r^2dr$ der Kugelschale. Er macht $P$ am Kern null, obwohl $|\\psi_{100}|^2$ dort am größten ist. Die Exponentialfunktion drückt $P$ weit draußen. Das Maximum liegt bei $r = a_0$; der Mittelwert $\\langle r\\rangle = \\tfrac32a_0$ liegt weiter außen, weil die Verteilung nach außen einen langen Ausläufer hat.',
      hints:['Setze $R_{10}$ in $P = r^2|R|^2$ ein. Was macht jeder der beiden Faktoren bei kleinem und bei großem $r$?', 'Für $1s$ ist $P \\propto r^2e^{-2r/a_0}$. Das Maximum folgt aus $\\frac{d}{dr}\\big(r^2e^{-2r/a_0}\\big) = \\big(2r - 2r^2/a_0\\big)e^{-2r/a_0} = 0$.'],
      wrong:[
        {f:r => Math.exp(-2 * r), fails:['null', 'max'], why:'$|R|^2$ statt $r^2|R|^2$: Faktor $r^2$ vergessen, Maximum am Kern'},
        {f:r => r * r * Math.exp(-4 * r / 3), fails:['max'], why:'wahrscheinlichster Abstand mit dem Mittelwert $\\langle r\\rangle = \\tfrac32a_0$ verwechselt'}
      ]},
    {id:'h-s2', title:'Radiale Aufenthaltsdichte des $2p$-Zustands', kind:'curve', draw:'abs2',
      text:'Skizziere die radiale Aufenthaltsdichte $P(r) = r^2|R_{21}(r)|^2$ des Zustands $n = 2$, $l = 1$ mit $R_{21} \\propto \\frac{r}{a_0}\\,e^{-r/(2a_0)}$. Die Höhe ist frei.',
      plot:{x:[0, 16], xlab:'r/a_0', ylab:'P(r)', ticks:H_SK.ticks(2, 16)},
      f:H_SK.P21,
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann eine Aufenthaltsdichte negativ sein? Welches Vorzeichen haben $r^2$ und $|R|^2$?'},
        {id:'null', name:'Wert am Kern', type:'zero', at:[0], msg:'Wie verhält sich $P(r)$ für $r \\to 0$, wenn $R_{21} \\propto r$ ist?'},
        {id:'knoten', type:'nodes', n:0, msg:'Wie viele radiale Knoten hat ein Zustand mit $n = 2$, $l = 1$? Deine Skizze hat {got}.'},
        {id:'max', type:'maxat', x:4, tol:0.8, msg:'Wo liegt das Maximum von $r^4e^{-r/a_0}$?'},
        {id:'aussen', name:'große Abstände', type:'decay', toward:'right', range:[8, 16], msg:'Was macht $P(r)$ für große $r$?'}
      ],
      reveal:'$P(r) = \\frac{1}{24a_0^5}r^4e^{-r/a_0}$ hat $n - l - 1 = 0$ Knoten und ein einziges Maximum bei $r = 4a_0 = n^2a_0$. Für $l = 1$ ist $R \\propto r$ am Kern, also $P \\propto r^4$ statt $r^2$ wie bei $1s$: Die Zentrifugalbarriere, die es nur für $l > 0$ gibt, hält das Elektron vom Kern fern.',
      hints:['Zähle zuerst die radialen Knoten. Setze dann $R_{21}$ in $P = r^2|R|^2$ ein.', 'Radiale Knoten: $n - l - 1$. $P \\propto r^4e^{-r/a_0}$ ist maximal, wo $4r^3 = r^4/a_0$ ist.'],
      wrong:[
        {f:H_SK.P20, fails:['knoten', 'max'], why:'Knoten wie beim $2s$-Zustand: Knotenzahl $n - 1$ statt $n - l - 1$'},
        {f:r => r * r * Math.exp(-r), fails:['max'], why:'$|R_{21}|^2$ statt $r^2|R_{21}|^2$: Maximum bei $2a_0$'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'h-f1', title:'Mittleres Abstandsquadrat im Zustand 2p', text:'$R_{21}(r) = \\frac{1}{\\sqrt{24}}a_0^{-3/2}\\frac{r}{a_0}e^{-r/(2a_0)}$.',
      ctx:HRAD({defs:HDEFS, state:'R_21'}),
      goals:[{id:'a', prompt:'Berechne $\\langle r^2\\rangle$.', type:'value', target:'30 a_0^2', points:3, model:['⟨r^2⟩ = ∫_0^∞ r^2 |R_21(r)|^2 r^2 dr', '= 1/(24 a_0^5) ∫_0^∞ r^6 e^(-r/a_0) dr', '= 1/(24 a_0^5) · 6! a_0^7', '= 30 a_0^2']}]}},
    {aim:1, task:{id:'h-f3', title:'Ein Zustand mit $l = 2$', text:'Radialgleichung $-\\frac{\\hbar^2}{2m}u\'\' + \\left[V(r) + \\frac{\\hbar^2l(l+1)}{2mr^2}\\right]u = Eu$ mit $V(r) = -\\frac{\\hbar^2}{ma_0r}$ und $l = 2$. Probiere $u(r) = r^3e^{-r/(3a_0)}$.',
      ctx:HRAD({defs:{'V(r)':'-ħ^2/(m a_0 r)', 'u(r)':'r^3 e^(-r/(3a_0))'}, unknowns:{E:{ref:'-ħ^2/(18 m a_0^2)', kind:'real'}}}),
      goals:[{id:'a', prompt:'Setze $u$ ein und bestimme $E$.', type:'solve', unknown:'E', points:3,
        model:["-ħ^2/(2m) u'' + (V(r) + 3ħ^2/(m r^2)) u = E u", "u'' = (6/r^2 - 2/(a_0 r) + 1/(9a_0^2)) u", '-ħ^2/(18 m a_0^2) u = E u', 'E = -ħ^2/(18 m a_0^2)']}]}},
    {aim:2, q:'Wie viele Zustände (ohne Spin) haben die Energie $E_3$?', opts:['$9$', '$3$', '$6$'], a:0, ex:'$l = 0, 1, 2$ mit $1 + 3 + 5 = 9 = n^2$ Zuständen.'},
    {aim:'k', id:'h-fk1', type:'mc2',
      q:'Für welchen Zustand ist die Dichte $|\\psi|^2$ direkt am Kern von null verschieden?', opts:['$2s$', '$2p$', '$3d$'], a:0,
      ex:'Nur s-Zustände reichen bis an den Kern.',
      reason:{q:'Warum?', opts:['Nur für $l = 0$ fehlt die Zentrifugalbarriere; sonst ist $R \\propto r^l$.', 'Je größer $n$, desto näher ist das Elektron am Kern.', 'Nur Zustände mit $m = 0$ erreichen den Kern.'], a:0,
        ex:'Nahe $r = 0$ ist $R_{nl} \\propto r^l$; das ist nur für $l = 0$ dort von null verschieden. Mit $n$ wächst das Atom, es schrumpft nicht.'}},
    {aim:'k', id:'h-fk2', type:'dialog',
      text:'Es geht um den Zustand $2p$.',
      people:[
        {name:'Lena', says:'Im Zustand $2p$ ist $l = 1$, der Betrag des Drehimpulses also $\\sqrt2\\,\\hbar$.'},
        {name:'Jonas', says:'Nach Bohr hat das Elektron bei $n = 2$ den Drehimpuls $2\\hbar$. Weil die Energie dieselbe ist wie bei Bohr, muss auch der Drehimpuls derselbe sein.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:0,
      ex:'$|\\vec L| = \\hbar\\sqrt{l(l+1)} = \\sqrt2\\,\\hbar$. Gleiche Energie heißt nicht gleicher Drehimpuls: Zu $n = 2$ gehört auch $2s$ mit $L = 0$. Bohrs Modell trifft die Energien, nicht die Drehimpulse.'},
    {aim:0, sketch:{id:'h-fs1', title:'Radiale Aufenthaltsdichte des $2s$-Zustands', kind:'curve', draw:'abs2',
      text:'Die Radialfunktion des $2s$-Zustands ist $R_{20} = \\frac{1}{\\sqrt2\\,a_0^{3/2}}\\left(1 - \\frac{r}{2a_0}\\right)e^{-r/(2a_0)}$. Skizziere die radiale Aufenthaltsdichte $P(r)$, also die Wahrscheinlichkeit pro Abstandsintervall $dr$. Die Höhe ist frei.',
      plot:{x:[0, 15], xlab:'r/a_0', ylab:'P(r)', ticks:H_SK.ticks(2, 14)},
      f:H_SK.P20,
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann eine Aufenthaltsdichte negativ sein? Welches Vorzeichen haben $r^2$ und $|R|^2$?'},
        {id:'null', name:'Wert am Kern', type:'zero', at:[0], msg:'Welchen Wert hat $P(r)$ bei $r = 0$?'},
        {id:'knoten', name:'Lage der Knoten', type:'zero', at:[2], tol:0.5, msg:'Wo ist $R_{20}$ null?'},
        {id:'max', name:'höheres Maximum außen', type:'maxat', x:5.5, tol:3, msg:'Welches der beiden Maxima ist höher? Denk an den Faktor $r^2$.'}
      ],
      reveal:'$P(r) = r^2|R_{20}|^2 = \\frac{1}{2a_0^3}r^2\\left(1 - \\frac{r}{2a_0}\\right)^2e^{-r/a_0}$. Der Faktor $r^2$ aus dem Maß $r^2dr$ macht $P$ am Kern null. Der Knoten liegt bei $r = 2a_0$. Das innere Maximum bei $r = (3 - \\sqrt5)\\,a_0 \\approx 0{,}76\\,a_0$ ist klein, das äußere bei $r = (3 + \\sqrt5)\\,a_0 \\approx 5{,}2\\,a_0$ etwa 3,7-mal so hoch.',
      wrong:[
        {f:r => (1 - r / 2) ** 2 * Math.exp(-r), fails:['null', 'max'], why:'$|R|^2$ statt $r^2|R|^2$: Maß $r^2dr$ vergessen'},
        {f:r => H_SK.P20(r) * 6 * Math.exp(-r / 2), fails:['max'], why:'inneres Maximum höher („das Elektron ist meist am Kern“)'},
        {f:H_SK.P21, fails:['knoten'], why:'Knoten vergessen, Form wie beim $2p$-Zustand'}
      ], points:3}}
  ],
  finalB:[
    {aim:0, task:{id:'h-f4', title:'Mittleres $1/r$ im Zustand 2p', text:'$R_{21}(r) = \\frac{1}{\\sqrt{24}}a_0^{-3/2}\\frac{r}{a_0}e^{-r/(2a_0)}$.',
      ctx:HRAD({defs:HDEFS, state:'R_21'}),
      goals:[{id:'a', prompt:'Berechne $\\langle 1/r\\rangle$.', type:'value', target:'1/(4 a_0)', points:3, model:['⟨1/r⟩ = ∫_0^∞ 1/r |R_21(r)|^2 r^2 dr', '= 1/(24 a_0^5) ∫_0^∞ r^3 e^(-r/a_0) dr', '= 1/(24 a_0^5) · 3! a_0^4', '= 1/(4 a_0)']}]}},
    {aim:1, task:{id:'h-f5', title:'Ein Zustand mit $l = 3$', text:'Radialgleichung $-\\frac{\\hbar^2}{2m}u\'\' + \\left[V(r) + \\frac{\\hbar^2l(l+1)}{2mr^2}\\right]u = Eu$ mit $V(r) = -\\frac{\\hbar^2}{ma_0r}$ und $l = 3$. Probiere $u(r) = r^4e^{-r/(4a_0)}$.',
      ctx:HRAD({defs:{'V(r)':'-ħ^2/(m a_0 r)', 'u(r)':'r^4 e^(-r/(4a_0))'}, unknowns:{E:{ref:'-ħ^2/(32 m a_0^2)', kind:'real'}}}),
      goals:[{id:'a', prompt:'Setze $u$ ein und bestimme $E$.', type:'solve', unknown:'E', points:3,
        model:["-ħ^2/(2m) u'' + (V(r) + 6ħ^2/(m r^2)) u = E u", "u'' = (12/r^2 - 2/(a_0 r) + 1/(16a_0^2)) u", '-ħ^2/(32 m a_0^2) u = E u', 'E = -ħ^2/(32 m a_0^2)']}]}},
    {aim:2, q:'Wie viele Zustände (ohne Spin) haben die Energie $E_4$?', opts:['$16$', '$4$', '$10$'], a:0, ex:'$l = 0, 1, 2, 3$ mit $1 + 3 + 5 + 7 = 16 = n^2$ Zuständen. $10 = 1 + 2 + 3 + 4$ erhält man, wenn man je $l$ nur $l + 1$ statt $2l + 1$ Werte von $m$ zählt.'},
    {aim:'k', id:'h-fk3', type:'mc2',
      q:'Ein Elektron ist in einem Zustand mit $n = 3$. In welchem Zustand ist die Wahrscheinlichkeit am größten, es in einer winzigen Kugel um den Kern (Radius $\\ll a_0$) zu finden?', opts:['$3s$', '$3d$', 'in allen gleich, die Energie ist ja dieselbe'], a:0,
      ex:'Nur im $3s$-Zustand ist die Dichte am Kern von null verschieden. Für $3p$ und $3d$ geht sie dort gegen null.',
      reason:{q:'Warum?', opts:['Nahe $r = 0$ ist $R_{nl} \\propto r^l$; nur für $l = 0$ ist $R(0) \\ne 0$.', 'Zustände mit größerem $l$ liegen näher am Kern.', 'Gleiche Energie heißt gleiche räumliche Verteilung.'], a:0,
        ex:'Die Zentrifugalbarriere hält Zustände mit $l > 0$ vom Kern fern. Entartete Zustände können ganz verschieden verteilt sein: $3s$, $3p$ und $3d$ haben dieselbe Energie, aber verschiedene $R_{nl}$.'}},
    {aim:'k', id:'h-fk4', type:'dialog',
      text:'Es geht um die Zustände $3s$ und $3d$ des Wasserstoffatoms.',
      people:[
        {name:'Lena', says:'$3s$ und $3d$ haben dieselbe Energie $E_3$. Nach Bohr gehört zu $n = 3$ der Drehimpuls $3\\hbar$, also haben beide diesen Drehimpuls.'},
        {name:'Jonas', says:'Der Betrag des Drehimpulses hängt von $l$ ab, nicht von $n$. In $3s$ ist er null, in $3d$ ist er $\\sqrt6\\,\\hbar$.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:1,
      ex:'$|\\vec L| = \\hbar\\sqrt{l(l+1)}$: $0$ für $l = 0$ und $\\sqrt6\\,\\hbar$ für $l = 2$. Gleiche Energie heißt nicht gleicher Drehimpuls. Bohrs Modell trifft die Energien, nicht die Drehimpulse; den Wert $3\\hbar$ hat kein Zustand mit $n = 3$.'},
    {aim:0, sketch:{id:'h-fs2', title:'Radiale Aufenthaltsdichte des $3s$-Zustands', kind:'curve', draw:'abs2',
      text:'Die Radialfunktion des $3s$-Zustands ist $R_{30} = \\frac{2}{3\\sqrt3\\,a_0^{3/2}}\\left(1 - \\frac{2r}{3a_0} + \\frac{2r^2}{27a_0^2}\\right)e^{-r/(3a_0)}$. Skizziere die radiale Aufenthaltsdichte $P(r)$, also die Wahrscheinlichkeit pro Abstandsintervall $dr$. Die Höhe ist frei.',
      plot:{x:[0, 30], xlab:'r/a_0', ylab:'P(r)', ticks:H_SK.ticks(5, 30)},
      f:H_SK.P30,
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann eine Aufenthaltsdichte negativ sein? Welches Vorzeichen haben $r^2$ und $|R|^2$?'},
        {id:'null', name:'Wert am Kern', type:'zero', at:[0], msg:'Welchen Wert hat $P(r)$ bei $r = 0$?'},
        {id:'knoten', name:'Lage der Knoten', type:'zero', at:[(9 - 3 * Math.sqrt(3)) / 2, (9 + 3 * Math.sqrt(3)) / 2], tol:0.8, msg:'Wo ist $R_{30}$ null? Löse $2r^2 - 18ra_0 + 27a_0^2 = 0$.'},
        {id:'max', name:'höchstes Maximum außen', type:'maxat', x:13, tol:5, msg:'Welches der Maxima ist am höchsten? Denk an den Faktor $r^2$.'}
      ],
      reveal:'$P(r) = r^2|R_{30}|^2$. Der Faktor $r^2$ aus dem Maß $r^2dr$ macht $P$ am Kern null. Die beiden Knoten ($n - l - 1 = 2$) liegen bei $r = \\tfrac{9 \\mp 3\\sqrt3}{2}\\,a_0 \\approx 1{,}9\\,a_0$ und $7{,}1\\,a_0$. Von den drei Maxima ist das äußerste bei $r \\approx 13\\,a_0$ mit Abstand das höchste; das innerste bei $0{,}74\\,a_0$ erreicht nur etwa 15 % davon.',
      wrong:[
        {f:r => (27 - 18 * r + 2 * r * r) ** 2 * Math.exp(-2 * r / 3), fails:['null', 'max'], why:'$|R|^2$ statt $r^2|R|^2$: Maß $r^2dr$ vergessen'},
        {f:r => H_SK.P30(r) * (r < 7.1 ? 6 : 1), fails:['max'], why:'innere Maxima höher („das Elektron ist meist nahe am Kern“)'},
        {f:r => r ** 6 * Math.exp(-2 * r / 3), fails:['knoten'], why:'Knoten vergessen, Form wie beim $3d$-Zustand'}
      ], points:3}}
  ],
  errors:[
    {id:'h-e1', title:'Normierung ohne Maß',
      text:'Gesucht ist $A > 0$ für $R(r) = A\\,e^{-r/a_0}$. Jemand rechnet:',
      ctx:HRAD({defs:{'R(r)':'A e^(-r/a_0)'}, unknowns:{A:{ref:'2/a_0^(3/2)'}}}),
      lines:['∫_0^∞ |R(r)|^2 r^2 dr = 1', '|A|^2 ∫_0^∞ e^(-2r/a_0) dr = 1', '|A|^2 a_0/2 = 1', 'A = sqrt(2/a_0)'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Der Faktor $r^2$ aus dem Maß ist verloren gegangen.', 'Der Exponent muss beim Quadrieren $-r/a_0$ bleiben.', 'Die untere Integrationsgrenze muss $-\\infty$ sein.'], a:0, ex:'Ohne $r^2$ hat $A$ die falsche Einheit $\\text{Länge}^{-1/2}$ – ein Warnsignal.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $A$.', type:'solve', unknown:'A', model:['∫_0^∞ |R(r)|^2 r^2 dr = 1', '|A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1', '|A|^2 a_0^3/4 = 1', 'A = 2/a_0^(3/2)']}}
  ]
});
lexe('kugelkoordinaten', 'Kugelkoordinaten', '$x = r\\sin\\theta\\cos\\varphi$, $y = r\\sin\\theta\\sin\\varphi$, $z = r\\cos\\theta$ mit $r\\ge 0$, $0\\le\\theta\\le\\pi$, $0\\le\\varphi<2\\pi$. Volumenelement $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi = r^2dr\\,d\\Omega$, Raumwinkel $\\int d\\Omega = 4\\pi$. Laplace-Operator: $\\nabla^2 = \\frac{1}{r^2}\\partial_r(r^2\\partial_r) - \\frac{\\hat L^2}{\\hbar^2r^2}$.', {topic:'h'});
lexe('bohrradius', 'Bohrscher Radius', '$a_0 = \\frac{4\\pi\\varepsilon_0\\hbar^2}{m_ee^2} \\approx 0{,}529\\cdot10^{-10}\\,\\mathrm{m}$. Damit ist $\\frac{e^2}{4\\pi\\varepsilon_0} = \\frac{\\hbar^2}{m_ea_0}$ und $V(r) = -\\frac{\\hbar^2}{m_ea_0r}$. Im Grundzustand ist $a_0$ der wahrscheinlichste Abstand, $\\langle r\\rangle = \\tfrac32a_0$.', {topic:'h'});
lexe('wasserstoff-energie', 'Energieniveaus des Wasserstoffatoms', '$E_n = -\\frac{\\hbar^2}{2m_ea_0^2n^2} = -\\frac{m_e}{2\\hbar^2}\\left(\\frac{e^2}{4\\pi\\varepsilon_0}\\right)^2\\frac{1}{n^2} \\approx -\\frac{13{,}6\\,\\mathrm{eV}}{n^2}$ (unendlich schwerer Kern; mit reduzierter Masse $13{,}598\\,\\mathrm{eV}$). Quantenzahlen: $n\\ge1$, $l = 0,\\dots,n-1$, $m = -l,\\dots,l$; Entartung $n^2$ (ohne Spin). Übergänge: $h\\nu = E_{n_o} - E_{n_u}$; Balmer-Serie endet bei $n_u = 2$.', {topic:'h'});
lexe('radialgleichung', 'Radialgleichung', 'Mit $\\psi = R(r)Y_l^m(\\theta,\\varphi)$ und $u = rR$: $-\\frac{\\hbar^2}{2m}u\'\' + V_{\\text{eff}}(r)u = Eu$, $V_{\\text{eff}} = V(r) + \\frac{\\hbar^2l(l+1)}{2mr^2}$, Randbedingung $u(0) = 0$. Normierung $\\int_0^\\infty|u|^2dr = \\int_0^\\infty|R|^2r^2dr = 1$. Verhalten: $u \\propto r^{l+1}$ für $r \\to 0$, $u \\propto e^{-\\kappa r}$ mit $\\kappa = \\sqrt{-2mE}/\\hbar$ für $r \\to \\infty$.', {topic:'h'});
lexe('radialfunktionen', 'Radialfunktionen des Wasserstoffatoms', '- $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$\n- $R_{20} = \\frac{1}{\\sqrt2}a_0^{-3/2}\\left(1 - \\frac{r}{2a_0}\\right)e^{-r/(2a_0)}$\n- $R_{21} = \\frac{1}{\\sqrt{24}}a_0^{-3/2}\\frac{r}{a_0}e^{-r/(2a_0)}$\n\nGrundzustand $\\psi_{100} = \\frac{1}{\\sqrt{\\pi a_0^3}}e^{-r/a_0}$ (mit $Y_0^0 = 1/\\sqrt{4\\pi}$). Allgemein $\\langle r\\rangle_{nl} = \\frac{a_0}{2}[3n^2 - l(l+1)]$, $\\langle 1/r\\rangle_{nl} = \\frac{1}{n^2a_0}$.', {topic:'h'});
lexe('virialsatz', 'Virialsatz', 'Für stationäre Zustände im Potential $V\\propto r^k$ gilt $2\\langle T\\rangle = k\\langle V\\rangle$. Coulomb ($k = -1$): $\\langle T\\rangle = -E_n$, $\\langle V\\rangle = 2E_n$. Oszillator ($k = 2$): $\\langle T\\rangle = \\langle V\\rangle = E_n/2$.', {topic:'h'});
lexe('h-zentralpotential', 'Zentralpotential', 'Ein Potential $V(r)$, das nur vom Abstand abhängt. Dann vertauscht $\\hat H$ mit $\\hat L^2$ und $\\hat L_z$, und der Ansatz $\\psi = R(r)Y_l^m(\\theta,\\varphi)$ trennt die Schrödingergleichung in den Winkelteil (für jedes $V$ dieselben $Y_l^m$) und die Radialgleichung. Die Energie hängt nicht von $m$ ab; jedes Niveau ist mindestens $(2l+1)$-fach entartet.', {topic:'h'});
lexe('h-entartung', 'Entartung im Wasserstoffatom', '$E_n$ hängt nur von $n$ ab. Zu $n$ gehören $l = 0, \\dots, n-1$ und je $2l+1$ Werte von $m$: zusammen $\\sum_{l=0}^{n-1}(2l+1) = n^2$ Zustände (mit Spin $2n^2$). Die $m$-Entartung hat jedes Zentralpotential; die $l$-Entartung ist eine Besonderheit von $V \\propto 1/r$ (Lenz-Runge-Vektor). Überlagerungen entarteter Zustände sind wieder stationär.', {topic:'h'});
lexe('h-spektralserien', 'Spektralserien des Wasserstoffs', 'Rydberg-Formel $\\frac1\\lambda = R\\left(\\frac{1}{n_u^2} - \\frac{1}{n_o^2}\\right)$, $R_\\infty \\approx 1{,}0974\\cdot10^7\\,\\mathrm m^{-1}$, $R_H$ um $0{,}05\\,\\%$ kleiner. Lyman ($n_u = 1$, UV, ab $122\\,\\mathrm{nm}$), Balmer ($n_u = 2$, sichtbar: $656$, $486$, $434$, $410\\,\\mathrm{nm}$, Grenze nahe $365\\,\\mathrm{nm}$), Paschen ($n_u = 3$, IR, ab $1875\\,\\mathrm{nm}$). Dipolübergänge nur mit $\\Delta l = \\pm1$.', {topic:'h'});
})();
