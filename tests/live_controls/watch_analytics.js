async () => {
  await trial('watch-stats','sessionGapMinutes','Statistics use dated sessions and regroup when the actual gap control changes',async r=>{
    const now=Date.now(), id='LabVideo001';
    await YourTube.history.put({videoId:id,channel:'Sample',lastWatched:now,totalWatchTime:270,sessions:[
      {start:now-2*86400000,end:now-2*86400000+1000,played:120},
      {start:now-60*60000,end:now-59*60000,played:60},
      {start:now-30*60000,end:now-29*60000,played:60}
    ]});
    await set('session-restore','sessionRestoreOn',true);
    await set('session-restore','sessionGapMinutes',60);
    await set('watch-stats','watchStatsOn',true);
    await set('watch-stats','watchStatsDays',1);
    pick('watch-stats');
    await equal(()=>pane('watch-stats').textContent.includes('Grouped visits: 1'),true,2000);
    let text=pane('watch-stats').textContent;
    if(!text.includes('Watch time: 2 min')||!text.includes('1 min unallocated'))throw Error('Window or unallocated legacy time is wrong: '+text);
    await set('session-restore','sessionGapMinutes',5);
    pick('watch-stats');
    await equal(()=>pane('watch-stats').textContent.includes('Grouped visits: 2'),true,2000);
    r.pass=true;
  });
  return rows;
};
