#!/usr/bin/env node
// privacy-gate: proves that safeMode (the "Maximum privacy" preset) blocks
// every script-initiated third-party network call at runtime, not just on
// paper. This is the regression harness for fix F4.
//
// Assertions:
//   1. safeMode=true + sponsorblock / dearrow / return-dislike enabled + SPA
//      nav fires → zero network calls of any kind.
//   2. Negative control — the SAME run with safeMode=false must fire the
//      SponsorBlock segment lookup, proving the harness actually exercises
//      the network path and result (1) is not vacuous.
//   3. Static guard — the safeMode gate stays inside fetchJson (80-engine)
//      and Fu (update check, 10-bootstrap).
"use strict";
const path = require("path");
const fs = require("fs");
const { boot } = require(path.join(__dirname, "lib-jsdom-boot.js"));

const root = path.resolve(__dirname, "..");
const THIRD_PARTY = /sponsor\.ajay\.app|sponsorblock|dearrow|returnyoutubedislike|raw\.githubusercontent\.com|github\.com/i;

const failures = [];

async function runOnce(safeMode) {
  const { g, engine, inst, wait } = await boot({
    preload(mem) {
      mem.set("yourtube.cfg.v3", {
        privacyPreset: safeMode ? "maximum" : "everyday",
        safeMode: !!safeMode,
        sponsorblockOn: true,
        deArrowOn: true,
        returnDislikeOn: true,
        historyOn: true,
      });
    },
  });
  inst.netCalls.length = 0; // ignore boot-time activity (icons, storage)

  // Force the network cards through a fresh apply + SPA navigation so their
  // lookup paths run against the jsdom watch page.
  engine.cfg.sponsorblockOn = true;
  engine.cfg.deArrowOn = true;
  engine.cfg.returnDislikeOn = true;
  engine.cfg.safeMode = !!safeMode;
  engine.apply("sponsorblock");
  engine.apply("dearrow");
  engine.apply("return-dislike");
  g.document.dispatchEvent(new g.Event("yt-navigate-start"));
  g.document.dispatchEvent(new g.Event("yt-navigate-finish"));
  await wait(2500);
  return { calls: inst.netCalls.slice(), engine };
}

(async () => {
  // Static guards first — cheap, and they pin the fix into the bundle text.
  const bundle = fs.readFileSync(path.join(root, "yourtube.user.js"), "utf8");
  const fetchJsonBody = bundle.slice(
    bundle.indexOf("const fetchJson = (url, opts) => {"),
    bundle.indexOf("const fetchJson = (url, opts) => {") + 700,
  );
  if (!/S\.safeMode/.test(fetchJsonBody) || !/SAFE_MODE_BLOCKED/.test(fetchJsonBody)) {
    failures.push("static: safeMode gate missing from fetchJson()");
  }
  const fuIdx = bundle.indexOf("function Fu(force) {");
  const fuHead = bundle.slice(fuIdx, fuIdx + 500);
  if (!/S\.safeMode/.test(fuHead)) {
    failures.push("static: safeMode gate missing from update check Fu()");
  }

  // (2) control first so we observe the harness work before asserting zero.
  const on = await runOnce(false);
  const controlHits = on.calls.filter((c) => THIRD_PARTY.test(c.url));
  const controlSB = on.calls.filter((c) => /sponsor\.ajay\.app/i.test(c.url));
  if (!controlSB.length) {
    failures.push(
      "control: enabling sponsorblock with safeMode=false produced no SponsorBlock lookup " +
        "(saw " +
        JSON.stringify(on.calls.slice(0, 6)) +
        ") — harness is not exercising the network path, cannot prove the gate",
    );
  }

  const off = await runOnce(true);
  const blockedHits = off.calls.filter((c) => THIRD_PARTY.test(c.url));
  if (off.calls.length) {
    failures.push(
      "safeMode=true but script attempted " +
        off.calls.length +
        " network call(s): " +
        JSON.stringify(off.calls.slice(0, 8)),
    );
  } else if (blockedHits.length) {
    failures.push("safeMode=true but third-party calls observed: " + JSON.stringify(blockedHits.slice(0, 8)));
  }

  if (failures.length) {
    console.error("privacy-gate FAIL");
    for (const f of failures) console.error("  - " + f);
    process.exit(1);
  }
  console.log(
    `privacy-gate OK (control fired ${controlSB.length} SponsorBlock lookup(s) with safeMode off; ` +
      `zero script-initiated calls with safeMode on)`,
  );
  process.exit(0);
})().catch((e) => {
  console.error("privacy-gate ERROR:", e && e.message);
  process.exit(2);
});
