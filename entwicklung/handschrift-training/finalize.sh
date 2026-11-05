#!/bin/sh
# Abschluss nach dem Training: Export, JS-Abgleich, Auswertung, Bericht
set -e
T=/home/claude/ink/train
M=/home/claude/qm/src/ui/model/sym-qm.json
cd "$T"
python3 -I export.py "$T/work" "$T/work/model_last.npz" "$M" "$T/eval_check.json" | tee "$T/work/export.log"
node cnn2_eval.js "$M" "$T/eval_check.json" "$T/raster_check.json" | tee "$T/work/js_check.log"
node cnn2_eval.js --strokes /home/claude/ink/testdata/strokes_test.json "$M" | tee -a "$T/work/js_check.log"
python3 -I evaluate.py "$T/work" "$M" "$T/work/eval.json" | tee "$T/work/eval.log"
python3 -I make_report.py "$T/work" "$M" "$T/REPORT.md"
ls -la "$M" "$T/REPORT.md" "$T/raster_check.json" "$T/eval_check.json" /home/claude/ink/testdata/
