#!/usr/bin/env node


// Generates YourTube's brand mark and its design candidates.
//
// Every mark is rendered from signed distance fields with supersampling, and
// the PNG is written by hand with zlib, so there are no image dependencies.
//
//   node scripts/make-icon.cjs                        # write icon.png (design: split)
//   node scripts/make-icon.cjs --list                 # list the designs
//   node scripts/make-icon.cjs --design orbit --out x.png
//   node scripts/make-icon.cjs --preview --design orbit
//   node scripts/make-icon.cjs --sheet-all sheet.png  # all designs with 32/16 px insets
"use strict";
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const OUT = 512;
const SS = 4;
const N = OUT * SS;
const U = SS; // coordinate helper: design specs are written in 512-space

const PINK = [255, 61, 127];
const VIOLET = [122, 92, 255];
const INK = [19, 21, 34];
const WHITE = [255, 255, 255];

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;

const gradient = (px, py) => {
  const t = clamp01((px + py) / (2 * N));
  return [lerp(PINK[0], VIOLET[0], t), lerp(PINK[1], VIOLET[1], t), lerp(PINK[2], VIOLET[2], t)];
};

// --- signed distance fields -------------------------------------------------

const roundRect = (px, py, x, y, w, h, r) => {
  const qx = Math.abs(px - (x + w / 2)) - (w / 2 - r);
  const qy = Math.abs(py - (y + h / 2)) - (h / 2 - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
};

const edgeDist = (px, py, x0, y0, x1, y1) => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  return ((px - x0) * dy - (py - y0) * dx) / Math.hypot(dx, dy);
};

const triangle = (px, py, ax, ay, bx, by, cx, cy, r) => {
  const s1 = Math.sign(edgeDist(cx, cy, ax, ay, bx, by)) || 1;
  const s2 = Math.sign(edgeDist(ax, ay, bx, by, cx, cy)) || 1;
  const s3 = Math.sign(edgeDist(bx, by, cx, cy, ax, ay)) || 1;
  const d1 = -edgeDist(px, py, ax, ay, bx, by) * s1;
  const d2 = -edgeDist(px, py, bx, by, cx, cy) * s2;
  const d3 = -edgeDist(px, py, cx, cy, ax, ay) * s3;
  return Math.max(d1, d2, d3) - r;
};

const circle = (px, py, cx, cy, r) => Math.hypot(px - cx, py - cy) - r;
const ring = (px, py, cx, cy, r, thickness) => Math.abs(circle(px, py, cx, cy, r)) - thickness / 2;

const capsule = (px, py, x0, y0, x1, y1, r) => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - x0) * dx + (py - y0) * dy) / len2;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return Math.hypot(px - (x0 + t * dx), py - (y0 + t * dy)) - r;
};

