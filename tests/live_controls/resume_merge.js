async () => {
  scene('<a id="resume-a" href="/watch?v=LabVideo001&t=22&list=PLfixture">Saved</a><a id="resume-b" href="/watch?v=LabVideo002&t=33">Reused</a><a id="external" href="https://example.org/watch?v=LabVideo001&t=22">External</a><ytd-thumbnail-overlay-resume-playback-renderer id="bar">bar</ytd-thumbnail-overlay-resume-playback-renderer>', '/results?search_query=fixture');
  await trial('session-restore','merged-resume-links','Legacy resume link controls work independently of history and undo only their own changes',async r=>{
    await set('session-restore','sessionRestoreOn',false);
    const a=q('#resume-a'), b=q('#resume-b');
    a.data={commandMetadata:{webCommandMetadata:{url:'/watch?v=LabVideo001&t=22&list=PLfixture'}},watchEndpoint:{startTimeSeconds:22}};
    await set('session-restore','stripResumeTimesOn',true);
    await equal(()=>a.getAttribute('href'),'/watch?v=LabVideo001&list=PLfixture');
    if(!q('#external').href.includes('example.org/watch?v=LabVideo001&t=22'))throw Error('external link modified');
    if(a.data.commandMetadata.webCommandMetadata.url.includes('t=22') || 'startTimeSeconds' in a.data.watchEndpoint)throw Error('native endpoint not cleaned');
    b.setAttribute('href','/watch?v=LabVideo003&list=new');
    await set('session-restore','stripResumeTimesOn',false);
    await equal(()=>a.getAttribute('href'),'/watch?v=LabVideo001&t=22&list=PLfixture');
    if(a.data.commandMetadata.webCommandMetadata.url!=='/watch?v=LabVideo001&t=22&list=PLfixture'||a.data.watchEndpoint.startTimeSeconds!==22)throw Error('native endpoint not restored');
    if(b.getAttribute('href')!=='/watch?v=LabVideo003&list=new')throw Error('overwrote a reused link');
    await set('session-restore','resumeBarStyle','hide');
    await equal(()=>style('#bar','display'),'none');
    await set('session-restore','resumeBarStyle','default');
    await equal(()=>style('#bar','display')==='none',false);
    if(YourTube.features.get('resume-timestamps'))throw Error('duplicate registration remains');
    r.independentControls=true;r.restored=true;r.reusedLinkPreserved=true;r.pass=true;
  });
  return rows;
};
