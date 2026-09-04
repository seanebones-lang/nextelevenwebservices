import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const publicSources = [
  'app/layout.tsx',
  'app/page.tsx',
  'components/experience-runtime.tsx',
  'components/inquiry-form.tsx',
  'components/presence-assistant.tsx',
  'lib/presence-assistant-guided.ts',
  'lib/presence-assistant-knowledge.ts',
  'lib/site-content.ts',
].map((file) => [file, readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')]);

const forbidden = [
  /secure intake/i,
  /system complete/i,
  /nothing leaves (?:the machine|your disk)/i,
  /guaranteed? (?:profit|returns?|income|uptime|accuracy)/i,
  /from \$500/i,
  /from \$2,500/i,
  /from \$7,500/i,
  /from \$150\/month/i,
  /30% deposit/i,
  /3[–-]6 weeks/i,
  /5[–-]10 business days/i,
];

test('public copy does not reintroduce frozen claims', () => {
  for (const [file, source] of publicSources) {
    for (const pattern of forbidden) {
      assert.equal(pattern.test(source), false, `${file} contains forbidden claim ${pattern}`);
    }
  }
});

test('assistant knowledge points to the controlling claims policy', () => {
  const source = readFileSync(
    new URL('../lib/presence-assistant-knowledge.ts', import.meta.url),
    'utf8',
  );
  assert.match(source, /docs\/PUBLIC-CLAIMS\.md/);
});
