import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// Blended bank: 55% legacy CCA-F-domain-quota questions (advanced-questions.json)
// + 45% community mock-exam questions (advanced-mock-questions.json). Both
// files share the same 5-domain taxonomy, so the split is applied per domain
// using the exam's existing domainTargets quota, keeping the original
// per-domain distribution intact while blending sources within each domain.
import legacyQuestionsData from '@/data/advanced-questions.json';
import mockQuestionsData from '@/data/advanced-mock-questions.json';
import type { DomainId } from '@/types/certification';
import { getActiveCertification } from '@/lib/certifications';

export interface AdvancedQuestion {
  id: string;
  number: number;
  domain: DomainId;
  difficulty: '2x' | '3x';
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  sourceLabel?: string;
  sourceUrl?: string;
  /** Short verbatim excerpt from the source page, shown & highlighted in-app (no navigation needed). */
  sourceExcerpt?: string;
  /** Exact substring of sourceExcerpt to visually highlight. */
  sourceHighlight?: string;
}

interface AdvancedExamStore {
  questions: AdvancedQuestion[];
  currentQuestion: number;
  answers: (number | null)[];
  isStarted: boolean;
  isComplete: boolean;
  isReviewing: boolean;
  startTime: number | null;
  endTime: number | null;
  flagged: boolean[];
  /** Milliseconds spent on each question index -- used to flag suspiciously
   *  fast completion (see checkFastAnswerFlag in the Results screen). */
  questionTimeSpent: number[];

  start: () => void;
  setAnswer: (answer: number) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  toggleFlag: (index: number) => void;
  startReview: () => void;
  cancelReview: () => void;
  complete: () => void;
  reset: () => void;
  restartCurrentSession: () => void;

  getScore: () => { correct: number; total: number; pct: number };
}

const cert = getActiveCertification();

export const TOTAL_SECONDS = cert.advancedMode.durationSeconds;

// Fisher-Yates, generic.
function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fisher-Yates. Re-run per attempt so the correct answer's position (and any
// length/style tell in a fixed ordering) can't be memorized across attempts.
function shuffleOptions(q: AdvancedQuestion): AdvancedQuestion {
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    correctAnswer: order.indexOf(q.correctAnswer),
  };
}

// Wall-clock timestamp of when the learner landed on the currently-active
// question. Deliberately kept outside the persisted store: it's a
// transient bookkeeping value, not exam state, and a mid-session page
// refresh simply restarts the clock for whichever question is current --
// erring toward under- rather than over-counting elapsed time.
let questionEnteredAt = Date.now();

function recordElapsed(
  get: () => AdvancedExamStore,
  set: (partial: Partial<AdvancedExamStore>) => void
) {
  const { currentQuestion, questionTimeSpent } = get();
  const now = Date.now();
  const updated = [...questionTimeSpent];
  updated[currentQuestion] = (updated[currentQuestion] || 0) + (now - questionEnteredAt);
  set({ questionTimeSpent: updated });
  questionEnteredAt = now;
}

const allLegacy = legacyQuestionsData as AdvancedQuestion[];
const allMock = mockQuestionsData as AdvancedQuestion[];

const LEGACY_SHARE = 0.55;
const domainTargets = cert.advancedMode.domainTargets;
export const TOTAL_QUESTIONS = (Object.values(domainTargets) as number[]).reduce((a, b) => a + b, 0);

// Re-run per attempt: for each domain, draw ~55% of that domain's quota from
// the legacy bank and the rest from the mock bank, then shuffle both the
// question order and each question's option order -- so no two sessions
// show the same exam in the same sequence, and no fixed source/order is
// memorizable across attempts.
function buildSession(): AdvancedQuestion[] {
  const picked: AdvancedQuestion[] = [];
  for (const domain of Object.keys(domainTargets) as DomainId[]) {
    const target = domainTargets[domain];
    const legacyCount = Math.round(target * LEGACY_SHARE);
    const mockCount = target - legacyCount;
    const legacyPool = allLegacy.filter((q) => q.domain === domain);
    const mockPool = allMock.filter((q) => q.domain === domain);
    picked.push(...shuffleArray(legacyPool).slice(0, legacyCount));
    picked.push(...shuffleArray(mockPool).slice(0, mockCount));
  }
  return shuffleArray(picked).map(shuffleOptions);
}

