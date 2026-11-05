# Agent T – Daten und Training des Zeichenmodells `cnn2` (sym-qm.json)

Stand: 2026-11-05. Alles reproduzierbar mit den Skripten in `/home/claude/ink/train/` (Reihenfolge unten).

## Ergebnis in Kürze

| | Testschreiber | n | Top-1 | Top-3 | Mittel über Klassen | Top-1, Größengruppen gleichgesetzt¹ |
|---|---|---|---|---|---|---|
| crohme | CROHME-2013-Testsatz (echte Striche, fremde Schreiber) | 5718 | 86.6 % | 97.6 % | 85.1 % | 91.8 % |
| hasy | HASYv2-Testnutzer (15 % der bekannten Nutzer, Skelett-Polylinien) | 3090 | 90.9 % | 98.6 % | 88.7 % | 94.7 % |
| hasy_anon | HASYv2-Anonymkonto, 10 % zurückgehalten (Schreibertrennung NICHT gesichert) | 3705 | 91.9 % | 97.7 % | 89.8 % | 92.6 % |

¹ `c`/`C`, `s`/`S`, `v`/`V`, `p`/`P`, `1`/`|`/`l`, `'`/`,` und `x`/`χ` gelten als gleich – diese unterscheiden sich im normierten Bild nur durch Größe/Lage bzw. kaum; R entscheidet sie über Lage und Kontext. Das Netz ist auf ausgeglichene Klassen trainiert (etwa gleiche Vorab-Wahrscheinlichkeit je Klasse); Häufigkeiten gehören in R (`classWeights`).

- Modell: `/home/claude/qm/src/ui/model/sym-qm.json`, 296939 Bytes (290 KB), arch `cnn2`, C1=24, C2=48, F=160, N=103 Klassen, 219399 Parameter, int8 je Schicht.
- Training: 16 Epochen über 307144 augmentierte Beispiele, 57 min auf 2 CPU-Kernen (numpy, eigene Implementierung).
- Genauigkeit gilt für **einzelne, richtig segmentierte Zeichen ohne Zusammenhang**. In der App kommen Größe/Lage (Punkt, Komma, Strich, Hoch/Tief) und Grammatik/Aufgabenkontext (Agent R) dazu; die meisten Restfehler (`1`/`|`, `,`/`)`, `c`/`C`, `9`/`q`, `P`/`p`) sind ohne Größe/Lage im Bild nicht lösbar.

## Wichtig für Agent R (JS-Rasterung)

**Gleichstandsregel in Schritt 4 nötig:** Symmetrische Zeichen (Einzelpunkt, gerader Strich, viele `-`, `|`, `+`) haben `14 - sx/sm = 0.5` genau auf der Rundungsgrenze. Ob `Math.round` dann 0 oder 1 liefert, entscheidet Rundungsrauschen der Summation (gemessen: 0.4999999999999982 gegen 0.5000000000000018) – das ist ein ganzes Pixel Versatz und bricht jeden 1e-4-Abgleich. Verbindlich (Training und `raster_check.json` sind so gerechnet):

```js
const dx = Math.round(14 - sx / sm + 1e-3), dy = Math.round(14 - sy / sm + 1e-3);   // sx = Σ v·Spalte, sy = Σ v·Zeile, sm = Σ v
```

Sonst genau DESIGN.md: lw = 10, s = 70/max(B,H,1), BBox-Mitte auf (56,56), Pixelmitte (i+0.5, j+0.5), Deckung clamp(5.5 − d, 0, 1) mit Maximum über Striche, Einzelpunkt = Kreis, Segmente der Länge 0 = Punkt, 4×4-Mittel. `cnn2_eval.js` enthält eine unabhängige JS-Fassung (`rasterize`), die alle 20 Fälle von `raster_check.json` auf < 1e-6 trifft – R kann sie übernehmen. Die DESIGN.md sollte um die Regel ergänzt werden (darf ich nicht ändern).

