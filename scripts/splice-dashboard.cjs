#!/usr/bin/env node
// Dashboard 2.0 splice: replaces the 1.3.0 shell CSS (the [*.ytb-dash{ ..
// .ytb-hcard{) window, minus the live box-sizing utility block) with the
// compact "control room" shell, and rewires _dashBuild's DOM construction to
// the nav-rail layout. The build stops being a flat 169-card list; cards are
// grouped into per-category pages driven by each card's registry `cat`.
"use strict";
const fs = require("fs");
const path = require("path");
const { NEW_SHELL } = require("./splice-dashboard.js");

const file = path.resolve(__dirname, "../src/75-dashboard.js");
let s = fs.readFileSync(file, "utf8");

// ---------- 1) CSS splice ----------
const cssMark = "const e =\n            '";
const cssStart = s.indexOf(cssMark) + cssMark.length;
const cssEnd = s.indexOf("';\n", cssStart);
let css = s.slice(cssStart, cssEnd);
const ORIGINAL_LEN = css.length;

const preEnd = css.indexOf(".ytb-dash{");
const postStart = css.indexOf(".ytb-hcard{");
const utilStart = css.indexOf(".ytb-dash,.ytb-dash *{font-style");
const utilEnd = css.indexOf("}", css.indexOf("#ytb-chapter-panel,#ytb-chapter-panel *{")) + 1;
if (preEnd < 0 || postStart < 0 || utilStart < 0 || utilEnd < 1) {
  console.error("splice: CSS anchors not found", { preEnd, postStart, utilStart, utilEnd });
  process.exit(1);
}
const shellCSS = NEW_SHELL.replace(/^\n/, "").replace(/\n/g, "\\n");
css = css.slice(0, preEnd) + "\\n" + css.slice(utilStart, utilEnd) + "\\n" + shellCSS + "\\n" + css.slice(postStart);

// ---------- 2) JS splice ----------
const hdra = s.indexOf('        const t = To("div", "ytb-dhdr");');
const bodyb = s.indexOf("document.body.appendChild(wo),");
if (hdra < 0 || bodyb < 0 || bodyb < hdra) {
  console.error("splice: JS anchors not found");
  process.exit(1);
}

