import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/learningProgress.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { parseLearningProgress, pathProgress } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const path = { slug: 'fundamentos', modules: [
  { id: 'intro', guide: {} },
  { id: 'ctf', labSlug: 'primer-ctf' },
  { id: 'futuro', labSlug: 'pendiente', status: 'coming_soon' },
] };

test('tolera almacenamiento corrupto y descarta entradas inválidas', () => {
  for (const raw of ['{', 'null', '[]']) assert.deepEqual(parseLearningProgress(raw), { activePath: null, completedLessons: [] });
  assert.deepEqual(parseLearningProgress('{"activePath":5,"completedLessons":["a",null,"a",3]}'), { activePath: null, completedLessons: ['a'] });
});
test('una lectura completada conduce al CTF y excluye contenido futuro', () => {
  const progress = pathProgress(path, ['fundamentos/intro'], []);
  assert.equal(progress.next.id, 'ctf');
  assert.equal(progress.percent, 50);
  assert.equal(progress.available.length, 2);
});
test('un marcador local no acredita un laboratorio', () => {
  const progress = pathProgress(path, ['fundamentos/intro', 'fundamentos/ctf'], []);
  assert.equal(progress.completed, 1);
});
test('una ruta terminada no devuelve la primera lección como pendiente', () => {
  const progress = pathProgress(path, ['fundamentos/intro'], ['primer-ctf']);
  assert.equal(progress.percent, 100);
  assert.equal(progress.next, undefined);
});
test('un solve compartido cuenta sin completar lecturas de otra ruta', () => {
  const progress = pathProgress(path, ['otra/intro'], ['primer-ctf']);
  assert.equal(progress.next.id, 'intro');
  assert.equal(progress.completed, 1);
});
test('una ruta sin contenido disponible tiene progreso cero', () => {
  assert.equal(pathProgress({ slug: 'empty', modules: [] }, [], []).percent, 0);
});
