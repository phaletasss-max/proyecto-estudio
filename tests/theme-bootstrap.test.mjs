import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/theme-init.js', import.meta.url), 'utf8');
test('el tema y la fuente funcionan sin scripts inline bloqueados por CSP', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const policy = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')).headers[0].headers.find(header => header.key === 'Content-Security-Policy').value;
  assert.match(policy, /script-src 'self';/);
  assert.doesNotMatch(html, /\sonload=|<script\s*>/i);
  assert.match(html, /<script src="\/theme-init.js"><\/script>/);
  let selected, onLoad;
  class Link {}
  runInNewContext(source, {
    localStorage: { getItem: () => 'light' },
    HTMLLinkElement: Link,
    document: { documentElement: { classList: { add: value => { selected = value; } } }, addEventListener: (_, callback) => { onLoad = callback; } },
  });
  assert.equal(selected, 'light');
  const font = Object.assign(new Link(), { id: 'reading-font', media: 'print' });
  onLoad({ target: font });
  assert.equal(font.media, 'all');
});
test('el arranque conserva un tema cuando el navegador deniega almacenamiento', () => {
  let selected;
  runInNewContext(source, {
    localStorage: { getItem: () => { throw new Error('Storage denied'); } },
    document: { documentElement: { classList: { add: value => { selected = value; } } }, addEventListener() {} },
  });
  assert.equal(selected, 'dark');
});
