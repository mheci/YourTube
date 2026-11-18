// One version for package.json, both installable files, CI artifacts and release tags.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const number = '(?:0|[1-9]\\d*)';
const core = `${number}\\.${number}\\.${number}`;
const id = '[0-9A-Za-z-]+';
const versionPattern = new RegExp(`^${core}(?:-${id}(?:\\.${id})*)?(?:\\+${id}(?:\\.${id})*)?$`);
const stableTagPattern = new RegExp(`^v${core}$`);

function releaseVersion(root, tag) {
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const {version} = JSON.parse(read('package.json'));
  if (typeof version !== 'string' || !versionPattern.test(version) || version.trim() !== version) {
    throw new Error('Invalid package release version');
  }
  for (const file of ['yourtube.user.js', 'yourtube.meta.js']) {
    const header = read(file).split('// ==/UserScript==', 1)[0];
    const fields = [...header.matchAll(/^\/\/ @version[ \t]+(\S+)[ \t]*\r?$/gm)];
    if (fields.length !== 1 || fields[0][1] !== version) throw new Error(`${file}: expected @version ${version}`);
  }
  if (tag !== undefined && (!stableTagPattern.test(tag) || tag !== 'v' + version)) {
    throw new Error(`Stable tag ${tag} does not match a stable package v${version}`);
  }
  return version;
}
if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 0 && !(args.length === 2 && args[0] === '--stable-tag')) throw new Error('Usage: release-version.cjs [--stable-tag vX.Y.Z]');
    console.log(releaseVersion(path.resolve(__dirname, '..'), args[1]));
  } catch (error) {
    console.error(error.message); process.exitCode = 1;
  }
}
module.exports = {releaseVersion};
