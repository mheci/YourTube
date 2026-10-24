const NEW_SHELL = String.raw`
.ytb-dash{position:fixed;top:24px;right:24px;width:830px;height:auto;max-width:calc(100vw - 32px);max-height:calc(100vh - 48px);z-index:2147483641;--acc:#ff3d5a;--panel:#0d0f14;--panel2:#12151b;--line:#21252d;--line2:#2b313b;--ink:#e8ebf1;--ink2:#a3aab8;--ink3:#697180;--mono:ui-monospace,SFMono-Regular,Consolas,monospace;color:var(--ink);background:var(--panel);border:1px solid var(--line);border-radius:14px;box-shadow:0 24px 70px rgba(0,0,0,.72),0 4px 16px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.05);font:13px/1.45 "Inter","Roboto",system-ui,-apple-system,sans-serif;font-style:normal;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;display:flex;flex-direction:column;opacity:0;transition:opacity .12s ease-out;overflow:hidden;resize:none;contain:layout style paint}
.ytb-dash.open{opacity:1}
.ytb-dash.dragging{transition:none!important;cursor:grabbing!important;user-select:none;-webkit-user-select:none}
.ytb-dash.dragging *{pointer-events:none!important;cursor:grabbing!important}
.ytb-dash.resizing{transition:none;user-select:none}
.ytb-dhandle{cursor:grab;user-select:none;-webkit-user-select:none}
.ytb-dhandle:active{cursor:grabbing}
.ytb-dgrip{display:inline-block;color:var(--acc);font-weight:700;margin-right:8px;font-family:var(--mono);font-size:13px}
.ytb-dhbtns{display:flex;gap:6px;flex-shrink:0}
.ytb-dresize{position:absolute;right:0;bottom:0;width:16px;height:16px;cursor:nwse-resize;background:linear-gradient(135deg,transparent 0,transparent 50%,var(--line2) 50%,var(--line2) 55%,transparent 55%,transparent 65%,var(--line2) 65%,var(--line2) 70%,transparent 70%,transparent 80%,var(--line2) 80%,var(--line2) 85%,transparent 85%);z-index:2;border-bottom-right-radius:14px}
.ytb-dresize:hover{background:linear-gradient(135deg,transparent 0,transparent 50%,var(--acc) 50%,var(--acc) 55%,transparent 55%,transparent 65%,var(--acc) 65%,var(--acc) 70%,transparent 70%,transparent 80%,var(--acc) 80%,var(--acc) 85%,transparent 85%)}
.ytb-dhdr{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--line);background:var(--panel2)}
.ytb-dtitle{font:600 13.5px/1.2 "Inter","Roboto",system-ui,sans-serif;letter-spacing:.04em;display:flex;align-items:center;color:var(--ink)}
.ytb-dver{font:10px/1 var(--mono);color:var(--ink2);margin-left:9px;padding:3px 7px;border-radius:4px;background:var(--panel3);border:1px solid var(--line)}
.ytb-btn{appearance:none;border:1px solid var(--line2);border-radius:6px;padding:6px 12px;background:var(--panel3);color:var(--ink);cursor:pointer;font:inherit;font-size:12px;font-weight:550;transition:background .12s,border-color .12s,color .12s}
.ytb-btn:hover{background:#1d222b;border-color:#39414e;color:#fff}
.ytb-btn:active{transform:translateY(1px)}
.ytb-btn.primary{background:var(--acc);color:#fff;border-color:var(--acc)}
.ytb-btn.primary:hover{background:#ff4f6a;border-color:#ff4f6a;color:#fff}
.ytb-btn.danger,.ytb-btn.ytb-danger{background:transparent;color:#ff7d8c;border-color:rgba(255,80,100,.35)}
.ytb-btn.danger:hover,.ytb-btn.ytb-danger:hover{background:rgba(255,80,100,.12);color:#ffb3bc}
.ytb-btn.ytb-close{width:28px;height:28px;padding:0;border-radius:6px;font:11px/1 var(--mono);display:inline-flex;align-items:center;justify-content:center}
.ytb-btn.ytb-sb{font-size:10px;padding:4px 8px}
.ytb-search{margin:10px 12px 8px;padding:9px 12px;background:var(--panel2);color:var(--ink);border:1px solid var(--line2);border-radius:8px;font:inherit;font-size:12.5px;outline:none}
.ytb-search::placeholder{color:var(--ink3);font-family:var(--mono);font-size:11.5px}
.ytb-search:focus{border-color:var(--acc);box-shadow:0 0 0 2px var(--acc-dim)}
.ytb-main{flex:1 1 0;min-height:0;display:flex;overflow:hidden}
.ytb-nav{width:176px;flex-shrink:0;display:flex;flex-direction:column;gap:1px;padding:8px 6px;border-right:1px solid var(--line);background:var(--panel2);overflow-y:auto;scrollbar-width:thin;scrollbar-color:#2c313b transparent}
.ytb-nav-item{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 9px;border:0;border-left:2px solid transparent;border-radius:6px;background:transparent;color:var(--ink2);font:550 11.5px/1.2 "Inter","Roboto",system-ui,sans-serif;cursor:pointer;text-align:left;transition:background .1s,color .1s}
.ytb-nav-item:hover{color:var(--ink);background:rgba(255,255,255,.03)}
.ytb-nav-item.active{color:#fff;background:var(--acc-dim);border-left-color:var(--acc)}
.ytb-nav-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ytb-nav-count{font:10px/1.4 var(--mono);color:var(--ink3);font-variant-numeric:tabular-nums}
.ytb-nav-item.active .ytb-nav-count{color:#ffd0d8}
.ytb-nav-sep{height:1px;background:var(--line);margin:6px 4px}
.ytb-body{flex:1 1 0;min-height:0;min-width:0;overflow-y:auto;padding:8px 0 10px;scrollbar-width:thin;scrollbar-color:#2c313b transparent}
.ytb-body::-webkit-scrollbar{width:8px}
.ytb-body::-webkit-scrollbar-thumb{background:#2c313b;border-radius:4px}
.ytb-core{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:4px 12px 10px;margin-bottom:4px;border-bottom:1px solid var(--line)}
.ytb-corecell{display:flex;align-items:center;justify-content:space-between;gap:8px;background:var(--panel2);border:1px solid var(--line);border-radius:8px;padding:6px 10px}
.ytb-corecell:hover{border-color:var(--line2)}
.ytb-corelbl{font:550 11.5px/1.2 "Inter","Roboto",system-ui,sans-serif;color:var(--ink)}
.ytb-cat-page{display:flex;flex-direction:column;gap:3px;padding:2px 10px 2px}
.ytb-card{margin:0;padding:10px 12px;background:var(--panel2);border:1px solid var(--line);border-left:2px solid transparent;border-radius:8px;transition:border-color .12s,background .12s;position:relative}
.ytb-card:hover{border-color:var(--line2);background:var(--panel3)}
.ytb-card.on{border-left-color:var(--acc)}
.ytb-head{display:flex;align-items:center;justify-content:space-between;gap:10px}
.ytb-name{font-size:13px;font-weight:600;color:var(--ink);flex:0 1 auto;min-width:0}
.ytb-key{flex:1;min-width:0;margin:0 4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;font:10px/1.4 var(--mono);color:var(--ink3);background:transparent;border:0;padding:1px 2px;cursor:pointer;border-radius:3px}
.ytb-key:hover{color:var(--acc);background:rgba(255,255,255,.03)}
.ytb-sum{font-size:11.5px;color:var(--ink2);margin-top:3px;line-height:1.4}
.ytp-settings{margin-top:9px;padding-top:8px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:7px}
.ytb-sub{display:flex;flex-direction:column;gap:4px;margin-top:4px}
.ytb-row{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:28px}
.ytb-col{display:flex;flex-direction:column;gap:5px}
.ytb-rowb{display:flex;gap:6px;flex-wrap:wrap;margin-top:3px}
.ytb-rowb .ytb-btn{flex:1;min-width:80px}
.ytb-lbl{font-size:12px;color:var(--ink);flex:1;min-width:0}
.ytb-sw{position:relative;width:34px;height:18px;flex-shrink:0;cursor:pointer}
.ytb-sw input{position:absolute;opacity:0;width:0;height:0}
.ytb-track{position:absolute;inset:0;border-radius:5px;background:#22262e;transition:background .15s;border:1px solid #2b313b}
.ytb-knob{position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:3px;background:#7d8590;transition:transform .15s cubic-bezier(.4,0,.2,1),background .15s}
.ytb-sw input:checked~.ytb-track{background:var(--acc);border-color:var(--acc)}
.ytb-sw input:checked~.ytb-knob{transform:translateX(16px);background:#fff}
.ytb-sel{background:var(--panel3);color:var(--ink);border:1px solid var(--line2);border-radius:5px;font:11px var(--mono);padding:4px 7px;outline:none;max-width:150px;transition:border-color .12s}
.ytb-sel:focus{border-color:var(--acc)}
.ytb-sel option{background:#12151b;color:var(--ink)}
.ytb-rng{display:flex;align-items:center;gap:8px;flex:1;max-width:60%}
.ytb-rng input[type=range]{flex:1;min-width:70px;accent-color:var(--acc);height:2px;cursor:pointer}
.ytb-rngv{min-width:48px;text-align:right;color:var(--ink2);font:10px var(--mono);font-variant-numeric:tabular-nums}
.ytb-inp{background:var(--panel3);color:var(--ink);border:1px solid var(--line2);border-radius:6px;padding:6px 9px;font:inherit;font-size:11.5px;outline:none;width:100%;transition:border-color .12s}
.ytb-inp:focus{border-color:var(--acc)}
.ytb-ta{background:var(--panel3);color:var(--ink);border:1px solid var(--line2);border-radius:6px;padding:7px 9px;font:10.5px/1.5 var(--mono);outline:none;width:100%;min-height:64px;resize:vertical;transition:border-color .12s}
.ytb-ta:focus{border-color:var(--acc)}
.ytb-foot{display:flex;gap:6px;padding:10px 12px;border-top:1px solid var(--line);background:var(--panel2);flex-wrap:wrap}
.ytb-foot .ytb-btn{flex:1;min-width:90px}
.ytb-tabs{display:flex;gap:2px;padding:0 12px;border-bottom:1px solid var(--line);background:var(--panel2)}
.ytb-tab{flex:1;padding:8px 6px;background:transparent;border:0;color:var(--ink2);font:600 10.5px/1 var(--mono);letter-spacing:.05em;text-transform:uppercase;cursor:pointer;border-bottom:2px solid transparent;transition:color .12s,border-color .12s}
.ytb-tab:hover{color:var(--ink)}
.ytb-tab.active{color:var(--acc);border-bottom-color:var(--acc)}
.ytb-tabpanel{display:none;flex-direction:column;gap:6px;padding:4px 0 8px}
.ytb-tabpanel.active{display:flex}
.ytb-section-hdr{font:600 10px/1 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--ink3);padding:12px 12px 5px;display:flex;align-items:center;gap:8px}
.ytb-section-hdr::after{content:"";flex:1;height:1px;background:var(--line)}
.ytb-meter{height:6px;background:var(--panel3);border-radius:3px;overflow:hidden;position:relative}
.ytb-meter-fill{height:100%;background:var(--acc);border-radius:3px;transition:width .3s}
.ytb-meter-fill.ok{background:#37c26b}
.ytb-meter-fill.warn{background:#f2b134}
.ytb-meter-fill.crit{background:#ff3d5a}
.ytp-kbd{font:9.5px var(--mono);background:var(--panel3);border:1px solid var(--line2);border-bottom-width:2px;border-radius:3px;padding:2px 5px;color:var(--ink);display:inline-block}
.ytb-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:4px;background:var(--acc-dim);color:#ff8fa1;font:600 10px/1 var(--mono);border:1px solid rgba(255,61,90,.3)}
.ytb-chip.neutral{background:var(--panel3);color:var(--ink2);border-color:var(--line2)}
.ytb-divider{height:1px;background:var(--line);margin:7px 0}
.ytb-cat-dot{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-right:6px}
@media (max-width:640px){.ytb-dash{width:calc(100vw - 16px)!important;left:8px!important;right:8px!important;top:8px!important;max-height:calc(100vh - 16px)}.ytb-main{flex-direction:column}.ytb-nav{width:100%;flex-direction:row;overflow-x:auto;overflow-y:hidden;border-right:0;border-bottom:1px solid var(--line);padding:6px}.ytb-nav-item{white-space:nowrap}.ytb-rng input{min-width:60px}.ytb-core{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.ytb-dash,.ytb-card,.ytb-btn,.ytb-knob{transition:none!important}}
`;

module.exports = { NEW_SHELL };
