async () => {
  const id = "algo-intelligence";
  const make = (n, title, channel) => `<ytd-video-renderer id="feed${n}"><a id="video-title">${title}</a><ytd-channel-name>${channel}</ytd-channel-name></ytd-video-renderer>`;
  scene(make(1,"Field recording","Field Lab") + make(2,"Night recording","Night Lab") + make(3,"Other recording","Block Channel"), "/results?search_query=field");
  const display = n => getComputedStyle(q('#feed'+n)).display;
  await trial(id,'algoBlockKeywords','Matching title is hidden locally and restored on OFF',async r=>{
    await set(id,'algoIntelligenceOn',true); await set(id,'algoBlockKeywords','night');
    r.on=[await equal(()=>display(1),'block',1500),await equal(()=>display(2),'none',1500)];
    await set(id,'algoIntelligenceOn',false); r.off=await equal(()=>display(2),'block',1500);r.pass=true;
  });
  await trial(id,'algoBlockChannels','Changing criteria and dynamically inserted cards update without touching other cards',async r=>{
    await set(id,'algoIntelligenceOn',true);await set(id,'algoBlockKeywords','');await set(id,'algoBlockChannels','block channel');
    r.on=await equal(()=>display(3),'none',1500);
    q('#stage').insertAdjacentHTML('beforeend',make(4,'New item','Block Channel'));
    r.newCard=await equal(()=>display(4),'none',1800);
    q('#feed4 ytd-channel-name').firstChild.data='Other channel';
    r.changed=await equal(()=>display(4),'block',1800);
    await set(id,'algoIntelligenceOn',false);r.off=await equal(()=>display(3),'block',1500);r.pass=true;
  });
  await trial(id,'algoIntelligenceOn','Legacy account automation settings do not expose reaction controls or send requests',async r=>{
    scene(window.labPlayer.replace('<video ', '<video src="/audit/media.webm" '), '/watch?v=LabVideo001');
    await set(id,'algoIntelligenceOn',true); await set(id,'algoAutoTrain',true);
    const v=q('video'); await v.play(); await wait(11500);
    r.videoAdvanced=v.currentTime>2;
    const text=pane(id).innerText;
    r.reactionControls=pane(id).querySelectorAll('[data-key="algoAutoLikeOn"],[data-key="algoAutoDislikeOn"],[data-key="algoBoostOn"]').length;
    r.legacyEnabled=YourTube.cfg.algoAutoLikeOn===true && YourTube.cfg.algoAutoDislikeOn===true && YourTube.cfg.algoBoostOn===true;
    r.description=text.includes('does not send likes');
    await set(id,'algoIntelligenceOn',false);
    if(r.reactionControls!==0||!r.legacyEnabled||!r.description||!r.videoAdvanced)throw Error('Legacy settings or controls incorrect');
    r.pass=true;
  });
  return rows;
};
