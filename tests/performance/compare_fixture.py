#!/usr/bin/env python3
"""Compare two builds in an isolated, network-denied YouTube-shaped fixture.

This is a controlled diagnostic, NOT a measurement of live YouTube or proof of
real-world savings. Use the same Chromium executable and quiet host for both.
"""
import argparse, hashlib, json, statistics, time
from pathlib import Path
from playwright.sync_api import sync_playwright

ORIGIN = 'https://www.youtube.com'
CARDS = ''.join(f'<ytd-video-renderer><a id="video-title" href="/watch?v=Bench{i:06d}">Science and technology field video {i}</a><div id="metadata-line">2 days ago · {i+10}K views</div><span id="channel-name">Channel {i%15}</span></ytd-video-renderer>' for i in range(150))
HTML = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Fixture</title></head><body><ytd-app><ytd-search><div id="primary"><ytd-item-section-renderer><div id="contents">'+CARDS+'</div></ytd-item-section-renderer></div></ytd-search></ytd-app><script src="/audit/bundle.js"></script></body></html>').encode()
CFG = {'safeMode':True,'updateCheckOn':False,'themeEngineOn':False,'sessionRestoreOn':False,'algoIntelligenceOn':False,'sponsorblockOn':False,'dearrowOn':False,'forceCC':False,'silentToasts':True}

def process_stats(browser_cdp):
    entries=browser_cdp.send('SystemInfo.getProcessInfo')['processInfo']
    rss=0
    for entry in entries:
        try:
            status=Path('/proc')/str(entry['id'])/'status'
            for line in status.read_text().splitlines():
                if line.startswith('VmRSS:'):
                    rss += int(line.split()[1])*1024
                    break
        except (OSError,ValueError):
            pass
    return {'cpuSeconds':sum(x.get('cpuTime',0) for x in entries), 'processRssBytes':rss, 'processes':len(entries)}

def sample(pw, browser_path, bundle):
    browser=pw.chromium.launch(executable_path=browser_path,chromium_sandbox=True)
    bc=browser.new_browser_cdp_session(); context=browser.new_context(service_workers='block')
    counts={'servedRequests':0,'servedBodyBytes':0,'blockedRequests':0}
    def route(r):
        url=r.request.url
        if url==ORIGIN+'/audit/bundle.js': body,kind=bundle,'application/javascript'
        elif r.request.resource_type=='document' and url.startswith(ORIGIN+'/'): body,kind=HTML,'text/html'
        else:
            counts['blockedRequests']+=1; return r.abort()
        counts['servedRequests']+=1;counts['servedBodyBytes']+=len(body)
        r.fulfill(body=body,content_type=kind)
    context.route('**/*',route)
    context.add_init_script('localStorage.setItem("yourtube.cfg",'+json.dumps(json.dumps(CFG))+');addEventListener("yourtube:applied",()=>window.__benchApplied=true);')
    page=context.new_page();cdp=context.new_cdp_session(page);cdp.send('Performance.enable')
    before=process_stats(bc); start=time.perf_counter()
    page.goto(ORIGIN+'/results?search_query=benchmark',wait_until='domcontentloaded')
    page.wait_for_function('()=>window.__benchApplied && window.YourTube?.features', timeout=25000)
    navigation=(time.perf_counter()-start)*1000
    start=time.perf_counter();page.evaluate('YourTube.openDashboard()')
    page.wait_for_function("()=>document.querySelectorAll('.ytb-card').length===YourTube.features.list().length",timeout=25000)
    dashboard=(time.perf_counter()-start)*1000
    search=page.locator('.ytb-search'); search.wait_for(); start=time.perf_counter()
    search.fill('theme');page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
    interaction=(time.perf_counter()-start)*1000
    start=time.perf_counter()
    page.evaluate("()=>{history.pushState({},'', '/results?search_query=next');document.dispatchEvent(new Event('yt-navigate-finish'))}")
    page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
    spa=(time.perf_counter()-start)*1000
    metrics={x['name']:x['value'] for x in cdp.send('Performance.getMetrics')['metrics']}
    after=process_stats(bc)
    result={'initialNavigationMs':navigation,'dashboardOpenMs':dashboard,'searchInteractionMs':interaction,'spaNavigationTwoFramesMs':spa,
            'rendererTaskSeconds':metrics.get('TaskDuration'), 'jsHeapUsedBytes':metrics.get('JSHeapUsedSize'),
            'browserTreeCpuSeconds':max(0,after['cpuSeconds']-before['cpuSeconds']), 'browserTreeRssBytes':after['processRssBytes'], **counts}
    context.close();browser.close();return result

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--baseline',type=Path,required=True);ap.add_argument('--candidate',type=Path,required=True)
    ap.add_argument('--browser',required=True);ap.add_argument('--out',type=Path,required=True);ap.add_argument('--rounds',type=int,default=5)
    a=ap.parse_args()
    if not 1<=a.rounds<=30: ap.error('rounds must be 1–30')
    bundles={'baseline':a.baseline.read_bytes(),'candidate':a.candidate.read_bytes()}
    results={name:{'sha256':hashlib.sha256(buf).hexdigest(),'bytes':len(buf),'samples':[]} for name,buf in bundles.items()}
    with sync_playwright() as pw:
        for i in range(a.rounds):
            for name in (('baseline','candidate') if i%2==0 else ('candidate','baseline')):
                row=sample(pw,a.browser,bundles[name]);results[name]['samples'].append(row)
                print(f'{name} round {i+1}: navigation {row["initialNavigationMs"]:.0f}ms, dashboard {row["dashboardOpenMs"]:.0f}ms',flush=True)
    for result in results.values():
        result['median']={k:statistics.median(row[k] for row in result['samples']) for k in result['samples'][0] if result['samples'][0][k] is not None}
    report={'method':'network-denied synthetic search page; alternating fresh browser processes; medians, no live YouTube or account activity', 'limitations':['Not representative of live YouTube network, signed-in features, or real-world CPU/memory savings.','RSS sums Chromium process resident sets and can double-count shared pages.','Interaction timing includes Playwright round trips and two animation frames.'], 'rounds':a.rounds,'results':results}
    a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps(report,indent=2)+'\n')
    print('Saved',a.out)
if __name__=='__main__': main()
