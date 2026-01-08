import { WeekModule } from '@/types';
import { formatDate } from './utils';

export interface WeeklyCompletion {
  week: string;
  completed: number;
  total: number;
}

export interface StreakData {
  date: string;
  streak: number;
}

export interface RevisionData {
  date: string;
  revisions: number;
}

/**
 * Calculate topics completed per week
 */
export function getWeeklyCompletion(modules: WeekModule[]): WeeklyCompletion[] {
  return modules.map(module => {
    const completed = module.topics.filter(t => t.completed).length;
    return {
      week: `Week ${module.id}`,
      completed,
      total: module.topics.length
    };
  });
}

/**
 * Calculate streak history over time
 */
export function getStreakHistory(modules: WeekModule[]): StreakData[] {
  // Collect all completion dates
  const completionDates = new Set<string>();
  
  modules.forEach(m => {
    m.topics.forEach(t => {
      if (t.completed && t.completedAt) {
        const dateStr = t.completedAt.split('T')[0];
        completionDates.add(dateStr);
      }
    });
  });

  if (completionDates.size === 0) return [];

  // Get last 30 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  // Calculate streak for each day
  const streakHistory: StreakData[] = [];
  let currentStreak = 0;
  const todayStr = formatDate(new Date());
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = formatDate(d);
    
    if (completionDates.has(dateStr)) {
      currentStreak++;
    } else {
      // Break streak if no activity (except today)
      if (dateStr !== todayStr) {
        currentStreak = 0;
      }
    }
    
    streakHistory.push({
      date: dateStr,
      streak: currentStreak
    });
  }
  
  return streakHistory;
}

/**
 * Calculate revision frequency (topics completed per day)
 */
export function getRevisionFrequency(modules: WeekModule[]): RevisionData[] {
  const revisionMap = new Map<string, number>();
  
  modules.forEach(m => {
    m.topics.forEach(t => {
      if (t.completed && t.completedAt) {
        const dateStr = t.completedAt.split('T')[0];
        revisionMap.set(dateStr, (revisionMap.get(dateStr) || 0) + 1);
      }
    });
  });

  if (revisionMap.size === 0) return [];

  // Get date range (last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  const revisionData: RevisionData[] = [];
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = formatDate(d);
    revisionData.push({
      date: dateStr,
      revisions: revisionMap.get(dateStr) || 0
    });
  }
  
  return revisionData;
}