Weitere Hinweise:
- Merkmalsvektor für „eigene Handschrift“: `h = ReLU(fc F)`, F = 160, L2-normiert (wie `cnnEval` der Mathe-App, Ausgabeschicht rechnet mit dem nicht normierten h).
- Punkte: Durch s = 70/max(B,H,1) wird ein Stiftpunkt mit 2–4 px Ausdehnung auf volle Größe gestreckt und sieht dann aus wie ein kurzer Strich oder Kringel (siehe `samples_crohme_vs_hasy_2.png`, Zeile „.“). Das Modell kann `.` darum nur schlecht von `-`, `/`, `,`, `'` trennen. **Empfehlung:** Punkt (und Malpunkt) in R über die absolute Größe relativ zur Zeilenhöhe erkennen, bevor das Netz gefragt wird; ebenso `,` / `'` / `.` über Lage.
- Klasse `†` ist neu (HASY `\dag`, laut Hauptsitzung); `⟨`/`⟩` enthalten `<`/`>`; `|` enthält `\mid`; `o`/`O` gibt es nicht (wird meist `0`).
- `+` und das neue `†` werden verwechselt (CROHME-Test: `+`→`†` 13×, HASY-anonym `†`→`+` 3×). R sollte `†` nur hochgestellt/hinter Operator zulassen und sonst `+` nehmen (und umgekehrt).
- Zeichen ohne Klasse (gemessen am CROHME-Test): `o`→`0` (17/18), `×`→`x` (36/37), `X`→`x` (52/52), `…`→`.` (20/20, eine Gruppe aus 3 Punkten); `≠`, `G`, `I` (mit Serifen) landen mit geringer Sicherheit (mittleres max p 0,35–0,43) bei `pm`/`+`, `6`/`C`, `Φ`/`]`/`T`. Ein niedriges max p ist also ein brauchbares Signal „unbekanntes Zeichen / falsch gruppiert“.
- Klassenliste in Modellreihenfolge steht in `sym-qm.json` (`classes`), Namen genau wie DESIGN.md (`"sqrt"`, `"pm"`, `"Σ"` …).

## Datenquellen, Herkunft, Lizenz

**CROHME 2011–2013** (Competition on Recognition of Online Handwritten Mathematical Expressions, TC11/ICDAR bzw. ICFHR; H. Mouchère, C. Viard-Gaudin, R. Zanibbi, U. Garain, D. H. Kim, J. H. Kim). Bezogen als `data/CROHME_full_v2.zip` aus `github.com/ThomasLech/CROHME_extractor` (inoffizielle Kopie), entpackt nach `/home/claude/dl/crohme_data` (Pfade auf „..“ geprüft, nur .inkml/.txt/.html). Benutzt: `CROHME2013_data/TrainINKML` (enthält die Trainingsdaten 2011/2012 und HAMEX, KAIST, MathBrush, MfrDB, expressmatch) für Training, `TestINKMLGT` (2013-Testsatz, eigene Schreiber) nur für Test. Lizenz laut `readme.txt` im Archiv: Copyright Université de Nantes/CNRS, **CC BY-NC-SA 3.0**; die Teilkorpora behalten ihre eigenen Copyrights (Univ. São Paulo, Univ. Waterloo, KAIST, TU Prag, Univ. Nantes). Die `Readme.txt` des 2013-Ordners sagt außerdem „Please do not distribute this unofficial data set“. Zitierbitte: Mouchère u. a., ICDAR 2013 CROHME, Proc. ICDAR 2013; ICFHR 2012 CROHME.

**HASYv2** (M. Thoma, „The HASYv2 dataset“, arXiv:1701.08380, 2017; Daten auf Zenodo, Record 259444). Benutzt wurde die vorhandene Kopie `/home/claude/dl/hasy` – das ist ein Fork (`Proyecto-7-MathVision-IA/Math-Client-App-HasyV2`) mit 168 233 Bildern (Original laut README: 168 236). Lizenz: Laut Hauptsitzung nennt das Paper (Anhang „Obtaining the data“) **ODbL** mit der Bitte, das Paper zu zitieren; das README des Forks sagt ebenfalls ODbL 1.0. Selbst geprüft habe ich nur: Das Original-Repository `MartinThoma/HASY` (geklont nach `/home/claude/dl/hasy_orig`) nennt keine Datenlizenz, nur MIT für den Python-Code (`setup.cfg`). Paper und Zenodo-Seite konnte ich hier nicht öffnen – die ODbL-Angabe ist also übernommen, nicht von mir am Original bestätigt.

**Lizenzfolgen (unsicher, bitte prüfen lassen):** CROHME ist *NonCommercial* und *ShareAlike*. Ob ein daraus trainiertes Modell (Gewichte) als Bearbeitung gilt, ist rechtlich ungeklärt; bei kommerzieller Weitergabe der App wäre CROHME ein Risiko. `testdata/strokes_test.json` und `raster_check.json` enthalten echte CROHME-Striche, sind also Bearbeitungen der Daten und sollten nur intern bleiben bzw. unter CC BY-NC-SA 3.0 mit Quellenangabe stehen. HASY (ODbL) verlangt Namensnennung und für weitergegebene Datenbanken dieselbe Lizenz.

