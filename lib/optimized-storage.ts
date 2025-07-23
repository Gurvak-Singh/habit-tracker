"use client";

import { Habit, HabitCompletion } from './storage';
import { Goal, Milestone, Achievement } from './goals';

// In-memory cache to reduce localStorage calls
class OptimizedStorageCache {
  private cache: Map<string, any> = new Map();
  private lastFetch: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5000; // 5 seconds cache

  set(key: string, value: any) {
    this.cache.set(key, JSON.parse(JSON.stringify(value))); // Deep clone
    this.lastFetch.set(key, Date.now());
  }

  get(key: string): any | null {
    const lastFetch = this.lastFetch.get(key);
    if (!lastFetch || Date.now() - lastFetch > this.CACHE_DURATION) {
      this.cache.delete(key);
      this.lastFetch.delete(key);
      return null;
    }
    return this.cache.get(key) || null;
  }

  invalidate(key?: string) {
    if (key) {
      this.cache.delete(key);
      this.lastFetch.delete(key);
    } else {
      this.cache.clear();
      this.lastFetch.clear();
    }
  }

  has(key: string): boolean {
    const lastFetch = this.lastFetch.get(key);
    return !!(lastFetch && Date.now() - lastFetch <= this.CACHE_DURATION);
  }
}

// Batch localStorage operations to improve performance
class BatchedLocalStorage {
  private pendingWrites: Map<string, any> = new Map();
  private writeTimer: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY = 100; // 100ms batch delay

  batchedWrite(key: string, value: any) {
    this.pendingWrites.set(key, value);

    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
    }

