// Real photo faces for the main characters, loaded once at boot.
// See ../../docs/REAL-FACE.md for the full technique (background removal,
// expression variants, and the identity rules).
//
// How to use it:
//   1. Cut each face out of its photo with a transparent background
//      (tools: rembg, u2netp model — see docs/REAL-FACE.md) and save it as
//      faces/<name>.png (a tight crop of the face, transparent PNG).
//   2. Add the key below (e.g. 'mara': null) and the matching line in
//      loadFaces() (e.g. ['mara', 'faces/mara.png']).
//   3. Pass the key per scene: person({ ..., face: 'mara-smile' }).
//   4. Optional: build per-scene expression variants with
//      tools/make_variants.py (code-drawn cues, no AI needed).
//
// The loader is resilient on purpose: a missing file only warns, and the
// character falls back to its drawn doodle face (see doodle.js drawHead).
// The demo ships with NO face photos — its characters are drawn — so this
// file loads nothing until you add your own.
export const FACES = {
  // Add your characters here, one key per face, e.g.:
  // mara: null,
  // 'mara-smile': null,
  // theo: null,
};

function load(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error('face image failed to load: ' + src));
    img.src = src;
  });
}

export async function loadFaces() {
  const entries = [
    // Add one line per face, e.g.:
    // ['mara', 'faces/mara.png'],
    // ['mara-smile', 'faces-variants/mara-smile.png'],
    // ['theo', 'faces/theo.png'],
  ];
  const loaded = await Promise.all(
    entries.map(([k, src]) => load(src)
      .then((img) => [k, img])
      .catch((e) => { console.warn(e.message); return [k, null]; })));
  for (const [k, img] of loaded) if (img) FACES[k] = img;
}
