<p align="center">
  <img src="icon.png" alt="YourTube icon" width="96" height="96">
</p>

# YourTube

A client-side userscript that changes how YouTube looks and behaves: themes, feed
filtering, playback controls, SponsorBlock, and a settings dashboard with 169
feature cards. Everything runs in your browser. There is no account, no server,
and no analytics.

Latest release: [github.com/mheci/YourTube/releases](https://github.com/mheci/YourTube/releases)

---

## What it does

**Appearance**

- 200 built-in themes — 100 dark, 100 light — plus one-color custom themes
  generated from any accent color.
- A theme engine that rewrites YouTube's design tokens (backgrounds, text,
  chips, dialogs, player chrome, logo and toolbar icons) rather than patching
  individual elements.
- Text and icon colors are contrast-checked against every surface they appear on,
  and filled buttons pick their label color from the fill's measured luminance,
  so nothing becomes unreadable.
- Optional layout work: dense grid, compact spacing, decluttering of page
  elements, reading-size boost, restoring the subscriber count the 2026 watch
  page dropped, and a night scheduler that swaps themes on a clock.

**Feed and comments**

- Hide or dim videos you have already watched; filter by title or channel
  keywords; hide Shorts across every surface; hide live content, premieres,
  auto-dubbed videos, AI panels and the Ask pill, community posts and
  mix/radio shelves.
- Anti-Repeat Memory records the videos your feeds render and hides the ones you
  have scrolled past before, with a configurable grace period and forget window.
- Hide low-view videos below a threshold, show views-per-day and upload dates on
  cards, sort the results already on the page by date, views or length, and strip
  the related-search filler sections.
- Subscriptions-Only Home hides the recommendation feed, or sends the front page
  straight to your subscriptions.
- Block channels by name or handle, including their comments, with an optional
  title-text match.
- Comment search, keyword filtering, collapsing of long comments, and
  highlighting of creator replies.

**Playback**

- Default speed, per-channel speed memory, loop, A/B segment repeat, quality
  preference, captions behavior, and ad-skip.
- Optional player cleanups: remove the dark edge gradient and the up-next
  overlay.
- Mouse-wheel volume, seek and speed control; volume boost up to 300% with
  optional per-channel memory; loudness leveling; sticky quality during
  livestreams; wide player mode; auto-exit fullscreen when a video ends.
- Chapter tools: buttons, hotkeys, auto-skip by keyword, and progress markers.
- Shorts: playback speed and an optional progress bar.
- Quality-of-life extras: screenshot button, copy timestamp, transcript button,
  frame stepper, forward/rewind buttons, silence fast-forward, pause rewind,
  instant replay, sleep timer, and a playback performance overlay.

**Integrations**

- **SponsorBlock** — automatic skipping of sponsor, intro, outro, self-promotion
  and filler segments, with per-category enable, action and timeline visibility,
  a submission editor, voting and VIP filtering. Lookups send only a SHA-256
  prefix of the video ID; view reports are UUID-only.
- **Return YouTube Dislike** — dislike counts and a like/dislike ratio bar.
- **DeArrow** — community titles for the watch page and community thumbnails for
  cards, with a one-click way back to the original title.
- Live chat cleanup: hide superchats and membership messages, or compact the
  message layout.

**Watching habits and local data**

- Session history with resume cards, timestamp bookmarks, study notes,
  per-channel volume, playlist resume points, and quick save to collections.
- Watch-time statistics (totals, top channels, recent days) and a weekly summary,
  both built from the local history store.
- Subscription groups: local channel folders that can filter the subscriptions
  feed.
- Watch Later helpers (hide watched, copy the rest, sort by duration), session
  shuffle for playlists, and a random video picker.
- Export watch history (JSON or CSV), notes and bookmarks, the current playlist,
  and your subscription list.
- Wellbeing tools: watch budget with a focus overlay, Shorts policy schedule,
  Shorts marathon guard, end-of-video wind-down, stretch reminders, and a
  session intention prompt.
- All of it is stored locally in IndexedDB, with a storage dashboard that shows
  what is kept and lets you trim it.

**Diagnostics**

- Activity monitor, feature performance tracker, FPS counter, buffer health,
  dropped-frame counter, data usage tracker, health check, transcript tools,
  notification limiting, a tabbed watch page, and a settings dashboard with live
  search. Keyboard shortcuts can be rebound.

---

## Install

