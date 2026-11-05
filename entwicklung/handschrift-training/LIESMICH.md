# Training des Erkennungsnetzes

Skripte, mit denen `src/ui/model/sym-qm.json` (Faltungsnetz „cnn2“, 103 Zeichen) gebaut wurde. Die Daten sind **nicht** enthalten:

- CROHME 2011–2013 (InkML), z. B. aus dem GitHub-Repository `ThomasLech/CROHME_extractor` (`data/CROHME_full_v2.zip`); Lizenz CC BY-NC-SA 3.0, © Université de Nantes/CNRS.
- HASYv2 (M. Thoma 2017, arXiv:1701.08380; ODbL 1.0).

Reihenfolge: `extract_crohme.py` → `hasy_strokes.py` → `build_dataset.py` → `train.py` (numpy, eigenes CNN in `cnn.py`) → `export.py`; Auswertung mit `evaluate.py`, `make_report.py`. Die Pfade in den Skripten sind die der Entwicklungsumgebung und müssen angepasst werden. Ergebnisse und Messwerte: `REPORT.md`.
