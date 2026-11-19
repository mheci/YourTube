const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// Run the registered report callback with independently controlled storage reads.
const engine = fs.readFileSync('src/80-engine.js', 'utf8');
const start = engine.lastIndexOf('xa.register(', engine.indexOf('id: "weekly-report"'));
const end = engine.indexOf('\n  });', start) + '\n  });'.length;
function fixture(load, readHistory) {
  const cleanup = [], notifications = [], state = {lastShown: 0};
  const store = {load: () => load(state), get: () => state, update: fn => fn(state)};
  let run;
  vm.runInNewContext(engine.slice(start, end), {
    S: {weeklyReportOn: true}, Yt: {'weekly-report': cleanup},
    YourTubeEngine: {createStore: () => store}, w: readHistory,
    WatchAnalytics: {summarize: () => ({videos: 1, seconds: 1, channels: new Map()})},
    pe: msg => notifications.push(msg), xa: {register: f => f.apply({addTimeout: fn => {run = fn;}})},
  });
  return {run, notifications, state, disable: () => cleanup.forEach(fn => fn())};
}
test('weekly cooldown comes from persisted state, not the initial default', async () => {
  let reads = 0;
  const f = fixture(async state => {await Promise.resolve(); state.lastShown = Date.now();}, () => {reads++; return [];});
  await f.run();
  assert.equal(reads, 0);
  assert.equal(f.notifications.length, 0);
});
test('turning weekly report off during a read cannot consume the next report', async () => {
  let resolve, started;
  const reading = new Promise(r => {started = r;});
  const f = fixture(async () => {}, () => {started(); return new Promise(r => {resolve = r;});});
  const done = f.run(); await reading; f.disable(); resolve([]); await done;
  assert.equal(f.notifications.length, 0);
  assert.equal(f.state.lastShown, 0);
});
