# Dashboard control → runtime effect

These tests distinguish a mounted or checked control from a change in the current document. The public-site and fixture runners answer different questions. Neither an entry in `catalogue.json` nor a `data-key` change is a successful effect check.

## Requirements

Use a current Python 3, Playwright for Python, a Chromium browser and Node for `npm run build && npm run check && npm run verify`. For the real-site run, use a Chrome for Testing executable and the official unpacked Tampermonkey extension. It requires a display (or `xvfb-run -a`). Do not pass a personal profile or credentials.

## Offline browser contracts

```sh
python3 tests/live_controls/features.py --browser /usr/bin/chromium --workers 2 --out /tmp/yt-feature-results
python3 tests/live_controls/workbench.py --browser /usr/bin/chromium --out /tmp/yt-control-results
```

`features.py` seeds isolated prerequisites, opens the actual dashboard, locates the relevant card, and uses the visible master label, select, action or shortcut. It reads a page/player outcome. Reversible controls compare the new value with the initial value after switching back; where available, event-driven controls repeat an eligible stimulus after disabling. A case with only `offClicked: true` has **no independent off witness**. Route-changing actions need not stay in the same document. Test definitions are in `fixture/specs.py`, and off rules are in `off_witnesses.py`.

`workbench.py` opens isolated local documents, blocks external network traffic, mounts the full dashboard and operates attached controls via DOM click/input/change. It does not call `features.apply` to produce a measurement. `inventory` is **not a pass count**. The suites cover same-document dispatch, selected parameter combinations, Element Hider selector branches, cached SponsorBlock segments, and player actions. The A/B action test uses a decoded local video; simulated player APIs, seeded segments and constructed DOMs are explicitly not YouTube playback. Screenshot/export and account-adjacent cases are isolated or intercepted, not real account operations. Use `--select dispatch,sponsors` or another comma-separated subset to reproduce one group.

To compare a release, save its unmodified installer elsewhere and pass the **same** `--bundle /path/to/published.user.js` argument to both commands. Run the same test files on each version. Results contain the installer SHA-256; an identical version label does not imply identical bytes. Previously reported passes on other RCs are not substituted here.

## Installed on YouTube, signed out

```sh
python3 tests/live_controls/site.py \
  --chrome /path/to/chrome-for-testing --extension /path/to/official-tampermonkey \
  --out /tmp/yt-public-results --palettes --extra-surfaces
```

No page responses are replaced. The browser uses a disposable profile, allows userscripts and installs the exact staged installer through the manager UI. Public search/watch pages and optional channel/discovered playlist/Shorts links are checked. One masthead trial per surface uses a real pointer; other trials send events to mounted controls and measure the same native DOM node(s). The palette suite compares actual paint on YouTube's app and masthead and checks its reversal. The optional note test uses only local notes in the new profile. A native sign-in notice, a video at ready state zero, a missing or replaced target, an already-matching CSS value, and a non-distinct effect are not passing playback observations. DOM identity and the exact reporting field matter: a `loop` property is not a witnessed replay.

## Closing a playback gap

Where YouTube offers normal playback, enable only the candidate (disable duplicate YourTube installers) and open a public video in your own browser. Confirm decoded playback and an advancing playhead before testing. For example, change Playback Speed to 1.75×; compare the current player's rate and timestamp advance, then turn it off and check restoration, without reloading. For A/B Loop, set A and B at two real positions; witness playback crossing B and returning to A, then clear and witness it cross the old B without jumping back. For event-driven or destructive actions, test on disposable local data and check the next eligible event rather than expecting an old side effect to undo itself. Do not share account cookies or tokens.

`--reader-only` isolates Description Reader, records which native description owns the button, compares the opened text to the visible watch description, and checks removal of the reader and trigger.

### Focused public measurements

- `--playback-only` opens the normal public watch link. It requires the requested video ID, no visible playability error or advertisement, advancing playhead **and displayed frames** before testing. It compares wall-clock rate and frames at multiple settings, actual seek destinations and pauses, a natural crossing of the A/B boundary, clear/off followed by another crossing, and Stop. A blocked page is not a pass. `--playback-only --playback-focus pointer-wheel` additionally uses trusted mouse input on the video and scrubber with the dashboard closed; its OFF comparison repeats both wheel gestures. These jobs should run one browser at a time to avoid starving the decoder. On the five-route run, the Shorts probe also requires the offered active Short to be decoding before testing.
- `--shell-only` uses a newly installed disposable profile on public search; checks the exact key text written to the browser clipboard for each standard card and the visible results of category navigation and notification settings. This is dashboard behavior, not playback coverage; clipboard permission applies only to the fresh test context.
- The offline `shell` suite also exercises a real settings download, file chooser, re-import and restoration on an existing comments node, reset confirmation/cancellation, docking and closing. `bundles` measures an existing themed card’s margin when the Compact Layout group or its member is operated. It checks both original spacing and pre-existing compact spacing on OFF.
