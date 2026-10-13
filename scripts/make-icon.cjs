#!/usr/bin/env node


// Generates icon.png: the YourTube brand mark.
//
// The design is a rounded square filled with the userscript's accent gradient
// (pink to violet) carrying a play mark whose two halves are white and ink,
// split along the gradient. Everything is rendered from signed distance fields
// with supersampling, and the PNG is written by hand with zlib, so the icon has
// no image dependencies and can be regenerated with `node scripts/make-icon.cjs`.
"use strict";
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const OUT = 512;                 // output size in pixels
const SS = 4;                    // supersampling factor
const N = OUT * SS;

// Palette: matches the accent the userscript dashboard uses.
const PINK = [255, 61, 127];
const VIOLET = [122, 92, 255];
const MARK_LIGHT = [255, 255, 255];
const MARK_INK = [19, 21, 34];

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;

// --- signed distance fields (positive outside, negative inside) -------------

const radius = 132 * SS;
const halfExtent = N / 2 - 24 * SS;
const edge = halfExtent - radius;

const roundRect = (px, py) => {
  const qx = Math.abs(px - N / 2) - edge;
  const qy = Math.abs(py - N / 2) - edge;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
};

const A = [196 * SS, 152 * SS];
const B = [196 * SS, 360 * SS];
const C = [380 * SS, 256 * SS];
const corner = 30 * SS;

const edgeDist = (px, py, x0, y0, x1, y1) => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  return ((px - x0) * dy - (py - y0) * dx) / Math.hypot(dx, dy);
};

const triSign = (x0, y0, x1, y1, ox, oy) => Math.sign(edgeDist(ox, oy, x0, y0, x1, y1)) || 1;

const s1 = triSign(A[0], A[1], B[0], B[1], C[0], C[1]);
const s2 = triSign(B[0], B[1], C[0], C[1], A[0], A[1]);
const s3 = triSign(C[0], C[1], A[0], A[1], B[0], B[1]);

const triangle = (px, py) => {
  const d1 = -edgeDist(px, py, A[0], A[1], B[0], B[1]) * s1;
  const d2 = -edgeDist(px, py, B[0], B[1], C[0], C[1]) * s2;
  const d3 = -edgeDist(px, py, C[0], C[1], A[0], A[1]) * s3;
  return Math.max(d1, d2, d3) - corner;
};

// The split runs diagonally, aligned with the gradient.
const splitCx = 292 * SS;
const splitCy = 256 * SS;
const split = (px, py) => (px - splitCx) + (py - splitCy);

// --- render (premultiplied RGBA, box-downsampled) ---------------------------

const out = Buffer.alloc(OUT * OUT * 4);
for (let oy = 0; oy < OUT; oy++) {
  for (let ox = 0; ox < OUT; ox++) {
    let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
    for (let sy = 0; sy < SS; sy++) {
      for (let sx = 0; sx < SS; sx++) {
        const px = ox * SS + sx + 0.5;
        const py = oy * SS + sy + 0.5;
        if (roundRect(px, py) > 0) continue;

        const t = clamp01((px + py) / (2 * N));
        let r = lerp(PINK[0], VIOLET[0], t);
        let g = lerp(PINK[1], VIOLET[1], t);
        let b = lerp(PINK[2], VIOLET[2], t);

        if (triangle(px, py) <= 0) {
          const mark = split(px, py) > 0 ? MARK_INK : MARK_LIGHT;
          r = mark[0];
          g = mark[1];
          b = mark[2];
        }
        sumR += r;
        sumG += g;
        sumB += b;
        sumA += 1;
      }
    }
    const total = SS * SS;
    const alpha = sumA / total;
    const index = (oy * OUT + ox) * 4;
    if (sumA > 0) {
      out[index] = Math.round(sumR / sumA);
      out[index + 1] = Math.round(sumG / sumA);
      out[index + 2] = Math.round(sumB / sumA);
      out[index + 3] = Math.round(alpha * 255);
    }
  }
}

// --- PNG encoder ------------------------------------------------------------

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

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(OUT, 0);
ihdr.writeUInt32BE(OUT, 4);
ihdr[8] = 8;      // bit depth
ihdr[9] = 6;      // RGBA
ihdr[10] = 0;     // deflate
ihdr[11] = 0;     // adaptive filtering
ihdr[12] = 0;     // no interlace

