# Tutorial in Quantum Mechanics

Quantenmechanik I und ihre mathematischen Grundlagen im Eigenstudium.

Interaktives Tutorial für Quantenmechanik I im Physik-Bachelor, im Aufbau der [Mathe-Lernhilfe](https://github.com/tbonk2208/mathe-lernhilfe). Die Inhalte sind deutschsprachig. Herleitungen werden Zeile für Zeile geprüft – wie von einer wohlwollenden Tutorin: richtige Umformungen werden anerkannt, auch ungewöhnliche Wege, Folgefehler werden als folgerichtig markiert, und bei falschen Schritten gibt es eine Rückfrage statt der Lösung.

## Themen

Zwei Kapitel, als Reiter wählbar.

**Mathematische Grundlagen** (Methoden der Physik, so weit die Quantenmechanik sie braucht)

- M1 Komplexe Zahlen und Funktionen
- M2 Reihen, Integrale und δ-Distribution
- M3 Vektorräume und Skalarprodukt
- M4 Lineare Operatoren und Eigenwerte
- M5 Funktionenräume und Hilbertraum
- M6 Fourier-Reihen und Fourier-Transformation
- M7 Differentialgleichungen und Randwertprobleme
- M8 Kugelkoordinaten und spezielle Funktionen

**Quantenmechanik**

1. Wellenfunktion und Wahrscheinlichkeit
2. Schrödingergleichung und stationäre Zustände
3. Unendlicher Potentialtopf
4. Freies Teilchen und Wellenpakete
5. Stufe, Barriere, Tunneleffekt
6. Formalismus: Dirac-Notation, Operatoren, Messung
7. Harmonischer Oszillator
8. Drehimpuls
9. Wasserstoffatom
10. Spin ½
11. Stationäre Störungstheorie und Variationsverfahren

Jedes QM-Thema nennt unter „Mathe dazu“ die passenden Mathe-Themen; der Eingangscheck verweist bei Lücken direkt dorthin.

## Öffnen und installieren

Adresse: https://tbonk2208.github.io/tutorial-in-quantum-mechanics/

- **iPad / iPhone (Safari):** Teilen-Symbol → „Zum Home-Bildschirm“.
- **Chrome / Edge (Windows, Mac, Android):** „Als App installieren“ im Tutorial oder das Installations-Symbol in der Adressleiste.
- **Safari auf dem Mac:** Ablage → „Zum Dock hinzufügen“.

Nach dem ersten Öffnen läuft das Tutorial ohne Internet. Der Lernstand bleibt auf dem Gerät; unter „Einstellungen“ lässt er sich als Datei sichern und auf einem anderen Gerät einlesen.

## Aufbau

Startseite mit **Neues lernen**, **Üben**, **Wiederholen** (verteilte Wiederholung nach 1, 3, 7, 14, 30 Tagen) und **Klausur vorbereiten** (Tagesplan und Probeklausur ohne Hilfe). Jedes Thema folgt demselben Lernweg:

1. **Ziel und Check:** Lernziele und vier Fragen zum Vorwissen; fehlt etwas, verlinkt das Ergebnis den passenden Eintrag oder das passende Thema.
2. **Einstieg:** vorgerechnetes Beispiel mit Warum-Fragen und anschließender Lückenaufgabe – oder eine Knobelaufgabe vor der Erklärung.
3. **Klären:** Kernidee, worauf es ankommt, typische Fehler (nach der physikdidaktischen Forschung zur QM).
4. **Darstellen:** Labor mit Simulation (z. B. δ-Folgen, Eigenvektoren, Fourier-Teilsummen, Wellenpaket, Tunneln, Bloch-Kugel), danach eine Frage ohne Bild.
5. **Vergleichen:** zwei richtige Lösungswege und wann welcher besser ist.
6. **Üben:** Herleitungen mit zeilenweiser Prüfung, gestuften Hinweisen und Musterlösung nach eigenem Versuch.
7. **Abschluss:** vier Aufgaben ohne Hilfe; ab 3 von 4 gilt das Thema als sicher.

## Mit dem Stift schreiben

Jede Rechenzeile lässt sich mit ✎ auf Stift umschalten (Voreinstellung unter „Einstellungen → Stift und Handschrift“: Tastatur, Stift oder automatisch). Man schreibt wie auf Papier: Brüche als echten Bruch, Grenzen an Integral und Summe, Hoch- und Tiefstellungen, Matrizen mit großen Klammern, Dirac-Klammern ⟨ | ⟩, ein Dach über den Buchstaben. Nach einer kurzen Pause steht unter der Schrift, wie das Tutorial sie liest; andere Lesarten und einzelne Zeichen lassen sich antippen und korrigieren, und das Eingabefeld bleibt editierbar.

Gelesen wird im Gerät mit einem eigenen Erkennungsnetz (103 Zeichen, trainiert mit CROHME 2011–2013 und HASYv2, siehe `LICENSE-Handschriftmodell.txt`). Gemessen an fremden Schreibern werden einzelne Zeichen zu 87–91 % richtig erkannt; ganze Zeilen eines Schreibers sind zu etwa 67 % sofort fehlerfrei und zu 75 % unter den ersten drei Lesarten. Unter „Handschrift anlernen“ schreibt man selten trainierte Zeichen (ψ, ħ, ∂, ⟨ ⟩, ω …) ein paarmal selbst; Korrekturen werden ebenfalls gemerkt (nur im Browser). Mit eigenem API-Schlüssel kann eine schwierige Zeile auf Knopfdruck von Claude gelesen werden; dabei geht das Bild der Zeile an Anthropic. Ausgelegt ist die Stifteingabe für Windows mit Stift; Maus geht auch.

## Formeln eingeben

Tastatur mit Symbolleiste, Vorschau unter jeder Zeile. Beispiele: `∫_0^L |ψ|^2 dx = 1`, `ħ^2/2m` (= ħ²/(2m)), `d^2/dx^2 ψ`, `∂ψ/∂t`, `[x̂, p̂] f`, `⟨n|x̂|m⟩`, `⟨x^2⟩`, `Δx`, `|↑⟩`, `S_z`, `(1, 0; 0, -1)`, `Σ_{n=1}^∞ |c_n|^2`. LaTeX (`\frac`, `\int`, `\langle`) geht auch. Neue Abkürzungen führt man mit `κ = sqrt(2m(V_0 - E))/ħ` ein.

## Wie geprüft wird

Jede Zeile wird an mehreren zufälligen Parameterwerten ausgewertet; Operatorgleichungen werden auf zufällige Testfunktionen angewendet, Spin- und Oszillatoraufgaben in Matrixdarstellung gerechnet. Ableitungen sind symbolisch, Integrale numerisch (adaptives Gauß-Kronrod). Bei Herleitungen mit der Schrödingergleichung (Kontinuitätsgleichung, Ehrenfest) wird die Zeitableitung über die Schrödingergleichung ersetzt. Grenzen: Näherungen (≈) und Grenzwerte werden nicht geprüft, und ob ein Schritt begründet ist, beurteilt die Spalte „Begründung“, nicht der Prüfkern.

## Optionale KI-Hilfe

Ohne Schlüssel sendet das Tutorial nichts ins Internet. Unter „Einstellungen“ kann man einen eigenen Anthropic-API-Schlüssel eintragen; dann gehen Fragen unter „? Frage“ mit Aufgabe und Rechenweg an `api.anthropic.com`. Die KI gibt Hinweise, keine fertigen Lösungen.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | das gesamte Tutorial (Prüfkern, Inhalte, Oberfläche, KaTeX) |
| `sw.js` | Service Worker für den Offline-Betrieb |
| `manifest.webmanifest` | Angaben für die Installation als App |
| `icons/` | App-Symbole |
| `fonts/` | Schriften: KaTeX (MIT, `LICENSE-KaTeX.txt`), Bricolage Grotesque, Source Sans 3 (SIL OFL 1.1, `OFL-*.txt`) |
| `.nojekyll` | GitHub Pages liefert die Dateien unverändert aus |
| `LICENSE` | GNU GPL v3 (wie bei der Mathe-Lernhilfe) |
| `LICENSE-Handschriftmodell.txt` | Herkunft und Lizenz der Gewichte des Erkennungsnetzes (CC BY-NC-SA 3.0) |
| `entwicklung/` | Quelltext und Tests |

## Entwicklung

Der Quelltext liegt im Ordner `entwicklung/`: `src/engine` (Prüfkern: Parser, Ableitungen, Integrale, Orts- und Matrixdarstellung, Zeilenprüfung), `src/content` (ein Thema pro Datei; `00m*` = Mathematische Grundlagen), `src/ui` (Oberfläche, Labore, Stifteingabe `15-ink.js`, Erkennung `16-ink-recog.js`, Modell `model/sym-qm.json`) und `test/` (Stifttests in `test/ink/`, brauchen die nicht enthaltenen Testdaten). Die Skripte zum Training des Erkennungsnetzes liegen in `entwicklung/handschrift-training/`. `node build.js` baut `index.html` neu (KaTeX 0.16 wird aus einem lokalen npm-Paket eingebettet). `node test/validate.js` prüft jede Musterlösung mit dem Prüfkern und alle Formeln mit KaTeX; `node test/mutate.js` prüft, ob veränderte Musterzeilen als falsch erkannt werden.
