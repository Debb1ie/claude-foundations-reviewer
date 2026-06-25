import type { Metadata } from 'next';
import { AdvancedPracticeView } from '@/components/AdvancedPracticeView';

export const metadata: Metadata = {
  title: 'Advanced Practice · CCA-F Reviewer',
  description: '80 advanced-level CCA-F practice questions covering all 5 exam domains.',
};

export default function AdvancedPage() {
  return <AdvancedPracticeView />;
}
