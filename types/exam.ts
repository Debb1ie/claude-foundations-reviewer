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

export const DOMAIN_TEXT_COLORS: Record<Domain, { _light: string; _dark: string }> = {
  D1: { _light: '#3f51b5', _dark: '#9f92ec' }, // Deep Indigo / Soft Purple
  D2: { _light: '#c83b14', _dark: '#fa9a80' }, // Vivid Coral / Soft Coral
  D3: { _light: '#006c8c', _dark: '#85d7fa' }, // Deep Cyan / Soft Blue
  D4: { _light: '#805b00', _dark: '#f3db8b' }, // Dark Gold / Soft Gold
  D5: { _light: '#6f2bc8', _dark: '#b996fb' }, // Deep Purple / Soft Violet
};

export const DOMAIN_BADGE_BGS: Record<Domain, { _light: string; _dark: string }> = {
  D1: { _light: 'rgba(124, 110, 250, 0.08)', _dark: 'rgba(124, 110, 250, 0.15)' },
  D2: { _light: 'rgba(250, 140, 110, 0.08)', _dark: 'rgba(250, 140, 110, 0.15)' },
  D3: { _light: 'rgba(110, 207, 250, 0.09)', _dark: 'rgba(110, 207, 250, 0.15)' },
  D4: { _light: 'rgba(240, 208, 110, 0.09)', _dark: 'rgba(240, 208, 110, 0.15)' },
  D5: { _light: 'rgba(160, 110, 250, 0.08)', _dark: 'rgba(160, 110, 250, 0.15)' },
};

export const DOMAIN_BADGE_BORDERS: Record<Domain, { _light: string; _dark: string }> = {
  D1: { _light: 'rgba(124, 110, 250, 0.22)', _dark: 'rgba(124, 110, 250, 0.3)' },
  D2: { _light: 'rgba(250, 140, 110, 0.22)', _dark: 'rgba(250, 140, 110, 0.3)' },
  D3: { _light: 'rgba(110, 207, 250, 0.26)', _dark: 'rgba(110, 207, 250, 0.35)' },
  D4: { _light: 'rgba(240, 208, 110, 0.26)', _dark: 'rgba(240, 208, 110, 0.35)' },
  D5: { _light: 'rgba(160, 110, 250, 0.22)', _dark: 'rgba(160, 110, 250, 0.3)' },
};

export const DOMAIN_SOLID_BGS: Record<Domain, string> = {
  D1: '#5C4EFA', // Vibrant Indigo
  D2: '#F25C37', // Vibrant Coral/Orange
  D3: '#00B4D8', // Vibrant Cyan/Blue
  D4: '#E5A900', // Vibrant Gold/Yellow
  D5: '#904EFA', // Vibrant Purple
};

export const DOMAIN_SOLID_TEXT: Record<Domain, string> = {
  D1: '#ffffff',
  D2: '#ffffff',
  D3: '#ffffff',
  D4: '#0f172a', // Slate-900 for dark gold contrast
  D5: '#ffffff',
};

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
