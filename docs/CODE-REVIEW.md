# Code review: the pre-rebrand codebase

This is the engineering review that drove the 1.1.7 to 1.1.9 releases of the
project when it was still called YT-zen. It is kept as history: file names,
line numbers and identifiers in this document refer to that older revision,
not to the current tree. Current development guidance lives in
ARCHITECTURE.md.

---

**Repo:** `mheci/YT-zen` @ `3e68723` (main) · **Version:** 1.1.6 · **Reviewed:** 2026-10-13
**Size:** `yt-zen.user.js` 32,715 lines / 1.22 MB · `src/` mirrors 8,799 lines · scripts 2,455 lines

---

## 0. Method and baseline

What I did:

1. Cloned the repo, ran `npm ci` and `npm test`. **The full gate passes** and `npm run build`
   is **byte-stable** (rebuild produces no `git diff`), so the checked-in artifact matches the
   four mirrored source files. That is a genuinely good baseline.
2. Read all four source mirrors end-to-end (`zen-resources.js`, `sponsorblock-engine-v2.js`,
   `ublock-filter-engine.js`, `zen-engine-v3.js`) and read/sampled the non-mirrored bundle
   (bootstrap, nav, config, registry, apply pipeline, theme engine, ~40 feature cards).
3. Ran automated audits I wrote for this review:
   - **settings integrity**: every key in the defaults table (`s`, lines 913–1276, 349 keys)
     cross-referenced against every card registration (123 explicit `xa.register({…})` sites plus
     10 more produced by the `Ha()` CSS-only helper at 10823–10835, i.e. **133 cards at runtime**)
     and every occurrence of the key anywhere in the bundle;
   - **dead-token audit**: ~800 YouTube-specific selectors extracted from the script and tested
     against YouTube's **live** desktop JS bundle (10.9 MB) and server HTML;
   - **CSS existence audit**: every class the script toggles (`ytp-extra-*`, …) checked for a
     matching rule in the bundle;
   - **live player verification** in Chromium (`getAvailableQualityLevels()` ordering).
4. Verified every high-severity claim below by reading the code myself. Where I could not verify
   something I mark it `[verify]` rather than asserting it.

Two things I explicitly checked and **cleared**, because they look like bugs but are not:
`hide-live-content`, `hide-premieres`, `highlight-video-length`, feed watched dim/hide,
`collapse-long-comments`' clamp and `number-search-results`' badge **do** have their CSS
(all rules live in one large minified stylesheet at line 26288 — for feed watched dim/hide it is
the *control* that is missing, see M21). Also, features whose *scan functions* are URL-gated
(`theater-default`, `reverse-playlist`, `auto-expand-desc`, `shorts-auto-mute`, `dup-title-spotter`,
`playlist-watched-marker`, `overlay-hub`) are fine, because those gates sit inside
`onNav`/interval callbacks — not inside `apply()`.

---

## 1. Verdict

| Area | Grade | Notes |
|---|---|---|
| Boot / apply pipeline | A− | shell-ready wait, chunked apply, quarantine, bfcache re-arm, watchdog |
| Config load / save / cross-tab | B+ | version+timestamp conflict resolution is solid; one race, one divergent fallback |
| Resource management | B | `ZenResources` is well built but only half-adopted; several duplicated primitives |
| Feature correctness | D+ | ~15 functional bugs including settings-import data loss, 2 features that never activate, 7 dead dashboard controls |
| "Instant" apply | C+ | CSS-only features are injected only after the app shell exists; theme paints late |
| Bit-rot resistance | C | selector lists carry stale legacy branches; comment features target a removed element |
| Accessibility / theme contract | C | primary inks are adapted correctly, but the accent color and secondary text on layered surfaces are not |
| Maintainability | D+ | 23.4k of 32.7k lines are hand-minified with **no** source mirror |
| Feature test coverage | D | engines are well tested; the ~133 feature cards are effectively untested |

The dominant risk to your stated goal ("every feature works, instantly, reliably, consistently")
is not crashes — the quarantine system handles those — it is **features that silently do
nothing**: dead controls, URL-gated activation, stale selectors, and a binding pattern that
unbinds a feature permanently after any re-apply.

---

## 2. High severity

### H1. `auto-hd` can silently drop a video to 144p
`yt-zen.user.js:9468`
```js
{ const lv = e.filter((q) => q && "auto" !== q); if (-1 === e.indexOf(t)) { const below = lv.filter((q) => q < t)[0]; t = below || lv[lv.length - 1] || t; } }
```
Quality levels are **strings** (`hd2160, hd1440, hd1080, hd720, large, medium, small, tiny` —
see the label map at 869–879 and `ie.levels()` → `player.getAvailableQualityLevels()` at 3820).
So `q < t` is a lexicographic test, and `lv[lv.length - 1]` is the **last** element of a
descending list. I confirmed the live ordering in Chromium:
`["hd2160","hd1440","hd1080","hd720","large","medium","small","tiny","auto"]`.

Result: on a 720p-max video with the default `qualityPref: "hd1080"`, the filter yields nothing
(`"hd720" > "hd1080"` lexicographically) and the fallback picks `"tiny"` → **the video is forced
to 144p**. The card is "Always Use My Preferred Quality", so this is user-visible and severe.

**Fix:** rank levels with an explicit order and pick the closest level *at or below* the
preference:
```js
const RANK = ["hd2160","hd1440","hd1080","hd720","large","medium","small","tiny"];
const wanted = RANK.indexOf(S.qualityPref);
const pick = RANK.filter(r => lv.includes(r))
  .sort((a,b) => RANK.indexOf(a) - RANK.indexOf(b))
  .filter(r => RANK.indexOf(r) >= wanted).pop() || lv[0];
```

### H2. The "bind-once flag on a persistent element" pattern permanently unbinds 6 features
`xa.apply()` always calls `ha(id)` first (line 9110), which removes every listener, observer,
interval and timeout registered through the per-feature context. Several features guard their
binding with a property written onto a **persistent** DOM/player object, so after any re-apply
(config change, watchdog `applyAll`, quarantine recovery, bfcache restore) the flag survives but
the binding does not — and the feature never re-binds.

| Feature | Flag | Line | Consequence |
|---|---|---|---|
| `ab-repeat` | `video.__ytpAbRepeatBound` | 9429 | **`Set A`/`Set B` themselves break the loop** — `Ta("abA"/"abB")` re-applies the feature, the `timeupdate` listener is removed and never re-added |
| `force-cc` | `playerApi.__ytpCcStateBound` | 10024 | `onStateChange` re-engage lost |
| `force-cc` | `button.__ytpCcWatched` | 10031 | manual-off detection + `aria-pressed` observer lost |
| `autoskip-ad-btn` | `#movie_player.__ytpAdSkipObs` | 10215 | ad auto-skip observer lost until reload |
| `top-progress-bar` | `video.__ytpTopProgressBound` | 15750 | nav re-bind skipped |
| `end-soon-warning` | `video.__ytpEndSoonBound` | 16233 | nav re-bind skipped |

`ab-repeat` is the worst because the flag guards the *primary* binding (9425–9431), so the feature
dies the first time you use it.

**Fix:** never store binding state on objects that outlive a teardown. Use a per-apply
`WeakSet` (the pattern `loop-video` 9394, `auto-hd` 9474 and `force-cc` 10013 already use) or
push a cleanup that deletes the flag:
```js
const bound = new WeakSet();
const bind = () => { const v = ie.el(); if (v && !bound.has(v)) { bound.add(v); e.addListener(v, "timeupdate", tick); } };
```
Consider adding a lint/test that fails on `.__ytp` assignments inside `apply()` bodies.

