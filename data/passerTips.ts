export interface PasserTip {
  text: string;
  author: string;
}

export const PASSER_TIPS: PasserTip[] = [
  { text: 'CI/CD integration is heavily tested — around 10 questions came from that topic alone.', author: 'Dan Gallano, 3rd CCAF' },
  { text: 'Take mocks from different sources so you get exposed to different question styles.', author: 'Dan Gallano, 3rd CCAF' },
  { text: 'Expect scenarios, not definitions — know commands vs. flags, tools vs. subagents.', author: 'Dan Gallano, 3rd CCAF' },
  { text: 'Answer the easy questions first, flag the hard ones, and come back later.', author: 'Dan Gallano, 3rd CCAF' },
  { text: 'The real exam can be 2–3x harder than the advanced mock exam.', author: 'Dan Gallano, 3rd CCAF' },

  { text: 'Use process of elimination — strike out at least two options you know are wrong.', author: 'JohnA, 2nd CCAF' },
  { text: 'Do two passes: flag ambiguous questions first, then re-read them with fresh eyes.', author: 'JohnA, 2nd CCAF' },
  { text: 'Read every option carefully — the differences are often tiny.', author: 'JohnA, 2nd CCAF' },
  { text: '"Upgrade the model" or "increase max tokens" is almost never the right answer.', author: 'JohnA, 2nd CCAF' },
  { text: 'Learn which fix applies to which problem — the same concepts repeat across scenarios.', author: 'JohnA, 2nd CCAF' },

  { text: 'More than one answer can look right — pick the one the question is actually asking for.', author: 'LM Inocentes, CCAF 4' },
  { text: 'Questions and answer choices run long — pace yourself against reading fatigue.', author: 'LM Inocentes, CCAF 4' },
  { text: 'The 2-hour limit is generous — don’t rush unnecessarily.', author: 'LM Inocentes, CCAF 4' },
  { text: 'Strike through options you know are wrong, and flag hard ones for later.', author: 'LM Inocentes, CCAF 4' },
  { text: 'Don’t just take mocks — some questions require reading the actual documentation.', author: 'LM Inocentes, CCAF 4' },

  { text: 'Don’t let mock exam confidence replace real preparation.', author: 'JELLO, CCAF 5' },
  { text: 'Study the learning materials thoroughly — don’t just skim them.', author: 'JELLO, CCAF 5' },
  { text: 'Complete as many mock exams as you can before the real thing.', author: 'JELLO, CCAF 5' },
  { text: 'Even at roughly 2 minutes a question, it can feel rushed — manage your time.', author: 'JELLO, CCAF 5' },
  { text: 'Focus on why an answer is correct, not just memorizing it.', author: 'JELLO, CCAF 5' },

  { text: 'Understand why and when to use a feature, not just what it does.', author: 'Precious Manucom, Passed CCAF' },
  { text: 'Several choices can look correct — pick the one that best fits the scenario.', author: 'Precious Manucom, Passed CCAF' },
  { text: 'Know Claude Code architecture: orchestration, context management, MCP, hooks, structured outputs.', author: 'Precious Manucom, Passed CCAF' },
  { text: 'Study the docs — the exam goes beyond mock exam topics.', author: 'Precious Manucom, Passed CCAF' },
  { text: 'The time limit is generous — flag hard questions and return to them later.', author: 'Precious Manucom, Passed CCAF' },
];
