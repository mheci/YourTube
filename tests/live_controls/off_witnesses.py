# A disabled event-driven feature must relinquish the live surface, not undo history.
ROUTES = {
    "redirect-shorts",
    "channel-landing-tab",
    "default-channel-tab",
    "playlist-resume",
    "random-pick",
    "click-logo-to-subs",
}
SIMPLE_OFF = set(
    "loop-video end-winddown top-progress-bar hide-live-content hide-premieres highlight-video-length feed-watched comment-search theme-engine feed-freshness channel-snooze comment-filter dup-title-spotter card-metadata api-explorer number-search-results text-scale hide-low-views search-filler hide-mixes live-chat-clean calm-chrome wide-player return-dislike algo-intelligence ui-restore-2026 hero-artwork-heal silence-skipper".split()
)
OFF_WITNESS = {}
for feature, selector in {
    "forward-rewind-buttons": ".ytb-fr-btn",
    "copy-timestamp-button": ".ytb-extra-copy-time",
    "copy-video-info-button": ".ytb-extra-copy-info",
    "stop-button": ".ytb-stop-btn",
    "video-notes": ".ytb-extra-vnote",
    "channel-notes": ".ytb-extra-cnote",
    "chapter-buttons": ".ytb-extra-next-ch",
    "open-transcript-button": ".ytb-extra-transcript",
    "reader-mode": ".ytb-ui-reader-open",
    "frame-stepper": "#ytb-framefwd",
    "quick-collection-send": ".ytb-ui-qsend",
    "watch-tabs": ".ytb-ui-tabs-bar",
    "transcript-tools": ".ytb-ui-transcript-tools",
    "shuffle-tools": ".ytb-ui-shuffle",
    "watch-later-tools": ".ytb-ui-wl-tools",
    "notification-clean": ".ytb-ui-mark-read",
    "end-soon-warning": "#ytb-extra-endwarn",
    "dead-link-detector": "[data-ytb-outdated]",
    "intention-lock": "#ytb-intent-chip",
    "screen-wake": None,
    "shorts-policy": "#ytb-shorts-gate",
    "fps-counter": "#ytb-fps-box",
    "dropped-frame-counter": "#ytb-drop-box",
    "curated-collections": "#ytb-collections",
    "discover": "#ytb-disco",
    "breather": "#ytb-breather",
    "timestamp-notes": "#ytb-notes",
    "video-bookmarks": "#ytb-bm",
    "player-dashboard-button": ".ytb-plus-dash-btn",
}.items():
    if selector:
        OFF_WITNESS[feature] = (f"document.querySelectorAll({selector!r}).length", "x===0")
