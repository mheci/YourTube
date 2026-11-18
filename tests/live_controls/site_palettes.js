async () => {
  const { set, pane, equal, wait } = window.__controlAudit;
  const id = "theme-engine",
    root = pane(id),
    app = document.querySelector("ytd-app"),
    mast = document.querySelector("ytd-masthead");
  if (!app || !mast) return { status: "Native app/masthead missing", rows: [] };
  const rgb = (hex) => {
    let h = hex.replace("#", "");
    if (h.length === 3) h = h.replace(/(.)/g, "$1$1");
    return "rgb(" + [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ") + ")";
  };
  const paint = () => [app, mast].map((n) => getComputedStyle(n).backgroundColor);
  const nativeDark = () => document.documentElement.hasAttribute("dark");
  await set(id, "themeEngineOn", false);
  await wait(100);
  const baseline = paint(),
    darkBefore = nativeDark(),
    rows = [];
  await set(id, "themeEngineOn", true);
  for (const key of ["themeOverhaulOn", "themeGlassOverhaulOn"]) await set(id, key, false);
  const reset = root.querySelector('[data-ytb-theme-id="none"]');
  reset.click();
  await wait(350);
  for (const [theme, label, mode, vars] of window.__expectedPalette) {
    if (theme === "none") continue;
    const tile = root.querySelector('[data-ytb-theme-id="' + theme + '"]'),
      rec = { id: "theme-engine", key: theme, name: label };
    try {
      if (!tile?.isConnected || !tile.getClientRects().length) throw Error("no displayed tile");
      if (!reset.classList.contains("active")) {
        reset.click();
        await wait(65);
      }
      const expected = rgb(vars[0]),
        t = performance.now();
      tile.click();
      rec.on = await equal(paint, [expected, expected], 1500);
      rec.ms = Math.round(performance.now() - t);
      if (nativeDark() !== (mode === "dark")) throw Error("native light/dark mismatch");
      // Tapping the same swatch again is the documented per-theme undo.
      tile.click();
      rec.off = await equal(paint, baseline, 700);
      rec.pass = nativeDark() === darkBefore && app.isConnected && mast.isConnected;
    } catch (error) {
      rec.pass = false;
      rec.error = String(error);
      reset.click();
      await wait(20);
    }
    rows.push(rec);
  }
  const result = { baseline, rows };
  const generator = root.querySelector(".ytb-gen-row"),
    picker = generator?.querySelector("input[type=color]"),
    button = generator?.querySelector("button");
  if (picker && button) {
    const rec = { id, key: "Generate theme", before: paint() };
    try {
      picker.value = "#5577b2";
      picker.dispatchEvent(new Event("input", { bubbles: true }));
      button.click();
      await wait(120);
      rec.on = paint();
      reset.click();
      rec.off = await equal(paint, baseline, 1300);
      rec.pass = rec.on[0] !== baseline[0] && rec.on[1] !== baseline[1];
    } catch (e) {
      rec.pass = false;
      rec.error = String(e);
    }
    result.generated = rec;
  }
  await set(id, "themeEngineOn", false);
  result.afterMasterOff = paint();
  result.sameNativeNodes = app.isConnected && mast.isConnected;
  return result;
};
