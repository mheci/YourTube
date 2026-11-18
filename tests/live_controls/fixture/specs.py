"""Scenario definitions for the built bundle; none installs substitute feature logic."""

S = {}
watch = "/watch?v=LabVideo001"
short = "/shorts/LabVideo001"
search = "/results?search_query=field"
playlist = "/playlist?list=PLfixture"
channel = "/@FieldLab/videos"
home = "/"
subs = "/feed/subscriptions"
player = """<ytd-watch-flexy flexy><div id="player-container"><div class="html5-video-player" id="movie_player"><video class="html5-main-video" preload="auto" src="/audit/media.webm"></video><div class="ytp-progress-bar-container"><div class="ytp-progress-bar"></div></div><div class="ytp-chrome-controls"><div class="ytp-left-controls"><button class="ytp-play-button ytp-button">▶</button></div><div class="ytp-right-controls"><button class="ytp-subtitles-button ytp-button" aria-pressed="false" onclick="this.setAttribute('aria-pressed',String(this.getAttribute('aria-pressed')!=='true'))">CC</button><button class="ytp-size-button ytp-button" onclick="this.closest('ytd-watch-flexy').toggleAttribute('theater')">▭</button><button class="ytp-fullscreen-button ytp-button">⛶</button></div></div></div></div><div id="below"><ytd-watch-metadata><div id="above-the-fold"><div id="title"><h1>Field recording</h1></div><div id="owner"><ytd-channel-name><a href="/@FieldLab">Field Lab</a></ytd-channel-name></div></div></ytd-watch-metadata><div id="description-inline-expander">A field recording made for this isolated browser test.</div></div></ytd-watch-flexy>"""


def card(
    i=1,
    title="Field recording",
    owner="FieldLab",
    views="2K",
    age="2 days",
    duration="2:00",
    tag="ytd-video-renderer",
):
    return f'<{tag} rendered-from-rich-grid data-n="{i}"><div id="dismissible"><a id="thumbnail" href="/watch?v=LabVideo00{i}"><ytd-thumbnail-overlay-time-status-renderer><span id="text">{duration}</span></ytd-thumbnail-overlay-time-status-renderer></a> · <a id="video-title" href="/watch?v=LabVideo00{i}">{title}</a><div id="metadata"><ytd-channel-name><a href="/@{owner}">{owner}</a></ytd-channel-name>　<span id="metadata-line"><span>{views} views</span> · <span>{age} ago</span></span></div></div></{tag}>'


cards = card() + card(2, "Night recording", "NightLab", "28K", "1 week", "12:00")
res = (
    '<ytd-search><div id="primary"><ytd-item-section-renderer><div id="contents">'
    + cards
    + "</div></ytd-item-section-renderer></div></ytd-search>"
)
pl = (
    '<ytd-playlist-header-renderer><div id="buttons"></div></ytd-playlist-header-renderer><div id="contents" class="ytd-playlist-video-list-renderer">'
    + "".join(card(i, "Episode " + str(i), tag="ytd-playlist-video-renderer") for i in range(1, 4))
    + "</div>"
)


def test(
    id,
    html,
    measure,
    expect,
    *,
    path=watch,
    cfg=None,
    setup="",
    action="",
    click="",
    wait="",
    key="",
    reset=False,
    before=None,
    note="",
    limit=6500,
    change=True,
):
    S[id] = {k: v for k, v in locals().items() if k != "id"}


def css(id, html, selector, prop, want, **kw):
    test(id, html, f"sty({selector!r},{prop!r})", f"x==={want!r}", reset=True, **kw)


def hide(id, tag, **kw):
    if tag.startswith("<"):
        html = tag
    else:
        html = f'<{tag} id="sample" class="specimen">Target item</{tag}>'
    css(id, html, "#sample", "display", "none", **kw)


def node(id, html, sel, **kw):
    test(id, html, f"visible({sel!r})", "x===true", **kw)


