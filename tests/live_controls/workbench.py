"""UI-to-effect contract tests. All HTTP traffic is fulfilled locally or denied.
Only initial prerequisites use storage. Test stimuli operate the mounted dashboard;
no test calls apply(), setCfg(), or a private feature callback to produce a result.
"""

import argparse, hashlib, json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

D = Path(__file__).resolve().parent
sys.path.insert(0, str(D / "fixture"))
from specs import player

URL = "https://www.youtube.com"


def serve_media(route):
    import re

    buf = (D / "fixture/media.webm").read_bytes()
    match = re.fullmatch(r"bytes=(\d+)-(\d*)", route.request.headers.get("range", ""))
    headers = {"Accept-Ranges": "bytes"}
    start, end = 0, len(buf) - 1
    if match:
        start = int(match[1])
        end = min(end, int(match[2]) if match[2] else end)
        headers["Content-Range"] = f"bytes {start}-{end}/{len(buf)}"
    return route.fulfill(
        body=buf[start : end + 1], content_type="video/webm", status=206 if match else 200, headers=headers
    )


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--bundle", type=Path, default=D.parents[1] / "yourtube.user.js")
    ap.add_argument("--browser", default="/usr/bin/chromium")
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--select", default="inventory,dispatch,elements,options,sponsors,player_actions,shell,bundles,local_feed,retired,feed_race,theme_schedule")
    a = ap.parse_args()
    a.out.mkdir(exist_ok=True, parents=True)
    bundle = a.bundle.read_bytes()
    reg = json.loads((D / "catalogue.json").read_text())
    seeds = {f["master"]: False for f in reg if f["master"]}
    seeds.update(
        autoPauseMode="off",
        highlightVideoLengthMode="off",
        feedWatchedMode="off",
        resumeBarStyle="default",
        defaultChannelTab="featured",
        channelLandingTab="home",
        channelBannerMode="default",
        safeMode=True,
        themeSelected="none",
        perfModeAuto=False,
        stripResumeTimesOn=False,
        algoAutoTrain=False,
        forceWatchedAccountHistory=False,
        hideShortsRedirect=False,
        hideShortsApiFilter=False,
        hideShortsDomClean=False,
        sessionResumeMode="record",
        speedDefault=1.75,
        perfLevelSyncedFor="balanced",
        elementsControlHidden={},
    )
    html = '<!doctype html><meta charset=utf-8><style>body{font:20px system-ui}ytd-app,ytd-video-renderer,ytd-rich-item-renderer,yt-lockup-view-model{display:block}#player-theater-container{height:210px}#movie_player{position:relative;width:510px}ytd-thumbnail,ytd-rich-item-renderer{display:inline-block;min-width:42px;width:42px}ytd-watch-flexy{--ytd-watch-flexy-min-player-height:210px}</style><ytd-app><div id="stage"></div><div id="target"></div></ytd-app><script src="/bundle.js"></script>'
    failures = []
    with sync_playwright() as w:
        b = w.chromium.launch(
            executable_path=a.browser,
            args=[
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--autoplay-policy=no-user-gesture-required",
                "--proxy-server=127.0.0.1:9",
                "--proxy-bypass-list=<-loopback>",
            ],
        )
        for suite in a.select.split(","):
            c = b.new_context(service_workers="block", viewport={"width": 1250, "height": 830})
            if suite == "shell":
                c.grant_permissions(["clipboard-read", "clipboard-write"], origin=URL)
            p = c.new_page()
            p.set_default_timeout(11000)
            errors = []
            p.on("pageerror", lambda e: errors.append(str(e)[:200]))
            c.route(
                "**/*",
                lambda r: (
                    r.fulfill(body=bundle, content_type="application/javascript;charset=utf-8")
                    if r.request.url == URL + "/bundle.js"
                    else (
                        serve_media(r)
                        if r.request.url == URL + "/audit/media.webm"
                        else (
                            r.fulfill(body=html, content_type="text/html;charset=utf-8")
                            if r.request.is_navigation_request() and r.request.url.startswith(URL + "/")
                            else r.abort()
                        )
                    )
                ),
            )
            # Simulate an upgrade with legacy account automation enabled. The
            # new local-only implementation must ignore, not erase, those keys.
            if suite == "local_feed":
                seeds.update(algoAutoLikeOn=True, algoAutoDislikeOn=True, algoBoostOn=True,
                             algoDiversityOn=True, algoShortsOn=True, algoAutoTrain=False)
            if suite == "retired":
                seeds.update(watchBudgetOn=True, credLayerOn=True, screenWakeOn=True)
            requests = []
            p.on("request", lambda req: requests.append(req.url) if "/youtubei/" in req.url else None)
            p.add_init_script(
                'localStorage.setItem("yourtube.cfg",'
                + json.dumps(json.dumps(seeds))
                + ');addEventListener("yourtube:applied",()=>window.booted=true)'
            )
            p.goto(URL + "/audit")
            p.wait_for_function("window.booted")
            p.evaluate("YourTube.openDashboard()")
            p.wait_for_function(
                "()=>document.querySelectorAll('.ytb-card').length===YourTube.features.list().length"
            )
            p.evaluate((D / "workbench.js").read_text())
            p.evaluate("h=>window.labPlayer=h", player.replace('src="/audit/media.webm"', ""))
            p.evaluate("d=>window.targets=d", json.loads((D / "elements.json").read_text()))
            res = {
                "suite": suite,
                "bundleSha256": hashlib.sha256(bundle).hexdigest(),
                "browser": b.version,
                "source": "actual mounted dashboard in a network-denied Chromium fixture",
            }
            try:
                data = p.evaluate((D / (suite + ".js")).read_text())
                if suite == "shell":
                    from shell_io import run

                    data.extend(run(p))
                if suite == "local_feed":
                    data.append({"id":"algo-intelligence", "key":"network-safety",
                                 "description":"No YouTube internal API requests despite enabled legacy account settings",
                                 "requests":requests, "pass":not requests})
                res["results"] = data
                if suite != "inventory":
                    bad = [x for x in data if x.get("pass") != True]
                    print(suite, len(data) - len(bad), "/", len(data), flush=True)
                    failures += bad
                else:
                    print("inventory:", len(data), "cards and shell", flush=True)
            except Exception as e:
                res["error"] = str(e)
                failures.append({"suite": suite, "error": str(e)})
                print(suite, str(e)[:300], flush=True)
            res["pageErrors"] = errors[:8]
            (a.out / (suite + ".json")).write_text(json.dumps(res, indent=1, ensure_ascii=False) + "\n")
            c.close()
        b.close()
    if failures:
        print("First failures:", str(failures[:4])[:1000])
        sys.exit(1)


if __name__ == "__main__":
    main()
