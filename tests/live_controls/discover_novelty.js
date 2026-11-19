async () => {
  scene('<ytd-watch-flexy><div id="secondary"></div></ytd-watch-flexy>', '/watch?v=LabVideo001');
  await trial('discover','novelty','YouTube search fixture respects local history, channel and shown-video signals',async r=>{
    const now=Date.now();
    await YourTube.history.put({videoId:'LabVideo002',channel:'Known Channel',lastWatched:now,sessions:[]});
    await YourTube.storage.set('__yourtube_discover_seen__',{'LabVideo004':now});
    window.ytcfg={get:k=>k==='INNERTUBE_API_KEY'?'fixture-key':k==='INNERTUBE_CONTEXT'?{client:{}}:null};
    const original=window.fetch;
    window.fetch=async(url,opts)=>{
      if(String(url).includes('/youtubei/v1/search')) {
        const rows=[['LabVideo002','Watched','Other'],['LabVideo003','Known channel','Known Channel'],['LabVideo004','Shown','New'],['LabVideo005','Candidate','New']];
        return new Response(JSON.stringify({contents:{twoColumnSearchResultsRenderer:{primaryContents:{sectionListRenderer:{contents:[{itemSectionRenderer:{contents:rows.map(([id,title,channel])=>({videoRenderer:{videoId:id,title:{simpleText:title},ownerText:{simpleText:channel}}}))}}]}}}}}),{status:200,headers:{'content-type':'application/json'}});
      }
      return original(url,opts);
    };
    try {
      YourTube.setCfgMany({discoverExcludeWatched:true,discoverExcludeShown:true,discoverExcludeChannels:true,discoverShownDays:30});
      await set('discover','discoverOn',true);
      await equal(()=>!!q('#ytb-disco .ytb-ui-topic-btn'),true,2500);
      q('#ytb-disco .ytb-ui-topic-btn').click();
      await equal(()=>q('#ytb-disco')?.textContent.includes('Candidate'),true,4000);
      const text=q('#ytb-disco').textContent;
      r.watchedExcluded=!text.includes('Watched');r.channelExcluded=!text.includes('Known channel');r.shownExcluded=!text.includes('Shown');
      r.disclaimer=text.includes('not guaranteed');
      if(!r.watchedExcluded||!r.channelExcluded||!r.shownExcluded||!r.disclaimer)throw Error('Unexpected result: '+text);
      await set('discover','discoverOn',false);
      r.pass=true;
    } finally { window.fetch=original; }
  });
  return rows;
};
