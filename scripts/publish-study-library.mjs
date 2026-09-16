/** Administrative import; secrets stay in process memory, never in Vite or artifacts.
 * Defaults to local verification. --apply requires an explicitly reviewed migration.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = resolve(root, 'ctf-import.local/library');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const safePath = value => /^[a-z0-9][a-z0-9.-]{0,180}$/.test(value);
const manifest = JSON.parse(await readFile(resolve(directory, 'manifest.json'), 'utf8'));
if (manifest.version !== 1 || !Array.isArray(manifest.resources) || !Array.isArray(manifest.objects)) throw new Error('Invalid manifest');
for (const object of manifest.objects) {
  if (!safePath(object.path)) throw new Error('Unsafe object name');
  const bytes = await readFile(resolve(directory, 'files', object.path));
  if (bytes.length !== object.bytes || hash(bytes) !== object.sha256) throw new Error(`Local checksum mismatch: ${object.path}`);
}
for (const resource of manifest.resources) {
  if (resource.archive_parts.length) {
    const combined = createHash('sha256');
    for (const part of resource.archive_parts) combined.update(await readFile(resolve(directory, 'files', part.path)));
    if (combined.digest('hex') !== resource.archive_sha256) throw new Error('Split archive does not match original');
  }
}
console.log(`Verified locally: ${manifest.resources.length} materials, ${manifest.objects.length} objects.`);
if (!process.argv.includes('--apply')) {
  console.log('No network changes. Use --apply only after reviewing and authorizing the migration.');
  process.exit(0);
}

const config = Object.fromEntries((await readFile(resolve(root, '.env.local'), 'utf8')).split(/\r?\n/).filter(line => /^[A-Z_]+=/.test(line)).map(line => {
  const separator = line.indexOf('=');
  return [line.slice(0, separator), line.slice(separator + 1).trim().replace(/^["']|["']$/g, '')];
}));
const projectUrl = new URL(config.VITE_SUPABASE_URL);
const project = projectUrl.hostname.split('.')[0];
if (projectUrl.protocol !== 'https:' || projectUrl.hostname !== `${project}.supabase.co`) throw new Error('Expected hosted Supabase project');
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) throw new Error('SUPABASE_ACCESS_TOKEN must be supplied by the administrative environment');
const management = async (path, body) => {
  const response = await fetch(`https://api.supabase.com/v1/projects/${project}/${path}`, {
    method: body ? 'POST' : 'GET', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error(`Management ${path}: HTTP ${response.status}`);
  return response.json();
};
const query = (sql, readOnly = false) => management('database/query', { query: sql, read_only: readOnly });
const before = await query("select to_regclass('public.study_resources') is not null as exists", true);
if (!before[0]?.exists) {
  await query(await readFile(resolve(root, 'supabase/migrations/20260914_study_library.sql'), 'utf8'));
  console.log('Study migration applied.');
}
const schema = await query("select (select count(*) from pg_policies where schemaname = 'public' and tablename in ('study_resources','study_progress')) as policies, (select count(*) from pg_policies where schemaname = 'storage' and policyname like 'Study files%') as storage_policies, (select count(*) from pg_class where oid in ('public.study_resources'::regclass,'public.study_progress'::regclass) and relrowsecurity) as rls_tables, (select public from storage.buckets where id = 'study-library') as public_bucket", true);
if (Number(schema[0]?.policies) !== 7 || Number(schema[0]?.storage_policies) !== 3 || Number(schema[0]?.rls_tables) !== 2 || schema[0]?.public_bucket !== false) throw new Error('Unexpected library schema or bucket policies; stop for review');

// Official Management API retrieves the existing project credential, not a new key.
const keys = await management('api-keys?reveal=true');
const credential = keys.find(key => key.name === 'service_role')?.api_key;
if (!credential) throw new Error('Existing server credential unavailable');
const client = createClient(projectUrl.origin, credential, { auth: { persistSession: false, autoRefreshToken: false } });
const bucket = client.storage.from('study-library');
const completed = [];
for (const object of manifest.objects) {
  // Never overwrite an object. Existing bytes must match before reuse.
  const existing = await bucket.download(object.path);
  if (!existing.error && existing.data) {
    if (hash(Buffer.from(await existing.data.arrayBuffer())) !== object.sha256) throw new Error(`Remote checksum mismatch: ${object.path}`);
  } else {
    const code = String(existing.error?.statusCode ?? '');
    if (!['400', '404'].includes(code)) throw new Error(`Cannot check remote object (${code})`);
    const bytes = await readFile(resolve(directory, 'files', object.path));
    const upload = await bucket.upload(object.path, bytes, { contentType: object.content_type, upsert: false });
    if (upload.error) throw new Error(`Upload failed: ${object.path} (${upload.error.statusCode})`);
    const verification = await bucket.download(object.path);
    if (verification.error || !verification.data || hash(Buffer.from(await verification.data.arrayBuffer())) !== object.sha256) throw new Error(`Uploaded bytes failed verification: ${object.path}`);
  }
  completed.push(object.path);
  console.log(`Verified remote object ${completed.length}/${manifest.objects.length}: ${object.path}`);
  await writeFile(resolve(directory, 'upload-progress.json'), JSON.stringify({ project, completed, total: manifest.objects.length }, null, 2));
}
const imported = await query(await readFile(resolve(directory, 'import.sql'), 'utf8'));
const report = { project, resources: manifest.resources.length, reference_writeups: manifest.resources.filter(item => item.writeup_path).length, verified_objects: completed.length, uploaded: true, imported: true, remote_sha256_verified: true, verified_at: new Date().toISOString(), database_result: imported };
await writeFile(resolve(directory, 'publication.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
