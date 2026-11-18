"""Optional signed-out watch-page smoke test; use ONLY a disposable Tampermonkey profile.
Seeds one synthetic local checkpoint. Does not sign in or attempt to get past site prompts.
The offline suite in watch_sessions.py is the reproducible playback test.
"""

import argparse
import json
import time
from pathlib import Path
from playwright.sync_api import sync_playwright


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    for name in ("browser", "disposable-profile", "out"):
        ap.add_argument("--" + name, required=True)
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    film = "YE7VzlLtp-4"  # Public Blender Foundation watch page.
    url = "https://www.youtube.com/watch?v=" + film
    evidence = {
        "url": url,
        "source": "unmodified signed-out YouTube watch document; installed manager",
        "seedSeconds": 73,
        "sitePlaybackVerified": False,
    }
    with sync_playwright() as pw:
        c = pw.chromium.launch_persistent_context(
            args.disposable_profile,
            executable_path=args.browser,
            headless=False,
            chromium_sandbox=True,
            viewport={"width": 1280, "height": 880},
            locale="en-US",
            ignore_default_args=[
                "--disable-extensions",
                "--disable-component-extensions-with-background-pages",
            ],
            args=["--disable-dev-shm-usage", "--renderer-process-limit=2"],
        )
        try:
            p = c.new_page()
            p.set_default_timeout(12500)

            def doc():
                p.goto(url, wait_until="domcontentloaded", timeout=40000)
                p.wait_for_function("()=>!!window.YourTube?.history", timeout=18000)

            def observed():
                return p.evaluate(
                    """()=>{const v=document.querySelector('#movie_player video'),s=window.YourTube.history.recorderState();return {phase:s.phase,held:s.held,overlay:!!document.querySelector('#yourtube-checkpoint'),paused:v?.paused??null,readyState:v?.readyState??null,seconds:v?.currentTime??null,duration:Number.isFinite(v?.duration)?v.duration:null,nativeNotice:[...document.querySelectorAll('yt-playability-error-supported-renderers,.ytp-error-content-wrap')].filter(n=>n.getClientRects().length).map(n=>n.innerText.trim()).filter(Boolean).join(' / ').slice(0,350)}}"""
                )

            doc()
            evidence["version"] = p.evaluate("YourTube.version")
            evidence["browser"] = c.browser.version
            p.evaluate(
                'YourTube.setCfgMany({sessionRestoreOn:true,sessionResumeMode:"ask",sessionResumeDesign:"folio",stripResumeTimesOn:false,forceWatchedAccountHistory:false,sponsorblockOn:false,dearrowOn:false,updateCheckOn:false})'
            )
            p.evaluate(
                "async r=>{await YourTube.history.del(r.videoId);await YourTube.history.put(r)}",
                {
                    "videoId": film,
                    "title": "Big Buck Bunny · test checkpoint",
                    "lastPosition": 73,
                    "lastWatched": int(time.time() * 1000),
                    "duration": 596,
                    "progress": 12,
                    "watchCount": 1,
                    "completed": False,
                    "sessions": [],
                },
            )
            p.wait_for_timeout(900)
            doc()
            try:
                p.wait_for_function(
                    "()=>document.querySelector('#movie_player video')?.readyState>=2||[...document.querySelectorAll('yt-playability-error-supported-renderers,.ytp-error-content-wrap')].some(n=>n.getClientRects().length&&n.innerText.trim())",
                    timeout=16000,
                )
            except Exception:
                pass
            p.wait_for_timeout(1100)
            evidence["watchPage"] = obs = observed()
            p.screenshot(path=out / "site-watch.jpg", type="jpeg", quality=78)
            if obs["nativeNotice"]:
                evidence["interpretation"] = (
                    "Native site notice left alone. No live decoded playback claim."
                )
            elif obs["overlay"] and obs["readyState"] >= 2:
                p.locator("#yourtube-checkpoint [data-action=resume]").click()
                try:
                    p.wait_for_function(
                        "()=>{const v=document.querySelector('#movie_player video');return !v.paused&&v.currentTime>73.4}",
                        timeout=9000,
                    )
                    evidence["afterChoice"] = observed()
                    evidence["sitePlaybackVerified"] = True
                except Exception:
                    evidence["afterChoice"] = observed()
            else:
                evidence["interpretation"] = (
                    "No ready, held live-site media; playback not established."
                )
            p.evaluate("YourTube.openDashboard()")
            box = p.locator(".ytb-search").first
            box.fill("Session History")
            card = p.locator('.ytb-card[data-feat="session-restore"]')
            panel = card.locator(".ytb-watch-journal")
            panel.locator(".name").filter(has_text="Big Buck Bunny").wait_for(
                timeout=12000
            )
            card.scroll_into_view_if_needed()
            evidence["dashboard"] = {
                "title": card.locator(".ytb-name").inner_text(),
                "seedShown": True,
                "journalVisible": panel.is_visible(),
            }
            p.screenshot(path=out / "site-dashboard.jpg", type="jpeg", quality=80)
        except Exception as ex:
            evidence["limit"] = str(ex).split("Call log:")[0][:420]
        finally:
            c.close()
    (out / "observations.json").write_text(json.dumps(evidence, indent=2) + "\n")
    print(json.dumps(evidence, indent=2))


if __name__ == "__main__":
    main()
