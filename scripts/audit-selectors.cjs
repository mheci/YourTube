#!/usr/bin/env node


// Selector-freshness audit (report-only by default, --strict to fail).
//
// Extracts the YouTube-specific tokens the script relies on (custom element
// names, #ids, .yt* classes) and checks each one against YouTube's live server
// HTML plus the current kevlar JS bundle. Tokens that no longer appear anywhere
// are candidates for bit rot: they are listed with the script line of first use
// so a stale selector can be replaced instead of silently matching nothing.
//
// Needs network access. It never fails unless --strict is passed, because
// YouTube ships changes continuously and a red build on every rollout would be
// noise; run it weekly (see docs/ARCHITECTURE.md) or on demand.
"use strict";
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const strict = process.argv.includes("--strict");
const UA = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",
  "accept-language": "en-US,en;q=0.9",
};
const SELF_DEFINED = /^(ytb-|yourtube-|yourtube)/;
// Player-internal classes (ytp-*) live in the player bundle, which this audit does
// not fetch, so they cannot be verified here and are excluded.
const PLAYER_INTERNAL = /^[.#]?ytp-/;
const TIMEOUT_MS = 25000;

const withTimeout = (p) => Promise.race([
  p,
  new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS)),
]);

const src = fs.readFileSync(path.join(root, "yourtube.user.js"), "utf8").replace(/\r\n/g, "\n");
const lineAt = (idx) => src.slice(0, idx).split("\n").length;

// ids the script assigns to its own elements must not be checked against YouTube
const selfIds = new Set();
for (const m of src.matchAll(/\bid\s*=\s*"([A-Za-z][\w-]+)"/g)) selfIds.add(m[1]);
for (const m of src.matchAll(/\bid="([A-Za-z][\w-]+)"/g)) selfIds.add(m[1]);
for (const m of src.matchAll(/\bid:\s*"([A-Za-z][\w-]+)"/g)) selfIds.add(m[1]);

const isHeaderOrUrl = (line) => /^\s*\/\//.test(line) || /:\/\//.test(line);

