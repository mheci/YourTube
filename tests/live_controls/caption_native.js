async () => {
  scene(labPlayer + '<div class="ytp-caption-window-container"><span class="ytp-caption-segment">Native sample</span></div>');
  await trial('force-cc','ccAutoEnable','Caption styles do not switch on subtitles or select tracks in styling-only mode',async r=>{
    const player=q('#movie_player'), button=q('.ytp-subtitles-button');
    let clicks=0, loads=0, tracks=0;
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>clicks++);
    player.loadModule=()=>loads++;
    player.setOption=(_module,key)=>{if(key==='track')tracks++};
    player.getOption=()=>[];
    YourTube.setCfgMany({ccAutoEnable:false,ccNativePrefs:true,ccFontSize:42});
    await set('force-cc','forceCC',true);
    await equal(()=>getComputedStyle(q('.ytp-caption-segment')).fontSize,'42px');
    await new Promise(resolve=>setTimeout(resolve,2600));
    if(button.getAttribute('aria-pressed')!=='false'||clicks||loads||tracks) throw Error(JSON.stringify({state:button.getAttribute('aria-pressed'),clicks,loads,tracks}));
    r.appliedStyle=true;r.nativeStateUnchanged=true;
    await set('force-cc','forceCC',false);
    r.pass=true;
  });
  return rows;
};