### H3. `speed-controller` fights the player and defeats `speed-per-channel`
`yt-zen.user.js:9234–9259`, `9344`
```js
const a = () => { const el = ie.el(); ... el && Math.abs(el.playbackRate - t) > 0.01 && (el.playbackRate = t); };
const ag = () => { if (S.smartSpeedOn) return; a(); };            // 9241
...
e.addListener(t, "ratechange", ag), e.addListener(t, "loadedmetadata", ag), e.addListener(t, "play", ag);
```
Once the feature is active (per-video memory on, or a non-1× default), **every** `ratechange`
re-asserts `speedDefault`. So:
- YouTube's own speed menu cannot change speed — it snaps back;
- `speed-per-channel`'s restore (`t.playbackRate = rec.r`, 9344) is immediately reverted, and the
  resulting `ratechange` makes its `_save` (9355–9362) overwrite the stored per-channel value with
  the default;
- the intended escape hatch is dead: `smartSpeedOn` is not in the defaults table and is never set,
  so the guard never fires.

Also `speedStep` ("Hotkey step", 9275) is read by nothing and there is no speed hotkey (see H8).

**Fix:** drop the `ratechange` re-assertion (keep `loadedmetadata`/`play`), or ignore
`ratechange` events that the feature did not cause; and either implement the speed hotkey with
`speedStep` or remove the setting.

### H4. Comment features target an element YouTube no longer has
`yt-zen.user.js:16126`, `16174`, `24379–24399`

`ytd-comment-renderer` appears **0 times** in YouTube's live desktop JS bundle, while
`ytd-comment-view-model` (48), `ytd-comment-thread-renderer` (18) and the new
`yt-ghost-comments` (121) do. The script's own theme extras already include the modern names
(21093), but these features do not:

- `collapse-long-comments` (16126): `.querySelectorAll("ytd-comment-renderer #content-text")`
  → matches nothing → **never clamps a comment** (the clamp CSS at 26288 is fine; the selector is not);
- `highlight-creator-comments` (16174): CSS targets `ytd-comment-renderer:has(…)` → **never highlights**;
- `elements-control` (24379–24399): the comment author/text/timestamp rows target
  `ytd-comment-renderer` / `ytd-comment-action-buttons-renderer` → cannot match on a modern watch page.

I also observed `yt-ghost-comments` in the live DOM and no `#content-text` nodes at all on a
logged-out watch page, so this area is mid-migration `[verify signed-in]`.

**Fix:** match both generations:
`ytd-comment-view-model #content-text, ytd-comment-thread-renderer #content-text` and
`ytd-comment-view-model:has(ytd-author-comment-badge-renderer)`.

### H5. `hfr-allow` rewrites YouTube's visitor cookie for no benefit
`yt-zen.user.js:13470–13484`
```js
const n = Math.random().toString(36).slice(2, 14) + "QfX";
... manager.set("VISITOR_INFO1_LIVE", n, { domain: ".youtube.com", ... })
```
This runs on **every apply** (so on every config change) and randomises YouTube's anonymous
visitor identifier each time. High-frame-rate formats are a property of the video's formats/player,
not of that cookie, so the feature cannot work — it only churns a persistent identity cookie and
promises "reload to see 60fps options".

**Fix:** remove the cookie write (and the reload prompt) or replace the feature with something
real (e.g. surfacing `player.getAvailableQualityLevels()` HFR entries). If you keep it, never
overwrite an existing non-empty visitor ID.

### H6. Two features never activate unless you happen to start on their page
`yt-zen.user.js:31340`, `31530`
```js
// feed-freshness
if (!S.feedFreshnessOn || location.pathname !== "/") return;      // 31340
// history-local-hide
if (!S.historyLocalHideOn || !location.pathname.startsWith("/feed/history")) return;  // 31530
```
`xa.applyAll()` only runs at boot, on bfcache restore, and from the watchdog — **not** on
`nav.changed` (features get `onNav` callbacks instead). Because these two early-return *inside
`apply()`*, their observer/interval/`onNav` are never registered when the script boots on any
other URL, and nothing re-applies them afterwards. The watchdog does not save them either: it only
re-applies when a *registered* style id is missing, and a never-applied feature registers no style.

**Fix:** register the plumbing unconditionally and gate only the scan body (like
`dup-title-spotter` 31420 / `playlist-watched-marker` 31459 do), or `ctx.onNav(() => xa.apply(id))`
when the path matches.

### H7. Config load can overwrite a change made in the first ~1.5 s
`yt-zen.user.js:32447–32517`, `1593–1632`
`_loadCfgBody()` finishes by calling `j(data)`, and `j()` does `S = Object.assign({}, s, a)`
(1618) — a full replace. The "late merge" safety net (32485–32517) only runs on the **timeout**
branch (`who === "timeout"`). If the async load completes *after* the user toggled something but
within 1.5 s, the change is silently reverted. The same timing weakens
`hide-shorts`/`hide-auto-dubbed`'s `ytInitialData` trap, which is installed at module scope
(27429) while `S` still holds defaults, so the first feed payload is never scrubbed.

**Fix:** re-read the snapshot at the end of `_loadCfgBody` and re-apply/keep any key the user
touched (`_snapBefore` already exists — use it on both branches), and install the
`ytInitialData` setter unconditionally with the filtering decision made inside the setter.

### H8. Seven visible dashboard controls do nothing — plus nine dead theme keys
These keys appear only in the defaults table, in a `keys: [...]` array and/or in a UI builder —
never in any consumer:

| Control | Key | Where it is "used" |
|---|---|---|
| Theme → "Accent color" slider | `themeAccentHue` | defaults 1180, keys 21633, slider 23123 |
| Theme → "Extras" checkbox (focus ring) | `themeFxFocusRing` | defaults 1174, keys 21627, checkbox 23137 |
| Theme → "Extras" checkbox (sidebar highlight) | `themeFxAccentGradient` | defaults 1178, keys 21631, checkbox 23142 |
| Playback Speed → "Hotkey step" | `speedStep` | defaults 934, keys 9231, row 9275 |
| Cookie Control → "Notify on changes" | `cookieControlNotify` | defaults 957, keys 14762, row 15007 |
| Storage Dashboard → "Show storage overview" | `storageDashboardOn` | `apply(ctx) { }` 31675 |
| Health Check → "Show health check" | `healthCheckOn` | `apply(ctx) { }` 31717 |
| 9 × `themeFxHoverLift`, `Ripple`, `GlassMasthead`, `ThemeTransition`, `ScrollDriven`, `Scrollbar`, `ButtonShine`, `SidebarStagger`, `CardLoadAnim` | — | defaults 1168–1177, keys 21621–21630 only |

The two `apply()`-less cards are by design "settings panels", but the toggle rendered above the
panel is decorative: the panel renders regardless of the value. Note the theme card's own note
("Just two little touches", 23149) describes two toggles that are not implemented.

**Fix:** implement or delete. For the theme FX, either wire them into `_zenThemeExtras()`/the
theme CSS or drop the keys and checkboxes; for `storageDashboardOn`/`healthCheckOn` remove the
checkbox (or gate the panel on it); for `speedStep` implement the hotkey.

### H9. `adaptive-throttle` can never fire
`yt-zen.user.js:14736`, `14751`, scheduler at 8745–8770
```js
if (!_hiddenSince || Date.now() - _hiddenSince < 60000) return;   // 14736
(e.addListener(document, "visibilitychange", t), e.addInterval(t, 3e4));   // 14751
```
`ctx.addInterval` defaults to `pauseWhenHidden: true` (8963) and the shared scheduler skips the
callback while the document is hidden (8754). The only other trigger is the `visibilitychange`
listener, which fires at the moment `_hiddenSince` is set — i.e. always < 60 s. So the
"low battery while hidden → pause" path is unreachable; the feature's advertised behaviour
(and the whole card) does nothing.

**Fix:** register with `{ pauseWhenHidden: false }` and re-check `document.hidden` inside, or arm
a one-shot `setTimeout(60_000)` on hide.

