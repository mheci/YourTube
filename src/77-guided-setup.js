// A recipe is a one-time patch, never a policy that runs on navigation or boot.
const guidedQuestions = [
  ['What would you like to see less of?', 'Choose what changes on the watch page.', [
    ['Keep my current layout', {}], ['Recommendations', {hideRecs:true}],
    ['Recommendations and end screens', {hideRecs:true, hideEndscreen:true}],
  ]],
  ['How should videos start?', 'Quality is a preference. The player may not offer every resolution.', [
    ['Let YouTube decide', {autoHD:false}], ['Prefer 720p', {autoHD:true, qualityPref:'hd720'}],
    ['Prefer 1080p', {autoHD:true, qualityPref:'hd1080'}],
  ]],
  ['When you return to a video…', 'Session History stores progress in this browser. Turning it off keeps existing entries.', [
    ['Leave it to YouTube', {sessionRestoreOn:false}], ['Ask where to start', {sessionRestoreOn:true, sessionResumeMode:'ask'}],
    ['Record progress without asking', {sessionRestoreOn:true, sessionResumeMode:'record'}],
  ]],
];
const guidedFields = {
  hideRecs:['Hide recommendations','hide-recs'], hideEndscreen:['Hide end screens','hide-endscreen'],
  autoHD:['Quality lock','auto-hd'], qualityPref:['Preferred quality','auto-hd'],
  sessionRestoreOn:['Session History','session-restore'], sessionResumeMode:['Resume behavior','session-restore'],
};
function mountGuidedSetup({shell, main, foot, el, button, setQuery, setCat}) {
  const tabs = el(shell,'div','ytg-tabs'); shell.insertBefore(tabs,main);
  const panel = el(shell,'section','ytg-panel'); shell.insertBefore(panel,main);
  panel.setAttribute('aria-label','Guided setup'); panel.hidden=true;
  let step=-1, answers=[], excluded=new Set(), invite;
  const all=button(tabs,'ytb-btn','All features',()=>{show(false);setCat('all');setQuery('')});
  const guide=button(tabs,'ytb-btn','Presets',()=>{show(true);draw()});
  const badge=el(tabs,'span','ytg-badge');
  function updateBadge(){
    const saved=S.guidedPreset;
    const keys=Object.keys(guidedFields).filter(k=>saved && Object.hasOwn(saved,k));
    badge.textContent=keys.length ? (keys.some(k=>S[k]!==saved[k])?'Customized':'Preset applied') : '';
  }
  So('cfg.changed',updateBadge); updateBadge();
  function show(open){ if(invite)invite.hidden=open||!!S.guidedPreset; panel.hidden=!open; main.hidden=foot.hidden=open; all.setAttribute('aria-pressed',String(!open));guide.setAttribute('aria-pressed',String(open)); }
  const display=v=>({true:'On',false:'Off',hd720:'720p',hd1080:'1080p',ask:'Ask where to start',record:'Record only'}[String(v)]??String(v));
  function draw(){
    panel.replaceChildren(); const card=el(panel,'div','ytg-stage');
    const heading=(over,title,note)=>{el(card,'span','ytg-step',over);const h=el(card,'h2','',title);h.tabIndex=-1;el(card,'p','',note);h.focus({preventScroll:true})};
    if(step<0){
      heading('Guided setup','Make YouTube yours','Answer three questions, then choose which settings to apply. You can change every setting later.');
      button(card,'ytb-btn primary','Find my preset',()=>{step=0;draw()});
      button(card,'ytb-btn','Browse all features',()=>{show(false);setCat('all');setQuery('')}); return;
    }
    if(step<3){
      const [title,note,options]=guidedQuestions[step];heading(`Step ${step+1} of 3`,title,note);
      const group=el(card,'fieldset','ytg-options');group.setAttribute('aria-label',title);
      options.forEach(([text],i)=>{const label=el(group,'label','ytg-choice');const radio=el(label,'input','');radio.type='radio';radio.name='ytg-answer';radio.checked=answers[step]===i;el(label,'span','',text);radio.onchange=()=>{answers[step]=i;excluded.clear();next.disabled=false}});
      button(card,'ytb-btn','Back',()=>{step--;draw()});const next=button(card,'ytb-btn primary',step===2?'Review changes':'Next',()=>{step++;draw()});next.disabled=answers[step]===undefined;return;
    }
    heading('Step 3 of 3 · Review','Review changes','Only checked changes will be applied. Unrelated settings stay as they are.');
    const patch=Object.assign({},...guidedQuestions.map((q,i)=>q[2][answers[i]][1]));
    const changes=Object.keys(patch).filter(k=>S[k]!==patch[k]);
    const selected=()=>changes.filter(k=>!excluded.has(k)&&S[k]!==patch[k]);
    const refresh=()=>{const count=selected().length;apply.textContent=`Apply ${count} change${count===1?'':'s'}`;apply.disabled=!count};
    if(!changes.length)el(card,'p','','Your settings already match these answers.');
    for(const k of changes){const row=el(card,'div','ytg-review');const label=el(row,'label','ytg-choice');const check=el(label,'input','');check.type='checkbox';check.checked=!excluded.has(k);el(label,'span','',guidedFields[k][0]+': '+display(S[k])+' → '+display(patch[k]));check.onchange=()=>{check.checked?excluded.delete(k):excluded.add(k);refresh()};button(row,'ytb-btn','View feature',()=>{show(false);setQuery(guidedFields[k][1])});}
    button(card,'ytb-btn','Back',()=>{step--;draw()});const apply=button(card,'ytb-btn primary','Apply',()=>{
      const keys=selected();if(!keys.length)return;
      const delta=Object.fromEntries(keys.map(k=>[k,patch[k]]));
      const baseline=Object.fromEntries(Object.entries(patch).filter(([k])=>!excluded.has(k)));
      Oa({...delta,guidedPreset:baseline});step=-1;answers=[];excluded.clear();show(false);setCat('all');setQuery('');pe('Preset applied. You can edit any feature.',2000,'success');
    });refresh();
  }
  show(false);
  // A compact invitation, never a forced first-run modal. Existing configurations stay intact.
  if(!badge.textContent){invite=button(tabs,'ytg-invite','Find my preset',()=>{show(true);step=0;draw()});So('cfg.changed',()=>{invite.hidden=!!S.guidedPreset})}
  return {visible:()=>!panel.hidden};
}
