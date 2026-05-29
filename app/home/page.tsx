'use client';
import { useRouter } from 'next/navigation';
import { ModeSelector } from '@/components/ModeSelector';
import { Footer } from '@/components/Footer';
import { useExamStore } from '@/hooks/useExamState';
import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isStarted, startExam } = useExamStore();

  useEffect(() => {
    // If they already have an active exam and visit /home, we redirect them to /exam.
    // They can reset from the exam view if they want to start over.
    if (isStarted) {
      router.push('/exam');
    }
  }, [isStarted, router]);

  return (
    <Box>
      <ModeSelector
        onStart={(mode, domain) => {
          startExam(mode, domain);
          router.push('/exam');
        }}
      />
      <Footer />
    </Box>
  );
}