### H10. Force-Watched beacon rewriting is armed globally for 90 s and never disarmed
`yt-zen.user.js:8281–8303`
```js
pw.__fwCtl = { len: …, armed: true, until: Date.now() + 90000 };   // 8283
const armed = () => !!(c && c.armed && Date.now() < c.until);      // 8290
const rw = (u) => { … set("et", L); set("cmt", L); set("mt", L); set("st", Math.max(0, L - 1));
                    … set("state", "ended"); }                     // 8293–8301
```
`__fwCtl` is written exactly once and only ever read by `armed()`/`getLen()` — nothing sets
`armed: false`, and `rw()` never checks the video id or `cpn` against the campaign. So for 90 s
after any campaign (including one that failed, and after the feature is switched off), **every**
`/api/stats/watchtime` beacon — including the *next* video's — is rewritten with the previous
video's length and `state=ended`. That corrupts the following video's watch stats, which is
exactly the kind of signal the feature is trying to make plausible.

**Fix:** make `rw()` rewrite only beacons whose `cpn`/`docid` match the armed campaign, and
disarm `__fwCtl` in `_fwAdvanced`'s completion/failure path and when the feature is disabled.

### H11. SponsorBlock view reporting posts to an endpoint that does not exist
`yt-zen.user.js:6278` · `src/sponsorblock-engine-v2.js:1080`
```js
base + "/api/viewedSponsorSegment?UUID=" + encodeURIComponent(uuid)
```
The official client and server use **`/api/viewedVideoSponsorTime`**: `viewedSponsorSegment`
appears **0 times** in `ajayyy/SponsorBlock@master`, while `/api/viewedVideoSponsorTime` is one of
the three `/api/*` paths in its `content.ts`, and `SponsorBlockServer` ships a route file named
`viewedVideoSponsorTime.ts`. `requestAction` resolves `{ ok: false }` on HTTP errors and the call
site discards the result (`src:1583`), so **every skip silently fails to record a view** — no
error, no telemetry. Note `scripts/check-release.js:35` *pins* `"viewedSponsorSegment?UUID="` as a
required production guard, so the release gate currently enforces the wrong string.

**Fix:** use `/api/viewedVideoSponsorTime` (optionally add `&videoID=` like the official client),
update the pin in `check-release.js`, and log non-OK results.

### H12. Force-Watched's beacon-template capture is dead code, so beacons use hardcoded fields
`yt-zen.user.js:8035–8040`, `8143`, `8173–8178`
`_fwTplSet` is defined but **never called** (single occurrence in the file), so `_fwTpl` stays
`null` and every synthetic beacon falls back to the hardcoded `of=MS3lEPwEKa0vQUe3qbeAVA`,
`vm=CAEQARgB`, a random `cl` and a random `plid`. Those are precisely the fields the player
normally supplies, so the campaign's least reliable part is also the one with a dead capture
mechanism next to it.

**Fix:** call `_fwTplSet` from the interception hook (that is what it exists for) or delete
`_fwTpl`/`_fwTplSet` and document the constants as intentional.

### H13. `jt` concurrency guard is released before the campaign runs
`yt-zen.user.js:8393–8397`, `8650–8653`
```js
jt = !0;                                            // 8393
const _fwSafety = setTimeout(() => { if (jt) jt = !1; }, 12000);   // 8395
…
_fwAdvanced(a, n).then(() => { jt = !1; }, …);       // 8650
}
jt = !1;                                             // 8653 — runs synchronously
```
The guard is cleared immediately after `_fwAdvanced` is *scheduled*, so the
"Already marking this one as watched…" path (8367) only blocks a re-entrant call for the
duration of the synchronous body. Repeated Shift+W presses start concurrent campaigns, each
firing up to ~50 requests; the 12 s safety timer is also shorter than the campaign it guards.

**Fix:** reset `jt` only in the completion/error handler (delete the unconditional assignment at
8653) and lengthen the safety timer past the campaign's real duration.

### H14. Importing a settings file wipes every setting (data loss)
`yt-zen.user.js:26676` with `j()` at `1593–1632`
```js
(t.cfg && (S = Object.assign({}, s, j(D(t.cfg)))),   // 26676
…
pe("Settings loaded.", 1800, "success");             // 26698
```
`j(data)` applies the imported config **as a side effect** and has **no `return`** — its body ends
with `for (const e of E) delete S[e];` (1631) — so `j(...)` evaluates to `undefined` and the
assignment becomes `Object.assign({}, s, undefined)`, i.e. the factory defaults. The very next
statements call `Y()` (26693) and `xa.applyAll()`, so the wipe is persisted and applied, and the
user is told "Settings loaded." Importing your own export therefore destroys your configuration
(only history is restored, from the separate `t.history` branch). Every other `j()` call site
(`z()` 1843, `_loadCfgBody` 32473, cross-tab `X()` 1924) correctly uses it as a statement.

**Fix:** one line — `t.cfg && j(D(t.cfg)),` (drop the assignment), or make `j()` `return S;`.
Add a regression test that round-trips an export through `Xo`'s parse path and asserts the
imported keys survive.

### H15. Theme contrast: the accent color is never adapted, and inks are only checked against one surface
`yt-zen.user.js:21800–21821` (`_zenAdaptInk` calls), `22695–22697` (filled button rule)

`_zenAdaptInk` is applied to `text-primary`, `text-secondary`, `text-disabled` and
`icon-active-other` — all against **`base-background` only** (21814–21821). `call-to-action` is
emitted raw, and the filled-button rule hardcodes a white label:
```js
"{background-color:" + h + "!important;color:#fff!important;border:0!important;border-radius:18px!important}"
```
I re-computed WCAG ratios over the shipped 201-theme table (200 with vars):

| Check | Themes failing 4.5:1 | Worst |
|---|---|---|
| `call-to-action` as link text on `base-background` | **87 / 200** | `l-buttercream` 1.70, `d-burgundy` 1.73, `l-honey` 1.92 |
| White label on `call-to-action` fill | **154 / 200** | `d-material-deep-ocean` 1.18, `d-electric-lime` 1.21, `d-cyber` 1.25 |
| `text-secondary` on `menu-background` | **64 / 200** | `l-one-light` 2.47, `l-atom` 2.58 |
| `text-secondary` on `badge-chip-background` | **93 / 200** | `l-atom` / `l-one-light` 2.05, `l-tomorrow` 2.22 |
| `text-primary` on `base-background` / `raised-background` | 0 | — |

So the README's "Text and icon colors are contrast-checked on the fly, so nothing ever vanishes
into the background" holds for the primary/icon inks on the base surface (the adaptation does
work), but not for the accent color or for secondary text on the layered surfaces it is actually
painted on.

**Fix:** run `call-to-action` through `_zenAdaptInk` as well (target ≥ 4.5 against
`base-background`, and against `badge-chip-background` where it is used as text), and choose the
filled-button label by measured luminance (or use `call-to-action-inverse`) instead of `#fff`.
For `text-secondary`, either adapt per surface (`raised`/`menu`/`chip`) or constrain the theme
tables so layered backgrounds stay within a contrast-safe band of the base.

---

## 3. Medium severity

**M1 · `buffer-health` binds listeners to the helper object, not the video** — 13038–13040:
`e.addListener(ie, "waiting", a)`; `ie` is the `{el, api, levels, …}` helper (3795–3827) and
`addListener` bails when `addEventListener` is missing (8865). Rebuffer counting/reset never runs;
only the periodic overlay works. Use `ie.el()` (and re-bind on nav).

**M2 · `default-audio-track` can select a dubbed track** — 13209:
`r.find(t => /orig/i.test(t.id)) || r[0]` falls back to the *first* track. The sibling
implementation in `handlePlayerResponse` (≈27250) does check `audioIsOriginal`/`isDefault` —
reuse that, and consolidate with `hideAutoDubbedPreferOriginal` so the two features cannot fight.

**M3 · `video-filters` vs `flip-video` transform conflict** — video-filters injects
`transform: … !important` on `video.html5-main-video` (11193–11199); `flip-video` sets an inline
`transform` (13685), which always loses to `!important`. With both on, flip/mirror is a no-op.
Also `vfFlip` (11192) duplicates the whole flip feature. Compose both transforms in one rule.

