  const JOURNAL_CATEGORIES = Object.freeze({
    playback: "Playback & Player",
    audio: "Audio",
    feed: "Feed & Search",
    comments: "Comments & Chat",
    appearance: "Appearance",
    channels: "Channels & Playlists",
    data: "Data & Notes",
    privacy: "Privacy",
    integrations: "Integrations",
    insights: "Discovery & Insights",
    wellness: "Watch-Time",
    bundles: "Bundles",
    tools: "Tools & Diagnostics",
  });
  function journalIcon(name) {
    const paths = {
      search: "M7 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10m4-1 4 4",
      close: "m4 4 8 8m0-8-8 8",
      dock: "M2 3h12v10H2zM9 3v10",
      arrow: "M3 8h9m-4-4 4 4-4 4",
    };
    const ns = "http://www.w3.org/2000/svg",
      svg = document.createElementNS(ns, "svg"),
      path = document.createElementNS(ns, "path");
    svg.setAttribute("class", "yj-icon");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("aria-hidden", "true");
    path.setAttribute("d", paths[name]);
    svg.appendChild(path);
    return svg;
  }
  function journalStyle() {
    if (document.getElementById("ytb-dash-style")) return;
    const css = YT_FEATURE_SURFACES + "\n" + JOURNAL_DASHBOARD_CSS;
    let node;
    try {
      if (typeof GM_addStyle === "function") {
        node = GM_addStyle(css);
        if (!node?.setAttribute) {
          node = document.createElement("meta");
          document.head.appendChild(node);
        }
      }
    } catch (_) {}
    if (!node) {
      node = document.createElement("style");
      node.textContent = css;
      (document.head || document.documentElement).appendChild(node);
    }
    node.id = "ytb-dash-style";
  }
  function journalWindow(shell, handle) {
    function geometry() {
      const b = shell.getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    }
    function pointerSurface(el, mode) {
      let start = null;
      const finish = (ev) => {
        if (!start || ev.pointerId !== start.id) return;
        start = null;
        shell.classList.remove("resizing", "dragging");
        const r = geometry();
        jo(r.x, r.y, r.w, r.h);
      };
      el.addEventListener("pointerdown", (ev) => {
        if (
          start ||
          ev.button !== 0 ||
          (mode === "drag" && ev.target.closest("button,input,select,textarea,a"))
        )
          return;
        start = { ...geometry(), px: ev.clientX, py: ev.clientY, id: ev.pointerId };
        try {
          el.setPointerCapture(ev.pointerId);
        } catch (_) {
          start = null;
          return;
        }
        shell.classList.add(mode === "drag" ? "dragging" : "resizing");
        ev.preventDefault();
      });
      el.addEventListener("pointermove", (ev) => {
        if (!start || ev.pointerId !== start.id || wo !== shell) return;
        const dx = ev.clientX - start.px,
          dy = ev.clientY - start.py;
        zo(
          mode === "drag"
            ? Yp_clampRect(start.x + dx, start.y + dy, start.w, start.h)
            : Yp_clampRect(
                start.x,
                start.y,
                Math.min(start.w + dx, innerWidth - start.x - 8),
                Math.min(start.h + dy, innerHeight - start.y - 8),
              ),
        );
      });
      for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
        el.addEventListener(type, finish);
    }
    const grip = To("div", "ytb-dresize");
    grip.title = "Drag to resize";
    shell.appendChild(grip);
    pointerSurface(handle, "drag");
    pointerSurface(grip, "resize");
    const w = S.dashW > 0 ? S.dashW : Math.min(900, innerWidth - 32),
      h = S.dashH > 0 ? S.dashH : Math.min(750, innerHeight - 72);
    zo(
      Yp_clampRect(
        S.dashX >= 0 ? S.dashX : innerWidth - w - 16,
        S.dashY >= 0 ? S.dashY : Math.min(56, Math.max(8, (innerHeight - h) / 2)),
        w,
        h,
      ),
    );
    const narrow = () => shell.classList.toggle("ytb-narrow", shell.offsetWidth < 650);
    narrow();
    if (typeof ResizeObserver === "function") {
      const ro = new ResizeObserver(narrow);
      ro.observe(shell);
      Co.push(() => ro.disconnect());
    }
    const fit = () => {
      Wo();
      narrow();
    };
    window.addEventListener("resize", fit, { passive: true });
    Co.push(() => window.removeEventListener("resize", fit));
  }
  let journalOpener = null;
  function Uo() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", Uo, { once: true });
      return;
    }
    if (wo) return;
    journalOpener = document.activeElement;
    const shell = To("aside", "ytb-dash");
    wo = shell;
    try {
      journalStyle();
      mountJournalDashboard(shell);
    } catch (error) {
      Ko();
      m("dashboard build", error);
      pe("Could not open the settings journal.", 4000, "error");
    }
  }
  function mountJournalDashboard(shell) {
    const el = (parent, tag, cls, text) => {
      const child = To(tag, cls, text);
      parent.appendChild(child);
      return child;
    };
    const button = (parent, cls, label, fn, icon) => {
      const b = el(parent, "button", cls, icon ? null : label);
      b.type = "button";
      if (icon) {
        b.appendChild(journalIcon(icon));
        b.setAttribute("aria-label", label);
        b.title = label;
      }
      b.addEventListener("click", fn);
      return b;
    };
    shell.dataset.skin = "journal";
    shell.lang = "en";
    shell.dir = "ltr";
    shell.setAttribute("role", "dialog");
    shell.setAttribute("aria-label", "YourTube dashboard");
    shell.tabIndex = -1;
    const header = el(shell, "header", "ytb-dhdr ytb-dhandle"),
      heading = el(header, "div", "yj-heading");
    const brand = el(heading, "div", "yj-brand");
    el(brand, "span", "yj-mark").setAttribute("aria-hidden", "true");
    el(brand, "span", "", "YourTube");
    el(brand, "span", "yj-brand-sep", "/");
    el(brand, "span", "", "Local settings");
    el(heading, "h1", "ytb-dtitle", "Settings");
    const tools = el(header, "div", "yj-head-tools");
    el(tools, "span", "ytb-dver", "v" + n);
    button(
      tools,
      "yj-icon-btn",
      "Dock to top-right",
      () => {
        const w = Math.min(innerWidth - 16, 900),
          h = Math.min(innerHeight - 32, 750);
        const r = Yp_clampRect(innerWidth - w - 16, 32, w, h);
        zo(r);
        jo(r.x, r.y, r.w, r.h);
      },
      "dock",
    );
    button(tools, "yj-icon-btn", "Close dashboard", Ko, "close");
    const main = el(shell, "div", "ytb-main"),
      nav = el(main, "nav", "ytb-nav");
    nav.setAttribute("aria-label", "Feature categories");
    el(nav, "span", "yj-kicker", "Contents");
    const mobile = el(nav, "label", "yj-mobile-nav");
    el(mobile, "span", "yj-kicker", "Contents");
    const picker = el(mobile, "select", "yj-cat-picker");
    picker.setAttribute("aria-label", "Feature category");
    const space = el(main, "div", "yj-workspace"),
      bar = el(space, "div", "yj-searchbar");
    bar.appendChild(journalIcon("search"));
    const input = el(bar, "input", "ytb-search");
    input.type = "search";
    input.placeholder = "Search features or settings";
    input.setAttribute("aria-label", input.placeholder);
    const shortcut = el(bar, "kbd", "yj-shortcut", "/");
    shortcut.setAttribute("aria-hidden", "true");
    const clear = button(bar, "yj-clear", "Clear search", () => setQuery(""), "close");
    const body = el(space, "div", "ytb-body"),
      view = el(body, "div", "yj-view-head"),
      words = el(view, "div", "");
    const eyebrow = el(words, "div", "yj-kicker");
    const title = el(words, "h2", "yj-view-title");
    const info = el(view, "div", "yj-meta");
    info.setAttribute("role", "status");
    const core = el(body, "div", "ytb-core");
    const row = (name, control) => {
      const d = el(core, "div", "ytb-corecell");
      el(d, "span", "ytb-corelbl", name);
      (control.matches("input,select") ? control : control.querySelector("input"))?.setAttribute(
        "aria-label",
        name,
      );
      d.appendChild(control);
    };
    row(
      "Experience preset",
      Po("privacyPreset", {
        everyday: "Everyday",
        stealth: "Stealth (no traffic monitoring)",
        maximum: "Maximum (no monitoring, no network calls)",
      }),
    );
    row("Quiet on-screen messages", Bo("silentToasts"));
    const registry = [...va.values()].sort((a, b) =>
      (a.name || a.id).localeCompare(b.name || b.id, undefined, { sensitivity: "base" }),
    );
    const catOf = (c) => (Object.hasOwn(JOURNAL_CATEGORIES, c.cat) ? c.cat : "tools");
    const enabled = (c) => {
      try {
        if (typeof c.isOn === "function") return !!c.isOn();
        const v = S[c.masterKey];
        return typeof v === "string" ? !!v && v !== "off" : !!v;
      } catch (_) {
        return false;
      }
    };
    const labels = { all: "All features", core: "Quick settings", ...JOURNAL_CATEGORIES };
    const sections = new Map(),
      buttons = new Map(),
      mounted = new Map();
    const text = new Map(
      registry.map((c) => [
        c.id,
        [c.name, c.summary, c.id, c.masterKey, ...(c.keys || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      ]),
    );
    for (const [cat, name] of Object.entries(JOURNAL_CATEGORIES)) {
      const page = el(body, "section", "ytb-cat-page");
      page.dataset.cat = cat;
      page.setAttribute("aria-label", name);
      const label = el(page, "div", "yj-section-tag", name);
      sections.set(cat, { page, label });
    }
    let category = Object.hasOwn(labels, S.dashCat) ? S.dashCat : "all",
      frame = 0;
    function setCat(id) {
      if (!Object.hasOwn(labels, id)) return;
      category = id;
      input.value = "";
      body.scrollTop = 0;
      Ta("dashCat", id);
      paint();
    }
    function setQuery(q) {
      input.value = q;
      body.scrollTop = 0;
      paint();
      input.focus({ preventScroll: true });
    }
    for (const [id, label] of Object.entries(labels)) {
      if (id === "playback") el(nav, "div", "ytb-nav-sep");
      const btn = button(nav, "ytb-nav-item", label, () => setCat(id));
      btn.textContent = "";
      btn.dataset.cat = id;
      el(btn, "span", "ytb-nav-label", label);
      const count = el(btn, "span", "ytb-nav-count");
      count.setAttribute("aria-hidden", "true");
      buttons.set(id, { btn, count });
      const option = el(picker, "option", "", label);
      option.value = id;
    }
    const searchOption = el(picker, "option", "", "Search results");
    searchOption.value = "__search";
    searchOption.disabled = true;
    picker.addEventListener("change", () => setCat(picker.value));
    const end = el(nav, "div", "yj-nav-end");
    const jump = button(end, "yj-jump", "Watch journal", () => setQuery("Session History"));
    jump.appendChild(journalIcon("arrow"));
    jump.title = "Find Session History";
    const empty = el(body, "div", "yj-empty");
    el(empty, "h3", "yj-empty-title", "No matches");
    el(empty, "p", "", "Try another feature name or setting key.");
    button(empty, "ytb-btn", "Clear filter", () => setQuery(""));
    function paint() {
      if (wo !== shell) return;
      const q = input.value.trim().toLowerCase(),
        complete = mounted.size === registry.length;
      const total = {},
        active = {},
        shown = {};
      let matched = 0,
        on = 0,
        shownOn = 0;
      for (const c of registry) {
        const cat = catOf(c),
          live = enabled(c);
        total[cat] = (total[cat] || 0) + 1;
        active[cat] = (active[cat] || 0) + Number(live);
        on += Number(live);
        const hit = q ? text.get(c.id).includes(q) : category === "all" || category === cat;
        const dom = mounted.get(c.id);
        if (dom) {
          dom.hidden = !hit;
          dom.classList.toggle("on", live);
        }
        if (hit) {
          shown[cat] = (shown[cat] || 0) + 1;
          matched++;
          shownOn += Number(live);
        }
      }
      for (const [cat, { page, label }] of sections) {
        page.hidden = !shown[cat];
        label.hidden = !q && category !== "all";
      }
      for (const [id, { btn, count }] of buttons) {
        const current = !q && id === category;
        btn.classList.toggle("active", current);
        if (current) btn.setAttribute("aria-current", "true");
        else btn.removeAttribute("aria-current");
        const denom = id === "all" ? registry.length : total[id] || 0,
          numer = id === "all" ? on : active[id] || 0;
        count.textContent = id === "core" ? "02" : String(denom).padStart(2, "0");
        btn.title = id === "core" ? "Two general preferences" : `${numer} of ${denom} enabled`;
        btn.setAttribute("aria-label", labels[id] + ", " + btn.title);
      }
      searchOption.hidden = !q;
      picker.value = q ? "__search" : category;
      const inCore = !q && category === "core";
      core.hidden = !!q || (!inCore && category !== "all");
      empty.hidden = !q || matched !== 0 || !complete;
      clear.hidden = !input.value;
      shortcut.hidden = !!input.value;
      eyebrow.textContent = q
        ? "Search / All sections"
        : category === "all"
          ? "Feature directory"
          : inCore
            ? "Browser preferences"
            : "Section " +
              String(Object.keys(JOURNAL_CATEGORIES).indexOf(category) + 1).padStart(2, "0") +
              " / " +
              sections.size;
      title.textContent = q ? "Search results" : labels[category];
      const summary = inCore
        ? "2 preferences"
        : q
          ? matched + " " + (matched === 1 ? "match" : "matches")
          : matched + " features · " + shownOn + " enabled";
      if (info.textContent !== summary) info.textContent = summary;
    }
    function queuePaint() {
      if (!frame && wo === shell)
        frame = requestAnimationFrame(() => {
          frame = 0;
          paint();
        });
    }
    Co.push(() => cancelAnimationFrame(frame));
    So("cfg.changed", (event) => {
      if (event.key === "dashCat" && Object.hasOwn(labels, S.dashCat)) category = S.dashCat;
      queuePaint();
    });
    input.addEventListener("input", () => {
      body.scrollTop = 0;
      paint();
    });
    function mountCard(c) {
      const card = Do(c);
      card.dataset.cat = catOf(c);
      const head = card.querySelector(".ytb-head");
      if (c.masterKey && head) {
        const key = button(head, "ytb-key", c.masterKey, async () => {
          try {
            await navigator.clipboard.writeText(c.masterKey);
            pe("Copied " + c.masterKey, 1200, "info");
          } catch (_) {
            pe(c.masterKey, 1700, "info");
          }
        });
        key.title = "Copy setting key: " + c.masterKey;
        key.setAttribute("aria-label", key.title);
        head.insertBefore(key, head.children[1] || null);
      }
      sections.get(catOf(c)).page.appendChild(card);
      mounted.set(c.id, card);
    }
    const first = Math.min(24, registry.length);
    for (let i = 0; i < first; i++) mountCard(registry[i]);
    paint();
    (async () => {
      for (let i = first; i < registry.length; i += 12) {
        await ne();
        if (wo !== shell) return;
        for (const c of registry.slice(i, i + 12)) mountCard(c);
        paint();
      }
    })().catch((error) => m("dashboard card batch", error));
    const foot = el(shell, "footer", "ytb-foot");
    foot.append(
      Oo("Export settings", Go),
      Oo("Import settings", Xo),
      Oo("Mark this video watched", Ut, "primary"),
      Oo(
        "Reset to defaults",
        () => {
          if (
            !window.confirm(
              "Reset all toggles and values to defaults? Local notes and history are kept.",
            )
          )
            return;
          const old = { ...S };
          S = { ...s };
          Y();
          ue();
          xa.applyAll();
          for (const k of Object.keys(S))
            if (old[k] !== S[k]) g.emit("cfg.changed", { key: k, val: S[k] });
          category = "all";
          setQuery("");
          pe("Settings reset to defaults.", 2000, "success");
        },
        "ytb-danger",
      ),
    );
    const guided = mountGuidedSetup({shell, main, foot, el, button, setQuery, setCat});
    const moveToTopLayer = () => {
      const host = document.fullscreenElement || document.body;
      if (shell.parentNode !== host) host.appendChild(shell);
    };
    moveToTopLayer();
    document.addEventListener("fullscreenchange", moveToTopLayer);
    Co.push(() => document.removeEventListener("fullscreenchange", moveToTopLayer));
    journalWindow(shell, header);
    const keys = (ev) => {
      if (wo !== shell || ev.defaultPrevented || ev.isComposing) return;
      const target = ev.composedPath()[0];
      const editing = target?.matches?.("input:not([type=checkbox]):not([type=radio]),textarea,select") || target?.isContentEditable;
      if (ev.key === "Escape") {
        if (target === input && input.value) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          setQuery("");
        } else if (!editing || target === input) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          Ko();
        }
      } else if (
        !guided.visible() && ev.key === "/" &&
        !editing &&
        !ev.ctrlKey &&
        !ev.metaKey &&
        !ev.altKey &&
        shell.contains(ev.target)
      ) {
        ev.preventDefault();
        ev.stopPropagation();
        input.focus();
      }
    };
    shell.addEventListener("keydown", keys);
    shell.classList.add("open");
    (matchMedia("(pointer:coarse)").matches ? shell : input).focus({ preventScroll: true });
    const dismissDrawer = () => {
      if (wo !== shell) return;
      const drawer = document.querySelector("tp-yt-app-drawer#guide[opened]:not([persistent])");
      if (drawer) document.querySelector("#guide-button")?.click();
    };
    const raf = requestAnimationFrame(dismissDrawer),
      later = setTimeout(dismissDrawer, 350);
    Co.push(() => {
      cancelAnimationFrame(raf);
      clearTimeout(later);
    });
  }
  function Ko() {
    if (!wo) return;
    const closing = wo,
      restore = closing.contains(document.activeElement),
      opener = journalOpener;
    wo = null;
    journalOpener = null;
    for (const cleanup of Co.splice(0).reverse())
      try {
        cleanup();
      } catch (_) {}
    closing.remove();
    if (restore && opener?.isConnected && typeof opener.focus === "function")
      try {
        opener.focus({ preventScroll: true });
      } catch (_) {}
  }
  function Yo() {
    try {
      wo ? Ko() : Uo();
    } catch (err) {
      try { m("dashboard toggle", err); } catch (_) {}
      try { console.error("[YourTube] dashboard toggle failed:", err); } catch (_) {}
      pe("Dashboard failed: " + (err && err.message ? err.message : err) + " — please report this message", 6000, "error");
    }
  }
  async function Go() {
    const e = {
        version: n,
        ts: Date.now(),
        cfg: S,
        history: await Ie(),
      },
      raw = JSON.stringify(e, null, 2),
      body =
        typeof LZString !== "undefined" && LZString.compressToBase64
          ? "ytz1:" + LZString.compressToBase64(raw)
          : raw,
      t = new Blob([body], { type: "application/json" }),
      a = URL.createObjectURL(t),
      r = document.createElement("a");
    ((r.href = a),
      (r.download =
        "yourtube-settings-" + new Date().toISOString().slice(0, 10) + ".json"),
      document.body.appendChild(r),
      r.click(),
      r.remove(),
      setTimeout(() => URL.revokeObjectURL(a), 6e3),
      pe("Settings saved." + ("ytz1:" === body.slice(0, 5) ? " (lz-string)" : ""), 1800, "success"));
  }
  function Xo() {
    const e = document.createElement("input");
    ((e.type = "file"),
      (e.accept = ".json,application/json"),
      e.addEventListener(
        "change",
        () => {
          const t = e.files && e.files[0];
          if (!t) return;
          const a = new FileReader();
          ((a.onload = async (e) => {
            try {
              const text = String(e.target.result || "");
              if (text.length > 4194304) throw new Error("import too large");
              let jsonText = text;
              if (
                text.slice(0, 5) === "ytz1:" &&
                typeof LZString !== "undefined" &&
                LZString.decompressFromBase64
              ) {
                const dec = LZString.decompressFromBase64(text.slice(5));
                if (dec && dec.length > 16777216) throw new Error("import expands too far");
                if (dec) jsonText = dec;
              }
              const t = JSON.parse(jsonText),
                a = Object.assign({}, S);
              if (!t || "object" != typeof t || Array.isArray(t) || !t.cfg || "object" != typeof t.cfg || Array.isArray(t.cfg)) {
                throw new Error("invalid settings file");
              }
              (t.cfg && j(D(t.cfg)),

                Array.isArray(t.history) &&

                  (t.history = t.history.slice(-5000)),
                  Array.isArray(t.history) &&
                  (await (async () => {
                    // Chunked writes: Promise.all on up to 5000 records opened
                    // thousands of IDB transactions at once and froze the tab on
                    // large imports (plan F9). Batches of 200, sequentially.
                    const rows = t.history.filter(
                      (e) =>
                        e &&
                        "object" == typeof e &&
                        "string" == typeof e.videoId &&
                        e.videoId,
                    );
                    for (let i = 0; i < rows.length; i += 200) {
                      await Promise.all(
                        rows.slice(i, i + 200).map((e) => Be(_ytSanitizeHistoryRow(e))),
                      );
                    }
                  })()),
                Y(),
                ue(),
                xa.applyAll());
              for (const e of Object.keys(S))
                a[e] !== S[e] && g.emit("cfg.changed", { key: e, val: S[e] });
              pe("Settings loaded.", 1800, "success");
            } catch (e) {
              pe("Couldn’t read that file.", 1800, "error");
            }
          }),
            a.readAsText(t));
        },
        { once: !0 },
      ),
      e.click());
  }
  function Jo(e) {
    if (!e.code) return "";
    if (
      [
        "ShiftLeft",
        "ShiftRight",
        "ControlLeft",
        "ControlRight",
        "AltLeft",
        "AltRight",
        "MetaLeft",
        "MetaRight",
      ].includes(e.code)
    )
      return "";
    const t = [];
    return (
      e.ctrlKey && t.push("Ctrl"),
      e.shiftKey && t.push("Shift"),
      e.altKey && t.push("Alt"),
      e.metaKey && t.push("Meta"),
      t.push(e.code),
      t.join("+")
    );
  }
  function ei(e, t) {
    return !!t && Jo(e) === t;
  }
  const ti = {
    version: n,
    cfg: new Proxy(
      {},
      { get: (e, t) => S[t], set: (e, t, a) => (Ta(t, a), !0) },
    ),
    setCfg: Ta,
    setCfgMany: Oa,
    features: xa,
    bus: g,
    openDashboard: Uo,
    closeDashboard: Ko,
    toggleDashboard: Yo,

    actions: null,
    palette: null,
    cheat: null,
    flushCfg: G,
    history: $e,
    forceWatched: Ut,
    silent: { apply: ue },
    storage: {
      get: (e) => v("kv", e).then((e) => (e ? e.v : void 0)),
      set: (e, t) => k("kv", { k: e, v: t, updatedAt: Date.now() }),
      export: Go,
      import: Xo,
    },
    sb: {
      reload: () => {
        const e = ie.videoId();
        if (e) return St(e);
      },
      stats: () => SponsorBlockEngine.stats(),
      categories: i,
      options: Yi,
      segments: () => SponsorBlockEngine.getSegments(),
      debugInject: (segs) => SponsorBlockEngine.debugInjectSegments(segs),
      isChannelWhitelisted: () => SponsorBlockEngine.isCurrentChannelWhitelisted(),
      channelToken: () => SponsorBlockEngine.channelToken(),
      debugActions: () => SponsorBlockEngine.debugActions(),
      debugChipCalc: () => SponsorBlockEngine.debugChipCalc ? SponsorBlockEngine.debugChipCalc() : null,
      debugTick: () => SponsorBlockEngine.debugTickInfo(),
      setCategoryAction: (catId, action) => {
        if (catId in Yi) {
          Ta("sb_" + catId + "_act", action);
        }
      },
      setCategoryEnabled: (catId, enabled) => {
        Ta("sb_" + catId + "_en", !!enabled);
      }
    },
    net: {
      summary: (e) => dr(e || "all"),
      series: (e, t) => pr(e || "day", t || 60),
      session: () => Object.assign({}, Gn),
      raw: () => nr(),
      flush: () => er(),
      clear: () => rr(),
      fmt: or,
    },

    perf: {
      enableFps: (e) => Ta("fpsCounterOn", !!e),
      enableBuffer: (e) => Ta("bufferHealthOn", !!e),
      enableLongTask: (e) => Ta("longTaskWarnerOn", !!e),
      setLongTaskThreshold: (e) =>
        Ta(
          "longTaskWarnerThreshold",
          Math.max(20, Math.min(1000, Number(e) || 50)),
        ),
      enableDroppedFrames: (e) => Ta("droppedFrameOn", !!e),
      enableVideoStats: (e) => Ta("videoStatsOn", !!e),
      getDroppedFrames: () => {
        const v = ie && ie.el && ie.el();
        if (!v || typeof v.getVideoPlaybackQuality !== "function") return 0;
        try {
          return v.getVideoPlaybackQuality().droppedVideoFrames || 0;
        } catch (e) {
          return 0;
        }
      },
    },
    diagnostics: {
      snapshot: async () => ({
        version: n,
        url: location.href,
        ts: Date.now(),
        cfg: Object.assign({}, S),
        features: xa.list().map((e) => ({
          id: e.id,
          on:
            "function" == typeof e.isOn
              ? !!e.isOn()
              : "string" == typeof S[e.masterKey]
                ? S[e.masterKey] && "off" !== S[e.masterKey]
                : !!S[e.masterKey],
        })),
        sbStats: SponsorBlockEngine.stats(),
        logs: y().slice(-100),
      }),
    },

    memory: {
      snapshot: () => _mp.snapshot(),
      audit: () => _mp.audit(),
      gc: () => _mp.runMaintenance(),
      runMaintenance: () => _mp.runMaintenance(),

      softCleanup: () => _mp._internal.softCleanup(),
      registerCache: (name, map, cap, onEvict) =>
        _mp.registerCache(name, map, cap, onEvict),

      setTimeout: (fn, ms, owner) => _mp.safeSetTimeout(fn, ms, owner),
      setInterval: (fn, ms, owner) => _mp.safeSetInterval(fn, ms, owner),
      observer: (kind, factory, owner) =>
        _mp.safeObserver(kind, factory, owner),
      listener: (target, event, fn, opts, owner) =>
        _mp.safeListener(target, event, fn, opts, owner),
      blobURL: (blob, owner) => _mp.safeBlobURL(blob, owner),
      element: (el, owner) => _mp.safeElement(el, owner),
      wrap: (fn, owner) => _mp.safeWrap(fn, owner),

      releaseKind: (kind) => {
        const before = _mp.snapshot().live;
        _mp.releaseKind(kind);
        return before - _mp.snapshot().live;
      },

      disposeAll: () => _mp.disposeAll(),
    },
  };

  try {
    Object.defineProperty(e, "YourTube", {
      value: ti,
      configurable: !1,
      writable: !1,
    });
  } catch (e) {
    try {
      h("YourTube property already exists, skipping", e && e.message);
    } catch (e) {}
  }
  try {
    window.addEventListener(
      "unhandledrejection",
      (e) => {
        const t = e && e.reason,
          a = (t && (t.message || String(t))) || "",
          n = (t && t.stack) || "";
        if (
          "string" == typeof a &&
          (/YT\+|yourtube|ytp-|ytdef/i.test(a) || /yourtube|ytp-|ytdef/i.test(n))
        ) {
          try {
            h("[YourTube] rejection caught:", a.slice(0, 300));
          } catch (e) {}
          try {
            e.preventDefault();
          } catch (e) {}
        }
      },
      { passive: !1 },
    );
  } catch (e) {}
  try {
    window.addEventListener(
      "error",
      (e) => {
        const t = (e && e.error && e.error.stack) || "";
        if (t && /yourtube|ytp-|ytdef|YT\+/i.test(t)) {
          try {
            h("[YourTube] error caught:", (e.message || "").slice(0, 300));
          } catch (e) {}
          try {
            e.preventDefault();
          } catch (e) {}
        }
      },
      { passive: !1 },
    );
  } catch (e) {}

  function _ytbPausedDialogConfirmBtn() {
    try {
      const vid =
        document.querySelector("video.html5-main-video") ||
        document.querySelector("video");
      let paused = true;
      try {
        paused = !vid || vid.paused;
      } catch (err) {
        paused = true;
      }
      if (!paused) return null; 
      const dialogs = document.querySelectorAll(
        "yt-confirm-dialog-renderer, tp-yt-paper-dialog.yt-confirm-dialog-renderer, ytd-popup-container tp-yt-paper-dialog",
      );
      for (let i = 0; i < dialogs.length; i++) {
        const d = dialogs[i];
        let txt = "";
        try {
          txt = (d.textContent || "").toLowerCase();
        } catch (err) {}
        if (!txt) continue;
        const looksPaused =
          /(continue watching|keep watching|still watching|video (is )?paused|\bpaused\b|resume|seguir viendo|continuer (la )?lecture|weiter ansehen)/.test(
            txt,
          );
        const looksDestructive =
          /(clear|delete|remove|erase|sign ?out|log ?out|turn off|discard|unsubscribe|\bage\b|restrict|confirm (that|to)|are you sure|irreversible|permanent|deactivate)/.test(
            txt,
          );
        if (!looksPaused || looksDestructive) continue;
        const btn =
          d.querySelector("#confirm-button button") ||
          d.querySelector("yt-button-shape#confirm-button button") ||
          d.querySelector("#confirm-button") ||
          d.querySelector(".yt-spec-button-shape-next--call-to-action");
        if (btn) return btn;
      }
    } catch (err) {}
    return null;
  }

  ;(() => {
    "use strict";

    const shortsOn = () => !!S.hideShorts;
    const dubOn = () => !!S.hideAutoDubbedOn;

    function pathOf(url) {
      try {
        if (!url) return "";
        const s = String(url);
        if (s[0] === "/") return s;
        const u = new URL(s, location.href);
        const h = u.hostname;
        if (
          h !== "www.youtube.com" &&
          h !== "youtube.com" &&
          h !== "m.youtube.com" &&
          h !== "music.youtube.com" &&
          !h.endsWith(".youtube.com")
        )
          return "";
        return u.pathname + u.search;
      } catch (err) {
        return "";
      }
    }
    const CONTENT_RE =
      /\/youtubei\/v1\/(browse|next|search|get_watch|reel\/reel_watch_sequence|reel\/reel_item_watch|feed\/[a-z_]+|notification\/[a-z_]+)(\?|$)/;
    const PLAYER_RE = /\/youtubei\/v1\/player(\?|$)/;

    const SHORTS_KEYS = [
      "reelItemRenderer",
      "reelShelfRenderer",
      "reelVideoRenderer",
      "reelItemRendererViewModel",
      "shortsLockupViewModel",
      "reelPlayerOverlayRenderer",
      "reelPlayerHeaderSupportedRenderers",
      "reelChannelRenderer",
    ];

    const SHELF_KEYS = [
      "richShelfRenderer",
      "shelfRenderer",
      "richSectionRenderer",
      "itemSectionRenderer",
      "horizontalCardListRenderer",
      "gridRenderer",
      "verticalListRenderer",
    ];
    function endpointUrl(nav) {
      try {
        const w = nav && nav.commandMetadata && nav.commandMetadata.webCommandMetadata;
        if (w && w.url) return String(w.url);
      } catch (err) {}
      return "";
    }

    const SHORTS_URL_RE = /(^|\/)shorts(\/|\?|$)/i;

    function nodeIsShorts(n) {
      try {
        for (let i = 0; i < SHORTS_KEYS.length; i++)
          if (n[SHORTS_KEYS[i]] !== undefined) return true;
        const navs = [n.navigationEndpoint, n.onTap, n.onLongPress];
        for (let i = 0; i < navs.length; i++) {
          const nv = navs[i];
          if (nv) {
            if (nv.reelWatchEndpoint) return true;
            const u = endpointUrl(nv);
            if (u && SHORTS_URL_RE.test(u)) return true;
          }
        }
        const ov = n.thumbnailOverlays;
        if (ov && ov.length) {
          for (let i = 0; i < ov.length; i++) {
            const o = ov[i] && ov[i].thumbnailOverlayTimeStatusRenderer;
            if (
              o &&
              (o.style === "SHORTS" ||
                (o.text && /shorts/i.test(o.text.simpleText || o.text || "")))
            )
              return true;
          }
        }
      } catch (err) {}
      return false;
    }

    const SHORTS_WRAPPERS = [
      "videoRenderer",
      "compactVideoRenderer",
      "gridVideoRenderer",
      "reelItemRenderer",
      "lockupViewModel",
      "videoWithContextRenderer",
      "richGridMediaViewModel",

      "notificationRenderer",
      "playlistVideoRenderer",
      "playlistPanelVideoRenderer",
      "playlistPanelVideoWrapperRenderer",

      "chipCloudChipRenderer",
    ];

    function isShortsCard(item) {
      try {
        if (!item || typeof item !== "object") return false;
        if (nodeIsShorts(item)) return true;

        if (item.richItemRenderer)
          return isShortsCard(item.richItemRenderer.content || {});
        for (let i = 0; i < SHORTS_WRAPPERS.length; i++) {
          const inner = item[SHORTS_WRAPPERS[i]];
          if (inner && typeof inner === "object" && nodeIsShorts(inner)) return true;
        }

        const lvm = item.lockupViewModel || (item.richGridMediaViewModel && item.richGridMediaViewModel.content) || null;
        if (lvm && typeof lvm === "object") {
          if (lvm.onTap && lvm.onTap.reelWatchEndpoint) return true;
          const u2 = lvm.onTap ? endpointUrl(lvm.onTap) : "";
          if (u2 && SHORTS_URL_RE.test(u2)) return true;
        }
        if (item.content && item.content !== item) return isShortsCard(item.content);
      } catch (err) {}
      return false;
    }

    const DUB_TEXT_RE =
      /auto[- ]?dub|\bdubbed\b|audio track|multi[- ]?audio|multiple audio tracks|doblado|doublé|doppiato|синхрон|डब्ड|डब की गई|吹き替え|더빙|dubbat|dublado/i;
    function collectDubSignals(v) {

      let s = "";

      const grab = (x, depth) => {
        if (x == null || s.length > 300 || depth > 6) return;
        if (typeof x === "string") {
          s += " " + x;
          return;
        }
        if (Array.isArray(x)) {
          for (let i = 0; i < x.length && s.length < 300; i++) grab(x[i], depth + 1);
          return;
        }
        if (typeof x === "object") {
          for (const k in x) {
            if (Object.prototype.hasOwnProperty.call(x, k)) grab(x[k], depth + 1);
          }
        }
      };
      try {
        grab(v.badges, 0);
        grab(v.metadataBadge, 0);
        grab(v.accessibility, 0);
        grab(v.accessibilityData, 0);
        if (v.title && v.title.accessibility) grab(v.title.accessibility, 0);
        grab(v.detailedMetadataSnippets, 0);
        grab(v.metadata, 0);
        grab(v.thumbnailOverlays, 0);
      } catch (err) {}
      return s;
    }
    function isDubbedCard(item) {
      try {
        if (!item || typeof item !== "object") return false;
        const v =
          item.videoRenderer ||
          item.compactVideoRenderer ||
          item.gridVideoRenderer ||
          item.lockupViewModel ||
          item.playlistVideoRenderer ||
          (item.richItemRenderer &&
            item.richItemRenderer.content &&
            (item.richItemRenderer.content.videoRenderer ||
              item.richItemRenderer.content.lockupViewModel)) ||
          item;

        if (v.audioTrack && v.audioTrack.isAutoDubbed === true) return true;
        if (v.isAutoDubbed === true || v.isDubbed === true || v.dubbedAudio === true)
          return true;
        if (Array.isArray(v.audioTracks)) {
          for (let i = 0; i < v.audioTracks.length; i++) {
            const at = v.audioTracks[i];
            if (at && (at.isAutoDubbed === true || /dub/i.test(at.displayName || "")))
              return true;
          }
        }

        const sig = collectDubSignals(v);
        if (sig && DUB_TEXT_RE.test(sig)) return true;
      } catch (err) {}
      return false;
    }

    function shouldDrop(item, ctx) {
      if (!item || typeof item !== "object") return false;
      if (ctx.shorts && isShortsCard(item)) return true;
      if (ctx.dub && isDubbedCard(item)) return true;
      return false;
    }
    function scrubTree(node, ctx) {
      if (!node || typeof node !== "object") return false;
      if (Array.isArray(node)) {
        for (let i = node.length - 1; i >= 0; i--) {
          const item = node[i];
          if (shouldDrop(item, ctx)) {
            node.splice(i, 1);
            ctx.removed++;
            continue;
          }
          if (scrubTree(item, ctx)) {
            node.splice(i, 1);
            ctx.removed++;
          }
        }
        return false;
      }
      for (const k in node) {
        if (!Object.prototype.hasOwnProperty.call(node, k)) continue;
        const v = node[k];
        if (v && typeof v === "object") scrubTree(v, ctx);
      }

      for (let s = 0; s < SHELF_KEYS.length; s++) {
        const shelf = node[SHELF_KEYS[s]];
        if (shelf && typeof shelf === "object") {
          let contents = shelf.contents;
          if (
            !contents &&
            shelf.content &&
            shelf.content.verticalListRenderer
          )
            contents = shelf.content.verticalListRenderer.contents;
          if (Array.isArray(contents) && contents.length === 0) return true;
        }
      }
      return false;
    }

    function renumberPlaylists(node) {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) {
        let pv = 0;
        for (let i = 0; i < node.length; i++)
          if (node[i] && node[i].playlistVideoRenderer) pv++;
        if (pv >= 2 && pv >= node.length - 1) {
          let n = 1;
          for (let i = 0; i < node.length; i++) {
            const r = node[i] && node[i].playlistVideoRenderer;
            if (!r) continue;
            if (r.index && typeof r.index.simpleText !== "undefined")
              r.index.simpleText = String(n);
            n++;
          }
        }
        for (let i = 0; i < node.length; i++) renumberPlaylists(node[i]);
        return;
      }
      for (const k in node)
        if (Object.prototype.hasOwnProperty.call(node, k)) renumberPlaylists(node[k]);
    }

    let dubNotifiedFor = "";
    function trySetAudioTrack(id) {
      try {
        const mp = document.getElementById("movie_player");
        if (mp && typeof mp.setAudioTrack === "function") {
          mp.setAudioTrack(id);
          return;
        }
        if (mp && typeof mp.setAudioTrackById === "function") {
          mp.setAudioTrackById(id);
          return;
        }
        const v = document.querySelector("video.html5-main-video");
        if (v && typeof v.setAudioTrack === "function") {
          v.setAudioTrack(id);
          return;
        }
      } catch (err) {}
    }
    function handlePlayerResponse(json) {
      try {
        const formats = json && json.streamingData && json.streamingData.adaptiveFormats;
        if (!formats || !formats.length) return;
        let hasAutoDub = false,
          originalId = null,
          videoId = "";
        try {
          videoId = (json.videoDetails && json.videoDetails.videoId) || "";
        } catch (err) {}
        for (let i = 0; i < formats.length; i++) {
          const at = formats[i] && formats[i].audioTrack;
          if (!at) continue;
          if (at.isAutoDubbed === true) hasAutoDub = true;
          else if (
            !originalId &&
            (at.audioIsOriginal === true || at.isDefault === true)
          )
            originalId = at.id;
        }
        if (hasAutoDub && !originalId) {
          for (let i = 0; i < formats.length; i++) {
            const at = formats[i] && formats[i].audioTrack;
            if (at && at.isAutoDubbed !== true) {
              originalId = at.id;
              break;
            }
          }
        }
        if (!hasAutoDub) return;
        if (videoId && videoId === dubNotifiedFor) return;
        if (videoId) dubNotifiedFor = videoId;
        if (S.hideAutoDubbedPreferOriginal && originalId) {
          trySetAudioTrack(originalId);
        }
      } catch (err) {}
    }

    function emptyResponse() {
      try {
        if (typeof Response === "function")
          return new Response(null, { status: 204, statusText: "No Content" });
      } catch (err) {}
      return {
        ok: true,
        status: 204,
        statusText: "No Content",
        text: () => Promise.resolve(""),
        json: () => Promise.resolve({}),
        body: null,
        headers: new Map(),
        url: "",
      };
    }

    let apiInstalled = false;
    function ensureApi() {
      if (apiInstalled) return;
      try {
        const prevFetch = e.fetch;
        if (typeof prevFetch !== "function") return;
        apiInstalled = true;
        e.fetch = _xp.fn(function (input, init) {
          let url = "";
          try {
            url =
              input && typeof input === "object" && "url" in input
                ? input.url
                : String(input || "");
          } catch (err) {}
          const p = pathOf(url);

          if (shortsOn() && /\/youtubei\/v1\/(reel|shorts)(\/|\?|$)/.test(p)) {
            try {
              g.emit("net.blocked", { url: url, by: "remove-shorts" });
            } catch (e2) {}
            return Promise.resolve(emptyResponse());
          }
          const doShorts = shortsOn() && !!S.hideShortsApiFilter && CONTENT_RE.test(p);
          const doDub = dubOn() && CONTENT_RE.test(p);
          const doPlayer = dubOn() && PLAYER_RE.test(p);
          if (!doShorts && !doDub && !doPlayer) return prevFetch.apply(this, arguments);
          try {
            return prevFetch.apply(this, arguments).then(function (res) {
              try {
                if (!res || !res.ok) return res;
                const ct =
                  (res.headers && res.headers.get && res.headers.get("content-type")) ||
                  "";
                if (ct && ct.indexOf("json") === -1 && ct.indexOf("text") === -1)
                  return res;
                const clone = res.clone();
                return clone
                  .text()
                  .then(function (txt) {
                    try {
                      if (!txt || txt[0] !== "{") return res;

                      if (txt.length > 6 * 1024 * 1024) return res;
                      const json = JSON.parse(txt);
                      let removed = 0;
                      if (doPlayer) handlePlayerResponse(json);
                      if (doShorts || doDub) {
                        const ctxF = { shorts: doShorts, dub: doDub, removed: 0 };
                        scrubTree(json, ctxF);
                        removed = ctxF.removed;
                        if (doShorts && removed > 0) {
                          try {
                            renumberPlaylists(json);
                          } catch (e2) {}
                        }
                      }
                      if (removed > 0 || doPlayer) {
                        const body = JSON.stringify(json);
                        let headers = res.headers;
                        try {
                          headers = new Headers(res.headers);
                          headers.delete("content-encoding");
                          headers.delete("content-length");
                        } catch (e2) {
                          headers = res.headers;
                        }
                        return new Response(body, {
                          status: res.status,
                          statusText: res.statusText,
                          headers: headers,
                        });
                      }
                      return res;
                    } catch (e2) {
                      return res;
                    }
                  })
                  .catch(function () {
                    return res;
                  });
              } catch (e2) {
                return res;
              }
            });
          } catch (err) {
            return prevFetch.apply(this, arguments);
          }
        });
        try {
          e.fetch.__ytbWrapped = true;
        } catch (err) {}
      } catch (err) {
        try {
          m("yourtube api-filter install", err);
        } catch (e) {}
      }
    }

    let _initialDataTrapInstalled = false;
    function installInitialDataTrap() {

      if (_initialDataTrapInstalled) return;
      try {
        const existing = Object.getOwnPropertyDescriptor(e, "ytInitialData");
        if (existing && !existing.configurable) return;
        let current = e.ytInitialData;
        const ok = _xp.define(e, "ytInitialData", {
          configurable: true,
          enumerable: true,
          get() {
            return current;
          },
          set(v) {
            try {
              if (v && typeof v === "object" && (shortsOn() || dubOn())) {
                const ctxF = {
                  shorts: shortsOn() && !!S.hideShortsApiFilter,
                  dub: dubOn(),
                  removed: 0,
                };
                if (ctxF.shorts || ctxF.dub) scrubTree(v, ctxF);
                if (ctxF.shorts && ctxF.removed > 0) {
                  try {
                    renumberPlaylists(v);
                  } catch (err) {}
                }
              }
            } catch (err) {}
            current = v;
          },
        });
        _initialDataTrapInstalled = !!ok;
      } catch (err) {}
    }

    installInitialDataTrap();

    const SHORTS_SEL_SAFE = [
      "ytd-shorts",
      "ytd-reel-shelf-renderer",
      "ytd-reel-video-renderer",
      "ytd-reel-item-renderer",
      "ytd-shorts-video-renderer",
      "ytd-shorts-lockup-view-model",
      "ytm-shorts-lockup-view-model",
      "ytm-shorts-lockup-view-model-v2",
      "ytd-rich-shelf-renderer[is-shorts]",
      "ytd-reel-player-overlay-renderer",
      "ytd-mini-guide-entry-renderer[aria-label='Shorts']",
      "ytd-tab-renderer[title='Shorts']",
      "tp-yt-paper-tab[title='Shorts']",
      "ytd-browse[page-subtype='shorts']",
      "grid-shelf-view-model.ytGridShelfViewModelHost",
      ".shortsLockupViewModelHost",
      "a.reel-item-endpoint",
      "a.ytp-shorts-button",
      ".ytp-shorts-button",
    ];
    const SHORTS_SEL_HAS = [
      "ytd-rich-item-renderer:has(a[href*='/shorts/'])",
      "ytd-video-renderer:has(a[href*='/shorts/'])",
      "ytd-compact-video-renderer:has(a[href*='/shorts/'])",
      "ytd-grid-video-renderer:has(a[href*='/shorts/'])",
      "yt-lockup-view-model:has(a[href*='/shorts/'])",
      "ytd-shelf-renderer:has(a[href*='/shorts/'])",
      "ytd-rich-section-renderer:has(a[href*='/shorts/'])",
      "ytd-rich-shelf-renderer:has(ytd-reel-item-renderer)",
      "ytd-rich-shelf-renderer:has(path[d*='m19.45,3.88'])",
      "ytd-rich-section-renderer:has(ytd-rich-shelf-renderer path[d*='m19.45,3.88'])",
      "ytd-rich-section-renderer:has(ytd-reel-shelf-renderer)",
      "ytd-rich-section-renderer:has(ytd-reel-item-renderer)",
      "ytd-rich-section-renderer:has(grid-shelf-view-model.ytGridShelfViewModelHost)",
      "ytd-rich-item-renderer:has([overlay-style='SHORTS'])",
      "ytd-video-renderer:has([overlay-style='SHORTS'])",
      "ytd-compact-video-renderer:has([overlay-style='SHORTS'])",
      "ytd-grid-video-renderer:has([overlay-style='SHORTS'])",
      "ytd-guide-entry-renderer:has(a[href*='/shorts/'])",
      "ytd-guide-entry-renderer:has(a[title='Shorts'])",
      "ytd-mini-guide-entry-renderer:has(a[href*='/shorts/'])",
      "ytd-mini-guide-entry-renderer:has(a[title='Shorts'])",
      "ytm-pivot-bar-item-renderer:has(a[href*='/shorts/'])",
      "yt-chip-cloud-chip-renderer:has(a[href*='/shorts/'])",
      "ytd-item-section-renderer[page-subtype='subscriptions']:has([overlay-style='SHORTS'])",
      ".ytGridShelfViewModelGridShelfRow:has(.shortsLockupViewModelHost)",
      ".ytGridShelfViewModelGridShelfItem:has(.shortsLockupViewModelHost)",
    ];
    const SHORTS_DOM_SAFE = SHORTS_SEL_SAFE.join(",");
    const SHORTS_DOM_HAS = SHORTS_SEL_HAS.join(",");

    let _hasSupport = null;
    function hasSupport() {
      if (_hasSupport !== null) return _hasSupport;
      try {
        _hasSupport =
          typeof CSS !== "undefined" &&
          typeof CSS.supports === "function" &&
          CSS.supports("selector(:has(*))");
      } catch (err) {
        _hasSupport = false;
      }
      return _hasSupport;
    }
    function queryShorts(scope) {
      const out = [];
      try {
        const a = scope.querySelectorAll(SHORTS_DOM_SAFE);
        for (let i = 0; i < a.length; i++) out.push(a[i]);
      } catch (err) {}
      if (hasSupport()) {
        try {
          const b = scope.querySelectorAll(SHORTS_DOM_HAS);
          for (let i = 0; i < b.length; i++) out.push(b[i]);
        } catch (err) {}
      }
      return out;
    }
    function matchesShorts(el) {
      try {
        if (el.matches(SHORTS_DOM_SAFE)) return true;
      } catch (err) {}
      if (hasSupport()) {
        try {
          if (el.matches(SHORTS_DOM_HAS)) return true;
        } catch (err) {}
      }
      return false;
    }

    function shortsShellRoot(el) {
      try {
        const title = el.querySelector("#title");
        const isShorts =
          (title && /^shorts$/i.test((title.textContent || "").trim())) ||
          !!el.querySelector("path[d*='m19.45,3.88']");
        if (!isShorts) return null;
        return el.closest("ytd-rich-section-renderer") || el;
      } catch (err) {
        return null;
      }
    }
    const shortSlots = new Map(), shortLinks = new Map();
    function parkShort(el) {
      if (!el.isConnected) return;
      const slot = document.createComment("yourtube:shorts");
      el.replaceWith(slot); shortSlots.set(slot, el);
    }
    function killShortsShells(scope) {
      for (const shelf of scope.querySelectorAll("ytd-rich-shelf-renderer")) {
        const root = shortsShellRoot(shelf);
        if (root) root.setAttribute("data-ytb-shorts-dead", "1");
      }
    }
    function restoreShortsShells() {
      for (const [slot, el] of shortSlots) if (slot.isConnected && !el.isConnected) slot.replaceWith(el);
      shortSlots.clear();
      for (const [a, link] of shortLinks) if (a.getAttribute("href") === link.written) a.setAttribute("href", link.original);
      shortLinks.clear();
      document.querySelectorAll("[data-ytb-shorts-dead]").forEach(el => el.removeAttribute("data-ytb-shorts-dead"));
    }
    function sanitizeShortsHrefs(scope) {
      if (!S.hideShortsRedirect) return;
      const sel = "a[href*='/shorts/']";
      const links = scope.matches?.(sel) ? [scope, ...scope.querySelectorAll(sel)] : scope.querySelectorAll(sel);
      for (const a of links) {
        const original = a.getAttribute("href");
        let url; try { url = new URL(original, location.href); } catch (_) {continue;}
        const hit = /^\/shorts\/([A-Za-z0-9_-]{4,})\/?$/.exec(url.pathname);
        if (!hit || url.origin !== location.origin) continue;
        url.searchParams.delete("v");
        const written = "/watch?v="+hit[1]+(url.search ? "&"+url.search.slice(1) : "")+url.hash;
        shortLinks.set(a,{original,written}); a.setAttribute("href",written);
      }
    }
    const domActive = new Set();
    let domObs = null,
      domQueue = null,
      domRaf = false;
    function domFlush() {
      domRaf = false;
      const q = domQueue;
      domQueue = null;
      if (!q || !q.length || !domActive.has("shorts")) return;
      // SPA navigation can discard an entire shelf (and its placeholder).
      for (const slot of shortSlots.keys()) if (!slot.isConnected) shortSlots.delete(slot);
      for (const a of shortLinks.keys()) if (!a.isConnected) shortLinks.delete(a);
      const doRemove = !!S.hideShortsDomClean;
      const doSanitize = !!S.hideShortsRedirect;
      for (let i = 0; i < q.length; i++) {
        const root = q[i];
        try {
          if (!root || !root.isConnected) continue;
          if (doRemove) {
            if (matchesShorts(root)) {
              parkShort(root);
              continue;
            }
            const hits = queryShorts(root);
            for (let k = 0; k < hits.length; k++) {
              try {
                parkShort(hits[k]);
              } catch (err) {}
            }
          }
          if (doSanitize) sanitizeShortsHrefs(root);
          killShortsShells(root);
        } catch (err) {}
      }
    }
    function startDom(kind) {
      domActive.add(kind);
      if (domObs || !document.body) return;
      try {
        domObs = new MutationObserver(function (records) {
          if (!domActive.size) return;
          if (!domQueue) domQueue = [];
          for (let i = 0; i < records.length; i++) {
            const added = records[i].addedNodes;
            for (let j = 0; j < added.length; j++) {
              const n = added[j];
              if (n && n.nodeType === 1) domQueue.push(n);
            }
          }
          if (!domRaf) {
            domRaf = true;
            requestAnimationFrame(domFlush);
          }
        });
        domObs.observe(document.body, { childList: true, subtree: true });
      } catch (err) {
        domObs = null;
      }
    }
    function stopDom(kind) {
      domActive.delete(kind);
      if ("shorts" === kind) restoreShortsShells();
      if (domActive.size || !domObs) return;
      try {
        domObs.disconnect();
      } catch (err) {}
      domObs = null;
    }
    function scrubRoot() {
      if (!shortsOn()) return;

      killShortsShells(document);

      if (S.hideShortsDomClean) {
        try {
          const hits = queryShorts(document);
          for (let i = 0; i < hits.length; i++) {
            try {
              parkShort(hits[i]);
            } catch (err) {}
          }
        } catch (err) {}
      }

      sanitizeShortsHrefs(document);
    }

    function shortsRedirect() {
      try {
        if (!shortsOn() || !S.hideShortsRedirect) return;
        const m = location.pathname.match(/^\/shorts\/([A-Za-z0-9_-]{4,})/);
        if (!m) return;
        const id = m[1];
        let seen = [];
        try {
          seen = JSON.parse(sessionStorage.getItem("__yourtube_sr") || "[]");
        } catch (err) {
          seen = [];
        }
        if (seen.indexOf(id) !== -1) return; 
        seen.push(id);
        if (seen.length > 50) seen = seen.slice(-50);
        try {
          sessionStorage.setItem("__yourtube_sr", JSON.stringify(seen));
        } catch (err) {}
        const q = location.search || "";
        location.replace("/watch?v=" + id + (q ? q.replace(/^\?/, "&") : ""));
      } catch (err) {}
    }

    const SHORTS_HIDE =
      "{display:none!important;visibility:hidden!important;pointer-events:none!important}";
    const SHORTS_CSS =
      SHORTS_SEL_SAFE.join(",") +
      SHORTS_HIDE +
      "\n@supports selector(:has(*)){" +
      SHORTS_SEL_HAS.join(",") +
      SHORTS_HIDE +
      "}";

    xa.register({
      id: "hide-shorts",
      name: "Hide Shorts",
      summary: "Removes every Shorts surface site-wide; optional API filtering.",
      cat: "feed",
      masterKey: "hideShorts",
      keys: ["hideShorts", "hideShortsRedirect", "hideShortsDomClean", "hideShortsApiFilter"],
      apply(ctx) {
        if (!S.hideShorts) {
          stopDom("shorts");
          return;
        }

        ctx.addStyle(SHORTS_CSS + "\n[data-ytb-shorts-dead]{display:none!important}");
        Yt["hide-shorts"].push(() => stopDom("shorts"));

        try { installInitialDataTrap(); } catch (err) {}
        shortsRedirect();
        ctx.onNav(() => setTimeout(shortsRedirect, 80));

        if (S.hideShortsDomClean || S.hideShortsRedirect) {
          startDom("shorts");
          ctx.onNav(() => setTimeout(scrubRoot, 60));
        } else {
          stopDom("shorts");
        }

        ensureApi();

        scrubRoot();
      },
      settings(en) {
        en.appendChild(Io("Remove Shorts everywhere", "hideShorts"));
        en.appendChild(Io("Redirect Shorts links to the normal player", "hideShortsRedirect"));
        en.appendChild(Io("Also strip Shorts from live / injected content", "hideShortsDomClean"));
        en.appendChild(Io("Filter Shorts before they render (recommended)", "hideShortsApiFilter"));
      },
    });

    xa.register({
      id: "hide-auto-dubbed",
      name: "Hide Auto-Dubs",
      summary: "Filters auto-dubbed cards; keeps original-audio versions visible.",
      cat: "feed",
      masterKey: "hideAutoDubbedOn",
      keys: ["hideAutoDubbedOn", "hideAutoDubbedPreferOriginal"],
      apply(ctx) {
        if (!S.hideAutoDubbedOn) return;
        const attr = "data-ytb-auto-dubbed";
        const cards = "ytd-rich-item-renderer,ytd-video-renderer,ytd-grid-video-renderer,ytd-compact-video-renderer,yt-lockup-view-model,ytd-playlist-video-renderer";
        const scan = () => {
          for (const card of document.querySelectorAll(cards)) {
            const badges = card.querySelectorAll("ytd-badge-supported-renderer,yt-badge-shape,.badge-shape-wiz,[aria-label]");
            const dubbed = isDubbedCard(card.data || {}) || Array.from(badges).some(el => {
              const label = el.getAttribute("aria-label") || "";
              return DUB_TEXT_RE.test(label) || (el.matches("ytd-badge-supported-renderer,yt-badge-shape,.badge-shape-wiz") && DUB_TEXT_RE.test(el.textContent || ""));
            });
            if (card.hasAttribute(attr) !== dubbed) card.toggleAttribute(attr,dubbed);
          }
        };
        ctx.addStyle("[data-ytb-auto-dubbed]{display:none!important}");
        scan();
        let frame = 0;
        const observer = new MutationObserver(() => { if (!frame) frame = requestAnimationFrame(() => {frame=0;scan();}); });
        if (document.body) observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["aria-label"]});
        Yt["hide-auto-dubbed"].push(() => {observer.disconnect();cancelAnimationFrame(frame);document.querySelectorAll("["+attr+"]").forEach(el=>el.removeAttribute(attr));});
        try { installInitialDataTrap(); } catch (err) {}
        ensureApi();

        try {
          if (e.ytInitialPlayerResponse) handlePlayerResponse(e.ytInitialPlayerResponse);
        } catch (err) {}
        ctx.onNav(() => {
          try {
            if (e.ytInitialPlayerResponse) handlePlayerResponse(e.ytInitialPlayerResponse);
          } catch (err) {}
        });
      },
      settings(en) {
        en.appendChild(Io("Hide auto-dubbed videos", "hideAutoDubbedOn"));
        en.appendChild(Io("On the watch page, restore the original audio track", "hideAutoDubbedPreferOriginal"));
        en.appendChild(
          To(
            "div",
            "ytb-hist-note",
            "Feed and recommendation filtering relies on the metadata YouTube exposes (audio-track flags, badges and accessibility labels), so it is best-effort there. On the watch page detection is exact, and the original audio track is restored automatically when available.",
          ),
        );
      },
    });

    try {
      e.__YOURTUBE_ENGINE__ = {
        isShortsCard,
        isDubbedCard,
        scrubTree,
        handlePlayerResponse,
        endpointUrl,
        pausedDialogConfirmBtn: _ytbPausedDialogConfirmBtn,

        apply: (id) => xa.apply(id),
        set: (key, value) => Ta(key, value),
        quarantined: () => Array.from(va.keys()).filter((id) => xa.isQuarantined(id)),
        resources: () => YourTubeResources.stats(),
        get cfg() { return S; },
        features: () => xa.list(),
        fetchWrapped: () => !!(e.fetch && e.fetch.__ytbWrapped),
      };
    } catch (err) {}
  })();