## Klassen, Zuordnung, Anzahlen

103 Klassen (DESIGN.md + `†`). Zuordnung der Quellnamen (`classes.py`):
- CROHME: Ziffern/Buchstaben direkt; `\alpha \beta \gamma \theta \lambda \mu \pi \sigma \phi \Delta` → griechisch; `\sum`→Σ, `\int`→∫, `\infty`→∞, `\sqrt`→sqrt, `\pm`→pm, `\lt`→⟨, `\gt`→⟩, `\{ \}`→{ }, `\prime`→', `.`, `,`, `!`, `/`, `|`, `( ) [ ]`, `+ - =`.
- HASY: zusätzlich `\delta \kappa \nu \xi \rho \tau \chi \psi \omega \Phi \Psi \Omega \partial \hbar \nabla \uparrow \downarrow \otimes \ast \dag \langle \rangle \cdot`, Buchstaben, Ziffern, `[ ] \{ \} | / + - < >`.
- **Zusammenlegungen:** `\phi`+`\varphi`→φ; `\epsilon`+`\varepsilon`→ε; `\theta`+`\vartheta`→θ; `\kappa`+`\varkappa`→κ; `\rho`+`\varrho`→ρ; `\sum`+`\Sigma`→Σ; `<`+`\langle`+`\lt`→⟨; `>`+`\rangle`+`\gt`→⟩; `|`+`\mid`→|; `\cdot`+`.`→.; `\prime`→'; `\dag`→†.
- Nicht benutzt: CROHME `\ldots`, `\cdots`, `\sin \cos \tan \log \lim` (eine Spurgruppe für mehrere Buchstaben), `\times \div \neq \leq \geq \rightarrow \in \exists \forall` (keine Zielklasse), `o`/`O`.
- **HASY je Klasse höchstens 1600 Bilder** (alle bekannten Nutzer, Rest zufällig aus dem Anonymkonto), weil Σ, ∫, ∞ … sonst mehrere Tausend hätten.

**Schreibertrennung:** CROHME-Test = 2013-Testsatz. HASY: `user_id 16925` ist das Anonymkonto (91 % aller HASY-Bilder, vermutlich Detexify/Web ohne Anmeldung) und lässt sich nicht nach Schreibern trennen; von den übrigen 366 Nutzern (mit Bildern in unseren Klassen) gehen 15 % (55 Nutzer, Zufall mit festem Startwert) komplett in den Test. Vom Anonymkonto sind 10 % zufällig zurückgehalten – das ist nur ein Plausibilitätstest (gleiche Schreiber können in Training und Test sein).

**Zu wenig Daten / unsicher:**
- `D`: nur 32 Trainingsbilder (nur HASY, kein CROHME), 26 Testbilder.
- `!`: 98 (nur CROHME, 5 Testbilder); `'`: 211; `l`, `w`, `H`, `P`, `T`, `V`, `M`, `S`, `E`, `L`, `N`, `F`: 130–200 Originale.
- `↑`, `↓`, `†`, `⊗`, `*`: fast nur Anonymkonto – keine echte Schreibertrennung im Test (↑/↓ je 1 Bild von Testnutzern, † keines). `ψ Φ ν ξ τ χ ω Ψ` haben 9–13 Testbilder von Testnutzern.
- Klassen nur aus HASY (δ ε κ ν ξ ρ τ χ ψ ω Φ Ψ Ω ∂ ħ ∇ ↑ ↓ ⊗ * † D) kennt das Netz nur als Skelett-Polylinien aus Bildern, nie als echte Stiftstriche. Wie gut echte Stifteingabe dieser Zeichen erkannt wird, ist ungemessen – erste Kandidaten für „Handschrift anlernen“.

