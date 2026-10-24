#!/usr/bin/env node
// config-schema: structural invariants of the settings schema (the defaults
// table `s` + the coercion functions D()/j() in src/10-bootstrap.js).
//
// Pins:
//   1. no duplicate keys inside the defaults table (regression pin for F2 —
//      the shipping defaults duplicated sleepTimerOn/sleepTimerMin);
//   2. prototype-pollution guard is present in the config writers (Ta/Oa use
//      _FORBIDDEN_CFG_KEYS; D() skips __proto__/constructor/prototype);
//   3. every switch the 1.3.0 privacy-preset clamp touches must exist in the
//      defaults table (a typo there would silently no-op the promise the
//      preset labels make);
//   4. every string value of the privacy preset select is handled by Sa().
"use strict";
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const bootstrap = fs.readFileSync(path.join(root, "src", "10-bootstrap.js"), "utf8");
const core = fs.readFileSync(path.join(root, "src", "50-core-cards.js"), "utf8");
const failures = [];

// ---- 1. extract the defaults table and check for duplicate keys -------------
// The table is built as `s = Object.assign({...}, c, {...}, ...)`. We collect
// every top-level `{ key: value` entry of each literal argument.
const assignIdx = bootstrap.indexOf("s = Object.assign(");
if (assignIdx < 0) failures.push("could not find `s = Object.assign(` defaults table");
else {
  // skip strings/comments while brace-matching
  const args = [];
  let depth = 0,
    argStart = -1,
    i = bootstrap.indexOf("(", assignIdx) + 1;
  const src = bootstrap;
  const skipString = (i, q) => {
    i++;
    while (i < src.length && src[i] !== q) {
      if (src[i] === "\\") i++;
      i++;
    }
    return i + 1;
  };
  while (i < src.length && args.length < 8) {
    const ch = src[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      i = skipString(i, ch);
      continue;
    }
    if (ch === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && src[i + 1] === "*") {
      i = src.indexOf("*/", i + 2) + 2;
      continue;
    }
    if (ch === "{") {
      if (depth === 0) argStart = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && argStart >= 0) {
        args.push(src.slice(argStart, i + 1));
        argStart = -1;
      }
    } else if (ch === ")" && depth === 0) break;
    i++;
  }

  const seen = new Map();
  const dupes = [];
  for (const lit of args) {
    // top-level entries only: depth-1 lines like `keyName: value,`
    let d1 = 0;
    for (const line of lit.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_$][\w$]*)\s*:/);
      // Count depth crudely by braces on the line; entries live at depth 1.
      if (m && d1 === 1) {
        if (seen.has(m[1])) dupes.push(`${m[1]} (first at ${seen.get(m[1])})`);
        else seen.set(m[1], lit.indexOf(line));
      }
      for (const ch of line) {
        if (ch === "{") d1++;
        else if (ch === "}") d1--;
      }
    }
  }
  if (seen.size < 300) failures.push(`defaults table looks truncated — only ${seen.size} keys parsed (expected >300)`);
  if (dupes.length) failures.push(`duplicate keys in defaults table: ${dupes.join(", ")}`);

  // ---- 3. the privacy clamp switches must be real defaults -----------------
  const CLAMP_KEYS = [
    "netMonitorOn", "netBudgetOn", "netQualityAttribOn", "sessionReplay",
    "apiExplorer", "apiExplorerMutations", "netMonitorBadge", "diagConsole",
    "statsOverlay", "updateCheckOn", "safeMode", "privacyShieldOn",
  ];
  const missing = CLAMP_KEYS.filter((k) => !seen.has(k));
  if (missing.length) {
    failures.push("preset clamp writes to non-default keys (typo or missing default): " + missing.join(", "));
  }
}

// ---- 2. prototype-pollution guards ------------------------------------------
if (!/for \(\s*const a of Object\.keys\(e\)\s*\)\s*\{\s*if \(_FORBIDDEN_CFG_KEYS\[a\]\) continue;/s.test(core)) {
  failures.push("Oa() lost its _FORBIDDEN_CFG_KEYS guard");
}
if (!/_FORBIDDEN_CFG_KEYS\[e\]\) return;/.test(core)) {
  failures.push("Ta() lost its _FORBIDDEN_CFG_KEYS guard");
}
if (!/a === "__proto__" \|\| a === "constructor" \|\| a === "prototype"/.test(bootstrap)) {
  failures.push("D() sanitiser lost its __proto__/constructor/prototype skip");
}

// ---- 4. preset options exist and the strict ones are handled by Sa() --------
const dashboard = fs.readFileSync(path.join(root, "src", "75-dashboard.js"), "utf8");
const selectDef = dashboard.slice(dashboard.indexOf('Po("privacyPreset"'), dashboard.indexOf('Po("privacyPreset"') + 400);
if (!/everyday/.test(selectDef) || !/stealth/.test(selectDef) || !/maximum/.test(selectDef)) {
  failures.push("privacyPreset select no longer offers everyday/stealth/maximum");
}
// The labels print a promise ("no traffic monitoring", "no network calls");
// the clamp must be what keeps it.
if (!/no traffic monitoring/.test(selectDef) || !/no network calls/.test(selectDef)) {
  failures.push("privacy preset labels changed — review the clamp promise in Sa()");
}
const sa = core.slice(core.indexOf("function Sa(e) {"), core.indexOf("function Sa(e) {") + 2600);
for (const v of ["stealth", "maximum"]) {
  if (!sa.includes(v)) failures.push(`Sa() does not handle strict preset value "${v}"`);
}
if (!/_privacyPresetClamp/.test(sa)) failures.push("Sa() lost the _privacyPresetClamp() hook");

if (failures.length) {
  console.error("config-schema FAIL");
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log("config-schema OK (defaults unique, guards intact, clamp keys real, presets handled)");
process.exit(0);
