// Run after vite build --manifest. Includes static dependencies, excludes lazy panels.
import { readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
const manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf8'));
const result = {};
for (const route of ['index.html', 'src/pages/StudyLibrary.tsx', 'src/pages/LabDetail.tsx']) {
  const seen = new Set();
  function walk(key) {
    if (seen.has(key)) return;
    seen.add(key);
    for (const dependency of manifest[key].imports || []) walk(dependency);
  }
  walk(route);
  const files = [...seen].map(key => readFileSync(`dist/${manifest[key].file}`));
  result[route] = { js_bytes: files.reduce((sum, file) => sum + file.length, 0), gzip_bytes: files.reduce((sum, file) => sum + gzipSync(file).length, 0) };
}
console.log(JSON.stringify(result, null, 2));
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(result, null, 2));
