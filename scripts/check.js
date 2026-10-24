#!/usr/bin/env node


const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
// src/ holds FRAGMENT modules: the 12 files cut from the single IIFE body
// (see scripts/build-userscript.js), intentionally delimited mid-statement.
// They are not valid standalone scripts, so they are validated as the
// assembled chain further below, not file-by-file here.
const srcModules = fs
  .readdirSync(path.join(root, "src"))
  .filter((f) => f.endsWith(".js"))
  .sort();
const files = ["yourtube.user.js", "yourtube.meta.js"].concat(
  fs
    .readdirSync(path.join(root, "scripts"))
    .filter((f) => (f.endsWith(".js") || f.endsWith(".cjs")) && f !== "check.js")
    .map((f) => path.join("scripts", f)),
);

const hasExplosion = (text) => {
  let run = 0;
  for (const line of text.split(/\r?\n/)) {
    run = line.length === 1 ? run + 1 : 0;
    if (run >= 20) return true;
  }
  return false;
};

let failed = 0;

const isBun = typeof Bun !== "undefined";
const bunTranspiler = isBun ? new Bun.Transpiler({ loader: "js" }) : null;
for (const file of files) {
  let failedMessage = "";
  try {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    if (isBun) {
      bunTranspiler.transformSync(source);
    } else {
      const result = spawnSync(process.execPath, ["--check", path.join(root, file)], {
        encoding: "utf8",
      });
      if (result.status !== 0) failedMessage = result.stderr || "node --check failed";
    }
  } catch (error) {
    failedMessage = error && error.message ? String(error.message) : String(error);
  }
  if (failedMessage) {
    failed++;
    process.stderr.write(`Syntax error in ${file}\n${failedMessage}\n`);
  }
}

// Assembled-chain syntax validation for the fragment modules. The chain is
// written to a temp file so `node --check` produces a line number, which is
// then mapped back to the owning module via accumulated line offsets.
(function validateAssembledModules() {
  let assembled = "";
  const offsets = [];
  for (const mod of srcModules) {
    offsets.push({ mod, start: assembled === "" ? 1 : assembled.split("\n").length });
    const text = fs.readFileSync(path.join(root, "src", mod), "utf8");
    assembled += (assembled ? "\n" : "") + text;
  }
  const tmp = path.join(require("os").tmpdir(), `yt-check-${process.pid}.js`);
  fs.writeFileSync(tmp, assembled);
  const result = spawnSync(process.execPath, ["--check", tmp], { encoding: "utf8" });
  try { fs.unlinkSync(tmp); } catch (_) {}
  if (result.status !== 0) {
    const m = /:(\d+)/.exec(result.stderr || "");
    let where = "";
    if (m) {
      const line = Number(m[1]);
      const owner = [...offsets].reverse().find((o) => o.start <= line);
      if (owner) where = ` (src/${owner.mod}, line ${line - owner.start + 1})`;
    }
    failed++;
    process.stderr.write(`Syntax error in assembled src/ module chain${where}\n${result.stderr}\n`);
  } else {
    console.log(`check: assembled src/ module chain (${srcModules.length} modules) passed syntax validation.`);
  }
})();

const bundle = fs.readFileSync(path.join(root, "yourtube.user.js"), "utf8");
if (hasExplosion(bundle)) {
  failed++;
  process.stderr.write("check: yourtube.user.js contains a character-exploded line run (corruption).\n");
}
for (const file of fs.readdirSync(path.join(root, "src")).filter((f) => f.endsWith(".js"))) {
  if (hasExplosion(fs.readFileSync(path.join(root, "src", file), "utf8"))) {
    failed++;
    process.stderr.write(`check: src/${file} contains a character-exploded line run (corruption).\n`);
  }
}
if (!bundle.includes("return { createVideoRow, scoreVideo, setStatus, discoveryHost };")) {
  failed++;
  process.stderr.write("check: YourTubeDiscovery export line missing from bundle.\n");
}

