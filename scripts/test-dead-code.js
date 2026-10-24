#!/usr/bin/env node
// dead-code: regression pin for the 1.3.0 removal of eight zombie functions.
// Each had exactly one textual reference — its own declaration — in the
// shipped bundle (verified by call-site scan during the audit). The test
// strips comments and asserts that neither declarations nor call sites of
// these identifiers ever return to the bundle.
"use strict";
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const bundle = fs.readFileSync(path.join(root, "yourtube.user.js"), "utf8");

// Remove line comments (the removal notes mention the old names) and string
// literals are left in place on purpose — these identifiers must not appear
// there either.
const stripped = bundle
  .replace(/\r\n/g, "\n")
  .split("\n")
  .filter((l) => !/^\s*\/\//.test(l))
  .join("\n");

const DEAD = [
  ["Et", 'legacy "next" beacon composer'],
  ["Bt", 'legacy "updated_metadata" beacon composer'],
  ["Pt", 'legacy "browse" history beacon composer'],
  ["It", 'legacy "log_event" beacon composer'],
  ["Rt", 'legacy "feedback" beacon composer'],
  ["Nt", 'legacy "att/get" beacon composer'],
  ["Vt", "qoe beacon composer"],
  ["Qa", "duplicate of Dt (beacon send)"],
];

const failures = [];
for (const [name, what] of DEAD) {
  const decl = stripped.match(new RegExp("\\bfunction\\s+" + name + "\\s*\\(", "g")) || [];
  const calls = stripped.match(new RegExp("\\b" + name + "\\s*\\(", "g")) || [];
  if (decl.length) failures.push(`${name} (${what}) is declared again: ${decl.length}x`);
  if (calls.length) failures.push(`${name} (${what}) has call sites: ${calls.length}x`);
}

// Also pin the paired duplicate defaults removed in the same pass (F2): the
// sleep-timer keys must appear exactly once in the generated bundle.
const dupes = bundle.match(/sleepTimerOn:\s*!?[01t]/g) || [];
if (dupes.length !== 1) {
  failures.push(`sleepTimerOn default appears ${dupes.length} times (expected exactly 1 after the dedup)`);
}

if (failures.length) {
  console.error("dead-code FAIL");
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log(`dead-code OK (${DEAD.length} zombie functions stay removed, no duplicate defaults)`);
process.exit(0);
