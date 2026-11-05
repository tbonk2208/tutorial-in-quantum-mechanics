"""Einzelzeichen aus CROHME-2013-InkML (TrainINKML = Training, TestINKMLGT = Test).
Aufruf: python3 -I extract_crohme.py <CROHME2013_data-Ordner> <ausgabe.pkl>
Ergebnis: Liste von dict(lab, strokes=[np.float32 (n,2)], split, writer, file) in Originalkoordinaten (y nach unten)."""
import sys, os, re, glob, pickle, collections
import xml.etree.ElementTree as ET
import numpy as np

NS = '{http://www.w3.org/2003/InkML}'


def parse_trace(txt):
    pts = []
    for part in txt.strip().split(','):
        v = part.split()
        if len(v) < 2:
            continue
        try:
            pts.append((float(v[0]), float(v[1])))
        except ValueError:
            continue
    return np.array(pts, np.float64).reshape(-1, 2)


def parse_file(path):
    root = ET.parse(path).getroot()
    traces = {}
    for t in root.iter(NS + 'trace'):
        traces[t.get('id')] = parse_trace(t.text or '')
    writer = None
    for a in root.findall(NS + 'annotation'):
        if a.get('type') == 'writer':
            writer = (a.text or '').strip()
    syms = []
    for tg in root.iter(NS + 'traceGroup'):
        lab = None
        for a in tg.findall(NS + 'annotation'):
            if a.get('type') == 'truth':
                lab = (a.text or '').strip()
        if lab is None or lab == 'Segmentation':
            continue
        refs = [tv.get('traceDataRef') for tv in tg.findall(NS + 'traceView')]
        st = [traces[r] for r in refs if r in traces and len(traces[r])]
        if st:
            syms.append((lab, st))
    return writer, syms


def main(base, out):
    files = [(f, 'train') for f in sorted(glob.glob(os.path.join(base, 'TrainINKML', '*', '*.inkml')))]
    files += [(f, 'test') for f in sorted(glob.glob(os.path.join(base, 'TestINKMLGT', '*.inkml')))]
    res, bad = [], 0
    for f, split in files:
        try:
            writer, syms = parse_file(f)
        except Exception as e:  # kaputte Dateien überspringen
            bad += 1
            continue
        if not syms:
            continue
        # Ausdruck auf einheitliche Größe bringen: Median der Zeichengröße (max(B,H)) normaler Zeichen = 40 Einheiten
        sz = []
        for lab, st in syms:
            if re.fullmatch(r'[0-9a-zA-Z]', lab):
                p = np.concatenate(st)
                sz.append(max(np.ptp(p[:, 0]), np.ptp(p[:, 1])))
        if not sz:
            for lab, st in syms:
                p = np.concatenate(st)
                sz.append(max(np.ptp(p[:, 0]), np.ptp(p[:, 1])))
        med = float(np.median(sz))
        k = 40.0 / med if med > 0 else 1.0
        sub = os.path.basename(os.path.dirname(f))
        wr = (sub + ':' + writer) if writer else (sub + ':' + os.path.basename(f))
        for lab, st in syms:
            res.append(dict(lab=lab, strokes=[(s * k).astype(np.float32) for s in st], split=split,
                            writer=wr, file=os.path.relpath(f, base)))
    print('Dateien', len(files), 'fehlerhaft', bad, 'Zeichen', len(res))
    c = collections.Counter((r['lab'], r['split']) for r in res)
    labs = sorted(set(r['lab'] for r in res))
    for l in labs:
        print(repr(l), c[(l, 'train')], c[(l, 'test')])
    with open(out, 'wb') as g:
        pickle.dump(res, g, protocol=4)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
