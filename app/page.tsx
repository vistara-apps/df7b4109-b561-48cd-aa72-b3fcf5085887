'use client';

import { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { TipCard } from './components/TipCard';
import { ProgressTracker } from './components/ProgressTracker';
import { OnboardingForm } from './components/OnboardingForm';
import { ActionButton } from './components/ActionButton';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar, Identity } from '@coinbase/onchainkit/identity';
import { User, DailyTip, ProgressStats, OnboardingData } from '@/lib/types';
import { generatePersonalizedTip, getGreeting, generateTipId, generateUserId } from '@/lib/utils';
import { Sparkles, Calendar, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [currentTip, setCurrentTip] = useState<DailyTip | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ProgressStats>({
    currentStreak: 3,
    longestStreak: 7,
    totalTipsCompleted: 15,
    weeklyProgress: 5
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('sovet_user');
    const savedTip = localStorage.getItem('sovet_current_tip');
    const savedCompleted = localStorage.getItem('sovet_completed_today');
    const savedStats = localStorage.getItem('sovet_stats');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedTip) {
      setCurrentTip(JSON.parse(savedTip));
    }
    if (savedCompleted) {
      setIsCompleted(JSON.parse(savedCompleted));
    }
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setLoading(true);
    
    try {
      const newUser: User = {
        userId: generateUserId(),
        statedGoal: data.goal,
        niche: data.niche,
        onboardingComplete: true,
        notificationPreferences: {
          enabled: true,
          time: '09:00'
        },
        createdAt: new Date()
      };

      // Generate first tip
      const tipData = await generatePersonalizedTip(data.goal, data.niche, data.experience);
      const firstTip: DailyTip = {
        tipId: generateTipId(),
        content: tipData.content,
        niche: data.niche,
        actionItems: tipData.actionItems,
        generatedAt: new Date(),
        difficulty: data.experience
      };

      setUser(newUser);
      setCurrentTip(firstTip);
      
      // Save to localStorage
      localStorage.setItem('sovet_user', JSON.stringify(newUser));
      localStorage.setItem('sovet_current_tip', JSON.stringify(firstTip));
      localStorage.setItem('sovet_completed_today', 'false');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAction = () => {
    setIsCompleted(true);
    
    // Update stats
    const newStats = {
      ...stats,
      currentStreak: stats.currentStreak + 1,
      longestStreak: Math.max(stats.longestStreak, stats.currentStreak + 1),
      totalTipsCompleted: stats.totalTipsCompleted + 1,
      weeklyProgress: Math.min(stats.weeklyProgress + 1, 7)
    };
    
    setStats(newStats);
    
    // Save to localStorage
    localStorage.setItem('sovet_completed_today', 'true');
    localStorage.setItem('sovet_stats', JSON.stringify(newStats));
  };

  const handleGetNewTip = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const tipData = await generatePersonalizedTip(user.statedGoal, user.niche, 'intermediate');
      const newTip: DailyTip = {
        tipId: generateTipId(),
        content: tipData.content,
        niche: user.niche,
        actionItems: tipData.actionItems,
        generatedAt: new Date(),
        difficulty: 'intermediate'
      };

      setCurrentTip(newTip);
      setIsCompleted(false);
      
      localStorage.setItem('sovet_current_tip', JSON.stringify(newTip));
      localStorage.setItem('sovet_completed_today', 'false');
    } catch (error) {
      console.error('Error generating new tip:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show onboarding if user hasn't completed it
  if (!user || !user.onboardingComplete) {
    return (
      <AppShell title="Welcome to Совет Дня">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Совет Дня</h1>
            <p className="text-text-secondary">Your daily dose of personalized, niche-specific wisdom to achieve your goals.</p>
          </div>

          <OnboardingForm onComplete={handleOnboardingComplete} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Greeting Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {getGreeting()}! 👋
          </h2>
          <p className="text-text-secondary">
            Ready for today's wisdom to help you achieve: <span className="text-accent font-medium">"{user.statedGoal}"</span>
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="glass-card p-4 rounded-lg">
          <Wallet>
            <ConnectWallet>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8" />
                <div>
                  <Name className="font-medium text-text-primary" />
                  <p className="text-sm text-text-secondary">Connected to Base</p>
                </div>
              </div>
            </ConnectWallet>
          </Wallet>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker stats={stats} variant="simple" />

        {/* Daily Tip */}
        {currentTip && (
          <TipCard
            tip={currentTip}
            isCompleted={isCompleted}
            onComplete={handleCompleteAction}
          />
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {isCompleted && (
            <div className="glass-card p-4 rounded-lg text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">Great job! 🎉</h3>
              <p className="text-sm text-text-secondary mb-4">
                You've completed today's action. Keep up the momentum!
              </p>
              <ActionButton
                onClick={handleGetNewTip}
                loading={loading}
                variant="secondary"
                className="w-full"
              >
                <Sparkles className="w-5 h-5" />
                Get Bonus Tip
              </ActionButton>
            </div>
          )}

          <ActionButton
            onClick={() => window.location.href = '/progress'}
            variant="secondary"
            className="w-full"
          >
            <Calendar className="w-5 h-5" />
            View Full Progress
          </ActionButton>
        </div>

        {/* Footer */}
        <div className="text-center pt-6">
          <p className="text-xs text-text-secondary">
            Powered by Base • Built with ❤️ for your success
          </p>
        </div>
      </div>
    </AppShell>
  );
}
