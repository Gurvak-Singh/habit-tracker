"use client"

import { StatsCard } from "@/components/stats-card"
import { CalendarHeatmap } from "@/components/calendar-heatmap"
import { TrendChart } from "@/components/trend-chart"
import { HabitProgressList } from "@/components/habit-progress-list"
import {
  TrendingUp,
  CheckCircle,
  Target,
  Activity,
  BookOpen,
  Dumbbell,
  Droplets,
  Moon,
  Apple,
  Coffee,
  Calendar,
  ArrowLeft,
  CreditCard,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

// Sample data for analytics
const statsData = [
  {
    title: "Longest Streak",
    value: "21 days",
    subtitle: "Morning coffee ritual",
    icon: TrendingUp,
    trend: { value: 15, isPositive: true },
  },
  {
    title: "Total Completed",
    value: "847",
    subtitle: "All time completions",
    icon: CheckCircle,
    trend: { value: 23, isPositive: true },
  },
  {
    title: "Success Rate",
    value: "78%",
    subtitle: "This month average",
    icon: Target,
    trend: { value: 5, isPositive: true },
  },
  {
    title: "Active Habits",
    value: "6",
    subtitle: "Currently tracking",
    icon: Activity,
    trend: { value: 0, isPositive: true },
  },
]

// Sample heatmap data (6 weeks x 7 days)
const heatmapData = [
  [2, 3, 1, 4, 2, 0, 1],
  [3, 4, 2, 3, 4, 2, 3],
  [1, 2, 4, 1, 3, 4, 2],
  [4, 3, 2, 4, 1, 3, 4],
  [2, 4, 3, 2, 4, 1, 3],
  [3, 1, 4, 3, 2, 4, 0],
]

// Sample trend data
const trendData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    completions: Math.floor(Math.random() * 6) + 1,
    percentage: Math.floor(Math.random() * 40) + 60,
  }
})

// Sample habit progress data
const habitProgressData = [
  {
    id: "1",
    name: "Morning coffee ritual",
    icon: Coffee,
    completionRate: 95,
    totalDays: 30,
    completedDays: 29,
    streak: 21,
  },
  {
    id: "2",
    name: "Eat healthy",
    icon: Apple,
    completionRate: 87,
    totalDays: 30,
    completedDays: 26,
    streak: 15,
  },
  {
    id: "3",
    name: "Read 30 minutes",
    icon: BookOpen,
    completionRate: 80,
    totalDays: 30,
    completedDays: 24,
    streak: 12,
  },
  {
    id: "4",
    name: "Drink 8 glasses of water",
    icon: Droplets,
    completionRate: 73,
    totalDays: 30,
    completedDays: 22,
    streak: 5,
  },
  {
    id: "5",
    name: "Exercise",
    icon: Dumbbell,
    completionRate: 67,
    totalDays: 30,
    completedDays: 20,
    streak: 7,
  },
  {
    id: "6",
    name: "Sleep 8 hours",
    icon: Moon,
    completionRate: 43,
    totalDays: 30,
    completedDays: 13,
    streak: 3,
  },
]

export default function AnalyticsPage() {
  const currentMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })

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
                <span className="text-xl font-bold text-slate-900 dark:text-white">Analytics</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/habit-cards">
                <Button variant="outline" size="sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Habit Cards
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Habit Analytics</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Track your progress and discover insights about your habits
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Calendar Heatmap */}
          <CalendarHeatmap data={heatmapData} month={currentMonth} />

          {/* Trend Chart */}
          <TrendChart data={trendData} />
        </div>

        {/* Habit Progress List */}
        <div className="mb-8">
          <HabitProgressList habits={habitProgressData} />
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Best Day</h3>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Sunday</div>
            <p className="text-sm text-slate-600 dark:text-slate-300">You complete 85% of your habits on Sundays</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Improvement</h3>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">+12%</div>
            <p className="text-sm text-slate-600 dark:text-slate-300">Better than last month's performance</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Focus Area</h3>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">Sleep</div>
            <p className="text-sm text-slate-600 dark:text-slate-300">Needs the most attention this month</p>
          </div>
        </div>
      </div>
    </div>
  )
}
