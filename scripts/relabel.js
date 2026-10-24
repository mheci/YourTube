#!/usr/bin/env node
// One-shot label migration: applies scripts/relabel-map.js (id -> new
// name/summary and category) onto both registration forms:
//   xa.register({ id: "x", name: "...", summary: "...", ... })
//   Ha("id", "name", "summary", masterKey, css)        (CSS-only cards)
// Idempotent: a card already carrying the target label is counted, not
// rewritten. Fails loudly if any mapped id isn't found in exactly one form.
"use strict";
const fs = require("fs");
const path = require("path");
const map = require("./relabel-map.js");

const root = path.resolve(__dirname, "..");
const files = fs.readdirSync(path.join(root, "src")).filter((f) => f.endsWith(".js"));

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const results = new Map();
const misses = [];

for (const file of files) {
  let text = fs.readFileSync(path.join(root, "src", file), "utf8");
  let changed = false;
  for (const [id, r] of Object.entries(map)) {
    const idNeedle = `id: "${id}"`;
    const at = text.indexOf(idNeedle);
    if (at >= 0) {
      const win = text.slice(at, Math.min(text.length, at + 1200));
      const nameM = win.match(/name:\s*"((?:[^"\\]|\\.)*)"/);
      const sumM = win.match(/summary:\s*"((?:[^"\\]|\\.)*)"/);
      if (!nameM || !sumM) { misses.push(`${id} (${file})`); continue; }
      let block = win;
      if (nameM[1] !== r.name) block = block.replace(nameM[0], `name: "${r.name}"`);
      if (sumM[1] !== r.summary) block = block.replace(sumM[0], `summary: "${r.summary}"`);
      // anchor cat at the region BEFORE this block's masterKey line (a naive
      // window scan can see the next register block's cat and skip wrongly)
      const headUpToMaster = block.split(/masterKey:/)[0];
      if (!headUpToMaster.includes(`cat: "${r.cat}"`)) {
        block = block.replace(/(summary:\s*"(?:[^"\\]|\\.)*",)/, `$1\n      cat: "${r.cat}",`);
      }
      if (block !== win) { text = text.slice(0, at) + block + text.slice(at + win.length); changed = true; }
      results.set(id, file);
      continue;
    }
    // Ha("id", "name", "summary", ...) form — positional string args
    const haNeedle = `Ha(\n      "${id}",`;
    const haAt = text.indexOf(haNeedle);
    if (haAt >= 0) {
      const win = text.slice(haAt, Math.min(text.length, haAt + 900));
      const head = win.match(new RegExp(`Ha\\(\\n\\s+"${esc(id)}",\\n\\s+"((?:[^"\\\\]|\\\\.)*)",\\n\\s+"((?:[^"\\\\]|\\\\.)*)",`));
      if (!head) { misses.push(`${id} (${file}: Ha head)`); continue; }
      let block = win.replace(
        head[0],
        `Ha(\n      "${id}",\n      "${r.name}",\n      "${r.summary}",`,
      );
      // stamp cat as the 6th Ha arg, anchored at THIS call's closing paren
      // closer shapes: ",\n    ));" (chain end) and ",\n    )," (mid-chain)
      const closeRe = /,(\n\s*)\)([,)]*);?/;
      const closeM = block.match(closeRe);
      if (closeM) {
        const closePrefix = block.slice(0, closeM.index).replace(/,\s*$/, "");
        if (!closePrefix.endsWith(`"${r.cat}"`)) {
          const needle = closeM[0];
          const insert = `,\n      "${r.cat}"${closeM[1]})${closeM[2] || ""}${needle.endsWith(";") ? ";" : ""}`;
          block = block.slice(0, closeM.index) + insert + block.slice(closeM.index + needle.length);
        }
      }
      if (block !== win) { text = text.slice(0, haAt) + block + text.slice(haAt + win.length); changed = true; }
      results.set(id, file + " (Ha)");
    }
  }
  if (changed) fs.writeFileSync(path.join(root, "src", file), text);
}

const missing = Object.keys(map).filter((id) => !results.has(id));
if (misses.length || missing.length) {
  console.error("relabel INCOMPLETE:");
  misses.forEach((m) => console.error("  !", m));
  missing.forEach((m) => console.error("  - not found:", m));
  process.exit(1);
}
console.log(`relabel: ${results.size}/169 cards labelled`);
