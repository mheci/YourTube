async () => {
  const id='night-scheduler', root=document.documentElement, app=q('ytd-app');
  const originalMatch=window.matchMedia, m=new EventTarget();m.matches=false;m.media='(prefers-color-scheme: dark)';window.matchMedia=()=>m;
  const dark=()=>root.hasAttribute('dark')&&app.hasAttribute('dark');
  const setNative=v=>{root.toggleAttribute('dark',v);app.toggleAttribute('dark',v)};
  const change=v=>{m.matches=v;m.dispatchEvent(new Event('change'))};
  try {
    await trial(id,'nightSchedulerMode','Browser color scheme follows changes and restores original on OFF',async r=>{
      setNative(false);await set(id,'nightSchedulerOn',true);await set(id,'nightSchedulerMode','system');
      r.before=dark();change(true);r.on=await equal(dark,true,800);change(false);r.light=await equal(dark,false,800);change(true);await equal(dark,true,800);
      await set(id,'nightSchedulerOn',false);r.off=await equal(dark,false,800);r.pass=true;
    });
    await trial(id,'nightOverridePolicy','Manual choice holds until system changes, or until user resumes',async r=>{
      setNative(false);m.matches=false;await set(id,'nightSchedulerOn',true);await set(id,'nightSchedulerMode','system');await set(id,'nightOverridePolicy','until-change');
      change(true);await equal(dark,true);setNative(false);await wait(40);change(true);await wait(50);r.manual=dark();if(r.manual)throw Error('manual change overwritten');
      change(false);await wait(40);change(true);r.nextChange=await equal(dark,true,800);
      await set(id,'nightOverridePolicy','until-resume');setNative(false);await wait(40);change(false);await wait(40);change(true);await wait(40);r.stillManual=dark();if(r.stillManual)throw Error('permanent manual override lost');
      pick(id);[...pane(id).querySelectorAll('button')].find(n=>n.textContent==='Resume automatic theme').click();r.resumed=await equal(dark,true,800);
      await set(id,'nightSchedulerOn',false);r.pass=true;
    });
  } finally {window.matchMedia=originalMatch;await set(id,'nightSchedulerOn',false);setNative(false);}
  return rows;
};
