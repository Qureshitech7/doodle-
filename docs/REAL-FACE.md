# Real faces — a photo face on a doodle character

This module puts a **real person's photo face** on a doodle stick figure:
the character stays a cartoon — stick arms, filled torso, thick outlines —
and only the round head carries the real face, so the viewer instantly
knows *who* the character is.

It is a caricature technique, not a realistic video of a real person. Read
the rules at the bottom before you use it.

## What it looks like

- The photo is cropped tight to the face and clipped to an oval that
  nearly fills the round doodle head (`photoFace()` in
  `templates/doodle-video/src/doodle.js`).
- The photo carries its own hair and features, so no cartoon hair is drawn
  over it. A drawn hair mass may still be drawn *behind* the head so the
  hair frames the photo (a bob behind the face, for example).
- The body, arms, legs, motion and background stay code-drawn doodle.
- The face never speaks or lip-syncs. The third-person narration tells
  the story; the character is an illustration of who the story is about.

## Step 1 — cut the face out cleanly (this is the step people skip)

A photo face pasted with its background still attached looks like a
sticker: a dark studio background shows up as a black crescent or a dark
hood around the face. Remove the background properly first.

1. Start from a tight headshot, front-facing, evenly lit.
2. Remove the background with `rembg` (Python):
   ```sh
   pip install rembg onnxruntime
   rembg i -m u2netp input.jpg face-cut.png
   ```
   Use the **`u2netp` model only** — the full `u2net` model needs far more
   RAM and can kill a small machine. Downscale very large photos to ~512 px
   on the longest side first; the face is small on screen and does not need
   more.
3. Check the cutout on a bright magenta background: any leftover halo,
   hair fringe or background corner shows up immediately. Re-cut or
   hand-clean the edges until it is clean.
4. Crop tight to the face and save as a transparent PNG:
   `templates/doodle-video/faces/<name>.png`.

## Step 2 — wire it in

1. Add the key in `src/faces.js` (`'<name>': null` + a load line, e.g.
   `['mara', 'faces/mara.png']`).
2. The character's `drawHead()` call picks the photo up automatically;
   pass a variant key per scene to change the expression:
   `person({ ..., face: 'mara-smile' })`.
3. `loadFaces()` is resilient: a missing file only warns, and the
   character falls back to its drawn doodle face. The template ships with
   no face photos — add your own.

## Step 3 — one expression per scene (the part that makes it work)

A single static photo face in every scene reads as a cut-paste, however
clean the cutout is. The face's emotion has to match the scene: smiling
at a celebration, serious at a meeting, sombre at bad news.

Two ways to get the variants:

### A. Generate them (best result, needs an image model)

Give the image model the **original photo as the identity reference** and
ask it to generate a **new image** of the same person with the wanted
expression — a new portrait, same face, same identity, plain background.
Then cut the background out (step 1) and use the new image as that scene's
variant. One variant per mood (smile, confident, serious, sombre,
thoughtful); reuse a variant only when its expression genuinely matches
the scene. **View every variant against the source photo before use** —
if the identity drifted, regenerate it; never use a variant that is no
longer clearly the same person.

### B. Draw the cues in code (no AI needed — cruder)

`templates/doodle-video/tools/make_variants.py` (PIL) draws doodle-style
expression cues onto the clean cutout, aligned to landmarks you measure
from your own photo:

- The real eyebrow is **erased first** with a local Gaussian blur of just
  the brow box (sampling skin from the forehead above it), then a thick
  INK doodle brow is drawn in the expression's shape. A skin-patch over
  the brow does not work — it reads as a grey smudge. Blur, don't patch.
- Mouth cues where they align; a slight head tilt for thoughtful.
- The photo itself is never warped.

Honest limit: the photo's real mouth never changes — only the brows, one
mouth line/arc, and the tilt vary — so the expressions read as doodle cues
sitting on a photo face, not as a genuinely new facial expression. In
practice the sombre frown reads strongest and the smile crinkles are
barely visible at video size. Use method A when the expressions matter
most; use method B when no image model is available.

## Identity rules (do not skip these)

- **Use only a photo you have the right to use** — a photo the person gave
  you, a public-domain portrait, or a press headshot used for editorial
  illustration. Never use a photo of a real person to fake them doing or
  saying something they did not do or say.
- **The character is a cartoon illustration, not the person.** The face
  never lip-syncs, never speaks the narration, never performs. If your
  scene needs the person to *speak on camera*, this technique is the wrong
  tool — use a presenter or a voiceover instead.
- **Never present a photo face as real footage.** The stick body makes
  that obvious by design; keep it obvious.
- **Allegations stay alleged.** If the story involves an accusation, the
  narration must say so ("officials believed…", "the story says…",
  "has not been charged", "denies the allegations") and the face must not
  be used to imply guilt.
- **One face per person, identical in every scene** (same cutout, same
  crop). A face re-cut per scene drifts exactly like a face re-drawn per
  scene. See `characters/CHARACTER_SHEETS.md`.

## Common mistakes

- Background not removed: black crescents / dark hood around the face.
  Re-cut with `u2netp` and check on magenta.
- One static face in every scene: the cut-paste look. Add per-scene
  expression variants (step 3).
- Face too small in the oval: the oval is `0.88r` wide — crop the photo
  tight to the face before use, or the face drowns in the head.
- Face covering the hair: the photo carries its own hair; do not also draw
  cartoon hair over it. Draw the hair mass *behind* the head only.
- A variant that drifted: if the generated variant is no longer clearly
  the same person, discard it and fall back to the base face for that scene.

## Files

- `templates/doodle-video/src/faces.js` — face loader (resilient)
- `templates/doodle-video/src/doodle.js` — `photoFace()`, `drawHead(..., faceKey)`
- `templates/doodle-video/tools/make_variants.py` — code-only expression variants
- `templates/doodle-video/faces/README.md` — where your cutouts go
