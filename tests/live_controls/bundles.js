async () => {
  const bundle = "aio-compact-dense",
    theme = "theme-engine";
  scene(
    '<ytd-video-renderer id="nativeCard" style="margin-top:17px;display:block">A regular search result</ytd-video-renderer>',
    "/results?search_query=blender",
  );
  await set(theme, "themeEngineOn", true);
  pane(theme).querySelector('[data-ytb-theme-id]:not([data-ytb-theme-id="none"])').click();
  await wait(220);
  const margin = () => getComputedStyle(q("#nativeCard")).marginTop;
  await trial(
    bundle,
    "themeCompactOn",
    "The member control changes the existing themed card spacing; the non-compact spacing returns",
    async (r) => {
      r.samples = [];
      for (const [input, want] of [
        [false, "17px"],
        [true, "2px"],
        [false, "17px"],
      ]) {
        await set(bundle, "themeCompactOn", input);
        r.samples.push(await equal(margin, want, 1300));
      }
      r.pass = true;
    },
  );
  await trial(
    bundle,
    "aioCompactDenseOn",
    "The bundle restores theme spacing it enabled, but leaves pre-existing compact spacing alone",
    async (r) => {
      r.samples = [];
      for (const [owned, before] of [
        [false, "17px"],
        [true, "2px"],
      ]) {
        await set(bundle, "themeCompactOn", owned);
        const record = { previous: owned, before: await equal(margin, before, 1200) };
        r.samples.push(record);
        await set(bundle, "aioCompactDenseOn", true);
        record.on = await equal(margin, "2px", 1300);
        await set(bundle, "aioCompactDenseOn", false);
        record.off = await equal(margin, before, 1300);
      }
      r.pass = true;
    },
  );
  return rows;
};