**M4 · Triple-store config with a divergent fallback** — 1847–1870 writes the full config to
`GM_setValue` **and** `localStorage` (and IDB via 1898). On `QuotaExceededError` the localStorage
copy is written *without* `customCSS`, `channelBlockerList`, `keywordFilterList` — so the three
stores disagree, and `localStorage` silently becomes the source of a lossy config whenever its
`ver`/`ts` wins. Recommend one authoritative store (IDB) + a GM fallback, and drop the
whole-blob localStorage mirror.

**M5 · ~96 dead config keys, 3 invisible settings** — full inventory in the appendix.
Every dead key is serialised into the config blob on each save (write amplification, localStorage
quota pressure, and a bigger `ytp.cfg` for userscript sync). `updateCheckOn` / `updateCheckHours`
(1803, 1806) and `debugVerbose` are **read but absent from the defaults**, so they can never be
set: the update checker always runs at 24 h with no UI, and `debugVerbose` is permanently falsy.

**M6 · `ZenResources` is half-adopted and partly duplicated** — 6 of 18 exports are never used
(`Bus`, `WeakElementCache`, `Retry`, `SharedObserver`, `AbortGroup`, `ResourceScope`; plus
`Dom.el`, `Dom.when`, `Dom.onReady`) while the bundle ships its own equivalents: bus `g`,
selector cache `ca` (8806), shared observer `oa`/`ra` (8906–8932), interval scheduler `Jt`/`na`
(8716–8772), teardown registry `Yt` (8834), timeouts `$t`/`ea`. That is ~500 lines of dead code
plus two implementations of the same four primitives. Pick one (ZenResources is the better one)
and delete the other.

**M7 · Theme applies late, and contrast is checked against one surface only** —
`apply()` runs from `applyAll`, which waits for the app shell (32526–32584), so on a cold load the
default YouTube palette paints first; the dark/light signal is then re-sent at 60/200/600/1500/3500 ms
(21769–21771). The config is available synchronously (`GM_getValue` 1563, `z()` 1833), so a
document-start pass for `themeSelected` is feasible. Separately, `_zenAdaptInk` only compares
each ink against `base-background` (21800–21821) although text sits on `raised-background`,
`menu-background`, `general-background-a/b/c`, chips and dialogs — the README's "nothing ever
vanishes into the background" is stronger than the implementation.

**M8 · "Nothing phones home" is not accurate** — SponsorBlock is **on by default**
(`sponsorblockOn: !0`, 1000) and performs a lookup to `sponsor.ajay.app` for every video (hashed
prefix by default — good), and the in-script updater polls `github.com` (1645–1831). Both are
defensible; the README should say "no analytics/telemetry; SponsorBlock and update checks talk to
their own servers", and consider asking before the first SponsorBlock lookup.

**M9 · `audit-dashboard.cjs` cannot see what it claims to audit** — it slices the bundle at
`xa.register({` and reads the first 4 000 chars for `id:`/`name:`/`hidden:`. The 10 cards
registered through `Ha()` (10823–10835) have `id: e`, so the script mis-attributes ids from the
next card; it also cannot detect duplicate ids or `apply()`-less cards, and its "hidden:true"
note (audit-dashboard.cjs:35–39) describes a state that does not exist (no card sets `hidden`).
Replace it with a runtime audit (boot in jsdom and call `xa.list()`).

**M10 · Disabling "Remove Shorts Everywhere" leaves Shorts hidden until reload** —
`killShortsShells` sets inline `display:none` plus `data-zen-shorts-dead` (27541–27542); that
attribute is referenced exactly **once** in the whole file, so nothing restores the shelves on
disable/teardown. Clear the inline style and the attribute in `stopDom("shorts")`/the teardown.

**M11 · Toast click handlers accumulate** — `pe()` clears `onclick` (3902) but never removes
`addEventListener` handlers, and three features bind permanent click handlers to the shared
`#ytp-toast`: "open releases" (1725), "retry update check" (1744), "acknowledge risky features"
(32614). After the first update check the toast stays clickable for unrelated messages.

**M12 · `@match` covers Music and mobile, features do not** — `music.youtube.com` and
`m.youtube.com` are matched (lines 11–12) but only 11 references to `ytm-`/`ytmusic` exist and the
overwhelming majority of selectors are desktop `ytd-*`. Either scope the `@match` list to
`www.youtube.com` or implement Music/mobile deliberately (at minimum, skip features that cannot work).

**M13 · The in-script updater duplicates the native update path** — `@updateURL`/`@downloadURL`
already handle updates in every manager; `Fu()` adds a 60 s timer plus a 6-hourly interval
(32629–32657), its own semver parser, backoff and banner. It is also the only way to reach
"Check for updates now". Keep the menu command, drop the timers (or vice versa) — and register
`updateCheckOn`/`updateCheckHours` if you keep it.

**M14 · `shorts-auto-mute` behaves as "always muted"** — the mute routine is re-run 250 ms after
*any* DOM mutation on `/shorts/` (16083–16097 + `addObserver` on `document.body`), so unmuting
manually is undone by the next mutation (comments panel, overlay, reel swap). Mute only when the
active video element changes.

**M15 · `comment-search` and `comment-filter` fight over `display`** —
`comment-search` resets `display = ""` on every thread (23230–23232) while `comment-filter` hides
threads and only re-scans on mutations/nav (31509–31510), so clearing a search un-hides filtered
comments. Neither feature owns the visibility state; track it per feature and recompute.

**M16 · `channel-blocker`'s procedural path is too broad, and its title toggle is bypassed** —
plain names are compiled to `:has-text(/name/i)` (11436–11439) whose pattern is tested against the
whole card `textContent` (11048), so a blocked name can match a view count or description; and
`channelBlockerMatchTitleText` is only honoured by the legacy matcher (11330), which does not run
when `:has()` is supported. Test only the title element and honour the toggle in both paths.

**M17 · Feed filters miss the modern lockup markup** — `feed-freshness` reads only
`ytd-rich-item-renderer ytd-video-meta-block #metadata-line` (31352) and `channel-snooze` looks up
`ytd-channel-name a, #owner-name a, ytd-video-owner-renderer a` (31392); home-feed cards are now
`yt-lockup-view-model` with `yt-content-metadata-view-model` and no `ytd-channel-name`. Reuse the
lockup-aware helpers already in the file (`Cb_anchorInfo`, 11312) and add the lockup selectors.
(`keyword-filter`'s CSS fast path at 11654 has the same gap.)

**M18 · Popup heuristic gates every apply** — `_a()` (10803–10822) returns true if any
`tp-yt-iron-dropdown` has a non-`none` inline `display` or an `opened` attribute, and
`xa.apply()` defers **all** feature application while it is true (9091–9108), as does
`applyAll()` (9131–9137). A stale/visible dropdown would freeze every feature apply behind a
300 ms poll. Prefer checking `aria-hidden`/`offsetParent`, or make the gate per-feature.

**M19 · Watchdog loses its own bookkeeping** — `addStyle` tracks ids in `xa._styleIds` and
clears the whole set when it exceeds 400 (8849); the 20 s watchdog (32659–32701) then has nothing
to compare against and stops detecting missing styles. Prune the dead ids instead of clearing.

**M20 · `hide-shorts`/`hide-auto-dubbed` API install can be skipped forever** —
`ensureApi()` sets `apiInstalled = true` (27295) **before** checking
`typeof prevFetch === "function"` (27297), so in an environment where `fetch` is not yet a
function the interception is never installed and never retried.

**M21 · "Feed watched" dim/hide is unreachable for new users** — `feedWatchedMode` is the only
switch for the dim/hide behaviour, and unlike its two siblings it is neither a card `masterKey`
nor exposed by any settings row: `auto-pause` registers `masterKey: "autoPauseMode"` with
`Ro("Mode", …)` (15660–15682) and `highlight-video-length` does the same (15975–15992), but
`feedWatchedMode` appears only in the defaults (1143), the migration (1598–1603), the derived-key
mapper (9171–9173) and the consumer (15587, 15640–15645). A user can therefore only get it via a
legacy stored config (`feedHideWatchedOn: true` from an older build, migrated at 1599). The CSS
(`.ytp-extra-watched-dim/-hide`, 26288) and the consumer are in place — only the control is missing.

**Fix:** add a `feedWatchedMode` row mirroring `auto-pause`'s mode selector (values
`off`/`dim`/`hide`), or add `masterKey: "feedWatchedMode"` to a card and register the key.

