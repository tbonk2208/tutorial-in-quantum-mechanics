# Tutorial in Quantum Mechanics

Quantenmechanik I und ihre mathematischen Grundlagen im Selbststudium – auch ohne Vorlesung.

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
- M9 Wahrscheinlichkeit und Statistik

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

Startseite mit **Neues lernen**, **Üben**, **Wiederholen** (verteilte Wiederholung, Fehlerheft) und **Klausur vorbereiten** (Tagesplan und Probeklausur ohne Hilfe). Jedes Thema erklärt den Stoff selbst und folgt demselben Lernweg:

1. **Ziel und Diagnose:** Lernziele, „Wozu?“, was aus früheren Themen wiederkommt; Fragen zu den Voraussetzungen (bei Lücken eine kurze Auffrischung) und zum Thema selbst, die den Einstieg bestimmen.
2. **Vorhersage:** ein Phänomen oder eine Situation – erst selbst begründen und vorhersagen, dann Rückmeldung und Auflösung.
3. **Erklären:** Lerntext in Abschnitten (je Thema etwa 1 400–2 200 Wörter) mit Herleitungen Zeile für Zeile, Warum-Fragen, Abbildungen aus dem Labor und Fragen nach jedem Abschnitt; am Ende eine Zusammenfassung.
4. **Beispiel:** vorgerechnetes Beispiel mit Warum-Fragen, danach eine Lückenaufgabe; für Fortgeschrittene eine Knobelaufgabe.
5. **Labor:** erst vorhersagen, dann ausprobieren (z. B. δ-Folgen, Fourier-Teilsummen, Wellenfunktion an der Barriere, Messfolgen, Bloch-Kugel), dann Fragen mit und ohne Bild.
6. **Üben:** Herleitungen mit zeilenweiser Prüfung und gestuften Hinweisen, Konzeptaufgaben zu typischen Lernschwierigkeiten der Quantenmechanik, zwei Lösungswege im Vergleich, Fehler finden.
7. **Abschluss:** fünf Aufgaben unter Prüfungsbedingungen (ohne Rückmeldung bis zur Abgabe), mit Sicherheitsurteil je Aufgabe. „Vorläufig sicher“ ab 80 % und mit allen Lernzielen; „sicher“ erst nach einer bestandenen Wiederholung frühestens zwei Tage später. Für einen neuen Versuch gibt es eine Parallelform.

Die Abfolge stützt sich auf Lern- und Physikdidaktik-Forschung (siehe „Quellen“ in der App).

## Formeln eingeben

Tastatur mit Symbolleiste, Vorschau unter jeder Zeile. Beispiele: `∫_0^L |ψ|^2 dx = 1`, `ħ^2/2m` (= ħ²/(2m)), `d^2/dx^2 ψ`, `∂ψ/∂t`, `[x̂, p̂] f`, `⟨n|x̂|m⟩`, `⟨x^2⟩`, `Δx`, `|↑⟩`, `S_z`, `(1, 0; 0, -1)`, `Σ_{n=1}^∞ |c_n|^2`. LaTeX (`\frac`, `\int`, `\langle`) geht auch. Neue Abkürzungen führt man mit `κ = sqrt(2m(V_0 - E))/ħ` ein.

## Wie geprüft wird

Jede Zeile wird an mehreren zufälligen Parameterwerten ausgewertet; Operatorgleichungen werden auf zufällige Testfunktionen angewendet, Spin- und Oszillatoraufgaben in Matrixdarstellung gerechnet. Ableitungen sind symbolisch, Integrale numerisch (adaptives Gauß-Kronrod). Bei Herleitungen mit der Schrödingergleichung (Kontinuitätsgleichung, Ehrenfest) wird die Zeitableitung über die Schrödingergleichung ersetzt. Grenzen: Näherungen (≈) und Grenzwerte werden nicht geprüft, und ob ein Schritt begründet ist, beurteilt die Spalte „Begründung“, nicht der Prüfkern.

## Optionale KI-Hilfe

Ohne Schlüssel sendet das Tutorial nichts ins Internet. Mit der Schreibprobe (Einstellungen) lässt sich die Erkennung an der eigenen Handschrift messen und als Datei sichern. Unter „Einstellungen“ kann man einen eigenen Anthropic-API-Schlüssel eintragen; dann gehen Fragen unter „? Frage“ mit Aufgabe und Rechenweg an `api.anthropic.com`. Die KI gibt Hinweise, keine fertigen Lösungen.

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