// The build splices src/ mirrors into the bundle at these anchors. If an anchor
// or its end marker disappears, the next `npm run build` silently stops
// regenerating that region, so verify them explicitly.
(function validateSpliceAnchors() {
  const lf = bundle.replace(/\r\n/g, "\n");
  const anchors = [
    ["//  YourTubeResources", "\n    const oe = {"],
    ["//  SponsorBlock Engine v2 (YourTube)", "\n\n\n  let St_seekbarMarks"],
    ["//  uBlock Filter Interpreter Engine", "\n\n    function Cb_norm(e) {"],
    ["//  YourTubeEngine Ecosystem v3.0", "\n  (async function () {\n"],
  ];
  for (const [start, end] of anchors) {
    const s = lf.indexOf(start);
    const e = s < 0 ? -1 : lf.indexOf(end, s);
    if (s < 0 || e < 0) {
      failed++;
      process.stderr.write(
        `check: splice anchor missing (${JSON.stringify(start)} -> ${JSON.stringify(end)}).\n`,
      );
    }
  }
  if (failed === 0) console.log(`check: ${anchors.length} splice anchors intact.`);
})();

(function validateThemes() {
  // 1.4.0: the table ships as positional rows keyed by a _THEME_VARS header
  // and decoded by the adjacent .map() at module scope. check.js decodes the
  // same way so succeeding checks see full {id,name,mode,vars} objects.
  const vMatch = /const _THEME_VARS = (\[[^\]]+\]);/.exec(bundle);
  const start = bundle.indexOf("const Nr = ([");
  if (!vMatch || start < 0) {
    failed++;
    process.stderr.write("check: theme table (const Nr = ([ / _THEME_VARS) not found in bundle.\n");
    return;
  }
  const end = bundle.indexOf("\n  ]).map", start);
  if (end < 0) {
    failed++;
    process.stderr.write("check: theme table terminator missing.\n");
    return;
  }

  let themes;
  try {
    const vars = JSON.parse(vMatch[1]);
    const rows = JSON.parse(
      "[" + bundle.slice(start + "const Nr = ([".length, end).replace(/\r?\n/g, " ").replace(/,\s*$/, "") + "]",
    );
    themes = rows.map((r) =>
      r[3]
        ? { id: r[0], name: r[1], mode: r[2], vars: Object.fromEntries(r[3].map((v, i) => [vars[i], v])) }
        : { id: r[0], name: r[1], mode: r[2], vars: null },
    );
  } catch (e) {
    failed++;
    process.stderr.write("check: theme table is not valid data: " + e.message + "\n");
    return;
  }
  const REQUIRED_VARS = [
    "base-background", "raised-background", "menu-background",
    "general-background-a", "general-background-b", "general-background-c",
    "text-primary", "text-secondary", "text-disabled",
    "badge-chip-background", "outline", "call-to-action",
    "call-to-action-inverse", "icon-active-other", "icon-inactive",
    "10-percent-layer", "shadow",
  ];
  const COLOR = /^(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\))$/;
  const seen = new Set();
  for (const t of themes) {
    const label = t && t.id ? t.id : "(unknown)";
    if (!t.id || !/^[a-z0-9-]+$/.test(t.id)) { failed++; process.stderr.write(`check: theme ${label} has a bad id.\n`); }
    if (seen.has(t.id)) { failed++; process.stderr.write(`check: duplicate theme id "${t.id}".\n`); }
    seen.add(t.id);
    if (t.mode !== "dark" && t.mode !== "light" && t.mode !== "auto") { failed++; process.stderr.write(`check: theme ${label} has invalid mode "${t.mode}".\n`); }
    if (t.id === "none") continue;
    if (!t.vars) { failed++; process.stderr.write(`check: theme ${label} has no vars.\n`); continue; }
    for (const key of REQUIRED_VARS) {
      if (!(key in t.vars)) { failed++; process.stderr.write(`check: theme ${label} missing var "${key}".\n`); continue; }
      if (!COLOR.test(t.vars[key])) { failed++; process.stderr.write(`check: theme ${label} var "${key}" is not a color: ${t.vars[key]}\n`); }
    }
    for (const key of Object.keys(t.vars)) {
      if (!REQUIRED_VARS.includes(key)) { failed++; process.stderr.write(`check: theme ${label} has unexpected var "${key}".\n`); }
    }
  }
  if (themes.length < 30) {
    failed++;
    process.stderr.write(`check: theme table shrank to ${themes.length} entries (expected 30+).\n`);
  }
  if (failed === 0) console.log(`check: theme table OK (${themes.length} themes).`);
})();

if (failed > 0) {
  process.stderr.write(`check: ${failed} file(s) failed syntax validation.\n`);
  process.exit(1);
}
console.log(`check: ${files.length} script file(s) + assembled src/ chain passed syntax validation.`);
