async () => {
  const { rows, set, pane, wait, equal } = window.__controlAudit;
  const documentId = window.documentToken;
  const list = [
    ["static-header", "staticHeaderOn", "#masthead-container,ytd-masthead", "position", "absolute"],
    ["hide-masthead", "hideMasthead", "#masthead-container,ytd-masthead", "display", "none"],
    ["hide-comments", "hideComments", "#comments", "display", "none"],
    ["hide-recs", "hideRecs", "#secondary,#related", "display", "none"],
    ["hide-watermark", "hideWatermark", ".branding-img-container", "display", "none"],
    [
      "hide-description-panel",
      "hideDescriptionPanelOn",
      'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-structured-description"]',
      "display",
      "none",
    ],
    ["hide-metadata-rows", "hideMetadataRowsOn", "ytd-metadata-row-container-renderer", "display", "none"],
    [
      "unclamp-titles",
      "unclampTitlesOn",
      "#video-title,.ytLockupMetadataViewModelTitle",
      "-webkit-line-clamp",
      "none",
    ],
    ["wide-player", "widePlayerOn", "ytd-watch-flexy #columns", "flex-direction", "column"],
    ["player-gradient", "hidePlayerGradientOn", ".ytp-gradient-bottom", "display", "none"],
  ];
  const target = (sel) =>
    [...document.querySelectorAll(sel)].find(
      (n) => !n.closest(".ytb-dash") && n.getClientRects().length && getComputedStyle(n).display !== "none",
    );
  for (const [id, _key, sel, prop, want] of list) {
    const f = YourTube.features.get(id),
      key = f.masterKey,
      rec = { id, key, selector: sel, property: prop };
    try {
      await set(id, key, false);
      await wait(65);
      const n = target(sel);
      if (!n) {
        rec.status = "target absent or already hidden";
        rows.push(rec);
        continue;
      }
      rec.before = getComputedStyle(n).getPropertyValue(prop);
      if (rec.before === want) {
        rec.status = "native value already matches";
        rows.push(rec);
        continue;
      }
      const start = performance.now();
      try {
        await set(id, key, true);
        rec.on = await equal(() => getComputedStyle(n).getPropertyValue(prop), want, 750);
        rec.ms = Math.round(performance.now() - start);
      } finally {
        await set(id, key, false);
      }
      rec.off = await equal(() => getComputedStyle(n).getPropertyValue(prop), rec.before, 750);
      rec.status =
        n.isConnected && window.documentToken === documentId ? "measured both directions" : "target replaced";
    } catch (e) {
      rec.status = "not verified";
      rec.error = String(e);
    }
    rows.push(rec);
  }
  const video = document.querySelector("#movie_player video");
  if (video) {
    for (const [id, key, read] of [
      ["loop-video", "loopVideo", () => video.loop],
      ["video-filters", "videoFiltersOn", () => getComputedStyle(video).filter],
    ]) {
      const rec = { id, key, measurement: "property of native video node; not evidence of decoded playback" };
      try {
        await set(id, key, false);
        await wait(100);
        rec.before = read();
        await set(id, key, true);
        if (id === "video-filters") await set(id, "vfGray", true);
        await wait(100);
        rec.on = read();
        await set(id, key, false);
        await wait(100);
        rec.off = read();
        rec.status =
          rec.before !== rec.on && rec.off === rec.before && video.isConnected
            ? "measured both directions"
            : "no distinct reversible effect";
      } catch (e) {
        rec.error = String(e);
        rec.status = "not verified";
      }
      rows.push(rec);
    }
  }
  await set("elements-control", "elementsControlOn", true);
  for (const { id, selector } of siteTargets) {
    const rec = { id: "elements-control", key: id, selector };
    let cb;
    try {
      const n = target(selector);
      if (!n) {
        rec.status = "target absent or already hidden";
        rows.push(rec);
        continue;
      }
      cb = pane("elements-control").querySelector('[data-id="' + id + '"] input');
      if (!cb || cb.checked) throw Error("no initially clear control");
      rec.node = n.tagName.toLowerCase() + (n.id ? "#" + n.id : "");
      rec.before = getComputedStyle(n).display;
      const t = performance.now();
      cb.click();
      rec.on = await equal(() => getComputedStyle(n).display, "none", 600);
      rec.ms = Math.round(performance.now() - t);
      cb.click();
      rec.off = await equal(() => getComputedStyle(n).display, rec.before, 600);
      rec.status =
        n.isConnected && window.documentToken === documentId ? "measured both directions" : "target replaced";
    } catch (e) {
      rec.status = "not verified";
      rec.error = String(e);
    } finally {
      if (cb?.checked) cb.click();
    }
    rows.push(rec);
  }
  await set("elements-control", "elementsControlOn", false);
  return rows;
};
