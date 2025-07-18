import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CalendarHeatmapProps {
  data: number[][] // 6 weeks x 7 days, values 0-4 representing intensity
  month: string
}

export function CalendarHeatmap({ data, month }: CalendarHeatmapProps) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getIntensityColor = (intensity: number) => {
    const colors = [
      "bg-slate-100 dark:bg-slate-800", // 0 - no activity
      "bg-blue-200 dark:bg-blue-900", // 1 - low
      "bg-blue-400 dark:bg-blue-700", // 2 - medium
      "bg-blue-600 dark:bg-blue-500", // 3 - high
      "bg-blue-800 dark:bg-blue-400", // 4 - very high
    ]
    return colors[intensity] || colors[0]
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">{month} Activity</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-300">Daily habit completion intensity</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="space-y-1">
            {data.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((intensity, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-8 h-8 rounded-sm ${getIntensityColor(intensity)} border border-slate-200 dark:border-slate-600 hover:ring-2 hover:ring-blue-400 transition-all duration-200 cursor-pointer`}
                    title={`Intensity: ${intensity}/4`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400">Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map((intensity) => (
                <div
                  key={intensity}
                  className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)} border border-slate-200 dark:border-slate-600`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