idb = "{videoId:'LabVideo001',title:'Field recording',channel:'Field Lab',lastWatched:Date.now(),lastPosition:32,duration:120,progress:.27,completed:true,totalWatchTime:120}"
historyrow = "await dbop('history','put'," + idb + ")"
chapterdata = "window.ytInitialPlayerResponse={playerOverlays:{playerOverlayRenderer:{decoratedPlayerBarRenderer:{decoratedPlayerBarRenderer:{playerBar:{multiMarkersPlayerBarRenderer:{markersMap:[{value:{chapters:[{chapterRenderer:{timeRangeStartMillis:0,title:{simpleText:'Intro'}}},{chapterRenderer:{timeRangeStartMillis:30000,title:{simpleText:'Chapter two'}}}]}}]}}}}}}}"
test(
    "speed-controller",
    player,
    "v().playbackRate",
    "x===1.75",
    cfg={"speedDefault": 1.75},
)
test(
    "speed-per-channel",
    player,
    "v().playbackRate",
    "x===2.25",
    setup="await YourTube.storage.set('__perChannelSpeed__',{'@fieldlab':{r:2.25,ts:Date.now()}})",
)
test("loop-video", player, "v().loop", "x===true", reset=True)
test(
    "ab-repeat",
    player,
    "Math.floor(v().currentTime)",
    "x>=5&&x<=6",
    cfg={"abA": 5, "abB": 12},
    setup="v().currentTime=14",
    action="ev(v(),'timeupdate')",
)
quality = "mp()._quality='small';mp().getAvailableQualityLevels=()=>['hd1080','hd720','small'];mp().getPlaybackQuality=()=>mp()._quality;mp().setPlaybackQualityRange=(q)=>mp()._quality=q;mp().setPlaybackQuality=(q)=>mp()._quality=q"
test(
    "auto-hd",
    player,
    "mp()._quality",
    "x==='hd720'",
    setup=quality,
    cfg={"qualityPref": "hd720"},
    note="Instrumented player quality API; not a network quality claim.",
)
test(
    "force-cc",
    player,
    "q('.ytp-subtitles-button').getAttribute('aria-pressed')",
    "x==='true'",
    cfg={"ccSkipMusic": False, "ccRespectManualOff": True},
    note="Player without a captions API: real CC-button fallback.",
)
test(
    "autoskip-ad-btn",
    player
    + '<button class="ytp-ad-skip-button-modern" onclick="this.textContent=\'Skipped\'">Skip ad</button>',
    "tx('.ytp-ad-skip-button-modern')",
    "x==='Skipped'",
    setup="mp().classList.add('ad-showing');mp().append(q('.ytp-ad-skip-button-modern'))",
)
test(
    "pip-button",
    player,
    "!!document.pictureInPictureElement",
    "x===true",
    action="settings('pip-button')",
    click="text=Toggle PiP now",
)
test(
    "screenshot",
    player,
    "window.downloadName||''",
    "/yourtube-.*\\.jpg$/.test(x)",
    setup="document.addEventListener('click',e=>{if(e.target.download){window.downloadName=e.target.download;window.dataHead=e.target.href.slice(0,22);e.preventDefault()}},true)",
    cfg={"screenshotFmt": "jpg", "screenshotScale": 0.5, "screenshotClipboard": False},
    click="#ytb-shot-btn",
)
test(
    "theater-default",
    player,
    "q('ytd-watch-flexy').hasAttribute('theater')",
    "x===true",
)
css(
    "cinema-mode",
    player,
    "#ytb-cinema-backdrop",
    "opacity",
    "0.65",
    cfg={"cinemaOp": 0.65},
)
css("compact-ui", player, "#title h1", "font-size", "18px")
test(
    "video-filters",
    player,
    "sty('video','filter')",
    "x.includes('brightness(1.4)')&&x.includes('grayscale(1)')",
    cfg={"vfBright": 140, "vfGray": True},
    reset=True,
)
for id, tag in [
    (
        "hide-recs",
        '<div id="secondary"><div id="sample" class="specimen">Related recordings</div></div>',
    ),
    ("hide-comments", "ytd-comments"),
    (
        "hide-endscreen",
        '<div id="sample" class="ytp-cards-teaser specimen">End-card teaser</div>',
    ),
    ("hide-livechat", "ytd-live-chat-frame"),
    (
        "hide-watermark",
        '<div id="sample" class="ytp-watermark specimen">Channel watermark</div>',
    ),
    ("hide-cards", '<button id="sample" class="ytp-cards-button">ⓘ Info card</button>'),
    ("hide-masthead", "ytd-masthead"),
    ("hide-banner-ads", "ytd-ad-slot-renderer"),
    ("block-yt-ai", "ytd-ai-summary-renderer"),
    ("hide-community-posts", "ytd-backstage-post-thread-renderer"),
    (
        "hide-upnext",
        '<div id="sample" class="ytp-ce-covering-overlay specimen">Next video</div>',
    ),
    (
        "hide-video-shelves",
        '<ytd-watch-flexy><ytd-reel-shelf-renderer id="sample" class="specimen">Shorts shelf</ytd-reel-shelf-renderer></ytd-watch-flexy>',
    ),
    ("hide-metadata-rows", "ytd-metadata-row-container-renderer"),
    (
        "hide-transcript-panel",
        '<ytd-engagement-panel-section-list-renderer id="sample" class="specimen" target-id="engagement-panel-transcript">Transcript</ytd-engagement-panel-section-list-renderer>',
    ),
    (
        "hide-description-panel",
        '<ytd-engagement-panel-section-list-renderer id="sample" class="specimen" target-id="engagement-panel-structured-description">Details</ytd-engagement-panel-section-list-renderer>',
    ),
    (
        "no-double-tap-overlay",
        '<div id="sample" class="ytp-doubletap-ui specimen">10 seconds</div>',
    ),
]:
    if id == "hide-recs":
        test(id, tag, "visible('#sample')", "x===false", reset=True)
    else:
        hide(id, tag)
for id, cfg in [
    ("channel-blocker", {"channelBlockerList": "@FieldLab"}),
    ("keyword-filter", {"keywordFilterList": "Field recording"}),
    ("hide-low-views", {"lowViewThreshold": 5000}),
]:
    test(
        id,
        res,
        "qa('ytd-video-renderer').map(n=>n.getClientRects().length>0)",
        "x[0]===false&&x[1]===true",
        path=search,
        cfg=cfg,
        reset=True,
    )
test(
    "geo-override",
    res,
    "navigator.language",
    "x.toLowerCase().startsWith('fr')",
    cfg={
        "geoLang": "fr",
        "geoRegion": "FR",
        "geoPatchNavigator": True,
        "geoPatchFetch": False,
        "geoPatchXHR": False,
        "geoPatchBeacon": False,
    },
    note="Browser language override only; not a regional availability test.",
)
for id, sel in [
    ("stats-overlay", "#ytb-stats"),
    ("diag-console", "#ytb-diag"),
    ("fps-counter", "#ytb-fps-box"),
    ("buffer-health", "#ytb-buf-box"),
    ("dropped-frame-counter", "#ytb-drop-box"),
]:
    test(id, player, f"tx({sel!r})", 'typeof x==="string"&&x.trim().length>1')
