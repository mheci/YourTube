# YourTube architecture

This is the map you want before editing `src/`. It documents how the
1.2 MB bundle is assembled from its modules, and which audit scripts exist to
catch the failure modes this codebase is prone to.

## Build model (1.3.0; 1.4.0 keeps the same chain)

1.4.0 notes: `src/60-cards-feed.js` stores the 201-theme data as positional
rows decoded by an adjacent `_THEME_VARS` key list (see `scripts/compress-themes.cjs`
for the migration + `check.js` for the equivalent decoder). Every feature card
now also registers a `cat` ("playback", "feed", …) that dashboard v2 groups by
and renders as its category rail.

```
src/00-header.js  →  src/10-bootstrap.js  →  src/20-resources.js  →  src/30-helpers.js
→ src/40-sponsorblock.js  →  src/50-core-cards.js  →  src/55-ublock.js
→ src/60-cards-feed.js  →  src/70-theme.js  →  src/75-dashboard.js
→ src/80-engine.js  →  src/90-boot.js
        │ concatenated in numeric order by  scripts/build-userscript.js
        ▼  (version/license stamped from package.json, __YTP_VERSION__ substituted)
yourtube.user.js   (artifact, CRLF, byte-deterministic)  +  yourtube.meta.js
```

`npm run build` regenerates the bundle bytes deterministically:
`scripts/verify-bundle.js` hashes two consecutive builds and fails if they
differ. The 1.3.0 restructure was verified byte-lossless against the v1.2.0
bundle (identical except the version stamp and the intentional fixes listed in
REPORT.md).

Consequences worth remembering:

- The modules are **fragments of one IIFE** (a few are deliberately cut
  mid-statement, e.g. 10→20 and 80→90), so individual files will not pass
  `node --check`. `scripts/check.js` validates the *assembled chain* and
  attributes syntax errors to the owning module by line offset.
- Edit features in `src/NN-*.js`, never in `yourtube.user.js` directly.
- `npm test` runs `build` + `verify` first, so the artifact can never drift
  from its sources.

## Module map

| Module | Contents |
|---|---|
| `00-header.js` | userscript metadata block (`@version`, `@require`, grants) |
| `10-bootstrap.js` | bootstrap, kill switch, storage, defaults table + coercion, nav, update check |
| `20-resources.js` | YourTubeResources — bounded caches, shared observers/tickers, resource scopes |
| `30-helpers.js` | metadata/oEmbed/history helpers, kill-switch helpers, toast (`pe()`) |
| `40-sponsorblock.js` | SponsorBlock engine (hashed-prefix lookups, skipping, voting, editor) |
| `50-core-cards.js` | Force-Watched, config state, registry, apply pipeline, core cards |
| `55-ublock.js` | uBlock-style filter interpreter used by the channel blocker |
| `60-cards-feed.js` | feed/comment/player cards (filters, watch tools, geo) |
| `70-theme.js` | Theme Engine (201 themes), scheduler, compact UI |
| `75-dashboard.js` | dashboard v2 (nav rail + per-key badges, grouped card pages) rendered in the v1.5.0 "Calm" theme (additively-scoped `.ytb-dash` CSS override layer appended to the panel stylesheet; base rules untouched), settings import/export, preset select |
| `80-engine.js` | YourTubeEngine v3: Discover, Algo, YourTubePack, aio-* enrolment, newest cards |
| `90-boot.js` | boot sequence, menu commands, hotkeys, unload hooks, watchdog |



## Bundle anchor map ↔ module map

Line numbers drift; the anchors are stable. Each module corresponds to one
contiguous region of the bundle, delimited by these anchors:

| Bundle region start anchor | Module |
|---|---|
| `// ==UserScript==` | `src/00-header.js` |
| `(() => {` | `src/10-bootstrap.js` |
| `//  YourTubeResources — bounded, disposable, visibility-aware resource primitives` | `src/20-resources.js` |
| `const oe = {` (metadata/oEmbed/history helpers) | `src/30-helpers.js` |
| `//  SponsorBlock Engine v2 (YourTube)` | `src/40-sponsorblock.js` |
| `let St_seekbarMarks` (Force-Watched, config, registry, core cards) | `src/50-core-cards.js` |
| `//  uBlock Filter Interpreter Engine` | `src/55-ublock.js` |
| `function Cb_norm(e) {` (feed/comment/player cards) | `src/60-cards-feed.js` |
| Theme Engine card (`id: "theme-engine"`) | `src/70-theme.js` |
| Dashboard UI (`const Uo = `…) | `src/75-dashboard.js` |
| `//  YourTubeEngine Ecosystem v3.0` | `src/80-engine.js` |
| Boot `(async function () {` (near the end) | `src/90-boot.js` |

## The apply pipeline (why features behave the way they do)

