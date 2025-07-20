"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habit-card";
import { AddHabitButton } from "@/components/add-habit-button";
import {
  BookOpen,
  Dumbbell,
  Droplets,
  Moon,
  Apple,
  Coffee,
  Calendar,
  Settings,
  BarChart3,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

// Sample habit data
const initialHabits = [
  {
    id: "1",
    name: "Read 30 minutes",
    icon: BookOpen,
    streak: 12,
    progress: 85,
    completedToday: true,
    weekData: [true, true, false, true, true, true, true],
    completedDays: 25,
    totalDays: 30,
    bestStreak: 18,
    weeklyGoal: 7,
  },
  {
    id: "2",
    name: "Exercise",
    icon: Dumbbell,
    streak: 7,
    progress: 60,
    completedToday: false,
    weekData: [true, false, true, true, false, true, true],
    completedDays: 18,
    totalDays: 30,
    bestStreak: 14,
    weeklyGoal: 5,
  },
  {
    id: "3",
    name: "Drink 8 glasses of water",
    icon: Droplets,
    streak: 5,
    progress: 75,
    completedToday: true,
    weekData: [true, true, true, false, true, true, false],
    completedDays: 22,
    totalDays: 30,
    bestStreak: 12,
    weeklyGoal: 7,
  },
  {
    id: "4",
    name: "Sleep 8 hours",
    icon: Moon,
    streak: 3,
    progress: 40,
    completedToday: false,
    weekData: [false, true, false, true, false, true, false],
    completedDays: 12,
    totalDays: 30,
    bestStreak: 8,
    weeklyGoal: 7,
  },
  {
    id: "5",
    name: "Eat healthy",
    icon: Apple,
    streak: 15,
    progress: 90,
    completedToday: true,
    weekData: [true, true, true, true, true, false, true],
    completedDays: 27,
    totalDays: 30,
    bestStreak: 20,
    weeklyGoal: 6,
  },
  {
    id: "6",
    name: "Morning coffee ritual",
    icon: Coffee,
    streak: 21,
    progress: 95,
    completedToday: true,
    weekData: [true, true, true, true, true, true, true],
    completedDays: 29,
    totalDays: 30,
    bestStreak: 25,
    weeklyGoal: 7,
  },
];

const motivationalQuotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "Small daily improvements over time lead to stunning results.",
  "Excellence is not an act, but a habit.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
];

export default function Dashboard() {
  const [habits, setHabits] = useState(initialHabits);
  const [currentQuote, setCurrentQuote] = useState("");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  useEffect(() => {
    // Set quote on client side to avoid hydration mismatch
    setCurrentQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );
  }, []);

  const handleToggleToday = (habitId: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const newCompletedToday = !habit.completedToday;
          const newWeekData = [...habit.weekData];
          newWeekData[6] = newCompletedToday; // Update today (last day in week view)

          // Update completedDays based on the toggle
          const newCompletedDays = newCompletedToday
            ? Math.min(habit.completedDays + 1, habit.totalDays)
            : Math.max(habit.completedDays - 1, 0);

          return {
            ...habit,
            completedToday: newCompletedToday,
            weekData: newWeekData,
            streak: newCompletedToday
              ? habit.streak + 1
              : Math.max(0, habit.streak - 1),
            progress: Math.min(
              100,
              newCompletedToday ? habit.progress + 10 : habit.progress
            ),
            completedDays: newCompletedDays,
            bestStreak: Math.max(
              habit.bestStreak,
              newCompletedToday ? habit.streak + 1 : habit.streak
            ),
          };
        }
        return habit;
      })
    );
  };

  const handleCardToggle = (habitId: string) => {
    setExpandedCardId((prevId) => (prevId === habitId ? null : habitId));
  };

  const handleAddHabit = () => {
    // This would open a modal in a real app
    console.log("Add new habit modal would open here");
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const completedToday = habits.filter((habit) => habit.completedToday).length;
  const totalHabits = habits.length;

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

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              id={habit.id}
              name={habit.name}
              icon={habit.icon}
              streak={habit.streak}
              completionPercentage={habit.progress}
              isCompleted={habit.completedToday}
              completedDays={habit.completedDays}
              totalDays={habit.totalDays}
              bestStreak={habit.bestStreak}
              weeklyGoal={habit.weeklyGoal}
              isExpanded={expandedCardId === habit.id}
              onToggleComplete={handleToggleToday}
              onToggle={handleCardToggle}
            />
          ))}
          <AddHabitButton onClick={handleAddHabit} />
        </div>

        {/* Weekly Summary */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Weekly Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {habits.reduce(
                  (acc, habit) => acc + habit.weekData.filter(Boolean).length,
                  0
                )}
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Total completions this week
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {Math.max(...habits.map((h) => h.streak))}
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Longest current streak
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {Math.round(
                  habits.reduce((acc, habit) => acc + habit.progress, 0) /
                    habits.length
                )}
                %
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Average completion rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
