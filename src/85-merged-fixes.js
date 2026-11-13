  // ---------------------------------------------------------------------------
  // Merged fixes from "Display YouTube video upload dates as absolute dates"
  // (InMirrors, MIT) and "YouTube polymer engine fixes" (Bogudan).
  // The date renderer is rebuilt on YourTube's own InnerTube helper; the layout
  // fixes are limited to features YourTube does not already ship. The upstream
  // polymer fixes are marked "For personal use only"; keep this build private
  // or reimplement those rules independently before redistributing it.
  // ---------------------------------------------------------------------------

  const _ytAbsPlaylistWords = [
    "playlist", "lista", "liste", "плейлист", "播放列表", "播放清單", "再生リスト",
    "재생목록", "danh sách phát", "प्लेलिस्ट", "قائمة", "เพลย์ลิสต์", "daftar putar",
  ];

  const _ytAbsMonths = (() => {
    try {
      const fmt = new Intl.DateTimeFormat(undefined, { month: "short" });
      return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2020, i, 1)).toUpperCase());
    } catch (_) {
      return ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    }
  })();

  const _ytAbsDays = (() => {
    try {
      const fmt = new Intl.DateTimeFormat(undefined, { weekday: "short" });
      return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2020, 0, 5 + i)));
    } catch (_) {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    }
  })();

  const _ytAbsParseDate = (value) => {
    try {
      if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
      const text = String(value == null ? "" : value);
      if (/^\d+$/.test(text)) {
        const n = Number(text);
        return new Date(text.length <= 10 ? n * 1000 : n);
      }
      // A date-only value is UTC on the wire; building it as a local date keeps
      // the calendar day stable for viewers west of UTC.
      const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(text);
      if (m) {
        // A date-time carries its own offset; let Date honor it. A date-only
        // value is UTC on the wire, so build it locally to keep the day stable.
        if (m[4] !== undefined) {
          const stamp = new Date(text);
          if (!isNaN(stamp.getTime())) return stamp;
        }
        return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
      }
      const d = new Date(text);
      return isNaN(d.getTime()) ? null : d;
    } catch (_) {
      return null;
    }
  };

  const _ytAbsFormatDate = (value) => {
    const d = _ytAbsParseDate(value);
    if (!d) return "";
    const pad = (n) => String(n).padStart(2, "0");
    const get = (key) => d["get" + key]();
    const map = {
      yyyy: String(get("FullYear")),
      yy: String(get("FullYear")).slice(-2),
      MMM: _ytAbsMonths[get("Month")],
      MM: pad(get("Month") + 1),
      dd: pad(get("Date")),
      ww: _ytAbsDays[get("Day")],
      HH: pad(get("Hours")),
      hh: pad((get("Hours") % 12) || 12),
      ap: get("Hours") < 12 ? "AM" : "PM",
      mm: pad(get("Minutes")),
      ss: pad(get("Seconds")),
    };
    const template = String(S.exactDatesFormat || "yyyy-MM-dd").slice(0, 80);
    return template.replace(/yyyy|yy|MMM|MM|dd|ww|HH|hh|ap|mm|ss/g, (token) => map[token]);
  };

  // Each settings apply gets a generation. A late player response from an
  // older generation must not overwrite the new format or mode.
  let _ytAbsGeneration = 0;

  // One shared cache for both card and watch-page lookups. Failures back off for
  // ten minutes so a removed or private video is not refetched on every scan.
  const _ytAbsDates = {
    _cache: new Map(),
    _failed: new Map(),
    _pending: new Map(),
    _page: null,
    _pageAt: 0,

    _getPage() {
      const now = Date.now();
      if (this._page && now - this._pageAt < 60000) return this._page;
      try {
        this._page = _fwParsePage();
      } catch (_) {
        this._page = { apiKey: "" };
      }
      this._pageAt = now;
      return this._page;
    },

    dateFor(videoId) {
      if (!videoId) return Promise.resolve("");
      const pending = this._pending.get(videoId);
      if (pending) return pending;
      const task = this._dateFor(videoId).finally(() => this._pending.delete(videoId));
      this._pending.set(videoId, task);
      return task;
    },

    async _dateFor(videoId) {
      if (!videoId) return "";
      if (this._cache.has(videoId)) return this._cache.get(videoId);
      const failedAt = this._failed.get(videoId);
      if (failedAt && Date.now() - failedAt < 600000) return "";
      const page = this._getPage();
      if (!page || !page.apiKey) return "";
      let auth = null;
      try {
        auth = await _fwSapisidHeader();
      } catch (_) {}
      let resp = null;
      try {
        resp = await _fwInnerTube(page, "player", {
          context: Mt(),
          videoId,
          contentCheckOk: true,
          racyCheckOk: true,
        }, auth);
      } catch (_) {}
      const json = resp && resp.json;
      const micro = json && json.microformat && json.microformat.playerMicroformatRenderer;
      let when = "";
      if (micro) {
        if (micro.liveBroadcastDetails && micro.liveBroadcastDetails.isLiveNow) {
          when = micro.liveBroadcastDetails.startTimestamp || "";
        } else {
          when = micro.publishDate || micro.uploadDate || "";
        }
      }
      if (!when && json && json.videoDetails) when = json.videoDetails.publishDate || "";
      if (!when) {
        if (this._failed.size > 500) this._failed.clear();
        this._failed.set(videoId, Date.now());
        return "";
      }
      if (this._cache.size > 2000) this._cache.clear();
      this._cache.set(videoId, when);
      this._failed.delete(videoId);
      return when;
    },
  };

  const _ytAbsWatchId = () => {
    try {
      if (location.pathname !== "/watch") return "";
      const id = new URLSearchParams(location.search).get("v") || "";
      return /^[\w-]{11}$/.test(id) ? id : "";
    } catch (_) {
      return "";
    }
  };

  const _ytAbsNotDate = /(watching|viewers?|waiting|live now|premiere|views?|visualiza|vistas|vues|aufrufe|просмотр|回視聴|조회수|visualizzazioni|bekeken|wyświetl)/i;

  const _ytAbsFindDateElement = (card) => {
    if (card.matches("yt-lockup-view-model") &&
        card.closest("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer")) {
      return null;
    }
    const groups = card.querySelectorAll(
      '[role="group"], #video-info, #metadata-line, yt-content-metadata-view-model, .ytContentMetadataViewModelMetadataRow',
    );
    let candidate = null;
    for (const group of groups) {
      let texts = Array.from(group.querySelectorAll('[role="text"], [dir="auto"]'));
      if (texts.length < 2) {
        texts = Array.from(group.querySelectorAll(
          "span.yt-content-metadata-view-model-wiz__metadata-text, span.yt-core-attributed-string",
        ));
      }
      texts = texts.filter((el) => !el.classList.contains("ytb-ui-cardmeta") && (el.textContent || "").trim());
      if (texts.length < 2) continue;
      const first = (texts[0].textContent || "").toLowerCase();
      if (_ytAbsPlaylistWords.some((word) => first.includes(word.toLowerCase()))) continue;
      const last = texts[texts.length - 1];
      const text = (last.textContent || "").trim();
      // A card without a date keeps its view count or live status in the last
      // metadata slot; replacing that would delete information.
      if (_ytAbsNotDate.test(text)) continue;
      if (!/\d/.test(text) && !/(yesterday|today|昨天|今天|昨日|今日|어제|오늘)/i.test(text)) continue;
      candidate = last;
    }
    return candidate;
  };

  const _ytAbsRestoreElement = (el) => {
    try {
      if (el.dataset.ytbAbsOrig !== undefined) {
        if (el.firstChild && el.firstChild.nodeType === 3) el.firstChild.nodeValue = el.dataset.ytbAbsOrig;
        else el.textContent = el.dataset.ytbAbsOrig;
      }
      if (el.dataset.ytbAbsTitle !== undefined) el.setAttribute("title", el.dataset.ytbAbsTitle);
      else el.removeAttribute("title");
      delete el.dataset.ytbAbsCard;
      delete el.dataset.ytbAbsOrig;
      delete el.dataset.ytbAbsTitle;
    } catch (_) {}
  };

  const _ytAbsRestore = () => {
    _ytAbsGeneration++;
    document.querySelectorAll("[data-ytb-abs-card]").forEach(_ytAbsRestoreElement);
    document.querySelectorAll("[data-ytb-abs-pending]").forEach((el) => {
      try { delete el.dataset.ytbAbsPending; } catch (_) {}
    });
    document.querySelectorAll("[data-ytb-abs-watch]").forEach((el) => el.remove());
    document.querySelectorAll("[data-ytb-abs-watch-vid]").forEach((el) => {
      try { delete el.dataset.ytbAbsWatchVid; } catch (_) {}
    });
    document.querySelectorAll("[data-ytb-abs-card-vid]").forEach((el) => {
      try { delete el.dataset.ytbAbsCardVid; } catch (_) {}
    });
  };

  xa.register({
    id: "exact-upload-dates",
    name: "Exact Upload Dates",
    summary: "Uses YouTube's own player endpoint to render the exact upload date instead of '3 weeks ago'.",
    cat: "feed",
    masterKey: "exactDatesOn",
    keys: ["exactDatesOn", "exactDatesCards", "exactDatesWatch", "exactDatesFormat", "exactDatesMode"],
    apply(ctx) {
      const generation = ++_ytAbsGeneration;
      if (!S.exactDatesOn || !document.body) return;
      const mode = String(S.exactDatesMode || "replace");
      const separator = " ";

      const applyCardDate = (card, videoId, dateElem) => {
        if (dateElem.dataset.ytbAbsPending) return false;
        dateElem.dataset.ytbAbsPending = videoId;
        _ytAbsDates.dateFor(videoId).then((when) => {
          try {
            if (generation !== _ytAbsGeneration) return;
            delete dateElem.dataset.ytbAbsPending;
            if (!dateElem.isConnected || !card.isConnected) return;
            if (_ytCardMeta.videoIdOf(card) !== videoId) return;
            const formatted = _ytAbsFormatDate(when);
            if (!formatted) return;
            const original = dateElem.textContent || "";
            if (!original) return;
            dateElem.dataset.ytbAbsOrig = original;
            dateElem.dataset.ytbAbsCard = videoId;
            const text = "replace" === mode
              ? formatted
              : "before" === mode
                ? formatted + separator + original
                : original + separator + formatted;
            if (dateElem.firstChild && dateElem.firstChild.nodeType === 3) dateElem.firstChild.nodeValue = text;
            else dateElem.textContent = text;
            if (dateElem.dataset.ytbAbsTitle === undefined) {
              const oldTitle = dateElem.getAttribute("title");
              if (oldTitle !== null) dateElem.dataset.ytbAbsTitle = oldTitle;
            }
            dateElem.title = formatted;
            card.dataset.ytbAbsCardVid = videoId;
          } catch (_) {}
        }).catch(() => {
          if (generation !== _ytAbsGeneration) return;
          try { delete dateElem.dataset.ytbAbsPending; } catch (_) {}
        });
        return true;
      };

      const scanCards = () => {
        let started = 0;
        const cards = document.querySelectorAll(
          _ytCardMeta.CARDS + ", yt-lockup-view-model, ytd-playlist-video-renderer",
        );
        for (const card of cards) {
          if (started >= 8) break;
          const videoId = _ytCardMeta.videoIdOf(card);
          if (!videoId || card.dataset.ytbAbsCardVid === videoId) continue;
          const dateElem = _ytAbsFindDateElement(card);
          if (!dateElem) continue;
          if (dateElem.dataset.ytbAbsCard === videoId) {
            card.dataset.ytbAbsCardVid = videoId;
            continue;
          }
          if (dateElem.dataset.ytbAbsCard) _ytAbsRestoreElement(dateElem);
          if (applyCardDate(card, videoId, dateElem)) started++;
        }
      };

      const scanWatch = () => {
        const videoId = _ytAbsWatchId();
        if (!videoId) return;
        const container = document.querySelector("#date-text") ||
          document.querySelector("#info-strings yt-formatted-string") ||
          document.querySelector("#info-strings") ||
          document.querySelector("ytd-watch-metadata #info");
        if (!container) return;
        if (container.dataset.ytbAbsWatchVid === videoId) return;
        container.querySelectorAll("[data-ytb-abs-watch]").forEach((el) => el.remove());
        // YouTube already prints a year on some locales; do not duplicate it.
        if (/\b(?:19|20)\d{2}\b/.test(container.textContent || "")) {
          container.dataset.ytbAbsWatchVid = videoId;
          return;
        }
        container.dataset.ytbAbsWatchVid = videoId;
        _ytAbsDates.dateFor(videoId).then((when) => {
          try {
            if (generation !== _ytAbsGeneration) return;
            if (!container.isConnected) return;
            if (_ytAbsWatchId() !== videoId) return;
            if (container.dataset.ytbAbsWatchVid !== videoId) return;
            const formatted = _ytAbsFormatDate(when);
            if (!formatted) {
              delete container.dataset.ytbAbsWatchVid;
              return;
            }
            if (container.querySelector("[data-ytb-abs-watch]")) return;
            const span = document.createElement("span");
            span.dataset.ytbAbsWatch = videoId;
            span.textContent = formatted;
            span.title = formatted;
            span.style.marginInlineStart = "8px";
            if ("before" === mode) container.prepend(span);
            else container.append(span);
          } catch (_) {}
        }).catch(() => {
          if (generation !== _ytAbsGeneration) return;
          try { delete container.dataset.ytbAbsWatchVid; } catch (_) {}
        });
      };

      if (S.exactDatesCards) {
        ctx.addObserver(document.body, YourTubeResources.DeferredTask.debounce.bind(null, "ytb-absdate", scanCards, 600), {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["href"],
        });
        ctx.addInterval(scanCards, 6000);
        ctx.onNav(() => ctx.addTimeout(scanCards, 1000));
        ctx.addTimeout(scanCards, 1200);
      }
      if (S.exactDatesWatch) {
        ctx.addInterval(scanWatch, 2500);
        ctx.onNav(() => ctx.addTimeout(scanWatch, 800));
        ctx.addTimeout(scanWatch, 900);
      }
      Yt["exact-upload-dates"].push(_ytAbsRestore);
    },
    settings(en) {
      en.appendChild(Io("Enable exact upload dates", "exactDatesOn"));
      en.appendChild(Io("On feed, search and sidebar cards", "exactDatesCards"));
      en.appendChild(Io("On watch pages", "exactDatesWatch"));
      en.appendChild(_o("Date format (yyyy, MM, dd, HH, mm)", "exactDatesFormat"));
      en.appendChild(Ro("Relative date", "exactDatesMode", {
        replace: "Replace it",
        after: "Show after",
        before: "Show before",
      }));
      en.appendChild(To("div", "ytb-hist-note",
        "Dates come from YouTube's own player endpoint. Watch pages always keep YouTube's own date and add the exact one beside it."));
    },
  });

  // ---------------------------------------------------------------------------
  // Layout fixes
  // ---------------------------------------------------------------------------

  Ha(
    "static-header",
    "Static Header",
    "Keeps the masthead and mini guide in the page flow so they scroll away.",
    "staticHeaderOn",
    "#masthead-container,ytd-masthead,ytd-mini-guide-renderer,app-drawer#guide{position:absolute!important}" +
    "ytd-feed-filter-chip-bar-renderer{position:relative!important}" +
    "ytd-feed-filter-chip-bar-renderer:not([not-sticky])>#chips-wrapper{position:absolute!important;top:0!important}" +
    "ytd-rich-grid-renderer>#chips-wrapper{position:absolute!important;top:0!important}" +
    "#frosted-glass.with-chipbar{display:none!important}",
    "appearance",
  );

  Ha(
    "unclamp-titles",
    "Unclamp Titles",
    "Removes the line limit on video titles in cards and lockups.",
    "unclampTitlesOn",
    "#video-title,.ytLockupMetadataViewModelTitle{max-height:none!important;-webkit-line-clamp:none!important}" +
    "yt-lockup-metadata-view-model.yt-lockup-metadata-view-model-wiz--compact a.yt-lockup-metadata-view-model-wiz__title{max-height:unset!important;display:unset!important}" +
    ".yt-lockup-metadata-view-model-wiz--standard.yt-lockup-metadata-view-model-wiz--rich-grid-legacy-typography .yt-lockup-metadata-view-model-wiz__title{display:block!important;max-height:unset!important}" +
    ".yt-lockup-metadata-view-model-wiz--standard .yt-lockup-metadata-view-model-wiz__title{overflow:unset!important;max-height:unset!important}" +
    ".yt-lockup-metadata-view-model__title{-webkit-line-clamp:unset!important;max-height:unset!important}",
    "appearance",
  );

  Ha(
    "hide-metadata-rows",
    "Hide Metadata Rows",
    "Removes the games, movies and music metadata rows under a video.",
    "hideMetadataRowsOn",
    "ytd-metadata-row-container-renderer{display:none!important}",
    "appearance",
  );

  Ha(
    "hide-transcript-panel",
    "Hide Transcript Panel",
    "Keeps the transcript engagement panel out of the watch page.",
    "hideTranscriptPanelOn",
    "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-transcript']{display:none!important}",
    "playback",
  );

  Ha(
    "hide-description-panel",
    "Hide Description Panel",
    "Keeps the structured description side panel out of the watch page.",
    "hideDescriptionPanelOn",
    "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-structured-description']{display:none!important}",
    "playback",
  );

  Ha(
    "no-double-tap-overlay",
    "No Double-Tap Overlay",
    "Removes the large rewind and forward animation over the player.",
    "noDoubleTapOverlayOn",
    "div.ytp-doubletap-ui,div.ytp-doubletap-ui-legacy{display:none!important}",
    "playback",
  );

  Ha(
    "hide-video-shelves",
    "Hide Video Shelves",
    "Removes Shorts shelves that appear around a video.",
    "hideVideoShelvesOn",
    "ytd-watch-flexy ytd-reel-shelf-renderer," +
    "ytd-watch-flexy ytd-rich-shelf-renderer[is-shorts]," +
    "ytd-watch-flexy ytd-rich-section-renderer:has(ytd-reel-shelf-renderer){display:none!important}",
    "feed",
  );

  const _ytPlayerHeight = (value) => {
    const height = Number(value);
    return [0, 144, 240, 360, 480, 720].includes(height) ? height : 0;
  };

  xa.register({
    id: "fixed-player-size",
    name: "Player Size",
    summary: "Sets a fixed player height in normal and theater mode and aligns it in its column.",
    cat: "playback",
    masterKey: "playerSizeOn",
    keys: ["playerSizeOn", "playerHeightNormal", "playerHeightTheater", "playerAlign"],
    apply(ctx) {
      if (!S.playerSizeOn) return;
      const normal = _ytPlayerHeight(S.playerHeightNormal);
      const theater = _ytPlayerHeight(S.playerHeightTheater);
      const align = String(S.playerAlign || "0");
      let css = "";
      if (normal) {
        css +=
          "ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen]):not([theater]){" +
          `--ytd-watch-flexy-min-player-height:${normal}px!important;` +
          `--ytd-watch-flexy-max-player-height:${normal}px!important;` +
          "--ytd-watch-flexy-max-player-width:var(--ytd-watch-flexy-min-player-width)!important}" +
          "ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen]):not([theater])[is-vertical-video_]{" +
          `--ytd-watch-flexy-min-player-width:calc(${normal}px*16/9)!important}` +
          "ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen]):not([theater]):not([is-vertical-video_]){" +
          `--ytd-watch-flexy-min-player-width:calc(${normal}px*var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))!important}` +
          "ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen]):not([theater]) div#player.ytd-watch-flexy{" +
          "min-width:var(--ytd-watch-flexy-min-player-width);max-width:var(--ytd-watch-flexy-max-player-width);" +
          "left:50%;transform:translate(-50%,0)}" +
          "ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen]):not([theater]) div#player-container-outer.ytd-watch-flexy{" +
          `height:var(--ytd-watch-flexy-max-player-height);min-width:calc(${normal}px*var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))!important}`;
      }
      if (theater) {
        css +=
          "ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen])[theater] #player-theater-container," +
          "ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen])[theater] #player-wide-container," +
          "ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen])[theater] #player-full-bleed-container{" +
          `min-width:calc(${theater}px*var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))!important;` +
          `max-width:calc(${theater}px*var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))!important;` +
          `min-height:${theater}px!important;max-height:${theater}px!important;height:${theater}px!important}` +
          `ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen])[theater] div#movie_player{height:${theater}px;width:calc(${theater}px*var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))}`;
      }
      if ("1" === align) css += "#player-container-outer{margin-left:0!important}";
      if ("2" === align) css += "#player-container-outer{margin-right:0!important}#player-theater-container,#player-wide-container,#player-full-bleed-container{margin-left:auto!important}";
      if (css) ctx.addStyle(css);

      if (normal || theater) {
        const resize = () => {
          try {
            const player = document.getElementById("movie_player");
            if (!player || typeof player.setInternalSize !== "function") return;
            if (typeof player.isFullscreen === "function" && player.isFullscreen()) return;
            const flexy = document.querySelector("ytd-watch-flexy");
            const target = flexy && flexy.hasAttribute("theater") ? theater : normal;
            if (!target) return;
            const size = typeof player.getPlayerSize === "function" ? player.getPlayerSize() : null;
            if (!size || size.height !== target) player.setInternalSize();
          } catch (_) {}
        };
        ctx.addInterval(resize, 1500);
      }
    },
    settings(en) {
      en.appendChild(Io("Use a fixed player size", "playerSizeOn"));
      en.appendChild(Ro("Normal mode height", "playerHeightNormal", {
        0: "Default", 144: "144px", 240: "240px", 360: "360px", 480: "480px", 720: "720px",
      }));
      en.appendChild(Ro("Theater mode height", "playerHeightTheater", {
        0: "Default", 144: "144px", 240: "240px", 360: "360px", 480: "480px", 720: "720px",
      }));
      en.appendChild(Ro("Alignment", "playerAlign", {
        0: "Center (default)", 1: "Left", 2: "Right",
      }));
      en.appendChild(To("div", "ytb-hist-note",
        "Fixed heights are ignored in fullscreen. Width follows the video's aspect ratio."));
    },
  });

  xa.register({
    id: "description-width",
    name: "Description Width",
    summary: "Sets the width of the watch page columns, including the suggested videos sidebar.",
    cat: "appearance",
    masterKey: "descriptionWidthOn",
    keys: ["descriptionWidthOn", "descriptionWidthPreset"],
    apply(ctx) {
      if (!S.descriptionWidthOn) return;
      const widths = {
        0: 0, stretch: "100vw", 1200: "1200px", 1280: "1280px", 1360: "1360px",
        1440: "1440px", 1520: "1520px", 1600: "1600px", 1680: "1680px",
        1760: "1760px", 1840: "1840px", 1920: "1920px",
      };
      const width = widths[String(S.descriptionWidthPreset || "0")] || 0;
      if (!width) return;
      ctx.addStyle(
        `ytd-app:not([mini-guide-visible_]) ytd-page-manager{--ytf-width:calc(${width} - 20px);min-width:100%}` +
        `ytd-app[mini-guide-visible_] ytd-page-manager{--ytf-width:calc(${width} - 92px);min-width:calc(100% - 92px)}` +
        "ytd-watch-flexy[flexy][fullscreen]{min-width:100%!important}" +
        "ytd-watch-flexy[flexy] #columns{" +
        "--ytd-watch-flexy-min-player-width:calc(var(--ytf-width) - var(--ytd-watch-flexy-sidebar-width) - 3*var(--ytd-margin-6x));" +
        "min-width:var(--ytf-width)!important;max-width:var(--ytf-width)!important}" +
        "ytd-watch-flexy[flexy][is-two-columns_]:not([is-four-three-to-sixteen-nine-video_]):not([is-extra-wide-video_]) div#primary.ytd-watch-flexy{" +
        "max-width:var(--ytd-watch-flexy-max-player-width);min-width:var(--ytd-watch-flexy-min-player-width)}" +
        "ytd-watch-flexy[flexy][is-vertical-video_] div#player-container-inner.ytd-watch-flexy{" +
        "width:calc(var(--ytd-watch-flexy-min-player-height)*1.7777777778);position:relative;transform:translate(-50%,0);margin-left:50%}",
      );
    },
    settings(en) {
      en.appendChild(Io("Set a custom watch page width", "descriptionWidthOn"));
      en.appendChild(Ro("Width", "descriptionWidthPreset", {
        0: "Default", stretch: "Full window", 1200: "1200px", 1280: "1280px", 1360: "1360px",
        1440: "1440px", 1520: "1520px", 1600: "1600px", 1680: "1680px",
        1760: "1760px", 1840: "1840px", 1920: "1920px",
      }));
      en.appendChild(To("div", "ytb-hist-note",
        "Conflicts with Wide Player, which already stretches the columns. Pick one."));
    },
  });

  xa.register({
    id: "channel-banner-mode",
    name: "Channel Banner",
    summary: "Scrolls the channel banner away or hides it entirely.",
    cat: "channels",
    masterKey: "channelBannerMode",
    isOn: () => String(S.channelBannerMode || "default") !== "default",
    keys: ["channelBannerMode"],
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
    },
    settings(en) {
      en.appendChild(Ro("Banner behaviour", "channelBannerMode", {
        default: "Default", scroll: "Scroll it away", hide: "Hide it entirely",
      }));
    },
  });

  xa.register({
    id: "channel-landing-tab",
    name: "Channel Landing Tab",
    summary: "Opens a channel on the tab you use most instead of its home page.",
    cat: "channels",
    masterKey: "channelLandingTab",
    isOn: () => String(S.channelLandingTab || "home") !== "home",
    keys: ["channelLandingTab"],
    apply(ctx) {
      const tabs = {
        videos: "/videos", shorts: "/shorts", live: "/streams", playlists: "/playlists",
        community: "/community", about: "/about",
      };
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
      ctx.onNav(() => {
        run();
        ctx.addTimeout(run, 300);
      });
    },
    settings(en) {
      en.appendChild(Ro("Open channels on", "channelLandingTab", {
        home: "Home (default)", videos: "Videos", shorts: "Shorts", live: "Live",
        playlists: "Playlists", community: "Community", about: "About",
      }));
      en.appendChild(To("div", "ytb-hist-note",
        "Only applies when you land on a channel's root URL. Deep links are left alone."));
    },
  });

  xa.register({
    id: "resume-timestamps",
    name: "Resume Timestamps",
    summary: "Strips YouTube's resume timestamps from links and can restyle the red resume bar.",
    cat: "privacy",
    masterKey: "resumeBarStyle",
    settingsAlways: true,
    isOn: () => !!S.stripResumeTimesOn || String(S.resumeBarStyle || "default") !== "default",
    keys: ["stripResumeTimesOn", "resumeBarStyle"],
    apply(ctx) {
      const bar = String(S.resumeBarStyle || "default");
      if ("full" === bar) {
        ctx.addStyle(
          "div.ytd-thumbnail-overlay-resume-playback-renderer{width:100%!important}" +
          "yt-thumbnail-overlay-progress-bar-view-model{width:100%!important}",
        );
      } else if ("hide" === bar) {
        ctx.addStyle(
          "ytd-thumbnail-overlay-resume-playback-renderer," +
          "yt-thumbnail-overlay-progress-bar-view-model{display:none!important}",
        );
      }
      if (!S.stripResumeTimesOn) return;

      const clean = (anchor) => {
        if (!anchor || anchor.tagName !== "A") return;
        const href = anchor.getAttribute("href") || "";
        if (!/\/watch\?/.test(href) || !/[?&]t=/.test(href)) return;
        try {
          const url = new URL(href, location.origin);
          url.searchParams.delete("t");
          anchor.setAttribute("href", url.pathname + url.search + url.hash);
        } catch (_) {}
        // Polymer keeps its own copy of the endpoint, so the DOM href alone is
        // not enough on soft navigation. Both shapes are guarded.
        try {
          const data = anchor.data || (anchor.__data && anchor.__data.data);
          const web = data && data.commandMetadata && data.commandMetadata.webCommandMetadata;
          if (web && typeof web.url === "string") {
            web.url = web.url.replace(/([?&])t=\d+s?&?/, "$1").replace(/[?&]$/, "");
          }
          const endpoint = data && data.watchEndpoint;
          if (endpoint && endpoint.startTimeSeconds) delete endpoint.startTimeSeconds;
        } catch (_) {}
      };

      const scan = () => {
        document.querySelectorAll('a[href*="/watch?"][href*="t="]').forEach(clean);
      };
      scan();
      ctx.addObserver(document.body, YourTubeResources.DeferredTask.debounce.bind(null, "ytb-resume-times", scan, 400), {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["href"],
      });
      ctx.addInterval(scan, 4000);
      ctx.onNav(() => ctx.addTimeout(scan, 700));
    },
    settings(en) {
      en.appendChild(Io("Remove resume timestamps from video links", "stripResumeTimesOn"));
      en.appendChild(Ro("Resume bar", "resumeBarStyle", {
        default: "Default", full: "Full thumbnail width", hide: "Hide it",
      }));
      en.appendChild(To("div", "ytb-hist-note",
        "Timestamps in the address bar and shared links are untouched; only link targets on the page are rewritten."));
    },
  });

  xa.register({
    id: "thumbnail-sizes",
    name: "Thumbnail Sizes",
    summary: "Sets fixed thumbnail widths in search, the watch sidebar and channel grids.",
    cat: "appearance",
    masterKey: "thumbnailSizesOn",
    keys: ["thumbnailSizesOn", "searchThumbSize", "watchSidebarThumbSize", "channelGridThumbSize"],
    apply(ctx) {
      if (!S.thumbnailSizesOn) return;
      const search = Number(S.searchThumbSize) || 0;
      const sidebar = Number(S.watchSidebarThumbSize) || 0;
      const channel = Number(S.channelGridThumbSize) || 0;

      if (search) {
        ctx.addStyle(
          `ytd-search ytd-video-renderer ytd-thumbnail.ytd-video-renderer,` +
          `ytd-search ytd-playlist-renderer ytd-playlist-thumbnail.ytd-playlist-renderer,` +
          `ytd-search ytd-channel-renderer #avatar-section.ytd-channel-renderer,` +
          `ytd-search ytd-radio-renderer ytd-thumbnail.ytd-radio-renderer,` +
          `ytd-search ytd-radio-renderer ytd-playlist-thumbnail.ytd-radio-renderer{` +
          `min-width:${search}px!important;max-width:${search}px!important}` +
          `ytd-search ytd-radio-renderer{--ytd-thumbnail-max-width:${search}px;--ytd-thumbnail-min-width:${search}px}`,
        );
      }

      if (sidebar) {
        ctx.addStyle(
          `#secondary #secondary-inner{min-width:${sidebar + 240}px!important}` +
          `#secondary yt-lockup-view-model a.ytLockupViewModelContentImage,` +
          `#secondary ytd-compact-video-renderer ytd-thumbnail,` +
          `#secondary ytd-compact-video-renderer ytd-thumbnail a{` +
          `width:${sidebar}px!important;min-width:${sidebar}px!important;max-width:${sidebar}px!important}`,
        );
      }

      if (channel) {
        ctx.addStyle(
          `ytd-browse[page-subtype="channels"] ytd-rich-grid-renderer #contents{display:block!important}` +
          `ytd-browse[page-subtype="channels"] ytd-rich-grid-renderer ytd-rich-grid-row{display:inline!important}` +
          `ytd-browse[page-subtype="channels"] ytd-rich-grid-renderer ytd-rich-grid-row>div{display:inline!important;margin:0!important}` +
          `ytd-browse[page-subtype="channels"] ytd-rich-grid-renderer ytd-rich-item-renderer` +
          `:not([style*="display: none"]):not([style*="display:none"]):not([hidden])` +
          `:not(.ytb-extra-watched-hide):not(.ytb-extra-live):not(.ytb-extra-premiere){` +
          `display:inline-block!important;width:${channel}px!important;contain:none!important;` +
          `margin-left:calc(var(--ytd-rich-grid-item-margin)/2)!important;margin-right:calc(var(--ytd-rich-grid-item-margin)/2)!important}` +
          `ytd-browse[page-subtype="channels"] div.ytContentMetadataViewModelMetadataRow{flex-wrap:wrap}`,
        );
      }
    },
    settings(en) {
      en.appendChild(Io("Use fixed thumbnail sizes", "thumbnailSizesOn"));
      en.appendChild(Ro("Search results", "searchThumbSize", {
        0: "Default", 240: "240px", 360: "360px",
      }));
      en.appendChild(Ro("Watch sidebar", "watchSidebarThumbSize", {
        0: "Default", 180: "180px", 240: "240px", 360: "360px", 480: "480px",
      }));
      en.appendChild(Ro("Channel grid", "channelGridThumbSize", {
        0: "Default", 180: "180px", 240: "240px", 360: "360px", 480: "480px",
      }));
      en.appendChild(To("div", "ytb-hist-note",
        "Channel grids switch to inline cards, matching the original fixes script. Turn Dense Grid off when using a channel width."));
    },
  });
