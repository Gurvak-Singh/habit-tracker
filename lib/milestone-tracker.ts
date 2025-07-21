import { Habit, HabitCompletion } from './storage';
import { 
  Milestone, 
  Achievement, 
  MILESTONE_TEMPLATES, 
  ACHIEVEMENT_BADGES,
  generateMilestoneId,
  generateAchievementId,
  checkMilestoneCompletion 
} from './goals';
import { habitStorage } from './storage';
import { calculateStreak, calculateCompletionPercentage, formatDateKey } from './storage';

interface HabitStats {
  streak: number;
  completionCount: number;
  consistencyRate: number;
  perfectWeeks: number;
  perfectMonths: number;
  completedToday: boolean;
  bestStreak: number;
}

class MilestoneTracker {
  private static instance: MilestoneTracker;

  private constructor() {}

  public static getInstance(): MilestoneTracker {
    if (!MilestoneTracker.instance) {
      MilestoneTracker.instance = new MilestoneTracker();
    }
    return MilestoneTracker.instance;
  }

  // Initialize default milestones for a new habit
  initializeHabitMilestones(habitId: string): string[] {
    const milestoneIds: string[] = [];

    MILESTONE_TEMPLATES.forEach(template => {
      const milestone: Milestone = {
        id: generateMilestoneId(),
        habitId,
        ...template,
        currentValue: 0,
        isCompleted: false,
        createdAt: Date.now()
      };

      habitStorage.saveMilestone(milestone);
      milestoneIds.push(milestone.id);
    });

    return milestoneIds;
  }

  // Calculate current habit statistics
  calculateHabitStats(habit: Habit): HabitStats {
    const completedCompletions = habit.completions.filter(c => c.completed);
    const streak = calculateStreak(habit.completions);
    const consistencyRate = calculateCompletionPercentage(habit.completions, 30);
    
    // Calculate perfect weeks and months
    const perfectWeeks = this.calculatePerfectWeeks(habit);
    const perfectMonths = this.calculatePerfectMonths(habit);
    
    // Check if completed today
    const today = formatDateKey(new Date());
    const completedToday = habit.completions.some(c => c.date === today && c.completed);
    
    // Calculate best streak from completion history
    const bestStreak = this.calculateBestStreak(habit.completions);

    return {
      streak,
      completionCount: completedCompletions.length,
      consistencyRate,
      perfectWeeks,
      perfectMonths,
      completedToday,
      bestStreak
    };
  }

  private calculatePerfectWeeks(habit: Habit): number {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    let perfectWeeks = 0;
    let currentDate = new Date(oneWeekAgo);
    
    // Check last 12 weeks
    for (let week = 0; week < 12; week++) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      const weekCompletions = habit.completions.filter(c => {
        const completionDate = new Date(c.date);
        return c.completed && completionDate >= weekStart && completionDate < weekEnd;
      });
      
      // Check if all required days in the week were completed
      const requiredDays = Math.min(7, habit.weeklyGoal);
      if (weekCompletions.length >= requiredDays) {
        perfectWeeks++;
      }
      
      currentDate.setDate(currentDate.getDate() - 7);
    }
    
