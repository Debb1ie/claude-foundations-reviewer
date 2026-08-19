import type { Metadata } from 'next';
import { DeveloperPracticeView } from '@/components/DeveloperPracticeView';
import developerQuestionsData from '@/data/developer-questions.json';

export const metadata: Metadata = {
  title: 'Developer Practice (CCDV-F) · Claude Certified Exams Reviewer',
  description: `${developerQuestionsData.length} Claude Certified Developer -- Foundations (CCDV-F) practice questions, including select-two and select-three items, with sourced explanations.`,
};

export default function DeveloperCcdvPage() {
  return <DeveloperPracticeView />;
}
