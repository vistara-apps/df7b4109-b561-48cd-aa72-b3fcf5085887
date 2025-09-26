'use client';

import { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { TipCard } from './components/TipCard';
import { ProgressTracker } from './components/ProgressTracker';
import { OnboardingForm } from './components/OnboardingForm';
import { ActionButton } from './components/ActionButton';
import { PaymentModal } from './components/PaymentModal';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar, Identity } from '@coinbase/onchainkit/identity';
import { User, DailyTip, ProgressStats, OnboardingData } from '@/lib/types';
import { generatePersonalizedTip, getGreeting, generateTipId, generateUserId } from '@/lib/utils';
import {
  saveUser,
  getUser,
  saveDailyTip,
  getDailyTip,
  saveProgressLog,
  calculateUserStats,
  checkUserAccess,
  getUserByFarcasterId,
  linkFarcasterUser
} from '@/lib/database';
import { checkSubscriptionStatus } from '@/lib/payments';
import { Sparkles, Calendar, TrendingUp, Lock, Crown } from 'lucide-react';

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
  const [hasSubscription, setHasSubscription] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    type: 'single' | 'subscription';
    tipDifficulty?: 'beginner' | 'intermediate' | 'advanced';
    subscriptionType?: 'weekly' | 'monthly';
  }>({
    isOpen: false,
    type: 'single'
  });

  // Load user data from database on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Try to get user from Farcaster ID first (for frame context)
        const farcasterUser = await getUserByFarcasterId('demo_fid'); // In real app, get from frame context
        if (farcasterUser) {
          setUser(farcasterUser);
          const userStats = await calculateUserStats(farcasterUser.userId);
          setStats(userStats);
          return;
        }

        // Fallback to localStorage for demo
        const savedUserId = localStorage.getItem('sovet_user_id');
        if (savedUserId) {
          const savedUser = await getUser(savedUserId);
          if (savedUser) {
            setUser(savedUser);
            const userStats = await calculateUserStats(savedUser.userId);
            setStats(userStats);

            // Check if user has today's tip
            const today = new Date().toDateString();
            const todayTipKey = `user:${savedUser.userId}:today_tip`;
            const todayTipId = await getUserTodayTip(savedUser.userId);

            if (todayTipId) {
              const tip = await getDailyTip(todayTipId);
              if (tip) {
                setCurrentTip(tip);
                // Check if completed today
                const completedKey = `user:${savedUser.userId}:completed_today`;
                const completed = localStorage.getItem(completedKey) === 'true';
                setIsCompleted(completed);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
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
    };

    loadUserData();
  }, []);

  // Helper function to get today's tip for user
  const getUserTodayTip = async (userId: string): Promise<string | null> => {
    const today = new Date().toDateString();
    const key = `user:${userId}:today_${today}`;
    // For now, return null - we'll implement this properly later
    return localStorage.getItem(`user_${userId}_today_tip`);
  };

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

      // Save to database
      await saveUser(newUser);
      await saveDailyTip(firstTip);

      // Link to Farcaster (demo)
      await linkFarcasterUser('demo_fid', newUser.userId);

      // Store today's tip reference
      const today = new Date().toDateString();
      localStorage.setItem(`user_${newUser.userId}_today_tip`, firstTip.tipId);

      setUser(newUser);
      setCurrentTip(firstTip);
      setIsCompleted(false);

      // Update stats
      const userStats = await calculateUserStats(newUser.userId);
      setStats(userStats);

      // Fallback localStorage for demo
      localStorage.setItem('sovet_user_id', newUser.userId);
      localStorage.setItem('sovet_completed_today', 'false');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Fallback to localStorage
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

      localStorage.setItem('sovet_user', JSON.stringify(newUser));
      localStorage.setItem('sovet_current_tip', JSON.stringify(firstTip));
      localStorage.setItem('sovet_completed_today', 'false');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAction = async () => {
    if (!user || !currentTip) return;

    setIsCompleted(true);

    try {
      // Create progress log
      const progressLog = {
        logId: generateTipId(),
        userId: user.userId,
        tipId: currentTip.tipId,
        actionCompleted: true,
        loggedAt: new Date()
      };

      // Save to database
      await saveProgressLog(progressLog);

      // Update stats
      const userStats = await calculateUserStats(user.userId);
      setStats(userStats);

      // Fallback localStorage
      localStorage.setItem(`user:${user.userId}:completed_today`, 'true');
    } catch (error) {
      console.error('Error saving progress:', error);
      // Fallback to localStorage
      const newStats = {
        ...stats,
        currentStreak: stats.currentStreak + 1,
        longestStreak: Math.max(stats.longestStreak, stats.currentStreak + 1),
        totalTipsCompleted: stats.totalTipsCompleted + 1,
        weeklyProgress: Math.min(stats.weeklyProgress + 1, 7)
      };

      setStats(newStats);
      localStorage.setItem('sovet_completed_today', 'true');
      localStorage.setItem('sovet_stats', JSON.stringify(newStats));
    }
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

      // Save to database
      await saveDailyTip(newTip);

      // Store today's tip reference
      const today = new Date().toDateString();
      localStorage.setItem(`user_${user.userId}_today_tip`, newTip.tipId);

      setCurrentTip(newTip);
      setIsCompleted(false);

      // Fallback localStorage
      localStorage.setItem('sovet_current_tip', JSON.stringify(newTip));
      localStorage.setItem('sovet_completed_today', 'false');
    } catch (error) {
      console.error('Error generating new tip:', error);
      // Fallback to localStorage only
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
      } catch (fallbackError) {
        console.error('Fallback tip generation failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Payment handlers
  const handleOpenPaymentModal = (
    type: 'single' | 'subscription',
    tipDifficulty?: 'beginner' | 'intermediate' | 'advanced',
    subscriptionType?: 'weekly' | 'monthly'
  ) => {
    setPaymentModal({
      isOpen: true,
      type,
      tipDifficulty,
      subscriptionType
    });
  };

  const handlePaymentSuccess = async (txHash: string) => {
    console.log('Payment successful:', txHash);

    if (paymentModal.type === 'subscription' && paymentModal.subscriptionType) {
      // Grant subscription access
      setHasSubscription(true);
      // In a real app, this would update the database
    }

    setPaymentModal({ isOpen: false, type: 'single' });
  };

  // Check subscription status on load
  useEffect(() => {
    if (user?.userId) {
      checkSubscriptionStatus(user.userId).then((status) => {
        setHasSubscription(status.hasActiveSubscription);
      });
    }
  }, [user]);

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

        {/* Premium Features */}
        {!hasSubscription && (
          <div className="glass-card p-6 rounded-lg border border-accent/20">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">Unlock Premium Features</h3>
              <p className="text-sm text-text-secondary">Get unlimited access to personalized tips</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleOpenPaymentModal('subscription', undefined, 'monthly')}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Monthly Subscription - 0.03 ETH
              </button>

              <button
                onClick={() => handleOpenPaymentModal('subscription', undefined, 'weekly')}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Weekly Access - 0.01 ETH
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-6">
          <p className="text-xs text-text-secondary">
            Powered by Base • Built with ❤️ for your success
          </p>
        </div>
      </div>

      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, type: 'single' })}
        onSuccess={handlePaymentSuccess}
        tipDifficulty={paymentModal.tipDifficulty}
        type={paymentModal.type}
        subscriptionType={paymentModal.subscriptionType}
      />
    </AppShell>
  );
}
