const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const index = fs.readFileSync('index.html', 'utf8');
const library = fs.readFileSync('exercise-library.js', 'utf8');

test('exercise library has its own authenticated app page and navigation entry', () => {
  assert.match(index, /data-page="exerciseLibraryPage"/);
  assert.match(index, /id="exerciseLibraryPage"/);
  assert.match(index, /<script src="\.\.\/?\.\/exercise-library\.js\?v=/);
});

test('exercise library reads the canonical catalog and scopes its offline cache by account', () => {
  assert.match(library, /from\('training_exercise_catalog'\)/);
  assert.match(library, /CACHE_KEY_PREFIX\+activeUserId/);
  assert.match(library, /if\(!currentUser\?\.id\)/);
  assert.match(library, /demonstration_image_url/);
  assert.match(library, /execution_instructions/);
});

test('exercise library only renders HTTPS image URLs and supports cached offline images', () => {
  assert.match(library, /url\.protocol==='https:'/);
  assert.match(library, /caches\.open\(IMAGE_CACHE\)/);
  assert.match(library, /if\(!navigator\.onLine\)/);
});