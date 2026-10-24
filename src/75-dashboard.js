  function Uo() {

    const _dashBuild = () => {
      if (!document.body) {

        const _retryOpen = () => {
          try { Uo(); } catch (e) { try { m("dashboard open retry", e); } catch (_) {} }
        };
        if (document.readyState === "loading")
          document.addEventListener("DOMContentLoaded", _retryOpen, { once: true });
        else setTimeout(_retryOpen, 120);
        return;
      }
      (function () {
        (!(function () {
          if (document.getElementById("ytb-dash-style")) return;
          const e =
            '\n.ytb-fp{position:relative;width:100%}\n.ytb-fp-btn{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:7px 10px;background:rgba(255,255,255,.05);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:7px;font:inherit;font-size:12px;cursor:pointer;transition:background .15s,border-color .15s;text-align:left}\n.ytb-fp-btn:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.2)}\n.ytb-fp-btn:focus{outline:none;border-color:rgba(255,61,127,.55);box-shadow:0 0 0 3px rgba(255,61,127,.15)}\n.ytb-fp-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.ytb-fp-arrow{color:#8b93a3;font-size:10px;flex-shrink:0}\n.ytb-fp-dd{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:50;max-height:260px;display:flex;flex-direction:column;background:rgba(18,20,26,.92);border:1px solid rgba(255,255,255,.14);border-radius:10px;box-shadow:0 18px 40px rgba(0,0,0,.6),0 4px 12px rgba(0,0,0,.4);backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);overflow:hidden;animation:ytbFpFade .12s ease-out}\n.ytb-fp-search{margin:8px 8px 6px;padding:6px 10px;background:rgba(255,255,255,.06);color:#eef;border:1px solid rgba(255,255,255,.1);border-radius:6px;font:inherit;font-size:11.5px;outline:none;flex-shrink:0}\n.ytb-fp-search::placeholder{color:#7a8290}\n.ytb-fp-search:focus{border-color:rgba(255,61,127,.55)}\n.ytb-fp-list{overflow-y:auto;flex:1;padding:2px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent}\n.ytb-fp-list::-webkit-scrollbar{width:6px}\n.ytb-fp-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:6px}\n.ytb-fp-item{padding:6px 10px;border-radius:5px;cursor:pointer;color:#eef;font-size:12px;line-height:1.3;transition:background .1s}\n.ytb-fp-item:hover{background:rgba(255,61,127,.22);color:#fff}\n.ytb-fp-item.selected{background:rgba(255,61,127,.32);font-weight:600}@keyframes ytbFpFade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}\n#ytb-ivs{font-family:\"Inter\",\"Roboto\",system-ui,-apple-system,sans-serif}\n#ytb-ivs .ytb-ivs-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,0))}\n#ytb-ivs .ytb-ivs-title{font-size:13px;font-weight:700;letter-spacing:.02em}\n#ytb-ivs .ytb-ivs-close{appearance:none;border:0;background:rgba(255,255,255,.06);color:#dde;width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:12px;line-height:1;font-weight:700;transition:background .12s}\n#ytb-ivs .ytb-ivs-close:hover{background:rgba(255,80,80,.25);color:#fff}\n#ytb-ivs .ytb-ivs-input{margin:10px 14px 4px;padding:8px 12px;background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:8px;font:inherit;font-size:13px;outline:none;flex-shrink:0}\n#ytb-ivs .ytb-ivs-input::placeholder{color:#7a8290}\n#ytb-ivs .ytb-ivs-input:focus{border-color:rgba(255,61,127,.55);box-shadow:0 0 0 3px rgba(255,61,127,.15)}\n#ytb-ivs .ytb-ivs-status{padding:0 14px 6px;font:11px ui-monospace,monospace;color:#8b93a3}\n#ytb-ivs .ytb-ivs-timeline{position:relative;height:8px;margin:0 14px 10px;background:rgba(255,255,255,.05);border-radius:4px;overflow:hidden;flex-shrink:0}\n#ytb-ivs .ytb-ivs-results{flex:1;min-height:0;overflow-y:auto;padding:4px 8px 10px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent}\n#ytb-ivs .ytb-ivs-results::-webkit-scrollbar{width:6px}\n#ytb-ivs .ytb-ivs-results::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:6px}\n#ytb-ivs .ytb-ivs-row{display:flex;align-items:flex-start;gap:10px;padding:6px 8px;border-radius:6px;cursor:pointer;transition:background .1s}\n#ytb-ivs .ytb-ivs-row:hover{background:rgba(255,61,127,.18)}\n#ytb-ivs .ytb-ivs-time{flex-shrink:0;font:11px ui-monospace,monospace;color:#ff8a96;background:rgba(255,61,127,.18);padding:2px 6px;border-radius:4px;cursor:pointer}\n#ytb-ivs .ytb-ivs-time:hover{background:rgba(255,61,127,.3);color:#fff}\n#ytb-ivs .ytb-ivs-text{flex:1;min-width:0;font-size:12px;color:#dde;line-height:1.45;word-wrap:break-word;overflow-wrap:break-word}\n#ytb-ivs .ytb-ivs-hl{background:rgba(255,61,127,.45);color:#fff;font-weight:600;padding:0 2px;border-radius:2px}\n#ytb-ivs .ytb-ivs-hint{padding:10px 12px;color:#7a8290;font-size:11.5px;font-style:italic}@keyframes ytbIvsIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}\n#ytb-resume-overlay > div,.ytb-resume-card-inner,.ytb-resume-card{max-width:520px;width:min(86%,520px);background:rgba(20,22,28,.6);border:1px solid rgba(255,255,255,.14);border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.65),0 8px 24px rgba(0,0,0,.4);backdrop-filter:blur(28px) saturate(180%);-webkit-backdrop-filter:blur(28px) saturate(180%);padding:24px 26px 22px;display:flex;flex-direction:column;gap:14px;transform:translateY(8px);transition:transform .25s ease-out}\n#ytb-resume-overlay .ytb-resume-head{display:flex;gap:14px;align-items:center}\n#ytb-resume-overlay .ytb-resume-thumb{width:120px;height:68px;border-radius:10px;flex-shrink:0;background:#000 center/cover no-repeat;box-shadow:0 4px 12px rgba(0,0,0,.5);position:relative;overflow:hidden}\n#ytb-resume-overlay .ytb-resume-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}\n#ytb-resume-overlay .ytb-resume-eyebrow{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#ff8a96;font-weight:600}\n#ytb-resume-overlay .ytb-resume-title{font-size:15px;font-weight:600;color:#fff;line-height:1.3}\n#ytb-resume-overlay .ytb-resume-meta{font-size:12px;color:#aaa}\n#ytb-resume-overlay .ytb-resume-body{font-size:13.5px;color:#cdd;line-height:1.5}\n#ytb-resume-overlay .ytb-resume-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:2px}\n#ytb-resume-overlay .ytb-resume-btn-primary{background:#fff!important;color:#0f0f0f!important;box-shadow:0 4px 16px rgba(255,255,255,.15)}\n#ytb-resume-overlay .ytb-resume-btn-primary:hover{box-shadow:0 6px 22px rgba(255,255,255,.3)}\n#ytb-resume-overlay .ytb-resume-btn-secondary{background:rgba(255,255,255,.1)!important;color:#fff!important;border:1px solid rgba(255,255,255,.14)!important}\n#ytb-resume-overlay .ytb-resume-btn-secondary:hover{background:rgba(255,255,255,.18)!important}\n#ytb-resume-overlay .ytb-resume-footer{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#777;margin-top:4px;padding-top:8px;border-top:1px solid rgba(255,255,255,.08)}\n#ytb-resume-overlay .ytb-resume-dismiss{background:none!important;border:0!important;color:#888!important;cursor:pointer;font:inherit;text-decoration:underline;padding:2px 4px}\n#ytb-resume-overlay .ytb-resume-dismiss:hover{color:#fff!important}\n#ytb-resume-overlay.ytb-resume-compact > div{max-width:380px;padding:18px 20px 16px;gap:12px;border-radius:18px}\n#ytb-resume-overlay.ytb-resume-detailed > div{max-width:560px;padding:32px 32px 24px;gap:20px}\n#ytb-resume-overlay.ytb-resume-cinema > div{background:rgba(10,10,14,.78);border:1px solid rgba(255,255,255,.16);box-shadow:0 40px 100px rgba(0,0,0,.8),0 8px 24px rgba(0,0,0,.5);backdrop-filter:blur(30px) saturate(200%);-webkit-backdrop-filter:blur(30px) saturate(200%);max-width:560px;padding:32px}\n#ytb-resume-card{background:rgba(20,22,28,.7)!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:12px!important;box-shadow:0 18px 40px rgba(0,0,0,.55),0 4px 12px rgba(0,0,0,.4)!important;backdrop-filter:blur(20px) saturate(160%)!important;-webkit-backdrop-filter:blur(20px) saturate(160%)!important;color:#fff!important;}\n#ytb-resume-card .ytb-resume-card-row{align-items:center}\n#ytb-resume-card .ytb-resume-thumb{background-size:cover!important}\n#ytb-resume-card .ytb-resume-info{min-width:0}\n#ytb-resume-card .ytb-resume-cta{font-weight:600;font-size:12px;color:#fff}\n#ytb-resume-card .ytb-resume-title{font-size:11px;color:#aaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#ytb-resume-card .ytb-resume-actions{display:flex;gap:6px;align-items:center;flex-shrink:0}\n#ytb-resume-card .ytb-resume-btn-primary:hover{background:#ff1a4a!important}\n#ytb-resume-card .ytb-resume-btn-secondary:hover{background:rgba(255,255,255,.18)!important}\n#ytb-resume-card .ytb-resume-close{padding:7px 10px!important;min-width:30px;line-height:1}\n.ytb-cp{display:flex;align-items:center;gap:8px;width:100%}\n.ytb-cp-text{flex:1;min-width:0}\n.ytb-cp-native{width:36px;height:32px;border:1px solid rgba(255,255,255,.15);border-radius:7px;background:transparent;cursor:pointer;padding:2px;flex-shrink:0}\n.ytb-cp-swatch{width:28px;height:28px;border-radius:6px;border:1px solid rgba(255,255,255,.18);flex-shrink:0;background:#000}\n.ytb-cp-native::-webkit-color-swatch-wrapper{padding:0}\n.ytb-cp-native::-webkit-color-swatch{border:none;border-radius:5px}\n.ytb-cp-native::-moz-color-swatch{border:none;border-radius:5px}\n#ytb-resume-overlay.ytb-resume-compact .ytb-resume-card{max-width:380px;padding:18px 20px 16px;gap:10px;border-radius:18px;background:rgba(20,22,28,.78)}\n#ytb-resume-overlay.ytb-resume-compact .ytb-resume-head{gap:10px}\n#ytb-resume-overlay.ytb-resume-compact .ytb-resume-thumb{width:80px;height:45px;border-radius:8px}\n#ytb-resume-overlay.ytb-resume-detailed .ytb-resume-card{max-width:560px;padding:32px 32px 24px;gap:20px;background:rgba(20,22,28,.78)}\n#ytb-resume-overlay.ytb-resume-detailed .ytb-resume-thumb{width:160px;height:90px}\n#ytb-resume-overlay.ytb-resume-detailed .ytb-resume-title{font-size:18px;line-height:1.4;-webkit-line-clamp:3}\n#ytb-resume-overlay.ytb-resume-detailed .ytb-resume-meta{font-size:13px;line-height:1.5}\n#ytb-resume-overlay.ytb-resume-detailed .ytb-resume-body{font-size:15px;line-height:1.55}\n#ytb-resume-overlay.ytb-resume-cinema .ytb-resume-card{background:rgba(10,10,14,.72);border:1px solid rgba(255,255,255,.14);box-shadow:0 40px 100px rgba(0,0,0,.8),0 8px 24px rgba(0,0,0,.5);backdrop-filter:blur(30px) saturate(200%);-webkit-backdrop-filter:blur(30px) saturate(200%);max-width:560px;padding:32px}\n#ytb-resume-overlay.ytb-resume-cinema .ytb-resume-thumb{width:140px;height:80px;border-radius:12px}\n#ytb-resume-overlay.ytb-resume-cinema .ytb-resume-title{font-size:18px;line-height:1.4}\n\n.ytb-dash,.ytb-dash *{font-style:normal;font-variant:normal;box-sizing:border-box}\n#ytb-extra-notes,#ytb-extra-notes *{font-style:normal;font-variant:normal;box-sizing:border-box}\n#ytb-toast,#ytb-toast *{font-style:normal;font-variant:normal;box-sizing:border-box}\n#ytb-resume-card,#ytb-resume-card *{font-style:normal;font-variant:normal;box-sizing:border-box}\n#ytb-resume-overlay,#ytb-resume-overlay *{font-style:normal;font-variant:normal;box-sizing:border-box}\n#ytb-sb-hud,#ytb-sb-hud *{font-style:normal;font-variant:normal;box-sizing:border-box}\n#ytb-sb-ov,#ytb-sb-ov *{font-style:normal;font-variant:normal;box-sizing:border-box}\n#ytb-stats,#ytb-stats *{font-style:normal;font-variant:normal;box-sizing:border-box}\n#ytb-diag,#ytb-diag *{font-style:normal;font-variant:normal;box-sizing:border-box}\n#ytb-chapter-panel,#ytb-chapter-panel *{font-style:normal;font-variant:normal;box-sizing:border-box}\n.ytb-dash{position:fixed;top:24px;right:24px;width:830px;height:auto;max-width:calc(100vw - 32px);max-height:calc(100vh - 48px);z-index:2147483641;--acc:#ff3d5a;--panel:#0d0f14;--panel2:#12151b;--line:#21252d;--line2:#2b313b;--ink:#e8ebf1;--ink2:#a3aab8;--ink3:#697180;--mono:ui-monospace,SFMono-Regular,Consolas,monospace;color:var(--ink);background:var(--panel);border:1px solid var(--line);border-radius:14px;box-shadow:0 24px 70px rgba(0,0,0,.72),0 4px 16px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.05);font:13px/1.45 "Inter","Roboto",system-ui,-apple-system,sans-serif;font-style:normal;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;display:flex;flex-direction:column;opacity:0;transition:opacity .12s ease-out;overflow:hidden;resize:none;contain:layout style paint}\n.ytb-dash.open{opacity:1}\n.ytb-dash.dragging{transition:none!important;cursor:grabbing!important;user-select:none;-webkit-user-select:none}\n.ytb-dash.dragging *{pointer-events:none!important;cursor:grabbing!important}\n.ytb-dash.resizing{transition:none;user-select:none}\n.ytb-dhandle{cursor:grab;user-select:none;-webkit-user-select:none}\n.ytb-dhandle:active{cursor:grabbing}\n.ytb-dgrip{display:inline-block;color:var(--acc);font-weight:700;margin-right:8px;font-family:var(--mono);font-size:13px}\n.ytb-dhbtns{display:flex;gap:6px;flex-shrink:0}\n.ytb-dresize{position:absolute;right:0;bottom:0;width:16px;height:16px;cursor:nwse-resize;background:linear-gradient(135deg,transparent 0,transparent 50%,var(--line2) 50%,var(--line2) 55%,transparent 55%,transparent 65%,var(--line2) 65%,var(--line2) 70%,transparent 70%,transparent 80%,var(--line2) 80%,var(--line2) 85%,transparent 85%);z-index:2;border-bottom-right-radius:14px}\n.ytb-dresize:hover{background:linear-gradient(135deg,transparent 0,transparent 50%,var(--acc) 50%,var(--acc) 55%,transparent 55%,transparent 65%,var(--acc) 65%,var(--acc) 70%,transparent 70%,transparent 80%,var(--acc) 80%,var(--acc) 85%,transparent 85%)}\n.ytb-dhdr{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--line);background:var(--panel2)}\n.ytb-dtitle{font:600 13.5px/1.2 "Inter","Roboto",system-ui,sans-serif;letter-spacing:.04em;display:flex;align-items:center;color:var(--ink)}\n.ytb-dver{font:10px/1 var(--mono);color:var(--ink2);margin-left:9px;padding:3px 7px;border-radius:4px;background:var(--panel3);border:1px solid var(--line)}\n.ytb-btn{appearance:none;border:1px solid var(--line2);border-radius:6px;padding:6px 12px;background:var(--panel3);color:var(--ink);cursor:pointer;font:inherit;font-size:12px;font-weight:550;transition:background .12s,border-color .12s,color .12s}\n.ytb-btn:hover{background:#1d222b;border-color:#39414e;color:#fff}\n.ytb-btn:active{transform:translateY(1px)}\n.ytb-btn.primary{background:var(--acc);color:#fff;border-color:var(--acc)}\n.ytb-btn.primary:hover{background:#ff4f6a;border-color:#ff4f6a;color:#fff}\n.ytb-btn.danger,.ytb-btn.ytb-danger{background:transparent;color:#ff7d8c;border-color:rgba(255,80,100,.35)}\n.ytb-btn.danger:hover,.ytb-btn.ytb-danger:hover{background:rgba(255,80,100,.12);color:#ffb3bc}\n.ytb-btn.ytb-close{width:28px;height:28px;padding:0;border-radius:6px;font:11px/1 var(--mono);display:inline-flex;align-items:center;justify-content:center}\n.ytb-btn.ytb-sb{font-size:10px;padding:4px 8px}\n.ytb-search{margin:10px 12px 8px;padding:9px 12px;background:var(--panel2);color:var(--ink);border:1px solid var(--line2);border-radius:8px;font:inherit;font-size:12.5px;outline:none}\n.ytb-search::placeholder{color:var(--ink3);font-family:var(--mono);font-size:11.5px}\n.ytb-search:focus{border-color:var(--acc);box-shadow:0 0 0 2px var(--acc-dim)}\n.ytb-main{flex:1 1 0;min-height:0;display:flex;overflow:hidden}\n.ytb-nav{width:176px;flex-shrink:0;display:flex;flex-direction:column;gap:1px;padding:8px 6px;border-right:1px solid var(--line);background:var(--panel2);overflow-y:auto;scrollbar-width:thin;scrollbar-color:#2c313b transparent}\n.ytb-nav-item{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 9px;border:0;border-left:2px solid transparent;border-radius:6px;background:transparent;color:var(--ink2);font:550 11.5px/1.2 "Inter","Roboto",system-ui,sans-serif;cursor:pointer;text-align:left;transition:background .1s,color .1s}\n.ytb-nav-item:hover{color:var(--ink);background:rgba(255,255,255,.03)}\n.ytb-nav-item.active{color:#fff;background:var(--acc-dim);border-left-color:var(--acc)}\n.ytb-nav-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.ytb-nav-count{font:10px/1.4 var(--mono);color:var(--ink3);font-variant-numeric:tabular-nums}\n.ytb-nav-item.active .ytb-nav-count{color:#ffd0d8}\n.ytb-nav-sep{height:1px;background:var(--line);margin:6px 4px}\n.ytb-body{flex:1 1 0;min-height:0;min-width:0;overflow-y:auto;padding:8px 0 10px;scrollbar-width:thin;scrollbar-color:#2c313b transparent}\n.ytb-body::-webkit-scrollbar{width:8px}\n.ytb-body::-webkit-scrollbar-thumb{background:#2c313b;border-radius:4px}\n.ytb-core{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:4px 12px 10px;margin-bottom:4px;border-bottom:1px solid var(--line)}\n.ytb-corecell{display:flex;align-items:center;justify-content:space-between;gap:8px;background:var(--panel2);border:1px solid var(--line);border-radius:8px;padding:6px 10px}\n.ytb-corecell:hover{border-color:var(--line2)}\n.ytb-corelbl{font:550 11.5px/1.2 "Inter","Roboto",system-ui,sans-serif;color:var(--ink)}\n.ytb-cat-page{display:flex;flex-direction:column;gap:3px;padding:2px 10px 2px}\n.ytb-card{margin:0;padding:10px 12px;background:var(--panel2);border:1px solid var(--line);border-left:2px solid transparent;border-radius:8px;transition:border-color .12s,background .12s;position:relative}\n.ytb-card:hover{border-color:var(--line2);background:var(--panel3)}\n.ytb-card.on{border-left-color:var(--acc)}\n.ytb-head{display:flex;align-items:center;justify-content:space-between;gap:10px}\n.ytb-name{font-size:13px;font-weight:600;color:var(--ink);flex:0 1 auto;min-width:0}\n.ytb-key{flex:1;min-width:0;margin:0 4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;font:10px/1.4 var(--mono);color:var(--ink3);background:transparent;border:0;padding:1px 2px;cursor:pointer;border-radius:3px}\n.ytb-key:hover{color:var(--acc);background:rgba(255,255,255,.03)}\n.ytb-sum{font-size:11.5px;color:var(--ink2);margin-top:3px;line-height:1.4}\n.ytp-settings{margin-top:9px;padding-top:8px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:7px}\n.ytb-sub{display:flex;flex-direction:column;gap:4px;margin-top:4px}\n.ytb-row{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:28px}\n.ytb-col{display:flex;flex-direction:column;gap:5px}\n.ytb-rowb{display:flex;gap:6px;flex-wrap:wrap;margin-top:3px}\n.ytb-rowb .ytb-btn{flex:1;min-width:80px}\n.ytb-lbl{font-size:12px;color:var(--ink);flex:1;min-width:0}\n.ytb-sw{position:relative;width:34px;height:18px;flex-shrink:0;cursor:pointer}\n.ytb-sw input{position:absolute;opacity:0;width:0;height:0}\n.ytb-track{position:absolute;inset:0;border-radius:5px;background:#22262e;transition:background .15s;border:1px solid #2b313b}\n.ytb-knob{position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:3px;background:#7d8590;transition:transform .15s cubic-bezier(.4,0,.2,1),background .15s}\n.ytb-sw input:checked~.ytb-track{background:var(--acc);border-color:var(--acc)}\n.ytb-sw input:checked~.ytb-knob{transform:translateX(16px);background:#fff}\n.ytb-sel{background:var(--panel3);color:var(--ink);border:1px solid var(--line2);border-radius:5px;font:11px var(--mono);padding:4px 7px;outline:none;max-width:150px;transition:border-color .12s}\n.ytb-sel:focus{border-color:var(--acc)}\n.ytb-sel option{background:#12151b;color:var(--ink)}\n.ytb-rng{display:flex;align-items:center;gap:8px;flex:1;max-width:60%}\n.ytb-rng input[type=range]{flex:1;min-width:70px;accent-color:var(--acc);height:2px;cursor:pointer}\n.ytb-rngv{min-width:48px;text-align:right;color:var(--ink2);font:10px var(--mono);font-variant-numeric:tabular-nums}\n.ytb-inp{background:var(--panel3);color:var(--ink);border:1px solid var(--line2);border-radius:6px;padding:6px 9px;font:inherit;font-size:11.5px;outline:none;width:100%;transition:border-color .12s}\n.ytb-inp:focus{border-color:var(--acc)}\n.ytb-ta{background:var(--panel3);color:var(--ink);border:1px solid var(--line2);border-radius:6px;padding:7px 9px;font:10.5px/1.5 var(--mono);outline:none;width:100%;min-height:64px;resize:vertical;transition:border-color .12s}\n.ytb-ta:focus{border-color:var(--acc)}\n.ytb-foot{display:flex;gap:6px;padding:10px 12px;border-top:1px solid var(--line);background:var(--panel2);flex-wrap:wrap}\n.ytb-foot .ytb-btn{flex:1;min-width:90px}\n.ytb-tabs{display:flex;gap:2px;padding:0 12px;border-bottom:1px solid var(--line);background:var(--panel2)}\n.ytb-tab{flex:1;padding:8px 6px;background:transparent;border:0;color:var(--ink2);font:600 10.5px/1 var(--mono);letter-spacing:.05em;text-transform:uppercase;cursor:pointer;border-bottom:2px solid transparent;transition:color .12s,border-color .12s}\n.ytb-tab:hover{color:var(--ink)}\n.ytb-tab.active{color:var(--acc);border-bottom-color:var(--acc)}\n.ytb-tabpanel{display:none;flex-direction:column;gap:6px;padding:4px 0 8px}\n.ytb-tabpanel.active{display:flex}\n.ytb-section-hdr{font:600 10px/1 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--ink3);padding:12px 12px 5px;display:flex;align-items:center;gap:8px}\n.ytb-section-hdr::after{content:"";flex:1;height:1px;background:var(--line)}\n.ytb-meter{height:6px;background:var(--panel3);border-radius:3px;overflow:hidden;position:relative}\n.ytb-meter-fill{height:100%;background:var(--acc);border-radius:3px;transition:width .3s}\n.ytb-meter-fill.ok{background:#37c26b}\n.ytb-meter-fill.warn{background:#f2b134}\n.ytb-meter-fill.crit{background:#ff3d5a}\n.ytp-kbd{font:9.5px var(--mono);background:var(--panel3);border:1px solid var(--line2);border-bottom-width:2px;border-radius:3px;padding:2px 5px;color:var(--ink);display:inline-block}\n.ytb-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:4px;background:var(--acc-dim);color:#ff8fa1;font:600 10px/1 var(--mono);border:1px solid rgba(255,61,90,.3)}\n.ytb-chip.neutral{background:var(--panel3);color:var(--ink2);border-color:var(--line2)}\n.ytb-divider{height:1px;background:var(--line);margin:7px 0}\n.ytb-cat-dot{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-right:6px}\n@media (max-width:640px){.ytb-dash{width:calc(100vw - 16px)!important;left:8px!important;right:8px!important;top:8px!important;max-height:calc(100vh - 16px)}.ytb-main{flex-direction:column}.ytb-nav{width:100%;flex-direction:row;overflow-x:auto;overflow-y:hidden;border-right:0;border-bottom:1px solid var(--line);padding:6px}.ytb-nav-item{white-space:nowrap}.ytb-rng input{min-width:60px}.ytb-core{grid-template-columns:1fr}}\n@media (prefers-reduced-motion:reduce){.ytb-dash,.ytb-card,.ytb-btn,.ytb-knob{transition:none!important}}\n\n.ytb-hcard{display:flex;gap:10px;padding:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.05);border-radius:10px;margin-top:6px;transition:background .15s}\n.ytb-hcard:hover{background:rgba(255,255,255,.07)}\n.ytb-hcard.done{opacity:.6}\n.ytb-hthumb{width:88px;height:50px;min-width:88px;border-radius:7px;background:#1a1c22 center/cover no-repeat;position:relative;flex-shrink:0;overflow:hidden;border:1px solid rgba(255,255,255,.06)}\n.ytb-hbadge{position:absolute;bottom:3px;right:3px;background:rgba(0,0,0,.85);color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px}\n.ytb-hbadge.done{background:rgba(0,160,50,.85)}\n.ytb-hbadge.res{background:rgba(255,61,127,.85)}\n.ytb-hinfo{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}\n.ytb-htitle{font-size:11.5px;font-weight:600;color:#e5e7ed;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ytb-hchan{font-size:10px;color:#7a8290;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ytb-hmeta{font-size:10px;color:#5b6270;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ytb-hpt{height:3px;background:rgba(255,255,255,.08);border-radius:3px;margin:3px 0;overflow:hidden}\n.ytb-hpf{height:100%;background:linear-gradient(90deg,#ff0033,#ff3d7f);border-radius:3px}\n.ytb-hpf.done{background:linear-gradient(90deg,#0a6,#4caf50)}\n.ytb-hacts{display:flex;gap:4px;margin-top:4px;flex-wrap:wrap}\n.ytb-hist-loading,.ytb-hist-empty{padding:20px;text-align:center;color:#5b6270;font-size:11.5px}\n.ytb-hist-panel{display:flex;flex-direction:column;gap:8px;margin-top:6px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:12px}\n.ytb-hist-toolbar{display:flex;gap:6px;flex-wrap:wrap}\n.ytb-hist-search{flex:1;min-width:120px;background:rgba(255,255,255,.05);color:#eef;border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:6px 10px;font:inherit;font-size:12px;outline:none}\n.ytb-hist-search:focus{border-color:rgba(255,61,127,.55)}\n.ytb-hist-list{display:flex;flex-direction:column;gap:6px;max-height:420px;overflow-y:auto;scrollbar-width:thin;padding-right:2px}\n.ytb-hist-loadmore{margin-top:0!important;background:rgba(255,255,255,.04)!important}\n#ytb-extra-topbar{position:fixed;left:0;top:0;height:3px;width:0;background:linear-gradient(90deg,#ff0033,#ff3d7f);z-index:2147483642;box-shadow:0 1px 10px rgba(255,61,127,.6);pointer-events:none}\n#ytb-extra-remain,#ytb-extra-clock,#ytb-extra-endwarn{position:fixed;right:12px;bottom:58px;z-index:2147483636;background:rgba(20,22,28,.5);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:5px 10px;font:11px/1.2 ui-monospace,monospace;backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);box-shadow:0 6px 20px rgba(0,0,0,.4);pointer-events:none;}\n#ytb-extra-clock{bottom:84px;color:#8ee}\n#ytb-extra-endwarn{left:50%;right:auto;bottom:120px;transform:translateX(-50%);opacity:0;transition:opacity .2s;color:#ffd166}\n#ytb-extra-endwarn.show{opacity:1}\n.ytb-extra-num{position:absolute;left:5px;top:5px;z-index:5;background:linear-gradient(135deg,#ff0033,#ff3d7f);color:#fff;border-radius:99px;min-width:22px;height:22px;display:flex;align-items:center;justify-content:center;font:700 11px system-ui;box-shadow:0 2px 6px rgba(255,0,51,.4)}\n.ytb-extra-long{box-shadow:inset 3px 0 0 #8b5cf6!important}\n.ytb-extra-short{box-shadow:inset 3px 0 0 #22c55e!important}\n.ytb-extra-watched-dim{opacity:.45!important;filter:saturate(.6)!important}\n.ytb-extra-watched-hide,.ytb-extra-live,.ytb-extra-premiere{display:none!important}\n#ytb-extra-notes{position:fixed;right:18px;bottom:18px;z-index:2147483646;width:min(360px,calc(100vw - 36px));background:rgba(20,22,28,.55);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.55),0 4px 16px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%);padding:12px;font:12px system-ui;}\n.ytb-extra-notes-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}\n.ytb-extra-notes-head button{background:none;border:0;color:#aaa;font-size:18px;cursor:pointer}\n#ytb-extra-notes textarea{width:100%;min-height:140px;background:rgba(255,255,255,.06);color:#eee;border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:6px;font:inherit;resize:vertical}\n.ytb-extra-notes-foot{display:flex;justify-content:space-between;align-items:center;margin-top:6px;font:10.5px ui-monospace,monospace;color:#777}\n.ytb-extra-notes-foot button{background:linear-gradient(135deg,#ff0033,#ff3d7f);color:#fff;border:0;border-radius:5px;padding:4px 10px;cursor:pointer;font:600 11px system-ui}\n.ytb-toast,.ytb-t-info,.ytb-t-success,.ytb-t-error{position:fixed;left:50%;top:12px;transform:translateX(-50%) translateY(-10px);z-index:2147483647;background:rgba(20,22,28,.55);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.55),0 4px 16px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%);padding:10px 18px;font:12px/1.4 system-ui;font-style:normal;opacity:0;transition:opacity .2s,transform .2s;max-width:min(420px,calc(100vw - 32px));}\n.ytb-toast.show,.ytb-t-info.show,.ytb-t-success.show,.ytb-t-error.show{opacity:1;transform:translateX(-50%) translateY(0)}\n.ytb-toast.success,.ytb-t-success{border-color:rgba(76,175,80,.55);background:linear-gradient(135deg,rgba(20,22,28,.6),rgba(76,175,80,.22))}\n\n#ytb-resume-overlay.ytb-resume-compact .ytb-fcw-bar{height:3px;margin-top:8px}\n\n#ytb-resume-overlay.ytb-resume-compact .ytb-resume-thumb{width:80px;height:45px}\n#ytb-resume-overlay.ytb-resume-detailed .ytb-resume-card{max-width:560px;padding:32px 32px 24px;gap:20px}\n\n#ytb-resume-overlay.ytb-resume-detailed .ytb-resume-title{font-size:18px;line-height:1.4;margin-top:6px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\n#ytb-resume-overlay.ytb-resume-detailed .ytb-resume-meta{font-size:13px;margin-top:8px;line-height:1.5}\n#ytb-resume-overlay.ytb-resume-detailed .ytb-resume-body{font-size:15px;line-height:1.5;margin-top:2px}\n#ytb-resume-overlay.ytb-resume-detailed .ytb-resume-btn-primary,#ytb-resume-overlay.ytb-resume-detailed .ytb-resume-btn-secondary{padding:14px 22px;border-radius:99px;font-size:14px;gap:4px}\n#ytb-resume-overlay.ytb-resume-detailed .ytb-fcw-bar{height:5px;margin-top:10px;border-radius:99px}\n#ytb-resume-overlay.ytb-resume-detailed .ytb-resume-actions{gap:12px;margin-top:6px}\n#ytb-resume-overlay.ytb-resume-cinema .ytb-resume-card{background:rgba(10,10,12,.7);border:1px solid rgba(255,255,255,.15);box-shadow:0 40px 100px rgba(0,0,0,.8),0 8px 24px rgba(0,0,0,.5);backdrop-filter:blur(30px) saturate(200%);-webkit-backdrop-filter:blur(30px) saturate(200%)}\n.ytb-toast.error,.ytb-t-error{border-color:rgba(255,80,80,.55);background:linear-gradient(135deg,rgba(20,22,28,.6),rgba(255,80,80,.22))}\n.ytb-toast.info,.ytb-t-info{border-color:rgba(255,61,127,.55);background:linear-gradient(135deg,rgba(20,22,28,.6),rgba(255,61,127,.22))}\n.ytb-tabs{display:flex;gap:2px;padding:0 12px;border-bottom:1px solid rgba(255,255,255,.07);background:linear-gradient(180deg,rgba(255,255,255,.02),rgba(255,255,255,0))}\n.ytb-tab{flex:1;padding:10px 6px;background:transparent;border:0;color:#a8b0c0;font:600 11.5px/1 system-ui;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;border-bottom:2px solid transparent;transition:color .15s,border-color .15s;text-shadow:0 1px 1px rgba(0,0,0,.3)}\n.ytb-tab:hover{color:#e8eaf0}\n.ytb-tab.active{color:#ff3d7f;border-bottom-color:#ff3d7f;text-shadow:0 0 8px rgba(255,61,127,.5)}\n\n\n.ytb-section-hdr{font:700 10.5px/1 system-ui;letter-spacing:.08em;text-transform:uppercase;color:#9aa4b6;padding:14px 16px 6px;display:flex;align-items:center;gap:8px;text-shadow:0 1px 1px rgba(0,0,0,.3)}\n.ytb-section-hdr::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,0))}\n.ytb-meter{height:8px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden;position:relative}\n.ytb-meter-fill{height:100%;background:linear-gradient(90deg,#ff0033,#ff3d7f);border-radius:99px;transition:width .3s}\n.ytb-meter-fill.ok{background:linear-gradient(90deg,#4caf50,#8bc34a)}\n.ytb-meter-fill.warn{background:linear-gradient(90deg,#ffc107,#ff9800)}\n.ytb-meter-fill.crit{background:linear-gradient(90deg,#ff5722,#e91e63)}\n.ytp-kbd{font:10px ui-monospace,monospace;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-bottom-width:2px;border-radius:4px;padding:2px 6px;color:#dde;display:inline-block}\n.ytb-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:99px;background:rgba(255,61,127,.12);color:#ff8aa5;font:600 10.5px/1 system-ui;border:1px solid rgba(255,61,127,.25)}\n.ytb-chip.neutral{background:rgba(255,255,255,.05);color:#9aa;border-color:rgba(255,255,255,.1)}\n.ytb-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);margin:8px 0}\n#ytb-resume-overlay{position:absolute;inset:0;z-index:2147483640;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,rgba(20,22,28,.6) 0%,rgba(20,22,28,.85) 50%,rgba(20,22,28,.6) 100%);backdrop-filter:blur(14px) saturate(160%);-webkit-backdrop-filter:blur(14px) saturate(160%);font:14px/1.45 \"Inter\",\"Roboto\",system-ui,-apple-system,sans-serif;color:#fff;opacity:0;transition:opacity .22s ease-out;}\n#ytb-fcw-overlay{position:fixed;right:18px;top:80px;z-index:2147483638;width:min(320px,calc(100vw - 36px));background:rgba(20,22,28,.55);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.5);backdrop-filter:blur(20px) saturate(160%);-webkit-backdrop-filter:blur(20px) saturate(160%);padding:12px 16px;font:12px/1.4 system-ui;}\n#ytb-comment-search{display:flex;gap:6px;align-items:center;background:rgba(20,22,28,.55);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:6px 10px;margin:8px 0;backdrop-filter:blur(14px) saturate(160%);-webkit-backdrop-filter:blur(14px) saturate(160%);box-shadow:0 4px 14px rgba(0,0,0,.35);}\n#ytb-comment-search .ytb-cs-input{flex:1;min-width:0;background:rgba(0,0,0,.25);color:#eef;border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:5px 8px;font:11.5px system-ui;outline:none;}\n#ytb-comment-search .ytb-cs-count{font-size:11px;color:#9aa;font-variant-numeric:tabular-nums;white-space:nowrap;}\n#ytb-comment-search .ytb-cs-clear{background:rgba(255,255,255,.07);border:0;color:#aaa;width:24px;height:24px;border-radius:5px;cursor:pointer;font-size:14px;line-height:1;}\n#ytb-comment-search .ytb-cs-clear:hover{background:rgba(255,255,255,.13);color:#fff}\n#ytb-chapter-panel .ytb-ch-hdr{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(255,255,255,.04);font-size:11.5px;font-weight:600;color:#cdd;}\n#ytb-chapter-panel .ytb-ch-toggle{background:none;border:0;color:#888;cursor:pointer;font-size:11px;padding:0 4px}\n#ytb-chapter-panel .ytb-ch-toggle:hover{color:#fff}\n#ytb-chapter-panel .ytb-ch-list{max-height:340px;overflow-y:auto;scrollbar-width:thin}\n#ytb-chapter-panel .ytb-ch-row{display:flex;gap:10px;padding:6px 12px;cursor:pointer;border-top:1px solid rgba(255,255,255,.03);transition:background .1s}\n#ytb-chapter-panel .ytb-ch-row:hover{background:rgba(255,255,255,.05)}\n#ytb-chapter-panel .ytb-ch-t{flex:0 0 auto;color:#5fc;font-variant-numeric:tabular-nums;font-size:11.5px;min-width:54px}\n#ytb-chapter-panel .ytb-ch-title{flex:1;min-width:0;font-size:12px;color:#ddd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#ytb-chapter-panel .ytb-ch-row.current{background:rgba(255,61,127,.14)}\n#ytb-chapter-panel .ytb-ch-row.current .ytb-ch-t{color:#ff3d7f;font-weight:600}\n#ytb-chapter-panel .ytb-ch-row.current .ytb-ch-title{color:#fff;font-weight:600}\n#ytb-extra-notes .ytb-extra-notes-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}\n#ytb-extra-notes .ytb-extra-notes-head button{background:none;border:0;color:#aaa;font-size:18px;cursor:pointer}\n#ytb-extra-notes textarea{width:100%;min-height:140px;background:rgba(0,0,0,.25);color:#eef;border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:8px;font:12px ui-monospace,SFMono-Regular,Consolas,monospace;resize:vertical}\n#ytb-extra-notes .ytb-extra-notes-foot{display:flex;justify-content:space-between;align-items:center;margin-top:6px;font:10.5px ui-monospace,monospace;color:#9aa}\n#ytb-extra-notes .ytb-extra-notes-foot button{background:linear-gradient(135deg,#ff0033 0%,#ff3d7f 100%);color:#fff;border:0;border-radius:5px;padding:4px 10px;cursor:pointer;font:600 11px system-ui}\n#ytb-fcw-overlay .ytb-fcw-title{flex:1;font-weight:600;color:#fff;font-size:13px}\n#ytb-fcw-overlay .ytb-fcw-sub{font-size:11px;color:#9aa;margin-top:4px}\n#ytb-fcw-overlay .ytb-fcw-bar{height:4px;background:rgba(255,255,255,.08);border-radius:3px;margin-top:6px;overflow:hidden}\n#ytb-fcw-overlay .ytb-fcw-stats{font-size:11px;color:#aaa;margin-top:4px}\n#ytb-fcw-overlay .ytb-fcw-btn{background:rgba(255,255,255,.07);border:0;border-radius:5px;color:#ddd;padding:6px 12px;cursor:pointer;font:600 11px system-ui}\n@media (max-width:540px){.ytb-dash{width:calc(100vw - 16px)!important;left:8px!important;right:8px!important;top:8px!important;max-height:calc(100vh - 16px)}.ytb-rng input{min-width:60px}.ytb-core{grid-template-columns:1fr}}\n@media (prefers-reduced-motion:reduce){.ytb-dash,.ytb-card,.ytb-btn,.ytb-knob{transition:none!important}}\n\n\n#ytb-extra-endwarn{left:50%;right:auto;bottom:120px;transform:translateX(-50%);opacity:0;transition:opacity .15s;color:#ffd166}\n\n\n.ytb-extra-comment-clamp{max-height:150px;overflow:hidden;display:block}\n.ytb-extra-expand-comment{margin-top:4px;border:0;border-radius:999px;background:rgba(62,166,255,.14);color:#3ea6ff;padding:3px 8px;font:700 11px system-ui;cursor:pointer}\n#ytb-sb-hud{position:fixed;left:10px;bottom:36px;z-index:2147483635;background:rgba(20,22,28,.5);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:5px 12px;font:11px/1.3 ui-monospace,SFMono-Regular,Consolas,monospace;backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);box-shadow:0 6px 20px rgba(0,0,0,.4);}\n#ytb-sb-ov{position:fixed;top:60px;left:50%;transform:translateX(-50%);z-index:2147483639;background:rgba(20,22,28,.55);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:8px 18px;font:12px system-ui;backdrop-filter:blur(20px) saturate(160%);-webkit-backdrop-filter:blur(20px) saturate(160%);box-shadow:0 10px 30px rgba(0,0,0,.5);}\n#ytb-stats{position:fixed;top:60px;right:8px;z-index:2147483637;background:rgba(20,22,28,.5);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:10px;font:11px/1.3 ui-monospace,SFMono-Regular,Consolas,monospace;padding:6px 10px;line-height:1.5;max-width:380px;backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);box-shadow:0 6px 20px rgba(0,0,0,.4);}\n#ytb-diag{position:fixed;bottom:0;left:0;width:380px;max-height:200px;overflow:auto;z-index:2147483647;background:rgba(20,22,28,.55);color:#cdd;border:1px solid rgba(255,255,255,.12);border-radius:14px 14px 0 0;border-bottom:none;border-left:none;border-right:none;font:11px ui-monospace,SFMono-Regular,Consolas,monospace;padding:8px;backdrop-filter:blur(20px) saturate(160%);-webkit-backdrop-filter:blur(20px) saturate(160%);box-shadow:0 -8px 24px rgba(0,0,0,.4);}\n.ytb-sb-mark{pointer-events:none}\nbody.ytb-silent #ytb-toast,body.ytb-silent #ytb-sb-hud,body.ytb-silent #ytb-sb-ov,body.ytb-silent #ytb-stats,body.ytb-silent #ytb-diag,body.ytb-silent #ytb-cinema,body.ytb-silent #ytp-ambient,body.ytb-silent .ytb-sb-mark{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}\n#ytb-resume-card{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:2147483647;background:rgba(20,22,28,.55);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.55),0 4px 16px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%);padding:14px 18px;font:13px/1.45 \"Inter\",\"Roboto\",system-ui,-apple-system,sans-serif;min-width:300px;max-width:min(92%,520px);opacity:0;transform:translateX(-50%) translateY(8px);transition:opacity .2s ease-out,transform .2s ease-out;}\n@keyframes ytbResIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}\nbody.ytb-silent #ytb-resume-card{display:none!important}\n#ytb-chapter-panel{margin:8px 0 12px;background:rgba(20,22,28,.45);color:#e8e8e8;border:1px solid rgba(255,255,255,.1);border-radius:12px;overflow:hidden;font:13px/1.45 system-ui;backdrop-filter:blur(14px) saturate(160%);-webkit-backdrop-filter:blur(14px) saturate(160%);box-shadow:0 4px 16px rgba(0,0,0,.3);}\n.ytb-ch-hdr{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(255,255,255,.03);font-size:11.5px;font-weight:600;color:#bbb;text-transform:uppercase;letter-spacing:.05em}\n.ytb-ch-toggle{background:none;border:0;color:#888;cursor:pointer;font-size:11px;padding:0 4px}\n.ytb-ch-toggle:hover{color:#fff}\n.ytb-ch-list{max-height:340px;overflow-y:auto;scrollbar-width:thin}\n.ytb-ch-row{display:flex;gap:10px;padding:6px 12px;cursor:pointer;border-top:1px solid rgba(255,255,255,.03);transition:background .1s}\n.ytb-ch-row:hover{background:rgba(255,255,255,.05)}\n.ytb-ch-t{flex:0 0 auto;color:#5fc;font-variant-numeric:tabular-nums;font-size:11.5px;min-width:54px}\n.ytb-ch-title{flex:1;min-width:0;font-size:12px;color:#ddd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#ytb-comment-search{display:flex;align-items:center;gap:8px;padding:10px 14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;margin:0 0 12px;font:13px system-ui}\n.ytb-cs-input{flex:1;min-width:0;background:rgba(0,0,0,.4);color:#e8e8e8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:6px 10px;font:inherit;font-size:13px;outline:none}\n.ytb-cs-input:focus{border-color:#3ea6ff}\n.ytb-cs-count{font-size:11px;color:#888;font-variant-numeric:tabular-nums;white-space:nowrap}\n.ytb-cs-clear{background:rgba(255,255,255,.07);border:0;color:#aaa;width:24px;height:24px;border-radius:5px;cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center}\n.ytb-cs-clear:hover{background:rgba(255,255,255,.13);color:#fff}\n.ytb-elem-sec-title{font-size:10.5px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:.07em;margin:10px 0 4px;padding-top:6px;border-top:1px solid rgba(255,255,255,.06)}\n.ytb-net-panel{display:flex;flex-direction:column;gap:8px;margin-top:6px}\n.ytb-net-cards{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}\n.ytb-net-card{background:rgba(159,255,255,.05);border:1px solid rgba(159,255,255,.12);border-radius:7px;padding:8px 10px;display:flex;flex-direction:column;gap:2px}\n.ytb-net-card-label{font-size:10px;color:#9ff;text-transform:uppercase;letter-spacing:.08em;font-weight:700}\n.ytb-net-card-value{font-size:15px;color:#eee;font-weight:700;font-variant-numeric:tabular-nums}\n.ytb-net-card-sub{font-size:10px;color:#888}\n.ytb-net-session{font:11px ui-monospace,monospace;color:#9ff;background:rgba(255,255,255,.03);border-radius:5px;padding:5px 8px}\n.ytb-net-legend{display:flex;gap:14px;justify-content:flex-end;padding:0 4px;margin-top:2px}\n.ytb-net-legend-item{display:inline-flex;align-items:center;gap:5px;font:11px/1.2 system-ui;color:#cfcfcf}\n.ytb-net-swatch{display:inline-block;width:12px;height:12px;border-radius:3px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}\n.ytb-net-swatch-dn{background:linear-gradient(180deg,#4dd0e1 0%,#0288d1 100%)}\n.ytb-net-swatch-up{background:linear-gradient(180deg,#ff8a65 0%,#c62828 100%)}\n.ytb-net-chart{display:flex;align-items:flex-end;gap:2px;height:120px;padding:6px 4px;background:rgba(0,0,0,.35);border-radius:6px;border:1px solid rgba(255,255,255,.06);position:relative;overflow:hidden}\n.ytb-net-chart::before{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(255,255,255,.06);pointer-events:none}\n.ytb-net-bar{flex:1;min-width:2px;display:flex;flex-direction:column;justify-content:flex-end;height:100%;position:relative;cursor:default;transition:opacity .12s}\n.ytb-net-bar:hover{opacity:.85}\n.ytb-net-bar-dn{background:linear-gradient(180deg,#4dd0e1 0%,#0288d1 100%);border-bottom-left-radius:2px;border-bottom-right-radius:2px;box-shadow:inset 0 1px 0 rgba(255,255,255,.18);transition:filter .12s}\n.ytb-net-bar-up{background:linear-gradient(180deg,#ff8a65 0%,#c62828 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.22);border-top-left-radius:2px;border-top-right-radius:2px;transition:filter .12s}\n.ytb-net-bar:hover .ytb-net-bar-dn,.ytb-net-bar:hover .ytb-net-bar-up{filter:brightness(1.25) saturate(1.2)}\n.ytb-net-card:nth-child(1){background:rgba(159,255,255,.06);border-color:rgba(159,255,255,.18)}\n.ytb-net-card:nth-child(1) .ytb-net-card-label{color:#9ff}\n.ytb-net-card:nth-child(2){background:rgba(2,136,209,.10);border-color:rgba(77,208,225,.28)}\n.ytb-net-card:nth-child(2) .ytb-net-card-label,.ytb-net-card:nth-child(2) .ytb-net-card-value{color:#4dd0e1}\n.ytb-net-card:nth-child(3){background:rgba(198,40,40,.10);border-color:rgba(255,138,101,.28)}\n.ytb-net-card:nth-child(3) .ytb-net-card-label,.ytb-net-card:nth-child(3) .ytb-net-card-value{color:#ff8a65}\n.ytb-net-axis{display:flex;justify-content:space-between;font:10px ui-monospace,monospace;color:#666;padding:0 4px}\n.ytb-net-hosts{display:flex;flex-direction:column;gap:2px;background:rgba(255,255,255,.025);border-radius:6px;padding:6px 8px}\n.ytb-net-host-row{display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.04)}\n.ytb-net-host-row:last-child{border-bottom:0}\n.ytb-net-host-name{color:#ddd;font-family:ui-monospace,monospace;font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}\n.ytb-net-host-bytes{color:#9ff;font-variant-numeric:tabular-nums;flex-shrink:0;margin-left:8px}\n.ytb-net-budget{background:rgba(255,255,255,.025);border-radius:6px;padding:8px 10px;display:flex;flex-direction:column;gap:5px}\n.ytb-net-budget-bar{height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden}\n.ytb-net-budget-fill{height:100%;background:linear-gradient(90deg,#4caf50,#8bc34a);border-radius:4px;transition:width .3s}\n.ytb-net-budget-fill.warn{background:linear-gradient(90deg,#ffc107,#ff9800)}\n.ytb-net-budget-fill.crit{background:linear-gradient(90deg,#ff5722,#e91e63)}\n.ytb-net-budget-fill.over{background:linear-gradient(90deg,#e53935,#b71c1c);animation:ytbBudgetPulse 1.4s ease-in-out infinite}\n@keyframes ytbBudgetPulse{0%,100%{opacity:1}50%{opacity:.55}}\n.ytb-net-budget-detail{font:11px ui-monospace,monospace;color:#ddd;font-variant-numeric:tabular-nums}\n.ytb-net-qualities{background:rgba(255,255,255,.025);border-radius:6px;padding:6px 8px;display:flex;flex-direction:column;gap:4px}\n.ytb-net-q-row{display:grid;grid-template-columns:64px 1fr 110px;gap:8px;align-items:center}\n.ytb-net-q-lbl{color:#fff;font:700 10px/1 system-ui;text-align:center;padding:3px 4px;border-radius:3px;letter-spacing:.04em}\n.ytb-net-q-track{height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden}\n.ytb-net-q-fill{height:100%;border-radius:4px;transition:width .25s}\n.ytb-net-q-bytes{font:10.5px ui-monospace,monospace;color:#ccc;text-align:right;font-variant-numeric:tabular-nums}\n.ytb-perf-panel{display:flex;flex-direction:column;gap:6px;margin-top:6px}\n.ytb-perf-mem{font:11px ui-monospace,monospace;color:#9ff;background:rgba(255,255,255,.03);border-radius:5px;padding:5px 8px}\n.ytb-perf-membar{height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden}\n.ytb-perf-memfill{height:100%;background:#4caf50;border-radius:3px;transition:width .3s,background .3s}\n.ytb-perf-state{font:10.5px ui-monospace,monospace;color:#aaa;padding:3px 0}\n.ytb-perf-table{display:flex;flex-direction:column;background:rgba(255,255,255,.02);border-radius:5px;overflow:hidden;font:10.5px ui-monospace,monospace}\n.ytb-perf-row{display:grid;grid-template-columns:1.4fr .5fr .7fr .7fr .7fr;padding:3px 8px;gap:6px;border-bottom:1px solid rgba(255,255,255,.04);align-items:center}\n.ytb-perf-hdr{font-weight:700;color:#9ff;background:rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.1)}\n.ytb-perf-row .ytb-perf-c1{color:#ddd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ytb-perf-row .ytb-perf-c2,.ytb-perf-row .ytb-perf-c3,.ytb-perf-row .ytb-perf-c4,.ytb-perf-row .ytb-perf-c5{text-align:right;font-variant-numeric:tabular-nums;color:#ccc}\n.ytb-sbsub-panel{display:flex;flex-direction:column;gap:6px}\n.ytb-sbsub-status{font:11px ui-monospace,monospace;background:rgba(255,255,255,.03);border-radius:5px;padding:6px 8px;color:#888}\n.ytb-hk-row{display:grid;grid-template-columns:1fr 160px 30px;gap:6px;align-items:center;padding:3px 0}\n.ytb-hk-lbl{font-size:12px;color:#ddd}\n.ytb-hk-key{font:11px ui-monospace,monospace;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:4px;padding:5px 8px;color:#9ff;cursor:pointer;text-align:center}\n.ytb-hk-key.listening{background:rgba(200,0,0,.2);border-color:#c00;color:#fff;animation:ytbHkBlink 1s linear infinite}\n.ytb-hk-key.empty{color:#666;font-style:italic}\n@keyframes ytbHkBlink{50%{opacity:.5}}\n.ytb-hk-clr{background:rgba(255,255,255,.05);border:0;border-radius:4px;color:#888;cursor:pointer;font-size:14px;line-height:1;padding:0}\n.ytb-hk-clr:hover{background:rgba(200,0,0,.2);color:#fff}\n.ytb-stop-btn{color:#fff!important;opacity:.9!important;display:inline-flex!important;align-items:center!important;justify-content:center!important}\n.ytb-stop-btn:hover{opacity:1!important;color:#ff5252!important}.ytb-drop-box{position:fixed;z-index:2147483635;padding:4px 8px;background:rgba(20,22,28,.78);color:#ff8a96;border:1px solid rgba(255,138,150,.28);border-radius:6px;font:11px/1.3 ui-monospace,SFMono-Regular,Consolas,monospace;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);pointer-events:none;min-width:80px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,.35);transition:color .2s}\n.ytb-drop-box:hover{opacity:.85}\n.ytb-vstats-box{position:fixed;z-index:2147483635;padding:6px 10px;background:rgba(20,22,28,.82);color:#ddd;border:1px solid rgba(255,255,255,.14);border-radius:8px;font:10.5px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);pointer-events:none;min-width:200px;box-shadow:0 6px 20px rgba(0,0,0,.45)}\n.ytb-vstats-box canvas{display:block;margin-top:4px;width:100%;height:24px;background:rgba(0,0,0,.35);border-radius:3px}\n.ytb-stop-btn svg{width:22px;height:22px;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(0,0,0,.55))}.ytb-fps-box{position:fixed;z-index:2147483635;padding:3px 7px;background:rgba(20,22,28,.78);color:#9ff;border:1px solid rgba(159,255,255,.28);border-radius:6px;font:11px/1 ui-monospace,SFMono-Regular,Consolas,monospace;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);pointer-events:none;min-width:54px;text-align:center;transition:opacity .2s;box-shadow:0 4px 12px rgba(0,0,0,.35)}\n.ytb-fps-box:hover{opacity:.85}\n.ytb-buf-box{position:fixed;z-index:2147483635;left:8px;bottom:48px;padding:6px 10px;background:rgba(20,22,28,.78);color:#ddd;border:1px solid rgba(255,255,255,.14);border-radius:8px;font:11px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);min-width:160px;pointer-events:none;box-shadow:0 6px 20px rgba(0,0,0,.4)}\n.ytb-buf-bar{height:4px;background:rgba(255,255,255,.12);border-radius:3px;margin-top:4px;overflow:hidden}\n.ytb-buf-fill{height:100%;width:0;background:#4caf50;border-radius:3px;transition:width .3s,background .3s}\n@media (max-width:500px){.ytb-net-cards{grid-template-columns:1fr 1fr}}\n.ytb-elem-status{font-size:11px;color:#888;padding:2px 0 6px;font-variant-numeric:tabular-nums}\n.ytb-preset-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}\n.ytb-preset-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:7px;padding:8px 10px;cursor:pointer;transition:background .12s,border-color .12s}\n.ytb-preset-card:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.14)}\n.ytb-preset-card.active{background:rgba(200,0,0,.12);border-color:rgba(200,0,0,.35)}\n.ytb-preset-name{font-size:12px;font-weight:600;color:#e0e0e0;margin-bottom:2px}\n.ytb-preset-desc{font-size:10px;color:#888;line-height:1.35}\n.ytb-elem-list{display:flex;flex-direction:column;gap:1px;max-height:380px;overflow-y:auto;background:rgba(255,255,255,.015);border-radius:6px;padding:3px;scrollbar-width:thin}\n.ytb-elem-group-hdr{font:600 10px/1 system-ui;letter-spacing:.06em;text-transform:uppercase;color:#888;padding:8px 8px 3px;margin-top:3px;border-top:1px solid rgba(255,255,255,.04)}\n.ytb-elem-group-hdr:first-child{border-top:0;margin-top:0}\n.ytb-elem-row{display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:4px;cursor:default;transition:background .1s}\n.ytb-elem-row:hover{background:rgba(62,166,255,.1)}\n.ytb-elem-row.on{background:rgba(255,80,80,.07)}\n.ytb-elem-row.nomatch{opacity:.4}\n.ytb-elem-cb{margin:0;cursor:pointer;width:14px;height:14px;accent-color:#c00;flex-shrink:0}\n.ytb-elem-name{flex:1;min-width:0;font-size:11.5px;color:#ddd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ytb-elem-match{font:10px ui-monospace,monospace;color:#555;flex-shrink:0;font-variant-numeric:tabular-nums}\n#ytb-elem-hover{animation:ytbElemFade .1s ease-out}\n@keyframes ytbElemFade{from{opacity:0}to{opacity:1}}\n.ytb-hist-note{font-size:10px;color:#666;line-height:1.5;margin-top:6px;padding:6px 8px;background:rgba(255,255,255,.02);border-radius:4px}\n.ytb-geo-sel{position:relative;width:100%}\n.ytb-geo-input{width:100%}\n.ytb-geo-dd{position:absolute;top:100%;left:0;right:0;z-index:2147483646;max-height:260px;overflow-y:auto;background:rgba(18,20,26,.92);border:1px solid rgba(255,255,255,.14);border-radius:10px;margin-top:4px;box-shadow:0 18px 40px rgba(0,0,0,.6),0 4px 12px rgba(0,0,0,.4);backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);scrollbar-width:thin}\n.ytb-geo-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 10px;font-size:11.5px;color:#ddd;cursor:pointer;user-select:none}\n.ytb-geo-row:hover,.ytb-geo-row.hot{background:rgba(200,0,0,.18);color:#fff}\n.ytb-geo-row.selected{background:rgba(200,0,0,.32);color:#fff;font-weight:600}\n.ytb-geo-name{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ytb-geo-code{flex-shrink:0;font-size:10px;color:#888;font-variant:tabular-nums;text-transform:uppercase}\n.ytb-geo-empty{padding:10px;text-align:center;color:#666;font-size:11px}\n.ytb-geo-status{background:rgba(255,255,255,.04);border-radius:5px;padding:6px 9px;font:11px ui-monospace,monospace;color:#5fc;margin:6px 0}\n.ytb-theme-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:5px;margin:4px 0}\n.ytb-theme-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:7px;padding:5px;cursor:pointer;text-align:center;transition:border-color .12s,background .12s;contain:content;content-visibility:auto;contain-intrinsic-size:53px}\n.ytb-theme-card:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.14)}\n.ytb-theme-card.active{border-color:#c00;background:rgba(200,0,0,.1)}\n.ytb-theme-card.reset{padding:10px;margin-top:6px}\n.ytb-theme-swatch{width:100%;height:28px;border-radius:4px;border:1px solid rgba(255,255,255,.1);margin-bottom:4px;display:flex;align-items:flex-end;justify-content:flex-end;padding:3px}\n.ytb-theme-accent{width:9px;height:9px;border-radius:50%}\n.ytb-theme-name{font-size:9.5px;color:#ccc;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ytb-toggle-pill{font:700 10px system-ui;padding:3px 8px;border-radius:999px;letter-spacing:.02em;text-transform:uppercase;display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:18px;transition:background .15s,color .15s}\n.ytb-ivs-mark:hover{background:rgba(255,61,127,1)!important;z-index:2}\n@media (max-width:500px){.ytb-dash{width:calc(100vw - 16px)!important;left:8px!important;right:8px!important;max-height:calc(100vh - 16px)}.ytb-rng input{min-width:60px}.ytb-core{grid-template-columns:1fr}}\n#ytb-palette{display:none;flex-direction:column}\n#ytb-palette .ytb-palette-input{appearance:none;background:transparent;color:#fff;border:0;border-bottom:1px solid rgba(255,255,255,.12);padding:14px 18px;font:600 15px/1.2 \"Inter\",\"Roboto\",system-ui,-apple-system,sans-serif;outline:none;letter-spacing:.01em}\n#ytb-palette .ytb-palette-input::placeholder{color:#7a8290;font-weight:400}\n#ytb-palette .ytb-palette-results{flex:1;min-height:0;overflow-y:auto;padding:4px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent}\n#ytb-palette .ytb-palette-results::-webkit-scrollbar{width:6px}\n#ytb-palette .ytb-palette-results::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:6px}\n#ytb-palette .ytb-palette-row{display:grid;grid-template-columns:1fr auto;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;cursor:pointer;transition:background .1s}\n#ytb-palette .ytb-palette-row.active,#ytb-palette .ytb-palette-row:hover{background:rgba(255,61,127,.18)}\n#ytb-palette .ytb-palette-lbl{font-size:13.5px;color:#f0f2f7;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n#ytb-palette .ytb-palette-hint{font-size:11px;color:#9aa;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;white-space:nowrap}\n#ytb-palette .ytb-palette-empty{padding:24px 18px;color:#7a8290;font-size:12.5px;text-align:center;font-style:italic}\n#ytb-palette .ytb-palette-foot{padding:8px 14px;border-top:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.2);color:#9aa;font-size:11px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}\n#ytb-cheat{display:none;flex-direction:column}\n#ytb-cheat .ytb-cheat-head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,.1);background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,0))}\n#ytb-cheat .ytb-cheat-title{font:700 15px/1 \"Inter\",\"Roboto\",system-ui,-apple-system,sans-serif;color:#fff;letter-spacing:.02em}\n#ytb-cheat .ytb-cheat-filter{appearance:none;background:rgba(255,255,255,.05);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:8px 12px;margin:10px 14px 4px;font:inherit;font-size:13px;outline:none;flex-shrink:0}\n#ytb-cheat .ytb-cheat-filter::placeholder{color:#7a8290}\n#ytb-cheat .ytb-cheat-filter:focus{border-color:rgba(255,61,127,.55);box-shadow:0 0 0 3px rgba(255,61,127,.15)}\n#ytb-cheat .ytb-cheat-body{flex:1;min-height:0;overflow-y:auto;padding:6px 14px 10px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent}\n#ytb-cheat .ytb-cheat-body::-webkit-scrollbar{width:6px}\n#ytb-cheat .ytb-cheat-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:6px}\n#ytb-cheat .ytb-cheat-cat{font:700 10.5px/1 system-ui;letter-spacing:.08em;text-transform:uppercase;color:#9aa4b6;padding:10px 0 4px;display:flex;align-items:center;gap:8px}\n#ytb-cheat .ytb-cheat-cat::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,0))}\n#ytb-cheat .ytb-cheat-row{display:grid;grid-template-columns:1fr 110px 1fr;align-items:center;gap:10px;padding:5px 0;font-size:12.5px}\n#ytb-cheat .ytb-cheat-lbl{color:#e5e7ed;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n#ytb-cheat .ytb-cheat-key{text-align:right}\n#ytb-cheat .ytb-cheat-hint{color:#7a8290;font-size:11px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n#ytb-cheat .ytb-cheat-foot{padding:8px 14px;border-top:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.2);color:#9aa;font-size:11px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}\n@media (max-width:500px){#ytb-palette,#ytb-cheat{width:calc(100vw - 16px)!important;left:8px!important;right:8px!important;top:8px!important;transform:translateX(0)!important;max-height:80vh!important}#ytb-cheat .ytb-cheat-row{grid-template-columns:1fr 90px}}\n\n\n/* --- Calm dashboard theme (v1.5.0): light paper, serif accents, hairlines --- */\n.ytb-dash{--card:#fffdf8;--card-hi:#f5f1e8;--card-lo:#efece7;--ok:#4a7d5d;--crit:#b91c1c;--accink:180,83,9;--shadowink:28,25,23;--critink:185,28,28;--acc:#b45309;--acc-dim:rgba(180,83,9,.07);--panel:#faf7f0;--panel2:#fcf9f3;--panel3:#fffdf8;--line:#e7e5e4;--line2:#d6d3d1;--ink:#1c1917;--ink2:#57534e;--ink3:#a8a29e;color:var(--ink);background:var(--panel);border:1px solid var(--line2);border-radius:12px;box-shadow:0 18px 50px rgba(28,25,23,.18),0 2px 8px rgba(28,25,23,.08);font:13px/1.45 "Segoe UI",system-ui,-apple-system,sans-serif}\n.ytb-dash .ytb-dhdr{align-items:flex-end;gap:12px;padding:15px 18px 9px;border-bottom:2px solid var(--ink);background:transparent;flex-wrap:wrap}\n.ytb-dash .ytb-dgrip{color:var(--ink3);margin-right:2px;font-size:11px}\n.ytb-dash .ytb-dtitle{font:700 21px/1.1 Georgia,"Times New Roman",serif;letter-spacing:-.01em;color:var(--ink);white-space:nowrap}\n.ytb-dash .ytb-dver{font:italic 11px/1 Georgia,"Times New Roman",serif;color:var(--ink3);background:transparent;border:0;padding:0 0 3px 4px;margin-left:2px;white-space:nowrap;font-style:italic}\n.ytb-dash .ytb-search{flex:1;min-width:150px;margin:0;padding:4px 2px 5px;background:transparent;border:0;border-bottom:1px solid var(--line2);border-radius:0;font:italic 13px Georgia,"Times New Roman",serif;color:var(--ink2)}\n.ytb-dash .ytb-search:focus{border-color:var(--ink);box-shadow:none}\n.ytb-dash .ytb-search::placeholder{color:var(--ink3);font:italic 13px Georgia,"Times New Roman",serif}\n.ytb-dash .ytb-dhbtns{gap:10px;padding-bottom:4px}\n.ytb-dash .ytb-btn{background:none;border:0;border-bottom:1px dotted var(--ink3);border-radius:0;padding:1px 0 2px;color:var(--ink2);font:12px "Segoe UI",system-ui,sans-serif}\n.ytb-dash .ytb-btn:hover{background:none;color:var(--ink);border-bottom:1px solid var(--ink)}\n.ytb-dash .ytb-btn:active{transform:none}\n.ytb-dash .ytb-btn.primary{color:var(--acc);border-bottom-color:var(--acc);font-weight:600}\n.ytb-dash .ytb-btn.primary:hover{background:none;color:var(--acc);border-bottom:1px solid var(--acc)}\n.ytb-dash .ytb-btn.danger,.ytb-dash .ytb-btn.ytb-danger{color:var(--crit);border-bottom-color:rgba(var(--critink),.45)}\n.ytb-dash .ytb-btn.danger:hover,.ytb-dash .ytb-btn.ytb-danger:hover{background:none;color:var(--crit);border-bottom-color:var(--crit)}\n.ytb-dash .ytb-btn.ytb-close{width:auto;height:auto;padding:1px 3px;border-bottom-color:transparent;font:12px/1 ui-monospace,SFMono-Regular,Consolas,monospace}\n.ytb-dash .ytb-btn.ytb-close:hover{background:none;color:var(--ink);border-bottom:1px solid var(--ink)}\n.ytb-dash .ytb-btn.ytb-sb{font-size:10px;padding:0 0 1px}\n.ytb-dash .ytb-main{flex-direction:column}\n.ytb-dash .ytb-nav{width:auto;flex-direction:row;flex-wrap:wrap;gap:5px 14px;padding:10px 18px 9px;border-right:0;border-bottom:1px solid var(--line);background:transparent;overflow:visible}\n.ytb-dash .ytb-nav-item{display:inline-flex;width:auto;gap:5px;align-items:baseline;padding:2px 0;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;color:var(--ink2);font:11px "Segoe UI",system-ui,sans-serif}\n.ytb-dash .ytb-nav-item:hover{background:none;color:var(--ink)}\n.ytb-dash .ytb-nav-item.active{background:none;color:var(--ink);font-weight:700;border-bottom:1px solid var(--ink)}\n.ytb-dash .ytb-nav-count{font:9px "Segoe UI",system-ui,sans-serif;color:var(--acc);font-variant-numeric:tabular-nums}\n.ytb-dash .ytb-nav-item.active .ytb-nav-count{color:var(--acc)}\n.ytb-dash .ytb-nav-sep{display:none}\n.ytb-dash .ytb-body{padding:2px 18px 6px;scrollbar-color:var(--line2) transparent}\n.ytb-dash .ytb-body::-webkit-scrollbar-thumb{background:var(--line2);border-radius:4px}\n.ytb-dash .ytb-core{display:flex;flex-wrap:wrap;gap:8px 22px;padding:8px 0 10px;margin:0;border-bottom:1px solid var(--line)}\n.ytb-dash .ytb-corecell{background:none;border:0;border-radius:0;padding:0;gap:10px}\n.ytb-dash .ytb-corecell:hover{border-color:transparent}\n.ytb-dash .ytb-corelbl{font:550 12px/1.3 "Segoe UI",system-ui,sans-serif;color:var(--ink2)}\n.ytb-dash .ytb-cat-page{gap:0;padding:0}\n.ytb-dash .ytb-card{padding:7px 2px;margin:0;background:none;border:0;border-bottom:1px solid var(--card-lo);border-radius:0}\n.ytb-dash .ytb-card:hover{background:var(--card-hi);border-color:transparent;border-bottom-color:var(--card-lo)}\n.ytb-dash .ytb-card.on{border-left-color:transparent}\n.ytb-dash .ytb-head{gap:12px}\n.ytb-dash .ytb-name{font:600 12.5px "Segoe UI",system-ui,sans-serif;color:var(--ink)}\n.ytb-dash .ytb-key{margin:0;padding:1px 0;background:none;border:0;border-bottom:1px solid transparent;border-radius:0;font:10.5px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;color:var(--acc)}\n.ytb-dash .ytb-key:hover{background:none;color:var(--acc);border-bottom:1px solid var(--acc)}\n.ytb-dash .ytb-sum{font:italic 12px/1.45 Georgia,"Times New Roman",serif;color:var(--ink2);margin-top:2px}\n.ytb-dash .ytp-settings{border-top:1px solid var(--card-lo);padding-top:8px;margin-top:8px}\n.ytb-dash .ytb-lbl{font-size:12px;color:var(--ink);font-family:"Segoe UI",system-ui,sans-serif}\n.ytb-dash .ytb-rowb .ytb-btn{border:1px solid var(--line2);border-radius:6px;padding:4px 8px;background:var(--card);font-size:11px;flex:1}\n.ytb-dash .ytb-rowb .ytb-btn:hover{border-color:var(--ink3);background:var(--card-hi)}\n.ytb-dash .ytb-sw{width:30px;height:17px}\n.ytb-dash .ytb-track{border-radius:999px;background:transparent;border:1px solid var(--line2)}\n.ytb-dash .ytb-knob{top:2px;left:2px;width:11px;height:11px;border-radius:50%;background:var(--ink3)}\n.ytb-dash .ytb-sw input:checked~.ytb-track{background:var(--ink);border-color:var(--ink)}\n.ytb-dash .ytb-sw input:checked~.ytb-knob{transform:translateX(13px);background:var(--panel)}\n.ytb-dash .ytb-sel{background:var(--card);color:var(--ink);border:1px solid var(--line2);border-radius:6px;font:11px ui-monospace,SFMono-Regular,Consolas,monospace}\n.ytb-dash .ytb-sel:focus{border-color:var(--acc)}\n.ytb-dash .ytb-sel option{background:var(--card);color:var(--ink)}\n.ytb-dash .ytb-inp{background:var(--card);border:1px solid var(--line2);border-radius:6px;color:var(--ink)}\n.ytb-dash .ytb-inp:focus{border-color:var(--acc);box-shadow:none}\n.ytb-dash .ytb-ta{background:var(--card);border:1px solid var(--line2);border-radius:6px;color:var(--ink)}\n.ytb-dash .ytb-ta:focus{border-color:var(--acc)}\n.ytb-dash .ytb-rng input[type=range]{accent-color:var(--ink)}\n.ytb-dash .ytb-rngv{color:var(--ink2)}\n.ytb-dash .ytb-foot{justify-content:flex-end;gap:16px;padding:10px 18px 12px;border-top:1px solid var(--line);background:transparent}\n.ytb-dash .ytb-foot .ytb-btn{flex:0 0 auto;min-width:0}\n.ytb-dash .ytb-tabs{padding:0 18px;border-bottom:1px solid var(--line);background:transparent;gap:12px}\n.ytb-dash .ytb-tab{color:var(--ink3);font:11px "Segoe UI",system-ui,sans-serif;text-transform:none;letter-spacing:.02em;border-bottom:1px solid transparent;text-shadow:none;padding:7px 2px 6px}\n.ytb-dash .ytb-tab:hover{color:var(--ink)}\n.ytb-dash .ytb-tab.active{color:var(--ink);border-bottom-color:var(--ink);text-shadow:none;font-weight:600}\n.ytb-dash .ytb-tabpanel{padding:8px 0}\n.ytb-dash .ytb-section-hdr{font:600 10px/1 "Segoe UI",system-ui,sans-serif;letter-spacing:.08em;color:var(--ink3);text-shadow:none;padding:12px 0 4px}\n.ytb-dash .ytb-section-hdr::after{background:var(--line)}\n.ytb-dash .ytb-meter{height:5px;background:var(--card-lo);border-radius:3px}\n.ytb-dash .ytb-meter-fill{background:var(--ink);border-radius:3px}\n.ytb-dash .ytb-meter-fill.ok{background:var(--ok)}\n.ytb-dash .ytb-meter-fill.warn{background:var(--acc)}\n.ytb-dash .ytb-meter-fill.crit{background:var(--crit)}\n.ytb-dash .ytp-kbd{background:var(--card);border:1px solid var(--line2);border-bottom-width:2px;border-radius:4px;color:var(--ink2);font:9.5px ui-monospace,monospace;padding:1px 5px}\n.ytb-dash .ytb-chip{background:rgba(var(--accink),.07);color:var(--acc);border:1px solid rgba(var(--accink),.35);border-radius:999px;font:600 10px/1 ui-monospace,SFMono-Regular,Consolas,monospace}\n.ytb-dash .ytb-chip.neutral{background:var(--card-hi);color:var(--ink2);border:1px solid var(--line2)}\n.ytb-dash .ytb-divider{height:1px;background:var(--line);margin:7px 0}\n.ytb-dash .ytb-cat-dot{border:1px solid var(--line2)}\n.ytb-dash .ytb-dresize{background:linear-gradient(135deg,transparent 0,transparent 50%,var(--line2) 50%,var(--line2) 55%,transparent 55%,transparent 65%,var(--line2) 65%,var(--line2) 70%,transparent 70%,transparent 80%,var(--line2) 80%,var(--line2) 85%,transparent 85%)}\n.ytb-dash .ytb-fp-btn{background:var(--card);border:1px solid var(--line2);color:var(--ink)}\n.ytb-dash .ytb-fp-btn:hover{background:var(--card-hi);border-color:var(--ink3)}\n.ytb-dash .ytb-fp-btn:focus{outline:none;border-color:var(--acc);box-shadow:none}\n.ytb-dash .ytb-fp-arrow{color:var(--ink3)}\n.ytb-dash .ytb-fp-dd{background:var(--card);border:1px solid var(--line2);border-radius:8px;box-shadow:0 14px 30px rgba(var(--shadowink),.16),0 2px 8px rgba(var(--shadowink),.08);backdrop-filter:none;-webkit-backdrop-filter:none}\n.ytb-dash .ytb-fp-search{background:var(--card);border:1px solid var(--line2);color:var(--ink)}\n.ytb-dash .ytb-fp-search::placeholder{color:var(--ink3)}\n.ytb-dash .ytb-fp-search:focus{border-color:var(--acc)}\n.ytb-dash .ytb-fp-item{color:var(--ink)}\n.ytb-dash .ytb-fp-item:hover{background:rgba(var(--accink),.08);color:var(--ink)}\n.ytb-dash .ytb-fp-item.selected{background:rgba(var(--accink),.12);color:var(--ink);font-weight:600}\n.ytb-dash .ytb-cp-native{border:1px solid var(--line2);background:transparent}\n.ytb-dash .ytb-cp-swatch{border:1px solid var(--line2)}\n.ytb-dash .ytb-preset-card{background:var(--card);border:1px solid var(--line)}\n.ytb-dash .ytb-preset-card:hover{background:var(--card-hi);border-color:var(--line2)}\n.ytb-dash .ytb-preset-card.active{background:rgba(var(--accink),.08);border-color:rgba(var(--accink),.45)}\n.ytb-dash .ytb-preset-name{color:var(--ink)}\n.ytb-dash .ytb-preset-desc{color:var(--ink3)}\n.ytb-dash .ytb-theme-card{background:var(--card);border:1px solid var(--line)}\n.ytb-dash .ytb-theme-card:hover{background:var(--card-hi);border-color:var(--line2)}\n.ytb-dash .ytb-theme-card.active{border-color:var(--acc);background:rgba(var(--accink),.07)}\n.ytb-dash .ytb-theme-swatch{border:1px solid rgba(0,0,0,.08)}\n.ytb-dash .ytb-theme-name{color:var(--ink2)}\n.ytb-dash .ytb-hcard{background:var(--card);border:1px solid var(--line);border-radius:8px}\n.ytb-dash .ytb-hcard:hover{background:var(--card-hi)}\n.ytb-dash .ytb-hthumb{border:1px solid var(--line);background:var(--card-lo) center/cover no-repeat}\n.ytb-dash .ytb-hbadge{background:rgba(var(--shadowink),.82)}\n.ytb-dash .ytb-hbadge.res{background:rgba(var(--accink),.9)}\n.ytb-dash .ytb-htitle{color:var(--ink)}\n.ytb-dash .ytb-hchan{color:var(--ink2)}\n.ytb-dash .ytb-hmeta{color:var(--ink3)}\n.ytb-dash .ytb-hpt{background:var(--card-lo)}\n.ytb-dash .ytb-hpf{background:var(--ink)}\n.ytb-dash .ytb-hpf.done{background:var(--ok)}\n.ytb-dash .ytb-hist-panel{background:transparent;border:1px solid var(--line);border-radius:8px}\n.ytb-dash .ytb-hist-search{background:var(--card);color:var(--ink);border:1px solid var(--line2)}\n.ytb-dash .ytb-hist-search:focus{border-color:var(--acc)}\n.ytb-dash .ytb-hist-loading,.ytb-dash .ytb-hist-empty{color:var(--ink3)}\n.ytb-dash .ytb-hist-list{scrollbar-color:var(--line2) transparent}\n.ytb-dash .ytb-hist-loadmore{background:none!important}\n.ytb-dash .ytb-hist-note{color:var(--ink3);background:var(--card-hi)}\n.ytb-dash .ytb-elem-list{background:transparent;border:1px solid var(--line)}\n.ytb-dash .ytb-elem-group-hdr{color:var(--ink3);border-top:1px solid var(--line)}\n.ytb-dash .ytb-elem-row:hover{background:rgba(var(--accink),.06)}\n.ytb-dash .ytb-elem-row.on{background:rgba(var(--accink),.08)}\n.ytb-dash .ytb-elem-cb{accent-color:var(--ink)}\n.ytb-dash .ytb-elem-name{color:var(--ink2)}\n.ytb-dash .ytb-elem-match{color:var(--ink3)}\n.ytb-dash .ytb-elem-sec-title{color:var(--ink3);border-top:1px solid var(--line)}\n.ytb-dash .ytb-geo-dd{background:var(--card);border:1px solid var(--line2);border-radius:8px;box-shadow:0 14px 30px rgba(var(--shadowink),.16),0 2px 8px rgba(var(--shadowink),.08);backdrop-filter:none;-webkit-backdrop-filter:none}\n.ytb-dash .ytb-geo-row{color:var(--ink2)}\n.ytb-dash .ytb-geo-row:hover,.ytb-dash .ytb-geo-row.hot{background:rgba(var(--accink),.08);color:var(--ink)}\n.ytb-dash .ytb-geo-row.selected{background:rgba(var(--accink),.12);color:var(--ink);font-weight:600}\n.ytb-dash .ytb-geo-code{color:var(--ink3)}\n.ytb-dash .ytb-geo-empty{color:var(--ink3)}\n.ytb-dash .ytb-geo-status{background:var(--card-hi);color:var(--acc)}\n.ytb-dash .ytb-net-card{background:var(--card);border:1px solid var(--line)}\n.ytb-dash .ytb-net-card-label{color:var(--ink3)}\n.ytb-dash .ytb-net-card-value{color:var(--ink)}\n.ytb-dash .ytb-net-card-sub{color:var(--ink3)}\n.ytb-dash .ytb-net-session{background:var(--card-hi);color:var(--acc)}\n.ytb-dash .ytb-net-legend-item{color:var(--ink2)}\n.ytb-dash .ytb-net-chart{background:var(--card-lo);border:1px solid var(--line)}\n.ytb-dash .ytb-net-chart::before{background:rgba(var(--shadowink),.08)}\n.ytb-dash .ytb-net-axis{color:var(--ink3)}\n.ytb-dash .ytb-net-hosts{background:var(--card);border:1px solid var(--line)}\n.ytb-dash .ytb-net-host-row{border-bottom:1px solid var(--card-lo)}\n.ytb-dash .ytb-net-host-name{color:var(--ink2)}\n.ytb-dash .ytb-net-host-bytes{color:var(--acc)}\n.ytb-dash .ytb-net-budget{background:var(--card);border:1px solid var(--line)}\n.ytb-dash .ytb-net-budget-bar{background:var(--card-lo)}\n.ytb-dash .ytb-net-budget-fill{background:var(--ok)}\n.ytb-dash .ytb-net-budget-fill.warn{background:var(--acc)}\n.ytb-dash .ytb-net-budget-fill.crit{background:var(--crit)}\n.ytb-dash .ytb-net-budget-detail{color:var(--ink2)}\n.ytb-dash .ytb-net-qualities{background:var(--card);border:1px solid var(--line)}\n.ytb-dash .ytb-net-q-track{background:var(--card-lo)}\n.ytb-dash .ytb-net-q-bytes{color:var(--ink2)}\n.ytb-dash .ytb-perf-mem{background:var(--card-hi);color:var(--acc)}\n.ytb-dash .ytb-perf-membar{background:var(--card-lo)}\n.ytb-dash .ytb-perf-memfill{background:var(--ok)}\n.ytb-dash .ytb-perf-state{color:var(--ink2)}\n.ytb-dash .ytb-perf-table{background:var(--card);border:1px solid var(--line)}\n.ytb-dash .ytb-perf-row{border-bottom:1px solid var(--card-lo)}\n.ytb-dash .ytb-perf-hdr{color:var(--acc);background:var(--card-hi);border-bottom:1px solid var(--line)}\n.ytb-dash .ytb-perf-row .ytb-perf-c1{color:var(--ink2)}\n.ytb-dash .ytb-perf-row .ytb-perf-c2,.ytb-dash .ytb-perf-row .ytb-perf-c3,.ytb-dash .ytb-perf-row .ytb-perf-c4,.ytb-dash .ytb-perf-row .ytb-perf-c5{color:var(--ink2)}\n.ytb-dash .ytb-sbsub-status{background:var(--card-hi);color:var(--ink2)}\n.ytb-dash .ytb-hk-lbl{color:var(--ink2)}\n.ytb-dash .ytb-hk-key{background:var(--card);border:1px solid var(--line2);color:var(--acc)}\n.ytb-dash .ytb-hk-key.listening{background:rgba(var(--critink),.08);border-color:var(--crit);color:var(--crit)}\n.ytb-dash .ytb-hk-key.empty{color:var(--ink3)}\n.ytb-dash .ytb-hk-clr{background:none;color:var(--ink3)}\n.ytb-dash .ytb-hk-clr:hover{background:rgba(var(--critink),.1);color:var(--crit)}\n.ytb-dash .ytb-toggle-pill{background:var(--card-hi);color:var(--ink2)}\n/* --- Dashboard dark mode (v1.8.0): var-driven overrides only --- */\n.ytb-dash.ytb-dark{--acc:#f59e0b;--acc-dim:rgba(245,158,11,.12);--panel:#17181c;--panel2:#1b1d22;--panel3:#212428;--line:#2b2e35;--line2:#3a3e47;--ink:#e8e6e3;--ink2:#b3aaa0;--ink3:#7a7268;--card:#212428;--card-hi:#2a2d34;--card-lo:#30343c;--ok:#4ade80;--crit:#f87171;--accink:245,158,11;--shadowink:0,0,0;--critink:248,113,113;color:var(--ink);background:var(--panel);box-shadow:0 24px 70px rgba(0,0,0,.72),0 4px 16px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.05);color-scheme:dark}\n.ytb-dash.ytb-dark .ytb-theme-swatch{border:1px solid rgba(255,255,255,.12)}\n.ytb-dash.ytb-dark .ytb-hthumb{background:#101114 center/cover no-repeat}\n.ytb-dash.ytb-dark .ytb-hist-list{scrollbar-color:#3a3e47 transparent}\n';  try {

            if (typeof GM_addStyle !== "function") throw new Error("GM_addStyle unavailable");
            GM_addStyle(e);
            const t = document.createElement("meta");
            ((t.id = "ytb-dash-style"),
              t.setAttribute("name", "ytb-dash-style"),
              document.head.appendChild(t));
          } catch (t) {
            const a = document.createElement("style");
            ((a.id = "ytb-dash-style"),
              (a.textContent = e),
              (document.head || document.documentElement).appendChild(a));
          }
        })(),
          (wo = To("aside", "ytb-dash")),
          wo.setAttribute("role", "dialog"),
          wo.setAttribute("aria-label", "YourTube dashboard"));
        wo.classList.toggle("ytb-dark", String(S.dashMode || "light") === "dark");
        const _unsubDashMode = g.on("cfg.changed", ({ key }) => {
          if (key === "dashMode" && wo) wo.classList.toggle("ytb-dark", String(S.dashMode || "light") === "dark");
        });
        "function" == typeof _unsubDashMode && typeof Co !== "undefined" && Co.push(() => { try { _unsubDashMode(); } catch (_) {} });
        const t = To("div", "ytb-dhdr");
        t.classList.add("ytb-dhandle");
        const r = To("div", "ytb-dtitle");

        const _grip = document.createElement("span");
        _grip.className = "ytb-dgrip";
        _grip.setAttribute("aria-hidden", "true");
        _grip.textContent = "[=]";
        const _name = document.createTextNode("YourTube, plainly.");
        const _ver = document.createElement("span");
        _ver.className = "ytb-dver";
        _ver.textContent = "v" + n;
        r.appendChild(_grip);
        r.appendChild(_name);
        r.appendChild(_ver);
        const o = To("div", "ytb-dhbtns");
        const _darkBtn = Oo(
          String(S.dashMode || "light") === "dark" ? "☀" : "☾",
          () => {
            const next = String(S.dashMode || "light") === "dark" ? "light" : "dark";
            try { Ta("dashMode", next); } catch (_) {}
            if (wo) wo.classList.toggle("ytb-dark", next === "dark");
            _darkBtn.textContent = next === "dark" ? "☀" : "☾";
          },
          "ytb-close",
        );
        ((_darkBtn.title = "Toggle dashboard dark mode"), _darkBtn.classList.add("ytb-no-drag"), o.appendChild(_darkBtn));
        const i = Oo(
            "⧉",
            () => {
              const e = window.innerWidth,
                t = window.innerHeight,
                a = Math.min(830, e - 16),
                n = Math.min(t - 24, 780);
              (zo({ x: e - a - 16, y: 56, w: a, h: n }),
                jo(e - a - 16, 56, a, n));
            },
            "ytb-close",
          );
        ((i.title = "Dock to top-right"), i.classList.add("ytb-no-drag"));
        const d = Oo("[x]", Ko, "ytb-close");
        ((d.title = "Close (Esc)"),
          d.classList.add("ytb-no-drag"),
          o.appendChild(i),
          o.appendChild(d),
          t.appendChild(r),
          t.appendChild(o));
        const c = document.createElement("input");
        ((c.type = "search"),
          (c.className = "ytb-search ytb-no-drag"),
          (c.placeholder = "Looking for something?")),
        t.appendChild(c);
        const _main = To("div", "ytb-main"),
          _nav = To("nav", "ytb-nav"),
          l = To("div", "ytb-body");
        (_nav.setAttribute("aria-label", "Feature categories"),
          _main.appendChild(_nav),
          _main.appendChild(l));
        (
          (function () {
            const _CAT_LABEL = {
              bundles: "Bundles",
              playback: "Playback & Player",
              audio: "Audio",
              feed: "Feed & Search",
              comments: "Comments & Chat",
              appearance: "Appearance",
              channels: "Channels & Playlists",
              privacy: "Privacy",
              integrations: "Integrations",
              data: "Data & Notes",
              insights: "Discovery & Insights",
              wellness: "Watch-Time",
              tools: "Tools & Diagnostics",
            };
            const _CAT_ORDER = Object.keys(_CAT_LABEL);
            const _catOf = (card) =>
              card && card.cat && _CAT_LABEL[card.cat] ? card.cat : "tools";
            const _isOn = (card) => {
              try {
                if (typeof card.isOn === "function") return !!card.isOn();
                const v = S[card.masterKey];
                return "string" === typeof v ? (!!v && "off" !== v) : !!v;
              } catch (_) {
                return !1;
              }
            };
            const u = Array.from(va.values()).sort((e, t) =>
              String(e.name || e.id).localeCompare(String(t.name || t.id), void 0, {
                sensitivity: "base",
              }),
            );
            _ver.textContent = u.length + " modules \u00b7 v" + n;
            // Per-category pages. A card lives in exactly one page; the "all"
            // nav item simply unhides every page at once, so the "all" view
            // costs zero extra DOM. _pages/cat -> div.ytb-cat-page.
            const _pages = new Map();
            for (const cat of _CAT_ORDER) _pages.set(cat, To("div", "ytb-cat-page"));
            for (const page of _pages.values()) l.appendChild(page);
            const p = To("div", "ytb-core");
            (p.appendChild(
              (function () {
                const a = To("div", "ytb-corecell");
                (a.appendChild(To("span", "ytb-corelbl", "Experience preset")),
                  a.appendChild(
                    Po("privacyPreset", {
                      everyday: "Everyday",
                      stealth: "Stealth (no traffic monitoring)",
                      maximum: "Maximum (no monitoring, no network calls)",
                    }),
                  ));
                return a;
              })(),
            ),
              p.appendChild(
                (function () {
                  const a = To("div", "ytb-corecell");
                  return (
                    a.appendChild(To("span", "ytb-corelbl", "Quiet on-screen messages")),
                    a.appendChild(Bo("silentToasts")),
                    a
                  );
                })(),
              ),
              l.insertBefore(p, l.firstChild));
            // Card DOM: Do() builds the switch card; the dashboard layer adds
            // the category tag, the on/off accent and a click-to-copy badge of
            // the card's master config key — what a power user edits in the
            // keymap/store views.
            const _mkCard = (card) => {
              const el = Do(card);
              el.dataset.cat = _catOf(card);
              if (card.masterKey) {
                const badge = document.createElement("button");
                badge.type = "button";
                badge.className = "ytb-key";
                badge.textContent = card.masterKey;
                badge.title = "click to copy setting key";
                badge.addEventListener("click", (ev) => {
                  ev.stopPropagation();
                  try {
                    navigator.clipboard.writeText(card.masterKey);
                    pe("copied " + card.masterKey, 1200, "info");
                  } catch (_) {
                    try { pe(card.masterKey, 1800, "info"); } catch (__) {}
                  }
                });
                const head = el.querySelector(".ytb-head");
                if (head) head.insertBefore(badge, head.lastChild || null);
              }
              return el;
            };
            const h = Math.min(u.length, 40);
            for (let e = 0; e < h; e++) {
              const card = u[e];
              _pages.get(_catOf(card)).appendChild(_mkCard(card));
            }
            u.length > h &&
              (async () => {
                for (let e = h; e < u.length; e += 12) {
                  if ((await ne(), !wo)) return;
                  for (let a = e; a < Math.min(e + 12, u.length); a++)
                    _pages.get(_catOf(u[a])).appendChild(_mkCard(u[a]));
                _updateCounts && _updateCounts();
                }
              })();
            // Category rail with live ON counts.
            let _activeCat = "all";
            try { if (S.dashCat && (S.dashCat === "all" || _CAT_LABEL[S.dashCat])) _activeCat = S.dashCat; } catch (_) {}
            const _catTotals = {};
            for (const card of u) { const cat = _catOf(card); _catTotals[cat] = (_catTotals[cat] || 0) + 1; }
            const _navBtns = [];
            const _updateCounts = () => {
              let total = 0;
              for (const cat of _CAT_ORDER) {
                let on = 0;
                _pages.get(cat).querySelectorAll(".ytb-card").forEach((el) => {
                  const card = va.get(el.dataset.feat);
                  const live = card ? _isOn(card) : !1;
                  el.classList.toggle("on", live);
                  if (live) on++;
                });
                total += on;
                const btn = _navBtns.find((x) => x.dataset.cat === cat);
                if (btn)
                  btn.querySelector(".ytb-nav-count").textContent =
                    on + "/" + (_catTotals[cat] || 0);
              }
              const allBtn = _navBtns.find((x) => x.dataset.cat === "all");
              if (allBtn) allBtn.querySelector(".ytb-nav-count").textContent = String(total);
            };
            const _applyCat = (cat) => {
              _activeCat = cat;
              for (const [id, page] of _pages)
                page.style.display = cat === "all" || cat === id ? "" : "none";
              for (const btn of _navBtns)
                btn.classList.toggle("active", btn.dataset.cat === cat);
              p.style.display = cat === "all" || cat === "core" ? "" : "none";
              try { Ta("dashCat", cat); } catch (_) {}
              _updateCounts();
            };
            const _mkNavItem = (cat, label) => {
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "ytb-nav-item";
              btn.dataset.cat = cat;
              const lbl = To("span", "ytb-nav-label", label);
              const cnt = To("span", "ytb-nav-count", "0");
              btn.appendChild(lbl);
              btn.appendChild(cnt);
              btn.addEventListener("click", () => _applyCat(cat));
              _navBtns.push(btn);
              _nav.appendChild(btn);
            };
            _mkNavItem("all", "All");
            _mkNavItem("core", "Core");
            _nav.appendChild(To("div", "ytb-nav-sep"));
            for (const cat of _CAT_ORDER)
              if (_catTotals[cat])
                _mkNavItem(cat, _CAT_LABEL[cat]);
            // pages for core view hold only the core grid (p is shared)
            _applyCat(_activeCat);
            let _syncQueued = !1;
            const _unsubCfg = g.on("cfg.changed", () => {
              if (_syncQueued || !wo) return;
              _syncQueued = !0;
              const sync = () => { _syncQueued = !1; if (wo) _updateCounts(); };
              if (typeof requestAnimationFrame === "function") requestAnimationFrame(sync);
              else setTimeout(sync, 60);
            });
            "function" == typeof _unsubCfg && Co.push(() => { try { _unsubCfg(); } catch (_) {} });
            // Live text filter overrides the active category while searching.
            c.addEventListener(
              "input",
              ee(() => {
                const q = c.value.trim().toLowerCase();
                if (q) {
                  for (const page of _pages.values()) page.style.display = "";
                  p.style.display = "none";
                  l.querySelectorAll(".ytb-card").forEach((el) => {
                    const card = va.get(el.dataset.feat);
                    if (!card) { el.style.display = "none"; return; }
                    const hit =
                      card.name.toLowerCase().includes(q) ||
                      (card.summary || "").toLowerCase().includes(q) ||
                      card.id.includes(q) ||
                      (card.masterKey || "").toLowerCase().includes(q);
                    el.style.display = hit ? "" : "none";
                  });
                } else {
                  l.querySelectorAll(".ytb-card").forEach((el) => (el.style.display = ""));
                  _applyCat(_activeCat);
                }
              }, 80),
            );
            const y = To("div", "ytb-foot");
            (y.appendChild(Oo("Export settings", () => Go())),
              y.appendChild(Oo("Mark this video watched", Ut, "primary")),
              y.appendChild(Oo("Import settings", () => Xo())),
              y.appendChild(
                Oo(
                  "Reset to defaults",
                  () =>
                    (function () {
                      if (
                        "function" == typeof e.confirm &&
                        !e.confirm(
                          "Reset all toggles and values to defaults? Local notes and history are kept.",
                        )
                      )
                        return;
                      const t = Object.assign({}, S);
                      ((S = Object.assign({}, s)), Y(), ue(), xa.applyAll());
                      for (const e of Object.keys(S))
                        t[e] !== S[e] &&
                          g.emit("cfg.changed", { key: e, val: S[e] });
                      pe(
                        "Everything has been reset to default settings.",
                        2e3,
                        "success",
                      );
                    })(),
                  "ytb-danger",
                ),
              ));
            wo.appendChild(t);
            wo.appendChild(_main);
            wo.appendChild(y);
          })(),
          document.body.appendChild(wo),
          (function () {
            const _esc = (ev) => {
              if (ev.key !== "Escape") return;
              const tag = ((ev.target && ev.target.tagName) || "").toUpperCase();
              if (tag === "INPUT" || tag === "TEXTAREA" || (ev.target && ev.target.isContentEditable)) return;
              ev.preventDefault();
              try { Ko(); } catch (_) {}
            };
            document.addEventListener("keydown", _esc, true);
            try { window.__ytbDashEsc = _esc; } catch (_) {}
            Co.push(() => {
              try { document.removeEventListener("keydown", _esc, true); } catch (_) {}
              try { if (window.__ytbDashEsc === _esc) window.__ytbDashEsc = null; } catch (_) {}
            });
            try { c.focus(); } catch (_) {}
          })(),
          zo(
            (function () {
              const e = window.innerWidth,
                t = window.innerHeight,
                a = S.dashW > 0 ? S.dashW : 460,
                n = S.dashH > 0 ? S.dashH : Math.min(t - 40, 720);
              return Yp_clampRect(
                S.dashX >= 0 ? S.dashX : Math.max(8, e - a - 16),
                S.dashY >= 0 ? S.dashY : 56,
                a,
                n,
              );
            })(),
          ),
          (function (e) {
            let t = !1,
              a = 0,
              n = 0,
              r = 0,
              o = 0;
            const i = (e) => {
                if (!t) return;
                const i = e.clientX - a,
                  d = e.clientY - n,
                  c = Yp_clampRect(r + i, o + d, wo.offsetWidth, wo.offsetHeight);
                ((wo.style.left = c.x + "px"),
                  (wo.style.top = c.y + "px"),
                  (wo.style.right = "auto"),
                  (wo.style.bottom = "auto"));
              },
              d = () => {
                if (!t) return;
                ((t = !1),
                  wo.classList.remove("dragging"),
                  window.removeEventListener("pointermove", i, !0),
                  window.removeEventListener("pointerup", d, !0));
                const e = wo.getBoundingClientRect();
                jo(e.left, e.top, e.width, e.height);
              };
            e.addEventListener("pointerdown", (c) => {
              if (0 !== c.button) return;
              if (
                c.target.closest(
                  "button,input,select,textarea,a,.ytb-sw,.ytb-search,.ytb-no-drag",
                )
              )
                return;
              const s = wo.getBoundingClientRect();
              ((r = s.left),
                (o = s.top),
                (a = c.clientX),
                (n = c.clientY),
                (t = !0),
                wo.classList.add("dragging"),
                c.preventDefault(),
                window.addEventListener("pointermove", i, !0),
                window.addEventListener("pointerup", d, !0));
              try {
                e.setPointerCapture(c.pointerId);
              } catch (e) {}
            });
          })(t),
          (function () {
            const e = document.createElement("div");
            ((e.className = "ytb-dresize"),
              (e.title = "Drag to resize"),
              wo.appendChild(e));
            let t = !1,
              a = 0,
              n = 0,
              r = 0,
              o = 0;
            const onResizeMove = (i) => {
              if (!t || !wo) return;
              const rect = wo.getBoundingClientRect(),
                d = Yp_clampRect(
                  rect.left,
                  rect.top,
                  r + (i.clientX - a),
                  o + (i.clientY - n),
                );
              ((wo.style.width = d.w + "px"),
                (wo.style.height = d.h + "px"));
            };
            const onResizeUp = () => {
              if (!t) return;
              t = !1;
              window.removeEventListener("pointermove", onResizeMove, !0);
              window.removeEventListener("pointerup", onResizeUp, !0);
              if (!wo) return;
              wo.classList.remove("resizing");
              const e = wo.getBoundingClientRect();
              jo(e.left, e.top, e.width, e.height);
            };
            e.addEventListener("pointerdown", (i) => {
              if (0 === i.button) {
                ((t = !0),
                  (a = i.clientX),
                  (n = i.clientY),
                  (r = wo.offsetWidth),
                  (o = wo.offsetHeight),
                  wo.classList.add("resizing"),
                  i.preventDefault(),
                  i.stopPropagation());
                try {
                  e.setPointerCapture(i.pointerId);
                } catch (e) {}
                // Registered per drag so closing the dashboard cannot leave
                // window listeners behind.
                window.addEventListener("pointermove", onResizeMove, !0);
                window.addEventListener("pointerup", onResizeUp, !0);
              }
            });
          })(),
          window.addEventListener("resize", Wo, { passive: !0 }),
          requestAnimationFrame(() => {
            wo && wo.classList.add("open");
          }));
      })();
    };
    const _dismissOverlayGuide = () => {
      try {

        const drawer = document.querySelector("tp-yt-app-drawer#guide") ||
          document.querySelector("tp-yt-app-drawer");
        if (drawer && drawer.hasAttribute("opened") && !drawer.hasAttribute("persistent")) {
          const btn = document.querySelector("#guide-button");
          if (btn) btn.click();
        }
      } catch (_) {}
    };
    try {
      if (!wo) _dashBuild();
      if (wo) {
        requestAnimationFrame(_dismissOverlayGuide);
        setTimeout(_dismissOverlayGuide, 350);
      }
    } catch (_dashErr1) {
      try { wo && wo.remove(); } catch (_) {}
      wo = null;
      Co.length = 0;
      try { m("dashboard build", _dashErr1); } catch (_) {}
      try { console.error("[YourTube] dashboard build failed, retrying:", _dashErr1); } catch (_) {}
      try {
        _dashBuild();
      } catch (_dashErr2) {
        try { wo && wo.remove(); } catch (_) {}
        wo = null;
        Co.length = 0;
        pe("Dashboard failed to open: " + (_dashErr2 && _dashErr2.message ? _dashErr2.message : _dashErr2) + " — please report this message", 6000, "error");
      }
    }
  }
  function Ko() {
    if (wo) {
      wo.classList.remove("open");
      try {
        window.removeEventListener("resize", Wo);
      } catch (e) {}
      for (let e = Co.length - 1; e >= 0; e--)
        try {
          Co[e]();
        } catch (e) {}
      ((Co.length = 0),
        setTimeout(((w) => () => { try { w && w.remove(); } catch (_) {} })(wo), 250), wo = null);
    }
  }
  function Yo() {
    try {
      wo ? Ko() : Uo();
    } catch (err) {
      try { m("dashboard toggle", err); } catch (_) {}
      try { console.error("[YourTube] dashboard toggle failed:", err); } catch (_) {}
      pe("Dashboard failed: " + (err && err.message ? err.message : err) + " — please report this message", 6000, "error");
    }
  }
  async function Go() {
    const e = {
        version: n,
        ts: Date.now(),
        cfg: S,
        history: await Ie(),
      },
      raw = JSON.stringify(e, null, 2),
      body =
        typeof LZString !== "undefined" && LZString.compressToBase64
          ? "ytz1:" + LZString.compressToBase64(raw)
          : raw,
      t = new Blob([body], { type: "application/json" }),
      a = URL.createObjectURL(t),
      r = document.createElement("a");
    ((r.href = a),
      (r.download =
        "yourtube-settings-" + new Date().toISOString().slice(0, 10) + ".json"),
      document.body.appendChild(r),
      r.click(),
      r.remove(),
      setTimeout(() => URL.revokeObjectURL(a), 6e3),
      pe("Settings saved." + ("ytz1:" === body.slice(0, 5) ? " (lz-string)" : ""), 1800, "success"));
  }
  function Xo() {
    const e = document.createElement("input");
    ((e.type = "file"),
      (e.accept = ".json,application/json"),
      e.addEventListener(
        "change",
        () => {
          const t = e.files && e.files[0];
          if (!t) return;
          const a = new FileReader();
          ((a.onload = async (e) => {
            try {
              const text = String(e.target.result || "");
              if (text.length > 8388608) throw new Error("import too large");
              let jsonText = text;
              if (
                text.slice(0, 5) === "ytz1:" &&
                typeof LZString !== "undefined" &&
                LZString.decompressFromBase64
              ) {
                const dec = LZString.decompressFromBase64(text.slice(5));
                if (dec) jsonText = dec;
              }
              const t = JSON.parse(jsonText),
                a = Object.assign({}, S);
              (t.cfg && j(D(t.cfg)),

                Array.isArray(t.history) &&

                  (t.history = t.history.slice(-5000)),
                  Array.isArray(t.history) &&
                  (await (async () => {
                    // Chunked writes: Promise.all on up to 5000 records opened
                    // thousands of IDB transactions at once and froze the tab on
                    // large imports (plan F9). Batches of 200, sequentially.
                    const rows = t.history.filter(
                      (e) =>
                        e &&
                        "object" == typeof e &&
                        "string" == typeof e.videoId &&
                        e.videoId,
                    );
                    for (let i = 0; i < rows.length; i += 200) {
                      await Promise.all(
                        rows.slice(i, i + 200).map((e) => Be(_ytSanitizeHistoryRow(e))),
                      );
                    }
                  })()),
                Y(),
                ue(),
                xa.applyAll());
              for (const e of Object.keys(S))
                a[e] !== S[e] && g.emit("cfg.changed", { key: e, val: S[e] });
              pe("Settings loaded.", 1800, "success");
            } catch (e) {
              pe("Couldn’t read that file.", 1800, "error");
            }
          }),
            a.readAsText(t));
        },
        { once: !0 },
      ),
      e.click());
  }
  function Jo(e) {
    if (!e.code) return "";
    if (
      [
        "ShiftLeft",
        "ShiftRight",
        "ControlLeft",
        "ControlRight",
        "AltLeft",
        "AltRight",
        "MetaLeft",
        "MetaRight",
      ].includes(e.code)
    )
      return "";
    const t = [];
    return (
      e.ctrlKey && t.push("Ctrl"),
      e.shiftKey && t.push("Shift"),
      e.altKey && t.push("Alt"),
      e.metaKey && t.push("Meta"),
      t.push(e.code),
      t.join("+")
    );
  }
  function ei(e, t) {
    return !!t && Jo(e) === t;
  }
  const ti = {
    version: n,
    cfg: new Proxy(
      {},
      { get: (e, t) => S[t], set: (e, t, a) => (Ta(t, a), !0) },
    ),
    setCfg: Ta,
    setCfgMany: Oa,
    features: xa,
    bus: g,
    openDashboard: Uo,
    closeDashboard: Ko,
    toggleDashboard: Yo,

    actions: null,
    palette: null,
    cheat: null,
    flushCfg: G,
    history: $e,
    forceWatched: Ut,
    silent: { apply: ue },
    storage: {
      get: (e) => v("kv", e).then((e) => (e ? e.v : void 0)),
      set: (e, t) => k("kv", { k: e, v: t, updatedAt: Date.now() }),
      export: Go,
      import: Xo,
    },
    sb: {
      reload: () => {
        const e = ie.videoId();
        if (e) return St(e);
      },
      stats: () => SponsorBlockEngine.stats(),
      categories: i,
      options: Yi,
      segments: () => SponsorBlockEngine.getSegments(),
      debugInject: (segs) => SponsorBlockEngine.debugInjectSegments(segs),
      isChannelWhitelisted: () => SponsorBlockEngine.isCurrentChannelWhitelisted(),
      channelToken: () => SponsorBlockEngine.channelToken(),
      debugActions: () => SponsorBlockEngine.debugActions(),
      debugChipCalc: () => SponsorBlockEngine.debugChipCalc ? SponsorBlockEngine.debugChipCalc() : null,
      debugTick: () => SponsorBlockEngine.debugTickInfo(),
      setCategoryAction: (catId, action) => {
        if (catId in Yi) {
          Ta("sb_" + catId + "_act", action);
        }
      },
      setCategoryEnabled: (catId, enabled) => {
        Ta("sb_" + catId + "_en", !!enabled);
      }
    },
    net: {
      summary: (e) => dr(e || "all"),
      series: (e, t) => pr(e || "day", t || 60),
      session: () => Object.assign({}, Gn),
      raw: () => nr(),
      flush: () => er(),
      clear: () => rr(),
      fmt: or,
    },

    perf: {
      enableFps: (e) => Ta("fpsCounterOn", !!e),
      enableBuffer: (e) => Ta("bufferHealthOn", !!e),
      enableLongTask: (e) => Ta("longTaskWarnerOn", !!e),
      setLongTaskThreshold: (e) =>
        Ta(
          "longTaskWarnerThreshold",
          Math.max(20, Math.min(1000, Number(e) || 50)),
        ),
      enableDroppedFrames: (e) => Ta("droppedFrameOn", !!e),
      enableVideoStats: (e) => Ta("videoStatsOn", !!e),
      getDroppedFrames: () => {
        const v = ie && ie.el && ie.el();
        if (!v || typeof v.getVideoPlaybackQuality !== "function") return 0;
        try {
          return v.getVideoPlaybackQuality().droppedVideoFrames || 0;
        } catch (e) {
          return 0;
        }
      },
    },
    diagnostics: {
      snapshot: async () => ({
        version: n,
        url: location.href,
        ts: Date.now(),
        cfg: Object.assign({}, S),
        features: xa.list().map((e) => ({
          id: e.id,
          on:
            "function" == typeof e.isOn
              ? !!e.isOn()
              : "string" == typeof S[e.masterKey]
                ? S[e.masterKey] && "off" !== S[e.masterKey]
                : !!S[e.masterKey],
        })),
        sbStats: SponsorBlockEngine.stats(),
        logs: y().slice(-100),
      }),
    },

    memory: {
      snapshot: () => _mp.snapshot(),
      audit: () => _mp.audit(),
      gc: () => _mp.runMaintenance(),
      runMaintenance: () => _mp.runMaintenance(),

      softCleanup: () => _mp._internal.softCleanup(),
      registerCache: (name, map, cap, onEvict) =>
        _mp.registerCache(name, map, cap, onEvict),

      setTimeout: (fn, ms, owner) => _mp.safeSetTimeout(fn, ms, owner),
      setInterval: (fn, ms, owner) => _mp.safeSetInterval(fn, ms, owner),
      observer: (kind, factory, owner) =>
        _mp.safeObserver(kind, factory, owner),
      listener: (target, event, fn, opts, owner) =>
        _mp.safeListener(target, event, fn, opts, owner),
      blobURL: (blob, owner) => _mp.safeBlobURL(blob, owner),
      element: (el, owner) => _mp.safeElement(el, owner),
      wrap: (fn, owner) => _mp.safeWrap(fn, owner),

      releaseKind: (kind) => {
        const before = _mp.snapshot().live;
        _mp.releaseKind(kind);
        return before - _mp.snapshot().live;
      },

      disposeAll: () => _mp.disposeAll(),
    },
  };

  try {
    Object.defineProperty(e, "YourTube", {
      value: ti,
      configurable: !1,
      writable: !1,
    });
  } catch (e) {
    try {
      h("YourTube property already exists, skipping", e && e.message);
    } catch (e) {}
  }
  try {
    window.addEventListener(
      "unhandledrejection",
      (e) => {
        const t = e && e.reason,
          a = (t && (t.message || String(t))) || "",
          n = (t && t.stack) || "";
        if (
          "string" == typeof a &&
          (/YT\+|yourtube|ytp-|ytdef/i.test(a) || /yourtube|ytp-|ytdef/i.test(n))
        ) {
          try {
            h("[YourTube] rejection caught:", a.slice(0, 300));
          } catch (e) {}
          try {
            e.preventDefault();
          } catch (e) {}
        }
      },
      { passive: !1 },
    );
  } catch (e) {}
  try {
    window.addEventListener(
      "error",
      (e) => {
        const t = (e && e.error && e.error.stack) || "";
        if (t && /yourtube|ytp-|ytdef|YT\+/i.test(t)) {
          try {
            h("[YourTube] error caught:", (e.message || "").slice(0, 300));
          } catch (e) {}
          try {
            e.preventDefault();
          } catch (e) {}
        }
      },
      { passive: !1 },
    );
  } catch (e) {}

  function _ytbPausedDialogConfirmBtn() {
    try {
      const vid =
        document.querySelector("video.html5-main-video") ||
        document.querySelector("video");
      let paused = true;
      try {
        paused = !vid || vid.paused;
      } catch (err) {
        paused = true;
      }
      if (!paused) return null; 
      const dialogs = document.querySelectorAll(
        "yt-confirm-dialog-renderer, tp-yt-paper-dialog.yt-confirm-dialog-renderer, ytd-popup-container tp-yt-paper-dialog",
      );
      for (let i = 0; i < dialogs.length; i++) {
        const d = dialogs[i];
        let txt = "";
        try {
          txt = (d.textContent || "").toLowerCase();
        } catch (err) {}
        if (!txt) continue;
        const looksPaused =
          /(continue watching|keep watching|still watching|video (is )?paused|\bpaused\b|resume|seguir viendo|continuer (la )?lecture|weiter ansehen)/.test(
            txt,
          );
        const looksDestructive =
          /(clear|delete|remove|erase|sign ?out|log ?out|turn off|discard|unsubscribe|\bage\b|restrict|confirm (that|to)|are you sure|irreversible|permanent|deactivate)/.test(
            txt,
          );
        if (!looksPaused || looksDestructive) continue;
        const btn =
          d.querySelector("#confirm-button button") ||
          d.querySelector("yt-button-shape#confirm-button button") ||
          d.querySelector("#confirm-button") ||
          d.querySelector(".yt-spec-button-shape-next--call-to-action");
        if (btn) return btn;
      }
    } catch (err) {}
    return null;
  }

  ;(() => {
    "use strict";

    const shortsOn = () => !!S.hideShorts;
    const dubOn = () => !!S.hideAutoDubbedOn;

    function pathOf(url) {
      try {
        if (!url) return "";
        const s = String(url);
        if (s[0] === "/") return s;
        const u = new URL(s, location.href);
        const h = u.hostname;
        if (
          h !== "www.youtube.com" &&
          h !== "youtube.com" &&
          h !== "m.youtube.com" &&
          h !== "music.youtube.com" &&
          !h.endsWith(".youtube.com")
        )
          return "";
        return u.pathname + u.search;
      } catch (err) {
        return "";
      }
    }
    const CONTENT_RE =
      /\/youtubei\/v1\/(browse|next|search|get_watch|reel\/reel_watch_sequence|reel\/reel_item_watch|feed\/[a-z_]+|notification\/[a-z_]+)(\?|$)/;
    const PLAYER_RE = /\/youtubei\/v1\/player(\?|$)/;

    const SHORTS_KEYS = [
      "reelItemRenderer",
      "reelShelfRenderer",
      "reelVideoRenderer",
      "reelItemRendererViewModel",
      "shortsLockupViewModel",
      "reelPlayerOverlayRenderer",
      "reelPlayerHeaderSupportedRenderers",
      "reelChannelRenderer",
    ];

    const SHELF_KEYS = [
      "richShelfRenderer",
      "shelfRenderer",
      "richSectionRenderer",
      "itemSectionRenderer",
      "horizontalCardListRenderer",
      "gridRenderer",
      "verticalListRenderer",
    ];
    function endpointUrl(nav) {
      try {
        const w = nav && nav.commandMetadata && nav.commandMetadata.webCommandMetadata;
        if (w && w.url) return String(w.url);
      } catch (err) {}
      return "";
    }

    const SHORTS_URL_RE = /(^|\/)shorts(\/|\?|$)/i;

    function nodeIsShorts(n) {
      try {
        for (let i = 0; i < SHORTS_KEYS.length; i++)
          if (n[SHORTS_KEYS[i]] !== undefined) return true;
        const navs = [n.navigationEndpoint, n.onTap, n.onLongPress];
        for (let i = 0; i < navs.length; i++) {
          const nv = navs[i];
          if (nv) {
            if (nv.reelWatchEndpoint) return true;
            const u = endpointUrl(nv);
            if (u && SHORTS_URL_RE.test(u)) return true;
          }
        }
        const ov = n.thumbnailOverlays;
        if (ov && ov.length) {
          for (let i = 0; i < ov.length; i++) {
            const o = ov[i] && ov[i].thumbnailOverlayTimeStatusRenderer;
            if (
              o &&
              (o.style === "SHORTS" ||
                (o.text && /shorts/i.test(o.text.simpleText || o.text || "")))
            )
              return true;
          }
        }
      } catch (err) {}
      return false;
    }

    const SHORTS_WRAPPERS = [
      "videoRenderer",
      "compactVideoRenderer",
      "gridVideoRenderer",
      "reelItemRenderer",
      "lockupViewModel",
      "videoWithContextRenderer",
      "richGridMediaViewModel",

      "notificationRenderer",
      "playlistVideoRenderer",
      "playlistPanelVideoRenderer",
      "playlistPanelVideoWrapperRenderer",

      "chipCloudChipRenderer",
    ];

    function isShortsCard(item) {
      try {
        if (!item || typeof item !== "object") return false;
        if (nodeIsShorts(item)) return true;

        if (item.richItemRenderer)
          return isShortsCard(item.richItemRenderer.content || {});
        for (let i = 0; i < SHORTS_WRAPPERS.length; i++) {
          const inner = item[SHORTS_WRAPPERS[i]];
          if (inner && typeof inner === "object" && nodeIsShorts(inner)) return true;
        }

        const lvm = item.lockupViewModel || (item.richGridMediaViewModel && item.richGridMediaViewModel.content) || null;
        if (lvm && typeof lvm === "object") {
          if (lvm.onTap && lvm.onTap.reelWatchEndpoint) return true;
          const u2 = lvm.onTap ? endpointUrl(lvm.onTap) : "";
          if (u2 && SHORTS_URL_RE.test(u2)) return true;
        }
        if (item.content && item.content !== item) return isShortsCard(item.content);
      } catch (err) {}
      return false;
    }

    const DUB_TEXT_RE =
      /auto[- ]?dub|\bdubbed\b|audio track|multi[- ]?audio|multiple audio tracks|doblado|doublé|doppiato|синхрон|डब्ड|डब की गई|吹き替え|더빙|dubbat|dublado/i;
    function collectDubSignals(v) {

      let s = "";

      const grab = (x, depth) => {
        if (x == null || s.length > 300 || depth > 6) return;
        if (typeof x === "string") {
          s += " " + x;
          return;
        }
        if (Array.isArray(x)) {
          for (let i = 0; i < x.length && s.length < 300; i++) grab(x[i], depth + 1);
          return;
        }
        if (typeof x === "object") {
          for (const k in x) {
            if (Object.prototype.hasOwnProperty.call(x, k)) grab(x[k], depth + 1);
          }
        }
      };
      try {
        grab(v.badges, 0);
        grab(v.metadataBadge, 0);
        grab(v.accessibility, 0);
        grab(v.accessibilityData, 0);
        if (v.title && v.title.accessibility) grab(v.title.accessibility, 0);
        grab(v.detailedMetadataSnippets, 0);
        grab(v.metadata, 0);
        grab(v.thumbnailOverlays, 0);
      } catch (err) {}
      return s;
    }
    function isDubbedCard(item) {
      try {
        if (!item || typeof item !== "object") return false;
        const v =
          item.videoRenderer ||
          item.compactVideoRenderer ||
          item.gridVideoRenderer ||
          item.lockupViewModel ||
          item.playlistVideoRenderer ||
          (item.richItemRenderer &&
            item.richItemRenderer.content &&
            (item.richItemRenderer.content.videoRenderer ||
              item.richItemRenderer.content.lockupViewModel)) ||
          item;

        if (v.audioTrack && v.audioTrack.isAutoDubbed === true) return true;
        if (v.isAutoDubbed === true || v.isDubbed === true || v.dubbedAudio === true)
          return true;
        if (Array.isArray(v.audioTracks)) {
          for (let i = 0; i < v.audioTracks.length; i++) {
            const at = v.audioTracks[i];
            if (at && (at.isAutoDubbed === true || /dub/i.test(at.displayName || "")))
              return true;
          }
        }

        const sig = collectDubSignals(v);
        if (sig && DUB_TEXT_RE.test(sig)) return true;
      } catch (err) {}
      return false;
    }

    function shouldDrop(item, ctx) {
      if (!item || typeof item !== "object") return false;
      if (ctx.shorts && isShortsCard(item)) return true;
      if (ctx.dub && isDubbedCard(item)) return true;
      return false;
    }
    function scrubTree(node, ctx) {
      if (!node || typeof node !== "object") return false;
      if (Array.isArray(node)) {
        for (let i = node.length - 1; i >= 0; i--) {
          const item = node[i];
          if (shouldDrop(item, ctx)) {
            node.splice(i, 1);
            ctx.removed++;
            continue;
          }
          if (scrubTree(item, ctx)) {
            node.splice(i, 1);
            ctx.removed++;
          }
        }
        return false;
      }
      for (const k in node) {
        if (!Object.prototype.hasOwnProperty.call(node, k)) continue;
        const v = node[k];
        if (v && typeof v === "object") scrubTree(v, ctx);
      }

      for (let s = 0; s < SHELF_KEYS.length; s++) {
        const shelf = node[SHELF_KEYS[s]];
        if (shelf && typeof shelf === "object") {
          let contents = shelf.contents;
          if (
            !contents &&
            shelf.content &&
            shelf.content.verticalListRenderer
          )
            contents = shelf.content.verticalListRenderer.contents;
          if (Array.isArray(contents) && contents.length === 0) return true;
        }
      }
      return false;
    }

    function renumberPlaylists(node) {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) {
        let pv = 0;
        for (let i = 0; i < node.length; i++)
          if (node[i] && node[i].playlistVideoRenderer) pv++;
        if (pv >= 2 && pv >= node.length - 1) {
          let n = 1;
          for (let i = 0; i < node.length; i++) {
            const r = node[i] && node[i].playlistVideoRenderer;
            if (!r) continue;
            if (r.index && typeof r.index.simpleText !== "undefined")
              r.index.simpleText = String(n);
            n++;
          }
        }
        for (let i = 0; i < node.length; i++) renumberPlaylists(node[i]);
        return;
      }
      for (const k in node)
        if (Object.prototype.hasOwnProperty.call(node, k)) renumberPlaylists(node[k]);
    }

    let dubNotifiedFor = "";
    function trySetAudioTrack(id) {
      try {
        const mp = document.getElementById("movie_player");
        if (mp && typeof mp.setAudioTrack === "function") {
          mp.setAudioTrack(id);
          return;
        }
        if (mp && typeof mp.setAudioTrackById === "function") {
          mp.setAudioTrackById(id);
          return;
        }
        const v = document.querySelector("video.html5-main-video");
        if (v && typeof v.setAudioTrack === "function") {
          v.setAudioTrack(id);
          return;
        }
      } catch (err) {}
    }
    function handlePlayerResponse(json) {
      try {
        const formats = json && json.streamingData && json.streamingData.adaptiveFormats;
        if (!formats || !formats.length) return;
        let hasAutoDub = false,
          originalId = null,
          videoId = "";
        try {
          videoId = (json.videoDetails && json.videoDetails.videoId) || "";
        } catch (err) {}
        for (let i = 0; i < formats.length; i++) {
          const at = formats[i] && formats[i].audioTrack;
          if (!at) continue;
          if (at.isAutoDubbed === true) hasAutoDub = true;
          else if (
            !originalId &&
            (at.audioIsOriginal === true || at.isDefault === true)
          )
            originalId = at.id;
        }
        if (hasAutoDub && !originalId) {
          for (let i = 0; i < formats.length; i++) {
            const at = formats[i] && formats[i].audioTrack;
            if (at && at.isAutoDubbed !== true) {
              originalId = at.id;
              break;
            }
          }
        }
        if (!hasAutoDub) return;
        if (videoId && videoId === dubNotifiedFor) return;
        if (videoId) dubNotifiedFor = videoId;
        if (S.hideAutoDubbedPreferOriginal && originalId) {
          trySetAudioTrack(originalId);
        }
      } catch (err) {}
    }

    function emptyResponse() {
      try {
        if (typeof Response === "function")
          return new Response(null, { status: 204, statusText: "No Content" });
      } catch (err) {}
      return {
        ok: true,
        status: 204,
        statusText: "No Content",
        text: () => Promise.resolve(""),
        json: () => Promise.resolve({}),
        body: null,
        headers: new Map(),
        url: "",
      };
    }

    let apiInstalled = false;
    function ensureApi() {
      if (apiInstalled) return;
      try {
        const prevFetch = e.fetch;
        if (typeof prevFetch !== "function") return;
        apiInstalled = true;
        e.fetch = _xp.fn(function (input, init) {
          let url = "";
          try {
            url =
              input && typeof input === "object" && "url" in input
                ? input.url
                : String(input || "");
          } catch (err) {}
          const p = pathOf(url);

          if (shortsOn() && /\/youtubei\/v1\/(reel|shorts)(\/|\?|$)/.test(p)) {
            try {
              g.emit("net.blocked", { url: url, by: "remove-shorts" });
            } catch (e2) {}
            return Promise.resolve(emptyResponse());
          }
          const doShorts = shortsOn() && !!S.hideShortsApiFilter && CONTENT_RE.test(p);
          const doDub = dubOn() && CONTENT_RE.test(p);
          const doPlayer = dubOn() && PLAYER_RE.test(p);
          if (!doShorts && !doDub && !doPlayer) return prevFetch.apply(this, arguments);
          try {
            return prevFetch.apply(this, arguments).then(function (res) {
              try {
                if (!res || !res.ok) return res;
                const ct =
                  (res.headers && res.headers.get && res.headers.get("content-type")) ||
                  "";
                if (ct && ct.indexOf("json") === -1 && ct.indexOf("text") === -1)
                  return res;
                const clone = res.clone();
                return clone
                  .text()
                  .then(function (txt) {
                    try {
                      if (!txt || txt[0] !== "{") return res;

                      if (txt.length > 6 * 1024 * 1024) return res;
                      const json = JSON.parse(txt);
                      let removed = 0;
                      if (doPlayer) handlePlayerResponse(json);
                      if (doShorts || doDub) {
                        const ctxF = { shorts: doShorts, dub: doDub, removed: 0 };
                        scrubTree(json, ctxF);
                        removed = ctxF.removed;
                        if (doShorts && removed > 0) {
                          try {
                            renumberPlaylists(json);
                          } catch (e2) {}
                        }
                      }
                      if (removed > 0 || doPlayer) {
                        const body = JSON.stringify(json);
                        let headers = res.headers;
                        try {
                          headers = new Headers(res.headers);
                          headers.delete("content-encoding");
                          headers.delete("content-length");
                        } catch (e2) {
                          headers = res.headers;
                        }
                        return new Response(body, {
                          status: res.status,
                          statusText: res.statusText,
                          headers: headers,
                        });
                      }
                      return res;
                    } catch (e2) {
                      return res;
                    }
                  })
                  .catch(function () {
                    return res;
                  });
              } catch (e2) {
                return res;
              }
            });
          } catch (err) {
            return prevFetch.apply(this, arguments);
          }
        });
        try {
          e.fetch.__ytbWrapped = true;
        } catch (err) {}
      } catch (err) {
        try {
          m("yourtube api-filter install", err);
        } catch (e) {}
      }
    }

    let _initialDataTrapInstalled = false;
    function installInitialDataTrap() {

      if (_initialDataTrapInstalled) return;
      try {
        const existing = Object.getOwnPropertyDescriptor(e, "ytInitialData");
        if (existing && !existing.configurable) return;
        let current = e.ytInitialData;
        const ok = _xp.define(e, "ytInitialData", {
          configurable: true,
          enumerable: true,
          get() {
            return current;
          },
          set(v) {
            try {
              if (v && typeof v === "object" && (shortsOn() || dubOn())) {
                const ctxF = {
                  shorts: shortsOn() && !!S.hideShortsApiFilter,
                  dub: dubOn(),
                  removed: 0,
                };
                if (ctxF.shorts || ctxF.dub) scrubTree(v, ctxF);
                if (ctxF.shorts && ctxF.removed > 0) {
                  try {
                    renumberPlaylists(v);
                  } catch (err) {}
                }
              }
            } catch (err) {}
            current = v;
          },
        });
        _initialDataTrapInstalled = !!ok;
      } catch (err) {}
    }

    installInitialDataTrap();

    const SHORTS_SEL_SAFE = [
      "ytd-shorts",
      "ytd-reel-shelf-renderer",
      "ytd-reel-video-renderer",
      "ytd-reel-item-renderer",
      "ytd-shorts-video-renderer",
      "ytd-shorts-lockup-view-model",
      "ytm-shorts-lockup-view-model",
      "ytm-shorts-lockup-view-model-v2",
      "ytd-rich-shelf-renderer[is-shorts]",
      "ytd-reel-player-overlay-renderer",
      "ytd-mini-guide-entry-renderer[aria-label='Shorts']",
      "ytd-tab-renderer[title='Shorts']",
      "tp-yt-paper-tab[title='Shorts']",
      "ytd-browse[page-subtype='shorts']",
      "grid-shelf-view-model.ytGridShelfViewModelHost",
      ".shortsLockupViewModelHost",
      "a.reel-item-endpoint",
      "a.ytp-shorts-button",
      ".ytp-shorts-button",
    ];
    const SHORTS_SEL_HAS = [
      "ytd-rich-item-renderer:has(a[href*='/shorts/'])",
      "ytd-video-renderer:has(a[href*='/shorts/'])",
      "ytd-compact-video-renderer:has(a[href*='/shorts/'])",
      "ytd-grid-video-renderer:has(a[href*='/shorts/'])",
      "yt-lockup-view-model:has(a[href*='/shorts/'])",
      "ytd-shelf-renderer:has(a[href*='/shorts/'])",
      "ytd-rich-section-renderer:has(a[href*='/shorts/'])",
      "ytd-rich-shelf-renderer:has(ytd-reel-item-renderer)",
      "ytd-rich-shelf-renderer:has(path[d*='m19.45,3.88'])",
      "ytd-rich-section-renderer:has(ytd-rich-shelf-renderer path[d*='m19.45,3.88'])",
      "ytd-rich-section-renderer:has(ytd-reel-shelf-renderer)",
      "ytd-rich-section-renderer:has(ytd-reel-item-renderer)",
      "ytd-rich-section-renderer:has(grid-shelf-view-model.ytGridShelfViewModelHost)",
      "ytd-rich-item-renderer:has([overlay-style='SHORTS'])",
      "ytd-video-renderer:has([overlay-style='SHORTS'])",
      "ytd-compact-video-renderer:has([overlay-style='SHORTS'])",
      "ytd-grid-video-renderer:has([overlay-style='SHORTS'])",
      "ytd-guide-entry-renderer:has(a[href*='/shorts/'])",
      "ytd-guide-entry-renderer:has(a[title='Shorts'])",
      "ytd-mini-guide-entry-renderer:has(a[href*='/shorts/'])",
      "ytd-mini-guide-entry-renderer:has(a[title='Shorts'])",
      "ytm-pivot-bar-item-renderer:has(a[href*='/shorts/'])",
      "yt-chip-cloud-chip-renderer:has(a[href*='/shorts/'])",
      "ytd-item-section-renderer[page-subtype='subscriptions']:has([overlay-style='SHORTS'])",
      ".ytGridShelfViewModelGridShelfRow:has(.shortsLockupViewModelHost)",
      ".ytGridShelfViewModelGridShelfItem:has(.shortsLockupViewModelHost)",
    ];
    const SHORTS_DOM_SAFE = SHORTS_SEL_SAFE.join(",");
    const SHORTS_DOM_HAS = SHORTS_SEL_HAS.join(",");

    let _hasSupport = null;
    function hasSupport() {
      if (_hasSupport !== null) return _hasSupport;
      try {
        _hasSupport =
          typeof CSS !== "undefined" &&
          typeof CSS.supports === "function" &&
          CSS.supports("selector(:has(*))");
      } catch (err) {
        _hasSupport = false;
      }
      return _hasSupport;
    }
    function queryShorts(scope) {
      const out = [];
      try {
        const a = scope.querySelectorAll(SHORTS_DOM_SAFE);
        for (let i = 0; i < a.length; i++) out.push(a[i]);
      } catch (err) {}
      if (hasSupport()) {
        try {
          const b = scope.querySelectorAll(SHORTS_DOM_HAS);
          for (let i = 0; i < b.length; i++) out.push(b[i]);
        } catch (err) {}
      }
      return out;
    }
    function matchesShorts(el) {
      try {
        if (el.matches(SHORTS_DOM_SAFE)) return true;
      } catch (err) {}
      if (hasSupport()) {
        try {
          if (el.matches(SHORTS_DOM_HAS)) return true;
        } catch (err) {}
      }
      return false;
    }

    function shortsShellRoot(el) {
      try {
        const title = el.querySelector("#title");
        const isShorts =
          (title && /^shorts$/i.test((title.textContent || "").trim())) ||
          !!el.querySelector("path[d*='m19.45,3.88']");
        if (!isShorts) return null;
        return el.closest("ytd-rich-section-renderer") || el;
      } catch (err) {
        return null;
      }
    }
    function killShortsShells(scope) {
      try {
        const s = scope && scope.querySelectorAll ? scope : document;
        const shelves = s.querySelectorAll("ytd-rich-shelf-renderer");
        for (let i = 0; i < shelves.length; i++) {
          const root = shortsShellRoot(shelves[i]);
          if (root) {
            root.style.display = "none";
            root.setAttribute("data-ytb-shorts-dead", "1");
          }
        }
      } catch (err) {}
    }

    function restoreShortsShells() {
      try {
        document.querySelectorAll("[data-ytb-shorts-dead]").forEach((el) => {
          el.style.display = "";
          el.removeAttribute("data-ytb-shorts-dead");
        });
      } catch (err) {}
    }

    function sanitizeShortsHrefs(scope) {
      if (!S.hideShortsRedirect) return;
      try {
        const s = scope && scope.querySelectorAll ? scope : document;
        const links = s.querySelectorAll("a[href*='/shorts/']");
        for (let i = 0; i < links.length; i++) {
          const a = links[i];
          const href = a.getAttribute("href") || "";
          const m = href.match(/\/shorts\/([A-Za-z0-9_-]{4,})/);
          if (m) a.setAttribute("href", "/watch?v=" + m[1]);
        }
      } catch (err) {}
    }
    const domActive = new Set();
    let domObs = null,
      domQueue = null,
      domRaf = false;
    function domFlush() {
      domRaf = false;
      const q = domQueue;
      domQueue = null;
      if (!q || !q.length || !domActive.has("shorts")) return;
      const doRemove = !!S.hideShortsDomClean;
      const doSanitize = !!S.hideShortsRedirect;
      for (let i = 0; i < q.length; i++) {
        const root = q[i];
        try {
          if (!root || !root.isConnected) continue;
          if (doRemove) {
            if (matchesShorts(root)) {
              root.remove();
              continue;
            }
            const hits = queryShorts(root);
            for (let k = 0; k < hits.length; k++) {
              try {
                hits[k].remove();
              } catch (err) {}
            }
          }
          if (doSanitize) sanitizeShortsHrefs(root);
          killShortsShells(root);
        } catch (err) {}
      }
    }
    function startDom(kind) {
      domActive.add(kind);
      if (domObs || !document.body) return;
      try {
        domObs = new MutationObserver(function (records) {
          if (!domActive.size) return;
          if (!domQueue) domQueue = [];
          for (let i = 0; i < records.length; i++) {
            const added = records[i].addedNodes;
            for (let j = 0; j < added.length; j++) {
              const n = added[j];
              if (n && n.nodeType === 1) domQueue.push(n);
            }
          }
          if (!domRaf) {
            domRaf = true;
            requestAnimationFrame(domFlush);
          }
        });
        domObs.observe(document.body, { childList: true, subtree: true });
      } catch (err) {
        domObs = null;
      }
    }
    function stopDom(kind) {
      domActive.delete(kind);
      if ("shorts" === kind) restoreShortsShells();
      if (domActive.size || !domObs) return;
      try {
        domObs.disconnect();
      } catch (err) {}
      domObs = null;
    }
    function scrubRoot() {
      if (!shortsOn()) return;

      killShortsShells(document);

      if (S.hideShortsDomClean) {
        try {
          const hits = queryShorts(document);
          for (let i = 0; i < hits.length; i++) {
            try {
              hits[i].remove();
            } catch (err) {}
          }
        } catch (err) {}
      }

      sanitizeShortsHrefs(document);
    }

    function shortsRedirect() {
      try {
        if (!shortsOn() || !S.hideShortsRedirect) return;
        const m = location.pathname.match(/^\/shorts\/([A-Za-z0-9_-]{4,})/);
        if (!m) return;
        const id = m[1];
        let seen = [];
        try {
          seen = JSON.parse(sessionStorage.getItem("__yourtube_sr") || "[]");
        } catch (err) {
          seen = [];
        }
        if (seen.indexOf(id) !== -1) return; 
        seen.push(id);
        if (seen.length > 50) seen = seen.slice(-50);
        try {
          sessionStorage.setItem("__yourtube_sr", JSON.stringify(seen));
        } catch (err) {}
        const q = location.search || "";
        location.replace("/watch?v=" + id + (q ? q.replace(/^\?/, "&") : ""));
      } catch (err) {}
    }

    const SHORTS_HIDE =
      "{display:none!important;visibility:hidden!important;pointer-events:none!important}";
    const SHORTS_CSS =
      SHORTS_SEL_SAFE.join(",") +
      SHORTS_HIDE +
      "\n@supports selector(:has(*)){" +
      SHORTS_SEL_HAS.join(",") +
      SHORTS_HIDE +
      "}";

    xa.register({
      id: "hide-shorts",
      name: "Hide Shorts",
      summary: "Removes every Shorts surface site-wide; optional API filtering.",
      cat: "feed",
      masterKey: "hideShorts",
      keys: ["hideShorts", "hideShortsRedirect", "hideShortsDomClean", "hideShortsApiFilter"],
      apply(ctx) {
        if (!S.hideShorts) {
          stopDom("shorts");
          return;
        }

        ctx.addStyle(SHORTS_CSS);

        try { installInitialDataTrap(); } catch (err) {}
        shortsRedirect();
        ctx.onNav(() => setTimeout(shortsRedirect, 80));

        if (S.hideShortsDomClean || S.hideShortsRedirect) {
          startDom("shorts");
          ctx.onNav(() => setTimeout(scrubRoot, 60));
        } else {
          stopDom("shorts");
        }

        ensureApi();

        scrubRoot();
      },
      settings(en) {
        en.appendChild(Io("Remove Shorts everywhere", "hideShorts"));
        en.appendChild(Io("Redirect Shorts links to the normal player", "hideShortsRedirect"));
        en.appendChild(Io("Also strip Shorts from live / injected content", "hideShortsDomClean"));
        en.appendChild(Io("Filter Shorts before they render (recommended)", "hideShortsApiFilter"));
      },
    });

    xa.register({
      id: "hide-auto-dubbed",
      name: "Hide Auto-Dubs",
      summary: "Filters auto-dubbed cards; keeps original-audio versions visible.",
      cat: "feed",
      masterKey: "hideAutoDubbedOn",
      keys: ["hideAutoDubbedOn", "hideAutoDubbedPreferOriginal"],
      apply(ctx) {
        if (!S.hideAutoDubbedOn) return;
        try { installInitialDataTrap(); } catch (err) {}
        ensureApi();

        try {
          if (e.ytInitialPlayerResponse) handlePlayerResponse(e.ytInitialPlayerResponse);
        } catch (err) {}
        ctx.onNav(() => {
          try {
            if (e.ytInitialPlayerResponse) handlePlayerResponse(e.ytInitialPlayerResponse);
          } catch (err) {}
        });
      },
      settings(en) {
        en.appendChild(Io("Hide auto-dubbed videos", "hideAutoDubbedOn"));
        en.appendChild(Io("On the watch page, restore the original audio track", "hideAutoDubbedPreferOriginal"));
        en.appendChild(
          To(
            "div",
            "ytb-hist-note",
            "Feed and recommendation filtering relies on the metadata YouTube exposes (audio-track flags, badges and accessibility labels), so it is best-effort there. On the watch page detection is exact, and the original audio track is restored automatically when available.",
          ),
        );
      },
    });

    try {
      e.__YOURTUBE_ENGINE__ = {
        isShortsCard,
        isDubbedCard,
        scrubTree,
        handlePlayerResponse,
        endpointUrl,
        pausedDialogConfirmBtn: _ytbPausedDialogConfirmBtn,

        apply: (id) => xa.apply(id),
        quarantined: () => Array.from(va.keys()).filter((id) => xa.isQuarantined(id)),
        resources: () => YourTubeResources.stats(),
        get cfg() { return S; },
        features: () => xa.list(),
        fetchWrapped: () => !!(e.fetch && e.fetch.__ytbWrapped),
      };
    } catch (err) {}
  })();

