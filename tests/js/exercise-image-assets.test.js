const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const mirror = JSON.parse(fs.readFileSync(path.join(root, '.github/assets-mirror/manifest.json'), 'utf8'));
const custom = JSON.parse(fs.readFileSync(path.join(root, 'public/exercise-images/custom/manifest.json'), 'utf8'));

function assertWebp(relativePath) {
  assert.ok(relativePath.startsWith('public/exercise-images/'), `Unexpected asset path: ${relativePath}`);
  assert.ok(!relativePath.split(/[\\/]/).includes('..'), `Unsafe asset path: ${relativePath}`);
  const absolutePath = path.join(root, relativePath);
  assert.ok(fs.existsSync(absolutePath), `Missing exercise image: ${relativePath}`);
  const bytes = fs.readFileSync(absolutePath);
  assert.ok(bytes.length >= 12, `Image is too small: ${relativePath}`);
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', `Invalid RIFF signature: ${relativePath}`);
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', `Invalid WEBP signature: ${relativePath}`);
}

test('every pinned upstream image in the mirror manifest exists and is a valid WEBP', () => {
  assert.ok(Array.isArray(mirror.files) && mirror.files.length > 0);
  for (const item of mirror.files) assertWebp(item.path);
});

test('every custom exercise image referenced by the custom manifest exists and is a valid WEBP', () => {
  assert.ok(Array.isArray(custom.exercises) && custom.exercises.length > 0);
  for (const exercise of custom.exercises) {
    assert.ok(exercise.start, `Missing start image mapping: ${exercise.name}`);
    assert.ok(exercise.end, `Missing end image mapping: ${exercise.name}`);
    assertWebp(path.posix.join(custom.folder, exercise.start));
    assertWebp(path.posix.join(custom.folder, exercise.end));
  }
});
