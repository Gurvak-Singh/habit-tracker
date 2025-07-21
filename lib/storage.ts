export interface HabitCompletion {
  date: string; // YYYY-MM-DD format
  completed: boolean;
  timestamp?: number;
}

import { Goal, Milestone, Achievement } from './goals';

export interface NotificationPreference {
  id: string;
  habitId?: string; // If habit-specific
  type: 'daily_reminder' | 'streak_loss_warning' | 'milestone_celebration' | 'goal_deadline';
  enabled: boolean;
  time?: string; // HH:MM format
  days?: number[]; // 0-6 (Sunday-Saturday)
  settings: {
    sound?: boolean;
    desktop?: boolean;
    persistent?: boolean;
  };
  createdAt: number;
  updatedAt: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string; // Hex color code
  category?: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  weeklyGoal: number;
  goals?: string[]; // Goal IDs
  milestones?: string[]; // Milestone IDs
  achievements?: string[]; // Achievement IDs
  createdAt: number;
  updatedAt: number;
  completions: HabitCompletion[];
}

const STORAGE_KEY = 'trackMyHabits_data';
const STORAGE_VERSION = '1.0.0';

interface StorageData {
  version: string;
  habits: Habit[];
  goals: Goal[];
  milestones: Milestone[];
  achievements: Achievement[];
  notifications: NotificationPreference[];
  lastUpdated: number;
}

