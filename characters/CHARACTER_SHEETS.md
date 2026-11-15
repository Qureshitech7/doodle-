# Character sheets — one fixed look per famous person

A face regenerated fresh in every scene drifts: one early sample had a
character with no hair in scene 1 but a dark bob in the dinner scene, and
the finale showed two generic men with neither main character in it. The
written famous-person rule alone did not stop that. This file is the fix.

## The rule

**Define each famous person ONCE, before scene 1, and reuse that exact
definition in every scene. Never regenerate the face per scene.**

- One sheet per person, filled in before any scene is built.
- The same head shape, hair, glasses, moustache, uniform, colours and
  proportions in every scene — only mood (eyebrows / mouth), pose and
  scale change.
- If you build with code (the method in `templates/doodle-video/`), put
  each person in ONE shared drawing function and call it from every scene.
  If you build with AI images, paste the person's sheet word-for-word into
  every scene prompt, with the same reference image attached every time —
  and still check every scene against the sheet before keeping it.
- Check before delivery: open the first, a middle and the last scene side
  by side. Same hair? Same glasses? Same jacket / dress? Same person
  actually in the finale? If any answer is no, that scene is wrong.

## Blank sheet (copy this for each new person)

```
Name:
Role in this video:
Head: large round WHITE head, dot eyes, angled eyebrows (locked look)
Hair: [shape, colour, parting — e.g. auburn hair in a top bun, grey side-swept cap]
Face extras: [glasses shape / moustache / beard / none]
Body: [jacket / dress / uniform — colour + cut, e.g. green work apron]
Arms/legs: thin stick arms, thin stick legs
Outline: thick black outlines throughout
Colours (exact): hair #____, outfit #____, outfit highlight #____
Scale: head radius ____ at scale 1 (person ~____ tall at scale 1)
Never change: [the 2-3 traits a viewer must recognise — e.g. auburn bun + green apron]
Never do: [realistic portrait, generic soldier, different hair in another scene]
```

## Worked example 1 — Mara the inventor (from the template demo)

The demo film in `templates/doodle-video/` defines Mara once in
`src/doodle.js` (`maraHairBack`, `maraHairFront`, `torsoApron`) and she is
identical in every scene.

- Head: large round WHITE head, dot eyes, angled eyebrows
- Hair: auburn (#A85B32) — top bun, segment cap, side curls down to the
  chin, in EVERY scene
- Face extras: none
- Body: green work apron (#3F6B4F, dark #2C4A37) over a cream shirt,
  A-line, with straps and a pocket
- Arms/legs: thin stick arms, thin stick legs, dark trousers
- Scale: head radius 62 at scale 1; person ~462 tall at scale 1
- Never change: auburn bun + side curls + green apron
- Never do: plain round head with no hair in any scene, a different
  apron colour

## Worked example 2 — Theo the merchant (from the template demo)

- Head: large round WHITE head, dot eyes, angled eyebrows
- Hair: navy flat cap (#2E4057) — segment cap + brim at the front, in
  EVERY scene
- Face extras: small moustache (#3B2A20)
- Body: navy suit (#2E4057), filled rounded torso, white shirt V + red tie
- Arms/legs: thin stick arms, thin stick legs, dark trousers
- Never change: navy flat cap + small moustache + navy suit
- Never do: a generic suited man, no cap, no moustache

## Worked example 3 — General Bram (fictional historical general)

Use this pattern for a historical figure: a few exaggerated traits, all
drawn, never a realistic copy.

- Head: large round WHITE head, dot eyes, angled eyebrows
- Hair: side-parted grey hair
- Face extras: large grey moustache, peaked cap with a gold band where in
  uniform
- Body: grey-green uniform, flared helmet-style cap where in uniform,
  epaulettes
- Never change: side-parted grey hair + large moustache + peaked cap
- Never do: a realistic copy, a generic soldier with no moustache

## How to use this with the prompts

In `prompts/example-prompts.md` section 4, do not write "recognisable hair"
in general terms. Paste the person's filled-in sheet — hair, glasses,
uniform, exact colours — into every scene prompt, and attach the same
reference image every time. A rule that says "show the famous person" is
not enough; the sheet is what makes the face stay the same.

## Real photo faces

A real photo face can replace the drawn face on the same sheet: same
person, same hair and outfit around it, one face per person, identical in
every scene. See `docs/REAL-FACE.md` for the cutout, the per-scene
expression variants, and the identity rules (never lip-sync, never fake a
performance, allegations stay alleged).
