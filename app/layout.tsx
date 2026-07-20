import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { OnboardingModal } from '@/components/OnboardingModal';
import { Header } from '@/components/Header';
import { getActiveCertification } from '@/lib/certifications';
import './globals.css';

const cert = getActiveCertification();

export const metadata: Metadata = {
  title: `${cert.shortName} Exam Platform | ${cert.fullName}`,
  description: cert.description,
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
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
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
