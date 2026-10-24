  (xa.register({
    id: "theme-engine",
    name: "Theme Engine",
    summary: "201 hand-tuned themes, custom accent colors, focus rings, compact mode.",
      cat: "appearance",
    masterKey: "themeEngineOn",
    keys: [
      "themeEngineOn",
      "themeCompactOn",
      "themeSelected",
      "themeOverhaulOn",
      "themeGlassOverhaulOn",
      "themeFxReducedMotion",
    ],
    apply(t) {
      if ((zr(), Zr(), S.themeEngineOn && (S.themeGlassOverhaulOn || S.themeOverhaulOn))) {
        (Xr(), Yt["theme-engine"].push(Zr));
      } else {
        Zr();
      }
      if (_overhaulUnsub) { try { _overhaulUnsub(); } catch (_e) {} }
      _overhaulUnsub = So("cfg.changed", ({ key: k }) => {
        if (!S.themeEngineOn) return;
        if (k === "themeGlassOverhaulOn" || k === "themeOverhaulOn" || k === "themeFxReducedMotion") {
          Zr();
          (S.themeGlassOverhaulOn || S.themeOverhaulOn) && Xr();
        }
      });
      Yt["theme-engine"].push(() => {
        if (_overhaulUnsub) { try { _overhaulUnsub(); } catch (_e2) {} _overhaulUnsub = null; }
      });
      if (!S.themeEngineOn || "none" === S.themeSelected)
        return void (
          S.themeEngineOn &&
          S.themeOverhaulOn &&
          (Xr(), Yt["theme-engine"].push(Zr))
        );
      const a = Nr.find((e) => e.id === S.themeSelected) || _customThemes.find((e) => e.id === S.themeSelected);
      if (!a || !a.vars) {

        setTimeout(() => {
          const retry = Nr.find((e2) => e2.id === S.themeSelected) || _customThemes.find((e2) => e2.id === S.themeSelected);
          if (!retry || !retry.vars) Ta("themeSelected", "none");
        }, 1500);
        return;
      }
      const n = () => {
        try {
          !(function (t) {
            if ("dark" !== t && "light" !== t) return;
            let a = !1;
            try {
              a = document.documentElement.hasAttribute("dark");
            } catch (e) {}
            const n = "dark" === t,
              r = a !== n;
            try {
              if (!_themeOrig) {
                let pref = "",
                  f6 = "";
                try {
                  const c = document.cookie.match(/(?:^|;\s*)PREF=([^;]*)/);
                  if (c) {
                    pref = decodeURIComponent(c[1]);
                    const fm = pref.match(/f6=(\d+)/);
                    f6 = (fm && fm[1]) || "";
                  }
                } catch (e) {}
                _themeOrig = {
                  dark: a,
                  colorScheme: document.documentElement.style.colorScheme || "",
                  theme: (e.ytcfg && e.ytcfg.get && e.ytcfg.get("THEME")) || "",
                  bg: (e.ytcfg && e.ytcfg.get && e.ytcfg.get("BACKGROUND_COLOR")) || "",
                  meta: (document.querySelector('meta[name="theme-color"]') || {}).content || "",
                  pref: pref,
                  f6: f6,
                };
              }
            } catch (e) {}
            try {
              const e = document.documentElement;
              n ? e.setAttribute("dark", "") : e.removeAttribute("dark");
            } catch (e) {}
            try {
              const e = document.documentElement;
              n
                ? (e.removeAttribute("light"),
                  e.setAttribute(
                    "data-cast-api-enabled",
                    e.getAttribute("data-cast-api-enabled") || "true",
                  ))
                : e.removeAttribute("dark");
            } catch (e) {}
            try {
              document.documentElement.style.colorScheme = n ? "dark" : "light";
            } catch (e) {}
            try {
              e.ytcfg &&
                e.ytcfg.set &&
                e.ytcfg.set(
                  n
                    ? { BACKGROUND_COLOR: "#0f0f0f", THEME: "DARK" }
                    : { BACKGROUND_COLOR: "#ffffff", THEME: "LIGHT" },
                );
            } catch (e) {}
            try {
              const e = document.querySelector('meta[name="theme-color"]');
              e && e.setAttribute("content", n ? "#0f0f0f" : "#ffffff");
            } catch (e) {}
            try {
              if (r) {
                const e = document.cookie.match(/(?:^|;\s*)PREF=([^;]*)/),
                  t = new Date(Date.now() + 3456e7).toUTCString(),
                  a = e ? decodeURIComponent(e[1]) : "",
                  r = {};
                (a &&
                  a.split("&").forEach((e) => {
                    const t = e.indexOf("=");
                    t > 0 && (r[e.substring(0, t)] = e.substring(t + 1));
                  }),
                  (r.f6 = String(n ? (parseInt(r.f6 || "0", 10) | 32) & ~16 : (parseInt(r.f6 || "0", 10) | 16) & ~32)));
                const o = Object.keys(r)
                    .map((e) => e + "=" + r[e])
                    .join("&"),
                  i = "; expires=" + t + "; path=/; SameSite=Lax";
                if (typeof ti !== 'undefined' && ti.cookieControl && ti.cookieControl.manager) {
                  ti.cookieControl.manager.set("PREF", o, { domain: ".youtube.com", path: "/", sameSite: "Lax", expires: t });
                } else {
                  document.cookie = "PREF=" + o + i;
                }
              }
            } catch (e) {}
            if (r)
              try {
                document.dispatchEvent(
                  new CustomEvent("yt-action", {
                    detail: {
                      actionName: n
                        ? "yt-signal-action-toggle-dark-theme-on"
                        : "yt-signal-action-toggle-dark-theme-off",
                      args: [],
                    },
                  }),
                );
              } catch (e) {}
          })(a.mode);
        } catch (e) {}
      };
      if ("dark" === a.mode || "light" === a.mode) {
        n();
        for (const e of [60, 200, 600, 1500, 3500]) t.addTimeout(n, e);
      }
      let r = "";
      const _memoKey = JSON.stringify(a && a.vars ? [a.id, a.mode] : a) + "|v4";
      if (_themeCssMemo.k === _memoKey && _themeCssMemo.v && r !== null) {
        r = _themeCssMemo.v;
      } else
      try {
        r = (function (e) {
          if (!e || !e.vars) return "";
          const _zrgb = (c) => {
            if ("string" != typeof c) return null;
            const m = c.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
            if (m) {
              let h = m[1];
              if (h.length === 3) h = h.split("").map((q) => q + q).join("");
              const n = parseInt(h, 16);
              return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
            }
            const g = String(c).match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
            return g ? [+g[1], +g[2], +g[3]] : null;
          };
          const _zlum = (c) => {
            const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
            return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
          };
          const _zratio = (a, b) => { const x = _zlum(a) + 0.05, y = _zlum(b) + 0.05; return x > y ? x / y : y / x; };
          const _zmix = (a, b, t) => [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)];
          const _zcss = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
          const _ytAdaptInk = (col, bg, mode, target) => {
            const fg = _zrgb(col), b = _zrgb(bg);
            if (!fg || !b) return col;
            let cur = fg;
            for (let i = 0; i < 24 && _zratio(cur, b) < target; i++) cur = _zmix(cur, "light" === mode ? [0, 0, 0] : [255, 255, 255], 0.08);
            return _zcss(cur);
          };
          const t = e.vars,
            a = t["base-background"],
            n = t["raised-background"],
            r = t["menu-background"],
            o = t["general-background-a"],
            i = t["general-background-b"],
            d = t["general-background-c"],
            p = t["badge-chip-background"],
            _ytAdaptInkAll = (col, bgs, mode, target) => {
              const fg = _zrgb(col);
              const list = (bgs || []).map(_zrgb).filter(Boolean);
              if (!fg || !list.length) return col;
              let cur = fg;
              for (let i = 0; i < 40 && list.some((bg) => _zratio(cur, bg) < target); i++) {
                cur = _zmix(cur, "light" === mode ? [0, 0, 0] : [255, 255, 255], 0.06);
              }
              return _zcss(cur);
            },
            c = _ytAdaptInkAll(t["text-primary"], [a, n, r], e.mode, 7),
            s = _ytAdaptInkAll(t["text-secondary"], [a, n, r, p], e.mode, 4.6),
            l = _ytAdaptInk(t["text-disabled"], a, e.mode, 3),
            u = t.outline,
            h = t["call-to-action"],
            _ctaFill = _zrgb(h),
            _ctaLabel = !_ctaFill || _zratio([255, 255, 255, 1], _ctaFill) >= _zratio([0, 0, 0, 1], _ctaFill) ? "#fff" : "#000",
            hInk = _ytAdaptInk(h, a, e.mode, 4.5),
            m = t["call-to-action-inverse"],
            y = _ytAdaptInkAll(t["icon-active-other"] || t["icon-inactive"], [a, n, r], e.mode, 4.6),
            g = t["10-percent-layer"],
            f = t.shadow,
            b = g,
            v = p,
            k = [],
            x = [
              "html",
              "html[dark]",
              "html:not([dark])",
              "ytd-app",
              "ytd-masthead",
              "tp-yt-app-drawer",
              "ytd-guide-renderer",
              "ytd-mini-guide-renderer",
              "ytd-popup-container",
              "ytd-multi-page-menu-renderer",
              "ytd-browse",
              "ytd-watch-flexy",
              "ytd-two-column-browse-results-renderer",
              "ytd-search",
              "#content.ytd-app",
              "#page-manager.ytd-app",
              "#masthead",
              "ytd-topbar-logo-renderer",
              "#logo-container",
              "ytd-searchbox",
              "#search-input",
              "button#search-icon-legacy-button",
              "#voice-search-button",
              "ytd-topbar-menu-button-renderer",
              "ytd-notification-topbar-button-renderer",
              "ytd-simple-menu-button-renderer",
              "yt-icon-button",
              "yt-button-shape",
              "#guide-button",
              "#buttons",
              "#end",
              "#start",
              "yt-chip-cloud-chip-renderer",
              "ytd-feed-filter-chip-bar-renderer",
            ].join(","),
            w = [
              "--yt-spec-base-background:" + a,
              "--yt-spec-raised-background:" + n,
              "--yt-spec-menu-background:" + r,
              "--yt-spec-general-background-a:" + o,
              "--yt-spec-general-background-b:" + i,
              "--yt-spec-general-background-c:" + d,
              "--yt-spec-additive-background:" + n,
              "--yt-spec-brand-background-solid:" + a,
              "--yt-spec-brand-background-primary:" + a,
              "--yt-spec-brand-background-secondary:" + n,
              "--yt-spec-text-primary:" + c,
              "--yt-spec-text-primary-inverse:" + a,
              "--yt-spec-text-secondary:" + s,
              "--yt-spec-text-disabled:" + l,
              "--yt-spec-badge-chip-background:" + p,
              "--yt-spec-outline:" + u,
              "--yt-spec-themed-overlay-background:" + n,
              "--yt-spec-themed-overlay-background-medium:" + r,
              "--yt-spec-call-to-action:" + h,
              "--yt-spec-call-to-action-inverse:" + m,
              "--yt-spec-icon-active-other:" + y,
              "--yt-spec-icon-inactive:" + y,
              "--yt-spec-icon-disabled:" + l,
              "--yt-spec-filled-button-focus-outline:" + h,
              "--yt-spec-10-percent-layer:" + g,
              "--yt-spec-20-percent-layer:" + g,
              "--yt-spec-shadow:" + f,
              "--yt-spec-static-overlay-text-primary:#fff",
              "--yt-spec-static-overlay-text-secondary:rgba(255,255,255,.7)",

              "--yt-spec-static-overlay-background-solid:" + a,

              "--yt-spec-static-overlay-background-heavy:rgba(0,0,0,.6)",
              "--yt-spec-static-overlay-background-medium:rgba(0,0,0,.4)",
              "--yt-spec-static-overlay-background-medium-light:rgba(0,0,0,.3)",
              "--yt-spec-static-overlay-background-light:rgba(0,0,0,.1)",
              "--yt-spec-suggested-action:" + p,
              "--yt-spec-suggested-action-inverse:" + c,
              // brand-button pair: signed-out surfaces (bot-check modal,
              // guide sign-in) paint raw YouTube white pills whose text
              // otherwise inherits the theme ink and washes out
              "--yt-spec-brand-button-background:" + h,
              "--yt-spec-brand-button-text:" + _ctaLabel,
              "--yt-spec-brand-button-border-color:" + h,
              "--yt-spec-static-brand-red:#c00",
              "--yt-spec-brand-link-text:" + hInk,
              "--yt-spec-wordmark-text:" + c,
              "--yt-spec-mono-tonal-hover:" + b,
              "--yt-spec-mono-filled-hover:" + v,
              "--yt-spec-touch-response-inverse:" + c,
              "--yt-spec-touch-response:" + g,
              "--yt-spec-themed-blue:" + h,
              "--yt-main-app-background:" + a,
              "--yt-main-app-background-override:" + a,
              "--yt-lightsource-section1-color:" + a,
              "--yt-lightsource-section2-color:" + n,
              "--yt-lightsource-section3-color:" + d,
              "--yt-lightsource-section4-color:" + n,
              "--yt-lightsource-primary-inverse:" + a,
              "--ytd-searchbox-background:" + n,
              "--ytd-searchbox-legacy-border-color:" + u,
              "--ytd-searchbox-legacy-button-color:" + d,
              "--ytd-searchbox-legacy-button-border-color:" + u,
              "--ytd-searchbox-text-color:" + c,
              "--ytd-searchbox-placeholder-color:" + s,
              "--yt-endpoint-color:" + hInk,
              "color-scheme:" + ("dark" === e.mode ? "dark" : "light"),
              "--yt-endpoint-hover-color:" + hInk,
              "--yt-endpoint-visited-color:" + hInk,
              "--yt-live-chat-background-color:" + n,
              "--yt-live-chat-secondary-background-color:" + d,
              "--yt-live-chat-primary-text-color:" + c,
              "--yt-live-chat-secondary-text-color:" + s,
              "--yt-live-chat-action-panel-background-color:" + n,
              "--yt-live-chat-header-background-color:" + n,
              "--paper-dialog-background-color:" + r,
              "--paper-listbox-background-color:" + r,
              "--paper-item-focused-before-color:" + b,
              "--paper-item-selected-weight:600",
              "--paper-tabs-selection-bar-color:" + h,
              "--ytd-guide-entry-background-color-hovered:" + b,
              "--ytd-guide-entry-background-color-selected:" + v,
              "--ytd-guide-entry-icon-color:" + y,
              "--ytd-guide-entry-icon-color-selected:" + c,
              "--ytd-guide-entry-title-color:" + c,
              "--ytd-guide-section-title-color:" + s,
              "--ytd-guide-background-color:" + a,
            ];
          (k.push(x + "{" + _r(w) + "}"),
            k.push(
              [
                "html body",
                "ytd-app",
                "#content.ytd-app",
                "ytd-browse",
                "ytd-two-column-browse-results-renderer",
                "ytd-rich-grid-renderer",
                "ytd-watch-flexy",
                "#page-manager.ytd-app",
                "ytd-search",
              ].join(",") +
                "{background-color:" +
                a +
                "!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              "ytd-default-promo-panel-renderer #content{background-color:transparent!important}",
            ),
            k.push(
              "ytd-default-promo-panel-renderer:has(ytd-player) #hero-title,ytd-default-promo-panel-renderer:has(ytd-player) #hero-title a{color:#fff!important;text-shadow:rgba(0,0,0,.75) 0 0 18px,rgba(0,0,0,.75) 0 2px 8px}",
            ),
            k.push(
              "ytd-default-promo-panel-renderer:has(ytd-player) yt-formatted-string{color:#e8e8e8!important;text-shadow:rgba(0,0,0,.75) 0 0 14px,rgba(0,0,0,.75) 0 1px 6px}",
            ),
            k.push(
              "ytd-masthead,#masthead-container,#masthead.ytd-app{background:" +
                a +
                "!important;background-color:" +
                a +
                "!important;border-bottom-color:" +
                u +
                "!important}",
            ),
            k.push(
              [
                "ytd-topbar-logo-renderer",
                "#logo-container",
                "ytd-masthead a#logo",
                "#masthead #logo-icon",
                "ytd-topbar-logo-renderer #country-code",
              ].join(",") +
                "{color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "ytd-topbar-logo-renderer svg path[fill='#fff']",
                "ytd-topbar-logo-renderer svg path[fill='#ffffff']",
                "#masthead #logo-icon svg path[fill='#fff']",
                "#masthead #logo-icon svg path[fill='#ffffff']",
              ].join(",") +
                "{fill:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "#guide-button yt-icon",
                "#guide-button button yt-icon",
                "button#search-icon-legacy-button",
                "button#search-icon-legacy-button yt-icon",
                "#voice-search-button",
                "#voice-search-button yt-icon",
                "ytd-topbar-menu-button-renderer yt-icon",
                "ytd-notification-topbar-button-renderer yt-icon",
                "ytd-simple-menu-button-renderer yt-icon",
                "ytd-masthead yt-icon-button yt-icon",
                "ytd-masthead .yt-spec-button-shape-next__icon",
                "#masthead #start yt-icon",
                "#masthead #end yt-icon",
                "#masthead #buttons yt-icon",
              ].join(",") +
                "{color:" +
                y +
                "!important;fill:" +
                y +
                "!important}",
            ),
            k.push(
              [
                "ytd-masthead .yt-spec-button-shape-next--tonal",
                "ytd-masthead .yt-spec-button-shape-next--tonal .yt-spec-button-shape-next__icon",
              ].join(",") +
                "{background-color:" +
                p +
                "!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "ytd-guide-renderer",
                "ytd-mini-guide-renderer",
                "tp-yt-app-drawer",
                "tp-yt-app-drawer .ytd-app",
                "tp-yt-app-drawer ytd-app",
                "#guide-content.ytd-app",
                "ytd-guide-renderer.ytd-app",
              ].join(",") +
                "{background:" +
                a +
                "!important;background-color:" +
                a +
                "!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "#guide-section-title.ytd-guide-section-renderer",
                "ytd-guide-section-renderer #guide-section-title",
                "ytd-guide-section-renderer h3",
              ].join(",") +
                "{color:" +
                s +
                "!important}",
            ),
            k.push(
              [
                "ytd-guide-section-renderer",
                "ytd-guide-collapsible-section-entry-renderer",
                "ytd-guide-collapsible-entry-renderer",
              ].join(",") +
                "{border-color:" +
                u +
                "!important;background-color:transparent!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "ytd-guide-entry-renderer",
                "ytd-guide-entry-renderer a",
                "ytd-guide-entry-renderer #endpoint",
                "ytd-guide-entry-renderer #endpoint.yt-simple-endpoint",
                "ytd-guide-entry-renderer tp-yt-paper-item",
                "ytd-mini-guide-entry-renderer",
                "ytd-mini-guide-entry-renderer a",
                "ytd-mini-guide-entry-renderer #endpoint",
              ].join(",") +
                "{background-color:transparent!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                ".title.ytd-guide-entry-renderer",
                "ytd-guide-entry-renderer .title",
                "ytd-guide-entry-renderer yt-formatted-string",
                "ytd-mini-guide-entry-renderer .title",
                "ytd-mini-guide-entry-renderer yt-formatted-string",
              ].join(",") +
                "{color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "ytd-guide-entry-renderer yt-icon",
                "ytd-guide-entry-renderer .guide-icon",
                "ytd-mini-guide-entry-renderer yt-icon",
              ].join(",") +
                "{color:" +
                y +
                "!important;fill:" +
                y +
                "!important}",
            ),
            k.push(
              [
                "ytd-guide-entry-renderer:not([active]) #endpoint:hover",
                "ytd-guide-entry-renderer:not([active]) tp-yt-paper-item:hover",
                "ytd-guide-entry-renderer:not([active]) a:hover",
                "ytd-mini-guide-entry-renderer:not([active]) #endpoint:hover",
                "ytd-mini-guide-entry-renderer:not([active]) a:hover",
              ].join(",") +
                "{background-color:" +
                b +
                "!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "ytd-guide-entry-renderer[active]",
                "ytd-guide-entry-renderer[active] #endpoint",
                "ytd-guide-entry-renderer[active] tp-yt-paper-item",
                "ytd-guide-entry-renderer[active] a",
                "ytd-mini-guide-entry-renderer[active]",
                "ytd-mini-guide-entry-renderer[active] #endpoint",
                "ytd-mini-guide-entry-renderer[active] a",
              ].join(",") +
                "{background-color:" +
                v +
                "!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "ytd-guide-entry-renderer[active] .title",
                "ytd-guide-entry-renderer[active] yt-formatted-string",
                "ytd-guide-entry-renderer[active] yt-icon",
                "ytd-guide-entry-renderer[active] .guide-icon",
                "ytd-mini-guide-entry-renderer[active] .title",
                "ytd-mini-guide-entry-renderer[active] yt-formatted-string",
                "ytd-mini-guide-entry-renderer[active] yt-icon",
              ].join(",") +
                "{color:" +
                c +
                "!important;fill:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "ytd-guide-entry-renderer tp-yt-paper-item::before",
                "ytd-guide-entry-renderer tp-yt-paper-item::after",
                "ytd-mini-guide-entry-renderer tp-yt-paper-item::before",
                "ytd-mini-guide-entry-renderer tp-yt-paper-item::after",
              ].join(",") +
                "{background-color:transparent!important;color:transparent!important}",
            ),
            k.push(
              [
                "#footer.ytd-guide-renderer",
                "#footer.ytd-guide-renderer a",
                "#footer.ytd-guide-renderer #guide-links-primary a",
                "#footer.ytd-guide-renderer #guide-links-secondary a",
                "#copyright.ytd-guide-renderer",
              ].join(",") +
                "{color:" +
                l +
                "!important}",
            ),
            k.push(
              "#secondary,#related,#secondary-inner{background-color:" +
                a +
                "!important}",
            ),
            k.push(
              [
                "ytd-compact-video-renderer",
                "ytd-comment-thread-renderer",
                "ytd-comment-renderer",
                "ytd-rich-item-renderer",
                "ytd-rich-section-renderer",
                "ytd-rich-shelf-renderer",
                "ytd-shelf-renderer",
                "ytd-video-renderer",
              ].join(",") +
                "{background-color:transparent!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "ytd-rich-item-renderer #dismissible",
                "ytd-rich-item-renderer #dismissed",
                "ytd-compact-video-renderer #dismissible",
                "ytd-compact-video-renderer #dismissed",
                "ytd-video-renderer #dismissible",
                "ytd-video-renderer #dismissed",
              ].join(",") + "{border-radius:12px!important}",
            ),
            k.push(
              [
                "tp-yt-iron-dropdown",
                "ytd-menu-popup-renderer",
                "tp-yt-paper-dialog",
                "ytd-multi-page-menu-renderer",
                "ytd-popup-container > tp-yt-iron-dropdown",
                "yt-dropdown-menu",
                "ytd-menu-renderer tp-yt-paper-listbox",
              ].join(",") +
                "{background-color:" +
                r +
                "!important;color:" +
                c +
                "!important;border-radius:12px!important;overflow:hidden!important;border:1px solid " +
                u +
                "!important;box-shadow:0 8px 24px " +
                f +
                "!important}",
            ),
            k.push(
              [
                "ytd-menu-service-item-renderer",
                "ytd-menu-navigation-item-renderer",
                "ytd-menu-service-item-renderer yt-formatted-string",
                "ytd-menu-navigation-item-renderer yt-formatted-string",
                "ytd-account-section-list-renderer",
                "ytd-multi-page-menu-section-renderer",
                "ytd-compact-link-renderer",
                "ytd-compact-link-renderer yt-formatted-string",
              ].join(",") +
                "{background-color:transparent!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "ytd-menu-service-item-renderer:hover",
                "ytd-menu-navigation-item-renderer:hover",
                "ytd-compact-link-renderer:hover",
                "tp-yt-paper-item:hover",
              ].join(",") +
                "{background-color:" +
                b +
                "!important}",
            ),
            k.push(
              "tp-yt-paper-listbox{background-color:" +
                r +
                "!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              "tp-yt-paper-item,tp-yt-paper-item yt-formatted-string{color:" +
                c +
                "!important}",
            ),
            k.push(

              [
                "yt-chip-cloud-chip-renderer",
                "ytd-feed-filter-chip-bar-renderer yt-chip-cloud-chip-renderer",
              ].join(",") +
                "{color:" +
                c +
                "!important;border-color:" +
                u +
                "!important;background-color:transparent!important}",
            ),
            k.push(
              "yt-chip-cloud-chip-renderer .ytChipShapeChip,yt-chip-cloud-chip-renderer yt-chip-shape{background-color:" +
                p +
                "!important;color:" +
                c +
                "!important;border:1px solid " +
                u +
                "!important;border-radius:18px!important}",
            ),
            k.push(
              [
                "yt-chip-cloud-chip-renderer[selected] .ytChipShapeChip",
                "yt-chip-cloud-chip-renderer[aria-selected=true] .ytChipShapeChip",
                "yt-chip-cloud-chip-renderer[chip-style=STYLE_HOME_FILTER_SELECTED] .ytChipShapeChip",
                "yt-chip-cloud-chip-renderer[selected] yt-chip-shape",
                "yt-chip-cloud-chip-renderer[aria-selected=true] yt-chip-shape",
              ].join(",") +
                "{background-color:" +
                c +
                "!important;color:" +
                a +
                "!important;border-color:" +
                c +
                "!important}",
            ),
            k.push(

              "chip-view-model .ytChipShapeChip{background-color:" +
                p +
                "!important;color:" +
                c +
                "!important;border:1px solid " +
                u +
                "!important;border-radius:18px!important}",
            ),
            k.push(
              "chip-view-model .ytChipShapeChip.ytChipShapeActive{background-color:" +
                c +
                "!important;color:" +
                a +
                "!important;border-color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "#search-input",
                "input#search",
                "ytd-searchbox #search-input",
                "ytd-searchbox input",
                ".ytSearchboxComponentInput",
              ].join(",") +
                "{color:" +
                c +
                "!important;background-color:transparent!important}",
            ),
            k.push(
              [
                "ytd-searchbox",
                "#container.ytd-searchbox",
                ".ytSearchboxComponentInputBox",
              ].join(",") +
                "{background-color:" +
                n +
                "!important;border-color:" +
                u +
                "!important}",
            ),
            k.push(
              [
                "a.yt-simple-endpoint",
                "a.ytd-thumbnail",
                "#video-title",
                "h3.ytd-rich-grid-media",
                "#title",
                "yt-formatted-string#video-title",
              ].join(",") +
                "{color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "#metadata-line span",
                "#metadata",
                "ytd-video-meta-block .ytd-video-meta-block",
                "#byline-container",
                "#subscriber-count",
                ".ytd-channel-name",
                ".inline-metadata-item",
              ].join(",") +
                "{color:" +
                s +
                "!important}",
            ),
            k.push(
              "ytd-watch-metadata,#above-the-fold{background-color:" +
                a +
                "!important}",
            ),
            k.push(
              [
                "ytd-engagement-panel-section-list-renderer",
                "ytd-structured-description-content-renderer",
                "ytd-engagement-panel-title-header-renderer",
              ].join(",") +
                "{background-color:" +
                n +
                "!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              "#description.ytd-watch-metadata,ytd-text-inline-expander{color:" +
                c +
                "!important}",
            ),
            k.push(
              "#comments,ytd-comments-header-renderer{background-color:" +
                a +
                "!important}",
            ),
            k.push(
              "ytd-comment-simplebox-renderer #placeholder-area,ytd-comment-simplebox-renderer #input-container{background-color:" +
                n +
                "!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              "ytd-notification-renderer{background-color:transparent!important;color:" +
                c +
                "!important;border-radius:8px!important}",
            ),
            k.push(
              "ytd-notification-renderer:hover{background-color:" +
                b +
                "!important;border-radius:8px!important}",
            ),
            k.push(
              "::-webkit-scrollbar-thumb{background-color:" +
                y +
                "!important;border-radius:8px}",
            ),
            k.push(
              "::-webkit-scrollbar-track{background-color:" + a + "!important}",
            ),
            k.push("::-webkit-scrollbar{width:10px;height:10px}"),
            k.push(
              "yt-spec-touch-feedback-shape__fill{background-color:" +
                b +
                "!important}",
            ),
            k.push(
              "ytd-page-introduction-renderer,ytd-clarification-renderer{background-color:" +
                n +
                "!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "ytd-tabbed-page-header",
                "ytd-tabbed-page-header #page-header",
                "yt-page-header-renderer",
                "yt-page-header-view-model",
                ".ytPageHeaderViewModelHost",
                ".ytPageHeaderViewModelContent",
                ".ytPageHeaderViewModelHeadline",
                ".ytPageHeaderViewModelHeadlineInfo",
                ".pageHeaderRendererHost",
              ].join(",") +
                "{background-color:transparent!important;color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                ".ytPageHeaderViewModelTitle",
                ".ytPageHeaderViewModelTitleLarge",
                ".dynamicTextViewModelHost",
                ".dynamicTextViewModelH1",
                ".dynamicTextViewModelH1 .ytAttributedStringHost",
                ".dynamicTextViewModelH1 span",
                "yt-dynamic-text-view-model",
                "yt-dynamic-text-view-model h1",
                "yt-dynamic-text-view-model span",
              ].join(",") +
                "{color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                ".ytPageHeaderViewModelDescription",
                ".ytPageHeaderViewModelDescription .ytAttributedStringHost",
                ".ytPageHeaderViewModelMetadata",
                ".ytPageHeaderViewModelMetadata .ytAttributedStringHost",
                "yt-description-preview-view-model",
                "yt-description-preview-view-model .ytAttributedStringHost",
                "yt-content-metadata-view-model",
                "yt-content-metadata-view-model .ytAttributedStringHost",
              ].join(",") +
                "{color:" +
                s +
                "!important}",
            ),
            k.push(
              [
                ".ytAttributedStringHost",
                ".yt-core-attributed-string",
                ".yt-core-attributed-string--white-space-pre-wrap",
              ].join(",") +
                "{color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                ".yt-core-attributed-string a",
                ".yt-core-attributed-string__link",
                ".yt-core-attributed-string--link-inherit-color",
              ].join(",") +
                "{color:" +
                hInk +
                "!important}",
            ),
            k.push(
              [
                ".ytTabsViewModelHost",
                ".ytTabShapeHost",
                "yt-tab-shape",
                "yt-tabs-view-model",
                ".tab-content.style-scope.yt-tab-shape",
              ].join(",") +
                "{background-color:transparent!important;color:" +
                s +
                "!important}",
            ),
            k.push(
              [
                ".ytTabShapeHost--selected",
                "yt-tab-shape[aria-selected=true]",
                "yt-tab-shape.ytd-feed-filter-chip-bar-renderer[aria-selected=true]",
              ].join(",") +
                "{color:" +
                c +
                "!important;border-color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "yt-chip-shape",
                ".ytChipShapeHost",
                ".ytChipShapeChipText",
                ".ytChipShapeChipText .ytAttributedStringHost",
              ].join(",") +
                "{background-color:" +
                p +
                "!important;color:" +
                c +
                "!important;border-color:" +
                u +
                "!important}",
            ),
            k.push(
              [
                ".ytChipShapeActive",
                ".ytChipShapeActive .ytChipShapeChipText",
                ".ytChipShapeActive .ytAttributedStringHost",
              ].join(",") +
                "{background-color:" +
                c +
                "!important;color:" +
                a +
                "!important}",
            ),
            k.push(
              [
                ".yt-spec-button-shape-next--mono",
                ".yt-spec-button-shape-next--tonal",
                ".yt-flexible-actions-view-model",
                ".page-header-view-model-wiz__page-header-flex-end-content",
              ].join(",") +
                "{color:" +
                c +
                "!important}",
            ),
            k.push(
              [
                "#page-header-banner",
                "yt-image-banner-view-model",
                ".page-header-view-model-wiz__page-header-headline-image",
              ].join(",") +
                "{background-color:" +
                n +
                "!important;border-radius:12px!important;overflow:hidden!important}",
            ),
            k.push(
              [
                "ytd-thumbnail",
                "ytd-thumbnail a",
                "ytd-thumbnail.ytd-rich-grid-media",
                "ytd-thumbnail.ytd-video-renderer",
                "ytd-thumbnail.ytd-compact-video-renderer",
                "ytd-thumbnail.ytd-playlist-thumbnail",
                "ytd-playlist-thumbnail",
                "yt-thumbnail-view-model",
                ".yt-thumbnail-view-model",
                ".ytThumbnailViewModelImage",
                ".collections-stack-wiz__collection-stack1",
                ".collections-stack-wiz__collection-stack2",
                "yt-collection-thumbnail-view-model",
                "ytd-moving-thumbnail-renderer",
                "#thumbnail.ytd-rich-grid-media",
                "ytd-rich-grid-media a#thumbnail",
              ].join(",") +
                "{border-radius:12px!important;overflow:hidden!important}",
            ),
            k.push(
              [
                "ytd-thumbnail img",
                "ytd-thumbnail yt-img-shadow",
                "ytd-playlist-thumbnail img",
                ".ytThumbnailViewModelImage img",
                "yt-img-shadow.ytd-thumbnail img",
              ].join(",") + "{border-radius:12px!important}",
            ),
            k.push(
              [
                "yt-img-shadow.ytd-channel-thumbnail",
                "ytd-channel-thumbnail img",
                "ytd-channel-thumbnail",
                "yt-avatar-shape",
                ".yt-avatar-shape",
                ".yt-spec-avatar-shape",
                ".yt-spec-avatar-shape img",
                "img.ytd-channel-avatar-editor",
                "#avatar img",
                "#owner #avatar",
              ].join(",") +
                "{border-radius:50%!important;overflow:hidden!important}",
            ),
            k.push(
              [
                ".yt-spec-button-shape-next",
                ".yt-spec-button-shape-next--size-m",
                ".yt-spec-button-shape-next--size-s",
                ".yt-spec-button-shape-next--size-l",
                "tp-yt-paper-button",
                "yt-button-shape",
                "yt-button-shape button",
                "ytd-button-renderer button",
              ].join(",") + "{border-radius:18px!important}",
            ),
            k.push(
              [
                ".yt-spec-button-shape-next--icon-only-default",
                ".yt-spec-button-shape-next--icon-only-default button",
                ".yt-spec-button-shape-next--icon-only",
              ].join(",") + "{border-radius:50%!important}",
            ));
          const C = ".ytSpecButtonShapeNextHost";
          k.push(
            [
              C,
              C + " .ytSpecButtonShapeNextButtonTextContent",
              C + " .ytAttributedStringHost",
              C + " yt-icon",
              C + " .ytSpecButtonShapeNextIcon",
            ].join(",") +
              "{color:" +
              c +
              "!important;fill:" +
              c +
              "!important}",
          );
          const S =
            ":not(.ytSpecButtonShapeNextSegmentedStart):not(.ytSpecButtonShapeNextSegmentedEnd):not(.ytSpecButtonShapeNextIconOnlyDefault):not(.ytSpecButtonShapeNextIconOnly)";
          return (
            k.push(
              ".ytSpecButtonShapeNextMono:not(.ytSpecButtonShapeNextFilled):not(.ytSpecButtonShapeNextTonal)" +
                S +
                "{background-color:transparent!important;color:" +
                c +
                "!important;border:0!important;border-radius:18px!important}",
            ),
            k.push(
              ".ytSpecButtonShapeNextFilled.ytSpecButtonShapeNextMono" +
                S +
                "{background-color:" +
                c +
                "!important;color:" +
                a +
                "!important;border:0!important;border-radius:18px!important}",
            ),
            k.push(
              ".ytSpecButtonShapeNextFilled.ytSpecButtonShapeNextMono .ytAttributedStringHost,.ytSpecButtonShapeNextFilled.ytSpecButtonShapeNextMono .ytSpecButtonShapeNextButtonTextContent,.ytSpecButtonShapeNextFilled.ytSpecButtonShapeNextMono yt-icon{color:" +
                a +
                "!important;fill:" +
                a +
                "!important}",
            ),
            k.push(
              ".ytSpecButtonShapeNextTonal.ytSpecButtonShapeNextMono" +
                S +
                "{background-color:" +
                p +
                "!important;color:" +
                c +
                "!important;border:0!important;border-radius:18px!important}",
            ),
            k.push(
              ".ytSpecButtonShapeNextHost.ytSpecButtonShapeNextCallToAction" +
                S +
                ",.ytSpecButtonShapeNextCallToAction" +
                S +
                "{background-color:" +
                h +
                "!important;color:" +
                _ctaLabel +
                "!important;border:0!important;border-radius:18px!important}",
            ),
            k.push(
              ".ytSpecButtonShapeNextSegmentedStart{background-color:" +
                p +
                "!important;color:" +
                c +
                "!important;border:0!important;border-right:1px solid " +
                u +
                "!important;border-radius:18px 0 0 18px!important}",
            ),
            k.push(
              ".ytSpecButtonShapeNextSegmentedEnd{background-color:" +
                p +
                "!important;color:" +
                c +
                "!important;border:0!important;border-radius:0 18px 18px 0!important}",
            ),
            k.push(
              ".ytSpecButtonShapeNextIconOnlyDefault,.ytSpecButtonShapeNextIconOnly{border-radius:50%!important}",
            ),
            k.push(
              ".ytSpecButtonShapeNextSizeM" +
                S +
                "{height:36px!important;min-width:36px!important;padding:0 16px!important}",
            ),
            k.push(
              ".ytSpecButtonShapeNextSizeS" +
                S +
                "{height:32px!important;min-width:32px!important;padding:0 12px!important}",
            ),
            k.push(
              ".ytSpecButtonShapeNextSizeL" +
                S +
                "{height:48px!important;min-width:48px!important;padding:0 24px!important}",
            ),
            k.push(
              ".ytSpecButtonShapeNextSegmentedStart.ytSpecButtonShapeNextSizeM,.ytSpecButtonShapeNextSegmentedEnd.ytSpecButtonShapeNextSizeM{height:36px!important}",
            ),
            k.push(".ytSpecButtonShapeNextHost:hover{filter:brightness(1.08)}"),
            k.push(
              ".ytSpecTouchFeedbackShapeHost,.ytSpecTouchFeedbackShapeFill,.ytSpecTouchFeedbackShapeStroke{background-color:transparent!important;border-color:transparent!important}",
            ),
            k.push(
              "timed-animation-button-renderer,.ytwTimedAnimationButtonRendererHost,.ytSmartImationsHost,.ytSmartImationsContent{color:" +
                c +
                "!important}",
            ),
            k.push(
              ".ytSearchboxComponentSuggestionsContainer{border-radius:0 0 12px 12px!important}",
            ),
            k.push(
              [
                "#container.ytd-searchbox",
                ".ytSearchboxComponentInputBox",
                ".ytSearchboxComponentInputBoxHasFocus",
              ].join(",") + "{border-radius:20px 0 0 20px!important}",
            ),
            k.push(
              [
                "#search-icon-legacy.ytd-searchbox",
                ".ytSearchboxComponentSearchButton",
              ].join(",") + "{border-radius:0 20px 20px 0!important}",
            ),
            k.push(
              "ytd-searchbox{border-radius:0!important;overflow:visible!important}",
            ),
            k.push(
              [
                "yt-chip-cloud-chip-renderer",
                "ytd-feed-filter-chip-bar-renderer yt-chip-cloud-chip-renderer",
                "yt-chip-shape",
                ".ytChipShapeHost",
              ].join(",") + "{border-radius:8px!important}",
            ),
            k.push(
              [
                "ytd-comment-thread-renderer #header.ytd-comments-header-renderer",
                "ytd-comment-renderer #body",
                "ytd-comment-replies-renderer",
                "ytd-comment-simplebox-renderer #placeholder-area",
                "ytd-comment-simplebox-renderer #input-container",
              ].join(",") + "{border-radius:12px!important}",
            ),
            k.push(
              [
                "ytd-watch-metadata",
                "#above-the-fold.ytd-watch-metadata",
                "ytd-engagement-panel-section-list-renderer",
                "ytd-structured-description-content-renderer",
                "ytd-engagement-panel-title-header-renderer",
                "ytd-clarification-renderer",
                "ytd-page-introduction-renderer",
                "ytd-merch-shelf-renderer",
                "ytd-product-list-item-renderer",
                "ytd-rich-metadata-renderer",
              ].join(",") + "{border-radius:12px!important}",
            ),
            k.push(
              [
                "ytd-subscribe-button-renderer tp-yt-paper-button",
                "ytd-subscribe-button-renderer yt-button-shape button",
                "ytd-toggle-button-renderer button",
                "ytd-segmented-like-dislike-button-renderer .yt-spec-button-shape-next:not(.yt-spec-button-shape-next--segmented-start):not(.yt-spec-button-shape-next--segmented-end)",
              ].join(",") + "{border-radius:18px!important}",
            ),
            k.push(
              ".yt-spec-button-shape-next--segmented-start{border-radius:18px 0 0 18px!important;border-right:1px solid " +
                u +
                "!important}",
            ),
            k.push(
              ".yt-spec-button-shape-next--segmented-end{border-radius:0 18px 18px 0!important}",
            ),
            k.push(
              [
                "segmented-like-dislike-button-view-model",
                "ytd-segmented-like-dislike-button-renderer",
                "like-button-view-model",
                "dislike-button-view-model",
              ].join(",") +
                "{display:inline-flex!important;align-items:center!important;overflow:visible!important;background:transparent!important}",
            ),
            k.push(
              [
                ".yt-spec-button-shape-next.yt-spec-button-shape-next--size-m",
              ].join(",") + "{padding:0 16px!important;height:36px!important}",
            ),
            k.push(
              [
                ".yt-spec-button-shape-next.yt-spec-button-shape-next--icon-leading-trailing",
                ".yt-spec-button-shape-next .yt-spec-button-shape-next__icon",
              ].join(",") + "{gap:6px!important}",
            ),
            k.push(
              [
                "tp-yt-paper-tooltip",
                "#tooltip.tp-yt-paper-tooltip",
                "yt-tooltip",
                ".ytTooltip",
                "yt-pdg-tooltip-renderer",
              ].join(",") + "{border-radius:6px!important}",
            ),
            k.push(
              [
                "ytd-guide-entry-renderer",
                "ytd-guide-entry-renderer #endpoint",
                "ytd-guide-entry-renderer tp-yt-paper-item",
                "ytd-mini-guide-entry-renderer",
                "ytd-mini-guide-entry-renderer #endpoint",
              ].join(",") +
                "{border-radius:10px!important;overflow:hidden!important}",
            ),
            k.push(
              [
                "yt-live-chat-text-message-renderer",
                "yt-live-chat-paid-message-renderer",
                "yt-live-chat-membership-item-renderer",
              ].join(",") + "{border-radius:8px!important}",
            ),
            k.push(
              [
                "yt-interaction",
                "yt-interaction .fill",
                "yt-interaction .stroke",
                "yt-interaction .yt-interaction-fill",
                "yt-interaction .yt-interaction-stroke",
              ].join(",") +
                "{background-color:transparent!important;border-radius:inherit!important}",
            ),
            k.push(
              [
                "yt-touch-feedback-shape",
                "yt-spec-touch-feedback-shape",
                ".yt-spec-touch-feedback-shape__fill",
                ".yt-spec-touch-feedback-shape__stroke",
              ].join(",") + "{border-radius:inherit!important}",
            ),
            k.push(
              "html,html[dark],html:not([dark]){" +
                _r([
                  "--yt-spec-border-radius-small:4px",
                  "--yt-spec-border-radius-medium:8px",
                  "--yt-spec-border-radius-large:12px",
                  "--yt-spec-border-radius-xlarge:18px",
                  "--ytd-rich-grid-item-border-radius:12px",
                  "--yt-search-suggestion-border-radius:8px",
                  "--ytd-thumbnail-border-radius:12px",
                  "--yt-button-shape-border-radius:18px",
                  "--paper-card-border-radius:12px",
                  "--paper-dialog-border-radius:12px",
                  "--paper-menu-button-content-border-radius:12px",
                ]) +
                "}",
            ),
            k.join("\n")
          );
        })(a);
        _themeCssMemo.k = _memoKey;
        _themeCssMemo.v = r;
      } catch (e) {
        (h("themeBuildCSS", e), (r = ""));
      }
      r && (r += "\n" + _ytThemeExtras());
      _ytEarlyThemeDrop();
      r &&
        (Vr(r),
        Fr(),
        _brStart(a, t),
        (function () {
          jr();
          try {
            if (!document.head || !Hr) return;
            let e = !1,
              t = !1;
            ((Dr = new MutationObserver(() => {
              t
                ? (t = !1)
                : e ||
                  ((e = !0),
                  requestAnimationFrame(() => {
                    e = !1;
                    try {
                      document.getElementById(qr)
                        ? document.head.lastElementChild !== Hr &&
                          ((t = !0), Fr())
                        : Hr &&
                          Hr.textContent &&
                          ((t = !0), Vr(Hr.textContent));
                    } catch (e) {}
                  }));
            })),
              Dr.observe(document.head, { childList: !0 }));
          } catch (e) {}
        })(),
        S.themeOverhaulOn && Xr(),
        t.onNav(() => {
          if ("dark" === a.mode || "light" === a.mode)
            for (const e of [60, 250, 800, 2e3]) t.addTimeout(n, e);
          for (const e of [80, 350, 1200])
            t.addTimeout(() => {
              (document.getElementById(qr) || Vr(r),
                S.themeOverhaulOn && !document.getElementById(Wr) && Gr(),
            S.themeGlassOverhaulOn && Xr(),
                Fr(),
                (_brScans = 0, _brLastScan = 0, _brSchedule(true)));
            }, e);
        }),
        Yt["theme-engine"].push(zr),
        Yt["theme-engine"].push(_brStop),
        Yt["theme-engine"].push(Zr),
        Yt["theme-engine"].push(() => {
          const o = _themeOrig;
          if (!o) return;
          _themeOrig = null;
          try {
            const de = document.documentElement;
            o.dark ? de.setAttribute("dark", "") : de.removeAttribute("dark");
            de.style.colorScheme = o.colorScheme || "";
          } catch (e) {}
          try {
            e.ytcfg && e.ytcfg.set && e.ytcfg.set({ THEME: o.theme, BACKGROUND_COLOR: o.bg });
          } catch (e) {}
          try {
            const m = document.querySelector('meta[name="theme-color"]');
            m && m.setAttribute("content", o.meta || "");
          } catch (e) {}
          try {
            const mgr = typeof ti !== "undefined" && ti.cookieControl && ti.cookieControl.manager;
            if (o.pref) {
              const exp = new Date(Date.now() + 3456e7).toUTCString();
              if (mgr) mgr.set("PREF", o.pref, { domain: ".youtube.com", path: "/", sameSite: "Lax", expires: exp });
              else document.cookie = "PREF=" + o.pref + "; expires=" + exp + "; path=/; SameSite=Lax";
            } else {
              const past = new Date(0).toUTCString();
              if (mgr) mgr.set("PREF", "", { domain: ".youtube.com", path: "/", sameSite: "Lax", expires: past });
              else document.cookie = "PREF=; expires=" + past + "; path=/; SameSite=Lax";
            }
          } catch (e) {}
          try {
            document.dispatchEvent(
              new CustomEvent("yt-action", {
                detail: {
                  actionName: o.dark
                    ? "yt-signal-action-toggle-dark-theme-on"
                    : "yt-signal-action-toggle-dark-theme-off",
                  args: [],
                },
              }),
            );
          } catch (e) {}
        }));
    },
    settings(t) {
      const a = (function () {
        try {
          if (
            document.documentElement &&
            document.documentElement.hasAttribute("dark")
          )
            return "dark";
        } catch (e) {}
        try {
          if (e.ytcfg && e.ytcfg.get) {
            const t = e.ytcfg.get("THEME");
            if ("DARK" === t) return "dark";
            if ("LIGHT" === t) return "light";
            const a = e.ytcfg.get("BACKGROUND_COLOR");
            if ("#0f0f0f" === a || "#000000" === a) return "dark";
            if ("#ffffff" === a) return "light";
          }
        } catch (e) {}
        try {
          const e = document.cookie.match(/(?:^|;\s*)PREF=([^;]*)/);
          if (e) {
            const t = decodeURIComponent(e[1]).match(/f6=(\d+)/);
            if (t) {
              const e = parseInt(t[1], 10);
              if (32 & e) return "dark";
              if (16 & e) return "light";
            }
          }
        } catch (e) {}
        try {
          if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme:dark)").matches
          )
            return "dark";
        } catch (e) {}
        return "light";
      })();
      (t.appendChild(To("div", "ytb-lbl", "Detected mode: " + a)),
        t.appendChild(To("div", "ytb-elem-sec-title", "Create from color")));
      const cu = typeof culori !== "undefined" ? culori : null;
      const genRow = To("div", "ytb-gen-row");
      genRow.style.cssText = "display:flex;align-items:center;gap:10px;margin:6px 0";
      const genLabel = To("span", "ytb-corelbl", "Base color");
      const genInput = document.createElement("input");
      ((genInput.type = "color"),
        (genInput.value = String(S.themeGenColor || "#ff3d7f")),
        (genInput.style.cssText = "width:34px;height:26px;padding:0;border:1px solid rgba(255,255,255,.15);border-radius:6px;background:transparent;cursor:pointer"),
        (genRow.style.cssText = "display:flex;align-items:center;gap:10px;margin:6px 0"));
      const genBtn = To("button", "ytb-ui-btn");
      genBtn.type = "button";
      genBtn.textContent = "Generate theme";
      genBtn.style.cssText = "font:600 10.5px system-ui;padding:5px 12px;border-radius:99px;border:1px solid rgba(255,61,127,.4);background:rgba(255,61,127,.14);color:#ff8aa5;cursor:pointer";
      genRow.append(genLabel, genInput, genBtn);
      const genStatus = To("div", "ytb-hist-note");
      genStatus.style.cssText = "font-size:10.5px;color:#888;margin:2px 0 8px";
      genStatus.textContent = cu
        ? "Derives a full palette from one color using culori."
        : "culori library not loaded - color themes unavailable.";
      t.append(genRow, genStatus);
      genBtn.addEventListener("click", () => {
        if (!cu) return;
        try {

          const _hexIn = String(genInput.value || "");
          const hex = /^#[0-9a-fA-F]{6}$/.test(_hexIn) ? _hexIn : "#ff3d7f";
          const toHex = (c) => { try { return cu.formatHex(c); } catch (_) { return hex; } };
          const base = cu.hsl(hex);
          const shade = (factor) => toHex(cu.interpolate([hex, factor > 0 ? "#000000" : "#ffffff"], "rgb")(Math.abs(factor)));
          const tint = (hex2, w) => toHex(cu.interpolate([hex2, "#ffffff"], "rgb")(w));
          const dark = a === "dark";
          const vars = dark
            ? {
                "base-background": shade(0.72),
                "raised-background": shade(0.6),
                "menu-background": shade(0.66),
                "general-background-a": shade(0.68),
                "general-background-b": shade(0.74),
                "general-background-c": shade(0.62),
                "text-primary": tint(hex, 0.86),
                "text-secondary": tint(hex, 0.62),
                "text-disabled": tint(hex, 0.4),
                "badge-chip-background": shade(0.5),
                "outline": shade(0.45),
                "call-to-action": hex,
                "call-to-action-inverse": "#0f0f0f",
                "icon-active-other": tint(hex, 0.8),
                "icon-inactive": tint(hex, 0.45),
                "10-percent-layer": "rgba(255,255,255,.1)",
                "shadow": "0 12px 30px rgba(0,0,0,.6)",
              }
            : {
                "base-background": tint(hex, 0.94),
                "raised-background": tint(hex, 0.88),
                "menu-background": tint(hex, 0.9),
                "general-background-a": tint(hex, 0.92),
                "general-background-b": tint(hex, 0.96),
                "general-background-c": tint(hex, 0.86),
                "text-primary": shade(0.55),
                "text-secondary": shade(0.4),
                "text-disabled": shade(0.25),
                "badge-chip-background": tint(hex, 0.8),
                "outline": shade(0.3),
                "call-to-action": hex,
                "call-to-action-inverse": "#ffffff",
                "icon-active-other": shade(0.5),
                "icon-inactive": shade(0.35),
                "10-percent-layer": "rgba(0,0,0,.06)",
                "shadow": "0 12px 30px rgba(0,0,0,.18)",
              };
          const genId = (dark ? "d-" : "l-") + "custom-" + Date.now().toString(36);
          _customThemes.push({ id: genId, name: "Custom (" + hex + ")", mode: dark ? "dark" : "light", vars });
          if (_customThemes.length > 50) _customThemes.splice(0, _customThemes.length - 50);
          try {
            k("kv", { k: "__yourtube_custom_themes__", v: _customThemes.slice(-50), updatedAt: Date.now() });
          } catch (_persistErr) {}
          Ta("themeSelected", genId);
          Ta("themeGenColor", hex);
          genStatus.textContent = "Theme created from " + hex + " and applied. Saved for future sessions.";
          pe("Custom theme generated with culori", 1800, "success");
        } catch (err) {
          genStatus.textContent = "Could not generate theme: " + String(err && err.message ? err.message : err);
        }
      });
      t.appendChild(To("div", "ytb-elem-sec-title", "Extras")),
        t.appendChild(Io("Turn on advanced theme styling", "themeOverhaulOn")),
        t.appendChild(
          Io(
            "Apply full glassmorphism layout to the entire site",
            "themeGlassOverhaulOn",
          ),
        ),
        t.appendChild(Io("Reduce motion (disable theme transitions)", "themeFxReducedMotion"));
      (t.appendChild(To("div", "ytb-elem-sec-title", "Dark Themes")));
      const i = To("div", "ytb-theme-grid");
      const idf = document.createDocumentFragment();
      Nr.filter((e) => "dark" === e.mode).concat(_customThemes.filter((e) => "dark" === e.mode)).forEach((e) =>
        idf.appendChild(Qr(e)),
      );
      (i.appendChild(idf),
        t.appendChild(i),
        t.appendChild(To("div", "ytb-elem-sec-title", "Light Themes")));
      const d = To("div", "ytb-theme-grid");
      const dlf = document.createDocumentFragment();
      Nr.filter((e) => "light" === e.mode).concat(_customThemes.filter((e) => "light" === e.mode)).forEach((e) =>
        dlf.appendChild(Qr(e)),
      );
      (d.appendChild(dlf), t.appendChild(d));
      const c = To("div", "ytb-theme-card reset");
      c.dataset.ytbThemeId = "none";
      ("none" === S.themeSelected && c.classList.add("active"),
        c.appendChild(To("div", "ytb-theme-name", "Default (YouTube)")),
        c.addEventListener("click", () => Ta("themeSelected", "none")),
        t.appendChild(c));

      if (typeof So === "function") {

        if (_themeCardSyncUnsub) { try { _themeCardSyncUnsub(); } catch (_u) {} }
        _themeCardSyncUnsub = So("cfg.changed", (ev) => {
          if ("themeSelected" !== ev.key) return;
          document.querySelectorAll(".ytb-theme-card").forEach((cardEl) => {
            const id = cardEl.dataset ? cardEl.dataset.ytbThemeId : "";
            cardEl.classList.toggle(
              "active",
              id ? S.themeSelected === id : false,
            );
          });
        });
      }
    },
  }));
  let $r = null;
  function eo() {
    if ($r) {
      try {
        $r.remove();
      } catch (e) {}
      $r = null;
    }
    document
      .querySelectorAll("ytd-comment-thread-renderer")
      .forEach((e) => {
        if (e.dataset.ytbCf) return;
        delete e.dataset.ytbCs;
        e.style.display = "";
      });
  }
    (xa.register({
    id: "comment-search",
    name: "Comment Search",
    summary: "Live text filter box above comments.",
      cat: "comments",
    masterKey: "commentSearchOn",
    keys: ["commentSearchOn"],
    apply(e) {
      if (!S.commentSearchOn) return void eo();
      const t = () =>
        (function () {
          if ($r && document.body.contains($r)) return;
          const e =
            document.querySelector("ytd-comments") ||
            document.querySelector("#comments");
          if (!e) return;
          const t = document.createElement("div");
          t.id = "ytb-comment-search";
          const a = document.createElement("input");
          ((a.type = "search"),
            (a.placeholder = "Filter comments…"),
            (a.className = "ytb-cs-input"));
          const n = document.createElement("span");
          n.className = "ytb-cs-count";
          const r = document.createElement("button");
          function o() {
            const e = a.value.trim().toLowerCase(),
              t = document.querySelectorAll("ytd-comment-thread-renderer");
            if (!e)
              return (
                t.forEach((el) => {
                  if (el.dataset.ytbCf) return;
                  delete el.dataset.ytbCs;
                  el.style.display = "";
                }),
                void (n.textContent = t.length + " shown")
              );
            let r = 0;
            (t.forEach((t) => {
              if (t.dataset.ytbCf) return;
              const a = (t.textContent || "").toLowerCase().includes(e);
              if (a) delete t.dataset.ytbCs; else t.dataset.ytbCs = "1";
              ((t.style.display = a ? "" : "none"), a && r++);
            }),
              (n.textContent = r + " / " + t.length));
          }
          ((r.type = "button"),
            (r.textContent = "×"),
            (r.className = "ytb-cs-clear"),
            t.appendChild(a),
            t.appendChild(n),
            t.appendChild(r),
            e.insertBefore(t, e.firstChild),
            ($r = t),
            a.addEventListener("input", ee(o, 100)),
            r.addEventListener("click", () => {
              ((a.value = ""), o(), a.focus());
            }),
            setTimeout(o, 300));
        })();
      (t(),
        e.onNav(() => {
          eo();
          for (const a of [1e3, 2500, 5e3]) e.addTimeout(t, a);
        }));
      for (const a of [1e3, 2500, 5e3]) e.addTimeout(t, a);
    },
    settings() {},
  }));

  xa.register({
      id: "block-yt-ai",
      name: "Hide YouTube AI",
      summary: "Removes YouTube's AI buttons and generated summaries.",
      cat: "feed",
      masterKey: "blockYTAIOn",
      keys: ["blockYTAIOn"],
      apply(e) {
        S.blockYTAIOn &&
          e.addStyle(
            [
              "ytd-ai-summary-renderer",
              "ytd-conversation-ai-renderer",
              "yt-ai-summary",
              "yt-ai-button",
              'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-video-summary"]',
              'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-conversation"]',
              "ytd-rich-section-renderer:has(ytd-ai-summary-renderer)",
            ].join(",") +
              "{display:none!important;visibility:hidden!important;pointer-events:none!important}",
          );
      },
      settings() {},
    });
  const fo = [
    {
      group: "Masthead (top bar)",
      items: [
        {
          id: "masthead",
          name: "Entire top bar",
          selector:
            "ytd-masthead, #masthead, #masthead-container, ytd-topbar, #topbar, #topbar-container",
        },
        {
          id: "masthead-logo",
          name: "YouTube logo",
          selector:
            "ytd-masthead #logo, ytd-masthead a#logo, ytd-topbar-logo-renderer",
        },
        {
          id: "masthead-country",
          name: "Country code on logo",
          selector:
            "ytd-masthead #country-code, ytd-topbar-logo-renderer #country-code",
        },
        {
          id: "masthead-guide-btn",
          name: "Hamburger / guide button",
          selector: "ytd-masthead #guide-button, #guide-button",
        },
        {
          id: "masthead-search-wrap",
          name: "Search box wrapper",
          selector: "ytd-masthead #center, ytd-masthead ytd-searchbox",
        },
        {
          id: "masthead-search-input",
          name: "Search input only",
          selector: "ytd-searchbox input#search",
        },
        {
          id: "masthead-search-btn",
          name: "Search submit button",
          selector:
            "ytd-masthead #search-icon-legacy, ytd-searchbox #search-icon-legacy",
        },
        {
          id: "masthead-voice",
          name: "Voice search button",
          selector: "ytd-masthead #voice-search-button, #voice-search-button",
        },
        {
          id: "masthead-suggest",
          name: "Search suggestion dropdown",
          selector:
            "ytd-searchbox-suggestions-renderer, .ytd-searchbox-suggestions-renderer",
        },
        {
          id: "masthead-create",
          name: "Create (+) button",
          selector:
            "ytd-masthead ytd-topbar-menu-button-renderer:has(button[aria-label='Create']), ytd-masthead yt-button-view-model:has(button[aria-label='Create']), ytd-masthead button[aria-label='Create']",
        },
        {
          id: "masthead-apps",
          name: "Apps grid button",
          selector:
            "ytd-masthead ytd-topbar-menu-button-renderer:has(button[aria-label*='Apps']), ytd-masthead button[aria-label*='Apps']",
        },
        {
          id: "masthead-notif",
          name: "Notifications bell",
          selector: "ytd-masthead ytd-notification-topbar-button-renderer",
        },
        {
          id: "masthead-notif-badge",
          name: "Notification count badge",
          selector:
            "ytd-notification-topbar-button-renderer .yt-spec-icon-badge-shape__badge, #notification-count",
        },
        {
          id: "masthead-avatar",
          name: "Account avatar / sign-in",
          selector:
            "ytd-masthead ytd-topbar-menu-button-renderer:has(#avatar-btn), ytd-masthead button#avatar-btn, ytd-masthead yt-img-shadow#avatar-img",
        },
        {
          id: "masthead-signin",
          name: "Sign-in button",
          selector:
            "ytd-masthead ytd-button-renderer.style-suggestive, ytd-masthead a[href*='accounts.google.com'], ytd-masthead yt-button-view-model:has(a[href*='accounts.google.com'])",
        },
        {
          id: "masthead-premium-promo",
          name: "Premium promo button",
          selector: "ytd-masthead ytd-button-renderer[is-paid-promo]",
        },
        {
          id: "masthead-buttons",
          name: "All right-side buttons area",
          selector: "ytd-masthead #end #buttons",
        },
        {
          id: "masthead-shadow",
          name: "Top bar bottom shadow",
          selector: "ytd-masthead[has-tab-header-renderer]",
        },
      ],
    },
    {
      group: "Sidebar / Guide",
      items: [
        {
          id: "sidebar",
          name: "Entire sidebar drawer",
          selector: "tp-yt-app-drawer#guide",
        },
        {
          id: "sidebar-mini",
          name: "Mini sidebar (collapsed)",
          selector: "ytd-mini-guide-renderer, #mini-guide",
        },
        {
          id: "sidebar-section1",
          name: "Main section (Home/Shorts/Subs)",
          selector:
            "ytd-guide-renderer #sections > ytd-guide-section-renderer:nth-of-type(1)",
        },
        {
          id: "sidebar-home",
          name: "Home link",
          selector:
            "ytd-guide-entry-renderer:has(a[title='Home']), ytd-mini-guide-entry-renderer[aria-label='Home']",
        },
        {
          id: "sidebar-shorts-entry",
          name: "Shorts link",
          selector:
            "ytd-guide-entry-renderer:has(a[title='Shorts']), ytd-mini-guide-entry-renderer[aria-label='Shorts']",
        },
        {
          id: "sidebar-subs",
          name: "Subscriptions link",
          selector:
            "ytd-guide-entry-renderer:has(a[title='Subscriptions']), ytd-mini-guide-entry-renderer[aria-label='Subscriptions']",
        },
        {
          id: "sidebar-you",
          name: "You / Library collapsible",
          selector:
            "ytd-guide-renderer ytd-guide-collapsible-section-entry-renderer",
        },
        {
          id: "sidebar-history",
          name: "History link",
          selector:
            "ytd-guide-entry-renderer:has(a[title='History']), a[href='/feed/history']",
        },
        {
          id: "sidebar-playlists",
          name: "Playlists link",
          selector:
            "ytd-guide-entry-renderer:has(a[title='Playlists']), a[href='/feed/playlists']",
        },
        {
          id: "sidebar-your-videos",
          name: "Your videos link",
          selector: "ytd-guide-entry-renderer:has(a[title*='Your videos'])",
        },
        {
          id: "sidebar-watch-later",
          name: "Watch later link",
          selector: "ytd-guide-entry-renderer:has(a[href*='WL'])",
        },
        {
          id: "sidebar-liked",
          name: "Liked videos link",
          selector: "ytd-guide-entry-renderer:has(a[href*='LL'])",
        },
        {
          id: "sidebar-explore",
          name: "Explore section",
          selector:
            "ytd-guide-renderer ytd-guide-section-renderer:nth-of-type(3)",
        },
        {
          id: "sidebar-trending",
          name: "Trending link",
          selector: "ytd-guide-entry-renderer:has(a[title='Trending'])",
        },
        {
          id: "sidebar-music",
          name: "Music link",
          selector: "ytd-guide-entry-renderer:has(a[title='Music'])",
        },
        {
          id: "sidebar-movies",
          name: "Movies link",
          selector: "ytd-guide-entry-renderer:has(a[title*='Movies'])",
        },
        {
          id: "sidebar-live",
          name: "Live link",
          selector: "ytd-guide-entry-renderer:has(a[title='Live'])",
        },
        {
          id: "sidebar-gaming",
          name: "Gaming link",
          selector: "ytd-guide-entry-renderer:has(a[title='Gaming'])",
        },
        {
          id: "sidebar-news",
          name: "News link",
          selector: "ytd-guide-entry-renderer:has(a[title='News'])",
        },
        {
          id: "sidebar-sports",
          name: "Sports link",
          selector: "ytd-guide-entry-renderer:has(a[title='Sports'])",
        },
        {
          id: "sidebar-learning",
          name: "Learning link",
          selector: "ytd-guide-entry-renderer:has(a[title='Learning'])",
        },
        {
          id: "sidebar-fashion",
          name: "Fashion & Beauty link",
          selector: "ytd-guide-entry-renderer:has(a[title*='Fashion'])",
        },
        {
          id: "sidebar-podcasts",
          name: "Podcasts link",
          selector: "ytd-guide-entry-renderer:has(a[title='Podcasts'])",
        },
        {
          id: "sidebar-more-yt",
          name: "More from YouTube section",
          selector:
            "ytd-guide-renderer ytd-guide-section-renderer:nth-of-type(4)",
        },
        {
          id: "sidebar-yt-premium",
          name: "YouTube Premium link",
          selector: "ytd-guide-entry-renderer:has(a[title*='Premium'])",
        },
        {
          id: "sidebar-yt-studio",
          name: "YouTube Studio link",
          selector: "ytd-guide-entry-renderer:has(a[title*='Studio'])",
        },
        {
          id: "sidebar-yt-music",
          name: "YouTube Music link",
          selector: "ytd-guide-entry-renderer:has(a[title*='YouTube Music'])",
        },
        {
          id: "sidebar-yt-kids",
          name: "YouTube Kids link",
          selector: "ytd-guide-entry-renderer:has(a[title*='Kids'])",
        },
        {
          id: "sidebar-settings",
          name: "Settings link",
          selector:
            "ytd-guide-entry-renderer:has(a[title='Settings']), a[href*='/account']",
        },
        {
          id: "sidebar-report",
          name: "Report history link",
          selector: "ytd-guide-entry-renderer:has(a[title*='Report'])",
        },
        {
          id: "sidebar-help",
          name: "Help link",
          selector: "ytd-guide-entry-renderer:has(a[title='Help'])",
        },
        {
          id: "sidebar-feedback",
          name: "Send feedback link",
          selector: "ytd-guide-entry-renderer:has(a[title*='feedback'])",
        },
        {
          id: "sidebar-footer",
          name: "Footer (links/copyright)",
          selector: "ytd-guide-renderer #footer",
        },
        {
          id: "sidebar-signin-promo",
          name: "Sign-in promo in guide",
          selector: "ytd-guide-signin-promo-renderer",
        },
      ],
    },
    {
      group: "Home feed",
      items: [
        {
          id: "home-chips-bar",
          name: "Filter chips bar",
          selector: "ytd-feed-filter-chip-bar-renderer, iron-selector#chips",
        },
        {
          id: "home-rich-grid",
          name: "Entire grid",
          selector: "ytd-rich-grid-renderer",
        },
        {
          id: "home-shorts-shelf",
          name: "Shorts shelves",
          selector:
            "ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer",
        },
        {
          id: "home-shorts-pill",
          name: "Shorts dismiss pill",
          selector:
            "ytd-rich-shelf-renderer[is-shorts] ytd-shelf-header-layout button",
        },
        {
          id: "home-mix-shelf",
          name: "Mix / playlist shelves",
          selector: "ytd-rich-shelf-renderer:not([is-shorts])",
        },
        {
          id: "home-news-shelf",
          name: "Breaking news shelf",
          selector: "ytd-rich-shelf-renderer[is-default-no-title]",
        },
        {
          id: "home-ads",
          name: "Ad slots in feed",
          selector:
            "ytd-rich-item-renderer ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer, ytd-banner-promo-renderer, ytd-promoted-sparkles-web-renderer",
        },
        {
          id: "home-card-thumb",
          name: "Card thumbnails",
          selector: "ytd-rich-grid-media ytd-thumbnail",
        },
        {
          id: "home-card-hover-preview",
          name: "Hover preview video",
          selector: "ytd-moving-thumbnail-renderer, ytd-video-preview",
        },
        {
          id: "home-card-loading-preview",
          name: "Loading preview overlay",
          selector: "ytd-thumbnail-overlay-loading-preview-renderer",
        },
        {
          id: "home-card-duration",
          name: "Duration badge",
          selector:
            "ytd-rich-grid-media ytd-thumbnail-overlay-time-status-renderer",
        },
        {
          id: "home-card-new-badge",
          name: "'New' badge",
          selector: "ytd-thumbnail-overlay-now-playing-renderer",
        },
        {
          id: "home-card-resume-bar",
          name: "Resume progress bar",
          selector: "ytd-thumbnail-overlay-resume-playback-renderer",
        },
        {
          id: "home-card-title",
          name: "Card titles",
          selector:
            "ytd-rich-grid-media #video-title-link, ytd-rich-grid-media #video-title",
        },
        {
          id: "home-card-channel-avatar",
          name: "Channel avatars on cards",
          selector:
            "ytd-rich-grid-media #avatar-link, ytd-rich-grid-media #avatar-container",
        },
        {
          id: "home-card-channel-name",
          name: "Channel names on cards",
          selector:
            "ytd-rich-grid-media #channel-name, ytd-rich-grid-media ytd-channel-name",
        },
        {
          id: "home-card-meta",
          name: "Views / date metadata",
          selector:
            "ytd-rich-grid-media #metadata-line, ytd-rich-grid-media ytd-video-meta-block",
        },
        {
          id: "home-card-menu",
          name: "3-dot menu on cards",
          selector:
            "ytd-rich-grid-media #menu, ytd-rich-grid-media ytd-menu-renderer",
        },
        {
          id: "home-watched-badge",
          name: "Watched overlay",
          selector: "ytd-thumbnail-overlay-toggle-button-renderer",
        },
        {
          id: "home-sponsored-label",
          name: "Sponsored label",
          selector:
            "ytd-rich-item-renderer ytd-ad-slot-renderer .badge-style-type-ad",
        },
      ],
    },
    {
      group: "Subscriptions feed",
      items: [
        {
          id: "subs-header",
          name: "Subscriptions header",
          selector:
            "ytd-browse[page-subtype='subscriptions'] ytd-page-header-renderer",
        },
        {
          id: "subs-chips",
          name: "Subs filter chips",
          selector:
            "ytd-browse[page-subtype='subscriptions'] ytd-feed-filter-chip-bar-renderer",
        },
        {
          id: "subs-shelf-headers",
          name: "Date shelves (Today/Yesterday/etc)",
          selector:
            "ytd-browse[page-subtype='subscriptions'] ytd-item-section-renderer #title",
        },
        {
          id: "subs-toggle-grid",
          name: "Grid/List toggle",
          selector:
            "ytd-browse[page-subtype='subscriptions'] ytd-shelf-renderer #toggle",
        },
      ],
    },
    {
      group: "Watch page - left/info",
      items: [
        {
          id: "watch-flexy",
          name: "Entire watch container",
          selector: "ytd-watch-flexy",
        },
        {
          id: "watch-title",
          name: "Video title",
          selector:
            "ytd-watch-metadata h1, #title h1, ytd-watch-metadata yt-formatted-string.ytd-watch-metadata",
        },
        {
          id: "watch-views",
          name: "View count",
          selector: "ytd-watch-info-text #info span:first-child, .view-count",
        },
        {
          id: "watch-date",
          name: "Publish date",
          selector: "ytd-watch-info-text #info span:last-child",
        },
        {
          id: "watch-info-strings",
          name: "View+date string",
          selector: "ytd-watch-info-text, #info-strings, #info-container",
        },
        {
          id: "watch-hashtags",
          name: "Hashtags above title",
          selector:
            "ytd-watch-metadata .super-title, yt-formatted-string.super-title",
        },
        {
          id: "watch-channel-row",
          name: "Channel row",
          selector: "ytd-watch-metadata #owner, ytd-video-owner-renderer",
        },
        {
          id: "watch-channel-avatar",
          name: "Channel avatar",
          selector:
            "ytd-video-owner-renderer #avatar, ytd-video-owner-renderer yt-img-shadow",
        },
        {
          id: "watch-channel-name",
          name: "Channel name link",
          selector:
            "ytd-video-owner-renderer ytd-channel-name, #channel-name a",
        },
        {
          id: "watch-channel-verified",
          name: "Verified checkmark",
          selector: "ytd-video-owner-renderer ytd-badge-supported-renderer",
        },
        {
          id: "watch-channel-subs",
          name: "Subscriber count",
          selector:
            "ytd-video-owner-renderer #owner-sub-count, #owner-sub-count",
        },
        {
          id: "watch-subscribe",
          name: "Subscribe button",
          selector:
            "ytd-watch-metadata ytd-subscribe-button-renderer, #subscribe-button",
        },
        {
          id: "watch-bell",
          name: "Notification bell",
          selector:
            "ytd-watch-metadata ytd-notification-preference-button-renderer",
        },
        {
          id: "watch-join",
          name: "Join (membership) button",
          selector:
            "#sponsor-button, ytd-button-renderer.ytd-sponsor-button-renderer",
        },
        {
          id: "watch-actions-row",
          name: "Like/share/save row container",
          selector: "ytd-watch-metadata #top-row, #actions",
        },
        {
          id: "watch-like",
          name: "Like button",
          selector:
            "ytd-watch-metadata like-button-view-model, segmented-like-dislike-button-view-model like-button-view-model",
        },
        {
          id: "watch-like-count",
          name: "Like count number",
          selector:
            "like-button-view-model .yt-spec-button-shape-next__button-text-content",
        },
        {
          id: "watch-dislike",
          name: "Dislike button",
          selector:
            "ytd-watch-metadata dislike-button-view-model, segmented-like-dislike-button-view-model dislike-button-view-model",
        },
        {
          id: "watch-share",
          name: "Share button",
          selector:
            "ytd-watch-metadata yt-button-view-model:has(button[aria-label*='hare']), #top-level-buttons-computed ytd-button-renderer:nth-child(1)",
        },
        {
          id: "watch-download",
          name: "Download button",
          selector:
            "ytd-watch-metadata ytd-download-button-renderer, ytd-download-button-renderer",
        },
        {
          id: "watch-clip",
          name: "Clip button",
          selector:
            "ytd-watch-metadata yt-button-view-model:has(button[aria-label*='lip'])",
        },
        {
          id: "watch-save",
          name: "Save to playlist button",
          selector:
            "ytd-watch-metadata yt-button-view-model:has(button[aria-label*='ave'])",
        },
        {
          id: "watch-thanks",
          name: "Thanks (Super Thanks) button",
          selector:
            "ytd-watch-metadata yt-button-view-model:has(button[aria-label*='hanks'])",
        },
        {
          id: "watch-remix",
          name: "Remix button",
          selector:
            "ytd-watch-metadata yt-button-view-model:has(button[aria-label*='emix'])",
        },
        {
          id: "watch-more-actions",
          name: "More actions (...) menu",
          selector:
            "ytd-watch-metadata ytd-menu-renderer, ytd-menu-renderer.ytd-watch-metadata",
        },
        {
          id: "watch-description",
          name: "Description box",
          selector:
            "ytd-watch-metadata #description, #description-inner, ytd-text-inline-expander",
        },
        {
          id: "watch-description-text",
          name: "Description text only",
          selector: "ytd-watch-metadata #description yt-attributed-string",
        },
        {
          id: "watch-show-more",
          name: "...more / Show less link",
          selector: "ytd-text-inline-expander tp-yt-paper-button",
        },
        {
          id: "watch-engagement-panels",
          name: "Engagement panel container",
          selector: "ytd-engagement-panel-section-list-renderer",
        },
        {
          id: "watch-info-cards",
          name: "Info panels (donations etc)",
          selector: "ytd-info-panel-content-renderer, #donation-shelf",
        },
        {
          id: "watch-chapters-list",
          name: "Chapters list",
          selector:
            "ytd-macro-markers-list-renderer, ytd-horizontal-card-list-renderer",
        },
        {
          id: "watch-transcript",
          name: "Transcript panel",
          selector:
            "ytd-engagement-panel-section-list-renderer[target-id*='transcript']",
        },
        {
          id: "watch-comments-panel",
          name: "Comments engagement panel",
          selector:
            "ytd-engagement-panel-section-list-renderer[target-id*='comments']",
        },
        {
          id: "watch-related-panel",
          name: "Related (mobile-style) panel",
          selector:
            "ytd-engagement-panel-section-list-renderer[target-id*='related']",
        },
        {
          id: "watch-product-shelf",
          name: "Products / shopping shelf",
          selector:
            "ytd-engagement-panel-section-list-renderer[target-id*='product']",
        },
        {
          id: "watch-clarification",
          name: "Clarification / context panel",
          selector: "ytd-info-panel-content-renderer, #clarify-box",
        },
      ],
    },
    {
      group: "Watch page - right column",
      items: [
        {
          id: "secondary",
          name: "Entire right column",
          selector: "#secondary, ytd-watch-next-secondary-results-renderer",
        },
        {
          id: "secondary-inner",
          name: "Right column inner",
          selector: "#secondary-inner",
        },
        {
          id: "secondary-chips",
          name: "Right column filter chips",
          selector:
            "#related ytd-feed-filter-chip-bar-renderer, ytd-watch-next-secondary-results-renderer ytd-feed-filter-chip-bar-renderer",
        },
        {
          id: "secondary-autoplay",
          name: "Autoplay toggle row",
          selector: "ytd-compact-autoplay-renderer",
        },
        {
          id: "secondary-autoplay-toggle",
          name: "Autoplay switch only",
          selector: "ytd-compact-autoplay-renderer ytd-toggle-button-renderer",
        },
        {
          id: "secondary-related",
          name: "Related video cards",
          selector: "ytd-compact-video-renderer",
        },
        {
          id: "secondary-related-thumb",
          name: "Related thumbnails",
          selector: "ytd-compact-video-renderer ytd-thumbnail",
        },
        {
          id: "secondary-related-title",
          name: "Related titles",
          selector: "ytd-compact-video-renderer #video-title",
        },
        {
          id: "secondary-related-channel",
          name: "Related channel names",
          selector:
            "ytd-compact-video-renderer #channel-name, ytd-compact-video-renderer ytd-channel-name",
        },
        {
          id: "secondary-related-meta",
          name: "Related metadata",
          selector: "ytd-compact-video-renderer #metadata-line",
        },
        {
          id: "secondary-related-menu",
          name: "Related 3-dot menus",
          selector: "ytd-compact-video-renderer ytd-menu-renderer",
        },
        {
          id: "secondary-playlist-card",
          name: "Playlist cards",
          selector: "ytd-compact-playlist-renderer",
        },
        {
          id: "secondary-playlist-panel",
          name: "Active playlist panel",
          selector: "ytd-playlist-panel-renderer",
        },
        {
          id: "secondary-radio-card",
          name: "Mix / radio cards",
          selector: "ytd-compact-radio-renderer",
        },
        {
          id: "secondary-movie-card",
          name: "Movie cards",
          selector: "ytd-compact-movie-renderer",
        },
        {
          id: "secondary-merch",
          name: "Merch shelf",
          selector: "ytd-merch-shelf-renderer",
        },
        {
          id: "secondary-ads",
          name: "Right column ads",
          selector:
            "ytd-watch-next-secondary-results-renderer ytd-ad-slot-renderer, #player-ads",
        },
        {
          id: "secondary-promoted",
          name: "Promoted cards",
          selector: "ytd-promoted-sparkles-web-renderer",
        },
        {
          id: "secondary-chat",
          name: "Live chat frame",
          selector: "ytd-live-chat-frame, #chat",
        },
      ],
    },
    {
      group: "Player chrome",
      items: [
        {
          id: "player",
          name: "Entire player",
          selector: "#movie_player, ytd-player, .html5-video-player",
        },
        {
          id: "player-video",
          name: "Video element only",
          selector: "video.html5-main-video",
        },
        {
          id: "player-chrome-top",
          name: "Top overlay bar",
          selector: ".ytp-chrome-top",
        },
        {
          id: "player-title-overlay",
          name: "Title overlay (top)",
          selector: ".ytp-chrome-top .ytp-title",
        },
        {
          id: "player-channel-link",
          name: "Channel link overlay",
          selector: ".ytp-title-channel",
        },
        {
          id: "player-share-button",
          name: "Share button overlay",
          selector: ".ytp-share-button",
        },
        {
          id: "player-more-options",
          name: "More options menu (top)",
          selector: ".ytp-overflow-button",
        },
        {
          id: "player-endscreen",
          name: "End-screen suggestions",
          selector: ".ytp-ce-element, .ytp-endscreen-content",
        },
        {
          id: "player-endscreen-pause",
          name: "Pause-screen suggestions",
          selector: ".ytp-pause-overlay",
        },
        {
          id: "player-cards",
          name: "Info cards (i) teaser",
          selector: ".ytb-cards-button, .ytb-cards-teaser-text",
        },
        {
          id: "player-cards-icon",
          name: "Info card icon only",
          selector: ".ytb-cards-button-icon",
        },
        {
          id: "player-watermark",
          name: "Channel watermark",
          selector: ".ytp-watermark, .annotation",
        },
        {
          id: "player-prevbtn",
          name: "Previous video button",
          selector: ".ytp-prev-button",
        },
        {
          id: "player-playbtn",
          name: "Play/Pause button",
          selector: ".ytp-play-button",
        },
        {
          id: "player-nextbtn",
          name: "Next video button",
          selector: ".ytp-next-button",
        },
        {
          id: "player-autoplay",
          name: "Autoplay toggle button",
          selector: ".ytp-autonav-toggle-button-container",
        },
        {
          id: "player-miniplayer",
          name: "Miniplayer button",
          selector: ".ytp-miniplayer-button",
        },
        {
          id: "player-size",
          name: "Theater/default size button",
          selector: ".ytp-size-button",
        },
        {
          id: "player-fullscreen",
          name: "Fullscreen button",
          selector: ".ytp-fullscreen-button",
        },
        {
          id: "player-remote",
          name: "Cast / remote button",
          selector: ".ytp-remote-button",
        },
        {
          id: "player-subtitles",
          name: "Subtitles / CC button",
          selector: ".ytb-subtitles-button",
        },
        {
          id: "player-settings",
          name: "Settings cog button",
          selector: ".ytp-settings-button",
        },
        {
          id: "player-pip-native",
          name: "Picture-in-picture button",
          selector: ".ytp-pip-button",
        },
        {
          id: "player-volume-area",
          name: "Volume slider area",
          selector: ".ytp-volume-area",
        },
        {
          id: "player-mute-button",
          name: "Mute button only",
          selector: ".ytp-mute-button",
        },
        {
          id: "player-volume-slider",
          name: "Volume slider only",
          selector: ".ytp-volume-slider, .ytp-volume-panel",
        },
        {
          id: "player-time",
          name: "Time display",
          selector: ".ytp-time-display",
        },
        {
          id: "player-time-current",
          name: "Current time only",
          selector: ".ytp-time-current",
        },
        {
          id: "player-time-duration",
          name: "Duration only",
          selector: ".ytp-time-duration",
        },
        {
          id: "player-time-separator",
          name: "Time separator (/)",
          selector: ".ytp-time-separator",
        },
        {
          id: "player-live-badge",
          name: "Live badge",
          selector: ".ytp-live, .ytp-live-badge",
        },
        {
          id: "player-progress",
          name: "Progress / seek bar",
          selector: ".ytp-progress-bar-container",
        },
        {
          id: "player-progress-list",
          name: "Progress list area",
          selector: ".ytp-progress-list",
        },
        {
          id: "player-chapter-ticks",
          name: "Chapter ticks on bar",
          selector: ".ytp-chapter-hover-container",
        },
        {
          id: "player-chapter-title",
          name: "Chapter title on bar",
          selector: ".ytp-chapter-title",
        },
        {
          id: "player-tooltip",
          name: "Seek bar preview tooltip",
          selector: ".ytb-tooltip",
        },
        {
          id: "player-preview-image",
          name: "Seek bar preview thumbnail",
          selector: ".ytp-preview, .ytb-tooltip-image",
        },
        {
          id: "player-bezel",
          name: "Bezel feedback (10s skip etc)",
          selector: ".ytp-bezel",
        },
        {
          id: "player-gradient-bottom",
          name: "Bottom gradient overlay",
          selector: ".ytp-gradient-bottom",
        },
        {
          id: "player-gradient-top",
          name: "Top gradient overlay",
          selector: ".ytp-gradient-top",
        },
        {
          id: "player-spinner",
          name: "Loading spinner",
          selector: ".ytp-spinner",
        },
        {
          id: "player-error",
          name: "Player error message",
          selector: ".ytp-error",
        },
        {
          id: "player-context-menu",
          name: "Right-click menu",
          selector: ".ytp-popup.ytp-contextmenu",
        },
        {
          id: "player-settings-menu",
          name: "Settings panel popup",
          selector: ".ytp-settings-menu, .ytp-popup.ytp-settings-menu",
        },
        {
          id: "player-quality-menu",
          name: "Quality submenu",
          selector: ".ytp-quality-menu",
        },
        {
          id: "player-ad-overlay",
          name: "Overlay ads on video",
          selector: ".ytp-ad-overlay-container, .ytp-ad-text-overlay",
        },
        {
          id: "player-ad-image",
          name: "Image ad overlay",
          selector: ".ytp-ad-image-overlay",
        },
        {
          id: "player-ad-skip",
          name: "Skip ad button",
          selector:
            ".ytp-ad-skip-button-modern, .ytp-ad-skip-button, .ytp-skip-ad-button",
        },
        {
          id: "player-ad-skip-container",
          name: "Skip ad container",
          selector: ".ytp-ad-skip-button-container, .ytp-ad-skip-button-slot",
        },
        {
          id: "player-ad-preview",
          name: "Ad preview countdown",
          selector: ".ytp-ad-preview-container, .ytp-ad-preview-text",
        },
        {
          id: "player-ad-duration",
          name: "Ad duration remaining",
          selector: ".ytp-ad-duration-remaining",
        },
        {
          id: "player-ad-info",
          name: "Ad info / Why this ad",
          selector: ".ytp-ad-info-dialog-container, .ytp-ad-button",
        },
        {
          id: "player-ad-visit-advertiser",
          name: "Visit advertiser button",
          selector: ".ytp-ad-visit-advertiser-button",
        },
        {
          id: "player-ad-channel-card",
          name: "Ad channel card",
          selector:
            ".ytp-ad-player-overlay-instream-info, .ytp-ad-player-overlay-flyout-cta",
        },
        {
          id: "player-ad-survey",
          name: "Ad survey question",
          selector: ".ytp-ad-survey",
        },
        {
          id: "player-ambient-yt",
          name: "Native ambient mode glow",
          selector: "#cinematics, #cinematics-container, .ytb-cinematic-effect",
        },
        {
          id: "player-stats-debug",
          name: "Stats for nerds overlay",
          selector: ".html5-video-info-panel",
        },
      ],
    },
    {
      group: "Comments",
      items: [
        {
          id: "comments",
          name: "Entire comments section",
          selector: "#comments, ytd-comments",
        },
        {
          id: "comments-header",
          name: "Header (count + sort)",
          selector: "ytd-comments-header-renderer",
        },
        {
          id: "comments-count",
          name: "Comment count only",
          selector: "ytd-comments-header-renderer #count",
        },
        {
          id: "comments-sort",
          name: "Sort menu",
          selector:
            "ytd-comments-header-renderer #sort-menu, ytd-sort-filter-sub-menu-renderer",
        },
        {
          id: "comments-input",
          name: "Add a comment box",
          selector: "ytd-comments #simple-box, ytd-comment-simplebox-renderer",
        },
        {
          id: "comments-input-avatar",
          name: "Your avatar in input",
          selector: "ytd-comment-simplebox-renderer #author-thumbnail",
        },
        {
          id: "comments-input-placeholder",
          name: "'Add a comment' placeholder",
          selector: "ytd-comment-simplebox-renderer #placeholder-area",
        },
        {
          id: "comments-thread",
          name: "All comment threads",
          selector: "ytd-comment-thread-renderer",
        },
        {
          id: "comments-pinned",
          name: "Pinned comment",
          selector: "ytd-comment-thread-renderer:has(#pinned-comment-badge)",
        },
        {
          id: "comments-author",
          name: "Comment author names",
          selector: "ytd-comment-view-model #author-text, ytd-comment-renderer #author-text",
        },
        {
          id: "comments-author-avatar",
          name: "Comment avatars",
          selector: "ytd-comment-view-model #author-thumbnail, ytd-comment-renderer #author-thumbnail",
        },
        {
          id: "comments-text",
          name: "Comment text body",
          selector: "ytd-comment-view-model #content-text, ytd-comment-renderer #content-text",
        },
        {
          id: "comments-timestamp",
          name: "Comment timestamps",
          selector: "ytd-comment-view-model #published-time-text, ytd-comment-renderer #published-time-text",
        },
        {
          id: "comments-action-buttons",
          name: "Comment action row",
          selector: "ytd-comment-action-buttons-renderer",
        },
        {
          id: "comments-like",
          name: "Comment like button",
          selector: "ytd-comment-action-buttons-renderer #like-button",
        },
        {
          id: "comments-dislike",
          name: "Comment dislike button",
          selector: "ytd-comment-action-buttons-renderer #dislike-button",
        },
        {
          id: "comments-reply-btn",
          name: "Reply button",
          selector: "ytd-comment-action-buttons-renderer #reply-button",
        },
        {
          id: "comments-replies-section",
          name: "Replies sub-thread",
          selector: "ytd-comment-replies-renderer",
        },
        {
          id: "comments-show-replies",
          name: "Show/hide replies link",
          selector:
            "ytd-comment-replies-renderer #more-replies, ytd-comment-replies-renderer #less-replies",
        },
        {
          id: "comments-creator-heart",
          name: "Creator heart badge",
          selector: "ytd-creator-heart-renderer",
        },
        {
          id: "comments-creator-reply-badge",
          name: "Creator badge on replies",
          selector: "ytd-author-comment-badge-renderer",
        },
        {
          id: "comments-pinned-badge",
          name: "Pinned badge",
          selector: "#pinned-comment-badge",
        },
        {
          id: "comments-emoji-picker",
          name: "Emoji picker button",
          selector: "ytd-comment-simplebox-renderer #emoji-button",
        },
      ],
    },
    {
      group: "Live chat",
      items: [
        {
          id: "livechat",
          name: "Entire live chat panel",
          selector: "ytd-live-chat-frame, yt-live-chat-app",
        },
        {
          id: "livechat-header",
          name: "Chat header bar",
          selector: "yt-live-chat-header-renderer",
        },
        {
          id: "livechat-collapse-btn",
          name: "Collapse / popout button",
          selector: "ytd-live-chat-frame #show-hide-button",
        },
        {
          id: "livechat-mode-switch",
          name: "Top chat / Live chat switch",
          selector:
            "yt-live-chat-header-renderer yt-sort-filter-sub-menu-renderer",
        },
        {
          id: "livechat-input",
          name: "Chat input box",
          selector: "yt-live-chat-message-input-renderer, #input-panel",
        },
        {
          id: "livechat-input-avatar",
          name: "Your avatar in chat input",
          selector: "yt-live-chat-message-input-renderer #author-photo",
        },
        {
          id: "livechat-send-btn",
          name: "Send button",
          selector: "yt-live-chat-message-input-renderer #send-button",
        },
        {
          id: "livechat-emoji-btn",
          name: "Emoji picker button",
          selector: "yt-live-chat-message-input-renderer #emoji-button",
        },
        {
          id: "livechat-superchat-btn",
          name: "Super Chat button",
          selector: "yt-live-chat-message-input-renderer #product-picker",
        },
        {
          id: "livechat-messages",
          name: "Chat message list",
          selector: "yt-live-chat-item-list-renderer",
        },
        {
          id: "livechat-text-msg",
          name: "Individual text messages",
          selector: "yt-live-chat-text-message-renderer",
        },
        {
          id: "livechat-membership",
          name: "Membership join messages",
          selector: "yt-live-chat-membership-item-renderer",
        },
        {
          id: "livechat-superchat-msg",
          name: "Super Chat messages",
          selector: "yt-live-chat-paid-message-renderer",
        },
        {
          id: "livechat-sticker",
          name: "Super Stickers",
          selector: "yt-live-chat-paid-sticker-renderer",
        },
        {
          id: "livechat-ticker",
          name: "Super Chat ticker (top)",
          selector: "yt-live-chat-ticker-renderer",
        },
        {
          id: "livechat-engagement",
          name: "Engagement message (welcome etc)",
          selector: "yt-live-chat-viewer-engagement-message-renderer",
        },
        {
          id: "livechat-system-msg",
          name: "System messages",
          selector: "yt-live-chat-banner-manager",
        },
        {
          id: "livechat-popout-btn",
          name: "Popout button",
          selector: "yt-live-chat-header-renderer yt-icon-button",
        },
        {
          id: "livechat-policy",
          name: "Chat policy notice",
          selector: "yt-live-chat-policy-link",
        },
      ],
    },
    {
      group: "Channel page",
      items: [
        {
          id: "channel-page",
          name: "Entire channel page",
          selector: "ytd-browse[page-subtype='channels']",
        },
        {
          id: "channel-banner",
          name: "Banner image",
          selector:
            "ytd-c4-tabbed-header-renderer #banner, yt-page-header-renderer #page-header-banner, yt-image-banner-view-model",
        },
        {
          id: "channel-header",
          name: "Header section",
          selector: "ytd-c4-tabbed-header-renderer, yt-page-header-renderer",
        },
        {
          id: "channel-avatar",
          name: "Channel avatar",
          selector:
            "ytd-c4-tabbed-header-renderer #avatar, yt-page-header-renderer yt-avatar-shape",
        },
        {
          id: "channel-name",
          name: "Channel name + handle",
          selector:
            "ytd-c4-tabbed-header-renderer #channel-name, yt-page-header-renderer yt-dynamic-text-view-model",
        },
        {
          id: "channel-handle",
          name: "@handle only",
          selector:
            "yt-page-header-renderer yt-content-metadata-view-model span:first-child",
        },
        {
          id: "channel-subs-count",
          name: "Subscriber count",
          selector:
            "ytd-c4-tabbed-header-renderer #subscriber-count, yt-page-header-renderer yt-content-metadata-view-model",
        },
        {
          id: "channel-description-short",
          name: "Short description below name",
          selector: "yt-page-header-renderer yt-description-preview-view-model",
        },
        {
          id: "channel-subscribe",
          name: "Subscribe button",
          selector:
            "ytd-c4-tabbed-header-renderer ytd-subscribe-button-renderer, yt-page-header-renderer yt-subscribe-button-view-model",
        },
        {
          id: "channel-join",
          name: "Join button",
          selector: "ytd-c4-tabbed-header-renderer #sponsor-button",
        },
        {
          id: "channel-share-btn",
          name: "Share button",
          selector:
            "ytd-c4-tabbed-header-renderer yt-button-view-model:has(button[aria-label*='hare'])",
        },
        {
          id: "channel-tabs",
          name: "Tab bar (Home/Videos/Shorts/...)",
          selector:
            "ytd-c4-tabbed-header-renderer #tabs-container, yt-tab-group-shape, tp-yt-paper-tabs",
        },
        {
          id: "channel-tab-home",
          name: "Home tab",
          selector: "tp-yt-paper-tab:nth-of-type(1)",
        },
        {
          id: "channel-tab-videos",
          name: "Videos tab",
          selector:
            "tp-yt-paper-tab[tab-title='Videos'], yt-tab-shape[tab-title='Videos']",
        },
        {
          id: "channel-tab-shorts",
          name: "Shorts tab",
          selector:
            "tp-yt-paper-tab[tab-title='Shorts'], yt-tab-shape[tab-title='Shorts']",
        },
        {
          id: "channel-tab-live",
          name: "Live tab",
          selector:
            "tp-yt-paper-tab[tab-title='Live'], yt-tab-shape[tab-title='Live']",
        },
        {
          id: "channel-tab-playlists",
          name: "Playlists tab",
          selector:
            "tp-yt-paper-tab[tab-title='Playlists'], yt-tab-shape[tab-title='Playlists']",
        },
        {
          id: "channel-tab-community",
          name: "Community tab",
          selector:
            "tp-yt-paper-tab[tab-title='Community'], yt-tab-shape[tab-title='Community']",
        },
        {
          id: "channel-tab-about",
          name: "About tab",
          selector:
            "tp-yt-paper-tab[tab-title='About'], yt-tab-shape[tab-title='About']",
        },
        {
          id: "channel-tab-store",
          name: "Store tab",
          selector:
            "tp-yt-paper-tab[tab-title='Store'], yt-tab-shape[tab-title='Store']",
        },
        {
          id: "channel-description-full",
          name: "About / description section",
          selector: "ytd-channel-about-metadata-renderer",
        },
        {
          id: "channel-links",
          name: "Channel links (social/website)",
          selector:
            "ytd-channel-external-link-view-model, ytd-channel-external-link-renderer",
        },
        {
          id: "channel-stats",
          name: "Channel stats (joined, views)",
          selector: "ytd-channel-about-metadata-renderer yt-formatted-string",
        },
        {
          id: "channel-trailer",
          name: "Featured video / trailer",
          selector: "ytd-channel-video-player-renderer",
        },
        {
          id: "channel-featured-channels",
          name: "Featured channels shelf",
          selector:
            "ytd-channel-featured-content-renderer ytd-channel-renderer",
        },
        {
          id: "channel-shelves",
          name: "Video section shelves",
          selector:
            "ytd-channel-featured-content-renderer, ytd-item-section-renderer",
        },
        {
          id: "channel-shelf-titles",
          name: "Shelf titles",
          selector: "ytd-shelf-renderer #title-container",
        },
        {
          id: "channel-community-post",
          name: "Community posts",
          selector: "ytd-backstage-post-thread-renderer, ytd-post-renderer",
        },
      ],
    },
    {
      group: "Search results",
      items: [
        {
          id: "search-page",
          name: "Entire search results page",
          selector: "ytd-search",
        },
        {
          id: "search-chips",
          name: "Filter chips bar",
          selector: "ytd-search ytd-feed-filter-chip-bar-renderer",
        },
        {
          id: "search-filter-btn",
          name: "Filters button",
          selector:
            "ytd-search-header-renderer button, ytd-search-filter-renderer",
        },
        {
          id: "search-sub-menu",
          name: "Filter sub-menus",
          selector: "ytd-search-sub-menu-renderer",
        },
        {
          id: "search-result-count",
          name: "Result count",
          selector: "ytd-search ytd-results-count-renderer",
        },
        {
          id: "search-video-card",
          name: "Video result cards",
          selector: "ytd-search ytd-video-renderer",
        },
        {
          id: "search-video-thumb",
          name: "Video result thumbnails",
          selector: "ytd-search ytd-video-renderer ytd-thumbnail",
        },
        {
          id: "search-video-title",
          name: "Video result titles",
          selector: "ytd-search ytd-video-renderer #video-title",
        },
        {
          id: "search-video-desc",
          name: "Video result descriptions",
          selector: "ytd-search ytd-video-renderer #description-text",
        },
        {
          id: "search-channel-card",
          name: "Channel result cards",
          selector: "ytd-search ytd-channel-renderer",
        },
        {
          id: "search-channel-subscribe",
          name: "Channel result subscribe btn",
          selector:
            "ytd-search ytd-channel-renderer ytd-subscribe-button-renderer",
        },
        {
          id: "search-playlist-card",
          name: "Playlist result cards",
          selector: "ytd-search ytd-playlist-renderer",
        },
        {
          id: "search-radio-card",
          name: "Radio / mix result cards",
          selector: "ytd-search ytd-radio-renderer",
        },
        {
          id: "search-shorts-shelf",
          name: "Shorts shelf",
          selector: "ytd-search ytd-reel-shelf-renderer",
        },
        {
          id: "search-people-also",
          name: "'People also watched' shelf",
          selector: "ytd-search ytd-shelf-renderer",
        },
        {
          id: "search-ads",
          name: "Ads in search results",
          selector:
            "ytd-search ytd-ad-slot-renderer, ytd-search ytd-promoted-sparkles-web-renderer",
        },
        {
          id: "search-pyv",
          name: "Promoted Yahoo / Google ad cards",
          selector: "ytd-search ytd-promoted-video-renderer",
        },
        {
          id: "search-show-more",
          name: "Show more results button",
          selector: "ytd-search ytd-continuation-item-renderer",
        },
      ],
    },
    {
      group: "Shorts page",
      items: [
        {
          id: "shorts-page",
          name: "Entire Shorts player",
          selector: "ytd-shorts",
        },
        {
          id: "shorts-player",
          name: "Active Shorts video element",
          selector: "ytd-reel-video-renderer[is-active] video",
        },
        {
          id: "shorts-overlay-container",
          name: "Right action column",
          selector: "ytd-reel-player-overlay-renderer #actions",
        },
        {
          id: "shorts-like-btn",
          name: "Like button",
          selector: "ytd-reel-player-overlay-renderer #like-button",
        },
        {
          id: "shorts-dislike-btn",
          name: "Dislike button",
          selector: "ytd-reel-player-overlay-renderer #dislike-button",
        },
        {
          id: "shorts-comment-btn",
          name: "Comment button",
          selector: "ytd-reel-player-overlay-renderer #comments-button",
        },
        {
          id: "shorts-share-btn",
          name: "Share button",
          selector: "ytd-reel-player-overlay-renderer #share-button",
        },
        {
          id: "shorts-remix-btn",
          name: "Remix button",
          selector: "ytd-reel-player-overlay-renderer #remix-button",
        },
        {
          id: "shorts-more-btn",
          name: "More options button",
          selector: "ytd-reel-player-overlay-renderer #menu-button",
        },
        {
          id: "shorts-channel-bar",
          name: "Channel + subscribe bar",
          selector:
            "ytd-reel-player-overlay-renderer .reel-player-header-renderer",
        },
        {
          id: "shorts-channel-avatar",
          name: "Channel avatar (Shorts)",
          selector: "ytd-reel-player-overlay-renderer #channel-avatar",
        },
        {
          id: "shorts-channel-name",
          name: "Channel name (Shorts)",
          selector: "ytd-reel-player-overlay-renderer #channel-name",
        },
        {
          id: "shorts-subscribe-btn",
          name: "Subscribe button (Shorts)",
          selector:
            "ytd-reel-player-overlay-renderer ytd-subscribe-button-renderer",
        },
        {
          id: "shorts-title",
          name: "Title / caption overlay",
          selector: "ytd-reel-player-overlay-renderer #overlay #title",
        },
        {
          id: "shorts-description",
          name: "Description overlay",
          selector: "ytd-reel-player-overlay-renderer #overlay",
        },
        {
          id: "shorts-comments-panel",
          name: "Comments side panel",
          selector:
            "ytd-engagement-panel-section-list-renderer[target-id='shorts-engagement-panel-comments-section']",
        },
        {
          id: "shorts-audio-pivot",
          name: "Sound / music pivot button",
          selector: "ytd-reel-audio-pivot-button-renderer",
        },
        {
          id: "shorts-nav-prev",
          name: "Previous Short button",
          selector: "ytd-shorts #navigation-button-up",
        },
        {
          id: "shorts-nav-next",
          name: "Next Short button",
          selector: "ytd-shorts #navigation-button-down",
        },
        {
          id: "shorts-progress-bar",
          name: "Mini progress bar",
          selector: "ytd-shorts .reel-progress-bar",
        },
      ],
    },
    {
      group: "Playlist page",
      items: [
        {
          id: "playlist-header",
          name: "Playlist header (title/desc/buttons)",
          selector: "ytd-playlist-header-renderer",
        },
        {
          id: "playlist-title",
          name: "Playlist title",
          selector: "ytd-playlist-header-renderer #title",
        },
        {
          id: "playlist-meta",
          name: "Playlist metadata (views, date)",
          selector: "ytd-playlist-header-renderer #stats",
        },
        {
          id: "playlist-description",
          name: "Playlist description",
          selector: "ytd-playlist-header-renderer #description",
        },
        {
          id: "playlist-creator",
          name: "Playlist creator info",
          selector: "ytd-playlist-header-renderer #owner-text",
        },
        {
          id: "playlist-sidebar",
          name: "Playlist panel sidebar",
          selector: "ytd-playlist-sidebar-renderer",
        },
        {
          id: "playlist-thumb",
          name: "Playlist big thumbnail",
          selector: "ytd-playlist-sidebar-primary-info-renderer #thumbnail",
        },
        {
          id: "playlist-save-btn",
          name: "Save playlist button",
          selector:
            "ytd-playlist-header-renderer ytd-button-renderer:has(yt-icon-shape)",
        },
        {
          id: "playlist-share-btn",
          name: "Share playlist button",
          selector:
            "ytd-playlist-header-renderer yt-button-view-model:has(button[aria-label*='hare'])",
        },
        {
          id: "playlist-play-all",
          name: "Play all button",
          selector: "ytd-playlist-header-renderer .play-all-button",
        },
        {
          id: "playlist-shuffle",
          name: "Shuffle button",
          selector: "ytd-playlist-header-renderer .shuffle-button",
        },
        {
          id: "playlist-videos-list",
          name: "Video entries list",
          selector: "ytd-playlist-video-list-renderer",
        },
        {
          id: "playlist-video-row",
          name: "Individual video rows",
          selector: "ytd-playlist-video-renderer",
        },
        {
          id: "playlist-video-index",
          name: "Row index numbers",
          selector: "ytd-playlist-video-renderer #index",
        },
        {
          id: "playlist-video-thumb",
          name: "Row thumbnails",
          selector: "ytd-playlist-video-renderer ytd-thumbnail",
        },
        {
          id: "playlist-video-title",
          name: "Row titles",
          selector: "ytd-playlist-video-renderer #video-title",
        },
        {
          id: "playlist-video-channel",
          name: "Row channel names",
          selector: "ytd-playlist-video-renderer ytd-channel-name",
        },
        {
          id: "playlist-video-menu",
          name: "Row 3-dot menus",
          selector: "ytd-playlist-video-renderer ytd-menu-renderer",
        },
        {
          id: "playlist-currently-playing",
          name: "Currently playing marker",
          selector: "ytd-playlist-panel-video-renderer[selected]",
        },
      ],
    },
    {
      group: "Popups & modals",
      items: [
        {
          id: "popup-container",
          name: "All popup containers",
          selector: "ytd-popup-container",
        },
        {
          id: "popup-menu",
          name: "Context menus (right-click)",
          selector: "tp-yt-iron-dropdown, ytd-menu-popup-renderer",
        },
        {
          id: "popup-share",
          name: "Share dialog",
          selector: "ytd-unified-share-panel-renderer",
        },
        {
          id: "popup-share-targets",
          name: "Share targets grid",
          selector: "ytd-unified-share-panel-renderer #social-actions",
        },
        {
          id: "popup-share-url",
          name: "Share copy-URL field",
          selector: "ytd-unified-share-panel-renderer #share-url",
        },
        {
          id: "popup-notify",
          name: "Notification popup panel",
          selector:
            "ytd-multi-page-menu-renderer:has(ytd-notification-renderer)",
        },
        {
          id: "popup-notify-item",
          name: "Individual notifications",
          selector: "ytd-notification-renderer",
        },
        {
          id: "popup-account-menu",
          name: "Account dropdown menu",
          selector:
            "ytd-multi-page-menu-renderer:not(:has(ytd-notification-renderer))",
        },
        {
          id: "popup-miniplayer",
          name: "Miniplayer bar (bottom)",
          selector: "ytd-miniplayer",
        },
        {
          id: "popup-miniplayer-close",
          name: "Miniplayer close button",
          selector: "ytd-miniplayer .ytp-miniplayer-close-button",
        },
        {
          id: "popup-toast",
          name: "YouTube native toasts",
          selector: "yt-notification-action-renderer, tp-yt-paper-toast",
        },
        {
          id: "popup-confirm-dialog",
          name: "Confirm dialogs",
          selector:
            "tp-yt-paper-dialog.yt-confirm-dialog-renderer, yt-confirm-dialog-renderer",
        },
        {
          id: "popup-save-to-playlist",
          name: "Save-to-playlist popup",
          selector: "ytd-add-to-playlist-renderer",
        },
        {
          id: "popup-report-form",
          name: "Report video form",
          selector: "ytd-report-form-renderer",
        },
        {
          id: "popup-clip-creation",
          name: "Clip creation panel",
          selector: "ytd-engagement-panel-clip-create-renderer",
        },
        {
          id: "popup-download-quality",
          name: "Download quality selector",
          selector: "ytd-download-quality-selector-renderer",
        },
      ],
    },
    {
      group: "Global / sitewide",
      items: [
        {
          id: "global-consent-banner",
          name: "Cookie consent banner",
          selector:
            "ytd-consent-bump-v2-lightbox, tp-yt-paper-dialog.ytd-consent-bump-v2-lightbox",
        },
        {
          id: "global-consent-bump",
          name: "Privacy reminder bump",
          selector: "ytd-privacy-message-renderer",
        },
        {
          id: "global-survey",
          name: "Survey / feedback prompts",
          selector:
            "ytd-popup-container ytd-single-option-survey-renderer, ytd-enforcement-message-view-model",
        },
        {
          id: "global-promo-banner",
          name: "Premium / promo banners",
          selector:
            "ytd-banner-promo-renderer, ytd-background-promo-renderer, ytd-mealbar-promo-renderer",
        },
        {
          id: "global-premium-prompt",
          name: "Premium upgrade prompt",
          selector:
            "ytd-popup-container ytd-popup-renderer[id='subscribe-button']",
        },
        {
          id: "global-guide-signin",
          name: "Sign-in prompts in sidebar",
          selector: "ytd-guide-signin-promo-renderer",
        },
        {
          id: "global-ticker",
          name: "Ticker / shelf above feed",
          selector: "ytd-rich-shelf-renderer:first-of-type",
        },
        {
          id: "global-adblock-msg",
          name: "Adblock detection message",
          selector: "ytd-enforcement-message-view-model",
        },
        {
          id: "global-age-restriction",
          name: "Age restriction overlay",
          selector: "ytd-age-restriction-bypass-renderer",
        },
        {
          id: "global-error-state",
          name: "Empty/error states",
          selector: "yt-page-error-view-model",
        },
        {
          id: "global-loading-spinner",
          name: "Page loading spinner",
          selector: "tp-yt-paper-spinner-lite",
        },
        {
          id: "global-progress-bar",
          name: "Top page progress bar",
          selector: "yt-page-navigation-progress",
        },
      ],
    },
    {
      group: "History / Library",
      items: [
        {
          id: "lib-page",
          name: "Library page",
          selector: "ytd-browse[page-subtype='library']",
        },
        {
          id: "lib-history-page",
          name: "History page",
          selector: "ytd-browse[page-subtype='history']",
        },
        {
          id: "lib-history-search",
          name: "History search box",
          selector: "ytd-search-header-renderer",
        },
        {
          id: "lib-history-pause",
          name: "Pause history toggle",
          selector: "ytd-toggle-button-renderer",
        },
        {
          id: "lib-history-controls",
          name: "History controls sidebar",
          selector: "ytd-browse[page-subtype='history'] #secondary",
        },
        {
          id: "lib-watch-later",
          name: "Watch later section",
          selector:
            "ytd-browse[page-subtype='playlist'] ytd-playlist-header-renderer",
        },
      ],
    },
    {
      group: "Trending / Explore",
      items: [
        {
          id: "trending-page",
          name: "Trending page",
          selector: "ytd-browse[page-subtype='trending']",
        },
        {
          id: "trending-tabs",
          name: "Trending tabs (Now/Music/Gaming...)",
          selector: "ytd-browse[page-subtype='trending'] tp-yt-paper-tabs",
        },
        {
          id: "trending-shelf-header",
          name: "Trending shelf headers",
          selector: "ytd-browse[page-subtype='trending'] ytd-shelf-renderer",
        },
      ],
    },
  ];
  (Object.freeze(fo),
    fo.forEach(function (e) {
      (Object.freeze(e),
        Object.freeze(e.items),
        e.items.forEach(Object.freeze));
    }));
  const bo = [
    {
      id: "minimal-clean",
      name: "Minimal Clean",
      desc: "Strip clutter: no chips, no endscreen, no watermark, no cards, no ads.",
      hidden: {
        "home-chips-bar": !0,
        "home-ads": !0,
        "home-card-hover-preview": !0,
        "player-endscreen": !0,
        "player-cards": !0,
        "player-watermark": !0,
        "player-autoplay": !0,
        "player-miniplayer": !0,
        "player-ad-overlay": !0,
        "player-ad-info": !0,
        "secondary-ads": !0,
        "secondary-autoplay": !0,
        "secondary-promoted": !0,
        "comments-input": !0,
        "global-promo-banner": !0,
        "global-survey": !0,
        "global-consent-banner": !0,
        "search-ads": !0,
      },
    },
    {
      id: "distraction-free",
      name: "Distraction Free",
      desc: "Watch-focused: hide right column, comments, endscreen, chat, all ads.",
      hidden: {
        "home-chips-bar": !0,
        "home-shorts-shelf": !0,
        "home-ads": !0,
        "home-card-hover-preview": !0,
        secondary: !0,
        comments: !0,
        "player-endscreen": !0,
        "player-cards": !0,
        "player-watermark": !0,
        "player-autoplay": !0,
        "player-nextbtn": !0,
        "player-miniplayer": !0,
        "player-ad-overlay": !0,
        "player-ad-info": !0,
        livechat: !0,
        "search-shorts-shelf": !0,
        "search-ads": !0,
        "global-promo-banner": !0,
        "global-survey": !0,
        "global-consent-banner": !0,
        "secondary-promoted": !0,
        "secondary-merch": !0,
      },
    },
    {
      id: "ultra-minimal",
      name: "Ultra Minimal",
      desc: "Bare minimum UI: no masthead, no sidebar, no comments, no right column.",
      hidden: {
        masthead: !0,
        sidebar: !0,
        "home-chips-bar": !0,
        "home-shorts-shelf": !0,
        "home-ads": !0,
        "home-card-hover-preview": !0,
        secondary: !0,
        comments: !0,
        "player-endscreen": !0,
        "player-cards": !0,
        "player-watermark": !0,
        "player-autoplay": !0,
        "player-nextbtn": !0,
        "player-miniplayer": !0,
        "player-ad-overlay": !0,
        "player-ad-info": !0,
        livechat: !0,
        "search-chips": !0,
        "search-shorts-shelf": !0,
        "search-ads": !0,
        "global-promo-banner": !0,
        "global-survey": !0,
        "global-consent-banner": !0,
        "global-guide-signin": !0,
      },
    },
    {
      id: "no-shorts",
      name: "No Shorts Anywhere",
      desc: "Remove every Shorts shelf, entry, and page across the site.",
      hidden: {
        "home-shorts-shelf": !0,
        "sidebar-shorts-entry": !0,
        "search-shorts-shelf": !0,
        "shorts-page": !0,
      },
    },
    {
      id: "no-ads-anywhere",
      name: "Ad-Free Layout",
      desc: "Hide every ad slot, promo banner, and sponsored placement.",
      hidden: {
        "home-ads": !0,
        "secondary-ads": !0,
        "secondary-promoted": !0,
        "secondary-merch": !0,
        "player-ad-overlay": !0,
        "player-ad-info": !0,
        "search-ads": !0,
        "global-promo-banner": !0,
        "global-consent-banner": !0,
        "global-survey": !0,
      },
    },
    {
      id: "cinema-focus",
      name: "Cinema Focus",
      desc: "Full immersion: hide masthead, sidebar, right column, comments, overlays.",
      hidden: {
        masthead: !0,
        sidebar: !0,
        secondary: !0,
        comments: !0,
        "player-endscreen": !0,
        "player-cards": !0,
        "player-watermark": !0,
        "player-autoplay": !0,
        "player-miniplayer": !0,
        "player-ad-overlay": !0,
        "player-ad-info": !0,
        livechat: !0,
        "global-promo-banner": !0,
      },
    },
    {
      id: "streamer-view",
      name: "Streamer / Recording View",
      desc: "Clean player for recording: no overlays, no watermark, no button clutter.",
      hidden: {
        "player-endscreen": !0,
        "player-cards": !0,
        "player-watermark": !0,
        "player-nextbtn": !0,
        "player-prevbtn": !0,
        "player-autoplay": !0,
        "player-miniplayer": !0,
        "player-settings": !0,
        "player-subtitles": !0,
        "player-pip-native": !0,
        "player-tooltip": !0,
        "player-ad-overlay": !0,
        "player-ad-info": !0,
        "masthead-notif": !0,
        "masthead-avatar": !0,
      },
    },
    {
      id: "reset-all",
      name: "Reset (Show Everything)",
      desc: "Un-hide all elements, restoring YouTube default layout.",
      hidden: {},
    },
  ];
  (Object.freeze(bo),
    bo.forEach(function (e) {
      (Object.freeze(e), Object.freeze(e.hidden));
    }));
  let vo = null;
  function ko(e) {
    if ((xo(), !e || !document.body)) return;
    let t;
    try {
      t = Array.from(document.querySelectorAll(e));
    } catch (e) {
      return;
    }
    if (!t.length) return;
    const a = document.createElement("div");
    ((a.id = "ytb-elem-hover"),
      (a.style.cssText =
        "position:fixed;inset:0;z-index:2147483640;pointer-events:none"));
    for (const e of t) {
      let t;
      try {
        t = e.getBoundingClientRect();
      } catch (e) {
        continue;
      }
      if (!t || (0 === t.width && 0 === t.height)) continue;
      const n = document.createElement("div");
      ((n.style.cssText =
        "position:fixed;border:2px solid #3ea6ff;background:rgba(62,166,255,.15);border-radius:3px;pointer-events:none;left:" +
        t.left +
        "px;top:" +
        t.top +
        "px;width:" +
        t.width +
        "px;height:" +
        t.height +
        "px"),
        a.appendChild(n));
    }
    a.children.length && (document.body.appendChild(a), (vo = a));
  }
  function xo() {
    if (vo) {
      try {
        vo.remove();
      } catch (e) {}
      vo = null;
    }
  }
  (xa.register({
    id: "elements-control",
    name: "Element Hider",
    summary: "Hide any named YouTube element; per-element toggles with live matching.",
      cat: "appearance",
    masterKey: "elementsControlOn",
    keys: ["elementsControlOn", "elementsControlHidden"],
    apply(e) {
      if (!S.elementsControlOn) return;
      const t = S.elementsControlHidden || {},
        a = [];
      for (const e of fo)
        for (const n of e.items) t[n.id] && a.push(n.selector);

      const valid = [];
      for (const sel of a) {
        try { document.querySelector(sel); valid.push(sel); } catch (_) {}
      }
      valid.length &&
        e.addStyle(
          valid.map((sel) => sel + "{display:none!important;visibility:hidden!important}").join("\n"),
        );
    },
    settings(e) {
      const t = () => S.elementsControlHidden || {},
        a = To("div", "ytb-elem-status"),
        n = () => {
          const e = (() => {
            const e = t(),
              a = fo.reduce((e, t) => e + t.items.length, 0);
            return { on: Object.keys(e).filter((t) => e[t]).length, total: a };
          })();
          a.textContent = e.on + " of " + e.total + " elements hidden";
        };
      (n(),
        e.appendChild(a),
        e.appendChild(To("div", "ytb-elem-sec-title", "Quick Presets")));
      const r = To("div", "ytb-preset-grid");
      function o(e) {
        const a = t(),
          n = Object.keys(e.hidden).filter((t) => e.hidden[t]),
          r = Object.keys(a).filter((e) => a[e]);
        return n.length === r.length && n.every((e) => a[e]);
      }
      function i() {
        r.querySelectorAll(".ytb-preset-card").forEach((e, t) => {
          e.classList.toggle("active", o(bo[t]));
        });
      }
      for (const e of bo) {
        const t = To("div", "ytb-preset-card");
        (t.addEventListener("click", () => {
          const t = c.scrollTop;
          (Ta("elementsControlHidden", Object.assign({}, e.hidden)),
            n(),
            p(),
            i(),
            (c.scrollTop = t),
            pe("Loaded preset: " + e.name, 1600, "success"));
        }),
          t.appendChild(To("div", "ytb-preset-name", e.name)),
          t.appendChild(To("div", "ytb-preset-desc", e.desc)),
          o(e) && t.classList.add("active"),
          r.appendChild(t));
      }
      (e.appendChild(r),
        e.appendChild(To("div", "ytb-elem-sec-title", "Individual Elements")));
      const d = document.createElement("input");
      ((d.type = "search"),
        (d.placeholder = "Filter by name…"),
        (d.className = "ytb-inp"),
        (d.style.marginBottom = "6px"),
        e.appendChild(d));
      const c = To("div", "ytb-elem-list");
      e.appendChild(c);
      let s = new Map();
      function l(e, t) {
        const a = Object.assign({}, S.elementsControlHidden || {});
        (t ? (a[e] = !0) : delete a[e],
          Ta("elementsControlHidden", a),
          n(),
          i());
      }
      function p() {
        const e = t();
        for (const [t, a] of s) {
          const n = !!e[t];
          ((a.cb.checked = n), a.row.classList.toggle("on", n));
        }
      }
      (!(function () {
        (c.replaceChildren(), (s = new Map()));
        const e = t();
        for (const t of fo) {
          const a = To("div", "ytb-elem-group-hdr", t.group);
          ((a.dataset.group = t.group), c.appendChild(a));
          for (const a of t.items) {
            const n = To("div", "ytb-elem-row");
            ((n.dataset.id = a.id),
              (n.dataset.name = a.name.toLowerCase()),
              (n.dataset.groupName = t.group.toLowerCase()));
            const r = !!e[a.id];
            r && n.classList.add("on");
            const o = document.createElement("input");
            ((o.type = "checkbox"),
              (o.className = "ytb-elem-cb"),
              (o.checked = r),
              o.addEventListener("change", () => {
                const e = c.scrollTop;
                (l(a.id, o.checked),
                  n.classList.toggle("on", o.checked),
                  requestAnimationFrame(() => {
                    c.scrollTop = e;
                  }));
              }));
            const i = To("span", "ytb-elem-name", a.name),
              d = To("span", "ytb-elem-match", "");
            try {
              const e = document.querySelectorAll(a.selector).length;
              ((d.textContent = e + " on page"),
                0 === e && n.classList.add("nomatch"));
            } catch (e) {
              d.textContent = "?";
            }
            (n.addEventListener("mouseenter", () => ko(a.selector)),
              n.addEventListener("mouseleave", () => xo()),
              n.appendChild(o),
              n.appendChild(i),
              n.appendChild(d),
              c.appendChild(n),
              s.set(a.id, { row: n, cb: o }));
          }
        }
      })(),
        d.addEventListener(
          "input",
          ee(function () {
            const e = (d.value || "").trim().toLowerCase(),
              t = new Set();
            for (const [, a] of s) {
              const n =
                !e ||
                a.row.dataset.name.includes(e) ||
                a.row.dataset.groupName.includes(e);
              ((a.row.style.display = n ? "" : "none"),
                n && t.add(a.row.dataset.groupName));
            }
            c.querySelectorAll(".ytb-elem-group-hdr").forEach((a) => {
              a.style.display =
                !e || t.has(a.dataset.group.toLowerCase()) ? "" : "none";
            });
          }, 80),
        ),
        So("cfg.changed", ({ key: e }) => {
          if ("elementsControlHidden" === e) {
            const e = c.scrollTop;
            (n(),
              p(),
              i(),
              requestAnimationFrame(() => {
                c.scrollTop = e;
              }));
          }
        }));
      const u = To("div", "ytb-rowb");
      (u.appendChild(
        Oo("Show all (un-hide)", () => {
          const e = c.scrollTop;
          (Ta("elementsControlHidden", {}),
            n(),
            p(),
            i(),
            requestAnimationFrame(() => {
              c.scrollTop = e;
            }));
        }),
      ),
        e.appendChild(u));
    },
  }),
    Object.freeze(dn),
    Object.freeze(cn),
    Object.freeze(sn),
    Object.freeze(i),
    Object.freeze(s));
  let wo = null;
  const Co = [];
  function So(e, t) {
    const n = g.on(e, t);
    return (Co.push(n), n);
  }
  function To(e, t, a) {
    const n = document.createElement(e);
    return (t && (n.className = t), null != a && (n.textContent = a), n);
  }
  function Oo(e, t, a) {
    const n = document.createElement("button");
    return (
      (n.type = "button"),
      (n.className = "ytb-btn" + (a ? " " + a : "")),
      (n.textContent = e),
      n.addEventListener("click", t),
      n
    );
  }
  function Mo(e, t, a) {
    const n = Oo(e, t, a);
    return (n.classList.add("ytb-sb"), n);
  }
  function Lo(e, t) {
    const a = To("div", "ytb-row");
    return (a.appendChild(To("span", "ytb-lbl", e)), a.appendChild(t), a);
  }
  function Ao(e) {
    const t = To("div", "ytb-rowb");
    return (e.forEach(([e, a]) => t.appendChild(Oo(e, a))), t);
  }
  function Eo(e) {
    const t = To("div", "ytb-rowb");
    return (e.forEach((e) => t.appendChild(e)), t);
  }
  function Bo(e) {
    const t = To("label", "ytb-sw"),
      a = document.createElement("input");
    return (
      (a.type = "checkbox"),
      (a.dataset.key = e),
      (a.checked = !!S[e]),
      a.addEventListener("change", () => Ta(e, a.checked)),
      t.appendChild(a),
      t.appendChild(To("span", "ytb-track")),
      t.appendChild(To("span", "ytb-knob")),
      So("cfg.changed", ({ key: t }) => {
        t === e && (a.checked = !!S[e]);
      }),
      t
    );
  }
  function Po(e, t) {
    const a = document.createElement("select");
    return (
      (a.className = "ytb-sel"),
      (a.dataset.key = e),
      Object.entries(t).forEach(([e, t]) => {
        const n = document.createElement("option");
        ((n.value = String(e)), (n.textContent = t), a.appendChild(n));
      }),
      (a.value = String(S[e])),
      a.addEventListener("change", () =>
        Ta(e, "number" == typeof s[e] ? Number(a.value) : a.value),
      ),
      So("cfg.changed", ({ key: t }) => {
        t === e && (a.value = String(S[e]));
      }),
      a
    );
  }
  function Io(e, t) {
    return Lo(e, Bo(t));
  }
  function Ro(e, t, a) {
    return Lo(e, Po(t, a));
  }
  function No(e, t, a, n, r, o) {
    return Lo(
      e,
      (function (e, t, a, n, r) {
        const o = To("div", "ytb-rng"),
          i = document.createElement("input");
        ((i.type = "range"),
          (i.min = t),
          (i.max = a),
          (i.step = n),
          (i.dataset.key = e),
          (i.value = String(S[e])));
        const d = To("span", "ytb-rngv", r(Number(S[e])));
        return (
          i.addEventListener("input", () => {
            const t = Number(i.value);
            ((d.textContent = r(t)), Ta(e, t));
          }),
          So("cfg.changed", ({ key: t }) => {
            t === e &&
              ((i.value = String(S[e])), (d.textContent = r(Number(S[e]))));
          }),
          o.appendChild(i),
          o.appendChild(d),
          o
        );
      })(t, a, n, r, o),
    );
  }
  function _o(e, t) {
    const a = To("div", "ytb-col");
    return (
      a.appendChild(To("span", "ytb-lbl", e)),
      a.appendChild(
        (function (e) {
          const t = document.createElement("input");
          return (
            (t.type = "text"),
            (t.className = "ytb-inp"),
            (t.dataset.key = e),
            (t.value = S[e] || ""),
            t.addEventListener("change", () => Ta(e, t.value)),
            So("cfg.changed", ({ key: a }) => {
              a === e && (t.value = S[e] || "");
            }),
            t
          );
        })(t),
      ),
      a
    );
  }

  function Xp(e, t) {
    const a = To("div", "ytb-col");
    a.appendChild(To("span", "ytb-lbl", e));
    const n = To("div", "ytb-cp");
    n.style.cssText = "display:flex;align-items:center;gap:8px;width:100%";
    const r = document.createElement("input");
    r.type = "text";
    r.className = "ytb-inp ytb-cp-text";
    r.style.cssText = "flex:1;min-width:0";
    r.dataset.key = t;
    r.value = S[t] || "";
    const o = document.createElement("input");
    o.type = "color";
    o.className = "ytb-cp-native";
    o.dataset.key = t;
    const _toHex6 = (v) => {
      const m = String(v || "").trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
      if (!m) return "000000";
      let h = m[1];
      if (h.length === 3) h = h.split("").map((c) => c + c).join("");
      return h.toLowerCase();
    };
    o.value = /^#[0-9a-fA-F]{6}$/.test(S[t] || "") ? S[t] : ("#" + _toHex6(S[t]));
    o.style.cssText = "width:36px;height:32px;border:1px solid rgba(255,255,255,.15);border-radius:7px;background:transparent;cursor:pointer;padding:2px;flex-shrink:0";
    const i = document.createElement("div");
    i.className = "ytb-cp-swatch";
    i.dataset.key = t;
    i.style.cssText = "width:28px;height:28px;border-radius:6px;border:1px solid rgba(255,255,255,.18);flex-shrink:0;background:" + o.value;
    const _updateSwatch = (val) => {
      if (/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test((val || "").trim())) {
        i.style.background = val;
        o.value = "#" + _toHex6(val);
      } else {
        i.style.background = "transparent";
      }
    };
    r.addEventListener("change", () => {
      Ta(t, r.value);
      _updateSwatch(r.value);
    });
    o.addEventListener("input", () => {
      r.value = o.value;
      Ta(t, o.value);
      i.style.background = o.value;
    });
    So("cfg.changed", ({ key: e }) => {
      if (e === t) {
        r.value = S[t] || "";
        o.value = /^#[0-9a-fA-F]{6}$/.test(S[t] || "") ? S[t] : ("#" + _toHex6(S[t]));
        _updateSwatch(S[t] || "");
      }
    });
    return a.appendChild(n), n.appendChild(r), n.appendChild(o), n.appendChild(i), a;
  }
  function Yp_fontRow(e, t) {
    const a = To("div", "ytb-col");
    (a.appendChild(To("span", "ytb-lbl", e)),
      a.appendChild(
        (function (e) {
          const t = To("div", "ytb-fp");
          ((t.style.position = "relative"),
            (t.style.width = "100%"));
          const a = document.createElement("button");
          ((a.type = "button"),
            (a.className = "ytb-fp-btn"),
            (a.dataset.key = e));
          const n = document.createElement("span");
          n.className = "ytb-fp-name";
          const r = document.createElement("span");
          r.className = "ytb-fp-arrow";
          (r.textContent = "\u25BE",
            a.appendChild(n),
            a.appendChild(r));
          const o = To("div", "ytb-fp-dd");
          o.style.display = "none";
          const i = To("input", "ytb-fp-search");
          ((i.type = "text"),
            (i.placeholder = "Search fonts..."),
            (i.className = "ytb-inp"));
          const d = To("div", "ytb-fp-list");
          (o.appendChild(i), o.appendChild(d));
          const l = () => {
            const t = (S[e] || "").trim() || "Roboto, Arial, sans-serif";
            n.textContent = t.split(",")[0].trim().replace(/['"]/g, "");
            n.style.fontFamily = t;
          };
          const _cfgKey = e;
          const c = (e, t) => {
            const a = To("div", "ytb-fp-item");
            ((a.style.fontFamily = e),
              (a.dataset.value = e),
              (a.textContent = t),
              a.addEventListener("click", () => {
                (Ta(_cfgKey, a.dataset.value), l(), (o.style.display = "none"));
              }),
              d.appendChild(a));
          };
          Yt_fontFamilies().forEach((e) => {
            c(
              e,
              e
                .split(",")[0]
                .trim()
                .replace(/['"]/g, ""),
            );
          }),
            (i.addEventListener("input", () => {
              const t = i.value.trim().toLowerCase();
              d.querySelectorAll(".ytb-fp-item").forEach((e) => {
                e.style.display = e.textContent.toLowerCase().includes(t)
                  ? ""
                  : "none";
              });
            }),
            a.addEventListener("click", () => {
              (o.style.display =
                "none" === o.style.display ? "block" : "none",
                "block" === o.style.display && i.focus());
            }),
            document.addEventListener("click", (t) => {
              t.target !== a &&
                !a.contains(t.target) &&
                !o.contains(t.target) &&
                (o.style.display = "none");
            }),
            So("cfg.changed", ({ key: t }) => {
              t === e && l();
            }),
            l());
          return (t.appendChild(a), t.appendChild(o), t);
        })(t),
      ));
    return a;
  }
  function Yt_fontFamilies() {
    return [
      "Arial, sans-serif",
      "Arial Black, sans-serif",
      "Arial Narrow, sans-serif",
      "Helvetica, sans-serif",
      "Helvetica Neue, sans-serif",
      "Verdana, sans-serif",
      "Tahoma, sans-serif",
      "Trebuchet MS, sans-serif",
      "Geneva, sans-serif",
      "Calibri, sans-serif",
      "Cambria, sans-serif",
      "Candara, sans-serif",
      "Constantia, sans-serif",
      "Corbel, sans-serif",
      "Segoe UI, sans-serif",
      "Roboto, sans-serif",
      "Roboto Condensed, sans-serif",
      "Roboto Mono, monospace",
      "Roboto Slab, serif",
      "Open Sans, sans-serif",
      "Open Sans Condensed, sans-serif",
      "Lato, sans-serif",
      "Montserrat, sans-serif",
      "Poppins, sans-serif",
      "Inter, sans-serif",
      "Nunito, sans-serif",
      "Nunito Sans, sans-serif",
      "Raleway, sans-serif",
      "Source Sans Pro, sans-serif",
      "Source Sans 3, sans-serif",
      "Source Code Pro, monospace",
      "Ubuntu, sans-serif",
      "Noto Sans, sans-serif",
      "Noto Sans JP, sans-serif",
      "Noto Sans KR, sans-serif",
      "Noto Sans SC, sans-serif",
      "Noto Sans Arabic, sans-serif",
      "Noto Sans Hebrew, sans-serif",
      "Noto Sans Thai, sans-serif",
      "Noto Sans Devanagari, sans-serif",
      "PT Sans, sans-serif",
      "PT Sans Narrow, sans-serif",
      "PT Serif, serif",
      "Cabin, sans-serif",
      "Karla, sans-serif",
      "Mulish, sans-serif",
      "DM Sans, sans-serif",
      "Work Sans, sans-serif",
      "Quicksand, sans-serif",
      "Comfortaa, sans-serif",
      "Rubik, sans-serif",
      "Heebo, sans-serif",
      "Assistant, sans-serif",
      "Barlow, sans-serif",
      "Barlow Condensed, sans-serif",
      "Bebas Neue, sans-serif",
      "Oswald, sans-serif",
      "Anton, sans-serif",
      "Archivo, sans-serif",
      "Archivo Black, sans-serif",
      "Manrope, sans-serif",
      "Sora, sans-serif",
      "Space Grotesk, sans-serif",
      "Plus Jakarta Sans, sans-serif",
      "Outfit, sans-serif",
      "Spectral, serif",
      "IBM Plex Sans, sans-serif",
      "IBM Plex Sans Condensed, sans-serif",
      "IBM Plex Serif, serif",
      "IBM Plex Mono, monospace",
      "Fira Sans, sans-serif",
      "Fira Sans Condensed, sans-serif",
      "Fira Code, monospace",
      "JetBrains Mono, monospace",
      "Cascadia Code, monospace",
      "Cascadia Mono, monospace",
      "Inconsolata, monospace",
      "Consolas, monospace",
      "Menlo, monospace",
      "Monaco, monospace",
      "Courier New, monospace",
      "Lucida Console, monospace",
      "Lucida Sans Unicode, sans-serif",
      "Lucida Grande, sans-serif",
      "Gill Sans, sans-serif",
      "Optima, sans-serif",
      "Futura, sans-serif",
      "Avenir, sans-serif",
      "Avenir Next, sans-serif",
      "Didot, serif",
      "Bodoni 72, serif",
      "Hoefler Text, serif",
      "American Typewriter, serif",
      "Brush Script MT, cursive",
      "Snell Roundhand, cursive",
      "Bradley Hand, cursive",
      "Chalkboard, sans-serif",
      "Chalkduster, sans-serif",
      "Marker Felt, sans-serif",
      "Palatino, serif",
      "Palatino Linotype, serif",
      "Book Antiqua, serif",
      "Garamond, serif",
      "Big Caslon, serif",
      "Times New Roman, serif",
      "Times, serif",
      "Georgia, serif",
      "Baskerville, serif",
      "Cochin, serif",
      "Apple Chancery, cursive",
      "Impact, sans-serif",
      "Copperplate, serif",
      "Papyrus, cursive",
      "Hiragino Sans, sans-serif",
      "Yu Gothic, sans-serif",
      "Meiryo, sans-serif",
      "MS Gothic, monospace",
      "MS PGothic, monospace",
      "Malgun Gothic, sans-serif",
      "SimSun, sans-serif",
      "SimHei, sans-serif",
      "MingLiU, sans-serif",
      "PMingLiU, sans-serif",
      "Microsoft YaHei, sans-serif",
      "Microsoft JhengHei, sans-serif",
      "Hiragino Kaku Gothic Pro, sans-serif",
      "Apple SD Gothic Neo, sans-serif",
      "Apple Color Emoji, sans-serif",
      "Noto Color Emoji, sans-serif",
      "system-ui, sans-serif",
      "-apple-system, BlinkMacSystemFont, sans-serif",
    ];
  }
  function Ho(e, t, a) {
    const n = To("div", "ytb-col");
    return (
      n.appendChild(To("span", "ytb-lbl", e)),
      n.appendChild(
        (function (e, t) {
          const a = document.createElement("textarea");
          return (
            (a.className = "ytb-ta"),
            (a.placeholder = t || ""),
            (a.dataset.key = e),
            (a.value = S[e] || ""),
            a.addEventListener(
              "input",
              ee(() => Ta(e, a.value), 250),
            ),
            So("cfg.changed", ({ key: t }) => {
              t === e && a !== document.activeElement && (a.value = S[e] || "");
            }),
            a
          );
        })(t, a),
      ),
      n
    );
  }
  function Do(e) {
    const t = To("div", "ytb-card");
    t.dataset.feat = e.id;
    const a = To("div", "ytb-head");
    a.appendChild(To("div", "ytb-name", e.name));
    const n = s[e.masterKey],
      r = "string" == typeof e.masterKey && e.masterKey.startsWith("_bundle"),
      o = !r && "string" == typeof n,
      i =
        "function" == typeof e.isOn
          ? () => !!e.isOn()
          : o
            ? () => !!S[e.masterKey] && "off" !== S[e.masterKey]
            : () => !!S[e.masterKey];
    if (r) {
      const t = document.createElement("span");
      ((t.className = "ytb-toggle-pill"),
        (t.style.cssText =
          "font:700 10px system-ui;padding:3px 8px;border-radius:999px;letter-spacing:.02em;text-transform:uppercase"));
      const n = () => {
        const a = i(),
          n = (e.keys || [])
            .filter((e) => "boolean" == typeof s[e])
            .reduce((e, t) => e + (S[t] ? 1 : 0), 0);
        ((t.textContent = a ? n + " on" : "off"),
          (t.style.background = a
            ? "rgba(0,160,80,.22)"
            : "rgba(255,255,255,.06)"),
          (t.style.color = a ? "#7be1a3" : "#999"));
      };
      (n(),
        a.appendChild(t),
        So("cfg.changed", ({ key: t }) => {
          -1 !== (e.keys || []).indexOf(t) && n();
        }));
    } else if (o) {
      const t = document.createElement("span");
      ((t.className = "ytb-toggle-pill"),
        (t.style.cssText =
          "font:700 10px system-ui;padding:3px 8px;border-radius:999px;background:rgba(255,255,255,.08);color:#bbb;letter-spacing:.02em;text-transform:uppercase"));
      const n = () => {
        const a = String(S[e.masterKey] || "off");
        t.textContent = a;
        const n = i();
        ((t.style.background = n
          ? "rgba(0,160,80,.22)"
          : "rgba(255,255,255,.06)"),
          (t.style.color = n ? "#7be1a3" : "#999"));
      };
      (n(),
        a.appendChild(t),
        So("cfg.changed", ({ key: t }) => {
          t === e.masterKey && n();
        }));
    } else a.appendChild(Bo(e.masterKey));
    (t.appendChild(a),
      e.summary && t.appendChild(To("div", "ytb-sum", e.summary)));
    const d = To("div", "ytp-settings");
    let c = !1;
    const l = () => {

      const t = o || r || !!e.settingsAlways,
        a = !!t || i();
      (a &&
        !c &&
        (() => {
          if (!c) {
            c = !0;
            try {
              e.settings(d);
            } catch (t) {
              m("settings " + e.id, t);
            }
          }
        })(),
        (d.style.display = t || a ? "block" : "none"));
    };
    return (
      l(),
      t.appendChild(d),
      So("cfg.changed", ({ key: t }) => {
        t === e.masterKey && l();
      }),
      t
    );
  }
  const qo = { query: "", limit: 30 };
  function Vo(t, a) {
    const n = t.progress || 0,
      r = !!t.completed,
      o = !r && (t.lastPosition || 0) > 5,
      i = To("div", "ytb-hcard" + (r ? " done" : "")),
      d = To("div", "ytb-hthumb"),
      c = t.thumbnail || ie.thumb(t.videoId, "mqdefault");

    const _veCached = Ve.get(t.videoId);
    if (_veCached) {
      try { YourTubeResources.TrackedBlobURL.touch(_veCached); } catch (_) {}
      d.style.backgroundImage = "url('" + _veCached + "')";
    } else {
      const safeC = sanitizeUrlForCSS(c);
      d.style.backgroundImage = safeC ? "url('" + encodeURI(safeC).replace(/'/g, "%27") + "')" : "none";
      je(t.videoId)
        .then((e) => {
          if (e && d.style.backgroundImage.indexOf(_veCached || "blob:") === -1) {
            d.style.backgroundImage = "url('" + e + "')";
          } else if (!e) {
            We(t.videoId, c).catch(() => {});
          }
        })
        .catch(() => {});
    }
    (r
      ? d.appendChild(To("div", "ytb-hbadge done", "Done"))
      : o && d.appendChild(To("div", "ytb-hbadge res", ce(t.lastPosition))));
    const s = To("div", "ytb-hinfo");
    (s.appendChild(To("div", "ytb-htitle", t.title || t.videoId)),
      s.appendChild(To("div", "ytb-hchan", t.channel || "Unknown")));
    const l = [];
    (t.duration && l.push(ce(t.duration)),
      !r && t.remaining > 0 && l.push(ce(t.remaining) + " left"),
      t.lastWatched &&
        l.push(
          (function (e) {
            if (!e) return "Never";
            const t = Date.now() - e;
            return t < 6e4
              ? "Just now"
              : t < 36e5
                ? Math.floor(t / 6e4) + "m ago"
                : t < 864e5
                  ? Math.floor(t / 36e5) + "h ago"
                  : t < 6048e5
                    ? Math.floor(t / 864e5) + "d ago"
                    : new Date(e).toLocaleDateString();
          })(t.lastWatched),
        ),
      s.appendChild(To("div", "ytb-hmeta", l.join(" - "))));
    const p = To("div", "ytb-hpt"),
      u = To("div", "ytb-hpf" + (r ? " done" : ""));
    ((u.style.width = Math.min(100, n) + "%"),
      p.appendChild(u),
      s.appendChild(p));
    const h = To("div", "ytb-hacts");
    return (
      o &&
        h.appendChild(
          Mo(
            "Resume " + ce(t.lastPosition),
            () => {
              e.location.href =
                "https://www.youtube.com/watch?v=" +
                t.videoId +
                "&t=" +
                Math.floor(t.lastPosition);
            },
            "primary",
          ),
        ),
      h.appendChild(
        Mo(r ? "Rewatch" : "Open", () => {
          e.location.href = "https://www.youtube.com/watch?v=" + t.videoId;
        }),
      ),
      h.appendChild(Mo("Remove", () => Pe(t.videoId).then(a), "danger")),
      s.appendChild(h),
      i.appendChild(d),
      i.appendChild(s),
      i
    );
  }
  function Yp_clampRect(e, t, a, n) {
    const r = window.innerWidth,
      o = window.innerHeight;
    return (
      (a = Math.max(320, Math.min(a, r))),
      (n = Math.max(280, Math.min(n, o))),
      {
        x: (e = Math.max(8 - a + 80, Math.min(e, r - 80))),
        y: (t = Math.max(0, Math.min(t, o - 40))),
        w: a,
        h: n,
      }
    );
  }
  function jo(e, t, a, n) {
    Oa({
      dashX: Math.round(e),
      dashY: Math.round(t),
      dashW: Math.round(a),
      dashH: Math.round(n),
    });
  }
  function zo(e) {
    wo &&
      ((wo.style.left = e.x + "px"),
      (wo.style.top = e.y + "px"),
      (wo.style.width = e.w + "px"),
      (wo.style.height = e.h + "px"),
      (wo.style.right = "auto"),
      (wo.style.bottom = "auto"));
  }
  function Wo() {
    if (!wo) return;
    const e = wo.getBoundingClientRect();
    zo(Yp_clampRect(e.left, e.top, e.width, e.height));
  }