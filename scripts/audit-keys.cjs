#!/usr/bin/env node


// Settings-integrity audit (report-only by default, --strict to fail).
//
//   dead defaults    : a key in the defaults table that no code ever mentions
//   invisible setting: a key read as S.<key> / S["<key>"] but absent from defaults
//   dead control     : a key a card declares but nothing consumes anywhere
//
// "Consumed" counts any mention outside the defaults table (including the
// string-keyed helpers Io()/Ro()/Ha()/aioEnroll() and preset maps), so only
// genuinely unused keys are reported. Internal markers (dashboard geometry,
// enrolment flags, sync markers) are allow-listed: they are deliberately not
// user settings.
"use strict";
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const strict = process.argv.includes("--strict");
const bundle = fs.readFileSync(path.join(root, "yourtube.user.js"), "utf8").replace(/\r\n/g, "\n");
const lines = bundle.split("\n");
const lineStarts = [];
{
  let acc = 0;
  for (const l of lines) { lineStarts.push(acc); acc += l.length + 1; }
}

const INTERNAL = new Set([
  "dashX", "dashY", "dashW", "dashH", "perfLevelSyncedFor", "netBudgetAlerted",
  "sbUserId", "updateCheckOn", "updateCheckHours",
  "aioPlayerToolsOnEnrolled", "aioShortsCleanupOnEnrolled", "aioFeedCleanupOnEnrolled",
  "aioCompactDenseOnEnrolled", "aioPrivacyShieldOnEnrolled", "aioCommentCleanupOnEnrolled",
  "longTaskWarnerOn", "longTaskWarnerThreshold", "videoStatsOn",
  // declared in the SponsorBlock defaults block (Object.assign'd into `s`)
  "sbOnlySkipIfVip", "sbIncognito", "sbSkipCountdown", "sbSkipCountdownTime", "sbBetterBeAware",
]);

// --- defaults table: brace-match the object literal after `s = Object.assign(` ---
const startLine = lines.findIndex((l) => /^\s*s = Object\.assign\($/.test(l));
if (startLine < 0) { console.error("audit-keys: defaults object not found"); process.exit(strict ? 1 : 0); }
const openPos = bundle.indexOf("{", lineStarts[startLine]);
let depth = 0, inStr = null, esc = false, closePos = -1;
for (let i = openPos; i < bundle.length; i++) {
  const ch = bundle[i];
  if (inStr) {
    if (esc) esc = false;
    else if (ch === "\\") esc = true;
    else if (ch === inStr) inStr = null;
    continue;
  }
  if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; continue; }
  if (ch === "{") depth++;
  else if (ch === "}") { depth--; if (depth === 0) { closePos = i; break; } }
}
const objText = bundle.slice(openPos, closePos + 1);
const defStartLine = bundle.slice(0, openPos).split("\n").length;
const defEndLine = bundle.slice(0, closePos).split("\n").length;

const defaults = [];
{
  const src = objText.slice(1, -1);
  let d = 0, s = null, e = false, segStart = 0;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (s) { if (e) e = false; else if (ch === "\\") e = true; else if (ch === s) s = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { s = ch; continue; }
    if (ch === "{" || ch === "[" || ch === "(") { d++; segStart = i + 1; continue; }
    if (ch === "}" || ch === "]" || ch === ")") { d--; segStart = i + 1; continue; }
    if (ch === "," && d === 0) { segStart = i + 1; continue; }
    if (ch === "\n") { segStart = i + 1; continue; }
    if (ch === ":" && d === 0) {
      const m = /^\s*([A-Za-z_$][\w$]*)\s*$/.exec(src.slice(segStart, i));
      if (m) defaults.push(m[1]);
      segStart = i + 1;
    }
  }
}
const defSet = new Set(defaults);

// --- card declarations -----------------------------------------------------
const cardKeys = new Set();
for (let i = 0; i < lines.length; i++) {
  if (!/\b(masterKey|keys)\s*:/.test(lines[i])) continue;
  for (const m of lines[i].matchAll(/"([A-Za-z_$][\w$]*)"/g)) cardKeys.add(m[1]);
}

// --- mentions outside the defaults table ----------------------------------
const mentioned = new Set();
const read = new Set();
for (let i = 0; i < lines.length; i++) {
  const ln = i + 1;
  if (ln >= defStartLine && ln <= defEndLine) continue;
  const line = lines[i];
  for (const m of line.matchAll(/"([A-Za-z_$][\w$]*)"/g)) mentioned.add(m[1]);
  for (const m of line.matchAll(/\b([A-Za-z_$][\w$]*)\b/g)) {
    const w = m[1];
    if (!/^[a-z][A-Za-z0-9]*$/.test(w)) continue;
    if (new RegExp("\\bS\\." + w + "\\b").test(line) || new RegExp("\\bS\\[\"" + w + "\"\\]").test(line)) {
      read.add(w);
      mentioned.add(w);
    }
  }
}

const deadDefaults = defaults.filter((k) => !INTERNAL.has(k) && !mentioned.has(k));
const invisible = [...read].filter((k) => !defSet.has(k) && !INTERNAL.has(k) && !/^(s|e|t|a|n|r|o|i|d|c|g|m|p|u|h|f|b|v|k|x|y|z|w|q|j|l)$/.test(k));
const deadControls = [...cardKeys].filter((k) => !INTERNAL.has(k) && defSet.has(k) && !mentioned.has(k));

const show = (label, list) => {
  console.log(`\n${label}: ${list.length}`);
  if (list.length) console.log("  " + list.sort().join(", "));
};
console.log(`audit-keys: defaults table lines ${defStartLine}-${defEndLine}, ${defaults.length} defaults, ${cardKeys.size} card keys`);
show("dead defaults (never mentioned)", deadDefaults);
show("invisible settings (read but not declared)", invisible);
show("dead controls (declared by a card, never consumed)", deadControls);

const problems = deadDefaults.length + invisible.length + deadControls.length;
console.log(
  problems
    ? `\naudit-keys: ${problems} finding(s). Report-only; pass --strict to fail the build.`
    : "\naudit-keys: clean (every default is consumed, every card key is read).",
);
process.exit(strict && problems ? 1 : 0);
