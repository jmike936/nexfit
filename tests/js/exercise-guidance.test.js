const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const workout = fs.readFileSync('musculacao.js', 'utf8');

test('workout execution keeps exercise images out of the default session markup', () => {
  assert.match(workout, /data-guidance-src=/);
  assert.match(workout, /Ver execução/);
  assert.match(workout, /id="exerciseGuidanceModal"/);
  assert.doesNotMatch(workout, /class="execution-media" src="\'+esc\(e\.media_url\)/);
});

test('exercise guidance loads only after an explicit user action', () => {
  assert.match(workout, /guidanceButton\.onclick=async\(\)=>/);
  assert.match(workout, /querySelectorAll\('\.execution-media'\)\]\.map\(loadGuidanceImage\)/);
});

test('exercise guidance reuses cached images and provides an offline fallback', () => {
  assert.match(workout, /nexfit-exercise-library-images-v1/);
  assert.match(workout, /nexfit-exercise-library:v1:/);
  assert.match(workout, /entry\.id\)===String\(e\.catalog_exercise_id\)/);
  assert.match(workout, /if\(!navigator\.onLine\)\{showGuidanceImageFallback\(img\);return\}/);
  assert.match(workout, /Demonstração visual indisponível offline/);
  assert.match(workout, /parsed\.protocol==='https:'/);
});

test('exercise guidance modal is replaced between exercises and starts at the top', () => {
  assert.match(workout, /querySelectorAll\('body > #exerciseGuidanceModal'\)\.forEach\(previousModal=>previousModal\.remove\(\)\)/);
  assert.match(workout, /guidanceModal\.scrollTop=0/);
  assert.match(workout, /dialog\.scrollTop=0/);
});

test('exercise guidance keeps both demonstration images side by side after moving the modal to body', () => {
  const index = fs.readFileSync('index.html', 'utf8');
  assert.match(index, /\.execution-guidance-modal \.execution-media-pair\s*\{[^}]*display:grid!important;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important/s);
});

test('exercise muscle map displays both front and back views together without toggle buttons', () => {
  assert.match(workout, /viewBox="0 0 354 224"/);
  assert.match(workout, /vistas frontal e posterior/);
  assert.doesNotMatch(workout, /data-muscle-view=/);
  assert.doesNotMatch(workout, /muscle-map-view-toggle/);
  const index = fs.readFileSync('index.html', 'utf8');
  assert.match(index, /\.execution-guidance-modal \.muscle-map-svg\{width:100%;max-width:420px;height:auto;max-height:none;aspect-ratio:354 \/ 224/);
  assert.doesNotMatch(index, /\.execution-guidance-modal \.muscle-map-view-toggle/);
});

test('exercise muscle map keeps its visual styles after the modal is moved to body', () => {
  const index = fs.readFileSync('index.html', 'utf8');
  assert.match(index, /\.execution-guidance-modal \.muscle-map-svg \.muscle-region\.primary/);
  assert.match(index, /\.execution-guidance-modal \.muscle-map-svg \.body-base/);
  assert.match(index, /\.execution-guidance-modal \.execution-muscle-summary/);
});

test('exercise muscle map remains visible when catalog muscle labels are not mapped', () => {
  const start = workout.indexOf('function renderExecutionMuscleMap');
  const end = workout.indexOf('function renderSessionStep()', start);
  const renderer = workout.slice(start, end);
  assert.match(renderer, /replace\(\/\[\\u0300-\\u036f\]\/g/);
  assert.match(renderer, /dorsai\|dorsal\|latissim/);
  assert.doesNotMatch(renderer, /if\(!p\.size&&!s\.size\)return ''/);
  assert.match(renderer, /const mappingNotice=/);
  assert.match(renderer, /class="muscle-map-svg"/);
});