const arcBand = (px, py, cx, cy, r, thickness, fromDeg, toDeg) => {
  const dist = Math.hypot(px - cx, py - cy);
  let deg = (Math.atan2(py - cy, px - cx) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  if (fromDeg <= toDeg ? deg < fromDeg || deg > toDeg : deg < fromDeg && deg > toDeg) return 1;
  return Math.abs(dist - r) - thickness / 2;
};

// squircle tile covering the canvas
const tile = (px, py) => roundRect(px, py, 24 * U, 24 * U, N - 48 * U, N - 48 * U, 132 * U);
const onTile = (px, py) => tile(px, py) <= 0;

const PLAY = [196 * U, 152 * U, 196 * U, 360 * U, 380 * U, 256 * U, 30 * U];
const playSDF = (px, py, inset = 0) =>
  triangle(px, py, PLAY[0] + inset, PLAY[1] + inset, PLAY[2] + inset, PLAY[3] - inset, PLAY[4] - inset, PLAY[5], PLAY[6]);

// --- designs ----------------------------------------------------------------
// Each design returns [r, g, b, a] for one supersampled point.

const designs = {
  // Gradient tile with a two-tone play mark split along the gradient.
  split(px, py) {
    if (!onTile(px, py)) return null;
    if (playSDF(px, py) <= 0) {
      return (px - 292 * U) + (py - 256 * U) > 0 ? [...INK, 255] : [...WHITE, 255];
    }
    return [...gradient(px, py), 255];
  },

  // Two chevrons: "forward on your terms".
  chevron(px, py) {
    if (!onTile(px, py)) return null;
    const back = Math.min(
      capsule(px, py, 282 * U, 176 * U, 378 * U, 256 * U, 30 * U),
      capsule(px, py, 378 * U, 256 * U, 282 * U, 336 * U, 30 * U),
    );
    const front = Math.min(
      capsule(px, py, 160 * U, 176 * U, 256 * U, 256 * U, 30 * U),
      capsule(px, py, 256 * U, 256 * U, 160 * U, 336 * U, 30 * U),
    );
    const bg = gradient(px, py);
    if (front <= 0) return [...WHITE, 255];
    if (back <= 0) return [bg[0] * 0.45 + 255 * 0.55, bg[1] * 0.45 + 255 * 0.55, bg[2] * 0.45 + 255 * 0.55, 255];
    return [...bg, 255];
  },

  // Ink tile, gradient ring, white play: a portal player.
  orbitRing(px, py) {
    if (!onTile(px, py)) return null;
    if (ring(px, py, 256 * U, 256 * U, 152 * U, 34 * U) <= 0) return [...gradient(px, py), 255];
    if (playSDF(px, py, 10 * U) <= 0) return [...WHITE, 255];
    return [...INK, 255];
  },

  // Monogram: a "Y" whose stem is a downward play mark.
  monogram(px, py) {
    if (!onTile(px, py)) return null;
    const arms = Math.min(
      capsule(px, py, 186 * U, 116 * U, 256 * U, 262 * U, 28 * U),
      capsule(px, py, 326 * U, 116 * U, 256 * U, 262 * U, 28 * U),
    );
    const stem = triangle(px, py, 216 * U, 250 * U, 296 * U, 250 * U, 256 * U, 396 * U, 22 * U);
    if (arms <= 0 || stem <= 0) return [...WHITE, 255];
    return [...gradient(px, py), 255];
  },

  // Ink tile, gradient play, thin gradient border.
  outline(px, py) {
    if (!onTile(px, py)) return null;
    if (ring(px, py, 256 * U, 256 * U, 208 * U, 14 * U) <= 0) return [...gradient(px, py), 255];
    if (playSDF(px, py, 18 * U) <= 0) return [...gradient(px, py), 255];
    return [...INK, 255];
  },

  // Speech bubble with the play cut out: comments and community.
  bubble(px, py) {
    if (!onTile(px, py)) return null;
    const body = Math.min(
      roundRect(px, py, 148 * U, 148 * U, 216 * U, 184 * U, 46 * U),
      triangle(px, py, 188 * U, 318 * U, 252 * U, 318 * U, 196 * U, 384 * U, 16 * U),
    );
    const cut = triangle(px, py, 234 * U, 196 * U, 234 * U, 306 * U, 338 * U, 251 * U, 24 * U);
    if (body <= 0 && cut > 0) return [...WHITE, 255];
    return [...gradient(px, py), 255];
  },

  // Three tiles and a play tile: your layout, your player.
  tiles(px, py) {
    if (!onTile(px, py)) return null;
    const t1 = roundRect(px, py, 136 * U, 136 * U, 100 * U, 100 * U, 26 * U);
    const t2 = roundRect(px, py, 276 * U, 136 * U, 100 * U, 100 * U, 26 * U);
    const t3 = roundRect(px, py, 136 * U, 276 * U, 100 * U, 100 * U, 26 * U);
    const t4 = triangle(px, py, 288 * U, 288 * U, 288 * U, 388 * U, 388 * U, 338 * U, 18 * U);
    if (t1 <= 0 || t2 <= 0 || t3 <= 0) return [...WHITE, 255];
    if (t4 <= 0) return [...INK, 255];
    return [...gradient(px, py), 255];
  },

  // Ink tile, white play, gradient satellite and arc: session orbit.
  orbit(px, py) {
    if (!onTile(px, py)) return null;
    if (circle(px, py, 396 * U, 132 * U, 26 * U) <= 0) return [...gradient(px, py), 255];
    if (arcBand(px, py, 256 * U, 256 * U, 208 * U, 18 * U, 190, 260) <= 0) return [...gradient(px, py), 255];
    if (playSDF(px, py, 6 * U) <= 0) return [...WHITE, 255];
    return [...INK, 255];
  },

  // Play with a waveform: watch and listen.
  waveform(px, py) {
    if (!onTile(px, py)) return null;
    const bars = Math.min(
      capsule(px, py, 178 * U, 322 * U, 178 * U, 384 * U, 19 * U),
      capsule(px, py, 246 * U, 306 * U, 246 * U, 400 * U, 19 * U),
      capsule(px, py, 314 * U, 322 * U, 314 * U, 384 * U, 19 * U),
    );
    const play = triangle(px, py, 168 * U, 118 * U, 168 * U, 292 * U, 330 * U, 205 * U, 26 * U);
    if (bars <= 0 || play <= 0) return [...WHITE, 255];
    return [...gradient(px, py), 255];
  },

  // Negative space: white disc with the play cut out.
  negative(px, py) {
    if (!onTile(px, py)) return null;
    const disc = circle(px, py, 256 * U, 256 * U, 172 * U);
    const cut = triangle(px, py, 212 * U, 188 * U, 212 * U, 324 * U, 342 * U, 256 * U, 26 * U);
    if (disc <= 0 && cut > 0) return [...WHITE, 255];
    return [...gradient(px, py), 255];
  },
};

const DESIGN_NAMES = Object.keys(designs);

// --- renderer ---------------------------------------------------------------

function render(designName) {
  const design = designs[designName] || designs.split;
  const out = Buffer.alloc(OUT * OUT * 4);
  for (let oy = 0; oy < OUT; oy++) {
    for (let ox = 0; ox < OUT; ox++) {
      let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = ox * SS + sx + 0.5;
          const py = oy * SS + sy + 0.5;
          const sample = design(px, py);
          if (!sample) continue;
          const alpha = sample[3] / 255;
          sumR += sample[0] * alpha;
          sumG += sample[1] * alpha;
          sumB += sample[2] * alpha;
          sumA += alpha;
        }
      }
      const total = SS * SS;
      const index = (oy * OUT + ox) * 4;
      if (sumA > 0) {
        out[index] = Math.round(sumR / sumA);
        out[index + 1] = Math.round(sumG / sumA);
        out[index + 2] = Math.round(sumB / sumA);
        out[index + 3] = Math.round((sumA / total) * 255);
      }
    }
  }
  return out;
}