### Force-Watched

**M22 · A missing beacon track throws after the seek** — `buildTrack` (8534–8540) can produce
`undefined` URLs, and `dur` (8566–8567) can still come from the `<video>` element or
`durFallback`, so `_fwArm(DU)` and the seek-to-end (8575–8585) run before the beacon salvo
dereferences `track.playbackUrl` and throws. The rejection is swallowed by the `.then(…, er => h(…))`
handler (8650), so the video jumps to the end with the rewrite hooks armed and no beacons fired.
Null-check `track`/`track.watchtimeUrl` before arming and seeking.

**M23 · History verification retries the whole salvo on transport failure** — `_fwHistoryHas`
returns `false` when the browse response is missing (8526), which is indistinguishable from "not
in history yet", so the campaign re-fires the full salvo (8632–8635, up to 4 attempts with 3/6/9 s
sleeps). Only a missing SAPI hash returns `null` and stops. Return `null` for transport failures.

**M24 · The Force-Watched master toggle alone does nothing** — `Kt()` only acts inside
`if (!1 !== S.forceWatchedLocalHistory)` (8401) and `if (!1 !== S.forceWatchedAccountHistory)`
(8648); with both companions off (the shipped defaults, 1051–1052) it just sets and clears `jt`.
The card summary promises "Instantly completes the video … (Shift+W)". Toast a hint when neither
companion is enabled, or perform the local completion in the master path.

**M25 · The "risky features" acknowledgement is cosmetic** — `_riskyAcked` (32588–32595) is read
once at startup only to decide whether to show a toast. Nothing in `_fwAdvanced`/`Ut`/the signal
injector checks it and there is no `cfg.changed` listener, so enabling `forceWatchedAccountHistory`
or `algoIntelligenceOn` mid-session produces no prompt and the features run regardless. README:68–71
("off by default and ask for an explicit acknowledgement") is therefore only half true. Gate the
signal-emitting paths on `_riskyAcked`, or re-show the prompt and require the click before arming.

### SponsorBlock

**M26 · The editor's "Delete" can never work** — `src/sponsorblock-engine-v2.js:1344–1348` issues
`DELETE /api/skipSegments/:UUID?userID=…`; the official client contains **no** `DELETE` requests
(0 matches in `content.ts`) and the endpoint is not part of the protocol, so the button always
fails and then reports the misleading "Delete failed: owner or VIP only" (2046–2048). Remove the
Delete UI or surface the real HTTP status.

**M27 · Timeouts are indistinguishable from navigation aborts** — the request timeout aborts the
same controller whose signal is passed downstream (780), and `fetchWithRetry` rethrows on
`AbortError` (909), so a stalled request is treated as "user navigated away": no retry and no
`Metrics.recordApiError()`. (Note `status === 0` is *intentionally* fatal at 911, so the practical
loss is the retry/telemetry for genuine stalls.) Tag timeout aborts separately.

**M28 · Persisted SponsorBlock cache rows are never pruned** — the cache writes
`expiresAt` (`src:491`) while the global trimmer deletes rows where `row.v.expires <= now`
(`yt-zen.user.js:735`), so `cache:sb:*` entries never match and are only removed when the same
video is looked up again. IndexedDB grows with every video+config pair. Accept either field name
(or add a `cache:sb:` count cap).

**M29 · Per-category seekbar visibility doesn't take effect until the next video** —
`sb_<cat>_sb` is rendered in settings (`yt-zen.user.js:10324`) but is missing from the feature's
`keys` (10238) *and* from `getRenderKey()` (`src:328–335`, which only folds in `_en`/`_act`), so
toggling it neither re-applies the feature nor invalidates the mark cache.

**M30 · `onlySkipIfVip` behaves backwards while VIP status is unknown** — the skip test is
`State.vipByUserID.get(userID) === false` (`src:1558`), so uploaders whose status has not resolved
yet (lookups are fired asynchronously in `resolveVipForSegments`, 2248–2258) are skipped anyway,
and a *failed* lookup is recorded as "not VIP" (2257) → skipped. Treat unknown as "don't skip"
until resolution completes.

**M31 · A fail-closed privacy lookup is cached as a real answer** — when privacy mode is on and
`crypto.subtle` is unavailable, `fetchSegments` records `privacy-unavailable` and returns `[]`
(`src:848–851`); `fetchAndCache` then persists it (`src:2287–2291`) as a 24 h "no segments" result,
so the video stays un-skipped even after a secure context becomes available. Return a sentinel and
skip `Cache.set` for that path.

**M32 · `Retry-After` is ignored under Tampermonkey** — the `GM_xmlhttpRequest` shim resolves
`{ ok, status, text, json }` with no `headers` (3966–3974), while the rate-limit code reads
`responseOrMs.headers?.get("Retry-After")` (`src:568`), so every 429 falls back to the 60 s default
backoff. Add a `headers.get` shim built from `response.responseHeaders`.

**M33 · VIP lookups are an unbounded burst** — `resolveVipForSegments` fires one request per unique
uploader in parallel with no cap (`src:2254–2258`); a video with many distinct uploaders hits
`sponsor.ajay.app` with a simultaneous burst. Cap concurrency (2–3 in flight).

**M34 · Discover's UI note overstates what it does** — the note says "every pick is filtered
against your watch history and never repeats a video you have already seen"
(`src/zen-engine-v3.js:1938–1939`), but `isWatched` short-circuits to `false` unless
`sessionRestoreOn` is on (`src:1806`), and `sessionRestoreOn` defaults to off (`yt-zen.user.js:1006`).
Correct the copy or read the history store directly when Discover is enabled.

**M35 · Discover issues up to four uncached searches per load and re-runs them on every nav** —
one `load()` iterates `DISCOVER_SEARCH_SP` with no cache and no `AlgoEngine.RateLimiter`
(`src:1829–1833`), and `host.refresh("discover")` re-runs it on every `nav.changed` (1929), so
rapid topic clicks stack uncancelled requests. Cache per `(query, sp)` with a short TTL and dedupe
via `ZenEngine.dedup`.

**M36 · Force-Watched hard-requires `GM_xmlhttpRequest`** — 8532 bails with a toast when it is
missing, while SponsorBlock degrades to `fetch` (`he()`); in managers that do not expose
`GM_xmlhttpRequest` the whole feature is dead. Give `_fwInnerTube` a same-origin `fetch` fallback.

### Dashboard, storage and data layer

**M37 · The caption font picker writes the wrong key** — in `Yp_fontRow(label, key)` the inner
builder shadows both names (`c(e, t)` where `e` is the font family and `t` is the display label),
and the click handler does `Ta(t, a.dataset.value)` (25860), so picking "Roboto" writes
`S["Roboto"] = "Roboto, Arial, sans-serif"` instead of `S.ccFontFamily` (the real key is already
available as `dataset.key`, set at 25833 and never read). The picker never changes the caption
font and pollutes the stored config with junk keys. Capture the outer key in a `const` and use it.

**M38 · `ZenEngine` stores never confirm their writes** — the `StateStore` adapter is
`set: async (storeKey, value) => { k("kv", {…}); }` (`src/zen-engine-v3.js:149–151`, bundle
27911–27913) with **no `return`**, so `StateStore.flush()` awaits `undefined`, immediately clears
`_dirty` and can never retry or report a failure. These stores back bookmarks, notes, collections,
budget and resume points, and unlike the main config they have no `pagehide`/`visibilitychange`
flush (only `G()` for `ytp.cfg`, 32387–32414), so anything written inside the 4 s debounce window
is lost on tab close. Return the IDB promise and flush registered stores from the existing
unload hooks.