test(
    "perf-profiler",
    player,
    "tx('.ytb-perf-panel')",
    "x.includes('loop-video')",
    action="YourTube.features.apply('loop-video');settings('perf-profiler')",
)
test(
    "default-audio-track",
    player,
    "mp().track",
    "x==='original'",
    setup="mp().track='dub';mp().getAudioTrack=()=>({id:mp().track});mp().getAvailableAudioTracks=()=>[{id:'dub',isDefault:true},{id:'original',audioIsOriginal:true}];mp().setAudioTrack=t=>mp().track=t.id",
    note="Fixture player advertises a default dub before the original track.",
)
test(
    "restore-fullscreen-scrolling",
    player,
    "sty('#movie_player','overflow')",
    "x==='auto'",
    setup="await mp().requestFullscreen()",
    reset=True,
)
test(
    "remove-redirect-urls",
    '<a id="out" href="/redirect?q=https%3A%2F%2Fexample.org%2Fread">Read the field notes</a>',
    "q('#out').getAttribute('href')",
    "x==='https://example.org/read'",
    note="Relative YouTube redirect; only HTTP(S) destinations should be rewritten.",
)
test(
    "shorten-share-url",
    '<a id="share" href="https://youtu.be/LabVideo001?si=one&t=5">Share link</a>',
    "q('#share').getAttribute('href')",
    "x==='https://youtu.be/LabVideo002?t=18'",
    action="q('#share').href='https://youtu.be/LabVideo002?t=18&si=two'",
    note="One anchor is reused for a second video.",
)
test(
    "skip-paused-continue",
    '<yt-confirm-dialog-renderer><p>Video paused. Continue watching?</p><div id="confirm-button"><button onclick="this.textContent=\'Confirmed\'">Yes</button></div></yt-confirm-dialog-renderer>',
    "tx('#confirm-button')",
    "x==='Confirmed'",
)
test(
    "click-logo-to-subs",
    '<a id="logo" href="/">YouTube</a>',
    "location.pathname",
    "x==='/feed/subscriptions'",
    click="#logo",
)
test(
    "default-channel-tab",
    "<h2>Channel home</h2>",
    "location.pathname",
    "x==='/@FieldLab/videos'",
    path="/@FieldLab",
    cfg={"defaultChannelTab": "videos"},
)
hide(
    "hide-top-live-games",
    '<ytd-shelf-renderer id="sample" class="specimen"><h2>Top live games</h2></ytd-shelf-renderer>',
)
test(
    "hfr-allow",
    player,
    "document.body.innerText.includes('Available qualities: hd1080, hd720, small')",
    "x===true",
    setup=quality,
)
test(
    "auto-recover-video",
    player,
    "!v().paused",
    "x===true",
    action="ev(window,'online')",
)
test(
    "forward-rewind-buttons",
    player,
    "Math.round(v().currentTime)",
    "x===27",
    setup="v().currentTime=10",
    cfg={"forwardRewindSec": 17},
    click=".ytb-fr-btn >> nth=1",
)
test(
    "reverse-playlist",
    pl,
    "qa('ytd-playlist-video-renderer').map(n=>n.dataset.n).join('')",
    "x==='321'",
    path=playlist,
    click="#ytb-reverse-pl-btn",
)
test(
    "flip-video",
    player,
    "sty('video','transform')",
    "x.includes('matrix(-1')",
    cfg={"flipVideoH": True, "flipVideoV": False},
    reset=True,
)
test(
    "session-replay",
    '<button id="doit">Record a click</button>',
    "(await dbop('replay','getAll')).filter(r=>r.tag==='BUTTON').length",
    "x>=1",
    setup="await dbop('replay','clear')",
    click="#doit",
)
test(
    "api-explorer",
    player,
    "YourTube._api?.player?.id||''",
    "x==='movie_player'",
    reset=True,
)
test(
    "player-dashboard-button",
    player,
    "!!document.querySelector('#ytb-dashboard,#ytb-dash,.ytb-dash,.ytb-shell')",
    "x===true",
    click=".ytb-plus-dash-btn",
)
test(
    "stop-button",
    player,
    "v().paused",
    "x===true",
    setup="await v().play()",
    click=".ytb-stop-btn",
)
css(
    "always-progress-bar",
    '<div class="html5-video-player ytp-autohide"><div class="ytp-chrome-bottom" style="opacity:0">Progress bar</div></div>',
    ".ytp-chrome-bottom",
    "opacity",
    "1",
)
test(
    "redirect-shorts",
    "<p>Short clip</p>",
    "location.pathname+location.search",
    "x==='/watch?v=LabVideo001'",
    path=short,
)
test(
    "auto-expand-desc",
    '<ytd-text-inline-expander><button id="expand" onclick="this.textContent=\'Expanded\'">More</button></ytd-text-inline-expander>',
    "tx('#expand')",
    "x==='Expanded'",
)
test(
    "disable-autoplay",
    '<button aria-checked="true" class="ytp-autonav-toggle-button" onclick="this.setAttribute(\'aria-checked\',\'false\')">Autoplay</button>',
    "q('button').getAttribute('aria-checked')",
    "x==='false'",
)
test(
    "auto-pause",
    player,
    "v().paused",
    "x===true",
    setup="await v().play()",
    cfg={"autoPauseMode": "blur"},
    action="ev(window,'blur')",
)
test(
    "top-progress-bar",
    player,
    "q('#ytb-extra-topbar')?.style.width||''",
    "Math.abs(parseFloat(x)-50)<1",
    setup="v().currentTime=60",
    action="ev(v(),'timeupdate')",
)
for id, btn, cond in [
    ("copy-timestamp-button", ".ytb-extra-copy-time", "x.includes('LabVideo001&t=22')"),
    (
        "copy-video-info-button",
        ".ytb-extra-copy-info",
        "x.includes('Field recording')&&x.includes('LabVideo001')",
    ),
]:
    test(
        id,
        player,
        "window.copied||''",
        cond,
        setup="v().currentTime=22;window.copied='';Object.defineProperty(navigator.clipboard,'writeText',{value:async v=>window.copied=v,configurable:true})",
        click=btn,
        note="Captures text written to the browser clipboard interface; no system clipboard reading.",
    )
test(
    "open-transcript-button",
    player
    + '<button id="native" onclick="this.textContent=\'Transcript visible\'">Show transcript</button>',
    "tx('#native')",
    "x==='Transcript visible'",
    click=".ytb-extra-transcript",
)
for id, btn in [
    ("video-notes", ".ytb-extra-vnote"),
    ("channel-notes", ".ytb-extra-cnote"),
]:
    node(id, player, "#ytb-extra-notes", click=btn)
test(
    "chapter-buttons",
    player,
    "Math.round(v().currentTime)",
    "x===30",
    setup=chapterdata,
    click=".ytb-extra-next-ch",
)
test(
    "chapter-hotkeys",
    player,
    "Math.round(v().currentTime)",
    "x===30",
    setup=chapterdata,
    key="=",
)
test(
    "number-search-results",
    res,
    "qa('.ytb-extra-num').map(n=>n.textContent).join(' ')",
    "x.includes('1')&&x.includes('2')",
    path=search,
)
css(
    "dense-video-grid",
    '<ytd-rich-grid-renderer><div id="contents">'
    + card(tag="ytd-rich-item-renderer")
    + "</div></ytd-rich-grid-renderer>",
    "ytd-rich-grid-renderer",
    "--ytd-rich-grid-items-per-row",
    "6",
)
test(
    "highlight-video-length",
    res,
    "q('[data-n=\"2\"]').classList.contains('ytb-extra-long')",
    "x===true",
    path=search,
    cfg={"highlightVideoLengthMode": "long", "longVideoMinSec": 600},
)
for id, word in [
    ("hide-live-content", "LIVE now"),
    ("hide-premieres", "Premieres tomorrow"),
]:
    test(
        id,
        card(title=word),
        "visible('ytd-video-renderer')",
        "x===false",
        path=search,
        reset=True,
    )
