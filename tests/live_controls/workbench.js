() => {
  const q = (s) => document.querySelector(s),
    wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const pane = (id) => (id === "core" ? q(".ytb-core") : q(`[data-feat="${id}"]`));
  const pick = (id) => {
    const box = q(".ytb-search");
    box.value = id === "core" ? "" : id;
    box.dispatchEvent(new Event("input", { bubbles: true }));
  };
  function control(id, key) {
    return pane(id)?.querySelector(`[data-key="${key}"]`);
  }
  async function set(id, key, val) {
    pick(id);
    const n = control(id, key);
    if (!n || !n.isConnected || !n.getClientRects().length)
      throw Error("No mounted & displayed control " + id + "." + key);
    if (n.type === "checkbox") {
      if (n.checked !== val) n.click();
    } else {
      if (n.tagName === "SELECT" && ![...n.options].some((o) => o.value === String(val)))
        throw Error("Not offered: " + key + "=" + val);
      n.value = String(val);
      n.dispatchEvent(new Event("input", { bubbles: true }));
      n.dispatchEvent(new Event("change", { bubbles: true }));
    }
    // A microtask gives the settings transaction its opportunity. No forced lifecycle call.
    await Promise.resolve();
    return n;
  }
  function scene(markup, path = "/watch?v=LabVideo001") {
    history.replaceState({}, "", path);
    q("#stage").innerHTML = markup;
  }
  const style = (s, p) => (q(s) ? getComputedStyle(q(s)).getPropertyValue(p).trim() : null);
  const rows = [];
  async function trial(id, key, description, fn) {
    const row = { id, key, description };
    try {
      await fn(row);
      if (row.pass !== true) throw Error("Unexpected measurement");
    } catch (e) {
      row.error = String(e);
      row.pass = false;
    }
    rows.push(row);
    return row;
  }
  async function equal(read, want, ms = 650) {
    let v;
    const start = performance.now();
    do {
      v = await read();
      if (JSON.stringify(v) === JSON.stringify(want)) return v;
      await wait(12);
    } while (performance.now() - start < ms);
    throw Error("Expected " + JSON.stringify(want) + "; observed " + JSON.stringify(v));
  }
  async function paired(id, key, description, a, b, read, wantA, wantB, stim = null, ms = 650) {
    return trial(id, key, description, async (row) => {
      row.samples = [];
      for (const [value, want] of [
        [a, wantA],
        [b, wantB],
        [a, wantA],
      ]) {
        const t = performance.now();
        await set(id, key, value);
        if (stim) await stim(value);
        const valueSeen = await equal(read, want, ms);
        row.samples.push({ input: value, observed: valueSeen, elapsedMs: Math.round(performance.now() - t) });
      }
      row.pass = true;
    });
  }
  Object.assign(window, { q, wait, pane, pick, control, set, scene, style, rows, trial, equal, paired });
};
