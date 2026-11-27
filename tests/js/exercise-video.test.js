const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const index = fs.readFileSync('index.html', 'utf8');
const library = fs.readFileSync('exercise-library.js', 'utf8');
const worker = fs.readFileSync('sw.js', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20261127174607_exercise_catalog_demonstration_video.sql', 'utf8');

test('exercise catalog stores an optional direct demonstration video URL', () => {
  assert.match(migration, /add column if not exists demonstration_video_url text/);
  assert.ok(library.includes('demonstration_video_url'));
});

test('exercise detail loads MP4 and WebM videos only after an explicit user action', () => {
  assert.match(index, /id="exerciseLibraryVideoLoad"/);
  assert.match(index, /preload="none"/);
  assert.match(index, /playsinline/);
  assert.ok(library.includes('const safeVideoUrl='));
  assert.ok(library.includes('mp4|webm'));
  assert.ok(library.includes("exerciseLibraryVideoLoad')?.addEventListener('click'"));
  assert.ok(library.includes('video.src=url;video.hidden=false;video.load()'));
});

test('video files are not added to the service worker app-shell cache', () => {
  assert.ok(worker.includes('webp'));
  assert.ok(!worker.includes('mp4|webm'));
});