const tokens = new Map();
const add = (tok, idx) => {
  if (tokens.has(tok)) return;
  const line = src.split("\n")[lineAt(idx) - 1] || "";
  if (isHeaderOrUrl(line)) return;
  tokens.set(tok, lineAt(idx));
};
for (const m of src.matchAll(/\byt[a-z0-9]*(?:-[a-z0-9]+)+\b/g)) {
  const t = m[0];
  if (SELF_DEFINED.test(t) || PLAYER_INTERNAL.test(t)) continue;
  if (/^yt-(spec|lightsource|live-chat|player|main-app|interaction)/.test(t)) continue; // design tokens / vars
  add(t, m.index);
}
for (const m of src.matchAll(/(?<![\w-])#([a-z][\w-]{3,})\b/g)) {
  const t = m[0];
  if (/#(?:[0-9a-f]{3,8})$/i.test(t)) continue;
  if (/^#ytb-/.test(t) || PLAYER_INTERNAL.test(t)) continue;
  if (selfIds.has(t.slice(1))) continue;
  add(t, m.index);
}
for (const m of src.matchAll(/(?<![\w-])\.((?:ytd|ytm|yt|shorts|ytLockup|ytGrid|ytThumbnail|ytAttributed|ytContent|ytChip|ytTab|ytButton|ytIcon|ytAvatar|ytPageHeader)[A-Za-z0-9_-]+)/g)) {
  if (PLAYER_INTERNAL.test(m[0]) || /^\.ytb-/.test(m[0])) continue;
  add(m[0], m.index);
}

(async () => {
  // Kept separate so each token can be classified as desktop / mobile / both /
  // neither. The mobile surface (m.youtube.com, ytm-* elements) shares almost
  // none of the desktop kevlar DOM, so a token missing from www.youtube.com is
  // NOT automatically dead: the script also runs on mobile.
  let hayDesktop = "";
  let hayMobile = "";
  let cssFailures = 0;
  let mobileFailed = false;
  try {
    const home = await withTimeout(fetch("https://www.youtube.com/", { headers: UA }));
    const html = await home.text();
    hayDesktop += html;
    const bundleUrl = [...html.matchAll(/<script[^>]+src="([^"]+ytmainappweb[^"]+)"/g)].map((m) => m[1]).pop();
    if (bundleUrl) {
      const js = await withTimeout(fetch(bundleUrl.startsWith("http") ? bundleUrl : "https://www.youtube.com" + bundleUrl, { headers: UA }));
      hayDesktop += await js.text();
    }
    // class tokens live in YouTube's stylesheets, not only in the JS bundle
    const cssUrls = [...new Set([...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]))].slice(0, 12);
    for (const href of cssUrls) {
      try {
        const css = await withTimeout(fetch(href.startsWith("http") ? href : "https://www.youtube.com" + href, { headers: UA }));
        hayDesktop += await css.text();
      } catch (_) { cssFailures++; }
    }
  } catch (e) {
    console.log(`audit-selectors: could not reach YouTube desktop (${e && e.message}); skipping.`);
    process.exit(0);
  }
  try {
    const MOBILE_UA = {
      "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      "accept-language": "en-US,en;q=0.9",
    };
    const home = await withTimeout(fetch("https://m.youtube.com/", { headers: MOBILE_UA }));
    const html = await home.text();
    hayMobile += html;
    const bundleUrls = [
      ...new Set([...html.matchAll(/<script[^>]+src="([^"]+\.js[^"]*)"/g)].map((m) => m[1])),
    ].slice(0, 6);
    for (const href of bundleUrls) {
      try {
        const js = await withTimeout(fetch(href.startsWith("http") ? href : "https://m.youtube.com" + href, { headers: MOBILE_UA }));
        hayMobile += await js.text();
      } catch (_) {}
    }
  } catch (e) {
    mobileFailed = true;
  }
  if (cssFailures) {
    console.log(`audit-selectors: ${cssFailures} desktop stylesheet fetch(es) failed; token results may be incomplete.`);
  }
  if (mobileFailed) {
    console.log("audit-selectors: m.youtube.com unreachable; mobile-only tokens will be reported as 'neither' (verify manually before pruning).");
  }

  const rows = [];
  for (const [tok, line] of tokens) {
    const name = tok.replace(/^[.#]/, "");
    const d = hayDesktop.includes(name);
    const m = hayMobile.includes(name);
    rows.push({ tok, line, d, m });
  }
  const absentDesktop = rows.filter((r) => !r.d);
  const neverLive = rows.filter((r) => !r.d && !r.m);
  absentDesktop.sort((a, b) => a.line - b.line);
  neverLive.sort((a, b) => a.line - b.line);

  console.log(
    `audit-selectors: ${tokens.size} YouTube tokens checked; ${absentDesktop.length} absent from desktop, of which ${neverLive.length} absent from BOTH desktop and mobile`,
  );
  if (absentDesktop.length) {
    console.log("\nToken                                desktop  mobile   script line");
    for (const a of absentDesktop) {
      console.log(`  ${a.tok.padEnd(36)} ${(a.d ? "live" : "absent").padEnd(8)} ${(a.m ? "live" : "absent").padEnd(8)} ${a.line}`);
    }
    console.log("\nTokens marked desktop=absent/mobile=live are NOT dead — they drive the mobile");
    console.log("(m.youtube.com) surface and must be kept. Only neither/never-live rows are true");
    console.log("bit-rot candidates. Player-internal (ytp-*) and design-system (.yt-spec-*)");
    console.log("tokens may live in bundles this audit does not fetch: verify before deleting.");
    console.log("Report-only unless --strict is passed.");
  } else {
    console.log("audit-selectors: clean (every token still exists in YouTube's desktop HTML/JS).");
  }
  process.exit(strict && neverLive.length ? 1 : 0);
})();