| Klasse | CROHME Train | HASY Train | Trainingsbeispiele (augm.) | CROHME-Test n / % | HASY-Test n / % | HASY-anonym n / % |
|---|---|---|---|---|---|---|
| `0` | 1795 | 56 | 5281 | 128 / 89.1 | 77 / 98.7 | – |
| `1` | 6219 | 69 | 5281 | 314 / 61.5 | 49 / 85.7 | – |
| `2` | 6195 | 76 | 5281 | 338 / 91.7 | 47 / 97.9 | 1 / 100.0 |
| `3` | 2458 | 86 | 5281 | 117 / 98.3 | 34 / 100.0 | – |
| `4` | 1635 | 51 | 5058 | 77 / 100.0 | 10 / 100.0 | – |
| `5` | 1003 | 54 | 3171 | 49 / 87.8 | 24 / 91.7 | – |
| `6` | 795 | 60 | 2565 | 38 / 84.2 | 40 / 95.0 | – |
| `7` | 749 | 51 | 2400 | 33 / 97.0 | 24 / 95.8 | – |
| `8` | 728 | 68 | 2388 | 28 / 92.9 | 52 / 98.1 | 1 / 100.0 |
| `9` | 728 | 65 | 2379 | 26 / 53.8 | 25 / 48.0 | – |
| `a` | 2475 | 58 | 5281 | 137 / 88.3 | 27 / 96.3 | 1 / 100.0 |
| `b` | 1599 | 35 | 4902 | 81 / 97.5 | 22 / 100.0 | – |
| `c` | 941 | 45 | 2958 | 52 / 40.4 | 22 / 81.8 | – |
| `d` | 1063 | 37 | 3300 | 89 / 97.8 | 21 / 95.2 | – |
| `e` | 463 | 46 | 1886 | 39 / 82.1 | 16 / 62.5 | 1 / 100.0 |
| `f` | 679 | 51 | 2190 | 52 / 80.8 | 15 / 73.3 | – |
| `g` | 321 | 36 | 1886 | 24 / 83.3 | 20 / 90.0 | – |
| `h` | 269 | 36 | 1886 | 22 / 100.0 | 22 / 100.0 | – |
| `i` | 959 | 35 | 2982 | 96 / 97.9 | 24 / 100.0 | – |
| `j` | 301 | 29 | 1886 | 24 / 95.8 | 24 / 95.8 | – |
| `k` | 619 | 30 | 1947 | 45 / 82.2 | 27 / 100.0 | 1 / 100.0 |
| `l` | 119 | 33 | 1886 | 18 / 72.2 | 23 / 17.4 | – |
| `m` | 476 | 38 | 1886 | 45 / 91.1 | 19 / 84.2 | – |
| `n` | 2239 | 43 | 5281 | 140 / 87.1 | 18 / 100.0 | – |
| `p` | 565 | 34 | 1886 | 63 / 66.7 | 21 / 66.7 | – |
| `q` | 309 | 44 | 1886 | 38 / 55.3 | 25 / 52.0 | – |
| `r` | 487 | 33 | 1886 | 37 / 67.6 | 28 / 78.6 | – |
| `s` | 238 | 41 | 1886 | 53 / 50.9 | 18 / 61.1 | – |
| `t` | 695 | 0 | 2085 | 70 / 85.7 | – | – |
| `u` | 321 | 37 | 1886 | 62 / 96.8 | 20 / 75.0 | – |
| `v` | 285 | 31 | 1886 | 63 / 50.8 | 32 / 65.6 | – |
| `w` | 139 | 36 | 1886 | 27 / 77.8 | 20 / 100.0 | – |
| `x` | 5042 | 49 | 5281 | 261 / 80.8 | 17 / 94.1 | – |
| `y` | 1765 | 35 | 5281 | 82 / 92.7 | 22 / 100.0 | 1 / 100.0 |
| `z` | 1074 | 41 | 3345 | 49 / 95.9 | 19 / 94.7 | – |
| `A` | 277 | 78 | 1886 | 43 / 100.0 | 80 / 96.2 | 1 / 100.0 |
| `B` | 239 | 47 | 1886 | 26 / 92.3 | 14 / 78.6 | – |
| `C` | 258 | 63 | 1886 | 30 / 53.3 | 69 / 62.3 | 2 / 100.0 |
| `D` | 0 | 32 | 1886 | – | 26 / 96.2 | – |
| `E` | 144 | 26 | 1886 | 52 / 96.2 | 28 / 85.7 | – |
| `F` | 168 | 37 | 1886 | 21 / 76.2 | 19 / 94.7 | – |
| `H` | 100 | 29 | 1886 | 27 / 100.0 | 35 / 100.0 | – |
| `L` | 136 | 39 | 1886 | 49 / 95.9 | 71 / 97.2 | 1 / 100.0 |
| `M` | 99 | 51 | 1886 | 41 / 92.7 | 68 / 98.5 | 1 / 100.0 |
| `N` | 135 | 47 | 1886 | 38 / 100.0 | 58 / 98.3 | – |
| `P` | 106 | 27 | 1886 | 59 / 55.9 | 45 / 40.0 | – |
| `R` | 187 | 32 | 1886 | 49 / 100.0 | 51 / 100.0 | – |
| `S` | 118 | 37 | 1886 | 48 / 54.2 | 25 / 24.0 | 1 / 0.0 |
| `T` | 97 | 34 | 1886 | 53 / 84.9 | 22 / 95.5 | – |
| `V` | 106 | 29 | 1886 | 52 / 75.0 | 27 / 63.0 | – |
| `α` | 383 | 1365 | 5244 | 29 / 89.7 | 98 / 95.9 | 137 / 94.2 |
| `β` | 295 | 957 | 3756 | 11 / 100.0 | 71 / 98.6 | 103 / 96.1 |
| `γ` | 90 | 983 | 3219 | 9 / 100.0 | 57 / 94.7 | 100 / 85.0 |
| `δ` | 0 | 1099 | 3297 | – | 22 / 100.0 | 125 / 86.4 |
| `ε` | 0 | 1107 | 3321 | – | 77 / 100.0 | 101 / 94.1 |
| `θ` | 544 | 836 | 4140 | 24 / 91.7 | 9 / 100.0 | 88 / 97.7 |
| `κ` | 0 | 337 | 1886 | – | 25 / 84.0 | 32 / 71.9 |
| `λ` | 27 | 891 | 2754 | 4 / 75.0 | 15 / 93.3 | 90 / 96.7 |
| `μ` | 46 | 1056 | 3306 | 17 / 100.0 | 13 / 92.3 | 78 / 92.3 |
| `ν` | 0 | 341 | 1886 | – | 10 / 80.0 | 40 / 87.5 |
| `ξ` | 0 | 1458 | 4374 | – | 9 / 100.0 | 133 / 91.7 |
| `π` | 498 | 1379 | 5281 | 25 / 96.0 | 11 / 100.0 | 143 / 95.8 |
| `ρ` | 0 | 801 | 2403 | – | 24 / 95.8 | 89 / 84.3 |
| `σ` | 52 | 1006 | 3174 | 14 / 92.9 | 19 / 100.0 | 98 / 94.9 |
| `τ` | 0 | 372 | 1886 | – | 13 / 100.0 | 39 / 84.6 |
| `φ` | 83 | 1440 | 4569 | 8 / 100.0 | 22 / 95.5 | 138 / 91.3 |
| `χ` | 0 | 826 | 2478 | – | 13 / 92.3 | 90 / 72.2 |
| `ψ` | 0 | 510 | 1886 | – | 9 / 88.9 | 43 / 65.1 |
| `ω` | 0 | 555 | 1886 | – | 12 / 83.3 | 64 / 95.3 |
| `Δ` | 35 | 835 | 2610 | 21 / 100.0 | 68 / 100.0 | 93 / 95.7 |
| `Φ` | 0 | 549 | 1886 | – | 9 / 88.9 | 49 / 87.8 |
| `Ψ` | 0 | 397 | 1886 | – | 12 / 83.3 | 39 / 64.1 |
| `Ω` | 0 | 692 | 2076 | – | 53 / 100.0 | 78 / 96.2 |
| `+` | 5410 | 72 | 5281 | 267 / 93.6 | 16 / 93.8 | 2 / 100.0 |
| `-` | 7940 | 90 | 5281 | 439 / 98.9 | 28 / 100.0 | – |
| `=` | 3611 | 0 | 5281 | 319 / 99.7 | – | – |
| `(` | 3945 | 0 | 5281 | 294 / 98.3 | – | – |
| `)` | 3939 | 0 | 5281 | 295 / 98.3 | – | – |
| `[` | 201 | 779 | 2940 | 19 / 89.5 | 65 / 96.9 | 72 / 95.8 |
| `]` | 201 | 191 | 1886 | 19 / 84.2 | 53 / 98.1 | 15 / 93.3 |
| `{` | 69 | 1003 | 3216 | 6 / 83.3 | 34 / 97.1 | 99 / 92.9 |
| `}` | 69 | 269 | 1886 | 6 / 100.0 | 26 / 88.5 | 26 / 92.3 |
| `\|` | 448 | 699 | 3441 | 88 / 85.2 | 75 / 100.0 | 73 / 97.3 |
| `,` | 621 | 0 | 1886 | 94 / 30.9 | – | – |
| `.` | 705 | 620 | 3975 | 38 / 81.6 | 50 / 78.0 | 68 / 95.6 |
| `'` | 82 | 129 | 1886 | 45 / 13.3 | 1 / 0.0 | 17 / 35.3 |
| `!` | 98 | 0 | 1886 | 5 / 80.0 | – | – |
| `/` | 196 | 418 | 1886 | 28 / 75.0 | 64 / 98.4 | 50 / 74.0 |
| `sqrt` | 1793 | 830 | 5281 | 86 / 95.3 | 56 / 83.9 | 92 / 95.7 |
| `pm` | 153 | 1305 | 4374 | 8 / 100.0 | 59 / 98.3 | 164 / 90.9 |
| `∫` | 605 | 1436 | 5281 | 25 / 100.0 | 19 / 100.0 | 145 / 94.5 |
| `Σ` | 625 | 1353 | 5281 | 24 / 95.8 | 88 / 95.5 | 159 / 96.9 |
| `∂` | 0 | 1429 | 4287 | – | 31 / 100.0 | 140 / 96.4 |
| `∞` | 376 | 1445 | 5281 | 25 / 96.0 | 15 / 100.0 | 140 / 98.6 |
| `ħ` | 0 | 419 | 1886 | – | 55 / 98.2 | 45 / 91.1 |
| `∇` | 0 | 1086 | 3258 | – | 16 / 100.0 | 115 / 99.1 |
| `⟨` | 106 | 764 | 2610 | 12 / 100.0 | 61 / 98.4 | 51 / 96.1 |
| `⟩` | 56 | 195 | 1886 | 9 / 100.0 | 43 / 97.7 | 22 / 100.0 |
| `↑` | 0 | 195 | 1886 | – | 1 / 100.0 | 31 / 93.5 |
| `↓` | 0 | 185 | 1886 | – | 1 / 100.0 | 18 / 88.9 |
| `⊗` | 0 | 984 | 2952 | – | 6 / 100.0 | 86 / 97.7 |
| `*` | 0 | 490 | 1886 | – | 14 / 100.0 | 53 / 96.2 |
| `†` | 0 | 232 | 1886 | – | – | 20 / 75.0 |

