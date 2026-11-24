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
  assert.match(workout, /if\(!navigator\.onLine\)\{showGuidanceImageFallback\(img\);return\}/);
  assert.match(workout, /Demonstração visual indisponível offline/);
  assert.match(workout, /parsed\.protocol==='https:'/);
});
