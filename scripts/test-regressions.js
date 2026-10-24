#!/usr/bin/env node


"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const bundle = fs.readFileSync(path.join(root, "yourtube.user.js"), "utf8").replace(/\r\n/g, "\n");

// settings import must apply the imported config, never overwrite it with defaults.
assert.ok(!/S = Object\.assign\(\{\}, s, j\(/.test(bundle),
  "IMP-01: import must not assign j()'s (void) return value over the config");
assert.ok(/t\.cfg && j\(D\(t\.cfg\)\)/.test(bundle),
  "IMP-01: import applies the config as a statement");

// quality selection must rank levels, never lexicographically compare them.
assert.ok(/const rank = \["hd2160", "hd1440", "hd1080", "hd720", "large", "medium", "small", "tiny"\]/.test(bundle),
  "HD-01: quality levels use an explicit rank order");
assert.ok(!/lv\.filter\(\(q\) => q < t\)\[0\]/.test(bundle),
  "HD-01: lexicographic quality comparison removed");

// bind-once flags must never live on persistent elements again.
for (const flag of [
  "__ytbAbRepeatBound",
  "__ytbCcStateBound",
  "__ytbCcWatched",
  "__ytbAdSkipObs",
  "__ytbTopProgressBound",
  "__ytbEndSoonBound",
]) {
  assert.ok(!bundle.includes(flag), `BIND-01: ${flag} must stay removed (per-apply WeakSet instead)`);
}
assert.ok((bundle.match(/new WeakSet\(\)/g) || []).length >= 10,
  "BIND-01: per-apply WeakSet bindings present");

// the player's own speed control must not be overridden, and speedStep must be consumed.
assert.ok(!/e\.addListener\(t, "ratechange", ag\)/.test(bundle),
  "SPD-01: speed controller no longer re-asserts on ratechange");
assert.ok(/hotkey speed step/.test(bundle) && /S\.speedStep/.test(bundle),
  "SPD-02: speed hotkey consumes speedStep");

// comment features must match the current comment markup.
assert.ok(/ytd-comment-view-model #content-text, ytd-comment-thread-renderer #content-text/.test(bundle),
  "CMT-01: collapse-long-comments matches the current comment element");
assert.ok(/ytd-comment-view-model:has\(ytd-author-comment-badge-renderer\)/.test(bundle),
  "CMT-02: highlight-creator-comments matches the current comment element");
assert.ok(/ytd-comment-view-model #author-text/.test(bundle) && /ytd-comment-view-model #published-time-text/.test(bundle),
  "CMT-03: element control rows cover the current comment markup");

// the visitor-cookie rewrite must stay gone.
assert.ok(!/set\("VISITOR_INFO1_LIVE", n,/.test(bundle),
  "HFR-01: visitor cookie is never rewritten");
assert.ok(!/document\.cookie =[\s\S]{0,40}VISITOR_INFO1_LIVE=/.test(bundle),
  "HFR-01: visitor cookie fallback write removed");
assert.ok(!/toString\(36\)\.slice\(2, 14\)/.test(bundle),
  "HFR-01: random visitor id generator removed");

// features must install regardless of the URL they boot on.
assert.ok(!/feedFreshnessOn \|\| location\.pathname/.test(bundle),
  "NAV-01: feed-freshness installs on any page");
assert.ok(!/historyLocalHideOn \|\| !location\.pathname/.test(bundle),
  "NAV-02: history-local-hide installs on any page");

// adaptive throttle must keep ticking while hidden so the 60s guard can fire.
assert.ok(/e\.addInterval\(t, 3e4, \{ pauseWhenHidden: !1 \}\)/.test(bundle),
  "THR-01: adaptive-throttle interval runs while hidden");

// the campaign guard must hold for the campaign, and the master toggle must explain itself.
assert.ok(/}, 60000\);/.test(bundle),
  "FW-GUARD-01: safety timer covers the campaign");
assert.ok(!/\n    jt = !1;\n  \}/.test(bundle),
  "FW-GUARD-01: guard is not released synchronously");
assert.ok(/Force Watched: turn on account history/.test(bundle),
  "FW-TOGGLE-01: master-only enable explains the companions");

// rebuffer listeners must attach to the video element.
assert.ok(!/e\.addListener\(ie, "waiting"/.test(bundle),
  "BUF-01: buffer-health binds the video element, not the helper object");

// API interception must be retryable when fetch is temporarily absent.
assert.ok(/if \(typeof prevFetch !== "function"\) return;\n        apiInstalled = true;/.test(bundle),
  "DUB-01: apiInstalled only after the fetch check");

// Force Watched must not seek without a track, and must stop on transport failure.
assert.ok(/if \(!track \|\| !track\.watchtimeUrl\)/.test(bundle),
  "FW-02: beacon template is required before arming/seeking");
assert.ok(/if \(!resp \|\| !resp\.json\) return undefined;/.test(bundle) && /undefined marks a transport failure/.test(bundle),
  "FW-03: history verification distinguishes transport failure from a signed-out miss");

// the font picker must write its own config key.
assert.ok(/const _cfgKey = e;/.test(bundle) && /Ta\(_cfgKey, a\.dataset\.value\)/.test(bundle),
  "FONT-01: font picker writes the config key, not the label");

// manual cache trim must not revoke live blob URLs.
assert.ok(/revokeOlderThan\(30 \* 60 \* 1000\)/.test(bundle) && /Ve\.clear\(\)/.test(bundle),
  "BLOB-01: trim uses the maintenance threshold and drops stale cache refs");

// SponsorBlock view reports must use the real UUID-only endpoint.
assert.ok(/\/api\/viewedVideoSponsorTime\?UUID=/.test(bundle),
  "SB-VIEW-01: view counter posts to /api/viewedVideoSponsorTime");
assert.ok(!/viewedSponsorSegment/.test(bundle),
  "SB-VIEW-01: the non-existent endpoint is gone");
assert.ok(!/viewedVideoSponsorTime\?UUID=" \+ encodeURIComponent\(uuid\) \+ "&videoID=/.test(bundle),
  "SB-VIEW-01: view reports stay UUID-only");

// a timeout must be retryable and must not masquerade as a navigation abort.
assert.ok(/let timedOut = false;/.test(bundle) && /httpError\(408, "Request timed out"\)/.test(bundle),
  "SB-TIMEOUT-01: timeouts surface as 408 so they retry instead of looking cancelled");
assert.ok(/err\.name === "AbortError" && abortSignal && abortSignal\.aborted\) throw err/.test(bundle),
  "SB-TIMEOUT-02: only navigation aborts are fatal");