const raw = Buffer.alloc((OUT * 4 + 1) * OUT);
for (let y = 0; y < OUT; y++) {
  const row = y * (OUT * 4 + 1);
  raw[row] = 0;
  out.copy(raw, row + 1, y * OUT * 4, (y + 1) * OUT * 4);
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const target = path.join(__dirname, "..", "icon.png");
fs.writeFileSync(target, png);
console.log(`icon.png written: ${OUT}x${OUT}, ${png.length} bytes`);

// --- optional terminal preview ----------------------------------------------

if (process.argv.includes("--preview")) {
  const cols = 40;
  const rows = 20;
  const shade = (r, g, b, a) => {
    if (a < 24) return " ";
    if (r > 220 && g > 220 && b > 220) return "#";
    if (r < 60 && g < 60 && b < 60) return "@";
    const pinkness = (r - b) / 255;
    return pinkness > 0.2 ? "*" : "+";
  };
  let preview = "";
  for (let ry = 0; ry < rows; ry++) {
    let line = "";
    for (let rx = 0; rx < cols; rx++) {
      const x = Math.floor(((rx + 0.5) / cols) * OUT);
      const y = Math.floor(((ry + 0.5) / rows) * OUT);
      const i = (y * OUT + x) * 4;
      line += shade(out[i], out[i + 1], out[i + 2], out[i + 3]);
    }
    preview += line + "\n";
  }
  console.log(preview);
}

// --- optional contact sheet for small-size checks ----------------------------

const sheetIndex = process.argv.indexOf("--sheet");
if (sheetIndex !== -1 && process.argv[sheetIndex + 1]) {
  const sizes = [128, 64, 48, 32, 24, 16];
  const pad = 16;
  const width = sizes.reduce((sum, s) => sum + s + pad, pad);
  const height = 128 + pad * 2;
  const sheet = Buffer.alloc(width * height * 4 * 2); // two rows: dark and light

  const downsample = (size) => {
    const dst = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        const x0 = Math.floor((x * OUT) / size);
        const x1 = Math.max(x0 + 1, Math.floor(((x + 1) * OUT) / size));
        const y0 = Math.floor((y * OUT) / size);
        const y1 = Math.max(y0 + 1, Math.floor(((y + 1) * OUT) / size));
        let n = 0;
        for (let sy = y0; sy < y1; sy++) {
          for (let sx = x0; sx < x1; sx++) {
            const i = (sy * OUT + sx) * 4;
            const alpha = out[i + 3] / 255;
            r += out[i] * alpha;
            g += out[i + 1] * alpha;
            b += out[i + 2] * alpha;
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
  };

  const paste = (src, size, atX, atY, rowBase, background) => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const alpha = src[i + 3] / 255;
        const dst = ((atY + y) * width + (atX + x)) * 4 + rowBase * width * 4;
        for (let c = 0; c < 3; c++) {
          sheet[dst + c] = Math.round(src[i + c] * alpha + background[c] * (1 - alpha));
        }
        sheet[dst + 3] = 255;
      }
    }
  };

  let x = pad;
  for (const size of sizes) {
    paste(downsample(size), size, x, pad + (128 - size), 0, [13, 15, 20]);
    paste(downsample(size), size, x, pad + (128 - size), 1, [243, 244, 248]);
    x += size + pad;
  }

  const sheetRaw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    sheetRaw[row] = 0;
    sheet.copy(sheetRaw, row + 1, y * width * 4, (y + 1) * width * 4);
  }
  const sheetPng = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    (() => {
      const h = Buffer.alloc(13);
      h.writeUInt32BE(width, 0);
      h.writeUInt32BE(height, 4);
      h[8] = 8;
      h[9] = 6;
      return chunk("IHDR", h);
    })(),
    chunk("IDAT", zlib.deflateSync(sheetRaw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(process.argv[sheetIndex + 1], sheetPng);
  console.log(`contact sheet written: ${process.argv[sheetIndex + 1]} (${width}x${height})`);
}
