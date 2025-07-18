"use client"

import { useState } from "react"
import { HabitCard } from "@/components/habit-card"
import { BookOpen, Dumbbell, Droplets, Moon, Apple, Coffee, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Sample habit data
const initialHabits = [
  {
    id: "1",
    name: "Read 30 minutes",
    icon: BookOpen,
    streak: 12,
    completionPercentage: 85,
    isCompleted: true,
    totalDays: 30,
    completedDays: 25,
    bestStreak: 18,
    weeklyGoal: 7,
  },
  {
    id: "2",
    name: "Exercise",
    icon: Dumbbell,
    streak: 7,
    completionPercentage: 60,
    isCompleted: false,
    totalDays: 30,
    completedDays: 18,
    bestStreak: 14,
    weeklyGoal: 5,
  },
  {
    id: "3",
    name: "Drink 8 glasses of water",
    icon: Droplets,
    streak: 5,
    completionPercentage: 75,
    isCompleted: true,
    totalDays: 30,
    completedDays: 22,
    bestStreak: 12,
    weeklyGoal: 7,
  },
  {
    id: "4",
    name: "Sleep 8 hours",
    icon: Moon,
    streak: 0,
    completionPercentage: 40,
    isCompleted: false,
    totalDays: 30,
    completedDays: 12,
    bestStreak: 8,
    weeklyGoal: 7,
  },
  {
    id: "5",
    name: "Eat healthy meals",
    icon: Apple,
    streak: 15,
    completionPercentage: 90,
    isCompleted: true,
    totalDays: 30,
    completedDays: 27,
    bestStreak: 20,
    weeklyGoal: 6,
  },
  {
    id: "6",
    name: "Morning coffee ritual",
    icon: Coffee,
    streak: 21,
    completionPercentage: 95,
    isCompleted: true,
    totalDays: 30,
    completedDays: 29,
    bestStreak: 25,
    weeklyGoal: 7,
  },
]

export default function HabitCardsPage() {
  const [habits, setHabits] = useState(initialHabits)

  const handleToggleComplete = (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === habitId) {
          const newIsCompleted = !habit.isCompleted
          const newCompletedDays = newIsCompleted ? habit.completedDays + 1 : Math.max(0, habit.completedDays - 1)
          const newStreak = newIsCompleted ? habit.streak + 1 : 0
          const newCompletionPercentage = Math.round((newCompletedDays / habit.totalDays) * 100)

          return {
            ...habit,
            isCompleted: newIsCompleted,
            completedDays: newCompletedDays,
            streak: newStreak,
            completionPercentage: newCompletionPercentage,
            bestStreak: Math.max(habit.bestStreak, newStreak),
          }
        }
        return habit
      }),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-xl font-bold text-slate-900 dark:text-white">Habit Cards</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Interactive Habit Cards</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Click on any card to expand and see detailed progress information
          </p>
        </div>

        {/* Habit Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {habits.map((habit) => (
            <HabitCard key={habit.id} {...habit} onToggleComplete={handleToggleComplete} />
          ))}
        </div>

        {/* Usage Instructions */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-300">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">✅ Mark Complete</h3>
              <p>Click the checkbox to mark a habit as completed for today. This updates your streak and progress.</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">📊 View Progress</h3>
              <p>The circular progress ring shows your monthly completion percentage at a glance.</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">🔥 Track Streaks</h3>
              <p>The flame icon shows your current streak. Keep it burning by completing habits daily!</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">📈 Expand Details</h3>
              <p>Click anywhere on the card to expand and see detailed statistics and progress bars.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
