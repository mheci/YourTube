async () => {
  const { set, equal, wait } = window.__controlAudit;
  const id = location.pathname.split("/")[2];
  const notice = [
    ...document.querySelectorAll("yt-playability-error-supported-renderers,.ytp-error-content-wrap"),
  ]
    .filter((n) => n.getClientRects().length)
    .map((n) => n.innerText.trim())
    .join(" ")
    .slice(0, 160);
  const v = [
    ...document.querySelectorAll(
      "ytd-reel-video-renderer[is-active] video,ytd-reel-video-renderer[active] video,#shorts-player video",
    ),
  ].find((n) => n.videoWidth && !n.paused && n.getClientRects().length);
  const mp = v?.closest(".html5-video-player"),
    vid = mp?.getVideoData?.()?.video_id;
  const result = { id, playerVideo: vid || null, notice, rows: [] };
  if (
    notice ||
    !v ||
    vid !== id ||
    mp.classList.contains("ad-showing") ||
    v.readyState < 2 ||
    !isFinite(v.duration)
  )
    return { ...result, status: "no eligible decoded Short" };
  const others = [...document.querySelectorAll("ytd-reel-video-renderer video")].filter((n) => n !== v);
  const meter = async () => {
    const a = v.currentTime,
      x = v.getVideoPlaybackQuality(),
      s = performance.now();
    await wait(750);
    const b = v.currentTime,
      y = v.getVideoPlaybackQuality();
    return {
      from: a,
      to: b,
      observedRate: (b - a) / ((performance.now() - s) / 1e3),
      displayed: y.totalVideoFrames - y.droppedVideoFrames - (x.totalVideoFrames - x.droppedVideoFrames),
    };
  };
  result.initial = await meter();
  if (result.initial.displayed <= 0 || result.initial.observedRate < 0.2)
    return { ...result, status: "no witnessed advancing Short" };
  result.status = "decoded public Shorts playback";
  const trial = async (id, keys, description, fn) => {
    const r = { id, keys, description };
    try {
      await fn(r);
      if (location.pathname.split("/")[2] !== result.id || !v.isConnected)
        throw Error("active Short replaced");
      r.pass = true;
    } catch (e) {
      r.error = String(e);
      r.pass = false;
    }
    result.rows.push(r);
  };
  await trial(
    "shorts-speed",
    ["shortsSpeedOn", "shortsSpeedDefault"],
    "Actual speed of decoded video and reversal on the active Short",
    async (r) => {
      const f = "shorts-speed";
      await set(f, "shortsSpeedOn", false);
      r.before = v.playbackRate;
      const prior = others.map((o) => o.playbackRate);
      r.samples = [];
      try {
        await set(f, "shortsSpeedOn", true);
        for (const n of [1.5, 0.75]) {
          await set(f, "shortsSpeedDefault", n);
          await equal(() => v.playbackRate, n, 1400);
          const m = await meter();
          r.samples.push(m);
          if (m.displayed <= 0 || Math.abs(m.observedRate - n) > 0.3) throw Error("decoded clock mismatch");
        }
      } finally {
        await set(f, "shortsSpeedOn", false);
      }
      r.off = await equal(() => v.playbackRate, r.before);
      r.inactiveUnchanged = others.every((v, i) => v.playbackRate === prior[i]);
      if (!r.inactiveUnchanged) throw Error("inactive changed");
    },
  );
  await trial(
    "shorts-speed",
    ["shortsProgressOn"],
    "Visible progress follows the active decoded playhead; disappears when disabled",
    async (r) => {
      const f = "shorts-speed";
      await set(f, "shortsSpeedOn", true);
      try {
        await set(f, "shortsProgressOn", false);
        const read = () => {
          const n = document.querySelector(".ytb-ui-shorts-progress");
          return n?.getClientRects().length ? parseFloat(n.firstChild.style.width) : null;
        };
        r.before = read();
        await set(f, "shortsProgressOn", true);
        await equal(() => read() !== null, true, 1300);
        r.a = read();
        await wait(1400);
        r.b = read();
        if (r.a === r.b) throw Error("progress did not advance");
        await set(f, "shortsProgressOn", false);
        r.off = await equal(read, null, 1500);
      } finally {
        await set(f, "shortsSpeedOn", false);
      }
    },
  );
  return result;
};