css(
    "compact-playlist",
    '<ytd-playlist-panel-video-renderer><div id="video-title">Field recording</div></ytd-playlist-panel-video-renderer>',
    "#video-title",
    "font-size",
    "12px",
)
test("shorts-auto-mute", player, "v().muted", "x===true", path=short)
hide(
    "shorts-hide-comments",
    '<ytd-engagement-panel-section-list-renderer id="sample" class="specimen" target-id="shorts-engagement-panel-comments-section">Shorts comments</ytd-engagement-panel-section-list-renderer>',
    path=short,
)
test(
    "collapse-long-comments",
    '<ytd-comment-thread-renderer><div id="content-text">'
    + ("Long field note. " * 45)
    + "</div></ytd-comment-thread-renderer>",
    "tx('ytd-comment-thread-renderer').includes('Expand comment')",
    "x===true",
    cfg={"collapseLongCommentChars": 100},
)
css(
    "highlight-creator-comments",
    '<ytd-comment-view-model id="sample" class="specimen">Creator reply <i id="author-comment-badge">✓</i></ytd-comment-view-model>',
    "#sample",
    "background-color",
    "rgba(62, 166, 255, 0.08)",
)
css(
    "highlight-timestamp-links",
    '<a href="/watch?v=LabVideo001&t=6">0:06</a>',
    "a",
    "font-weight",
    "700",
)
test(
    "end-soon-warning",
    player,
    "tx('#ytb-extra-endwarn')",
    "x.includes('Ending in')",
    setup="v().currentTime=116",
    action="ev(v(),'timeupdate')",
)
NAV = "YourTube.bus.emit('nav.changed',{url:location.href})"
clip = "Object.defineProperty(navigator.clipboard,'writeText',{value:async v=>window.copied=v,configurable:true})"
comments = (
    '<ytd-comments><div id="header"></div>'
    + "".join(
        f'<ytd-comment-thread-renderer class="specimen" id="c{i}"><div id="content-text">{v1}</div></ytd-comment-thread-renderer>'
        for i, v1 in enumerate(["Field work is rewarding", "Night recording note"])
    )
    + "</ytd-comments>"
)
test(
    "comment-search",
    comments,
    "[visible('#c0'),visible('#c1')]",
    "x[0]&&!x[1]",
    wait="#ytb-comment-search input",
    action="const n=q('#ytb-comment-search input');n.value='Field';ev(n,'input')",
)
hide(
    "elements-control",
    '<button class="ytp-subtitles-button" id="sample">Closed captions</button>',
    cfg={"elementsControlHidden": {"player-subtitles": True}},
)
hide("disable-video-previews", "ytd-moving-thumbnail-renderer")
hide(
    "hide-shorts",
    "ytd-reel-shelf-renderer",
    cfg={
        "hideShortsDomClean": False,
        "hideShortsApiFilter": False,
        "hideShortsRedirect": False,
    },
)
test(
    "credibility-layer",
    res,
    "tx('.ytb-ui-cred-badge')",
    "/Emerging|Growing|High reach/.test(x)",
    path=search,
)
test(
    "dead-link-detector",
    '<div id="info-strings"><yt-formatted-string>Jan 1, 2014</yt-formatted-string></div>',
    "tx('[data-ytb-outdated]')",
    "x.includes('years old')",
    action=NAV,
)
test(
    "curated-collections",
    player,
    "tx('#ytb-collections')",
    "x.toLowerCase().includes('collection')",
    note="Watch-page collection controls mounted under the video.",
)
node(
    "overlay-hub",
    player,
    "#ytb-monolith #ytb-fps-box",
    cfg={"fpsCounterOn": True},
    note="FPS monitor reparented inside the monitor hub.",
)
test(
    "watch-budget",
    player,
    "document.body.innerText.includes('min left')",
    "x===true",
    key="Alt+Shift+b",
    cfg={"watchBudgetMinutes": 35},
    note="Budget status shortcut, not an elapsed full day.",
)
node(
    "shorts-policy",
    player,
    "#ytb-shorts-gate",
    cfg={
        "shortsScheduleMode": "block",
        "shortsScheduleStart": "00:00",
        "shortsScheduleEnd": "23:59",
    },
    path=short,
)
test(
    "screen-wake",
    player,
    "window.wakeType||''",
    "x==='screen'",
    setup="Object.defineProperty(navigator,'wakeLock',{value:{request:async t=>{window.wakeType=t;return {release:async()=>window.wakeType=''}}},configurable:true})",
    action="await v().play()",
    note="Instrumented Wake Lock request; not a physical display power measurement.",
)
test(
    "chapter-auto-skip",
    player,
    "Math.floor(v().currentTime)",
    "x>=30&&x<38",
    setup=chapterdata + ";v().currentTime=2",
    cfg={"chapterSkipWords": "intro"},
    action="await v().play();ev(v(),'timeupdate')",
)
test(
    "video-bookmarks",
    player,
    "tx('#ytb-bm')",
    "x.includes('Bookmarks (1)')&&x.includes('0:16')",
    setup="v().currentTime=16",
    key="Alt+b",
)
node("timestamp-notes", player, "#ytb-notes", key="Alt+n")
test(
    "pause-auto-rewind",
    player,
    "Math.round(v().currentTime)",
    "x===12",
    cfg={"pauseRewindSec": 8},
    setup="v().currentTime=20",
    action="ev(v(),'pause')",
)
test(
    "instant-replay",
    player,
    "Math.round(v().currentTime)",
    "x===15",
    cfg={"instantReplaySec": 10},
    setup="v().currentTime=25",
    key="Alt+j",
)
test(
    "sleep-timer",
    player,
    "document.body.innerText.includes('Sleep timer armed: 15 min')",
    "x===true",
    cfg={"sleepTimerMin": 15},
    key="Alt+o",
)
test(
    "intention-lock",
    player,
    "tx('#ytb-intent-chip')",
    "x.includes('Study the recording')",
    wait="#ytb-intent input",
    action="q('#ytb-intent input').value='Study the recording';q('#ytb-intent button').click()",
)
node("end-winddown", player, "#ytb-winddown", action="ev(v(),'ended')")
test(
    "shorts-marathon-guard",
    player,
    "document.body.innerText.includes('3 Shorts in a row')",
    "x===true",
    cfg={"shortsMarathonN": 3},
    path=short,
    action="for(let i=1;i<=3;i++){history.replaceState({},'', '/shorts/LabShort00'+i);" + NAV + "}",
)
css(
    "feed-freshness",
    card(age="3 years", tag="ytd-rich-item-renderer"),
    "ytd-rich-item-renderer",
    "display",
    "none",
    cfg={"feedMaxAgeMonths": 2},
    path=home,
    action=NAV,
)
test(
    "channel-snooze",
    res,
    "[visible('[data-n=\"1\"]'),visible('[data-n=\"2\"]')]",
    "!x[0]&&x[1]",
    cfg={"channelSnoozeList": "FieldLab"},
    path=search,
    action=NAV,
    reset=True,
)
test(
    "dup-title-spotter",
    card() + card(2),
    "tx('[data-n=\"2\"] .ytb-ui-dup-badge')",
    "x==='dup title'",
    path=search,
    action=NAV,
)
css(
    "playlist-watched-marker",
    pl,
    '[data-n="1"] #video-title',
    "opacity",
    "0.45",
    cfg={"sessionRestoreOn": True},
    setup=historyrow,
    path=playlist,
    action=NAV,
)
css(
    "comment-filter",
    comments,
    "#c1",
    "display",
    "none",
    cfg={"commentBlockWords": "night"},
    action=NAV,
)
test(
    "history-local-hide",
    res,
    "visible('[data-n=\"1\"]')",
    "x===false",
    path="/feed/history",
    action="q('[data-n=\"1\"]').dispatchEvent(new MouseEvent('click',{shiftKey:true,bubbles:true,cancelable:true}))",
    reset=True,
)
copy = "const text=q('#copytext');const range=document.createRange();range.selectNodeContents(text);getSelection().removeAllRanges();getSelection().addRange(range);const cb=new DataTransfer();const event=new ClipboardEvent('copy',{clipboardData:cb,bubbles:true,cancelable:true});text.dispatchEvent(event);window.copied=cb.getData('text/plain')"
test(
    "copy-link-cleaner",
    '<div id="copytext">https://youtu.be/LabVideo001?si=tracker&amp;t=4</div>',
    "window.copied||''",
    "x.includes('t=4')&&!x.includes('si=')",
    action=copy,
)
test(
    "night-scheduler",
    '<ytd-app class="specimen">Scheduled site appearance</ytd-app>',
    "q('ytd-app').hasAttribute('dark')",
    "x===true",
    cfg={"nightStart": "00:00", "nightEnd": "23:59"},
    reset=True,
)
css(
    "text-scale",
    '<section style="font-size:16px"><div id="description" class="specimen">Description: field techniques</div></section>',
    "#description",
    "font-size",
    "24px",
    cfg={"textScalePct": 150, "textScaleScope": "site"},
)
for id, snip in [
    ("storage-dashboard", "Browser quota"),
    ("health-check", "Blob URLs alive:"),
    ("watch-stats", "Videos recorded: 1"),
]:
    test(
        id,
        player,
        "tx('#lab-settings')",
        f"x.includes({snip!r})",
        setup=historyrow,
        action=f"settings({id!r})",
        note="Reads actual browser storage/diagnostics; local history seeded with one synthetic entry.",
    )
