'use client';

import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { ProgressStats } from '@/lib/types';

interface ProgressTrackerProps {
  stats: ProgressStats;
  variant?: 'simple' | 'streaks';
}

export function ProgressTracker({ stats, variant = 'simple' }: ProgressTrackerProps) {
  const progressPercentage = Math.min((stats.weeklyProgress / 7) * 100, 100);

  if (variant === 'simple') {
    return (
      <div className="metric-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Current Streak</p>
              <p className="text-xl font-bold text-text-primary">{stats.currentStreak} days</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">This Week</p>
            <p className="text-lg font-semibold text-accent">{stats.weeklyProgress}/7</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Current Streak</p>
              <p className="text-xl font-bold text-text-primary">{stats.currentStreak}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Best Streak</p>
              <p className="text-xl font-bold text-text-primary">{stats.longestStreak}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="metric-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">Weekly Progress</span>
          </div>
          <span className="text-sm text-text-secondary">{stats.weeklyProgress}/7 days</span>
        </div>
        
        <div className="w-full bg-surface rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-text-secondary">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">Total Completed</p>
            <p className="text-xl font-bold text-text-primary">{stats.totalTipsCompleted} tips</p>
          </div>
        </div>
      </div>
    </div>
  );
}