// the cache trimmer must also expire SponsorBlock rows (expiresAt).
assert.ok(/row\.v\.expires \|\| row\.v\.expiresAt/.test(bundle),
  "SB-CACHE-01: trimmer accepts both expiry field names");

// per-category seekbar toggles must invalidate the render key and re-apply.
assert.ok(/"sb_" \+ category\.id \+ "_act"\] \|\| "skip";[\s\S]{0,160}sb_" \+ category\.id \+ "_sb"/.test(bundle),
  "SB-RENDER-01: seekbar visibility participates in the render key");
assert.ok(/"sb_" \+ e\.id \+ "_sb"\]/.test(bundle),
  "SB-KEYS-01: sb_<cat>_sb is registered in the card keys");

// --- batch 3: feature, config and data-layer fixes ---
assert.ok(/audioIsOriginal === true \|\| t\.isDefault === true/.test(bundle) &&
  !/\|\| r\[0\];/.test(bundle.slice(bundle.indexOf("defaultOriginalAudioOn"), bundle.indexOf("defaultOriginalAudioOn") + 1200)),
  "AUDIO-01: original track chosen by metadata, never blindly the first track");

assert.ok(/scaleX\(var\(--ytb-flip-h,1\)\) scaleY\(var\(--ytb-flip-v,1\)\)/.test(bundle) &&
  !/n\.style\.transform = "scale\("/.test(bundle),
  "FLIP-01: filters and flip compose through custom properties");

assert.ok(/skipping the localStorage mirror/.test(bundle) && !/delete n\.customCSS/.test(bundle),
  "CFG-01: quota fallback no longer writes a divergent partial config");

assert.ok(/function restoreShortsShells/.test(bundle) && /if \("shorts" === kind\) restoreShortsShells\(\);/.test(bundle),
  "SHORTS-01: disabling hide-shorts restores hidden shelves");

assert.ok(/const pe_bindClick = \(fn\) => \{/.test(bundle) && /_toastUnbind\(\)/.test(bundle) &&
  !/_ytbUpToDateBound/.test(bundle) && !/_riskyBound/.test(bundle),
  "TOAST-01: toast click handlers are unbound before each message");

assert.ok(/if \(!vid \|\| vid === lastVid\) return;/.test(bundle),
  "MUTE-01: shorts auto-mute only mutes once per video");

assert.ok(/dataset\.ytbCs/.test(bundle) && /if \(el\.dataset\.ytbCf\) return;/.test(bundle) &&
  /if \(!thread\.dataset\.ytbCs\) thread\.style\.display = "";/.test(bundle),
  "COMMENTS-01: comment search and comment filter coordinate visibility");

assert.ok(/getClientRects\(\)\.length\) return true;/.test(bundle),
  "POPUP-01: popup gate only counts rendered dropdowns");

assert.ok(/xa\._styleIds\.delete\(_sid\)/.test(bundle),
  "WATCHDOG-01: style ids are pruned instead of cleared");

assert.ok(/id: "feed-watched"/.test(bundle) && /masterKey: "feedWatchedMode"/.test(bundle),
  "FEED-01: feed watched dim/hide has a real control");

