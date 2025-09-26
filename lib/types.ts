export interface User {
  userId: string;
  statedGoal: string;
  niche: string;
  onboardingComplete: boolean;
  notificationPreferences: {
    enabled: boolean;
    time: string;
  };
  createdAt: Date;
}

export interface DailyTip {
  tipId: string;
  content: string;
  niche: string;
  actionItems: string[];
  generatedAt: Date;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface DailyProgressLog {
  logId: string;
  userId: string;
  tipId: string;
  actionCompleted: boolean;
  loggedAt: Date;
  notes?: string;
}

export interface ProgressStats {
  currentStreak: number;
  longestStreak: number;
  totalTipsCompleted: number;
  weeklyProgress: number;
}

export interface OnboardingData {
  goal: string;
  niche: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment: '5min' | '15min' | '30min';
}
