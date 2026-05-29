import { useMemo } from 'react';
import type { Question, Domain } from '@/types/exam';

export function useQuestionFilter(questions: Question[], domain: Domain | null) {
  return useMemo(() => {
    if (!domain) return questions;
    return questions.filter((q) => q.domain === domain);
  }, [questions, domain]);
}
