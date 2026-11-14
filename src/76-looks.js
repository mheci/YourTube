const YT_LOOK_SW = {
  pill: {
    w: 34, h: 20, r: "999px", k: 14, kr: "50%", move: 14, top: 2, left: 2,
    bg: "var(--card-lo)", border: "1px solid var(--line2)",
    knob: "var(--ink3)", on: "var(--acc)", knobOn: "#fff",
  },
  square: {
    w: 34, h: 20, r: "2px", k: 10, kr: "1px", move: 14, top: 4, left: 4,
    bg: "transparent", border: "1px solid var(--line2)",
    knob: "var(--ink3)", on: "var(--acc)", knobOn: "#fff",
  },
  ios: {
    w: 40, h: 24, r: "999px", k: 18, kr: "50%", move: 18, top: 3, left: 2,
    bg: "#e5e5ea", border: "0",
    knob: "#fff", on: "#34c759", knobOn: "#fff",
  },
  bevel: {
    w: 30, h: 18, r: "0", k: 8, kr: "0", move: 12, top: 3, left: 3,
    bg: "#fff", border: "2px solid",
    borderC: "#404040 #fff #fff #404040",
    knob: "#000080", on: "#c0c0c0", knobOn: "#000080",
  },
};

const YT_DASH_LOOKS = [
  {
    id: "swiss", name: "Swiss Signal", mode: "light", nav: "rail", sw: "square",
    card: "row", radius: "0", cardRadius: "0", borderW: "1px",
    font: 'Helvetica Neue,Helvetica,Arial,sans-serif',
    titleFont: 'Helvetica Neue,Helvetica,Arial,sans-serif',
    titleSize: "23px", titleWeight: "700", titleSpace: "-.04em",
    v: {
      panel: "#f4f4f0", panel2: "#f4f4f0", panel3: "#eaeae4",
      line: "#d8d8d0", line2: "#bfbfb5", ink: "#111111", ink2: "#5c5c57", ink3: "#8a8a84",
      card: "#f4f4f0", cardHi: "#ecece6", cardLo: "#d8d8d0",
      acc: "#1d4ed8", accDim: "rgba(29,78,216,.08)", accInk: "29,78,216",
      ok: "#15803d", crit: "#b91c1c", critInk: "185,28,28", shadowInk: "17,17,17",
    },
    swx: { bg: "transparent", on: "#1d4ed8", knobOn: "#fff" },
    extra: (s) => `
${s} .ytb-nav-item.active{background:var(--ink);color:var(--panel);border-left-color:var(--ink)}
${s} .ytb-nav-item.active .ytb-nav-count{color:var(--panel)}
${s} .ytb-card{border:0;border-bottom:1px solid var(--line);border-left:0;background:transparent;padding:11px 2px}
${s} .ytb-card:hover{background:transparent;border-bottom-color:var(--acc)}
${s} .ytb-card.on{border-left:0}
${s} .ytb-btn{border:0;border-bottom:1px solid var(--ink);border-radius:0;background:transparent;padding:1px 0 2px}
${s} .ytb-btn.primary{background:var(--ink);border-color:var(--ink);color:var(--panel)}
${s} .ytb-search{border:0;border-bottom:1px solid var(--line2);border-radius:0}
${s} .ytb-foot{border-top:1px solid var(--line)}
`,
  },
  {
    id: "bento", name: "Bento Glass", mode: "light", nav: "rail", sw: "pill",
    card: "surface", radius: "22px", cardRadius: "16px", borderW: "1px",
    font: 'Segoe UI Variable,Segoe UI,system-ui,sans-serif',
    titleFont: 'Segoe UI Variable,Segoe UI,system-ui,sans-serif',
    titleSize: "23px", titleWeight: "800", titleSpace: "-.04em",
    headerBg: "linear-gradient(135deg,rgba(79,70,229,.08),rgba(219,39,119,.05))",
    shadow: "0 24px 60px rgba(40,50,90,.2)",
    v: {
      panel: "#eef1f7", panel2: "#f8faff", panel3: "#ffffff",
      line: "#dde2ee", line2: "#c9d1e4", ink: "#16181d", ink2: "#687083", ink3: "#98a1b5",
      card: "#ffffff", cardHi: "#f2f5fc", cardLo: "#e6ebf7",
      acc: "#4f46e5", accDim: "rgba(79,70,229,.1)", accInk: "79,70,229",
      ok: "#059669", crit: "#db2777", critInk: "219,39,119", shadowInk: "40,50,90",
    },
    cardShadow: "0 8px 20px rgba(40,50,90,.06)",
    extra: (s) => `
${s} .ytb-nav-item{border-radius:11px}
${s} .ytb-nav-item.active{background:var(--panel2);color:var(--acc);border-left-color:transparent}
${s} .ytb-nav-item.active .ytb-nav-count{color:var(--acc)}
${s} .ytb-nav-count{background:var(--panel3);border-radius:999px;padding:2px 6px}
${s} .ytb-card{background:linear-gradient(145deg,#fff,rgba(255,255,255,.7))}
${s} .ytb-btn{border-radius:10px}
${s} .ytb-search{background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:7px 11px}
${s} .ytb-corecell{background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:6px 9px}
`,
  },
  {
    id: "terminal", name: "Terminal Ops", mode: "dark", nav: "top", sw: "square",
    card: "surface", radius: "0", cardRadius: "0", borderW: "1px",
    font: 'Cascadia Code,Consolas,monospace',
    titleFont: 'Cascadia Code,Consolas,monospace',
    titleSize: "20px", titleWeight: "500", titleSpace: "0",
    headerBg: "#080f0b",
    v: {
      panel: "#070b09", panel2: "#0b120d", panel3: "#0f1a12",
      line: "#1b3325", line2: "#2a4a33", ink: "#c7f9c0", ink2: "#6d8d72", ink3: "#4f6b54",
      card: "#0b120d", cardHi: "#102016", cardLo: "#16301d",
      acc: "#8dff5a", accDim: "rgba(141,255,90,.1)", accInk: "141,255,90",
      ok: "#8dff5a", crit: "#ffb454", critInk: "255,180,84", shadowInk: "0,0,0",
    },
    swx: { bg: "#050806", on: "rgba(141,255,90,.14)", knobOn: "#8dff5a" },
    extra: (s) => `
${s}{background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 3px);background-size:100% 3px}
${s} .ytb-dtitle::before{content:"> ";color:var(--ink3)}
${s} .ytb-nav{border-bottom-style:dashed}
${s} .ytb-nav-item.active{background:var(--acc);color:#07100a;border-bottom-color:var(--acc);font-weight:700}
${s} .ytb-nav-item.active .ytb-nav-count{color:#07100a}
${s} .ytb-card{border-style:dashed}
${s} .ytb-card.on{border-left-color:var(--acc);border-left-style:solid}
${s} .ytb-btn{border-radius:0;background:#080f0b;border:1px solid var(--line);color:var(--ink)}
${s} .ytb-btn.primary{background:var(--acc);color:#07100a;border-color:var(--acc)}
${s} .ytb-search{border:1px solid var(--line);border-radius:0;background:#050806;padding:5px 8px}
${s} .ytb-name{color:var(--acc)}
${s} .ytb-sum{color:var(--ink2)}
${s} .ytb-looksel{border-radius:0;background-color:#050806}
`,
  },
  {
    id: "paper", name: "Paper Ledger", mode: "light", nav: "rail", sw: "square",
    card: "row", radius: "0", cardRadius: "0", borderW: "1px",
    font: 'Georgia,Times New Roman,serif',
    titleFont: 'Georgia,Times New Roman,serif',
    titleSize: "25px", titleWeight: "400", titleSpace: "-.02em",
    sumFont: 'Georgia,Times New Roman,serif', sumStyle: "italic",
    v: {
      panel: "#f6f1e7", panel2: "#f6f1e7", panel3: "#fbf7ee",
      line: "#d8cfc0", line2: "#c9bfae", ink: "#211a12", ink2: "#756b5c", ink3: "#988d7c",
      card: "#fbf7ee", cardHi: "#f1ebdf", cardLo: "#e3dbcc",
      acc: "#9b2c2c", accDim: "rgba(155,44,44,.08)", accInk: "155,44,44",
      ok: "#4a7d5d", crit: "#9b2c2c", critInk: "155,44,44", shadowInk: "33,26,18",
    },
    extra: (s) => `
${s} .ytb-dhdr{border-bottom:2px solid var(--ink)}
${s} .ytb-dtitle{font-weight:400}
${s} .ytb-dver{font-style:italic;background:transparent;border:0}
${s} .ytb-nav-item{color:var(--ink2);border-bottom:1px dotted transparent}
${s} .ytb-nav-item.active{background:transparent;color:var(--ink);border-left-color:transparent;border-bottom-color:var(--acc)}
${s} .ytb-nav-count{font-style:italic}
${s} .ytb-card{border:0;border-bottom:1px solid var(--line);border-left:0;background:transparent;padding:12px 2px}
${s} .ytb-card.on{border-left:0}
${s} .ytb-name{font-weight:600}
${s} .ytb-btn{border:0;border-bottom:1px solid var(--ink3);border-radius:0;background:transparent;padding:1px 0 2px}
${s} .ytb-btn.primary{background:var(--ink);border-color:var(--ink);color:var(--panel)}
${s} .ytb-search{border:0;border-bottom:1px solid var(--line2);border-radius:0;font-style:italic}
${s} .ytb-foot{border-top:1px solid var(--line)}
`,
  },
  {
    id: "brutal", name: "Neo-Brutal", mode: "light", nav: "rail", sw: "square",
    card: "surface", radius: "0", cardRadius: "0", borderW: "3px",
    font: 'Arial,Helvetica,sans-serif',
    titleFont: 'Arial Black,Arial,sans-serif',
    titleSize: "23px", titleWeight: "900", titleCase: "uppercase", titleSpace: "-.05em",
    headerBg: "#fffdf2",
    shadow: "8px 8px 0 #101010",
    cardShadow: "4px 4px 0 #101010",
    v: {
      panel: "#fffdf2", panel2: "#ffffff", panel3: "#f3ffd0",
      line: "#101010", line2: "#101010", ink: "#101010", ink2: "#3a3a3a", ink3: "#666666",
      card: "#ffffff", cardHi: "#f3ffd0", cardLo: "#ffe6f1",
      acc: "#ff5ca8", accDim: "rgba(215,255,63,.55)", accInk: "255,92,168",
      ok: "#3b5bff", crit: "#ff7a1a", critInk: "255,122,26", shadowInk: "16,16,16",
    },
    swx: { on: "#d7ff3f", knobOn: "#101010", bg: "#fff" },
    extra: (s) => `
${s} .ytb-dhdr{border-bottom:3px solid var(--ink);background:#d7ff3f}
${s} .ytb-nav{background:#d7ff3f;border-right:3px solid var(--ink)}
${s} .ytb-nav-item{border:2px solid transparent;font-weight:700}
${s} .ytb-nav-item.active{background:var(--ink);color:#d7ff3f;border-left-color:var(--ink);box-shadow:3px 3px 0 #3b5bff}
${s} .ytb-nav-item.active .ytb-nav-count{color:#d7ff3f}
${s} .ytb-card{border:3px solid var(--ink)}
${s} .ytb-card:nth-child(3n){background:#f3ffd0}
${s} .ytb-card:nth-child(4n){background:#ffe6f1}
${s} .ytb-btn{border:2px solid var(--ink);border-radius:0;background:#fff;box-shadow:3px 3px 0 var(--ink);color:var(--ink);font-weight:700}
${s} .ytb-btn.primary{background:var(--acc);color:var(--ink);border-color:var(--ink)}
${s} .ytb-search{border:2px solid var(--ink);border-radius:0;background:#fff;padding:5px 8px}
${s} .ytb-sel{border:2px solid var(--ink);border-radius:0;background:#fff}
${s} .ytb-foot{border-top:3px solid var(--ink);background:#d7ff3f}
`,
  },
  {
    id: "apple", name: "Apple Settings", mode: "light", nav: "rail", sw: "ios",
    card: "surface", radius: "18px", cardRadius: "14px", borderW: "0",
    font: '-apple-system,BlinkMacSystemFont,Segoe UI,system-ui,sans-serif',
    titleFont: '-apple-system,BlinkMacSystemFont,Segoe UI,system-ui,sans-serif',
    titleSize: "21px", titleWeight: "700", titleSpace: "-.03em",
    headerBg: "rgba(249,249,251,.9)",
    shadow: "0 22px 55px rgba(0,0,0,.2)",
    cardShadow: "0 1px 2px rgba(0,0,0,.05)",
    v: {
      panel: "#f2f2f7", panel2: "#ffffff", panel3: "#f7f7fb",
      line: "#e3e3e8", line2: "#d1d1d6", ink: "#1c1c1e", ink2: "#6e6e73", ink3: "#a1a1a6",
      card: "#ffffff", cardHi: "#f7f7fb", cardLo: "#e5e5ea",
      acc: "#007aff", accDim: "rgba(0,122,255,.1)", accInk: "0,122,255",
      ok: "#34c759", crit: "#ff3b30", critInk: "255,59,48", shadowInk: "0,0,0",
    },
    swx: { on: "#34c759" },
    extra: (s) => `
${s} .ytb-dhdr{border-bottom:1px solid var(--line)}
${s} .ytb-nav{background:rgba(249,249,251,.86);border-right:1px solid var(--line)}
${s} .ytb-nav-item{border-radius:8px}
${s} .ytb-nav-item.active{background:#e5e5ea;color:var(--ink);border-left-color:transparent}
${s} .ytb-card{border:0}
${s} .ytb-card:hover{background:var(--card-hi)}
${s} .ytb-btn{border:0;border-radius:8px;background:#e5e5ea;color:var(--ink)}
${s} .ytb-btn.primary{background:var(--acc);color:#fff}
${s} .ytb-search{background:#e5e5ea;border:0;border-radius:10px;padding:7px 10px}
${s} .ytb-corecell{background:var(--panel2);border:0;border-radius:10px;padding:6px 9px}
${s} .ytb-foot{border-top:1px solid var(--line)}
`,
  },
  {
    id: "fluent", name: "Fluent Deck", mode: "light", nav: "rail", sw: "pill",
    card: "surface", radius: "10px", cardRadius: "8px", borderW: "1px",
    font: 'Segoe UI Variable,Segoe UI,system-ui,sans-serif',
    titleFont: 'Segoe UI Variable,Segoe UI,system-ui,sans-serif',
    titleSize: "22px", titleWeight: "600", titleSpace: "-.025em",
    headerBg: "rgba(255,255,255,.7)",
    shadow: "0 20px 50px rgba(0,40,80,.18)",
    cardShadow: "0 1px 2px rgba(0,0,0,.05)",
    v: {
      panel: "#f3f3f3", panel2: "#ffffff", panel3: "#f9f9f9",
      line: "#e5e5e5", line2: "#d6d6d6", ink: "#1b1b1b", ink2: "#616161", ink3: "#8a8a8a",
      card: "#ffffff", cardHi: "#f7fafe", cardLo: "#e8f1fb",
      acc: "#0067c0", accDim: "rgba(0,103,192,.08)", accInk: "0,103,192",
      ok: "#0f7b0f", crit: "#c42b1c", critInk: "196,43,28", shadowInk: "0,40,80",
    },
    extra: (s) => `
${s} .ytb-dhdr{background:linear-gradient(135deg,#fff,#eef6fd);border-bottom:1px solid var(--line)}
${s} .ytb-nav{border-right:1px solid var(--line)}
${s} .ytb-nav-item{border-radius:6px;border-left:3px solid transparent}
${s} .ytb-nav-item.active{background:#e8f1fb;color:var(--acc);border-left-color:var(--acc)}
${s} .ytb-btn{border:1px solid var(--line);border-radius:6px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.04)}
${s} .ytb-btn.primary{background:var(--acc);border-color:var(--acc);color:#fff}
${s} .ytb-search{border:1px solid var(--line);border-radius:6px;background:#fff;padding:7px 10px}
`,
  },
  {
    id: "material", name: "Material You", mode: "light", nav: "top", sw: "pill",
    card: "surface", radius: "26px", cardRadius: "24px", borderW: "0",
    font: 'Roboto,Segoe UI,system-ui,sans-serif',
    titleFont: 'Roboto,Segoe UI,system-ui,sans-serif',
    titleSize: "23px", titleWeight: "500", titleSpace: "-.01em",
    headerBg: "#fbf8ff",
    shadow: "0 24px 60px rgba(60,45,90,.2)",
    v: {
      panel: "#fbf8ff", panel2: "#ffffff", panel3: "#f7f2fa",
      line: "#e7e0ec", line2: "#cac4d0", ink: "#1d1b20", ink2: "#625b71", ink3: "#8b8494",
      card: "#ffffff", cardHi: "#f7f2fa", cardLo: "#eaddff",
      acc: "#6750a4", accDim: "#eaddff", accInk: "103,80,164",
      ok: "#146c2e", crit: "#ba1a1a", critInk: "186,26,26", shadowInk: "60,45,90",
    },
    extra: (s) => `
${s} .ytb-nav{padding:10px 16px}
${s} .ytb-nav-item{border-radius:999px;padding:5px 10px;border-bottom:0}
${s} .ytb-nav-item.active{background:var(--acc-dim);color:var(--acc);border-bottom-color:transparent}
${s} .ytb-nav-item.active .ytb-nav-count{color:var(--acc)}
${s} .ytb-card{background:var(--panel2)}
${s} .ytb-card.on{background:#f7f2fa;border-left-color:transparent}
${s} .ytb-card:nth-child(2n){background:#f7f2fa}
${s} .ytb-btn{border:0;border-radius:999px;background:var(--panel2);color:var(--acc);box-shadow:0 1px 3px rgba(0,0,0,.08)}
${s} .ytb-btn.primary{background:var(--acc);color:#fff}
${s} .ytb-search{border:0;border-radius:999px;background:var(--panel2);padding:8px 13px}
${s} .ytb-sel{border:0;border-radius:999px;background:var(--panel2)}
`,
  },
  {
    id: "cyber", name: "Cyber HUD", mode: "dark", nav: "rail", sw: "square",
    card: "surface", radius: "0", cardRadius: "0", borderW: "1px",
    font: 'Cascadia Code,Consolas,monospace',
    titleFont: 'Cascadia Code,Consolas,monospace',
    titleSize: "21px", titleWeight: "500", titleSpace: "0",
    headerBg: "#070b12",
    shadow: "0 0 40px rgba(0,240,255,.1),0 30px 80px rgba(0,0,0,.8)",
    v: {
      panel: "#05070d", panel2: "#070b12", panel3: "#0a101a",
      line: "#123a44", line2: "#1b5361", ink: "#d8f7ff", ink2: "#8aa7b1", ink3: "#5e7a86",
      card: "#04070b", cardHi: "#0a141d", cardLo: "#0f2530",
      acc: "#00f0ff", accDim: "rgba(0,240,255,.08)", accInk: "0,240,255",
      ok: "#b6ff3b", crit: "#ff2bd6", critInk: "255,43,214", shadowInk: "0,0,0",
    },
    swx: { bg: "#04070b", on: "rgba(0,240,255,.1)", knobOn: "#00f0ff" },
    extra: (s) => `
${s}{background-image:repeating-linear-gradient(0deg,rgba(0,240,255,.03) 0 1px,transparent 1px 4px)}
${s} .ytb-nav{border-right:1px solid var(--line)}
${s} .ytb-nav-item{border-left:2px solid transparent}
${s} .ytb-nav-item.active{background:rgba(0,240,255,.08);color:var(--acc);border-left-color:var(--acc)}
${s} .ytb-card{clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%);border:1px solid var(--line)}
${s} .ytb-card.on{border-left-color:var(--acc)}
${s} .ytb-btn{border:1px solid var(--line);border-radius:0;background:#04070b;color:var(--acc)}
${s} .ytb-btn.primary{background:var(--acc);color:#031013;border-color:var(--acc)}
${s} .ytb-search{border:1px solid var(--line);border-radius:0;background:#04070b;padding:5px 8px}
${s} .ytb-name{color:#fff}
${s} .ytb-name::before{content:"> ";color:var(--ink3)}
`,
  },
  {
    id: "bio", name: "Biophilic Calm", mode: "light", nav: "rail", sw: "pill",
    card: "surface", radius: "26px", cardRadius: "22px", borderW: "1px",
    font: 'Segoe UI,system-ui,sans-serif',
    titleFont: 'Georgia,Times New Roman,serif',
    titleSize: "25px", titleWeight: "400", titleSpace: "-.02em",
    headerBg: "rgba(247,248,242,.5)",
    shadow: "0 26px 60px rgba(60,80,60,.18)",
    cardShadow: "0 2px 8px rgba(60,80,60,.04)",
    v: {
      panel: "#eef2e8", panel2: "#f7f8f2", panel3: "#e3ecd8",
      line: "#d7ddcf", line2: "#c9d6c2", ink: "#2f3a2f", ink2: "#6b7a67", ink3: "#95a190",
      card: "#f7f8f2", cardHi: "#e3ecd8", cardLo: "#dde7d4",
      acc: "#55705a", accDim: "rgba(85,112,90,.1)", accInk: "85,112,90",
      ok: "#55705a", crit: "#b56a4a", critInk: "181,106,74", shadowInk: "47,58,47",
    },
    extra: (s) => `
${s}{background-image:radial-gradient(600px 400px at 85% 10%,#e3ecd8 0,transparent 55%)}
${s} .ytb-nav-item{border-radius:999px;padding-left:11px}
${s} .ytb-nav-item.active{background:#e3e9db;color:var(--acc);border-left-color:transparent}
${s} .ytb-nav-item.active .ytb-nav-count{color:var(--acc)}
${s} .ytb-card:nth-child(2n){background:rgba(227,236,216,.6)}
${s} .ytb-btn{border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.5);color:var(--acc)}
${s} .ytb-btn.primary{background:var(--acc);color:#fff}
${s} .ytb-search{border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.5);padding:8px 13px}
`,
  },
  {
    id: "editorial", name: "Editorial Studio", mode: "light", nav: "top", sw: "square",
    card: "row", radius: "0", cardRadius: "0", borderW: "1px",
    font: 'Georgia,Times New Roman,serif',
    titleFont: 'Georgia,Times New Roman,serif',
    titleSize: "27px", titleWeight: "400", titleSpace: "-.03em",
    sumFont: 'Georgia,Times New Roman,serif',
    headerBg: "#fbf7ef",
    v: {
      panel: "#fbf7ef", panel2: "#fbf7ef", panel3: "#f4eee2",
      line: "#e2d8c8", line2: "#d9cfbf", ink: "#17130e", ink2: "#6f6559", ink3: "#9a8e7f",
      card: "#fbf7ef", cardHi: "#f4eee2", cardLo: "#e8dfd0",
      acc: "#c1121f", accDim: "rgba(193,18,31,.07)", accInk: "193,18,31",
      ok: "#3f6b4a", crit: "#c1121f", critInk: "193,18,31", shadowInk: "23,19,14",
    },
    extra: (s) => `
${s} .ytb-dhdr{border-bottom:1px solid var(--ink)}
${s} .ytb-nav{border-bottom:1px solid var(--line);padding:9px 16px}
${s} .ytb-nav-item{border-left:1px solid var(--line);padding:3px 9px}
${s} .ytb-nav-item:first-child{border-left:0}
${s} .ytb-nav-item.active{color:var(--ink);border-bottom:1px solid var(--acc);font-weight:600}
${s} .ytb-card{border:0;border-top:1px solid var(--line);border-left:0;background:transparent;padding:12px 2px}
${s} .ytb-card.on{border-left:0}
${s} .ytb-btn{border:0;border-bottom:1px solid var(--ink);border-radius:0;background:transparent;padding:1px 0 2px}
${s} .ytb-btn.primary{background:transparent;border-bottom-color:var(--acc);color:var(--acc)}
${s} .ytb-search{border:0;border-bottom:1px solid var(--line);border-radius:0;font-style:italic}
${s} .ytb-foot{border-top:1px solid var(--ink)}
`,
  },
  {
    id: "pixel", name: "Pixel Arcade", mode: "dark", nav: "top", sw: "square",
    card: "surface", radius: "0", cardRadius: "0", borderW: "3px",
    font: 'Courier New,Consolas,monospace',
    titleFont: 'Courier New,Consolas,monospace',
    titleSize: "19px", titleWeight: "700", titleCase: "uppercase", titleSpace: "-.02em",
    headerBg: "#29366f",
    shadow: "8px 8px 0 #000",
    cardShadow: "4px 4px 0 #000",
    v: {
      panel: "#1a1c2c", panel2: "#29366f", panel3: "#3b5dc9",
      line: "#566c86", line2: "#8090a8", ink: "#f4f4f4", ink2: "#94b0c2", ink3: "#6b7d94",
      card: "#29366f", cardHi: "#3b5dc9", cardLo: "#566c86",
      acc: "#ffcd75", accDim: "rgba(255,205,117,.14)", accInk: "255,205,117",
      ok: "#38b764", crit: "#ff77a8", critInk: "255,119,168", shadowInk: "0,0,0",
    },
    swx: { on: "#38b764", knobOn: "#1a1c2c", bg: "#1a1c2c" },
    extra: (s) => `
${s} .ytb-dhdr{border-bottom:3px solid #000;background:#29366f}
${s} .ytb-dtitle{color:#ffcd75}
${s} .ytb-nav{border-bottom:3px solid #000;background:#29366f;padding:7px 14px}
${s} .ytb-nav-item{color:#94b0c2;padding:4px 7px;border:2px solid transparent}
${s} .ytb-nav-item.active{background:#41a6f6;color:#1a1c2c;border-color:#000;box-shadow:2px 2px 0 #000}
${s} .ytb-nav-item.active .ytb-nav-count{color:#1a1c2c}
${s} .ytb-card{border:3px solid #000}
${s} .ytb-card:nth-child(2n){background:#3b5dc9}
${s} .ytb-card.on{border-left-color:#38b764}
${s} .ytb-btn{border:3px solid #000;border-radius:0;background:#29366f;color:#f4f4f4;box-shadow:3px 3px 0 #000}
${s} .ytb-btn.primary{background:#38b764;color:#1a1c2c}
${s} .ytb-search{border:3px solid #000;border-radius:0;background:#29366f;padding:5px 7px}
${s} .ytb-name{color:#ffcd75}
${s} .ytb-foot{border-top:3px solid #000;background:#29366f}
`,
  },
  {
    id: "dense", name: "Data Dense", mode: "light", nav: "rail", sw: "pill",
    card: "surface", radius: "6px", cardRadius: "4px", borderW: "1px",
    font: 'Segoe UI,system-ui,sans-serif',
    titleFont: 'Segoe UI,system-ui,sans-serif',
    titleSize: "21px", titleWeight: "700", titleSpace: "-.03em",
    headerBg: "#ffffff",
    bodyPad: "2px 12px 6px", cardPad: "6px 9px", gap: "3px",
    v: {
      panel: "#f7f8fa", panel2: "#ffffff", panel3: "#f1f3f7",
      line: "#e5e7eb", line2: "#d1d5db", ink: "#111827", ink2: "#6b7280", ink3: "#9ca3af",
      card: "#ffffff", cardHi: "#f8fafc", cardLo: "#e5e7eb",
      acc: "#2563eb", accDim: "rgba(37,99,235,.08)", accInk: "37,99,235",
      ok: "#059669", crit: "#dc2626", critInk: "220,38,38", shadowInk: "17,24,39",
    },
    extra: (s) => `
${s} .ytb-dhdr{padding:11px 12px 7px}
${s} .ytb-nav{padding:6px 5px;width:158px}
${s} .ytb-nav-item{padding:4px 7px;font-size:10.5px}
${s} .ytb-name{font-size:11.5px}
${s} .ytb-sum{font-size:10.5px;margin-top:2px}
${s} .ytb-card{padding:6px 9px}
${s} .ytb-btn{padding:3px 7px;font-size:10px}
${s} .ytb-search{padding:5px 8px;font-size:11px}
`,
  },
  {
    id: "memphis", name: "Memphis Play", mode: "light", nav: "top", sw: "pill",
    card: "surface", radius: "18px", cardRadius: "18px", borderW: "2px",
    font: 'Arial,Helvetica,sans-serif',
    titleFont: 'Arial Black,Arial,sans-serif',
    titleSize: "24px", titleWeight: "900", titleSpace: "-.04em",
    headerBg: "#fff8e7",
    shadow: "6px 6px 0 #1a1a1a",
    cardShadow: "4px 4px 0 #1a1a1a",
    v: {
      panel: "#fff8e7", panel2: "#ffffff", panel3: "#f0fffe",
      line: "#1a1a1a", line2: "#1a1a1a", ink: "#1a1a1a", ink2: "#4a4a4a", ink3: "#7a7a7a",
      card: "#ffffff", cardHi: "#fff0f7", cardLo: "#ffd447",
      acc: "#47c9c1", accDim: "rgba(71,201,193,.16)", accInk: "71,201,193",
      ok: "#47c9c1", crit: "#ff4fa3", critInk: "255,79,163", shadowInk: "26,26,26",
    },
    swx: { on: "#47c9c1", knobOn: "#fff", bg: "#fff" },
    extra: (s) => `
${s}{background-image:radial-gradient(circle at 10px 10px,rgba(26,26,26,.08) 1px,transparent 1.5px);background-size:20px 20px}
${s} .ytb-dhdr{border-bottom:2px dashed var(--ink)}
${s} .ytb-nav-item{border:2px solid var(--ink);border-radius:999px;padding:3px 9px;background:#fff}
${s} .ytb-nav-item.active{background:#ffd447;color:var(--ink);border-bottom-color:var(--ink);box-shadow:2px 2px 0 var(--ink);font-weight:700}
${s} .ytb-nav-item.active .ytb-nav-count{color:var(--ink)}
${s} .ytb-card{border:2px solid var(--ink)}
${s} .ytb-card:nth-child(2n){background:#f0fffe}
${s} .ytb-card:nth-child(3n){background:#fff0f7}
${s} .ytb-btn{border:2px solid var(--ink);border-radius:999px;background:#fff;box-shadow:2px 2px 0 var(--ink);color:var(--ink);font-weight:700}
${s} .ytb-btn.primary{background:var(--acc);color:#fff}
${s} .ytb-search{border:2px solid var(--ink);border-radius:999px;background:#fff;padding:5px 9px;box-shadow:2px 2px 0 var(--ink)}
${s} .ytb-foot{border-top:2px dashed var(--ink)}
`,
  },
  {
    id: "blueprint", name: "Blueprint", mode: "dark", nav: "top", sw: "square",
    card: "surface", radius: "0", cardRadius: "0", borderW: "1px",
    font: 'Consolas,IBM Plex Mono,monospace',
    titleFont: 'Consolas,IBM Plex Mono,monospace',
    titleSize: "22px", titleWeight: "400", titleSpace: "0",
    headerBg: "rgba(15,42,68,.82)",
    v: {
      panel: "#0f2a44", panel2: "#0f2a44", panel3: "#143554",
      line: "#33536e", line2: "#4a6a86", ink: "#eaf4ff", ink2: "#8fb3d1", ink3: "#6b8ba8",
      card: "#0f2a44", cardHi: "#143554", cardLo: "#1b4568",
      acc: "#8fd3ff", accDim: "rgba(143,211,255,.08)", accInk: "143,211,255",
      ok: "#8fd3ff", crit: "#ffb4a8", critInk: "255,180,168", shadowInk: "0,0,0",
    },
    swx: { bg: "transparent", on: "rgba(143,211,255,.16)", knobOn: "#8fd3ff" },
    extra: (s) => `
${s}{background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:24px 24px}
${s} .ytb-nav-item{border:1px solid var(--line);padding:3px 7px;font-size:10px;color:var(--ink2)}
${s} .ytb-nav-item.active{border-color:var(--acc);color:var(--acc);border-bottom-color:var(--acc)}
${s} .ytb-nav-item.active .ytb-nav-count{color:var(--acc)}
${s} .ytb-card{border-style:dashed}
${s} .ytb-btn{border:1px solid var(--line);border-radius:0;background:transparent;color:var(--ink)}
${s} .ytb-btn.primary{border-color:var(--acc);background:transparent;color:var(--acc)}
${s} .ytb-search{border:1px solid var(--line);border-radius:0;background:transparent;padding:5px 8px}
${s} .ytb-name{font-weight:500}
`,
  },
  {
    id: "noir", name: "Luxury Noir", mode: "dark", nav: "rail", sw: "square",
    card: "row", radius: "0", cardRadius: "0", borderW: "1px",
    font: 'Didot,Georgia,Times New Roman,serif',
    titleFont: 'Didot,Georgia,Times New Roman,serif',
    titleSize: "27px", titleWeight: "400", titleSpace: "-.02em",
    headerBg: "rgba(11,11,11,.7)",
    shadow: "0 30px 80px rgba(0,0,0,.7)",
    v: {
      panel: "#0b0b0b", panel2: "#111111", panel3: "#151515",
      line: "#2a2318", line2: "#55442a", ink: "#f4efe4", ink2: "#9b9488", ink3: "#6e685e",
      card: "#111111", cardHi: "#171717", cardLo: "#221c13",
      acc: "#d6b36a", accDim: "rgba(214,179,106,.1)", accInk: "214,179,106",
      ok: "#d6b36a", crit: "#d6b36a", critInk: "214,179,106", shadowInk: "0,0,0",
    },
    swx: { bg: "transparent", on: "rgba(214,179,106,.16)", knobOn: "#d6b36a" },
    extra: (s) => `
${s} .ytb-dhdr{border-bottom:1px solid var(--line2)}
${s} .ytb-nav{border-right:1px solid var(--line)}
${s} .ytb-nav-item{border-bottom:1px solid transparent;padding:7px 0}
${s} .ytb-nav-item.active{background:transparent;color:var(--acc);border-left-color:transparent;border-bottom-color:var(--line2)}
${s} .ytb-nav-count{color:var(--ink3)}
${s} .ytb-card{border:0;border-bottom:1px solid var(--line);border-left:0;background:transparent;padding:12px 2px}
${s} .ytb-card.on{border-left:0}
${s} .ytb-name{font-weight:500;font-size:13.5px}
${s} .ytb-btn{border:1px solid var(--line2);border-radius:0;background:transparent;color:var(--ink)}
${s} .ytb-btn.primary{background:var(--acc);border-color:var(--acc);color:#0b0b0b}
${s} .ytb-search{border:1px solid var(--line2);border-radius:0;background:transparent;padding:6px 9px}
${s} .ytb-foot{border-top:1px solid var(--line2)}
`,
  },
  {
    id: "retro", name: "Retro OS", mode: "light", nav: "rail", sw: "bevel",
    card: "surface", radius: "0", cardRadius: "0", borderW: "2px",
    font: 'Tahoma,MS Sans Serif,Arial,sans-serif',
    titleFont: 'Tahoma,MS Sans Serif,Arial,sans-serif',
    titleSize: "18px", titleWeight: "700", titleSpace: "0",
    headerBg: "#c0c0c0",
    shadow: "8px 8px 0 rgba(0,0,0,.25)",
    v: {
      panel: "#008080", panel2: "#c0c0c0", panel3: "#d4d0c8",
      line: "#808080", line2: "#404040", ink: "#000000", ink2: "#222222", ink3: "#555555",
      card: "#c0c0c0", cardHi: "#d4d0c8", cardLo: "#a0a0a0",
      acc: "#000080", accDim: "rgba(0,0,128,.12)", accInk: "0,0,128",
      ok: "#008000", crit: "#800000", critInk: "128,0,0", shadowInk: "0,0,0",
    },
    swx: { on: "#c0c0c0", knobOn: "#000080" },
    extra: (s) => `
${s}{border:3px solid;border-color:#fff #404040 #404040 #fff}
${s} .ytb-dhdr{border-bottom:2px solid #000;background:#000080;color:#fff}
${s} .ytb-dtitle{color:#fff}
${s} .ytb-dver{color:#d4d0c8;background:transparent;border:0}
${s} .ytb-btn{border:2px solid;border-color:#fff #404040 #404040 #fff;border-radius:0;background:#c0c0c0;color:#000;padding:2px 6px}
${s} .ytb-btn.primary{background:#c0c0c0;color:#000080;font-weight:700}
${s} .ytb-main{background:#c0c0c0}
${s} .ytb-nav{background:#c0c0c0;border-right:2px solid;border-color:#fff #404040 #404040 #fff;padding:6px}
${s} .ytb-nav-item{border:0;border-radius:0;padding:3px 4px;color:#000}
${s} .ytb-nav-item.active{background:#000080;color:#fff;border-left-color:transparent}
${s} .ytb-nav-item.active .ytb-nav-count{color:#fff}
${s} .ytb-body{background:#c0c0c0}
${s} .ytb-card{border:2px solid;border-color:#fff #404040 #404040 #fff;background:#c0c0c0}
${s} .ytb-card.on{border-left-color:#000080}
${s} .ytb-search{border:2px solid;border-color:#404040 #fff #fff #404040;border-radius:0;background:#fff;padding:3px 5px;color:#000}
${s} .ytb-sel{border:2px solid;border-color:#404040 #fff #fff #404040;border-radius:0;background:#fff;color:#000}
${s} .ytb-foot{border-top:2px solid;border-color:#404040 #fff #fff #404040;background:#c0c0c0}
${s} .ytb-btn.ytb-close{color:#fff;border:0}
${s} .ytb-looksel{border:2px solid;border-color:#404040 #fff #fff #404040;border-radius:0;background-color:#fff;color:#000}
`,
  },
  {
    id: "zen", name: "Minimal Zen", mode: "light", nav: "top", sw: "pill",
    card: "row", radius: "0", cardRadius: "0", borderW: "1px",
    font: 'Segoe UI,system-ui,sans-serif',
    titleFont: 'Segoe UI,system-ui,sans-serif',
    titleSize: "28px", titleWeight: "300", titleSpace: "-.04em",
    headerBg: "#faf9f6",
    bodyPad: "6px 20px 10px", cardPad: "14px 2px",
    v: {
      panel: "#faf9f6", panel2: "#faf9f6", panel3: "#f4f2ec",
      line: "#e5e0d8", line2: "#d8d2c7", ink: "#222222", ink2: "#7a756d", ink3: "#a39d93",
      card: "#faf9f6", cardHi: "#f4f2ec", cardLo: "#e5e0d8",
      acc: "#7a5c3e", accDim: "rgba(122,92,62,.06)", accInk: "122,92,62",
      ok: "#5b7a5e", crit: "#9b3d3d", critInk: "155,61,61", shadowInk: "34,34,34",
    },
    swx: { bg: "transparent", on: "#7a5c3e", knobOn: "#faf9f6" },
    extra: (s) => `
${s} .ytb-dhdr{border-bottom:1px solid var(--line);padding:16px 20px 8px}
${s} .ytb-nav{border-bottom:1px solid var(--line);padding:10px 20px}
${s} .ytb-nav-item{padding:3px 0;border-bottom:1px solid transparent}
${s} .ytb-nav-item.active{color:var(--ink);border-bottom-color:var(--acc);font-weight:400}
${s} .ytb-card{border:0;border-bottom:1px solid var(--line);border-left:0;background:transparent;padding:14px 2px}
${s} .ytb-card.on{border-left:0}
${s} .ytb-name{font-weight:500}
${s} .ytb-btn{border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent;color:var(--ink);padding:1px 0 2px}
${s} .ytb-btn.primary{background:transparent;border-bottom-color:var(--acc);color:var(--acc)}
${s} .ytb-search{border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent}
${s} .ytb-foot{border-top:1px solid var(--line)}
`,
  },
  {
    id: "kinetic", name: "Kinetic Type", mode: "light", nav: "top", sw: "square",
    card: "row", radius: "0", cardRadius: "0", borderW: "2px",
    font: 'Arial,Helvetica,sans-serif',
    titleFont: 'Arial Black,Arial,sans-serif',
    titleSize: "29px", titleWeight: "900", titleCase: "uppercase", titleSpace: "-.055em",
    headerBg: "#f5f5f5",
    v: {
      panel: "#f5f5f5", panel2: "#f5f5f5", panel3: "#ffffff",
      line: "#d8d8d8", line2: "#0a0a0a", ink: "#0a0a0a", ink2: "#6f6f6f", ink3: "#9a9a9a",
      card: "#f5f5f5", cardHi: "#ffffff", cardLo: "#e8e8e8",
      acc: "#ff3b30", accDim: "rgba(255,59,48,.08)", accInk: "255,59,48",
      ok: "#0a0a0a", crit: "#ff3b30", critInk: "255,59,48", shadowInk: "10,10,10",
    },
    swx: { on: "#ff3b30", knobOn: "#fff", bg: "#fff" },
    extra: (s) => `
${s} .ytb-dhdr{border-bottom:2px solid var(--ink);padding:14px 16px 10px}
${s} .ytb-nav{border-bottom:2px solid var(--ink);padding:8px 16px}
${s} .ytb-nav-item{border-left:1px solid var(--line);padding:3px 9px}
${s} .ytb-nav-item:first-child{border-left:0}
${s} .ytb-nav-item.active{color:var(--acc);border-bottom-color:var(--acc);font-weight:700}
${s} .ytb-card{border:0;border-bottom:2px solid var(--ink);border-left:0;background:transparent;padding:12px 2px}
${s} .ytb-card.on{border-left:0}
${s} .ytb-name{font-family:"Arial Black",Arial,sans-serif;text-transform:uppercase;font-size:12px}
${s} .ytb-btn{border:2px solid var(--ink);border-radius:0;background:transparent;color:var(--ink);padding:2px 7px;font-weight:700}
${s} .ytb-btn.primary{background:var(--acc);border-color:var(--acc);color:#fff}
${s} .ytb-search{border:2px solid var(--ink);border-radius:0;background:#fff;padding:4px 8px}
${s} .ytb-foot{border-top:2px solid var(--ink)}
`,
  },
  {
    id: "lab", name: "Web Component Lab", mode: "dark", nav: "top", sw: "pill",
    card: "surface", radius: "12px", cardRadius: "10px", borderW: "1px",
    font: 'Segoe UI,system-ui,sans-serif',
    titleFont: 'Segoe UI,system-ui,sans-serif',
    titleSize: "23px", titleWeight: "600", titleSpace: "-.03em",
    headerBg: "#12161c",
    shadow: "0 30px 70px rgba(0,0,0,.7)",
    v: {
      panel: "#0f1115", panel2: "#151920", panel3: "#1b2029",
      line: "#262b33", line2: "#343b47", ink: "#f2f5f7", ink2: "#8b949e", ink3: "#5f6874",
      card: "#151920", cardHi: "#1b2029", cardLo: "#222834",
      acc: "#c6ff4a", accDim: "rgba(198,255,74,.08)", accInk: "198,255,74",
      ok: "#c6ff4a", crit: "#6ee7ff", critInk: "110,231,255", shadowInk: "0,0,0",
    },
    swx: { on: "#c6ff4a", knobOn: "#0f1115", bg: "#262b33" },
    extra: (s) => `
${s} .ytb-dhdr{border-bottom:1px solid var(--line)}
${s} .ytb-nav-item{border:1px solid transparent;border-radius:6px;padding:4px 8px}
${s} .ytb-nav-item.active{border-color:rgba(198,255,74,.35);background:rgba(198,255,74,.08);color:var(--acc);border-bottom-color:rgba(198,255,74,.35)}
${s} .ytb-nav-item.active .ytb-nav-count{color:var(--acc)}
${s} .ytb-btn{border:1px solid var(--line);border-radius:6px;background:#151920;color:var(--ink)}
${s} .ytb-btn.primary{background:var(--acc);border-color:var(--acc);color:#0f1115}
${s} .ytb-search{border:1px solid var(--line);border-radius:6px;background:#0f1115;padding:6px 9px}
${s} .ytb-name{font-weight:600}
${s} .ytb-key{color:#6ee7ff}
`,
  },
];

