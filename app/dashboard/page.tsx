"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habit-card";
import { AddHabitButton } from "@/components/add-habit-button";
import {
  Calendar,
  Settings,
  BarChart3,
  CreditCard,
  History,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useHabits } from "@/hooks/use-habits";
import { useMilestoneCelebrations } from "@/hooks/use-milestone-celebrations";
import { getIconComponent } from "@/components/icon-picker";
import { Habit } from "@/lib/storage";
import { Goal } from "@/lib/goals";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCelebration } from "@/components/progress-celebration";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load heavy components
const HabitModal = lazy(() => import("@/components/habit-modal").then(mod => ({ default: mod.HabitModal })));
const ProgressCelebration = lazy(() => import("@/components/progress-celebration").then(mod => ({ default: mod.ProgressCelebration })));

const motivationalQuotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "Small daily improvements over time lead to stunning results.",
  "Excellence is not an act, but a habit.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
];

export default function Dashboard() {
  const { 
    habits, 
    isLoading, 
    error, 
    addHabit, 
    updateHabit, 
    deleteHabit, 
    toggleHabitCompletion 
  } = useHabits();
  
  const [currentQuote, setCurrentQuote] = useState("");
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  
  const { celebration, hideCelebration } = useCelebration();
  const { celebrateStreak } = useMilestoneCelebrations();

  useEffect(() => {
    // Set quote on client side to avoid hydration mismatch
    setCurrentQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );
  }, []);

  const handleToggleToday = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    const oldStreak = habit?.streak || 0;
    
    await toggleHabitCompletion(habitId);
    
    // Check for streak celebrations after toggle
    if (habit) {
      const updatedHabit = habits.find(h => h.id === habitId);
      const newStreak = updatedHabit?.streak || 0;
      
      // If streak increased, potentially celebrate
      if (newStreak > oldStreak) {
        celebrateStreak(newStreak, habit);
      }
    }
  };

  const handleAddHabit = () => {
    setModalMode("create");
    setEditingHabit(null);
    setIsHabitModalOpen(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setModalMode("edit");
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleSaveHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completions'>, goals?: Goal[]) => {
    if (modalMode === "create") {
      return await addHabit(habitData, goals);
    } else if (editingHabit) {
      return await updateHabit(editingHabit.id, habitData);
    }
    return false;
  };

  const handleDeleteHabit = async (habitId: string) => {
    console.log('Delete requested for habit:', habitId);
    await deleteHabit(habitId);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const completedToday = habits.filter((habit) => habit.isCompletedToday).length;
  const totalHabits = habits.length;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  TrackMyHabits
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/history">
                <Button variant="outline" size="sm">
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link href="/habit-cards">
                <Button variant="outline" size="sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Habit Cards
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Good morning! 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-300">{today}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {completedToday}/{totalHabits}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  habits completed today
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <p className="text-lg font-medium italic">
                  "
                  {currentQuote || "Building better habits, one day at a time."}
                  "
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => {
            const IconComponent = getIconComponent(habit.icon);
            return (
              <HabitCard
                key={habit.id}
                id={habit.id}
                name={habit.name}
                icon={IconComponent}
                streak={habit.streak}
                completionPercentage={habit.completionPercentage}
                isCompleted={habit.isCompletedToday}
                completedDays={habit.completedDaysThisMonth}
                totalDays={30}
                bestStreak={habit.bestStreak}
                weeklyGoal={habit.weeklyGoal}
                onToggleComplete={handleToggleToday}
                onEdit={() => handleEditHabit(habit)}
                color={habit.color}
                onDelete={handleDeleteHabit}
              />
            );
          })}
          <AddHabitButton onClick={handleAddHabit} />
        </div>

        {/* Weekly Summary */}
        {habits.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Weekly Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {habits.reduce((acc, habit) => acc + (habit.isCompletedToday ? 1 : 0), 0)}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Completed today
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Longest current streak
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {habits.length > 0 
                    ? Math.round(
                        habits.reduce((acc, habit) => acc + habit.completionPercentage, 0) /
                          habits.length
                      )
                    : 0
                  }%
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Average completion rate
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {habits.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No habits yet
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Create your first habit to start tracking your progress
            </p>
            <Button onClick={handleAddHabit} size="lg">
              Create Your First Habit
            </Button>
          </div>
        )}
      </div>

      {/* Habit Modal */}
      <Suspense fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <HabitModal
          isOpen={isHabitModalOpen}
          onClose={() => setIsHabitModalOpen(false)}
          onSave={handleSaveHabit}
          habit={editingHabit}
          mode={modalMode}
        />
      </Suspense>

      {/* Progress Celebrations */}
      <Suspense fallback={null}>
        <ProgressCelebration
          isVisible={celebration.isVisible}
          onClose={hideCelebration}
          type={celebration.type}
          data={celebration.data}
        />
      </Suspense>
    </div>
  );
}
