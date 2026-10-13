# YourTube

A client-side userscript that changes how YouTube looks and behaves: themes, feed
filtering, playback controls, SponsorBlock, and a settings dashboard with more
than 130 feature cards. Everything runs in your browser. There is no account, no
server, and no analytics.

Current version: **1.0.0**

---

## What it does

**Appearance**

- 200 built-in themes for light and dark mode, plus one-color custom themes
  generated from any accent color.
- A theme engine that rewrites YouTube's design tokens (backgrounds, text,
  chips, dialogs, player chrome, logo and toolbar icons) rather than patching
  individual elements.
- Text and icon colors are contrast-checked against every surface they appear on,
  and filled buttons pick their label color from the fill's measured luminance,
  so nothing becomes unreadable.
- Optional layout work: dense grid, compact spacing, decluttering of page
  elements, reading-size boost, and a night scheduler that swaps themes on a
  clock.

**Feed and comments**

- Hide or dim videos you have already watched; filter by title or channel
  keywords; hide Shorts across every surface; hide live content, premieres,
  auto-dubbed videos, and AI panels.
- Block channels by name or handle, including their comments, with an optional
  title-text match.
- Comment search, keyword filtering, collapsing of long comments, and
  highlighting of creator replies.

**Playback**

- Default speed, per-channel speed memory, loop, A/B segment repeat, quality
  preference, captions behavior, and ad-skip.
- Chapter tools: buttons, hotkeys, auto-skip by keyword, and progress markers.
- Quality-of-life extras: screenshot button, copy timestamp, transcript button,
  frame stepper, forward/rewind buttons, silence fast-forward, pause rewind,
  instant replay, sleep timer, and a playback performance overlay.

**SponsorBlock**

- Automatic skipping of sponsor, intro, outro, self-promotion, and filler
  segments, with per-category enable, action, and timeline visibility.
- Privacy-preserving lookups: the video ID is hashed (SHA-256) and only a
  four-character prefix is sent. Segment view reports are UUID-only.
- Submission editor, voting, VIP filtering, countdown before skipping, and
  "warn instead of skip" categories.

**Watching habits and local data**

- Session history with resume cards, timestamp bookmarks, study notes,
  per-channel volume, playlist resume points, and quick save to collections.
- Wellbeing tools: watch budget with a focus overlay, Shorts policy schedule,
  Shorts marathon guard, end-of-video wind-down, stretch reminders, and a
  session intention prompt.
- All of it is stored locally in IndexedDB, with a storage dashboard that shows
  what is kept and lets you trim it.

**Diagnostics**

- Activity monitor, feature performance tracker, FPS counter, buffer health,
  dropped-frame counter, data usage tracker, health check, and a settings
  dashboard with live search.

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
npm test                   # full gate: build, checks, audits, unit suites, boot harness
npm run audit:keys         # settings integrity: dead defaults, invisible settings, dead controls
npm run audit:selectors    # bit rot: YouTube tokens that no longer exist (needs network)
npm run audit:dashboard    # runtime card registry check
```

The build splices four readable source files into `yourtube.user.js` at anchor
comments. Anything outside those regions lives directly in the bundle.
`docs/ARCHITECTURE.md` has the region map, the apply/teardown contract that
feature cards must follow, and the release procedure.

The published userscript must be byte-identical to a rebuild from source; CI
enforces that on every push and tag, and a weekly workflow re-checks the
published release against a rebuild of its tag.

Releases are tag-driven:

```bash
npm version 1.0.1 --no-git-tag-version
npm test
git commit -am "release 1.0.1"
git tag -a v1.0.1 -m "YourTube 1.0.1"
git push && git push origin v1.0.1
```

---

## Project layout

```
yourtube.user.js        built userscript (the shipped artifact)
yourtube.meta.js        userscript metadata for update checks
src/resources.js        bounded caches, shared observers/tickers, resource scopes
src/sponsorblock.js     SponsorBlock engine (lookups, skipping, voting, editor)
src/ublock-filter.js    uBlock-style filter interpreter used by the channel blocker
src/engine.js           engine helpers, Discover, algorithm tools, newest feature cards
scripts/                build, checks, audits and test harnesses
docs/                   architecture notes and the pre-rebrand code review
```

---

## License

MIT. See `LICENSE`.
