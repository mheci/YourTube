async () => {
  const { q, set, pane, wait, equal } = window.__controlAudit;
  const mp = q("#movie_player"),
    v = mp?.querySelector("video"),
    id = new URL(location.href).searchParams.get("v");
  const data = mp?.getVideoData?.() || {};
  const note = () =>
    Array.from(document.querySelectorAll("yt-playability-error-supported-renderers,.ytp-error-content-wrap"))
      .filter((n) => n.getClientRects().length)
      .map((n) => n.innerText.trim())
      .join(" ")
      .slice(0, 200);
  const out = {
    id,
    playerVideo: data.video_id,
    title: data.title,
    ad: mp?.classList.contains("ad-showing"),
    notice: note(),
    duration: v?.duration || 0,
    rows: [],
  };
  const frames = () => {
    const m = v.getVideoPlaybackQuality();
    return m.totalVideoFrames - m.droppedVideoFrames;
  };
  const snap = () => ({
    t: +v.currentTime.toFixed(3),
    rate: v.playbackRate,
    ready: v.readyState,
    frames: frames(),
    paused: v.paused,
    w: v.videoWidth,
    h: v.videoHeight,
  });
  const require = (b, msg) => {
    if (!b) throw Error(msg);
  };
  if (
    out.notice ||
    !v ||
    out.ad ||
    data.video_id !== id ||
    !v.videoWidth ||
    !Number.isFinite(v.duration) ||
    v.duration < 60 ||
    v.readyState < 2
  )
    return { ...out, status: "no eligible native watch playback" };
  const clock = async (ms = 1000) => {
    let t = performance.now(),
      a = snap();
    await wait(ms);
    const b = snap();
    const wall = (performance.now() - t) / 1000;
    return {
      a,
      b,
      wall: +wall.toFixed(3),
      observedRate: +((b.t - a.t) / wall).toFixed(3),
      displayed: b.frames - a.frames,
    };
  };
  const playable = async () => {
    if (v.paused)
      await Promise.race([
        v.play(),
        wait(2800).then(() => {
          throw Error("play request timed out");
        }),
      ]);
    await equal(() => !v.paused && v.readyState >= 2, true, 3500);
  };
  const seek = async (n) => {
    require(v.isConnected && !note(), "native playback unavailable");
    v.currentTime = n;
    await equal(() => !v.seeking && Math.abs(v.currentTime - n) < 0.45 && v.readyState >= 2, true, 6500);
  };
  const key = (key, code, opt = {}) =>
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", { key, code, altKey: true, bubbles: true, cancelable: true, ...opt }),
    );
  const button = (fid, t) => {
    const b = [...pane(fid).querySelectorAll("button")].find(
      (x) => x.textContent.trim() === t && x.getClientRects().length,
    );
    require(b, `Missing mounted action: ${t}`);
    b.click();
  };
  const trial = async (id, keys, description, fn) => {
    if (window.__playbackFocus?.length && !window.__playbackFocus.includes(id)) return;
    const row = { id, keys, description };
    try {
      require(v.isConnected &&
        mp.getVideoData().video_id === out.id &&
        !mp.classList.contains("ad-showing") &&
        !note(), "video replaced or not playable");
      await fn(row);
      row.pass = true;
    } catch (e) {
      row.pass = false;
      row.error = String(e);
    }
    out.rows.push(row);
  };
  try {
    await playable();
    out.initial = await clock(1150);
    require(out.initial.displayed > 0 && out.initial.observedRate > 0.15, "No advancing media and frames");
  } catch (e) {
    return { ...out, status: "no witnessed playback", reason: String(e) };
  }
  out.status = "decoded public watch playback";
  await trial(
    "speed-controller",
    ["speedRemember", "speedDefault"],
    "Default rates change both actual clock speed and displayed frames; OFF returns native clock speed",
    async (r) => {
      await set("speed-controller", "speedRemember", false);
      const base = v.playbackRate;
      r.before = await clock();
      r.samples = [];
      try {
        await set("speed-controller", "speedRemember", true);
        for (const rate of [1.75, 0.75]) {
          await set("speed-controller", "speedDefault", rate);
          await equal(() => v.playbackRate, rate);
          await wait(180);
          const m = await clock(1150);
          r.samples.push(m);
          require(m.displayed > 0 && Math.abs(rate - m.observedRate) < 0.28, "No matching decoded rate " +
            rate);
        }
      } finally {
        await set("speed-controller", "speedRemember", false);
      }
      await equal(() => v.playbackRate, base);
      r.off = await clock(1000);
      require(r.off.displayed > 0 && Math.abs(r.off.observedRate - base) < 0.28, "native rate not restored");
    },
  );
  await trial(
    "pause-auto-rewind",
    ["pauseRewindOn", "pauseRewindSec"],
    "A native pause rewinds by each selected interval; after OFF, a fresh pause keeps its position",
    async (r) => {
      r.samples = [];
      try {
        await set("pause-auto-rewind", "pauseRewindOn", true);
        for (const sec of [2, 5]) {
          await set("pause-auto-rewind", "pauseRewindSec", sec);
          await playable();
          await seek(14);
          await wait(170);
          const before = v.currentTime;
          v.pause();
          await equal(
            () => v.paused && !v.seeking && Math.abs(v.currentTime - (before - sec)) < 0.3,
            true,
            4200,
          );
          r.samples.push({ sec, before, pausedAt: v.currentTime });
        }
      } finally {
        await set("pause-auto-rewind", "pauseRewindOn", false);
      }
      await playable();
      await wait(330);
      const before = v.currentTime;
      v.pause();
      await wait(320);
      r.off = { before, pausedAt: v.currentTime };
      require(Math.abs(before - v.currentTime) < 0.18, "pause still rewinds");
    },
  );
  await trial(
    "instant-replay",
    ["instantReplayOn", "instantReplaySec"],
    "The replay hotkey seeks a real video by each selected interval; the same key stops seeking when disabled",
    async (r) => {
      v.pause();
      r.samples = [];
      try {
        await set("instant-replay", "instantReplayOn", true);
        for (const sec of [4, 8]) {
          await set("instant-replay", "instantReplaySec", sec);
          await seek(18);
          key("j", "KeyJ");
          await equal(() => !v.seeking && Math.abs(v.currentTime - (18 - sec)) < 0.18, true, 4200);
          r.samples.push({ sec, from: 18, to: v.currentTime });
        }
      } finally {
        await set("instant-replay", "instantReplayOn", false);
      }
      await seek(18);
      key("j", "KeyJ");
      await wait(240);
      r.off = v.currentTime;
      require(Math.abs(18 - r.off) < 0.18, "disabled key still seeks");
    },
  );
  await trial(
    "forward-rewind-buttons",
    ["forwardRewindOn", "forwardRewindSec"],
    "Forward and rewind on the real player use the newly selected step; OFF removes both",
    async (r) => {
      v.pause();
      r.samples = [];
      try {
        await set("forward-rewind-buttons", "forwardRewindOn", true);
        for (const sec of [3, 6]) {
          await set("forward-rewind-buttons", "forwardRewindSec", sec);
          await seek(18);
          for (const [cls, want] of [
            ["forward", 18 + sec],
            ["rewind", 18],
          ]) {
            const b = mp.querySelector(".ytb-fr-" + cls);
            require(b && b.getClientRects().length, "missing mounted " + cls);
            b.click();
            await equal(() => !v.seeking && Math.abs(v.currentTime - want) < 0.18, true, 4200);
            r.samples.push({ sec, direction: cls, at: v.currentTime });
          }
        }
      } finally {
        await set("forward-rewind-buttons", "forwardRewindOn", false);
      }
      r.off = await equal(() => mp.querySelectorAll(".ytb-fr-btn").length, 0);
    },
  );
  await trial(
    "frame-stepper",
    ["frameStepperOn", "frameFps"],
    "The frame-forward control seeks by the selected frame interval; OFF removes frame controls",
    async (r) => {
      v.pause();
      r.samples = [];
      try {
        await set("frame-stepper", "frameStepperOn", true);
        for (const fps of [20, 50]) {
          await set("frame-stepper", "frameFps", fps);
          await seek(12);
          const b = mp.querySelector("#ytb-framefwd");
          require(b && b.getClientRects().length, "no visible frame button");
          const before = v.currentTime;
          b.click();
          await equal(() => !v.seeking && Math.abs(v.currentTime - before - 1 / fps) < 0.008, true, 4000);
          r.samples.push({ fps, before, to: v.currentTime });
        }
      } finally {
        await set("frame-stepper", "frameStepperOn", false);
      }
      r.off = await equal(() => mp.querySelectorAll("#ytb-frameback,#ytb-framefwd").length, 0);
    },
  );
  const loop = "ab-repeat";
  await trial(
    loop,
    ["abLoopOn", "Set A", "Set B", "Clear"],
    "Natural timeupdate loops across B to A, then passes the previous B after Clear and after master OFF",
    async (r) => {
      await set(loop, "abLoopOn", true);
      const a = 8,
        b = 11;
      async function mark() {
        v.pause();
        button(loop, "Clear");
        await seek(a);
        button(loop, "Set A");
        await seek(b);
        button(loop, "Set B");
        await wait(80);
        v.pause();
        await seek(b - 1.25);
      }
      async function cross(expectJump) {
        await playable();
        const samples = [];
        let prev = v.currentTime,
          near = false;
        for (let j = 0; j < 70; j++) {
          await wait(60);
          const cur = v.currentTime;
          samples.push(+cur.toFixed(3));
          if (cur > b - 0.5) near = true;
          if (expectJump && near && prev - cur > 1.4 && Math.abs(cur - a) < 0.8) return samples;
          if (!expectJump && cur > b + 0.4) return samples;
          prev = cur;
        }
        throw Error("No expected natural boundary: " + samples.slice(-10));
      }
      try {
        await mark();
        r.loop = await cross(true);
        v.pause();
        button(loop, "Clear");
        await seek(b - 1.25);
        r.cleared = await cross(false);
        await mark();
      } finally {
        await set(loop, "abLoopOn", false);
      }
      r.off = await cross(false);
      v.pause();
    },
  );
  await trial(
    "wheel-controls",
    ["wheelControlsOn", "wheelVolumeStep", "wheelSeekStep"],
    "Actual volume and timeline on the native watch player, including repeated wheel events after OFF",
    async (r) => {
      const bar = mp.querySelector(".ytp-progress-bar");
      require(bar, "No native timeline");
      const wheel = (n) =>
        n.dispatchEvent(new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY: -100 }));
      const original = v.volume;
      v.pause();
      r.samples = [];
      try {
        await set("wheel-controls", "wheelControlsOn", true);
        for (const [volume, sec] of [
          [7, 3],
          [12, 5],
        ]) {
          await set("wheel-controls", "wheelVolumeStep", volume);
          await set("wheel-controls", "wheelSeekStep", sec);
          v.volume = 0.5;
          await seek(12);
          wheel(mp);
          await equal(() => Math.round(v.volume * 100), 50 + volume);
          wheel(bar);
          await equal(() => !v.seeking && Math.abs(v.currentTime - 12 - sec) < 0.2, true, 4500);
          r.samples.push({ volume, sec, at: v.currentTime, actualVolume: v.volume });
        }
      } finally {
        await set("wheel-controls", "wheelControlsOn", false);
      }
      await seek(12);
      v.volume = 0.5;
      wheel(mp);
      wheel(bar);
      await wait(250);
      r.off = { volume: v.volume, at: v.currentTime };
      v.volume = original;
      require(r.off.volume === 0.5 && Math.abs(r.off.at - 12) < 0.2, "disabled wheel still affects media");
    },
  );
  await trial(
    "stop-button",
    ["stopButtonOn", "Stop now"],
    "Dashboard Stop now halts advancing, decoded media and returns the playhead to the beginning",
    async (r) => {
      await set("stop-button", "stopButtonOn", true);
      try {
        await playable();
        r.before = await clock(750);
        require(r.before.displayed > 0 &&
          r.before.observedRate > 0.3 &&
          v.currentTime > 1, "not advancing before stop");
        button("stop-button", "Stop now");
        await equal(() => v.paused && v.currentTime < 0.25, true, 3500);
        await wait(400);
        r.after = snap();
        require(r.after.paused && r.after.t < 0.25, "did not stay stopped");
      } finally {
        await set("stop-button", "stopButtonOn", false);
      }
      r.off = await equal(() => mp.querySelectorAll(".ytb-stop-btn").length, 0);
    },
  );
  return out;
};
