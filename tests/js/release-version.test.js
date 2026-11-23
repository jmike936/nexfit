const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const index = fs.readFileSync('index.html', 'utf8');
const release = JSON.parse(fs.readFileSync('version.json', 'utf8'));
const serviceWorker = fs.readFileSync('sw.js', 'utf8');

test('the app update checker and version.json use the same release identity', () => {
  const match = index.match(/const APP_VERSION='([^']+)',APP_BUILD\s*=\s*'([^']+)'/);
  assert.ok(match, 'APP_VERSION and APP_BUILD constants must exist');
  assert.equal(match[1], release.version, 'APP_VERSION must match version.json');
  assert.equal(match[2], release.build, 'APP_BUILD must match version.json');
});

test('the static profile version label matches the current release', () => {
  const match = index.match(/id="aboutAppVersion">([^<]+)</);
  assert.ok(match, 'About app version label must exist');
  assert.equal(match[1], release.version + ' · build ' + release.build);
});

test('all versioned application scripts use the current release build', () => {
  const scriptVersions = [...index.matchAll(/(?:src|href)="[^"]+\?v=([0-9.]+)"/g)].map(match => match[1]);
  assert.ok(scriptVersions.length > 0, 'versioned application assets must exist');
  assert.ok(scriptVersions.every(build => build === release.build), 'HTML asset query versions must match version.json');
  const workerVersions = [...serviceWorker.matchAll(/\?v=([0-9.]+)/g)].map(match => match[1]);
  assert.ok(workerVersions.length > 0, 'service worker must version application assets');
  assert.ok(workerVersions.every(build => build === release.build), 'service worker asset versions must match version.json');
});

test('service worker cache name changes for this release', () => {
  const match = serviceWorker.match(/const CACHE_NAME = '([^']+)'/);
  assert.ok(match, 'service worker cache name must exist');
  assert.match(match[1], /-v\d+$/, 'cache name must have an explicit revision');
});