const YT_LOOK_BASE = `
.ytb-dash .ytb-lookwrap{display:inline-flex;align-items:center;gap:6px;flex-shrink:0;margin:0 6px 0 10px;cursor:pointer}
.ytb-dash .ytb-looklbl{font:600 9px/1 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3)}
.ytb-dash .ytb-looksel{appearance:none;-webkit-appearance:none;max-width:160px;padding:4px 20px 4px 7px;background-color:var(--panel2);background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 12px) 50%,calc(100% - 8px) 50%;background-size:4px 4px,4px 4px;background-repeat:no-repeat;color:var(--ink);border:1px solid var(--line2);border-radius:6px;font:10.5px/1.2 "Segoe UI",system-ui,sans-serif;outline:none}
.ytb-dash .ytb-brandsel{max-width:140px}
.ytb-dash .ytb-looksel:focus{border-color:var(--acc)}
`;

function YT_lookCss(L) {
  const s = '.ytb-dash[data-look="' + L.id + '"]';
  const v = L.v;
  const o = Object.assign(
    {
      nav: "rail", sw: "pill", card: "surface", borderW: "1px", ruleW: "1px",
      radius: "10px", cardRadius: "8px", font: "Segoe UI,system-ui,sans-serif",
      titleSize: "21px", titleWeight: "700", titleSpace: "-.02em", titleCase: "none",
      bodyPad: "2px 16px 6px", cardPad: "9px 10px", gap: "5px",
      headerBg: "transparent", navBg: "transparent", footBg: "transparent",
      navW: 164,
    },
    L
  );
  const sw = Object.assign({}, YT_LOOK_SW[o.sw] || YT_LOOK_SW.pill, o.swx || {});
  const row = o.card === "row";
  const navRail = o.nav === "rail";
  const cardRule = row
    ? `border:0;border-bottom:${o.borderW} solid var(--line);border-left:0;border-radius:0;box-shadow:none;background:transparent;padding:${o.cardPad};`
    : `border:${o.borderW} solid var(--line);border-left:3px solid transparent;border-radius:${o.cardRadius};box-shadow:${o.cardShadow || "none"};background:${o.cardBg || "var(--panel2)"};padding:${o.cardPad};`;
  const navRule = navRail
    ? `width:${o.navW}px;flex-direction:column;flex-wrap:nowrap;gap:2px;padding:8px 6px;border-right:${o.ruleW} solid var(--line);border-bottom:0;overflow-y:auto;overflow-x:hidden;`
    : `width:auto;flex-direction:row;flex-wrap:nowrap;gap:4px 14px;padding:9px 16px;border-right:0;border-bottom:${o.ruleW} solid var(--line);overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;`;
  const navItemRule = navRail
    ? `width:100%;justify-content:space-between;border:0;border-left:2px solid transparent;border-radius:0;background:transparent;padding:6px 8px;`
    : `width:auto;flex-shrink:0;justify-content:flex-start;gap:5px;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;padding:2px 0;white-space:nowrap;`;
  const navActiveRule = navRail
    ? `background:var(--acc-dim);color:var(--acc);border-left-color:var(--acc);font-weight:600;`
    : `background:none;color:var(--ink);border-bottom-color:var(--acc);font-weight:700;`;
  const narrowCss = navRail
    ? `
.ytb-dash[data-look].ytb-narrow .ytb-main{flex-direction:column}
.ytb-dash[data-look].ytb-narrow .ytb-nav{width:100%;flex-direction:row;flex-wrap:nowrap;gap:4px 14px;overflow-x:auto;overflow-y:hidden;border-right:0;border-bottom:${o.ruleW} solid var(--line);padding:6px 10px;scrollbar-width:thin}
.ytb-dash[data-look].ytb-narrow .ytb-nav-item{width:auto;flex-shrink:0;border-left:0;border-bottom:1px solid transparent;background:none;padding:2px 0;white-space:nowrap}
.ytb-dash[data-look].ytb-narrow .ytb-nav-item.active{background:none;color:var(--acc);border-bottom-color:var(--acc)}
`
    : "";

  return `
${s}{
  --acc:${v.acc};--acc-dim:${v.accDim};--panel:${v.panel};--panel2:${v.panel2};--panel3:${v.panel3};
  --line:${v.line};--line2:${v.line2};--ink:${v.ink};--ink2:${v.ink2};--ink3:${v.ink3};
  --card:${v.card};--card-hi:${v.cardHi};--card-lo:${v.cardLo};--ok:${v.ok};--crit:${v.crit};
  --accink:${v.accInk};--shadowink:${v.shadowInk || "0,0,0"};--critink:${v.critInk};
  --mono:${o.mono || "ui-monospace,SFMono-Regular,Consolas,monospace"};
  color-scheme:${o.mode};font-family:${o.font};color:${v.ink};background:${v.panel};
  border:${o.dashBorder || "1px solid " + v.line2};border-radius:${o.radius};box-shadow:${o.shadow || "0 18px 50px rgba(0,0,0,.28)"};
}
${s} .ytb-dhdr{align-items:center;gap:10px;padding:${o.hpad || "13px 16px 8px"};border-bottom:${o.ruleW} solid var(--line);background:${o.headerBg};flex-wrap:wrap}
${s} .ytb-dtitle{font-family:${o.titleFont || o.font};font-size:${o.titleSize};font-weight:${o.titleWeight};letter-spacing:${o.titleSpace};text-transform:${o.titleCase};color:${o.headerInk || "var(--ink)"};white-space:normal}
${s} .ytb-dver{font:400 10px/1 var(--mono);color:${o.headerMuted || "var(--ink3)"};background:transparent;border:0;padding:0 0 0 4px;margin-left:6px}
${s} .ytb-search{flex:1;min-width:135px;margin:0;padding:${o.searchPad || "4px 2px 5px"};background:${o.searchBg || "transparent"};color:var(--ink);border:${o.searchBorder || "0"};border-bottom:1px solid var(--line2);border-radius:${o.searchR || "0"};font-family:${o.font};font-size:12px;outline:none}
${s} .ytb-search::placeholder{color:var(--ink3);font-family:${o.font};font-size:12px}
${s} .ytb-search:focus{border-color:var(--acc);box-shadow:none}
${s} .ytb-btn{background:${o.btnBg || "var(--panel2)"};border:${o.btnBorder || "1px solid var(--line2)"};border-radius:${o.btnR || "6px"};padding:${o.btnPad || "4px 9px"};color:${o.btnInk || "var(--ink2)"};font-family:${o.font};font-size:11px;font-weight:${o.btnWeight || "400"};box-shadow:${o.btnShadow || "none"}}
${s} .ytb-btn:hover{background:${o.btnHoverBg || "var(--panel3)"};border-color:var(--line2);color:var(--ink)}
${s} .ytb-btn.primary{background:${o.primaryBg || "var(--acc)"};border-color:${o.primaryBg || "var(--acc)"};color:${o.primaryInk || "#fff"};font-weight:600}
${s} .ytb-btn.primary:hover{background:${o.primaryBg || "var(--acc)"};border-color:${o.primaryBg || "var(--acc)"};color:${o.primaryInk || "#fff"};filter:brightness(1.06)}
${s} .ytb-btn.ytb-close{width:auto;height:auto;padding:1px 4px;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;font-family:var(--mono);font-size:12px;color:${o.headerMuted || "var(--ink2)"}}
${s} .ytb-btn.ytb-close:hover{background:none;border-bottom-color:var(--ink);color:var(--ink)}
${s} .ytb-main{flex-direction:${navRail ? "row" : "column"}}
${s} .ytb-nav{${navRule}background:${o.navBg};scrollbar-color:var(--line2) transparent}
${s} .ytb-nav-item{${navItemRule}color:${o.navInk || "var(--ink2)"};font-family:${o.font};font-size:${o.navSize || "11.5px"};font-weight:500;text-align:left}
${s} .ytb-nav-item:hover{background:${navRail ? "var(--panel3)" : "none"};color:var(--ink)}
${s} .ytb-nav-item.active{${navActiveRule}}
${s} .ytb-nav-item.active .ytb-nav-count{color:${navRail ? "var(--acc)" : "var(--acc)"}}
${s} .ytb-nav-count{font-family:var(--mono);font-size:${o.navCountSize || "9.5px"};color:var(--ink3)}
${s} .ytb-nav-sep{display:${navRail ? "none" : "none"}}
${s} .ytb-body{padding:${o.bodyPad};scrollbar-color:var(--line2) transparent}
${s} .ytb-core{gap:8px 18px;padding:8px 0 10px;border-bottom:1px solid var(--line);display:${o.coreCard ? "grid" : "flex"};flex-wrap:wrap;grid-template-columns:${o.coreCard ? "1fr 1fr" : "none"};margin:0}
${s} .ytb-corecell{background:${o.coreCard ? "var(--panel2)" : "none"};border:${o.coreCard ? "1px solid var(--line)" : "0"};border-radius:${o.coreCard ? o.cardRadius : "0"};padding:${o.coreCard ? "6px 9px" : "0"};gap:10px}
${s} .ytb-corelbl{font-family:${o.font};color:var(--ink2);font-size:11.5px}
${s} .ytb-cat-page{gap:${o.gap};padding:0}
${s} .ytb-card{${cardRule}margin:0;transition:background .12s,border-color .12s}
${s} .ytb-card:hover{background:${row ? "var(--panel3)" : "var(--card-hi)"};border-color:var(--line2)}
${s} .ytb-card.on{border-left-color:${row ? "transparent" : "var(--acc)"}}
${s} .ytb-head{gap:12px}
${s} .ytb-name{font-family:${o.nameFont || o.font};font-size:${o.nameSize || "12.5px"};font-weight:${o.nameWeight || "600"};color:var(--ink)}
${s} .ytb-key{color:${o.keyInk || "var(--acc)"};font-family:var(--mono);font-size:${o.keySize || "10px"};background:none;border:0;border-bottom:1px solid transparent;border-radius:0;margin:0;padding:1px 0}
${s} .ytb-key:hover{background:none;color:var(--acc);border-bottom-color:var(--acc)}
${s} .ytb-sum{font-family:${o.sumFont || o.font};font-style:${o.sumStyle || "normal"};font-size:${o.sumSize || "11.5px"};color:var(--ink2);margin-top:3px;line-height:1.45}
${s} .ytb-sw{width:${sw.w}px;height:${sw.h}px}
${s} .ytb-track{background:${sw.bg};border:${sw.border};border-color:${sw.borderC || "var(--line2)"};border-radius:${sw.r}}
${s} .ytb-knob{top:${sw.top}px;left:${sw.left}px;width:${sw.k}px;height:${sw.k}px;border-radius:${sw.kr};background:${sw.knob}}
${s} .ytb-sw input:checked~.ytb-track{background:${sw.on};border-color:${sw.on === "var(--acc)" ? "var(--acc)" : sw.on}}
${s} .ytb-sw input:checked~.ytb-knob{transform:translateX(${sw.move}px);background:${sw.knobOn}}
${s} .ytb-sel,${s} .ytb-inp,${s} .ytb-ta{background:${o.fieldBg || "var(--panel2)"};color:var(--ink);border:${o.borderW} solid var(--line2);border-radius:${o.fieldR || o.cardRadius};font-family:${o.font};font-size:11px}
${s} .ytb-sel:focus,${s} .ytb-inp:focus,${s} .ytb-ta:focus{border-color:var(--acc)}
${s} .ytb-sel option{background:${v.panel2};color:var(--ink)}
${s} .ytb-looksel{background-color:${o.fieldBg || "var(--panel2)"};border:${o.borderW} solid var(--line2);border-radius:${o.fieldR || o.cardRadius};color:var(--ink);font-family:${o.font};font-size:10.5px;padding:4px 20px 4px 7px}
${s} .ytb-looklbl{color:var(--ink3);font-family:var(--mono)}
${s} .ytb-foot{justify-content:flex-end;gap:12px;padding:9px 16px;border-top:${o.ruleW} solid var(--line);background:${o.footBg};flex-wrap:wrap}
${s} .ytb-tabs{border-bottom:1px solid var(--line);background:transparent}
${s} .ytb-tab{color:var(--ink3);font-family:${o.font};text-transform:none;letter-spacing:.02em}
${s} .ytb-tab.active{color:var(--ink);border-bottom-color:var(--acc)}
${s} .ytb-chip{background:var(--acc-dim);color:var(--acc);border:1px solid var(--line2);border-radius:${row ? "4px" : "999px"};font-family:var(--mono)}
${s} .ytb-dresize{background:linear-gradient(135deg,transparent 0,transparent 50%,var(--line2) 50%,var(--line2) 55%,transparent 55%,transparent 65%,var(--line2) 65%,var(--line2) 70%,transparent 70%,transparent 80%,var(--line2) 80%,var(--line2) 85%,transparent 85%)}
${narrowCss}
${o.extra ? o.extra(s) : ""}`;
}

function YT_applyDashLook(dash, id, opts) {
  if (!dash) return null;
  const look = YT_DASH_LOOKS.find((entry) => entry.id === id) || null;
  if (look) dash.setAttribute("data-look", look.id);
  else dash.removeAttribute("data-look");
  let style = document.getElementById("ytb-look-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "ytb-look-style";
    (document.head || document.documentElement).appendChild(style);
  }
  style.textContent = YT_LOOK_BASE + (look ? YT_lookCss(look) : "");
  if (opts && opts.persist) {
    try { Ta("dashLook", look ? look.id : "classic"); } catch (_) {}
  }
  return look;
}
