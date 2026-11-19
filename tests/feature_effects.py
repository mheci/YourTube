#!/usr/bin/env python3
"""Offline interaction regressions for previously ineffective controls. Tests the built bundle,
not copies of feature handlers. All requests are intercepted, no account or external services.
"""

import argparse, json
from pathlib import Path
from playwright.sync_api import sync_playwright
from guide_overlay import ROOT

ORIGIN = "https://www.youtube.com"
Q = "document.querySelector"
EMPTY = "<ytd-app><div id='stage'></div></ytd-app>"
BASE = {
    "safeMode": True,
    "themeEngineOn": False,
    "updateCheckOn": False,
    "silentToasts": False,
    "forceCC": False,
    "autoSkipAdBtn": False,
    "geoOverrideOn": False,
    "sortSearchOn": False,
    "notificationCleanOn": False,
    "sleepTimerOn": False,
    "subGroupsOn": False,
    "keymapOn": False,
    "copyLinkCleanerOn": False,
    "defaultOriginalAudioOn": False,
    "hideCards": False,
    "hideEndscreen": False,
    "shortenShareUrlOn": False,
    "removeRedirectUrlsOn": False,
    "elementsControlOn": False,
    "defaultChannelTab": "featured",
    "channelLandingTab": "home",
}


def run(args):
    errors = []
    bundle = args.bundle.read_bytes()
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=args.browser, chromium_sandbox=True)
        c = b.new_context(service_workers="block")
        c.route(
            "**/*",
            lambda r: (
                r.fulfill(body=bundle, content_type="application/javascript")
                if r.request.url == ORIGIN + "/bundle.js"
                else (
                    r.fulfill(
                        body='<meta charset="utf-8">'
                        + EMPTY
                        + '<script src="/bundle.js"></script>',
                        content_type="text/html",
                    )
                    if r.request.resource_type == "document"
                    and r.request.url.startswith(ORIGIN + "/")
                    else r.abort()
                )
            ),
        )
        p = c.new_page()
        p.set_default_timeout(4250)
        p.add_init_script(
            'localStorage.setItem("yourtube.cfg",'
            + json.dumps(json.dumps(BASE))
            + ');addEventListener("yourtube:applied",()=>window.booted=true);'
        )
        p.goto(ORIGIN + "/results?search_query=fixture")
        p.wait_for_function("()=>window.booted")
        p.wait_for_timeout(400)

        def fixture(html):
            p.locator("#stage").evaluate("(s,h)=>s.innerHTML=h", html)

        def cfg(**data):
            p.evaluate("o=>YourTube.setCfgMany(o)", data)
            p.wait_for_timeout(330)

        def until(expr):
            p.wait_for_function("()=>(" + expr + ")", timeout=4100)

        def ok(name, fn):
            try:
                fn()
                print("PASS", name)
            except Exception as ex:
                errors.append(name + ": " + str(ex).split("\n")[0])
                print("FAIL", name)

        def cards():
            fixture(
                '<button class="ytp-cards-button">i</button><div class="ytp-cards-teaser">End teaser</div><button class="ytp-subtitles-button">CC</button>'
            )
            cfg(
                hideCards=True,
                hideEndscreen=True,
                elementsControlOn=True,
                elementsControlHidden={"player-subtitles": True},
            )
            until(
                "[...document.querySelector('#stage').children].every(n=>getComputedStyle(n).display==='none')"
            )
            cfg(hideCards=False, hideEndscreen=False, elementsControlOn=False)
            until(
                "[...document.querySelector('#stage').children].every(n=>getComputedStyle(n).display!=='none')"
            )

        ok("native card, teaser and CC selectors; switch off restores them", cards)

        def captions():
            p.evaluate("history.replaceState({},'', '/watch?v=LabVideo001')")
            fixture(
                '<div id="movie_player"><video class="html5-main-video"></video><button class="ytp-subtitles-button" aria-pressed="false" onclick="this.setAttribute(\'aria-pressed\',String(this.getAttribute(\'aria-pressed\')!==\'true\'))">CC</button></div>'
            )
            cfg(forceCC=True, ccRespectManualOff=True, ccSkipMusic=False)
            until(
                "document.querySelector('.ytp-subtitles-button').getAttribute('aria-pressed')==='true'"
            )
            p.locator(".ytp-subtitles-button").click()
            p.wait_for_timeout(850)
            assert (
                p.locator(".ytp-subtitles-button").get_attribute("aria-pressed")
                == "false"
            )
            cfg(forceCC=False)

        ok("captions fallback and manual-off grace", captions)

        def links():
            fixture(
                '<a id="one" href="/redirect?q=https%3A%2F%2Fexample.org%2Fa">Read</a><a id="share" href="https://youtu.be/LabVideo001?t=22&si=no">Share</a>'
            )
            cfg(removeRedirectUrlsOn=True, shortenShareUrlOn=True)
            until("one.href==='https://example.org/a'&&share.search==='?t=22'")
            p.locator("#share").evaluate(
                "a=>a.href='https://youtu.be/LabVideo002?si=new&t=8&list=A%26B#clip'"
            )
            until("share.href==='https://youtu.be/LabVideo002?t=8&list=A%26B#clip'")
            cfg(removeRedirectUrlsOn=False, shortenShareUrlOn=False)

        ok(
            "relative redirect, reused share link, preserved list encoding and fragment",
            links,
        )

        def copy():
            fixture(
                '<span id="copy">https://youtu.be/LabVideo001?t=5&amp;si=ignored</span>'
            )
            cfg(copyLinkCleanerOn=True)
            actual = p.evaluate(
                """()=>{const range=document.createRange();range.selectNodeContents(document.querySelector('#copy'));getSelection().removeAllRanges();getSelection().addRange(range);const cb=new DataTransfer();document.querySelector('#copy').dispatchEvent(new ClipboardEvent('copy',{clipboardData:cb,bubbles:true,cancelable:true}));return cb.getData('text/plain')}"""
            )
            assert actual == "https://youtu.be/LabVideo001?t=5", actual
            cfg(copyLinkCleanerOn=False)

        ok("normal selected URL copy with an initially empty clipboard", copy)

        def cookiegeo():
            fixture("")
            p.evaluate(
                "document.cookie='PREF=f6=64&volume=70; path=/; Secure';document.cookie='VISITOR_PRIVACY_METADATA=fixture;path=/;Secure';document.cookie='HL=en;path=/;Secure';YourTube.features.apply('geo-override')"
            )
            until(
                "document.cookie.includes('PREF=f6=64&volume=70') && document.cookie.includes('VISITOR_PRIVACY_METADATA=fixture')"
            )
            cfg(
                geoOverrideOn=True,
                geoPatchNavigator=True,
                geoPatchBeacon=False,
                geoLang="fr",
                geoRegion="FR",
            )
            until("navigator.language==='fr'&&document.cookie.includes('HL=fr')")
            cfg(geoPatchNavigator=False)
            until("navigator.language!=='fr'")
            cfg(geoOverrideOn=False)
            until(
                "document.cookie.includes('HL=en')&&document.cookie.includes('PREF=f6=64&volume=70')&&document.cookie.includes('VISITOR_PRIVACY_METADATA=fixture')"
            )

        ok(
            "independent locale switches and preservation of unrelated cookies",
            cookiegeo,
        )

        def notices():
            fixture(
                '<ytd-multi-page-menu-renderer><div id="header"></div><button id="native" onclick="window.called=(window.called||0)+1">Mark all as read</button></ytd-multi-page-menu-renderer>'
            )
            cfg(notificationCleanOn=True)
            p.locator(".ytb-ui-mark-read").click()
            until("window.called===1")
            cfg(notificationCleanOn=False)

        ok("mark-all-read calls the native control once, not itself", notices)

        def keymap():
            fixture("<video></video>")
            cfg(keymap={"speedUp": "alt+keyu"}, keymapOn=False, speedStep=0.5)
            p.keyboard.press("Alt+u")
            assert p.locator("video").evaluate("n=>n.playbackRate") == 1
            cfg(keymapOn=True)
            p.keyboard.press("Alt+u")
            until("document.querySelector('video').playbackRate===1.5")
            cfg(keymapOn=False)

        ok("keymap master actually gates saved bindings", keymap)

        def retired():
            ids = ["sort-search", "sleep-timer", "default-audio-track", "perf-mode"]
            assert p.evaluate("ids=>ids.every(id=>!YourTube.features.get(id))", ids)

        ok("removed search sorting, sleep timer, audio-track and performance cards stay retired", retired)

        def dates():
            p.evaluate("history.replaceState({},'', '/watch?v=LabVideo001')")
            fixture('<div id="date-text">Two days ago</div>')
            p.evaluate(
                "window.ytInitialPlayerResponse={videoDetails:{videoId:'LabVideo001'},microformat:{playerMicroformatRenderer:{publishDate:'2020-09-13'}}}"
            )
            cfg(
                exactDatesOn=True,
                exactDatesWatch=True,
                exactDatesCards=False,
                exactDatesFormat="dd/MM/yyyy",
            )
            until(
                "document.querySelector('[data-ytb-abs-watch]')?.textContent==='13/09/2020'"
            )
            cfg(exactDatesFormat="yyyy-MM-dd")
            until(
                "document.querySelector('[data-ytb-abs-watch]')?.textContent==='2020-09-13'"
            )
            p.evaluate(
                "history.pushState({},'', '/watch?v=LabVideo002');document.dispatchEvent(new Event('yt-navigate-finish'))"
            )
            p.wait_for_timeout(1600)
            assert not p.locator(
                "[data-ytb-abs-watch]"
            ).count(), "previous video date left on new route"
            cfg(exactDatesOn=False)
            until("document.getElementById('date-text').textContent==='Two days ago'")

        ok("watch date, format change, same-document navigation and teardown", dates)

        def account_privacy():
            # No calls to an account API. This tests rejection of pending image work.
            p.evaluate("history.replaceState({},'', '/results?search_query=fixture')")
            fixture(
                '<ytd-video-renderer><a id="thumbnail" href="/watch?v=LabVideo002"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBA=="></a></ytd-video-renderer>'
            )
            p.evaluate(
                """()=>{window.releaseThumb=null;window.GM_xmlhttpRequest=(o)=>{if(o.url.includes('branding')){window.releaseThumb=()=>o.onload({status:200,responseText:JSON.stringify({thumbnails:[{original:false,timestamp:12.6}]})});}}}"""
            )
            cfg(
                privacyPreset="everyday",
                safeMode=False,
                deArrowOn=True,
                deArrowTitles=False,
                deArrowThumbs=True,
            )
            p.wait_for_function('()=>typeof releaseThumb==="function"', timeout=12000)
            cfg(privacyPreset="maximum")
            p.evaluate("()=>releaseThumb()")
            p.wait_for_timeout(230)
            assert (
                p.locator("#thumbnail img").get_attribute("src").startswith("data:")
            ), "late third-party image applied in Maximum mode"
            cfg(deArrowOn=False)

        ok(
            "Maximum privacy rejects a thumbnail response arriving after the switch",
            account_privacy,
        )
        c.close()
        b.close()
    if errors:
        raise SystemExit("\n".join(errors))


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--browser")
    ap.add_argument("--bundle", type=Path, default=ROOT / "yourtube.user.js")
    run(ap.parse_args())
