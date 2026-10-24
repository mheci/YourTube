#!/usr/bin/env node


// Shared jsdom boot for the runtime-level test suites (privacy gate, leak
// bisect). Boots the REAL built bundle with instrumented GM_* shims so tests
// can exercise actual feature apply/teardown paths. Deliberately duplicating
// the harness-stability boot contract so all suites agree on the environment.
"use strict";
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");

const HTML = `<!DOCTYPE html><html><head></head><body>
  <div id="page-manager"><ytd-app>
    <div id="contents"><ytd-rich-grid-renderer><div id="contents"></div></ytd-rich-grid-renderer></div>
  </ytd-app></div>
  <div id="movie_player"><video class="html5-main-video"></video></div>
</body></html>`;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function instrument(g) {
  const state = {
    timers: new Set(),
    intervals: new Set(),
    observers: new Set(),
    listenerAdds: 0,
    listenerRemoves: 0,
    timerErrors: [],
    netCalls: [], // every script-initiated request (fetch + GM xhr + beacon)
  };
  const wrapTimer = (name, clearName, live, once) => {
    const orig = g[name].bind(g);
    const origClear = g[clearName].bind(g);
    g[name] = (fn, ms, ...rest) => {
      let id = 0;
      const wrapped = (...args) => {
        if (once) live.delete(id);
        try {
          return typeof fn === "function" ? fn(...args) : undefined;
        } catch (e) {
          state.timerErrors.push(String((e && e.message) || e));
        }
      };
      id = orig(wrapped, ms, ...rest);
      live.add(id);
      return id;
    };
    g[clearName] = (id) => {
      live.delete(id);
      return origClear(id);
    };
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
      observe(...args) {
        live.add(this);
        return super.observe(...args);
      }
      disconnect() {
        live.delete(this);
        try {
          return super.disconnect();
        } catch (_) {}
      }
    };
  }
  return state;
}

// opts:
//   preload(mem)      — seed GM storage before boot
//   videoId           — watch-page id (default test1234567)
//   grantNetwork      — GM xhr succeeds with `okResponse` instead of erroring
async function boot(opts) {
  opts = opts || {};
  const videoId = opts.videoId || "test1234567";
  const raw = fs.readFileSync(path.join(root, "yourtube.user.js"), "utf8");
  const body = raw.slice(raw.indexOf("(() => {"));
  if (!body.startsWith("(() => {")) throw new Error("no IIFE found in bundle");

  const dom = new JSDOM(HTML, {
    url: "https://www.youtube.com/watch?v=" + videoId,
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const g = dom.window;
  const mem = new Map();
  if (opts.preload) opts.preload(mem);

  const gctx = { inst: null };
  g.GM_setValue = (k, v) => mem.set(String(k), JSON.parse(JSON.stringify(v)));
  g.GM_getValue = (k, d) =>
    mem.has(String(k)) ? JSON.parse(JSON.stringify(mem.get(String(k)))) : typeof d !== "undefined" ? d : null;
  g.GM_deleteValue = (k) => mem.delete(String(k));
  g.GM_listValues = () => Array.from(mem.keys());
  g.GM_registerMenuCommand = () => {};
  g.GM_addStyle = (css) => {
    const st = g.document.createElement("style");
    st.id = "ytb-test-" + mem.size;
    st.textContent = css;
    g.document.head.appendChild(st);
    return st;
  };
  g.GM_info = { script: { version: "1.3.0-test", name: "YourTube" } };
  g.unsafeWindow = g;
  if (!g.requestIdleCallback) g.requestIdleCallback = (fn) => setTimeout(() => fn({ didTimeout: false }), 0);
  if (!g.cancelIdleCallback) g.cancelIdleCallback = () => {};
  g.requestAnimationFrame = g.requestAnimationFrame || ((cb) => setTimeout(() => cb(g.performance.now()), 16));
  g.cancelAnimationFrame = g.cancelAnimationFrame || ((id) => clearTimeout(id));
  if (!g.IntersectionObserver) g.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  if (!g.ResizeObserver) g.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  if (!g.BroadcastChannel)
    g.BroadcastChannel = class {
      constructor() { this.onmessage = null; }
      postMessage() {}
      close() {}
    };
  g.crypto = require("crypto").webcrypto;

  const inst = instrument(g);

  // Network taps — fetch, GM xhr, sendBeacon all funnel into inst.netCalls.
  g.fetch = (url) => {
    inst.netCalls.push({ via: "fetch", url: String(url) });
    return Promise.reject(new Error("fetch stubbed"));
  };
  g.GM_xmlhttpRequest = (o) => {
    inst.netCalls.push({ via: "GM_xhr", url: String(o && o.url), method: (o && o.method) || "GET" });
    const t = setTimeout(() => {
      try {
        if (opts.grantNetwork && o && o.onload) {
          o.onload({ status: 200, responseText: opts.okResponse || "[]" });
        } else if (o && o.onerror) {
          o.onerror({ error: "no-network" });
        }
      } catch (_) {}
    }, 5);
    return { abort: () => clearTimeout(t) };
  };
  g.navigator.sendBeacon = (url) => {
    inst.netCalls.push({ via: "beacon", url: String(url) });
    return false;
  };

  const errors = [];
  g.addEventListener("error", (e) => errors.push(String((e.error && (e.error.message || e.error)) || e.message)));
  g.addEventListener("unhandledrejection", (e) =>
    errors.push("rejection:" + String((e.reason && (e.reason.message || e.reason)) || e.reason)),
  );
  g.onerror = (m) => errors.push(String(m));

  g.eval(body);
  for (let i = 0; i < 90 && !g.___yourtube_last_apply; i++) await wait(100);

  const engine = g.__YOURTUBE_ENGINE__;
  if (!engine || typeof engine.features !== "function") {
    throw new Error("engine hooks missing after boot");
  }
  return { dom, g, engine, inst, errors, wait, mem };
}

module.exports = { boot, instrument, wait, HTML };
