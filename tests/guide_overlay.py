#!/usr/bin/env python3
"""Offline CSS regression against the assembled userscript, not a YouTube emulator.

    python -m pip install playwright
    python tests/guide_overlay.py --browser /path/to/chromium

Without --browser, use the browser installed by `python -m playwright install chromium`.
No extensions, login, YouTube traffic, or changes to a real profile are needed.
"""
import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://guide-test.invalid'
PAGE = '''<!doctype html><meta charset="utf-8"><title>Guide paint test</title>
<style>
  body{margin:0} ytd-app{display:block} #underlay{height:100vh;background:coral}
  #guide{position:fixed;inset:0;display:block;visibility:hidden}
  #guide[opened]{visibility:visible} #scrim{position:absolute;inset:0;
    background:rgba(0,0,0,.5);opacity:0} #guide[opened]:not([persistent]) #scrim{opacity:1}
  #contentContainer{position:absolute;inset:0 auto 0 0;width:240px;background:white}
  #panel-caption{height:100%} #guide-content{height:100%}
</style><ytd-app><div id="underlay"></div><div id="app-drawer">
<tp-yt-app-drawer id="guide" class="ytd-app"><div id="scrim" class="tp-yt-app-drawer"></div>
<div id="non-panel" class="ytd-app"></div><div id="contentContainer" class="tp-yt-app-drawer">
<div id="guide-content" class="ytd-app"><div id="panel-caption">Guide</div></div>
</div></tp-yt-app-drawer></div></ytd-app><script src="/bundle.js"></script>'''


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--browser', help='Chromium executable; default is the Playwright build')
    ap.add_argument('--bundle', type=Path, default=ROOT / 'yourtube.user.js')
    args = ap.parse_args()
    bundle = args.bundle.read_bytes()
    cases = [('amoled', 'd-amoled', False, 'rgb(0, 0, 0)'),
             ('light', 'l-clean', False, 'rgb(255, 255, 255)'),
             ('glass-only', 'none', True, None),
             ('native control', 'none', False, None)]
    failures = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=args.browser, chromium_sandbox=True)
        ctx = browser.new_context(service_workers='block')

        def respond(route):
            if route.request.url == ORIGIN + '/fixture':
                route.fulfill(content_type='text/html; charset=utf-8', body=PAGE)
            elif route.request.url == ORIGIN + '/bundle.js':
                route.fulfill(content_type='application/javascript', body=bundle)
            else:
                route.abort()  # The fixture and test bundle are the only two resources.

        ctx.route('**/*', respond)
        try:
            for name, theme, glass, panel in cases:
                page = ctx.new_page()
                try:
                    # Normal persisted appearance preferences; no substitute theme stylesheet.
                    cfg = {'themeEngineOn': glass or theme != 'none', 'themeSelected': theme,
                           'themeGlassOverhaulOn': glass, 'updateCheckOn': False, 'safeMode': True}
                    page.add_init_script('localStorage.setItem("yourtube.cfg", '
                                         + json.dumps(json.dumps(cfg)) + ');'
                                         + 'addEventListener("yourtube:applied",()=>window.testApplied=true);')
                    page.goto(ORIGIN + '/fixture')
                    page.wait_for_function('()=>window.testApplied===true', timeout=12000)
                    if panel or glass:
                        style = '#ytb-theme-overhaul-style' if glass else '#ytb-theme-engine-style'
                        page.locator(style).wait_for(state='attached')
                    page.locator('#guide').evaluate("e=>e.setAttribute('opened','')")
                    def prop(sel, key):
                        return page.locator(sel).evaluate('(e,k)=>getComputedStyle(e)[k]', key)
                    for sel in ['#guide', '#app-drawer', '#non-panel']:
                        for key, want in [('backgroundColor', 'rgba(0, 0, 0, 0)'),
                                          ('backgroundImage', 'none'), ('backdropFilter', 'none')]:
                            got = prop(sel, key)
                            if got != want:
                                raise AssertionError(f'{sel}.{key}: expected {want}, got {got}')
                    if panel and prop('#contentContainer', 'backgroundColor') != panel:
                        raise AssertionError('panel lost the selected theme color')
                    if prop('#scrim', 'backgroundColor') != 'rgba(0, 0, 0, 0.5)':
                        raise AssertionError('userscript changed the native scrim color')
                    for opened, persistent, want in [(True, False, '1'), (True, True, '0'),
                                                       (False, False, '0')]:
                        page.locator('#guide').evaluate('''(e,s)=>{
                            e.toggleAttribute('opened',s[0]);e.toggleAttribute('persistent',s[1])
                        }''', [opened, persistent])
                        if prop('#scrim', 'opacity') != want:
                            raise AssertionError(f'changed native scrim opacity in {opened=}, {persistent=}')
                    print('PASS:', name)
                except AssertionError as exc:
                    failures.append(f'{name}: {exc}')
                finally:
                    page.close()
        finally:
            ctx.close()
            browser.close()
    if failures:
        raise SystemExit('\n'.join('FAIL: ' + f for f in failures))


if __name__ == '__main__':
    main()
