export interface Goal {
  id: string;
  type: GoalType;
  targetValue: number;
  targetUnit: string;
  deadline?: string; // ISO date string
  description?: string;
  isCompleted: boolean;
  completedAt?: number; // timestamp
  createdAt: number;
}

export interface Milestone {
  id: string;
  habitId: string;
  type: MilestoneType;
  title: string;
  description: string;
  targetValue: number;
  targetUnit: string;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: number;
  createdAt: number;
  badgeId?: string; // Associated achievement badge
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeIcon: string;
  badgeColor: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number;
  habitId?: string; // If habit-specific
}

export type GoalType = 
  | 'streak_target'      // "Maintain a 30-day streak"
  | 'completion_count'   // "Complete 100 times total"
  | 'consistency_rate'   // "Achieve 80% consistency this month"
  | 'time_target'        // "Do this for 6 months"
  | 'weekly_target'      // "Complete 5 times per week for 4 weeks"
  | 'custom';            // User-defined goal

export type MilestoneType = 
  | 'first_completion'   // First time completing the habit
  | 'streak_milestone'   // 3, 7, 14, 21, 30, 50, 100 day streaks
  | 'completion_milestone' // 10, 50, 100, 500, 1000 completions
  | 'consistency_milestone' // 80%, 90%, 95% consistency over period
  | 'time_milestone'     // 1 week, 1 month, 3 months, 6 months, 1 year
  | 'perfect_week'       // Complete all scheduled days in a week
  | 'perfect_month'      // Complete all scheduled days in a month
  | 'comeback_milestone' // Return after missing days
  | 'improvement_milestone'; // Improvement in performance

// Predefined milestone templates
export const MILESTONE_TEMPLATES: Omit<Milestone, 'id' | 'habitId' | 'currentValue' | 'isCompleted' | 'completedAt' | 'createdAt'>[] = [
  // Streak milestones
  {
    type: 'first_completion',
    title: 'First Steps',
    description: 'Complete your habit for the first time',
    targetValue: 1,
    targetUnit: 'completion',
    badgeId: 'first_steps'
  },
  {
    type: 'streak_milestone',
    title: 'Building Momentum',
    description: 'Maintain a 3-day streak',
    targetValue: 3,
    targetUnit: 'days',
    badgeId: 'momentum_builder'
  },
  {
    type: 'streak_milestone',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    targetValue: 7,
    targetUnit: 'days',
    badgeId: 'week_warrior'
  },
  {
    type: 'streak_milestone',
    title: 'Habit Hero',
    description: 'Maintain a 21-day streak',
    targetValue: 21,
    targetUnit: 'days',
    badgeId: 'habit_hero'
  },
  {
    type: 'streak_milestone',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    targetValue: 30,
    targetUnit: 'days',
    badgeId: 'monthly_master'
  },
  {
    type: 'streak_milestone',
    title: 'Streak Legend',
    description: 'Maintain a 100-day streak',
    targetValue: 100,
    targetUnit: 'days',
    badgeId: 'streak_legend'
  },
  
  // Completion milestones
  {
    type: 'completion_milestone',
    title: 'Getting Started',
    description: 'Complete your habit 10 times',
    targetValue: 10,
    targetUnit: 'completions',
    badgeId: 'getting_started'
  },
  {
    type: 'completion_milestone',
    title: 'Half Century',
    description: 'Complete your habit 50 times',
    targetValue: 50,
    targetUnit: 'completions',
    badgeId: 'half_century'
  },
  {
    type: 'completion_milestone',
    title: 'Century Club',
    description: 'Complete your habit 100 times',
    targetValue: 100,
    targetUnit: 'completions',
    badgeId: 'century_club'
  },
  
  // Consistency milestones
  {
    type: 'consistency_milestone',
    title: 'Reliable Performer',
    description: 'Achieve 80% consistency for a month',
    targetValue: 80,
    targetUnit: 'percentage',
    badgeId: 'reliable_performer'
  },
  {
    type: 'consistency_milestone',
    title: 'Excellence Achiever',
    description: 'Achieve 90% consistency for a month',
    targetValue: 90,
    targetUnit: 'percentage',
    badgeId: 'excellence_achiever'
  },
  {
    type: 'perfect_week',
    title: 'Perfect Week',
    description: 'Complete all scheduled days in a week',
    targetValue: 1,
    targetUnit: 'week',
    badgeId: 'perfect_week'
  },
  {
    type: 'perfect_month',
    title: 'Perfect Month',
    description: 'Complete all scheduled days in a month',
    targetValue: 1,
    targetUnit: 'month',
    badgeId: 'perfect_month'
  }
];

