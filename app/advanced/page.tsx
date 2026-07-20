import type { Metadata } from 'next';
import { AdvancedPracticeView } from '@/components/AdvancedPracticeView';
import { getActiveCertification } from '@/lib/certifications';
import advancedQuestionsData from '@/data/advanced-questions.json';

const cert = getActiveCertification();

export const metadata: Metadata = {
  title: `Advanced Practice · ${cert.shortName} Reviewer`,
  description: `${advancedQuestionsData.length} advanced-level ${cert.shortName} practice questions covering all ${cert.domains.length} exam domains.`,
};

export default function AdvancedPage() {
  return <AdvancedPracticeView />;
}
