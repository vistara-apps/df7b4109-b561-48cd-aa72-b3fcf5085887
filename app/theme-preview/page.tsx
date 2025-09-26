'use client';

import { AppShell } from '../components/AppShell';
import { TipCard } from '../components/TipCard';
import { ProgressTracker } from '../components/ProgressTracker';
import { ActionButton } from '../components/ActionButton';
import { useTheme } from '../components/ThemeProvider';
import { DailyTip, ProgressStats } from '@/lib/types';
import { Palette, ArrowLeft } from 'lucide-react';

const sampleTip: DailyTip = {
  tipId: 'sample-tip',
  content: 'Focus on building one small habit at a time. Consistency beats perfection when it comes to achieving your long-term goals.',
  niche: 'productivity',
  actionItems: [
    'Choose one small action you can do daily',
    'Set a specific time to perform this action',
    'Track your progress for the next 7 days'
  ],
  generatedAt: new Date(),
  difficulty: 'beginner'
};

const sampleStats: ProgressStats = {
  currentStreak: 5,
  longestStreak: 12,
  totalTipsCompleted: 28,
  weeklyProgress: 6
};

export default function ThemePreviewPage() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'default', name: 'Warm Social', description: 'Cozy community feel' },
    { id: 'celo', name: 'CELO', description: 'Bold yellow accents' },
    { id: 'solana', name: 'Solana', description: 'Purple gradient vibes' },
    { id: 'base', name: 'Base', description: 'Clean blue design' },
    { id: 'coinbase', name: 'Coinbase', description: 'Professional navy' },
  ] as const;

  return (
    <AppShell title="Theme Preview">
      <div className="space-y-6">
        {/* Back Button */}
        <ActionButton
          onClick={() => window.history.back()}
          variant="secondary"
          className="w-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </ActionButton>

        {/* Theme Selector */}
        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Choose Your Theme
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                  theme === themeOption.id
                    ? 'border-accent bg-accent/10 text-text-primary'
                    : 'border-white/10 bg-surface hover:bg-white/5 text-text-primary'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{themeOption.name}</h3>
                    <p className="text-sm text-text-secondary">{themeOption.description}</p>
                  </div>
                  {theme === themeOption.id && (
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Components */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">Preview</h3>
          
          {/* Progress Tracker Preview */}
          <ProgressTracker stats={sampleStats} variant="simple" />
          
          {/* Tip Card Preview */}
          <TipCard tip={sampleTip} />
          
          {/* Button Previews */}
          <div className="flex gap-3">
            <ActionButton variant="primary" className="flex-1">
              Primary Button
            </ActionButton>
            <ActionButton variant="secondary" className="flex-1">
              Secondary Button
            </ActionButton>
          </div>
        </div>

        {/* Theme Info */}
        <div className="glass-card p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-text-primary mb-3">Current Theme: {themes.find(t => t.id === theme)?.name}</h3>
          <p className="text-text-secondary mb-4">{themes.find(t => t.id === theme)?.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Background:</span>
              <div className="w-full h-8 bg-bg rounded mt-1 border border-white/10"></div>
            </div>
            <div>
              <span className="text-text-secondary">Surface:</span>
              <div className="w-full h-8 bg-surface rounded mt-1 border border-white/10"></div>
            </div>
            <div>
              <span className="text-text-secondary">Accent:</span>
              <div className="w-full h-8 bg-accent rounded mt-1"></div>
            </div>
            <div>
              <span className="text-text-secondary">Primary:</span>
              <div className="w-full h-8 bg-primary rounded mt-1"></div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
