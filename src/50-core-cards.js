  let St_seekbarMarks = new Map();

  async function St(e) {
    try {
      return await SponsorBlockEngine.init(e);
    } catch (err) {
      try { h("[SB] lookup scheduling error", err); } catch (_) {}
      return [];
    }
  }


  async function Bt_hideVideo() {
    const vid = ie.videoId();
    if (!vid) throw new Error("No video");
    try {
      await SponsorBlockEngine.hideVideo(vid);
    } catch (err) {
      throw new Error("Storage write failed");
    }
  }

  async function Bt_unHideVideo() {
    const vid = ie.videoId();
    if (!vid) throw new Error("No video");
    try {
      await SponsorBlockEngine.unhideVideo(vid);
    } catch (err) {
      throw new Error("Storage write failed");
    }
  }


  function Tt() {
    try {
      const e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
      let t = "";
      for (let a = 0; a < 16; a++) t += e.charAt(Math.floor(Math.random() * e.length));
      return t;
    } catch (e) {
      return "y" + String(Date.now()).slice(-10);
    }
  }
  function Ot(t, a, n) {
    return (
      (n = n || {}),
      new Promise((r) => {
        try {
          if (!e.ytcfg || !e.ytcfg.get) return void r({ ok: !1 });
          const o = e.ytcfg.get("INNERTUBE_API_KEY");
          if (!o) return void r({ ok: !1 });
          const i =
              "/youtubei/v1/" +
              t +
              "?key=" +
              encodeURIComponent(o) +
              "&prettyPrint=false",
            d = new AbortController(),
            c = setTimeout(() => d.abort(), n.timeout || 7e3),
            s = Object.assign(
              {
                "Content-Type": "application/json",
                "X-YouTube-Client-Name": String(
                  e.ytcfg.get("INNERTUBE_CONTEXT_CLIENT_NAME") || "1",
                ),
                "X-YouTube-Client-Version": String(
                  e.ytcfg.get("INNERTUBE_CONTEXT_CLIENT_VERSION") ||
                    e.ytcfg.get("INNERTUBE_CLIENT_VERSION") ||
                    "2.20240101",
                ),
              },
              n.headers || {},
            );
          try {
            const t = e.ytcfg.get("VISITOR_DATA");
            t && (s["X-Goog-Visitor-Id"] = t);
          } catch (e) {}
          fetch(i, {
            method: "POST",
            credentials: "include",
            mode: "same-origin",
            keepalive: !0,
            headers: s,
            body: JSON.stringify(a),
            signal: d.signal,
          })
            .then(async (e) => {
              clearTimeout(c);
              let t = null;
              if (n.parseJson)
                try {
                  t = await e.json();
                } catch (e) {}
              r({ ok: e.ok, status: e.status, json: t });
            })
            .catch(() => {
              (clearTimeout(c), r({ ok: !1 }));
            });
        } catch (e) {
          try { clearTimeout(c); } catch (_) {}

          r({ ok: !1 });
        }
      })
    );
  }
  function Mt() {
    try {
      if (e.ytcfg && e.ytcfg.get) {
        const t = e.ytcfg.get("INNERTUBE_CONTEXT");
        if (t) {
          const a = JSON.parse(JSON.stringify(t));
          try {
            a.client &&
              (a.client.clientName || (a.client.clientName = "WEB"),
              a.client.clientVersion ||
                (a.client.clientVersion =
                  e.ytcfg.get("INNERTUBE_CLIENT_VERSION") || "2.20240101"));
          } catch (e) {}
          return a;
        }
      }
    } catch (e) {}
    return {
      client: {
        clientName: "WEB",
        clientVersion: "2.20240101",
        hl: "en",
        gl: "US",
      },
    };
  }
  function Lt() {
    try {
      if (e.ytcfg && e.ytcfg.get) {
        const t =
          e.ytcfg.get("STS") ||
          (e.ytcfg.get("PLAYER_VARS") && e.ytcfg.get("PLAYER_VARS").sts);
        if (t) return parseInt(t, 10);
      }
    } catch (e) {}
    return 19960;
  }
  async function At(e, t) {
    return Ot("player", {
      context: Mt(),
      videoId: e,
      cpn: t,
      contentCheckOk: !0,
      racyCheckOk: !0,
      playbackContext: {
        contentPlaybackContext: {
          signatureTimestamp: Lt(),
          referer: "https://www.youtube.com/watch?v=" + e,
          currentUrl: "/watch?v=" + e,
          autoplay: !1,
          autoCaptionsDefaultOn: !1,
          html5Preference: "HTML5_PREF_WANTS",
          lactMilliseconds: "1000",
          vis: 0,
        },
      },
    });
  }
  // Removed in 1.3.0: Et/Bt/Pt/It/Rt/Nt were legacy YouTube "watched" beacon
  // composers (next, updated_metadata, browse, log_event, feedback, att/get)
  // with zero call sites left after the Force-Watched transport overhaul.

  let _fwTpl = null;
  function _fwTplSet(u) {
    try {
      const q = new URL(String(u || ""), location.origin).searchParams;
      _fwTpl = {
        ei: q.get("ei") || "",
        plid: q.get("plid") || "",
        cl: q.get("cl") || "",
        of: q.get("of") || "",
        vm: q.get("vm") || "",
        fexp: q.get("fexp") || "",
      };
    } catch (e) {}
  }

  function _fwUA() {
    const ua = (navigator.userAgent || "").replace("HeadlessChrome/", "Chrome/");
    const m = (re) => {
      const x = re.exec(ua);
      return x ? x[1] : "";
    };
    let browser = "Chrome",
      bver = m(/Chrome\/([\d.]+)/) || "124.0.0.0";
    if (/Firefox\//.test(ua)) {
      browser = "Firefox";
      bver = m(/Firefox\/([\d.]+)/) || bver;
    } else if (/Edg\//.test(ua)) {
      browser = "Microsoft Edge";
      bver = m(/Edg\/([\d.]+)/) || bver;
    } else if (!/Chrome\//.test(ua) && /Safari\//.test(ua)) {
      browser = "Safari";
      bver = m(/Version\/([\d.]+)/) || bver;
    }
    let os = "Windows",
      osver = "10.0";
    if (/Windows NT ([\d.]+)/.test(ua)) {
      os = "Windows";
      osver = m(/Windows NT ([\d.]+)/) || "10.0";
    } else if (/Mac OS X/.test(ua)) {
      os = "Mac OS X";
      osver = (m(/Mac OS X ([\d_]+)/) || "10_15_7").replace(/_/g, ".");
    } else if (/Android/.test(ua)) {
      os = "Android";
      osver = m(/Android ([\d.]+)/) || "10";
    } else if (/Linux/.test(ua)) {
      os = "Linux";
      osver = m(/x86_64/) ? "x86_64" : "";
    }
    return { browser: browser, bver: bver, os: os, osver: osver };
  }

  function _fwVfmt() {
    try {
      const h = (ie.el() || {}).videoHeight || 0;
      const m = { 2160: 313, 1440: 271, 1080: 248, 720: 247, 480: 244, 360: 243, 240: 242 };
      // Integer-like keys iterate ascending, so sort descending to map the
      // height to the first bucket at or below it.
      for (const k of Object.keys(m).sort((a, b) => b - a)) if (h >= +k) return m[k];
    } catch (e) {}
    return 0;
  }
  function _t() {
    let t = "",
      a = "2.20240101",
      n = "en",
      r = "US",
      o = "",
      i = "124";
    try {
      e.ytcfg &&
        e.ytcfg.get &&
        ((t = e.ytcfg.get("EVENT_ID") || ""),
        (a = e.ytcfg.get("INNERTUBE_CLIENT_VERSION") || a),
        (n = e.ytcfg.get("HL") || n),
        (r = e.ytcfg.get("GL") || r),
        (o = e.ytcfg.get("VISITOR_DATA") || ""));
    } catch (e) {}
    try {
      const e = navigator.userAgent.match(/Chrome\/(\d+)/);
      e && (i = e[1]);
    } catch (e) {}
    return { ei: t, ver: a, hl: n, gl: r, visitorData: o, chromeVer: i };
  }
  function Ht(e, t, a, n, r, o) {
    const i = _t(),
      U = _fwUA(),
      d = Math.floor(t || 0),
      c = Math.floor(null != a ? a : d),
      s = o && null != o.rtnDelta ? o.rtnDelta : 10 + Math.floor(16 * Math.random()),
      l = [
        "ns=yt",
        "el=detailpage",
        "cpn=" + encodeURIComponent(r),
        "docid=" + encodeURIComponent(e),
        "ver=2",
        "ei=" + encodeURIComponent(i.ei || (_fwTpl && _fwTpl.ei) || ""),
        "fmt=" + ((o && o.fmt) || _fwVfmt() || "243"),
        "fs=0",
        "rt=" +
          (o && null != o.rt
            ? o.rt
            : (function () {
                try {
                  return (performance.now() / 1000).toFixed(3);
                } catch (e) {
                  return String(c);
                }
              })()),
        "rtn=" + s,
        "of=" + encodeURIComponent((o && o.of) || (_fwTpl && _fwTpl.of) || "MS3lEPwEKa0vQUe3qbeAVA"),
        "euri=",
        "lact=" +
          (o && null != o.lact
            ? o.lact
            : Math.floor(1500 * Math.random() + 200)),
        "mos=0",
        "volume=" + (o && null != o.volume ? o.volume : 100),
        "muted=" + (o && o.muted ? "1" : "0"),
        "subscribed=" + (o && o.subscribed ? "1" : "0"),
        "cbr=" + U.browser,
        "cbrver=" + U.bver,
        "c=WEB",
        "cver=" + encodeURIComponent(i.ver),
        "cplayer=UNIPLAYER",
        "cos=" + U.os,
        "cosver=" + (U.osver || "10.0"),
        "cplatform=DESKTOP",
        "hl=" + encodeURIComponent(i.hl),
        "cr=" + encodeURIComponent(i.gl),
        "len=" + (t && isFinite(t) ? Math.round(t * 1000) / 1000 : d),
        "cmt=" + c,
        "mt=" + c,
        "st=" + Math.max(0, c - s),
        "et=" + c,
        "lct=" + c,
        "lsct=" + c,
        "referrer=" +
          encodeURIComponent("https://www.youtube.com/watch?v=" + e),
        "plid=" + ((o && o.plid) || (_fwTpl && _fwTpl.plid) || Tt()),
        "state=" + (n || "paused"),
        "idpj=-2",
        "ldpj=-13",
        "cl=" + ((_fwTpl && _fwTpl.cl) || String(608e6 + Math.floor(1e6 * Math.random()))),
        "vm=" + ((o && o.vm) || (_fwTpl && _fwTpl.vm) || "CAEQARgB"),
        "vd=" + d,
        "fexp=" + ((o && o.fexp) || (_fwTpl && _fwTpl.fexp) || ""),
      ];
    return (
      i.visitorData && l.push("vis=" + encodeURIComponent(i.visitorData)),
      o && null != o.cdpj && l.push("cdpj=" + o.cdpj),
      l
    );
  }
  function Dt(e) {

    try {
      if (!/^https?:/i.test(String(e || ""))) return;
    } catch (e) {
      return;
    }
    try {
      navigator.sendBeacon && navigator.sendBeacon(e);
    } catch (e) {}
    try {
      fetch(e, {
        method: "GET",
        credentials: "include",
        mode: "no-cors",
        keepalive: !0,
        cache: "no-store",
      }).catch(() => {});
    } catch (e) {}
  }
  function qt(e, t, a, n, r, o, quiet) {
    try {
      const u2 =
        "https://www.youtube.com/api/stats/watchtime?" +
        Ht(e, t, a, n, r || Tt(), o).join("&");

      if (quiet) {
        let ok = false;
        try { ok = navigator.sendBeacon && navigator.sendBeacon(u2); } catch (e) {}
        if (!ok) {
          try {
            fetch(u2, { method: "GET", credentials: "include", mode: "no-cors", keepalive: !0, cache: "no-store" }).catch(() => {});
          } catch (e) {}
        }
      } else {
        Dt(u2);
      }
    } catch (e) {}
  }
  // Removed in 1.3.0: Vt (qoe beacons) — zero call sites.
  function _fwPageWin() {
    try { if (typeof unsafeWindow !== "undefined" && unsafeWindow && unsafeWindow !== window) return unsafeWindow; } catch (e) {}
    try { if (window && window.wrappedJSObject) return window.wrappedJSObject; } catch (e) {}
    return window;
  }
  function _fwExport(fn) { try { if (typeof exportFunction === "function") return exportFunction(fn); } catch (e) {} return fn; }
  const _RISKY_ACK_KEY = "yourtube_risky_warn_v1";
  const _riskyAckedNow = () => {
    try {
      if (typeof GM_getValue === "function" && GM_getValue(_RISKY_ACK_KEY)) return true;
    } catch (e) {}
    try { if (typeof localStorage !== "undefined" && localStorage.getItem(_RISKY_ACK_KEY)) return true; } catch (e) {}
    return false;
  };
  const _riskyActiveNow = () => {
    try {
      return !!S.forceWatchedAccountHistory ||
        !!(S.algoIntelligenceOn || S.algoAutoTrain || S.algoBoostOn || S.algoAutoLikeOn);
    } catch (e) { return false; }
  };
  const _riskyFlag = () => {
    try { if (typeof GM_setValue === "function") GM_setValue(_RISKY_ACK_KEY, 1); } catch (e) {}
    try { localStorage.setItem(_RISKY_ACK_KEY, "1"); } catch (e) {}
  };
  let _riskyPrompted = false;
  const _riskyPrompt = () => {
    try {
      pe("YourTube: Force Watched / Algorithm Intelligence sends synthetic watch signals to YouTube. Use only on your own account. (click to acknowledge)", 15000, "info");
      pe_bindClick(_riskyFlag);
    } catch (e) { _riskyFlag(); }
  };
  const _riskyGate = () => {
    if (_riskyAckedNow()) return true;
    if (!_riskyPrompted) { _riskyPrompted = true; _riskyPrompt(); }
    else { try { pe("Acknowledge the Force Watched / Algorithm Intelligence notice first (click the notice).", 2600, "info"); } catch (e) {} }
    return false;
  };

  function _fwDisarm(expectedVideoId) {
    try {
      const pw = _fwPageWin();
      if (!pw || !pw.__fwCtl) return;
      // Only disarm the campaign this call belongs to: a newer one may have
      // re-armed the controller in the meantime.
      if (expectedVideoId && pw.__fwCtl.videoId && pw.__fwCtl.videoId !== expectedVideoId) return;
      pw.__fwCtl.armed = false;
    } catch (e) {}
  }
  function _fwArm(len, videoId, cpn) {
    try { _fwInstallHooks(); } catch (e) {}
    try {
      const pw = _fwPageWin();
      pw.__fwCtl = {
        len: Math.round(len * 1000) / 1000,
        armed: true,
        until: Date.now() + 90000,
        videoId: String(videoId || ""),
        cpn: String(cpn || ""),
      };
    } catch (e) {}
  }
  function _fwInstallHooks() {
    try {
      const pw = _fwPageWin();
      if (!pw || pw.__fwHooked) return;
      pw.__fwHooked = 1;
      const armed = () => { try { const c = pw.__fwCtl; return !!(c && c.armed && Date.now() < c.until); } catch (e) { return false; } };
      const getLen = () => { try { return (pw.__fwCtl && pw.__fwCtl.len) || 0; } catch (e) { return 0; } };
      const isT = (u) => typeof u === "string" && u.indexOf("/api/stats/watchtime") >= 0;
      const isStats = (u) => typeof u === "string" && u.indexOf("/api/stats/") >= 0;
      const capture = (u) => { try { if (isStats(u)) _fwTplSet(u); } catch (e) {} };
      const rw = (u) => {
        try {
          const L = getLen(); if (!L) return u;
          const i = u.indexOf("?"); if (i < 0) return u;
          let qs = u.slice(i + 1);
          const qget = (k) => {
            const m = new RegExp("[?&]" + k + "=([^&]*)").exec(qs);
            return m ? decodeURIComponent(m[1]) : "";
          };
          let c = null;
          try { c = pw.__fwCtl; } catch (e) { c = null; }
          const campaignCpn = (c && c.cpn) || "";
          const campaignVid = (c && c.videoId) || "";
          const beaconCpn = qget("cpn");
          const beaconVid = qget("docid") || qget("video_id");
          if (campaignCpn && beaconCpn && beaconCpn !== campaignCpn) return u;
          if (campaignVid && beaconVid && beaconVid !== campaignVid) return u;
          const set = (k, v) => { const re = new RegExp("([?&])" + k + "=[^&]*"); if (re.test(qs)) qs = qs.replace(re, "$1" + k + "=" + v); else qs += "&" + k + "=" + v; };
          set("et", L); set("cmt", L); set("mt", L); set("st", Math.max(0, L - 1));
          if (/[?&]state=/.test(qs)) set("state", "ended"); else qs += "&state=ended";
          return u.slice(0, i + 1) + qs;
        } catch (e) { return u; }
      };
      try {
        const nav = pw.navigator;
        if (nav && nav.sendBeacon) {
          const ob = _fwExport(nav.sendBeacon.bind(nav));
          nav.sendBeacon = _fwExport(function (u, d) { try { capture(u); if (armed() && isT(u)) u = rw(u); } catch (e) {} return ob(u, d); });
        }
      } catch (e) {}
      try {
        if (pw.fetch) {
          const of = _fwExport(pw.fetch.bind(pw));
          pw.fetch = _fwExport(function (u, o) {
            try {
              const s = typeof u === "string" ? u : (u && u.url) || "";
              capture(s);
              if (armed()) {
                if (typeof u === "string" && isT(u)) u = rw(u);
                else if (u && u.url && isT(u.url)) {
                  const next = rw(u.url);
                  // Keep method, body and headers: only the URL is rewritten.
                  try { u = new Request(next, u); } catch (e) { u = next; }
                }
              }
            } catch (e) {}
            return of(u, o);
          });
        }
      } catch (e) {}
      try {
        const X = pw.XMLHttpRequest;
        if (X && X.prototype) {
          const oo = _fwExport(X.prototype.open);
          const os = _fwExport(X.prototype.send);
          X.prototype.open = _fwExport(function (m, u) { try { this.__fwM = m; this.__fwU = u; } catch (e) {} return oo.apply(this, arguments); });
          X.prototype.send = _fwExport(function () { try { capture(this.__fwU); if (armed() && this.__fwU && isT(this.__fwU)) { const nu = rw(this.__fwU); oo.call(this, this.__fwM || "GET", nu, true); } } catch (e) {} return os.apply(this, arguments); });
        }
      } catch (e) {}
    } catch (e) {}
  }
  function Ft(t, a) {
    let n = t && t.duration;
    if (n && isFinite(n) && n > 0.5) return n;
    try {
      if (
        a &&
        "function" == typeof a.getDuration &&
        ((n = a.getDuration()), n && isFinite(n) && n > 0.5)
      )
        return n;
    } catch (e) {}
    try {
      const t = e.ytInitialPlayerResponse;
      if (t && t.videoDetails && t.videoDetails.lengthSeconds)
        return parseFloat(t.videoDetails.lengthSeconds);
    } catch (e) {}
    try {
      const e = document.querySelector("span.ytp-time-duration");
      if (e) {
        const t = e.textContent.trim().split(":").map(Number);
        if (3 === t.length) return 3600 * t[0] + 60 * t[1] + t[2];
        if (2 === t.length) return 60 * t[0] + t[1];
      }
    } catch (e) {}
    return null;
  }
  let jt = !1,
    _fwRunSeq = 0,
    zt = 0;
  function Ut() {
    const e = Date.now();
    if (e - zt < 400) return;
    zt = e;
    try { if (typeof _isLiveStream !== "undefined" && _isLiveStream && _isLiveStream()) return void pe("Live streams can't be marked as watched.", 2000, "info"); } catch(_) {}
    if (typeof _riskyGate === "function" && !_riskyGate()) return;
    const t = ie.el(),
      a = ie.api(),
      n = ie.videoId();
    if (!n) return void pe("Open a video first.", 1800, "error");
    if (!t) return void pe("No video here yet.", 1800, "error");
    if (jt)
      return void pe("Already marking this one as watched…", 1200, "info");
    let r = Ft(t, a);
    if (r && isFinite(r) && r > 0.5) return void Kt(t, a, n, r);
    let o = 0;
    const i = setInterval(() => {
      ((r = Ft(t, a)),
        o++,
        ie.videoId() === n
          ? r && isFinite(r) && r > 0.5
            ? (clearInterval(i), Kt(t, a, n, r))
            : o > 60 &&
              (clearInterval(i),
              pe(
                "Couldn’t read the length yet - try again in a second.",
                2200,
                "error",
              ))
          : clearInterval(i));
    }, 50);
  }

  function Kt(e, t, a, n) {
    if (_isLiveStream()) {
      return void pe("Live streams can't be marked as watched.", 2000, "info");
    }
    jt = !0;
    const runToken = ++_fwRunSeq;

    const _fwSafety = setTimeout(() => {
      // Only release the guard for this run; a newer campaign owns it now.
      try { if (jt && runToken === _fwRunSeq) jt = !1; } catch (_) {}
    }, 60000);
    try { _fwSafety.unref && _fwSafety.unref(); } catch (_) {}


    if (!1 !== S.forceWatchedLocalHistory) {
      Promise.resolve().then(() => {
        try {
          Xe(a, {
            duration: n,
            title: ie.title(),
            channel: ie.channel(),
            channelId: Ne(),
            thumbnail: ie.thumb(a, "hqdefault"),
          });
        } catch (e) {
          h("fw histMarkWatched", e);
        }
      });
    }

  function _fwExtractJson(text, marker) {
    let start;
    if (marker instanceof RegExp) {
      const m = text.match(marker);
      if (!m) return null;
      start = m.index + m[0].length;
    } else {
      const at = text.indexOf(marker);
      if (at < 0) return null;
      start = at + marker.length;
    }
    let i = start;
    while (i < text.length && text[i] !== "{") i++;
    if (i >= text.length) return null;
    let depth = 0, inStr = false, esc = false;
    for (let j = i; j < text.length; j++) {
      const ch = text[j];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === "\\") esc = true;
        else if (ch === '"') inStr = false;
      } else if (ch === '"') inStr = true;
      else if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) { try { return JSON.parse(text.slice(i, j + 1)); } catch (_) { return null; } }
      }
    }
    return null;
  }

  function _fwParsePage() {
    const out = { apiKey: "", ver: "", hl: "", gl: "", visitor: "", ei: "", sts: 0, pr: null, cpn: "" };
    try {
      const scripts = document.querySelectorAll("script:not([src])");
      for (let sIdx = 0; sIdx < scripts.length && sIdx < 60; sIdx++) {
        const txt = scripts[sIdx].textContent || "";
        if (!txt || txt.length < 40) continue;
        if (!out.apiKey) { const m = txt.match(/"INNERTUBE_API_KEY":"([^"]+)"/); if (m) out.apiKey = m[1]; }
        if (!out.ver) { const m = txt.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/); if (m) out.ver = m[1]; }
        if (!out.visitor) { const m = txt.match(/"VISITOR_DATA":"([^"]+)"/); if (m) out.visitor = m[1]; }
        if (!out.ei) { const m = txt.match(/"EVENT_ID":"([^"]+)"/); if (m) out.ei = m[1]; }
        if (!out.sts) { const m = txt.match(/"STS":(\d+)/); if (m) out.sts = parseInt(m[1], 10) || 0; }
        if (!out.pr && txt.indexOf("ytInitialPlayerResponse") >= 0) {
          const pr = _fwExtractJson(txt, /ytInitialPlayerResponse\s*=\s*/);
          if (pr && pr.videoDetails) {
            out.pr = pr;
            out.cpn = (pr.playerConfig && pr.playerConfig.cpn) || "";
            if (!out.apiKey) { const m2 = txt.match(/"INNERTUBE_API_KEY":"([^"]+)"/); if (m2) out.apiKey = m2[1]; }
          }
        }
        if (out.apiKey && out.ver && out.pr) break;
      }
    } catch (e) {}
    try {
      const t = _t();
      if (!out.ver) out.ver = t.ver || "2.20250101.00.00";
      if (!out.hl) out.hl = t.hl || "en";
      if (!out.gl) out.gl = t.gl || "US";
      if (!out.visitor) out.visitor = t.visitorData;
      if (!out.ei) out.ei = t.ei;
    } catch (e) {}
    return out;
  }

  async function _fwSapisidHeader() {
    try {
      const m = String(document.cookie || "").match(/(?:^|;\s*)SAPISID=([^;]+)/);
      if (!m) return null;
      const ts = Math.floor(Date.now() / 1000);
      const data = ts + " " + m[1] + " https://www.youtube.com";
      const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(data));
      const hex = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
      return "SAPISIDHASH " + ts + "_" + hex;
    } catch (e) { return null; }
  }

  function _fwInnerTube(page, endpoint, payload, auth) {
    if (!page.apiKey) return Promise.resolve(null);
    const url = "https://www.youtube.com/youtubei/v1/" + endpoint + "?key=" + encodeURIComponent(page.apiKey) + "&prettyPrint=false";
    const headers = {
      "Content-Type": "application/json",
      "X-YouTube-Client-Name": "1",
      "X-YouTube-Client-Version": page.ver,
    };
    if (page.visitor) headers["X-Goog-Visitor-Id"] = page.visitor;
    if (auth) headers["Authorization"] = auth;
    if (typeof GM_xmlhttpRequest !== "function") {
      if (typeof fetch !== "function") return Promise.resolve(null);
      const signal = (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function")
        ? (() => { try { return AbortSignal.timeout(9000); } catch (_) { return undefined; } })()
        : undefined;
      return fetch(url, { method: "POST", headers: headers, body: JSON.stringify(payload), credentials: "include", signal })
        .then((r) => {
          if (!r.ok) return { status: r.status, json: null };
          return r.json().then((json) => ({ status: r.status, json })).catch(() => ({ status: r.status, json: null }));
        })
        .catch(() => null);
    }
    return new Promise((resolve) => {
      try {
        GM_xmlhttpRequest({
          method: "POST",
          url: url,
          headers: headers,
          data: JSON.stringify(payload),
          timeout: 9000,
          onload: (r) => { try { resolve({ status: r.status, json: JSON.parse(r.responseText) }); } catch (_) { resolve({ status: r.status, json: null }); } },
          onerror: () => resolve(null),
          ontimeout: () => resolve(null),
        });
      } catch (e) { resolve(null); }
    });
  }

  async function _fwHistoryHas(videoId, page) {
    const auth = await _fwSapisidHeader();
    if (!auth) return null;
    const resp = await _fwInnerTube(page, "browse", {
      context: { client: { clientName: "WEB", clientVersion: page.ver, hl: page.hl, gl: page.gl } },
      browseId: "FEhistory",
    }, auth);
    // undefined marks a transport failure (retry); null is a signed-out skip.
    if (!resp || !resp.json) return undefined;
    try { return JSON.stringify(resp.json).indexOf('"videoId":"' + videoId + '"') >= 0; } catch (e) { return false; }
  }

  async function _fwAdvanced(videoId, durFallback) {
    const stats = { attempts: 0, verified: false, beacons: 0, transport: "gmx" };
    if (typeof GM_xmlhttpRequest !== "function") { try { pe("Force Watched: GM transport unavailable", 2600, "error"); } catch (e) {} return stats; }
    const page = _fwParsePage();
    const buildTrack = (r, d) => ({
      playbackUrl: r.videostatsPlaybackUrl && r.videostatsPlaybackUrl.baseUrl,
      watchtimeUrl: r.videostatsWatchtimeUrl && r.videostatsWatchtimeUrl.baseUrl,
      atrUrl: r.atrUrl && r.atrUrl.baseUrl,
      qoeUrl: r.qoeUrl && r.qoeUrl.baseUrl,
      ptrackingUrl: r.ptrackingUrl && r.ptrackingUrl.baseUrl,
      delayplayUrl: r.videostatsDelayplayUrl && r.videostatsDelayplayUrl.baseUrl,
      engagedviewUrl: r.videostatsEngagedviewUrl && r.videostatsEngagedviewUrl.baseUrl,
      wtfUrl: r.videostatsWtfUrl && r.videostatsWtfUrl.baseUrl,
      lengthSec: d,
      extraUrls: (function () {
        const seen = { videostatsPlaybackUrl: 1, videostatsWatchtimeUrl: 1, atrUrl: 1, qoeUrl: 1, ptrackingUrl: 1, videostatsDelayplayUrl: 1, videostatsEngagedviewUrl: 1, videostatsWtfUrl: 1 };
        const outArr = [];
        try { for (const [k, v] of Object.entries(r)) if (v && v.baseUrl && !seen[k]) outArr.push(String(v.baseUrl)); } catch (e) {}
        return outArr;
      })(),
    });
    let track = null;
    if (page.pr && page.pr.playbackTracking) {
      track = buildTrack(page.pr.playbackTracking, parseInt((page.pr.videoDetails || {}).lengthSeconds || "0", 10) || 0);
    }
    if (!track || !track.watchtimeUrl) {
      const auth = await _fwSapisidHeader();
      const resp = await _fwInnerTube(page, "player", {
        context: { client: { clientName: "WEB", clientVersion: page.ver, hl: page.hl, gl: page.gl } },
        videoId: videoId, contentCheckOk: true, racyCheckOk: true,
      }, auth);
      if (resp && resp.json && resp.json.playbackTracking) {
        track = buildTrack(resp.json.playbackTracking, parseInt((resp.json.videoDetails || {}).lengthSeconds || "0", 10) || 0);
      }
    }
    const vEl = ie.el();
    const dur = (track && track.lengthSec > 0 ? track.lengthSec : 0) ||
      (vEl && isFinite(vEl.duration) && vEl.duration > 0 ? vEl.duration : 0) || durFallback || 0;
    if (!dur || !isFinite(dur) || dur <= 0) { try { pe("Force Watched: no finite duration (live?)", 2600, "info"); } catch (e) {} return stats; }
    if (!track || !track.watchtimeUrl) {
      try { pe("Force Watched: no tracking template for this video - nothing was sent.", 3200, "info"); } catch (e) {}
      return stats;
    }
    const cpn = Tt();
    const DU = Math.round(dur * 1000) / 1000;
    const UA = _fwUA();
    const t0 = _t();
    let cur0 = 0;
    try { cur0 = vEl && isFinite(vEl.currentTime) && vEl.currentTime > 0 ? Math.round(vEl.currentTime * 1000) / 1000 : 0; } catch (_) {}
    _fwArm(DU, videoId, cpn);
    try {
      if (vEl && !document.querySelector(".ad-showing,.ad-interrupting")) {
        try {
          const target = (isFinite(vEl.duration) && vEl.duration > 0) ? vEl.duration : DU;
          try { vEl.currentTime = target; } catch (_) { try { vEl.currentTime = Math.max(0, target - 0.001); } catch (e3) {} }
          try { vEl.dispatchEvent(new Event("timeupdate")); } catch (_) {}
          try { vEl.dispatchEvent(new Event("ended")); } catch (_) {}
          try {
            const pEl = document.getElementById("movie_player");
            if (pEl && typeof pEl.seekTo === "function") { try { pEl.seekTo(target, true); } catch (_) {} }
          } catch (_) {}
        } catch (_) {}
      }
    } catch (e) {}
    const clientBlock = {
      c: "WEB", cver: page.ver, cbr: UA.browser, cbrver: UA.bver, cos: UA.os, cosver: UA.osver || "10.0",
      hl: page.hl, cr: page.gl, mos: 0, fmt: _fwVfmt() || 243,
      volume: (function () { try { return Math.round((ie.el().volume || 1) * 100); } catch (e) { return 100; } })(),
      muted: (function () { try { return ie.el().muted ? 1 : 0; } catch (e) { return 0; } })(),
    };
    const beaconPromises = [];
    const fire = (u2, params) => {
      try {
        let sUrl = String(u2 || "");
        if (!sUrl || !/^https:/i.test(sUrl)) return;
        try {
          const _p = new URL(sUrl, location.href);
          if (!(_p.hostname === "www.youtube.com" || _p.hostname === "youtube.com" || _p.hostname === "s.youtube.com")) return;
        } catch (_) { return; }
        sUrl = Za(sUrl, "cpn", cpn);
        const o2 = Object.assign({}, clientBlock, params || {});
        for (const k of ["cmt", "et", "st", "mt", "rt", "lact", "state", "c", "cver", "cbr", "cbrver", "cos", "cosver", "hl", "cr", "mos", "fmt", "volume", "muted"])
          if (null != o2[k]) sUrl = Za(sUrl, k, o2[k]);
        beaconPromises.push(new Promise((resolve) => {
          try {
            GM_xmlhttpRequest({
              method: "GET", url: sUrl, timeout: 8000,
              onload: resolve, onerror: resolve, ontimeout: resolve,
            });
          } catch (_) { resolve(); }
        }));
        stats.beacons++;
      } catch (e) {}
    };
    const rtNow = () => { try { return (performance.now() / 1000).toFixed(3); } catch (_) { return String(Math.max(1, Math.floor(DU))); } };
    for (let attempt = 1; attempt <= 4 && !stats.verified; attempt++) {
      stats.attempts = attempt;
      beaconPromises.length = 0;
      const rtBase = cur0 + 1 + Math.random();
      fire(track.playbackUrl, { cmt: 0, rt: rtNow(), lact: 1200 + Math.floor(900 * Math.random()) });
      fire(track.atrUrl, { cmt: 0, rt: rtNow(), lact: 700 });
      fire(track.delayplayUrl, {});
      fire(track.watchtimeUrl, { cmt: cur0, et: cur0, st: 0, mt: cur0, rt: rtBase.toFixed(3), lact: 400, state: "playing" });
      fire(track.qoeUrl, { cmt: cur0, rt: rtNow() });
      fire(track.watchtimeUrl, { cmt: DU, et: DU, st: Math.max(0, DU - 1), mt: DU, rt: (rtBase + 1).toFixed(3), lact: 300, state: "playing" });
      fire(track.engagedviewUrl, { cmt: DU, et: DU, st: Math.max(0, DU - 1), rt: (rtBase + 1.5).toFixed(3), state: "playing" });
      try { for (const eu of track.extraUrls || []) fire(eu, { cmt: DU, rt: rtNow() }); } catch (e) {}
      fire(track.ptrackingUrl, {});
      fire(track.wtfUrl, {});
      fire(track.qoeUrl, { cmt: DU, rt: rtNow() });
      fire(track.watchtimeUrl, { cmt: DU, et: DU, st: Math.max(0, DU - 1), mt: DU, rt: (rtBase + 2).toFixed(3), lact: 30, state: "ended" });
      fire(track.qoeUrl, { cmt: DU, rt: rtNow() });
      // Let the beacons settle before asking the account history whether they
      // landed; otherwise the first verification always races them.
      try { await Promise.allSettled(beaconPromises); } catch (_) {}
      const has = await _fwHistoryHas(videoId, page);
      if (has === null) { stats.verified = "skipped"; break; }
      if (has === true) { stats.verified = true; break; }
      if (has === undefined) stats.transportFailed = true;
      if (attempt < 4) {
        try { pe("Force Watched: not in history yet, retry " + attempt + "/4", 2000, "info"); } catch (e) {}
        await new Promise((r) => setTimeout(r, 3000 * attempt));
      }
    }
    try {
      pe(stats.verified === true
        ? "Force Watched: verified in account history"
        : stats.verified === "skipped"
          ? "Force Watched: campaign complete (signed-out, verification skipped)"
          : "Force Watched: campaign complete, history check pending", 3400, stats.verified === true ? "success" : "info");
    } catch (e) {}
    try { u("fw advanced " + JSON.stringify(stats) + " for " + videoId + " (ei " + (t0.ei || "none") + ")"); } catch (e) {}
    try { _fwDisarm(videoId); } catch (e) {}
    return stats;
  }

    if (!1 !== S.forceWatchedAccountHistory) {
      Promise.resolve().then(() => {
        _fwAdvanced(a, n).then(
          () => { try { if (runToken === _fwRunSeq) jt = !1; } catch (_) {} },
          (er) => { try { h("fw advanced", er); } catch (_) {} try { if (runToken === _fwRunSeq) jt = !1; } catch (_) {} },
        );
      });
    } else if (!1 === S.forceWatchedLocalHistory) {
      try { if (runToken === _fwRunSeq) jt = !1; } catch (_) {}
      try { pe("Force Watched: turn on account history and/or local history for this to do anything.", 3200, "info"); } catch (_) {}
    } else {
      // Account history off, local history on: nothing to verify, so release
      // the guard immediately instead of leaving it latched for a minute.
      try { if (runToken === _fwRunSeq) jt = !1; } catch (_) {}
      try { pe("Force Watched: marked in local history only (account verification is off).", 3200, "info"); } catch (_) {}
    }
  }
  const Yt = {};
  let Gt = 0;
  var Xt = {
    visible:
      "undefined" == typeof document || "visible" === document.visibilityState,
    focused: "undefined" == typeof document || document.hasFocus(),
    saveData: !1,
    batteryLow: !1,
    cpuConstrained:
      "undefined" != typeof navigator &&
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency <= 4,
    lowMemory:
      "undefined" != typeof navigator &&
      navigator.deviceMemory &&
      navigator.deviceMemory <= 4,
    perfMode: !1,
    perfLevel: "balanced",
  };
  let Zt = 0;
  try {
    const e = () => {
      Zt = performance.now();
    };
    (window.addEventListener("scroll", e, { passive: !0, capture: !0 }),
      window.addEventListener("wheel", e, { passive: !0, capture: !0 }),
      window.addEventListener("touchmove", e, { passive: !0, capture: !0 }));
  } catch (e) {}
  try {
    "undefined" != typeof navigator &&
      (navigator.connection &&
        ((Xt.saveData = !!navigator.connection.saveData),
        navigator.connection.addEventListener &&
          navigator.connection.addEventListener("change", () => {
            Xt.saveData = !!navigator.connection.saveData;
          })),
      navigator.getBattery &&
        navigator
          .getBattery()
          .then((e) => {
            const t = () => {
              Xt.batteryLow = !e.charging && e.level < 0.25;
            };
            (t(),
              e.addEventListener && e.addEventListener("levelchange", t),
              e.addEventListener && e.addEventListener("chargingchange", t));
          })
          .catch(() => {}));
  } catch (e) {}
  function Qt() {
    let e = 1;
    return (
      Xt.visible || (e *= 8),
      Xt.focused || (e *= 1.5),
      Xt.batteryLow && (e *= 2),
      Xt.saveData && (e *= 1.5),
      Xt.cpuConstrained && (e *= 1.4),
      Xt.lowMemory && (e *= 1.2),
      e
    );
  }
  const Jt = new Map();
  let $t = 1;
  const ea = new Map(),
    ta = new Map();
  function aa(e, t, a) {
    if (!e) return;
    let n = ta.get(e);
    (n ||
      ((n = {
        intervals: 0,
        observers: 0,
        listeners: 0,
        applies: 0,
        totalMs: 0,
        maxMs: 0,
        lastMs: 0,
        lastT: 0,
      }),
      ta.set(e, n)),
      "interval" === t
        ? n.intervals++
        : "observer" === t
          ? n.observers++
          : "apply" === t && n.applies++,
      (n.totalMs += a),
      (n.lastMs = a),
      (n.lastT = performance.now()),
      a > n.maxMs && (n.maxMs = a));
  }
  function na(e) {
    const t = e.baseMs,
      a = Qt(),
      n = Math.max(150, Math.round(t * a * e.backoff)),
      r = setTimeout(() => {
        if ((ea.delete(e.id), !Jt.has(e.id))) return;
        let t = !1;
        const a = performance.now();
        try {
          (e.pauseWhenHidden && !Xt.visible) ||
            (e.skipWhenPopup && _a()) ||
            (t = !1 !== e.fn());
        } catch (t) {
          m("perfInterval " + e.featureId, t);
        }
        const n = performance.now() - a;
        (S.perfProfilerOn && aa(e.featureId, "interval", n),
          n > 12 && e.backoff < 4
            ? (e.backoff = Math.min(4, 1.3 * e.backoff))
            : t && e.backoff > 1
              ? (e.backoff = Math.max(1, 0.8 * e.backoff))
              : !t &&
                e.backoff < 3 &&
                (e.backoff = Math.min(3, 1.15 * e.backoff)),
          na(e));
      }, n);
    ea.set(e.id, r);
  }
  const ra = new Set();
  let oa = null,
    ia = 0;
  (document.addEventListener(
    "visibilitychange",
    () => {
      ((Xt.visible = "visible" === document.visibilityState),
        Xt.visible &&
          ra.size &&
          requestAnimationFrame(() => {
            for (const e of ra)
              try {
                e();
              } catch (e) {}
          }));
    },
    { passive: !0 },
  ),
    window.addEventListener(
      "focus",
      () => {
        Xt.focused = !0;
      },
      { passive: !0 },
    ),
    window.addEventListener(
      "blur",
      () => {
        Xt.focused = !1;
      },
      { passive: !0 },
    ));
  const da = new Map();
  function ca(e, t) {
    const a = da.get(e);
    if (a && performance.now() - a.t < (t || 800)) return a.v;
    const n = document.querySelector(e);
    if ((da.set(e, { v: n, t: performance.now() }), da.size > 50)) {
      const e = da.keys().next().value;
      da.delete(e);
    }
    return n;
  }
  let sa = !1;
  const la = [];
  function pa(e) {
    (la.push(e),
      sa ||
        ((sa = !0),
        requestAnimationFrame(() => {
          sa = !1;
          const e = la.splice(0);
          for (const t of e)
            try {
              t();
            } catch (e) {
              m("rafBatch", e);
            }
        })));
  }
  function ua(e) {
    Yt[e] = Yt[e] || [];
    const t = Yt[e];
    let a = null;
    const _ids = new Set();
    return {
      addStyle(n) {
        if (a) return ((a.textContent += "\n" + n), a);
        const r = "ytb-style-" + e + "-" + ++Gt,
          o = document.createElement("style");
        o.id = r;
        o.textContent = n;
        (document.head || document.documentElement).appendChild(o);

        try {
          (xa._styleIds || (xa._styleIds = new Set())).add(r);
          if (xa._styleIds.size > 400) {
            for (const _sid of Array.from(xa._styleIds)) {
              try { if (!document.getElementById(_sid)) xa._styleIds.delete(_sid); } catch (_) {}
            }
            if (xa._styleIds.size > 400) xa._styleIds.clear();
          }
        } catch (_) {}
        _ids.add(r);
        a = o;
        t.push(() => {
          try {
            o.remove();
          } catch (e) {}
          try { xa._styleIds && xa._styleIds.delete(r); } catch (_) {}
          try { _ids.delete(r); } catch (_) {}
          a = null;
        });
        return o;
      },
      addListener(a, n, r, o) {
        try {
          if (!a || "function" != typeof a.addEventListener) return;
          const i = function (t) {
              try {
                return r(t);
              } catch (t) {
                fa(e, t);
              }
            },
            d =
              o && "object" == typeof o
                ? o
                : "wheel" === n ||
                    "scroll" === n ||
                    "touchstart" === n ||
                    "touchmove" === n ||
                    "mousemove" === n ||
                    "pointermove" === n
                  ? { passive: !0 }
                  : o;
          (a.addEventListener(n, i, d),
            t.push(() => {
              try {
                a.removeEventListener(n, i, d);
              } catch (e) {}
            }));
        } catch (t) {
          fa(e, t);
        }
      },
      addObserver(a, n, r) {
        try {
          if (!a) return;
          const i = () => {
            if (Xt.visible && !_a())
                try {
                  const _r = n();
                  if (_r && typeof _r.then === "function") _r.catch((t) => fa(e, t));
                } catch (t) {
                  fa(e, t);
                }
          };
          if (a === document.body && r && r.childList && r.subtree) {
            const e =
              ((o = i),
              !oa &&
                document.body &&
                ((oa = new MutationObserver(() => {
                  ia ||
                    (ia = requestAnimationFrame(() => {
                      if (((ia = 0), Xt.visible && !_a()))
                        for (const e of ra)
                          try {
                            e();
                          } catch (e) {
                            m("domObs sub", e);
                          }
                    }));
                })),
                oa.observe(document.body, { childList: !0, subtree: !0 })),
              ra.add(o),
              () => {
                if ((ra.delete(o), 0 === ra.size && oa)) {
                  try {
                    oa.disconnect();
                  } catch (e) {}
                  oa = null;
                }
              });
            return void t.push(e);
          }
          const d = new MutationObserver(i);
          (d.observe(a, r),
            t.push(() => {
              try {
                d.disconnect();
              } catch (e) {}
            }));
        } catch (t) {
          fa(e, t);
        }
        var o;
      },
      addInterval(a, n, r) {
        const o = $t++,
          i = {
            id: o,
            featureId: e,
            fn: function () {
              try {
                const _r = a();
                if (_r && typeof _r.then === "function") _r.catch((t) => fa(e, t));
                return _r;
              } catch (t) {
                fa(e, t);
              }
            },
            baseMs: n,
            backoff: 1,
            pauseWhenHidden: !1 !== (r = r || {}).pauseWhenHidden,
            skipWhenPopup: !1 !== r.skipWhenPopup,
          };
        return (
          Jt.set(o, i),
          na(i),
          t.push(() =>
            (function (e) {
              const t = ea.get(e);
              (t && (clearTimeout(t), ea.delete(e)), Jt.delete(e));
            })(o),
          ),
          o
        );
      },
      addTimeout(a, n) {
      const r = setTimeout(function () {
          try {
            const _r = a();
            if (_r && typeof _r.then === "function") _r.catch((t) => fa(e, t));
            return _r;
          } catch (t) {
            fa(e, t);
          }
      }, n);
        return (t.push(() => clearTimeout(r)), r);
      },
      addRAF(a) {
        let n = 0,
          r = !0;
        const o = () => {
          if (r)
            if (Xt.visible) {
              try {
                a();
              } catch (t) {
                fa(e, t);
              }
              n = requestAnimationFrame(o);
            } else n = setTimeout(o, 250);
        };
        ((n = requestAnimationFrame(o)),
          t.push(() => {
            r = !1;
            try {
              cancelAnimationFrame(n);
            } catch (e) {}
            try {
              clearTimeout(n);
            } catch (e) {}
          }));
      },
      onNav(a) {
        const n = g.on("nav.changed", (...t) => {
          try {
            return a(...t);
          } catch (t) {
            fa(e, t);
          }
        });
        t.push(n);
      },
    };
  }
  function ha(e) {
    const t = Yt[e];
    if (t && t.length) {
      for (let a = t.length - 1; a >= 0; a--)
        try {
          t[a]();
        } catch (t) {
          try {
            h("teardown " + e, t && t.message);
          } catch (e) {}
        }
      Yt[e] = [];
    } else Yt[e] = [];
  }
  const ma = 3,
    ya = new Map(),
    ga = new Set();
  function fa(e, t) {
    const a = (ya.get(e) || 0) + 1;
    ya.set(e, a);
    try {
      m("apply " + e + " #" + a, t);
    } catch (e) {}
    if (a >= ma && !ga.has(e)) {
      ga.add(e);
      try {
        m('[YourTube] feature "' + e + '" quarantined after ' + a + " crashes");
      } catch (e) {}
      try {
        ha(e);
      } catch (e) {}
      try {
        pe(
          "“" + e + "” ran into trouble and was turned off for now.",
          4e3,
          "error",
        );
      } catch (e) {}
    }
  }
  function ba(e) {
    return ga.has(e);
  }
  const va = new Map(),
    ka = new Map(),
    xa = {
      register(e) {
        if (
          (va.set(e.id, e),
          e.masterKey &&
            (ka.has(e.masterKey) || ka.set(e.masterKey, []),
            ka.get(e.masterKey).push(e)),
          e.keys)
        )
          for (const t of e.keys)
            t !== e.masterKey &&
              (ka.has(t) || ka.set(t, []), ka.get(t).push(e));
      },
      list: () => Array.from(va.values()),
      get: (e) => va.get(e),
      apply(e) {
        const t = va.get(e);
        if (!t) return;
        if (ba(e)) return;
        if (_a())
          return (
            xa._deferred || (xa._deferred = new Set()),
            xa._deferred.add(e),
            void (
              xa._deferTimer ||
              (xa._deferTimer = setInterval(function () {
                if (_a()) return;
                (clearInterval(xa._deferTimer), (xa._deferTimer = 0));
                const e = xa._deferred;
                ((xa._deferred = null),
                  e &&
                    e.forEach(function (e) {
                      xa.apply(e);
                    }));
              }, 300))
            )
          );
        try {
          ha(e);
        } catch (t) {
          return void fa(e, t);
        }
        const a = S.perfProfilerOn ? performance.now() : 0;
        try {
          const a = t.apply(ua(e));
          a && "function" == typeof a.then && a.catch((t) => fa(e, t));
          // A clean apply clears the crash counter: quarantine should reflect
          // repeated current failures, not a lifetime tally.
          ya.delete(e);
        } catch (t) {
          fa(e, t);
        }
        if (S.perfProfilerOn)
          try {
            aa(e, "apply", performance.now() - a);
          } catch (e) {}
      },
      isQuarantined: ba,
      clearQuarantine(e) {
        e ? (ga.delete(e), ya.delete(e)) : (ga.clear(), ya.clear());
      },
      applyAll() {
        if (_a())
          return void (
            xa._applyAllTimer ||
            (xa._applyAllTimer = setTimeout(function () {
              ((xa._applyAllTimer = 0), xa.applyAll());
            }, 400))
          );
        const e = Array.from(va.values()),
          t = [],
          a = [];
        for (const n of e)
          ("function" == typeof n.settings && n.settings.length > 0
            ? a
            : t
          ).push(n);
        const n = t.concat(a);
        let r = 0;
        const o = Xt.cpuConstrained || Xt.lowMemory || Xt.perfMode || S.perfModeOn ? 3 : 6;
        (async () => {
          for (; r < n.length; ) {
            const e = Math.min(r + o, n.length);
            for (; r < e; r++) xa.apply(n[r].id);
            r < n.length && (await ne());
          }
        })();
      },
    };
  let wa = null;
  function Ca() {
    if (!wa) return;
    const e = Array.from(wa);
    ((wa = null),
      ae(() => {
        (async () => {
          for (let t = 0; t < e.length; t++)
            (xa.apply(e[t]), (t + 1) % 3 == 0 && (await ne()));
        })();
      }, 50));
  }
  function Sa(e) {
    "feedWatchedMode" === e
      ? ((S.feedDimWatchedOn = "dim" === S.feedWatchedMode),
        (S.feedHideWatchedOn = "hide" === S.feedWatchedMode))
      : "autoPauseMode" === e
        ? ((S.autoPauseHiddenOn =
            "hidden" === S.autoPauseMode || "both" === S.autoPauseMode),
          (S.autoPauseBlurOn =
            "blur" === S.autoPauseMode || "both" === S.autoPauseMode))
        : "highlightVideoLengthMode" === e
          ? ((S.highlightLongVideosOn =
              "long" === S.highlightVideoLengthMode ||
              "both" === S.highlightVideoLengthMode),
            (S.highlightShortVideosOn =
              "short" === S.highlightVideoLengthMode ||
              "both" === S.highlightVideoLengthMode))
          : "privacyPreset" === e &&
            ((S.privacyShieldOn =
              "stealth" === S.privacyPreset || "maximum" === S.privacyPreset),
            (S.safeMode = "maximum" === S.privacyPreset),
            // The presets printed promises the keys did not keep: Stealth says
            // "no traffic monitoring", Maximum says "no network calls". Turn
            // the monitoring/instrumentation switches off persistently when a
            // stricter preset is chosen so the label is true. Switching back
            // to Everyday never re-enables anything on its own.
            ("stealth" === S.privacyPreset || "maximum" === S.privacyPreset) &&
              (_privacyPresetClamp(),
              Y(),
              pe(
                "stealth" === S.privacyPreset
                  ? "Stealth preset: traffic-monitoring features were turned off."
                  : "Maximum preset: monitoring and all outbound calls were turned off.",
                3500,
                "info",
              )));
  }

  // Switches that violate the stated contract of the stricter presets.
  const _privacyPresetClamp = () => {
    const OFF_STEALTH = [
      "netMonitorOn", "netBudgetOn", "netQualityAttribOn",
      "sessionReplay", "apiExplorer", "apiExplorerMutations",
      "netMonitorBadge", "diagConsole", "statsOverlay",
    ];
    for (const k of OFF_STEALTH) S[k] = false;
    if ("maximum" === S.privacyPreset) {
      // Also nothing that phones home: update checks are additionally gated at
      // runtime in Fu(); SponsorBlock/RYD/DeArrow are gated in he()/fetchJson().
      S.updateCheckOn = false;
    }
  };
  const _FORBIDDEN_CFG_KEYS = { __proto__: 1, constructor: 1, prototype: 1 };
  function Ta(e, t) {
    if (_FORBIDDEN_CFG_KEYS[e]) return;
    const _cfgWasLoaded = T;
    if (S[e] === t) {
      if (!T && z() && S[e] === t) return;
      if (T) return;
    }
    ((S[e] = t),
      Sa(e),
      Y(),
      "silentToasts" === e && ue(),
      _cfgWasLoaded || (() => { try { _bootTouched.set(e, t); } catch (_) {} })(),
      (() => { try { _localEdits.set(e, Date.now()); } catch (_) {} })(),
      wa || ((wa = new Set()), queueMicrotask(Ca)));
    const a = ka.get(e);
    if (a) for (const e of a) wa.add(e.id);
    g.emit("cfg.changed", { key: e, val: t });
  }
  function Oa(e) {
    const _cfgWasLoaded = T;
    T || z();
    const t = new Set();
    for (const a of Object.keys(e)) {
      if (_FORBIDDEN_CFG_KEYS[a]) continue;
      S[a] !== e[a] && ((S[a] = e[a]), t.add(a));
    }
    if (!t.size) return;
    if (!_cfgWasLoaded) { for (const k of t) { try { _bootTouched.set(k, S[k]); } catch (_) {} } }
    try { const _now = Date.now(); for (const k of t) _localEdits.set(k, _now); } catch (_) {}
    for (const e of t) Sa(e);
    (Y(), t.has("silentToasts") && ue());
    const a = new Set();
    for (const e of t)
      for (const t of va.values())
        (t.masterKey !== e && -1 === (t.keys || []).indexOf(e)) || a.add(t.id);
    setTimeout(() => {
      for (const e of a) xa.apply(e);
      for (const e of t) g.emit("cfg.changed", { key: e, val: S[e] });
    }, 200);
  }
  (xa.register({
    id: "speed-controller",
    name: "Playback Speed",
    summary: "Applies a default rate and remembers per-session changes.",
      cat: "playback",
    masterKey: "speedRemember",
    keys: ["speedDefault", "speedRemember", "speedStep"],
    apply(e) {
      const t = Math.max(0.0625, Math.min(16, Number(S.speedDefault) || 1)),
        a = () => {
          const el = ie.el();

          if (el && _isLiveStream()) return;
          el && Math.abs(el.playbackRate - t) > 0.01 && (el.playbackRate = t);
        };
      if ((a(), !S.speedRemember && 1 === S.speedDefault)) return;

      const boundEls = new WeakSet();
      const n = () => {
        const t = ie.el();
        t && !boundEls.has(t) &&
          (boundEls.add(t),
          e.addListener(t, "loadedmetadata", a),
          e.addListener(t, "play", a));
      };
      (n(),
        e.onNav(() => {
          (e.addTimeout(ag, 800), e.addTimeout(n, 1200));
        }));
    },
    settings(e) {
      (e.appendChild(
        Ro(
          "Default speed",
          "speedDefault",
          Object.fromEntries(
            [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4].map((e) => [
              e,
              e + "x",
            ]),
          ),
        ),
      ),
        e.appendChild(
          Ro("Hotkey step (Alt+Shift+, / Alt+Shift+.)", "speedStep", {
            0.05: "±0.05x",
            0.1: "±0.1x",
            0.25: "±0.25x (default)",
            0.5: "±0.5x",
            1: "±1x",
          }),
        ));
    },
  }),
    xa.register({
      id: "speed-per-channel",
      name: "Per-Channel Speed",
      summary: "Stores one playback rate per channel; overrides the global default.",
      cat: "playback",
      masterKey: "speedPerChannelOn",
      keys: ["speedPerChannelOn"],
      apply(e) {
        if (!S.speedPerChannelOn) return;

        let _spdLastVid = "";
        const _rd = () =>
          v("kv", "__perChannelSpeed__").then((r) =>
            r && "object" == typeof r.v && r.v ? r.v : {},
          );
        const _wr = (map) =>
          k("kv", { k: "__perChannelSpeed__", v: map, updatedAt: Date.now() });

        let _wrChain = Promise.resolve();
        const _save = () => {
          const t = ie.el();
          if (!t || _isLiveStream()) return;
          const ch = Ne();
          if (!ch || !isFinite(t.playbackRate)) return;
          _wrChain = _wrChain
            .then(() =>
              _rd().then((m) => {
                const keys = Object.keys(m);
                if (keys.length >= 200) {
                  keys.sort(
                    (a2, b2) =>
                      ((m[a2] && m[a2].ts) || 0) - ((m[b2] && m[b2].ts) || 0),
                  );
                  for (const k2 of keys.slice(0, 50)) delete m[k2];
                }
                m[ch] = { r: t.playbackRate || 1, ts: Date.now() };
                return _wr(m);
              }),
            )
            .catch(() => {});
        };
        const _restore = () => {
          const t = ie.el(),
            vid = ie.videoId();
          if (!t || !vid || vid === _spdLastVid) return;
          const ch = Ne();
          if (!ch) return;

          _spdLastVid = vid;
          _rd()
            .then((m) => {
              const rec = m && m[ch];
              if (
                rec &&
                isFinite(rec.r) &&
                Math.abs((t.playbackRate || 1) - rec.r) > 0.01
              ) {
                if (_isLiveStream()) return;

                t.playbackRate = rec.r;
                pe(
                  "Speed restored to " + rec.r + "x for this channel",
                  1500,
                  "info",
                );
              }
            })
            .catch(() => {});
        };

        e.addListener(
          document,
          "ratechange",
          (ev) => {
            if (ev.target === ie.el()) _save();
          },
          !0,
        );
        e.addListener(
          document,
          "loadedmetadata",
          (ev) => {
            if (ev.target === ie.el()) e.addTimeout(_restore, 600);
          },
          !0,
        );
        e.onNav(() => {
          ((_spdLastVid = ""), e.addTimeout(_restore, 1200));
        });
        e.addTimeout(_restore, 1500);
      },
      settings() {},
    }),
    xa.register({
      id: "loop-video",
      name: "Loop Video",
      summary: "Restarts the video at end; toggleable from the player bar.",
      cat: "playback",
      masterKey: "loopVideo",
      keys: ["loopVideo"],
      apply(e) {
        if (!S.loopVideo) {
          const e = ie.el();
          return void (e && (e.loop = !1));
        }
        const t = () => {
          const e = ie.el();
          e && (e.loop = !0);
        };
        t();
        const boundEls = new WeakSet();
        const a = () => {
          const a = ie.el();
          a && !boundEls.has(a) && (boundEls.add(a), e.addListener(a, "loadedmetadata", t));
        };
        (a(),
          e.onNav(() => {
            (e.addTimeout(t, 800), e.addTimeout(a, 1200));
          }));
      },
      settings() {},
    }),
    xa.register({
      id: "ab-repeat",
      name: "A/B Loop",
      summary: "Loops between two player timestamps; markers set from the player bar or Alt+A.",
      cat: "playback",
      masterKey: "abLoopOn",
      keys: ["abLoopOn", "abA", "abB"],
      apply(e) {
        if (!S.abLoopOn) return;
        const t = () => {
            if (S.abA < 0 || S.abB <= S.abA) return;
            const e = ie.el();

            if (!e || _isLiveStream()) return;
            if (jt) return;
            if (e.currentTime >= S.abB) {
              try { e.currentTime = S.abA; } catch (_) { return; }
              if (e.paused) e.play().catch(() => {});
            }
          },
          boundEls = new WeakSet(),
          a = () => {
            const a = ie.el();

            if (!a || boundEls.has(a)) return;
            boundEls.add(a);
            e.addListener(a, "timeupdate", t);
          };
        (a(), e.onNav(() => e.addTimeout(a, 1200)));
      },
      settings(e) {
        e.appendChild(
          Ao([
            [
              "Set A",
              () => {
                const e = ie.el();
                e && Ta("abA", e.currentTime);
              },
            ],
            [
              "Set B",
              () => {
                const e = ie.el();
                e && Ta("abB", e.currentTime);
              },
            ],
            ["Clear", () => Oa({ abA: -1, abB: -1 })],
          ]),
        );
      },
    }),
    xa.register({
      id: "auto-hd",
      name: "Preferred Quality Lock",
      summary: "Re-asserts your chosen resolution whenever YouTube downgrades it.",
      cat: "playback",
      masterKey: "autoHD",
      keys: ["autoHD", "qualityPref"],
      apply(e) {
        if (!S.autoHD) return;
        const t = () => {
          const e = ie.levels();
          if (!e.length) return;
          const lv = e.filter((q) => q && "auto" !== q);
          let t = S.qualityPref;
          if (-1 === e.indexOf(t)) {
            const rank = ["hd2160", "hd1440", "hd1080", "hd720", "large", "medium", "small", "tiny"];
            const want = rank.indexOf(t);
            const ordered = rank.filter((r) => lv.indexOf(r) !== -1);
            const atOrBelow = want >= 0 ? ordered.filter((r) => rank.indexOf(r) >= want) : [];
            t = atOrBelow[0] || ordered[0] || lv[0] || t;
          }
          try {
            ie.setQuality(t);
          } catch (e) {}
        };
        t();
        const boundEls = new WeakSet();
        const a = () => {
          const a = ie.el();
          a && !boundEls.has(a) &&
            (boundEls.add(a),
            e.addListener(a, "loadedmetadata", t),
            e.addListener(a, "loadeddata", t));
        };
        (a(),
          e.onNav(() => {
            (e.addTimeout(t, 1500), e.addTimeout(a, 1500));
          }));
      },
      settings(e) {
        e.appendChild(Ro("Quality", "qualityPref", d));
      },
    }),

    (0));


    const Ma = {
    manualOffForVid: null,
    lastEngagedVid: null,
    lastTrackVid: null,
    lastEngageT: 0,
    awaitingResume: !1,
    awaitingResumeVid: null,
    awaitingResumeSince: 0,
    lastVerifyFix: 0,
  };
  function La() {
    if (!S.forceCC) return !1;
    if (
      S.ccSkipMusic &&
      (function () {
        try {
          if (/(^|\.)music\.youtube\.com$/i.test(location.hostname)) return !0;
          const t = e.ytInitialPlayerResponse,
            a =
              t &&
              t.microformat &&
              t.microformat.playerMicroformatRenderer &&
              t.microformat.playerMicroformatRenderer.category;
          if ("string" == typeof a && /music/i.test(a)) return !0;
        } catch (e) {}
        return !1;
      })()
    )
      return !1;
    if (S.ccSkipShorts && /^\/shorts\//i.test(location.pathname)) return !1;
    const t = ie.videoId();
    return !S.ccRespectManualOff || !t || Ma.manualOffForVid !== t;
  }
  function Aa() {
    if (!S.forceCC || !S.ccNativePrefs) return;
    const e = ie.api();
    if (e) {
      try {
        e.loadModule && e.loadModule("captions");
      } catch (e) {}
      try {
        if (e.setOption) {
          e.setOption(
            "captions",
            "fontSize",
            (function (e) {
              const t = Number(e) || 28;
              return t <= 18
                ? -2
                : t <= 23
                  ? -1
                  : t <= 30
                    ? 0
                    : t <= 38
                      ? 1
                      : t <= 48
                        ? 2
                        : 3;
            })(S.ccFontSize),
          );
          e.setOption(
            "captions",
            "fontFamily",
            S.ccFontFamily || "Roboto, Arial, sans-serif",
          );
          e.setOption("captions", "fontColor", S.ccTextColor || "#ffffff");
          e.setOption("captions", "bgColor", S.ccBgColor || "#000000");
          e.setOption(
            "captions",
            "bgOpacity",
            Math.max(0, Math.min(100, Number(S.ccBgOpacity) || 0)) / 100,
          );
          e.setOption(
            "captions",
            "edgeStyle",
            S.ccTextShadow === "none"
              ? 0
              : S.ccTextShadow === "soft"
                ? 1
                : S.ccTextShadow === "heavy"
                  ? 2
                  : 4,
          );
        }
      } catch (e) {}
    }
  }
  function Ea() {
    if (!La()) return !1;
    const t = ie.api();
    if (!t || "function" != typeof t.setOption) return !1;
    const a = (function () {
        try {
          const e = ie.api();
          if (e && "function" == typeof e.getOption) {
            const t = e.getOption("captions", "tracklist", { includeAsr: !0 });
            if (Array.isArray(t) && t.length) return t;
          }
        } catch (e) {}
        try {
          const t = e.ytInitialPlayerResponse,
            a = t && t.captions && t.captions.playerCaptionsTracklistRenderer;
          if (a && Array.isArray(a.captionTracks)) return a.captionTracks;
        } catch (e) {}
        return [];
      })(),
      n = (function (e) {
        if (!e || !e.length) return null;
        const t = [
          S.forceCCLang,
          ...((a = S.ccFallbackLangs),
          String(a || "")
            .split(/[,\s]+/)
            .map((e) => e.trim())
            .filter(Boolean)),
        ]
          .map((e) => String(e || "").trim())
          .filter(Boolean);
        var a;
        const n = String(S.ccKindPref || "any"),
          r = (e) => "asr" === e.kind || /\.asr$/i.test(e.vssId || ""),
          o = (e) => "any" === n || ("human" === n ? !r(e) : r(e)),
          i = (e) => String(e || "").toLowerCase();
        for (const a of t) {
          const t = i(a),
            n = e.find((e) => i(e.languageCode) === t && o(e));
          if (n) return n;
        }
        for (const a of t) {
          const t = i(a).split("-")[0],
            n = e.find((e) => i(e.languageCode).split("-")[0] === t && o(e));
          if (n) return n;
        }
        for (const a of t) {
          const t = i(a),
            n = e.find((e) => i(e.languageCode) === t);
          if (n) return n;
        }
        for (const a of t) {
          const t = i(a).split("-")[0],
            n = e.find((e) => i(e.languageCode).split("-")[0] === t);
          if (n) return n;
        }
        return t.length ? null : e.find((e) => !r(e)) || e[0];
      })(a);
    try {
      if (n && n.languageCode) {
        const e = { languageCode: n.languageCode };
        return (
          n.languageName &&
            n.languageName.simpleText &&
            (e.languageName = n.languageName.simpleText),
          n.kind && (e.kind = n.kind),
          n.vssId && (e.vssId = n.vssId),
          t.setOption("captions", "track", e),
          (Ma.lastTrackVid = ie.videoId()),
          !0
        );
      }
      if (S.ccAutoTranslate && S.ccTranslateTo && a.length) {
        const e = a.find((e) => !1 !== e.isTranslatable) || a[0];
        if (e && e.languageCode)
          return (
            t.setOption("captions", "track", {
              languageCode: e.languageCode,
              translationLanguage: { languageCode: S.ccTranslateTo },
              vssId: e.vssId || void 0,
            }),
            (Ma.lastTrackVid = ie.videoId()),
            !0
          );
      }
      if (!S.forceCCLang && a.length)
        return (
          t.setOption("captions", "track", { languageCode: a[0].languageCode }),
          (Ma.lastTrackVid = ie.videoId()),
          !0
        );
    } catch (e) {}
    return !1;
  }
  function Cc_state() {
    if (!S.forceCC) return { enabled: !1, displayed: !1, reason: "off" };
    if (!La()) return { enabled: !1, displayed: !1, reason: "skipped" };
    const t = ie.api();
    if (!t) return { enabled: !1, displayed: !1, reason: "no_api" };
    let a = null;
    try {
      a = "function" == typeof t.getOption
        ? t.getOption("captions", "track")
        : null;
    } catch (e) {
      a = null;
    }
    const n = !!a && a.languageCode;
    const r = document.querySelector(".ytb-subtitles-button");
    const o = r && "true" === r.getAttribute("aria-pressed");
    const i = document.querySelector(
      ".ytp-caption-window-container,.ytp-caption-window",
    );
    const d = !!i && i.offsetParent !== null && i.getBoundingClientRect().width > 0;
    let l = !1;
    if (i) {
      const e = i.querySelectorAll(".ytp-caption-segment,.caption-visual-line");
      l = Array.from(e).some((e) => (e.textContent || "").trim().length > 0);
    }
    return {
      enabled: n || o,
      displayed: d && l,
      track: a ? a.languageCode : null,
      buttonPressed: !!o,
      reason: !n && !o ? "no_track" : d && l ? "ok" : "track_no_render",
    };
  }
  // The force-captions card owns the engage path (it also tracks the last
  // engaged video), so the older duplicate implementation is not kept here.
  function Ba(e) {
    const t = {};
    e && (t[""] = "Player default (auto)");
    try {
      const e = void 0 !== cn && Array.isArray(cn) ? cn : [],
        a = [],
        n = [];
      for (const [t, r] of e)
        /^en(\b|-)/i.test(t) ? a.push([t, r]) : n.push([t, r]);
      n.sort((e, t) => e[1].localeCompare(t[1]));
      for (const [e, r] of a.concat(n)) t[e] = r + "  (" + e + ")";
    } catch (e) {}
    return t;
  }
  function Pa() {
    const e = ie.el();
    e
      ? document.pictureInPictureElement
        ? (document.exitPictureInPicture().catch(() => {}),
          pe("Closed the pop-out window.", 1500, "info"))
        : e
            .requestPictureInPicture()
            .then(() => pe("Video popped out.", 1500, "success"))
            .catch(() => pe("Couldn’t pop the video out.", 1500, "error"))
      : pe("No video", 1500, "error");
  }
  function Ia() {
    const e = ie.el();
    if (e && e.videoWidth)
      try {
        const t = Math.max(0.25, Math.min(4, Number(S.screenshotScale) || 1)),
          a = document.createElement("canvas");
        ((a.width = Math.round(e.videoWidth * t)),
          (a.height = Math.round(e.videoHeight * t)),
          a.getContext("2d").drawImage(e, 0, 0, a.width, a.height));
        const n = "jpg" === S.screenshotFmt,
          r = n ? "jpg" : "png",
          o = n ? "image/jpeg" : "image/png",
          i = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
        const doDownload = () => {
          try {
            const d = document.createElement("a");
            ((d.href = a.toDataURL(o, 0.95)),
              (d.download = "yourtube-" + i + "." + r),
              document.body.appendChild(d),
              d.click(),
              d.remove(),
              pe("Saved " + a.width + "x" + a.height, 1800, "success"));
          } catch (e2) {
            pe("Can’t take a screenshot of this video.", 1800, "error");
          }
        };

        if (
          S.screenshotClipboard &&
          "undefined" != typeof ClipboardItem &&
          navigator.clipboard &&
          "function" == typeof navigator.clipboard.write
        ) {
          try {
            const blobP = new Promise((res, rej) =>
              a.toBlob((b) => (b ? res(b) : rej(new Error("empty blob"))), o, 0.95),
            );
            navigator.clipboard
              .write([new ClipboardItem({ [o]: blobP })])
              .then(
                () => pe("Screenshot copied to clipboard", 1800, "success"),
                () => {
                  pe("Clipboard write failed - downloading instead", 2000, "error");
                  doDownload();
                },
              );
          } catch (e) {
            pe("Clipboard unavailable - downloading instead", 1800, "error");
            doDownload();
          }
          return;
        }
        doDownload();
      } catch (e) {
        pe("Can’t take a screenshot of this video.", 1800, "error");
      }
    else pe("No video", 1500, "error");
  }
  (xa.register({
    id: "force-cc",
    name: "Forced Captions",
    summary: "Enables captions on every video with style, position and language rules.",
      cat: "playback",
    masterKey: "forceCC",
    keys: [
      "forceCC",
      "forceCCLang",
      "ccNativePrefs",
      "ccFontSize",
      "ccFontFamily",
      "ccFontWeight",
      "ccTextColor",
      "ccBgColor",
      "ccBgOpacity",
      "ccTextShadow",
      "ccLineHeight",
      "ccPos",
      "ccUppercase",
      "ccRadius",
      "ccLetterSpacing",
      "ccFallbackLangs",
      "ccKindPref",
      "ccAutoTranslate",
      "ccTranslateTo",
      "ccSkipMusic",
      "ccSkipShorts",
      "ccRespectManualOff",
      "ccReEngageOnPlay",
    ],
    apply(e) {
      if (!S.forceCC) return;
      e.addStyle(
        (function () {
          const e = (function (e) {
              const t = String(e || "")
                .trim()
                .match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
              if (!t) return [0, 0, 0];
              let h = t[1];
              if (h.length === 3)
                h = h
                  .split("")
                  .map((c) => c + c)
                  .join("");
              const a = parseInt(h, 16);
              return [(a >> 16) & 255, (a >> 8) & 255, 255 & a];
            })(S.ccBgColor),
            t = Math.max(0, Math.min(100, Number(S.ccBgOpacity) || 0)) / 100,
            a = Math.max(10, Math.min(96, Number(S.ccFontSize) || 28)),
            n = String(S.ccPos || "bottom"),
            r = Math.max(0, Math.min(30, Number(S.ccRadius) || 0)),
            o = String(S.ccFontFamily || "Roboto, Arial, sans-serif").replace(
              /[;{}<>]/g,
              "",
            ),
            i = String(S.ccFontWeight || "700").replace(/[^0-9a-zA-Z -]/g, ""),
            d = Math.max(0.8, Math.min(2.5, Number(S.ccLineHeight) || 1.25)),
            c =
              Math.max(-10, Math.min(40, Number(S.ccLetterSpacing) || 0)) / 100,
            s = S.ccUppercase ? "uppercase" : "none",
            l = String(S.ccTextShadow || "outline"),
            p =
              "none" === l
                ? "none"
                : "soft" === l
                  ? "0 2px 6px rgba(0,0,0,.85)"
                  : "heavy" === l
                    ? "0 0 3px #000,0 0 5px #000,0 2px 4px #000"
                    : "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000,0 2px 3px #000";
          return [
            ("top" === n
                ? ".ytp-caption-window-container{top:2%!important;bottom:auto!important}"
                : "middle" === n
                  ? ".ytp-caption-window-container{top:50%!important;bottom:auto!important}"
                  : "left" === n
                    ? ".ytp-caption-window-container{left:4px!important;right:auto!important;bottom:10%!important;top:auto!important}"
                    : "right" === n
                      ? ".ytp-caption-window-container{right:4px!important;left:auto!important;bottom:10%!important;top:auto!important}"
                      : ".ytp-caption-window-container{bottom:0%!important;top:auto!important;left:0!important;right:0!important}"),
            ".ytp-caption-segment{font-size:" +
              a +
              "px!important;font-family:" +
              o +
              "!important;font-weight:" +
              i +
              "!important;color:" +

              (function () {
                const m = String(S.ccTextColor || "")
                  .trim()
                  .match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
                if (!m) return "#ffffff";
                let h = m[1];
                if (h.length === 3)
                  h = h
                    .split("")
                    .map((c) => c + c)
                    .join("");
                return "#" + h.toLowerCase();
              })() +
              "!important;line-height:" +
              d +
              "!important;letter-spacing:" +
              c.toFixed(2) +
              "em!important;text-transform:" +
              s +
              "!important;text-shadow:" +
              p +
              "!important;background:rgba(" +
              e[0] +
              "," +
              e[1] +
              "," +
              e[2] +
              "," +
              t +
              ")!important;border-radius:" +
              r +
              "px!important;padding:.08em .28em!important;box-decoration-break:clone!important;-webkit-box-decoration-break:clone!important}",
            ".caption-window{font-size:" +
              a +
              "px!important;font-family:" +
              o +
              "!important;line-height:" +
              d +
              "!important}",
            ".caption-visual-line{margin:.08em 0!important}",
          ].join("\n");
        })(),
      );
      const t = ie.videoId();
      t &&
        Ma.lastEngagedVid !== t &&
        Ma.manualOffForVid &&
        Ma.manualOffForVid !== t &&
        (Ma.manualOffForVid = null);
      const a = () => {
          !(function () {
            if (!La()) return !1;
            const e =
              "undefined" != typeof performance && performance.now
                ? performance.now()
                : Date.now();
            if (e - Ma.lastEngageT < 150) return !1;
            Ma.lastEngageT = e;
            const t = ie.api();
            try {
              t && t.loadModule && t.loadModule("captions");
            } catch (e) {}
            let a = !1;
            try {
              t &&
                "function" == typeof t.toggleSubtitlesOn &&
                (t.toggleSubtitlesOn(), (a = !0));
            } catch (e) {}
            const n = ca(".ytb-subtitles-button", 800);
            if (!a && n && "false" === n.getAttribute("aria-pressed"))
              try {
                (n.click(), (a = !0));
              } catch (e) {}
            (Ea(),
              Aa(),
              (() => {
                try {
                  t &&
                    "function" == typeof t.toggleSubtitlesOn &&
                    t.toggleSubtitlesOn();
                } catch (e) {}
              })(),
              (a || (n && "true" === n.getAttribute("aria-pressed"))) &&
                (Ma.lastEngagedVid = ie.videoId()));
          })();
        },
        n = () => {
          (Ea(), Aa());
        };
      (a(), n());
      const boundCc = new WeakSet();
      const boundCcApi = new WeakSet();
      const boundCcBtn = new WeakSet();
      const r = () => {
        const t = ie.el();
        t && !boundCc.has(t) &&
          (boundCc.add(t),
          e.addListener(t, "loadedmetadata", a),
          e.addListener(t, "loadeddata", a),
          e.addListener(t, "playing", () => {
            S.ccReEngageOnPlay && e.addTimeout(a, 400);
          }));
        const n = ie.api();
        n && !boundCcApi.has(n) && (boundCcApi.add(n), e.addListener(n, "onStateChange", a));
      };
      r();
      const o = () => {
        const t = ca(".ytb-subtitles-button", 800);
        t &&
          !boundCcBtn.has(t) &&
          (boundCcBtn.add(t),
          e.addListener(t, "click", () => {
            setTimeout(() => {
              const e = "true" === t.getAttribute("aria-pressed"),
                a = ie.videoId();
              !e && a && S.ccRespectManualOff
                ? (Ma.manualOffForVid = a)
                : e && (Ma.manualOffForVid = null);
            }, 150);
          }),
          e.addObserver(
            t,
            () => {
              "false" === t.getAttribute("aria-pressed") &&
                e.addTimeout(() => {
                  "false" === t.getAttribute("aria-pressed") && La() && a();
                }, 350);
            },
            { attributes: !0, attributeFilter: ["aria-pressed"] },
          ));
      };
      (o(),

        e.addInterval(() => {
          if (!S.forceCC) return;

          try {
            const _p = location.pathname || "";
            if (!_p.startsWith("/watch") && !_p.startsWith("/shorts")) return;
          } catch (_pe) {}
          try {
            const t = Cc_state();
            if (t.enabled && !t.displayed && Date.now() - (Ma.lastVerifyFix || 0) > 4e3) {
              Ma.lastVerifyFix = Date.now();
              try {
                Ea();
              } catch (e) {}
              try {
                Aa();
              } catch (e) {}
              try {
                a();
              } catch (e) {}
            }
          } catch (e) {}
        }, 2e3),
        e.onNav(() => {
          (ie.videoId() !== Ma.lastEngagedVid && (Ma.manualOffForVid = null),
            e.addTimeout(() => {
              (r(), o(), a(), n());
            }, 300),
            e.addTimeout(a, 400),
            e.addTimeout(a, 900),
            e.addTimeout(a, 1800),
            e.addTimeout(a, 3e3),
            e.addTimeout(a, 5e3),
            e.addTimeout(n, 600),
            e.addTimeout(n, 1500));
        }));
    },
    settings(e) {
      (e.appendChild(Ro("Preferred language", "forceCCLang", Ba(!0))),
        e.appendChild(
          _o("Fallback languages (comma-separated)", "ccFallbackLangs"),
        ),
        e.appendChild(
          Ro("Prefer", "ccKindPref", {
            any: "Any caption track",
            human: "Human-written (skip auto-generated)",
            asr: "Auto-generated only",
          }),
        ),
        e.appendChild(
          Io(
            "Auto-translate when no preferred track is found",
            "ccAutoTranslate",
          ),
        ),
        e.appendChild(Ro("Translate captions to", "ccTranslateTo", Ba(!0))),
        e.appendChild(
          Io(
            "Don't force captions on YouTube Music / music videos",
            "ccSkipMusic",
          ),
        ),
        e.appendChild(Io("Don't force captions on Shorts", "ccSkipShorts")),
        e.appendChild(
          Io(
            "If I turn captions off, leave them off until the next video",
            "ccRespectManualOff",
          ),
        ),
        e.appendChild(
          Io(
            "Re-enable captions when playback resumes after an ad",
            "ccReEngageOnPlay",
          ),
        ),
        e.appendChild(
          Io(
            "Also apply YouTube's built-in caption font size",
            "ccNativePrefs",
          ),
        ),
        e.appendChild(
          No("Font size", "ccFontSize", 10, 72, 1, (e) => e + "px"),
        ),
        e.appendChild(Yp_fontRow("Font family (with preview)", "ccFontFamily")),
        e.appendChild(
          Ro("Font weight", "ccFontWeight", {
            400: "Regular",
            500: "Medium",
            600: "Semi-bold",
            700: "Bold",
            800: "Extra-bold",
            900: "Black",
          }),
        ),
        e.appendChild(Xp("Text color", "ccTextColor")),
        e.appendChild(Xp("Background color", "ccBgColor")),
        e.appendChild(
          No("Background opacity", "ccBgOpacity", 0, 100, 1, (e) => e + "%"),
        ),
        e.appendChild(
          Ro("Text shadow", "ccTextShadow", {
            outline: "Outline",
            soft: "Soft",
            heavy: "Heavy",
            none: "None",
          }),
        ),
        e.appendChild(
          No("Line height", "ccLineHeight", 0.8, 2.2, 0.05, (e) =>
            Number(e).toFixed(2),
          ),
        ),
        e.appendChild(
          No(
            "Letter spacing",
            "ccLetterSpacing",
            -10,
            40,
            1,
            (e) => (Number(e) / 100).toFixed(2) + "em",
          ),
        ),
        e.appendChild(
          Ro("Caption position", "ccPos", {
            bottom: "Bottom",
            middle: "Middle",
            top: "Top",
            left: "Left",
            right: "Right",
          }),
        ),
        e.appendChild(
          No("Background radius", "ccRadius", 0, 24, 1, (e) => e + "px"),
        ),
        e.appendChild(Io("Uppercase captions", "ccUppercase")));
    },
  }),
    xa.register({
      id: "autoskip-ad-btn",
      name: "Auto-Click Skip Ad",
      summary: "Clicks YouTube's own Skip Ad button the moment it appears.",
      cat: "playback",
      masterKey: "autoSkipAdBtn",
      keys: ["autoSkipAdBtn"],
      apply(e) {
        if (!S.autoSkipAdBtn) return;
        const t = () => {
            if (!ie.isAd()) return !1;
            const e = document.querySelector(
              ".ytp-ad-skip-button,.ytp-skip-ad-button,.ytp-ad-skip-button-modern",
            );
            if (e)
              try {
                return (e.click(), !0);
              } catch (e) {}
            return !1;
          },
          a = () => {
            const a = document.querySelector("#movie_player");

            if (!a || boundAdSkip.has(a)) return;
            boundAdSkip.add(a);
            e.addObserver(a, ee(t, 200), {
              attributes: !0,
              attributeFilter: ["class"],
            });
          },
          boundAdSkip = new WeakSet();
        (a(), e.onNav(() => e.addTimeout(a, 1e3)));
      },
      settings() {},
    }),

    xa.register({
      id: "sponsorblock",
      name: "SponsorBlock",
      summary: "Skips sponsor segments via hashed-prefix lookups; no video IDs leave the browser.",
      cat: "integrations",
      masterKey: "sponsorblockOn",
      keys: [
        "sponsorblockOn",
        "sbPrivacy",
        "sbToast",
        "sbToastDur",
        "sbSeekbar",
        "sbHud",
        "sbOnlySkipIfVip",
        "sbIncognito",
        "sbSkipCountdown",
        "sbSkipCountdownTime",
        "sbBetterBeAware",
        "sbDisable",
        "sbWhitelist",
        "sbMinDuration",
        "sbAudioCue",
        "sbSkipRules",
        "sbChapterToast",
        "sbTimeWithSkips",
        "sbRenderChapters",
      ].concat(i.flatMap((e) => ["sb_" + e.id + "_en", "sb_" + e.id + "_act", "sb_" + e.id + "_sb"])),
      apply(e) {
        ft();
        if (!S.sponsorblockOn) {
          SponsorBlockEngine.destroy();
          ft();
          return;
        }

        SponsorBlockEngine.destroy();
        const scheduleLookup = () => {
          let attempts = 0;
          const run = () => {
            attempts++;
            const vid = ie.videoId();
            const videoEl = ie.el();
            if (vid) St(vid);
            if (attempts >= 7) return;
            if (!vid || !videoEl) {
              e.addTimeout(run, vid ? 650 : 250);
            }
          };
          run();
        };
        scheduleLookup();
        e.onNav(() => {
          e.addTimeout(scheduleLookup, 120);
          e.addTimeout(scheduleLookup, 850);
          e.addTimeout(scheduleLookup, 1700);
        });
      },
      settings(e) {
        e.appendChild(
          Io("Privacy mode (hide video IDs from database server)", "sbPrivacy")
        );
        e.appendChild(
          Io("Show notifications on skip", "sbToast")
        );
        e.appendChild(
          Io("Show segments on the video timeline", "sbSeekbar")
        );
        e.appendChild(
          Io("Show SB stats chip on screen", "sbHud")
        );

        e.appendChild(To("div", "ytb-section-hdr", "API Controls"));
        const apiCtrls = To("div", "ytb-rowb");
        apiCtrls.appendChild(
          Oo(
            "Refresh segments",
            () => {
              SponsorBlockEngine.refreshCurrent().then(
                (segments) => pe("SponsorBlock refreshed: " + segments.length + " segment" + (segments.length !== 1 ? "s" : ""), 2200, "success"),
                (err) => pe("Refresh failed: " + ((err && err.message) || err || "unknown error"), 2400, "error"),
              );
            },
            "primary"
          )
        );
        apiCtrls.appendChild(
          Oo(
            "Copy local SB user ID",
            () => {
              SponsorBlockEngine.copyLocalUserId().then((id) => {
                pe(id ? "Copied SponsorBlock user ID" : "No SponsorBlock user ID available", 2200, id ? "success" : "error");
              });
            },
            "ytb-normal"
          )
        );
        e.appendChild(apiCtrls);

        const t = To("div", "ytb-sub");
        i.forEach((e2) => {
          const a = "sb_" + e2.id + "_en",
            n = "sb_" + e2.id + "_act",
            r = To("span", "ytb-cat-dot");
          r.style.background = e2.color;
          if (e2.desc) r.title = e2.desc;
          const o = To("div", "ytb-row");
          o.appendChild(r);
          const lbl = To("span", "ytb-lbl", e2.label);
          if (e2.desc) lbl.title = e2.desc;
          o.appendChild(lbl);
          o.appendChild(Bo(a));
          o.appendChild(Po(n, SponsorBlockEngine.getActionOptions(e2.id)));
          o.appendChild(Bo("sb_" + e2.id + "_sb"));
          t.appendChild(o);
        });
        e.appendChild(t);

        e.appendChild(To("div", "ytb-section-hdr", "Parity Options"));
        e.appendChild(Io("Only skip segments submitted by VIPs", "sbOnlySkipIfVip"));
        e.appendChild(Io("Private session (no submit / vote / viewed reporting)", "sbIncognito"));
        e.appendChild(Io("Show skip countdown before skipping", "sbSkipCountdown"));
        e.appendChild(No("Skip countdown seconds", "sbSkipCountdownTime", 0, 5, 1, (v) => v + "s"));
        e.appendChild(Ho("Warn instead of skipping these categories", "sbBetterBeAware", "interaction,selfpromo"));

        e.appendChild(To("div", "ytb-section-hdr", "Playback & Channel"));
        e.appendChild(Io("Pause all SponsorBlock skipping (per-site)", "sbDisable"));
        e.appendChild(Io("Audio cue when a skip fires", "sbAudioCue"));
        e.appendChild(No("Never auto-skip segments shorter than (seconds)", "sbMinDuration", 0, 60, 0.5, (v) => v + "s"));
        e.appendChild(Io("Notify when a video has SponsorBlock chapters", "sbChapterToast"));
        e.appendChild(Io("Render SponsorBlock chapters as seekbar chapters", "sbRenderChapters"));
        e.appendChild(Io("Show skippable time next to video duration", "sbTimeWithSkips"));
        e.appendChild(Ho("Channel whitelist (UC ids or channel names, comma-separated)", "sbWhitelist", "UCxxxxxxxxxxxxxx, my channel name"));
        e.appendChild(Ho("Advanced skip rules (wiki.sponsor.ajay.app/w/Advanced_skip_options)", "sbSkipRules", 'if category == "chapter" and chapter.name ~= "^[Ii]ntro"\nAuto skip'));

        e.appendChild(To("div", "ytb-rowb"));
        const wlRow = To("div", "ytb-rowb");
        wlRow.appendChild(
          Oo(
            "Toggle whitelist on this channel",
            () => {
              try {
                const r = SponsorBlockEngine.toggleCurrentChannelWhitelist();
                pe(
                  !r || !r.ok
                    ? "Whitelist: " + ((r && r.message) || "no channel")
                    : r.added
                      ? "Channel whitelisted: " + r.token
                      : "Channel removed from whitelist: " + r.token,
                  2400,
                  r && r.ok ? "success" : "error",
                );
              } catch (e2) { pe("Whitelist toggle failed", 2200, "error"); }
            },
            "ytb-normal",
          ),
        );
        e.appendChild(wlRow);

        e.appendChild(To("div", "ytb-section-hdr", "Segment Creation"));
        const createRow = To("div", "ytb-row");
        createRow.style.padding = "6px 0";
        createRow.appendChild(
          Oo(
            "Create & Submit New Segment",
            () => {
              SponsorBlockEngine.toggleSubmissionEditor();
            },
            "primary"
          )
        );
        e.appendChild(createRow);

        e.appendChild(To("div", "ytb-section-hdr", "This video"));
        const ctrls = To("div", "ytb-rowb");
        ctrls.appendChild(
          Oo(
            "Hide SB on this video",
            () => {
              Bt_hideVideo().then(
                () => g.emit("sb.hidden"),
                (e2) => pe("Hide failed: " + e2.message, 2e3, "error"),
              );
            },
            "ytb-danger",
          )
        );
        ctrls.appendChild(
          Oo(
            "Show SB on this video",
            () => {
              Bt_unHideVideo().then(
                () => g.emit("sb.hidden"),
                (e2) => pe("Restore failed: " + e2.message, 2e3, "error"),
              );
            },
            "ytb-normal",
          )
        );
        ctrls.appendChild(
          Oo(
            "Skip to Highlight",
            () => {
              const ok = SponsorBlockEngine.jumpToHighlight();
              pe(ok ? "Jumped to highlight" : "No highlight segment", 1600, ok ? "success" : "info");
            },
            "ytb-normal"
          )
        );
        e.appendChild(ctrls);
      },
    }),

    xa.register({
      id: "session-restore",
      name: "Session History",
      summary: "Local watch history with resume positions, bookmarks and search.",
      cat: "data",
      masterKey: "sessionRestoreOn",
      keys: ["sessionRestoreOn", "sessionResumeMode", "sessionResumeDesign"],
      apply(e) {
        if (!S.sessionRestoreOn) return void Ue();
        const t = () => {
            const e = ie.videoId();
            e && Xe(e, { duration: ie.el() ? ie.el().duration : 0 });
          },
          u = () => {
            const a = ie.el();
            if (!a || a._ytbHistEndedBound) return;
            try {
              (a._ytbHistEndedBound = !0),
                a.addEventListener("ended", t),
                Yt["session-restore"].push(() => {
                  try {
                    a.removeEventListener("ended", t), (a._ytbHistEndedBound = !1);
                  } catch (e) {}
                });
            } catch (e) {}
          };
        (e.onNav(() => {
          (Ke(), e.addTimeout(Ke, 1200), e.addTimeout(u, 1200));
        }),
          Ke(),
          u());
        for (const t of [400, 1500, 3e3]) e.addTimeout(Ke, t);
        Yt["session-restore"].push(Ue);
        u();
      },
      settings(e) {
        e.appendChild(
          Ro("On return to a video", "sessionResumeMode", {
            card: "Small card (bottom)",
            overlay: "Full overlay",
            silent: "Silent Resume",
          }),
        );
        e.appendChild(
          Ro("Resume design", "sessionResumeDesign", {
            default: "Default (balanced)",
            compact: "Compact (small, bottom card)",
            detailed: "Detailed (large, more info)",
            cinema: "Cinema (max glass + glow)",
          }),
        );
        const t = To("div", "ytb-hist-panel");
        (e.appendChild(t),
          (function (e) {
            e.replaceChildren();
            const t = To("div", "ytb-hist-toolbar"),
              a = document.createElement("input");
            ((a.type = "search"),
              (a.className = "ytb-hist-search"),
              (a.placeholder = "Search what you’ve watched…"),
              (a.value = qo.query));
            const r = To("span", "ytb-hist-count", "");
            (t.appendChild(a), t.appendChild(r), e.appendChild(t));
            const o = To("div", "ytb-hist-list");
            e.appendChild(o);
            const i = Oo("Show more", () => {
              ((qo.limit += 30), c());
            });
            (i.classList.add("ytb-hist-loadmore"), e.appendChild(i));
            const d = To("div", "ytb-rowb");
            async function c() {
              o.replaceChildren(To("div", "ytb-hist-loading", "Loading…"));

              _backfillMetadata().catch(() => {});
              const e = (qo.query || "").trim().toLowerCase(),
                t = await Ie(),
                a = e
                  ? t.filter(
                      (t) =>
                        (t.title || "").toLowerCase().includes(e) ||
                        (t.channel || "").toLowerCase().includes(e) ||
                        (t.videoId || "").toLowerCase().includes(e),
                    )
                  : t;
              if (
                ((r.textContent =
                  a.length +
                  (e ? " match" + (1 === a.length ? "" : "es") : " total")),
                o.replaceChildren(),
                !a.length)
              )
                return (
                  o.appendChild(
                    To(
                      "div",
                      "ytb-hist-empty",
                      e ? "No matches." : "No history yet.",
                    ),
                  ),
                  void (i.style.display = "none")
                );
              const n = a.slice(0, qo.limit),
                d = document.createDocumentFragment();
              for (const e of n) d.appendChild(Vo(e, c));
              (o.appendChild(d),
                (i.style.display = a.length > n.length ? "" : "none"));
            }
            (d.appendChild(
              Oo("Export", () =>
                (async function () {
                  const e = await Ie(),
                    t = new Blob(
                      [
                        JSON.stringify(
                          { version: n, ts: Date.now(), history: e },
                          null,
                          2,
                        ),
                      ],
                      { type: "application/json" },
                    ),
                    a = URL.createObjectURL(t),
                    r = document.createElement("a");
                  ((r.href = a),
                    (r.download =
                      "yourtube-history-" +
                      new Date().toISOString().slice(0, 10) +
                      ".json"),
                    document.body.appendChild(r),
                    r.click(),
                    r.remove(),
                    setTimeout(() => URL.revokeObjectURL(a), 6e3),
                    pe(
                      "Saved " + e.length + " entries to a file.",
                      1800,
                      "success",
                    ));
                })(),
              ),
            ),
              d.appendChild(
                Oo("Import", () =>
                  (function (e) {
                    const t = document.createElement("input");
                    ((t.type = "file"),
                      (t.accept = ".json,application/json"),
                      t.addEventListener(
                        "change",
                        () => {
                          const a = t.files && t.files[0];
                          if (!a) return;
                          const n = new FileReader();
                          ((n.onload = (t) => {
                            try {
                              const rawText = String(t.target.result || "");
                              if (rawText.length > 8388608) throw new Error("import too large");
                              const a = JSON.parse(rawText),
                                n = (a.history || (Array.isArray(a) ? a : [])).slice(-5000);
                              Promise.all(
                                n
                                  .filter((e) => e && e.videoId)
                                  .map((e) => Be(_ytSanitizeHistoryRow(e))),
                              ).then(() => {
                                (pe(
                                  "Imported " + n.length + " entries",
                                  1800,
                                  "success",
                                ),
                                  e && e());
                              });
                            } catch (e) {
                              pe("Couldn’t read that file.", 1800, "error");
                            }
                          }),
                            n.readAsText(a));
                        },
                        { once: !0 },
                      ),
                      t.click());
                  })(c),
                ),
              ),
              d.appendChild(
                Oo(
                  "Clear all",
                  () => {
                    Re()
                      .then(() => C("thumbCache"))
                      .then(() => {
                        (pe("History cleared.", 1600, "success"), c());
                      });
                  },
                  "ytb-danger",
                ),
              ),
              e.appendChild(d),
              a.addEventListener(
                "input",
                ee(() => {
                  ((qo.query = a.value), c());
                }, 150),
              ),
              So("history.updated", c),
              c());
          })(t));
      },
    }),
    xa.register({
      id: "pip-button",
      name: "Picture-in-Picture",
      summary: "Adds a PiP button; detaches the video into a floating window.",
      cat: "playback",
      apply() {},
      settings(e) {
        e.appendChild(Eo([Oo("Toggle PiP now", Pa, "primary")]));
      },
    }),
    xa.register({
      id: "screenshot",
      name: "Frame Capture",
      summary: "Saves the current video frame as PNG/JPG; optional clipboard copy; hotkey available.",
      cat: "playback",
      masterKey: "screenshotOn",
      keys: ["screenshotOn", "screenshotFmt", "screenshotScale", "screenshotClipboard"],
      apply(e) {
        if (!S.screenshotOn) return;
        const mountBtn = () => {
          const bar = document.querySelector(".ytp-right-controls") || document.querySelector(".ytp-chrome-controls");
          if (!bar || document.getElementById("ytb-shot-btn")) return false;
          const b = document.createElement("button");
          b.id = "ytb-shot-btn";
          b.type = "button";
          b.className = "ytp-button";
          b.setAttribute("aria-label", "Screenshot (X)");
          b.title = "Screenshot (X)";
          b.innerHTML = Xy('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7l1.5-2.5h5L16 7"/><circle cx="12" cy="13" r="3.5"/></svg>');
          b.style.cssText = "display:flex;align-items:center;justify-content:center;width:40px;height:40px;padding:0;opacity:.9";
          b.addEventListener("click", (ev) => { ev.stopPropagation(); try { Ia(); } catch (_) {} });
          bar.appendChild(b);
          return true;
        };
        if (mountBtn()) return;

        const iv = setInterval(() => { if (mountBtn() || document.getElementById("ytb-shot-btn")) clearInterval(iv); }, 800);
        e.onNav(() => e.addTimeout(mountBtn, 1500));
        Yt["screenshot"].push(() => {
          clearInterval(iv);
          const b = document.getElementById("ytb-shot-btn");
          if (b && b.parentNode) b.parentNode.removeChild(b);
        });
      },
      settings(e) {
        (e.appendChild(
          Ro("Format", "screenshotFmt", { png: "PNG", jpg: "JPEG" }),
        ),
          e.appendChild(
            No("Scale", "screenshotScale", 0.5, 4, 0.5, (e) => e + "x"),
          ),
          e.appendChild(
            Io("Copy to clipboard (no download)", "screenshotClipboard"),
          ),
          e.appendChild(Eo([Oo("Capture now", Ia, "primary")])));
      },
    }),
    
    xa.register({
      id: "force-watched",
      name: "Mark as Watched",
      summary: "Shift+W sends a full-play beacon and records the video in account history.",
      cat: "playback",
      masterKey: "forceWatchedOn",
      keys: [
        "forceWatchedOn",

        "forceWatchedAccountHistory",
        "forceWatchedLocalHistory",
      ],
      apply() {},
      settings(e) {
        e.appendChild(
          Eo([
            Oo("Force watched now", Ut, "primary"),
            Oo("Test (current video)", () => {
              const e = ie.videoId();
              e
                ? (pe("Trying it on " + e + "…", 1200, "info"), Ut())
                : pe("Open a video first.", 1500, "error");
            }),
          ]),
        );

        e.appendChild(
          Io(
            "Mark it in my YouTube history (Account History)",
            "forceWatchedAccountHistory",
          ),
        );
        e.appendChild(
          Io(
            "Also save to YourTube so it fades out of my feed right away",
            "forceWatchedLocalHistory",
          ),
        );
        e.appendChild(Io("Verbose debug console output", "debugVerbose"));
      },
    }),
    xa.register({
      id: "theater-default",
      name: "Theater Default",
      summary: "Opens watch pages in theater mode.",
      cat: "playback",
      masterKey: "theaterDefault",
      keys: ["theaterDefault"],
      apply(e) {
        if (!S.theaterDefault) return;
        const t = () => {
          if ("/watch" !== location.pathname) return true;
          const el = document.querySelector("ytd-watch-flexy"),
            btn = document.querySelector(".ytp-size-button");
          if (el && el.hasAttribute("theater")) return true;
          if (el && btn) { try { btn.click(); } catch (_) {} return true; }
          return false;
        };
        const arm = () => {
          if (t()) return;
          // Chained ctx-managed timeouts instead of a raw setInterval: the old
          // pattern (setInterval + separate clearTimeout for cleanup) left a
          // zombie interval running up to 5s after the card was disabled,
          // because the cleanup timeout was cancelled at teardown while the
          // interval was not tracked. Chained ctx timeouts are cleared by
          // teardown automatically. Same 250 ms cadence, same ≤5 s ceiling.
          let n = 0;
          const tick = () => {
            n++;
            if (!t() && n <= 20) e.addTimeout(tick, 250);
          };
          tick();
        };
        (arm(), e.onNav(() => { e.addTimeout(arm, 400); e.addTimeout(arm, 1500); }));
      },
      settings() {},
    }),
    
    xa.register({
      id: "cinema-mode",
      name: "Cinema Mode",
      summary: "Dims everything outside the player with adjustable opacity.",
      cat: "playback",
      masterKey: "cinemaMode",
      keys: ["cinemaMode", "cinemaOp"],
      apply(e) {
        if (!S.cinemaMode) {
          document.documentElement.classList.remove("ytb-cinema-mode");
          const old = document.getElementById("ytb-cinema-backdrop");
          if (old) old.remove();
          return;
        }

        const CINEMA_STYLE = [
          "#ytb-cinema-backdrop {",
          "  position: fixed !important;",
          "  inset: 0 !important;",
          "  width: 100vw !important;",
          "  height: 100vh !important;",
          "  background-color: #000000 !important;",
          "  opacity: var(--ytp-cinema-opacity, 0.85) !important;",
          "  z-index: 1000 !important;",
          "  pointer-events: none !important;",
          "  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;",
          "}",
          "html.ytb-cinema-mode ytd-watch-flexy #player-full-bleed-container,",
          "html.ytb-cinema-mode ytd-watch-flexy #player-container,",
          "html.ytb-cinema-mode ytd-watch-flexy #player-container-outer,",
          "html.ytb-cinema-mode ytd-watch-flexy #player,",
          "html.ytb-cinema-mode #movie_player,",
          "html.ytb-cinema-mode .html5-video-player {",
          "  z-index: 1001 !important;",
          "  position: relative !important;",
          "}",
          "html.ytb-cinema-mode .ytp-popup,",
          "html.ytb-cinema-mode .ytp-settings-menu,",
          "html.ytb-cinema-mode .ytp-panel-menu,",
          "html.ytb-cinema-mode ytd-popup-container,",
          "html.ytb-cinema-mode tp-yt-paper-dialog {",
          "  z-index: 2200 !important;",
          "}"
        ].join("\n");

        e.addStyle(CINEMA_STYLE);

        const syncCinema = () => {
          const isWatch = location.pathname.startsWith("/watch");
          if (!S.cinemaMode || !isWatch) {
            document.documentElement.classList.remove("ytb-cinema-mode");
            const bd = document.getElementById("ytb-cinema-backdrop");
            if (bd) bd.style.display = "none";
            return;
          }

          const op = Math.max(0.05, Math.min(0.98, Number(S.cinemaOp) || 0.85));
          document.documentElement.style.setProperty("--ytp-cinema-opacity", String(op));
          document.documentElement.classList.add("ytb-cinema-mode");

          let bd = document.getElementById("ytb-cinema-backdrop");
          if (!bd) {
            bd = document.createElement("div");
            bd.id = "ytb-cinema-backdrop";
            (document.body || document.documentElement).appendChild(bd);
          }
          bd.style.display = "block";
        };

        syncCinema();
        e.onNav(() => e.addTimeout(syncCinema, 50));
        Yt["cinema-mode"].push(() => {
          document.documentElement.classList.remove("ytb-cinema-mode");
          const bd = document.getElementById("ytb-cinema-backdrop");
          if (bd) bd.remove();
        });
      },
      settings(e) {
        e.appendChild(
          No(
            "Dimming Level",
            "cinemaOp",
            0.1,
            0.95,
            0.05,
            (v) => Math.round(100 * v) + "%",
          ),
        );
      },
    }));

  let Ra = 0,
    Na = !1;
  function _ytParseVideoStats(raw) {
    try {
      let s = raw;
      if (s && typeof s === "object") {
        try { s = JSON.stringify(s); } catch (_) { return null; }
      }
      if (typeof s !== "string" || !s) return null;
      const fmt = (/"(?:fmt|quality)":"([^"]{1,40})"/.exec(s) || [])[1] || "";
      const bitrate = (/"(?:bitrate|bitrateKbps)":"?([\d.]+)\s*(?:kbps)?"?/i.exec(s) || [])[1] || "";
      if (!fmt && !bitrate) return null;
      return { fmt: String(fmt).trim(), bitrate: bitrate ? String(bitrate) + " kbps" : "" };
    } catch (_) { return null; }
  }

  function _a() {
    const e = performance.now();
    if (e - Ra < 250) return Na;
    Ra = e;
    try {
      const e = document.querySelectorAll("tp-yt-iron-dropdown");
      for (let t = 0; t < e.length; t++) {
        const a = e[t].style;
        try {
          if ("true" === e[t].getAttribute("aria-hidden")) continue;
        } catch (_) {}
        const rendered = (() => {
          try {
            if (e[t].getClientRects && e[t].getClientRects().length) return true;
          } catch (_) {}
          try { return null !== e[t].offsetParent; } catch (_) { return false; }
        })();
        if (!rendered) continue;
        if (a && "none" !== a.display && "" !== a.display) return ((Na = !0), !0);
        if (e[t].opened || e[t].hasAttribute("opened")) return ((Na = !0), !0);
      }
      const t = document.querySelectorAll(
        "ytd-popup-container tp-yt-paper-dialog, ytd-menu-popup-renderer",
      );
      for (let e = 0; e < t.length; e++)
        if (null !== t[e].offsetParent) return ((Na = !0), !0);
    } catch (e) {}
    return ((Na = !1), !1);
  }
  function Ha(e, t, a, n, r, o) {
    xa.register({
      id: e,
      name: t,
      summary: a,
      masterKey: n,
      cat: o,
      keys: [n],
      apply(e) {
        S[n] && e.addStyle(r);
      },
      settings() {},
    });
  }

