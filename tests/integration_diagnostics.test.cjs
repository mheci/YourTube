const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function make(responses){
 const notifications=[], events=[], calls=[], storage=new Map(); let version='one';
 const env={Date,Promise,String,Number,Map,Array,setTimeout:(f)=>{queueMicrotask(f);return 1},
   g:{emit:(...args)=>events.push(args)}, pe:(...args)=>notifications.push(args),
   e:{ytcfg:{get:()=>version}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
   YourTubeEngine:{fetchJson:async url=>{calls.push(url);return responses.shift()}}};
 const api=vm.runInNewContext(fs.readFileSync('src/39-integration-diagnostics.js','utf8')+'\nIntegrationDiagnostics;',env);
 return {api,calls,notifications,events,setVersion:v=>{version=v}};
}
test('bounded retry recovers from transient server errors',async()=>{
 const x=make([{ok:false,status:503},{ok:false,status:0},{ok:true,status:200,json:{}}]);
 const result=await x.api.request('Service','https://example.test',()=>true);
 assert.equal(result.ok,true);assert.equal(x.calls.length,3);assert.equal(x.api.status('Service').state,'ok');assert.equal(x.notifications.length,0);
});
test('rate limit and privacy blocks do not retry; cancellation stops retries',async()=>{
 const rate=make([{ok:false,status:429}]);await rate.api.request('Service','u',()=>true);assert.equal(rate.calls.length,1);assert.equal(rate.notifications.length,1);
 const privacy=make([{ok:false,status:0,blocked:'SAFE_MODE_BLOCKED'}]);await privacy.api.request('Service','u',()=>true);assert.equal(privacy.calls.length,1);assert.equal(privacy.api.status('Service').state,'unavailable');
 const cancelled=make([{ok:false,status:503}]);let checks=0;await cancelled.api.request('Service','u',()=>++checks<3);assert.equal(cancelled.calls.length,1);
});
test('logs observed client version changes without claiming API breakage',()=>{
 const x=make([]);x.api.checkClient();x.api.checkClient();x.setVersion('two');x.api.checkClient();
 const items=x.api.entries();assert.equal(items.length,2);assert.equal(items[1].state,'changed');assert.equal(items[1].detail,'one → two');
});
test('aborted manager request settles and allows the integration to retry', async () => {
 const engine = fs.readFileSync('src/80-engine.js', 'utf8').split('  const YourTubeDiscovery =')[0];
 const diagnostics = fs.readFileSync('src/39-integration-diagnostics.js', 'utf8');
 let attempts = 0;
 const api = vm.runInNewContext(engine + diagnostics + '\nIntegrationDiagnostics;', {
   S: {safeMode: false}, YourTubeResources: {Logger: {namespace: () => ({})}},
   g: {emit() {}}, setTimeout: queueMicrotask,
   GM_xmlhttpRequest(req) {
     if (++attempts === 1) queueMicrotask(() => req.onabort());
     else queueMicrotask(() => req.onload({status: 200, responseText: '{"votes":1}'}));
   },
 });
 const result = await api.request('Votes', 'https://example.test');
 assert.equal(attempts, 2);
 assert.equal(result.json.votes, 1);
 assert.equal(api.status('Votes').state, 'ok');
});
