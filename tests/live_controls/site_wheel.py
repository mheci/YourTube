"""Trusted pointer wheel outside the dashboard on an already verified, playable public video."""


def run(p):
    r = {
        "id": "wheel-controls",
        "keys": ["wheelControlsOn", "wheelVolumeStep", "wheelSeekStep"],
        "description": "Physical pointer wheel on the native video surface and scrubber; dashboard is closed while operating player",
        "samples": [],
        "events": [],
    }
    try:
        p.evaluate(
            """()=>{window.__audWheel=[];const mp=document.querySelector('#movie_player'),v=mp.querySelector('video');window.addEventListener('wheel',e=>{const item={trusted:e.isTrusted,inPlayer:mp.contains(e.target),inBar:!!e.target.closest('.ytp-progress-bar-container, .ytp-progress-bar, .ytp-progress-list'),target:e.target.tagName+'.'+String(e.target.className).slice(0,90),before:v.volume};window.__audWheel.push(item);setTimeout(()=>Object.assign(item,{prevented:e.defaultPrevented,after:v.volume,muted:v.muted,seconds:v.currentTime}),60);},{capture:true,passive:true});}"""
        )
        p.evaluate(
            """()=>{window.__wheelTrace=[];const mp=document.querySelector('#movie_player');for(const [name,node] of [['window',window],['document',document],['player',mp]])for(const useCapture of [true,false])node.addEventListener('wheel',e=>window.__wheelTrace.push([name,useCapture,e.defaultPrevented]),{capture:useCapture,passive:true});}"""
        )
        cd = p.context.new_cdp_session(p)

        def listenerCounts():
            expression = "(()=>{const mp=document.querySelector('#movie_player');return [window,document,mp].map(n=>(getEventListeners(n).wheel||[]).map(e=>[e.useCapture,e.passive]));})()"
            return (
                cd.send(
                    "Runtime.evaluate",
                    {"expression": expression, "includeCommandLineAPI": True, "returnByValue": True},
                )
                .get("result", {})
                .get("value")
            )

        v = p.locator("#movie_player video").first
        before_v = v.evaluate("v=>({vol:v.volume,muted:v.muted})")

        def set_(key, val):
            p.evaluate(
                'async ([k,v])=>await window.__controlAudit.set("wheel-controls",k,v).then(()=>null)',
                [key, val],
            )

        def baseline():
            p.evaluate(
                """()=>{const mp=document.querySelector('#movie_player'),v=mp.querySelector('video');v.pause();mp.unMute?.();if(mp.setVolume)mp.setVolume(50);else v.volume=.5;v.currentTime=12;}"""
            )
            p.wait_for_function(
                '()=>{const v=document.querySelector("#movie_player video");return v.paused&&!v.seeking&&Math.abs(v.currentTime-12)<.15&&Math.abs(v.volume-.5)<.01}',
                timeout=6000,
            )

        def pointer(target):
            box = p.locator(target).first.bounding_box()
            assert box, target + " has no bounds"
            x, y = box["x"] + box["width"] * 0.48, box["y"] + box["height"] * 0.5
            p.mouse.move(x, y)
            p.wait_for_timeout(80)
            p.mouse.wheel(0, -70)
            p.wait_for_timeout(160)
            return v.evaluate("v=>({volume:v.volume,at:v.currentTime})")

        for state, vol, sec in [(False, 7, 3), (True, 7, 3), (True, 12, 5), (False, 12, 5)]:
            p.evaluate("YourTube.openDashboard()")
            p.wait_for_function(
                '()=>document.querySelector("[data-feat=wheel-controls]")?.isConnected', timeout=8000
            )
            set_("wheelControlsOn", state)
            if state:
                set_("wheelVolumeStep", vol)
                set_("wheelSeekStep", sec)
            p.evaluate("YourTube.closeDashboard()")
            p.locator("#movie_player").scroll_into_view_if_needed()
            p.wait_for_timeout(260)
            baseline()
            diag = p.evaluate(
                """()=>{const m=document.querySelector('#movie_player');return {enabled:YourTube.cfg.wheelControlsOn,volumeStep:YourTube.cfg.wheelVolumeStep,seekStep:YourTube.cfg.wheelSeekStep,quarantined:YourTube.features.isQuarantined('wheel-controls'),matchesId:m===document.getElementById('movie_player'),elementsMatch:m.querySelector('video')===document.querySelector('video.html5-main-video')};}"""
            )
            diag["listeners"] = listenerCounts()
            p.evaluate("window.__wheelTrace=[]")
            idx = p.evaluate("window.__audWheel.length")
            a = pointer("#movie_player video")
            b = pointer("#movie_player .ytp-progress-bar")
            events = p.evaluate("n=>window.__audWheel.slice(n)", idx)
            diag["phases"] = p.evaluate("window.__wheelTrace")
            r.setdefault("routing", []).append(diag)
            r["events"] += events
            r["samples"].append(
                {"on": state, "volumeStep": vol, "seekStep": sec, "afterVideoWheel": a, "afterBarWheel": b}
            )
            assert (
                len(events) >= 2
                and all(e["trusted"] and e["inPlayer"] for e in events)
                and events[-1]["inBar"]
            ), str(events)
        for row in r["samples"]:
            a, b = row["afterVideoWheel"], row["afterBarWheel"]
            assert abs(a["volume"] - (0.5 + (row["volumeStep"] / 100 if row["on"] else 0))) < 0.009, str(
                row
            )
            assert abs(b["at"] - (12 + (row["seekStep"] if row["on"] else 0))) < 0.22, str(row)
        r["pass"] = True
    except Exception as e:
        r["pass"] = False
        r["error"] = str(e).split("Call log:")[0][:400]
    finally:
        if "before_v" in locals():
            v.evaluate("(v,b)=>{v.volume=b.vol;v.muted=b.muted}", before_v)
        p.evaluate("YourTube.openDashboard()")
    return r
