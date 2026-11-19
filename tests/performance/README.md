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