test(
    "frame-stepper",
    player,
    "v().currentTime",
    "Math.abs(x-10.05)<.004",
    setup="v().currentTime=10",
    cfg={"frameFps": 20},
    click="#ytb-frameforward",
)
test(
    "playlist-resume",
    player,
    "location.pathname+location.search",
    "x.includes('v=LabVideo002')&&x.includes('t=32')",
    path=watch + "&list=PLfixture",
    setup="await YourTube.storage.set('__yourtube_pl_resume__',{PLfixture:{v:'LabVideo002',t:32,i:1}})",
    action=NAV,
    click="#ytb-plresume",
)
test(
    "channel-volume",
    player,
    "v().volume",
    "Math.abs(x-.37)<.001",
    setup="await YourTube.storage.set('__yourtube_ch_vol__',{'@fieldlab':{v:.37,at:Date.now()}})",
    action="ev(v(),'loadedmetadata')",
)
test(
    "quick-collection-send",
    player,
    "q('.ytb-ui-qsend select')?.selectedOptions[0]?.textContent||''",
    "x.includes('no collections')",
    click=".ytb-ui-qsend button",
)
test(
    "reader-mode",
    player,
    "tx('#ytb-reader')",
    "x.includes('A field recording')",
    click=".ytb-ui-reader-open",
)
node("breather", player, "#ytb-breather", key="Alt+g")
for id, doc, measure, expect, cfg in [
    (
        "aio-player-tools",
        player,
        "qa('.ytb-extra-copy-time,.ytb-extra-copy-info,.ytb-extra-next-ch').length",
        "x===3",
        {},
    ),
    (
        "aio-shorts-cleanup",
        '<ytd-engagement-panel-section-list-renderer target-id="shorts-engagement-panel-comments-section" class="specimen">Comments</ytd-engagement-panel-section-list-renderer>',
        "visible('ytd-engagement-panel-section-list-renderer')",
        "x===false",
        {},
    ),
    (
        "aio-feed-cleanup",
        res + '<div id="secondary">Recommendations</div>',
        "visible('#secondary')",
        "x===false",
        {},
    ),
    ("aio-compact-dense", player, "sty('#title h1','font-size')", "x==='18px'", {}),
    (
        "aio-privacy-shield",
        '<ytd-ai-summary-renderer class="specimen">AI summary</ytd-ai-summary-renderer>',
        "visible('ytd-ai-summary-renderer')",
        "x===false",
        {},
    ),
    (
        "aio-comment-cleanup",
        '<a href="/watch?v=LabVideo001&t=9">0:09</a>',
        "sty('a','font-weight')",
        "x==='700'",
        {},
    ),
]:
    test(id, doc, measure, expect, cfg=cfg, reset=True)
test(
    "seen-memory",
    res,
    "visible('[data-n=\"1\"]')",
    "x===false",
    path=search,
    setup="await YourTube.storage.set('__yourtube_seen__',{LabVideo001:Date.now()-3600000})",
    action=NAV,
    reset=True,
)
test(
    "card-metadata",
    res,
    "tx('.ytb-ui-cardmeta')",
    "x.includes('/day')",
    path=search,
    cfg={"cardMetaVelocity": True, "cardMetaDate": True},
    action=NAV,
)
hide(
    "search-filler",
    '<ytd-item-section-renderer id="sample"><div id="title">People also watched</div></ytd-item-section-renderer>',
    path=search,
    action=NAV,
)
hide(
    "hide-mixes",
    '<ytd-rich-item-renderer id="sample"><a href="/watch?v=LabVideo001&start_radio=1">Mix</a></ytd-rich-item-renderer>',
)
hide(
    "player-gradient",
    '<div class="ytp-gradient-bottom specimen" id="sample">Player gradient</div>',
)
hide(
    "hide-ai-ask",
    '<ytd-engagement-panel-section-list-renderer id="sample" target-id="engagement-panel-ask" class="specimen">Ask</ytd-engagement-panel-section-list-renderer>',
)
test(
    "auto-exit-fullscreen",
    player,
    "!!document.fullscreenElement",
    "x===false",
    setup="await mp().requestFullscreen()",
    action="ev(v(),'ended')",
)
test(
    "wheel-controls",
    player,
    "v().volume",
    "Math.abs(x-.6)<.001",
    cfg={"wheelVolumeStep": 10},
    setup="v().volume=.5",
    action="mp().dispatchEvent(new WheelEvent('wheel',{deltaY:-1,bubbles:true,cancelable:true}))",
)
for id, method, ret, m, goal, cfg in [
    (
        "volume-boost",
        "createGain",
        "gain",
        "gain.value",
        1.9,
        {"volumeBoostPct": 190, "volumeBoostPerChannel": False},
    ),
    (
        "loudness-leveling",
        "createDynamicsCompressor",
        "comp",
        "ratio.value",
        16,
        {"loudnessStrength": 3},
    ),
]:
    test(
        id,
        player,
        f"window.labNode?.{m}||0",
        f"x==={goal}",
        cfg=cfg,
        setup=f"const orig=AudioContext.prototype.{method};AudioContext.prototype.{method}=function(...args){{window.labNode=orig.apply(this,args);return labNode}}",
        note="Reads the real Web Audio node parameter; not a listening test.",
    )
