const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('musculacao.js', 'utf8');
const match = source.match(/function adjustLoad\(loadKey,delta\)\{[\s\S]*?\n \}/);
assert.ok(match, 'adjustLoad must exist in the workout module');

function runAdjustLoad(value, delta) {
  const state = { value, dataset: {} };
  const sessionLoads = {};
  let persisted = 0;
  const sandbox = {
    $: id => id === 'sessionLoad' ? state : id === 'previousLoadHint' ? { textContent: '' } : null,
    sessionLoads,
    persistWorkoutState: () => { persisted += 1; }
  };
  vm.runInNewContext(match[0], sandbox);
  sandbox.adjustLoad('exercise:0', delta);
  return { value: state.value, edited: state.dataset.userEdited, saved: sessionLoads['exercise:0'], persisted };
}

test('load increment increases by 2.5 kg and persists the edited value', () => {
  const result = runAdjustLoad('10', 2.5);
  assert.equal(result.value, '12.5');
  assert.equal(result.saved, '12.5');
  assert.equal(result.edited, 'true');
  assert.equal(result.persisted, 1);
});

test('load decrement does not allow a negative load', () => {
  const result = runAdjustLoad('1', -2.5);
  assert.equal(result.value, '0');
  assert.equal(result.saved, '0');
});

test('load increment starts from zero when the field is blank', () => {
  const result = runAdjustLoad('', 2.5);
  assert.equal(result.value, '2.5');
});
