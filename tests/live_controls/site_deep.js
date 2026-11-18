async () => {
  const { pane, set, equal, wait } = window.__controlAudit;
  const result = [];
  const find = (s) =>
    Array.from(document.querySelectorAll(s)).find(
      (n) =>
        !n.closest(".ytb-dash") && n.getClientRects().length && getComputedStyle(n).visibility !== "hidden",
    );
  async function check(id, key, fn) {
    const r = { id, key };
    try {
      await fn(r);
      if (!r.status) r.status = "measured both directions";
    } catch (e) {
      r.error = String(e);
      r.status = "not verified";
    }
    result.push(r);
  }
  if (location.pathname === "/watch") {
    await check("reader-mode", "readerModeOn", async (r) => {
      const desc = find("#description-inline-expander,ytd-text-inline-expander");
      if (!desc) {
        r.status = "no eligible native description";
        return;
      }
      const sample = (desc.innerText || desc.textContent || "").trim().slice(0, 20);
      if (sample.length < 5) {
        r.status = "no readable native description";
        return;
      }
      await set("reader-mode", "readerModeOn", true);
      try {
        const trigger = await equal(() => !!desc.querySelector(".ytb-ui-reader-open"), true, 1200);
        desc.querySelector(".ytb-ui-reader-open").click();
        r.on = await equal(
          () => document.querySelector("#ytb-reader")?.textContent.includes(sample),
          true,
          650,
        );
      } finally {
        await set("reader-mode", "readerModeOn", false);
      }
      r.off = await equal(() => document.querySelectorAll("#ytb-reader,.ytb-ui-reader-open").length, 0, 650);
    });
    for (const [id, key, selector] of [
      ["video-notes", "videoNotesOn", ".ytb-extra-vnote"],
      ["channel-notes", "channelNotesOn", ".ytb-extra-cnote"],
    ])
      await check(id, key, async (r) => {
        await set(id, key, true);
        try {
          const open = find(selector);
          if (!open) {
            r.status = "no visible button in native player";
            return;
          }
          const text = "Local dashboard check " + id;
          open.click();
          const query = (s) => document.querySelector("#ytb-extra-notes " + s);
          await equal(() => !!query("textarea"), true, 750);
          const area = query("textarea");
          if (area.value) {
            r.status = "not overwriting an existing note";
            return;
          }
          area.value = text;
          query(".primary").click();
          await equal(
            () => document.querySelector("#ytb-toast")?.textContent.includes("Note saved"),
            true,
            1200,
          );
          query(".ytb-extra-notes-head button").click();
          open.click();
          r.on = await equal(() => query("textarea")?.value, text, 1200);
          query(".ytb-btn:not(.primary)").click();
          r.deleted = await equal(() => query("textarea")?.value, "", 1200);
        } finally {
          await set(id, key, false);
        }
        r.off = await equal(() => !!document.querySelector("#ytb-extra-notes," + selector), false, 750);
      });
    await check("collapse-long-comments", "collapseLongCommentChars", async (r) => {
      const item = [...document.querySelectorAll("ytd-comment-thread-renderer #content-text")].find(
        (n) => n.getClientRects().length && n.textContent.length >= 400 && n.textContent.length < 5000,
      );
      if (!item) {
        r.status = "no currently loaded comment between 400 and 5000 characters";
        return;
      }
      r.length = item.textContent.length;
      await set("collapse-long-comments", "collapseLongCommentsOn", true);
      try {
        await set("collapse-long-comments", "collapseLongCommentChars", 400);
        r.on = await equal(
          () =>
            item.classList.contains("ytb-extra-comment-clamp") &&
            item.nextElementSibling?.textContent === "Expand comment",
          true,
        );
        item.nextElementSibling.click();
        r.expanded = await equal(() => item.classList.contains("ytb-extra-comment-clamp"), false);
        await set("collapse-long-comments", "collapseLongCommentChars", 5000);
        r.thresholdRemovedButton = await equal(
          () => !!item.nextElementSibling?.classList.contains("ytb-extra-expand-comment"),
          false,
        );
      } finally {
        await set("collapse-long-comments", "collapseLongCommentsOn", false);
      }
      r.off = await equal(() => item.hasAttribute("data-ytb-clamped"), false);
    });
  }
  const video = find("#movie_player video");
  if (video) {
    const f = "video-filters";
    for (const [key, term, x, y] of [
      ["vfBright", "brightness", 75, 150],
      ["vfContrast", "contrast", 65, 140],
      ["vfSat", "saturate", 20, 175],
      ["vfHue", "hue-rotate", 20, 145],
    ])
      await check(f, key, async (r) => {
        await set(f, "videoFiltersOn", true);
        const get = () =>
          parseFloat(new RegExp(term + "\\(([^)]+)\\)").exec(getComputedStyle(video).filter)?.[1]);
        const num = (n) => (term === "hue-rotate" ? n : n / 100);
        r.samples = [];
        try {
          for (const n of [x, y, x]) {
            await set(f, key, n);
            r.samples.push({ input: n, read: await equal(get, num(n), 600) });
          }
        } finally {
          await set(f, key, term === "hue-rotate" ? 0 : 100);
          await set(f, "videoFiltersOn", false);
        }
        if (!video.isConnected) r.status = "native node replaced";
      });
  }
  if (location.pathname === "/watch") {
    const watch = find("ytd-watch-flexy");
    if (watch && !watch.hasAttribute("theater"))
      await check("fixed-player-size", "playerHeightNormal", async (r) => {
        const read = () =>
          getComputedStyle(watch).getPropertyValue("--ytd-watch-flexy-min-player-height").trim();
        await set("fixed-player-size", "playerSizeOn", false);
        r.before = read();
        await set("fixed-player-size", "playerSizeOn", true);
        try {
          r.samples = [];
          for (const h of [360, 480]) {
            await set("fixed-player-size", "playerHeightNormal", h);
            r.samples.push({
              input: h,
              css: await equal(read, h + "px"),
              playerHeight: document.querySelector("#movie_player")?.getBoundingClientRect().height,
            });
          }
        } finally {
          await set("fixed-player-size", "playerSizeOn", false);
        }
        r.off = await equal(read, r.before);
      });
  }
  // Read a video title, never a thumbnail timestamp or a playlist's item count.
  const title = [
    ...document.querySelectorAll(
      'ytd-video-renderer #video-title,yt-lockup-view-model h3 a[href*="/watch"],yt-lockup-view-model a.yt-lockup-metadata-view-model__title[href*="/watch"]',
    ),
  ].find((n) => n.getClientRects().length && n.textContent.trim().length > 5);
  const card = title?.closest("ytd-video-renderer,yt-lockup-view-model");
  if (title) {
    const sample = (title.title || title.textContent || "").trim().slice(0, 55);
    if (sample.length > 4)
      await check("keyword-filter", "keywordFilterList", async (r) => {
        await set("keyword-filter", "keywordFilterOn", true);
        r.sample = sample;
        const read = () => getComputedStyle(card).display;
        await set("keyword-filter", "keywordFilterList", "__field_audit_no_match__");
        await wait(390);
        r.before = read();
        if (r.before === "none") {
          r.status = "native card already hidden";
          return;
        }
        try {
          await set("keyword-filter", "keywordFilterList", sample);
          r.on = await equal(read, "none", 1800);
          await set("keyword-filter", "keywordFilterList", "__field_audit_no_match__");
          r.off = await equal(read, r.before, 1800);
        } finally {
          await set("keyword-filter", "keywordFilterOn", false);
        }
        if (!card.isConnected) r.status = "native node replaced";
      });
  }
  await set("elements-control", "elementsControlOn", true);
  const presets = [...pane("elements-control").querySelectorAll(".ytb-preset-card")],
    reset = presets.find((p) => p.textContent.includes("Show Everything"));
  const samples = [
    [
      "Minimal Clean",
      "ytd-feed-filter-chip-bar-renderer, .ytp-cards-button, ytd-comments #simplebox-placeholder",
    ],
    ["Distraction Free", "#secondary, #comments"],
    ["Ultra Minimal", "ytd-masthead"],
    ["No Shorts Anywhere", 'ytd-reel-shelf-renderer,ytd-guide-entry-renderer:has(a[href="/shorts"])'],
    ["Ad-Free Layout", "ytd-ad-slot-renderer,ytd-display-ad-renderer"],
    ["Cinema Focus", "ytd-masthead"],
    ["Streamer / Recording View", ".ytp-settings-button,.ytp-subtitles-button,.ytp-cards-button"],
  ];
  for (const [key, selector] of samples)
    await check("elements-control", key, async (r) => {
      const n = find(selector),
        button = presets.find((p) => p.querySelector(".ytb-preset-name")?.textContent === key);
      if (!n || !button || !reset) {
        r.status = "no eligible native target or preset";
        return;
      }
      r.node = n.tagName.toLowerCase() + (n.id ? "#" + n.id : "");
      r.before = !!n.getClientRects().length;
      try {
        button.click();
        r.on = await equal(() => !!n.getClientRects().length, false, 750);
      } finally {
        reset.click();
      }
      r.off = await equal(() => !!n.getClientRects().length, r.before, 750);
      if (!n.isConnected) r.status = "native node replaced";
    });
  await set("elements-control", "elementsControlOn", false);
  return result;
};