const NEW_JS = `        const t = To("div", "ytb-dhdr");
        t.classList.add("ytb-dhandle");
        const r = To("div", "ytb-dtitle");

        const _grip = document.createElement("span");
        _grip.className = "ytb-dgrip";
        _grip.setAttribute("aria-hidden", "true");
        _grip.textContent = "[=]";
        const _name = document.createTextNode("YourTube");
        const _ver = document.createElement("span");
        _ver.className = "ytb-dver";
        _ver.textContent = "v" + n;
        r.appendChild(_grip);
        r.appendChild(_name);
        r.appendChild(_ver);
        const o = To("div", "ytb-dhbtns"),
          i = Oo(
            "⧉",
            () => {
              const e = window.innerWidth,
                t = window.innerHeight,
                a = Math.min(830, e - 16),
                n = Math.min(t - 24, 780);
              (zo({ x: e - a - 16, y: 56, w: a, h: n }),
                jo(e - a - 16, 56, a, n));
            },
            "ytb-close",
          );
        ((i.title = "Dock to top-right"), i.classList.add("ytb-no-drag"));
        const d = Oo("[x]", Ko, "ytb-close");
        ((d.title = "Close (Esc)"),
          d.classList.add("ytb-no-drag"),
          o.appendChild(i),
          o.appendChild(d),
          t.appendChild(r),
          t.appendChild(o));
        const c = document.createElement("input");
        ((c.type = "search"),
          (c.className = "ytb-search ytb-no-drag"),
          (c.placeholder = "filter features / setting keys…"));
        const _main = To("div", "ytb-main"),
          _nav = To("nav", "ytb-nav"),
          l = To("div", "ytb-body");
        (_nav.setAttribute("aria-label", "Feature categories"),
          _main.appendChild(_nav),
          _main.appendChild(l));
        (
          (function () {
            const _CAT_LABEL = {
              bundles: "Bundles",
              playback: "Playback & Player",
              audio: "Audio",
              feed: "Feed & Search",
              comments: "Comments & Chat",
              appearance: "Appearance",
              channels: "Channels & Playlists",
              privacy: "Privacy",
              integrations: "Integrations",
              data: "Data & Notes",
              insights: "Discovery & Insights",
              wellness: "Watch-Time",
              tools: "Tools & Diagnostics",
            };
            const _CAT_ORDER = Object.keys(_CAT_LABEL);
            const _catOf = (card) =>
              card && card.cat && _CAT_LABEL[card.cat] ? card.cat : "tools";
            const _isOn = (card) => {
              try {
                if (typeof card.isOn === "function") return !!card.isOn();
                const v = S[card.masterKey];
                return "string" === typeof v ? (!!v && "off" !== v) : !!v;
              } catch (_) {
                return !1;
              }
            };
            const u = Array.from(va.values()).sort((e, t) =>
              String(e.name || e.id).localeCompare(String(t.name || t.id), void 0, {
                sensitivity: "base",
              }),
            );
            // Per-category pages. A card lives in exactly one page; the "all"
            // nav item simply unhides every page at once, so the "all" view
            // costs zero extra DOM. _pages/cat -> div.ytb-cat-page.
            const _pages = new Map();
            for (const cat of _CAT_ORDER) _pages.set(cat, To("div", "ytb-cat-page"));
            for (const page of _pages.values()) l.appendChild(page);
            const p = To("div", "ytb-core");
            (p.appendChild(
              (function () {
                const a = To("div", "ytb-corecell");
                (a.appendChild(To("span", "ytb-corelbl", "Experience preset")),
                  a.appendChild(
                    Po("privacyPreset", {
                      everyday: "Everyday",
                      stealth: "Stealth (no traffic monitoring)",
                      maximum: "Maximum (no monitoring, no network calls)",
                    }),
                  ));
                return a;
              })(),
            ),
              p.appendChild(
                (function () {
                  const a = To("div", "ytb-corecell");
                  return (
                    a.appendChild(To("span", "ytb-corelbl", "Quiet on-screen messages")),
                    a.appendChild(Bo("silentToasts")),
                    a
                  );
                })(),
              ),
              l.insertBefore(p, l.firstChild));
            // Card DOM: Do() builds the switch card; the dashboard layer adds
            // the category tag, the on/off accent and a click-to-copy badge of
            // the card's master config key — what a power user edits in the
            // keymap/store views.
            const _mkCard = (card) => {
              const el = Do(card);
              el.dataset.cat = _catOf(card);
              if (card.masterKey) {
                const badge = document.createElement("button");
                badge.type = "button";
                badge.className = "ytb-key";
                badge.textContent = card.masterKey;
                badge.title = "click to copy setting key";
                badge.addEventListener("click", (ev) => {
                  ev.stopPropagation();
                  try {
                    navigator.clipboard.writeText(card.masterKey);
                    pe("copied " + card.masterKey, 1200, "info");
                  } catch (_) {
                    try { pe(card.masterKey, 1800, "info"); } catch (__) {}
                  }
                });
                const head = el.querySelector(".ytb-head");
                if (head) head.insertBefore(badge, head.lastChild || null);
              }
              return el;
            };
            const h = Math.min(u.length, 40);
            for (let e = 0; e < h; e++) {
              const card = u[e];
              _pages.get(_catOf(card)).appendChild(_mkCard(card));
            }
            u.length > h &&
              (async () => {
                for (let e = h; e < u.length; e += 12) {
                  if ((await ne(), !wo)) return;
                  for (let a = e; a < Math.min(e + 12, u.length); a++)
                    _pages.get(_catOf(u[a])).appendChild(_mkCard(u[a]));
                }
              })();
            // Category rail with live ON counts.
            let _activeCat = "all";
            try { if (S.dashCat && (S.dashCat === "all" || _CAT_LABEL[S.dashCat])) _activeCat = S.dashCat; } catch (_) {}
            const _navBtns = [];
            const _updateCounts = () => {
              let total = 0;
              for (const cat of _CAT_ORDER) {
                let on = 0;
                _pages.get(cat).querySelectorAll(".ytb-card").forEach((el) => {
                  const card = va.get(el.dataset.feat);
                  const live = card ? _isOn(card) : !1;
                  el.classList.toggle("on", live);
                  if (live) on++;
                });
                total += on;
                const btn = _navBtns.find((x) => x.dataset.cat === cat);
                if (btn)
                  btn.querySelector(".ytb-nav-count").textContent =
                    on + "/" + _pages.get(cat).children.length;
              }
              const allBtn = _navBtns.find((x) => x.dataset.cat === "all");
              if (allBtn) allBtn.querySelector(".ytb-nav-count").textContent = String(total);
            };
            const _applyCat = (cat) => {
              _activeCat = cat;
              for (const [id, page] of _pages)
                page.style.display = cat === "all" || cat === id ? "" : "none";
              for (const btn of _navBtns)
                btn.classList.toggle("active", btn.dataset.cat === cat);
              p.style.display = cat === "all" || cat === "core" ? "" : "none";
              try { Ta("dashCat", cat); } catch (_) {}
              _updateCounts();
            };
            const _mkNavItem = (cat, label) => {
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "ytb-nav-item";
              btn.dataset.cat = cat;
              const lbl = To("span", "ytb-nav-label", label);
              const cnt = To("span", "ytb-nav-count", "0");
              btn.appendChild(lbl);
              btn.appendChild(cnt);
              btn.addEventListener("click", () => _applyCat(cat));
              _navBtns.push(btn);
              _nav.appendChild(btn);
            };
            _mkNavItem("all", "All");
            _mkNavItem("core", "Core");
            _nav.appendChild(To("div", "ytb-nav-sep"));
            for (const cat of _CAT_ORDER)
              if (_pages.get(cat).children.length)
                _mkNavItem(cat, _CAT_LABEL[cat]);
            // pages for core view hold only the core grid (p is shared)
            _applyCat(_activeCat);
            let _syncQueued = !1;
            const _unsubCfg = g.on("cfg.changed", () => {
              if (_syncQueued || !wo) return;
              _syncQueued = !0;
              const sync = () => { _syncQueued = !1; if (wo) _updateCounts(); };
              if (typeof requestAnimationFrame === "function") requestAnimationFrame(sync);
              else setTimeout(sync, 60);
            });
            "function" == typeof _unsubCfg && Co.push(() => { try { _unsubCfg(); } catch (_) {} });
            // Live text filter overrides the active category while searching.
            c.addEventListener(
              "input",
              ee(() => {
                const q = c.value.trim().toLowerCase();
                if (q) {
                  for (const page of _pages.values()) page.style.display = "";
                  p.style.display = "none";
                  l.querySelectorAll(".ytb-card").forEach((el) => {
                    const card = va.get(el.dataset.feat);
                    if (!card) { el.style.display = "none"; return; }
                    const hit =
                      card.name.toLowerCase().includes(q) ||
                      (card.summary || "").toLowerCase().includes(q) ||
                      card.id.includes(q) ||
                      (card.masterKey || "").toLowerCase().includes(q);
                    el.style.display = hit ? "" : "none";
                  });
                } else {
                  l.querySelectorAll(".ytb-card").forEach((el) => (el.style.display = ""));
                  _applyCat(_activeCat);
                }
              }, 80),
            );
            const y = To("div", "ytb-foot");
            (y.appendChild(Oo("Export settings", () => Go())),
              y.appendChild(Oo("Mark this video watched", Ut, "primary")),
              y.appendChild(Oo("Import settings", () => Xo())),
              y.appendChild(
                Oo(
                  "Reset to defaults",
                  () =>
                    (function () {
                      if (
                        "function" == typeof e.confirm &&
                        !e.confirm(
                          "Reset all toggles and values to defaults? Local notes and history are kept.",
                        )
                      )
                        return;
                      const t = Object.assign({}, S);
                      ((S = Object.assign({}, s)), Y(), ue(), xa.applyAll());
                      for (const e of Object.keys(S))
                        t[e] !== S[e] &&
                          g.emit("cfg.changed", { key: e, val: S[e] });
                      pe(
                        "Everything has been reset to default settings.",
                        2e3,
                        "success",
                      );
                    })(),
                  "ytb-danger",
                ),
              ));
            wo.appendChild(t);
            wo.appendChild(c);
            wo.appendChild(_main);
            wo.appendChild(y);
          })(),
          `;

s = s.slice(0, hdra) + NEW_JS + s.slice(bodyb);
// CSS back in
const cssMarkIdx = s.indexOf(cssMark);
const cssStart2 = cssMarkIdx + cssMark.length;
const cssEnd2 = s.indexOf("';\n", cssStart2);
s = s.slice(0, cssStart2) + css + s.slice(cssEnd2);

fs.writeFileSync(file, s);
console.log(`splice: CSS ${ORIGINAL_LEN} -> ${css.length} chars (${ORIGINAL_LEN - css.length} removed)`);
console.log(`splice: JS window [${hdra}, ${bodyb}) rewired`);
console.log("splice: done");
