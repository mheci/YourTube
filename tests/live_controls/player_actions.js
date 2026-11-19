async () => {
  scene(
    labPlayer +
      '<div style="position:relative;width:400px;height:200px"><div class="ytp-caption-window-container" style="position:absolute;width:20px;height:20px"><span class="ytp-caption-segment">Field sample</span></div></div>',
  );
  const v = q("video"),
    mp = q("#movie_player");
  v.src = "/audit/media.webm";
  v.load();
  await equal(() => v.readyState >= 2, true, 4000);
  const caption = (prop) => getComputedStyle(q(".ytp-caption-segment")).getPropertyValue(prop);
  const cc = (key, a, b, read, w1, w2) =>
    paired("force-cc", key, "Caption styling on the existing subtitle segment", a, b, read, w1, w2);
  await set("force-cc", "forceCC", true);
  for (const [key, prop, a, b, w1, w2] of [
    ["ccFontWeight", "font-weight", "400", "800", "400", "800"],
    ["ccFontSize", "font-size", 20, 54, "20px", "54px"],
    ["ccUppercase", "text-transform", false, true, "none", "uppercase"],
    ["ccRadius", "border-top-left-radius", 0, 16, "0px", "16px"],
    ["ccTextColor", "color", "#112233", "#dd8833", "rgb(17, 34, 51)", "rgb(221, 136, 51)"],
  ])
    await cc(key, a, b, () => caption(prop), w1, w2);
  await set("force-cc", "ccBgOpacity", 100);
  await cc(
    "ccBgColor",
    "#201008",
    "#b83c6f",
    () => caption("background-color"),
    "rgb(32, 16, 8)",
    "rgb(184, 60, 111)",
  );
  await set("force-cc", "ccBgColor", "#201008");
  await cc(
    "ccBgOpacity",
    0,
    50,
    () => caption("background-color"),
    "rgba(32, 16, 8, 0)",
    "rgba(32, 16, 8, 0.5)",
  );
  await set("force-cc", "ccFontSize", 20);
  await cc("ccLetterSpacing", -10, 20, () => caption("letter-spacing"), "-2px", "4px");
  await cc("ccLineHeight", 1, 1.5, () => caption("line-height"), "20px", "30px");
  await cc("ccTextShadow", "none", "heavy", () => caption("text-shadow") === "none", true, false);
  await trial("force-cc", "ccPos", "Position choices reach the existing captions container", async (r) => {
    r.samples = [];
    for (const [value, axis, want] of [
      ["left", "offsetLeft", 4],
      ["right", "offsetLeft", 376],
      ["bottom", "offsetTop", 180],
      ["top", "offsetTop", 4],
      ["middle", "offsetTop", 100],
    ]) {
      await set("force-cc", "ccPos", value);
      const n = q(".ytp-caption-window-container");
      r.samples.push({ value, axis, actual: await equal(() => n[axis], want) });
    }
    r.pass = true;
  });
  await trial(
    "force-cc",
    "ccFontFamily",
    "Open picker, filter options and choose an actual font stack",
    async (r) => {
      pick("force-cc");
      const p = pane("force-cc"),
        btn = p.querySelector(".ytb-fp-btn");
      btn.click();
      const input = p.querySelector(".ytb-fp-dd input");
      input.value = "Georgia";
      input.dispatchEvent(new Event("input"));
      const item = [...p.querySelectorAll(".ytb-fp-item")].find((i) => i.getClientRects().length);
      if (!item) throw Error("no Georgia option");
      item.click();
      r.observed = await equal(() => caption("font-family").toLowerCase().includes("georgia"), true);
      r.pass = true;
    },
  );
  const tracks = [
    { languageCode: "en", vssId: ".en" },
    { languageCode: "en", kind: "asr", vssId: "a.en.asr" },
    { languageCode: "de", vssId: ".de", isTranslatable: true },
  ];
  let selected = null,
    nativeCalls = 0;
  mp.getOption = (m, k) => (k === "tracklist" ? tracks : null);
  mp.setOption = (m, k, x) => {
    if (k === "track") selected = x;
    else nativeCalls++;
  };
  await set("force-cc", "forceCCLang", "en");
  await paired(
    "force-cc",
    "ccKindPref",
    "Chosen track sent to the instrumented player API",
    "human",
    "asr",
    () => selected?.vssId,
    ".en",
    "a.en.asr",
  );
  await paired(
    "force-cc",
    "forceCCLang",
    "Language rule chooses the matching offered track",
    "en",
    "de",
    () => selected?.languageCode,
    "en",
    "de",
  );
  await set("force-cc", "forceCCLang", "fr");
  await paired(
    "force-cc",
    "ccFallbackLangs",
    "Fallback list changes selection when requested language is absent",
    "en",
    "de",
    () => selected?.languageCode,
    "en",
    "de",
  );
  await set("force-cc", "ccFallbackLangs", "");
  await set("force-cc", "ccAutoTranslate", true);
  await paired(
    "force-cc",
    "ccTranslateTo",
    "Player receives requested translation language",
    "en",
    "de",
    () => selected?.translationLanguage?.languageCode,
    "en",
    "de",
  );
  await trial(
    "force-cc",
    "ccNativePrefs",
    "Native preference API calls on enable; none on the next event after disable",
    async (r) => {
      await set("force-cc", "ccNativePrefs", false);
      nativeCalls = 0;
      await set("force-cc", "ccNativePrefs", true);
      r.on = await equal(() => nativeCalls > 0, true);
      await set("force-cc", "ccNativePrefs", false);
      nativeCalls = 0;
      v.dispatchEvent(new Event("loadedmetadata"));
      await wait(170);
      r.afterOff = nativeCalls;
      r.pass = r.on && r.afterOff === 0;
    },
  );
  await set("force-cc", "forceCC", false);
  const available = [
    { mimeType: 'video/mp4; codecs="av01"', id: "av1" },
    { mimeType: 'video/webm; codecs="vp09"', id: "vp9" },
    { mimeType: 'video/mp4; codecs="avc1"', id: "avc" },
    { mimeType: 'audio/mp4; codecs="mp4a"', id: "aac" },
    { mimeType: 'audio/webm; codecs="opus"', id: "opus" },
  ];
  const response = { streamingData: { adaptiveFormats: available.slice(), formats: [] } };
  mp.getPlayerResponse = () => response;
  let level = "small";
  mp.getPlaybackQuality = () => level;
  mp.getAvailableQualityLevels = () => ["hd1080", "hd720", "small"];
  mp.setPlaybackQualityRange = (x) => (level = x);
  mp.setPlaybackQuality = (x) => (level = x);
  await set("auto-hd", "autoHD", true);
  await paired(
    "auto-hd",
    "qualityPref",
    "Player resolution/range setter, not a network quality claim",
    "hd720",
    "hd1080",
    () => level,
    "hd720",
    "hd1080",
  );
  await trial("auto-hd", "fallback", "Uses the next lower offered level, then retries the preference", async (r) => {
    mp.getAvailableQualityLevels = () => ["hd720", "small"];
    await set("auto-hd", "qualityPref", "hd1080");
    r.fallback = await equal(() => level, "hd720");
    mp.getAvailableQualityLevels = () => ["hd1080", "hd720", "small"];
    r.preferred = await equal(() => level, "hd1080", 7000);
    r.pass = true;
  });
  await trial("auto-hd", "no-higher-fallback", "Does not force a higher level when no lower quality is offered", async (r) => {
    mp.getAvailableQualityLevels = () => ["hd1080", "hd720"];
    level = "auto";
    await set("auto-hd", "qualityPref", "small");
    await wait(1600);
    r.observed = level;
    r.pass = level === "auto";
  });
  await trial("auto-hd", "compatibility-fallback", "Invalid or throwing quality APIs leave native playback alone", async (r) => {
    mp.getAvailableQualityLevels = () => { throw Error('unsupported API'); };
    level = "auto";
    await set("auto-hd", "qualityPref", "hd1080");
    v.dispatchEvent(new Event("playing"));
    await wait(50);
    r.observed = level; r.quarantined = YourTube.features.isQuarantined("auto-hd");
    if(r.observed !== "auto" || r.quarantined) throw Error('Unsafe fallback');
    mp.getAvailableQualityLevels = () => ["hd1080", "hd720"];
    r.pass = true;
  });
  await trial("auto-hd", "codec-unavailable", "Legacy codecs stay saved without filtering or claiming an immediate switch", async (r) => {
    YourTube.setCfgMany({videoCodecPref:"av1",audioCodecPref:"opus"});
    await set("auto-hd", "qualityPref", "hd720");
    await wait(50);
    r.streams = response.streamingData.adaptiveFormats.map(x => x.id);
    r.video = YourTube.cfg.videoCodecPref; r.audio = YourTube.cfg.audioCodecPref;
    r.noCodecControl = !pane("auto-hd").querySelector('[data-key="videoCodecPref"],[data-key="audioCodecPref"]');
    r.pass = JSON.stringify(r.streams) === JSON.stringify(available.map(x => x.id)) && r.video === "av1" && r.audio === "opus" && r.noCodecControl;
  });
  await trial("auto-hd", "autoHD", "Off releases range lock", async (r) => {
    await set("auto-hd", "autoHD", false);
    r.range = level;
    r.pass = r.range === "auto";
  });
  await trial("auto-hd", "active-host-range", "Nested video shell, unrelated ad, matching adaptive quality and modern level data", async r => {
    const shell = document.createElement('div'), ad = document.createElement('div');
    shell.className='html5-video-player'; ad.className='ad-showing';
    v.before(shell); shell.append(v); document.body.append(ad);
    const list=mp.getAvailableQualityLevels, setter=mp.setPlaybackQualityRange, legacy=mp.setPlaybackQuality;
    let range='auto'; level='hd720';
    delete mp.getAvailableQualityLevels;
    mp.getAvailableQualityData=()=>[{quality:'hd1080'},{quality:'hd720'}];
    mp.setPlaybackQualityRange=(lo,hi)=>{if(lo===hi)range=lo;};
    try {
      await set('auto-hd','autoHD',true);
      await equal(()=>range,'hd720');
      await set('auto-hd','qualityPref','hd1080');
      await equal(()=>range,'hd1080');
      await equal(()=>level,'hd1080');
      // An accepted request is not evidence that the decoder changed streams.
      mp.setPlaybackQuality=()=>{}; level='small'; v.dispatchEvent(new Event('playing'));
      await equal(()=>pane('auto-hd').textContent.includes('Requested: 1080p · Player reports: 240p'),true);
      await set('auto-hd','autoHD',false);
      await equal(()=>range,'auto'); r.pass=true;
    } finally {
      await set('auto-hd','autoHD',false);
      shell.replaceWith(v);ad.remove();delete mp.getAvailableQualityData;
      mp.getAvailableQualityLevels=list;mp.setPlaybackQualityRange=setter;mp.setPlaybackQuality=legacy;
    }
  });
  const ab = "ab-repeat";
  await trial(
    ab,
    "Set A / Set B / Clear",
    "Set and clear the loop by observing a real 120-second video seek",
    async (r) => {
      await set(ab, "abLoopOn", true);
      const button = (name) => [...pane(ab).querySelectorAll("button")].find((b) => b.textContent === name);
      v.pause();
      v.currentTime = 4;
      r.duration = v.duration;
      r.seekable = v.seekable.length ? v.seekable.end(0) : 0;
      await equal(() => !v.seeking && Math.abs(v.currentTime - 4) < 0.2, true, 1500);
      r.a = v.currentTime;
      button("Set A").click();
      await wait(25);
      v.currentTime = 9;
      await equal(() => !v.seeking && Math.abs(v.currentTime - 9) < 0.2, true, 1500);
      r.b = v.currentTime;
      button("Set B").click();
      await wait(30);
      v.currentTime = 10;
      v.dispatchEvent(new Event("timeupdate"));
      r.loopTo = await equal(() => Math.floor(v.currentTime), 4);
      v.pause();
      button("Clear").click();
      await wait(30);
      v.currentTime = 10;
      v.dispatchEvent(new Event("timeupdate"));
      await wait(150);
      r.afterClear = Math.floor(v.currentTime);
      r.pass = r.afterClear === 10;
    },
  );
  await set(ab, "abLoopOn", false);
  return rows;
};
