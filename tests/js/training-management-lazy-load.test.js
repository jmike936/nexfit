'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('musculacao.js','utf8');
const home=source.slice(source.indexOf('async function home(){'),source.indexOf('function populateProgramSelectors()'));

test('training management query is deferred until its collapsed panel is opened',()=>{
 assert.match(home,/id="trainingManagementDetails"/);
 assert.match(home,/trainingDetails\?\.addEventListener\('toggle'/);
 assert.match(home,/renderTrainingManagement\(\)\.finally/);
 assert.doesNotMatch(home,/renderProgramManagement\(\);await renderTrainingManagement\(\)/);
});

test('professional access and notifications are fetched only after opening their panel',()=>{
 assert.match(home,/id="professionalAccessDetails"/);
 assert.match(home,/professionalDetails\?\.addEventListener\('toggle'/);
 assert.match(home,/db\.from\('app_notifications'\)\.select\('title,body,created_at'\)/);
 assert.match(home,/db\.from\('athlete_professional_access'\)\.select\('id,professional_id,athlete_id,status,can_view_history,can_manage_programs'\)/);
 assert.match(home,/Promise\.all\(\[\s*db\.from\('app_notifications'/);
});

test('lazy panel loaders retain account checks and prevent duplicate concurrent loads',()=>{
 assert.match(home,/if\(!isSameAccount\(\)\)return;/);
 assert.match(home,/trainingManagementLoaded\|\|trainingManagementLoading/);
 assert.match(home,/professionalPanelLoaded\|\|professionalPanelLoading/);
});
