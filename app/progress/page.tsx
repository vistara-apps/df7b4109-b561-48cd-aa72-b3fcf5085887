'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '../components/AppShell';
import { ProgressTracker } from '../components/ProgressTracker';
import { ActionButton } from '../components/ActionButton';
import { ProgressStats } from '@/lib/types';
import { ArrowLeft, Calendar, Target, Award, TrendingUp } from 'lucide-react';

export default function ProgressPage() {
  const [stats, setStats] = useState<ProgressStats>({
    currentStreak: 3,
    longestStreak: 7,
    totalTipsCompleted: 15,
    weeklyProgress: 5
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('sovet_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const weeklyData = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: false },
    { day: 'Sun', completed: false },
  ];

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
                  {day.completed ? '✓' : index + 1}
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
            <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">First Steps</h4>
                <p className="text-sm text-text-secondary">Completed your first daily tip</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">Consistency Builder</h4>
                <p className="text-sm text-text-secondary">Maintained a 3-day streak</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-surface rounded-lg opacity-50">
              <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-text-secondary" />
              </div>
              <div>
                <h4 className="font-medium text-text-secondary">Week Warrior</h4>
                <p className="text-sm text-text-secondary">Complete 7 days in a row (2 more to go!)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="glass-card p-6 rounded-lg text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Keep Going! 🚀</h3>
          <p className="text-text-secondary">
            You're building great habits. Small consistent actions lead to big results.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
