// Demo film — 3 scenes, one per narration line (FICTIONAL story, invented
// for this template so the pack contains no real people and no real events):
//   1. Mara the inventor walks across her workshop to show Theo her machine.
//   2. The brass engine glows as Mara winds it.
//   3. Theo stamps the paper APPROVED and shakes Mara's hand.
//
// Every scene has ONE motion from the menu in ../../animation/ANIMATION.md.
// A scene with no motion written down is a still — do not build it as one.
// Wide layout: scene area y 60–880, ground line y 820, caption strip y ~950.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as D from './doodle.js';

const GROUND = 820;
const INK = D.INK;

// 3D parallax background: the wall moves slower than the characters (the
// camera sway in main.js is counter-translated here), the floor a little
// faster — depth by motion. See ../../docs/3D-DEPTH.md.
function bg(wall, floor, t = 0) {
  const sx = Math.sin(t * 0.22) * 14, sy = Math.cos(t * 0.17) * 6;
  ctx.save(); ctx.translate(-sx * 0.65, -sy * 0.65);
  ctx.fillStyle = wall; ctx.fillRect(-300, -300, W + 600, H + 600);
  ctx.restore();
  ctx.save(); ctx.translate(-sx * 0.35, -sy * 0.35);
  ctx.fillStyle = floor; ctx.fillRect(-300, GROUND, W + 600, 400);
  ctx.strokeStyle = 'rgba(26,26,30,0.35)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(-300, GROUND); ctx.lineTo(W + 300, GROUND); ctx.stroke();
  ctx.restore();
}
// small background crowd, gently bobbing
function crowdRow(xs, y, s, t, cols) {
  xs.forEach((x, i) => {
    D.person({ x, y, s, dir: i % 2 ? 1 : -1, kind: 'crowd', col: cols[i % cols.length], t: t + i * 1.3, mood: 'flat' });
  });
}
// a workbench: wooden top, legs, tools hanging on the wall behind it
function workbench(x, y, w) {
  rr(x - w / 2, y - 26, w, 26, 6); ctx.fillStyle = '#8A6A48'; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
  for (const s of [-1, 1]) {
    line([[x + s * (w / 2 - 30), y], [x + s * (w / 2 - 30), y + 130]], INK, 8);
  }
  // tools on the wall: a wrench and a hammer, drawn as simple shapes
  ctx.save(); ctx.translate(x - w / 2 + 60, y - 190); ctx.rotate(0.4);
  line([[-30, 0], [30, 0]], INK, 10); circle(-34, 0, 14, '#6E6258'); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(-34, 0, 14, 0, TAU); ctx.stroke();
  ctx.restore();
  ctx.save(); ctx.translate(x + w / 2 - 70, y - 180); ctx.rotate(-0.3);
  line([[0, -40], [0, 40]], INK, 10); rr(-26, -56, 52, 26, 6); ctx.fillStyle = '#6E6258'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
  ctx.restore();
}

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o);
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ---- S1 — Mara walks across the workshop to Theo (motion: walk) ----
  add({
    id: 'S1', at: cut_(0), note: 'Mara walks across the workshop to Theo', cam: [960, 540], zoom: 0.05,
    draw(lt, d, t) {
      bg('#7A7F8A', '#5C5148', t);
      D.signText('PORTO · 1987', 960, 150, 64);
      workbench(960, 700, 900);
      // the brass flying machine, waiting on the bench
      D.gadgetD(960, 560, 0.55, t, 0.4);
      // Theo stands by the bench, watching
      D.person({ x: 1560, y: GROUND, s: 1.05, dir: -1, kind: 'theo', t, mood: 'flat', armF: 12 });
      // Mara walks from the left door to Theo: x 140 -> 1180, legs swinging
      const p = seg(lt, 0.1, d - 0.4), wx = lerp(140, 1180, eo(p));
      D.person({ x: wx, y: GROUND, s: 1, dir: 1, kind: 'mara', walk: lt * 7, t, mood: 'happy', mouth: 'smile', armF: -18 });
      crowdRow([240, 420, 1700], GROUND + 40, 0.7, t, ['#6E6258', '#3D4A5C']);
    },
  });

  // ---- S2 — the brass engine glows as Mara winds it (motion: glow + crank) ----
  add({
    id: 'S2', at: cut_(1), note: 'The brass engine glows; Mara winds the crank', cam: [960, 540], zoom: 0.08,
    draw(lt, d, t) {
      bg('#6B5A44', '#4A3A2E', t);
      workbench(960, 760, 1100);
      // the gadget, large in frame, glowing and pulsing
      D.gadgetD(960, 520, 1.05, t, 1);
      // rising glow particles
      for (let i = 0; i < 14; i++) {
        const ph = ((t * 0.35 + i / 14) % 1);
        const px = 760 + rnd(i) * 400, py = 700 - ph * 420;
        ctx.globalAlpha = 0.7 * (1 - ph);
        circle(px, py, 5 + rnd(i + 40) * 7, '#F7DC6F');
        ctx.globalAlpha = 1;
      }
      // Mara at the bench, winding the crank: her arm turns with the crank
      const crank = lt * 3.2;
      D.person({ x: 480, y: GROUND, s: 0.95, dir: 1, kind: 'mara', t, mood: 'happy', mouth: 'smile', armF: 30 + Math.sin(crank) * 22 });
      // the crank itself, spinning
      ctx.save(); ctx.translate(760, 520); ctx.rotate(crank);
      line([[-70, 0], [70, 0]], INK, 10); circle(70, 0, 12, '#C8952F');
      ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(70, 0, 12, 0, TAU); ctx.stroke();
      ctx.restore();
      D.slipD('TEACUP ENGINE', 1420, 300, 1, 0.03);
      D.candle(1500, 760, 1.1, t, 2);
    },
  });

  // ---- S3 — Theo stamps APPROVED, then they shake hands (motion: stamp + handshake) ----
  add({
    id: 'S3', at: cut_(2), note: 'Theo stamps APPROVED; handshake', cam: [960, 540], zoom: 0.05,
    draw(lt, d, t) {
      bg('#5E6B5A', '#4A4238', t);
      // desk
      rr(620, 640, 680, 34, 6); ctx.fillStyle = '#8A6A48'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      line([[680, 674], [680, 820]], INK, 8); line([[1240, 674], [1240, 820]], INK, 8);
      // the paper on the desk (kept right of centre so Mara never covers the text)
      rr(860, 520, 260, 130, 4); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      line([[890, 560], [1090, 560]], '#999', 4); line([[890, 590], [1090, 590]], '#999', 4); line([[890, 620], [1010, 620]], '#999', 4);
      // the stamp slams down once, halfway through the line
      const st = seg(lt, d * 0.35, d * 0.45);
      const stampY = lerp(-260, 0, eo(st));
      ctx.save(); ctx.translate(990, 470 + stampY);
      rr(-70, -30, 140, 60, 8); ctx.fillStyle = '#7A2E3A'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      rr(-24, -78, 48, 48, 6); ctx.fillStyle = '#5A4632'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      ctx.restore();
      // APPROVED appears on the paper once the stamp lands
      if (st >= 1) {
        ctx.save(); ctx.translate(990, 585); ctx.rotate(-0.06);
        ctx.font = '900 44px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.lineWidth = 2; ctx.strokeStyle = '#7A2E3A'; ctx.strokeText('APPROVED', 0, 0);
        ctx.fillStyle = '#A8322D'; ctx.fillText('APPROVED', 0, 0); ctx.restore();
      }
      // handshake: Mara walks in to meet Theo; the joined hands are drawn at
      // the midpoint of their real hand positions, only once the hands meet
      const hp = seg(lt, d * 0.55, d * 0.75), hx = lerp(700, 800, eo(hp));
      const bobH = st >= 1 ? Math.sin(lt * 6) * 6 : 0;
      const mHand = D.person({ x: hx, y: GROUND, s: 0.95, dir: 1, kind: 'mara', t, mood: 'happy', mouth: 'smile', armF: 78 });
      const tHand = D.person({ x: 1240, y: GROUND, s: 1.0, dir: -1, kind: 'theo', t, mood: 'happy', mouth: 'smile', armF: 78 });
      if (hp >= 0.9) {
        const jx = (mHand.handX + tHand.handX) / 2, jy = (mHand.handY + tHand.handY) / 2 + bobH;
        circle(jx, jy, 16, '#FFFFFF'); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(jx, jy, 16, 0, TAU); ctx.stroke();
      }
      // the slip sits left, clear of the stamp's fall path (x 990)
      D.slipD('IT WILL FLY', 480, 200, 1.1, -0.02);
    },
  });

  return { shots: S, cues: CUES };
}
