// Component-specific layouts and floating surfaces shared by the feature registry.
// The dashboard frame, navigation and typography are defined separately.
const YT_FEATURE_SURFACES = String.raw`
.ytb-fp{position:relative;width:100%}
.ytb-fp-btn{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:7px 10px;background:rgba(255,255,255,.05);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:7px;font:inherit;font-size:12px;cursor:pointer;transition:background .15s,border-color .15s;text-align:left}
.ytb-fp-btn:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.2)}
.ytb-fp-btn:focus{outline:none;border-color:rgba(255,61,127,.55);box-shadow:0 0 0 3px rgba(255,61,127,.15)}
.ytb-fp-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ytb-fp-arrow{color:#8b93a3;font-size:10px;flex-shrink:0}
.ytb-fp-dd{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:50;max-height:260px;display:flex;flex-direction:column;background:rgba(18,20,26,.92);border:1px solid rgba(255,255,255,.14);border-radius:10px;box-shadow:0 18px 40px rgba(0,0,0,.6),0 4px 12px rgba(0,0,0,.4);backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);overflow:hidden;animation:ytbFpFade .12s ease-out}
.ytb-fp-search{margin:8px 8px 6px;padding:6px 10px;background:rgba(255,255,255,.06);color:#eef;border:1px solid rgba(255,255,255,.1);border-radius:6px;font:inherit;font-size:11.5px;outline:none;flex-shrink:0}
.ytb-fp-search::placeholder{color:#7a8290}
.ytb-fp-search:focus{border-color:rgba(255,61,127,.55)}
.ytb-fp-list{overflow-y:auto;flex:1;padding:2px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent}
.ytb-fp-list::-webkit-scrollbar{width:6px}
.ytb-fp-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:6px}
.ytb-fp-item{padding:6px 10px;border-radius:5px;cursor:pointer;color:#eef;font-size:12px;line-height:1.3;transition:background .1s}
.ytb-fp-item:hover{background:rgba(255,61,127,.22);color:#fff}
.ytb-fp-item.selected{background:rgba(255,61,127,.32);font-weight:600}@keyframes ytbFpFade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
#ytb-ivs{font-family:"Inter","Roboto",system-ui,-apple-system,sans-serif}
#ytb-ivs .ytb-ivs-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,0))}
#ytb-ivs .ytb-ivs-title{font-size:13px;font-weight:700;letter-spacing:.02em}
#ytb-ivs .ytb-ivs-close{appearance:none;border:0;background:rgba(255,255,255,.06);color:#dde;width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:12px;line-height:1;font-weight:700;transition:background .12s}
#ytb-ivs .ytb-ivs-close:hover{background:rgba(255,80,80,.25);color:#fff}
#ytb-ivs .ytb-ivs-input{margin:10px 14px 4px;padding:8px 12px;background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:8px;font:inherit;font-size:13px;outline:none;flex-shrink:0}
#ytb-ivs .ytb-ivs-input::placeholder{color:#7a8290}
#ytb-ivs .ytb-ivs-input:focus{border-color:rgba(255,61,127,.55);box-shadow:0 0 0 3px rgba(255,61,127,.15)}
#ytb-ivs .ytb-ivs-status{padding:0 14px 6px;font:11px ui-monospace,monospace;color:#8b93a3}
#ytb-ivs .ytb-ivs-timeline{position:relative;height:8px;margin:0 14px 10px;background:rgba(255,255,255,.05);border-radius:4px;overflow:hidden;flex-shrink:0}
#ytb-ivs .ytb-ivs-results{flex:1;min-height:0;overflow-y:auto;padding:4px 8px 10px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent}
#ytb-ivs .ytb-ivs-results::-webkit-scrollbar{width:6px}
#ytb-ivs .ytb-ivs-results::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:6px}
#ytb-ivs .ytb-ivs-row{display:flex;align-items:flex-start;gap:10px;padding:6px 8px;border-radius:6px;cursor:pointer;transition:background .1s}
#ytb-ivs .ytb-ivs-row:hover{background:rgba(255,61,127,.18)}
#ytb-ivs .ytb-ivs-time{flex-shrink:0;font:11px ui-monospace,monospace;color:#ff8a96;background:rgba(255,61,127,.18);padding:2px 6px;border-radius:4px;cursor:pointer}
#ytb-ivs .ytb-ivs-time:hover{background:rgba(255,61,127,.3);color:#fff}
#ytb-ivs .ytb-ivs-text{flex:1;min-width:0;font-size:12px;color:#dde;line-height:1.45;word-wrap:break-word;overflow-wrap:break-word}
#ytb-ivs .ytb-ivs-hl{background:rgba(255,61,127,.45);color:#fff;font-weight:600;padding:0 2px;border-radius:2px}
#ytb-ivs .ytb-ivs-hint{padding:10px 12px;color:#7a8290;font-size:11.5px;font-style:italic}@keyframes ytbIvsIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
.ytb-cp{display:flex;align-items:center;gap:8px;width:100%}
.ytb-cp-text{flex:1;min-width:0}
.ytb-cp-native{width:36px;height:32px;border:1px solid rgba(255,255,255,.15);border-radius:7px;background:transparent;cursor:pointer;padding:2px;flex-shrink:0}
.ytb-cp-swatch{width:28px;height:28px;border-radius:6px;border:1px solid rgba(255,255,255,.18);flex-shrink:0;background:#000}
.ytb-cp-native::-webkit-color-swatch-wrapper{padding:0}
.ytb-cp-native::-webkit-color-swatch{border:none;border-radius:5px}
.ytb-cp-native::-moz-color-swatch{border:none;border-radius:5px}
#ytb-extra-notes,#ytb-extra-notes *{font-style:normal;font-variant:normal;box-sizing:border-box}
#ytb-toast,#ytb-toast *{font-style:normal;font-variant:normal;box-sizing:border-box}
#ytb-sb-hud,#ytb-sb-hud *{font-style:normal;font-variant:normal;box-sizing:border-box}
#ytb-sb-ov,#ytb-sb-ov *{font-style:normal;font-variant:normal;box-sizing:border-box}
#ytb-stats,#ytb-stats *{font-style:normal;font-variant:normal;box-sizing:border-box}
#ytb-diag,#ytb-diag *{font-style:normal;font-variant:normal;box-sizing:border-box}
#ytb-chapter-panel,#ytb-chapter-panel *{font-style:normal;font-variant:normal;box-sizing:border-box}
.ytb-btn{appearance:none;border:1px solid var(--line2);border-radius:6px;padding:6px 12px;background:var(--panel3);color:var(--ink);cursor:pointer;font:inherit;font-size:12px;font-weight:550;transition:background .12s,border-color .12s,color .12s}
.ytb-btn:hover{background:#1d222b;border-color:#39414e;color:#fff}
.ytb-btn:active{transform:translateY(1px)}
.ytb-btn.primary{background:var(--acc);color:#fff;border-color:var(--acc)}
.ytb-btn.primary:hover{background:#ff4f6a;border-color:#ff4f6a;color:#fff}
.ytb-btn.danger,.ytb-btn.ytb-danger{background:transparent;color:#ff7d8c;border-color:rgba(255,80,100,.35)}
.ytb-btn.danger:hover,.ytb-btn.ytb-danger:hover{background:rgba(255,80,100,.12);color:#ffb3bc}
.ytb-btn.ytb-close{width:28px;height:28px;padding:0;border-radius:6px;font:11px/1 var(--mono);display:inline-flex;align-items:center;justify-content:center}
.ytb-btn.ytb-sb{font-size:10px;padding:4px 8px}
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
.ytb-hcard{display:flex;gap:10px;padding:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.05);border-radius:10px;margin-top:6px;transition:background .15s}
.ytb-hcard:hover{background:rgba(255,255,255,.07)}
.ytb-hcard.done{opacity:.6}
.ytb-hthumb{width:88px;height:50px;min-width:88px;border-radius:7px;background:#1a1c22 center/cover no-repeat;position:relative;flex-shrink:0;overflow:hidden;border:1px solid rgba(255,255,255,.06)}
.ytb-hbadge{position:absolute;bottom:3px;right:3px;background:rgba(0,0,0,.85);color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px}
.ytb-hbadge.done{background:rgba(0,160,50,.85)}
.ytb-hbadge.res{background:rgba(255,61,127,.85)}
.ytb-hinfo{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.ytb-htitle{font-size:11.5px;font-weight:600;color:#e5e7ed;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ytb-hchan{font-size:10px;color:#7a8290;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ytb-hmeta{font-size:10px;color:#5b6270;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ytb-hpt{height:3px;background:rgba(255,255,255,.08);border-radius:3px;margin:3px 0;overflow:hidden}
.ytb-hpf{height:100%;background:linear-gradient(90deg,#ff0033,#ff3d7f);border-radius:3px}
.ytb-hpf.done{background:linear-gradient(90deg,#0a6,#4caf50)}
.ytb-hacts{display:flex;gap:4px;margin-top:4px;flex-wrap:wrap}
.ytb-hist-loading,.ytb-hist-empty{padding:20px;text-align:center;color:#5b6270;font-size:11.5px}
.ytb-hist-panel{display:flex;flex-direction:column;gap:8px;margin-top:6px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:12px}
.ytb-hist-toolbar{display:flex;gap:6px;flex-wrap:wrap}
.ytb-hist-search{flex:1;min-width:120px;background:rgba(255,255,255,.05);color:#eef;border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:6px 10px;font:inherit;font-size:12px;outline:none}
.ytb-hist-search:focus{border-color:rgba(255,61,127,.55)}
.ytb-hist-list{display:flex;flex-direction:column;gap:6px;max-height:420px;overflow-y:auto;scrollbar-width:thin;padding-right:2px}
.ytb-hist-loadmore{margin-top:0!important;background:rgba(255,255,255,.04)!important}
#ytb-extra-topbar{position:fixed;left:0;top:0;height:3px;width:0;background:linear-gradient(90deg,#ff0033,#ff3d7f);z-index:2147483642;box-shadow:0 1px 10px rgba(255,61,127,.6);pointer-events:none}
#ytb-extra-remain,#ytb-extra-clock,#ytb-extra-endwarn{position:fixed;right:12px;bottom:58px;z-index:2147483636;background:rgba(20,22,28,.5);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:5px 10px;font:11px/1.2 ui-monospace,monospace;backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);box-shadow:0 6px 20px rgba(0,0,0,.4);pointer-events:none;}
#ytb-extra-clock{bottom:84px;color:#8ee}
#ytb-extra-endwarn{left:50%;right:auto;bottom:120px;transform:translateX(-50%);opacity:0;transition:opacity .2s;color:#ffd166}
#ytb-extra-endwarn.show{opacity:1}
.ytb-extra-num{position:absolute;left:5px;top:5px;z-index:5;background:linear-gradient(135deg,#ff0033,#ff3d7f);color:#fff;border-radius:99px;min-width:22px;height:22px;display:flex;align-items:center;justify-content:center;font:700 11px system-ui;box-shadow:0 2px 6px rgba(255,0,51,.4)}
.ytb-extra-long{box-shadow:inset 3px 0 0 #8b5cf6!important}
.ytb-extra-short{box-shadow:inset 3px 0 0 #22c55e!important}
.ytb-extra-watched-dim{opacity:.45!important;filter:saturate(.6)!important}
.ytb-extra-watched-hide,.ytb-extra-live,.ytb-extra-premiere{display:none!important}
#ytb-extra-notes{position:fixed;right:18px;bottom:18px;z-index:2147483646;width:min(360px,calc(100vw - 36px));background:rgba(20,22,28,.55);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.55),0 4px 16px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%);padding:12px;font:12px system-ui;}
.ytb-extra-notes-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.ytb-extra-notes-head button{background:none;border:0;color:#aaa;font-size:18px;cursor:pointer}
#ytb-extra-notes textarea{width:100%;min-height:140px;background:rgba(255,255,255,.06);color:#eee;border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:6px;font:inherit;resize:vertical}
.ytb-extra-notes-foot{display:flex;justify-content:space-between;align-items:center;margin-top:6px;font:10.5px ui-monospace,monospace;color:#777}
.ytb-extra-notes-foot button{background:linear-gradient(135deg,#ff0033,#ff3d7f);color:#fff;border:0;border-radius:5px;padding:4px 10px;cursor:pointer;font:600 11px system-ui}
.ytb-toast,.ytb-t-info,.ytb-t-success,.ytb-t-error{position:fixed;left:50%;top:12px;transform:translateX(-50%) translateY(-10px);z-index:2147483647;background:rgba(20,22,28,.55);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.55),0 4px 16px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%);padding:10px 18px;font:12px/1.4 system-ui;font-style:normal;opacity:0;transition:opacity .2s,transform .2s;max-width:min(420px,calc(100vw - 32px));}
.ytb-toast.show,.ytb-t-info.show,.ytb-t-success.show,.ytb-t-error.show{opacity:1;transform:translateX(-50%) translateY(0)}
.ytb-toast.success,.ytb-t-success{border-color:rgba(76,175,80,.55);background:linear-gradient(135deg,rgba(20,22,28,.6),rgba(76,175,80,.22))}
.ytb-toast.error,.ytb-t-error{border-color:rgba(255,80,80,.55);background:linear-gradient(135deg,rgba(20,22,28,.6),rgba(255,80,80,.22))}
.ytb-toast.info,.ytb-t-info{border-color:rgba(255,61,127,.55);background:linear-gradient(135deg,rgba(20,22,28,.6),rgba(255,61,127,.22))}
.ytb-tabs{display:flex;gap:2px;padding:0 12px;border-bottom:1px solid rgba(255,255,255,.07);background:linear-gradient(180deg,rgba(255,255,255,.02),rgba(255,255,255,0))}
.ytb-tab{flex:1;padding:10px 6px;background:transparent;border:0;color:#a8b0c0;font:600 11.5px/1 system-ui;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;border-bottom:2px solid transparent;transition:color .15s,border-color .15s;text-shadow:0 1px 1px rgba(0,0,0,.3)}
.ytb-tab:hover{color:#e8eaf0}
.ytb-tab.active{color:#ff3d7f;border-bottom-color:#ff3d7f;text-shadow:0 0 8px rgba(255,61,127,.5)}
.ytb-section-hdr{font:700 10.5px/1 system-ui;letter-spacing:.08em;text-transform:uppercase;color:#9aa4b6;padding:14px 16px 6px;display:flex;align-items:center;gap:8px;text-shadow:0 1px 1px rgba(0,0,0,.3)}
.ytb-section-hdr::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,0))}
.ytb-meter{height:8px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden;position:relative}
.ytb-meter-fill{height:100%;background:linear-gradient(90deg,#ff0033,#ff3d7f);border-radius:99px;transition:width .3s}
.ytb-meter-fill.ok{background:linear-gradient(90deg,#4caf50,#8bc34a)}
.ytb-meter-fill.warn{background:linear-gradient(90deg,#ffc107,#ff9800)}
.ytb-meter-fill.crit{background:linear-gradient(90deg,#ff5722,#e91e63)}
.ytp-kbd{font:10px ui-monospace,monospace;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-bottom-width:2px;border-radius:4px;padding:2px 6px;color:#dde;display:inline-block}
.ytb-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:99px;background:rgba(255,61,127,.12);color:#ff8aa5;font:600 10.5px/1 system-ui;border:1px solid rgba(255,61,127,.25)}
.ytb-chip.neutral{background:rgba(255,255,255,.05);color:#9aa;border-color:rgba(255,255,255,.1)}
.ytb-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);margin:8px 0}
#ytb-fcw-overlay{position:fixed;right:18px;top:80px;z-index:2147483638;width:min(320px,calc(100vw - 36px));background:rgba(20,22,28,.55);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.5);backdrop-filter:blur(20px) saturate(160%);-webkit-backdrop-filter:blur(20px) saturate(160%);padding:12px 16px;font:12px/1.4 system-ui;}
#ytb-comment-search{display:flex;gap:6px;align-items:center;background:rgba(20,22,28,.55);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:6px 10px;margin:8px 0;backdrop-filter:blur(14px) saturate(160%);-webkit-backdrop-filter:blur(14px) saturate(160%);box-shadow:0 4px 14px rgba(0,0,0,.35);}
#ytb-comment-search .ytb-cs-input{flex:1;min-width:0;background:rgba(0,0,0,.25);color:#eef;border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:5px 8px;font:11.5px system-ui;outline:none;}
#ytb-comment-search .ytb-cs-count{font-size:11px;color:#9aa;font-variant-numeric:tabular-nums;white-space:nowrap;}
#ytb-comment-search .ytb-cs-clear{background:rgba(255,255,255,.07);border:0;color:#aaa;width:24px;height:24px;border-radius:5px;cursor:pointer;font-size:14px;line-height:1;}
#ytb-comment-search .ytb-cs-clear:hover{background:rgba(255,255,255,.13);color:#fff}
#ytb-chapter-panel .ytb-ch-hdr{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(255,255,255,.04);font-size:11.5px;font-weight:600;color:#cdd;}
#ytb-chapter-panel .ytb-ch-toggle{background:none;border:0;color:#888;cursor:pointer;font-size:11px;padding:0 4px}
#ytb-chapter-panel .ytb-ch-toggle:hover{color:#fff}
#ytb-chapter-panel .ytb-ch-list{max-height:340px;overflow-y:auto;scrollbar-width:thin}
#ytb-chapter-panel .ytb-ch-row{display:flex;gap:10px;padding:6px 12px;cursor:pointer;border-top:1px solid rgba(255,255,255,.03);transition:background .1s}
#ytb-chapter-panel .ytb-ch-row:hover{background:rgba(255,255,255,.05)}
#ytb-chapter-panel .ytb-ch-t{flex:0 0 auto;color:#5fc;font-variant-numeric:tabular-nums;font-size:11.5px;min-width:54px}
#ytb-chapter-panel .ytb-ch-title{flex:1;min-width:0;font-size:12px;color:#ddd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#ytb-chapter-panel .ytb-ch-row.current{background:rgba(255,61,127,.14)}
#ytb-chapter-panel .ytb-ch-row.current .ytb-ch-t{color:#ff3d7f;font-weight:600}
#ytb-chapter-panel .ytb-ch-row.current .ytb-ch-title{color:#fff;font-weight:600}
#ytb-extra-notes .ytb-extra-notes-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
#ytb-extra-notes .ytb-extra-notes-head button{background:none;border:0;color:#aaa;font-size:18px;cursor:pointer}
#ytb-extra-notes textarea{width:100%;min-height:140px;background:rgba(0,0,0,.25);color:#eef;border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:8px;font:12px ui-monospace,SFMono-Regular,Consolas,monospace;resize:vertical}
#ytb-extra-notes .ytb-extra-notes-foot{display:flex;justify-content:space-between;align-items:center;margin-top:6px;font:10.5px ui-monospace,monospace;color:#9aa}
#ytb-extra-notes .ytb-extra-notes-foot button{background:linear-gradient(135deg,#ff0033 0%,#ff3d7f 100%);color:#fff;border:0;border-radius:5px;padding:4px 10px;cursor:pointer;font:600 11px system-ui}
#ytb-fcw-overlay .ytb-fcw-title{flex:1;font-weight:600;color:#fff;font-size:13px}
#ytb-fcw-overlay .ytb-fcw-sub{font-size:11px;color:#9aa;margin-top:4px}
#ytb-fcw-overlay .ytb-fcw-bar{height:4px;background:rgba(255,255,255,.08);border-radius:3px;margin-top:6px;overflow:hidden}
#ytb-fcw-overlay .ytb-fcw-stats{font-size:11px;color:#aaa;margin-top:4px}
#ytb-fcw-overlay .ytb-fcw-btn{background:rgba(255,255,255,.07);border:0;border-radius:5px;color:#ddd;padding:6px 12px;cursor:pointer;font:600 11px system-ui}
#ytb-extra-endwarn{left:50%;right:auto;bottom:120px;transform:translateX(-50%);opacity:0;transition:opacity .15s;color:#ffd166}
.ytb-extra-comment-clamp{max-height:150px;overflow:hidden;display:block}
.ytb-extra-expand-comment{margin-top:4px;border:0;border-radius:999px;background:rgba(62,166,255,.14);color:#3ea6ff;padding:3px 8px;font:700 11px system-ui;cursor:pointer}
#ytb-sb-hud{position:fixed;left:10px;bottom:36px;z-index:2147483635;background:rgba(20,22,28,.5);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:5px 12px;font:11px/1.3 ui-monospace,SFMono-Regular,Consolas,monospace;backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);box-shadow:0 6px 20px rgba(0,0,0,.4);}
#ytb-sb-ov{position:fixed;top:60px;left:50%;transform:translateX(-50%);z-index:2147483639;background:rgba(20,22,28,.55);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:8px 18px;font:12px system-ui;backdrop-filter:blur(20px) saturate(160%);-webkit-backdrop-filter:blur(20px) saturate(160%);box-shadow:0 10px 30px rgba(0,0,0,.5);}
#ytb-stats{position:fixed;top:60px;right:8px;z-index:2147483637;background:rgba(20,22,28,.5);color:#eef;border:1px solid rgba(255,255,255,.12);border-radius:10px;font:11px/1.3 ui-monospace,SFMono-Regular,Consolas,monospace;padding:6px 10px;line-height:1.5;max-width:380px;backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);box-shadow:0 6px 20px rgba(0,0,0,.4);}
#ytb-diag{position:fixed;bottom:0;left:0;width:380px;max-height:200px;overflow:auto;z-index:2147483647;background:rgba(20,22,28,.55);color:#cdd;border:1px solid rgba(255,255,255,.12);border-radius:14px 14px 0 0;border-bottom:none;border-left:none;border-right:none;font:11px ui-monospace,SFMono-Regular,Consolas,monospace;padding:8px;backdrop-filter:blur(20px) saturate(160%);-webkit-backdrop-filter:blur(20px) saturate(160%);box-shadow:0 -8px 24px rgba(0,0,0,.4);}
.ytb-sb-mark{pointer-events:none}
body.ytb-silent #ytb-toast,body.ytb-silent #ytb-sb-hud,body.ytb-silent #ytb-sb-ov,body.ytb-silent #ytb-stats,body.ytb-silent #ytb-diag,body.ytb-silent #ytb-cinema,body.ytb-silent #ytp-ambient,body.ytb-silent .ytb-sb-mark{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
@keyframes ytbResIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
#ytb-chapter-panel{margin:8px 0 12px;background:rgba(20,22,28,.45);color:#e8e8e8;border:1px solid rgba(255,255,255,.1);border-radius:12px;overflow:hidden;font:13px/1.45 system-ui;backdrop-filter:blur(14px) saturate(160%);-webkit-backdrop-filter:blur(14px) saturate(160%);box-shadow:0 4px 16px rgba(0,0,0,.3);}
.ytb-ch-hdr{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(255,255,255,.03);font-size:11.5px;font-weight:600;color:#bbb;text-transform:uppercase;letter-spacing:.05em}
.ytb-ch-toggle{background:none;border:0;color:#888;cursor:pointer;font-size:11px;padding:0 4px}
.ytb-ch-toggle:hover{color:#fff}
.ytb-ch-list{max-height:340px;overflow-y:auto;scrollbar-width:thin}
.ytb-ch-row{display:flex;gap:10px;padding:6px 12px;cursor:pointer;border-top:1px solid rgba(255,255,255,.03);transition:background .1s}
.ytb-ch-row:hover{background:rgba(255,255,255,.05)}
.ytb-ch-t{flex:0 0 auto;color:#5fc;font-variant-numeric:tabular-nums;font-size:11.5px;min-width:54px}
.ytb-ch-title{flex:1;min-width:0;font-size:12px;color:#ddd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#ytb-comment-search{display:flex;align-items:center;gap:8px;padding:10px 14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;margin:0 0 12px;font:13px system-ui}
.ytb-cs-input{flex:1;min-width:0;background:rgba(0,0,0,.4);color:#e8e8e8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:6px 10px;font:inherit;font-size:13px;outline:none}
.ytb-cs-input:focus{border-color:#3ea6ff}
.ytb-cs-count{font-size:11px;color:#888;font-variant-numeric:tabular-nums;white-space:nowrap}
.ytb-cs-clear{background:rgba(255,255,255,.07);border:0;color:#aaa;width:24px;height:24px;border-radius:5px;cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center}
.ytb-cs-clear:hover{background:rgba(255,255,255,.13);color:#fff}
.ytb-elem-sec-title{font-size:10.5px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:.07em;margin:10px 0 4px;padding-top:6px;border-top:1px solid rgba(255,255,255,.06)}
.ytb-net-panel{display:flex;flex-direction:column;gap:8px;margin-top:6px}
.ytb-net-cards{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
.ytb-net-card{background:rgba(159,255,255,.05);border:1px solid rgba(159,255,255,.12);border-radius:7px;padding:8px 10px;display:flex;flex-direction:column;gap:2px}
.ytb-net-card-label{font-size:10px;color:#9ff;text-transform:uppercase;letter-spacing:.08em;font-weight:700}
.ytb-net-card-value{font-size:15px;color:#eee;font-weight:700;font-variant-numeric:tabular-nums}
.ytb-net-card-sub{font-size:10px;color:#888}
.ytb-net-session{font:11px ui-monospace,monospace;color:#9ff;background:rgba(255,255,255,.03);border-radius:5px;padding:5px 8px}
.ytb-net-legend{display:flex;gap:14px;justify-content:flex-end;padding:0 4px;margin-top:2px}
.ytb-net-legend-item{display:inline-flex;align-items:center;gap:5px;font:11px/1.2 system-ui;color:#cfcfcf}
.ytb-net-swatch{display:inline-block;width:12px;height:12px;border-radius:3px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}
.ytb-net-swatch-dn{background:linear-gradient(180deg,#4dd0e1 0%,#0288d1 100%)}
.ytb-net-swatch-up{background:linear-gradient(180deg,#ff8a65 0%,#c62828 100%)}
.ytb-net-chart{display:flex;align-items:flex-end;gap:2px;height:120px;padding:6px 4px;background:rgba(0,0,0,.35);border-radius:6px;border:1px solid rgba(255,255,255,.06);position:relative;overflow:hidden}
.ytb-net-chart::before{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(255,255,255,.06);pointer-events:none}
.ytb-net-bar{flex:1;min-width:2px;display:flex;flex-direction:column;justify-content:flex-end;height:100%;position:relative;cursor:default;transition:opacity .12s}
.ytb-net-bar:hover{opacity:.85}
.ytb-net-bar-dn{background:linear-gradient(180deg,#4dd0e1 0%,#0288d1 100%);border-bottom-left-radius:2px;border-bottom-right-radius:2px;box-shadow:inset 0 1px 0 rgba(255,255,255,.18);transition:filter .12s}
.ytb-net-bar-up{background:linear-gradient(180deg,#ff8a65 0%,#c62828 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.22);border-top-left-radius:2px;border-top-right-radius:2px;transition:filter .12s}
.ytb-net-bar:hover .ytb-net-bar-dn,.ytb-net-bar:hover .ytb-net-bar-up{filter:brightness(1.25) saturate(1.2)}
.ytb-net-card:nth-child(1){background:rgba(159,255,255,.06);border-color:rgba(159,255,255,.18)}
.ytb-net-card:nth-child(1) .ytb-net-card-label{color:#9ff}
.ytb-net-card:nth-child(2){background:rgba(2,136,209,.10);border-color:rgba(77,208,225,.28)}
.ytb-net-card:nth-child(2) .ytb-net-card-label,.ytb-net-card:nth-child(2) .ytb-net-card-value{color:#4dd0e1}
.ytb-net-card:nth-child(3){background:rgba(198,40,40,.10);border-color:rgba(255,138,101,.28)}
.ytb-net-card:nth-child(3) .ytb-net-card-label,.ytb-net-card:nth-child(3) .ytb-net-card-value{color:#ff8a65}
.ytb-net-axis{display:flex;justify-content:space-between;font:10px ui-monospace,monospace;color:#666;padding:0 4px}
.ytb-net-hosts{display:flex;flex-direction:column;gap:2px;background:rgba(255,255,255,.025);border-radius:6px;padding:6px 8px}
.ytb-net-host-row{display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.04)}
.ytb-net-host-row:last-child{border-bottom:0}
.ytb-net-host-name{color:#ddd;font-family:ui-monospace,monospace;font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}
.ytb-net-host-bytes{color:#9ff;font-variant-numeric:tabular-nums;flex-shrink:0;margin-left:8px}
.ytb-net-budget{background:rgba(255,255,255,.025);border-radius:6px;padding:8px 10px;display:flex;flex-direction:column;gap:5px}
.ytb-net-budget-bar{height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden}
.ytb-net-budget-fill{height:100%;background:linear-gradient(90deg,#4caf50,#8bc34a);border-radius:4px;transition:width .3s}
.ytb-net-budget-fill.warn{background:linear-gradient(90deg,#ffc107,#ff9800)}
.ytb-net-budget-fill.crit{background:linear-gradient(90deg,#ff5722,#e91e63)}
.ytb-net-budget-fill.over{background:linear-gradient(90deg,#e53935,#b71c1c);animation:ytbBudgetPulse 1.4s ease-in-out infinite}
@keyframes ytbBudgetPulse{0%,100%{opacity:1}50%{opacity:.55}}
.ytb-net-budget-detail{font:11px ui-monospace,monospace;color:#ddd;font-variant-numeric:tabular-nums}
.ytb-net-qualities{background:rgba(255,255,255,.025);border-radius:6px;padding:6px 8px;display:flex;flex-direction:column;gap:4px}
.ytb-net-q-row{display:grid;grid-template-columns:64px 1fr 110px;gap:8px;align-items:center}
.ytb-net-q-lbl{color:#fff;font:700 10px/1 system-ui;text-align:center;padding:3px 4px;border-radius:3px;letter-spacing:.04em}
.ytb-net-q-track{height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden}
.ytb-net-q-fill{height:100%;border-radius:4px;transition:width .25s}
.ytb-net-q-bytes{font:10.5px ui-monospace,monospace;color:#ccc;text-align:right;font-variant-numeric:tabular-nums}
.ytb-perf-panel{display:flex;flex-direction:column;gap:6px;margin-top:6px}
.ytb-perf-mem{font:11px ui-monospace,monospace;color:#9ff;background:rgba(255,255,255,.03);border-radius:5px;padding:5px 8px}
.ytb-perf-membar{height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden}
.ytb-perf-memfill{height:100%;background:#4caf50;border-radius:3px;transition:width .3s,background .3s}
.ytb-perf-state{font:10.5px ui-monospace,monospace;color:#aaa;padding:3px 0}
.ytb-perf-table{display:flex;flex-direction:column;background:rgba(255,255,255,.02);border-radius:5px;overflow:hidden;font:10.5px ui-monospace,monospace}
.ytb-perf-row{display:grid;grid-template-columns:1.4fr .5fr .7fr .7fr .7fr;padding:3px 8px;gap:6px;border-bottom:1px solid rgba(255,255,255,.04);align-items:center}
.ytb-perf-hdr{font-weight:700;color:#9ff;background:rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.1)}
.ytb-perf-row .ytb-perf-c1{color:#ddd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ytb-perf-row .ytb-perf-c2,.ytb-perf-row .ytb-perf-c3,.ytb-perf-row .ytb-perf-c4,.ytb-perf-row .ytb-perf-c5{text-align:right;font-variant-numeric:tabular-nums;color:#ccc}
.ytb-sbsub-panel{display:flex;flex-direction:column;gap:6px}
.ytb-sbsub-status{font:11px ui-monospace,monospace;background:rgba(255,255,255,.03);border-radius:5px;padding:6px 8px;color:#888}
.ytb-hk-row{display:grid;grid-template-columns:1fr 160px 30px;gap:6px;align-items:center;padding:3px 0}
.ytb-hk-lbl{font-size:12px;color:#ddd}
.ytb-hk-key{font:11px ui-monospace,monospace;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:4px;padding:5px 8px;color:#9ff;cursor:pointer;text-align:center}
.ytb-hk-key.listening{background:rgba(200,0,0,.2);border-color:#c00;color:#fff;animation:ytbHkBlink 1s linear infinite}
.ytb-hk-key.empty{color:#666;font-style:italic}
@keyframes ytbHkBlink{50%{opacity:.5}}
.ytb-hk-clr{background:rgba(255,255,255,.05);border:0;border-radius:4px;color:#888;cursor:pointer;font-size:14px;line-height:1;padding:0}
.ytb-hk-clr:hover{background:rgba(200,0,0,.2);color:#fff}
.ytb-stop-btn{color:#fff!important;opacity:.9!important;display:inline-flex!important;align-items:center!important;justify-content:center!important}
.ytb-stop-btn:hover{opacity:1!important;color:#ff5252!important}.ytb-drop-box{position:fixed;z-index:2147483635;padding:4px 8px;background:rgba(20,22,28,.78);color:#ff8a96;border:1px solid rgba(255,138,150,.28);border-radius:6px;font:11px/1.3 ui-monospace,SFMono-Regular,Consolas,monospace;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);pointer-events:none;min-width:80px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,.35);transition:color .2s}
.ytb-drop-box:hover{opacity:.85}
.ytb-vstats-box{position:fixed;z-index:2147483635;padding:6px 10px;background:rgba(20,22,28,.82);color:#ddd;border:1px solid rgba(255,255,255,.14);border-radius:8px;font:10.5px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);pointer-events:none;min-width:200px;box-shadow:0 6px 20px rgba(0,0,0,.45)}
.ytb-vstats-box canvas{display:block;margin-top:4px;width:100%;height:24px;background:rgba(0,0,0,.35);border-radius:3px}
.ytb-stop-btn svg{width:22px;height:22px;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(0,0,0,.55))}.ytb-fps-box{position:fixed;z-index:2147483635;padding:3px 7px;background:rgba(20,22,28,.78);color:#9ff;border:1px solid rgba(159,255,255,.28);border-radius:6px;font:11px/1 ui-monospace,SFMono-Regular,Consolas,monospace;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);pointer-events:none;min-width:54px;text-align:center;transition:opacity .2s;box-shadow:0 4px 12px rgba(0,0,0,.35)}
.ytb-fps-box:hover{opacity:.85}
.ytb-buf-box{position:fixed;z-index:2147483635;left:8px;bottom:48px;padding:6px 10px;background:rgba(20,22,28,.78);color:#ddd;border:1px solid rgba(255,255,255,.14);border-radius:8px;font:11px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);min-width:160px;pointer-events:none;box-shadow:0 6px 20px rgba(0,0,0,.4)}
.ytb-buf-bar{height:4px;background:rgba(255,255,255,.12);border-radius:3px;margin-top:4px;overflow:hidden}
.ytb-buf-fill{height:100%;width:0;background:#4caf50;border-radius:3px;transition:width .3s,background .3s}
@media (max-width:500px){.ytb-net-cards{grid-template-columns:1fr 1fr}}
.ytb-elem-status{font-size:11px;color:#888;padding:2px 0 6px;font-variant-numeric:tabular-nums}
.ytb-preset-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.ytb-preset-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:7px;padding:8px 10px;cursor:pointer;transition:background .12s,border-color .12s}
.ytb-preset-card:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.14)}
.ytb-preset-card.active{background:rgba(200,0,0,.12);border-color:rgba(200,0,0,.35)}
.ytb-preset-name{font-size:12px;font-weight:600;color:#e0e0e0;margin-bottom:2px}
.ytb-preset-desc{font-size:10px;color:#888;line-height:1.35}
.ytb-elem-list{display:flex;flex-direction:column;gap:1px;max-height:380px;overflow-y:auto;background:rgba(255,255,255,.015);border-radius:6px;padding:3px;scrollbar-width:thin}
.ytb-elem-group-hdr{font:600 10px/1 system-ui;letter-spacing:.06em;text-transform:uppercase;color:#888;padding:8px 8px 3px;margin-top:3px;border-top:1px solid rgba(255,255,255,.04)}
.ytb-elem-group-hdr:first-child{border-top:0;margin-top:0}
.ytb-elem-row{display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:4px;cursor:default;transition:background .1s}
.ytb-elem-row:hover{background:rgba(62,166,255,.1)}
.ytb-elem-row.on{background:rgba(255,80,80,.07)}
.ytb-elem-row.nomatch{opacity:.4}
.ytb-elem-cb{margin:0;cursor:pointer;width:14px;height:14px;accent-color:#c00;flex-shrink:0}
.ytb-elem-name{flex:1;min-width:0;font-size:11.5px;color:#ddd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ytb-elem-match{font:10px ui-monospace,monospace;color:#555;flex-shrink:0;font-variant-numeric:tabular-nums}
#ytb-elem-hover{animation:ytbElemFade .1s ease-out}
@keyframes ytbElemFade{from{opacity:0}to{opacity:1}}
.ytb-hist-note{font-size:10px;color:#666;line-height:1.5;margin-top:6px;padding:6px 8px;background:rgba(255,255,255,.02);border-radius:4px}
.ytb-geo-sel{position:relative;width:100%}
.ytb-geo-input{width:100%}
.ytb-geo-dd{position:absolute;top:100%;left:0;right:0;z-index:2147483646;max-height:260px;overflow-y:auto;background:rgba(18,20,26,.92);border:1px solid rgba(255,255,255,.14);border-radius:10px;margin-top:4px;box-shadow:0 18px 40px rgba(0,0,0,.6),0 4px 12px rgba(0,0,0,.4);backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);scrollbar-width:thin}
.ytb-geo-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 10px;font-size:11.5px;color:#ddd;cursor:pointer;user-select:none}
.ytb-geo-row:hover,.ytb-geo-row.hot{background:rgba(200,0,0,.18);color:#fff}
.ytb-geo-row.selected{background:rgba(200,0,0,.32);color:#fff;font-weight:600}
.ytb-geo-name{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ytb-geo-code{flex-shrink:0;font-size:10px;color:#888;font-variant:tabular-nums;text-transform:uppercase}
.ytb-geo-empty{padding:10px;text-align:center;color:#666;font-size:11px}
.ytb-geo-status{background:rgba(255,255,255,.04);border-radius:5px;padding:6px 9px;font:11px ui-monospace,monospace;color:#5fc;margin:6px 0}
.ytb-theme-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:5px;margin:4px 0}
.ytb-theme-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:7px;padding:5px;cursor:pointer;text-align:center;transition:border-color .12s,background .12s;contain:content;content-visibility:auto;contain-intrinsic-size:53px}
.ytb-theme-card:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.14)}
.ytb-theme-card.active{border-color:#c00;background:rgba(200,0,0,.1)}
.ytb-theme-card.reset{padding:10px;margin-top:6px}
.ytb-theme-swatch{width:100%;height:28px;border-radius:4px;border:1px solid rgba(255,255,255,.1);margin-bottom:4px;display:flex;align-items:flex-end;justify-content:flex-end;padding:3px}
.ytb-theme-accent{width:9px;height:9px;border-radius:50%}
.ytb-theme-name{font-size:9.5px;color:#ccc;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ytb-toggle-pill{font:700 10px system-ui;padding:3px 8px;border-radius:999px;letter-spacing:.02em;text-transform:uppercase;display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:18px;transition:background .15s,color .15s}
.ytb-ivs-mark:hover{background:rgba(255,61,127,1)!important;z-index:2}
#ytb-palette{display:none;flex-direction:column}
#ytb-palette .ytb-palette-input{appearance:none;background:transparent;color:#fff;border:0;border-bottom:1px solid rgba(255,255,255,.12);padding:14px 18px;font:600 15px/1.2 "Inter","Roboto",system-ui,-apple-system,sans-serif;outline:none;letter-spacing:.01em}
#ytb-palette .ytb-palette-input::placeholder{color:#7a8290;font-weight:400}
#ytb-palette .ytb-palette-results{flex:1;min-height:0;overflow-y:auto;padding:4px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent}
#ytb-palette .ytb-palette-results::-webkit-scrollbar{width:6px}
#ytb-palette .ytb-palette-results::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:6px}
#ytb-palette .ytb-palette-row{display:grid;grid-template-columns:1fr auto;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;cursor:pointer;transition:background .1s}
#ytb-palette .ytb-palette-row.active,#ytb-palette .ytb-palette-row:hover{background:rgba(255,61,127,.18)}
#ytb-palette .ytb-palette-lbl{font-size:13.5px;color:#f0f2f7;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#ytb-palette .ytb-palette-hint{font-size:11px;color:#9aa;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;white-space:nowrap}
#ytb-palette .ytb-palette-empty{padding:24px 18px;color:#7a8290;font-size:12.5px;text-align:center;font-style:italic}
#ytb-palette .ytb-palette-foot{padding:8px 14px;border-top:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.2);color:#9aa;font-size:11px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
#ytb-cheat{display:none;flex-direction:column}
#ytb-cheat .ytb-cheat-head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,.1);background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,0))}
#ytb-cheat .ytb-cheat-title{font:700 15px/1 "Inter","Roboto",system-ui,-apple-system,sans-serif;color:#fff;letter-spacing:.02em}
#ytb-cheat .ytb-cheat-filter{appearance:none;background:rgba(255,255,255,.05);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:8px 12px;margin:10px 14px 4px;font:inherit;font-size:13px;outline:none;flex-shrink:0}
#ytb-cheat .ytb-cheat-filter::placeholder{color:#7a8290}
#ytb-cheat .ytb-cheat-filter:focus{border-color:rgba(255,61,127,.55);box-shadow:0 0 0 3px rgba(255,61,127,.15)}
#ytb-cheat .ytb-cheat-body{flex:1;min-height:0;overflow-y:auto;padding:6px 14px 10px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent}
#ytb-cheat .ytb-cheat-body::-webkit-scrollbar{width:6px}
#ytb-cheat .ytb-cheat-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:6px}
#ytb-cheat .ytb-cheat-cat{font:700 10.5px/1 system-ui;letter-spacing:.08em;text-transform:uppercase;color:#9aa4b6;padding:10px 0 4px;display:flex;align-items:center;gap:8px}
#ytb-cheat .ytb-cheat-cat::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,0))}
#ytb-cheat .ytb-cheat-row{display:grid;grid-template-columns:1fr 110px 1fr;align-items:center;gap:10px;padding:5px 0;font-size:12.5px}
#ytb-cheat .ytb-cheat-lbl{color:#e5e7ed;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#ytb-cheat .ytb-cheat-key{text-align:right}
#ytb-cheat .ytb-cheat-hint{color:#7a8290;font-size:11px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#ytb-cheat .ytb-cheat-foot{padding:8px 14px;border-top:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.2);color:#9aa;font-size:11px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
@media (max-width:500px){#ytb-palette,#ytb-cheat{width:calc(100vw - 16px)!important;left:8px!important;right:8px!important;top:8px!important;transform:translateX(0)!important;max-height:80vh!important}#ytb-cheat .ytb-cheat-row{grid-template-columns:1fr 90px}}
.ytb-dash .ytp-kbd{background:var(--card);border:1px solid var(--line2);border-bottom-width:2px;border-radius:4px;color:var(--ink2);font:9.5px ui-monospace,monospace;padding:1px 5px}
.ytb-dash .ytb-chip{background:rgba(var(--accink),.07);color:var(--acc);border:1px solid rgba(var(--accink),.35);border-radius:999px;font:600 10px/1 ui-monospace,SFMono-Regular,Consolas,monospace}
.ytb-dash .ytb-chip.neutral{background:var(--card-hi);color:var(--ink2);border:1px solid var(--line2)}
.ytb-dash .ytb-divider{height:1px;background:var(--line);margin:7px 0}
.ytb-dash .ytb-cat-dot{border:1px solid var(--line2)}
.ytb-dash .ytb-dresize{background:linear-gradient(135deg,transparent 0,transparent 50%,var(--line2) 50%,var(--line2) 55%,transparent 55%,transparent 65%,var(--line2) 65%,var(--line2) 70%,transparent 70%,transparent 80%,var(--line2) 80%,var(--line2) 85%,transparent 85%)}
.ytb-dash .ytb-fp-btn{background:var(--card);border:1px solid var(--line2);color:var(--ink)}
.ytb-dash .ytb-fp-btn:hover{background:var(--card-hi);border-color:var(--ink3)}
.ytb-dash .ytb-fp-btn:focus{outline:none;border-color:var(--acc);box-shadow:none}
.ytb-dash .ytb-fp-arrow{color:var(--ink3)}
.ytb-dash .ytb-fp-dd{background:var(--card);border:1px solid var(--line2);border-radius:8px;box-shadow:0 14px 30px rgba(var(--shadowink),.16),0 2px 8px rgba(var(--shadowink),.08);backdrop-filter:none;-webkit-backdrop-filter:none}
.ytb-dash .ytb-fp-search{background:var(--card);border:1px solid var(--line2);color:var(--ink)}
.ytb-dash .ytb-fp-search::placeholder{color:var(--ink3)}
.ytb-dash .ytb-fp-search:focus{border-color:var(--acc)}
.ytb-dash .ytb-fp-item{color:var(--ink)}
.ytb-dash .ytb-fp-item:hover{background:rgba(var(--accink),.08);color:var(--ink)}
.ytb-dash .ytb-fp-item.selected{background:rgba(var(--accink),.12);color:var(--ink);font-weight:600}
.ytb-dash .ytb-cp-native{border:1px solid var(--line2);background:transparent}
.ytb-dash .ytb-cp-swatch{border:1px solid var(--line2)}
.ytb-dash .ytb-preset-card{background:var(--card);border:1px solid var(--line)}
.ytb-dash .ytb-preset-card:hover{background:var(--card-hi);border-color:var(--line2)}
.ytb-dash .ytb-preset-card.active{background:rgba(var(--accink),.08);border-color:rgba(var(--accink),.45)}
.ytb-dash .ytb-preset-name{color:var(--ink)}
.ytb-dash .ytb-preset-desc{color:var(--ink3)}
.ytb-dash .ytb-theme-card{background:var(--card);border:1px solid var(--line)}
.ytb-dash .ytb-theme-card:hover{background:var(--card-hi);border-color:var(--line2)}
.ytb-dash .ytb-theme-card.active{border-color:var(--acc);background:rgba(var(--accink),.07)}
.ytb-dash .ytb-theme-swatch{border:1px solid rgba(0,0,0,.08)}
.ytb-dash .ytb-theme-name{color:var(--ink2)}
.ytb-dash .ytb-hcard{background:var(--card);border:1px solid var(--line);border-radius:8px}
.ytb-dash .ytb-hcard:hover{background:var(--card-hi)}
.ytb-dash .ytb-hthumb{border:1px solid var(--line);background:var(--card-lo) center/cover no-repeat}
.ytb-dash .ytb-hbadge{background:rgba(var(--shadowink),.82)}
.ytb-dash .ytb-hbadge.res{background:rgba(var(--accink),.9)}
.ytb-dash .ytb-htitle{color:var(--ink)}
.ytb-dash .ytb-hchan{color:var(--ink2)}
.ytb-dash .ytb-hmeta{color:var(--ink3)}
.ytb-dash .ytb-hpt{background:var(--card-lo)}
.ytb-dash .ytb-hpf{background:var(--ink)}
.ytb-dash .ytb-hpf.done{background:var(--ok)}
.ytb-dash .ytb-hist-panel{background:transparent;border:1px solid var(--line);border-radius:8px}
.ytb-dash .ytb-hist-search{background:var(--card);color:var(--ink);border:1px solid var(--line2)}
.ytb-dash .ytb-hist-search:focus{border-color:var(--acc)}
.ytb-dash .ytb-hist-loading,.ytb-dash .ytb-hist-empty{color:var(--ink3)}
.ytb-dash .ytb-hist-list{scrollbar-color:var(--line2) transparent}
.ytb-dash .ytb-hist-loadmore{background:none!important}
.ytb-dash .ytb-hist-note{color:var(--ink3);background:var(--card-hi)}
.ytb-dash .ytb-elem-list{background:transparent;border:1px solid var(--line)}
.ytb-dash .ytb-elem-group-hdr{color:var(--ink3);border-top:1px solid var(--line)}
.ytb-dash .ytb-elem-row:hover{background:rgba(var(--accink),.06)}
.ytb-dash .ytb-elem-row.on{background:rgba(var(--accink),.08)}
.ytb-dash .ytb-elem-cb{accent-color:var(--ink)}
.ytb-dash .ytb-elem-name{color:var(--ink2)}
.ytb-dash .ytb-elem-match{color:var(--ink3)}
.ytb-dash .ytb-elem-sec-title{color:var(--ink3);border-top:1px solid var(--line)}
.ytb-dash .ytb-geo-dd{background:var(--card);border:1px solid var(--line2);border-radius:8px;box-shadow:0 14px 30px rgba(var(--shadowink),.16),0 2px 8px rgba(var(--shadowink),.08);backdrop-filter:none;-webkit-backdrop-filter:none}
.ytb-dash .ytb-geo-row{color:var(--ink2)}
.ytb-dash .ytb-geo-row:hover,.ytb-dash .ytb-geo-row.hot{background:rgba(var(--accink),.08);color:var(--ink)}
.ytb-dash .ytb-geo-row.selected{background:rgba(var(--accink),.12);color:var(--ink);font-weight:600}
.ytb-dash .ytb-geo-code{color:var(--ink3)}
.ytb-dash .ytb-geo-empty{color:var(--ink3)}
.ytb-dash .ytb-geo-status{background:var(--card-hi);color:var(--acc)}
.ytb-dash .ytb-net-card{background:var(--card);border:1px solid var(--line)}
.ytb-dash .ytb-net-card-label{color:var(--ink3)}
.ytb-dash .ytb-net-card-value{color:var(--ink)}
.ytb-dash .ytb-net-card-sub{color:var(--ink3)}
.ytb-dash .ytb-net-session{background:var(--card-hi);color:var(--acc)}
.ytb-dash .ytb-net-legend-item{color:var(--ink2)}
.ytb-dash .ytb-net-chart{background:var(--card-lo);border:1px solid var(--line)}
.ytb-dash .ytb-net-chart::before{background:rgba(var(--shadowink),.08)}
.ytb-dash .ytb-net-axis{color:var(--ink3)}
.ytb-dash .ytb-net-hosts{background:var(--card);border:1px solid var(--line)}
.ytb-dash .ytb-net-host-row{border-bottom:1px solid var(--card-lo)}
.ytb-dash .ytb-net-host-name{color:var(--ink2)}
.ytb-dash .ytb-net-host-bytes{color:var(--acc)}
.ytb-dash .ytb-net-budget{background:var(--card);border:1px solid var(--line)}
.ytb-dash .ytb-net-budget-bar{background:var(--card-lo)}
.ytb-dash .ytb-net-budget-fill{background:var(--ok)}
.ytb-dash .ytb-net-budget-fill.warn{background:var(--acc)}
.ytb-dash .ytb-net-budget-fill.crit{background:var(--crit)}
.ytb-dash .ytb-net-budget-detail{color:var(--ink2)}
.ytb-dash .ytb-net-qualities{background:var(--card);border:1px solid var(--line)}
.ytb-dash .ytb-net-q-track{background:var(--card-lo)}
.ytb-dash .ytb-net-q-bytes{color:var(--ink2)}
.ytb-dash .ytb-perf-mem{background:var(--card-hi);color:var(--acc)}
.ytb-dash .ytb-perf-membar{background:var(--card-lo)}
.ytb-dash .ytb-perf-memfill{background:var(--ok)}
.ytb-dash .ytb-perf-state{color:var(--ink2)}
.ytb-dash .ytb-perf-table{background:var(--card);border:1px solid var(--line)}
.ytb-dash .ytb-perf-row{border-bottom:1px solid var(--card-lo)}
.ytb-dash .ytb-perf-hdr{color:var(--acc);background:var(--card-hi);border-bottom:1px solid var(--line)}
.ytb-dash .ytb-perf-row .ytb-perf-c1{color:var(--ink2)}
.ytb-dash .ytb-perf-row .ytb-perf-c2,.ytb-dash .ytb-perf-row .ytb-perf-c3,.ytb-dash .ytb-perf-row .ytb-perf-c4,.ytb-dash .ytb-perf-row .ytb-perf-c5{color:var(--ink2)}
.ytb-dash .ytb-sbsub-status{background:var(--card-hi);color:var(--ink2)}
.ytb-dash .ytb-hk-lbl{color:var(--ink2)}
.ytb-dash .ytb-hk-key{background:var(--card);border:1px solid var(--line2);color:var(--acc)}
.ytb-dash .ytb-hk-key.listening{background:rgba(var(--critink),.08);border-color:var(--crit);color:var(--crit)}
.ytb-dash .ytb-hk-key.empty{color:var(--ink3)}
.ytb-dash .ytb-hk-clr{background:none;color:var(--ink3)}
.ytb-dash .ytb-hk-clr:hover{background:rgba(var(--critink),.1);color:var(--crit)}
.ytb-dash .ytb-toggle-pill{background:var(--card-hi);color:var(--ink2)}
`;
