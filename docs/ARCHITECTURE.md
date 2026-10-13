# YourTube architecture

This is the map you want before editing `yourtube.user.js`. It documents how the
1.2 MB bundle is assembled, which parts have readable sources, and which audit
scripts exist to catch the failure modes this codebase is prone to.

## Build model

```
src/resources.js            ─┐
src/sponsorblock.js    │   spliced into the bundle by
src/ublock-filter.js      │   scripts/build-userscript.js
src/engine.js            ─┘   (anchor-based, in place)
yourtube.user.js  ── splice ──►  yourtube.user.js   (artifact = source of truth)
```

`npm run build` **rewrites `yourtube.user.js` in place**: for each of the four
mirrors it replaces everything between a start anchor comment and an end marker
with the current file content. The rest of the bundle (≈23k lines of
hand-minified code) has no mirror and is edited directly.

Consequences worth remembering:

- Editing anything in the **generated regions** must be done in `src/`, or the
  next `npm run build` silently reverts it. (This happened during the v1.1.7
  review work; the `scripts/test-regressions.js` pins caught it.)
- Editing the bundle elsewhere is fine; `npm test` runs `build` first and the
  release/quality workflows fail if a rebuild produces a diff
  (`git diff --exit-code -- yourtube.user.js`), which proves the artifact matches
  its sources.

## Region map of `yourtube.user.js`

Line numbers drift; the anchors are stable. Use the anchor text, not the numbers.

| Region | Start anchor | End marker | Source |
|---|---|---|---|
| Bootstrap, kill switch, storage, nav, config, registry, apply pipeline | `(() => {` (line 37) | `//  YourTubeResources` | bundle only |
| Resource primitives | `//  YourTubeResources — bounded, disposable, visibility-aware resource primitives` | `const oe = {` | `src/resources.js` |
| Metadata/oEmbed/history helpers, kill switch helpers | `const oe = {` | `//  SponsorBlock Engine v2 (YourTube)` | bundle only |
| SponsorBlock engine | `//  SponsorBlock Engine v2 (YourTube)` | `let St_seekbarMarks` | `src/sponsorblock.js` |
| Force-Watched engine, config state, feature registry, most feature cards | `let St_seekbarMarks` | `//  uBlock Filter Interpreter Engine` | bundle only |
| uBlock filter interpreter | `//  uBlock Filter Interpreter Engine` | `function Cb_norm(e) {` | `src/ublock-filter.js` |
| Feed/theme/player/settings cards, dashboard UI, toast, config import/export | `function Cb_norm(e) {` | `//  YourTubeEngine Ecosystem v3.0` | bundle only |
| YourTubeEngine v3 (engine helpers, Discover, Algo, YourTubePack, newest cards) | `//  YourTubeEngine Ecosystem v3.0` | `(async function () {` | `src/engine.js` |
| Boot sequence, menu commands, hotkeys, unload hooks, watchdog | `(async function () {` (near the end) | end of file | bundle only |

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
