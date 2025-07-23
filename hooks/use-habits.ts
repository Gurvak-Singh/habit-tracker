"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Habit, 
  habitStorage, 
  generateHabitId, 
  getTodayDateKey, 
  calculateStreak, 
  calculateCompletionPercentage 
} from '@/lib/storage';
import { optimizedHabitStorage } from '@/lib/optimized-storage';
import { Goal } from '@/lib/goals';
import { milestoneTracker } from '@/lib/milestone-tracker';

export interface HabitWithStats extends Habit {
  streak: number;
  completionPercentage: number;
  isCompletedToday: boolean;
  completedDaysThisMonth: number;
  bestStreak: number;
}

interface UseHabitsReturn {
  habits: HabitWithStats[];
  isLoading: boolean;
  error: string | null;
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completions'>, goals?: Goal[]) => Promise<boolean>;
  updateHabit: (id: string, habitData: Partial<Habit>) => Promise<boolean>;
  deleteHabit: (id: string) => Promise<boolean>;
  toggleHabitCompletion: (id: string, date?: string) => Promise<boolean>;
  refreshHabits: () => void;
  exportData: () => string;
  importData: (jsonData: string) => Promise<boolean>;
  clearAllData: () => Promise<boolean>;
}

export function useHabits(): UseHabitsReturn {
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateHabitStats = useCallback((habit: Habit): HabitWithStats => {
    const today = getTodayDateKey();
    const todayCompletion = habit.completions.find(c => c.date === today);
    const isCompletedToday = todayCompletion?.completed || false;
    
    const streak = calculateStreak(habit.completions);
    const completionPercentage = calculateCompletionPercentage(habit.completions, 30);
    
    // Calculate completed days this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const completedDaysThisMonth = habit.completions.filter(c => {
      const completionDate = new Date(c.date);
      return c.completed && completionDate >= firstDayOfMonth && completionDate <= now;
    }).length;

    // Calculate best streak (simplified - could be improved with proper streak calculation)
    const allStreaks: number[] = [];
    let currentStreak = 0;
    const sortedCompletions = habit.completions
      .sort((a, b) => a.date.localeCompare(b.date));

    for (let i = 0; i < sortedCompletions.length; i++) {
      if (sortedCompletions[i].completed) {
        currentStreak++;
      } else {
        if (currentStreak > 0) {
          allStreaks.push(currentStreak);
          currentStreak = 0;
        }
      }
    }
    if (currentStreak > 0) allStreaks.push(currentStreak);
    
    const bestStreak = allStreaks.length > 0 ? Math.max(...allStreaks) : 0;

    return {
      ...habit,
      streak,
      completionPercentage,
      isCompletedToday,
      completedDaysThisMonth,
      bestStreak: Math.max(bestStreak, streak)
    };
  }, []);

  const loadHabits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Preload data for better performance
      optimizedHabitStorage.preloadData();
      
      // Use optimized storage with batching
      const storedHabits = optimizedHabitStorage.getAllHabits();
      const habitsWithStats = storedHabits.map(calculateHabitStats);
      
      setHabits(habitsWithStats);
    } catch (err) {
      setError('Failed to load habits');
      console.error('Error loading habits:', err);
    } finally {
      setIsLoading(false);
    }
  }, [calculateHabitStats]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const addHabit = useCallback(async (
    habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completions'>,
    goals?: Goal[]
  ): Promise<boolean> => {
    try {
      const habitId = generateHabitId();
      const newHabit: Habit = {
        ...habitData,
        id: habitId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        completions: []
      };

      // Initialize milestones for the new habit
      const milestoneIds = milestoneTracker.initializeHabitMilestones(habitId);
      newHabit.milestones = milestoneIds;

      // Save goals if provided
      if (goals && goals.length > 0) {
        const goalIds: string[] = [];
        goals.forEach(goal => {
          const goalWithHabitId = { ...goal, habitId };
          habitStorage.saveGoal(goalWithHabitId);
          goalIds.push(goal.id);
        });
        newHabit.goals = goalIds;
      }

      const success = optimizedHabitStorage.saveHabit(newHabit);
      
      if (success) {
        await loadHabits();
        return true;
      } else {
        setError('Failed to save habit');
        return false;
      }
    } catch (err) {
      setError('Failed to add habit');
      console.error('Error adding habit:', err);
      return false;
    }
  }, [loadHabits]);

  const updateHabit = useCallback(async (
    id: string, 
    habitData: Partial<Habit>
  ): Promise<boolean> => {
    try {
      const existingHabit = optimizedHabitStorage.getHabit(id);
      if (!existingHabit) {
        setError('Habit not found');
        return false;
      }

      const updatedHabit: Habit = {
        ...existingHabit,
        ...habitData,
        updatedAt: Date.now()
      };

      const success = optimizedHabitStorage.saveHabit(updatedHabit);
      
      if (success) {
        await loadHabits();
        return true;
      } else {
        setError('Failed to update habit');
        return false;
      }
    } catch (err) {
      setError('Failed to update habit');
      console.error('Error updating habit:', err);
      return false;
    }
  }, [loadHabits]);

  const deleteHabit = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = optimizedHabitStorage.deleteHabit(id);
      
      if (success) {
        await loadHabits();
        return true;
      } else {
        setError('Failed to delete habit');
        return false;
      }
    } catch (err) {
      setError('Failed to delete habit');
      console.error('Error deleting habit:', err);
      return false;
    }
  }, [loadHabits]);

  const toggleHabitCompletion = useCallback(async (
    id: string, 
    date: string = getTodayDateKey()
  ): Promise<boolean> => {
    try {
      const habit = optimizedHabitStorage.getHabit(id);
      if (!habit) {
        setError('Habit not found');
        return false;
      }

      const existingCompletion = habit.completions.find(c => c.date === date);
      const newCompletedState = !existingCompletion?.completed;

      const success = optimizedHabitStorage.updateHabitCompletion(id, date, newCompletedState);
      
      if (success) {
        // Check for milestone achievements after completion
        if (newCompletedState) {
          const { newAchievements, updatedMilestones } = await milestoneTracker.checkMilestones(id);
          
          // Trigger celebrations for new achievements
          if (newAchievements.length > 0) {
            // Note: In a real implementation, you'd want to trigger the celebration
            // through a context or event system. For now, we'll just log it.
            console.log('New achievements unlocked:', newAchievements);
          }
          
          if (updatedMilestones.some(m => m.isCompleted)) {
            const completedMilestones = updatedMilestones.filter(m => m.isCompleted);
            console.log('Milestones completed:', completedMilestones);
          }
        }
        
        await loadHabits();
        return true;
      } else {
        setError('Failed to update habit completion');
        return false;
      }
    } catch (err) {
      setError('Failed to toggle habit completion');
      console.error('Error toggling habit completion:', err);
      return false;
    }
  }, [loadHabits]);

  const refreshHabits = useCallback(() => {
    loadHabits();
  }, [loadHabits]);

  const exportData = useCallback((): string => {
    return habitStorage.exportData();
  }, []);

  const importData = useCallback(async (jsonData: string): Promise<boolean> => {
    try {
      const success = habitStorage.importData(jsonData);
      
      if (success) {
        await loadHabits();
        return true;
      } else {
        setError('Failed to import data');
        return false;
      }
    } catch (err) {
      setError('Failed to import data');
      console.error('Error importing data:', err);
      return false;
    }
  }, [loadHabits]);

  const clearAllData = useCallback(async (): Promise<boolean> => {
    try {
      const success = habitStorage.clearAllData();
      
      if (success) {
        await loadHabits();
        return true;
      } else {
        setError('Failed to clear data');
        return false;
      }
    } catch (err) {
      setError('Failed to clear data');
      console.error('Error clearing data:', err);
      return false;
    }
  }, [loadHabits]);

  return {
    habits,
    isLoading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    refreshHabits,
    exportData,
    importData,
    clearAllData
  };
}