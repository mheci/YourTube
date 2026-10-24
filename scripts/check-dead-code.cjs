#!/usr/bin/env node
// release gate: the eight legacy beacon composers removed in 1.3.0 must never
// reappear in the built bundle, and the deduplicated defaults must stay
// deduplicated. Fails the build on violation (unlike the report-only audits,
// dead code can only arrive via a human edit, so a failure is actionable).
"use strict";
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const bundle = fs.readFileSync(path.join(root, "yourtube.user.js"), "utf8");

const stripped = bundle
  .replace(/\r\n/g, "\n")
  .split("\n")
  .filter((l) => !/^\s*\/\//.test(l))
  .join("\n");

const DEAD = ["Et", "Bt", "Pt", "It", "Rt", "Nt", "Vt", "Qa"];
const failures = [];
for (const name of DEAD) {
  const decl = stripped.match(new RegExp("\\bfunction\\s+" + name + "\\s*\\(", "g")) || [];
  const calls = stripped.match(new RegExp("\\b" + name + "\\s*\\(", "g")) || [];
  if (decl.length) failures.push(`zombie function ${name} declared (${decl.length}x)`);
  if (calls.length) failures.push(`zombie function ${name} called (${calls.length}x)`);
}
const dupes = bundle.match(/sleepTimerOn:\s*!?[01t]/g) || [];
if (dupes.length !== 1) failures.push(`duplicate defaults regression: sleepTimerOn appears ${dupes.length}x`);

if (failures.length) {
  console.error("check-dead-code FAIL");
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log("check-dead-code OK");