## Verwechslungen (wahr → erkannt, Anzahl)

- **CROHME-Test:** `1`→`|` 109, `,`→`)` 30, `c`→`C` 28, `P`→`p` 26, `x`→`χ` 20, `S`→`s` 19, `p`→`P` 18, `q`→`9` 17, `s`→`S` 17, `,`→`/` 15, `'`→`/` 13, `+`→`†` 13, `v`→`V` 12, `V`→`v` 12, `C`→`c` 11, `9`→`q` 11, `v`→`ν` 10, `x`→`κ` 10, `'`→`,` 9, `'`→`|` 8
- **HASY-Testnutzer:** `C`→`c` 26, `P`→`p` 23, `l`→`|` 15, `S`→`s` 14, `q`→`9` 11, `v`→`V` 11, `V`→`v` 10, `9`→`g` 9, `e`→`ρ` 6, `sqrt`→`∫` 6, `1`→`]` 5, `s`→`S` 5, `S`→`∫` 4, `c`→`C` 4, `p`→`P` 4, `E`→`ε` 3, `P`→`ρ` 3, `9`→`q` 3, `m`→`n` 3, `r`→`γ` 3
- **HASY-anonym:** `χ`→`x` 22, `pm`→`+` 14, `Ψ`→`ψ` 11, `ψ`→`Ψ` 10, `φ`→`Φ` 7, `'`→`/` 7, `α`→`a` 5, `δ`→`∂` 5, `Φ`→`φ` 5, `/`→`'` 5, `/`→`,` 5, `κ`→`x` 4, `ρ`→`P` 4, `ρ`→`p` 4, `Σ`→`ε` 3, `τ`→`T` 3, `φ`→`y` 3, `†`→`+` 3, `'`→`,` 3, `π`→`x` 2

