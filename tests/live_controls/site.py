"""Optional installed-manager smoke. Use Chrome for Testing + an official unpacked
Tampermonkey extension. A fresh temporary profile is removed on exit. No login.
"""

import argparse
import hashlib
import json
from pathlib import Path
from urllib.parse import urlsplit
import re
import tempfile
from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[2]
TM = "dhdgffkkebhmkfjojejmpbldmpobfkfo"


def pointer_trial(pg, out, name):
    from time import monotonic

    data = {"id": "hide-masthead", "kind": "Playwright user pointer; native page, same element"}
    try:
        pg.locator(".ytb-search").fill("hide-masthead")
        ctrl = pg.locator('[data-feat="hide-masthead"] [data-key="hideMasthead"]').first
        switch = ctrl.locator("xpath=ancestor::label[1]")
        initial = ctrl.is_checked()
        if initial:
            switch.click()
        handle = pg.evaluate_handle(
            "()=>[...document.querySelectorAll('#masthead-container,ytd-masthead')].find(n=>n.getClientRects().length)"
        )
        if not handle.as_element():
            return dict(data, status="no native masthead")
        read = lambda: handle.evaluate(
            "n=>[n.isConnected,getComputedStyle(n).display,!!n.getClientRects().length]"
        )
        data["before"] = read()
        switch.click()
        pg.wait_for_function("n=>!n.getClientRects().length", arg=handle, timeout=2200)
        data["on"] = read()
        switch.click()
        pg.wait_for_function("n=>n.isConnected&&n.getClientRects().length", arg=handle, timeout=2200)
        data["off"] = read()
        data["pass"] = data["off"] == data["before"] and not data["on"][2]
        if initial:
            switch.click()
    except Exception as exc:
        data["error"] = str(exc)[:225]
    return data


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--chrome", required=True)
    ap.add_argument("--extension", type=Path, required=True)
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument(
        "--palettes",
        action="store_true",
        help="Exercise each theme on public search, including its native-page reversal",
    )
    ap.add_argument(
        "--extra-surfaces",
        action="store_true",
        help="Also inspect signed-out Shorts, channel and playlist surfaces",
    )
    ap.add_argument(
        "--reader-only",
        action="store_true",
        help="Isolate the description reader on the true native watch metadata",
    )
    ap.add_argument(
        "--playback-only",
        action="store_true",
        help="On a normal playable watch page, witness decoded clock, seeks, natural A/B and OFF. Stop at a playability gate.",
    )
    ap.add_argument(
        "--shell-only",
        action="store_true",
        help="Check the dashboard navigation and clipboard writes on public search in this disposable profile",
    )
    ap.add_argument(
        "--playback-focus",
        default="",
        help="Comma-separated feature IDs to isolate; pointer-wheel uses a trusted physical input after closing the dashboard",
    )
    args = ap.parse_args()
    out = args.out
    out.mkdir(exist_ok=True, parents=True)
    ext = args.extension.resolve()
    bundle = ROOT / "yourtube.user.js"
    opt = f"chrome-extension://{TM}/options.html"
    contents = bundle.read_bytes()
    ver = re.search(r"^// @version\s+(\S+)", contents.decode(), re.M)[1]
    with tempfile.TemporaryDirectory(prefix="yourtube-live-") as prof, sync_playwright() as w:
        staged = Path(prof) / "installer" / "yourtube.user.js"
        staged.parent.mkdir()
        staged.write_bytes(contents)
        c = w.chromium.launch_persistent_context(
            prof,
            executable_path=args.chrome,
            headless=False,
            viewport={"width": 1150, "height": 795},
            accept_downloads=True,
            ignore_default_args=[
                "--disable-extensions",
                "--disable-component-extensions-with-background-pages",
                "--disable-background-networking",
                "--disable-component-update",
            ],
            args=[
                f"--load-extension={ext}",
                f"--disable-extensions-except={ext}",
                "--disable-dev-shm-usage",
                "--renderer-process-limit=2",
                "--disable-gpu",
            ],
        )
        try:
            p = c.new_page()
            p.goto("chrome://extensions/?id=" + TM)
            toggle = p.locator("#allow-user-scripts").first.locator("cr-toggle").first
            toggle.wait_for(timeout=18000)
            if not toggle.evaluate("n=>n.checked"):
                toggle.click()
            p.goto(opt + "#nav=utils")
            p.get_by_text("Utilities", exact=True).first.click()
            with c.expect_page(timeout=22000) as prompt:
                p.locator("input[type=file]").last.set_input_files(str(staged))
            ask = prompt.value
            ask.wait_for_url(lambda u: "/ask.html" in u)
            ask.wait_for_function("()=>document.body?.innerText.includes('YourTube')", timeout=30000)
            ask.get_by_role("button", name=re.compile("^(Install|Reinstall|Update)$")).last.click(
                timeout=12000
            )
            listing = c.new_page()
            listing.goto(opt + "#nav=dashboard")
            line = listing.locator("tr").filter(has_text="YourTube").last
            line.locator('[title="Enabled"]').wait_for(timeout=25000)
            expect(line).to_contain_text(ver)
            print("PASS: installed and enabled", ver, flush=True)
            from urllib.parse import urlsplit
            import base64

            result = {
                "browser": c.browser.version,
                "manager": json.loads((ext / "manifest.json").read_text())["version"],
                "version": ver,
                "bundleSha256": hashlib.sha256(contents).hexdigest(),
                "conditions": "Official Tampermonkey; fresh signed-out profile; genuine public pages; no response interception, no account actions.",
                "pages": [],
            }
            for tab in list(c.pages):
                if tab != listing:
                    tab.close()
            routes = [
                ("search", "https://www.youtube.com/results?search_query=blender+open+movie"),
                ("watch", "https://www.youtube.com/watch?v=YE7VzlLtp-4"),
            ]
            if args.reader_only or args.playback_only:
                routes = routes[1:]
            if args.shell_only:
                routes = routes[:1]
                c.grant_permissions(["clipboard-read", "clipboard-write"], origin="https://www.youtube.com")
            if args.extra_surfaces:
                routes += [("channel", "https://www.youtube.com/@BlenderOfficial/videos")]
            discovered = set()
            for name, url in routes:
                pg = c.new_page()
                pg.set_default_timeout(12000)
                pg.bring_to_front()
                row = {"route": name, "url": url, "checks": []}
                result["pages"].append(row)
                try:
                    response = pg.goto(url, wait_until="domcontentloaded", timeout=42000)
                    row["http"] = response.status if response else None
                    pg.wait_for_function("()=>window.YourTube?.version", timeout=18000)
                    assert pg.evaluate("YourTube.version") == ver
                    pg.wait_for_timeout(2200)
                    if args.extra_surfaces and name in ("search", "channel", "watch"):
                        for kind, expression in [
                            ("shorts", r"^/shorts/[a-zA-Z0-9_-]{11}/?$"),
                            ("playlist", r"^/playlist\?list=PL[a-zA-Z0-9_-]+(?:&|$)"),
                        ]:
                            links = pg.evaluate(
                                '()=>Array.from(document.querySelectorAll("a[href]"),a=>a.origin===location.origin ? a.pathname+a.search : "")'
                            )
                            link = next((k for k in links if re.match(expression, k)), None)
                            if link and kind not in discovered:
                                discovered.add(kind)
                                routes.append((kind, "https://www.youtube.com" + link))
                    row["title"] = pg.title()
                    row["notice"] = pg.evaluate(
                        "()=>[...document.querySelectorAll('yt-playability-error-supported-renderers,.ytp-error-content-wrap')].filter(n=>n.getClientRects().length).map(n=>n.innerText.trim()).join(' ').slice(0,230)"
                    )
                    row["media"] = pg.evaluate(
                        "()=>{const v=document.querySelector('#movie_player video');return v?{ready:v.readyState,paused:v.paused,seconds:v.currentTime}:null}"
                    )
                    pg.evaluate("YourTube.openDashboard()")
                    pg.wait_for_function(
                        "()=>document.querySelectorAll('.ytb-card').length===YourTube.features.list().length"
                    )
                    pg.evaluate(
                        (Path(__file__).with_name("workbench.js"))
                        .read_text()
                        .replace("Object.assign(window,", "window.__controlAudit=Object.assign({},")
                    )
                    if args.playback_only:
                        focus = [x for x in args.playback_focus.split(",") if x]
                        pg.evaluate("x=>window.__playbackFocus=x", focus)
                        row["playback"] = pg.evaluate(
                            Path(__file__).with_name("site_playback.js").read_text()
                        )
                        if (
                            "pointer-wheel" in focus
                            and row["playback"]["status"] == "decoded public watch playback"
                        ):
                            from site_wheel import run

                            row["playback"]["rows"].append(run(pg))
                    elif args.shell_only:
                        row["shell"] = pg.evaluate(
                            Path(__file__)
                            .with_name("shell.js")
                            .read_text()
                            .replace(
                                "async () => {",
                                "async () => { const {q,pane,pick,set,trial,equal,wait,rows}=window.__controlAudit;",
                                1,
                            )
                        )
                    elif args.reader_only:
                        row["reader"] = pg.evaluate(Path(__file__).with_name("reader_probe.js").read_text())
                    else:
                        # One genuine pointer trial, in addition to the mounted DOM change trials.
                        row["pointer"] = pointer_trial(pg, out, name)
                        pg.evaluate(
                            "s=>window.siteTargets=s",
                            json.loads(Path(__file__).with_name("elements.json").read_text()),
                        )
                        pg.evaluate("()=>{window.documentToken=Math.random();}")
                        row["checks"] = pg.evaluate(Path(__file__).with_name("site_probes.js").read_text())
                        row["nested"] = pg.evaluate(Path(__file__).with_name("site_deep.js").read_text())
                        row["nested"].extend(
                            pg.evaluate(Path(__file__).with_name("site_extras.js").read_text())
                        )
                        if name == "shorts":
                            row["shortsPlayback"] = pg.evaluate(
                                Path(__file__).with_name("site_shorts.js").read_text()
                            )
                        if name == "search" and args.palettes:
                            table = contents.decode().split("const Nr = ([", 1)[1].split("]).map", 1)[0]
                            pg.evaluate(
                                "x=>window.__expectedPalette=x",
                                json.loads("[" + re.sub(r",\s*$", "", table) + "]"),
                            )
                            data = pg.evaluate(Path(__file__).with_name("site_palettes.js").read_text())
                            (out / "palettes.json").write_text(
                                json.dumps(
                                    {"bundleSha256": result["bundleSha256"], "route": url, **data}, indent=1
                                )
                                + "\n"
                            )
                            print(
                                "Public search palette pairs:",
                                sum(bool(x.get("pass")) for x in data["rows"]),
                                "/",
                                len(data["rows"]),
                                flush=True,
                            )
                    pg.evaluate("YourTube.closeDashboard()")
                    cd = c.new_cdp_session(pg)
                    image = cd.send(
                        "Page.captureScreenshot",
                        {"format": "jpeg", "quality": 70, "captureBeyondViewport": False},
                    )
                    (out / (name + ".jpg")).write_bytes(base64.b64decode(image["data"]))
                    cd.detach()
                except Exception as err:
                    row["error"] = str(err).split("Call log:")[0][:450]
                row["landed"] = urlsplit(pg.url).path
                pg.close()
                (out / "site.json").write_text(json.dumps(result, indent=1, ensure_ascii=False) + "\n")
                print(name, len(row["checks"]), row.get("error", ""), flush=True)
        finally:
            c.close()


if __name__ == "__main__":
    main()
