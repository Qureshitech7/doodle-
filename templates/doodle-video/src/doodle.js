// Doodle character library — characters defined ONCE, reused in every scene.
// Locked doodle look: large round WHITE head, dot eyes, angled eyebrows, thin stick
// arms, FILLED torso, thick black outlines, full detailed muted backgrounds.
// Demo characters (FICTIONAL — invent your own the same way):
//   Mara — inventor: auburn hair in a top bun, green work apron.
//   Theo — merchant: navy flat cap, small moustache, navy suit.
// Same functions + same colours + same proportions in EVERY scene = identical look.
// See ../../characters/CHARACTER_SHEETS.md for the rule, and ../../docs/3D-DEPTH.md
// for how the depth below works. See docs/REAL-FACE.md for the photo-face hook.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { FACES } from './faces.js';

export const INK = '#1A1A1E';
export const HEAD_R = 62;          // head radius at scale 1 (person ~462 tall)
const SKIN_WHITE = '#FFFFFF';
const HAIR_AUBURN = '#A85B32';
const HAIR_DARK = '#241F1C';
const CAP_NAVY = '#2E4057';
const MOUSTACHE = '#3B2A20';
const APRON = '#3F6B4F';
const APRON_DARK = '#2C4A37';
const SHIRT = '#F4F1EA';

