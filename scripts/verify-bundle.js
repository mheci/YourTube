#!/usr/bin/env node
// verify: the checked-in bundle must be exactly what the build produces.
// Replaces the old "git diff after splice" workflow gate.
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const bundlePath = path.join(root, "yourtube.user.js");
const metaPath = path.join(root, "yourtube.meta.js");

const before = fs.existsSync(bundlePath) ? crypto.createHash("sha256").update(fs.readFileSync(bundlePath)).digest("hex") : "absent";
const beforeMeta = fs.existsSync(metaPath) ? crypto.createHash("sha256").update(fs.readFileSync(metaPath)).digest("hex") : "absent";

execFileSync(process.execPath, [path.join(root, "scripts", "build-userscript.js")], { stdio: "inherit" });

const after = crypto.createHash("sha256").update(fs.readFileSync(bundlePath)).digest("hex");
const afterMeta = crypto.createHash("sha256").update(fs.readFileSync(metaPath)).digest("hex");

if (before !== after || beforeMeta !== afterMeta) {
  console.error("verify: bundle is stale — run npm run build and commit the artifact.");
  process.exit(1);
}
console.log("verify: bundle matches src/ modules (sha256 " + after.slice(0, 16) + "…)");
