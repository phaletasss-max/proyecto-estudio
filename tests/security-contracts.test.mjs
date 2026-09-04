import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

test('los fixtures públicos no contienen verificadores ni soluciones', () => {
  const fixtures = read('src/data/mockLabs.ts');
  for (const forbidden of ['flag_hash', 'writeup_markdown', 'answerHash', 'HTB{', 'SB{']) {
    assert.equal(fixtures.includes(forbidden), false, `fixture público contiene ${forbidden}`);
  }
});

test('las consultas públicas usan listas de columnas explícitas', () => {
  const sources = ['src/hooks/useLabs.ts', 'src/hooks/useLabDetail.ts', 'src/pages/Profile.tsx', 'src/context/AuthContext.tsx'];
  for (const source of sources) assert.doesNotMatch(read(source), /\.select\(\s*['"]\*['"]\s*\)/, source);
});

test('la compatibilidad legacy descarta URLs públicas de archivos', () => {
  const mapper = read('src/lib/labs.ts');
  assert.match(mapper, /LEGACY_PUBLIC_LAB_COLUMNS/);
  assert.match(mapper, /\^https\?:\\\/\\\//);
});

test('las rutas críticas y la pantalla 404 existen', () => {
  const app = read('src/App.tsx');
  for (const route of ['/dashboard', '/setup/wsl', '/paths/:slug', '/admin/labs/new', 'path="*"']) assert.ok(app.includes(route), route);
  assert.equal(app.includes('FloatingTerminal'), false);
});

test('la migración protege secretos y hace idempotente el solve', () => {
  const migration = read('supabase/migrations/20260904_guided_learning_mvp.sql');
  assert.match(migration, /revoke all on public\.lab_step_secrets/);
  assert.match(migration, /on conflict \(user_id, lab_id\) do nothing/);
  assert.match(migration, /Demasiados intentos/);
  assert.match(migration, /Resuelve el reto para desbloquear el writeup|submit_flag/);
  assert.match(migration, /hint_count integer not null default 0/);
  assert.doesNotMatch(migration, /current_access_status/);
  assert.doesNotMatch(migration, /grant select on public\.lab_step_secrets/);
});

test('no quedan descargas de retos dentro de public', () => {
  const downloads = join(root, 'public', 'downloads');
  const files = existsSync(downloads) ? readdirSync(downloads, { recursive: true }).filter((entry) => !String(entry).endsWith('ctf_files')) : [];
  assert.deepEqual(files, []);
});
