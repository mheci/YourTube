const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const policy=vm.runInNewContext(fs.readFileSync('src/38-discover-policy.js','utf8')+'\nDiscoverPolicy;');
const now=Date.now(), videos=[
 {videoId:'Video000001',channel:'Known'},
 {videoId:'Video000002',channel:'Fresh'},
 {videoId:'Video000003',channel:'fresh'},
 {videoId:'Video000004',channel:'Other'},
 {videoId:'Video000004',channel:'Other'},
 {videoId:'invalid',channel:'Other'},
];
const options=()=>({watched:new Set(['Video000001']),channels:new Set(['fresh']),shown:{Video000004:now-86400000},session:new Set(),batch:new Set(),now,days:30,excludeWatched:true,excludeShown:true,excludeChannels:true});
test('novelty signals are independent and reject duplicates and invalid IDs',()=>{
 const o=options();assert.deepEqual(Array.from(policy.filter(videos,o),v=>v.videoId),[]);
 const p=options();p.excludeWatched=false;p.excludeChannels=false;p.excludeShown=false;
 assert.deepEqual(Array.from(policy.filter(videos,p),v=>v.videoId),['Video000001','Video000002','Video000003','Video000004']);
});
test('shown retention expires by configured window; session only ignores old stored marks',()=>{
 const p=options();p.excludeWatched=false;p.excludeChannels=false;p.days=1;
 assert.deepEqual(Array.from(policy.filter(videos,p),v=>v.videoId),['Video000001','Video000002','Video000003','Video000004']);
 const q=options();q.excludeWatched=false;q.excludeChannels=false;q.days=0;q.session.add('Video000004');
 assert.deepEqual(Array.from(policy.filter(videos,q),v=>v.videoId),['Video000001','Video000002','Video000003']);
});
