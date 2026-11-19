  //  YourTubeEngine Ecosystem v3.0
  const ytbEscapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>\"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[char]));
  const YourTubeEngine = (() => {
    "use strict";
    const log = YourTubeResources.Logger.namespace("engine");
    const CSS = `
#ytb-bar{display:flex;gap:6px;padding:6px 12px;background:rgba(255,255,255,.03);
  border-bottom:1px solid rgba(255,255,255,.06);flex-wrap:wrap;align-items:center}
#ytb-bar .ytb-ui-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;
  border-radius:99px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
  color:#ccc;font:600 11px system-ui;cursor:pointer;transition:all .12s;white-space:nowrap}
#ytb-bar .ytb-ui-chip:hover{background:rgba(255,61,127,.12);border-color:rgba(255,61,127,.3);color:#fff}
#ytb-bar .ytb-ui-chip.active{background:rgba(255,61,127,.18);border-color:rgba(255,61,127,.4);color:#ff8aa5}
.ytb-ui-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:10px;padding:12px;margin:6px 0;transition:background .15s}
.ytb-ui-card:hover{background:rgba(255,255,255,.07)}
.ytb-ui-row{display:flex;align-items:center;gap:8px}
.ytb-ui-thumb{width:120px;height:68px;border-radius:6px;background:#111 center/cover no-repeat;flex-shrink:0}
.ytb-ui-title{font-size:12.5px;font-weight:600;color:#fff;line-height:1.3;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ytb-ui-meta{font-size:10.5px;color:#888;margin-top:2px}
.ytb-ui-pill{display:inline-block;padding:2px 7px;border-radius:99px;font:600 9.5px system-ui;
  letter-spacing:.03em;text-transform:uppercase}
.ytb-ui-btn{appearance:none;border:1px solid rgba(255,255,255,.12);border-radius:7px;
  padding:5px 11px;background:rgba(255,255,255,.05);color:#dde;cursor:pointer;
  font:600 11px system-ui;transition:all .12s}
.ytb-ui-btn:hover{background:rgba(255,255,255,.1)}
.ytb-ui-btn.primary{background:linear-gradient(135deg,#ff0033,#ff3d7f);border-color:transparent;color:#fff}
.ytb-ui-btn:disabled{opacity:.5;cursor:default}
.ytb-ui-meter{height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden}
.ytb-ui-meter-fill{height:100%;border-radius:2px;transition:width .4s}
#ytb-scene{position:absolute;height:14px;z-index:25;pointer-events:none;
  opacity:0.65;transition:opacity .2s;background:rgba(255,255,255,.04);border-radius:3px}
#ytb-scene:hover{opacity:1}
#ytb-scene .ytb-ui-scene-mark{position:absolute;top:0;bottom:0;width:2px;
  background:rgba(255,255,255,.55);transition:all .15s;pointer-events:auto;cursor:pointer}
#ytb-scene .ytb-ui-scene-mark:hover{background:#ff3d7f;width:4px}
#ytb-dna{position:absolute;left:0;right:0;bottom:100%;height:18px;
  border-radius:3px 3px 0 0;overflow:hidden;pointer-events:none;
  opacity:0.7;transition:opacity .2s;z-index:5}
#ytb-dna:hover{opacity:1}
#ytb-dna canvas{width:100%;height:100%;display:block}
#ytb-budget{position:fixed;bottom:0;left:0;right:0;height:30px;z-index:2147483634;
  background:rgba(14,16,22,.94);border-top:1px solid rgba(255,255,255,.08);
  display:flex;align-items:center;gap:12px;padding:0 16px;font:11px system-ui;color:#ccc;
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
#ytb-budget .ytb-ui-budget-track{flex:1;height:5px;background:rgba(255,255,255,.08);
  border-radius:3px;overflow:hidden}
#ytb-budget .ytb-ui-budget-fill{height:100%;border-radius:3px;transition:width .5s,background .3s}
#ytb-disco{position:fixed;right:12px;top:12px;z-index:2147483642;width:min(360px,calc(100vw - 24px));
  max-height:calc(100vh - 24px);display:flex;flex-direction:column;margin:0;padding:10px;font-size:12px;
  background:rgba(14,16,22,.96);border:1px solid rgba(255,255,255,.12);border-radius:12px;
  box-shadow:0 16px 44px rgba(0,0,0,.55);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);overflow:hidden}
#ytb-disco.collapsed{display:none}
#ytb-disco .ytb-ui-disco-hdr{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
#ytb-disco .ytb-ui-disco-title{font-size:13px;font-weight:700;color:#fff}
#ytb-disco .ytb-ui-disco-close{background:transparent;border:0;color:#888;cursor:pointer;font-size:15px;line-height:1;
  padding:2px 7px;border-radius:6px;flex-shrink:0}
#ytb-disco .ytb-ui-disco-close:hover{color:#fff;background:rgba(255,255,255,.12)}
#ytb-disco .ytb-ui-disco-bodies{overflow-y:auto;min-height:0;flex:1 1 auto;max-height:calc(100vh - 170px);padding-right:2px}
#ytb-disco-reopen{position:fixed;right:12px;top:12px;z-index:2147483642;display:none;align-items:center;gap:6px;
  padding:8px 14px;border-radius:999px;cursor:pointer;background:rgba(255,61,127,.92);border:1px solid rgba(255,255,255,.22);
  color:#fff;font:600 12px system-ui;box-shadow:0 10px 28px rgba(0,0,0,.45)}
#ytb-disco-reopen.show{display:inline-flex}
#ytb-disco .ytb-ui-disco-tabs{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px}
#ytb-disco .ytb-ui-disco-tab{padding:3px 9px;border-radius:999px;background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.08);color:#ccc;font:600 10px system-ui;cursor:pointer;transition:all .12s}
#ytb-disco .ytb-ui-disco-tab:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.16)}
#ytb-disco .ytb-ui-disco-tab.active{background:rgba(255,61,127,.16);border-color:rgba(255,61,127,.35);color:#ff8aa5}
#ytb-disco .ytb-ui-disco-sec{display:none}
#ytb-disco .ytb-ui-disco-sec.active{display:block}
#ytb-disco .ytb-ui-status{font-size:10px;color:#888;margin:6px 0;min-height:12px;word-break:break-word}
#ytb-preview{position:fixed;z-index:2147483640;width:300px;padding:8px;
  background:rgba(14,16,22,.96);border:1px solid rgba(255,255,255,.12);border-radius:10px;
  box-shadow:0 12px 40px rgba(0,0,0,.6);pointer-events:none;font:12px system-ui;color:#eef}
.ytb-ui-cred-badge{display:inline-flex;align-items:center;gap:3px;padding:1px 6px;
  border-radius:5px;font:600 9px system-ui;margin-left:4px;vertical-align:middle}
.ytb-ui-status{font-size:10.5px;color:#aaa;margin-top:4px;min-height:14px}
.ytb-ui-velocity{display:inline-block;padding:1px 6px;border-radius:5px;
  font:600 9.5px system-ui;background:rgba(255,61,127,.14);color:#ff8aa5;margin-left:4px}
#ytb-queue .q-row{display:flex;align-items:center;gap:8px;padding:4px 0;
  border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer}
#ytb-queue .q-row:hover{background:rgba(255,255,255,.05)}
#ytb-queue .q-remove{background:transparent;border:0;color:#888;cursor:pointer;
  font-size:13px;padding:2px 5px}
#ytb-queue .q-remove:hover{color:#ff1a4a}
#ytb-sidebar{font-size:12px;color:#eef;margin-bottom:12px}
#ytb-vibe{margin:8px 16px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
#ytb-vibe input{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
  border-radius:99px;color:#fff;padding:6px 14px;font-size:12.5px;outline:none;min-width:220px}
#ytb-vibe input:focus{border-color:rgba(255,61,127,.5)}
#ytb-vibe .ytb-ui-hint{font-size:10.5px;color:#777}
.ytb-ui-dearrow-chip{display:inline-flex;align-items:center;gap:4px;margin-left:8px;padding:2px 8px;border-radius:99px;
  background:rgba(111,168,220,.14);border:1px solid rgba(111,168,220,.4);color:#8ab4e8;
  font:600 10.5px system-ui;cursor:pointer;vertical-align:middle;transition:all .12s;white-space:nowrap}
.ytb-ui-dearrow-chip:hover{background:rgba(111,168,220,.26)}
.ytb-ui-dearrow-chip.swapped{background:rgba(255,61,127,.16);border-color:rgba(255,61,127,.4);color:#ff8aa5}
.ytb-ui-ryd-bar{display:flex;flex-direction:column;gap:2px;margin:6px 0 2px;max-width:340px;cursor:default}
.ytb-ui-ryd-track{height:4px;border-radius:2px;background:rgba(255,255,255,.1);overflow:hidden;display:flex}
.ytb-ui-ryd-like{background:#3ea6ff;height:100%}
.ytb-ui-ryd-dislike{background:#ff5252;height:100%}
.ytb-ui-ryd-label{font:600 10.5px system-ui;color:#aaa;display:flex;gap:8px;align-items:center;justify-content:space-between}
#ytb-ai{max-width:640px;margin:12px 0}
#ytb-ai .ytb-ui-ai-hdr{display:flex;align-items:center;gap:8px;font:600 11.5px system-ui;color:#fff;margin-bottom:6px}
#ytb-ai button{background:rgba(255,61,127,.14);border:1px solid rgba(255,61,127,.4);color:#ff8aa5;
  font:600 10.5px system-ui;padding:4px 12px;border-radius:99px;cursor:pointer;transition:all .12s}
#ytb-ai button:hover{background:rgba(255,61,127,.26)}
#ytb-ai button:disabled{opacity:.5;cursor:wait}
#ytb-ai .ytb-ui-ai-body{font-size:12px;line-height:1.5;color:#ccc;white-space:pre-wrap;margin-top:6px}
#ytb-ai .ytb-ui-ai-note{font-size:10.5px;color:#777;margin-top:4px}
#ytb-focus-overlay,#ytb-shorts-gate{position:fixed;inset:0;z-index:2147483642;display:flex;
  align-items:center;justify-content:center;background:rgba(8,9,12,.72);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);animation:ytbFocusIn .35s ease}
.ytb-ui-focus-card{max-width:min(420px,calc(100vw - 48px));padding:28px 26px;text-align:center;
  background:rgba(18,20,27,.92);border:1px solid rgba(255,255,255,.1);border-radius:16px;
  box-shadow:0 24px 70px rgba(0,0,0,.55)}
.ytb-ui-focus-card::before{content:"";display:block;width:44px;height:3px;margin:0 auto 18px;
  border-radius:2px;background:linear-gradient(90deg,transparent,#ff3d7f,transparent);
  animation:ytbBreath 2.6s ease-in-out infinite}
.ytb-ui-focus-title{font:700 17px system-ui;color:#fff;margin-bottom:10px}
.ytb-ui-focus-body{font:400 13px/1.6 system-ui;color:#aab;margin:0 0 20px}
.ytb-ui-focus-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
@keyframes ytbFocusIn{from{opacity:0}to{opacity:1}}
@keyframes ytbBreath{0%,100%{opacity:.45;transform:scaleX(.7)}50%{opacity:1;transform:scaleX(1)}}

/* --- Calm popups, overlays and toasts (v1.9.0) ---------------------------
   Provides a separate light palette for optional floating surfaces. Every
   rule is prefixed with body.ytb-calm so it outranks the legacy dark-glass
   sheets no matter when they were injected. Toggle: calmUiOn. */
body.ytb-calm{--ytbc-acc:#b45309;--ytbc-accink:180,83,9;--ytbc-panel:#faf7f0;--ytbc-panel2:#fcf9f3;--ytbc-panel3:#fffdf8;--ytbc-card:#fffdf8;--ytbc-card-hi:#f5f1e8;--ytbc-card-lo:#efece7;--ytbc-line:#e7e5e4;--ytbc-line2:#d6d3d1;--ytbc-ink:#1c1917;--ytbc-ink2:#57534e;--ytbc-ink3:#a8a29e;--ytbc-ok:#4a7d5d;--ytbc-crit:#b91c1c;--ytbc-shadow:0 18px 50px rgba(28,25,23,.18),0 2px 8px rgba(28,25,23,.08);--ytbc-font:"Segoe UI",system-ui,-apple-system,sans-serif}
@keyframes ytbCalmPop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

/* Toasts */
body.ytb-calm .ytb-t-info,body.ytb-calm .ytb-t-success,body.ytb-calm .ytb-t-error{background:var(--ytbc-card);color:var(--ytbc-ink);border:1px solid var(--ytbc-line2);border-radius:10px;box-shadow:var(--ytbc-shadow);backdrop-filter:none;-webkit-backdrop-filter:none;font:12.5px/1.4 var(--ytbc-font);padding:9px 16px 9px 14px}
body.ytb-calm .ytb-t-info{border-left:3px solid var(--ytbc-acc)}
body.ytb-calm .ytb-t-success{border-left:3px solid var(--ytbc-ok)}
body.ytb-calm .ytb-t-error{border-left:3px solid var(--ytbc-crit)}

/* Resume prompt (watch overlay + inline card) */

/* SponsorBlock floating surfaces */
body.ytb-calm #ytb-sb-hud{background:var(--ytbc-card)!important;color:var(--ytbc-ink2)!important;border:1px solid var(--ytbc-line2)!important;border-radius:8px!important;box-shadow:var(--ytbc-shadow)!important;font-family:var(--ytbc-font)!important}
body.ytb-calm #YourTube-sb-hud{position:fixed;left:16px;bottom:48px;z-index:2147483635;display:none;min-width:240px;max-width:360px;background:var(--ytbc-card);color:var(--ytbc-ink);border:1px solid var(--ytbc-line2);border-radius:10px;box-shadow:var(--ytbc-shadow);overflow:hidden;font:12.5px/1.4 var(--ytbc-font)}
body.ytb-calm #YourTube-sb-hud.show{display:block;animation:ytbCalmPop .18s ease-out}
body.ytb-calm #YourTube-sb-hud .hud-header{display:flex;justify-content:space-between;gap:10px;padding:8px 12px;background:var(--ytbc-card-hi);border-bottom:1px solid var(--ytbc-line);font-size:12.5px}
body.ytb-calm #YourTube-sb-hud .hud-header span:last-child{color:var(--ytbc-ink3);font-weight:400}
body.ytb-calm #YourTube-sb-hud .hud-actions{display:flex;gap:6px;padding:8px 10px;align-items:center}
body.ytb-calm #YourTube-sb-hud .hud-btn{appearance:none;border:1px solid var(--ytbc-line2);border-radius:6px;background:var(--ytbc-card);color:var(--ytbc-ink2);padding:4px 10px;font:600 11px var(--ytbc-font);cursor:pointer;line-height:1.3}
body.ytb-calm #YourTube-sb-hud .hud-btn:hover{background:var(--ytbc-card-hi);color:var(--ytbc-ink)}
body.ytb-calm #YourTube-sb-hud .hud-btn.undo-btn{color:var(--ytbc-acc);border-color:rgba(var(--ytbc-accink),.4)}
body.ytb-calm #YourTube-sb-hud .hud-btn.close-btn{margin-left:auto;color:var(--ytbc-ink3);padding:4px 8px}
body.ytb-calm #YourTube-sb-editor{display:none;position:fixed;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;z-index:2147483640;width:min(440px,calc(100vw - 32px));background:var(--ytbc-card);color:var(--ytbc-ink);border:1px solid var(--ytbc-line2);border-radius:12px;box-shadow:var(--ytbc-shadow);padding:16px 18px;font:12.5px/1.45 var(--ytbc-font);max-height:86vh;overflow:auto}
body.ytb-calm #YourTube-sb-editor.show{display:block;animation:ytbCalmPop .18s ease-out}
body.ytb-calm #YourTube-sb-editor>div:first-child{color:var(--ytbc-ink)!important;border-bottom-color:var(--ytbc-line)!important}
body.ytb-calm #YourTube-sb-editor input:not([type=checkbox]),body.ytb-calm #YourTube-sb-editor select,body.ytb-calm #YourTube-sb-editor textarea{background:var(--ytbc-panel3)!important;border:1px solid var(--ytbc-line2)!important;border-radius:6px!important;color:var(--ytbc-ink)!important;padding:5px 9px;font:12px var(--ytbc-font)}
body.ytb-calm #YourTube-sb-editor button{appearance:none;border:1px solid var(--ytbc-line2);border-radius:6px;background:var(--ytbc-card)!important;color:var(--ytbc-ink2)!important;padding:5px 12px;font:600 11px var(--ytbc-font);cursor:pointer}
body.ytb-calm #YourTube-sb-editor button:hover{background:var(--ytbc-card-hi)!important;color:var(--ytbc-ink)!important}
body.ytb-calm .YourTube-sb-countdown{position:fixed;top:60px;left:50%;transform:translateX(-50%);z-index:2147483639;display:flex;align-items:center;gap:12px;background:var(--ytbc-card);color:var(--ytbc-ink);border:1px solid var(--ytbc-line2);border-radius:10px;padding:8px 14px;box-shadow:var(--ytbc-shadow);font:12.5px var(--ytbc-font)}
body.ytb-calm .YourTube-sb-countdown button{appearance:none;border:1px solid var(--ytbc-line2);border-radius:6px;background:var(--ytbc-card-hi);color:var(--ytbc-ink);padding:4px 12px;font:600 11px var(--ytbc-font);cursor:pointer}

/* Gates and modal cards (focus, wind-down, shorts gate, breather accents) */
body.ytb-calm .ytb-ui-focus-card{background:var(--ytbc-card);border:1px solid var(--ytbc-line2);border-radius:12px;box-shadow:var(--ytbc-shadow)}
body.ytb-calm .ytb-ui-focus-card::before{background:var(--ytbc-acc);animation:none;opacity:.85;transform:none}
body.ytb-calm .ytb-ui-focus-title{color:var(--ytbc-ink)}
body.ytb-calm .ytb-ui-focus-body{color:var(--ytbc-ink2)}
body.ytb-calm #ytb-breather>div{border-color:rgba(var(--ytbc-accink),.75)!important}
body.ytb-calm #ytb-breather>div+div{color:var(--ytbc-ink2)!important}

/* Shared buttons */
body.ytb-calm .ytb-ui-btn{background:var(--ytbc-card);border:1px solid var(--ytbc-line2);color:var(--ytbc-ink);border-radius:6px}
body.ytb-calm .ytb-ui-btn:hover{background:var(--ytbc-card-hi)}
body.ytb-calm .ytb-ui-btn.primary{background:var(--ytbc-ink);border-color:transparent;color:var(--ytbc-panel)}
body.ytb-calm .ytb-ui-btn.primary:hover{background:var(--ytbc-ink2)}

/* Floating panels: discover feed, its reopen pill, card preview, stats, diag */
body.ytb-calm #ytb-disco{background:var(--ytbc-card);border-color:var(--ytbc-line2);box-shadow:var(--ytbc-shadow);backdrop-filter:none;-webkit-backdrop-filter:none;color:var(--ytbc-ink2)}
body.ytb-calm #ytb-disco .ytb-ui-disco-title{color:var(--ytbc-ink)}
body.ytb-calm #ytb-disco .ytb-ui-disco-close{color:var(--ytbc-ink3)}
body.ytb-calm #ytb-disco .ytb-ui-disco-close:hover{color:var(--ytbc-ink);background:var(--ytbc-card-hi)}
body.ytb-calm #ytb-disco .ytb-ui-disco-tab{background:var(--ytbc-card-hi);border-color:var(--ytbc-line);color:var(--ytbc-ink2)}
body.ytb-calm #ytb-disco .ytb-ui-disco-tab:hover{border-color:var(--ytbc-line2);background:var(--ytbc-card-lo)}
body.ytb-calm #ytb-disco .ytb-ui-disco-tab.active{background:rgba(var(--ytbc-accink),.1);border-color:rgba(var(--ytbc-accink),.4);color:var(--ytbc-acc)}
body.ytb-calm #ytb-disco .ytb-ui-status{color:var(--ytbc-ink3)}
body.ytb-calm #ytb-disco-reopen{background:var(--ytbc-card);border-color:rgba(var(--ytbc-accink),.45);color:var(--ytbc-acc);box-shadow:var(--ytbc-shadow)}
body.ytb-calm #ytb-preview{background:var(--ytbc-card);border-color:var(--ytbc-line2);box-shadow:var(--ytbc-shadow);color:var(--ytbc-ink)}
body.ytb-calm #ytb-stats{background:var(--ytbc-card);color:var(--ytbc-ink2);border:1px solid var(--ytbc-line2);box-shadow:var(--ytbc-shadow);backdrop-filter:none;-webkit-backdrop-filter:none}
body.ytb-calm #ytb-diag{background:var(--ytbc-card);color:var(--ytbc-ink2);border:1px solid var(--ytbc-line2);box-shadow:var(--ytbc-shadow);backdrop-filter:none;-webkit-backdrop-filter:none}

/* Inline-styled floating panels pinned by features */
body.ytb-calm #ytb-intent{background:var(--ytbc-card)!important;border-color:var(--ytbc-line2)!important;color:var(--ytbc-ink)!important;box-shadow:var(--ytbc-shadow)!important}
body.ytb-calm #ytb-intent input{background:var(--ytbc-panel3)!important;border-color:var(--ytbc-line2)!important;color:var(--ytbc-ink)!important}
body.ytb-calm #ytb-reader>div{background:var(--ytbc-card)!important;color:var(--ytbc-ink)!important;border-color:var(--ytbc-line2)!important}
`;

    let cssInjected = false;
    const injectCSS = () => {
      // The latch alone can wedge styling if the style element is ever removed
      // by the page or another teardown; re-inject when it is gone.
      if (cssInjected && document.getElementById("ytb-engine")) return;
      cssInjected = true;
      try {
        YourTubeResources.Dom.css(CSS, "engine");
      } catch (_) {}
    };
    const ytbStores = [];
    const storeCache = new Map();
    const createStore = (key, initial) => {
      // One store per key: re-applies and the settings pane must share state,
      // and leaked instances used to overwrite each other on unload.
      const cached = storeCache.get(key);
      if (cached) return cached;
      const store = new YourTubeResources.StateStore(key, initial, {
        storage: {
          get: async (storeKey) => {
            const row = await v("kv", storeKey);
            return row && row.v !== undefined ? row.v : undefined;
          },
          set: async (storeKey, value) => {
            return k("kv", { k: storeKey, v: value, updatedAt: Date.now() });
          },
        },
      });
      store.load().catch(() => {});
      const api = {
        get: () => store.get(),
        set: (value) => store.set(value),
        update: (fn) => store.update(fn),
        load: () => store.load(),
        flush: () => store.flush(),
        onChange: (fn) => store.onChange(fn),
        offChange: (fn) => store.offChange(fn),
      };
      storeCache.set(key, api);
      ytbStores.push(api);
      return api;
    };
    const flushStores = () => {
      for (const s of ytbStores) {
        try { s.flush(); } catch (_) {}
      }
    };
    const inflight = new Map();
    const dedup = async (key, fn) => {
      if (inflight.has(key)) return inflight.get(key);
      const promise = fn().finally(() => inflight.delete(key));
      inflight.set(key, promise);
      return promise;
    };

    const innerTube = (endpoint, body, opts) => Ot(endpoint, body, Object.assign({ parseJson: true, timeout: 8000 }, opts || {}));
    const fetchJson = (url, opts) => {
      // Central gate: the "Maximum privacy" preset promises no script-initiated
      // third-party network calls. he() (SponsorBlock) already enforces this;
      // RYD, DeArrow and any other fetchJson consumer now share the contract.
      try {
        if (S && S.safeMode) return Promise.resolve({ ok: false, status: 0, json: null, text: "", blocked: "SAFE_MODE_BLOCKED" });
      } catch (_) {}
      const o = Object.assign({ timeout: 9000, headers: {}, method: "GET" }, opts || {});
      const gmx = (typeof GM_xmlhttpRequest === "function") ? GM_xmlhttpRequest
        : (typeof window !== "undefined" && typeof window.GM_xmlhttpRequest === "function") ? window.GM_xmlhttpRequest : null;
      if (gmx) {
        return new Promise((resolve) => {
          try {
            gmx({
              method: o.method,
              url,
              headers: o.headers,
              data: o.body || undefined,
              timeout: o.timeout,
              onload: (r) => {
                try {
                  let j = null;
                  try { j = JSON.parse(r.responseText); } catch (_) {}
                  resolve({ ok: r.status >= 200 && r.status < 300, status: r.status, json: j, text: r.responseText || "" });
                } catch (_) { resolve({ ok: false, status: 0, json: null, text: "" }); }
              },
              onerror: () => resolve({ ok: false, status: 0, json: null, text: "" }),
              ontimeout: () => resolve({ ok: false, status: 0, json: null, text: "" }),
            });
          } catch (_) { resolve({ ok: false, status: 0, json: null, text: "" }); }
        });
      }
      // AbortSignal.timeout keeps a hung connection from stalling callers that
      // rely on fetchJson's timeout contract; engines without it simply skip.
      const signal = (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function")
        ? (() => { try { return AbortSignal.timeout(o.timeout); } catch (_) { return undefined; } })()
        : undefined;
      return fetch(url, { method: o.method, headers: o.headers, body: o.body || undefined, signal })
        .then(async (r) => {
          const text = await r.text().catch(() => "");
          let j = null;
          try { j = JSON.parse(text); } catch (_) {}
          return { ok: r.ok, status: r.status, json: j, text };
        })
        .catch(() => ({ ok: false, status: 0, json: null, text: "" }));
    };

    const scheduleOnReady = (ctx, fn, opts = {}) => {
      const attempts = Math.max(1, Number(opts.attempts) || 5);
      const delayMs = Math.max(50, Number(opts.delayMs) || 400);
      const attempt = (left, ms) => {
        const run = () => {
          let ok = false;
          try { ok = !!fn(); } catch (_) {}
          if (!ok && left > 1) attempt(left - 1, delayMs);
        };
        if (ctx && typeof ctx.addTimeout === "function") ctx.addTimeout(run, ms);
        else setTimeout(run, ms);
      };
      attempt(attempts, 0);
      ctx.onNav(() => attempt(attempts, delayMs));
    };
    return { injectCSS, createStore, flushStores, dedup, innerTube, fetchJson, scheduleOnReady, log, CSS };
  })();

  const YourTubeDiscovery = (() => {

    const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;
    const isValidVideoId = (id) => typeof id === "string" && VIDEO_ID_RE.test(id);
    const createVideoRow = (videoId, title, channel, onClick, metaText, compact) => {
      const safeId = isValidVideoId(videoId) ? videoId : null;
      const row = document.createElement("div");
      row.className = "ytb-ui-row";
      row.style.cssText = "padding:" + (compact ? "2px 0" : "4px 0") + ";cursor:pointer";
      const thumb = document.createElement("div");
      thumb.className = "ytb-ui-thumb";
      thumb.style.cssText = compact ? "width:52px;height:30px" : "width:80px;height:45px";
      if (safeId) thumb.style.backgroundImage = "url('" + sanitizeUrlForCSS(ie.thumb(safeId, "mqdefault")) + "')";
      const copy = document.createElement("div");
      copy.style.cssText = "flex:1;min-width:0";
      const titleNode = document.createElement("div");
      titleNode.className = "ytb-ui-title";
      titleNode.style.webkitLineClamp = "1";
      if (compact) titleNode.style.fontSize = "11.5px";
      titleNode.textContent = String(title || videoId || "");
      const channelNode = document.createElement("div");
      channelNode.className = "ytb-ui-meta";
      if (compact) channelNode.style.fontSize = "9.5px";
      channelNode.textContent = String(channel || "") + (metaText ? "  ·  " + String(metaText) : "");
      copy.append(titleNode, channelNode);
      row.append(thumb, copy);

      if (onClick && safeId) row.addEventListener("click", onClick);
      return row;
    };
    const scoreVideo = (video, criteria) => {
      let score = 50;
      if (criteria.smallCreator && video.subscriberCount && video.subscriberCount < (criteria.maxSubs || 10000)) score += 30;
      if (criteria.momentum && video.viewCount && video.publishedAt) {
        const velocity = video.viewCount / ((Date.now() - video.publishedAt) / 3600000);
        if (velocity > 100) score += 25;
      }
      return Math.min(99, Math.max(1, score));
    };
    const setStatus = (panel, text) => {

      const el = panel && panel.querySelector(".ytb-ui-status");
      if (el) el.textContent = String(text || "");
    };

    let sharedHost = null;
    const createDiscoveryHostCore = (ctx) => {
      const root = document.createElement("div");
      root.id = "ytb-disco";
      root.className = "ytb-ui-card ytb-ui-disco";
      const header = document.createElement("div");
      header.className = "ytb-ui-disco-hdr";
      const title = document.createElement("span");
      title.className = "ytb-ui-disco-title";
      title.textContent = "Discover";
      header.appendChild(title);
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "ytb-ui-disco-close";
      closeBtn.textContent = "×";
      header.appendChild(closeBtn);
      const tabs = document.createElement("div");
      tabs.className = "ytb-ui-disco-tabs";
      const bodies = document.createElement("div");
      bodies.className = "ytb-ui-disco-bodies";
      root.append(header, tabs, bodies);
      const reopen = () => {
        const rp = document.getElementById("ytb-disco-reopen");
        if (!rp) return;
        rp.classList.remove("show");
        root.classList.remove("collapsed");
      };
      closeBtn.addEventListener("click", () => {
        root.classList.add("collapsed");
        let rp = document.getElementById("ytb-disco-reopen");
        if (!rp) {
          rp = document.createElement("button");
          rp.id = "ytb-disco-reopen";
          rp.type = "button";
          rp.textContent = "Discover";
          rp.addEventListener("click", () => { rp.classList.remove("show"); root.classList.remove("collapsed"); });
          (document.body || document.documentElement).appendChild(rp);
        }
        rp.classList.add("show");
      });
      const sections = new Map();
      let activeId = null;
      let mountScheduled = false;
      const mount = () => {
        if (root.parentNode) return true;
        if (location.pathname.startsWith("/watch")) {
          const secondary = document.querySelector("#secondary");
          if (secondary) { secondary.prepend(root); return true; }
          return false;
        }
        const target = document.querySelector("ytd-rich-grid-renderer #contents") ||
                       document.querySelector("#contents.ytd-rich-grid-renderer") ||
                       document.querySelector("ytd-section-list-renderer");
        if (target) { target.parentNode.insertBefore(root, target); return true; }
        return false;
      };
      const ensureMount = () => {
        if (mountScheduled) return;
        mountScheduled = true;
        YourTubeEngine.scheduleOnReady(ctx, mount, { attempts: 8, delayMs: 400 });
      };
      // SPA re-renders can detach the panel; re-arm the mount on navigation.
      ctx.onNav(() => {
        if (root.parentNode) return;
        mountScheduled = false;
        ensureMount();
      });
      const activate = (id, force) => {
        if (!sections.has(id)) return;
        activeId = id;
        tabs.querySelectorAll(".ytb-ui-disco-tab").forEach((b) =>
          b.classList.toggle("active", b.dataset.tab === id),
        );
        bodies.querySelectorAll(".ytb-ui-disco-sec").forEach((b) =>
          b.classList.toggle("active", b.dataset.tab === id),
        );
        const sec = sections.get(id);
        if (sec && sec.load && (!sec.loaded || force)) { sec.loaded = true; sec.load(sec.api); }
      };
      const removeSection = (id) => {
        const sec = sections.get(id);
        if (!sec) return;
        sections.delete(id);
        if (sec.btn.parentNode) sec.btn.remove();
        if (sec.body.parentNode) sec.body.remove();
        if (!sections.size) {
          if (root.parentNode) root.remove();
          const rp = document.getElementById("ytb-disco-reopen");
          if (rp && rp.parentNode) rp.remove();
          mountScheduled = false;
          return;
        }
        if (activeId === id) activate([...sections.keys()][0], true);
      };
      const addSection = (id, label, load) => {
        if (sections.has(id)) return sections.get(id).api;
        const api = {};
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ytb-ui-disco-tab";
        btn.dataset.tab = id;
        btn.textContent = label;
        btn.addEventListener("click", () => activate(id, true));
        const body = document.createElement("div");
        body.className = "ytb-ui-disco-sec";
        body.dataset.tab = id;
        const status = document.createElement("div");
        status.className = "ytb-ui-status";
        const toolbar = document.createElement("div");
        toolbar.style.cssText = "display:flex;gap:4px;flex-wrap:wrap;margin-top:6px";
        const list = document.createElement("div");
        list.style.cssText = "display:flex;flex-direction:column;gap:2px";
        body.append(status, toolbar, list);
        tabs.appendChild(btn);
        bodies.appendChild(body);
        const sec = { id, btn, body, status, toolbar, list, loaded: false, load, api };
        sections.set(id, sec);
        api.status = (text) => { status.textContent = String(text || ""); };
        api.clear = () => { list.replaceChildren(); };
        api.button = (text, cls, onClick) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "ytb-ui-btn" + (cls ? " " + cls : "");
          b.style.cssText = "font-size:10px;padding:4px 10px";
          b.textContent = text;
          b.addEventListener("click", onClick);
          toolbar.appendChild(b);
          return b;
        };
        api.row = (video) => {
          const row = createVideoRow(video.videoId, video.title, video.channel, () => {
            e.location.href = "/watch?v=" + video.videoId;
          }, null, true);
          list.appendChild(row);
          return row;
        };
        api.badge = (text) => {
          const chip = document.createElement("span");
          chip.className = "ytb-ui-velocity";
          chip.textContent = String(text || "");
          return chip;
        };
        api.refresh = (force) => { activate(id, !!force); };
        api.destroy = () => removeSection(id);
        api.list = list;
        api.body = body;
        if (!activeId) activate(id);
        ensureMount();
        return api;
      };
      return {
        root,
        addSection,
        removeSection,
        refresh: (id) => {
          const sec = sections.get(id);
          if (!sec) return;
          sec.loaded = false;
          if (activeId === id) activate(id, true);
        },
      };
    };
    let sharedHostCtx = null;
    const discoveryHost = (ctx) => {
      // Rebuild when the card is re-enabled with a fresh lifecycle, so the
      // host never schedules work through a disposed context.
      if (!sharedHost || sharedHostCtx !== ctx) {
        sharedHost = createDiscoveryHostCore(ctx);
        sharedHostCtx = ctx;
      }
      return sharedHost;
    };
    return { createVideoRow, scoreVideo, setStatus, discoveryHost };
  })();

  const YourTubePlayback = (() => {
    let audioCtx = null;
    const perVideo = new WeakMap();
    const getAudioCtx = () => {
      if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
      }
      return audioCtx;
    };
    const entryFor = (video) => (video ? perVideo.get(video) || null : null);
    const analyserFor = (video) => {
      if (!video) return null;
      const existing = perVideo.get(video);
      if (existing) return existing;
      const ctx = getAudioCtx();
      if (!ctx) return null;
      let createdSource = null;
      try {
        // If the volume boost already routed this element, join its chain
        // instead of asking createMediaElementSource for the same element twice.
        const boostEntry = _ytAudioGraphs.get(video);
        if (boostEntry && boostEntry.ctx && boostEntry.comp && boostEntry.source) {
          const analyser = boostEntry.ctx.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.75;
          try { boostEntry.comp.disconnect(); } catch (_) {}
          boostEntry.comp.connect(analyser);
          analyser.connect(boostEntry.ctx.destination);
          try { if (boostEntry.ctx.state === "suspended") boostEntry.ctx.resume(); } catch (_) {}
          const joined = { ctx: boostEntry.ctx, source: boostEntry.source, analyser, stream: null, rerouted: true, boostComp: boostEntry.comp, buf: new Uint8Array(analyser.frequencyBinCount), resumeHandler: null };
          perVideo.set(video, joined);
          return joined;
        }
        let source = null;
        let stream = null;
        let rerouted = false;

        if (typeof video.captureStream === "function") {
          const s = video.captureStream();
          if (s && s.getAudioTracks && s.getAudioTracks().length) {
            stream = s;
            source = ctx.createMediaStreamSource(s);
          }
        }

        if (!source && typeof ctx.createMediaElementSource === "function") {
          source = ctx.createMediaElementSource(video);
          createdSource = source;
          rerouted = true;
        }
        if (!source) return null;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.75;
        source.connect(analyser);
        if (rerouted) {

          analyser.connect(ctx.destination);
        }

        try { if (ctx.state === "suspended") ctx.resume(); } catch (_) {}

        const entry = { ctx, source, analyser, stream, rerouted, buf: new Uint8Array(analyser.frequencyBinCount), resumeHandler: null };
        perVideo.set(video, entry);
        if (typeof video.addEventListener === "function") {
          try {

            entry.resumeHandler = () => {
              if (ctx.state === "suspended") { try { ctx.resume(); } catch (_) {} }
            };
            video.addEventListener("play", entry.resumeHandler, { passive: true });
          } catch (_) {}
        }
        return entry;
      } catch (_) {
        // If the element was already routed into this context, remember the
        // failure so later calls stop retrying (the route cannot be undone).
        if (createdSource) {
          try {
            perVideo.set(video, { ctx, source: createdSource, analyser: null, stream: null, rerouted: true, dead: true, buf: new Uint8Array(0), resumeHandler: null });
          } catch (_) {}
        }
        return null;
      }
    };
    const readEnergy = (video) => {
      const entry = analyserFor(video);
      if (!entry || !entry.analyser) return { energy: 0, speech: 0, isQuiet: true, isSpeech: false, active: false };
      const buf = entry.buf;
      entry.analyser.getByteFrequencyData(buf);
      let sum = 0, speechBand = 0;
      for (let i = 0; i < buf.length; i++) { sum += buf[i]; if (i > 10 && i < 80) speechBand += buf[i]; }
      const avg = sum / buf.length;

      const speech = speechBand / Math.max(1, Math.min(69, buf.length - 11));
      return {
        energy: avg,
        speech,
        isQuiet: avg < 5,
        isSpeech: speech > 20 && avg > 10,
        active: !!(entry.ctx && entry.ctx.state === "running" && video && !video.paused && !video.ended && !video.muted && video.volume > 0 && !document.hidden),
      };
    };
    const release = (video) => {
      const entry = perVideo.get(video);
      if (!entry) return;
      if (entry.dead) { perVideo.delete(video); return; }
      if (typeof video.removeEventListener === "function" && entry.resumeHandler) {
        try { video.removeEventListener("play", entry.resumeHandler); } catch (_) {}
        entry.resumeHandler = null;
      }
      if (entry.rerouted) {
        if (entry.boostComp) {
          // The analyser was spliced into the boost chain; hand the output back
          // to the boost graph on the way out.
          try { entry.analyser.disconnect(); } catch (_) {}
          try { entry.boostComp.connect(entry.ctx.destination); } catch (_) {}
        } else {

          try { entry.source.disconnect(); } catch (_) {}
          try { entry.source.connect(entry.ctx.destination); } catch (_) {}
          try { entry.analyser.disconnect(); } catch (_) {}
        }
        // Drop the entry too: a cached analyser that is already disconnected
        // would make readEnergy report silence after a re-enable.
        perVideo.delete(video);
        return;
      }
      try { entry.source.disconnect(); } catch (_) {}

      if (entry.stream) {
        try { entry.stream.getTracks().forEach((t) => { try { t.stop(); } catch (_) {} }); } catch (_) {}
      }
      perVideo.delete(video);
    };
    return {
      readEnergy,
      getAudioCtx,
      release,
      entryFor,
      stats: () => ({ videos: perVideo.size, ctxActive: !!(audioCtx && audioCtx.state === "running") }),
    };
  })();

  const YourTubeSearch = (() => {
    const analyzeCredibility = (card) => {
      const meta = card.querySelector("#metadata-line");
      if (!meta) return null;
      const text = meta.textContent || "";
      const count = _ytCardMeta.views(text);
      const days = _ytCardMeta.ageDays(text);
      const reach = count < 0 ? "unknown" : count > 1e6 ? "high" : count > 1e4 ? "growing" : "emerging";
      const age = days < 0 ? null : days;
      return { reach, age };
    };
    const parseCount = (text) => {
      if (!text) return 0;
      const match = String(text).match(/([\d,.]+)\s*([KMB])?/i);
      if (!match) return 0;
      const value = parseFloat(match[1].replace(/,/g, "")) || 0;
      const unit = match[2] ? match[2].toUpperCase() : "";
      return unit === "K" ? value * 1e3 : unit === "M" ? value * 1e6 : unit === "B" ? value * 1e9 : value;
    };
    const parseAgoMs = (text) => {
      if (!text) return 0;
      const match = String(text).match(/([\d.]+)\s*(year|month|week|day|hour|minute)s?\s*ago/i);
      if (!match) return 0;
      const value = parseFloat(match[1]) || 0;
      const unit = match[2].toLowerCase();
      const factors = { year: 365 * 864e5, month: 30 * 864e5, week: 7 * 864e5, day: 864e5, hour: 36e5, minute: 6e4 };
      return Date.now() - value * (factors[unit] || 0);
    };
    const parseDurationSec = (text) => {
      if (!text) return 0;
      const parts = String(text).split(":").map(Number).filter((n) => Number.isFinite(n));
      if (!parts.length) return 0;
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      if (parts.length === 2) return parts[0] * 60 + parts[1];
      return parts[0];
    };
    const parseSearchVideos = (json) => {
      const videos = [];
      try {
        const sections = json.contents &&
          json.contents.twoColumnSearchResultsRenderer &&
          json.contents.twoColumnSearchResultsRenderer.primaryContents &&
          json.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer &&
          json.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents;
        for (const section of sections || []) {
          const items = section.itemSectionRenderer && section.itemSectionRenderer.contents;
          for (const item of items || []) {
            const renderer = item.videoRenderer;
            if (!renderer || !renderer.videoId) continue;

            if (!/^[A-Za-z0-9_-]{11}$/.test(String(renderer.videoId))) continue;
            const textOf = (node) => node && (node.simpleText || (node.runs || []).map((run) => run.text).join(""));
            videos.push({
              videoId: renderer.videoId,
              title: textOf(renderer.title) || renderer.videoId,
              channel: textOf(renderer.ownerText) || "",
              publishedAt: parseAgoMs(textOf(renderer.publishedTimeText)),
              viewCount: parseCount(textOf(renderer.viewCountText)),
              durationSec: parseDurationSec(textOf(renderer.lengthText)),
            });
          }
        }
      } catch (_) {}
      return videos;
    };
    const search = async (query, sp) => {

      let params = String(sp == null ? "" : sp);
      if (sp) {
        try { params = decodeURIComponent(params); } catch (_) {  }
      }
      const p = sp ? { params } : {};
      const response = await YourTubeEngine.innerTube("search", Object.assign({ context: Mt(), query }, p));
      if (!response || !response.ok || !response.json) return [];
      return parseSearchVideos(response.json);
    };
    return { analyzeCredibility, parseSearchVideos, parseCount, parseAgoMs, parseDurationSec, search };
  })();

  const YourTubeSession = (() => {
    const genomeStore = YourTubeEngine.createStore("__yourtube_genome__", { topics: {}, lengths: {}, channels: {}, handles: {}, channelNames: {}, smallChannels: {}, sessions: 0 });
    const collectionsStore = YourTubeEngine.createStore("__yourtube_collections__", []);
    const budgetStore = YourTubeEngine.createStore("__yourtube_budget__", { usedSec: 0, budgetMin: 60, date: "" });

    // Keep the genome bounded: scoring only reads the top entries, and an
    // unbounded map would be re-serialized on every store write.
    const pruneCountMap = (map, cap) => {
      const keys = Object.keys(map);
      if (keys.length <= cap) return;
      keys.sort((a, b) => map[b] - map[a]).slice(cap).forEach((k) => { delete map[k]; });
    };
    const pruneGenome = (d) => {
      pruneCountMap(d.topics, 500);
      pruneCountMap(d.channels, 300);
      const handles = Object.keys(d.handles || {});
      if (handles.length > 300) handles.slice(300).forEach((k) => { delete d.handles[k]; if (d.channelNames) delete d.channelNames[k]; });
    };
    const genome = {
      record(meta) {
        if (!meta) return;
        genomeStore.update(d => {
          d.sessions = (d.sessions || 0) + 1;
          if (meta.topic) { const words = String(meta.topic).toLowerCase().split(/\s+/).filter(w => w.length > 3); words.slice(0, 5).forEach(w => { d.topics[w] = (d.topics[w] || 0) + 1; }); }
          if (meta.duration) { const b = meta.duration < 300 ? "short" : meta.duration < 1200 ? "medium" : "long"; d.lengths[b] = (d.lengths[b] || 0) + 1; }
          const identity = meta.channelId || meta.handle;
          if (identity) d.channels[identity] = (d.channels[identity] || 0) + 1;
          if (meta.handle && !d.handles[meta.handle]) d.handles[meta.handle] = meta.channelId || "";
          if (meta.handle && meta.channelName && !d.channelNames[meta.handle]) d.channelNames[meta.handle] = meta.channelName;
          pruneGenome(d);
        });
      },
      getTopTopics(n) { return Object.entries(genomeStore.get().topics || {}).sort((a, b) => b[1] - a[1]).slice(0, n || 5).map(e => e[0]); },
      getLengthPref() { const l = genomeStore.get().lengths || {}; const t = (l.short || 0) + (l.medium || 0) + (l.long || 0); if (!t) return "medium"; if ((l.short || 0) / t > 0.5) return "short"; if ((l.long || 0) / t > 0.4) return "long"; return "medium"; },
      score(video) {
        const d = genomeStore.get();
        let s = 50;
        const identity = video.channelId || video.handle;
        if (identity && d.channels && d.channels[identity]) s += 25;
        if (video.duration) {
          const p = genome.getLengthPref();
          const b = video.duration < 300 ? "short" : video.duration < 1200 ? "medium" : "long";
          if (b === p) s += 15;
        }
        if (video.title) {
          const topics = genome.getTopTopics(5);
          const words = String(video.title).toLowerCase().split(/\W+/).filter(w => w.length > 3);
          let overlap = 0;
          for (const word of words) if (topics.includes(word)) overlap++;
          s += Math.min(10, overlap * 5);
        }
        return Math.min(99, Math.max(5, s));
      },
      snapshot() { return genomeStore.get(); },
      reset() { genomeStore.set({ topics: {}, lengths: {}, channels: {}, handles: {}, channelNames: {}, smallChannels: {}, sessions: 0 }); },
    };
    const collections = {
      list() { return collectionsStore.get().slice(); },
      create(name, desc) {
        const col = { id: "col_" + Date.now(), name, desc: desc || "", videos: [], createdAt: Date.now() };
        collectionsStore.update(d => {
          d.push(col);
          if (d.length > 100) d.splice(0, d.length - 100);
        });
        return col;
      },
      addVideo(colId, video) {
        collectionsStore.update(d => {
          const col = d.find(c => c.id === colId);
          if (col && !col.videos.find(v => v.videoId === video.videoId)) {
            col.videos.push(Object.assign({ addedAt: Date.now() }, video));
            if (col.videos.length > 500) col.videos.splice(0, col.videos.length - 500);
          }
        });
      },
      removeVideo(colId, videoId) { collectionsStore.update(d => { const col = d.find(c => c.id === colId); if (col) col.videos = col.videos.filter(v => v.videoId !== videoId); }); },
      delete(colId) { collectionsStore.update(d => { const idx = d.findIndex(c => c.id === colId); if (idx >= 0) d.splice(idx, 1); }); },
    };
    const budget = {
      _pending: 0,
      getUsed() {
        const d = budgetStore.get();
        const base = d.date === new Date().toDateString() ? d.usedSec || 0 : 0;
        return base + (budget._pending || 0);
      },
      flush() {
        const add = budget._pending || 0;
        if (!add) return;
        budget._pending = 0;
        budgetStore.update(d => {
          if (d.date !== new Date().toDateString()) { d.date = new Date().toDateString(); d.usedSec = 0; }
          d.usedSec = (d.usedSec || 0) + add;
        });
      },
      tick(delta) {
        budget._pending = (budget._pending || 0) + (Number(delta) || 0);
        if (budget._pending >= 30) budget.flush();
      },
      getBudget() { return budgetStore.get().budgetMin || 60; },
      setBudget(min) { budgetStore.update(d => { d.budgetMin = min; }); },
      getRemaining() { return Math.max(0, (budget.getBudget() * 60) - budget.getUsed()); },
    };
    try {
      document.addEventListener("visibilitychange", () => { if (document.hidden) budget.flush(); }, { passive: true });
      window.addEventListener("pagehide", () => budget.flush(), { capture: true });
    } catch (_) {}
    return { genome, collections, budget };
  })();

  const AlgoEngine = (() => {
    "use strict";

    const RateLimiter = (() => {
      const windows = new Map();
      let scale = 1;
      const LIMITS = {
        feedback: { max: 15, windowMs: 60000 },
        like: { max: 10, windowMs: 60000 },
        subscribe: { max: 5, windowMs: 60000 },
        browse: { max: 20, windowMs: 60000 },
        player: { max: 10, windowMs: 60000 },
        search: { max: 12, windowMs: 60000 },
        default: { max: 30, windowMs: 60000 },
      };

      const maxFor = (action) => Math.round((LIMITS[action] || LIMITS.default).max * scale);

      const setScale = (factor) => {
        const f = Math.max(0.25, Math.min(2.5, Number(factor) || 1));
        if (f !== scale) { scale = f; windows.clear(); }
      };

      const canProceed = (action) => {
        const limit = LIMITS[action] || LIMITS.default;
        const now = Date.now();
        let w = windows.get(action);
        if (!w || now >= w.resetAt) {
          w = { count: 0, resetAt: now + limit.windowMs };
          windows.set(action, w);
        }
        if (w.count >= maxFor(action)) return false;
        w.count++;
        return true;
      };

      const getRemaining = (action) => {
        const w = windows.get(action);
        if (!w) return maxFor(action);
        if (Date.now() >= w.resetAt) return maxFor(action);
        return Math.max(0, maxFor(action) - w.count);
      };

      return { canProceed, getRemaining, setScale, getScale: () => scale };
    })();

    const TOPIC_TAXONOMY = {
      tech: ["programming", "coding", "software", "developer", "linux", "windows", "mac", "computer", "laptop", "hardware", "cpu", "gpu", "ram", "ssd", "tutorial", "code", "python", "javascript", "react", "ai", "machine learning", "web development", "app", "tech review", "gadget", "smartphone", "tablet", "server", "network", "cybersecurity", "database", "api", "github", "open source", "raspberry pi", "arduino", "docker", "kubernetes", "devops", "cloud", "aws", "azure"],
      gaming: ["game", "gaming", "gameplay", "playthrough", "lets play", "walkthrough", "speedrun", "minecraft", "fortnite", "valorant", "league of legends", "call of duty", "gta", "elden ring", "zelda", "mario", "pokemon", "steam", "playstation", "xbox", "nintendo", "pc gaming", "esports", "twitch", "streamer", "mod", "dlc", "patch", "update", "review", "tier list"],
      science: ["science", "physics", "chemistry", "biology", "astronomy", "space", "nasa", "research", "experiment", "theory", "quantum", "evolution", "climate", "environment", "mathematics", "engineering", "medicine", "neuroscience", "genetics", "atom", "molecule", "cell", "organism", "ecosystem", "universe", "planet", "star", "galaxy", "black hole"],
      education: ["education", "learn", "study", "course", "lecture", "school", "university", "college", "student", "teacher", "professor", "academic", "exam", "homework", "textbook", "curriculum", "degree", "certificate", "skill", "training", "workshop", "masterclass"],
      music: ["music", "song", "album", "artist", "band", "concert", "lyrics", "guitar", "piano", "drums", "bass", "vocals", "producer", "beat", "mix", "remix", "cover", "original", "playlist", "genre", "rock", "pop", "hip hop", "rap", "jazz", "classical", "electronic", "edm", "indie", "alternative"],
      news: ["news", "breaking", "politics", "government", "election", "congress", "senate", "president", "policy", "law", "regulation", "democrat", "republican", "liberal", "conservative", "media", "journalism", "reporter", "anchor", "headline", "current events", "world", "international", "domestic", "local"],
      entertainment: ["movie", "film", "tv", "television", "show", "series", "episode", "season", "actor", "actress", "director", "producer", "hollywood", "netflix", "disney", "streaming", "review", "reaction", "trailer", "behind the scenes", "celebrity", "comedy", "drama", "thriller", "horror", "action", "animation"],
      fitness: ["fitness", "workout", "exercise", "gym", "training", "muscle", "strength", "cardio", "yoga", "pilates", "running", "cycling", "swimming", "diet", "nutrition", "protein", "calorie", "weight loss", "bodybuilding", "crossfit", "stretching", "recovery", "health", "wellness"],
      finance: ["finance", "investing", "stock", "market", "money", "budget", "saving", "banking", "crypto", "bitcoin", "ethereum", "trading", "portfolio", "retirement", "401k", "ira", "real estate", "property", "mortgage", "tax", "income", "expense", "debt", "credit", "loan", "interest"],
      cooking: ["cooking", "recipe", "food", "kitchen", "chef", "meal", "ingredient", "baking", "grill", "fry", "boil", "saute", "restaurant", "cuisine", "dish", "flavor", "spice", "herb", "sauce", "dessert", "appetizer", "breakfast", "lunch", "dinner", "snack", "vegan", "vegetarian", "gluten free"],
      travel: ["travel", "trip", "vacation", "destination", "flight", "hotel", "tourism", "explore", "adventure", "backpacking", "road trip", "cruise", "beach", "mountain", "city", "country", "culture", "landmark", "itinerary", "budget travel", "luxury", "solo travel", "family travel"],
      diy: ["diy", "craft", "project", "build", "make", "create", "handmade", "tutorial", "how to", "step by step", "woodworking", "sewing", "knitting", "painting", "drawing", "sculpture", "pottery", "jewelry", "upcycle", "repurpose", "home improvement", "renovation", "repair", "fix"],
      automotive: ["car", "automotive", "vehicle", "driving", "engine", "motor", "transmission", "tire", "brake", "suspension", "exhaust", "turbo", "supercharger", "horsepower", "torque", "mpg", "electric vehicle", "ev", "tesla", "hybrid", "suv", "truck", "sedan", "coupe", "convertible", "review", "test drive"],
      space: ["space", "astronomy", "rocket", "launch", "orbit", "iss", "spacex", "nasa", "mars", "moon landing", "planet", "galaxy", "universe", "astrophysics", "satellite", "telescope", "astrophotography", "solar system", "interstellar", "gravity", "cosmos", "lunar", "comet", "asteroid", "cosmonaut", "astronaut"],
      history: ["history", "historical", "ancient", "medieval", "renaissance", "world war", "civil war", "empire", "dynasty", "archaeology", "artifact", "museum", "documentary", "century", "era", "civilization", "timeline", "egypt", "rome", "greece", "viking", "monarchy", "revolution"],
      art: ["art", "painting", "drawing", "sketch", "digital art", "illustration", "artist", "gallery", "watercolor", "acrylic", "canvas", "portrait", "sculpture", "concept art", "art tutorial", "ink drawing", "painter", "illustrator"],
      philosophy: ["philosophy", "philosopher", "stoicism", "stoic", "existentialism", "nihilism", "ethics", "morality", "consciousness", "meaning of life", "logic", "reasoning", "plato", "aristotle", "nietzsche", "sartre", "camus", "taoism", "zen buddhism", "mindfulness", "wisdom"],
      psychology: ["psychology", "mental health", "therapy", "anxiety", "depression", "mindset", "habit", "behavior", "cognitive", "neuroscience", "personality", "trauma", "adhd", "sleep science", "stress", "emotional intelligence", "psychologist", "counseling", "addiction"],
      business: ["business", "startup", "entrepreneur", "marketing", "sales", "branding", "strategy", "management", "leadership", "product", "growth", "ecommerce", "saas", "fundraising", "venture capital", "pitch", "consulting", "career", "side hustle", "freelance", "business model", "scaling"],
      design: ["design", "ui design", "ux design", "graphic design", "typography", "logo design", "web design", "product design", "figma", "photoshop", "illustrator", "color theory", "layout", "motion design", "brand design", "user experience", "prototype"],
      photography: ["photography", "camera", "lens", "photo", "lightroom", "portrait photography", "landscape photography", "street photography", "iso", "aperture", "shutter speed", "photography tips", "camera gear", "photographer", "photo editing", "cinematic shot"],
      sports: ["sports", "football", "soccer", "basketball", "tennis", "cricket", "olympics", "athlete", "training", "match", "tournament", "championship", "goals", "highlights", "mma", "boxing", "f1", "formula one", "nfl", "nba", "premier league", "sport science"],
      outdoors: ["outdoors", "hiking", "camping", "backpacking", "fishing", "hunting", "survival", "bushcraft", "climbing", "kayaking", "canoeing", "trail", "wildlife", "national park", "wilderness", "outdoor gear", "nature documentary", "adventure"],
      gardening: ["gardening", "garden", "plants", "growing", "seeds", "soil", "compost", "vegetables", "herbs", "flowers", "greenhouse", "pruning", "harvest", "permaculture", "urban gardening", "plant care", "houseplants", "farming"],
      pets: ["pets", "pet", "dog training", "cat", "puppy", "kitten", "aquarium", "fish tank", "reptile", "hamster", "parrot", "pet grooming", "vet", "rescue dog", "adoption", "pet care"],
      anime: ["anime", "manga", "anime review", "anime list", "shonen", "slice of life anime", "ghibli", "anime music", "cosplay", "otaku", "anime reaction", "manga review"],
      literature: ["book", "books", "novel", "reading", "author", "writer", "poetry", "fiction", "fantasy book", "sci-fi novel", "mystery novel", "thriller book", "biography", "audiobook", "book review", "booktube", "book summary", "literature"],
      selfImprovement: ["self improvement", "productivity", "motivation", "discipline", "goals", "habits", "morning routine", "focus", "learning", "growth mindset", "personal development", "journaling", "meditation", "confidence", "procrastination", "success"],
      productivity: ["productivity", "focus", "time management", "deep work", "pomodoro", "study tips", "note taking", "organization", "workflow", "remote work", "efficiency", "productivity tools", "notion", "obsidian", "getting things done"],
      economics: ["economics", "economy", "inflation", "recession", "gdp", "interest rate", "macroeconomics", "microeconomics", "supply chain", "trade", "fiscal policy", "monetary policy", "jobs report", "unemployment", "economic crisis", "housing market"],
      robotics: ["robotics", "robot", "automation", "humanoid", "drone", "bionic", "mechatronics", "iot", "embedded", "machine vision", "agi", "automation tech", "robot arm", "sensor"],
      trueCrime: ["true crime", "murder case", "unsolved mystery", "cold case", "serial killer", "criminal", "investigation", "forensic", "trial", "crime documentary", "court case", "missing person", "crime story"],
      vlogs: ["vlog", "daily vlog", "travel vlog", "life update", "day in the life", "lifestyle", "family vlog", "vlogger", "weekly vlog", "routine"],
      documentaries: ["documentary", "docu-series", "explained", "deep dive", "mini documentary", "documentary film", "storytelling", "investigative", "feature documentary"],
      language: ["language learning", "learn spanish", "learn french", "learn japanese", "learn korean", "learn german", "english grammar", "polyglot", "foreign language", "vocabulary", "fluent", "language tips", "duolingo", "anki"],
    };

    const ContentClassifier = (() => {
      const cache = new YourTubeResources.BoundedCache(256, "topic-cache");

      let compiledTaxonomy = null;
      const escapeRe = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const compileTaxonomy = () => {
        if (compiledTaxonomy) return compiledTaxonomy;
        const compiled = [];
        for (const [topic, keywords] of Object.entries(TOPIC_TAXONOMY)) {
          const patterns = [];
          for (const kw of keywords) {
            try { patterns.push(new RegExp("\\b" + escapeRe(kw) + "\\b", "gi")); } catch (_) {}
          }
          if (patterns.length) compiled.push([topic, patterns]);
        }
        compiledTaxonomy = compiled;
        return compiled;
      };

      const classify = (metadata) => {
        if (!metadata) return {};

        const cacheKey = metadata.videoId ||
          (metadata.title ? "t:" + String(metadata.title).toLowerCase() : "");
        if (cacheKey && cache.has(cacheKey)) return cache.get(cacheKey);

        const text = [
          metadata.title || "",
          metadata.description || "",
          (metadata.keywords || []).join(" "),
          metadata.channelName || "",
          (metadata.tags || []).join(" "),
          metadata.category || "",
        ].join(" ").toLowerCase();

        const scores = {};
        let total = 0;
        for (const [topic, patterns] of compileTaxonomy()) {
          let score = 0;
          for (const regex of patterns) {
            const matches = text.match(regex);
            if (matches) score += matches.length;
          }
          if (score > 0) { scores[topic] = score; total += score; }
        }

        if (total > 0) {
          for (const topic of Object.keys(scores)) {
            scores[topic] = Math.round((scores[topic] / total) * 100);
          }
        }

        if (cacheKey) cache.set(cacheKey, scores);
        return scores;
      };

      const classifyFromPage = () => {
        try {
          const pr = e.ytInitialPlayerResponse;
          if (!pr || !pr.videoDetails) return {};
          return classify({
            videoId: pr.videoDetails.videoId,
            title: pr.videoDetails.title,
            description: pr.videoDetails.shortDescription,
            keywords: pr.videoDetails.keywords,
            channelName: pr.videoDetails.author,
            category: pr.microformat && pr.microformat.playerMicroformatRenderer && pr.microformat.playerMicroformatRenderer.category,
          });
        } catch (_) { return {}; }
      };

      return { classify, classifyFromPage, TOPIC_TAXONOMY };
    })();

    const SignalTracker = (() => {
      const store = YourTubeEngine.createStore("__algo_signals__", {
        events: [],
        watchHistory: {},
        likeHistory: {},
        subHistory: {},
        feedbackHistory: {},
        sessionSignals: 0,
      });

      const MILESTONE_PCT = 5;
      const MILESTONE_MIN_MS = 45000;
      const lastMilestone = new Map();

      const shouldRecordWatch = (videoId, pct) => {
        const at = Date.now();
        const prev = lastMilestone.get(videoId);
        if (!prev) {
          lastMilestone.set(videoId, { at, pct });
          if (lastMilestone.size > 64) {
            let oldestKey = null;
            let oldestAt = Infinity;
            for (const [key, value] of lastMilestone) {
              if (value.at < oldestAt) { oldestAt = value.at; oldestKey = key; }
            }
            if (oldestKey !== null && oldestKey !== videoId) lastMilestone.delete(oldestKey);
          }
          return true;
        }
        if (Math.abs(pct - prev.pct) >= MILESTONE_PCT || at - prev.at >= MILESTONE_MIN_MS) {
          lastMilestone.set(videoId, { at, pct });
          return true;
        }
        return false;
      };

      const trackWatch = (videoId, watchTime, duration) => {
        if (!videoId) return;
        const pct = duration > 0 ? Math.min(100, Math.round((watchTime / duration) * 100)) : 0;
        if (!shouldRecordWatch(videoId, pct)) return;

        let topics = null;
        try {
          topics = JSON.parse(JSON.stringify(ContentClassifier.classifyFromPage() || null));
        } catch (_) {
          topics = null;
        }
        let channelId = "";
        let channelName = "";
        try {
          const vd = e.ytInitialPlayerResponse && e.ytInitialPlayerResponse.videoDetails;
          if (vd) {
            channelId = vd.channelId || "";
            channelName = vd.author || "";
          }
        } catch (_) {}
        const rec = {
          watchTime: Number(watchTime) || 0,
          duration: Number(duration) || 0,
          pct: pct,
          topics: topics,
          channelId: String(channelId || ""),
          channelName: String(channelName || ""),
          ts: Date.now(),
        };
        store.update(d => {
          try {
            d.watchHistory[videoId] = rec;
          } catch (_) {
            return;
          }

          const keys = Object.keys(d.watchHistory);
          if (keys.length > 500) {
            keys.sort((a, b) => (d.watchHistory[a].ts || 0) - (d.watchHistory[b].ts || 0));
            for (const k of keys.slice(0, keys.length - 500)) delete d.watchHistory[k];
          }
          d.events.push({ type: "watch", videoId, pct, ts: Date.now() });
          if (d.events.length > 1000) d.events = d.events.slice(-1000);
          d.sessionSignals++;
        });
      };

      const recencyWeight = (ts) => {
        const age = Math.max(0, Date.now() - (ts || 0));
        if (age < 24 * 3600e3) return 1;
        if (age < 7 * 24 * 3600e3) return 0.7;
        if (age < 30 * 24 * 3600e3) return 0.4;
        if (age < 90 * 24 * 3600e3) return 0.2;
        return 0.08;
      };

      const getProfile = () => {
        const d = store.get();
        const topicScores = {};
        const watched = Object.values(d.watchHistory);
        for (const entry of watched) {
          if (!entry.topics) continue;
          const weight = (entry.pct || 0) / 100 * recencyWeight(entry.ts);
          for (const [topic, score] of Object.entries(entry.topics)) {
            topicScores[topic] = (topicScores[topic] || 0) + score * weight;
          }
        }

        const maxScore = Math.max(1, ...Object.values(topicScores));
        for (const topic of Object.keys(topicScores)) {
          topicScores[topic] = Math.round((topicScores[topic] / maxScore) * 100);
        }
        return {
          topics: topicScores,
          totalWatched: watched.length,
          totalLikes: Object.values(d.likeHistory).filter(v => v.liked).length,
          totalDislikes: Object.values(d.likeHistory).filter(v => v.disliked).length,
          totalFeedback: Object.keys(d.feedbackHistory).length,
          sessionSignals: d.sessionSignals,
          avgWatchPct: watched.length > 0 ? Math.round(watched.reduce((s, v) => s + (v.pct || 0), 0) / watched.length) : 0,
        };
      };

      const getChannels = (limit = 10) => {
        const d = store.get();
        const map = new Map();
        for (const entry of Object.values(d.watchHistory)) {
          if (!entry.channelId) continue;
          const cur = map.get(entry.channelId) || { name: entry.channelName || entry.channelId, count: 0, totalPct: 0 };
          cur.count++;
          cur.totalPct += entry.pct || 0;
          if (entry.channelName) cur.name = entry.channelName;
          map.set(entry.channelId, cur);
        }
        return Array.from(map.entries())
          .map(([id, info]) => ({ channelId: id, ...info }))
          .sort((a, b) => b.totalPct - a.totalPct)
          .slice(0, limit);
      };

      const getRecentSignals = (limit = 12) => store.get().events.slice(-limit);

      const clearHistory = () => {
        store.update(d => {
          d.events = [];
          d.watchHistory = {};
          d.likeHistory = {};
          d.feedbackHistory = {};
          d.sessionSignals = 0;
        });
        lastMilestone.clear();
      };

      const trackLike = (videoId, action) => {
        if (!videoId) return;
        store.update(d => {
          d.likeHistory[videoId] = { liked: action === "like", disliked: action === "dislike", ts: Date.now() };
          d.events.push({ type: action, videoId, ts: Date.now() });
          if (d.events.length > 1000) d.events = d.events.slice(-1000);
          d.sessionSignals++;
        });
      };

      const trackFeedback = (videoId, action) => {
        if (!videoId) return;
        store.update(d => {
          d.feedbackHistory[videoId] = { action, ts: Date.now() };
          d.events.push({ type: "feedback:" + action, videoId, ts: Date.now() });
          if (d.events.length > 1000) d.events = d.events.slice(-1000);
          d.sessionSignals++;
        });
      };

      return { trackWatch, trackLike, trackFeedback, getProfile, getChannels, getRecentSignals, clearHistory, getStore: () => store };
    })();

    // Legacy training actions previously sent account-affecting feedback,
    // reactions and artificial watch/search signals. Keep their old call sites
    // inert during migration; local data and Discover do not depend on them.
    const SignalInjector = Object.freeze({
      sendFeedback: async () => false,
      sendLike: async () => false,
      simulateWatch: async () => false,
      browseChannel: async () => false,
      searchTopic: async () => false,
    });

    const extractMenuTokens = (menuEl) => {
      const empty = { notInterestedToken: "", dontRecommendToken: "" };
      try {
        if (!menuEl) return empty;
        const source = menuEl.data !== undefined ? menuEl.data : menuEl.__data;
        if (!source) return empty;
        const dataStr = typeof source === "string" ? source : JSON.stringify(source);
        if (!dataStr) return empty;

        const niMatch = dataStr.match(/[Nn]ot[Ii]nterested[\s\S]{0,240}?"feedbackToken":"([^"]+)"/);
        const drMatch = dataStr.match(/[Dd]ont[Rr]ecommend[\s\S]{0,240}?"feedbackToken":"([^"]+)"/);
        return {
          notInterestedToken: niMatch ? niMatch[1] : "",
          dontRecommendToken: drMatch ? drMatch[1] : "",
        };
      } catch (_) {
        return empty;
      }
    };
    const recWithLazyTokens = (rec, menuEl) => {
      // Extract once per element: both getters are read in the same pass and
      // each extraction walks the whole menu payload.
      let tokens = null;
      const getTokens = () => tokens || (tokens = extractMenuTokens(menuEl));
      Object.defineProperties(rec, {
        notInterestedToken: { configurable: true, get() { return getTokens().notInterestedToken; } },
        dontRecommendToken: { configurable: true, get() { return getTokens().dontRecommendToken; } },
      });
      return rec;
    };
    const ProfileAnalyzer = (() => {
      const analyzeHomepage = () => {
        const recommendations = [];
        try {
          const items = document.querySelectorAll("ytd-rich-item-renderer");
          for (const item of items) {
            const titleEl = item.querySelector("#video-title, #video-title-link, .yt-lockup-metadata-view-model__title");
            const channelEl = item.querySelector("#channel-name a, ytd-channel-name a, .ytd-channel-name");
            const linkEl = item.querySelector("a#thumbnail, a#video-title-link");
            if (!titleEl) continue;
            const title = (titleEl.textContent || "").trim();
            const channel = channelEl ? (channelEl.textContent || "").trim() : "";
            const href = linkEl ? (linkEl.getAttribute("href") || "") : "";
            const videoIdMatch = href.match(/[?&]v=([A-Za-z0-9_-]{11})/);
            const videoId = videoIdMatch ? videoIdMatch[1] : "";
            const menuEl = item.querySelector("ytd-menu-renderer");

            const topics = ContentClassifier.classify({ title, channelName: channel, videoId });
            recommendations.push(recWithLazyTokens({ videoId, title, channel, topics }, menuEl));
          }
        } catch (_) {}

        const topicDist = {};
        for (const rec of recommendations) {
          for (const [topic, score] of Object.entries(rec.topics)) {
            topicDist[topic] = (topicDist[topic] || 0) + score;
          }
        }
        const total = Math.max(1, Object.values(topicDist).reduce((a, b) => a + b, 0));
        for (const topic of Object.keys(topicDist)) {
          topicDist[topic] = Math.round((topicDist[topic] / total) * 100);
        }

        return { recommendations, topicDistribution: topicDist, count: recommendations.length };
      };

      const findMismatches = () => {
        const profile = SignalTracker.getProfile();
        const homepage = analyzeHomepage();
        const mismatches = [];

        for (const rec of homepage.recommendations) {
          for (const [topic, recScore] of Object.entries(rec.topics)) {
            const profileScore = profile.topics[topic] || 0;

            if (recScore > 30 && profileScore < 15) {
              mismatches.push({
                videoId: rec.videoId,
                title: rec.title,
                topic,
                recScore,
                profileScore,
                notInterestedToken: rec.notInterestedToken,
                dontRecommendToken: rec.dontRecommendToken,
              });
            }
          }
        }
        return mismatches;
      };

      return { analyzeHomepage, findMismatches };
    })();

    const TrainingEngine = (() => {
      let trainingActive = false;
      let trainingProgress = { completed: 0, total: 0 };

      const startTraining = async (targetTopics, opts = {}) => {
        if (trainingActive) return { ok: false, error: "Training already in progress" };
        trainingActive = true;
        trainingProgress = { completed: 0, total: 0 };

        const actions = [];

        for (const topic of targetTopics) {
          const keywords = TOPIC_TAXONOMY[topic];
          if (keywords) {

            const queries = keywords.slice(0, 3);
            for (const q of queries) {
              actions.push({ type: "search", query: q });
            }
          }
        }

        const mismatches = ProfileAnalyzer.findMismatches();

        const negLimit = Number.isFinite(opts.maxNegative) ? opts.maxNegative : 10;
        for (const mismatch of mismatches.slice(0, negLimit)) {
          if (mismatch.notInterestedToken) {
            actions.push({ type: "notInterested", token: mismatch.notInterestedToken, videoId: mismatch.videoId });
          }
        }

        trainingProgress.total = actions.length;

        const results = [];
        for (const action of actions) {
          if (!trainingActive) break;
          let ok = false;
          if (action.type === "search") {
            ok = await SignalInjector.searchTopic(action.query);
          } else if (action.type === "notInterested") {
            ok = await SignalInjector.sendFeedback(action.token, "notInterested");
          }
          results.push({ ...action, ok });
          trainingProgress.completed++;
          if (trainingActive && action !== actions[actions.length - 1]) {

            await new Promise(r => setTimeout(r, 1200 + Math.random() * 2300));
          }
        }

        trainingActive = false;
        return { ok: true, results, progress: trainingProgress };
      };

      const stopTraining = () => { trainingActive = false; };
      const getProgress = () => trainingProgress;
      const isActive = () => trainingActive;

      return { startTraining, stopTraining, getProgress, isActive };
    })();

    const NegativeSignalManager = (() => {
      const blockTopics = new Set();
      const blockKeywords = [];

      const addBlockedTopic = (topic) => { blockTopics.add(topic.toLowerCase()); };
      const removeBlockedTopic = (topic) => { blockTopics.delete(topic.toLowerCase()); };
      const addBlockedKeyword = (kw) => { blockKeywords.push(kw.toLowerCase()); };

      const clearBlocked = () => { blockTopics.clear(); blockKeywords.length = 0; };

      const scanAndBlock = async (maxActions = 15) => {
        const homepage = ProfileAnalyzer.analyzeHomepage();
        let actions = 0;

        for (const rec of homepage.recommendations) {
          if (actions >= maxActions) break;

          let shouldBlock = false;
          let blockReason = "";

          for (const [topic, score] of Object.entries(rec.topics)) {
            if (score > 25 && blockTopics.has(topic)) {
              shouldBlock = true;
              blockReason = "blocked topic: " + topic;
              break;
            }
          }

          if (!shouldBlock) {
            const title = (rec.title || "").toLowerCase();
            for (const kw of blockKeywords) {
              if (title.includes(kw)) {
                shouldBlock = true;
                blockReason = "blocked keyword: " + kw;
                break;
              }
            }
          }

          if (shouldBlock && rec.notInterestedToken) {
            const ok = await SignalInjector.sendFeedback(rec.notInterestedToken, "notInterested:" + blockReason);
            if (ok) actions++;

            await new Promise(r => setTimeout(r, 900 + Math.random() * 900));
          }
        }

        return { actions, scanned: homepage.recommendations.length };
      };

      return { addBlockedTopic, removeBlockedTopic, addBlockedKeyword, clearBlocked, scanAndBlock, getBlockedTopics: () => [...blockTopics], getBlockedKeywords: () => [...blockKeywords] };
    })();

    const WatchOptimizer = (() => {
      let monitoring = false;
      let tickerId = 0;
      let skipSignals = 0;
      const skipLatched = new Set();
      const latchSkip = (videoId) => {
        // Bound the latch set: it only prevents re-latching within a session.
        if (skipLatched.size > 200) {
          const first = skipLatched.values().next().value;
          if (first !== undefined) skipLatched.delete(first);
        }
        skipLatched.add(videoId);
      };

      const start = () => {
        if (monitoring) return;
        monitoring = true;

        tickerId = YourTubeResources.SharedTicker.add(() => {
          if (!monitoring) return;
          const vid = ie.el();
          if (!vid || vid.paused || vid.ended) return;
          if (_isLiveStream()) return;

          const videoId = ie.videoId();
          if (!videoId) return;

          const currentTime = vid.currentTime;
          const duration = vid.duration;
          if (!isFinite(duration) || duration < 10) return;

          let topics = null;
          try {
            topics = JSON.parse(JSON.stringify(ContentClassifier.classifyFromPage() || {}));
          } catch (_) {
            topics = {};
          }
          const profile = SignalTracker.getProfile();
          const blockedTopics = NegativeSignalManager.getBlockedTopics();

          let wantedScore = 0;
          let unwantedScore = 0;
          for (const [topic, score] of Object.entries(topics)) {
            const profileScore = profile.topics[topic] || 0;
            if (profileScore > 30) wantedScore += score;
            if (blockedTopics.includes(topic)) unwantedScore += score;
          }

          SignalTracker.trackWatch(videoId, currentTime, duration);

          if (!skipLatched.has(videoId) && unwantedScore > wantedScore && currentTime > 5 && currentTime < duration * 0.3) {
            latchSkip(videoId);
            skipSignals++;
          }

          const pct = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
          MicroFeedback.maybeAutoLike(videoId, topics, pct, profile);
          MicroFeedback.maybeAutoDislike(videoId, topics, pct, unwantedScore, wantedScore);
        }, 10000, { pauseHidden: true, label: "algo-watch-optimizer" });
      };

      const stop = () => {
        monitoring = false;
        skipLatched.clear();
        if (tickerId) {
          YourTubeResources.SharedTicker.remove(tickerId);
          tickerId = 0;
        }
      };

      const getSkipCount = () => skipSignals;

      return { start, stop, isMonitoring: () => monitoring, getSkipCount };
    })();

    const ChannelAffinity = (() => {
      const blocked = new Set();

      const addBlocked = (c) => { const v = String(c || "").trim().toLowerCase(); if (v) blocked.add(v); };
      const removeBlocked = (c) => { blocked.delete(String(c || "").trim().toLowerCase()); };
      const clearBlocked = () => { blocked.clear(); };
      const isBlocked = (c) => blocked.has(String(c || "").trim().toLowerCase());
      const getBlocked = () => [...blocked];
      const getTopChannels = (limit = 8) => SignalTracker.getChannels(limit);

      const boostTopChannels = async (max = 3) => {
        let done = 0;
        for (const ch of SignalTracker.getChannels(10)) {
          if (done >= max || !RateLimiter.canProceed("browse")) break;
          try {
            const ok = await SignalInjector.browseChannel(ch.channelId);

            if (ok) done++;
          } catch (_) {}
          await new Promise(r => setTimeout(r, 900 + Math.random() * 900));
        }
        return done;
      };

      return { addBlocked, removeBlocked, clearBlocked, isBlocked, getBlocked, getTopChannels, boostTopChannels };
    })();

    const InterestBooster = (() => {
      const runBoost = async (maxActions = 6) => {
        const profile = SignalTracker.getProfile();
        const topics = Object.entries(profile.topics).sort((a, b) => b[1] - a[1]).slice(0, 3).map(t => t[0]);
        if (!topics.length) return { searches: 0, likes: 0, browsed: 0, reason: "no profile yet" };

        let searches = 0;
        let likes = 0;
        let browsed = 0;
        let budget = Math.max(2, maxActions);

        for (const topic of topics) {
          if (budget <= 0) break;
          const keywords = TOPIC_TAXONOMY[topic] || [];
          const query = keywords[Math.floor(Math.random() * Math.min(4, keywords.length))] || topic;
          if (await SignalInjector.searchTopic(query)) {
            searches++;
            budget--;
          }
          await new Promise(r => setTimeout(r, 1100 + Math.random() * 1200));
        }

        if (budget > 0) {
          try {
            const home = ProfileAnalyzer.analyzeHomepage();
            const topTopics = new Set(topics);
            const profile = SignalTracker.getProfile();
            for (const rec of home.recommendations) {
              if (budget <= 0) break;
              const recTopics = Object.entries(rec.topics).filter(([t, s]) => topTopics.has(t) && s >= 20);
              if (recTopics.length && rec.videoId && (profile.topics[recTopics[0][0]] || 0) >= 35) {
                if (await SignalInjector.sendLike(rec.videoId, "like")) {
                  likes++;
                  budget--;
                }
                await new Promise(r => setTimeout(r, 1000 + Math.random() * 1200));
              }
            }
          } catch (_) {}
        }

        if (budget > 0 && RateLimiter.canProceed("browse")) {
          try {
            if (await ChannelAffinity.boostTopChannels(1)) browsed++;
          } catch (_) {}
        }

        return { searches, likes, browsed };
      };

      return { runBoost };
    })();

    const DiversityManager = (() => {
      const analyze = () => {
        const dist = ProfileAnalyzer.analyzeHomepage().topicDistribution;
        let total = 0;
        let dominant = "";
        let maxShare = 0;
        for (const [topic, share] of Object.entries(dist)) {
          total += share;
          if (share > maxShare) { maxShare = share; dominant = topic; }
        }
        return { dist, dominant, maxShare, count: Object.keys(dist).length };
      };

      const widen = async (max = 4) => {
        const profile = SignalTracker.getProfile();
        const known = new Set(Object.keys(profile.topics));
        const available = Object.keys(TOPIC_TAXONOMY).filter(t => !known.has(t));
        if (!available.length) return 0;

        for (let i = available.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [available[i], available[j]] = [available[j], available[i]];
        }
        let done = 0;
        for (const topic of available.slice(0, 2)) {
          if (done >= max) break;
          const keywords = TOPIC_TAXONOMY[topic] || [];
          const query = keywords[0] || topic;
          if (await SignalInjector.searchTopic(query)) done++;
          await new Promise(r => setTimeout(r, 1200 + Math.random() * 1500));
        }
        return done;
      };

      const maybeWiden = async () => {
        const a = analyze();
        const threshold = Math.max(45, Math.min(90, Number(S.algoDiversityMax) || 60));
        if (a.maxShare >= threshold && a.count >= 3) {
          const widened = await widen(2);
          if (widened > 0) {
            try { pe("YourTube: feed was too concentrated on '" + a.dominant + "' — widened your bubble.", 2800, "info"); } catch (_) {}
          }
          return widened;
        }
        return 0;
      };

      return { analyze, widen, maybeWiden };
    })();

    const MicroFeedback = (() => {
      const maybeAutoLike = (videoId, topics, pct, profile) => {
        if (!videoId || !S.algoAutoLikeOn) return;
        if (pct < (Number(S.algoAutoLikePct) || 85)) return;
        if (SignalTracker.getStore().get().likeHistory[videoId]) return;
        const topTopic = Object.entries(topics).sort((a, b) => b[1] - a[1])[0];
        if (!topTopic) return;
        if ((profile.topics[topTopic[0]] || 0) >= 35) {
          SignalInjector.sendLike(videoId, "like");
        }
      };

      const maybeAutoDislike = (videoId, topics, pct, unwantedScore, wantedScore) => {

        if (!videoId || !S.algoAutoDislikeOn) return;
        if (pct < 15 || pct > 60) return;
        if (SignalTracker.getStore().get().likeHistory[videoId]) return;
        if (unwantedScore > wantedScore && unwantedScore >= 25) {
          SignalInjector.sendLike(videoId, "dislike");
        }
      };

      return { maybeAutoLike, maybeAutoDislike };
    })();

    const ShortsSignals = (() => {
      const scan = async (max = 5) => {
        if (!location.pathname.startsWith("/shorts")) return { actions: 0, scanned: 0 };
        const items = Array.from(document.querySelectorAll("ytd-reel-video-renderer"));
        let actions = 0;
        for (const item of items.slice(0, 12)) {
          if (actions >= max) break;
          try {
            const titleEl = item.querySelector("#video-title, .ytLockupViewModelHostTitle, [title]");
            const title = (titleEl ? (titleEl.getAttribute("title") || titleEl.textContent || "") : "").trim();
            if (!title) continue;
            const topics = ContentClassifier.classify({ title, videoId: "" });
            let shouldBlock = false;
            let reason = "";
            for (const [topic, score] of Object.entries(topics)) {
              if (score >= 25 && NegativeSignalManager.getBlockedTopics().includes(topic)) {
                shouldBlock = true; reason = "topic: " + topic; break;
              }
            }
            if (!shouldBlock) {
              const low = title.toLowerCase();
              for (const kw of NegativeSignalManager.getBlockedKeywords()) {
                if (low.includes(kw)) { shouldBlock = true; reason = "keyword: " + kw; break; }
              }
            }
            if (!shouldBlock) continue;
            const token = extractTokenFromItem(item);
            if (token) {
              const ok = await SignalInjector.sendFeedback(token, "notInterested:" + reason);
              if (ok) actions++;
            }
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
          } catch (_) {}
        }
        return { actions, scanned: items.length };
      };

      const extractTokenFromItem = (item) => {
        try {
          const source = item && item.data !== undefined ? item.data : (item && item.__data);
          if (!source) return "";
          const dataStr = typeof source === "string" ? source : JSON.stringify(source);
          const m = dataStr.match(/"feedbackToken":"([^"]+)"/);
          return m ? m[1] : "";
        } catch (_) { return ""; }
      };

      return { scan };
    })();

    return {

      RateLimiter,
      ContentClassifier,
      SignalTracker,
      SignalInjector,
      ProfileAnalyzer,
      TrainingEngine,
      NegativeSignalManager,
      WatchOptimizer,
      ChannelAffinity,
      InterestBooster,
      DiversityManager,
      MicroFeedback,
      ShortsSignals,

      getProfile: () => SignalTracker.getProfile(),
      getChannels: (n) => SignalTracker.getChannels(n),
      getRecentSignals: (n) => SignalTracker.getRecentSignals(n),
      analyzeHomepage: () => ProfileAnalyzer.analyzeHomepage(),
      analyzeDiversity: () => DiversityManager.analyze(),
      findMismatches: () => ProfileAnalyzer.findMismatches(),
      train: (topics, opts) => TrainingEngine.startTraining(topics, opts),
      stopTraining: () => TrainingEngine.stopTraining(),
      blockTopic: (topic) => NegativeSignalManager.addBlockedTopic(topic),
      unblockTopic: (topic) => NegativeSignalManager.removeBlockedTopic(topic),
      blockKeyword: (kw) => NegativeSignalManager.addBlockedKeyword(kw),
      blockChannel: (c) => ChannelAffinity.addBlocked(c),
      unblockChannel: (c) => ChannelAffinity.removeBlocked(c),
      resetBlockLists: () => { NegativeSignalManager.clearBlocked(); ChannelAffinity.clearBlocked(); },
      scanAndBlock: (max) => NegativeSignalManager.scanAndBlock(max),
      scanShorts: (max) => ShortsSignals.scan(max),
      boost: (max) => InterestBooster.runBoost(max),
      widen: (max) => DiversityManager.widen(max),
      maybeWiden: () => DiversityManager.maybeWiden(),
      clearSignalHistory: () => SignalTracker.clearHistory(),
      startMonitoring: () => WatchOptimizer.start(),
      stopMonitoring: () => WatchOptimizer.stop(),
      applyStrength: (level) => {
        const f = level === "light" ? 0.4 : level === "aggressive" ? 1.6 : 1;
        RateLimiter.setScale(f);
      },
      stats: () => ({
        profile: SignalTracker.getProfile(),
        channels: SignalTracker.getChannels(5),
        recentSignals: SignalTracker.getRecentSignals(8),
        rateLimits: {
          feedback: RateLimiter.getRemaining("feedback"),
          like: RateLimiter.getRemaining("like"),
          subscribe: RateLimiter.getRemaining("subscribe"),
          browse: RateLimiter.getRemaining("browse"),
          search: RateLimiter.getRemaining("search"),
        },
        training: TrainingEngine.getProgress(),
        monitoring: WatchOptimizer.isMonitoring(),
        skipSignals: WatchOptimizer.getSkipCount(),
        blockedTopics: NegativeSignalManager.getBlockedTopics(),
        blockedKeywords: NegativeSignalManager.getBlockedKeywords(),
        blockedChannels: ChannelAffinity.getBlocked(),
      }),
    };
  })();

  const DISCOVER_CATEGORIES = {
    tech: { label: "Technology", query: "technology" },
    gaming: { label: "Gaming", query: "gaming" },
    science: { label: "Science", query: "science" },
    education: { label: "Education", query: "education" },
    music: { label: "Music", query: "music" },
    news: { label: "News", query: "news" },
    entertainment: { label: "Movies & TV", query: "movies and tv" },
    fitness: { label: "Fitness", query: "fitness workout" },
    finance: { label: "Finance", query: "personal finance" },
    cooking: { label: "Cooking", query: "cooking recipes" },
    travel: { label: "Travel", query: "travel" },
    diy: { label: "DIY & Crafts", query: "diy projects" },
    automotive: { label: "Automotive", query: "cars" },
  };
  const DISCOVER_DEFAULT_NICHE = ["tech", "gaming", "science"];

  const _discoverSearchCache = new Map();
  const DISCOVER_SEARCH_SP = [null, "EgIIAw%3D%3D", "EgIIBA%3D%3D", "EgIIBQ%3D%3D"];
  const DISCOVER_MIN_TOPICS = 8;
  const DISCOVER_MIN_VIDEOS = 10;
  const DISCOVER_MAX_VIDEOS = 20;
  xa.register({
    id: "discover",
    name: "Discover",
    summary: "Topic-based search discovery with watch-history dedup, no algorithm.",
      cat: "insights",
    masterKey: "discoverOn",
    keys: ["discoverOn"],
    apply(ctx) {
      if (!S.discoverOn) return;
      YourTubeEngine.injectCSS();
      ctx.addStyle(
        ".ytb-ui-disco-mode{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px}" +
        ".ytb-ui-disco-mode .ytb-ui-mode-btn{padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#ccc;font:600 10.5px system-ui;cursor:pointer;transition:all .12s}" +
        ".ytb-ui-disco-mode .ytb-ui-mode-btn:hover{background:rgba(255,255,255,.09)}" +
        ".ytb-ui-disco-mode .ytb-ui-mode-btn.active{background:rgba(255,61,127,.16);border-color:rgba(255,61,127,.35);color:#ff8aa5}" +
        ".ytb-ui-disco-grid{display:flex;gap:4px;flex-wrap:wrap;margin:2px 0 6px}" +
        ".ytb-ui-disco-grid .ytb-ui-topic-btn{padding:3px 9px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#ccc;font:600 10px system-ui;cursor:pointer;transition:all .12s}" +
        ".ytb-ui-disco-grid .ytb-ui-topic-btn:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.16)}" +
        ".ytb-ui-disco-grid .ytb-ui-topic-btn.active{background:rgba(255,61,127,.16);border-color:rgba(255,61,127,.35);color:#ff8aa5}"
      );
      const host = YourTubeDiscovery.discoveryHost(ctx);
      let api = null;
      let mode = "niche";
      let activeTopic = null;
      let grid = null;
      const sessionShown = new Set();

      const topicsForMode = () => {
        let ranked = [];
        try {
          const words = YourTubeSession.genome.getTopTopics(12);
          if (words.length) {
            const scores = AlgoEngine.ContentClassifier.classify({ title: words.join(" ") });
            ranked = Object.entries(scores || {}).sort((a, b) => b[1] - a[1]).map(e => e[0]);
          }
        } catch (_) {}
        const top = ranked.slice(0, 3).length ? ranked.slice(0, 3) : DISCOVER_DEFAULT_NICHE.slice();
        const all = Object.keys(DISCOVER_CATEGORIES);
        if (mode === "outside") return all.filter(k => !top.includes(k));
        const niche = top.slice();
        for (const k of all) {
          if (niche.length >= DISCOVER_MIN_TOPICS) break;
          if (!niche.includes(k)) niche.push(k);
        }
        return niche.slice(0, DISCOVER_MIN_TOPICS);
      };

      const HISTORY_BATCH = 12;
      const seen = new Set();
      const isWatched = async (videoId) => {

        try {
          if (!S.sessionRestoreOn) return false;
          return !!(await v("history", videoId));
        } catch (_) { return false; }
      };
      const filterUnwatched = async (videos) => {
        const kept = [];
        for (let i = 0; i < videos.length; i += HISTORY_BATCH) {
          const chunk = videos.slice(i, i + HISTORY_BATCH);
          const watched = await Promise.all(chunk.map((video) => isWatched(video && video.videoId)));
          for (let j = 0; j < chunk.length; j++) {
            const video = chunk[j];
            if (!video || !video.videoId || seen.has(video.videoId) || sessionShown.has(video.videoId)) continue;
            if (watched[j]) continue;
            seen.add(video.videoId);
            kept.push(video);
          }
        }
        return kept;
      };
      const fetchFresh = async (category) => {
        const spec = DISCOVER_CATEGORIES[category];
        if (!spec) return [];
        const fresh = [];
        const now = Date.now();
        for (const sp of DISCOVER_SEARCH_SP) {
          if (fresh.length >= DISCOVER_MIN_VIDEOS) break;
          let list = [];
          const cacheKey = sp + "|" + spec.query;
          const cached = _discoverSearchCache.get(cacheKey);
          if (cached && now - cached.at < 600000) {
            list = cached.list;
          } else {
            try {
              list = await YourTubeEngine.dedup("discover:" + cacheKey, () => YourTubeSearch.search(spec.query, sp));
            } catch (_) {}
            if (Array.isArray(list) && list.length) {
              _discoverSearchCache.set(cacheKey, { at: now, list });
              if (_discoverSearchCache.size > 24) {
                const oldest = _discoverSearchCache.keys().next().value;
                _discoverSearchCache.delete(oldest);
              }
            }
          }
          fresh.push(...await filterUnwatched(list));
        }
        return fresh.slice(0, DISCOVER_MAX_VIDEOS);
      };
      const renderGrid = () => {
        if (!grid) return;
        grid.replaceChildren();
        for (const key of topicsForMode()) {
          const spec = DISCOVER_CATEGORIES[key];
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "ytb-ui-topic-btn" + (activeTopic === key ? " active" : "");
          btn.textContent = spec.label;
          btn.addEventListener("click", () => {
            if (activeTopic === key) { api.refresh(true); return; }
            activeTopic = key;
            load();
          });
          grid.appendChild(btn);
        }
      };
      function load() {
        if (!api) return;
        const key = activeTopic;
        if (!key) {
          api.status("Pick a topic above to browse fresh videos you haven't watched.");
          api.clear();
          return;
        }
        const spec = DISCOVER_CATEGORIES[key];
        renderGrid();
        api.clear();
        api.status("Loading " + spec.label + "…");
        fetchFresh(key).then(videos => {
          if (activeTopic !== key) return;
          api.clear();
          if (!videos.length) {
            api.status("Nothing fresh found for " + spec.label + ". Try another topic.");
            return;
          }
          videos.forEach(video => {

            if (sessionShown.size > 2000) sessionShown.clear();
            sessionShown.add(video.videoId);
            api.list.appendChild(YourTubeDiscovery.createVideoRow(
              video.videoId,
              video.title,
              video.channel,
              () => { e.location.href = "/watch?v=" + video.videoId; },
              null,
              true,
            ));
          });
          api.status("Showing " + videos.length + " never-watched picks from " + spec.label);
        }).catch(() => {
          if (activeTopic === key) { api.clear(); api.status("Search failed. Try again."); }
        });
      }
      api = host.addSection("discover", "Discover", load);
      api.button("Surprise me", "primary", () => {
        const candidates = Object.keys(DISCOVER_CATEGORIES).filter(k => k !== activeTopic);
        if (!candidates.length) return;
        activeTopic = candidates[Math.floor(Math.random() * candidates.length)];
        load();
      });

      const ensureUi = () => {
        if (grid || !api.body) return;
        const modeRow = document.createElement("div");
        modeRow.className = "ytb-ui-disco-mode";
        const nicheBtn = document.createElement("button");
        nicheBtn.type = "button";
        nicheBtn.className = "ytb-ui-mode-btn active";
        nicheBtn.textContent = "My niche";
        const outsideBtn = document.createElement("button");
        outsideBtn.type = "button";
        outsideBtn.className = "ytb-ui-mode-btn";
        outsideBtn.textContent = "Outside my niche";
        const setMode = (next) => {
          mode = next;
          nicheBtn.classList.toggle("active", next === "niche");
          outsideBtn.classList.toggle("active", next === "outside");
          activeTopic = null;
          renderGrid();
          load();
        };
        nicheBtn.addEventListener("click", () => setMode("niche"));
        outsideBtn.addEventListener("click", () => setMode("outside"));
        modeRow.append(nicheBtn, outsideBtn);
        grid = document.createElement("div");
        grid.className = "ytb-ui-disco-grid";
        api.body.prepend(grid);
        api.body.prepend(modeRow);
        renderGrid();
      };

      let _lastDiscoverRefresh = 0;
      ctx.onNav(() => {
        ensureUi();
        if (!activeTopic) return;
        if (Date.now() - _lastDiscoverRefresh < 300000) return;
        _lastDiscoverRefresh = Date.now();
        host.refresh("discover");
      });
      ctx.addTimeout(() => {
        ensureUi();
        load();
      }, 0);
      Yt["discover"].push(() => {
        // addSection() can return null/undefined if the host failed to build;
        // destroying unconditionally then throws (caught by ha(), but the
        // section DOM/pill then survives → leak bisect F8: +1 DOM residue).
        try {
          if (api) api.destroy();
        } catch (_) {}
        // Belt-and-suspenders: the reopen pill is only removed by removeSection
        // when the last section goes; make sure it can't linger either way.
        try {
          const rp = document.getElementById("ytb-disco-reopen");
          if (rp && rp.parentNode) rp.remove();
        } catch (_) {}
      });
    },
    settings(en) {
      en.appendChild(Io("Enable Discover", "discoverOn"));
      en.appendChild(To("div", "ytb-discover-note",
        "One toggle for discovery. Browse 8+ categories inside or outside your niche. Picks are filtered against your watch history while Session History is on, and never repeat within a session."));
    } });





  xa.register({ id: "curated-collections", name: "Collections", summary: "Organize saved videos into named collections.",
      cat: "insights", masterKey: "collectionsOn", keys: ["collectionsOn"],
    apply(ctx) {
      if (!S.collectionsOn) return;
      YourTubeEngine.injectCSS();
      const vid = ie.videoId();
      if (!vid) return;
      const panel = document.createElement("div");
      panel.id = "ytb-collections";
      panel.className = "ytb-ui-card";
      panel.style.cssText = "margin:8px 0";
      const rebuild = () => {
        const cols = YourTubeSession.collections.list();
        let html = '<div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:6px">Add to Collection</div><div class="ytb-ui-row" style="flex-wrap:wrap;gap:4px">';
        cols.forEach(c => {
          html += '<button class="ytb-ui-btn" data-col="' + ytbEscapeHtml(c.id) + '">' + ytbEscapeHtml(c.name) + ' (' + c.videos.length + ')</button>';
        });
        html += '<button class="ytb-ui-btn primary" id="ytb-col-new">+ New</button></div>';
        panel.innerHTML = Xy(html);
      };
      rebuild();
      const insert = () => {
        if (panel.parentNode) return true;
        const below = document.querySelector("#below") || document.querySelector("#description");
        if (!below) return false;
        below.appendChild(panel);
        return true;
      };
      YourTubeEngine.scheduleOnReady(ctx, insert, { attempts: 8, delayMs: 500 });
      panel.addEventListener("click", (ev) => {
        const btn = ev.target.closest("[data-col]");
        if (btn) {
          YourTubeSession.collections.addVideo(btn.dataset.col, { videoId: vid, title: ie.title() || vid });
          pe("Added to collection.", 1500, "success");
          rebuild();
        }
        if (ev.target.id === "ytb-col-new") {
          _ytInlinePrompt(ev.target, "Collection name", (name) => {
            YourTubeSession.collections.create(name);
            pe("Created: " + name, 1500, "success");
            rebuild();
          });
        }
      });
      Yt["curated-collections"].push(() => {
        if (panel.parentNode) panel.remove();
        document.querySelectorAll(".ytb-ui-inline-prompt").forEach((el) => el.remove());
      });
    },
    settings(en) {
      en.appendChild(Io("Enable Curated Collections", "collectionsOn"));
      const cols = YourTubeSession.collections.list();
      if (cols.length) {
        const list = document.createElement("div");
        list.style.cssText = "margin-top:6px;font-size:11px;color:#aaa";
        cols.forEach(c => {
          list.innerHTML += Xy('<div style="padding:2px 0">' + ytbEscapeHtml(c.name) + ' (' + c.videos.length + ' videos)</div>');
        });
        en.appendChild(list);
      }
    } });

  xa.register({
    id: "algo-intelligence",
    name: "Feed Intelligence",
    summary: "Locally hides feed cards matching your topic, keyword and channel filters. No account feedback is sent.",
    cat: "insights",
    masterKey: "algoIntelligenceOn",
    keys: ["algoIntelligenceOn", "algoAutoTrain", "algoBlockTopics", "algoBlockKeywords", "algoBlockChannels"],
    apply(ctx) {
      if (!S.algoIntelligenceOn) return;
      // Local watch signals are opt-in. No artificial reactions or training.
      if (S.algoAutoTrain) {
        AlgoEngine.startMonitoring();
        Yt["algo-intelligence"].push(() => AlgoEngine.stopMonitoring());
      }
      const words = value => String(value || "").split(/[,;\n]+/).map(x => x.trim().toLowerCase()).filter(Boolean);
      const topics = words(S.algoBlockTopics), keywords = words(S.algoBlockKeywords), channels = words(S.algoBlockChannels);
      if (!topics.length && !keywords.length && !channels.length) return;
      const selector = "ytd-rich-item-renderer,ytd-video-renderer,ytd-compact-video-renderer,ytd-grid-video-renderer,yt-lockup-view-model:not(ytd-rich-item-renderer *)";
      const owned = new Set();
      ctx.addStyle("[data-ytb-local-feed-block]{display:none!important}");
      const scan = () => {
        for (const node of document.querySelectorAll(selector)) {
          const title = (node.querySelector("#video-title,.ytLockupMetadataViewModelTitle,[id=video-title-link]")?.textContent || "").trim().toLowerCase();
          const channel = (node.querySelector("ytd-channel-name,#channel-name,.yt-lockup-metadata-view-model__metadata")?.textContent || "").trim().toLowerCase();
          const classes = topics.length ? AlgoEngine.ContentClassifier.classify({ title }) : {};
          const blocked = keywords.some(k => title.includes(k)) || channels.some(k => channel.includes(k)) || topics.some(k => Number(classes[k] || 0) > 25);
          if (blocked) { node.setAttribute("data-ytb-local-feed-block", ""); owned.add(node); }
          else if (owned.delete(node)) node.removeAttribute("data-ytb-local-feed-block");
        }
        for (const node of owned) if (!node.isConnected) owned.delete(node);
      };
      scan();
      if (document.body) ctx.addObserver(document.body, ctx.debounce(scan, 200), { childList: true, subtree: true, characterData: true });
      ctx.onNav(() => ctx.addTimeout(scan, 250));
      Yt["algo-intelligence"].push(() => { for (const node of owned) node.removeAttribute("data-ytb-local-feed-block"); owned.clear(); });
    },
    settings(en) {
      en.appendChild(Io("Enable local Feed Intelligence", "algoIntelligenceOn"));
      en.appendChild(Io("Use local watch signals", "algoAutoTrain"));
      en.appendChild(Ho("Hide topics (comma-separated)", "algoBlockTopics", "gaming, news"));
      en.appendChild(Ho("Hide title keywords (comma-separated)", "algoBlockKeywords", "drama, clickbait"));
      en.appendChild(Ho("Hide channels (comma-separated)", "algoBlockChannels", "channel name"));
      en.appendChild(To("div", "ytb-hist-note", "Filtering is local to this page. It does not send likes, dislikes, feedback, artificial watch events or searches to YouTube. Previously saved preferences are retained."));
    },
  });










  const YourTubePack = (() => {

    const elBinder = (cardId) => {
      const bind = (bound, ctx, ev, fn, opts) => {
        const el = ie.el();
        if (!el || bound.has(el)) return false;
        bound.add(el);
        ctx.addListener(el, ev, fn, opts);
        return true;
      };

      return (ctx, ev, fn, opts) => {
        // Each event binding (not each video) owns a seen-set. Multiple event
        // types registered through one binder must all attach to the same video.
        const bound = new WeakSet();
        bind(bound, ctx, ev, fn, opts);
        // The player element is replaced on miniplayer/theater changes, so keep
        // a rebind hook and a short-lived recovery ticker; the ticker is torn
        // down with the card so a disabled feature cannot rebind afterwards.
        ctx.onNav(() => bind(bound, ctx, ev, fn, opts));
        let attempts = 90;
        let disposed = false;
        const iv = YourTubeResources.SharedTicker.add(() => {
          if (disposed || bind(bound, ctx, ev, fn, opts) || --attempts <= 0) YourTubeResources.SharedTicker.remove(iv);
        }, 2000, { pauseHidden: true, label: "ytb-ui-elbinder" });
        if (cardId && Yt[cardId]) {
          Yt[cardId].push(() => { disposed = true; YourTubeResources.SharedTicker.remove(iv); });
        }
      };
    };
    const guardKey = (ev) => {
      const t = ev.target;
      const tag = t && t.tagName ? String(t.tagName).toUpperCase() : "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      return !!(t && t.isContentEditable);
    };
    const fmtTs = (sec) => {
      const s = Math.max(0, Math.floor(sec || 0));
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
      return (h ? h + ":" + String(m).padStart(2, "0") : String(m)) + ":" + String(ss).padStart(2, "0");
    };
        const exportHooks = [];
    const settingsExportHook = { push(f) { if (typeof f === 'function') exportHooks.push(f); }, fire() { for (const f of exportHooks) { try { f(); } catch (_) {} } } };
    return { elBinder, guardKey, fmtTs, settingsExportHook };
  })();

  xa.register({
    id: "silence-skipper", name: "Silence Skip",
    summary: "Fast-forwards through silent stretches at a configurable rate.",
      cat: "audio",
    masterKey: "silenceSkipOn", keys: ["silenceSkipOn", "silenceSkipRate"],
    apply(ctx) {
      if (!S.silenceSkipOn) return;
      YourTubeEngine.injectCSS();
      let boosted = false, prevRate = 1, quietMs = 0;
      const targetRate = () => Math.max(2, Math.min(8, Number(S.silenceSkipRate) || 4));
      const tick = () => {
        const vid = ie.el();
        if (!vid || vid.paused || vid.ended || _isLiveStream() || S.smartSpeedOn) {
          if (boosted && vid) { try { vid.playbackRate = prevRate; } catch (_) {} }
          boosted = false; quietMs = 0; return;
        }
        let reading = null;
        try { reading = YourTubePlayback.readEnergy(vid); } catch (_) {}

        if (!reading || !reading.active || !Number.isFinite(reading.energy)) {
          quietMs = 0;
          if (boosted) { try { vid.playbackRate = prevRate; } catch (_) {} boosted = false; }
        } else if (reading.energy < 4) quietMs += 500;
        else quietMs = 0;
        if (quietMs >= 1500 && !boosted) { try { prevRate = vid.playbackRate || 1; vid.playbackRate = targetRate(); boosted = true; } catch (_) {} }
        else if (reading && reading.energy >= 4 && boosted) { try { vid.playbackRate = prevRate; } catch (_) {} boosted = false; quietMs = 0; }
      };
      const id = YourTubeResources.SharedTicker.add(tick, 500, { pauseHidden: true, label: "ytb-ui-silence-skip" });
      Yt["silence-skipper"].push(() => {
        YourTubeResources.SharedTicker.remove(id);
        const vid = ie.el();
        if (boosted && vid) { try { vid.playbackRate = prevRate; } catch (_) {} }

        try { if (vid) YourTubePlayback.release(vid); } catch (_) {}
      });
    },
    settings(en) {
      en.appendChild(Io("Fast-forward silent stretches", "silenceSkipOn"));
      en.appendChild(Ro("Skip speed", "silenceSkipRate", { 2: "2× gentle", 4: "4× (recommended)", 6: "6× brisk", 8: "8× aggressive" }));
    },
  });

  xa.register({
    id: "chapter-auto-skip", name: "Chapter Auto-Skip",
    summary: "Skips chapters whose titles match intro/outro/sponsor or your word list.",
      cat: "playback",
    masterKey: "chapterAutoSkipOn", keys: ["chapterAutoSkipOn", "chapterSkipWords"],
    apply(ctx) {
      if (!S.chapterAutoSkipOn) return;
      const words = () => String(S.chapterSkipWords || "").split(/[,;\n]+/).map(w => w.trim().toLowerCase()).filter(Boolean);
      let chapters = null, chVid = "";
      const loadChapters = () => {
        try {
          const vid = ie.videoId(); if (!vid || vid === chVid) return;
          chapters = null;
          const pr = e.ytInitialPlayerResponse || {};

          if (!pr.videoDetails || pr.videoDetails.videoId !== vid) return;
          const bar = pr.playerOverlays && pr.playerOverlays.playerOverlayRenderer &&
            pr.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer;
          const map = bar && bar.decoratedPlayerBarRenderer && bar.decoratedPlayerBarRenderer.playerBar &&
            bar.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer;
          const entries = (() => {
            if (!map || !Array.isArray(map.markersMap)) return null;
            for (const mm of map.markersMap) {
              const v = mm && mm.value;
              if (v && Array.isArray(v.chapters) && v.chapters.length) return v;
            }
            const first = map.markersMap[0] && map.markersMap[0].value;
            return first || null;
          })();
          const list = entries && entries.chapters;
          if (!Array.isArray(list) || !list.length) return;
          chVid = vid;
          chapters = list.filter(c => c && c.chapterRenderer && c.chapterRenderer.title).map(c => ({
            t: (c.chapterRenderer && c.chapterRenderer.timeRangeStartMillis || 0) / 1000,
            title: (c.chapterRenderer && c.chapterRenderer.title && c.chapterRenderer.title.simpleText ||
              ((c.chapterRenderer.title.runs || []).map(r => r.text).join("")) || "").toLowerCase(),
          })).filter(c => c.title);
        } catch (_) { chapters = null; }
      };
      const binder = YourTubePack.elBinder("chapter-auto-skip");
      const check = () => {
        loadChapters();
        if (!chapters || !chapters.length) return;
        const vid = ie.el(); if (!vid || vid.paused || _isLiveStream()) return;
        const kw = words(); if (!kw.length) return;
        const t = vid.currentTime;
        for (const c of chapters) {
          if (Math.abs(t - c.t) < 1.5 && kw.some(w => c.title.includes(w))) {
            const idx = chapters.indexOf(c);
            const next = chapters[idx + 1];
            if (next) { vid.currentTime = next.t + 0.5; pe("YourTube skipped chapter: " + c.title.slice(0, 40), 1800, "info"); }
            break;
          }
        }
      };
      // timeupdate often arrives every 250 ms. A trailing 400 ms debounce
      // never fires during playback; a two-second poll can miss an intro.
      let lastCheck = -Infinity;
      binder(ctx, "timeupdate", () => {
        const now = performance.now();
        if (now - lastCheck < 120) return;
        lastCheck = now;
        check();
      });
      ctx.addInterval(check, 2000);
      // Chapter lists belong to one video; drop them on navigation so a stale
      // list cannot skip into the new video's timeline.
      ctx.onNav(() => { chapters = null; chVid = ""; });
      Yt["chapter-auto-skip"].push(() => { chapters = null; chVid = ""; });
    },
    settings(en) {
      en.appendChild(Io("Auto-skip matching chapters", "chapterAutoSkipOn"));
      en.appendChild(Ho("Skip keywords (comma-separated)", "chapterSkipWords", "intro, outro, sponsor, thanks"));
    },
  });

  xa.register({
    id: "video-bookmarks", name: "Timestamp Bookmarks",
    summary: "Bookmark moments with Alt+B; stored locally.",
      cat: "data",
    masterKey: "videoBookmarksOn", keys: ["videoBookmarksOn"],
    apply(ctx) {
      if (!S.videoBookmarksOn) return;
      YourTubeEngine.injectCSS();
      const marks = YourTubeEngine.createStore("__yourtube_bookmarks__", {});
      const cur = () => ie.videoId() || "";
      const pruneBookmarks = (d) => {
        const keys = Object.keys(d);
        if (keys.length <= 200) return;
        keys.sort((a, b) => {
          const la = d[a][d[a].length - 1], lb = d[b][d[b].length - 1];
          return ((lb && lb.at) || 0) - ((la && la.at) || 0);
        }).slice(200).forEach((k) => { delete d[k]; });
      };
      const add = async () => {
        const vid = cur(), el = ie.el(); if (!vid || !el) return;
        const row = { t: el.currentTime, note: "", at: Date.now() };
        marks.update(d => {
          const list = (d[vid] = d[vid] || []);
          list.push(row);
          if (list.length > 100) list.splice(0, list.length - 100);
          pruneBookmarks(d);
        });
        pe("Bookmark at " + YourTubePack.fmtTs(row.t), 1400, "success");
      };
      ctx.addListener(document, "keydown", (ev) => {
        if (ev.altKey && !ev.repeat && !ev.ctrlKey && !ev.metaKey && ev.code === "KeyB" && !YourTubePack.guardKey(ev)) {
          ev.preventDefault(); add();
        }
      });

      const panel = document.createElement("div");
      panel.id = "ytb-bm";
      panel.style.cssText = "display:none;margin:8px 0;font-size:12px;color:#eee";
      const render = () => {
        const vid = cur(); const list = marks.get()[vid] || [];
        panel.replaceChildren();
        const head = document.createElement("div");
        head.textContent = "Bookmarks (" + list.length + ") — Alt+B to add";
        head.style.cssText = "font-weight:600;margin-bottom:4px";
        panel.appendChild(head);
        list.forEach((row, i) => {
          const b = document.createElement("button");
          b.className = "ytb-ui-btn"; b.style.marginRight = "6px"; b.style.marginBottom = "4px";
          b.textContent = YourTubePack.fmtTs(row.t);
          b.addEventListener("click", () => { const el = ie.el(); if (el) el.currentTime = row.t; });
          panel.appendChild(b);
        });
        panel.style.display = list.length ? "block" : "none";
      };
      marks.onChange(render);
      YourTubeEngine.scheduleOnReady(ctx, () => {
        const below = document.querySelector("#below") || document.querySelector("#description");
        if (!below) return false;
        if (!panel.parentNode) below.appendChild(panel);
        render(); return true;
      }, { attempts: 8, delayMs: 500 });
      ctx.onNav(render);
      Yt["video-bookmarks"].push(() => { if (panel.parentNode) panel.remove(); });
    },
    settings(en) { en.appendChild(Io("Enable timestamp bookmarks (Alt+B)", "videoBookmarksOn")); },
  });

  xa.register({
    id: "timestamp-notes", name: "Timestamped Notes",
    summary: "Notes anchored to playhead positions (Alt+N).",
      cat: "data",
    masterKey: "timestampNotesOn", keys: ["timestampNotesOn"],
    apply(ctx) {
      if (!S.timestampNotesOn) return;
      YourTubeEngine.injectCSS();
      const notesStore = YourTubeEngine.createStore("__yourtube_notes__", {});
      let box = null;
      const cur = () => ie.videoId() || "";
      const pruneNotes = (d) => {
        const keys = Object.keys(d);
        if (keys.length <= 200) return;
        keys.sort((a, b) => {
          const la = d[a][d[a].length - 1], lb = d[b][d[b].length - 1];
          return ((lb && lb.at) || 0) - ((la && la.at) || 0);
        }).slice(200).forEach((k) => { delete d[k]; });
      };
      const capture = () => {
        const text = box && box.value.trim();
        if (!text) return;
        if (!cur()) return;
        const el = ie.el();
        const row = { t: el ? el.currentTime : 0, text, at: Date.now() };
        notesStore.update(d => {
          const list = (d[cur()] = d[cur()] || []);
          list.push(row);
          if (list.length > 100) list.splice(0, list.length - 100);
          pruneNotes(d);
        });
        if (box) box.value = "";
        pe("Note captured at " + YourTubePack.fmtTs(row.t), 1200, "success");
      };
      const build = () => {
        if (box || !document.body) return false;
        box = document.createElement("textarea");
        box.id = "ytb-notes";
        box.placeholder = "Quick note… (Ctrl+Enter to save)";
        box.style.cssText = "position:fixed;right:14px;bottom:52px;z-index:2147483639;width:260px;height:70px;" +
          "background:rgba(16,18,24,.95);color:#eee;border:1px solid rgba(255,255,255,.16);" +
          "border-radius:10px;padding:8px;font:12px system-ui;display:none;resize:vertical";
        box.addEventListener("keydown", (ev) => {
          if (ev.key === "Escape") { box.style.display = "none"; }
          if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") capture();
        });
        document.body.appendChild(box);
        return true;
      };
      ctx.addListener(document, "keydown", (ev) => {
        if (ev.altKey && !ev.repeat && !ev.ctrlKey && !ev.metaKey && ev.code === "KeyN" && !YourTubePack.guardKey(ev)) {
          ev.preventDefault();
          if (build()) box.style.display = box.style.display === "none" ? "block" : "none";
        }
      });
      ctx.onNav(() => { if (box) box.style.display = "none"; });

      YourTubeEngine.scheduleOnReady(ctx, () => !!document.body, { attempts: 1, delayMs: 50 });
      if (!YourTubePack.settingsExportHook._notesWired) { YourTubePack.settingsExportHook._notesWired = true; YourTubePack.settingsExportHook.push(async () => {
        const d = notesStore.get(); const lines = ["# YourTube notes", ""];
        for (const [vid, rows] of Object.entries(d)) {
          lines.push("## https://youtu.be/" + vid);
          for (const r of rows) lines.push("- `" + YourTubePack.fmtTs(r.t) + "` " + r.text.replace(/\n/g, " "));
          lines.push("");
        }
        const url = YourTubeResources.TrackedBlobURL.create(new Blob([lines.join("\n")], { type: "text/markdown" }), "ytb-notes-md");
        if (url) {
          const a = document.createElement("a"); a.href = url; a.download = "YourTube-notes.md"; a.click();
          setTimeout(() => YourTubeResources.TrackedBlobURL.revoke(url), 4000);
        }
      }); }
      Yt["timestamp-notes"].push(() => { if (box) { box.remove(); box = null; } });
    },
    settings(en) {
      en.appendChild(Io("Enable study notes (Alt+N)", "timestampNotesOn"));
      en.appendChild(Eo([Oo("Export notes as Markdown", () => { try { YourTubePack.settingsExportHook.fire(); } catch (_) {} })]));
    },
  });

  xa.register({
    id: "pause-auto-rewind", name: "Pause Rewind",
    summary: "Rewinds a few seconds each time you pause.",
      cat: "playback",
    masterKey: "pauseRewindOn", keys: ["pauseRewindOn", "pauseRewindSec"],
    apply(ctx) {
      if (!S.pauseRewindOn) return;
      const secs = () => Math.max(1, Math.min(30, Number(S.pauseRewindSec) || 3));
      const binder = YourTubePack.elBinder("pause-auto-rewind");
      binder(ctx, "pause", () => {
        const el = ie.el();
        if (!el || el.ended || _isLiveStream()) return;
        try { el.currentTime = Math.max(0, el.currentTime - secs()); } catch (_) {}
      });
    },
    settings(en) {
      en.appendChild(Io("Rewind slightly on every pause", "pauseRewindOn"));
      en.appendChild(No("Seconds back", "pauseRewindSec", 1, 30, 1, v => v + "s"));
    },
  });

  xa.register({
    id: "instant-replay", name: "Instant Replay",
    summary: "Alt+J replays the last N seconds.",
      cat: "playback",
    masterKey: "instantReplayOn", keys: ["instantReplayOn", "instantReplaySec"],
    apply(ctx) {
      if (!S.instantReplayOn) return;
      ctx.addListener(document, "keydown", (ev) => {
        if (ev.altKey && !ev.repeat && !ev.ctrlKey && !ev.metaKey && ev.code === "KeyJ" && !YourTubePack.guardKey(ev)) {
          ev.preventDefault();
          const el = ie.el(); if (!el) return;
          const back = Math.max(2, Math.min(60, Number(S.instantReplaySec) || 10));
          try { el.currentTime = Math.max(0, el.currentTime - back); } catch (_) {}
        }
      });
    },
    settings(en) {
      en.appendChild(Io("Enable instant replay (Alt+J)", "instantReplayOn"));
      en.appendChild(No("Replay length", "instantReplaySec", 2, 60, 1, v => v + "s"));
    },
  });











  xa.register({
    id: "feed-freshness", name: "Feed Freshness",
    summary: "Hides home-feed cards older than a set age.",
      cat: "feed",
    masterKey: "feedFreshnessOn", keys: ["feedFreshnessOn", "feedMaxAgeMonths"],
    apply(ctx) {
      if (!S.feedFreshnessOn) return;
      ctx.addStyle("[data-ytb-stale]{display:none!important}");
      const months = () => Math.max(1, Math.min(60, Number(S.feedMaxAgeMonths) || 6));
      const parseAgeDays = (text) => {
        const m = String(text || "").match(/(\d+)\s*(year|month|week|day|hour)/i);
        if (!m) return -1;
        const v = parseInt(m[1], 10) || 0;
        const f = { year: 365, month: 30, week: 7, day: 1, hour: 0.04 }[m[2].toLowerCase()];
        return v * f;
      };
      const scan = () => {
        if (location.pathname !== "/") return;
        document.querySelectorAll("ytd-rich-item-renderer ytd-video-meta-block #metadata-line, ytd-rich-item-renderer yt-content-metadata-view-model, ytd-rich-item-renderer #metadata-line").forEach((meta) => {
          const item = meta.closest("ytd-rich-item-renderer");
          if (!item) return;
          const age = parseAgeDays(meta.textContent);
          if (age < 0) return;
          const stale = age > months() * 30;
          if (stale && !item.dataset.ytbStale) {
            item.dataset.ytbStale = "1";
          } else if (!stale && item.dataset.ytbStale) {
            delete item.dataset.ytbStale;
          }
        });
      };
      ctx.addObserver(document.body, ctx.debounce(scan, 300), { childList: true, subtree: true });
      scan();
      ctx.addInterval(scan, 5000);
      ctx.onNav(scan);
      Yt["feed-freshness"].push(() => {
        document.querySelectorAll("[data-ytb-stale]").forEach((el) => { delete el.dataset.ytbStale; });
      });
    },
    settings(en) {
      en.appendChild(Io("Hide old uploads on the home feed", "feedFreshnessOn"));
      en.appendChild(No("Older than (months)", "feedMaxAgeMonths", 1, 60, 1, v => v + "mo"));
    },
  });

  xa.register({
    id: "channel-snooze", name: "Channel Snooze",
    summary: "Temporarily hides channels from your feeds for N days.",
      cat: "channels",
    masterKey: "channelSnoozeOn", keys: ["channelSnoozeOn", "channelSnoozeList"],
    apply(ctx) {
      if (!S.channelSnoozeOn) return;
      YourTubeEngine.injectCSS();
      const list = () => String(S.channelSnoozeList || "").split(/[,;\n]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
      const match = (nameText, entries) => {
        const nm = String(nameText || "").normalize("NFC").toLowerCase();
        return entries.some((c) => nm.includes(c));
      };
      const scan = () => {
        // Parse the snooze list once per pass, not once per card.
        const entries = list();
        document.querySelectorAll("ytd-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer").forEach((card) => {
          const owner = card.querySelector("ytd-channel-name a, #owner-name a, ytd-video-owner-renderer a, a[href^='/@'], a[href*='/channel/'], a[href*='/@']");
          if (!owner) return;
          const hit = match(owner.textContent, entries);
          if (hit && !card.dataset.ytbSnoozed) { card.dataset.ytbSnoozed = "1"; card.style.display = "none"; }
          else if (!hit && card.dataset.ytbSnoozed) { delete card.dataset.ytbSnoozed; if (!card.dataset.ytbStale) card.style.display = ""; }
        });
      };
      ctx.addObserver(document.body, ctx.debounce(scan, 350), { childList: true, subtree: true });
      ctx.onNav(scan);
      Yt["channel-snooze"].push(() => {
        document.querySelectorAll("[data-ytb-snoozed]").forEach((el) => { el.style.display = ""; delete el.dataset.ytbSnoozed; });
      });
    },
    settings(en) {
      en.appendChild(Io("Snooze channels I list", "channelSnoozeOn"));
      en.appendChild(Ho("Channels to snooze (comma-separated)", "channelSnoozeList", "example channel, another one"));
    },
  });



  xa.register({
    id: "playlist-watched-marker", name: "Playlist Watch-Marks",
    summary: "Dims playlist entries you've already watched.",
      cat: "channels",
    masterKey: "playlistWatchedMarkerOn", keys: ["playlistWatchedMarkerOn", "sessionRestoreOn"],
    apply(ctx) {
      if (!S.playlistWatchedMarkerOn) return;
      YourTubeEngine.injectCSS();
      const _markCache = new Map();
      ctx.onNav(() => { _markCache.clear(); });
      const scan = async () => {
        if (!location.pathname.startsWith("/playlist") && !location.search.includes("list=")) return;
        const rows = [...document.querySelectorAll("ytd-playlist-panel-video-renderer, ytd-playlist-video-renderer")].slice(0, 300);
        const ids = [];
        rows.forEach((r) => {
          const a = r.querySelector("a#wc-endpoint, a[href*='/watch']");
          const m = a && (a.getAttribute("href") || "").match(/[?&]v=([A-Za-z0-9_-]{11})/);
          ids.push(m ? m[1] : null);
        });
        const lookup = (id) => {
          if (!id) return Promise.resolve(false);
          if (_markCache.has(id)) return Promise.resolve(_markCache.get(id));
          return v("history", id).then((row) => { const has = !!row; _markCache.set(id, has); return has; }).catch(() => false);
        };
        // Chunk the lookups so a long playlist cannot open hundreds of
        // IndexedDB requests in one burst.
        const flags = [];
        for (let i = 0; i < ids.length; i += 12) {
          flags.push(...await Promise.all(ids.slice(i, i + 12).map(lookup)));
        }
        rows.forEach((r, i) => {
          const title = r.querySelector("#video-title") || r;
          if (flags[i]) {
            title.style.opacity = ".45";
            if (!title.dataset.ytbWatched) {
              title.dataset.ytbWatched = "1";
              title.setAttribute("title", (title.getAttribute("title") || "") + " ✓ watched");
            }
          } else {
            title.style.opacity = "";
            delete title.dataset.ytbWatched;
          }
        });
      };
      ctx.addObserver(document.body, ctx.debounce(scan, 400), { childList: true, subtree: true });
      ctx.onNav(() => ctx.addTimeout(scan, 800));
      Yt["playlist-watched-marker"].push(() => {
        document.querySelectorAll("[data-ytb-watched]").forEach((t) => {
          t.style.opacity = "";
          const title = t.getAttribute("title") || "";
          if (title.indexOf(" ✓ watched") !== -1) t.setAttribute("title", title.replace(/ ?✓ watched/g, ""));
          delete t.dataset.ytbWatched;
        });
      });
    },
    settings(en) {
      en.appendChild(Io("Mark watched entries in playlists", "playlistWatchedMarkerOn"));
      en.appendChild(To("div", "ytb-hist-note", "Uses the local history store, so it needs Session History (and watched entries) to be recorded."));
    },
  });

  xa.register({
    id: "comment-filter", name: "Comment Keyword Filter",
    summary: "Hides comments matching your keyword list.",
      cat: "comments",
    masterKey: "commentFilterOn", keys: ["commentFilterOn", "commentBlockWords"],
    apply(ctx) {
      if (!S.commentFilterOn) return;
      YourTubeEngine.injectCSS();
      const words = () => String(S.commentBlockWords || "").split(/[,;\n]+/).map(w => w.trim().toLowerCase()).filter(Boolean);
      const scan = () => {
        const kw = words(); if (!kw.length) return;
        document.querySelectorAll("ytd-comment-thread-renderer").forEach((thread) => {
          const body = thread.querySelector("#content-text");
          if (!body) return;
          const hit = kw.some((k) => body.textContent.toLowerCase().includes(k));
          if (hit && !thread.dataset.ytbCf) { thread.dataset.ytbCf = "1"; thread.style.display = "none"; }
          else if (!hit && thread.dataset.ytbCf) {
            delete thread.dataset.ytbCf;
            if (!thread.dataset.ytbCs) thread.style.display = "";
          }
        });
      };
      ctx.addObserver(document.body, ctx.debounce(scan, 400), { childList: true, subtree: true });
      ctx.onNav(() => ctx.addTimeout(scan, 900));
      Yt["comment-filter"].push(() => {
        document.querySelectorAll("[data-ytb-cf]").forEach((el) => {
          delete el.dataset.ytbCf;
          if (!el.dataset.ytbCs) el.style.display = "";
        });
      });
    },
    settings(en) {
      en.appendChild(Io("Filter comments by keywords", "commentFilterOn"));
      en.appendChild(Ho("Hide comments containing", "commentBlockWords", "first, giveaway, subscribe"));
    },
  });



  xa.register({
    id: "copy-link-cleaner", name: "Copy Link Cleaner",
    summary: "Removes tracking parameters from copied URLs.",
      cat: "privacy",
    masterKey: "copyLinkCleanerOn", keys: ["copyLinkCleanerOn"],
    apply(ctx) {
      if (!S.copyLinkCleanerOn) return;
      const clean = (urlText) => {
        try {
          const u = new URL(urlText);
          if (!/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(u.hostname)) return null;
          const junk = ["si", "feature", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
          let touched = false;
          junk.forEach((k) => { if (u.searchParams.has(k)) { u.searchParams.delete(k); touched = true; } });
          return touched ? u.toString() : null;
        } catch (_) { return null; }
      };
      ctx.addListener(document.body, "copy", (ev) => {
        try {
          const data = ev.clipboardData;
          if (!data) return;
          const selected = window.getSelection();
          const txt = data.getData("text/plain") || (selected && selected.toString());
          if (!txt) return;
          const cleaned = clean(txt.trim());
          if (cleaned && cleaned !== txt.trim()) {
            ev.clipboardData.setData("text/plain", cleaned);
            ev.preventDefault();
            pe("Link cleaned before copying.", 1200, "info");
          }
        } catch (_) {}
      }, true);
    },
    settings(en) { en.appendChild(Io("Strip tracking params on copy", "copyLinkCleanerOn")); },
  });

  xa.register({
    id: "night-scheduler", name: "Theme Scheduler",
    summary: "Choose clock or system color scheme, with a manual override policy.",
    cat: "appearance", masterKey: "nightSchedulerOn",
    keys: ["nightSchedulerOn", "nightStart", "nightEnd", "nightSchedulerMode", "nightOverridePolicy"],
    apply(ctx) {
      if (!S.nightSchedulerOn) return;
      const app = document.querySelector("ytd-app"), root = document.documentElement;
      if (!app || !root) return;
      const media = window.matchMedia?.("(prefers-color-scheme: dark)");
      const originals = [root.hasAttribute("dark"), app.hasAttribute("dark")];
      let lastDesired = null, lastApplied = null, paused = false, wrote = false;
      const desired = () => {
        if (S.nightSchedulerMode === "system") return media ? media.matches : null;
        if (YourTubeResources.TimeWindow.parseHHMM(S.nightStart) === null ||
            YourTubeResources.TimeWindow.parseHHMM(S.nightEnd) === null) return null;
        return YourTubeResources.TimeWindow.containsHHMM(S.nightStart, S.nightEnd);
      };
      const enforce = () => {
        const next = desired();
        if (next === null) return;
        if (lastDesired !== null && next !== lastDesired && S.nightOverridePolicy !== "until-resume") paused = false;
        lastDesired = next;
        if (paused) return;
        const nodes = [root, app];
        nodes.forEach(node => {
          if (node.hasAttribute("dark") !== next) { node.toggleAttribute("dark", next); wrote = true; }
        });
        lastApplied = next;
      };
      const detectManual = () => {
        if (lastApplied === null) return;
        if (root.hasAttribute("dark") !== lastApplied || app.hasAttribute("dark") !== lastApplied) paused = true;
      };
      ctx.addObserver(root, detectManual, {attributes:true, attributeFilter:["dark"]});
      ctx.addObserver(app, detectManual, {attributes:true, attributeFilter:["dark"]});
      if (media && S.nightSchedulerMode === "system") ctx.addListener(media, "change", enforce);
      if (S.nightSchedulerMode !== "system") ctx.addInterval(enforce, 60000);
      ctx.onNav(() => ctx.addTimeout(enforce, 100));
      enforce();
      Yt["night-scheduler"].push(() => {
        if (!wrote || paused || lastApplied === null) return;
        [root, app].forEach((node, i) => {
          if (node.hasAttribute("dark") === lastApplied) node.toggleAttribute("dark", originals[i]);
        });
      });
    },
    settings(en) {
      en.appendChild(Io("Enable automatic dark/light mode", "nightSchedulerOn"));
      en.appendChild(Ro("Automatic source", "nightSchedulerMode", { clock: "Time schedule", system: "Browser color scheme" }));
      en.appendChild(Ro("After a manual YouTube theme change", "nightOverridePolicy", { "until-change": "Manual until next automatic change", "until-resume": "Manual until I resume automation" }));
      en.appendChild(_o("Dark from (HH:MM)", "nightStart"));
      en.appendChild(_o("Light from (HH:MM)", "nightEnd"));
      en.appendChild(Oo("Resume automatic theme", () => { if (S.nightSchedulerOn) xa.apply("night-scheduler"); }));
      en.appendChild(To("div", "ytb-hist-note", "Browser mode follows your browser color scheme. In clock mode, times use your local clock. A manual choice can pause automation; use Resume to apply it again."));
    },
  });

  xa.register({
    id: "text-scale", name: "Text Scale",
    summary: "Adjusts text size for descriptions and comments; site-wide or scoped.",
      cat: "appearance",
    masterKey: "textScaleOn", keys: ["textScaleOn", "textScalePct", "textScaleScope"],
    apply(ctx) {
      if (!S.textScaleOn) return;
      const pct = Math.max(100, Math.min(180, Number(S.textScalePct) || 115));
      const watchOnly = S.textScaleScope === "watch";
      const scope = watchOnly ? "ytd-watch-flexy " : "";
      const css = scope + "#description-inline-expander, " + scope + "ytd-text-inline-expander, " + scope + "#description {" +
        "font-size:" + pct + "% !important;line-height:1.5 !important}" +
        scope + "ytd-comment-view-model #content-text, " + scope + "ytd-comment-thread-renderer #content-text {" +
        "font-size:" + pct + "% !important}";
      const undo = YourTubeResources.Dom.css(css, "ytb-ui-textscale");
      Yt["text-scale"].push(undo);
    },
    settings(en) {
      en.appendChild(Io("Bigger reading text", "textScaleOn"));
      en.appendChild(No("Size", "textScalePct", 100, 180, 5, v => v + "%"));
      en.appendChild(Ro("Apply to", "textScaleScope", {
        site: "Everywhere",
        watch: "Watch page only",
      }));
      const preview = To("div", "ytb-text-scale-preview", "Preview: This is how descriptions and comments will read.");
      preview.style.cssText = "margin-top:8px;padding:10px;border:1px solid var(--yt-spec-10-percent-layer, #ccc);border-radius:8px;line-height:1.5";
      const updatePreview = () => { preview.style.fontSize = Math.max(100, Math.min(180, Number(S.textScalePct) || 115)) + "%"; };
      updatePreview();
      So("cfg.changed", ({key}) => { if (key === "textScalePct") updatePreview(); });
      en.appendChild(preview);
    },
  });





  xa.register({
    id: "frame-stepper", name: "Frame Stepper",
    summary: "Frame-accurate stepping via buttons or Alt+, / Alt+..",
      cat: "playback",
    masterKey: "frameStepperOn", keys: ["frameStepperOn", "frameFps"],
    apply(ctx) {
      if (!S.frameStepperOn) return;
      YourTubeEngine.injectCSS();
      const fps = () => Math.max(12, Math.min(120, Number(S.frameFps) || 30));
      const step = (dir) => {
        const el = ie.el(); if (!el) return;
        try { el.pause(); el.currentTime += dir / fps(); } catch (_) {}
      };
      ctx.addListener(document, "keydown", (ev) => {
        if (!ev.altKey || ev.shiftKey || ev.ctrlKey || ev.metaKey || YourTubePack.guardKey(ev)) return;
        if (ev.code === "Comma") { ev.preventDefault(); step(-1); }
        if (ev.code === "Period") { ev.preventDefault(); step(1); }
      });
      YourTubeEngine.scheduleOnReady(ctx, () => {
        const bar = document.querySelector(".ytp-right-controls");
        if (!bar) return false;
        if (bar.querySelector("#ytb-frameback")) return true;
        const mk = (id, label, dir) => {
          const b = document.createElement("button");
          b.id = id; b.className = "ytp-button"; b.title = label; b.textContent = dir < 0 ? "‹·" : "·›";
          b.addEventListener("click", (ev) => { ev.stopPropagation(); step(dir); });
          bar.prepend(b);
          return b;
        };
        mk("ytb-frameback", "Back one frame (Alt+,)", -1);
        mk("ytb-framefwd", "Forward one frame (Alt+.)", 1);
        return true;
      }, { attempts: 8, delayMs: 500 });
      Yt["frame-stepper"].push(() => {
        ["ytb-frameback", "ytb-framefwd"].forEach((id) => {
          const b = document.getElementById(id); if (b) b.remove();
        });
      });
    },
    settings(en) {
      en.appendChild(Io("Enable frame stepping", "frameStepperOn"));
      en.appendChild(No("Assumed FPS", "frameFps", 12, 120, 1, v => v + " fps"));
    },
  });

  xa.register({
    id: "playlist-resume", name: "Playlist Resume",
    summary: "Reopens playlists at the position you stopped.",
      cat: "playback",
    masterKey: "playlistResumeOn", keys: ["playlistResumeOn"],
    apply(ctx) {
      if (!S.playlistResumeOn) return;
      YourTubeEngine.injectCSS();
      const store = YourTubeEngine.createStore("__yourtube_pl_resume__", {});
      const plId = () => { try { return new URL(location.href).searchParams.get("list"); } catch (_) { return null; } };
      let saveTick = 0;
      const binder = YourTubePack.elBinder("playlist-resume");
      binder(ctx, "timeupdate", () => {
        const p = plId(), el = ie.el();
        if (!p || !el || !Number.isFinite(el.currentTime)) return;
        const now = Date.now();
        if (now - saveTick < 5000) return;
        saveTick = now;
        let idx = null;
        try {
          const api = ie.api();
          idx = api && typeof api.getPlaylistIndex === "function" ? api.getPlaylistIndex() : null;
        } catch (_) {}
        store.update(d => { d[p] = { v: ie.videoId(), i: idx, t: el.currentTime, at: now };
          const keys = Object.keys(d);
          if (keys.length > 200) keys.sort((x, y) => (d[x].at || 0) - (d[y].at || 0)).slice(0, keys.length - 200).forEach(k2 => delete d[k2]);
        });
      });
      const offer = () => {
        const p = plId(); if (!p) return;
        const rec = store.get()[p];
        if (!rec || !rec.v || rec.t < 15) return;
        const curVid = ie.videoId();
        if (curVid === rec.v) return;
        const toastHost = document.getElementById("ytb-plresume") || document.createElement("button");
        toastHost.id = "ytb-plresume";
        toastHost.className = "ytb-ui-btn primary";
        toastHost.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:52px;z-index:2147483636;padding:8px 16px";
        toastHost.textContent = "↩ Resume this playlist at " + YourTubePack.fmtTs(rec.t);
        toastHost.onclick = () => {
          try { e.location.href = "/watch?v=" + rec.v + "&list=" + p + (rec.i != null ? "&index=" + (rec.i + 1) : "") + "&t=" + Math.floor(rec.t); } catch (_) {}
          toastHost.remove();
        };
        if (!toastHost.parentNode) document.body.appendChild(toastHost);
        setTimeout(() => { if (toastHost.parentNode) toastHost.remove(); }, 12000);
      };
      ctx.onNav(() => ctx.addTimeout(offer, 1200));
      Yt["playlist-resume"].push(() => {
        const b = document.getElementById("ytb-plresume"); if (b) b.remove();
      });
    },
    settings(en) { en.appendChild(Io("Offer playlist resume points", "playlistResumeOn")); },
  });



  xa.register({
    id: "quick-collection-send", name: "Save to Collection",
    summary: "One-click save of the current video into a collection.",
      cat: "channels",
    masterKey: "quickCollectionSendOn", keys: ["quickCollectionSendOn"],
    apply(ctx) {
      if (!S.quickCollectionSendOn) return;
      YourTubeEngine.injectCSS();
      const mount = () => {
        const below = document.querySelector("#below #owner, #below ytd-watch-metadata #actions");
        if (!below || below.querySelector(".ytb-ui-qsend")) return !!below;
        const wrap = document.createElement("div");
        wrap.className = "ytb-ui-qsend";
        wrap.style.cssText = "margin:8px 0;display:inline-flex;gap:6px;align-items:center";
        const btn = document.createElement("button");
        btn.className = "ytb-ui-btn"; btn.textContent = "▤ Save to…";
        const sel = document.createElement("select");
        sel.style.cssText = "display:none;background:#16181f;color:#eee;border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:4px 8px;font-size:12px";
        const fill = () => {
          sel.replaceChildren();
          const cols = YourTubeSession.collections.list();
          if (!cols.length) { const o = document.createElement("option"); o.textContent = "(no collections yet)"; sel.appendChild(o); return; }
          cols.forEach((c) => { const o = document.createElement("option"); o.value = c.id; o.textContent = c.name + " (" + c.videos.length + ")"; sel.appendChild(o); });
        };
        btn.addEventListener("click", () => { fill(); sel.style.display = sel.style.display === "none" ? "inline-block" : "none"; });
        sel.addEventListener("change", () => {
          const vid = ie.videoId(); if (!vid || !sel.value) return;
          YourTubeSession.collections.addVideo(sel.value, { videoId: vid, title: ie.title() || vid });
          pe("Saved to collection.", 1500, "success");
          sel.style.display = "none";
        });
        wrap.append(btn, sel);
        below.appendChild(wrap);
        return true;
      };
      YourTubeEngine.scheduleOnReady(ctx, mount, { attempts: 10, delayMs: 500 });
      Yt["quick-collection-send"].push(() => {
        document.querySelectorAll(".ytb-ui-qsend").forEach((w) => w.remove());
      });
    },
    settings(en) { en.appendChild(Io("Show quick-save under the player", "quickCollectionSendOn")); },
  });





  const aioEnroll = (master, members) => {
    const flag = master + "Enrolled";
    const listKey = master + "EnrolledMembers";
    if (S[master]) {
      if (S[flag]) return;
      const flipped = [];
      for (const k of members) { if (!S[k]) { Ta(k, true); flipped.push(k); } }
      // Record exactly which members this enrolment switched on (1.3.0). The
      // previous version only kept the "Enrolled" marker, so turning the
      // master off left six enrolled features running that the user never
      // chose individually — the +1..3 timers/observers/DOM residue the leak
      // bisect kept attributing to the aio-* cards.
      Ta(listKey, flipped.join(","));
      Ta(flag, true);
    } else if (S[flag]) {
      Ta(flag, false);
      // Master OFF un-enrols precisely the members the enrolment enabled, and
      // only if they are still on: anything the user had set by hand (not in
      // the recorded list, or turned back on after enrolment) is untouched.
      const flipped = String(S[listKey] || "").split(",").filter(Boolean);
      for (const k of flipped) if (S[k]) Ta(k, false);
      Ta(listKey, "");
    }
  };
  const _playerTools = ["videoNotesOn", "channelNotesOn", "chapterButtonsOn", "chapterHotkeysOn"];
  xa.register({
    id: "aio-player-tools", name: "Bundle: Player Tools",
    summary: "Group switch for the player-bar extras; members stay individually toggleable; OFF removes only what it enabled.",
      cat: "bundles",
    masterKey: "aioPlayerToolsOn",
    settingsAlways: !0,
    keys: ["aioPlayerToolsOn", "aioPlayerToolsOnEnrolled", ..._playerTools],
    apply() { aioEnroll("aioPlayerToolsOn", _playerTools); },
    settings(en) {
      en.appendChild(Io("Turn on every player tool", "aioPlayerToolsOn"));
    },
  });




  const _feed = ["hideRecs", "hideLiveContentOn", "hidePremieresOn", "hideTopLiveGamesOn", "hideAutoDubbedOn"];
  xa.register({
    id: "aio-feed-cleanup", name: "Bundle: Feed Cleanup",
    summary: "Group switch: hide recommendations, live streams, premieres and dubbed cards.",
      cat: "bundles",
    masterKey: "aioFeedCleanupOn",
    settingsAlways: !0,
    keys: ["aioFeedCleanupOn", "aioFeedCleanupOnEnrolled", ..._feed, "hideAutoDubbedPreferOriginal"],
    apply() { aioEnroll("aioFeedCleanupOn", _feed); },
    settings(en) {
      en.appendChild(Io("Hide extra feed shelves and live noise", "aioFeedCleanupOn"));
    },
  });

  const _dense = ["compactUI", "denseVideoGridOn", "compactPlaylistOn", "playlistAutoscrollOn", "themeCompactOn"];
  xa.register({
    id: "aio-compact-dense", name: "Bundle: Compact Layout",
    summary: "Group switch: compact UI, dense grid, compact playlists.",
      cat: "bundles",
    masterKey: "aioCompactDenseOn",
    settingsAlways: !0,
    keys: ["aioCompactDenseOn", "aioCompactDenseOnEnrolled", ..._dense],
    apply() { aioEnroll("aioCompactDenseOn", _dense); },
    settings(en) {
      en.appendChild(Io("Turn on all compact/density options", "aioCompactDenseOn"));
      en.appendChild(Io("Tighter theme spacing", "themeCompactOn"));
    },
  });

  const _privacy = ["privacyShieldOn", "removeRedirectUrlsOn", "shortenShareUrlOn", "blockYTAIOn"];
  xa.register({
    id: "aio-privacy-shield", name: "Bundle: Privacy Shield",
    summary: "Group switch: redirect bypass, short shares, AI hiding.",
      cat: "bundles",
    masterKey: "aioPrivacyShieldOn",
    settingsAlways: !0,
    keys: ["aioPrivacyShieldOn", "aioPrivacyShieldOnEnrolled", ..._privacy],
    apply() { aioEnroll("aioPrivacyShieldOn", _privacy); },
    settings(en) {
      en.appendChild(Io("Enable core privacy protections", "aioPrivacyShieldOn"));
      en.appendChild(Io("Privacy shield", "privacyShieldOn"));
    },
  });



  // ---------------------------------------------------------------------------
  // Feed hygiene
  // ---------------------------------------------------------------------------

  // Card metadata parsing shared by the feed cards below. YouTube renders counts
  // in abbreviated form ("1.2K views", "3 weeks ago"), so these parsers accept
  // both the legacy metadata line and the 2026 metadata view model.
  const _ytCardMeta = (() => {
    const CARDS = "ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer";
    const META = "#metadata-line, yt-content-metadata-view-model, .ytContentMetadataViewModelMetadataRow";
    const views = (text) => {
      const line = String(text || "").trim().replace(/^[•·]\s*/, "");
      // Old: “1.2M views • 3 years ago”. Compact English search cards:
      // “1.2M\n3y ago”. Only accept an unlabelled count in that metadata slot;
      // durations, “276 watching”, and the age by itself are not view counts.
      const match = /([\d.,]+)\s*([KMB])?\s*views?\b/i.exec(line) ||
        /^([\d,]+(?:\.\d+)?)\s*([KMB])?(?=\s*$|\s*[•·]\s*|\s+(?:(?:streamed|premiered)\s+)?\d+\s*[a-z]+\s+ago\b)/i.exec(line);
      if (!match) return -1;
      const value = Number(match[1].replace(/,/g, ""));
      return Number.isFinite(value) ? value * ({ K: 1e3, M: 1e6, B: 1e9 }[(match[2] || "").toUpperCase()] || 1) : -1;
    };
    const ageDays = (text) => {
      const match = /(\d+)\s*(years?|months?|weeks?|days?|hours?|minutes?|seconds?|mo|yr|[ywdhms])\s+ago\b/i.exec(String(text || ""));
      if (!match) return -1;
      const unit = match[2].toLowerCase();
      const scale = unit[0] === "y" ? 365 : unit.startsWith("mo") ? 30 :
        unit[0] === "w" ? 7 : unit[0] === "d" ? 1 : unit[0] === "h" ? 1/24 : unit[0] === "m" ? 1/1440 : 1/86400;
      return Number(match[1]) * scale;
    };
    const formatCount = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(Math.round(n)));
    const durationSec = (row) => {
      const badge = row.querySelector("ytd-thumbnail-overlay-time-status-renderer span, #time-status span");
      const text = ((badge && badge.textContent) || "").trim();
      const parts = text.split(":").map((n) => parseInt(n, 10));
      if (!parts.length || parts.some((n) => !Number.isFinite(n))) return 0;
      return parts.reduce((total, value) => total * 60 + value, 0);
    };
    const videoIdOf = (node) => {
      try {
        const link = node.querySelector("a[href*='/watch?v='], a[href*='&v='], a[href*='/shorts/']");
        if (!link) return "";
        const href = link.getAttribute("href") || "";
        const match = /[?&]v=([A-Za-z0-9_-]{11})/.exec(href) || /\/shorts\/([A-Za-z0-9_-]{11})/.exec(href);
        return match ? match[1] : "";
      } catch (_) { return ""; }
    };
    return { CARDS, META, views, ageDays, formatCount, durationSec, videoIdOf };
  })();

  // Non-blocking replacement for window.prompt: a one-field popover anchored to
  // the control that opened it.
  const _ytInlinePrompt = (anchor, placeholder, onSubmit) => {
    try {
      const existing = document.querySelector(".ytb-ui-inline-prompt");
      if (existing) { existing.remove(); if (existing._ytbAnchor === anchor) return; }
      const panel = To("div", "ytb-ui-inline-prompt");
      panel._ytbAnchor = anchor;
      panel.style.cssText = "position:fixed;z-index:2147483646;background:rgba(18,20,26,.98);border:1px solid rgba(255,255,255,.16);" +
        "border-radius:10px;padding:8px;display:flex;gap:6px;align-items:center;font:12px system-ui;box-shadow:0 8px 24px rgba(0,0,0,.4)";
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = placeholder || "Name";
      input.className = "ytb-inp";
      input.style.minWidth = "150px";
      const onOutside = (ev) => {
        if (panel.contains(ev.target)) return;
        close();
      };
      const close = () => {
        panel.remove();
        document.removeEventListener("pointerdown", onOutside, true);
      };
      const ok = Oo("OK", () => {
        const value = input.value.trim();
        close();
        if (value) onSubmit(value);
      });
      panel.appendChild(input);
      panel.appendChild(ok);
      const rect = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : { bottom: 80, left: 80 };
      panel.style.top = Math.max(8, Math.min(window.innerHeight - 60, rect.bottom + 6)) + "px";
      panel.style.left = Math.max(8, Math.min(window.innerWidth - 240, rect.left || 8)) + "px";
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") { ev.preventDefault(); ok.click(); }
        else if (ev.key === "Escape") close();
      });
      document.body.appendChild(panel);
      setTimeout(() => { document.addEventListener("pointerdown", onOutside, true); input.focus(); }, 0);
    } catch (_) {}
  };

  // Remembers the videos whose cards have been rendered in feeds, sidebars and
  // search results, then hides the ones seen before. The grace period keeps the
  // current scroll position stable: a card is only hidden on a later visit, not
  // while you are looking at it.


  // Hides cards whose view count is below the threshold. Cards without a view
  // count (live, upcoming, some shorts) are left alone.
  xa.register({
    id: "hide-low-views", name: "Low-View Filter",
    summary: "Hides cards below a view-count threshold.",
      cat: "feed",
    masterKey: "hideLowViewsOn", keys: ["hideLowViewsOn", "lowViewThreshold"],
    apply(ctx) {
      if (!S.hideLowViewsOn) return;
      const CARD_SELECTOR = _ytCardMeta.CARDS;
      const META_SELECTOR = _ytCardMeta.META;
      const threshold = () => Math.max(0, Math.min(100000, Number.isFinite(+S.lowViewThreshold) ? +S.lowViewThreshold : 1000));
      ctx.addStyle("[data-ytb-low-view]{display:none!important}");
      const scan = () => {
        const limit = threshold();
        document.querySelectorAll(CARD_SELECTOR).forEach((card) => {
          const meta = card.querySelector(META_SELECTOR);
          const views = meta ? _ytCardMeta.views(meta.textContent) : -1;
          // Recycled, live or pending cards must lose our hide marker. Don't
          // overwrite the page's inline display or other cards' visibility.
          card.toggleAttribute("data-ytb-low-view", views >= 0 && views < limit);
        });
      };
      scan();
      ctx.addObserver(document.body, ctx.debounce(scan, 400), { childList: true, subtree: true });
      ctx.addInterval(scan, 6000);
      ctx.onNav(() => ctx.addTimeout(scan, 800));
      Yt["hide-low-views"].push(() => {
        document.querySelectorAll("[data-ytb-low-view]").forEach((el) => {
          delete el.dataset.ytbLowView;
        });
      });
    },
    settings(en) {
      en.appendChild(Io("Hide low-view videos", "hideLowViewsOn"));
      en.appendChild(No("Minimum views", "lowViewThreshold", 0, 100000, 500, (v) => (v >= 1000 ? Math.round(v / 1000) + "K" : String(v))));
      en.appendChild(To("div", "ytb-hist-note",
        "Counts are read from the card's own metadata, so abbreviated values (1.2K views) are approximate."));
    },
  });

  // Adds upload age and view velocity to card metadata. The credibility layer
  // already reports channel reach; this reports how fast a video is being
  // watched, which is the useful signal when a feed is full of old uploads.


  // Removes the filler sections YouTube injects into search results. Matching is
  // by element first, with an English text fallback for sections that have no
  // stable id of their own.


  xa.register({
    id: "hide-community-posts", name: "Hide Community Posts",
    summary: "Removes community posts and polls from feeds and shelves.",
      cat: "feed",
    masterKey: "hideCommunityPostsOn", keys: ["hideCommunityPostsOn"],
    apply(ctx) {
      S.hideCommunityPostsOn && ctx.addStyle(
        "ytd-post-renderer, ytd-backstage-post-thread-renderer, ytd-shared-post-renderer, " +
        "ytd-rich-item-renderer:has(ytd-post-renderer), " +
        "ytd-rich-section-renderer:has(ytd-post-renderer), " +
        "ytd-rich-section-renderer:has(ytd-backstage-post-thread-renderer), " +
        "ytd-rich-item-renderer:has(ytd-backstage-post-thread-renderer){display:none!important}",
      );
    },
    settings(en) { en.appendChild(Io("Hide community posts", "hideCommunityPostsOn")); },
  });

  xa.register({
    id: "hide-mixes", name: "Hide Mixes",
    summary: "Removes auto-generated Mix/Radio playlists everywhere.",
      cat: "feed",
    masterKey: "hideMixesOn", keys: ["hideMixesOn"],
    apply(ctx) {
      S.hideMixesOn && ctx.addStyle(
        "ytd-compact-radio-renderer, ytd-radio-renderer, ytd-rich-section-renderer:has(ytd-radio-renderer), " +
        "ytd-rich-item-renderer:has(ytd-radio-renderer), " +
        "ytd-playlist-renderer:has(a[href*='start_radio=1']), " +
        "ytd-compact-playlist-renderer:has(a[href*='start_radio=1']), " +
        "ytd-rich-item-renderer:has(a[href*='start_radio=1']){display:none!important}",
      );
    },
    settings(en) { en.appendChild(Io("Hide mixes and radios", "hideMixesOn")); },
  });

  // ---------------------------------------------------------------------------
  // Player chrome
  // ---------------------------------------------------------------------------

  xa.register({
    id: "player-gradient", name: "Remove Player Gradient",
    summary: "Removes the vignette shading over the player edges.",
      cat: "playback",
    masterKey: "hidePlayerGradientOn", keys: ["hidePlayerGradientOn"],
    apply(ctx) {
      S.hidePlayerGradientOn && ctx.addStyle(
        ".ytp-gradient-top, .ytp-gradient-bottom{display:none!important}",
      );
    },
    settings(en) {
      en.appendChild(Io("Remove the player gradient", "hidePlayerGradientOn"));
      en.appendChild(To("div", "ytb-hist-note",
        "Without the fade, player controls can be hard to read over bright footage."));
    },
  });

  xa.register({
    id: "hide-upnext", name: "Hide Up-Next Wall",
    summary: "Removes the autoplay countdown and end-screen video wall.",
      cat: "feed",
    masterKey: "hideUpNextOn", keys: ["hideUpNextOn"],
    apply(ctx) {
      S.hideUpNextOn && ctx.addStyle(
        ".ytp-autonav-endscreen-countdown-container, .ytp-autonav-endscreen, " +
        ".ytp-autonav-toggle-button-container, .ytp-endscreen-content, .ytp-ce-element, " +
        ".ytp-ce-covering-overlay, .ytp-ce-element-shadow{display:none!important}",
      );
    },
    settings(en) {
      en.appendChild(Io("Hide the up-next overlay", "hideUpNextOn"));
      en.appendChild(To("div", "ytb-hist-note",
        "Hides the countdown and end-screen wall. Playback still stops at the end of the video."));
    },
  });

  // The 2026 "Ask" pill has no stable element name across experiments, so this
  // matches its label instead of its tag.
  xa.register({
    id: "hide-ai-ask", name: "Hide AI Ask",
    summary: "Removes the AI Ask pill from feeds, watch and comments.",
      cat: "feed",
    masterKey: "hideAiAskOn", keys: ["hideAiAskOn"],
    apply(ctx) {
      if (!S.hideAiAskOn) return;
      ctx.addStyle(
        "ytd-ask-button-renderer, yt-ask-button-view-model, [is-ask-button], " +
        "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ask']{display:none!important}",
      );
      const EXACT = /^(ask|ask ai|ask about this video|ask about this channel)$/i;
      const scrub = () => {
        // The pill is rare and unlabelled; walk a bounded slice of the buttons
        // rather than every one on a long feed, several times a minute.
        const nodes = document.querySelectorAll("button, yt-button-shape, ytd-button-renderer, yt-chip-cloud-chip-renderer");
        const limit = Math.min(nodes.length, 400);
        for (let i = 0; i < limit; i++) {
          const node = nodes[i];
          const label = ((node.getAttribute("aria-label") || node.getAttribute("title") || "")).trim();
          const text = (node.textContent || "").trim();
          const match = EXACT.test(label) || EXACT.test(text);
          if (match) {
            if (!node.dataset.ytbAsk) { node.dataset.ytbAsk = "1"; node.style.display = "none"; }
          } else if (node.dataset.ytbAsk) {
            // YouTube reuses button nodes; clear the hide when the label changes.
            delete node.dataset.ytbAsk;
            node.style.display = "";
          }
        }
      };
      ctx.addObserver(document.body, ctx.debounce(scrub, 300), { childList: true, subtree: true });
      scrub();
      ctx.addInterval(scrub, 5000);
      Yt["hide-ai-ask"].push(() => {
        document.querySelectorAll("[data-ytb-ask]").forEach((el) => {
          el.style.display = "";
          delete el.dataset.ytbAsk;
        });
      });
    },
    settings(en) {
      en.appendChild(Io("Hide the AI Ask button", "hideAiAskOn"));
      en.appendChild(To("div", "ytb-hist-note",
        "YouTube serves this button under different names in different experiments, so it is matched by its label."));
    },
  });

  xa.register({
    id: "auto-exit-fullscreen", name: "Auto-Exit Fullscreen",
    summary: "Leaves fullscreen automatically at video end.",
      cat: "playback",
    masterKey: "autoExitFullscreenOn", keys: ["autoExitFullscreenOn"],
    apply(ctx) {
      if (!S.autoExitFullscreenOn) return;
      const onEnded = () => {
        try {
          if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        } catch (_) {}
      };
      const bound = new WeakSet();
      const bind = () => {
        const el = ie.el();
        if (!el || bound.has(el)) return;
        bound.add(el);
        ctx.addListener(el, "ended", onEnded);
      };
      bind();
      ctx.onNav(() => ctx.addTimeout(bind, 1200));
    },
    settings(en) { en.appendChild(Io("Leave fullscreen when the video ends", "autoExitFullscreenOn")); },
  });
  // ---------------------------------------------------------------------------
  // Playback and audio
  // ---------------------------------------------------------------------------

  // Shared WebAudio graph for the boost and leveling features. Media elements are
  // routed once and cached at module scope: createMediaElementSource throws when
  // called twice for the same element, and the element outlives feature re-applies.
  // A DynamicsCompressorNode with threshold 0 / ratio 1 is transparent, so the
  // graph can stay connected while leveling is off.
  const _ytAudio = { ctx: null };
  const _ytAudioGraphs = new WeakMap();
  const _ytAudioEntry = (el) => {
    try {
      if (!el) return null;
      if (!_ytAudio.ctx) {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return null;
        _ytAudio.ctx = new AudioCtor();
      }
      const ac = _ytAudio.ctx;
      let entry = _ytAudioGraphs.get(el);
      if (!entry) {
        const makeComp = (ctx) => {
          const comp = ctx.createDynamicsCompressor();
          comp.threshold.value = 0;
          comp.knee.value = 0;
          comp.ratio.value = 1;
          comp.attack.value = 0.003;
          comp.release.value = 0.25;
          return comp;
        };
        // If the silence detector already routed this element, build on its
        // chain instead of calling createMediaElementSource a second time.
        const shared = YourTubePlayback.entryFor(el);
        if (shared && !shared.dead && shared.ctx && shared.source && shared.analyser) {
          // Join the existing source (stream tap or element route) instead of
          // asking createMediaElementSource for the same element twice.
          const gain = shared.ctx.createGain();
          const comp = makeComp(shared.ctx);
          try { shared.source.disconnect(); } catch (_) {}
          shared.source.connect(gain);
          gain.connect(comp);
          comp.connect(shared.analyser);
          entry = { source: shared.source, gain, comp, ctx: shared.ctx };
          _ytAudioGraphs.set(el, entry);
        } else {
          const source = ac.createMediaElementSource(el);
          const gain = ac.createGain();
          const comp = makeComp(ac);
          source.connect(gain);
          gain.connect(comp);
          comp.connect(ac.destination);
          entry = { source, gain, comp, ctx: ac };
          _ytAudioGraphs.set(el, entry);
        }
      }
      if (entry.ctx && entry.ctx.state === "suspended") entry.ctx.resume().catch(() => {});
      return entry;
    } catch (_) { return null; }
  };

  xa.register({
    id: "wheel-controls", name: "Mouse-Wheel Controls",
    summary: "Wheel over the player adjusts volume; over the seek bar seeks.",
      cat: "audio",
    masterKey: "wheelControlsOn", keys: ["wheelControlsOn", "wheelVolumeStep", "wheelSeekStep"],
    apply(ctx) {
      if (!S.wheelControlsOn) return;
      const volumeStep = () => Math.max(1, Math.min(25, Number(S.wheelVolumeStep) || 5));
      const seekStep = () => Math.max(1, Math.min(60, Number(S.wheelSeekStep) || 5));
      const onWheel = (ev) => {
        const el = ie.el();
        // The public player exposes its own event API; adding a DOM wheel
        // listener to that host can silently subscribe to the wrong channel.
        // Delegate from the document, scoped to the active video's player, so
        // page scrolling, menus, and preloaded players keep their native input.
        const player = el && el.closest("#movie_player,.html5-video-player,ytd-player,#player-container");
        const path = ev.composedPath?.() || [];
        if (!player || !(path.includes(player) || player.contains(ev.target)) || ev.ctrlKey || ev.metaKey ||
            ev.target?.closest?.(".ytb-dash,.ytp-popup,.ytp-settings-menu,[contenteditable=true]")) return;
        if (ev.shiftKey) {
          ev.preventDefault();
          const next = Math.max(0.0625, Math.min(16, Math.round((el.playbackRate + (ev.deltaY < 0 ? 0.1 : -0.1)) * 100) / 100));
          el.playbackRate = next;
          pe("Speed " + next + "x", 1200, "info");
          return;
        }
        const overBar = ev.target && ev.target.closest &&
          ev.target.closest(".ytp-progress-bar-container, .ytp-progress-bar, .ytp-progress-list");
        if (overBar) {
          ev.preventDefault();
          const step = seekStep() * (ev.deltaY < 0 ? 1 : -1);
          try { el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + step)); } catch (_) {}
          pe((step > 0 ? "Forward " : "Back ") + Math.abs(step) + "s", 900, "info");
          return;
        }
        ev.preventDefault();
        const next = Math.max(0, Math.min(1, Math.round((el.volume + (ev.deltaY < 0 ? volumeStep() : -volumeStep()) / 100) * 100) / 100));
        el.volume = next;
        el.muted = false;
        pe("Volume " + Math.round(next * 100) + "%", 900, "info");
      };
      ctx.addListener(document, "wheel", onWheel, { capture: true, passive: false });
    },
    settings(en) {
      en.appendChild(Io("Wheel over the player adjusts volume", "wheelControlsOn"));
      en.appendChild(No("Volume step", "wheelVolumeStep", 1, 25, 1, (v) => v + "%"));
      en.appendChild(No("Seek step (over the progress bar)", "wheelSeekStep", 1, 60, 1, (v) => v + "s"));
      en.appendChild(To("div", "ytb-hist-note", "Shift+wheel over the player changes speed."));
    },
  });



  xa.register({
    id: "loudness-leveling", name: "Loudness Normalization",
    summary: "Compressor evens quiet dialogue and loud segments.",
      cat: "audio",
    masterKey: "loudnessLevelOn", keys: ["loudnessLevelOn", "loudnessStrength"],
    apply(ctx) {
      if (!S.loudnessLevelOn) return;
      const strength = () => Math.max(1, Math.min(3, Number(S.loudnessStrength) || 2));
      const applyComp = () => {
        const el = ie.el();
        const entry = _ytAudioEntry(el);
        if (!entry) return;
        const level = strength();
        const threshold = level === 1 ? -12 : level === 2 ? -20 : -28;
        const ratio = level === 1 ? 3 : level === 2 ? 8 : 16;
        try {
          entry.comp.threshold.value = threshold;
          entry.comp.knee.value = 20;
          entry.comp.ratio.value = ratio;
          entry.comp.attack.value = 0.005;
          entry.comp.release.value = 0.3;
        } catch (_) {}
      };
      applyComp();
      ctx.onNav(() => ctx.addTimeout(applyComp, 1200));
      ctx.addInterval(applyComp, 4000);
      Yt["loudness-leveling"].push(() => {
        try {
          const el = ie.el();
          const entry = el && _ytAudioGraphs.get(el);
          if (entry) {
            entry.comp.threshold.value = 0;
            entry.comp.knee.value = 0;
            entry.comp.ratio.value = 1;
          }
        } catch (_) {}
      });
    },
    settings(en) {
      en.appendChild(Io("Level the loudness", "loudnessLevelOn"));
      en.appendChild(No("Strength", "loudnessStrength", 1, 3, 1, (v) => ["Gentle", "Medium", "Strong"][v - 1] || String(v)));
      en.appendChild(To("div", "ytb-hist-note",
        "A compressor, not a normalizer: quiet dialogue comes up and peaks are held back, at the cost of some dynamic range."));
    },
  });

  xa.register({
    id: "sticky-quality", name: "Live Quality Lock",
    summary: "Re-applies the preferred quality on live streams.",
      cat: "playback",
    masterKey: "stickyQualityOn", keys: ["stickyQualityOn", "qualityPref"],
    apply(ctx) {
      if (!S.stickyQualityOn) return;
      const reassert = () => {
        try {
          if (!_isLiveStream()) return;
          const el = ie.el();
          if (!el || el.paused) return;
          const levels = ie.levels();
          if (!levels || !levels.length) return;
          const target = ie.qualityTarget(S.qualityPref);
          if (!target) return;
          // Skip when the player is already on the target: re-asserting every
          // 5s fights YouTube's own adaptation for no reason.
          const current = (() => {
            try {
              const api = ie.api && ie.api();
              return api && typeof api.getPlaybackQuality === "function" ? api.getPlaybackQuality() : "";
            } catch (_) { return ""; }
          })();
          if (current !== target) ie.setQuality(target);
        } catch (_) {}
      };
      ctx.addInterval(reassert, 5000);
      ctx.onNav(() => ctx.addTimeout(reassert, 2500));
    },
    settings(en) {
      en.appendChild(Io("Keep my quality on livestreams", "stickyQualityOn"));
      en.appendChild(To("div", "ytb-hist-note",
        "Re-asserts the same preference used by 'Preferred Quality Lock' every five seconds on live streams."));
    },
  });




  // ---------------------------------------------------------------------------
  // Third-party integrations
  // ---------------------------------------------------------------------------

  // Return YouTube Dislike. One request per video, cached for six hours; the
  // count is written into the existing dislike button and a ratio bar is added
  // under it. Failures are silent: the native UI is left alone.
  xa.register({
    id: "return-dislike", name: "Return YouTube Dislike",
    summary: "Restores dislike counts plus a like/dislike ratio bar (RYD API).",
      cat: "integrations",
    masterKey: "returnDislikeOn", keys: ["returnDislikeOn", "returnDislikeBar"],
    apply(ctx) {
      if (!S.returnDislikeOn) return;
      ctx.addStyle(
        ".ytb-ui-ryd-count{font-size:12px;font-weight:500;margin-left:6px;color:inherit;opacity:.9}" +
        ".ytb-ui-ryd-bar{display:flex;flex-direction:column;gap:2px;margin:6px 0 2px;max-width:340px}" +
        ".ytb-ui-ryd-track{height:4px;border-radius:2px;background:rgba(255,255,255,.14);overflow:hidden;display:flex}" +
        ".ytb-ui-ryd-like{background:#3ea6ff;height:100%}" +
        ".ytb-ui-ryd-dislike{background:#ff5252;height:100%}" +
        ".ytb-ui-ryd-label{font:600 10.5px system-ui;color:#aaa;display:flex;gap:8px;align-items:center;justify-content:space-between}",
      );
      const cache = new YourTubeResources.BoundedCache(64, "ytb-ryd", { ttlMs: 6 * 60 * 60 * 1000 });
      const failed = new YourTubeResources.BoundedCache(64, "ytb-ryd-fail", { ttlMs: 10 * 60 * 1000 });
      let inFlight = 0;
      const format = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n));
      const dislikeButton = () => {
        try {
          const cands = [
            ...document.querySelectorAll("dislike-button-view-model button, ytd-menu-renderer #segmented-dislike-button button, button[title*='dislike' i], ytd-toggle-button-renderer:nth-of-type(2) button"),
          ];
          // YouTube ships a second dislike button in the fullscreen quick-actions
          // bar (always display:none on the watch page); pick the visible one.
          return cands.find((b) => !b.closest(".ytp-fullscreen-quick-actions") && b.getBoundingClientRect().width > 0) || cands[0] || null;
        } catch (_) { return null; }
      };
      const render = (videoId, data) => {
        if (!videoId || !data || typeof data.dislikes !== "number") return;
        const button = dislikeButton();
        if (!button) return;
        let count = button.querySelector(".ytb-ui-ryd-count");
        if (!count) {
          count = To("span", "ytb-ui-ryd-count");
          button.appendChild(count);
        }
        count.textContent = format(data.dislikes);
        count.dataset.ytbRydFor = videoId;
        count.title = "Dislike count from the Return YouTube Dislike API";
        if (!S.returnDislikeBar) return;
        const host = button.closest("ytd-menu-renderer, #top-row, #actions-inner") || button.parentElement;
        if (!host) return;
        const existing = host.querySelector(".ytb-ui-ryd-bar");
        // The actions row is reused across navigations and YouTube can move the
        // button between hosts; keep exactly one bar for the current video.
        if (existing && existing.dataset.ytbRydFor === videoId) {
          document.querySelectorAll(".ytb-ui-ryd-bar").forEach((el) => {
            if (el !== existing) el.remove();
          });
          return;
        }
        document.querySelectorAll(".ytb-ui-ryd-bar").forEach((el) => el.remove());
        const total = (data.likes || 0) + (data.dislikes || 0);
        if (!total) return;
        const likePct = Math.round(((data.likes || 0) / total) * 100);
        const bar = To("div", "ytb-ui-ryd-bar");
        const track = To("div", "ytb-ui-ryd-track");
        const like = To("div", "ytb-ui-ryd-like");
        const dislike = To("div", "ytb-ui-ryd-dislike");
        like.style.width = likePct + "%";
        dislike.style.width = (100 - likePct) + "%";
        track.appendChild(like);
        track.appendChild(dislike);
        const label = To("div", "ytb-ui-ryd-label");
        label.appendChild(To("span", null, format(data.likes || 0) + " likes"));
        label.appendChild(To("span", null, (100 - likePct) + "% dislike"));
        label.appendChild(To("span", null, format(data.dislikes || 0) + " dislikes"));
        bar.dataset.ytbRydFor = videoId;
        bar.appendChild(track);
        bar.appendChild(label);
        host.appendChild(bar);
      };
      const load = (videoId) => {
        if (!videoId) return;
        const cached = cache.get(videoId);
        if (cached) { render(videoId, cached); return; }
        if (failed.has(videoId)) return;
        if (inFlight >= 2) return;
        inFlight++;
        YourTubeEngine.fetchJson("https://returnyoutubedislikeapi.com/votes?videoId=" + encodeURIComponent(videoId))
          .then((result) => {
            const data = result && result.ok ? result.json : null;
            if (!data || typeof data.dislikes !== "number") { failed.set(videoId, 1); return; }
            cache.set(videoId, data);
            failed.delete(videoId);
            if (S.returnDislikeOn && videoId === (ie.videoId && ie.videoId())) render(videoId, data);
          })
          .catch(() => { failed.set(videoId, 1); })
          .then(() => { inFlight--; });
      };
      const tick = () => {
        if (!location.pathname.startsWith("/watch")) return;
        const videoId = ie.videoId && ie.videoId();
        if (!videoId) return;
        // Drop the previous video's count and bar even if this video's request is slow or fails.
        document.querySelectorAll(".ytb-ui-ryd-count, .ytb-ui-ryd-bar").forEach((el) => {
          if (el.dataset.ytbRydFor !== videoId) el.remove();
        });
        load(videoId);
      };
      tick();
      ctx.addInterval(tick, 2500);
      ctx.onNav(() => ctx.addTimeout(tick, 1200));
      Yt["return-dislike"].push(() => {
        document.querySelectorAll(".ytb-ui-ryd-count, .ytb-ui-ryd-bar").forEach((el) => el.remove());
      });
    },
    settings(en) {
      en.appendChild(Io("Show dislike counts", "returnDislikeOn"));
      en.appendChild(Io("Show the like/dislike ratio bar", "returnDislikeBar"));
      en.appendChild(To("div", "ytb-hist-note",
        "Counts come from returnyoutubedislikeapi.com, one request per video (cached for six hours)."));
    },
  });

  // DeArrow: community titles for the watch page and community thumbnails for
  // cards. Card thumbnails are fetched lazily as cards scroll into view, capped
  // per navigation, because the API is per video.
  xa.register({
    id: "dearrow", name: "DeArrow",
    summary: "Swaps clickbait titles/thumbnails for community-submitted versions.",
      cat: "integrations",
    masterKey: "deArrowOn", keys: ["deArrowOn", "deArrowTitles", "deArrowThumbs"],
    apply(ctx) {
      if (!S.deArrowOn) return;
      ctx.addStyle(
        ".ytb-ui-dearrow-chip{display:inline-flex;align-items:center;gap:4px;margin-left:8px;padding:2px 8px;" +
        "border-radius:99px;background:rgba(111,168,220,.14);border:1px solid rgba(111,168,220,.4);color:#8ab4e8;" +
        "font:600 10.5px system-ui;cursor:pointer;vertical-align:middle;white-space:nowrap}" +
        ".ytb-ui-dearrow-chip:hover{background:rgba(111,168,220,.26)}",
      );
      const cache = new YourTubeResources.BoundedCache(96, "ytb-dearrow", { ttlMs: 12 * 60 * 60 * 1000 });
      const failed = new YourTubeResources.BoundedCache(96, "ytb-dearrow-fail", { ttlMs: 10 * 60 * 1000 });
      const thumbUrl = (videoId, time) =>
        "https://dearrow-thumb.ajay.app/api/v1/getThumbnail?videoID=" + encodeURIComponent(videoId) +
        "&time=" + encodeURIComponent(time) + "&returnError=true";
      let titleAppliedFor = "";
      let titleOwner = null;
      const releaseTitle = () => {
        const owned = titleOwner;
        titleOwner = null;
        if (!owned) return;
        owned.chip?.remove();
        // Restore actual native children/listeners, only if the site has not
        // already reused the heading for another video.
        if (owned.text.parentNode === owned.target) owned.text.replaceWith(...owned.children);
        if (document.title === owned.docWritten) document.title = owned.docBefore;
      };
      let revertedFor = "";
      let applyAlive = true;
      const thumbOriginals = new Map();
      const applyTitle = (videoId, data) => {
        // Never write a late response into a different video (or after teardown).
        if (!applyAlive || revertedFor === videoId) return;
        if (ie.videoId && ie.videoId() !== videoId) return;
        if (!S.deArrowTitles || !data || !Array.isArray(data.titles) || !data.titles.length) return;
        if (titleAppliedFor === videoId) return;
        const best = data.titles.find((entry) => entry && !entry.original && entry.title) || null;
        if (!best) return;
        const heading = document.querySelector("ytd-watch-metadata h1, h1.ytd-watch-metadata, #title h1");
        if (!heading) return;
        const target = heading.querySelector("yt-formatted-string") || heading;
        releaseTitle();
        const text = document.createTextNode(best.title);
        const owned = titleOwner = {target, text, children: Array.from(target.childNodes), docBefore: document.title, docWritten: best.title + " - YouTube"};
        titleAppliedFor = videoId;
        target.replaceChildren(text);
        document.title = owned.docWritten;
        if (!heading.querySelector(".ytb-ui-dearrow-chip")) {
          const chip = To("button", "ytb-ui-dearrow-chip", "DeArrow");
          chip.type = "button";
          chip.title = "Show the original title";
          chip.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            if (titleOwner !== owned) return;
            releaseTitle();
            // Keep the gate set so the next watch tick does not re-apply the
            // community title the user just dismissed.
            titleAppliedFor = videoId;
            revertedFor = videoId;
            chip.remove();
          });
          owned.chip = chip;
          heading.appendChild(chip);
        }
      };
      const applyThumb = (card, videoId, data) => {
        if (!applyAlive || S.safeMode || !card || !card.isConnected || _ytCardMeta.videoIdOf(card) !== videoId) return;
        if (!S.deArrowThumbs || !data || !Array.isArray(data.thumbnails) || !data.thumbnails.length) return;
        const best = data.thumbnails.find((entry) => entry && !entry.original && Number.isFinite(entry.timestamp)) || null;
        if (!best) return;
        const image = card.querySelector("img");
        if (!image || image.dataset.ytbDeArrow) return;
        if (!thumbOriginals.has(image)) {
          thumbOriginals.set(image, { src: image.getAttribute("src") || "", srcset: image.getAttribute("srcset") || "" });
        }
        image.dataset.ytbDeArrow = "1";
        image.src = thumbUrl(videoId, best.timestamp);
        image.removeAttribute("srcset");
      };
      const load = (videoId) => {
        const cached = cache.get(videoId);
        if (cached) return Promise.resolve(cached);
        if (failed.has(videoId)) return Promise.resolve(null);
        return YourTubeEngine.fetchJson("https://sponsor.ajay.app/api/branding?videoID=" + encodeURIComponent(videoId))
          .then((result) => {
            const data = result && result.ok && result.json && typeof result.json === "object" ? result.json : null;
            if (data) {
              cache.set(videoId, data);
              failed.delete(videoId);
            } else {
              failed.set(videoId, 1);
            }
            return data;
          })
          .catch(() => {
            failed.set(videoId, 1);
            return null;
          });
      };
      const watchTick = () => {
        if (!location.pathname.startsWith("/watch")) return;
        const videoId = ie.videoId && ie.videoId();
        if (!videoId || titleAppliedFor === videoId) return;
        load(videoId).then((data) => applyTitle(videoId, data));
      };
      let cardBudget = 0;
      const resetBudget = () => { cardBudget = 12; };
      const cardScan = () => {
        if (!S.deArrowThumbs || cardBudget <= 0) return;
        const cards = document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer");
        const now = Date.now();
        for (const card of cards) {
          if (cardBudget <= 0) break;
          // Check the cheap flags before the layout read: getBoundingClientRect
          // forces a reflow, and most cards are already handled.
          if (card.dataset.ytbDeArrowChecked && now - Number(card.dataset.ytbDeArrowChecked) < 600000) continue;
          const rect = card.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight + 400) continue;
          const link = card.querySelector("a[href*='/watch?v=']");
          if (!link) continue;
          const match = /[?&]v=([A-Za-z0-9_-]{11})/.exec(link.getAttribute("href") || "");
          if (!match) continue;
          const videoId = match[1];
          card.dataset.ytbDeArrowChecked = String(now);
          cardBudget--;
          load(videoId).then((data) => applyThumb(card, videoId, data));
        }
      };
      resetBudget();
      watchTick();
      ctx.addInterval(() => { watchTick(); cardScan(); }, 3000);
      ctx.onNav(() => {
        const same = titleAppliedFor === ie.videoId();
        if (!same || (titleOwner && !titleOwner.text.isConnected)) {
          releaseTitle(); titleAppliedFor = "";
          if (!same) revertedFor = "";
        }
        resetBudget();
        ctx.addTimeout(watchTick, 1500);
        ctx.addTimeout(cardScan, 2500);
      });
      Yt["dearrow"].push(() => {
        // Stop late responses from writing into the page first.
        applyAlive = false;
        // Restore the title, the document title and every replaced thumbnail.
        releaseTitle(); titleAppliedFor = "";
        document.querySelectorAll(".ytb-ui-dearrow-chip").forEach((el) => el.remove());
        for (const [image, original] of thumbOriginals) {
          try {
            if (original.src) image.setAttribute("src", original.src);
            if (original.srcset) image.setAttribute("srcset", original.srcset);
            else image.removeAttribute("srcset");
            delete image.dataset.ytbDeArrow;
          } catch (_) {}
        }
        thumbOriginals.clear();
        document.querySelectorAll("[data-ytb-de-arrow-checked]").forEach((el) => { delete el.dataset.ytbDeArrowChecked; });
      });
    },
    settings(en) {
      en.appendChild(Io("Use community titles and thumbnails", "deArrowOn"));
      en.appendChild(Io("Replace watch-page titles", "deArrowTitles"));
      en.appendChild(Io("Replace card thumbnails", "deArrowThumbs"));
      en.appendChild(To("div", "ytb-hist-note",
        "Data comes from the DeArrow API on sponsor.ajay.app. Card thumbnails are loaded as cards scroll into view, capped per page."));
    },
  });

  // Block Player Enhancements: force-disable YouTube's own player extras.
  // Ambient Mode paints blurred copies of the video into #cinematics, Stable
  // Volume is DRC (dynamic range compression), Voice Boost lifts dialogue.
  // The player element exposes setDrcUserPreference, setVoiceBoostUserPreference
  // and updateCinematicSettings, so we wrap those setters and re-assert the
  // off state on navigation.
  xa.register({
    id: "player-effects-block", name: "Block Player Enhancements",
    summary: "Force-off Ambient Mode, Stable Volume (dynamic range compression) and Voice Boost.",
      cat: "playback",
    masterKey: "blockPlayerFxOn", keys: ["blockPlayerFxOn", "blockAmbient", "blockStableVolume", "blockVoiceBoost"],
    apply(ctx) {
      if (!S.blockPlayerFxOn) return;
      if (S.blockAmbient) ctx.addStyle("#cinematics{display:none!important}");
      const hooked = new WeakSet();
      const settled = (v) => v === 0 || v === "0" || v === !1 || v == null;
      const hook = () => {
        const p = document.getElementById("movie_player");
        if (!p) return null;
        if (hooked.has(p)) return p;
        if (typeof p.setDrcUserPreference !== "function" && typeof p.setVoiceBoostUserPreference !== "function" && typeof p.updateCinematicSettings !== "function")
          return null; // the audio/cinematic surface arrives after the element; retry
        const orig = (p.__ytbFxOrig = p.__ytbFxOrig || {});
        if (typeof p.setDrcUserPreference === "function" && !orig.drc) {
          orig.drc = p.setDrcUserPreference;
          const bound = orig.drc.bind(p);
          p.setDrcUserPreference = function (v) {
            return bound(S.blockPlayerFxOn && S.blockStableVolume ? 0 : v);
          };
        }
        if (typeof p.setVoiceBoostUserPreference === "function" && !orig.vb) {
          orig.vb = p.setVoiceBoostUserPreference;
          const bound = orig.vb.bind(p);
          p.setVoiceBoostUserPreference = function (v) {
            return bound(S.blockPlayerFxOn && S.blockVoiceBoost ? 0 : v);
          };
        }
        if (typeof p.updateCinematicSettings === "function" && !orig.cine) {
          orig.cine = p.updateCinematicSettings;
          const bound = orig.cine.bind(p);
          p.updateCinematicSettings = function (v) {
            if (S.blockPlayerFxOn && S.blockAmbient) return;
            return bound(v);
          };
        }
        hooked.add(p);
        Yt["player-effects-block"].push(() => {
          try {
            if (orig.drc) p.setDrcUserPreference = orig.drc;
            if (orig.vb) p.setVoiceBoostUserPreference = orig.vb;
            if (orig.cine) p.updateCinematicSettings = orig.cine;
            delete p.__ytbFxOrig;
          } catch (_) {}
        });
        return p;
      };
      const stripAmbientAttr = () => {
        if (!(S.blockPlayerFxOn && S.blockAmbient)) return;
        const flexy = document.querySelector("ytd-watch-flexy");
        if (flexy && flexy.hasAttribute("ambient-mode-enabled")) flexy.removeAttribute("ambient-mode-enabled");
      };
      const assert = () => {
        const p = hook();
        if (p) {
          try {
            if (S.blockStableVolume && typeof p.getDrcUserPreference === "function" && !settled(p.getDrcUserPreference()))
              p.setDrcUserPreference(0);
          } catch (_) {}
          try {
            if (S.blockVoiceBoost && typeof p.getVoiceBoostUserPreference === "function" && !settled(p.getVoiceBoostUserPreference()))
              p.setVoiceBoostUserPreference(0);
          } catch (_) {}
        }
        stripAmbientAttr();
      };
      const watchFlexy = () => {
        const flexy = document.querySelector("ytd-watch-flexy");
        if (!flexy || flexy.__ytbFxObs) return;
        flexy.__ytbFxObs = 1;
        const obs = new MutationObserver(stripAmbientAttr);
        obs.observe(flexy, { attributes: !0, attributeFilter: ["ambient-mode-enabled"] });
        Yt["player-effects-block"].push(() => { try { obs.disconnect(); delete flexy.__ytbFxObs; } catch (_) {} });
      };
      ctx.addInterval(() => { watchFlexy(); assert(); }, 4000);
      watchFlexy(); assert();
      ctx.onNav(() => ctx.addTimeout(assert, 1400));
    },
    settings(en) {
      en.appendChild(Io("Block player enhancements", "blockPlayerFxOn"));
      en.appendChild(Io("Block ambient mode glow", "blockAmbient"));
      en.appendChild(Io("Block stable volume (DRC)", "blockStableVolume"));
      en.appendChild(Io("Block voice boost", "blockVoiceBoost"));
      en.appendChild(To("div", "ytb-hist-note",
        "Wraps the YouTube player's own switches: ambient mode stops painting its blurred backdrop, Stable Volume keeps full dynamics, Voice Boost never turns itself on."));
    },
  });

  // Calm chrome: applies an independent light palette to each floating
  // surface (toasts, resume prompts, SponsorBlock notices, gates). The body
  // class holds the palette; the rules live in the engine base CSS, which is
  // injected here so toasts are styled before the dashboard ever opens.
  xa.register({
    id: "calm-chrome", name: "Calm Popups & Toasts",
    summary: "Applies a light palette to popups, overlays and toasts.",
      cat: "appearance",
    masterKey: "calmUiOn", keys: ["calmUiOn"],
    apply(ctx) {
      const sync = () => {
        if (!document.body) return;
        document.body.classList.toggle("ytb-calm", !!S.calmUiOn);
      };
      YourTubeEngine.injectCSS();
      sync();
      const sub = g.on("cfg.changed", ({ key }) => {
        if (key === "calmUiOn") sync();
      });
      ctx.addInterval(sync, 2000);
      Yt["calm-chrome"].push(() => {
        try { if (typeof sub === "function") sub(); } catch (_) {}
        try {
          if (document.body) document.body.classList.remove("ytb-calm", "ytb-calm-dark");
        } catch (_) {}
      });
    },
    settings(en) {
      en.appendChild(Io("Calm design for popups, overlays and toasts", "calmUiOn"));
      en.appendChild(To("div", "ytb-hist-note",
        "On by default. Turn off to restore the legacy dark-glass popups."));
    },
  });

  // Live chat cleanup: hide paid messages and tighten the message layout.
  xa.register({
    id: "live-chat-clean", name: "Live Chat Cleanup",
    summary: "Hides paid messages and compacts the chat feed.",
      cat: "comments",
    masterKey: "liveChatCleanOn", keys: ["liveChatCleanOn", "liveChatHidePaid", "liveChatCompact"],
    apply(ctx) {
      if (!S.liveChatCleanOn) return;
      const rules = [];
      if (S.liveChatHidePaid) {
        rules.push(
          "yt-live-chat-paid-message-renderer, yt-live-chat-paid-sticker-renderer, " +
          "yt-live-chat-membership-item-renderer, ytd-sponsorships-live-chat-header-renderer{display:none!important}",
        );
      }
      if (S.liveChatCompact) {
        rules.push(
          "yt-live-chat-text-message-renderer{padding:2px 8px!important}" +
          "yt-live-chat-text-message-renderer #author-photo{width:18px!important;height:18px!important}" +
          "yt-live-chat-text-message-renderer #message{font-size:12px!important;line-height:1.35!important}",
        );
      }
      if (!rules.length) return;
      const css = rules.join("");
      ctx.addStyle(css);
      // Live chat normally lives in its own document. @noframes is intentional:
      // install ONLY the chat stylesheet there, not a second player/dashboard.
      const frames = new Map();
      const frameSelector = "ytd-live-chat-frame iframe,iframe#chatframe,iframe[src*='/live_chat']";
      const sync = () => {
        for (const [frame, state] of frames) if (!frame.isConnected) {
          frame.removeEventListener("load", state.load); state.style?.remove(); frames.delete(frame);
        }
        for (const frame of document.querySelectorAll(frameSelector)) {
          if (frames.has(frame)) continue;
          const state = {style:null,load:() => {
            const doc = frame.contentDocument;
            if (!doc || !doc.head) return; // cross-origin/unavailable documents are left alone
            state.style?.remove(); state.style = doc.createElement("style");
            state.style.textContent = css; doc.head.appendChild(state.style);
          }};
          frames.set(frame,state); frame.addEventListener("load",state.load); state.load();
        }
      };
      sync(); ctx.addObserver(document.body,sync,{childList:true,subtree:true});
      Yt["live-chat-clean"].push(() => {for (const [f,s] of frames) {f.removeEventListener("load",s.load);s.style?.remove();}frames.clear();});
    },
    settings(en) {
      en.appendChild(Io("Clean up live chat", "liveChatCleanOn"));
      en.appendChild(Io("Hide superchats and memberships", "liveChatHidePaid"));
      en.appendChild(Io("Compact message layout", "liveChatCompact"));
    },
  });
  // ---------------------------------------------------------------------------
  // Watch page tools
  // ---------------------------------------------------------------------------

  // Adds copy and download actions to the transcript panel, and stops YouTube
  // from scrolling the page when the panel opens.


  xa.register({
    id: "notification-clean", name: "Notification Cleanup",
    summary: "Hides the notification badge and adds a mark-all-read control.",
      cat: "feed",
    masterKey: "notificationCleanOn", keys: ["notificationCleanOn", "notificationHideBadge"],
    apply(ctx) {
      if (!S.notificationCleanOn) return;
      if (S.notificationHideBadge) {
        ctx.addStyle(
          "ytd-notification-topbar-button-renderer #notification-count, " +
          "ytd-notification-topbar-button-renderer .yt-spec-icon-badge-shape__badge, " +
          "ytd-notification-topbar-button-renderer yt-icon[icon='notification'] + .yt-spec-icon-badge-shape{display:none!important}",
        );
      }
      const mount = () => {
        const header = document.querySelector("ytd-multi-page-menu-renderer ytd-notification-renderer #header, ytd-multi-page-menu-renderer #header");
        if (!header || header.querySelector(".ytb-ui-mark-read")) return !!header;
        const button = Oo("Mark all read", () => {
          const target = Array.from(document.querySelectorAll("ytd-multi-page-menu-renderer button, ytd-multi-page-menu-renderer yt-button-shape button"))
            .find((el) => el !== button && !el.disabled && el.getClientRects().length &&
              /mark all( as)? read/i.test((el.textContent || "") + " " + (el.getAttribute("aria-label") || "")));
          if (target) { target.click(); pe("Notifications marked as read.", 1500, "success"); }
          else pe("No mark-all-read control on this page.", 1800, "info");
        });
        button.classList.add("ytb-ui-mark-read");
        button.style.cssText = "margin:4px 8px;font-size:11px";
        header.appendChild(button);
        return true;
      };
      mount();
      ctx.addInterval(mount, 2000);
      Yt["notification-clean"].push(() => {
        document.querySelectorAll(".ytb-ui-mark-read").forEach((el) => el.remove());
      });
    },
    settings(en) {
      en.appendChild(Io("Notification helpers", "notificationCleanOn"));
      en.appendChild(Io("Hide the unread badge", "notificationHideBadge"));
      en.appendChild(To("div", "ytb-hist-note",
        "The mark-all-read button appears in the notifications panel header."));
    },
  });

  // Watch Later helpers: hide entries you have already watched, copy what is
  // left, and reorder the list by duration client-side.


  // ---------------------------------------------------------------------------
  // Local data and habits
  // ---------------------------------------------------------------------------

  // Statistics computed from the local history store: totals, per-channel and
  // per-day breakdowns. The panel lives in the dashboard.
  xa.register({
    id: "watch-stats", name: "Watch Statistics",
    summary: "Hours watched by channel and day, from local history.",
      cat: "insights",
    masterKey: "watchStatsOn", keys: ["watchStatsOn", "watchStatsDays"],
    apply() { },
    settings(en) {
      en.appendChild(Io("Show watch statistics", "watchStatsOn"));
      en.appendChild(No("Days to include", "watchStatsDays", 1, 365, 1, (v) => v + " days"));
      const out = To("div", "ytb-hist-note");
      out.style.cssText = "margin-top:8px;white-space:pre-line";
      en.appendChild(out);
      const fmtHours = (seconds) => (seconds >= 3600 ? (seconds / 3600).toFixed(1) + " h" : Math.round(seconds / 60) + " min");
      const render = async () => {
        out.hidden = !S.watchStatsOn;
        if (out.hidden) { out.textContent = ""; return; }
        out.textContent = "Reading local history…";
        let rows = [];
        try { rows = (await w("history")) || []; } catch (_) {}
        const windowDays = Math.max(1, Math.min(365, Number(S.watchStatsDays) || 30));
        const cutoff = Date.now() - windowDays * 86400000;
        let totalSec = 0;
        let watched = 0;
        const perChannel = new Map();
        const perDay = new Map();
        for (const row of rows) {
          if (!row || !row.videoId) continue;
          const at = row.lastWatched || 0;
          if (at && at < cutoff) continue;
          const seconds = Number(row.totalWatchTime) || 0;
          totalSec += seconds;
          watched++;
          const channel = row.channel || "Unknown";
          perChannel.set(channel, (perChannel.get(channel) || 0) + seconds);
          const day = new Date(at || Date.now()).toISOString().slice(0, 10);
          perDay.set(day, (perDay.get(day) || 0) + seconds);
        }
        const top = Array.from(perChannel.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
        const days = Array.from(perDay.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 14);
        const lines = [];
        lines.push("Window: last " + windowDays + " days");
        lines.push("Videos recorded: " + watched + "   Watch time: " + fmtHours(totalSec));
        lines.push("");
        lines.push("Top channels");
        for (const [name, seconds] of top) lines.push("  " + fmtHours(seconds).padStart(8) + "  " + name);
        lines.push("");
        lines.push("Recent days");
        for (const [day, seconds] of days) lines.push("  " + day + "  " + fmtHours(seconds).padStart(8));
        out.textContent = lines.join("\n");
      };
      render();
      if (typeof So === "function") {
        So("cfg.changed", (ev) => {
          if (ev.key === "watchStatsDays" || ev.key === "watchStatsOn") render();
        });
      }
    },
  });

  // A weekly digest shown once per week, built from the same history store.
  xa.register({
    id: "weekly-report", name: "Weekly Report",
    summary: "Seven-day watch summary, generated weekly.",
      cat: "insights",
    masterKey: "weeklyReportOn", keys: ["weeklyReportOn"],
    apply(ctx) {
      if (!S.weeklyReportOn) return;
      const STORE = "__yourtube_report__";
      const store = YourTubeEngine.createStore(STORE, { lastShown: 0 });
      const fmtHours = (seconds) => (seconds >= 3600 ? (seconds / 3600).toFixed(1) + " h" : Math.round(seconds / 60) + " min");
      const run = async () => {
        const state = store.get() || {};
        const week = 7 * 86400000;
        if (state.lastShown && Date.now() - state.lastShown < week) return;
        let rows = [];
        try { rows = (await w("history")) || []; } catch (_) {}
        const cutoff = Date.now() - week;
        let totalSec = 0;
        let count = 0;
        const perChannel = new Map();
        for (const row of rows) {
          if (!row || !row.videoId) continue;
          const at = row.lastWatched || 0;
          if (at < cutoff) continue;
          totalSec += Number(row.totalWatchTime) || 0;
          count++;
          const channel = row.channel || "Unknown";
          perChannel.set(channel, (perChannel.get(channel) || 0) + 1);
        }
        if (!count) return;
        const top = Array.from(perChannel.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3)
          .map(([name, n]) => name + " (" + n + ")").join(", ");
        pe("Last 7 days: " + count + " video" + (count === 1 ? "" : "s") + ", " + fmtHours(totalSec) + " watched. Most: " + top, 9000, "info");
        store.update((data) => { data.lastShown = Date.now(); });
      };
      ctx.addTimeout(run, 8000);
    },
    settings(en) {
      en.appendChild(Io("Show a weekly watch summary", "weeklyReportOn"));
      en.appendChild(To("div", "ytb-hist-note",
        "Appears once every seven days, based on the local history store."));
    },
  });



  // True shuffle for playlists and the queue: YouTube's shuffle keeps the
  // original order in the DOM, which makes it easy to lose your place.

  // ---------------------------------------------------------------------------
  // Data, identity and layout
  // ---------------------------------------------------------------------------

  // Export local data to files: watch history, notes, bookmarks, collections,
  // the current playlist, and the subscription list.
  xa.register({
    id: "export-data", name: "Data Export",
    summary: "Exports history, notes, playlists and groups to a file.",
      cat: "data",
    masterKey: "exportDataOn", keys: ["exportDataOn"],
    apply() { },
    settings(en) {
      en.appendChild(Io("Enable export tools", "exportDataOn"));
      const save = (name, text, type) => {
        try {
          const url = YourTubeResources.TrackedBlobURL.create(new Blob([text], { type: type || "application/json" }), "ytb-export");
          if (!url) { pe("Export failed.", 1800, "error"); return; }
          const link = document.createElement("a");
          link.href = url;
          link.download = name;
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => YourTubeResources.TrackedBlobURL.revoke(url), 4000);
          pe("Saved " + name, 1800, "success");
        } catch (_) { pe("Export failed.", 1800, "error"); }
      };
      const stamp = () => new Date().toISOString().slice(0, 10);
      const row = To("div", "ytb-rowb");
      row.style.flexWrap = "wrap";
      row.appendChild(Oo("History (JSON)", async () => {
        let rows = [];
        try { rows = (await w("history")) || []; } catch (_) {}
        if (!rows.length) { pe("No local history to export.", 1800, "info"); return; }
        save("yourtube-history-" + stamp() + ".json", JSON.stringify(rows, null, 2));
      }));
      row.appendChild(Oo("History trash (JSON)", async () => {
        try {
          const entries = await CheckpointStore.trash();
          const out = entries.map(({key, ...entry}) => entry);
          save("yourtube-history-trash-" + stamp() + ".json", JSON.stringify({
            format: "yourtube-history-trash-v1", exportedAt: new Date().toISOString(), entries: out,
          }, null, 2));
        } catch (error) {
          m("history trash export failed", error);
          pe("Could not read history trash for export.", 2400, "error");
        }
      }));
      row.appendChild(Oo("History (CSV)", async () => {
        let rows = [];
        try { rows = (await w("history")) || []; } catch (_) {}
        if (!rows.length) { pe("No local history to export.", 1800, "info"); return; }
        const header = "videoId,title,channel,duration,lastPosition,progress,completed,lastWatched";
        const body = rows.map((r) => [
          r.videoId || "",
          '"' + String(r.title || "").replace(/"/g, '""') + '"',
          '"' + String(r.channel || "").replace(/"/g, '""') + '"',
          Number(r.duration) || 0,
          Number(r.lastPosition) || 0,
          Number(r.progress) || 0,
          r.completed ? 1 : 0,
          Number(r.lastWatched) || 0,
        ].join(",")).join("\n");
        save("yourtube-history-" + stamp() + ".csv", header + "\n" + body, "text/csv");
      }));
      row.appendChild(Oo("Notes & bookmarks", async () => {
        try {
          const database = await b();
          if (!database) throw new Error("Local storage is unavailable");
          // Flush pending edits before reading. Values are stored inside {k,v}
          // records; exporting the wrappers omitted timestamped notes and made
          // bookmark/collection imports ambiguous.
          const stores = [
            ["__yourtube_notes__", {}],
            ["__yourtube_bookmarks__", {}],
            ["__yourtube_collections__", []],
          ].map(([key, initial]) => YourTubeEngine.createStore(key, initial));
          await Promise.all(stores.map(async store => { await store.load(); await store.flush(); }));
          const records = await w("kv");
          const out = {
            format: "yourtube-local-notes-v1",
            exportedAt: new Date().toISOString(),
            notes: records.filter(r => r && typeof r.k === "string" && r.k.startsWith("note:")),
            timestampNotes: (await v("kv", "__yourtube_notes__"))?.v || {},
            bookmarks: (await v("kv", "__yourtube_bookmarks__"))?.v || {},
            collections: (await v("kv", "__yourtube_collections__"))?.v || [],
          };
          save("yourtube-notes-" + stamp() + ".json", JSON.stringify(out, null, 2));
        } catch (error) {
          m("notes export failed", error);
          pe("Could not read local notes for export.", 2400, "error");
        }
      }));
      row.appendChild(Oo("This playlist", () => {
        const items = [];
        document.querySelectorAll("ytd-playlist-video-renderer, ytd-playlist-panel-video-renderer").forEach((item) => {
          const link = item.querySelector("a[href*='/watch?v=']");
          const title = item.querySelector("#video-title, .yt-core-attributed-string");
          if (!link) return;
          const match = /[?&]v=([A-Za-z0-9_-]{11})/.exec(link.getAttribute("href") || "");
          if (!match) return;
          items.push(match[1] + "\t" + ((title && title.textContent) || "").trim());
        });
        if (!items.length) { pe("Open a playlist first.", 1800, "info"); return; }
        save("yourtube-playlist-" + stamp() + ".txt", items.join("\n"), "text/plain");
      }));
      row.appendChild(Oo("Subscriptions", () => {
        const seen = new Map();
        document.querySelectorAll("ytd-channel-renderer, ytd-grid-channel-renderer").forEach((card) => {
          const link = card.querySelector("a[href*='/@'], a[href*='/channel/']");
          const name = card.querySelector("#channel-title, #text");
          if (!link) return;
          const href = link.getAttribute("href") || "";
          const handle = (href.match(/\/@([^\/?]+)/) || [])[1] || (href.match(/\/channel\/([\w-]+)/) || [])[1] || "";
          if (!handle) return;
          seen.set(handle, ((name && name.textContent) || "").trim());
        });
        if (!seen.size) { pe("Open your subscriptions page first.", 2200, "info"); return; }
        const lines = Array.from(seen.entries()).map(([handle, name]) => name + "\t" + handle);
        save("yourtube-subscriptions-" + stamp() + ".txt", lines.join("\n"), "text/plain");
      }));
      const sync = () => { row.style.display = S.exportDataOn ? "" : "none"; };
      sync();
      So("cfg.changed", ({key}) => { if (key === "exportDataOn") sync(); });
      en.appendChild(row);
      en.appendChild(To("div", "ytb-hist-note",
        "Files are written from local data only. The subscription list is read from the channels page you have open."));
    },
  });

  // Subscription groups: local folders for channels, with a filter for the
  // subscriptions feed.


  xa.register({
    id: "ui-restore-2026", name: "2026 UI Restores",
    summary: "Restores the subscriber count and tidies the 2026 watch layout.",
      cat: "appearance",
    masterKey: "uiRestoreOn", keys: ["uiRestoreOn", "uiRestoreSubs", "uiRestoreInlineLikes"],
    apply(ctx) {
      if (!S.uiRestoreOn) return;
      if (S.uiRestoreInlineLikes) {
        const scrub = () => {
          document.querySelectorAll("ytd-watch-metadata #info-container span, ytd-watch-metadata #info span").forEach((node) => {
            if (node.dataset.ytbInlineLikes) return;
            if (!/^[\d.,]+[KMB]?\s+likes$/i.test((node.textContent || "").trim())) return;
            node.dataset.ytbInlineLikes = "1";
            node.style.display = "none";
          });
        };
        ctx.addObserver(document.body, ctx.debounce(scrub, 400), { childList: true, subtree: true });
        scrub();
      ctx.addInterval(scrub, 3000);
        Yt["ui-restore-2026"].push(() => {
          document.querySelectorAll("[data-ytb-inline-likes]").forEach((el) => {
            el.style.display = "";
            delete el.dataset.ytbInlineLikes;
          });
        });
      }
      if (S.uiRestoreSubs) {
        let appliedFor = "";
        // Walk the parsed response instead of stringifying it: the payload can
        // be megabytes, and the field is a single nested object.
        const findSubscriberText = (node, depth) => {
          if (!node || typeof node !== "object" || (depth || 0) > 30) return "";
          const sc = node.subscriberCountText;
          if (sc && typeof sc === "object") {
            if (typeof sc.simpleText === "string" && sc.simpleText) return sc.simpleText;
            if (Array.isArray(sc.runs) && sc.runs[0] && typeof sc.runs[0].text === "string") return sc.runs[0].text;
          }
          for (const key of Object.keys(node)) {
            const found = findSubscriberText(node[key], (depth || 0) + 1);
            if (found) return found;
          }
          return "";
        };
        const loadSubs = (videoId, attempt) => {
          YourTubeEngine.innerTube("next", { videoId })
            .then((response) => {
              const json = response && response.json;
              if (!json) return;
              // The response can land after a navigation; only use it for the
              // video it was requested for.
              if (videoId !== (ie.videoId && ie.videoId())) return;
              const text = findSubscriberText(json, 0);
              if (!text) return;
              const host = document.querySelector("ytd-watch-metadata #owner, ytd-video-owner-renderer");
              if (!host) {
                // The owner block can render after the response; retry a few
                // times instead of dropping the chip for this video.
                if (attempt < 4) ctx.addTimeout(() => loadSubs(videoId, attempt + 1), 1500);
                else appliedFor = "";
                return;
              }
              const chip = host.querySelector(".ytb-ui-subs");
              if (chip) {
                // The owner block is reused across navigations; refresh a stale
                // chip instead of re-fetching forever.
                if (chip.dataset.ytbSubsFor !== videoId) {
                  chip.dataset.ytbSubsFor = videoId;
                  chip.textContent = text;
                }
                return;
              }
              const fresh = To("span", "ytb-ui-subs", text);
              fresh.dataset.ytbSubsFor = videoId;
              fresh.style.cssText = "margin-left:8px;font-size:12px;color:#aaa";
              fresh.title = "Subscriber count, read from YouTube's own metadata";
              host.appendChild(fresh);
            })
            .catch(() => {});
        };
        const tick = () => {
          if (!location.pathname.startsWith("/watch")) return;
          const videoId = ie.videoId && ie.videoId();
          if (!videoId || videoId === appliedFor) return;
          appliedFor = videoId;
          loadSubs(videoId, 0);
        };
        ctx.addInterval(tick, 3000);
        ctx.onNav(() => { appliedFor = ""; ctx.addTimeout(tick, 1500); });
        Yt["ui-restore-2026"].push(() => {
          document.querySelectorAll(".ytb-ui-subs").forEach((el) => el.remove());
        });
      }
    },
    settings(en) {
      en.appendChild(Io("Restore 2026 layout regressions", "uiRestoreOn"));
      en.appendChild(Io("Show the subscriber count again", "uiRestoreSubs"));
      en.appendChild(Io("Hide the inline like count next to views", "uiRestoreInlineLikes"));
      en.appendChild(To("div", "ytb-hist-note",
        "The subscriber count is read from YouTube's own metadata for the video, so it appears a moment after the page loads."));
    },
  });

  xa.register({
    id: "watch-tabs", name: "Watch Tabs",
    summary: "Details, comments, chapters and related videos as tabs.",
      cat: "appearance",
    masterKey: "watchTabsOn", keys: ["watchTabsOn"],
    apply(ctx) {
      if (!S.watchTabsOn) return;
      ctx.addStyle(
        "html.ytb-ui-tabs[data-ytb-tab='details'] #comments,html.ytb-ui-tabs[data-ytb-tab='details'] #secondary," +
        "html.ytb-ui-tabs[data-ytb-tab='chapters'] #comments,html.ytb-ui-tabs[data-ytb-tab='chapters'] #secondary," +
        "html.ytb-ui-tabs[data-ytb-tab='comments'] #secondary,html.ytb-ui-tabs[data-ytb-tab='comments'] #related," +
        "html.ytb-ui-tabs[data-ytb-tab='related'] #comments{display:none!important}" +
        "html.ytb-ui-tabs[data-ytb-tab='related'] #secondary{width:100%!important;max-width:100%!important}" +
        ".ytb-ui-tabs-bar{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}" +
        ".ytb-ui-tabs-bar .ytb-btn.active{background:rgba(255,61,127,.18);border-color:rgba(255,61,127,.4);color:#ff8aa5}",
      );
      const TABS = [["all", "All"], ["details", "Details"], ["chapters", "Chapters"], ["comments", "Comments"], ["related", "Related"]];
      const select = (tab) => {
        if (tab === "all") {
          document.documentElement.removeAttribute("data-ytb-tab");
          document.documentElement.classList.remove("ytb-ui-tabs");
        } else {
          document.documentElement.classList.add("ytb-ui-tabs");
          document.documentElement.setAttribute("data-ytb-tab", tab);
          const target = tab === "comments" ? "#comments" : tab === "related" ? "#secondary" : tab === "chapters" ? "ytd-watch-metadata #description, #info-container" : "ytd-watch-metadata";
          const node = document.querySelector(target);
          if (node && node.scrollIntoView) node.scrollIntoView({ block: "start" });
        }
        document.querySelectorAll(".ytb-ui-tabs-bar .ytb-btn").forEach((button) => {
          button.classList.toggle("active", button.dataset.ytbTab === tab);
        });
      };
      const mount = () => {
        if (!location.pathname.startsWith("/watch")) return;
        const host = document.querySelector("ytd-watch-metadata #above-the-fold, ytd-watch-metadata");
        if (!host || host.querySelector(".ytb-ui-tabs-bar")) return;
        const bar = To("div", "ytb-ui-tabs-bar");
        for (const [tab, label] of TABS) {
          const button = Oo(label, () => select(tab));
          button.dataset.ytbTab = tab;
          if ((document.documentElement.getAttribute("data-ytb-tab") || "all") === tab) button.classList.add("active");
          bar.appendChild(button);
        }
        host.insertBefore(bar, host.firstChild);
      };
      mount();
      ctx.addInterval(mount, 2000);
      ctx.onNav(() => {
        // Tabs only apply to the watch page; leaving it must restore the layout.
        document.documentElement.removeAttribute("data-ytb-tab");
        document.documentElement.classList.remove("ytb-ui-tabs");
        ctx.addTimeout(mount, 1200);
      });
      Yt["watch-tabs"].push(() => {
        document.querySelectorAll(".ytb-ui-tabs-bar").forEach((el) => el.remove());
        document.documentElement.removeAttribute("data-ytb-tab");
        document.documentElement.classList.remove("ytb-ui-tabs");
      });
    },
    settings(en) {
      en.appendChild(Io("Show watch page tabs", "watchTabsOn"));
      en.appendChild(To("div", "ytb-hist-note",
        "The 'All' tab restores the normal page. Tabs hide the sections you are not looking at."));
    },
  });
  // Keyboard shortcut binding: the global handler in the bootstrap dispatches
  // through these specs, so a shortcut can be rebound in the dashboard.
  const _YT_KEYMAP_DEFAULTS = {
    forceWatched: "shift+keyw",
    screenshot: "keyx",
    stop: "shift+keys",
    chapterPrev: "minus",
    chapterNext: "equal",
    speedUp: "alt+shift+period",
    speedDown: "alt+shift+comma",
    sbSkip: "enter",
    sbHighlight: "",
    sbUpvote: "",
    sbDownvote: "",
  };
  function _ytKeySpec(ev) {
    try {
      if (!ev) return "";
      const parts = [];
      if (ev.ctrlKey) parts.push("ctrl");
      if (ev.altKey) parts.push("alt");
      if (ev.shiftKey) parts.push("shift");
      if (ev.metaKey) parts.push("meta");
      const code = ev.code || "";
      if (!code) return "";
      parts.push(code);
      return parts.join("+").toLowerCase();
    } catch (_) { return ""; }
  }



  // Channel page helper for the subscription groups feature.

  // ---------------------------------------------------------------------------
  // Feed modes and search tools
  // ---------------------------------------------------------------------------



  // Client-side sorting of the results YouTube already returned. It reorders the
  // cards on the page; it cannot fetch more results.
