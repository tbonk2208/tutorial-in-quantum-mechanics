/* ===== Quellen ===== */
const SOURCES_TEXT = `**Fachliche Grundlage (Standardstoff Quantenmechanik I).** Die Aufgaben sind eigene Fassungen von Standardaufgaben; Verweise wie „vgl. Griffiths Aufg. …“ nennen die verwandte Lehrbuchaufgabe.

1. D. J. Griffiths, D. F. Schroeter: *Introduction to Quantum Mechanics*, 3. Aufl., Cambridge University Press 2018.
2. W. Nolting: *Grundkurs Theoretische Physik 5/1: Quantenmechanik – Grundlagen* und *5/2: Methoden und Anwendungen*, Springer Spektrum.
3. F. Schwabl: *Quantenmechanik (QM I)*, Springer.
4. J. J. Sakurai, J. Napolitano: *Modern Quantum Mechanics*, 3. Aufl., Cambridge University Press 2020.
5. C. Cohen-Tannoudji, B. Diu, F. Laloë: *Quantum Mechanics*, Bd. 1 und 2, 2. Aufl., Wiley-VCH 2019/2020.
6. CODATA-Werte der Naturkonstanten (NIST): https://physics.nist.gov/cuu/Constants/

**Mathematische Grundlagen (Kapitel M1–M8).** Stoff der „Methoden der Physik“ in den ersten Semestern, so weit die Quantenmechanik ihn braucht. Kapitelangaben wie „Boas Kap. 7“ beziehen sich auf die genannte Auflage.

7. M. L. Boas: *Mathematical Methods in the Physical Sciences*, 3. Aufl., Wiley 2006.
8. G. B. Arfken, H. J. Weber, F. E. Harris: *Mathematical Methods for Physicists*, 7. Aufl., Academic Press 2013.
9. K. F. Riley, M. P. Hobson, S. J. Bence: *Mathematical Methods for Physics and Engineering*, 3. Aufl., Cambridge University Press 2006.
10. C. B. Lang, N. Pucker: *Mathematische Methoden in der Physik*, 3. Aufl., Springer Spektrum 2016.
11. S. Großmann: *Mathematischer Einführungskurs für die Physik*, 10. Aufl., Vieweg+Teubner 2012.
12. Griffiths & Schroeter (Nr. 1), Anhang A „Linear Algebra“ und Kap. 3 (Hilbertraum, Operatoren).

**Physikdidaktische Forschung zur Quantenmechanik** (typische Fehlvorstellungen, die in den Rückfragen und „Fehler finden“ aufgegriffen werden):

13. C. Singh, E. Marshman (2015): Review of student difficulties in upper-level quantum mechanics. *Phys. Rev. ST Phys. Educ. Res.* 11, 020117. https://doi.org/10.1103/PhysRevSTPER.11.020117
14. E. Marshman, C. Singh (2015): Framework for understanding the patterns of student difficulties in quantum mechanics. *Phys. Rev. ST Phys. Educ. Res.* 11, 020119. https://doi.org/10.1103/PhysRevSTPER.11.020119
15. D. F. Styer (1996): Common misconceptions regarding quantum mechanics. *Am. J. Phys.* 64, 31–34. https://doi.org/10.1119/1.18288
16. C. Singh (2008): Interactive learning tutorials on quantum mechanics. *Am. J. Phys.* 76, 400–405. https://doi.org/10.1119/1.2837812
17. S. B. McKagan, K. K. Perkins, M. Dubson, C. Malley, S. Reid, R. LeMaster, C. E. Wieman (2008): Developing and researching PhET simulations for teaching quantum mechanics. *Am. J. Phys.* 76, 406–417. https://doi.org/10.1119/1.2885199 (Grundlage für den Aufbau des Labors)
18. K. Krijtenburg-Lewerissa, H. J. Pol, A. Brinkman, W. R. van Joolingen (2017): Insights into teaching quantum mechanics in secondary and lower undergraduate education. *Phys. Rev. Phys. Educ. Res.* 13, 010109. https://doi.org/10.1103/PhysRevPhysEducRes.13.010109

**Lernforschung** (Aufbau des Lernwegs, wie in der Mathe-Lernhilfe https://github.com/tbonk2208/mathe-lernhilfe):

19. K. VanLehn (2011): The relative effectiveness of human tutoring, intelligent tutoring systems, and other tutoring systems. *Educational Psychologist* 46(4), 197–221. https://doi.org/10.1080/00461520.2011.611369 – Rückmeldung zu jedem Schritt.
20. A. Renkl, R. K. Atkinson (2003): Structuring the transition from example study to problem solving in cognitive skill acquisition. *Educational Psychologist* 38(1), 15–22. https://doi.org/10.1207/S15326985EP3801_3 – Beispiele, die schrittweise ausgeblendet werden.
21. K. Bisra, Q. Liu, J. C. Nesbit, F. Salimi, P. H. Winne (2018): Inducing self-explanation: A meta-analysis. *Educational Psychology Review* 30(3), 703–725. https://doi.org/10.1007/s10648-018-9434-x – „Warum?“-Fragen.
22. M. Kapur (2016): Examining productive failure, productive success, unproductive failure, and unproductive success in learning. *Educational Psychologist* 51(2), 289–299. https://doi.org/10.1080/00461520.2016.1155457 – Knobelaufgabe vor der Erklärung.
23. T. Sinha, M. Kapur (2021): When problem solving followed by instruction works: Evidence for productive failure. *Review of Educational Research* 91(5), 761–798. https://doi.org/10.3102/00346543211019105
24. B. Rittle-Johnson, J. R. Star (2007): Does comparing solution methods facilitate conceptual and procedural knowledge? *Journal of Educational Psychology* 99(3), 561–574. – Schritt „Vergleichen“.
25. J. Dunlosky u. a. (2013): Improving students’ learning with effective learning techniques. *Psychological Science in the Public Interest* 14(1), 4–58. https://doi.org/10.1177/1529100612453266 – Abrufübung und verteiltes Wiederholen.
26. D. Rohrer, R. F. Dedrick, M. K. Hartwig, C.-N. Cheung (2020): A randomized controlled trial of interleaved mathematics practice. *Journal of Educational Psychology* 112(1), 40–52. https://doi.org/10.1037/edu0000367 – gemischte Runden.
27. D. M. Adams, B. M. McLaren u. a. (2014): Using erroneous examples to improve mathematics learning with a web-based tutoring system. *Computers in Human Behavior* 36, 401–411. https://doi.org/10.1016/j.chb.2014.03.053 – „Fehler finden“.
28. K. R. Koedinger, V. Aleven (2007): Exploring the assistance dilemma in experiments with cognitive tutors. *Educational Psychology Review* 19, 239–264. https://doi.org/10.1007/s10648-007-9049-0 – gestufte Hinweise.
29. H. Bastani u. a. (2025): Generative AI without guardrails can harm learning: Evidence from high school mathematics. *PNAS* 122(26), e2422633122. https://doi.org/10.1073/pnas.2422633122 – Regeln für die optionale KI.

**Wie geprüft wird.** Jede Zeile wird an mehreren zufällig gewählten Parameterwerten (und für Operatorgleichungen an zufälligen Testfunktionen) numerisch ausgewertet; zwei Ausdrücke gelten als gleich, wenn sie überall bis auf eine relative Abweichung von $10^{-7}$ übereinstimmen. Integrale werden adaptiv nach Gauß-Kronrod berechnet, Ableitungen symbolisch. Das erkennt jede gültige Umformung, auch ungewöhnliche Wege. Grenzen: Eine Zeile, die zufällig an allen Stichproben stimmt, aber allgemein falsch ist, wäre extrem unwahrscheinlich, ist aber nicht ausgeschlossen; Näherungen ($\\approx$) und Grenzwerte werden nicht geprüft; ob ein Schritt *begründet* ist, beurteilt der Prüfkern nicht – dafür ist die Spalte „Begründung“ da.

**Aufbau des Lernwegs für das Selbststudium** (ab Version 4: Erklärtext vor dem Beispiel, Diagnose nach Themenkenntnis, Vorhersagen, Konzeptaufgaben, Abschluss unter Prüfungsbedingungen mit Parallelform, Sicherheitsurteil und Fehlerheft):

- P. A. Kirschner, J. Sweller, R. E. Clark (2006): Why minimal guidance during instruction does not work. *Educational Psychologist* 41(2), 75–86 – und die Gegenposition C. E. Hmelo-Silver, R. G. Duncan, C. A. Chinn (2007), *Educational Psychologist* 42(2), 99–107.
- J. J. G. van Merriënboer, P. A. Kirschner (2018): *Ten Steps to Complex Learning*, 3. Aufl., Routledge.
- S. Kalyuga, P. Ayres, P. Chandler, J. Sweller (2003): The expertise reversal effect. *Educational Psychologist* 38(1), 23–31; S. Kalyuga, J. Sweller (2005): Rapid dynamic assessment of expertise. *ETR&D* 53(3), 83–93.
- G. Ashman, S. Kalyuga, J. Sweller (2020): Problem-solving or explicit instruction: Which should go first when element interactivity is high? *Educational Psychology Review* 32, 229–247. https://doi.org/10.1007/s10648-019-09500-5
- K. Loibl, I. Roll, N. Rummel (2017): Towards a theory of when and how problem solving followed by instruction supports learning. *Educational Psychology Review* 29, 693–715.
- R. J. C. M. Salden, V. Aleven, R. Schwonke, A. Renkl (2010): The expertise reversal effect and worked examples in tutored problem solving. *Instructional Science* 38, 289–307. https://doi.org/10.1007/s11251-009-9107-8
- L. E. Richland, N. Kornell, L. S. Kao (2009): The pretesting effect. *Journal of Experimental Psychology: Applied* 15(3), 243–257; C. H. Crouch, A. P. Fagen, J. P. Callan, E. Mazur (2004): Classroom demonstrations. *American Journal of Physics* 72(6), 835–838 – Vorhersagen.
- C. Singh (2001): Student understanding of quantum mechanics. *American Journal of Physics* 69(8), 885–895; G. Zhu, C. Singh (2011): Improving students' understanding of quantum mechanics via the Stern–Gerlach experiment. *American Journal of Physics* 79(5), 499–507 – Konzeptaufgaben.
- C.-L. C. Kulik, J. A. Kulik, R. L. Bangert-Drowns (1990): Effectiveness of mastery learning programs. *Review of Educational Research* 60(2), 265–299; K. A. Rawson, J. Dunlosky, S. M. Sciartelli (2013): The power of successive relearning. *Educational Psychology Review* 25, 523–548 – Abschluss und „sicher“ erst nach Wiederholung.
- P. Van Meter, J. Garner (2005): The promise and practice of learner-generated drawing: Literature review and synthesis. *Educational Psychology Review* 17(4), 285–325; S. Ainsworth, V. Prain, R. Tytler (2011): Drawing to learn in science. *Science* 333(6046), 1096–1097 – Skizzenaufgaben mit Rückfragen zu Merkmalen und Musterskizze.
- T. M. Haladyna, S. M. Downing, M. C. Rodriguez (2002): A review of multiple-choice item-writing guidelines. *Applied Measurement in Education* 15(3), 309–333.
- J. Dunlosky, K. A. Rawson (2012): Overconfidence produces underachievement. *Learning and Instruction* 22(4), 271–280; J. Broadbent, W. L. Poon (2015): Self-regulated learning strategies & academic achievement in online higher education. *The Internet and Higher Education* 27, 1–13 – Sicherheitsurteil, Fehlerheft, Lernplan.

**Handschrifterkennung.** Das Erkennungsnetz für die Stifteingabe (103 Zeichen, Faltungsnetz, läuft im Browser) wurde für dieses Tutorial neu trainiert mit:

30. CROHME 2011–2013, Competition on Recognition of Online Handwritten Mathematical Expressions (H. Mouchère u. a., ICDAR; Université de Nantes/CNRS), Lizenz CC BY-NC-SA 3.0.
31. M. Thoma (2017): The HASYv2 dataset. arXiv:1701.08380. https://arxiv.org/abs/1701.08380 – Daten unter ODbL 1.0.

Die Trainingsdaten sind nicht im Tutorial enthalten, nur die daraus gelernten Gewichte; diese stehen deshalb unter CC BY-NC-SA 3.0 (nicht kommerziell, Weitergabe unter gleichen Bedingungen). Gemessen an fremden Schreibern: einzelne Zeichen zu 87–91 % richtig (unter den ersten drei Vorschlägen zu 98 %); ganze Ausdrücke fremder Schreiber (455 echte Ausdrücke aus dem CROHME-2013-Testsatz, mit Aufgabenzusammenhang) zu 47 % fehlerfrei, zu 57 % unter den ersten drei Lesarten. Kurze Zeilen (1–4 Zeichen) gelingen zu etwa 70 %, lange (ab 21 Zeichen) nur selten; lange Rechnungen schreibst du darum besser in mehreren kurzen Zeilen. Eigene Beispiele („Handschrift anlernen“) und die Korrektur einzelner Zeichen verbessern das; schwierige Zeilen kann optional die KI lesen.

**Schriften und Formelsatz:** KaTeX (MIT-Lizenz), Bricolage Grotesque, Source Sans 3 (SIL Open Font License 1.1).`;
