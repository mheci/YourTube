#!/usr/bin/env node


const fs = require("fs");
const path = require("path");
const vm = require("vm");
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
  let result = { status: 0, stderr: "" };
  if (isBun) {
    try {
      bunTranspiler.transformSync(assembled);
    } catch (error) {
      result = { status: 1, stderr: String((error && error.message) || error) };
    }
  } else {
    const tmp = path.join(require("os").tmpdir(), `yt-check-${process.pid}.js`);
    fs.writeFileSync(tmp, assembled);
    result = spawnSync(process.execPath, ["--check", tmp], { encoding: "utf8" });
    try { fs.unlinkSync(tmp); } catch (_) {}
  }
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

// The exact-date formatter is the only new parsing branch in 1.10.0. Pull it
// out of the bundle source and assert the documented tokens still work.
(function validateDateFormatter() {
  try {
    const source = fs.readFileSync(path.join(root, "src", "85-merged-fixes.js"), "utf8");
    const start = source.indexOf("  const _ytAbsMonths");
    const end = source.indexOf("  // One shared cache");
    if (start < 0 || end < 0) throw new Error("date formatter anchors missing");
    const ctx = { Intl, Date, String, S: { exactDatesFormat: "yyyy-MM-dd" } };
    vm.createContext(ctx);
    vm.runInContext(
      source.slice(start, end) + "\nthis.format = _ytAbsFormatDate;",
      ctx,
    );
    const checks = [
      [ctx.format("2024-05-03"), "2024-05-03"],
      [ctx.format("not a date"), ""],
    ];
    ctx.S.exactDatesFormat = "dd/MM/yyyy";
    const named = ctx.format("2024-05-03");
    if (named !== "03/05/2024") checks.push([named, "dd/MM/yyyy output"]);
    const bad = checks.find(([got, want]) => got !== want);
    if (bad) {
      failed++;
      process.stderr.write(`check: date formatter returned ${JSON.stringify(bad[0])}, expected ${JSON.stringify(bad[1])}.\n`);
    } else {
      console.log("check: exact-date formatter OK.");
    }
  } catch (error) {
    failed++;
    process.stderr.write("check: exact-date formatter test failed: " + (error && error.message ? error.message : error) + "\n");
  }
})();
// The update channel is GitHub Releases only. A wrong asset name in either
// header silently breaks auto-updates even when every other check passes.
(function validateUpdateChannel() {
  try {
    const meta = fs.readFileSync(path.join(root, "yourtube.meta.js"), "utf8");
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    const base = "https://github.com/mheci/YourTube/releases/latest/download/";
    const read = (name) => {
      const match = new RegExp("^// @" + name + "\\s+(\\S+)", "m").exec(meta);
      return match ? match[1] : "";
    };
    const version = read("version");
    const update = read("updateURL");
    const download = read("downloadURL");
    const problems = [];
    if (version !== pkg.version) problems.push(`@version ${version || "missing"} != package ${pkg.version}`);
    if (update !== base + "yourtube.meta.js") problems.push(`@updateURL is ${update || "missing"}`);
    if (download !== base + "yourtube.user.js") problems.push(`@downloadURL is ${download || "missing"}`);
    if (problems.length) {
      failed++;
      process.stderr.write("check: update channel is not canonical: " + problems.join("; ") + "\n");
    } else {
      console.log("check: update channel points at GitHub Releases.");
    }
  } catch (error) {
    failed++;
    process.stderr.write("check: update channel test failed: " + (error && error.message ? error.message : error) + "\n");
  }
})();
// SponsorBlock privacy lookups return one entry per matching hash prefix, each
// tagged with its own videoID. A hash-only match silently returns zero segments.
(function validateSponsorBlockPrivacyMatch() {
  try {
    const source = fs.readFileSync(path.join(root, "src", "40-sponsorblock.js"), "utf8");
    const start = source.indexOf("      const extractSegmentArray =");
    const end = source.indexOf("      const normalizeSegments", start);
    if (start < 0 || end < 0) throw new Error("extractSegmentArray anchors missing");
    const ctx = { Array, String };
    vm.createContext(ctx);
    vm.runInContext(source.slice(start, end) + "\nthis.extract = extractSegmentArray;", ctx);
    const checks = [];
    const own = ctx.extract([{ videoID: "good", segments: [{ a: 1 }] }], "good", "abc");
    checks.push(["privacy entry match", own.matched === true && own.segments.length === 1]);
    const other = ctx.extract([{ videoID: "other", segments: [{ a: 1 }] }], "good", "abc");
    checks.push(["privacy entry mismatch", other.matched === false && other.segments.length === 0]);
    const barePrivacy = ctx.extract([{ a: 1 }], "good", "abc");
    checks.push(["privacy bare array rejected", barePrivacy.matched === false && barePrivacy.segments.length === 0]);
    const direct = ctx.extract([{ a: 1 }], "good", null);
    checks.push(["direct bare array accepted", direct.matched === true && direct.segments.length === 1]);
    const wrapped = ctx.extract({ videoID: "good", segments: [{ a: 1 }] }, "good", null);
    checks.push(["direct wrapped match", wrapped.matched === true && wrapped.segments.length === 1]);
    const anonymous = ctx.extract({ segments: [{ a: 1 }] }, "good", null);
    checks.push(["anonymous wrapper rejected", anonymous.matched === false]);
    const bad = checks.find(([, ok]) => !ok);
    if (bad) {
      failed++;
      process.stderr.write("check: SponsorBlock privacy match failed: " + bad[0] + ".\n");
    } else {
      console.log("check: SponsorBlock privacy match OK.");
    }
  } catch (error) {
    failed++;
    process.stderr.write("check: SponsorBlock privacy match test failed: " + (error && error.message ? error.message : error) + "\n");
  }
})();
(function validateDashboardLooks() {
  try {
    const source = fs.readFileSync(path.join(root, "src/76-looks.js"), "utf8");
    const ctx = { document: { getElementById() { return null; } }, Ta() {} };
    vm.createContext(ctx);
    vm.runInContext(
      source + "\nthis.looks = YT_DASH_LOOKS; this.base = YT_LOOK_BASE; this.css = YT_lookCss;",
      ctx,
    );
    const looks = ctx.looks;
    const problems = [];
    if (looks.length !== 20) problems.push("expected 20 looks, got " + looks.length);
    if (new Set(looks.map((look) => look.id)).size !== looks.length) problems.push("duplicate look ids");
    if (new Set(looks.map((look) => look.name)).size !== looks.length) problems.push("duplicate look names");
    for (const look of looks) {
      const css = ctx.css(look);
      if (!/^[a-z][a-z0-9-]*$/.test(look.id)) problems.push("bad id: " + look.id);
      if (!css.includes('data-look="' + look.id + '"')) problems.push(look.id + ": scope missing");
      if (!/--acc:\S/.test(css) || !/--ink:\S/.test(css) || !/--panel:\S/.test(css)) {
        problems.push(look.id + ": required tokens missing");
      }
      if (css.includes("undefined")) problems.push(look.id + ": undefined value in CSS");
    }
    if (!ctx.base.includes(".ytb-looksel")) problems.push("look picker base style missing");
    if (problems.length) {
      failed++;
      process.stderr.write("check: dashboard looks failed: " + problems.join("; ") + "\n");
    } else {
      console.log("check: 20 dashboard looks OK.");
    }
  } catch (error) {
    failed++;
    process.stderr.write("check: dashboard looks test failed: " + (error && error.message ? error.message : error) + "\n");
  }
})();
const bundle = fs.readFileSync(path.join(root, "yourtube.user.js"), "utf8");

// A master switch must reapply its own card. If the master key is missing from
// the card's keys list, clicking the switch changes S but never calls apply.
(function validateMasterKeys() {
  const re = /masterKey:\s*"([^"]+)"\s*,\s*keys:\s*\[([^\]]*)\]/g;
  const bad = [];
  for (const match of bundle.matchAll(re)) {
    if (!match[2].includes('"' + match[1] + '"')) bad.push(match[1]);
  }
  if (bad.length) {
    failed++;
    process.stderr.write("check: master keys missing from their own keys list: " + bad.join(", ") + "\n");
  } else {
    console.log("check: every master switch is in its own keys list.");
  }
})();
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
