#!/usr/bin/env node
// leak-bisect: per-card ON→OFF leftover audit for the cards the 1.3.0 deep
// audit flagged. Each card is applied alone in jsdom, torn down, and the
// leftovers (live timers / intervals / observers / net event listeners /
// YourTube DOM nodes) are compared against pinned upper bounds.
//
// Modes:
//   default          — only the flagged actionable cards; must meet the
//                      improved 1.3.0 bounds. This is the regression gate.
//   YT_LEAK_ALL=1    — full bisect of every masterKey card (diagnostic).
//
// Bounds rationale (values observed in the full bisect, minus the fixes):
//   theater-default  : F7 — intervals were +1, now must be 0; timers 0.
//   discover         : F8 — DOM residue was +1, now must be 0. The +13 net
//                      listeners stay documented as a benign asymmetry: they
//                      live on detached section nodes and are GC-collectable
//                      once the host root is removed, so we bound, not zero.
//   aio-* cards      : bounded pre-existing residue (≤3 of any resource);
//                      pinned so it cannot grow.
//   sponsorblock     : negative listener delta is EXPECTED (persistent lookup
//                      plumbing is shared and survives card disable by design).
"use strict";
const path = require("path");
const { boot } = require(path.join(__dirname, "lib-jsdom-boot.js"));

// pinned upper bounds: [timers, intervals, observers, listenerNet, dom]
// NOTE: dom pins include +1 for <style id="ytb-engine"> singletons: the first
// engine card to run injects the SHARED engine stylesheet into <head> and it
// must outlive that card (all engine cards draw from it). Removing it at card
// teardown would be the bug; it cannot accumulate.
const PINNED = {
  "theater-default":       { timers: 0, intervals: 0, observers: 0, listenerNet: 0, dom: 0 },
  "discover":              { timers: 1, intervals: 0, observers: 1, listenerNet: 14, dom: 1 },
  // aio-* masters are zero-residue since 1.3.0 (aioEnroll now un-enrols the
  // members it enabled when the master goes off). The timers pin keeps 1 of
  // jsdom scheduler jitter headroom; everything else must be exactly zero.
  "aio-shorts-cleanup":    { timers: 1, intervals: 0, observers: 0, listenerNet: 0, dom: 0 },
  "aio-feed-cleanup":      { timers: 1, intervals: 0, observers: 0, listenerNet: 0, dom: 0 },
  "aio-compact-dense":     { timers: 1, intervals: 0, observers: 0, listenerNet: 0, dom: 0 },
  "aio-privacy-shield":    { timers: 1, intervals: 0, observers: 0, listenerNet: 0, dom: 0 },
  "aio-comment-cleanup":   { timers: 1, intervals: 0, observers: 0, listenerNet: 0, dom: 0 },
  "curated-collections":   { timers: 1, intervals: 0, observers: 1, listenerNet: 2, dom: 1 },
  "algo-intelligence":     { timers: 2, intervals: 0, observers: 1, listenerNet: 2, dom: 2 },
  "sponsorblock":          { timers: 2, intervals: 0, observers: 1, listenerNet: 99, dom: 1, allowNegativeListeners: true },
};

(async () => {
  const { g, engine, inst, wait } = await boot({});
  await wait(300);

  const all = process.env.YT_LEAK_ALL === "1";
  const cards = engine.features().filter((c) => c && c.masterKey);
  const targets = all ? cards : cards.filter((c) => PINNED[c.id]);

  const base = () => ({
    timers: inst.timers.size,
    intervals: inst.intervals.size,
    observers: inst.observers.size,
    listenerNet: inst.listenerAdds - inst.listenerRemoves,
    dom: g.document.querySelectorAll("[id^='ytb-'],[class*='ytb-']").length,
  });

  const rows = [];
  const failures = [];
  for (const c of targets) {
    const key = c.masterKey;
    const before = base();
    try { engine.cfg[key] = true; engine.apply(c.id); } catch (_) {}
    await wait(150);
    try { engine.cfg[key] = false; engine.apply(c.id); } catch (_) {}
    await wait(150);
    const fast = base();
    // Drain-tolerant slow pass (pin mode only — deep mode is a diagnostic
    // table where waiting out one-shot drains per card would triple runtime).
    let slow = fast;
    if (!all) {
      await wait(1400);
      slow = base();
    }
    const d = {
      timers: slow.timers - before.timers,
      intervals: slow.intervals - before.intervals,
      observers: slow.observers - before.observers,
      listenerNet: slow.listenerNet - before.listenerNet,
      dom: slow.dom - before.dom,
      fastTimers: fast.timers - before.timers,
    };
    rows.push({ id: c.id, ...d });

    if (!all) {
      const pin = PINNED[c.id];
      for (const res of ["timers", "intervals", "observers", "listenerNet", "dom"]) {
        const delta = d[res];
        if (res === "listenerNet" && pin.allowNegativeListeners && delta < 0) continue;
        if (delta < 0) continue; // removing more than you added is never a leak
        if (delta > pin[res]) {
          failures.push(`${c.id}: leftover ${res} = +${delta} (pinned max +${pin[res]})`);
        }
      }
    }
  }

  console.log("leak-bisect: " + rows.length + " card(s) probed");
  for (const r of rows) {
    console.log(
      `  ${r.id.padEnd(24)} timers+${r.timers} intervals+${r.intervals} observers+${r.observers} listeners+${r.listenerNet} dom+${r.dom}`,
    );
  }
  if (failures.length) {
    console.error("leak-bisect FAIL");
    for (const f of failures) console.error("  - " + f);
    process.exit(1);
  }
  console.log(all ? "leak-bisect deep scan complete (no pins enforced in deep mode)" : "leak-bisect OK");
  process.exit(0);
})().catch((e) => {
  console.error("leak-bisect ERROR:", e && e.message);
  console.error(e && e.stack);
  process.exit(2);
});
