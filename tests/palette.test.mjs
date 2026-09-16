import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
const luminance = hex => {
  const rgb = hex.match(/[a-f0-9]{2}/gi).map(value => parseInt(value, 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
};
const contrast = (a, b) => {
  const first = luminance(a), second = luminance(b);
  return (Math.max(first, second) + .05) / (Math.min(first, second) + .05);
};
for (const selector of [':root', ':root.light']) {
  const body = css.slice(css.indexOf(`${selector} {`)).split('}')[0];
  const colors = Object.fromEntries([...body.matchAll(/--sb-([a-z-]+):\s*(#[a-f0-9]{6});/g)].map(match => [match[1], match[2]]));
  test(`${selector}: texto y estados legibles en las tres superficies`, () => {
    for (const foreground of ['text', 'muted', 'accent-text', 'info', 'success', 'warning', 'danger']) {
      for (const background of ['bg', 'panel', 'elevated']) {
        const ratio = contrast(colors[foreground], colors[background]);
        assert.ok(ratio >= 4.5, `${foreground}/${background}: ${ratio.toFixed(2)}`);
      }
    }
  });
  test(`${selector}: botones y límites de campos conservan contraste`, () => {
    for (const background of ['accent', 'accent-hover']) assert.ok(contrast(colors['on-accent'], colors[background]) >= 4.5);
    for (const background of ['bg', 'panel', 'elevated']) assert.ok(contrast(colors['control-border'], colors[background]) >= 3);
    assert.ok(contrast(colors['accent-text'], colors['accent-soft']) >= 4.5);
  });
}
