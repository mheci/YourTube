    function Cb_norm(e) {
    if (!(e = String(e || "").trim())) return "";
    try {
      if (/^https?:\/\//i.test(e)) {
        const t = new URL(e),
          a = t.pathname.match(/\/@([^/?#]+)/);
        if (a) return "@" + a[1].toLowerCase();
        const n = t.pathname.match(/\/(channel|c|user)\/([^/?#]+)/i);
        if (n) return n[2].toLowerCase();
      }
    } catch (e) {}
    if (
      (e = e
        .replace(/^https?:\/\/(www\.)?youtube\.com\//i, "")
        .replace(/^\//, "")
        .trim()).startsWith("@")
    )
      return "@" + e.slice(1).toLowerCase();
    const t = e.match(/@([A-Za-z0-9._-]+)/);
    return t ? "@" + t[1].normalize("NFC").toLowerCase() : e.normalize("NFC").toLowerCase();
  }
  function Cb_parseList() {
    const e = new Set(),
      t = [],
      a = String(S.channelBlockerList || ""),
      n = a.split(/[\n,;|]/),
      r = /\/@\(([^)]+)\)/g;
    let o;
    for (; (o = r.exec(a)); )
      o[1].split("|").forEach((e) => n.push("@" + e.replace(/\\/g, "").trim()));
    for (const a of n) {
      const n = Cb_norm(a);
      n && !e.has(n) && (e.add(n), t.push(n));
    }
    return t;
  }
  function Cb_anchorInfo(e) {
    if (!e) return { handle: "", name: "", href: "" };
    const t = e.href || e.getAttribute("href") || "";
    let a = "";
    try {
      const e = new URL(t, location.href).pathname.match(/\/@([^/?#]+)/);
      e && (a = "@" + e[1].toLowerCase());
    } catch (e) {}
    return {
      handle: a,
      name: (e.title || e.textContent || "").trim(),
      href: t,
    };
  }
  (Ha(
      "compact-ui",
      "Compact UI",
      "Tighter watch-page margins, metadata sizes and paddings.",
    "compactUI",
    "ytd-watch-metadata{font-size:13px!important}#title h1{font-size:18px!important}#secondary{font-size:12px!important}",
      "appearance",
  ),

    Ha(
      "hide-recs",
      "Hide Recommendations",
      "Removes the related-videos sidebar on watch pages.",
      "hideRecs",
      "#secondary,#related,ytd-watch-next-secondary-results-renderer{display:none!important}#primary{max-width:100%!important}",
    "feed"
    ),
    Ha(
      "hide-comments",
      "Hide Comments",
      "Removes the comments section on watch pages.",
      "hideComments",
      "#comments,ytd-comments{display:none!important}",
    "comments"
    ),
    Ha(
      "hide-endscreen",
      "Hide End Cards",
      "Blocks end-screen recommendation cards and teasers.",
      "hideEndscreen",
      ".ytp-ce-element,.ytp-cards-teaser{display:none!important}",
    "feed"
    ),
    Ha(
      "hide-livechat",
      "Hide Live Chat",
      "Collapses and removes the live chat panel on streams.",
      "hideLivechat",
      "ytd-live-chat-frame{display:none!important}",
    "comments"
    ),
    Ha(
      "hide-watermark",
      "Hide Watermark",
      "Removes the channel watermark overlay on the player.",
      "hideWatermark",
      ".ytp-watermark{display:none!important}",
      "feed"
    ),
    Ha(
      "hide-cards",
      "Hide Info Cards",
      "Blocks the interactive (i) teaser popups during playback.",
      "hideCards",
      ".ytp-cards-button,.ytp-cards-teaser-text{display:none!important}",
      "comments"
    ),
    Ha(
      "hide-masthead",
      "Hide Masthead",
      "Removes the top navigation bar site-wide.",
      "hideMasthead",
      "ytd-masthead,#masthead,#masthead-container,ytd-topbar,#topbar,#topbar-container,ytd-masthead-container{display:none!important}ytd-page-manager,#page-manager,ytd-app.guide-collapsed{--ytd-masthead-height:0px;margin-top:0!important}",
    "appearance"
    ),
    Ha(
      "hide-banner-ads",
      "Hide Banner Ads",
      "Removes display banners, sponsored shelves and promo overlays.",
      "hideBannerAds",
      "ytd-ad-slot-renderer,ytd-banner-promo-renderer,ytd-promoted-sparkles-web-renderer,#masthead-ad,#player-ads,.ytp-ad-overlay-container,.ytp-ad-text-overlay,ytd-in-feed-ad-layout-renderer{display:none!important}",
      "feed"
    ));
  const Fa = [
      "ytd-rich-item-renderer",
      "ytd-video-renderer",
      "ytd-compact-video-renderer",
      "ytd-grid-video-renderer",
      "ytd-channel-renderer",
      "ytd-playlist-renderer",
      "ytd-playlist-video-renderer",
      "ytd-playlist-panel-video-renderer",
      "ytd-notification-renderer",
      "ytd-comment-thread-renderer",
      "yt-lockup-view-model",
      "ytd-reel-item-renderer",
      "ytd-rich-shelf-renderer",
      "ytd-shelf-renderer",
      "ytd-rich-section-renderer",
      "ytm-media-item",
      "ytm-video-with-context-renderer",
      "ytm-compact-video-renderer",
      "ytm-reel-item-renderer",
    ],
    ja = [
      "#video-title",
      "#video-title-link",
      ".yt-lockup-metadata-view-model__title",
      ".ytLockupMetadataViewModelTitle",
      ".yt-attributed-string",
      ".yt-core-attributed-string",
      "yt-formatted-string#video-title",
    ],
    Cb_blockSurfaces = "ytd-rich-item-renderer,ytd-video-renderer,ytd-compact-video-renderer,ytd-grid-video-renderer,yt-lockup-view-model,ytd-channel-renderer,ytd-playlist-renderer,ytd-reel-item-renderer,ytm-media-item,ytm-compact-video-renderer,ytm-reel-item-renderer";
  function za(e, t) {
    const a = e.querySelectorAll(
      'a[href*="/@"],a[href^="/@"],a[href*="/channel/"],a[href*="/c/"],a[href*="/user/"],a#channel-name,ytd-channel-name a,#channel-name a,#owner-name a',
    );
    for (const e of a) {
      const a = Cb_anchorInfo(e),
        n = (a.href || "").toLowerCase(),
        r = a.handle ? a.handle.slice(1) : "";
      for (const e of t.handles) {
        if (r && r === e) return !0;
        if (n.includes("/@" + e)) return !0;
      }
      if (t.names.length) {
        const e = (a.name || "").toLowerCase();
        for (const a of t.names)
          if (a && (e.includes(a) || n.includes(a))) return !0;
      }
    }
    if (t.names.length && S.channelBlockerMatchTitleText)
      for (const a of ja) {
        const n = e.querySelector(a);
        if (!n) continue;
        const r = ((n.title || n.textContent || "") + "").toLowerCase();
        for (const e of t.names) if (r.includes(e)) return !0;
      }
    return !1;
  }
  function Wa(e) {
    if (!e || e.dataset.ytbBlockBtn) return;

    if (e.closest("ytd-guide-renderer,ytd-mini-guide-renderer,#guide,ytd-watch-next-secondary-results-renderer,#secondary,#related")) return;

    if (e.querySelector("yt-img-shadow")) return;
    const t = Cb_anchorInfo(e),
      a = t.handle || t.name;
    if (!a) return;
    e.dataset.ytbBlockBtn = "1";
    const n = document.createElement("button");
    ((n.type = "button"),
      (n.className = "ytb-channel-block-btn"),
      (n.textContent = "Block"),
      (n.title = "Block " + a + " with YourTube"),
      n.addEventListener(
        "click",
        (e) => {
          (e.preventDefault(), e.stopPropagation());
          const t = Cb_norm(a),
            n = Cb_parseList();
          (n.includes(t) || n.push(t),
            Oa({ channelBlockerOn: !0, channelBlockerList: n.join("\n") }),
            pe("Hidden: " + t, 1600, "success"));
        },
        !0,
      ),
      e.insertAdjacentElement("afterend", n));
  }
  xa.register({
    id: "channel-blocker",
    name: "Channel Blocker",
    summary: "Hides listed channels plus uBlock-style rules across every surface.",
      cat: "channels",
    masterKey: "channelBlockerOn",
    keys: [
      "channelBlockerOn",
      "channelBlockerList",
      "channelBlockerHideWatch",
      "channelBlockerHideBrowse",
      "channelBlockerHideComments",
      "channelBlockerMatchTitleText",
    ],
    apply(e) {

      if (!S.channelBlockerOn) {
        document.querySelectorAll(".ytb-channel-block-btn").forEach(el => el.remove());
          document.querySelectorAll("[data-ytb-block-btn]").forEach(el => { delete el.dataset.ytbBlockBtn; });
        document.querySelectorAll(".ytb-channel-blocked").forEach(el => el.classList.remove("ytb-channel-blocked"));
        document.querySelectorAll(".ytb-ublock-hidden").forEach(el => el.classList.remove("ytb-ublock-hidden"));
        document.documentElement.classList.remove("ytb-channel-path-blocked");
        const oldStyle = document.getElementById("ytb-ublock-css");
        if (oldStyle) oldStyle.remove();
        return;
      }


      e.addStyle(
        '.ytb-channel-blocked,.ytb-ublock-hidden{display:none!important;visibility:hidden!important;pointer-events:none!important}' +
        '.ytb-channel-block-btn{margin-left:6px;border:0;border-radius:999px;background:rgba(204,0,0,.12);color:#ff7777;padding:2px 7px;font:700 10px system-ui;cursor:pointer;vertical-align:middle}' +
        '.ytb-channel-block-btn:hover{background:rgba(204,0,0,.25);color:#fff}' +
        'ytd-comment-renderer #header-author{display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;column-gap:8px}' +
        '.ytb-channel-path-blocked ytd-browse[page-subtype="channels"]{display:none!important}'
      );


      const rawList = String(S.channelBlockerList || "");
      const convertedLines = [];
      for (const line of rawList.split(/[\n\r]+/)) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.includes("##")) {
          convertedLines.push(trimmed);
          continue;
        }

        if (trimmed[0] === "!" || trimmed[0] === "#") {
          convertedLines.push(trimmed);
          continue;
        }

        const norm = Cb_norm(trimmed);
        if (!norm) continue;
        if (norm.startsWith("@")) {
          const handle = norm.slice(1).replace(/["\\]/g, "\\$&").slice(0, 100);
          const sel = ":is(" + Cb_blockSurfaces + '):has(a[href^="/@' + handle + '" i])';
          convertedLines.push("youtube.com##" + sel);
          if (S.channelBlockerHideWatch) {
            convertedLines.push(
              'youtube.com##ytd-watch-flexy:has(ytd-video-owner-renderer a[href^="/@' + handle + '" i])'
            );
          }
        } else {

          const escaped = UBlockEngine.escapeRegex(norm).slice(0, 120);
          const scopeSel = S.channelBlockerMatchTitleText
            ? ja.join(",")
            : "ytd-channel-name a,#channel-name a,#owner-name a,ytd-video-owner-renderer a";
          const titleSel = ":is(" + Cb_blockSurfaces + '):has(:is(' + scopeSel + '):has-text(/' + escaped + '/i))';
          convertedLines.push("youtube.com##" + titleSel);
        }
      }
      const filterText = convertedLines.join("\n");
      const parsed = UBlockEngine.parseFilterList(filterText);


      let ublockStyle = document.getElementById("ytb-ublock-css");
      if (!ublockStyle) {
        ublockStyle = document.createElement("style");
        ublockStyle.id = "ytb-ublock-css";
        (document.head || document.documentElement).appendChild(ublockStyle);
      }
      // Bound per-scan procedural work: the block list is user-supplied and unbounded.
      const MAX_SCAN_FILTERS = 100;
      const scanProc = parsed.procFilters.slice(0, MAX_SCAN_FILTERS);
      const scanPaths = parsed.pathFilters.slice(0, MAX_SCAN_FILTERS);
      let procRunning = false;
      const runProcedural = async () => {
        if (procRunning || _a()) return;
        procRunning = true;
        try {
          UBlockEngine.applyProcedural(scanProc, scanPaths);
        } catch (_) {}
        procRunning = false;
      };
      const rebuildCSS = () => {
        try { ublockStyle.textContent = UBlockEngine.generateCSS(parsed.cssFilters); } catch (_) {}
        if (scanProc.length > 0 || scanPaths.length > 0) runProcedural();
      };
      rebuildCSS();


      const checkPathBlock = () => {
        let blocked = false;
        const path = (location.pathname || "").toLowerCase();
        for (const f of parsed.pathFilters) {
          if (f.domains.length && !UBlockEngine.hostMatches(f.domains)) continue;
          if (f.excludedDomains.length && UBlockEngine.hostMatches(f.excludedDomains)) continue;
          if (f.pathRegex && f.pathRegex.test(location.pathname || "/")) {
            blocked = true;
            break;
          }
        }

        if (!blocked) {
          const handles = Cb_parseList().filter(h => h.startsWith("@")).map(h => h.slice(1));
          for (const h of handles) {
            const p = "/@" + h.toLowerCase();
            if (path === p || path.startsWith(p + "/")) { blocked = true; break; }
          }
        }
        document.documentElement.classList.toggle("ytb-channel-path-blocked", blocked && !!S.channelBlockerHideBrowse);
      };
      checkPathBlock();
      e.addListener(window, "yt-navigate-finish", () => { checkPathBlock(); rebuildCSS(); });
      e.addListener(window, "popstate", () => { checkPathBlock(); rebuildCSS(); });


      const parsed0 = Cb_parseList();
      const legacyData = { handles: parsed0.filter(h => h.startsWith("@")).map(h => h.slice(1)), names: parsed0.filter(h => !h.startsWith("@")) };
      let scanning = false;
      const scanDOM = async () => {
        if (scanning || _a()) return;
        scanning = true;
        try {
          if (!document.hidden) {

            const anchors = document.querySelectorAll('a[href*="/@"],a[href^="/@"],a#channel-name,ytd-channel-name a,#channel-name a,#owner-name a');
            for (let i = 0; i < anchors.length; i++) {
              Wa(anchors[i]);
              if ((i + 1) % 80 === 0) await ne();
            }

            if (!o && (legacyData.handles.length > 0 || legacyData.names.length > 0)) {
              const items = document.querySelectorAll(Fa.join(","));
              for (let i = 0; i < items.length; i++) {
                const blocked = za(items[i], legacyData);
                items[i].classList.toggle("ytb-channel-blocked", blocked);
                if ((i + 1) % 80 === 0) await ne();
              }
            }
          }
        } finally { scanning = false; }
      };
      const tickScan = async () => { await scanDOM(); await runProcedural(); };
      tickScan().catch(err => m("channel blocker", err));
      e.addInterval(() => { e.addTimeout(tickScan, 800); }, 3000);


      if (document.body) {
        e.addObserver(document.body, e.debounce(() => { e.addTimeout(scanDOM, 500); }, 350), { childList: true, subtree: true });
      }


      if (!S.channelBlockerHideComments) {
        e.addStyle("ytd-comment-thread-renderer.ytb-channel-blocked,ytd-comment-thread-renderer.ytb-ublock-hidden{display:revert!important;visibility:revert!important;pointer-events:revert!important}");
      }


      Yt["channel-blocker"].push(() => {
        document.querySelectorAll(".ytb-channel-blocked").forEach(el => el.classList.remove("ytb-channel-blocked"));
        try { UBlockEngine.unhideAll(); } catch (_) {
          document.querySelectorAll(".ytb-ublock-hidden").forEach(el => el.classList.remove("ytb-ublock-hidden"));
        }
        document.documentElement.classList.remove("ytb-channel-path-blocked");
        const s = document.getElementById("ytb-ublock-css");
        if (s) s.remove();
      });
    },
    settings(e) {
      (e.appendChild(
        Ho(
          "Block list (one filter per line)",
          "channelBlockerList",
          "@SomeChannel\nAnother Channel Name\nyoutube.com##ytd-rich-item-renderer:has(a[href^=\"/@SomeChannel\" i])\nyoutube.com##:matches-path(/^\\/@SomeChannel/) ytd-browse",
        ),
      ),
        e.appendChild(
          To("div", "ytb-hist-note",
            "Supports plain channel names, @handles, full URLs, and uBlock Origin cosmetic filters. " +
            "Examples: youtube.com##selector:has(a[href^=\"/@channel\" i]), " +
            "youtube.com##:has-text(/pattern/i), " +
            "youtube.com##:matches-path(/regex/) selector. " +
            "Lines starting with ! or # are comments."
          ),
        ),
        e.appendChild(
          Io(
            "Also hide the watch page if I land on one of their videos",
            "channelBlockerHideWatch",
          ),
        ),
        e.appendChild(
          Io("Also hide the channel’s own page", "channelBlockerHideBrowse"),
        ),
        e.appendChild(
          Io("Also hide their comments", "channelBlockerHideComments"),
        ),
        e.appendChild(
          Io(
            "Also check video titles for these names (a little slower)",
            "channelBlockerMatchTitleText",
          ),
        ));
    },
  });
  function Za(e, t, a) {
    const n = new RegExp("([?&])" + t + "=[^&]*");
    return n.test(e)
      ? e.replace(n, "$1" + t + "=" + encodeURIComponent(a))
      : e + (e.indexOf("?") >= 0 ? "&" : "?") + t + "=" + encodeURIComponent(a);
  }
  // Removed in 1.3.0: Qa duplicated Dt; zero call sites.

  function rn(e, t) {
    return Lo(e, Bo(t));
  }
  (() => {
      try {
        const e = va.get("auto-pause");
        if (!e) return;
        const t = e.settings;
        e.settings = function (e) {
          try {
            t.call(this, e);
          } catch (e) {}
          e.appendChild(
            rn("Auto-resume when tab/window returns", "autoResumeAutoPausedOn"),
          );
        };
      } catch (e) {}
    })();
  xa.register({
      id: "keyword-filter",
      name: "Title Keyword Filter",
      summary: "Hides cards whose titles match your keyword list (CSS fast path + DOM matcher).",
      cat: "feed",
      masterKey: "keywordFilterOn",
      keys: ["keywordFilterOn", "keywordFilterList"],
      apply(e) {
        const clearHidden = () => {
          try {
            document.querySelectorAll("[data-ytb-kw-hidden]").forEach((el) => {
              delete el.dataset.ytbKwHidden;

            });
          } catch (_kwErr) {}
        };
        if (!S.keywordFilterOn) {
          clearHidden();
          return;
        }
        const t = (S.keywordFilterList || "")
          .split("\n")
          .map((e) => e.trim())
          .filter(Boolean);
        if (t.length) {
          e.addStyle("[data-ytb-kw-hidden]{display:none!important}");
          Yt["keyword-filter"].push(clearHidden);
          e.addStyle(
            t
              .map((e) => {
                const t = e.replace(/["\\]/g, "\\$&");
                // NOTE(1.3.0): pruned the `yt-lockup-view-model[title*=]` and
                // `:has(a[title*=])` branches — the 2026 lockup cards carry no
                // title attributes at all, so those selectors could never
                // match and only paid layout cost. Lockup cards are hidden by
                // the JS scan below; legacy renderers keep the instant CSS
                // path since #video-title still carries a title attribute.
                return (
                  'ytd-video-renderer:has(#video-title[title*="' +
                  t +
                  '" i]),ytd-compact-video-renderer:has(#video-title[title*="' +
                  t +
                  '" i]),ytd-rich-item-renderer:has(#video-title[title*="' +
                  t +
                  '" i]){display:none!important}'
                );
              })
              .join(""),
          );
          {
            const a = t.map((e) => e.toLowerCase()),
              n = () => {
                _a() ||
                  document
                    .querySelectorAll(
                      "ytd-video-renderer,ytd-compact-video-renderer,ytd-rich-item-renderer,yt-lockup-view-model",
                    )
                    .forEach((e) => {

                      const t = e.querySelector("#video-title") ||
                        e.querySelector(".ytLockupMetadataViewModelTitle") ||
                        e.querySelector(".yt-lockup-metadata-view-model__title") ||
                        e.querySelector("a[href*='/watch']");
                      if (!t) return;
                      const n = (t.title || t.textContent || "").normalize("NFC").toLowerCase();
                      const hit = a.some((k) => n.includes(k));
                      if (hit && !e.dataset.ytbKwHidden) {
                        e.dataset.ytbKwHidden = "1";

                      } else if (!hit && e.dataset.ytbKwHidden) {
                        delete e.dataset.ytbKwHidden;

                      }
                    });
              };
            (document.body &&
              e.addObserver(document.body, e.debounce(n, 250), {
                childList: !0,
                subtree: !0,
              }),
              n());
          }
        } else {
          clearHidden();
        }
      },
      settings(e) {
        e.appendChild(
          Ho("Keywords (one per line)", "keywordFilterList", "keyword"),
        );
      },
    });
  const dn = [
      ["DZ", "Algeria"],
      ["AR", "Argentina"],
      ["AU", "Australia"],
      ["AT", "Austria"],
      ["AZ", "Azerbaijan"],
      ["BH", "Bahrain"],
      ["BD", "Bangladesh"],
      ["BY", "Belarus"],
      ["BE", "Belgium"],
      ["BO", "Bolivia"],
      ["BA", "Bosnia & Herzegovina"],
      ["BR", "Brazil"],
      ["BG", "Bulgaria"],
      ["KH", "Cambodia"],
      ["CA", "Canada"],
      ["CL", "Chile"],
      ["CO", "Colombia"],
      ["CR", "Costa Rica"],
      ["HR", "Croatia"],
      ["CY", "Cyprus"],
      ["CZ", "Czech Republic"],
      ["DK", "Denmark"],
      ["DO", "Dominican Republic"],
      ["EC", "Ecuador"],
      ["EG", "Egypt"],
      ["SV", "El Salvador"],
      ["EE", "Estonia"],
      ["FI", "Finland"],
      ["FR", "France"],
      ["GE", "Georgia"],
      ["DE", "Germany"],
      ["GH", "Ghana"],
      ["GR", "Greece"],
      ["GT", "Guatemala"],
      ["HN", "Honduras"],
      ["HK", "Hong Kong"],
      ["HU", "Hungary"],
      ["IS", "Iceland"],
      ["IN", "India"],
      ["ID", "Indonesia"],
      ["IQ", "Iraq"],
      ["IE", "Ireland"],
      ["IL", "Israel"],
      ["IT", "Italy"],
      ["JM", "Jamaica"],
      ["JP", "Japan"],
      ["JO", "Jordan"],
      ["KZ", "Kazakhstan"],
      ["KE", "Kenya"],
      ["KW", "Kuwait"],
      ["LA", "Laos"],
      ["LV", "Latvia"],
      ["LB", "Lebanon"],
      ["LY", "Libya"],
      ["LI", "Liechtenstein"],
      ["LT", "Lithuania"],
      ["LU", "Luxembourg"],
      ["MO", "Macao"],
      ["MY", "Malaysia"],
      ["MT", "Malta"],
      ["MX", "Mexico"],
      ["ME", "Montenegro"],
      ["MA", "Morocco"],
      ["NP", "Nepal"],
      ["NL", "Netherlands"],
      ["NZ", "New Zealand"],
      ["NI", "Nicaragua"],
      ["NG", "Nigeria"],
      ["MK", "North Macedonia"],
      ["NO", "Norway"],
      ["OM", "Oman"],
      ["PK", "Pakistan"],
      ["PA", "Panama"],
      ["PG", "Papua New Guinea"],
      ["PY", "Paraguay"],
      ["PE", "Peru"],
      ["PH", "Philippines"],
      ["PL", "Poland"],
      ["PT", "Portugal"],
      ["PR", "Puerto Rico"],
      ["QA", "Qatar"],
      ["RO", "Romania"],
      ["RU", "Russia"],
      ["SA", "Saudi Arabia"],
      ["SN", "Senegal"],
      ["RS", "Serbia"],
      ["SG", "Singapore"],
      ["SK", "Slovakia"],
      ["SI", "Slovenia"],
      ["ZA", "South Africa"],
      ["KR", "South Korea"],
      ["ES", "Spain"],
      ["LK", "Sri Lanka"],
      ["SE", "Sweden"],
      ["CH", "Switzerland"],
      ["TW", "Taiwan"],
      ["TZ", "Tanzania"],
      ["TH", "Thailand"],
      ["TN", "Tunisia"],
      ["TR", "Turkey"],
      ["UG", "Uganda"],
      ["UA", "Ukraine"],
      ["AE", "United Arab Emirates"],
      ["GB", "United Kingdom"],
      ["US", "United States"],
      ["UY", "Uruguay"],
      ["VE", "Venezuela"],
      ["VN", "Vietnam"],
      ["YE", "Yemen"],
      ["ZW", "Zimbabwe"],
    ],
    cn = [
      ["af", "Afrikaans"],
      ["az", "Azerbaijani"],
      ["id", "Bahasa Indonesia"],
      ["ms", "Bahasa Malaysia"],
      ["bs", "Bosanski"],
      ["ca", "Català"],
      ["cs", "Čeština"],
      ["da", "Dansk"],
      ["de", "Deutsch"],
      ["et", "Eesti"],
      ["en-IN", "English (India)"],
      ["en-GB", "English (UK)"],
      ["en", "English (US)"],
      ["es", "Español (España)"],
      ["es-419", "Español (Latam)"],
      ["es-US", "Español (US)"],
      ["eu", "Euskara"],
      ["fil", "Filipino"],
      ["fr", "Français"],
      ["fr-CA", "Français (Canada)"],
      ["gl", "Galego"],
      ["hr", "Hrvatski"],
      ["zu", "IsiZulu"],
      ["is", "Íslenska"],
      ["it", "Italiano"],
      ["sw", "Kiswahili"],
      ["lv", "Latviešu"],
      ["lt", "Lietuvių"],
      ["hu", "Magyar"],
      ["nl", "Nederlands"],
      ["no", "Norsk"],
      ["uz", "O‘zbek"],
      ["pl", "Polski"],
      ["pt-PT", "Português"],
      ["pt", "Português (Brasil)"],
      ["ro", "Română"],
      ["sq", "Shqip"],
      ["sk", "Slovenčina"],
      ["sl", "Slovenščina"],
      ["sr-Latn", "Srpski"],
      ["fi", "Suomi"],
      ["sv", "Svenska"],
      ["vi", "Tiếng Việt"],
      ["tr", "Türkçe"],
      ["be", "Беларуская"],
      ["bg", "Български"],
      ["ky", "Кыргызча"],
      ["kk", "Қазақ"],
      ["mk", "Македонски"],
      ["mn", "Монгол"],
      ["ru", "Русский"],
      ["sr", "Српски"],
      ["uk", "Українська"],
      ["el", "Ελληνικά"],
      ["hy", "Հայերեն"],
      ["he", "עברית"],
      ["ur", "اردو"],
      ["ar", "العربية"],
      ["fa", "فارسی"],
      ["ne", "नेपाली"],
      ["mr", "मराठी"],
      ["hi", "हिन्दी"],
      ["bn", "বাংলা"],
      ["pa", "ਪੰਜਾਬੀ"],
      ["gu", "ગુજરાતી"],
      ["ta", "தமிழ்"],
      ["te", "తెలుగు"],
      ["kn", "ಕನ್ನಡ"],
      ["ml", "മലയാളം"],
      ["si", "සිංහල"],
      ["th", "ไทย"],
      ["lo", "ລາວ"],
      ["my", "မြန်မာ"],
      ["ka", "ქართული"],
      ["am", "አማርኛ"],
      ["km", "ខ្មែរ"],
      ["zh-CN", "中文 (简体)"],
      ["zh-TW", "中文 (繁體)"],
      ["zh-HK", "中文 (香港)"],
      ["ja", "日本語"],
      ["ko", "한국어"],
    ],
    sn = [
      "",
      "Pacific/Midway",
      "Pacific/Honolulu",
      "America/Anchorage",
      "America/Los_Angeles",
      "America/Denver",
      "America/Chicago",
      "America/New_York",
      "America/Caracas",
      "America/Halifax",
      "America/St_Johns",
      "America/Sao_Paulo",
      "Atlantic/South_Georgia",
      "Atlantic/Azores",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Europe/Helsinki",
      "Europe/Moscow",
      "Asia/Dubai",
      "Asia/Karachi",
      "Asia/Kolkata",
      "Asia/Dhaka",
      "Asia/Bangkok",
      "Asia/Shanghai",
      "Asia/Tokyo",
      "Australia/Sydney",
      "Pacific/Auckland",
    ];
  let ln = !1,
    pn = !1,
    un = !1,
    hn = !1,
    mn = null,
    yn = null,
    gn = null,
    fn = null,
    _origDtf = null,
    _origNf = null,
    _geoDtfWrapped = !1,
    _geoNfWrapped = !1,
    bn = { language: null, languages: null };
  function vn() {
    return (S.geoRegion || "US").toUpperCase();
  }
  function kn() {
    return S.geoLang || "en";
  }
  function xn() {
    return !!S.geoOverrideOn;
  }
  const wn = new Set([
    "/youtubei/v1/browse",
    "/youtubei/v1/search",
    "/youtubei/v1/guide",
    "/youtubei/v1/reel/reel_watch_sequence",
    "/youtubei/v1/notification/get_notification_menu",
    "/youtubei/v1/account/account_menu",
    "/youtubei/v1/comment/create_comment",
    "/youtubei/v1/comment/create_comment_reply",
    "/youtubei/v1/subscription/subscribe",
    "/youtubei/v1/subscription/unsubscribe",
    "/youtubei/v1/playlist/create",
    "/youtubei/v1/share/get_share_panel",
  ]);
  function Cn(e) {
    try {
      const t = new URL(e, /^https?:/i.test(e) ? void 0 : location.origin);
      return !!/(?:^|\.)youtube\.com$/.test(t.hostname) && wn.has(t.pathname);
    } catch (e) {
      return !1;
    }
  }
  function Sn(e) {
    if (!xn() || !e) return e;
    if (!Cn(e)) return e;
    try {
      const t = /^https?:/i.test(e),
        a = new URL(e, t ? void 0 : location.origin),
        n = vn(),
        r = kn();
      let o = !1;
      return (
        a.searchParams.has("gl") && (a.searchParams.set("gl", n), (o = !0)),
        a.searchParams.has("hl") && (a.searchParams.set("hl", r), (o = !0)),
        a.searchParams.has("persist_gl") &&
          (a.searchParams.set("persist_gl", "1"),
          a.searchParams.set("gl", n),
          (o = !0)),
        a.searchParams.has("persist_hl") &&
          (a.searchParams.set("persist_hl", "1"),
          a.searchParams.set("hl", r),
          (o = !0)),
        o ? (t ? a.toString() : a.pathname + a.search + a.hash) : e
      );
    } catch (t) {
      return e;
    }
  }
  function Tn(e, t) {
    if (!xn() || !e || "string" != typeof e) return e;
    if (t && !Cn(t)) return e;
    if (e.length > 5e5 || "{" !== e.charAt(0)) return e;
    try {
      const t = JSON.parse(e);
      let a = !1;
      if (t && t.context && t.context.client) {
        const e = t.context.client;
        ((e.gl = vn()),
          (e.hl = kn()),
          (a = !0),
          void 0 !== e.contentRegion && (e.contentRegion = vn()),
          void 0 !== e.region && (e.region = vn()),
          void 0 !== e.regionCode && (e.regionCode = vn()),
          void 0 !== e.userInterfaceLanguage &&
            (e.userInterfaceLanguage = kn()),
          void 0 !== e.acceptLanguage && (e.acceptLanguage = kn()),
          void 0 !== e.timeZone &&
            S.geoTimezone &&
            (e.timeZone = S.geoTimezone));
      }
      if (t && t.context && t.context.user) {
        const e = t.context.user;
        (void 0 !== e.gl && ((e.gl = vn()), (a = !0)),
          void 0 !== e.hl && ((e.hl = kn()), (a = !0)));
      }
      return (
        t && "string" == typeof t.gl && ((t.gl = vn()), (a = !0)),
        t && "string" == typeof t.hl && ((t.hl = kn()), (a = !0)),
        a ? JSON.stringify(t) : e
      );
    } catch (t) {
      return e;
    }
  }
  function On(e) {
    if (!e) return;
    const t = vn(),
      a = kn();
    try {
      ((e.gl = t),
        (e.hl = a),
        void 0 !== e.contentRegion && (e.contentRegion = t),
        void 0 !== e.region && (e.region = t),
        void 0 !== e.regionCode && (e.regionCode = t),
        void 0 !== e.geo && (e.geo = t),
        void 0 !== e.locale && (e.locale = a),
        void 0 !== e.acceptLanguage && (e.acceptLanguage = a),
        void 0 !== e.userInterfaceLanguage && (e.userInterfaceLanguage = a),
        S.geoTimezone && void 0 !== e.timeZone && (e.timeZone = S.geoTimezone));
    } catch (e) {}
  }
  // Only two dedicated locale cookies belong to this feature. Never clear or
  // rewrite YouTube's general PREF or its visitor/privacy state. Keep only the
  // locale rollback record (not a cookie snapshot) across reloads in this tab.
  const geoCookieKey = "yourtube.geo.locale-rollback";
  function geoCookie(name) {
    const part = document.cookie.split(/;\s*/).find((p) => p.startsWith(name + "="));
    return part === undefined ? null : part.slice(name.length + 1);
  }
  function geoRecord() {
    try { return JSON.parse(sessionStorage.getItem(geoCookieKey)) || {}; }
    catch (_) { return {}; }
  }
  function Mn() {
    if (!S.geoOverrideOn) return;
    try {
      const rec = geoRecord();
      for (const [key,val] of [["GL",vn()],["HL",kn()]]) {
        if (!/^[a-z0-9-]{1,35}$/i.test(val)) continue;
        const old = geoCookie(key);
        if (old === val || (old !== null && !/^[a-z0-9-]{0,35}$/i.test(old))) continue;
        // If YouTube changed a value since we wrote it, restore that choice.
        rec[key] = { before: rec[key] && rec[key].applied === old ? rec[key].before : old, applied: val };
        sessionStorage.setItem(geoCookieKey, JSON.stringify(rec));
        document.cookie = key + "=" + val + "; path=/; SameSite=Lax; Secure";
      }
    } catch (_) {}
  }
  function Ln() {
    try {
      const rec = geoRecord();
      for (const key of ["GL","HL"]) {
        const r = rec[key];
        if (!r || r.applied !== geoCookie(key)) continue;
        if (r.before === null) document.cookie = key + "=; path=/; max-age=0; SameSite=Lax; Secure";
        else if (/^[a-z0-9-]{0,35}$/i.test(r.before)) document.cookie = key + "=" + r.before + "; path=/; SameSite=Lax; Secure";
      }
      sessionStorage.removeItem(geoCookieKey);
    } catch (_) {}
  }
  function An() {
    const t = vn(),
      a = kn();
    try {
      if (e.ytcfg && e.ytcfg.set && e.ytcfg.get) {
        e.ytcfg.set({
          GL: t,
          HL: a,
          INNERTUBE_CONTEXT_GL: t,
          INNERTUBE_CONTEXT_HL: a,
        });
      }
    } catch (e) {}
    const n = [];
    try {
      e.yt && e.yt.config_ && n.push(e.yt.config_);
    } catch (e) {}
    try {
      e.ytcfg && e.ytcfg.data_ && n.push(e.ytcfg.data_);
    } catch (e) {}
    for (const e of n)
      try {
        ((e.GL = t),
          (e.HL = a),
          (e.INNERTUBE_CONTEXT_GL = t),
          (e.INNERTUBE_CONTEXT_HL = a),
          e.INNERTUBE_CONTEXT &&
            e.INNERTUBE_CONTEXT.client &&
            On(e.INNERTUBE_CONTEXT.client));
      } catch (e) {}
    try {
      if (e.ytcfg && e.ytcfg.get) {
        const t = e.ytcfg.get("INNERTUBE_CONTEXT");
        t && t.client && (On(t.client), e.ytcfg.set({ INNERTUBE_CONTEXT: t }));
      }
    } catch (e) {}
  }

  function En() {

    try {
      if (ln && mn) {
        e.fetch = mn;
        ln = !1;
      }
    } catch (_e) {}
  }
  function Bn() {

    try {
      if (pn && yn && gn) {
        XMLHttpRequest.prototype.open = yn;
        XMLHttpRequest.prototype.send = gn;
        pn = !1;
      }
    } catch (_e) {}
  }
  function Pn() {

    try {
      if (un && fn) {
        navigator.sendBeacon = fn;
        un = !1;
      }
    } catch (_e1) {}
  }
  function restoreGeoNavigator() {
    try {
      if (hn) {
        for (const key of ["language", "languages"]) {
          const descriptor = bn[key + "Descriptor"];
          if (descriptor) Object.defineProperty(navigator, key, descriptor);
          else delete navigator[key];
        }
        hn = !1;
      }
    } catch (_e2) {}
    try {
      if (_geoDtfWrapped && _origDtf && Intl.DateTimeFormat) {
        Intl.DateTimeFormat = _origDtf;
        _origDtf = null;
        _geoDtfWrapped = !1;
      }
      if (_geoNfWrapped && _origNf && Intl.NumberFormat) {
        Intl.NumberFormat = _origNf;
        _origNf = null;
        _geoNfWrapped = !1;
      }
    } catch (_e3) {}
  }
  let geoDocumentLanguage = null;
  function restoreGeoDocumentLanguage() {
    try {
      const el = document.documentElement, record = geoDocumentLanguage;
      if (el && record && el.getAttribute("lang") === record.applied) {
        if (record.before === null) el.removeAttribute("lang");
        else el.setAttribute("lang", record.before);
      }
    } finally { geoDocumentLanguage = null; }
  }
  function In() {
    (Mn(),
      An(),
      (function () {
        const t = vn(),
          a = kn();
        function n(e) {
          if (e) {
            try {
              const n = e.serviceTrackingParams || [];
              for (const e of n)
                for (const n of e.params || [])
                  (("GL" !== n.key && "gl" !== n.key) || (n.value = t),
                    ("HL" !== n.key && "hl" !== n.key) || (n.value = a),
                    ("cr" !== n.key && "region" !== n.key) || (n.value = t),
                    "locale" === n.key && (n.value = a));
            } catch (e) {}
            try {
              const n = e.webResponseContextExtensionData;
              n &&
                n.ytConfigData &&
                (void 0 !== n.ytConfigData.gl && (n.ytConfigData.gl = t),
                void 0 !== n.ytConfigData.hl && (n.ytConfigData.hl = a));
            } catch (e) {}
          }
        }
        try {
          n(e.ytInitialData && e.ytInitialData.responseContext);
        } catch (e) {}
        try {
          n(
            e.ytInitialPlayerResponse &&
              e.ytInitialPlayerResponse.responseContext,
          );
        } catch (e) {}
        try {
          n(e.ytPlayerConfig && e.ytPlayerConfig.responseContext);
        } catch (e) {}
      })(),
      (function () {
        try {
          const e = document.documentElement;
          if (e && xn() && e.getAttribute("lang") !== kn()) {
            const old = e.getAttribute("lang");
            const before = geoDocumentLanguage && geoDocumentLanguage.applied === old ? geoDocumentLanguage.before : old;
            geoDocumentLanguage = { before, applied: kn() };
            e.setAttribute("lang", kn());
          }
        } catch (e) {}
      })());
  }
  function Rn(e, t) {
    const a = To("div", "ytb-geo-sel"),
      n = document.createElement("input");
    ((n.type = "text"),
      (n.className = "ytb-inp ytb-geo-input"),
      (n.placeholder = "Type to search…"),
      (n.spellcheck = !1));
    const r = t.find((t) => t[0] === S[e]);
    ((n.value = r ? r[1] + " (" + r[0] + ")" : S[e] || ""),
      (n.dataset.code = S[e] || ""));
    const o = To("div", "ytb-geo-dd");
    function i(a) {
      o.replaceChildren();
      const r = (a || "").toLowerCase().trim(),
        i = (
          r
            ? t.filter(
                (e) =>
                  e[0].toLowerCase().includes(r) ||
                  e[1].toLowerCase().includes(r),
              )
            : t
        ).slice(0, 80);
      i.length
        ? i.forEach((t) => {
            const a = To("div", "ytb-geo-row");
            ((a.dataset.code = t[0]),
              a.appendChild(To("span", "ytb-geo-name", t[1])),
              a.appendChild(To("span", "ytb-geo-code", t[0])),
              t[0] === n.dataset.code && a.classList.add("selected"),
              a.addEventListener("mousedown", (a) => {
                (a.preventDefault(),
                  (n.value = t[1] + " (" + t[0] + ")"),
                  (n.dataset.code = t[0]),
                  (o.style.display = "none"),
                  Ta(e, t[0]));
              }),
              o.appendChild(a));
          })
        : o.appendChild(To("div", "ytb-geo-empty", "No matches"));
    }
    return (
      (o.style.display = "none"),
      n.addEventListener("focus", () => {
        (i(""), (o.style.display = "block"));
      }),
      n.addEventListener("blur", () => {
        setTimeout(() => {
          o.style.display = "none";
          const e = n.dataset.code,
            a = t.find((t) => t[0] === e);
          n.value = a ? a[1] + " (" + a[0] + ")" : e || "";
        }, 150);
      }),
      n.addEventListener("input", () => i(n.value)),
      n.addEventListener("keydown", (e) => {
        if ("Escape" !== e.key) {
          if ("Enter" === e.key) {
            const e = o.querySelector(".ytb-geo-row");
            return void (e && e.dispatchEvent(new MouseEvent("mousedown")));
          }
          if ("ArrowDown" === e.key || "ArrowUp" === e.key) {
            e.preventDefault();
            const t = Array.from(o.querySelectorAll(".ytb-geo-row"));
            if (!t.length) return;
            let a = t.findIndex((e) => e.classList.contains("hot"));
            (t.forEach((e) => e.classList.remove("hot")),
              (a =
                "ArrowDown" === e.key
                  ? (a + 1) % t.length
                  : a <= 0
                    ? t.length - 1
                    : a - 1),
              t[a].classList.add("hot"),
              t[a].scrollIntoView({ block: "nearest" }));
          }
        } else n.blur();
      }),
      So("cfg.changed", (a) => {
        if (a.key !== e) return;
        const r = t.find((t) => t[0] === S[e]);
        ((n.value = r ? r[1] + " (" + r[0] + ")" : S[e] || ""),
          (n.dataset.code = S[e] || ""));
      }),
      a.appendChild(n),
      a.appendChild(o),
      a
    );
  }
  function Nn(e) {
    e.replaceChildren();
    const t = (function () {
        const e = [];
        for (const [t, a] of ta)
          e.push({
            id: t,
            applies: a.applies,
            intervals: a.intervals,
            observers: a.observers,
            totalMs: a.totalMs,
            avgMs:
              a.intervals + a.applies
                ? a.totalMs / (a.intervals + a.applies)
                : 0,
            maxMs: a.maxMs,
            lastMs: a.lastMs,
            lastT: a.lastT,
          });
        return (e.sort((e, t) => t.totalMs - e.totalMs), e);
      })(),
      n = (function () {
        try {
          if (performance && performance.memory) {
            const e = performance.memory;
            return {
              used: e.usedJSHeapSize,
              total: e.totalJSHeapSize,
              limit: e.jsHeapSizeLimit,
            };
          }
        } catch (e) {}
        return null;
      })();
    if (n) {
      const t = To("div", "ytb-perf-mem"),
        r = (n.used / 1048576).toFixed(1),
        o = (n.total / 1048576).toFixed(1),
        i = (n.limit / 1048576).toFixed(0),
        d = ((n.used / n.limit) * 100).toFixed(1);
      (a(
        t,
        "<b>JS Heap</b>: " +
          r +
          " MB used - " +
          o +
          " MB allocated - " +
          i +
          " MB limit (" +
          d +
          "%)",
      ),
        e.appendChild(t));
      const c = To("div", "ytb-perf-membar"),
        s = To("div", "ytb-perf-memfill");
      ((s.style.width = Math.min(100, d) + "%"),
        n.used / n.limit > 0.8
          ? (s.style.background = "#e53935")
          : n.used / n.limit > 0.5 && (s.style.background = "#fb8c00"),
        c.appendChild(s),
        e.appendChild(c));
    } else
      e.appendChild(
        To(
          "div",
          "ytb-hist-note",
          "performance.memory not available in this browser (Firefox / privacy mode). Heap stats unavailable.",
        ),
      );
    const r = Xt,
      o = To("div", "ytb-perf-state");
    if (
      ((o.textContent =
        "Visible: " +
        (r.visible ? "yes" : "no") +
        " - Focused: " +
        (r.focused ? "yes" : "no") +
        " - Battery low: " +
        (r.batteryLow ? "yes" : "no") +
        " - Save-data: " +
        (r.saveData ? "yes" : "no") +
        " - Throttle ×" +
        Qt().toFixed(2)),
      e.appendChild(o),
      !t.length)
    )
      return void e.appendChild(
        To(
          "div",
          "ytb-hist-note",
          "No feature timings recorded yet. Profiler started when this toggle was enabled.",
        ),
      );
    const i = To("div", "ytb-perf-table"),
      d = To("div", "ytb-perf-row ytb-perf-hdr");
    (d.appendChild(To("span", "ytb-perf-c1", "Feature")),
      d.appendChild(To("span", "ytb-perf-c2", "Calls")),
      d.appendChild(To("span", "ytb-perf-c3", "Total")),
      d.appendChild(To("span", "ytb-perf-c4", "Avg")),
      d.appendChild(To("span", "ytb-perf-c5", "Max")),
      i.appendChild(d));
    for (const e of t.slice(0, 30)) {
      const t = To("div", "ytb-perf-row"),
        a = e.applies + e.intervals,
        n = Math.min(1, e.totalMs / 500);
      ((t.style.background =
        "rgba(" +
        Math.round(255 * n) +
        "," +
        Math.round(120 * (1 - n)) +
        "," +
        Math.round(60 * (1 - n)) +
        ",0.10)"),
        t.appendChild(To("span", "ytb-perf-c1", e.id)),
        t.appendChild(To("span", "ytb-perf-c2", String(a))),
        t.appendChild(To("span", "ytb-perf-c3", e.totalMs.toFixed(1) + " ms")),
        t.appendChild(To("span", "ytb-perf-c4", e.avgMs.toFixed(2) + " ms")),
        t.appendChild(To("span", "ytb-perf-c5", e.maxMs.toFixed(1) + " ms")),
        i.appendChild(t));
    }
    e.appendChild(i);
    const c = To("div", "ytb-rowb");
    (c.appendChild(Oo("Refresh", () => Nn(e))),
      c.appendChild(
        Oo(
          "Reset stats",
          () => {
            (ta.clear(), Nn(e));
          },
          "ytb-danger",
        ),
      ),
      e.appendChild(c));
  }
  (xa.register({
    id: "geo-override",
    name: "Geo Override",
    summary: "Changes YouTube client locale hints. It does not change your IP address or guarantee regional availability.",
      cat: "privacy",
    masterKey: "geoOverrideOn",
        keys: [
      "geoOverrideOn",
      "geoRegion",
      "geoLang",
      "geoTimezone",
      "geoPatchFetch",
      "geoPatchXHR",
      "geoPatchBeacon",
      "geoPatchNavigator",
    ],
    apply(t) {
        if (!S.geoOverrideOn) return (En(), Bn(), Pn(), restoreGeoNavigator(), restoreGeoDocumentLanguage(), void Ln());
        if (!S.geoPatchNavigator) restoreGeoNavigator();
      (!(function () {
        if (!hn && S.geoPatchNavigator) {
          hn = !0;
          try {
            bn.language = navigator.language;
            bn.languageDescriptor = Object.getOwnPropertyDescriptor(navigator, "language");
          } catch (e) {}
          try {
            bn.languages = navigator.languages;
            bn.languagesDescriptor = Object.getOwnPropertyDescriptor(navigator, "languages");
          } catch (e) {}
          try {
            (_xp.define(navigator, "language", {
              get: () => (xn() ? kn() : bn.language || "en"),
              configurable: !0,
              enumerable: !0,
            }),
              _xp.define(navigator, "languages", {
                get() {
                  if (!xn()) return _xp.clone(bn.languages || ["en"]);
                  const e = kn(),
                    t = e.split("-")[0];
                  return _xp.clone(t === e ? [e] : [e, t]);
                },
                configurable: !0,
                enumerable: !0,
              }));
          } catch (e) {}
          try {
            const e2 = Intl.DateTimeFormat;
            if (e2 && !_geoDtfWrapped) {
              const t = _xp.ctor(function (t, a) {
                return (xn() && !t && (t = kn()), new e2(t, a));
              });
              try { t.supportedLocalesOf = _xp.fn(e2.supportedLocalesOf.bind(e2)); } catch (e3) {}
              ((_origDtf = e2), (Intl.DateTimeFormat = t), (_geoDtfWrapped = !0));
            }
            const tf = Intl.NumberFormat;
            if (tf && !_geoNfWrapped) {
              const ef = _xp.ctor(function (e3, a) {
                return (xn() && !e3 && (e3 = kn()), new tf(e3, a));
              });
              try { ef.supportedLocalesOf = _xp.fn(tf.supportedLocalesOf.bind(tf)); } catch (e3) {}
              ((_origNf = tf), (Intl.NumberFormat = ef), (_geoNfWrapped = !0));
            }
          } catch (e) {}
        }
      })(),
        S.geoPatchFetch
          ? !ln &&
            S.geoPatchFetch &&
            ((ln = !0),
            (mn = e.fetch),
            (e.fetch = _xp.fn(function (e, t) {
              if (!xn() || !S.geoPatchFetch) return mn.call(this, e, t);
              try {
                if ("string" == typeof e && Cn(e)) {
                  const a = Sn(e);
                  if (t && t.body && "string" == typeof t.body) {
                    const a2 = Tn(t.body, e);
                    a2 !== t.body && (t = Object.assign({}, t, { body: a2 }));
                  }
                  return mn.call(this, a, t);
                }
              } catch (e2) {}
              return mn.call(this, e, t);
            })))
          : En(),
        S.geoPatchXHR
          ? !pn &&
            S.geoPatchXHR &&
            ((pn = !0),
            (yn = XMLHttpRequest.prototype.open),
            (gn = XMLHttpRequest.prototype.send),
            (XMLHttpRequest.prototype.open = _xp.fn(function () {
              try {
                xn() &&
                  S.geoPatchXHR &&
                  "string" == typeof arguments[1] &&
                  Cn(arguments[1]) &&
                  ((arguments[1] = Sn(arguments[1])), (this.__ytbGeoSafe = !0));
              } catch (e2) {}
              return yn.apply(this, arguments);
            })),
            (XMLHttpRequest.prototype.send = _xp.fn(function () {
              try {
                xn() &&
                  this.__ytbGeoSafe &&
                  "string" == typeof arguments[0] &&
                  "{" === arguments[0].charAt(0) &&
                  (arguments[0] = Tn(arguments[0]));
              } catch (e2) {}
              return gn.apply(this, arguments);
            })))
          : Bn(),
        S.geoPatchBeacon
          ? (function () {
              if (!un && S.geoPatchBeacon && navigator.sendBeacon) {
                un = !0;
                try {
                  fn = navigator.sendBeacon.bind(navigator);
                } catch (e) {
                  return void (un = !1);
                }
                navigator.sendBeacon = _xp.fn(function (e, t) {
                  try {
                    xn() &&
                      S.geoPatchBeacon &&
                      "string" == typeof e &&
                      Cn(e) &&
                      ((e = Sn(e)), "string" == typeof t && (t = Tn(t, e)));
                  } catch (e2) {}
                  return fn(e, t);
                });
              }
            })()
          : Pn(),
        In(),
        t.onNav(() => {
          for (const e of [100, 500, 1500])
            t.addTimeout(() => {
              (Mn(), An());
            }, e);
        }));
    },
    settings(e) {
      (e.appendChild(
        To("div", "ytb-lbl", "Region (" + dn.length + " available)"),
      ),
        e.appendChild(Rn("geoRegion", dn)),
        e.appendChild(
          To("div", "ytb-lbl", "Language (" + cn.length + " available)"),
        ),
        e.appendChild(Rn("geoLang", cn)),
        e.appendChild(
          Ro(
            "Timezone override",
            "geoTimezone",
            Object.fromEntries(
              [["", "(auto)"]].concat(sn.filter(Boolean).map((e) => [e, e])),
            ),
          ),
        ));
      const t = To("div", "ytb-geo-status");
      function a() {
        const e = vn(),
          a = kn(),
          n = (dn.find((t) => t[0] === e) || [e, e])[1],
          r = (cn.find((e) => e[0] === a) || [a, a])[1];
        t.textContent =
          "Active: " +
          n +
          " / " +
          r +
          " (gl=" +
          e +
          ", hl=" +
          a +
          ")" +
          (S.geoTimezone ? " tz=" + S.geoTimezone : "") +
          " | Patched: " +
          (ln ? "F" : "-") +
          (pn ? "X" : "-") +
          (un ? "B" : "-") +
          (hn ? "N" : "-");
      }
      (a(),
        So("cfg.changed", (e) => {
          e.key.startsWith("geo") && a();
        }),
        e.appendChild(t),
        e.appendChild(
          To("div", "ytb-elem-sec-title", "Interception Techniques"),
        ),
        e.appendChild(
          Io("Intercept fetch() requests (advanced)", "geoPatchFetch"),
        ),
        e.appendChild(Io("Intercept XMLHttpRequest (advanced)", "geoPatchXHR")),
        e.appendChild(Io("Intercept sendBeacon (advanced)", "geoPatchBeacon")),
        e.appendChild(
          Io("Match browser language and time formatting", "geoPatchNavigator"),
        ),
        e.appendChild(To("div", "ytb-elem-sec-title", "Actions")));
      const n = To("div", "ytb-rowb");
      (n.appendChild(
        Oo(
          "Re-apply all now",
          () => {
            if (S.geoOverrideOn) { In(); pe("Country settings re-applied.", 1500, "success"); }
          },
          "primary",
        ),
      ),
        n.appendChild(
          Oo(
            "Turn off locale override",
            () => {
              (Ta("geoOverrideOn", false),
                pe(
                  "Locale interception is off. Existing YouTube content and client state may still reflect the previous locale.",
                  2500,
                  "info",
                ));
            },
            "ytb-danger",
          ),
        ),
        e.appendChild(n),
        e.appendChild(
          To(
            "div",
            "ytb-hist-note",
            "Updates supported client locale hints immediately and optionally intercepts selected requests. Existing content may not change; the IP address, account region and server-side availability are not changed. Disabling restores script-owned language and locale cookies where possible, but cannot undo all YouTube client state.",
          ),
        ));
    },
  }),

    xa.register({
      id: "diag-console",
      name: "Integration Debug Console",
      summary: "Local integration status, failures and observed YouTube client changes.",
      cat: "tools",
      masterKey: "diagConsole",
      keys: ["diagConsole"],
      apply(ctx) {
        if (!S.diagConsole) return;
        const host = document.createElement("pre");
        host.id = "ytb-diag";
        host.setAttribute("aria-label", "Integration debug console");
        document.body?.appendChild(host);
        const render = () => {
          host.textContent = IntegrationDiagnostics.entries().map(item =>
            new Date(item.at).toLocaleTimeString() + " [" + item.integration + "] " + item.state + (item.detail ? " — " + item.detail : "")
          ).join("\n") || "No integration events yet.";
        };
        ctx.addListener(document, "visibilitychange", render);
        const offStatus = g.on("integration.status", render), offClear = g.on("integration.cleared", render);
        render();
        Yt["diag-console"].push(() => { offStatus(); offClear(); host.remove(); });
      },
      settings(panel) {
        panel.appendChild(To("div", "ytb-hist-note", "Reports integration status and observed YouTube client versions in this browser. Version changes are not proof that an API changed."));
        panel.appendChild(Oo("Clear session log", () => IntegrationDiagnostics.clear()));
      },
    }),


    xa.register({
      id: "remove-redirect-urls",
      name: "Redirect Bypass",
      summary: "Rewrites /redirect tracker URLs to their targets.",
      cat: "privacy",
      masterKey: "removeRedirectUrlsOn",
      keys: ["removeRedirectUrlsOn"],
      apply(e) {
        if (!S.removeRedirectUrlsOn) return;
        const t = (a) => {
          if (!a || a.tagName !== "A") return;
          const n = a.getAttribute("href") || "";
          if (!n || !n.includes("/redirect")) return;
          try {
            const r = new URL(n, location.href);
            if (r.pathname !== "/redirect" || !(n.startsWith("/redirect?") ||
                /^(?:www\.|m\.)?youtube\.com$/i.test(r.hostname))) return;
            const dest = new URL(r.searchParams.get("q") || "");
            if (["https:", "http:"].includes(dest.protocol) && dest.href !== r.href)
              a.setAttribute("href", dest.href);
          } catch (e) {}
        };
        const n = new MutationObserver((e) => {
          for (const a of e)
            if (a.type === "attributes" && a.attributeName === "href") t(a.target);
            else if (a.type === "childList")
              for (const e of a.addedNodes) {
                if (e.nodeType !== 1) continue;
                if (e.tagName === "A") t(e);
                if (e.querySelectorAll) e.querySelectorAll("a[href]").forEach(t);
              }
        });
        n.observe(document.body || document.documentElement, {
          childList: !0,
          subtree: !0,
          attributes: !0,
          attributeFilter: ["href"],
        });
        document.querySelectorAll && document.querySelectorAll("a[href]").forEach(t);
        Yt["remove-redirect-urls"].push(() => {
          try {
            n.disconnect();
          } catch (e) {}
        });
      },
      settings(e) {
        e.appendChild(Io("Replace /redirect links with their real URLs", "removeRedirectUrlsOn"));
      },
    }),
    xa.register({
      id: "shorten-share-url",
      name: "Share Link Shortener",
      summary: "Strips ?si= and ?feature= tracking from copied links.",
      cat: "privacy",
      masterKey: "shortenShareUrlOn",
      keys: ["shortenShareUrlOn"],
      apply(e) {
        if (!S.shortenShareUrlOn) return;
        const t = (a) => {
          if (!a || a.tagName !== "A") return;

          const n = a.getAttribute("href") || "";
          if (!/^https?:\/\/youtu\.be\//i.test(n)) return;
          try {
            const r = new URL(n);
            const keep = new Set(["t", "list", "index", "start", "pp"]);
            for (const key of Array.from(r.searchParams.keys())) {
              if (!keep.has(key)) r.searchParams.delete(key);
            }
            // Idempotent even if YouTube reuses this anchor for the next video.
            if (r.href !== n) a.setAttribute("href", r.href);
          } catch (e) {}
        };
        const a = new MutationObserver((e) => {
          for (const a of e)
            if (a.type === "attributes" && a.attributeName === "href") t(a.target);
            else if (a.type === "childList")
              for (const e of a.addedNodes) {
                if (e.nodeType !== 1) continue;
                if (e.tagName === "A") t(e);
                if (e.querySelectorAll) e.querySelectorAll("a[href]").forEach(t);
              }
        });
        a.observe(document.body || document.documentElement, {
          childList: !0,
          subtree: !0,
          attributes: !0,
          attributeFilter: ["href"],
        });
        document.querySelectorAll && document.querySelectorAll("a[href]").forEach(t);
        Yt["shorten-share-url"].push(() => {
          try {
            a.disconnect();
          } catch (e) {}
        });
      },
      settings(e) {
        e.appendChild(Io("Clean up youtu.be share links", "shortenShareUrlOn"));
      },
    }),
    xa.register({
      id: "skip-paused-continue",
      name: "Auto-Confirm Pause Prompt",
      summary: "Confirms YouTube's 'Video paused. Continue watching?' dialog automatically.",
      cat: "playback",
      masterKey: "skipPausedContinueOn",
      keys: ["skipPausedContinueOn"],
      apply(e) {

        if (!S.skipPausedContinueOn) return;
        const run = e.debounce(() => {
          const btn = _ytbPausedDialogConfirmBtn();
          if (btn) {
            try {
              btn.click();
            } catch (err) {}
          }
        }, 250);
        const host =
          document.querySelector("ytd-popup-container") ||
          document.body ||
          document.documentElement;
        e.addObserver(host, run, { childList: !0, subtree: !0 });
        run();
      },
      settings(e) {
        e.appendChild(Io("Auto-click 'Continue watching' in the paused-video dialog", "skipPausedContinueOn"));
      },
    }),

    xa.register({
      id: "default-channel-tab",
      name: "Channel Default Tab",
      summary: "Opens channel root pages on your chosen tab; deep links stay unchanged.",
      cat: "channels",
      masterKey: "channelLandingTab",
      settingsAlways: true,
      isOn: () => String(S.channelLandingTab || "home") !== "home",
      keys: ["channelLandingTab"],
      apply(ctx) {
        const tabs = { videos: "/videos", shorts: "/shorts", live: "/streams", playlists: "/playlists", community: "/community", about: "/about" };
        const run = () => {
          try {
            const tab = tabs[String(S.channelLandingTab || "home")];
            if (!tab) return;
            const path = location.pathname;
            if (!/^\/(?:@[^/]+|channel\/[^/]+|c\/[^/]+|user\/[^/]+)(?:\/featured)?\/?$/.test(path)) return;
            const base = path.replace(/\/featured\/?$/, "").replace(/\/$/, "");
            location.replace(base + tab);
          } catch (_) {}
        };
        run();
        ctx.onNav(() => { run(); ctx.addTimeout(run, 300); });
      },
      settings(panel) {
        panel.appendChild(Ro("Open channels on", "channelLandingTab", {
          home: "Home (default)", videos: "Videos", shorts: "Shorts", live: "Live",
          playlists: "Playlists", community: "Community", about: "About",
        }));
        panel.appendChild(To("div", "ytb-hist-note", "Applies to channel root links, not deep links. Redirecting to a different tab navigates the page."));
      },
    }),

    xa.register({
      id: "hide-top-live-games",
      name: "Hide Gaming Shelves",
      summary: "Removes 'Top live games' carousels from feeds.",
      cat: "feed",
      masterKey: "hideTopLiveGamesOn",
      keys: ["hideTopLiveGamesOn"],
      apply(ctx) {
        if (!S.hideTopLiveGamesOn) return;
        const owned = new Map();
        const scan = () => {
          for (const node of document.querySelectorAll("ytd-shelf-renderer")) {
            if (owned.has(node)) continue;
            const title = node.querySelector("h2");
            if (title && /top live games/i.test(title.textContent || "")) {
              owned.set(node, node.style.display);
              node.style.display = "none";
            }
          }
          for (const node of owned.keys()) if (!node.isConnected) owned.delete(node);
        };
        scan();
        if (document.body) ctx.addObserver(document.body, ctx.debounce(scan, 300), {childList:true, subtree:true});
        Yt["hide-top-live-games"].push(() => {
          for (const [node, previous] of owned) if (node.style.display === "none") node.style.display = previous;
          owned.clear();
        });
      },
      settings(e) {
        e.appendChild(Io("Hide the 'Top live games' shelf on Home", "hideTopLiveGamesOn"));
      },
    }),

    xa.register({
      id: "update-check",
      name: "Update Check",
      summary: "Background check for new YourTube releases; disabled in Maximum privacy.",
      cat: "privacy",
      masterKey: "updateCheckOn",
      keys: ["updateCheckOn", "updateCheckHours", "safeMode", "privacyPreset"],
      apply(ctx) {
        if (!S.updateCheckOn || S.safeMode || S.privacyPreset === "maximum") {
          document.getElementById("ytb-update-banner")?.remove(); return;
        }
        const check = () => Fu(false);
        if (liveApplyDepth) check(); else ctx.addTimeout(check, 60000);
        ctx.addInterval(check, Math.max(6, Math.min(168, Number(S.updateCheckHours) || 24)) * 3600000);
      },
      settings(e) {
        (e.appendChild(Io("Check for updates in the background", "updateCheckOn")),
          e.appendChild(
            Ro("Check every", "updateCheckHours", {
              6: "6 hours",
              12: "12 hours",
              24: "Daily",
              72: "Every 3 days",
              168: "Weekly",
            }),
          ));
      },
    }),
    xa.register({
      id: "auto-recover-video",
      name: "Playback Recovery",
      summary: "Rebuilds the player when it stalls after a network drop.",
      cat: "playback",
      masterKey: "autoRecoverOn",
      keys: ["autoRecoverOn"],
      apply(e) {
        if (!S.autoRecoverOn) return;
        const t = () => {
          if (!navigator.onLine) return;
          const a = ie.el && ie.el();
          if (!a) return;
          if (a.paused) {
            a.play().catch(() => {});
            pe("Network restored - resuming video", 2000, "success");
          }
        };
        e.addListener(window, "online", t);
        Yt["auto-recover-video"].push(() => {});
      },
      settings(e) {
        e.appendChild(Io("Auto-resume the video when internet comes back", "autoRecoverOn"));
      },
    }),
    xa.register({
      id: "background-players-pause",
      name: "Pause Hidden Tabs",
      summary: "Pauses playback in tabs that lose visibility; resumes on return.",
      cat: "playback",
      masterKey: "bgPlayersPauseOn",
      keys: ["bgPlayersPauseOn"],
      apply(e) {
        if (!S.bgPlayersPauseOn) return;
        let t = null;
        const a = () => {
          if (document.visibilityState === "visible") {
            t && (clearTimeout(t), (t = null));
            return;
          }
          t = setTimeout(() => {
            const n = ie.el && ie.el();
            if (n && !n.paused && !n.ended) {
              try {
                if (typeof gr !== "undefined" && gr) gr.autoPaused = !0;
              } catch (_) {}
              n.pause();
            }
          }, 500);
        };
        e.addListener(document, "visibilitychange", a);
        Yt["background-players-pause"].push(() => {
          t && clearTimeout(t);
        });
      },
      settings(e) {
        e.appendChild(Io("Pause the video when the tab is hidden", "bgPlayersPauseOn"));
      },
    }),
    xa.register({
      id: "forward-rewind-buttons",
      name: "Seek Buttons",
      summary: "Player-bar jump buttons with configurable step size.",
      cat: "playback",
      masterKey: "forwardRewindOn",
      keys: ["forwardRewindOn", "forwardRewindSec"],
      apply(e) {
        if (!S.forwardRewindOn) return;
        const t = () => {
          if (!S.forwardRewindOn) return;
          const r = document.querySelector("#movie_player .ytp-left-controls, .html5-video-player .ytp-left-controls");
          if (!r || r.querySelector(".ytb-fr-btn")) return;
          const o = ie.el && ie.el();
          if (!o) return;
          const s = Math.max(1, Number(S.forwardRewindSec) || 10);
          const i = document.createElement("button");
          (i.type = "button"),
            (i.className = "ytp-button ytb-extra-btn ytb-fr-btn ytb-fr-rewind"),
            (i.title = "Rewind " + s + " seconds"),
            i.setAttribute("aria-label", "Rewind " + s + " seconds"),
            a(
              i,
              wr('<svg viewBox="0 0 36 36" fill="currentColor"><path d="M12.5,17.5l10,10l0,-20l-10,10z M2.5,17.5l10,10l0,-20l-10,10z"/></svg>'),
            ),
            i.addEventListener(
              "click",
              (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                try {
                  o.currentTime = Math.max(0, o.currentTime - s);
                } catch (e) {}
              },
              !0,
            );
          const l = document.createElement("button");
          (l.type = "button"),
            (l.className = "ytp-button ytb-extra-btn ytb-fr-btn ytb-fr-forward"),
            (l.title = "Forward " + s + " seconds"),
            l.setAttribute("aria-label", "Forward " + s + " seconds"),
            a(
              l,
              wr('<svg viewBox="0 0 36 36" fill="currentColor"><path d="M23.5,17.5l-10,-10l0,20l10,-10z M13.5,17.5l-10,-10l0,20l10,-10z"/></svg>'),
            ),
          l.addEventListener(
            "click",
            (ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              try {
                if (!_isLiveStream()) o.currentTime = Math.min(o.duration || 1e9, o.currentTime + s);
              } catch (e) {}
            },
            !0,
          );
          const c = r.querySelector(".ytp-play-button");
          const d = c && c.parentNode === r ? c.nextSibling : null;
          d && d.parentNode === r ? r.insertBefore(i, d) : r.appendChild(i);
          d && d.parentNode === r ? r.insertBefore(l, d) : r.appendChild(l);
        };
        t();
        Mr("forward-rewind-buttons", t);
        e.onNav(() => e.addTimeout(t, 700));
        Yt["forward-rewind-buttons"].push(() => {
          document.querySelectorAll(".ytb-fr-btn").forEach((e) => e.remove());
        });
      },
      settings(e) {
        (e.appendChild(Io("Show forward and rewind buttons in the player", "forwardRewindOn")),
          e.appendChild(
            No("Step (seconds)", "forwardRewindSec", 1, 120, 1, (e) => e + "s"),
          ));
      },
    }),

    void 0);
  (
    void 0);
  const Dn = 36e5;
  function qn(e) {
    return Math.floor((e ?? Date.now()) / Dn);
  }
  const Vn = { h: -1, down: 0, up: 0, reqs: 0, hosts: {} };
  let Fn = 0,
    jn = !1,
    zn = null,
    Wn = null,
    Un = null,
    Kn = null,
    Yn = null;
  const Gn = { sessionDown: 0, sessionUp: 0, sessionReqs: 0 };
  function Xn(e) {
    try {
      return new URL(e, location.origin).host;
    } catch (e) {
      return location.host;
    }
  }
  function Zn(e) {
    return (
      !!e &&
      (e.endsWith("youtube.com") ||
        e.endsWith("ytimg.com") ||
        e.endsWith("googlevideo.com") ||
        e.endsWith("ggpht.com") ||
        e.endsWith("youtu.be") ||
        e.endsWith("youtube-nocookie.com"))
    );
  }
  function Qn(e) {
    if (!e) return 0;
    try {
      if ("string" == typeof e) return new Blob([e]).size;
      if (e instanceof Blob) return e.size;
      if (e instanceof ArrayBuffer) return e.byteLength;
      if (ArrayBuffer.isView(e)) return e.byteLength;
      if (e instanceof FormData) {
        let t = 0;
        for (const [a, n] of e)
          ((t += a.length),
            "string" == typeof n
              ? (t += n.length)
              : n && n.size && (t += n.size));
        return t;
      }
      if (e instanceof URLSearchParams) return e.toString().length;
    } catch (e) {}
    return 0;
  }
  const Jn = {
    160: "144p",
    133: "240p",
    134: "360p",
    135: "480p",
    136: "720p",
    137: "1080p",
    138: "2160p",
    264: "1440p",
    266: "2160p",
    298: "720p60",
    299: "1080p60",
    303: "1080p",
    304: "1440p",
    305: "2160p",
    308: "1440p60",
    278: "144p",
    242: "240p",
    243: "360p",
    244: "480p",
    247: "720p",
    248: "1080p",
    271: "1440p",
    313: "2160p",
    315: "2160p60",
    272: "4320p",
    139: "AAC-48k",
    140: "AAC-128k",
    141: "AAC-256k",
    171: "Vorbis-128k",
    249: "Opus-50k",
    250: "Opus-70k",
    251: "Opus-160k",
    18: "360p-mux",
    22: "720p-mux",
    37: "1080p-mux",
    59: "480p-mux",
    43: "360p-webm",
  };
  function $n(e, t, a, n) {
    if (!e || !Zn(e)) return;
    const r = qn();
    if (
      (Vn.h !== r && (tr(), (Vn.h = r)),
      t > 0 && ((Vn.down += t), (Gn.sessionDown += t)),
      a > 0 && ((Vn.up += a), (Gn.sessionUp += a)),
      (Vn.reqs += 1),
      (Gn.sessionReqs += 1),
      (Vn.hosts[e] = (Vn.hosts[e] || 0) + (t + a)),
      S.netQualityAttribOn &&
        n &&
        (e.endsWith("googlevideo.com") || e.endsWith("ytimg.com")))
    ) {
      const e = (function (e) {
        if (!e) return null;
        const t = String(e).match(/[?&]itag=(\d+)/);
        return t ? t[1] : null;
      })(n);
      if (e) {
        const n = (function (e) {
          if (!e) return "other";
          if (/AAC|Opus|Vorbis/.test(e)) return "audio";
          const t = e.match(/(\d{3,4})p/);
          if (!t) return "other";
          const a = parseInt(t[1], 10);
          return a >= 2160
            ? "4K+"
            : a >= 1440
              ? "1440p"
              : a >= 1080
                ? "1080p"
                : a >= 720
                  ? "720p"
                  : a >= 480
                    ? "480p"
                    : a >= 360
                      ? "360p"
                      : "240p-";
        })(
          (function (e) {
            return Jn[String(e)] || "itag-" + e;
          })(e),
        );
        ((Vn.qualities = Vn.qualities || {}),
          (Vn.qualities[n] = (Vn.qualities[n] || 0) + (t + a)));
      }
    }
    ((jn = !0),
      Fn || (Fn = setTimeout(er, 5e3)),
      S.netMonitorBadge && hr(),
      S.netBudgetOn &&
        (function () {
          const e = Date.now();
          e - sr < 3e4 ||
            ((sr = e),
            (async function () {
              if (!cr) {
                cr = !0;
                try {
                  const e = await lr(),
                    t = 1024 * (Number(S.netBudgetGB) || 0) * 1024 * 1024;
                  if (t <= 0) return;
                  const a = e / t,
                    n = new Date().toISOString().slice(0, 7),
                    r = (S.netBudgetAlerted && S.netBudgetAlerted[n]) || {},
                    o = (t, a, n) => {
                      r[t] ||
                        ((r[t] = Date.now()),
                        pe(
                          "[!] Bandwidth budget " +
                            a +
                            " - " +
                            or(e) +
                            " / " +
                            S.netBudgetGB +
                            " GB",
                          4500,
                          n || "error",
                        ));
                    };
                  a >= 1
                    ? o("100", "EXCEEDED", "error")
                    : a >= 0.95
                      ? o("95", "at 95%", "error")
                      : a >= 0.8 && o("80", "at 80%", "info");
                  const i = Object.assign({}, S.netBudgetAlerted || {});
                  i[n] = r;
                  const d = Object.keys(i).sort();
                  for (; d.length > 6; ) delete i[d.shift()];
                  JSON.stringify(i) !==
                    JSON.stringify(S.netBudgetAlerted || {}) &&
                    Ta("netBudgetAlerted", i);
                } finally {
                  cr = !1;
                }
              }
            })());
        })());
  }
  async function er() {
    if (((Fn = 0), !jn || Vn.h < 0)) return;
    jn = !1;
    const e = {
      h: Vn.h,
      down: Vn.down,
      up: Vn.up,
      reqs: Vn.reqs,
      hosts: Object.assign({}, Vn.hosts),
      qualities: Vn.qualities ? Object.assign({}, Vn.qualities) : null,
    };
    try {
      const t = await v("netBuckets", e.h),
        a = t
          ? {
              h: e.h,
              down: (t.down || 0) + e.down,
              up: (t.up || 0) + e.up,
              reqs: (t.reqs || 0) + e.reqs,
              hosts: t.hosts || {},
              qualities: t.qualities || {},
            }
          : {
              h: e.h,
              down: e.down,
              up: e.up,
              reqs: e.reqs,
              hosts: {},
              qualities: {},
            };
      if (t) {
        for (const t in e.hosts) a.hosts[t] = (a.hosts[t] || 0) + e.hosts[t];
        if (e.qualities)
          for (const t in e.qualities)
            a.qualities[t] = (a.qualities[t] || 0) + e.qualities[t];
      } else ((a.hosts = e.hosts), (a.qualities = e.qualities || {}));
      (await k("netBuckets", a),
        (Vn.down = 0),
        (Vn.up = 0),
        (Vn.reqs = 0),
        (Vn.hosts = {}),
        (Vn.qualities = null),
        g.emit("net.updated"));
    } catch (e) {
      h("net flush failed", e);
    }
  }
  function tr() {
    !jn || Vn.h < 0 || er();
  }
  async function ar(e, t) {
    return new Promise((a) => {
      b().then((n) => {
        if (!n) return a([]);
        try {
          const r = n
              .transaction("netBuckets", "readonly")
              .objectStore("netBuckets"),
            o = IDBKeyRange.bound(e, t),
            i = r.getAll(o);
          ((i.onsuccess = () => a(i.result || [])), (i.onerror = () => a([])));
        } catch (e) {
          a([]);
        }
      });
    });
  }
  async function nr() {
    return w("netBuckets");
  }
  async function rr() {
    (await C("netBuckets"),
      (Vn.h = -1),
      (Vn.down = 0),
      (Vn.up = 0),
      (Vn.reqs = 0),
      (Vn.hosts = {}),
      (Gn.sessionDown = 0),
      (Gn.sessionUp = 0),
      (Gn.sessionReqs = 0),
      g.emit("net.updated"));
  }
  function or(e) {
    return !e || e < 0
      ? "0 B"
      : e < 1024
        ? e + " B"
        : e < 1048576
          ? (e / 1024).toFixed(1) + " KB"
          : e < 1073741824
            ? (e / 1048576).toFixed(2) + " MB"
            : (e / 1073741824).toFixed(2) + " GB";
  }
  function ir(e) {
    const t = Date.now();
    let a;
    switch (e) {
      case "hour":
        a = t - 36e5;
        break;
      case "day":
        a = t - 864e5;
        break;
      case "week":
        a = t - 6048e5;
        break;
      case "month":
        a = t - 2592e6;
        break;
      case "year":
        a = t - 31536e6;
        break;
      default:
        a = 0;
    }
    return { from: qn(a), to: qn(t) };
  }
  async function dr(e) {
    const { from: t, to: a } = ir(e),
      n = "all" === e ? await nr() : await ar(t, a);
    let r = 0,
      o = 0,
      i = 0;
    const d = {},
      c = {};
    for (let e = 0; e < n.length; e++) {
      const t = n[e];
      if (((r += t.down || 0), (o += t.up || 0), (i += t.reqs || 0), t.hosts))
        for (const e in t.hosts) d[e] = (d[e] || 0) + t.hosts[e];
      if (t.qualities)
        for (const e in t.qualities) c[e] = (c[e] || 0) + t.qualities[e];
    }
    if ("all" === e || (Vn.h >= t && Vn.h <= a)) {
      ((r += Vn.down), (o += Vn.up), (i += Vn.reqs));
      for (const e in Vn.hosts) d[e] = (d[e] || 0) + Vn.hosts[e];
      if (Vn.qualities)
        for (const e in Vn.qualities) c[e] = (c[e] || 0) + Vn.qualities[e];
    }
    return {
      down: r,
      up: o,
      reqs: i,
      total: r + o,
      hosts: Object.entries(d)
        .sort((e, t) => t[1] - e[1])
        .slice(0, 8),
      qualities: Object.entries(c).sort((e, t) => t[1] - e[1]),
      bucketCount: n.length,
    };
  }
  let cr = !1,
    sr = 0;
  async function lr() {
    const { from: e, to: t } = (function () {
        const e = new Date();
        return {
          from: qn(
            new Date(e.getFullYear(), e.getMonth(), 1, 0, 0, 0, 0).getTime(),
          ),
          to: qn(Date.now()),
          label: e.toLocaleString([], { month: "long", year: "numeric" }),
        };
      })(),
      a = await ar(e, t);
    let n = 0;
    for (const e of a) n += (e.down || 0) + (e.up || 0);
    return (Vn.h >= e && Vn.h <= t && (n += Vn.down + Vn.up), n);
  }
  async function pr(e, t) {
    const { from: a, to: n } = ir(e),
      r = "all" === e ? await nr() : await ar(a, n);
    if ("all" === e && 0 === r.length) return [];
    const o = r.slice().sort((e, t) => e.h - t.h);
    let i = "all" === e ? (o[0] ? o[0].h : qn()) : a,
      d = "all" === e ? (o[o.length - 1] ? o[o.length - 1].h : qn()) : n;
    i > d && (i = d);
    const c = d - i + 1,
      s = Math.min(t || 60, Math.max(1, c)),
      l = Math.max(1, Math.ceil(c / s)),
      p = [];
    for (let e = 0; e < s; e++) {
      const t = Math.min(d, i + e * l),
        a = Math.min(d, t + l - 1);
      p.push({ from: t, to: a, down: 0, up: 0 });
    }
    for (const e of o) {
      const t = Math.min(p.length - 1, Math.floor((e.h - i) / l));
      ((p[t].down += e.down || 0), (p[t].up += e.up || 0));
    }
    if (Vn.h >= i && Vn.h <= d) {
      const e = Math.min(p.length - 1, Math.floor((Vn.h - i) / l));
      ((p[e].down += Vn.down), (p[e].up += Vn.up));
    }
    return p;
  }
  let ur = null;
  function hr() {
    S.netMonitorOn && S.netMonitorBadge
      ? (ur ||
          ((ur = document.createElement("div")),
          (ur.id = "ytb-net-badge"),
          (ur.title = "YourTube session network: dn down / up up"),
          document.body && document.body.appendChild(ur)),
        ur &&
          a(
            ur,
            '<span class="ytb-net-badge-dn">dn ' +
              or(Gn.sessionDown) +
              '</span><span class="ytb-net-badge-sep">-</span><span class="ytb-net-badge-up">up ' +
              or(Gn.sessionUp) +
              "</span>",
          ))
      : ur && (ur.remove(), (ur = null));
  }
  function mr() {
    try { if (zn) { e.fetch = zn; zn = null; } } catch (_) {}
    try { if (Wn) { XMLHttpRequest.prototype.open = Wn; Wn = null; } } catch (_) {}
    try { if (Un) { XMLHttpRequest.prototype.send = Un; Un = null; } } catch (_) {}
    try { if (Kn) { navigator.sendBeacon = Kn; Kn = null; } } catch (_) {}

    (Fn && (clearTimeout(Fn), (Fn = 0)),
      tr(),
      (function () {
        if (Yn) {
          try {
            Yn.disconnect();
          } catch (e) {}
          Yn = null;
        }
      })(),
      ur && (ur.remove(), (ur = null)));
  }


  try {
    (window.addEventListener(
      "pagehide",
      () => {
        try {
          tr();
        } catch (e) {}
      },
      { capture: !0 },
    ),
      document.addEventListener(
        "visibilitychange",
        () => {
          if ("hidden" === document.visibilityState)
            try {
              tr();
            } catch (e) {}
        },
        { capture: !0 },
      ));
  } catch (e) {}
  function yr() {
    const e = ie.el(),
      t = ie.api();
    if (e) {
      try {
        e.pause();
      } catch (e) {}
      try {
        t && t.pauseVideo && t.pauseVideo();
      } catch (e) {}
      try {
        e.currentTime = 0;
      } catch (e) {}
      try {
        (t && "function" == typeof t.seekTo && t.seekTo(0, !0),
          t && "function" == typeof t.stopVideo && t.stopVideo());
      } catch (e) {}
      try {
        const t = e.src;
        (e.removeAttribute("src"),
          e.load(),
          setTimeout(() => {
            try {
              t && (e.src = t);
            } catch (e) {}
            try {
              (e.pause(), (e.currentTime = 0));
            } catch (e) {}
          }, 50));
      } catch (e) {}
      pe("⏹ Stopped", 1200, "info");
    } else pe("No video element", 1200, "error");
  }
  (

    (0),


    xa.register({
      id: "player-dashboard-button",
      name: "Player Launcher Button",
      summary: "Adds a YourTube dashboard button to the player bar.",
      cat: "playback",
      masterKey: "playerDashButtonOn",
      keys: ["playerDashButtonOn"],
      apply(e) {
        const t = () =>
          document
            .querySelectorAll(".ytb-plus-dash-btn")
            .forEach((e) => e.remove());
        if (!S.playerDashButtonOn) return void t();
        const n = () => {
          const e =
            document.querySelector("#movie_player .ytp-right-controls") ||
            document.querySelector(".html5-video-player .ytp-right-controls");
          if (!e || e.querySelector(".ytb-plus-dash-btn")) return;
          const t = document.createElement("button");
          ((t.type = "button"),
            (t.className = "ytb-btn ytb-plus-dash-btn"),
            (t.title = "Open YourTube"),
            t.setAttribute("aria-label", "Open YourTube"),
            a(
              t,
              '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>',
            ),
            t.addEventListener(
              "click",
              (e) => {
                (e.preventDefault(), e.stopPropagation(), Uo());
              },
              !0,
            ));
          const n = e.querySelector(".ytp-settings-button"),
            r = n && n.parentNode === e ? n : e.firstChild;
          r ? e.insertBefore(t, r) : e.appendChild(t);
        };
        (e.addStyle(
          "#movie_player .ytb-plus-dash-btn{color:#fff!important;opacity:.9!important;display:inline-flex!important;align-items:center!important;justify-content:center!important}#movie_player .ytb-plus-dash-btn:hover{opacity:1!important;color:#ff4e45!important}#movie_player .ytb-plus-dash-btn svg{width:22px;height:22px;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(0,0,0,.55))}",
        ),
          n(),
          Mr("player-dashboard-button", n),
          e.onNav(() => {
            e.addTimeout(n, 700);
          }),
          Yt["player-dashboard-button"].push(t));
      },
      settings() {},
    }),
    xa.register({
      id: "stop-button",
      name: "Stop Button",
      summary: "Player-bar stop: halts playback and releases the stream buffer.",
      cat: "playback",
      masterKey: "stopButtonOn",
      keys: ["stopButtonOn"],
      apply(e) {
        const t = () =>
          document.querySelectorAll(".ytb-stop-btn").forEach((e) => e.remove());
        if (!S.stopButtonOn) return void t();
        xr();
        const n = () => {
          const e =
            document.querySelector("#movie_player .ytp-left-controls") ||
            document.querySelector(".html5-video-player .ytp-left-controls");
          if (!e || e.querySelector(".ytb-stop-btn")) return;
          const t = document.createElement("button");
          ((t.type = "button"),
            (t.className = "ytb-btn ytb-extra-btn ytb-stop-btn"),
            (t.title = "Stop the video and rewind to the start"),
            t.setAttribute("aria-label", "Stop the video"),
            a(
              t,
              wr(
                '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>',
              ),
            ),
            t.addEventListener(
              "click",
              (e) => {
                (e.preventDefault(), e.stopPropagation(), yr());
              },
              !0,
            ));
          const n = e.querySelector(".ytp-play-button"),
            r = n && n.parentNode === e ? n.nextSibling : null;
          r && r.parentNode === e ? e.insertBefore(t, r) : e.appendChild(t);
        };
        (n(),
          Mr("stop-button", n),
          e.onNav(() => {
            e.addTimeout(n, 700);
          }),
          Yt["stop-button"].push(t));
      },
      settings(e) {
        (e.appendChild(Eo([Oo("Stop now", yr, "primary")])),
          e.appendChild(
            To(
              "div",
              "ytb-hist-note",
              "Unlike Pause (which keeps the buffer ready), Stop tears down the media source, releasing all buffered video/audio data. YouTube re-fetches from the start if you press Play afterwards. Useful when you're done watching and want to free RAM/bandwidth without closing the tab.",
            ),
          ));
      },
    }),
    xa.register({
      id: "hero-artwork-heal",
      name: "Channel Hero Fix",
      summary: "Re-binds featured-video artwork on channel pages when YouTube's preview fails.",
      cat: "appearance",
      masterKey: "heroHealOn",
      settingsAlways: true,
      isOn: () => !!S.heroHealOn || String(S.channelBannerMode || "default") !== "default",
      keys: ["heroHealOn", "channelBannerMode"],
      apply(ctx) {
      const mode = String(S.channelBannerMode || "default");
      const page = 'ytd-browse[page-subtype="channels"] ';
      if ("scroll" === mode) {
        ctx.addStyle(
          page + "app-header#header.style-scope.ytd-c4-tabbed-header-renderer," +
          page + "tp-yt-app-header#header.style-scope.ytd-c4-tabbed-header-renderer," +
          page + "#page-header-banner.style-scope.ytd-tabbed-page-header," +
          page + "ytd-tabbed-page-header #page-header-banner," +
          page + "yt-page-header-renderer #page-header-banner," +
          page + "yt-image-banner-view-model{" +
          "transform:none!important;position:absolute;left:0!important;top:0;margin-top:0}",
        );
      } else if ("hide" === mode) {
        ctx.addStyle(
          page + "div#contentContainer.style-scope.app-header-layout{padding-top:148px!important}" +
          page + "div#contentContainer.style-scope.app-header{height:148px!important}" +
          page + "div.banner-visible-area.style-scope.ytd-c4-tabbed-header-renderer," +
          page + "div.page-header-banner.style-scope.ytd-c4-tabbed-header-renderer," +
          page + "#page-header-banner.style-scope.ytd-tabbed-page-header," +
          page + "ytd-tabbed-page-header #page-header-banner," +
          page + "yt-page-header-renderer #page-header-banner," +
          page + "yt-image-banner-view-model{display:none!important}" +
          page + "tp-yt-app-header#header.ytd-tabbed-page-header{transform:none!important;position:absolute!important;left:0!important;margin-top:0!important}",
        );
      }
        if (!S.heroHealOn) return;

        let active = true;
        const checks = new WeakMap(), healed = new WeakSet(), originals = new WeakMap();
        Yt["hero-artwork-heal"].push(() => {
          active = false;
          for (const hero of document.querySelectorAll("[data-ytb-hero-art]")) {
            const saved = originals.get(hero);
            if (!saved) continue;
            delete hero.dataset.ytbHeroArt;
            if (hero.style.backgroundImage !== saved.written) continue;
            if (hero.dataset.ytbInjectedHero === "1") hero.remove();
            else {
              hero.style.backgroundImage = saved.image;
              if (hero.style.backgroundSize === "cover") hero.style.backgroundSize = saved.size;
              if (hero.style.backgroundPosition === "center center" || hero.style.backgroundPosition === "center") hero.style.backgroundPosition = saved.position;
            }
          }
        });
        const QUAL = ["maxresdefault", "sddefault", "hqdefault"];
        const preload = (url) =>
          new Promise((res) => {
            try {
              const im = new Image();
              let done = false;
              const finish = (ok) => { if (!done) { done = true; res(!!ok); } };
              im.onload = () => finish(im.naturalWidth >= 640);
              im.onerror = () => finish(false);
              im.src = url;
              ctx.addTimeout(() => finish(false), 9000);
            } catch (_) {
              res(false);
            }
          });

        const ensureHero = (panel) => {
          let hero = panel.querySelector("#hero");
          if (hero) return hero;
          const item = panel.closest("ytd-carousel-item-renderer") || panel;
          const ir = item.getBoundingClientRect();
          hero = document.createElement("div");
          hero.id = "hero";
          hero.className = "style-scope ytd-default-promo-panel-renderer";
          hero.dataset.ytbInjectedHero = "1";
          panel.insertBefore(hero, panel.firstChild);

          const cs = getComputedStyle(hero);
          const hr = hero.getBoundingClientRect();
          if (cs.position === "static" || hr.width < Math.min(300, ir.width * 0.3)) {
            hero.style.position = "absolute";
            hero.style.top = "0";
            hero.style.bottom = "0";
            hero.style.right = "0";
            hero.style.left = Math.round(ir.width * 0.4) + "px";
          }
          return hero;
        };
        const heal = async (panel) => {
          try {
            if (!active || !panel.isConnected || healed.has(panel)) return;
            const item = panel.closest("ytd-carousel-item-renderer") || panel;
            const ir = item.getBoundingClientRect();
            if (ir.width < 600 || ir.height < 200) return;
            let hero = panel.querySelector("#hero");
            const cs = hero ? getComputedStyle(hero) : null;
            const hasBg = !!(cs && cs.backgroundImage && cs.backgroundImage !== "none");
            const v = panel.querySelector("video");
            const videoAlive = !!(v && (v.readyState >= 1 || v.currentSrc || v.poster));
            if (hasBg || videoAlive) { healed.add(panel); return; }

            const count = (checks.get(panel) || 0) + 1;
            checks.set(panel, count);
            if (count < 2) return;
            const a = panel.querySelector('a[href*="watch?v="]');
            if (!a) return;
            let id = "";
            try { id = new URL(a.href, location.href).searchParams.get("v") || ""; } catch (_) {}
            if (!/^[\w-]{6,}$/.test(id)) return;
            for (const q of QUAL) {
              const url = "https://i.ytimg.com/vi/" + id + "/" + q + ".jpg";
              const loaded = await preload(url);
              if (!active || !panel.isConnected || healed.has(panel) || !panel.contains(a) || new URL(a.href).searchParams.get("v") !== id) return;
              if (loaded) {
                hero = ensureHero(panel);
                const saved = { image: hero.style.backgroundImage, size: hero.style.backgroundSize, position: hero.style.backgroundPosition };
                originals.set(hero, saved);
                hero.dataset.ytbHeroArt = "1";
                hero.style.backgroundImage = 'url("' + url + '")';
                saved.written = hero.style.backgroundImage;
                hero.style.backgroundSize = "cover";
                hero.style.backgroundPosition = "center";
                healed.add(panel);
                try { pe("✨ Restored channel hero artwork", 2200, "success"); } catch (_) {}
                return;
              }
            }
          } catch (_) {}
        };
        const seen = new WeakSet();
        const scan = () => {
          try {
            const panels = document.querySelectorAll("ytd-default-promo-panel-renderer");
            panels.forEach((panel) => {
              if (seen.has(panel)) return;
              seen.add(panel);
              [2500, 6000, 11000].forEach((ms) => ctx.addTimeout(() => heal(panel), ms));
            });
          } catch (_) {}
        };
        scan();
        ctx.addTimeout(scan, 3000);
        ctx.onNav(scan);
        if (document.body) {
          ctx.addObserver(document.body, ctx.debounce(scan, 500), { childList: true, subtree: true });
        }
      },
      settings(en) {
        en.appendChild(Io("Self-heal broken channel hero artwork", "heroHealOn"));
        en.appendChild(Ro("Banner behaviour", "channelBannerMode", { default: "Default", scroll: "Scroll it away", hide: "Hide it entirely" }));
      },
    }),
    xa.register({
      id: "disable-video-previews",
      name: "Disable Hover Previews",
      summary: "Blocks thumbnail hover autoplay.",
      cat: "feed",
      masterKey: "disableVideoPreviewsOn",
      keys: ["disableVideoPreviewsOn"],
      apply(e) {
        S.disableVideoPreviewsOn &&
          e.addStyle(
            [
              "ytd-moving-thumbnail-renderer,ytd-video-preview,ytd-thumbnail-overlay-loading-preview-renderer{display:none!important;visibility:hidden!important;pointer-events:none!important}",
              "ytd-thumbnail video,ytd-rich-grid-media video:not(.html5-main-video),ytd-compact-video-renderer video:not(.html5-main-video),ytd-video-renderer video:not(.html5-main-video),ytd-grid-video-renderer video:not(.html5-main-video){display:none!important}",
            ].join("\n"),
          );
      },
      settings() {},
    }),

    Ha(
      "always-progress-bar",
      "Persistent Seek Bar",
      "Keeps the seek bar and progress line visible when controls fade.",
      "alwaysShowProgressBar",
      ".ytp-autohide .ytp-chrome-bottom{opacity:1!important;visibility:visible!important;pointer-events:auto!important;bottom:0!important;padding-bottom:0!important;margin-bottom:0!important}.ytp-autohide .ytp-chrome-controls{opacity:0!important;visibility:hidden!important;pointer-events:none!important;height:0!important;min-height:0!important;padding:0!important;margin:0!important;overflow:hidden!important;position:absolute!important}.ytp-autohide .ytp-progress-bar-container{opacity:1!important;visibility:visible!important;bottom:0!important}",
    "playback"
    ),
    xa.register({
      id: "redirect-shorts",
      name: "Shorts → Player",
      summary: "Opens Shorts URLs in the standard player.",
      cat: "playback",
      masterKey: "redirectShortsOn",
      keys: ["redirectShortsOn"],
      apply(e) {
        if (!S.redirectShortsOn) return;
        const t = () => {
          const e = location.pathname.match(/^\/shorts\/([\w-]+)/);
          if (e && e[1]) {
            const t = "/watch?v=" + e[1],
              a = location.search.replace("?", "&");
            location.replace(t + a);
          }
        };
        (t(), e.onNav(() => setTimeout(t, 100)));
      },
      settings() {},
    }),

    xa.register({
      id: "disable-autoplay",
      name: "Disable Autoplay",
      summary: "Blocks automatic playback of the next video.",
      cat: "playback",
      masterKey: "disableAutoplayOn",
      keys: ["disableAutoplayOn"],
      apply(e) {
        if (!S.disableAutoplayOn) return;
        const t = () => {
          if ("/watch" !== location.pathname) return;
          const e = document.querySelector(".ytp-autonav-toggle-button");
          if (e && "true" === e.getAttribute("aria-checked"))
            try {
              e.click();
            } catch (e) {}
          try {
            const e = document.querySelector(
              "ytd-compact-autoplay-renderer #toggle",
            );
            if (e) {
              const t = e.querySelector("tp-yt-paper-toggle-button");
              if (
                t &&
                (t.checked ||
                  t.active ||
                  "true" === t.getAttribute("aria-pressed"))
              )
                try {
                  t.click();
                } catch (e) {}
            }
          } catch (e) {}
        };
        (t(),
          e.onNav(() => {
            for (const a of [500, 1500, 3e3]) e.addTimeout(t, a);
          }));
      },
      settings() {},
    }));
  const gr = {
    autoPaused: !1,
    topBar: null,
    remainingBadge: null,
    clockBadge: null,
    endWarn: null,
    notesPanel: null,
    chapterBtns: null,
  };
  function fr(e) {
    try {
      const t = e.querySelector('a[href*="watch?v="],a[href^="/shorts/"]');
      if (!t) return "";
      const a = new URL(t.href, location.href);
      return a.pathname.startsWith("/shorts/")
        ? a.pathname.split("/")[2] || ""
        : a.searchParams.get("v") || "";
    } catch (e) {
      return "";
    }
  }
  function br(e) {
    const t = e.querySelector(
      "ytd-thumbnail-overlay-time-status-renderer span, #text.ytd-thumbnail-overlay-time-status-renderer, ytd-thumbnail-overlay-time-status-renderer, .yt-badge-shape__text, .yt-badge-shape-wiz__text",
    );
    return (function (e) {
      const t = String(e || "")
        .trim()
        .split(":")
        .map(Number);
      return !t.length || t.some((e) => !isFinite(e))
        ? 0
        : t.reduce((e, t) => 60 * e + t, 0);
    })(t && t.textContent);
  }
  function vr(e) {
    return (e.textContent || "").replace(/\s+/g, " ").trim();
  }
  let kr = !1;
  function xr() {
    if (!kr) {
      kr = !0;
      try {
        const e = document.head || document.documentElement;
        if (!e) return;
        const t = document.createElement("style");
        ((t.id = "ytb-extra-button-style"),
          (t.textContent = [
            ".ytb-extra-btn{",
            "display:inline-flex;align-items:center;justify-content:center;",
            "width:48px;height:48px;min-width:48px;padding:0;margin:0;",
            "vertical-align:top;background:transparent;border:0;outline:0;",
            "cursor:pointer;opacity:.92;transition:opacity .12s;",
            "color:#fff;",
            "}",
            ".ytb-extra-btn:hover,.ytb-extra-btn:focus-visible{opacity:1}",
            ".ytb-extra-btn:focus-visible{outline:2px solid #3ea6ff;outline-offset:-4px;border-radius:4px}",
            ".ytb-extra-btn svg{",
            "display:block;width:28px;height:28px;",
            "fill:currentColor;color:inherit;pointer-events:none;",
            "}",
            ".ytb-extra-btn.is-active{color:#3ea6ff}",
            ".ytp-small-mode .ytb-extra-btn{width:36px;height:36px;min-width:36px}",
            ".ytp-small-mode .ytb-extra-btn svg{width:22px;height:22px}",
          ].join("")),
          e.appendChild(t));
      } catch (e) {}
    }
  }
  function wr(e) {
    let t = String(e || "").trim();
    return t
      ? (/viewBox\s*=/i.test(t) ||
          (t = t.replace(/<svg\b/i, '<svg viewBox="0 0 24 24"')),
        (t = t.replace(
          /<svg\b([^>]*?)\s(width|height)\s*=\s*"[^"]*"/gi,
          "<svg$1",
        )),
        (t = t.replace(
          /<svg\b([^>]*?)\s(width|height)\s*=\s*'[^']*'/gi,
          "<svg$1",
        )),
        /aria-hidden\s*=/i.test(t) ||
          (t = t.replace(
            /<svg\b/i,
            '<svg aria-hidden="true" focusable="false"',
          )),
        t)
      : '<svg viewBox="0 0 24 24"></svg>';
  }
  function Cr(e, t, n, r) {
    xr();
    const o =
      ca("#movie_player .ytp-right-controls", 1e3) ||
      ca(".html5-video-player .ytp-right-controls", 1e3);
    if (!o) return null;
    let i = o.querySelector("." + e);
    if (i) return i;
    ((i = document.createElement("button")),
      (i.type = "button"),
      (i.className = "ytb-btn ytb-extra-btn " + e),
      (i.title = t),
      i.setAttribute("aria-label", t),
      i.setAttribute("data-tooltip-target-id", "ytb-tooltip"),
      a(i, wr(n)),
      i.addEventListener(
        "click",
        (t) => {
          (t.preventDefault(), t.stopPropagation());
          try {
            r(t);
          } catch (t) {
            try {
              h("extra-btn " + e, t);
            } catch (e) {}
          }
        },
        !0,
      ));
    const d = o.querySelector(
        ".ytb-plus-dash-btn,.ytp-settings-button,.ytp-miniplayer-button",
      ),
      c = d && d.parentNode === o ? d : o.firstChild;
    return (c ? o.insertBefore(i, c) : o.appendChild(i), i);
  }
  const Sr = new Set();
  let Tr = null;
  function Or() {
    if (Sr.size && document.querySelector("#movie_player .ytp-right-controls"))
      for (const e of Sr)
        try {
          e();
        } catch (e) {
          m("playerInstaller", e);
        }
  }
  function Mr(e, t) {
    const a = () => t();
    (Sr.add(a),
      (function () {
        if (Tr) return;
        const e = document.querySelector("#movie_player") || document.body;
        e &&
          ((Tr = new MutationObserver(ee(Or, 300))),
          Tr.observe(e, { childList: !0, subtree: !0 }));
      })(),
      pa(Or),
      (Yt[e] = Yt[e] || []),

      Yt[e].push(() => {
        Sr.delete(a);
        if (!Sr.size && Tr) {
          try {
            Tr.disconnect();
          } catch (e) {}
          Tr = null;
        }
      }));
  }
  function Lr(e) {
    document.querySelectorAll(e).forEach((e) => {
      try {
        e.remove();
      } catch (e) {}
    });
  }
  function Ar() {
    const e = ie.videoId(),
      t = ie.el();
    if (!e) return location.href;
    const a = t ? Math.floor(t.currentTime || 0) : 0;
    return (
      "https://www.youtube.com/watch?v=" +
      encodeURIComponent(e) +
      (a > 0 ? "&t=" + a : "")
    );
  }
  function Er(e) {
    const t = ie.el();
    if (!t) return;
    const a = (function () {
      try {
        return Jr ? Jr() : [];
      } catch (e) {
        return [];
      }
    })();
    if (!a.length) return;
    const n = t.currentTime;
    let r = null;
    ((r =
      e > 0
        ? a.find((e) => e.t > n + 1)
        : a
            .slice()
            .reverse()
            .find((e) => e.t < n - 1)),
      r && !_isLiveStream() && (t.currentTime = r.t));
  }
  async function Br(e) {
    const t = (function (e) {
      const t = "channel" === e ? Ne() || ie.channel() : ie.videoId();
      return t ? "note:" + e + ":" + t : "";
    })(e);
    if (!t)
      return void pe("Nothing to write notes about right now.", 1200, "error");
    gr.notesPanel && gr.notesPanel.remove();
    const n = await v("kv", t),
      r = document.createElement("div");
    ((r.id = "ytb-extra-notes"),
      a(
        r,
        '<div class="ytb-extra-notes-head"><b>' +
          ("channel" === e ? "Channel notes" : "Video notes") +
          '</b><button type="button">×</button></div><textarea></textarea><div class="ytb-rowb"><button type="button" class="ytb-btn primary">Save</button><button type="button" class="ytb-btn">Delete</button></div>',
      ));
    const o = r.querySelector("textarea");
    ((o.value = n && n.v ? n.v : ""),
      (r.querySelector(".ytb-extra-notes-head button").onclick = () =>
        r.remove()),
      (r.querySelector(".ytb-btn.primary").onclick = async () => {
        (await k("kv", { k: t, v: o.value, updatedAt: Date.now() }),
          pe("Note saved", 1200, "success"));
      }),
      (r.querySelectorAll(".ytb-btn")[1].onclick = async () => {
        (await x("kv", t), (o.value = ""), pe("Note deleted.", 1200, "info"));
      }),
      document.body.appendChild(r),
      (gr.notesPanel = r));
  }
  let Pr = !1,
    _feedWatched = { at: 0, ids: null };
  async function Ir() {
    if (Pr || !Xt.visible) return;
    const t = !!S.highlightLongVideosOn,
      a = !!S.highlightShortVideosOn,
      n = !!S.hideLiveContentOn,
      r = !!S.hidePremieresOn,
      o = S.feedDimWatchedOn || S.feedHideWatchedOn;
    if (t || a || n || r || o)
      if (!liveApplyDepth && performance.now() - Zt < 250) ae(Ir, 400);
      else {
        Pr = !0;
        try {
          const i = Array.from(
              document.querySelectorAll(
                "ytd-rich-item-renderer,ytd-video-renderer,ytd-compact-video-renderer,ytd-grid-video-renderer,yt-lockup-view-model:not(ytd-rich-item-renderer *)",
              ),
            ),
            c = Number(S.longVideoMinSec) || 1200,
            s = Number(S.shortVideoMaxSec) || 60;
          let watched = null;
          if (o) {
            if (!_feedWatched.ids || Date.now() - _feedWatched.at > 15000) {
              try {
                const rows = await Ie();
                _feedWatched = {
                  at: Date.now(),
                  ids: new Set(
                    (rows || [])
                      .filter((row) => row && row.videoId && (row.completed || (row.progress || 0) > 90))
                      .map((row) => row.videoId),
                  ),
                };
              } catch (_) {
                _feedWatched = { at: Date.now(), ids: new Set() };
              }
            }
            watched = _feedWatched.ids;
          }
          for (let l = 0; l < i.length; l++) {
            const p = i[l],
              u = fr(p);
            const h = t || a ? br(p) : 0;
            p.classList.toggle("ytb-extra-long", S.highlightLongVideosOn && h >= c);
            p.classList.toggle("ytb-extra-short", S.highlightShortVideosOn && h > 0 && h <= s);
            if (n || r) {
              const e = vr(p);
              (n &&
                p.classList.toggle(
                  "ytb-extra-live",
                  S.hideLiveContentOn && /\bLIVE\b|watching now|live now/i.test(e),
                ),
                r &&
                  p.classList.toggle(
                    "ytb-extra-premiere",
                    S.hidePremieresOn && /premiere|premieres/i.test(e),
                  ));
            } else {
              p.classList.remove("ytb-extra-live", "ytb-extra-premiere");
            }
            if (u && o && watched) {
              const isWatched = watched.has(u);
              p.classList.toggle("ytb-extra-watched-dim", isWatched && !!S.feedDimWatchedOn);
              p.classList.toggle("ytb-extra-watched-hide", isWatched && !!S.feedHideWatchedOn);
            } else if (u) {
              p.classList.remove("ytb-extra-watched-dim", "ytb-extra-watched-hide");
            }
            (l + 1) % 40 == 0 && (await ne());
          }
        } finally {
          Pr = !1;
        }
      }
  }
  let _feedScanPending = 0;
  const Rr = () => {
    if (liveApplyDepth) { Ir().catch(err => m("feed refresh", err)); return; }
    if (_feedScanPending) return;
    _feedScanPending = 1;
    ae(() => {
      _feedScanPending = 0;
      Ir();
    }, 1200);
  };
  (xa.register({
    id: "auto-pause",
    name: "Auto Pause",
    summary: "Pauses on tab hide or window blur; configurable masking.",
      cat: "playback",
    masterKey: "autoPauseMode",
    keys: ["autoPauseMode", "autoPauseHiddenOn", "autoPauseBlurOn"],
    isOn: () => S.autoPauseMode && "off" !== S.autoPauseMode,
    apply(e) {
      const t = S.autoPauseMode || "off";
      "off" !== t &&
        (("hidden" !== t && "both" !== t) ||
          e.addListener(document, "visibilitychange", () => {
            const e = ie.el();
            document.hidden &&
              e &&
              !e.paused &&
              ((gr.autoPaused = !0), ie.pause());
          }),
        ("blur" !== t && "both" !== t) ||
          e.addListener(window, "blur", () => {
            const e = ie.el();
            e && !e.paused && ((gr.autoPaused = !0), ie.pause());
          }));
    },
    settings(e) {
      e.appendChild(
        Ro("Mode", "autoPauseMode", {
          off: "Off",
          hidden: "When tab is hidden",
          blur: "When window loses focus",
          both: "Both (hidden or unfocused)",
        }),
      );
    },
  }),
    xa.register({
      id: "auto-resume-autopaused",
      name: "Auto Resume",
      summary: "Resumes playback that was paused by tab visibility.",
      cat: "playback",
      masterKey: "autoResumeAutoPausedOn",
      keys: ["autoResumeAutoPausedOn"],
      apply(e) {
        if (!S.autoResumeAutoPausedOn) return;
        const t = () => {
          const e = ie.el();
          !document.hidden &&
            gr.autoPaused &&
            e &&
            e.paused &&
            ((gr.autoPaused = !1), e.play().catch(() => {}));
        };
        (e.addListener(document, "visibilitychange", t),
          e.addListener(window, "focus", t));
      },
      settings() {},
    }),
    (0),
    xa.register({
      id: "top-progress-bar",
      name: "Top Progress Bar",
      summary: "Thin progress strip pinned to the viewport top during playback.",
      cat: "playback",
      masterKey: "topProgressBarOn",
      keys: ["topProgressBarOn"],
      apply(e) {
        if (!S.topProgressBarOn) return void Lr("#ytb-extra-topbar");
        const t = document.createElement("div");
        ((t.id = "ytb-extra-topbar"), document.body.appendChild(t));
        let a = -1;
        const n = () => {
            const e = ie.el(),
              n =
                e && e.duration
                  ? Math.min(100, (e.currentTime / e.duration) * 100)
                  : 0,
              r = Math.round(10 * n) / 10;
            return (
              r !== a &&
              ((a = r),
              pa(() => {
                t.style.width = r + "%";
              }),
              !0)
            );
          },
          boundEls = new WeakSet(),
          r = ie.el();
        (r &&
          (boundEls.add(r),
          e.addListener(r, "timeupdate", n),
          e.addListener(r, "seeked", n),
          e.addListener(r, "loadedmetadata", n)),
          e.onNav(() =>
            e.addTimeout(() => {
              const t = ie.el();

              if (t && !boundEls.has(t)) {
                boundEls.add(t);
                e.addListener(t, "timeupdate", n);
              }
            }, 1200),
          ),
          Yt["top-progress-bar"].push(() => t.remove()));
      },
      settings() {},
    }),
    (0),



    xa.register({
      id: "video-notes",
      name: "Video Notes",
      summary: "Local per-video notes.",
      cat: "data",
      masterKey: "videoNotesOn",
      keys: ["videoNotesOn"],
      apply(e) {
        if (!S.videoNotesOn)
          return void Lr(".ytb-extra-vnote,#ytb-extra-notes");
        const t = () =>
          Cr(
            "ytb-extra-vnote",
            "Notes for this video",
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a1 1 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/></svg>',
            () => Br("video"),
          );
        (t(), Mr("video-notes", t));
      },
      settings() {},
    }),

    xa.register({
      id: "chapter-hotkeys",
      name: "Chapter Hotkeys",
      summary: "Jump chapters with - and =.",
      cat: "playback",
      masterKey: "chapterHotkeysOn",
      keys: ["chapterHotkeysOn"],
      apply() {},
      settings() {},
    }),
    xa.register({
      id: "chapter-buttons",
      name: "Chapter Buttons",
      summary: "Previous/next chapter controls in the player bar.",
      cat: "playback",
      masterKey: "chapterButtonsOn",
      keys: ["chapterButtonsOn"],
      apply(e) {
        if (!S.chapterButtonsOn)
          return void Lr(".ytb-extra-prev-ch,.ytb-extra-next-ch");
        const t = () => {
          (Cr(
            "ytb-extra-prev-ch",
            "Previous chapter",
            '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 6h2v12H7V6Zm3 6 8-6v12l-8-6Z"/></svg>',
            () => Er(-1),
          ),
            Cr(
              "ytb-extra-next-ch",
              "Next chapter",
              '<svg viewBox="0 0 24 24"><path fill="currentColor" d="m6 18 8-6-8-6v12Zm9-12h2v12h-2V6Z"/></svg>',
              () => Er(1),
            ));
        };
        (t(), Mr("chapter-buttons", t));
      },
      settings() {},
    }),

    xa.register({
      id: "dense-video-grid",
      name: "Dense Grid",
      summary: "More thumbnails per row on wide viewports.",
      cat: "appearance",
      masterKey: "denseVideoGridOn",
      keys: ["denseVideoGridOn"],
      apply(e) {
        S.denseVideoGridOn &&
          e.addStyle(
`
@media(min-width:1300px){
ytd-rich-grid-renderer:not(:where(ytd-rich-shelf-renderer *,ytd-reel-shelf-renderer *)){
--ytd-rich-grid-items-per-row:6!important;--ytd-rich-grid-item-margin:8px!important;--ytd-rich-grid-row-margin:12px!important}
ytd-rich-grid-renderer:not(:where(ytd-rich-shelf-renderer *,ytd-reel-shelf-renderer *))>#contents,
ytd-rich-grid-renderer:not(:where(ytd-rich-shelf-renderer *,ytd-reel-shelf-renderer *)) ytd-rich-grid-row>#contents{display:flex;flex-wrap:wrap;justify-content:center!important}
ytd-rich-grid-renderer:not(:where(ytd-rich-shelf-renderer *,ytd-reel-shelf-renderer *))>#contents>ytd-rich-item-renderer[rendered-from-rich-grid]:not([is-post]):not([is-slim-media]):not([is-compact-grid]):not([is-game-card-shelf]):not([is-mini-game-card-shelf]):not([is-link-card-shelf]),
ytd-rich-grid-renderer:not(:where(ytd-rich-shelf-renderer *,ytd-reel-shelf-renderer *))>#contents>ytd-rich-grid-row>#contents>ytd-rich-item-renderer[rendered-from-rich-grid]:not([is-post]):not([is-slim-media]):not([is-compact-grid]):not([is-game-card-shelf]):not([is-mini-game-card-shelf]):not([is-link-card-shelf]),
ytd-rich-grid-renderer:not(:where(ytd-rich-shelf-renderer *,ytd-reel-shelf-renderer *))>#contents>.ytdRichItemRendererIsResponsiveGrid:not(.ytdRichItemRendererIsPost):not(.ytdRichItemRendererIsSlimMedia):not(.ytdRichItemRendererIsCompactGrid):not(.ytdRichItemRendererIsGameCardShelf):not(.ytdRichItemRendererIsMiniGameCardShelf):not(.ytdRichItemRendererIsLinkCardShelf):not(.ytdRichItemRendererContainsLumierePosters):not(.ytdRichItemRendererIsExpandOnHoverCardShelf),
ytd-rich-grid-renderer:not(:where(ytd-rich-shelf-renderer *,ytd-reel-shelf-renderer *))>#contents>ytd-rich-grid-row>#contents>.ytdRichItemRendererIsResponsiveGrid:not(.ytdRichItemRendererIsPost):not(.ytdRichItemRendererIsSlimMedia):not(.ytdRichItemRendererIsCompactGrid):not(.ytdRichItemRendererIsGameCardShelf):not(.ytdRichItemRendererIsMiniGameCardShelf):not(.ytdRichItemRendererIsLinkCardShelf):not(.ytdRichItemRendererContainsLumierePosters):not(.ytdRichItemRendererIsExpandOnHoverCardShelf){
width:calc(100%/var(--ytd-rich-grid-items-per-row) - var(--ytd-rich-grid-item-margin) - 1px)!important;
margin-bottom:var(--ytd-rich-grid-row-margin)!important}
ytd-rich-item-renderer[is-post],ytd-rich-item-renderer[is-slim-media],ytd-rich-item-renderer[is-compact-grid],ytd-rich-item-renderer[is-game-card-shelf],ytd-rich-item-renderer[is-mini-game-card-shelf],.ytdRichItemRendererIsPost,.ytdRichItemRendererIsSlimMedia,.ytdRichItemRendererIsCompactGrid{--ytd-rich-grid-item-margin:16px!important;--ytd-rich-grid-row-margin:32px!important}
ytd-rich-item-renderer:not([is-post]):not([is-slim-media]) #meta{padding:4px 0 0!important}
ytd-rich-item-renderer[is-post] #meta{padding:0!important}
ytd-rich-item-renderer h3.ytd-rich-grid-media{margin:4px 0 1px!important;font-size:14px!important;line-height:1.28!important}
ytd-rich-item-renderer ytd-thumbnail{margin-bottom:4px!important}
ytd-video-renderer{margin:2px 0!important}
}
@media(min-width:1600px){ytd-rich-grid-renderer:not(:where(ytd-rich-shelf-renderer *,ytd-reel-shelf-renderer *)){--ytd-rich-grid-items-per-row:8!important}}
@media(min-width:2100px){ytd-rich-grid-renderer:not(:where(ytd-rich-shelf-renderer *,ytd-reel-shelf-renderer *)){--ytd-rich-grid-items-per-row:10!important}}`,
          );
      },
      settings() {},
    }),

    xa.register({
      id: "hide-live-content",
      name: "Hide Live Streams",
      summary: "Removes live/upcoming cards from feeds and search.",
      cat: "feed",
      masterKey: "hideLiveContentOn",
      keys: ["hideLiveContentOn"],
      apply(e) {
        if (!S.hideLiveContentOn) {
          document.querySelectorAll(".ytb-extra-live").forEach(el => el.classList.remove("ytb-extra-live"));
          return;
        }
        S.hideLiveContentOn &&
          (e.addStyle(".ytb-extra-live{display:none!important}"),
          Rr(),
          e.addInterval(Rr, 2500));
      },
      settings() {},
    }),
    xa.register({
      id: "hide-premieres",
      name: "Hide Premieres",
      summary: "Removes scheduled premiere cards from feeds.",
      cat: "feed",
      masterKey: "hidePremieresOn",
      keys: ["hidePremieresOn"],
      apply(e) {
        if (!S.hidePremieresOn) {
          document.querySelectorAll(".ytb-extra-premiere").forEach(el => el.classList.remove("ytb-extra-premiere"));
          return;
        }
        S.hidePremieresOn &&
          (e.addStyle(".ytb-extra-premiere{display:none!important}"),
          Rr(),
          e.addInterval(Rr, 2500));
      },
      settings() {},
    }),



    xa.register({
      id: "feed-watched",
      name: "Watched Feed Treatment",
      summary: "Dims or hides cards you've already watched.",
      cat: "feed",
      masterKey: "feedWatchedMode",
      keys: ["feedWatchedMode", "feedDimWatchedOn", "feedHideWatchedOn"],
      isOn: () => !!S.feedWatchedMode && "off" !== S.feedWatchedMode,
      apply(e) {
        const cleanup = () => {
          document.querySelectorAll(".ytb-extra-watched-dim,.ytb-extra-watched-hide").forEach((el) => {
            el.classList.remove("ytb-extra-watched-dim", "ytb-extra-watched-hide");
          });
        };
        if (!S.feedWatchedMode || "off" === S.feedWatchedMode) { cleanup(); return; }
        e.addStyle(
          ".ytb-extra-watched-hide{display:none!important}" +
          ".ytb-extra-watched-dim{opacity:.45!important}",
        );
        try { Rr(); } catch (_) {}
        e.addInterval(() => { try { Rr(); } catch (_) {} }, 2500);
        Yt["feed-watched"].push(cleanup);
      },
      settings(en) {
        en.appendChild(
          Ro("Watched videos", "feedWatchedMode", {
            off: "Off",
            dim: "Dim watched",
            hide: "Hide watched",
          }),
        );
      },
    }),




    void 0);
const _THEME_VARS = ["base-background","raised-background","menu-background","general-background-a","general-background-b","general-background-c","text-primary","text-secondary","text-disabled","badge-chip-background","outline","call-to-action","call-to-action-inverse","icon-active-other","icon-inactive","10-percent-layer","shadow"];
  const Nr = ([
    ["none", "Default (YouTube)", "auto", null],
    ["d-charcoal", "Charcoal", "dark", ["#1a1a1a","#242424","#2a2a2a","#1a1a1a","#1a1a1a","#242424","#e8e8e8","#aaa","#666","#333","rgba(255,255,255,.1)","#c00","#fff","#e8e8e8","#aaa","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-midnight", "Midnight Blue", "dark", ["#0d1117","#161b22","#1c2128","#0d1117","#0d1117","#161b22","#e6edf3","#8b949e","#555d67","#21262d","rgba(255,255,255,.1)","#58a6ff","#fff","#e6edf3","#8b949e","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-amoled", "AMOLED Black", "dark", ["#000000","#0a0a0a","#111111","#000000","#000000","#0a0a0a","#e0e0e0","#999","#555","#1a1a1a","rgba(255,255,255,.1)","#c00","#fff","#e0e0e0","#999","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-nord", "Nord", "dark", ["#2e3440","#3b4252","#434c5e","#2e3440","#2e3440","#3b4252","#eceff4","#d8dee9","#7a8394","#4c566a","rgba(255,255,255,.1)","#88c0d0","#fff","#eceff4","#d8dee9","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-dracula", "Dracula", "dark", ["#282a36","#2d2f3d","#343746","#282a36","#282a36","#2d2f3d","#f8f8f2","#bfbfbf","#6272a4","#44475a","rgba(255,255,255,.1)","#bd93f9","#fff","#f8f8f2","#bfbfbf","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-solarized", "Solarized Dark", "dark", ["#002b36","#073642","#0a3f4e","#002b36","#002b36","#073642","#fdf6e3","#93a1a1","#586e75","#094150","rgba(255,255,255,.1)","#268bd2","#fff","#fdf6e3","#93a1a1","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-monokai", "Monokai", "dark", ["#272822","#2e2f28","#3e3d32","#272822","#272822","#2e2f28","#f8f8f2","#c0c0b0","#75715e","#49483e","rgba(255,255,255,.1)","#a6e22e","#fff","#f8f8f2","#c0c0b0","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-catppuccin", "Catppuccin Mocha", "dark", ["#1e1e2e","#24243b","#2a2a45","#1e1e2e","#1e1e2e","#24243b","#cdd6f4","#a6adc8","#6c7086","#313244","rgba(255,255,255,.1)","#cba6f7","#fff","#cdd6f4","#a6adc8","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-deep-ocean", "Deep Ocean", "dark", ["#0b1622","#111d2e","#152238","#0b1622","#0b1622","#111d2e","#dde4ee","#8899aa","#506070","#1a2c42","rgba(255,255,255,.1)","#4fc3f7","#fff","#dde4ee","#8899aa","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-forest", "Forest Night", "dark", ["#1a2316","#222e1c","#2a3822","#1a2316","#1a2316","#222e1c","#dce5d5","#a0b090","#607050","#334428","rgba(255,255,255,.1)","#66bb6a","#fff","#dce5d5","#a0b090","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-ember", "Ember", "dark", ["#1c1210","#271916","#30201c","#1c1210","#1c1210","#271916","#eeddd6","#bba090","#776058","#3a2824","rgba(255,255,255,.1)","#ef5350","#fff","#eeddd6","#bba090","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-amethyst", "Amethyst", "dark", ["#1a1424","#221a30","#2a203a","#1a1424","#1a1424","#221a30","#e0d8ee","#a898c0","#6a5888","#352a48","rgba(255,255,255,.1)","#b388ff","#fff","#e0d8ee","#a898c0","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-slate", "Warm Slate", "dark", ["#1e1e1e","#282828","#303030","#1e1e1e","#1e1e1e","#282828","#d4d4d4","#a0a0a0","#606060","#3a3a3a","rgba(255,255,255,.1)","#ff7043","#fff","#d4d4d4","#a0a0a0","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-tokyo", "Tokyo Night", "dark", ["#1a1b26","#1f2030","#24253a","#1a1b26","#1a1b26","#1f2030","#c0caf5","#9aa5ce","#565f89","#292a3e","rgba(255,255,255,.1)","#7aa2f7","#fff","#c0caf5","#9aa5ce","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-rosepine", "Rose Pine", "dark", ["#191724","#1f1d2e","#26233a","#191724","#191724","#1f1d2e","#e0def4","#908caa","#6e6a86","#2a2740","rgba(255,255,255,.1)","#eb6f92","#fff","#e0def4","#908caa","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-onedark", "One Dark", "dark", ["#282c34","#21252b","#3a3f4b","#282c34","#282c34","#21252b","#abb2bf","#9099a8","#5c6370","#3e4451","rgba(255,255,255,.1)","#61afef","#fff","#abb2bf","#9099a8","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-ayu-mirage", "Ayu Mirage", "dark", ["#1f2430","#171b24","#272d38","#1f2430","#1f2430","#171b24","#cbccc6","#8a9199","#5c6773","#33415e","rgba(255,255,255,.1)","#ffcc66","#fff","#cbccc6","#8a9199","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-ayu-dark", "Ayu Dark", "dark", ["#0a0e14","#0d1015","#11151c","#0a0e14","#0a0e14","#0d1015","#b3b1ad","#828891","#3e4b59","#1f242e","rgba(255,255,255,.1)","#39bae6","#fff","#b3b1ad","#828891","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-gruvbox", "Gruvbox Dark", "dark", ["#282828","#32302f","#3c3836","#282828","#282828","#32302f","#ebdbb2","#a89984","#7c6f64","#504945","rgba(255,255,255,.1)","#fe8019","#fff","#ebdbb2","#a89984","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-gruvbox-soft", "Gruvbox Soft", "dark", ["#32302f","#3c3836","#504945","#32302f","#32302f","#3c3836","#ddc7a1","#a89984","#665c54","#665c54","rgba(255,255,255,.1)","#d8a657","#fff","#ddc7a1","#a89984","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-zenburn", "YourTubeDark", "dark", ["#3f3f3f","#4a4a4a","#525252","#3f3f3f","#3f3f3f","#4a4a4a","#dcdccc","#a0a0a0","#777767","#5b5b5b","rgba(255,255,255,.1)","#dca3a3","#fff","#dcdccc","#a0a0a0","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-night-owl", "Night Owl", "dark", ["#011627","#01111d","#0b2942","#011627","#011627","#01111d","#d6deeb","#8badc1","#637777","#1d3b53","rgba(255,255,255,.1)","#82aaff","#fff","#d6deeb","#8badc1","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-palenight", "Palenight", "dark", ["#292d3e","#252836","#34384a","#292d3e","#292d3e","#252836","#a6accd","#8796b0","#676e95","#3a3f58","rgba(255,255,255,.1)","#c792ea","#fff","#a6accd","#8796b0","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-shades-of-purple", "Shades of Purple", "dark", ["#2d2b55","#1e1e3f","#3c3676","#2d2b55","#2d2b55","#1e1e3f","#fad000","#a599e9","#7068a2","#3e3a82","rgba(255,255,255,.1)","#fa48d8","#fff","#fad000","#a599e9","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-cobalt2", "Cobalt2", "dark", ["#193549","#0d2438","#1f5479","#193549","#193549","#0d2438","#ffffff","#7eb4e3","#0088ff","#234e6b","rgba(255,255,255,.1)","#ff9d00","#fff","#ffffff","#7eb4e3","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-material-darker", "Material Darker", "dark", ["#212121","#1a1a1a","#2a2a2a","#212121","#212121","#1a1a1a","#eeffff","#9aa1ab","#545454","#404040","rgba(255,255,255,.1)","#80cbc4","#fff","#eeffff","#9aa1ab","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-material-deep-ocean", "Material Deep Ocean", "dark", ["#0f111a","#090b10","#1a1c25","#0f111a","#0f111a","#090b10","#a6accd","#717cb4","#464b5d","#252738","rgba(255,255,255,.1)","#84ffff","#fff","#a6accd","#717cb4","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-material-oceanic", "Material Oceanic", "dark", ["#263238","#1e272c","#314549","#263238","#263238","#1e272c","#b0bec5","#7f9eaf","#546e7a","#37474f","rgba(255,255,255,.1)","#80cbc4","#fff","#b0bec5","#7f9eaf","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-material-palenight", "Material Palenight", "dark", ["#292d3e","#202331","#34394e","#292d3e","#292d3e","#202331","#a6accd","#717cb4","#676e95","#3a3f58","rgba(255,255,255,.1)","#c792ea","#fff","#a6accd","#717cb4","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-spacegray", "Spacegray", "dark", ["#2b303b","#272b35","#343d46","#2b303b","#2b303b","#272b35","#c0c5ce","#a7adba","#65737e","#3e4554","rgba(255,255,255,.1)","#bf616a","#fff","#c0c5ce","#a7adba","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-base16-default", "Base16 Default", "dark", ["#181818","#282828","#383838","#181818","#181818","#282828","#d8d8d8","#b8b8b8","#585858","#383838","rgba(255,255,255,.1)","#7cafc2","#fff","#d8d8d8","#b8b8b8","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-iceberg", "Iceberg", "dark", ["#161821","#0f1117","#1e2132","#161821","#161821","#0f1117","#c6c8d1","#84a0c6","#6b7089","#272c42","rgba(255,255,255,.1)","#84a0c6","#fff","#c6c8d1","#84a0c6","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-hyper", "Hyper", "dark", ["#000000","#1a1a1a","#242424","#000000","#000000","#1a1a1a","#ffffff","#a0a0a0","#606060","#2a2a2a","rgba(255,255,255,.1)","#fe0095","#fff","#ffffff","#a0a0a0","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-firefly", "Firefly", "dark", ["#161A1F","#1c2027","#252a31","#161A1F","#161A1F","#1c2027","#d7d7d7","#888c93","#5c6066","#2c3038","rgba(255,255,255,.1)","#ffaa00","#fff","#d7d7d7","#888c93","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-bluloco", "Bluloco Dark", "dark", ["#282c34","#21252b","#3a3f4b","#282c34","#282c34","#21252b","#abb2bf","#7a829b","#5c6370","#3e4451","rgba(255,255,255,.1)","#10b1fe","#fff","#abb2bf","#7a829b","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-blueberry", "Blueberry", "dark", ["#100d23","#0a0820","#170f3d","#100d23","#100d23","#0a0820","#caf0f8","#8ccff8","#5c6f9c","#28265a","rgba(255,255,255,.1)","#ff66c4","#fff","#caf0f8","#8ccff8","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-blackmore", "Blackmore", "dark", ["#181818","#0d0d0d","#222222","#181818","#181818","#0d0d0d","#d0d0d0","#909090","#606060","#2a2a2a","rgba(255,255,255,.1)","#7e57c2","#fff","#d0d0d0","#909090","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-vscode", "VS Code Dark+", "dark", ["#1e1e1e","#252526","#2d2d30","#1e1e1e","#1e1e1e","#252526","#cccccc","#a0a0a0","#6a6a6a","#3c3c3c","rgba(255,255,255,.1)","#0098ff","#fff","#cccccc","#a0a0a0","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-github-dark", "GitHub Dark", "dark", ["#0d1117","#161b22","#21262d","#0d1117","#0d1117","#161b22","#c9d1d9","#8b949e","#6e7681","#30363d","rgba(255,255,255,.1)","#58a6ff","#fff","#c9d1d9","#8b949e","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-github-dimmed", "GitHub Dimmed", "dark", ["#22272e","#2d333b","#373e47","#22272e","#22272e","#2d333b","#adbac7","#768390","#545d68","#444c56","rgba(255,255,255,.1)","#539bf5","#fff","#adbac7","#768390","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-discord", "Discord", "dark", ["#36393f","#2f3136","#202225","#36393f","#36393f","#2f3136","#dcddde","#b9bbbe","#72767d","#40444b","rgba(255,255,255,.1)","#5865f2","#fff","#dcddde","#b9bbbe","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-twitter-dim", "Twitter Dim", "dark", ["#15202b","#192734","#22303c","#15202b","#15202b","#192734","#ffffff","#8899a6","#5b7083","#283340","rgba(255,255,255,.1)","#1da1f2","#fff","#ffffff","#8899a6","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-twitter-lights-out", "Twitter Lights Out", "dark", ["#000000","#16181c","#1d1f23","#000000","#000000","#16181c","#e7e9ea","#71767b","#5b7083","#2f3336","rgba(255,255,255,.1)","#1d9bf0","#fff","#e7e9ea","#71767b","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-spotify", "Spotify", "dark", ["#121212","#181818","#282828","#121212","#121212","#181818","#ffffff","#b3b3b3","#727272","#404040","rgba(255,255,255,.1)","#1db954","#fff","#ffffff","#b3b3b3","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-twitch", "Twitch", "dark", ["#0e0e10","#18181b","#1f1f23","#0e0e10","#0e0e10","#18181b","#efeff1","#adadb8","#53535f","#26262c","rgba(255,255,255,.1)","#9147ff","#fff","#efeff1","#adadb8","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-reddit", "Reddit Dark", "dark", ["#1a1a1b","#272729","#343536","#1a1a1b","#1a1a1b","#272729","#d7dadc","#a8aaab","#818384","#3a3a3c","rgba(255,255,255,.1)","#ff4500","#fff","#d7dadc","#a8aaab","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-stackoverflow", "Stack Overflow Dark", "dark", ["#0c0d0e","#1c2024","#272a32","#0c0d0e","#0c0d0e","#1c2024","#bcbbbb","#9199a1","#6a737c","#393939","rgba(255,255,255,.1)","#f48024","#fff","#bcbbbb","#9199a1","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-vampire", "Vampire", "dark", ["#1c0a1f","#280f2c","#3a163f","#1c0a1f","#1c0a1f","#280f2c","#f0c4f4","#c08ec6","#7d5483","#4a234f","rgba(255,255,255,.1)","#ff5555","#fff","#f0c4f4","#c08ec6","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-blood", "Blood Red", "dark", ["#1a0a0a","#221010","#2b1414","#1a0a0a","#1a0a0a","#221010","#ffe5e5","#cc9999","#805050","#3a1c1c","rgba(255,255,255,.1)","#dc143c","#fff","#ffe5e5","#cc9999","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-toxic", "Toxic Green", "dark", ["#0a1f0a","#102810","#143514","#0a1f0a","#0a1f0a","#102810","#c5f7c5","#80cc80","#508050","#1c4a1c","rgba(255,255,255,.1)","#39ff14","#fff","#c5f7c5","#80cc80","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-cyber", "Cyberpunk", "dark", ["#0a0e27","#10153d","#171c52","#0a0e27","#0a0e27","#10153d","#fcee0a","#ff00ff","#aaaaff","#1f2570","rgba(255,255,255,.1)","#00ffff","#fff","#fcee0a","#ff00ff","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-synthwave", "Synthwave '84", "dark", ["#241b30","#2a2139","#312844","#241b30","#241b30","#2a2139","#ffffff","#a47acb","#5d5a73","#3b2d51","rgba(255,255,255,.1)","#fe4cdf","#fff","#ffffff","#a47acb","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-outrun", "Outrun", "dark", ["#221b40","#1a1438","#2c2253","#221b40","#221b40","#1a1438","#fff7ec","#ffa724","#9989b8","#352a66","rgba(255,255,255,.1)","#ff0080","#fff","#fff7ec","#ffa724","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-vaporwave", "Vaporwave", "dark", ["#1d152e","#251a37","#2f2244","#1d152e","#1d152e","#251a37","#ffdbef","#ff71ce","#a583c7","#3a2856","rgba(255,255,255,.1)","#01cdfe","#fff","#ffdbef","#ff71ce","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-matrix", "Matrix", "dark", ["#000000","#001a00","#002800","#000000","#000000","#001a00","#00ff00","#00cc00","#008800","#003300","rgba(255,255,255,.1)","#00ff41","#fff","#00ff00","#00cc00","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-hacker", "Hacker Terminal", "dark", ["#0a0e0a","#0d150d","#101e10","#0a0e0a","#0a0e0a","#0d150d","#76e57b","#509b54","#356639","#173a1a","rgba(255,255,255,.1)","#34e848","#fff","#76e57b","#509b54","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-noir", "Noir", "dark", ["#0d0d0d","#141414","#1c1c1c","#0d0d0d","#0d0d0d","#141414","#e0e0e0","#a0a0a0","#606060","#2c2c2c","rgba(255,255,255,.1)","#ffd700","#fff","#e0e0e0","#a0a0a0","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-coffee", "Coffee", "dark", ["#2c1f17","#3a2a1f","#4a382b","#2c1f17","#2c1f17","#3a2a1f","#e8d8c4","#b09980","#7a6650","#5a4538","rgba(255,255,255,.1)","#d2691e","#fff","#e8d8c4","#b09980","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-burgundy", "Burgundy", "dark", ["#1a0f12","#22151a","#2c1c22","#1a0f12","#1a0f12","#22151a","#f0c8c8","#c08080","#805050","#3a2229","rgba(255,255,255,.1)","#800020","#fff","#f0c8c8","#c08080","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-arctic", "Arctic", "dark", ["#1c2e3f","#243a4f","#2c4660","#1c2e3f","#1c2e3f","#243a4f","#e0eaf4","#a0b8d0","#6080a0","#385470","rgba(255,255,255,.1)","#80d0ff","#fff","#e0eaf4","#a0b8d0","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-jungle", "Jungle", "dark", ["#0f1a0f","#172417","#1f301f","#0f1a0f","#0f1a0f","#172417","#d0e8d0","#80b080","#506850","#284028","rgba(255,255,255,.1)","#8bc34a","#fff","#d0e8d0","#80b080","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-mocha", "Mocha", "dark", ["#2b1f1c","#372a26","#453530","#2b1f1c","#2b1f1c","#372a26","#e8d4c4","#b89888","#7a5e50","#553f36","rgba(255,255,255,.1)","#a0522d","#fff","#e8d4c4","#b89888","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-blackcurrant", "Blackcurrant", "dark", ["#1a0a1f","#23102a","#2d1638","#1a0a1f","#1a0a1f","#23102a","#e8c8f0","#a880b8","#705080","#3a1d48","rgba(255,255,255,.1)","#9c27b0","#fff","#e8c8f0","#a880b8","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["d-deepforest", "Deep Forest", "dark", ["#0a1410","#101a14","#16241c","#0a1410","#0a1410","#101a14","#c8e0d0","#80a890","#506858","#1f342a","rgba(255,255,255,.1)","#388e3c","#fff","#c8e0d0","#80a890","rgba(255,255,255,.07)","rgba(0,0,0,.5)"]],
    ["l-clean", "Clean White", "light", ["#ffffff","#f8f8f8","#ffffff","#ffffff","#ffffff","#f8f8f8","#111111","#606060","#aaaaaa","#eeeeee","rgba(0,0,0,.1)","#c00","#ffffff","#111111","#aaaaaa","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-warm", "Warm Cream", "light", ["#fdf6ec","#f8f0e0","#fdf6ec","#fdf6ec","#fdf6ec","#f8f0e0","#2c2416","#6e5e48","#b0a088","#ede4d0","rgba(0,0,0,.1)","#c06030","#ffffff","#2c2416","#b0a088","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-nord", "Nord Light", "light", ["#eceff4","#e5e9f0","#eceff4","#eceff4","#eceff4","#e5e9f0","#2e3440","#4c566a","#9aa0ac","#d8dee9","rgba(0,0,0,.1)","#5e81ac","#ffffff","#2e3440","#9aa0ac","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-solarized", "Solarized Light", "light", ["#fdf6e3","#eee8d5","#fdf6e3","#fdf6e3","#fdf6e3","#eee8d5","#073642","#586e75","#93a1a1","#e6dfcc","rgba(0,0,0,.1)","#268bd2","#ffffff","#073642","#93a1a1","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-catppuccin", "Catppuccin Latte", "light", ["#eff1f5","#e6e9ef","#eff1f5","#eff1f5","#eff1f5","#e6e9ef","#4c4f69","#6c6f85","#9ca0b0","#dce0e8","rgba(0,0,0,.1)","#8839ef","#ffffff","#4c4f69","#9ca0b0","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-sky", "Sky Blue", "light", ["#f0f6ff","#e6eef8","#f0f6ff","#f0f6ff","#f0f6ff","#e6eef8","#1a2a40","#4a6080","#90a0b8","#d4e2f4","rgba(0,0,0,.1)","#1976d2","#ffffff","#1a2a40","#90a0b8","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-mint", "Mint Green", "light", ["#f0faf4","#e4f4ea","#f0faf4","#f0faf4","#f0faf4","#e4f4ea","#1a3024","#3a6848","#88b098","#d0ead8","rgba(0,0,0,.1)","#2e7d32","#ffffff","#1a3024","#88b098","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-lavender", "Lavender", "light", ["#f5f0fa","#ece4f4","#f5f0fa","#f5f0fa","#f5f0fa","#ece4f4","#261a3a","#5a4070","#a090b8","#ddd0ee","rgba(0,0,0,.1)","#7b1fa2","#ffffff","#261a3a","#a090b8","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-peach", "Peach", "light", ["#fff5f0","#fceee6","#fff5f0","#fff5f0","#fff5f0","#fceee6","#3a2018","#7a5040","#c0a090","#f0dcd0","rgba(0,0,0,.1)","#e64a19","#ffffff","#3a2018","#c0a090","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-rose", "Rose", "light", ["#fdf0f4","#f8e4ec","#fdf0f4","#fdf0f4","#fdf0f4","#f8e4ec","#3a1828","#804060","#c890a8","#eed0dc","rgba(0,0,0,.1)","#c2185b","#ffffff","#3a1828","#c890a8","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-paper", "Paper", "light", ["#f5f5f0","#eeeee8","#f5f5f0","#f5f5f0","#f5f5f0","#eeeee8","#222222","#555555","#aaaaaa","#e0e0d8","rgba(0,0,0,.1)","#555555","#ffffff","#222222","#aaaaaa","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-sand", "Sand", "light", ["#f8f4ee","#f0ebe2","#f8f4ee","#f8f4ee","#f8f4ee","#f0ebe2","#2e2a22","#6e6455","#b0a898","#e4ddd0","rgba(0,0,0,.1)","#8d6e00","#ffffff","#2e2a22","#b0a898","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-graphite", "Graphite Light", "light", ["#eef0f2","#e2e6ea","#eef0f2","#eef0f2","#eef0f2","#e2e6ea","#1a1e24","#4a5060","#8a90a0","#d4d8de","rgba(0,0,0,.1)","#455a64","#ffffff","#1a1e24","#8a90a0","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-ocean", "Ocean Foam", "light", ["#eef6f6","#e2f0f0","#eef6f6","#eef6f6","#eef6f6","#e2f0f0","#1a3030","#406060","#88b0b0","#d0e6e6","rgba(0,0,0,.1)","#00897b","#ffffff","#1a3030","#88b0b0","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-sunset", "Sunset Glow", "light", ["#fff8f0","#fdf0e4","#fff8f0","#fff8f0","#fff8f0","#fdf0e4","#3a2810","#7a5830","#c0a078","#f0dcc4","rgba(0,0,0,.1)","#e65100","#ffffff","#3a2810","#c0a078","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-github", "GitHub Light", "light", ["#ffffff","#f6f8fa","#ffffff","#ffffff","#ffffff","#f6f8fa","#24292e","#586069","#959da5","#eaecef","rgba(0,0,0,.1)","#0366d6","#ffffff","#24292e","#959da5","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-vscode", "VS Code Light", "light", ["#ffffff","#f3f3f3","#ffffff","#ffffff","#ffffff","#f3f3f3","#1e1e1e","#383838","#9d9d9d","#e7e7e7","rgba(0,0,0,.1)","#005fb8","#ffffff","#1e1e1e","#9d9d9d","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-atom", "Atom Light", "light", ["#ffffff","#fafafa","#ffffff","#ffffff","#ffffff","#fafafa","#383a42","#a0a1a7","#a0a1a7","#e5e5e6","rgba(0,0,0,.1)","#4078f2","#ffffff","#383a42","#a0a1a7","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-one-light", "One Light", "light", ["#fafafa","#f0f0f0","#fafafa","#fafafa","#fafafa","#f0f0f0","#383a42","#a0a1a7","#a0a1a7","#e5e5e6","rgba(0,0,0,.1)","#4078f2","#ffffff","#383a42","#a0a1a7","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-tomorrow", "Tomorrow", "light", ["#ffffff","#efefef","#ffffff","#ffffff","#ffffff","#efefef","#4d4d4c","#8e908c","#8e908c","#d6d6d6","rgba(0,0,0,.1)","#4271ae","#ffffff","#4d4d4c","#8e908c","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-pencil", "Base16 Pencil", "light", ["#f1f1f1","#e0e0e0","#f1f1f1","#f1f1f1","#f1f1f1","#e0e0e0","#202020","#505050","#808080","#b0b0b0","rgba(0,0,0,.1)","#5fb3b3","#ffffff","#202020","#808080","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-ayu-light", "Ayu Light", "light", ["#fafafa","#f3f4f5","#fafafa","#fafafa","#fafafa","#f3f4f5","#5c6773","#8a9199","#abb0b6","#e7eaed","rgba(0,0,0,.1)","#ff6a00","#ffffff","#5c6773","#abb0b6","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-iceberg", "Iceberg Light", "light", ["#e8e9ec","#dcdfe4","#e8e9ec","#e8e9ec","#e8e9ec","#dcdfe4","#33374c","#6b7089","#9fa6b8","#cad0de","rgba(0,0,0,.1)","#2d539e","#ffffff","#33374c","#9fa6b8","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-papercolor", "PaperColor Light", "light", ["#eeeeee","#e4e4e4","#eeeeee","#eeeeee","#eeeeee","#e4e4e4","#444444","#5f8787","#878787","#dadada","rgba(0,0,0,.1)","#005f87","#ffffff","#444444","#878787","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-vanilla", "Vanilla", "light", ["#fefee9","#f8f8e0","#fefee9","#fefee9","#fefee9","#f8f8e0","#3a3320","#6c6648","#a09880","#ebe4cc","rgba(0,0,0,.1)","#ff8c00","#ffffff","#3a3320","#a09880","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-honey", "Honey", "light", ["#fff8e1","#fff3c4","#fff8e1","#fff8e1","#fff8e1","#fff3c4","#3a2c08","#7a5e1c","#bda564","#f5e8a8","rgba(0,0,0,.1)","#ffa000","#ffffff","#3a2c08","#bda564","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-mint-fresh", "Mint Fresh", "light", ["#e8f5e9","#dcefdc","#e8f5e9","#e8f5e9","#e8f5e9","#dcefdc","#1b3320","#3e7048","#82af88","#c8e6c9","rgba(0,0,0,.1)","#43a047","#ffffff","#1b3320","#82af88","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-pink-petal", "Pink Petal", "light", ["#fce4ec","#f8d7e2","#fce4ec","#fce4ec","#fce4ec","#f8d7e2","#3a1a28","#74304a","#c08aa0","#f1c5d4","rgba(0,0,0,.1)","#d81b60","#ffffff","#3a1a28","#c08aa0","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-blueprint", "Blueprint", "light", ["#e3f2fd","#cce7fb","#e3f2fd","#e3f2fd","#e3f2fd","#cce7fb","#0d2940","#1e5485","#76a9d8","#a0d0f5","rgba(0,0,0,.1)","#1565c0","#ffffff","#0d2940","#76a9d8","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-grape", "Grape", "light", ["#f3e5f5","#ead0ee","#f3e5f5","#f3e5f5","#f3e5f5","#ead0ee","#291a3a","#5d3c75","#9f80b4","#dec0e3","rgba(0,0,0,.1)","#6a1b9a","#ffffff","#291a3a","#9f80b4","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-marigold", "Marigold", "light", ["#fff3c4","#ffeb9c","#fff3c4","#fff3c4","#fff3c4","#ffeb9c","#3d2c00","#7c5e16","#bda06d","#ffe082","rgba(0,0,0,.1)","#f57f17","#ffffff","#3d2c00","#bda06d","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-spearmint", "Spearmint", "light", ["#e0f7fa","#c7eef2","#e0f7fa","#e0f7fa","#e0f7fa","#c7eef2","#0e2e34","#206d75","#73b1b8","#a4dfe5","rgba(0,0,0,.1)","#00838f","#ffffff","#0e2e34","#73b1b8","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-silver", "Silver", "light", ["#f5f5f5","#ededed","#f5f5f5","#f5f5f5","#f5f5f5","#ededed","#2c2c2c","#5e5e5e","#9b9b9b","#d6d6d6","rgba(0,0,0,.1)","#616161","#ffffff","#2c2c2c","#9b9b9b","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-pearl", "Pearl", "light", ["#fafafa","#f0f0f0","#fafafa","#fafafa","#fafafa","#f0f0f0","#212121","#616161","#9e9e9e","#e0e0e0","rgba(0,0,0,.1)","#37474f","#ffffff","#212121","#9e9e9e","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-pastel", "Pastel", "light", ["#fff5f7","#fde8ed","#fff5f7","#fff5f7","#fff5f7","#fde8ed","#3a2030","#704258","#b48aa3","#f5d0db","rgba(0,0,0,.1)","#e91e63","#ffffff","#3a2030","#b48aa3","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-lemon", "Lemon", "light", ["#fffde7","#fff9c4","#fffde7","#fffde7","#fffde7","#fff9c4","#3a3000","#705e00","#aa8f00","#f0e68c","rgba(0,0,0,.1)","#f9a825","#ffffff","#3a3000","#aa8f00","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-coral", "Coral", "light", ["#ffeae0","#ffd9c5","#ffeae0","#ffeae0","#ffeae0","#ffd9c5","#3a1a08","#7a3a16","#c0805a","#ffba9a","rgba(0,0,0,.1)","#f06292","#ffffff","#3a1a08","#c0805a","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-ice", "Arctic Ice", "light", ["#f0f8ff","#e0f0ff","#f0f8ff","#f0f8ff","#f0f8ff","#e0f0ff","#0a2a4a","#2860a0","#80a8d0","#c0d8f0","rgba(0,0,0,.1)","#039be5","#ffffff","#0a2a4a","#80a8d0","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-cherry", "Cherry Blossom", "light", ["#fff0f5","#ffe0eb","#fff0f5","#fff0f5","#fff0f5","#ffe0eb","#3a1828","#80405e","#cc8aa8","#ffc8de","rgba(0,0,0,.1)","#ec407a","#ffffff","#3a1828","#cc8aa8","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-newspaper", "Newspaper", "light", ["#f8f5f0","#efece6","#f8f5f0","#f8f5f0","#f8f5f0","#efece6","#1a1a1a","#4a4a4a","#888888","#e0ddd6","rgba(0,0,0,.1)","#2a2a2a","#ffffff","#1a1a1a","#888888","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-cotton", "Cotton Candy", "light", ["#fef0fc","#fde0fa","#fef0fc","#fef0fc","#fef0fc","#fde0fa","#3a1638","#7a3878","#b888b6","#f4c4f0","rgba(0,0,0,.1)","#d500f9","#ffffff","#3a1638","#b888b6","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-aqua-light", "Aqua Light", "light", ["#e0f7f7","#ccefef","#e0f7f7","#e0f7f7","#e0f7f7","#ccefef","#0a3030","#206868","#70b0b0","#a0dede","rgba(0,0,0,.1)","#00acc1","#ffffff","#0a3030","#70b0b0","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-melon", "Melon", "light", ["#fff5e1","#ffe9c4","#fff5e1","#fff5e1","#fff5e1","#ffe9c4","#3a2814","#7a522a","#b58a55","#fce0a8","rgba(0,0,0,.1)","#fb8c00","#ffffff","#3a2814","#b58a55","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-eggshell", "Eggshell", "light", ["#fcfcf0","#f5f5e0","#fcfcf0","#fcfcf0","#fcfcf0","#f5f5e0","#262616","#56564a","#9c9c8a","#e6e6cc","rgba(0,0,0,.1)","#827717","#ffffff","#262616","#9c9c8a","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-mist", "Morning Mist", "light", ["#f5f7f9","#e9ecef","#f5f7f9","#f5f7f9","#f5f7f9","#e9ecef","#1a2330","#4a5666","#8896a8","#d1d8e0","rgba(0,0,0,.1)","#5c7080","#ffffff","#1a2330","#8896a8","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-violet-light", "Soft Violet", "light", ["#f3e8ff","#e6d6ff","#f3e8ff","#f3e8ff","#f3e8ff","#e6d6ff","#28133a","#5a3072","#a080c4","#dac0f0","rgba(0,0,0,.1)","#7c4dff","#ffffff","#28133a","#a080c4","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-blush", "Blush", "light", ["#fde7e9","#fcd0d4","#fde7e9","#fde7e9","#fde7e9","#fcd0d4","#3a1620","#7a3848","#bb858f","#f5b5be","rgba(0,0,0,.1)","#e91e63","#ffffff","#3a1620","#bb858f","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-celeste", "Celeste", "light", ["#e8f4f8","#d4eaf0","#e8f4f8","#e8f4f8","#e8f4f8","#d4eaf0","#1a2e3a","#3a607a","#80a0b0","#b8d6e0","rgba(0,0,0,.1)","#0288d1","#ffffff","#1a2e3a","#80a0b0","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-cream", "Vanilla Cream", "light", ["#fdf9f0","#f8f2e2","#fdf9f0","#fdf9f0","#fdf9f0","#f8f2e2","#3a3014","#75612b","#b3a06b","#e8ddc1","rgba(0,0,0,.1)","#bf8d30","#ffffff","#3a3014","#b3a06b","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-fawn", "Fawn", "light", ["#f4ebde","#ebdfca","#f4ebde","#f4ebde","#f4ebde","#ebdfca","#3a2814","#75522a","#b08a58","#dec5a3","rgba(0,0,0,.1)","#8d6e63","#ffffff","#3a2814","#b08a58","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-quartz", "Quartz", "light", ["#f7f4f8","#eee8f0","#f7f4f8","#f7f4f8","#f7f4f8","#eee8f0","#2a1f30","#5a4068","#9a80a8","#d8c8e0","rgba(0,0,0,.1)","#9c27b0","#ffffff","#2a1f30","#9a80a8","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-frost", "Frost", "light", ["#f5f9fc","#e8f0f7","#f5f9fc","#f5f9fc","#f5f9fc","#e8f0f7","#1c2530","#445566","#88a0b0","#c8d8e8","rgba(0,0,0,.1)","#1976d2","#ffffff","#1c2530","#88a0b0","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-rose-gold", "Rose Gold", "light", ["#fce8e0","#fad4c8","#fce8e0","#fce8e0","#fce8e0","#fad4c8","#3a1c14","#7a4032","#c08070","#f5b8a4","rgba(0,0,0,.1)","#b76e79","#ffffff","#3a1c14","#c08070","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-champagne", "Champagne", "light", ["#fdf5e6","#fae9c8","#fdf5e6","#fdf5e6","#fdf5e6","#fae9c8","#3a2c14","#75582d","#b39568","#e8d3a0","rgba(0,0,0,.1)","#bf9b30","#ffffff","#3a2c14","#b39568","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-jade", "Jade", "light", ["#e0f2e9","#cce8d8","#e0f2e9","#e0f2e9","#e0f2e9","#cce8d8","#0a2818","#1c5436","#5e9078","#a0d0b8","rgba(0,0,0,.1)","#00897b","#ffffff","#0a2818","#5e9078","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-cornsilk", "Cornsilk", "light", ["#fff8dc","#fdedb8","#fff8dc","#fff8dc","#fff8dc","#fdedb8","#3a3414","#75692b","#b09e6c","#e8d894","rgba(0,0,0,.1)","#cba135","#ffffff","#3a3414","#b09e6c","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-blueberry-light", "Blueberry Light", "light", ["#e8eaf6","#d4d7ed","#e8eaf6","#e8eaf6","#e8eaf6","#d4d7ed","#0d1545","#1f3080","#7080c0","#b8c0e0","rgba(0,0,0,.1)","#3949ab","#ffffff","#0d1545","#7080c0","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-mauve", "Mauve", "light", ["#ede6ec","#e0d4de","#ede6ec","#ede6ec","#ede6ec","#e0d4de","#2a1828","#583a55","#a080a0","#d4bcd0","rgba(0,0,0,.1)","#8e24aa","#ffffff","#2a1828","#a080a0","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-sage", "Sage", "light", ["#eef4e8","#dfe8d3","#eef4e8","#eef4e8","#eef4e8","#dfe8d3","#1c3014","#46662a","#88a880","#c4d8b4","rgba(0,0,0,.1)","#558b2f","#ffffff","#1c3014","#88a880","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-zen", "Zen", "light", ["#f7f4ec","#ebe5d4","#f7f4ec","#f7f4ec","#f7f4ec","#ebe5d4","#2c2820","#5c5040","#a09480","#d8d0bc","rgba(0,0,0,.1)","#6d4c41","#ffffff","#2c2820","#a09480","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-arctic-snow", "Arctic Snow", "light", ["#ffffff","#f0f4f8","#ffffff","#ffffff","#ffffff","#f0f4f8","#0d1a30","#3a5670","#7090b0","#dde6ee","rgba(0,0,0,.1)","#1565c0","#ffffff","#0d1a30","#7090b0","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-meadow", "Meadow", "light", ["#f0f5e8","#e0ecd4","#f0f5e8","#f0f5e8","#f0f5e8","#e0ecd4","#1f2c14","#506830","#90a878","#c8d8b4","rgba(0,0,0,.1)","#689f38","#ffffff","#1f2c14","#90a878","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["d-obsidian", "Obsidian", "dark", ["#0b0c0f","#1a1b1d","#232427","#0b0c0f","#0b0c0f","#1a1b1d","#d3d3d4","#9d9e9f","#636365","#232427","rgba(255,255,255,.1)","#7f8ff9","#fff","#d3d3d4","#9d9e9f","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-night-crimson", "Night Crimson", "dark", ["#1c0b12","#2a1a20","#33232a","#1c0b12","#1c0b12","#2a1a20","#d6d3d4","#a49da0","#6e6367","#33232a","rgba(255,255,255,.1)","#ff7bb1","#fff","#d6d3d4","#a49da0","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-wine", "Wine", "dark", ["#2a0f16","#371d24","#3f272d","#2a0f16","#2a0f16","#371d24","#d9d4d5","#aa9fa2","#77656a","#3f272d","rgba(255,255,255,.1)","#ff7d5a","#fff","#d9d4d5","#aa9fa2","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-dusk", "Dusk", "dark", ["#1a1826","#282633","#312f3c","#1a1826","#1a1826","#282633","#d6d5d8","#a3a3a8","#6c6b74","#312f3c","rgba(255,255,255,.1)","#ff9e64","#fff","#d6d5d8","#a3a3a8","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-pine-grove", "Pine Grove", "dark", ["#0b1913","#1a2721","#23302b","#0b1913","#0b1913","#1a2721","#d3d6d5","#9da3a1","#636c68","#23302b","rgba(255,255,255,.1)","#9ece6a","#fff","#d3d6d5","#9da3a1","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-plum", "Plum", "dark", ["#231238","#302044","#392a4c","#231238","#231238","#302044","#d7d4db","#a7a0af","#726780","#392a4c","rgba(255,255,255,.1)","#c792ea","#fff","#d7d4db","#a7a0af","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-cyber-glow", "Cyber Glow", "dark", ["#0a0f2a","#191d37","#23273f","#0a0f2a","#0a0f2a","#191d37","#d3d4d9","#9d9faa","#626577","#23273f","rgba(255,255,255,.1)","#00e5ff","#fff","#d3d4d9","#9d9faa","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-electric-lime", "Electric Lime", "dark", ["#121405","#202214","#2a2c1e","#121405","#121405","#202214","#d4d5d2","#a0a19b","#67695f","#2a2c1e","rgba(255,255,255,.1)","#b6ff3b","#fff","#d4d5d2","#a0a19b","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-rose-quartz", "Rose Quartz", "dark", ["#221018","#2f1e26","#38282f","#221018","#221018","#2f1e26","#d7d4d5","#a79fa3","#72666b","#38282f","rgba(255,255,255,.1)","#ffb2d6","#fff","#d7d4d5","#a79fa3","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-night-navy", "Night Navy", "dark", ["#0d1730","#1c253c","#252e45","#0d1730","#0d1730","#1c253c","#d3d5da","#9ea2ac","#646b7b","#252e45","rgba(255,255,255,.1)","#6ea8ff","#fff","#d3d5da","#9ea2ac","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-teal-abyss", "Teal Abyss", "dark", ["#04140c","#13221b","#1d2c24","#04140c","#04140c","#13221b","#d2d5d3","#9ba19e","#5e6963","#1d2c24","rgba(255,255,255,.1)","#26e6a8","#fff","#d2d5d3","#9ba19e","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-amethyst-haze", "Amethyst Haze", "dark", ["#1c1633","#2a243f","#332d47","#1c1633","#1c1633","#2a243f","#d6d5da","#a4a2ad","#6e6a7c","#332d47","rgba(255,255,255,.1)","#a78bfa","#fff","#d6d5da","#a4a2ad","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-sapphire", "Sapphire", "dark", ["#06213a","#152e46","#1f374e","#06213a","#06213a","#152e46","#d2d7dc","#9ba6b0","#607181","#1f374e","rgba(255,255,255,.1)","#4fc3f7","#fff","#d2d7dc","#9ba6b0","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-garnet", "Garnet", "dark", ["#24070f","#31161d","#3a2027","#24070f","#24070f","#31161d","#d8d2d4","#a79c9f","#736065","#3a2027","rgba(255,255,255,.1)","#ff7f94","#fff","#d8d2d4","#a79c9f","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-periwinkle", "Periwinkle", "dark", ["#141d40","#222b4b","#2c3453","#141d40","#141d40","#222b4b","#d5d6dd","#a1a5b3","#696e85","#2c3453","rgba(255,255,255,.1)","#9aa5ff","#fff","#d5d6dd","#a1a5b3","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-sunbeam", "Sunbeam", "dark", ["#241c08","#312a17","#3a3321","#241c08","#241c08","#312a17","#d8d6d3","#a7a49c","#736e61","#3a3321","rgba(255,255,255,.1)","#ffd75e","#fff","#d8d6d3","#a7a49c","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-undersea", "Undersea", "dark", ["#0a1f1d","#192c2b","#233534","#0a1f1d","#0a1f1d","#192c2b","#d3d7d6","#9da5a5","#62706e","#233534","rgba(255,255,255,.1)","#26d0c6","#fff","#d3d7d6","#9da5a5","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-smoke", "Smoke", "dark", ["#17181a","#252628","#2e2f31","#17181a","#17181a","#252628","#d5d5d6","#a2a3a3","#6b6b6c","#2e2f31","rgba(255,255,255,.1)","#d0a24e","#fff","#d5d5d6","#a2a3a3","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-graphite", "Graphite", "dark", ["#141414","#222222","#2c2c2c","#141414","#141414","#222222","#d5d5d5","#a1a1a1","#696969","#2c2c2c","rgba(255,255,255,.1)","#8fb6ff","#fff","#d5d5d5","#a1a1a1","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-crimson-tide", "Crimson Tide", "dark", ["#2b0508","#381417","#401e21","#2b0508","#2b0508","#381417","#d9d2d3","#aa9b9c","#775f61","#401e21","rgba(255,255,255,.1)","#ff4d4d","#fff","#d9d2d3","#aa9b9c","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-lavender-night", "Lavender Night", "dark", ["#1a1530","#28233c","#312c45","#1a1530","#1a1530","#28233c","#d6d5da","#a3a1ac","#6c697b","#312c45","rgba(255,255,255,.1)","#d9c7ff","#fff","#d6d5da","#a3a1ac","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-rich-espresso", "Rich Espresso", "dark", ["#2c1609","#392418","#412d22","#2c1609","#2c1609","#392418","#d9d5d3","#aba29d","#786a62","#412d22","rgba(255,255,255,.1)","#dfa15c","#fff","#d9d5d3","#aba29d","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-boysenberry", "Boysenberry", "dark", ["#250b2e","#321a3b","#3b2343","#250b2e","#250b2e","#321a3b","#d8d3d9","#a89dab","#736379","#3b2343","rgba(255,255,255,.1)","#b18aff","#fff","#d8d3d9","#a89dab","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-rust", "Rust", "dark", ["#2b0f06","#381d15","#40271f","#2b0f06","#2b0f06","#381d15","#d9d4d2","#aa9f9b","#776560","#40271f","rgba(255,255,255,.1)","#ff8a5c","#fff","#d9d4d2","#aa9f9b","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-afterglow", "Afterglow", "dark", ["#17140a","#252219","#2e2c23","#17140a","#17140a","#252219","#d5d5d3","#a2a19d","#6b6962","#2e2c23","rgba(255,255,255,.1)","#c8d13b","#fff","#d5d5d3","#a2a19d","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-glacier", "Glacier", "dark", ["#0e1b22","#1c292f","#263238","#0e1b22","#0e1b22","#1c292f","#d4d6d7","#9fa4a7","#656d72","#263238","rgba(255,255,255,.1)","#6bd4ff","#fff","#d4d6d7","#9fa4a7","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-blackberry", "Blackberry", "dark", ["#1c0f26","#2a1d33","#33273c","#1c0f26","#1c0f26","#2a1d33","#d6d4d8","#a49fa8","#6e6574","#33273c","rgba(255,255,255,.1)","#c06fff","#fff","#d6d4d8","#a49fa8","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-orchid-night", "Orchid Night", "dark", ["#1f0f22","#2c1d2f","#352738","#1f0f22","#1f0f22","#2c1d2f","#d7d4d7","#a59fa7","#706572","#352738","rgba(255,255,255,.1)","#ff8ad2","#fff","#d7d4d7","#a59fa7","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-midnight-cobalt", "Midnight Cobalt", "dark", ["#0a1027","#191e34","#23283d","#0a1027","#0a1027","#191e34","#d3d4d8","#9d9fa9","#626675","#23283d","rgba(255,255,255,.1)","#4080ff","#fff","#d3d4d8","#9d9fa9","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-forest-floor", "Forest Floor", "dark", ["#0d1715","#1c2523","#252e2c","#0d1715","#0d1715","#1c2523","#d3d5d5","#9ea2a1","#646b69","#252e2c","rgba(255,255,255,.1)","#7fbf6f","#fff","#d3d5d5","#9ea2a1","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-indigo-ink", "Indigo Ink", "dark", ["#160f2e","#241d3b","#2d2743","#160f2e","#160f2e","#241d3b","#d5d4d9","#a29fab","#6a6579","#2d2743","rgba(255,255,255,.1)","#7f6cff","#fff","#d5d4d9","#a29fab","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-amber-sunset", "Amber Sunset", "dark", ["#2c1313","#392121","#412b2b","#2c1313","#2c1313","#392121","#d9d5d5","#aba1a1","#786868","#412b2b","rgba(255,255,255,.1)","#ff9f5a","#fff","#d9d5d5","#aba1a1","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-slate-storm", "Slate Storm", "dark", ["#1c2024","#2a2d31","#33363a","#1c2024","#1c2024","#2a2d31","#d6d7d8","#a4a6a7","#6e7073","#33363a","rgba(255,255,255,.1)","#a7c1e0","#fff","#d6d7d8","#a4a6a7","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-onyx", "Onyx", "dark", ["#0a0a0c","#19191b","#232324","#0a0a0c","#0a0a0c","#19191b","#d3d3d3","#9d9d9e","#626263","#232324","rgba(255,255,255,.1)","#e0e0e5","#fff","#d3d3d3","#9d9d9e","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-night-sky", "Night Sky", "dark", ["#02102a","#111e37","#1b283f","#02102a","#02102a","#111e37","#d1d4d9","#9a9faa","#5d6677","#1b283f","rgba(255,255,255,.1)","#7fd4ff","#fff","#d1d4d9","#9a9faa","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["d-copperberry", "Copperberry", "dark", ["#171426","#252233","#2e2c3c","#171426","#171426","#252233","#d5d5d8","#a2a1a8","#6b6974","#2e2c3c","rgba(255,255,255,.1)","#b3a3ff","#fff","#d5d5d8","#a2a1a8","rgba(255,255,255,.07)","rgba(0,0,0,.55)"]],
    ["l-alabaster", "Alabaster", "light", ["#f7f4ea","#f2efe5","#ebe8de","#f7f4ea","#f7f4ea","#f2efe5","#31312f","#777570","#b2b0a8","#ebe8de","rgba(0,0,0,.1)","#3b82f6","#ffffff","#31312f","#777570","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-porcelain", "Porcelain", "light", ["#f2f5f8","#edf0f3","#e6e9ec","#f2f5f8","#f2f5f8","#edf0f3","#303132","#747677","#aeb0b3","#e6e9ec","rgba(0,0,0,.1)","#2563eb","#ffffff","#303132","#747677","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-cloud-white", "Cloud White", "light", ["#fbfbfd","#f6f6f8","#eeeef0","#fbfbfd","#fbfbfd","#f6f6f8","#323233","#787879","#b5b5b6","#eeeef0","rgba(0,0,0,.1)","#4f6ef7","#ffffff","#323233","#787879","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-ivory", "Ivory", "light", ["#fbf6e6","#f6f1e1","#eeeadb","#fbf6e6","#fbf6e6","#f6f1e1","#32312e","#78766e","#b5b1a6","#eeeadb","rgba(0,0,0,.1)","#c99a2e","#ffffff","#32312e","#78766e","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-pearl-gray", "Pearl Gray", "light", ["#f1f2f4","#ecedef","#e5e6e8","#f1f2f4","#f1f2f4","#ecedef","#303031","#747475","#aeaeb0","#e5e6e8","rgba(0,0,0,.1)","#5b6472","#ffffff","#303031","#747475","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-warm-light", "Warm Light", "light", ["#fff3e6","#faeee1","#f2e7db","#fff3e6","#fff3e6","#faeee1","#33312e","#7a756e","#b8afa6","#f2e7db","rgba(0,0,0,.1)","#ef6c00","#ffffff","#33312e","#7a756e","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-cloud-nine", "Cloud Nine", "light", ["#e7f0ee","#e2ebe9","#dbe4e2","#e7f0ee","#e7f0ee","#e2ebe9","#2e3030","#6f7372","#a6adab","#dbe4e2","rgba(0,0,0,.1)","#3f7d6b","#ffffff","#2e3030","#6f7372","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-petal", "Petal", "light", ["#fefcf7","#f9f7f2","#f1efeb","#fefcf7","#fefcf7","#f9f7f2","#333231","#7a7977","#b7b5b2","#f1efeb","rgba(0,0,0,.1)","#8a9a4a","#ffffff","#333231","#7a7977","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-pecan-linen", "Pecan Linen", "light", ["#faf6ef","#f5f1ea","#eeeae3","#faf6ef","#faf6ef","#f5f1ea","#323130","#787673","#b4b1ac","#eeeae3","rgba(0,0,0,.1)","#a16207","#ffffff","#323130","#787673","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-ice-frost", "Ice Frost", "light", ["#f0f7fc","#ebf2f7","#e4ebef","#f0f7fc","#f0f7fc","#ebf2f7","#303132","#737779","#adb2b5","#e4ebef","rgba(0,0,0,.1)","#38bdf8","#ffffff","#303132","#737779","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-beige-sand", "Beige Sand", "light", ["#f2ecdf","#ede7db","#e6e0d4","#f2ecdf","#f2ecdf","#ede7db","#302f2d","#74716b","#aeaaa1","#e6e0d4","rgba(0,0,0,.1)","#a67c52","#ffffff","#302f2d","#74716b","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-rose-water", "Rose Water", "light", ["#fcf1f3","#f7ecee","#efe5e7","#fcf1f3","#fcf1f3","#f7ecee","#323031","#797475","#b5aeaf","#efe5e7","rgba(0,0,0,.1)","#e6487c","#ffffff","#323031","#797475","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-daffodil", "Daffodil", "light", ["#fdf9e8","#f8f4e3","#f0eddc","#fdf9e8","#fdf9e8","#f8f4e3","#33322e","#79786f","#b6b3a7","#f0eddc","rgba(0,0,0,.1)","#d9a521","#ffffff","#33322e","#79786f","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-seafoam", "Seafoam", "light", ["#eefaf4","#e9f5ef","#e2eee8","#eefaf4","#eefaf4","#e9f5ef","#303231","#727875","#abb4b0","#e2eee8","rgba(0,0,0,.1)","#10b981","#ffffff","#303231","#727875","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-wisteria", "Wisteria", "light", ["#f6f2fc","#f1edf7","#eae6ef","#f6f2fc","#f6f2fc","#f1edf7","#313032","#767479","#b1aeb5","#eae6ef","rgba(0,0,0,.1)","#8b5cf6","#ffffff","#313032","#767479","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-salmon", "Salmon", "light", ["#fdeeec","#f8e9e7","#f0e2e0","#fdeeec","#fdeeec","#f8e9e7","#33302f","#797271","#b6abaa","#f0e2e0","rgba(0,0,0,.1)","#e4485a","#ffffff","#33302f","#797271","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-buttermilk", "Buttermilk", "light", ["#f8f3e0","#f3eedc","#ece7d5","#f8f3e0","#f8f3e0","#f3eedc","#32312d","#77756c","#b3afa1","#ece7d5","rgba(0,0,0,.1)","#d4a017","#ffffff","#32312d","#77756c","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-mint-julep", "Mint Julep", "light", ["#effaf3","#eaf5ee","#e3eee7","#effaf3","#effaf3","#eaf5ee","#303231","#737875","#acb4af","#e3eee7","rgba(0,0,0,.1)","#2f9e44","#ffffff","#303231","#737875","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-powder-blue", "Powder Blue", "light", ["#eef6fd","#e9f1f8","#e2eaf0","#eef6fd","#eef6fd","#e9f1f8","#303133","#727679","#abb1b6","#e2eaf0","rgba(0,0,0,.1)","#4b9cf5","#ffffff","#303133","#727679","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-camellia", "Camellia", "light", ["#fbeef0","#f6e9eb","#eee2e4","#fbeef0","#fbeef0","#f6e9eb","#323030","#787273","#b5abad","#eee2e4","rgba(0,0,0,.1)","#e05d7c","#ffffff","#323030","#787273","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-soft-mist", "Soft Mist", "light", ["#f2f4f6","#edeff1","#e6e8ea","#f2f4f6","#f2f4f6","#edeff1","#303131","#747576","#aeb0b1","#e6e8ea","rgba(0,0,0,.1)","#7d8996","#ffffff","#303131","#747576","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-champagne-glow", "Champagne Glow", "light", ["#f8ecd0","#f3e7cc","#ece0c6","#f8ecd0","#f8ecd0","#f3e7cc","#322f2a","#777164","#b3aa96","#ece0c6","rgba(0,0,0,.1)","#c9a227","#ffffff","#322f2a","#777164","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-peachy", "Peachy", "light", ["#fdeee4","#f8e9df","#f0e2d9","#fdeee4","#fdeee4","#f8e9df","#33302e","#79726d","#b6aba4","#f0e2d9","rgba(0,0,0,.1)","#fb923c","#ffffff","#33302e","#79726d","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-quiet-sage", "Quiet Sage", "light", ["#f1f7ee","#ecf2e9","#e5ebe2","#f1f7ee","#f1f7ee","#ecf2e9","#303130","#747772","#aeb2ab","#e5ebe2","rgba(0,0,0,.1)","#6f9e6b","#ffffff","#303130","#747772","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-snowdrop", "Snowdrop", "light", ["#fbfbfb","#f6f6f6","#eeeeee","#fbfbfb","#fbfbfb","#f6f6f6","#323232","#787878","#b5b5b5","#eeeeee","rgba(0,0,0,.1)","#334155","#ffffff","#323232","#787878","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-moonstone", "Moonstone", "light", ["#f0f4f8","#ebeff3","#e4e8ec","#f0f4f8","#f0f4f8","#ebeff3","#303132","#737577","#adb0b3","#e4e8ec","rgba(0,0,0,.1)","#5e7ea3","#ffffff","#303132","#737577","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-buttercream", "Buttercream", "light", ["#fbf0dc","#f6ebd8","#eee4d1","#fbf0dc","#fbf0dc","#f6ebd8","#32302c","#78736a","#b5ad9e","#eee4d1","rgba(0,0,0,.1)","#eab308","#ffffff","#32302c","#78736a","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-lilac", "Lilac", "light", ["#f2f3fb","#edeef6","#e6e7ee","#f2f3fb","#f2f3fb","#edeef6","#303132","#747578","#aeafb5","#e6e7ee","rgba(0,0,0,.1)","#a78bfa","#ffffff","#303132","#747578","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-mint-chip", "Mint Chip", "light", ["#eefaf2","#e9f5ed","#e2eee6","#eefaf2","#eefaf2","#e9f5ed","#303230","#727874","#abb4ae","#e2eee6","rgba(0,0,0,.1)","#00a86b","#ffffff","#303230","#727874","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-rosebud", "Rosebud", "light", ["#fef0f4","#f9ebef","#f1e4e8","#fef0f4","#fef0f4","#f9ebef","#333031","#7a7375","#b7adb0","#f1e4e8","rgba(0,0,0,.1)","#fb7185","#ffffff","#333031","#7a7375","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-driftwood", "Driftwood", "light", ["#f5efe4","#f0eadf","#e9e3d9","#f5efe4","#f5efe4","#f0eadf","#31302e","#76736d","#b0aca4","#e9e3d9","rgba(0,0,0,.1)","#b98a3e","#ffffff","#31302e","#76736d","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-clear-sky", "Clear Sky", "light", ["#eef7fd","#e9f2f8","#e2ebf0","#eef7fd","#eef7fd","#e9f2f8","#303133","#727779","#abb2b6","#e2ebf0","rgba(0,0,0,.1)","#2196f3","#ffffff","#303133","#727779","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-creme-brulee", "Creme Brulee", "light", ["#fdf4e0","#f8efdc","#f0e8d5","#fdf4e0","#fdf4e0","#f8efdc","#33312d","#79756c","#b6b0a1","#f0e8d5","rgba(0,0,0,.1)","#b8860b","#ffffff","#33312d","#79756c","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-blue-horizon", "Blue Horizon", "light", ["#eef2fb","#e9edf6","#e2e6ee","#eef2fb","#eef2fb","#e9edf6","#303032","#727478","#abaeb5","#e2e6ee","rgba(0,0,0,.1)","#4169e1","#ffffff","#303032","#727478","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-watermelon", "Watermelon", "light", ["#eefaf0","#e9f5eb","#e2eee4","#eefaf0","#eefaf0","#e9f5eb","#303230","#727873","#abb4ad","#e2eee4","rgba(0,0,0,.1)","#34c759","#ffffff","#303230","#727873","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-lavender-haze", "Lavender Haze", "light", ["#f6f2fa","#f1edf5","#eae6ee","#f6f2fa","#f6f2fa","#f1edf5","#313032","#767478","#b1aeb4","#eae6ee","rgba(0,0,0,.1)","#9c7de5","#ffffff","#313032","#767478","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-morning-glory", "Morning Glory", "light", ["#edf9fb","#e8f4f6","#e1edee","#edf9fb","#edf9fb","#e8f4f6","#2f3232","#727878","#abb3b5","#e1edee","rgba(0,0,0,.1)","#2fb4c4","#ffffff","#2f3232","#727878","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
    ["l-amber-mist", "Amber Mist", "light", ["#fbf2df","#f6eddb","#eee6d4","#fbf2df","#fbf2df","#f6eddb","#32302d","#78746b","#b5aea1","#eee6d4","rgba(0,0,0,.1)","#e07a2a","#ffffff","#32302d","#78746b","rgba(0,0,0,.05)","rgba(0,0,0,.1)"]],
  ]).map((r) =>
    r[3]
      ? {
          id: r[0],
          name: r[1],
          mode: r[2],
          vars: Object.fromEntries(r[3].map((v, i) => [_THEME_VARS[i], v])),
        }
      : { id: r[0], name: r[1], mode: r[2], vars: null },
  );
  function _r(e) {
    const t = [];
    for (let a = 0; a < e.length; a++) {
      const n = e[a];
      if (!n) continue;
      const r = n.indexOf(":");
      if (r < 0) continue;
      const o = n.slice(0, r).trim(),
        i = n.slice(r + 1).trim();
      if (!o || !i) continue;
      const d = /!important/i.test(i) ? i : i + " !important";
      t.push(o + ":" + d);
    }
    return t.join(";");
  }
  const _customThemes = [];

  try {
    v("kv", "__yourtube_custom_themes__")
      .then((row) => {
        const list = row && Array.isArray(row.v) ? row.v : [];
        for (const ct of list.slice(-50)) {
          if (ct && ct.id && ct.vars && !_customThemes.some((x) => x && x.id === ct.id)) {
            _customThemes.push(ct);
          }
        }
      })
      .catch(() => {});
  } catch (_cthErr) {}
  let _themeCardSyncUnsub = null;
    Object.freeze(Nr);
  let Hr = null,
    Dr = null;

  let _themeCssMemo = { k: "", v: "" };

  const _ytThemeExtras = () => [
    ...(S.themeCompactOn === false ? [] : [
      "ytd-rich-item-renderer{margin-bottom:6px!important}",
      "ytd-rich-item-renderer #meta{padding-top:6px!important}",
      "h3.ytd-rich-grid-media{margin:4px 0 1px!important;line-height:1.25!important}",
      "ytd-rich-grid-media #metadata{padding-top:4px!important}",
      "ytd-video-renderer{margin:2px 0!important}",
    ]),
    "#comments ytd-comment-thread-renderer,#comments ytd-comment-view-model,#comments ytd-comment-renderer,#comments #comment,#comments #comment-content,#comments #content,#comments #main,#comments #body,#comments #contents,#comments ytd-comment-action-buttons-renderer{background:transparent!important;background-color:transparent!important;box-shadow:none!important}",
    "ytd-rich-item-renderer,ytd-rich-item-renderer #content,ytd-rich-item-renderer #dismissible,ytd-rich-item-renderer yt-lockup-view-model,ytd-rich-item-renderer .ytLockupViewModelHost,ytd-rich-item-renderer yt-lockup-view-model-wiz,ytd-rich-item-renderer .yt-lockup-view-model__inner,ytd-rich-grid-media,#dismissible.ytd-rich-grid-media,#dismissible.ytd-rich-item-renderer,ytd-rich-grid-renderer #contents,ytd-video-renderer,#dismissible.ytd-video-renderer,ytd-compact-video-renderer,ytd-compact-video-renderer #dismissible,#related yt-lockup-view-model,ytd-playlist-video-renderer,ytd-grid-video-renderer,ytd-reel-item-renderer,ytm-rich-item-renderer,ytm-video-with-context-renderer{background:transparent!important;background-color:transparent!important;box-shadow:none!important}",
    "ytd-rich-item-renderer yt-thumbnail-view-model,ytd-rich-item-renderer #thumbnail,ytd-video-renderer yt-thumbnail-view-model,ytd-compact-video-renderer #thumbnail,#related yt-thumbnail-view-model,yt-lockup-view-model yt-thumbnail-view-model,ytm-rich-item-renderer .ytThumbnailViewModelHost{background-color:var(--yt-spec-static-overlay-background-solid,transparent)!important}",
    "ytd-rich-section-renderer,ytd-rich-shelf-renderer,ytd-chips-shelf-with-video-shelf-renderer{background:transparent!important;box-shadow:none!important}",
  ].join("\n");

  const _ytEarlyThemePaint = (id) => {
    try {
      const theme = (typeof Nr !== "undefined" ? Nr.find((t) => t.id === id) : null) ||
        ((typeof _customThemes !== "undefined" && _customThemes) ? _customThemes.find((t) => t.id === id) : null);
      if (!theme || !theme.vars) return;
      const v = theme.vars;
      const css =
        "html,html[dark]{--yt-spec-base-background:" + v["base-background"] +
        "!important;--yt-spec-raised-background:" + v["raised-background"] +
        "!important;--yt-spec-general-background-a:" + v["general-background-a"] +
        "!important;--yt-spec-general-background-b:" + v["general-background-b"] +
        "!important;--yt-spec-text-primary:" + v["text-primary"] +
        "!important;--yt-spec-text-secondary:" + v["text-secondary"] +
        "!important;background-color:" + v["base-background"] + "!important}";
      YourTubeResources.Dom.css(css, "theme-early");
    } catch (_) {}
  };
  const _ytEarlyThemeDrop = () => {
    try { const el = document.getElementById("ytb-theme-early"); if (el) el.remove(); } catch (_) {}
  };
  const _ytEarlyTheme = () => {
    try {
      if (S.themeEngineOn && S.themeSelected && "none" !== S.themeSelected) return _ytEarlyThemePaint(S.themeSelected);
      const raw = (() => {
        try {
          const g = "function" == typeof GM_getValue ? GM_getValue("yourtube.cfg", null) : null;
          if (!g) return null;
          const t = "string" == typeof g ? JSON.parse(g) : g;
          return t && "object" == typeof t ? t : null;
        } catch (_) { return null; }
      })();
      if (!raw || !raw.themeEngineOn || !raw.themeSelected || "none" === raw.themeSelected) return;
      _ytEarlyThemePaint(raw.themeSelected);
    } catch (_) {}
  };

  const _brQr = "ytb-theme-token-bridge";
  let _brEl = null,
    _brMO = null,
    _brScans = 0,
    _brRAF = 0,
    _brTheme = null,
    _brCss = "",
    _brTools = null,
    _brLastScan = 0,
    _brKey = "",
    _brTokens = null;
  const _BR_BUDGET = 30;
  const _BR_MIN_GAP = 400;
  const _BR_SCAN_WINDOW = 20000;
  function _brNorm(v) {
    v = String(v || "").trim().toLowerCase();
    let m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(v);
    if (m) {
      let h = m[1];
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      const ch = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
      return "rgb(" + ch.join(",") + ")";
    }
    m = /^rgba?\(([^)]+)\)$/.exec(v);
    if (m) {
      const pp = m[1].split(",").map((x) => x.trim());
      const ch = pp.slice(0, 3).map((x) => String(Math.round(parseFloat(x))));
      return "rgba(" + ch.join(",") + "," + (pp.length === 4 ? pp[3] : "1") + ")";
    }
    return v;
  }

  const _BR_DARK_SURFACE = {
    "rgb(9,9,10)": "a",
    "rgb(15,15,15)": "a",
    "rgb(23,28,35)": "n",
    "rgb(33,33,33)": "n",
    "rgb(43,49,56)": "n",
    "rgb(39,39,39)": "r",
    "rgb(40,40,40)": "r",
    "rgb(48,53,59)": "r",
    "rgb(81,85,97)": "r",
  };
  const _BR_LIGHT_SURFACE = new Set([
    "rgb(255,255,255)",
    "rgb(249,249,249)",
    "rgb(242,242,242)",
    "rgb(241,241,241)",
    "rgb(236,241,251)",
    "rgb(233,233,233)",
    "rgb(229,229,229)",
    "rgb(217,217,217)",
    "rgb(202,206,214)",
    "rgb(218,223,230)",
  ]);
  const _BR_DARK_LAYER = /^rgba\(0,0,0,0\.?(0?5|1|15)\)$/;
  const _BR_LIGHT_LAYER = /^rgba\(255,255,255,0?\.?(0?5|1|15|2|3)\)$/;
  function _brCollect() {
    if (_brTokens) return _brTokens;
    const out = new Map();
    let sheets;
    try {
      sheets = document.styleSheets;
    } catch (e) {
      return out;
    }
    const addScope = (arr, sel) => {

      if (arr.length >= 12) return;
      if (sel.length > 160) return;
      if (arr.indexOf(sel) === -1) arr.push(sel);
    };
    for (const sheet of sheets) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch (e) {
        continue;
      }
      if (!rules) continue;
      const walk = (rs) => {
        for (const rule of rs) {
          if (rule.cssRules && !rule.selectorText) {

            try { walk(rule.cssRules); } catch (e) {}
            continue;
          }
          const st = rule.style;
          if (!st || !rule.selectorText) continue;
          const comps = rule.selectorText.split(",").map((x) => x.trim());
          for (const comp of comps) {
            const notDark = /:not\(\s*\[dark\]\s*\)/.test(comp);
            const side = !notDark && /\[dark\]/.test(comp) ? "d" : "l";
            for (let i = 0; i < st.length; i++) {
              const name = st[i];
              if (!/^--t[0-9a-f]{8,}$/i.test(name)) continue;
              let e = out.get(name);
              if (!e) {
                e = { d: "", l: "", ds: [], ls: [] };
                out.set(name, e);
              }
              const val = _brNorm(st.getPropertyValue(name));
              if (side === "d") {
                if (val && val !== "unset" && val !== "initial") { e.d = val; addScope(e.ds, comp); }
              } else if (val && val !== "unset" && val !== "initial") {
                e.l = val;
                addScope(e.ls, comp);
              }
            }
          }
        }
      };
      try {
        walk(rules);
      } catch (e) {}
    }
    // The stylesheet observer clears this when a sheet node lands, so repeated scans reuse one walk.
    if (out.size) _brTokens = out;
    return out;
  }
  function _brRgba(hex, alpha) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
    if (!m) return null;
    const ch = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
    return "rgba(" + ch.join(",") + "," + alpha + ")";
  }
  function _brBuild(def) {
    const tv = def.vars || {};
    const a = tv["base-background"],
      n = tv["raised-background"],
      r = tv["menu-background"],
      g = tv["10-percent-layer"];
    if (!a) return "";
    const solid = { a: [], n: [], r: [] };
    const bars = [];
    const layers = [];
    const darkScopes = new Set(["[dark]"]);
    const lightScopes = new Set([":root"]);
    _brCollect().forEach((sides, name) => {
      const d = sides.d,
        l = sides.l;
      if (!d || !l) return;
      const remember = (s) => {
        (s === "d" ? sides.ds : sides.ls).forEach((sel) => {

          if (/\[(dark|light)\]$/.test(sel) || /:not\(\s*\[dark\]\s*\)\s*$/.test(sel) ||
              sel === ":root" || /^[a-z][a-z0-9-]*\[dark\]$/.test(sel)) {
            (s === "d" ? darkScopes : lightScopes).add(sel);
          }
        });
      };
      if (_BR_DARK_SURFACE[d] && _BR_LIGHT_SURFACE.has(l)) {
        solid[_BR_DARK_SURFACE[d]].push(name);
        remember("d"); remember("l");
      } else {
        const mb = /^rgba\(15,15,15,(0?\.\d+)\)$/.exec(d);
        if (mb && /^rgba\(255,255,255,0?\.\d+\)$/.test(l)) {
          const tinted = _brRgba(a, mb[1]);
          if (tinted) { bars.push(name + ":" + tinted); remember("d"); remember("l"); }
          return;
        }
        if (_BR_DARK_LAYER.test(d) && _BR_LIGHT_LAYER.test(l) && g) {
          layers.push(name + ":" + g);
          remember("d"); remember("l");
        }
      }
    });
    const decls = [];
    for (const slot of ["a", "n", "r"]) {
      const color = slot === "a" ? a : slot === "n" ? n : r;
      if (!color) continue;
      for (const name of solid[slot]) decls.push(name + ":" + color);
    }
    for (const d of bars) decls.push(d);
    for (const d of layers) decls.push(d);
    if (!decls.length) return "";

    const scopes = def.mode === "light"
      ? [":root"].concat([...lightScopes].filter((x) => x !== ":root").slice(0, 14))
      : ["[dark]"].concat([...darkScopes].filter((x) => x !== "[dark]").slice(0, 14));
    return scopes.join(",") + "{" + decls.map((d) => d + "!important").join(";") + "}";
  }
  function _brMount(css) {
    const head = document.head || document.documentElement;
    if (!head) return;
    if (_brEl && _brEl.isConnected) {
      if (_brEl.textContent !== css) _brEl.textContent = css;
      return;
    }
    const el = document.createElement("style");
    el.id = _brQr;
    el.setAttribute("data-ytb-theme", "1");
    el.textContent = css;
    head.appendChild(el);
    _brEl = el;
  }
  function _brEnsureMounted() {

    if (_brCss && (!_brEl || !_brEl.isConnected)) {
      try {
        _brMount(_brCss);
      } catch (e) {}
    }
  }
  function _brScan() {
    if (!_brTheme) return;
    if (_brScans >= _BR_BUDGET) return;
    const now = (window.performance && performance.now()) || Date.now();
    if (_brScans > 0 && now - _brLastScan < _BR_MIN_GAP) return;
    if (!_brCss && now > _BR_SCAN_WINDOW && _brScans > 0) return;
    _brLastScan = now;
    _brScans++;
    let css = "";
    try {
      css = _brBuild(_brTheme);
    } catch (e) {
      try { h("themeTokenBridge", e && e.message); } catch (e2) {}
      return;
    }

    if (css) {
      if (css !== _brCss) {
        _brCss = css;
        _brMount(css);
      } else {
        _brEnsureMounted();
      }
    } else {
      _brEnsureMounted();
    }
  }
  function _brSchedule(deep) {
    if (_brRAF) return;
    _brRAF = (window.requestAnimationFrame || ((cb) => setTimeout(cb, 16)))(() => {
      _brRAF = 0;
      _brEnsureMounted();
      if (deep) _brScan();
      const tt = (_brTools && _brTools.addTimeout) || ((fn) => setTimeout(fn, 0));
      tt(_brEnsureMounted, 150);
      tt(_brEnsureMounted, 800);
    });
  }
  function _brStop() {
    _brTheme = null;
    _brTools = null;
    _brCss = "";
    _brKey = "";
    _brTokens = null;
    _brScans = 0;
    _brLastScan = 0;
    if (_brMO) { try { _brMO.disconnect(); } catch (e) {} _brMO = null; }
    if (_brEl) { try { _brEl.remove(); } catch (e) {} _brEl = null; }
  }
  function _brStart(def, tools) {
    if (!def || !def.vars || (def.mode !== "dark" && def.mode !== "light")) {
      _brStop();
      return;
    }
    const key = def.id + "|" + def.mode;
    const same = _brKey === key;
    _brTools = tools || _brTools || null;
    _brTheme = def;

    if (same && _brCss && _brMO) {
      _brEnsureMounted();
      return;
    }
    if (!same) {

      if (_brMO) { try { _brMO.disconnect(); } catch (e) {} _brMO = null; }
      if (_brEl) { try { _brEl.remove(); } catch (e) {} _brEl = null; }
      _brCss = "";
      _brScans = 0;
      _brLastScan = 0;
      _brKey = key;
      _brTokens = null;
    }
    _brEnsureMounted();
    _brScan();
    const tt = (_brTools && _brTools.addTimeout) || ((fn) => setTimeout(fn, 0));

    for (const ms of [120, 400, 900, 1800, 3500, 6000, 10000, 15000]) tt(_brScan, ms);

    for (const ms of [250, 700, 2500, 5000, 8000, 12000, 18000]) tt(_brEnsureMounted, ms);
    if (_brMO || !("MutationObserver" in window)) return;
    try {
      let observedHead = document.head;
      _brMO = new MutationObserver((muts) => {

        if (document.head && document.head !== observedHead) {
          try { _brMO.disconnect(); } catch (e) {}
          observedHead = document.head;
          try { _brMO.observe(observedHead, { childList: true }); } catch (e) {}
          _brTokens = null;
          _brSchedule(true);
          return;
        }
        let stylesheetAdded = false;
        for (const rec of muts)
          for (const node of rec.addedNodes)
            if (node.nodeType === 1 &&
              (node.tagName === "LINK" || node.tagName === "STYLE" ||
                (node.querySelector && node.querySelector("link,style"))))
              stylesheetAdded = true;
        if (stylesheetAdded) _brTokens = null;
        if (!_brEl || !_brEl.isConnected || stylesheetAdded)
          _brSchedule(stylesheetAdded);
      });
      if (observedHead) _brMO.observe(observedHead, { childList: true });
    } catch (e) {}
  }
  const qr = "ytb-theme-engine-style";
  function Vr(e) {
    try {
      const t = document.head || document.documentElement;
      if (!t) return;

      if (Hr && Hr.isConnected && Hr.textContent === e) return;
      const a = document.getElementById(qr);
      if (a)
        try {
          a.remove();
        } catch (e) {}
      const n = document.createElement("style");
      ((n.id = qr),
        n.setAttribute("data-ytb-theme", "1"),
        (n.textContent = e),
        t.appendChild(n),
        (Hr = n));
    } catch (e) {
      try {
        h("theme mount", e && e.message);
      } catch (e) {}
    }
  }
  function Fr() {
    try {
      const e = document.head;
      if (!e || !Hr) return;
      e.lastElementChild !== Hr && e.appendChild(Hr);
    } catch (e) {}
  }
  function jr() {
    try {
      Dr && Dr.disconnect();
    } catch (e) {}
    Dr = null;
  }
  function zr() {
    jr();
    try {
      const e = document.getElementById(qr);
      e && e.remove();
    } catch (e) {}
    Hr = null;
  }
  const Wr = "ytb-theme-overhaul-style";
  let Kr = [],
    Yr = !1,
    _themeOrig = null;
  let _overhaulUnsub = null;
    function _overhaulBuildCSS() {
    const glass = !!S.themeGlassOverhaulOn;
    const overhaul = !!S.themeOverhaulOn;
    if (!glass && !overhaul) return "";
    const _ease = S.themeFxReducedMotion ? "none" : "all .18s ease-out";
    const GLASS_BG = "rgba(18,20,26,.62)";
    const GLASS_BG2 = "rgba(18,20,26,.45)";
    const out = [];
    if (glass) {
      out.push(
        "html,html[dark]{background-color:#0d0e12!important}",
        "ytd-app,#content,#page-manager,ytd-page-manager{background:transparent!important}",
        "ytd-masthead{background:" + GLASS_BG + "!important;border-bottom:1px solid rgba(255,255,255,.08)!important;backdrop-filter:blur(24px) saturate(170%);-webkit-backdrop-filter:blur(24px) saturate(170%);box-shadow:0 4px 18px rgba(0,0,0,.4)}",
        "ytd-mini-guide-renderer{background:" + GLASS_BG + "!important;border-right:1px solid rgba(255,255,255,.08)!important;backdrop-filter:blur(24px) saturate(170%);-webkit-backdrop-filter:blur(24px) saturate(170%)}",
        "#guide-content{background:" + GLASS_BG + "!important;backdrop-filter:blur(24px) saturate(170%);-webkit-backdrop-filter:blur(24px) saturate(170%)}",
        "#guide-inner-content,#guide-renderer{background:transparent!important}",
        "#primary,#secondary,#below,ytd-watch-flexy{background:transparent!important}",
        "ytd-rich-grid-renderer,#contents.ytd-rich-grid-renderer{background:transparent!important}",
        "ytd-rich-item-renderer,ytd-rich-grid-media,ytd-video-renderer,ytd-playlist-video-renderer,ytd-grid-video-renderer{background:" + GLASS_BG2 + "!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:14px!important;backdrop-filter:blur(14px) saturate(150%);-webkit-backdrop-filter:blur(14px) saturate(150%);box-shadow:0 6px 18px rgba(0,0,0,.25)}",
        "ytd-rich-item-renderer:hover,ytd-video-renderer:hover{background:rgba(255,255,255,.08)!important;border-color:rgba(255,255,255,.14)!important}",
        "ytd-rich-shelf-renderer>#title,ytd-rich-shelf-renderer .ytd-rich-shelf-renderer{border:0!important;background:transparent!important}",
        "ytd-browse[page-subtype='home'] #primary{background:transparent!important}",
        "ytd-comments,ytd-comment-thread-renderer,ytd-comment-renderer{background:transparent!important}",
        "ytd-watch-metadata,#below,#description,#info-container{background:transparent!important}",
        "#player-container-outer,#player-container-inner,#movie_player{border-radius:16px!important;overflow:hidden!important}",
        "ytd-engagement-panel-section-list-renderer{background:" + GLASS_BG + "!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:14px!important;backdrop-filter:blur(16px) saturate(160%);-webkit-backdrop-filter:blur(16px) saturate(160%)}",
        "ytd-playlist-panel-renderer{background:" + GLASS_BG2 + "!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:14px!important;backdrop-filter:blur(14px) saturate(150%);-webkit-backdrop-filter:blur(14px) saturate(150%)}",
        "ytd-searchbox,ytd-searchbox-spt{background:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:10px!important;backdrop-filter:blur(12px) saturate(150%);-webkit-backdrop-filter:blur(12px) saturate(150%)}",
        "tp-yt-iron-dropdown,ytd-popup-container,paper-menu-button,ytd-multi-page-menu-renderer,ytd-menu-popup-renderer,ytd-simple-menu-header-renderer{background:rgba(20,22,28,.92)!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:12px!important;backdrop-filter:blur(20px) saturate(170%);-webkit-backdrop-filter:blur(20px) saturate(170%);box-shadow:0 24px 60px rgba(0,0,0,.6),0 6px 18px rgba(0,0,0,.4);overflow:hidden}",
        "ytd-channel-renderer,ytd-grid-channel-renderer,ytd-vertical-list-renderer{background:" + GLASS_BG2 + "!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:14px!important}",
        "yt-chip-cloud-chip-renderer{background:transparent!important;transition:" + _ease + "}",
        "yt-chip-cloud-chip-renderer .ytChipShapeChip,yt-chip-cloud-chip-renderer yt-chip-shape{background:rgba(20,22,28,.5)!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:99px!important;transition:" + _ease + "}",
        "yt-chip-cloud-chip-renderer:hover .ytChipShapeChip{background:rgba(20,22,28,.7)!important;border-color:rgba(255,255,255,.18)!important}",
        "yt-chip-cloud-chip-renderer[selected] .ytChipShapeChip,yt-chip-cloud-chip-renderer[aria-selected=true] .ytChipShapeChip{background:linear-gradient(135deg,#ff0033 0%,#ff3d7f 100%)!important;border-color:rgba(255,255,255,.25)!important;color:#fff!important;box-shadow:0 2px 8px rgba(255,61,127,.4)}",
        "yt-live-chat-renderer,#chat,yt-live-chat-item-list-renderer{background:" + GLASS_BG + "!important}",
        "#progress{background:rgba(255,61,127,.85)!important;height:3px!important}",
        "ytd-notification-topbar-renderer,.yt-spec-icon-badge{background:rgba(255,61,127,.85)!important;box-shadow:0 0 10px rgba(255,61,127,.4)}",
        "ytd-comments-header-renderer{background:transparent!important}",
        "ytd-guide-entry-renderer:hover,#guide-content ytd-guide-entry-renderer:hover{background:rgba(255,255,255,.08)!important}",
        "ytd-thumbnail,ytd-thumbnail img,#thumbnail,#thumbnail img{border-radius:12px!important}",
        "ytd-reel-item-renderer,ytd-rich-grid-media{border-radius:14px!important}"
      );
    }
    if (overhaul) {
      out.push(
        "html,html[dark]{--yt-spec-base-background:#111318}",
        "ytd-app,#content{background:linear-gradient(180deg,rgba(20,22,28,.92),rgba(14,15,19,.97))!important}",
        "ytd-rich-item-renderer,ytd-video-renderer,ytd-compact-video-renderer,ytd-playlist-video-renderer,ytd-grid-video-renderer{border-radius:14px!important;transition:" + _ease + "}",
        "ytd-rich-item-renderer:hover,ytd-video-renderer:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,.35)}",
        "ytd-thumbnail,#thumbnail,ytd-thumbnail img{border-radius:12px!important}",
        "ytd-masthead{background:rgba(20,22,28,.6)!important;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}",
        "ytd-mini-guide-renderer{background:rgba(20,22,28,.55)!important}",
        "ytd-watch-metadata,#below,#description,#info-container{background:transparent!important}",
        "#movie_player{border-radius:14px!important;overflow:hidden!important}",
        "tp-yt-iron-dropdown,ytd-menu-popup-renderer,ytd-multi-page-menu-renderer{border-radius:12px!important;border:1px solid rgba(255,255,255,.1)!important;box-shadow:0 18px 50px rgba(0,0,0,.55)!important}",
        "yt-chip-cloud-chip-renderer{border-radius:99px!important}",
        "#guide-content{background:rgba(20,22,28,.4)!important}"
      );
    }
    return out.join("\n");
  }
  function Gr() {
    try {
      const e = document.head || document.documentElement;
      if (!e) return;
      const t = document.getElementById(Wr);
      if (t)
        try {
          t.remove();
        } catch (e) {}
      const a = _overhaulBuildCSS();
      if (!a) return;
      const n = document.createElement("style");
      ((n.id = Wr),
        n.setAttribute("data-ytb-overhaul", "1"),
        (n.textContent = a),
        e.appendChild(n));
    } catch (e) {
      try {
        h("overhaul mount", e && e.message);
      } catch (e) {}
    }
  }
  function Xr() {
    if (!Yr || !document.getElementById(Wr)) ((Yr = !0), Gr());
  }
  function Zr() {
    Yr = !1;
    for (const e of Kr)
      try {
        e();
      } catch (e) {}
    Kr = [];
    try {
      const e = document.getElementById(Wr);
      e && e.remove();
    } catch (e) {}
  }
  function Qr(e) {
    const t = To("div", "ytb-theme-card");

    t.dataset.ytbThemeId = String(e && e.id ? e.id : "");
    S.themeSelected === e.id && t.classList.add("active");
    const a = To("div", "ytb-theme-swatch"),
      n = (e && e.vars) || null;
    if (n) {
      ((a.style.background = n["base-background"] || ""),
        (a.style.borderColor = n.outline || "transparent"));
      const e = To("div", "ytb-theme-accent");
      ((e.style.background = n["call-to-action"] || ""), a.appendChild(e));
    } else
      ((a.style.background = "linear-gradient(135deg,#0f0f0f 50%,#ffffff 50%)"),
        (a.style.borderColor = "rgba(255,255,255,.15)"));
    return (
      t.appendChild(a),
      t.appendChild(To("div", "ytb-theme-name", e.name)),
      t.addEventListener("click", () =>
        Ta("themeSelected", S.themeSelected === e.id ? "none" : e.id),
      ),
      t
    );
  }
  function Jr() {
    const t = [];
    try {
      const a = e.ytInitialPlayerResponse;
      if (!a) return t;
      const n =
          a.playerOverlays &&
          a.playerOverlays.playerOverlayRenderer &&
          a.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer,
        r = n && n.decoratedPlayerBarRenderer,
        o = r && r.playerBar && r.playerBar.multiMarkersPlayerBarRenderer,
        i = o && o.markersMap;
      if (!i) return t;
      for (const e of i) {
        const a = e.value && e.value.chapters;
        if (a)
          for (const e of a) {
            const a = e.chapterRenderer;
            if (!a) continue;
            const n = (a.timeRangeStartMillis || 0) / 1e3,
              r =
                (a.title &&
                  (a.title.simpleText ||
                    (a.title.runs &&
                      a.title.runs.map((e) => e.text).join("")))) ||
                "";
            t.push({ t: n, title: r });
          }
      }
    } catch (e) {
      h("extract chapters", e);
    }
    return t;
  }