**M39 · Turning off the overlay hub orphans the widgets it adopted** — `adopt()` moves
`#ytp-fps-box`, `#ytp-buf-box`, `#ytp-drop-box`, `#ytp-stats` and `#ytp-diag` into the hub
container, and the teardown removes the container with them (30463–30464) while the owning
features keep their element references and only update styles/text (e.g. `fps-counter` at
12844–12845). All meters stay invisible until each feature is toggled off and on again. Move the
adopted widgets back to `document.body` on teardown, or re-apply the monitor features.

**M40 · "Playlist Watch-Marks" silently does nothing by default** — its scan reads the local
history store (`v("history", id)`, 31470), but that store is only written while Session History is
enabled (`sessionRestoreOn`, off by default; the writers return early without it). The card is
visible, its `keys` do not include `sessionRestoreOn`, and it never re-scans when history is
enabled later. Gate/annotate the feature on `sessionRestoreOn` or decouple a lightweight
watched-ID index from the resume feature.

**M41 · The dashboard advertises "Close (Esc)" but implements no Escape handler** — the title
says `"Close (Esc)"` (26337) and the code carries `window.__ytpDashEsc` removal hooks (4814, 4844),
but nothing ever *assigns* that handler and `Uo`/`Ko` install no `keydown` listener, so Esc does
nothing and focus never enters the `role="dialog"` panel. Add the handler (and focus the search
field on open) or drop the hint and the dead plumbing.

**M42 · "Trim old caches now" revokes live thumbnail URLs** — the button calls
`TrackedBlobURL.revokeOlderThan(30000)` (31703) while background maintenance uses 30 minutes
(779), and `TrackedBlobURL.touch()` is never called anywhere, so `lastTouchedAt === createdAt`.
Clicking it revokes blob URLs that the in-memory `Ve` thumbnail cache still hands to history
cards (`Vo`, 26157–26162), leaving broken images. Use the 30-minute threshold and call `touch()`
on cache hits (or evict revoked URLs from `Ve`).

---

## 4. Low severity / polish

- **L1** `ZenEngine.scheduleOnReady` (27979–27987) passes `ms = 0` down the retry chain, so all
  attempts fire in a tight burst instead of spaced by `delayMs`; its timers are also not
  registered with `ctx`, so they can outlive a teardown and re-mount buttons after disabling.
- **L2** `theater-default` (10706) flips theater 1.5 s after apply/nav with no retry — every video
  visibly starts in default layout and can stay unflipped on slow loads.
- **L3** `chapter-auto-skip` (30895) reads only `markersMap[0]`; the shared extractor used by the
  chapter buttons iterates every map (21589). Videos with multiple maps are never auto-skipped.
- **L4** `stats-overlay` promises "FPS, bitrate, resolution, buffer, and speed" (12744) but renders
  only time/rate/buffer (12759–12765).
- **L5** `background-players-pause` (13534) duplicates `auto-pause`'s hidden-tab behaviour without
  setting the `autoPaused` marker, so `auto-resume-autopaused` will not resume what it paused.
- **L6** Per-channel features key off different identifiers: `speed-per-channel` uses `Ne()`
  (9306), `channel-volume` uses `ie.channel()` (31867) — same channel, two memories; a rename
  breaks one and not the other.
- **L7** Dead locals/exports: `zen-breather`'s `phase` (32019), `UBlockEngine.unhideAll`
  (exported, never called — channel-blocker duplicates the loop), `generateCSS`'s unused
  `activePath` parameter.
- **L8** `chapter-hotkeys` (15893), `force-watched` (10663) and `screenshot` (global handler at
  32306–32345) implement their logic outside their own card, while every other feature uses
  `apply()`. It works, but it is the kind of inconsistency that makes regressions hard to localise.
- **L9** SponsorBlock's card declares only 6 of the ~40 SB keys in `keys:` (10231–10238), so
  toggling the parity options (10330–10334) does not re-apply the feature. Harmless today because
  the engine reads them live, but fragile.
- **L10** `_zenNavSignal` polls `location.href` every 500 ms (2091–2099) on top of patched
  `pushState`, `yt-navigate-*`, `popstate` and a 3 s fallback timer — effective, but the poll is a
  permanent timer; a `MutationObserver` on `<title>` or `navigation` API would be cheaper.
- **L11** Docs drift: README says "200 hand-tuned themes" (`check.js` counts 201), "120+ controls"
  (349 keys), and the `hidden:true` note in `audit-dashboard.cjs` describes cards that no longer exist.
- **L12** `Ha()`-registered CSS features (`hide-comments`, `hide-masthead`, …) are declared as
  cards with `settings() {}` — they are fine, but note they are the *only* features that could be
  applied at document-start with zero risk (see the roadmap).
- **L13** Dead function: `Cc_apply` (9709) contains the toggle-subtitles fallback logic but is
  never called — only `Cc_state()` is used (9711, 10062).
- **L14** The Discover "my niche" genome is never written: `ZenSession.genome.record` and
  `recordSubscribers` (28427, 28439) have no call sites, so `getTopTopics(12)` is always empty and
  the niche mode permanently falls back to `DISCOVER_DEFAULT_NICHE` (`src/zen-engine-v3.js:29546–29552`).
  Call `record()` from the watch/session pipeline or drop the niche mode.
- **L15** Unbounded user data with no pruning: curated collections and their videos
  (`src/zen-engine-v3.js:720–721`), and one `kv` row per video/channel for notes (15570). The UI
  has create/add but no delete/rename, so these grow forever. Cap them or prune by age.
- **L16** `watch-budget` ticks its store every second while playing (30655–30662), and
  `StateStore` flushes every ~4 s — about 900 full `__zen_budget__` writes per hour for one counter.
  Accumulate in memory and persist on pause/nav or every 60 s.

---

## 5. Bloat and dead-code inventory

**5.1 Stale selector tokens (dead weight; verified against live YouTube JS + HTML).**
Notable ones, with the script line of first use:

```
ytd-comment-renderer            11399 (12 refs)  → ytd-comment-view-model / ytd-comment-thread-renderer
yt-core-attributed-string       11309            → yt-attributed-string (114 hits live)
ytd-reel-item-renderer          11296 (7 refs)   → removed; shortsLockupViewModel / yt-lockup-view-model
ytd-simple-menu-button-renderer 21853, 22007     → gone
ytd-masthead-container          11275            → gone (ytd-masthead + #masthead-container cover it)
ytd-notification-topbar-renderer 21490           → ytd-notification-topbar-button-renderer
ytd-multi-page-menu-section-renderer 22234       → yt-multi-page-menu-section-renderer
ytd-shelf-header-layout         23602            → yt-shelf-header-layout
ytd-page-header-renderer        23701            → yt-page-header-view-model / yt-page-header-renderer
ytd-cinematic-container-renderer 30200           → gone (only a CSS var remains)
ytd-sponsor-button-renderer     23802            → gone (yt-button-shape)
ytd-sort-filter-sub-menu-renderer 24349          → yt-sort-filter-sub-menu-renderer
ytd-searchbox-suggestions-renderer 23340         → yt-searchbox-suggestions-container
ytd-results-count-renderer      24740            → gone
ytd-tab-renderer                27443            → gone
ytd-shorts-video-renderer / ytd-shorts-lockup-view-model 27436-27437 → gone
ytd-channel-thumbnail / ytd-channel-avatar-editor 22608-22615 → gone
ytd-thumbnail-overlay-resume-playback-renderer 23649 → ytw-thumbnail-overlay-resume-playback-renderer
ytd-ai-summary-renderer / yt-ai-summary / conversation-ai 23275-23278 → not present at all [verify A/B]
rendered-from-rich-grid         15952            → replaced by .ytdRichItemRendererIsResponsiveGrid
.yt-core-attributed-string / .yt-lockup-metadata-view-model__title / .ytLockupViewModelHostTitle
                                11308-11309, 29391 → .yt-attributed-string / ytLockupMetadataViewModelTitle
```
Also ~50 `yt-spec-*`/`yt-lightsource-*` tokens flagged as absent are **CSS design tokens**, not
elements — they are fine.

