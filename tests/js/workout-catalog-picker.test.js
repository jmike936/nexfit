'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('musculacao.js','utf8');
const catalog=source.slice(source.indexOf('async function loadExerciseCatalog'),source.indexOf('async function saveNewCatalogExercise'));
const add=source.slice(source.indexOf('async function addExercise'),source.indexOf('function showProgramEditor'));
const edit=source.slice(source.indexOf('async function editExercise'),source.indexOf('async function deleteExercise'));

test('workout catalog loads the same four structured taxonomy dimensions as the library',()=>{
 for(const table of ['training_exercise_catalog_groups','training_exercise_catalog_modalities','training_exercise_catalog_equipment','training_exercise_catalog_movement_patterns']) assert.ok(catalog.includes(table),table);
 assert.match(catalog,/taxonomy_groups/);
 assert.match(catalog,/taxonomy_modalities/);
 assert.match(catalog,/taxonomy_equipment/);
 assert.match(catalog,/taxonomy_patterns/);
});

test('add-exercise picker supports search and AND filters without changing canonical IDs',()=>{
 for(const id of ['searchCatalogExercise','catalogFilterGroup','catalogFilterModality','catalogFilterEquipment','catalogFilterPattern']) assert.ok(add.includes(id),id);
 assert.match(add,/catalog\.filter\(item=>/);
 assert.match(add,/catalog_exercise_id:item\.id/);
});

test('editing timed exercises preserves countdown target and stopwatch mode',()=>{
 assert.match(edit,/editorExerciseMode/);
 assert.match(edit,/exerciseMode==='countdown'/);
 assert.match(edit,/mode:exerciseMode,target_seconds:exerciseMode==='countdown'\?target:null/);
 assert.match(edit,/mode:'reps'/);
 assert.match(edit,/editorTimedSetFields/);
});

test('editing exercise identity remains stable only when the canonical exercise is unchanged',()=>{
 assert.match(edit,/sameCatalog\|\|\(!e\.catalog_exercise_id/);
 assert.match(edit,/identityUpdate/);
 assert.match(edit,/catalog_exercise_id:item\.id/);
});

test('edit-exercise picker mirrors search and taxonomy filters while preserving the current selection',()=>{
 for(const id of ['editSearchCatalogExercise','editCatalogFilterGroup','editCatalogFilterModality','editCatalogFilterEquipment','editCatalogFilterPattern','editCatalogPickerResults']) assert.ok(edit.includes(id),id);
 assert.match(edit,/selectedCatalogItem=catalog\.find/);
 assert.match(edit,/exerciseCatalogOptions\(catalog,e\.catalog_exercise_id\)/);
 assert.match(edit,/editPickerSelect\.value=String\(item\.id\)/);
 assert.match(edit,/data-edit-catalog-pick/);
});
