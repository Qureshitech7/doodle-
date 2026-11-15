#!/usr/bin/env python3
"""Code-only expression variants for real photo faces (no AI generation).

Draws doodle-style expression cues (brows, mouth, crinkles, tilt) onto clean
transparent face cutouts, aligned to landmarks YOU measure from your own
photos. Use this when you want a photo face whose emotion matches each scene
— smiling at a celebration, serious at a meeting — without re-generating the
face with an AI image model.

Pipeline (see ../../docs/REAL-FACE.md for the full guide):
  1. Cut the face out of its photo with a transparent background
     (rembg, u2netp model) -> faces/<name>.png
  2. Measure the landmarks below from a grid-overlay view of your cutout.
  3. Run:  python3 tools/make_variants.py <name>
     -> writes faces-variants/<name>-smile.png etc.
  4. View every variant at 3x AND at real video size against the source
     photo before use: same person, expression reads, no distortion,
     no sticker look. Discard any variant that fails; that scene falls
     back to the plain base face.

Method (the trick that makes it work):
  The real eyebrow is ERASED first — a local Gaussian blur of just the brow
  box, sampling skin from the forehead just above it — then a thick INK
  doodle brow is drawn in the expression's shape. There is never a double
  brow (drawn + real) at video size. A skin-patch over the brow does NOT
  work: it reads as a grey smudge. Blur, don't patch.
  Mouth cues are drawn only where they align with the real mouth; the
  photo's real mouth is never warped. Head tilt is applied last, rotating
  around the face centre.

Honest limit: these cues are cruder than AI-generated expressions. The
photo's real mouth never changes — only the brows, one mouth line/arc,
and the tilt vary — so the expressions read as doodle cues sitting on a
photo face, not as a genuinely new facial expression. In practice the
somber frown reads strongest; the smile crinkles are barely visible at
video size. If you need true per-scene expressions, generate them with an
AI image model from the original photo as identity reference (see
docs/REAL-FACE.md) — then cut the backgrounds out the same way and use
the generated images as your variants instead.

Usage:
  python3 tools/make_variants.py <name> [--only smile,serious]
Landmarks live in LANDMARKS below — fill in YOUR OWN measurements.
A variant is skipped (with a warning) when its landmarks are missing.
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INK = (26, 26, 30, 255)

# ---------------------------------------------------------------------------
# LANDMARKS — measure YOUR OWN cutout and fill these in.
# How to measure: open faces/<name>.png, draw a 10px grid over it, and read:
#   browL_in / browL_out: inner + outer ends of the LEFT brow (viewer left)
#   browR_in / browR_out: same for the RIGHT brow
#   brow_boxL / brow_boxR: tight box around each real brow (x0,y0,x1,y1)
#   skin_sample: a clean forehead strip just ABOVE the brows (x0,y0,x1,y1)
#   eyeL / eyeR: centre of each eye
#   mouth_cx / mouth_y / mouth_half: centre x, y and half-width of the mouth
#   center: face centre (rotation pivot for the tilt)
# All coordinates are PNG pixels of YOUR cutout.
# ---------------------------------------------------------------------------
LANDMARKS = {
    # EXAMPLE (delete and replace with your own measurements):
    # 'mara': dict(
    #     browL_in=(58, 62), browL_out=(38, 62),
    #     browR_in=(80, 62), browR_out=(100, 62),
    #     brow_boxL=(34, 56, 64, 68), brow_boxR=(76, 56, 104, 68),
    #     skin_sample=(34, 44, 104, 54),
    #     eyeL=(48, 72), eyeR=(88, 72),
    #     mouth_cx=70, mouth_y=122, mouth_half=16,
    #     center=(68, 95),
    # ),
}


def quad(p0, p1, p2, n=24):
    pts = []
    for i in range(n + 1):
        t = i / n
        x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0]
        y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]
        pts.append((x, y))
    return pts


def stroke(d, pts, width, color=INK):
    for a, b in zip(pts, pts[1:]):
        d.line([a, b], fill=color, width=width)
    r = width / 2.0
    for p in (pts[0], pts[-1]):
        d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=color)


def brow(d, inner, mid, outer, width=8):
    stroke(d, quad(inner, mid, outer), width)


def brow_straight(d, inner, outer, width=8):
    mid = ((inner[0] + outer[0]) / 2, (inner[1] + outer[1]) / 2)
    brow(d, inner, mid, outer, width)


def erase_brows(img, lm):
    """Soften the real brows away with a local blur of just the brow boxes."""
    for box in (lm['brow_boxL'], lm['brow_boxR']):
        region = img.crop(box).filter(ImageFilter.GaussianBlur(3))
        img.paste(region, box)
    return img


def mouth_smile(d, lm):
    cx, y, h = lm['mouth_cx'], lm['mouth_y'], lm['mouth_half']
    stroke(d, quad((cx - h, y - 2), (cx, y + 7), (cx + h, y - 2)), 6)


def mouth_flat(d, lm):
    cx, y, h = lm['mouth_cx'], lm['mouth_y'], lm['mouth_half']
    stroke(d, [(cx - h, y), (cx + h, y)], 6)


def mouth_frown(d, lm):
    cx, y, h = lm['mouth_cx'], lm['mouth_y'], lm['mouth_half']
    stroke(d, quad((cx - h, y + 6), (cx, y - 3), (cx + h, y + 6)), 6)


def crinkles(d, lm):
    """Small eye crinkles for a warm smile — two short arcs at the outer eyes."""
    for ex, ey in (lm['eyeL'], lm['eyeR']):
        s = 1 if ex < lm['center'][0] else -1
        stroke(d, quad((ex + s * 16, ey - 4), (ex + s * 22, ey - 8), (ex + s * 24, ey - 2)), 4)


def variant(img, lm, kind):
    """Return a new image with the expression cues for `kind` drawn on."""
    im = img.copy().convert('RGBA')
    erase_brows(im, lm)
    d = ImageDraw.Draw(im)
    L, R = lm['browL_in'], lm['browL_out'], lm['browR_in'], lm['browR_out']
    if kind == 'smile':            # arched brows + smile + crinkles
        brow(d, L, (L[0] - 7, L[1] - 12), (L[0] - 14, L[1] - 4))
        brow(d, R, (R[0] + 7, R[1] - 12), (R[0] + 14, R[1] - 4))
        mouth_smile(d, lm)
        crinkles(d, lm)
    elif kind == 'confident':      # level straight brows, small smile
        brow_straight(d, (L[0], L[1] - 2), (L[0] - 14, L[1] - 2))
        brow_straight(d, (R[0], R[1] - 2), (R[0] + 14, R[1] - 2))
        mouth_smile(d, lm)
    elif kind == 'serious':        # flat brows + straight mouth
        brow_straight(d, L, (L[0] - 14, L[1]))
        brow_straight(d, R, (R[0] + 14, R[1]))
        mouth_flat(d, lm)
    elif kind == 'somber':         # inner-raised brows + downturned mouth
        brow(d, (L[0], L[1] - 2), (L[0] - 4, L[1] - 10), (L[0] - 14, L[1] - 2))
        brow(d, (R[0], R[1] - 2), (R[0] + 4, R[1] - 10), (R[0] + 14, R[1] - 2))
        mouth_frown(d, lm)
    elif kind == 'thoughtful':     # one brow raised + slight head tilt
        brow(d, (L[0], L[1] - 2), (L[0] - 4, L[1] - 12), (L[0] - 14, L[1] - 6))
        brow_straight(d, (R[0], R[1] - 2), (R[0] + 14, R[1] - 2))
        mouth_flat(d, lm)
        im = im.rotate(2.5, center=lm['center'], resample=Image.BICUBIC)
    else:
        raise ValueError('unknown variant: ' + kind)
    return im


KINDS = ['smile', 'confident', 'serious', 'somber', 'thoughtful']


def main():
    if len(sys.argv) < 2 or sys.argv[1] in ('-h', '--help'):
        print(__doc__)
        print('Known faces (LANDMARKS):', ', '.join(LANDMARKS) or '(none yet — fill in LANDMARKS first)')
        return 0
    name = sys.argv[1]
    only = None
    if '--only' in sys.argv:
        only = sys.argv[sys.argv.index('--only') + 1].split(',')
    if name not in LANDMARKS:
        print(f'No landmarks for {name!r} — measure your cutout and fill in LANDMARKS in this file.')
        return 1
    src = os.path.join(ROOT, 'faces', name + '.png')
    if not os.path.exists(src):
        print(f'Missing {src} — cut the face out first (see docs/REAL-FACE.md).')
        return 1
    img = Image.open(src)
    lm = LANDMARKS[name]
    outdir = os.path.join(ROOT, 'faces-variants')
    os.makedirs(outdir, exist_ok=True)
    for kind in KINDS:
        if only and kind not in only:
            continue
        out = os.path.join(outdir, f'{name}-{kind}.png')
        variant(img, lm, kind).save(out)
        print('wrote', out)
    print('Done — VIEW each variant at 3x and at video size before use.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
