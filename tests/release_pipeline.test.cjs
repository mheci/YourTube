'use strict';
// Exercise the actual publisher against a disposable Git checkout and a local gh
// stand-in. Never create a remote tag/release as part of a CI test.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync, spawnSync} = require('node:child_process');
const {releaseVersion} = require('../scripts/release-version.cjs');
const project = path.resolve(__dirname, '..');
const assets = ['yourtube.user.js', 'yourtube.meta.js'];

function fixture(t, version = '1.2.3') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yourtube-release-'));
  t.after(() => fs.rmSync(dir, {recursive: true, force: true}));
  const file = name => path.join(dir, name);
  fs.writeFileSync(file('package.json'), JSON.stringify({version}));
  for (const asset of assets) fs.writeFileSync(file(asset), `// ==UserScript==\r\n// @version      ${version}\r\n// ==/UserScript==\r\n`);
  return {dir, file};
}

test('full RC version is preserved, never accepted as stable, and checked in both headers', t => {
  const {dir, file} = fixture(t, '1.12.5-rc.3');
  assert.equal(releaseVersion(dir), '1.12.5-rc.3');
  for (const tag of ['v1.12.5', 'v1.12.5-rc.3']) assert.throws(() => releaseVersion(dir, tag), /Stable tag/);
  for (const asset of assets) {
    const orig = fs.readFileSync(file(asset), 'utf8');
    fs.writeFileSync(file(asset), orig.replace('-rc.3', ''));
    assert.throws(() => releaseVersion(dir), /expected @version/);
    fs.writeFileSync(file(asset), orig);
  }
});

function publisher(t) {
  const {dir, file} = fixture(t);
  fs.mkdirSync(file('scripts')); fs.mkdirSync(file('bin')); fs.mkdirSync(file('remote'));
  for (const script of ['publish-stable.sh', 'release-version.cjs']) {
    fs.copyFileSync(path.join(project, 'scripts', script), file('scripts/' + script));
  }
  const git = (...a) => execFileSync('git', a, {cwd: dir, encoding: 'utf8'}).trim();
  git('init', '-q'); git('add', 'package.json', ...assets);
  git('-c', 'user.name=CI', '-c', 'user.email=ci@invalid.test', 'commit', '-qm', 'fixture');
  fs.writeFileSync(file('bin/gh'), `#!/usr/bin/env node
const fs=require('node:fs'), p=require('node:path');
const a=process.argv.slice(2), f=p.join(process.env.FAKE,'state.json'), state=JSON.parse(fs.readFileSync(f));
const log=op=>fs.appendFileSync(p.join(process.env.FAKE,'calls'),op+'\\n');
const save=()=>fs.writeFileSync(f,JSON.stringify(state));
const files=['yourtube.user.js','yourtube.meta.js'];
const expect=v=>{if(!v)process.exit(92)};
if(a[0]==='api'&&a.some(s=>s.includes('/commits/'))){log('tag');console.log(state.sha);}
else if(a[0]==='api'&&a.includes('--paginate')){log('list');if(state.failList)process.exit(1);if(state.mode!=='absent')console.log(['v1.2.3',state.mode==='draft',state.mode==='prerelease'].join('\\t'));}
else if(a[0]==='release'){
 const op=a[1];log(op);
 if(op==='create'){expect(state.mode==='absent'&&a.includes('--draft')&&a.includes('--verify-tag'));state.mode='draft';save();}
 else if(op==='view'){for(const n of files)if(fs.existsSync(p.join(process.env.FAKE,n)))console.log(n);}
 else if(op==='upload'){expect(state.mode==='draft'&&!a.includes('--clobber'));for(const n of files.filter(n=>a.includes(n))){expect(!fs.existsSync(p.join(process.env.FAKE,n)));fs.copyFileSync(n,p.join(process.env.FAKE,n));if(state.failUpload)process.exit(3);}}
 else if(op==='download'){const dest=a[a.indexOf('--dir')+1];for(const n of files)if(fs.existsSync(p.join(process.env.FAKE,n)))fs.copyFileSync(p.join(process.env.FAKE,n),p.join(dest,n));if(state.corruptDownload)fs.appendFileSync(p.join(dest,files[0]),'wrong bytes');}
 else if(op==='edit'){expect(state.mode==='draft'&&a.includes('--draft=false'));state.mode='public';save();}
 else process.exit(91);
}else process.exit(90);
`, {mode: 0o755});
  const statePath = file('remote/state.json');
  const read = () => JSON.parse(fs.readFileSync(statePath));
  fs.writeFileSync(statePath, JSON.stringify({mode: 'absent', sha: git('rev-parse', 'HEAD')}));
  return {
    dir, file, read, set: obj => fs.writeFileSync(statePath, JSON.stringify({...read(), ...obj})),
    run(tag = 'v1.2.3') {
      fs.writeFileSync(file('remote/calls'), '');
      const res = spawnSync('bash', ['scripts/publish-stable.sh'], {cwd: dir, encoding: 'utf8', env: {
        PATH: file('bin') + path.delimiter + process.env.PATH, HOME: dir, FAKE: file('remote'),
        GITHUB_REF_NAME: tag, GITHUB_REPOSITORY: 'test/fixture', GH_TOKEN: '',
      }});
      const calls = fs.readFileSync(file('remote/calls'), 'utf8').trim().split('\n').filter(Boolean);
      return {ok: res.status === 0, calls, message: res.stderr + res.stdout};
    },
  };
}

test('publish both verified draft assets; a rerun reads only, and never repairs a public asset in place', t => {
  const f = publisher(t);
  const first = f.run(); assert.equal(first.ok, true, first.message);
  assert.deepEqual(first.calls, ['tag', 'list', 'create', 'view', 'upload', 'download', 'tag', 'edit', 'download']);
  assert.equal(f.read().mode, 'public');
  const rerun = f.run(); assert.equal(rerun.ok, true, rerun.message);
  assert.deepEqual(rerun.calls, ['tag', 'list', 'download']);
  fs.unlinkSync(f.file('remote/yourtube.meta.js'));
  const missing = f.run(); assert.equal(missing.ok, false);
  assert.deepEqual(missing.calls, ['tag', 'list', 'download']);
});

test('interrupted upload and wrong downloaded bytes leave a draft; retry finishes it', t => {
  const f = publisher(t); f.set({failUpload: true}); const interrupted = f.run();
  assert.equal(interrupted.ok, false); assert.equal(f.read().mode, 'draft');
  f.set({failUpload: false, corruptDownload: true}); const corrupt = f.run();
  assert.equal(corrupt.ok, false); assert.equal(f.read().mode, 'draft'); assert.ok(!corrupt.calls.includes('edit'));
  f.set({corruptDownload: false}); const retried = f.run();
  assert.equal(retried.ok, true, retried.message); assert.ok(!retried.calls.includes('create'));
});

test('wrong version, moved tag, failed listing or existing prerelease cannot publish', t => {
  const f = publisher(t); const sha = f.read().sha;
  assert.deepEqual(f.run('v1.2.4').calls, []); assert.equal(f.run('v1.2.3-rc.1').ok, false);
  f.set({sha: 'moved'}); const moved = f.run(); assert.equal(moved.ok, false); assert.deepEqual(moved.calls, ['tag']);
  f.set({sha, failList: true}); const denied = f.run(); assert.equal(denied.ok, false); assert.deepEqual(denied.calls, ['tag','list']);
  f.set({failList: false, mode: 'prerelease'}); const pre = f.run(); assert.equal(pre.ok, false); assert.deepEqual(pre.calls, ['tag','list']);
});