- Features register with `xa.register({ id, name, summary, masterKey, keys, apply, settings })`.
- `xa.apply(id)` **tears down first** (`ha(id)` removes every listener, observer,
  style, interval and timeout registered through the feature's scope) and then
  calls `apply(ctx)` with a fresh scope.
- Because of that teardown, **never store binding state on long-lived elements**
  (a `video.__flag` survives teardown and permanently blocks re-binding). Use a
  per-apply `WeakSet`; `scripts/test-regressions.js` pins the six historic
  offenders as forbidden.
- `xa.applyAll()` runs at boot (after the YouTube shell exists), on bfcache
  restore, and from the 20 s watchdog — **not** on SPA navigation. Features that
  need to react to navigation must use `ctx.onNav(...)`; gating `apply()` on
  `location.pathname` makes a feature dead unless the session starts there.
- Three failures quarantine a feature for the session (`fa()`), with a toast and
  a menu command to clear it.

## Audits and tests

| Command | What it protects |
|---|---|
| `npm test` | build determinism, syntax, theme table, xray safety, dashboard audit, unit suites, boot and stability harnesses |
| `npm run audit:keys` | settings integrity: dead defaults, invisible settings, dead controls (`--strict` to fail) |
| `npm run audit:selectors` | bit rot: YouTube tokens that no longer exist in live HTML/JS/CSS (`--strict` to fail; needs network) |
| `node scripts/audit-dashboard.cjs` | runtime card registry: duplicate ids, missing names/apply |
| `node scripts/test-import-roundtrip.js` | the real settings import path end-to-end in jsdom |
| `node scripts/test-regressions.js` | pins for every fix from the v1.1.7 review |
| `node scripts/harness-stability.js` | apply/teardown cycles for all 169 cards, a navigation storm and a bfcache restore, counting live timers, observers and listeners for growth |
| `node scripts/make-icon.cjs` | renders the brand mark; `--list` shows the designs, `--design` picks one, `--sheet-all` builds a size-contact sheet |

Suggested cadence: run `audit:keys` in CI (deterministic, no network), and
`audit:selectors` weekly or before a release, treating its output as a review
list rather than a hard failure.

## Versioning and release

`package.json` `version` is stamped into the bundle and `yourtube.meta.js` by the
build. Releases are tag-driven:

```bash
npm version 1.1.9 --no-git-tag-version   # bump
npm test                                  # gate
git commit -am "chore: release 1.1.9"
git push
git tag -a v1.1.9 -m "YourTube 1.1.9"
git push origin v1.1.9                    # release workflow publishes assets
```

`channel-health.yml` re-verifies weekly that the published assets match a rebuild
of the tagged tree.

## Runtime configuration sync (1.6.0)

Config writes flow `Ta/Oa → S (in-memory) → Y() debounce → U(): GM + localStorage mirror + IDB`,
then broadcast `cfg_update` on `BroadcastChannel("yourtube_cfg_sync")`. Every other open tab
receives the broadcast (or the `storage` event on the mirror key), runs `X()` and re-applies
only the features whose keys changed (`ka` key→cards map, teardown+apply). Convergence after
concurrent edits is deterministic: snapshots are ordered by `(__ver, __ts)`; on a same-version
collision the newer timestamp wins, exact ties break by canonical (sorted-key) JSON order, and
locally-edited keys newer than the winning snapshot are resurrected and rebroadcast at
`__ver+1`. A tab that slept through broadcasts re-checks on `visibilitychange`/`focus`/`pageshow(bfcache)`.
All dashboard input widgets subscribe to `cfg.changed`, so a dashboard open in another tab
re-renders its own controls instantly.

## SponsorBlock output surface & Trusted Types (1.7.0)

All Seekbar/HUD/chapter output lives in the `UI` module of `src/40-sponsorblock.js`
with symmetric teardown: `UI.clearMarks()` destroys seekbar marks, the time-with-skips
chip (`sbTimeWithSkips`, " (−m:ss)" after `.ytp-time-duration`), the chapter overlay
(`sbRenderChapters`, notch dividers on `.ytp-progress-list`, tooltip on
`.ytp-progress-bar-padding` — *never* inside `.ytp-progress-list`, which is
`overflow:hidden` natively), and the document-level `pointermove` capture handler.
`destroy()` calls `clearMarks()`, so disabling the card removes every mounted node.

Every `innerHTML` sink in the bundle routes through `Xy()` (`src/30-helpers.js`), a
single lazy `trustedTypes.createPolicy("yourtube", …)` pass-through. youtube.com enforces
`require-trusted-types-for 'script'`; a raw innerHTML assignment throws and — because the
skip-notice HUD was built that way — the throw previously prevented the actual skip on
first pass. `Whitelisting.isWhitelisted()` caches by
`videoId | sbDisable | whitelist-content`, so settings writes self-invalidate without a
feature re-init.

Engine exports additionally expose `debugInjectSegments` (editor/test aid that merges
synthetic segments — used by the chapter-overlay preview and `e2e/sb-live.js`),
`debugChipCalc`/`debugActions`/`debugTickInfo` observability hooks, surfaced under
`YourTube.sb.{debugInject, debugTick, debugActions, debugChipCalc, channelToken}`.

## Dashboard palettes (1.8.0)

The dashboard carries two palettes selected by `S.dashMode` (`"light"` default |
`"dark"`), applied as a `ytb-dark` class on the `.ytb-dash` aside. All Calm-block rules
consume CSS custom properties only; the palettes are two pure variable declarations
(`.ytb-dash{…}` light, `.ytb-dash.ytb-dark{…}` dark, later-in-sheet). The header ☾/☀
button writes via `Ta("dashMode", …)`; the aside also subscribes to `g.on("cfg.changed")`
so cross-tab writes repaint an already-open dashboard. When authoring new dashboard CSS:
reference vars (`--card`, `--ink2`, rgba(var(--accink),α)…) — never literal hexes — or the
rule will be light-only.
