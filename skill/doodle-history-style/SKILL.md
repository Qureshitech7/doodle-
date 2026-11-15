# Doodle History Style — video skill

Build faceless history videos in the locked doodle look: scene-by-scene
animated doodle characters, a stylized 3D depth treatment, and an optional
real-photo face on the doodle head. This skill is the whole system — the
style guide, the animation rules, the character sheets, the 3D and
real-face docs, and a runnable template.

## What this skill covers

- The locked doodle look (`../../STYLE.md`)
- Scene-by-scene animation (`../../animation/ANIMATION.md`)
- Character sheets — one fixed look per person
  (`../../characters/CHARACTER_SHEETS.md`)
- 3D depth (`../../docs/3D-DEPTH.md`)
- Real faces on doodle characters (`../../docs/REAL-FACE.md`)
- A minimal working Remotion-style template that renders a real 3-scene
  demo (`../../templates/doodle-video/`)

## The locked look (do not change these)

Large round white head, dot eyes, emotion from eyebrows/mouth, thin stick
arms, torso FILLED with uniform colour (olive/khaki + rounded helmet, or
grey-green + flared helmet), thick black outlines, full detailed muted
atmospheric background, full colour (never washed-out grey / B&W),
1920x1080. Full rules in `../../STYLE.md`.

## Workflow

### 1. Script first, one line per scene

Write the narration as one line per scene, each line one sentence, and
write the shot list with it: segment number, exact narration text, and for
that segment the visual description (scene, characters, action, background,
camera, map cue if any). A narration paragraph alone is not enough — split
it into one-sentence segments and a shot for each. Timings are always
re-measured from the actual generated voice, never trusted from estimates.

### 2. Characters before scene 1

Fill in `../../characters/CHARACTER_SHEETS.md` for every person in the video
— famous or fictional — before any scene is built. One fixed look per
person: hair, glasses, moustache, uniform, exact colours. In the template,
each person is ONE drawing function in `src/doodle.js`, called from every
scene. Never regenerate a face per scene — a face re-made per scene drifts
(hair changes, the person vanishes from the finale).

If a real photo face is used instead of a drawn one, the same rule holds:
one face per person, identical in every scene. See `../../docs/REAL-FACE.md`
and the identity rules there (never lip-sync, never fake a performance,
allegations stay alleged).

### 3. Scenes — one motion each

Every scene needs ONE motion from the menu in
`../../animation/ANIMATION.md`: walk, slide, glow/pulse, draw-on, sweep,
flicker, rise, stamp, nod/handshake, walk-out. A still with only a slow
zoom is NOT animation. One scene per segment, played once, no looping, no
slowing to fill voiceover. Every scene must match its line, script by
script — never a generic unrelated still. For a long segment, use 2–3
related pictures, one zoom per picture.

**Scene-1 gate:** build scene 1 only, read frames at start/middle/end,
fix defects, then build the rest. Do not build 10 scenes and discover in
QA that none of them move.

### 4. 3D depth (optional, recommended)

The template adds stylized 3D / 2.5D on top of the flat look — volumetric
head shading, gradient torsos, extruded outlines, ground shadows, layered
parallax backgrounds, camera sway + slight tilt, vignette. All code-drawn
in Canvas 2D, no 3D tool needed. Full guide in `../../docs/3D-DEPTH.md`.
One light direction everywhere: upper-left. Trade-off, say it plainly:
code-drawn backgrounds are simpler than AI stills' detailed backgrounds.

### 5. Voice + timing

Generate narration per line (any voice you like — the template demo is
silent and the narration clock is data, not audio). Measure the real line
start/end times from the actual voice into `data/lines.json` (and word
times into `data/words.json` if you use word cues). Put the mixed
narration at `data/mix.wav` and the render encodes with it. Never trust
estimated timestamps.

### 6. Render + verify

In `../../templates/doodle-video/`:

```sh
npm run check        # boots the film, lists shots + captions, draws every 0.25 s
bash render.sh       # resumable batch render (120-frame batches) -> renders/demo.mp4
npm run preview      # live preview in a browser (?t=12.3 holds a frame)
```

Then **read frames from the finished mp4** at the start, middle and end
of every scene and check:

- Same face in every scene? (compare first / middle / last scene side by
  side — same hair, same glasses, same jacket?)
- Something moving inside every scene? (two frames 0.5 s apart must
  differ — not just the camera)
- 3D depth visible? (wall and characters shift by different amounts)
- No caption collisions, no character covering a slip or a key word, no
  black segments, no frozen scene?
- Famous person actually present in the finale?

Fix, re-render, repeat. A skill nobody can run is useless — the template
ships with a pre-rendered `renders/demo.mp4` so you can see the result
before rendering, and `npm run check` must pass before any render.

## Setup

- **Node 22+**, headless Chrome, ffmpeg. No `npm install` — the template
  uses only Node built-ins (`tools/capture.mjs`). Point `CHROME` at your
  headless Chrome binary (or the Remotion headless shell).
- **Python 3 + PIL** only if you use the code-drawn expression variants
  (`tools/make_variants.py`) or the word-timing generator.
- **rembg** (`pip install rembg onnxruntime`) only if you use real photo
  faces — and use the `u2netp` model only (the full `u2net` model can
  kill a small machine).
- No API key is needed for the template itself. Any image-model step
  (AI-generated expression variants) is optional and billed separately —
  disclose the cost and get approval before billable calls.

## Common mistakes

| Mistake | What happens | Fix |
|---|---|---|
| Face regenerated per scene | Hair changes, person vanishes from the finale | One character sheet, one drawing function, reuse everywhere |
| Stills + slow zoom | "No animation" — the scene is static | One motion from the menu per scene, checked at 3 points |
| Background not removed from a photo face | Black crescents / dark hood around the face | `rembg -m u2netp`, check on magenta, re-cut |
| One static face in every scene | Cut-paste look, no emotion | Per-scene expression variants (`docs/REAL-FACE.md`) |
| Estimated timings used as-is | Captions / shots drift from the voice | Re-measure from the actual voice, every time |
| Two heavy builds in parallel | Out-of-memory kills | One build at a time; stage concats in halves |
| A slip / word hidden behind a character | Text unreadable in the frame | Scene-1 gate: read frames, move the prop or the character |
| Generic unrelated still to fill a segment | Scene does not match the voiceover | A still of THAT exact scene, or split the segment |

## Files (this repo)

```
README.md                    what it is, quickstart
LICENSE                      MIT
STYLE.md                     locked look
animation/ANIMATION.md       motion menu + scene-1 gate
characters/CHARACTER_SHEETS.md   one fixed look per person (+ blank sheet)
docs/3D-DEPTH.md             stylized 3D / 2.5D
docs/REAL-FACE.md            photo face + expression variants + identity rules
prompts/example-prompts.md   prompts for AI stills in this style
examples/                    4 style-reference pictures (webp)
skill/doodle-history-style/  this skill (SKILL.md + skill.yaml)
templates/doodle-video/      minimal working project + 3-scene fictional demo
```

## Example (the template demo)

"Mara and the Flying Machine" — a fictional 3-scene, 20-second film
(Porto, 1987): Mara walks across her workshop to Theo; the brass engine
glows as she winds the crank; Theo stamps the paper APPROVED and they
shake hands. Characters defined once in `src/doodle.js` (Mara: auburn top
bun + green apron; Theo: navy flat cap + moustache + navy suit). Run it
with `bash render.sh` in `../../templates/doodle-video/`.
