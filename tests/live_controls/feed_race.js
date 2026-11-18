async () => {
  const id='hide-top-live-games';
  await trial(id,'hideTopLiveGamesOn','Queued shelf scan cannot re-hide a shelf after OFF and restores inline display',async r=>{
    scene('<ytd-shelf-renderer id="shelf" style="display:flex"><h2>Top live games</h2></ytd-shelf-renderer>');
    const read=()=>q('#shelf').style.display;
    r.before=read();await set(id,'hideTopLiveGamesOn',true);r.on=await equal(read,'none',1200);
    q('#stage').appendChild(document.createElement('div'));await wait(80);
    await set(id,'hideTopLiveGamesOn',false);r.off=await equal(read,'flex',1200);await wait(500);
    r.afterPending=read();if(r.afterPending!=='flex')throw Error('Pending observer changed shelf after OFF');r.pass=true;
  });
  return rows;
};
