#!/usr/bin/env python3
"""Run Checkpoint against a ranged local WebM and real Chromium IndexedDB. All page
requests are fulfilled here or denied. --profile requires an enabled, matching script
in a CLOSED disposable Tampermonkey profile. Never use a personal browser profile.
Pass --baseline to demonstrate the former 30-second unsolicited unlock on RC2.
"""

import argparse, json, re, time, hashlib, traceback
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
LAB = ROOT / "tests/checkpoint_lab"
ORIGIN = "https://www.youtube.com"
A = "FieldFilm01"
B = "FieldFilm02"
C = "FieldFilm03"
NATIVE = "window.fieldNative"
ID = "dhdgffkkebhmkfjojejmpbldmpobfkfo"
BASE = {
    "sessionRestoreOn": True,
    "sessionResumeMode": "ask",
    "sessionResumeDesign": "folio",
    "safeMode": True,
    "updateCheckOn": False,
    "algoIntelligenceOn": False,
    "themeEngineOn": False,
    "calmChromeOn": False,
    "forceWatchedAccountHistory": False,
    "stripResumeTimesOn": False,
    "sponsorblockOn": False,
    "dearrowOn": False,
    "silentToasts": True,
    "adaptiveThrottleOn": False,
}


def record(id=A, pos=73, **kw):
    return dict(
        {
            "videoId": id,
            "title": "After the last light" if id == A else "An atlas of shadows",
            "channel": "North Range Studio",
            "lastWatched": int(time.time() * 1000) - 90000,
            "firstWatched": int(time.time() * 1000) - 3600000,
            "lastPosition": pos,
            "duration": 120,
            "remaining": 120 - pos,
            "progress": round(pos / 120 * 100),
            "completed": False,
            "watchCount": 2,
            "sessions": [{"start": 100, "kind": "legacy"}],
            "totalWatchTime": 18.5,
            "tags": ["field"],
            "notes": "keep this note",
            "pinned": 1,
        },
        **kw,
    )


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--browser")
    ap.add_argument("--bundle", type=Path, default=ROOT / "yourtube.user.js")
    ap.add_argument("--out", type=Path)
    ap.add_argument("--profile", type=Path)
    ap.add_argument("--baseline", action="store_true")
    ap.add_argument(
        "--quick", action="store_true", help="Skip the real 32-second hold test."
    )
    ap.add_argument("--only", default="", help="Comma-separated case names.")
    args = ap.parse_args()
    bundle = args.bundle.read_bytes()
    html = (LAB / "watch.html").read_text()
    movie = (LAB / "dusk.webm").read_bytes()
    poster = (LAB / "dusk.jpg").read_bytes()
    ver = re.search(rb"@version\s+([^\s]+)", bundle)[1].decode()
    rows = []
    images = []
    errors = []
    results = {
        "version": ver,
        "sha256": hashlib.sha256(bundle).hexdigest(),
        "source": (
            "signed Tampermonkey · intercepted fixture"
            if args.profile
            else "direct assembled script · intercepted fixture"
        ),
        "media": "120s VP9, native media events and range requests",
        "cases": rows,
        "screens": images,
    }
    out = args.out
    if out:
        (out / "screens").mkdir(parents=True, exist_ok=True)
        (out / "evidence").mkdir(exist_ok=True)
    with sync_playwright() as pw:
        launch = {
            "executable_path": args.browser,
            "chromium_sandbox": True,
            "args": [
                "--disable-dev-shm-usage",
                "--autoplay-policy=no-user-gesture-required",
                "--proxy-server=127.0.0.1:9",
                "--proxy-bypass-list=<-loopback>",
            ],
        }
        context = {
            "viewport": {"width": 1160, "height": 820},
            "device_scale_factor": 1,
            "locale": "en-US",
            "accept_downloads": True,
        }
        if args.profile:
            c = pw.chromium.launch_persistent_context(
                str(args.profile),
                **launch,
                **context,
                headless=False,
                ignore_default_args=[
                    "--disable-extensions",
                    "--disable-component-extensions-with-background-pages",
                ],
            )
            b = c.browser
            pg = c.new_page()
            pg.goto("chrome-extension://" + ID + "/options.html")
            pg.get_by_text("Installed Userscripts", exact=True).first.click()
            line = pg.locator("tr").filter(has_text="YourTube").last
            line.locator('[title="Enabled"]').wait_for()
            assert ver in line.inner_text()
            results["managerListing"] = line.inner_text()
            if out:
                pg.screenshot(
                    path=out / "screens/manager-inspection.jpg", type="jpeg", quality=75
                )
            # A previous *live site* smoke test can leave a YouTube service worker
            # that owns top-level /watch and defeats the offline fixture route.
            # Clear only that disposable origin's workers and response cache.
            cdp = c.new_cdp_session(pg)
            cdp.send(
                "Storage.clearDataForOrigin",
                {"origin": ORIGIN, "storageTypes": "service_workers,cache_storage"},
            )
            cdp.detach()
            pg.close()
        else:
            b = pw.chromium.launch(**launch)
            c = b.new_context(**context, service_workers="block")
        results["browser"] = b.version
        ref = "/lab/bundle.js"
        script = "" if args.profile else '<script src="' + ref + '"></script>'

        def respond(r):
            u = urlparse(r.request.url)
            p = u.path
            if u.hostname != "www.youtube.com":
                return r.abort()
            if p == "/watch":
                return r.fulfill(
                    body=html.replace("</head>", script + "</head>"),
                    content_type="text/html; charset=utf-8",
                )
            if p in ["/lab/setup", "/feed/history"]:
                return r.fulfill(
                    body='<!doctype html><meta charset="utf-8"><ytd-app><main>Isolated journal fixture</main></ytd-app>'
                    + script,
                    content_type="text/html; charset=utf-8",
                )
            if p == ref and not args.profile:
                return r.fulfill(
                    body=bundle, content_type="application/javascript; charset=utf-8"
                )
            if p == "/lab/dusk.jpg":
                return r.fulfill(body=poster, content_type="image/jpeg")
            if p == "/lab/dusk.webm":
                m = re.match(r"bytes=(\d+)-(\d*)", r.request.headers.get("range", ""))
                n = len(movie)
                lo, hi = (
                    (int(m[1]), min(n - 1, int(m[2]) if m[2] else n - 1))
                    if m
                    else (0, n - 1)
                )
                headers = {"accept-ranges": "bytes", "content-type": "video/webm"}
                if lo >= n:
                    return r.fulfill(
                        status=416, headers={"content-range": f"bytes */{n}"}
                    )
                if m:
                    headers["content-range"] = f"bytes {lo}-{hi}/{n}"
                return r.fulfill(
                    status=206 if m else 200, headers=headers, body=movie[lo : hi + 1]
                )
            return r.abort()

        c.route("**/*", respond)
        c.add_init_script(
            """window.fieldNative=HTMLMediaElement.prototype.play;
if(location.pathname==='/watch' && location.search.includes('db=slow')){const open=indexedDB.open.bind(indexedDB);indexedDB.open=(...a)=>{const facade={};setTimeout(()=>{const req=open(...a);for(const k of ['result','error','transaction'])Object.defineProperty(facade,k,{get:()=>req[k]});for(const k of ['success','error','blocked','upgradeneeded'])req['on'+k]=ev=>facade['on'+k]?.(ev)},1250);return facade;}}
if(location.pathname==='/watch' && location.search.includes('db=blocked')){indexedDB.open=()=>{throw new DOMException('Controlled DB denial','SecurityError')}}
if(location.pathname==='/watch' && location.search.includes('write=fault')){const orig=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...a){if(this.name==='history')throw new DOMException('Controlled commit fault','QuotaExceededError');return orig.apply(this,a)}}
if(location.pathname==='/watch' && location.search.includes('play=denied')){window.fieldDeny=true;HTMLMediaElement.prototype.play=function(){return window.fieldDeny?Promise.reject(new DOMException('Controlled user activation denial','NotAllowedError')):window.fieldNative.apply(this,arguments)}}"""
        )
        p = c.new_page()
        p.set_default_timeout(6500)
        p.on("pageerror", lambda e: errors.append(str(e)[:180]))

        def init(entries=(), cfg=None):
            p.goto(ORIGIN + "/lab/setup", wait_until="domcontentloaded", timeout=25000)
            p.wait_for_function("()=>!!window.YourTube?.history", timeout=18000)
            p.evaluate(
                'async()=>{await YourTube.history.clear();for(const k of Object.keys(localStorage))if(k.startsWith("yourtube.checkpoint."))localStorage.removeItem(k)}'
            )
            settings = {**BASE, **(cfg or {})}
            p.evaluate("o=>YourTube.setCfgMany(o)", settings)
            p.evaluate(
                "async rows=>{for(const r of rows)await YourTube.history.put(r)}",
                entries,
            )
            p.wait_for_timeout(1250 if args.profile else 850)

        def watch(id=A, extra="", pg=None):
            pg = pg or p
            pg.goto(
                ORIGIN + "/watch?v=" + id + extra,
                wait_until="domcontentloaded",
                timeout=25000,
            )
            pg.wait_for_function(
                '()=>!!window.YourTube?.history&&typeof window.v==="function"&&v()?.readyState>=2',
                timeout=18000,
            )
            assert pg.evaluate("YourTube.version") == ver

        def phase(name, pg=None):
            (pg or p).wait_for_function(
                "x=>YourTube.history.recorderState().phase===x", arg=name
            )

        def hold(pg=None):
            phase("hold", pg)
            (pg or p).locator("#yourtube-checkpoint [data-action=resume]").wait_for()

        def click(action, pg=None):
            (pg or p).locator(
                "#yourtube-checkpoint [data-action=" + action + "]"
            ).click()

        def data(id=A, pg=None):
            return (pg or p).evaluate("id=>YourTube.history.get(id)", id)

        def state(pg=None):
            return (pg or p).evaluate(
                '()=>({paused:v().paused,seconds:v().currentTime,ended:v().ended,own:Object.hasOwn(v(),"play"),...YourTube.history.recorderState()})'
            )

        def waitrow(expression, id=A, pg=None):
            (pg or p).wait_for_function(
                "async id=>{const r=await YourTube.history.get(id);return "
                + expression
                + "}",
                arg=id,
                timeout=8500,
            )

        def shot(name, el=None):
            if out:
                path = out / "screens" / (name + ".jpg")
                (el or p).screenshot(path=path, type="jpeg", quality=85)
                images.append(name + ".jpg")

        def case(name, fn):
            if args.only and name not in args.only.split(","):
                return
            row = {"case": name}
            rows.append(row)
            start = time.monotonic()
            before = len(errors)
            try:
                row["observed"] = fn()
                row["pass"] = True
            except Exception as ex:
                row["pass"] = False
                row["error"] = str(ex)[:950]
                row["trace"] = traceback.format_exc(limit=3)[-950:]
                print("FAIL DETAIL", row["trace"], flush=True)
            row["elapsedSeconds"] = round(time.monotonic() - start, 2)
            row["pageErrors"] = errors[before:]
            print("PASS" if row["pass"] else "FAIL", name, flush=True)
            if out:
                (out / "evidence/results.json").write_text(
                    json.dumps(results, indent=2) + "\n"
                )

        if args.baseline:

            def without_choice_old():
                init(
                    [record()],
                    {"sessionResumeMode": "card", "sessionResumeDesign": "default"},
                )
                watch()
                p.locator("#ytb-resume-card").wait_for(timeout=13000)
                pos = data()["lastPosition"]
                p.wait_for_timeout(32000)
                res = p.evaluate(
                    'async()=>{let reply;try{await v().play();reply="resolved"}catch(e){reply=e.name}return {reply,paused:v().paused,prompt:!!document.querySelector("#ytb-resume-card")}}'
                )
                res["initialSavedSeconds"] = pos
                res["finalSavedSeconds"] = data()["lastPosition"]
                results["oldTimedHold"] = res
                assert res["paused"] and res["prompt"], str(res)
                return res

            case("no-unlock-without-choice", without_choice_old)
        else:

            def design():
                init([record()])
                watch()
                hold()
                assert data()["watchCount"] == 2 and p.evaluate("v().paused")
                obs = {}
                for look in ["folio", "signal", "dock"]:
                    p.evaluate('v=>YourTube.setCfg("sessionResumeDesign",v)', look)
                    p.wait_for_function(
                        's=>document.querySelector("#yourtube-checkpoint")?.dataset.design===s',
                        arg=look,
                    )
                    shot(look)
                    obs[look] = p.locator(
                        "#yourtube-checkpoint [role=dialog]"
                    ).bounding_box()
                p.set_viewport_size({"width": 390, "height": 844})
                p.evaluate('YourTube.setCfg("sessionResumeDesign","folio")')
                p.wait_for_timeout(450)
                shot("mobile")
                host = p.locator("#movie_player").bounding_box()
                for action in ["resume", "restart"]:
                    box = p.locator("[data-action=" + action + "]").bounding_box()
                    assert (
                        box
                        and box["x"] >= host["x"]
                        and box["x"] + box["width"] <= host["x"] + host["width"] + 1
                        and box["y"] + box["height"] <= host["y"] + host["height"] + 1
                    ), (host, box)
                p.set_viewport_size(context["viewport"])
                return obs

            case("three-designs-and-narrow-player", design)

            def guard():
                init([record()])
                watch()
                hold()
                initial = data()
                err = p.evaluate('()=>v().play().then(()=>"resolved",e=>e.name)')
                assert err == "AbortError"
                p.evaluate(
                    '()=>{fieldNative.call(v()).catch(()=>{});document.querySelector("#movie_player").playVideo().catch(()=>{})}'
                )
                p.wait_for_timeout(320)
                assert p.evaluate("v().paused&&v().currentTime<.25")
                p.evaluate(
                    '()=>{const v2=document.createElement("video");v2.src="/lab/dusk.webm";v2.id="preview";v2.muted=true;document.body.append(v2);v2.play().catch(()=>{})}'
                )
                p.wait_for_function(
                    '()=>document.querySelector("#preview").currentTime>.15'
                )
                p.locator("[data-action=resume]").focus()
                p.keyboard.press("Escape")
                p.locator("[data-action=expand]").wait_for()
                shot("minimized")
                assert p.evaluate("v().paused")
                click("expand")
                awaited = data()
                assert awaited == initial and p.evaluate(
                    "HTMLMediaElement.prototype.play===fieldNative"
                )
                return {
                    "main": state(),
                    "attempt": err,
                    "previewPlayed": True,
                    "unchangedRow": awaited == initial,
                }

            case("autoplay-native-bypass-and-minimize", guard)
            if not args.quick:

                def timed():
                    init([record()])
                    watch()
                    hold()
                    saved = data()
                    t = time.monotonic()
                    p.wait_for_timeout(32000)
                    res = p.evaluate('()=>v().play().then(()=>"resolved",e=>e.name)')
                    assert (
                        res == "AbortError"
                        and p.evaluate("v().paused")
                        and data() == saved
                    )
                    hold()
                    return {
                        "waitSeconds": round(time.monotonic() - t, 2),
                        "attempt": res,
                        "position": data()["lastPosition"],
                        "viewCount": data()["watchCount"],
                    }

                case("no-unlock-without-choice", timed)

            def choose_resume():
                init([record()])
                watch()
                hold()
                click("resume")
                p.wait_for_function("()=>!v().paused&&v().currentTime>73.2")
                p.evaluate("v().pause()")
                waitrow("r?.lastPosition>73.15")
                r = data()
                assert (
                    r["watchCount"] == 3
                    and r["notes"] == "keep this note"
                    and r["pinned"]
                    and r["sessions"][0]["kind"] == "legacy"
                )
                assert not p.evaluate('Object.hasOwn(v(),"play")')
                before = r["lastPosition"]
                p.reload()
                p.wait_for_function("()=>!!window.YourTube?.history", timeout=18000)
                hold()
                after = data()
                assert (
                    before == after["lastPosition"]
                    and r["watchCount"] == after["watchCount"]
                )
                return {
                    "firstSaved": 73,
                    "reloadedAt": before,
                    "viewCount": r["watchCount"],
                    "tag": r["tags"][0],
                    "preservedNote": r["notes"],
                }

            case("resume-pause-reload-and-legacy-fields", choose_resume)

            def restart():
                init([record()])
                watch()
                hold()
                p.evaluate("v().currentTime=28")
                p.wait_for_timeout(100)
                assert data()["lastPosition"] == 73
                click("restart")
                p.wait_for_function("()=>!v().paused&&v().currentTime<1")
                p.evaluate("v().pause()")
                waitrow("r?.lastPosition<1&&r.watchCount===3")
                r = data()
                assert (
                    not r["completed"]
                    and r["notes"] == "keep this note"
                    and r["totalWatchTime"] < 20
                )
                return {
                    k: r[k]
                    for k in ["lastPosition", "totalWatchTime", "watchCount", "notes"]
                }

            case("restart-commits-zero-not-old-seek", restart)

            def firstplay():
                init()
                watch()
                phase("active")
                assert data() is None
                p.evaluate("v().play()")
                p.wait_for_function("()=>v().currentTime>.18")
                p.evaluate("v().currentTime=30")
                p.wait_for_function("()=>!v().seeking&&v().currentTime>=30")
                p.evaluate("v().pause()")
                waitrow("r?.lastPosition>=30")
                r = data()
                assert r["totalWatchTime"] < 3 and r["watchCount"] == 1
                p.wait_for_timeout(700)
                awaited = p.evaluate("YourTube.history.saveNow()")
                assert data()["totalWatchTime"] == r["totalWatchTime"]
                p.evaluate("()=>{v().currentTime=v().duration-.25;v().play()}")
                p.wait_for_function("()=>v().ended")
                waitrow("r?.completed===true")
                done = data()
                assert (
                    done["watchCount"] == 1
                    and done["progress"] == 100
                    and done["lastPosition"] == 0
                    and done["totalWatchTime"] < 4
                )
                p.reload()
                p.wait_for_function("()=>!!window.YourTube?.history", timeout=18000)
                phase("active")
                return {
                    "pausedAt": r["lastPosition"],
                    "elapsedWatchSeconds": done["totalWatchTime"],
                    "endedFlag": done["completed"],
                    "visits": done["watchCount"],
                }

            case("real-play-seek-pause-and-natural-end", firstplay)

            def explicit():
                init([record()])
                obs = []
                for suffix in ["&t=0", "&start=14", "#t=1m13s"]:
                    watch(extra=suffix)
                    phase("active")
                    assert not state()["held"]
                    obs.append(suffix)
                init([record()], {"sessionResumeMode": "record"})
                watch()
                phase("active")
                assert data()["lastPosition"] == 73
                return {"links": obs, "recordOnly": True}

            case("timestamp-precedence-and-record-only", explicit)

            def swap():
                init([record(), record(B, 41)])
                watch()
                hold()
                p.evaluate(
                    """()=>{window.old=v();const copy=v().cloneNode(true);old.replaceWith(copy)}"""
                )
                hold()
                p.wait_for_function(
                    '()=>!Object.hasOwn(old,"play")&&Object.hasOwn(v(),"play")'
                )
                assert p.evaluate(
                    'document.querySelectorAll("#yourtube-checkpoint").length===1'
                )
                p.evaluate(
                    """id=>{window.staleChoice=document.querySelector('#yourtube-checkpoint').shadowRoot.querySelector('[data-action=resume]');history.pushState({},'', '/watch?v='+id);document.dispatchEvent(new Event('yt-navigate-finish'));}""",
                    B,
                )
                p.wait_for_timeout(550)
                assert p.locator("#yourtube-checkpoint").count() == 0
                p.evaluate(
                    'id=>{document.querySelector("#watch").setAttribute("video-id",id);document.dispatchEvent(new Event("yt-page-data-updated"));}',
                    B,
                )
                hold()
                assert "0:41" in p.locator("[data-action=resume]").inner_text()
                p.evaluate("staleChoice.click()")
                p.wait_for_timeout(180)
                assert state()["held"] and data(A)["lastPosition"] == 73
                click("resume")
                p.wait_for_function("()=>!v().paused&&v().currentTime>=41")
                return {
                    "oldGuardRestored": p.evaluate('!Object.hasOwn(old,"play")'),
                    "Btime": p.evaluate("v().currentTime"),
                    "Apoint": data(A)["lastPosition"],
                }

            case("player-replacement-spa-identity-and-stale-click", swap)

            def disable():
                init([record()])
                watch()
                hold()
                p.evaluate('YourTube.setCfg("sessionRestoreOn",false)')
                phase("off")
                assert not p.locator("#yourtube-checkpoint").count() and not p.evaluate(
                    'Object.hasOwn(v(),"play")'
                )
                p.evaluate("v().play()")
                p.wait_for_function("()=>v().currentTime>.12")
                p.evaluate("v().pause()")
                assert data()["lastPosition"] == 73
                p.evaluate('YourTube.setCfg("sessionRestoreOn",true)')
                hold()
                p.evaluate('YourTube.features.apply("session-restore")')
                assert p.locator("#yourtube-checkpoint").count() == 1
                return state()

            case("disable-reenable-and-idempotent-apply", disable)

            def denied():
                init([record()])
                watch(extra="&play=denied")
                hold()
                click("resume")
                phase("play-blocked")
                assert abs(p.evaluate("v().currentTime") - 73) < 0.2
                shot("play-gesture")
                p.evaluate("window.fieldDeny=false")
                click("resume")
                p.wait_for_function("()=>!v().paused&&v().currentTime>=73")
                return {"landedAt": 73, "retryPlaying": not state()["paused"]}

            case("user-activation-denied-and-retry", denied)

            def durable():
                init([record()])
                watch(extra="&write=fault")
                hold()
                click("resume")
                p.wait_for_function("()=>!v().paused")
                p.evaluate("v().currentTime=52")
                p.wait_for_function("()=>!v().seeking&&v().currentTime>=52")
                p.evaluate("v().pause()")
                p.wait_for_function(
                    '()=>JSON.parse(localStorage.getItem("yourtube.checkpoint.v1:FieldFilm01"))?.pos>=52 && JSON.parse(localStorage.getItem("yourtube.checkpoint.v1:FieldFilm01"))?.pos<54'
                )
                j = p.evaluate(
                    'JSON.parse(localStorage.getItem("yourtube.checkpoint.v1:FieldFilm01"))'
                )
                assert data()["lastPosition"] == 73
                watch()
                hold()
                r = data()
                assert abs(r["lastPosition"] - j["pos"]) < 0.1 and r["watchCount"] == 3
                assert (
                    p.evaluate(
                        'localStorage.getItem("yourtube.checkpoint.v1:FieldFilm01")'
                    )
                    is None
                )
                return {
                    "abortedDBPosition": 73,
                    "journalPosition": j["pos"],
                    "recovered": r["lastPosition"],
                    "recoveriesCountedAsVisits": r["watchCount"] - 3,
                }

            case("failed-write-journal-recovery-on-return", durable)

            def storage_fault():
                init([record()])
                watch(extra="&db=blocked")
                phase("active")
                assert state()["readOnly"] and not state()["held"]
                p.evaluate("v().play()")
                p.wait_for_function("()=>v().currentTime>.12")
                watch()
                hold()
                assert data()["lastPosition"] == 73
                return {
                    "failedOpenWithoutWriting": True,
                    "recoveredSavedTime": data()["lastPosition"],
                }

            case("unavailable-storage-does-not-clobber", storage_fault)

            def tabs():
                init([record()])
                watch()
                hold()
                click("resume")
                p.wait_for_function("()=>!v().paused&&v().currentTime>=73")
                p.evaluate("v().pause()")
                waitrow("r?.watchCount===3")
                p2 = c.new_page()
                try:
                    watch(pg=p2)
                    hold(p2)
                    click("restart", p2)
                    p2.wait_for_function("()=>!v().paused&&v().currentTime<1")
                    p2.evaluate("v().pause()")
                    waitrow("r?.watchCount===4&&r.lastPosition<1", pg=p2)
                    new = data(pg=p2)
                    p.evaluate("v().currentTime=89")
                    p.wait_for_function("()=>!v().seeking")
                    p.evaluate("YourTube.history.saveNow()")
                    p.wait_for_timeout(180)
                    r = data()
                    assert (
                        r["lastPosition"] == new["lastPosition"]
                        and r["_checkpoint"]["sid"] == new["_checkpoint"]["sid"]
                    )
                    p2.evaluate("YourTube.history.clear()")
                    p.evaluate("v().currentTime=90")
                    p.wait_for_function("()=>!v().seeking")
                    p.evaluate("YourTube.history.saveNow()")
                    assert data() is None
                    return {
                        "newOwnerSeconds": new["lastPosition"],
                        "staleWriterAttempt": 89,
                        "afterOlderWrite": r["lastPosition"],
                        "clearNotResurrected": True,
                    }
                finally:
                    p2.close()

            case("two-tabs-no-stale-overwrite-or-resurrection", tabs)

            def metadata_arrival():
                init([record()])
                watch()
                hold()
                p.evaluate("()=>{v().removeAttribute('src');v().load()}")
                p.wait_for_function("()=>v().readyState===0")
                click("resume")
                phase("seeking")
                assert data()["lastPosition"] == 73
                p.evaluate("()=>{v().setAttribute('src','/lab/dusk.webm');v().load()}")
                p.wait_for_function("()=>!v().paused&&v().currentTime>=73")
                p.evaluate("v().pause()")
                return {
                    "choiceQueuedWithoutMetadata": True,
                    "actualSeek": state()["seconds"],
                }

            case("choice-before-metadata-waits-for-confirmed-seek", metadata_arrival)

            def seek_retry():
                init([record()])
                watch()
                hold()
                p.evaluate(
                    "()=>{const prop=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'currentTime');Object.defineProperty(v(),'currentTime',{get(){return prop.get.call(this)},set(){throw new DOMException('Controlled unseekable source','InvalidStateError')},configurable:true})}"
                )
                click("resume")
                phase("seek-error")
                assert data()["lastPosition"] == 73 and p.evaluate("v().paused")
                p.evaluate("delete v().currentTime")
                click("resume")
                p.wait_for_function("()=>!v().paused&&v().currentTime>=73")
                return {"retryAt": state()["seconds"], "prematureOverwrite": False}

            case("unseekable-target-retries-without-playing-zero", seek_retry)

            def exceptions():
                init([record()])
                watch()
                hold()
                p.evaluate(
                    "document.querySelector('#movie_player').classList.add('ad-showing')"
                )
                p.wait_for_function(
                    '()=>!document.querySelector("#yourtube-checkpoint")'
                )
                assert not p.evaluate('Object.hasOwn(v(),"play")')
                p.evaluate("v().play()")
                p.wait_for_function("()=>v().currentTime>.2")
                p.evaluate("v().pause()")
                assert data()["lastPosition"] == 73
                p.evaluate(
                    "document.querySelector('#movie_player').classList.remove('ad-showing')"
                )
                hold()
                p.evaluate(
                    "document.querySelector('#movie_player').getVideoData=()=>({video_id:'FieldFilm01',isLive:true})"
                )
                p.wait_for_function(
                    '()=>!document.querySelector("#yourtube-checkpoint")'
                )
                assert not state()["held"]
                p.evaluate(
                    "()=>{tagPlayer();const n=document.createElement('yt-playability-error-supported-renderers');n.style.display='block';n.textContent='Native playback unavailable';document.querySelector('#movie_player').append(n)}"
                )
                p.wait_for_timeout(600)
                assert not p.locator("#yourtube-checkpoint").count()
                return {
                    "adAllowed": True,
                    "liveUntouched": True,
                    "nativeErrorUncovered": True,
                    "contentPositionIntact": data()["lastPosition"],
                }

            case("ads-live-and-native-error-not-gated", exceptions)

            def slow():
                init([record(), record(B, 41)])
                watch(extra="&db=slow")
                st = state()
                assert st["phase"] == "lookup" and st["held"], st
                reply = p.evaluate('v().play().then(()=>"resolved",e=>e.name)')
                assert reply == "AbortError"
                p.evaluate(
                    "id=>{history.pushState({},'', '/watch?v='+id);document.querySelector('#watch').setAttribute('video-id',id);document.dispatchEvent(new Event('yt-navigate-finish'))}",
                    B,
                )
                hold()
                assert "0:41" in p.locator("[data-action=resume]").inner_text()
                assert data(A)["lastPosition"] == 73 and data(B)["lastPosition"] == 41
                return {
                    "attemptDuringLookup": reply,
                    "winningVisit": state()["videoId"],
                    "displayed": p.locator("[data-action=resume]").inner_text(),
                }

            case("slow-lookup-and-late-result-cancellation", slow)

            def fresh_intent():
                init()
                watch(extra="&db=slow")
                phase("lookup")
                reply = p.evaluate('v().play().then(()=>"resolved",e=>e.name)')
                p.wait_for_function("()=>!v().paused&&v().currentTime>.18")
                r = state()
                assert reply == "AbortError" and r["phase"] == "active"
                return {
                    "deferredFreshPlayback": r["seconds"],
                    "unnecessaryPrompt": bool(
                        p.locator("#yourtube-checkpoint").count()
                    ),
                }

            case("new-film-replays-original-play-intent", fresh_intent)

            def lifecycle():
                init([record()])
                watch()
                hold()
                click("resume")
                p.wait_for_function("()=>!v().paused&&v().currentTime>=73")
                p.evaluate("v().currentTime=34")
                p.wait_for_function("()=>!v().seeking&&v().currentTime>=34")
                p.evaluate(
                    "window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}))"
                )
                waitrow("r?.lastPosition>=34&&r.lastPosition<35")
                snap = data()["lastPosition"]
                p.evaluate(
                    "window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))"
                )
                hold()
                assert abs(data()["lastPosition"] - snap) < 0.1
                return {
                    "BFCacheEvents": "simulated",
                    "frozenAt": snap,
                    "restoredAs": state()["phase"],
                }

            case("pagehide-checkpoint-and-pageshow-rearm", lifecycle)

            def delete_isolation():
                init([record(B, 31)])
                watch()
                phase("active")
                p2 = c.new_page()
                try:
                    watch(B, pg=p2)
                    hold(p2)
                    p2.evaluate('YourTube.history.del("FieldFilm02")')
                    p.evaluate("v().play()")
                    p.wait_for_function("()=>v().currentTime>.18")
                    p.evaluate("v().pause()")
                    waitrow("r?.lastPosition>0")
                    assert data(B) is None
                    return {"unrelatedFirstSave": data()["lastPosition"], "deleted": B}
                finally:
                    p2.close()

            case("single-removal-does-not-silence-another-film", delete_isolation)

            def theme_interop():
                init([record()])
                watch()
                hold()
                looks = []
                for tid, glass in [
                    ("d-amoled", False),
                    ("l-clean", False),
                    ("d-amoled", True),
                    ("none", False),
                ]:
                    p.evaluate(
                        "([t,gl])=>{YourTube.setCfgMany({themeEngineOn:true,themeSelected:t,themeGlassOverhaulOn:gl,themeOverhaulOn:gl});YourTube.features.apply('theme-engine')}",
                        [tid, glass],
                    )
                    p.wait_for_function(
                        "t=>!!document.querySelector('#ytb-theme-engine-style')===(t!=='none')",
                        arg=tid,
                    )
                    hold()
                    assert p.locator(
                        "[data-action=restart]"
                    ).is_visible() and p.evaluate("v().paused")
                    looks.append([tid, glass])
                return {
                    "paletteAndOverhaul": looks,
                    "retainedPosition": data()["lastPosition"],
                }

            case("theme-changes-while-held", theme_interop)

            def shortened():
                init([record(A, 163, duration=200, progress=82)])
                watch()
                phase("shortened")
                assert (
                    data()["lastPosition"] == 163
                    and p.locator("[data-action=resume]").is_hidden()
                )
                click("restart")
                p.wait_for_function("()=>!v().paused&&v().currentTime<1")
                return {
                    "oldPosition": 163,
                    "actualDuration": p.evaluate("v().duration"),
                    "restartAt": p.evaluate("v().currentTime"),
                }

            case("edited-video-does-not-seek-beyond-new-end", shortened)

            def migrated():
                init(
                    [record(A, 0, progress=40)],
                    {"sessionResumeMode": "silent", "sessionResumeDesign": "cinema"},
                )
                watch()
                hold()
                assert (
                    p.evaluate("YourTube.cfg.sessionResumeMode") == "ask"
                    and p.locator("#yourtube-checkpoint").get_attribute("data-design")
                    == "signal"
                )
                assert "0:48" in p.locator("[data-action=resume]").inner_text()
                return {
                    "oldMode": "silent",
                    "newMode": "ask",
                    "derivedFromLegacyPercent": "0:48",
                    "appearance": "signal",
                }

            case("legacy-silent-and-percentage-only-migration", migrated)

            def passive_remount():
                init([record()])
                watch()
                hold()
                click("resume")
                p.wait_for_function("()=>!v().paused&&v().currentTime>73.15")
                p.evaluate("v().pause()")
                waitrow("r?.lastPosition>73")
                saved = data()["lastPosition"]
                p.evaluate(
                    "()=>{const old=v(),clean=old.cloneNode(true);old.replaceWith(clean)}"
                )
                p.wait_for_function(
                    "()=>v().paused&&v().readyState>=2&&v().currentTime===0"
                )
                p.wait_for_timeout(3900)
                p.evaluate("YourTube.history.saveNow()")
                assert data()["lastPosition"] == saved
                return {
                    "pausedReplacementAt": p.evaluate("v().currentTime"),
                    "retainedCheckpoint": saved,
                }

            case("passive-source-replacement-cannot-record-zero", passive_remount)

            def sibling_notice():
                init([record()])
                watch()
                hold()
                p.evaluate(
                    "()=>{const n=document.createElement('yt-playability-error-supported-renderers');n.style.display='block';n.textContent='This native playback notice needs attention';document.querySelector('#movie_player').after(n)}"
                )
                p.wait_for_function(
                    '()=>!document.querySelector("#yourtube-checkpoint")&&!Object.hasOwn(v(),"play")'
                )
                p.evaluate(
                    'document.querySelector("yt-playability-error-supported-renderers").remove()'
                )
                hold()
                return {
                    "unavailableNoticeTookPrecedence": True,
                    "promptReturnedAfterDismissal": True,
                    "saved": data()["lastPosition"],
                }

            case("native-notice-outside-player-takes-precedence", sibling_notice)

            def watch_clock():
                init()
                watch()
                phase("active")
                p.evaluate("()=>{v().playbackRate=2;return v().play()}")
                p.wait_for_function("()=>v().currentTime>=5.6")
                p.evaluate("v().pause()")
                waitrow("r?.lastPosition>=5.6")
                r = data()
                elapsed = r["totalWatchTime"]
                assert 2.35 < elapsed < 3.45, (elapsed, r["lastPosition"])
                p.wait_for_timeout(800)
                p.evaluate("YourTube.history.saveNow()")
                assert data()["totalWatchTime"] == elapsed
                return {
                    "speed": 2,
                    "mediaSeconds": r["lastPosition"],
                    "creditedWatchSeconds": elapsed,
                    "pausedTimeAdded": 0,
                    "visits": r["watchCount"],
                }

            case(
                "continuous-double-speed-credits-wall-time-not-media-time", watch_clock
            )

            def keyboard():
                init([record()])
                watch()
                hold()
                p.locator("[data-action=resume]").focus()
                p.keyboard.press("Escape")
                p.locator("[data-action=expand]").wait_for()
                assert (
                    p.evaluate(
                        'document.querySelector("#yourtube-checkpoint").shadowRoot.activeElement.dataset.action'
                    )
                    == "expand"
                )
                p.keyboard.press("Enter")
                assert (
                    p.evaluate(
                        'document.querySelector("#yourtube-checkpoint").shadowRoot.activeElement.dataset.action'
                    )
                    == "resume"
                )
                p.keyboard.press("Tab")
                assert (
                    p.evaluate(
                        'document.querySelector("#yourtube-checkpoint").shadowRoot.activeElement.dataset.action'
                    )
                    == "restart"
                )
                p.keyboard.press("Space")
                p.wait_for_function("()=>!v().paused&&v().currentTime<1")
                waitrow("r?.watchCount===3&&r.lastPosition<1")
                return {
                    "keys": ["Escape", "Enter", "Tab", "Space"],
                    "choice": "Start fresh",
                    "visits": data()["watchCount"],
                }

            case("keyboard-only-fold-return-and-start-fresh", keyboard)

            def controls():
                init(
                    [
                        record(),
                        record(B, 0, completed=True, progress=100, pinned=0),
                        record(C, 24, title="Mapping the evening sky", pinned=0),
                    ]
                )
                watch()
                hold()
                p.evaluate(
                    'YourTube.features.get("session-restore").settings(document.querySelector("#journal-lab"))'
                )
                panel = p.locator(".ytb-watch-journal")
                panel.locator(".name").filter(
                    has_text="After the last light"
                ).wait_for()
                shot("watch-journal", panel)
                panel.get_by_label("Filter history").select_option("done")
                assert panel.locator(".row").count() == 1
                panel.get_by_label("Filter history").select_option("all")
                panel.get_by_role("searchbox").fill("Mapping")
                assert panel.locator(".row").count() == 1
                panel.get_by_text("Pin", exact=True).click()
                waitrow("!!r?.pinned", C)
                panel.get_by_text("Remove", exact=True).click()
                panel.get_by_text("Cancel", exact=True).click()
                assert data(C) is not None
                panel.get_by_text("Remove", exact=True).click()
                panel.get_by_text("Confirm removal", exact=True).click()
                waitrow("!r", C)
                with p.expect_download() as download:
                    panel.get_by_text("Export JSON", exact=True).click()
                exported = json.loads(Path(download.value.path()).read_text())
                assert len(exported["history"]) == 2 and all(
                    "_checkpoint" not in row and "_checkpointLife" not in row
                    for row in exported["history"]
                )
                reimport = [
                    record(C, 19, title="Returned film"),
                    record(A, 4, lastWatched=1, title="Stale import"),
                ]
                panel.locator("input[type=file]").set_input_files(
                    {
                        "name": "local-backup.json",
                        "mimeType": "application/json",
                        "buffer": json.dumps(reimport).encode(),
                    }
                )
                waitrow("r?.lastPosition===19", C)
                assert data(A)["lastPosition"] == 73
                panel.get_by_text("Clear history", exact=True).click()
                panel.get_by_role("button", name="Cancel").click()
                assert data(C) is not None
                panel.get_by_text("Clear history", exact=True).click()
                panel.get_by_role("button", name="Confirm removal").click()
                waitrow("!r", C)
                waitrow("!r", A)
                assert not p.locator("#yourtube-checkpoint").count()
                return {
                    "clearConfirmed": True,
                    "roundTripExportRows": len(exported["history"]),
                    "importPreservedNewer": True,
                    "search": "1 match",
                    "pinPersisted": True,
                    "removeRequiredConfirmation": True,
                }

            case("library-search-filter-pin-safe-remove", controls)
        c.close()
        if not args.profile:
            b.close()
    results["pass"] = all(v["pass"] for v in rows) and bool(rows)
    results["count"] = len(rows)
    results["passed"] = sum(r["pass"] for r in rows)
    if out:
        (out / "evidence/results.json").write_text(json.dumps(results, indent=2) + "\n")
    print(f'{results["passed"]}/{len(rows)} passed on {ver} · {results["source"]}')
    return 0 if results["pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
