#!/usr/bin/env node
// YourTube build: stamp metadata, assemble src/ modules into the bundle.
//
// The bundle is a pure build artifact. Everything between ==UserScript== and
// the final IIFE close comes from src/ modules, concatenated in lexicographic
// order (the numeric prefixes are authoritative). No code is edited in the
// bundle; `npm run verify` proves the artifact matches the sources.
"use strict";
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src");

const toLf = (text) => text.replace(/\r\n/g, "\n");
const toCrlf = (text) => text.replace(/\n/g, "\r\n");
const read = (file) => toLf(fs.readFileSync(path.join(root, file), "utf8"));

const pkg = JSON.parse(read("package.json"));
const VERSION = pkg.version;
const LICENSE = pkg.license || "MIT";

const MODULES = fs.readdirSync(srcDir)
  .filter((f) => /^\d\d-.+\.js$/.test(f))
  .sort();

if (!MODULES.length) {
  console.error("build: no modules found in src/");
  process.exit(1);
}

let bundle;
{
  const parts = MODULES.map((f) => read(path.join("src", f)));
  let text = parts.join("\n");
  // Header stamps: one authoritative source per value (package.json).
  text = text.replace(/^\/\/ @version\s+.*$/m, "// @version      " + VERSION);
  text = text.replace(/^\/\/ @license\s+.*$/m, "// @license      " + LICENSE);
  // Runtime version stamps: the in-code fallback shown when GM_info is absent
  // (tests, raw script-tag injection) can never drift from package.json again.
  text = text.split("__YTP_VERSION__").join(VERSION);
  bundle = text;
}

const firstBrace = bundle.indexOf("(() => {");
if (firstBrace < 0 || !/\}\)\(\);\s*$/.test(bundle)) {
  console.error("build: assembled bundle does not look like the YourTube IIFE");
  process.exit(1);
}

fs.writeFileSync(path.join(root, "yourtube.user.js"), toCrlf(bundle));

{
  const m = /^([\s\S]*?==\/UserScript==\n)/.exec(bundle);
  if (!m) {
    console.error("build: could not extract userscript header");
    process.exit(1);
  }
  fs.writeFileSync(path.join(root, "yourtube.meta.js"), toCrlf(m[1]));
}
console.log("Built yourtube.user.js from " + MODULES.length + " modules (v" + VERSION + ", " + LICENSE + ")");
