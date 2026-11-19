const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const p=vm.runInNewContext(fs.readFileSync('src/33-retention-policy.js','utf8')+'\nRetentionPolicy;');
const t=s=>Date.parse(s), hour=3600000;
test('calendar months clamp month ends and leap days in UTC',()=>{
 assert.equal(p.plusMonths(t('2026-01-31T12:30:00Z')),t('2026-04-30T12:30:00Z'));
 assert.equal(p.plusMonths(t('2024-11-30T00:00:00Z')),t('2025-02-28T00:00:00Z'));
 assert.equal(p.plusMonths(t('2023-11-30T00:00:00Z')),t('2024-02-29T00:00:00Z'));
});
test('nearby sessions expire as one group based on its last end, preserve unknown dates',()=>{
 const start=t('2026-01-30T00:00:00Z');
 const sessions=[{start,end:start+hour},{start:start+2*hour,end:start+3*hour},{start:start+5*hour},{start:0}];
 const result=p.classify(sessions,p.plusMonths(start+3*hour)+1);
 assert.equal(result.trash.length,1); assert.equal(result.trash[0].sessions.length,2);
 assert.equal(result.active.length,1); assert.equal(result.undated.length,1);
});
test('seven day window and exemptions apply to only restored sessions',()=>{
 const start=t('2026-01-01T00:00:00Z'), expiry=p.plusMonths(start);
 const sessions=[{start,retentionExempt:true},{start:start+1000}];
 const inWindow=p.classify(sessions,expiry+1001);
 assert.equal(inWindow.active.length,1);assert.equal(inWindow.trash.length,1);
 const after=p.classify(sessions,p.plusMonths(start+1000)+p.trashWindow);
 assert.equal(after.active.length,1);assert.equal(after.discard.length,1);
});

test('exempt sessions bridge nearby visits without exempting neighboring sessions',()=>{
 const start=t('2026-01-01T00:00:00Z');
 const sessions=[{start,end:start+hour},{start:start+2*hour,end:start+3*hour,retentionExempt:true},{start:start+4*hour,end:start+5*hour}];
 const result=p.classify(sessions,p.plusMonths(start+5*hour)+1);
 assert.equal(result.active.length,1);assert.equal(result.active[0].sessions.length,1);
 assert.equal(result.trash.length,1);assert.equal(result.trash[0].sessions.length,2);
 assert.equal(result.trash[0].expiresAt,p.plusMonths(start+5*hour));
});

test('created-item retention uses original creation and seven-day import window',()=>{
 const created=t('2026-01-31T10:00:00Z'), expiry=t('2026-04-30T10:00:00Z');
 for(const [field,item] of [['at',{at:created}],['createdAt',{createdAt:created,videos:[{videoId:'Video000001'}]}]]){
   assert.equal(p.classifyCreated(item,field,expiry-1).state,'active');
   const trash=p.classifyCreated(item,field,expiry);assert.equal(trash.state,'trash');assert.equal(trash.expiresAt,expiry);
   assert.equal(p.classifyCreated(item,field,expiry+p.trashWindow).state,'discard');
   assert.equal(p.classifyCreated({...item,retentionExempt:true},field,expiry+p.trashWindow).state,'active');
 }
});
test('missing, malformed or future creation times never cause destructive expiry',()=>{
 const now=t('2026-07-01T00:00:00Z');
 for(const at of [null,0,'2025-01-01',NaN,Infinity,now+1]) assert.equal(p.classifyCreated({at},'at',now).reason,'unknown-creation');
});
