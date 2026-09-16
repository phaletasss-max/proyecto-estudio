import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/study.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { emptyStudyProgress, studyProgressError, prioritizeStudy, isReviewDue, exportStudyWriteup, restoreStudyDraft } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('recupera un borrador local sin mezclar recursos ni aceptar datos corruptos', () => {
  const saved = emptyStudyProgress('one');
  const draft = { ...saved, personal_writeup: 'Mis notas que todavía no subí' };
  assert.equal(restoreStudyDraft(JSON.stringify(draft), saved).personal_writeup, draft.personal_writeup);
  assert.deepEqual(restoreStudyDraft('{', saved), saved);
  assert.deepEqual(restoreStudyDraft(JSON.stringify({ ...draft, resource_id: 'two' }), saved), saved);
  assert.deepEqual(restoreStudyDraft(JSON.stringify({ ...draft, status: 'hacked' }), saved), saved);
});

test('prioriza repaso vencido y práctica por encima del material nuevo', () => {
  const resources = [
    { id: 'new', title: 'A', readiness: 'guided' }, { id: 'due', title: 'Z' },
    { id: 'active', title: 'B' }, { id: 'done', title: 'C' },
  ];
  const progress = [
    { resource_id: 'due', status: 'learned', review_on: '2026-09-13' },
    { resource_id: 'active', status: 'documenting' }, { resource_id: 'done', status: 'learned' },
  ];
  assert.deepEqual(prioritizeStudy(resources, progress, '2026-09-14').map(item => item.id), ['due', 'active', 'new', 'done']);
  assert.equal(resources[0].id, 'new');
});
test('el repaso usa una fecha local inclusiva y excluye tareas sin empezar', () => {
  assert.equal(isReviewDue({ status: 'review', review_on: '2026-09-14' }, '2026-09-14'), true);
  assert.equal(isReviewDue({ status: 'review', review_on: '2026-09-15' }, '2026-09-14'), false);
  assert.equal(isReviewDue({ status: 'queued', review_on: '2026-09-13' }, '2026-09-14'), false);
});
test('aprender requiere reflexión propia y nunca acredita solves', () => {
  const progress = { ...emptyStudyProgress('test'), status: 'learned' };
  assert.match(studyProgressError(progress), /80 caracteres/);
  progress.personal_writeup = 'La observación está ligada a una prueba reproducible y permite explicar el resultado obtenido en este laboratorio.';
  assert.equal(studyProgressError(progress), null);
  assert.match(exportStudyWriteup('Reto', progress), /No acredita un solve ni puntos/);
});
test('la biblioteca mantiene RLS y los archivos privados', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20260914_study_library.sql', import.meta.url), 'utf8');
  assert.match(sql, /study_progress enable row level security/);
  assert.match(sql, /user_id = auth.uid\(\) and public.has_member_access\(\)/);
  assert.match(sql, /'study-library', 'study-library', false/);
  assert.doesNotMatch(sql, /update public.profiles|insert into public.solves/i);
});
