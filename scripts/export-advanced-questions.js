const fs = require('fs');
const path = require('path');

const questions = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'advanced-questions.json'), 'utf-8')
);

const DOMAIN_NAMES = {
  'agentic-architecture': 'Agentic Architecture & Orchestration',
  'tool-design-mcp': 'Tool Design & MCP Integration',
  'claude-code': 'Claude Code Configuration & Workflows',
  'prompt-engineering': 'Prompt Engineering & Structured Output',
  'context-management': 'Context Management & Reliability',
};

const grouped = {};
for (const q of questions) {
  if (!grouped[q.domain]) grouped[q.domain] = [];
  grouped[q.domain].push(q);
}

let md = `# Advanced Practice Question Bank
> Claude Certified Architect — Foundations Exam (Advanced Practice mode)
> Exported on ${new Date().toISOString().split('T')[0]}
> Total Questions: ${questions.length}

---

`;

for (const [domain, qs] of Object.entries(grouped)) {
  md += `## ${domain}: ${DOMAIN_NAMES[domain] || domain} (${qs.length} questions)\n\n`;
  for (const q of qs) {
    md += `### ${q.id} (#${q.number}, ${q.difficulty})\n\n`;
    md += `**Question:** ${q.text}\n\n`;
    md += `**Options:**\n\n`;
    q.options.forEach((opt, i) => {
      const prefix = String.fromCharCode(65 + i);
      const isCorrect = i === q.correctAnswer;
      md += `${prefix}. ${isCorrect ? '**[✓]** ' : ''}${opt}\n\n`;
    });
    md += `**Correct Answer:** ${String.fromCharCode(65 + q.correctAnswer)}\n\n`;
    md += `**Explanation:** ${q.explanation}\n\n`;
    if (q.sourceLabel) md += `**Source:** ${q.sourceLabel}\n\n`;
    if (q.sourceUrl) md += `**Source URL:** ${q.sourceUrl}\n\n`;
    if (q.sourceExcerpt) md += `**Source Excerpt:** ${q.sourceExcerpt}\n\n`;
    md += `---\n\n`;
  }
}

const outDir = path.join(__dirname, '..', 'exports');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'advanced-questions.md'), md, 'utf-8');
console.log(`✓ MD written: ${path.join(outDir, 'advanced-questions.md')}`);