test(
    "sticky-quality",
    player + '<span class="ytp-live-badge">Live</span>',
    "mp()._quality",
    "x==='hd720'",
    setup=quality + ";await v().play()",
    cfg={"qualityPref": "hd720"},
    action=NAV,
)
css(
    "wide-player",
    '<ytd-watch-flexy><div id="columns" style="display:flex"><div id="primary">Player</div><div id="secondary">Related</div></div></ytd-watch-flexy>',
    "#columns",
    "flex-direction",
    "column",
)
test(
    "shorts-speed",
    player,
    "v().playbackRate",
    "x===1.5",
    cfg={"shortsSpeedDefault": 1.5, "shortsProgressOn": True},
    path=short,
)
hide(
    "player-effects-block",
    '<div id="cinematics"><div id="sample" class="specimen">Ambient glow</div></div>'.replace(
        'id="sample"', 'id="swatch"'
    ),
    cfg={"blockAmbient": True},
)
S["player-effects-block"]["measure"] = "sty('#cinematics','display')"
test(
    "calm-chrome",
    '<div class="ytb-ui-focus-card">Popup card</div>',
    "[document.body.classList.contains('ytb-calm'),sty('.ytb-ui-focus-card','background-color')]",
    "x[0]===true",
    reset=False,
)
hide(
    "live-chat-clean",
    "yt-live-chat-paid-message-renderer",
    cfg={"liveChatHidePaid": True},
)
test(
    "transcript-tools",
    '<ytd-transcript-renderer><div id="header"></div><ytd-transcript-segment-renderer><span class="segment-timestamp">0:09</span>　<span class="segment-text">Bird call.</span></ytd-transcript-segment-renderer></ytd-transcript-renderer>',
    "window.copied||''",
    "x==='0:09 Bird call.'",
    cfg={"transcriptTimestamps": True},
    setup=clip,
    click='.ytb-ui-transcript-tools button:text-is("Copy")',
)
test(
    "notification-clean",
    '<ytd-multi-page-menu-renderer><div id="header"></div><button id="native" onclick="this.textContent=\'Inbox read\'">Mark all as read</button></ytd-multi-page-menu-renderer>',
    "tx('#native')",
    "x==='Inbox read'",
    click=".ytb-ui-mark-read",
    note="Native action simulated locally; no personal notifications changed.",
)
test(
    "watch-later-tools",
    pl,
    "visible('[data-n=\"1\"]')",
    "x===false",
    setup=historyrow,
    path="/playlist?list=WL",
    cfg={"watchLaterHideWatched": True},
    click="text=Hide watched",
)
test(
    "weekly-report",
    player,
    "document.body.innerText.includes('Last 7 days: 1 video')",
    "x===true",
    setup=historyrow,
    limit=11000,
)
test(
    "random-pick",
    pl,
    "location.href",
    "x.includes('/watch?v=LabVideo00')",
    path=playlist,
    cfg={"randomPickUnwatched": False},
    click=".ytb-ui-random",
)
test(
    "shuffle-tools",
    pl,
    "qa('ytd-playlist-video-renderer').map(n=>n.dataset.n).join('')",
    "x==='231'",
    path=playlist,
    setup="Math.random=()=>0;",
    click=".ytb-ui-shuffle",
)
test(
    "export-data",
    pl,
    "window.exportFile||''",
    "x.includes('LabVideo001')&&x.includes('Field Lab')",
    setup=historyrow
    + ";document.addEventListener('click',async e=>{if(e.target.download){e.preventDefault();window.exportFile=await (await fetch(e.target.href)).text()}},true)",
    action="settings('export-data');buttonNamed('History (JSON)').click()",
)
test(
    "sub-groups",
    '<ytd-browse><div id="header"></div>' + cards + "</ytd-browse>",
    "[visible('[data-n=\"1\"]'),visible('[data-n=\"2\"]')]",
    "x[0]&&!x[1]",
    path=subs,
    cfg={"subGroupsActive": "Field"},
    setup="await YourTube.storage.set('__yourtube_groups__',{Field:['@fieldlab']})",
    action=NAV,
    reset=True,
)
test(
    "ui-restore-2026",
    '<ytd-watch-metadata><div id="owner"></div><div id="info"><yt-formatted-string id="like-count">150 likes</yt-formatted-string></div></ytd-watch-metadata>',
    "sty('#like-count','display')",
    "x==='none'",
    cfg={"uiRestoreInlineLikes": True, "uiRestoreSubs": False},
)
test(
    "watch-tabs",
    player + comments,
    "document.documentElement.getAttribute('data-ytb-tab')",
    "x==='comments'",
    click='.ytb-ui-tabs-bar button:text-is("Comments")',
)
test(
    "keymap",
    player,
    "v().playbackRate",
    "x===1.5",
    cfg={"keymap": {"speedUp": "alt+keyu"}, "speedStep": 0.5},
    key="Alt+u",
)
test(
    "sub-group-add",
    '<div id="page-header"><div id="buttons"></div></div>',
    "(await YourTube.storage.get('__yourtube_groups__'))?.Study||[]",
    "x.includes('@fieldlab')",
    path=channel,
    wait=".ytb-ui-add-group",
    action="q('.ytb-ui-add-group').click();const i=q('.ytb-ui-inline-prompt input');i.value='Study';i.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))",
)
node(
    "subs-only-home",
    '<ytd-browse page-subtype="home"><div id="contents">Recommended</div></ytd-browse>',
    ".ytb-ui-subs-note",
    path=home,
    cfg={"subsOnlyRedirect": False},
)
test(
    "sort-search",
    res,
    "qa('ytd-video-renderer').map(n=>n.dataset.n).join('')",
    "x==='21'",
    path=search,
    cfg={"sortSearchBy": "views"},
    reset=True,
    note="Configured Most viewed order on mount, no sort button clicked; disabling restores original slots.",
)
css(
    "static-header",
    '<ytd-masthead id="masthead-container" class="specimen">Masthead</ytd-masthead>',
    "#masthead-container",
    "position",
    "absolute",
)
css(
    "unclamp-titles",
    '<div id="video-title" style="-webkit-line-clamp:2;max-height:36px">A long field recording title that needs the entire line</div>',
    "#video-title",
    "-webkit-line-clamp",
    "none",
)
test(
    "fixed-player-size",
    player,
    "sty('ytd-watch-flexy','--ytd-watch-flexy-min-player-height')",
    "x==='360px'",
    cfg={"playerHeightNormal": 360, "playerHeightTheater": 480, "playerAlign": "1"},
    reset=True,
)
css(
    "description-width",
    '<ytd-app><ytd-page-manager><ytd-watch-flexy flexy><div id="columns">Watch columns</div></ytd-watch-flexy></ytd-page-manager></ytd-app>',
    "#columns",
    "min-width",
    "1420px",
    cfg={"descriptionWidthPreset": "1440"},
)
hide(
    "channel-banner-mode",
    '<ytd-browse page-subtype="channels"><yt-image-banner-view-model id="sample">Channel banner</yt-image-banner-view-model></ytd-browse>',
    cfg={"channelBannerMode": "hide"},
    path=channel,
)
test(
    "channel-landing-tab",
    "<h2>Channel page</h2>",
    "location.pathname",
    "x==='/@FieldLab/streams'",
    path="/@FieldLab/featured",
    cfg={"channelLandingTab": "live"},
)
test(
    "resume-timestamps",
    '<a id="sample" href="/watch?v=LabVideo001&t=22&list=PLfixture">Resume recording</a>',
    "q('#sample').getAttribute('href')",
    "x.includes('list=PLfixture')&&!x.includes('t=22')",
)
css(
    "thumbnail-sizes",
    '<ytd-search><ytd-video-renderer><ytd-thumbnail class="ytd-video-renderer">Thumbnail</ytd-thumbnail></ytd-video-renderer></ytd-search>',
    "ytd-thumbnail",
    "min-width",
    "240px",
    cfg={"searchThumbSize": 240},
    path=search,
)
# Cross-card, service and time-bound cases. Sandbox infrastructure replaces external inputs,
# never the userscript's renderer, feature handler, scorer or DOM mutations.
test(
    "sponsorblock",
    player,
    "Math.floor(v().currentTime)",
    "x>=18&&x<26",
    cfg={
        "sbIncognito": True,
        "sbDisable": False,
        "sb_sponsor_en": True,
        "sb_sponsor_act": "skip",
        "sbMinDuration": 0,
    },
    action="await nap(850);YourTube.sb.debugInject([{category:'sponsor',segment:[3,18],actionType:'skip'}]);v().currentTime=4;await v().play();ev(v(),'timeupdate')",
    note="Synthetic sponsor segment through the built-in test hook; no votes, submissions or viewed reports.",
)
test(
    "session-restore",
    player,
    "(await dbop('history','get','LabVideo001'))?.completed||false",
    "x===true",
    setup="await dbop('history','clear')",
    action="await nap(1300);ev(v(),'ended')",
    note="Ended event records completion in the actual local IndexedDB history store.",
)
test(
    "force-watched",
    player,
    "(await dbop('history','get','LabVideo001'))?.progress||0",
    "x===100",
    setup="await dbop('history','clear')",
    cfg={"forceWatchedAccountHistory": False, "forceWatchedLocalHistory": True},
    key="Shift+w",
    note="Local-only marking: account history explicitly off, network blocked.",
)
test(
    "update-check",
    "<p>Offline release metadata replay</p>",
    "tx('#ytb-update-banner')",
    "x.includes('9.9.9')",
    cfg={"safeMode": False},
    note="Synthetic newer release from the fixture transport. Validates notification, not publisher availability.",
)
# An explicit dashboard switch checks now (the 60 s timer is only for startup).
test(
    "background-players-pause",
    player,
    "v().paused",
    "x===true",
    setup="await v().play()",
    action="Object.defineProperty(document,'visibilityState',{get:()=>'hidden',configurable:true});ev(document,'visibilitychange')",
    note="Simulated tab visibility, real video pause.",
)
test(
    "auto-resume-autopaused",
    player,
    "v().paused",
    "x===false",
    setup="await v().play();YourTube.setCfg('autoPauseMode','blur');await nap(260);ev(window,'blur');await nap(100)",
    action="ev(window,'focus')",
)
test(
    "adaptive-throttle",
    player,
    "v().paused",
    "x===true",
    setup="Object.defineProperty(navigator,'getBattery',{value:async()=>({level:.09,charging:false}),configurable:true});await v().play()",
    action="Object.defineProperty(document,'hidden',{get:()=>true,configurable:true});Object.defineProperty(document,'visibilityState',{get:()=>'hidden',configurable:true});ev(document,'visibilitychange');const now=Date.now.bind(Date);Date.now=()=>now()+90000;ev(document,'visibilitychange');",
    note="Simulated low battery, hidden document and elapsed time; real pause.",
)
test(
    "net-monitor",
    player,
    "tx('#ytb-net-badge')",
    "x.includes('dn')&&x.includes('up')",
    cfg={"netMonitorBadge": True, "netMonitorPatchFetch": True},
    action="await fetch('/audit/tools.js')",
    note="Local resource request and the on-page traffic badge.",
)
test(
    "cookie-control",
    "<p>Only synthetic, script-readable site cookies are in scope.</p>",
    "tx('#ytb-toast')",
    "x.includes('Cookie Control: 1 changed.')",
    cfg={"cookieControlLive": True, "cookieControlNotify": True},
    setup="document.cookie='field_sample=one;path=/;Secure'",
    action="settings('cookie-control');q('#ytb-cc-open-dashboard').click();document.cookie='field_sample=two;path=/;Secure'",
    note="Only a disposable origin and fabricated field_sample cookie; no credential values.",
)
test(
    "hero-artwork-heal",
    '<ytd-default-promo-panel-renderer style="position:relative;display:block;width:780px;height:245px"><a href="/watch?v=LabVideo001">Featured recording</a></ytd-default-promo-panel-renderer>',
    "sty('#hero','background-image')",
    "typeof x==='string'&&x.includes('/vi/LabVideo001/')",
    path=channel,
    limit=14000,
    note="Image transport returns local test artwork; actual healing and layout code runs.",
)
test(
    "playlist-autoscroll",
    '<div id="scroller" style="height:130px;overflow:auto"><div style="height:620px">Earlier entries</div><ytd-playlist-panel-video-renderer selected class="specimen">Now playing</ytd-playlist-panel-video-renderer></div>',
    "q('#scroller').scrollTop",
    "x>350",
    action=NAV,
)
css(
    "feed-watched",
    res,
    '[data-n="1"]',
    "opacity",
    "0.45",
    cfg={"feedWatchedMode": "dim"},
    setup=historyrow,
    path=search,
    limit=18000,
)
test(
    "theme-engine",
    '<ytd-app><tp-yt-app-drawer id="guide"><div id="scrim"></div><div id="contentContainer" class="specimen">Panel</div></tp-yt-app-drawer></ytd-app>',
    "sty('#contentContainer','background-color')",
    "x==='rgb(0, 0, 0)'",
    cfg={"themeSelected": "d-amoled"},
    reset=True,
    note="AMOLED palette on drawer panel. See separate 201-theme live screenshots.",
)
test(
    "hide-auto-dubbed",
    player,
    "mp().track||''",
    "x==='en-original'",
    setup="mp().track='dub';mp().setAudioTrack=id=>mp().track=id;window.ytInitialPlayerResponse={videoDetails:{videoId:'LabVideo001'},streamingData:{adaptiveFormats:[{audioTrack:{id:'dub',isDefault:true,isAutoDubbed:true}},{audioTrack:{id:'en-original',audioIsOriginal:true}}]}}",
    cfg={"hideAutoDubbedPreferOriginal": True},
    note="Player-response fixture with one marked dub and one explicit original.",
)
api = (
    "window.ytcfg={get:k=>k==='INNERTUBE_API_KEY'?'fixture-only':k==='INNERTUBE_CONTEXT'?{client:{}}:null};"
)
test(
    "discover",
    res,
    "tx('#ytb-disco .ytb-ui-title')",
    "x.includes('Field discovery')",
    cfg={"sessionRestoreOn": False},
    setup=api,
    wait=".ytb-ui-topic-btn",
    action="q('.ytb-ui-topic-btn').click()",
    note="Returned search rows come from local synthetic YouTube API responses.",
)
test(
    "algo-intelligence",
    res,
    "sty('ytd-video-renderer[data-n=\"2\"]','display')",
    "x==='none'",
    cfg={"algoBlockKeywords": "night", "algoAutoTrain": False},
    note="A native-shaped card matching a title keyword is hidden locally.",
)
test(
    "perf-mode",
    res,
    "sty('ytd-video-renderer','contain')",
    "x.includes('layout')",
    cfg={"perfModeLevel": "balanced", "perfModeAuto": False, "perfContainment": True},
    reset=True,
)
test(
    "silence-skipper",
    player,
    "v().playbackRate",
    "x===4",
    cfg={"silenceSkipRate": 4},
    setup="AnalyserNode.prototype.getByteFrequencyData=function(b){b.fill(0)}",
    action="await v().play()",
    note="Deterministic zero-energy analyser input, real playing media and rate change.",
)
test(
    "stretch-reminder",
    player,
    "tx('#ytb-toast')",
    "x.includes('stand up and stretch')",
    cfg={"stretchEveryMin": 15},
    action="Object.defineProperty(v(),'paused',{get:()=>false,configurable:true})",
    note="15 minutes of simulated active playback on a virtual clock.",
)
S["stretch-reminder"]["advance"] = 905000
for id, doc, sel, expect, cfg in [
    (
        "return-dislike",
        player
        + "<ytd-menu-renderer><dislike-button-view-model><button>Dislike</button></dislike-button-view-model></ytd-menu-renderer>",
        ".ytb-ui-ryd-count",
        "x==='140'",
        {"returnDislikeBar": True},
    ),
    (
        "dearrow",
        player,
        "#title h1",
        "x.includes('Field recording, restored')",
        {"deArrowThumbs": False, "deArrowTitles": True},
    ),
]:
    test(
        id,
        doc,
        f"tx({sel!r})",
        expect,
        cfg={**cfg, "safeMode": False},
        action=NAV,
        note="Synthetic community API response. Validates rendering, not accuracy or availability of the third-party service.",
    )
