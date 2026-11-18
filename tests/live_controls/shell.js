async () => {
  const features = YourTube.features.list();
  const all = () => q('.ytb-nav-item[data-cat="all"]').click();
  const visibleCards = () =>
    [...document.querySelectorAll(".ytb-card")].filter((n) => !n.hidden && !!n.getClientRects().length);
  all();
  for (const f of features) {
    if (!f.masterKey) continue;
    const label = "Copy setting key: " + f.masterKey;
    await trial(
      f.id,
      label,
      "Mounted button copies the exact named key into the browser clipboard",
      async (r) => {
        pick(f.id);
        const b = pane(f.id).querySelector(".ytb-key");
        if (!b || !b.getClientRects().length) throw Error("no displayed key button");
        await navigator.clipboard.writeText("__empty_trial__");
        b.click();
        r.copied = await equal(() => navigator.clipboard.readText(), f.masterKey, 900);
        r.pass = true;
      },
    );
  }
  all();
  const nav = [...document.querySelectorAll(".ytb-nav-item")];
  for (const b of nav) {
    const id = b.dataset.cat;
    await trial(
      "core",
      b.getAttribute("aria-label"),
      "Sidebar button filters the mounted, visible cards to the correct section",
      async (r) => {
        b.click();
        const live = visibleCards();
        r.title = q(".yj-view-title").textContent;
        r.visibleCards = live.length;
        const want = features.filter((f) => q('[data-feat="' + f.id + '"]').dataset.cat === id);
        r.pass =
          b.getAttribute("aria-current") === "true" &&
          (id === "core"
            ? !q(".ytb-core").hidden && live.length === 0
            : id === "all"
              ? live.length === features.length
              : want.length === live.length && live.every((c) => c.dataset.cat === id));
      },
    );
  }
  await trial(
    "core",
    "Find Session History",
    "Jump link actually shows the session card and filters unrelated cards",
    async (r) => {
      q(".yj-jump").click();
      r.shown = visibleCards().map((n) => n.dataset.feat);
      r.pass = r.shown.includes("session-restore") && r.shown.length < features.length;
    },
  );
  all();
  await trial(
    "core",
    "silentToasts",
    "Two successful clipboard writes; quiet mode suppresses the second notification, turning it off restores them",
    async (r) => {
      r.samples = [];
      for (const [i, value] of [
        [0, false],
        [1, true],
        [2, false],
      ]) {
        all();
        await set("core", "silentToasts", value);
        const f = features.filter((f) => f.masterKey)[i];
        pick(f.id);
        const b = pane(f.id).querySelector(".ytb-key");
        b.click();
        await equal(() => navigator.clipboard.readText(), f.masterKey, 800);
        await wait(60);
        r.samples.push(
          (q("#ytb-toast")?.textContent || "") === "Copied " + f.masterKey &&
            !document.body.classList.contains("ytb-silent"),
        );
      }
      r.pass = JSON.stringify(r.samples) === "[true,false,true]";
    },
  );
  all();
  return rows;
};
