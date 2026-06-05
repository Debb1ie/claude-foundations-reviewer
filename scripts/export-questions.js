const fs = require('fs');
const path = require('path');

const questions = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'questions.json'), 'utf-8')
);

const DOMAIN_NAMES = {
  D1: 'Agentic Architecture & Orchestration',
  D2: 'Tool Design & MCP Integration',
  D3: 'Claude Code Configuration & Workflows',
  D4: 'Prompt Engineering & Structured Output',
  D5: 'Context Management & Reliability',
};

const DOMAIN_COLORS = {
  D1: '#7C6EFA',
  D2: '#FA8C6E',
  D3: '#6ECFFA',
  D4: '#F0D06E',
  D5: '#A06EFA',
};

const grouped = {};
for (const q of questions) {
  if (!grouped[q.domain]) grouped[q.domain] = [];
  grouped[q.domain].push(q);
}

let md = `# CCA-F Question Bank
> Claude Certified Architect — Foundations Exam
> Exported on ${new Date().toISOString().split('T')[0]}
> Total Questions: ${questions.length}

---

`;

for (const [domain, qs] of Object.entries(grouped)) {
  md += `## ${domain}: ${DOMAIN_NAMES[domain]} (${qs.length} questions)\n\n`;
  for (const q of qs) {
    md += `### ${q.id} — ${q.task}\n\n`;
    if (q.scenario) md += `**Scenario:** ${q.scenario}\n\n`;
    md += `**Question:** ${q.text}\n\n`;
    md += `**Options:**\n\n`;
    q.options.forEach((opt, i) => {
      const prefix = String.fromCharCode(65 + i);
      const isMulti = Array.isArray(q.correctAnswers) && q.correctAnswers.length > 1;
      const isCorrect = isMulti
        ? q.correctAnswers.includes(i)
        : i === q.correctAnswer;
      md += `${prefix}. ${isCorrect ? '**[✓]** ' : ''}${opt}\n\n`;
    });
    if (Array.isArray(q.correctAnswers) && q.correctAnswers.length > 1) {
      const letters = q.correctAnswers.map(i => String.fromCharCode(65 + i)).join(', ');
      md += `**Correct Answers:** ${letters}\n\n`;
    } else {
      md += `**Correct Answer:** ${String.fromCharCode(65 + q.correctAnswer)}\n\n`;
    }
    md += `**Explanation:** ${q.explanation.replace(/<\/?[^>]+(>|$)/g, '')}\n\n`;
    md += `**Source:** ${q.source}\n\n`;
    md += `---\n\n`;
  }
}

const outDir = path.join(__dirname, '..', 'exports');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'questions.md'), md, 'utf-8');
console.log(`✓ MD written: ${path.join(outDir, 'questions.md')}`);

let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CCA-F Question Bank</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #f8f9fd;
    color: #1e293b;
    padding: 2rem;
  }
  .container { max-width: 960px; margin: 0 auto; }
  h1 {
    font-size: 2rem; font-weight: 800; color: #3949ab;
    margin-bottom: 0.5rem;
  }
  .meta { color: #64748b; font-size: 0.9rem; margin-bottom: 2rem; }
  .domain {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(12px);
    border: 2px solid rgba(255,255,255,0.35);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 8px 32px rgba(31,38,135,0.03);
  }
  .domain-header {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;
  }
  .domain-dot {
    width: 14px; height: 14px; border-radius: 4px; flex-shrink: 0;
  }
  .domain h2 { font-size: 1.3rem; font-weight: 700; color: #3949ab; }
  .domain-count { color: #94a3b8; font-size: 0.85rem; font-weight: 600; }
  .question {
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 12px;
    padding: 1.25rem;
    margin-bottom: 1rem;
  }
  .q-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.75rem;
  }
  .q-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem; font-weight: 700; color: #3949ab;
    background: rgba(57,73,171,0.08); padding: 0.2rem 0.6rem;
    border-radius: 6px;
  }
  .q-task { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
  .q-scenario {
    font-size: 0.85rem; color: #64748b; font-style: italic;
    margin-bottom: 0.75rem; padding: 0.5rem 0.75rem;
    background: rgba(57,73,171,0.04); border-radius: 8px;
    border-left: 3px solid #3949ab;
  }
  .q-text { font-size: 0.95rem; font-weight: 600; color: #1e293b; margin-bottom: 0.75rem; }
  .options { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.75rem; }
  .option {
    font-size: 0.88rem; padding: 0.5rem 0.75rem;
    border-radius: 8px; border: 1px solid #e2e8f0;
    background: white;
  }
  .option.correct {
    border-color: #22c55e; background: rgba(34,197,94,0.06);
  }
  .q-answer {
    font-size: 0.85rem; font-weight: 700; color: #16a34a; margin-bottom: 0.4rem;
  }
  .q-explanation {
    font-size: 0.85rem; color: #475569; line-height: 1.6;
    padding: 0.75rem; background: rgba(57,73,171,0.04);
    border-radius: 8px;
  }
  .q-source { font-size: 0.75rem; color: #94a3b8; margin-top: 0.5rem; font-style: italic; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 1rem 0; }
</style>
</head>
<body>
<div class="container">
  <h1>CCA-F Question Bank</h1>
  <p class="meta">Claude Certified Architect — Foundations Exam &middot; ${questions.length} questions &middot; Exported ${new Date().toISOString().split('T')[0]}</p>
`;

for (const [domain, qs] of Object.entries(grouped)) {
  html += `
  <div class="domain">
    <div class="domain-header">
      <div class="domain-dot" style="background:${DOMAIN_COLORS[domain]}"></div>
      <h2>${domain}: ${DOMAIN_NAMES[domain]}</h2>
      <span class="domain-count">(${qs.length} questions)</span>
    </div>
`;
  for (const q of qs) {
    const isMulti = Array.isArray(q.correctAnswers) && q.correctAnswers.length > 1;
    html += `
    <div class="question">
      <div class="q-header">
        <span class="q-id">${q.id}</span>
        <span class="q-task">${q.task}</span>
      </div>
`;
    if (q.scenario) {
      html += `      <div class="q-scenario">${q.scenario}</div>\n`;
    }
    html += `      <div class="q-text">${q.text}</div>\n`;
    html += `      <div class="options">\n`;
    q.options.forEach((opt, i) => {
      const prefix = String.fromCharCode(65 + i);
      const isCorrect = isMulti ? q.correctAnswers.includes(i) : i === q.correctAnswer;
      html += `        <div class="option${isCorrect ? ' correct' : ''}">${prefix}. ${opt}</div>\n`;
    });
    html += `      </div>\n`;
    if (isMulti) {
      const letters = q.correctAnswers.map(i => String.fromCharCode(65 + i)).join(', ');
      html += `      <div class="q-answer">Correct Answers: ${letters}</div>\n`;
    } else {
      html += `      <div class="q-answer">Correct Answer: ${String.fromCharCode(65 + q.correctAnswer)}</div>\n`;
    }
    html += `      <div class="q-explanation">${q.explanation}</div>\n`;
    html += `      <div class="q-source">Source: ${q.source}</div>\n`;
    html += `    </div>\n`;
  }
  html += `  </div>\n`;
}

html += `</div></body></html>`;

fs.writeFileSync(path.join(outDir, 'questions.html'), html, 'utf-8');
console.log(`✓ HTML written: ${path.join(outDir, 'questions.html')}`);
