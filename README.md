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
- The dashboard itself has a light and a dark mode, switched from its header.

**Feed and comments**

- Hide watched videos, filter by title or channel keywords, hide Shorts, live
  content, premieres, community posts, AI panels and mix shelves.
- Anti-Repeat Memory hides videos you have scrolled past before; low-view
  filtering, views-per-day badges, upload dates and result sorting for search.
- Subscriptions-Only Home, channel blocking, comment search, keyword filters,
  creator-reply highlighting, collapsing of long comments.

**Playback**

- Default and per-channel speed, loop, A/B repeat, quality preference, captions
  behavior, ad-skip, chapter jumping and skip-by-keyword.
- Mouse-wheel volume, seek and speed; volume boost with per-channel memory;
  loudness leveling; sticky live quality; wide player; Shorts speed and
  progress; auto-exit fullscreen.
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
- Calm Popups & Toasts carries the dashboard's design onto every floating
  surface: toasts, skip notices, resume prompts, gates and panels, in light
  and dark.
- Session history, bookmarks, study notes, subscription groups, watch Later
  helpers, playlist resume and shuffle.
- Watch-time statistics, weekly summary, budget overlay, Shorts limits and
  wind-down prompts.
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

`src/` holds twelve fragment modules concatenated in numeric order
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
