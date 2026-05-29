'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExamView } from '@/components/ExamView';
import { useExamStore } from '@/hooks/useExamState';

export default function ExamPage() {
  const router = useRouter();
  const { isStarted, isComplete, isReviewing } = useExamStore();

  useEffect(() => {
    if (!isStarted) {
      router.push('/home');
    } else if (isComplete) {
      router.push('/exam/results');
    } else if (isReviewing) {
      router.push('/exam/review');
    }
  }, [isStarted, isComplete, isReviewing, router]);

  if (!isStarted || isComplete || isReviewing) {
    return null; // Return null while redirecting
  }

  return <ExamView />;
}
