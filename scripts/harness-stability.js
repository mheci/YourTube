#!/usr/bin/env node


// Stability harness: boots the real bundle in jsdom and exercises every card's
// apply/teardown path, a navigation storm and a bfcache restore while counting
// live timers, observers and event listeners. Fails when any of them grow
// between passes, when a card gets quarantined, or when an error escapes.
"use strict";
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const raw = fs.readFileSync(path.join(root, "yourtube.user.js"), "utf8");
const body = raw.slice(raw.indexOf("(() => {"));
if (!body.startsWith("(() => {")) {
  console.error("stability: no IIFE found");
  process.exit(1);
}

const html = `<!DOCTYPE html><html><head></head><body>
  <div id="page-manager"><ytd-app>
    <div id="contents"><ytd-rich-grid-renderer><div id="contents"></div></ytd-rich-grid-renderer></div>
  </ytd-app></div>
  <div id="movie_player"><video class="html5-main-video"></video></div>
</body></html>`;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// The harness drives the whole runtime, so a rejection escaping a feature must
// be recorded rather than crashing the runner.
const escapedRejections = [];
process.on("unhandledRejection", (reason) => {
  const message = String((reason && reason.message) || reason);
  const stack = String((reason && reason.stack) || "").split("\n").slice(1, 4).join(" <- ").replace(/\s+/g, " ").slice(0, 260);
  escapedRejections.push("unhandled:" + message + (stack ? " @ " + stack : ""));
});

function instrument(g) {
  const state = {
    timers: new Set(),
    intervals: new Set(),
    observers: new Set(),
    listenerAdds: 0,
    listenerRemoves: 0,
    timerErrors: [],
  };
  const wrapTimer = (name, clearName, live, once) => {
    const orig = g[name].bind(g);
    const origClear = g[clearName].bind(g);
    g[name] = (fn, ms, ...rest) => {
      let id = 0;
      const wrapped = (...args) => {
        if (once) live.delete(id);
        try { return typeof fn === "function" ? fn(...args) : undefined; } catch (e) { state.timerErrors.push(String((e && e.message) || e)); }
      };
      id = orig(wrapped, ms, ...rest);
      live.add(id);
      return id;
    };
    g[clearName] = (id) => { live.delete(id); return origClear(id); };
  };
  wrapTimer("setTimeout", "clearTimeout", state.timers, true);
  wrapTimer("setInterval", "clearInterval", state.intervals, false);

  const origAdd = g.EventTarget.prototype.addEventListener;
  const origRemove = g.EventTarget.prototype.removeEventListener;
  g.EventTarget.prototype.addEventListener = function (type, fn, opts) {
    state.listenerAdds++;
    return origAdd.call(this, type, fn, opts);
  };
  g.EventTarget.prototype.removeEventListener = function (type, fn, opts) {
    state.listenerRemoves++;
    return origRemove.call(this, type, fn, opts);
  };

  for (const name of ["MutationObserver", "IntersectionObserver", "ResizeObserver"]) {
    const Orig = g[name];
    if (!Orig) continue;
    const live = state.observers;
    g[name] = class extends Orig {
      observe(...args) { live.add(this); return super.observe(...args); }
      disconnect() { live.delete(this); try { return super.disconnect(); } catch (_) {} }
    };
  }
  return state;
}

const CARD_DOM = ".ytb-ui-cardmeta,.ytb-ui-dearrow-chip,.ytb-ui-subs,.ytb-ui-transcript-tools," +
  ".ytb-ui-random,.ytb-ui-shuffle,.ytb-ui-wl-tools,.ytb-ui-tabs-bar,.ytb-ui-subs-note," +
  ".ytb-ui-add-group,.ytb-ui-inline-prompt,.ytb-ui-cred-badge,[data-ytb-seen],[data-ytb-low-view]," +
  "[data-ytb-meta],[data-ytb-ask],[data-ytb-filler],[data-ytb-group-hidden],[data-ytb-hist-hidden]," +
  "[data-ytb-watched],[data-ytb-snoozed],[data-ytb-outdated],[data-ytb-checked],[data-ytb-cred]";