test(
    "exact-upload-dates",
    player
    + '<div id="date-text">2 days ago</div><script type="application/json">{"INNERTUBE_API_KEY":"fixture-only","INNERTUBE_CLIENT_VERSION":"fixture"}</script>',
    "tx('[data-ytb-abs-watch]')",
    "x.includes('2020')",
    cfg={"exactDatesWatch": True, "exactDatesCards": False},
    note="Synthetic player metadata with a known publish date.",
)
S["watch-budget"]["key"] = "Shift+b"
S["frame-stepper"]["click"] = "#ytb-framefwd"
S["chapter-auto-skip"]["setup"] = (
    chapterdata + ";window.ytInitialPlayerResponse.videoDetails={videoId:'LabVideo001'};v().currentTime=0"
)
S["search-filler"]["html"] = S["search-filler"]["html"].replace(
    "People also watched", "Related to your search"
)
S["volume-boost"]["expect"] = "Math.abs(x-1.9)<.001"
S["watch-later-tools"]["click"] = '.ytb-ui-wl-tools button:text-is("Hide watched")'
S["weekly-report"].update(
    measure="tx('#ytb-toast')", expect="x.includes('Last 7 days: 1 video')", path=search
)
S["ui-restore-2026"]["html"] = S["ui-restore-2026"]["html"].replace("yt-formatted-string", "span")
S["resume-timestamps"]["cfg"] = {
    "stripResumeTimesOn": True,
    "resumeBarStyle": "default",
}
S["hide-low-views"]["action"] = NAV
S["default-channel-tab"].setdefault("cfg", {}).update(channelLandingTab="home")
S["geo-override"]["reset"] = True

