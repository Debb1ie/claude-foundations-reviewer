import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { OnboardingModal } from '@/components/OnboardingModal';
import { Header } from '@/components/Header';
import { getActiveCertification } from '@/lib/certifications';
import './globals.css';

const cert = getActiveCertification();

export const metadata: Metadata = {
  title: `Claude Certified Exams Reviewer | ${cert.shortName}, Advanced & Professional Practice`,
  description: `Practice exam platform covering the full Claude Certified Architect track -- Foundations, Advanced, and Professional levels.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <Header />
          {children}
          <OnboardingModal />
        </Providers>
      </body>
    </html>
  );
}
