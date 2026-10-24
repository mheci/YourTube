#!/usr/bin/env node
/*
 * apply-calm.cjs — restyle the dashboard in the "Calm" design language by
 * Appending scoped overrides to the panel CSS string and making four small
 * JS edits (masthead label, version meta, search placeholder, search slot).
 * The base rules stay untouched; every new selector is prefixed .ytb-dash so
 * shared classes (.ytb-btn etc.) keep their old look outside the panel.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "..", "src", "75-dashboard.js");
const src = fs.readFileSync(FILE, "utf8");
const BACKUP = "/tmp/75-dashboard.pre-calm.js";
fs.writeFileSync(BACKUP, src);

const CALM_CSS = `
/* --- Calm dashboard theme (v1.5.0): light paper, serif accents, hairlines --- */
.ytb-dash{--acc:#b45309;--acc-dim:rgba(180,83,9,.07);--panel:#faf7f0;--panel2:#fcf9f3;--panel3:#fffdf8;--line:#e7e5e4;--line2:#d6d3d1;--ink:#1c1917;--ink2:#57534e;--ink3:#a8a29e;color:var(--ink);background:var(--panel);border:1px solid var(--line2);border-radius:12px;box-shadow:0 18px 50px rgba(28,25,23,.18),0 2px 8px rgba(28,25,23,.08);font:13px/1.45 "Segoe UI",system-ui,-apple-system,sans-serif}
.ytb-dash .ytb-dhdr{align-items:flex-end;gap:12px;padding:15px 18px 9px;border-bottom:2px solid var(--ink);background:transparent}
.ytb-dash .ytb-dgrip{color:#b8b2a7;margin-right:2px;font-size:11px}
.ytb-dash .ytb-dtitle{font:700 21px/1.1 Georgia,"Times New Roman",serif;letter-spacing:-.01em;color:var(--ink)}
.ytb-dash .ytb-dver{font:italic 11px/1 Georgia,"Times New Roman",serif;color:var(--ink3);background:transparent;border:0;padding:0 0 3px 4px;margin-left:2px}
.ytb-dash .ytb-search{flex:1;min-width:120px;margin:0;padding:4px 2px 5px;background:transparent;border:0;border-bottom:1px solid var(--line2);border-radius:0;font:italic 13px Georgia,"Times New Roman",serif;color:#44403c}
.ytb-dash .ytb-search:focus{border-color:var(--ink);box-shadow:none}
.ytb-dash .ytb-search::placeholder{color:#b8b2a7;font:italic 13px Georgia,"Times New Roman",serif}
.ytb-dash .ytb-dhbtns{gap:10px;padding-bottom:4px}
.ytb-dash .ytb-btn{background:none;border:0;border-bottom:1px dotted var(--ink3);border-radius:0;padding:1px 0 2px;color:var(--ink2);font:12px "Segoe UI",system-ui,sans-serif}
.ytb-dash .ytb-btn:hover{background:none;color:var(--ink);border-bottom:1px solid var(--ink)}
.ytb-dash .ytb-btn:active{transform:none}
.ytb-dash .ytb-btn.primary{color:var(--acc);border-bottom-color:var(--acc);font-weight:600}
.ytb-dash .ytb-btn.primary:hover{background:none;color:#92400e;border-bottom:1px solid #92400e}
.ytb-dash .ytb-btn.danger,.ytb-dash .ytb-btn.ytb-danger{color:#b91c1c;border-bottom-color:rgba(185,28,28,.45)}
.ytb-dash .ytb-btn.danger:hover,.ytb-dash .ytb-btn.ytb-danger:hover{background:none;color:#7f1d1d;border-bottom-color:#7f1d1d}
.ytb-dash .ytb-btn.ytb-close{width:auto;height:auto;padding:1px 3px;border-bottom-color:transparent;font:12px/1 ui-monospace,SFMono-Regular,Consolas,monospace}
.ytb-dash .ytb-btn.ytb-close:hover{background:none;color:var(--ink);border-bottom:1px solid var(--ink)}
.ytb-dash .ytb-btn.ytb-sb{font-size:10px;padding:0 0 1px}
.ytb-dash .ytb-main{flex-direction:column}
.ytb-dash .ytb-nav{width:auto;flex-direction:row;flex-wrap:wrap;gap:5px 14px;padding:10px 18px 9px;border-right:0;border-bottom:1px solid var(--line);background:transparent;overflow:visible}
.ytb-dash .ytb-nav-item{display:inline-flex;width:auto;gap:5px;align-items:baseline;padding:2px 0;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;color:#78716c;font:11px "Segoe UI",system-ui,sans-serif}
.ytb-dash .ytb-nav-item:hover{background:none;color:var(--ink)}
.ytb-dash .ytb-nav-item.active{background:none;color:var(--ink);font-weight:700;border-bottom:1px solid var(--ink)}
.ytb-dash .ytb-nav-count{font:9px "Segoe UI",system-ui,sans-serif;color:var(--acc);font-variant-numeric:tabular-nums}
.ytb-dash .ytb-nav-item.active .ytb-nav-count{color:var(--acc)}
.ytb-dash .ytb-nav-sep{display:none}
.ytb-dash .ytb-body{padding:2px 18px 6px;scrollbar-color:#d6d3d1 transparent}
.ytb-dash .ytb-body::-webkit-scrollbar-thumb{background:#d6d3d1;border-radius:4px}
.ytb-dash .ytb-core{display:flex;flex-wrap:wrap;gap:8px 22px;padding:8px 0 10px;margin:0;border-bottom:1px solid var(--line)}
.ytb-dash .ytb-corecell{background:none;border:0;border-radius:0;padding:0;gap:10px}
.ytb-dash .ytb-corecell:hover{border-color:transparent}
.ytb-dash .ytb-corelbl{font:550 12px/1.3 "Segoe UI",system-ui,sans-serif;color:var(--ink2)}
.ytb-dash .ytb-cat-page{gap:0;padding:0}
.ytb-dash .ytb-card{padding:7px 2px;margin:0;background:none;border:0;border-bottom:1px solid #efece7;border-radius:0}
.ytb-dash .ytb-card:hover{background:#f5f1e8;border-color:transparent;border-bottom-color:#efece7}
.ytb-dash .ytb-card.on{border-left-color:transparent}
.ytb-dash .ytb-head{gap:12px}
.ytb-dash .ytb-name{font:600 12.5px "Segoe UI",system-ui,sans-serif;color:#1c1917}
.ytb-dash .ytb-key{margin:0;padding:1px 0;background:none;border:0;border-bottom:1px solid transparent;border-radius:0;font:10.5px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;color:var(--acc)}
.ytb-dash .ytb-key:hover{background:none;color:#92400e;border-bottom:1px solid #92400e}
.ytb-dash .ytb-sum{font:italic 12px/1.45 Georgia,"Times New Roman",serif;color:var(--ink2);margin-top:2px}
.ytb-dash .ytp-settings{border-top:1px solid #efece7;padding-top:8px;margin-top:8px}
.ytb-dash .ytb-lbl{font-size:12px;color:var(--ink);font-family:"Segoe UI",system-ui,sans-serif}
.ytb-dash .ytb-rowb .ytb-btn{border:1px solid var(--line2);border-radius:6px;padding:4px 8px;background:#fffdf8;font-size:11px;flex:1}
.ytb-dash .ytb-rowb .ytb-btn:hover{border-color:var(--ink3);background:#f5f1e8}
.ytb-dash .ytb-sw{width:30px;height:17px}
.ytb-dash .ytb-track{border-radius:999px;background:transparent;border:1px solid var(--line2)}
.ytb-dash .ytb-knob{top:2px;left:2px;width:11px;height:11px;border-radius:50%;background:#a8a29e}
.ytb-dash .ytb-sw input:checked~.ytb-track{background:var(--ink);border-color:var(--ink)}
.ytb-dash .ytb-sw input:checked~.ytb-knob{transform:translateX(13px);background:var(--panel)}
.ytb-dash .ytb-sel{background:#fffdf8;color:var(--ink);border:1px solid var(--line2);border-radius:6px;font:11px ui-monospace,SFMono-Regular,Consolas,monospace}
.ytb-dash .ytb-sel:focus{border-color:var(--acc)}
.ytb-dash .ytb-sel option{background:#fffdf8;color:var(--ink)}
.ytb-dash .ytb-inp{background:#fffdf8;border:1px solid var(--line2);border-radius:6px;color:var(--ink)}
.ytb-dash .ytb-inp:focus{border-color:var(--acc);box-shadow:none}
.ytb-dash .ytb-ta{background:#fffdf8;border:1px solid var(--line2);border-radius:6px;color:var(--ink)}
.ytb-dash .ytb-ta:focus{border-color:var(--acc)}
.ytb-dash .ytb-rng input[type=range]{accent-color:var(--ink)}
.ytb-dash .ytb-rngv{color:var(--ink2)}
.ytb-dash .ytb-foot{justify-content:flex-end;gap:16px;padding:10px 18px 12px;border-top:1px solid var(--line);background:transparent}
.ytb-dash .ytb-foot .ytb-btn{flex:0 0 auto;min-width:0}
.ytb-dash .ytb-tabs{padding:0 18px;border-bottom:1px solid var(--line);background:transparent;gap:12px}
.ytb-dash .ytb-tab{color:var(--ink3);font:11px "Segoe UI",system-ui,sans-serif;text-transform:none;letter-spacing:.02em;border-bottom:1px solid transparent;text-shadow:none;padding:7px 2px 6px}
.ytb-dash .ytb-tab:hover{color:var(--ink)}
.ytb-dash .ytb-tab.active{color:var(--ink);border-bottom-color:var(--ink);text-shadow:none;font-weight:600}
.ytb-dash .ytb-tabpanel{padding:8px 0}
.ytb-dash .ytb-section-hdr{font:600 10px/1 "Segoe UI",system-ui,sans-serif;letter-spacing:.08em;color:var(--ink3);text-shadow:none;padding:12px 0 4px}
.ytb-dash .ytb-section-hdr::after{background:var(--line)}
.ytb-dash .ytb-meter{height:5px;background:#efece7;border-radius:3px}
.ytb-dash .ytb-meter-fill{background:var(--ink);border-radius:3px}
.ytb-dash .ytb-meter-fill.ok{background:#4a7d5d}
.ytb-dash .ytb-meter-fill.warn{background:#b45309}
.ytb-dash .ytb-meter-fill.crit{background:#b91c1c}
.ytb-dash .ytp-kbd{background:#fffdf8;border:1px solid var(--line2);border-bottom-width:2px;border-radius:4px;color:var(--ink2);font:9.5px ui-monospace,monospace;padding:1px 5px}
.ytb-dash .ytb-chip{background:rgba(180,83,9,.07);color:var(--acc);border:1px solid rgba(180,83,9,.35);border-radius:999px;font:600 10px/1 ui-monospace,SFMono-Regular,Consolas,monospace}
.ytb-dash .ytb-chip.neutral{background:#f5f1e8;color:var(--ink2);border:1px solid var(--line2)}
.ytb-dash .ytb-divider{height:1px;background:var(--line);margin:7px 0}
.ytb-dash .ytb-cat-dot{border:1px solid var(--line2)}
.ytb-dash .ytb-dresize{background:linear-gradient(135deg,transparent 0,transparent 50%,var(--line2) 50%,var(--line2) 55%,transparent 55%,transparent 65%,var(--line2) 65%,var(--line2) 70%,transparent 70%,transparent 80%,var(--line2) 80%,var(--line2) 85%,transparent 85%)}
.ytb-dash .ytb-fp-btn{background:#fffdf8;border:1px solid var(--line2);color:var(--ink)}
.ytb-dash .ytb-fp-btn:hover{background:#f5f1e8;border-color:var(--ink3)}
.ytb-dash .ytb-fp-btn:focus{outline:none;border-color:var(--acc);box-shadow:none}
.ytb-dash .ytb-fp-arrow{color:#a8a29e}
.ytb-dash .ytb-fp-dd{background:#fffdf8;border:1px solid var(--line2);border-radius:8px;box-shadow:0 14px 30px rgba(28,25,23,.16),0 2px 8px rgba(28,25,23,.08);backdrop-filter:none;-webkit-backdrop-filter:none}
.ytb-dash .ytb-fp-search{background:#fffdf8;border:1px solid var(--line2);color:var(--ink)}
.ytb-dash .ytb-fp-search::placeholder{color:#a8a29e}
.ytb-dash .ytb-fp-search:focus{border-color:var(--acc)}
.ytb-dash .ytb-fp-item{color:var(--ink)}
.ytb-dash .ytb-fp-item:hover{background:rgba(180,83,9,.08);color:var(--ink)}
.ytb-dash .ytb-fp-item.selected{background:rgba(180,83,9,.12);color:var(--ink);font-weight:600}
.ytb-dash .ytb-cp-native{border:1px solid var(--line2);background:transparent}
.ytb-dash .ytb-cp-swatch{border:1px solid var(--line2)}
.ytb-dash .ytb-preset-card{background:#fffdf8;border:1px solid var(--line)}
.ytb-dash .ytb-preset-card:hover{background:#f5f1e8;border-color:var(--line2)}
.ytb-dash .ytb-preset-card.active{background:rgba(180,83,9,.08);border-color:rgba(180,83,9,.45)}
.ytb-dash .ytb-preset-name{color:var(--ink)}
.ytb-dash .ytb-preset-desc{color:var(--ink3)}
.ytb-dash .ytb-theme-card{background:#fffdf8;border:1px solid var(--line)}
.ytb-dash .ytb-theme-card:hover{background:#f5f1e8;border-color:var(--line2)}
.ytb-dash .ytb-theme-card.active{border-color:var(--acc);background:rgba(180,83,9,.07)}
.ytb-dash .ytb-theme-swatch{border:1px solid rgba(0,0,0,.08)}
.ytb-dash .ytb-theme-name{color:var(--ink2)}
.ytb-dash .ytb-hcard{background:#fffdf8;border:1px solid var(--line);border-radius:8px}
.ytb-dash .ytb-hcard:hover{background:#f5f1e8}
.ytb-dash .ytb-hthumb{border:1px solid var(--line);background:#efece7 center/cover no-repeat}
.ytb-dash .ytb-hbadge{background:rgba(28,25,23,.82)}
.ytb-dash .ytb-hbadge.res{background:rgba(180,83,9,.9)}
.ytb-dash .ytb-htitle{color:var(--ink)}
.ytb-dash .ytb-hchan{color:var(--ink2)}
.ytb-dash .ytb-hmeta{color:var(--ink3)}
.ytb-dash .ytb-hpt{background:#efece7}
.ytb-dash .ytb-hpf{background:var(--ink)}
.ytb-dash .ytb-hpf.done{background:#4a7d5d}
.ytb-dash .ytb-hist-panel{background:transparent;border:1px solid var(--line);border-radius:8px}
.ytb-dash .ytb-hist-search{background:#fffdf8;color:var(--ink);border:1px solid var(--line2)}
.ytb-dash .ytb-hist-search:focus{border-color:var(--acc)}
.ytb-dash .ytb-hist-loading,.ytb-dash .ytb-hist-empty{color:var(--ink3)}
.ytb-dash .ytb-hist-list{scrollbar-color:#d6d3d1 transparent}
.ytb-dash .ytb-hist-loadmore{background:none!important}
.ytb-dash .ytb-hist-note{color:var(--ink3);background:#f5f1e8}
.ytb-dash .ytb-elem-list{background:transparent;border:1px solid var(--line)}
.ytb-dash .ytb-elem-group-hdr{color:var(--ink3);border-top:1px solid var(--line)}
.ytb-dash .ytb-elem-row:hover{background:rgba(180,83,9,.06)}
.ytb-dash .ytb-elem-row.on{background:rgba(180,83,9,.08)}
.ytb-dash .ytb-elem-cb{accent-color:var(--ink)}
.ytb-dash .ytb-elem-name{color:#44403c}
.ytb-dash .ytb-elem-match{color:var(--ink3)}
.ytb-dash .ytb-elem-sec-title{color:var(--ink3);border-top:1px solid var(--line)}
.ytb-dash .ytb-geo-dd{background:#fffdf8;border:1px solid var(--line2);border-radius:8px;box-shadow:0 14px 30px rgba(28,25,23,.16),0 2px 8px rgba(28,25,23,.08);backdrop-filter:none;-webkit-backdrop-filter:none}
.ytb-dash .ytb-geo-row{color:var(--ink2)}
.ytb-dash .ytb-geo-row:hover,.ytb-dash .ytb-geo-row.hot{background:rgba(180,83,9,.08);color:var(--ink)}
.ytb-dash .ytb-geo-row.selected{background:rgba(180,83,9,.12);color:var(--ink);font-weight:600}
.ytb-dash .ytb-geo-code{color:var(--ink3)}
.ytb-dash .ytb-geo-empty{color:var(--ink3)}
.ytb-dash .ytb-geo-status{background:#f5f1e8;color:var(--acc)}
.ytb-dash .ytb-net-card{background:#fffdf8;border:1px solid var(--line)}
.ytb-dash .ytb-net-card-label{color:var(--ink3)}
.ytb-dash .ytb-net-card-value{color:var(--ink)}
.ytb-dash .ytb-net-card-sub{color:var(--ink3)}
.ytb-dash .ytb-net-session{background:#f5f1e8;color:var(--acc)}
.ytb-dash .ytb-net-legend-item{color:var(--ink2)}
.ytb-dash .ytb-net-chart{background:#efece7;border:1px solid var(--line)}
.ytb-dash .ytb-net-chart::before{background:rgba(28,25,23,.08)}
.ytb-dash .ytb-net-axis{color:var(--ink3)}
.ytb-dash .ytb-net-hosts{background:#fffdf8;border:1px solid var(--line)}
.ytb-dash .ytb-net-host-row{border-bottom:1px solid #efece7}
.ytb-dash .ytb-net-host-name{color:#44403c}
.ytb-dash .ytb-net-host-bytes{color:var(--acc)}
.ytb-dash .ytb-net-budget{background:#fffdf8;border:1px solid var(--line)}
.ytb-dash .ytb-net-budget-bar{background:#efece7}
.ytb-dash .ytb-net-budget-fill{background:#4a7d5d}
.ytb-dash .ytb-net-budget-fill.warn{background:#b45309}
.ytb-dash .ytb-net-budget-fill.crit{background:#b91c1c}
.ytb-dash .ytb-net-budget-detail{color:#44403c}
.ytb-dash .ytb-net-qualities{background:#fffdf8;border:1px solid var(--line)}
.ytb-dash .ytb-net-q-track{background:#efece7}
.ytb-dash .ytb-net-q-bytes{color:#44403c}
.ytb-dash .ytb-perf-mem{background:#f5f1e8;color:var(--acc)}
.ytb-dash .ytb-perf-membar{background:#efece7}
.ytb-dash .ytb-perf-memfill{background:#4a7d5d}
.ytb-dash .ytb-perf-state{color:var(--ink2)}
.ytb-dash .ytb-perf-table{background:#fffdf8;border:1px solid var(--line)}
.ytb-dash .ytb-perf-row{border-bottom:1px solid #efece7}
.ytb-dash .ytb-perf-hdr{color:var(--acc);background:#f5f1e8;border-bottom:1px solid var(--line)}
.ytb-dash .ytb-perf-row .ytb-perf-c1{color:#44403c}
.ytb-dash .ytb-perf-row .ytb-perf-c2,.ytb-dash .ytb-perf-row .ytb-perf-c3,.ytb-dash .ytb-perf-row .ytb-perf-c4,.ytb-dash .ytb-perf-row .ytb-perf-c5{color:var(--ink2)}
.ytb-dash .ytb-sbsub-status{background:#f5f1e8;color:var(--ink2)}
.ytb-dash .ytb-hk-lbl{color:#44403c}
.ytb-dash .ytb-hk-key{background:#fffdf8;border:1px solid var(--line2);color:var(--acc)}
.ytb-dash .ytb-hk-key.listening{background:rgba(185,28,28,.08);border-color:#b91c1c;color:#b91c1c}
.ytb-dash .ytb-hk-key.empty{color:var(--ink3)}
.ytb-dash .ytb-hk-clr{background:none;color:var(--ink3)}
.ytb-dash .ytb-hk-clr:hover{background:rgba(185,28,28,.1);color:#b91c1c}
.ytb-dash .ytb-toggle-pill{background:#f5f1e8;color:var(--ink2)}
`;
if (CALM_CSS.includes("'") || CALM_CSS.includes("\\")) {
  console.error("CALM_CSS must not contain single quotes or backslashes");
  process.exit(1);
}
const addEnc = "\\n" + CALM_CSS.replace(/\n/g, "\\n");

let out = src;
const aborts = [];
const replOnce = (label, search, sub) => {
  const n = out.split(search).length - 1;
  if (n !== 1) aborts.push(`${label}: expected 1 occurrence, found ${n}`);
  else out = out.replace(search, sub);
};

// 1) Append the Calm CSS to the end of the panel stylesheet string.
replOnce(
  "css-terminator",
  "';\n          try {",
  addEnc + "';\n          try {",
);

// 2) Masthead label; version meta is re-calibrated below once u exists.
replOnce("title text", 'document.createTextNode("YourTube")', 'document.createTextNode("YourTube, plainly.")');

// 2b) Set the version meta once the sorted card list exists (u.length = visible modules).
replOnce(
  "ver meta",
  ");\n            // Per-category pages.",
  ");\n            _ver.textContent = u.length + \" modules \\u00b7 v\" + n;\n            // Per-category pages.",
);

// 3) Search placeholder + relocate the search field into the masthead row.
replOnce(
  "search placeholder",
  '((c.type = "search"),\n          (c.className = "ytb-search ytb-no-drag"),\n          (c.placeholder = "filter features / setting keys…"));',
  '((c.type = "search"),\n          (c.className = "ytb-search ytb-no-drag"),\n          (c.placeholder = "Looking for something?")),\n        t.appendChild(c);',
);
replOnce("search detach", "\n            wo.appendChild(c);", "");

if (aborts.length) {
  console.error("apply-calm ABORTED:");
  for (const a of aborts) console.error("  - " + a);
  process.exit(1);
}
fs.writeFileSync(FILE, out);
console.log("Calm theme applied to", FILE, `(+${out.length - src.length} bytes, backup at ${BACKUP})`);
