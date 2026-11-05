"""HASYv2-Bilder (32x32, binär) -> Polylinien (Skelett), in drei Ausdünnungsvarianten.
Aufruf: python3 -I hasy_strokes.py <hasy-Ordner> <ausgabe.pkl>
Koordinaten: HASY-Pixel * K (K so, dass ein volles Zeichen ~40 Einheiten groß ist wie bei CROHME), y nach unten."""
import sys, os, csv, pickle, collections
import numpy as np
import cv2
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from classes import map_label

K = 40.0 / 31.0
ANON = '16925'


def thin(mask):
    return cv2.ximgproc.thinning((mask.astype(np.uint8) * 255), thinningType=cv2.ximgproc.THINNING_ZHANGSUEN) > 0


def skel_graph(sk):
    H, W = sk.shape
    pts = list(zip(*np.nonzero(sk)))
    S = set(pts)
    nb = {}
    for (r, c) in pts:
        L = []
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            if (r + dr, c + dc) in S:
                L.append((r + dr, c + dc))
        for dr, dc in ((-1, -1), (-1, 1), (1, -1), (1, 1)):
            if (r + dr, c + dc) in S and (r + dr, c) not in S and (r, c + dc) not in S:
                L.append((r + dr, c + dc))
        nb[(r, c)] = L
    return nb


def chains_of(nb):
    seen = set()
    chains = []
    def ekey(a, b):
        return (a, b) if a < b else (b, a)
    starts = [p for p in nb if len(nb[p]) != 2]
    for p in starts:
        if not nb[p]:
            chains.append([p])
            continue
        for q in nb[p]:
            if ekey(p, q) in seen:
                continue
            path = [p, q]
            seen.add(ekey(p, q))
            prev, cur = p, q
            while len(nb[cur]) == 2:
                nxt = nb[cur][0] if nb[cur][0] != prev else nb[cur][1]
                if ekey(cur, nxt) in seen:
                    break
                seen.add(ekey(cur, nxt))
                path.append(nxt)
                prev, cur = cur, nxt
            chains.append(path)
    for p in nb:  # reine Schleifen
        for q in nb[p]:
            if ekey(p, q) in seen:
                continue
            path = [p, q]
            seen.add(ekey(p, q))
            prev, cur = p, q
            while True:
                cand = [n for n in nb[cur] if n != prev and ekey(cur, n) not in seen]
                if not cand:
                    break
                nxt = cand[0]
                seen.add(ekey(cur, nxt))
                path.append(nxt)
                prev, cur = cur, nxt
            chains.append(path)
    return chains


def plen(c):
    a = np.array(c, float)
    return float(np.sqrt((np.diff(a, axis=0) ** 2).sum(1)).sum()) if len(a) > 1 else 0.0


def prune_merge(chains, nb, spur):
    deg = {p: len(v) for p, v in nb.items()}
    # Sporne: ein Ende frei, anderes Ende Knoten (>=3), kurz
    if len(chains) > 1:
        keep = []
        for c in chains:
            a, b = c[0], c[-1]
            if len(c) > 1 and ((deg[a] == 1 and deg[b] >= 3) or (deg[b] == 1 and deg[a] >= 3)) and plen(c) <= spur:
                continue
            keep.append(c)
        chains = keep if keep else chains
    # an Knoten zusammenfügen: Enden mit möglichst gerader Fortsetzung
    def dirv(c, at_start, n=4):
        a = np.array(c, float)
        if at_start:
            p0, p1 = a[0], a[min(n, len(a) - 1)]
        else:
            p0, p1 = a[-1], a[max(0, len(a) - 1 - n)]
        v = p1 - p0
        nv = np.hypot(*v)
        return v / nv if nv > 0 else v
    changed = True
    while changed:
        changed = False
        ends = collections.defaultdict(list)
        for i, c in enumerate(chains):
            if len(c) < 2 or c[0] == c[-1]:
                continue
            ends[c[0]].append((i, True))
            ends[c[-1]].append((i, False))
        best = None
        for node, L in ends.items():
            if len(L) < 2:
                continue
            for x in range(len(L)):
                for y in range(x + 1, len(L)):
                    (i, si), (j, sj) = L[x], L[y]
                    if i == j:
                        continue
                    cs = float(np.dot(dirv(chains[i], si), dirv(chains[j], sj)))
                    if cs < -0.35 and (best is None or cs < best[0]):
                        best = (cs, i, si, j, sj)
        if best:
            _, i, si, j, sj = best
            ci = chains[i] if not si else chains[i][::-1]   # endet am Knoten
            cj = chains[j] if sj else chains[j][::-1]       # beginnt am Knoten
            new = ci + cj[1:]
            chains = [c for k, c in enumerate(chains) if k not in (i, j)] + [new]
            changed = True
    return chains


