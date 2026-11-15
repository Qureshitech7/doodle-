# Doodle look — LOCKED style guide

This is the locked look for faceless history videos in this repo. It
replaces the earlier pure line-animation look (paper background, line-only
figures, no shading), which was rejected. The reference pictures that
inspired it were used only as a style reference — all scenes in this repo
are original. Do not copy another creator's exact pictures or compositions;
build original scenes in this style.

## Characters
- Large round WHITE head, dot eyes, angled eyebrows only — emotion comes
  from eyebrows/mouth, no detailed facial features.
- Thin stick arms (and thin legs where visible), but torso FILLED with
  uniform colour — not a line-only stick figure.
- Soldiers: olive/khaki uniform with a rounded M1-style helmet, or
  grey-green uniform with a flared Stahlhelm-style helmet.
- Thick black outlines throughout.

## Backgrounds — this is the key difference
- NOT a plain paper / line background. A full, detailed, atmospheric scene:
  village street with houses and trees, cold trench with sandbags and
  barbed wire, tent interior with lantern light, stone warehouse with
  shelves and labelled crates.
- Muted military palette: olive, grey-green, brown, cold blue-grey, warm
  lantern yellow.
- Flat colours with light / shading effects (snowfall, lantern glow, cold
  daylight) — not bright cartoon colours.
- Depth: foreground character large, background characters smaller; wide
  and close-up shots mixed. See [`docs/3D-DEPTH.md`](docs/3D-DEPTH.md) for
  the stylized-3D treatment (volumetric shading, drop shadows, parallax).

## Reference pictures in this repo
1. Supply truck unloading crates in a village street —
   `examples/01-village-supply-truck.webp`
2. German soldier in a trench watching a US truck column pass —
   `examples/02-trench-truck-column.webp`
3. Tent, food boxes with tins, chocolate and coffee, lantern light —
   `examples/03-tent-food-lantern.webp`
4. Crew fixing a truck engine, one soldier with a radio —
   `examples/04-crew-fixing-truck-engine.webp`

Use these as style reference when you generate new scenes. Do not reuse
them as the video itself — generate a new original scene for each sentence.

## Rules that still hold
- One scene per sentence / segment, played once — no looping, no slowing
  to fill voiceover.
- HD 1920x1080 for video builds.
- Full colour, not washed-out grey / black-and-white.
- Do not copy another creator's exact pictures or compositions; build
  original scenes in this style.

## Best script input format
- Best is narration + scene-by-scene shot list TOGETHER, segment by
  segment: segment number, exact narration text, and for that segment the
  visual description (scene, characters with famous-person traits, action,
  background, camera, map cue if any).
- A full narration paragraph alone is not enough — it still needs splitting
  into one-sentence segments and a shot for each.
- Timestamps alone are not reliable — voice durations change with the
  voice model / speed, so timings are always re-measured from the actual
  generated voice, not from estimated timestamps. Rough order matters,
  exact timestamps do not.

## Famous-person rule
- When the voiceover talks about a famous person, that scene must show
  that person, in the same locked stick-figure look — not a generic
  soldier and not a realistic copy.
- The stick figure's face / head must resemble that main character:
  distinctive hair, mustache, glasses, uniform, etc., rendered as simple
  stick-figure features (large round white head, dot eyes, thick black
  outlines), so the viewer recognises who it is while the style stays
  doodle / stick.
- A written rule alone is NOT enough — a face regenerated fresh in every
  scene drifts (one early sample had a character with no hair in scene 1
  but a dark bob in the dinner scene, and the finale showed two generic
  men with neither main character in it). Before scene 1, fill in a fixed
  sheet for every famous person in
  [`characters/CHARACTER_SHEETS.md`](characters/CHARACTER_SHEETS.md) (hair,
  glasses, uniform, exact colours) and reuse that exact sheet in every
  scene — never regenerate the face per scene. Worked sheets for three
  fictional characters are in that file.
- A real photo face can be used on the doodle head instead of a drawn one
  — see [`docs/REAL-FACE.md`](docs/REAL-FACE.md). Same rule applies: one
  face per person, identical in every scene, and the face never lip-syncs
  or performs.

## Scene-matching rule
- Every scene must match what the voiceover is saying in that segment, on
  screen at the same time — voice-matched scenes, script by script.
- Priority: ANIMATED video clips first, as much as possible.
- Every scene must have real movement inside it — see
  [`animation/ANIMATION.md`](animation/ANIMATION.md) for the motion menu
  (walk, slide, glow, draw-on, sweep, flicker, rise, stamp, nod,
  walk-out) and the scene-1 gate. A still with only a slow zoom is NOT
  animation and is NOT enough.
- Fallback: if an animated clip for a segment cannot be made, make a STILL
  PIC of that exact segment's scene and use it (with camera movement) — a
  matched pic for that sentence, not a generic unrelated still reused from
  another segment.
- Never reuse an unrelated still just to fill a segment — that was the
  flaw in an early sample and must not be repeated.
- Zoom a still ONCE only, then move to the next picture. For a long
  segment, use multiple related pictures instead of one still.
