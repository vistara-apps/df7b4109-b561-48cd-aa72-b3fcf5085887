import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Доброе утро';
  if (hour < 17) return 'Добрый день';
  return 'Добрый вечер';
}

export function calculateStreak(logs: { loggedAt: Date; actionCompleted: boolean }[]): number {
  if (logs.length === 0) return 0;
  
  const sortedLogs = logs
    .filter(log => log.actionCompleted)
    .sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
  
  if (sortedLogs.length === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const log of sortedLogs) {
    const logDate = new Date(log.loggedAt);
    logDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff === streak + 1) {
      // Allow for today not being completed yet
      continue;
    } else {
      break;
    }
  }
  
  return streak;
}

export function generateTipId(): string {
  return `tip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function generatePersonalizedTip(goal: string, niche: string, experience: string): Promise<{
  content: string;
  actionItems: string[];
}> {
  // In a real app, this would call OpenAI API
  // For demo purposes, we'll use sample tips
  const sampleTips = {
    'crypto-dev': {
      beginner: {
        content: "Start with understanding blockchain fundamentals before diving into smart contracts. Today, focus on learning how Base network processes transactions.",
        actionItems: [
          "Read Base documentation's 'Getting Started' section",
          "Create a Base testnet wallet and get test ETH from faucet"
        ]
      },
      intermediate: {
        content: "Practice writing secure smart contracts by implementing common patterns. Focus on reentrancy protection and proper access controls today.",
        actionItems: [
          "Review OpenZeppelin's ReentrancyGuard implementation",
          "Write a simple contract with proper access control using Ownable"
        ]
      },
      advanced: {
        content: "Optimize your smart contracts for gas efficiency. Use assembly for critical operations and implement custom errors instead of require strings.",
        actionItems: [
          "Refactor one function in your current contract to use assembly",
          "Replace all require statements with custom errors in a contract"
        ]
      }
    },
    'public-speaking': {
      beginner: {
        content: "Build confidence by practicing your speech in front of a mirror. Focus on maintaining eye contact with your reflection and speaking clearly.",
        actionItems: [
          "Practice a 2-minute introduction about yourself in front of a mirror",
          "Record yourself speaking and note areas for improvement"
        ]
      },
      intermediate: {
        content: "Master the art of storytelling by incorporating personal anecdotes into your presentations. Stories create emotional connections with your audience.",
        actionItems: [
          "Identify 3 personal stories that relate to your expertise",
          "Practice weaving one story into your next presentation"
        ]
      },
      advanced: {
        content: "Develop your unique speaking style by studying great speakers and adapting their techniques to match your personality and message.",
        actionItems: [
          "Watch a TED talk and analyze the speaker's unique techniques",
          "Experiment with one new technique in your next presentation"
        ]
      }
    }
  };

  const nicheKey = niche as keyof typeof sampleTips;
  const experienceKey = experience as keyof typeof sampleTips[typeof nicheKey];
  
  if (sampleTips[nicheKey] && sampleTips[nicheKey][experienceKey]) {
    return sampleTips[nicheKey][experienceKey];
  }

  // Fallback generic tip
  return {
    content: `Focus on taking one small step towards your goal: "${goal}". Consistency beats perfection every time.`,
    actionItems: [
      "Identify the smallest possible action you can take today",
      "Set a 15-minute timer and work on that action"
    ]
  };
}
