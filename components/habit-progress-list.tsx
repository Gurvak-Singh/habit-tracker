import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { LucideIcon } from "lucide-react"

interface HabitProgressItem {
  id: string
  name: string
  icon: LucideIcon
  completionRate: number
  totalDays: number
  completedDays: number
  streak: number
}

interface HabitProgressListProps {
  habits: HabitProgressItem[]
}

export function HabitProgressList({ habits }: HabitProgressListProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Habit Performance</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-300">Individual completion rates this month</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {habits.map((habit) => {
          const Icon = habit.icon
          return (
            <div key={habit.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">{habit.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {habit.completedDays}/{habit.totalDays} days • {habit.streak} day streak
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-900 dark:text-white">{habit.completionRate}%</div>
                </div>
              </div>
              <Progress value={habit.completionRate} className="h-2" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
