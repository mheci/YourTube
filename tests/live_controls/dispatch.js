async () => {
  scene(
    labPlayer +
      '<div id="columns"></div><div id="comments" style="display:block">42 comments</div><tp-yt-iron-dropdown opened style="display:block">Open native menu</tp-yt-iron-dropdown>',
  );
  await wait(350);
  await paired(
    "hide-comments",
    "hideComments",
    "Comments disappear and return while a native menu stays open",
    false,
    true,
    () => style("#comments", "display"),
    "block",
    "none",
  );
  q("tp-yt-iron-dropdown").remove();
  await wait(300);
  await paired(
    "speed-controller",
    "speedRemember",
    "Current player rate, existing player, master switch",
    false,
    true,
    () => q("video").playbackRate,
    1,
    1.75,
  );
  await set("speed-controller", "speedRemember", true);
  await paired(
    "speed-controller",
    "speedDefault",
    "Selected default immediately changes current rate",
    1.25,
    2.5,
    () => q("video").playbackRate,
    1.25,
    2.5,
  );
  await trial(
    "speed-controller",
    "speedRemember",
    "Native rate change carries to replacement video; off stops applying it",
    async (r) => {
      const old = q("video");
      old.playbackRate = 2;
      old.dispatchEvent(new Event("ratechange"));
      const fresh = old.cloneNode();
      old.replaceWith(fresh);
      fresh.dispatchEvent(new Event("loadedmetadata"));
      r.newRate = await equal(() => fresh.playbackRate, 2);
      await set("speed-controller", "speedRemember", false);
      const next = fresh.cloneNode();
      fresh.replaceWith(next);
      next.dispatchEvent(new Event("loadedmetadata"));
      r.afterOff = await equal(() => next.playbackRate, 1);
      r.pass = true;
    },
  );
  scene(
    '<ytd-reel-shelf-renderer id="shelf" style="display:block">Shelf</ytd-reel-shelf-renderer><a id="short" href="/shorts/abcdef?list=PLx#here">Short</a>',
    "/results?search_query=t",
  );
  await set("hide-shorts", "hideShorts", true);
  await paired(
    "hide-shorts",
    "hideShortsDomClean",
    "Exact original shelf detaches and returns to same slot",
    false,
    true,
    () => !!q("#shelf"),
    true,
    false,
  );
  await paired(
    "hide-shorts",
    "hideShortsRedirect",
    "Rewrite/restore existing link, preserving playlist and fragment",
    false,
    true,
    () => q("#short").getAttribute("href"),
    "/shorts/abcdef?list=PLx#here",
    "/watch?v=abcdef&list=PLx#here",
  );
  await trial(
    "hide-shorts",
    "hideShortsApiFilter",
    "Next incoming feed retains normal entry and conditionally excludes Shorts",
    async (r) => {
      const vals = () => {
        window.ytInitialData = {
          contents: [{ reelItemRenderer: { videoId: "short" } }, { videoRenderer: { videoId: "normal" } }],
        };
        return ytInitialData.contents.map((x) => Object.keys(x)[0]);
      };
      r.samples = [];
      for (const input of [false, true, false]) {
        await set("hide-shorts", "hideShortsApiFilter", input);
        r.samples.push({ input, result: vals() });
      }
      r.pass = JSON.stringify(r.samples.map((x) => x.result.length)) === "[2,1,2]";
    },
  );
  await set("hide-shorts", "hideShorts", false);
  scene(
    '<yt-lockup-view-model id="dub"><yt-badge-shape aria-label="Auto-dubbed">Auto-dubbed</yt-badge-shape></yt-lockup-view-model><yt-lockup-view-model id="native">Original</yt-lockup-view-model>',
    "/",
  );
  await paired(
    "hide-auto-dubbed",
    "hideAutoDubbedOn",
    "Already-rendered labeled card only; untouched original remains visible",
    false,
    true,
    () => [style("#dub", "display"), style("#native", "display")],
    ["block", "block"],
    ["none", "block"],
  );
  scene(
    '<ytd-comment-thread-renderer><div id="content-text">' +
      "z".repeat(700) +
      "</div></ytd-comment-thread-renderer>",
  );
  await set("collapse-long-comments", "collapseLongCommentsOn", true);
  await paired(
    "collapse-long-comments",
    "collapseLongCommentChars",
    "Current comment unclamps and re-clamps when threshold changes",
    400,
    1000,
    () => [
      q("#content-text").classList.contains("ytb-extra-comment-clamp"),
      !!q(".ytb-extra-expand-comment"),
    ],
    [true, true],
    [false, false],
  );
  await set("collapse-long-comments", "collapseLongCommentsOn", false);
  scene(
    '<div id="cinematics"></div>' +
      labPlayer +
      '<ytd-notification-topbar-button-renderer><span id="notification-count" style="display:inline">7</span></ytd-notification-topbar-button-renderer><yt-live-chat-paid-message-renderer style="display:block">paid</yt-live-chat-paid-message-renderer><yt-live-chat-text-message-renderer style="padding:9px">message</yt-live-chat-text-message-renderer>',
  );
  const mp = q("#movie_player");
  for (const [setter, getter] of [
    ["setDrcUserPreference", "getDrcUserPreference"],
    ["setVoiceBoostUserPreference", "getVoiceBoostUserPreference"],
  ]) {
    let value = 1;
    mp[setter] = (v) => (value = v);
    mp[getter] = () => value;
  }
  await set("player-effects-block", "blockPlayerFxOn", true);
  for (const [key, member] of [
    ["blockStableVolume", "Drc"],
    ["blockVoiceBoost", "VoiceBoost"],
  ])
    await paired(
      "player-effects-block",
      key,
      "Native player setter receives allowed or blocked preference",
      false,
      true,
      () => mp["get" + member + "UserPreference"](),
      1,
      0,
      () => mp["set" + member + "UserPreference"](1),
    );
  await paired(
    "player-effects-block",
    "blockAmbient",
    "Glow renderer visibility",
    false,
    true,
    () => style("#cinematics", "display"),
    "block",
    "none",
  );
  await set("player-effects-block", "blockPlayerFxOn", false);
  await set("notification-clean", "notificationCleanOn", true);
  await paired(
    "notification-clean",
    "notificationHideBadge",
    "Unread badge visibility",
    false,
    true,
    () => style("#notification-count", "display"),
    "inline",
    "none",
  );
  await set("live-chat-clean", "liveChatCleanOn", true);
  await paired(
    "live-chat-clean",
    "liveChatHidePaid",
    "Paid chat renderer visibility",
    false,
    true,
    () => style("yt-live-chat-paid-message-renderer", "display"),
    "block",
    "none",
  );
  await paired(
    "live-chat-clean",
    "liveChatCompact",
    "Existing message padding",
    false,
    true,
    () => style("yt-live-chat-text-message-renderer", "padding-top"),
    "9px",
    "2px",
  );
  const frame = document.createElement("iframe");
  frame.id = "chatframe";
  frame.srcdoc =
    '<yt-live-chat-paid-message-renderer style="display:block">live chat</yt-live-chat-paid-message-renderer>';
  q("#stage").append(frame);
  await new Promise((r) => {
    frame.addEventListener("load", r, { once: true });
    setTimeout(r, 300);
  });
  await paired(
    "live-chat-clean",
    "liveChatHidePaid",
    "Inside loaded same-origin chat iframe (not top document)",
    false,
    true,
    () =>
      frame.contentWindow.getComputedStyle(
        frame.contentDocument.querySelector("yt-live-chat-paid-message-renderer"),
      ).display,
    "block",
    "none",
  );
  return rows;
};