# Repeat an eligible input AFTER switch-off instead of treating an old seek,
# old notification, or an already-rewritten link as proof of continuing work.
SIMPLE_OFF.update(
    "speed-controller shorts-speed shorts-auto-mute screen-wake dearrow exact-upload-dates update-check stats-overlay diag-console buffer-health collapse-long-comments".split()
)
NEXT = {
    "skip-paused-continue": ("q('#confirm-button button').textContent='Again';await nap(600)", "tx('#confirm-button')", "x==='Again'"),
    "copy-link-cleaner": ("const range=document.createRange();range.selectNodeContents(q('#copytext'));getSelection().removeAllRanges();getSelection().addRange(range);const cb=new DataTransfer();const event=new ClipboardEvent('copy',{clipboardData:cb,bubbles:true,cancelable:true});q('#copytext').dispatchEvent(event);window.offCopy=[event.defaultPrevented,cb.getData('text/plain')]", "window.offCopy", "!x[0]&&x[1]===''"),
    "hide-auto-dubbed": ("mp().track='dub';YourTube.bus.emit('nav.changed',{url:location.href});await nap(600)", "mp().track", "x==='dub'"),
    "force-watched": ("v().pause();v().currentTime=5;document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'W',code:'KeyW',shiftKey:true,bubbles:true}));await nap(350)", "Math.round(v().currentTime)", "x===5"),
    "session-restore": ("await dbop('history','clear');v().currentTime=v().duration-.5;await v().play();await nap(950)", "[v().ended,await dbop('history','count')]", "x[0]&&x[1]===0"),
    "watch-stats": ("", "tx('[data-feat=watch-stats] .ytp-settings').includes('Videos recorded:')", "x===false"),
    "export-data": ("", "[...document.querySelectorAll('[data-feat=export-data] button')].filter(b=>b.textContent==='History (JSON)'&&b.getClientRects().length).length", "x===0"),
    "remove-redirect-urls": ("q('#out').setAttribute('href','/redirect?q=https%3A%2F%2Fexample.org%2Fagain');await nap(200)", "q('#out').getAttribute('href')", "x.startsWith('/redirect?')"),
    "loudness-leveling": ("", "window.labNode.ratio.value", "x===1"),
    "theater-default": ("q('ytd-watch-flexy').removeAttribute('theater');YourTube.bus.emit('nav.changed',{url:location.href});await nap(1000)", "q('ytd-watch-flexy').hasAttribute('theater')", "x===false"),
    "disable-autoplay": ("q('.ytp-autonav-toggle-button').setAttribute('aria-checked','true');YourTube.bus.emit('nav.changed',{url:location.href});await nap(800)", "q('.ytp-autonav-toggle-button').getAttribute('aria-checked')", "x==='true'"),
    "speed-per-channel": ("v().playbackRate=1;YourTube.bus.emit('nav.changed',{url:location.href});await nap(1450)", "v().playbackRate", "x===1"),
    "auto-resume-autopaused": ("await v().play();ev(window,'blur');await nap(150);ev(window,'focus');await nap(200)", "v().paused", "x===true"),
    "auto-recover-video": ("v().pause();ev(window,'online');await nap(500)", "v().paused", "x===true"),
    "background-players-pause": ("await v().play();ev(document,'visibilitychange');await nap(400)", "v().paused", "x===false"),
    "shorten-share-url": ("q('#share').href='https://youtu.be/LabVideo003?si=keep';await nap(500)", "q('#share').getAttribute('href')", "x==='https://youtu.be/LabVideo003?si=keep'"),
    "ab-repeat": (
        "v().pause();v().currentTime=17;ev(v(),'timeupdate')",
        "Math.floor(v().currentTime)",
        "x===17",
    ),
    "auto-hd": ("mp()._quality='small';ev(v(),'playing')", "mp()._quality", "x==='small'"),
    "force-cc": (
        "q('.ytp-subtitles-button').setAttribute('aria-pressed','false');ev(v(),'loadedmetadata');await nap(500)",
        "q('.ytp-subtitles-button').getAttribute('aria-pressed')",
        "x==='false'",
    ),
    "autoskip-ad-btn": (
        "q('.ytp-ad-skip-button-modern').textContent='Skip again';ev(v(),'playing');await nap(800)",
        "tx('.ytp-ad-skip-button-modern')",
        "x==='Skip again'",
    ),
    "auto-pause": ("await v().play();ev(window,'blur');await nap(130)", "v().paused", "x===false"),
    "auto-exit-fullscreen": (
        "await mp().requestFullscreen();ev(v(),'ended');await nap(180)",
        "!!document.fullscreenElement",
        "x===true",
    ),
    "pause-auto-rewind": (
        "v().currentTime=20;ev(v(),'pause');await nap(130)",
        "Math.round(v().currentTime)",
        "x===20",
    ),
    "channel-volume": (
        "v().volume=.64;ev(v(),'loadedmetadata');await nap(400)",
        "v().volume",
        "Math.abs(x-.64)<.001",
    ),
    "wheel-controls": (
        "v().volume=.5;mp().dispatchEvent(new WheelEvent('wheel',{deltaY:-1,bubbles:true,cancelable:true}));await nap(160)",
        "v().volume",
        "x===.5",
    ),
    "chapter-auto-skip": (
        "v().pause();v().currentTime=3;await v().play();ev(v(),'timeupdate');await nap(150)",
        "v().currentTime",
        "x>=3&&x<5",
    ),
    "sponsorblock": (
        "v().pause();v().currentTime=4;await v().play();ev(v(),'timeupdate');await nap(150)",
        "v().currentTime",
        "x>=4&&x<5",
    ),
    "default-audio-track": (
        "mp().track='dub';ev(v(),'loadedmetadata');await nap(330)",
        "mp().track",
        "x==='dub'",
    ),
    "chapter-hotkeys": (
        "v().pause();v().currentTime=5;document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'=',code:'Equal',bubbles:true}));await nap(140)",
        "Math.round(v().currentTime)",
        "x===5",
    ),
    "instant-replay": (
        "v().pause();v().currentTime=25;document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'j',code:'KeyJ',altKey:true,bubbles:true}));await nap(140)",
        "Math.round(v().currentTime)",
        "x===25",
    ),
}
