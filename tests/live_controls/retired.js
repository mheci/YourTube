async () => {
  const ids = ['watch-budget','shorts-policy','sleep-timer','stretch-reminder','intention-lock','end-winddown','shorts-marathon-guard','breather','credibility-layer','dead-link-detector','screen-wake','perf-profiler','session-replay','api-explorer','net-monitor','adaptive-throttle','stats-overlay','fps-counter','buffer-health','dropped-frame-counter','hfr-allow','overlay-hub','channel-volume','volume-boost','reader-mode','transcript-tools','seen-memory','dup-title-spotter','storage-dashboard','health-check','shorts-speed','search-filler','sort-search'];
  await trial('core','retired-features','Retired features are neither registered nor mounted even with old enabled settings',async r=>{
    r.registered=ids.filter(id=>YourTube.features.get(id));
    r.mounted=ids.filter(id=>document.querySelector(`[data-feat="${id}"]`));
    r.savedSettingsPreserved=YourTube.cfg.watchBudgetOn===true && YourTube.cfg.credLayerOn===true && YourTube.cfg.screenWakeOn===true;
    if(r.registered.length||r.mounted.length||!r.savedSettingsPreserved)throw Error('Retirement or saved settings mismatch');
    r.pass=true;
  });
  return rows;
};
