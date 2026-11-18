    const oe = {
      vid: void 0,
      vidHref: "",
      title: void 0,
      titleT: 0,
      ch: void 0,
      chT: 0,
    },
    yttrusted = !1;
  let _ttpInit = !1, _ttp = null;
  function Xy(html) {
    if (!_ttpInit) {
      _ttpInit = !0;
      try {
        _ttp = (window.trustedTypes && window.trustedTypes.createPolicy("yourtube", { createHTML: (x) => String(x) })) || !1;
      } catch (e) {
        _ttp = !1;
      }
    }
    return _ttp && _ttp.createHTML ? _ttp.createHTML(html) : html;
  }
  const ie = {
      el: () =>
        (location.pathname.startsWith("/shorts/") && document.querySelector("ytd-reel-video-renderer[is-active] video,ytd-reel-video-renderer[active] video")) ||
        document.querySelector("video.html5-main-video") ||
        document.querySelector("#movie_player video") ||
        document.querySelector("video"),
      api: () => (location.pathname.startsWith("/shorts/") && ie.el()?.closest(".html5-video-player,#movie_player")) || document.querySelector("#movie_player"),
      isReady: () => !(!ie.el() || !ie.api()),
      videoId() {
        if (void 0 !== oe.vid && oe.vidHref === location.href) return oe.vid;

        let id = null;
        try {
          const u = new URL(location.href);
          id = u.searchParams.get("v");
          if (!id) {
            const pm = u.pathname.match(
              /^\/(?:shorts|live|embed|v|e)\/([A-Za-z0-9_-]{6,})/,
            );
            if (pm) id = pm[1];
            else if (/(^|\.)youtu\.be$/.test(u.hostname)) {
              const sm = u.pathname.match(/^\/([A-Za-z0-9_-]{6,})/);
              if (sm) id = sm[1];
            }
          }
          if (id) id = decodeURIComponent(id);
        } catch (er) {
          const q = location.href.match(/[?&]v=([^&#]+)/);
          id = q ? q[1] : null;
        }
        return ((oe.vid = id), (oe.vidHref = location.href), oe.vid);
      },
      title() {
        const t = performance.now();
        if (void 0 !== oe.title && "" !== oe.title && t - oe.titleT < 1e3)
          return oe.title;
        let a = "";
        const n =
          ca("h1.ytd-watch-metadata yt-formatted-string", 1e3) ||
          ca("h1.title yt-formatted-string", 1e3) ||
          ca("h1.title", 1e3) ||
          ca("#title h1", 1e3);
        if ((n && n.textContent && (a = n.textContent.trim()), !a))
          try {
            const t = e.ytInitialPlayerResponse;
            t &&
              t.videoDetails &&
              t.videoDetails.title &&
              (a = String(t.videoDetails.title).trim());
          } catch (e) {}
        if (!a)
          try {
            const e = document.querySelector(
              'meta[property="og:title"], meta[name="title"]',
            );
            e && (a = (e.getAttribute("content") || "").trim());
          } catch (e) {}
        return (
          a || (a = (document.title || "").replace(/ - YouTube$/, "").trim()),
          (oe.title = a),
          (oe.titleT = t),
          a
        );
      },
      channel() {
        const t = performance.now();
        if (void 0 !== oe.ch && "" !== oe.ch && t - oe.chT < 1e3) return oe.ch;
        let a = "";
        const n =
          ca("ytd-video-owner-renderer ytd-channel-name a", 1e3) ||
          ca("ytd-video-owner-renderer #channel-name a", 1e3) ||
          ca("#owner #channel-name a", 1e3) ||
          ca("#owner-name a", 1e3) ||
          ca("ytd-channel-name a", 1e3) ||
          ca("#channel-name a", 1e3);
        if ((n && n.textContent && (a = n.textContent.trim()), !a))
          try {
            const t = e.ytInitialPlayerResponse;
            t &&
              t.videoDetails &&
              t.videoDetails.author &&
              (a = String(t.videoDetails.author).trim());
          } catch (e) {}
        if (!a)
          try {
            const e = document.querySelector(
              'meta[itemprop="author"], link[itemprop="name"]',
            );
            e &&
              (a = (
                e.getAttribute("content") ||
                e.getAttribute("name") ||
                ""
              ).trim());
          } catch (e) {}
        return ((oe.ch = a), (oe.chT = t), a);
      },
      thumb: (e, t) =>
        e
          ? "https://i.ytimg.com/vi/" + e + "/" + (t || "mqdefault") + ".jpg"
          : "",
      thumbCandidates: (e) =>
        e
          ? [
              "https://i.ytimg.com/vi/" + e + "/maxresdefault.jpg",
              "https://i.ytimg.com/vi/" + e + "/sddefault.jpg",
              "https://i.ytimg.com/vi/" + e + "/hqdefault.jpg",
              "https://i.ytimg.com/vi/" + e + "/mqdefault.jpg",
              "https://i.ytimg.com/vi/" + e + "/default.jpg",
            ]
          : [],
      play() {
        const e = ie.el();
        e && e.play().catch(() => {});
      },
      pause() {
        const e = ie.el();
        e && e.pause();
      },
      seek(e) {
        const t = ie.el();
        t && (t.currentTime = e);
      },
      rate(e) {
        const t = ie.el();
        t && (t.playbackRate = e);
      },
      setQuality(e) {
        const t = ie.api();
        if (t && t.setPlaybackQualityRange)
          try {
            t.setPlaybackQualityRange(e, e);
          } catch (e) {}
        if (t && t.setPlaybackQuality)
          try {
            t.setPlaybackQuality(e);
          } catch (e) {}
      },
      levels() {
        const e = ie.api();
        return e && e.getAvailableQualityLevels
          ? e.getAvailableQualityLevels()
          : [];
      },
      currentQuality() {
        try {
          const p = ie.api();
          return p && typeof p.getPlaybackQuality === "function"
            ? String(p.getPlaybackQuality() || "")
            : "";
        } catch (_) { return ""; }
      },
      qualityTarget(want) {
        const wanted = String(want || "") === "highres" ? "hd2160" : String(want || "");
        if (!wanted || wanted === "auto") return "";
        const levels = ie.levels().filter((level) => level && level !== "auto");
        if (!levels.length) return "";
        const pairs = levels.map((label, index) => ({
          label,
          index,
          norm: label === "highres" ? "hd2160" : label,
        }));
        const exact = pairs.find((pair) => pair.norm === wanted);
        if (exact) return exact.label;
        const rank = ["hd2160", "hd1440", "hd1080", "hd720", "large", "medium", "small", "tiny"];
        const wantIndex = rank.indexOf(wanted);
        if (wantIndex < 0) return levels[0];
        const ordered = pairs
          .filter((pair) => rank.indexOf(pair.norm) >= 0)
          .sort((a, b) => rank.indexOf(a.norm) - rank.indexOf(b.norm));
        const atOrBelow = ordered.find((pair) => rank.indexOf(pair.norm) >= wantIndex);
        return (atOrBelow || ordered[0] || pairs[0]).label;
      },
      isAd: () => !!document.querySelector(".ad-showing,.ad-interrupting"),
    },

    de = new YourTubeResources.BoundedCache(512, "time-format");
  // History thumbnails are imported data: only YouTube's image host or local image URLs may load.
  const _safeThumbRe = /^(?:https:\/\/i\.ytimg\.com\/vi\/[A-Za-z0-9_-]{11}\/|data:image\/|blob:)/i;
  function sanitizeUrlForCSS(url) {
    if (!url || typeof url !== "string") return "";
    try {

      const trimmed = url.trim();
      if (_safeThumbRe.test(trimmed)) {

        return trimmed.replace(/['"\\()\n\r]/g, "");
      }
      return "";
    } catch (_) { return ""; }
  }
  function ft() {

    try {
      let hud = document.getElementById("ytb-sb-hud");
      if (!hud) {
        hud = document.createElement("div");
        (hud.id = "ytb-sb-hud"),
          (hud.style.position = "fixed"),
          (hud.style.bottom = "64px"),
          (hud.style.right = "14px"),
          (hud.style.zIndex = "2147483000"),
          (hud.style.background = "rgba(18,20,26,.92)"),
          (hud.style.color = "#eef"),
          (hud.style.padding = "6px 10px"),
          (hud.style.borderRadius = "8px"),
          (hud.style.border = "1px solid rgba(255,255,255,.14)"),
          (hud.style.fontSize = "12px"),
          (hud.style.fontFamily = "Roboto, Arial, sans-serif"),
          (hud.style.boxShadow = "0 6px 18px rgba(0,0,0,.45)"),
          (hud.style.pointerEvents = "none"),
          (hud.style.lineHeight = "1.4"),
          document.body.appendChild(hud);
      }
      if (!S.sponsorblockOn || !S.sbHud) {
        hud.style.display = "none";
        return;
      }
      hud.style.display = "";
      const stats = SponsorBlockEngine.stats();
      const saved = stats.saved || 0;
      const segs = stats.segments || 0;
      hud.textContent = "SB: " + segs + " seg" + (segs !== 1 ? "s" : "") +
        " | " + ce(Math.floor(saved)) + " saved";
    } catch (_) {}
  }
  function ce(e) {
    e = Math.floor(Math.max(0, Number(e) || 0));
    const t = de.get(e);
    if (void 0 !== t) return t;
    const a = Math.floor(e / 3600),
      n = Math.floor((e % 3600) / 60),
      r = e % 60,
      o = a
        ? a + ":" + (n < 10 ? "0" + n : n) + ":" + (r < 10 ? "0" + r : r)
        : n + ":" + (r < 10 ? "0" + r : r);
    if (de.size > 512) {
      const e = de.keys()[0];
      de.delete(e);
    }
    return (de.set(e, o), o);
  }
  let se = null,
    le = 0;
  const _toastHandlers = [];
  const pe_bindClick = (fn) => {
    const t = se || document.getElementById("ytb-toast");
    if (!t || typeof fn !== "function") return false;
    t.addEventListener("click", fn);
    _toastHandlers.push({ el: t, fn });
    return true;
  };
  const _toastUnbind = () => {
    while (_toastHandlers.length) {
      const h = _toastHandlers.pop();
      try { h.el.removeEventListener("click", h.fn); } catch (_) {}
    }
  };
  function pe(e, t, a) {
    !S.silentToasts &&
      document.body &&
      (se ||
        ((se = document.createElement("div")),
        (se.id = "ytb-toast"),
        document.body.appendChild(se)),
      _toastUnbind(),
      (se.onclick = null, se.removeAttribute("title"), (se.style.cursor = ""), (se.textContent = String(e))),
      (se.className = "ytb-t-" + (a || "info") + " show"),
      clearTimeout(le),
      (le = setTimeout(() => {
        se && (se.className = "ytb-t-" + (a || "info"));
      }, t || 4000)));
  }
  function ue() {
    if (!document.body) return;
    const e = !!S.silentToasts;
    e !== document.body.classList.contains("ytb-silent") &&
      document.body.classList.toggle("ytb-silent", e);
  }
  async function he(e, t) {
    if (((t = t || {}), S.safeMode)) throw new Error("SAFE_MODE_BLOCKED");
    const a = new Set([
      "sponsor.ajay.app",
      "www.youtube.com",
    ]);

    let n;
    try {
      n = new URL(e).host;
    } catch (e) {
      throw new Error("bad URL");
    }
    if (!a.has(n)) throw new Error("host not allowed: " + n);

    const signal = t.signal;
    if (signal && signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const gmx = (typeof GM_xmlhttpRequest === "function") ? GM_xmlhttpRequest : (typeof window.GM_xmlhttpRequest === "function") ? window.GM_xmlhttpRequest : null;
    if (gmx) {
      return new Promise((resolve, reject) => {
        let settled = false;
        let req = null;
        let onAbort = null;
        const cleanup = () => {
          if (signal && onAbort) {
            try { signal.removeEventListener("abort", onAbort); } catch (_) {}
          }
        };
        const succeed = (value) => {
          if (settled) return;
          settled = true;
          cleanup();
          resolve(value);
        };
        const fail = (error) => {
          if (settled) return;
          settled = true;
          cleanup();
          reject(error || new Error("Network error"));
        };
        try {
          req = gmx({
            method: t.method || "GET",
            url: e,
            headers: t.headers || {},
            data: t.body,
            timeout: t.timeout || 1e4,
            onload(response) {
              succeed({
                ok: response.status >= 200 && response.status < 300,
                status: response.status,
                text: () => response.responseText,
                json: () => {
                  try { return JSON.parse(response.responseText); }
                  catch (_) { return null; }
                },
                headers: {
                  get: (name) => {
                    try {
                      const raw = String(response.responseHeaders || "");
                      const want = String(name || "").toLowerCase();
                      for (const line of raw.split(/\r?\n/)) {
                        const at = line.indexOf(":");
                        if (at < 0) continue;
                        if (line.slice(0, at).trim().toLowerCase() === want) return line.slice(at + 1).trim();
                      }
                    } catch (_) {}
                    return null;
                  },
                },
              });
            },
            onerror: fail,
            ontimeout() { fail(new Error("timeout")); },
            onabort() { fail(new DOMException("Aborted", "AbortError")); },
          });
        } catch (error) {
          fail(error);
          return;
        }
        if (signal) {
          onAbort = () => {
            try { req && req.abort(); } catch (_) {}
            fail(new DOMException("Aborted", "AbortError"));
          };
          if (signal.aborted) onAbort();
          else signal.addEventListener("abort", onAbort, { once: true });
        }
      });
    } else {
      return fetch(e, t);
    }
  }
  const Ee = (e) => v("history", e),
    Be = (e) => k("history", e),
    Pe = (e) => CheckpointStore.erase(e),
    Ie = () => w("history", "lw", "prev"),
    Re = () => CheckpointStore.erase(null);
  function Ne() {

    try {
      const e = document.querySelector(
        "ytd-video-owner-renderer ytd-channel-name a, #owner-name a, ytd-channel-name a, #channel-name a",
      );
      if (e && e.href) {
        const u = new URL(e.href, location.href);
        const p = u.pathname;
        let m = p.match(/\/@([^/?#]+)/);
        if (m && m[1]) return "@" + m[1].toLowerCase();
        m = p.match(/\/(?:channel|c|user)\/([^/?#]+)/i);
        if (m && m[1]) return m[1];
        const parts = p.split("/").filter(Boolean);
        if (parts[0]) return parts[0];
      }
    } catch (e) {}
    try {
      const t = e.ytInitialPlayerResponse;
      if (t && t.videoDetails && t.videoDetails.channelId)
        return t.videoDetails.channelId;
    } catch (e) {}
    try {
      const e = document.querySelector('meta[itemprop="channelId"]');
      if (e) return (e.getAttribute("content") || "").trim();
    } catch (e) {}
    return "";
  }
  function _e() {
    try {
      const e = ie.el();
      if (e && isFinite(e.duration) && e.duration > 0.5) return e.duration;
    } catch (e) {}
    try {
      const e = ie.api();
      if (e && "function" == typeof e.getDuration) {
        const t = e.getDuration();
        if (t && isFinite(t) && t > 0.5) return t;
      }
    } catch (e) {}
    try {
      const t = e.ytInitialPlayerResponse;
      if (t && t.videoDetails && t.videoDetails.lengthSeconds) {
        const e = parseFloat(t.videoDetails.lengthSeconds);
        if (e > 0.5) return e;
      }
    } catch (e) {}
    return 0;
  }

  function _isLiveStream() {
    try {
      const v = ie.el();
      if (v && v.duration === Infinity) return true;
    } catch (e) {}
    try {

      const b = document.querySelector(".ytp-live-badge");
      if (b && b.getClientRects().length > 0) return true;
    } catch (e) {}
    return false;
  }
  const Ve = new YourTubeResources.BoundedCache(64, "thumb-blob"),
    Fe = re();
  async function je(e) {
    if (!e) return null;
    try {
      if (Ve.has(e)) {

        const u = Ve.get(e);
        Ve.delete(e);
        return (Ve.set(e, u), u);
      }
      const t = await v("thumbCache", e);
      if (!t || !t.blob) return null;
      if (Ve.size > 24) {

        const e2 = Ve.keys()[0];
        try {
          const url = Ve.get(e2);
          if (url) YourTubeResources.TrackedBlobURL.revoke(url);
        } catch (e) {}
        Ve.delete(e2);
      }
      const a = YourTubeResources.TrackedBlobURL.create(t.blob, "thumb-" + e);
      return (Ve.set(e, a), a);
    } catch (e) {
      return null;
    }
  }
  async function ze(e, t) {
    try {
      const a = new AbortController(),
        n = setTimeout(() => a.abort(), t || 5e3);
      let r;
      try {
        r = await fetch(e, {
          mode: "cors",
          credentials: "omit",
          signal: a.signal,
        });
      } catch (_fErr) { clearTimeout(n); return null; }
      if (!r.ok) { clearTimeout(n); return null; }
      let o = null;
      try { o = await r.blob(); } catch (_) { clearTimeout(n); return null; }
      clearTimeout(n);
      return !o || o.size < 600 ? null : o;
    } catch (e) {
      return null;
    }
  }async function We(e, t) {
    if (e)
      return Fe("put:" + e, async () => {
        try {
          if ("string" == typeof t && t && !_safeThumbRe.test(t.trim())) t = "";
          const a = await v("thumbCache", e);
          if (a && a.blob && Date.now() - a.ts < 6048e5) return;
          const n =
            "string" == typeof t && t
              ? [t].concat(ie.thumbCandidates(e).filter((e) => e !== t))
              : ie.thumbCandidates(e);
          for (const t of n) {
            const a = await ze(t, 5e3);
            if (a) {
              await k("thumbCache", {
                videoId: e,
                blob: a,
                ts: Date.now(),
                src: t,
                version: 1,
              });
              return;
            }
          }

          if (a && a.blob) {
            const staleUrl = YourTubeResources.TrackedBlobURL.create(a.blob, "thumb-stale-" + e);
            if (staleUrl) Ve.set(e, staleUrl);
          }
        } catch (e) {}
      });
  }
  async function Ge() {
    await CheckpointStore.pruneTickets();
    const e = await Ie(),
      t = e
        .slice()
        .sort(
          (e, t) =>
            (t.pinned || 0) - (e.pinned || 0) ||
            (t.lastWatched || 0) - (e.lastWatched || 0),
        );
    if (t.length > 500)
      for (const e of t.slice(500))
        if (!e.pinned)
          try {
            await Pe(e.videoId);
          } catch (e) {}
    {
      const t = Date.now() - 5184e6;
      for (const a of e)
        if (!a.pinned && (a.lastWatched || 0) < t)
          try {
            await Pe(a.videoId);
          } catch (e) {}
    }
    (await (async function (e) {
      try {
        const t = await w("thumbCache", "ts", "next");
        if (t.length <= e) return;
        const a = t.slice(0, t.length - e);
        for (const e of a)
          try {
            await x("thumbCache", e.videoId);
          } catch (e) {}
      } catch (e) {}
    })(Math.max(50, 500)),
      g.emit("history.pruned"));
  }
  // Manual completion is distinct from actually watching an entire video's duration.
  async function Xe(id, meta = {}) {
    if (!CheckpointStore.validId(id)) return null;
    const now = Date.now();
    const row = await CheckpointStore.edit(id, old => {
      const r = old || CheckpointStore.blank(id, now);
      for (const k of ['title','channel','channelId','thumbnail']) if (meta[k] && !r[k]) r[k]=String(meta[k]).slice(0,400);
      if (Number.isFinite(meta.duration) && meta.duration>0) r.duration=meta.duration;
      r.title ||= id; r.thumbnail ||= ie.thumb(id,'mqdefault');
      r.completed=true; r.lastPosition=0; r.progress=100; r.remaining=0; r.lastWatched=now;
      r.watchCount=(Number(r.watchCount)||0)+1; r.sessions=(Array.isArray(r.sessions)?r.sessions:[]).slice(-49).concat({start:now,kind:'forced'});
      r._checkpoint={start:Math.max(now,(r._checkpoint?.start||0)+1),sid:CheckpointStore.nonce(),seq:1};
      return r;
    });
    g.emit('history.updated',{videoId:id,forced:true});return row;
  }
  const $e = {
    all: Ie,
    get: Ee,
    put: Be,
    del: Pe,
    clear: Re,
    stats: async function () {
      const e = await Ie(),
        t = {
          totalVideos: e.length,
          completed: 0,
          inProgress: 0,
          totalWatchTime: 0,
          totalRemaining: 0,
          channels: {},
        };
      for (const a of e) {
        (a.completed
          ? t.completed++
          : (a.lastPosition || 0) > 0 && t.inProgress++,
          (t.totalWatchTime += a.totalWatchTime || 0),
          (t.totalRemaining += a.remaining || 0));
        const e = a.channel || "Unknown";
        t.channels[e] = (t.channels[e] || 0) + 1;
      }
      return (
        (t.completionRate = t.totalVideos ? t.completed / t.totalVideos : 0),
        (t.topChannels = Object.entries(t.channels)
          .sort((e, t) => t[1] - e[1])
          .slice(0, 8)),
        t
      );
    },
    search: async function (e, t) {
      t = t || {};
      const a = (e || "").trim().toLowerCase();
      let n = await Ie();
      switch (
        (a &&
          (n = n.filter(
            (e) =>
              (e.title || "").toLowerCase().includes(a) ||
              (e.channel || "").toLowerCase().includes(a) ||
              (e.videoId || "").toLowerCase().includes(a),
          )),
        !0 === t.completed && (n = n.filter((e) => e.completed)),
        !1 === t.completed && (n = n.filter((e) => !e.completed)),
        t.pinned && (n = n.filter((e) => e.pinned)),
        t.sort || "recent")
      ) {
        case "recent":
          n.sort((e, t) => (t.lastWatched || 0) - (e.lastWatched || 0));
          break;
        case "oldest":
          n.sort((e, t) => (e.lastWatched || 0) - (t.lastWatched || 0));
          break;
        case "mostWatched":
          n.sort((e, t) => (t.watchCount || 0) - (e.watchCount || 0));
          break;
        case "longest":
          n.sort((e, t) => (t.duration || 0) - (e.duration || 0));
          break;
        case "progress":
          n.sort((e, t) => (t.progress || 0) - (e.progress || 0));
          break;
        case "remaining":
          n.sort((e, t) => (t.remaining || 0) - (e.remaining || 0));
      }
      return (n.sort((e, t) => (t.pinned || 0) - (e.pinned || 0)), n);
    },
    markWatched: Xe,
    cacheThumb: We,
    getCachedThumb: je,
    pin: async id => { await CheckpointStore.edit(id,r => r && {...r,pinned:Date.now()});g.emit('history.updated',{videoId:id}); },
    unpin: async id => { await CheckpointStore.edit(id,r => r && {...r,pinned:0});g.emit('history.updated',{videoId:id}); },
    prune: Ge,
    saveNow: () => WatchSessions.flush(),
    recorderState: () => WatchSessions.status(),
    forceWatched: Xe,
  };

