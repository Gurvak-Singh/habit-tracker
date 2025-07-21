"use client"

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface AddHabitButtonProps {
  onClick: () => void
}

export const AddHabitButton = memo(function AddHabitButton({ onClick }: AddHabitButtonProps) {
  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[280px]">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
          <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Add New Habit</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          Create a new habit to track your progress
        </p>
      </CardContent>
    </Card>
  )
});
