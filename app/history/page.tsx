"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ArrowLeft,
  Home,
  BarChart3,
  CreditCard,
  CheckCircle,
  XCircle,
  Flame,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useHabits } from "@/hooks/use-habits";
import { getIconComponent } from "@/components/icon-picker";
import { formatDateKey, calculateStreak } from "@/lib/storage";

export default function HabitHistoryPage() {
  const { habits, isLoading, toggleHabitCompletion } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    if (habits.length > 0 && !selectedHabit) {
      setSelectedHabit(habits[0].id);
    }
  }, [habits, selectedHabit]);

  useEffect(() => {
    if (!selectedMonth) {
      const now = new Date();
      setSelectedMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    }
  }, [selectedMonth]);

  const selectedHabitData = habits.find(h => h.id === selectedHabit);

  const generateCalendarData = () => {
    if (!selectedHabitData || !selectedMonth) return [];

    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const calendar = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDay || calendar.length < 42) {
      const dateKey = formatDateKey(currentDate);
      const completion = selectedHabitData.completions.find(c => c.date === dateKey);
      const isCurrentMonth = currentDate.getMonth() === month - 1;
      const isToday = dateKey === formatDateKey(new Date());
      
      calendar.push({
        date: new Date(currentDate),
        dateKey,
        completed: completion?.completed || false,
        isCurrentMonth,
        isToday,
      });

      currentDate.setDate(currentDate.getDate() + 1);
      
      if (calendar.length >= 42) break;
    }

    return calendar;
  };

  const calendarData = generateCalendarData();

  const toggleDate = async (dateKey: string) => {
    if (selectedHabit) {
      await toggleHabitCompletion(selectedHabit, dateKey);
    }
  };

  const getMonthStats = () => {
    if (!selectedHabitData || !selectedMonth) return { completed: 0, total: 0, streak: 0 };

    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    const monthCompletions = selectedHabitData.completions.filter(c => {
      const completionDate = new Date(c.date);
      return completionDate >= firstDay && completionDate <= lastDay && c.completed;
    });

    return {
      completed: monthCompletions.length,
      total: lastDay.getDate(),
      streak: calculateStreak(selectedHabitData.completions),
    };
  };

  const monthStats = getMonthStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading your habit history...</p>
        </div>
      </div>
    );
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
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  Habit History
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Habit History
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Track your habit completion history and identify patterns
          </p>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No habits to track
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Create your first habit to start tracking your history
            </p>
            <Link href="/dashboard">
              <Button size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Select Habit
                </label>
                <Select value={selectedHabit} onValueChange={setSelectedHabit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a habit" />
                  </SelectTrigger>
                  <SelectContent>
                    {habits.map((habit) => {
                      const IconComponent = getIconComponent(habit.icon);
                      return (
                        <SelectItem key={habit.id} value={habit.id}>
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-4 h-4" style={{ color: habit.color }} />
                            <span>{habit.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Select Month
                </label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const date = new Date();
                      date.setMonth(date.getMonth() - i);
                      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                      return (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedHabitData && (
              <>
                {/* Month Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Days Completed</CardDescription>
                      <CardTitle className="text-2xl flex items-center space-x-2">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <span>{monthStats.completed}/{monthStats.total}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {Math.round((monthStats.completed / monthStats.total) * 100)}% completion rate
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Current Streak</CardDescription>
                      <CardTitle className="text-2xl flex items-center space-x-2">
                        <Flame className="w-6 h-6 text-orange-500" />
                        <span>{monthStats.streak} days</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {monthStats.streak > 0 ? "Keep it going!" : "Start your streak today"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Best Streak</CardDescription>
                      <CardTitle className="text-2xl flex items-center space-x-2">
                        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <span>{selectedHabitData.bestStreak} days</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Personal record
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${selectedHabitData.color}20` }}
                      >
                        {(() => {
                          const IconComponent = getIconComponent(selectedHabitData.icon);
                          return <IconComponent className="w-5 h-5" style={{ color: selectedHabitData.color }} />;
                        })()}
                      </div>
                      <span>{selectedHabitData.name}</span>
                    </CardTitle>
                    <CardDescription>
                      Click on any day to mark it as completed or uncompleted
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Calendar Header */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-slate-600 dark:text-slate-400 py-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarData.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => toggleDate(day.dateKey)}
                          className={`
                            aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-200 hover:scale-105
                            ${day.isCurrentMonth 
                              ? 'text-slate-900 dark:text-white' 
                              : 'text-slate-400 dark:text-slate-600'
                            }
                            ${day.isToday 
                              ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-800' 
                              : ''
                            }
                            ${day.completed 
                              ? 'text-white font-medium' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                            }
                          `}
                          style={{
                            backgroundColor: day.completed ? selectedHabitData.color : 'transparent'
                          }}
                          disabled={!day.isCurrentMonth}
                        >
                          {day.date.getDate()}
                        </button>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: selectedHabitData.color }}
                        ></div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Completed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Not completed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded ring-2 ring-blue-500"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Today</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}