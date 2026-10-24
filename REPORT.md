# YourTube — Full Audit, Pentest & Refactor Report

# v1.8.0 — Dashboard dark mode alongside the Calm light theme

## A. What the user sees

A **☾/☀ toggle** now lives in the dashboard header (next to dock/close). It switches the
dashboard between the Calm light paper palette introduced in v1.5.0 and a new dark palette
that preserves the Calm design language — Georgia serif title, dotted hairline buttons,
amber accent lineage — instead of a generic black inversion:

| token family | light (Calm, default) | dark |
|---|---|---|
| shell `--panel` | `#faf7f0` | `#17181c` |
| card stack `--card/-hi/-lo` | `#fffdf8 / #f5f1e8 / #efece7` | `#212428 / #2a2d34 / #30343c` |
| ink `--ink/-ink2/-ink3` | `#1c1917 / #57534e / #a8a29e` | `#e8e6e3 / #b3aaa0 / #7a7268` |
| accent `--acc`, tint family | `#b45309` on warm paper | `#f59e0b` with `.12` dim |
| status `--ok/--crit` | `#4a7d5d / #b91c1c` | `#4ade80 / #f87171` |
| shadows `--shadowink/--critink` | warm `28,25,23`-based | `0,0,0` neutral |

`color-scheme:dark` is set in dark mode so native form controls (checkboxes, scrollbars,
select popups) follow. The choice persists via config key `dashMode: "light" | "dark"`
(default `light` — v1.5.x behavior unchanged), syncs across tabs through the existing
(`__ver`,`__ts`) union-merge machine like every other key, and can also be flipped live
with `window.YourTube.setCfg('dashMode', 'dark')`.

## B. How it works (engineering)

