import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeProvider } from './components/ThemeProvider';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Совет Дня (Sovet Dnya)',
  description: 'Your daily dose of personalized, niche-specific wisdom to achieve your goals.',
  keywords: ['daily tips', 'personal development', 'wisdom', 'goals', 'advice'],
  authors: [{ name: 'Sovet Dnya Team' }],
  openGraph: {
    title: 'Совет Дня (Sovet Dnya)',
    description: 'Your daily dose of personalized, niche-specific wisdom to achieve your goals.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>
            <div className="min-h-screen bg-bg text-fg">
              {children}
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
