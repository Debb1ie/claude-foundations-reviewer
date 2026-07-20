// One-off migration: rewrites data/questions.json's domain field from the
// old 'D1'-'D5' codes to the kebab-case slugs already used natively by
// data/advanced-questions.json, so both banks share one domain taxonomy
// (see data/certifications/cca-f/config.ts). Safe to re-run -- it's a no-op
// once the values are already slugs.
const fs = require('fs');
const path = require('path');

const DOMAIN_MAP = {
  D1: 'agentic-architecture',
  D2: 'tool-design-mcp',
  D3: 'claude-code',
  D4: 'prompt-engineering',
  D5: 'context-management',
};

const filePath = path.join(__dirname, '..', 'data', 'questions.json');
const questions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const before = {};
questions.forEach((q) => { before[q.domain] = (before[q.domain] || 0) + 1; });

let migrated = 0;
questions.forEach((q) => {
  if (DOMAIN_MAP[q.domain]) {
    q.domain = DOMAIN_MAP[q.domain];
    migrated++;
  }
});

const after = {};
questions.forEach((q) => { after[q.domain] = (after[q.domain] || 0) + 1; });

// Preserve the file's existing CRLF line endings to keep the diff to just
// the migrated values, not a whole-file line-ending rewrite.
const output = (JSON.stringify(questions, null, 4) + '\n').replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, output, 'utf-8');

console.log(`Migrated ${migrated}/${questions.length} questions.`);
console.log('Before:', before);
console.log('After:', after);
