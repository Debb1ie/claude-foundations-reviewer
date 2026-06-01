import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Question, ExamMode, Domain, ExamResults } from '@/types/exam';
import { DOMAINS, isAnswerCorrect } from '@/types/exam';
import questionsData from '@/data/questions.json';

interface ExamStore {
  questions: Question[];
  currentQuestion: number;
  answers: (number | number[] | null)[];
  mode: ExamMode | null;
  selectedDomain: Domain | null;
  timeRemaining: number;
  isComplete: boolean;
  isStarted: boolean;
  isPaused: boolean;
  startTime: number | null;
  endTime: number | null;
  flagged: boolean[];
  isReviewing: boolean;
  reviewChecked: boolean[];

  setAnswer: (answer: number | number[]) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  startExam: (mode: ExamMode, domain?: Domain) => void;
  completeExam: () => void;
  resetExam: () => void;
  setPaused: (paused: boolean) => void;
  toggleFlag: (index: number) => void;
  startReview: () => void;
  cancelReview: () => void;
  setReviewChecked: (index: number) => void;
  clearReviewChecked: (index: number) => void;
  getResults: () => ExamResults;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const EXAM_DURATION = 120 * 60;
const FOCUS_DURATION = 60 * 60;

const typedQuestions = questionsData as Question[];

const EXAM_DOMAIN_TARGETS: Record<Domain, number> = {
  D1: 16, D2: 11, D3: 12, D4: 12, D5: 9,
};

function pickQuestionsForExam(): Question[] {
  const domains = ['D1', 'D2', 'D3', 'D4', 'D5'] as Domain[];
  const result: Question[] = [];
  for (const domain of domains) {
    const pool = typedQuestions.filter((q) => q.domain === domain);
    const shuffled = shuffleArray(pool);
    result.push(...shuffled.slice(0, EXAM_DOMAIN_TARGETS[domain]));
  }
  return shuffleArray(result);
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      questions: typedQuestions,
      currentQuestion: 0,
      answers: [],
  mode: null,
  selectedDomain: null,
  timeRemaining: EXAM_DURATION,
  isComplete: false,
  isStarted: false,
  isPaused: false,
  startTime: null,
  endTime: null,
  flagged: [],
  isReviewing: false,
  reviewChecked: [],

  setAnswer: (answer) => {
    const { answers, currentQuestion } = get();
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    set({ answers: newAnswers });
  },

  goToQuestion: (index) => {
    const { mode, answers } = get();
    if (mode && mode !== 'review') {
      const maxAnswered = answers.reduce<number>((max, ans, i) => ans !== null ? Math.max(max, i) : max, -1);
      if (index > maxAnswered + 1) return;
    }
    set({ currentQuestion: index });
  },

  nextQuestion: () => {
    const { currentQuestion, questions, mode, answers } = get();
    if (mode && mode !== 'review') {
      const maxAnswered = answers.reduce<number>((max, ans, i) => ans !== null ? Math.max(max, i) : max, -1);
      if (currentQuestion >= maxAnswered + 1) return;
    }
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

  startExam: (mode, domain) => {
    let selected = typedQuestions;
    if (mode === 'exam' || mode === 'review') {
      selected = pickQuestionsForExam();
    } else if (mode === 'focus' && domain) {
      selected = typedQuestions.filter((q) => q.domain === domain);
    }
    set({
      questions: selected,
      answers: new Array(selected.length).fill(null),
      currentQuestion: 0,
      mode,
      selectedDomain: domain || null,
      timeRemaining: mode === 'focus' ? FOCUS_DURATION : mode === 'zen' ? 0 : EXAM_DURATION,
      isComplete: false,
      isStarted: true,
      isPaused: false,
      startTime: Date.now(),
      endTime: null,
      flagged: new Array(selected.length).fill(false),
      isReviewing: false,
      reviewChecked: new Array(selected.length).fill(false),
    });
  },

  completeExam: () => {
    set({ isComplete: true, endTime: Date.now(), isReviewing: false });
  },

  resetExam: () => {
    set({
      questions: typedQuestions,
      currentQuestion: 0,
      answers: [],
      mode: null,
      selectedDomain: null,
      timeRemaining: EXAM_DURATION,
      isComplete: false,
      isStarted: false,
      isPaused: false,
      startTime: null,
      endTime: null,
      flagged: [],
      isReviewing: false,
      reviewChecked: [],
    });
  },

  setPaused: (paused) => {
    set({ isPaused: paused });
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

  setReviewChecked: (index) => {
    const { reviewChecked } = get();
    const newChecked = [...reviewChecked];
    newChecked[index] = true;
    set({ reviewChecked: newChecked });
  },

  clearReviewChecked: (index) => {
    const { reviewChecked } = get();
    const newChecked = [...reviewChecked];
    newChecked[index] = false;
    set({ reviewChecked: newChecked });
  },

  getResults: () => {
    const { questions, answers, startTime, endTime } = get();
    const correctCount = questions.filter(
      (q, i) => answers[i] !== null && isAnswerCorrect(q, answers[i])
    ).length;
    const totalQuestions = questions.length;
    const incorrectCount = questions.filter(
      (q, i) => answers[i] !== null && !isAnswerCorrect(q, answers[i])
    ).length;
    const unanswered = questions.filter((_, i) => answers[i] === null).length;
    const pct = Math.round((correctCount / totalQuestions) * 100);
    const scaledScore = Math.round(100 + (pct / 100) * 900);
    const passed = scaledScore >= 720;

    const domainBreakdown: Record<string, { correct: number; total: number }> = {};
    DOMAINS.forEach((d) => {
      domainBreakdown[d.id] = { correct: 0, total: 0 };
    });
    questions.forEach((q, i) => {
      if (domainBreakdown[q.domain]) {
        domainBreakdown[q.domain].total++;
        if (answers[i] !== null && isAnswerCorrect(q, answers[i])) {
          domainBreakdown[q.domain].correct++;
        }
      }
    });

    const incorrectQuestions = questions
      .map((q, i) => ({ question: q, userAnswer: answers[i] }))
      .filter((item): item is { question: Question; userAnswer: number | number[] } =>
        item.userAnswer !== null && !isAnswerCorrect(item.question, item.userAnswer)
      );

    return {
      totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unanswered,
      score: pct,
      scaledScore,
      passed,
      timeTaken: startTime && endTime ? Math.round((endTime - startTime) / 1000) : 0,
      domainBreakdown: domainBreakdown as ExamResults['domainBreakdown'],
      incorrectQuestions,
    };
  },
}),
  {
    name: 'exam-storage',
    storage: createJSONStorage(() => sessionStorage),
  }
));
