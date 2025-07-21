"use client";

import { useCallback } from 'react';
import { useCelebration } from '@/components/progress-celebration';
import { Achievement, Milestone } from '@/lib/goals';
import { Habit } from '@/lib/storage';

export function useMilestoneCelebrations() {
  const { showCelebration } = useCelebration();

  const celebrateAchievement = useCallback((achievement: Achievement, habit?: Habit) => {
    showCelebration('achievement', {
      achievement,
      habitName: habit?.name,
      habitColor: habit?.color
    });
  }, [showCelebration]);

  const celebrateMilestone = useCallback((milestone: Milestone, habit?: Habit) => {
    showCelebration('milestone', {
      milestone,
      habitName: habit?.name,
      habitColor: habit?.color
    });
  }, [showCelebration]);

  const celebrateStreak = useCallback((streak: number, habit?: Habit) => {
    // Only celebrate significant streaks
    if (streak >= 7 && (streak % 7 === 0 || [21, 30, 50, 100].includes(streak))) {
      showCelebration('streak', {
        streak,
        habitName: habit?.name,
        habitColor: habit?.color
      });
    }
  }, [showCelebration]);

  const celebrateGoal = useCallback((goalName: string, habit?: Habit) => {
    showCelebration('goal', {
      goalName,
      habitName: habit?.name,
      habitColor: habit?.color
    });
  }, [showCelebration]);

  return {
    celebrateAchievement,
    celebrateMilestone,
    celebrateStreak,
    celebrateGoal
  };
}