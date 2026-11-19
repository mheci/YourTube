async () => {
  const ids = ['sticky-quality','auto-expand-desc','card-metadata','channel-notes','cinema-mode','click-logo-to-subs','compact-playlist','cookie-control','default-audio-track','description-width','end-soon-warning','fixed-player-size','flip-video','highlight-video-length','history-local-hide','keymap','perf-mode','pip-button','playlist-autoscroll','random-pick','restore-fullscreen-scrolling','reverse-playlist','screenshot','shuffle-tools','sub-group-add','sub-groups','subs-only-home','video-filters','watch-later-tools','wide-player','watch-budget','shorts-policy','sleep-timer','stretch-reminder','intention-lock','end-winddown','shorts-marathon-guard','breather','credibility-layer','dead-link-detector','screen-wake','perf-profiler','session-replay','api-explorer','net-monitor','adaptive-throttle','stats-overlay','fps-counter','buffer-health','dropped-frame-counter','hfr-allow','overlay-hub','channel-volume','volume-boost','reader-mode','transcript-tools','seen-memory','dup-title-spotter','storage-dashboard','health-check','shorts-speed','search-filler','sort-search','aio-comment-cleanup','aio-shorts-cleanup','collapse-long-comments','copy-timestamp-button','copy-video-info-button','highlight-creator-comments','highlight-timestamp-links','number-search-results','open-transcript-button','shorts-auto-mute','shorts-hide-comments'];
  await trial('core','retired-features','Retired features are neither registered nor mounted even with old enabled settings',async r=>{
    r.registered=ids.filter(id=>YourTube.features.get(id));
    r.mounted=ids.filter(id=>document.querySelector(`[data-feat="${id}"]`));
    r.savedSettingsPreserved=YourTube.cfg.watchBudgetOn===true && YourTube.cfg.credLayerOn===true && YourTube.cfg.screenWakeOn===true;
    if(r.registered.length||r.mounted.length||!r.savedSettingsPreserved)throw Error('Retirement or saved settings mismatch');
    r.pass=true;
  });
  await trial('core','retired-hotkey','Saved screenshot setting cannot intercept the former shortcut',async r=>{
    YourTube.setCfgMany({screenshotOn:true,keymapOn:true,keymap:{screenshot:'keyx'}});
    const event=new KeyboardEvent('keydown',{code:'KeyX',key:'x',bubbles:true,cancelable:true});
    document.body.dispatchEvent(event);
    r.prevented=event.defaultPrevented;
    r.savedSetting=YourTube.cfg.screenshotOn;
    if(r.prevented || !r.savedSetting) throw Error('Retired screenshot shortcut remained active or settings lost');
    r.pass=true;
  });
  await trial('aio-compact-dense','retired-bundle-members','A legacy bundle does not change retired playlist settings',async r=>{
    YourTube.setCfgMany({compactPlaylistOn:true,playlistAutoscrollOn:true,aioCompactDenseOn:true,aioCompactDenseOnEnrolled:true,aioCompactDenseOnEnrolledMembers:'compactPlaylistOn,playlistAutoscrollOn'});
    await set('aio-compact-dense','aioCompactDenseOn',false);
    r.compact=YourTube.cfg.compactPlaylistOn;r.autoscroll=YourTube.cfg.playlistAutoscrollOn;
    if(!r.compact||!r.autoscroll)throw Error('Legacy settings modified on bundle disable');
    r.pass=true;
  });
  return rows;
};