class HabitStorage {
  private getStorageData(): StorageData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      // Ensure all required arrays exist (for backward compatibility)
      return {
        version: parsed.version || STORAGE_VERSION,
        habits: parsed.habits || [],
        goals: parsed.goals || [],
        milestones: parsed.milestones || [],
        achievements: parsed.achievements || [],
        notifications: parsed.notifications || [],
        lastUpdated: parsed.lastUpdated || Date.now()
      };
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  private setStorageData(data: StorageData): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  }

  getAllHabits(): Habit[] {
    const data = this.getStorageData();
    return data?.habits || [];
  }

  getHabit(id: string): Habit | null {
    const habits = this.getAllHabits();
    return habits.find(habit => habit.id === id) || null;
  }

  saveHabit(habit: Habit): boolean {
    const habits = this.getAllHabits();
    const existingIndex = habits.findIndex(h => h.id === habit.id);
    
    const updatedHabit = {
      ...habit,
      updatedAt: Date.now()
    };

    if (existingIndex >= 0) {
      habits[existingIndex] = updatedHabit;
    } else {
      habits.push(updatedHabit);
    }

    return this.setStorageData({
      version: STORAGE_VERSION,
      habits,
      lastUpdated: Date.now()
    });
  }

  deleteHabit(id: string): boolean {
    const habits = this.getAllHabits();
    const filteredHabits = habits.filter(habit => habit.id !== id);
    
    return this.setStorageData({
      version: STORAGE_VERSION,
      habits: filteredHabits,
      lastUpdated: Date.now()
    });
  }

  updateHabitCompletion(habitId: string, date: string, completed: boolean): boolean {
    const habit = this.getHabit(habitId);
    if (!habit) return false;

    const completionIndex = habit.completions.findIndex(c => c.date === date);
    const completion: HabitCompletion = {
      date,
      completed,
      timestamp: Date.now()
    };

    if (completionIndex >= 0) {
      habit.completions[completionIndex] = completion;
    } else {
      habit.completions.push(completion);
    }

    return this.saveHabit(habit);
  }

  getHabitCompletions(habitId: string, startDate?: string, endDate?: string): HabitCompletion[] {
    const habit = this.getHabit(habitId);
    if (!habit) return [];

    let completions = habit.completions;

    if (startDate) {
      completions = completions.filter(c => c.date >= startDate);
    }

    if (endDate) {
      completions = completions.filter(c => c.date <= endDate);
    }

    return completions.sort((a, b) => a.date.localeCompare(b.date));
  }

  exportData(): string {
    const data = this.getStorageData();
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as StorageData;
      
      // Validate data structure
      if (!data.habits || !Array.isArray(data.habits)) {
        throw new Error('Invalid data format');
      }

      // Update version and timestamp
      data.version = STORAGE_VERSION;
      data.lastUpdated = Date.now();

      return this.setStorageData(data);
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  clearAllData(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  getStorageInfo(): { version: string; habitCount: number; lastUpdated: number } {
    const data = this.getStorageData();
    return {
      version: data?.version || 'unknown',
      habitCount: data?.habits?.length || 0,
      lastUpdated: data?.lastUpdated || 0
    };
  }

  // Goal management methods
  getAllGoals(): Goal[] {
    const data = this.getStorageData();
    return data?.goals || [];
  }

  getGoal(id: string): Goal | null {
    const goals = this.getAllGoals();
    return goals.find(goal => goal.id === id) || null;
  }

  getHabitGoals(habitId: string): Goal[] {
    const habit = this.getHabit(habitId);
    if (!habit?.goals) return [];
    
    const allGoals = this.getAllGoals();
    return allGoals.filter(goal => habit.goals!.includes(goal.id));
  }

  saveGoal(goal: Goal): boolean {
    const data = this.getStorageData();
    if (!data) return false;

    const existingIndex = data.goals.findIndex(g => g.id === goal.id);
    
    if (existingIndex >= 0) {
      data.goals[existingIndex] = goal;
    } else {
      data.goals.push(goal);
    }

    return this.setStorageData({
      ...data,
      lastUpdated: Date.now()
    });
  }

  deleteGoal(id: string): boolean {
    const data = this.getStorageData();
    if (!data) return false;

    data.goals = data.goals.filter(goal => goal.id !== id);
    
    return this.setStorageData({
      ...data,
      lastUpdated: Date.now()
    });
  }

  // Milestone management methods
  getAllMilestones(): Milestone[] {
    const data = this.getStorageData();
    return data?.milestones || [];
  }

  getMilestone(id: string): Milestone | null {
    const milestones = this.getAllMilestones();
    return milestones.find(milestone => milestone.id === id) || null;
  }

  getHabitMilestones(habitId: string): Milestone[] {
    const milestones = this.getAllMilestones();
    return milestones.filter(milestone => milestone.habitId === habitId);
  }

  saveMilestone(milestone: Milestone): boolean {
    const data = this.getStorageData();
    if (!data) return false;

    const existingIndex = data.milestones.findIndex(m => m.id === milestone.id);
    
    if (existingIndex >= 0) {
      data.milestones[existingIndex] = milestone;
    } else {
      data.milestones.push(milestone);
    }

    return this.setStorageData({
      ...data,
      lastUpdated: Date.now()
    });
  }

  deleteMilestone(id: string): boolean {
    const data = this.getStorageData();
    if (!data) return false;

    data.milestones = data.milestones.filter(milestone => milestone.id !== id);
    
    return this.setStorageData({
      ...data,
      lastUpdated: Date.now()
    });
  }

  // Achievement management methods
  getAllAchievements(): Achievement[] {
    const data = this.getStorageData();
    return data?.achievements || [];
  }

  getAchievement(id: string): Achievement | null {
    const achievements = this.getAllAchievements();
    return achievements.find(achievement => achievement.id === id) || null;
  }

  getHabitAchievements(habitId: string): Achievement[] {
    const achievements = this.getAllAchievements();
    return achievements.filter(achievement => achievement.habitId === habitId);
  }

  saveAchievement(achievement: Achievement): boolean {
    const data = this.getStorageData();
    if (!data) return false;

    const existingIndex = data.achievements.findIndex(a => a.id === achievement.id);
    
    if (existingIndex >= 0) {
      data.achievements[existingIndex] = achievement;
    } else {
      data.achievements.push(achievement);
    }

    return this.setStorageData({
      ...data,
      lastUpdated: Date.now()
    });
  }

  deleteAchievement(id: string): boolean {
    const data = this.getStorageData();
    if (!data) return false;

    data.achievements = data.achievements.filter(achievement => achievement.id !== id);
    
    return this.setStorageData({
      ...data,
      lastUpdated: Date.now()
    });
  }

  // Notification management methods
  getAllNotifications(): NotificationPreference[] {
    const data = this.getStorageData();
    return data?.notifications || [];
  }

  getNotification(id: string): NotificationPreference | null {
    const notifications = this.getAllNotifications();
    return notifications.find(notification => notification.id === id) || null;
  }

  getHabitNotifications(habitId: string): NotificationPreference[] {
    const notifications = this.getAllNotifications();
    return notifications.filter(notification => notification.habitId === habitId);
  }

  saveNotification(notification: NotificationPreference): boolean {
    const data = this.getStorageData();
    if (!data) return false;

    const existingIndex = data.notifications.findIndex(n => n.id === notification.id);
    
    if (existingIndex >= 0) {
      data.notifications[existingIndex] = notification;
    } else {
      data.notifications.push(notification);
    }

    return this.setStorageData({
      ...data,
      lastUpdated: Date.now()
    });
  }

  deleteNotification(id: string): boolean {
    const data = this.getStorageData();
    if (!data) return false;

    data.notifications = data.notifications.filter(notification => notification.id !== id);
    
    return this.setStorageData({
      ...data,
      lastUpdated: Date.now()
    });
  }
}

export const habitStorage = new HabitStorage();

// Utility functions
export const generateHabitId = (): string => {
  return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayDateKey = (): string => {
  return formatDateKey(new Date());
};

export const calculateStreak = (completions: HabitCompletion[]): number => {
  const today = getTodayDateKey();
  const sortedCompletions = completions
    .filter(c => c.completed)
    .sort((a, b) => b.date.localeCompare(a.date)); // Sort descending

  if (sortedCompletions.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i <= 365; i++) { // Max 365 day streak check
    const dateKey = formatDateKey(currentDate);
    const hasCompletion = sortedCompletions.some(c => c.date === dateKey);

    if (hasCompletion) {
      streak++;
    } else if (dateKey !== today || i > 0) {
      // Break streak if not completed and not today (allow missing today for ongoing streaks)
      break;
    }

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};

export const calculateCompletionPercentage = (completions: HabitCompletion[], days: number = 30): number => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);

  const relevantCompletions = completions.filter(c => {
    const completionDate = new Date(c.date);
    return completionDate >= startDate && completionDate <= endDate && c.completed;
  });

  return Math.round((relevantCompletions.length / days) * 100);
};