**5.2 Dead config keys (~90 with no consumer; produced by the keys audit).**
Legacy v1 / abandoned-feature keys: `wideTheater`, `customCSSOn`, `customCSS`, `watchLaterQuick`,
`subscribeShortcut`, `adMute`, `adSpeed`, `skipIntroOn`, `skipIntroSec`, `smartQualityOn`,
`smartQualityWifi`, `smartQualityCell`, `videoStatsOn`, `videoStatsPos`, `blockNumberSeekOn`,
`blurThumbnailsAmount`, `openSettingsOnHoverOn`, `pipOn`, `frameStep`, `geoAutoReload`,
`sessionSummaryOn`, `sessionSummaryThreshold`, `netMonitor`, `remoteSelectorsOn`,
`remoteSelectorsURL`, `remoteSelectorsSHA`, `autoDismissPauseOn`, `localClockBadgeOn`,
`sbSubmitOn`, `sbSubmitUserId`, `rabbitHoleOn`, `rabbitHoleDepth`, `smartSpeedOn`,
`smartSpeedBase`, `smartSpeedFast`, `smartSpeedSilence`, `smartSpeedRamp`, `dearrowOn`,
`rydVotesOn`, `searchRemixOn`, `watchGenomeOn`, `timeBudgetOn`, `timeBudgetMinutes`,
`telemetryOptIn`, `hotkeyOptIn`, `longTaskWarnerOn`, `longTaskWarnerThreshold`,
`geoSafeSearch`, `geoRestrictMode`, plus the 12 theme keys from H8 (11 `themeFx*` +
`themeAccentHue`).
Reads without a defaults entry: `updateCheckOn`, `updateCheckHours`, `debugVerbose`.
Deliberately kept internal state (not dead): `dashX/Y/W/H`, `perfLevelSyncedFor`,
`netBudgetAlerted`, `netBudgetOn`, `netBudgetGB`, `netQualityAttribOn`, `sbUserId`, `sbIncognito`,
`sbOnlySkipIfVip`, `sbSkipCountdown`, `sbSkipCountdownTime`, `sbBetterBeAware`, and the
`aio*OnEnrolled` markers.
The `hide-*` / `compact-ui` / `always-progress-bar` keys are **not** dead — they are consumed by
the `Ha()` CSS-only registrar (11153–11283, 15257).

**5.3 Legacy naming (interop risk).** `__YTPLUS_LOADED__` (line 40–41) is the fork's original
guard: if any other script (or an older YT+ install) sets it, **YT-zen silently does nothing**.
Also `ytplus=on|off`, `ytplus_killed`, `ytplus_kill`, `ytp.killed`, `ytplus_cfg_sync`,
`__PRISM_READY__`/`prism:ready`, `__YTPLUS_ENGINE__`, `YtpCache`. Rename to `__YTZEN_*`/`ytzen_*`
and keep a read-only legacy check if you care about migrating existing kill-switch state.

**5.4 Duplicated implementations** (pick one, delete the other):
`redirect-shorts` (15272) vs `hide-shorts`' `shortsRedirect` (27644, has the loop guard);
`flip-video` vs `video-filters`' `vfFlip`; `default-audio-track` vs `hide-auto-dubbed`'s
prefer-original; `background-players-pause` vs `auto-pause`; `number-search-results` vs
`dense-video-grid` numbering; `hide-recs`/`hide-comments`/… cards vs `elements-control`'s list;
ZenResources' primitives vs the bundle's own (M6).

**5.5 Dead helpers (verified 0 call sites).**
`At, Et, Bt, Pt, It, Rt, Nt` (7937–8033, seven InnerTube wrappers), `Vt` (8227), `_fwTplSet`
(8036, which is why H12 exists), `Cc_apply` (9709), `ZenSession.genome.record` /
`recordSubscribers` (28427, 28439), `TrackedBlobURL.touch` (`src/zen-resources.js`),
`ZenEngine.fetchJson` / `ZenEngine.dedup` / `ZenEngine.whenIdle` (exported, never called),
`ZenSearch.REMIX_TEMPLATES`, `ZenSearch.vibeToParams`, `Settings.getActionTypes`,
`UBlockEngine.unhideAll`, and the duplicate `segmentEndFor`/`segmentEndOf` pair
(`src/sponsorblock-engine-v2.js:1386`/`1388`).
Note `ZenDiscovery.scoreVideo`/`setStatus` are also unused but **pinned** by
`scripts/check.js:68` (it asserts the export line exists), so the check script currently enforces
keeping two dead exports.

**5.6 Architecture.** `yt-zen.user.js` is both the artifact and the source of truth for 23.4k
lines of hand-minified code; `scripts/build-userscript.js` splices four `src/` files into it.
So "the published userscript must be byte-identical to a rebuild from source" is true only for
those four regions — the rest has no source, no readable diff, and no way to review a change
except by reading minified code. This is the single biggest long-term risk in the repo.

---

## 6. Recommended roadmap

**P0 — correctness (small, independent patches, ~1.5 days)**
1. H14: the one-line settings-import fix (this one destroys user data today — do it first).
2. H1 quality ranking fix.
3. H2: replace the six `__ytp*` bind flags with per-apply `WeakSet`s; add a CI grep/test that
   fails on `.__ytp` assignments inside `apply()` bodies.
4. H3: drop the `ratechange` re-assertion; decide `speedStep` (implement or delete).
5. H4: add `ytd-comment-view-model` to the three comment features.
6. H5: remove the `VISITOR_INFO1_LIVE` write.
7. H6: move the URL gate out of `apply()` for `feed-freshness` and `history-local-hide`.
8. H7: keep user-touched keys when the async config load lands; install the `ytInitialData`
   trap unconditionally.
9. H8/H9: delete or implement the 7 visible dead controls (and the 9 dead theme keys); fix
   `adaptive-throttle`'s scheduler option.
10. H10–H13: scope + disarm the Force-Watched beacon rewrite; fix the SponsorBlock view endpoint
    (and its pin in `check-release.js`); wire or delete `_fwTplSet`; fix the `jt` guard.
    Also M22/M23/M26/M28 (missing-track guard, history-verify retry, Delete UI, cache field name) —
    each is a two-line change.
11. H15: adapt `call-to-action` and pick the button label by luminance; adapt `text-secondary`
    per surface (or tighten the theme tables).
12. M37/M38/M41 (font-picker key, store flush promise, Esc handler) — all small, all user-visible.

**P1 — make "every feature works" verifiable (~2–3 days)**
13. **Per-feature integration harness**: extend `scripts/harness-boot.js` into a matrix that boots
    jsdom once per feature with that feature enabled (and one "everything on" run), asserting
    (a) no thrown errors, (b) no quarantines, (c) a per-feature DOM/style marker exists, and
    (d) a snapshot of registered cards. This is the only way to catch H2/H6/H8-class bugs
    automatically.
14. **Settings-integrity audit** in CI: fail when a registered key is never consumed, a consumed
    key is not in the defaults, or a `keys:` entry is missing from the UI. (I have a working
    script for this; happy to add it as `scripts/audit-keys.cjs`.)
15. **Selector-freshness job**: a weekly workflow that fetches YouTube's current JS bundle and
    fails/opens an issue for the script's YouTube-specific tokens that disappeared (the audit I
    ran for §5.1 does exactly this).
16. Replace `audit-dashboard.cjs` with the runtime card audit (M9); add an export/import
    round-trip test (H14).

**P2 — structure and consistency (~1 week)**
17. Extract the remaining bundle regions into `src/` mirrors (nav, config, registry, theme, feed,
    player, cards) so the build is a real build; keep the anchor mechanism, add a `// region:`
    header convention and a prettier pass. Do it region by region — each move is mechanical and
    the deterministic gate protects you.
18. Adopt `ZenResources` fully or delete the unused half; single storage backend (M4).
19. Consolidate the duplicated features (5.4) and prune the dead keys/selectors (5.1/5.2/5.5).
20. Rename the legacy `ytplus`/`prism`/`YTPLUS` surface (5.3) and correct the README claims
    (M8, L11).

---

## 7. What is already good (keep it)

