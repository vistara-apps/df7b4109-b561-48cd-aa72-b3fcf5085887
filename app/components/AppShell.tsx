'use client';

import { ReactNode } from 'react';
import { Settings2, Lightbulb, TrendingUp } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
}

export function AppShell({ children, title = 'Совет Дня', showHeader = true }: AppShellProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg">
      {showHeader && (
        <header className="glass-card border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
                  <p className="text-xs text-text-secondary">Daily wisdom for your goals</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const themes = ['default', 'celo', 'solana', 'base', 'coinbase'] as const;
                    const currentIndex = themes.indexOf(theme);
                    const nextTheme = themes[(currentIndex + 1) % themes.length];
                    setTheme(nextTheme);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                  aria-label="Switch theme"
                >
                  <Settings2 className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className="max-w-md mx-auto px-4 py-6">
        {children}
      </main>
      
      <div className="h-20" /> {/* Bottom spacing */}
    </div>
  );
}