    return perfectWeeks;
  }

  private calculatePerfectMonths(habit: Habit): number {
    const now = new Date();
    let perfectMonths = 0;
    
    // Check last 12 months
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 0);
      
      const monthCompletions = habit.completions.filter(c => {
        const completionDate = new Date(c.date);
        return c.completed && completionDate >= monthStart && completionDate <= monthEnd;
      });
      
      // Calculate expected completions for the month
      const daysInMonth = monthEnd.getDate();
      const expectedCompletions = Math.floor((daysInMonth / 7) * habit.weeklyGoal);
      
      if (monthCompletions.length >= expectedCompletions) {
        perfectMonths++;
      }
    }
    
    return perfectMonths;
  }

  private calculateBestStreak(completions: HabitCompletion[]): number {
    const sortedCompletions = completions
      .filter(c => c.completed)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (sortedCompletions.length === 0) return 0;

    let bestStreak = 0;
    let currentStreak = 0;
    let lastDate = '';

    sortedCompletions.forEach(completion => {
      if (lastDate === '') {
        currentStreak = 1;
      } else {
        const lastDateObj = new Date(lastDate);
        const currentDateObj = new Date(completion.date);
        const diffTime = currentDateObj.getTime() - lastDateObj.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          currentStreak++;
        } else {
          bestStreak = Math.max(bestStreak, currentStreak);
          currentStreak = 1;
        }
      }
      
      lastDate = completion.date;
    });

    return Math.max(bestStreak, currentStreak);
  }

  // Check and update milestones after habit completion
  async checkMilestones(habitId: string): Promise<{ newAchievements: Achievement[], updatedMilestones: Milestone[] }> {
    const habit = habitStorage.getHabit(habitId);
    if (!habit) return { newAchievements: [], updatedMilestones: [] };

    const stats = this.calculateHabitStats(habit);
    const milestones = habitStorage.getHabitMilestones(habitId);
    
    const newAchievements: Achievement[] = [];
    const updatedMilestones: Milestone[] = [];

    for (const milestone of milestones) {
      if (milestone.isCompleted) continue;

      const isCompleted = checkMilestoneCompletion(milestone, stats);
      
      if (isCompleted) {
        // Update milestone
        milestone.isCompleted = true;
        milestone.completedAt = Date.now();
        milestone.currentValue = this.getCurrentValueForMilestone(milestone, stats);
        
        habitStorage.saveMilestone(milestone);
        updatedMilestones.push(milestone);

        // Create achievement if badgeId exists
        if (milestone.badgeId && ACHIEVEMENT_BADGES[milestone.badgeId]) {
          const badgeTemplate = ACHIEVEMENT_BADGES[milestone.badgeId];
          const achievement: Achievement = {
            id: generateAchievementId(),
            ...badgeTemplate,
            habitId,
            unlockedAt: Date.now()
          };

          habitStorage.saveAchievement(achievement);
          newAchievements.push(achievement);
        }
      } else {
        // Update current progress
        const currentValue = this.getCurrentValueForMilestone(milestone, stats);
        if (currentValue !== milestone.currentValue) {
          milestone.currentValue = currentValue;
          habitStorage.saveMilestone(milestone);
          updatedMilestones.push(milestone);
        }
      }
    }

    return { newAchievements, updatedMilestones };
  }

  private getCurrentValueForMilestone(milestone: Milestone, stats: HabitStats): number {
    switch (milestone.type) {
      case 'first_completion':
        return stats.completionCount > 0 ? 1 : 0;
      case 'streak_milestone':
        return stats.streak;
      case 'completion_milestone':
        return stats.completionCount;
      case 'consistency_milestone':
        return stats.consistencyRate;
      case 'perfect_week':
        return stats.perfectWeeks;
      case 'perfect_month':
        return stats.perfectMonths;
      default:
        return 0;
    }
  }

  // Get milestone progress for display
  getMilestoneProgress(milestone: Milestone, habit: Habit): { 
    percentage: number; 
    currentValue: number; 
    isCompleted: boolean;
    progressText: string;
  } {
    const stats = this.calculateHabitStats(habit);
    const currentValue = this.getCurrentValueForMilestone(milestone, stats);
    const percentage = Math.min(100, (currentValue / milestone.targetValue) * 100);
    
    const progressText = `${currentValue}/${milestone.targetValue} ${milestone.targetUnit}`;

    return {
      percentage,
      currentValue,
      isCompleted: milestone.isCompleted,
      progressText
    };
  }

  // Get habit achievements summary
  getHabitAchievementsSummary(habitId: string): {
    totalAchievements: number;
    byRarity: Record<string, number>;
    recentAchievements: Achievement[];
  } {
    const achievements = habitStorage.getHabitAchievements(habitId);
    
    const byRarity = achievements.reduce((acc, achievement) => {
      acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentAchievements = achievements
      .filter(a => a.unlockedAt)
      .sort((a, b) => (b.unlockedAt! - a.unlockedAt!))
      .slice(0, 3);

    return {
      totalAchievements: achievements.length,
      byRarity,
      recentAchievements
    };
  }

  // Get next milestone to achieve
  getNextMilestone(habitId: string): Milestone | null {
    const milestones = habitStorage.getHabitMilestones(habitId);
    const incompleteMilestones = milestones.filter(m => !m.isCompleted);
    
    if (incompleteMilestones.length === 0) return null;

    // Sort by progress (closest to completion first)
    const habit = habitStorage.getHabit(habitId);
    if (!habit) return null;

    const stats = this.calculateHabitStats(habit);
    
    return incompleteMilestones
      .map(milestone => ({
        milestone,
        progress: this.getCurrentValueForMilestone(milestone, stats) / milestone.targetValue
      }))
      .sort((a, b) => b.progress - a.progress)[0]?.milestone || null;
  }
}

export const milestoneTracker = MilestoneTracker.getInstance();