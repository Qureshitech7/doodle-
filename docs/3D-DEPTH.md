# 3D depth — stylized 3D / 2.5D in the doodle look

The doodle look is flat by design (large round white head, filled torso,
thick outlines). This document adds **depth on top of it, without changing
the look**: the characters keep the same proportions and outlines, but they
read as solid, lit objects in a real space instead of paper cut-outs.

Honest note first: this is **stylized 3D / 2.5D, code-drawn in Canvas 2D —
not Blender, not true 3D meshes**. There is no 3D model, no renderer, no
GPU. The depth comes from six cheap 2D tricks, all in
`templates/doodle-video/src/doodle.js` and `src/main.js`. If you need true
3D meshes, use a 3D tool; this document is for the doodle style.

## The six tricks

### 1. Volumetric shading on the head — `headShade()` in `doodle.js`

The white head is not flat white. It is a radial gradient with the light
coming from the upper-left:

- centre (offset up-left): pure white
- mid: `#F2F2F5`
- edge: `#CFCFD6`
- a soft dark crescent on the lower-right (light's opposite side), clipped
  to the head circle, `rgba(60,60,80,0.22)` fading to transparent
- a small white specular ellipse, upper-left, `rgba(255,255,255,0.75)`

Same head circle, same thick outline — the shading is *inside* it. Every
character gets the same light direction, so the whole scene agrees about
where the light is.

### 2. Gradient torsos — light side and dark side

Every filled torso is a linear gradient, light on the left, dark on the
right (same upper-left light):

- jacket: `#3A3A46` → `#22222A` → `#0F0F15`
- dress/apron: a light tint → the base colour → a dark shade
  (e.g. `#5A8A6A` → `#3F6B4F` → `#243D2E`)
- suit: a flat base colour plus a white-to-black overlay gradient
  (`rgba(255,255,255,0.20)` → transparent → `rgba(0,0,0,0.30)`)

Keep the gradient axis the same for every torso in a scene.

### 3. Extruded outlines — the head has thickness

After the head outline, draw a second arc, offset a few pixels down-right
(`x + 3, y + 4`), only on the dark side (`0.15` → `0.55π`), in
`rgba(26,26,30,0.45)`. It reads as the rim of a solid object, not a flat
disc. Same trick works on any round prop (the gadget's gold centre has an
offset slab under it).

### 4. Soft drop shadows on the ground — `person()` in `doodle.js`

Three stacked ellipses under each figure's feet, offset down-right (light
from upper-left), decreasing size and increasing darkness:

```
ell(16, 6, 104, 15, 'rgba(0,0,0,0.20)');
ell(11, 4,  80, 11, 'rgba(0,0,0,0.22)');
ell( 6, 3,  56,  8, 'rgba(0,0,0,0.25)');
```

One soft ellipse looks like a stain; three stacked ones read as a shadow
with a soft edge and a hard core. Shadows are drawn *inside* the person's
transform, so they follow the walk bob. Paper slips get the same treatment
(a small offset shadow under the slip).

### 5. Layered parallax backgrounds — `bg()` in `shots.js` + sway in `main.js`

The camera in `main.js` sways slowly (`sin(t * 0.22) * 14` px in x,
`cos(t * 0.17) * 6` px in y) with a whisper of rotation
(`0.0035 * sin(t * 0.13)` rad). The background counter-translates against
that sway at different rates, so the layers move at different speeds:

| Layer | Counter-translation | Reads as |
|---|---|---|
| Wall | 0.65x of the sway | farthest |
| Floor | 0.35x of the sway | nearer than the wall |
| Characters | 0x (they ride the camera) | the subject plane |
| Foreground corner shapes | net 1.5x sway (drawn after the scene, translated +0.5x) | closest to the viewer |

The rule is the *difference* in speed: if every layer moved together there
would be no depth. The numbers are small — ±14 px — because the effect
should be felt, not noticed.

### 6. Vignette — `main.js`, after the scene

A radial gradient over the whole frame, transparent in the centre
(`960, 540, r 560`) to `rgba(0,0,0,0.20)` at the edges (r 1150). Darker
edges push the centre forward. Keep it subtle (0.20 max) — more than that
looks like a tunnel.

## What to check

- One light direction everywhere: upper-left. If a shadow points another
  way, that object is wrong.
- The parallax must be visible in motion but invisible in a still: compare
  two frames 0.5 s apart — the wall and the characters should have shifted
  by different amounts. If they shifted together, a layer is not
  counter-translated.
- The vignette must not eat the captions: the caption strip sits at y ~950,
  inside the clear centre — check it stays legible.
- The foreground corner shapes must stay soft (`0.14–0.20` alpha) and out
  of the way of faces and slips. If a shape covers a face, move it or
  shrink it.

## Trade-off (say it plainly)

Code-drawn backgrounds are simpler and plainer than AI-generated stills'
detailed backgrounds. That is the price of animation + consistent faces +
depth in one system. If a scene needs a richly detailed background, build
that background as a still and put the animated doodle characters in front
of it — the characters and the depth tricks still work.

## Files

- `templates/doodle-video/src/doodle.js` — `headShade()`, gradient torsos,
  extruded rim, ground shadows, gadget extrusion
- `templates/doodle-video/src/shots.js` — `bg()` parallax
- `templates/doodle-video/src/main.js` — sway, tilt, foreground shapes,
  vignette