    this.writeTimer = setTimeout(() => {
      this.flushWrites();
    }, this.BATCH_DELAY);
  }

  private flushWrites() {
    for (const [key, value] of this.pendingWrites) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Failed to write to localStorage for key ${key}:`, error);
      }
    }
    this.pendingWrites.clear();
    this.writeTimer = null;
  }

  immediateWrite(key: string, value: any) {
    this.pendingWrites.delete(key); // Remove from batch if exists
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to write to localStorage for key ${key}:`, error);
    }
  }

  read(key: string): any | null {
    // Check if there's a pending write for this key
    if (this.pendingWrites.has(key)) {
      return this.pendingWrites.get(key);
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to read from localStorage for key ${key}:`, error);
      return null;
    }
  }
}

// Optimized storage class
export class OptimizedHabitStorage {
  private cache = new OptimizedStorageCache();
  private batchStorage = new BatchedLocalStorage();
  
  private readonly KEYS = {
    HABITS: 'habit_storage',
    GOALS: 'habit_goals',
    MILESTONES: 'habit_milestones', 
    ACHIEVEMENTS: 'habit_achievements'
  };

  // Optimized habit operations
  getAllHabits(): Habit[] {
    const cacheKey = this.KEYS.HABITS;
    
    let habits = this.cache.get(cacheKey);
    if (!habits) {
      habits = this.batchStorage.read(cacheKey) || [];
      this.cache.set(cacheKey, habits);
    }
    
    return habits;
  }

  getHabit(id: string): Habit | null {
    const habits = this.getAllHabits();
    return habits.find(h => h.id === id) || null;
  }

  saveHabit(habit: Habit): boolean {
    try {
      const habits = this.getAllHabits();
      const existingIndex = habits.findIndex(h => h.id === habit.id);
      
      if (existingIndex >= 0) {
        habits[existingIndex] = { ...habit, updatedAt: Date.now() };
      } else {
        habits.push(habit);
      }

      this.cache.set(this.KEYS.HABITS, habits);
      this.batchStorage.batchedWrite(this.KEYS.HABITS, habits);
      return true;
    } catch (error) {
      console.error('Failed to save habit:', error);
      return false;
    }
  }

  deleteHabit(id: string): boolean {
    try {
      const habits = this.getAllHabits();
      const filteredHabits = habits.filter(h => h.id !== id);
      
      if (filteredHabits.length === habits.length) {
        return false; // Habit not found
      }

      this.cache.set(this.KEYS.HABITS, filteredHabits);
      this.batchStorage.immediateWrite(this.KEYS.HABITS, filteredHabits);
      return true;
    } catch (error) {
      console.error('Failed to delete habit:', error);
      return false;
    }
  }

  // Bulk operations for better performance
  saveMultipleHabits(habitsToSave: Habit[]): boolean {
    try {
      const habits = this.getAllHabits();
      const habitMap = new Map(habits.map(h => [h.id, h]));
      
      habitsToSave.forEach(habit => {
        habitMap.set(habit.id, { ...habit, updatedAt: Date.now() });
      });

      const updatedHabits = Array.from(habitMap.values());
      this.cache.set(this.KEYS.HABITS, updatedHabits);
      this.batchStorage.immediateWrite(this.KEYS.HABITS, updatedHabits);
      return true;
    } catch (error) {
      console.error('Failed to save multiple habits:', error);
      return false;
    }
  }

  updateHabitCompletion(habitId: string, date: string, completed: boolean): boolean {
    try {
      const habit = this.getHabit(habitId);
      if (!habit) return false;

      const existingCompletionIndex = habit.completions.findIndex(c => c.date === date);
      const completion: HabitCompletion = {
        date,
        completed,
        timestamp: Date.now()
      };

      if (existingCompletionIndex >= 0) {
        habit.completions[existingCompletionIndex] = completion;
      } else {
        habit.completions.push(completion);
      }

      return this.saveHabit(habit);
    } catch (error) {
      console.error('Failed to update habit completion:', error);
      return false;
    }
  }

  // Goal operations with caching
  getHabitGoals(habitId: string): Goal[] {
    const goals = this.cache.get(this.KEYS.GOALS) || this.batchStorage.read(this.KEYS.GOALS) || [];
    if (!this.cache.has(this.KEYS.GOALS)) {
      this.cache.set(this.KEYS.GOALS, goals);
    }
    return goals.filter((g: Goal) => g.habitId === habitId);
  }

  saveGoal(goal: Goal): boolean {
    try {
      const goals = this.cache.get(this.KEYS.GOALS) || this.batchStorage.read(this.KEYS.GOALS) || [];
      const existingIndex = goals.findIndex((g: Goal) => g.id === goal.id);
      
      if (existingIndex >= 0) {
        goals[existingIndex] = goal;
      } else {
        goals.push(goal);
      }

      this.cache.set(this.KEYS.GOALS, goals);
      this.batchStorage.batchedWrite(this.KEYS.GOALS, goals);
      return true;
    } catch (error) {
      console.error('Failed to save goal:', error);
      return false;
    }
  }

  // Milestone operations with caching
  getHabitMilestones(habitId: string): Milestone[] {
    const milestones = this.cache.get(this.KEYS.MILESTONES) || this.batchStorage.read(this.KEYS.MILESTONES) || [];
    if (!this.cache.has(this.KEYS.MILESTONES)) {
      this.cache.set(this.KEYS.MILESTONES, milestones);
    }
    return milestones.filter((m: Milestone) => m.habitId === habitId);
  }

  saveMilestone(milestone: Milestone): boolean {
    try {
      const milestones = this.cache.get(this.KEYS.MILESTONES) || this.batchStorage.read(this.KEYS.MILESTONES) || [];
      const existingIndex = milestones.findIndex((m: Milestone) => m.id === milestone.id);
      
      if (existingIndex >= 0) {
        milestones[existingIndex] = milestone;
      } else {
        milestones.push(milestone);
      }

      this.cache.set(this.KEYS.MILESTONES, milestones);
      this.batchStorage.batchedWrite(this.KEYS.MILESTONES, milestones);
      return true;
    } catch (error) {
      console.error('Failed to save milestone:', error);
      return false;
    }
  }

  // Achievement operations
  getHabitAchievements(habitId: string): Achievement[] {
    const achievements = this.cache.get(this.KEYS.ACHIEVEMENTS) || this.batchStorage.read(this.KEYS.ACHIEVEMENTS) || [];
    if (!this.cache.has(this.KEYS.ACHIEVEMENTS)) {
      this.cache.set(this.KEYS.ACHIEVEMENTS, achievements);
    }
    return achievements.filter((a: Achievement) => a.habitId === habitId);
  }

  saveAchievement(achievement: Achievement): boolean {
    try {
      const achievements = this.cache.get(this.KEYS.ACHIEVEMENTS) || this.batchStorage.read(this.KEYS.ACHIEVEMENTS) || [];
      const existingIndex = achievements.findIndex((a: Achievement) => a.id === achievement.id);
      
      if (existingIndex >= 0) {
        achievements[existingIndex] = achievement;
      } else {
        achievements.push(achievement);
      }

      this.cache.set(this.KEYS.ACHIEVEMENTS, achievements);
      this.batchStorage.batchedWrite(this.KEYS.ACHIEVEMENTS, achievements);
      return true;
    } catch (error) {
      console.error('Failed to save achievement:', error);
      return false;
    }
  }

  // Cache management
  clearCache() {
    this.cache.invalidate();
  }

  preloadData() {
    // Preload all data into cache for faster access
    this.getAllHabits();
    this.cache.get(this.KEYS.GOALS) || this.cache.set(this.KEYS.GOALS, this.batchStorage.read(this.KEYS.GOALS) || []);
    this.cache.get(this.KEYS.MILESTONES) || this.cache.set(this.KEYS.MILESTONES, this.batchStorage.read(this.KEYS.MILESTONES) || []);
    this.cache.get(this.KEYS.ACHIEVEMENTS) || this.cache.set(this.KEYS.ACHIEVEMENTS, this.batchStorage.read(this.KEYS.ACHIEVEMENTS) || []);
  }
}

export const optimizedHabitStorage = new OptimizedHabitStorage();