import { Redis } from '@upstash/redis';
import { User, DailyTip, DailyProgressLog, ProgressStats } from './types';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// User operations
export async function saveUser(user: User): Promise<void> {
  const key = `user:${user.userId}`;
  await redis.set(key, JSON.stringify(user));
  await redis.expire(key, 60 * 60 * 24 * 365); // 1 year expiry
}

export async function getUser(userId: string): Promise<User | null> {
  const key = `user:${userId}`;
  const data = await redis.get<string>(key);
  return data ? JSON.parse(data) : null;
}

// Daily tip operations
export async function saveDailyTip(tip: DailyTip): Promise<void> {
  const key = `tip:${tip.tipId}`;
  await redis.set(key, JSON.stringify(tip));
  await redis.expire(key, 60 * 60 * 24 * 30); // 30 days expiry
}

export async function getDailyTip(tipId: string): Promise<DailyTip | null> {
  const key = `tip:${tipId}`;
  const data = await redis.get<string>(key);
  return data ? JSON.parse(data) : null;
}

// Progress log operations
export async function saveProgressLog(log: DailyProgressLog): Promise<void> {
  const key = `log:${log.logId}`;
  await redis.set(key, JSON.stringify(log));
  await redis.expire(key, 60 * 60 * 24 * 365); // 1 year expiry

  // Also add to user's progress logs set
  const userLogsKey = `user:${log.userId}:logs`;
  await redis.sadd(userLogsKey, log.logId);
  await redis.expire(userLogsKey, 60 * 60 * 24 * 365);
}

export async function getUserProgressLogs(userId: string): Promise<DailyProgressLog[]> {
  const userLogsKey = `user:${userId}:logs`;
  const logIds = await redis.smembers(userLogsKey);

  const logs: DailyProgressLog[] = [];
  for (const logId of logIds) {
    const logData = await redis.get<string>(`log:${logId}`);
    if (logData) {
      logs.push(JSON.parse(logData));
    }
  }

  return logs.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
}

// Stats calculation
export async function calculateUserStats(userId: string): Promise<ProgressStats> {
  const logs = await getUserProgressLogs(userId);

  if (logs.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalTipsCompleted: 0,
      weeklyProgress: 0
    };
  }

  const completedLogs = logs.filter(log => log.actionCompleted);
  const totalTipsCompleted = completedLogs.length;

  // Calculate current streak
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const sortedLogs = completedLogs.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());

  for (let i = 0; i < sortedLogs.length; i++) {
    const currentDate = new Date(sortedLogs[i].loggedAt);
    currentDate.setHours(0, 0, 0, 0);

    if (i === 0) {
      tempStreak = 1;
      currentStreak = 1;
    } else {
      const prevDate = new Date(sortedLogs[i - 1].loggedAt);
      prevDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        tempStreak++;
        currentStreak = Math.max(currentStreak, tempStreak);
      } else if (daysDiff === 0) {
        // Same day, continue streak
        continue;
      } else {
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
  }

  // Calculate weekly progress (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyLogs = completedLogs.filter(log => log.loggedAt >= sevenDaysAgo);
  const weeklyProgress = Math.min(weeklyLogs.length, 7);

  return {
    currentStreak,
    longestStreak,
    totalTipsCompleted,
    weeklyProgress
  };
}

// Check if user has access (for paywall)
export async function checkUserAccess(userId: string): Promise<boolean> {
  // For now, allow free access. In production, check subscription/payment status
  const accessKey = `user:${userId}:access`;
  const access = await redis.get<string>(accessKey);
  return access === 'granted' || access === null; // Default to free access
}

export async function grantUserAccess(userId: string, durationDays: number = 30): Promise<void> {
  const accessKey = `user:${userId}:access`;
  await redis.set(accessKey, 'granted');
  await redis.expire(accessKey, 60 * 60 * 24 * durationDays);
}

// Farcaster integration helpers
export async function getUserByFarcasterId(fid: string): Promise<User | null> {
  const mappingKey = `farcaster:${fid}:user`;
  const userId = await redis.get<string>(mappingKey);
  if (!userId) return null;

  return getUser(userId);
}

export async function linkFarcasterUser(fid: string, userId: string): Promise<void> {
  const mappingKey = `farcaster:${fid}:user`;
  await redis.set(mappingKey, userId);
  await redis.expire(mappingKey, 60 * 60 * 24 * 365);
}

