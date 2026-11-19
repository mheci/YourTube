#!/usr/bin/env python3
"""Exercise the actual dashboard, migration and shared Watch Journal styling on an offline watch document."""

import argparse
import hashlib
import json
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
LAB = ROOT / "tests/checkpoint_lab"
ORIGIN = "https://www.youtube.com"


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--browser", required=True)
    ap.add_argument("--out", type=Path)
    args = ap.parse_args()
    if args.out:
        args.out.mkdir(parents=True, exist_ok=True)
    bundle = (ROOT / "yourtube.user.js").read_bytes()
    version = json.loads((ROOT / "package.json").read_text())["version"]
    html = (
        (LAB / "watch.html")
        .read_text()
        .replace("</head>", '<script src="/lab/bundle.js"></script></head>')
    )
    # A genuine opener lets the test also verify keyboard focus restoration.
    html = html.replace(
        "</body>",
        '<button id="test-open" onclick="YourTube.openDashboard()">Open YourTube settings</button></body>',
    )
    cfg = {
        "dashMode": "dark",
        "dashLook": "terminal",
        "dashCat": "all",
        "themeEngineOn": False,
        "privacyPreset": "everyday",
        "themeSelected": "none",
        "updateCheckOn": False,
        "safeMode": True,
        "forceWatchedAccountHistory": False,
        "sessionRestoreOn": False,
        "sponsorblockOn": False,
        "silentToasts": True,
        "deArrowOn": False,
    }
    results = {
        "version": version,
        "sha256": hashlib.sha256(bundle).hexdigest(),
        "source": "assembled userscript / intercepted watch document",
        "checks": {},
        "screenshots": [],
    }
    with sync_playwright() as w:
        b = w.chromium.launch(
            executable_path=args.browser,
            chromium_sandbox=True,
            args=["--disable-dev-shm-usage"],
        )
        results["browser"] = b.version
        c = b.new_context(
            viewport={"width": 1280, "height": 860},
            device_scale_factor=1,
            service_workers="block",
            color_scheme="dark",
            accept_downloads=True,
        )
        c.add_init_script(
            'if(!localStorage.getItem("yourtube.cfg")) localStorage.setItem("yourtube.cfg",'
            + json.dumps(json.dumps(cfg))
            + ")"
        )

        def route(r):
            url = urlparse(r.request.url)
            if url.hostname != "www.youtube.com":
                return r.abort()
            if url.path == "/watch":
                return r.fulfill(body=html, content_type="text/html; charset=utf-8")
            if url.path == "/lab/bundle.js":
                return r.fulfill(
                    body=bundle, content_type="application/javascript; charset=utf-8"
                )
            if url.path == "/lab/dusk.jpg":
                return r.fulfill(
                    body=(LAB / "dusk.jpg").read_bytes(), content_type="image/jpeg"
                )
            if url.path == "/lab/dusk.webm":
                return r.fulfill(
                    body=(LAB / "dusk.webm").read_bytes(), content_type="video/webm"
                )
            return r.abort()

        c.route("**/*", route)
        p = c.new_page()
        errors = []
        p.on("pageerror", lambda exc: errors.append(str(exc)))
        p.set_default_timeout(10000)
        sel = '.ytb-dash[data-skin="journal"]'
        shell = p.locator(sel)
        search = shell.get_by_role(
            "searchbox", name="Search features or settings", exact=True
        )
        nav = shell.locator(".ytb-nav")
        regular = shell.locator(".ytb-nav-item")
        extent = lambda: shell.bounding_box()

        def check(name, condition, detail=True):
            assert condition, (name, detail)
            results["checks"][name] = detail
            print("PASS", name, flush=True)

        def shot(name):
            if args.out:
                p.screenshot(
                    path=args.out / (name + ".jpg"),
                    type="jpeg",
                    quality=82,
                    animations="disabled",
                )
                results["screenshots"].append(name + ".jpg")

        def paint():
            return shell.evaluate(
                "n=>{const c=getComputedStyle(n),t=getComputedStyle(n.querySelector('h1')),b=getComputedStyle(n.querySelector('.ytb-foot .primary'));return {paper:c.backgroundColor,ink:c.color,green:b.backgroundColor,mode:c.colorScheme,title:t.fontFamily,skin:n.dataset.skin}}"
            )

        def opened():
            shell.wait_for()
            p.wait_for_function(
                "()=>document.querySelectorAll('.ytb-dash .ytb-card').length===YourTube.features.list().length"
            )
            p.wait_for_timeout(150)

        def focus_open():
            p.evaluate(
                "()=>{const b=document.querySelector('#test-open');b.focus({preventScroll:true});b.click()}"
            )
            opened()

        try:
            p.goto(ORIGIN + "/watch?v=FieldFilm01", wait_until="domcontentloaded")
            p.wait_for_function("()=>!!window.YourTube?.features")
            focus_open()
            faces = paint()
            check(
                "Journal paper, green controls and serif headings in a dark browser",
                faces["paper"] == "rgb(255, 251, 239)"
                and faces["green"] == "rgb(34, 91, 72)"
                and faces["mode"] == "light"
                and "Georgia" in faces["title"],
                faces,
            )
            legacy = lambda: p.evaluate(
                '()=>["dashMode","dashLook"].filter(k=>YourTube.cfg[k]!==undefined)'
            )
            check("Legacy saved skin preferences ignored", not legacy())
            check(
                "No look picker or dark-mode control",
                shell.locator(
                    '[data-look],.ytb-looksel,[title*="dashboard dark" i]'
                ).count()
                == 0
                and not shell.get_attribute("data-look"),
            )
            n = p.evaluate("YourTube.features.list().length")
            check(
                "Every registered feature has one card",
                n > 0
                and n == shell.locator(".ytb-card").count()
                and set(
                    shell.locator(".ytb-card").evaluate_all(
                        "a=>a.map(n=>n.dataset.feat)"
                    )
                )
                == set(p.evaluate("YourTube.features.list().map(c=>c.id)")),
                n,
            )
            check(
                "Desktop index and local preferences visible",
                regular.first.is_visible()
                and shell.locator(".ytb-core").is_visible()
                and extent()["width"] >= 800,
                extent(),
            )
            check(
                "Host header CSS cannot crop the journal masthead",
                shell.locator(".ytb-dhdr").evaluate(
                    "h=>h.clientWidth>=h.parentNode.clientWidth-1 && h.scrollHeight<=h.clientHeight+1"
                ),
            )
            shot("dashboard-desktop")
            p.evaluate(
                '()=>{YourTube.setCfg("dashLook","pixel");YourTube.setCfgMany({dashMode:"dark",dashLook:"noir"})}'
            )
            check(
                "Retired keys cannot be reapplied through settings API",
                not legacy() and paint() == faces,
            )
            nav.locator('[data-cat="audio"]').click()
            p.wait_for_function(
                "()=>document.querySelector('.yj-view-title').textContent==='Audio'"
            )
            check(
                "Category filters real cards",
                set(
                    shell.locator(".ytb-card:visible").evaluate_all(
                        "a=>a.map(n=>n.dataset.cat)"
                    )
                )
                == {"audio"},
            )
            search.fill("no such feature 99827")
            shell.locator(".yj-empty").wait_for()
            check(
                "Empty search offers a reset",
                shell.locator(".ytb-card:visible").count() == 0,
            )
            search.press("Escape")
            check(
                "Clearing a search restores its category",
                shell.locator(".yj-view-title").inner_text() == "Audio",
            )
            nav.locator('[data-cat="data"]').focus()
            p.keyboard.press("/")
            check(
                "Keyboard shortcut focuses search",
                search.evaluate("n=>n===document.activeElement"),
            )
            # Non-current synthetic records, stored through the public history API.
            p.evaluate(
                """async()=>{for(const [videoId,title,pos,pinned] of [['FieldFilm02','An atlas of shadows',73,1],['FieldFilm03','Mapping the evening sky',24,0]])await YourTube.history.put({videoId,title,channel:'North Range Studio',duration:120,lastPosition:pos,progress:Math.round(pos/120*100),pinned,completed:false,lastWatched:Date.now(),sessions:[]})}"""
            )
            shell.locator(".yj-jump").click()
            card = shell.locator('[data-feat="session-restore"]')
            switch = card.get_by_role("checkbox", name="Session History", exact=True)
            switch.press("/")
            check("Search shortcut works from a focused switch", search.evaluate("n=>n===document.activeElement"))
            switch.focus()
            switch.press("Space")
            journal = card.locator(".ytb-watch-journal")
            journal.locator(".name").filter(has_text="An atlas of shadows").wait_for()
            same = journal.evaluate(
                "n=>{const s=n.shadowRoot;return [getComputedStyle(s.querySelector('.book')).backgroundColor,getComputedStyle(s.querySelector('.go')).backgroundColor]}"
            )
            check(
                "Live Watch Journal and dashboard share the same surface and accent",
                same == [faces["paper"], faces["green"]],
                same,
            )
            check(
                "Keyboard switch actually enabled the recorder",
                p.evaluate("YourTube.cfg.sessionRestoreOn") is True,
            )
            shot("dashboard-watch-journal")
            # The gallery of YouTube palettes still works separately from this shell.
            p.evaluate(
                "()=>{YourTube.setCfgMany({themeEngineOn:true,themeSelected:'d-amoled',themeOverhaulOn:true});YourTube.features.apply('theme-engine')}"
            )
            p.wait_for_function(
                "()=>!!document.querySelector('#ytb-theme-engine-style')"
            )
            check("Site palette and overhaul cannot reskin dashboard", paint() == faces)
            p.evaluate(
                "()=>{YourTube.setCfgMany({themeEngineOn:false,themeSelected:'none',themeOverhaulOn:false});YourTube.features.apply('theme-engine')}"
            )
            nav.locator('[data-cat="core"]').click()
            check(
                "Category selection clears a global search",
                search.input_value() == "" and shell.locator(".ytb-core").is_visible(),
            )
            preset = shell.get_by_label("Experience preset")
            preset.select_option("stealth")
            p.wait_for_function("()=>YourTube.cfg.privacyPreset==='stealth'")
            check(
                "Native preference controls remain operable",
                preset.input_value() == "stealth",
            )
            with p.expect_download() as dl:
                shell.get_by_text("Export settings", exact=True).click()
            check(
                "Export settings still downloads a backup",
                dl.value.suggested_filename.startswith("yourtube-settings-"),
            )
            state = json.loads(dl.value.path().read_text())["cfg"]
            check(
                "Export preserves settings and omits retired keys",
                "dashLook" not in state
                and "dashMode" not in state
                and state.get("privacyPreset") == "stealth",
            )
            state.update(
                {
                    "dashMode": "dark",
                    "dashLook": "noir",
                    "sessionResumeDesign": "signal",
                    "dashCat": "core",
                }
            )
            with p.expect_file_chooser() as chooser:
                shell.get_by_text("Import settings", exact=True).click()
            chooser.value.set_files(
                {
                    "name": "old-config.json",
                    "mimeType": "application/json",
                    "buffer": json.dumps({"cfg": state, "history": []}).encode(),
                }
            )
            p.wait_for_function("()=>YourTube.cfg.sessionResumeDesign==='signal'")
            check(
                "Legacy backup imports without changing skin or unrelated values",
                not legacy()
                and paint() == faces
                and p.evaluate("YourTube.cfg.privacyPreset") == "stealth",
                {
                    "legacy": legacy(),
                    "paint": paint(),
                    "preset": p.evaluate("YourTube.cfg.privacyPreset"),
                    "sentPreset": state.get("privacyPreset"),
                    "cfgCount": len(state),
                },
            )
            shell.get_by_role("button", name="Dock to top-right").click()
            g = extent()
            p.mouse.move(g["x"] + 91, g["y"] + 25)
            p.mouse.down()
            p.mouse.move(g["x"] + 59, g["y"] + 40, steps=5)
            p.mouse.up()
            p.wait_for_timeout(80)
            h = extent()
            check(
                "Drag moves the floating dashboard",
                abs((h["x"] - g["x"]) + 32) < 3 and abs((h["y"] - g["y"]) - 15) < 3,
                h,
            )
            grip = shell.locator(".ytb-dresize").bounding_box()
            p.mouse.move(grip["x"] + grip["width"] - 4, grip["y"] + grip["height"] - 4)
            p.mouse.down()
            p.mouse.move(grip["x"] - 64, grip["y"] - 27, steps=5)
            p.mouse.up()
            p.wait_for_timeout(160)
            r = extent()
            check(
                "Resize updates saved geometry",
                r["width"] < h["width"] - 50
                and abs(p.evaluate("YourTube.cfg.dashW") - r["width"]) <= 1,
                r,
            )
            shell.get_by_role("button", name="Close dashboard").click()
            check(
                "Closing restores keyboard focus to the opener",
                p.evaluate("document.activeElement.id") == "test-open",
            )
            focus_open()
            check(
                "Reopen has one shell, one stylesheet, previous dimensions and category",
                p.locator(".ytb-dash").count() == 1
                and p.locator("#ytb-dash-style").count() == 1
                and abs(extent()["width"] - r["width"]) < 1
                and shell.locator(".yj-view-title").inner_text() == "Quick settings",
            )
            p.set_viewport_size({"width": 390, "height": 844})
            picker = shell.get_by_label("Feature category", exact=True)
            picker.wait_for()
            picker.select_option("data")
            p.wait_for_function(
                "()=>document.querySelector('.yj-view-title').textContent==='Data & Notes'"
            )
            search.fill("sessionRestoreOn")
            journal.locator(".book").wait_for()
            p.wait_for_timeout(120)
            dims = extent()
            check(
                "Narrow layout preserves category navigation and viewport bounds",
                picker.is_visible()
                and not regular.first.is_visible()
                and dims["x"] >= 0
                and dims["x"] + dims["width"] <= 391
                and dims["y"] + dims["height"] <= 845,
                dims,
            )
            check(
                "Mobile reading surface has no horizontal overflow",
                shell.locator(".ytb-body").evaluate(
                    "n=>n.scrollWidth<=n.clientWidth+1"
                ),
            )
            check(
                "Global filter is announced in the mobile picker",
                picker.input_value() == "__search"
                and int(shell.locator(".ytb-card:visible").count()) >= 1,
            )
            search.fill("Session History")
            p.wait_for_function(
                "()=>document.querySelector('.yj-meta').textContent==='1 match'"
            )
            shot("dashboard-narrow")
            search.press("Escape")
            search.press("Escape")
            shell.wait_for(state="detached")
            p.reload(wait_until="domcontentloaded")
            p.wait_for_function("()=>!!window.YourTube?.features")
            focus_open()
            check(
                "Reload preserves only Journal and imports the resume design independently",
                not legacy()
                and paint() == faces
                and p.evaluate("YourTube.cfg.sessionResumeDesign") == "signal",
            )
            reset = shell.get_by_role("button", name="Reset to defaults", exact=True)
            p.once("dialog", lambda d: d.dismiss())
            reset.click()
            check(
                "Cancelling reset leaves settings unchanged",
                p.evaluate("YourTube.cfg.privacyPreset") == "stealth",
            )
            p.once("dialog", lambda d: d.accept())
            reset.click()
            p.wait_for_function(
                "()=>YourTube.cfg.privacyPreset==='everyday' && document.querySelector('.yj-view-title')?.textContent==='All features'"
            )
            check(
                "Confirmed reset retains stored journal entries",
                p.evaluate("async()=>!!(await YourTube.history.get('FieldFilm02'))")
                and not legacy(),
            )
            check("No uncaught main-page errors", not errors, errors)
            fresh = b.new_context(
                viewport={"width": 980, "height": 740},
                service_workers="block",
                color_scheme="light",
                reduced_motion="reduce",
            )
            fresh.route("**/*", route)
            try:
                new = fresh.new_page()
                new.goto(ORIGIN + "/watch?v=FieldFilm01", wait_until="domcontentloaded")
                new.wait_for_function("()=>!!window.YourTube?.features")
                new.evaluate("YourTube.openDashboard()")
                paper = new.locator(sel)
                paper.wait_for()
                check(
                    "Clean install opens directly in Journal with motion reduction respected",
                    paper.locator(".yj-view-title").inner_text() == "All features"
                    and paper.evaluate(
                        "n=>getComputedStyle(n).backgroundColor==='rgb(255, 251, 239)' && getComputedStyle(n).transitionDuration==='0s'"
                    ),
                )
            finally:
                fresh.close()
        finally:
            if args.out:
                (args.out / "dashboard-results.json").write_text(
                    json.dumps(results, indent=2) + "\n"
                )
            c.close()
            b.close()
    print(str(len(results["checks"])) + " dashboard checks passed on " + version)


if __name__ == "__main__":
    main()
