# Scene-by-scene animation — how a scene actually moves

A still + zoom is NOT animation, and it is NOT enough when the comparison
is an animated sample. An early version of this style's sample had scenes
that were static stills with only a slow zoom — nothing moved inside a
scene — and it was rejected for exactly that. This file is the fix.

## The rule

**Every scene must have real movement inside it, for its whole duration —
something changes frame by frame, not just the camera.**

- One scene per sentence, played once, no looping, no slowing.
- Before building a scene, write down its ONE motion (see the table).
  A scene with no motion written down is a still — do not build it as one.
- Check before delivery: watch the scene at 3 points (start, middle, end).
  If nothing inside the frame has moved between them, the scene fails.

## Motion menu — pick at least one per scene

Proven motions from the code-drawn demo in `templates/doodle-video/`
(3 scenes, 20 seconds, 1920x1080) and the full system it comes from:

| Motion | What moves | Example from the demo |
|---|---|---|
| Walk | Legs swing, body bobs, character crosses the frame | Mara walks across the workshop to Theo |
| Slide | An object travels across a surface | (extend the demo: a folder slides into a hand) |
| Glow / pulse | Light throbs, rays rotate, particles rise | The brass engine glows and pulses, glow particles rise |
| Draw-on | A line / shape / "?" draws itself over time | (extend the demo: a red string draws across a board) |
| Sweep | A tool moves across a map or scene | (extend the demo: a magnifier sweeps a map) |
| Flicker | Flame / light wavers | The candle flame flickers on the workbench |
| Rise | A paper / letter lifts out of something | (extend the demo: a letter rises out of a folder) |
| Stamp | A stamp slams down, one by one | Theo's stamp slams onto the paper, APPROVED appears |
| Nod / point / handshake | A small body action repeats | Mara and Theo shake hands, hands bobbing |
| Walk out | A character leaves the frame over most of the line | (extend the demo: a character walks out as a slip slides in) |

## Two ways to get motion

### A. Code-drawn (the method in this repo)

- Define each character ONCE in one shared file (see
  `characters/CHARACTER_SHEETS.md` and `templates/doodle-video/src/doodle.js`)
  and call the same drawing function from every scene. Same functions +
  same colours + same proportions = identical look in every scene, and
  motion is a parameter (walk phase, glow pulse, draw progress) — not a
  new picture.
- Proven stack: Canvas 2D in a browser page, headless-Chrome frame
  capture, 1920x1080, scenes rendered in 120-frame batches, scene-1 gate
  first (build scene 1, read frames at several times, fix defects, then
  build the rest). The runnable version is in `templates/doodle-video/`:
  `npm run check`, then `bash render.sh`.
- Trade-off, say it plainly: code-drawn backgrounds are simpler / plainer
  than AI stills' detailed backgrounds. Animation + consistent faces is
  what you gain; detailed backgrounds is what you give up. If a scene
  needs a rich background, build that background as a still and put the
  animated doodle characters in front of it.

### B. AI stills / clips (use only if the motion is real)

- Animated clips first, per the locked style guide. A clip counts only if
  something inside the scene moves — a person walking, an object sliding,
  a flame flickering.
- A still with a slow zoom does NOT count. A still with a pan does NOT
  count. If the only movement is the camera, the scene is a still.
- If a clip cannot be made for a segment, use a still of that exact scene
  and split the segment: 2–3 related pictures for one long line, one zoom
  per picture, then move on — never hold one picture for a whole segment.

## Scene-1 gate (do this before building the rest)

1. Build scene 1 only.
2. Read frames at the start, middle and end of the scene.
3. Check: does something move inside the frame? Is the famous person's
   look identical to their character sheet? Is any text / slip hidden
   behind a character? Is any face covered by a prop?
4. Fix scene 1, then build the rest. Do not build 10 scenes and discover
   in QA that none of them move.

## Per-scene checklist (fill in for every segment)

```
Segment __ — Narration: "[exact words]"
Scene: [who, where, background]
Motion (one from the menu): [walk / slide / glow / draw-on / sweep / flicker / rise / stamp / nod / walk-out]
Famous person in scene? [name + character sheet traits — or "none"]
Checked at start / middle / end: [moves? same face?]
```

## What the template proves

`templates/doodle-video/` renders a real 3-scene film (20 seconds,
1920x1080) with walk, glow, spin, stamp and handshake motion — run it
yourself with `bash render.sh` and read the frames. The motion menu above
is not theory: every entry in it is a parameter in `src/shots.js`, and the
scene-1 gate is how the demo was debugged (a stamp overlapping a slip and
a character covering the APPROVED text were both caught at the gate and
fixed before the rest was built).
