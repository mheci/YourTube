const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const resources=vm.runInNewContext(fs.readFileSync('src/20-resources.js','utf8')+'\nYourTubeResources;', {console,setTimeout,clearTimeout,setInterval,clearInterval,performance,URL,AbortController,Date,Promise});
const StateStore=resources.StateStore;
test('failed initial read never overwrites unseen saved data; retry merges it',async()=>{
 let failing=true, writes=0, saved={old:'keep'};
 const store=new StateStore('data',{}, {flushMs:60000,storage:{get:async()=>{if(failing)throw Error('unavailable');return saved},set:async(_,v)=>{writes++;saved={...v}}}});
 await assert.rejects(store.load());
 store.update(d=>{d.new='added'});
 assert.equal(await store.flush(),false);assert.equal(writes,0);assert.equal(store._dirty,true);
 failing=false;
 assert.equal(await store.flush(),true);assert.equal(writes,1);
 assert.equal(saved.old,'keep');assert.equal(saved.new,'added');
 store.dispose();
});
test('failed writes stay dirty and can be retried',async()=>{
 let failing=true, saved=null;
 const store=new StateStore('data',{}, {flushMs:60000,storage:{get:async()=>({old:1}),set:async(_,v)=>{if(failing)throw Error('quota');saved={...v}}}});
 await store.load();store.update(d=>{d.fresh=2});
 assert.equal(await store.flush(),false);assert.equal(store._dirty,true);assert.equal(saved,null);
 failing=false;assert.equal(await store.flush(),true);assert.equal(store._dirty,false);
 assert.equal(saved.old,1);assert.equal(saved.fresh,2);store.dispose();
});
