'use client';
import { ModeSelector } from '@/components/ModeSelector';
import { ExamView } from '@/components/ExamView';
import { Footer } from '@/components/Footer';
import { useExamStore } from '@/hooks/useExamState';
import { Box } from '@chakra-ui/react';

export default function Home() {
  const { isStarted, startExam } = useExamStore();

  if (isStarted) {
    return <ExamView />;
  }

  return (
    <Box>
      <ModeSelector
        onStart={startExam}
      />
      <Footer />
    </Box>
  );
}
