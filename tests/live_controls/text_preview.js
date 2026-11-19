async () => {
  const id='text-scale';
  await trial(id,'textScalePct','Text size preview updates live from the mounted slider',async r=>{
    await set(id,'textScaleOn',true); const preview=pane(id).querySelector('.ytb-text-scale-preview');
    if(!preview||!preview.getClientRects().length)throw Error('Preview not visible');
    r.initial=preview.style.fontSize;
    await set(id,'textScalePct',150);r.larger=await equal(()=>preview.style.fontSize,'150%',900);
    await set(id,'textScalePct',110);r.smaller=await equal(()=>preview.style.fontSize,'110%',900);
    await set(id,'textScaleOn',false);r.pass=true;
  });
  return rows;
};
