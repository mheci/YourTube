const q = (s) => document.querySelector(s),
  qa = (s) => [...document.querySelectorAll(s)],
  tx = (s) => q(s)?.textContent?.trim() || "",
  sty = (s, k) => (q(s) ? getComputedStyle(q(s)).getPropertyValue(k).trim() : null),
  visible = (s) => !!q(s)?.getClientRects().length,
  nap = (n) => new Promise((r) => setTimeout(r, n)),
  v = () => q("video"),
  mp = () => q("#movie_player"),
  ev = (el, n) => el.dispatchEvent(new Event(n, { bubbles: true }));
const dbop = async (table, method, ...args) => {
  const db = await new Promise((r, j) => {
    const req = indexedDB.open("yourtube_v2");
    req.onsuccess = () => r(req.result);
    req.onerror = () => j(req.error);
  });
  try {
    return await new Promise((r, j) => {
      const tx = db.transaction(
        table,
        ["get", "count", "getAll"].includes(method) ? "readonly" : "readwrite",
      );
      const req = tx.objectStore(table)[method](...args);
      tx.oncomplete = () => r(req.result);
      tx.onerror = () => j(tx.error);
    });
  } finally {
    db.close();
  }
};
const settings = (id) => {
  const node = document.createElement("section");
  node.id = "lab-settings";
  q("#lab-scene").append(node);
  YourTube.features.get(id).settings(node);
  return node;
};
const buttonNamed = (t) => qa("button").find((n) => n.textContent.trim() === t);
const toast = () =>
  qa("#ytb-toasts,.ytb-toast,#ytb-toast,.ytb-ui-toast")
    .map((n) => n.textContent)
    .join(" ")
    .trim();
const box = (s) => q(s)?.getBoundingClientRect().toJSON();
