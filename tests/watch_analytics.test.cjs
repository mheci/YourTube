const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const src=fs.readFileSync('src/36-watch-analytics.js','utf8');
const {summarize}=vm.runInNewContext(src+'\nWatchAnalytics;');
const day=86400000, base=Date.parse('2026-10-01T12:00:00Z');
const rows=[{videoId:'LabVideo001',channel:'Field',totalWatchTime:180,sessions:[
  {start:base-day,end:base-day+1000,played:30},
  {start:base,end:base+1000,played:40},
  {start:base+31*60000,end:base+31*60000+1000,played:50},
  {start:base+3*3600000,end:base+3*3600000+1000,played:60},
]}];
test('window uses dated sessions instead of a lifetime total',()=>{
  const r=summarize(rows,base,60);
  assert.equal(r.seconds,150);assert.equal(r.videos,1);assert.equal(r.groups,2);
  assert.equal(r.days.get('2026-10-01'),150);assert.equal(r.channels.get('Field'),150);
});
test('gap setting regroups without modifying source sessions',()=>{
  assert.equal(summarize(rows,base,15).groups,3);
  assert.equal(summarize(rows,base,240).groups,1);
  assert.equal(rows[0].sessions.length,4);
});
test('undated or truncated legacy watch time is not attributed to a day',()=>{
  const r=summarize([{videoId:'Legacy00001',totalWatchTime:120,sessions:[{start:base,played:20},{start:0,played:50}]}],base,60);
  assert.equal(r.seconds,20);assert.equal(r.unallocatedSeconds,100);
  assert.equal(r.days.get('2026-10-01'),20);
});
test('invalid timestamps are ignored without breaking reports',()=>{
  const r=summarize([{videoId:'BadDates001',totalWatchTime:10,sessions:[{start:1e19,played:10}]}],0);
  assert.equal(r.videos,0);assert.equal(r.unallocatedSeconds,10);
});
