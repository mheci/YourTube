async () => {
  const { q, pane, pick, set, equal, wait } = window.__controlAudit,
    rows = [];
  const visible = (s) =>
    [...document.querySelectorAll(s)].find((n) => n.getClientRects().length && !n.closest(".ytb-dash"));
  const check = async (id, key, fn) => {
    const r = { id, key };
    try {
      await fn(r);
      if (!r.status) r.status = "measured both directions";
    } catch (e) {
      r.status = "not verified";
      r.error = String(e);
    }
    rows.push(r);
  };
  if (location.pathname === "/results") {
    const theme = "theme-engine",
      bundle = "aio-compact-dense",
      tile = () => pane(theme).querySelector('[data-ytb-theme-id]:not([data-ytb-theme-id="none"])');
    await set(theme, "themeEngineOn", true);
    const reset = pane(theme).querySelector('[data-ytb-theme-id="none"]');
    reset.click();
    const card = visible("ytd-video-renderer"),
      mast = visible("ytd-masthead"),
      app = visible("ytd-app");
    for (const [key, node, prop, matches] of [
      ["themeGlassOverhaulOn", mast, "backdropFilter", (s) => s.includes("24px")],
      ["themeOverhaulOn", app, "backgroundImage", (s) => s.includes("linear-gradient")],
    ]) {
      await check(theme, key, async (r) => {
        if (!node) {
          r.status = "no eligible native target";
          return;
        }
        const read = () => getComputedStyle(node)[prop];
        await set(theme, key, false);
        r.before = read();
        if (matches(r.before)) {
          r.status = "native value already matches";
          return;
        }
        try {
          await set(theme, key, true);
          await equal(() => matches(read()), true, 900);
          r.on = read();
        } finally {
          await set(theme, key, false);
        }
        r.off = await equal(read, r.before, 1300);
      });
    }
    if (card) {
      await check(theme, "themeFxReducedMotion", async (r) => {
        await set(theme, "themeOverhaulOn", true);
        const read = () => getComputedStyle(card).transitionDuration;
        try {
          await set(theme, "themeFxReducedMotion", false);
          r.before = await equal(read, "0.18s", 1300);
          await set(theme, "themeFxReducedMotion", true);
          r.on = await equal(read, "0s", 1300);
          await set(theme, "themeFxReducedMotion", false);
          r.off = await equal(read, r.before, 1300);
        } finally {
          await set(theme, "themeOverhaulOn", false);
        }
      });
      pick(theme);
      tile().click();
      await wait(180);
      const read = () => getComputedStyle(card).marginTop;
      for (const [id, key] of [
        [bundle, "themeCompactOn"],
        [bundle, "aioCompactDenseOn"],
      ])
        await check(id, key, async (r) => {
          await set(bundle, "themeCompactOn", false);
          await wait(230);
          r.before = read();
          if (r.before === "2px") {
            r.status = "native spacing already matches";
            return;
          }
          try {
            await set(id, key, true);
            r.on = await equal(read, "2px", 1600);
          } finally {
            await set(id, key, false);
          }
          r.off = await equal(read, r.before, 1600);
          if (!card.isConnected) r.status = "native node replaced";
        });
      await set(bundle, "themeCompactOn", true);
    }
    reset.click();
    await set(theme, "themeEngineOn", false);
  }
  if (location.pathname === "/watch") {
    await check("cinema-mode", "cinemaOp", async (r) => {
      const id = "cinema-mode";
      await set(id, "cinemaMode", false);
      r.before = !!q("#ytb-cinema-backdrop");
      await set(id, "cinemaMode", true);
      r.samples = [];
      try {
        for (const value of [0.35, 0.9, 0.35]) {
          await set(id, "cinemaOp", value);
          r.samples.push({
            value,
            actual: await equal(
              () =>
                q("#ytb-cinema-backdrop")?.getClientRects().length
                  ? Number(getComputedStyle(q("#ytb-cinema-backdrop")).opacity)
                  : null,
              value,
              1300,
            ),
          });
        }
      } finally {
        await set(id, "cinemaMode", false);
      }
      r.off = await equal(() => !!q("#ytb-cinema-backdrop"), r.before);
    });
    await check("description-width", "descriptionWidthPreset", async (r) => {
      const id = "description-width",
        n = visible("ytd-watch-flexy[flexy] #columns");
      if (!n) {
        r.status = "no visible matching watch columns";
        return;
      }
      const read = () => Math.round(n.getBoundingClientRect().width);
      await set(id, "descriptionWidthOn", false);
      r.before = read();
      await set(id, "descriptionWidthOn", true);
      try {
        await set(id, "descriptionWidthPreset", 1200);
        await wait(180);
        const a = read();
        await set(id, "descriptionWidthPreset", 1600);
        await equal(() => read() - a, 400, 1400);
        r.samples = [
          { selected: 1200, width: a },
          { selected: 1600, width: read() },
        ];
      } finally {
        await set(id, "descriptionWidthOn", false);
      }
      r.off = await equal(read, r.before, 1600);
      if (!n.isConnected) r.status = "native node replaced";
    });
    const side = visible("#secondary,#related");
    if (side)
      await check("aio-feed-cleanup", "hideRecs", async (r) => {
        const id = "aio-feed-cleanup",
          key = "hideRecs";
        await set(id, key, false);
        const read = () => !!side.getClientRects().length;
        r.before = read();
        if (!r.before) {
          r.status = "target already hidden";
          return;
        }
        try {
          await set(id, key, true);
          r.on = await equal(read, false, 900);
        } finally {
          await set(id, key, false);
        }
        r.off = await equal(read, true, 1300);
      });
    const item = [...document.querySelectorAll("ytd-comment-thread-renderer #content-text")].find(
      (n) => n.getClientRects().length && n.textContent.length >= 400 && n.textContent.length < 5000,
    );
    if (item) {
      const id = "aio-comment-cleanup",
        read = () => item.classList.contains("ytb-extra-comment-clamp");
      await set(id, "collapseLongCommentChars", 400);
      await check(id, "collapseLongCommentsOn", async (r) => {
        await set(id, "collapseLongCommentsOn", false);
        r.before = read();
        try {
          await set(id, "collapseLongCommentsOn", true);
          r.on = await equal(read, true, 1500);
        } finally {
          await set(id, "collapseLongCommentsOn", false);
        }
        r.off = await equal(read, false, 1000);
      });
      await check(id, "collapseLongCommentChars", async (r) => {
        await set(id, "collapseLongCommentsOn", true);
        r.samples = [];
        try {
          for (const [n, want] of [
            [5000, false],
            [400, true],
            [5000, false],
          ]) {
            await set(id, "collapseLongCommentChars", n);
            r.samples.push({ threshold: n, clamped: await equal(read, want, 1600) });
          }
        } finally {
          await set(id, "collapseLongCommentsOn", false);
        }
        r.off = await equal(read, false, 1000);
      });
    }
  }
  return rows;
};
