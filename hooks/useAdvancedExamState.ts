import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import advancedQuestionsData from '@/data/advanced-questions.json';

export interface AdvancedQuestion {
  id: string;
  number: number;
  domain: 'D1' | 'D2' | 'D3' | 'D4' | 'D5';
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
  startTime: number | null;
  endTime: number | null;
  flagged: boolean[];

  start: () => void;
  setAnswer: (answer: number) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  toggleFlag: (index: number) => void;
  complete: () => void;
  reset: () => void;

  getScore: () => { correct: number; total: number; pct: number };
}

export const TOTAL_SECONDS = 7200; // 2 hours max

// Fixed per-domain question counts, summing to 60 (matches the real exam's ~2hr scope)
const targetPerDomain: Record<string, number> = {
  'agentic-architecture': 15,
  'tool-design-mcp': 9,
  'claude-code': 12,
  'prompt-engineering': 12,
  'context-management': 12,
};

// Evenly spaced (systematic) sample so a capped-down domain still draws from
// across the whole pool — old and newly-added questions alike — instead of
// truncating from one end.
function systematicSample<T>(items: T[], n: number): T[] {
  if (items.length <= n) return items;
  const picked: T[] = [];
  for (let i = 0; i < n; i++) {
    picked.push(items[Math.floor((i * items.length) / n)]);
  }
  return picked;
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

const allAdvanced = advancedQuestionsData as AdvancedQuestion[];
const typedQuestions: AdvancedQuestion[] = Object.keys(targetPerDomain).flatMap((domain) => {
  const target = targetPerDomain[domain];
  const threes = allAdvanced.filter((q) => q.domain === domain && q.difficulty === '3x');
  const twos = allAdvanced.filter((q) => q.domain === domain && q.difficulty === '2x');
  if (threes.length >= target) return systematicSample(threes, target);
  return threes.concat(systematicSample(twos, target - threes.length));
});

export const useAdvancedExamStore = create<AdvancedExamStore>()(
  persist(
    (set, get) => ({
      questions: typedQuestions,
      currentQuestion: 0,
      answers: new Array(typedQuestions.length).fill(null),
      isStarted: false,
      isComplete: false,
      startTime: null,
      endTime: null,
      flagged: new Array(typedQuestions.length).fill(false),

      start: () => {
        set({
          questions: typedQuestions.map(shuffleOptions),
          currentQuestion: 0,
          answers: new Array(typedQuestions.length).fill(null),
          isStarted: true,
          isComplete: false,
          startTime: Date.now(),
          endTime: null,
          flagged: new Array(typedQuestions.length).fill(false),
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
          set({ currentQuestion: index });
        }
      },

      nextQuestion: () => {
        const { currentQuestion, questions } = get();
        if (currentQuestion < questions.length - 1) {
          set({ currentQuestion: currentQuestion + 1 });
        }
      },

      prevQuestion: () => {
        const { currentQuestion } = get();
        if (currentQuestion > 0) {
          set({ currentQuestion: currentQuestion - 1 });
        }
      },

      toggleFlag: (index) => {
        const { flagged } = get();
        const newFlagged = [...flagged];
        newFlagged[index] = !newFlagged[index];
        set({ flagged: newFlagged });
      },

      complete: () => {
        set({ isComplete: true, endTime: Date.now() });
      },

      reset: () => {
        set({
          currentQuestion: 0,
          answers: new Array(typedQuestions.length).fill(null),
          isStarted: false,
          isComplete: false,
          startTime: null,
          endTime: null,
          flagged: new Array(typedQuestions.length).fill(false),
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
      name: 'advanced-exam-storage-v8',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        questions: state.questions,
        currentQuestion: state.currentQuestion,
        answers: state.answers,
        isStarted: state.isStarted,
        isComplete: state.isComplete,
        startTime: state.startTime,
        endTime: state.endTime,
        flagged: state.flagged,
      }),
    }
  )
);
