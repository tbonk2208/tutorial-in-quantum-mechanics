"""Vergleichsbilder: CROHME-Striche vs. HASY-Skelett-Polylinien nach derselben Rasterung; augmentierte Trainingsbeispiele.
Aufruf: python3 -I make_samples.py <work> <ausgabeordner>"""
import sys, os, pickle, glob
import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from classes import CLASSES, map_label
from raster import rasterize_fast

W, OUT = sys.argv[1], sys.argv[2]
Z = 3  # Vergrößerung


def font():
    for f in glob.glob('/usr/share/fonts/**/DejaVuSans.ttf', recursive=True):
        return ImageFont.truetype(f, 20)
    return ImageFont.load_default()


FONT = font()


def tile(v):
    a = 255 - np.round(v.reshape(28, 28) * 255).astype(np.uint8)
    return np.kron(a, np.ones((Z, Z), np.uint8))


def sheet(rows, path, ncol):
    th = 28 * Z
    lab_w = 70
    H = len(rows) * (th + 4)
    Wd = lab_w + ncol * (th + 2) + 20
    img = Image.new('L', (Wd, H), 200)
    dr = ImageDraw.Draw(img)
    for r, (lab, tiles) in enumerate(rows):
        y = r * (th + 4)
        dr.text((4, y + th // 3), lab, fill=0, font=FONT)
        x = lab_w
        for t in tiles:
            if t is None:
                x += 20
                continue
            img.paste(Image.fromarray(t), (x, y))
            x += th + 2
    img.save(path)
    print('geschrieben', path)


def main():
    cr = pickle.load(open(os.path.join(W, 'crohme.pkl'), 'rb'))
    hz = pickle.load(open(os.path.join(W, 'hasy.pkl'), 'rb'))['items']
    rng = np.random.default_rng(3)
    byc = {}
    for r in cr:
        c = map_label(r['lab'])
        if c:
            byc.setdefault(c, []).append(r['strokes'])
    byh = {}
    for r in hz:
        byh.setdefault(r['cls'], []).append(r['variants'])
    both = [c for c in CLASSES if len(byc.get(c, [])) >= 20 and len(byh.get(c, [])) >= 20]
    sel = ['2', '7', 'a', 'x', 'y', 'A', 'L', 'α', 'θ', 'π', 'Σ', '∫', '∞', 'sqrt', 'pm', '+', '|', '⟨', '.', '{']
    sel = [c for c in sel if c in both]
    rows = []
    for c in sel:
        tl = []
        for i in rng.choice(len(byc[c]), 6, replace=False):
            tl.append(tile(rasterize_fast(byc[c][i])))
        tl.append(None)
        for i in rng.choice(len(byh[c]), 6, replace=False):
            v = byh[c][i]
            tl.append(tile(rasterize_fast(v[1] or v[0])))
        rows.append((c, tl))
    sheet(rows[:10], os.path.join(OUT, 'samples_crohme_vs_hasy_1.png'), 12)
    sheet(rows[10:], os.path.join(OUT, 'samples_crohme_vs_hasy_2.png'), 12)
    # nur HASY: drei Ausdünnungsvarianten nebeneinander
    rows = []
    for c in ['ψ', 'ħ', '∂', '∇', 'ω', 'Ψ', 'Ω', '↑', '⊗', '†']:
        tl = []
        for i in rng.choice(len(byh[c]), 4, replace=False):
            for v in byh[c][i]:
                if v:
                    tl.append(tile(rasterize_fast(v)))
            tl.append(None)
        rows.append((c, tl))
    sheet(rows, os.path.join(OUT, 'samples_hasy_variants.png'), 12)
    # augmentierte Trainingsbeispiele
    if os.path.exists(os.path.join(W, 'train.npz')):
        d = np.load(os.path.join(W, 'train.npz'))
        X, y = d['X'], d['y']
        rows = []
        for c in ['3', 'k', 'D', 'ε', 'ν', 'ρ', 'φ', '.', ',', "'", '!', '*', '⟩', 'Δ']:
            idx = np.nonzero(y == CLASSES.index(c))[0]
            tl = [tile(X[i] / 255.0) for i in rng.choice(idx, 12, replace=False)]
            rows.append((c, tl))
        sheet(rows, os.path.join(OUT, 'samples_augmented.png'), 12)


if __name__ == '__main__':
    main()