- The **boot pipeline**: shell-ready wait with an 8 s cap, chunked `applyAll` (3–6 per frame with
  yields), per-feature quarantine after 3 failures with user toast and a menu command to clear it,
  bfcache re-arm, and a 20 s watchdog. That is more robust than most userscripts.
- The **per-feature resource scope** (`ua()`, 8833–9025): teardown-on-reapply, auto-passive
  listeners for scroll/wheel/touch, shared mutation observer with rAF batching, adaptive
  interval scheduler with backoff and visibility pausing.
- The **nav system** (`_zenNavSignal` 2003–2099): patched `pushState`/`replaceState`, all three
  `yt-navigate-*` events, `popstate`, a 3 s fallback commit and a 500 ms poll — it is hard to fool.
- **Config integrity**: type coercion + migration on load (`D()` 1528, `j()` 1593), forbidden-key
  guard (9191), version/timestamp conflict resolution across stores (`F()` 1584), cross-tab sync
  via `BroadcastChannel` + storage events with self-echo suppression.
- **SponsorBlock privacy path**: SHA-256 prefix only, fail-closed when `crypto.subtle` is missing
  (5800–5802, 5848), UUID-only view reports, bounded caches (5752–5753).
- **Theme contract**: complete var coverage enforced by `check.js` (201 themes × 17 required vars),
  WCAG-correct luminance math (21793–21797), ink adaptation with sane targets (7 / 4.6 / 3).
- **CI/release**: pinned action SHAs, deterministic gate on 2 Node versions, live SponsorBlock
  smoke test, tag↔version check, weekly channel-drift audit that opens/closes an issue.
- The **build is byte-stable** and the published artifact matches a rebuild.

---

## 8. Appendix — reproduce the audits

Three throwaway analyses produced §5.1, §5.2 and H8; they are each ~60 lines of Node and I can
land them as `scripts/audit-keys.cjs` and `scripts/audit-selectors.cjs` plus a jsdom feature-matrix
harness (`scripts/harness-features.js`) if you want them in the repo:

1. **keys**: parse the defaults object by brace matching from `s = Object.assign({` (913), parse
   every `xa.register({…})` block by line scan for `id`/`masterKey`/`keys`, then count occurrences
   of each key outside the defaults block and outside `masterKey:`/`keys:`/UI-builder lines.
2. **selectors**: extract `yt[a-z]*-[a-z0-9-]+` element tokens, `#id` and `.class` tokens, then
   test each against `https://www.youtube.com/` HTML + the `ytmainappweb` JS bundle (skipping
   `ytp-zen*`/`ytp-extra*`-style self-defined names).
3. **live player**: `player.getAvailableQualityLevels()` in Chromium confirmed the descending
   order used in H1.

## 9. Fixes delivered (v1.1.7 → v1.1.8)

Everything in §2 and §3 was implemented, tested and released, except the items
listed as *remaining* below. Each batch ran the full deterministic gate
(`npm test`), was committed, and CI/Quality/Build workflows are green on the
resulting commits.

| Batch | Commit | Scope |
|---|---|---|
| 1 | `8c892e3` | H14 settings-import data loss, H1 quality ranking, H2 bind flags (6 features), H3 speed, H4 comment markup, H5 HFR cookie, H6 URL gates, H9 throttle, H13 guard, M1/M20/M22/M23/M24/M37/M42 |
| 2a | `1a77ba5` | H15 theme contrast (verified 0 failures across all 200 themes), H8 theme dead keys, M7 early theme paint |
| 2b | `8e39417` | H11 SponsorBlock view endpoint, M26–M33 (timeouts, cache field, seekbar keys, VIP, privacy caching, GM headers, delete UI) |
| 2c | `8525924` | H10 beacon rewrite scoping + disarm, H12 template capture, M25 acknowledgement gate, M36 fetch fallback |
| 3 | `ea2118e` | M2/M3/M4/M10/M11/M14/M15/M18/M19/M21/M38/M39/M40/M41, L2–L7/L13/L14/L16 |
| 4 | `836bd8f` | M9 runtime card audit (135 cards), M13 update-check card, M5 dead-key cleanup (46 keys), M8/M12/L11 docs, M34/M35 Discover |
| 5 | `c4f6555` | H7 boot-time settings merge + early `ytInitialData` trap |
| 6 | `55ad809` | M16 scoped procedural text, M17 keyword lockup path, M35 Discover throttle, L4 FPS/bitrate (+ parser test), H8 panel gating, `audit-keys`/`audit-selectors`, splice-anchor check, `docs/ARCHITECTURE.md` |

Releases: **v1.1.7**, **v1.1.8** and **v1.1.9** (all published with
`yt-zen.user.js` + `yt-zen.meta.js`; the release workflow re-verifies that the
bundle matches the sources and runs the live SponsorBlock smoke test before
publishing). The published v1.1.9 artifact was compared byte-for-byte against
the locally tested build: identical SHA-256
(`493652E7…2D2E7B97`).

New regression guards added:

- `scripts/test-audit-fixes-6.js` — pins for every batch (data loss, quality
  ranking, bind flags, comment markup, HFR cookie, URL gates, beacon scoping,
  the acknowledgement gate, SponsorBlock endpoint/retries/privacy/VIP, theme
  contrast, config race, the batch-3 feature fixes, scoped channel-blocker
  text, keyword lockup path, Discover throttle, panel gating) plus a unit test
  that evaluates the shipped video-stats parser against real-shaped payloads.
- `scripts/test-import-roundtrip.js` — boots the bundle in jsdom, drives the real
  "Import settings from file" menu command and asserts the imported value is
  applied *and persisted*. This test fails on the pre-fix bundle.
- `scripts/audit-dashboard.cjs` — now a runtime audit over the live registry
  (fails on duplicate ids, missing names, missing `apply()`); it also revealed
  that the old text-based count (123 cards) was wrong: there are 135.
- `scripts/audit-keys.cjs` — settings integrity (dead defaults, invisible
  settings, dead controls). Clean today; `--strict` for CI.
- `scripts/audit-selectors.cjs` — bit-rot audit against live YouTube
  HTML/JS/CSS (507 tokens checked, 103 absent today — the §5.1 list).
- `scripts/check.js` — now also verifies the four build splice anchors, so a
  renamed anchor cannot silently stop a `src/` mirror from being regenerated.
- `docs/ARCHITECTURE.md` — region map, apply/teardown contract, audit commands,
  release procedure.

### Deliberately not changed

- **M6 (`ZenResources` unused exports).** Deleting `Bus`, `Retry`, `AbortGroup`,
  `ResourceScope`, `WeakElementCache` and the unused `Dom` helpers would also
  delete their unit tests (`test-zen.js`, `test-unit.js` cover them) and the
  primitives are the intended shared layer for future work. Kept, not adopted
  wholesale — the duplication noted in M6 remains a P2 cleanup item.
- **M12 (`@match` for Music/mobile).** Removing support is a product decision;
  the limitation is now documented in the README instead of silently no-op'ing.
- **L8 (features whose logic lives outside their card).** Consistency-only;
  the central hotkey handler is intentional.
- **L10 (500 ms navigation poll).** Navigation detection is load-bearing and the
  poll is a cheap timer; not worth the regression risk for a micro-optimisation.
- **M5 leftovers.** `longTaskWarnerOn/Threshold` and `videoStatsOn` remain because
  the public `__YTPLUS_ENGINE__` API exposes setters for them; they are still
  consumed by nothing.

### Remaining work (not fixed here)

- **§5 cleanup** (dead selector tokens, duplicated features, extracting the
  remaining ~23k minified lines into `src/` mirrors) — structural work, not
  defects. `npm run audit:selectors` lists the stale tokens to work through, and
  `docs/ARCHITECTURE.md` documents the region map and the extraction procedure.
- **L15 (partial)** — collection caps are in place and the store exposes
  delete/removeVideo, but the card UI still has no delete/rename affordance.
- **L10** — the 500 ms navigation poll is intentional; see *Deliberately not
  changed* above.

Everything else in §2/§3/§4 is fixed, tested and released.