## Rasterung und HASY-Umwandlung

- `raster.py`: `rasterize_ref` (exakt nach Vorschrift, float64, ganzes 112er-Raster) und `rasterize_fast` (gleiche Formel, nur Fenster um die Striche, vektorisiert; Abweichung < 1e-6, ~2 ms je Zeichen). Training, Test und `raster_check.json` benutzen diese Rasterung.
- CROHME-Koordinaten werden je Ausdruck einheitlich skaliert (Median der Größe von Ziffern/Buchstaben = 40 Einheiten ≈ CSS-Pixel), weil die Rohgrößen zwischen 22 und 234 Einheiten schwanken; wichtig nur für die Untergrenze `max(B,H,1)` (Punkte).
- HASY (32×32, binär, ~1 px Linien): Zhang-Suen-Ausdünnung (`cv2.ximgproc.thinning`), Skelett als Graph (4er-Nachbarn, Diagonale nur ohne 4er-Umweg), Zerlegung in Äste, Sporne ≤ 2,5 px entfernen, Äste an Knoten mit möglichst gerader Fortsetzung verbinden, leicht glätten, Douglas-Peucker 0,12 px. Drei Ausdünnungsvarianten: direkt; 3fach bikubisch hochskaliert (Schwelle 0,45); erst geweitet (3×3-Kreuz), dann 3fach. Danach wie echte Striche gerastert → Strichstärke und Lage passen (Bilder `samples_crohme_vs_hasy_1.png`, `_2.png`: links CROHME, rechts HASY; `samples_hasy_variants.png`: je 3 Varianten). Grenzen: HASY-Bilder enthalten oft einen Startpunkt-Klecks (z. B. bei ε, Σ); kleine Pfeilspitzen (↑ ↓) verschmelzen bei lw = 10 zu einem Klecks – das passiert in der App genauso.

