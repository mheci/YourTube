#!/usr/bin/env python3
"""Compare two builds on signed-out public YouTube search with fresh profiles.

This sends real requests to YouTube. Network/UI vary over time; do not interpret
these small samples as a general performance claim. Never use a personal profile.
"""
import argparse,hashlib,json,statistics,time
from pathlib import Path
from playwright.sync_api import sync_playwright
from compare_fixture import process_stats,CFG
URL='https://www.youtube.com/results?search_query=science'

def sample(pw,executable,bundle):
    browser=pw.chromium.launch(executable_path=executable,chromium_sandbox=True)
    try:
        browser_cdp=browser.new_browser_cdp_session();context=browser.new_context();page=context.new_page()
        page.add_init_script('localStorage.setItem("yourtube.cfg",'+json.dumps(json.dumps(CFG))+');\n'+bundle.decode('utf-8-sig'))
        cdp=context.new_cdp_session(page);cdp.send('Performance.enable');cdp.send('Network.enable')
        counts={'requests':0,'encodedBytes':0,'failedRequests':0}
        cdp.on('Network.requestWillBeSent',lambda e:counts.__setitem__('requests',counts['requests']+1))
        cdp.on('Network.loadingFinished',lambda e:counts.__setitem__('encodedBytes',counts['encodedBytes']+e.get('encodedDataLength',0)))
        cdp.on('Network.loadingFailed',lambda e:counts.__setitem__('failedRequests',counts['failedRequests']+1))
        before=process_stats(browser_cdp);start=time.perf_counter()
        response=page.goto(URL,wait_until='domcontentloaded',timeout=35000)
        page.wait_for_function("()=>!!window.YourTube?.features && !!document.querySelector('ytd-video-renderer')",timeout=30000)
        navigation=(time.perf_counter()-start)*1000
        start=time.perf_counter();page.evaluate('YourTube.openDashboard()')
        page.wait_for_function("()=>document.querySelectorAll('.ytb-card').length===YourTube.features.list().length",timeout=30000)
        dashboard=(time.perf_counter()-start)*1000
        start=time.perf_counter();page.locator('.ytb-search').fill('theme')
        page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
        interaction=(time.perf_counter()-start)*1000
        # Fixed observation interval; this includes continued YouTube requests.
        page.wait_for_timeout(5000)
        metrics={m['name']:m['value'] for m in cdp.send('Performance.getMetrics')['metrics']}
        after=process_stats(browser_cdp)
        result={'httpStatus':response.status,'searchCards':page.locator('ytd-video-renderer').count(),
                'initialNavigationMs':navigation,'dashboardOpenMs':dashboard,'searchInteractionMs':interaction,
                'rendererTaskSeconds':metrics.get('TaskDuration'),'jsHeapUsedBytes':metrics.get('JSHeapUsedSize'),
                'browserTreeCpuSeconds':max(0,after['cpuSeconds']-before['cpuSeconds']),'browserTreeRssBytes':after['processRssBytes'],**counts}
        return result
    finally:
        browser.close()

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--baseline',type=Path,required=True);ap.add_argument('--candidate',type=Path,required=True)
    ap.add_argument('--browser',required=True);ap.add_argument('--out',type=Path,required=True);ap.add_argument('--rounds',type=int,default=3)
    a=ap.parse_args()
    if not 1<=a.rounds<=10: ap.error('rounds must be 1–10')
    bundles={'baseline':a.baseline.read_bytes(),'candidate':a.candidate.read_bytes()}
    results={name:{'sha256':hashlib.sha256(buf).hexdigest(),'samples':[]} for name,buf in bundles.items()}
    errors=[]
    with sync_playwright() as pw:
        for i in range(a.rounds):
            for name in (('baseline','candidate') if i%2==0 else ('candidate','baseline')):
                try:
                    row=sample(pw,a.browser,bundles[name]);results[name]['samples'].append(row)
                    print(f'{name} round {i+1}: {row["searchCards"]} cards, {row["initialNavigationMs"]:.0f}ms',flush=True)
                except Exception as e:
                    errors.append({'round':i+1,'build':name,'error':str(e).split('\n')[0]});print('ERROR',name,errors[-1]['error'],flush=True)
    for result in results.values():
        if result['samples']:result['median']={k:statistics.median(row[k] for row in result['samples']) for k in result['samples'][0] if result['samples'][0][k] is not None}
    report={'method':'signed-out public YouTube search, fresh isolated profiles, direct userscript injection, alternating fresh Chromium processes, five-second follow-up',
            'limitations':['Results and traffic vary with YouTube responses, experiments, time and network; sample is not representative.','No decoded video playback or authenticated account.','RSS sums process resident sets and can double-count shared pages.','Network bytes are CDP encoded transfer for completed requests, not application payload or a fixed-size comparison.'],
            'rounds':a.rounds,'results':results,'errors':errors}
    a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps(report,indent=2)+'\n')
    print('Saved',a.out)
    if errors: raise SystemExit(1)
if __name__=='__main__':main()
