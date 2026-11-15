# Doodle History Style

A locked, reusable visual style for faceless history videos — white-face
stick-figure soldiers in full, detailed, muted military scenes — with
scene-by-scene animation, a stylized 3D depth treatment, and an optional
real-photo face on the doodle head.

Use it to generate consistent scenes for history documentaries, in
1920x1080, one scene per sentence. All scenes in `examples/` are original
— made in this style, not copied from another creator's videos. Do not
copy another creator's exact pictures or compositions; build original
scenes in this style.

## The look at a glance

**Characters**
- Large round WHITE head, dot eyes, angled eyebrows only — emotion comes from eyebrows / mouth, no detailed facial features
- Thin stick arms (and thin legs where visible), but torso FILLED with uniform colour — not a line-only stick figure
- Soldiers: olive / khaki uniform with a rounded helmet, or grey-green uniform with a flared helmet
- Thick black outlines throughout

**Backgrounds — this is the key difference**
- NOT a plain paper / line background. A full, detailed, atmospheric scene: village street, cold trench with sandbags and barbed wire, tent interior with lantern light, stone warehouse with shelves and labelled crates
- Muted military palette: olive, grey-green, brown, cold blue-grey, warm lantern yellow
- Flat colours with light / shading effects — snowfall, lantern glow, cold daylight — not bright cartoon colours
- Depth: foreground character large, background characters smaller; wide and close-up shots mixed. See [`docs/3D-DEPTH.md`](docs/3D-DEPTH.md) for the stylized-3D treatment (volumetric shading, drop shadows, parallax, camera sway)

**Video rules**
- One scene per sentence / segment, played once — no looping, no slowing to fill voiceover
- HD 1920x1080
- Every scene must match what the voiceover is saying in that segment, script by script
- Priority: animated clips first — and every scene must move inside the frame, not just zoom (see [`animation/ANIMATION.md`](animation/ANIMATION.md)). Fallback: a still of that exact scene with camera movement — never a generic unrelated still
- Zoom a still ONCE only, then move to the next picture
- Famous person in the voiceover = that person in the same doodle look (hair, moustache, glasses, uniform as simple stick-figure features) — not a generic soldier, not a realistic copy. Define each person once in [`characters/CHARACTER_SHEETS.md`](characters/CHARACTER_SHEETS.md) and reuse that exact sheet in every scene — a written rule alone does not keep a face the same
- Full colour, not washed-out grey / black-and-white

Full guide: [`STYLE.md`](STYLE.md)

## Examples

| # | Scene | File |
|---|---|---|
| 1 | Supply truck unloading crates in a village street | `examples/01-village-supply-truck.webp` |
| 2 | German soldier in a trench watching a US truck column pass | `examples/02-trench-truck-column.webp` |
| 3 | Tent, food boxes with tins, chocolate and coffee, lantern light | `examples/03-tent-food-lantern.webp` |
| 4 | Crew fixing a truck engine, one soldier with a radio | `examples/04-crew-fixing-truck-engine.webp` |

Use these 4 images as style reference when you generate new scenes. Do not reuse them as the video itself — generate a new original scene for each sentence.

## Quickstart — run the demo

```sh
cd templates/doodle-video
npm run check     # boots the film, lists shots + captions
bash render.sh    # renders the 3-scene fictional demo -> renders/demo.mp4
```

Requirements: Node 22+, headless Chrome, ffmpeg. No `npm install` — the
template uses only Node built-ins. A pre-rendered `renders/demo.mp4` is
included so you can watch the result first. Full instructions in
[`templates/doodle-video/README.md`](templates/doodle-video/README.md).

## How to use it

### 1. As a Muse / Claude skill (most consistent)

Copy the folder `skill/doodle-history-style/` into your skills folder, then just say:

> Make this video in the doodle-history style

The skill carries the full system — the style guide, scene-matching rule,
famous-person rule, animation rules, 3D depth, and the real-face technique
— so you don't have to paste the prompt every time.

