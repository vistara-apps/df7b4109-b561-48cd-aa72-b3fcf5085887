'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '../components/AppShell';
import { ProgressTracker } from '../components/ProgressTracker';
import { ActionButton } from '../components/ActionButton';
import { ProgressStats, DailyProgressLog } from '@/lib/types';
import { calculateUserStats, getUserProgressLogs, getUser } from '@/lib/database';
import { ArrowLeft, Calendar, Target, Award, TrendingUp } from 'lucide-react';

export default function ProgressPage() {
  const [stats, setStats] = useState<ProgressStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalTipsCompleted: 0,
    weeklyProgress: 0
  });
  const [weeklyData, setWeeklyData] = useState<{ day: string; completed: boolean }[]>([]);
  const [recentLogs, setRecentLogs] = useState<DailyProgressLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem('sovet_user_id');
        if (!userId) {
          setLoading(false);
          return;
        }

        // Get user stats from database
        const userStats = await calculateUserStats(userId);
        setStats(userStats);

        // Get recent progress logs
        const logs = await getUserProgressLogs(userId);
        setRecentLogs(logs.slice(0, 10)); // Last 10 entries

        // Generate weekly data from logs
        const weekData = generateWeeklyData(logs);
        setWeeklyData(weekData);

      } catch (error) {
        console.error('Error loading progress data:', error);
        // Fallback to localStorage
        const savedStats = localStorage.getItem('sovet_stats');
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
        setWeeklyData([
          { day: 'Mon', completed: true },
          { day: 'Tue', completed: true },
          { day: 'Wed', completed: true },
          { day: 'Thu', completed: true },
          { day: 'Fri', completed: true },
          { day: 'Sat', completed: false },
          { day: 'Sun', completed: false },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, []);

  const generateWeeklyData = (logs: DailyProgressLog[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.loggedAt);
        return logDate.toDateString() === date.toDateString() && log.actionCompleted;
      });

      weekData.push({
        day: days[date.getDay()],
        completed: dayLogs.length > 0
      });
    }

    return weekData;
  };

  if (loading) {
    return (
      <AppShell title="Your Progress">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading your progress...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Your Progress">
      <div className="space-y-6">
        {/* Back Button */}
        <ActionButton
          onClick={() => window.history.back()}
          variant="secondary"
          className="w-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </ActionButton>

        {/* Progress Overview */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Your Journey</h2>
          <p className="text-text-secondary">Track your consistency and celebrate your wins</p>
        </div>

        {/* Detailed Progress Tracker */}
        <ProgressTracker stats={stats} variant="streaks" />

        {/* Weekly Calendar */}
        <div className="glass-card p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            This Week
          </h3>

          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day, index) => (
              <div key={index} className="text-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                  day.completed
                    ? 'bg-accent text-white'
                    : 'bg-surface border border-white/10 text-text-secondary'
                }`}>
                  {day.completed ? '✓' : day.day.charAt(0)}
                </div>
                <span className="text-xs text-text-secondary">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </h3>

          <div className="space-y-3">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              stats.totalTipsCompleted > 0 ? 'bg-accent/10' : 'bg-surface opacity-50'
            }`}>
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">First Steps</h4>
                <p className="text-sm text-text-secondary">
                  {stats.totalTipsCompleted > 0 ? 'Completed your first daily tip' : 'Complete your first daily tip'}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              stats.currentStreak >= 3 ? 'bg-primary/10' : 'bg-surface opacity-50'
            }`}>
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">Consistency Builder</h4>
                <p className="text-sm text-text-secondary">
                  {stats.currentStreak >= 3 ? 'Maintained a 3-day streak' : `Current streak: ${stats.currentStreak} days`}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              stats.longestStreak >= 7 ? 'bg-green-500/10' : 'bg-surface opacity-50'
            }`}>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">Week Warrior</h4>
                <p className="text-sm text-text-secondary">
                  {stats.longestStreak >= 7
                    ? 'Completed 7 days in a row!'
                    : `Longest streak: ${stats.longestStreak} days (${7 - stats.longestStreak} more to go!)`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentLogs.length > 0 && (
          <div className="glass-card p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </h3>

            <div className="space-y-3">
              {recentLogs.slice(0, 5).map((log) => (
                <div key={log.logId} className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {log.actionCompleted ? 'Completed daily tip' : 'Tip viewed'}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(log.loggedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {log.actionCompleted && (
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-xs text-green-400">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="glass-card p-6 rounded-lg text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {stats.currentStreak > 0 ? 'Keep Going! 🚀' : 'Start Your Journey! 🌟'}
          </h3>
          <p className="text-text-secondary">
            {stats.currentStreak > 0
              ? "You're building great habits. Small consistent actions lead to big results."
              : "Every journey begins with a single step. Start today and build momentum!"
            }
          </p>
        </div>
      </div>
    </AppShell>
  );
}
