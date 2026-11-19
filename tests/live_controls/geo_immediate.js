async () => {
  scene('<div id="geo-fixture"></div>', '/');
  await trial('geo-override','immediate','Changes compatible client context immediately and restores only script-owned document language',async r=>{
    const originalCfg=window.ytcfg, originalLang=document.documentElement.getAttribute('lang');
    const cfg={GL:'FR',HL:'fr',INNERTUBE_CONTEXT:{client:{gl:'US',hl:'en'}}};
    window.ytcfg={data_:cfg,get:k=>cfg[k],set:o=>Object.assign(cfg,o)};
    document.documentElement.setAttribute('lang','en');
    try {
      YourTube.setCfgMany({geoLang:'fr',geoRegion:'FR',geoPatchNavigator:false,geoPatchFetch:false,geoPatchXHR:false,geoPatchBeacon:false});
      await set('geo-override','geoOverrideOn',true);
      r.lang=await equal(()=>document.documentElement.getAttribute('lang'),'fr');
      r.context=await equal(()=>cfg.INNERTUBE_CONTEXT.client.gl,'FR');
      if(cfg.INNERTUBE_CONTEXT.client.hl!=='fr')throw Error('client language was not updated');
      await set('geo-override','geoOverrideOn',false);
      r.rollback=await equal(()=>document.documentElement.getAttribute('lang'),'en');
      await set('geo-override','geoOverrideOn',true);
      document.documentElement.setAttribute('lang','de');
      await set('geo-override','geoOverrideOn',false);
      r.external=await equal(()=>document.documentElement.getAttribute('lang'),'de');
      r.pass=true;
    } finally {
      window.ytcfg=originalCfg;
      if(originalLang===null)document.documentElement.removeAttribute('lang'); else document.documentElement.setAttribute('lang',originalLang);
    }
  });
  return rows;
};
