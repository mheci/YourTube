"""Run isolated, measured effect probes. --tm-profile specifies a disposable closed profile
with the tested script already installed. Its configuration is modified. Never use a personal
profile. All HTTP(S) page requests are fulfilled here or denied; proxy also prevents extension
network calls. Without --tm-profile, a fresh context loads --bundle directly each time.
"""

from pathlib import Path
import json, argparse, os, asyncio, re, sys, hashlib, html
from urllib.parse import urlparse
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "fixture"))
from specs import S
from off_witnesses import OFF_WITNESS, SIMPLE_OFF, ROUTES, NEXT

REG = json.loads((ROOT / "catalogue.json").read_text())
IDS = {r["id"]: r for r in REG}
J = lambda v: json.dumps(v, ensure_ascii=False)


async def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--browser", default=os.getenv("CHROME_BIN"))
    ap.add_argument("--tm-profile")
    ap.add_argument("--bundle", type=Path, default=ROOT.parents[1] / "yourtube.user.js")
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--select", default="")
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--workers", type=int, default=4)
    args = ap.parse_args()
    assert args.browser
    O = args.out
    D = O / "data/cases"
    D.mkdir(parents=True, exist_ok=True)
    SS = O / "screens/features"
    SS.mkdir(parents=True, exist_ok=True)
    A = ROOT / "fixture"
    bundle = args.bundle.read_bytes()
    digest = hashlib.sha256(bundle).hexdigest()
    version = re.search(rb"@version\s+([^\s]+)", bundle).group(1).decode()
    shell = (
        (A / "shell.html")
        .read_text()
        .replace(
            "__BUNDLE__",
            "" if args.tm_profile else '<script src="/audit/bundle.js"></script>',
        )
    )
    assets = {
        "/audit/tools.js": ("application/javascript", (A / "tools.js").read_bytes()),
        "/audit/media.webm": ("video/webm", (A / "media.webm").read_bytes()),
        "/audit/bundle.js": ("application/javascript", bundle),
    }
    selected = set(args.select.split(",")) if args.select else set(IDS)
    ids = [r["id"] for r in REG if r["id"] in selected and r["id"] in S]
    assert not (selected - set(IDS)), selected - set(IDS)
    assert not (selected - S.keys()), f"Missing effect scenarios: {sorted(selected - S.keys())}"
    sem = asyncio.Semaphore(1 if args.tm_profile else args.workers)
    async with async_playwright() as pw:
        opts = {
            "executable_path": args.browser,
            "headless": not args.tm_profile,
            "chromium_sandbox": True,
            "args": [
                "--disable-dev-shm-usage",
                "--renderer-process-limit=3",
                "--disable-gpu",
                "--autoplay-policy=no-user-gesture-required",
                "--proxy-server=127.0.0.1:9",
                "--proxy-bypass-list=<-loopback>",
            ],
        }
        base = {
            "viewport": {"width": 1360, "height": 768},
            "device_scale_factor": 1,
            "locale": "en-US",
            "accept_downloads": True,
        }
        if args.tm_profile:
            ctx = await pw.chromium.launch_persistent_context(
                args.tm_profile,
                **opts,
                **base,
                ignore_default_args=[
                    "--disable-extensions",
                    "--disable-component-extensions-with-background-pages",
                ],
            )
            browser = ctx.browser
            tm = await ctx.new_page()
            await tm.goto("chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html")
            await tm.get_by_text("Installed Userscripts", exact=True).first.click()
            await tm.locator("tr").filter(has_text="YourTube").last.locator('[title="Enabled"]').wait_for()
            await tm.close()
        else:
            browser = await pw.chromium.launch(**opts)
            ctx = None

        async def one(id):
            async with sem:
                spec = S[id]
                f = IDS[id]
                fpath = D / (id + ".json")
                rec = {
                    "id": id,
                    "name": f["name"],
                    "source": ("Tampermonkey · local fixture" if ctx else "bundle · local fixture"),
                    "browser": browser.version,
                    "bundleSha256": digest,
                    "scriptVersion": version,
                    "scenario": spec["note"],
                    "measure": spec["measure"],
                    "expected": spec["expect"],
                    "pass": False,
                }
                pic = SS / (id + ".jpg")
                if args.resume and fpath.exists():
                    prev = json.loads(fpath.read_text())
                    if (
                        prev.get("pass")
                        and prev.get("bundleSha256") == digest
                        and prev.get("source") == rec["source"]
                    ):
                        return
                c = ctx or await browser.new_context(**base, service_workers="block")
                p = await c.new_page()
                p.set_default_timeout(6500)
                trace = []
                errors = []
                p.on("pageerror", lambda e: errors.append(str(e)[:220]))
                p.on(
                    "console",
                    lambda m: (
                        errors.append(m.text[:220])
                        if m.type == "error" and "[YourTube]" in m.text
                        else None
                    ),
                )
                origin = "https://www.youtube.com"

                async def route(r):
                    u = urlparse(r.request.url)
                    path = u.path
                    if path not in assets and path != "/audit/blank" and len(trace) < 36:
                        trace.append([r.request.method, u.hostname, path[:100]])
                    if u.hostname == urlparse(origin).hostname and path in assets:
                        typ, buf = assets[path]
                        rng = r.request.headers.get("range", "")
                        m = re.match(r"bytes=(\d+)-(\d*)", rng)
                        if path.endswith(".webm") and m:
                            start = int(m[1])
                            end = min(int(m[2]) if m[2] else len(buf) - 1, len(buf) - 1)
                            await r.fulfill(
                                status=206,
                                content_type=typ,
                                headers={
                                    "Accept-Ranges": "bytes",
                                    "Content-Range": f"bytes {start}-{end}/{len(buf)}",
                                },
                                body=buf[start : end + 1],
                            )
                        else:
                            await r.fulfill(
                                content_type=typ,
                                body=buf,
                                headers={"Accept-Ranges": "bytes"},
                            )
                    elif (
                        u.hostname == "github.com"
                        and path.endswith("/yourtube.meta.js")
                        and id == "update-check"
                    ):
                        await r.fulfill(content_type="text/plain", body="// @version 9.9.9")
                    elif u.hostname == "returnyoutubedislikeapi.com" and id == "return-dislike":
                        await r.fulfill(json={"likes": 860, "dislikes": 140})
                    elif u.hostname == "sponsor.ajay.app" and id == "dearrow":
                        await r.fulfill(
                            json={
                                "titles": [
                                    {
                                        "original": False,
                                        "title": "Field recording, restored",
                                    }
                                ],
                                "thumbnails": [{"original": False, "timestamp": 12}],
                            }
                        )
                    elif u.hostname == "i.ytimg.com" and id == "hero-artwork-heal":
                        await r.fulfill(
                            content_type="image/svg+xml",
                            body='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300"><rect width="900" height="300" fill="#215c68"/><text x="70" y="150" fill="white" font-size="36">Local feature-test artwork</text></svg>',
                        )
                    elif (
                        u.hostname == "www.youtube.com"
                        and path == "/youtubei/v1/search"
                        and id == "discover"
                    ):
                        await r.fulfill(
                            json={
                                "contents": {
                                    "twoColumnSearchResultsRenderer": {
                                        "primaryContents": {
                                            "sectionListRenderer": {
                                                "contents": [
                                                    {
                                                        "itemSectionRenderer": {
                                                            "contents": [
                                                                {
                                                                    "videoRenderer": {
                                                                        "videoId": "LabVideo002",
                                                                        "title": {
                                                                            "simpleText": "Field discovery sample"
                                                                        },
                                                                        "ownerText": {
                                                                            "simpleText": "Field Lab"
                                                                        },
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        )
                    elif (
                        u.hostname == "www.youtube.com"
                        and path == "/youtubei/v1/player"
                        and id == "exact-upload-dates"
                    ):
                        await r.fulfill(
                            json={
                                "microformat": {"playerMicroformatRenderer": {"publishDate": "2020-03-14"}}
                            }
                        )
                    elif u.hostname == urlparse(origin).hostname and r.request.resource_type == "document":
                        await r.fulfill(content_type="text/html;charset=utf-8", body=shell)
                    else:
                        await r.abort()

                if ctx:
                    cd = await c.new_cdp_session(p)
                    await cd.send(
                        "Storage.clearDataForOrigin",
                        {"origin": origin, "storageTypes": "all"},
                    )
                    await cd.detach()
                    await c.clear_cookies()
                await p.route("**/*", route)
                await p.add_init_script("addEventListener('yourtube:applied',()=>window.auditBooted=true);")
                if spec.get("advance"):
                    await p.clock.install()
                if id == "update-check" and not ctx:
                    await p.add_init_script(
                        "window.GM_info={script:{version:'"
                        + version
                        + "'}};window.GM_getValue=(k,d)=>d;window.GM_setValue=()=>{}"
                    )
                try:
                    await p.goto(origin + "/audit/blank", wait_until="domcontentloaded")
                    await p.wait_for_function("()=>!!window.YourTube?.features", timeout=13000)
                    await p.wait_for_function("()=>window.auditBooted", timeout=13000)
                    assert await p.evaluate("YourTube.version") == version
                    # Disable masters first so an effect must emerge after deliberate activation.
                    basecfg = await p.evaluate(
                        """()=>{const cfg={};for(const f of YourTube.features.list()){const k=f.masterKey;if(k&&typeof YourTube.cfg[k]==='boolean') cfg[k]=false}return cfg}"""
                    )
                    basecfg.update(
                        {
                            "autoPauseMode": "off",
                            "feedWatchedMode": "off",
                            "highlightVideoLengthMode": "off",
                            "themeSelected": "none",
                            "defaultChannelTab": "featured",
                            "channelLandingTab": "home",
                            "channelBannerMode": "default",
                            "speedDefault": 1,
                            "updateCheckOn": False,
                            "safeMode": True,
                            "silentToasts": False,
                            "privacyPreset": "everyday",
                            "subGroupsActive": "",
                            "abA": -1,
                            "abB": -1,
                            "perfModeOn": False,
                            "algoAutoTrain": False,
                            "algoBoostOn": False,
                            "forceWatchedAccountHistory": False,
                        }
                    )
                    await p.evaluate("o=>YourTube.setCfgMany(o)", basecfg)
                    await p.wait_for_timeout(430)
                    await p.evaluate(
                        """([path,h,id,title,desc])=>{history.replaceState({},'',path);q('#lab-name').textContent=title;q('#lab-desc').textContent=desc;q('#lab-scene').innerHTML=h;}""",
                        [
                            spec["path"],
                            spec["html"],
                            id,
                            f["name"],
                            spec["note"] or f["summary"],
                        ],
                    )
                    if 'src="/audit/media.webm"' in spec["html"]:
                        await p.wait_for_function("()=>v()?.readyState>=2", timeout=5000)

                    async def js(s):
                        return await p.evaluate("async()=>{" + s + "}")

                    measure = "async()=>(" + spec["measure"] + ")"
                    if spec["setup"]:
                        await js(spec["setup"])
                    # Isolate this setting: preconfigure companions, never count them as UI evidence.
                    master = f["master"]
                    gate = "stripResumeTimesOn" if id == "resume-timestamps" else master
                    prepared = dict(spec.get("cfg") or {})
                    active = prepared.pop(gate, True)
                    if id == "speed-controller":
                        prepared.pop("speedDefault", None)
                    if prepared:
                        await p.evaluate("o=>YourTube.setCfgMany(o)", prepared)
                        await p.wait_for_timeout(320)
                    if id == "speed-controller":
                        await p.evaluate("()=>YourTube.setCfg('speedDefault',1.75)")
                        await p.wait_for_timeout(200)
                        await p.evaluate("()=>{v().playbackRate=1}")
                    await p.evaluate("window.__auditDocument=1")
                    rec["before"] = await p.evaluate(measure)
                    rec["prerequisites"] = prepared
                    dashboard_action = bool("settings(" in spec["action"])

                    async def operate(value, keep=False):
                        await p.evaluate("()=>YourTube.openDashboard()")
                        card = p.locator('[data-feat="' + id + '"]')
                        await card.wait_for(state="attached", timeout=12000)
                        await p.locator(".ytb-search").fill(id)
                        if gate:
                            ctrl = card.locator('[data-key="' + gate + '"]').first
                            kind = await ctrl.evaluate("n=>n.type")
                            if kind == "checkbox":
                                if await ctrl.is_checked() == value:
                                    raise AssertionError(f"{gate} was already {value} before UI operation")
                                label = ctrl.locator("xpath=ancestor::label[1]")
                                await label.click(timeout=3500)
                            elif kind == "select-one":
                                if await ctrl.input_value() == value:
                                    raise AssertionError("select was already at target")
                                await ctrl.select_option(str(value), timeout=3500)
                            else:
                                raise ValueError(kind)
                        if (
                            not keep
                            and not (
                                id in ROUTES
                                and value == active
                                and id in {"default-channel-tab", "redirect-shorts", "channel-landing-tab"}
                            )
                            and await p.locator(".ytb-dash").count()
                        ):
                            await p.locator('.ytb-dash button[aria-label="Close dashboard"]').click(
                                timeout=3500
                            )

                    if spec["before"] is not None:
                        assert await p.evaluate(
                            "(x)=>(" + spec["before"] + ")", rec["before"]
                        ), "precondition"
                    if id == "weekly-report":
                        # Cancel the scheduled report before its first eligible week is consumed.
                        await operate(active)
                        await operate(False)
                        await p.clock.run_for(9500)
                        rec["offMeasurement"] = await p.evaluate(measure)
                        assert "Last 7 days:" not in rec["offMeasurement"]
                    rec["control"] = gate or "action button"
                    rec["activation"] = active if gate else "click"
                    await operate(active, dashboard_action)
                    if dashboard_action:
                        await p.evaluate(
                            "id=>document.querySelector('[data-feat=\"'+id+'\"] .ytp-settings').id='lab-settings'",
                            id,
                        )
                    await p.wait_for_timeout(120)
                    if spec["wait"]:
                        await p.locator(spec["wait"]).first.wait_for(
                            state="attached", timeout=spec["limit"]
                        )
                    if spec["action"]:
                        action = re.sub(r"settings\('[^']+'\);?", "", spec["action"])
                        if id == "perf-profiler":
                            action = "document.querySelector('[data-feat=loop-video] label input').click()"
                        if action:
                            await js(action)
                    if spec["click"]:
                        await p.locator(spec["click"]).first.click(timeout=spec["limit"])
                    if spec["key"]:
                        await p.keyboard.press(spec["key"])
                    if spec.get("advance"):
                        await p.clock.run_for(spec["advance"])

                    async def until_value(expression, predicate, ms):
                        stop = asyncio.get_running_loop().time() + ms / 1000
                        while True:
                            try:
                                ok, value = await p.evaluate(
                                    "async()=>{const x=await ("
                                    + expression
                                    + ");return [!!("
                                    + predicate
                                    + "),x]}"
                                )
                                if ok:
                                    return value
                            except Exception as ex:
                                if "Execution context was destroyed" not in str(ex):
                                    raise
                            if asyncio.get_running_loop().time() > stop:
                                raise AssertionError(
                                    "effect not observed within " + str(ms) + " ms: " + predicate
                                )
                            await asyncio.sleep(0.12)

                    rec["after"] = await until_value(spec["measure"], spec["expect"], spec["limit"])
                    assert (
                        not spec["change"] or rec["before"] != rec["after"]
                    ), "outcome also present before activation"

                    async def capture():
                        await p.evaluate(
                            """([title,source,m,b,a])=>{document.querySelector('#lab-result')?.remove();const d=document.createElement('aside');d.id='lab-result';const h=document.createElement('b');h.textContent='MEASURED IN CHROMIUM　 /　'+source;d.append(h,document.createTextNode(title+'　·　'+m+'\\nBefore　'+b+'　 →　 After　'+a));(document.fullscreenElement||document.body).append(d)}""",
                            [
                                f["name"],
                                rec["source"],
                                spec["measure"][:155],
                                J(rec["before"])[:140],
                                J(rec["after"])[:210],
                            ],
                        )
                        await p.screenshot(path=str(pic), type="jpeg", quality=74)

                    if os.environ.get("AUDIT_SHOTS"):
                        await capture()
                    if id == "cookie-control":
                        await p.locator("#ytb-cookie-control button").filter(has_text="×").first.click(
                            timeout=2000
                        )
                    if gate and id not in ROUTES and (spec["reset"] or id in SIMPLE_OFF):
                        await operate(basecfg.get(gate, False))
                        rec["restored"] = await until_value(
                            spec["measure"],
                            "JSON.stringify(x)===JSON.stringify(" + J(rec["before"]) + ")",
                            3500,
                        )
                    elif gate and not id in ROUTES:
                        if id in OFF_WITNESS:
                            rec["onWitness"] = await p.evaluate("()=>" + OFF_WITNESS[id][0])
                        # For an irreversible action, clicking off is not itself a negative control.
                        await operate(basecfg.get(gate, False), keep=id in {"watch-stats", "export-data"})
                        rec["offClicked"] = True
                        if id in NEXT:
                            stimulus, expr, predicate = NEXT[id]
                            await js(stimulus)
                            rec["offMeasurement"] = await until_value(expr, predicate, 1700)
                            rec["offStimulus"] = stimulus
                            rec["offPredicate"] = expr + " => " + predicate
                        elif id in OFF_WITNESS:
                            expr, predicate = OFF_WITNESS[id]
                            assert (
                                rec.get("onWitness", 0) > 0
                            ), "Missing active target before testing removal"
                            rec["offMeasurement"] = await until_value(expr, predicate, 3000)
                            rec["offPredicate"] = expr + " => " + predicate
                    if id in {"default-channel-tab", "redirect-shorts", "playlist-resume"}:
                        await p.wait_for_function("()=>window.auditBooted")
                        await operate(basecfg.get(gate, False))
                        await p.goto(origin + spec["path"], wait_until="domcontentloaded")
                        await p.wait_for_function("()=>window.auditBooted")
                        await p.evaluate("h=>q('#lab-scene').innerHTML=h", spec["html"])
                        await js("YourTube.bus.emit('nav.changed',{url:location.href});await nap(1800)")
                        rec["offMeasurement"] = await p.evaluate(measure)
                        assert rec["offMeasurement"] == rec["before"], "Route changed with setting disabled"
                        if id == "playlist-resume":
                            assert await p.locator("#ytb-plresume").count() == 0
                    rec["oneDocument"] = await p.evaluate("window.__auditDocument === 1")
                    assert rec["oneDocument"] or id in ROUTES, "Unexpected full page reload"
                    if gate:
                        assert "restored" in rec or "offMeasurement" in rec, "No independent OFF measurement"
                    rec["pass"] = True
                    if pic.exists():
                        rec["screenshot"] = "screens/features/" + pic.name
                except Exception as ex:
                    rec["error"] = str(ex).split("Call log:")[0].strip()[:390]
                    try:
                        rec["observed"] = await p.evaluate("async()=>(" + spec["measure"] + ")")
                    except:
                        pass
                    if pic.exists():
                        pic.unlink()
                finally:
                    if trace:
                        rec["fixtureRequests"] = trace
                    if not rec.get("pass"):
                        try:
                            rec["diagnostic"] = await p.evaluate(
                                "()=>({toast:tx('#ytb-toast').slice(0,160),visibility:document.visibilityState,path:location.pathname,playing:v()&&!v().paused,seconds:v()?v().currentTime:null,sb:YourTube.sb.debugTick?.(),algo:YourTube.cfg.algoIntelligenceOn,dateHost:!!q('#date-text'),keyScript:qa('script:not([src])').some(n=>n.textContent.includes('INNERTUBE_API_KEY'))})"
                            )
                        except:
                            pass
                    if errors:
                        rec["pass"] = False
                        rec.setdefault("error", errors[0])
                        rec["pageErrors"] = errors[:6]
                    fpath.write_text(json.dumps(rec, indent=1, ensure_ascii=False) + "\n")
                    print(
                        ("PASS" if rec["pass"] else "FAIL"),
                        id,
                        (
                            ""
                            if rec["pass"]
                            else str(rec.get("observed", ""))[:100] + " " + rec.get("error", "")[:95]
                        ),
                        flush=True,
                    )
                    await p.close()
                    if not ctx:
                        await c.close()

        await asyncio.gather(*(one(id) for id in ids))
        await (ctx.close() if ctx else browser.close())
        bad = [i for i in ids if not json.loads((D / (i + ".json")).read_text()).get("pass")]
        print(f"{len(ids)-len(bad)}/{len(ids)} positive; {len(bad)} failed", flush=True)
        if bad:
            raise SystemExit(1)


if __name__ == "__main__":
    asyncio.run(main())