1. Install a userscript manager:
   [Tampermonkey](https://www.tampermonkey.net/) or
   [Violentmonkey](https://violentmonkey.github.io/).
2. Open the latest release and click `yourtube.user.js`. Your manager will offer
   to install it.
3. Open YouTube. The YourTube entry appears in the guide menu.

Updates are delivered through the release channel. Keep auto-updates enabled.

The script requests `@inject-into content` and `@sandbox JavaScript` so it keeps
working on cold page loads where YouTube's CSP would block page-context
injection.

---

## Settings

Open the dashboard from the guide menu entry, from the YourTube button on the
player, or with the keyboard shortcut. Settings apply immediately; nothing needs
a reload. The dashboard has live search, and settings can be exported to a file
and imported again.

Two settings deserve a note:

- **Force Watched** and **Algorithm Intelligence** send synthetic watch signals
  to YouTube. They are off by default and will not run until you acknowledge an
  on-screen notice.
- **Privacy mode** for SponsorBlock is on by default. Turning it off sends the
  plain video ID to the SponsorBlock server, which is faster but less private.

---

## Network use

YourTube is client-side, but four features use the network:

| Feature | Destination | Data sent |
|---|---|---|
| SponsorBlock lookups | `sponsor.ajay.app` | SHA-256 prefix of the video ID (privacy mode, default) or the video ID if you disable privacy mode |
| Segment view reports | `sponsor.ajay.app` | Segment UUID only |
| DeArrow titles and thumbnails | `sponsor.ajay.app`, `dearrow-thumb.ajay.app` | Video ID (title and thumbnail lookups, cached for twelve hours) |
| Return YouTube Dislike | `returnyoutubedislikeapi.com` | Video ID (one request per video, cached for six hours) |
| Update checks | `github.com` | Nothing; it reads the release metadata file |

DeArrow and Return YouTube Dislike are off by default. Everything else stays in
your browser: there is no telemetry, and no data is sent to the project.

The userscript manager itself fetches two small libraries from
`cdn.jsdelivr.net` (lz-string and culori) and the script icon from
`raw.githubusercontent.com` when it installs or updates YourTube. The script
makes no runtime request to either host.

---

## Compatibility

The script targets **desktop `www.youtube.com`**; the feature cards are written
against YouTube's desktop component tree. `m.youtube.com` and
`music.youtube.com` are still matched so themes and a few generic features work
there, but most cards will find nothing to do on those hosts.

YouTube changes its markup regularly. The script degrades gracefully when a
selector no longer matches, and `npm run audit:selectors` reports which tokens no
longer exist so they can be fixed.

---

## Development

```bash
npm ci                     # toolchain (jsdom for the test harnesses)
npm run build              # rebuild yourtube.user.js from the src/ mirrors
npm test                   # full gate: build, checks, audits, unit suites, boot and stability harnesses
npm run audit:keys         # settings integrity: dead defaults, invisible settings, dead controls
npm run audit:selectors    # bit rot: YouTube tokens that no longer exist (needs network)
npm run audit:dashboard    # runtime card registry check
```

The build splices four readable source files into `yourtube.user.js` at anchor
comments. Anything outside those regions lives directly in the bundle.
`docs/ARCHITECTURE.md` has the region map, the apply/teardown contract that
feature cards must follow, and the release procedure.

The gate includes a stability harness that toggles every feature on and off
twice, replays a navigation storm and a bfcache restore, and fails if timers,
observers, listeners or card DOM state grow between passes.

The published userscript must be byte-identical to a rebuild from source; CI
enforces that on every push and tag, and a weekly workflow re-checks the
published release against a rebuild of its tag.

Releases are tag-driven:

```bash
npm version <version> --no-git-tag-version
npm test
git commit -am "release <version>"
git tag -a v<version> -m "YourTube <version>"
git push && git push origin v<version>
```

---

## Project layout

```
yourtube.user.js        built userscript (the shipped artifact, byte-deterministic)
yourtube.meta.js        userscript metadata for update checks
src/                    12 fragment modules, concatenated in numeric order:
  00-header             userscript metadata block
  10-bootstrap          bootstrap, storage, defaults/coercion, update check
  20-resources          bounded caches, shared observers/tickers, resource scopes
  30-helpers            metadata/oEmbed/history helpers, toasts
  40-sponsorblock       SponsorBlock engine (lookups, skipping, voting, editor)
  50-core-cards         Force-Watched, config state, registry, core cards
  55-ublock             uBlock-style filter interpreter (channel blocker)
  60-cards-feed         feed/comment/player cards (filters, watch tools)
  70-theme              Theme Engine (201 themes), scheduler
  75-dashboard          settings dashboard, import/export, presets
  80-engine             engine helpers, Discover, Algo, aio-* enrolment, newest cards
  90-boot               boot sequence, menu commands, hotkeys, watchdog
scripts/                build, checks, audits and test harnesses (see below)
docs/                   architecture notes and the pre-rebrand code review
REPORT.md               the 1.3.0 full audit, fix log and verification record
```

## Toolchain (1.3.0)

```
npm install             # one-time: jsdom for the harnesses
npm run build           # assemble src/ -> yourtube.user.js + yourtube.meta.js
npm test                # build + syntax/xray/release checks + dashboard/dead-code
                        # audits + 13 unit suites + jsdom boot/stability +
                        # sha256 determinism verify
npm run audit:selectors # weekly selector-freshness audit vs live desktop+mobile YouTube
npm run test:e2e        # live-YouTube Playwright suite (needs chromium)
```

Highlights of the test wall:
- `test-privacy-gate` proves the Maximum-privacy preset blocks every
  script-initiated network call at runtime (with a negative control proving the
  harness actually exercises the network path).
- `test-leak-bisect` toggles the historically leakiest cards on/off in jsdom
  and pins their leftovers at zero.
- `test-config-schema` guarantees the defaults table has no duplicate keys and
  the prototype-pollution guards survive every edit.

---

## License

MIT. See `LICENSE`.