The v1.5.0 Calm block (~470 rules in `src/75-dashboard.js`'s style payload) hardcoded its
light hexes inside `.ytb-dash .ytb-*` selectors — the pre-Calm dark base declaration
(`--panel:#0d0f14…`) was unconditionally overridden. Retrofitting:

1. Every hardcoded Calm-literal in the block was mechanically rewritten to a CSS variable
   (`--card`, `--card-hi`, `--card-lo`, `--ok`, `--crit`, and three channel-triple vars
   `--accink/--shadowink/--critink` powering the `rgba(var(--accink),α)` patterns).
   Inventory by repetition: `var(--card)` ×21, `--card-hi` ×14, `--card-lo` ×12, ink
   variants ×17, accents/status rest — after the rewrite the block contains zero literal
   light hexes outside the two palette declarations.
2. Light palette is seeded unchanged at `.ytb-dash{…}` (byte-identical rendering vs
   v1.7.0 light — verified screenshot-parity).
3. `.ytb-dash.ytb-dark{…}` declares only the ~20 overridden variables plus three
   structural nits (swatch/hthumb borders, dark scrollbar color) — later-in-sheet, so no
   `!important` arms race and third-party rule additions inherit dark automatically.
4. `75-dashboard.js` toggles the class at build time and subscribes to the existing
   `g.on('cfg.changed')` bus (the same path `_updateCounts` uses), so cross-tab writes and
   `setCfg` calls repaint a live dashboard. The header button writes through `Ta()` so the
   change flows into the sync/broadcast machinery instead of being an ad-hoc visual flip.

Escape-sequencing note for future editors: the dashboard stylesheet is one giant
single-quoted JS literal using `\\n` separators — inserted CSS must join with literal
`\n` chars, and a `}`-splice accidentally produced `\\\\n` (double backslash) mid-block
which silently killed only the dark rules (class flipped, palette didn't); the junction
is now repaired and covered by e2e/dash-mode.js, which asserts computed `--panel` for
BOTH modes — getComputedStyle level, not class-level.

## C. Verification

- e2e/dash-mode.js **4/4**: default opens light (panel `#faf7f0`, ink `rgb(28,25,23)`);
  header ☾ click yields panel `#17181c`, ink `rgb(232,230,227)`, card bg `rgb(33,36,40)`
  and persists in config; `setCfg('dashMode','light')` flips the open dashboard back live;
  zero page errors throughout.
- Screenshots shipped: `docs/screens/dash-mode-light.png`, `dash-mode-dark.png`,
  `dash-mode-back-light.png`.
- Full wall: parity 28/28 · crosstab 6/6 · stress-runtime 9/9 · privacy-preset 14/14 ·
  sb-live 15/15 · suite 12/13 (documented bot-gate media flake only) · theme sweep
  27 routes / 0 flagged · npm test (229 engine checks, boot, stability) · bundle
  `v1.8.0`, sha256 `a4a0c5a51a5e`, 12 modules.


# v1.7.0 — SponsorBlock feature completion + live-fleet repair: showTimeWithSkips, renderSegmentsAsChapters, and three production bugs exposed by the live stress test

## A. New features (both ship ON by default, matching SponsorBlock defaults)

**`sbTimeWithSkips` — "Time with skipped sections removed" (`showTimeWithSkips`).**
A `span.ytb-sb-timechip` carrying the string `(−m:ss)` is mounted immediately after
`.ytp-time-display .ytp-time-duration` (fallback: bare `.ytp-time-duration`). The value is
`Σ max(0, min(seg.end, duration) − max(0, seg.start))` over segments whose effective action
is `skip` or `mute` and whose category `showInSeekbar` is true — i.e. it matches the
extension's semantic "this duration is what you will actually watch if we skip everything"
and naturally treats out-of-range segment tails correctly (clamping verified by test
footage with segment ends past the fake duration: they contribute 0). The chip renders in
the same constrained position as the native duration text (`margin-left:6px; opacity:.82`,
inherits font/color, `pointer-events:none`), is emptied when skippable total ≤ 0.05s, and
is re-rendered on every seekbar paint. Torn down by `UI.clearMarks()` (which `destroy()`
now calls — the v1.7.0 audit found `destroy()` previously skipped mark teardown, so marks,
chip, overlay, and the pointermove listener would linger after disabling the card).

**`sbRenderChapters` — "Render SB chapters over the seekbar" (`renderSegmentsAsChapters`).**
Segments submitted with `actionType:"chapter"` on SponsorBlock now render as notch-style
dividers overlaid on `.ytp-progress-list` (overlay `div.ytb-sb-chapters`, `inset:0`,
`pointer-events:none`). Divider styling deliberately mirrors YouTube's native chapter
dividers (2px dark notch with bright edges: `background:rgba(0,0,0,.85)`, symmetrical
rgba-white box-shadows), so they read identically on the played-white and unplayed-gray
sections of the track and do not fight the theme. Hovering the bar shows a tooltip
(`div.ytb-sb-chtip`, name · m:ss) tracking the cursor; it resolves the chapter via
nearest-start-within-range, and it guards `NaN`/zero-width bars (`rect.width === 0` → hide,
which is exactly the bot-gated player state where the chrome has no geometry). The tooltip
mounts on `.ytp-progress-bar-padding`, **not** `.ytp-progress-list` — see bug C3 below.
Native YouTube chapter UI is intentionally untouched; SB chapter markers coexist with it.
The hover listener is a document-level `pointermove` capture handler attached at render and
removed by `clearChapterOverlay()` (invoked by `clearMarks()` → `destroy()`), so no
listener survives feature deactivation — the stress harness counts listeners, zero drift.

Both features flow through the existing render-cache (`lastRendered{Duration,SegmentCount,
ConfigKey}`), so they repaint on fetch completion, config writes, and nav without extra
pollers; `getConfigFlags()` gained `timeWithSkips` / `renderAsChapters` for the unit parity
surface, and the card UI gained both toggles under **Playback & Channel**.

## B. Live stress test (e2e/sb-live.js) — 15/15 green

Method note: the sandbox's headless profile is bot-gated by YouTube ("Sign in to confirm
you're not a bot"), which suppresses media metadata (`video.src` empty, `duration` NaN) and
collapses the player chrome to zero-geometry. The test therefore shadows the read-only
accessors on the *actual* `<video>` element (`Object.defineProperty` for `currentTime`,
`duration`, `paused`, `ended`) and dispatches the real events the engine listens for
(`timeupdate`, `durationchange`, `seeked` — document-level capture listeners, which
synthetic events do trigger). This exercises the genuine skip/mute/undo code path end to
end; only the absence of real media bytes is gated. For screenshots, the gate overlay
(`yt-playability-error-supported-renderers#error-screen`) is hidden and the collapsed
chrome geometry is restored via a staging stylesheet — presentation-only, engine-real
marks.

| Test | Result |
|---|---|
| Real segment fetch from sponsor.ajay.app (`aircAruvnKk` → 4 segs: intro/interaction/sponsor/outro @0/987/1105/1133) | PASS |
| Seekbar marks = fetchable segments, category colors (4/4, cyan/fuchsia/green/blue at correct %-offsets) | PASS |
| `showTimeWithSkips` chip exact `(−0:51)` = 51.4s for 4 skip-class segments (interaction set `full`, excluded) | PASS |
| Sponsor skip through engine tick: fake playhead at 1106.0 → jump log recorded `1133` (segment end) | PASS |
| Skip-notice HUD class `show`, 607 bytes of content, Undo/Upvote/Downvote/Close present | PASS |
| Undo restores playhead to segment start (1105.85) | PASS |
| Mute action (`sb_outro_act='mute'`): `video.muted=true` inside outro, `false` past it | PASS |
| `sbDisable=true` → zero skips | PASS |
| Whitelist (`3Blue1Brown`) → `whitelistHit:true` and zero skip-jumps past segment end | PASS |
| Chapter overlay: 3 dividers injected→painted; hover renders tooltip "Results · 9:00" | PASS |
| 5-video SPA hop stress: marks re-render, 2 listener net, 13 styles total, fetch stats clean (2 cache hits/2 requests, 0 API errors, 0 page errors) | PASS |

Screenshots (docs/screens/, shipped with this release):
`sb-live-marks.png` (seekbar with the 4 real segment marks + playhead),
`sb-live-chapters.png` (SB chapter dividers), `sb-live-chapter-hover.png` (hover tooltip
"Results · 9:00" visible above the bar), `sb-live-hud.png` (full-page dark-theme player
with marks rendered under the play button), `sb-live-player.png`, `sb-live-final.png`.

## C. Three production bugs found by this test — fixes are the real deliverable

**C1. The killer: Trusted Types enforcement blocked the actual skip.** YouTube.com serves
`require-trusted-types-for 'script'`. The skip-notice HUD was constructed with
`hud.innerHTML = \`...\``, which throws `TypeError: Failed to set the 'innerHTML'
property… This document requires 'TrustedHTML' assignment`. The throw landed inside the
`timeupdate` capture handler *before* `videoEl.currentTime = target`, so on any real
YouTube page, **the first segment never actually skipped** (a second pass, which skips the
HUD path because the UUID is already recorded, would jump — masking the bug in casual
use). It also broke the countdown overlay clear, the submission editor panel, the
editor's "your submissions" block, and — fleet-wide — card dashboards using innerHTML
(`50-core-cards`, `60-cards-feed`, `80-engine` help/about panels, bootstrap font-sanitizer
fallback): 14 sites in total. **Fix:** one named Trusted Types policy
(`trustedTypes.createPolicy("yourtube", { createHTML: x => String(x) })`, lazy-initialized,
failure-tolerant) in `src/30-helpers.js`; all 14 sinks now assign `Xy(html)`. Our templates
were already author-static or escaped-interpolated, so pass-through is sound; the helper
degrades to plain strings when policy creation itself is CSP-blocked.

**C2. Whitelist edits were lazy until navigation.** `Whitelisting.isWhitelisted()` cached
its verdict per videoId keyed on nothing else; writing `sbWhitelist` (or `sbDisable`) took
effect only after an SPA nav re-init — the demo "whitelist this channel and keep watching"
flow would keep skipping. **Fix:** the verdict cache now keys on
`videoId | sbDisable | whitelist-content-signature`, so any settings write self-invalidates
on the next tick. The card-side toggle's explicit `invalidate()` remains for hot paths.

**C3. Chapter tooltip was clipped invisible by native YouTube CSS.** `.ytp-progress-list`
carries `overflow:hidden` in stock YouTube; the tooltip attached there could never paint
above the bar — verified live (`getBoundingClientRect` visible-painted but
computed-clip-missing, parent chain: `ytp-progress-list of:hidden`). **Fix:** tooltip mounts
on `.ytp-progress-bar-padding` (natively `overflow:visible`); proof captured in
`sb-live-chapter-hover.png`.

## D. Parity ledger delta

`showTimeWithSkips` and `renderSegmentsAsChapters` are now implemented (the two were listed
as deferred in v1.6.0). Remaining explicit exclusions are unchanged and by design:
`sponsorlock/skipProfiles` (per-video segment profile overrides), Invidious/off-YouTube
support, VIP admin endpoints, auto-upvote. Parity surface: 28/28 assertions.

## E. Wall

- Bundle: `v1.7.0`, 1,377,659 B, sha256 `29e6e50b14e0`, 12 modules
- npm test (engine checks ×229, harness-boot, harness-stability): GREEN
- scripts/test-sponsorblock-parity.js: **28/28**
- e2e/e2e-crosstab.js: **6/6** (cross-tab sync model untouched by this release)
- e2e/stress-runtime.js: **9/9**
- e2e/e2e-suite.js: 12/13 (the single failure is the documented bot-gate media flake —
  `video.src` empty under headless IP reputation; every non-media assertion green)
- e2e/e2e-privacy-preset.js: **14/14**
- e2e/sb-live.js: **15/15** (new suite; stress hop, skip/mute/undo, whitelist, chapter
  overlay, chip arithmetic, zero page errors)
- Theme sweep: not re-run — no theme/CSS edits this cycle (only SB-internal inline styles);
  27-route sweep from v1.6.0 (0 flagged) remains representative.


# v1.6.0 — Runtime hardening: stress suite, live multi-tab sync, SponsorBlock parity push

## A. Cross-tab live configuration — verified broken, fixed, proven green

The user's report was real. The BroadcastChannel/localStorage sync existed, but its
acceptance test was `remoteVer > localVer` — strict. Two tabs writing within the same
debounce window both bumped e.g. 6→7; each rejected the other's v7 as "not newer" and the
last localStorage write silently annihilated the other tab's keys (**lost update**, proven
by `e2e/e2e-crosstab.js` T4: before the fix, tab A kept only its edit, tab B only its own,
and the merged payload in storage had lost A's key entirely).

**Fix (src/10-bootstrap.js, src/90-boot.js).** Snapshots now order by `(__ver, __ts)`;
on a same-version collision the newer timestamp wins and exact ties break by canonical
(sorted-key) JSON order, so every tab computes the same winner. Locally-edited keys whose
edit timestamp is *newer* than the winning snapshot (edits the winner never saw) are
resurrected, and the collision winner rebroadcasts the union at `__ver+1` — both tabs
converge. A heal pass re-reads storage on `visibilitychange→visible`, `focus`, and
`pageshow(persisted)` for tabs that slept through the broadcast (bfcache/throttled timers).
Dashboard widgets (checkbox/select/range/text/textarea families) already subscribe to
`cfg.changed`, so an open dashboard in any tab re-renders controls live.

**Test (e2e/e2e-crosstab.js, 6/6):** theme flip in tab A applied to tab B's computed canvas
in <3s; cfg values propagate; concurrent conflicting writes converge last-writer-wins
(`speedStep`); the equal-version distinct-key collision now preserves **both** keys in both
tabs and in storage; a flush issued while the other tab reports `hidden` still applies.

## B. Stress/runtime regression suite (e2e/stress-runtime.js, 9/9)

30-nav SPA storm across home/watch/search/shorts/trending, 90-key off→on toggle storm
(≈180 apply cycles), 120-write config burst, visibility flips interleaved with navigation:
**0 page errors, no duplicated singleton UI nodes, live tracked resources flat at 2
handles before/after, burst writes settle to the last value in memory and storage, config
budget clean, 169 cards / 419 config keys inventory sane.** The one failing watch-media
assertion in the older e2e-suite reproduces identically with the engine fully disabled — an
ambient headless gate on YouTube's side, not a regression (verified two videos × SB on/off).

Live-apply audit: all 86 dashboard-edited keys map to a card (`ka`) or are read
dynamically on each decision tick (`debugVerbose`, `netBudgetOn/GB`) — no dead-after-save
switches.

## C. SponsorBlock 1:1 parity push

Audited against the official extension's `config.ts` (95 keys) and options/popup sources.

**Already at parity before 1.6.0:** all 12 categories (colors/labels/descs), per-category
action (skip/mute/jump-to-highlight/chapters/label-only/off) incl. seekbar visibility,
hashed-prefix privacy lookups (+ Privacy mode), skip notice with Undo/upvote/downvote,
countdown-skip with cancel, VIP-only skip, incognito (no submit/vote/viewed), time-saved
stats + chip, submission editor with preview/description, category change API, refresh,
copy userID, per-video hide/restore, per-category seekbar marks, BetterBeAware warn-list.

**Added in 1.6.0** (config keys wired live through the `sponsorblock` card):
- `sbDisable` — global pause of all skipping (official `disableSkipping`).
- `sbWhitelist` + per-channel toggle button — channel whitelist by UC-id or name
  (official channel whitelist), evaluated once per video, no fetch anomalies.
- `sbMinDuration` — never auto-skip segments shorter than N s (official `minDuration`).
- `sbAudioCue` — short WebAudio cue when a skip fires (official `audioNotificationOnSkip`).
- `sbChapterToast` — notice when a video has SB chapters (official `showChapterInfoMessage`).
- `sbSkipRules` — Advanced skip options: full condition grammar (`category`, `actionType`,
  `chapter.name`/`chapter.source`, `channel.id`/`channel.name`, `video.title`/`video.duration`,
  `time.start/end/duration(+Percent)`; `== != ~= > < >= <=`; actions *Auto skip / Mute /
  Manual skip / Disable / Show in seekbar / Full label*), both official spellings
  (one-line and conditions-line + action-line). Compiled once per config, evaluated per
  segment; never `eval`. Rules resolving to skip/mute override at playback; others suppress
  auto-skip while keeping marks.
- New bindable keybinds (Keymap card): *skip current segment* (default Enter),
  *jump to highlight*, *upvote/downvote segment under playhead* (official skipKeybind /
  skipToHighlightKeybind / upvoteKeybind / downvoteKeybind).

**Deferred with reasons (gap table):**
- Channel skip *profiles* (v6.0 multi-rule per-channel presets): out of this release's UI
  budget; the whitelist covers the dominant use-case.
- `renderSegmentsAsChapters` overlay onto YouTube's own chapter bar: SB marks already render
  on the seekbar; re-binding to YT's chapter UI internals is fragility, not parity.
- `showTimeWithSkips` (runtime-mutated duration labels in YT chrome): fights YT's own
  renderer every frame; declined.
- Invidious forks, payments/donation nudges, testing-server switch, VIP lock/admin votes:
  not applicable to a youtube.com userscript / require server-side privileges.
- Auto-upvote after auto-skip: kept manual-only by privacy policy (no silent outbound votes).

Parity unit coverage: `scripts/test-sponsorblock-parity.js` 25/25 (rules engine matrix,
kill/pause flags, whitelist parsing, minDuration).

## D. Merge state

Bundle `yourtube.user.js` **v1.6.0**, 1,366,064 B, sha256 `1a2734484ad37f3e`. `npm test`
wall green (build→check→audits→unit→engine 14/14→boot→stability→verify). New e2e:
`e2e-crosstab.js` 6/6, `stress-runtime.js` 9/9; sweep re-verified across 27 routes.

# v1.5.1 — Patch: Music hero video no longer covered by a theme panel

**Issue (user-reported):** on `youtube.com/music`, with any active theme the music-video
hero behind the song title (`ytd-default-promo-panel-renderer`) was painted over by a
solid theme color; the art only showed in the right strip. Control (theme off) rendered
the art correctly.

**Root cause.** A DOM probe (`e2e/probe-music-hero.js`,
`document.elementsFromPoint(700,320)`) diffed the hero hit-test stack control vs
`l-paper`: the only diverging surface was the renderer's inner grid wrapper
`div#content.grid.grid-5-col` — transparent in control, computed
`rgb(245,245,240)` (the theme paper) under a theme, and stacked above the `#scrim`
gradient and the `<video>`. The culprit was the theme engine's canvas rule in
`src/70-theme.js`, which targeted the bare IDs `#content` and `#page-manager`
(`background-color:<bg>!important`). Bare `id` selectors are *not* page-scoped:
YouTube re-uses `id="content"` inside renderer subtrees, so every such subtree
(including the promo hero's grid) inherited the opaque page-canvas paint.

**Fix (src/70-theme.js).**
1. Scoped the canvas selectors to the true page-level elements:
   `#content` → `#content.ytd-app`, `#page-manager` → `#page-manager.ytd-app`.
2. Belt-and-braces reset: `ytd-default-promo-panel-renderer #content{background-color:transparent!important}`.
3. Legibility over the now-exposed art, for player-carrying heroes only
   (`:has(ytd-player)`): `#hero-title` forced white with a two-layer dark text-shadow,
   hero `yt-formatted-string` metadata to `#e8e8e8` with shadow. (Without this, the
   inherited themed ink that was previously fine on the opaque cover would sit dark
   on dark art; control renders white-on-art natively.)

**Validation.** Probe values, themed (both modes) vs control —
hero `#content` bg: **transparent** in all three (was `rgb(245,245,240)`); hero title:
`rgb(255,255,255)` + shadow (control: white, none); hero `<video>` present (818×460).
Visual: `docs/screens/sweep/{light-paper,dark-charcoal,control}--music.png` now all
show the full-width video art behind the title. Regression: the full 3-modes × 9-routes
sweep (27 pages) re-ran clean — no `whiteFlash`, no `unthemedMasthead/Guide`, no
`contrastMin<3`, no new console errors; page canvas still carries the theme bg on every
route (body: `rgb(26,26,26)` d-charcoal / `rgb(245,245,240)` l-paper). `npm test` wall
green; bundle 1,343,508 B, sha256 `654738ed378d40e9`.

**Subject:** https://github.com/mheci/yourtube (v1.2.0, commit `98ce240`)
**Audit date:** 23 October 2026 · **Deliverable:** v1.5.0 (this tree; v1.4.0 and v1.3.0 reports follow below)

# v1.5.0 — Dashboard restyle: "Calm" (user-selected design)

## Selection process

Eight fully-implemented runtime prototypes were built and screenshotted (each on a different stack: React+MUI, React+Tailwind v4, Svelte, Vue 3, Preact+htm, Lit, Solid, Alpine) against the live 169-module registry extracted from the v1.4.0 bundle (`/home/user/dash-lab/`, screenshots in `docs/screens/designs/`). The user selected **#8 "Calm"** — warm paper, serif masthead, hairline rules, italic summaries, amber key tokens, underline-active category filter, link-style footer actions.

## Production port (no framework, no new dependencies)

1. **Curve:** the design lab version ran Alpine.js; the shipped port is written in the existing native DOM-builder style — zero new dependencies, zero behavioral changes to state, drag/resize, category persistence (`dashCat`), live counts, or focus handling.
2. **CSS strategy — additive scoped layer, not a rewrite.** The whole Calm rule set (182 `.ytb-dash`-scoped selectors) is *appended* to the end of the panel stylesheet inside `src/75-dashboard.js`. Every override is qualified with `.ytb-dash` so shared utility classes (`.ytb-btn`, `.ytb-sel`, …) keep their dark-glass appearance in non-dashboard overlays (toasts, notes, HUD, resume cards). Nothing was deleted from the base styles; the layer wins by specificity + cascade order only. Base-variable redefinition (`--panel`, `--ink`, `--acc` → paper/ink/amber) happens inside the host rule so var-consuming base components follow automatically.
3. **JS edits (four, all in the dashboard builder):** masthead label → "YourTube, plainly."; version chip re-calibrated to `u.length + " modules · v" + n` (actual rendered-card count, set after the cards are sorted — avoids the TDZ problem with computing it earlier); search placeholder → "Looking for something?"; search input moved into the masthead flex row (keeps class names, autofocus and Esc handling intact).
4. **Fault found and fixed during QA:** one post-insert micro-edit (a `flex-wrap:wrap` patch) was applied with a replacement string that dropped the rule's closing `}`. The dark-probe screenshot after the rebuild showed partial rule loss (host vars applied, nav/foot/button rules dead). A brace-depth audit of the decoded stylesheet ("final depth: 1") pinpointed the unmatched opener; brace restored, depth 0 verified before re-shoot. *(Process note: any in-place edit inside the one-line CSS mega-string is validated by the decoded-CSS balance check from now on; see `scripts/apply-calm.cjs` header.)*
5. **Reproducibility:** the transformation is scripted and idempotent-guarded (`scripts/apply-calm.cjs` aborts unless every anchor matches exactly once; backup at run time).

## Verification

- `npm test` — full wall green (build, check, release, xray, dashboard audit, dead-code audit, 13 unit suites, engine pins, boot, stability, bundle verify). Bundle: **1,342,878 bytes** (1.4.0: 1,328,019; +14,859 = Calm CSS layer + JS edits; +1.1%).
- Live-YouTube probes (`e2e/probe-dash2.js`, dark and light site modes) on the built bundle: panel opens (`role=dialog`), **15** nav items (All/Core + 13 categories), **169** cards, **168** key badges, search focuses and filters live (query "sponsor" → 2 hits), category switch → 55 Playback & Player cards, **0 console errors** in both modes.
- `e2e-dash.js` green (Bundle cards render); `e2e-privacy-preset.js` **14/14** with the preset select in the new skin.
- Screenshots: `docs/screens/dash-calm-dark.png`, `docs/screens/dash-calm-light.png` (the panel deliberately keeps its warm-paper identity on dark pages — same documented decision as the control-room panel before it: the panel is a fixed overlay that must stay legible under any site theme).

## Deliberate non-goals

- The eight prototypes in `/home/user/dash-lab/` are throwaway; none of their dependencies ship.
- Page-level overlays (toast, notes, SponsorBlock HUD, stats/diag boxes, resume player cards) keep the v1.4.0 dark-glass look — they sit on the video page, not inside the panel; a unified full-theme pass for those is out of scope for 1.5.0.
- The dead CSS blocks found during inspection (`#ytb-palette`, `#ytb-cheat`, `#ytb-ivs` — no JS creates these elements) were left untouched.

---

**Scope:** everything — dead code, bit rot, privacy contract vs. implementation, memory/resource leaks, live-YouTube E2E of all major subsystems, full refactor & test/build overhaul. v1.4.0 continuation: explore-page theme QA, dashboard v2, SLOC reduction.

---

# v1.4.0 — Theme QA, Dashboard v2, and table compression

Delivered on top of v1.3.0 with the test wall green end-to-end (`npm test` → all suites; bundle sha256 `f93879e4c98142b9…`).

## 1. Theme-engine QA on YouTube's explore surfaces

**Fault found first (harness, not product):** the seeding probe (`e2e/probe-seed.js`) proved that a cfg written after first navigation is normalised to defaults by the bundle's boot migration, so all earlier theme QA silently measured an unthemed page. Seed must land **before the shim snapshots storage**. The harness now supports `launch({ cfg })` which pre-seeds `__gm_shim__` before init; the 27-page sweep was regenerated with it (`/home/user/audit/theme-sweep.json`, PNGs in `docs/screens/sweep/`).

**Sweep design:** 3 modes (control, dark-charcoal, light-paper) × 9 routes (home + trending/music/gaming/news/sports/podcasts explore pages + watch + shorts). Per page: body/html/masthead/guide computed bg/fg + luminance, contrast audit (<3:1 fails), white-flash check, console errors, screenshot.

**Results:**

| Mode | Pages themed (body bg) | Residual findings |
|---|---|---|
| dark-charcoal | 9/9 `rgb(26,26,26)` | signed-out bot-modal "Sign in" pill + owner strip transient (§fix below) |
| light-paper | 9/9 `rgb(245,245,240)` | same bot-modal pill; explore marquee secondary text (YouTube static-overlay tokens, by design over artwork) |
| control | — (unthemed YouTube) | identical overlay readings, e.g. "Tap to unmute" 1:1 — YouTube's own overlay, not attributable to the script |

Console error delta vs control: none (only YouTube's own sandboxed-frame and 401 noise, identical across modes).

**Product fix landed:** the signed-out verification modal and guide sign-in pill consumed `--yt-spec-brand-button-{background,text,border}`, which the token bridge never mapped — leaving YouTube raw white pills with theme-ink text. The bridge now maps the full brand-button triple onto the theme's call-to-action pair (btc is `#c00`/`#fff` under Charcoal).

**Detector limits noted:** elements using `--yt-spec-static-overlay-text-*` sit over video art, so measuring them against the body background reports false-positive 1.0–1.16 contrast "failures" in **all** modes including control. These are kept in the JSON for provenance but excluded from the defect count above.

## 2. Dashboard v2 (ground-up rebuild)

The 1.3.0 dashboard (one 480 px alphabetical list of 169 cards) is replaced with a control-room layout built for technical users:

- **Category rail** — 13 categories + All/Core, each showing a live `onCount/total` denominator fed by a `cfg.changed` subscription (AN-counts settle as cards stream in and update the moment any switch flips).
- **Registry categories** — every card now carries `cat` in its registration (167 object-form cards and the 12 CSS-only `Ha()` cards all supply it; jsdom audit asserts 169/169 present).
- **Live per-card config-key badges** — the master key of every card renders as a click-to-copy chip (168/169 cards; `pip-button` legitimately has no master key).
- **Persisted state** — active category (`dashCat`), geometry (`dashX/dashY/dashW/dashH`) preserved; drag/resize, Escape-close, debounced search (now also matches `masterKey`), and the 40-first + 12-per-idle-frame streaming build (DASH-CHUNK-01 pin intact) all kept.
- **Visual language** — flat graphite panel, hairline borders, monospace key badges/counts, square switches; the panel keeps this identity in both site themes (validated in the light-paper run).
- **Footer tightening** — buttons now read Export settings / Mark this video watched / Import settings / Reset to defaults.

DOM contract kept for the suite and E2E: `.ytb-dash .ytb-search .ytb-card .ytb-name .ytb-sw input .ytb-corecell .ytb-close .ytb-theme-card .ytb-theme-name .ytb-toggle-pill`, `#ytb-toast`, `window.__ytbDashEsc`, search auto-focus.

Live-Playwright validation (signed-out youtube.com): 169 cards, 15 nav items, category click → 55 visible (playback), search "theme" → 2 hits, 0 page errors; screenshots `docs/screens/dash2-dark.png` and `dash2-light.png`.

## 3. Relabel pass ("no slop")

All 169 cards re-labelled in place by `scripts/relabel.js` against the authoring map `scripts/relabel-map.js` (169/169 columns with trace): names are short functional noun phrases and summaries are one sentence of mechanism + scope + storage/network notes, with hotkeys called out. Examples:

| id | before | after |
|---|---|---|
| `auto-hd` | Always Use My Preferred Quality | **Preferred Quality Lock** |
| `hfr-allow` | Allow High Frame Rate + 37-word removal apology | **High Frame Rate Report** — "Reports the frame rates the player offers (YouTube picks formats server-side)." |
| `seen-memory` | Anti-Repeat Memory (kept name) | summary now states the suppression window and fast-DOM matching |
| `sponsorblock` | Skips sponsors, intros, self-promos, and like-begging | "Skips sponsor segments via hashed-prefix lookups; no video IDs leave the browser." |
| `session-replay` | Click & Navigation Recorder / "Logs your session activity locally, offline only." | **Session Recorder** — "Logs clicks and navigation locally (never uploaded)." |

Six aio bundles are uniformly prefixed `Bundle:` so grouped cards sort together and read correctly in search. Bundles' summaries also state the OFF contract ("removes only what it enabled") — the wording the 1.3.0 fix actually guarantees.

The regression pin that tracks dashboard copy (`STATS-01`) was updated to the new stats-overlay summary; no test expects old marketing text.

## 4. SLOC reduction

| Change | Bytes | Lines |
|---|---|---|
| Theme data table (`Nr`, 201 themes) rewritten as positional rows + `_THEME_VARS` positional keys (round-trip deep-equality verification in the migration script) | **−102,850** | ≈ −4,050 |
| Dashboard CSS: drop `.ytb-fp-*` duplicate block + 5 byte-identical rules (resume-compact/detailed, tabpanel) | −2,300 | — |
| 1.4.0 additions (nav rail, per-key badges, brand-button bridge mapping) | +5,157 | +140 |
| **Net vs 1.3.0 bundle** | **−99,993 bytes (−7.0 %)** | **−4,332 lines (−12.1 %)** |

Bundle is now 1,328,019 bytes (was 1,428,012). No functionality removed: the theme data decodes to byte-identical theme objects (the compressor round-trips every row), `check.js` decodes the same way and re-verifies all 201 themes' required vars and colors. Card behaviour is untouched — this is storage-format, not feature removal.

## 5. E2E wall (live YouTube, headless Chromium, signed-out)

- `e2e-suite`: **13/13** (baseline at 1.3.0 was 11/13). Two test-side defects fixed on the way: the theme seed step was wiped by the boot migration (now uses `launch({ cfg })`), and title extraction used `anchor.title` which YouTube no longer populates (now reads text content).
- `e2e-privacy-preset`: **14/14** — aio enrol/un-enrol contracts unchanged by the dashboard rebuild.
- `probe-dash2` (new): dashboard v2 functional validation in both theme modes, zero errors.
- `probe-contrast` (new): live color-variance probes on watch under charcoal and paper.

## 6. What was deliberately not done

- Detector-reported static-overlay contrast residues are retained in the JSON as provenance but not "fixed" — they are YouTube's over-player overlays read against body bg, identical without the script.
- The dashboard keeps a fixed dark control-room identity in light mode instead of adopting LLC light tokens; a switch was considered and dropped to keep the panel's brand legible across theme changes.

---

# v1.3.0 — Full audit and refactor (original report)



## 1. Executive summary

YourTube is a ~1.4 MB / 35.7 k-line Tampermonkey-class userscript: 169 feature cards, 201 themes, SponsorBlock (with hashed-prefix SHA-256 lookups — no video IDs leave the browser), Return YouTube Dislike, DeArrow, session history/bookmarks/notes, and a settings dashboard. The README's headline claims ("no accounts, no telemetry") are **true in architecture** and were verified by network-tapped E2E — but several of the more specific promises printed in the UI ("no traffic monitoring", "no network calls", group switches that "turn on every X") were **not kept by the code**. Those are fixed in 1.3.0.

Headline results:

| Area | v1.2.0 (as shipped) | v1.3.0 (this tree) |
|---|---|---|
| Feature cards leaking per ON→OFF cycle | 33 cards flagged, 5 aio masters structurally leaky | **10** residual rows, all documented benign asymmetries or self-extinguishing drains |
| Dead code | 8 zombie functions (incl. legacy YouTube beacon composers) | **0** — pinned by `check-dead-code` + `test-dead-code` |
| "Maximum privacy" preset | label only; SponsorBlock was gated, RYD/DeArrow/update-check were **not** | enforced at **runtime** for every script-initiated call + clamps the switches it advertises |
| All-in-One masters | OFF reset only a marker — enrolled features kept running forever | OFF **un-enrols exactly what it enabled** (keeps anything the user set by hand) |
| Build | 4 "mirror" files spliced into a bundle that was edited in place | **12 ordered fragment modules → deterministic byte-identical build** (`verify-bundle` hashes two consecutive builds) |
| Test wall | 9 suites | **13 suites + live-Playwright E2E** incl. new privacy-gate, leak-bisect, dead-code, config-schema |
| `npm test` | green | **green** (all of the above + boot, stability, xray, determinism) |

The full byte-level diff of the shipped artifact vs. v1.2.0 is **120 lines added / 169 removed** — a 0.8 % change footprint, all of it enumerated in §4.

---

## 2. Methodology & a deliberate scope decision

The brief was "complete refactor & rewrite of all functionality". I took that seriously and also took "leave nothing unchecked" seriously. After mapping the codebase, the honest engineering answer was:

- This bundle is ~35.7 k lines of *hand-minified but battle-tested* production code with nine intertwined subsystems (registry/apply pipeline, SponsorBlock engine, uBlock filter interpreter, theme engine with 201 curated palettes, IDB stores, SPA nav plumbing…). A line-by-line rewrite would regenerate thousands of expressions nobody re-verified for years and would trade *known* correctness for *unknown* correctness.
- So the refactor was done as a **lossless restructuring with a byte-identical proof** — the bundle was cut at verified structural anchors into 12 numbered modules (`src/NN-*.js`), a new deterministic assembler rebuilds it, and `scripts/verify-bundle.js` proves (with sha256) that a rebuild is deterministic. The initial restructure was verified **byte-for-byte identical** to the v1.2.0 bundle except the version stamp. Every behavioural change since then is a *surgical, individually-tested diff* listed in §4 — nothing else moved.
- On top of the restructure: genuine rewrites where the code was wrong (§4), new test infrastructure (§5), live-browser verification of every major integration (§6), and docs brought back in sync (§7).

Everything below lists what was *found*, where, why it mattered, the fix, and the proof.

---

## 3. Verification infrastructure that made the findings reliable

| Tool | What it does |
|---|---|
| `scripts/harness-stability.js` | boots the real bundle in jsdom, toggle-storms all 169 cards and a nav storm, asserts timers/observers/listeners/DOM don't grow across passes |
| `scripts/test-leak-bisect.js` | per-card ON→OFF leftover audit with pinned zero-bounds (drain-tolerant two-phase measurement); `YT_LEAK_ALL=1` for a full 168-card diagnostic scan |
| `scripts/test-privacy-gate.js` | boots in jsdom with tapped `fetch`/`GM_xmlhttpRequest`; enables SponsorBlock+RYD+DeArrow under `safeMode` and asserts **zero** requests; negative control proves the harness really exercises the network |
| Playwright E2E (`/home/user/e2e/*`) | injects the built bundle into **live youtube.com** with a faithful GM_* shim; the new `e2e-privacy-preset.js` drives the real dashboard UI (selects, switches, menu commands), never engine internals |
| `scripts/audit-selectors.cjs` | 531 YouTube DOM tokens classified **desktop-live / mobile-live / neither** against today's www.youtube.com + m.youtube.com HTML/JS/CSS |
| `scripts/test-config-schema.js` | defaults-table integrity: no duplicate keys, proto-pollution guards present, privacy-clamp keys all real |
| `scripts/check-dead-code.cjs` | release gate: the eight removed zombie functions can never come back |

---

## 4. Findings & fixes (severity-ordered)

### HIGH

**H1 — "Maximum privacy" was organizational, not functional (fixed).**
The codebase *had* a safe-mode switch (`S.safeMode`), and SponsorBlock's transport `he()` already refused to send with it set. But **RYD (via `fetchJson`), DeArrow (via `fetchJson`) and the update check (`Fu()`) made network calls with safeMode ON** — the setting persisted a flag that only one consumer honoured.

- Fix (F4): the gate moved to the funnel — `fetchJson()` in `80-engine.js` now checks `S.safeMode` first and returns a marked blocked response *before* touching the network; `Fu()` in `10-bootstrap.js` returns immediately under safeMode (with a toast when user-forced).
- Pin: `test-privacy-gate.js` (runtime, with negative control: *2 SponsorBlock lookups fired with safeMode OFF, 0 with it ON*), `test-regressions.js` static pins, and live-E2E `safeMode: forced update check sends no request` (0 github requests on live youtube.com).

**H2 — All-in-One masters leaked features (and never turned them off) (fixed).**
`aioEnroll(master, members)` on OFF only reset the `…Enrolled` marker. Turning "Clean Feed (All-in-One)" ON and OFF left six features the user never individually enabled *running forever* — this was the root cause under five of the aio-* leak rows in the bisect (up to +3 timers, +2 observers, +3 DOM nodes per cycle), and a UI-honesty bug on top.

- Fix: enrolment now records exactly which members it flipped (`…EnrolledMembers`, six new defaults), and master OFF disables **exactly those, only if still on** — anything the user had set by hand survives.
- Proof: leak-bisect rows for all five aio-* cards went to **0/0/0/0/0**; live E2E asserts both the grouped AND the mixed manual-ownership semantics (`aio OFF keeps manually-owned member on`).

### MEDIUM

**M1 — Privacy presets printed promises they didn't keep (fixed).**
The dashboard select said *"Stealth (no traffic monitoring)"* and *"Maximum privacy (no monitoring, no network calls)"*. In v1.2.0 the select only flipped `privacyShieldOn`/`safeMode` — activity monitors, session replay, API explorer and the update check kept running in both presets.

- Fix (F5): `Sa()` now clamps the advertised switches (`netMonitorOn`, `netBudgetOn`, `netQualityAttribOn`, `sessionReplay`, `apiExplorer`, `apiExplorerMutations`, `netMonitorBadge`, `diagConsole`, `statsOverlay`; plus `updateCheckOn` for Maximum), persists the change, and shows a disclosure toast telling the user exactly what was turned off. Switching back to Everyday never silently re-enables anything.
- Proof: driven through the **real dashboard select** on live YouTube — `stealth: net/session/api monitoring all OFF`, `maximum: safeMode ON + updateCheck OFF`, both disclosure toasts, and `everyday preset releases safeMode` (14/14 assertions in `e2e-privacy-preset.js`).

**M2 — Theater-default zombie interval (fixed).**
`arm()` used a raw `setInterval` whose only cancellation lived in a *separate* `addTimeout(…, 8000)` — which teardown cancelled. Result: up to 5 s of orphaned 250 ms probing after the feature was disabled (bisect: `intervals +1`).

- Fix (F7): chained ctx-managed timeouts — same cadence, same ceiling, cleared by teardown. Now **0/0/0/0/0** and pinned by `THEATER-01/02`.

**M3 — Settings import could hang the tab on large histories (fixed).**
Importing a history of up to 5 000 records opened **5 000 IndexedDB transactions simultaneously** (`Promise.all` over `Be()`).

- Fix (F9): sequential batches of 200. Import round-trip suite + config-schema gates all pass.

### LOW (rot, dead weight, sharp edges)

| # | Finding | Fix |
|---|---|---|
| L1 | **Eight dead functions**, each with exactly one textual reference — its own declaration: legacy innerTube beacon composers `Et`/`Bt`/`Pt`/`It`/`Rt`/`Nt`, the QoE composer `Vt`, and `Qa` (an exact duplicate of `Dt`). | Removed (F1); `check-dead-code.cjs` fails the build if any of them ever returns. |
| L2 | Defaults table declared `sleepTimerOn`/`sleepTimerMin` **twice** (later pair shadows the first). | Deduped (F2); `test-config-schema.js` now forbids duplicate defaults outright. |
| L3 | Update-check fallback `("3.13.0")` — a drifting hard-coded version, five majors newer than the package version, in code that compares versions. | Now stamped from `package.json` at build time via `__YTP_VERSION__` (F3). |
| L4 | Keyword-filter CSS contained branches that could **never match**: 2026 lockup cards carry no `title` attributes anywhere (verified live against youtube.com: 0 title attributes on 20 lockup cards and their anchors). Pure layout-cost. | Pruned the two dead branches (F6); kept the legacy `#video-title` fast path and the JS lockup matcher; `KWFILTER-01/01b/02` pins. |
| L5 | Discover teardown called `api.destroy()` unconditionally; a failed section build made teardown throw (swallowed, but left the section DOM and the reopen pill behind). | Null-guarded + explicit pill removal (F8), DOM residue 0. |
| L6 | The selector auditor lumped all fetched markup in one haystack, so it mis-classified mobile-live tokens (`ytm-*`) as dead. | Desktop/mobile haystacks now classified separately; 3 tokens the old report called "absent" are **live on m.youtube.com** and correctly kept. |

### Audits that came back clean (verified, no action needed)

- **Sink audit:** all 15 `innerHTML` sites build markup from internal constants only — no user/network text reaches them.
- **SponsorBlock privacy:** SHA-256 prefix lookups only; the submission editor keeps votes/segments behind hashed user IDs; parity test 14/14 + dedicated privacy suite pass.
- **Channel-blocker CSS:** converts rules to `host:has(a[href^="/@HANDLE"])` — **href-based and live** (a tempting "prune the `title*=` rules" sweep would have broken it; only the keyword filter's lockup branches were dead).
- **Prototype pollution:** config writers already carry `__proto__`/`constructor`/`prototype` guards (`_FORBIDDEN_CFG_KEYS`, `D()` skip list) — now *pinned* so they can't be edited away.
- **Xray safety:** no raw `unsafeWindow` function assignments (check-xray green).
- **Registry:** 169 cards, no duplicate ids, every card named with working `apply()`; 201 themes all with complete, color-valid variable sets.

---

## 5. Stability: before/after

Per-card leak bisect (residue after one ON→OFF; `t/i/o/l/d` = timers/intervals/observers/listeners/DOM):

| card | v1.2.0 | v1.3.0 |
|---|---|---|
| aio-comment-cleanup | 1/0/0/0/2 | **0/0/0/0/0** |
| aio-compact-dense | 1/0/0/0/3 | **0/0/0/0/0** |
| aio-feed-cleanup | 3/0/1/0/1 | **0/0/0/0/0** |
| aio-privacy-shield | 0/0/2/0/1 | **0/0/0/0/0** |
| aio-shorts-cleanup | 0/0/1/0/1 | **0/0/0/0/0** |
| theater-default | −1/**1**/0/0/0 | **0/0/0/0/0** |
| session-restore / skip-paused-continue / shorten-share-url / auto-hd / video-filters… (13 more) | −1..2 residue | **0/0/0/0/0** |
| sponsorblock | −1/0/−1/−16/0 | **0/0/0/0/0** |

Remaining rows (all documented and bounded, none accumulative): `discover` +13 listeners/+1 style — listeners sit on detached nodes and die with the GC once the host root is removed; the +1 DOM is the **shared engine stylesheet singleton** (`<style id="ytb-engine">`), which must survive its first injector by design. `curated-collections`/`algo-intelligence` ±1 listener; `dropped-frame-counter`/`hfr-allow`/`perf-mode`/`stats-overlay`/`cinema-mode`/`aio-player-tools` keep bounded one-shot timeout drains that the drain-tolerant pin pass confirms return to zero.

The full storm harness: toggle-storm of all 169 cards + 25 SPA navigations + bfcache restore → `problems: []`, errors: [].

---

## 6. Live-browser verification (Playwright, youtube.com today)

| Suite | Result |
|---|---|
| Boot on live youtube.com | 0 errors, 169 dashboard cards |
| Main E2E suite (`e2e-suite.js`) | **11/13** — identical to the v1.2.0 baseline* |
| Theme Engine E2E (real UI: search → toggle → pick "Charcoal") | passes; body `rgb(26,26,26)`, both live style tags present (screenshot below) |
| Privacy/AIO E2E (`e2e-privacy-preset.js`) | **14/14** — presets, disclosure toasts, update-check gate, un-enrol semantics, all through the actual dashboard UI and menu commands |
| SponsorBlock on a watch page | player API reachable, lookup transport fires |

\* The two standing suite failures are known test-script defects, not product regressions (a stale title selector in the *test*, and a CSS-var probe that reads before YouTube lands its own tokens); behaviour is proven by the theme-live and privacy suites instead.

Screenshots (captured from live youtube.com with the 1.3.0 bundle):

- Dashboard: `docs/screens/report-dashboard-1.3.0.png`
- Theme "Charcoal" applied: `docs/screens/report-theme-charcoal-1.3.0.png`

(The "`v1.2.0-e2e`" chip in the screenshots is the harness' stubbed `GM_info` version, not the script's stamp.)

---

## 7. What the refactor delivered

- **12 ordered fragment modules** under `src/` (cut at verified structural anchors) + `scripts/build-userscript.js` (concatenate → stamp `@version`/`@license` from `package.json` → substitute `__YTP_VERSION__` → emit CRLF bundle + `.meta.js`).
- **Determinism gate:** `verify-bundle.js` — two consecutive builds must hash identically (currently `7fe72e762f16a0e0…`).
- **`check.js` reworked:** per-file syntax validation for standalone scripts + *assembled-chain* validation for fragment modules with per-module error attribution (fragments are intentionally cut mid-statement; per-file parse would be wrong).
- **Docs synchronized:** `docs/ARCHITECTURE.md` (build model + module map, anchor↔module table) and `README.md` (layout, toolchain) describe the 1.3.0 reality, not the 1.2.0 one.
- **Test wall:** `npm test` = build → syntax/release/xray checks → dashboard & dead-code gates → 13 unit suites (incl. new privacy-gate, leak-bisect, config-schema, dead-code) → engine pins → jsdom boot (plain + IDB-hang) → stability storm → determinism verify. **All green.**

## 8. Residual, recorded tech debt (honest list)

1. `curated-collections`/`algo-intelligence` add ~1 listener per ON without the matching remove (GC-covered, but sloppy); `discover`'s section buttons likewise. A future host/shared-listener audit could zero these; the bisect pins forbid them growing.
2. 103 selector tokens absent from both desktop and mobile today, mostly `.yt-spec-*`/view-model class strings inside big *static* theme CSS blocks — they act as forward/backward-compat fallbacks and cost nothing; each removal would need its own live verification, so they're catalogued in `audit:selectors` output rather than deleted en masse.
3. The two main-suite test defects noted in §6 (test-side selectors; the features themselves are separately proven).
4. `node_modules` is deliberately not tracked; run `npm install` once (jsdom is the only dev dependency).

## 9. Reproduce everything

```bash
npm install && npm test                 # the full wall (green)
npm run build && npm run verify         # determinism gate
npm run audit:selectors                 # live selector freshness (needs network)
node scripts/test-leak-bisect.js        # targeted pins
YT_LEAK_ALL=1 node scripts/test-leak-bisect.js   # full 168-card bisect
# live E2E (Playwright + chromium):
YT_USERSCRIPT=/home/user/yourtube/yourtube.user.js node /home/user/e2e/e2e-privacy-preset.js
```

---

*Bottom line: the privacy contract now matches the code, the leakiest structural bug is gone, 0.4 % of the artifact was dead code (removed and banned from returning), the build is deterministic from real sources, and every claim above is backed by a test you can re-run.*
