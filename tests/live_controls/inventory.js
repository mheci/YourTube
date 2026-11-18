async () => {
  const entries = [];
  function fields(node) {
    return [
      ...node.querySelectorAll("input,select,button,textarea,[role=button],.ytb-preset-card,.ytb-theme-card"),
    ].map((el) => ({
      kind: el.type || el.getAttribute("role") || el.tagName,
      key: el.dataset.key || null,
      element: el.closest("[data-id]")?.dataset.id || null,
      label: (
        el.getAttribute("aria-label") ||
        el.title ||
        el
          .closest(".ytb-elem-row,.ytb-row,.ytb-col,.ytb-corecell")
          ?.querySelector(".ytb-elem-name,.ytb-lbl,.ytb-corelbl")?.textContent ||
        el.textContent ||
        el.placeholder ||
        ""
      )
        .trim()
        .slice(0, 110),
      ...(el.tagName === "SELECT" ? { choices: [...el.options].map((o) => o.value) } : {}),
    }));
  }
  for (const f of YourTube.features.list()) {
    const card = pane(f.id);
    pick(f.id);
    let cb = card.querySelector(".ytb-head input[type=checkbox]");
    const before = cb?.checked;
    if (cb && !before) cb.click();
    await Promise.resolve();
    entries.push({
      id: f.id,
      name: f.name,
      master: f.masterKey || null,
      keys: f.keys || [],
      controls: fields(card),
    });
    if (cb && !before) cb.click();
    await Promise.resolve();
  }
  entries.push({
    id: "core",
    name: "Dashboard preferences and navigation",
    controls: fields(q(".ytb-core")).concat(
      fields(q(".ytb-foot")),
      fields(q(".yj-head-tools")),
      fields(q(".ytb-nav")),
    ),
  });
  return entries;
};