// Achievement badge definitions
export const ACHIEVEMENT_BADGES: Record<string, Omit<Achievement, 'id' | 'unlockedAt' | 'habitId'>> = {
  first_steps: {
    title: 'First Steps',
    description: 'Completed your habit for the first time',
    badgeIcon: 'Play',
    badgeColor: '#10B981',
    rarity: 'common'
  },
  momentum_builder: {
    title: 'Momentum Builder',
    description: 'Built a 3-day streak',
    badgeIcon: 'TrendingUp',
    badgeColor: '#3B82F6',
    rarity: 'common'
  },
  week_warrior: {
    title: 'Week Warrior',
    description: 'Maintained a full week streak',
    badgeIcon: 'Calendar',
    badgeColor: '#8B5CF6',
    rarity: 'rare'
  },
  habit_hero: {
    title: 'Habit Hero',
    description: 'Achieved the magic 21-day streak',
    badgeIcon: 'Shield',
    badgeColor: '#F59E0B',
    rarity: 'epic'
  },
  monthly_master: {
    title: 'Monthly Master',
    description: 'Completed a full month streak',
    badgeIcon: 'Crown',
    badgeColor: '#EF4444',
    rarity: 'epic'
  },
  streak_legend: {
    title: 'Streak Legend',
    description: 'Achieved an incredible 100-day streak',
    badgeIcon: 'Trophy',
    badgeColor: '#F97316',
    rarity: 'legendary'
  },
  getting_started: {
    title: 'Getting Started',
    description: 'Reached 10 total completions',
    badgeIcon: 'Target',
    badgeColor: '#06B6D4',
    rarity: 'common'
  },
  half_century: {
    title: 'Half Century',
    description: 'Reached 50 total completions',
    badgeIcon: 'Star',
    badgeColor: '#8B5CF6',
    rarity: 'rare'
  },
  century_club: {
    title: 'Century Club',
    description: 'Reached 100 total completions',
    badgeIcon: 'Award',
    badgeColor: '#F59E0B',
    rarity: 'epic'
  },
  reliable_performer: {
    title: 'Reliable Performer',
    description: 'Maintained 80% consistency',
    badgeIcon: 'CheckCircle',
    badgeColor: '#10B981',
    rarity: 'rare'
  },
  excellence_achiever: {
    title: 'Excellence Achiever',
    description: 'Maintained 90% consistency',
    badgeIcon: 'Gem',
    badgeColor: '#8B5CF6',
    rarity: 'epic'
  },
  perfect_week: {
    title: 'Perfect Week',
    description: 'Completed every scheduled day in a week',
    badgeIcon: 'Calendar',
    badgeColor: '#3B82F6',
    rarity: 'rare'
  },
  perfect_month: {
    title: 'Perfect Month',
    description: 'Completed every scheduled day in a month',
    badgeIcon: 'CalendarDays',
    badgeColor: '#F59E0B',
    rarity: 'legendary'
  }
};

// Goal templates for common goal types
export const GOAL_TEMPLATES: Omit<Goal, 'id' | 'isCompleted' | 'completedAt' | 'createdAt'>[] = [
  {
    type: 'streak_target',
    targetValue: 21,
    targetUnit: 'days',
    description: 'Build a habit-forming 21-day streak'
  },
  {
    type: 'streak_target',
    targetValue: 30,
    targetUnit: 'days',
    description: 'Complete a full month without missing a day'
  },
  {
    type: 'streak_target',
    targetValue: 100,
    targetUnit: 'days',
    description: 'Achieve the legendary 100-day streak'
  },
  {
    type: 'completion_count',
    targetValue: 50,
    targetUnit: 'completions',
    description: 'Reach 50 total habit completions'
  },
  {
    type: 'completion_count',
    targetValue: 100,
    targetUnit: 'completions',
    description: 'Join the century club with 100 completions'
  },
  {
    type: 'consistency_rate',
    targetValue: 80,
    targetUnit: 'percentage',
    description: 'Maintain 80% consistency for 30 days'
  },
  {
    type: 'weekly_target',
    targetValue: 4,
    targetUnit: 'weeks',
    description: 'Complete weekly goal for 4 consecutive weeks'
  }
];

// Utility functions
export const generateGoalId = (): string => {
  return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateMilestoneId = (): string => {
  return `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateAchievementId = (): string => {
  return `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Progress calculation functions
export const calculateGoalProgress = (goal: Goal, habitStats: { 
  streak: number; 
  completionCount: number; 
  consistencyRate: number; 
  weeklyCompletions: number; 
}): number => {
  switch (goal.type) {
    case 'streak_target':
      return Math.min(100, (habitStats.streak / goal.targetValue) * 100);
    case 'completion_count':
      return Math.min(100, (habitStats.completionCount / goal.targetValue) * 100);
    case 'consistency_rate':
      return Math.min(100, (habitStats.consistencyRate / goal.targetValue) * 100);
    case 'weekly_target':
      return Math.min(100, (habitStats.weeklyCompletions / goal.targetValue) * 100);
    default:
      return 0;
  }
};

export const checkMilestoneCompletion = (milestone: Milestone, habitStats: { 
  streak: number; 
  completionCount: number; 
  consistencyRate: number;
  perfectWeeks: number;
  perfectMonths: number;
}): boolean => {
  switch (milestone.type) {
    case 'first_completion':
      return habitStats.completionCount >= 1;
    case 'streak_milestone':
      return habitStats.streak >= milestone.targetValue;
    case 'completion_milestone':
      return habitStats.completionCount >= milestone.targetValue;
    case 'consistency_milestone':
      return habitStats.consistencyRate >= milestone.targetValue;
    case 'perfect_week':
      return habitStats.perfectWeeks >= milestone.targetValue;
    case 'perfect_month':
      return habitStats.perfectMonths >= milestone.targetValue;
    default:
      return false;
  }
};