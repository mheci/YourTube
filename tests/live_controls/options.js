async () => {
  scene(
    '<div id="description">Outside watch</div><ytd-watch-flexy><div id="description-inline-expander">Inside watch</div><div id="player-theater-container"></div><div id="movie_player"><video class="html5-main-video"></video></div></ytd-watch-flexy><ytd-search><ytd-video-renderer><ytd-thumbnail class="ytd-video-renderer"></ytd-thumbnail></ytd-video-renderer></ytd-search><div id="secondary"><ytd-compact-video-renderer><ytd-thumbnail></ytd-thumbnail></ytd-compact-video-renderer></div><ytd-browse page-subtype="channels"><ytd-rich-grid-renderer><ytd-rich-item-renderer></ytd-rich-item-renderer></ytd-rich-grid-renderer></ytd-browse>',
  );
  const rows = [],
    q = (s) => document.querySelector(s),
    style = (s, prop) => getComputedStyle(q(s)).getPropertyValue(prop).trim();
  const cfg = async (id, data) => {
    for (const [k, v] of Object.entries(data)) await set(id, k, v);
    await wait(22);
  };
  const row = (id, keys, params, want, seen) =>
    rows.push({
      id,
      keys,
      params,
      expected: want,
      actual: seen,
      pass: JSON.stringify(want) === JSON.stringify(seen),
    });
  for (const [key, selector, prop, vals] of [
    ["searchThumbSize", "ytd-search ytd-thumbnail", "min-width", [0, 240, 360]],
    ["watchSidebarThumbSize", "#secondary ytd-thumbnail", "min-width", [0, 180, 240, 360, 480]],
    ["channelGridThumbSize", "ytd-browse ytd-rich-item-renderer", "width", [0, 180, 240, 360, 480]],
  ])
    for (const n of vals) {
      await cfg("thumbnail-sizes", { thumbnailSizesOn: true, [key]: n });
      row("thumbnail-sizes", [key], { [key]: n }, (n || 42) + "px", style(selector, prop));
    }
  await cfg("thumbnail-sizes", { thumbnailSizesOn: false });
  for (const scope of ["site", "watch"])
    for (let pct = 100; pct <= 180; pct += 5) {
      await cfg("text-scale", { textScaleOn: true, textScaleScope: scope, textScalePct: pct });
      row(
        "text-scale",
        ["textScaleScope", "textScalePct"],
        { scope, pct },
        [scope === "site" ? pct / 5 : 20, pct / 5],
        [
          parseFloat(style("#description", "font-size")),
          parseFloat(style("#description-inline-expander", "font-size")),
        ],
      );
    }
  return rows;
};
