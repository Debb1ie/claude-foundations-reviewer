import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import professionalQuestionsData from '@/data/professional-questions.json';
import type { DomainId } from '@/types/certification';

export interface MatchingPair {
  requirement: string;
  correctOptionIndex: number;
}

export interface ProfessionalQuestion {
  id: string;
  number: number;
  domain: DomainId;
  /** Discriminates rendering + scoring: a plain single-answer question, a
   *  "Select TWO" multi-select question, or a Scenario Matching question
   *  (several requirement rows matched against one shared option pool). */
  type: 'single' | 'multi' | 'matching';
  text: string;
  /** Single/multi: the four-or-five answer choices. Matching: the shared
   *  option pool every row in `pairs` is matched against. */
  options: string[];
  /** Single-select answer. For multi-select questions this holds one of the
   *  valid indices (kept for type-safety/consistency with the main question
   *  bank's convention) but scoring always defers to correctAnswers. Unused
   *  for matching questions. */
  correctAnswer: number;
  /** Present only on "Select TWO" style questions. */
  correctAnswers?: number[];
  /** Present only on Scenario Matching questions. */
  pairs?: MatchingPair[];
  explanation: string;
}

export function isMultiSelect(q: ProfessionalQuestion): boolean {
  return q.type === 'multi';
}

export function isMatching(q: ProfessionalQuestion): boolean {
  return q.type === 'matching';
}