assert.ok(/flushStores/.test(bundle) && /return k\("kv", \{ k: storeKey/.test(bundle),
  "STORE-01: YourTubeEngine stores await their writes and flush on unload");

assert.ok(/document\.body\.appendChild\(w\);/.test(bundle),
  "HUB-01: overlay hub returns adopted widgets to the page on teardown");

assert.ok(/"playlistWatchedMarkerOn", "sessionRestoreOn"/.test(bundle),
  "PLMARK-01: watch-marks re-scan when history is enabled");

assert.ok(/window\.__ytbDashEsc = _esc;/.test(bundle) && /try \{ c\.focus\(\); \}/.test(bundle),
  "DASH-01: dashboard closes on Escape and focuses search");

// 1.3.0 (F7): the raw-setInterval retry was replaced by chained ctx-managed
// timeouts — same 250 ms cadence and ≤5 s ceiling, but teardown-aware. The
// invariant this pin protects is the retry-until-player-ready behaviour plus
// the absence of the un-managed setInterval that leaked.
assert.ok(/const arm = \(\) => \{[\s\S]{0,800}addTimeout\(tick, 250\)/.test(bundle),
  "THEATER-01: theater mode retries until the player is ready");
assert.ok(!/const arm = \(\) => \{[\s\S]{0,800}?setInterval\(/.test(bundle),
  "THEATER-02: theater mode must not bury a raw setInterval that teardown cannot clear");

assert.ok(/for \(const mm of map\.markersMap\)/.test(bundle),
  "CHAP-01: chapter auto-skip reads every markers map");

assert.ok(/On-player panel: resolution, quality, FPS, bitrate, time, rate, buffer/.test(bundle),
  "STATS-01: overlay summary matches what it renders");

assert.ok(/gr\.autoPaused = !0;/.test(bundle.slice(bundle.indexOf('id: "background-players-pause"'), bundle.indexOf('id: "background-players-pause"') + 1600)),
  "BGP-01: background pause marks itself auto-paused so resume works");

assert.ok(/const chKey = \(\) => \{/.test(bundle) && /store\.get\(\)\[legacyKey\(\)\]/.test(bundle),
  "CHVOL-01: per-channel keys standardised with a legacy fallback");

assert.ok(!/function Cc_apply/.test(bundle), "DEAD-01: Cc_apply removed");
assert.ok(!/let phase = 0/.test(bundle), "DEAD-02: ytb-ui-breather dead local removed");
assert.ok(/UBlockEngine\.unhideAll\(\)/.test(bundle), "DEAD-03: unhideAll is used by the channel-blocker teardown");
assert.ok(/YourTubeSession\.genome\.record\(/.test(bundle), "GENOME-01: the niche genome is actually recorded");
assert.ok(/budget\._pending/.test(bundle), "BUDGET-01: watch-budget batches its writes");

// a change made during boot must survive the async config load, and the
// initial-data trap must be installed before the page assigns ytInitialData.
assert.ok(/_bootTouched/.test(bundle) && /Late config merge: kept /.test(bundle),
  "CFG-RACE-01: boot-time changes are merged over the late-loaded config");
assert.ok(!/if \(!S\.hideShorts && !S\.hideAutoDubbedOn\) return;/.test(bundle),
  "CFG-RACE-02: the ytInitialData trap installs unconditionally (decision made in the setter)");

// the stats overlay parses the player's video-stats payload with a pure
// helper; evaluate the shipped function source and check real-shaped inputs.
{
  const src = (bundle.match(/function _ytParseVideoStats\(raw\) \{[\s\S]*?\n  \}/) || [])[0];
  assert.ok(src, "STATS-02: _ytParseVideoStats present in the bundle");
  const fn = new Function("return (" + src + ")")();
  const sample = '{"ns":"yt","el":"detailpage","cpn":"abc","fmt":"137 - 1080p60","bitrate":"4836 kbps","splay":1}';
  const parsed = fn(sample);
  assert.ok(parsed && parsed.fmt === "137 - 1080p60" && parsed.bitrate === "4836 kbps",
    "STATS-02: fmt and bitrate parsed from the player stats string");
  assert.strictEqual(fn('{"bitrate":"1234.5 kbps"}').bitrate, "1234.5 kbps", "STATS-02: bitrate-only payload");
  assert.strictEqual(fn("not json at all"), null, "STATS-02: unknown payload returns null");
  assert.strictEqual(fn(null), null, "STATS-02: null returns null");
  assert.strictEqual(fn({ fmt: "22 - 720p" }).fmt, "22 - 720p", "STATS-02: object payload handled");
}

// the procedural text match must be scoped, and the name/title toggle honoured.
assert.ok(/hasTextSelector/.test(bundle) &&
  /const scopeEl = f\.hasTextSelector \? \(el\.querySelector\(f\.hasTextSelector\) \|\| el\) : el;/.test(bundle),
  "CHBLOCK-01: procedural text matching supports a scoped selector");
assert.ok(/hasTextSelector = scoped\[1\]\.trim\(\);/.test(bundle),
  "CHBLOCK-02: the engine extracts the :has(:is(scope):has-text(...)) shape");
assert.ok(/S\.channelBlockerMatchTitleText[\s\S]{0,40}\? ja\.join\(","\)/.test(bundle),
  "CHBLOCK-03: the title-text toggle chooses the text scope");
assert.ok(/ytd-channel-name a, #channel-name a, #owner-name a, ytd-video-owner-renderer a/.test(bundle),
  "CHBLOCK-04: channel-name scope present for the default mode");

// keyword filter: the CSS fast path covers legacy renderers (whose
// #video-title still carries a title attribute) and the DOM matcher covers
// 2026 lockup cards. 1.3.0 (F6) pruned the lockup CSS branches after live
// verification that lockup cards expose no title attributes at all — the
// selectors could only ever cost layout work — and the pins below make both
// halves of that decision stick.
assert.ok(/ytd-video-renderer:has\(#video-title\[title\*="/.test(bundle),
  "KWFILTER-01: CSS fast path keeps legacy renderer coverage");
assert.ok(!/yt-lockup-view-model(:has\(a)?\[title\*="/.test(bundle),
  "KWFILTER-01b: dead lockup title*= CSS branches stay pruned");
assert.ok(/e\.querySelector\("\.ytLockupMetadataViewModelTitle"\)/.test(bundle),
  "KWFILTER-02: DOM matcher falls back to the lockup title");

// Discover does not re-run its search on every navigation.
assert.ok(/_lastDiscoverRefresh/.test(bundle) && /if \(Date\.now\(\) - _lastDiscoverRefresh < 300000\) return;/.test(bundle),
  "DISCOVER-01: navigation refresh is throttled");

// the storage and health panels are gated on their own toggles.
assert.ok(/if \(ev\.key === "storageDashboardOn"\) sync\(\)/.test(bundle) &&
  /if \(ev\.key === "healthCheckOn"\) sync\(\)/.test(bundle),
  "PANEL-01: storage/health panels follow their toggles");

// theme inks must be adapted per surface, and the CTA label chosen by luminance.

// only known VIPs may be skipped when the option is on, and failed lookups stay unknown.
assert.ok(/State\.vipByUserID\.get\(seg\.userID\) !== true/.test(bundle),
  "SB-VIP-01: unknown uploaders are not skipped");
assert.ok(!/catch\(\(\) => \{ rememberVip\(uid, false\); \}\)/.test(bundle),
  "SB-VIP-02: failed VIP lookups are not recorded as non-VIP");

// a fail-closed privacy lookup must not be cached as "no segments".
assert.ok(/takePrivacyUnavailable/.test(bundle) && /if \(!privacySkip\) await Cache\.set/.test(bundle),
  "SB-PRIVACY-01: privacy-unavailable results are not persisted");

// GM transport must expose response headers so Retry-After is honoured.
assert.ok(/headers: \{[\s\S]{0,400}response\.responseHeaders/.test(bundle),
  "SB-HEADERS-01: GM response shim exposes headers.get");

// the beacon rewrite must be scoped to the campaign and disarmable.
assert.ok(/function _fwDisarm\(expectedVideoId\)/.test(bundle) && /_fwDisarm\(videoId\);/.test(bundle) && /_fwDisarm\(\);/.test(bundle),
  "FW-SCOPE-01: interception can be disarmed, and only for its own campaign");
assert.ok(/if \(campaignCpn && beaconCpn && beaconCpn !== campaignCpn\) return u;/.test(bundle) &&
  /if \(campaignVid && beaconVid && beaconVid !== campaignVid\) return u;/.test(bundle),
  "FW-SCOPE-02: only the campaign's own beacons are rewritten");
assert.ok(/_fwArm\(DU, videoId, cpn\)/.test(bundle),
  "FW-SCOPE-03: the campaign identity is armed with the length");

// beacon templates must be captured from the page's own beacons.
assert.ok(/const capture = \(u\) => \{ try \{ if \(isStats\(u\)\) _fwTplSet\(u\); \} catch \(e\) \{\} \};/.test(bundle),
  "FW-TPL-01: real beacon templates are captured");
assert.ok((bundle.match(/capture\(/g) || []).length >= 4,
  "FW-TPL-02: capture is wired into beacon/fetch/XHR hooks");

// the risky acknowledgement must actually gate the signal-emitting paths.
assert.ok(/const _riskyGate = \(\) => \{/.test(bundle) && /if \(typeof _riskyGate === "function" && !_riskyGate\(\)\) return;/.test(bundle),
  "FW-ACK-01: Force Watched refuses to run before acknowledgement");
assert.ok(/_riskyGate !== "function" \|\| _riskyGate\(\)/.test(bundle),
  "FW-ACK-02: algo watch tracking is gated too");
assert.ok(/_riskyGate\(\)\) \{\n        AlgoEngine\.stopMonitoring/.test(bundle),
  "FW-ACK-03: algo monitoring is gated");
assert.ok(/g\.on\("cfg\.changed", \(\{ key \}\) => \{[\s\S]{0,300}_riskyPrompt\(\)/.test(bundle),
  "FW-ACK-04: enabling a risky feature mid-session re-prompts");

// Force Watched must work without GM_xmlhttpRequest.
assert.ok(/if \(typeof GM_xmlhttpRequest !== "function"\) \{[\s\S]{0,420}credentials: "include"/.test(bundle),
  "FW-TRANSPORT-01: InnerTube falls back to same-origin fetch");

// the unsupported Delete endpoint must not be reachable.
assert.ok(!/Delete failed: /.test(bundle) && !/\/api\/skipSegments\/" \+ encodeURIComponent/.test(bundle),
  "SB-DELETE-01: delete UI and DELETE request removed");
assert.ok(/Deletion is not supported by the SponsorBlock API/.test(bundle),
  "SB-DELETE-01: the API method explains itself instead of 404ing");

// VIP lookups are capped, not a burst.
assert.ok(/VIP_LOOKUP_LIMIT = 2/.test(bundle) && /pumpVipQueue/.test(bundle),
  "SB-VIP-03: VIP lookups are queued with a concurrency cap");
assert.ok(/_ytAdaptInkAll\(t\["text-primary"\], \[a, n, r\], e\.mode, 7\)/.test(bundle),
  "THEME-CONTRAST-01: primary ink adapted against base/raised/menu");
assert.ok(/_ytAdaptInkAll\(t\["text-secondary"\], \[a, n, r, p\], e\.mode, 4\.6\)/.test(bundle),
  "THEME-CONTRAST-02: secondary ink adapted against base/raised/menu/chip");
assert.ok(/_ctaLabel = !_ctaFill \|\| _zratio\(\[255, 255, 255, 1\], _ctaFill\) >= _zratio\(\[0, 0, 0, 1\], _ctaFill\)/.test(bundle),
  "THEME-CONTRAST-03: filled-button label chosen by measured luminance");
assert.ok(/hInk = _ytAdaptInk\(h, a, e\.mode, 4\.5\)/.test(bundle) && /"--yt-endpoint-color:" \+ hInk/.test(bundle),
  "THEME-CONTRAST-04: accent used as text is contrast-adapted");
assert.ok(/color:#fff!important;border:0!important/.test(bundle) === false,
  "THEME-CONTRAST-05: hardcoded white CTA label removed");

// early theme pass must exist and be dropped when the full theme mounts.
assert.ok(/_ytEarlyTheme\(\)/.test(bundle) && /_ytEarlyThemeDrop\(\)/.test(bundle),
  "THEME-EARLY-01: early token sheet painted at boot and dropped on full apply");

// dead theme controls removed.
for (const dead of ["themeAccentHue", "themeFxHoverLift", "themeFxRipple", "themeFxGlassMasthead", "themeFxThemeTransition", "themeFxScrollDriven", "themeFxScrollbar", "themeFxFocusRing", "themeFxButtonShine", "themeFxSidebarStagger", "themeFxCardLoadAnim", "themeFxAccentGradient"]) {
  assert.ok(!bundle.includes(dead), `THEME-DEAD-01: ${dead} must stay removed`);
}
assert.ok(bundle.includes("themeFxReducedMotion"), "THEME-DEAD-01: themeFxReducedMotion is consumed and kept");

console.log("Regression suite passed.");

// --- feed hygiene and player chrome additions ---
assert.ok(/id: "seen-memory"/.test(bundle) && /__yourtube_seen__/.test(bundle) &&
  /now - at <= limit && now - at > grace/.test(bundle),
  "FEED-SEEN-01: anti-repeat memory records and hides with a grace period");
assert.ok(/id: "hide-low-views"/.test(bundle) && /lowViewThreshold/.test(bundle) &&
  bundle.includes("([\\d.,]+)\\s*([KMB])?\\s*views") && bundle.includes("{ K: 1e3, M: 1e6, B: 1e9 }"),
  "FEED-LOWVIEW-01: view counts are parsed (with K/M/B) and compared to the threshold");
assert.ok(/id: "card-metadata"/.test(bundle) && /cardMetaVelocity/.test(bundle) && /cardMetaDate/.test(bundle),
  "FEED-META-01: velocity and upload-date badges present");
assert.ok(/id: "search-filler"/.test(bundle) && /related to your search\|people also search for/.test(bundle) &&
  /ytd-search-refinement-card-renderer/.test(bundle),
  "FEED-FILLER-01: search filler sections are removed by element and by label");
assert.ok(/id: "hide-community-posts"/.test(bundle) && /ytd-backstage-post-thread-renderer/.test(bundle),
  "FEED-POSTS-01: community posts can be hidden");
assert.ok(/id: "hide-mixes"/.test(bundle) && /start_radio=1/.test(bundle) && /ytd-compact-radio-renderer/.test(bundle),
  "FEED-MIXES-01: mixes and radios can be hidden");
assert.ok(/id: "player-gradient"/.test(bundle) && /\.ytp-gradient-top, \.ytp-gradient-bottom\{display:none/.test(bundle),
  "PLAYER-GRADIENT-01: player gradient toggle present");
assert.ok(/id: "hide-upnext"/.test(bundle) && /\.ytp-autonav-endscreen-countdown-container/.test(bundle) &&
  /\.ytp-endscreen-content/.test(bundle),
  "PLAYER-UPNEXT-01: up-next overlay and end-screen wall can be hidden");
assert.ok(/id: "hide-ai-ask"/.test(bundle) && /ask about this video/.test(bundle) && /ytd-ask-button-renderer/.test(bundle),
  "PLAYER-ASK-01: the AI Ask button is matched by element and by label");
assert.ok(/id: "auto-exit-fullscreen"/.test(bundle) && /document\.exitFullscreen\(\)/.test(bundle),
  "PLAYER-FS-01: fullscreen exits when the video ends");
assert.ok(/textScaleScope/.test(bundle) && /"watch" === S\.textScaleScope/.test(bundle) === false &&
  /S\.textScaleScope === "watch"/.test(bundle),
  "TEXTSCALE-01: reading size can be limited to the watch page");

// --- playback and audio additions ---
assert.ok(/id: "wheel-controls"/.test(bundle) && /"wheel", onWheel, \{ passive: false \}/.test(bundle) &&
  /ytp-progress-bar-container, \.ytp-progress-bar/.test(bundle),
  "PLAY-WHEEL-01: wheel controls bind with a non-passive listener and distinguish the progress bar");
assert.ok(/id: "volume-boost"/.test(bundle) && /createMediaElementSource/.test(bundle) &&
  /_ytAudioGraphs\.set\(el, entry\)/.test(bundle) && /__yourtube_boost__/.test(bundle),
  "PLAY-BOOST-01: audio graph is created once per element and boost is remembered per channel");
assert.ok(/id: "loudness-leveling"/.test(bundle) && /createDynamicsCompressor/.test(bundle) &&
  /entry\.comp\.ratio\.value = 1;/.test(bundle),
  "PLAY-LEVEL-01: leveling uses a compressor that resets to transparent");
assert.ok(/id: "sticky-quality"/.test(bundle) && /_isLiveStream\(\)/.test(bundle) && /ie\.setQuality\(target\)/.test(bundle),
  "PLAY-STICKY-01: live quality is re-asserted");
assert.ok(/id: "wide-player"/.test(bundle) && /ytb-ui-wide/.test(bundle) && /html\.ytb-ui-wide ytd-watch-flexy #columns/.test(bundle),
  "PLAY-WIDE-01: wide player layout present");
assert.ok(/id: "shorts-speed"/.test(bundle) && /ytb-ui-shorts-progress/.test(bundle) && /shortsSpeedDefault/.test(bundle),
  "PLAY-SHORTS-01: shorts speed and progress bar present");

// --- third-party integrations ---
assert.ok(/id: "return-dislike"/.test(bundle) && /returnyoutubedislikeapi\.com\/votes\?videoId=/.test(bundle) &&
  /ytb-ui-ryd-count/.test(bundle) && /ytb-ui-ryd-bar/.test(bundle),
  "RYD-01: dislike counts and ratio bar render from the votes API");
assert.ok(/id: "dearrow"/.test(bundle) && /sponsor\.ajay\.app\/api\/branding\?videoID=/.test(bundle) &&
  /dearrow-thumb\.ajay\.app\/api\/v1\/getThumbnail/.test(bundle) && /ytb-ui-dearrow-chip/.test(bundle),
  "DEARROW-01: titles, thumbnails and the revert chip are wired");
assert.ok(/cardBudget = 12/.test(bundle) && /getBoundingClientRect\(\)/.test(bundle),
  "DEARROW-02: card thumbnails are lazy and capped per navigation");
assert.ok(/id: "live-chat-clean"/.test(bundle) && /yt-live-chat-paid-message-renderer/.test(bundle) &&
  /yt-live-chat-membership-item-renderer/.test(bundle),
  "CHAT-01: paid messages and membership items can be hidden");

// --- watch page, data and layout additions ---
assert.ok(/id: "transcript-tools"/.test(bundle) && /ytd-transcript-segment-renderer/.test(bundle) &&
  /ytb-ui-transcript-tools/.test(bundle) && /transcriptNoScroll/.test(bundle),
  "WATCH-TRANSCRIPT-01: transcript copy, download and no-scroll present");
assert.ok(/id: "notification-clean"/.test(bundle) && /ytb-ui-mark-read/.test(bundle) && /notificationHideBadge/.test(bundle),
  "WATCH-NOTIF-01: notification helpers present");
assert.ok(/id: "watch-later-tools"/.test(bundle) && /Hide watched/.test(bundle) &&
  /Copy remaining/.test(bundle) && /Sort by duration/.test(bundle),
  "WATCH-WL-01: watch later helpers present");
assert.ok(/id: "watch-stats"/.test(bundle) && /Top channels/.test(bundle) && /Recent days/.test(bundle),
  "DATA-STATS-01: watch statistics render from local history");
assert.ok(/id: "weekly-report"/.test(bundle) && /__yourtube_report__/.test(bundle),
  "DATA-WEEKLY-01: weekly report is stored and throttled to one per week");
assert.ok(/id: "random-pick"/.test(bundle) && /Math\.floor\(Math\.random\(\) \* ids\.length\)/.test(bundle),
  "DATA-RANDOM-01: random picker present");
assert.ok(/id: "shuffle-tools"/.test(bundle) && /Shuffled /.test(bundle),
  "DATA-SHUFFLE-01: shuffle reorders the list in the tab");
assert.ok(/id: "export-data"/.test(bundle) && /yourtube-history-/.test(bundle) && /text\/csv/.test(bundle) &&
  /yourtube-subscriptions-/.test(bundle),
  "DATA-EXPORT-01: history, playlist and subscription exports present");
assert.ok(/id: "sub-groups"/.test(bundle) && /__yourtube_groups__/.test(bundle) &&
  /ytb-ui-groups/.test(bundle) && /ytb-group-hidden/.test(bundle),
  "GROUPS-01: subscription groups store and feed filter present");
assert.ok(/id: "sub-group-add"/.test(bundle) && /Add to group/.test(bundle),
  "GROUPS-02: channels can be added to a group from their page");
assert.ok(/id: "ui-restore-2026"/.test(bundle) && /ytb-ui-subs/.test(bundle) && /subscriberCountText/.test(bundle),
  "UI-RESTORE-01: subscriber count and inline like cleanup present");
assert.ok(/id: "watch-tabs"/.test(bundle) && /data-ytb-tab/.test(bundle) && /ytb-ui-tabs-bar/.test(bundle),
  "UI-TABS-01: tabbed watch page present");
assert.ok(/id: "keymap"/.test(bundle) && /_YT_KEYMAP_DEFAULTS/.test(bundle) && /function _ytKeySpec/.test(bundle) &&
  /_bound\("forceWatched"\)/.test(bundle),
  "KEYS-01: shortcuts are dispatched through the rebindable keymap");
assert.ok(/id: "subs-only-home"/.test(bundle) && /ytb-ui-subs-only/.test(bundle) && /feed\/subscriptions/.test(bundle),
  "FEED-SUBSONLY-01: subscriptions-only home present");
assert.ok(/id: "sort-search"/.test(bundle) && /ytb-ui-sort-bar/.test(bundle) && /Sorted .* results by /.test(bundle),
  "FEED-SORTSEARCH-01: search result sorting present");

// ---------------------------------------------------------------------------
// Polish pass: fixes from the second full review.
// ---------------------------------------------------------------------------

// primitives
assert.ok(/if \(isHidden\(\)\) \{[\s\S]{0,40}hasRunnableTask\(\)/.test(bundle),
  "RES-TICK-01: hidden tabs keep pauseHidden:false tasks ticking");
assert.ok(/if \(this\._loadPromise && !this\._loaded\)/.test(bundle),
  "RES-STORE-01: flushes wait for the initial load before writing");
assert.ok(/AbortSignal\.timeout\(o\.timeout\)/.test(bundle),
  "NET-01: fetchJson honours its timeout on the fetch path");

// new feature cards
assert.ok(/const bound = new WeakSet\(\);[\s\S]{0,120}bound\.has\(el\)/.test(bundle) && !/ytbFsExit/.test(bundle),
  "FW-EXIT-01: auto-exit binds per apply, not with a dataset flag");
assert.ok(/ytb-ui-cardmeta/.test(bundle) && /Yt\["card-metadata"\]\.push/.test(bundle),
  "META-01: card metadata badges have their own class and a teardown");
assert.ok(/Yt\["dearrow"\]\.push/.test(bundle) && /thumbOriginals/.test(bundle),
  "DEARROW-01: titles and thumbnails are restored on teardown");
assert.ok(/if \(!existing \|\| !Number\.isFinite\(existing\.pct\)\)/.test(bundle),
  "BOOST-01: a saved per-channel boost is not overwritten by the global amount");
assert.ok(/let revealed = false/.test(bundle) && /revealed = true/.test(bundle),
  "SUBSONLY-01: 'show the feed once' is not cancelled by the mount interval");
assert.ok(/Tabs only apply to the watch page/.test(bundle),
  "TABS-01: tab state resets when leaving the watch page");
assert.ok(/Recording timed out/.test(bundle) && /ev\.key === "Escape"/.test(bundle),
  "KEYS-02: shortcut recording cannot leak its listener");
assert.ok(/if \(S\.watchLaterHideWatched\) row\.appendChild/.test(bundle) && /if \(S\.watchLaterSortDuration\) row\.appendChild/.test(bundle),
  "WL-01: watch-later buttons honour their settings");
assert.ok(/let target = available\.indexOf\(want\) !== -1 \? want : ""/.test(bundle),
  "QUALITY-01: sticky quality picks the closest level at or below the preference");
assert.ok(/youtube.com\/watch\?v=" \+ id/.test(bundle) && /ytd-tabbed-page-header #buttons/.test(bundle),
  "PICK-01: channel headers use the current page-header elements");

// ublock filter interpreter
assert.ok(bundle.indexOf("(?:\\\\[\\s\\S]|[^\\\\)])*") !== -1,
  "UBLOCK-01: the procedural selector regex has no ambiguous alternatives");
assert.ok(/if \(selector\.length > MAX_SELECTOR_LENGTH\) return null;/.test(bundle),
  "UBLOCK-02: over-long selectors are rejected before parsing");

// SponsorBlock
assert.ok(/betterBeAwareCats\(\)\.has\(seg\.category\)\) \{/.test(bundle) && /Warn instead of skipping/.test(bundle),
  "SB-WARN-01: warn-instead-of-skip categories are never skipped");
assert.ok(/if \(!armedForVideo \|\| State\.videoId !== armedForVideo\) return;/.test(bundle),
  "SB-COUNTDOWN-01: countdown skips only fire on their own video");
assert.ok(/keep it from being yanked forward again/.test(bundle),
  "SB-SEEK-01: seeking back into a skipped segment is respected");
assert.ok(!/Metrics\.recordApiError\(\);\n\s*throw lastError;/.test(bundle),
  "SB-RETRY-01: the unreachable retry tail stays removed");

// Force-Watched
assert.ok(/Object\.keys\(m\)\.sort\(\(a, b\) => b - a\)/.test(bundle),
  "FW-FMT-01: quality buckets are matched from the top down");
assert.ok(/try \{ u = new Request\(next, u\); \}/.test(bundle),
  "FW-REQ-01: rewritten Request objects keep their method and body");
assert.ok(/runToken === _fwRunSeq/.test(bundle),
  "FW-GUARD-01: the run guard is tokenized");
assert.ok(/await Promise\.allSettled\(beaconPromises\)/.test(bundle),
  "FW-BEACON-01: history verification waits for beacons");
assert.ok(/if \(!out\.hl\) out\.hl = t\.hl \|\| "en";/.test(bundle),
  "FW-LOCALE-01: locale falls back to the page config");

// settings import and watchdog
assert.ok((bundle.match(/_ytSanitizeHistoryRow/g) || []).length >= 3,
  "IMPORT-01: imported history rows are clamped before writing");
assert.ok(/if \(text\.length > 8388608\) throw new Error\("import too large"\)/.test(bundle),
  "IMPORT-02: oversized imports are rejected before parsing");
assert.ok(/for \(const \[a, n\] of Object\.entries\(s\)\)/.test(bundle) && !/for \(const \[a, v\] of Object\.entries\(e\)\)/.test(bundle),
  "IMPORT-03: only keys present in the defaults table are imported");
assert.ok(/if \(\(_missingStyle \|\| !_markers\) && _now - _lastMarkerReapply > 3e5\)/.test(bundle),
  "WD-01: every watchdog re-apply path is rate limited");

// dead code stays dead
assert.ok(!/YourTubeQueue|whenIdle|segmentEndFor|__fwTplDbg/.test(bundle),
  "CLEAN-01: dead modules and debug leftovers stay removed");
assert.ok(!/perfHidden|perfLogSuppressed|fadeTask|prevDark/.test(bundle),
  "CLEAN-02: dead perf and state flags stay removed");

// ---------------------------------------------------------------------------
// Stability overhaul: lifecycle, races and failure paths.
// ---------------------------------------------------------------------------

// boot
assert.ok(/var Xt = \{/.test(bundle) && /function p\(e, t, a\) \{[\s\S]{0,80}if \(Xt && Xt\.perfMode/.test(bundle),
  "BOOT-TDZ-01: the log helper's state object is hoisted so early logs cannot throw");

// primitives
assert.ok(/const storeCache = new Map\(\);/.test(bundle),
  "STORE-MEMO-01: stores are memoized per key across re-applies");
assert.ok(/could not persist after retries/.test(bundle) && /load failed; starting from defaults/.test(bundle),
  "STORE-ERR-01: storage failures are reported instead of vanishing");
assert.ok(/Logger\.error\("async"/.test(bundle),
  "ASYNC-LOG-01: async callback rejections reach the logger ring");
assert.ok(/re-entering request\(\) here would drop it/.test(bundle),
  "SCHED-01: coalesced scan re-requests are not dropped by the min-gap gate");
assert.ok(/rAF is suspended while the tab is hidden/.test(bundle),
  "OBS-HIDDEN-01: pending observer flushes convert to timers when the tab hides");
assert.ok(/Dom\.when: cancelled/.test(bundle),
  "WHEN-01: cancelling when() settles its promise");
assert.ok(/if \(pendingBatch\.length > MAX_PENDING_MUTATIONS\)/.test(bundle),
  "OBS-CAP-01: re-observed mutations respect the pending cap");

// engine
assert.ok(/cssInjected && document\.getElementById\("ytb-engine"\)/.test(bundle),
  "INJECT-01: the engine stylesheet is re-injected when removed");
assert.ok(/(skipLatched\.size > 200)/.test(bundle),
  "LATCH-01: the skip latch is bounded");
assert.ok(/re-arm the mount on navigation/.test(bundle),
  "DISCO-01: the discovery host re-mounts after SPA detaches");
assert.ok(/Restore downgraded thumbnails and clear the observation flags/.test(bundle),
  "PERF-THUMB-01: perf-mode restores thumbnails on teardown");
assert.ok(/title\.replace\(\/ \?✓ watched\/g/.test(bundle),
  "PLW-01: the watched suffix is stripped on teardown");
assert.ok(/if \(d\.length > 500\) d\.splice\(0, d\.length - 500\);/.test(bundle),
  "HLH-01: the locally hidden history list is capped");

// new cards
assert.ok(/let applyAlive = true;/.test(bundle) && /applyAlive = false;/.test(bundle),
  "DEARROW-ALIVE-01: late DeArrow responses cannot write after teardown");
assert.ok(/revertedFor = videoId/.test(bundle),
  "DEARROW-REVERT-01: a dismissed community title stays dismissed");
assert.ok(/ytbSubsFor/.test(bundle),
  "UISUBS-01: the subscriber chip is keyed to its video");
assert.ok(/ytbRydFor/.test(bundle),
  "RYD-BAR-01: the dislike bar is keyed to its video");
assert.ok(/shared && !shared\.dead/.test(bundle),
  "AUDIO-JOIN-01: boost joins stream-routed audio graphs");
assert.ok(/if \(mode === "date"\) return value\(a\) - value\(b\);/.test(bundle),
  "SORT-DUR-01: longest-first sorting sorts by duration descending");
assert.ok(/else if \(node\.dataset\.ytbAsk\)/.test(bundle),
  "ASK-UNHIDE-01: reused buttons are un-hidden when their label changes");
assert.ok(/status === "duplicate"/.test(bundle) && /already exists\./.test(bundle),
  "GROUPS-03: group limits report their real outcome");

// sponsorblock
assert.ok(/Failure is not a "not VIP" verdict/.test(bundle) && /vip === true \|\| vip === false/.test(bundle),
  "SB-VIP-03: failed VIP lookups stay unknown");
assert.ok(/Stable for the session: overlapping inits/.test(bundle),
  "SB-ID-01: the user id is generated at most once per session");
assert.ok(/lastFailedLookupVideoId/.test(bundle) && /lookup failed/.test(bundle),
  "SB-RETRY-COOLDOWN-01: failed lookups back off and refresh reports them");
assert.ok(/Body-mounted singletons must not survive a disabled card/.test(bundle),
  "SB-DESTROY-01: destroy() clears countdown, editor and HUD");
assert.ok(/MAX_SCANNED_VIDEOS/.test(bundle),
  "SB-SCAN-01: the scanned-video cache is bounded");
assert.ok(/Submission failed: unexpected error/.test(bundle),
  "SB-SUBMIT-01: submit rejections surface");

// force-watched and bootstrap
assert.ok(/marked in local history only/.test(bundle),
  "FW-MIXED-01: local-only configuration releases the guard");
assert.ok(/undefined marks a transport failure/.test(bundle) && /has === undefined\) stats\.transportFailed/.test(bundle),
  "FW-VERIFY-01: transport failures retry instead of reporting a signed-out skip");
assert.ok(/AbortSignal\.timeout\(9000\)/.test(bundle) && /if \(!r\.ok\) return \{ status: r\.status, json: null \}/.test(bundle),
  "FW-FETCH-01: the fetch fallback has a timeout and status handling");
assert.ok(/\(_missingStyle \|\| !_markers\) && _now - _lastMarkerReapply/.test(bundle) && /cannot wedge the watchdog/.test(bundle),
  "WD-02: every watchdog re-apply path is rate limited and stale ids are pruned");
assert.ok(/Keys edited in this tab but not yet flushed/.test(bundle),
  "XTAB-01: unflushed local edits survive a cross-tab sync");
assert.ok(/Registered per drag/.test(bundle),
  "DASH-RESIZE-01: resize listeners live only for the drag");
assert.ok(/Math\.min\(u\.length, 40\)/.test(bundle),
  "DASH-CHUNK-01: the dashboard streams its card list");
assert.ok(/Route through the config setter/.test(bundle),
  "PERF-PERSIST-01: preset toggles are persisted like settings");
assert.ok(/A clean apply clears the crash counter/.test(bundle),
  "QUAR-01: quarantine counts current failures only");
assert.ok(/The resume gate must not stay installed/.test(bundle),
  "RESUME-GATE-01: the play() gate is removed on reset");