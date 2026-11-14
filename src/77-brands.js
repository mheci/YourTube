const YT_DASH_BRANDS = [
  {
    id: "signal", name: "Signal Play", word: "YourTube, plainly.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none"/></svg>`,
  },
  {
    id: "bento", name: "Bento Bloom", word: "YourTube, softly.",
    mark: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2" opacity=".45"/><rect x="3" y="13" width="8" height="8" rx="2" opacity=".45"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>`,
  },
  {
    id: "prompt", name: "Prompt", word: "YourTube, tuned.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7l5 5-5 5"/><path d="M12 17h7"/></svg>`,
  },
  {
    id: "ledger", name: "Ledger Seal", word: "YourTube, on paper.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><text x="12" y="16.2" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="currentColor" stroke="none">Y</text></svg>`,
  },
  {
    id: "bolt", name: "Bolt", word: "YourTube, louder.",
    mark: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>`,
  },
  {
    id: "squircle", name: "Squircle", word: "YourTube, at home.",
    mark: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="6" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor"/></svg>`,
  },
  {
    id: "window", name: "Window", word: "YourTube, in focus.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M12 4v16M3 12h18"/></svg>`,
  },
  {
    id: "petal", name: "Petal", word: "YourTube, in tone.",
    mark: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c3.4 3.4 3.4 6.6 0 10-3.4-3.4-3.4-6.6 0-10z"/><path d="M22 12c-3.4 3.4-6.6 3.4-10 0 3.4-3.4 6.6-3.4 10 0z"/><path d="M12 22c-3.4-3.4-3.4-6.6 0-10 3.4 3.4 3.4 6.6 0 10z"/><path d="M2 12c3.4-3.4 6.6-3.4 10 0-3.4 3.4-6.6 3.4-10 0z"/></svg>`,
  },
  {
    id: "reticle", name: "Reticle", word: "YourTube, in control.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`,
  },
  {
    id: "leaf", name: "Leaf", word: "YourTube, gently.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4C13 4 6 8 6 15c0 2 1 4 3 5 7 0 11-7 11-16z"/><path d="M4 21c3-6 7-9 12-11"/></svg>`,
  },
  {
    id: "folio", name: "Folio", word: "YourTube, edited.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 6C9 4 6 4 3 5v13c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1z"/><path d="M12 6v13"/></svg>`,
  },
  {
    id: "pixel", name: "Pixel", word: "YourTube, 8-bit.",
    mark: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h4v4H4zM16 6h4v4h-4zM6 10h12v4H6zM8 14h8v4H8zM10 18h4v3h-4z"/></svg>`,
  },
  {
    id: "bars", name: "Bars", word: "YourTube, measured.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 19v-7M9 19V5M14 19v-9M19 19v-5"/></svg>`,
  },
  {
    id: "spark", name: "Spark", word: "YourTube, offbeat.",
    mark: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"/></svg>`,
  },
  {
    id: "compass", name: "Compass", word: "YourTube, drafted.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M11 7l-4 12M13 7l4 12M9 15h6"/></svg>`,
  },
  {
    id: "monogram", name: "Monogram", word: "YourTube, after dark.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l9 10-9 10L3 12z"/><text x="12" y="16.5" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="currentColor" stroke="none">Y</text></svg>`,
  },
  {
    id: "bevel", name: "Bevel", word: "YourTube, 1997.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 8h18"/><rect x="6" y="11" width="5" height="5" fill="currentColor"/></svg>`,
  },
  {
    id: "dot", name: "Dot", word: "YourTube, less.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"/></svg>`,
  },
  {
    id: "glyph", name: "Glyph", word: "YourTube, set large.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4l7 8 7-8M12 12v9"/></svg>`,
  },
  {
    id: "node", name: "Node", word: "YourTube, assembled.",
    mark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2l8 5v10l-8 5-8-5V7z"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg>`,
  },
];

