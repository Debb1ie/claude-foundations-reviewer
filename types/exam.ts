import type { DomainId } from '@/types/certification';
import { getActiveCertification } from '@/lib/certifications';

export interface Question {
  id: string;
  text: string;
  scenario?: string;
  options: string[];
  correctAnswer: number;           // Single-select answer (used when correctAnswers is absent)
  correctAnswers?: number[];       // Multi-select answer array (present = this is a select-all-that-apply question)
  explanation: string;
  domain: Domain;
  task: string;
  source: string;
}

export function isMultiSelect(q: Question): boolean {
  return Array.isArray(q.correctAnswers) && q.correctAnswers.length > 1;
}

export function isAnswerCorrect(q: Question, userAnswer: number | number[] | null): boolean {
  if (userAnswer === null) return false;
  if (isMultiSelect(q)) {
    if (!Array.isArray(userAnswer)) return false;
    const correct = q.correctAnswers!;
    if (userAnswer.length !== correct.length) return false;
    const sorted = [...userAnswer].sort();
    const sortedCorrect = [...correct].sort();
    return sorted.every((v, i) => v === sortedCorrect[i]);
  }
  return typeof userAnswer === 'number' && userAnswer === q.correctAnswer;
}

// Domain is now a plain string id (kebab-case slug, e.g. 'agentic-architecture')
// sourced from the active certification's config, rather than a hardcoded
// 'D1'-'D5' union. Kept as a named type (instead of switching every call
// site to DomainId directly) so existing imports of `Domain` don't need to
// change.
export type Domain = DomainId;

export interface DomainInfo {
  id: Domain;
  name: string;
  shortName: string;
  weight: number;
  color: string;
}

const activeCert = getActiveCertification();

export const DOMAINS: DomainInfo[] = activeCert.domains.map((d) => ({
  id: d.id,
  name: d.name,
  shortName: d.shortName,
  weight: d.weight,
  color: d.color,
}));

function domainRecord<T>(pick: (d: (typeof activeCert.domains)[number]) => T): Record<Domain, T> {
  const record: Record<string, T> = {};
  activeCert.domains.forEach((d) => { record[d.id] = pick(d); });
  return record;
}

export const DOMAIN_TEXT_COLORS: Record<Domain, { _light: string; _dark: string }> = domainRecord((d) => d.textColor);
export const DOMAIN_BADGE_BGS: Record<Domain, { _light: string; _dark: string }> = domainRecord((d) => d.badgeBg);
export const DOMAIN_BADGE_BORDERS: Record<Domain, { _light: string; _dark: string }> = domainRecord((d) => d.badgeBorder);
export const DOMAIN_SOLID_BGS: Record<Domain, string> = domainRecord((d) => d.solidBg);
export const DOMAIN_SOLID_TEXT: Record<Domain, string> = domainRecord((d) => d.solidText);

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
  incorrectQuestions: { question: Question; userAnswer: number | number[] }[];
}

export function isAnswerSelected(userAnswer: number | number[] | null, optionIndex: number): boolean {
  if (userAnswer === null) return false;
  if (Array.isArray(userAnswer)) return userAnswer.includes(optionIndex);
  return userAnswer === optionIndex;
}

export interface TimerState {
  secondsRemaining: number;
  isRunning: boolean;
  isExpired: boolean;
}
