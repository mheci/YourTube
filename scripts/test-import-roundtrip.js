#!/usr/bin/env node


// Regression test for the settings import path.
// Boots the real bundle in jsdom, invokes the "Import settings from file" menu
// command, feeds it a settings payload, and asserts the imported values land in
// the live config instead of being overwritten by factory defaults.
"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const raw = fs.readFileSync(path.join(root, "yourtube.user.js"), "utf8");
const body = raw.slice(raw.indexOf("(() => {"));
if (!body.startsWith("(() => {")) {
  console.error("no IIFE found");
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
  const menu = new Map();
  g.GM_setValue = (k, v) => mem.set(String(k), v);
  g.GM_getValue = (k, d) => (mem.has(String(k)) ? mem.get(String(k)) : typeof d !== "undefined" ? d : null);
  g.GM_deleteValue = (k) => mem.delete(String(k));
  g.GM_listValues = () => Array.from(mem.keys());
  g.GM_registerMenuCommand = (label, fn) => menu.set(String(label), fn);
  g.GM_xmlhttpRequest = (o) => { const t = setTimeout(() => { try { o && o.onerror && o.onerror({ error: "no-network" }); } catch (_) {} }, 5); return { abort: () => clearTimeout(t) }; };
  g.GM_addStyle = (css) => { const st = g.document.createElement("style"); st.textContent = css; g.document.head.appendChild(st); return st; };
  g.GM_info = { script: { version: "test", name: "YourTube" } };
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

  // capture file inputs the import path creates
  const createdInputs = [];
  const origCreate = g.document.createElement.bind(g.document);
  g.document.createElement = (tag) => {
    const el = origCreate(tag);
    if (String(tag).toLowerCase() === "input") createdInputs.push(el);
    return el;
  };

  const errors = [];
  g.addEventListener("error", (e) => errors.push(String((e.error && (e.error.message || e.error)) || e.message)));
  g.addEventListener("unhandledrejection", (e) => errors.push("rejection:" + String((e.reason && (e.reason.message || e.reason)) || e.reason)));

  g.eval(body);

  for (let i = 0; i < 90 && !g.___yourtube_last_apply; i++) await wait(100);
  assert.ok(g.___yourtube_last_apply, "bundle applied (boot)");
  assert.ok(g.__YOURTUBE_ENGINE__ && g.__YOURTUBE_ENGINE__.cfg, "engine API exposes cfg");

  const cfg = () => g.__YOURTUBE_ENGINE__.cfg;
  const before = cfg().speedDefault;
  assert.notStrictEqual(before, 2.5, "test needs a value different from the imported one");

  const importCmd = menu.get("Import settings from file");
  assert.strictEqual(typeof importCmd, "function", "import menu command registered");

  const fileInput = () => createdInputs.filter((el) => el.type === "file").pop();
  assert.ok(!fileInput(), "no file input exists before the import runs");

  importCmd();
  const input = fileInput();
  assert.ok(input, "import creates a file input");

  const payload = JSON.stringify({ cfg: { speedDefault: 2.5, themeSelected: "none" }, history: [] });
  const file = new g.File([payload], "yourtube-settings.json", { type: "application/json" });
  Object.defineProperty(input, "files", { configurable: true, value: { 0: file, length: 1, item: (i) => (i === 0 ? file : null) } });
  input.dispatchEvent(new g.Event("change"));

  for (let i = 0; i < 60 && cfg().speedDefault !== 2.5; i++) await wait(50);

  assert.strictEqual(cfg().speedDefault, 2.5, "imported value survives (regression: it used to be reset to the default)");

  // the import must also be persisted, not just applied in memory
  for (let i = 0; i < 40 && !String(mem.get("yourtube.cfg") || "").includes('"speedDefault":2.5'); i++) await wait(50);
  assert.ok(String(mem.get("yourtube.cfg") || "").includes('"speedDefault":2.5'),
    "imported value is persisted to storage");

  assert.ok(!errors.length, "no page errors during import: " + errors.slice(0, 5).join(" | "));

  console.log("[test-import] passed: settings import round-trip keeps imported values");
  process.exit(0);
})().catch((e) => {
  console.error("[test-import] FAILED:", e && e.message);
  process.exit(1);
});
