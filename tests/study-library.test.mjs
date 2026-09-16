import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/study.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { addStudyDays, completedFocusMinutes, emptyStudyProgress, focusRemainingSeconds, formatFocusTime, studyCompletion, studyMilestones, studyProgressError, studyWriteupTemplate, suggestedStudyAction, prioritizeStudy, isReviewDue, exportStudyWriteup, restoreStudyDraft, summarizeStudyActivity, studyPlanReason, suggestedSessionMinutes } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

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
test('explica por qué cada práctica está en el plan y propone un bloque realista', () => {
  const resource = { readiness: 'guided', writeup_path: null };
  assert.equal(studyPlanReason(resource, { status: 'review', review_on: '2026-09-16' }, '2026-09-16'), 'Repaso vencido');
  assert.equal(studyPlanReason(resource, { status: 'documenting', review_on: null }, '2026-09-16'), 'Writeup por terminar');
  assert.equal(studyPlanReason(resource, undefined, '2026-09-16'), 'Laboratorio guiado');
  assert.equal(suggestedSessionMinutes({ status: 'practicing' }), 45);
  assert.equal(suggestedSessionMinutes(undefined), 25);
});
test('aprender requiere reflexión propia y nunca acredita solves', () => {
  const progress = { ...emptyStudyProgress('test'), status: 'learned' };
  assert.match(studyProgressError(progress), /80 caracteres/);
  progress.personal_writeup = 'La observación está ligada a una prueba reproducible y permite explicar el resultado obtenido en este laboratorio.';
  assert.equal(studyProgressError(progress), null);
  assert.match(exportStudyWriteup('Reto', progress), /No acredita un solve ni puntos/);
});
test('convierte un material pendiente en una sesión concreta y medible', () => {
  const resource = { category: 'Forensics', lab_slug: null, archive_path: 'reto.zip', archive_parts: [] };
  const progress = emptyStudyProgress('test');
  assert.match(suggestedStudyAction(resource, progress), /Inventariar los archivos/);
  assert.equal(studyCompletion(progress), 0);
  progress.status = 'practicing';
  progress.next_action = suggestedStudyAction(resource, progress);
  progress.personal_writeup = studyWriteupTemplate('Reto');
  progress.review_on = addStudyDays('2026-09-16', 7);
  assert.equal(progress.review_on, '2026-09-23');
  assert.equal(studyCompletion(progress), 75);
  progress.personal_writeup += '\n\nLa evidencia confirma la hipótesis porque el procedimiento fue repetido con los mismos datos y produjo el mismo resultado. También anoté sus límites y el paso que debo verificar de nuevo.';
  progress.status = 'review';
  assert.equal(studyCompletion(progress), 100);
  assert.equal(studyMilestones(progress).every(item => item.complete), true);
});
test('mide una sesión de enfoque sin registrar tiempos negativos o excesivos', () => {
  const started = Date.UTC(2026, 8, 16, 12, 0, 0);
  assert.equal(focusRemainingSeconds(started, 25, started + 90_000), 1410);
  assert.equal(focusRemainingSeconds(started, 25, started + 30 * 60_000), 0);
  assert.equal(completedFocusMinutes(started, 25, started + 61_000), 2);
  assert.equal(completedFocusMinutes(started, 25, started + 60 * 60_000), 25);
  assert.equal(formatFocusTime(1410), '23:30');
});
test('resume el ritmo semanal, la racha y los últimos siete días', () => {
  const session = (id, day, minutes) => ({ id, resource_id: 'lab', started_at: `${day}T15:00:00`, ended_at: `${day}T15:25:00`, duration_minutes: minutes, outcome: `Resultado de ${id}`, next_action: '', created_at: `${day}T15:25:00` });
  const sessions = [session('one', '2026-09-16', 45), session('two', '2026-09-15', 25), session('three', '2026-09-14', 60), session('old', '2026-09-10', 90)];
  const summary = summarizeStudyActivity(sessions, new Date(2026, 8, 16, 20), 150);
  assert.equal(summary.minutesThisWeek, 130);
  assert.equal(summary.sessionsThisWeek, 3);
  assert.equal(summary.activeDaysThisWeek, 3);
  assert.equal(summary.currentStreak, 3);
  assert.equal(summary.weeklyGoalPercent, 87);
  assert.equal(summary.recentSession.id, 'one');
  assert.equal(summary.lastSevenDays.reduce((total, day) => total + day.minutes, 0), 220);
});
test('la racha continúa desde ayer y no cuenta sesiones futuras', () => {
  const session = (id, day) => ({ id, resource_id: 'lab', started_at: `${day}T12:00:00`, ended_at: `${day}T12:25:00`, duration_minutes: 25, outcome: 'Resultado verificable', next_action: '', created_at: `${day}T12:25:00` });
  const summary = summarizeStudyActivity([session('yesterday', '2026-09-15'), session('before', '2026-09-14'), session('future', '2026-09-17')], new Date(2026, 8, 16, 20));
  assert.equal(summary.currentStreak, 2);
  assert.equal(summary.sessionsThisWeek, 2);
  assert.equal(summary.recentSession.id, 'yesterday');
});
test('la biblioteca mantiene RLS y los archivos privados', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20260914_study_library.sql', import.meta.url), 'utf8');
  assert.match(sql, /study_progress enable row level security/);
  assert.match(sql, /user_id = auth.uid\(\) and public.has_member_access\(\)/);
  assert.match(sql, /'study-library', 'study-library', false/);
  assert.match(sql, /application\/x-zip-compressed/);
  assert.doesNotMatch(sql, /update public.profiles|insert into public.solves/i);
});
test('las sesiones de estudio son privadas, inmutables y limitadas', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20260916_study_sessions.sql', import.meta.url), 'utf8');
  assert.match(sql, /study_sessions enable row level security/);
  assert.match(sql, /user_id = auth.uid\(\) and public.has_member_access\(\)/);
  assert.match(sql, /duration_minutes between 1 and 240/);
  assert.match(sql, /revoke all on public\.study_sessions from anon, authenticated/);
  assert.match(sql, /grant select, insert on public.study_sessions to authenticated/);
  assert.doesNotMatch(sql, /grant delete|grant update/i);
});