function downsample(rgba, size) {
  const dst = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const x0 = Math.floor((x * OUT) / size);
      const x1 = Math.max(x0 + 1, Math.floor(((x + 1) * OUT) / size));
      const y0 = Math.floor((y * OUT) / size);
      const y1 = Math.max(y0 + 1, Math.floor(((y + 1) * OUT) / size));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const i = (sy * OUT + sx) * 4;
          const alpha = rgba[i + 3] / 255;
          r += rgba[i] * alpha;
          g += rgba[i + 1] * alpha;
          b += rgba[i + 2] * alpha;
          a += alpha;
          n++;
        }
      }
      const j = (y * size + x) * 4;
      dst[j] = a > 0 ? Math.round(r / a) : 0;
      dst[j + 1] = a > 0 ? Math.round(g / a) : 0;
      dst[j + 2] = a > 0 ? Math.round(b / a) : 0;
      dst[j + 3] = Math.round((a / n) * 255);
    }
  }
  return dst;
}

// --- PNG writer -------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

const crc32 = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};

const chunk = (type, data) => {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
};

function writePng(rgba, width, height, target) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    rgba.copy(raw, row + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(target, png);
  return png.length;
}

// --- tiny 3x5 font for the contact sheet ------------------------------------

const FONT = {
  0: ["111", "101", "101", "101", "111"],
  1: ["010", "110", "010", "010", "111"],
  2: ["111", "001", "111", "100", "111"],
  3: ["111", "001", "111", "001", "111"],
  4: ["101", "101", "111", "001", "001"],
  5: ["111", "100", "111", "001", "111"],
  6: ["111", "100", "111", "101", "111"],
  7: ["111", "001", "010", "010", "010"],
  8: ["111", "101", "111", "101", "111"],
  9: ["111", "101", "111", "001", "111"],
};

