"""Lernt P(gleiches Zeichen | Merkmale eines Strichpaars) als kleines Netz (16 → 10 tanh → 1).
Aufruf: python3 -I test/ink/fit_group.py pairs_train.csv pairs_test.csv  → druckt GROUPW als JSON (in 16-ink-recog.js einfügen)."""
import sys, json
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.linear_model import LogisticRegression

tr = np.loadtxt(sys.argv[1], delimiter=',')
te = np.loadtxt(sys.argv[2], delimiter=',')
Xtr, ytr = tr[:, :-1], tr[:, -1]
Xte, yte = te[:, :-1], te[:, -1]
mu, sd = Xtr.mean(0), Xtr.std(0) + 1e-6
Z = (Xtr - mu) / sd
Zt = (Xte - mu) / sd
lr = LogisticRegression(max_iter=2000).fit(Z, ytr)
print('# logistisch: Test-Genauigkeit', round(lr.score(Zt, yte), 4), file=sys.stderr)
m = MLPClassifier(hidden_layer_sizes=(10,), activation='tanh', alpha=1e-3, max_iter=600, random_state=1).fit(Z, ytr)
print('# Netz: Trainings-Genauigkeit', round(m.score(Z, ytr), 4), 'Test', round(m.score(Zt, yte), 4), 'Anteil gleich', round(yte.mean(), 3), file=sys.stderr)
p = m.predict_proba(Zt)[:, 1]
for thr in (0.1, 0.5, 0.9):
    print('#  p>%.1f: Anteil %.3f, davon richtig %.3f' % (thr, (p > thr).mean(), (yte[p > thr] == 1).mean()), file=sys.stderr)
W = {'mu': [round(v, 5) for v in mu], 'sd': [round(v, 5) for v in sd],
     'W1': [[round(v, 4) for v in row] for row in m.coefs_[0].T], 'b1': [round(v, 4) for v in m.intercepts_[0]],
     'W2': [round(v, 4) for v in m.coefs_[1][:, 0]], 'b2': round(float(m.intercepts_[1][0]), 4)}
print(json.dumps(W, separators=(',', ':')))
