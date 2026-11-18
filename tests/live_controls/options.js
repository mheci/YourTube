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
  const video = "video",
    watch = "ytd-watch-flexy";
  await cfg("video-filters", {
    videoFiltersOn: true,
    vfZoom: 100,
    vfFlip: false,
    vfGray: false,
    vfContrast: 100,
    vfBright: 100,
    vfSat: 100,
    vfHue: 0,
  });
  for (const [key, fn, vals] of [
    ["vfBright", "brightness", [0, 50, 100, 170, 200]],
    ["vfContrast", "contrast", [0, 55, 100, 145, 200]],
    ["vfSat", "saturate", [0, 50, 100, 150, 200]],
    ["vfHue", "hue-rotate", [0, 30, 90, 180, 360]],
  ])
    for (const v of vals) {
      await cfg("video-filters", { [key]: v });
      const s = style(video, "filter").match(new RegExp(fn + "\\(([^)]+)\\)"))?.[1];
      row("video-filters", [key], { [key]: v }, fn === "hue-rotate" ? v : v / 100, parseFloat(s));
    }
  for (const g of [false, true]) {
    await cfg("video-filters", { vfGray: g });
    row("video-filters", ["vfGray"], { vfGray: g }, g, style(video, "filter").includes("grayscale(1)"));
  }
  for (const zoom of [50, 100, 175, 200])
    for (const mirror of [false, true])
      for (const h of [false, true])
        for (const v of [false, true]) {
          await cfg("flip-video", { flipVideoOn: true, flipVideoH: h, flipVideoV: v });
          await cfg("video-filters", { vfZoom: zoom, vfFlip: mirror });
          const m = new DOMMatrixReadOnly(style(video, "transform"));
          row(
            "video-filters + flip-video",
            ["vfZoom", "vfFlip", "flipVideoH", "flipVideoV"],
            { zoom, mirror, h, v },
            [(zoom / 100) * (mirror ? -1 : 1) * (h ? -1 : 1), (zoom / 100) * (v ? -1 : 1)],
            [m.a, m.d],
          );
        }
  await cfg("flip-video", { flipVideoOn: false });
  await cfg("video-filters", { videoFiltersOn: false });
  for (const [isTheater, key] of [
    [false, "playerHeightNormal"],
    [true, "playerHeightTheater"],
  ])
    for (const height of [0, 144, 240, 360, 480, 720])
      for (const full of [false, true]) {
        q(watch).toggleAttribute("theater", isTheater);
        q(watch).toggleAttribute("fullscreen", full);
        await cfg("fixed-player-size", { playerSizeOn: true, [key]: height });
        row(
          "fixed-player-size",
          [key],
          { height, full, isTheater },
          (!height || full ? 210 : height) + "px",
          isTheater
            ? style("#player-theater-container", "height")
            : style(watch, "--ytd-watch-flexy-min-player-height"),
        );
      }
  await cfg("fixed-player-size", { playerSizeOn: false });
  q(watch).removeAttribute("fullscreen");
  q(watch).removeAttribute("theater");
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
