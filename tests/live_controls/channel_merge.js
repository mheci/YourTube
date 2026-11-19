async () => {
  scene('<ytd-browse page-subtype="channels"><yt-image-banner-view-model id="banner" style="display:block">Banner</yt-image-banner-view-model></ytd-browse>', '/@FieldLab');
  await trial('hero-artwork-heal','channelBannerMode','Banner controls remain effective when artwork healing is disabled',async r=>{
    await set('hero-artwork-heal','heroHealOn',false);
    await set('hero-artwork-heal','channelBannerMode','hide');
    r.hidden=await equal(()=>style('#banner','display'),'none');
    await set('hero-artwork-heal','channelBannerMode','default');
    r.restored=await equal(()=>style('#banner','display'),'block');
    r.noDuplicate=!YourTube.features.get('channel-banner-mode');
    r.pass=r.noDuplicate;
  });
  return rows;
};