// ---------- 3D depth ----------
// Light comes from the upper-left. Volumetric shading + soft ground shadows
// give every figure real depth while keeping the locked doodle look.
function headShade(x, y, r) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.15, x, y, r * 1.05);
  g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.62, '#F2F2F5'); g.addColorStop(1, '#CFCFD6');
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
  const g2 = ctx.createRadialGradient(x + r * 0.55, y + r * 0.5, r * 0.1, x + r * 0.4, y + r * 0.35, r * 0.95);
  g2.addColorStop(0, 'rgba(60,60,80,0.22)'); g2.addColorStop(1, 'rgba(60,60,80,0)');
  ctx.fillStyle = g2; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath(); ctx.ellipse(x - r * 0.38, y - r * 0.52, r * 0.20, r * 0.12, -0.5, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------- face ----------
function brows(x, y, r, mood, dir) {
  // mood: 'flat' | 'worried' | 'angry' | 'happy'
  ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineCap = 'round';
  const dy = mood === 'worried' ? 8 : mood === 'angry' ? -8 : mood === 'happy' ? 5 : 0;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(x + s * r * 0.18, y - r * 0.32);
    ctx.lineTo(x + s * r * 0.52, y - r * 0.32 + (s > 0 ? dy : -dy) * 0.4);
    ctx.stroke();
  }
}
function eyes(x, y, r) {
  circle(x - r * 0.34, y - r * 0.02, r * 0.095, INK);
  circle(x + r * 0.34, y - r * 0.02, r * 0.095, INK);
}
function mouth(x, y, r, kind) {
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath();
  if (kind === 'smile') ctx.arc(x, y + r * 0.28, r * 0.22, Math.PI * 0.15, Math.PI * 0.85);
  else if (kind === 'frown') ctx.arc(x, y + r * 0.62, r * 0.22, Math.PI * 1.15, Math.PI * 1.85);
  else if (kind === 'open') { ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(x, y + r * 0.45, r * 0.12, r * 0.16, 0, 0, TAU); ctx.fill(); return; }
  else { ctx.moveTo(x - r * 0.15, y + r * 0.42); ctx.lineTo(x + r * 0.15, y + r * 0.42); }
  ctx.stroke();
}
function genericHair(x, y, r, col) {
  // simple dark segment cap (officials / crowd) — hairline above the brows
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.03, Math.PI + 0.45, -0.45);
  ctx.quadraticCurveTo(x, y - r * 0.62, x - r * 1.03 * Math.cos(0.45), y - r * 1.03 * Math.sin(0.45));
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
}
// --- Mara: auburn hair in a top bun, side curls to the chin ---
function maraHairBack(x, y, r) {
  ctx.fillStyle = HAIR_AUBURN;
  ctx.beginPath(); ctx.arc(x, y - r * 0.1, r * 1.12, 0, TAU); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
  // the bun, behind the head
  ctx.beginPath(); ctx.arc(x, y - r * 1.18, r * 0.42, 0, TAU); ctx.fillStyle = HAIR_AUBURN; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
}
function maraHairFront(x, y, r) {
  // segment cap + bun on top + side curls down to the chin, drawn OVER the face edges
  ctx.fillStyle = HAIR_AUBURN;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.03, Math.PI + 0.45, -0.45);
  ctx.quadraticCurveTo(x, y - r * 0.62, x - r * 1.03 * Math.cos(0.45), y - r * 1.03 * Math.sin(0.45));
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y - r * 1.18, r * 0.42, 0, TAU); ctx.fillStyle = HAIR_AUBURN; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
  for (const s of [-1, 1]) {
    circle(x + s * r * 0.95, y + r * 0.35, r * 0.2, HAIR_AUBURN);
    ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x + s * r * 0.95, y + r * 0.35, r * 0.2, 0, TAU); ctx.stroke();
    circle(x + s * r * 0.98, y + r * 0.72, r * 0.16, HAIR_AUBURN);
    ctx.beginPath(); ctx.arc(x + s * r * 0.98, y + r * 0.72, r * 0.16, 0, TAU); ctx.stroke();
  }
}
// --- Theo: navy flat cap + small moustache ---
function theoCap(x, y, r) {
  ctx.fillStyle = CAP_NAVY;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.03, Math.PI + 0.45, -0.45);
  ctx.quadraticCurveTo(x, y - r * 0.62, x - r * 1.03 * Math.cos(0.45), y - r * 1.03 * Math.sin(0.45));
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
  // the cap's brim, sticking out at the front
  rr(x - r * 0.1, y - r * 0.52, r * 0.85, r * 0.16, r * 0.08);
  ctx.fillStyle = CAP_NAVY; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
}
function theoMoustache(x, y, r) {
  ctx.fillStyle = MOUSTACHE;
  ctx.beginPath(); ctx.ellipse(x, y + r * 0.24, r * 0.2, r * 0.07, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
}
// --- real photo face (see docs/REAL-FACE.md) ---
// The photo is clipped to an oval that nearly fills the round doodle head.
// Returns true when a photo was drawn (the drawn features are then skipped —
// the photo already has eyes, mouth and hair); false when there is no photo.
function photoFace(x, y, r, img) {
  if (!img) return false;
  const cx = x, cy = y + r * 0.02, rx = r * 0.88, ry = r * 0.94;
  ctx.save();
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.clip();
  const w = rx * 2, h = w / (img.naturalWidth / img.naturalHeight);
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU);
  ctx.strokeStyle = 'rgba(26,26,30,0.55)'; ctx.lineWidth = 4; ctx.stroke();
  return true;
}
function drawHead(x, y, r, kind, mood = 'flat', mouthKind = 'line', faceKey = null) {
  if (kind === 'mara') maraHairBack(x, y, r);
  // volumetric face (3D): shaded, not flat white — same outline, same proportions
  headShade(x, y, r);
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
  // extruded rim: offset arc on the dark side gives the head thickness
  ctx.beginPath(); ctx.arc(x + 3, y + 4, r, 0.15, Math.PI * 0.55); ctx.strokeStyle = 'rgba(26,26,30,0.45)'; ctx.lineWidth = 5; ctx.stroke();
  // real photo face when one is loaded for this character (faceKey selects a
  // code-drawn expression variant, e.g. 'mara-smile'); without it the plain
  // base face is used. No photo loaded = drawn face, as in the demo.
  const faceImg = faceKey && FACES[faceKey] ? FACES[faceKey]
    : kind === 'mara' ? FACES.mara
    : kind === 'theo' ? FACES.theo : null;
  if (faceImg && photoFace(x, y, r, faceImg)) return;
  // hair sits ON the face edges (cap + curls), never over the brows/eyes
  if (kind === 'mara') maraHairFront(x, y, r);
  else if (kind === 'theo') theoCap(x, y, r);
  else if (kind === 'official') genericHair(x, y, r, HAIR_DARK);
  eyes(x, y, r);
  brows(x, y, r, mood, 1);
  if (kind === 'theo') theoMoustache(x, y, r);
  mouth(x, y, r, mouthKind);
}

