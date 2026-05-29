export interface Question {
  id: string;
  text: string;
  scenario?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  domain: Domain;
  task: string;
  source: string;
}

export type Domain = 'D1' | 'D2' | 'D3' | 'D4' | 'D5';

export interface DomainInfo {
  id: Domain;
  name: string;
  shortName: string;
  weight: number;
  color: string;
}

export const DOMAINS: DomainInfo[] = [
  { id: 'D1', name: 'Agentic Architecture & Orchestration', shortName: 'Agentic Arch.', weight: 27, color: '#7C6EFA' },
  { id: 'D2', name: 'Tool Design & MCP Integration', shortName: 'Tool/MCP', weight: 18, color: '#FA8C6E' },
  { id: 'D3', name: 'Claude Code Configuration & Workflows', shortName: 'Claude Code', weight: 20, color: '#6ECFFA' },
  { id: 'D4', name: 'Prompt Engineering & Structured Output', shortName: 'Prompt Eng.', weight: 20, color: '#F0D06E' },
  { id: 'D5', name: 'Context Management & Reliability', shortName: 'Context Mgmt.', weight: 15, color: '#A06EFA' },
];

export type ExamMode = 'exam' | 'review' | 'zen' | 'focus';

export interface ExamState {
  currentQuestion: number;
  answers: (number | null)[];
  timeRemaining: number;
  mode: ExamMode;
  isComplete: boolean;
  selectedDomain: Domain | null;
  questions: Question[];
  startTime: number | null;
  endTime: number | null;
}

export interface ExamResults {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  score: number;
  scaledScore: number;
  passed: boolean;
  timeTaken: number;
  domainBreakdown: Record<Domain, { correct: number; total: number }>;
  incorrectQuestions: { question: Question; userAnswer: number }[];
}

export interface TimerState {
  secondsRemaining: number;
  isRunning: boolean;
  isExpired: boolean;
}
