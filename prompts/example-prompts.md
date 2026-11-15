# Example prompts — Doodle History Style

Attach one image from `examples/` as style reference, then use a prompt below.
Replace `[SCENE]` with your sentence's exact scene. Keep the style block the same every time — that is what keeps the video consistent.

## Master style block (copy this every time)

```
Doodle history style, large round white head, dot eyes, angled eyebrows only,
thin stick arms, torso FILLED with uniform colour, thick black outlines,
full detailed muted atmospheric background, flat colours with light and shading,
muted military palette olive / grey-green / brown / cold blue-grey / warm lantern yellow,
no bright cartoon colours, no plain paper background, no text, 1920x1080.
```

## 1. Soldier scene (olive uniform)

```
[MASTER STYLE BLOCK]
Soldier in olive/khaki uniform, rounded M1 helmet.
Scene: [SCENE, e.g. a soldier unloading supply crates from a truck in a village street, houses and trees behind him, cold daylight, wide shot]
```

## 2. Soldier scene (grey-green uniform)

```
[MASTER STYLE BLOCK]
Soldier in grey-green uniform, flared Stahlhelm helmet.
Scene: [SCENE, e.g. a soldier in a trench with sandbags and barbed wire, watching a truck column pass in the distance, snowfall]
```

## 3. Interior / tent scene

```
[MASTER STYLE BLOCK]
Scene: [SCENE, e.g. inside a tent at night, soldiers opening food boxes with tins, chocolate and coffee, warm lantern light, close-up]
```

## 4. Famous person scene

```
[MASTER STYLE BLOCK]
Show [NAME] as a doodle stick figure in this same style — large round white head,
dot eyes, recognisable [hair / moustache / glasses / uniform] as simple stick-figure features.
Scene: [SCENE]
Do NOT make a realistic portrait. Do NOT use a generic soldier.
IMPORTANT — do not write "recognisable hair" in general terms: paste the person's
filled-in sheet from `characters/CHARACTER_SHEETS.md` (exact hair, glasses, uniform,
colours) into EVERY scene prompt, with the same reference image attached every time.
A face regenerated fresh per scene drifts — that is how a character once lost
her hair in one scene and vanished from the finale entirely.
```

## Rules to keep in the prompt

- One scene per sentence. Never reuse an unrelated picture to fill a segment.
- Every scene must MOVE inside the frame (walk, slide, glow, draw-on, sweep, flicker, rise, stamp — see `animation/ANIMATION.md`). A still with only a slow zoom is not animation.
- If a scene is for a long segment, make 2-3 related pictures for the same words, not one held picture.
- No text in the image unless the scene itself needs a label (e.g. a crate label).
- Full colour — do not make it black-and-white or washed-out grey.