# Chromium serializes the CSS combination `layout style paint` as its `content` shorthand.
S["perf-mode"].update(expect="x==='content'||x==='layout style paint'")
S["discover"]["html"] = player + '<div id="secondary"></div>'
S["adaptive-throttle"].update(
    advance=100000, action=S["adaptive-throttle"]["action"].split("const now=")[0]
)
S["adaptive-throttle"]["cfg"] = {"perfModeAuto": False}
# Time is virtual; no media decoder is required to model uninterrupted playback for this clock.
S["stretch-reminder"]["html"] = player.replace('src="/audit/media.webm"', "")
S["stretch-reminder"]["advance"] = 901000
S["sponsorblock"][
    "setup"
] = "await YourTube.storage.set('cache:sb:LabVideo001:all-categories-v2:1',{version:6,videoId:'LabVideo001',segments:[{category:'sponsor',UUID:'field-segment',segment:[3,18],actionType:'skip'}],fetchedAt:Date.now(),expiresAt:Date.now()+3e5})"
S["sponsorblock"]["cfg"].update(
    sbPrivacy=True,
    sbOnlySkipIfVip=False,
    sbWhitelist="",
    sbBetterBeAware="",
    sbSkipCountdown=False,
)
S["sponsorblock"]["action"] = "v().currentTime=4;await v().play();ev(v(),'timeupdate')"
S["sponsorblock"][
    "note"
] = "Locally seeded SponsorBlock cache, synthetic segment, actual player seek. No votes or external reports."

S["exact-upload-dates"]["setup"] = api
S["adaptive-throttle"]["advance"] = 900000
S["weekly-report"].update(html="<div>Weekly watch history</div>", limit=16000, advance=9500)

# The checkpoint recorder accepts only an actual playing visit and a natural end.
S["session-restore"].update(
    action="await v().play();await nap(370);v().currentTime=v().duration-.35;await nap(700)",
    note="Actual WebM play and natural end, followed by a read from the history store.",
)

# The real watch page has an earlier SVG symbol called "description". A broad
# document.querySelector selected it and opened a panel containing only Close.
S["reader-mode"]["html"] = '<svg hidden><g id="description"></g></svg>' + S["reader-mode"]["html"]

# Real YouTube's player object also exposes a player-API addEventListener; do
# not assume registering a DOM wheel via that method catches browser input.
S["wheel-controls"][
    "setup"
] += ";const host=mp(),normal=host.addEventListener;host.addEventListener=function(type,...args){if(type!=='wheel')return normal.call(this,type,...args)}"
