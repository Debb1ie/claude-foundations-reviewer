// Shared shape for a certification's domain taxonomy, branding, and exam
// mechanics. There is currently one certification (CCA-F); this exists so
// a future certification (e.g. an "Architect" track) can be added as a new
// data/certifications/<id>/config.ts without touching the Domain typing,
// color tables, or exam-constant literals that used to be hardcoded inline
// across types/exam.ts, both hooks, and ~9 components.

export type DomainId = string;

export interface DomainConfig {
  id: DomainId;
  name: string;
  shortName: string;
  weight: number;
  color: string;
  textColor: { _light: string; _dark: string };
  badgeBg: { _light: string; _dark: string };
  badgeBorder: { _light: string; _dark: string };
  solidBg: string;
  solidText: string;
}

export interface ExamModeConfig {
  durationSeconds: number;
  focusDurationSeconds: number;
  /** Per-domain question counts drawn for a full exam attempt; must sum to the exam's total question count. */
  domainTargets: Record<DomainId, number>;
  /** Path of the question bank this mode draws from, relative to the project root. Informational today (the hooks still static-import their file directly) -- becomes load-bearing once a second certification exists. */
  questionsFile: string;
}

export interface AdvancedModeConfig {
  durationSeconds: number;
  domainTargets: Record<DomainId, number>;
  questionsFile: string;
}

export interface CertificationConfig {
  id: string;
  fullName: string;
  shortName: string;
  description: string;
  domains: DomainConfig[];
  passThreshold: number;
  examMode: ExamModeConfig;
  advancedMode: AdvancedModeConfig;
}
