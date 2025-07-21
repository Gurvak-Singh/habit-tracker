"use client";

import React, { memo } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CircularProgressRing } from "./circular-progress-ring";
import Link from "next/link";
import {
  Flame,
  Calendar,
  TrendingUp,
  Target,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from "lucide-react";

interface HabitCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  streak: number;
  completionPercentage: number;
  isCompleted: boolean;
  totalDays?: number;
  completedDays?: number;
  bestStreak?: number;
  weeklyGoal?: number;
  onToggleComplete: (id: string) => void;
  onEdit?: (habitId: string) => void;
  color?: string;
  className?: string;
}

export const HabitCard = memo(function HabitCard({
  id,
  name,
  icon: Icon,
  streak,
  completionPercentage,
  isCompleted,
  totalDays = 30,
  completedDays = 0,
  bestStreak = 0,
  weeklyGoal = 7,
  onToggleComplete,
  onEdit,
  color = "#3B82F6",
  className = "",
}: HabitCardProps) {
  const handleCheckboxChange = (checked: boolean) => {
    onToggleComplete(id);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      className={`habit-card group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${className}`}
    >
      <CardContent className="p-4">
        {/* Main Card Content */}
        <div className="flex items-center space-x-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
              style={{ 
                backgroundColor: `${color}20`, // 20% opacity
                color: color
              }}
            >
              <Icon className="w-6 h-6" style={{ color: color }} />
            </div>
          </div>

          {/* Habit Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
              {name}
            </h3>
            <div className="flex items-center space-x-3 mt-1">
              {/* Streak Counter */}
              <div className="flex items-center space-x-1">
                <Flame
                  className={`w-4 h-4 ${
                    streak > 0
                      ? "text-orange-500"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {streak} day{streak !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="flex-shrink-0">
            <CircularProgressRing
              percentage={completionPercentage}
              size={48}
              strokeWidth={4}
            />
          </div>

          {/* Checkbox */}
          <div className="flex-shrink-0" onClick={handleCheckboxClick}>
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleCheckboxChange}
              className="w-5 h-5"
              style={{
                backgroundColor: isCompleted ? color : 'transparent',
                borderColor: color
              }}
            />
          </div>
        </div>

        {/* Always show expanded details */}
        <div className="expanded-content mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 gap-4">
            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    This Month
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {completedDays}/{totalDays}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Best Streak
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {bestStreak} days
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Weekly Goal
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {Math.min(completedDays, weeklyGoal)}/{weeklyGoal}
                </span>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                  <span>Monthly Progress</span>
                  <span>{Math.round((completedDays / totalDays) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(completedDays / totalDays) * 100}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                  <span>Weekly Goal</span>
                  <span>
                    {Math.round(
                      (Math.min(completedDays, weeklyGoal) / weeklyGoal) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (Math.min(completedDays, weeklyGoal) / weeklyGoal) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4">
            <Link href="/history" className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                View History
              </Button>
            </Link>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(id);
                }}
              >
                Edit Habit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
