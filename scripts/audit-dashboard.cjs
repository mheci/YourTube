#!/usr/bin/env node


// Runtime card audit: boots the real bundle in jsdom and inspects the live
// registry instead of slicing the bundle text. The old text-based audit could
// not see the ten cards registered through the Ha() helper (their id is a
// variable) and could not detect duplicate ids or missing apply functions.
"use strict";
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const raw = fs.readFileSync(path.join(root, "yourtube.user.js"), "utf8");
const body = raw.slice(raw.indexOf("(() => {"));
if (!body.startsWith("(() => {")) {
  console.error("audit-dashboard: no IIFE found");
  process.exit(1);
}

const html = `<!DOCTYPE html><html><head></head><body>
  <div id="page-manager"><ytd-app>
    <div id="contents"><ytd-rich-grid-renderer><div id="contents"></div></ytd-rich-grid-renderer></div>
  </ytd-app></div>
  <div id="movie_player"><video class="html5-main-video"></video></div>
</body></html>`;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const dom = new JSDOM(html, {
    url: "https://www.youtube.com/watch?v=test1234567",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const g = dom.window;
  const mem = new Map();
  g.GM_setValue = (k, v) => mem.set(String(k), v);
  g.GM_getValue = (k, d) => (mem.has(String(k)) ? mem.get(String(k)) : typeof d !== "undefined" ? d : null);
  g.GM_deleteValue = (k) => mem.delete(String(k));
  g.GM_listValues = () => Array.from(mem.keys());
  g.GM_registerMenuCommand = () => {};
  g.GM_xmlhttpRequest = (o) => { const t = setTimeout(() => { try { o && o.onerror && o.onerror({ error: "no-network" }); } catch (_) {} }, 5); return { abort: () => clearTimeout(t) }; };
  g.GM_addStyle = (css) => { const st = g.document.createElement("style"); st.textContent = css; g.document.head.appendChild(st); return st; };
  g.GM_info = { script: { version: "audit", name: "YourTube" } };
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

  g.eval(body);
  for (let i = 0; i < 90 && !g.___yourtube_last_apply; i++) await wait(100);

  const engine = g.__YOURTUBE_ENGINE__;
  if (!engine || typeof engine.features !== "function") {
    console.error("audit-dashboard: __YOURTUBE_ENGINE__.features() is not exposed");
    process.exit(1);
  }
  const cards = engine.features();
  const problems = [];
  const seen = new Set();
  let withSettings = 0;
  let hidden = 0;
  for (const c of cards) {
    if (!c || typeof c !== "object") { problems.push("non-object card"); continue; }
    if (!c.id || typeof c.id !== "string") problems.push("card without a string id: " + JSON.stringify(c.id));
    else if (seen.has(c.id)) problems.push("duplicate card id: " + c.id);
    else seen.add(c.id);
    if (!c.name || typeof c.name !== "string") problems.push(`card ${c.id} has no name`);
    if (typeof c.apply !== "function") problems.push(`card ${c.id} has no apply()`);
    if (typeof c.settings === "function") withSettings++;
    if (c.hidden) hidden++;
  }

  console.log(
    `dashboard audit: ${cards.length} registered cards (${withSettings} with settings, ${hidden} hidden)`,
  );
  if (problems.length) {
    for (const p of problems) console.error("dashboard audit: " + p);
    console.error(`dashboard audit FAILED (${problems.length} problem(s))`);
    process.exit(1);
  }
  console.log("dashboard audit passed (no duplicate ids, every card has a name and apply())");
  process.exit(0);
})().catch((e) => {
  console.error("dashboard audit crashed:", e && e.message);
  process.exit(1);
});