function snapshot(g, inst, engine) {
  const snap = {
    timers: inst.timers.size,
    intervals: inst.intervals.size,
    observers: inst.observers.size,
    listenerNet: inst.listenerAdds - inst.listenerRemoves,
    cardDom: g.document.querySelectorAll(CARD_DOM).length,
    styles: g.document.querySelectorAll('style[id^="ytb-"]').length,
  };
  if (engine && typeof engine.resources === "function") {
    try {
      const rs = engine.resources();
      snap.tickerTasks = rs && rs.sharedTicker ? rs.sharedTicker.tasks : -1;
      snap.observerSubs = rs && rs.sharedObserver ? rs.sharedObserver.subscribers : -1;
      snap.blobs = rs && rs.blobURLs ? rs.blobURLs.active : -1;
      snap.deferred = rs && rs.deferred ? rs.deferred.pending : -1;
    } catch (_) {}
  }
  return snap;
}

(async () => {
  const dom = new JSDOM(html, { url: "https://www.youtube.com/watch?v=test1234567", runScripts: "outside-only", pretendToBeVisual: true });
  const g = dom.window;
  const mem = new Map();
  g.GM_setValue = (k, v) => mem.set(String(k), v);
  g.GM_getValue = (k, d) => (mem.has(String(k)) ? mem.get(String(k)) : typeof d !== "undefined" ? d : null);
  g.GM_deleteValue = (k) => mem.delete(String(k));
  g.GM_listValues = () => Array.from(mem.keys());
  g.GM_registerMenuCommand = () => {};
  g.GM_xmlhttpRequest = (o) => { const t = setTimeout(() => { try { o && o.onerror && o.onerror({ error: "no-network" }); } catch (_) {} }, 5); return { abort: () => clearTimeout(t) }; };
  g.GM_addStyle = (css) => { const st = g.document.createElement("style"); st.textContent = css; g.document.head.appendChild(st); return st; };
  g.GM_info = { script: { version: "stability", name: "YourTube" } };
  g.unsafeWindow = g;
  if (!g.requestIdleCallback) g.requestIdleCallback = (fn) => setTimeout(() => fn({ didTimeout: false }), 0);
  if (!g.cancelIdleCallback) g.cancelIdleCallback = () => {};
  g.requestAnimationFrame = g.requestAnimationFrame || ((cb) => setTimeout(() => cb(g.performance.now()), 16));
  g.cancelAnimationFrame = g.cancelAnimationFrame || ((id) => clearTimeout(id));
  if (!g.IntersectionObserver) g.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  if (!g.ResizeObserver) g.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  if (!g.BroadcastChannel) g.BroadcastChannel = class { constructor() { this.onmessage = null; } postMessage() {} close() {} };
  g.fetch = () => Promise.reject(new Error("fetch stubbed"));
  g.crypto = require("crypto").webcrypto;
  g.navigator.sendBeacon = () => false;

  const errors = [];
  g.addEventListener("error", (e) => errors.push(String((e.error && (e.error.message || e.error)) || e.message)));
  g.addEventListener("unhandledrejection", (e) => errors.push("rejection:" + String((e.reason && (e.reason.message || e.reason)) || e.reason)));
  g.onerror = (m) => errors.push(String(m));

  const inst = instrument(g);
  g.eval(body);
  for (let i = 0; i < 90 && !g.___yourtube_last_apply; i++) await wait(100);

  const engine = g.__YOURTUBE_ENGINE__;
  if (!engine || typeof engine.features !== "function") {
    console.error("stability: engine hooks missing");
    process.exit(1);
  }

  const cards = engine.features();
  const byKey = new Map();
  for (const c of cards) {
    if (!c || !c.masterKey) continue;
    if (!byKey.has(c.masterKey)) byKey.set(c.masterKey, []);
    byKey.get(c.masterKey).push(c.id);
  }
  const originals = new Map();
  for (const key of byKey.keys()) originals.set(key, engine.cfg[key]);

  const togglePass = async () => {
    for (const [key, ids] of byKey) {
      const original = originals.get(key);
      if (typeof original !== "boolean") continue;
      for (const value of [false, true, original]) {
        engine.cfg[key] = value;
        for (const id of ids) engine.apply(id);
      }
    }
    await wait(700);
  };

  await togglePass();
  const pass1 = snapshot(g, inst, engine);
  await togglePass();
  const pass2 = snapshot(g, inst, engine);

  const problems = [];
  const allErrors = errors.concat(escapedRejections);
  if (allErrors.length) problems.push("runtime errors: " + allErrors.slice(0, 5).join(" | "));
  if (inst.timerErrors.length) problems.push("timer callback errors: " + inst.timerErrors.slice(0, 5).join(" | "));
  if (typeof engine.quarantined === "function") {
    const q = engine.quarantined();
    if (q.length) problems.push("quarantined cards: " + q.join(", "));
  }
  if (pass2.timers > pass1.timers + 10) problems.push(`live timers grew between passes: ${pass1.timers} -> ${pass2.timers}`);
  if (pass2.intervals > pass1.intervals + 4) problems.push(`live intervals grew between passes: ${pass1.intervals} -> ${pass2.intervals}`);
  if (pass2.observers > pass1.observers + 4) problems.push(`live observers grew between passes: ${pass1.observers} -> ${pass2.observers}`);
  if (pass2.listenerNet > pass1.listenerNet + 30) problems.push(`listener balance grew between passes: ${pass1.listenerNet} -> ${pass2.listenerNet}`);
  if (pass2.cardDom > pass1.cardDom + 10) problems.push(`card DOM state grew between passes: ${pass1.cardDom} -> ${pass2.cardDom}`);
  if (pass2.styles > pass1.styles + 4) problems.push(`style tags grew between passes: ${pass1.styles} -> ${pass2.styles}`);

  // navigation storm
  for (let i = 0; i < 25; i++) {
    g.document.dispatchEvent(new g.Event("yt-navigate-start"));
    g.document.dispatchEvent(new g.Event("yt-navigate-finish"));
    g.document.dispatchEvent(new g.Event("yt-page-data-updated"));
    await wait(4);
  }
  // Let the one-shot navigation timers drain before counting.
  await wait(5200);
  const afterNav = snapshot(g, inst, engine);
  if (afterNav.timers > pass2.timers + 20) problems.push(`timers grew across navigation: ${pass2.timers} -> ${afterNav.timers}`);
  if (afterNav.observers > pass2.observers + 4) problems.push(`observers grew across navigation: ${pass2.observers} -> ${afterNav.observers}`);
  if (afterNav.listenerNet > pass2.listenerNet + 30) problems.push(`listener balance grew across navigation: ${pass2.listenerNet} -> ${afterNav.listenerNet}`);

  // bfcache restore
  const pageShow = new g.Event("pageshow");
  pageShow.persisted = true;
  try { g.dispatchEvent(pageShow); } catch (_) {}
  await wait(400);
  if (!g.___yourtubeBfcacheReapplied) problems.push("bfcache restore did not re-apply features");
  const afterBfcache = snapshot(g, inst, engine);
  if (afterBfcache.timers > afterNav.timers + 12) problems.push(`timers grew across bfcache restore: ${afterNav.timers} -> ${afterBfcache.timers}`);

  const result = {
    scenario: "stability",
    ok: problems.length === 0,
    cards: cards.length,
    pass1,
    pass2,
    afterNav,
    afterBfcache,
    errors: allErrors.slice(0, 5),
    problems,
  };
  console.log(JSON.stringify(result));
  process.exit(problems.length ? 2 : 0);
})();