const YT_BRAND_BASE = `
.ytb-dash .ytb-brandmark{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;margin-right:8px;flex-shrink:0;color:inherit;font:700 11px/1 var(--mono);letter-spacing:-.04em}
.ytb-dash:not([data-look]) .ytb-brandmark{color:var(--acc)}
.ytb-dash .ytb-brandmark svg{width:20px;height:20px;display:block;overflow:visible}
.ytb-dash .ytb-brandname{min-width:0}
.ytb-dash.ytb-narrow .ytb-dver{display:none}
.ytb-dash .ytb-brandwrap{position:relative}
.ytb-dash .ytb-brandbtn.ytb-looksel{display:inline-flex;align-items:center;gap:6px;max-width:150px;min-width:0;padding:4px 8px;background-image:none;appearance:none;text-align:left;cursor:pointer}
.ytb-dash .ytb-brandbtnmark{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;flex-shrink:0;color:var(--acc);font:700 8px/1 var(--mono)}
.ytb-dash .ytb-brandbtnmark svg{width:15px;height:15px;display:block}
.ytb-dash .ytb-brandbtnname{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ytb-dash .ytb-brandbtnarrow{flex-shrink:0;color:var(--ink3);font-size:9px}
.ytb-dash .ytb-brandpick{position:absolute;inset:0;z-index:60;display:flex;flex-direction:column;gap:10px;background:var(--panel);color:var(--ink);padding:14px 16px}
.ytb-dash .ytb-brandpick[hidden]{display:none}
.ytb-dash .ytb-brandpickhead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:8px;border-bottom:1px solid var(--line)}
.ytb-dash .ytb-brandpicktitle{font-size:15px;font-weight:700}
.ytb-dash .ytb-brandpickclose{appearance:none;border:0;background:transparent;color:var(--ink2);font:11px/1 var(--mono);cursor:pointer;padding:4px 6px}
.ytb-dash .ytb-brandpickgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;overflow-y:auto;padding:2px 2px 8px;scrollbar-width:thin}
.ytb-dash.ytb-narrow .ytb-brandpickgrid{grid-template-columns:1fr 1fr}
.ytb-dash .ytb-brandpickitem{display:flex;align-items:center;gap:7px;min-width:0;padding:7px 8px;background:var(--panel2);border:1px solid var(--line);border-radius:8px;color:var(--ink);cursor:pointer;font:inherit;text-align:left}
.ytb-dash .ytb-brandpickitem:hover{border-color:var(--acc)}
.ytb-dash .ytb-brandpickitem.selected{border-color:var(--acc);background:var(--acc-dim)}
.ytb-dash .ytb-brandpickmark{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;flex-shrink:0;color:var(--acc);font:700 10px/1 var(--mono)}
.ytb-dash .ytb-brandpickmark svg{width:20px;height:20px;display:block}
.ytb-dash .ytb-brandpickname{font-size:10.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ytb-dash .ytb-brandpickitem:focus-visible,.ytb-dash .ytb-brandbtn:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
`;

function YT_applyDashBrand(dash, id, opts) {
  if (!dash) return null;
  const brand = YT_DASH_BRANDS.find((entry) => entry.id === id) || null;
  const mark = dash.querySelector(".ytb-brandmark");
  const name = dash.querySelector(".ytb-brandname");
  if (!mark || !name) return null;
  if (brand) {
    mark.innerHTML = brand.mark;
    name.textContent = brand.word;
    dash.setAttribute("data-brand", brand.id);
  } else {
    mark.textContent = "[=]";
    name.textContent = "YourTube, plainly.";
    dash.removeAttribute("data-brand");
  }
  let style = document.getElementById("ytb-brand-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "ytb-brand-style";
    style.textContent = YT_BRAND_BASE;
    (document.head || document.documentElement).appendChild(style);
  }
  if (opts && opts.persist) {
    try { Ta("dashBrand", brand ? brand.id : "classic"); } catch (_) {}
  }
  return brand;
}
