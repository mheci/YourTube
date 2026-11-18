<p align="center">
  <img src="icon.png" alt="YourTube icon" width="96" height="96">
</p>

# YourTube

A client-side userscript that changes how YouTube looks and behaves: 200 themes,
feed and comment filtering, playback tools, SponsorBlock integration, and a
settings dashboard with 160+ feature cards. Everything runs in your browser.
There is no account, no server, and no analytics.

Latest release: [github.com/mheci/YourTube/releases](https://github.com/mheci/YourTube/releases)

---

## What it does

**Appearance**

- 200 built-in themes, 100 dark and 100 light, plus custom one-color themes
  generated from any accent.
- A theme engine that rewrites YouTube's design tokens rather than patching
  individual elements; text and icon colors are contrast-checked against every
  surface they sit on.
- The dashboard itself has a light and a dark mode, plus a Classic option and 20
  switchable visual looks (Swiss, terminal, pixel, noir and the rest), chosen
  from its header and remembered locally.
- Static header, unclamped titles, fixed player heights, a custom description
  width and fixed thumbnail sizes for search, the watch sidebar and channel
  grids, each behind its own toggle.

**Feed and comments**

- Hide watched videos, filter by title or channel keywords, hide Shorts, live
  content, premieres, community posts, AI panels and mix shelves.
- Anti-Repeat Memory hides videos you have scrolled past before; low-view
  filtering, views-per-day badges, exact upload dates, upload dates estimated
  from card metadata and result sorting for search.
- Exact Upload Dates asks YouTube's own player endpoint for the real date, then
  renders it on cards and watch pages in a format you choose (default
  `yyyy-MM-dd`); the relative date can be kept before or after it.
- Subscriptions-Only Home, channel blocking, comment search, keyword filters,
  creator-reply highlighting, collapsing of long comments.

**Playback**

- Default and per-channel speed, loop, A/B repeat, quality preference, captions
  behavior, ad-skip, chapter jumping and skip-by-keyword.
- Mouse-wheel volume, seek and speed; volume boost with per-channel memory;
  loudness leveling; sticky live quality; wide player; Shorts speed and
  progress; auto-exit fullscreen.
- Hide the transcript or description side panel, the double-tap overlay, and
  Shorts shelves around a video.
- Screenshot button, copy timestamp, transcript copy and download, frame
  stepper, silence fast-forward, instant replay, sleep timer.

**SponsorBlock**

- Automatic skip, mute or countdown for sponsor, intro, outro, self-promotion
  and filler segments; colored markers on the seekbar; chapter markers with a
  hover tooltip; a chip next to the duration showing time saved.
- Submission editor, voting, whitelist per channel, per-category actions and a
  keybind set.
- Lookups send only a SHA-256 prefix of the video ID; view reports are
  UUID-only.

**Integrations, data and wellbeing**

- Return YouTube Dislike counts and ratio bar; DeArrow community titles and
  thumbnails; live chat cleanup. Both external integrations are off by default.
- Block Player Enhancements force-disables YouTube's own player extras:
  Ambient Mode glow, Stable Volume (dynamic range compression) and Voice
  Boost, each toggled individually.
- Calm Popups & Toasts styles toasts, skip notices and related panels. The
  Session History prompt has its own three player-mounted designs.
- Session history, bookmarks, study notes, subscription groups, watch Later
  helpers, playlist resume and shuffle.
- Watch-time statistics, weekly summary, budget overlay, Shorts limits and
  wind-down prompts.
- Channel banner scroll or hide, and a preferred landing tab for channel links.
- Resume timestamps can be stripped from page links, with the red resume bar
  optionally widened or hidden.
- Everything is stored locally in IndexedDB and exportable.

---

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) or
   [Violentmonkey](https://violentmonkey.github.io/).
2. Open the latest release and click `yourtube.user.js`.
3. Open YouTube. YourTube appears in the guide menu.

Updates arrive through the release channel (`@updateURL` reads
`yourtube.meta.js` from the latest release, `@downloadURL` serves the
userscript). Keep auto-updates enabled.

---

## Settings

Open the dashboard from the guide menu, the player button or the keyboard
shortcut. Changes apply immediately; nothing needs a reload. Settings export to
a file and import back.

### Session History (private 1.12.5-rc.3 candidate)

Turn on **Session History** and select **Pause and ask**. Watch past five seconds,
pause and leave the video, then reopen its ordinary watch URL. **Resume at …**
restores the saved position; **Start fresh** goes to zero without deleting notes,
pins or previous visits. Escape or **Minimize** folds the prompt; neither is a
playback choice. Choose **Folio**, **Signal** or **Dock** in the same card.

A new or completed video plays normally. **Record only** leaves playback to
YouTube; an explicit timestamp (including `t=0`) also takes precedence. Ads,
live streams, previews and native unavailability notices are not resume targets.
An unreadable history lookup releases playback without overwriting an unknown
save; an already-known stopping point has no automatic timeout. If a browser
requires another playback gesture, use the **Play at …** button.

The journal lives in this browser's existing history database. Search by title or
channel, filter, pin, follow a timestamp, or export/import a local JSON backup.
Removal and clearing require confirmation. This journal is separate from your
YouTube account's history and the Session Replay diagnostic feature. The regular
public release is not changed by this private candidate.

Two settings deserve a note:

- **Force Watched** and **Algorithm Intelligence** send synthetic watch signals
  to YouTube. They are off by default and stay off until you acknowledge an
  on-screen notice.
- **Privacy mode** for SponsorBlock is on by default. Turning it off sends the
  plain video ID to the SponsorBlock server.

---

## Network use

| Feature | Destination | Data sent |
|---|---|---|
| SponsorBlock lookups | `sponsor.ajay.app` | SHA-256 prefix of the video ID (default), or the video ID with privacy mode off |
| Segment view reports | `sponsor.ajay.app` | Segment UUID only |
| DeArrow | `sponsor.ajay.app`, `dearrow-thumb.ajay.app` | Video ID, cached twelve hours |
| Return YouTube Dislike | `returnyoutubedislikeapi.com` | Video ID, cached six hours |
| Exact Upload Dates | `www.youtube.com` | Video ID to YouTube's player endpoint, only when the feature is on |
| Force Watched / Algorithm Intelligence | `www.youtube.com`, `s.youtube.com` | Synthetic watch signals, only after you acknowledge the notice |
| Update checks | `github.com` | Nothing; reads the release metadata |

The manager fetches two libraries from `cdn.jsdelivr.net` (lz-string, culori)
and the icon from `raw.githubusercontent.com` at install or update time. The
script makes no runtime request to either host. There is no telemetry.

---

## Compatibility

Desktop `www.youtube.com` is the target; `m.youtube.com` and
`music.youtube.com` are matched for themes and generic features. YouTube churns
its markup regularly; the script degrades gracefully when a selector stops
matching.

---

## Development

```bash
npm ci            # toolchain-free: packaging only, no runtime dependencies
npm run build     # assemble src/ -> yourtube.user.js + yourtube.meta.js
npm run check     # static gate: syntax of bundle, meta and scripts; theme table
npm run verify    # rebuild and compare sha256 against the committed bundle
```

Bun 1.4 or newer can run the same scripts faster: `bun scripts/build-userscript.js`, `bun scripts/check.js`, and `bun scripts/verify-bundle.js`.

The Quality workflow runs offline Chromium regressions against the assembled bundle.
`tests/guide_overlay.py` checks the original guide-paint regression;
`tests/guide_all_themes.py` covers every built-in palette, all four overhaul flag
pairs, and closed, modal and persistent guides. `tests/feature_effects.py` checks
native controls, sort order, teardown, locale-cookie preservation, privacy and
same-document navigation. These fixtures do not contact YouTube or mutate an account.
Install the test-only Playwright driver in a virtual environment and run, for example,
`python tests/feature_effects.py --browser /path/to/chromium`.

`src/` holds numbered fragment modules concatenated in numeric order
(`00-header` through `90-boot`). The shipped userscript must be byte-identical
to a rebuild from source: CI enforces that on every push and tag, and a weekly
workflow rebuilds the tagged release and compares hashes against what the
update channel serves.

Releases are tag-driven: bump `package.json`, build, verify, commit, tag
`v<version>`, push. `release.yml` publishes `yourtube.user.js` and
`yourtube.meta.js` as release assets, which is exactly what the updater reads.

---

## License

MIT. See `LICENSE`.