function isAnswerCorrect(q: ProfessionalQuestion, userAnswer: ProfessionalAnswer): boolean {
  if (userAnswer === null) return false;
  if (isMatching(q)) {
    const pairs = q.pairs!;
    if (!Array.isArray(userAnswer) || userAnswer.length !== pairs.length) return false;
    return pairs.every((p, i) => userAnswer[i] === p.correctOptionIndex);
  }
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

/** Multi-select stores the set of currently-checked option indices.
 *  Matching stores one slot per requirement row, `null` until that row has
 *  been assigned an option. */
export type ProfessionalAnswer = number | (number | null)[] | null;

interface ProfessionalExamStore {
  questions: ProfessionalQuestion[];
  currentQuestion: number;
  answers: ProfessionalAnswer[];
  /** Multi-select questions stay editable (checkboxes can be toggled freely)
   *  until explicitly locked -- unlike single-select, which locks on the
   *  first click. Meaningless for single-select entries. */
  locked: boolean[];
  isStarted: boolean;
  isComplete: boolean;
  isReviewing: boolean;
  startTime: number | null;
  endTime: number | null;
  flagged: boolean[];
  questionTimeSpent: number[];

  start: () => void;
  setAnswer: (answer: ProfessionalAnswer) => void;
  toggleMultiOption: (optionIndex: number) => void;
  setMatchingAnswer: (pairIndex: number, optionIndex: number) => void;
  lockCurrentAnswer: () => void;
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

// Professional questions are shorter, single-paragraph scenarios (unlike the
// dense multi-paragraph Advanced bank), so timing is flat rather than
// difficulty-tiered.
const PER_QUESTION_TIME_LIMIT_SECONDS = 75;
export const FAST_ANSWER_FLOOR_SECONDS = 20;

const allProfessional = professionalQuestionsData as ProfessionalQuestion[];
export const TOTAL_QUESTIONS = allProfessional.length;
export const TOTAL_SECONDS = TOTAL_QUESTIONS * PER_QUESTION_TIME_LIMIT_SECONDS;
export { PER_QUESTION_TIME_LIMIT_SECONDS };

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fisher-Yates on option order, remapping correctAnswer/correctAnswers so the
// answer key still points at the right (now-shuffled) option.
function shuffleOptions(q: ProfessionalQuestion): ProfessionalQuestion {
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const remap = (oldIdx: number) => order.indexOf(oldIdx);
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    correctAnswer: remap(q.correctAnswer),
    correctAnswers: q.correctAnswers?.map(remap),
    pairs: q.pairs?.map((p) => ({ ...p, correctOptionIndex: remap(p.correctOptionIndex) })),
  };
}

let questionEnteredAt = Date.now();

function recordElapsed(
  get: () => ProfessionalExamStore,
  set: (partial: Partial<ProfessionalExamStore>) => void
) {
  const { currentQuestion, questionTimeSpent } = get();
  const now = Date.now();
  const updated = [...questionTimeSpent];
  updated[currentQuestion] = (updated[currentQuestion] || 0) + (now - questionEnteredAt);
  set({ questionTimeSpent: updated });
  questionEnteredAt = now;
}

// Served in full every attempt -- this is the learner's own authored bank,
// not a large pool to sample a subset from -- just reshuffled order + option
// positions per attempt so it isn't trivially memorizable.
function buildSession(): ProfessionalQuestion[] {
  return shuffleArray(allProfessional).map(shuffleOptions);
}

export const useProfessionalExamStore = create<ProfessionalExamStore>()(
  persist(
    (set, get) => ({
      questions: [],
      currentQuestion: 0,
      answers: new Array(TOTAL_QUESTIONS).fill(null),
      locked: new Array(TOTAL_QUESTIONS).fill(false),
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
          locked: new Array(TOTAL_QUESTIONS).fill(false),
          isStarted: true,
          isComplete: false,
          isReviewing: false,
          startTime: Date.now(),
          endTime: null,
          flagged: new Array(TOTAL_QUESTIONS).fill(false),
          questionTimeSpent: new Array(TOTAL_QUESTIONS).fill(0),
        });
      },

      // Single-select: sets the answer and locks it immediately (no changing
      // your mind), matching Advanced Practice's rigor.
      setAnswer: (answer) => {
        const { answers, locked, currentQuestion } = get();
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        const newLocked = [...locked];
        newLocked[currentQuestion] = true;
        set({ answers: newAnswers, locked: newLocked });
      },

      // Multi-select: toggles one checkbox in the current question's answer
      // set. Capped at exactly as many picks as the question requires (e.g.
      // "Select TWO" tops out at 2) -- once at the cap, the remaining
      // unselected options stop accepting clicks until one is unchecked.
      // Stays editable until lockCurrentAnswer() is called.
      toggleMultiOption: (optionIndex) => {
        const { answers, locked, currentQuestion, questions } = get();
        if (locked[currentQuestion]) return;
        const maxSelect = questions[currentQuestion].correctAnswers?.length ?? Infinity;
        const current = answers[currentQuestion];
        const selected = Array.isArray(current) ? [...current] : [];
        const idx = selected.indexOf(optionIndex);
        if (idx >= 0) {
          selected.splice(idx, 1);
        } else {
          if (selected.length >= maxSelect) return;
          selected.push(optionIndex);
        }
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = selected;
        set({ answers: newAnswers });
      },

      // Matching: assigns an option to one requirement row. Stays editable
      // (rows can be reassigned) until lockCurrentAnswer() is called.
      setMatchingAnswer: (pairIndex, optionIndex) => {
        const { answers, locked, currentQuestion, questions } = get();
        if (locked[currentQuestion]) return;
        const pairCount = questions[currentQuestion].pairs?.length ?? 0;
        const current = answers[currentQuestion];
        const slots = Array.isArray(current) ? [...current] : new Array(pairCount).fill(null);
        slots[pairIndex] = optionIndex;
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = slots;
        set({ answers: newAnswers });
      },

      lockCurrentAnswer: () => {
        const { locked, currentQuestion } = get();
        const newLocked = [...locked];
        newLocked[currentQuestion] = true;
        set({ locked: newLocked });
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

      startReview: () => set({ isReviewing: true }),
      cancelReview: () => set({ isReviewing: false }),

      complete: () => {
        recordElapsed(get, set);
        set({ isComplete: true, isReviewing: false, endTime: Date.now() });
      },

      reset: () => {
        set({
          currentQuestion: 0,
          answers: new Array(TOTAL_QUESTIONS).fill(null),
          locked: new Array(TOTAL_QUESTIONS).fill(false),
          isStarted: false,
          isComplete: false,
          isReviewing: false,
          startTime: null,
          endTime: null,
          flagged: new Array(TOTAL_QUESTIONS).fill(false),
          questionTimeSpent: new Array(TOTAL_QUESTIONS).fill(0),
        });
      },

      restartCurrentSession: () => {
        questionEnteredAt = Date.now();
        set({
          currentQuestion: 0,
          answers: new Array(TOTAL_QUESTIONS).fill(null),
          locked: new Array(TOTAL_QUESTIONS).fill(false),
          flagged: new Array(TOTAL_QUESTIONS).fill(false),
          questionTimeSpent: new Array(TOTAL_QUESTIONS).fill(0),
        });
      },

      getScore: () => {
        const { questions, answers } = get();
        const correct = questions.filter((q, i) => isAnswerCorrect(q, answers[i])).length;
        return {
          correct,
          total: questions.length,
          pct: Math.round((correct / questions.length) * 100),
        };
      },
    }),
    {
      name: 'professional-exam-storage-v2',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        questions: state.questions,
        currentQuestion: state.currentQuestion,
        answers: state.answers,
        locked: state.locked,
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

export { isAnswerCorrect };
