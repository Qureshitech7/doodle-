# Real photo faces — drop your cutouts here

This folder is EMPTY on purpose: the pack ships with **no real people's
photos**. The demo characters (Mara, Theo) are drawn, not photographed.

To use a real photo face on a doodle character (see `../../docs/REAL-FACE.md`):

1. Get a photo you have the right to use — a photo the person gave you,
   a public-domain portrait, or a press headshot used for editorial
   illustration. Never use a photo of a real person to fake them doing or
   saying something they did not do or say.
2. Cut the face out with a transparent background
   (`rembg`, u2netp model — see the docs) and save the tight face crop as
   `faces/<name>.png`.
3. Add the key in `src/faces.js` (`'<name>': null` + a load line), and pass
   it per scene: `person({ ..., face: '<name>-smile' })`.
4. Optional: per-scene expression variants with
   `tools/make_variants.py` (code-drawn cues, no AI needed) into
   `faces-variants/<name>-<mood>.png`.

Files in this folder are your own photos — they are NOT part of the skill.
Do not commit someone else's photo to a public repo without the right to
share it.
