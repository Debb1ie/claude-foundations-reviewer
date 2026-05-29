'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReviewOverview } from '@/components/ReviewOverview';
import { useExamStore } from '@/hooks/useExamState';

export default function ReviewPage() {
  const router = useRouter();
  const { isStarted, isReviewing, isComplete } = useExamStore();

  useEffect(() => {
    if (!isStarted) {
      router.push('/home');
    } else if (isComplete) {
      router.push('/exam/results');
    } else if (!isReviewing) {
      router.push('/exam');
    }
  }, [isStarted, isReviewing, isComplete, router]);

  if (!isStarted || !isReviewing || isComplete) return null;

  return <ReviewOverview />;
}