// ---------- bodies ----------
function torsoApron(cx, top, w, h) {
  // Mara's green work apron over a cream shirt: shoulders narrow, hem wide
  ctx.beginPath(); ctx.moveTo(cx - w * 0.32, top); ctx.lineTo(cx + w * 0.32, top);
  ctx.lineTo(cx + w * 0.62, top + h); ctx.lineTo(cx - w * 0.62, top + h); ctx.closePath();
  const g = ctx.createLinearGradient(cx - w * 0.6, top, cx + w * 0.6, top + h);
  g.addColorStop(0, '#5A8A6A'); g.addColorStop(0.5, APRON); g.addColorStop(1, '#243D2E');
  ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
  // apron straps + pocket
  ctx.strokeStyle = APRON_DARK; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(cx - w * 0.2, top + 6); ctx.lineTo(cx - w * 0.12, top + h * 0.4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + w * 0.2, top + 6); ctx.lineTo(cx + w * 0.12, top + h * 0.4); ctx.stroke();
  rr(cx - w * 0.22, top + h * 0.55, w * 0.44, h * 0.3, 8); ctx.fillStyle = APRON_DARK; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
}
function torsoSuit(cx, top, w, h, col) {
  rr(cx - w / 2, top, w, h, 22); ctx.fillStyle = col; ctx.fill();
  const gs = ctx.createLinearGradient(cx - w / 2, top, cx + w / 2, top + h);
  gs.addColorStop(0, 'rgba(255,255,255,0.20)'); gs.addColorStop(0.55, 'rgba(255,255,255,0)'); gs.addColorStop(1, 'rgba(0,0,0,0.30)');
  ctx.fillStyle = gs; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
  // white shirt V + tie
  ctx.beginPath(); ctx.moveTo(cx - 26, top + 4); ctx.lineTo(cx + 26, top + 4); ctx.lineTo(cx, top + 58); ctx.closePath();
  ctx.fillStyle = SHIRT; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 9, top + 30); ctx.lineTo(cx + 9, top + 30); ctx.lineTo(cx + 6, top + 110); ctx.lineTo(cx - 6, top + 110); ctx.closePath();
  ctx.fillStyle = '#7A2E3A'; ctx.fill();
}

// ---------- full person ----------
// o = { x, y (feet), s, dir, kind: 'mara'|'theo'|'official'|'crowd',
//       walk (phase rad, null = standing), armF/armB (deg from straight-down, + = forward),
//       mood, mouth, face (photo-face variant key), col (suit/crowd colour), t }
export function person(o) {
  const s = o.s || 1, dir = o.dir || 1, kind = o.kind || 'crowd';
  const ph = o.walk;
  const swing = ph != null ? Math.sin(ph) : 0;
  const lift = ph != null ? Math.max(0, -Math.cos(ph)) : 0;
  const bob = ph != null ? -Math.abs(Math.sin(ph)) * 12 : Math.sin((o.t || 0) * 2 + (o.x || 0)) * 2.5;
  ctx.save(); ctx.translate(o.x, o.y + bob * s); ctx.scale(s * dir, s);
  // 3D: soft drop shadow on the ground (light from upper-left)
  ell(16, 6, 104, 15, 'rgba(0,0,0,0.20)');
  ell(11, 4, 80, 11, 'rgba(0,0,0,0.22)');
  ell(6, 3, 56, 8, 'rgba(0,0,0,0.25)');
  const hipY = -205, shoY = -345, headY = -400, R = HEAD_R;
  // legs (thin sticks, dark trousers)
  ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.lineCap = 'round';
  for (const k of [0, 1]) {
    const p2 = k === 0 ? ph : (ph != null ? ph + Math.PI : null);
    const sw = p2 != null ? Math.sin(p2) : 0, lf = p2 != null ? Math.max(0, -Math.cos(p2)) : 0;
    const hx = k === 0 ? -18 : 18;
    ctx.beginPath(); ctx.moveTo(hx, hipY); ctx.lineTo(hx + sw * 42, -lf * 24); ctx.stroke();
    // shoe
    ell(hx + sw * 42 + 8, -lf * 24 - 4, 20, 9, INK);
  }
  // back arm
  const armLen = 150;
  const armEnd = (shX, deg) => { const a = (deg || 0) * Math.PI / 180; return [shX + Math.sin(a) * armLen, shoY + 10 + Math.cos(a) * armLen]; };
  const bEnd = armEnd(-52, (o.armB || 0) - swing * 14);
  line([[-52, shoY + 10], bEnd], INK, 9);
  circle(bEnd[0], bEnd[1], 10, SKIN_WHITE);
  ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(bEnd[0], bEnd[1], 10, 0, TAU); ctx.stroke();
  // torso
  if (kind === 'mara') torsoApron(0, shoY, 150, 175);
  else if (kind === 'theo') torsoSuit(0, shoY, 150, 160, '#2E4057');
  else if (kind === 'official') torsoSuit(0, shoY, 150, 160, o.col || '#3D4A5C');
  else torsoSuit(0, shoY, 150, 160, o.col || '#6E6258');
  // front arm
  const fEnd = armEnd(52, (o.armF || 0) + swing * 14);
  line([[52, shoY + 10], fEnd], INK, 9);
  circle(fEnd[0], fEnd[1], 10, SKIN_WHITE);
  ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(fEnd[0], fEnd[1], 10, 0, TAU); ctx.stroke();
  // head
  drawHead(0, headY, R, kind, o.mood || 'flat', o.mouth || 'line', o.face || null);
  ctx.restore();
  // return the front hand position in screen coords (for holding things)
  const a = ((o.armF || 0) + swing * 14) * Math.PI / 180;
  return { handX: o.x + dir * (52 * s + Math.sin(a) * 150 * s), handY: o.y + bob * s + (-345 + 10 + Math.cos(a) * 150) * s };
}

