'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ResultsSummary } from '@/components/ResultsSummary';
import { useExamStore } from '@/hooks/useExamState';

export default function ResultsPage() {
  const router = useRouter();
  const { isComplete, isStarted, resetExam } = useExamStore();

  useEffect(() => {
    if (!isStarted) {
      router.push('/home');
    } else if (!isComplete) {
      router.push('/exam');
    }
  }, [isStarted, isComplete, router]);

  if (!isStarted || !isComplete) return null;

  return (
    <ResultsSummary 
      onRestart={() => {
        resetExam();
        router.push('/home');
      }} 
    />
  );
}
