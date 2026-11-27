const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const index = fs.readFileSync('index.html', 'utf8');
const library = fs.readFileSync('exercise-library.js', 'utf8');

test('exercise library exposes a purpose filter and queries only approved catalog-purpose links', () => {
  assert.match(index, /id="exerciseLibraryPurpose"/);
  assert.match(library, /from\('training_exercise_catalog_purposes'\)/);
  assert.match(library, /eq\('review_status','approved'\)/);
  assert.match(library, /taxonomy_purposes/);
  assert.match(library, /exerciseLibraryPurpose/);
});

test('purpose filter composes with existing filters and appears in exercise details', () => {
  assert.match(library, /purposes\.includes\(purpose\)/);
  assert.match(library, /Finalidade: '\+purposeNames\.join\(', '\)/);
  assert.match(library, /renderFilter\('exerciseLibraryPurpose'/);
});

test('purpose-aware cache uses a new namespace to avoid stale taxonomy snapshots', () => {
  assert.match(library, /nexfit-exercise-library:v2:/);
});
