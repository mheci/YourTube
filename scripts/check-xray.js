#!/usr/bin/env node


"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TARGETS = [
  path.join(ROOT, "yourtube.user.js"),
  ...["resources", "engine", "ublock-filter", "sponsorblock"].map(
    (m) => path.join(ROOT, "src", `${m}.js`),
  ),
];

// Assignment, compound assignment, Object.assign and delete all mutate page
// state; === comparisons must not be mistaken for assignments.
const RE_ASSIGN = /unsafeWindow\.[A-Za-z_$][\w$]*\s*(?:=(?!=)|\+=|-=|\*=|\/=|\?\?=|\|\|=|&&=)/g;
const RE_OTHER_WRITES = /Object\.assign\(\s*unsafeWindow|delete\s+unsafeWindow\.[A-Za-z_$][\w$]*/g;
const BRIDGE = /exportFunction|cloneInto|_xp\./;
const RE_PRIMITIVE = /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\d+|true|false|null|undefined)\s*$/;

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, "");
}

let violations = 0;
for (const file of TARGETS) {
  let raw;
  try { raw = fs.readFileSync(file, "utf8"); } catch (err) {
    violations++;
    console.error(`XRAY VIOLATION ${path.relative(ROOT, file)}: unreadable target (${err && err.message ? err.message : err})`);
    continue;
  }
  const src = stripComments(raw);
  RE_ASSIGN.lastIndex = 0;
  let m;
  while ((m = RE_ASSIGN.exec(src))) {
    const start = m.index + m[0].length;
    const end = src.indexOf(";", start);
    const rhs = (end === -1 ? src.slice(start) : src.slice(start, end)).trim();
    const bridged = BRIDGE.test(rhs);
    const primitive = RE_PRIMITIVE.test(rhs);
    if (bridged || primitive) continue;
    const line = src.slice(0, m.index).split("\n").length;
    violations++;
    console.error(`XRAY VIOLATION ${path.relative(ROOT, file)}:${line}: ` +
      `raw \`${m[0].trim()}\` without realm bridge`);
    console.error(`    rhs: ${rhs.slice(0, 90)}`);
  }

  RE_OTHER_WRITES.lastIndex = 0;
  let m2;
  while ((m2 = RE_OTHER_WRITES.exec(src))) {
    const line = src.slice(0, m2.index).split("\n").length;
    violations++;
    console.error(`XRAY VIOLATION ${path.relative(ROOT, file)}:${line}: ` +
      `raw \`${m2[0].trim()}\` without realm bridge`);
  }
}

if (violations) {
  console.error(`\ncheck-xray: ${violations} Xray-unsafe assignment(s) found. ` +
    `Route through exportFunction / cloneInto / _xp.*.`);
  process.exit(1);
}
console.log("check-xray: OK — no raw unsafeWindow function assignments.");
