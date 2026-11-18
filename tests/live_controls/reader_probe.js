async () => {
  const { set, wait, equal } = window.__controlAudit;
  const r = {};
  const q = (s) => document.querySelector(s),
    all = (s) => Array.from(document.querySelectorAll(s));
  const norm = (s) => (s || "").replace(/\s+/g, " ").trim();
  const sample = (n) => ({
    tag: n.tagName.toLowerCase(),
    id: n.id,
    watchMeta: !!n.closest("ytd-watch-metadata"),
    visible: !!n.getClientRects().length,
    text: norm(n.innerText || n.textContent).slice(0, 95),
  });
  await set("reader-mode", "readerModeOn", false);
  r.candidates = all("#description,#description-inline-expander,ytd-text-inline-expander")
    .slice(0, 12)
    .map(sample);
  const proper =
    q("ytd-watch-metadata #description-inline-expander") || q("ytd-watch-metadata ytd-text-inline-expander");
  r.watch = proper ? sample(proper) : null;
  r.source = proper ? norm(proper.innerText || proper.textContent).slice(0, 52) : "";
  await set("reader-mode", "readerModeOn", true);
  await wait(1000);
  const b = q(".ytb-ui-reader-open");
  r.button = b ? { parent: sample(b.parentElement), insideWatch: !!proper?.contains(b) } : null;
  if (b) b.click();
  await wait(200);
  r.panel = norm(q("#ytb-reader")?.innerText).slice(0, 270);
  r.containsNativeWatchText = !!r.source && norm(q("#ytb-reader")?.innerText).includes(r.source);
  await set("reader-mode", "readerModeOn", false);
  await wait(40);
  r.off = q("#ytb-reader") === null && q(".ytb-ui-reader-open") === null;
  r.pass = !!r.button?.insideWatch && r.containsNativeWatchText && r.off;
  return r;
};
