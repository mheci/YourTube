(() => {
  "use strict";
  const e = "undefined" != typeof unsafeWindow ? unsafeWindow : window;
  if (e.__YOURTUBE_LOADED__) return;
  e.__YOURTUBE_LOADED__ = !0;


  const _xp = (() => {
    const _w = e;
    const _ef = typeof exportFunction === "function" ? exportFunction : null;
    const _ci = typeof cloneInto === "function" ? cloneInto : null;
    const fn = (f, opts) => {
      try { return _ef ? _ef(f, _w, opts || undefined) : f; } catch (_) { return f; }
    };
    const ctor = (f) => {
      try { return _ef ? _ef(f, _w, { allowConstruct: true }) : f; } catch (_) { return f; }
    };

    const clone = (v) => {
      try { return _ci && v && typeof v === "object" ? _ci(v, _w, { cloneFunctions: true }) : v; } catch (_) { return v; }
    };

    const define = (obj, key, desc) => {
      try {
        const d = { configurable: desc.configurable !== false, enumerable: !!desc.enumerable };
        if ("value" in desc) d.value = desc.value;
        if (typeof desc.get === "function") d.get = fn(desc.get);
        if (typeof desc.set === "function") d.set = fn(desc.set);
        Object.defineProperty(obj, key, d);
        return true;
      } catch (_) { return false; }
    };
    return { fn, ctor, clone, define };
  })();

  const _pPromise = e.Promise || Promise;

  try {
    const e = ("undefined" != typeof location && location.search) || "",
      t = /[?&]yourtube=on\b/i.test(e);
    if (t) {
      try {
        localStorage.removeItem("yourtube_killed");
      } catch (e) {}
      try {
        sessionStorage.removeItem("yourtube_kill");
      } catch (e) {}

      try {
        "function" == typeof GM_setValue && GM_setValue("yourtube.killed", !1);
      } catch (e) {}
    }
    const a = !t && /[?&]yourtube=off\b/i.test(e),
      n =
        !t &&
        (() => {
          try {
            return "1" === localStorage.getItem("yourtube_killed");
          } catch (e) {
            return !1;
          }
        })(),
      r =
        !t &&
        (() => {
          try {
            return "1" === sessionStorage.getItem("yourtube_kill");
          } catch (e) {
            return !1;
          }
        })(),

      q =
        !t &&
        (() => {
          try {
            return !0 === ("function" == typeof GM_getValue && GM_getValue("yourtube.killed", !1));
          } catch (e) {
            return !1;
          }
        })();
    if (a || n || r || q) {
      try {
        console.warn("[YourTube] kill-switch active - script aborted.");
      } catch (e) {}
      try {
        "function" == typeof GM_registerMenuCommand &&
          GM_registerMenuCommand(
            "YourTube is off - click to turn it back on",
            () => {
              try {
                localStorage.removeItem("yourtube_killed");
              } catch (e) {}
              try {
                sessionStorage.removeItem("yourtube_kill");
              } catch (e) {}
              try {
                "function" == typeof GM_setValue && GM_setValue("yourtube.killed", !1);
              } catch (e) {}
              location.reload();
            },
          );
      } catch (e) {}
      return;
    }
  } catch (e) {}



  const u = (e, t) => p("info", e, t),
    h = (e, t) => p("warn", e, t),
    m = (e, t) => p("error", e, t),
    y = () => l.slice();

  const _mp = (() => {
    "use strict";

    let _nextId = 1;

    const _byId = new Map();
    const _byKind = new Map();
    const _allocLog = [];
    const _maxLog = 200;

    const _caches = [];

    let _finalizer = null;

    let _running = true;

    let _lastHeap = 0;
    let _lastHeapWarn = 0;
    let _lastKvCleanup = 0;

    let _maintTimer = 0;

    let _softCleanupLast = 0;

    let _totalAcquired = 0;
    let _totalReleased = 0;
    let _doubleFreeAttempts = 0;
    let _finalizerRecoveries = 0;

    const _log = (kind, msg, ref) => {
      try {
        _allocLog.push({ t: Date.now(), k: kind, m: String(msg).slice(0, 160) });
        if (_allocLog.length > _maxLog) _allocLog.shift();
        if (kind === "double-free") {
          try { h && h("[YourTube][mp] " + msg, ref); } catch (e) {}
        } else if (kind === "leak-suspect") {
          try { h && h("[YourTube][mp] " + msg, ref); } catch (e) {}
        }
      } catch (e) {}
    };

    const acquire = (kind, owner, payload) => {
      if (!_running) {

        return {
          id: 0,
          kind: kind || "unknown",
          owner: owner || "?",
          ref: payload && payload.ref,
          released: true,
          dispose: () => {},
        };
      }
      const id = _nextId++;
      const handle = {
        id,
        kind: kind || "unknown",
        owner: owner || "?",
        t: Date.now(),
        ref: payload && payload.ref,
        meta: payload && payload.meta,
        released: false,
        releaseFn: (payload && payload.release) || null,
        dispose() {
          if (this.released) {
            _doubleFreeAttempts++;
            _log(
              "double-free",
              "double dispose on " + kind + " #" + id + " (" + owner + ")",
              this.ref,
            );
            return;
          }
          this.released = true;
          _totalReleased++;
          _byId.delete(id);
          const cnt = _byKind.get(kind) || 0;
          if (cnt <= 1) _byKind.delete(kind);
          else _byKind.set(kind, cnt - 1);
          try {
            if (typeof this.releaseFn === "function") this.releaseFn(this.ref);
          } catch (e) {}
          if (this.ref && _finalizer) {

            try {
              if (this._token) _finalizer.unregister(this._token);
            } catch (_) {}
            this._token = null;
          }
        },

        alive() {
          return !this.released && _byId.has(id);
        },
      };
      _byId.set(id, handle);
      _byKind.set(kind, (_byKind.get(kind) || 0) + 1);
      _totalAcquired++;

      if (payload && payload.ref && typeof WeakRef === "function" && _finalizer) {
        try {
          handle._token = {};

          _finalizer.register(payload.ref, handle, handle._token);
        } catch (e) {}
      }
      return handle;
    };

    const releaseById = (id) => {
      const h = _byId.get(id);
      if (h) h.dispose();
    };

    const releaseKind = (kind) => {
      const ids = [];
      for (const h of _byId.values()) if (h.kind === kind) ids.push(h.id);
      for (const id of ids) releaseById(id);
    };

    const safeSetTimeout = (fn, ms, owner) => {
      let id = 0;
      try {
        id = setTimeout(() => {
          try { fn(); } catch (e) {}
        }, ms);
      } catch (e) {
        return acquire("timeout", owner || "?", { ref: null });
      }
      return acquire("timeout", owner || "?", {
        ref: null,
        release: () => {
          try { clearTimeout(id); } catch (e) {}
        },
      });
    };
    const safeSetInterval = (fn, ms, owner) => {
      let id = 0;
      try {
        id = setInterval(() => {
          try { fn(); } catch (e) {}
        }, ms);
      } catch (e) {
        return acquire("interval", owner || "?", { ref: null });
      }
      return acquire("interval", owner || "?", {
        ref: null,
        release: () => {
          try { clearInterval(id); } catch (e) {}
        },
      });
    };

    const safeObserver = (kind, factory, owner) => {
      let obs = null;
      try {
        obs = factory();
      } catch (e) {
        return acquire("observer", owner || "?", { ref: null });
      }
      return acquire("observer", owner || "?", {
        ref: obs,
        meta: { kind },
        release: () => {
          try { obs && obs.disconnect && obs.disconnect(); } catch (e) {}
        },
      });
    };

    const safeListener = (target, event, fn, opts, owner) => {
      let added = false;
      try {
        target.addEventListener(event, fn, opts);
        added = true;
      } catch (e) {
        return acquire("listener", owner || "?", { ref: null });
      }
      return acquire("listener", owner || "?", {
        ref: { target, event, fn, opts },
        release: () => {
          try {
            if (added)
              target.removeEventListener(event, fn, opts);
          } catch (e) {}
        },
      });
    };

    const safeBlobURL = (blob, owner) => {
      let u = "";
      try {
        u = URL.createObjectURL(blob);
      } catch (e) {
        return acquire("blobURL", owner || "?", { ref: null });
      }
      return acquire("blobURL", owner || "?", {
        ref: { url: u },
        release: () => {
          try { u && URL.revokeObjectURL(u); } catch (e) {}
        },
      });
    };

    const safeElement = (el, owner) => {
      if (!el) return acquire("element", owner || "?", { ref: null });
      return acquire("element", owner || "?", {
        ref: el,
        release: () => {
          try {
            if (el.parentNode) el.parentNode.removeChild(el);
          } catch (e) {}
          try { el.remove && el.remove(); } catch (e) {}
        },
      });
    };

    const safeWrap = (fn, owner) => {
      return function (...args) {
        try {
          return fn.apply(this, args);
        } catch (e) {
          try {
            h && h("[YourTube][mp] error in " + (owner || "?"), e);
          } catch (e2) {}
        }
      };
    };

    const registerCache = (name, map, cap, onEvict) => {
      if (!map || typeof map.size !== "number") return;
      _caches.push({
        name: name || "cache",
        map: map,
        cap: cap || 64,
        onEvict: onEvict || null,
      });
    };
    const _firstKey = (m) => {
      const ks = m.keys();
      return ks && typeof ks.next === "function" ? ks.next().value : ks[0];
    };
    const evictCachePct = (name, pct) => {
      const c = _caches.find((c) => c.name === name);
      if (!c) return 0;
      const target = Math.max(1, Math.floor((c.map.size || 0) * pct));
      let n = 0;

      while (n < target && c.map.size > 0) {
        const firstKey = _firstKey(c.map);
        if (firstKey === undefined) break;
        const val = c.map.get(firstKey);
        c.map.delete(firstKey);
        if (typeof c.onEvict === "function") {
          try { c.onEvict(firstKey, val); } catch (e) {}
        }
        n++;
      }
      return n;
    };

    const _maintTick = (forceKv) => {
      if (!_running) return;


      try {
        if (
          forceKv === true ||
          (typeof YourTubeCache !== "undefined" && YourTubeCache &&
            Date.now() - _lastKvCleanup > 300000)
        ) {
          if (typeof YourTubeCache !== "undefined" && YourTubeCache) {
            _lastKvCleanup = Date.now();
            YourTubeCache.cleanup();
          }
        }
      } catch (e) {}

      try {
        const m = performance && performance.memory;
        if (m && typeof m.usedJSHeapSize === "number") {
          _lastHeap = m.usedJSHeapSize;
          const lim = m.jsHeapSizeLimit || 0;
          if (lim > 0) {
            const pct = _lastHeap / lim;
            if (pct > 0.8 && Date.now() - _lastHeapWarn > 6e4) {
              _lastHeapWarn = Date.now();
              _log("leak-suspect", "JSHeap > 80% (" + (pct * 100).toFixed(1) + "%), running soft cleanup");
              _softCleanup();
            }
          }
        }
      } catch (e) {}

      for (const c of _caches) {
        try {
          if (c.map && c.map.size > c.cap) {

            while (c.map.size > c.cap) {
              const firstKey = _firstKey(c.map);
              if (firstKey === undefined) break;
              const val = c.map.get(firstKey);
              c.map.delete(firstKey);
              if (typeof c.onEvict === "function") {
                try { c.onEvict(firstKey, val); } catch (e) {}
              }
            }
          }
        } catch (e) {}
      }

      try {
        if (performance && performance.mark) {
          performance.mark("ytp-mp-tick");
        }
      } catch (e) {}
    };
    const _softCleanup = () => {

      for (const c of _caches) {
        try { evictCachePct(c.name, 0.25); } catch (e) {}
      }

      _softCleanupLast = Date.now();
    };
    const runMaintenance = (forceKv) => {
      _maintTick(forceKv);
    };

    const snapshot = () => {
      const counts = {};
      for (const [k, v] of _byKind) counts[k] = v;
      const cacheNames = _caches.map((c) => ({
        name: c.name,
        size: c.map && c.map.size,
        cap: c.cap,
      }));

      let score = 0;
      score += Math.min(50, (_byId.size / 200) * 50);
      if (_totalAcquired > 0) {
        score += Math.min(40, (_doubleFreeAttempts / _totalAcquired) * 400);
      }
      if (_lastHeap > 0) {
        const m = performance && performance.memory;
        if (m && m.jsHeapSizeLimit) {
          const pct = _lastHeap / m.jsHeapSizeLimit;
          if (pct > 0.8) score += 25;
        }
      }
      score = Math.min(100, Math.round(score));
      return {
        version: 1,
        live: _byId.size,
        acquired: _totalAcquired,
        released: _totalReleased,
        doubleFreeAttempts: _doubleFreeAttempts,
        finalizerRecoveries: _finalizerRecoveries,
        byKind: counts,
        caches: cacheNames,
        heap: {
          used: _lastHeap,
          jsHeapSizeLimit:
            (performance && performance.memory &&
              performance.memory.jsHeapSizeLimit) || 0,
        },
        leakScore: score,
        lastSoftCleanup: _softCleanupLast,
        ts: Date.now(),
      };
    };

    const audit = () => {
      const out = [];
      for (const h of _byId.values()) {
        out.push({
          id: h.id,
          kind: h.kind,
          owner: h.owner,
          age: Date.now() - (h.t || 0),
          meta: h.meta || null,
        });
      }
      return {
        live: out.length,
        byKind: Object.assign({}, snapshot().byKind),
        leakScore: snapshot().leakScore,
        resources: out.slice(0, 200), 
      };
    };

    const disposeAll = () => {

      const ids = Array.from(_byId.keys());
      for (const id of ids) releaseById(id);

      try { clearInterval(_maintTimer); } catch (e) {}
      _maintTimer = 0;
      _running = false;
    };

    return {
      acquire,
      releaseById,
      releaseKind,
      safeSetTimeout,
      safeSetInterval,
      safeObserver,
      safeListener,
      safeBlobURL,
      safeElement,
      safeWrap,
      registerCache,
      evictCachePct,
      runMaintenance,
      snapshot,
      audit,
      disposeAll,
      _internal: {
        softCleanup: _softCleanup,
        setFinalizer: (f) => { _finalizer = f; },
        bumpFinalizer: () => { _finalizerRecoveries++; },
        isRunning: () => _running,
        markRunning: (v) => { _running = !!v; },
      },
    };
  })();

  try {
    if (typeof FinalizationRegistry === "function" && typeof WeakRef === "function") {
      const _fr = new FinalizationRegistry((held) => {
        try {

          if (held && !held.released) {
            _mp._internal.bumpFinalizer();
            try { p("warn", "[YourTube][mp] GC recovered " + held.kind + " #" + held.id + " (" + held.owner + ")"); } catch (e) {}
            try { held.dispose(); } catch (e) {}
          }
        } catch (e) {}
      });
      _mp._internal.setFinalizer(_fr);
    }
  } catch (e) {}

  const YourTubeCache = (() => {
    const _memCache = new Map();
    const _inFlight = new Map();

    const getChecksum = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash).toString(16);
    };

    const get = async (key, options = {}) => {
      const { source = "idb", allowExpired = false } = options;
      const now = Date.now();

      if (_memCache.has(key)) {
        const entry = _memCache.get(key);
        if (allowExpired || entry.expires > now) {
          return entry.data;
        }
        _memCache.delete(key);
      }

      if (source === "gm") {
        try {
          const valStr = GM_getValue && GM_getValue("cache:" + key);
          if (valStr) {
            const entry = JSON.parse(valStr);
            if (allowExpired || entry.expires > now) {
              _memCache.set(key, entry);
              return entry.data;
            }
            GM_deleteValue && GM_deleteValue("cache:" + key);
          }
        } catch (e) {
          try { h("[YourTube][cache] GM read failed for " + key, e); } catch (_) {}
        }
      } else {
        try {
          const entry = await v("kv", "cache:" + key);
          if (entry && entry.v) {
            const parsed = entry.v;
            if (allowExpired || parsed.expires > now) {
              _memCache.set(key, parsed);
              return parsed.data;
            }
            await x("kv", "cache:" + key);
          }
        } catch (e) {
          try { h("[YourTube][cache] IDB read failed for " + key, e); } catch (_) {}
        }
      }
      return null;
    };

    const set = async (key, data, ttlMs, options = {}) => {
      const { source = "idb", version = 1 } = options;
      const now = Date.now();
      const expires = now + ttlMs;
      const checksum = getChecksum(typeof data === "string" ? data : JSON.stringify(data));

      const entry = {
        data,
        timestamp: now,
        expires,
        version,
        source,
        checksum,
        ttl: ttlMs,
      };

      _memCache.set(key, entry);

      if (source === "gm") {
        try {
          GM_setValue && GM_setValue("cache:" + key, JSON.stringify(entry));
        } catch (e) {
          try { h("[YourTube][cache] GM write failed for " + key, e); } catch (_) {}
        }
      } else {
        try {
          await k("kv", {
            k: "cache:" + key,
            v: entry,
            updatedAt: now,
          });
        } catch (e) {
          try { h("[YourTube][cache] IDB write failed for " + key, e); } catch (_) {}
        }
      }
    };

    const remove = async (key, options = {}) => {
      const { source = "idb" } = options;
      _memCache.delete(key);
      if (source === "gm") {
        try { GM_deleteValue && GM_deleteValue("cache:" + key); } catch (e) {}
      } else {
        try { await x("kv", "cache:" + key); } catch (e) {}
      }
    };

    const getOrFetch = async (key, fetchFn, ttlMs, options = {}) => {
      const cachedData = await get(key, options);
      if (cachedData !== null) {
        return cachedData;
      }

      if (_inFlight.has(key)) {
        return _inFlight.get(key);
      }

      const promise = (async () => {
        try {
          const freshData = await fetchFn();
          if (freshData !== null && freshData !== undefined) {
            await set(key, freshData, ttlMs, options);
          }
          return freshData;
        } finally {
          _inFlight.delete(key);
        }
      })();

      _inFlight.set(key, promise);
      return promise;
    };

    const cleanup = async () => {
      const now = Date.now();
      for (const [key, entry] of _memCache.entries()) {
        if (entry.expires <= now) {
          _memCache.delete(key);
        }
      }
      try {
        const allRows = await w("kv");
        for (const row of allRows) {
          if (row.k && row.k.startsWith("cache:")) {
            if (row.v && (row.v.expires || row.v.expiresAt) <= now) {
              await x("kv", row.k);
            }
          }
        }
      } catch (e) {}
    };

    return {
      get,
      set,
      remove,
      getOrFetch,
      cleanup,
    };
  })();

  try {
    setTimeout(() => {
      try { _mp.registerCache("time-format", typeof de !== "undefined" ? de : null, 512, null); } catch (e) {}
      try {
        if (typeof Ve !== "undefined" && Ve && Ve.size !== undefined) {
          _mp.registerCache("thumb-blob", Ve, 24, (k, v) => {
            try { if (v && typeof v === "string") URL.revokeObjectURL(v); } catch (e) {}
          });
        }
      } catch (e) {}
    }, 0);
  } catch (e) {}

  try {

    _mp.safeSetInterval(
      () => {
        try {
          if (
            typeof document !== "undefined" &&
            document.visibilityState === "hidden"
          )
            return;
          _mp.runMaintenance();

          try {
            if (typeof YourTubeResources !== "undefined") {
              YourTubeResources.TrackedBlobURL.revokeOlderThan(30 * 60 * 1000);
            }
          } catch (e) {}
        } catch (e) {}
      },
      3e4, 
      "memory-maint",
    );

    try {
      _mp.safeListener(
        typeof window !== "undefined" ? window : null,
        "pagehide",
        () => {
          try { _mp.runMaintenance(); } catch (e) {}
        },
        { capture: true },
        "memory-pagehide-checkpoint",
      );
    } catch (e) {}
  } catch (e) {}

  const t = (() => {
      try {
        if (e.trustedTypes && e.trustedTypes.createPolicy)
          return e.trustedTypes.createPolicy("yourtube#dashboard", {
            createHTML: (e) => e,
          });
      } catch (e) {}
      return null;
    })(),
    a = (a, n) => {
      try {
        a.innerHTML = Xy(((a) => {
          if (t) return t.createHTML(a);
          if (e.trustedTypes && e.trustedTypes.defaultPolicy)
            try {
              return e.trustedTypes.defaultPolicy.createHTML(a);
            } catch (e) {}
          return a;
        })(n));
      } catch (e) {
        try {
          const e = document.implementation.createHTMLDocument("");
          ((e.body.innerHTML = n), (a.textContent = ""));
          const t = document.createDocumentFragment();
          for (; e.body.firstChild; ) t.appendChild(e.body.firstChild);
          a.appendChild(t);
        } catch (e) {
          a.textContent = n.replace(/<[^>]*>/g, "");
        }
      }
    },
    n =
      ("undefined" != typeof GM_info &&
        GM_info.script &&
        GM_info.script.version) ||
      "__YTP_VERSION__", // stamped at build time; was a drifting hard-coded literal
    o = (() => {
      try {
        return CSS.supports("selector(:has(*))");
      } catch (e) {
        return !1;
      }
    })(),

    i = [
      { id: "sponsor", label: "Sponsor", color: "#00d400", desc: "Paid promotions, paid referrals, and direct advertisements" },
      { id: "selfpromo", label: "Unpaid/Self Promotion", color: "#ffff00", desc: "Self-promotion, merchandise plugs, and channel shoutouts" },
      { id: "interaction", label: "Interaction Reminder", color: "#cc00ff", desc: "Subscribe, like, comment, and follow reminders" },
      { id: "intro", label: "Intermission/Intro", color: "#00ffff", desc: "Opening animations, intros, and recurring transitions" },
      { id: "outro", label: "Endcards/Credits", color: "#0202ed", desc: "End screens, credits, and closing callouts" },
      { id: "preview", label: "Preview/Recap", color: "#008fd6", desc: "Previews, recaps, and hooks before the main content" },
      { id: "hook", label: "Hook", color: "#ff6f00", desc: "Attention-grabbing teaser at the very start of a video" },
      { id: "filler", label: "Filler/Tangent", color: "#7300ab", desc: "Off-topic tangents and filler not needed to understand the main content" },
      { id: "music_offtopic", label: "Non-Music Section", color: "#ff9900", desc: "Non-music sections in music videos (spoken parts, intros)" },
      { id: "poi_highlight", label: "Highlight", color: "#ff1684", desc: "The most interesting or important moment in the video" },
      { id: "exclusive_access", label: "Exclusive Access", color: "#008a5c", desc: "Entire video is only available to paying members or subscribers" },
      { id: "chapter", label: "Chapter", color: "#ffffff", desc: "Community-defined chapter markers with titles" }
    ],

        Yi = {
      skip: "Skip",
      mute: "Mute",
      poi: "Jump to highlight",
      chapter: "Show chapters",
      full: "Label only",
      disabled: "Off",
    },

        d = {
      hd2160: "4K",
      hd1440: "1440p",
      hd1080: "1080p",
      hd720: "720p",
      large: "480p",
      medium: "360p",
      small: "240p",
      tiny: "144p",
      auto: "Auto",
    },
    c = (() => {

      const DEF_ACT = {
        sponsor: "skip",
        selfpromo: "full",
        interaction: "full",
        intro: "skip",
        outro: "skip",
        preview: "skip",
        hook: "skip",
        filler: "skip",
        music_offtopic: "skip",
        poi_highlight: "poi",
        exclusive_access: "skip",
        chapter: "chapter",
      };
      const e = {};
      return (
        i.forEach((t) => {
          e["sb_" + t.id + "_en"] = !0;
          e["sb_" + t.id + "_act"] = DEF_ACT[t.id] || "skip";
          e["sb_" + t.id + "_sb"] = !0;
        }),
        (e.sbOnlySkipIfVip = !1),
        (e.sbIncognito = !1),
        (e.sbSkipCountdown = !1),
        (e.sbSkipCountdownTime = 3),
        (e.sbBetterBeAware = ""),
        // v1.6.0 parity options (official extension equivalents):
        (e.sbDisable = !1),        // disableSkipping
        (e.sbWhitelist = ""),      // per-channel skip opt-out (UC ids or names)
        (e.sbMinDuration = 0),     // minDuration
        (e.sbAudioCue = !1),       // audioNotificationOnSkip
        (e.sbSkipRules = ""),      // skipRules (advanced skip options)
        (e.sbChapterToast = !1),   // showChapterInfoMessage
        (e.sbTimeWithSkips = !0),  // showTimeWithSkips
        (e.sbRenderChapters = !0), // renderSegmentsAsChapters
        (e.dashMode = "light"),    // dashboard palette: "light" (Calm paper) | "dark"
        (e.sbRenderChapters = !0), // renderSegmentsAsChapters
        e
      );
    })(),

        s = Object.assign(
      {
        safeMode: !1,
        privacyShieldOn: !1,
        silentToasts: !1,
        updateCheckOn: !0,
        updateCheckHours: 24,
privacyPreset: "everyday",
overlayHubOn: !1,
overlayHubPos: "bl",
algoStrength: "balanced",
algoBoostOn: !1,
algoBoostInterval: 20,
algoDiversityOn: !1,
algoDiversityMax: 60,
algoAutoLikeOn: !1,
algoAutoLikePct: 85,
algoShortsOn: !1,
algoBlockChannels: "",
        speedDefault: 1,
        speedRemember: !1,
        smartSpeedOn: !1,

        speedStep: 0.25,

        speedPerChannelOn: !1,

        perfModeOn: !1,
        perfModeLevel: "balanced",
        perfModeAuto: !1,
        perfContainment: !1,
        perfLazyThumbs: !1,
        perfLazyComments: !1,
        perfKillAnim: !1,
        perfKillBlur: !1,
        perfThumbQuality: !1,
        perfDisablePreviews: !1,
        perfMemoryTrim: !1,
        perfPrefetch: !1,
        perfPreconnect: !1,
        perfBgThrottle: !1,
        perfPaintReduction: !1,
        perfQualityCap: !1,

        cookieControlOn: !1,
        cookieControlLive: !1,
        cookieControlNotify: !1,
        cookieControlAutoBackup: !1,
        cookieControlFavorites: "",
        cookieControlCategories: "",
        loopVideo: !1,
        abLoopOn: !1,
        abA: -1,
        abB: -1,
        autoHD: !1,
        qualityPref: "hd1080",
        forceCC: !1,
        forceCCLang: "",
        ccNativePrefs: !1,
        ccFontSize: 28,
        ccFontFamily: "Roboto, Arial, sans-serif",
        ccFontWeight: "700",
        ccTextColor: "#ffffff",
        ccBgColor: "#000000",
        ccBgOpacity: 72,
        ccTextShadow: "outline",
        ccLineHeight: 1.25,
        ccPos: "bottom",
        ccUppercase: !1,
        ccRadius: 4,
        ccFallbackLangs: "en,en-US,en-GB",
        ccKindPref: "any",
        ccAutoTranslate: !1,
        ccTranslateTo: "",
        ccSkipMusic: !1,
        ccSkipShorts: !1,
        ccRespectManualOff: !1,
        ccReEngageOnPlay: !1,
        ccLetterSpacing: 0,
        autoSkipAdBtn: !1,
        hideBannerAds: !1,
        sponsorblockOn: !0,
        sbPrivacy: !0,
        sbToast: !0,
        sbToastDur: 2200,
        sbSeekbar: !0,
        sbHud: !1,
        sessionRestoreOn: !1,
        sessionResumeMode: "silent",
        sessionResumeDesign: "default",
        fpsCounterOn: !1,
        fpsCounterPos: "tl",
        bufferHealthOn: !1,
        longTaskWarnerOn: !1,
        longTaskWarnerThreshold: 50,
        droppedFrameOn: !1,
        droppedFramePos: "tr",
        droppedFrameShowRate: !1,
        droppedFrameResetOnNav: !1,
        videoStatsOn: !1,
        defaultOriginalAudioOn: !1,
        restoreFsScrollOn: !1,
        removeRedirectUrlsOn: !1,
        shortenShareUrlOn: !1,
        skipPausedContinueOn: !1,
        logoToSubsOn: !1,
        defaultChannelTab: "featured",
        hideTopLiveGamesOn: !1,
        hfrAllowOn: !1,
        autoRecoverOn: !1,
        bgPlayersPauseOn: !1,
        forwardRewindOn: !1,
        forwardRewindSec: 10,
        reversePlaylistOn: !1,
        flipVideoOn: !1,
        flipVideoH: !1,
        flipVideoV: !1,
        screenshotOn: !1,
        screenshotFmt: "png",
        screenshotScale: 1,

        screenshotClipboard: !1,

        forceWatchedOn: !1,

        forceWatchedAccountHistory: !1,
        forceWatchedLocalHistory: !1,
        debugVerbose: !1,
        theaterDefault: !1,
        cinemaMode: !1,
        cinemaOp: 0.85,
        compactUI: !1,
        videoFiltersOn: !1,
        vfBright: 100,
        vfContrast: 100,
        vfSat: 100,
        vfHue: 0,
        vfGray: !1,
        vfFlip: !1,
        vfZoom: 100,

        hideShorts: !1,
        hideShortsRedirect: !1,
        hideShortsDomClean: !1,
        hideShortsApiFilter: !1,

        hideAutoDubbedOn: !1,
        hideAutoDubbedPreferOriginal: !1,
        hideRecs: !1,
        hideComments: !1,
        hideEndscreen: !1,
        hideLivechat: !1,
        hideWatermark: !1,
        hideCards: !1,
        hideMasthead: !1,
        channelBlockerOn: !1,
        channelBlockerList: "",
        channelBlockerHideWatch: !1,
        channelBlockerHideBrowse: !1,
        channelBlockerHideComments: !1,
        channelBlockerMatchTitleText: !1,
        keywordFilterOn: !1,
        keywordFilterList: "",
        geoOverrideOn: !1,
        geoRegion: "US",
        geoLang: "en",
        geoTimezone: "",
        geoPatchFetch: !1,
        geoPatchXHR: !1,
        geoPatchBeacon: !1,
        geoPatchNavigator: !1,
                commentSearchOn: !1,
        blockYTAIOn: !1,
        elementsControlOn: !1,
        elementsControlHidden: {},
        statsOverlay: !1,
        diagConsole: !1,
        sessionReplay: !1,
        apiExplorer: !1,
        apiExplorerMutations: !1,
        adaptiveThrottleOn: !1,
        disableVideoPreviewsOn: !1,
        heroHealOn: !0,
        alwaysShowProgressBar: !1,
        redirectShortsOn: !1,
        autoExpandDescOn: !1,
        disableAutoplayOn: !1,
        playerDashButtonOn: !1,
        autoPauseHiddenOn: !1,
        autoPauseBlurOn: !1,
        autoResumeAutoPausedOn: !1,
        topProgressBarOn: !1,
        copyTimestampButtonOn: !1,
        copyVideoInfoButtonOn: !1,
        openTranscriptButtonOn: !1,
        videoNotesOn: !1,
        channelNotesOn: !1,
        chapterHotkeysOn: !1,
        chapterButtonsOn: !1,
        feedDimWatchedOn: !1,
        feedHideWatchedOn: !1,
        feedWatchedMode: "off",
        autoPauseMode: "off",
        highlightVideoLengthMode: "off",
        numberSearchResultsOn: !1,
        denseVideoGridOn: !1,
        highlightLongVideosOn: !1,
        longVideoMinSec: 1200,
        highlightShortVideosOn: !1,
        shortVideoMaxSec: 60,
        hideLiveContentOn: !1,
        hidePremieresOn: !1,
        playlistAutoscrollOn: !1,
        compactPlaylistOn: !1,
        shortsAutoMuteOn: !1,
        shortsHideCommentsOn: !1,
        collapseLongCommentsOn: !1,
        collapseLongCommentChars: 1200,
        highlightCreatorCommentsOn: !1,
        highlightTimestampLinksOn: !1,
        endSoonWarningOn: !1,
        endSoonSec: 20,
        themeEngineOn: !1,
        themeSelected: "none",
        themeOverhaulOn: !1,
        themeGlassOverhaulOn: !1,
        themeFxReducedMotion: !1,
        dashX: -1,
        dashY: -1,
        dashW: 460,
        dashH: -1,
        netMonitorOn: !1,
        netMonitorRange: "day",
        netMonitorBadge: !1,
        netMonitorPatchFetch: !1,
        netMonitorPatchXHR: !1,
        netMonitorPatchBeacon: !1,
        netBudgetOn: !1,
        netBudgetGB: 50,
        netBudgetAlerted: {},
        netQualityAttribOn: !1,

        sbUserId: "",
        perfProfilerOn: !1,
        stopButtonOn: !1,

        discoverOn: !1,
        screenWakeOn: !1,
                themeGenColor: "#ff3d7f",
        credLayerOn: !1,
        deadLinkOn: !1,
        collectionsOn: !1,
        watchBudgetOn: !1,
        watchBudgetMinutes: 90,
        shortsScheduleOn: !1,
        shortsScheduleMode: "block",
        shortsScheduleStart: "09:00",
        shortsScheduleEnd: "17:00",
        aioPlayerToolsOn: !1,
        aioShortsCleanupOn: !1,
        aioFeedCleanupOn: !1,
        aioCompactDenseOn: !1,
        aioPrivacyShieldOn: !1,
        aioCommentCleanupOn: !1,
        aioPlayerToolsOnEnrolled: !1,
        aioShortsCleanupOnEnrolled: !1,
        aioFeedCleanupOnEnrolled: !1,
        aioCompactDenseOnEnrolled: !1,
        aioPrivacyShieldOnEnrolled: !1,
        aioCommentCleanupOnEnrolled: !1,
        aioPlayerToolsOnEnrolledMembers: "",
        aioShortsCleanupOnEnrolledMembers: "",
        aioFeedCleanupOnEnrolledMembers: "",
        aioCompactDenseOnEnrolledMembers: "",
        aioPrivacyShieldOnEnrolledMembers: "",
        aioCommentCleanupOnEnrolledMembers: "",
        themeCompactOn: !0,

        silenceSkipOn: !1, silenceSkipRate: 4,
        chapterAutoSkipOn: !1, chapterSkipWords: "intro, outro, sponsor,",
        videoBookmarksOn: !1,
        timestampNotesOn: !1,
        pauseRewindOn: !1, pauseRewindSec: 3,
        instantReplayOn: !1, instantReplaySec: 10,
        sleepTimerOn: !1, sleepTimerMin: 30,
        stretchReminderOn: !1, stretchEveryMin: 45,
        intentionLockOn: !1,
        endWindDownOn: !1, windDownSec: 10,
        shortsMarathonOn: !1, shortsMarathonN: 15,
        feedFreshnessOn: !1, feedMaxAgeMonths: 6,
        antiRepeatOn: !1, antiRepeatDays: 14, antiRepeatGraceMin: 30,
        hideLowViewsOn: !1, lowViewThreshold: 1000,
        cardMetaOn: !1, cardMetaVelocity: !0, cardMetaDate: !1,
        searchFillerOff: !1,
        hideCommunityPostsOn: !1,
        hideMixesOn: !1,
        hidePlayerGradientOn: !1,
        hideUpNextOn: !1,
        hideAiAskOn: !1,
        autoExitFullscreenOn: !1,
        wheelControlsOn: !1, wheelVolumeStep: 5, wheelSeekStep: 5,
        volumeBoostOn: !1, volumeBoostPct: 150, volumeBoostPerChannel: !1,
        loudnessLevelOn: !1, loudnessStrength: 2,
        stickyQualityOn: !1,
        widePlayerOn: !1,
        shortsSpeedOn: !1, shortsSpeedDefault: 1, shortsProgressOn: !0,
        returnDislikeOn: !1, returnDislikeBar: !0,
        deArrowOn: !1, deArrowTitles: !0, deArrowThumbs: !1,
        liveChatCleanOn: !1, liveChatHidePaid: !1, liveChatCompact: !1,
        transcriptToolsOn: !1, transcriptTimestamps: !0, transcriptNoScroll: !1,
        notificationCleanOn: !1, notificationHideBadge: !1,
        watchLaterToolsOn: !1, watchLaterHideWatched: !0, watchLaterSortDuration: !0,
        watchStatsOn: !1, watchStatsDays: 30,
        weeklyReportOn: !1,
        randomPickOn: !1, randomPickUnwatched: !0,
        shuffleToolsOn: !1,
        exportDataOn: !1,
        subGroupsOn: !1, subGroupsActive: "",
        uiRestoreOn: !1, uiRestoreSubs: !1, uiRestoreInlineLikes: !1,
        watchTabsOn: !1,
        keymapOn: !1, keymap: {},
        subsOnlyHomeOn: !1, subsOnlyRedirect: !1,
        sortSearchOn: !1, sortSearchBy: "relevance",
        channelSnoozeOn: !1, channelSnoozeList: "",
        dupTitleSpotterOn: !1,
        playlistWatchedMarkerOn: !1,
        commentFilterOn: !1, commentBlockWords: "",
        historyLocalHideOn: !1,
        copyLinkCleanerOn: !1,
        nightSchedulerOn: !1, nightStart: "21:00", nightEnd: "07:00",
        textScaleOn: !1, textScalePct: 115, textScaleScope: "site", storageDashboardOn: !1,
        healthCheckOn: !1,
                frameStepperOn: !1, frameFps: 30,
        playlistResumeOn: !1,
        channelVolumeOn: !1,
        quickCollectionSendOn: !1,
        readerModeOn: !1,
        ytbBreatherOn: !1,
        perfLevelSyncedFor: "",

        algoAutoDislikeOn: !1,
        algoIntelligenceOn: !1,
        algoAutoTrain: !1,
        algoBlockTopics: "",
        algoBlockKeywords: "",
        algoScanInterval: 120,
      },
      c,
    ),
    l = [];
  function p(e, t, a) {

    if (Xt && Xt.perfMode && e === "info") return;
    (l.push({
      t: Date.now(),
      level: e,
      msg: String(t).slice(0, 200),
      data: "error" === e ? a : void 0,
    }),
      l.length > (Xt && Xt.perfMode ? 30 : 60) && l.shift());
    try {
      if ("error" === e) console.error("[YourTube]", t, a || "");
      else if (S.debugVerbose) {
        "warn" === e ? console.warn("[YourTube]", t) : console.log("[YourTube]", t);
      }
    } catch (e) {}
  }

  const g = (() => {
      const e = new Map();
      return {
        on: (t, a) => (
          e.has(t) || e.set(t, new Set()),
          e.get(t).add(a),
          () => g.off(t, a)
        ),
        off(t, a) {
          const n = e.get(t);
          n && n.delete(a);
        },
        emit(t, a) {
          const n = e.get(t);
          if (!n || !n.size) return;
          const r = Array.from(n);
          for (let e = 0; e < r.length; e++)
            try {
              r[e](a);
            } catch (e) {
              m("bus handler error for " + t, e);
            }
        },
      };
    })();
  let f = null;
  function b() {
    return (
      f ||
      ((f = new Promise((e) => {
        let t,
          _settled = !1,
          _stall = 0;
        const _finish = (v, msg, err) => {
          if (_settled) return;
          _settled = !0;
          try { clearTimeout(_stall); } catch (_) {}
          if (msg) h(msg, err);

          if (v === null) f = null;
          e(v);
        };
        try {
          t = indexedDB.open("yourtube_v2", 3);
        } catch (t) {
          return _finish(null, "IDB open threw", t);
        }

        _stall = setTimeout(() => {
          try {
            t.onupgradeneeded = t.onsuccess = t.onerror = t.onblocked = null;
          } catch (_) {}
          _finish(null, "IDB open stalled; skipping IDB for this pass");
        }, 3000);
        ((t.onupgradeneeded = (e) => {
          try {
            const a = t.result,
              n = e.target.transaction;
            let r;
            if (
              (a.objectStoreNames.contains("kv") ||
                a.createObjectStore("kv", { keyPath: "k" }),
              a.objectStoreNames.contains("history"))
            ) {
              if (n) {
                r = n.objectStore("history");
                const e = ["lw", "pinned", "completed", "channelId"],
                  t = new Set(r.indexNames);
                for (const a of e)
                  if (!t.has(a))
                    try {
                      "lw" === a
                        ? r.createIndex("lw", "lastWatched", { unique: !1 })
                        : r.createIndex(a, a, { unique: !1 });
                    } catch (e) {}
              }
            } else
              ((r = a.createObjectStore("history", { keyPath: "videoId" })),
                r.createIndex("lw", "lastWatched", { unique: !1 }),
                r.createIndex("pinned", "pinned", { unique: !1 }),
                r.createIndex("completed", "completed", { unique: !1 }),
                r.createIndex("channelId", "channelId", { unique: !1 }));
            (a.objectStoreNames.contains("replay") ||
                a.createObjectStore("replay", {
                  keyPath: "id",
                  autoIncrement: !0,
                }),
              a.objectStoreNames.contains("thumbCache") ||
                a
                  .createObjectStore("thumbCache", { keyPath: "videoId" })
                  .createIndex("ts", "ts", { unique: !1 }),
              a.objectStoreNames.contains("netBuckets") ||
                a.createObjectStore("netBuckets", { keyPath: "h" }));
          } catch (e) {
            m("IDB upgrade error", e);
          }
        }),
          (t.onsuccess = () => {

            if (_settled) return;
            _settled = !0;
            try { clearTimeout(_stall); } catch (_) {}
            e(t.result);
          }),
          (t.onerror = () => _finish(null, "IDB open failed", t.error)),
          (t.onblocked = () => {

            h("IDB upgrade blocked; continuing without IDB");
            _finish(null);
          }));
      })),
      f)
    );
  }
  function v(e, t) {
    return b().then((a) =>
      a
        ? new Promise((n) => {
            try {
              const r = a.transaction(e, "readonly").objectStore(e).get(t);
              ((r.onsuccess = () => n(r.result)), (r.onerror = () => n(null)));
            } catch (e) {
              n(null);
            }
          })
        : null,
    );
  }
  function k(e, t) {
    return b().then((a) =>
      a
        ? new Promise((n) => {
            try {
              const r = a.transaction(e, "readwrite");
              (r.objectStore(e).put(t),
                (r.oncomplete = () => n()),
                (r.onerror = () => n()));
            } catch (e) {
              n();
            }
          })
        : null,
    );
  }
  function x(e, t) {
    return b().then((a) =>
      a
        ? new Promise((n) => {
            try {
              const r = a.transaction(e, "readwrite");
              (r.objectStore(e).delete(t),
                (r.oncomplete = () => n()),
                (r.onerror = () => n()));
            } catch (e) {
              n();
            }
          })
        : null,
    );
  }
  function w(e, t, a) {
    return b().then((n) =>
      n
        ? new Promise((r) => {
            try {
              const o = n.transaction(e, "readonly").objectStore(e);
              if (!t && !a && "function" == typeof o.getAll) {
                const e = o.getAll();
                return (
                  (e.onsuccess = () => r(e.result || [])),
                  void (e.onerror = () => r([]))
                );
              }
              if (
                t &&
                (void 0 === a || "next" === a) &&
                "function" == typeof o.index(t).getAll
              ) {
                const e = o.index(t).getAll();
                return (
                  (e.onsuccess = () => r(e.result || [])),
                  void (e.onerror = () => r([]))
                );
              }
              const i = t
                  ? o.index(t).openCursor(null, a || "next")
                  : o.openCursor(),
                d = [];
              ((i.onsuccess = (e) => {
                const t = e.target.result;
                t ? (d.push(t.value), t.continue()) : r(d);
              }),
                (i.onerror = () => r([])));
            } catch (e) {
              r([]);
            }
          })
        : [],
    );
  }
  function C(e) {
    return b().then((t) =>
      t
        ? new Promise((a) => {
            try {
              const n = t.transaction(e, "readwrite");
              (n.objectStore(e).clear(),
                (n.oncomplete = () => a()),
                (n.onerror = () => a()));
            } catch (e) {
              a();
            }
          })
        : null,
    );
  }
  let S = Object.assign({}, s),
    _bootTouched = new Map(),
    T = !1,
    O = 0,
    M = !1,
    L = null,
    A = 0;
  const E = ["darkTweaks"],
    B = "yourtube.cfg",
    P = "yourtube.cfg",
    I = "__cfg__";
  let R = null,
    N = !1,
    _ = null,
    H = !1;
  // Cross-tab convergence state (v1.6.0):
  //  _cfgTs: timestamp of the last snapshot this tab adopted/saved.
  //  _localEdits: keys changed locally (until echoed back by a remote snapshot),
  //    stamped for expiry — they win same-version collisions so two tabs editing
  //    different keys in the same debounce window never silently lose one side.
  let _cfgTs = 0;
  const _localEdits = new Map();
  const _LOCAL_EDIT_TTL = 1800e3;
  function D(e) {
    if (!e || "object" != typeof e) return {};
    const t = {};

    for (const [a, n] of Object.entries(s)) {
      if (a === "__proto__" || a === "constructor" || a === "prototype") continue;
      if (!(a in e)) continue;
      const r = e[a],
        o = typeof n;
      if (null == n) t[a] = r;
      else if ("boolean" === o) t[a] = "boolean" == typeof r ? r : !!r;
      else if ("number" === o) {
        if (r === "" || r == null) {
        t[a] = n;
        } else {
        const e = Number(r);
        t[a] = isFinite(e) ? e : n;
        }
      } else
        t[a] =
          "string" === o
            ? "string" == typeof r
              ? r
              : String(r ?? "")
            : "object" === o
              ? r && "object" == typeof r
                ? r
                : n
              : r;
    }
    return t;
  }
  function _ytSanitizeHistoryRow(e) {
    const row = Object.assign({}, e);
    if (typeof row.title === "string") row.title = row.title.slice(0, 300);
    if (typeof row.channel === "string") row.channel = row.channel.slice(0, 200);
    for (const k of ["duration", "lastPosition", "progress", "lastWatched", "totalWatchTime"]) {
      const n = Number(row[k]);
      row[k] = isFinite(n) ? n : 0;
    }
    return row;
  }
  function q() {
    try {
      const e = GM_getValue(P, null);
      if (!e) return null;
      const t = "string" == typeof e ? JSON.parse(e) : e;
      return t && "object" == typeof t ? t : null;
    } catch (e) {
      return null;
    }
  }
  function V() {
    try {
      const e =
        "undefined" != typeof localStorage ? localStorage.getItem(B) : null;
      if (!e) return null;
      const t = JSON.parse(e);
      return t && "object" == typeof t ? t : null;
    } catch (e) {
      return null;
    }
  }
  function F(e) {
    return e.length
      ? (e.sort((e, t) => {
          const a = (t.ver || 0) - (e.ver || 0);
          return 0 !== a ? a : (t.ts || 0) - (e.ts || 0);
        }),
        e[0])
      : null;
  }
  function j(e) {
    const t = D(e),
      a = (function (e) {
        if (!e || "object" != typeof e) return e;
        if (
          (null == e.feedWatchedMode &&
            (e.feedHideWatchedOn
              ? (e.feedWatchedMode = "hide")
              : e.feedDimWatchedOn
                ? (e.feedWatchedMode = "dim")
                : (e.feedWatchedMode = "off")),
          null == e.autoPauseMode)
        ) {
          const t = !!e.autoPauseHiddenOn,
            a = !!e.autoPauseBlurOn;
          e.autoPauseMode = t && a ? "both" : t ? "hidden" : a ? "blur" : "off";
        }
        if (null == e.highlightVideoLengthMode) {
          const t = !!e.highlightLongVideosOn,
            a = !!e.highlightShortVideosOn;
          e.highlightVideoLengthMode =
            t && a ? "both" : t ? "long" : a ? "short" : "off";
        }
        return e;
      })(Object.assign({}, t));
    ((S = Object.assign({}, s, a)),
      (S.feedDimWatchedOn = "dim" === S.feedWatchedMode),
      (S.feedHideWatchedOn = "hide" === S.feedWatchedMode),
      (S.autoPauseHiddenOn =
        "hidden" === S.autoPauseMode || "both" === S.autoPauseMode),
      (S.autoPauseBlurOn =
        "blur" === S.autoPauseMode || "both" === S.autoPauseMode),
      (S.highlightLongVideosOn =
        "long" === S.highlightVideoLengthMode ||
        "both" === S.highlightVideoLengthMode),
      (S.highlightShortVideosOn =
        "short" === S.highlightVideoLengthMode ||
        "both" === S.highlightVideoLengthMode));
    for (const e of E) delete S[e];
  }

  const _GITHUB_RELEASES = "https://github.com/mheci/YourTube/releases";
  const _GITHUB_LATEST_USERJS =
    "https://github.com/mheci/YourTube/releases/latest/download/yourtube.user.js";

  const _GITHUB_LATEST_META =
    "https://github.com/mheci/YourTube/releases/latest/download/yourtube.meta.js";
  const _CHECK_CACHE_KEY = "yourtube_update_check_ts";
  const _CHECK_SEEN_KEY = "yourtube_update_seen_tag";
  const _CHECK_FAILS_KEY = "yourtube_update_fails";
  const _CHECK_BACKOFF_KEY = "yourtube_update_backoff_until";

  function Fu(force) {
    // Safe mode (Maximum privacy preset) means no script-initiated third-party
    // calls, including the update check.
    try {
      if (S.safeMode) {
        if (force) pe("Update check is off in Maximum privacy mode.", 2600, "info");
        return;
      }
    } catch (_) {}

    const installed = (() => {
      try { return (GM_info && GM_info.script && String(GM_info.script.version)) || "0.0.0"; }
      catch (_) { return "0.0.0"; }
    })();

    const _SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z][0-9A-Za-z.-]*))?(?:\+[0-9A-Za-z.-]+)?$/;
    const a = (v) => {
      const m = _SEMVER_RE.exec(String(v == null ? "" : v).trim().replace(/^v/i, ""));
      if (!m) return null;
      return { nums: [Number(m[1]), Number(m[2]), Number(m[3])], pre: m[4] || "" };
    };

    const o = (x, y) => {
      const A = (x && typeof x === "object" && x.nums) ? x : a(x);
      const B = (y && typeof y === "object" && y.nums) ? y : a(y);
      if (!A || !B) return 0;
      for (let i = 0; i < 3; i++) {
        if (A.nums[i] !== B.nums[i]) return A.nums[i] < B.nums[i] ? -1 : 1;
      }

      if (A.pre && !B.pre) return -1;
      if (!A.pre && B.pre) return 1;
      if (A.pre && B.pre && A.pre !== B.pre) return A.pre < B.pre ? -1 : 1;
      return 0;
    };

    const showUpdateAvailable = (latestTag, installUrl) => {
      pe("YourTube " + latestTag + " available (you have " + installed + ")", 4000, "info");
      try {

        const b = document.createElement("div");
        b.id = "ytb-update-banner";
        b.style.cssText =
          "position:fixed;right:12px;top:60px;z-index:2147483640;background:linear-gradient(135deg,#ff0033,#ff3d7f);color:#fff;padding:10px 14px;border-radius:10px;font:600 12px/1.35 system-ui;box-shadow:0 8px 24px rgba(255,0,51,.4);max-width:300px;display:flex;align-items:center;gap:10px;cursor:pointer";
        const _upArrow = document.createElement("span");
        _upArrow.style.cssText = "font-size:18px";
        _upArrow.textContent = "\u2191";
        const _upMsg = document.createElement("span");
        _upMsg.style.cssText = "flex:1";
        _upMsg.appendChild(document.createTextNode("YourTube v"));
        const _upTag = document.createElement("b");
        _upTag.textContent = String(latestTag);
        _upMsg.appendChild(_upTag);
        _upMsg.appendChild(document.createTextNode(" available"));
        b.appendChild(_upArrow);
        b.appendChild(_upMsg);
        b.title = "Click to install the new version";
        b.addEventListener("click", () => {
          try { window.open(installUrl, "_blank", "noopener"); } catch (e) {}
        });

        const old = document.getElementById("ytb-update-banner");
        old && old.remove();
        document.body && document.body.appendChild(b);

        setTimeout(() => {
          const el = document.getElementById("ytb-update-banner");
          el && el.remove();
        }, 60000);
      } catch (e) {}
    };

    const showUpToDate = (latestTag) => {
      try {
        e.__yourtubeLastSeenLatest = String(latestTag || "");
      } catch (_) {}
      pe(
        "YourTube v" + installed + " is up to date" + (force ? "" : "."),
        4000,
        "success",
      );

      try {
        const t = document.getElementById("ytb-toast");
        if (t) {
          t.style.cursor = "pointer";
          t.title = "Open the YourTube releases page";
          pe_bindClick(() => {
            try { window.open(_GITHUB_RELEASES, "_blank", "noopener"); } catch (_) {}
          });
        }
      } catch (_) {}
    };

    const showCheckFailed = (errMsg) => {
      pe(
        "Update check failed: " + (errMsg || "network error") + " (click to retry)",
        4000,
        "error",
      );
      try {
        const t = document.getElementById("ytb-toast");
        if (t) {
          t.style.cursor = "pointer";
          t.title = "Click to retry the update check";
          pe_bindClick(() => {

            try { Fu(true); } catch (_) {}
          });
        }
      } catch (_) {}
    };
    const onDone = (ok, payload, errMsg) => {
      if (!ok) {

        try {
          const fails = (Number(GM_getValue && GM_getValue(_CHECK_FAILS_KEY, 0)) || 0) + 1;
          GM_setValue && GM_setValue(_CHECK_FAILS_KEY, fails);
          GM_setValue && GM_setValue(_CHECK_BACKOFF_KEY, Date.now() + Math.min(24, fails) * 3600e3);
        } catch (_) {}
        showCheckFailed(errMsg);
        return;
      }
      try {
        GM_setValue && GM_setValue(_CHECK_FAILS_KEY, 0);
        GM_setValue && GM_setValue(_CHECK_BACKOFF_KEY, 0);
      } catch (_) {}
      try {

        const m = /@version\s+(\S+)/.exec(String(payload || ""));
        if (m && m[1]) {
          const latestTag = m[1].replace(/^v/i, "");
          if (!a(latestTag)) {

            force && showCheckFailed("bad version string");
            return;
          }
          try {
            GM_setValue && GM_setValue(_CHECK_CACHE_KEY, Date.now());
            GM_setValue && GM_setValue("yourtube_latest_release", JSON.stringify({ tag: latestTag, ts: Date.now() }));
          } catch (_) {}
          if (o(latestTag, installed) > 0) {

            let seen = "";
            try { seen = String(GM_getValue && GM_getValue(_CHECK_SEEN_KEY, "")); } catch (_) {}
            if (seen !== latestTag) {
              try { GM_setValue && GM_setValue(_CHECK_SEEN_KEY, latestTag); } catch (_) {}
              showUpdateAvailable(latestTag, _GITHUB_LATEST_USERJS);
            }
          } else {
            force && showUpToDate(latestTag);
          }
          return;
        }
        force && showCheckFailed("no release found");
      } catch (_) {
        force && showCheckFailed("bad response");
      }
    };
    try {
      if (force) pe("Checking for updates...", 1800, "info");

      const now = Date.now();
      if (!force) {
        try { if (S.updateCheckOn === false) return; } catch (_) {}

        const last = Number(GM_getValue && GM_getValue(_CHECK_CACHE_KEY, 0)) || 0;
        const hours = Math.min(168, Math.max(6, Number(S.updateCheckHours) || 24));
        const jitter = Math.floor(Math.random() * 40 - 20) * 60000;
        if (now - last < hours * 3600e3 + jitter) return;
        const backoff = Number(GM_getValue && GM_getValue(_CHECK_BACKOFF_KEY, 0)) || 0;
        if (now < backoff) return;
      }
      if (typeof GM_xmlhttpRequest === "function") {
        GM_xmlhttpRequest({
          method: "GET",
          url: _GITHUB_LATEST_META,
          timeout: 15000,
          onload: (r) => onDone(r && r.status >= 200 && r.status < 300, r && r.responseText, r && r.statusText),
          onerror: (r) => onDone(false, null, (r && r.error) || "network error"),
          ontimeout: () => onDone(false, null, "timeout"),
        });
      } else if (typeof fetch === "function") {
        fetch(_GITHUB_LATEST_META)
          .then((r) => r.ok ? r.text() : Promise.reject(new Error("HTTP " + r.status)))
          .then((t) => onDone(true, t))
          .catch((e2) => onDone(false, null, e2 && e2.message));
      } else {
        force && pe("Update check unavailable (no HTTP API).", 2200, "info");
      }
    } catch (e2) {
      force && pe("Update check failed: " + (e2 && e2.message), 3000, "error");
    }
  }
  function z() {
    const e = [],
      t = q();
    t && e.push({ ts: t.__ts || 0, ver: t.__ver || 0, data: t });
    const a = V();
    a && e.push({ ts: a.__ts || 0, ver: a.__ver || 0, data: a });
    const n = F(e);
    if (n) {
      A = n.ver || 0;
      _cfgTs = Math.max(_cfgTs, n.ts || 0);
      const e = Object.assign({}, n.data);
      (delete e.__ts, delete e.__ver, j(e));
    }
    return ((T = !0), !!n);
  }
  function W(e, t, ts) {
    const a = ts || Date.now(),
      n = Object.assign({}, e, { __ts: a, __ver: t }),
      r = JSON.stringify(n);
    _cfgTs = Math.max(_cfgTs, a);
    try {
      GM_setValue(P, r);
    } catch (e) {}
    try {
      "undefined" != typeof localStorage &&
        ((N = !0), localStorage.setItem(B, r), (N = !1));
    } catch (n) {
      if (((N = !1), n && "QuotaExceededError" === n.name)) {
        h("localStorage quota exceeded - skipping the localStorage mirror (GM and IDB keep the full config)");
      }
    }
  }
  function U() {
    (A++, _ || (_ = {}));
    for (const e in _) e in S || delete _[e];
    (Object.assign(_, S),
      W(_, A),
      (L = { obj: _, ver: A }),
      K(),
      (function () {
        try {
          R &&
            ((H = !0),
            R.postMessage({ type: "cfg_update", ver: A, ts: Date.now() }),
            setTimeout(() => {
              H = !1;
            }, 50));
        } catch (e) {
          H = !1;
        }
      })(),
      g.emit("cfg.saved"));
  }
  function K() {
    if (M || !L) return;
    const { obj: e, ver: t } = L;
    ((L = null),
      (M = !0),
      Promise.resolve()
        .then(() => k("kv", { k: I, v: e, ver: t, updatedAt: Date.now() }))
        .catch((e) => h("cfg IDB persist failed", e))
        .finally(() => {
          ((M = !1), L && K());
        }));
  }
  function Y() {
    const delay = (typeof Xt !== "undefined" && Xt.perfMode) || (typeof S !== "undefined" && S.perfModeOn) ? 1200 : 600;
    T && (clearTimeout(O), (O = setTimeout(U, delay)));
  }
  function G() {
    T && (clearTimeout(O), (O = 0), U());
  }
  function _cfgCanon(e) {
    // Deterministic serialization (sorted keys) for payload identity checks.
    const ks = Object.keys(e).sort();
    let s = "{";
    for (let i = 0; i < ks.length; i++) {
      const k = ks[i];
      if (k === "__ts" || k === "__ver") continue;
      if (s.length > 1) s += ",";
      s += JSON.stringify(k) + ":" + JSON.stringify(e[k]);
    }
    return s + "}";
  }
  let _nudgeWindowStart = 0,
    _nudgeCount = 0;
  function X() {
    const e = [],
      t = q();
    t && e.push({ ts: t.__ts || 0, ver: t.__ver || 0, data: t });
    const a = V();
    a && e.push({ ts: a.__ts || 0, ver: a.__ver || 0, data: a });
    const n = F(e);
    if (!n) return;
    const r = n.ver || 0,
      itsTs = n.ts || 0;
    if (r < A) return;
    const sameVer = r === A;
    let resurrect = null;
    if (sameVer) {
      // Same logical version: only accept payloads we can ORDER deterministically.
      // Newer writer wins by (ver, ts); exact tie falls back to the lexically
      // greater canonical payload — every tab computes the same winner.
      if (itsTs > _cfgTs) {
        // newer timestamp, adopt below
      } else if (itsTs === _cfgTs && _cfgCanon(n.data) > _cfgCanon(S)) {
        // ts tie: lexical winner
      } else return;
      // On a same-version collision, locally-edited keys the remote snapshot
      // never saw must survive. Collect them now, re-assert after the adopt,
      // then rebroadcast at A+1 so the other tab converges to the union.
      try {
        const now = Date.now();
        resurrect = [];
        for (const [k, ts0] of _localEdits) {
          if (now - ts0 > _LOCAL_EDIT_TTL) { _localEdits.delete(k); continue; }
          if (n.data[k] !== S[k]) {
            if (_FORBIDDEN_CFG_KEYS[k]) continue;
            // Concede the race: edits made BEFORE the winning snapshot's
            // timestamp lose on the deterministic (ver, ts) ordering — the
            // other tab had every chance to observe them. Only edits newer
            // than that snapshot were truly unseen and get resurrected.
            if (ts0 > itsTs) resurrect.push(k);
          } else _localEdits.delete(k);
        }
      } catch (e) {}
    } else if (r > A) {
      // Strictly newer snapshot: still keep un-echoed local edits (a tab that
      // edited before this sync landed should not lose its work).
      try {
        const now = Date.now();
        resurrect = [];
        for (const [k, ts0] of _localEdits) {
          if (now - ts0 > _LOCAL_EDIT_TTL) { _localEdits.delete(k); continue; }
          if (n.data[k] === S[k]) { _localEdits.delete(k); continue; }
          if (_FORBIDDEN_CFG_KEYS[k]) continue;
          if (ts0 > itsTs) resurrect.push(k);
        }
      } catch (e) {}
      if (!resurrect || !resurrect.length) resurrect = null;
    }
    // Keys edited in this tab but not yet flushed: the remote snapshot would
    // silently drop them, so re-apply them after it lands.
    let pendingKeys = null;
    try {
      if (O) {
        const stored = q();
        if (stored && typeof stored === "object") {
          pendingKeys = [];
          for (const k of Object.keys(S)) if (k !== "__ts" && k !== "__ver" && S[k] !== stored[k]) pendingKeys.push(k);
          for (const k of Object.keys(stored)) if (k !== "__ts" && k !== "__ver" && !(k in S)) pendingKeys.push(k);
        }
      }
    } catch (e) {}
    const o = Object.assign({}, S),
      i = Object.assign({}, n.data);
    (delete i.__ts, delete i.__ver, j(i));
    if (resurrect && resurrect.length) {
      for (const k of resurrect) if (k in o) S[k] = o[k];
    }
    if (pendingKeys && pendingKeys.length) {
      for (const k of pendingKeys) S[k] = o[k];
    }
    A = n.ver || r;
    _cfgTs = Math.max(_cfgTs, itsTs);
    const d = new Set();
    for (const e of Object.keys(S)) S[e] !== o[e] && d.add(e);
    for (const e of Object.keys(o)) e in S || d.add(e);
    // Convergence rebroadcast: a same-version collision we won with resurrected
    // keys must be re-saved so the losing tab adopts the union (bounded).
    if (sameVer && resurrect && resurrect.length && T) {
      const now = Date.now();
      if (now - _nudgeWindowStart > 60e3) { _nudgeWindowStart = now; _nudgeCount = 0; }
      if (_nudgeCount < 4) {
        _nudgeCount++;
        setTimeout(() => { try { if (!(A > n.ver)) A = (n.ver || 0) + 1; U(); } catch (e) {} }, 80);
      }
    }
    if (!d.size) return;
    (u("Cross-tab sync: " + d.size + " keys updated (v" + A + ")"),
      d.has("silentToasts") && ue());
    const c = new Set();
    for (const e of d) {
      const t = ka.get(e);
      if (t) for (const e of t) c.add(e.id);
    }
    queueMicrotask(() => {
      for (const e of c) xa.apply(e);
      for (const e of d) g.emit("cfg.changed", { key: e, val: S[e] });
    });
  }
  let Z = new AbortController();

  function Q() {
    try {
      Z.abort();
    } catch (er) {}

    try {
      if (typeof Ma !== "undefined" && Ma) {
        Ma.awaitingResume = !1;
        Ma.awaitingResumeVid = null;
      }
    } catch (er) {}

    try { Ze(); } catch (er) {}
    try { Qe(); } catch (er) {}
    try {
      // The resume gate must not stay installed after the feature is reset.
      if (window.__ytbRealPlay && HTMLMediaElement.prototype.play !== window.__ytbRealPlay) {
        HTMLMediaElement.prototype.play = window.__ytbRealPlay;
      }
      Je._playGate = !1;
    } catch (er) {}
    try { _fwDisarm(); } catch (er) {}
    Z = new AbortController();
    oe.vid = void 0;
    oe.title = void 0;
    oe.ch = void 0;
    oe.titleT = 0;
    oe.chT = 0;
    if (da) da.clear();
  }


  let _ytEarlyNavArmed = false;

  let _ytHistPatched = false;
  let _ytNavPollTimer = 0;
  const _ytNav = {
    committedHref: location.href,
    pending: false,
    initialDone: false,
    timer: 0,
    gen: 0,
  };
  function _ytNavClearTimer() {
    if (_ytNav.timer) {
      try { clearTimeout(_ytNav.timer); } catch (er) {}
      _ytNav.timer = 0;
    }
  }
  function _ytNavCommit(source) {
    _ytNavClearTimer();
    _ytNav.pending = false;
    _ytNav.committedHref = location.href;
    try {

      const log = (window.___yourtubeNavLog = window.___yourtubeNavLog || []);
      log.push({ t: Date.now(), source: source || "nav", url: location.href });
      if (log.length > 40) log.shift();
    } catch (er) {}
    try { g.emit("nav.changed", { url: location.href, source: source || "nav" }); } catch (er) {}
  }

  function _ytNavMarkSettled() {
    _ytNavClearTimer();
    _ytNav.pending = false;
    _ytNav.initialDone = true;
    _ytNav.committedHref = location.href;
  }
  function _ytNavSignal(kind) {
    const href = location.href;
    if (kind === "start") {

      if (!_ytNav.pending) {
        _ytNav.pending = true;
        _ytNav.gen++;
        try { Q(); } catch (er) {}

        _ytNavClearTimer();
        _ytNav.timer = setTimeout(function () {
          _ytNav.timer = 0;
          if (_ytNav.pending) {
            try { u("nav: finish event missing — fallback commit"); } catch (er) {}
            _ytNavCommit("fallback");
          }
        }, 3000);
      }
      return;
    }
    if (kind === "finish") {
      if (!_ytNav.initialDone) {

        _ytNav.initialDone = true;
        if (!_ytNav.pending) { try { Q(); } catch (er) {} }
        _ytNavCommit("initial");
        return;
      }
      if (_ytNav.pending || href !== _ytNav.committedHref) {
        if (href !== _ytNav.committedHref && !_ytNav.pending) { try { Q(); } catch (er) {} }
        _ytNavCommit("yt-navigate-finish");
      }
      return;
    }
    if (kind === "data") {

      if (_ytNav.pending) { _ytNavCommit("page-data"); return; }
      if (href !== _ytNav.committedHref && !_ytNav.initialDone) {
        _ytNav.initialDone = true;
        try { Q(); } catch (er) {}
        _ytNavCommit("initial");
      }
      return;
    }

    if (href !== _ytNav.committedHref && !_ytNav.pending) {
      try { Q(); } catch (er) {}
      _ytNav.pending = true;
      _ytNav.gen++;
      _ytNavClearTimer();
      _ytNav.timer = setTimeout(function () {
        _ytNav.timer = 0;
        if (_ytNav.pending) _ytNavCommit(kind);
      }, 60);
    }
  }
  try {
    if (!_ytEarlyNavArmed) {
      _ytEarlyNavArmed = true;

      try {
        const _wrapHistory = function (orig, kind) {

          return _xp.fn(function () {
            const r = orig.apply(this, arguments);
            try { if (location.href !== _ytNav.committedHref) _ytNavSignal(kind); } catch (er) {}
            return r;
          });
        };
        if (!_ytHistPatched) {
          if (History.prototype.pushState) {
            History.prototype.pushState = _wrapHistory(History.prototype.pushState, "pushState");
          }
          if (History.prototype.replaceState) {
            History.prototype.replaceState = _wrapHistory(History.prototype.replaceState, "replaceState");
          }
          _ytHistPatched = true;
        }
      } catch (er) {}

      try {
        document.addEventListener("yt-navigate-finish", function () { try { _ytNavSignal("finish"); } catch (er) {} }, true);
        document.addEventListener("yt-navigate-start", function () { try { _ytNavSignal("start"); } catch (er) {} }, true);
        document.addEventListener("yt-page-data-updated", function () { try { _ytNavSignal("data"); } catch (er) {} }, true);
      } catch (er) {}
      try { window.addEventListener("popstate", function () { try { _ytNavSignal("popstate"); } catch (er) {} }, true); } catch (er) {}

      try {
        if (!_ytNavPollTimer) {
          _ytNavPollTimer = setInterval(function () {
            try {
              if (typeof document !== "undefined" && document.hidden) return;
              if (location.href !== _ytNav.committedHref) _ytNavSignal("poll");
            } catch (er) {}
          }, 500);
        }
      } catch (er) {}
    }
  } catch (er) {}
  function $(e, t) {

    let a,
      n = 0,
      r = null;
    return function (...o) {
      a = o;
      const i = performance.now(),
        d = t - (i - n);
      d <= 0
        ? ((n = i), e.apply(this, o))
        : r ||
          (r = setTimeout(() => {
            ((n = performance.now()), (r = null), e.apply(this, a));
          }, d));
    };
  }
  function ee(e, t) {
    let a,
      n = null;
    return function (...r) {
      ((a = r),
        clearTimeout(n),
        (n = setTimeout(() => {
          ((n = null), e.apply(this, a));
        }, t)));
    };
  }
  const te = "function" == typeof e.requestIdleCallback;
  function ae(t, a) {
    if (te)
      try {
        return e.requestIdleCallback(t, { timeout: a || 1500 });
      } catch (e) {}
    return setTimeout(t, 1);
  }
  function ne() {
    return new Promise((t) => {
      if (void 0 !== e.scheduler && e.scheduler.postTask)
        try {
          return void e.scheduler.postTask(t, { priority: "user-blocking" });
        } catch (e) {}
      setTimeout(t, 0);
    });
  }
  function re() {
    const e = new Map();
    return function (t, a) {
      if (e.has(t)) return e.get(t);
      const n = Promise.resolve()
        .then(a)
        .finally(() => e.delete(t));
      return (e.set(t, n), n);
    };
  }

