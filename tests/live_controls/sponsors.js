async () => {
  scene(labPlayer + '<span class="ytp-time-duration">2:00</span>');
  const id = "sponsorblock",
    v = q("video"),
    cats = [
      "sponsor",
      "selfpromo",
      "interaction",
      "intro",
      "outro",
      "preview",
      "hook",
      "filler",
      "music_offtopic",
      "poi_highlight",
      "exclusive_access",
      "chapter",
    ];
  let t = 0,
    playing = false;
  Object.defineProperties(v, {
    duration: { configurable: true, get: () => 120 },
    currentTime: {
      configurable: true,
      get: () => t,
      set: (x) => {
        t = x;
      },
    },
    paused: { configurable: true, get: () => !playing },
  });
  const seg = cats.map((cat, i) => ({
    category: cat,
    UUID: "case-" + cat,
    segment: [i * 7 + 2, i * 7 + 6],
    actionType: "skip",
    description: "Chapter " + i,
  }));
  for (const profile of ["0", "1"])
    await YourTube.storage.set("cache:sb:LabVideo001:all-categories-v2:" + profile, {
      version: 6,
      videoId: "LabVideo001",
      segments: seg,
      fetchedAt: Date.now(),
      expiresAt: Date.now() + 180000,
    });
  await set(id, "sponsorblockOn", true);
  for (const [k, val] of Object.entries({
    sbIncognito: true,
    sbDisable: false,
    sbOnlySkipIfVip: false,
    sbSkipCountdown: false,
    sbMinDuration: 0,
    sbSeekbar: true,
    sbToast: false,
    sbBetterBeAware: "",
    sbWhitelist: "",
  }))
    await set(id, k, val);
  await wait(450);
  const ready = async () => {
    await equal(() => YourTube.sb.debugTick().count, 12, 1300);
    await wait(25);
  };
  for (const [i, cat] of cats.entries()) {
    const start = i * 7 + 2,
      end = i * 7 + 6,
      k = "sb_" + cat;
    const tick = async () => {
      await ready();
      t = start + 1;
      playing = true;
      v.dispatchEvent(new Event("timeupdate"));
      playing = false;
    };
    await set(id, k + "_en", true);
    await set(id, k + "_act", "skip");
    await paired(
      id,
      k + "_en",
      "Category controls actual seek at a segment boundary",
      false,
      true,
      () => t,
      start + 1,
      end,
      tick,
    );
    await set(id, k + "_en", true);
    await paired(
      id,
      k + "_act",
      "Label-only vs automatic seek",
      "full",
      "skip",
      () => t,
      start + 1,
      end,
      tick,
    );
    await paired(
      id,
      k + "_sb",
      "This category’s marker is added and removed without affecting the others",
      false,
      true,
      () => !!q('[data-sb-key="case-' + cat + '"]'),
      false,
      true,
      ready,
    );
  }
  await set(id, "sb_sponsor_en", true);
  await set(id, "sb_sponsor_act", "skip");
  await set(id, "sb_sponsor_sb", true);
  const stim = async () => {
    await ready();
    await wait(555);
    t = 3;
    playing = true;
    v.dispatchEvent(new Event("timeupdate"));
    playing = false;
  };
  for (const [key, a, b] of [
    ["sbDisable", false, true],
    ["sbOnlySkipIfVip", false, true],
    ["sbMinDuration", 0, 10],
    ["sbBetterBeAware", "", "sponsor"],
  ])
    await paired(
      id,
      key,
      "Skip vs retain playhead inside the same non-VIP 4-second sponsor segment",
      a,
      b,
      () => t,
      6,
      3,
      stim,
    );
  await paired(
    id,
    "sbSeekbar",
    "Display of existing timeline marker",
    false,
    true,
    () => !!q('[data-sb-key="case-sponsor"]'),
    false,
    true,
    ready,
  );
  await paired(
    id,
    "sbHud",
    "Stats chip visible without needing a new segment",
    false,
    true,
    () => !!q("#ytb-sb-hud")?.getClientRects().length,
    false,
    true,
  );
  await paired(
    id,
    "sbTimeWithSkips",
    "Skippable duration appended to player time display",
    false,
    true,
    () => !!q(".ytb-sb-timechip")?.textContent,
    false,
    true,
    ready,
  );
  await set(id, "sb_chapter_en", true);
  await paired(
    id,
    "sbRenderChapters",
    "Chapter divider with its recorded title",
    false,
    true,
    () => !!q('.ytb-sb-chdiv[title="Chapter 11"]'),
    false,
    true,
    ready,
  );
  await paired(
    id,
    "sbToast",
    "Skip creates or suppresses the action notification",
    false,
    true,
    () => !!q("#YourTube-sb-hud")?.getClientRects().length,
    false,
    true,
    async () => {
      q("#YourTube-sb-hud")?.remove();
      await stim();
    },
  );
  await set(id, "sbSkipCountdownTime", 3);
  await paired(
    id,
    "sbSkipCountdown",
    "Two consecutive playback ticks must respect the pending countdown",
    false,
    true,
    () => [t, !!q("#YourTube-sb-countdown")],
    [6, false],
    [3, true],
    async () => {
      await stim();
      playing = true;
      v.dispatchEvent(new Event("timeupdate"));
      playing = false;
    },
  );
  await trial(id, "sbSkip", "Enter in a known segment performs the manual skip (no API vote)", async (r) => {
    await set(id, "sbDisable", false);
    await set(id, "sb_sponsor_act", "full");
    await ready();
    t = 3;
    r.before = t;
    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }));
    r.after = t;
    r.pass = t === 6;
  });
  return rows;
};
