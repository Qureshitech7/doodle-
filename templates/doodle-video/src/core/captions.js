// Full-line captions: the whole spoken line, white with a black outline on a
// translucent dark box, bottom of frame (same look as the stills doodle sample).
// Shown from 0.05 s before the line starts until the next line starts (or shortly
// after the line ends). Uses data/lines.json only — no word timings needed.
import { ctx, H, clamp, lerp, seg, eob } from './lib.js';
import { T } from './timing.js';

const FONT = '800 42px Inter', LH = 54, MAXW = 1500, Y = 950;
let caps = [];

function wrap(text) {
  ctx.font = FONT; const words = text.split(/\s+/), lines = []; let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (ctx.measureText(t).width > MAXW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

export function buildCaptions(script) {
  caps = script.lines.map((ln, i) => ({
    line: i, s: T.lines[i].start - 0.05, text: ln.text, wrapped: wrap(ln.text),
  }));
  caps.forEach((c, k) => {
    const next = caps[k + 1], lineEnd = T.lines[c.line].end;
    c.e = next ? (next.s - lineEnd > 0.7 ? lineEnd + 0.35 : next.s) : T.dur;
  });
  return caps;
}
export const captionList = () => caps;

export function drawCaption(t) {
  const c = caps.find((c) => t >= c.s && t < c.e); if (!c) return;
  const lt = t - c.s, sc = lt < 0.18 ? lerp(0.7, 1, eob(seg(lt, 0, 0.18))) : 1;
  ctx.save(); ctx.translate(960, Y); ctx.scale(sc, sc);
  ctx.font = FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const bw = Math.max(...c.wrapped.map((l) => ctx.measureText(l).width)) + 56;
  const bh = c.wrapped.length * LH + 28;
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 8); ctx.fill();
  c.wrapped.forEach((l, i) => {
    const y = (i - (c.wrapped.length - 1) / 2) * LH;
    ctx.lineWidth = 5; ctx.strokeStyle = '#000'; ctx.strokeText(l, 0, y);
    ctx.fillStyle = '#FFFFFF'; ctx.fillText(l, 0, y);
  });
  ctx.restore();
}
