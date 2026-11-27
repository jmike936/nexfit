const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const library = fs.readFileSync('exercise-library.js', 'utf8');

test('video player clears the previous source when exercise details close', () => {
  assert.match(library, /video\.pause\(\);video\.removeAttribute\('src'\);video\.load\(\);video\.hidden=true/);
});

test('available video suppresses the empty-image fallback while image-only exercises keep it', () => {
  assert.match(library, /start\.hidden&&end\.hidden&&!videoUrl/);
});
