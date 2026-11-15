# Doodle Video — minimal working template

A runnable 3-scene demo of the doodle video system: the locked doodle look,
scene-by-scene animation, and the 3D depth treatment, all code-drawn in
Canvas 2D. Copy this folder, run the demo, then make it your own.

The demo story is **fictional** (Mara the inventor and Theo the merchant,
Porto, 1987) so the pack contains no real people and no real events.

## What it renders

- **S1** — Mara walks across her workshop to Theo (motion: walk)
- **S2** — the brass engine glows as Mara winds the crank (motion: glow + spin)
- **S3** — Theo stamps the paper APPROVED, then they shake hands (motion: stamp + handshake)

20 seconds, 1920x1080, 30 fps, silent (no narration audio in the demo).

## Quickstart

Requirements: Node 22+, headless Chrome, ffmpeg. No `npm install` —
`tools/capture.mjs` uses only Node built-ins.

```sh
# 1. Check: boot the film, list shots + captions, draw every 0.25 s
CHROME=/path/to/chrome npm run check
# (Set CHROME=/path/to/chrome if your headless Chrome lives somewhere
#  unusual — e.g. a Remotion headless-shell binary.)

# 2. Render the demo end to end (resumable, in 120-frame batches)
bash render.sh
# -> renders/demo.mp4 (a pre-rendered copy of the same demo is already
#    included in the pack, so you can watch it before rendering)

# 3. Watch it in a browser instead (live preview, ?t=12.3 holds a frame)
npm run preview
```

## Files

```
.
├── index.html              # canvas + play button
├── package.json            # scripts only — no dependencies
├── render.sh               # resumable batch renderer + ffmpeg encode
├── script.json             # the 3 demo lines (fictional)
├── data/
│   ├── lines.json          # line start/end times (the narration clock)
│   └── words.json          # word start/end times (for word cues)
├── fonts/                  # Inter Black + Caladea Bold (both OFL — free to share)
├── faces/                  # EMPTY — your own photo-face cutouts go here (see README)
├── faces-variants/         # EMPTY — code-drawn expression variants go here
├── src/
│   ├── main.js             # boot + 3D camera (sway, tilt, foreground, vignette)
│   ├── shots.js            # the 3 demo scenes (edit this to make your film)
│   ├── doodle.js           # character library — every character defined ONCE
│   ├── faces.js            # photo-face loader (resilient: missing = drawn face)
│   └── core/
│       ├── lib.js          # canvas, palette, math, drawing primitives
│       ├── timing.js       # L(i) / Wd() — everything on the narration clock
│       └── captions.js     # full-line caption strip (optional — delete to disable)
└── tools/
    ├── capture.mjs         # check / frames / sheet / video / preview via headless Chrome
    └── make_variants.py    # code-only expression variants for photo faces
```

## Make your own film

1. **Write the script** as one line per scene in `script.json`, and fill in
   `characters/CHARACTER_SHEETS.md` (in the repo root) for every person
   before scene 1 — one fixed look per person, reused in every scene.
2. **Add scenes** in `src/shots.js`: one shot per line, each with ONE motion
   from `../../animation/ANIMATION.md` (walk, slide, glow, draw-on, sweep,
   flicker, rise, stamp, nod, walk-out). A scene with no motion is a still —
   do not build it as one. Run the **scene-1 gate** first: build scene 1,
   read frames at start/middle/end, fix it, then build the rest.
3. **Add characters** in `src/doodle.js`: one drawing function per person,
   called from every scene. Never regenerate a face per scene.
4. **Voice + timing**: generate narration per line, then measure the real
   line start/end times into `data/lines.json` (and word times into
   `data/words.json` if you use word cues). Timings are always re-measured
   from the actual voice — never trust estimated timestamps. Put the mixed
   narration at `data/mix.wav` and `render.sh` will encode with it;
   without it the render is silent.
5. **Verify**: `npm run check`, then read frames from the finished mp4 at
   the start, middle and end of every scene — same face in every scene?
   Something moving inside every scene? No caption collisions, no black
   segments? Fix, re-render, repeat.

## The rules this template enforces

- Locked doodle look: large round white head, dot eyes, emotion from
  eyebrows/mouth, thin stick arms, FILLED torso, thick black outlines,
  full detailed muted atmospheric background, full colour.
- One scene per segment, played once — no looping, no slowing to fill
  voiceover. Every scene matches its line, script by script.
- Real motion inside every scene — stills + zoom is NOT animation.
- A famous person's look is identical in every scene (defined once).

Full guide: `../../skill/doodle-history-style/SKILL.md`,
`../../STYLE.md`, `../../docs/3D-DEPTH.md`, `../../docs/REAL-FACE.md`.
