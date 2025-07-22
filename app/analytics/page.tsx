"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import {
  Calendar,
  Settings,
  BarChart3,
  CreditCard,
  History,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useHabits } from "@/hooks/use-habits";
import { DashboardSkeleton } from "@/components/ui/skeleton";


export default function AnalyticsPage() {
  const { habits, isLoading, error } = useHabits();

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
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  TrackMyHabits Analytics
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
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Dashboard
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
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Analytics Dashboard */}
        <AnalyticsDashboard habits={habits} />
      </div>
    </div>
  );
}