export const useAdvancedExamStore = create<AdvancedExamStore>()(
  persist(
    (set, get) => ({
      questions: [],
      currentQuestion: 0,
      answers: new Array(TOTAL_QUESTIONS).fill(null),
      isStarted: false,
      isComplete: false,
      isReviewing: false,
      startTime: null,
      endTime: null,
      flagged: new Array(TOTAL_QUESTIONS).fill(false),
      questionTimeSpent: new Array(TOTAL_QUESTIONS).fill(0),

      start: () => {
        questionEnteredAt = Date.now();
        set({
          questions: buildSession(),
          currentQuestion: 0,
          answers: new Array(TOTAL_QUESTIONS).fill(null),
          isStarted: true,
          isComplete: false,
          isReviewing: false,
          startTime: Date.now(),
          endTime: null,
          flagged: new Array(TOTAL_QUESTIONS).fill(false),
          questionTimeSpent: new Array(TOTAL_QUESTIONS).fill(0),
        });
      },

      setAnswer: (answer) => {
        const { answers, currentQuestion } = get();
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        set({ answers: newAnswers });
      },

      goToQuestion: (index) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          recordElapsed(get, set);
          set({ currentQuestion: index });
        }
      },

      nextQuestion: () => {
        const { currentQuestion, questions } = get();
        if (currentQuestion < questions.length - 1) {
          recordElapsed(get, set);
          set({ currentQuestion: currentQuestion + 1 });
        }
      },

      prevQuestion: () => {
        const { currentQuestion } = get();
        if (currentQuestion > 0) {
          recordElapsed(get, set);
          set({ currentQuestion: currentQuestion - 1 });
        }
      },

      toggleFlag: (index) => {
        const { flagged } = get();
        const newFlagged = [...flagged];
        newFlagged[index] = !newFlagged[index];
        set({ flagged: newFlagged });
      },

      startReview: () => {
        set({ isReviewing: true });
      },

      cancelReview: () => {
        set({ isReviewing: false });
      },

      complete: () => {
        recordElapsed(get, set);
        set({ isComplete: true, isReviewing: false, endTime: Date.now() });
      },

      reset: () => {
        set({
          currentQuestion: 0,
          answers: new Array(TOTAL_QUESTIONS).fill(null),
          isStarted: false,
          isComplete: false,
          isReviewing: false,
          startTime: null,
          endTime: null,
          flagged: new Array(TOTAL_QUESTIONS).fill(false),
          questionTimeSpent: new Array(TOTAL_QUESTIONS).fill(0),
        });
      },

      // Wipes answers/flags and returns to question 1, but keeps the same
      // question set and stays on the exam page -- used to penalize
      // leaving fullscreen, without kicking the learner back to the menu.
      restartCurrentSession: () => {
        questionEnteredAt = Date.now();
        set({
          currentQuestion: 0,
          answers: new Array(TOTAL_QUESTIONS).fill(null),
          flagged: new Array(TOTAL_QUESTIONS).fill(false),
          questionTimeSpent: new Array(TOTAL_QUESTIONS).fill(0),
        });
      },

      getScore: () => {
        const { questions, answers } = get();
        const correct = questions.filter((q, i) => answers[i] === q.correctAnswer).length;
        return {
          correct,
          total: questions.length,
          pct: Math.round((correct / questions.length) * 100),
        };
      },
    }),
    {
      name: 'advanced-exam-storage-v10',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        questions: state.questions,
        currentQuestion: state.currentQuestion,
        answers: state.answers,
        isStarted: state.isStarted,
        isComplete: state.isComplete,
        isReviewing: state.isReviewing,
        startTime: state.startTime,
        endTime: state.endTime,
        flagged: state.flagged,
        questionTimeSpent: state.questionTimeSpent,
      }),
    }
  )
);