## Datensatz und Augmentierung

- 307144 Trainingsbeispiele (uint8, 241 MB), je Klasse T = clip(3·n, 1886, 5281) (Überabtastung seltener Klassen), bei Klassen mit beiden Quellen mindestens 20 % HASY (damit der Stil echt/Skelett nichts über die Klasse verrät).
- Je Beispiel (88 %): Strichversatz bei mehreren Strichen (σ = 2,5 % der Größe, p = 0,5), geglätteter Punkt-Jitter (σ bis 1,2 %), Drehung ±8°, Scherung ±0,15, Streckung exp(N(0, 0,1)) gegenläufig in x/y, Größe ×exp(U(−0,5, 0,5)); 12 % unverändert. HASY: zufällige Ausdünnungsvariante. Punkt: 30 % künstliche Punkte (1–6 Punkte, Radius 0–2,5).
- Ansicht: `samples_augmented.png`.

## Architektur und Training

- `cnn.py`: 28×28 → conv3×3, 24, ReLU → max2 (26→13) → conv3×3, 48, ReLU → max2 (11→5) → 1200 → fc 160, ReLU (Merkmale) → fc 103 → softmax. im2col, He-Initialisierung, Adam (lr 2e-3, 300 Schritte Anlauf, Kosinus bis 3e-5), Batch 256, Dropout 0,2 auf den Merkmalen, Label-Smoothing 0,05, L2 1e-5.
- Gradientenprüfung (float64, zentrale Differenzen, kleines Netz 4/5/7/6, je Parameter 14 Einträge): größter relativer Fehler 3.963e-07 (`work/gradcheck.log`).
- Verlauf (Test nur zur Beobachtung, nicht zur Auswahl; exportiert ist die letzte Epoche):

| Epoche | Verlust | Train-Gen. | CROHME | HASY | HASY-anon | Zeit |
|---|---|---|---|---|---|---|
| 1 | 1.5342 | 0.7070 | 85.7 | 90.1 | 87.1 | 3 min |
| 2 | 0.9998 | 0.8455 | 85.8 | 88.3 | 89.7 | 6 min |
| 3 | 0.9312 | 0.8659 | 86.5 | 90.4 | 90.2 | 10 min |
| 4 | 0.8918 | 0.8768 | 86.3 | 89.9 | 90.4 | 13 min |
| 5 | 0.8626 | 0.8861 | 86.0 | 91.4 | 91.6 | 16 min |
| 6 | 0.8401 | 0.8931 | 86.6 | 91.6 | 91.5 | 20 min |
| 7 | 0.8216 | 0.8995 | 86.4 | 90.4 | 91.6 | 23 min |
| 8 | 0.8051 | 0.9047 | 86.6 | 90.6 | 91.6 | 26 min |
| 9 | 0.7899 | 0.9099 | 86.6 | 89.9 | 91.4 | 30 min |
| 10 | 0.7769 | 0.9142 | 86.5 | 91.0 | 91.6 | 33 min |
| 11 | 0.7647 | 0.9188 | 86.8 | 90.9 | 91.6 | 37 min |
| 12 | 0.7558 | 0.9219 | 86.6 | 90.9 | 91.7 | 40 min |
| 13 | 0.7475 | 0.9249 | 86.4 | 90.5 | 91.7 | 44 min |
| 14 | 0.7405 | 0.9275 | 86.6 | 90.8 | 91.7 | 48 min |
| 15 | 0.7373 | 0.9295 | 86.7 | 90.9 | 91.8 | 52 min |
| 16 | 0.7345 | 0.9304 | 86.7 | 90.9 | 91.9 | 56 min |

