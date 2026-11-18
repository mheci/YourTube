#!/usr/bin/env python3
"""Check actual assembled theme CSS for every catalog row, every overhaul switch pair,
and closed/modal/persistent guide states. Offline, no YouTube account. Run from anywhere.
"""

import argparse, json, re
from pathlib import Path
from playwright.sync_api import sync_playwright
from guide_overlay import ROOT, ORIGIN, PAGE


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--browser")
    ap.add_argument("--bundle", type=Path, default=ROOT / "yourtube.user.js")
    args = ap.parse_args()
    bundle = args.bundle.read_bytes()
    part = bundle.decode().split("const Nr = ([", 1)[1].split("]).map", 1)[0]
    rows = json.loads("[" + re.sub(r",\s*$", "", part) + "]")
    assert len(rows) == len(set(r[0] for r in rows)) and any(
        r[0] == "none" for r in rows
    )
    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            executable_path=args.browser, chromium_sandbox=True
        )
        c = browser.new_context(service_workers="block")
        p = c.new_page()
        p.route(
            "**/*",
            lambda r: (
                r.fulfill(body=PAGE, content_type="text/html")
                if r.request.url == ORIGIN + "/fixture"
                else (
                    r.fulfill(body=bundle, content_type="application/javascript")
                    if r.request.url == ORIGIN + "/bundle.js"
                    else r.abort()
                )
            ),
        )
        p.add_init_script(
            "localStorage.setItem('yourtube.cfg',JSON.stringify({themeEngineOn:true,updateCheckOn:false,safeMode:true}));addEventListener('yourtube:applied',()=>window.booted=true)"
        )
        p.goto(ORIGIN + "/fixture")
        p.wait_for_function("()=>window.booted")
        errors = []
        n = 0
        for glass, advanced in [
            (False, False),
            (True, False),
            (False, True),
            (True, True),
        ]:
            result = p.evaluate(
                """([rows,glass,advanced])=>{const bad=[];const q=s=>document.querySelector(s),guide=q('#guide'),panel=q('#contentContainer'),scrim=q('#scrim');const zero='rgba(0, 0, 0, 0)';
            for(const [id,,mode,vars] of rows){YourTube.setCfgMany({themeEngineOn:true,themeSelected:id,themeGlassOverhaulOn:glass,themeOverhaulOn:advanced});YourTube.features.apply('theme-engine');
             const fail=k=>bad.push(id+': '+k);if(!!q('#ytb-theme-overhaul-style')!==(glass||advanced))fail('overhaul not applied');if(!!q('#ytb-theme-engine-style')!==(id!=='none'))fail('theme style missing/unexpected');
             if(id!=='none'&&getComputedStyle(document.documentElement).getPropertyValue('--yt-spec-base-background').trim().toLowerCase()!==vars[0].toLowerCase())fail('palette did not switch');
             for(const [open,wide,op] of [[false,false,'0'],[true,false,'1'],[true,true,'0']]){guide.toggleAttribute('opened',open);guide.toggleAttribute('persistent',wide);for(const s of ['#guide','#non-panel','#app-drawer']){const cs=getComputedStyle(q(s));if(cs.backgroundColor!==zero||cs.backgroundImage!=='none'||cs.backdropFilter!=='none')fail('host paint '+s)} const sc=getComputedStyle(scrim);if(sc.backgroundColor!=='rgba(0, 0, 0, 0.5)'||sc.opacity!==op)fail('scrim '+open+'/'+wide);if(open&&getComputedStyle(panel).width!=='240px')fail('panel width');}
            }return bad}""",
                [rows, glass, advanced],
            )
            errors.extend(result)
            n += len(rows) * 3
        c.close()
        browser.close()
    if errors:
        raise SystemExit(str(len(errors)) + " failures: " + str(errors[:12]))
    print(
        f"PASS {len(rows)} palettes × 4 overhaul settings × 3 guide states = {n} cases"
    )


if __name__ == "__main__":
    main()
