import type { Metadata } from 'next';
import { ProfessionalPracticeView } from '@/components/ProfessionalPracticeView';
import professionalQuestionsData from '@/data/professional-questions.json';

export const metadata: Metadata = {
  title: 'Professional Mode (CCARP) · Claude Certified Architect Reviewer',
  description: `${professionalQuestionsData.length} Professional-level (CCARP) practice questions, including select-two and scenario matching.`,
};

export default function ProfessionalPage() {
  return <ProfessionalPracticeView />;
}
