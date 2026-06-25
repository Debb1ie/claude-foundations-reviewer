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
  revealed: boolean[];

  start: () => void;
  setAnswer: (answer: number) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  toggleFlag: (index: number) => void;
  revealAnswer: (index: number) => void;
  complete: () => void;
  reset: () => void;

  getScore: () => { correct: number; total: number; pct: number };
}

const typedQuestions = advancedQuestionsData as AdvancedQuestion[];

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
      revealed: new Array(typedQuestions.length).fill(false),

      start: () => {
        set({
          currentQuestion: 0,
          answers: new Array(typedQuestions.length).fill(null),
          isStarted: true,
          isComplete: false,
          startTime: Date.now(),
          endTime: null,
          flagged: new Array(typedQuestions.length).fill(false),
          revealed: new Array(typedQuestions.length).fill(false),
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

      revealAnswer: (index) => {
        const { revealed } = get();
        const newRevealed = [...revealed];
        newRevealed[index] = true;
        set({ revealed: newRevealed });
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
          revealed: new Array(typedQuestions.length).fill(false),
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
      name: 'advanced-exam-storage-v4',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentQuestion: state.currentQuestion,
        answers: state.answers,
        isStarted: state.isStarted,
        isComplete: state.isComplete,
        startTime: state.startTime,
        endTime: state.endTime,
        flagged: state.flagged,
        revealed: state.revealed,
      }),
    }
  )
);
