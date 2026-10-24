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
        document.querySelector("video.html5-main-video") ||
        document.querySelector("#movie_player video") ||
        document.querySelector("video"),
      api: () => document.querySelector("#movie_player"),
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
      isAd: () => !!document.querySelector(".ad-showing,.ad-interrupting"),
    },

    de = new YourTubeResources.BoundedCache(512, "time-format");
  function sanitizeUrlForCSS(url) {
    if (!url || typeof url !== "string") return "";
    try {

      const trimmed = url.trim();
      if (/^(https?:|data:image\/|blob:)/i.test(trimmed)) {

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
      }, t || 1800)));
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
  let mt = 0,
    ve = 0,
    ke = null,
    xe = !1,
    we = 0,
    Ce = !1,
    Se = null,
    _genomeVid = "",
    Te = null,
    Oe = null,
    Me = null,
    Le = null,
    Ae = null,
    _resumeEsc = null;
  const Ee = (e) => v("history", e),
    Be = (e) => k("history", e),
    Pe = (e) => x("history", e),
    Ie = () => w("history", "lw", "prev"),
    Re = () => C("history");
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
  function He(e) {
    return !!(e && e.title && e.channel && e.thumbnail);
  }
  function De(e, t) {
    return new Promise((a) => {
      const n = Date.now() + (t || 3e3);

      let lastSnap = null;
      const r = () => {
        if (ie.videoId() !== e) return void a(lastSnap);
        const t = (function (e) {
          return {
            videoId: e,
            title: ie.title() || "",
            channel: ie.channel() || "",
            channelId: Ne() || "",
            thumbnail: ie.thumb(e, "mqdefault"),
            duration: _e(),
          };
        })(e);
        lastSnap = t;
        (t.title && t.channel) || Date.now() >= n ? a(t) : setTimeout(r, 200);
      };
      r();
    });
  }

  const _oembedInFlight = new Set();
  async function _oembedFetch(e) {
    if (!e) return null;
    const cacheKey = "oembed:" + e;
    const ttl = 7 * 24 * 60 * 60 * 1000; 
    return YourTubeCache.getOrFetch(cacheKey, async () => {
      try {
        const r = await he(
          "https://www.youtube.com/oembed?url=" +
            encodeURIComponent("https://www.youtube.com/watch?v=" + e) +
            "&format=json",
        );
        if (!r.ok) return null;
        const j = await r.json();
        if (!j || !j.title) return null;
        return {
          videoId: e,
          title: j.title || "",
          channel: j.author_name || "",
          channelId: "",
          thumbnail: j.thumbnail_url || ie.thumb(e, "hqdefault"),
          duration: 0,
        };
      } catch (err) {
        return null;
      }
    }, ttl, { source: "idb", version: 1 });
  }

  async function _backfillMetadata() {
    if (!S.sessionRestoreOn) return;
    try {
      const list = await Ie();

      const need = list
        .filter((x) => x && x.videoId && (!x.title || !x.channel))
        .sort((a, b) => (b.lastWatched || 0) - (a.lastWatched || 0))
        .slice(0, 20);
      if (!need.length) return;

      for (const r of need) {
        if (!_oembedInFlight.has(r.videoId)) {

          _oembedInFlight.add(r.videoId);
          try {
            const data = await _oembedFetch(r.videoId);
            if (data) {
            const cur = await Ee(r.videoId);
            if (cur) {
              let n = !1;
              if (!cur.title && data.title) ((cur.title = data.title), (n = !0));
              if (!cur.channel && data.channel) ((cur.channel = data.channel), (n = !0));
              if (!cur.thumbnail && data.thumbnail) ((cur.thumbnail = data.thumbnail), (n = !0));
              if (n) {
                await Be(cur);
                if (cur.thumbnail) We(cur.videoId, cur.thumbnail).catch(() => {});
                g.emit("history.updated", { videoId: cur.videoId });
              }
            }
          }
          } finally {
            _oembedInFlight.delete(r.videoId);
          }
        }

        await new Promise((r) => setTimeout(r, 300));
      }
    } catch (e) {}
  }
  function qe(e, t) {
    if (!e) return !1;
    let a = !1;
    if (!e.title || e.title === t) {
      const n = ie.title();
      n && n !== t && ((e.title = n), (a = !0));
    }
    if (!e.channel) {
      const t = ie.channel();
      t && ((e.channel = t), (a = !0));
    }
    if (!e.channelId) {
      const t = Ne();
      t && ((e.channelId = t), (a = !0));
    }
    if (!e.thumbnail) {
      const n = ie.thumb(t, "hqdefault");
      n && ((e.thumbnail = n), (a = !0));
    }
    if (!e.duration || e.duration < 1) {
      const t = _e();
      t > 0.5 && ((e.duration = t), (a = !0));
    }
    return a;
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
            const staleUrl = URL.createObjectURL(a.blob);
            Ve.set(e, staleUrl);
          }
        } catch (e) {}
      });
  }
  function Ue() {
    try { clearTimeout(mt); } catch (e) {}
    mt = 0;
    if ((clearInterval(ve), (ve = 0), (ke = null), Te)) {
      try {
        Te();
      } catch (e) {}
      Te = null;
    }
    Ze();
  }
  async function Ke() {
    if (!S.sessionRestoreOn) return;

    Ma.awaitingResume = !1;
    Ma.awaitingResumeVid = null;
    if (!Ke._gateInstalled) {
      Ke._gateInstalled = !0;
      try {
        const orig = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = _xp.fn(function () {
          try {

            if (this && this.closest && !this.closest("#movie_player"))
              return orig.apply(this, arguments);
            if (Ma && Ma.awaitingResume) {

              if (Ma.awaitingResumeSince && Date.now() - Ma.awaitingResumeSince > 30000) {
                Ma.awaitingResume = !1;
                Ma.awaitingResumeVid = null;
              } else {
                try {
                  this.pause && this.pause();
                } catch (e2) {}

                return _pPromise.resolve();
              }
            }
          } catch (e2) {}
          return orig.apply(this, arguments);
        });
      } catch (e) {}
    }

    const e = ie.videoId();
    if (!e || e === ke) return;
    if (((ke = e), (xe = !1), (we = Date.now()), clearInterval(ve), Te)) {
      try {
        Te();
      } catch (e) {}
      Te = null;
    }
    ve = setInterval(() => {
      _a() || document.hidden || Ye();
    }, 5e3);

    window.__ytbZeTimer = setTimeout(() => { try { Ze(); } catch (e) {} }, 30000);
    const t = Date.now();
    let a = await Ee(e);
    (a
      ? ((a.watchCount = (a.watchCount || 0) + 1),
        (a.sessions = (a.sessions || []).slice(-49).concat({ start: t })))
      : (a = {
          videoId: e,
          title: "",
          channel: "",
          channelId: "",
          thumbnail: "",
          firstWatched: t,
          watchCount: 1,
          totalWatchTime: 0,
          sessions: [{ start: t }],
          lastPosition: 0,
          progress: 0,
          completed: !1,
          remaining: 0,
          duration: 0,
          pinned: 0,
          tags: [],
          notes: "",
        }),
      (a.lastWatched = t),
      qe(a, e),
      await Be(a),
      a.thumbnail && We(e, a.thumbnail),
      He(a) ||
        De(e, 3e3).then(async (t) => {

          if (!t) return;
          const a = await Ee(e);
          if (!a) return;
          let n = !1;
          (!a.title && t.title && ((a.title = t.title), (n = !0)),
            !a.channel && t.channel && ((a.channel = t.channel), (n = !0)),
            !a.channelId &&
              t.channelId &&
              ((a.channelId = t.channelId), (n = !0)),
            !a.thumbnail &&
              t.thumbnail &&
              ((a.thumbnail = t.thumbnail), (n = !0)),
            (!a.duration || a.duration < 1) &&
              t.duration > 0.5 &&
              ((a.duration = t.duration),
              a.lastPosition >= 0 &&
                (a.remaining = Math.max(0, a.duration - a.lastPosition)),
              (n = !0)),
            n &&
              (await Be(a),
              a.thumbnail && We(e, a.thumbnail),
              g.emit("history.updated", { videoId: e })));
        }));
    const n = (() => {
      try {
        const e = location.href.match(/[?&#]t=([0-9]+)/);
        return e ? parseInt(e[1], 10) : 0;
      } catch (e) {
        return 0;
      }
    })();
    if (
      (!a.completed &&
        !n &&
        (a.lastPosition || 0) > 5 &&
        !xe &&
        ((xe = !0),
        "silent" === S.sessionResumeMode
          ? (function (e) {
              const t = () => {
                const t = ie.el();
                if (t) {
                  try {
                    t.currentTime = e.lastPosition;
                  } catch (e) {}
                  try {
                    const e = ie.api();
                    e && "function" == typeof e.playVideo
                      ? e.playVideo()
                      : t.play && t.play().catch(() => {});
                  } catch (e) {}
                }
              };
              if (
                (document.querySelector("#movie_player") ||
                  document.querySelector(".html5-video-player")) &&
                ie.el()
              ) {
                t();
                return;
              }
              const n = document.querySelector("ytd-app") || document.documentElement;
              if (!n) return;
              let r = !1;
              const o = new MutationObserver(() => {
                if (r) return;

                try { if (e.videoId && ie.videoId() && ie.videoId() !== e.videoId) return; } catch (_) {}
                const n = document.querySelector("#movie_player"),
                  i = ie.el();
                if (n && i) {
                  r = !0;
                  try { o.disconnect(); } catch (e) {}
                  t();
                }
              });
              try {
                o.observe(n, { childList: !0, subtree: !0 });
              } catch (e) {}
              setTimeout(() => {
                if (!r) { try { o.disconnect(); } catch (e) {} }
              }, 8e3);
            })(a)
          : "overlay" === S.sessionResumeMode
          ? (function (e) {
              const t = () => {
                  const t = ie.el();
                  if (t) {
                    try {
                      t.currentTime = e.lastPosition;
                    } catch (e) {}
                    try {
                      const e = ie.api();
                      e && "function" == typeof e.playVideo
                        ? e.playVideo()
                        : t.play && t.play().catch(() => {});
                    } catch (e) {}
                  }
                },
                a = () => {
                  const e = ie.el();
                  if (e) {
                    try {
                      e.currentTime = 0;
                    } catch (e) {}
                    try {
                      const t = ie.api();
                      t && "function" == typeof t.playVideo
                        ? t.playVideo()
                        : e.play && e.play().catch(() => {});
                    } catch (e) {}
                  }
                };
              if (
                (document.querySelector("#movie_player") ||
                  document.querySelector(".html5-video-player")) &&
                ie.el()
              )
                return void Je(e, t, a);
              const n =
                document.querySelector("ytd-app") || document.documentElement;
              if (!n) return;
              let r = !1;
              const o = new MutationObserver(() => {
                if (r) return;

                try { if (e.videoId && ie.videoId() && ie.videoId() !== e.videoId) return; } catch (_) {}
                const n = document.querySelector("#movie_player"),
                  i = ie.el();
                if (n && i) {
                  r = !0;
                  try {
                    o.disconnect();
                  } catch (e) {}
                  Je(e, t, a);
                }
              });
              try {
                o.observe(n, { childList: !0, subtree: !0 });
              } catch (e) {
                return;
              }
              setTimeout(() => {
                if (!r)
                  try {
                    o.disconnect();
                  } catch (e) {}
              }, 8e3);
            })(a)
          : setTimeout(() => {
              const e = ie.el();
              e &&
                isFinite(e.duration) &&
                (function (e, t) {
                  if (e) {
                    Ma.awaitingResume = !0;
                    Ma.awaitingResumeVid = e.videoId || null;
                    Ma.awaitingResumeSince = Date.now();
                  }
                  if ((Ze(), !document.body)) return;
                  const a = document.createElement("div");
                  a.id = "ytb-resume-card";
                  a.className = "ytb-resume-card-small";
                  const n = ce(e.lastPosition || 0),
                    r = e.duration ? ce(e.duration) : "",
                    o = document.createElement("div");
                  o.className = "ytb-resume-card-row";
                  o.style.cssText =
                    "display:flex;align-items:center;gap:12px;padding:10px 14px";
                  const i = document.createElement("div");
                  i.className = "ytb-resume-thumb";
                  i.style.cssText =
                    "width:64px;height:36px;border-radius:6px;background:#1a1a1a center/cover no-repeat;flex-shrink:0";
                  if (e.thumbnail) {

                    try {
                      const safeThumbUrl = sanitizeUrlForCSS(e.thumbnail || "");
                      i.style.backgroundImage =
                        safeThumbUrl ? ("url('" + encodeURI(safeThumbUrl).replace(/'/g, "%27") + "')") : "none";
                    } catch (err) {
                      i.style.backgroundImage = "none";
                    }
                  }
                  o.appendChild(i);
                  const d = document.createElement("div");
                  d.className = "ytb-resume-info";
                  d.style.cssText =
                    "flex:1;min-width:0;display:flex;flex-direction:column;gap:2px";
                  const c = document.createElement("div");
                  c.className = "ytb-resume-cta";
                  c.style.cssText = "font:600 12px system-ui;color:#fff";
                  c.textContent = "Continue from " + n + (r ? " / " + r : "") + "?";
                  const s = document.createElement("div");
                  s.className = "ytb-resume-title";
                  s.style.cssText =
                    "font:11px system-ui;color:#aaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
                  s.textContent = e.title || e.videoId;
                  d.appendChild(c);
                  d.appendChild(s);
                  o.appendChild(d);
                  const l = document.createElement("div");
                  l.className = "ytb-resume-actions";
                  function p(e, t, a) {
                    const n = document.createElement("button");
                    n.type = "button";
                    n.className = t ? "ytb-resume-btn-primary" : "ytb-resume-btn-secondary";
                    n.textContent = e;
                    n.style.cssText =
                      "appearance:none;border:0;border-radius:6px;padding:7px 12px;font:600 11px system-ui;cursor:pointer;transition:background .12s,transform .08s;" +
                      (t
                        ? "background:#ff0033;color:#fff"
                        : "background:rgba(255,255,255,.1);color:#ddd");
                    n.addEventListener("click", (e) => {
                      e.stopPropagation();
                      a();
                    });
                    n.addEventListener("mouseenter", () => {
                      n.style.transform = "translateY(-1px)";
                    });
                    n.addEventListener("mouseleave", () => {
                      n.style.transform = "translateY(0)";
                    });
                    return n;
                  }
                  l.style.cssText = "display:flex;gap:6px;flex-shrink:0;align-items:center";
                  l.appendChild(
                    p("Resume", !0, () => {

                      Ze();
                      try { t(); } catch (e) {}
                    }),
                  );
                  l.appendChild(
                    p("Start over", !1, () => {

                      Ze();
                      try {
                        const e = ie.el();
                        if (e) {
                          e.currentTime = 0;
                          if (e.paused) e.play && e.play().catch(() => {});
                        }
                      } catch (e) {}
                    }),
                  );
                  const closeBtn = p("×", !1, () => Ze());
                  closeBtn.className = "ytb-resume-close";
                  l.appendChild(closeBtn);
                  o.appendChild(l);
                  a.appendChild(o);
                  document.body.appendChild(a);
                  Oe = a;
                  setTimeout(() => {
                    Oe === a && Ze();
                  }, 15e3);
                })(a, () => {
                  try {
                    if (ie.videoId() && a.videoId && ie.videoId() !== a.videoId) { Ze(); return; } ((e.currentTime = a.lastPosition), e.play && e.play().catch(() => {}));
                  } catch (e) {}
                  pe("Resumed at " + ce(a.lastPosition), 1800, "success");
                });
            }, 1500)),
      !Te)
    ) {
      const e = () => {
          ie.videoId() === ke && Ye();
        },
        t = ie.el();
      t &&
        (t.addEventListener("loadedmetadata", e),
        t.addEventListener("durationchange", e),
        (Te = () => {
          try {
            (t.removeEventListener("loadedmetadata", e),
              t.removeEventListener("durationchange", e));
          } catch (e) {}
        }));
    }
  }
  async function Ye() {
    if (!Ce) {
      Ce = !0;
      try {
        if (!S.sessionRestoreOn) return;
        if (document.hidden) {
          const e = ie.el();
          if (e && e.paused) return;
        }
        const e = ie.videoId();
        if (!e) return;
        const t = ie.el();
        if (!t) return;
        const a = t.currentTime,
          n = _e();
        if (!isFinite(n) || n < 5) return;
        const r = (await Ee(e)) || {
            videoId: e,
            firstWatched: Date.now(),
            watchCount: 1,
            sessions: [],
            pinned: 0,
            tags: [],
            notes: "",
            title: "",
            channel: "",
            channelId: "",
            thumbnail: "",
          },
          o = qe(r, e),
          i = Se && Se.vid === e ? Math.abs(Se.pos - a) : 1 / 0,
          d = !Se || Se.paused !== t.paused;
        if (!o && i < 0.5 && !d) return;
        ((r.lastWatched = Date.now()),
          (r.lastPosition = a),
          (r.duration = n),
          (r.progress = n > 0 ? Math.min(100, Math.round((a / n) * 100)) : 0),
          (r.remaining = Math.max(0, n - a)),
          (r.completed = r.remaining < 15 || r.progress >= 97),
          r.completed && ((r.lastPosition = 0), (r.remaining = 0)));
        const c = Date.now();
        if (!t.paused && we) {
          const e = Math.min((c - we) / 1e3, 10);
          e > 0 && e < 60 && (r.totalWatchTime = (r.totalWatchTime || 0) + e);

          try {
            if (S.algoIntelligenceOn && typeof AlgoEngine !== "undefined" && (typeof _riskyGate !== "function" || _riskyGate())) {
              AlgoEngine.SignalTracker.trackWatch(r.videoId, a, n);
            }
          } catch (_) {}
          try {
            if (typeof YourTubeSession !== "undefined" && YourTubeSession.genome && r.videoId && r.videoId !== _genomeVid) {
              _genomeVid = r.videoId;
              YourTubeSession.genome.record({
                topic: r.title,
                duration: r.duration,
                handle: typeof Ne === "function" ? Ne() : "",
                channelName: r.channel,
              });
            }
          } catch (_) {}
        }
        ((we = c),
          await Be(r),
          r.thumbnail && We(e, r.thumbnail),
          (Se = { vid: e, pos: a, paused: t.paused }),
          g.emit("history.updated", { videoId: e }));
      } finally {
        Ce = !1;
      }
    }
  }
  async function Ge() {
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
  async function Xe(e, t) {
    t = t || {};
    let a = await Ee(e);
    const n = Date.now();
    return (
      a ||
        (a = {
          videoId: e,
          title: "",
          channel: "",
          channelId: "",
          thumbnail: "",
          firstWatched: n,
          watchCount: 0,
          totalWatchTime: 0,
          sessions: [],
          pinned: 0,
          tags: [],
          notes: "",
        }),
      qe(a, e),
      !t.title || (a.title && a.title !== e) || (a.title = t.title),
      t.channel && !a.channel && (a.channel = t.channel),
      t.channelId && !a.channelId && (a.channelId = t.channelId),
      t.thumbnail && !a.thumbnail && (a.thumbnail = t.thumbnail),
      a.title || (a.title = e),
      a.thumbnail || (a.thumbnail = ie.thumb(e, "mqdefault")),
      (a.lastWatched = n),
      (a.lastPosition = 0),
      (a.progress = 100),
      (a.completed = !0),
      (a.remaining = 0),
      (a.watchCount = (a.watchCount || 0) + 1),
      t.duration &&
        (!a.duration || t.duration > a.duration) &&
        (a.duration = t.duration),
      (a.totalWatchTime = (a.totalWatchTime || 0) + (a.duration || 0)),
      (a.sessions = (a.sessions || [])
        .slice(-49)
        .concat({ start: n, kind: "forced" })),
      await Be(a),
      a.thumbnail && We(e, a.thumbnail),
      g.emit("history.updated", { videoId: e, forced: !0 }),
      He(a) ||
        (ie.videoId() === e &&
          De(e, 3e3).then(async (t) => {
            if (!t) return;
            const a = await Ee(e);
            if (!a) return;
            let n = !1;
            ((a.title && a.title !== e) ||
              (t.title && ((a.title = t.title), (n = !0))),
              !a.channel && t.channel && ((a.channel = t.channel), (n = !0)),
              !a.channelId &&
                t.channelId &&
                ((a.channelId = t.channelId), (n = !0)),
              n &&
                (await Be(a),
                a.thumbnail && We(e, a.thumbnail),
                g.emit("history.updated", { videoId: e })));
          })),
      a
    );
  }
  function Ze() {
    if (Oe) {
      try {
        Oe.remove();
      } catch (e) {}
      Oe = null;
    }
    Ma.awaitingResume = !1;
    Ma.awaitingResumeVid = null;
    try { if (window.__ytbZeTimer) { clearTimeout(window.__ytbZeTimer); window.__ytbZeTimer = 0; } } catch (_) {}
    try { if (window.__ytbDashEsc) { document.removeEventListener("keydown", window.__ytbDashEsc); window.__ytbDashEsc = null; } } catch (_) {}
  }
  function Qe() {
    if (Le) {
      try {
        Le.disconnect();
      } catch (e) {}
      Le = null;
    }
    if (Ae) {
      try {
        Ae();
      } catch (e) {}
      Ae = null;
    }
    if (_resumeEsc) {
      try {
        document.removeEventListener("keydown", _resumeEsc, !0);
      } catch (e) {}
      _resumeEsc = null;
    }
    if (Me) {
      try {
        Me.remove();
      } catch (e) {}
      Me = null;
    }
    Ma.awaitingResume = !1;
    Ma.awaitingResumeVid = null;
    try { if (window.__ytbZeTimer) { clearTimeout(window.__ytbZeTimer); window.__ytbZeTimer = 0; } } catch (_) {}
    try { if (window.__ytbDashEsc) { document.removeEventListener("keydown", window.__ytbDashEsc); window.__ytbDashEsc = null; } } catch (_) {}
  }
    function Je(e, t, a) {
    if (e) {
      }
    if ((Qe(), !e)) return;
    Ma.awaitingResume = !0;
    Ma.awaitingResumeVid = e.videoId || null;
    Ma.awaitingResumeSince = Date.now();
    const n =
      document.querySelector("#movie_player") ||
      document.querySelector(".html5-video-player") ||
      document.querySelector("ytd-player");
    if (!n) return;

    if (!Je._playGate) {
      Je._playGate = !0;
      try {
        const _orig = window.__ytbRealPlay || HTMLMediaElement.prototype.play;
        window.__ytbRealPlay = _orig;
        HTMLMediaElement.prototype.play = _xp.fn(function () {
          try {

            if (this && this.closest && !this.closest("#movie_player"))
              return _orig.apply(this, arguments);
            if (Ma && Ma.awaitingResume) {

              if (Ma.awaitingResumeSince && Date.now() - Ma.awaitingResumeSince > 30000) {
                Ma.awaitingResume = !1;
                Ma.awaitingResumeVid = null;
              } else {
                try { this.pause && this.pause(); } catch (e2) {}
                return _pPromise.resolve();
              }
            }
          } catch (e2) {}
          return _orig.apply(this, arguments);
        });
      } catch (e) {}
    }

    Ae = (function () {
      const e = ie.api();
      const t = ie.el();
      const a = {};
      try {
        if (e) {
          for (const k of ["playVideo", "playVideoAt"]) {
            if ("function" == typeof e[k]) {
              a[k] = e[k];
              e[k] = _xp.fn(function () {});
            }
          }
        }
      } catch (e) {}

      try { t && !t.paused && t.pause(); } catch (e) {}
      try { e && "function" == typeof e.pauseVideo && e.pauseVideo(); } catch (e) {}
      return function () {
        try { if (e) for (const k of Object.keys(a)) e[k] = a[k]; } catch (e) {}
      };
    })();

    const r = document.createElement("div");
    r.id = "ytb-resume-overlay";
    r.classList.add("ytb-resume-" + (S.sessionResumeDesign || "default"));
    r.setAttribute("role", "dialog");
    r.setAttribute("aria-modal", "true");
    r.setAttribute("aria-label", "Resume playback");
    r.style.cssText =
      "position:absolute;inset:0;z-index:2147483640;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,rgba(0,0,0,.85) 0%,rgba(0,0,0,.95) 50%,rgba(0,0,0,.85) 100%);backdrop-filter:blur(14px) saturate(160%);-webkit-backdrop-filter:blur(14px) saturate(160%);font:14px/1.45 system-ui,-apple-system,sans-serif;color:#fff;opacity:0;transition:opacity .22s ease-out";

    const o = document.createElement("div");
    o.className = "ytb-resume-card";
    o.style.cssText =
      "max-width:520px;width:min(86%,520px);background:rgba(20,22,28,.6);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:24px 26px 22px;box-shadow:0 30px 80px rgba(0,0,0,.65),0 8px 24px rgba(0,0,0,.4);backdrop-filter:blur(28px) saturate(180%);-webkit-backdrop-filter:blur(28px) saturate(180%);display:flex;flex-direction:column;gap:14px;transform:translateY(8px);transition:transform .25s ease-out";

    const i = document.createElement("div");
    i.className = "ytb-resume-head";
    i.style.cssText = "display:flex;gap:14px;align-items:center";

    const d = document.createElement("div");
    d.className = "ytb-resume-thumb";
    d.style.cssText =
      "width:120px;height:68px;border-radius:10px;flex-shrink:0;background:#000 center/cover no-repeat;box-shadow:0 4px 12px rgba(0,0,0,.5);position:relative;overflow:hidden";
    if (e.thumbnail) {

        try {
          const safeThumbUrl = sanitizeUrlForCSS(e.thumbnail || "");
          d.style.backgroundImage =
            safeThumbUrl ? ("url('" + encodeURI(safeThumbUrl).replace(/'/g, "%27") + "')") : "none";
        } catch (e2) {
          d.style.backgroundImage = "none";
        }
    }
    const c = document.createElement("div");
    c.style.cssText =
      "position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(255,255,255,.18)";
    const s = document.createElement("div");
    const l = e.duration
      ? Math.min(100, Math.max(0, ((e.lastPosition || 0) / e.duration) * 100))
      : 0;
    s.style.cssText =
      "height:100%;background:#ff0033;width:" + l.toFixed(1) + "%;transition:width .3s";
    c.appendChild(s);
    d.appendChild(c);
    i.appendChild(d);

    const p = document.createElement("div");
    p.className = "ytb-resume-info";
    p.style.cssText =
      "flex:1;min-width:0;display:flex;flex-direction:column;gap:4px";
    const u = document.createElement("div");
    u.className = "ytb-resume-eyebrow";
    u.style.cssText =
      "font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#ff8a96;font-weight:600";
    u.textContent = "Resume watching";
    const h = document.createElement("div");
    h.className = "ytb-resume-title";
    h.style.cssText =
      "font-size:15px;font-weight:600;color:#fff;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden";
    h.textContent = e.title || e.videoId || "this video";
    const m = document.createElement("div");
    m.className = "ytb-resume-meta";
    m.style.cssText = "font-size:12px;color:#aaa";
    const y = ce(e.lastPosition || 0);
    const g = e.duration ? ce(e.duration) : null;
    m.textContent = (e.channel ? e.channel + " - " : "") + (g ? y + " / " + g : "from " + y);
    p.appendChild(u);
    p.appendChild(h);
    p.appendChild(m);
    i.appendChild(p);
    o.appendChild(i);

    const f = document.createElement("div");
    f.className = "ytb-resume-body";
    f.style.cssText = "font-size:13.5px;color:#cdd;line-height:1.5";
    f.textContent =
      "You watched this before. Continue from " + y + " or start over?";
    o.appendChild(f);

    const b = document.createElement("div");
    b.className = "ytb-resume-actions";
    b.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;margin-top:2px";
    function v(e, t, a, n) {
      const r = document.createElement("button");
      r.type = "button";
      r.className = t ? "ytb-resume-btn-primary" : "ytb-resume-btn-secondary";
      r.style.cssText =
        "appearance:none;border:0;cursor:pointer;flex:1;min-width:140px;padding:12px 18px;border-radius:24px;font:600 14px/1.2 inherit;display:flex;flex-direction:column;align-items:center;gap:2px;transition:transform .1s,box-shadow .15s;" +
        (t
          ? "background:#fff;color:#0f0f0f;box-shadow:0 4px 16px rgba(255,255,255,.15)"
          : "background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.14)");
      const o2 = document.createElement("span");
      o2.textContent = e;
      r.appendChild(o2);
      if (a) {
        const e2 = document.createElement("span");
        e2.style.cssText =
          "font-size:10.5px;font-weight:500;opacity:.7;letter-spacing:.02em";
        e2.textContent = a;
        r.appendChild(e2);
      }
      r.addEventListener("click", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        try { n(); } catch (e) {}
      });
      r.addEventListener("mouseenter", () => {
        r.style.transform = "translateY(-1px)";
        r.style.boxShadow = t
          ? "0 6px 20px rgba(255,255,255,.25)"
          : "0 4px 16px rgba(0,0,0,.4)";
      });
      r.addEventListener("mouseleave", () => {
        r.style.transform = "translateY(0)";
        r.style.boxShadow = t
          ? "0 4px 16px rgba(255,255,255,.15)"
          : "0 0 0 rgba(0,0,0,0)";
      });
      return r;
    }
    const k = v(
      "Resume from " + y,
      !0,
      "Continue where you left off",
      () => {
        Qe();
        try { t && t(); } catch (e) {}
      }
    );
    const x = v(
      "Start over",
      !1,
      "Play from the beginning",
      () => {
        Qe();
        try { a && a(); } catch (e) {}
      }
    );
    b.appendChild(k);
    b.appendChild(x);
    o.appendChild(b);

    const w = document.createElement("div");
    w.className = "ytb-resume-footer";
    w.style.cssText =
      "display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#777;margin-top:4px;padding-top:8px;border-top:1px solid rgba(255,255,255,.08)";
    const C = document.createElement("span");
    C.textContent = "YourTube Session History";
    const S2 = document.createElement("button");
    S2.type = "button";
    S2.className = "ytb-resume-dismiss";
    S2.style.cssText =
      "background:none;border:0;color:#888;cursor:pointer;font:inherit;text-decoration:underline;padding:2px 4px";
    S2.textContent = "Dismiss";
    S2.addEventListener("click", (e) => {
      e.stopPropagation();
      Qe();
    });
    w.appendChild(C);
    w.appendChild(S2);
    o.appendChild(w);
    r.appendChild(o);
    for (const e of [
      "click",
      "mousedown",
      "mouseup",
      "dblclick",
      "contextmenu",
    ])
      r.addEventListener(e, (e) => e.stopPropagation());
    r.addEventListener("wheel", (e) => e.stopPropagation(), { passive: !0 });
    try {
      const cs = getComputedStyle(n);
      if (cs.position === "static") n.style.position = "relative";
    } catch (e) {}
    n.appendChild(r);
    Me = r;
    requestAnimationFrame(() => {
      if (Me) {
        Me.style.opacity = "1";
        o.style.transform = "translateY(0)";
      }
    });
    try { k.focus(); } catch (e) {}
    const T = (e) => {
      if ("Escape" === e.key && Me) {
        e.stopPropagation();
        Qe();
      }
    };
    document.addEventListener("keydown", T, !0);
    _resumeEsc = T;
    try {
      Le = new MutationObserver(() => {
        if (Me && Me.parentNode !== n) {
          n.appendChild(Me);
        }
      });
      Le.observe(n, { childList: !0 });
    } catch (e) {}
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
    pin: async (e) => {
      const t = await Ee(e);
      t &&
        ((t.pinned = Date.now()),
        await Be(t),
        g.emit("history.updated", { videoId: e }));
    },
    unpin: async (e) => {
      const t = await Ee(e);
      t &&
        ((t.pinned = 0),
        await Be(t),
        g.emit("history.updated", { videoId: e }));
    },
    prune: Ge,
    saveNow: Ye,
    forceWatched: Xe,
  };

