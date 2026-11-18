async () => {
  pick("elements-control");
  await set("elements-control", "elementsControlOn", true);
  await wait(100);
  const scope = q("#target");
  function split(s, re) {
    let parts = [],
      token = "",
      p = 0,
      b = 0,
      q = "";
    for (const c of s) {
      if (!q && !p && !b && re.test(c)) {
        if (token) parts.push(token);
        token = "";
        continue;
      }
      token += c;
      if (q) {
        if (c === q) q = "";
        continue;
      }
      if (c === '"' || c === "'") q = c;
      else if (c === "(") p++;
      else if (c === ")") p--;
      else if (c === "[") b++;
      else if (c === "]") b--;
    }
    if (token) parts.push(token);
    return parts.map((v) => v.trim()).filter(Boolean);
  }
  function put(node, s) {
    const parts = split(s, /[\s>]/);
    let end = node;
    for (let l of parts) {
      l = l.replace(/:not\(:has\([^)]*\)\)|:not\([^)]*\)/g, "");
      let extra = null;
      l = l.replace(/:has\(([^()]*)\)/, (a, b) => {
        extra = b;
        return "";
      });
      let n = 1;
      l = l
        .replace(/:nth-(?:child|of-type)\((\d+)\)/, (a, num) => {
          n = +num;
          return "";
        })
        .replace(/:(?:first|last)-(?:child|of-type)/g, "");
      const attrs = [];
      l = l.replace(/\[([^\]]+)\]/g, (a, kv) => {
        const m = /^([\w:-]+)(?:[~*|^$]?=\s*['"]?(.*?)['"]?)?$/.exec(kv);
        if (!m) throw Error("attribute: " + kv);
        attrs.push([m[1], m[2] || ""]);
        return "";
      });
      const tag = l.match(/^[\w-]+/)?.[0] || "div",
        e = document.createElement(tag);
      for (let i = 1; i < n; i++) end.append(document.createElement(tag));
      for (const [k, v] of attrs) e.setAttribute(k, v);
      for (const m of l.matchAll(/([.#])([\w-]+)/g)) {
        if (m[1] === ".") e.classList.add(m[2]);
        else e.id = m[2];
      }
      end.append(e);
      end = e;
      if (extra) put(e, extra);
    }
    return end;
  }

  for (const { id, selector, name } of targets) {
    const cb = pane("elements-control").querySelector('[data-id="' + id + '"] input');
    for (const branch of split(selector, /,/))
      await trial("elements-control", id, name, async (row) => {
        row.selector = branch;
        scope.replaceChildren();
        if (!cb || !cb.isConnected || cb.checked) throw Error("Control missing or not initially clear");
        const n = put(scope, branch);
        n.style.display = "inline-block";
        if (!n.matches(branch)) throw Error("Witness does not match");
        row.before = getComputedStyle(n).display;
        try {
          cb.click();
          row.on = await equal(() => getComputedStyle(n).display, "none");
        } finally {
          if (cb.checked) cb.click();
        }
        row.restored = await equal(() => getComputedStyle(n).display, row.before);
        row.pass = row.before !== "none";
      });
  }
  return rows;
};