function drawNumber(sheet, sheetWidth, x, y, value, scale, color) {
  const text = String(value);
  let cursor = x;
  for (const char of text) {
    const glyph = FONT[char];
    if (!glyph) continue;
    for (let gy = 0; gy < 5; gy++) {
      for (let gx = 0; gx < 3; gx++) {
        if (glyph[gy][gx] !== "1") continue;
        for (let py = 0; py < scale; py++) {
          for (let px = 0; px < scale; px++) {
            const index = ((y + gy * scale + py) * sheetWidth + (cursor + gx * scale + px)) * 4;
            sheet[index] = color[0];
            sheet[index + 1] = color[1];
            sheet[index + 2] = color[2];
            sheet[index + 3] = 255;
          }
        }
      }
    }
    cursor += 4 * scale;
  }
}

// --- CLI --------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

if (args.includes("--list")) {
  console.log(DESIGN_NAMES.join("\n"));
  process.exit(0);
}

const designName = flag("--design", "split");
if (!designs[designName]) {
  console.error(`unknown design "${designName}"; available: ${DESIGN_NAMES.join(", ")}`);
  process.exit(1);
}

const rgba = render(designName);

if (args.includes("--preview")) {
  const cols = 40;
  const rows = 20;
  const shade = (r, g, b, a) => {
    if (a < 24) return " ";
    if (r > 220 && g > 220 && b > 220) return "#";
    if (r < 60 && g < 60 && b < 60) return "@";
    return (r - b) / 255 > 0.2 ? "*" : "+";
  };
  let preview = "";
  for (let ry = 0; ry < rows; ry++) {
    let line = "";
    for (let rx = 0; rx < cols; rx++) {
      const x = Math.floor(((rx + 0.5) / cols) * OUT);
      const y = Math.floor(((ry + 0.5) / rows) * OUT);
      const i = (y * OUT + x) * 4;
      line += shade(rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3]);
    }
    preview += line + "\n";
  }
  console.log(preview);
}

const sheetPath = flag("--sheet-all", null);
if (sheetPath) {
  const cell = 220;
  const cellHeight = 300;
  const cols = 5;
  const rows = Math.ceil(DESIGN_NAMES.length / cols);
  const width = cell * cols;
  const height = cellHeight * rows;
  const sheet = Buffer.alloc(width * height * 4);
  for (let i = 0; i < sheet.length; i += 4) {
    sheet[i] = 13;
    sheet[i + 1] = 15;
    sheet[i + 2] = 20;
    sheet[i + 3] = 255;
  }
  DESIGN_NAMES.forEach((name, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const baseX = col * cell;
    const baseY = row * cellHeight;
    const big = downsample(render(name), cell - 20);
    for (let y = 0; y < cell - 20; y++) {
      for (let x = 0; x < cell - 20; x++) {
        const i = (y * (cell - 20) + x) * 4;
        const alpha = big[i + 3] / 255;
        const dst = ((baseY + 34 + y) * width + (baseX + 10 + x)) * 4;
        for (let c = 0; c < 3; c++) {
          sheet[dst + c] = Math.round(big[i + c] * alpha + sheet[dst + c] * (1 - alpha));
        }
      }
    }
    drawNumber(sheet, width, baseX + 10, baseY + 8, index + 1, 4, [255, 255, 255]);
    const small32 = downsample(render(name), 32);
    const small16 = downsample(render(name), 16);
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const i = (y * 32 + x) * 4;
        const alpha = small32[i + 3] / 255;
        const dst = ((baseY + 256 + y) * width + (baseX + 10 + x)) * 4;
        for (let c = 0; c < 3; c++) {
          sheet[dst + c] = Math.round(small32[i + c] * alpha + sheet[dst + c] * (1 - alpha));
        }
      }
    }
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const i = (y * 16 + x) * 4;
        const alpha = small16[i + 3] / 255;
        const dst = ((baseY + 264 + y) * width + (baseX + 52 + x)) * 4;
        for (let c = 0; c < 3; c++) {
          sheet[dst + c] = Math.round(small16[i + c] * alpha + sheet[dst + c] * (1 - alpha));
        }
      }
    }
  });
  const bytes = writePng(sheet, width, height, sheetPath);
  console.log(`sheet written: ${sheetPath} (${width}x${height}, ${bytes} bytes, ${DESIGN_NAMES.length} designs)`);
}

const outPath = flag("--out", path.join(__dirname, "..", "icon.png"));
const bytes = writePng(rgba, OUT, OUT, outPath);
console.log(`${designName}: ${outPath} written (${OUT}x${OUT}, ${bytes} bytes)`);
