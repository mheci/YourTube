  (async function () {
    try {
      z();
    } catch (e) {}
    try {
      u("inject mode: " + ((typeof GM_info !== "undefined" && GM_info && GM_info.injectInto) || "unknown"));
    } catch (e) {}
    try {

      console.warn(
        "[YourTube] v" +
          ((typeof GM_info !== "undefined" && GM_info && GM_info.script && GM_info.script.version) || "?") +
          " | inject: " +
          ((typeof GM_info !== "undefined" && GM_info && GM_info.injectInto) || "?") +
          " | realm: " +
          (typeof exportFunction === "function"
            ? "content"
            : (function () { try { return e === window ? "page" : "isolated"; } catch (_) { return "?"; } })()),
      );
    } catch (e) {}
    try {
      u(
        "force-watched cfg: on=" +
          !!S.forceWatchedOn +
          " local=" +
          !!S.forceWatchedLocalHistory +
          " account=" +
          !!S.forceWatchedAccountHistory,
      );
    } catch (e) {}
    try {
      !(function () {
        if ("function" == typeof GM_registerMenuCommand || (typeof GM !== "undefined" && GM && typeof GM.registerMenuCommand === "function")) {
          const _wrappersByName = {};
          const _regCmd = (label, fn) => {
            const _menuFail = (err) => {
              try { m("menu:" + label, err); } catch (_) {}
              try { console.error("[YourTube] menu '" + label + "' failed:", err); } catch (_) {}
              try { pe(label + " failed: " + (err && err.message ? err.message : err), 5000, "error"); } catch (_) {}
            };
            const _wrap = function () {
              let _result;
              try {
                _result = fn.apply(null, arguments);
              } catch (err) {
                _menuFail(err);
                return;
              }

              if (_result && typeof _result.then === "function") {
                return Promise.resolve(_result).catch(_menuFail);
              }
              return _result;
            };
            let _registered = false;

            try {
              if (typeof GM_registerMenuCommand === "function") {
                GM_registerMenuCommand(label, _wrap);
                _registered = true;
              }
            } catch (e) { try { m("register GM_registerMenuCommand " + label, e); } catch (_) {} }

            try {
              if (!_registered && typeof GM !== "undefined" && GM && typeof GM.registerMenuCommand === "function") {
                GM.registerMenuCommand(label, _wrap);
                _registered = true;
              }
            } catch (e) { try { m("register GM.registerMenuCommand " + label, e); } catch (_) {} }

            if (!_registered) try { m("menu not registered: " + label); } catch (_) {}
          };
          _regCmd("Open YourTube dashboard", function () {
            try {
              Uo();
            } catch (err) {
              try { m("dashboard open", err); } catch (_) {}
              try { console.error("[YourTube] dashboard open failed:", err); } catch (_) {}
              pe("Dashboard failed to open: " + (err && err.message ? err.message : err) + " — please report this message", 6000, "error");
            }
          });
          _regCmd("Export settings to file", Go);
          _regCmd("Import settings from file", () => {
            try {
              typeof Xo === "function" ? Xo() : pe("Import unavailable.", 2200, "info");
            } catch (e) {}
          });
          _regCmd("Reset quarantined features", () => {
            try {
              const _n = ga && ga.size ? ga.size : 0;
              if (xa && xa.clearQuarantine) xa.clearQuarantine();
              pe(_n ? "Cleared " + _n + " quarantined feature(s)." : "No features were quarantined.", 2000, "success");
            } catch (e) {}
          });
          _regCmd("Check for updates now", () => {
            try { typeof Fu === "function" && Fu(true); } catch (e) {}
          });
          _regCmd("Open releases page", () => {
            try { window.open("https://github.com/mheci/YourTube/releases", "_blank", "noopener"); } catch (e) {}
          });
        }
      })();
    } catch (e) {
      m("registerMenuCommands", e);
    }

    try {
      const _isTextTarget = (e) => {
        try {
          const t = e.target;
          if (!t) return false;
          const tag = (t.tagName || "").toUpperCase();
          if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
            if (tag === "INPUT") {
              const type = (t.type || "text").toLowerCase();
              return !type || type === "text" || type === "search" || type === "email" || type === "url" || type === "tel" || type === "password" || type === "number";
            }
            return true;
          }
          if (t.isContentEditable) return true;
        } catch (e) {}
        return false;
      };
      document.addEventListener("keydown", (e) => {
        if (e.repeat) return;
        if (_isTextTarget(e)) return;

        // Shortcuts are dispatched from the keymap, so they can be rebound in
        // Settings. _ytKeySpec and _YT_KEYMAP_DEFAULTS are declared with the
        // engine cards; they are only read here at keydown time.
        const _spec = typeof _ytKeySpec === "function" ? _ytKeySpec(e) : "";
        const _bound = (action) => {
          if (!_spec) return false;
          const map = S.keymap && typeof S.keymap === "object" ? S.keymap : null;
          const custom = map && typeof map[action] === "string" ? map[action].toLowerCase() : "";
          const fallback = (typeof _YT_KEYMAP_DEFAULTS === "object" && _YT_KEYMAP_DEFAULTS[action]) || "";
          return _spec === (custom || fallback);
        };

        if (S.forceWatchedOn && _bound("forceWatched")) {
          e.preventDefault();
          try {
            Ut();
          } catch (err) {
            m("hotkey force watched", err);
          }
        }

        if (S.screenshotOn && _bound("screenshot")) {
          e.preventDefault();
          try {
            Ia();
          } catch (err) {
            m("hotkey screenshot", err);
          }
        }

        if (S.stopButtonOn && _bound("stop")) {
          e.preventDefault();
          try {
            yr();
          } catch (err) {
            m("hotkey stop playback", err);
          }
        }

        if (S.chapterHotkeysOn && (_bound("chapterPrev") || _bound("chapterNext"))) {
          e.preventDefault();
          try {
            Er(_bound("chapterPrev") ? -1 : 1);
          } catch (err) {
            m("hotkey chapter", err);
          }
        }

        if (S.sponsorblockOn && !S.sbDisable) {
          if (_bound("sbSkip")) {
            e.preventDefault();
            try { SponsorBlockEngine.skipCurrentSegment(); } catch (err) { m("hotkey sb skip", err); }
          } else if (_bound("sbHighlight")) {
            e.preventDefault();
            try { SponsorBlockEngine.jumpToHighlight(); } catch (err) { m("hotkey sb highlight", err); }
          } else if (_bound("sbUpvote")) {
            e.preventDefault();
            try { SponsorBlockEngine.voteActive(1).then((r) => pe(r && r.ok ? "Segment upvoted" : "Upvote: " + (r && r.message || "failed"), 1800, r && r.ok ? "success" : "error")); } catch (err) { m("hotkey sb upvote", err); }
          } else if (_bound("sbDownvote")) {
            e.preventDefault();
            try { SponsorBlockEngine.voteActive(0).then((r) => pe(r && r.ok ? "Segment downvoted" : "Downvote: " + (r && r.message || "failed"), 1800, r && r.ok ? "success" : "error")); } catch (err) { m("hotkey sb downvote", err); }
          }
        }

        if (_bound("speedUp") || _bound("speedDown")) {
          e.preventDefault();
          try {
            const _sv = ie.el();
            if (_sv) {
              const _stp = Math.max(0.05, Math.min(1, Number(S.speedStep) || 0.25));
              const _dir = _bound("speedUp") ? 1 : -1;
              const _next = Math.max(0.0625, Math.min(16, Math.round((_sv.playbackRate + _dir * _stp) * 100) / 100));
              _sv.playbackRate = _next;
              pe("Speed " + _next + "x", 1200, "info");
            }
          } catch (err) {
            m("hotkey speed step", err);
          }
        }
      }, false);
    } catch (e) {
      m("bindGlobalHotkeys", e);
    }
    try {
      !(function () {
        try {
          ((R = new BroadcastChannel("yourtube_cfg_sync")),
            (R.onmessage = (e) => {

              const d = e && e.data;
              !H &&
                d &&
                "cfg_update" === d.type &&
                typeof d.ver === "number" &&
                Number.isFinite(d.ver) &&
                d.ver >= A &&
                X();
            }));
        } catch (e) {
          u("BroadcastChannel not available, using storage events only");
        }
        try {
          window.addEventListener("storage", (e) => {
            e.key !== B || N || X();
          });
        } catch (e) {}
        try {
          // Heal window: a tab that slept through broadcasts (bfcache, throttled
          // timers, missed storage event) re-checks the latest snapshot whenever
          // it becomes observable again. Cheap no-op when already current.
          const _heal = () => {
            try {
              if ("visible" === document.visibilityState) X();
            } catch (e) {}
          };
          document.addEventListener("visibilitychange", _heal);
          window.addEventListener("pageshow", (e) => {
            if (e && e.persisted) { try { X(); } catch (e2) {} }
          });
          window.addEventListener("focus", _heal);
        } catch (e) {}
      })();
    } catch (e) {
      m("initCrossTabSync", e);
    }
    try {
      !(function () {
        const e = () => {
          try {
            G();
          } catch (e) {}
        };
        try {
          window.addEventListener("beforeunload", (ev) => {
            try { Ze(); } catch (e2) {}
            try { YourTubeResources.cleanup(); } catch (e2) {}
            e(ev);
          }, { capture: !0 });
        } catch (e) {}
        try {
          window.addEventListener("pagehide", e, { capture: !0 });
        } catch (e) {}
        try {
          window.addEventListener(
            "pagehide",
            () => {
              try { if (typeof YourTubeEngine !== "undefined" && YourTubeEngine.flushStores) YourTubeEngine.flushStores(); } catch (_) {}
              YourTubeResources.TrackedBlobURL.revokeAll();
              Ve.clear();
            },
            { capture: !0 },
          );
        } catch (e) {}
        try {
          document.addEventListener(
            "visibilitychange",
            () => {
              if ("hidden" === document.visibilityState) {
                e();
                try { if (typeof YourTubeEngine !== "undefined" && YourTubeEngine.flushStores) YourTubeEngine.flushStores(); } catch (_) {}
              }
            },
            { capture: !0 },
          );
        } catch (e) {}
        try {

          window.addEventListener(
            "pageshow",
            (ev) => {
              try {
                if (!ev || !ev.persisted) return;

                try { window.___yourtubeBfcacheReapplied = Date.now(); } catch (e2) {}
                u("bfcache restore: re-arming resources and re-applying features");
                try { YourTubeResources.cleanup(); } catch (e2) {}
                try { Z.abort(); } catch (e2) {}
                try { Z = new AbortController(); } catch (e2) {}
                try { da.clear(); } catch (e2) {}
                try { _ytNavMarkSettled(); } catch (e2) {}
                try { ue(); } catch (e2) {}
                try { xa.applyAll(); } catch (e2) {}
                try { ft(); } catch (e2) {}
                try { g.emit("nav.changed", { url: location.href, bfcache: !0 }); } catch (e2) {}
              } catch (e2) {
                m("bfcache restore", e2);
              }
            },
            { capture: !0 },
          );
        } catch (e) {}
      })();
    } catch (e) {
      m("attachCfgFlushHooks", e);
    }
    try {
      _ytEarlyTheme();
    } catch (e) {}

    try {

      const _loadCfgBody = async function () {
        const e = [];
        try {
          const t = await v("kv", I);
          t &&
            t.v &&
            "object" == typeof t.v &&
            e.push({
              src: "idb",
              ts: t.updatedAt || 0,
              ver: t.ver || 0,
              data: t.v,
            });
        } catch (e) {
          h("loadCfg IDB read failed", e);
        }
        const t = q();
        t && e.push({ src: "gm", ts: t.__ts || 0, ver: t.__ver || 0, data: t });
        const a = V();
        a && e.push({ src: "ls", ts: a.__ts || 0, ver: a.__ver || 0, data: a });
        const n = F(e);
        if (n) {
          A = Math.max(A, n.ver || 0);
          const t = Object.assign({}, n.data);
          (delete t.__ts,
            delete t.__ver,
            j(t),
            (function () {
              if (!_bootTouched.size) return;
              const _kept = _bootTouched.size;
              for (const [k, v] of _bootTouched) {
                if (_FORBIDDEN_CFG_KEYS[k]) continue;
                S[k] = v;
              }
              _bootTouched.clear();
              try { u("Late config merge: kept " + _kept + " key(s) changed during boot"); } catch (_) {}
            })(),
            e.length > 1 &&
              e.some(
                (e) =>
                  e !== n &&
                  ((e.ver || 0) < (n.ver || 0) ||
                    (e.ts || 0) < (n.ts || 0) - 2e3),
              ) &&
              W(S, A));
        }
        ((T = !0), g.emit("cfg.loaded"));
      };
      const _snapBefore = Object.assign({}, S);
      await Promise.race([
        _loadCfgBody().then(() => "done"),
        new Promise((r) => setTimeout(() => r("timeout"), 1500)),
      ]).then((who) => {
        if (who !== "timeout") return;

        try {
          g.once("cfg.loaded", () => {
            try {
              if (typeof ka === "undefined" || !ka) return;
              setTimeout(() => {
                try {
                  const _touched = new Set();
                  for (const _k of Object.keys(_snapBefore))
                    if (S[_k] !== _snapBefore[_k]) {
                      const _feats = ka.get(_k);
                      if (_feats) for (const _f of _feats) _touched.add(_f.id);
                    }
                  for (const _k of Object.keys(S))
                    if (!(_k in _snapBefore)) {
                      const _feats = ka.get(_k);
                      if (_feats) for (const _f of _feats) _touched.add(_f.id);
                    }
                  _touched.forEach((_id) => xa.apply(_id));
                  if (_touched.size)
                    u("Late config merge: " + _touched.size + " feature(s) re-applied");
                } catch (_) {}
              }, 0);
            } catch (_) {}
          });
        } catch (_) {}
      });
    } catch (e) {
      m("loadCfg failed", e);
      T = !0;
    }
    try {
      S.geoOverrideOn && Mn();
    } catch (e) {}

    const _ytShellReady = () => {
      try {
        if (!document.body) return !1;
        if (document.querySelector("ytd-app, ytmusic-app")) return !0;
        return !!document.querySelector(
          "yt-page-manager, ytd-page-manager, #page-manager, #contents",
        );
      } catch (_) {
        return !!document.body;
      }
    };
    const _applyOnce = () => {
      try {
        xa.applyAll();
      } catch (e) {
        m("applyAll", e);
      }

      try { window.___yourtube_last_apply = Date.now(); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent("yourtube:applied")); } catch (e) {}
      try {
        ft();
      } catch (e) {}
    };
    await new Promise((resolve) => {
      let _settled = !1;
      let _obs = null;
      const _done = () => {
        if (_settled) return;
        _settled = !0;
        clearTimeout(_to);
        try { if (_obs) _obs.disconnect(); } catch (_) {}
        try { document.removeEventListener("DOMContentLoaded", _check); } catch (_) {}
        resolve();
      };
      const _check = () => {
        if (_ytShellReady()) _done();
      };
      const _to = setTimeout(_done, 8000);
      document.addEventListener("DOMContentLoaded", _check, { once: !0 });

      try {
        if (typeof MutationObserver === "function") {
          let _raf = 0;
          _obs = new MutationObserver(() => {
            if (_raf) return;
            _raf = requestAnimationFrame(() => { _raf = 0; _check(); });
          });
          _obs.observe(document.documentElement || document, { childList: true, subtree: true });
        }
      } catch (_) {}
      _check();
    });
    try {
      ue();
    } catch (e) {
      m("applySilentClass", e);
    }
    _applyOnce();
    try {
      if (_riskyActiveNow() && !_riskyAckedNow()) {
        _riskyPrompt();
      }
      try {
        g.on("cfg.changed", ({ key }) => {
          if (
            "forceWatchedAccountHistory" === key ||
            "algoIntelligenceOn" === key ||
            "algoAutoTrain" === key ||
            "algoBoostOn" === key ||
            "algoAutoLikeOn" === key
          ) {
            if (_riskyActiveNow() && !_riskyAckedNow()) _riskyPrompt();
          }
        });
      } catch (_) {}
    } catch (e) {}
    ae(() => {
      try {
        S.sessionRestoreOn && Ge();
      } catch (e) {}
    }, 5e3);

    try {
      const _ypLastUpd = "yourtube_idle_upd_ts";
      const _ypDoUpd = () => {
        try { typeof Fu === "function" && Fu(false); } catch (e) {}
      };
      const _ypShouldCheck = () => {
        try {
          const last = Number(GM_getValue && GM_getValue(_ypLastUpd, 0)) || 0;
          return Date.now() - last > 6 * 60 * 60 * 1e3;
        } catch (e) { return true; }
      };
      const _ypMarkChecked = () => {
        try { GM_setValue && GM_setValue(_ypLastUpd, Date.now()); } catch (e) {}
      };

      setTimeout(() => {
        if (_ypShouldCheck()) {
          _ypDoUpd();
          _ypMarkChecked();
        }
      }, 60e3);
    } catch (e) {}
    try {
      let _lastMarkerReapply = 0;
      setInterval(() => {
        try {
          if (!Xt.visible) return;
          if (va.size === 0) return;

          if (ga.size > 0 && ga.size === va.size) return;

          const _shell =
            document.querySelector("ytd-app, ytmusic-app") ||
            document.querySelector(
              "yt-page-manager, ytd-page-manager, #page-manager, #contents",
            );
          if (!_shell) return;
          const _markers = document.querySelector(
            'style[id^="ytb-style-"],style[id^="ytb-"]',
          );

          let _missingStyle = false;
          try {
            if (xa._styleIds && xa._styleIds.size) {
              for (const _sid of xa._styleIds) {
                if (!document.getElementById(_sid)) {
                  _missingStyle = true;
                  break;
                }
              }
            }
          } catch (_) {}
          const _now = Date.now();
          if ((_missingStyle || !_markers) && _now - _lastMarkerReapply > 3e5) {
            _lastMarkerReapply = _now;
            h(
              "watchdog: re-applying features (" +
                (!_markers ? "no markers" : "missing " + "registered style(s)") +
                ")",
            );
            try {
              xa.applyAll();
            } catch (e) {}
            try {
              // Drop ids whose element did not come back, so a stale entry
              // cannot wedge the watchdog into re-applying forever.
              if (xa._styleIds) {
                for (const _sid of Array.from(xa._styleIds)) {
                  if (!document.getElementById(_sid)) xa._styleIds.delete(_sid);
                }
              }
            } catch (e) {}
            try {
              ft();
            } catch (e) {}
          }
        } catch (e) {}
      }, 2e4);
    } catch (e) {}
  })().catch((e) => {

    try {
      m("boot", e);
    } catch (e2) {
      try { console.error("[YourTube] boot error:", e && (e.message || String(e))); } catch (e3) {}
    }
  });
  try {
    window.__YOURTUBE_READY__ = true;
    window.dispatchEvent(new CustomEvent("yourtube:ready"));
  } catch (e) {}
})();