def smooth(a):
    if len(a) < 3:
        return a
    b = a.copy()
    closed = np.allclose(a[0], a[-1])
    b[1:-1] = (a[:-2] + 2 * a[1:-1] + a[2:]) / 4
    if closed:
        b[0] = b[-1] = (a[-2] + 2 * a[0] + a[1]) / 4
    return b


def to_strokes(mask, up):
    """mask: bool-Bild (in up-facher Auflösung); Rückgabe: Liste (n,2) in HASY-Pixeln * K."""
    sk = thin(mask)
    if not sk.any():
        return []
    nb = skel_graph(sk)
    ch = prune_merge(chains_of(nb), nb, spur=2.5 * up)
    out = []
    for c in ch:
        a = np.array([[q[1] + 0.5, q[0] + 0.5] for q in c], float) / up
        a = smooth(a)
        if len(a) > 2:
            a = cv2.approxPolyDP(a.astype(np.float32).reshape(-1, 1, 2), 0.12, False).reshape(-1, 2).astype(float)
        out.append((a * K).astype(np.float32))
    out.sort(key=lambda s: (float(s[:, 0].min()), float(s[:, 1].min())))
    return out


def variants(path):
    g = np.array(Image.open(path).convert('L'), np.float32) / 255.0
    ink = 1.0 - g
    m0 = ink > 0.5
    v = [to_strokes(m0, 1)]
    up = cv2.resize(ink, (96, 96), interpolation=cv2.INTER_CUBIC)
    v.append(to_strokes(up > 0.45, 3))
    d = cv2.dilate(m0.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))).astype(np.float32)
    upd = cv2.resize(d, (96, 96), interpolation=cv2.INTER_LINEAR)
    v.append(to_strokes(upd > 0.5, 3))
    return v


def work(item):
    path, lab, user = item
    try:
        return variants(path)
    except Exception:
        return None


def main(base, out):
    rows = list(csv.DictReader(open(os.path.join(base, 'hasy-data-labels.csv'))))
    rows = [r for r in rows if map_label(r['latex'])]
    # je Klasse höchstens CAP Bilder: bekannte Nutzer vollständig, anonyme zufällig auffüllen
    CAP = 1600
    rng0 = np.random.default_rng(1)
    bycls = collections.defaultdict(list)
    for r in rows:
        bycls[map_label(r['latex'])].append(r)
    rows = []
    for c, L in bycls.items():
        known = [r for r in L if r['user_id'] != ANON]
        anon = [r for r in L if r['user_id'] == ANON]
        rng0.shuffle(anon)
        rows += known + anon[:max(0, CAP - len(known))]
    users = sorted(set(r['user_id'] for r in rows if r['user_id'] != ANON), key=int)
    rng = np.random.default_rng(42)
    perm = rng.permutation(len(users))
    test_users = set(users[i] for i in perm[:int(round(0.15 * len(users)))])
    items = [(os.path.join(base, r['path']), r['latex'], r['user_id']) for r in rows]
    from multiprocessing import Pool
    with Pool(2) as pool:
        V = pool.map(work, items, chunksize=200)
    res = []
    rng2 = np.random.default_rng(7)
    for r, v in zip(rows, V):
        if not v or not v[0]:
            continue
        u = r['user_id']
        if u == ANON:
            split = 'test_anon' if rng2.random() < 0.10 else 'train'
        else:
            split = 'test' if u in test_users else 'train'
        res.append(dict(lab=r['latex'], cls=map_label(r['latex']), variants=v, split=split, writer='hasy:' + u,
                        file=r['path']))
    print('HASY Zeichen', len(res), 'Testnutzer', len(test_users), 'von', len(users))
    with open(out, 'wb') as g:
        pickle.dump(dict(items=res, test_users=sorted(test_users, key=int)), g, protocol=4)


if __name__ == '__main__':
    if len(sys.argv) > 3 and sys.argv[1] == '--one':
        print([[(s.shape) for s in v] for v in variants(sys.argv[2])])
    else:
        main(sys.argv[1], sys.argv[2])
