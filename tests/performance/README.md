# Controlled fixture comparison

`compare_fixture.py` alternates fresh Chromium processes for two userscript
builds and records repeated observations on the same synthetic 150-card search
page. It measures initial navigation, opening the dashboard, searching its
controls, two animation frames after a simulated SPA navigation, CDP renderer
task time and JS heap, summed Chromium-process CPU and RSS, and locally served
and blocked request counts/bytes. All external requests are denied.

```sh
git show origin/main:yourtube.user.js > /tmp/yourtube-baseline.user.js
python tests/performance/compare_fixture.py \
  --baseline /tmp/yourtube-baseline.user.js --candidate yourtube.user.js \
  --browser /path/to/chromium --rounds 10 --out /tmp/comparison.json
```

The baseline and candidate SHA-256 hashes, individual samples and medians are
saved in the JSON. The fixture uses matching settings and alternates order, but
results depend on the machine, browser, cache and timing. RSS sums process
resident sets and can double-count shared memory; CPU is process-accounting
across Chromium's changing process set. Script transfer bytes are served from
local interception, not actual network traffic. This does not measure video
playback, a real YouTube page, a signed-in account, real external traffic or
representative user behavior. Do not extrapolate it into claims of real-world
performance savings.

## Signed-out live search

`compare_live_search.py` uses the same metrics on a real public YouTube search,
with a new signed-out browser profile and direct userscript injection for every
sample. It makes real network requests and records CDP request counts and
encoded bytes for completed requests. For example, replace the command above
with `compare_live_search.py` and use `--rounds 3`.

YouTube can return different recommendations, video counts, experiments or
verification gates for each run. The script records errors instead of silently
dropping failed samples, and exits nonzero if any sample fails. Network totals
and timings in unequal responses cannot establish the userscript's real-world
impact; this does not measure authenticated playback or account history. Never
run the script with a personal browser profile.
