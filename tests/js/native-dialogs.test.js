const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const index = fs.readFileSync('index.html', 'utf8');

test('goal progress and deletion use the accessible in-app dialog instead of native prompt/confirm', () => {
  assert.match(index, /id="appDialog" role="dialog" aria-modal="true"/);
  assert.match(index, /function openAppDialog\(options=\{\}\)/);
  assert.match(index, /function finishAppDialog\(value\)/);
  const update = index.match(/async function updateFitnessGoal\(id\)\{[\s\S]*?\n \}/)?.[0] || '';
  const remove = index.match(/async function deleteFitnessGoal\(id\)\{[\s\S]*?\n \}/)?.[0] || '';
  assert.match(update, /await openAppDialog/);
  assert.doesNotMatch(update, /\b(?:prompt|confirm|alert)\s*\(/);
  assert.match(remove, /await openAppDialog/);
  assert.doesNotMatch(remove, /\b(?:prompt|confirm|alert)\s*\(/);
});

test('goal validation and persistence feedback do not invoke native alerts', () => {
  const goals = index.match(/async function persistFitnessGoals\(goals,extra=\{\}\)\{[\s\S]*?\n \}/)?.[0] || '';
  const create = index.match(/async function createFitnessGoal\(event\)\{[\s\S]*?\n \}/)?.[0] || '';
  assert.match(goals, /showFeedback/);
  assert.doesNotMatch(goals, /\balert\s*\(/);
  assert.match(create, /showFeedback/);
  assert.doesNotMatch(create, /\balert\s*\(/);
});

test('custom dialog resolves safely on cancel, backdrop, Escape and Enter', () => {
  assert.match(index, /appDialogCancel.*finishAppDialog\(null\)/);
  assert.match(index, /event\.key==='Escape'&&appDialogResolve/);
  assert.match(index, /event\.key==='Enter'.*finishAppDialog/);
  assert.match(index, /event\.target===\$\('appDialog'\)/);
});

test('activity history editing and deletion use in-app dialogs instead of native prompt/confirm', () => {
  const edit = index.match(/async function editActivity\(id\)\{[\s\S]*?\n\}/)?.[0] || '';
  const remove = index.match(/async function deleteActivity\(id\)\{[\s\S]*?\n\}/)?.[0] || '';
  assert.equal((edit.match(/await openAppDialog/g) || []).length, 3);
  assert.match(edit, /inputType:'date'/);
  assert.match(edit, /multiline:true/);
  assert.doesNotMatch(edit, /\b(?:prompt|confirm|alert)\s*\(/);
  assert.match(remove, /await openAppDialog/);
  assert.doesNotMatch(remove, /\b(?:prompt|confirm|alert)\s*\(/);
});