// ---------- props ----------
// brass gadget (the flying machine's engine): thick outline, gold centre,
// glow pulse. Scale + glow are parameters so the same prop can throb.
export function gadgetD(x, y, s, t, glow = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const pulse = 0.85 + 0.15 * Math.sin(t * 4);
  if (glow > 0) {
    ctx.save(); ctx.globalAlpha = 0.30 * glow * pulse;
    circle(0, 0, 210, '#F2A93B'); ctx.globalAlpha = 0.22 * glow * pulse; circle(0, 0, 270, '#F2A93B');
    ctx.restore();
  }
  // mounting bolts
  for (let i = 0; i < 5; i++) { rr(-150, -96 + i * 40, 24, 14, 3); ctx.fillStyle = '#8A6A48'; ctx.fill(); rr(126, -96 + i * 40, 24, 14, 3); ctx.fillStyle = '#8A6A48'; ctx.fill(); }
  rr(-130, -130, 260, 260, 16); ctx.fillStyle = '#B08A3E'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.stroke();
  rr(-80, -80, 160, 160, 10); ctx.fillStyle = '#7A5A28'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
  rr(-38, -38, 76, 76, 8); ctx.fillStyle = '#C8952F'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
  // spokes
  ctx.strokeStyle = '#C8952F'; ctx.lineWidth = 5; ctx.beginPath();
  ctx.moveTo(-110, -60); ctx.lineTo(-80, -60); ctx.moveTo(110, 40); ctx.lineTo(80, 40); ctx.moveTo(-60, 110); ctx.lineTo(-60, 80); ctx.moveTo(60, -110); ctx.lineTo(60, -80); ctx.stroke();
  ctx.restore();
}
// a paper slip (doodle style: white, thick black outline, red pin)
export function slipD(text, x, y, sc = 1, rot = -0.02, size = 46) {
  if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.font = `800 ${size}px Inter`; const w = ctx.measureText(text).width + 64;
  rr(-w / 2, -size * 0.75, w, size * 1.5, 6); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4);
  circle(0, -size * 0.75 + 8, 9, '#D62839');
  ctx.restore();
}
// big outlined sign text
export function signText(text, x, y, size, fill = '#FFFFFF') {
  ctx.save(); ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.18; ctx.strokeStyle = INK; ctx.strokeText(text, x, y); ctx.fillStyle = fill; ctx.fillText(text, x, y); ctx.restore();
}
// candle with a flickering flame
export function candle(x, y, s, t, seed = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-16, -70, 32, 70, 6); ctx.fillStyle = '#F4F1EA'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
  const fl = 1 + 0.22 * Math.sin(t * 11 + seed) + 0.1 * Math.sin(t * 23 + seed * 2);
  ctx.save(); ctx.translate(0, -70); ctx.scale(1, fl);
  ctx.beginPath(); ctx.moveTo(-13, 0); ctx.quadraticCurveTo(-16, -34, -2 + Math.sin(t * 7 + seed) * 4, -52); ctx.quadraticCurveTo(14, -30, 13, 0); ctx.closePath();
  ctx.fillStyle = '#F2A93B'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-6, 0); ctx.quadraticCurveTo(-8, -18, 0, -30); ctx.quadraticCurveTo(7, -16, 6, 0); ctx.closePath(); ctx.fillStyle = '#F7DC6F'; ctx.fill();
  ctx.restore(); ctx.restore();
}
// magnifier; returns the lens centre
export function magnifier(x, y, r, rot = 0.5) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 12; ctx.stroke();
  line([[r * 0.7, r * 0.7], [r * 1.7, r * 1.7]], INK, 14);
  ctx.restore();
  return [x, y];
}
