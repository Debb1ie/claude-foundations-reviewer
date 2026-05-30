import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { OnboardingModal } from '@/components/OnboardingModal';
import './globals.css';

export const metadata: Metadata = {
  title: 'CCA-F Exam Platform | Claude Certified Architect',
  description: 'Practice exam platform for the Claude Certified Architect Foundations (CCA-F) certification',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
          <OnboardingModal />
        </Providers>
      </body>
    </html>
  );
}