Skill files:
- `skill/doodle-history-style/SKILL.md`
- `skill/doodle-history-style/skill.yaml`

### 2. With any AI image generator (quickest for stills)

Copy a prompt from [`prompts/example-prompts.md`](prompts/example-prompts.md), replace the `[SCENE]` part with your sentence's scene, attach one example image as style reference, and generate. Remember: a still with only a slow zoom is not animation — every scene needs real motion inside the frame (see [`animation/ANIMATION.md`](animation/ANIMATION.md)).

Example prompt starter:

> Doodle history style, large round white head, dot eyes, angled eyebrows, thin stick arms, filled olive uniform torso, thick black outlines, full detailed muted atmospheric background, flat colours with lantern light / snowfall, 1920x1080, no text. Scene: [your scene here]

### 3. Make your own film (the template)

Copy `templates/doodle-video/`, write your script as one line per scene in
`script.json`, fill in a character sheet for every person, add a scene per
line in `src/shots.js` (one motion each), generate your narration, measure
the real line timings, and render. The demo story ("Mara and the Flying
Machine", 3 scenes, 20 seconds) is fictional — replace it with your own.

### 4. Best script input

Give narration + scene-by-scene shot list TOGETHER, segment by segment:

```
Segment 1
Narration: [exact words]
Scene: [who, what action, background, camera]
```

A full narration paragraph alone is not enough — split it into one-sentence segments, one shot for each. Timestamps alone are not reliable; timings are re-measured from the actual generated voice.

## What's in this repo

```
.
├── README.md
├── STYLE.md                  # full locked style guide
├── LICENSE                   # MIT
├── examples/                 # 4 original reference pictures
│   ├── 01-village-supply-truck.webp
│   ├── 02-trench-truck-column.webp
│   ├── 03-tent-food-lantern.webp
│   └── 04-crew-fixing-truck-engine.webp
├── prompts/
│   └── example-prompts.md    # copy-paste prompts
├── characters/
│   └── CHARACTER_SHEETS.md   # one fixed look per person (fictional worked examples + blank sheet)
├── animation/
│   └── ANIMATION.md          # scene-by-scene motion menu + scene-1 gate
├── docs/
│   ├── 3D-DEPTH.md           # stylized 3D / 2.5D: shading, shadows, parallax, sway
│   └── REAL-FACE.md          # photo face on a doodle head + expression variants + identity rules
├── skill/
│   └── doodle-history-style/ # installable Muse/Claude skill
│       ├── SKILL.md
│       └── skill.yaml
└── templates/
    └── doodle-video/         # minimal working project + 3-scene fictional demo
        ├── README.md
        ├── index.html
        ├── package.json
        ├── render.sh
        ├── script.json
        ├── data/             # lines.json + words.json (narration clock)
        ├── fonts/            # Inter Black + Caladea Bold (OFL)
        ├── faces/            # empty — your own photo-face cutouts go here
        ├── faces-variants/   # empty — code-drawn expression variants go here
        ├── src/              # main.js, shots.js, doodle.js, faces.js, core/
        ├── tools/            # capture.mjs (check/frames/preview), make_variants.py
        └── renders/
            └── demo.mp4      # pre-rendered demo (20 s, 1920x1080)
```

## Real faces — read the rules first

A real photo face can sit on a doodle head so viewers know who the
character is (see [`docs/REAL-FACE.md`](docs/REAL-FACE.md)). The character
stays a cartoon, the face never lip-syncs or speaks, and you may only use a
photo you have the right to use. This is not a deepfake tool: never use a
real person's face to fake them doing or saying something they did not do
or say, and never present a photo face as real footage. This pack ships
with **no real people's photos** — the demo characters are fictional and
drawn.

## License

MIT — see [`LICENSE`](LICENSE). You may use, remix and share this style guide, the prompts and the template code. The 4 example pictures are original works in this style; do not present them as real archival photos. The fonts in `templates/doodle-video/fonts/` are under the SIL Open Font License.

## Credit

If you use this style, a link back to this repo is appreciated, not required.