- Quantisierung: int8 je Schicht, scale = max|W|/127, Biases float. Top-1 float → int8: crohme 86.7 → 86.6 %; hasy 90.9 → 90.9 %; hasy_anon 91.8 → 91.9 %.
- `cnn2_eval.js` (Node, ohne Abhängigkeiten) lädt das JSON und rechnet 60 Testbilder aus `eval_check.json` nach (Vergleich mit Python, quantisierte Gewichte): 60 Bilder, größte Abweichung der Wahrscheinlichkeiten 4.42e-7, gleiche Top-1 60/60. Das belegt die Speicherreihenfolge. Rasterabgleich gegen `raster_check.json` (eigene JS-Rasterung): 20 Fälle, größte Abweichung 4.99e-7.
- Gegenprobe ganz in JS (JS-Rasterung + JS-Modell) auf `testdata/strokes_test.json`: 3040 Beispiele, Top-1 85.8 %; schwächste Klassen: ' 10% (30), , 27% (30), 1 33% (30), v 47% (30), l 50% (30), c 53% (30), s 53% (30), C 53% (30), 9 57% (30), q 57% (30), S 60% (30), r 63% (30), P 63% (30), p 70% (30), x 73% (30). (`node cnn2_eval.js --strokes`)

## Dateien

- `/home/claude/qm/src/ui/model/sym-qm.json` – Modell
- `/home/claude/ink/train/raster_check.json` – 20 Rasterfälle (Einzelpunkt, zwei Punkte, Mini-Punkt < 1, waagerecht, sehr flach, Länge-0-Segmente, negative Koordinaten, 11 CROHME-Testzeichen, 2 HASY-Polylinien)
- `/home/claude/ink/testdata/strokes_test.json` – je Klasse bis 30 Beispiele fremder Schreiber, Format `{klasse: [[ [ {x,y}, … ], … ], …]}`; Herkunft je Beispiel (gleiche Reihenfolge) in `strokes_test_meta.json` (`src`: `crohme` = echte Striche, `hasy-skelett` = aus Bild gewonnen, Testnutzer; `hasy-skelett-anonym` = Anonymkonto). Koordinaten: CROHME je Ausdruck einheitlich skaliert (normales Zeichen ≈ 40), HASY 32er-Pixel × 40/31; y nach unten. `!` hat nur 5, `†` 20, `↓` 19 Beispiele.
- `/home/claude/ink/train/`: `extract_crohme.py`, `hasy_strokes.py`, `classes.py`, `raster.py`, `build_dataset.py`, `cnn.py`, `train.py`, `export.py`, `evaluate.py`, `make_raster_check.py`, `make_testdata.py`, `make_samples.py`, `make_report.py`, `cnn2_eval.js`, `eval_check.json`, Bilder `samples_*.png`; Zwischenstände `work/ckpt_epNN.npz`, Logs `work/*.log`, Auswertung `work/eval.json`.
- Ablauf: `extract_crohme.py` → `hasy_strokes.py` → `build_dataset.py` → `cnn.py` (Prüfung) → `train.py` → `export.py` → `node cnn2_eval.js` → `evaluate.py` → `make_testdata.py`, `make_raster_check.py`, `make_samples.py`, `make_report.py` (alle mit `python3 -I`).

## Bekannte Schwächen

- Zeichen nur aus HASY sind nie mit echten Stiftstrichen trainiert oder getestet (s. o.); Messwerte für ↑ ↓ † ⊗ * stammen nur aus dem Anonymkonto und sind zu optimistisch.
- Punkt/Komma/Strich/`|`/`1`/`l`/`/` sind nach der Normierung auf volle Größe kaum zu unterscheiden; R muss Größe und Lage nutzen (s. o.).
- `×` ist keine Klasse; ein geschriebenes Malkreuz wird `x` (36/37 im CROHME-Test), `o` wird `0` (17/18).
- Testgenauigkeit stagniert ab Epoche ~6 (CROHME ~86,5 %), Trainingsgenauigkeit steigt weiter: Grenze liegt eher in den Daten (Mehrdeutigkeit, ein fester augmentierter Satz) als im Netz. Mehr Wirkung als längeres Training hätten: frisch augmentierte Daten je Epoche, echte Stiftdaten für die HASY-Klassen.
- Wenige Daten für `D`, `!`, `'`, einige Großbuchstaben; CROHME-Testsatz hat für manche Klassen nur 4–10 Beispiele (λ, φ, γ, pm, {, }, !) – die Prozentwerte dort sind grob.
- Die Testgenauigkeit wurde je Epoche mitgeschrieben, aber nicht zur Auswahl benutzt (letzte Epoche exportiert).
- CROHME-Lizenz NC/SA (s. o.).
